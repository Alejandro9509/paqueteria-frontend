import React, { useEffect, useState, useMemo, useCallback } from "react";
import axios from "axios";
import Cabecera from "../Components/Template/Cabecera";
import BarraLateralIzquierda from "../Components/Template/BarraLateralIzquierda";
import BarraLateralDerecha from "../Components/Template/BarraLateralDerecha";
import ExportCSV from "../Components/Template/Export";
import ExportPDF from "../Components/Template/ExportPDF";
import Carousel from "re-carousel";
import IndicatorDots from "../Util/Dots";
import Buttons from "../Util/CarruselButtons";
import { makeStyles } from "@material-ui/core/styles";
import * as XLSX from "xlsx";
import useModal from "react-hooks-use-modal";
import IconButton from "@material-ui/core/IconButton";
import SearchIcon from "@material-ui/icons/Search";
import PageviewIcon from "@material-ui/icons/Pageview";
import Autocomplete from "@material-ui/lab/Autocomplete";
import TextField from "@material-ui/core/TextField";

import InputAdornment from "@material-ui/core/InputAdornment";

import {
  useTable,
  useFilters,
  useAsyncDebounce,
  useSortBy,
} from "react-table";
import $ from "jquery";
import { remove_array_element } from "../Util/Util";
import { useHistory, Redirect } from 'react-router-dom';

import Noty from 'noty';
import { Dialog, DialogActions, DialogContent, DialogTitle } from "@material-ui/core";

let timer;

function showSuccess(mensaje) {
  new Noty({
    type: "information",
    layout: "topCenter",
    text: mensaje,
    timeout: "3000"
  }).show()
}

window.jQuery = window.$ = $;

const useStyles = makeStyles({
  myComponent: {
    "& .MuiIconButton-root": {
      padding: 0,
    },
  },
  paqueteCarrusel: {
    height: "400px !important",
  },
  sobreCarrusel: {
    height: "175px !important",
  }, seleccionado: {
    backgroundColor: "#FCC88F",
  },
  noSeleccionado: {
    backgroundColor: "#FFFFFF",
  },
  disabled: {
    pointerEvents: "none",
    cursor: "default",
  }
});
function Recoleccion() {
  const today = new Date();
  const classes = useStyles();
  const [redirect, setRedirect] = React.useState(false);
  const [data, setData] = React.useState([]);
  const [dataSucursal, setDataSucursal] = React.useState([]);
  const [dataEstatusRecoleccion, setEstatusRecoleccion] = React.useState([]);
  const [dataTipoMoneda, setDataTipoMoneda] = React.useState([]);
  const [dataTipoCobro, setDataTipoCobro] = React.useState([]);
  const [dataCiudad, setDataCiudad] = React.useState([]);
  const [dataZona, setDataZona] = React.useState([]);

  const [dataCodigoPostal, setDataCodigoPostal] = React.useState([]);
  const [dataRemitenteDestinatario, setDataRemitenteDestinatario] = React.useState([]);
  const [dataEmbalaje, setDataEmbalaje] = React.useState([]);
  const [dataOperador, setDataOperador] = React.useState([]);
  const [dataTipoUnidad, setDataTipoUnidad] = React.useState([]);
  const [dataUnidad, setDataUnidad] = React.useState([]);
  const [state, setState] = React.useState({
    shouldOpenList: false,
    showPopUp: false,
    showDialog: false,
    identificadorModal: "",
    tipoModal: 0,
    DerechoBorrar: 133,
    agregar: "Agregar",
    idRecoleccion: 0,
    fechaInicial: "0",
    fechaFinal: (today.getMonth() + 1) + "-" + today.getDate() + "-" + today.getFullYear(),
    sucursalListado: 0,
    estatusListado: 0,
    idSucursalAgregar: localStorage.getItem("Sucursal"),
    folioRecoleccion: "",
    folioEmbarque: "",
    folioGuía: "",
    folioInforme: "",
    fechaHoraCreacion: "",
    estatusRecoleccion: 0,
    moneda: "",
    tipoCambio: "",
    tipoCobro: "",
    nombreRemitente: {},
    RFCRemitente: "",
    domicilioRemitente: "",
    codigoPostalRemitente: {},
    ciudadRemitente: 0,
    correoRemitente: "",
    telefonoRemitente: "",
    contactoRemitente: "",
    origenRemitente: 0,
    nombreDestinatario: {},
    RFCDestinatario: "",
    domicilioDestinatario: "",
    codigoPostalDestinatario: 0,
    ciudadDestinatario: 0,
    correoDestinatario: "",
    telefonoDestinatario: "",
    contactoDestinatario: "",
    destinoDestinatario: 0,
    ciudadRemitente: 0,
    fechaRecoleccion: "",
    codigoPostalRecoleccion: 0,
    ciudadRecoleccion: 0,
    zonaRecoleccion: 0,
    domicilioRecoleccion: "",
    recogerEn: "",
    datosAdicionalesRecoleccion: "",
    codigoPostalEntrega: "",
    ciudadEntrega: 0,
    zonaEntrega: 0,
    domicilioEntrega: "",
    entregaEn: "",
    datosAdicionalesEntrega: "",
    cantidadDePaquetes: 0,
    cantidadDeSobres: 0,
    diferenteRecoleccion: true,
    diferenteEntrega: true,
    operador: 0,
    tipoUnidad: {},
    unidad: 0,
    CreadoPor: localStorage.getItem("UsuarioId"),
    ModificadoPor: localStorage.getItem("UsuarioId"),
    mismoPaquete: false,
    mismoSobre: false,
    paquetes: [
      {
        m_rPeso: "",
        m_rLargo: "",
        m_rAncho: "",
        m_rAlto: "",
        m_rVolumen: "",
        m_nIdTipoEmbalaje: "",
        m_cyValorDeclarado: "",
        m_sDescripcion: "",
        m_nCantidad: "",
        m_sObservaciones: "",
      },
    ],
    sobres: [
      {
        m_sDescripcion: "",
      },
    ],
    fechaHoraSalida: "",
    fechaHoraLlegada: "",
    sucursalCancelacion: "",
    motivoCancelacion: "",
    fechaCancelacion: "",
    usuario: localStorage.getItem("Usuario"),
    height: window.innerHeight,
  });
  const [fileUploaded, setFileUploaded] = React.useState([]);
  const [stepActive, setStepActive] = React.useState(1);
  const [Modal, open, close, isOpen] = useModal("root", {
    preventScroll: true,
  });

  const history = useHistory()



  function handleSelectRemitente() {
    state.RFCRemitente = state.nombreRemitente.m_sRFC
    //state.domicilioRemitente = state.nombreRemitente.m_sNombreCompletoOperador
    //state.codigoPostalRemitente = state.nombreRemitente.m_sCodigoPostal
    //state.correoRemitente = state.nombreRemitente.m_sCorreoElectronico
    //state.telefonoRemitente = state.nombreRemitente.m_sTelefono
    //state.contactoRemitente = state.nombreRemitente.m_sContacto

  }

  function handleSelectDestinatario() {
    state.RFCDestinatario = state.nombreDestinatario.m_sRFC
    //state.domicilioDestinatario = state.nombreDestinatario.m_sNombreCompletoOperador
    //state.codigoPostalDestinatario= state.nombreDestinatario.m_sCodigoPostal
    //state.correoDestinatario= state.nombreDestinatario.m_sCorreoElectronico
    //state.telefonoDestinatario = state.nombreDestinatario.m_sTelefono
    //state.contactoDestinatario = state.nombreDestinatario.m_sContacto

  }

  const handleAceptar = (e) => {
    e.preventDefault();
    var params = {

      "m_nIdRecoleccion": state.idRecoleccion,
      "m_nIdSucursal": state.idSucursalAgregar,
      "m_nIdEstatusRecoleccion": state.estatusRecoleccion,
      "m_nIdEmbarque": state.folioEmbarque,
      "m_nIdGuia": state.folioGuía,
      "m_nIdInforme": state.folioInforme,
      "m_dFecha": state.fechaHoraCreacion.split("T")[0],
      "m_tHora": state.fechaHoraCreacion.split("T")[1],
      "m_nMoneda": state.moneda,
      "m_rTipoCambio": state.tipoCambio,
      "m_nIdTipoDeCobro": state.tipoCobro,
      "m_sNombreRemitente": state.nombreRemitente.m_sNombreFiscal,
      "m_sNombreDestinatario": state.nombreDestinatario.m_sNombreFiscal,
      "m_sRFCRemitente": state.RFCRemitente,
      "m_sRFCDestinatario": state.RFCDestinatario,
      "m_sDomicilioRemitente": state.domicilioRemitente,
      "m_sDomicilioDestinatario": state.domicilioDestinatario,
      "m_sIdCodigoPostalRemitente": state.codigoPostalRemitente.m_nIdCP,
      "m_sIdCodigoPostalDestinatario": state.codigoPostalDestinatario.m_nIdCP,
      "m_nIdCiudadRemitente": state.ciudadRemitente,
      "m_nIdCiudadDestinatario": state.ciudadDestinatario,
      "m_sCorreoRemitente": state.correoRemitente,
      "m_sCorreoDestinatario": state.correoDestinatario,
      "m_sTelefonoRemitente": state.telefonoRemitente,
      "m_sTelefonoDestinatario": state.telefonoDestinatario,
      "m_sContactoRemitente": state.contactoRemitente,
      "m_sContactoDestinatario": state.contactoDestinatario,
      "m_nIdCiudadOrigen": state.origenRemitente.m_nIdCiudad,
      "m_nIdCiudadDestino": state.destinoDestinatario.m_nIdCiudad,
      "m_dFechaDetalleRecoleccion": state.fechaRecoleccion.split("T")[0],
      "m_tHoraDetalleRecoleccion": state.fechaRecoleccion.split("T")[1],
      "m_nIdCPDetalleRecoleccion": state.codigoPostalRecoleccion.m_nIdCP,
      "m_nIdCiudadDetalleRecoleccion": state.ciudadRecoleccion,
      "m_nIdZonaDetalleRecoleccion": state.zonaRecoleccion,
      "m_sDomicilioDetalleRecoleccion": state.domicilioRecoleccion,
      "m_sRecogerEnDetalleRecoleccion": state.recogerEn,
      "m_sDatosAdicionalesDetalleRecoleccion": state.datosAdicionalesRecoleccion,
      "m_nIdCPDetalleEntrega": state.codigoPostalEntrega.m_nIdCP,
      "m_nIdCiudadDetalleEntrega": state.ciudadEntrega,
      "m_nIdZonaDetalleEntrega": state.zonaEntrega,
      "m_sDomicilioDetalleEntrega": state.domicilioEntrega,
      "m_sEntregarEnDetalleEntrega": state.entregaEn,
      "m_sDatosAdicionalesDetalleEntrega": state.datosAdicionalesEntrega,
      "m_dFechaSalida": state.fechaHoraSalida.split("T")[0],
      "m_dFechaLlegada": state.fechaHoraLlegada.split("T")[0],
      "m_tHoraSalida": state.fechaHoraSalida.split("T")[1],
      "m_tHoraLlegada": state.fechaHoraLlegada.split("T")[1],
      "m_parrPaquetes": state.paquetes,
      "m_nNoPaquetes": state.paquetes.length,
      "m_parrSobres": state.sobres,
      "m_nNoSobres": state.sobres.length,
      "m_nIdOperador": state.operador.m_nIdOperador,
      "m_nIdUnidad": state.unidad.m_nIdUnidad,
      "m_nIdRemolque": state.unidad.m_nIdUnidad,
      "m_nCreadoPor": state.CreadoPor,
      "m_nModificadoPor": state.ModificadoPor

    }
    console.log(params)
    if (state.idRecoleccion != 0) {
      const url = `${process.env.REACT_APP_API_URL}/Recoleccion/Modificar/${state.idRecoleccion}`;
      axios
        .put(url, Object.assign({}, params), { headers })
        .then((respuesta) => {
          showSuccess(respuesta.data);
          getAllData();
        })
        .catch((err) => {
          console.log(err);
          showSuccess("err");
        });
    } else {
      debugger;
      const url = `${process.env.REACT_APP_API_URL}/Recoleccion/Agregar`;
      axios
        .post(url, Object.assign({}, params), { headers })
        .then((respuesta) => {
          console.log(respuesta.data);
          showSuccess(respuesta.data);
          getAllData();
        })
        .catch((err) => {
          console.log(err);
          showSuccess(err);
        });
    }
  };

  function handleSelectCP(id, dobleClick, e) {
    clearTimeout(timer);
    if (e.detail === 1) {
      timer = setTimeout(() => {
        setState({
          ...state,
          [state.identificadorModal]: id,
          openDialog: true
        })
      }, 200)
    } else if (e.detail === 2) {
      setState({
        ...state,
        [state.identificadorModal]: id,
        openDialog: false
      });
    }

    console.log(dobleClick);
  }

  function handleShowCancelar() {
    const url = `${process.env.REACT_APP_API_URL}/Recoleccion/GetCancelarById/${state.idRecoleccion}`;
    axios.get(url, { headers }).then((respuesta) => {
      setState({
        ...state,
        folioRecoleccion: respuesta.data.m_sFolioRecoleccion,
        sucursalCancelacion: dataSucursal.find(o => o.m_nIdSucursal == respuesta.data.m_nIdSucursal).m_sSucursal,
        fechaCancelacion: today.getDate() + "/" + (today.getMonth() + 1) + "/" + today.getFullYear() + " " + today.getHours() + ":" + today.getMinutes(),
        estatusRecoleccion: dataEstatusRecoleccion.find(o => o.m_nIdEstatusRecoleccion == respuesta.data.m_nIdEstatusRecoleccion).m_sEstatus,
        motivoCancelacion: respuesta.data.m_sMotivoCancelacion
      })
      console.log(respuesta.data)
      if (respuesta.data.m_nSePuedeCancelar == 0)
        showSuccess("Recolección no se puede cancelar")
    })
  }

  const handleCancelar = (e) => {
    e.preventDefault();
    var params = {
      "motivoCancelacion": state.motivoCancelacion,
      "usuarioCancelacion": localStorage.getItem("UsuarioId"),
      "fechaCancelacion": state.fechaCancelacion
    }
    const url = `${process.env.REACT_APP_API_URL}/Recoleccion/Cancelar/${state.idRecoleccion}`;
    axios.put(url, Object.assign({}, params), { headers }).then((respuesta) => {
      showSuccess(respuesta.data)
    })
  }

  function addPaquete(index) {
    const { paquetes } = state;
    if (state.mismoPaquete) {
      var paquete = paquetes[index]
      paquetes.push(paquete)
    } else {
      paquetes.push({
        m_rPeso: "",
        m_rLargo: "",
        m_rAncho: "",
        m_rAlto: "",
        m_rVolumen: "",
        m_nIdTipoEmbalaje: "",
        m_cyValorDeclarado: "",
        m_sDescripcion: "",
        m_nCantidad: "",
        m_sObservaciones: "",
      });
    }
    console.log(paquetes);
    setState({ ...state, paquetes: paquetes });
  }

  function removePaquete(index) {
    var { paquetes } = state;
    paquetes = remove_array_element(paquetes, index);
    console.log(paquetes);
    setState({ ...state, paquetes: paquetes });
  }

  function addSobre(index) {
    const { sobres } = state;
    if (state.mismoSobre) {
      var sobre = sobres[index]
      sobres.push(sobre)
    } else {
      sobres.push({
        descripcion: "",
      });
    }
    console.log(sobres);
    setState({ ...state, sobres: sobres });
  }

  function removeSobre(index) {
    var { sobres } = state;
    sobres = remove_array_element(sobres, index);
    console.log(sobres);
    setState({ ...state, sobres: sobres });
  }

  function handleEliminar(id) {
    var derecho;
    const urlDelete = `${process.env.REACT_APP_API_URL}/Utilerias/ValidaDerechos/${state.CreadoPor}/${state.DerechoBorrar}/3`;
    axios
      .get(urlDelete, { headers })
      .then((respuesta) => {
        //showSuccess(respuesta.data)

        derecho = respuesta.data;
        if (derecho == false) {
          showSuccess("El usuario no tiene derechos para realizar el proceso");
          return;
        }

        const url =
          `${process.env.REACT_APP_API_URL}/Recoleccion/Eliminar/` + id;
        axios
          .delete(url, { headers })
          .then((respuesta) => {
            showSuccess(respuesta.data);
            getAllData();
          })
          .catch((err) => {
            showSuccess(err);
          });
      })
      .catch((err) => {
        showSuccess(err);
      });
  }

  function handleShowModificar(id) {
    console.log(id);
    const url = `${process.env.REACT_APP_API_URL}/Recoleccion/GetById/${id}`;
    axios.get(url, { headers }).then((respuesta) => {
      console.log(respuesta.data);
      setState({
        ...state,
        agregar: "Modificar",
        idRecoleccion: id,
        idSucursalAgregar: respuesta.data.m_nIdSucursal,
        folioRecoleccion: respuesta.data.m_sFolioRecoleccion,
        folioEmbarque: respuesta.data.m_nIdEmbarque,
        folioGuía: respuesta.data.m_nIdGuia,
        folioInforme: respuesta.data.m_nIdInforme,
        fechaHoraCreacion:
          respuesta.data.m_dFecha + "T" + respuesta.data.m_tHora.slice(0, 5),
        estatusRecoleccion: respuesta.data.m_nIdEstatusRecoleccion,
        moneda: respuesta.data.m_nMoneda,
        tipoCambio: respuesta.data.m_rTipoCambio,
        tipoCobro: respuesta.data.m_nIdTipoDeCobro,
        nombreRemitente: dataRemitenteDestinatario.find((o) => o.m_sRFC == respuesta.data.m_sRFCRemitente),
        RFCRemitente: respuesta.data.m_sRFCRemitente,
        domicilioRemitente: respuesta.data.m_sDomicilioRemitente,
        codigoPostalRemitente: dataCodigoPostal.find(
          (o) => o.m_nIdCP == respuesta.data.m_sIdCodigoPostalRemitente
        ),
        ciudadRemitente: dataCiudad.find(
          (o) => o.m_nIdCiudad == respuesta.data.m_nIdCiudadRemitente
        ),
        correoRemitente: respuesta.data.m_sCorreoRemitente,
        telefonoRemitente: respuesta.data.m_sTelefonoRemitente,
        contactoRemitente: respuesta.data.m_sContactoRemitente,
        origenRemitente: dataCiudad.find(
          (o) => o.m_nIdCiudad == respuesta.data.m_nIdCiudadOrigen
        ),
        nombreDestinatario: dataRemitenteDestinatario.find((o) => o.m_sRFC == respuesta.data.m_sRFCDestinatario),
        RFCDestinatario: respuesta.data.m_sRFCDestinatario,
        domicilioDestinatario: respuesta.data.m_sDomicilioDestinatario,
        tipoUnidad: dataTipoUnidad.find(o => o.m_nIdTipoUnidad == (dataUnidad.find(o => o.m_nIdUnidad == respuesta.data.m_nIdUnidad)).m_nIdTipoUnidad),
        unidad: dataUnidad.find(
          (o) => o.m_nIdUnidad == respuesta.data.m_nIdUnidad
        ),
        operador: dataOperador.find(
          (o) => o.m_nIdOperador == respuesta.data.m_nIdOperador
        ),
        codigoPostalDestinatario: dataCodigoPostal.find(
          (o) => o.m_nIdCP == respuesta.data.m_sIdCodigoPostalDestinatario
        ),
        ciudadDestinatario: dataCiudad.find(
          (o) => o.m_nIdCiudad == respuesta.data.m_nIdCiudadDestinatario
        ),
        correoDestinatario: respuesta.data.m_sCorreoDestinatario,
        telefonoDestinatario: respuesta.data.m_sTelefonoDestinatario,
        contactoDestinatario: respuesta.data.m_sContactoDestinatario,
        destinoDestinatario: dataCiudad.find(
          (o) => o.m_nIdCiudad == respuesta.data.m_nIdCiudadDestino
        ),
        codigoPostalRecoleccion: dataCodigoPostal.find(
          (o) => o.m_nIdCP == respuesta.data.m_nIdCPDetalleRecoleccion
        ),
        ciudadRecoleccion: respuesta.data.m_nIdCiudadDetalleRecoleccion,
        zonaRecoleccion: respuesta.data.m_nIdZonaDetalleRecoleccion,
        domicilioRecoleccion: respuesta.data.m_sDomicilioDetalleRecoleccion,
        recogerEn: respuesta.data.m_sRecogerEnDetalleRecoleccion,
        datosAdicionalesRecoleccion:
          respuesta.data.m_sDatosAdicionalesDetalleRecoleccion,
        codigoPostalEntrega: dataCodigoPostal.find(
          (o) => o.m_nIdCP == respuesta.data.m_nIdCPDetalleEntrega
        ),
        ciudadEntrega: respuesta.data.m_nIdCiudadDetalleEntrega,
        zonaEntrega: respuesta.data.m_nIdZonaDetalleEntrega,
        domicilioEntrega: respuesta.data.m_sDomicilioDetalleEntrega,
        entregaEn: respuesta.data.m_sEntregarEnDetalleEntrega,
        datosAdicionalesEntrega:
          respuesta.data.m_sDatosAdicionalesDetalleEntrega,
        fechaHoraSalida:
          respuesta.data.m_dFechaElaboracionSalidaRecoleccion +
          "T" +
          respuesta.data.m_tHoraElaboracionSalidaRecoleccion.slice(0, 5),
        fechaHoraLlegada:
          respuesta.data.m_dFechaElaboracionLlegadaRecoleccion +
          "T" +
          respuesta.data.m_tHoraElaboracionLlegadaRecoleccion.slice(0, 5),
        fechaRecoleccion:
          respuesta.data.m_dFechaDetalleRecoleccion +
          "T" +
          respuesta.data.m_tHoraDetalleRecoleccion.slice(0, 5),
        paquetes: respuesta.data.m_parrPaquetes,
        sobres: respuesta.data.m_parrSobres,
        cantidadDePaquetes: respuesta.data.m_parrPaquetes.length,
        cantidadDeSobres: respuesta.data.m_parrSobres.length,
      });
    });
  }

  function handleShowConsultar(id) {
    console.log(id);
    const url = `${process.env.REACT_APP_API_URL}/Recoleccion/GetById/${id}`;
    axios.get(url, { headers }).then((respuesta) => {
      console.log(respuesta.data);
      setState({
        ...state,
        agregar: "Consultar",
        idRecoleccion: id,
        idSucursalAgregar: respuesta.data.m_nIdSucursal,
        folioRecoleccion: respuesta.data.m_sFolioRecoleccion,
        folioEmbarque: respuesta.data.m_nIdEmbarque,
        folioGuía: respuesta.data.m_nIdGuia,
        folioInforme: respuesta.data.m_nIdInforme,
        fechaHoraCreacion:
          respuesta.data.m_dFecha + "T" + respuesta.data.m_tHora.slice(0, 5),
        estatusRecoleccion: respuesta.data.m_nIdEstatusRecoleccion,
        moneda: respuesta.data.m_nMoneda,
        tipoCambio: respuesta.data.m_rTipoCambio,
        tipoCobro: respuesta.data.m_nIdTipoDeCobro,
        nombreRemitente: dataRemitenteDestinatario.find((o) => o.m_sRFC == respuesta.data.m_sRFCRemitente),
        RFCRemitente: respuesta.data.m_sRFCRemitente,
        domicilioRemitente: respuesta.data.m_sDomicilioRemitente,
        codigoPostalRemitente: dataCodigoPostal.find(
          (o) => o.m_nIdCP == respuesta.data.m_sIdCodigoPostalRemitente
        ),
        ciudadRemitente: dataCiudad.find(
          (o) => o.m_nIdCiudad == respuesta.data.m_nIdCiudadRemitente
        ),
        correoRemitente: respuesta.data.m_sCorreoRemitente,
        telefonoRemitente: respuesta.data.m_sTelefonoRemitente,
        contactoRemitente: respuesta.data.m_sContactoRemitente,
        origenRemitente: dataCiudad.find(
          (o) => o.m_nIdCiudad == respuesta.data.m_nIdCiudadOrigen
        ),
        nombreDestinatario: dataRemitenteDestinatario.find((o) => o.m_sRFC == respuesta.data.m_sRFCDestinatario),
        RFCDestinatario: respuesta.data.m_sRFCDestinatario,
        domicilioDestinatario: respuesta.data.m_sDomicilioDestinatario,
        tipoUnidad: dataTipoUnidad.find(o => o.m_nIdTipoUnidad == (dataUnidad.find(o => o.m_nIdUnidad == respuesta.data.m_nIdUnidad)).m_nIdTipoUnidad),
        unidad: dataUnidad.find(
          (o) => o.m_nIdUnidad == respuesta.data.m_nIdUnidad
        ),
        operador: dataOperador.find(
          (o) => o.m_nIdOperador == respuesta.data.m_nIdOperador
        ),
        codigoPostalDestinatario: dataCodigoPostal.find(
          (o) => o.m_nIdCP == respuesta.data.m_sIdCodigoPostalDestinatario
        ),
        ciudadDestinatario: dataCiudad.find(
          (o) => o.m_nIdCiudad == respuesta.data.m_nIdCiudadDestinatario
        ),
        correoDestinatario: respuesta.data.m_sCorreoDestinatario,
        telefonoDestinatario: respuesta.data.m_sTelefonoDestinatario,
        contactoDestinatario: respuesta.data.m_sContactoDestinatario,
        destinoDestinatario: dataCiudad.find(
          (o) => o.m_nIdCiudad == respuesta.data.m_nIdCiudadDestino
        ),
        codigoPostalRecoleccion: dataCodigoPostal.find(
          (o) => o.m_nIdCP == respuesta.data.m_nIdCPDetalleRecoleccion
        ),
        ciudadRecoleccion: respuesta.data.m_nIdCiudadDetalleRecoleccion,
        zonaRecoleccion: respuesta.data.m_nIdZonaDetalleRecoleccion,
        domicilioRecoleccion: respuesta.data.m_sDomicilioDetalleRecoleccion,
        recogerEn: respuesta.data.m_sRecogerEnDetalleRecoleccion,
        datosAdicionalesRecoleccion:
          respuesta.data.m_sDatosAdicionalesDetalleRecoleccion,
        codigoPostalEntrega: dataCodigoPostal.find(
          (o) => o.m_nIdCP == respuesta.data.m_nIdCPDetalleEntrega
        ),
        ciudadEntrega: respuesta.data.m_nIdCiudadDetalleEntrega,
        zonaEntrega: respuesta.data.m_nIdZonaDetalleEntrega,
        domicilioEntrega: respuesta.data.m_sDomicilioDetalleEntrega,
        entregaEn: respuesta.data.m_sEntregarEnDetalleEntrega,
        datosAdicionalesEntrega:
          respuesta.data.m_sDatosAdicionalesDetalleEntrega,
        fechaHoraSalida:
          respuesta.data.m_dFechaElaboracionSalidaRecoleccion +
          "T" +
          respuesta.data.m_tHoraElaboracionSalidaRecoleccion.slice(0, 5),
        fechaHoraLlegada:
          respuesta.data.m_dFechaElaboracionLlegadaRecoleccion +
          "T" +
          respuesta.data.m_tHoraElaboracionLlegadaRecoleccion.slice(0, 5),
        fechaRecoleccion:
          respuesta.data.m_dFechaDetalleRecoleccion +
          "T" +
          respuesta.data.m_tHoraDetalleRecoleccion.slice(0, 5),
        paquetes: respuesta.data.m_parrPaquetes,
        sobres: respuesta.data.m_parrSobres,
        cantidadDePaquetes: respuesta.data.m_parrPaquetes.length,
        cantidadDeSobres: respuesta.data.m_parrSobres.length,
      });
      console.log("tipoUnidad:")
      console.log(dataTipoUnidad)
    });
  }

  function handleShowAgregar() {
    setState({
      ...state,
      agregar: "Agregar",
      idRecoleccion: 0,
      folioRecoleccion: "",
      folioEmbarque: "",
      folioGuía: "",
      folioInforme: "",
      fechaHoraCreacion: today.getDate() + "/" + (today.getMonth() + 1) + "/" + today.getFullYear() + "T" + today.getHours() + ":" + today.getMinutes(),
      estatusRecoleccion: dataEstatusRecoleccion[0].m_nIdEstatusRecoleccion,
      moneda: 0,
      tipoCambio: "",
      tipoCobro: 0,
      nombreRemitente: "",
      RFCRemitente: "",
      domicilioRemitente: "",
      codigoPostalRemitente: dataCodigoPostal[0],
      ciudadRemitente: dataCiudad[0].m_nIdCiudad,
      correoRemitente: "",
      telefonoRemitente: "",
      contactoRemitente: "",
      origenRemitente: dataCiudad[0].m_nIdCiudad,
      nombreDestinatario: "",
      RFCDestinatario: "",
      domicilioDestinatario: "",
      codigoPostalDestinatario: dataCodigoPostal[0],
      ciudadDestinatario: dataCiudad[0].m_nIdCiudad,
      correoDestinatario: "",
      telefonoDestinatario: "",
      contactoDestinatario: "",
      destinoDestinatario: dataCiudad[0].m_nIdCiudad,
      ciudadRemitente: dataCiudad[0].m_nIdCiudad,
      ciudadDestinatario: dataCiudad[0].m_nIdCiudad,
      fechaRecoleccion: "",
      codigoPostalRecoleccion: dataCodigoPostal[0],
      ciudadRecoleccion: dataCiudad[0].m_nIdCiudad,
      zonaRecoleccion: 0,
      domicilioRecoleccion: "",
      recogerEn: "",
      datosAdicionalesRecoleccion: "",
      codigoPostalEntrega: dataCodigoPostal[0],
      ciudadEntrega: dataCiudad[0].m_nIdCiudad,
      zonaEntrega: 0,
      domicilioEntrega: "",
      entregaEn: "",
      datosAdicionalesEntrega: "",
      cantidadDePaquetes: 0,
      cantidadDeSobres: 0,
      operador: dataOperador[0].m_nIdOperador,
      unidad: dataUnidad[0].m_nIdUnidad,
      paquetes: [
        {
          m_rPeso: "",
          m_rLargo: "",
          m_rAncho: "",
          m_rAlto: "",
          m_rVolumen: "",
          m_nIdTipoEmbalaje: "",
          m_cyValorDeclarado: "",
          m_sDescripcion: "",
          m_nCantidad: "",
          m_sObservaciones: "",
        },
      ],
      sobres: [
        {
          m_sDescripcion: "",
        },
      ],
    });
  }

  const handleChange = (event) => {
    console.log(event.target.id + " : " + event.target.value);
    setState({
      ...state,
      [event.target.id]: event.target.value,
    });
  };

  function handleSelectRow(id, event) {
    setState({
      ...state,
      idRecoleccion: id
    });
  }

  const handleChangePaquete = (event, index) => {
    var { paquetes } = state;
    paquetes[index][event.target.name] = event.target.value;
    setState({
      ...state,
      paquetes: paquetes,
    });
  };

  const handleChangeSobre = (event, index) => {
    var { sobres } = state;
    sobres[index][event.target.name] = event.target.value;
    setState({
      ...state,
      sobres: sobres,
    });
  };

  const handleRecoleccionCheckboxChange = (event) => {
    setState({
      ...state,
      diferenteRecoleccion: !state.diferenteRecoleccion,
    });
  };

  const handleEntregaCheckboxChange = (event) => {
    setState({
      ...state,
      diferenteEntrega: !state.diferenteEntrega,
    });
  };

  const handleFechaInicialFiltro = async (event) => {
    setState({
      ...state,
      fechaInicial: event.target.value,
    })
    const url = `${process.env.REACT_APP_API_URL}/Recoleccion/GetByFiltro/` +
      event.target.value + "/" + state.fechaFinal + "/" + state.sucursalListado + "/" + state.estatusListado;
    await axios.get(url, { headers }).then(respuesta => {
      setData(respuesta.data)
    })
  }

  const handleFechaFinalFiltro = async (event) => {
    setState({
      ...state,
      fechaFinal: event.target.value,
    })
    const url = `${process.env.REACT_APP_API_URL}/Recoleccion/GetByFiltro/` +
      state.fechaInicial + "/" + event.target.value + "/" + state.sucursalListado + "/" + state.estatusListado;
    await axios.get(url, { headers }).then(respuesta => {
      setData(respuesta.data)
    })
  }

  const handleSucursalFiltro = async (event) => {
    setState({
      ...state,
      sucursalListado: event.target.value,
    })
    const url = `${process.env.REACT_APP_API_URL}/Recoleccion/GetByFiltro/` +
      state.fechaInicial + "/" + state.fechaFinal + "/" + event.target.value + "/" + state.estatusListado;
    await axios.get(url, { headers }).then(respuesta => {
      setData(respuesta.data)
    })
  }

  const handleEstatusFiltro = async (event) => {
    setState({
      ...state,
      estatusListado: event.target.value,
    })
    const url = `${process.env.REACT_APP_API_URL}/Recoleccion/GetByFiltro/` +
      state.fechaInicial + "/" + state.fechaFinal + "/" + state.sucursalListado + "/" + event.target.value;
    await axios.get(url, { headers }).then(respuesta => {
      setData(respuesta.data)
    })
  }

  const handleSelectChange = (event) => {
    getAllUnidades(event.target.value);
  };

  const columns = React.useMemo(() => [
    {
      Name: "Folio",
      accessor: "m_sFolioRecoleccion",
    },
    {
      Name: "Fecha/Hora Elaboración",
      accessor: "m_sFechaHora",
    },
    {
      Name: "Fecha/Hora Recolección",
      accessor: "m_sFechaHoraDetalleRec",
    },
    {
      Name: "Sucursal",
      accessor: "m_sSucursal",
    },
    {
      Name: "Zona Recolección",
      accessor: "m_sZonaRecoleccion",
    },
    {
      Name: "Recoger En",
      accessor: "m_sRecogerEnDetalleRecoleccion",
    },
    {
      Name: "Estatus",
      accessor: "m_sEstatusRecoleccion",
    },
    {
      Name: "Operador",
      accessor: "m_sOperador",
      width: "200px"
    },
    {
      Name: "Unidad",
      accessor: "m_sUnidad",
    },

    {
      Name: "Remolque",
      accessor: "m_sTipoRemolque",
    },
  ]);

  const columnsCP = React.useMemo(() => [
    {
      Name: "Codigo",
      accessor: "m_sCP",
    },
    {
      Name: "Estado",
      accessor: "m_sEstado",
    },
    {
      Name: "Ciudad",
      accessor: "m_sCiudad",
    },
  ]);

  const columnsCiudades = React.useMemo(() => [
    {
      Name: "Codigo",
      accessor: "m_nCodigo",
    },
    {
      Name: "Ciudad",
      accessor: "m_sCiudad",
    },
    {
      Name: "Abreviacion",
      accessor: "m_sAbreviacion",
    },
    {
      Name: "Estado",
      accessor: "m_nIdEstado",
    },
  ]);

  const columnsOperadores = React.useMemo(() => [
    {
      Name: "Numero Operador",
      accessor: "m_nNumeroOperador",
    },
    {
      Name: "Nombre",
      accessor: "m_sNombreCompleto",
    },
    {
      Name: "Sucursal",
      accessor: "m_nIdSucursal",
    },
    {
      Name: "Activo",
      accessor: "m_nIdEstado",
    },
  ]);

  const columnsTipoUnidades = React.useMemo(() => [
    {
      Name: "Tipo de unidad",
      accessor: "m_nIdTipoUnidad",
    },
    {
      Name: "Identificador",
      accessor: "m_nIdentificador",
    },
    {
      Name: "Nomenclatura",
      accessor: "m_sNomenclaturaSCT",
    },
    {
      Name: "Estatus",
      accessor: "m_bActivo",
    },
  ]);

  const columnsUnidades = React.useMemo(() => [
    {
      Name: "Descripcion",
      accessor: "m_sDescripcion",
    },
    {
      Name: "Codigo",
      accessor: "m_sCodigo",
    },
    {
      Name: "Tipo de unidad",
      accessor: "m_nIdTipoUnidad",
    },
    {
      Name: "Estatus",
      accessor: "m_bActivo",
    },
  ]);

  const columnsRemitenteDestinatarios = React.useMemo(() => [
    {
      Name: "Número",
      accessor: "m_nNumero",
    },
    {
      Name: "RFC",
      accessor: "m_sRFC",
    },
    {
      Name: "Remitente-Destinatario",
      accessor: "m_sNombre",
    },
    {
      Name: "Núm.Cliente",
      accessor: "m_nNumeroCliente",
    },
    {
      Name: "Cliente",
      accessor: "m_sNombreFiscal",
    },
  ]);

  useEffect((value) => {
    if (
      localStorage.getItem("UsuarioId") === null ||
      localStorage.getItem("UsuarioId") <= 0
    ) {
      showSuccess("Es necesario iniciar sesion para acceder a este proceso");
      window.location.replace("login");
      return;
    }
    getAllData();
    getAllSucursales();
    getAllEstatusRecoleccion();
    getAllTipoCobro();
    getAllTipoMoneda();
    getAllCiudades();
    getAllCodigosPostales();
    getAllOperadores();
    getAllTipoUnidad();
    getAllRemitentesDestinatarios();
    getAllEmbalajes();
    getAllZonas();

  }, []);

  function getAllData() {
    const url = `${process.env.REACT_APP_API_URL}/Recoleccion/GetListado`;
    axios.get(url, { headers }).then((respuesta) => {
      console.log(respuesta.data);
      setData(respuesta.data);
    });
  }


  function getAllEmbalajes() {
    const url = `${process.env.REACT_APP_API_URL}/Embalajes/GetListado`;
    axios.get(url, { headers }).then((respuesta) => {
      setDataEmbalaje(respuesta.data);
    });
  }
  function getAllSucursales() {
    const url = `${process.env.REACT_APP_API_URL}/Sucursales/GetListado`;
    axios.get(url, { headers }).then((respuesta) => {
      setDataSucursal(respuesta.data);
    });
  }

  function getAllEstatusRecoleccion() {
    const url = `${process.env.REACT_APP_API_URL}/SisEstatus/getListadoRecoleccion`;
    axios.get(url, { headers }).then((respuesta) => {
      setEstatusRecoleccion(respuesta.data);
    });
  }

  function getAllTipoCobro() {
    const url = `${process.env.REACT_APP_API_URL}/TipoCobro/GetListado`;
    axios.get(url, { headers }).then((respuesta) => {
      setDataTipoCobro(respuesta.data);
    });
  }

  function getAllTipoMoneda() {
    const url = `${process.env.REACT_APP_API_URL}/Moneda/GetListado`;
    axios.get(url, { headers }).then((respuesta) => {
      setDataTipoMoneda(respuesta.data);
    });
  }

  function getAllCiudades() {
    const url = `${process.env.REACT_APP_API_URL}/Ciudades/GetListado`;
    axios.get(url, { headers }).then((respuesta) => {
      setDataCiudad(respuesta.data);
    });
  }
  function getAllZonas() {
    const url = `${process.env.REACT_APP_API_URL}/Zonas/GetListado`;
    axios.get(url, { headers }).then((respuesta) => {
      setDataZona(respuesta.data);
    });
  }


  function getAllCodigosPostales() {
    const url = `${process.env.REACT_APP_API_URL}/CodigoPostal/GetListado`;
    axios.get(url, { headers }).then((respuesta) => {
      setDataCodigoPostal(respuesta.data);
    });
  }


  function getAllRemitentesDestinatarios() {
    const url = `${process.env.REACT_APP_API_URL}/RemitentesDestinatarios/GetListado`;
    axios.get(url, { headers }).then((respuesta) => {
      setDataRemitenteDestinatario(respuesta.data);
    });
  }

  function getAllOperadores() {
    const url = `${process.env.REACT_APP_API_URL}/Operadores/GetListado`;
    axios.get(url, { headers }).then((respuesta) => {
      setDataOperador(respuesta.data);
    });
  }

  function getAllTipoUnidad() {
    const url = `${process.env.REACT_APP_API_URL}/TiposUnidades/GetListado`;
    axios.get(url, { headers }).then((respuesta) => {
      setDataTipoUnidad(respuesta.data);
      getAllUnidades(respuesta.data[0].m_nIdTipoUnidad);
    });
  }

  function getAllUnidades(id) {
    console.log(id);
    const url = `${process.env.REACT_APP_API_URL}/Unidades/ByTipoUnidad/${id}`;
    axios.get(url, { headers }).then((respuesta) => {
      console.log(respuesta.data);
      setDataUnidad(respuesta.data);
    });
    console.log(dataUnidad);
  }

  const handleUpload = (e) => {
    e.preventDefault();

    var files = e.target.files,
      f = files[0];
    var reader = new FileReader();
    console.log(e.target.files);
    reader.onload = function (e) {
      console.log("Nothing Happened");
      var data = e.target.result;
      let readedData = XLSX.read(data, { type: "binary" });
      const wsname = readedData.SheetNames[0];
      const ws = readedData.Sheets[wsname];

      /* Convert array to json*/
      const dataParse = XLSX.utils.sheet_to_json(ws, { header: 1 });
      console.log("dataParse : " + dataParse);
      setFileUploaded(dataParse);
    };
    reader.readAsBinaryString(f);
  };

  const headers = {
    "Content-Type": "application/json",
    //    'access-control-allow-origin': '*'
  };

  function conDatos() {
    return data.length != 0;
  }

  function DefaultColumnFilter({
    column: { filterValue, preFilteredRows, setFilter },
  }) {
    const count = preFilteredRows.length;

    return (
      <input
        className="form-control"
        value={filterValue || ""}
        onChange={(e) => {
          setFilter(e.target.value || undefined);
        }}
        placeholder={`Buscar ${count} registros...`}
      />
    );
  }

  function Table({ columns, data }) {
    const defaultColumn = React.useMemo(
      () => ({
        // Default Filter UI
        Filter: DefaultColumnFilter,
      }),
      []
    );

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
        defaultColumn,
      },
      useFilters,
      useSortBy
    );

    return (
      <div className="col-md-12" style={{ overflowX: "scroll" }}>
        <table className="table tabla-listado" {...getTableProps()}>
          <thead>
            {headerGroups.map((headerGroup) => (
              <tr {...headerGroup.getHeaderGroupProps()}>
                <th style={{ verticalAlign: "top" }}>Acciones</th>
                {headerGroup.headers.map((column) => (
                  // Add the sorting props to control sorting. For this example
                  // we can add them into the header props
                  <th {...column.getHeaderProps(column.getSortByToggleProps())} style={{ width: column.render("width") }}>
                    {column.render("Name")}
                    {/* Add a sort direction indicator */}
                    <span>
                      {column.isSorted ? (
                        column.isSortedDesc ? (
                          <i className="fa fa-caret-up" />
                        ) : (
                          <i className="fa fa-caret-down" />
                        )
                      ) : (
                        ""
                      )}
                    </span>
                    <div>
                      {column.canFilter ? column.render("Filter") : null}
                    </div>
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody {...getTableBodyProps()}>
            {rows.map((row, i) => {
              prepareRow(row);
              return (
                <tr {...row.getRowProps()}
                  onClick={handleSelectRow.bind(this, row.original.m_nIdRecoleccion)}
                  className={state.idRecoleccion === row.original.m_nIdRecoleccion ? classes.seleccionado : classes.noSeleccionado}>
                  <td>
                    <div>
                      <a
                        href="#Agregar"
                        role="tab"
                        data-toggle="tab"
                        onClick={() =>
                          handleShowModificar(row.original.m_nIdRecoleccion)
                        }
                        className="btn btn-default btn-sm"
                      >
                        <i
                          className="fa fa-pencil-square-o"
                          style={{ color: "#F9A03E" }}
                        />
                      </a>
                      <a
                        href="#Agregar"
                        role="tab"
                        data-toggle="tab"
                        className="btn btn-default btn-sm"
                        onClick={() =>
                          handleShowConsultar(row.original.m_nIdRecoleccion)
                        }
                      >
                        <i className="fa fa-eye" style={{ color: "#F9A03E" }} />
                      </a>
                      <a
                        href="#"
                        className="btn btn-default btn-sm"
                        onClick={() =>
                          handleEliminar(row.original.m_nIdRecoleccion)
                        }
                      >
                        <i
                          className="zmdi zmdi-delete"
                          style={{ color: "#F30B0B" }}
                        />
                      </a>
                    </div>
                  </td>
                  {row.cells.map((cell) => {
                    return (
                      <td {...cell.getCellProps()}>{cell.render("Cell")}</td>
                    );
                  })}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    );
  }

  function TableCodigoPostal({ columns, data, select, object }) {
    const defaultColumn = React.useMemo(
      () => ({
        // Default Filter UI
        Filter: DefaultColumnFilter,
      }),
      []
    );

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
        defaultColumn,
      },
      useFilters,
      useSortBy
    );

    return (
      <div
        className="col-md-12"
        style={{ maxHeight: "300px", overflow: "auto" }}
      >
        <table className="table" {...getTableProps()}>
          <thead>
            {headerGroups.map((headerGroup) => (
              <tr {...headerGroup.getHeaderGroupProps()}>
                <th>Acciones</th>
                {headerGroup.headers.map((column) => (
                  // Add the sorting props to control sorting. For this example
                  // we can add them into the header props
                  <th {...column.getHeaderProps(column.getSortByToggleProps())}>
                    {column.render("Name")}
                    {/* Add a sort direction indicator */}
                    <span>
                      {column.isSorted ? (
                        column.isSortedDesc ? (
                          <i className="fa fa-caret-up" />
                        ) : (
                          <i className="fa fa-caret-down" />
                        )
                      ) : (
                        ""
                      )}
                    </span>
                    <div>
                      {column.canFilter ? column.render("Filter") : null}
                    </div>
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
                  <tr style={{ backgroundColor: row.original.m_nIdCP === select ? "orange" : "white" }}  {...row.getRowProps()} onClick={handleSelectCP.bind(this, row.original, false)} onDoubleClick={handleSelectCP.bind(this, row.original, true)}>
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
    );
  }

  function TableCiudades({ columns, data, select }) {
    const defaultColumn = React.useMemo(
      () => ({
        // Default Filter UI
        Filter: DefaultColumnFilter,
      }),
      []
    );

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
        defaultColumn,
      },
      useFilters,
      useSortBy
    );

    return (
      <div
        className="col-md-12"
        style={{ maxHeight: "300px", overflow: "auto" }}
      >
        <table className="table" {...getTableProps()}>
          <thead>
            {headerGroups.map((headerGroup) => (
              <tr {...headerGroup.getHeaderGroupProps()}>
                {headerGroup.headers.map(column => (
                  // Add the sorting props to control sorting. For this example
                  // we can add them into the header props
                  <th {...column.getHeaderProps(column.getSortByToggleProps())}>
                    {column.render("Name")}
                    {/* Add a sort direction indicator */}
                    <span>
                      {column.isSorted ? (
                        column.isSortedDesc ? (
                          <i className="fa fa-caret-up" />
                        ) : (
                          <i className="fa fa-caret-down" />
                        )
                      ) : (
                        ""
                      )}
                    </span>
                    <div>
                      {column.canFilter ? column.render("Filter") : null}
                    </div>
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
                  <tr style={{ backgroundColor: row.original.m_nIdCiudad === select ? "orange" : "white" }} {...row.getRowProps()} onClick={handleSelectCP.bind(this, row.original, false)} onDoubleClick={handleSelectCP.bind(this, row.original, true)}>
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
    );
  }

  function TableOperadores({ columns, data, select }) {
    const defaultColumn = React.useMemo(
      () => ({
        // Default Filter UI
        Filter: DefaultColumnFilter,
      }),
      []
    );

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
        defaultColumn,
      },
      useFilters,
      useSortBy
    );

    return (
      <div
        className="col-md-12"
        style={{ maxHeight: "300px", overflow: "auto" }}
      >
        <table className="table" {...getTableProps()}>
          <thead>
            {headerGroups.map((headerGroup) => (
              <tr {...headerGroup.getHeaderGroupProps()}>
                {headerGroup.headers.map(column => (
                  // Add the sorting props to control sorting. For this example
                  // we can add them into the header props
                  <th {...column.getHeaderProps(column.getSortByToggleProps())}>
                    {column.render("Name")}
                    {/* Add a sort direction indicator */}
                    <span>
                      {column.isSorted ? (
                        column.isSortedDesc ? (
                          <i className="fa fa-caret-up" />
                        ) : (
                          <i className="fa fa-caret-down" />
                        )
                      ) : (
                        ""
                      )}
                    </span>
                    <div>
                      {column.canFilter ? column.render("Filter") : null}
                    </div>
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
                  <tr style={{ backgroundColor: row.original.m_nIdOperador === select ? "orange" : "white" }} {...row.getRowProps()} onClick={handleSelectCP.bind(this, row.original, false)} onDoubleClick={handleSelectCP.bind(this, row.original, true)}>
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
    );
  }

  function TableTipoUnidad({ columns, data, select }) {
    const defaultColumn = React.useMemo(
      () => ({
        // Default Filter UI
        Filter: DefaultColumnFilter,
      }),
      []
    );

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
        defaultColumn,
      },
      useFilters,
      useSortBy
    );

    return (
      <div className="col-md-12">
        <table className="table" {...getTableProps()}>
          <thead>
            {headerGroups.map((headerGroup) => (
              <tr {...headerGroup.getHeaderGroupProps()}>
                {headerGroup.headers.map(column => (
                  // Add the sorting props to control sorting. For this example
                  // we can add them into the header props
                  <th {...column.getHeaderProps(column.getSortByToggleProps())}>
                    {column.render("Name")}
                    {/* Add a sort direction indicator */}
                    <span>
                      {column.isSorted ? (
                        column.isSortedDesc ? (
                          <i className="fa fa-caret-up" />
                        ) : (
                          <i className="fa fa-caret-down" />
                        )
                      ) : (
                        ""
                      )}
                    </span>
                    <div>
                      {column.canFilter ? column.render("Filter") : null}
                    </div>
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
                  <tr style={{ backgroundColor: row.original.m_nIdTipoUnidad === select ? "orange" : "white" }} {...row.getRowProps()} onClick={handleSelectCP.bind(this, row.original, false)} onDoubleClick={handleSelectCP.bind(this, row.original, true)}>
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
    );
  }

  function TableUnidad({ columns, data, select }) {
    const defaultColumn = React.useMemo(
      () => ({
        // Default Filter UI
        Filter: DefaultColumnFilter,
      }),
      []
    );

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
        defaultColumn,
      },
      useFilters,
      useSortBy
    );

    return (
      <div
        className="col-md-12"
        style={{ maxHeight: "300px", overflow: "auto" }}
      >
        <table className="table" {...getTableProps()}>
          <thead>
            {headerGroups.map((headerGroup) => (
              <tr {...headerGroup.getHeaderGroupProps()}>
                {headerGroup.headers.map(column => (
                  // Add the sorting props to control sorting. For this example
                  // we can add them into the header props
                  <th {...column.getHeaderProps(column.getSortByToggleProps())}>
                    {column.render("Name")}
                    {/* Add a sort direction indicator */}
                    <span>
                      {column.isSorted ? (
                        column.isSortedDesc ? (
                          <i className="fa fa-caret-up" />
                        ) : (
                          <i className="fa fa-caret-down" />
                        )
                      ) : (
                        ""
                      )}
                    </span>
                    <div>
                      {column.canFilter ? column.render("Filter") : null}
                    </div>
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
                  <tr style={{ backgroundColor: row.original.m_nIdUnidad === select ? "orange" : "white" }} {...row.getRowProps()} onClick={handleSelectCP.bind(this, row.origina, false)} onDoubleClick={handleSelectCP.bind(this, row.original, true)}>
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
    );
  }

  function TableRemitentesDestinatarios({ columns, data, select }) {
    const defaultColumn = React.useMemo(
      () => ({
        // Default Filter UI
        Filter: DefaultColumnFilter,
      }),
      []
    );

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
        defaultColumn,
      },
      useFilters,
      useSortBy
    );

    return (
      <div
        className="col-md-12"
        style={{ maxHeight: "300px", overflow: "auto" }}
      >
        <table className="table" {...getTableProps()}>
          <thead>
            {headerGroups.map((headerGroup) => (
              <tr {...headerGroup.getHeaderGroupProps()}>
                {headerGroup.headers.map(column => (
                  // Add the sorting props to control sorting. For this example
                  // we can add them into the header props
                  <th {...column.getHeaderProps(column.getSortByToggleProps())}>
                    {column.render("Name")}
                    {/* Add a sort direction indicator */}
                    <span>
                      {column.isSorted ? (
                        column.isSortedDesc ? (
                          <i className="fa fa-caret-up" />
                        ) : (
                          <i className="fa fa-caret-down" />
                        )
                      ) : (
                        ""
                      )}
                    </span>
                    <div>
                      {column.canFilter ? column.render("Filter") : null}
                    </div>
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
                  <tr style={{ backgroundColor: row.original.m_nIdRemitenteDestinatario === select ? "#FCC88F" : "white" }} {...row.getRowProps()} onClick={handleSelectCP.bind(this, row.original, false)} onDoubleClick={handleSelectCP.bind(this, row.original, true)}>

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
    );
  }

  function openSection(index) {
    // closeSeccions()
    var $section;
    switch (index) {
      case 1:
        setStepActive(1);
        $section = $("#informacionGeneral");
        break;
      case 2:
        setStepActive(2);
        $section = $("#remitenteDestinatario");

        break;
      case 3:
        setStepActive(3);
        $section = $("#detallesRecoleccion");

        break;
      case 4:
        setStepActive(4);
        $section = $("#paquetesSobres");
        break;
      case 5:
        setStepActive(5);
        $section = $("#detallesOperacion");
        break;

      default:
    }

    var $welem = $section
      .parentsUntil(".widget-action-bar")
      .parentsUntil(".w-action")
      .parents(".widget-header")
      .next(".widget-container");

    $welem.slideDown();
    $section.children("a").children("i").removeClass("zmdi-chevron-up");
    $section.children("a").children("i").addClass("zmdi-chevron-down");
    $("html, body").animate(
      {
        scrollTop: parseInt($section.offset().top),
      },
      200
    );

    var $welem = $section
      .parentsUntil(".widget-action-bar")
      .parentsUntil(".w-action")
      .parents(".widget-header")
      .next(".widget-container");
  }

  function closeSeccions() {
    //Cerrar todas las seciones
    var $section = $(".widget-toggle");
    $section.each(function () {
      var $welem = $(this)
        .parentsUntil(".widget-action-bar")
        .parentsUntil(".w-action")
        .parents(".widget-header")
        .next(".widget-container");
      $welem.slideUp();
      $(this).children("a").children("i").removeClass("zmdi-chevron-down");
      $(this).children("a").children("i").addClass("zmdi-chevron-up");
    });
  }

  const framesPaquete = state.paquetes.map((p, index) => {
    return (
      <div key={`paquete${index}`}>

        <div style={{ display: "flex" }}>
          <a
            className="btn"
            style={{ margin: "10px" }}
            disabled={state.agregar == "Consultar"}
            onClick={() => addPaquete(index)}
          >
            <i className="zmdi zmdi-plus"></i>
            Agregar Paquete
          </a>
          {state.agregar != "Consultar" ?
            <span>
              <label className="label">Mismo Paquete</label>
              <div className="input">
                <input
                  onChange={handleChange}
                  type="checkbox"
                  required
                  disabled={state.agregar == "Consultar"}
                  value={state.mismoPaquete}
                  id="mismoPaquete"
                />
              </div>
            </span>
            : <span></span>}
        </div>

        <div className="col-sm-4 col-md-2-5 unit">
          <label className="label">Peso</label>
          <div className="input">
            <input
              onChange={(event) => handleChangePaquete(event, index)}
              className="form-control"
              type="text"
              value={state.paquetes[index].m_rPeso}
              required
              disabled={state.agregar == "Consultar"}
              placeholder="kg"
              name="m_rPeso"
            />
          </div>
        </div>

        <div className="col-sm-4 col-md-2-5 unit">
          <label className="label">Largo</label>
          <div className="input">
            <input
              onChange={(event) => handleChangePaquete(event, index)}
              className="form-control"
              type="text"
              value={state.paquetes[index].m_rLargo}
              required
              disabled={state.agregar == "Consultar"}
              placeholder="mts"
              name="m_rLargo"
            />
          </div>
        </div>

        <div className="col-sm-4 col-md-2-5 unit">
          <label className="label">Ancho</label>
          <div className="input">
            <input
              onChange={(event) => handleChangePaquete(event, index)}
              className="form-control"
              type="text"
              value={state.paquetes[index].m_rAncho}
              required
              disabled={state.agregar == "Consultar"}
              placeholder="mts"
              name="m_rAncho"
            />
          </div>
        </div>

        <div className="col-sm-4 col-md-2-5 unit">
          <label className="label">Alto</label>
          <div className="input">
            <input
              onChange={(event) => handleChangePaquete(event, index)}
              className="form-control"
              type="text"
              value={state.paquetes[index].m_rAlto}
              required
              disabled={state.agregar == "Consultar"}
              placeholder="mts"
              name="m_rAlto"
            />
          </div>
        </div>

        <div className="col-sm-4 col-md-2-5 unit">
          <label className="label">Volumen</label>
          <div className="input">
            <input
              onChange={(event) => handleChangePaquete(event, index)}
              className="form-control"
              type="text"
              value={state.paquetes[index].m_rVolumen}
              required
              disabled={state.agregar == "Consultar"}
              placeholder="mts3"
              name="m_rVolumen"
            />
          </div>
        </div>

        <div className="col-sm-4 col-md-6 unit">
          <label className="label">Tipo de Embalaje</label>
          <label className="input select">
            <select
              className="form-control"

              value={state.paquetes[index].m_nIdTIpoEmpaque}
              disabled={state.agregar == "Consultar"}
              onChange={(event) => handleChangePaquete(event, index)}
              id="m_nIdTipoEmbalaje"
              name="m_nIdTipoEmbalaje"
            >
              {dataEmbalaje.map((embalaje) => (
                <option key={embalaje.m_nIdEmbalaje} value={embalaje.m_nIdEmbalaje}>
                  {embalaje.m_sNombre}
                </option>
              ))}
            </select>
            <i className="fa fa-arrow-down" />
          </label>
        </div>

        <div className="col-sm-4 col-md-6 unit">
          <label className="label">Valor Declarado</label>
          <div className="input">
            <input
              onChange={(event) => handleChangePaquete(event, index)}
              className="form-control"
              type="text"
              value={state.paquetes[index].m_cyValorDeclarado}
              required
              disabled={state.agregar == "Consultar"}
              placeholder="$"
              name="m_cyValorDeclarado"
            />
          </div>
        </div>

        <div className="col-sm-4 col-md-8 unit">
          <label className="label">Descripción</label>
          <div className="input">
            <input
              onChange={(event) => handleChangePaquete(event, index)}
              className="form-control"
              type="text"
              value={state.paquetes[index].m_sDescripcion}
              required
              disabled={state.agregar == "Consultar"}
              placeholder="Descripción"
              name="m_sDescripcion"
            />
          </div>
        </div>

        <div className="col-sm-4 col-md-4 unit">
          <label className="label">Ctd</label>
          <div className="input">
            <input
              onChange={(event) => handleChangePaquete(event, index)}
              className="form-control"
              type="text"
              value={state.paquetes[index].m_nCantidad}
              required
              disabled={state.agregar == "Consultar"}
              placeholder="Ctd"
              name="m_nCantidad"
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
              value={state.paquetes[index].m_sObservaciones}
              required
              disabled={state.agregar == "Consultar"}
              placeholder="Observaciones"
              name="m_sObservaciones"
            />
          </div>
        </div>
        {state.paquetes.length !== 1 && (
          <a className="btn delete" disabled={state.agregar == "Consultar"} onClick={() => removePaquete(index)}>
            <i className="zmdi zmdi-delete"></i> Eliminar Paquete
          </a>
        )}
      </div>
    );
  });

  const framesSobre = state.sobres.map((p, index) => {
    return (
      <div key={`sobre${index}`}>

        <div style={{ display: "flex", flexWrap: "wrap" }}>
          <a
            className="btn"
            style={{ margin: "10px" }}
            onClick={() => addSobre(index)}
            disabled={state.agregar == "Consultar"}
          >
            <i className="zmdi zmdi-plus"></i>
            Agregar Sobre
          </a>
          {state.agregar != "Consultar" ?
            <span>
              <label className="label">Mismo Sobre</label>
              <div className="input">
                <input
                  onChange={handleChange}
                  type="checkbox"
                  required
                  value={state.mismoSobre}
                  id="mismoSobre"
                />
              </div>
            </span>
            : <span></span>}
        </div>

        <div className="col-md-12 unit">
          <label className="label">Descripcion</label>
          <div className="input">
            <input
              onChange={(event) => handleChangeSobre(event, index)}
              className="form-control"
              type="text"
              value={state.sobres[index].m_sDescripcion}
              required
              disabled={state.agregar == "Consultar"}
              placeholder="Descripción"
              name="m_sDescripcion"
            />
          </div>
        </div>
        {state.sobres.length !== 1 && (
          <a className="btn delete" disabled={state.agregar == "Consultar"} onClick={() => removeSobre(index)}>
            <i className="zmdi zmdi-delete"></i> Eliminar Sobre
          </a>
        )}
      </div>
    );
  });

  if (redirect) {
    if(data.find( (o) => o.m_nIdRecoleccion == state.idRecoleccion).m_nIdEmbarque != 0){
      showSuccess("Recolección ya tiene Embarque")
    } else {
    return (
      <Redirect push to={{
        pathname: '/Embarque',
        idRecoleccion: state.idRecoleccion,
      }}
      />
    )
    }
  }

  return (
    <div>
      <Dialog open={state.openDialog} onClose={() => setState({ ...state, openDialog: false })}>
        <DialogContent>
          {state.tipoModal == 0 &&
            <div className="row" style={{ backgroundColor: '#FFFFFF' }}>
              <div align="right">
                <button onClick={() => { history.push("/Ciudades") }} className="btn btn-primary primary-btn">Agregar</button>

              </div>

              {dataCodigoPostal.length != 0 ? <TableCodigoPostal object={state} select={state[state.identificadorModal] && state[state.identificadorModal].m_nIdCP} columns={columnsCP} data={dataCodigoPostal} identificadorModal={state.identificadorModal} /> : <div>No se encontró ningún registro</div>}

              <DialogActions style={{ justifyContent: "left" }}>

                <button onClick={() => setState({ ...state, openDialog: false })} className="btn btn-primary primary-btn">Aceptar</button>
                <button onClick={() => setState({ ...state, openDialog: false })} className="btn btn-secondary secondary-btn">Cerrar</button>

              </DialogActions>
            </div>
          }
          {state.tipoModal == 1 &&
            <div className="row" style={{ backgroundColor: '#FFFFFF' }}>
              <div align="right">
                <button onClick={() => { history.push("/Ciudades") }} className="btn btn-primary primary-btn">Agregar</button>

              </div>

              {dataCiudad.length != 0 ? <TableCiudades object={state} select={state[state.identificadorModal] && state[state.identificadorModal].m_nIdCiudad} columns={columnsCiudades} data={dataCiudad} identificadorModal={state.identificadorModal} /> : <div>No se encontró ningún registro</div>}


              <DialogActions style={{ justifyContent: "left" }}>

                <button onClick={() => setState({ ...state, openDialog: false })} className="btn btn-primary primary-btn">Aceptar</button>
                <button onClick={() => setState({ ...state, openDialog: false })} className="btn btn-secondary secondary-btn">Cerrar</button>

              </DialogActions>
            </div>
          }
          {state.tipoModal == 2 &&
            <div className="row" style={{ backgroundColor: '#FFFFFF' }}>
              <div align="right">
                <button onClick={() => { history.push("/Operadores") }} className="btn btn-primary primary-btn">Agregar</button>

              </div>

              {dataOperador.length != 0 ? <TableOperadores object={state} select={state[state.identificadorModal] && state[state.identificadorModal].m_nIdOperador} columns={columnsOperadores} data={dataOperador} identificadorModal={state.identificadorModal} /> : <div>No se encontró ningún registro</div>}

              <DialogActions style={{ justifyContent: "left" }}>

                <button onClick={() => setState({ ...state, openDialog: false })} className="btn btn-primary primary-btn">Aceptar</button>
                <button onClick={() => setState({ ...state, openDialog: false })} className="btn btn-secondary secondary-btn">Cerrar</button>

              </DialogActions>
            </div>
          }
          {state.tipoModal == 3 &&
            <div className="row" style={{ backgroundColor: '#FFFFFF' }}>
              <div align="right">
                <button onClick={() => { history.push("/TipoUnidad") }} className="btn btn-primary primary-btn">Agregar</button>
              </div>
              {dataTipoUnidad.length != 0 ? <TableTipoUnidad object={state} select={state[state.identificadorModal] && state[state.identificadorModal].m_nIdTipoUnidad} columns={columnsTipoUnidades} data={dataTipoUnidad} identificadorModal={state.identificadorModal} /> : <div>No se encontró ningún registro</div>}

              <DialogActions style={{ justifyContent: "left" }}>

                <button onClick={() => setState({ ...state, openDialog: false })} className="btn btn-primary primary-btn">Aceptar</button>
                <button onClick={() => setState({ ...state, openDialog: false })} className="btn btn-secondary secondary-btn">Cerrar</button>

              </DialogActions>
            </div>
          }
          {state.tipoModal == 4 &&
            <div className="row" style={{ backgroundColor: '#FFFFFF' }} >
              <div align="right">
                <button onClick={() => { history.push("/Unidades") }} className="btn btn-primary primary-btn">Agregar</button>

              </div>

              {dataUnidad.length != 0 ? <TableUnidad object={state} select={state[state.identificadorModal] && state[state.identificadorModal].m_nIdUnidad} columns={columnsUnidades} data={dataUnidad} identificadorModal={state.identificadorModal} /> : <div>No se encontró ningún registro</div>}

              <DialogActions style={{ justifyContent: "left" }}>
                <button onClick={() => setState({ ...state, openDialog: false })} className="btn btn-primary primary-btn">Aceptar</button>
                <button onClick={() => setState({ ...state, openDialog: false })} className="btn btn-secondary secondary-btn">Cerrar</button>

              </DialogActions>
            </div>
          }
          {state.tipoModal == 5 &&
            <div className="row" style={{ backgroundColor: '#FFFFFF' }} >
              <div align="right">
                <button onClick={() => { history.push("/Unidades") }} className="btn btn-primary primary-btn">Agregar</button>

              </div>

              {dataRemitenteDestinatario.length != 0 ? <TableRemitentesDestinatarios object={state} select={state[state.identificadorModal] && state[state.identificadorModal].m_nIdRemitenteDestinatario} columns={columnsRemitenteDestinatarios} data={dataRemitenteDestinatario} identificadorModal={state.identificadorModal} /> : <div>No se encontró ningún registro</div>}

              <DialogActions style={{ justifyContent: "left" }}>

                <button onClick={() => setState({ ...state, openDialog: false })} className="btn btn-primary primary-btn">Aceptar</button>
                <button onClick={() => setState({ ...state, openDialog: false })} className="btn btn-secondary secondary-btn">Cerrar</button>

              </DialogActions>
            </div>
          }</DialogContent>

      </Dialog>

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
                <h2>Recolección</h2>
              </div>
              <div className="col-md-6 col-sm-6">
                <ul className="list-page-breadcrumb">
                  <li className="active-page">Recolección</li>
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
              <ExportCSV csvData={data} fileName="Recoleccion_Listado" />
            </li>
            <li>
              <a data-toggle="tab" href="#Cancelar" onClick={handleShowCancelar} className={state.idRecoleccion == 0 ? classes.disabled : ""}>
                <i className="fa fa-times-circle" /> Cancelar
              </a>
            </li>

            <li style={{ float: "right" }}>
              <a data-toggle="tab" href="#" className={state.idRecoleccion == 0 ? classes.disabled : ""} style={{ textAlign: "right" }} onClick={() => setRedirect(true)}>
                Generar embarque
                            </a>
            </li>

            {/**<button className="topbar-right pull-right">Boton</button>*/}
          </ul>

          <div
            className="row"
            className="tab-content"
            style={{ paddingLeft: "-15px" }}
          >
            <div id="Listado" className="tab-pane fade in active">
              <div className="widget-wrap">
                <form className="j-forms">
                  <div className="form-content">
                    <div className="col-sm-6 col-md-3 unit">
                      <label className="label">Fecha Inicial</label>
                      <div className="input">
                        <input
                          type="date"
                          className="form-control"
                          value={state.fechaInicial}
                          onChange={handleFechaInicialFiltro}
                          id="fechaInicial"
                        />
                      </div>
                    </div>

                    <div className="col-sm-6 col-md-3 unit">
                      <label className="label">Fecha Final</label>
                      <div className="input">
                        <input
                          type="date"
                          className="form-control"
                          value={state.fechaFinal}
                          onChange={handleFechaFinalFiltro}
                          id="fechaFinal"
                        />
                      </div>

                    </div>

                    <div className="col-sm-6 col-md-3 unit">
                      <label className="label">Sucursal</label>
                      <label className="input select">
                        <select
                          className="form-control"
                          required
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
                        </select>
                        <i></i>
                      </label>
                    </div>

                    <div className="col-sm-6 col-md-3 unit">
                      <label className="label">Estatus</label>
                      <label className="input select">
                        <select
                          className="form-control"
                          required
                          value={state.estatusListado}
                          onChange={handleEstatusFiltro}
                          id="estatusListado"
                        >
                          <option value="0">Todos</option>
                          {dataEstatusRecoleccion.map((estatus) => (
                            <option
                              key={estatus.m_nIdEstatusRecoleccion}
                              value={estatus.m_nIdEstatusRecoleccion}
                            >
                              {estatus.m_sEstatus}
                            </option>
                          ))}
                        </select>
                      </label>
                    </div>
                  </div>
                </form>
                <div className="row">
                  {conDatos() ? (
                    <Table columns={columns} data={data} />
                  ) : (
                    <div>No se encontró ningún registro</div>
                  )}
                </div>
              </div>
            </div>

            <div id="Agregar" className="tab-pane fade">
              <form className="j-forms" onSubmit={handleAceptar}>
                <div className="form-content">
                  <div
                    className="wizard-breadcrumb number-style"
                    style={{
                      position: "sticky",
                      top: "150px",
                      padding: "5px",
                      backgroundColor: "white",
                      zIndex: 100,
                      marginBottom: "10px",
                    }}
                  >
                    <div className="row">
                      <div
                        className={
                          "col-sm-3 col-md-2-5 col-lg-2-5 step " +
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
                          "col-sm-3 col-md-2-5 col-lg-2-5 step " +
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
                          "col-sm-3 col-md-2-5 col-lg-2-5 step " +
                          (stepActive == 3 && "active-step")
                        }
                        onClick={() => openSection(3)}
                      >
                        <div className="steps">
                          <span className="step-number">3</span>
                          <p>Paquetes y Sobres</p>
                        </div>
                      </div>

                      <div
                        className={
                          "col-sm-3 col-md-2-5 col-lg-2-5 step " +
                          (stepActive == 4 && "active-step")
                        }
                        onClick={() => openSection(4)}
                      >
                        <div className="steps">
                          <span className="step-number">4</span>
                          <p>Información Adicional del Pago</p>
                        </div>
                      </div>
                      <div
                        className={
                          "col-sm-3 col-md-2-5 col-lg-2-5 step" +
                          (stepActive == 5 && "active-step")
                        }
                        onClick={() => openSection(5)}
                      >
                        <div className="steps">
                          <span className="step-number">5</span>
                          <p>Detalles de Operación</p>
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
                            <div className="col-sm-6 col-md-2-5 col-lg-2-5 unit">
                              {" "}
                              <label className="label">Sucursal</label>
                              <label className="input select">
                                <select
                                  className="form-control"
                                  required
                                  value={state.idSucursalAgregar}
                                  onChange={handleChange}
                                  id="idSucursalAgregar"
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
                                </select>
                              </label>
                            </div>

                            <div className="col-sm-6 col-md-2-5 col-lg-2-5 unit">
                              <label className="label">Folio Recolección</label>
                              <div className="input">
                                <input
                                  onChange={handleChange}
                                  className="form-control"
                                  type="text"
                                  value={state.folioRecoleccion}
                                  id="folioRecoleccion"
                                  readOnly
                                />
                              </div>
                            </div>

                            <div className="col-sm-6 col-md-2-5 col-lg-2-5 unit">
                              <label className="label">Folio Embarque</label>
                              <div className="input">
                                <input
                                  onChange={handleChange}
                                  className="form-control"
                                  type="text"
                                  value={state.folioEmbarque}
                                  id="folioEmbarque"
                                  readOnly
                                />
                              </div>
                            </div>

                            <div className="col-sm-6 col-md-2-5 col-lg-2-5 unit">
                              <label className="label">Folio Guía</label>
                              <div className="input">
                                <input
                                  onChange={handleChange}
                                  className="form-control"
                                  type="text"
                                  value={state.folioGuía}
                                  id="folioGuía"
                                  readOnly
                                />
                              </div>
                            </div>

                            <div className="col-sm-6 col-md-2-5 col-lg-2-5 unit">
                              <label className="label">Folio Informe</label>
                              <div className="input">
                                <input
                                  onChange={handleChange}
                                  className="form-control"
                                  type="text"
                                  value={state.folioInforme}
                                  id="folioInforme"
                                  readOnly
                                />
                              </div>
                            </div>

                            <div className="col-sm-6 col-md-2-5 col-lg-2-5 unit">
                              <label className="label">Fecha / Hora</label>
                              <div className="input">
                                <input
                                  onChange={handleChange}
                                  required
                                  value={state.fechaHoraCreacion}
                                  className="form-control"
                                  disabled="disabled"
                                  id="fechaHoraCreacion"
                                />
                              </div>
                            </div>

                            <div className="col-sm-6 col-md-2-5 col-lg-2-5 unit">
                              <label className="label">
                                Estatus de la Recolección
                              </label>
                              <label className="input select">
                                <select
                                  className="form-control"
                                  required
                                  value={state.estatusRecoleccion}
                                  onChange={handleChange}
                                  disabled={state.agregar == "Consultar"}
                                  id="estatusRecoleccion"
                                >
                                  {dataEstatusRecoleccion.map((estatus) => (
                                    <option
                                      key={estatus.m_nIdEstatusRecoleccion}
                                      value={estatus.m_nIdEstatusRecoleccion}
                                    >
                                      {estatus.m_sEstatus}
                                    </option>
                                  ))}
                                </select>
                                <i></i>
                              </label>
                            </div>

                            <div className="col-sm-6 col-md-2-5 col-lg-2-5 unit">
                              <label className="label">Moneda</label>
                              <label className="input select">
                                <select
                                  className="form-control"
                                  required
                                  value={state.moneda}
                                  onChange={handleChange}
                                  disabled={state.agregar == "Consultar"}
                                  id="moneda"
                                >
                                  <option value="0">Seleccionar</option>
                                  {dataTipoMoneda.map((moneda) => (
                                    <option
                                      key={moneda.m_nIdMoneda}
                                      value={moneda.m_nIdMoneda}
                                    >
                                      {moneda.m_sMoneda}
                                    </option>
                                  ))}
                                </select>
                                <i className="fa fa-arrow-down" />
                              </label>
                            </div>

                            <div className="col-sm-6 col-md-2-5 col-lg-2-5  unit">
                              <label className="label">Tipo de Cambio</label>
                              <div className="input">
                                <input
                                  onChange={handleChange}
                                  className="form-control"
                                  type="number"
                                  min="0"
                                  step="0.01"
                                  required
                                  value={state.tipoCambio}
                                  disabled={state.agregar == "Consultar"}
                                  id="tipoCambio"
                                />
                              </div>
                            </div>

                            <div className="col-sm-6 col-md-2-5 col-lg-2-5 unit">
                              <label className="label">Tipo Cobro</label>
                              <label className="input select">
                                <select
                                  className="form-control"
                                  required
                                  value={state.tipoCobro}
                                  disabled={state.agregar == "Consultar"}
                                  onChange={handleChange}
                                  id="tipoCobro"
                                >
                                  <option value="0">Seleccionar</option>
                                  {dataTipoCobro.map((tipoCobro) => (
                                    <option
                                      key={tipoCobro.m_nIdTipoCobro}
                                      value={tipoCobro.m_nIdTipoCobro}
                                    >
                                      {tipoCobro.m_sDescripcion}
                                    </option>
                                  ))}
                                </select>
                                <i></i>
                              </label>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="row">
                    <div className="col-md-7">
                      <div className="widget-wrap" id="remitenteDestinatario">
                        <div className="row">
                          <div className="col-md-6">
                            <div className="widget-header">
                              <h2>Remitente</h2>
                            </div>
                            <div className="widget-container">
                              <div className="widget-content">
                                <div className="row">
                                  {/* --------------------------------------- Nombre -------------------------------------- */}
                                  <div className="col-sm-12 col-md-12  unit">
                                    <label className="label">Nombre</label>
                                    <div className="input">
                                      <Autocomplete

                                        onSelect={handleSelectRemitente()}
                                        value={state.nombreRemitente}
                                        disabled={state.agregar == "Consultar"}
                                        freeSolo
                                        onChange={(event, newValue) =>
                                          setState({
                                            ...state,
                                            nombreRemitente: newValue,
                                          })
                                        }
                                        id="nombreRemitente"
                                        disableClearable
                                        forcePopupIcon={false}
                                        options={dataRemitenteDestinatario}
                                        getOptionLabel={(option) =>
                                          option.m_sNombreFiscal
                                        }
                                        variant="outlined"
                                        style={{
                                          borderWidth: "1px",
                                          borderColor: "#dddddd",
                                          borderStyle: "solid",
                                          borderRadius: "5px",

                                        }}
                                        renderInput={(params) => (
                                          <div>
                                            <TextField
                                              required
                                              {...params}
                                              InputProps={{
                                                ...params.InputProps,
                                                style: { height: "33px", fontSize: "14px" },
                                                type: "search",
                                                disableUnderline: true,
                                                endAdornment: (
                                                  <InputAdornment position="end">
                                                    <IconButton
                                                      padding="0px"
                                                      style={{
                                                        paddingRight: "0px",
                                                      }}
                                                      disabled={state.agregar == "Consultar"}
                                                      onClick={() => {
                                                        setState({
                                                          ...state,
                                                          identificadorModal:
                                                            "nombreRemitente",
                                                          tipoModal: 5,
                                                          openDialog: true
                                                        });
                                                      }}
                                                    >
                                                      <PageviewIcon
                                                        style={{
                                                          color: "#F9A03E",
                                                          fontSize: 32,
                                                          paddingInlineEnd: 0,
                                                          paddingRight: 0,
                                                          paddingBlockEnd: 0,
                                                          paddingLeft: 0,
                                                          paddingBlock: 0,
                                                        }}
                                                      />
                                                    </IconButton>
                                                  </InputAdornment>
                                                ),
                                              }}
                                            />
                                          </div>
                                        )}
                                      />
                                    </div>
                                  </div>
                                  {/* --------------------------------------- RFC -------------------------------------- */}
                                  <div className="col-sm-12 col-md-8 unit">
                                    {" "}
                                    <label className="label">RFC</label>
                                    <div className="input">
                                      <input
                                        onChange={handleChange}
                                        className="form-control"
                                        type="text"
                                        pattern="[A-Z&Ñ]{3,4}[0-9]{2}(0[1-9]|1[012])(0[1-9]|[12][0-9]|3[01])[A-Z0-9]{2}[0-9A]"
                                        title="Favor de introducir un RFC válido."
                                        required
                                        value={state.RFCRemitente}
                                        disabled={state.agregar == "Consultar"}
                                        id="RFCRemitente"
                                      />
                                    </div>
                                  </div>
                                  {/* --------------------------------------- Domicilio -------------------------------------- */}
                                  <div className="col-sm-12 col-md-12 unit">
                                    <label className="label">Domicilio</label>
                                    <div className="input">
                                      <input
                                        onChange={handleChange}
                                        className="form-control"
                                        type="text"
                                        required
                                        value={state.domicilioRemitente}
                                        disabled={state.agregar == "Consultar"}
                                        id="domicilioRemitente"
                                      />
                                    </div>
                                  </div>
                                  {/* --------------------------------------- AutocompleteCPRemitente -------------------------------------- */}
                                  <div className="col-sm-12 col-md-8 unit" >
                                    <label className="label">
                                      Código Postal
                                    </label>
                                    <div className="input">
                                      <Autocomplete
                                        value={state.codigoPostalRemitente}
                                        freeSolo
                                        onChange={(event, newValue) =>
                                          setState({
                                            ...state,
                                            codigoPostalRemitente: newValue,
                                          })
                                        }
                                        id="codigoPostalRemitente"
                                        disableClearable
                                        forcePopupIcon={false}
                                        options={dataCodigoPostal}
                                        disabled={state.agregar == "Consultar"}
                                        getOptionLabel={(option) =>
                                          option.m_sCP
                                        }
                                        variant="outlined"
                                        style={{
                                          borderWidth: "1px",
                                          borderColor: "#dddddd",
                                          borderStyle: "solid",
                                          borderRadius: "5px",

                                        }}
                                        renderInput={(params) => (
                                          <div>
                                            <TextField
                                              required
                                              {...params}
                                              InputProps={{
                                                ...params.InputProps,
                                                style: { height: "33px", fontSize: "14px" },
                                                type: "search",
                                                disableUnderline: true,
                                                disabled: state.agregar == "Consultar",
                                                endAdornment: (
                                                  <InputAdornment position="end">
                                                    <IconButton
                                                      padding="0px"
                                                      style={{
                                                        paddingRight: "0px",
                                                      }}
                                                      disabled={state.agregar == "Consultar"}
                                                      onClick={() => {
                                                        setState({
                                                          ...state,
                                                          identificadorModal:
                                                            "codigoPostalRemitente",
                                                          tipoModal: 0,
                                                          openDialog: true
                                                        });
                                                      }}
                                                    >
                                                      <PageviewIcon
                                                        style={{
                                                          color: "#F9A03E",
                                                          fontSize: 32,
                                                          paddingInlineEnd: 0,
                                                          paddingRight: 0,
                                                          paddingBlockEnd: 0,
                                                          paddingLeft: 0,
                                                          paddingBlock: 0,
                                                        }}
                                                      />
                                                    </IconButton>
                                                  </InputAdornment>
                                                ),
                                              }}
                                            />
                                          </div>
                                        )}
                                      />
                                    </div>
                                  </div>
                                  {/* --------------------------------------- Ciudad ------------------------------------------------- */}
                                  <div className="col-sm-12 col-md-12 col-lg-12 unit">
                                    <label className="label">Ciudad</label>
                                    <label className="input select">
                                      <select
                                        className="form-control"
                                        required
                                        value={state.ciudadRemitente}
                                        disabled={state.agregar == "Consultar"}
                                        onChange={handleChange}
                                        id="ciudadRemitente"
                                      >
                                        {dataCiudad.map((ciudad) => (
                                          <option
                                            key={ciudad.m_nIdCiudad}
                                            value={ciudad.m_nIdCiudad}
                                          >
                                            {ciudad.m_sCiudad}
                                          </option>
                                        ))}
                                      </select>
                                      <i className="fa fa-arrow-down" />
                                    </label>
                                  </div>
                                  {/* --------------------------------------- Correo ------------------------------------------------- */}
                                  <div className="col-sm-12 col-md-12 unit">
                                    <label className="label">
                                      Correo Electrónico
                                    </label>
                                    <div className="input">
                                      <input
                                        onChange={handleChange}
                                        className="form-control"
                                        type="email"
                                        required
                                        value={state.correoRemitente}
                                        disabled={state.agregar == "Consultar"}
                                        id="correoRemitente"
                                      />
                                    </div>
                                  </div>
                                  {/* --------------------------------------- Telefono ------------------------------------------------- */}
                                  <div className="col-sm-12 col-md-12 unit">
                                    <label className="label">Teléfono</label>
                                    <div className="input">
                                      <input
                                        onChange={handleChange}
                                        className="form-control"
                                        type="text"
                                        pattern="[0-9]{10}"
                                        maxLength="10"
                                        required
                                        value={state.telefonoRemitente}
                                        disabled={state.agregar == "Consultar"}
                                        id="telefonoRemitente"
                                      />
                                    </div>
                                  </div>
                                  {/* --------------------------------------- Contacto ------------------------------------------------- */}
                                  <div className="col-sm-12 col-md-12 unit">
                                    <label className="label">Contacto</label>
                                    <div className="input">
                                      <input
                                        onChange={handleChange}
                                        className="form-control"
                                        type="text"
                                        required
                                        value={state.contactoRemitente}
                                        disabled={state.agregar == "Consultar"}
                                        id="contactoRemitente"
                                      />
                                    </div>
                                  </div>
                                  {/* --------------------------------------- Origen ------------------------------------------------- */}
                                  <div className="col-sm-12 col-md-12 unit">
                                    <label className="label">Origen</label>
                                    <div className="input">
                                      <Autocomplete
                                        freeSolo
                                        onChange={(event, newValue) =>
                                          setState({
                                            ...state,
                                            origenRemitente: newValue,
                                          })
                                        }
                                        value={state.origenRemitente}
                                        disabled={state.agregar == "Consultar"}
                                        id="origenRemitente"
                                        disableClearable
                                        forcePopupIcon={false}
                                        options={dataCiudad}
                                        getOptionLabel={(option) =>
                                          option.m_sCiudad
                                        }
                                        variant="outlined"
                                        style={{
                                          borderWidth: "1px",
                                          borderColor: "#dddddd",
                                          borderStyle: "solid",
                                          borderRadius: "5px",
                                        }}
                                        renderInput={(params) => (
                                          <div>
                                            <TextField
                                              required
                                              {...params}
                                              InputProps={{
                                                ...params.InputProps,
                                                style: { height: "33px", fontSize: "14px" },
                                                type: "search",
                                                value: state.origenRemitente,
                                                disabled: state.agregar == "Consultar",
                                                disableUnderline: true,
                                                endAdornment: (
                                                  <InputAdornment position="end">
                                                    <IconButton
                                                      padding="0px"
                                                      style={{
                                                        paddingRight: "0px",
                                                      }}
                                                      disabled={state.agregar == "Consultar"}
                                                      onClick={() => {
                                                        setState({
                                                          ...state,
                                                          identificadorModal:
                                                            "origenRemitente",
                                                          tipoModal: 1,
                                                          openDialog: true
                                                        });
                                                      }}
                                                    >
                                                      <PageviewIcon
                                                        style={{
                                                          color: "#F9A03E",
                                                          fontSize: 32,
                                                          paddingInlineEnd: 0,
                                                          paddingRight: 0,
                                                          paddingBlockEnd: 0,
                                                          paddingLeft: 0,
                                                          paddingBlock: 0,
                                                        }}
                                                      />
                                                    </IconButton>
                                                  </InputAdornment>
                                                ),
                                              }}
                                            />
                                          </div>
                                        )}
                                      />
                                    </div>
                                  </div>
                                  {/* --------------------------------------- RecoleccionDD ------------------------------------------------- */}
                                  <div className="col-sm-12 col-md-12 unit">
                                    <label className="label">
                                      Recolección en Diferente Domicilio
                                    </label>
                                    <div className="form">
                                      <input
                                        onChange={
                                          handleRecoleccionCheckboxChange
                                        }
                                        className="form-control"
                                        value={state.diferenteRecoleccion}
                                        disabled={state.agregar == "Consultar"}
                                        checked={state.diferenteRecoleccion}
                                        type="checkbox"
                                        id="diferenteRecoleccion"
                                      />
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                          <div className="col-md-6">
                            <div className="widget-header">
                              <h2>Destinatario</h2>
                            </div>
                            <div className="widget-container">
                              <div className="widget-content">
                                <div className="col-sm-12 col-md-12    unit">
                                  <label className="label">Nombre</label>
                                  <div className="input">
                                    <Autocomplete
                                      onSelect={handleSelectDestinatario()}
                                      value={state.nombreDestinatario}
                                      disabled={state.agregar == "Consultar"}
                                      freeSolo
                                      onChange={(event, newValue) =>
                                        setState({
                                          ...state,
                                          nombreDestinatario: newValue,
                                        })
                                      }
                                      id="nombreRemitente"
                                      disableClearable
                                      forcePopupIcon={false}
                                      options={dataRemitenteDestinatario}
                                      getOptionLabel={(option) =>
                                        option.m_sNombreFiscal
                                      }
                                      variant="outlined"
                                      style={{
                                        borderWidth: "1px",
                                        borderColor: "#dddddd",
                                        borderStyle: "solid",
                                        borderRadius: "5px",

                                      }}
                                      renderInput={(params) => (
                                        <div>
                                          <TextField
                                              required
                                            {...params}
                                            InputProps={{
                                              ...params.InputProps,
                                              style: { height: "33px", fontSize: "14px" },
                                              type: "search",
                                              disableUnderline: true,
                                              endAdornment: (
                                                <InputAdornment position="end">
                                                  <IconButton
                                                    padding="0px"
                                                    style={{
                                                      paddingRight: "0px",
                                                    }}
                                                    disabled={state.agregar == "Consultar"}
                                                    onClick={() => {
                                                      setState({
                                                        ...state,
                                                        identificadorModal:
                                                          "nombreDestinatario",
                                                        tipoModal: 5,
                                                        openDialog: true
                                                      });
                                                    }}
                                                  >
                                                    <PageviewIcon
                                                      style={{
                                                        color: "#F9A03E",
                                                        fontSize: 32,
                                                        paddingInlineEnd: 0,
                                                        paddingRight: 0,
                                                        paddingBlockEnd: 0,
                                                        paddingLeft: 0,
                                                        paddingBlock: 0,
                                                        paddingRight: "0px",
                                                      }}
                                                      onClick={() => {
                                                        setState({
                                                          ...state,
                                                          identificadorModal:
                                                            "nombreDestinatario",
                                                          tipoModal: 5,
                                                          openDialog: true
                                                        });
                                                      }}
                                                    />
                                                  </IconButton>
                                                </InputAdornment>
                                              ),
                                            }}
                                          />
                                        </div>
                                      )}
                                    />
                                  </div>
                                </div>

                                <div className="col-sm-12 col-md-8 unit">
                                  <label className="label">RFC</label>
                                  <div className="input">
                                    <input
                                      onChange={handleChange}
                                      className="form-control"
                                      type="text"
                                      pattern="[A-Z&Ñ]{3,4}[0-9]{2}(0[1-9]|1[012])(0[1-9]|[12][0-9]|3[01])[A-Z0-9]{2}[0-9A]"
                                      title="Favor de introducir un RFC válido."
                                      required
                                      value={state.RFCDestinatario}
                                      disabled={state.agregar == "Consultar"}
                                      id="RFCDestinatario"
                                    />
                                  </div>
                                </div>

                                <div className="col-sm-12 col-md-12 unit">
                                  <label className="label">Domicilio</label>
                                  <div className="input">
                                    <input
                                      onChange={handleChange}
                                      className="form-control"
                                      type="text"
                                      required
                                      value={state.domicilioDestinatario}
                                      disabled={state.agregar == "Consultar"}
                                      id="domicilioDestinatario"
                                    />
                                  </div>
                                </div>
                                <div className="col-sm-12 col-md-8 unit" >
                                  <label className="label">Código Postal</label>
                                  <div className="input">
                                    <Autocomplete
                                      freeSolo
                                      onChange={(event, newValue) =>
                                        setState({
                                          ...state,
                                          codigoPostalDestinatario: newValue,
                                        })
                                      }
                                      value={state.codigoPostalDestinatario}
                                      disabled={state.agregar == "Consultar"}
                                      id="codigoPostalDestinatario"
                                      disableClearable
                                      options={dataCodigoPostal}
                                      getOptionLabel={(option) => option.m_sCP}
                                      variant="outlined"
                                      style={{
                                        borderWidth: "1px",
                                        borderColor: "#dddddd",
                                        borderStyle: "solid",
                                        borderRadius: "5px",
                                      }}
                                      renderInput={(params) => (
                                        <div>
                                          <TextField
                                              required
                                            {...params}
                                            InputProps={{
                                              ...params.InputProps,
                                              style: { height: "33px", fontSize: "14px" },
                                              type: "search",
                                              disableUnderline: true,
                                              disabled: state.agregar == "Consultar",
                                              endAdornment: (
                                                <InputAdornment position="end">
                                                  {" "}
                                                  <IconButton
                                                    style={{
                                                      paddingRight: "0px",
                                                    }}
                                                    disabled={state.agregar == "Consultar"}
                                                    onClick={() => {
                                                      setState({
                                                        ...state,
                                                        identificadorModal:
                                                          "codigoPostalDestinatario",
                                                        tipoModal: 0,
                                                        openDialog: true
                                                      });
                                                    }}
                                                  >
                                                    <PageviewIcon
                                                      style={{
                                                        color: "#F9A03E",
                                                        fontSize: 32,
                                                      }}
                                                    />
                                                  </IconButton>{" "}
                                                </InputAdornment>
                                              ),
                                            }}
                                          />
                                        </div>
                                      )}
                                    />
                                  </div>
                                </div>

                                <div className="col-sm-12 col-md-12  unit">
                                  <label className="label">Ciudad</label>
                                  <label className="input select">
                                    <select
                                      className="form-control"
                                      required
                                      value={state.ciudadDestinatario}
                                      disabled={state.agregar == "Consultar"}
                                      onChange={handleChange}
                                      id="ciudadDestinatario"
                                    >
                                      {dataCiudad.map((ciudad) => (
                                        <option
                                          key={ciudad.m_nIdCiudad}
                                          value={ciudad.m_nIdCiudad}
                                        >
                                          {ciudad.m_sCiudad}
                                        </option>
                                      ))}
                                    </select>
                                    <i className="fa fa-arrow-down" />
                                  </label>
                                </div>

                                <div className="col-sm-12 col-md-12 unit">
                                  <label className="label">
                                    Correo Electrónico
                                  </label>
                                  <div className="input">
                                    <input
                                      onChange={handleChange}
                                      className="form-control"
                                      type="email"
                                      required
                                      value={state.correoDestinatario}
                                      disabled={state.agregar == "Consultar"}
                                      id="correoDestinatario"
                                    />
                                  </div>
                                </div>

                                <div className="col-sm-12 col-md-12 unit">
                                  <label className="label">Teléfono</label>
                                  <div className="input">
                                    <input
                                      onChange={handleChange}
                                      className="form-control"
                                      type="text"
                                      required
                                      value={state.telefonoDestinatario}
                                      disabled={state.agregar == "Consultar"}
                                      id="telefonoDestinatario"
                                    />
                                  </div>
                                </div>

                                <div className="col-sm-12 col-md-12 unit">
                                  <label className="label">Contacto</label>
                                  <div className="input">
                                    <input
                                      onChange={handleChange}
                                      className="form-control"
                                      type="text"
                                      required
                                      value={state.contactoDestinatario}
                                      disabled={state.agregar == "Consultar"}
                                      id="contactoDestinatario"
                                    />
                                  </div>
                                </div>

                                <div className="col-sm-12 col-md-12  unit">
                                  <label className="label">Destino</label>
                                  <div className="input">
                                    <Autocomplete
                                      freeSolo
                                      onChange={(event, newValue) =>
                                        setState({
                                          ...state,
                                          destinoDestinatario: newValue,
                                        })
                                      }
                                      value={state.destinoDestinatario}
                                      disabled={state.agregar == "Consultar"}
                                      id="destinoDestinatario"
                                      disableClearable
                                      forcePopupIcon={false}
                                      options={dataCiudad}
                                      getOptionLabel={(option) =>
                                        option.m_sCiudad
                                      }
                                      variant="outlined"
                                      style={{
                                        borderWidth: "1px",
                                        borderColor: "#dddddd",
                                        borderStyle: "solid",
                                        borderRadius: "5px",
                                      }}
                                      renderInput={(params) => (
                                        <div>
                                          <TextField
                                              required
                                            {...params}
                                            InputProps={{
                                              ...params.InputProps,
                                              style: { height: "33px", fontSize: "14px" },
                                              type: "search",
                                              value: state.origenRemitente,
                                              disabled: state.agregar == "Consultar",
                                              disableUnderline: true,
                                              endAdornment: (
                                                <InputAdornment position="end">
                                                  <IconButton
                                                    padding="0px"
                                                    style={{
                                                      paddingRight: "0px",
                                                    }}
                                                    disabled={state.agregar == "Consultar"}
                                                    onClick={() => {
                                                      setState({
                                                        ...state,
                                                        identificadorModal:
                                                          "destinoDestinatario",
                                                        tipoModal: 1,
                                                        openDialog: true
                                                      });
                                                    }}
                                                  >
                                                    <PageviewIcon
                                                      style={{
                                                        color: "#F9A03E",
                                                        fontSize: 32,
                                                        paddingInlineEnd: 0,
                                                        paddingRight: 0,
                                                        paddingBlockEnd: 0,
                                                        paddingLeft: 0,
                                                        paddingBlock: 0,
                                                      }}
                                                    />
                                                  </IconButton>
                                                </InputAdornment>
                                              ),
                                            }}
                                          />
                                        </div>
                                      )}
                                    />
                                  </div>
                                </div>

                                <div className="col-sm-12 col-md-12  unit">
                                  <label className="label">
                                    Entrega en Diferente Domicilio
                                  </label>
                                  <div className="input">
                                    <input
                                      onChange={handleEntregaCheckboxChange}
                                      className="form-control"
                                      value={state.diferenteEntrega}
                                      disabled={state.agregar == "Consultar"}
                                      checked={state.diferenteEntrega}
                                      type="checkbox"
                                      id="diferenteEntrega"
                                    />
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>

                      {state.diferenteRecoleccion || state.diferenteEntrega ? (
                        <div className="widget-wrap" id="detallesRecoleccion">
                          {state.diferenteRecoleccion ? (
                            <div>
                              <div className="widget-header">
                                <h2>Detalles de la Recolección</h2>
                              </div>
                              <div className="widget-container">
                                <div className="widget-content">
                                  <div className="row">
                                    <div className="col-md-12">
                                      <div className="col-sm-6 col-md-4  unit" >
                                        <label className="label">
                                          Fecha y Hora
                                        </label>
                                        <div className="input">
                                          <input
                                            onChange={handleChange}
                                            className="form-control"
                                            type="datetime-local"
                                            required
                                            value={state.fechaRecoleccion}
                                            disabled={state.agregar == "Consultar"}
                                            id="fechaRecoleccion"
                                          />
                                        </div>
                                      </div>

                                      <div className="col-sm-6 col-md-4  unit" >
                                        <label className="label">
                                          Código Postal
                                        </label>
                                        <div className="input">
                                          <Autocomplete
                                            freeSolo
                                            onChange={(event, newValue) =>
                                              setState({
                                                ...state,
                                                codigoPostalRecoleccion: newValue,
                                              })
                                            }
                                            value={
                                              state.codigoPostalRecoleccion
                                            }
                                            id="codigoPostalRecoleccion"
                                            disableClearable
                                            options={dataCodigoPostal}
                                            disabled={state.agregar == "Consultar"}
                                            getOptionLabel={(option) =>
                                              option.m_sCP
                                            }
                                            variant="outlined"
                                            style={{
                                              borderWidth: "1px",
                                              borderColor: "#dddddd",
                                              borderStyle: "solid",
                                              borderRadius: "5px",
                                            }}
                                            renderInput={(params) => (
                                              <div>
                                                <TextField
                                              required
                                                  {...params}
                                                  InputProps={{
                                                    ...params.InputProps,
                                                    style: { height: "33px", fontSize: "14px" },
                                                    type: "search",
                                                    disabled: state.agregar == "Consultar",
                                                    disableUnderline: true,
                                                    endAdornment: (
                                                      <InputAdornment position="end">
                                                        {" "}
                                                        <IconButton
                                                          style={{
                                                            paddingRight: "0px",
                                                          }}
                                                          disabled={state.agregar == "Consultar"}
                                                          onClick={() => {
                                                            setState({
                                                              ...state,
                                                              identificadorModal:
                                                                "codigoPostalRecoleccion",
                                                              tipoModal: 0,
                                                              openDialog: true
                                                            });
                                                          }}
                                                        >
                                                          <PageviewIcon
                                                            style={{
                                                              color: "#F9A03E",
                                                              fontSize: 32,
                                                            }}
                                                          />
                                                        </IconButton>{" "}
                                                      </InputAdornment>
                                                    ),
                                                  }}
                                                />
                                              </div>
                                            )}
                                          />
                                        </div>
                                      </div>

                                      <div className="col-sm-6 col-md-4  unit" >
                                        <label className="label">Ciudad</label>
                                        <label className="input select">
                                          <select
                                            className="form-control"
                                            required
                                            value={state.ciudadRecoleccion}
                                            disabled={state.agregar == "Consultar"}
                                            onChange={handleChange}
                                            id="ciudadRecoleccion"
                                          >
                                            {dataCiudad.map((ciudad) => (
                                              <option
                                                key={ciudad.m_nIdCiudad}
                                                value={ciudad.m_nIdCiudad}
                                              >
                                                {ciudad.m_sCiudad}
                                              </option>
                                            ))}
                                          </select>
                                          <i className="fa fa-arrow-down" />
                                        </label>
                                      </div>

                                      <div className="col-sm-6 col-md-4 unit" >
                                      <label className="label">Zona</label>

                                      <label className="input select">
                                          <select
                                            className="form-control"
                                            required
                                            value={state.zonaRecoleccion}
                                            disabled={state.agregar == "Consultar"}
                                            onChange={handleChange}
                                            id="zonaRecoleccion"
                                          >
                                            <option value="">Selecciona</option>
                                            {dataZona.map((zona) => (
                                              <option
                                                key={zona.m_nIdZona}
                                                value={zona.m_nIdZona}
                                              >
                                                {zona.m_sDescripcion}
                                              </option>
                                            ))}
                                          </select>
                                          <i className="fa fa-arrow-down" />
                                        </label>






                                          
                                      </div>

                                      <div className="col-sm-6 col-md-6  unit" >
                                        <label className="label">
                                          Domicilio
                                        </label>
                                        <div className="input">
                                          <input
                                            onChange={handleChange}
                                            className="form-control"
                                            type="text"
                                            required
                                            value={state.domicilioRecoleccion}
                                            disabled={state.agregar == "Consultar"}
                                            id="domicilioRecoleccion"
                                          />
                                        </div>
                                      </div>

                                      <div className="col-sm-12 col-md-6  unit" >
                                        <label className="label">
                                          Recoger En
                                        </label>
                                        <div className="input">
                                          <input
                                            onChange={handleChange}
                                            className="form-control"
                                            type="text"
                                            required
                                            value={state.recogerEn}
                                            disabled={state.agregar == "Consultar"}
                                            id="recogerEn"
                                          />
                                        </div>
                                      </div>

                                      <div className="col-sm-12 col-md-6  unit" >
                                        <label className="label">
                                          Datos Adicionales para la Recolección
                                        </label>
                                        <div className="input">
                                          <input
                                            onChange={handleChange}
                                            className="form-control"
                                            type="text"
                                            required
                                            value={
                                              state.datosAdicionalesRecoleccion
                                            }
                                            disabled={state.agregar == "Consultar"}
                                            id="datosAdicionalesRecoleccion"
                                          />
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>
                          ) : (
                            <div></div>
                          )}

                          {state.diferenteEntrega ? (
                            <div>
                              <div className="widget-header">
                                <h2>Detalles de la Entrega</h2>
                              </div>
                              <div className="widget-container">
                                <div className="widget-content">
                                  <div className="row">
                                    <div className="col-md-12">
                                      <div className="col-sm-6 col-md-4  unit" >
                                        <label className="label">
                                          Código Postal
                                        </label>
                                        <div className="input">
                                          <Autocomplete
                                            freeSolo

                                            onChange={(event, newValue) =>
                                              setState({
                                                ...state,
                                                codigoPostalEntrega: newValue,
                                              })
                                            }
                                            value={state.codigoPostalEntrega}
                                            id="codigoPostalEntrega"
                                            disableClearable
                                            options={dataCodigoPostal}
                                            disabled={state.agregar == "Consultar"}
                                            getOptionLabel={(option) =>
                                              option.m_sCP
                                            }
                                            variant="outlined"
                                            style={{
                                              borderWidth: "1px",
                                              borderColor: "#dddddd",
                                              borderStyle: "solid",
                                              borderRadius: "5px",
                                            }}
                                            renderInput={(params) => (
                                              <div>
                                                <TextField
                                              required
                                                  {...params}
                                                  InputProps={{
                                                    ...params.InputProps,
                                                    style: { height: "33px", fontSize: "14px" },
                                                    type: "search",
                                                    disabled: state.agregar == "Consultar",
                                                    disableUnderline: true,
                                                    endAdornment: (
                                                      <InputAdornment position="end">
                                                        {" "}
                                                        <IconButton
                                                          style={{
                                                            paddingRight: "0px",
                                                          }}
                                                          disabled={state.agregar == "Consultar"}
                                                          onClick={() => {
                                                            setState({
                                                              ...state,
                                                              identificadorModal:
                                                                "codigoPostalEntrega",
                                                              tipoModal: 0,
                                                              openDialog: true
                                                            });
                                                          }}
                                                        >
                                                          <PageviewIcon
                                                            style={{
                                                              color: "#F9A03E",
                                                              fontSize: 32,
                                                            }}
                                                          />
                                                        </IconButton>{" "}
                                                      </InputAdornment>
                                                    ),
                                                  }}
                                                />
                                              </div>
                                            )}
                                          />
                                        </div>
                                      </div>

                                      <div className="col-sm-6 col-md-4  unit" >
                                        <label className="label">Ciudad</label>
                                        <label className="input select">
                                          <select
                                            className="form-control"
                                            required
                                            value={state.ciudadEntrega}
                                            disabled={state.agregar == "Consultar"}
                                            onChange={handleChange}
                                            id="ciudadEntrega"
                                          >
                                            {dataCiudad.map((ciudad) => (
                                              <option
                                                key={ciudad.m_nIdCiudad}
                                                value={ciudad.m_nIdCiudad}
                                              >
                                                {ciudad.m_sCiudad}
                                              </option>
                                            ))}
                                          </select>
                                          <i className="fa fa-arrow-down" />
                                        </label>
                                      </div>

                                      <div className="col-sm-6 col-md-4 unit" >
                                        <label className="label">Zona</label>
                                        <label className="input select">
                                          <select
                                            className="form-control"
                                            required
                                            value={state.zonaEntrega}
                                            disabled={state.agregar == "Consultar"}
                                            onChange={handleChange}
                                            id="zonaEntrega"
                                          >
                                                                                        <option value="">Selecciona</option>

                                             {dataZona.map((zona) => (
                                              <option
                                                key={zona.m_nIdZona}
                                                value={zona.m_nIdZona}
                                              >
                                                {zona.m_sDescripcion}
                                              </option>
                                            ))}
                                          </select>
                                          <i className="fa fa-arrow-down" />
                                        </label>
                                      </div>

                                      <div className="col-sm-6 col-md-6 col-lg-6 unit" >
                                        <label className="label">
                                          Domicilio
                                        </label>
                                        <div className="input">
                                          <input
                                            onChange={handleChange}
                                            className="form-control"
                                            type="text"
                                            value={state.domicilioEntrega}
                                            disabled={state.agregar == "Consultar"}
                                            id="domicilioEntrega"
                                          />
                                        </div>
                                      </div>

                                      <div className="col-sm-12 col-md-6 col-lg-6 unit" >
                                        <label className="label">
                                          Entrega En
                                        </label>
                                        <div className="input">
                                          <input
                                            onChange={handleChange}
                                            className="form-control"
                                            type="text"
                                            value={state.entregaEn}
                                            disabled={state.agregar == "Consultar"}
                                            id="entregaEn"
                                          />
                                        </div>
                                      </div>

                                      <div className="col-sm-12 col-md-6 col-lg-6 unit" >
                                        <label className="label ">
                                          Datos Adicionales para la Entrega
                                        </label>
                                        <div className="input">
                                          <input
                                            onChange={handleChange}
                                            className="form-control"
                                            type="text"
                                            value={
                                              state.datosAdicionalesEntrega
                                            }
                                            disabled={state.agregar == "Consultar"}
                                            id="datosAdicionalesEntrega"
                                          />
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>
                          ) : (
                            <div></div>
                          )}
                        </div>
                      ) : (
                        <div></div>
                      )}

                      <div className="widget-wrap" id="detallesOperacion">
                        <div className="row">
                          <div className="col-md-12">
                            <div className="widget-header">
                              <h2>Detalles de la Operación</h2>
                            </div>
                            <div className="widget-container">
                              <div className="widget-content">
                                <div className="row">
                                  {/* --------------------------------------- Operador ------------------------------------------------- */}
                                  <div className="col-sm-4 col-md-4 unit">
                                    <label className="label">Operador</label>
                                    <div className="input">
                                      <Autocomplete
                                        freeSolo
                                        onChange={(event, newValue) =>
                                          setState({
                                            ...state,
                                            operador: newValue,
                                          })
                                        }
                                        value={state.operador}
                                        id="operador"
                                        disableClearable
                                        forcePopupIcon={false}
                                        options={dataOperador}
                                        disabled={state.agregar == "Consultar"}
                                        getOptionLabel={(option) =>
                                          option.m_sNombreCompleto
                                        }
                                        variant="outlined"
                                        style={{
                                          borderWidth: "1px",
                                          borderColor: "#dddddd",
                                          borderStyle: "solid",
                                          borderRadius: "5px",
                                        }}
                                        renderInput={(params) => (
                                          <div>
                                            <TextField
                                              required
                                              {...params}
                                              InputProps={{
                                                ...params.InputProps,
                                                style: { height: "33px", fontSize: "14px" },
                                                type: "search",
                                                disabled: state.agregar == "Consultar",
                                                disableUnderline: true,
                                                endAdornment: (
                                                  <InputAdornment position="end">
                                                    <IconButton
                                                      padding="0px"
                                                      style={{
                                                        paddingRight: "0px",
                                                      }}
                                                      disabled={state.agregar == "Consultar"}
                                                      onClick={() => {
                                                        setState({
                                                          ...state,
                                                          identificadorModal:
                                                            "operador",
                                                          tipoModal: 2,
                                                          openDialog: true
                                                        });
                                                      }}
                                                    >
                                                      <PageviewIcon
                                                        style={{
                                                          color: "#F9A03E",
                                                          fontSize: 32,
                                                          paddingInlineEnd: 0,
                                                          paddingRight: 0,
                                                          paddingBlockEnd: 0,
                                                          paddingLeft: 0,
                                                          paddingBlock: 0,
                                                        }}
                                                      />
                                                    </IconButton>
                                                  </InputAdornment>
                                                ),
                                              }}
                                            />
                                          </div>
                                        )}
                                      />
                                    </div>
                                  </div>
                                  {/* --------------------------------------- TipoUnidad ------------------------------------------------- */}
                                  <div className="col-sm-4 col-md-4 unit">
                                    <label className="label">
                                      Tipo de Unidad
                                    </label>
                                    <div className="input">
                                      <Autocomplete
                                        freeSolo
                                        onChange={(event, newValue) =>
                                          setState({
                                            ...state,
                                            tipoUnidad: newValue,
                                          })
                                        }
                                        value={state.tipoUnidad}
                                        id="tipoUnidad"
                                        disableClearable
                                        forcePopupIcon={false}
                                        options={dataTipoUnidad}
                                        disabled={state.agregar == "Consultar"}
                                        getOptionLabel={(option) =>
                                          option.m_sTipoUnidad
                                        }
                                        variant="outlined"
                                        style={{
                                          borderWidth: "1px",
                                          borderColor: "#dddddd",
                                          borderStyle: "solid",
                                          borderRadius: "5px",
                                        }}
                                        renderInput={(params) => (
                                          <div>
                                            <TextField
                                              required
                                              {...params}
                                              InputProps={{
                                                ...params.InputProps,
                                                style: { height: "33px", fontSize: "14px" },
                                                type: "search",
                                                disabled: state.agregar == "Consultar",
                                                disableUnderline: true,
                                                endAdornment: (
                                                  <InputAdornment position="end">
                                                    <IconButton
                                                      padding="0px"
                                                      style={{
                                                        paddingRight: "0px",
                                                      }}
                                                      disabled={state.agregar == "Consultar"}
                                                      onClick={() => {
                                                        setState({
                                                          ...state,
                                                          identificadorModal:
                                                            "tipoUnidad",
                                                          tipoModal: 3,
                                                          openDialog: true
                                                        });
                                                      }}
                                                    >
                                                      <PageviewIcon
                                                        style={{
                                                          color: "#F9A03E",
                                                          fontSize: 32,
                                                          paddingInlineEnd: 0,
                                                          paddingRight: 0,
                                                          paddingBlockEnd: 0,
                                                          paddingLeft: 0,
                                                          paddingBlock: 0,
                                                        }}
                                                      />
                                                    </IconButton>
                                                  </InputAdornment>
                                                ),
                                              }}
                                            />
                                          </div>
                                        )}
                                      />
                                    </div>
                                  </div>
                                  {/* --------------------------------------- Unidad ------------------------------------------------- */}
                                  <div className="col-sm-4 col-md-4 unit">
                                    <label className="label">Unidad</label>
                                    <div className="input">
                                      <Autocomplete
                                        freeSolo
                                        onChange={(event, newValue) =>
                                          setState({
                                            ...state,
                                            unidad: newValue,
                                          })
                                        }
                                        id="unidad"
                                        disableClearable
                                        forcePopupIcon={false}
                                        options={dataUnidad}
                                        value={state.unidad}
                                        disabled={state.agregar == "Consultar"}
                                        getOptionLabel={(option) =>
                                          option.m_sDescripcion
                                        }
                                        variant="outlined"
                                        style={{
                                          borderWidth: "1px",
                                          borderColor: "#dddddd",
                                          borderStyle: "solid",
                                          borderRadius: "5px",
                                        }}
                                        renderInput={(params) => (
                                          <div>
                                            <TextField
                                              required
                                              {...params}
                                              InputProps={{
                                                ...params.InputProps,
                                                style: { height: "33px", fontSize: "14px" },
                                                type: "search",
                                                disabled: state.agregar == "Consultar",
                                                disableUnderline: true,
                                                endAdornment: (
                                                  <InputAdornment position="end">
                                                    <IconButton
                                                      padding="0px"
                                                      style={{
                                                        paddingRight: "0px",
                                                      }}
                                                      disabled={state.agregar == "Consultar"}
                                                      onClick={() => {
                                                        setState({
                                                          ...state,
                                                          identificadorModal:
                                                            "unidad",
                                                          tipoModal: 4,
                                                          openDialog: true
                                                        });
                                                      }}
                                                    >
                                                      <PageviewIcon
                                                        style={{
                                                          color: "#F9A03E",
                                                          fontSize: 32,
                                                          paddingInlineEnd: 0,
                                                          paddingRight: 0,
                                                          paddingBlockEnd: 0,
                                                          paddingLeft: 0,
                                                          paddingBlock: 0,
                                                        }}
                                                      />
                                                    </IconButton>
                                                  </InputAdornment>
                                                ),
                                              }}
                                            />
                                          </div>
                                        )}
                                      />
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                          <div className="col-md-6">
                            <div className="widget-header">
                              <h2>Salida para la Recolección</h2>
                            </div>
                            <div className="widget-container">
                              <div className="widget-content">
                                <div className="col-md-12">
                                  <label className="label">Fecha y Hora</label>
                                  <div className="input">
                                    <input
                                      onChange={handleChange}
                                      className="form-control"
                                      type="datetime-local"
                                      required
                                      value={state.fechaHoraSalida}
                                      disabled={state.agregar == "Consultar"}
                                      id="fechaHoraSalida"
                                    />
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                          <div className="col-md-6">
                            <div className="widget-header">
                              <h2>Llegada de la Recolección</h2>
                            </div>
                            <div className="widget-container">
                              <div className="widget-content">
                                <div className="col-md-12">
                                  <label className="label">Fecha y Hora</label>
                                  <div className="input">
                                    <input
                                      onChange={handleChange}
                                      className="form-control"
                                      type="datetime-local"
                                      required
                                      value={state.fechaHoraLlegada}
                                      disabled={state.agregar == "Consultar"}
                                      id="fechaHoraLlegada"
                                    />
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="widget-wrap col-sm-5 col-md-5 " id="paquetesSobres">
                      {" "}
                      <div className="widget-header">
                        <h2>Número de Paquetes</h2>
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
                                  ></Carousel>
                                </div>
                              </form>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="widget-header">
                        <h2>Número de Sobres</h2>
                      </div>
                      <div className="widget-container">
                        <div className="widget-content">
                          <div className="row">
                            <div className="col-md-12">
                              <form className="j-forms">
                                <div className="form-content">
                                  <Carousel
                                    className={classes.sobreCarrusel}
                                    widgets={[IndicatorDots, Buttons]}
                                    frames={framesSobre}
                                  ></Carousel>
                                </div>
                              </form>
                            </div>
                          </div>
                        </div>
                      </div>
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
                      disabled={state.agregar == "Consultar"}
                    >
                      Aceptar
                    </button>
                  </div>

                </div>
              </form>
            </div>

            <div id="Cancelar" className="tab-pane fade">
              <div className="widget-wrap">
                <div className="widget-content">
                  <div className="row">
                    <form className="j-forms" onSubmit={handleCancelar}>
                      <div className="form-content">
                        <div className="widget-wrap">
                          <div className="widget-container">
                            <div className="widget-content">
                              <div className="col-sm-6 col-md-2-5 col-lg-2-5 unit">
                                <label className="label">Folio Recolección</label>
                                <div className="input">
                                  <input
                                    onChange={handleChange}
                                    className="form-control"
                                    type="text"
                                    value={state.folioRecoleccion}
                                    id="folioRecoleccion"
                                    readOnly
                                  />
                                </div>
                              </div>

                              <div className="col-sm-6 col-md-2-5 col-lg-2-5 unit">
                                <label className="label">Sucursal</label>
                                <div className="input">
                                  <input
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
                                  <input
                                    onChange={handleChange}
                                    className="form-control"
                                    type="text"
                                    value={state.fechaCancelacion}
                                    id="fechaCancelacion"
                                    readOnly
                                  />
                                </div>
                              </div>

                              <div className="col-sm-6 col-md-2-5 col-lg-2-5 unit">
                                <label className="label">Usuario</label>
                                <div className="input">
                                  <input
                                    onChange={handleChange}
                                    className="form-control"
                                    type="text"
                                    value={state.usuario}
                                    id="usuario"
                                    readOnly
                                  />
                                </div>
                              </div>

                              <div className="col-sm-6 col-md-2-5 col-lg-2-5 unit">
                                <label className="label">Estatus</label>
                                <div className="input">
                                  <input
                                    onChange={handleChange}
                                    className="form-control"
                                    type="text"
                                    value={state.estatusRecoleccion}
                                    id="estatusRecoleccion"
                                    readOnly
                                  />
                                </div>
                              </div>


                              <div className="col-sm-12 col-md-12 col-lg-12 unit">
                                <label className="label">Motivo</label>
                                <div className="input">
                                  <input
                                    onChange={handleChange}
                                    className="form-control"
                                    type="text"
                                    value={state.motivoCancelacion}
                                    id="motivoCancelacion"
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
      </section>
    </div>
  );
}

export default Recoleccion;
