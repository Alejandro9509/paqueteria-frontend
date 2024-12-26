import React, {useEffect, useState} from "react";
import Cabecera from "../Components/Template/Cabecera";
import BarraLateralIzquierda from "../Components/Template/BarraLateralIzquierda";
import BarraLateralDerecha from "../Components/Template/BarraLateralDerecha";
import * as XLSX from 'xlsx';
import { styled } from "@mui/material/styles";
import {DataGrid} from '@mui/x-data-grid';
import Noty from 'noty';
import AgregarViaje from "./Viajes/AgregarViaje";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import Select from "@mui/material/Select";
import TextField from "@mui/material/TextField";
import {dataGridLocaleText} from "../Constants";
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
    ListItemText, Link, Chip, Grid, MenuItem
} from "@mui/material";
import {obtenerEstatusDocumentos} from "../Util/Contexts/EstatusContext";
import {confirmAlert} from "react-confirm-alert";
import SalidaParadas from "./Viajes/SalidaParadas";
import LlegadaParadas from "./Viajes/LlegadaParadas";
import AsignarOperador from "./Viajes/AsignarOperador";
import {
    agregarViajeSalida,
    agregarViajeLlegada,
    obetenerViajeId,
    obtenerXML,
    obtenerViajesByFiltro,
    obtenerCFDI,
    obtenerReporteCFDIViaje,
    cancelarViaje,
    validarSalidaParada,
    cancelarTrayecto,
    eliminarViaje,
    validarCFDI
} from "../Util/Contexts/ViajesContext";
import ExpandLess from '@mui/icons-material/ExpandLess';
import ExpandMore from '@mui/icons-material/ExpandMore';
import {
    obtenerXMLCFDI
} from "../Util/Contexts/InformesContext";
import DetalleInforme from "./Viajes/DetalleInforme";
import {obtenerDetalleParadasIdViaje} from "../Util/Contexts/DetalleParadasContext";
import {obtenerSucursales} from "../Util/Contexts/SucursalContext";
import Filtros from "./Filtros/Filtros";
import {obtenerFechaFinal, obtenerFechaInicio} from "../Util/Contexts/UtileriasContext";
import CancelarSAT from "./SAT/CancelarSAT";
import {cancelarInformeCFDI, enviarCorreoCFDIViaje, obtenerClavesByInforme} from "../Util/Contexts/SATContext";
import EnvioCorreoDialogo from "./SAT/EnvioCorreoDialogo";
import CancelarTrayecto from "./Viajes/CancelarTrayecto";
import ReportesViajes from "./Viajes/Reportes";
import { validarPermisos } from "../Util/Contexts/UsuarioContext";
import { obtenerTrayectosByRuta } from "../Util/Contexts/RutasContext";
import {obtenerParametrosConfiguracion} from "../Util/Contexts/ParametrosConfiguracionContext";
import {
    imprimirFormatosIdTimbradoViajes,
    obtenerFormatosImpresionProceso
} from "../Util/Contexts/FormatosImpresionContext";
import {GridColDef} from "@mui/x-data-grid";
import {GridRenderCellParams} from "@mui/x-data-grid";
const PREFIX = 'Viajes';

const classes = {
    seleccionado: `${PREFIX}-seleccionado`,
    noSeleccionado: `${PREFIX}-noSeleccionado`,
    disabled: `${PREFIX}-disabled`
};

const Root = styled('div')({
    [`& .${classes.seleccionado}`]: {
        backgroundColor: "#FCC88F",
    },
    [`& .${classes.noSeleccionado}`]: {
        backgroundColor: "#FFFFFF",
    },
    [`& .${classes.disabled}`]: {
        pointerEvents: "none",
        cursor: "default",
    },
});

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
    const [openDialog, setOpenDialog] = useState(false)
    const [dataReportes, setDataReportes] = useState([])
    const [seleccion, setSeleccion] = useState(null)

    useEffect(()=>{

        obtenerFormatosImpresionProceso(218).then(({data}) => {
            setDataReportes(data)
        })
    }, [])


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
            if(idEstatus!=10){
                showSuccess("Para eliminar debe estar cancelado");
                return
            }

            confirmAlert({
                title: 'Confirmar Eliminar',
                message: '¿Está seguro de eliminar viaje?',
                buttons: [
                    {
                        label: 'Sí',
                        onClick: () => {
                            eliminarViaje(id,idEstatus).then(respuesta => {
                                showSuccess(respuesta.data)
                                getAllData();
                                setViajeSeleccionado(null);
                            }).catch(err => {
                                showSuccess(err)
                            })
                        }
                    },
                    {
                        label: 'No',
                    }
                ]
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
        $(window).unbind()
        getAllData();
        setViajeSeleccionado(null);
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
                $(window).unbind();
                $('.nav-tabs li ').removeClass('active');
                $('.nav-tabs li').eq(0).addClass('active');
                $('.tab-content div ').removeClass('in show');
                $('#Listado').addClass('in show');
                $('#Cancelar').removeClass('in show');
                $('#Cancelar').removeClass('active');
            }else{
                $('.nav-tabs li ').removeClass('active');
                $('.nav-tabs li').eq(3).addClass('active');
                $('.tab-content div ').removeClass('in show');
                $('#Cancelar').addClass('in show');
            }
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
        let fechaHoraActual=new Date();
        return fechaHoraActual.toISOString().split('T')[0] + "T" + fechaHoraActual.getHours().toString().padStart(2,'0')+':'+fechaHoraActual.getMinutes().toString().padStart(2,'0');
        //`${new Date().getFullYear()}-${`${new Date().getMonth() + 1}`.padStart(2, 0)}-${`${new Date().getDate()}`.padStart(2, 0)}T${`${new Date().getHours()}`.padStart(2, 0)}:${`${new Date().getMinutes()}`.padStart(2, 0)}`
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
                    <Root>
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
                               onClick={() => handleEliminar(row.row.m_nIdViaje,row.row.m_nIdEstatusViaje)}
                               disabled={!validarDerecho(9101442)}><i className="zmdi zmdi-delete"
                                                                      style={{color: "#F30B0B"}}/></a>

                        </Tooltip>
                    </Root>
                );
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
                            backgroundColor: `#${row.row.m_sColorEstatus}`,
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
        },
        {
            headerName: "Total Liquidación",
            field: "m_nTotalCalculoLiquidacionPorcentajeSobreImpFlete",
            width: 150,
            valueFormatter: ({value}) => currencyFormatter.format(Number(value)),
        },
        {
            headerName: "Viaje ERP",
            field: "FolioERP",
            width: 200,
        }

    ]);

    const currencyFormatter = new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
    });

    useEffect(value => {
        if (localStorage.getItem("UsuarioId") === null || localStorage.getItem("UsuarioId") <= 0) {
            showSuccess("Es necesario iniciar sesion para acceder a este proceso");
            window.location.replace("login");
            return;
        }
        //getInventarioUnidades()
    }, []);


    useEffect(value => {
        if(viajeSeleccionado){
            let rutaActiva = true;
            viajeSeleccionado.m_arrTrayectos.map((p, index) => {
                if(viajeSeleccionado.m_sEstatus === "Cancelado" || viajeSeleccionado.m_nIdEstatusViaje == 10){
                    p.deshabilitado = true;
                }else{
                    if (p.m_nIdSalida && !p.m_bSalidaCancelada && p.m_nIdLlegada) {
                        p.deshabilitado = false
                    } else if ((!p.m_nIdSalida || p.m_bSalidaCancelada) && rutaActiva) {
                        p.deshabilitado = false
                        rutaActiva = false
                    } else if (p.m_nIdSalida && !p.m_bSalidaCancelada && rutaActiva) {
                        p.deshabilitado = false
                        rutaActiva = false
                    } else {
                        p.deshabilitado = true
                    }
                }
                //console.log("p.m_nIdSalida"+p.m_nIdSalida+" p.m_nIdLlegada"+p.m_nIdLlegada+" "+" rutaActiva"+rutaActiva+" p.deshabilitado"+p.deshabilitado)
            })
        }
    }, [viajeSeleccionado]);

    function getAllData() {
        obtenerFechaInicio().then((respuestaUno) => {
            obtenerFechaFinal().then((respuestaDos) => {
                obtenerViajesByFiltro(respuestaUno.data[0].Fecha, respuestaDos.data[0].Fecha, 0, 0, 0, 0, 0).then((respuesta) => {
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
    function descargarPDFOpcion1(id,idInforme,folio) {
        obtenerReporteCFDIViaje(id, idInforme).then(({data}) => {
            try{
                const link = document.createElement('a');
                link.href = "data:application/pdf;base64," + data;
                link.setAttribute('download', "CFDI_ " + folio);
                document.body.appendChild(link);
                link.click();
            }catch (e) {
                console.log(e)
                showSuccess("No se pudo abrir el pdf")
            }
         })

    }

    function descargarPDF(idViaje,idInforme,folio) {

        setSeleccion({
            m_nIdViaje:idViaje,
            m_nIdInforme:idInforme,
            m_sFolioInforme:folio
        })
        setOpenDialog(true)
        /*obtenerReporteCFDIViaje(id, idInforme).then(({data}) => {
            try{
                const link = document.createElement('a');
                link.href = "data:application/pdf;base64," + data;
                link.setAttribute('download', "CFDI_ " + folio);
                document.body.appendChild(link);
                link.click();
            }catch (e) {
                console.log(e)
                showSuccess("No se pudo abrir el pdf")
            }*/
            /*try {
                var filename = folio+".pdf";
                var pom = document.createElement('a');
                var bb = new Blob([data], {type: 'application/pdf;base64'});
                pom.setAttribute('href', window.URL.createObjectURL(bb));
                pom.setAttribute('download', filename);

                pom.dataset.downloadurl = ['application/pdf;base64', pom.download, pom.href].join(':');
                pom.draggable = true;
                pom.classList.add('dragout');

                pom.click();
            }catch (e) {
                console.log(e)
                showSuccess("No se pudo abrir el pdf")
            }*/

            /*try {
                let pdfWindow = window.open("");
                pdfWindow.document.write("<embed  width='100%' height='100%' src='data:application/pdf;base64, " + encodeURI(data) + "'/>");
                pdfWindow.document.body.style.margin = "0px";
                pdfWindow.document.title = "CFDI_ " + folio;


            } catch (e) {
                console.log(e)
                showSuccess("No se pudo abrir el pdf")
            }*/
       /* })*/

    }

    const handleOnChangeReporte = (data) => {
        setState({
            ...state,
            reporteSeleccionado: data
        })
    }

    const handleGenerarReporte=(e)=>{
        e.preventDefault()

        if (state.reporteSeleccionado.length === 0) {
            showError("Es necesario seleccionar al menos un reporte")
            return
        }

        imprimirFormatosIdTimbradoViajes(state.reporteSeleccionado,seleccion.m_nIdViaje, seleccion.m_nIdInforme).then(({data}) => {
            let pdfWindow = window.open("");
            pdfWindow.document.write("<embed  width='100%' height='100%' src='data:application/pdf;base64, " + encodeURI(data.m_sArchivo) + "'/>");
            pdfWindow.document.body.style.margin = "0px";
            pdfWindow.document.title = "CFDI Timbrado Viajes" + seleccion.m_sFolioInforme;
        })
        setState({
            ...state,
            reporteSeleccionado: null
        })
        setOpenDialog(false)
    }

    function generarCFDI(idParada, folio, idViaje, sustituir, idInforme) {
        validarCFDI(idInforme).then(respuesta=>{
            obtenerParametrosConfiguracion().then(respuesta => {
                let titulo;
                let mensaje;
                if (respuesta.data.TimbradoPruebaGuia){
                    titulo = 'Confirmar timbrado de prueba'
                    mensaje = '¿Está seguro de realizar esta operación, el CFDI de traslado se timbrará en modo prueba? Para timbrar ante el SAT desactive el timbrado de prueba en parametros de configuración.'
                }else{
                    titulo = 'Confirmar timbrado ante el SAT'
                    mensaje = '¿Está seguro de realizar esta operación, el CFDI de traslado se timbrará ante el SAT?'
                }
                confirmAlert({
                    title: titulo,
                    message: mensaje,
                    buttons: [
                        {
                            label: 'Sí',
                            onClick: () => {
                                obtenerCFDI(idParada,sustituir).then((result) => {
                                    setState({...state, openEnvioCorreo: true, idInforme: idInforme, folio: folio, idViaje: idViaje})
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
            })
        }).catch(error=>{
            showError(error.response.data)
        })
    }

    function showCancelarCFDI(informe){
        setState(state => {
            return {...state,openCancelarSAT: true, informe: informe}
        })
    }

    function cancelarCFDI( data) {
        obtenerParametrosConfiguracion().then(respuesta => {
            let titulo;
            let mensaje;
            if (respuesta.data.TimbradoPruebaGuia){
                titulo = 'Confirmar cancelación de prueba'
                mensaje = '¿Está seguro de realizar la cancelación en modo prueba?\nPara timbrar ante el SAT desactive el timbrado de prueba en parametros de configuración.'
            }else{
                titulo = 'Confirmar cancelación ante el SAT'
                mensaje = '¿Está seguro de realizar la cancelación ante el SAT?'

            }
            confirmAlert({
                title: titulo,
                message: mensaje,
                buttons: [
                    {
                        label: 'Sí',
                        onClick: () => {
                            if (parseInt(data.idCancelacionSAT) === 1){
                                cancelarInformeCFDI(state.informe.m_nIdParada,data.idCancelacionSAT,data.motivoSAT,data.motivoCancelacion,data.folioRelacionado).then((result) => {
                                    obtenerCFDI(state.informe.m_nIdParada,true).then((result) => {
                                        setState(state => {
                                            return {...state, openEnvioCorreo: true, idInforme: state.informe.m_nIdInforme, folio: state.informe.m_sFolioInforme, idViaje: state.informe.m_nIdViaje}
                                        })
                                        getParadasListado(state.informe)
                                    }).catch((error) => {
                                        if (error.response){
                                            showError(error.response.data)
                                        }
                                    })
                                }).catch((error) => {
                                    if (error.response){
                                        showError(error.response.data)
                                    }
                                })

                            }else{
                                cancelarInformeCFDI(state.informe.m_nIdParada,data.idCancelacionSAT,data.motivoSAT,data.motivoCancelacion,data.folioRelacionado).then((result) => {
                                    getParadasListado(state.informe)
                                    showSuccess(result.data)
                                }).catch((error) => {
                                    if (error.response){
                                        showError(error.response.data)
                                    }
                                })
                            }
                        }
                    },
                    {
                        label: 'No',
                    }
                ]
            })
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

    const handleDescargarExcelComplementos = (idInforme, folioInforme) => {
        // generarArchivoExcel(datos)
        obtenerClavesByInforme(idInforme)
            .then((respuesta) => {
                exportarAExcel(respuesta.data.map((i) => ({
                    "Folio guia": i["Folio guia"],
                    "Clave SAT Producto o Servicio": i["Clave SAT Producto o Servicio"],
                    "Clave SAT Unidad": i["Clave SAT Unidad"],
                    "Cantidad": i["Cantidad"],
                    "Peso (kg)": i["Peso (kg)"],
                    "Material Peligroso": i["Material Peligroso"],
                    "Clave SAT Material Peligroso": i["Clave SAT Material Peligroso"],
                    "Clave SAT Embalaje": i["Clave SAT Embalaje"],
                    "Clave SAT Fraccion Arancelaria": i["Clave SAT Fraccion Arancelaria"]
                })), folioInforme)
            })
            .catch(e => {
                console.log(e)
            })

    };

    function exportarAExcel(jsonData, fileName) {
        // Crear una hoja de cálculo nueva
        let workbook = XLSX.utils.book_new();

        // Convertir el JSON a una hoja de cálculo
        let worksheet = XLSX.utils.json_to_sheet(jsonData);

        // Agregar la hoja de cálculo al libro
        XLSX.utils.book_append_sheet(workbook, worksheet, 'Tabla');
        // Guardar el archivo Excel
        XLSX.writeFile(workbook, fileName.replace('.','') + '.xlsx');
    }


    /**DETALLE DE PARADAS*/
    const columnsParadas:GridColDef=[
        {
            headerName: "Acciones",
            sortable: false, filterable: false,
            field: "",
            width: 150,
            renderCell: (row: GridRenderCellParams<any, any>) => {
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
                                   onClick={() => (generarCFDI(row.row.m_nIdParada, row.row.m_sFolioInforme, row.row.m_nIdViaje, false, row.row.m_nIdInforme))}><i className="zmdi zmdi-file-text"
                                                                                                                                             style={{color: "#F9A03E"}}/></a>

                            </Tooltip>
                        }
                        {
                            !viajeSeleccionado.m_bEsPermisionario && !viajeSeleccionado.m_bUnidadPermisionario && !row.row.m_bTimbrado &&
                            <Tooltip title="Descargar XML">
                                <a href="#" className="btn btn-default btn-xs"
                                   onClick={() => (descargarXMLCFDI(row.row.m_nIdInforme, row.row.m_sFolioInforme))}><i
                                    className="zmdi zmdi-download" style={{color: "#F9A03E"}}/></a>

                            </Tooltip>
                        }
                        {
                            <Tooltip title="Descargar Excel con complementos">
                                <a href="#" className="btn btn-default btn-xs"
                                   onClick={() => (handleDescargarExcelComplementos(row.row.m_nIdInforme, row.row.m_sFolioInforme))}><i
                                    className="zmdi zmdi-grid"
                                    style={{color: "#F9A03E"}}/></a>

                            </Tooltip>
                        }
                        {
                            !viajeSeleccionado.m_bUnidadPermisionario && row.row.m_bTimbrado &&
                            <Tooltip title="Descargar PDF">
                                <a href="#" className="btn btn-default btn-xs"
                                   onClick={() => (descargarPDF(state.idViaje,row.row.m_nIdInforme ,row.row.m_sFolioFiscalUUID))}><i
                                    className="zmdi zmdi-collection-pdf" style={{color: "#F9A03E"}}/></a>

                            </Tooltip>
                        }

                        {
                            !viajeSeleccionado.m_bUnidadPermisionario && row.row.m_bTimbrado &&
                            <Tooltip title="Descargar XML">
                                <a href="#" className="btn btn-default btn-xs"
                                   onClick={() => (descargarXMLCFDITimbrado(row.row.m_nIdInforme, row.row.m_sFolioFiscalUUID, row.row.m_sXMLTraslada))}><i
                                    className="zmdi zmdi-file-text" style={{color: "#F9A03E"}}/></a>

                            </Tooltip>
                        }

                        {
                            !viajeSeleccionado.m_bUnidadPermisionario && row.row.m_bTimbrado &&
                            <Tooltip title="Cancelar Timbrado SAT">
                                <a href="#" className="btn btn-default btn-xs"
                                   onClick={() => (showCancelarCFDI(row.row))}><i className="zmdi zmdi-card-off"
                                                                                  style={{color: "#F9A03E"}}/></a>

                            </Tooltip>
                        }
                    </div>
                )
            }
        },
        {
            headerName: "Folio Informe",
            field: "m_sFolioInforme",
            width: 200,
        },
        {
            headerName: "Origen - Destino",
            field: "origenDestino",
            width: 200,
            renderCell: (params: GridRenderCellParams<any, any>) => (
                <strong>
                    {params.row.m_sCiudadOrigen+"-"+params.row.m_sCiudadDestino}
                </strong>
            )
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
            renderCell: (row:GridRenderCellParams<any,any>) => {
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
            renderCell: row => {
                console.log(row)
                return row.row.m_sFolioFiscalUUIDSustituido == "" ?  row.row.m_sUltimoFolioFiscalUUIDSustituido : (row.row.m_sFolioFiscalUUIDSustituido || "")
            }
        },
        // {
        //     headerName: "Liq",
        //     field: "m_sNumeroNombreOperador",
        //     width: 80,
        // }, */
    ]

    const [paradasListado, setParadasListado] = React.useState([]);

    const [paradaData, setParadaData] = React.useState();
    const [kms, setKms] = React.useState(0);

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

    const showSalidaDialog = (e,data) => {
        e.preventDefault()
        obtenerParametrosConfiguracion().then(parametros => {
            if (parametros.data.ValidarTimbrado) {
                validarSalidaParada(data.m_nIdViaje).then((respuesta)=>{
                    let encontrado = respuesta.data.find(parada=>parada.Timbrado==false)
                    // let qr = respuesta.data.find(parada=>parada.Escaneado==false)

                    if(encontrado){//si encontro valor falso en timbrado
                        showError(`No se puede marcar salida ya que no se ha generado CFDI para el folio: ${encontrado.FolioInforme}`)
                        return
                    }else {
                        setParadaData(data);
                        setEventOptions({...eventOptions, showSalidaParadasDialog: true});
                    }

                    //  if(qr){//si encontro valor falso en qr
                    //    showSuccess(`No se puede marcar salida ya que no se ha escaneado los paquetes en el remolque: ${qr.FolioInforme}`)
                    //}else{

                    //}
                })
            }else {
                setParadaData(data);
                setEventOptions({...eventOptions, showSalidaParadasDialog: true});
            }
        })

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
            obtenerTrayectosByRuta(data.m_nIdRuta).then((resp) => {
                var a=resp.data.find((element)=>element.IdOrigen===data.m_nIdOrigen)
                setKms(a.Kilometros)
            })
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

        agregarViajeSalida(params)
            .then((respuesta) => {
                showSuccess(respuesta.data);
                //getParadasListado(paradaData)
                getAllData()
            })
            .catch((err) => {
                showSuccess(err.response?.data);
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
            m_nKmViaje: kms,
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

        agregarViajeLlegada(params)
            .then((respuesta) => {
                showSuccess(respuesta.data);
                console.log(respuesta.data);
                //getParadasListado(paradaData)
                getAllData()

            })
            .catch((err) => {
                console.log(err);
                showSuccess(err.response?.data);
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

    const setDataListado = (listado) => {
        setData(listado)
    }

    const handleCancelar = (e) => {
        if (e){
            e.preventDefault();
        }
        let params = {
            motivoCancelacion: state.motivoCancelacion,
            m_nIdUsuarioCancelacion: localStorage.getItem("UsuarioId"),
            fechaCancelacion: state.fechaCancelacion.replace('T', ' '),
        };
        cancelarViaje(state.idViaje,params).then((respuesta) => {
            showSuccess(respuesta.data)
            handleShowListado()
        }).catch(err => {
            showSuccess(err.response?.data)
        });
    };

    function envioCorreoAction(data) {
        enviarCorreoCFDIViaje(state.idInforme, data.correos, data.correoDefault,viajeSeleccionado.id).then(({data}) => {
            showSuccess(data);
            descargarPDF(viajeSeleccionado.id,state.idInforme, state.folio)
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
                openDialog &&
                <Dialog
                    open={openDialog}
                    onClose={() => setOpenDialog(false)}
                    fullWidth maxWidth="md"
                >
                    <DialogTitle>
                        Reporte de CFDI TimbradoViajes
                    </DialogTitle>
                    <DialogContent>
                        <div className="row" style={{backgroundColor: '#FFFFFF'}}>
                            <form onSubmit={handleGenerarReporte}>
                                <Grid container spacing={1}>
                                    <Grid item sm={6}>
                                        <FormControl
                                            className="input select"
                                            fullWidth variant="outlined"
                                            required
                                            size="small">
                                            <InputLabel
                                                id="idReporteLabel">Formato de Reporte</InputLabel>
                                            <Select
                                                fullWidth
                                                labelId="idReporteLabel"
                                                label="Reporte"
                                                className="form-control"
                                                value={state.reporteSeleccionado ?? ''}
                                                onChange={(e) => handleOnChangeReporte(e.target.value)}
                                                name="reporteSeleccionado"
                                            >
                                                {dataReportes.map((reporte) => (
                                                    <MenuItem
                                                        key={reporte.m_nIdFormato}
                                                        value={reporte.m_nIdFormato}
                                                    >
                                                        {reporte.m_sFormato}
                                                    </MenuItem>
                                                ))}
                                            </Select>
                                        </FormControl>
                                    </Grid>
                                </Grid>
                                <DialogActions>

                                    <button className="btn btn-secondary secondary-btn" onClick={() => {
                                        setOpenDialog(false)
                                        setState({
                                            ...state,
                                            reporteSeleccionado: null
                                        })
                                    }
                                    }>
                                        Cancelar
                                    </button>
                                    <button className="btn btn-primary primary-btn" color={"primary"} type={"submit"}>
                                        Aceptar
                                    </button>
                                </DialogActions>
                            </form>
                        </div>
                    </DialogContent>
                </Dialog>
            }
            {
                state.openEnvioCorreo &&
                <EnvioCorreoDialogo onSubmit={envioCorreoAction} open={state.openEnvioCorreo} close={() => {
                    setState({...state, openEnvioCorreo: false});
                    descargarPDF(viajeSeleccionado.id,state.idInforme, state.folio);
                    getParadasListado({m_nIdViaje: state.idViaje})
                }}/>
            }
            {state.openCancelarSAT &&
                <CancelarSAT open={state.openCancelarSAT}
                             onSubmit={cancelarCFDI}
                             close={() => setState({...state, openCancelarSAT: false})}
                             data={{
                                folioSustituye: state.informe.m_sFolioFiscalUUID,
                                m_sFolio: state.informe.m_sFolioInforme,
                                folioCancelar: state.informe.m_sFolioFiscalUUIDSustituido || state.informe.m_sFolioFiscalUUID
                             }}
                />
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
                eventOptions.showCancelarParadasDialog &&
                <CancelarTrayecto onSubmit={cancelarTrayectos} open={eventOptions.showCancelarParadasDialog}
                                  close={() => closeCancelarDialog()} data={paradaData}>
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
                        <LlegadaParadas onSubmit={updateLlegada} viaje={viajeSeleccionado} parada={paradaData} distancia={kms} handleChangeKms={(e)=>setKms(e.target.value)}>
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
                            <a className={validarDerecho(9101439) ? "" : classes.disabled} onClick={handleShowAgregar}>
                                <i className="fa fa-plus-circle"/> {state.agregar}
                            </a>
                        </li>
                        <li>
                            <a className= {validarDerecho(9101444)? "":"hide"} onClick={handleShowReportes}>
                                <i className="fa fa-print"/> Reportes
                            </a>
                        </li>
                        <li>
                            <a

                                className={(state.idViaje === 0 || !validarDerecho(9101443)) ? classes.disabled : ""}
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

                                    <div style={{height: "300px", width: '100%'}}>
                                        <DataGrid
                                            localeText={dataGridLocaleText}
                                            rows={data}
                                            columns={columns}
                                            density="compact"
                                            getRowId={(row) => row.m_nIdViaje}
                                            rowsPerPageOptions={[]}
                                            onRowSelectionModelChange={(newModel)=>{
                                                if(newModel.length<1)
                                                    return
                                                let row=data.find(i=>i.m_nIdViaje==newModel[0])
                                                setViajeSeleccionado(row)
                                                getParadasListado(row)
                                            }}
                                            /*onRowSelected={(row) => {
                                                /*  setState({
                                                     ...state,
                                                     idViaje: row.data.m_nIdViaje
                                                 })
                                                setViajeSeleccionado(row.data)
                                                getParadasListado(row.data)
                                            }}*/
                                        />

                                    </div>
                                </div>
                            </div>
                            <div className="row">

                                <div className="widget-wrap" style={{height: "300px", width: '100%', overflow: "auto"}}>
                                    <div className="widget-content">
                                        <div className="col-md-12">
                                            <div style={{
                                                color: '#717171',
                                                marginBottom: "10px",
                                                fontSize: "18px"
                                            }}>Detalle de
                                                Paradas
                                            </div>

                                            <div className="row"
                                            >
                                                <List>
                                                    {
                                                        viajeSeleccionado && viajeSeleccionado.m_arrTrayectos.map((p, index) => {

                                                            const informesFiltrados = paradasListado.filter((i, ind) => ((i.m_nIdDestino === p.m_nIdDestino) || ((viajeSeleccionado.m_arrTrayectos.length - 1) === index && !viajeSeleccionado.m_arrTrayectos.map(t => t.m_nIdDestino).includes(i.m_nIdDestino))))

                                                            return (
                                                                <div>
                                                                    <ListItem button
                                                                              key={p.m_nIdDestino + index + p.m_nIdOrigen}
                                                                              onClick={() => handleClick(index)}
                                                                    >

                                                                        <ListItemText primary={`Ruta: ${p.m_sRuta}`}/>
                                                                        {
                                                                            ((!p.m_nIdSalida || p.m_bSalidaCancelada) && !p.deshabilitado) &&
                                                                            <Link style={{cursor: "pointer"}} onClick={(e) => showSalidaDialog(e, p)}>Marcar Salida</Link>
                                                                        }
                                                                        {
                                                                            p.m_nIdSalida && !p.m_nIdLlegada && !p.m_bSalidaCancelada && !p.deshabilitado &&
                                                                            <>
                                                                                <Link style={{cursor: "pointer"}} onClick={() => showCancelarDialog(p)}>Cancelar Salida</Link>
                                                                                -
                                                                            </>
                                                                        }

                                                                        {/*{!p.m_dFechaLlegada  && !p.m_dFechaSalida  &&
                                                                        "/"
                                                                        }*/}


                                                                        {
                                                                            p.m_nIdSalida && !p.m_bSalidaCancelada && !p.m_nIdLlegada && !p.deshabilitado &&

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
                                                                        <div style={{height: `${100 + (informesFiltrados.length * 30)}px`}}>
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
                                    viajeSeleccionado={viajeSeleccionado}
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
                                            <form className="j-forms" onSubmit={handleCancelar} onKeyDown={e => {
                                                if (e.code === 13) {
                                                    e.preventDefault()
                                                }
                                            }}>
                                                <div className="form-content">
                                                    <div className="col-sm-6 col-md-2-5 col-lg-2-5 unit">
                                                        <div className="input">
                                                            <TextField variant="outlined" size="small"
                                                                       label="Folio Viaje"
                                                                       className="form-control"
                                                                       type="text"
                                                                       fullWidth
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
                                                                       fullWidth
                                                                       InputLabelProps={{shrink: true,}}
                                                                       value={state.sucursalCancelacion}
                                                                       id="sucursalCancelacion"
                                                                       disabled
                                                            />
                                                        </div>
                                                    </div>

                                                    <div className="col-sm-6 col-md-2-5 col-lg-2-5 unit">
                                                        <div className="input">
                                                            <TextField variant="outlined" margin="dense"
                                                                       label="Fecha de cancelación"
                                                                       fullWidth
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
                                                                       fullWidth
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
                                                                       fullWidth
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
                                                                       fullWidth
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
