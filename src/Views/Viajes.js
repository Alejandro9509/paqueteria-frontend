import React, {useEffect, useState, useMemo} from "react";
import DataTable from 'react-data-table-component';
import DataTableExtensions from "react-data-table-component-extensions";
import axios from "axios";
import Cabecera from "../Components/Template/Cabecera";
import BarraLateralIzquierda from "../Components/Template/BarraLateralIzquierda";
import BarraLateralDerecha from "../Components/Template/BarraLateralDerecha";
import BasicTable from "./BasicTable";
import ExportCSV from '../Components/Template/Export';
import ExportPDF from "../Components/Template/ExportPDF";
import * as XLSX from 'xlsx';
import {useTable, useFilters, useSortBy} from 'react-table'
import {makeStyles} from "@material-ui/core/styles";
import {DataGrid} from '@material-ui/data-grid';
import Noty from 'noty';
import AgregarViaje from "./Viajes/AgregarViaje";
import FormControl from "@material-ui/core/FormControl";
import InputLabel from "@material-ui/core/InputLabel";
import Select from "@material-ui/core/Select";
import TextField from "@material-ui/core/TextField";
import {API_HEADERS, dataGridLocaleText} from "../Constants";
import $ from "jquery";
import {validarDerecho} from "../Util/Util"
import {
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    Tooltip,
    ButtonBase,
    List,
    ListItem,
    Collapse,
    ListItemText, Link, Chip, Grid
} from "@material-ui/core";
import {obtenerEstatusDocumentos} from "../Util/Contexts/EstatusContext";
import Historial from "./Viajes/Historial";
import {confirmAlert} from "react-confirm-alert";
import ActualizarDiponibilidadEquipo from "./Viajes/ActualizarDiponibilidadEquipo";
import SalidaParadas from "./Viajes/SalidaParadas";
import LlegadaParadas from "./Viajes/LlegadaParadas";
import AsignarOperador from "./Viajes/AsignarOperador";
import {
    agregarViajeSalida,
    agregarViajeLlegada,
    obetenerViajeId,
    obtenerViajes,
    obtenerXML,
    obtenerViajesByFiltro,
    obtenerCFDI,
    obtenerReporteCFDI,
    obtenerReporteCFDIViaje,
    cancelarViaje,
    validarSalidaParada,
    cancelarTrayecto,
    eliminarViaje
} from "../Util/Contexts/ViajesContext";
import ExpandLess from '@material-ui/icons/ExpandLess';
import ExpandMore from '@material-ui/icons/ExpandMore';
import {
    cancelarInformes,
    obtenerInformeFiltro, obtenerInformesId,
    obtenerInformesPorViaje,
    obtenerXMLCFDI
} from "../Util/Contexts/InformesContext";
import {getUniqueListBy} from "../Util/Util";
import DetalleInforme from "./Viajes/DetalleInforme";
import {obtenerDetalleParadasIdInformes, obtenerDetalleParadasIdViaje} from "../Util/Contexts/DetalleParadasContext";
import {obtenerSucursales} from "../Util/Contexts/SucursalContext";
import Filtros from "./Filtros/Filtros";
import {obtenerFechaFinal, obtenerFechaInicio} from "../Util/Contexts/UtileriasContext";
import PictureAsPdfIcon from '@material-ui/icons/PictureAsPdf';
import GetAppIcon from '@material-ui/icons/GetApp';
import CancelarSAT from "./SAT/CancelarSAT";
import {cancelarInformeCFDI, enviarCorreoCFDIViaje} from "../Util/Contexts/SATContext";
import EnvioCorreoDialogo from "./SAT/EnvioCorreoDialogo";
import CancelarTrayecto from "./Viajes/CancelarTrayecto";
import ReportesViajes from "./Viajes/Reportes";
import { RowingSharp } from "@material-ui/icons";
import { validarPermisos } from "../Util/Contexts/UsuarioContext";
function showSuccess(mensaje) {
    new Noty({
        type: "information",
        layout: "topCenter",
        text: mensaje,
        timeout: "3000"
    }).show()
}
function showError(mensaje) {
    new Noty({
        type: "warning",
        layout: "topCenter",
        text: mensaje,
        timeout: "8000"
    }).show()
}
const styles = {
    seleccionado: {
        backgroundColor: "#FCC88F",
    },
    noSeleccionado: {
        backgroundColor: "#FFFFFF",
    },
    disabled: {
        pointerEvents: "none",
        cursor: "default",
    },
};
const useStyles = makeStyles(styles);
window.jQuery = window.$ = $;

function Viajes() {
    const classes = useStyles();
    const [data, setData] = React.useState([])
    const [dataSucursal, setDataSucursal] = React.useState([]);
    const [indexOpen, setIndexOpen] = React.useState(-1);
    const [dataEstatusViaje, setEstatusViaje] = React.useState([]);
    const [informeSeleccionado, setInformeSeleccionado] = React.useState(null);
    const [viajeSeleccionado, setViajeSeleccionado] = React.useState(null);
    const [dataEstatusDocumento, setEstatusDocumento] = React.useState([]);
    const [state, setState] = React.useState({
        showPopUp: false,
        idViaje: 0,
        DerechoBorrar: 58,
        codigoDepartamento: "",
        descripcionDepartamento: "",
        agregar: "Agregar",
        importar: "",
        CreadoPor: localStorage.getItem("UsuarioId"),
        ModificadoPor: localStorage.getItem("UsuarioId"),
        height: window.innerHeight,
        fechaInicial: "",
        fechaFinal: "",
        sucursalListado: 0,
        estatusListado: 0,
        estatusDocumentoListado: 0,
        idEquipo: 0


    })



    function getAllEstatusDocumento() {
        obtenerEstatusDocumentos().then((respuesta) => {
            setEstatusDocumento(respuesta.data);
        });
    }

    function getAllSucursales() {
        obtenerSucursales().then((respuesta) => {
            setDataSucursal(respuesta.data);
        });
    }



    function handleEliminar(id,idEstatus) {
        var derecho;
        validarPermisos(state).then(respuesta => {
            //showSuccess(respuesta.data)

            derecho = respuesta.data;
            if (derecho == false) {
                showSuccess("El usuario no tiene derechos para realizar el proceso");
                return;
            }
        
        eliminarViaje(id,idEstatus).then(respuesta => {
           console.log(respuesta);
           getAllData();
         }).catch(err => {
           showSuccess(err)
         })
        }).catch(err => {
            showSuccess(err)
        });
        
    
    }

    function handleShowModificar(id) {
        let viaje = data.find(i => i.m_nIdViaje === id)
        if ( viaje?.m_nIdEstatusViaje === 6 || viaje?.m_nIdEstatusViaje === 10 ){
            showSuccess("No se puede editar un viaje terminado o cancelado")
            return
        }
        $('.nav-tabs li ').removeClass('active');
        $('.nav-tabs li').eq(1).addClass('active');
        $('.tab-content div ').removeClass('in show');
        $('#Agregar').addClass('in show');

        obetenerViajeId(id).then(respuesta => {
            console.log(respuesta.data)
            setState(state => {
                return {
                    ...state,
                    agregar: "Modificar",
                    edit: true,
                    idViaje: id,
                    consult: false,
                    selectViaje: respuesta.data,
                    open: true
                }
            })
        });
    }

    function handleShowConsultar(id) {
        $('.nav-tabs li ').removeClass('active');
        $('.nav-tabs li').eq(1).addClass('active');
        $('.tab-content div ').removeClass('in show');
        $('#Agregar').addClass('in show');
        obetenerViajeId(id).then(respuesta => {
            setState(state => {
                return {
                    ...state,
                    agregar: "Consultar",
                    edit: true,
                    consult: true,
                    idViaje: id,
                    selectViaje: respuesta.data,
                    open: true
                }
            })
        });
    }
    function handleShowReportes() {
        clearData()
        $('.nav-tabs li ').removeClass('active');
        $('.nav-tabs li').eq(2).addClass('active');
        $('.tab-content div ').removeClass('in show');
        $('#Imprimir').addClass('in show');

        setState(state => {
            return {
                ...state,
                openImprimir: true
            }
        })
    }
    function handleShowAgregar() {
        clearData()
        setState(state => {
            return {
                ...state,
                open: true,
            }
        })
        $('.nav-tabs li ').removeClass('active');
        $('.nav-tabs li').eq(1).addClass('active');
        $('.tab-content div ').removeClass('in show');
        $('#Agregar').addClass('in show');
    }

    const handleShowListado = (event) => {
        if (event){
            event.stopPropagation();
        }
        getAllData()
        clearData()
        $('.nav-tabs li ').removeClass('active');
        $('.nav-tabs li').eq(0).addClass('active');
        $('.tab-content div ').removeClass('in show');
        $('#Listado').addClass('in show');
    }

    function handleShowCancelar(event) {
        event.preventDefault()
        obetenerViajeId(state.idViaje).then((respuesta) => {
            setState({
                ...state,
                FolioViaje: respuesta.data.m_sFolioViaje,
                sucursalCancelacion: respuesta.data.m_sSucursal,
                fechaCancelacion: respuesta.data.m_dtFechaCancelacion ? respuesta.data.m_dtFechaCancelacion.replace(' ', 'T') : getCurrentDateTime(),
                motivoCancelacion: respuesta.data.m_sMotivoCancelacion || '',
                usuarioCancelacion: respuesta.data.m_sUsuarioCancelacion || localStorage.getItem("Usuario"),
                estatusCancelacion: respuesta.data.m_sEstatusViaje,
                sePuedeCancelar: respuesta.data.m_bSePuedeCancelar === 1,
            });

            if (respuesta.data.m_bSePuedeCancelar === 0) {
                showSuccess("Este viaje no se puede cancelar.");
            }
            $('.nav-tabs li ').removeClass('active');
            $('.nav-tabs li').eq(3).addClass('active');
            $('.tab-content div ').removeClass('in show');
            $('#Cancelar').addClass('in show');
        });
    }
    const clearData = () => {
        setState(state => {
            return {
                ...state,
                agregar: "Agregar",
                showPopUp: false,
                edit: false,
                consult: false,
                open: false,
                idViaje: 0,
                selectViaje: null
            }
        })
    }
    const getCurrentDateTime = () => {
        return `${new Date().getFullYear()}-${`${new Date().getMonth() +
        1}`.padStart(2, 0)}-${`${new Date().getDate()}`.padStart(2, 0)}T${`${new Date().getHours()}`.padStart(2, 0)}:${`${new Date().getMinutes()}`.padStart(2, 0)}`
    }

    const handleChange = (event) => {
        setState({
            ...state,
            [event.target.id]: event.target.value,
        });
    };
    const columns = React.useMemo(() => [
        {
            headerName: "Acciones",
            sortable: false, filterable: false,
            field: "",
            width: 150,
            renderCell: (row) => {
                return (
                    <div>
                        <Tooltip title="Modificar">
                            <a
                                onClick={() => (handleShowModificar(row.row.m_nIdViaje))}
                                className="btn btn-default btn-xs"
                                disabled={!validarDerecho(9101441)}><i className="fa fa-pencil-square-o"
                                                                      style={{color: "#F9A03E"}}/></a>

                        </Tooltip>
                        <Tooltip title="Consultar">
                            <a className="btn btn-default btn-xs"
                               onClick={() => (handleShowConsultar(row.row.m_nIdViaje))}
                               disabled={!validarDerecho(9101440)}><i className="fa fa-eye"
                                                                                            style={{color: "#F9A03E"}}/></a>

                        </Tooltip>

                        <Tooltip title="Eliminar">
                            <a href="#" className="btn btn-default btn-xs"
                               onClick={() => confirmAlert({
                                title: 'Confirmar Eliminar',
                                message: '¿Está seguro de eliminar viaje?',
                                buttons: [
                                    {
                                        label: 'Si',
                                        onClick: () => (handleEliminar(row.row.m_nIdViaje,row.row.m_nIdEstatusViaje))
                                    },
                                    {
                                        label: 'No',
                                    }
                                ]
                            })}
                               disabled={!validarDerecho(9101442)}><i className="zmdi zmdi-delete"
                                                                                       style={{color: "#F30B0B"}}/></a>

                        </Tooltip>
                    </div>
                )
            }
        },
        {
            headerName: "Fecha/Hora",
            field: "m_sFechaHora",
            width: 200,
        },
        {
            headerName: "Estatus de Viaje",
            field: "m_sEstatus",
            width: 200,
            renderCell: (row) => {
                return (
                    <div align={"center"} style={{width: "100%"}}>
                        <Chip size="small" style={{
                            backgroundColor: `${row.row.m_sColorEstatus}`,
                            //color: row.row.m_nIdEstatusUnidad === 1 ? "black" : "white",
                            padding: "1px"
                        }} label={row.row.m_sEstatus}/>
                    </div>
                )
            }
        },  {
            headerName: "Folio Viaje",
            field: "m_sFolioViaje",
            width: 150,
        },{
            headerName: "Origen",
            field: "m_sOringen",
            width: 180,
        },{
            headerName: "Destino",
            field: "m_sDestino",
            width: 180,
        },
        {
            headerName: "Operador",
            field: "m_sOperador",
            width: 200,
        },{
            headerName: "Unidad",
            field: "m_sUnidad",
            width: 200,
        },{
            headerName: "Remolque 1",
            field: "m_sRemolque1",
            width: 200,
        },{
            headerName: "Remolque2",
            field: "m_sRemolque2",
            width: 200,
        },{
            headerName: "Fecha Cancelación",
            field: "FechaCancelacion",
            width: 200,
        },{
            headerName: "Motivo de Cancelación",
            field: "MotivoCancelacion",
            width: 250,
        },{
            headerName: "Usuario de cancelación",
            field: "UsuarioCancelacion",
            width: 250,
        }
        //   {
        //   headerName: "Origen",
        //   field: "m_sDescripcion",
        //   width: 150,
        // }, {
        //   headerName: "Destino",
        //   field: "m_sDescripcion",
        //   width: 150,
        // },
        //   {
        //       headerName: "Ruta General",
        //       field: "m_sDescripcion",
        //       width: 150,
        //   },
        //   {
        //       headerName: "Estatus de Documento",
        //       field: "m_sEstatus",
        //       width: 200,
        //   }

    ]);

    useEffect(value => {
        if (localStorage.getItem("UsuarioId") === null || localStorage.getItem("UsuarioId") <= 0) {
            showSuccess("Es necesario iniciar sesion para acceder a este proceso");
            window.location.replace("login");
            return;
        }
        //getInventarioUnidades()
    }, []);


    useEffect(value => {
       //console.log("Entro")
        if(viajeSeleccionado){
            let rutaActiva = true
        viajeSeleccionado.m_arrTrayectos.map((p, index) => {
            console.log(viajeSeleccionado)
            
            if(p.m_nIdSalida && !p.m_bSalidaCancelada && p.m_nIdLlegada  ){
                p.deshabilitado = false
            }
            else if((!p.m_nIdSalida || p.m_bSalidaCancelada)  && rutaActiva){
                p.deshabilitado = false
                rutaActiva = false
            }
            else if(p.m_nIdSalida && !p.m_bSalidaCancelada && rutaActiva){
                p.deshabilitado = false
                rutaActiva = false
            }
            else{
                p.deshabilitado = true
            }
            console.log(p.deshabilitado)
              //console.log("p.m_nIdSalida"+p.m_nIdSalida+" p.m_nIdLlegada"+p.m_nIdLlegada+" "+" rutaActiva"+rutaActiva+" p.deshabilitado"+p.deshabilitado)
        })

        //console.log(viajeSeleccionado.m_arrTrayectos)
    }
    }, [viajeSeleccionado]);



    function getAllData() {
        obtenerFechaInicio().then((respuestaUno) => {
            obtenerFechaFinal().then((respuestaDos) => {
                obtenerViajesByFiltro(respuestaUno.data[0].Fecha, respuestaDos.data[0].Fecha,0,0,0, 0, 0).then((respuesta) => {
                    setData(respuesta.data)
                    setViajeSeleccionado(null)
                })
            })
        })
    }

    function descargarXML(id, folio) {
        obtenerXML(id).then(({data}) => {
            var filename = folio+".xml";
            var pom = document.createElement('a');
            var bb = new Blob([data], {type: 'text/plain'});
            pom.setAttribute('href', window.URL.createObjectURL(bb));
            pom.setAttribute('download', filename);

            pom.dataset.downloadurl = ['text/plain', pom.download, pom.href].join(':');
            pom.draggable = true;
            pom.classList.add('dragout');

            pom.click();
        })

    }
    function descargarXMLCFDI(id, folio) {
        obtenerXMLCFDI(id).then(({data}) => {
            var filename = folio+".xml";
            var pom = document.createElement('a');
            var bb = new Blob([data], {type: 'text/plain'});
            pom.setAttribute('href', window.URL.createObjectURL(bb));
            pom.setAttribute('download', filename);

            pom.dataset.downloadurl = ['text/plain', pom.download, pom.href].join(':');
            pom.draggable = true;
            pom.classList.add('dragout');

            pom.click();
        }).catch((error) => {
            if (error.response){
                showError(error.response.data)
            }

        })

    }
    function descargarXMLCFDITimbrado(id, folio,xml) {
            var filename = folio+".xml";
            var pom = document.createElement('a');
            var bb = new Blob([xml], {type: 'text/plain'});
            pom.setAttribute('href', window.URL.createObjectURL(bb));
            pom.setAttribute('download', filename);

            pom.dataset.downloadurl = ['text/plain', pom.download, pom.href].join(':');
            pom.draggable = true;
            pom.classList.add('dragout');

            pom.click();


    }

    function descargarPDF(id, folio) {
            obtenerReporteCFDIViaje(id).then(({data}) => {
                let pdfWindow = window.open("");
                pdfWindow.document.write("<embed  width='100%' height='100%' src='data:application/pdf;base64, " + encodeURI(data) + "'/>");
                pdfWindow.document.body.style.margin = "0px";
                pdfWindow.document.title = "CFDI_ " + folio;
            })

    }

    function generarCFDI(id, folio, idViaje, sustituir) {
        confirmAlert({
            title: 'Confirmar Timbrado',
            message: '¿Está seguro de realizar esta operación, el CFDI de traslado se timbrará ante el SAT?',
            buttons: [
                {
                    label: 'Sí',
                    onClick: () => {
                        obtenerCFDI(id,sustituir).then((result) => {
                            setState({...state, openEnvioCorreo: true, idInforme: id, folio: folio, idViaje: idViaje})
                        }).catch((error) => {
                            if (error.response){
                                showError(error.response.data)
                            }
                        })
                    }
                },
                {
                    label: 'No',
                }
            ]
        })
    }

    function showCancelarCFDI(informe){
        setState({...state,openCancelarSAT: true, informe: informe})
    }
    function cancelarCFDI( data) {
        console.log(data)
        confirmAlert({
            title: 'Confirmar Cancelación',
            message: '¿Está seguro de realizar la cancelación ante el SAT?',
            buttons: [
                {
                    label: 'Sí',
                    onClick: () => {
                        cancelarInformeCFDI(state.informe.m_nIdInforme,data.idCancelacionSAT,data.motivoSAT,data.motivoCancelacion,data.folioRelacionado).then((result) => {
                            getParadasListado(state.informe)
                            showSuccess(result.data)
                        }).catch((error) => {
                            if (error.response){
                                showError(error.response.data)
                            }
                        })
                    }
                },
                {
                    label: 'No',
                }
            ]
        })


    }


    /**DISPONIBILIDAD DE EQUIPO*/

    const columnsEquipo = [
        /*{
            headerName: "Acciones",
            sortable: false, filterable: false,
            field: "",
            renderCell: (row) => {
                return (
                    <div>
                        <Tooltip title="Modificar">
                            <a
                                onClick={() => showActualizarDispEquipo(row.row)}
                                className="btn btn-default btn-xs">
                                <i className="fa fa-pencil-square-o"
                                    style={{ color: "#F9A03E" }}/>
                            </a>
                        </Tooltip>
                    </div>
                );
            },
            width: 100,
        },*/
        {
            headerName: "Unidad",
            field: "m_sCodigoUnidad",
            width: 200,

            valueFormatter: (params) => `${params.row.m_sCodigoUnidad}  ${params.row.m_sUnidad}`,
        },
        {
            headerName: "Tipo unidad",
            field: "m_sTipoUnidad",
            width: 150,
        }, {
            headerName: "Estado",
            field: "m_sEstatus",
            width: 150,
            align: "center",
            renderCell: (row) => {
                return (
                    <div align={"center"} style={{width: "100%"}}>
                    <Chip size="small" style={{backgroundColor: `#${row.row.m_sColor}`, color: row.row.m_nIdEstatusUnidad === 1 ? "black" : "white", padding:"1px"}}  label={row.row.m_sEstatus}/>
                    </div>
                )
            }
        }
        /*, {
            headerName: "Días",
            field: "m_nDias",
            width: 100,
        }*/
        , {
            headerName: "Ubicación",
            field: "m_sUbicacion",
            width: 200,
        }, {
            headerName: "Desde",
            field: "m_dDesde",
            width: 150,
        },
    ]
    const [equipoListado, setEquipoListado] = React.useState([]);
    const [equipoSelected, setEquipoSelected] = React.useState();
    const [eventOptions, setEventOptions] = React.useState({
        showDispEquipoDialog: false,
        showSalidaParadasDialog: false,
        showLlegadaParadasDialog: false,
        showAsignarOperadorDialog: false,
        showDetalleGuias: false,
    });



    const showActualizarDispEquipo = (equipo) => {
        setEquipoSelected(equipo)
        setEventOptions({...eventOptions, showDispEquipoDialog: true});
    }

    const closeActualizarDispEquipo = () => {
        setEventOptions({...eventOptions, showDispEquipoDialog: false});
    }


    /**DETALLE DE PARADAS*/

    const columnsParadas = [
        {
            headerName: "Acciones",
            sortable: false, filterable: false,
            field: "",
            width: 150,
            renderCell: (row) => {
                return (
                    <div>
                        {
                            (viajeSeleccionado.m_bEsPermisionario || viajeSeleccionado.m_bUnidadPermisionario) &&
                            <Tooltip title="Descargar XML">
                                <a href="#" className="btn btn-default btn-xs"
                                   onClick={() => (descargarXML(row.row.m_nIdInforme, row.row.m_sFolioInforme))}><i className="zmdi zmdi-download"
                                                                                                                style={{color: "#F9A03E"}}/></a>

                            </Tooltip>
                        }

                        {
                            !viajeSeleccionado.m_bEsPermisionario && !viajeSeleccionado.m_bUnidadPermisionario && !row.row.m_bTimbrado &&
                            <Tooltip title="Generar CFDI">
                                <a href="#" className="btn btn-default btn-xs"
                                   onClick={() => (generarCFDI(row.row.m_nIdInforme, row.row.m_sFolioInforme, row.row.m_nIdViaje, false))}><i className="zmdi zmdi-file-text"
                                                                                                                                             style={{color: "#F9A03E"}}/></a>

                            </Tooltip>
                        }
                        {
                            !viajeSeleccionado.m_bEsPermisionario && !viajeSeleccionado.m_bUnidadPermisionario && !row.row.m_bTimbrado &&
                            <Tooltip title="Descargar XML">
                                <a href="#" className="btn btn-default btn-xs"
                                   onClick={() => (descargarXMLCFDI(row.row.m_nIdInforme, row.row.m_sFolioInforme))}><i className="zmdi zmdi-download" style={{color: "#F9A03E"}}/></a>

                            </Tooltip>
                        }
                        {
                            !viajeSeleccionado.m_bUnidadPermisionario && row.row.m_bTimbrado &&
                            <Tooltip title="Sustituir CFDI">
                                <a href="#" className="btn btn-default btn-xs"
                                   onClick={() => (generarCFDI(row.row.m_nIdInforme, row.row.m_sFolioInforme, row.row.m_nIdViaje, true))}><i className="zmdi zmdi-refresh"
                                                                                                                                                                        style={{color: "#F9A03E"}}/></a>

                            </Tooltip>
                        }
                        {
                            !viajeSeleccionado.m_bUnidadPermisionario && row.row.m_bTimbrado &&
                            <Tooltip title="Descargar PDF">
                                <a href="#" className="btn btn-default btn-xs"
                                   onClick={() => (descargarPDF(row.row.m_nIdInforme, row.row.m_sFolioFiscalUUID))}><i className="zmdi zmdi-collection-pdf" style={{color: "#F9A03E"}}/></a>

                            </Tooltip>
                        }

                        {
                            !viajeSeleccionado.m_bUnidadPermisionario && row.row.m_bTimbrado &&
                            <Tooltip title="Descargar XML">
                                <a href="#" className="btn btn-default btn-xs"
                                   onClick={() => (descargarXMLCFDITimbrado(row.row.m_nIdInforme, row.row.m_sFolioFiscalUUID,row.row.m_sXMLTraslada))}><i className="zmdi zmdi-file-text" style={{color: "#F9A03E"}}/></a>

                            </Tooltip>
                        }

                        {
                            !viajeSeleccionado.m_bUnidadPermisionario && row.row.m_bTimbrado &&
                            <Tooltip title="Cancelar Timbrado SAT">
                                <a href="#" className="btn btn-default btn-xs"
                                   onClick={() => (showCancelarCFDI(row.row))}><i className="zmdi zmdi-card-off" style={{color: "#F9A03E"}}/></a>

                            </Tooltip>
                        }



                    </div>
                )
            }
        },
        {
            headerName: "Folio Informe",
            field: "m_sFolioInforme",
            width: 130,
        },
        {
            headerName: "Origen - Destino",
            field: "origenDestino",
            width: 200,
            valueFormatter: row => {
                return (`${row.row.m_sCiudadOrigen} - ${row.row.m_sCiudadDestino}`)
            }
        },
        {
            headerName: "Salida",
            field: "m_sFechaSalidaFormat",
            width: 130,
            valueFormatter: row => !row.value ? "Sin definir" : row.value
        },
        {
            headerName: "Llegada",
            field: "m_sFechaLlegadaFormat",
            width: 130,
            valueFormatter: row => !row.value ? "Sin definir" : row.value
        },
        {
            headerName: "Guías",
            field: "m_nIdViaje",
            renderCell: (row) => {
                return (
                    <Link style={{cursor: "pointer"}} onClick={() => {
                        setInformeSeleccionado(row.row);
                        setEventOptions({...eventOptions, showDetalleGuias: true})
                    }}>
                        Ver Guías
                    </Link>
                )
            }
        },
        {
            headerName: "Camión",
            field: "m_sCamion",
            width: 200,
        },
        {
            headerName: "Operador",
            field: "m_sOperador",
            width: 250
        },
        {
            headerName: "Folio Fiscal",
            field: "m_sFolioFiscalUUID",
            width: 300,
        },
        {
            headerName: "Folio Fiscal sustituido",
            field: "m_nIdOrigen",
            width: 300,
            valueFormatter: row => row.row.m_sFolioFiscalUUIDSustituido || row.row.m_sUltimoFolioFiscalUUIDSustituido || " "
        },
        // {
        //     headerName: "Liq",
        //     field: "m_sNumeroNombreOperador",
        //     width: 80,
        // }, */
    ]
    const [paradasListado, setParadasListado] = React.useState([]);

    const [paradaData, setParadaData] = React.useState();

    function getParadasListado(row) {
        setState(state => {
            return {...state, idViaje: row.m_nIdViaje}
        })
        obtenerDetalleParadasIdViaje(row.m_nIdViaje).then(respuesta => {
            //setViajeSeleccionado(row)
            setParadasListado(respuesta.data);
        });
    }
    const showCancelarDialog = (data) => {
        setParadaData(data);
        setEventOptions({...eventOptions, showCancelarParadasDialog: true});

    }
    const showSalidaDialog = (data) => {
          //validarSalidaParada(data.m_nIdViaje).then((respuesta)=>{
            //  let encontrado = respuesta.data.find(parada=>parada.Timbrado==false)
             // let qr = respuesta.data.find(parada=>parada.Escaneado==false)

          //    if(encontrado){//si encontro valor falso en timbrado
           //       showSuccess(`No se puede marcar salida ya que no se ha generado CFDI para el folio: ${encontrado.FolioInforme}`)
           //   }

            //  if(qr){//si encontro valor falso en qr
            //    showSuccess(`No se puede marcar salida ya que no se ha escaneado los paquetes en el remolque: ${qr.FolioInforme}`)
            //}else{
               setParadaData(data);
            setEventOptions({...eventOptions, showSalidaParadasDialog: true});
            //}
          //}).catch((err)=>{
           //   showSuccess(err)
          //})
    }

    const closeSalidaDialog = () => {
        setEventOptions({...eventOptions, showSalidaParadasDialog: false});
    }

    const closeCancelarDialog = () => {
        setEventOptions({...eventOptions, showCancelarParadasDialog: false});
    }

    const showLlegadaDialog = (data) => {
        // validarSalidaParada(data.m_nIdViaje).then((respuesta)=>{
        //     let encontrado = respuesta.data.find(parada=>parada.Timbrado==false)
        //     if(encontrado){//si encontro valor falso en timbrado
        //         showSuccess(`No se puede marcar llegada ya que no se ha generado CFDI para el folio: ${encontrado.FolioInforme}`)
        //     }else{
                setParadaData(data);
                setEventOptions({...eventOptions, showLlegadaParadasDialog: true});
        //    }
       //  }).catch((err)=>{
       //     showSuccess(err)
       // })

    }

    const closeLlegadaDialog = () => {
        setEventOptions({...eventOptions, showLlegadaParadasDialog: false});
    }

    function updateSalida(data) {


        //e.preventDefault();
        var params = {
            //m_dFecha: state.fechaHoraRegistro.split("T")[0],
            //m_tHora: state.fechaHoraRegistro.split("T")[1],
            m_nIdViaje: paradaData.m_nIdViaje,
            m_nCV1Km: data.kmsRemolqueUno,
            m_nCV2Km: data.kmsRemolqueDos,
            m_nCV1Millas: data.millasRemolqueUno,
            m_nCV2Millas: data.millasRemolqueDos,
            m_bCV1Estatus: data.idEstatusRemolqueUno,
            m_bCV2Estatus: data.idEstatusRemolqueDos,
            m_dFechaSalida: data.fechaSalida,
            m_tHoraSalida: data.horaSalida,
            m_nIdEstatusSalida: data.idEstatus,
            m_nKmViaje: data.kms,
            m_nMillasViaje: data.millas,
            m_sMotivoRetraso: data.motivoRetraso,
            m_nIdCiudadOrigen: paradaData.m_nIdOrigen,
            m_nIdCiudadDestino: paradaData.m_nIdDestino,


            m_nIdRuta: paradaData.m_nIdViajeTrayecto,


            // m_nIdEstatusViaje: this.state.estatusListado,
            // m_nIdSucursal : this.state.idSucursalAgregar,
            // m_sCandadoOficial : this.state.candadoOficial,
            // m_sFolioViaje : this.state.folioViaje,
            // m_sIdentificador : this.state.identificadorViaje,
            // m_sNumViajeCliente : this.state.viajeCliente,
            // CreadoPor : this.state.CreadoPor,
            // m_arrInformes : this.state.dataInformes

        }

        console.log(params)

        agregarViajeSalida(params)
            .then((respuesta) => {
                showSuccess(respuesta.data);
                //getParadasListado(paradaData)
                getAllData()
            })
            .catch((err) => {
                showSuccess(err);
            });

    }

    function updateLlegada(data) {

        var params = {
            //m_dFecha: state.fechaHoraRegistro.split("T")[0],
            //m_tHora: state.fechaHoraRegistro.split("T")[1],
            m_nCV1Km: data.kmsRemolqueUno,
            m_nCV2Km: data.kmsRemolqueDos,
            m_nCV1Millas: data.millasRemolqueUno,
            m_nCV2Millas: data.millasRemolqueDos,
            m_bCV1Estatus: data.idEstatusRemolqueUno,
            m_bCV2Estatus: data.idEstatusRemolqueDos,
            m_nKmViaje: data.kms,
            m_nIdEstatusLlegada: data.idEstatus,
            m_nMillasViaje: data.millas,
            m_nIdCiudadOrigen: paradaData.m_nIdOrigen,
            m_nIdCiudadDestino: paradaData.m_nIdDestino,
            m_nIdRuta: paradaData.m_nIdViajeTrayecto,
            m_nIdViaje: paradaData.m_nIdViaje,
            m_sMotivoRetraso: data.motivoRetraso,
            m_nPesoCarga: data.pesoDescarga,
            m_dFechaSalida: data.fechaSalida,
            m_tHoraSalida: data.horaSalida,
            m_nLiquidacion: data.liquidacion,
            m_dFechaLlegada: data.fechaLlegada,
            m_tHoraLlegada: data.horaLlegada,
            m_nTipoCambio: data.tipoDeCambioOrigen
        }
        console.log(params)

        agregarViajeLlegada(params)
            .then((respuesta) => {
                showSuccess(respuesta.data);
                console.log(respuesta.data);
                //getParadasListado(paradaData)
                getAllData()

            })
            .catch((err) => {
                console.log(err);
                showSuccess(err);
            });

    }

    const showAsignarOperadorDialog = (data) => {
        setParadaData(data);
        setEventOptions({
            ...eventOptions,
            showAsignarOperadorDialog: true
        });
    }

    const closeAsignarOperadorDialog = () => {
        setEventOptions({
            ...eventOptions,
            showAsignarOperadorDialog: false
        })
    }

    function submitOperadorUnidad(data) {
        console.log("Llamar servicio operador unidad");
        console.log(data);
    }

    const setDataListado = (listado) => {
        setData(listado)
    }

    const handleCancelar = (e) => {
        if (e){
            e.preventDefault();
        }
        let params = {
            motivoCancelacion: state.motivoCancelacion,
            usuarioCancelacion: localStorage.getItem("UsuarioId"),
            fechaCancelacion: state.fechaCancelacion.replace('T', ' '),
        };
        cancelarViaje(state.idViaje,params).then((respuesta) => {
            showSuccess("El viaje ha sido cancelado")
            handleShowListado()
        });
    };
    function envioCorreoAction(data){
        enviarCorreoCFDIViaje(state.idInforme, data.correos,data.correoDefault).then(({data}) => {
            showSuccess(data);
            descargarPDF(state.idInforme, state.folio)
            setState(state => {
                return {...state, openEnvioCorreo: false}
            })
            getParadasListado({m_nIdViaje:state.idViaje})

        })
    }
    function cancelarTrayectos(params){
        cancelarTrayecto(params.id, params).then(({data}) => {
            closeCancelarDialog()
            handleShowListado()
            showSuccess(data)
        })
    }

    const handleClick = (itemKey) => {
        setIndexOpen(itemKey === indexOpen ? -1 : itemKey);
    };

    return (
        <div>
            {
                state.openEnvioCorreo &&
                <EnvioCorreoDialogo onSubmit={envioCorreoAction} open={state.openEnvioCorreo} close={()=> {setState({...state, openEnvioCorreo:false}); descargarPDF(state.idInforme, state.folio);getParadasListado({m_nIdViaje:state.idViaje})}}/>
            }
            {state.openCancelarSAT &&
                <CancelarSAT open={state.openCancelarSAT} onSubmit={cancelarCFDI} data={{folioSustituye: state.informe.m_sFolioFiscalUUID,m_sFolio: state.informe.m_sFolioInforme, folioCancelar: state.informe.m_sFolioFiscalUUIDSustituido || state.informe.m_sFolioFiscalUUID
                }} close={() => setState({...state,openCancelarSAT: false})}/>
            }
            {
                informeSeleccionado &&
                <Dialog open={eventOptions.showDetalleGuias}
                        onClose={() => setEventOptions({...eventOptions, showDetalleGuias: false})}
                        fullWidth={true}
                        maxWidth={'md'}>
                    <DialogTitle>
                        Detalle de Informe - {informeSeleccionado.m_sFolioInforme}
                    </DialogTitle>
                    <DialogContent>
                        <DetalleInforme guias={informeSeleccionado.m_arrClsProGuia}>
                            <DialogActions>
                                <Button
                                    variant={'contained'} color={'primary'}
                                    type="submit"
                                    onClick={() => setEventOptions({
                                        ...eventOptions,
                                        showDetalleGuias: false
                                    })}>Aceptar</Button>
                            </DialogActions>
                        </DetalleInforme>
                    </DialogContent>
                </Dialog>
            }

            {/*<Dialog open={eventOptions.showDispEquipoDialog}
                    onClose={closeActualizarDispEquipo}
                    fullWidth={true}
                    maxWidth={'sm'}>
                <DialogContent>
                    <ActualizarDiponibilidadEquipo onSubmit={updateEquipoData} equipo={equipoSelected}>
                        <DialogActions>
                            <Button
                                variant={'contained'} color={'primary'}
                                type="submit"
                                onClick={closeActualizarDispEquipo}>Aceptar</Button>
                            <Button variant={'outlined'} color={'primary'}
                                    onClick={closeActualizarDispEquipo}>Cancelar</Button>
                        </DialogActions>
                    </ActualizarDiponibilidadEquipo>
                </DialogContent>
            </Dialog>*/}
            {
                paradaData &&
                <CancelarTrayecto onSubmit={cancelarTrayectos} open={eventOptions.showCancelarParadasDialog} close={() => closeCancelarDialog()} data={paradaData}>
                    <DialogActions>
                        <Button
                            variant={'contained'} color={'primary'}
                            type="submit">Aceptar</Button>
                        <Button variant={'outlined'} color={'primary'}
                                onClick={closeCancelarDialog}>Cancelar</Button>
                    </DialogActions>
                </CancelarTrayecto>
            }
            {
                paradaData &&
                <Dialog open={eventOptions.showSalidaParadasDialog}
                        onClose={closeSalidaDialog}
                        fullWidth={true}
                        maxWidth={'xl'}>
                    <DialogTitle><h2>Salida de Paradas</h2></DialogTitle>
                    <DialogContent>
                        <SalidaParadas onSubmit={updateSalida} data={viajeSeleccionado}>
                            <DialogActions>
                                <Button
                                    variant={'contained'} color={'primary'}
                                    type="submit"
                                    onClick={closeSalidaDialog}>Aceptar</Button>
                                <Button variant={'outlined'} color={'primary'}
                                        onClick={closeSalidaDialog}>Cancelar</Button>
                            </DialogActions>
                        </SalidaParadas>
                    </DialogContent>
                </Dialog>
            }
            {
                paradaData &&
                <Dialog open={eventOptions.showLlegadaParadasDialog}
                        onClose={closeLlegadaDialog}
                        fullWidth={true}
                        maxWidth={'xl'}>
                    <DialogTitle><h2>Llegada de Paradas</h2></DialogTitle>
                    <DialogContent>
                        <LlegadaParadas onSubmit={updateLlegada} viaje={viajeSeleccionado} parada={paradaData}>
                            <DialogActions>
                                <Button
                                    variant={'contained'} color={'primary'}
                                    type="submit"
                                    onClick={closeLlegadaDialog}>Aceptar</Button>
                                <Button variant={'outlined'} color={'primary'}
                                        onClick={closeLlegadaDialog}>Cancelar</Button>
                            </DialogActions>
                        </LlegadaParadas>
                    </DialogContent>
                </Dialog>
            }
            <Dialog open={eventOptions.showAsignarOperadorDialog}
                    onClose={closeAsignarOperadorDialog}
                    fullWidth={true}
                    maxWidth={'xl'}>
                <DialogTitle style={{display: "flex", flexDirection: "row", justifyContent: "space-between"}}>
                    {/*<h3>Origen: {paradaData.m_sCiudadOrigen} Destino: {paradaData.m_sCiudadDestino}</h3>*/}
                    <h3>Origen: Destino: </h3>

                </DialogTitle>
                <DialogContent>
                    <AsignarOperador>
                        <DialogActions>
                            <Button
                                variant={'contained'}
                                color={'primary'}
                                onClick={closeAsignarOperadorDialog}>Cerrar</Button>
                        </DialogActions>
                    </AsignarOperador>

                </DialogContent>
            </Dialog>

            <header className="topbar clearfix">
                <Cabecera titulo="Viajes">
                    <div className="page-header">
                        <ul className="list-page-breadcrumb">
                            <li>
                                <a href="/Catalogos" className="color-mapeo">
                                    Catálogos <i className="zmdi zmdi-chevron-right"/>
                                </a>
                            </li>
                            <li className="active-page">Viajes</li>
                        </ul>
                    </div>
                </Cabecera>
            </header>

            {/*Leftbar Start Here*/}
            <aside className="iconic-leftbar">
                <BarraLateralIzquierda/>
            </aside>
            {/*Leftbar End Here*/}

            {/*Page Container Start Here*/}
            <section className="main-container">

                <div className="container-fluid">

                    <ul className="nav navStatica nav-tabs">
                        <li className="active">
                            <a onClick={handleShowListado}>
                                <i className="fa fa-list"/> Listado
                            </a>
                        </li>
                        <li>
                            <a className= {validarDerecho(9101439)? "":classes.disabled} onClick={handleShowAgregar}>
                                <i className="fa fa-plus-circle"/> {state.agregar}
                            </a>
                        </li>
                        <li>
                            <a className= {validarDerecho(9101444)? "":classes.disabled} onClick={handleShowReportes}>
                                <i className="fa fa-print"/> Reportes
                            </a>
                        </li>
                        <li>
                            <a
                                
                                className= {(state.idViaje === 0 || !validarDerecho(9101443))? classes.disabled : ""}
                                data-toggle="tab"
                                href="#Cancelar"
                                onClick={handleShowCancelar}
                                
                            >
                                <i className="fa fa-ban"/> Cancelar
                            </a>
                        </li>

                    </ul>

                    <div className="row tab-content">
                        <div className="widget-wrap tab-pane fade in show" id="Listado">
                            <div className="widget-wrap">
                                <div className="widget-content">

                                    <Filtros
                                        listaResultado={setDataListado}
                                        viajes={true}
                                    />

                                    <div  style={{height: "300px", width: '100%'}}>
                                        <DataGrid
                                            localeText={dataGridLocaleText}
                                            rows={data}
                                            columns={columns}
                                            density="compact"
                                            getRowId={(row) => row.m_nIdViaje}
                                            onRowSelected={(row) => {
                                                /*  setState({
                                                     ...state,
                                                     idViaje: row.data.m_nIdViaje
                                                 }) */
                                                setViajeSeleccionado(row.data)
                                                getParadasListado(row.data)
                                            }}
                                        />

                                    </div>
                                </div>
                            </div>
                            <div className="row">

                                <div className="widget-wrap" style={{height: "300px", width: '100%', overflow: "auto"}}>
                                    <div className="widget-content">
                                <div className="col-md-12">
                                    <div style={{color: '#717171', marginBottom: "10px", fontSize: "18px"}}>Detalle de
                                        Paradas
                                    </div>

                                            <div className="row"
                                                 >
                                                <List>
                                                    {
                                                        viajeSeleccionado && viajeSeleccionado.m_arrTrayectos.map((p, index) => {

                                                            const informesFiltrados = paradasListado.filter((i,ind) => ((i.m_nIdDestino === p.m_nIdDestino) || ( (viajeSeleccionado.m_arrTrayectos.length - 1) === index && !viajeSeleccionado.m_arrTrayectos.map(t => t.m_nIdDestino).includes(i.m_nIdDestino) )  ))

                                                            return (
                                                                <div>
                                                                    <ListItem button key={p.m_nIdDestino+index+p.m_nIdOrigen}  onClick={() => handleClick(index)}
                                                                    >

                                                                        <ListItemText primary={`Ruta: ${p.m_sRuta}`} />
                                                                        {
                                                                            ((!p.m_nIdSalida || p.m_bSalidaCancelada) && !p.deshabilitado)  &&

                                                                            <Link  style={{cursor: "pointer"}}
                                                                                  onClick={() => showSalidaDialog(p)}>Marcar
                                                                                Salida</Link>
                                                                        }
                                                                        {
                                                                            p.m_nIdSalida && !p.m_nIdLlegada && !p.m_bSalidaCancelada && !p.deshabilitado  &&
                                                                            <>
                                                                                <Link  style={{cursor: "pointer"}}
                                                                                       onClick={() => showCancelarDialog(p)}>Cancelar Salida</Link>
                                                                                -
                                                                            </>

                                                                        }

                                                                        {/*{!p.m_dFechaLlegada  && !p.m_dFechaSalida  &&
                                                                        "/"
                                                                        }*/}


                                                                        {
                                                                            p.m_nIdSalida && !p.m_bSalidaCancelada && !p.m_nIdLlegada && !p.deshabilitado  &&

                                                                            <Link style={{cursor: "pointer"}}
                                                                                  onClick={() => showLlegadaDialog(p)}>Marcar
                                                                                Llegada</Link>
                                                                        }
                                                                        {indexOpen === index ?
                                                                            <ExpandLess style={{cursor: "pointer"}}
                                                                                        onClick={() => handleClick(index)}/> :
                                                                            <ExpandMore style={{cursor: "pointer"}}
                                                                                        onClick={() => handleClick(index)}/>}
                                                                    </ListItem>
                                                                    <Collapse in={indexOpen === index}
                                                                              timeout="auto" unmountOnExit>
                                                                        <div style={{height: `${70 + (informesFiltrados.length * 30)}px`}}>
                                                                            <DataGrid
                                                                                localeText={dataGridLocaleText}
                                                                                rows={informesFiltrados}
                                                                                columns={columnsParadas}
                                                                                density="compact"
                                                                                getRowId={(row) => row.m_nIdInforme}
                                                                            />
                                                                        </div>

                                                                    </Collapse>
                                                                </div>
                                                            )
                                                        })
                                                    }

                                                </List>

                                                {/*{equipoListado.length !== 0 ? (
                                                        <DataGrid
                                                            rows={paradasListado}
                                                            columns={columnsParadas}
                                                            density="compact"
                                                            pageSize={Math.floor((state.height - 310) / 30)}
                                                            getRowId={(row) => row.m_nIdInforme}
                                                            onRowSelected={(row) => {
                                                                setState({
                                                                    ...state,
                                                                    idEquipo: row.data.m_nIdInventarioUnidad
                                                                })
                                                            }}
                                                        />
                                                    ) : (
                                                        <div>No se encontró ningún registro</div>
                                                    )}*/}
                                            </div>
                                        </div>
                                    </div>
                                </div>
{/*
                                <div className="col-md-6">
                                    <div style={{
                                        color: '#717171',
                                        marginBottom: "10px",
                                        fontSize: "18px"
                                    }}>Disponibilidad del
                                        Equipo
                                    </div>
                                    <div className="widget-wrap">
                                        <div className="widget-content">
                                            <div className="row" style={{height: "400px", width: '100%'}}>
                                                {equipoListado.length !== 0 ? (
                                                    <DataGrid
                                                        rows={equipoListado}
                                                        localeText={dataGridLocaleText}
                                                        columns={columnsEquipo}
                                                        density="compact"
                                                        getRowId={(row) => row.m_nIdInventarioUnidad}

                                                    />
                                                ) : (
                                                    <div>No se encontró ningún registro</div>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                </div>
*/}
                            </div>

                        </div>

                        <div className="widget-wrap tab-pane fade" id="Agregar">

                            {
                                state.open &&
                                <AgregarViaje
                                    reload={getAllData}
                                    consult={state.agregar === "Consultar"}
                                    modificar={state.agregar === "Modificar"}
                                    select={state.selectViaje}
                                    cancel={() => handleShowListado()}
                                    id={state.idViaje}/>

                            }

                        </div>
                        <div className="widget-wrap tab-pane fade" id="Imprimir">
                            {
                                state.openImprimir &&
                                <ReportesViajes tipo={2}/>
                            }

                        </div>

                        <div id="Cancelar" className="tab-pane fade">
                            <div className="widget-wrap">
                                <div className="widget-container">
                                    <div className="widget-content">
                                        <div className="row">
                                            <form className="j-forms" onSubmit={handleCancelar} onKeyDown={e => {if (e.code === 13){e.preventDefault()}}}>
                                                <div className="form-content">
                                                    <div className="col-sm-6 col-md-2-5 col-lg-2-5 unit">
                                                        <div className="input">
                                                            <TextField variant="outlined" margin="dense"
                                                                       label="Folio Viaje"
                                                                       className="form-control"
                                                                       type="text"
                                                                       InputLabelProps={{shrink: true,}}
                                                                       value={state.FolioViaje}
                                                                       id="FolioViaje"
                                                                       disabled
                                                            />
                                                        </div>
                                                    </div>

                                                    <div className="col-sm-6 col-md-2-5 col-lg-2-5 unit">
                                                        <div className="input">
                                                            <TextField variant="outlined" margin="dense"
                                                                       label="Sucursal Emisora"
                                                                       className="form-control"
                                                                       type="text"
                                                                       InputLabelProps={{shrink: true,}}
                                                                       value={state.sucursalCancelacion}
                                                                       id="sucursalCancelacion"
                                                                       disabled
                                                            />
                                                        </div>
                                                    </div>

                                                    <div className="col-sm-6 col-md-2-5 col-lg-2-5 unit">
                                                        <div className="input">
                                                            <TextField variant="outlined" margin="dense" label="Fecha de cancelación"
                                                                       className="form-control"
                                                                       type="datetime-local"
                                                                       InputLabelProps={{shrink: true,}}
                                                                       value={state.fechaCancelacion}
                                                                       id="fechaCancelacion"
                                                                       disabled
                                                            />
                                                        </div>
                                                    </div>

                                                    <div className="col-sm-6 col-md-2-5 col-lg-2-5 unit">
                                                        <div className="input">
                                                            <TextField variant="outlined" margin="dense" label="Usuario"
                                                                       className="form-control"
                                                                       type="text"
                                                                       InputLabelProps={{shrink: true,}}
                                                                       value={state.usuarioCancelacion}
                                                                       id="usuarioCancelacion"
                                                                       disabled
                                                            />
                                                        </div>
                                                    </div>

                                                    <div className="col-sm-6 col-md-2-5 col-lg-2-5 unit">
                                                        <div className="input">
                                                            <TextField variant="outlined" margin="dense" label="Estatus"
                                                                       className="form-control"
                                                                       type="text"
                                                                       InputLabelProps={{shrink: true,}}
                                                                       value={state.estatusCancelacion}
                                                                       id="estatusCancelacion"
                                                                       disabled
                                                            />
                                                        </div>
                                                    </div>

                                                    <div className="col-sm-12 col-md-12 col-lg-12 unit">
                                                        <div className="input">
                                                            <TextField variant="outlined" margin="dense" label="Motivo"
                                                                       className="form-control"
                                                                       type="text"
                                                                       InputLabelProps={{shrink: true,}}
                                                                       onChange={handleChange}
                                                                       value={state.motivoCancelacion}
                                                                       id="motivoCancelacion"
                                                                       disabled={!state.sePuedeCancelar}
                                                            />
                                                        </div>
                                                    </div>

                                                    <div className="form-footer" className="col-md-12">
                                                        <Grid container spacing={2}>
                                                            <Grid item xs>
                                                                <Button
                                                                    fullWidth
                                                                    type="submit"
                                                                    className="btn btn-primary primary-btn"
                                                                    disabled={!state.sePuedeCancelar}
                                                                >
                                                                    Guardar Cambios
                                                                </Button>
                                                            </Grid>
                                                        </Grid>
                                                    </div>
                                                </div>
                                            </form>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                    </div>
                </div>

            </section>
            {/*Page Container End Here*/}

            {/*Rightbar Start Here*/}
            <aside className="rightbar">
                <BarraLateralDerecha/>
            </aside>

        </div>

    );
}

export default Viajes;
