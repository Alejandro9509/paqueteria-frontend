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
    ListItemText, Link, Chip
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
    obtenerXML, obtenerViajesByFiltro, obtenerCFDI, obtenerReporteCFDI, obtenerReporteCFDIViaje
} from "../Util/Contexts/ViajesContext";
import ExpandLess from '@material-ui/icons/ExpandLess';
import ExpandMore from '@material-ui/icons/ExpandMore';
import {obtenerInformeFiltro, obtenerInformesPorViaje, obtenerXMLCFDI} from "../Util/Contexts/InformesContext";
import {getUniqueListBy} from "../Util/Util";
import DetalleInforme from "./Viajes/DetalleInforme";
import {obtenerDetalleParadasIdInformes, obtenerDetalleParadasIdViaje} from "../Util/Contexts/DetalleParadasContext";
import {obtenerSucursales} from "../Util/Contexts/SucursalContext";
import Filtros from "./Filtros/Filtros";
import {obtenerFechaFinal, obtenerFechaInicio} from "../Util/Contexts/UtileriasContext";
import PictureAsPdfIcon from '@material-ui/icons/PictureAsPdf';
import GetAppIcon from '@material-ui/icons/GetApp';
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
    }
};
const useStyles = makeStyles(styles);
window.jQuery = window.$ = $;

function Viajes() {
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
        agregar: "Viaje",
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



    function handleEliminar(id) {
        // var derecho;
        // const urlDelete = `${process.env.REACT_APP_API_URL}/Utilerias/ValidaDerechos/${state.CreadoPor}/${state.DerechoBorrar}/3`;
        // axios.get(urlDelete, { headers }).then(respuesta => {
        //   derecho = respuesta.data;
        //   if (derecho == false)
        //   {
        //     showSuccess ("El usuario no tiene derechos para realizar el proceso");
        //     return;
        //   }
        //
        // const url = `${process.env.REACT_APP_API_URL}/Departamento/Eliminar/` + id;
        // axios.delete(url, { headers }).then(respuesta => {
        //   console.log(respuesta);
        //   getAllData();
        // }).catch(err => {
        //   showSuccess(err)
        // });
        // }).catch(err => {
        // showSuccess(err)
        // });
    }

    function handleShowModificar(id) {
        $('.nav-tabs li ').removeClass('active');
        $('.nav-tabs li').eq(1).addClass('active');
        $('.tab-content div ').removeClass('in show');
        $('#Agregar').addClass('in show');

        obetenerViajeId(id).then(respuesta => {
            console.log(respuesta.data)
            setState({
                ...state,
                agregar: "Viaje",
                edit: true,
                idViaje: id,
                consult: false,
                selectViaje: respuesta.data,
                open: true
            })
        });
    }

    function handleShowConsultar(id) {
        $('.nav-tabs li ').removeClass('active');
        $('.nav-tabs li').eq(1).addClass('active');
        $('.tab-content div ').removeClass('in show');
        $('#Agregar').addClass('in show');
        obetenerViajeId(id).then(respuesta => {
            setState({
                ...state,
                agregar: "Viaje",
                edit: true,
                consult: true,
                idViaje: id,
                selectViaje: respuesta.data,
                open: true
            })
        });
    }

    function handleShowAgregar() {
        setState({
            ...state,
            agregar: "Viaje",
            showPopUp: false,
            edit: false,
            consult: false,
            open: true,
        })
        $('.nav-tabs li ').removeClass('active');
        $('.nav-tabs li').eq(1).addClass('active');
        $('.tab-content div ').removeClass('in show');
        $('#Agregar').addClass('in show');
    }





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
                                className="btn btn-default btn-xs"><i className="fa fa-pencil-square-o"
                                                                      style={{color: "#F9A03E"}}/></a>

                        </Tooltip>
                        <Tooltip title="Consultar">
                            <a className="btn btn-default btn-xs"
                               onClick={() => (handleShowConsultar(row.row.m_nIdViaje))}><i className="fa fa-eye"
                                                                                            style={{color: "#F9A03E"}}/></a>

                        </Tooltip>

                        <Tooltip title="Eliminar">
                            <a href="#" className="btn btn-default btn-xs"
                               onClick={() => (handleEliminar(row.row.m_nIdViaje))}><i className="zmdi zmdi-delete"
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
            headerName: "Remolque1",
            field: "m_sRemolque1",
            width: 200,
        },{
            headerName: "Remolque2",
            field: "m_sRemolque2",
            width: 200,
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

    function getAllData() {
        obtenerFechaInicio().then((respuestaUno) => {
            obtenerFechaFinal().then((respuestaDos) => {
                obtenerViajesByFiltro(respuestaUno.data[0].Fecha, respuestaDos.data[0].Fecha,0,0,0, 0, 0).then((respuesta) => {
                    setData(respuesta.data)
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

    function generarCFDI(id, folio) {
        confirmAlert({
            title: 'Confirmar Timbrado',
            message: '¿Está seguro de realizar esta operación, se timbrara ante el SAT?',
            buttons: [
                {
                    label: 'Sí',
                    onClick: () => {
                        obtenerCFDI(id).then((result) => {
                            obtenerReporteCFDIViaje(id).then(({data}) => {
                                let pdfWindow = window.open("");
                                pdfWindow.document.write("<embed  width='100%' height='100%' src='data:application/pdf;base64, " + encodeURI(data) + "'/>");
                                pdfWindow.document.body.style.margin = "0px";
                                pdfWindow.document.title = "CFDI_ " + folio;
                            })
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
    function cancelarCFDI(id, folio) {
        confirmAlert({
            title: 'Confirmar Cancelación',
            message: '¿Está seguro de realizar la cancelación ante el SAT?',
            buttons: [
                {
                    label: 'Sí',
                    onClick: () => {
                        cancelarCFDI(id).then((result) => {
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
                            viajeSeleccionado.m_bEsPermisionario && viajeSeleccionado.m_bUnidadPermisionario &&
                            <Tooltip title="Descargar XML">
                                <a href="#" className="btn btn-default btn-xs"
                                   onClick={() => (descargarXML(row.row.m_clsInforme.m_nIdInforme, row.row.m_clsInforme.m_sFolioInforme))}><i className="zmdi zmdi-download"
                                                                                                                style={{color: "#F9A03E"}}/></a>

                            </Tooltip>
                        }

                        {
                            !viajeSeleccionado.m_bUnidadPermisionario && !row.row.m_clsInforme.m_bTimbrado &&
                            <Tooltip title="Generar CFDI">
                                <a href="#" className="btn btn-default btn-xs"
                                   onClick={() => (generarCFDI(row.row.m_clsInforme.m_nIdInforme, row.row.m_clsInforme.m_sFolioInforme))}><i className="zmdi zmdi-file-text"
                                                                                                                                             style={{color: "#F9A03E"}}/></a>

                            </Tooltip>
                        }
                        {
                            !viajeSeleccionado.m_bUnidadPermisionario && !row.row.m_clsInforme.m_bTimbrado &&
                            <Tooltip title="Descargar XML">
                                <a href="#" className="btn btn-default btn-xs"
                                   onClick={() => (descargarXMLCFDI(row.row.m_clsInforme.m_nIdInforme, row.row.m_clsInforme.m_sFolioInforme))}><i className="zmdi zmdi-download" style={{color: "#F9A03E"}}/></a>

                            </Tooltip>
                        }
                        {
                            !viajeSeleccionado.m_bUnidadPermisionario && row.row.m_clsInforme.m_bTimbrado &&
                            <Tooltip title="Descargar PDF">
                                <a href="#" className="btn btn-default btn-xs"
                                   onClick={() => (descargarPDF(row.row.m_clsInforme.m_nIdInforme, row.row.m_clsInforme.m_sFolioFiscalUUID))}><i className="zmdi zmdi-collection-pdf" style={{color: "#F9A03E"}}/></a>

                            </Tooltip>
                        }

                        {
                            !viajeSeleccionado.m_bUnidadPermisionario && row.row.m_clsInforme.m_bTimbrado &&
                            <Tooltip title="Descargar XML">
                                <a href="#" className="btn btn-default btn-xs"
                                   onClick={() => (descargarXMLCFDITimbrado(row.row.m_clsInforme.m_nIdInforme, row.row.m_clsInforme.m_sFolioFiscalUUID,row.row.m_clsInforme.m_sXMLTraslada))}><i className="zmdi zmdi-file-text" style={{color: "#F9A03E"}}/></a>

                            </Tooltip>
                        }

                        {
                            !viajeSeleccionado.m_bUnidadPermisionario && row.row.m_clsInforme.m_bTimbrado &&
                            <Tooltip title="Cancelar Timbrado SAT">
                                <a href="#" className="btn btn-default btn-xs"
                                   onClick={() => (cancelarCFDI(row.row.m_clsInforme.m_nIdInforme, row.row.m_clsInforme.m_sFolioFiscalUUID))}><i className="zmdi zmdi-card-off" style={{color: "#F9A03E"}}/></a>

                            </Tooltip>
                        }



                    </div>
                )
            }
        },
        {
            headerName: "Folio Informe",
            field: "m_clsInforme",
            width: 130,
            valueFormatter: row => {
                return (row.value.m_sFolioInforme)
            }
        },
        {
            headerName: "Origen - Destino",
            field: "origenDestino",
            width: 250,
        },
        {
            headerName: "Salida",
            field: "m_dFechaSalida",
            width: 130,
            valueFormatter: row => !row.value ? "Sin definir" : row.value
        },
        {
            headerName: "Llegada",
            field: "m_dFechaLlegada",
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
            width: 200
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
        obtenerDetalleParadasIdViaje(row.m_nIdViaje).then(respuesta => {
            var arrayInformes = getUniqueListBy(respuesta.data, "m_nIdOrigen")
            arrayInformes.forEach(a => {
                a["informes"] = respuesta.data.filter(r => r.m_nIdOrigen === a.m_nIdOrigen)
                a.origenDestino = `${a.m_sOrigen} - ${a.m_sDestino}`
            })
            setViajeSeleccionado(row)
            setParadasListado(arrayInformes);
        });
    }
/*
    function getInventarioUnidades() {
        const url = `${process.env.REACT_APP_API_URL}/InventarioUnidades/GetListado`;
        axios.get(url, {headers}).then(({data}) => {
            setEquipoListado(data)
        });
    }*/


    const showSalidaDialog = (data) => {
        console.log(data);
        setParadaData(data);
        setEventOptions({...eventOptions, showSalidaParadasDialog: true});

    }

    const closeSalidaDialog = () => {
        setEventOptions({...eventOptions, showSalidaParadasDialog: false});
    }

    const showLlegadaDialog = (data) => {
        setParadaData(data);
        setEventOptions({...eventOptions, showLlegadaParadasDialog: true});
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
            IdRuta: paradaData.m_nIdRuta,


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
                console.log(respuesta.data);
                getParadasListado(paradaData.m_nIdViaje)
                getAllData()
            })
            .catch((err) => {
                console.log(err);
                showSuccess(err);
            });


    }

    function updateLlegada(data) {
        console.log("Actualizar datos de llegada");
        console.log(data);

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
            IdRuta: paradaData.m_nIdRuta,
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


        agregarViajeLlegada(params)
            .then((respuesta) => {
                showSuccess(respuesta.data);
                console.log(respuesta.data);
                getParadasListado(paradaData.m_nIdViaje)
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

    return (
        <div>
            {
                informeSeleccionado &&
                <Dialog open={eventOptions.showDetalleGuias}
                        onClose={() => setEventOptions({...eventOptions, showDetalleGuias: false})}
                        fullWidth={true}
                        maxWidth={'md'}>
                    <DialogTitle>
                        Detalle de Informe - {informeSeleccionado.m_clsInforme.m_sFolioInforme}
                    </DialogTitle>
                    <DialogContent>
                        <DetalleInforme guias={informeSeleccionado.m_clsInforme.m_arrClsProGuia}>
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
                <Dialog open={eventOptions.showSalidaParadasDialog}
                        onClose={closeSalidaDialog}
                        fullWidth={true}
                        maxWidth={'xl'}>
                    <DialogTitle><h2>Salida de Paradas</h2></DialogTitle>
                    <DialogContent>
                        <SalidaParadas onSubmit={updateSalida} data={paradaData.m_clsInforme}>
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
                        <LlegadaParadas onSubmit={updateLlegada} data={paradaData.m_clsInforme} viaje={viajeSeleccionado}>
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
                            <a onClick={(event) => {
                                event.stopPropagation();
                                getAllData()
                                setState({...state, agregar: "Viaje", open: true});
                                $('.nav-tabs li ').removeClass('active');
                                $('.nav-tabs li').eq(0).addClass('active');
                                $('.tab-content div ').removeClass('in show');
                                $('#Listado').addClass('in show');
                            }}>
                                <i className="fa fa-list"/> Listado
                            </a>
                        </li>
                        <li>
                            <a onClick={handleShowAgregar}>
                                <i className="fa fa-plus-circle"/> {state.agregar}
                            </a>
                        </li>
                        <li>
                            <a onClick={() => {
                                setState({
                                    ...state,
                                    identificadorModal:
                                        "imprimir",
                                    tipoModal: 6,
                                    openDialog: true
                                });
                            }}>
                                <i className="fa fa-print"/> Imprimir
                            </a>
                        </li>

                    </ul>

                    <div className="row" className="tab-content">
                        <div className="widget-wrap" id="Listado" className="tab-pane fade in show">
                            <div className="widget-wrap">
                                <div className="widget-content">

                                    <Filtros
                                        listaResultado={setDataListado}
                                        viajes={true}
                                    />

                                    <div className="row" style={{height: "300px", width: '100%'}}>
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
                                                        paradasListado.map((p, index) => {

                                                            return (
                                                                <div>
                                                                    <ListItem
                                                                    >

                                                                        <ListItemText primary={`Ruta: ${p.m_sOrigen}  - ${p.m_sDestino}`}/>
                                                                        {
                                                                            !p.m_dFechaSalida  &&

                                                                            <Link style={{cursor: "pointer"}}
                                                                                  onClick={() => showSalidaDialog(p)}>Marcar
                                                                                Salida</Link>
                                                                        }

                                                                        {!p.m_dFechaLlegada  && !p.m_dFechaSalida  &&
                                                                        "/"
                                                                        }


                                                                        {
                                                                            !p.m_dFechaLlegada &&

                                                                            <Link style={{cursor: "pointer"}}
                                                                                  onClick={() => showLlegadaDialog(p)}>Marcar
                                                                                Llegada</Link>
                                                                        }
                                                                        {indexOpen === index ?
                                                                            <ExpandLess style={{cursor: "pointer"}}
                                                                                        onClick={() => setIndexOpen(index === indexOpen ? -1 : index)}/> :
                                                                            <ExpandMore style={{cursor: "pointer"}}
                                                                                        onClick={() => setIndexOpen(index === indexOpen ? -1 : index)}/>}
                                                                    </ListItem>
                                                                    <Collapse in={indexOpen === index}
                                                                              timeout="auto" unmountOnExit>
                                                                        <div style={{height: "300px"}}>
                                                                            <DataGrid
                                                                                localeText={dataGridLocaleText}
                                                                                rows={p.informes}
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

                        <div className="widget-wrap" id="Agregar" className="tab-pane fade">

                            {
                                state.open &&
                                <AgregarViaje reload={getAllData} consult={state.consult} editar={state.edit} select={state.selectViaje} id={state.idViaje}/>

                            }

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
