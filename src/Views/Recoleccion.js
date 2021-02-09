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
import { render } from 'react-dom';
import useModal from 'react-hooks-use-modal';
import IconButton from '@material-ui/core/IconButton';
import PageviewIcon from '@material-ui/icons/Pageview';
import Autocomplete from "@material-ui/lab/Autocomplete";
import TextField from "@material-ui/core/TextField";
import InputAdornment from '@material-ui/core/InputAdornment';
import {
  useTable,
  useFilters,
  useGlobalFilter,
  useAsyncDebounce,
  useSortBy,
} from "react-table";
import $ from "jquery";
import { remove_array_element } from "../Util/Util";
window.jQuery = window.$ = $;

const useStyles = makeStyles({
  myComponent: {
    "& .MuiIconButton-root": {
      padding: 0
    }
  }, paqueteCarrusel: {
    height: "400px !important",
  },
  sobreCarrusel: {
    height: "150px !important"
  }
});
function Recoleccion() {
  const classes = useStyles();
  const [data, setData] = React.useState([]);
  const [dataSucursal, setDataSucursal] = React.useState([]);
  const [dataEstatusRecoleccion, setEstatusRecoleccion] = React.useState([]);
  const [dataTipoMoneda, setDataTipoMoneda] = React.useState([]);
  const [dataTipoCobro, setDataTipoCobro] = React.useState([]);
  const [dataCiudad, setDataCiudad] = React.useState([]);
  const [dataCodigoPostal, setDataCodigoPostal] = React.useState([]);
  const [dataOperador, setDataOperador] = React.useState([]);
  const [dataTipoUnidad, setDataTipoUnidad] = React.useState([]);
  const [dataUnidad, setDataUnidad] = React.useState([]);
  const [state, setState] = React.useState({
    showPopUp: false,
    identificadorModal: "",
    DerechoBorrar: 133,
    agregar: "Agregar",
    idRecoleccion: 0,
    fechaInicial: "",
    fechaIcinial2: "",
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
    nombreRemitente: "",
    RFCRemitente: "",
    domicilioRemitente: "",
    codigoPostalRemitente: {},
    ciudadRemitente: 0,
    correoRemitente: "",
    telefonoRemitente: "",
    contactoRemitente: "",
    origenRemitente: 0,
    nombreDestinatario: "",
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
    zonaRecoleccion: "",
    domicilioRecoleccion: "",
    recogerEn: "",
    datosAdicionalesRecoleccion: "",
    codigoPostalEntrega: "",
    ciudadEntrega: 0,
    zonaEntrega: "",
    domicilioEntrega: "",
    entregaEn: "",
    datosAdicionalesEntrega: "",
    cantidadDePaquetes: 0,
    cantidadDeSobres: 0,
    diferenteRecoleccion: true,
    diferenteEntrega: true,
    operador: 0,
    tipoUnidad: 0,
    unidad: 0,
    CreadoPor: localStorage.getItem("UsuarioId"),
    ModificadoPor: localStorage.getItem("UsuarioId"),
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
    height: window.innerHeight,
  });
  const [fileUploaded, setFileUploaded] = React.useState([]);
  const [stepActive, setStepActive] = React.useState(1);
  const [Modal, open, close, isOpen] = useModal("root", {
    preventScroll: true,
  });

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
      "m_sNombreRemitente": state.nombreRemitente,
      "m_sNombreDestinatario": state.nombreDestinatario,
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
      "m_nIdCiudadOrigen": state.ciudadRemitente,
      "m_nIdCiudadDestino": state.ciudadDestinatario,
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
      "m_nIdOperador": state.operador,
      "m_nIdUnidad": state.unidad,
      "m_nIdRemolqueLlegadaRecoleccion": state.tipoUnidad,
      "m_nCreadoPor": state.CreadoPor,
      "m_nModificadoPor": state.ModificadoPor

    }
    console.log(params)
    if (state.idRecoleccion != 0) {
      const url = `${process.env.REACT_APP_API_URL}/Recoleccion/Modificar/${state.idRecoleccion}`;
      axios
        .put(url, Object.assign({}, params), { headers })
        .then((respuesta) => {
          alert(respuesta.data);
          getAllData();
        })
        .catch((err) => {
          console.log(err);
          alert("err");
        });
    } else {
      debugger;
      const url = `${process.env.REACT_APP_API_URL}/Recoleccion/Agregar`;
      axios
        .post(url, Object.assign({}, params), { headers })
        .then((respuesta) => {
          console.log(respuesta.data);
          alert(respuesta.data);
          getAllData();
        })
        .catch((err) => {
          console.log(err);
          alert(err);
        });
    }
  };



  function handleSelectCP(id, cp) {
    setState({
      ...state,
      [state.identificadorModal]: id
    });
    console.log(id)
  }

  function addPaquete() {
    const { paquetes } = state;
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
    console.log(paquetes);
    setState({ ...state, paquetes: paquetes });
  }

  function removePaquete(index) {
    var { paquetes } = state;
    paquetes = remove_array_element(paquetes, index);
    console.log(paquetes);
    setState({ ...state, paquetes: paquetes });
  }

  function addSobre() {
    const { sobres } = state;
    sobres.push({
      descripcion: "",
    });
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
    axios.get(urlDelete, { headers }).then(respuesta => {
      //alert(respuesta.data)

      derecho = respuesta.data;
      if (derecho == false) {
        alert("El usuario no tiene derechos para realizar el proceso");
        return;
      }

      const url = `${process.env.REACT_APP_API_URL}/Recoleccion/Eliminar/` + id;
      axios
        .delete(url, { headers })
        .then((respuesta) => {
          alert(respuesta.data);
          getAllData();
        })
        .catch((err) => {
          alert(err);
        });
    }).catch(err => {
      alert(err)
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
        showPopUp: true,
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
        nombreRemitente: respuesta.data.m_sNombreRemitente,
        RFCRemitente: respuesta.data.m_sRFCRemitente,
        domicilioRemitente: respuesta.data.m_sDomicilioRemitente,
        codigoPostalRemitente: respuesta.data.m_sIdCodigoPostalRemitente,
        ciudadRemitente: respuesta.data.m_nIdCiudadRemitente,
        correoRemitente: respuesta.data.m_sCorreoRemitente,
        telefonoRemitente: respuesta.data.m_sTelefonoRemitente,
        contactoRemitente: respuesta.data.m_sContactoRemitente,
        origenRemitente: respuesta.data.m_nIdCiudadOrigen,
        nombreDestinatario: respuesta.data.m_sNombreDestinatario,
        RFCDestinatario: respuesta.data.m_sRFCDestinatario,
        domicilioDestinatario: respuesta.data.m_sDomicilioDestinatario,
        codigoPostalDestinatario: respuesta.data.m_sIdCodigoPostalDestinatario,
        ciudadDestinatario: respuesta.data.m_nIdCiudadDestinatario,
        correoDestinatario: respuesta.data.m_sCorreoDestinatario,
        telefonoDestinatario: respuesta.data.m_sTelefonoDestinatario,
        contactoDestinatario: respuesta.data.m_sContactoDestinatario,
        destinoDestinatario: respuesta.data.m_nIdCiudadDestino,
        ciudadRemitente: respuesta.data.m_nIdCiudadRemitente,
        ciudadDestinatario: respuesta.data.m_nIdCiudadDestinatario,
        codigoPostalRecoleccion: respuesta.data.m_sIdCodigoPostalRemitente,
        ciudadRecoleccion: respuesta.data.m_nIdCiudadDetalleRecoleccion,
        zonaRecoleccion: respuesta.data.m_nIdZonaDetalleRecoleccion,
        domicilioRecoleccion: respuesta.data.m_sDomicilioDetalleRecoleccion,
        recogerEn: respuesta.data.m_sRecogerEnDetalleRecoleccion,
        datosAdicionalesRecoleccion:
          respuesta.data.m_sDatosAdicionalesDetalleRecoleccion,
        codigoPostalEntrega: respuesta.data.m_sIdCodigoPostalRemitente,
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
        showPopUp: true,
        idRecoleccion: id,
        idSucursalAgregar: respuesta.data.m_nIdSucursal,
        folioRecoleccion: respuesta.data.m_sFolioRecoleccion,
        folioEmbarque: respuesta.data.m_nIdEmbarque,
        folioGuía: respuesta.data.m_nIdGuia,
        folioInforme: respuesta.data.m_nIdInforme,
        fechaHoraCreacion: respuesta.data.m_dFecha + "T" + respuesta.data.m_tHora.slice(0, 5),
        estatusRecoleccion: respuesta.data.m_nIdEstatusRecoleccion,
        moneda: respuesta.data.m_nMoneda,
        tipoCambio: respuesta.data.m_rTipoCambio,
        tipoCobro: respuesta.data.m_nIdTipoDeCobro,
        nombreRemitente: respuesta.data.m_sNombreRemitente,
        RFCRemitente: respuesta.data.m_sRFCRemitente,
        domicilioRemitente: respuesta.data.m_sDomicilioRemitente,
        codigoPostalRemitente: respuesta.data.m_sIdCodigoPostalRemitente,
        ciudadRemitente: respuesta.data.m_nIdCiudadRemitente,
        correoRemitente: respuesta.data.m_sCorreoRemitente,
        telefonoRemitente: respuesta.data.m_sTelefonoRemitente,
        contactoRemitente: respuesta.data.m_sContactoRemitente,
        origenRemitente: respuesta.data.m_nIdCiudadOrigen,
        nombreDestinatario: respuesta.data.m_sNombreDestinatario,
        RFCDestinatario: respuesta.data.m_sRFCDestinatario,
        domicilioDestinatario: respuesta.data.m_sDomicilioDestinatario,
        codigoPostalDestinatario: respuesta.data.m_sIdCodigoPostalDestinatario,
        ciudadDestinatario: respuesta.data.m_nIdCiudadDestinatario,
        correoDestinatario: respuesta.data.m_sCorreoDestinatario,
        telefonoDestinatario: respuesta.data.m_sTelefonoDestinatario,
        contactoDestinatario: respuesta.data.m_sContactoDestinatario,
        destinoDestinatario: respuesta.data.m_nIdCiudadDestino,
        ciudadRemitente: respuesta.data.m_nIdCiudadRemitente,
        ciudadDestinatario: respuesta.data.m_nIdCiudadDestinatario,
        codigoPostalRecoleccion: respuesta.data.m_sIdCodigoPostalRemitente,
        ciudadRecoleccion: respuesta.data.m_nIdCiudadDetalleRecoleccion,
        zonaRecoleccion: respuesta.data.m_nIdZonaDetalleRecoleccion,
        domicilioRecoleccion: respuesta.data.m_sDomicilioDetalleRecoleccion,
        recogerEn: respuesta.data.m_sRecogerEnDetalleRecoleccion,
        datosAdicionalesRecoleccion:
          respuesta.data.m_sDatosAdicionalesDetalleRecoleccion,
        codigoPostalEntrega: respuesta.data.m_sIdCodigoPostalRemitente,
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

  function handleShowAgregar() {
    setState({
      ...state,
      agregar: "Agregar",
      showPopUp: true,

      folioRecoleccion: "",
      folioEmbarque: "",
      folioGuía: "",
      folioInforme: "",
      fechaHoraCreacion: "",
      estatusRecoleccion: 0,
      moneda: dataTipoMoneda[0].m_nIdMoneda,
      tipoCambio: "",
      tipoCobro: dataTipoCobro[0].m_nIdTipoCobro,
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
      zonaRecoleccion: "",
      domicilioRecoleccion: "",
      recogerEn: "",
      datosAdicionalesRecoleccion: "",
      codigoPostalEntrega: dataCodigoPostal[0],
      ciudadEntrega: dataCiudad[0].m_nIdCiudad,
      zonaEntrega: "",
      domicilioEntrega: "",
      entregaEn: "",
      datosAdicionalesEntrega: "",
      cantidadDePaquetes: 0,
      cantidadDeSobres: 0,
      operador: dataOperador[0].m_nIdOperador,
      unidad: dataUnidad[0].m_nIdUnidad,
    });
  }

  const handleChange = (event) => {
    console.log(event.target.id + " : " + event.target.value);
    setState({
      ...state,
      [event.target.id]: event.target.value,
    });
  };

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

  const handleSelectChange = (event) => {
    getAllUnidades(event.target.value);
  };

  const columns = React.useMemo(() => [
    {
      Name: "Folio",
      accessor: "m_sFolioRecoleccion",
    },
    {
      Name: "Fecha Elaboración",
      accessor: "m_dFecha",
    },
    {
      Name: "Fecha Recolección",
      accessor: "m_dFechaSalidaSalidaRecoleccion",
    },
    {
      Name: "Sucursal",
      accessor: "m_nIdSucursal",
    },
    {
      Name: "Zona Recolección",
      accessor: "m_nIdZonaDetalleRecoleccion",
    },
    {
      Name: "Recoger En",
      accessor: "m_sRecogerEnDetalleRecoleccion",
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

  useEffect((value) => {
    if (localStorage.getItem("UsuarioId") === null || localStorage.getItem("UsuarioId") <= 0) {
      alert("Es necesario iniciar sesion para acceder a este proceso");
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
  }, []);

  function getAllData() {
    const url = `${process.env.REACT_APP_API_URL}/Recoleccion/GetListado`;
    axios.get(url, { headers }).then((respuesta) => {
      console.log(respuesta.data);
      setData(respuesta.data);
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

  function getAllCodigosPostales() {
    const url = `${process.env.REACT_APP_API_URL}/CodigoPostal/GetListado`;
    axios.get(url, { headers }).then((respuesta) => {
      setDataCodigoPostal(respuesta.data);
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
      state,
      preGlobalFilteredRows,
      setGlobalFilter,
    } = useTable(
      {
        columns,
        data,
        defaultColumn,
      },
      useFilters,
      useGlobalFilter,
      useSortBy
    );

    return (
      <div className="col-md-12">
        <table className="table" {...getTableProps()}>
          <thead>
            {headerGroups.map((headerGroup) => (
              <tr {...headerGroup.getHeaderGroupProps()}>
                <th>Acciones</th>
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
                  <tr {...row.getRowProps()}>
                    <td>
                      <div>
                        <a href="#Agregar" role="tab" data-toggle="tab" onClick={() => (handleShowModificar(row.original.m_nIdRecoleccion))} className="btn btn-default btn-sm"><i className="fa fa-pencil-square-o" style={{ color: "#F9A03E" }} /></a>
                        <a href="#Agregar" role="tab" data-toggle="tab" className="btn btn-default btn-sm" onClick={() => (handleShowConsultar(row.original.m_nIdRecoleccion))}><i className="fa fa-eye" style={{ color: "#F9A03E" }} /></a>
                        <a href="#" className="btn btn-default btn-sm" onClick={() => (handleEliminar(row.original.m_nIdRecoleccion))}><i className="zmdi zmdi-delete" style={{ color: "#F30B0B" }} /></a>
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
    );
  }

  function TableCodigoPostal({ columns, data }) {
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
      preGlobalFilteredRows,
      setGlobalFilter,
    } = useTable(
      {
        columns,
        data,
        defaultColumn,
      },
      useFilters,
      useGlobalFilter,
      useSortBy
    );

    return (
      <div className="col-md-12">
        <table className="table" {...getTableProps()}>
          <thead>
            {headerGroups.map((headerGroup) => (
              <tr {...headerGroup.getHeaderGroupProps()}>
                <th>Acciones</th>
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
                  <tr {...row.getRowProps()} onClick={handleSelectCP.bind(this, row.original)}>
                    <td>
                      <div>
                        <a href="#Agregar" role="tab" data-toggle="tab" onClick={() => (handleShowModificar(row.original.m_nIdRecoleccion))} className="btn btn-default"><i className="fa fa-pencil-square-o" style={{ color: "#F9A03E" }} /></a>
                        <a href="#" className="btn btn-default btn-sm m-user-delete" onClick={() => (handleEliminar(row.original.m_nIdRecoleccion))}><i className="zmdi zmdi-delete" style={{ color: "#F30B0B" }} /></a>
                        <a href="#" className="btn btn-default btn-sm m-user-delete" onClick={() => (handleEliminar(row.original.m_nIdRecoleccion))}><i className="fa fa-eye" style={{ color: "#F9A03E" }} /></a>
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
        <div className="col-sm-4 col-md-2-5 unit">
          <label className="label">Peso</label>
          <div className="input">
            <input
              onChange={(event) => handleChangePaquete(event, index)}
              className="form-control"
              type="text"
              value={state.paquetes[index].m_rPeso}
              placeholder="Peso"
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
              placeholder="Largo"
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
              placeholder="Ancho"
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
              placeholder="Alto"
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
              placeholder="Volumen"
              name="m_rVolumen"
            />
          </div>
        </div>

        <div className="col-sm-4 col-md-6 unit">
          <label className="label">Tipo de Embalaje</label>
          <div className="input">
            <input
              onChange={(event) => handleChangePaquete(event, index)}
              className="form-control"
              type="text"
              value={state.paquetes[index].m_nIdTipoEmbalaje}
              placeholder="Tipo de Embarje"
              name="m_nIdTipoEmbalaje"
            />
          </div>
        </div>

        <div className="col-sm-4 col-md-6 unit">
          <label className="label">Valor Declarado</label>
          <div className="input">
            <input
              onChange={(event) => handleChangePaquete(event, index)}
              className="form-control"
              type="text"
              value={state.paquetes[index].m_cyValorDeclarado}
              placeholder="Valor Declarado"
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
              placeholder="Observaciones"
              name="m_sObservaciones"
            />
          </div>
        </div>
        {state.paquetes.length !== 1 && (
          <a className="btn delete" onClick={() => removePaquete(index)}>
            <i className="zmdi zmdi-delete"></i> Eliminar Paquete
          </a>
        )}
      </div>
    );
  });

  const framesSobre = state.sobres.map((p, index) => {
    return (
      <div key={`sobre${index}`}>
        <div className="col-md-12 unit">
          <label className="label">Descripcion</label>
          <div className="input">
            <input
              onChange={(event) => handleChangeSobre(event, index)}
              className="form-control"
              type="text"
              value={state.sobres[index].m_sDescripcion}
              placeholder="Descripción"
              name="m_sDescripcion"
            />
          </div>
        </div>
        {state.sobres.length !== 1 && (
          <a className="btn delete" onClick={() => removeSobre(index)}>
            <i className="zmdi zmdi-delete"></i> Eliminar Sobre
          </a>
        )}
      </div>
    );
  });

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
              <a data-toggle="tab" href="#Importar">
                <i className="fa fa-upload" /> Importar
              </a>
            </li>
            <li>
              <ExportCSV csvData={data} fileName="Departamento_Listado" />
            </li>
            <li>
              <ExportPDF data={data} column={columns} fileName="Departamento" />
            </li>
          </ul>

          <div className="row" className="tab-content" style={{ paddingLeft: "-15px" }}>
            <div id="Listado" className="tab-pane fade in active">
              <div className="widget-wrap">
                <div className="widget-content">
                  <div>
                    <form className="j-forms">
                      <div className="form-content">
                        <div className="col-sm-6 col-md-3 unit">
                          <label className="label">Fecha Inicial</label>
                          <div className="input">
                            <input type="date" className="form-control" />
                          </div>
                        </div>

                        <div className="col-sm-6 col-md-3 unit">
                          <label className="label">Fecha Inicial</label>
                          <div className="input">
                            <input
                              type="date"
                              className="form-control"
                              onChange={handleChange}
                              id="fechaInicial"
                            />
                          </div>
                        </div>

                        <div className="col-sm-6 col-md-3 unit">
                          <label className="label">Sucursal</label>
                          <label className="input select">
                            <select
                              className="form-control"
                              required
                              onChange={handleChange}
                              id="sucursal"

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
                              onChange={handleChange}
                              id="estatus"
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
                            <i></i>
                          </label>
                        </div>
                      </div>
                    </form>
                  </div>
                  <div className="row">
                    {conDatos() ? (
                      <Table columns={columns} data={data} />
                    ) : (
                        <div>No se encontró ningún registro</div>
                      )}
                  </div>
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
                          "col-md-2-5 col-sm-2 step " +
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
                          "col-md-2-5 col-sm-2 step " +
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
                          "col-md-2-5 col-sm-2 step " +
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
                          "col-md-2-5 col-sm-2 step " +
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
                          "col-md-2-5 col-sm-2 step " +
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
                            <div className="col-sm-4 col-md-2-5 unit">
                              <label className="label">Sucursal</label>
                              <label className="input select">
                                <select
                                  className="form-control"
                                  required
                                  value={state.idSucursalAgregar}
                                  readOnly={state.agregar == "Consultar"}
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
                                <i className="fa fa-arrow-down" />
                              </label>
                            </div>

                            <div className="col-sm-4 col-md-2-5 unit">
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

                            <div className="col-sm-4 col-md-2-5 unit">
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

                            <div className="col-sm-4 col-md-2-5 unit">
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

                            <div className="col-sm-4 col-md-2-5 unit">
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

                            <div className="col-sm-4 col-md-2-5 unit">
                              <label className="label">Fecha / Hora</label>
                              <div className="input">
                                <input
                                  onChange={handleChange}
                                  type="datetime-local"
                                  required
                                  value={state.fechaHoraCreacion}
                                  readOnly={state.agregar == "Consultar"}
                                  className="form-control"
                                  id="fechaHoraCreacion"
                                />
                              </div>
                            </div>

                            <div className="col-sm-4 col-md-2-5 unit">
                              <label className="label">
                                Estatus de la Recolección
                              </label>
                              <label className="input select">
                                <select
                                  className="form-control"
                                  required
                                  value={state.estatus}
                                  readOnly={state.agregar == "Consultar"}
                                  onChange={handleChange}
                                  id="estatus"
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

                            <div className="col-sm-4 col-md-2-5 unit">
                              <label className="label">Moneda</label>
                              <label className="input select">
                                <select
                                  className="form-control"
                                  required
                                  value={state.moneda}
                                  readOnly={state.agregar == "Consultar"}
                                  onChange={handleChange}
                                  id="moneda"
                                >
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

                            <div className="col-sm-4 col-md-2-5 unit">
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
                                  readOnly={state.agregar == "Consultar"}
                                  id="tipoCambio"
                                />
                              </div>
                            </div>

                            <div className="col-sm-4 col-md-2-5 unit">
                              <label className="label">Tipo Cobro</label>
                              <label className="input select">
                                <select
                                  className="form-control"
                                  required
                                  value={state.tipoCobro}
                                  readOnly={state.agregar == "Consultar"}
                                  onChange={handleChange}
                                  id="tipoCobro"
                                >
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
                                    <div className="col-sm-4 col-md-12 unit">
                                      <label className="label">
                                        Nombre
                                  </label>
                                      <div className="input">
                                        <input
                                          onChange={handleChange}
                                          className="form-control"
                                          type="text"
                                          required
                                          value={state.nombreRemitente}
                                          readOnly={state.agregar == "Consultar"}
                                          id="nombreRemitente"
                                        />
                                      </div>
                                    </div>
                                    {/* --------------------------------------- RFC -------------------------------------- */}
                                    <div className="col-sm-4 col-md-12 unit">
                                      <label className="label">
                                        RFC
                                  </label>
                                      <div className="input">
                                        <input
                                          onChange={handleChange}
                                          className="form-control"
                                          type="text"
                                          pattern="[A-Z&Ñ]{3,4}[0-9]{2}(0[1-9]|1[012])(0[1-9]|[12][0-9]|3[01])[A-Z0-9]{2}[0-9A]"
                                          title="Favor de introducir un RFC válido."
                                          required
                                          value={state.RFCRemitente}
                                          readOnly={state.agregar == "Consultar"}
                                          id="RFCRemitente"
                                        />
                                      </div>
                                    </div>
                                    {/* --------------------------------------- Domicilio -------------------------------------- */}
                                    <div className="col-sm-4 col-md-12 unit">
                                      <label className="label">Domicilio</label>
                                      <div className="input">
                                        <input
                                          onChange={handleChange}
                                          className="form-control"
                                          type="text"
                                          required
                                          value={state.domicilioRemitente}
                                          readOnly={state.agregar == "Consultar"}
                                          id="domicilioRemitente"
                                        />
                                      </div>
                                    </div>
                                    {/* --------------------------------------- AutocompleteCPRemitente -------------------------------------- */}
                                    <div className="col-sm-4 col-md-6 unit" >
                                      <label className="label">Código Postal</label>
                                      <div className="input">
                                        <Autocomplete
                                          freeSolo
                                          onChange={(event, newValue) =>
                                            setState({
                                              ...state,
                                              codigoPostalRemitente: newValue,
                                            })
                                          }
                                          value={state.codigoPostalRemitente}
                                          readOnly={state.agregar == "Consultar"}
                                          id="codigoPostalRemitente"
                                          disableClearable
                                          forcePopupIcon={false}
                                          options={dataCodigoPostal}
                                          getOptionLabel={(option) =>
                                            option.m_sCP
                                          }
                                          variant="outlined"
                                          style={{ borderWidth: "1px", borderColor: "#dddddd", borderStyle: "solid", borderRadius: "5px", width: "124px" }}
                                          renderInput={(params) => (
                                            <div>
                                              <TextField
                                                {...params}
                                                InputProps={{
                                                  ...params.InputProps,
                                                  style: { height: 24 },
                                                  type: "search",
                                                  value: state.codigoPostalRemitente,
                                                  readOnly: state.agregar == "Consultar",
                                                  endAdornment:
                                                    <InputAdornment position="end">
                                                      <IconButton padding="0px" onClick={() => { open(); setState({ ...state, identificadorModal: "codigoPostalRemitente" }) }}>
                                                        <PageviewIcon style={{ color: "#F9A03E", fontSize: 32, paddingInlineEnd: 0, paddingRight: 0, paddingBlockEnd: 0, paddingLeft: 0, paddingBlock: 0 }} />
                                                      </IconButton>
                                                    </InputAdornment>
                                                }}
                                              />
                                            </div>
                                          )}
                                        />

                                      </div>
                                    </div>
                                    <Modal>
                                      <div className="row" style={{ backgroundColor: '#FFFFFF' }}>
                                        {dataCodigoPostal.length != 0 ? <TableCodigoPostal columns={columnsCP} data={dataCodigoPostal} identificadorModal={state.identificadorModal} /> : <div>No se encontró ningún registro</div>}
                                        <a onClick={close}>Cerrar</a>
                                        <a href="/Ciudades">Agregar</a>
                                      </div>
                                    </Modal>

                                    {/* --------------------------------------- Ciudad ------------------------------------------------- */}
                                    <div className="col-sm-4 col-md-6 unit">
                                      <label className="label">Ciudad</label>
                                      <label className="input select">
                                        <select
                                          className="form-control"
                                          required
                                          value={state.ciudadRemitente}
                                          readOnly={state.agregar == "Consultar"}
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
                                    <div className="col-sm-4 col-md-12 unit">
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
                                          readOnly={state.agregar == "Consultar"}
                                          id="correoRemitente"
                                        />
                                      </div>
                                    </div>
                                    {/* --------------------------------------- Telefono ------------------------------------------------- */}
                                    <div className="col-sm-4 col-md-12 unit">
                                      <label className="label">
                                        Teléfono
                                  </label>
                                      <div className="input">
                                        <input
                                          onChange={handleChange}
                                          className="form-control"
                                          type="text"
                                          pattern="[0-9]{10}"
                                          maxLength="10"
                                          required
                                          value={state.telefonoRemitente}
                                          readOnly={state.agregar == "Consultar"}
                                          id="telefonoRemitente"
                                        />
                                      </div>
                                    </div>
                                    {/* --------------------------------------- Contacto ------------------------------------------------- */}
                                    <div className="col-sm-4 col-md-12 unit">
                                      <label className="label">
                                        Contacto
                                  </label>
                                      <div className="input">
                                        <input
                                          onChange={handleChange}
                                          className="form-control"
                                          type="text"
                                          required
                                          value={state.contactoRemitente}
                                          readOnly={state.agregar == "Consultar"}
                                          id="contactoRemitente"
                                        />
                                      </div>
                                    </div>
                                    {/* --------------------------------------- Origen ------------------------------------------------- */}
                                    <div className="col-sm-12 col-md-12 unit">
                                      <label className="label">
                                        Origen
                                </label>
                                      <label className="input select">
                                        <select
                                          className="form-control"
                                          required
                                          value={state.origenRemitente}
                                          readOnly={state.agregar == "Consultar"}
                                          onChange={handleChange}
                                          id="origenRemitente"
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
                                          readOnly={state.agregar == "Consultar"}
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
                                  <div className="col-sm-4 col-md-6    unit">
                                    <label className="label">Nombre</label>
                                    <div className="input">
                                      <input
                                        onChange={handleChange}
                                        className="form-control"
                                        type="text"
                                        required
                                        value={state.nombreDestinatario}
                                        readOnly={state.agregar == "Consultar"}
                                        id="nombreDestinatario"
                                      />
                                    </div>
                                  </div>

                                  <div className="col-sm-4 col-md-6 unit">
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
                                        readOnly={state.agregar == "Consultar"}
                                        id="RFCDestinatario"
                                      />
                                    </div>
                                  </div>

                                  <div className="col-sm-4 col-md-12 unit">
                                    <label className="label">Domicilio</label>
                                    <div className="input">
                                      <input
                                        onChange={handleChange}
                                        className="form-control"
                                        type="text"
                                        required
                                        value={state.domicilioDestinatario}
                                        readOnly={state.agregar == "Consultar"}
                                        id="domicilioDestinatario"
                                      />
                                    </div>
                                  </div>

                                  <div className="col-sm-4 col-md-6 unit" >
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
                                        readOnly={state.agregar == "Consultar"}
                                        id="codigoPostalDestinatario"
                                        disableClearable
                                        options={dataCodigoPostal}
                                        getOptionLabel={(option) =>
                                          option.m_sCP
                                        }
                                        variant="outlined"
                                        style={{ borderWidth: "1px", borderColor: "#dddddd", borderStyle: "solid", borderRadius: "5px" }}
                                        renderInput={(params) => (
                                          <div>
                                            <TextField
                                              {...params}
                                              InputProps={{
                                                ...params.InputProps,
                                                style: { height: 24 },
                                                type: "search",
                                                endAdornment: <InputAdornment position="end"> <IconButton onClick={() => { open(); setState({ ...state, identificadorModal: "codigoPostalDestinatario" }) }}>
                                                  <PageviewIcon style={{ color: "#F9A03E", fontSize: 32 }} />
                                                </IconButton>  </InputAdornment>
                                              }}
                                            />
                                          </div>
                                        )}
                                      />
                                    </div>
                                  </div>

                                  <div className="col-sm-4 col-md-6 unit">
                                    <label className="label">Ciudad</label>
                                    <label className="input select">
                                      <select
                                        className="form-control"
                                        required
                                        value={state.ciudadDestinatario}
                                        readOnly={state.agregar == "Consultar"}
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

                                  <div className="col-sm-4 col-md-12 unit">
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
                                        readOnly={state.agregar == "Consultar"}
                                        id="correoDestinatario"
                                      />
                                    </div>
                                  </div>

                                  <div className="col-sm-4 col-md-12 unit">
                                    <label className="label">
                                      Teléfono
                                </label>
                                    <div className="input">
                                      <input
                                        onChange={handleChange}
                                        className="form-control"
                                        type="text"
                                        required
                                        value={state.telefonoDestinatario}
                                        readOnly={state.agregar == "Consultar"}
                                        id="telefonoDestinatario"
                                      />
                                    </div>
                                  </div>

                                  <div className="col-sm-4 col-md-6 unit">
                                    <label className="label">Contacto</label>
                                    <div className="input">
                                      <input
                                        onChange={handleChange}
                                        className="form-control"
                                        type="text"
                                        required
                                        value={state.contactoDestinatario}
                                        readOnly={state.agregar == "Consultar"}
                                        id="contactoDestinatario"
                                      />
                                    </div>
                                  </div>

                                  <div className="col-sm-12 col-md-6 unit">
                                    <label className="label">Destino</label>
                                    <label className="input select">
                                      <select
                                        className="form-control"
                                        required
                                        value={state.destinoDestinatario}
                                        readOnly={state.agregar == "Consultar"}
                                        onChange={handleChange}
                                        id="destinoDestinatario"
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
                                      Entrega en Diferente Domicilio
                                  </label>
                                    <div className="input">
                                      <input
                                        onChange={handleEntregaCheckboxChange}
                                        className="form-control"
                                        value={state.diferenteEntrega}
                                        readOnly={state.agregar == "Consultar"}
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
                                        <div className="col-sm-4 col-md-4 unit">
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
                                              readOnly={state.agregar == "Consultar"}
                                              id="fechaRecoleccion"
                                            />
                                          </div>
                                        </div>

                                        <div className="col-sm-4 col-md-5 unit" >
                                          <label className="label">Código Postal</label>
                                          <div className="input">
                                            <Autocomplete
                                              freeSolo
                                              onChange={(event, newValue) =>
                                                setState({
                                                  ...state,
                                                  codigoPostalRecoleccion: newValue,
                                                })
                                              }
                                              value={state.codigoPostalRecoleccion}
                                              readOnly={state.agregar == "Consultar"}
                                              id="codigoPostalRecoleccion"
                                              disableClearable
                                              options={dataCodigoPostal}
                                              getOptionLabel={(option) =>
                                                option.m_sCP
                                              }
                                              variant="outlined"
                                              style={{ borderWidth: "1px", borderColor: "#dddddd", borderStyle: "solid", borderRadius: "5px" }}
                                              renderInput={(params) => (
                                                <div>
                                                  <TextField
                                                    {...params}
                                                    InputProps={{
                                                      ...params.InputProps,
                                                      style: { height: 24 },
                                                      type: "search",
                                                      readOnly: state.agregar == "Consultar",
                                                      endAdornment: <InputAdornment position="end"> <IconButton onClick={() => { open(); setState({ ...state, identificadorModal: "codigoPostalRecoleccion" }) }}>
                                                        <PageviewIcon style={{ color: "#F9A03E", fontSize: 32 }} />
                                                      </IconButton>  </InputAdornment>
                                                    }}
                                                  />
                                                </div>
                                              )}
                                            />
                                          </div>
                                        </div>

                                        <div className="col-sm-4 col-md-4 unit">
                                          <label className="label">Ciudad</label>
                                          <label className="input select">
                                            <select
                                              className="form-control"
                                              required
                                              value={state.ciudadRecoleccion}
                                              readOnly={state.agregar == "Consultar"}
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

                                        <div className="col-sm-4 col-md-4 unit">
                                          <label className="label">Zona</label>
                                          <label className="input select">
                                            <select
                                              className="form-control"
                                              required
                                              value={state.zonaRecoleccion}
                                              readOnly={state.agregar == "Consultar"}
                                              onChange={handleChange}
                                              id="zonaRecoleccion"
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

                                        <div className="col-sm-4 col-md-4 unit">
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
                                              readOnly={state.agregar == "Consultar"}
                                              id="domicilioRecoleccion"
                                            />
                                          </div>
                                        </div>

                                        <div className="col-sm-4 col-md-4 unit">
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
                                              readOnly={state.agregar == "Consultar"}
                                              id="recogerEn"
                                            />
                                          </div>
                                        </div>

                                        <div className="col-sm-4 col-md-4 unit">
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
                                              readOnly={state.agregar == "Consultar"}
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

                                        <div className="col-sm-4 col-md-4 unit" >
                                          <label className="label">Código Postal</label>
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
                                              readOnly={state.agregar == "Consultar"}
                                              id="codigoPostalEntrega"
                                              disableClearable
                                              options={dataCodigoPostal}
                                              getOptionLabel={(option) =>
                                                option.m_sCP
                                              }
                                              variant="outlined"
                                              style={{ borderWidth: "1px", borderColor: "#dddddd", borderStyle: "solid", borderRadius: "5px" }}
                                              renderInput={(params) => (
                                                <div>
                                                  <TextField
                                                    {...params}
                                                    InputProps={{
                                                      ...params.InputProps,
                                                      style: { height: 24 },
                                                      readOnly: state.agregar == "Consultar",
                                                      type: "search",
                                                      endAdornment: <InputAdornment position="end"> <IconButton onClick={() => { open(); setState({ ...state, identificadorModal: "codigoPostalEntrega" }) }}>
                                                        <PageviewIcon style={{ color: "#F9A03E", fontSize: 32 }} />
                                                      </IconButton>  </InputAdornment>
                                                    }}
                                                  />
                                                </div>
                                              )}
                                            />
                                          </div>
                                        </div>

                                        <div className="col-sm-4 col-md-4 unit">
                                          <label className="label">Ciudad</label>
                                          <label className="input select">
                                            <select
                                              className="form-control"
                                              required
                                              value={state.ciudadEntrega}
                                              readOnly={state.agregar == "Consultar"}
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

                                        <div className="col-sm-4 col-md-4 unit">
                                          <label className="label">Zona</label>
                                          <label className="input select">
                                            <select
                                              className="form-control"
                                              required
                                              value={state.zonaEntrega}
                                              readOnly={state.agregar == "Consultar"}
                                              onChange={handleChange}
                                              id="zonaEntrega"
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

                                        <div className="col-sm-4 col-md-4 unit">
                                          <label className="label">
                                            Domicilio
                                        </label>
                                          <div className="input">
                                            <input
                                              onChange={handleChange}
                                              className="form-control"
                                              type="text"
                                              value={state.domicilioEntrega}
                                              readOnly={state.agregar == "Consultar"}
                                              id="domicilioEntrega"
                                            />
                                          </div>
                                        </div>

                                        <div className="col-sm-4 col-md-4 unit">
                                          <label className="label">
                                            Entrega En
                                        </label>
                                          <div className="input">
                                            <input
                                              onChange={handleChange}
                                              className="form-control"
                                              type="text"
                                              value={state.entregaEn}
                                              readOnly={state.agregar == "Consultar"}
                                              id="entregaEn"
                                            />
                                          </div>
                                        </div>

                                        <div className="col-sm-4 col-md-4 unit">
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
                                              readOnly={state.agregar == "Consultar"}
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
                                    <div className="col-sm-4 col-md-4 unit">
                                      <label className="label">Operador</label>
                                      <label className="input select">
                                        <select
                                          className="form-control"
                                          required
                                          value={state.operador}
                                          readOnly={state.agregar == "Consultar"}
                                          onChange={handleChange}
                                          id="operador"
                                        >
                                          {dataOperador.map((operador) => (
                                            <option
                                              key={operador.m_nIdOperador}
                                              value={operador.m_nIdOperador}
                                            >
                                              {operador.m_sNombreCompleto}
                                            </option>
                                          ))}
                                        </select>
                                        <i className="fa fa-arrow-down" />
                                      </label>
                                    </div>

                                    <div className="col-sm-4 col-md-4 unit">
                                      <label className="label">Tipo Unidad</label>
                                      <label className="input select">
                                        <select
                                          className="form-control"
                                          required
                                          value={state.tipoUnidad}
                                          readOnly={state.agregar == "Consultar"}
                                          onChange={handleSelectChange}
                                          id="tipoUnidad"
                                        >
                                          {dataTipoUnidad.map((tipoUnidad) => (
                                            <option
                                              key={tipoUnidad.m_nIdTipoUnidad}
                                              value={tipoUnidad.m_nIdTipoUnidad}
                                            >
                                              {tipoUnidad.m_sTipoUnidad}
                                            </option>
                                          ))}
                                        </select>
                                        <i className="fa fa-arrow-down" />
                                      </label>
                                    </div>

                                    <div className="col-sm-4 col-md-4 unit">
                                      <label className="label">Unidad</label>
                                      <label className="input select">
                                        <select
                                          className="form-control"
                                          required
                                          value={state.idUnidad}
                                          readOnly={state.agregar == "Consultar"}
                                          onChange={handleChange}
                                          id="idUnidad"
                                        >
                                          {dataUnidad.map((unidad) => (
                                            <option
                                              key={unidad.m_nIdUnidad}
                                              value={unidad.m_nIdUnidad}
                                            >
                                              {unidad.m_sDescripcion}
                                            </option>
                                          ))}
                                        </select>
                                        <i className="fa fa-arrow-down" />
                                      </label>
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
                                        readOnly={state.agregar == "Consultar"}
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
                                        readOnly={state.agregar == "Consultar"}
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


                      <div className="col-ms-12 col-md-5">
                        <div className="widget-wrap " id="paquetesSobres">
                          <div className="widget-header">
                            <h2>Número de Paquetes</h2>
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
                                        onClick={() => addPaquete()}
                                      >
                                        <i className="zmdi zmdi-plus"></i> Agregar
                                      Paquete
                                    </a>

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
                                      <a
                                        className="btn"
                                        style={{ margin: "10px" }}
                                        onClick={() => addSobre()}
                                      >
                                        <i className="zmdi zmdi-plus"></i> Agregar
                                      Sobre
                                    </a>

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

                  <div id="Importar" className="tab-pane fade">
                    <div className="widget-wrap">
                      <div className="widget-content">
                        <div className="row">
                          <div className="col-md-12">
                            <form className="j-forms">
                              <div className="form-content">
                                <div className="col-sm-12 col-md-12 unit">
                                  <label className="label">Importar</label>
                                  <div className="input">
                                    <input
                                      onChange={handleUpload}
                                      className="form-control"
                                      type="file"
                                      id="importar"
                                    />
                                  </div>
                                </div>
                              </div>
                              <br></br>
                              <div className="form-footer" className="col-md-12">
                                <button
                                  data-layout="topCenter"
                                  data-type="information"
                                  className="btn btn-secondary secondary-btn"
                                >
                                  {" "}
                                Cancelar
                              </button>
                                <button
                                  onClick={handleAceptar}
                                  className="btn btn-primary primary-btn"
                                >
                                  Aceptar
                              </button>
                              </div>
                            </form>
                          </div>
                        </div></div> </div>
                  </div>
                </div>
              </form>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

export default Recoleccion;
