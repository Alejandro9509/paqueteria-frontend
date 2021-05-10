import React, { useEffect, useState, useMemo } from "react";
import axios from "axios";
import Cabecera from "../Components/Template/Cabecera";

import BarraLateralIzquierda from "../Components/Template/BarraLateralIzquierda";
import BarraLateralDerecha from "../Components/Template/BarraLateralDerecha";
import ExportCSV from '../Components/Template/Export';
import ExportPDF from "../Components/Template/ExportPDF";
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
import { FormControl, InputLabel, Select, Step, StepLabel, Stepper, TextField, Tooltip } from "@material-ui/core";
import { dataGridLocaleText } from "../Constants";

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
        position: "initial !important"
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
    var today = new Date();
    var React = require('react');
    var QRCode = require('qrcode.react');
    const classes = useStyles();
    localStorage.getItem("UsuarioId");

    const [data, setData] = React.useState([])
    const [dataTipoCambio, setDataTipoCambio] = React.useState([]);
    const [conceptos, setConceptos] = React.useState([]);
    const [state, setState] = React.useState({
        showPopUp: false,
        idGuia: 0,
        agregar: "Agregar",
        fechaInicial: "",
        conceptosAdicionales: [],
        ivaTraslada: [],
        ivaRetiene: [],
        fechaFinal: today.getFullYear() + "-" + (today.getMonth() + 1) + "-" + today.getDate(),
        sucursalListado: 0,
        estatusListado: 0,
        sucursal: "",
        folioRecoleccion: "",
        folioEmbarque: "",
        folioGuía: "",
        folioInforme: "",
        fecha: "",
        DerechoBorrar: 145,
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
        origen: "",
        destino: "",
        usuarioCancela: "",
        fechaCancelado: "",
        idGuia: 0,
        idEmbarque: 0,
        idEmbarque2: 0,
        hora: "",
        idEstatusGuia: 0,
        estatusGuia: "",
        idMoneda: 0,
        tipoCambio: 0,
        idTipoCobro: 0,
        nombreRemitente: "",
        rfcRemitente: "",
        domicilioRemitente: "",
        idCodigoPostalRemitente: 0,
        ciudadRemitente: 0,
        correoRemitente: "",
        telefonoRemitente: "",
        contactoRemitente: "",
        idCiudadOrigen: 0,
        sNombreDestinatario: "",
        sRFCDestinatario: "",
        sDomicilioDestinatario: "",
        idCodigoPostalDestinatario: "",
        sCorreoDestinatario: "",
        idCIudadDestinatario: 0,
        sTelefonoDestinatario: "",
        sContactoDestinatario: "",
        idCiudadDestino: 0,
        fechaEntrega: "",
        HoraEntrega: "",
        NoPaquetes: 0,
        NoSobres: 0,
        idOperador: 0,
        idCiudadRemitente: 0,
        idUnidad: 0,
        fechaSalida: "",
        horaSalida: "",
        arrClsDetalle: [],
        FechaCancelacion: "",
        usuarioCancelacion: 0,
        MotivoCancelacion: "",
        entregarMismoDomicilio: false,
        fechaLlegada: "",
        horaLlegada: "",
        codigoPostalEntrega: 0,
        idCiudadEntrega: 0,
        idZonaEntrega: 0,
        domicilioEntrega: "",
        entregarEn: "",
        datosAdicionalesis: "",
        tracking: 0,
        arClsGuiaConceptos: [],
        creadoPor: localStorage.getItem("UsuarioId"),
        modificadoPor: localStorage.getItem("UsuarioId"),
        creadoEl: "",
        modificadoEl: "",
        idSucursal: localStorage.getItem("Sucursal"),
        idSucursalAgregar: localStorage.getItem("Sucursal"),
        valorDeclarado: 0,
        CiudadDestino: "",
        paquetes: [
            {
                peso: "",
                largo: "",
                ancho: "",
                alto: "",
                volumen: "",
                peso: "",
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
        conceptos: [
            {
                IdConceptoFacturacion: 0,
                Importe: 0,
                IdImpuestoTraslada: 0,
                ImporteIva: 0,
                IdImpuestoRetiene: 0,
                ImporteRetiene: 0,
                Total: 0,
                PorcentajeIva: 0,
                PorcentajeRetiene: 0,
                IdGuiaConcepto: 0
            }
        ],
        height: window.innerHeight
    })

    function cargaDiv(indice, valor) {
        //	showSuccess(indice);
        $("#idBarra" + indice).barcode(valor, "code128");
    }
    const [dataFolioGuia, SetDataFolioGuia] = React.useState([]);

    const [fileUploaded, setFileUploaded] = React.useState([])
    const [stepActive, setStepActive] = React.useState(1);
    const [dataSucursal, setDataSucursal] = React.useState([])
    const [stateSucursal, setStateSucursal] = React.useState({
        idSucursal: 0,
        Sucursal: ""
    })

    const [dataMoneda, setDataMoneda] = React.useState([])
    const [stateMoneda, setStateMoneda] = React.useState({
        idMoneda: 0,
        Moneda: ""
    })
    const [dataTipoCobro, setDataTipoCobro] = React.useState([])
    const [stateTipoCobro, setStateTipoCobro] = React.useState({
        idTipoCobro: 0,
        Descripcion: ""
    })
    const [dataEstatusGuia, setDataEstatusGuia] = React.useState([])
    const [stateEstatusGuia, setStateEstatusGuia] = React.useState({
        idEstatusGuia: 0,
        Estatus: "",
        Color: ""
    })
    const [dataEmbarque, setDataEmbarque] = React.useState([])
    const [stateEmbarque, setStateEmbarque] = React.useState({
        FolioEmbarque: "",
        idEmbarque: 0
    })
    const [dataConcepto, setDataConcepto] = React.useState([])
    const [stateConcepto, setStateConcepto] = React.useState({
        IdConceptoFacturacion: 0,
        Concepto: "",
    })
    const [dataImpuestoTraslado, setDataImpuestoTraslado] = React.useState([])
    const [stateImpuestoTraslado, setStateImpuestoTraslado] = React.useState({
        IdImpuesto: 0,
        Impuesto: "",
        Porcentaje: 0
    })
    const [dataImpuestoRetiene, setDataImpuestoRetiene] = React.useState([])
    const [stateImpuestoRetiene, setStateImpuestoRetiene] = React.useState({
        IdImpuesto: 0,
        Impuesto: "",
        Porcentaje: 0
    })

    const [dataCiudad, setDataCiudad] = React.useState([])
    const [stateCiudad, setStateCiudad] = React.useState({
        IdCiudad: 0,
        Ciudad: ""
    })

    const [dataTipoServicio, setDataTipoServicio] = React.useState([])
    const [stateTipoServicio, setStateTipoServicio] = React.useState({
        idTipoServicio: 0,
        Descripcion: ""
    })

    const handleAceptar = (e) => {
        e.preventDefault()
        var params = {

            "IdSucursal": state.idSucursal,
            "FolioGuía": state.folioGuia,
            "Fecha": state.fecha,
            "IdEstatusGuia": state.idEstatusGuia,
            "idEmbarque": state.idEmbarque,
            "idEmbarque2": state.idEmbarque2,
            "IdOrigen": state.origen,
            "destino": state.destino,
            "UsuarioCancela": state.usuarioCancela,
            "FechaCancelado": state.fechaCancelado,
            "Hora": state.hora,
            "IdMoneda": state.idMoneda,
            "TipoCambio": state.tipoCambio,
            "IdTipoCobro": state.idTipoCobro,
            "NombreRemitente": state.nombreRemitente,
            "RfcRemitente": state.rfcRemitente,
            "DomicilioRemitente": state.domicilioRemitente,
            "IdCodigoPostalRemitente": state.idCodigoPostalRemitente,
            "ciudadRemitente": state.ciudadRemitente,
            "CorreoRemitente": state.correoRemitente,
            "TelefonoRemitente": state.telefonoRemitente,
            "ContactoRemitente": state.contactoRemitente,
            "IdCiudadOrigen": state.idCiudadOrigen,
            "SNombreDestinatario": state.sNombreDestinatario,
            "SRFCDestinatario": state.sRFCDestinatario,
            "SDomicilioDestinatario": state.sDomicilioDestinatario,
            "IdCodigoPostalDestinatario": state.idCodigoPostalDestinatario,
            "SCorreoDestinatario": state.sCorreoDestinatario,
            "IdCIudadDestinatario": state.idCIudadDestinatario,
            "STelefonoDestinatario": state.sTelefonoDestinatario,
            "SContactoDestinatario": state.sContactoDestinatario,
            "IdCiudadDestino": state.idCiudadDestino,
            "FechaEntrega": state.fechaEntrega,
            "HoraEntrega": state.HoraEntrega,
            "NoPaquetes": state.NoPaquetes,
            "NoSobres": state.NoSobres,
            "IdOperador": state.idOperador,
            "IdUnidad": state.idUnidad,
            "FechaSalida": state.fechaSalida,
            "HoraSalida": state.horaSalida,
            "arrClsDetalle": [],
            "FechaCancelacion": state.FechaCancelacion,
            "UsuarioCancelacion": state.usuarioCancelacion,
            "MotivoCancelacion": state.MotivoCancelacion,
            "EntregarMismoDomicilio": state.entregarMismoDomicilio,
            "FechaLlegada": state.fechaLlegada,
            "HoraLlegada": state.horaLlegada,
            "CodigoPostalEntrega": state.codigoPostalEntrega,
            "IdCiudadEntrega": state.idCiudadEntrega,
            "IdZonaEntrega": state.idZonaEntrega,
            "DomicilioEntrega": state.domicilioEntrega,
            "EntregarEn": state.entregarEn,
            "DatosAdicionalesis": state.datosAdicionalesis,
            "Tracking": state.tracking,
            "arClsGuiaConceptos": state.conceptos,
            "CreadoPor": state.creadoPor,
            "ModificadoPor": state.modificadoPor,
            "CreadoEl": state.creadoEl,
            "ModificadoEl": state.modificadoEl,
            "Idguia": state.IdGuia,
            "ValorDeclarado": state.ValorDeclarado,
            "idTipoServicio": state.idTipoServicio,


        }
        if (state.idGuia != 0) {
            const url = `${process.env.REACT_APP_API_URL}/Guia/Modificar/` + state.idGuia;
            axios.put(url, Object.assign({}, params), { headers }).then(respuesta => {
                showSuccess(respuesta.data)
                getAllData()
            }).catch(err => {
                console.log(err)
                showSuccess(err)
            });
        } else {
            const url = `${process.env.REACT_APP_API_URL}/Guia/Agregar`;
            //debugger;
            axios.post(url, Object.assign({}, params), { headers }).then(respuesta => {
                showSuccess(respuesta.data)
                //window.location.reload();
                var resp = respuesta.data;
                //debugger;
                var vGuia = resp.substring(resp.indexOf(":") + 2);
                getImpresion(vGuia);
            }).catch(err => {
                console.log(err)
                showSuccess(err)
            });
        }

    }

    function getUltimoFolioGuia() {
        const url = `${process.env.REACT_APP_API_URL}/Guia/GetUltimoFolio`;
        axios.get(url, { headers }).then((respuesta) => { SetDataFolioGuia(respuesta.data); });
    }


    async function getImpresion(id) {
        //showSuccess (state.nGuiaId);		
        //if (state.muestraPaquetes === true) return;		
        const url = `${process.env.REACT_APP_API_URL}/Guia/GetImpresion/` + id;
        await axios.get(url, { headers }).then(respuesta => {
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
                    FolioPaquete: respuesta.data[i].m_sFolioPaquete,
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

    function getTipoCambio() {
        const url = `${process.env.REACT_APP_API_URL}/TipoCambio/GetListado`;
        axios.get(url, { headers }).then(respuesta => {
            setDataTipoCambio(respuesta.data)
        });
    };

    function handleEliminar(id) {
        var derecho;
        const urlDelete = `${process.env.REACT_APP_API_URL}/Utilerias/ValidaDerechos/${state.creadoPor}/${state.DerechoBorrar}/3`;
        axios.get(urlDelete, { headers }).then(respuesta => {
            //showSuccess(respuesta.data)

            derecho = respuesta.data;
            if (derecho == false) {
                showSuccess("El usuario no tiene derechos para realizar el proceso");
                return;
            }

            const url = `${process.env.REACT_APP_API_URL}/Guia/Eliminar/` + id;
            axios.delete(url, { headers }).then(respuesta => {
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
        //console.log(row.original.m_nIdGuia)
        //TODO
        //var valor2="";
        const url = `${process.env.REACT_APP_API_URL}/Guia/GetById/` + id;
        axios.get(url, { headers }).then(respuesta => {
            //console.log(respuesta.data)
            // debugger;
            cargaEmbarqueModificar(respuesta.data.IdSucursal, respuesta.data.m_nIdMoneda, id)
            handleEmbarqueModificar(respuesta)
            //valor2=respuesta.data.m_nIdEmbarque;
            //     debugger;
            setState({
                ...state,
                agregar: "Modificar",
                showPopUp: true,
                IdEmbarque: respuesta.data.m_nIdEmbarque,
                folioGuía: respuesta.data.m_sFolioGuia,
                folioRecoleccion: respuesta.data.m_nFolioRecoleccion,
                folioInforme: respuesta.data.m_sFolioInforme,
                idGuia: respuesta.data.m_nIdGuia,
                fecha: respuesta.data.m_dFecha,
                hora: respuesta.data.m_sHora,
                idEstatusGuia: respuesta.data.m_nIdEstatusGuia,
                valorDeclardao: respuesta.data.m_cValorDeclarado,
                idMoneda: respuesta.data.m_nIdMoneda,
                tipoCambio: respuesta.data.m_cTIpoCambio,
                idTipoCobro: respuesta.data.m_nIdTIpoCobro,
                arrClsDetalle: respuesta.data.m_arrClsDetalle,
                tracking: respuesta.data.m_nTracking,
                arClsGuiaConceptos: respuesta.data.m_arClsGuiaConceptos,
                creadoEl: respuesta.data.m_dCreadoEl,
                idSucursal: respuesta.data.IdSucursal

            });
            //handleEmbarque (respuesta.data.m_nIdEmbarque)
            // showSuccess(state.idMoneda)
        }).catch(function (err) {
            console.log(err.data)
        });
        // debugger;
        // handleEmbarqueModificar (valor2)      

    }

    function handleShowConsultar(id) {
        const url = `${process.env.REACT_APP_API_URL}/Guia/GetById/` + id;
        axios.get(url, { headers }).then(respuesta => {
            // debugger;
            cargaEmbarqueModificar(respuesta.data.IdSucursal, respuesta.data.m_nIdMoneda, id)
            handleEmbarqueModificar(respuesta)
            //valor2=respuesta.data.m_nIdEmbarque;
            //     debugger;
            setState({
                ...state,
                agregar: "Consultar",
                showPopUp: true,
                IdEmbarque: respuesta.data.m_nIdEmbarque,
                folioGuía: respuesta.data.m_nFolioGuia,
                folioRecoleccion: respuesta.data.m_nFolioRecoleccion,
                folioInforme: respuesta.data.m_nFolioInforme,
                idGuia: respuesta.data.m_nIdGuia,
                fecha: respuesta.data.m_dFecha,
                hora: respuesta.data.m_sHora,
                idEstatusGuia: respuesta.data.m_nIdEstatusGuia,
                valorDeclardao: respuesta.data.m_cValorDeclarado,
                idMoneda: respuesta.data.m_nIdMoneda,
                tipoCambio: respuesta.data.m_cTIpoCambio,
                idTipoCobro: respuesta.data.m_nIdTIpoCobro,
                arrClsDetalle: respuesta.data.m_arrClsDetalle,
                tracking: respuesta.data.m_nTracking,
                arClsGuiaConceptos: respuesta.data.m_arClsGuiaConceptos,
                creadoEl: respuesta.data.m_dCreadoEl,
                idSucursal: respuesta.data.IdSucursal

            });
            //handleEmbarque (respuesta.data.m_nIdEmbarque)
            // showSuccess(state.idMoneda)
        }).catch(function (err) {
            console.log(err.data)
        });
        // debugger;
        // handleEmbarqueModificar (valor2)      

    }

    function handleShowCancelar() {
        const url = `${process.env.REACT_APP_API_URL}/Guia/GetById/${state.idGuia}`;
        axios.get(url, { headers }).then((respuesta) => {
            setState({
                ...state,
                usuarioCancela: respuesta.data.m_nUsuarioCancelacion != 0 ? respuesta.data.m_nUsuarioCancelacion : localStorage.getItem("Usuario"),
                folioGuía: respuesta.data.m_nFolioGuia,
                sucursalCancelacion: respuesta.data.m_sSucursal,
                fechaCancelado: today.getDate() + "/" + (today.getMonth() + 1) + "/" + today.getFullYear(),
                estatusGuia: respuesta.data.m_sEstatusGuia,
                motivoCancelacion: respuesta.data.m_sMotivoCancelacion
            })
            if (respuesta.data.m_nFolioInforme != 0)
                showSuccess("Guía no se puede cancelar")
        })
    }

    const handleCancelar = (e) => {
        e.preventDefault();
        var params = {
            "motivoCancelacion": state.MotivoCancelacion,
            "usuarioCancelacion": localStorage.getItem("UsuarioId"),
            "fechaCancelacion": state.fechaCancelado
        }
        const url = `${process.env.REACT_APP_API_URL}/Guia/Cancelar/${state.idGuia}`;
        axios.put(url, Object.assign({}, params), { headers }).then((respuesta) => {
            console.log(respuesta.data)
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

    function handleShowImprimir() {
        //getImpresion(38);
    }

    function handleShowAgregar() {
        setState({
            ...state,
            agregar: "Agregar",
            showPopUp: true,

            sucursal: "",
            folioRecoleccion: "",
            folioEmbarque: "",
            folioGuía: dataFolioGuia.length !== 0 ? dataFolioGuia[0].m_sFolioGuia : null,
            folioInforme: "",
            fecha: today.getDate() + "/" + (today.getMonth() + 1) + "/" + today.getFullYear() + " " + today.getHours() + ":" + today.getMinutes(),
            origen: "",
            destino: "",
            usuarioCancela: "",
            fechaCancelado: "",
            idGuia: 0,
            hora: "",
            idEstatusGuia: 4,
            idMoneda: 0,
            tipoCambio: 0,
            idTipoCobro: 0,
            nombreRemitente: "",
            rfcRemitente: "",
            domicilioRemitente: "",
            idCodigoPostalRemitente: 0,
            ciudadRemitente: 0,
            correoRemitente: "",
            telefonoRemitente: "",
            contactoRemitente: "",
            idCiudadOrigen: 0,
            sNombreDestinatario: "",
            sRFCDestinatario: "",
            sDomicilioDestinatario: "",
            idCodigoPostalDestinatario: "",
            sCorreoDestinatario: "",
            idCIudadDestinatario: 0,
            sTelefonoDestinatario: "",
            sContactoDestinatario: "",
            idCiudadDestino: 0,
            fechaEntrega: "",
            HoraEntrega: "",
            NoPaquetes: 0,
            NoSobres: 0,
            idOperador: 0,
            idCiudadRemitente: 0,
            idUnidad: 0,
            fechaSalida: "",
            horaSalida: "",
            arrClsDetalle: [],
            FechaCancelacion: "",
            usuarioCancelacion: 0,
            entregarMismoDomicilio: false,
            fechaLlegada: "",
            horaLlegada: "",
            codigoPostalEntrega: 0,
            idCiudadEntrega: 0,
            idZonaEntrega: 0,
            domicilioEntrega: "",
            entregarEn: "",
            datosAdicionalesis: "",
            tracking: 0,
            arClsGuiaConceptos: [],
            creadoEl: today.getDate() + "/" + (today.getMonth() + 1) + "/" + today.getFullYear() + " " + today.getHours() + ":" + today.getMinutes(),
            modificadoEl: today.getDate() + "/" + (today.getMonth() + 1) + "/" + today.getFullYear() + " " + today.getHours() + ":" + today.getMinutes(),
        });
        //getImpresion(38);
    }

    const handleChange = event => {
        //console.log(event.target.id + " : " + event.target.value)
        setState({
            ...state,
            [event.target.id]: event.target.value
        });
    };

    const handleFechaInicialFiltro = async (event) => {
        setState({
            ...state,
            fechaInicial: event.target.value,
        })
        const url = `${process.env.REACT_APP_API_URL}/Guias/GetByFiltro/` +
            event.target.value + "/" + state.fechaFinal + "/" + state.sucursalListado + "/" + state.estatusListado;
        await axios.get(url, { headers }).then(respuesta => {
            setData(respuesta.data)
        })
        console.log(url)
    }

    const handleFechaFinalFiltro = async (event) => {
        setState({
            ...state,
            fechaFinal: event.target.value,
        })
        const url = `${process.env.REACT_APP_API_URL}/Guias/GetByFiltro/` +
            state.fechaInicial + "/" + event.target.value + "/" + state.sucursalListado + "/" + state.estatusListado;
        await axios.get(url, { headers }).then(respuesta => {
            setData(respuesta.data)
        })
        console.log(url)
    }

    const handleSucursalFiltro = async (event) => {
        setState({
            ...state,
            sucursalListado: event.target.value,
        })
        const url = `${process.env.REACT_APP_API_URL}/Guias/GetByFiltro/` +
            state.fechaInicial + "/" + state.fechaFinal + "/" + event.target.value + "/" + state.estatusListado;
        await axios.get(url, { headers }).then(respuesta => {
            setData(respuesta.data)
        })
        console.log(url)
    }

    const handleEstatusFiltro = async (event) => {
        setState({
            ...state,
            estatusListado: event.target.value,
        })
        const url = `${process.env.REACT_APP_API_URL}/Guias/GetByFiltro/` +
            state.fechaInicial + "/" + state.fechaFinal + "/" + state.sucursalListado + "/" + event.target.value;
        await axios.get(url, { headers }).then(respuesta => {
            setData(respuesta.data)
        })
        console.log(url)
    }

    function handleSelectRow(id, event) {
        setState({
            ...state,
            idGuia: id
        });
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

    const columns2 = React.useMemo(() => [
        {
            Name: "Fecha/Hora Elaboración",
            accessor: "m_sFechaHora",
        }, {
            Name: "Sucursal",
            accessor: "m_sSucursal",
        }, {
            Name: "Estatus Guia",
            accessor: "m_sEstatusGuia",
        }, {
            Name: "Origen",
            accessor: "m_sCiudadOrigen",
        }, {
            Name: "Destino",
            accessor: "m_sCiudadDestino",
        }, {
            Name: "Folio Guia",
            accessor: "m_nFolioGuia",
        }, {
            Name: "Folio Informe",
            accessor: "m_sFolioInforme",
        }, {
            Name: "Folio Embarque",
            accessor: "m_sFolioEmbarque",
        },
        {
            Name: "Fecha de Cancelacion",
            accessor: "m_dtFechaCancelacion"
        },
        {
            Name: "Usuario de Cancelacion",
            accessor: "m_nUsuarioCancelacion"
        }

    ]);

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
                            <a href="#Agregar" role="tab" data-toggle="tab" className="btn btn-default btn-xs" onClick={() => (handleShowModificar(row.row.m_nIdGuia))}><i className="fa fa-eye" style={{ color: "#F9A03E" }} /></a>

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
        if (props.location.idEmbarque != undefined) {
            const url = `${process.env.REACT_APP_API_URL}/Embarques/GetById/${props.location.idEmbarque}`;
            axios.get(url, { headers }).then(respuesta => {

                const paquetesTemp = [];
                const sobresTemp = [];
                console.log(respuesta.data.m_arrPaquetes);

                for (var i = 0; i < respuesta.data.m_arrPaquetes.length; i++) {

                    if (respuesta.data.m_arrPaquetes[i].m_nIdEmbarqueDetalle === "" || respuesta.data.m_arrPaquetes[i].m_nIdEmbarqueDetalle === "0")
                        continue;

                    paquetesTemp.push({
                        "peso": respuesta.data.m_arrPaquetes[i].m_xPeso,
                        "largo": respuesta.data.m_arrPaquetes[i].m_xLargo,
                        "ancho": respuesta.data.m_arrPaquetes[i].m_xAncho,
                        "alto": respuesta.data.m_arrPaquetes[i].m_xAlto,
                        "volumen": respuesta.data.m_arrPaquetes[i].m_xVolumen,
                        "peso": respuesta.data.m_arrPaquetes[i].m_xPeso,
                        "tipoEmbalaje": respuesta.data.m_arrPaquetes[i].m_nTipo,
                        "valorDeclarado": respuesta.data.m_arrPaquetes[i].m_cValorDeclarado,
                        "descripcionPaquete": respuesta.data.m_arrPaquetes[i].m_sDescripcion,
                        "observacionesPaquete": respuesta.data.m_arrPaquetes[i].m_sObservaciones,
                        "id": respuesta.data.m_arrPaquetes[i].m_nIdEmbarqueDetalle
                    });
                }
                paquetesTemp.splice(0, 1);

                for (var i = 0; i < respuesta.data.m_arrSobres.length; i++) {

                    if (respuesta.data.m_arrSobres[i].m_nIdEmbarqueDetalle == "" || respuesta.data.m_arrSobres[i].m_nIdEmbarqueDetalle == "0")
                        continue;

                    sobresTemp.push({
                        "descripcionSobre": respuesta.data.m_arrSobres[i].m_sDescripcion,
                        "id": respuesta.data.m_arrSobres[i].m_nIdEmbarqueDetalle
                    });
                }
                sobresTemp.splice(0, 1);
                //showSuccess(respuesta.data.m_nIdEmbarque);
                //setDataEmbarque(respuesta.data)
                setState({
                    ...state,
                    fecha: today.getDate() + "/" + (today.getMonth() + 1) + "/" + today.getFullYear() + " " + today.getHours() + ":" + today.getMinutes(),
                    idEmbarque: respuesta.data.m_nIdEmbarque,
                    idEmbarque2: respuesta.data.m_nIdEmbarque,
                    idSucursal: respuesta.data.IdSucursal,
                    idMoneda: respuesta.data.m_nIdMoneda,
                    nombreRemitente: respuesta.data.m_sNOmbreRemitente,
                    RFCRemitente: respuesta.data.m_sRFCRemitente,
                    domicilioRemitente: respuesta.data.m_sDomicilioRemitente,
                    codigoPostalRemitente: respuesta.data.m_nIdCodigoPostalRemitente,
                    ciudadRemitente: respuesta.data.m_sCiudadRemitente,
                    correoRemitente: respuesta.data.m_sCorreoRemitente,
                    tipoCambio: respuesta.data.m_cTIpoCambio,
                    idTipoCobro: respuesta.data.m_nIdTIpoCobro,
                    telefonoRemitente: respuesta.data.m_sTelefonoRemitente,
                    contactoRemitente: respuesta.data.m_sContactoRemitente,
                    origenRemitente: respuesta.data.m_sCiudadRemitente,
                    sNombreDestinatario: respuesta.data.m_sNombreDestinatario,
                    sRFCDestinatario: respuesta.data.m_sRFCDestinatario,
                    sDomicilioDestinatario: respuesta.data.m_sDomicilioDestinatario,
                    idCodigoPostalDestinatario: respuesta.data.m_nIdCodigoPostalDestinatario,
                    ciudadDestinatario: respuesta.data.m_sCIudadDestinatario,
                    sCorreoDestinatario: respuesta.data.m_sCorreoDestinatario,
                    sTelefonoDestinatario: respuesta.data.m_sTelefonoDestinatario,
                    sContactoDestinatario: respuesta.data.m_sContactoDestinatario,
                    CiudadDestino: respuesta.data.m_sCIudadDestinatario,
                    paquetes: paquetesTemp,
                    sobres: sobresTemp
                })
                const getEmbarquesOpcionesURL = `${process.env.REACT_APP_API_URL}/Embarques/GetBySucursalMoneda/` + respuesta.data.IdSucursal + "/" + respuesta.data.m_nIdMoneda + "/" + state.idGuia;
                axios.get(getEmbarquesOpcionesURL, { headers }).then(respuesta => {
                    setDataEmbarque(respuesta.data)
                })
            });
        }
        if (localStorage.getItem("UsuarioId") === null || localStorage.getItem("UsuarioId") <= 0) {
            showSuccess("Es necesario iniciar sesion para acceder a este proceso");
            window.location.replace("login");
            return;
        }
        getAllData();
        getAllDataSucursal();
        getAllDataMoneda();
        getAllDataTipoCobro();
        getAllDataTipoServicio();
        getAllDataEstatusGuia();
        getAllCiudades();
        getAllConceptos();
        getAllImpuestosTraslado();
        getAllImpuestosRetiene();
        getUltimoFolioGuia()
        getTipoCambio()
    }, []);

    async function getAllData() {
        const url = `${process.env.REACT_APP_API_URL}/Guia/GetListado`;
        await axios.get(url, { headers }).then(respuesta => {
            setData(respuesta.data)
        });
    };

    function addConcepto(data) {
        const { conceptosAdicionales } = state
        var ivaTraslada = []
        var ivaRetiene = []
        conceptosAdicionales.push({ concepto: data.concepto, importe: data.importe, retiene: data.retiene, traslada: data.traslada, importeRet: data.importeRet, importeIVA: data.importeIVA })
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
        const url = `${process.env.REACT_APP_API_URL}/Sucursales/GetListado`;
        await axios.get(url, { headers }).then(respuesta => {
            setDataSucursal(respuesta.data)
        });
    };

    async function getAllConceptos() {
        const url = `${process.env.REACT_APP_API_URL}/ConceptosFacturacion/GetListado`;
        await axios.get(url, { headers }).then(respuesta => {
            setDataConcepto(respuesta.data)
        });
    };

    async function getAllImpuestosRetiene() {
        const url = `${process.env.REACT_APP_API_URL}/Impuestos/GetListadoByTipoImpuesto/2`;
        await axios.get(url, { headers }).then(respuesta => {
            setDataImpuestoRetiene(respuesta.data)
        });
    };

    async function getAllImpuestosTraslado() {
        const url = `${process.env.REACT_APP_API_URL}/Impuestos/GetListadoByTipoImpuesto/1`;
        await axios.get(url, { headers }).then(respuesta => {
            setDataImpuestoTraslado(respuesta.data)
        });
    };

    async function getAllDataMoneda() {
        const url = `${process.env.REACT_APP_API_URL}/Moneda/GetListado`;
        await axios.get(url, { headers }).then(respuesta => {
            setDataMoneda(respuesta.data)
        });
    };

    async function getAllDataTipoCobro() {
        const url = `${process.env.REACT_APP_API_URL}/TipoCobro/GetListado`;
        await axios.get(url, { headers }).then(respuesta => {
            setDataTipoCobro(respuesta.data)
        });
    };

    async function getAllDataTipoServicio() {
        const url = `${process.env.REACT_APP_API_URL}/TipoServicio/GetListado`;
        await axios.get(url, { headers }).then(respuesta => {
            setDataTipoServicio(respuesta.data)
        });
    };


    async function getAllDataEstatusGuia() {
        const url = `${process.env.REACT_APP_API_URL}/EstatusGuia/GetListado`;
        await axios.get(url, { headers }).then(respuesta => {
            setDataEstatusGuia(respuesta.data)
        });
    };

    async function getAllCiudades() {
        const url = `${process.env.REACT_APP_API_URL}/Ciudades/GetListado`;
        await axios.get(url, { headers }).then(respuesta => {
            setDataCiudad(respuesta.data)
        });
    };

    async function cargaEmbarqueSucursal(valor) {
        //showSuccess(valor);
        setState({
            ...state,
            idSucursal: valor
        });
        //showSuccess (state.idSucursal +"-" +state.idMoneda);

        if (valor == "" || valor == "0") return;
        if (state.idMoneda == "" || state.idMoneda == "0") return;

        const url = `${process.env.REACT_APP_API_URL}/Embarques/GetBySucursalMoneda/` + valor + "/" + state.idMoneda + "/" + state.idGuia;
        await axios.get(url, { headers }).then(respuesta => {
            setDataEmbarque(respuesta.data)
        });
    };

    function cargaEmbarqueModificar(valorSucursal, valorMoneda, valorGuia) {
        //showSuccess(valorSucursal + "-" + valorMoneda)
        const url = `${process.env.REACT_APP_API_URL}/Embarques/GetBySucursalMoneda/` + valorSucursal + "/" + valorMoneda + "/" + valorGuia;
        axios.get(url, { headers }).then(respuesta => {
            //console.log(respuesta);
            setDataEmbarque(respuesta.data)
        });
    };

    async function cargaEmbarqueMoneda(valor) {
        //showSuccess(valor);
        setState({
            ...state,
            idMoneda: valor
        });
        //showSuccess (state.idSucursal +"-" +state.idMoneda);

        if (state.idSucursal === "" || state.idSucursal === "0") return;
        if (valor === "" || valor === "0") return;

        const url = `${process.env.REACT_APP_API_URL}/Embarques/GetBySucursalMoneda/` + state.idSucursal + "/" + valor + "/" + state.idGuia;
        await axios.get(url, { headers }).then(respuesta => {
            setDataEmbarque(respuesta.data)
        });
    };

    function handleEmbarque(embarque) {
        const url = `${process.env.REACT_APP_API_URL}/Embarques/GetById/` + embarque;
        //showSuccess(embarque);
        axios.get(url, { headers }).then(respuesta => {

            const paquetesTemp = [];
            const sobresTemp = [];
            //console.log(paquetesTemp);

            for (var i = 0; i < respuesta.data.m_arrPaquetes.length; i++) {

                if (respuesta.data.m_arrPaquetes[i].m_nIdEmbarqueDetalle === "" || respuesta.data.m_arrPaquetes[i].m_nIdEmbarqueDetalle === "0")
                    continue;

                paquetesTemp.push({

                    "peso": respuesta.data.m_arrPaquetes[i].m_xPeso,
                    "largo": respuesta.data.m_arrPaquetes[i].m_xLargo,
                    "ancho": respuesta.data.m_arrPaquetes[i].m_xAncho,
                    "alto": respuesta.data.m_arrPaquetes[i].m_xAlto,
                    "volumen": respuesta.data.m_arrPaquetes[i].m_xVolumen,
                    "peso": respuesta.data.m_arrPaquetes[i].m_xPeso,
                    "tipoEmbalaje": respuesta.data.m_arrPaquetes[i].m_nTipo,
                    "valorDeclarado": respuesta.data.m_arrPaquetes[i].m_cValorDeclarado,
                    "descripcionPaquete": respuesta.data.m_arrPaquetes[i].m_sDescripcion,
                    "observacionesPaquete": respuesta.data.m_arrPaquetes[i].m_sObservaciones,
                    "id": respuesta.data.m_arrPaquetes[i].m_nIdEmbarqueDetalle
                });
            }

            for (var i = 0; i < respuesta.data.m_arrSobres.length; i++) {

                if (respuesta.data.m_arrSobres[i].m_nIdEmbarqueDetalle == "" || respuesta.data.m_arrSobres[i].m_nIdEmbarqueDetalle == "0")
                    continue;

                sobresTemp.push({
                    "descripcionSobre": respuesta.data.m_arrSobres[i].m_sDescripcion,
                    "id": respuesta.data.m_arrSobres[i].m_nIdEmbarqueDetalle
                });
            }
            //showSuccess(respuesta.data.m_nIdEmbarque);
            //setDataEmbarque(respuesta.data)
            var conceptosTemp = []
            var ivaTraslada = []
            var ivaRetiene = []
            var flete = dataConcepto.find(c => c.m_nIdConceptosFacturacion === 22)
            axios.get(`${process.env.REACT_APP_API_URL}/Tarifas/GetBySucursalDestino/${state.idSucursal}/${respuesta.data.m_nIdCiudadDestino}`, { headers }).then(tarifa => {

                if (tarifa.data.length !== 0) {
                    tarifa.data[0].m_arrArConceptos.forEach(element => {
                        conceptosTemp.push({ concepto: dataConcepto.find(c => c.m_nIdConceptosFacturacion === element.m_nIdConceptoFacturacion), importe: element.m_cImporte, traslada: element.m_nIdImpuestoTraslada, importeIVA: element.m_cImporteIva, retiene: element.m_nIdImpuestoRetiene, importeRet: element.m_cImporteRetiene })

                    })
                    ivaTraslada = getUniqueListBy(conceptosTemp, "traslada").map(i => i.traslada);
                    ivaRetiene = getUniqueListBy(conceptosTemp, "retiene").map(i => i.retiene);
                }

                setState({
                    ...state,
                    idEmbarque: respuesta.data.m_nIdEmbarque,
                    idEmbarque2: respuesta.data.m_nIdEmbarque,
                    nombreRemitente: respuesta.data.m_sNOmbreRemitente,
                    RFCRemitente: respuesta.data.m_sRFCRemitente,
                    domicilioRemitente: respuesta.data.m_sDomicilioRemitente,
                    codigoPostalRemitente: respuesta.data.m_nIdCodigoPostalRemitente,
                    ciudadRemitente: respuesta.data.m_sCiudadRemitente,
                    correoRemitente: respuesta.data.m_sCorreoRemitente,
                    tipoCambio: respuesta.data.m_cTIpoCambio,
                    idTipoCobro: respuesta.data.m_nIdTIpoCobro,
                    telefonoRemitente: respuesta.data.m_sTelefonoRemitente,
                    contactoRemitente: respuesta.data.m_sContactoRemitente,
                    origenRemitente: respuesta.data.m_sCiudadRemitente,
                    sNombreDestinatario: respuesta.data.m_sNombreDestinatario,
                    sRFCDestinatario: respuesta.data.m_sRFCDestinatario,
                    sDomicilioDestinatario: respuesta.data.m_sDomicilioDestinatario,
                    idCodigoPostalDestinatario: respuesta.data.m_nIdCodigoPostalDestinatario,
                    ciudadDestinatario: respuesta.data.m_sCIudadDestinatario,
                    sCorreoDestinatario: respuesta.data.m_sCorreoDestinatario,
                    sTelefonoDestinatario: respuesta.data.m_sTelefonoDestinatario,
                    sContactoDestinatario: respuesta.data.m_sContactoDestinatario,
                    CiudadDestino: respuesta.data.m_sCIudadDestinatario,
                    paquetes: paquetesTemp,
                    sobres: sobresTemp,
                    conceptosAdicionales: conceptosTemp, ivaRetiene: ivaRetiene, ivaTraslada: ivaTraslada
                })
            })
            

        });
    };

    function handleEmbarqueModificar(embarque) {
        const url = `${process.env.REACT_APP_API_URL}/Embarques/GetById/` + embarque.data.m_nIdEmbarque;
        axios.get(url, { headers }).then(respuesta => {
            //setDataEmbarque(respuesta.data)
            const paquetesTemp = state.paquetes;
            const sobresTemp = state.sobres;
            const conceptosTemp = state.conceptos;
            //console.log(paquetesTemp);

            for (var i = 0; i < respuesta.data.m_arrPaquetes.length; i++) {

                if (respuesta.data.m_arrPaquetes[i].m_nIdEmbarqueDetalle == "" || respuesta.data.m_arrPaquetes[i].m_nIdEmbarqueDetalle == "0")
                    continue;

                paquetesTemp.push({

                    "peso": respuesta.data.m_arrPaquetes[i].m_xPeso,
                    "largo": respuesta.data.m_arrPaquetes[i].m_xLargo,
                    "ancho": respuesta.data.m_arrPaquetes[i].m_xAncho,
                    "alto": respuesta.data.m_arrPaquetes[i].m_xAlto,
                    "volumen": respuesta.data.m_arrPaquetes[i].m_xVolumen,
                    "peso": respuesta.data.m_arrPaquetes[i].m_xPeso,
                    "tipoEmbalaje": respuesta.data.m_arrPaquetes[i].m_nTipo,
                    "valorDeclarado": respuesta.data.m_arrPaquetes[i].m_cValorDeclarado,
                    "descripcionPaquete": respuesta.data.m_arrPaquetes[i].m_sDescripcion,
                    "observacionesPaquete": respuesta.data.m_arrPaquetes[i].m_sObservaciones,
                    "id": respuesta.data.m_arrPaquetes[i].m_nIdEmbarqueDetalle
                });
            }
            paquetesTemp.splice(0, 1);

            for (var i = 0; i < respuesta.data.m_arrSobres.length; i++) {

                if (respuesta.data.m_arrSobres[i].m_nIdEmbarqueDetalle === "" || respuesta.data.m_arrSobres[i].m_nIdEmbarqueDetalle === "0")
                    continue;

                sobresTemp.push({
                    "descripcionSobre": respuesta.data.m_arrSobres[i].m_sDescripcion,
                    "id": respuesta.data.m_arrSobres[i].m_nIdEmbarqueDetalle
                });
            }
            for (var i = 0; i < embarque.data.m_arClsGuiaConceptos.length; i++) {

                if (embarque.data.m_arClsGuiaConceptos[i].m_nIdConceptosFacturacion == "" || embarque.data.m_arClsGuiaConceptos[i].m_nIdConceptosFacturacion == "0")
                    continue;

                conceptosTemp.push({
                    IdConceptoFacturacion: embarque.data.m_arClsGuiaConceptos[i].m_nIdConceptoFacturacion,
                    Importe: embarque.data.m_arClsGuiaConceptos[i].m_cImporte,
                    IdImpuestoTraslada: embarque.data.m_arClsGuiaConceptos[i].m_nIdImpuestoTraslada,
                    ImporteIva: embarque.data.m_arClsGuiaConceptos[i].m_cImporteIva,
                    IdImpuestoRetiene: embarque.data.m_arClsGuiaConceptos[i].m_nIdImpuestoRetiene,
                    ImporteRetiene: embarque.data.m_arClsGuiaConceptos[i].m_cImporteRetiene,
                    Total: embarque.data.m_arClsGuiaConceptos[i].m_cTotal,
                    PorcentajeIva: embarque.data.m_arClsGuiaConceptos[i].m_cPorcentajeTraslada,
                    PorcentajeRetiene: embarque.data.m_arClsGuiaConceptos[i].m_cPorcentajeRetiene,
                    Total: embarque.data.m_arClsGuiaConceptos[i].m_cTotal,
                    IdGuiaConcepto: embarque.data.m_arClsGuiaConceptos[i].m_nIdGuiaConcepto
                });
            }
            conceptosTemp.splice(0, 1);
            console.log(conceptosTemp);
            setState({
                ...state,
                nombreRemitente: respuesta.data.m_sNOmbreRemitente,
                RFCRemitente: respuesta.data.m_sRFCRemitente,
                domicilioRemitente: respuesta.data.m_sDomicilioRemitente,
                codigoPostalRemitente: respuesta.data.m_nIdCodigoPostalRemitente,
                ciudadRemitente: respuesta.data.m_sCiudadRemitente,
                correoRemitente: respuesta.data.m_sCorreoRemitente,
                telefonoRemitente: respuesta.data.m_sTelefonoRemitente,
                contactoRemitente: respuesta.data.m_sContactoRemitente,
                origenRemitente: respuesta.data.m_sCiudadRemitente,
                sNombreDestinatario: respuesta.data.m_sNombreDestinatario,
                sRFCDestinatario: respuesta.data.m_sRFCDestinatario,
                sDomicilioDestinatario: respuesta.data.m_sDomicilioDestinatario,
                idCodigoPostalDestinatario: respuesta.data.m_nIdCodigoPostalDestinatario,
                ciudadDestinatario: respuesta.data.m_sCIudadDestinatario,
                sCorreoDestinatario: respuesta.data.m_sCorreoDestinatario,
                sTelefonoDestinatario: respuesta.data.m_sTelefonoDestinatario,
                sContactoDestinatario: respuesta.data.m_sContactoDestinatario,
                CiudadDestino: respuesta.data.m_sCIudadDestinatario,
                showPopUp: true,
                idEmbarque: embarque.data.m_nIdEmbarque,
                folioGuía: embarque.data.m_nFolioGuia,
                folioRecoleccion: embarque.data.m_nFolioRecoleccion,
                folioInforme: embarque.data.m_nFolioInforme,
                idGuia: embarque.data.m_nIdGuia,
                fecha: embarque.data.m_dFecha,
                hora: embarque.data.m_sHora,
                idEstatusGuia: embarque.data.m_nIdEstatusGuia,
                ValorDeclarado: embarque.data.m_cValorDeclarado,
                idMoneda: embarque.data.m_nIdMoneda,
                tipoCambio: embarque.data.m_cTIpoCambio,
                idTipoCobro: embarque.data.m_nIdTIpoCobro,
                arrClsDetalle: embarque.data.m_arrClsDetalle,
                tracking: embarque.data.m_nTracking,
                arClsGuiaConceptos: embarque.data.m_arClsGuiaConceptos,
                creadoEl: embarque.data.m_dCreadoEl,
                idSucursal: embarque.data.IdSucursal,
                paquetes: paquetesTemp,
                sobres: sobresTemp,
                conceptos: conceptosTemp
            });
            //console.log(embarque.data.m_nIdEmbarque)
        });
    };

    const headers = {
        'Content-Type': 'application/json'
    }

    function DefaultColumnFilter({
        column: { filterValue, preFilteredRows, setFilter },
    }) {
        const count = preFilteredRows.length

        return (
            <TextField variant="outlined" margin="dense"
                className="form-control"
                value={filterValue || ''}
                onChange={e => {
                    setFilter(e.target.value || undefined)
                }}
                placeholder={`Buscar ${count} registros...`}
            />
        )
    }

    function Table({ columns, data }) {

        const defaultColumn = React.useMemo(
            () => ({
                // Default Filter UI
                Filter: DefaultColumnFilter
            }),
            []
        )

        const {
            getTableProps,
            getTableBodyProps,
            headerGroups,
            rows,
            prepareRow,
        } = useTable(
            {
                columns,
                data,
                defaultColumn
            },
            useFilters,
            useSortBy,
        )

        return (
            <div className="wrapper-tabla" style={{ height: state.height - 270 }}>
                <div className="wrapper-tabla-2" >
                    <table className="table tabla-listado" {...getTableProps()}>
                        <thead>

                            {headerGroups.map(headerGroup => (
                                <tr {...headerGroup.getHeaderGroupProps()}>
                                    <th>Acciones</th>
                                    {headerGroup.headers.map(column => (

                                        // Add the sorting props to control sorting. For this example
                                        // we can add them into the header props
                                        <th {...column.getHeaderProps(column.getSortByToggleProps())}>
                                            {column.render('Name')}
                                            {/* Add a sort direction indicator */}
                                            <span>
                                                {column.isSorted
                                                    ? column.isSortedDesc
                                                        ? <i className="fa fa-caret-up" />
                                                        : <i className="fa fa-caret-down" />
                                                    : ''}
                                            </span>
                                            <div>{column.canFilter ? column.render('Filter') : null}</div>
                                        </th>
                                    ))}
                                </tr>
                            ))}
                        </thead>
                        <tbody {...getTableBodyProps()}>
                            {rows.map(
                                (row, i) => {
                                    prepareRow(row);
                                    return (
                                        <tr {...row.getRowProps()}
                                            onClick={handleSelectRow.bind(this, row.original.m_nIdGuia)}
                                            className={state.idGuia === row.original.m_nIdGuia ? classes.seleccionado : classes.noSeleccionado}>

                                            <td>
                                                <div>
                                                    <a href="#Agregar" role="tab" data-toggle="tab" onClick={() => (handleShowModificar(row.original.m_nIdGuia))} className="btn btn-default btn-sm"><i className="fa fa-pencil-square-o" style={{ color: "#F9A03E" }} /></a>
                                                    <a href="#Agregar" role="tab" data-toggle="tab" className="btn btn-default btn-sm" onClick={() => (handleShowConsultar(row.original.m_nIdGuia))}><i className="fa fa-eye" style={{ color: "#F9A03E" }} /></a>
                                                    <a href="#" className="btn btn-default btn-sm" onClick={() => (handleEliminar(row.original.m_nIdGuia))}><i className="zmdi zmdi-delete" style={{ color: "#F30B0B" }} /></a>
                                                </div>
                                            </td>
                                            {row.cells.map(cell => {
                                                return (
                                                    <td {...cell.getCellProps()}>{cell.render('Cell')}</td>
                                                )
                                            })}
                                        </tr>
                                    )
                                }
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        )
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
                            value={state.paquetes[index].Ctd}
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

    return (
        <div >

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



                    <ul className="nav navStatica nav-tabs">
                        <li className={props.location.idEmbarque != undefined ? "" : "active"}>
                            <a data-toggle="tab" href="#Listado">
                                <i className="fa fa-list" /> Listado
            </a>
                        </li>
                        <li className={props.location.idEmbarque != undefined ? "active" : ""}>
                            <a data-toggle="tab" href="#Agregar" onClick={() => handleShowAgregar()}>
                                <i className="fa fa-plus-circle" /> {state.agregar}
                            </a>
                        </li>
                        <li>
                            <a data-toggle="tab" href="#Imprimir" onClick={handleShowImprimir}>
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
                        <li>
                            <ExportCSV csvData={data} fileName="Guia_Listado" />
                        </li>
                        <li>
                            <ExportPDF data={data} column={columns} fileName="Guia" />
                        </li>
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
                                                        >
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
                                                                        label="Sucursal"
                                                                        disabled="disabled"
                                                                    >
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
                                                                    placeholder={state.folioGuía}
                                                                    readOnly={state.agregar == "Consultar"}
                                                                    id="folioGuia"
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
                                                                        read="true"
                                                                        value={state.idEstatusGuia}
                                                                        disabled={state.agregar == "Consultar"}
                                                                    >
                                                                        <option value="0">
                                                                            Seleccionar
                                                                        </option>
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
                                                                        disabled={state.agregar == "Consultar"}
                                                                        id="tipoCambio"
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

                                    {/*remitente*/}
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
                                                                                    value={state.idCodigoPostalDestinatario}
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
                                    <div className="widget-wrap" id="paquetesSobres">
                                        <div className="widget-header">
                                            <div className="col-md-6">
                                                <h2>Número de Paquetes</h2>
                                            </div>
                                            <div className="col-md-6">
                                                <h2>Número de Sobres</h2>
                                            </div>

                                        </div>
                                        <div className="row">
                                            <div className="col-md-6"  >
                                                <div className="widget-container">
                                                    <div className="widget-content">
                                                        <div className="row">
                                                            <div className="col-md-12">
                                                                <form className="j-forms">
                                                                    <div className="form-content">


                                                                        <div style={{ padding: "20px" }}>
                                                                            <Carousel
                                                                                className={classes.paqueteCarrusel}
                                                                                widgets={[IndicatorDots, Buttons]}
                                                                                frames={framesPaquete}
                                                                            ></Carousel>
                                                                        </div>
                                                                    </div>
                                                                </form>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="col-md-6"  >
                                                <div className="widget-container">
                                                    <div className="widget-content">
                                                        <div className="clone-widget">
                                                            <form className="j-forms">
                                                                <div className="form-content">


                                                                    <div style={{ padding: "20px" }}>
                                                                        <Carousel
                                                                            className={classes.paqueteCarrusel}
                                                                            widgets={[IndicatorDots, Buttons]}
                                                                            frames={framesSobres}
                                                                        ></Carousel>
                                                                    </div>
                                                                </div>
                                                            </form>
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
                                                                <form className="j-forms">
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
                                                                                        read="true"
                                                                                        value={state.idTipoCobro}
                                                                                        disabled={state.agregar == "Consultar"}
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
                                                                                        read="true"
                                                                                    >
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
                                                                                    id="ValorDeclarado"
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
                                                                <ConceptosAdicionales guias={true} conceptosAdicionales={state.conceptosAdicionales} addConcepto={addConcepto} removeConcepto={removeConcepto} ivaRetiene={state.ivaRetiene} ivaTraslada={state.ivaTraslada}>

                                                                </ConceptosAdicionales>
                                                            }

                                                        </form>
                                                    </div>

                                                    <div className="form-footer" className="col-md-12">

                                                        <button
                                                            href="#Listado"
                                                            role="tab"
                                                            data-toggle="tab"
                                                            className="btn btn-secondary secondary-btn"
                                                        >
                                                            Cancelar
                            </button>
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
                                                                value={state.folioGuía}
                                                                id="folioGuía"
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
                                                            />
                                                        </div>
                                                    </div>

                                                    <div className="form-footer" className="col-md-12">
                                                        <button
                                                            href="#Listado"
                                                            role="tab"
                                                            data-toggle="tab"
                                                            className="btn btn-secondary secondary-btn"
                                                        >
                                                            Cancelar
                                </button>
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

export default Guia;