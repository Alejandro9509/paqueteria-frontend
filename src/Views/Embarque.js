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
import { useTable, useFilters, useSortBy } from 'react-table'
import $ from 'jquery';
import { remove_array_element } from "../Util/Util";
import IconButton from '@material-ui/core/IconButton';
import PageviewIcon from '@material-ui/icons/Pageview';
import Autocomplete from "@material-ui/lab/Autocomplete";
import TextField from "@material-ui/core/TextField";
import InputAdornment from '@material-ui/core/InputAdornment';
import useModal from 'react-hooks-use-modal';
import { useHistory } from 'react-router-dom';
window.jQuery = window.$ = $;

const styles = {
  paqueteCarrusel: {
    height: "300px !important",
  },
  sobreCarrusel: {
    height: "150px !important"
  }
};
const useStyles = makeStyles(styles);

function Embarque() {
  var today = new Date();
  const classes = useStyles();
  const [data, setData] = React.useState([])
  const [dataSucursal, setDataSucursal] = React.useState([]);
  const [dataEstatusEmbarque, setEstatusEmbarque] = React.useState([]);
  const [dataTipoMoneda, setDataTipoMoneda] = React.useState([]);
  const [dataTipoCobro, setDataTipoCobro] = React.useState([]);
  const [dataCiudad, setDataCiudad] = React.useState([]);
  const [dataCodigoPostal, setDataCodigoPostal] = React.useState([]);
  const [dataOperador, setDataOperador] = React.useState([]);
  const [dataTipoUnidad, setDataTipoUnidad] = React.useState([]);
  const [dataUnidad, setDataUnidad] = React.useState([]);
  const [state, setState] = React.useState({
    showPopUp: false,
    DerechoBorrar: 139,
    identificadorModal: "",
    tipoModal: 0,
    agregar: "Agregar",
    idEmbarque: 0,
    fechaInicial: "",
    fechaFinal: "",
    sucursalListado: 0,
    estatusListado: 0,
    idSucursalAgregar: localStorage.getItem("Sucursal"),
    folioRecoleccion: "",
    folioEmbarque: "",
    folioGuía: "",
    folioInforme: "",
    fechaHoraCreacion: today.getDate() + "/" + (today.getMonth() + 1) + "/" + today.getFullYear() + " " + today.getHours() + ":" + today.getMinutes(),
    estatusEmbarque: 0,
    moneda: 0,
    tipoCambio: "",
    tipoCobro: 0,
    nombreRemitente: "",
    RFCRemitente: "",
    domicilioRemitente: "",
    codigoPostalRemitente: {},
    ciudadRemitente: {},
    correoRemitente: "",
    telefonoRemitente: "",
    contactoRemitente: "",
    ciudadDestino: {},
    nombreDestinatario: "",
    RFCDestinatario: "",
    domicilioDestinatario: "",
    codigoPostalDestinatario: {},
    ciudadDestinatario: {},
    correoDestinatario: "",
    telefonoDestinatario: "",
    contactoDestinatario: "",
    ciudadRemitente: {},
    ciudadOrigen: {},
    fechaEntrega: "",
    horaEntrega: "",
    codigoPostalEntrega: {},
    ciudadEntrega: {},
    zonaEntrega: "",
    domicilioEntrega: "",
    entregaEn: "",
    datosAdicionalesEntrega: "",
    cantidadDePaquetes: 0,
    cantidadDeSobres: 0,
    fechaHoraSalida: "",
    fechaHoraLlegada: "",
    diferenteEntrega: true,
    idOperador: {},
    idTipoUnidad: {},
    CreadoPor: localStorage.getItem("UsuarioId"),
    ModificadoPor: localStorage.getItem("UsuarioId"),
    idUnidad: {},
    paquetes: [
      {
        m_xPeso: "",
        m_xLargo: "",
        m_xAncho: "",
        m_xAlto: "",
        m_xVolumen: "",
        m_nIdTIpoEmpaque: "",
        m_cValorDeclarado: "",
        m_sDescripcion: "",
        ctd: "",
        m_nTipo: 2,
        m_sObservaciones: "",
      },
    ],
    sobres: [
      {
        m_nTipo: 1,
        m_sDescripcion: ""
      }
    ],
    height: window.innerHeight
  })
  const [fileUploaded, setFileUploaded] = React.useState([])
  const [stepActive, setStepActive] = React.useState(1);
  const [Modal, open, close, isOpen] = useModal("root", {
    preventScroll: true,
  });

  const history = useHistory()

  const handleAceptar = (e) => {
    e.preventDefault()

    var params = {

      "m_nIdEmbarque": state.idEmbarque,
      "m_nFolioEmbarque": state.folioEmbarque,
      "m_nFolioGuia": state.folioGuía,
      "m_nFolioInforme": state.folioInforme,
      "m_dFecha": state.fechaHoraCreacion.split("T")[0],
      "m_tHora": state.fechaHoraCreacion.split("T")[1],
      "m_nIdEstatusEmbarque": state.estatusEmbarque,
      "m_nIdMoneda": state.moneda,
      "m_cTIpoCambio": state.tipoCambio,
      "m_nIdTIpoCobro": state.tipoCobro,
      "m_sNOmbreRemitente": state.nombreRemitente,
      "m_sRFCRemitente": state.RFCRemitente,
      "m_sDomicilioRemitente": state.domicilioRemitente,
      "m_nIdCodigoPostalRemitente": state.codigoPostalRemitente.m_nIdCP,
      "m_nCiudadRemitente": state.ciudadRemitente.m_nIdCiudad,
      "m_sCorreoRemitente": state.correoRemitente,
      "m_sTelefonoRemitente": state.telefonoRemitente,
      "m_sContactoRemitente": state.contactoRemitente,
      "m_nIdCiudadOrigen": state.ciudadOrigen.m_nIdCiudad,
      "m_sNombreDestinatario": state.nombreDestinatario,
      "m_sRFCDestinatario": state.RFCDestinatario,
      "m_sDomicilioDestinatario": state.domicilioDestinatario,
      "m_nIdCodigoPostalDestinatario": state.codigoPostalDestinatario.m_nIdCP,
      "m_nIdCIudadDestinatario": state.ciudadDestinatario.m_nIdCiudad,
      "m_sCorreoDestinatario": state.correoDestinatario,
      "m_sTelefonoDestinatario": state.telefonoDestinatario,
      "m_sContactoDestinatario": state.contactoDestinatario,
      "m_nIdCiudadDestino": state.ciudadDestino.m_nIdCiudad,
      "m_dFechaEntrega": "",
      "m_tHoraEntrega": "",
      "m_nNoPaquetes": state.paquetes.length,
      "m_nNoSobres": state.sobres.length,
      "m_nIdOperador": state.idOperador.m_nIdOperador,
      "m_nIdUnidad": state.idUnidad.m_nIdUnidad,
      "m_dFechaSalida": state.fechaHoraSalida.split("T")[0],
      "m_tHoraSalida": state.fechaHoraSalida.split("T")[1],
      "FechaLlegada": state.fechaHoraLlegada.split("T")[0],
      "HoraLlegada": state.fechaHoraLlegada.split("T")[1],
      "CodigoPostalEntrega": state.codigoPostalEntrega.m_nIdCP,
      "IdCiudadEntrega": state.ciudadEntrega.m_nIdCiudad,
      "IdZonaEntrega": state.zonaEntrega,
      "DomicilioEntrega": state.domicilioEntrega,
      "EntregarEn": state.entregaEn,
      "DatosAdicionales": state.datosAdicionalesEntrega,
      "IdSucursal": state.idSucursalAgregar,
      "m_arrClsDetalle": state.paquetes,
      "CreadoPor": state.CreadoPor,
      "ModificadoPor": state.ModificadoPor,
      "m_tFechaDetalleEntrega": state.fechaEntrega.split("T")[0],
      "m_tHoraDetalleEntrega": state.fechaEntrega.split("T")[1],
      "m_parrSobres": state.sobres,

    }
    console.log(params)
    debugger;
    if (state.idEmbarque != 0) {
      const url = `${process.env.REACT_APP_API_URL}/Embarques/Modificar/${state.idEmbarque}`;
      axios.put(url, Object.assign({}, params), { headers2 }).then(respuesta => {
        alert(respuesta.data)
        getAllData()
      }).catch(err => {
        console.log(err)
        alert("err")
      });
    } else {
      const url = `${process.env.REACT_APP_API_URL}/Embarques/Agregar`;
      axios.post(url, Object.assign({}, params), { headers }).then(respuesta => {
        alert(respuesta.data)
        console.log(respuesta.data)
        getAllData()
      }).catch(err => {
        console.log(err)
        alert(err)
      });
    }

  }

  function addPaquete() {
    const { paquetes } = state;
    paquetes.push({
      m_xPeso: "",
      m_xLargo: "",
      m_xAncho: "",
      m_xAlto: "",
      m_xVolumen: "",
      m_nIdTIpoEmpaque: "",
      m_cValorDeclarado: "",
      m_sDescripcion: "",
      ctd: "",
      m_nTipo: 2,
      m_sObservaciones: "",
    });
    console.log(paquetes);
    setState({ ...state, paquetes: paquetes });
  }

  function removePaquete(index) {
    var { paquetes } = state;
    paquetes = remove_array_element(paquetes, index)
    console.log(paquetes)
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
    sobres = remove_array_element(sobres, index)
    console.log(sobres)
    setState({ ...state, sobres: sobres });
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

      const url = `${process.env.REACT_APP_API_URL}/Embarques/Eliminar/${id}`;
      axios.delete(url, { headers }).then(respuesta => {
        alert(respuesta.data)
        getAllData()
      }).catch(err => {
        alert(err)
      });
    }).catch(err => {
      alert(err)
    });
  }

  function handleShowModificar(id) {
    console.log(id)
    const url = `${process.env.REACT_APP_API_URL}/Embarques/GetById/${id}`;
    axios.get(url, { headers }).then(respuesta => {
      setState({
        ...state,
        agregar: "Modificar",
        idEmbarque: id,
        showPopUp: true,
        idSucursalAgregar: respuesta.data.IdSucursal,
        folioRecoleccion: respuesta.data.m_nFolioRecoleccion,
        folioEmbarque: respuesta.data.m_nFolioEmbarque,
        folioGuía: respuesta.data.m_nFolioGuia,
        folioInforme: respuesta.data.m_nFolioInforme,
        fechaHoraCreacion: respuesta.data.m_dFecha + "T" + respuesta.data.m_tHora.split(":")[0] + ":" + respuesta.data.m_tHora.split(":")[1],
        moneda: respuesta.data.m_nIdMoneda,
        tipoCambio: respuesta.data.m_cTIpoCambio,
        tipoCobro: respuesta.data.m_nIdTIpoCobro,
        estatusEmbarque: respuesta.data.m_nIdEstatusEmbarque,
        nombreRemitente: respuesta.data.m_sNOmbreRemitente,
        RFCRemitente: respuesta.data.m_sRFCRemitente,
        domicilioRemitente: respuesta.data.m_sDomicilioRemitente,
        codigoPostalRemitente: dataCodigoPostal.find(o => o.m_nIdCP == respuesta.data.m_nIdCodigoPostalRemitente),
        ciudadRemitente: dataCiudad.find(
          (o) => o.m_nIdCiudad == respuesta.data.m_nCiudadRemitente,
        ),
        correoRemitente: respuesta.data.m_sCorreoRemitente,
        telefonoRemitente: respuesta.data.m_sTelefonoRemitente,
        contactoRemitente: respuesta.data.m_sContactoRemitente,
        ciudadOrigen: dataCiudad.find(
          (o) => o.m_nIdCiudad == respuesta.data.m_nIdCiudadOrigen,
        ),

        nombreDestinatario: respuesta.data.m_sNombreDestinatario,
        RFCDestinatario: respuesta.data.m_sRFCDestinatario,
        domicilioDestinatario: respuesta.data.m_sDomicilioDestinatario,
        codigoPostalDestinatario: dataCodigoPostal.find(o => o.m_nIdCP == respuesta.data.m_nIdCodigoPostalDestinatario),
        ciudadDestinatario: dataCiudad.find(
          (o) => o.m_nIdCiudad == respuesta.data.m_nIdCIudadDestinatario,
        ),
        correoDestinatario: respuesta.data.m_sCorreoDestinatario,
        telefonoDestinatario: respuesta.data.m_sTelefonoDestinatario,
        contactoDestinatario: respuesta.data.m_sContactoDestinatario,

        ciudadDestino: dataCiudad.find(
          (o) => o.m_nIdCiudad == respuesta.data.m_nIdCiudadOrigen,
        ),
        zonaEntrega: respuesta.data.IdZonaEntrega,
        domicilioEntrega: respuesta.data.DomicilioEntrega,
        entregaEn: respuesta.data.EntregarEn,
        datosAdicionalesEntrega: respuesta.data.DatosAdicionalesis,
        fechaEntrega: respuesta.data.m_dFechaEntrega + "T" + respuesta.data.m_tHoraEntrega,
        codigoPostalEntrega: dataCodigoPostal.find(o => o.m_nIdCP == respuesta.data.CodigoPostalEntrega),
        ciudadEntrega: dataCiudad.find(
          (o) => o.m_nIdCiudad == respuesta.data.IdCiudadEntrega,
        ),
        fechaHoraSalida: respuesta.data.m_dFechaSalida + "T" + respuesta.data.m_tHoraSalida,
        fechaHoraLlegada: respuesta.data.FechaLlegada + "T" + respuesta.data.HoraLlegada,
        idOperador: dataOperador.find(o => o.m_nIdOperador == respuesta.data.m_nIdOperador),
        idTipoUnidad: dataTipoUnidad.find(o => o.m_nIdTipoUnidad == (dataUnidad.find(o => o.m_nIdUnidad == respuesta.data.m_nIdUnidad)).m_nIdTipoUnidad),
        idUnidad: dataUnidad.find(o => o.m_nIdUnidad == respuesta.data.m_nIdUnidad),
        paquetes: respuesta.data.m_arrPaquetes
      })
    });
  }

  function handleShowConsultar(id) {
    console.log(id)
    const url = `${process.env.REACT_APP_API_URL}/Embarques/GetById/${id}`;
    axios.get(url, { headers }).then(respuesta => {
      setState({
        ...state,
        agregar: "Consultar",
        idEmbarque: id,
        showPopUp: true,
        idSucursalAgregar: respuesta.data.IdSucursal,
        folioRecoleccion: respuesta.data.m_nFolioRecoleccion,
        folioEmbarque: respuesta.data.m_nFolioEmbarque,
        folioGuía: respuesta.data.m_nFolioGuia,
        folioInforme: respuesta.data.m_nFolioInforme,
        fechaHoraCreacion: respuesta.data.m_dFecha + "T" + respuesta.data.m_tHora.split(":")[0] + ":" + respuesta.data.m_tHora.split(":")[1],
        moneda: respuesta.data.m_nIdMoneda,
        tipoCambio: respuesta.data.m_cTIpoCambio,
        tipoCobro: respuesta.data.m_nIdTIpoCobro,
        estatusEmbarque: respuesta.data.m_nIdEstatusEmbarque,
        nombreRemitente: respuesta.data.m_sNOmbreRemitente,
        RFCRemitente: respuesta.data.m_sRFCRemitente,
        domicilioRemitente: respuesta.data.m_sDomicilioRemitente,
        codigoPostalRemitente: dataCodigoPostal.find(o => o.m_nIdCP == respuesta.data.m_nIdCodigoPostalRemitente),
        ciudadRemitente: dataCiudad.find(
          (o) => o.m_nIdCiudad == respuesta.data.m_nCiudadRemitente,
        ),
        correoRemitente: respuesta.data.m_sCorreoRemitente,
        telefonoRemitente: respuesta.data.m_sTelefonoRemitente,
        contactoRemitente: respuesta.data.m_sContactoRemitente,
        ciudadOrigen: dataCiudad.find(
          (o) => o.m_nIdCiudad == respuesta.data.m_nIdCiudadOrigen,
        ),

        nombreDestinatario: respuesta.data.m_sNombreDestinatario,
        RFCDestinatario: respuesta.data.m_sRFCDestinatario,
        domicilioDestinatario: respuesta.data.m_sDomicilioDestinatario,
        codigoPostalDestinatario: dataCodigoPostal.find(o => o.m_nIdCP == respuesta.data.m_nIdCodigoPostalDestinatario),
        ciudadDestinatario: dataCiudad.find(
          (o) => o.m_nIdCiudad == respuesta.data.m_nIdCIudadDestinatario,
        ),
        correoDestinatario: respuesta.data.m_sCorreoDestinatario,
        telefonoDestinatario: respuesta.data.m_sTelefonoDestinatario,
        contactoDestinatario: respuesta.data.m_sContactoDestinatario,

        ciudadDestino: dataCiudad.find(
          (o) => o.m_nIdCiudad == respuesta.data.m_nIdCiudadOrigen,
        ),
        fechaEntrega: respuesta.data.m_dFechaEntrega + "T" + respuesta.data.m_tHoraEntrega,
        codigoPostalEntrega: dataCodigoPostal.find(o => o.m_nIdCP == respuesta.data.CodigoPostalEntrega),
        ciudadEntrega: dataCiudad.find(
          (o) => o.m_nIdCiudad == respuesta.data.IdCiudadEntrega,
        ),
        fechaHoraSalida: respuesta.data.m_dFechaSalida + "T" + respuesta.data.m_tHoraSalida,
        fechaHoraLlegada: respuesta.data.FechaLlegada + "T" + respuesta.data.HoraLlegada,
        idOperador: dataOperador.find(o => o.m_nIdOperador == respuesta.data.m_nIdOperador),
        idTipoUnidad: dataTipoUnidad.find(o => o.m_sTipoUnidad == (dataUnidad.find(o => o.m_nIdUnidad == respuesta.data.m_nIdUnidad)).m_sTipoUnidad),
        idUnidad: dataUnidad.find(o => o.m_nIdUnidad == respuesta.data.m_nIdUnidad),
        zonaEntrega: respuesta.data.IdZonaEntrega,
        domicilioEntrega: respuesta.data.DomicilioEntrega,
        entregaEn: respuesta.data.EntregarEn,
        datosAdicionalesEntrega: respuesta.data.DatosAdicionalesis,
        paquetes: respuesta.data.m_arrPaquetes
      })
    });
  }

  function handleShowAgregar() {
    var today = new Date();
    setState({
      ...state,
      agregar: "Agregar",
      showPopUp: true,
      idEmbarque: 0,
      folioRecoleccion: "",
      folioEmbarque: "",
      folioGuía: "",
      folioInforme: "",
      fechaHoraCreacion: today.getDate() + "/" + (today.getMonth() + 1) + "/" + today.getFullYear() + " " + today.getHours() + ":" + today.getMinutes(),
      moneda: dataTipoMoneda[0].m_nIdMoneda,
      tipoCambio: "",
      tipoCobro: dataTipoCobro[0].m_nIdTipoCobro,
      estatusEmbarque: dataEstatusEmbarque[0].m_nIdEstatusEmbarque,
      nombreRemitente: "",
      RFCRemitente: "",
      domicilioRemitente: "",
      codigoPostalRemitente: {},
      ciudadRemitente: {},
      correoRemitente: "",
      telefonoRemitente: "",
      contactoRemitente: "",
      ciudadDestino: {},
      ciudadOrigen: {},
      nombreDestinatario: "",
      RFCDestinatario: "",
      domicilioDestinatario: "",
      codigoPostalDestinatario: {},
      ciudadDestinatario: {},
      correoDestinatario: "",
      telefonoDestinatario: "",
      contactoDestinatario: "",
      ciudadDestinatario: {},
      fechaEntrega: "",
      horaEntrega: "",
      codigoPostalEntrega: {},
      ciudadEntrega: {},
      idOperador: {},
      idTipoUnidad: {},
      idUnidad: {},
      zonaEntrega: "",
      domicilioEntrega: "",
      entregaEn: "",
      datosAdicionalesEntrega: "",
      fechaHoraSalida: "",
      fechaHoraLlegada: "",
      cantidadDePaquetes: 0,
      cantidadDeSobres: 0,
    })
  }

  const handleChange = event => {
    console.log(event.target.id + " : " + event.target.value)
    setState({
      ...state,
      [event.target.id]: event.target.value
    });
  };

  const handleEntregaCheckboxChange = event => {
    console.log("diferenteEntrega : " + state.diferenteEntrega)
    setState({
      ...state,
      diferenteEntrega: !state.diferenteEntrega
    });
  }

  const handleSelectChange = (event) => {
    getAllUnidades(event.target.value);
  }

  function handleSelectDatos(id, cp) {
    debugger;
    setState({
      ...state,
      [state.identificadorModal]: id
    });
    console.log(id)
    console.log(state.identificadorModal)
  }

  const columns = React.useMemo(() => [
    {
      Name: "Folio",
      accessor: "m_nFolioEmbarque",
    }, {
      Name: "Fecha Elaboración",
      accessor: "m_dFecha",
    }, {
      Name: "Sucursal",
      accessor: "IdSucursal",
    }, {
      Name: "Estatus de la Orden",
      accessor: "m_nIdEstatusEmbarque",
    }, {
      Name: "Origen",
      accessor: "m_nIdCiudadOrigen",
    }, {
      Name: "Destino",
      accessor: "m_nIdCiudadDestino",
    }, {
      Name: "Folio Guía",
      accessor: "m_nFolioGuia",
    }, {
      Name: "Folio Informe",
      accessor: "m_nFolioInforme",
    }

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
    }
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
    }
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
    }
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
    }
  ]);

  useEffect(value => {
    if (localStorage.getItem("UsuarioId") === null || localStorage.getItem("UsuarioId") <= 0) {
      alert("Es necesario iniciar sesion para acceder a este proceso");
      window.location.replace("login");
      return;
    }
    getAllData();
    getAllSucursales();
    getAllEstatusEmbarque();
    getAllTipoCobro();
    getAllTipoMoneda();
    getAllCiudades();
    getAllCodigosPostales();
    getAllOperadores();
    getAllTipoUnidad();
  }, []);

  function getAllData() {
    const url = `${process.env.REACT_APP_API_URL}/Embarques/GetListado`;
    axios.get(url, { headers }).then(respuesta => {
      setData(respuesta.data)
    });
  };

  function getAllSucursales() {
    const url = `${process.env.REACT_APP_API_URL}/Sucursales/GetListado`;
    axios.get(url, { headers }).then((respuesta) => {
      setDataSucursal(respuesta.data);
    });
  }

  function getAllEstatusEmbarque() {
    const url = `${process.env.REACT_APP_API_URL}/SisEstatus/GetListadoEmbarque`;
    axios.get(url, { headers }).then((respuesta) => {
      setEstatusEmbarque(respuesta.data);
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
      getAllUnidades(respuesta.data[0].m_nIdTipoUnidad)
    });
  }

  function getAllUnidades(id) {
    const url = `${process.env.REACT_APP_API_URL}/Unidades/ByTipoUnidad/${id}`;
    axios.get(url, { headers }).then((respuesta) => {
      setDataUnidad(respuesta.data);
    });
    console.log(dataUnidad)
  }

  const headers = {
    'Content-Type': 'application/json'
  }
  const headers2 = {
    'Content-Type': 'application/json',
     'Access-Control-Allow-Origin': '*',
     'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS'
  }

  function conDatos() {
    return data.length != 0
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
        value={`Buscar ${count} registros...`}
      />
    )
  }

  function Table({ columns, data }) {

    const defaultColumn = React.useMemo(
      () => ({
        // Default Filter UI
        Filter: DefaultColumnFilter,
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
      useSortBy
    )

    return (
      <div className="col-md-12">
        <table className="table" {...getTableProps()}>
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
                  <tr {...row.getRowProps()}>
                    <td>
                      <div>
                        <a href="#Agregar" role="tab" data-toggle="tab" onClick={() => (handleShowModificar(row.original.m_nIdEmbarque))} className="btn btn-default btn-sm"><i className="fa fa-pencil-square-o" style={{ color: "#F9A03E" }} /></a>
                        <a href="#Agregar" role="tab" data-toggle="tab" className="btn btn-default btn-sm" onClick={() => (handleShowConsultar(row.original.m_nIdEmbarque))}><i className="fa fa-eye" style={{ color: "#F9A03E" }} /></a>
                        <a href="#" className="btn btn-default btn-sm" onClick={() => (handleEliminar(row.original.m_nIdEmbarque))}><i className="zmdi zmdi-delete" style={{ color: "#F30B0B" }} /></a>
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

  function TableCodigoPostal({ columns, data, select }) {
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
      <div className="col-md-12" style={{ maxHeight: "300px", overflow: "auto" }}>
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
                  <tr style={{ backgroundColor: row.original.m_nIdCP === select ? "orange" : "white" }}  {...row.getRowProps()} onClick={handleSelectDatos.bind(this, row.original)} onDoubleClick={close}>
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
      <div className="col-md-12" style={{ maxHeight: "300px", overflow: "auto" }}>
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
                  <tr style={{ backgroundColor: row.original.m_nIdCiudad === select ? "orange" : "white" }} {...row.getRowProps()} onClick={handleSelectDatos.bind(this, row.original)}>
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
      <div className="col-md-12" style={{ maxHeight: "300px", overflow: "auto" }}>
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
                  <tr style={{ backgroundColor: row.original.m_nIdOperador === select ? "orange" : "white" }} {...row.getRowProps()} onClick={handleSelectDatos.bind(this, row.original)}>
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
                  <tr style={{ backgroundColor: row.original.m_nIdTipoUnidad === select ? "orange" : "white" }} {...row.getRowProps()} onClick={handleSelectDatos.bind(this, row.original)}>
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
      <div className="col-md-12" style={{ maxHeight: "300px", overflow: "auto" }} >
        <table className="table" {...getTableProps()} >
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
                  <tr style={{ backgroundColor: row.original.m_nIdUnidad === select ? "orange" : "white" }} {...row.getRowProps()} onClick={handleSelectDatos.bind(this, row.original)}>
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
    var $welem = $section.parentsUntil(".widget-action-bar").parentsUntil(".w-action").parents(".widget-header").next(".widget-container");

    $welem.slideDown();
    $section.children("a").children("i").removeClass("zmdi-chevron-up");
    $section.children("a").children("i").addClass("zmdi-chevron-down");
    $('html, body').animate({
      scrollTop: parseInt($section.offset().top)
    }, 200);


  }

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
              value={state.paquetes[index].m_xPeso}
              placeholder="Peso"
              name="m_xPeso"
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
              value={state.paquetes[index].m_xLargo}
              placeholder="Largo"
              name="m_xLargo"
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
              value={state.paquetes[index].m_xAncho}
              placeholder="Ancho"
              name="m_xAncho"
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
              value={state.paquetes[index].m_xAlto}
              placeholder="Alto"
              name="m_xAlto"
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
              value={state.paquetes[index].m_xVolumen}
              placeholder="Volumen"
              name="m_xVolumen"
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
              value={state.paquetes[index].m_nIdTIpoEmpaque}
              placeholder="Tipo de Embarje"
              name="m_nIdTIpoEmpaque"
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
              value={state.paquetes[index].m_cValorDeclarado}
              placeholder="Valor Declarado"
              name="m_cValorDeclarado"
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
              value={state.paquetes[index].ctd}
              placeholder="Ctd"
              name="ctd"
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
        {
          state.paquetes.length !== 1 &&
          <a className="btn delete" onClick={() => removePaquete(index)}>
            <i className="zmdi zmdi-delete"></i> Eliminar Paquete
        </a>
        }

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
              value={state.sobres[index].descripcion}
              placeholder="Descripción"
              name="descripcion"
            />
          </div>
        </div>
        {
          state.sobres.length !== 1 &&
          <a className="btn delete" onClick={() => removeSobre(index)}>
            <i className="zmdi zmdi-delete"></i> Eliminar Sobre
          </a>
        }

      </div>
    );
  });

  return (
    <div>

      <Modal style={{ height: "400px" }}>
        {state.tipoModal == 0 &&
          <div className="row" style={{ backgroundColor: '#FFFFFF' }}>
            {dataCodigoPostal.length != 0 ? <TableCodigoPostal select={state[state.identificadorModal] && state[state.identificadorModal].m_nIdCP} columns={columnsCP} data={dataCodigoPostal} identificadorModal={state.identificadorModal} /> : <div>No se encontró ningún registro</div>}
            <br></br>
            <br></br>
            <button onClick={close} className="btn btn-secondary secondary-btn">Cerrar</button>
            <button onClick={() => { history.push("/Ciudades") }} className="btn btn-primary primary-btn">Agregar</button>
          </div>
        }
        {state.tipoModal == 1 &&
          <div className="row" style={{ backgroundColor: '#FFFFFF' }}>
            {dataCiudad.length != 0 ? <TableCiudades select={state[state.identificadorModal] && state[state.identificadorModal].m_nIdCiudad} columns={columnsCiudades} data={dataCiudad} identificadorModal={state.identificadorModal} /> : <div>No se encontró ningún registro</div>}
            <button onClick={close} className="btn btn-secondary secondary-btn">Cerrar</button>
            <button onClick={() => { history.push("/Ciudades") }} className="btn btn-primary primary-btn">Agregar</button>
          </div>
        }
        {state.tipoModal == 2 &&
          <div className="row" style={{ backgroundColor: '#FFFFFF' }}>
            {dataOperador.length != 0 ? <TableOperadores select={state[state.identificadorModal] && state[state.identificadorModal].m_nIdOperador} columns={columnsOperadores} data={dataOperador} identificadorModal={state.identificadorModal} /> : <div>No se encontró ningún registro</div>}
            <button onClick={close} className="btn btn-secondary secondary-btn">Cerrar</button>
            <button onClick={() => { history.push("/Operadores") }} className="btn btn-primary primary-btn">Agregar</button>
          </div>
        }
        {state.tipoModal == 3 &&
          <div className="row" style={{ backgroundColor: '#FFFFFF' }}>
            {dataTipoUnidad.length != 0 ? <TableTipoUnidad select={state[state.identificadorModal] && state[state.identificadorModal].m_nIdTipoUnidad} columns={columnsTipoUnidades} data={dataTipoUnidad} identificadorModal={state.identificadorModal} /> : <div>No se encontró ningún registro</div>}
            <button onClick={close} className="btn btn-secondary secondary-btn">Cerrar</button>
            <button onClick={() => { history.push("/TipoUnidad") }} className="btn btn-primary primary-btn">Agregar</button>
          </div>
        }
        {state.tipoModal == 4 &&
          <div className="row" style={{ maxHeight: "400px !important", overflow: "auto", backgroundColor: '#FFFFFF' }} >
            {dataUnidad.length != 0 ? <TableUnidad select={state[state.identificadorModal] && state[state.identificadorModal].m_nIdUnidad} columns={columnsUnidades} data={dataUnidad} identificadorModal={state.identificadorModal} /> : <div>No se encontró ningún registro</div>}
            <button onClick={close} className="btn btn-secondary secondary-btn">Cerrar</button>
            <button onClick={() => { history.push("/Unidades") }} className="btn btn-primary primary-btn">Agregar</button>
          </div>
        }
      </Modal>


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
                <h2>Embarque</h2>
              </div>
              <div className="col-md-6 col-sm-6">
                <ul className="list-page-breadcrumb">
                  <li className="active-page">Embarque</li>
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
                          <label className="label">
                            Fecha Final
                        </label>
                          <div className="input">
                          <input
                              type="date"
                              className="form-control"
                              onChange={handleChange}
                              id="fechaFinal"
                            />
                          </div>
                        </div>

                        <div className="col-sm-6 col-md-3 unit">
                          <label className="label">
                            Sucursal
                        </label>
                          <label className="input select">
                            <select
                              className="form-control"
                              required
                              onChange={handleChange}
                              id="sucursal"
                            >
                              <option value="0">
                                Todas
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
                            <i></i>
                          </label>
                        </div>

                        <div className="col-sm-6 col-md-3 unit">
                          <label className="label">
                            Estatus
                        </label>
                          <label className="input select">
                            <select
                              className="form-control"
                              required
                              onChange={handleChange}
                              id="estatusListado"
                            >
                              <option value="0">
                                Todos
                            </option>
                              {dataEstatusEmbarque.map(
                                (estatus) => (
                                  <option key={estatus.m_nIdEstatusEmbarque} value={estatus.m_nIdEstatusEmbarque}>
                                    {
                                      estatus.m_sEstatus
                                    }
                                  </option>
                                )
                              )}
                            </select>
                            <i></i>
                          </label>
                        </div>

                      </div>
                    </form>
                  </div>
                  <div className="row">
                    {conDatos() ? <Table columns={columns} data={data} /> : <div>No se encontró ningún registro</div>}
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
                              <label className="label">
                                Sucursal
                          </label>
                              <label className="input select">
                                <select
                                  className="form-control"
                                  required
                                  onChange={handleChange}
                                  value={state.idSucursalAgregar}
                                  disabled={state.agregar == "Consultar"}
                                  id="idSucursalAgregar"
                                  disabled="disabled"
                                >
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
                                <i className="fa fa-arrow-down" />
                              </label>
                            </div>

                            <div className="col-sm-4 col-md-2-5 unit">
                              <label className="label">
                                Folio Recolección
                          </label>
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
                              <label className="label">
                                Folio Embarque
                          </label>
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
                              <label className="label">
                                Folio Guía
                          </label>
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
                              <label className="label">
                                Folio Informe
                          </label>
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
                              <label className="label">
                                Fecha / Hora
                              </label>
                              <div className="input">
                                <input
                                  onChange={handleChange}
                                  className="form-control"
                                  value={state.fechaHoraCreacion}
                                  disabled="disabled"
                                  id="fechaHoraCreacion"
                                />
                              </div>
                            </div>

                            <div className="col-sm-4 col-md-2-5 unit">
                              <label className="label">
                                Estatus del Embarque
                          </label>
                              <label className="input select">
                                <select
                                  className="form-control"
                                  required
                                  onChange={handleChange}
                                  value={state.estatusEmbarque}
                                  disabled={state.agregar == "Consultar"}
                                  id="estatusEmbarque"
                                >
                                  {dataEstatusEmbarque.map(
                                    (estatus) => (
                                      <option key={estatus.m_nIdEstatusEmbarque} value={estatus.m_nIdEstatusEmbarque}>
                                        {
                                          estatus.m_sEstatus
                                        }
                                      </option>
                                    )
                                  )}
                                </select>
                                <i></i>
                              </label>
                            </div>

                            <div className="col-sm-4 col-md-2-5 unit">
                              <label className="label">
                                Moneda
                          </label>
                              <label className="input select">
                                <select
                                  className="form-control"
                                  required
                                  value={state.moneda}
                                  disabled={state.agregar == "Consultar"}
                                  onChange={handleChange}
                                  id="moneda"
                                >
                                  {dataTipoMoneda.map(
                                    (moneda) => (
                                      <option key={moneda.m_nIdMoneda} value={moneda.m_nIdMoneda}>
                                        {
                                          moneda.m_sMoneda
                                        }
                                      </option>
                                    )
                                  )}
                                </select>
                                <i className="fa fa-arrow-down" />
                              </label>

                            </div>

                            <div className="col-sm-4 col-md-2-5 unit">
                              <label className="label">
                                Tipo de Cambio
                          </label>
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

                            <div className="col-sm-4 col-md-2-5 unit">
                              <label className="label">
                                Tipo Cobro
                          </label>
                              <label className="input select">
                                <select
                                  className="form-control"
                                  required
                                  value={state.tipoCobro}
                                  disabled={state.agregar == "Consultar"}
                                  onChange={handleChange}
                                  id="tipoCobro"
                                >

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

                                  <div className="col-sm-4 col-md-6 unit">
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
                                        disabled={state.agregar == "Consultar"}
                                        id="nombreRemitente"
                                      />
                                    </div>

                                  </div>

                                  <div className="col-sm-4 col-md-6 unit">
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
                                        disabled={state.agregar == "Consultar"}
                                        id="RFCRemitente"
                                      />
                                    </div>
                                  </div>

                                  <div className="col-sm-4 col-md-12 unit">
                                    <label className="label">
                                      Domicilio
                                  </label>
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

                                  <div className="col-sm-4 col-md-6 unit">
                                    <label className="label">
                                      Código Postal
                                  </label>
                                    <div className="input" >
                                      <Autocomplete
                                        freeSolo
                                        onChange={(event, newValue) =>
                                          setState({
                                            ...state,
                                            codigoPostalRemitente: newValue,
                                          })
                                        }
                                        value={state.codigoPostalRemitente}
                                        disabled={state.agregar == "Consultar"}
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
                                                disabled: state.agregar == "Consultar",
                                                endAdornment:
                                                  <InputAdornment position="end">
                                                    <IconButton padding="0px" style={{ paddingRight: "0px" }} onClick={() => { setState({ ...state, identificadorModal: "codigoPostalRemitente", tipoModal: 0 }); open(); }}>
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

                                  <div className="col-sm-4 col-md-6 unit">
                                    <label className="label">
                                      Ciudad
                                  </label>
                                    <div className="input">
                                      <Autocomplete
                                        freeSolo
                                        onChange={(event, newValue) =>
                                          setState({
                                            ...state,
                                            ciudadRemitente: newValue,
                                          })
                                        }
                                        value={state.ciudadRemitente}
                                        id="ciudadRemitente"
                                        disableClearable
                                        forcePopupIcon={false}
                                        options={dataCiudad}
                                        getOptionLabel={(option) =>
                                          option.m_sCiudad
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
                                                disabled: state.agregar == "Consultar",
                                                endAdornment:
                                                  <InputAdornment position="end">
                                                    <IconButton padding="0px" style={{ paddingRight: "0px" }} onClick={() => { open(); setState({ ...state, identificadorModal: "ciudadRemitente", tipoModal: 1 }) }}>
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

                                  <div className="col-sm-4 col-md-6 unit">
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

                                  <div className="col-sm-4 col-md-6 unit">
                                    <label className="label">
                                      Teléfono
                                  </label>
                                    <div className="input">
                                      <input
                                        onChange={handleChange}
                                        className="form-control"
                                        type="tel"
                                        required
                                        value={state.telefonoRemitente}
                                        disabled={state.agregar == "Consultar"}
                                        id="telefonoRemitente"
                                      />
                                    </div>
                                  </div>

                                  <div className="col-sm-4 col-md-6 unit">
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
                                        disabled={state.agregar == "Consultar"}
                                        id="contactoRemitente"
                                      />
                                    </div>
                                  </div>

                                  <div className="col-sm-12 col-md-6 unit">
                                    <label className="label">
                                      Origen
                                </label>
                                    <div className="input">
                                      <Autocomplete
                                        freeSolo
                                        onChange={(event, newValue) =>
                                          setState({
                                            ...state,
                                            ciudadOrigen: newValue,
                                          })
                                        }
                                        value={state.ciudadOrigen}
                                        disabled={state.agregar == "Consultar"}
                                        id="ciudadOrigen"
                                        disableClearable
                                        forcePopupIcon={false}
                                        options={dataCiudad}
                                        getOptionLabel={(option) =>
                                          option.m_sCiudad
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
                                                disabled: state.agregar == "Consultar",
                                                endAdornment:
                                                  <InputAdornment position="end">
                                                    <IconButton padding="0px" style={{ paddingRight: "0px" }} onClick={() => { open(); setState({ ...state, identificadorModal: "ciudadOrigen", tipoModal: 1 }) }}>
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

                                <div className="col-sm-4 col-md-6 unit">
                                  <label className="label">
                                    Nombre
                              </label>
                                  <div className="input">
                                    <input
                                      onChange={handleChange}
                                      className="form-control"
                                      type="text"
                                      required
                                      value={state.nombreDestinatario}
                                      disabled={state.agregar == "Consultar"}
                                      id="nombreDestinatario"
                                    />
                                  </div>
                                </div>

                                <div className="col-sm-4 col-md-6 unit">
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
                                      value={state.RFCDestinatario}
                                      disabled={state.agregar == "Consultar"}
                                      id="RFCDestinatario"
                                    />
                                  </div>
                                </div>

                                <div className="col-sm-4 col-md-12 unit">
                                  <label className="label">
                                    Domicilio
                                </label>
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

                                <div className="col-sm-4 col-md-6 unit">
                                  <label className="label">
                                    Código Postal
                                </label>
                                  <div className="input" >
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
                                              disabled: state.agregar == "Consultar",
                                              endAdornment:
                                                <InputAdornment position="end">
                                                  <IconButton padding="0px" style={{ paddingRight: "0px" }} onClick={() => { setState({ ...state, identificadorModal: "codigoPostalDestinatario", tipoModal: 0 }); open(); }}>
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

                                <div className="col-sm-4 col-md-6 unit">
                                  <label className="label">
                                    Ciudad
                                </label>
                                  <div className="input">
                                    <Autocomplete
                                      freeSolo
                                      onChange={(event, newValue) =>
                                        setState({
                                          ...state,
                                          ciudadDestinatario: newValue,
                                        })
                                      }
                                      value={state.ciudadDestinatario}
                                      disabled={state.agregar == "Consultar"}
                                      id="ciudadDestinatario"
                                      disableClearable
                                      forcePopupIcon={false}
                                      options={dataCiudad}
                                      getOptionLabel={(option) =>
                                        option.m_sCiudad
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
                                              disabled: state.agregar == "Consultar",
                                              endAdornment:
                                                <InputAdornment position="end">
                                                  <IconButton padding="0px" style={{ paddingRight: "0px" }} onClick={() => { open(); setState({ ...state, identificadorModal: "ciudadDestinatario", tipoModal: 1 }) }}>
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

                                <div className="col-sm-4 col-md-6 unit">
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

                                <div className="col-sm-4 col-md-6 unit">
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
                                      disabled={state.agregar == "Consultar"}
                                      id="telefonoDestinatario"
                                    />
                                  </div>
                                </div>

                                <div className="col-sm-4 col-md-6 unit">
                                  <label className="label">
                                    Contacto
                                </label>
                                  <div className="input">
                                    <input
                                      required={true}
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

                                <div className="col-sm-12 col-md-6 unit">
                                  <label className="label">
                                    Destino
                                </label>
                                  <div className="input">
                                    <Autocomplete
                                      freeSolo
                                      onChange={(event, newValue) =>
                                        setState({
                                          ...state,
                                          ciudadDestino: newValue,
                                        })
                                      }
                                      value={state.ciudadDestino}
                                      disabled={state.agregar == "Consultar"}
                                      id="ciudadDestino"
                                      disableClearable
                                      forcePopupIcon={false}
                                      options={dataCiudad}
                                      getOptionLabel={(option) =>
                                        option.m_sCiudad
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
                                              value: state.ciudadDestino,
                                              disabled: state.agregar == "Consultar",
                                              endAdornment:
                                                <InputAdornment position="end">
                                                  <IconButton padding="0px" style={{ paddingRight: "0px" }} onClick={() => { open(); setState({ ...state, identificadorModal: "ciudadDestino", tipoModal: 1 }) }}>
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

                                <div className="col-sm-12 col-md-12 unit">
                                  <label className="label">
                                    Entrega en Diferente Domicilio
                                </label>
                                  <div className="input">
                                    <input
                                      onChange={handleEntregaCheckboxChange}
                                      className="form-control"
                                      type="checkbox"
                                      checked={state.diferenteEntrega}
                                      value={state.diferenteEntrega}
                                      disabled={state.agregar == "Consultar"}
                                      id="diferenteEntrega"
                                    />
                                  </div>
                                </div>

                              </div>
                            </div>
                          </div>
                        </div>
                      </div>

                      {state.diferenteEntrega ?
                        <div className="widget-wrap" id="detallesRecoleccion">

                          {state.diferenteEntrega ?
                            <div>
                              <div className="widget-header">
                                <h2>Detalles de la Entrega</h2>
                              </div>
                              <div className="widget-container">
                                <div className="widget-content">
                                  <div className="row">
                                    <div className="col-md-12">

                                      <div className="col-sm-4 col-md-4 unit">
                                        <label className="label">
                                          Código Postal
                                    </label>
                                        <div className="input" >
                                          <Autocomplete
                                            freeSolo
                                            onChange={(event, newValue) =>
                                              setState({
                                                ...state,
                                                codigoPostalEntrega: newValue,
                                              })
                                            }
                                            value={state.codigoPostalEntrega}
                                            disabled={state.agregar == "Consultar"}
                                            id="codigoPostalEntrega"
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
                                                    disabled: state.agregar == "Consultar",
                                                    endAdornment:
                                                      <InputAdornment position="end">
                                                        <IconButton padding="0px" style={{ paddingRight: "0px" }} onClick={() => { setState({ ...state, identificadorModal: "codigoPostalEntrega", tipoModal: 0 }); open(); }}>
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

                                      <div className="col-sm-4 col-md-4 unit">
                                        <label className="label">
                                          Ciudad
                                    </label>
                                        <div className="input">
                                          <Autocomplete
                                            freeSolo
                                            onChange={(event, newValue) =>
                                              setState({
                                                ...state,
                                                ciudadEntrega: newValue,
                                              })
                                            }
                                            value={state.ciudadEntrega}
                                            disabled={state.agregar == "Consultar"}
                                            id="ciudadEntrega"
                                            disableClearable
                                            forcePopupIcon={false}
                                            options={dataCiudad}
                                            getOptionLabel={(option) =>
                                              option.m_sCiudad
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
                                                    disabled: state.agregar == "Consultar",
                                                    endAdornment:
                                                      <InputAdornment position="end">
                                                        <IconButton padding="0px" style={{ paddingRight: "0px" }} onClick={() => { open(); setState({ ...state, identificadorModal: "ciudadEntrega", tipoModal: 1 }) }}>
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

                                      <div className="col-sm-4 col-md-4 unit">
                                        <label className="label">
                                          Zona
                                      </label>
                                        <div className="input">
                                          <input
                                            onChange={handleChange}
                                            className="form-control"
                                            type="text"
                                            required
                                            value={state.zonaEntrega}
                                            disabled={state.agregar == "Consultar"}
                                            id="zonaEntrega"
                                          />
                                        </div>
                                      </div>

                                      <div className="col-sm-4 col-md-12 unit">
                                        <label className="label">
                                          Domicilio
                                      </label>
                                        <div className="input">
                                          <input
                                            onChange={handleChange}
                                            className="form-control"
                                            type="text"
                                            required
                                            value={state.domicilioEntrega}
                                            disabled={state.agregar == "Consultar"}
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
                                            required
                                            value={state.entregaEn}
                                            disabled={state.agregar == "Consultar"}
                                            id="entregaEn"
                                          />
                                        </div>
                                      </div>

                                      <div className="col-sm-4 col-md-8 unit">
                                        <label className="label">
                                          Datos Adicionales para la Entrega
                                      </label>
                                        <div className="input">
                                          <input
                                            onChange={handleChange}
                                            className="form-control"
                                            type="text"
                                            required
                                            value={state.datosAdicionalesEntrega}
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
                            : <div></div>
                          }

                        </div>
                        : <div></div>
                      }

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
                                    <label className="label">
                                      Operador
                                  </label>
                                    <div className="input">
                                      <Autocomplete
                                        freeSolo
                                        onChange={(event, newValue) =>
                                          setState({
                                            ...state,
                                            idOperador: newValue,
                                          })
                                        }
                                        value={state.idOperador}
                                        disabled={state.agregar == "Consultar"}
                                        id="idOperador"
                                        disableClearable
                                        forcePopupIcon={false}
                                        options={dataOperador}
                                        getOptionLabel={(option) =>
                                          option.m_sNombreCompleto
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
                                                value: state.idOperador,
                                                disabled: state.agregar == "Consultar",
                                                endAdornment:
                                                  <InputAdornment position="end">
                                                    <IconButton padding="0px" style={{ paddingRight: "0px" }} onClick={() => { setState({ ...state, identificadorModal: "idOperador", tipoModal: 2 }); open(); }}>
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

                                  <div className="col-sm-4 col-md-4 unit">
                                    <label className="label">
                                      Tipo Unidad
                                  </label>
                                    <div className="input">
                                      <Autocomplete
                                        freeSolo
                                        onChange={(event, newValue) =>
                                          setState({
                                            ...state,
                                            idTipoUnidad: newValue,
                                          })
                                        }
                                        value={state.idTipoUnidad}
                                        disabled={state.agregar == "Consultar"}
                                        id="idTipoUnidad"
                                        disableClearable
                                        forcePopupIcon={false}
                                        options={dataTipoUnidad}
                                        getOptionLabel={(option) =>
                                          option.m_sTipoUnidad
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
                                                value: state.idTipoUnidad,
                                                disabled: state.agregar == "Consultar",
                                                endAdornment:
                                                  <InputAdornment position="end">
                                                    <IconButton padding="0px" style={{ paddingRight: "0px" }} onClick={() => { open(); setState({ ...state, identificadorModal: "idTipoUnidad", tipoModal: 3 }) }}>
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

                                  <div className="col-sm-4 col-md-4 unit">
                                    <label className="label">
                                      Unidad
                                  </label>
                                    <div className="input">
                                      <Autocomplete
                                        freeSolo
                                        onChange={(event, newValue) =>
                                          setState({
                                            ...state,
                                            idUnidad: newValue,
                                          })
                                        }
                                        value={state.idUnidad}
                                        disabled={state.agregar == "Consultar"}
                                        id="idUnidad"
                                        disableClearable
                                        forcePopupIcon={false}
                                        options={dataUnidad}
                                        getOptionLabel={(option) =>
                                          option.m_sDescripcion
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
                                                value: state.idUnidad,
                                                disabled: state.agregar == "Consultar",
                                                endAdornment:
                                                  <InputAdornment position="end">
                                                    <IconButton padding="0px" style={{ paddingRight: "0px" }} onClick={() => { open(); setState({ ...state, identificadorModal: "idUnidad", tipoModal: 4 }) }}>
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

                                </div>
                              </div>
                            </div>
                          </div>
                          <div className="col-md-6">
                            <div className="widget-header">
                              <h2>Salida para la Entrega</h2>
                            </div>
                            <div className="widget-container">
                              <div className="widget-content">

                                <div className="col-md-12">
                                  <label className="label">
                                    Fecha y Hora
                                </label>
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
                              <h2>Llegada de la Entrega</h2>
                            </div>
                            <div className="widget-container">
                              <div className="widget-content">

                                <div className="col-md-12">
                                  <label className="label">
                                    Fecha y Hora
                                </label>
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


                    <div className="widget-wrap col-md-5" id="paquetesSobres">
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
                                    <i className="zmdi zmdi-plus"></i> Agregar Paquete
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
                                    <i className="zmdi zmdi-plus"></i> Agregar Sobre</a>

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
                  <button href="#Listado" role="tab" data-toggle="tab" className="btn btn-secondary secondary-btn">Cancelar</button>
                  <button type="submit" className="btn btn-primary primary-btn">Aceptar</button>
                </div>
              </form>
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

export default Embarque;
