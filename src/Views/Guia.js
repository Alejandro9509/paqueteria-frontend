import React, {useEffect, useState, useMemo} from "react";
import axios from "axios";
import {getCurrentDateTime,getCurrentTime,getCurrentDate} from "../Util/Util"
import Cabecera from "../Components/Template/Cabecera";
import IconButton from "@material-ui/core/IconButton";
import RestartAltIcon from '@material-ui/icons/Refresh';
import BarraLateralIzquierda from "../Components/Template/BarraLateralIzquierda";
import BarraLateralDerecha from "../Components/Template/BarraLateralDerecha";
import {Tab, Tabs, Box, InputAdornment, Button, Grid, FormControlLabel, Checkbox, Accordion, AccordionSummary, Typography, Chip, List, ListItem, ListItemIcon, ListItemText} from '@material-ui/core';
import ConceptosAdicionalesManiobra from './Tarifas/ConceptosAdicionalesManiobra';
import ConceptosAdicionalesEntrega from './Tarifas/ConceptosAdicionalesEntrega';
import ConceptosAdicionalesRecoleccion from './Tarifas/ConceptosAdicionalesRecoleccion';
import Carousel, {propTypes} from "re-carousel";
import IndicatorDots from "../Util/Dots";
import Buttons from "../Util/CarruselButtons";
import {makeStyles} from "@material-ui/core/styles";
import * as XLSX from 'xlsx';
import {useTable, useFilters, useAsyncDebounce, useSortBy} from 'react-table'
import $ from 'jquery';
import {getUniqueListBy, validarDerecho, remove_array_element} from "../Util/Util";
import Barra from "../Util/jquery-barcode"
import {DataGrid, GridToolbarContainer, GridToolbarExport} from '@material-ui/data-grid';
import {obtenerFechaInicio, obtenerFechaFinal} from "../Util/Contexts/UtileriasContext";
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';

import {
    obtenerZonaTarifaByIdCodigoPostal,
  } from "../Util/Contexts/ZonaTarifaContext";
import Noty from 'noty';
import {
    Dialog,
    DialogActions,
    DialogContent,
    AccordionDetails,
    DialogTitle,
    FormControl,
    InputLabel,
    Select,
    Step,
    StepLabel,
    Stepper,
    TextField,
    Tooltip
} from "@material-ui/core";
import {API_HEADERS, dataGridLocaleText, TICKET_ZABRA_TAMPLATE, TICKET_ZABRA_TAMPLATE_PLATEROS} from "../Constants";
import {obtenerCiudades} from "../Util/Contexts/CiudadesContext";
import {obtenerEstatusGuia} from "../Util/Contexts/EstatusContext";
import {obtenerEmbarquesId, obtenerEmbarqueMoneda, obtenerEmbarquesFiltro} from "../Util/Contexts/EmbarquesContext";
import {
    ultimoFolioGuia,
    eliminarGuia,
    obtenerGuiaId,
    cancelarGuia,
    obtenerGuiasFiltro,
    obtenerGuia,
    modificarGuia,
    agregarGuia,
    imprimirGuia,
    obtenerGuiaReporte,
    entregaOcurreGuia,
    cambiarTipoCobro,
    cambiarEstatusGuia,
    obtenerValidacionGuia,
    asignarTrayectos,
    validarEliminarGuia,
    obtenerGuiaReporteEtiqueta,
    validarCancelarGuia, obtenerGuiaReporteEtiquetaParcial
} from "../Util/Contexts/GuiaContext";
import {obtenerMonedas} from "../Util/Contexts/MonedaContext";
import {obtenerTipoCambio} from "../Util/Contexts/TipoCambioContext";
import {validarPermisos} from "../Util/Contexts/UsuarioContext";
import {obtenerSucursales} from "../Util/Contexts/SucursalContext";
import {
    obtenerConceptosDefectoListado,
    obtenerConceptosFacturacion
} from "../Util/Contexts/ConceptosFacturacionContext";
import {obtenerTipoCobro} from "../Util/Contexts/TipoCobroContext";
import {obtenerTipoServicio} from "../Util/Contexts/TipoServiciosContext";
import {obtenerImpuestosTipo} from "../Util/Contexts/ImpuestosContext";
import {imprimirFormatosId, obtenerFormatosImpresion} from "../Util/Contexts/FormatosImpresionContext";
import {obtenerCodigoPostalId} from "../Util/Contexts/CodigoPostalContext";
import {obtenerRecoleccionFiltro} from "../Util/Contexts/RecoleccionContext";
import {confirmAlert} from "react-confirm-alert";
import ConceptosFacturacion from "./Tarifas/ConceptosFacturacion";
import Paquetes from "./Paquetes/Paquetes";
import {obtenerProductoById} from "../Util/Contexts/ProductosContext";
import {obtenerEmbalajesId} from "../Util/Contexts/EmbalajesContext";
import CambiarTipoCobro from "./Guia/CambiarTipoCobro";
import Ocurre from "./Guia/Ocurre";
import ConceptosFacturacionGuias from "./Tarifas/ConceptosFacturacionGuias";
import Filtros from "./Filtros/Filtros";
import {obtenerParametrosConfiguracion} from "../Util/Contexts/ParametrosConfiguracionContext";
import CambiarEstatus from "./Guia/CambiarEstatus";
import AsignarTrayectos from "./Guia/AsignarTrayectos";
import ImprimirEtiquetas from "./Guia/ImprimirEtiquetas";
import {obtenerTiposPago} from "../Util/Contexts/TipoPagoContext";
import Evidencias from "./Evidencias";
import Cubicar from "./Cubicar/Cubicar";

function showSuccess(mensaje) {
    new Noty({
        type: "information",
        layout: "topCenter",
        text: mensaje,
        timeout: "3000"
    }).show()
}


window.jQuery = window.$ = $;
var EB = window.EB;
var BrowserPrint = window.BrowserPrint;
var selected_device;
var devices = [];
const styles = {
    paqueteCarrusel: {
        height: "190px !important",
        // position: "initial !important"
    },
    conceptoCarrusel: {
        height: "70px !important",
        position: "initial !important"
    },
    seleccionado: {
        backgroundColor: "#FCC88F",
    },
    noSeleccionado: {
        backgroundColor: "#FFFFFF",
    },
    disabled: {
        pointerEvents: "none",
        cursor: "default",
    }
};

const useStyles = makeStyles(styles);

function Guia(props) {
    let today = new Date();
    let React = require('react');
    let QRCode = require('qrcode.react');
    const classes = useStyles();
    localStorage.getItem("UsuarioId");

    const [data, setData] = React.useState([])
    const [dataTipoCambio, setDataTipoCambio] = React.useState([]);

    //Listado de sucursales. Se usa en listado y agregar.
    const [dataSucursal, setDataSucursal] = React.useState([])
    const [dataMoneda, setDataMoneda] = React.useState([])
    const [dataTipoCobro, setDataTipoCobro] = React.useState([])
    const [dataTipoPago, setDataTipoPago] = React.useState([])
    const [dataEstatusGuia, setDataEstatusGuia] = React.useState([])
    const [dataEmbarque, setDataEmbarque] = React.useState([])
    const [dataTipoServicio, setDataTipoServicio] = React.useState([])
    const [showDialogOcurre, setShowDialogOcurre] = useState(false)
    const [dataOcurre, setDataOcurre] = useState()
    const [conceptosAdicionales, setConceptosAdicionales] = useState([])
    const [dataConceptosBase, setDataConceptosBase] = useState([])
    const [dataPaquetes, setDataPaquetes] = useState([])
    const [guiaSeleccionada, setGuiaSeleccionada] = useState(null)
    const [state, setState] = React.useState({
        //VARIABLES PARA LISTADO DE GUIAS
        sucursalListado: 0,
        fechaFinal: 0,
        fechaInicial: 0,
        estatusListado: 0,
        idGuia: 0,
        //VARIABLES PARA CANCELAR GUIA
        //variable de folioGuia es la misma que en agregar
        usuarioCancela: "",
        FolioGuiaRelacionada: "",
        fechaCancelado: "",
        usuarioCancelacion: 0,
        estatusGuia: "",
        MotivoCancelacion: "",
        folioEmbarque:"",
        //VARIABLES PARA AGREGAR GUIA
        //Informacion General
        idSucursalAgregar: localStorage.getItem("Sucursal"),
        folioGuia: "",
        idEmbarque: 0,
        folioInforme: "",
        tracking: "",
        fecha: "",
        idEstatusGuia: 4,
        idMoneda: 1,
        idTipoTarifa: 2,
        tipoCambio: 0,
        validarEmbarqueGuia:false,
        //Remitente
        nombreRemitente: "",
        RFCRemitente: "",
        domicilioRemitente: "",
        codigoPostalRemitente: "",
        ciudadRemitente: 0,
        correoRemitente: "",
        telefonoRemitente: "",
        contactoRemitente: "",
        origenRemitente: "",
        zonaTarifaRemitente: '',
        //Destinatario
        sNombreDestinatario: "",
        sRFCDestinatario: "",
        sDomicilioDestinatario: "",
        codigoPostalDestinatario: "",
        ciudadDestinatario: "",
        sCorreoDestinatario: "",
        sTelefonoDestinatario: "",
        sContactoDestinatario: "",
        CiudadDestino: "",
        zonaTarifaDestinatario: '',
        //Paquetes/sobres
        paquetes: [
            {
                peso: "",
                largo: "",
                ancho: "",
                alto: "",
                volumen: "",
                tipoEmbalaje: "",
                valorDeclarado: "",
                descripcionPaquete: "",
                ctd: "",
                observacionesPaquete: "",
                id: ""
            },
        ],
        sobres: [
            {
                descripcionSobre: "",
                id: ""
            },
        ],
        //Detalle de faturación
        idTipoCobro: 0,
        idTipoServicio: 2,
        ValorDeclarado: "",
        porcentajeSeguro: '',
        //Conceptos de facturacion
        conceptosAdicionales: [],
        ivaTraslada: [],
        ivaRetiene: [],
        tieneRecoleccion: false,
        tieneEntregaDomicilio: false,
        tieneCita: false,

        //VARIABLES PARA TAB IMPRIMIR (creo)
        paquetesI: [{
            CiudadOrigen: "",
            Remitente: "",
            CiudadRemitente: "",
            RFC: "",
            Direccion: "",
            Zona: "",
            CP: 0,
            Telefono: "",
            CiudadDestino: "",
            RFCDestinatario: "",
            DireccionDestinatario: "",
            ZonaDestinatario: "",
            CPDestinatario: 0,
            CiudadDestinatario: "",
            TelefonoDestinatario: "",
            FolioPaquete: "",
            Cantidad: 0,
            Descripcion: ""
        }],

        //VARIABLES PARA VISTAEN GENERAL
        agregar: "Agregar",
        height: window.innerHeight,
        creadoPor: localStorage.getItem("UsuarioId"),
        modificadoPor: localStorage.getItem("UsuarioId"),
        creadoEl: "",
        modificadoEl: "",
        openDialog: false,
        openDialogEtiquetas:false,
        detallesPaquetesEtiquetas:[],
        receptorGuia:[],
        referencia:[],

    })
    const columns = React.useMemo(() => [
        {
            headerName: "Acciones",
            sortable: false, filterable: false,
            width: 200,
            field: "",
            renderCell: (row) => {
                return (
                    <div>
                        <Tooltip title="Modificar" disabled={!validarDerecho(9101457)}>
                            <a
                                onClick={() => (handleShowModificar(row.row,row.row.m_nIdGuia,row.row.m_nFolioGuia))}
                                className="btn btn-default btn-xs"><i className="fa fa-pencil-square-o"
                                                                      style={{color: "#F9A03E"}}/></a>

                        </Tooltip>
                        <Tooltip title="Consultar">
                            <a className="btn btn-default btn-xs"
                               onClick={() => (handleShowConsultar(row.row.m_nIdGuia))}><i className="fa fa-eye"
                                                                                           style={{color: "#F9A03E"}}/></a>

                        </Tooltip>
                        <Tooltip title="Reporte" disabled={!validarDerecho(9101462)}>
                            <a className="btn btn-default btn-xs"
                               onClick={() => generarReporte(row.row.m_nIdGuia, row.row.m_nFolioGuia)}><i
                                className="zmdi zmdi-file"
                                style={{color: "#F9A03E"}}/></a>

                        </Tooltip>
                        { row.row.EntregaEnSucursal &&
                        <Tooltip title="Ocurre" disabled={!validarDerecho(9101463)}>
                            <a className="btn btn-default btn-xs"
                               onClick={(event) => mostrarDialogoOcurre(event, row.row.m_nIdGuia)}><i
                                className="zmdi zmdi-sign-in" style={{color: "#F9A03E"}}/></a>

                        </Tooltip>
                        }
                        <Tooltip title="Imprimir" disabled={!validarDerecho(9101464)}>
                            <a className="btn btn-default btn-xs"
                               onClick={(event) => {
                                   /*mostrarDialogoEtiqueta(event,row.row.m_nIdGuia)*/
                                   printTicket(row.row.m_nIdGuia)
                               }}>
                                <i className="zmdi zmdi-print" style={{color: "#F9A03E"}}/>
                            </a>

                        </Tooltip>
                        <Tooltip title="Descargar PDF con etiquetas" disabled={!validarDerecho(9101465)}>
                            <a className="btn btn-default btn-xs" onClick={() => generarReporteEtiqueta(row.row.m_nIdGuia, row.row.m_nFolioGuia)}>
                                <i className="zmdi zmdi-inbox" style={{color: "#F9A03E"}}/>
                            </a>

                        </Tooltip>

                        <Tooltip title="Eliminar" disabled={!validarDerecho(9101458)}>
                            <a className="btn btn-default btn-xs"
                               onClick={() => (handleEliminar(row.row.m_nIdGuia))}><i className="zmdi zmdi-delete"
                                                                                      style={{color: "#F30B0B"}}/></a>

                        </Tooltip>
                    </div>
                )
            }
        },
        {
            headerName: "Fecha/Hora Elaboración",
            field: "m_sFechaHora",
            width: 200,
        },
        {
            headerName: "Folio Guía",
            field: "m_nFolioGuia",
            width: 150,
        },
        {
            headerName: "Estatus Guía",
            field: "m_sEstatusGuia",
            width: 200,
            renderCell: (row) => {
                return (
                    <div align={"center"} style={{width: "100%"}}>
                        <Chip size="small" style={{
                            backgroundColor: `${row.row.m_sColorEstatus}`,
                            padding: "1px"
                        }} label={row.row.m_sEstatusGuia}/>
                    </div>
                )
            }
        },
        {
            headerName: "Origen",
            field: "m_sCiudadOrigen",
            width: 150,
        },
        {
            headerName: "Destino",
            field: "m_sCiudadDestino",
            width: 150,
        },
        {
            headerName: "Tipo cobro",
            field: "m_sTipoCobro",
            width: 200,
        },
        {
            headerName: "Tracking",
            field: "m_sTracking",
            width: 150,
        },
        {
            headerName: "Referencia",
            field: "m_sReferencia",
            width: 150,
        },
        {
            headerName: "Subtotal",
            field: "m_cSubtotal",
            width: 125,
            valueFormatter: ({value}) => currencyFormatter.format(Number(value)),

        },
        {
            headerName: "Cliente",
            field: "m_sCliente",
            width: 300,
        },
        {
            headerName: "Sucursal",
            field: "m_sSucursal",
            width: 200,
        },
        {
            headerName: "Folio Informe",
            field: "m_sFolioInforme",
            width: 200,
        },
        {
            headerName: "Folio Embarque",
            field: "m_sFolioEmbarque",
            width: 200,
        },
        {
            headerName: 'Fecha de Cancelación',
            field: 'Fecha de Cancelación',
            width: 200,
            renderCell: (row) => {
                return (
                    <>
                        {row.row.m_dtFechaCancelacion?row.row.m_dtFechaCancelacion.substring(0,10)+" ":""}{row.row.m_sHoraCancelacion}

                    </>
                )
            },
        },
        {
            headerName: "Usuario de Cancelación",
            field: "m_sUsuarioCancelacion",
            width: 200,
        },
        {
            headerName: "Remitente",
            field: "m_sRemitente",
            width: 200,
            hide:true
        },
        {
            headerName: "Destinatario",
            field: "m_sDestinatario",
            width: 200,
            hide:true
        },
        {
            headerName: "Cajas",
            field: "m_nCajas",
            width: 200,
            hide:true
        },
        {
            headerName: "Valor declarado",
            field: "m_nValorDeclarado",
            width: 200,
            hide:true
        },
        {
            headerName: "Observaciones",
            field: "m_sObservaciones",
            width: 200,
            hide:true
        },
        {
            headerName: "Factura",
            field: "m_sFactura",
            width: 225
        },
        {
            headerName: "Folio ERP",
            field: "FolioERP",
            width: 200
        },


    ]);
    const [open, setOpen] = React.useState(false);

    const handleClickOpen = () => {
      setOpen(true);
    };

    const handleClose = () => {
      setOpen(false);
    };
    const handleAceptarColumnas = () => {
        //AQUI SE VALIDARAN QUE HAYA POR LO MENOS UNA COLUMNA SELECCIONADA
        if(checked.length<=0){
            showSuccess("Requiere seleccionar por lo menos una columna")
            return
        }

        if(data.length<=0){
            showSuccess("Requiere por lo menos un registro de guia para exportar")
            return
        }
        //FILTRAR COLUMNS Y OBTENER TAMBIEN EL FIELD ATRAVES DE checked
       let arrayFiltrado =  checked.map(col=>{
            return columns.filter(columna=>columna.headerName==col)[0]

        })

        let campos = arrayFiltrado.map(f=>f.field)

        let datosfiltrados =  data.map(datos=>{

        return Object.keys(datos).
        filter((key) => campos.some(c=>c==key)).
        reduce((cur, key) => {
            let llave = arrayFiltrado.filter(f=>f.field==key)[0].headerName
            return Object.assign(cur, { [llave]: datos[key] })}, {});
        })

        const worksheet = XLSX.utils.json_to_sheet(datosfiltrados);
        const max_width = arrayFiltrado.map((w, r) => {return {wch:17}});
        worksheet["!cols"] =  max_width;
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, "Guias");
        var ws = workbook.Sheets["Guias"];
        var C = XLSX.utils.decode_col("D"); // 1
        var fmt = '$0.00';
        //BUSCAR INDEX DE LAS COLUMNAS Y SACAR EL INDEX DEL TOTAL
        var range = XLSX.utils.decode_range(ws['!ref']);
        console.log("range s r "+range.s.c)
        console.log("range e r"+range.e.c)
        for(var i = range.s.c; i <= range.e.c; ++i) {
            var ref = XLSX.utils.encode_cell({r:0, c:i});
            console.log("ref: "+ws[ref].v)
            if(ws[ref].v=="Total" || ws[ref].v=="Valor declarado"){
                for(var j = range.s.r + 1; j <= range.e.r; ++j) {
                    var ref = XLSX.utils.encode_cell({r:j, c:i});
                    if(!ws[ref]) continue;
                    if(ws[ref].t != 'n') continue;
                    ws[ref].z = fmt;
                  }
            }

        }

        XLSX.utils.sheet_add_aoa(worksheet, [], { origin: "A1" });
        XLSX.writeFile(workbook, "Guias.xlsx");

      };

    const [checked, setChecked] = React.useState(columns.filter(col=>col.headerName!="Acciones").map(col=>col.headerName));

    const handleToggle = (value) => () => {
      const currentIndex = checked.indexOf(value);
      const newChecked = [...checked];
      if (currentIndex === -1) {
        newChecked.push(value);
      } else {
        newChecked.splice(currentIndex, 1);
      }

      setChecked(newChecked);
    };

    useEffect(() => {
        console.log(conceptosAdicionales.length)
    }, [conceptosAdicionales])

    async function getParametrosConfiguracion(){
        obtenerParametrosConfiguracion().then(respuesta=>{
            console.log(respuesta)
            setState(state=>{
                return{
                    ...state,
                    estatusGuia:respuesta.data.EstatusGuia,
                    idTipoTarifa: respuesta.data.TipoTarifaTarifas,
                    idMoneda: respuesta.data.MonedaEmbarque
                }
            })
        })
    }

    function cargaDiv(indice, valor) {
        //	showSuccess(indice);
        $("#idBarra" + indice).barcode(valor, "code128");
    }

    const handleAceptar = (e) => {
        if (e){
            e.preventDefault()
        }
        if (conceptosAdicionales.length === 0) {
            showSuccess("No se puede guardar una guia sin conceptos.");
            return
        }
        let params = {
            "m_nIdGuia": state.idGuia,
            "m_nTIpoCambio": state.tipoCambio,
            "m_sFolioGuia": state.folioGuia,
            "m_nIdEstatusGuia": state.idEstatusGuia,
            "m_nIdEmbarque": state.idEmbarque,
            "m_nIdMoneda": state.idMoneda,

            "m_nCreadoPor": state.creadoPor,
            "m_nModificadoPor": state.modificadoPor,
            "m_nIdSucursal": state.idSucursalAgregar,
            "m_nValorDeclarado": state.ValorDeclarado,
            "m_nidTipoServicio": state.idTipoServicio,

            "m_dFecha": getCurrentDateTime().substr(0, 10),
            "m_sHora": getCurrentDateTime().substr(getCurrentDateTime().length - 5),

            "arClsGuiaConceptos": conceptosAdicionales.map(c => ({
                m_nIdConceptosFacturacion: c.idConcepto,
                m_cImporte: c.importe,
                m_nIdImpuestoTraslada: c.traslada,
                m_nIdImpuestoRetiene: c.retiene,
                m_cImporteRetiene: c.importeRet,
                m_cImporteIva: c.importeIVA,
                m_bActivo: true,
                m_cDescuento: c.descuento || 0
            })),

        }
      //  console.log(state)
        console.log(JSON.stringify(params))
      if (state.idGuia == 0 || state.idGuia == '' || state.idGuia == undefined) {
            agregarGuia(params).then(respuesta => {
                showSuccess(respuesta.data)
                handleShowListado()
            }).catch(err => {
                console.log(err)
                showSuccess(err.response?.data)
            });
        } else {
            modificarGuia(state.idGuia, params).then(respuesta => {
                showSuccess(respuesta.data)
                handleShowListado()
            }).catch(err => {
                console.log(err)
                showSuccess(err.response?.data)
            });

        }
    }
    const handleEntregaOcurre = (dataOcurre) => {
        let params = {
            nIdGuia: dataOcurre.idGuia,
            m_nIdUsuarioEntregaOcurre: parseInt(localStorage.getItem("UsuarioId")),
            m_sFechaOcurre: dataOcurre.fechaOcurre,
            m_sHoraOcurre: dataOcurre.horaOcurre,
            m_sComentariosOcurre: dataOcurre.comentariosOcurre || "",
            m_sMontoRecibidoOcurre: dataOcurre.importeOcurre,
            m_nIdTipoPago: dataOcurre.tipoPago,
            m_nIdBanco:dataOcurre.aplicaDetalle?dataOcurre.idBancoproveniente:0,
            m_dFechaPago:dataOcurre.fechaPago,
            m_nAplicaDetalle:dataOcurre.aplicaDetalle?1:0

        }
        console.log(params)
        entregaOcurreGuia(dataOcurre.idGuia, params).then(respuesta => {
            showSuccess(respuesta.data)
            getAllData()
            setDataOcurre({})
            setState({...state, openDialog: false})
            setGuiaSeleccionada(null)
        }).catch(err => {
            console.log(err)
            showSuccess(err)
        });

    }

    function handleEliminar(id) {
        var derecho;
        validarPermisos(state).then(respuesta => {
            //showSuccess(respuesta.data)

            derecho = respuesta.data;
            if (derecho == false) {
                showSuccess("El usuario no tiene derechos para realizar el proceso");
                return;
            }
            validarEliminarGuia(id).then(respuesta=>{
                if(respuesta.data.sePuedeEliminar){

                    confirmAlert({
                        title: 'Confirmar Eliminar',
                        message: '¿Está seguro de eliminar guia?',
                        buttons: [
                            {
                                label: 'Si',
                                onClick: () => {
                                    eliminarGuia(id, state.modificadoPor).then(respuesta => {
                                        showSuccess(respuesta.data)
                                        if (respuesta.data.indexOf("fracaso:") <= 0) {
                                            getAllData()
                                            setGuiaSeleccionada(null)
                                        }
                                    }).catch(err => {
                                        console.log(err)
                                        showSuccess(err.response?.data)
                                    });
                                }
                            },
                            {
                                label: 'No',
                            }
                        ]
                    })

                }else{
                    showSuccess("La guia no puede ser eliminada a menos que se cancele")
                }
            })

        }).catch(err => {
            showSuccess(err)
        });
    }

    function handleShowModificar(fila,id,folioGuia) {
      if(fila.m_nIdEstatusGuia){
              if(fila.m_nIdEstatusGuia == 8){
                showSuccess(`No es posible modificar la Guia ya que esta cancelada`)
                return
            }
        }
        if(fila.m_sFolioInforme){
            if(fila.m_sFolioInforme?.length!=0){
              showSuccess(`No es posible modificar la Guia ya que esta relacionada al informe:${fila.m_sFolioInforme}`)
              return
          }
      }
        obtenerValidacionGuia(id).then(respuesta=>{
            if(!respuesta.data.esEditable){//Entrega un 1 si la guia no es modificable
                // let {valores} = respuesta.data
            // showSuccess(`La Guía ${folioGuia} no se puede editar debido a que está relacionada a la factura  ${valores.Serie}-${valores.Folio}`)
                showSuccess(respuesta.data.motivo)
                return
            }
            obtenerGuiaId(id).then(respuesta => {
                cargaEmbarqueModificar(respuesta.data.IdSucursal, respuesta.data.m_nIdMoneda, id)
                setDataGuiaParaConsultarModificar(respuesta, "Modificar")
                $('.nav-tabs li ').removeClass('active');
                $('.nav-tabs li').eq(1).addClass('active');
                $('.tab-content div ').removeClass('in show');
                $('#Agregar').addClass('in show');
            }).catch(function (err) {
                console.log(err.data)
            });
        }).catch(err => {
            console.log(err.response.data)
        })

    }

    function handleShowConsultar(id) {
        obtenerGuiaId(id).then(respuesta => {
            cargaEmbarqueModificar(respuesta.data.IdSucursal, respuesta.data.m_nIdMoneda, id)

            setDataGuiaParaConsultarModificar(respuesta, "Consultar")
            $('.nav-tabs li ').removeClass('active');
            $('.nav-tabs li').eq(1).addClass('active');
            $('.tab-content div ').removeClass('in show');
            $('#Agregar').addClass('in show');
        }).catch(function (err) {
            console.log(err.data)
        });
    }

    const setDataGuiaParaConsultarModificar = (respuesta, label) => {
        getDataParaEditar()
        console.log('Guia datos:', respuesta.data)

        let totalCantidad = 0
        respuesta.data.m_arrClsDetalle.forEach((p) => {
            p.m_nIdPaquete = p.m_nIdEmbarqueDetalle
            p.m_rPeso = p.m_xPeso
            p.m_rLargo = p.m_xLargo
            p.m_rAncho = p.m_xAncho
            p.m_rAlto = p.m_xAlto
            p.m_rVolumen = p.m_xVolumen
            p.m_nIdTipoEmbalaje = p.m_nIdTIpoEmpaque
            p.m_nCantidad = p.ctd
            p.m_cyValorDeclarado = p.m_cValorDeclarado
            p.m_nIdTipo = p.m_nTipo
            p.m_sClaveSATProducto = p.m_nClaveSATProducto
            p.m_sClaveSATUnidad = p.m_nClaveSATUnidad
            p.m_sUnidad = p.m_sUnidadSAT
            p.m_nProducto = p.m_sProductoSAT
            totalCantidad += parseInt(p.ctd)
            obtenerProductoById(p.m_nIdProducto).then(({data}) => {
                p["producto"] = data
                p.m_sProducto = data.m_sDescripcion
            })
            obtenerEmbalajesId(p.m_nIdTipoEmbalaje).then(({data}) => {
                p.m_sTipoEmbalaje = data.m_sNombre
            })
            p.m_sTipo = p.m_nIdTipo == 1 ? 'Sobre' : 'Paquete'
        })
        setDataPaquetes(respuesta.data.m_arrClsDetalle)

        const conceptosAdicionalesAux = []

        respuesta.data.m_arClsGuiaConceptos.forEach((element) => {
            conceptosAdicionalesAux.push({
                id: Math.floor(Math.random() * 10000),
                concepto: element,
                idConcepto: element.m_nIdConceptoFacturacion,
                importe: element.m_cImporte,
                retiene: element.m_nIdImpuestoRetiene,
                traslada: element.m_nIdImpuestoTraslada,
                importeRet: element.m_cImporteRetiene,
                importeIVA: element.m_cImporteIva,
                rangoMinimo: element.m_xnRangoMinimo,
                rangoMaximo: element.m_xnRangoMaximo,
                nombreConcepto: element.m_sConcepto,
                tipoCalculo: element.m_nIdTipoCalculo,
                descuento: element.m_c_Descuento || 0
            })
        })
        var ivaTraslada = getUniqueListBy(conceptosAdicionalesAux, "traslada").map(i => i.traslada);
        var ivaRetiene = getUniqueListBy(conceptosAdicionalesAux, "retiene").map(i => i.retiene);
        setState({
            ...state,
            ivaRetiene: ivaRetiene,
            ivaTraslada: ivaTraslada
        })
        setConceptosAdicionales(conceptosAdicionalesAux)
        /*obtenerZonaTarifaByIdCodigoPostal(respuesta.data.m_sCodigoPostalRemitente).then(
            ({ data }) => {
                console.log(data)
                setState(state => {
                    return {
                        ...state,
                        zonaTarifaRemitente:data[0].m_sCodigoZona
                    }

                })
            }
          );
          obtenerZonaTarifaByIdCodigoPostal(respuesta.data.m_sCodigoPostalDestinatario).then(
            ({ data }) => {
                setState(state => {
                    return {
                        ...state,
                        zonaTarifaDestinatario:data[0].m_sCodigoZona
                    }

                })
            }
          );*/
        setState(state => {
            return {
                ...state,
                idEmbarque: respuesta.data.m_nIdEmbarque,
                idSucursalAgregar: respuesta.data.IdSucursal,
                idMoneda: respuesta.data.m_nIdMoneda,
                tipoCambio: respuesta.data.m_cTIpoCambio,
                folioInforme: respuesta.data.m_sFolioInforme,
                tracking: respuesta.data.m_nTracking,
                folioGuia: respuesta.data.m_nFolioGuia,
                idGuia: respuesta.data.m_nIdGuia,
                IdEmbarque: respuesta.data.m_nIdEmbarque,
                idEstatusGuia: respuesta.data.m_nIdEstatusGuia,
                fecha: respuesta.data.m_dFecha + 'T' + respuesta.data.m_sHora.substr(0,5),
                creadoEl: respuesta.data.m_dCreadoEl,
                folioEmbarque:respuesta.data.m_sFolioEmbarque,
                nombreRemitente: respuesta.data.m_sNOmbreRemitente,
                RFCRemitente: respuesta.data.m_sRFCRemitente,
                domicilioRemitente: respuesta.data.m_sDomicilioRemitente,
                ciudadRemitente: respuesta.data.m_sCiudadRemitente,
                correoRemitente: respuesta.data.m_sCorreoRemitente,
                telefonoRemitente: respuesta.data.m_sTelefonoRemitente,
                contactoRemitente: respuesta.data.m_sContactoRemitente,
                origenRemitente: respuesta.data.m_sCiudadOrigen,
                codigoPostalRemitente: respuesta.data.m_sCodigoPostalRemitente,

                sNombreDestinatario: respuesta.data.m_sNombreDestinatario,
                sRFCDestinatario: respuesta.data.m_sRFCDestinatario,
                sDomicilioDestinatario: respuesta.data.m_sDomicilioDestinatario,
                ciudadDestinatario: respuesta.data.m_sCiudadDestinatario,
                sCorreoDestinatario: respuesta.data.m_sCorreoDestinatario,
                sTelefonoDestinatario: respuesta.data.m_sTelefonoDestinatario,
                sContactoDestinatario: respuesta.data.m_sContactoDestinatario,
                CiudadDestino: respuesta.data.m_sCiudadDestino,
                codigoPostalDestinatario: respuesta.data.m_sCodigoPostalDestinatario,

                agregar: label,
                ValorDeclarado: respuesta.data.m_cValorDeclarado,
                idTipoServicio: respuesta.data.m_nIdTipoServicio,
                idTipoCobro: respuesta.data.m_nIdTIpoCobro,
                porcentajeSeguro: respuesta.data.m_xPorcentajeSeguro,

                FolioGuiaRelacionada: respuesta.data.m_sFolioGuiaRelacionada,
                tieneRecoleccion: !!respuesta.data.m_nFolioRecoleccion,
                tieneEntregaDomicilio: !respuesta.data.m_bEntregaEnSucursal,
                tieneCitaEntrega: respuesta.data.m_bEmbarqueConCita,
                tieneCitaRecoleccion: respuesta.data.m_bRecoleccionConCita,
                receptorGuia: respuesta.data.m_sReceptorGuia,
                referencia: respuesta.data.m_sReferencia,

            }
        })
    }

    //Muestra la pestaña de cancelar
    function handleShowCancelar(event) {
        event.preventDefault()
        console.log(state.folioInforme)
        validarCancelarGuia(state.idGuia).then((respuesta)=>{
        if(respuesta.data.sePuedeCancelar){
          limpiarCamposAgregar()
        obtenerGuiaId(state.idGuia).then((respuesta) => {
            setState({
                ...state,
                usuarioCancela: respuesta.data.m_nUsuarioCancelacion != 0 ? respuesta.data.m_nUsuarioCancelacion : localStorage.getItem("Usuario"),
                folioGuia: respuesta.data.m_nFolioGuia,
                sucursalCancelacion: respuesta.data.m_sSucursal,
                fechaCancelado: today.getFullYear() + "/" + (today.getMonth() + 1) + "/" + today.getDate(),
                estatusGuia: respuesta.data.m_sEstatusGuia,
                motivoCancelacion: respuesta.data.m_sMotivoCancelacion
            })
            $('.nav-tabs li ').removeClass('active');
            $('.nav-tabs li').eq(5).addClass('active');
            $('.tab-content div ').removeClass('in show');
            $('#Cancelar').addClass('in show');
        })
        }
        else{
        showSuccess("La guía no puede ser cancelada ya que esta siendo usada en el informe: "+ respuesta.data.FolioInforme)
        return
        }
        }).catch((err)=>{
            showSuccess(err)
        })


    }

    //Muestra la pestaña de cancelar
    function handleShowSandBox(event) {
        event.preventDefault()

        $('.nav-tabs li ').removeClass('active');
        $('.nav-tabs li').eq(5).addClass('active');
        $('.tab-content div ').removeClass('in show');
        $('#Sandbox').addClass('in show');

    }

    //Funcion para cancelar una guia. Se usa en pestaña cancelar.
    const handleCancelar = (e) => {
        e.preventDefault();
        //console.log(state.idGuia)
        validarCancelarGuia(state.idGuia).then((respuesta) => {
            if (respuesta.data.sePuedeCancelar) {
                let params = {
                    m_nIdGuia: state.idGuia,
                    motivoCancelacion: state.MotivoCancelacion,
                    idUsuario: localStorage.getItem("UsuarioId"),
                    fechaCancelacion: getCurrentDateTime()
                }
                console.log(JSON.stringify(params))
                cancelarGuia(params).then((respuesta) => {
                    console.log(respuesta.data)
                    handleShowListado()
                }).catch(err => {
                    console.log(err)
                    showSuccess(err.response?.data)
                })
            } else {
                showSuccess("La guia no puede ser cancelada ya que esta siendo usada en el informe: " + respuesta.data.FolioInforme)
                return
            }
        }).catch((err) => {
            showSuccess(err)
        })


    }

    //Prepara campos para agregar guia
    function handleShowAgregar() {
        limpiarCamposAgregar()
        getDataParaEditar()
        setState(state => {
            return {
                ...state,
                agregar: "Agregar",
                idEstatusGuia: 4
            }
        });
        setDataPaquetes([])
        $('.nav-tabs li ').removeClass('active');
        $('.nav-tabs li').eq(1).addClass('active');
        $('.tab-content div ').removeClass('in show');
        $('#Agregar').addClass('in show');
    }

    const handleShowListado = () => {
        limpiarCamposAgregar()
        setState(state => {
            return {
                ...state,
                height: window.height,
                agregar: "Agregar",
            }
        });
        getAllData()
        setGuiaSeleccionada(null)
        $('.nav-tabs li ').removeClass('active');
        $('.nav-tabs li').eq(0).addClass('active');
        $('.tab-content div ').removeClass('in show');
        $('#Listado').addClass('in show');
    }

    const handleChange = event => {
        event.preventDefault()
        setState(state => {
            return {
                ...state,
                [event.target.name]: event.target.value
            }
        });

        if (event.target.name === "idTipoTarifa" && state.idEmbarque > 0 && state.idEmbarque !== undefined && state.paquetes !== undefined) {
            obtenerTarifasPorEmbarque(state.idEmbarque, event.target.value)
        }
    };

    const currencyFormatter = new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
    });


    function generarReporte(id, folio) {
        obtenerGuiaReporte(id).then(({data}) => {
            let pdfWindow = window.open("");
            pdfWindow.document.write("<embed  width='100%' height='100%' src='data:application/pdf;base64, " + encodeURI(data) + "'/>");
            pdfWindow.document.body.style.margin = "0px";
            pdfWindow.document.title = "Guía " + folio;
        })
    }

    function generarReporteEtiqueta(id, folio) {
        obtenerGuiaReporteEtiqueta(id).then(({data}) => {
            let pdfWindow = window.open("");
            pdfWindow.document.write("<embed  width='100%' height='100%' src='data:application/pdf;base64, " + encodeURI(data) + "'/>");
            pdfWindow.document.body.style.margin = "0px";
            pdfWindow.document.title = "Guía " + folio;
            try{
                const link = document.createElement('a');
                link.href = "data:application/pdf;base64," + data;
                link.setAttribute('download', "Guía " + folio);
                document.body.appendChild(link);
                link.click();
            }catch (e) {
                console.log(e)
                showSuccess("No se pudo descargar el pdf")
            }
        })
    }

    function generarReporteEtiquetaParcial(params, folio) {
        obtenerGuiaReporteEtiquetaParcial(params).then(({data}) => {
            let pdfWindow = window.open("");
            pdfWindow.document.write("<embed  width='100%' height='100%' src='data:application/pdf;base64, " + encodeURI(data) + "'/>");
            pdfWindow.document.body.style.margin = "0px";
            pdfWindow.document.title = "Guía " + folio;
        })
    }

    /**Entreando a guias por primera vez*/
    useEffect(value => {
        if (localStorage.getItem("UsuarioId") === null || localStorage.getItem("UsuarioId") <= 0) {
            showSuccess("Es necesario iniciar sesion para acceder a este proceso");
            window.location.replace("login");
            return;
        }
        if (props.location.idEmbarque != undefined) {//viene de un embarque
            obtenerEmbarquesId(props.location.idEmbarque).then(respuesta => {
                console.log('Embarque datos:')
                console.log(respuesta.data)
                setState({
                            ...state,
                            validarEmbarqueGuia:true
                })
                setDataFromEmbarque(respuesta)
                obtenerEmbarqueMoneda(respuesta.data.IdSucursal, respuesta.data.m_nIdMoneda, state.idGuia).then(respuesta => {
                    setDataEmbarque(respuesta.data)
                })
                $('.nav-tabs li ').removeClass('active');
                $('.nav-tabs li').eq(1).addClass('active');
                $('.tab-content div ').removeClass('in show');
                $('#Agregar').addClass('in show');
                 //setDataMoneda(props.location.dataMoneda)
                 //setDataSucursal(props.location.dataSucursal)
                 // setDataTipoCobro(props.location.dataTipoCobro)
                 //setDataTipoCambio(props.location.dataTipoCambio)
                // setDataCiudadF(props.location.dataCiudades)
                getDataParaEditar()
            });

        }
        getAllDataTipoCobro()
    }, []);


    /**Configuracion de Impresora*/
    useEffect(value => {
        BrowserPrint.getDefaultDevice("printer", function (device) {

            //Add device to list of devices and to html select element
            selected_device = device;
            devices.push(device);

            //Discover any other devices available to the application
            BrowserPrint.getLocalDevices(function (device_list) {
                for (var i = 0; i < device_list.length; i++) {
                    //Add device to list of devices and to html select element
                    var device = device_list[i];
                    if (!selected_device || device.uid != selected_device.uid) {
                        devices.push(device);
                    }
                }

            }, function () {
                alert("Error getting local devices")
            }, "printer");

        }, function (error) {
            console.log(error);
        })
    }, [])

    async function printTicket(id) {

        obtenerGuiaId(id).then(({data}) => {
            var guia = data
            var totalEtiquetas = guia.m_arrClsDetalle.reduce((a, b) => +a + +b.ctd, 0)
            let rfcCliente = localStorage.getItem("RFC")
            if (totalEtiquetas >= 10) {
                confirmAlert({
                    title: 'Confirmación',
                    message: '¿Está segura(o) que desea imprimir ' + totalEtiquetas + ' etiqueta(s)?',
                    buttons: [
                        {
                            label: 'Sí',
                            onClick: async () => {
                                if (selected_device === null || selected_device === undefined){
                                    showSuccess('No se pudo establecer conexión con la impresora. Recargue la página e intente de nuevo.')
                                }
                                guia.m_arrClsDetalle.forEach(async (p, index) => {
                                    for (let i = 0; i < p.ctd; i++) {
                                        console.log('guia: ', guia)
                                        console.log('paquete: ', p)
                                        console.log('index: ', i + 1)
                                        console.log(i + 1 + ' de ' + p.ctd)
                                        let result
                                        if (rfcCliente === 'PTR170523BI6' || rfcCliente === 'SOPO110101PQ1'){
                                            try{
                                                result = await selected_device.send(TICKET_ZABRA_TAMPLATE_PLATEROS(guia, p, i), undefined, errorCallback);
                                                showSuccess('Impresión en curso.')
                                            }catch (e) {
                                                showSuccess('Hubo un error al imprimir. Intente de nuevo.')
                                                console.log(e)
                                                break
                                            }

                                        }else {
                                            try{
                                                result = await selected_device.send(TICKET_ZABRA_TAMPLATE(guia, p, i), undefined, errorCallback);
                                                showSuccess('Impresión en curso.')
                                            }catch (e) {
                                                showSuccess('Hubo un error al imprimir. Intente de nuevo.')
                                                console.log(e)
                                                break
                                            }

                                        }

                                    }
                                })
                            }
                        },
                        {
                            label: 'No'
                        }
                    ]
                });
            } else {
                if (selected_device === null || selected_device === undefined){
                    showSuccess('No se pudo establecer conexión con la impresora. Recargue la página e intente de nuevo.')
                }
                guia.m_arrClsDetalle.forEach(async (p, index) => {
                    for (let i = 0; i < p.ctd; i++) {
                        console.log('guia: ', guia)
                        console.log('paquete: ', p)
                        console.log('index: ', i + 1)
                        console.log(i + 1 + ' de ' + p.ctd)
                        let result
                        if (rfcCliente === 'PTR170523BI6' || rfcCliente === 'SOPO110101PQ1') {
                            try {
                                result = await selected_device.send(TICKET_ZABRA_TAMPLATE_PLATEROS(guia, p, i), undefined, errorCallback);
                                showSuccess('Impresión en curso.')
                            } catch (e) {
                                showSuccess('Hubo un error al imprimir. Intente de nuevo.')
                                console.log(e)
                                break
                            }
                        } else {
                            try {
                                result = await selected_device.send(TICKET_ZABRA_TAMPLATE(guia, p, i), undefined, errorCallback);
                                showSuccess('Impresión en curso.')
                            } catch (e) {
                                showSuccess('Hubo un error al imprimir. Intente de nuevo.')
                                console.log(e)
                                break
                            }
                        }
                    }
                })

            }


        })


    }
    var errorCallback = function (errorMessage) {
        alert("Error: " + errorMessage);
    }

    async function getAllData() {
        obtenerFechaInicio().then((respuestaUno) => {
            obtenerFechaFinal().then((respuestaDos) => {
                obtenerGuiasFiltro(respuestaUno.data[0].Fecha, respuestaDos.data[0].Fecha,0,0,0, 0, 0,0).then((respuesta) => {
                    setData(respuesta.data);
                })
            })
        })
    }

    const getAllConceptos = () => {
        if (dataConceptosBase.length > 0) {
            return
        }
        obtenerConceptosFacturacion().then(respuesta => {
            setDataConceptosBase(respuesta.data);
        });
    }

    const handleUpload = (e) => {
        /*e.preventDefault();
        var files = e.target.files, f = files[0];
        var reader = new FileReader();
        console.log(e.target.files)
        reader.onload = function (e) {
            console.log("Nothing Happened")
            var data = e.target.result;
            let readedData = XLSX.read(data, {type: 'binary'});
            const wsname = readedData.SheetNames[0];
            const ws = readedData.Sheets[wsname];

            /!* Convert array to json*!/
            const dataParse = XLSX.utils.sheet_to_json(ws, {header: 1});
            console.log("dataParse : " + dataParse)
            setFileUploaded(dataParse);
        };
        reader.readAsBinaryString(f)*/
    }

    /**Recibe el id de embarque para obtener sus datos del servidor y mostrarlos en pantalla*/
    function handleEmbarque(embarque) {
        obtenerEmbarquesId(embarque).then(respuesta => {
            setDataFromEmbarque(respuesta)
        });
    }

  /*  const getCurrentDateTime = () => {
        return `${new Date().getFullYear()}-${`${new Date().getMonth() +
        1}`.padStart(2, 0)}-${`${new Date().getDate()}`.padStart(2, 0)}T${`${new Date().getHours()}`.padStart(2, 0)}:${`${new Date().getMinutes()}`.padStart(2, 0)}`
    }*/

    const setDataFromEmbarque = (respuesta) => {
        console.log('Embarque datos: ', respuesta.data)
   respuesta.data.m_arrSobres.forEach((s) => {
            respuesta.data.m_arrPaquetes.push(s)
        })
        let totalCantidad = 0
        respuesta.data.m_arrPaquetes.forEach((p) => {
            p.m_nIdPaquete = p.m_nIdEmbarqueDetalle
            p.m_rPeso = p.m_xPeso
            p.m_rLargo = p.m_xLargo
            p.m_rAncho = p.m_xAncho
            p.m_rAlto = p.m_xAlto
            p.m_rVolumen = p.m_xVolumen
            p.m_nIdTipoEmbalaje = p.m_nIdTIpoEmpaque
            p.m_nCantidad = p.ctd
            p.m_cyValorDeclarado = p.m_cValorDeclarado
            p.m_nIdTipo = p.m_nTipo
            p.m_sClaveSATProducto = p.m_nClaveSATProducto
            p.m_sClaveSATUnidad = p.m_nClaveSATUnidad
            p.m_sUnidad = p.m_sUnidadSAT
            p.m_nProducto = p.m_sProductoSAT
            totalCantidad += parseInt(p.ctd)
            obtenerProductoById(p.m_nIdProducto).then(({data}) => {
                p["producto"] = data
                p.m_sProducto = data.m_sDescripcion
            })
            obtenerEmbalajesId(p.m_nIdTipoEmbalaje).then(({data}) => {
                p.m_sTipoEmbalaje = data.m_sNombre
            })
            p.m_sTipo = p.m_nIdTipo == 1 ? 'Sobre' : 'Paquete'
        })

        setDataPaquetes(respuesta.data.m_arrPaquetes)
        let conceptosCast = []
        conceptosCast = respuesta.data.m_arrConceptos.map(item => ({
            id: Math.floor(Math.random() * 10000),
            idConcepto: item.m_nIdConceptoFacturacion,
            importe: item.m_cImporte,
            retiene: item.m_nIdImpuestoRetiene,
            traslada: item.m_nIdImpuestoTraslada,
            importeIVA: item.m_cImporteIva,
            importeRet: item.m_cImporteRetiene,
            nombreConcepto: item.m_sConcepto,
            descuento: item.m_c_Descuento
        }))

        // setDataConceptos(conceptosCast)
        setConceptosAdicionales(conceptosCast)
        /*obtenerZonaTarifaByIdCodigoPostal(respuesta.data.m_sCodigoPostalRemitente).then(
            ({ data }) => {
                console.log(data)
                setState(state => {
                    return {
                        ...state,
                        zonaTarifaRemitente:data[0].m_sCodigoZona
                    }

                })
            }
          );
          obtenerZonaTarifaByIdCodigoPostal(respuesta.data.m_sCodigoPostalDestinatario).then(
            ({ data }) => {
                setState(state => {
                    return {
                        ...state,
                        zonaTarifaDestinatario:data[0].m_sCodigoZona
                    }

                })
            }
          );*/
        setState(state => {
            return {
                ...state,
                idEmbarque: respuesta.data.m_nIdEmbarque,
                idSucursalAgregar: respuesta.data.IdSucursal,
                idMoneda: respuesta.data.m_nIdMoneda,
                tipoCambio: respuesta.data.m_cTIpoCambio,
                idTipoCobro: respuesta.data.m_nIdTIpoCobro,
                folioInforme: respuesta.data.m_nFolioInforme,
                folioRelacionado: respuesta.m_sFolioEmbarqueRelacionado,
                fecha: getCurrentDateTime(),
                idEmbarqueRelacionado: respuesta.m_nIdEmbarqueRelacionado,
                nombreRemitente: respuesta.data.m_sNombreRemitente,
                RFCRemitente: respuesta.data.m_sRFCRemitente,
                FolioGuiaRelacionada: respuesta.data.m_sFolioGuiaRelacionada,
                domicilioRemitente: respuesta.data.m_sDomicilioRemitente,
                ciudadRemitente: respuesta.data.m_sCiudadRemitente,
                correoRemitente: respuesta.data.m_sCorreoRemitente,
                telefonoRemitente: respuesta.data.m_sTelefonoRemitente,
                contactoRemitente: respuesta.data.m_sContactoRemitente,
                origenRemitente: respuesta.data.m_sCiudadOrigen,
                codigoPostalRemitente: respuesta.data.m_sCodigoPostalRemitente,

                sNombreDestinatario: respuesta.data.m_sNombreDestinatario,
                sRFCDestinatario: respuesta.data.m_sRFCDestinatario,
                sDomicilioDestinatario: respuesta.data.m_sDomicilioDestinatario,
                ciudadDestinatario: respuesta.data.m_sCIudadDestinatario,
                sCorreoDestinatario: respuesta.data.m_sCorreoDestinatario,
                sTelefonoDestinatario: respuesta.data.m_sTelefonoDestinatario,
                sContactoDestinatario: respuesta.data.m_sContactoDestinatario,
                CiudadDestino: respuesta.data.m_sCiudadDestino,
                codigoPostalDestinatario: respuesta.data.m_sCodigoPostalDestinatario,

                IdEmbarque: respuesta.data.m_nIdEmbarque,
                ValorDeclarado: respuesta.data.m_xValorDeclarado,
                porcentajeSeguro: respuesta.data.m_xPorcentajeSeguro,

                folioGuia: respuesta.data.m_nFolioGuia,
                idGuia: respuesta.data.m_nIdGuia,
                creadoEl: respuesta.data.m_dCreadoEl,
                idEstatusGuia: 4,
                idTipoServicio: respuesta.data.m_nTipoTimbrado ?? 1,
                tieneRecoleccion: respuesta.data.m_bEsRecoleccion,
                tieneEntregaDomicilio: !respuesta.data.m_bEntregaEnSucursal,
                tieneCitaRecoleccion: false,
                tieneCitaEntrega: respuesta.data.m_bEmbarqueConCita,
                referencia: respuesta.data.m_sReferencia,
            }
        })
        // obtenerTarifasPorEmbarque(respuesta.data.m_nIdEmbarque, state.idTipoTarifa)
    }

    const obtenerTarifasPorEmbarque = (idEmbarque, idTipoTarifa) => {
        const conceptosTemp = []
        let ivaTraslada = []
        let ivaRetiene = []
        axios.get(`${process.env.REACT_APP_API_URL}/Tarifas/GetByEmbarque/${idEmbarque}/${idTipoTarifa}`, {headers}).then(respuesta => {
            console.log('tarifas by embarque ', respuesta.data)
            let conceptosCast = []
            respuesta.data.forEach((element) => {
                conceptosCast.push({
                    id: Math.floor(Math.random() * 10000),
                    concepto: element,
                    idConcepto: element.m_nIdConceptosFacturacion,
                    importe: element.m_cImporte,
                    retiene: element.m_nIdImpuestoRetiene,
                    traslada: element.m_nIdImpuestoTraslada,
                    importeIVA: element.m_cImporteIva,
                    importeRet: element.m_cImporteRetiene,
                    nombreConcepto: element.m_sConcepto,
                    descuento: element.m_c_Descuento
                })
            })
            ivaTraslada = getUniqueListBy(conceptosCast, "traslada").map(i => i.traslada);
            ivaRetiene = getUniqueListBy(conceptosCast, "retiene").map(i => i.retiene);
            setState(state => {
                return {
                    ...state,
                    ivaRetiene: ivaRetiene,
                    ivaTraslada: ivaTraslada
                }
            })
            setConceptosAdicionales(conceptosCast)
        })
    }

    const limpiarCamposAgregar = () => {
        setState(state => {
            return {
                ...state,
                //Informacion General
                idSucursalAgregar: localStorage.getItem("Sucursal"),
                fecha: getCurrentDateTime(),
                folioGuia: "",
                idEmbarque: 0,
                folioInforme: "",
                tracking: "",
                idEstatusGuia: 0,
                idMoneda: 1,
                tipoCambio: 0,
                idGuia:0,
                //Remitente
                nombreRemitente: "",
                RFCRemitente: "",
                domicilioRemitente: "",
                codigoPostalRemitente: "",
                ciudadRemitente: "",
                correoRemitente: "",
                telefonoRemitente: "",
                contactoRemitente: "",
                origenRemitente: "",
                validarEmbarqueGuia:false,
                //Destinatario
                sNombreDestinatario: "",
                sRFCDestinatario: "",
                sDomicilioDestinatario: "",
                codigoPostalDestinatario: "",
                ciudadDestinatario: "",
                sCorreoDestinatario: "",
                sTelefonoDestinatario: "",
                sContactoDestinatario: "",
                CiudadDestino: "",
                //Paquetes/sobres
                paquetes: [
                    {
                        peso: "",
                        largo: "",
                        ancho: "",
                        alto: "",
                        volumen: "",
                        tipoEmbalaje: "",
                        valorDeclarado: "",
                        descripcionPaquete: "",
                        ctd: "",
                        observacionesPaquete: "",
                        id: "",
                        producto: ""
                    },
                ],
                sobres: [
                    {
                        descripcionSobre: "",
                        id: ""
                    },
                ],
                //Detalle de faturación
                idTipoCobro: 0,
                idTipoServicio: 2,
                ValorDeclarado: "",
                //Conceptos de facturacion
                conceptosAdicionales: [],
                ivaTraslada: [],
                ivaRetiene: [],
                tieneRecoleccion: false,
                tieneEntregaDomicilio: false,
                tieneCitaRecoleccion: false,
                tieneCitaEntrega: false,
                zonaTarifaRemitente: '',
                zonaTarifaDestinatario: '',
                receptorGuia: '',
                referencia: '',
            }
        })
        setConceptosAdicionales([])
        setGuiaSeleccionada(null)
    }

    const getDataParaEditar = () =>{
        getAllDataSucursal()
        getAllDataMoneda()
        getAllDataTipoCobro()
        getTipoCambio()
        getAllDataEstatusGuia()
        getAllDataTipoServicio()
        cargaEmbarqueMoneda(1)
        getAllConceptos()
        getParametrosConfiguracion()
    }

    async function getTipoCambio() {
        if (dataTipoCambio.length > 0) {
            return
        }
        obtenerTipoCambio().then(respuesta => {
            setDataTipoCambio(respuesta.data)
        });
    };

    async function getAllDataSucursal() {
        if (dataSucursal.length > 0) {
            return
        }
        obtenerSucursales().then(respuesta => {
            setDataSucursal(respuesta.data)
        });
    }

    async function getAllDataMoneda() {
        if (dataMoneda.length > 0) {
            return
        }
        obtenerMonedas().then(respuesta => {
            setDataMoneda(respuesta.data)
        });
    };

    async function getAllDataTipoCobro() {
        if (dataTipoCobro.length > 0) {
            return
        }
        obtenerTipoCobro().then(respuesta => {
            setDataTipoCobro(respuesta.data)
        });
    };

    async function getAllDataTipoPago() {
        if (dataTipoPago.length > 0) {
            return
        }
        obtenerTiposPago().then(({data}) => {
            setDataTipoPago(data)
        });
    };

    async function getAllDataTipoServicio() {
        if (dataTipoServicio.length > 0) {
            return
        }
        obtenerTipoServicio().then(respuesta => {
            setDataTipoServicio(respuesta.data)
        });
    };

    async function getAllDataEstatusGuia() {
        if (dataEstatusGuia.length > 0) {
            return
        }
        obtenerEstatusGuia().then(respuesta => {
            setDataEstatusGuia(respuesta.data)
        });
    };

    function cargaEmbarqueModificar(valorSucursal, valorMoneda, valorGuia) {
        obtenerEmbarqueMoneda(valorSucursal, valorMoneda, valorGuia).then(respuesta => {
            setDataEmbarque(respuesta.data)
        });
    };

    //Recibe el id de moneda seleccionado para traer los embarques registrados con ese tipo de moneda
    async function cargaEmbarqueMoneda(idMoneda) {
        setState(state => {
            return {
                ...state,
                idMoneda: idMoneda
            }
        });

        if (state.idSucursalAgregar === "" || state.idSucursalAgregar === "0") return;
        if (idMoneda === "" || idMoneda === "0") return;

        obtenerEmbarqueMoneda(state.idSucursalAgregar, idMoneda, state.idGuia).then(respuesta => {
            setDataEmbarque(respuesta.data)
        });
    };

    const headers = API_HEADERS

    const handleImprimir = () => {
        imprimirFormatosId(state.formatoSeleccionado).then((response) => {
            var file = new Blob([response.data], {type: 'application/pdf'})
            var fileURL = URL.createObjectURL(file)
            console.log(fileURL)
            window.open(fileURL);
        })

    }

    const framesPaqueteImp = state.paquetesI.map((p, index) => {
        return (
            <div key={`paqueteI${index}`}>

                <div className="widget-wrap" id="conceptosFacturacion">

                    <div className="widget-header">
                        <div className="col-md-12">
                            <div className="col-md-6">
                                <h2>{state.paquetesI[index].NombreFiscal}</h2>
                                <h3>{state.paquetesI[index].Colonia} {state.paquetesI[index].Calle}</h3>
                                <h3>Tel:{state.paquetesI[index].Telefonos}</h3>
                                <h3>RFC:{state.paquetesI[index].RfcFiscal}</h3>
                            </div>
                            <div className="col-md-6">
                                <div className="col-md-6">
                                    <div id={"idBarra" + index}>
                                        <label>{cargaDiv(index, state.paquetesI[index].FolioPaquete)}</label>
                                    </div>
                                </div>
                                <div className="col-md-6">
                                    <QRCode value={state.paquetesI[index].FolioPaquete} size={48}></QRCode>
                                </div>
                                <h3>{state.paquetesI[index].FolioPaquete}</h3>
                            </div>
                        </div>
                    </div>
                    <div className="widget-container">
                        <div className="widget-content">
                            <div className="row">
                                <div className="col-md-12">
                                    <form className="j-forms">
                                        <div className="form-content">
                                            <div className="col-md-6">
                                                <div className="col-md-12 unit">

                                                    <div className="input">
                                                        <TextField variant="outlined" margin="dense"
                                                                   className="form-control"
                                                                   type="text"
                                                                   label="Remitente"
                                                                   placeholder={state.paquetesI[index].Remitente}
                                                                   id={"Remitente" + index}
                                                                   disabled="disabled"
                                                        />
                                                    </div>
                                                </div>
                                                <div className="col-md-12 unit">

                                                    <div className="input">
                                                        <TextField variant="outlined" margin="dense"
                                                                   className="form-control"
                                                                   type="text"
                                                                   label="RFC"
                                                                   placeholder={state.paquetesI[index].RFC}
                                                                   id={"RFC" + index}
                                                                   disabled="disabled"
                                                        />
                                                    </div>
                                                </div>
                                                <div className="col-md-12 unit">

                                                    <div className="input">
                                                        <TextField variant="outlined" margin="dense"
                                                                   className="form-control"
                                                                   type="text"
                                                                   label="Dirección"
                                                                   placeholder={state.paquetesI[index].Direccion}
                                                                   id={"Direccion" + index}
                                                                   disabled="disabled"
                                                        />
                                                    </div>
                                                </div>
                                                <div className="col-md-12 unit">

                                                    <div className="input">
                                                        <TextField variant="outlined" margin="dense"
                                                                   className="form-control"
                                                                   type="text"
                                                                   label="Zona"
                                                                   placeholder={state.paquetesI[index].Zona}
                                                                   id={"Zona" + index}
                                                                   disabled="disabled"
                                                        />
                                                    </div>
                                                </div>
                                                <div className="col-md-12 unit">

                                                    <div className="input">
                                                        <TextField variant="outlined" margin="dense"
                                                                   className="form-control"
                                                                   type="text"
                                                                   label="CP"
                                                                   placeholder={state.paquetesI[index].CP}
                                                                   id={"CP" + index}
                                                                   disabled="disabled"
                                                        />
                                                    </div>
                                                </div>
                                                <div className="col-md-12 unit">

                                                    <div className="input">
                                                        <TextField variant="outlined" margin="dense"
                                                                   className="form-control"
                                                                   type="text"
                                                                   label="Ciudad"
                                                                   placeholder={state.paquetesI[index].CiudadRemitente}
                                                                   id={"CiudadRemitente" + index}
                                                                   disabled="disabled"
                                                        />
                                                    </div>
                                                </div>
                                                <div className="col-md-12 unit">

                                                    <div className="input">
                                                        <TextField variant="outlined" margin="dense"
                                                                   className="form-control"
                                                                   type="text"
                                                                   label="Teléfono"
                                                                   placeholder={state.paquetesI[index].Telefono}
                                                                   id={"Telefono" + index}
                                                                   disabled="disabled"
                                                        />
                                                    </div>
                                                </div>


                                            </div>
                                            <div className="col-md-6">
                                                <div className="col-md-12 unit">

                                                    <div className="input">
                                                        <TextField variant="outlined" margin="dense"
                                                                   className="form-control"
                                                                   type="text"
                                                                   label="Destinatario"
                                                                   placeholder={state.paquetesI[index].Destinatario}
                                                                   id={"CiudadDestino" + index}
                                                                   disabled="disabled"
                                                        />
                                                    </div>
                                                </div>
                                                <div className="col-md-12 unit">

                                                    <div className="input">
                                                        <TextField variant="outlined" margin="dense"
                                                                   className="form-control"
                                                                   type="text"
                                                                   label="RFC"
                                                                   placeholder={state.paquetesI[index].RFCDestinatario}
                                                                   id={"RFC" + index}
                                                                   disabled="disabled"
                                                        />
                                                    </div>
                                                </div>
                                                <div className="col-md-12 unit">

                                                    <div className="input">
                                                        <TextField variant="outlined" margin="dense"
                                                                   className="form-control"
                                                                   type="text"
                                                                   label="Dirección"
                                                                   placeholder={state.paquetesI[index].DireccionDestinatario}
                                                                   id={"Direccion" + index}
                                                                   disabled="disabled"
                                                        />
                                                    </div>
                                                </div>
                                                <div className="col-md-12 unit">
                                                    <label className="label">
                                                        Zona
                                                    </label>
                                                    <div className="input">
                                                        <TextField variant="outlined" margin="dense"
                                                                   className="form-control"
                                                                   type="text"
                                                                   label="Zona"
                                                                   placeholder={state.paquetesI[index].ZonaDestinatario}
                                                                   id={"Zona" + index}
                                                                   disabled="disabled"
                                                        />
                                                    </div>
                                                </div>
                                                <div className="col-md-12 unit">

                                                    <div className="input">
                                                        <TextField variant="outlined" margin="dense"
                                                                   className="form-control"
                                                                   type="text"
                                                                   label="CP"
                                                                   placeholder={state.paquetesI[index].CPDestinatario}
                                                                   id={"CP" + index}
                                                                   disabled="disabled"
                                                        />
                                                    </div>
                                                </div>
                                                <div className="col-md-12 unit">

                                                    <div className="input">
                                                        <TextField variant="outlined" margin="dense"
                                                                   className="form-control"
                                                                   type="text"
                                                                   label="Ciudad"
                                                                   placeholder={state.paquetesI[index].CiudadDestinatario}
                                                                   id={"Ciudad" + index}
                                                                   disabled="disabled"
                                                        />
                                                    </div>
                                                </div>
                                                <div className="col-md-12 unit">

                                                    <div className="input">
                                                        <TextField variant="outlined" margin="dense"
                                                                   className="form-control"
                                                                   type="text"
                                                                   label="Teléfono"
                                                                   placeholder={state.paquetesI[index].TelefonoDestinatario}
                                                                   id={"Telefono" + index}
                                                                   disabled="disabled"
                                                        />
                                                    </div>
                                                </div>
                                                <div className="col-md-12 unit">

                                                    <div className="input">
                                                        <TextField variant="outlined" margin="dense"
                                                                   className="form-control"
                                                                   type="text"
                                                                   label="Cantidad"
                                                                   placeholder={state.paquetesI[index].PaqueteCant}
                                                                   id={"Cantidad" + index}
                                                                   disabled="disabled"
                                                        />
                                                    </div>
                                                </div>
                                                <div className="col-md-12 unit">

                                                    <div className="input">
                                                        <TextField variant="outlined" margin="dense"
                                                                   className="form-control"
                                                                   type="text"
                                                                   label="Descripcion"
                                                                   placeholder={state.paquetesI[index].DescripcionPaquete}
                                                                   id="Cantidad"
                                                                   disabled="disabled"
                                                        />
                                                    </div>
                                                </div>

                                            </div>
                                            <div className="col-md-12">
                                                <div className="col-md-6">
                                                    <div className="widget-header">
                                                        <div className="col-md-12">
                                                            <h2>{state.paquetesI[index].CiudadOrigen}</h2>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="col-md-6">
                                                    <div className="widget-header">
                                                        <div className="col-md-12">
                                                            <h2>{state.paquetesI[index].CiudadDestino}</h2>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </form>
                                </div>
                            </div>
                        </div>
                    </div>

                </div>
            </div>
        );
    });

    function closeSeccions() {
        //Cerrar todas las seciones
        var $section = $(".widget-toggle")
        $section.each(function () {
            var $welem = $(this).parentsUntil(".widget-action-bar").parentsUntil(".w-action").parents(".widget-header").next(".widget-container");
            $welem.slideUp();
            $(this).children("a").children("i").removeClass("zmdi-chevron-down");
            $(this).children("a").children("i").addClass("zmdi-chevron-up");
        });
    }

    const mostrarDialogoEtiqueta = (event,id)=>{
        event.stopPropagation();
        obtenerGuiaId(id).then(({data}) => {
        var guia = data
        setState({
            ...state,
            openDialogEtiquetas: true,
            detallesPaquetesEtiquetas: guia.m_arrClsDetalle
        })
        })
    }
    const mostrarDialogoOcurre = (event, id) => {
        event.stopPropagation();
        getAllDataTipoPago()
        obtenerGuiaId(id).then(({data}) => {
            var guia = data
            if (guia.m_nIdEstatusGuia == 7) {
                if (!guia.m_nClienteBloqueado) {
                    let importeTotal = 0
                    guia.m_arClsGuiaConceptos.forEach((c) => importeTotal += parseFloat(c.m_cTotal))
                    let tipoCobro = dataTipoCobro.find(i => i.m_nIdTipoCobro == guia.m_nIdTIpoCobro)
                    let tipoPago = tipoCobro.m_nIdTipoPago || dataTipoPago[0]?.m_nIdTipoPago
                    setDataOcurre({
                        idGuia: guia.m_nIdGuia,
                        tipoCobroOcurre: guia.m_nIdTIpoCobro,
                        importeTotal: importeTotal.toFixed(2),
                        tipoPago: tipoPago,
                        fechaOcurre: getCurrentDate(),
                        horaOcurre: getCurrentTime()
                    })
                    setState({
                        ...state,
                        openDialog: true
                    })
                    setShowDialogOcurre(true)
                } else {
                    showSuccess("El cliente responsable de pago está bloqueado. No se puede realizar entrega.")
                }
            } else {
                showSuccess("La guia debe tener estado completado para poder entregar.")
            }
        })


    }

    const handleListPaquetesChange = (newList) => {
        setDataPaquetes(newList)
    }

    const cambiarCobro = (tipoCobro) => {
        cambiarTipoCobro(state.idGuia, tipoCobro).then(({data}) => {
            showSuccess(data)
            getAllData()
            setGuiaSeleccionada(null)
        })
    }

    const cambiarEstausExitoso = (data) => {
        showSuccess(data)
        getAllData()
        setGuiaSeleccionada(null)
    }

    const handleAsignarTrayectos = (idGuia) => {
        asignarTrayectos(idGuia).then(({data}) => {
            showSuccess(data)
            getAllData()
            setGuiaSeleccionada(null)
        })
    }

    const handleChangeListConceptos = (newList) => {
        setConceptosAdicionales(newList)
    }

    const setDataListado = (listado) => {
        setData(listado)
    }

    return (
        <div>
            <CambiarTipoCobro submit={(id) => cambiarCobro(id)} creditoVencido={state.creditoVencido}
                              open={state.openTipoCobro}
                              close={() => setState({...state, openTipoCobro: false})}/>
            <CambiarEstatus submit={(data) => cambiarEstausExitoso(data)}
                            open={state.openCambiarEstatus} dataEstatusGuia={dataEstatusGuia}
                            close={() => setState({...state, openCambiarEstatus: false})}
                            guia={guiaSeleccionada}
            />
            <AsignarTrayectos submit={(id) => handleAsignarTrayectos(id)}
                            open={state.openAsignarTrayectos} dataGuia={data.find(i => i.m_nIdGuia === state.idGuia)}
                            close={() => setState({...state, openAsignarTrayectos: false})}/>
            <Dialog
                open={state.openDialogEtiquetas}
                onClose={() => setState({...state, openDialogEtiquetas: false})}
                fullWidth maxWidth="md"
                aria-labelledby="form-dialog-title"
            >
                <ImprimirEtiquetas open={state.openDialogEtiquetas}
                                   closeEtiquetas={(value) => {
                                        if (value) {
                                            let newArray = []
                                            value.forEach((obj) => {
                                                for (let i = obj.m_nRango[0]; i <= obj.m_nRango[1]; i++) {
                                                    newArray.push({
                                                        "idPaquete": obj.m_nIdEmbarqueDetalle,
                                                        "idGuia": guiaSeleccionada.m_nIdGuia,
                                                        "indice": i,
                                                        "idImpresion": 0
                                                    })
                                                }
                                            })
                                            generarReporteEtiquetaParcial(newArray, guiaSeleccionada.m_nFolioGuia)
                                        }else {
                                            console.log("Impresion cancelada")
                                        }
                                        // setState({...state, openDialogEtiquetas: false})
                                    }}
                                   detallesPaquetesEtiquetas={state.detallesPaquetesEtiquetas}/>
            </Dialog>

            <Dialog
                open={state.openDialog}
                onClose={() => setState({...state, openDialog: false})}
                fullWidth maxWidth="md"
                aria-labelledby="form-dialog-title"
            >
                {showDialogOcurre && <p style={{marginTop: '30px', marginLeft: '30px'}}>Ocurre</p>}
                {
                    dataOcurre &&
                    <Ocurre
                        handleEntregaOcurre={handleEntregaOcurre}
                        closeOcurre={() => {
                            setState({...state, openDialog: false});
                            setShowDialogOcurre(false)
                        }}
                        dataTipoPago={dataTipoPago}
                        dataOcurre={dataOcurre}
                        dataTipoCobro={dataTipoCobro}
                        showDialogOcurre={showDialogOcurre}/>
                }

            </Dialog>
            {/*SELECCION COLUMNAS PARA EXPORTAR EXCEL*/}
        <Dialog open={open} onClose={handleClose} aria-labelledby="form-dialog-title" fullWidth={"sm"}
        maxWidth={"sm"}>
                   <DialogTitle id="form-dialog-title">Columnas a exportar en Excel</DialogTitle>
        <DialogContent>
        <List className={classes.root}>
      {columns.filter(m=>m.headerName!="Acciones").map((value,index) => {
        const labelId = `checkbox-list-label-${value.headerName}`;
        return (
          <ListItem key={index} role={undefined} dense button onClick={handleToggle(value.headerName)}>
            <ListItemIcon>
              <Checkbox
                edge="start"
                checked={checked.indexOf(value.headerName) !== -1}
                tabIndex={-1}
                disableRipple
                inputProps={{ 'aria-labelledby': labelId }}
              />
            </ListItemIcon>
            <ListItemText id={labelId} primary={`${value.headerName}`} />
          </ListItem>
        );
      })}
    </List>
        </DialogContent>
        <DialogActions>
                    <Button onClick={handleClose} color="primary">Cancel</Button>
                    <Button onClick={handleAceptarColumnas} color="primary">Aceptar</Button>
        </DialogActions>
    </Dialog>


      {/*CABECERA*/}
            <header className="topbar clearfix">
                <Cabecera titulo="Guías">
                    <div className="page-header">
                        <ul className="list-page-breadcrumb">
                            <li className="active-page">Guías</li>
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
                    {/*tabs de pantalla*/}
                    <ul className="nav navStatica nav-tabs">
                        <li className="active">
                            <a onClick={(event) => handleShowListado(event)}>
                                <i className="fa fa-list"/> Listado
                            </a>
                        </li>
                        <li>
                            <a className= {validarDerecho(9101456)? "":classes.disabled} onClick={handleShowAgregar}>
                                <i className="fa fa-plus-circle" /> {state.agregar}
                            </a>
                        </li>

                        {/*<li className="hide">
                            <a data-toggle="tab" href="#Importar">
                                <i className="fa fa-upload"/> Importar
                            </a>
                        </li>*/}

                        <li>
                            <a className={(state.idGuia !== 0 && state.cambioCobro) && validarDerecho(3900001) ? "" : classes.disabled}
                               onClick={() => setState({...state, openTipoCobro: true})}>
                                <i className="fa fa-refresh"/> Cambiar Tipo Cobro
                            </a>
                        </li>

                        <li className={((guiaSeleccionada?.m_nIdEstatusGuia === 7 && guiaSeleccionada?.EntregaEnSucursal) || (guiaSeleccionada?.m_nIdEstatusGuia === 14)) ? "" : "hide"}>
                            <a className={validarDerecho(9101459) ? "" : classes.disabled}
                               onClick={() => {
                                   getAllDataEstatusGuia()
                                   setState({...state, openCambiarEstatus: true})
                               }}>
                                <i className="fa fa-refresh"/> Cambiar tipo de entrega
                            </a>
                        </li>

                        <li>
                            <a className={(state.idGuia !== 0 && validarDerecho(9101460)) ? "" : classes.disabled}
                               onClick={() => {
                                   setState({...state, openAsignarTrayectos: true})
                               }}>
                                <i className="fa fa-road"/> Asignar Trayectos
                            </a>
                        </li>

                        <li>
                            <a onClick={handleShowCancelar}
                               className={(state.idGuia === 0 || !validarDerecho(9101461) ||  state.estatusGuia == 8)? classes.disabled : ""}>
                                <i className="fa fa-times-circle"/> Cancelar
                            </a>
                        </li>

                        <li>
                            <a onClick={handleShowSandBox}>
                                <i className="fa fa-times-circle"/> Sandbox
                            </a>
                        </li>
                    </ul>

                    <div className="row tab-content">
                        <div id="Listado" className="tab-pane fade in show">
                            <div className="widget-wrap">
                                <div className="widget-content">


                                    <div className="widget-content">


                                        <div className="row">
                                            <div className="col-md-12">
                                                <Filtros
                                                    listaResultado={setDataListado}
                                                    guia={true}
                                                />
                                            </div>
                                        </div>
                                    </div>

                                    <div className="row" style={{height: state.height - 250, width: '100%'}}>
                                    <button class="MuiButtonBase-root MuiButton-root MuiButton-text MuiButton-textPrimary MuiButton-textSizeSmall MuiButton-sizeSmall" tabindex="0" type="button" aria-haspopup="menu" aria-labelledby="mui-66113" id="mui-38414" aria-expanded="true" onClick={handleClickOpen}>
                                        <span class="MuiButton-label">
                                         <span class="MuiButton-startIcon MuiButton-iconSizeSmall">
                                            <svg class="MuiSvgIcon-root" focusable="false" viewBox="0 0 24 24" aria-hidden="true">
                                                <path d="M19 12v7H5v-7H3v7c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2v-7h-2zm-6 .67l2.59-2.58L17 11.5l-5 5-5-5 1.41-1.41L11 12.67V3h2z">
                                            </path></svg></span>Exportar</span><span class="MuiTouchRipple-root">
                                        </span>
                                    </button>
                                        <DataGrid
                                            localeText={dataGridLocaleText}
                                            rows={data}
                                            columns={columns}
                                            density="compact"
                                            pageSize={Math.floor((state.height - 310) / 30)}
                                            getRowId={(row) => row.m_nIdGuia}
                                            onRowSelected={(row) => {
                                                setGuiaSeleccionada(row.data)
                                                setState({
                                                    ...state,
                                                    idGuia: row.data.m_nIdGuia,
                                                    estatusGuia:row.data.m_nIdEstatusGuia,
                                                    cambioCobro: true,
                                                    creditoVencido: row.data.m_bCreditoVencido && !row.data.m_bSinCredito,
                                                    folioInforme:row.data.m_sFolioInforme
                                                })
                                            }}

                                        />
                                    </div>

                                </div>
                            </div>
                        </div>
                        <div id="Agregar" className="tab-pane fade">
                            <form className="j-forms" onSubmit={handleAceptar} onKeyDown={e => {if (e.code === 13){e.preventDefault()}}}>
                                <div className="form-content">

                                    {/*<div
                                        className="wizard-breadcrumb number-style"
                                        style={{
                                            position: "sticky",
                                            top: "60px",
                                            padding: "5px",
                                            backgroundColor: "white",
                                            zIndex: 100,
                                            marginBottom: "10px"
                                        }}
                                    >

                                        <div className="row">
                                            <Stepper activeStep={stepActive - 1}>
                                                {
                                                    ["Información General", "Remitentes/Destinatario", "Detalles de la Recolección", "Detalle de Facturación", "Conceptos de Facturación"].map((s, index) => (
                                                        <Step key={s} completed={false}
                                                              onClick={() => openSection(index + 1)}>
                                                            <StepLabel>{s}</StepLabel>
                                                        </Step>
                                                    ))
                                                }
                                            </Stepper>
                                        </div>
                                    </div>*/}

                                    <div className="widget-wrap" id="informacionGeneral">
                                        <div className="widget-header">
                                            <h2>Información General</h2>
                                        </div>


                                        <div className="widget-container">
                                            <div className="widget-content">
                                                <div className="row">
                                                    <Grid container spacing={2}>
                                                        <Grid item xs>
                                                            <label className="input select">
                                                                <FormControl fullWidth variant="outlined"
                                                                             margin="dense">
                                                                    <InputLabel
                                                                        id="idSucursalAgregarLabel">Sucursal</InputLabel>
                                                                    <Select
                                                                        native
                                                                        labelId="idSucursalAgregarLabel"
                                                                        className="form-control"
                                                                        required
                                                                        value={state.idSucursalAgregar}
                                                                        onChange={handleChange}
                                                                        id="idSucursalAgregar"
                                                                        name="idSucursalAgregar"
                                                                        label="Sucursal"
                                                                        disabled="disabled"
                                                                        InputLabelProps={{
                                                                            shrink: true,
                                                                        }}
                                                                    >
                                                                        <option value="0"></option>
                                                                        {dataSucursal.map((sucursal) => (
                                                                            <option
                                                                                key={sucursal.m_nIdSucursal}
                                                                                value={sucursal.m_nIdSucursal}
                                                                            >
                                                                                {sucursal.m_sSucursal}
                                                                            </option>
                                                                        ))}
                                                                    </Select>
                                                                </FormControl>
                                                            </label>
                                                        </Grid>
                                                        <Grid item xs>
                                                            <div className="input">
                                                                <TextField variant="outlined" margin="dense"
                                                                           onChange={handleChange}
                                                                           className="form-control"
                                                                           type="text"
                                                                           label="Folio Guía"
                                                                           placeholder={state.folioGuia}
                                                                           readOnly={state.agregar == "Consultar"}
                                                                           id="folioGuia"
                                                                           name="folioGuia"
                                                                           disabled="disabled"
                                                                           InputLabelProps={{
                                                                               shrink: true,
                                                                           }}
                                                                />
                                                            </div>
                                                        </Grid>
                                                        <Grid item xs>
                                                            <label className="label">
                                                             {state.agregar == "Agregar" &&
                                                              <FormControl fullWidth variant="outlined"
                                                                             margin="dense">
                                                                    <InputLabel id="idEmbarqueLabel">Folio
                                                                        Embarque</InputLabel>
                                                                    <Select
                                                                        native
                                                                        labelId="idEmbarqueLabel"
                                                                        label="Folio Embarque"
                                                                        className="form-control"
                                                                        required
                                                                        onChange={event => (handleEmbarque(event.target.value))}
                                                                        id="idEmbarque"
                                                                        read="true"
                                                                        value={state.idEmbarque}
                                                                        disabled={state.agregar == "Consultar" || state.validarEmbarqueGuia || state.agregar == "Modificar" }

                                                                    >
                                                                        <option value="0">
                                                                            Seleccionar
                                                                        </option>
                                                                        {dataEmbarque.map(
                                                                            (embarque) => (
                                                                                <option key={embarque.m_nIdEmbarque}
                                                                                        value={embarque.m_nIdEmbarque}>
                                                                                    {
                                                                                        embarque.m_sFolioEmbarque
                                                                                    }
                                                                                </option>
                                                                            )
                                                                        )}
                                                                    </Select>
                                                                </FormControl>
                                                                }
                                                                {state.agregar != "Agregar" &&
                                                                    <TextField variant="outlined" margin="dense"
                                                                    native
                                                                    labelId="idEmbarqueLabel"
                                                                    label="Folio Embarque"
                                                                    className="form-control"
                                                                    required
                                                                    id="idEmbarque"
                                                                    read="true"
                                                                    value={state.folioEmbarque}
                                                                    disabled
                                                         />


                                                                }
                                                            </label>
                                                        </Grid>
                                                      {/*  <Grid item xs>
                                                          <div className="input">
                                                                <TextField variant="outlined" margin="dense"
                                                                           className="form-control"
                                                                           type="text"
                                                                           InputLabelProps={{
                                                                               shrink: true,
                                                                           }}
                                                                           label="Folio Relacionado"
                                                                           placeholder={state.FolioGuiaRelacionada}
                                                                           id="FolioGuiaRelacionada"
                                                                           name="FolioGuiaRelacionada"
                                                                           disabled
                                                                />
                                                            </div>
                                                        </Grid>*/}
                                                        <Grid item xs>
                                                            <div className="input">
                                                                <TextField variant="outlined" margin="dense"
                                                                           onChange={handleChange}
                                                                           className="form-control"
                                                                           type="text"
                                                                           label="Folio Informe"
                                                                           //placeholder={state.folioInforme}
                                                                           value={state.folioInforme}
                                                                           readOnly={state.agregar == "Consultar"}
                                                                           id="folioInforme"
                                                                           name="folioInforme"
                                                                           disabled="disabled"
                                                                />
                                                            </div>
                                                        </Grid>
                                                    </Grid>
                                                    <Grid container spacing={2} style={{marginBottom: '15px'}}>
                                                        <Grid item xs={2}>
                                                            <div className="input">
                                                                <TextField variant="outlined" margin="dense"
                                                                           onChange={handleChange}
                                                                           className="form-control"
                                                                           type="text"
                                                                           label="Tracking"
                                                                           placeholder={state.tracking}
                                                                           readOnly={state.agregar == "Consultar"}
                                                                           id="tracking"
                                                                           name="tracking"
                                                                           disabled="disabled"
                                                                           InputLabelProps={{
                                                                               shrink: true,
                                                                           }}
                                                                />
                                                            </div>
                                                        </Grid>
                                                        <Grid item xs={2}>
                                                            <div className="input">
                                                                <TextField variant="outlined" margin="dense"
                                                                           onChange={handleChange}
                                                                           className="form-control"
                                                                           type="datetime-local"
                                                                           InputLabelProps={{shrink: true,}}
                                                                           label="Fecha / Hora"
                                                                           value={state.fecha}
                                                                           readOnly={state.agregar == "Consultar"}
                                                                           id="fecha"
                                                                           name="fecha"
                                                                           disabled="disabled"
                                                                />
                                                            </div>
                                                        </Grid>
                                                        <Grid item xs={2}>
                                                            <label className="input select">
                                                                <FormControl fullWidth variant="outlined"
                                                                             margin="dense">
                                                                    <InputLabel id="idEstatusGuiaLabel"> Estatus de la
                                                                        Guia</InputLabel>
                                                                    <Select
                                                                        native
                                                                        labelId="idEstatusGuiaLabel"
                                                                        label="Estatus de la Guia"
                                                                        className="form-control"
                                                                        required
                                                                        onChange={handleChange}
                                                                        id="idEstatusGuia"
                                                                        name="idEstatusGuia"
                                                                        read="true"
                                                                        value={state.idEstatusGuia}
                                                                        disabled
                                                                        InputLabelProps={{
                                                                            shrink: true,
                                                                        }}
                                                                    >
                                                                        <option key={0} value="0">Seleccionar</option>
                                                                        {dataEstatusGuia.map(
                                                                            (estatusGuia) => (
                                                                                <option
                                                                                    key={estatusGuia.m_nIdEstatusGuia}
                                                                                    value={estatusGuia.m_nIdEstatusGuia}>
                                                                                    {estatusGuia.m_sEstatus}
                                                                                </option>
                                                                            )
                                                                        )}
                                                                    </Select>
                                                                </FormControl>
                                                            </label>
                                                        </Grid>
                                                        <Grid item xs={2}>
                                                            <label className="input select">
                                                                <FormControl fullWidth variant="outlined"
                                                                             margin="dense">
                                                                    <InputLabel id="idMonedaLabel"> Moneda</InputLabel>
                                                                    <Select
                                                                        native
                                                                        labelId="idMonedaLabel"
                                                                        label="Moneda"
                                                                        className="form-control"
                                                                        required
                                                                        onChange={event => (cargaEmbarqueMoneda(event.target.value))}
                                                                        id="idMoneda"
                                                                        read="true"
                                                                        value={state.idMoneda}
                                                                        disabled
                                                                        // disabled
                                                                    >
                                                                        <option value="0">
                                                                            Seleccionar
                                                                        </option>
                                                                        {dataMoneda.map(
                                                                            (moneda) => (
                                                                                <option key={moneda.m_nIdMoneda}
                                                                                        value={moneda.m_nIdMoneda}>
                                                                                    {
                                                                                        moneda.m_sMoneda
                                                                                    }
                                                                                </option>
                                                                            )
                                                                        )}
                                                                    </Select>
                                                                </FormControl>
                                                            </label>
                                                        </Grid>
                                                        <Grid item xs={2}>
                                                            <label className="input select">
                                                                <FormControl fullWidth variant="outlined"
                                                                             margin="dense">
                                                                    <InputLabel id="tipoCambioLabel">Tipo de
                                                                        Cambio</InputLabel>
                                                                    <Select
                                                                        native
                                                                        labelId="tipoCambioLabel"
                                                                        label="Tipo de Cambio"
                                                                        className="form-control"
                                                                        required
                                                                        value={state.tipoCambio}
                                                                        onChange={handleChange}
                                                                        // disabled={state.agregar == "Consultar"}
                                                                        disabled
                                                                        id="tipoCambio"
                                                                        name="tipoCambio"
                                                                    >
                                                                        <option value="0">Seleccionar</option>
                                                                        {dataTipoCambio.map((cambio) => (
                                                                            <option
                                                                                key={cambio.m_nIdTipoCambio}
                                                                                value={cambio.m_nIdTipoCambio}
                                                                            >
                                                                                {cambio.m_cTipoCambio.toFixed(4)}
                                                                            </option>
                                                                        ))}
                                                                    </Select>
                                                                </FormControl>
                                                                <i className="fa fa-arrow-down"/>
                                                            </label>
                                                        </Grid>
                                                        <Grid item xs={2}>
                                                            <label className="input select">
                                                                <FormControl fullWidth variant="outlined"
                                                                             margin="dense" required>
                                                                    <InputLabel> Tipo de Tarifa</InputLabel>
                                                                    <Select
                                                                        native
                                                                        label="Tipo de Tarifa"
                                                                        className="form-control"
                                                                        onChange={handleChange}
                                                                        name="idTipoTarifa"
                                                                        read="true"
                                                                        value={state.idTipoTarifa}
                                                                        disabled
                                                                    >
                                                                        <option value="1">Por peso o volumen</option>
                                                                        <option value="2">Por rango</option>
                                                                        <option value="3">Por región</option>
                                                                    </Select>
                                                                </FormControl>
                                                            </label>
                                                        </Grid>

                                                        <Grid item xs={3}>
                                                            <TextField
                                                                variant="outlined"
                                                                label="Referencia"
                                                                margin="dense"
                                                                type="text"
                                                                disabled
                                                                readOnly
                                                                value={state.referencia}
                                                            />
                                                        </Grid>
                                                    </Grid>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="widget-wrap" id="remitenteDestinatario">

                                        <div className="widget-header">
                                            <div className="col-md-6">
                                                <h2>Remitente</h2>
                                            </div>
                                            <div className="col-md-6">
                                                <h2>Destinatario</h2>
                                            </div>
                                        </div>

                                        <div className="row">
                                            <div className="col-md-6">
                                                <div className="widget-container">
                                                    <div className="widget-content">
                                                        <div className="row">
                                                            <div className="col-md-12">
                                                                <form className="j-forms">
                                                                    <div className="form-content">

                                                                        <div className="col-md-4 unit">

                                                                            <div className="input">
                                                                                <TextField variant="outlined"
                                                                                           margin="dense"
                                                                                           onChange={handleChange}
                                                                                           className="form-control"
                                                                                           type="text"
                                                                                           InputLabelProps={{
                                                                                               shrink: true,
                                                                                           }}
                                                                                           label="Nombre"
                                                                                           value={state.nombreRemitente}
                                                                                           readOnly={state.agregar == "Consultar"}
                                                                                           id="nombreRemitente"
                                                                                           name="nombreRemitente"
                                                                                           disabled="disabled"
                                                                                />
                                                                            </div>
                                                                        </div>

                                                                        <div className="col-md-4 unit">

                                                                            <div className="input">
                                                                                <TextField variant="outlined"
                                                                                           margin="dense"
                                                                                           onChange={handleChange}
                                                                                           className="form-control"
                                                                                           type="text"
                                                                                           label="RFC"
                                                                                           InputLabelProps={{
                                                                                               shrink: true,
                                                                                           }}
                                                                                           value={state.RFCRemitente}
                                                                                           readOnly={state.agregar == "Consultar"}
                                                                                           id="RFCRemitente"
                                                                                           name="RFCRemitente"
                                                                                           disabled="disabled"
                                                                                />
                                                                            </div>
                                                                        </div>

                                                                        <div className="col-md-4 unit">

                                                                            <div className="input">
                                                                                <TextField variant="outlined"
                                                                                           margin="dense"
                                                                                           onChange={handleChange}
                                                                                           className="form-control"
                                                                                           type="text"
                                                                                           InputLabelProps={{
                                                                                               shrink: true,
                                                                                           }}
                                                                                           label="Domicilio"
                                                                                           value={state.domicilioRemitente}
                                                                                           readOnly={state.agregar == "Consultar"}
                                                                                           id="domicilioRemitente"
                                                                                           name="domicilioRemitente"
                                                                                           disabled="disabled"
                                                                                />
                                                                            </div>
                                                                        </div>

                                                                        <div className="col-md-4 unit">

                                                                            <div className="input">
                                                                                <TextField variant="outlined"
                                                                                           margin="dense"
                                                                                           onChange={handleChange}
                                                                                           className="form-control"
                                                                                           type="text"
                                                                                           InputLabelProps={{
                                                                                               shrink: true,
                                                                                           }}
                                                                                           label="Código Postal"
                                                                                           value={state.codigoPostalRemitente}
                                                                                           readOnly={state.agregar == "Consultar"}
                                                                                           id="codigoPostalRemitente"
                                                                                           name="codigoPostalRemitente"
                                                                                           disabled="disabled"
                                                                                />
                                                                            </div>
                                                                        </div>

                                                                        <div className="col-md-4 unit">

                                                                            <div className="input">
                                                                                <TextField variant="outlined"
                                                                                           margin="dense"
                                                                                           onChange={handleChange}
                                                                                           className="form-control"
                                                                                           type="text"
                                                                                           InputLabelProps={{
                                                                                               shrink: true,
                                                                                           }}
                                                                                           label="Correo Electrónico"
                                                                                           value={state.correoRemitente}
                                                                                           readOnly={state.agregar == "Consultar"}
                                                                                           id="correoRemitente"
                                                                                           name="correoRemitente"
                                                                                           disabled="disabled"
                                                                                />
                                                                            </div>
                                                                        </div>

                                                                        <div className="col-md-4 unit">

                                                                            <div className="input">
                                                                                <TextField variant="outlined"
                                                                                           margin="dense"
                                                                                           onChange={handleChange}
                                                                                           className="form-control"
                                                                                           type="text"
                                                                                           InputLabelProps={{
                                                                                               shrink: true,
                                                                                           }}
                                                                                           label="Teléfono"
                                                                                           value={state.telefonoRemitente}
                                                                                           readOnly={state.agregar == "Consultar"}
                                                                                           id="telefonoRemitente"
                                                                                           name="telefonoRemitente"
                                                                                           disabled="disabled"
                                                                                />
                                                                            </div>
                                                                        </div>

                                                                        <div className="col-md-4 unit">

                                                                            <div className="input">
                                                                                <TextField variant="outlined"
                                                                                           margin="dense"
                                                                                           onChange={handleChange}
                                                                                           className="form-control"
                                                                                           type="text"
                                                                                           InputLabelProps={{
                                                                                               shrink: true,
                                                                                           }}
                                                                                           label="Contacto"
                                                                                           value={state.contactoRemitente}
                                                                                           readOnly={state.agregar == "Consultar"}
                                                                                           id="contactoRemitente"
                                                                                           name="contactoRemitente"
                                                                                           disabled="disabled"
                                                                                />
                                                                            </div>
                                                                        </div>

                                                                      { false &&  <div className="col-md-4 unit">

                                                                            <div className="input">
                                                                                <TextField variant="outlined"
                                                                                           margin="dense"
                                                                                           onChange={handleChange}
                                                                                           className="form-control"
                                                                                           type="text"
                                                                                           InputLabelProps={{
                                                                                               shrink: true,
                                                                                           }}
                                                                                           label="Zona Tarifa"
                                                                                           value={state.zonaTarifaRemitente}
                                                                                           readOnly={state.agregar == "Consultar"}
                                                                                           id="zonaTarifaRemitente"
                                                                                           name="zonaTarifaRemitente"
                                                                                           disabled="disabled"
                                                                                />

                                                                            </div>
                                                                        </div>
                                                                            }
                                                                        <div className="col-md-4 unit">

                                                                            <div className="input">
                                                                                <TextField variant="outlined"
                                                                                           margin="dense"
                                                                                           onChange={handleChange}
                                                                                           className="form-control"
                                                                                           type="text"
                                                                                           InputLabelProps={{
                                                                                               shrink: true,
                                                                                           }}
                                                                                           label="Origen"
                                                                                           value={state.origenRemitente}
                                                                                           readOnly={state.agregar == "Consultar"}
                                                                                           id="origenRemitente"
                                                                                           name="origenRemitente"
                                                                                           disabled="disabled"
                                                                                />
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                </form>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                            {/*destinatario*/}
                                            <div className="col-md-6">
                                                <div className="widget-container">
                                                    <div className="widget-content">
                                                        <div className="row">
                                                            <div className="col-md-12">
                                                                <form className="j-forms">
                                                                    <div className="form-content">

                                                                        <div className="col-md-4 unit">

                                                                            <div className="input">
                                                                                <TextField variant="outlined"
                                                                                           margin="dense"

                                                                                           className="form-control"
                                                                                           type="text"
                                                                                           InputLabelProps={{
                                                                                               shrink: true,
                                                                                           }}
                                                                                           label="Nombre"
                                                                                           value={state.sNombreDestinatario}
                                                                                           readOnly={state.agregar == "Consultar"}
                                                                                           id="sNombreDestinatario"
                                                                                           disabled="disabled"
                                                                                />
                                                                            </div>
                                                                        </div>

                                                                        <div className="col-md-4 unit">

                                                                            <div className="input">
                                                                                <TextField variant="outlined"
                                                                                           margin="dense"
                                                                                           className="form-control"
                                                                                           type="text"
                                                                                           InputLabelProps={{
                                                                                               shrink: true,
                                                                                           }}
                                                                                           label="RFC"
                                                                                           value={state.sRFCDestinatario}
                                                                                           readOnly={state.agregar == "Consultar"}
                                                                                           id="sRFCDestinatario"
                                                                                           disabled="disabled"
                                                                                />
                                                                            </div>
                                                                        </div>

                                                                        <div className="col-md-4 unit">

                                                                            <div className="input">
                                                                                <TextField variant="outlined"
                                                                                           margin="dense"
                                                                                           className="form-control"
                                                                                           type="text"
                                                                                           InputLabelProps={{
                                                                                               shrink: true,
                                                                                           }}
                                                                                           label="Domicilio"
                                                                                           value={state.sDomicilioDestinatario}
                                                                                           readOnly={state.agregar == "Consultar"}
                                                                                           id="sDomicilioDestinatario"
                                                                                           disabled="disabled"
                                                                                />
                                                                            </div>
                                                                        </div>

                                                                        <div className="col-md-4 unit">

                                                                            <div className="input">
                                                                                <TextField variant="outlined"
                                                                                           margin="dense"
                                                                                           className="form-control"
                                                                                           type="text"
                                                                                           InputLabelProps={{
                                                                                               shrink: true,
                                                                                           }}
                                                                                           label="Código Postal"
                                                                                           value={state.codigoPostalDestinatario}
                                                                                           readOnly={state.agregar == "Consultar"}
                                                                                           id="idCodigoPostalDestinatario"
                                                                                           disabled="disabled"
                                                                                />
                                                                            </div>
                                                                        </div>

                                                                        <div className="col-md-4 unit">

                                                                            <div className="input">
                                                                                <TextField variant="outlined"
                                                                                           margin="dense"
                                                                                           className="form-control"
                                                                                           type="text"
                                                                                           InputLabelProps={{
                                                                                               shrink: true,
                                                                                           }}
                                                                                           label="Correo Electrónico"
                                                                                           value={state.sCorreoDestinatario}
                                                                                           readOnly={state.agregar == "Consultar"}
                                                                                           id="sCorreoDestinatario"
                                                                                           disabled="disabled"
                                                                                />
                                                                            </div>
                                                                        </div>

                                                                        <div className="col-md-4 unit">

                                                                            <div className="input">
                                                                                <TextField variant="outlined"
                                                                                           margin="dense"
                                                                                           className="form-control"
                                                                                           type="text"
                                                                                           InputLabelProps={{
                                                                                               shrink: true,
                                                                                           }}
                                                                                           label="Teléfono"
                                                                                           value={state.sTelefonoDestinatario}
                                                                                           readOnly={state.agregar == "Consultar"}
                                                                                           id="sTelefonoDestinatario"
                                                                                           disabled="disabled"
                                                                                />
                                                                            </div>
                                                                        </div>

                                                                        <div className="col-md-4 unit">

                                                                            <div className="input">
                                                                                <TextField variant="outlined"
                                                                                           margin="dense"
                                                                                           className="form-control"
                                                                                           type="text"
                                                                                           InputLabelProps={{
                                                                                               shrink: true,
                                                                                           }}
                                                                                           label="Contacto"
                                                                                           value={state.sContactoDestinatario}
                                                                                           readOnly={state.agregar == "Consultar"}
                                                                                           id="sContactoDestinatario"
                                                                                           disabled="disabled"
                                                                                />
                                                                            </div>
                                                                        </div>

                                                                       { false && <div className="col-md-4 unit">

                                                                            <div className="input">
                                                                                <TextField variant="outlined"
                                                                                           margin="dense"
                                                                                           className="form-control"
                                                                                           type="text"
                                                                                           InputLabelProps={{
                                                                                               shrink: true,
                                                                                           }}
                                                                                           label="Zona Tarifa"
                                                                                           value={state.zonaTarifaDestinatario}
                                                                                           readOnly={state.agregar == "Consultar"}
                                                                                           id="zonaTarifaDestinatario"
                                                                                           disabled="disabled"
                                                                                />
                                                                            </div>
                                                                        </div>
                                                                                    }

                                                                        <div className="col-md-4 unit">

                                                                            <div className="input">
                                                                                <TextField variant="outlined"
                                                                                           margin="dense"
                                                                                           className="form-control"
                                                                                           type="text"
                                                                                           InputLabelProps={{
                                                                                               shrink: true,
                                                                                           }}
                                                                                           label="Destino"
                                                                                           value={state.CiudadDestino}
                                                                                           readOnly={state.agregar == "Consultar"}
                                                                                           id="CiudadDestino"
                                                                                           disabled="disabled"
                                                                                />
                                                                            </div>
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


                                    <div className="widget-wrap" id="paquetesSobres">
                                        <Paquetes
                                            dataPaquetes={dataPaquetes}
                                            onChangeList={handleListPaquetesChange}
                                            disabled={true}
                                        />

                                        {/*<div className="col-md-6">
                                            <div className="widget-wrap">
                                                <div className="widget-header">
                                                    <div className="col-md-12">
                                                        <h2>Número de Paquetes</h2>
                                                    </div>
                                                </div>
                                                <div className="widget-container">
                                                    <div className="widget-content">
                                                        <div className="row">
                                                            <div className="col-md-12">
                                                                <form className="j-forms">
                                                                    <div className="form-content">
                                                                        <Carousel
                                                                            className={classes.paqueteCarrusel}
                                                                            widgets={[IndicatorDots, Buttons]}
                                                                            frames={framesPaquete}
                                                                        />
                                                                        <h2>Número total de
                                                                            elementos: {totalPaquetes}</h2>
                                                                    </div>
                                                                </form>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="col-md-6">
                                            <div className="widget-wrap">
                                                <div className="widget-header">
                                                    <div className="col-md-12">
                                                        <h2>Número de Sobres</h2>
                                                    </div>

                                                </div>
                                                <div className="widget-container">
                                                    <div className="widget-content">
                                                        <div className="row">
                                                            <div className="col-md-12">
                                                                <form className="j-forms">
                                                                    <div className="form-content">
                                                                        <Carousel
                                                                            className={classes.paqueteCarrusel}
                                                                            widgets={[IndicatorDots, Buttons]}
                                                                            frames={framesSobres}
                                                                        />
                                                                    </div>
                                                                </form>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>*/}
                                    </div>
                                    <div className="widget-wrap" id="detalleFacturacion">
                                        <div className="widget-header">

                                            <div className="col-md-12">
                                                <h2>Detalle de Facturación</h2>
                                            </div>

                                        </div>
                                        <div className="row">
                                            <div className="col-md-12">
                                                <div className="widget-container">
                                                    <div className="widget-content">
                                                        <div className="row">
                                                            <div className="col-md-12">
                                                                {/*<form className="j-forms">*/}
                                                                <div className="form-content">
                                                                    <Grid container spacing={2}>
                                                                        <Grid item xs>
                                                                            <label className="input select">
                                                                                <FormControl fullWidth
                                                                                             variant="outlined"
                                                                                             margin="dense">
                                                                                    <InputLabel id="idTipoCobroLabel">Tipo
                                                                                        Cobro</InputLabel>
                                                                                    <Select
                                                                                        native
                                                                                        labelId="idTipoCobroLabel"
                                                                                        label="Tipo Cobro"
                                                                                        className="form-control"
                                                                                        required
                                                                                        onChange={handleChange}
                                                                                        id="idTipoCobro"
                                                                                        name="idTipoCobro"
                                                                                        read="true"
                                                                                        value={state.idTipoCobro}
                                                                                        // disabled={state.agregar == "Consultar"}
                                                                                        disabled="disabled">

                                                                                        <option value="0">
                                                                                            Seleccionar
                                                                                        </option>
                                                                                        {dataTipoCobro.map(
                                                                                            (tipoCobro) => (
                                                                                                <option
                                                                                                    key={tipoCobro.m_nIdTipoCobro}
                                                                                                    value={tipoCobro.m_nIdTipoCobro}>
                                                                                                    {
                                                                                                        tipoCobro.m_sDescripcion
                                                                                                    }
                                                                                                </option>
                                                                                            )
                                                                                        )}
                                                                                    </Select>
                                                                                </FormControl>
                                                                            </label>
                                                                        </Grid>
                                                                        <Grid item xs>
                                                                            <label className="input select">
                                                                                <FormControl fullWidth
                                                                                             variant="outlined"
                                                                                             margin="dense">
                                                                                    <InputLabel
                                                                                        id="idTipoServicioLabel">Tipo
                                                                                        Servicio</InputLabel>
                                                                                    <Select
                                                                                        native
                                                                                        labelId="idTipoServicioLabel"
                                                                                        label="Tipo Servicio"
                                                                                        className="form-control"
                                                                                        required
                                                                                        onChange={handleChange}
                                                                                        disabled
                                                                                        id="idTipoServicio"
                                                                                        name="idTipoServicio"
                                                                                        read="true"
                                                                                        value={state.idTipoServicio}

                                                                                    >
                                                                                        <option key={0}
                                                                                                value="0">Seleccionar
                                                                                        </option>
                                                                                        <option key={"1"}
                                                                                                value={1}
                                                                                        >
                                                                                            Consolidado
                                                                                        </option>
                                                                                        <option key={"2"}
                                                                                                value={2}
                                                                                        >
                                                                                            Paquetería
                                                                                        </option>
                                                                                    </Select>
                                                                                </FormControl>
                                                                            </label>
                                                                        </Grid>
                                                                        <Grid item xs>
                                                                            <div className="input">
                                                                                <TextField variant="outlined"
                                                                                           margin="dense"
                                                                                           onChange={handleChange}
                                                                                           className="form-control"
                                                                                           type="text"
                                                                                           InputLabelProps={{
                                                                                               shrink: true,
                                                                                           }}
                                                                                           label="Valor Declarado"
                                                                                           placeholder={state.ValorDeclarado}
                                                                                           readOnly={state.agregar == "Consultar"}
                                                                                           value={state.ValorDeclarado}
                                                                                           disabled
                                                                                           id="ValorDeclarado"
                                                                                           name="ValorDeclarado"
                                                                                           InputProps={{
                                                                                               startAdornment:
                                                                                                   <InputAdornment
                                                                                                       position="start">$</InputAdornment>,
                                                                                           }}
                                                                                />
                                                                            </div>
                                                                        </Grid>
                                                                        <Grid item xs>
                                                                            <div className="input">
                                                                                <TextField variant="outlined"
                                                                                           margin="dense"
                                                                                           className="form-control"
                                                                                           type="number"
                                                                                           disabled={state.agregar === "Consultar" || !state.aplicaSeguro}
                                                                                           label="Porcentaje de seguro"
                                                                                           onChange={handleChange}
                                                                                           value={state.porcentajeSeguro}
                                                                                           placeholder="%"
                                                                                           name="porcentajeSeguro"
                                                                                           InputProps={{
                                                                                               endAdornment:
                                                                                                   <InputAdornment
                                                                                                       position="start">%</InputAdornment>,
                                                                                           }}
                                                                                />
                                                                            </div>
                                                                        </Grid>
                                                                        <Grid item xs>
                                                                            <FormControlLabel disabled
                                                                                              control={<Checkbox
                                                                                                  checked={state.tieneRecoleccion}
                                                                                                  name="tieneRecolecion"/>}
                                                                                              label="Tiene recolección"/>
                                                                        </Grid>
                                                                        <Grid item xs>
                                                                            <FormControlLabel disabled
                                                                                              control={<Checkbox
                                                                                                  checked={state.tieneEntregaDomicilio}
                                                                                                  name="tieneEntregaDomicilio"/>}
                                                                                              label="Tiene entrega a domicilio"/>
                                                                        </Grid>
                                                                        {/*<Grid item xs={1.5}>
                                                                            <FormControlLabel disabled
                                                                                              control={<Checkbox
                                                                                                  checked={state.tieneCitaRecoleccion}
                                                                                                  name="tieneCita"/>}
                                                                                              label="Tiene cita para recolección"/>
                                                                        </Grid>*/}
                                                                        <Grid item xs>
                                                                            <FormControlLabel disabled
                                                                                              control={<Checkbox
                                                                                                  checked={state.tieneCitaEntrega}
                                                                                                  name="tieneCita"/>}
                                                                                              label="Tiene cita para entrega"/>
                                                                        </Grid>
                                                                    </Grid>
                                                                </div>
                                                                {/*</form>*/}
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>


                                    </div>

                                    <div className="widget-wrap" id="conceptosFacturacion">
                                        <div className="widget-header">
                                            <div className="col-md-12">
                                                <h2>Conceptos de Facturación</h2>
                                            </div>
                                        </div>

                                        <div className="widget-container">
                                            <div className="widget-content">
                                                <div className="row">
                                                    <div className="col-md-12">
                                                        <ConceptosFacturacionGuias
                                                            keys={0}
                                                            disabled={false}
                                                            dataPaquetes={conceptosAdicionales}
                                                            onChangeList={handleChangeListConceptos}
                                                            conceptosBase={dataConceptosBase}
                                                            ivaTraslada={state.ivaTraslada}
                                                            ivaRetiene={state.ivaRetiene}
                                                        />
                                                    </div>
                                                </div>


                                            </div>
                                        </div>

                                    </div>

                                    <div className="form-footer col-md-12">

                                        {/*<button
                                                            href="#Listado"
                                                            role="tab"
                                                            data-toggle="tab"
                                                            className="btn btn-secondary secondary-btn"
                                                        >
                                                            Cancelar
                                                        </button>*/}
                                        <div className="form-footer ol-md-12">
                                            <Grid container spacing={1}>
                                                <Grid item xs>
                                                    <Button fullWidth color={"secondary"} variant={"contained"}
                                                            onClick={(event) => {
                                                                event.stopPropagation();
                                                                setState({...state, agregar: "Agregar"});
                                                                $('.nav-tabs li ').removeClass('active');
                                                                $('.nav-tabs li').eq(0).addClass('active');
                                                                $('.tab-content div ').removeClass('in show');
                                                                $('#Listado').addClass('in show');
                                                            }} style={{color: "white"}}>
                                                        Cancelar
                                                    </Button>
                                                </Grid>
                                                <Grid item xs>
                                                    <Button fullWidth type="submit"
                                                            className="btn btn-primary primary-btn"
                                                            disabled={state.agregar === "Consultar"}>
                                                        Guardar guía
                                                    </Button>
                                                </Grid>
                                            </Grid>
                                        </div>
                                    </div>

                                </div>
                                {
                                    state.agregar != "Agregar" &&
                                    <div className="row">
                                        <div className="widget-wrap">
                                            <div className="widget-container">
                                                <div className="widget-content">
                                                    {/*<div className="row">
                                                    <div className="widget-header">
                                                        <Accordion>
                                                            <AccordionSummary
                                                                expandIcon={<ExpandMoreIcon/>}
                                                                aria-controls="panel1a-content"
                                                                id="panel1a-header"
                                                            ><Typography className={classes.heading}><h2>Evidencias
                                                                última milla</h2></Typography>
                                                            </AccordionSummary>

                                                            <AccordionDetails>
                                                                <Evidencias esRecoleccion={0} idGuia={state.idGuia}
                                                                            data={state}/>
                                                            </AccordionDetails>
                                                        </Accordion>
                                                    </div>
                                                </div>*/}
                                                    <Evidencias esRecoleccion={0} idGuia={state.idGuia}
                                                                data={state}/>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                }
                            </form>
                        </div>
                        <div id="Importar" className="tab-pane fade">

                            <div className="widget-wrap">
                                <div className="widget-content">
                                    <div className="row">
                                        <div className="col-md-12">
                                            <form className="j-forms">
                                                <div className="form-content">
                                                    <div className="col-sm-12 col-md-12 unit">
                                                        <label className="label">
                                                            Importar
                                                        </label>
                                                        <div className="input">
                                                            <TextField variant="outlined" margin="dense"
                                                                       onChange={handleUpload}
                                                                       className="form-control"
                                                                       type="file"
                                                                       placeholder="some text"
                                                                       id="importar"
                                                            />
                                                        </div>
                                                    </div>
                                                </div>
                                                <br></br>
                                                <div className="form-footer col-md-12">
                                                    <button className="btn btn-default btn-block ex-noty"
                                                            data-layout="topCenter" data-type="information">Notificación
                                                    </button>
                                                    <button href="#Listado" role="tab" data-toggle="tab"
                                                            data-layout="topCenter" data-type="information"
                                                            className="btn btn-secondary secondary-btn"
                                                    >
                                                        Cancelar
                                                    </button>
                                                </div>
                                            </form>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div id="Imprimir" className="tab-pane fade">
                            <div style={{padding: "20px"}} className="widget-wrap">
                                <div id="impresionDiv">

                                    {framesPaqueteImp}
                                </div>


                            </div>

                        </div>
                        <div id="Cancelar" className="tab-pane fade">
                            <div className="widget-wrap">
                                <div className="widget-container">
                                    <div className="widget-content">
                                        <div className="row">
                                            <form className="j-forms" onSubmit={handleCancelar}>
                                                <div className="form-content">

                                                    <div className="col-sm-6 col-md-2-5 col-lg-2-5 unit">
                                                        <label className="label">Folio Guía</label>
                                                        <div className="input">
                                                            <TextField variant="outlined" margin="dense"
                                                                       onChange={handleChange}
                                                                       className="form-control"
                                                                       type="text"
                                                                       InputLabelProps={{
                                                                           shrink: true,
                                                                       }}
                                                                       value={state.folioGuia}
                                                                       id="folioGuia"
                                                                       name="folioGuia"
                                                                       readOnly
                                                            />
                                                        </div>
                                                    </div>

                                                    <div className="col-sm-6 col-md-2-5 col-lg-2-5 unit">
                                                        <label className="label">Sucursal</label>
                                                        <div className="input">
                                                            <TextField variant="outlined" margin="dense"
                                                                       onChange={handleChange}
                                                                       className="form-control"
                                                                       type="text"
                                                                       value={state.sucursalCancelacion}
                                                                       id="sucursalCancelacion"
                                                                       name="sucursalCancelacion"
                                                                       readOnly
                                                            />
                                                        </div>
                                                    </div>

                                                    <div className="col-sm-6 col-md-2-5 col-lg-2-5 unit">
                                                        <label className="label">Fecha</label>
                                                        <div className="input">
                                                            <TextField variant="outlined" margin="dense"
                                                                       onChange={handleChange}
                                                                       className="form-control"
                                                                       type="text"
                                                                       InputLabelProps={{
                                                                           shrink: true,
                                                                       }}
                                                                       value={state.fechaCancelado}
                                                                       id="fechaCancelado"
                                                                       name="fechaCancelado"
                                                                       readOnly
                                                            />
                                                        </div>
                                                    </div>

                                                    <div className="col-sm-6 col-md-2-5 col-lg-2-5 unit">
                                                        <label className="label">Usuario</label>
                                                        <div className="input">
                                                            <TextField variant="outlined" margin="dense"
                                                                       onChange={handleChange}
                                                                       className="form-control"
                                                                       type="text"
                                                                       InputLabelProps={{
                                                                           shrink: true,
                                                                       }}
                                                                       value={state.usuarioCancela}
                                                                       id="usuarioCancela"
                                                                       name="usuarioCancela"
                                                                       readOnly
                                                            />
                                                        </div>
                                                    </div>

                                                    <div className="col-sm-6 col-md-2-5 col-lg-2-5 unit">
                                                        <label className="label">Estatus</label>
                                                        <div className="input">
                                                            <TextField variant="outlined" margin="dense"
                                                                       onChange={handleChange}
                                                                       className="form-control"
                                                                       type="text"
                                                                       InputLabelProps={{
                                                                           shrink: true,
                                                                       }}
                                                                       value={state.estatusGuia}
                                                                       id="estatusGuia"
                                                                       name="estatusGuia"
                                                                       readOnly
                                                            />
                                                        </div>
                                                    </div>

                                                    <div className="col-sm-12 col-md-12 col-lg-12 unit">
                                                        <label className="label">Motivo</label>
                                                        <div className="input">
                                                            <TextField variant="outlined" margin="dense"
                                                                       onChange={handleChange}
                                                                       className="form-control"
                                                                       type="text"
                                                                       InputLabelProps={{
                                                                           shrink: true,
                                                                       }}
                                                                       value={state.MotivoCancelacion}
                                                                       id="MotivoCancelacion"
                                                                       required
                                                                       name="MotivoCancelacion"
                                                            />
                                                        </div>
                                                    </div>

                                                    <div className="form-footer col-md-12">
                                                        {/*<button
                                                            href="#Listado"
                                                            role="tab"
                                                            data-toggle="tab"
                                                            className="btn btn-secondary secondary-btn"
                                                            onClick={handleShowListado}
                                                        >
                                                            Cancelar
                                                        </button>*/}
                                                        <button
                                                            type="submit"
                                                            className="btn btn-primary primary-btn"
                                                        >
                                                            Aceptar
                                                        </button>
                                                    </div>

                                                </div>
                                            </form>
                                        </div>
                                    </div>
                                </div>
                            </div>

                        </div>
                        <div id={"Sandbox"} className="tab-pane fade">
                            <Cubicar
                                espacio={'CAJA'}
                                open={true}
                                close={() => {console.log('cerrao')}}
                                data={{
                                    anchoEspacio: 10,
                                    altoEspacio: 20,
                                    largoEspacio: 30,
                                    productos: [
                                        {
                                            asignado: true,
                                            descripcion: 'TOMATOS',
                                            posicionX: 1,
                                            ancho: 2,
                                            posicionZ: 1,
                                            alto: 2,
                                            posicionY: 1,
                                            largo: 2
                                        }
                                    ]
                                }}
                                largoEspacio={'100'}
                                anchoEspacio={'200'}
                                altoEspacio={'300'}/>
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


export default Guia;