import React, { useEffect, useState, useMemo } from "react";
import axios from "axios";
import Cabecera from "../Components/Template/Cabecera";

import BarraLateralIzquierda from "../Components/Template/BarraLateralIzquierda";
import BarraLateralDerecha from "../Components/Template/BarraLateralDerecha";
import {Tab, Tabs, Box, InputAdornment} from '@material-ui/core';
import ConceptosAdicionalesManiobra from './Tarifas/ConceptosAdicionalesManiobra';
import ConceptosAdicionalesEntrega from './Tarifas/ConceptosAdicionalesEntrega';
import ConceptosAdicionalesRecoleccion from './Tarifas/ConceptosAdicionalesRecoleccion';
import Carousel, { propTypes } from "re-carousel";
import IndicatorDots from "../Util/Dots";
import Buttons from "../Util/CarruselButtons";
import { makeStyles } from "@material-ui/core/styles";
import * as XLSX from 'xlsx';
import { useTable, useFilters, useAsyncDebounce, useSortBy } from 'react-table'
import $ from 'jquery';
import { getUniqueListBy, remove_array_element } from "../Util/Util";
import Barra from "../Util/jquery-barcode"
import { DataGrid } from '@material-ui/data-grid';

import Noty from 'noty';
import { SignalCellularNoSimOutlined } from "@material-ui/icons";
import ConceptosAdicionales from "./Tarifas/ConceptosAdicionales";
import { Dialog, DialogActions, DialogContent, DialogTitle, FormControl, InputLabel, Select, Step, StepLabel, Stepper, TextField, Tooltip } from "@material-ui/core";
import { dataGridLocaleText } from "../Constants";
import { obtenerCiudades } from "../Util/Contexts/CiudadesContext";
import { obtenerEstatusGuia } from "../Util/Contexts/EstatusContext";
import { obtenerEmbarquesId, obtenerEmbarqueMoneda } from "../Util/Contexts/EmbarquesContext";
import { ultimoFolioGuia, eliminarGuia, obtenerGuiaId, cancelarGuia, obtenerGuiasFiltro, obtenerGuia, modificarGuia, agregarGuia, imprimirGuia } from "../Util/Contexts/GuiaContext";
import { obtenerMonedas } from "../Util/Contexts/MonedaContext";
import { obtenerTipoCambio } from "../Util/Contexts/TipoCambioContext";
import { validarPermisos } from "../Util/Contexts/UsuarioContext";
import { obtenerSucursales } from "../Util/Contexts/SucursalContext";
import {
    obtenerConceptosDefectoListado,
    obtenerConceptosFacturacion
} from "../Util/Contexts/ConceptosFacturacionContext";
import { obtenerTipoCobro } from "../Util/Contexts/TipoCobroContext";
import { obtenerTipoServicio } from "../Util/Contexts/TipoServiciosContext";
import { obtenerImpuestosTipo } from "../Util/Contexts/ImpuestosContext";
import { imprimirFormatosId, obtenerFormatosImpresion } from "../Util/Contexts/FormatosImpresionContext";
import {obtenerCodigoPostalId} from "../Util/Contexts/CodigoPostalContext";

function showSuccess(mensaje) {
    new Noty({
        type: "information",
        layout: "topCenter",
        text: mensaje,
        timeout: "3000"
    }).show()
}


window.jQuery = window.$ = $;
const styles = {
    paqueteCarrusel: {
        height: "170px !important",
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
    const [dataFormatos, setFormatosImpresion] = React.useState([]);
    const [state, setState] = React.useState({
        //VARIABLES PARA LISTADO DE GUIAS
        sucursalListado: 0,
        fechaFinal: today.getFullYear() + "-" + (today.getMonth() + 1) + "-" + today.getDate(),
        fechaInicial: "",
        estatusListado: 0,
        idGuia: 0,
        //VARIABLES PARA CANCELAR GUIA
        //variable de folioGuia es la misma que en agregar
        usuarioCancela: "",
        fechaCancelado: "",
        usuarioCancelacion: 0,
        estatusGuia: "",
        MotivoCancelacion: "",
        //VARIABLES PARA AGREGAR GUIA
        //Informacion General
        idSucursalAgregar: localStorage.getItem("Sucursal"),
        folioGuia: "",
        idEmbarque: 0,
        folioInforme: "",
        tracking: "",
        fecha: "",
        idEstatusGuia: '',
        idMoneda: 0,
        tipoCambio: 0,
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
        idTipoServicio: '',
        ValorDeclarado: "",
        //Conceptos de facturacion
        conceptosAdicionales: [],
        ivaTraslada: [],
        ivaRetiene: [],
        //Aqui se almacenaran los conceptos de las guias que ya fueron creadas
        arClsGuiaConceptos: [],

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

    })

    function cargaDiv(indice, valor) {
        //	showSuccess(indice);
        $("#idBarra" + indice).barcode(valor, "code128");
    }
    const [dataFolioGuia, SetDataFolioGuia] = React.useState([]);
    const [fileUploaded, setFileUploaded] = React.useState([])
    const [stepActive, setStepActive] = React.useState(1);
    //Listado de sucursales. Se usa en listado y agregar.
    const [dataSucursal, setDataSucursal] = React.useState([])
    const [dataMoneda, setDataMoneda] = React.useState([])
    const [dataTipoCobro, setDataTipoCobro] = React.useState([])
    const [dataEstatusGuia, setDataEstatusGuia] = React.useState([])
    const [dataEmbarque, setDataEmbarque] = React.useState([])
    const [dataConceptosDefecto, setDataConceptosDefecto] = useState([])

    const [dataTipoServicio, setDataTipoServicio] = React.useState([])

    const handleAceptar = (e) => {
        e.preventDefault()
        console.log(state.conceptosAdicionales)
        let params = {
            "TIpoCambio": state.tipoCambio,
            "FolioGuia": state.folioGuia,
            "IdEstatusGuia": state.idEstatusGuia,
            "IdEmbarque": state.idEmbarque,
            "IdMoneda": state.idMoneda,

            "CreadoPor": state.creadoPor,
            "ModificadoPor": state.modificadoPor,
            "IdSucursal": state.idSucursalAgregar,
            "ValorDeclarado": state.ValorDeclarado,
            "idTipoServicio": state.idTipoServicio,

            "arClsGuiaConceptos": state.conceptosAdicionales.map(c => ({
                m_nIdConceptosFacturacion: c.concepto.m_nIdConceptosFacturacion,
                m_cImporte: c.importe,
                m_nIdImpuestoTraslada: c.traslada,
                m_nIdImpuestoRetiene: c.retiene,
                m_cImporteRetiene: c.importeRet,
                m_cImporteIva: c.importeIva,
                m_bActivo: true,
            })),

        }

        console.log(params)
        console.log(JSON.stringify(params));

        // debugger;
        console.log('id guia')
        console.log(state.idGuia)
        if (state.idGuia == 0 || state.idGuia == '' || state.idGuia == undefined) {
            agregarGuia(params).then(respuesta => {
                showSuccess(respuesta.data)
                //window.location.reload();
                let resp = respuesta.data;
                let vGuia = resp.substring(resp.indexOf(":") + 2);
                handleShowListado()
                getImpresion(vGuia);
            }).catch(err => {
                console.log(err)
                showSuccess(err)
            });
            /*showSuccess('Guia agregada')
            limpiarCamposAgregar()*/
        } else {
            modificarGuia(state.idGuia, params).then(respuesta => {
                showSuccess(respuesta.data)
                handleShowListado()
            }).catch(err => {
                console.log(err)
                showSuccess(err)
            });
            /*showSuccess('Guia modificada')
            limpiarCamposAgregar()*/
        }
    }

    function getUltimoFolioGuia() {
        ultimoFolioGuia().then((respuesta) => { SetDataFolioGuia(respuesta.data); });
    }

    async function getImpresion(id) {
        //showSuccess (state.nGuiaId);		
        //if (state.muestraPaquetes === true) return;		
        imprimirGuia(id).then(respuesta => {
            setState({
                ...state,
                paquetesI: [],
                // muestraPaquetes:true 
            });
            const paquetesTemp = state.paquetesI;
            for (var i = 0; i < respuesta.data.length; i++) {


                paquetesTemp.push({

                    CiudadOrigen: respuesta.data[i].m_sCiudadOrigen,
                    Remitente: respuesta.data[i].m_sNOmbreRemitente,
                    CiudadRemitente: respuesta.data[i].m_sCiudadRemitente,
                    RFC: respuesta.data[i].m_sRFCRemitente,
                    Direccion: respuesta.data[i].m_sDomicilioRemitente,
                    Zona: respuesta.data[i].m_sZonaRemitente,
                    CP: respuesta.data[i].m_nIdCodigoPostalRemitente,
                    Telefono: respuesta.data[i].m_sTelefonoRemitente,
                    CiudadDestino: respuesta.data[i].m_sCiudadDestino,
                    RFCDestinatario: respuesta.data[i].m_sRFCDestinatario,
                    DireccionDestinatario: respuesta.data[i].m_sDomicilioDestinatario,
                    ZonaDestinatario: respuesta.data[i].m_sZonaDestino,
                    CPDestinatario: respuesta.data[i].m_nIdCodigoPostalDestinatario,
                    CiudadDestinatario: respuesta.data[i].m_sCiudadDestinatario,
                    TelefonoDestinatario: respuesta.data[i].m_sTelefonoDestinatario,
                    FolioPaquete: respuesta.data[i].m_sFolioPaquete,
                    Cantidad: respuesta.data[i].m_nCantidadPaquete,
                    Descripcion: respuesta.data[i].m_sDescripcionPaquete,
                    Destinatario: respuesta.data[i].m_sNombreDestinatario,
                    PaqueteCant: respuesta.data[i].m_nCantidadPaquete,
                    DescripcionPaquete: respuesta.data[i].m_sDescripcionPaquete,
                    RfcFiscal: respuesta.data[i].m_sRfcFiscal,
                    NombreFiscal: respuesta.data[i].m_sNombreFiscal,
                    Telefonos: respuesta.data[i].m_sTelefonos,
                    Colonia: respuesta.data[i].m_sColonia,
                    Calle: respuesta.data[i].m_sCalle
                });
            }
            paquetesTemp.splice(0, 1);
            setState({
                ...state,
                paquetesI: paquetesTemp,
                // muestraPaquetes:true
            });
            $("#Imprimir").click();
        });
    };

    function getFormatosImpresion() {
        obtenerFormatosImpresion().then(respuesta => {
            setFormatosImpresion(respuesta.data)
        });
    };

    function getTipoCambio() {
        obtenerTipoCambio().then(respuesta => {
            setDataTipoCambio(respuesta.data)
        });
    };

    function handleEliminar(id) {
        var derecho;
        validarPermisos(state).then(respuesta => {
            //showSuccess(respuesta.data)

            derecho = respuesta.data;
            if (derecho == false) {
                showSuccess("El usuario no tiene derechos para realizar el proceso");
                return;
            }

            eliminarGuia(id, state.modificadoPor).then(respuesta => {
                showSuccess(respuesta.data)
                //console.log(respuesta)
                if (respuesta.data.indexOf("fracaso:") <= 0)
                    getAllData()
            }).catch(function (err) {
                console.log(err.data)
            });
        }).catch(err => {
            showSuccess(err)
        });
    }

    function handleShowModificar(id) {
        obtenerGuiaId(id).then(respuesta => {
            console.log('Modifica guia:')
            console.log(respuesta.data)
            //Primero se obtienen las monedas que corresponden a la sucursal
            //Despues se obtienen los datos del embarque al que pertenece la guia para mostrar los datos
            cargaEmbarqueModificar(respuesta.data.IdSucursal, respuesta.data.m_nIdMoneda, id)
            handleEmbarque(respuesta.data.m_nIdEmbarque)
            setState(state => {
                return {
                    ...state,
                    agregar: "Modificar",
                    idTipoServicio: respuesta.data.m_nIdTipoServicio,
                    idEstatusGuia: respuesta.data.m_nIdEstatusGuia,

                    fecha: respuesta.data.m_dFecha,
                    folioGuia: respuesta.data.m_nFolioGuia,
                    idGuia: respuesta.data.m_nIdGuia,
                    tracking: respuesta.data.m_nTracking,
                    conceptosAdicionales: respuesta.data.m_arClsGuiaConceptos,
                    creadoEl: respuesta.data.m_dCreadoEl,
                }
            })

        }).catch(function (err) {
            console.log(err.data)
        });
    }

    function handleShowConsultar(id) {
        obtenerGuiaId(id).then(respuesta => {
            console.log('Consulta guia:')
            console.log(respuesta.data)
            cargaEmbarqueModificar(respuesta.data.IdSucursal, respuesta.data.m_nIdMoneda, id)
            handleEmbarque(respuesta.data.m_nIdEmbarque)

            setState(state => {
                return {
                ...state,
                    agregar: "Consultar",
                    idTipoServicio: respuesta.data.m_nIdTipoServicio,
                    idEstatusGuia: respuesta.data.m_nIdEstatusGuia,

                    fecha: respuesta.data.m_dFecha,
                    folioGuia: respuesta.data.m_nFolioGuia,
                    idGuia: respuesta.data.m_nIdGuia,
                    tracking: respuesta.data.m_nTracking,
                    conceptosAdicionales: respuesta.data.m_arClsGuiaConceptos,
                    creadoEl: respuesta.data.m_dCreadoEl,

                }
            });
        }).catch(function (err) {
            console.log(err.data)
        });
    }

    //Muestra la pestaña de cancelar
    function handleShowCancelar() {
        limpiarCamposAgregar()
        obtenerGuiaId(state.idGuia).then((respuesta) => {
            setState({
                ...state,
                usuarioCancela: respuesta.data.m_nUsuarioCancelacion != 0 ? respuesta.data.m_nUsuarioCancelacion : localStorage.getItem("Usuario"),
                folioGuia: respuesta.data.m_nFolioGuia,
                sucursalCancelacion: respuesta.data.m_sSucursal,
                fechaCancelado: today.getDate() + "/" + (today.getMonth() + 1) + "/" + today.getFullYear(),
                estatusGuia: respuesta.data.m_sEstatusGuia,
                motivoCancelacion: respuesta.data.m_sMotivoCancelacion
            })
            if (respuesta.data.m_nFolioInforme != 0)
                showSuccess("Guía no se puede cancelar ya que no pertenece a ningun informe.")
        })
    }

    //Funcion para cancelar una guia. Se usa en pestaña cancelar.
    const handleCancelar = (e) => {
        e.preventDefault();
        var params = {
            "motivoCancelacion": state.MotivoCancelacion,
            "usuarioCancelacion": localStorage.getItem("UsuarioId"),
            "fechaCancelacion": state.fechaCancelado
        }
        console.log(JSON.stringify(params))
        cancelarGuia(state.idGuia, params).then((respuesta) => {
            console.log(respuesta.data)
            showSuccess(respuesta.data)
        })
    }

    /*function handleImprmir()
    {
      
    var printWindow = window.open('', '', 'height=700,width=900');
  
    printWindow.document.write('<html><head><title></title>');
    printWindow.document.write('<link rel="stylesheet" href="//netdna.bootstrapcdn.com/bootstrap/3.1.0/css/bootstrap.min.css" >');//external styles
    printWindow.document.write('</head><body>');
    printWindow.document.write($('#impresionDiv').html());
    printWindow.document.write('</body></html>');
    printWindow.document.close();
  
    printWindow.onload=function(){
    printWindow.focus();                                         
    printWindow.print();
    printWindow.close();
    }
  }
  function handleImprmir2()
  {
    var pdf = new jspdf('p', 'pt', 'letter');
          var source = $('#impresionDiv')[0];
  
          var specialElementHandlers = {
              '#bypassme': function (element, renderer) {
                  return true
              }
          };
          var margins = {
              top: 80,
              bottom: 60,
              left: 40,
              width: 522
          };
  
          pdf.fromHTML(
              source, 
              margins.left, // x coord
              margins.top, { // y coord
                  'width': margins.width, 
                  'elementHandlers': specialElementHandlers
              },
  
              function (dispose) {
                  pdf.save('Prueba.pdf');
              }, margins
          );
    }*/

    /*function handleShowImprimir() {
        //getImpresion(38);
    }*/

    //Prepara campos para agregar guia
    function handleShowAgregar() {
        setState(state => {
            return {
            ...state,
                agregar: "Agregar",
                fecha: today.getDate() + "/" + (today.getMonth() + 1) + "/" + today.getFullYear() + " " + today.getHours() + ":" + today.getMinutes(),
            }
        });
        limpiarCamposAgregar()
        //getImpresion(38);
    }

    const handleShowListado = () => {
        limpiarCamposAgregar()
        getAllData()
    }

    const handleChange = event => {
        console.log(event.target.name + " : " + event.target.value)
        setState({
            ...state,
            [event.target.name]: event.target.value
        });
    };

    //Hace filtrado de guias por fechas. Se usa en listado de guias
    const handleFechaInicialFiltro = async (event) => {
        setState({
            ...state,
            fechaInicial: event.target.value,
        })
        obtenerGuiasFiltro(
            event.target.value, state.fechaFinal, state.sucursalListado, state.estatusListado).then(respuesta => {
                setData(respuesta.data)
            })
    }

    //Hace filtrado de guias por fechas. Se usa en listado de guias
    const handleFechaFinalFiltro = async (event) => {
        setState({
            ...state,
            fechaFinal: event.target.value,
        })

        obtenerGuiasFiltro(state.fechaInicial, event.target.value, state.sucursalListado, state.estatusListado).then(respuesta => {
            setData(respuesta.data)
        })
    }

    //Hace filtrado de guias por sucursal. Se usa en listado de guias
    const handleSucursalFiltro = async (event) => {
        setState({
            ...state,
            sucursalListado: event.target.value,
        })
        obtenerGuiasFiltro(state.fechaInicial, state.fechaFinal, event.target.value, state.estatusListado).then(respuesta => {
            setData(respuesta.data)
        })
    }

    //Hace filtrado de guias por estatus. Se usa en listado de guias
    const handleEstatusFiltro = async (event) => {
        setState({
            ...state,
            estatusListado: event.target.value,
        })
        obtenerGuiasFiltro(state.fechaInicial, state.fechaFinal, state.sucursalListado, event.target.value).then(respuesta => {
            setData(respuesta.data)
        })
    }

    const handleChangePaquete = (event, index) => {

        var { paquetes } = state
        paquetes[index][event.target.name] = event.target.value
        setState({
            ...state,
            paquetes: paquetes
        });
    };

    const handleChangeSobre = (event, index) => {

        var { sobres } = state
        sobres[index][event.target.name] = event.target.value
        setState({
            ...state,
            sobres: sobres
        });
    };

    const columns = React.useMemo(() => [
        {
            headerName: "Acciones",
            sortable: false, filterable: false,
            field: "",
            renderCell: (row) => {
                return (
                    <div>
                        <Tooltip title="Modificar">
                            <a href="#Agregar" role="tab" data-toggle="tab" onClick={() => (handleShowModificar(row.row.m_nIdGuia))} className="btn btn-default btn-xs"><i className="fa fa-pencil-square-o" style={{ color: "#F9A03E" }} /></a>

                        </Tooltip>
                        <Tooltip title="Consultar">
                            <a href="#Agregar" role="tab" data-toggle="tab" className="btn btn-default btn-xs" onClick={() => (handleShowConsultar(row.row.m_nIdGuia))}><i className="fa fa-eye" style={{ color: "#F9A03E" }} /></a>

                        </Tooltip>
                        <Tooltip title="Eliminar">
                            <a href="#" className="btn btn-default btn-xs" onClick={() => (handleEliminar(row.row.m_nIdGuia))}><i className="zmdi zmdi-delete" style={{ color: "#F30B0B" }} /></a>

                        </Tooltip>
                    </div>
                )
            }
        },
        {
            headerName: "Fecha/Hora Elaboración",
            field: "m_sFechaHora",
            width: 200,
        }, {
            headerName: "Sucursal",
            field: "m_sSucursal",
            width: 125,
        }, {
            headerName: "Estatus Guia",
            field: "m_sEstatusGuia",
            width: 125,
        }, {
            headerName: "Origen",
            field: "m_sCiudadOrigen",
            width: 125,
        }, {
            headerName: "Destino",
            field: "m_sCiudadDestino",
            width: 125,
        }, {
            headerName: "Folio Guia",
            field: "m_nFolioGuia",
            width: 125,
        }, {
            headerName: "Folio Informe",
            field: "m_sFolioInforme",
            width: 125,
        }, {
            headerName: "Folio Embarque",
            field: "m_sFolioEmbarque",
            width: 150,
        },
        {
            headerName: "Fecha de Cancelacion",
            field: "m_dtFechaCancelacion",
            width: 200,
        },
        {
            headerName: "Usuario de Cancelacion",
            field: "m_nUsuarioCancelacion",
            width: 200,
        }

    ]);

    useEffect(value => {
        if (localStorage.getItem("UsuarioId") === null || localStorage.getItem("UsuarioId") <= 0) {
            showSuccess("Es necesario iniciar sesion para acceder a este proceso");
            window.location.replace("login");
            return;
        }
        getAllData()
        getConceptosDefecto()
        getAllDataSucursal()
        getAllDataMoneda()
        getAllDataTipoCobro()
        getAllDataTipoServicio()
        getAllDataEstatusGuia()
        getUltimoFolioGuia()
        getTipoCambio()
        getFormatosImpresion()
    }, []);

    const getConceptosDefecto = () => {
        obtenerConceptosDefectoListado().then(conceptosDefecto => {
            setDataConceptosDefecto(conceptosDefecto.data)
            if (props.location.idEmbarque != undefined) {

                obtenerEmbarquesId(props.location.idEmbarque).then(respuesta => {
                    setState(state => {
                        return {
                            ...state,
                            fecha: today.getDate() + "/" + (today.getMonth() + 1) + "/" + today.getFullYear() + " " + today.getHours() + ":" + today.getMinutes(),
                        }
                    })

                    console.log('Embarque datos:')
                    console.log(respuesta.data)


                    setDataFromEmbarque(respuesta, conceptosDefecto.data)
                    obtenerEmbarqueMoneda(respuesta.data.IdSucursal, respuesta.data.m_nIdMoneda, state.idGuia).then(respuesta => {
                        setDataEmbarque(respuesta.data)
                    })

                });
            }
        })
    }

    async function getAllData() {
        obtenerGuia().then(respuesta => {
            setData(respuesta.data)
        });
    }

    function addConcepto(data) {
        const { conceptosAdicionales } = state
        var ivaTraslada = []
        var ivaRetiene = []
        conceptosAdicionales.push({ concepto: data.concepto, importe: data.importe, retiene: data.retiene, traslada: data.traslada, importeRet: data.importeRet, importeIVA: data.importeIVA, rangoMinimo: data.rangoMinimo, rangoMaximo: data.rangoMaximo, nombreConcepto: data.nombreConcepto, tipoCalculo: data.tipoCalculo })
        ivaTraslada = getUniqueListBy(conceptosAdicionales, "traslada").map(i => i.traslada);
        ivaRetiene = getUniqueListBy(conceptosAdicionales, "retiene").map(i => i.retiene);
        setState({ ...state, conceptosAdicionales: conceptosAdicionales, ivaRetiene: ivaRetiene, ivaTraslada: ivaTraslada })
    }

    function removeConcepto(index) {
        const { conceptosAdicionales } = state
        conceptosAdicionales.splice(index, 1)
        setState({ ...state, conceptosAdicionales: conceptosAdicionales })
    }

    const handleUpload = (e) => {
        e.preventDefault();

        var files = e.target.files, f = files[0];
        var reader = new FileReader();
        console.log(e.target.files)
        reader.onload = function (e) {
            console.log("Nothing Happened")
            var data = e.target.result;
            let readedData = XLSX.read(data, { type: 'binary' });
            const wsname = readedData.SheetNames[0];
            const ws = readedData.Sheets[wsname];

            /* Convert array to json*/
            const dataParse = XLSX.utils.sheet_to_json(ws, { header: 1 });
            console.log("dataParse : " + dataParse)
            setFileUploaded(dataParse);
        };
        reader.readAsBinaryString(f)
    }

    async function getAllDataSucursal() {
        obtenerSucursales().then(respuesta => {
            setDataSucursal(respuesta.data)
        });
    }

    //Recibe el id de embarque para obtener sus datos del servidor y mostrarlos en pantalla
    function handleEmbarque(embarque) {
        obtenerEmbarquesId(embarque).then(respuesta => {
            setDataFromEmbarque(respuesta, dataConceptosDefecto)
        });
    }

    const setDataFromEmbarque = (respuesta, respuestaConceptos) => {
        console.log('Embarque datos:')
        console.log(respuesta.data)
        const paquetesTemp = [];
        const sobresTemp = [];
        let valorDeclaradoTotal = 0

        const {m_arrPaquetes: paquetes, m_arrSobres: sobres} = respuesta.data

        paquetes.forEach((paq) => {
            if (!(paq.m_nIdEmbarqueDetalle === "" || paq.m_nIdEmbarqueDetalle === "0")){
                paquetesTemp.push({
                    peso: paq.m_xPeso,
                    largo: paq.m_xLargo,
                    ancho: paq.m_xAncho,
                    alto: paq.m_xAlto,
                    volumen: paq.m_xVolumen,
                    tipoEmbalaje: paq.m_nTipo,
                    valorDeclarado: paq.m_cValorDeclarado,
                    descripcionPaquete: paq.m_sDescripcion,
                    id: paq.m_nIdEmbarqueDetalle,
                    ctd: paq.ctd
                })
                valorDeclaradoTotal = valorDeclaradoTotal + paq.m_cValorDeclarado
            }
        })

        sobres.forEach((sob) => {
            if (!(sob.m_nIdEmbarqueDetalle === "" || sob.m_nIdEmbarqueDetalle === "0")){
                sobresTemp.push({
                    descripcionSobre: sob.m_sDescripcion,
                    id: sob.m_nIdEmbarqueDetalle
                })
            }
        })

        obtenerCodigoPostalId(respuesta.data.m_nIdCodigoPostalRemitente).then(respuesta => {
          setState( state => {
              return{
                  ...state,
                  codigoPostalRemitente: respuesta.data.m_sCP,
              }
          })
        })
        obtenerCodigoPostalId(respuesta.data.m_nIdCodigoPostalDestinatario).then(respuesta => {
            setState(state => {
                return {
                    ...state,
                    codigoPostalDestinatario: respuesta.data.m_sCP
                }
            })
        })

        setState(state => {
            return{
                ...state,
                idEmbarque: respuesta.data.m_nIdEmbarque,
                idSucursalAgregar: respuesta.data.IdSucursal,
                idMoneda: respuesta.data.m_nIdMoneda,
                tipoCambio: respuesta.data.m_cTIpoCambio,
                idTipoCobro: respuesta.data.m_nIdTIpoCobro,
                folioInforme: respuesta.data.m_nFolioInforme != "" ? respuesta.data.m_nFolioInforme : '',

                nombreRemitente: respuesta.data.m_sNOmbreRemitente,
                RFCRemitente: respuesta.data.m_sRFCRemitente,
                domicilioRemitente: respuesta.data.m_sDomicilioRemitente,
                ciudadRemitente: respuesta.data.m_sCiudadRemitente,
                correoRemitente: respuesta.data.m_sCorreoRemitente,
                telefonoRemitente: respuesta.data.m_sTelefonoRemitente,
                contactoRemitente: respuesta.data.m_sContactoRemitente,
                origenRemitente: respuesta.data.m_sCiudadOrigen,

                sNombreDestinatario: respuesta.data.m_sNombreDestinatario,
                sRFCDestinatario: respuesta.data.m_sRFCDestinatario,
                sDomicilioDestinatario: respuesta.data.m_sDomicilioDestinatario,
                ciudadDestinatario: respuesta.data.m_sCIudadDestinatario,
                sCorreoDestinatario: respuesta.data.m_sCorreoDestinatario,
                sTelefonoDestinatario: respuesta.data.m_sTelefonoDestinatario,
                sContactoDestinatario: respuesta.data.m_sContactoDestinatario,
                CiudadDestino: respuesta.data.m_sCiudadDestino,

                paquetes: paquetesTemp,
                sobres: sobresTemp,

                IdEmbarque: respuesta.data.m_nIdEmbarque,
                ValorDeclarado: valorDeclaradoTotal,

                folioGuia: respuesta.data.m_nFolioGuia,
                idGuia: respuesta.data.m_nIdGuia,
                tracking: respuesta.data.m_nTracking,
                arClsGuiaConceptos: respuesta.data.m_arClsGuiaConceptos,
                creadoEl: respuesta.data.m_dCreadoEl,

            }
        })
        obtenerTarifasPorEmbarque(respuesta.data.m_nIdEmbarque, respuestaConceptos, paquetesTemp, respuesta.data)
    }

    const obtenerTarifasPorEmbarque = (idEmbarque, respuestaConceptos,paquetesTemp, embarque) => {
        const conceptosTemp = []
        let ivaTraslada = []
        let ivaRetiene = []
        axios.get(`${process.env.REACT_APP_API_URL}/Tarifas/GetByEmbarque/${idEmbarque}`, { headers }).then(tarifa => {
            obtenerConceptosByTarifa(tarifa.data[0].m_nIdTarifa)
            console.log('tarifas by embarque')
            console.log(tarifa.data)
            let pesoTotal = 0
            paquetesTemp.forEach( (p) => {
                pesoTotal = pesoTotal + p.peso
            })
            if (tarifa.data.length !== 0) {
                //se recorre el listado de conceptos de la tarifa del embarque
                tarifa.data[0].m_arrArConceptos.forEach(element => {
                    //Se recorre el arreglo de conceptos por defecto para ver si el concepto de tarifa es uno de ellos y buscar a cual corresponde
                    console.log('conceptos defecto: ', respuestaConceptos)
                    respuestaConceptos.forEach(concepto => {
                        if (concepto.m_nIdConceptosFacturacion == element.m_nIdConceptosFacturacion){
                            //Si el embarque implica recolecta y el concepto por defecto es el de recolecta se calcula el rango maximo y minimo
                            if (concepto.m_nIdConcepto == 2 && (embarque.m_bEsRecolecta == 1 || embarque.m_bEsRecolecta == true)){
                                //Si el peso total de los paquetes es menor mayor al rango minimo  y menor al rango maximo se va mostrar en la lista
                                if (element.m_xnRangoMinimo < pesoTotal && element.m_xnRangoMaximo > pesoTotal ){
                                    conceptosTemp.push({
                                        concepto: element,
                                        importe: element.m_cImporte,
                                        retiene: element.m_nIdImpuestoRetiene,
                                        traslada: element.m_nIdImpuestoTraslada,
                                        importeRet: element.m_cImporteRetiene,
                                        importeIVA: element.m_cImporteIva,
                                        rangoMinimo: element.m_xnRangoMinimo,
                                        rangoMaximo: element.m_xnRangoMaximo,
                                        nombreConcepto: element.m_sConcepto,
                                        tipoCalculo: element.m_nIdTipoCalculo
                                    })
                                }
                            }
                            //Si el concepto es de entrega pasa directo a comparar el peso porque eso siempre se cobra
                            if (concepto.m_nIdConcepto == 1 ){
                                if (element.m_xnRangoMinimo < pesoTotal && element.m_xnRangoMaximo > pesoTotal ){
                                    conceptosTemp.push({
                                        concepto: element,
                                        importe: element.m_cImporte,
                                        retiene: element.m_nIdImpuestoRetiene,
                                        traslada: element.m_nIdImpuestoTraslada,
                                        importeRet: element.m_cImporteRetiene,
                                        importeIVA: element.m_cImporteIva,
                                        rangoMinimo: element.m_xnRangoMinimo,
                                        rangoMaximo: element.m_xnRangoMaximo,
                                        nombreConcepto: element.m_sConcepto,
                                        tipoCalculo: element.m_nIdTipoCalculo
                                    })
                                }
                            }
                            //Si el embarque implica envio a domicilio y el concepto es el de envio a domicilio se calcula el peso
                            if (concepto.m_nIdConcepto == 3 && !embarque.m_bEntregaEnSucursal){
                                if (element.m_xnRangoMinimo < pesoTotal && element.m_xnRangoMaximo > pesoTotal ){
                                    conceptosTemp.push({
                                        concepto: element,
                                        importe: element.m_cImporte,
                                        retiene: element.m_nIdImpuestoRetiene,
                                        traslada: element.m_nIdImpuestoTraslada,
                                        importeRet: element.m_cImporteRetiene,
                                        importeIVA: element.m_cImporteIva,
                                        rangoMinimo: element.m_xnRangoMinimo,
                                        rangoMaximo: element.m_xnRangoMaximo,
                                        nombreConcepto: element.m_sConcepto,
                                        tipoCalculo: element.m_nIdTipoCalculo
                                    })
                                }
                            }
                        }
                    })

                    //Esta de aqui es otra forma de hacerlo donde no se usa un for each anidadado. funcionan los dos.
                    //Se busca si el concepto en curso es uno por defecto
                    /*let concepto = respuestaConceptos.find(c => c.m_nIdConceptosFacturacion == element.m_nIdConceptosFacturacion)
                    // console.log('concepto defecto encontrado: ', concepto)
                    //Si es uno por defecto se checa los diferentes estados del embarque
                    if (concepto != undefined){
                        console.log('concepto defecto: ', concepto)
                        //Si el embarque implica recolecta y el concepto por defecto es el de recolecta se calcula el rango maximo y minimo
                        if (concepto.m_nIdConcepto == 2 && (embarque.m_bEsRecolecta == 1 || embarque.m_bEsRecolecta == true)){
                            //Si el peso total de los paquetes es menor mayor al rango minimo  y menor al rango maximo se va mostrar en la lista
                            if (element.m_xnRangoMinimo < pesoTotal && element.m_xnRangoMaximo > pesoTotal ){
                                conceptosTemp.push({
                                    concepto: element,
                                    importe: element.m_cImporte,
                                    retiene: element.m_nIdImpuestoRetiene,
                                    traslada: element.m_nIdImpuestoTraslada,
                                    importeRet: element.m_cImporteRetiene,
                                    importeIVA: element.m_cImporteIva,
                                    rangoMinimo: element.m_xnRangoMinimo,
                                    rangoMaximo: element.m_xnRangoMaximo,
                                    nombreConcepto: element.m_sConcepto,
                                    tipoCalculo: element.m_nIdTipoCalculo
                                })
                            }
                        }
                        //Si el concepto es de entrega pasa directo a comparar el peso porque eso siempre se cobra
                        if (concepto.m_nIdConcepto == 1 ){
                            if (element.m_xnRangoMinimo < pesoTotal && element.m_xnRangoMaximo > pesoTotal ){
                                conceptosTemp.push({
                                    concepto: element,
                                    importe: element.m_cImporte,
                                    retiene: element.m_nIdImpuestoRetiene,
                                    traslada: element.m_nIdImpuestoTraslada,
                                    importeRet: element.m_cImporteRetiene,
                                    importeIVA: element.m_cImporteIva,
                                    rangoMinimo: element.m_xnRangoMinimo,
                                    rangoMaximo: element.m_xnRangoMaximo,
                                    nombreConcepto: element.m_sConcepto,
                                    tipoCalculo: element.m_nIdTipoCalculo
                                })
                            }
                        }
                        //Si el embarque implica envio a domicilio y el concepto es el de envio a domicilio se calcula el peso
                        if (concepto.m_nIdConcepto == 3 && !embarque.m_bEntregaEnSucursal){
                            if (element.m_xnRangoMinimo < pesoTotal && element.m_xnRangoMaximo > pesoTotal ){
                                conceptosTemp.push({
                                    concepto: element,
                                    importe: element.m_cImporte,
                                    retiene: element.m_nIdImpuestoRetiene,
                                    traslada: element.m_nIdImpuestoTraslada,
                                    importeRet: element.m_cImporteRetiene,
                                    importeIVA: element.m_cImporteIva,
                                    rangoMinimo: element.m_xnRangoMinimo,
                                    rangoMaximo: element.m_xnRangoMaximo,
                                    nombreConcepto: element.m_sConcepto,
                                    tipoCalculo: element.m_nIdTipoCalculo
                                })
                            }
                        }
                        console.log('Embarque es recoleccion: ', (embarque.m_bEsRecolecta == 1 || embarque.m_bEsRecolecta == true) && concepto.m_nIdConcepto == 1)
                        console.log('Embarque es entrega: ', concepto.m_nIdConcepto == 2)
                        console.log('Embarque es envio a domicilio', concepto.m_nIdConcepto == 3 && !embarque.m_bEntregaEnSucursal)
                    }*/

                })
                ivaTraslada = getUniqueListBy(conceptosTemp, "traslada").map(i => i.traslada);
                ivaRetiene = getUniqueListBy(conceptosTemp, "retiene").map(i => i.retiene);
            }

            setState(state => {
                return {
                    ...state,
                    fecha: today.getDate() + "/" + (today.getMonth() + 1) + "/" + today.getFullYear() + " " + today.getHours() + ":" + today.getMinutes(),
                    conceptosAdicionales: conceptosTemp,
                    ivaRetiene: ivaRetiene,
                    ivaTraslada: ivaTraslada
                }
            })

        })
    }

    const [dataTodosConceptosByEmbarque, setDataTodosConceptosByEmbarque] = useState([])

    const obtenerConceptosByTarifa = (idTarifa) => {
        console.log('idtarifa: ', idTarifa)
        axios.get(`${process.env.REACT_APP_API_URL}/Tarifas/GetById/${idTarifa}`, { headers }).then(tarifa => {
            console.log(tarifa.data)
            setDataTodosConceptosByEmbarque(tarifa.data.m_arrArConceptos)

        })
    }

    const limpiarCamposAgregar = () => {
        setState(state => {
            return{
                ...state,
                //Informacion General
                idSucursalAgregar: localStorage.getItem("Sucursal"),
                folioGuia: "",
                idEmbarque: 0,
                folioInforme: "",
                tracking: "",
                fecha: "",
                idEstatusGuia: '',
                idMoneda: 0,
                tipoCambio: 0,
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
                idTipoServicio: '',
                ValorDeclarado: "",
                //Conceptos de facturacion
                conceptosAdicionales: [],
                ivaTraslada: [],
                ivaRetiene: [],
                //Aqui se almacenaran los conceptos de las guias que ya fueron creadas
                arClsGuiaConceptos: [],
            }
        })
    }

    async function getAllDataMoneda() {
        obtenerMonedas().then(respuesta => {
            setDataMoneda(respuesta.data)
        });
    };

    async function getAllDataTipoCobro() {
        obtenerTipoCobro().then(respuesta => {
            setDataTipoCobro(respuesta.data)
        });
    };

    async function getAllDataTipoServicio() {
        obtenerTipoServicio().then(respuesta => {
            setDataTipoServicio(respuesta.data)
        });
    };

    async function getAllDataEstatusGuia() {
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
        setState({
            ...state,
            idMoneda: idMoneda
        });

        if (state.idSucursalAgregar === "" || state.idSucursalAgregar === "0") return;
        if (idMoneda === "" || idMoneda === "0") return;

        obtenerEmbarqueMoneda(state.idSucursalAgregar, idMoneda, state.idGuia).then(respuesta => {
            setDataEmbarque(respuesta.data)
        });
    };

    const headers = {
        'Content-Type': 'application/json'
    }

    const handleImprimir = () => {
        imprimirFormatosId(state.formatoSeleccionado).then((response) => {
            var file = new Blob([response.data], { type: 'application/pdf' })
            var fileURL = URL.createObjectURL(file)
            console.log(fileURL)
            window.open(fileURL);
        })

    }

    function openSection(index) {
        closeSeccions()
        var $section;
        switch (index) {
            case 1:
                setStepActive(1);
                $section = $("#informacionGeneral")
                break;
            case 2:
                setStepActive(2);
                $section = $("#remitenteDestinatario")

                break;
            case 3:
                setStepActive(3);
                $section = $("#paquetesSobres")

                break;

            case 4:
                setStepActive(4);
                $section = $("#detalleFacturacion")

                break;

            case 5:
                setStepActive(5);
                $section = $("#conceptosFacturacion")

                break;
            case 6:
                setStepActive(6);
                $section = $("#general")
                break;
            default:
        }

        $('html, body').animate({
            scrollTop: parseInt($section.offset().top - 150)
        }, 200);

    }
    //objeto de paquetes
    const framesPaquete = state.paquetes.map((p, index) => {
        return (
            <div key={`paquete${index}`}>
                <div className="col-sm-4 col-md-1-5 unit">
                    <div className="input">
                        <TextField variant="outlined" margin="dense"
                            onChange={(event) => handleChangePaquete(event, index)}
                            className="form-control"
                            type="text"
                            label="Peso"
                            value={state.paquetes[index].peso}
                            placeholder="Peso"
                            name="peso"
                            disabled={true}
                        />
                    </div>
                </div>

                <div className="col-sm-4 col-md-1-5 unit">
                    <div className="input">
                        <TextField variant="outlined" margin="dense"
                            label="Largo"
                            onChange={(event) => handleChangePaquete(event, index)}
                            className="form-control"
                            type="text"
                            value={state.paquetes[index].largo}
                            placeholder="Largo"
                            name="largo"
                            disabled={true}
                        />
                    </div>
                </div>

                <div className="col-sm-4 col-md-1-5 unit">
                    <div className="input">
                        <TextField variant="outlined" margin="dense"
                            onChange={(event) => handleChangePaquete(event, index)}
                            className="form-control"
                            type="text"
                            label="Ancho"
                            value={state.paquetes[index].ancho}
                            placeholder="Ancho"
                            name="ancho"
                            disabled={true}
                        />
                    </div>
                </div>

                <div className="col-sm-4 col-md-1-5 unit">
                    <div className="input">
                        <TextField variant="outlined" margin="dense"
                            onChange={(event) => handleChangePaquete(event, index)}
                            className="form-control"
                            type="text"
                            label="Alto"
                            value={state.paquetes[index].alto}
                            placeholder="Alto"
                            name="alto"
                            disabled={true}
                        />
                    </div>
                </div>

                <div className="col-sm-4 col-md-1-5 unit">
                    <div className="input">
                        <TextField variant="outlined" margin="dense"
                            onChange={(event) => handleChangePaquete(event, index)}
                            className="form-control"
                            type="text"
                            label="Volumen"
                            value={state.paquetes[index].volumen}
                            placeholder="Volumen"
                            name="volumen"
                            disabled={true}
                        />
                    </div>
                </div>

                <div className="col-sm-4 col-md-4-5 unit">
                    <div className="input">
                        <TextField variant="outlined" margin="dense"
                            onChange={(event) => handleChangePaquete(event, index)}
                            className="form-control"
                            type="text"
                            label="Tipo de Embalaje"
                            value={state.paquetes[index].tipoEmbalaje}
                            placeholder="Tipo de Embarje"
                            name="tipoEmbalaje"
                            disabled={true}
                        />
                    </div>
                </div>

                <div className="col-sm-4 col-md-3 unit">
                    <div className="input">
                        <TextField variant="outlined" margin="dense"
                            onChange={(event) => handleChangePaquete(event, index)}
                            className="form-control"
                            type="text"
                            label="Valor Declarado"
                            value={state.paquetes[index].valorDeclarado}
                            placeholder="Valor Declarado"
                            name="valorDeclarado"
                            disabled={true}
                        />
                    </div>
                </div>

                <div className="col-sm-4 col-md-7-5 unit">
                    <div className="input">
                        <TextField variant="outlined" margin="dense"
                            onChange={(event) => handleChangePaquete(event, index)}
                            className="form-control"
                            type="text"
                            label="Descripción"
                            value={state.paquetes[index].descripcionPaquete}
                            placeholder="Descripción"
                            name="descripcionPaquete"
                            disabled={true}
                        />
                    </div>
                </div>

                <div className="col-sm-4 col-md-1-5 unit">
                    <div className="input">
                        <TextField variant="outlined" margin="dense"
                            onChange={(event) => handleChangePaquete(event, index)}
                            className="form-control"
                            type="text"
                            label="Ctd"
                            value={state.paquetes[index].ctd}
                            placeholder="Ctd"
                            name="ctd"
                            disabled={true}
                        />
                    </div>
                </div>

                <div className="col-sm-4 col-md-12 unit">
                    <div className="input">
                        <TextField variant="outlined" margin="dense"
                            onChange={(event) => handleChangePaquete(event, index)}
                            className="form-control"
                            type="text"
                            label="Observaciones"
                            value={state.paquetes[index].observacionesPaquete}
                            placeholder="Observaciones"
                            name="observacionesPaquete"
                            disabled={true}
                        />
                    </div>
                </div>


            </div>
        );
    });

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
                    </div>	<div className="widget-container">
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

    const framesSobres = state.sobres.map((p, index) => {
        return (
            <div key={`sobre${index}`}>
                <div className="col-sm-12 col-md-12 unit">
                    <div className="input">
                        <TextField variant="outlined" margin="dense"
                            className="form-control"
                            label="Descripcion"
                            onChange={event => (handleChangeSobre(event, index))}
                            id="descripcionSobre"
                            name="descripcionSobre"
                            read="true"
                            disabled={true}
                            value={state.sobres[index].descripcionSobre}
                        />
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

    function a11yProps(index) {
        return {
            id: `simple-tab-${index}`,
            'aria-controls': `simple-tabpanel-${index}`,
        };
    }

    function handleTabChange(event, newValue) {
        setState({ ...state, tab: newValue });
    }

    return (
        <div >
            <Dialog
                open={state.openDialog}
                onClose={() => setState({ ...state, openDialog: false })}
                fullWidth maxWidth="md"
            >
                <DialogContent>
                    {state.tipoModal === 6 &&
                        <div className="row" style={{ backgroundColor: '#FFFFFF' }}>
                            <DialogTitle style={{ padding: "0px" }}><h4>Selecciona el Formato</h4></DialogTitle>
                            <div>
                                <label className="input select" style={{ width: "100%" }}>
                                    <FormControl fullWidth variant="outlined" margin="dense">
                                        <InputLabel id="sucursalListadoLabel">Formato</InputLabel>
                                        <Select
                                            labelId="sucursalListadoLabel"
                                            label="Formato"
                                            className="form-control"
                                            required
                                            value={state.formatoSeleccionado}
                                            onChange={(event) => setState({ ...state, formatoSeleccionado: event.target.value })}
                                            id="formatoSeleccionado"
                                            name="formatoSeleccionado"
                                        >
                                            {dataFormatos.map((formato) => (
                                                <option
                                                    key={formato.m_nIdFormato}
                                                    value={formato.m_nIdFormato}
                                                >
                                                    {formato.m_sFormato}
                                                </option>
                                            ))}
                                        </Select>
                                    </FormControl>
                                    <i></i>
                                </label>
                            </div>

                            <DialogActions style={{ justifyContent: "left" }}>

                                <button onClick={() => handleImprimir()} className="btn btn-primary primary-btn">Aceptar
                                </button>
                                <button onClick={() => setState({ ...state, openDialog: false })}
                                    className="btn btn-secondary secondary-btn">Cerrar
                                </button>

                            </DialogActions>
                        </div>
                    }
                </DialogContent>
            </Dialog>

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
                <BarraLateralIzquierda />
            </aside>
            {/*Leftbar End Here*/}

            {/*Page Container Start Here*/}
            <section className="main-container">

                <div className="container-fluid">
                    {/*tabs de pantalla*/}
                    <ul className="nav navStatica nav-tabs">
                        <li className={props.location.idEmbarque != undefined ? "" : "active"}>
                            <a data-toggle="tab" href="#Listado" onClick={() => handleShowListado()}>
                                <i className="fa fa-list" /> Listado
                            </a>
                        </li>
                        <li className={props.location.idEmbarque != undefined ? "active" : ""}>
                            <a data-toggle="tab" href="#Agregar" onClick={() => handleShowAgregar()}>
                                <i className="fa fa-plus-circle" /> {state.agregar}
                            </a>
                        </li>
                        <li>
                            <a onClick={(event) => {
                                event.stopPropagation();
                                setState({
                                    ...state,
                                    identificadorModal:
                                        "imprimir",
                                    tipoModal: 6,
                                    openDialog: true
                                });
                            }}>
                                <i className="fa fa-print" /> Imprimir
                            </a>
                        </li>

                        <li className="hide">
                            <a data-toggle="tab" href="#Importar">
                                <i className="fa fa-upload" /> Importar
                            </a>
                        </li>
                        <li>
                            <a data-toggle="tab" href="#Cancelar" onClick={handleShowCancelar} className={state.idGuia == 0 ? classes.disabled : ""}>
                                <i className="fa fa-times-circle" /> Cancelar
                            </a>
                        </li>
                        {/*<li>*/}
                        {/*    <ExportCSV csvData={data} fileName="Guia_Listado" />*/}
                        {/*</li>*/}
                        {/*<li>*/}
                        {/*    <ExportPDF data={data} column={columns} fileName="Guia" />*/}
                        {/*</li>*/}
                    </ul>

                    <div className="row" className="tab-content">
                        <div id="Listado" className={props.location.idEmbarque != undefined ? "tab-pane fade" : "tab-pane fade in active"}>
                            <div className="widget-wrap">
                                <div className="widget-content">
                                    <form className="j-forms">
                                        <div className="row " style={{ display: "flex" }}>
                                            <div className="col-sm-6 col-md-3 unit" style={{ paddingLeft: "0px" }}>
                                                <div className="input">
                                                    <TextField
                                                        autoFocus
                                                        type="date"
                                                        margin="dense"
                                                        label="Fecha Inicial"
                                                        variant="outlined"
                                                        className="form-control"
                                                        InputLabelProps={{
                                                            shrink: true,
                                                        }}
                                                        value={state.fechaInicial}
                                                        onChange={handleFechaInicialFiltro}
                                                        id="fechaInicial"
                                                    />
                                                </div>
                                            </div>

                                            <div className="col-sm-6 col-md-3 unit" style={{ paddingLeft: "0px" }}>
                                                <div className="input">
                                                    <TextField variant="outlined" margin="dense"
                                                        type="date"
                                                        className="form-control"
                                                        label="Fecha Final"
                                                        InputLabelProps={{
                                                            shrink: true,
                                                        }}
                                                        value={state.fechaFinal}
                                                        onChange={handleFechaFinalFiltro}
                                                        id="fechaFinal"
                                                    />
                                                </div>

                                            </div>

                                            <div className="col-sm-6 col-md-3 unit" style={{ paddingLeft: "0px" }}>
                                                <label className="input select">
                                                    <FormControl fullWidth variant="outlined" margin="dense">
                                                        <InputLabel id="sucursalListadoLabel">Sucursal</InputLabel>
                                                        <Select
                                                            labelId="sucursalListadoLabel"
                                                            label="Sucursal"
                                                            className="form-control"
                                                            required
                                                            label="Sucursal"
                                                            value={state.sucursalListado}
                                                            onChange={handleSucursalFiltro}
                                                            id="sucursalListado"
                                                            InputLabelProps={{
                                                                shrink: true,
                                                            }}>
                                                            <option value="0">Todas</option>
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


                                            </div>

                                            <div className="col-sm-6 col-md-3 unit" style={{ paddingLeft: "0px" }}>
                                                <label className="input select">
                                                    <FormControl fullWidth variant="outlined" margin="dense">
                                                        <InputLabel id="estatusListadoLabel">Estatus</InputLabel>
                                                        <Select
                                                            native
                                                            labelId="estatusListadoLabel"
                                                            className="form-control"
                                                            required
                                                            label="Estatus"
                                                            value={state.estatusListado}
                                                            onChange={handleEstatusFiltro}
                                                            id="estatusListado"
                                                        >
                                                            <option value="0">Todos</option>
                                                            {dataEstatusGuia.map((estatus) => (
                                                                <option
                                                                    key={estatus.m_nIdEstatusGuia}
                                                                    value={estatus.m_nIdEstatusGuia}
                                                                >
                                                                    {estatus.m_sEstatus}
                                                                </option>
                                                            ))}
                                                        </Select>
                                                    </FormControl>
                                                </label>
                                            </div>
                                        </div>
                                    </form>

                                    <div className="row" style={{ height: state.height - 250, width: '100%' }}>
                                        {data.length != 0 ? (
                                            <DataGrid
                                                localeText={dataGridLocaleText}
                                                rows={data}
                                                columns={columns}
                                                density="compact"
                                                pageSize={Math.floor((state.height - 310) / 30)}
                                                getRowId={(row) => row.m_nIdGuia}
                                                onRowSelected={(row) => {
                                                    setState({
                                                        ...state,
                                                        idGuia: row.data.m_nIdGuia
                                                    })
                                                }}
                                            />
                                        ) : (
                                            <div>No se encontró ningún registro</div>
                                        )}
                                    </div>

                                </div>
                            </div>
                        </div>
                        <div id="Agregar" className={props.location.idEmbarque != undefined ? "tab-pane fade in active" : "tab-pane fade"}>
                            <form className="j-forms" onSubmit={handleAceptar}>
                                <div className="form-content">

                                    <div
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
                                                        <Step key={s} completed={false} onClick={() => openSection(index + 1)}>
                                                            <StepLabel >{s}</StepLabel>
                                                        </Step>
                                                    ))
                                                }
                                            </Stepper>
                                        </div>
                                    </div>

                                    <div className="widget-wrap" id="informacionGeneral">
                                        <div className="widget-header">
                                            <h2>Información General</h2>
                                        </div>


                                        <div className="widget-container">
                                            <div className="widget-content">
                                                <div className="row">
                                                    <div className="col-md-12">

                                                        <div className="col-sm-4 col-md-2-5 unit">
                                                            <label className="input select">
                                                                <FormControl fullWidth variant="outlined" margin="dense">
                                                                    <InputLabel id="idSucursalAgregarLabel">Sucursal</InputLabel>
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
                                                        </div>
                                                        <div className="col-sm-4 col-md-2-5 unit">

                                                            <div className="input">
                                                                <TextField variant="outlined" margin="dense"
                                                                    onChange={handleChange}
                                                                    className="form-control"
                                                                    type="text"
                                                                    label="Folio Guia"
                                                                    placeholder={state.folioGuia}
                                                                    readOnly={state.agregar == "Consultar"}
                                                                    id="folioGuia"
                                                                    name="folioGuia"
                                                                    disabled="disabled"
                                                                />
                                                            </div>
                                                        </div>
                                                        <div className="col-sm-4 col-md-2-5 unit">
                                                            <label className="label">
                                                                <FormControl fullWidth variant="outlined" margin="dense">
                                                                    <InputLabel id="idEmbarqueLabel">Folio Embarque</InputLabel>
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
                                                                        disabled={state.agregar == "Consultar"}

                                                                    >
                                                                        <option value="0">
                                                                            Seleccionar
                                                                        </option>
                                                                        {dataEmbarque.map(
                                                                            (embarque) => (
                                                                                <option key={embarque.m_nIdEmbarque} value={embarque.m_nIdEmbarque} >
                                                                                    {
                                                                                        embarque.m_nFolioEmbarque
                                                                                    }
                                                                                </option>
                                                                            )
                                                                        )}
                                                                    </Select>
                                                                </FormControl>
                                                            </label>
                                                        </div>
                                                        <div className="col-sm-4 col-md-2-5 unit">

                                                            <div className="input">
                                                                <TextField variant="outlined" margin="dense"
                                                                    onChange={handleChange}
                                                                    className="form-control"
                                                                    type="text"
                                                                    label="Folio Informe"
                                                                    placeholder={state.folioInforme}
                                                                    readOnly={state.agregar == "Consultar"}
                                                                    id="folioInforme"
                                                                    name="folioInforme"
                                                                    disabled="disabled"
                                                                />
                                                            </div>
                                                        </div>
                                                        <div className="col-sm-4 col-md-2-5 unit">

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
                                                                />
                                                            </div>
                                                        </div>

                                                        <div className="col-sm-4 col-md-2-5 unit">

                                                            <div className="input">
                                                                <TextField variant="outlined" margin="dense"
                                                                    onChange={handleChange}
                                                                    className="form-control"
                                                                    type="text"
                                                                    InputLabelProps={{
                                                                        shrink: true,
                                                                    }}
                                                                    label="Fecha / Hora"
                                                                    placeholder={state.fecha}
                                                                    readOnly={state.agregar == "Consultar"}
                                                                    id="fecha"
                                                                    name="fecha"
                                                                    disabled="disabled"
                                                                />
                                                            </div>
                                                        </div>
                                                        <div className="col-sm-4 col-md-2-5 unit">
                                                            <label className="input select">
                                                                <FormControl fullWidth variant="outlined" margin="dense">
                                                                    <InputLabel id="idEstatusGuiaLabel"> Estatus de la Guia</InputLabel>
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
                                                                        disabled={state.agregar == "Consultar"}
                                                                        InputLabelProps={{
                                                                            shrink: true,
                                                                        }}
                                                                    >
                                                                        <option value=""></option>
                                                                        {dataEstatusGuia.map(
                                                                            (estatusGuia) => (
                                                                                <option key={estatusGuia.m_nIdEstatusGuia} value={estatusGuia.m_nIdEstatusGuia} >
                                                                                    {
                                                                                        estatusGuia.m_sEstatus
                                                                                    }
                                                                                </option>
                                                                            )
                                                                        )}
                                                                    </Select>
                                                                </FormControl>
                                                            </label>
                                                        </div>

                                                        <div className="col-sm-4 col-md-2-5 unit">

                                                            <label className="input select">
                                                                <FormControl fullWidth variant="outlined" margin="dense">
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
                                                                        disabled={state.agregar == "Consultar"}
                                                                        // disabled
                                                                    >
                                                                        <option value="0">
                                                                            Seleccionar
                                                                        </option>
                                                                        {dataMoneda.map(
                                                                            (moneda) => (
                                                                                <option key={moneda.m_nIdMoneda} value={moneda.m_nIdMoneda}>
                                                                                    {
                                                                                        moneda.m_sMoneda
                                                                                    }
                                                                                </option>
                                                                            )
                                                                        )}
                                                                    </Select>
                                                                </FormControl>
                                                            </label>
                                                        </div>

                                                        <div className="col-sm-4 col-md-2-5 unit">

                                                            <label className="input select">
                                                                <FormControl fullWidth variant="outlined" margin="dense">
                                                                    <InputLabel id="tipoCambioLabel">Tipo de Cambio</InputLabel>
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
                                                                                {cambio.m_cTipoCambio}
                                                                            </option>
                                                                        ))}
                                                                    </Select>
                                                                </FormControl>
                                                                <i className="fa fa-arrow-down" />
                                                            </label>
                                                        </div>

                                                    </div>
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
                                                                                <TextField variant="outlined" margin="dense"
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
                                                                                <TextField variant="outlined" margin="dense"
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
                                                                                <TextField variant="outlined" margin="dense"
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
                                                                                <TextField variant="outlined" margin="dense"
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
                                                                                <TextField variant="outlined" margin="dense"
                                                                                    onChange={handleChange}
                                                                                    className="form-control"
                                                                                    type="text"
                                                                                    InputLabelProps={{
                                                                                        shrink: true,
                                                                                    }}
                                                                                    label="Ciudad"
                                                                                    value={state.ciudadRemitente}
                                                                                    readOnly={state.agregar == "Consultar"}
                                                                                    id="ciudadRemitente"
                                                                                    name="ciudadRemitente"
                                                                                    disabled="disabled"
                                                                                />

                                                                            </div>
                                                                        </div>

                                                                        <div className="col-md-4 unit">

                                                                            <div className="input">
                                                                                <TextField variant="outlined" margin="dense"
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
                                                                                <TextField variant="outlined" margin="dense"
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
                                                                                <TextField variant="outlined" margin="dense"
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

                                                                        <div className="col-md-4 unit">

                                                                            <div className="input">
                                                                                <TextField variant="outlined" margin="dense"
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
                                                                                <TextField variant="outlined" margin="dense"

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
                                                                                <TextField variant="outlined" margin="dense"
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
                                                                                <TextField variant="outlined" margin="dense"
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
                                                                                <TextField variant="outlined" margin="dense"
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
                                                                                <TextField variant="outlined" margin="dense"
                                                                                    className="form-control"
                                                                                    type="text"
                                                                                    InputLabelProps={{
                                                                                        shrink: true,
                                                                                    }}
                                                                                    label="Ciudad"
                                                                                    value={state.ciudadDestinatario}
                                                                                    readOnly={state.agregar == "Consultar"}
                                                                                    id="ciudadDestinatario"
                                                                                    disabled="disabled"
                                                                                />
                                                                            </div>
                                                                        </div>

                                                                        <div className="col-md-4 unit">

                                                                            <div className="input">
                                                                                <TextField variant="outlined" margin="dense"
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
                                                                                <TextField variant="outlined" margin="dense"
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
                                                                                <TextField variant="outlined" margin="dense"
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

                                                                        <div className="col-md-4 unit">

                                                                            <div className="input">
                                                                                <TextField variant="outlined" margin="dense"
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


                                    <div className="row" id="paquetesSobres">
                                        <div className="row">

                                        </div>
                                        <div className="row">
                                            <div className="col-md-6"  >
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
                                                                        </div>
                                                                    </form>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="col-md-6"  >
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
                                            </div>
                                        </div>
                                    </div>
                                    <div className="widget-wrap" id="detalleFacturacion">
                                        <div className="widget-header">

                                            <div className="col-md-12">
                                                <h2>Detalle de Facturación</h2>
                                            </div>

                                        </div>
                                        <div className="row">
                                            <div className="col-md-12"  >
                                                <div className="widget-container">
                                                    <div className="widget-content">
                                                        <div className="row">
                                                            <div className="col-md-12">
                                                                {/*<form className="j-forms">*/}
                                                                    <div className="form-content">
                                                                        <div className="col-sm-4 col-md-2-5 unit">

                                                                            <label className="input select">
                                                                                <FormControl fullWidth variant="outlined" margin="dense">
                                                                                    <InputLabel id="idTipoCobroLabel">Tipo Cobro</InputLabel>
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
                                                                                                <option key={tipoCobro.m_nIdTipoCobro} value={tipoCobro.m_nIdTipoCobro}>
                                                                                                    {
                                                                                                        tipoCobro.m_sDescripcion
                                                                                                    }
                                                                                                </option>
                                                                                            )
                                                                                        )}
                                                                                    </Select>
                                                                                </FormControl>
                                                                            </label>
                                                                        </div>
                                                                        <div className="col-sm-4 col-md-2-5">

                                                                            <label className="input select">
                                                                                <FormControl fullWidth variant="outlined" margin="dense">
                                                                                    <InputLabel id="idTipoServicioLabel">Tipo Servicio</InputLabel>
                                                                                    <Select
                                                                                        native
                                                                                        labelId="idTipoServicioLabel"
                                                                                        label="Tipo Servicio"
                                                                                        className="form-control"
                                                                                        required
                                                                                        onChange={handleChange}
                                                                                        disabled={state.agregar == "Consultar"}
                                                                                        id="idTipoServicio"
                                                                                        name="idTipoServicio"
                                                                                        read="true"
                                                                                        value={state.idTipoServicio}
                                                                                        InputLabelProps={{
                                                                                            shrink: true,
                                                                                        }}
                                                                                    >
                                                                                        <option value=""></option>
                                                                                        {dataTipoServicio.map(
                                                                                            (tipoServicio) => (
                                                                                                <option key={tipoServicio.m_nIdTipoServicio} value={tipoServicio.m_nIdTipoServicio}>
                                                                                                    {
                                                                                                        tipoServicio.m_sDescripcion
                                                                                                    }
                                                                                                </option>
                                                                                            )
                                                                                        )}
                                                                                    </Select>
                                                                                </FormControl>
                                                                            </label>
                                                                        </div>
                                                                        <div className="col-sm-4 col-md-2-5">

                                                                            <div className="input">
                                                                                <TextField variant="outlined" margin="dense"
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
                                                                                           startAdornment={<InputAdornment position="start">$</InputAdornment>}
                                                                                />
                                                                            </div>
                                                                        </div>


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
                                                        <form className="j-forms">
                                                            {
                                                                state.idEmbarque &&
                                                                <div>
                                                                    <Tabs value={state.tab} onChange={handleTabChange} aria-label="simple tabs example" variant="scrollable" scrollButtons="auto">
                                                                        <Tab label="Concetos Adicionales por Destino" {...a11yProps(0)} className={{ backgroundColor: "white !important" }} />
                                                                    </Tabs>
                                                                    <ConceptosAdicionales guias={true}
                                                                                          conceptosAdicionales={state.conceptosAdicionales}
                                                                                          addConcepto={addConcepto}
                                                                                          removeConcepto={removeConcepto}
                                                                                          ivaRetiene={state.ivaRetiene}
                                                                                          ivaTraslada={state.ivaTraslada}
                                                                                          noMostrarRangos={false}
                                                                                          customConceptos={true}
                                                                                          listadoConceptosAlternativos={dataTodosConceptosByEmbarque}/>
                                                                </div>

                                                            }

                                                        </form>
                                                    </div>

                                                    <div className="form-footer" className="col-md-12">

                                                        {/*<button
                                                            href="#Listado"
                                                            role="tab"
                                                            data-toggle="tab"
                                                            className="btn btn-secondary secondary-btn"
                                                        >
                                                            Cancelar
                                                        </button>*/}
                                                        <button type="submit" className="btn btn-primary primary-btn" disabled={state.agregar == "Consultar"}>
                                                            Aceptar
                                                        </button>
                                                    </div>

                                                </div>




                                            </div></div>

                                    </div>

                                </div>
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
                                                <div className="form-footer" className="col-md-12">
                                                    <button className="btn btn-default btn-block ex-noty" data-layout="topCenter" data-type="information">Notificación</button>
                                                    <button href="#Listado" role="tab" data-toggle="tab" data-layout="topCenter" data-type="information" className="btn btn-secondary secondary-btn"
                                                    >
                                                        Cancelar</button>
                                                </div>
                                            </form>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div id="Imprimir" className="tab-pane fade">
                            <div style={{ padding: "20px" }} className="widget-wrap">
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
                                                                name="MotivoCancelacion"
                                                            />
                                                        </div>
                                                    </div>

                                                    <div className="form-footer" className="col-md-12">
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

                    </div>
                </div>

            </section>
            {/*Page Container End Here*/}

            {/*Rightbar Start Here*/}
            <aside className="rightbar">
                <BarraLateralDerecha />
            </aside>

        </div>

    );
}

function TabPanel(props) {
    const { children, value, index, ...other } = props;

    return (
        <div
            role="tabpanel"
            hidden={value !== index}
            id={`simple-tabpanel-${index}`}
            aria-labelledby={`simple-tab-${index}`}
            {...other}
        >
            {value === index && (
                <Box p={1}>
                    {children}
                </Box>
            )}
        </div>
    );
}

export default Guia;