import React, { useEffect, useState, useMemo } from "react";
import axios from "axios";
import Cabecera from "../Components/Template/Cabecera";

import BarraLateralIzquierda from "../Components/Template/BarraLateralIzquierda";
import BarraLateralDerecha from "../Components/Template/BarraLateralDerecha";
import ExportCSV from '../Components/Template/Export';
import ExportPDF from "../Components/Template/ExportPDF";
import Carousel from "re-carousel";
import IndicatorDots from "../Util/Dots";
import Buttons from "../Util/CarruselButtons";
import { makeStyles } from "@material-ui/core/styles";
import * as XLSX from 'xlsx';
import { useTable, useFilters, useAsyncDebounce, useSortBy } from 'react-table'
import $ from 'jquery';
import { remove_array_element } from "../Util/Util";
import Barra from "../Util/jquery-barcode"


window.jQuery = window.$ = $;
const styles = {
  paqueteCarrusel: {
    height: "300px !important",
  },

};
const styles2 = {
  conceptoCarrusel: {
    height: "220px !important",
  },
};
const useStyles = makeStyles(styles);

const useStyles2 = makeStyles(styles2);

function Guia() {
  var React = require('react');
  var QRCode = require('qrcode.react');
  const classes = useStyles();
  const classes2 = useStyles2();
  localStorage.getItem("UsuarioId");

  const [data, setData] = React.useState([])
  const [state, setState] = React.useState({
    showPopUp: false,
    idGuia: 0,
    agregar: "Agregar",
    fechaInicial: "",
    fechaFinal: "",
    sucursal: "",
    folioRecoleccion: "",
    folioEmbarque: "",
    folioGuía: "",
    folioInforme: "",
    fecha: "",
    DerechoBorrar: 145,
    estatus: "",
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
    //	alert(indice);
    $("#idBarra" + indice).barcode(valor, "code128");
  }

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
        alert(respuesta.data)
        getAllData()
      }).catch(err => {
        console.log(err)
        alert(err)
      });
    } else {
      const url = `${process.env.REACT_APP_API_URL}/Guia/Agregar`;
      debugger;
      axios.post(url, Object.assign({}, params), { headers }).then(respuesta => {
        alert(respuesta.data)
        //window.location.reload();
        var resp = respuesta.data;
        debugger;
        var vGuia = resp.substring(resp.indexOf(":") + 2);
        getImpresion(vGuia);
      }).catch(err => {
        console.log(err)
        alert(err)
      });
    }

  }

  async function getImpresion(id) {
    //alert (state.nGuiaId);		
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
  function addPaquete() {
    const { paquetes } = state;
    paquetes.push({
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
    });
    //console.log(paquetes);
    setState({ ...state, paquetes: paquetes });
  }
  function addSobre() {
    const { sobres } = state;
    sobres.push({
      descripcionSobre: "",
      id: 0
    });
    //console.log(sobres);
    setState({ ...state, sobres: sobres });
  }
  function addConcepto() {
    const { conceptos } = state;
    conceptos.push({
      IdImpuestoRetiene: 0,
      IdImpuestoTrasladado: 0,
      Importe: 0,
      ImporteIva: 0,
      ImporteRetiene: 0,
      Total: 0,
      idConceptoFacturacion: 0,
      PorcentajeIva: 0,
      PorcentajeRetiene: 0
    });
    //console.log(conceptos);
    setState({ ...state, conceptos: conceptos });
  }

  function removeSobre(index) {
    var { sobres } = state;
    sobres = remove_array_element(sobres, index)
    //console.log(sobres)
    setState({ ...state, sobres: sobres });
  }
  function removePaquete(index) {
    var { paquetes } = state;
    paquetes = remove_array_element(paquetes, index)
    //console.log(paquetes)
    setState({ ...state, paquetes: paquetes });
  }
  function removeConcepto(index) {
    var { conceptos } = state;
    conceptos = remove_array_element(conceptos, index)
    console.log(conceptos)
    setState({ ...state, conceptos: conceptos });
  }

  function handleEliminar(id) {
    var derecho;
    const urlDelete = `${process.env.REACT_APP_API_URL}/Utilerias/ValidaDerechos/${state.creadoPor}/${state.DerechoBorrar}/3`;
    axios.get(urlDelete, { headers }).then(respuesta => {
      //alert(respuesta.data)

      derecho = respuesta.data;
      if (derecho == false) {
        alert("El usuario no tiene derechos para realizar el proceso");
        return;
      }

      const url = `${process.env.REACT_APP_API_URL}/Guia/Eliminar/` + id;
      axios.delete(url, { headers }).then(respuesta => {
        alert(respuesta.data)
        //console.log(respuesta)
        if (respuesta.data.indexOf("fracaso:") <= 0)
          getAllData()
      }).catch(function (err) {
        console.log(err.data)
      });
    }).catch(err => {
      alert(err)
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
      // alert(state.idMoneda)
    }).catch(function (err) {
      console.log(err.data)
    });
    // debugger;
    // handleEmbarqueModificar (valor2)      

  }

  function handleShowConsultar(id) {
    const url = `${process.env.REACT_APP_API_URL}/Guia/GetById/` + id;
    axios.get(url, { headers }).then(respuesta => {
      //cargaEmbarqueModificar(respuesta.data.IdSucursal, respuesta.data.m_nIdMoneda, id)
      //handleEmbarqueModificar(respuesta)
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
      // alert(state.idMoneda)
    }).catch(function (err) {
      console.log(err.data)
    });
    // debugger;
    // handleEmbarqueModificar (valor2)      

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
    var today = new Date();
    setState({
      ...state,
      agregar: "Agregar",
      showPopUp: true,

      sucursal: "",
      folioRecoleccion: "",
      folioEmbarque: "",
      folioGuía: "",
      folioInforme: "",
      fecha: today.getDate() + "/" + (today.getMonth() + 1) + "/" + today.getFullYear() + " " + today.getHours() + ":" + today.getMinutes(),
      estatus: "",
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

  const handleChangePaquete = (event, index) => {

    var { paquetes } = state
    paquetes[index][event.target.name] = event.target.value
    setState({
      ...state,
      paquetes: paquetes
    });
  };
  const handleChangeConcepto = (event, index) => {

    var { conceptos } = state
    conceptos[index][event.target.name] = event.target.value
    //alert(event.target.name);
    //alert(conceptos[index][event.target.name])
    setState({
      ...state,
      conceptos: conceptos
    });
  };

  const handleChangeConceptoImporte = (event, index) => {

    var { conceptos } = state
    conceptos[index][event.target.name] = event.target.value
    setState({
      ...state,
      conceptos: conceptos
    });
    calculaIva(conceptos, index, 0);
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
      Name: "Fecha",
      accessor: "m_dFecha",
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
      accessor: "m_nFolioInforme",
    }, {
      Name: "Folio Embarque",
      accessor: "m_nFolioEmbarque",
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

  useEffect(value => {
    if (localStorage.getItem("UsuarioId") === null || localStorage.getItem("UsuarioId") <= 0) {
      alert("Es necesario iniciar sesion para acceder a este proceso");
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
  }, []);

  async function getAllData() {
    const url = `${process.env.REACT_APP_API_URL}/Guia/GetListado`;
    await axios.get(url, { headers }).then(respuesta => {
      setData(respuesta.data)
    });
  };

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
    //alert(valor);
    setState({
      ...state,
      idSucursal: valor
    });
    //alert (state.idSucursal +"-" +state.idMoneda);

    if (valor == "" || valor == "0") return;
    if (state.idMoneda == "" || state.idMoneda == "0") return;

    const url = `${process.env.REACT_APP_API_URL}/Embarques/GetBySucursalMoneda/` + valor + "/" + state.idMoneda + "/" + state.idGuia;
    await axios.get(url, { headers }).then(respuesta => {
      setDataEmbarque(respuesta.data)
    });
  };
  function cargaEmbarqueModificar(valorSucursal, valorMoneda, valorGuia) {
    //alert(valorSucursal + "-" + valorMoneda)
    const url = `${process.env.REACT_APP_API_URL}/Embarques/GetBySucursalMoneda/` + valorSucursal + "/" + valorMoneda + "/" + valorGuia;
    axios.get(url, { headers }).then(respuesta => {
      //console.log(respuesta);
      setDataEmbarque(respuesta.data)
    });
  };
  async function cargaEmbarqueMoneda(valor) {
    //alert(valor);
    setState({
      ...state,
      idMoneda: valor
    });
    //alert (state.idSucursal +"-" +state.idMoneda);

    if (state.idSucursal === "" || state.idSucursal === "0") return;
    if (valor === "" || valor === "0") return;

    const url = `${process.env.REACT_APP_API_URL}/Embarques/GetBySucursalMoneda/` + state.idSucursal + "/" + valor + "/" + state.idGuia;
    await axios.get(url, { headers }).then(respuesta => {
      setDataEmbarque(respuesta.data)
    });
  };

  function handleEmbarque2(embarque) {
    const url = `${process.env.REACT_APP_API_URL}/Embarques/GetById/` + embarque;
    //alert(embarque);
    axios.get(url, { headers }).then(respuesta => {
      setState({
        ...state,
        idEmbarque: respuesta.data.m_nIdEmbarque,
        idEmbarque2: respuesta.data.m_nIdEmbarque,
        paquetes: [],
        sobres: []
      });
      const paquetesTemp = state.paquetes;
      const sobresTemp = state.sobres;
      //console.log(paquetesTemp);

      for (var i = 0; i < respuesta.data.m_arrPaquetes.length; i++) {

        if (respuesta.data.m_arrPaquetes[i].m_nIdEmbarqueDetalle === "" || respuesta.data.m_arrPaquetes[i].m_nIdEmbarqueDetalle === "0")
          continue;

        paquetesTemp.push({

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
      console.log(respuesta.data);
      //alert(respuesta.data.m_nIdEmbarque);
      //setDataEmbarque(respuesta.data)
      setState({
        ...state,
        idEmbarque: respuesta.data.m_nIdEmbarque,
        idEmbarque2: respuesta.data.m_nIdEmbarque,
        tipoCambio: respuesta.data.m_cTIpoCambio,
        idTipoCobro: respuesta.data.m_nIdTIpoCobro,
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
        paquetes: paquetesTemp,
        sobres: sobresTemp
      })

    });
  };
  function handleEmbarque(embarque) {
    const url = `${process.env.REACT_APP_API_URL}/Embarques/GetById/` + embarque;
    //alert(embarque);
    axios.get(url, { headers }).then(respuesta => {
      setState({
        ...state,
        idEmbarque: respuesta.data.m_nIdEmbarque,
        idEmbarque2: respuesta.data.m_nIdEmbarque,
        paquetes: [],
        sobres: [],
        conceptos: []
      });
      const paquetesTemp = state.paquetes;
      const sobresTemp = state.sobres;
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
      //alert(respuesta.data.m_nIdEmbarque);
      //setDataEmbarque(respuesta.data)
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
        sobres: sobresTemp
      })

    });
  };
  function calculaIva(conceptos, index, tipo) {
    if (tipo === 1)
      conceptos[index].ImporteIva = Number(conceptos[index].Importe) * (Number(conceptos[index].PorcentajeIva))
    else if (tipo === 2) {
      conceptos[index].ImporteRetiene = Number(conceptos[index].Importe) * (Number(conceptos[index].PorcentajeRetiene))
    }
    else if (tipo === 0) {
      console.log(conceptos)
      conceptos[index].ImporteIva = Number(conceptos[index].Importe) * (Number(conceptos[index].PorcentajeIva))
      conceptos[index].ImporteRetiene = Number(conceptos[index].Importe) * (Number(conceptos[index].PorcentajeRetiene))
    }
    conceptos[index].Total = Number(conceptos[index].Importe) + Number(conceptos[index].ImporteIva) - Number(conceptos[index].ImporteRetiene)
    setState({
      ...state,
      conceptos: conceptos
    });
  }

  function handleChangeConceptoImpuesto(event, index, tipo) {
    var valor = event.target.value;

    const url = `${process.env.REACT_APP_API_URL}/Impuestos/GetById/` + event.target.value;
    axios.get(url, { headers }).then(respuesta => {

      var { conceptos } = state

      conceptos[index][event.target.name] = valor

      if (tipo == 1) {
        conceptos[index].PorcentajeIva = respuesta.data.m_nPorcentaje / 100
        conceptos[index].IdImpuestoTraslada = valor

      }
      else if (tipo == 2) {
        conceptos[index].PorcentajeRetiene = respuesta.data.m_nPorcentaje / 100
        conceptos[index].IdImpuestoRetiene = valor
      }
      console.log(conceptos[index].IdImpuestoRetiene + "-" + conceptos[index].IdImpuestoTraslada)
      calculaIva(conceptos, index, tipo);

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
        agregar: "Modificar",
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
      <input
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
      state,
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
      <div className="col-md-12">
        <table className="table" {...getTableProps()}>
          <thead className="">

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
                  <tr {...row.getRowProps()}>
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

    var $welem = $section.parentsUntil(".widget-action-bar").parentsUntil(".w-action").parents(".widget-header").next(".widget-container");

    $welem.slideDown();
    $section.children("a").children("i").removeClass("zmdi-chevron-up");
    $section.children("a").children("i").addClass("zmdi-chevron-down");
    $('html, body').animate({
      scrollTop: parseInt($section.offset().top - ($section.height() / 2))
    }, 200);
    var $welem = $section
      .parentsUntil(".widget-action-bar")
      .parentsUntil(".w-action")
      .parents(".widget-header")
      .next(".widget-container");

  }
  //objeto de paquetes
  const framesPaquete = state.paquetes.map((p, index) => {
    return (
      <div key={`paquete${index}`}>
        <div className="col-sm-4 col-md-1-5 unit">
          <label className="label">Peso</label>
          <div className="input">
            <input
              onChange={(event) => handleChangePaquete(event, index)}
              className="form-control"
              type="text"
              value={state.paquetes[index].peso}
              placeholder="Peso"
              name="peso"
              disabled="true"
            />
          </div>
        </div>

        <div className="col-sm-4 col-md-1-5 unit">
          <label className="label">Largo</label>
          <div className="input">
            <input
              onChange={(event) => handleChangePaquete(event, index)}
              className="form-control"
              type="text"
              value={state.paquetes[index].largo}
              placeholder="Largo"
              name="largo"
              disabled="true"
            />
          </div>
        </div>

        <div className="col-sm-4 col-md-1-5 unit">
          <label className="label">Ancho</label>
          <div className="input">
            <input
              onChange={(event) => handleChangePaquete(event, index)}
              className="form-control"
              type="text"
              value={state.paquetes[index].ancho}
              placeholder="Ancho"
              name="ancho"
              disabled="true"
            />
          </div>
        </div>

        <div className="col-sm-4 col-md-1-5 unit">
          <label className="label">Alto</label>
          <div className="input">
            <input
              onChange={(event) => handleChangePaquete(event, index)}
              className="form-control"
              type="text"
              value={state.paquetes[index].alto}
              placeholder="Alto"
              name="alto"
              disabled="true"
            />
          </div>
        </div>

        <div className="col-sm-4 col-md-1-5 unit">
          <label className="label">Volumen</label>
          <div className="input">
            <input
              onChange={(event) => handleChangePaquete(event, index)}
              className="form-control"
              type="text"
              value={state.paquetes[index].volumen}
              placeholder="Volumen"
              name="volumen"
              disabled="true"
            />
          </div>
        </div>

        <div className="col-sm-4 col-md-4-5 unit">
          <label className="label">Tipo de Embalaje</label>
          <div className="input">
            <input
              onChange={(event) => handleChangePaquete(event, index)}
              className="form-control"
              type="text"
              value={state.paquetes[index].tipoEmbalaje}
              placeholder="Tipo de Embarje"
              name="tipoEmbalaje"
              disabled="true"
            />
          </div>
        </div>

        <div className="col-sm-4 col-md-3 unit">
          <label className="label">Valor Declarado</label>
          <div className="input">
            <input
              onChange={(event) => handleChangePaquete(event, index)}
              className="form-control"
              type="text"
              value={state.paquetes[index].valorDeclarado}
              placeholder="Valor Declarado"
              name="valorDeclarado"
              disabled="true"
            />
          </div>
        </div>

        <div className="col-sm-4 col-md-7-5 unit">
          <label className="label">Descripción</label>
          <div className="input">
            <input
              onChange={(event) => handleChangePaquete(event, index)}
              className="form-control"
              type="text"
              value={state.paquetes[index].descripcionPaquete}
              placeholder="Descripción"
              name="descripcionPaquete"
              disabled="true"
            />
          </div>
        </div>

        <div className="col-sm-4 col-md-1-5 unit">
          <label className="label">Ctd</label>
          <div className="input">
            <input
              onChange={(event) => handleChangePaquete(event, index)}
              className="form-control"
              type="text"
              value={state.paquetes[index].Ctd}
              placeholder="Ctd"
              name="ctd"
              disabled="true"
            />
          </div>
        </div>

        <div className="col-sm-4 col-md-12 unit">
          <label className="label">Observaciones</label>
          <div className="input">
            <input
              onChange={(event) => handleChangePaquete(event, index)}
              className="form-control"
              type="text"
              value={state.paquetes[index].observacionesPaquete}
              placeholder="Observaciones"
              name="observacionesPaquete"
              disabled="true"
            />
          </div>
        </div>


      </div>
    );
  });
  const framesConcepto = state.conceptos.map((p, index) => {
    return (
      <div key={`concepto${index}`}>
        <div className="col-sm-4 col-md-2-5 unit">
          <label className="label">Concepto</label>
          <div className="input">
            <select
              className="form-control"
              required
              onChange={event => (handleChangeConcepto(event, index))}
              id="IdConceptoFacturacion"
              name="IdConceptoFacturacion"
              read="true"
              value={state.conceptos[index].IdConceptoFacturacion}
              disabled={state.agregar == "Consultar"}
            >
              <option value="0">
                Seleccionar
            </option>
              {dataConcepto.map(
                (concepto) => (
                  <option key={concepto.m_nIdConceptosFacturacion} value={concepto.m_nIdConceptosFacturacion}>
                    {
                      concepto.m_sConcepto
                    }
                  </option>
                )
              )}
            </select>
          </div>
        </div>


        <div className="col-sm-4 col-md-2-5 unit">
          <label className="label">Importe</label>
          <div className="input">
            <input
              onChange={(event) => handleChangeConceptoImporte(event, index)}
              className="form-control"
              type="text"
              value={state.conceptos[index].Importe}
              placeholder="Importe"
              name="Importe"
            />
          </div>
        </div>

        <div className="col-sm-4 col-md-2-5 unit">
          <label className="label">Impuesto Trasladado</label>
          <div className="input">
            <select
              className="form-control"
              required
              onChange={event => (handleChangeConceptoImpuesto(event, index, 1))}
              id="IdImpuestoTraslada"
              value={state.conceptos[index].IdImpuestoTraslada}
              disabled={state.agregar == "Consultar"}
            >
              <option value="0">
                Seleccionar
            </option>
              {dataImpuestoTraslado.map(
                (traslado) => (
                  <option key={traslado.m_nIdImpuesto} value={traslado.m_nIdImpuesto}>
                    {
                      traslado.m_sImpuesto
                    }
                  </option>
                )
              )}
            </select>

          </div>
        </div>
        <div className="col-sm-4 col-md-2-5 unit">
          <label className="label">Impuesto Retiene</label>
          <div className="input">
            <select
              className="form-control"
              required
              onChange={event => (handleChangeConceptoImpuesto(event, index, 2))}
              id="IdImpuestoRetiene"
              read="true"
              value={state.conceptos[index].IdImpuestoRetiene}
              disabled={state.agregar == "Consultar"}
            >
              <option value="0">
                Seleccionar
            </option>
              {dataImpuestoRetiene.map(
                (retiene) => (
                  <option key={retiene.m_nIdImpuesto} value={retiene.m_nIdImpuesto}>
                    {
                      retiene.m_sImpuesto
                    }
                  </option>
                )
              )}
            </select>

          </div>
        </div>

        <div className="col-sm-4 col-md-2-5 unit">
          <label className="label">IVA</label>
          <div className="input">
            <input
              onChange={(event) => handleChangeConcepto(event, index)}
              className="form-control"
              type="text"
              value={state.conceptos[index].ImporteIva}
              placeholder="IVA"
              name="ImporteIva"
              read="true"
              disabled="disabled"
            />
          </div>
        </div>

        <div className="col-sm-4 col-md-2-5 unit">
          <label className="label">Importe Retencion</label>
          <div className="input">
            <input
              onChange={(event) => handleChangeConcepto(event, index)}
              className="form-control"
              type="text"
              value={state.conceptos[index].ImporteRetiene}
              placeholder="Retiene"
              name="ImporteRetiene"
              read="true"
              disabled="disabled"
            />
          </div>
        </div>


        <div className="col-sm-4 col-md-2-5 unit">
          <label className="label">Total</label>
          <div className="input">
            <input
              onChange={(event) => handleChangeConcepto(event, index)}
              className="form-control"
              type="text"
              value={state.conceptos[index].Total}
              placeholder="Total"
              name="Total"
              read="true"
              disabled="disabled"
            />
          </div>
        </div>

        {
          state.conceptos.length !== 1 &&
          <a className="btn delete" onClick={() => removeConcepto(index)}>
            <i className="zmdi zmdi-delete"></i> Eliminar Concepto
      </a>
        }

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
                        <div class="col-md-12 unit">
                          <label className="label">
                            Remitente
											</label>
                          <div className="input">
                            <input
                              className="form-control"
                              type="text"
                              placeholder={state.paquetesI[index].Remitente}
                              id={"Remitente" + index}
                              disabled="disabled"
                            />
                          </div>
                        </div>
                        <div class="col-md-12 unit">
                          <label className="label">
                            RFC
											</label>
                          <div className="input">
                            <input
                              className="form-control"
                              type="text"
                              placeholder={state.paquetesI[index].RFC}
                              id={"RFC" + index}
                              disabled="disabled"
                            />
                          </div>
                        </div>
                        <div class="col-md-12 unit">
                          <label className="label">
                            Dirección
											</label>
                          <div className="input">
                            <input
                              className="form-control"
                              type="text"
                              placeholder={state.paquetesI[index].Direccion}
                              id={"Direccion" + index}
                              disabled="disabled"
                            />
                          </div>
                        </div>
                        <div class="col-md-12 unit">
                          <label className="label">
                            Zona
											</label>
                          <div className="input">
                            <input
                              className="form-control"
                              type="text"
                              placeholder={state.paquetesI[index].Zona}
                              id={"Zona" + index}
                              disabled="disabled"
                            />
                          </div>
                        </div>
                        <div class="col-md-12 unit">
                          <label className="label">
                            CP
											</label>
                          <div className="input">
                            <input
                              className="form-control"
                              type="text"
                              placeholder={state.paquetesI[index].CP}
                              id={"CP" + index}
                              disabled="disabled"
                            />
                          </div>
                        </div>
                        <div class="col-md-12 unit">
                          <label className="label">
                            Ciudad
											</label>
                          <div className="input">
                            <input
                              className="form-control"
                              type="text"
                              placeholder={state.paquetesI[index].CiudadRemitente}
                              id={"CiudadRemitente" + index}
                              disabled="disabled"
                            />
                          </div>
                        </div>
                        <div class="col-md-12 unit">
                          <label className="label">
                            Teléfono
											</label>
                          <div className="input">
                            <input
                              className="form-control"
                              type="text"
                              placeholder={state.paquetesI[index].Telefono}
                              id={"Telefono" + index}
                              disabled="disabled"
                            />
                          </div>
                        </div>


                      </div>
                      <div className="col-md-6">
                        <div class="col-md-12 unit">
                          <label className="label">
                            Destinatario
											</label>
                          <div className="input">
                            <input
                              className="form-control"
                              type="text"
                              placeholder={state.paquetesI[index].Destinatario}
                              id={"CiudadDestino" + index}
                              disabled="disabled"
                            />
                          </div>
                        </div>
                        <div class="col-md-12 unit">
                          <label className="label">
                            RFC
											</label>
                          <div className="input">
                            <input
                              className="form-control"
                              type="text"
                              placeholder={state.paquetesI[index].RFCDestinatario}
                              id={"RFC" + index}
                              disabled="disabled"
                            />
                          </div>
                        </div>
                        <div class="col-md-12 unit">
                          <label className="label">
                            Dirección
											</label>
                          <div className="input">
                            <input
                              className="form-control"
                              type="text"
                              placeholder={state.paquetesI[index].DireccionDestinatario}
                              id={"Direccion" + index}
                              disabled="disabled"
                            />
                          </div>
                        </div>
                        <div class="col-md-12 unit">
                          <label className="label">
                            Zona
											</label>
                          <div className="input">
                            <input
                              className="form-control"
                              type="text"
                              placeholder={state.paquetesI[index].ZonaDestinatario}
                              id={"Zona" + index}
                              disabled="disabled"
                            />
                          </div>
                        </div>
                        <div class="col-md-12 unit">
                          <label className="label">
                            CP
											</label>
                          <div className="input">
                            <input
                              className="form-control"
                              type="text"
                              placeholder={state.paquetesI[index].CPDestinatario}
                              id={"CP" + index}
                              disabled="disabled"
                            />
                          </div>
                        </div>
                        <div class="col-md-12 unit">
                          <label className="label">
                            Ciudad
											</label>
                          <div className="input">
                            <input
                              className="form-control"
                              type="text"
                              placeholder={state.paquetesI[index].CiudadDestinatario}
                              id={"Ciudad" + index}
                              disabled="disabled"
                            />
                          </div>
                        </div>
                        <div class="col-md-12 unit">
                          <label className="label">
                            Teléfono
											</label>
                          <div className="input">
                            <input
                              className="form-control"
                              type="text"
                              placeholder={state.paquetesI[index].TelefonoDestinatario}
                              id={"Telefono" + index}
                              disabled="disabled"
                            />
                          </div>
                        </div>
                        <div class="col-md-12 unit">
                          <label className="label">
                            Cantidad
											</label>
                          <div className="input">
                            <input
                              className="form-control"
                              type="text"
                              placeholder={state.paquetesI[index].PaqueteCant}
                              id={"Cantidad" + index}
                              disabled="disabled"
                            />
                          </div>
                        </div>
                        <div class="col-md-12 unit">
                          <label className="label">
                            Descripcion
											</label>
                          <div className="input">
                            <input
                              className="form-control"
                              type="text"
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
          <label className="label">Descripcion</label>
          <div className="input">
            <input
              className="form-control"
              onChange={event => (handleChangeSobre(event, index))}
              id="descripcionSobre"
              name="descripcionSobre"
              read="true"
              disabled="true"
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
    <div>

      <header className="topbar clearfix">
        <Cabecera />
      </header>

      {/*Leftbar Start Here*/}
      <aside className="iconic-leftbar" style={{ minHeight: state.height }}>
        <BarraLateralIzquierda />
      </aside>
      {/*Leftbar End Here*/}

      {/*Page Container Start Here*/}
      <section className="main-container">

        <div className="container-fluid">

          <div className="page-header filled full-block light">
            <div className="row">
              <div className="col-md-6 col-sm-6">
                <h2>Guías</h2>
              </div>
              <div className="col-md-6 col-sm-6">
                <ul className="list-page-breadcrumb">
                  <li className="active-page">Guías</li>
                </ul>
              </div>
            </div>
          </div>

          <ul className="nav navStatica nav-tabs">
            <li className="active">
              <a data-toggle="tab" href="#Listado">
                <i className="fa fa-list" /> Listado
            </a>
            </li>
            <li>
              <a data-toggle="tab" href="#Agregar" onClick={handleShowAgregar}>
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
              <ExportCSV csvData={data} fileName="Guia_Listado" />
            </li>
            <li>
              <ExportPDF data={data} column={columns} fileName="Guia" />
            </li>
          </ul>

          <div className="row" className="tab-content">
            <div id="Listado" className="tab-pane fade in active">
              <div className="widget-wrap">
                <div className="widget-content">
                  <div>
                    <form className="j-forms">
                      <div className="form-content">
                        <div className="col-sm-6 col-md-3 unit">
                          <label className="label">
                            Fecha Inicial
                        </label>
                          <div className="input-group date addon-datepicker">
                            <input
                              type="date"
                              className="form-control"
                              onChange={handleChange}
                              id="fechaInicial"
                            />
                            <span className="input-group-addon">
                              <i className="fa fa-calendar" />
                            </span>
                          </div>
                        </div>

                        <div className="col-sm-6 col-md-3 unit">
                          <label className="label">
                            Fecha Final
                        </label>
                          <div className="input-group date addon-datepicker">
                            <input
                              type="date"
                              className="form-control"
                              onChange={handleChange}
                              id="fechaFinal"
                            />
                            <span className="input-group-addon">
                              <i className="fa fa-calendar" />
                            </span>
                          </div>
                        </div>

                        <div className="col-sm-6 col-md-3 unit">
                          <label className="label">
                            Sucursal
                        </label>
                          <div className="input">
                            <input
                              onChange={handleChange}
                              className="form-control"
                              type="select"
                              placeholder={state.codigoDepartamento}
                              id="codigoDepartamento"
                            />
                          </div>
                        </div>

                        <div className="col-sm-6 col-md-3 unit">
                          <label className="label">
                            Estatus
                        </label>
                          <div className="input">
                            <select
                              onChange={handleChange}
                              className="form-control"
                              type="calendar"
                              placeholder={state.codigoDepartamento}
                              disabled={state.agregar == "Consultar"}
                              id="codigoDepartamento"
                            />
                          </div>
                        </div>


                      </div>
                    </form>
                  </div>

                  <div className="row">
                    <Table columns={columns} data={data} />

                  </div>

                </div>
              </div>
            </div>
            <div id="Agregar" className="tab-pane fade">
              <form className="j-forms">
                <div className="form-content">

                  <div
                    className="wizard-breadcrumb number-style"
                    style={{
                      position: "sticky",
                      top: "150px",
                      padding: "5px",
                      backgroundColor: "white",
                      zIndex: 100,
                      marginBottom: "10px"
                    }}
                  >




                    <div className="row">
                      <div
                        className={
                          "col-md-2-5 col-sm-3 step " +
                          (stepActive == 1 && "active-step")
                        }
                        onClick={() => openSection(1)}
                      >
                        <div className={"steps"}>
                          <span className={"step-number"}>1</span>
                          <p>Información General</p>
                        </div>
                      </div>
                      <div
                        className={
                          "col-md-2-5 col-sm-3 step " +
                          (stepActive == 2 && "active-step")
                        }
                        onClick={() => openSection(2)}
                      >
                        <div className="steps">
                          <span className="step-number">2</span>
                          <p>Remitentes / Destinatario</p>
                        </div>
                      </div>
                      <div
                        className={
                          "col-md-2-5 col-sm-3 step " +
                          (stepActive == 3 && "active-step")
                        }
                        onClick={() => openSection(3)}
                      >
                        <div className="steps">
                          <span className="step-number">3</span>
                          <p>Detalles de la Recolección</p>
                        </div>
                      </div>

                      <div
                        className={
                          "col-md-2-5 col-sm-2 step " +
                          (stepActive == 4 && "active-step")
                        }
                        onClick={() => openSection(4)}
                      >
                        <div className="steps">
                          <span className="step-number">4</span>
                          <p>Detalle de Facturación</p>
                        </div>
                      </div>
                      <div
                        className={
                          "col-md-2-5 col-sm-2 step " +
                          (stepActive == 5 && "active-step")
                        }
                        onClick={() => openSection(5)}
                      >
                        <div className="steps">
                          <span className="step-number">5</span>
                          <p>Conceptos de Facturación</p>
                        </div>
                      </div>
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
                            <form className="j-forms">
                              <div className="form-content">

                                <div className="col-sm-4 col-md-2-5 unit">
                                  <label className="label">
                                    Sucursal
                          </label>
                                  <select
                                    className="form-control"
                                    required
                                    onChange={event => (cargaEmbarqueSucursal(event.target.value))}
                                    id="idSucursal"
                                    read="true"
                                    value={state.idSucursal}
                                    disabled="disabled"
                                  >
                                    <option value="0">
                                      Seleccionar
                            </option>
                                    {dataSucursal.map(
                                      (sucursal) => (
                                        <option key={sucursal.m_nIdSucursal} value={sucursal.m_nIdSucursal}>
                                          {
                                            sucursal.m_sSucursal
                                          }
                                        </option>
                                      )
                                    )}
                                  </select>
                                </div>
                                <div className="col-sm-4 col-md-2-5 unit">
                                  <label className="label">
                                    Folio Guia
                          </label>
                                  <div className="input">
                                    <input
                                      onChange={handleChange}
                                      className="form-control"
                                      type="text"
                                      placeholder={state.folioGuía}
                                      readOnly={state.agregar == "Consultar"}
                                      id="folioGuia"
                                      disabled="disabled"
                                    />
                                  </div>
                                </div>
                                <div className="col-sm-4 col-md-2-5 unit">
                                  <label className="label">
                                    Folio Embarque
                          </label>
                                  <select
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
                                  </select>
                                </div>
                                <div className="col-sm-4 col-md-2-5 unit">
                                  <label className="label">
                                    Folio Informe
                          </label>
                                  <div className="input">
                                    <input
                                      onChange={handleChange}
                                      className="form-control"
                                      type="text"
                                      placeholder={state.folioInforme}
                                      readOnly={state.agregar == "Consultar"}
                                      id="folioInforme"
                                      disabled="disabled"
                                    />
                                  </div>
                                </div>
                                <div className="col-sm-4 col-md-2-5 unit">
                                  <label className="label">
                                    Tracking
                          </label>
                                  <div className="input">
                                    <input
                                      onChange={handleChange}
                                      className="form-control"
                                      type="text"
                                      placeholder={state.tracking}
                                      readOnly={state.agregar == "Consultar"}
                                      id="tracking"
                                      disabled="disabled"
                                    />
                                  </div>
                                </div>

                                <div className="col-sm-4 col-md-2-5 unit">
                                  <label className="label">
                                    Fecha / Hora
                          </label>
                                  <div className="input">
                                    <input
                                      onChange={handleChange}
                                      className="form-control"
                                      type="text"
                                      placeholder={state.fecha}
                                      readOnly={state.agregar == "Consultar"}
                                      id="fecha"
                                      disabled="disabled"
                                    />
                                  </div>
                                </div>
                                <div className="col-sm-4 col-md-2-5 unit">
                                  <label className="label">
                                    Estatus de la Guia
                          </label>
                                  <select
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
                                  </select>

                                </div>



                                <div className="col-sm-4 col-md-2-5 unit">
                                  <label className="label">
                                    Moneda
                          </label>
                                  <select
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
                                  </select>
                                </div>




                                <div className="col-sm-4 col-md-2-5 unit">
                                  <label className="label">
                                    Tipo de Cambio
                          </label>
                                  <div className="input">
                                    <input
                                      onChange={handleChange}
                                      className="form-control"
                                      type="text"
                                      placeholder={state.tipoCambio}
                                      readOnly={state.agregar == "Consultar"}
                                      id="tipoCambio"
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
                                      <label className="label">
                                        Nombre
                        </label>
                                      <div className="input">
                                        <input
                                          onChange={handleChange}
                                          className="form-control"
                                          type="text"
                                          placeholder={state.nombreRemitente}
                                          readOnly={state.agregar == "Consultar"}
                                          id="nombreRemitente"
                                          disabled="disabled"
                                        />
                                      </div>
                                    </div>

                                    <div className="col-md-4 unit">
                                      <label className="label">
                                        RFC
                        </label>
                                      <div className="input">
                                        <input
                                          onChange={handleChange}
                                          className="form-control"
                                          type="text"
                                          placeholder={state.RFCRemitente}
                                          readOnly={state.agregar == "Consultar"}
                                          id="RFCRemitente"
                                          disabled="disabled"
                                        />
                                      </div>
                                    </div>

                                    <div className="col-md-4 unit">
                                      <label className="label">
                                        Domicilio
                        </label>
                                      <div className="input">
                                        <input
                                          onChange={handleChange}
                                          className="form-control"
                                          type="text"
                                          placeholder={state.domicilioRemitente}
                                          readOnly={state.agregar == "Consultar"}
                                          id="domicilioRemitente"
                                          disabled="disabled"
                                        />
                                      </div>
                                    </div>

                                    <div className="col-md-4 unit">
                                      <label className="label">
                                        Código Postal
                        </label>
                                      <div className="input">
                                        <input
                                          onChange={handleChange}
                                          className="form-control"
                                          type="text"
                                          placeholder={state.codigoPostalRemitente}
                                          readOnly={state.agregar == "Consultar"}
                                          id="codigoPostalRemitente"
                                          disabled="disabled"
                                        />
                                      </div>
                                    </div>

                                    <div className="col-md-4 unit">
                                      <label className="label">
                                        Ciudad
                        </label>
                                      <div className="input">
                                        <input
                                          onChange={handleChange}
                                          className="form-control"
                                          type="text"
                                          placeholder={state.ciudadRemitente}
                                          readOnly={state.agregar == "Consultar"}
                                          id="ciudadRemitente"
                                          disabled="disabled"
                                        />

                                      </div>
                                    </div>

                                    <div className="col-md-4 unit">
                                      <label className="label">
                                        Correo Electrónico
                        </label>
                                      <div className="input">
                                        <input
                                          onChange={handleChange}
                                          className="form-control"
                                          type="text"
                                          placeholder={state.correoRemitente}
                                          readOnly={state.agregar == "Consultar"}
                                          id="correoRemitente"
                                          disabled="disabled"
                                        />
                                      </div>
                                    </div>

                                    <div className="col-md-4 unit">
                                      <label className="label">
                                        Teléfono
                        </label>
                                      <div className="input">
                                        <input
                                          onChange={handleChange}
                                          className="form-control"
                                          type="text"
                                          placeholder={state.telefonoRemitente}
                                          readOnly={state.agregar == "Consultar"}
                                          id="telefonoRemitente"
                                          disabled="disabled"
                                        />
                                      </div>
                                    </div>

                                    <div className="col-md-4 unit">
                                      <label className="label">
                                        Contacto
                        </label>
                                      <div className="input">
                                        <input
                                          onChange={handleChange}
                                          className="form-control"
                                          type="text"
                                          placeholder={state.contactoRemitente}
                                          readOnly={state.agregar == "Consultar"}
                                          id="contactoRemitente"
                                          disabled="disabled"
                                        />
                                      </div>
                                    </div>

                                    <div className="col-md-4 unit">
                                      <label className="label">
                                        Origen
                        </label>
                                      <div className="input">
                                        <input
                                          onChange={handleChange}
                                          className="form-control"
                                          type="text"
                                          placeholder={state.origenRemitente}
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
                                      <label className="label">
                                        Nombre
                      </label>
                                      <div className="input">
                                        <input
                                          onChange={handleChange}
                                          className="form-control"
                                          type="text"
                                          placeholder={state.sNombreDestinatario}
                                          readOnly={state.agregar == "Consultar"}
                                          id="sNombreDestinatario"
                                          disabled="disabled"
                                        />
                                      </div>
                                    </div>

                                    <div className="col-md-4 unit">
                                      <label className="label">
                                        RFC
                      </label>
                                      <div className="input">
                                        <input
                                          onChange={handleChange}
                                          className="form-control"
                                          type="text"
                                          placeholder={state.sRFCDestinatario}
                                          readOnly={state.agregar == "Consultar"}
                                          id="sRFCDestinatario"
                                          disabled="disabled"
                                        />
                                      </div>
                                    </div>

                                    <div className="col-md-4 unit">
                                      <label className="label">
                                        Domicilio
                      </label>
                                      <div className="input">
                                        <input
                                          onChange={handleChange}
                                          className="form-control"
                                          type="text"
                                          placeholder={state.sDomicilioDestinatario}
                                          readOnly={state.agregar == "Consultar"}
                                          id="sDomicilioDestinatario"
                                          disabled="disabled"
                                        />
                                      </div>
                                    </div>

                                    <div className="col-md-4 unit">
                                      <label className="label">
                                        Código Postal
                      </label>
                                      <div className="input">
                                        <input
                                          onChange={handleChange}
                                          className="form-control"
                                          type="text"
                                          placeholder={state.idCodigoPostalDestinatario}
                                          readOnly={state.agregar == "Consultar"}
                                          id="idCodigoPostalDestinatario"
                                          disabled="disabled"
                                        />
                                      </div>
                                    </div>

                                    <div className="col-md-4 unit">
                                      <label className="label">
                                        Ciudad
                      </label>
                                      <div className="input">
                                        <input
                                          onChange={handleChange}
                                          className="form-control"
                                          type="text"
                                          placeholder={state.ciudadDestinatario}
                                          readOnly={state.agregar == "Consultar"}
                                          id="ciudadDestinatario"
                                          disabled="disabled"
                                        />
                                      </div>
                                    </div>

                                    <div className="col-md-4 unit">
                                      <label className="label">
                                        Correo Electrónico
                      </label>
                                      <div className="input">
                                        <input
                                          onChange={handleChange}
                                          className="form-control"
                                          type="text"
                                          placeholder={state.sCorreoDestinatario}
                                          readOnly={state.agregar == "Consultar"}
                                          id="sCorreoDestinatario"
                                          disabled="disabled"
                                        />
                                      </div>
                                    </div>

                                    <div className="col-md-4 unit">
                                      <label className="label">
                                        Teléfono
                      </label>
                                      <div className="input">
                                        <input
                                          onChange={handleChange}
                                          className="form-control"
                                          type="text"
                                          placeholder={state.sTelefonoDestinatario}
                                          readOnly={state.agregar == "Consultar"}
                                          id="sTelefonoDestinatario"
                                          disabled="disabled"
                                        />
                                      </div>
                                    </div>

                                    <div className="col-md-4 unit">
                                      <label className="label">
                                        Contacto
                      </label>
                                      <div className="input">
                                        <input
                                          onChange={handleChange}
                                          className="form-control"
                                          type="text"
                                          placeholder={state.sContactoDestinatario}
                                          readOnly={state.agregar == "Consultar"}
                                          id="sContactoDestinatario"
                                          disabled="disabled"
                                        />
                                      </div>
                                    </div>

                                    <div className="col-md-4 unit">
                                      <label className="label">
                                        Destino
                      </label>
                                      <div className="input">
                                        <input
                                          onChange={handleChange}
                                          className="form-control"
                                          type="text"
                                          placeholder={state.CiudadDestino}
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
                                      <label className="label">
                                        Tipo Cobro
                          </label>
                                      <select
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
                                      </select>
                                    </div>
                                    <div className="col-sm-4 col-md-2-5">
                                      <label className="label">
                                        Tipo Servicio
                                </label>
                                      <select
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
                                      </select>
                                    </div>
                                    <div className="col-sm-4 col-md-2-5">
                                      <label className="label">
                                        Valor Declarado
                          </label>
                                      <div className="input">
                                        <input
                                          onChange={handleChange}
                                          className="form-control"
                                          type="text"
                                          placeholder={state.ValorDeclarado}
                                          readonly={state.agregar == "Consultar"}
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
                              <div className="form-content">
                                <a
                                  className="btn"
                                  style={{ margin: "10px" }}
                                  onClick={() => addConcepto()}
                                >
                                  <i className="zmdi zmdi-plus"></i> Agregar Concepto
                        </a>

                                <div style={{ padding: "20px" }}>
                                  <Carousel
                                    className={classes2.conceptoCarrusel}
                                    widgets={[IndicatorDots, Buttons]}
                                    frames={framesConcepto}
                                  ></Carousel>
                                </div>
                              </div>
                            </form>
                          </div>

                          <div className="form-footer" className="col-md-12">

                            <button data-layout="topCenter" data-type="information" className="btn btn-secondary secondary-btn"
                            >
                              Cancelar</button>
                            <button onClick={handleAceptar} className="btn btn-primary primary-btn">Aceptar</button>
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
                              <input
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
                          <button data-layout="topCenter" data-type="information" className="btn btn-secondary secondary-btn"
                          >
                            Cancelar</button>
                          <button onClick={handleAceptar} className="btn btn-primary primary-btn">Aceptar</button>
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