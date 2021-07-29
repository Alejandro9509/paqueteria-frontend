import React, { useEffect, useState, useMemo } from "react";
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
import SearchIcon from "@material-ui/icons/Search";
import InputAdornment from "@material-ui/core/InputAdornment";
import {
    ReactTable,
    useTable,
    useFilters,
    useAsyncDebounce,
    useSortBy,
    usePagination,
} from "react-table";
import $ from "jquery";
import { remove_array_element } from "../Util/Util";
import IconButton from "@material-ui/core/IconButton";
import PageviewIcon from "@material-ui/icons/Pageview";
import Autocomplete from "@material-ui/lab/Autocomplete";
import TextField from "@material-ui/core/TextField";
import useModal from "react-hooks-use-modal";
import { useHistory, Redirect } from "react-router-dom";
import { DataGrid } from "@material-ui/data-grid";
import SvgIcon from "@material-ui/core/SvgIcon";
import { ReactComponent as Activo } from "../iconos/Menu/palomita.svg";
import { ReactComponent as NoActivo } from "../iconos/Menu/cruz.svg";
import Noty from "noty";
import { Dialog, DialogActions, DialogContent, DialogTitle, Step, StepLabel, Stepper, Tooltip } from "@material-ui/core";
import { ToggleButtonGroup } from "@material-ui/lab";
import FormControl from "@material-ui/core/FormControl";
import InputLabel from "@material-ui/core/InputLabel";
import Select from "@material-ui/core/Select";
import { dataGridLocaleText } from "../Constants";
import { confirmAlert } from 'react-confirm-alert'; // Import
import 'react-confirm-alert/src/react-confirm-alert.css'; // Import css
import { obtenerCiudades } from "../Util/Contexts/CiudadesContext";
import { obtenerCodigoPostal } from "../Util/Contexts/CodigoPostalContext";
import { obtenerRemitentesDestinatarios } from "../Util/Contexts/RemitenteDestinatarioContext";
import { obtenerEmbalajes } from "../Util/Contexts/EmbalajesContext";
import { cancelarEmbarque, eliminarEmbarques, obtenerEmbarquesId, obtenerUltimoFolioEmbarques, obtenerEmbarqueCancelado, agregarEmbarques, modificarEmbarques, obtenerEmbarquesFiltro, obtenerEmbarques } from "../Util/Contexts/EmbarquesContext";
import { obtenerMonedas } from "../Util/Contexts/MonedaContext";
import { obtenerOperadores } from "../Util/Contexts/OperadoresContext";
import { obtenerTipoUnidades } from "../Util/Contexts/TipoUnidadContext";
import { obtenerUnidadesTipo } from "../Util/Contexts/UnidadesContext";
import { obtenerTipoCambio } from "../Util/Contexts/TipoCambioContext";
import { obtenerRecoleccionId } from "../Util/Contexts/RecoleccionContext";
import { obtenerSucursales } from "../Util/Contexts/SucursalContext";
import { obtenerEstatusEmbarque } from "../Util/Contexts/EstatusContext";
import { obtenerTipoCobro } from "../Util/Contexts/TipoCobroContext";
import { validarPermisos } from "../Util/Contexts/UsuarioContext";
import { imprimirFormatosId, obtenerFormatosImpresion } from "../Util/Contexts/FormatosImpresionContext";

function showSuccess(mensaje) {
    new Noty({
        type: "information",
        layout: "topCenter",
        text: mensaje,
        timeout: "3000",
    }).show();
}

const options = {
    title: 'Title',
    message: 'Message',
    buttons: [
        {
            label: 'Yes',
            onClick: () => alert('Click Yes')
        },
        {
            label: 'No',
            onClick: () => alert('Click No')
        }
    ],
    childrenElement: () => <div />,
    customUI: ({ onClose }) => <div>Custom UI</div>,
    closeOnEscape: true,
    closeOnClickOutside: true,
    willUnmount: () => { },
    afterClose: () => { },
    onClickOutside: () => { },
    onKeypressEscape: () => { },
    overlayClassName: "overlay-custom-class-name"
};

window.jQuery = window.$ = $;

const styles = {
    paqueteCarrusel: {
        height: "300px !important",
    },
    sobreCarrusel: {
        height: "100px !important",
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
    },
    root: {
        "& .super-app-theme--cell": {
            backgroundColor: "rgba(224, 183, 60, 0.55)",
            color: "#1a3e72",
            fontWeight: "600",
        },
        "& .super-app.esRecolecta": {
            backgroundColor: "green",
        },
        "& .super-app.noRecolecta": {
            backgroundColor: "red",
        },
    },
};
const useStyles = makeStyles(styles);

function Embarque(props) {
    var today = new Date();
    const classes = useStyles();
    const [redirect, setRedirect] = React.useState(false);
    const [data, setData] = React.useState([]);
    const [dataSucursal, setDataSucursal] = React.useState([]);
    const [dataEstatusEmbarque, setEstatusEmbarque] = React.useState([]);
    const [dataTipoMoneda, setDataTipoMoneda] = React.useState([]);
    const [dataTipoCobro, setDataTipoCobro] = React.useState([]);
    const [dataTipoCambio, setDataTipoCambio] = React.useState([]);
    const [dataCiudad, setDataCiudad] = React.useState([]);
    const [dataCodigoPostal, setDataCodigoPostal] = React.useState([]);
    const [dataOperador, setDataOperador] = React.useState([]);
    const [dataTipoUnidad, setDataTipoUnidad] = React.useState([]);
    const [dataUnidad, setDataUnidad] = React.useState([]);
    const [dataEmbalaje, setDataEmbalaje] = React.useState([]);
    const [dataFolioEmbarque, SetDataFolioEmbarque] = React.useState([]);
    const [dataFormatos, setFormatosImpresion] = React.useState([]);

    const [
        dataRemitenteDestinatario,
        setDataRemitenteDestinatario,
    ] = React.useState([]);

    const [state, setState] = React.useState({
        DerechoBorrar: 139,
        identificadorModal: "",
        tipoModal: 0,
        openDialog: false,
        agregar: "Agregar",
        idEmbarque: 0,
        fechaInicial: "0",
        fechaFinal:
            today.getFullYear()
            +
            "-" +
            (today.getMonth() + 1) +
            "-" +
            today.getDate(),
        sucursalListado: 0,
        estatusListado: 0,
        idSucursalAgregar: localStorage.getItem("Sucursal"),
        folioRecoleccion: "",
        folioEmbarque: "",
        folioGuía: "",
        folioInforme: "",
        fechaHoraCreacion:
            today.getDate() +
            "/" +
            (today.getMonth() + 1) +
            "/" +
            today.getFullYear() +
            " " +
            today.getHours() +
            ":" +
            today.getMinutes(),
        fechaHoraRegistro: "",
        estatusEmbarque: 15,
        moneda: 0,
        tipoCambio: "",
        tipoCobro: 0,
        nombreRemitente: {},
        RFCRemitente: "",
        domicilioRemitente: "",
        codigoPostalRemitente: {},
        ciudadRemitente: {},
        correoRemitente: "",
        telefonoRemitente: "",
        contactoRemitente: "",
        ciudadDestino: {},
        nombreDestinatario: "",
        RFCDestinatario: {},
        domicilioDestinatario: "",
        codigoPostalDestinatario: {},
        ciudadDestinatario: {},
        correoDestinatario: "",
        telefonoDestinatario: "",
        contactoDestinatario: "",
        ciudadOrigen: {},
        fechaEntrega: "",
        horaEntrega: "",
        codigoPostalEntrega: {},
        ciudadEntrega: {},
        zonaEntrega: "",
        domicilioEntrega: "",
        entregaEn: "",
        countSobres: 1,
        countPaquetes: 1,
        datosAdicionalesEntrega: "",
        cantidadDePaquetes: 0,
        cantidadDeSobres: 0,
        fechaHoraSalida: "",
        fechaHoraLlegada: "",
        diferenteEntrega: true,
        entregaEnSucursal: false,
        idSucursalEntrega: 0,
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
                m_cyValorDeclarado: "",
                m_sDescripcion: "",
                m_nCantidad: "",
                m_nTipo: 2,
                m_sObservaciones: "",
            },
        ],
        sobres: [
            {
                m_nTipo: 1,
                m_sDescripcion: "",
            },
        ],
        motivoCancelacion: "",
        fechaCancelacion: "",
        sucursalCancelacion: "",
        usuario: localStorage.getItem("Usuario"),
        height: window.innerHeight,
    });
    const [stepActive, setStepActive] = React.useState(1);
    const [Modal, open, close, isOpen] = useModal("root", {
        preventScroll: true,
    });

    const history = useHistory();

    function handleSelectCodigoPostal() {
        //state.ciudadEntrega = state.codigoPostalEntrega.m_nIdCiudad
        //setState.ciudadEntrega= dataCiudad.find(
        //   (o) => o.m_nIdCiudad == state.codigoPostalEntrega.m_nIdCiudad
        //)
    }

    function handleSelectRemitente(newValue) {
        console.log(newValue)
        let user = newValue
        setState({
            ...state,
            nombreRemitente: user,
            RFCRemitente: user.m_sRFC,
            domicilioRemitente: user.m_sDomicilio,

            codigoPostalRemitente: dataCodigoPostal.find(
                (o) => o.m_nIdCP == user.m_nIdCP
            ),

            ciudadRemitente: dataCiudad.find(
                (o) => o.m_nIdCiudad == dataCodigoPostal.find((o) => o.m_nIdCP == user.m_nIdCP).m_nIdCiudad
            ),

            correoRemitente: user.m_sCorreoElectronico,
            telefonoRemitente: user.m_sTelefono,
            contactoRemitente: user.m_sContacto,
        });

    }

    function handleSelectDestinatario(newValue) {
        setState({
            ...state,
            nombreDestinatario: newValue,
            RFCDestinatario: newValue.m_sRFC,
            domicilioDestinatario: newValue.m_sDomicilio,

            codigoPostalDestinatario: dataCodigoPostal.find(
                (o) => o.m_nIdCP == newValue.m_nIdCP
            ),

            ciudadDestinatario: dataCiudad.find(
                (o) => o.m_nIdCiudad ==
                    dataCodigoPostal.find((o) => o.m_nIdCP == newValue.m_nIdCP).m_nIdCiudad
            ),

            correoDestinatario: newValue.m_sCorreoElectronico,
            telefonoDestinatario: newValue.m_sTelefono,
            contactoDestinatario: newValue.m_sContacto,
        });
    }

    const handleAceptar = (e) => {
        e.preventDefault();


        if (state.m_nIdCiudadDetalleEntrega == undefined) {
            var params = {
                m_nIdEmbarque: state.idEmbarque,
                m_nIdRecoleccion: props.location.idRecoleccion,
                m_nFolioEmbarque: state.folioEmbarque,
                m_nFolioGuia: state.folioGuía,
                m_nFolioInforme: state.folioInforme,
                m_dFecha: state.fechaHoraCreacion.split("T")[0],
                m_tHora: state.fechaHoraCreacion.split("T")[1],

                m_dFechaRegistro: state.fechaHoraRegistro.split("T")[0],
                m_tHoraRegistro: state.fechaHoraRegistro.split("T")[1],
                m_nIdEstatusEmbarque: state.estatusEmbarque,
                m_nIdMoneda: state.moneda,
                m_cTIpoCambio: state.tipoCambio,
                m_nIdTIpoCobro: state.tipoCobro,
                m_sNOmbreRemitente: state.nombreRemitente.m_sNombreFiscal,
                m_sRFCRemitente: state.RFCRemitente,
                m_sDomicilioRemitente: state.domicilioRemitente,
                m_nIdCodigoPostalRemitente: state.codigoPostalRemitente.m_nIdCP,
                m_nCiudadRemitente: state.ciudadRemitente.m_nIdCiudad,
                m_sCorreoRemitente: state.correoRemitente,
                m_sTelefonoRemitente: state.telefonoRemitente,
                m_sContactoRemitente: state.contactoRemitente,
                m_nIdCiudadOrigen: state.ciudadOrigen.m_nIdCiudad,
                m_sNombreDestinatario: state.nombreDestinatario.m_sNombreFiscal,
                m_sRFCDestinatario: state.RFCDestinatario,
                m_sDomicilioDestinatario: state.domicilioDestinatario,
                m_nIdCodigoPostalDestinatario: state.codigoPostalDestinatario.m_nIdCP,
                m_nIdCIudadDestinatario: state.ciudadDestinatario.m_nIdCiudad,
                m_sCorreoDestinatario: state.correoDestinatario,
                m_sTelefonoDestinatario: state.telefonoDestinatario,
                m_sContactoDestinatario: state.contactoDestinatario,
                m_nIdCiudadDestino: state.ciudadDestino.m_nIdCiudad,
                m_dFechaEntrega: "",
                m_tHoraEntrega: "",
                m_nNoPaquetes: state.paquetes.length,
                m_nNoSobres: state.sobres.length,
                //m_nIdOperador: state.idOperador.m_nIdOperador,
                // m_nIdUnidad: state.idUnidad.m_nIdUnidad,
                m_dFechaSalida: state.fechaHoraSalida.split("T")[0],
                m_tHoraSalida: state.fechaHoraSalida.split("T")[1],
                FechaLlegada: state.fechaHoraLlegada.split("T")[0],
                HoraLlegada: state.fechaHoraLlegada.split("T")[1],
                CodigoPostalEntrega: state.codigoPostalEntrega,

                IdCiudadEntrega: state.ciudadEntrega.m_nIdCiudad,
                IdZonaEntrega: state.zonaEntrega,
                DomicilioEntrega: state.domicilioEntrega,
                EntregarEn: state.entregaEn,
                DatosAdicionales: state.datosAdicionalesEntrega,
                IdSucursal: state.idSucursalAgregar,
                m_arrClsDetalle: state.paquetes,
                CreadoPor: state.CreadoPor,
                ModificadoPor: state.ModificadoPor,
                m_tFechaDetalleEntrega: state.fechaEntrega.split("T")[0],
                m_tHoraDetalleEntrega: state.fechaEntrega.split("T")[1],
                m_bEntregaEnSucursal: state.entregaEnSucursal,
                m_nIdSucursalEntrega: state.idSucursalEntrega
            }

        } else {
            var params = {
                m_nIdEmbarque: state.idEmbarque,
                m_nIdRecoleccion: props.location.idRecoleccion,
                m_nFolioEmbarque: state.folioEmbarque,
                m_nFolioGuia: state.folioGuía,
                m_nFolioInforme: state.folioInforme,
                m_dFecha: state.fechaHoraCreacion.split("T")[0],
                m_tHora: state.fechaHoraCreacion.split("T")[1],

                m_dFechaRegistro: state.fechaHoraRegistro.split("T")[0],
                m_tHoraRegistro: state.fechaHoraRegistro.split("T")[1],
                m_nIdEstatusEmbarque: state.estatusEmbarque,
                m_nIdMoneda: state.moneda,
                m_cTIpoCambio: state.tipoCambio,
                m_nIdTIpoCobro: state.tipoCobro,
                m_sNOmbreRemitente: state.nombreRemitente.m_sNombreFiscal,
                m_sRFCRemitente: state.RFCRemitente,
                m_sDomicilioRemitente: state.domicilioRemitente,
                m_nIdCodigoPostalRemitente: state.codigoPostalRemitente.m_nIdCP,
                m_nCiudadRemitente: state.ciudadRemitente.m_nIdCiudad,
                m_sCorreoRemitente: state.correoRemitente,
                m_sTelefonoRemitente: state.telefonoRemitente,
                m_sContactoRemitente: state.contactoRemitente,
                m_nIdCiudadOrigen: state.ciudadOrigen.m_nIdCiudad,
                m_sNombreDestinatario: state.nombreDestinatario.m_sNombreFiscal,
                m_sRFCDestinatario: state.RFCDestinatario,
                m_sDomicilioDestinatario: state.domicilioDestinatario,
                m_nIdCodigoPostalDestinatario: state.codigoPostalDestinatario.m_nIdCP,
                m_nIdCIudadDestinatario: state.ciudadDestinatario.m_nIdCiudad,
                m_sCorreoDestinatario: state.correoDestinatario,
                m_sTelefonoDestinatario: state.telefonoDestinatario,
                m_sContactoDestinatario: state.contactoDestinatario,
                m_nIdCiudadDestino: state.ciudadDestino.m_nIdCiudad,
                m_dFechaEntrega: "",
                m_tHoraEntrega: "",
                m_nNoPaquetes: state.paquetes.length,
                m_nNoSobres: state.sobres.length,
                //m_nIdOperador: state.idOperador.m_nIdOperador,
                // m_nIdUnidad: state.idUnidad.m_nIdUnidad,
                m_dFechaSalida: state.fechaHoraSalida.split("T")[0],
                m_tHoraSalida: state.fechaHoraSalida.split("T")[1],
                FechaLlegada: state.fechaHoraLlegada.split("T")[0],
                HoraLlegada: state.fechaHoraLlegada.split("T")[1],
                CodigoPostalEntrega: state.codigoPostalEntrega,

                //  IdCiudadEntrega: state.ciudadEntrega.m_nIdCiudad,
                IdZonaEntrega: state.zonaEntrega,
                DomicilioEntrega: state.domicilioEntrega,
                EntregarEn: state.entregaEn,
                DatosAdicionales: state.datosAdicionalesEntrega,
                IdSucursal: state.idSucursalAgregar,
                m_arrClsDetalle: state.paquetes,
                CreadoPor: state.CreadoPor,
                ModificadoPor: state.ModificadoPor,
                m_tFechaDetalleEntrega: state.fechaEntrega.split("T")[0],
                m_tHoraDetalleEntrega: state.fechaEntrega.split("T")[1],
                m_bEntregaEnSucursal: state.entregaEnSucursal,
                m_nIdSucursalEntrega: state.idSucursalEntrega
            }

        }

        console.log(params)
        console.log(JSON.stringify(params))

        if (state.idEmbarque != 0) {
            modificarEmbarques(state.idEmbarque, params)
                .then((respuesta) => {
                    showSuccess(respuesta.data);
                    getAllEmbarque();
                    $('.nav-tabs li ').removeClass('active');
                    $('.nav-tabs li').eq(0).addClass('active');
                    $('.tab-content div ').removeClass('in show');
                    $('#Listado').addClass('in show');
                })
                .catch((err) => {
                    console.log(err);
                    showSuccess("El Usuario no tiene derecho para modificar");
                });
        } else {
            agregarEmbarques(params)
                .then((respuesta) => {
                    showSuccess(respuesta.data);
                    console.log(respuesta.data);
                    getAllEmbarque();
                    $('.nav-tabs li ').removeClass('active');
                    $('.nav-tabs li').eq(0).addClass('active');
                    $('.tab-content div ').removeClass('in show');
                    $('#Listado').addClass('in show');
                })
                .catch((err) => {
                    console.log(err);
                    showSuccess(err);
                });
        }
    };

    function handleSelectCP(id, cp) {
        if (state.identificadorModal == "nombreRemitente"){
            setState({
                ...state,
                [state.identificadorModal]: id,
                RFCRemitente: id.m_sRFC,
                domicilioRemitente: id.m_sDomicilio,

                codigoPostalRemitente: dataCodigoPostal.find(
                    (o) => o.m_nIdCP == id.m_nIdCP
                ),

                ciudadRemitente: dataCiudad.find(
                    (o) => o.m_nIdCiudad == dataCodigoPostal.find((o) => o.m_nIdCP == id.m_nIdCP).m_nIdCiudad
                ),

                correoRemitente: id.m_sCorreoElectronico,
                telefonoRemitente: id.m_sTelefono,
                contactoRemitente: id.m_sContacto,
            });
        }else{
            setState({
                ...state,
                [state.identificadorModal]: id,
                RFCDestinatario: id.m_sRFC,
                domicilioDestinatario: id.m_sDomicilio,

                codigoPostalDestinatario: dataCodigoPostal.find(
                    (o) => o.m_nIdCP == id.m_nIdCP
                ),

                ciudadDestinatario: dataCiudad.find(
                    (o) => o.m_nIdCiudad ==
                        dataCodigoPostal.find((o) => o.m_nIdCP == id.m_nIdCP).m_nIdCiudad
                ),

                correoDestinatario: id.m_sCorreoElectronico,
                telefonoDestinatario: id.m_sTelefono,
                contactoDestinatario: id.m_sContacto,
            });
        }

        console.log(id);
        console.log(state.identificadorModal);
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
            m_cyValorDeclarado: "",
            m_sDescripcion: "",
            m_nCantidad: "",
            m_nTipo: 2,
            m_sObservaciones: "",
        });
        console.log(paquetes);
        setState({
            ...state,
            paquetes: paquetes,
            countPaquetes: state.countPaquetes + 1,
        });
    }

    function getTipoCambio() {
        obtenerTipoCambio().then(respuesta => {
            setDataTipoCambio(respuesta.data)
            setState({
                ...state,
                tipoCambio: respuesta.data[0].m_cTipoCambio
            })
        });
    }

    function removePaquete(index) {
        var { paquetes } = state;
        if (paquetes.length !== 1) {
            paquetes.pop();
            setState({
                ...state,
                paquetes: paquetes,
                countPaquetes: state.countPaquetes - 1,
            });
        }
    }

    function addSobre() {
        const { sobres } = state;
        sobres.push({
            descripcion: "",
        });
        console.log(sobres);
        setState({ ...state, sobres: sobres, countSobres: state.countSobres + 1 });
    }

    function removeSobre(index) {
        var { sobres } = state;
        if (sobres.length !== 1) {
            sobres.pop();
            setState({
                ...state,
                sobres: sobres,
                countSobres: state.countSobres - 1,
            });
        }
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

    function handleEliminar(id) {
        var derecho;
        validarPermisos(state)
            .then((respuesta) => {
                //showSuccess(respuesta.data)

                derecho = respuesta.data;
                if (derecho === false) {
                    showSuccess("El usuario no tiene derechos para realizar el proceso");
                    return;
                }

                eliminarEmbarques(id, state.CreadoPor)
                    .then((respuesta) => {
                        showSuccess(respuesta.data);
                        getAllEmbarque();
                    })
                    .catch((err) => {
                        showSuccess(err);
                    });
            })
            .catch((err) => {
                showSuccess(err);
            });
    }

    const handleCancelar = (e) => {
        e.preventDefault();

        var params = {
            motivoCancelacion: state.motivoCancelacion,
            usuarioCancelacion: localStorage.getItem("UsuarioId"),
            fechaCancelacion: state.fechaCancelacion,
        };
        cancelarEmbarque(state, params).then((respuesta) => {
            console.log(respuesta.data);
        });
        $('.nav-tabs li ').removeClass('active'); $('.nav-tabs li').eq(2).addClass('active'); $('.tab-content div ').removeClass('in show'); $('#Cancelar').addClass('in show');

    };

    function handleShowCancelar() {
        var today = new Date();
        var hours = today.getHours();
        var minutes = today.getMinutes();
        var ampm = hours >= 12 ? "pm" : "am";
        hours = hours % 12;
        hours = hours ? hours : 12; // the hour '0' should be '12'
        minutes = minutes < 10 ? "0" + minutes : minutes;
        var strTime = hours + ":" + minutes + " " + ampm;
        obtenerEmbarqueCancelado(state).then((respuesta) => {
            console.log(respuesta.data.m_nSePuedeCancelar);
            setState({
                ...state,
                folioEmbarque: respuesta.data.m_nFolioEmbarque,
                sucursalCancelacion: dataSucursal.find(
                    (o) => o.m_nIdSucursal === respuesta.data.IdSucursal
                ).m_sSucursal,
                fechaCancelacion:
                    today.getDate() +
                    "/" +
                    (today.getMonth() + 1) +
                    "/" +
                    today.getFullYear() +
                    " " +
                    today.getHours() +
                    ":" +
                    today.getMinutes(),
                estatusEmbarque: dataEstatusEmbarque.find(
                    (o) => o.m_nIdEstatusEmbarque === respuesta.data.m_nIdEstatusEmbarque
                ).m_sEstatus,
                motivoCancelacion: respuesta.data.m_sMotivoCancelacion,
            });
            if (respuesta.data.m_nSePuedeCancelar === 0) {
                showSuccess("Embarque no se puede cancelar");
            } else {

            }
        });
    }

    function handleShowCancelarConfirmacion() {
        confirmAlert({
            title: 'Confirmar Eliminar',
            message: 'Está seguro de cancelar Embarque?',
            buttons: [
                {
                    label: 'Si',
                    onClick: () => handleCancelar
                },
                {
                    label: 'No',
                }
            ]
        })
    }

    function handleShowModificar(id) {
        console.log(id);
        obtenerEmbarquesId(id).then((respuesta) => {
            setState({
                ...state,
                agregar: "Modificar",
                idEmbarque: id,
                idSucursalAgregar: respuesta.data.IdSucursal,
                folioRecoleccion: respuesta.data.m_nFolioRecoleccion,
                folioEmbarque: respuesta.data.m_nFolioEmbarque,
                folioGuía: respuesta.data.m_nFolioGuia,
                folioInforme: respuesta.data.m_nFolioInforme,
                fechaHoraCreacion:
                    respuesta.data.m_dFecha +
                    "T" +
                    respuesta.data.m_tHora.split(":")[0] +
                    ":" +
                    respuesta.data.m_tHora.split(":")[1],
                fechaHoraRegistro:
                    respuesta.data.m_dFechaRegistro +
                    "T" +
                    respuesta.data.m_tHoraRegistro.slice(0, 5),
                moneda: respuesta.data.m_nIdMoneda,
                tipoCambio: respuesta.data.m_cTIpoCambio,
                tipoCobro: respuesta.data.m_nIdTIpoCobro,
                estatusEmbarque: respuesta.data.m_nIdEstatusEmbarque,


                nombreRemitente: dataRemitenteDestinatario.find(
                    (o) => o.m_sRFC === respuesta.data.m_sRFCRemitente
                ),
                domicilioRemitente: respuesta.data.m_sDomicilioRemitente,
                codigoPostalRemitente: dataCodigoPostal.find(
                    (o) => o.m_nIdCP === respuesta.data.m_nIdCodigoPostalRemitente
                ),
                ciudadRemitente: dataCiudad.find(
                    (o) => o.m_nIdCiudad === respuesta.data.m_nCiudadRemitente
                ),
                correoRemitente: respuesta.data.m_sCorreoRemitente,
                telefonoRemitente: respuesta.data.m_sTelefonoRemitente,
                contactoRemitente: respuesta.data.m_sContactoRemitente,
                ciudadOrigen: dataCiudad.find(
                    (o) => o.m_nIdCiudad === respuesta.data.m_nIdCiudadOrigen
                ),

                RFCRemitente: respuesta.data.m_sRFCRemitente,
                RFCDestinatario: respuesta.data.m_sRFCDestinatario,
                nombreDestinatario: dataRemitenteDestinatario.find(
                    (o) => o.m_sRFC === respuesta.data.m_sRFCDestinatario
                ),
                domicilioDestinatario: respuesta.data.m_sDomicilioDestinatario,
                codigoPostalDestinatario: dataCodigoPostal.find(
                    (o) => o.m_nIdCP === respuesta.data.m_nIdCodigoPostalDestinatario
                ),
                ciudadDestinatario: dataCiudad.find(
                    (o) => o.m_nIdCiudad === respuesta.data.m_nIdCIudadDestinatario
                ),
                correoDestinatario: respuesta.data.m_sCorreoDestinatario,
                telefonoDestinatario: respuesta.data.m_sTelefonoDestinatario,
                contactoDestinatario: respuesta.data.m_sContactoDestinatario,

                ciudadDestino: dataCiudad.find(
                    (o) => o.m_nIdCiudad === respuesta.data.m_nIdCiudadDestino
                ),
                zonaEntrega: respuesta.data.IdZonaEntrega,
                domicilioEntrega: respuesta.data.DomicilioEntrega,
                entregaEn: respuesta.data.EntregarEn,
                datosAdicionalesEntrega: respuesta.data.DatosAdicionalesis,
                fechaEntrega:
                    respuesta.data.m_dFechaEntrega + "T" + respuesta.data.m_tHoraEntrega,
                codigoPostalEntrega: dataCodigoPostal.find(
                    (o) => o.m_nIdCP === respuesta.data.CodigoPostalEntrega
                ),
                ciudadEntrega: dataCiudad.find(
                    (o) => o.m_nIdCiudad === respuesta.data.IdCiudadEntrega
                ),
                fechaHoraSalida:
                    respuesta.data.m_dFechaSalida + "T" + respuesta.data.m_tHoraSalida,
                fechaHoraLlegada:
                    respuesta.data.FechaLlegada + "T" + respuesta.data.HoraLlegada,
                idOperador: dataOperador.find(
                    (o) => o.m_nIdOperador === respuesta.data.m_nIdOperador
                ),
                // idTipoUnidad: dataTipoUnidad.find(
                //     (o) =>
                //         o.m_nIdTipoUnidad ==
                //             dataUnidad.find((o) => o.m_nIdUnidad === respuesta.data.m_nIdUnidad) ?
                //             dataUnidad.find((o) => o.m_nIdUnidad === respuesta.data.m_nIdUnidad).m_nIdTipoUnidad : 0
                // ),
                // idUnidad: dataUnidad.find(
                //     (o) => o.m_nIdUnidad === respuesta.data.m_nIdUnidad
                // ),
                paquetes: respuesta.data.m_arrPaquetes,
            });
            $('.nav-tabs li ').removeClass('active'); $('.nav-tabs li').eq(1).addClass('active'); $('.tab-content div ').removeClass('in show'); $('#Agregar').addClass('in show');

        });
    }

    function handleShowConsultar(id) {
        obtenerEmbarquesId(id).then((respuesta) => {
            setState({
                ...state,
                agregar: "Consultar",
                idEmbarque: id,
                idSucursalAgregar: respuesta.data.IdSucursal,
                folioRecoleccion: respuesta.data.m_nFolioRecoleccion,
                folioEmbarque: respuesta.data.m_nFolioEmbarque,
                folioGuía: respuesta.data.m_nFolioGuia,
                folioInforme: respuesta.data.m_nFolioInforme,
                fechaHoraCreacion:
                    respuesta.data.m_dFecha +
                    "T" +
                    respuesta.data.m_tHora.split(":")[0] +
                    ":" +
                    respuesta.data.m_tHora.split(":")[1],
                moneda: respuesta.data.m_nIdMoneda,
                tipoCambio: respuesta.data.m_cTIpoCambio,
                tipoCobro: respuesta.data.m_nIdTIpoCobro,
                estatusEmbarque: respuesta.data.m_nIdEstatusEmbarque,
                nombreRemitente: dataRemitenteDestinatario.find(
                    (o) => o.m_sRFC === respuesta.data.m_sRFCRemitente
                ),
                domicilioRemitente: respuesta.data.m_sDomicilioRemitente,
                codigoPostalRemitente: dataCodigoPostal.find(
                    (o) => o.m_nIdCP === respuesta.data.m_nIdCodigoPostalRemitente
                ),
                ciudadRemitente: dataCiudad.find(
                    (o) => o.m_nIdCiudad === respuesta.data.m_nCiudadRemitente
                ),
                correoRemitente: respuesta.data.m_sCorreoRemitente,
                telefonoRemitente: respuesta.data.m_sTelefonoRemitente,
                contactoRemitente: respuesta.data.m_sContactoRemitente,
                ciudadOrigen: dataCiudad.find(
                    (o) => o.m_nIdCiudad === respuesta.data.m_nIdCiudadOrigen
                ),

                nombreDestinatario: dataRemitenteDestinatario.find(
                    (o) => o.m_sRFC === respuesta.data.m_sRFCDestinatario
                ),
                domicilioDestinatario: respuesta.data.m_sDomicilioDestinatario,
                codigoPostalDestinatario: dataCodigoPostal.find(
                    (o) => o.m_nIdCP === respuesta.data.m_nIdCodigoPostalDestinatario
                ),
                ciudadDestinatario: dataCiudad.find(
                    (o) => o.m_nIdCiudad === respuesta.data.m_nIdCIudadDestinatario
                ),
                correoDestinatario: respuesta.data.m_sCorreoDestinatario,
                telefonoDestinatario: respuesta.data.m_sTelefonoDestinatario,
                contactoDestinatario: respuesta.data.m_sContactoDestinatario,

                ciudadDestino: dataCiudad.find(
                    (o) => o.m_nIdCiudad === respuesta.data.m_nIdCiudadDestino
                ),
                fechaEntrega:
                    respuesta.data.m_dFechaEntrega + "T" + respuesta.data.m_tHoraEntrega,
                codigoPostalEntrega: dataCodigoPostal.find(
                    (o) => o.m_nIdCP === respuesta.data.CodigoPostalEntrega
                ),
                ciudadEntrega: dataCiudad.find(
                    (o) => o.m_nIdCiudad === respuesta.data.IdCiudadEntrega
                ),
                fechaHoraSalida:
                    respuesta.data.m_dFechaSalida + "T" + respuesta.data.m_tHoraSalida,
                fechaHoraLlegada:
                    respuesta.data.FechaLlegada + "T" + respuesta.data.HoraLlegada,
                idOperador: dataOperador.find(
                    (o) => o.m_nIdOperador === respuesta.data.m_nIdOperador
                ),
              /*   idTipoUnidad: dataTipoUnidad.find(
                    (o) =>
                        o.m_sTipoUnidad ==
                        dataUnidad.find((o) => o.m_nIdUnidad === respuesta.data.m_nIdUnidad)
                            .m_sTipoUnidad
                ),
                idUnidad: dataUnidad.find(
                    (o) => o.m_nIdUnidad === respuesta.data.m_nIdUnidad
                ), */
                zonaEntrega: respuesta.data.IdZonaEntrega,
                domicilioEntrega: respuesta.data.DomicilioEntrega,
                entregaEn: respuesta.data.EntregarEn,
                datosAdicionalesEntrega: respuesta.data.DatosAdicionalesis,
                paquetes: respuesta.data.m_arrPaquetes,
            });
            $('.nav-tabs li ').removeClass('active'); $('.nav-tabs li').eq(1).addClass('active'); $('.tab-content div ').removeClass('in show'); $('#Agregar').addClass('in show');

        });
    }

    function handleShowAgregar() {
        var today = new Date();
        setState({
            ...state,
            agregar: "Agregar",
            idEmbarque: 0,
            folioRecoleccion: "",
            folioEmbarque:
                dataFolioEmbarque.length !== 0
                    ? dataFolioEmbarque[0].m_sFolioEmbarque
                    : null,
            fechaHoraRegistro: `${new Date().getFullYear()}-${`${new Date().getMonth() +
                1}`.padStart(2, 0)}-${`${new Date().getDate() + 1}`.padStart(
                    2,
                    0
                )}T${`${new Date().getHours()}`.padStart(
                    2,
                    0
                )}:${`${new Date().getMinutes()}`.padStart(2, 0)}`,

            folioGuía: "",
            folioInforme: "",
            fechaHoraCreacion:
                today.getDate() +
                "/" +
                (today.getMonth() + 1) +
                "/" +
                today.getFullYear() +
                " " +
                today.getHours() +
                ":" +
                today.getMinutes(),
            moneda: dataTipoMoneda ? dataTipoMoneda.length > 0 ? dataTipoMoneda[0].m_nIdMoneda : 0 : 0,
            tipoCambio: dataTipoCambio.length !== 0 ? dataTipoCambio[0].m_nIdTipoCambio : 2,
            tipoCobro: dataTipoCobro ? dataTipoCobro.length > 0 ? dataTipoCobro[0].m_nIdTipoCobro : 0 : 0,
            estatusEmbarque: dataEstatusEmbarque ? dataEstatusEmbarque.length > 0 ? dataEstatusEmbarque[0].m_nIdEstatusEmbarque : 0 : 0,
            nombreRemitente: {},
            RFCRemitente: "",
            domicilioRemitente: "",
            codigoPostalRemitente: dataCodigoPostal ? dataCodigoPostal.length > 0 ? dataCodigoPostal[0] : {} : {},
            ciudadRemitente: {},
            correoRemitente: "",
            telefonoRemitente: "",
            contactoRemitente: "",
            ciudadOrigen: {},
            nombreDestinatario: {},
            RFCDestinatario: "",
            domicilioDestinatario: "",
            codigoPostalDestinatario: dataCodigoPostal ? dataCodigoPostal.length > 0 ? dataCodigoPostal[0] : {} : {},
            ciudadDestino: {},
            correoDestinatario: "",
            telefonoDestinatario: "",
            contactoDestinatario: "",
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
                    m_nTipo: dataEmbalaje ? dataEmbalaje.length > 0 ? dataEmbalaje[0].m_nIdEmbalaje : 0 : 0,
                    m_sObservaciones: "",
                },
            ],
            cantidadDePaquetes: 0,
            cantidadDeSobres: 0,
        });
        $('.nav-tabs li ').removeClass('active'); $('.nav-tabs li').eq(1).addClass('active'); $('.tab-content div ').removeClass('in show'); $('#Agregar').addClass('in show');

    }

    function getUltimoFolioEmbarque() {
        obtenerUltimoFolioEmbarques().then((respuesta) => {
            SetDataFolioEmbarque(respuesta.data);
        });
    }

    const handleChange = (event) => {
        setState({
            ...state,
            [event.target.name]: event.target.value,
        });
    };

    const handleChangeSucursalEntrega = (event) => {
        console.log(event)
        setState({
            ...state,
            [event.target.name]: event.target.value,
            codigoPostalEntrega: dataSucursal.find(c => c.m_nIdSucursal == event.target.value).m_nIdCodigoPostal

        });
        console.log(state.codigoPostalEntrega)
    };

    const handleEntregaCheckboxChange = (event) => {
        setState({
            ...state,
            diferenteEntrega: !state.diferenteEntrega,
            entregaEnSucursal: false
        });
    };

    const handleEntregaEnSucursalCheckbox = (event) => {
        setState({
            ...state,
            entregaEnSucursal: !state.entregaEnSucursal,
            diferenteEntrega: false
        });
    };

    const handleSelectCiudadChange = (event) => {
        console.log("diferenteEntrega : " + state.diferenteEntrega);
        setState({
            ...state,
            ciudadRemitente: event.target.value,
        });
    };

    const handleFechaInicialFiltro = async (event) => {
        setState({
            ...state,
            fechaInicial: event.target.value,
        });
        obtenerEmbarquesFiltro(event.target.value, state.fechaInicial, state.sucursalListado, state.estatusListado).then((respuesta) => {
            setData(respuesta.data);
        });
    };

    const handleFechaFinalFiltro = async (event) => {
        setState({
            ...state,
            fechaFinal: event.target.value,
        });
        obtenerEmbarquesFiltro(state.fechaInicial, event.target.value, state.sucursalListado, state.estatusListado).then((respuesta) => {
            setData(respuesta.data);
        });
    };

    const handleSucursalFiltro = async (event) => {
        setState({
            ...state,
            sucursalListado: event.target.value,
        });
        obtenerEmbarquesFiltro(state.fechaInicial, state.fechaFinal, event.target.value, state.estatusListado).then((respuesta) => {
            setData(respuesta.data);
        });
    };

    const handleEstatusFiltro = async (event) => {
        setState({
            ...state,
            estatusListado: event.target.value,
        });
        obtenerEmbarquesFiltro(state.fechaInicial, state.fechaFinal, state.sucursalListado, event.target.value).then((respuesta) => {
            setData(respuesta.data);
        });
    };


    function handleSelectDatos(id, cp) {
        setState({
            ...state,
            [state.identificadorModal]: id,
        });
        console.log(id);
        console.log(state.identificadorModal);
    }


    const columns = React.useMemo(() => [
        {
            headerName: "Acciones",
            sortable: false, filterable: false,
            field: "",
            renderCell: (row) => {
                return (
                    <div>
                        <Tooltip title="Modificar">
                            <a
                                onClick={() => handleShowModificar(row.row.m_nIdEmbarque)}
                                className="btn btn-default btn-xs"
                            >
                                <i
                                    className="fa fa-pencil-square-o"
                                    style={{ color: "#F9A03E" }}
                                />
                            </a>
                        </Tooltip>
                        <Tooltip title="Consultar">
                            <a
                                className="btn btn-default btn-xs"
                                onClick={() => handleShowConsultar(row.row.m_nIdEmbarque)}
                            >
                                <i className="fa fa-eye" style={{ color: "#F9A03E" }} />
                            </a>
                        </Tooltip>
                        <Tooltip title="Eliminar">
                            <a
                                href="#"
                                className="btn btn-default btn-xs"
                                onClick={() => confirmAlert({
                                    title: 'Confirmar Eliminar',
                                    message: 'Está seguro de eliminar Embarque?',
                                    buttons: [
                                        {
                                            label: 'Si',
                                            onClick: () => handleEliminar(row.row.m_nIdEmbarque)
                                        },
                                        {
                                            label: 'No',
                                        }
                                    ]
                                })}
                            >
                                <i className="zmdi zmdi-delete" style={{ color: "#F30B0B" }} />
                            </a>
                        </Tooltip>



                    </div>
                );
            },
        },
        {
            headerName: "Folio",
            field: "m_nFolioEmbarque",
            width: 125,
        },
        {
            headerName: "Fecha/Hora Elaboración",
            field: "m_sFechaHora",
            width: 200,
        },
        {
            headerName: "Sucursal",
            field: "m_sSucursal",
            width: 150,
        },
        {
            headerName: "Estatus de la Orden",
            field: "m_sEstatusEmbarque",
            width: 200,
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
            headerName: "Folio Guía",
            field: "m_sFolioGuia",
            width: 150,
        },
        {
            headerName: "Folio Informe",
            field: "m_nFolioInforme",
            width: 150,
        },
        {
            headerName: "Es Recolecta",
            field: "m_bEsRecolecta",
            width: 125,
            renderCell: (row) => {
                return (
                    <div
                        style={{
                            width: "100%",
                            textAlign: "center",
                            color: (row.row.m_bEsRecolecta != 0 ? "green" : "red"),
                        }}
                    >
                        {
                            (row.row.m_bEsRecolecta != 0 ? (
                                <SvgIcon component={Activo} />
                            ) : (
                                <SvgIcon component={NoActivo} />
                            ))
                        }
                    </div>
                );
            },
        },
        {
            headerName: "Folio Recolección",
            field: "m_sFolioRecoleccion",
            width: 150,
        },
        {
            headerName: "Cancelado",
            field: "m_dtFechaCancelacion",
            width: 150,
        },
        {
            headerName: "Usuario que Cancela",
            field: "m_sUsuarioCancelacion",
            width: 200,
            renderCell: (row) => {
                <div>
                    {row.row.m_sUsuarioCancelacion == "0" ? "N/A" : row.row.m_sUsuarioCancelacion}
                </div>
            }
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
            Name: "Activo",
            accessor: "m_bActivo",
            width: 100,
            renderCell: (row) => {
                return (
                    <div
                        style={{
                            width: "100%",
                            textAlign: "center",
                            color: row.row.m_bActivo === "true" ? "green" : "red",
                        }}
                    >
                        {row.row.m_bActivo ? (
                            <SvgIcon component={Activo} />
                        ) : (
                            <SvgIcon component={NoActivo} />
                        )}
                    </div>
                );
            },
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

    useEffect(
        async (value) => {
            if (props.location.idRecoleccion != undefined) {
                obtenerRecoleccionId(props.location.idRecoleccion)
                    .then((respuesta) => {

                        var paquetesModificado = respuesta.data.m_parrPaquetes;
                        console.log(paquetesModificado);
                        for (let i = 0; i < respuesta.data.m_parrPaquetes.length; i++) {
                            paquetesModificado[i]["m_nTipo"] = 2;
                            paquetesModificado[i]["m_xPeso"] = paquetesModificado[i].m_rPeso;
                            paquetesModificado[i]["m_xLargo"] =
                                paquetesModificado[i].m_rLargo;
                            paquetesModificado[i]["m_xAncho"] =
                                paquetesModificado[i].m_rAncho;
                            paquetesModificado[i]["m_xAlto"] = paquetesModificado[i].m_rAlto;
                            paquetesModificado[i]["m_xVolumen"] =
                                paquetesModificado[i].m_rVolumen;
                            paquetesModificado[i]["m_nIdTIpoEmpaque"] =
                                paquetesModificado[i].m_nIdTipoEmbalaje;
                            paquetesModificado[i]["m_cValorDeclarado"] =
                                paquetesModificado[i].m_cyValorDeclarado;
                        }
                        console.log(paquetesModificado);
                        setState({
                            ...state,
                            idEmbarque: 0,
                            idSucursalAgregar: respuesta.data.m_nIdSucursal,
                            folioRecoleccion: respuesta.data.m_sFolioRecoleccion,
                            folioEmbarque:
                                dataFolioEmbarque.length !== 0
                                    ? dataFolioEmbarque[0].m_sFolioEmbarque
                                    : null,
                            folioGuía: respuesta.data.m_nFolioGuia,
                            folioInforme: respuesta.data.m_nFolioInforme,
                            fechaHoraCreacion:
                                today.getDate() +
                                "/" +
                                (today.getMonth() + 1) +
                                "/" +
                                today.getFullYear() +
                                " " +
                                today.getHours() +
                                ":" +
                                today.getMinutes(),
                            moneda: respuesta.data.m_nMoneda,
                            tipoCambio: respuesta.data.m_rTipoCambio,
                            tipoCobro: respuesta.data.m_nIdTipoDeCobro,
                            nombreRemitente: dataRemitenteDestinatario.find(
                                (o) => o.m_sRFC === respuesta.data.m_sRFCRemitente
                            ),
                            RFCRemitente: respuesta.data.m_sRFCRemitente,
                            domicilioRemitente: respuesta.data.m_sDomicilioRemitente,
                            codigoPostalRemitente: dataCodigoPostal.find(
                                (o) => o.m_nIdCP === respuesta.data.m_sIdCodigoPostalRemitente
                            ),
                            ciudadRemitente: dataCiudad.find(
                                (o) => o.m_nIdCiudad === respuesta.data.m_nIdCiudadRemitente
                            ),
                            correoRemitente: respuesta.data.m_sCorreoRemitente,
                            telefonoRemitente: respuesta.data.m_sTelefonoRemitente,
                            contactoRemitente: respuesta.data.m_sContactoRemitente,
                            ciudadOrigen: dataCiudad.find(
                                (o) => o.m_nIdCiudad === respuesta.data.m_nIdCiudadOrigen
                            ),

                            nombreDestinatario: dataRemitenteDestinatario.find(
                                (o) => o.m_sRFC === respuesta.data.m_sRFCDestinatario
                            ),
                            RFCDestinatario: respuesta.data.m_sRFCDestinatario,
                            domicilioDestinatario: respuesta.data.m_sDomicilioDestinatario,
                            codigoPostalDestinatario: dataCodigoPostal.find(
                                (o) => o.m_nIdCP === respuesta.data.m_sIdCodigoPostalDestinatario
                            ),
                            ciudadDestinatario: dataCiudad.find(
                                (o) => o.m_nIdCiudad === respuesta.data.m_nIdCiudadDestinatario
                            ),
                            correoDestinatario: respuesta.data.m_sCorreoDestinatario,
                            telefonoDestinatario: respuesta.data.m_sTelefonoDestinatario,
                            contactoDestinatario: respuesta.data.m_sContactoDestinatario,

                            ciudadDestino: dataCiudad.find(
                                (o) => o.m_nIdCiudad === respuesta.data.m_nIdCiudadDestino
                            ),
                            zonaEntrega: respuesta.data.m_nIdZonaDetalleEntrega,
                            domicilioEntrega: respuesta.data.m_sDomicilioDetalleEntrega,
                            entregaEn: respuesta.data.m_sEntregarEnDetalleEntrega,
                            datosAdicionalesEntrega:
                                respuesta.data.m_sDatosAdicionalesDetalleEntrega,
                            fechaEntrega:
                                respuesta.data.m_dFechaEntrega +
                                "T" +
                                respuesta.data.m_tHoraEntrega,
                            codigoPostalEntrega: dataCodigoPostal.find(
                                (o) => o.m_nIdCP === respuesta.data.m_nIdCPDetalleEntrega
                            ),
                            ciudadEntrega: dataCiudad.find(
                                (o) => o.m_nIdCiudad === respuesta.data.m_nIdCiudadDetalleEntrega
                            ),
                            fechaHoraSalida:
                                respuesta.data.m_dFechaSalida +
                                "T" +
                                respuesta.data.m_tHoraSalida,
                            fechaHoraLlegada:
                                respuesta.data.FechaLlegada + "T" + respuesta.data.HoraLlegada,
                            idOperador: dataOperador.find(
                                (o) => o.m_nIdOperador === respuesta.data.m_nIdOperador
                            ),

                            idUnidad: dataUnidad.find(
                                (o) => o.m_nIdUnidad === respuesta.data.m_nIdUnidad
                            ),
                            paquetes: paquetesModificado,
                        });
                        console.log(
                            dataRemitenteDestinatario.find(
                                (o) => o.m_sRFC === respuesta.data.m_sRFCRemitente
                            )
                        );
                    })
                    .then(() => {
                        // handleSelectRemitente();
                    });
            }
            if (
                localStorage.getItem("UsuarioId") === null ||
                localStorage.getItem("UsuarioId") <= 0
            ) {
                showSuccess("Es necesario iniciar sesion para acceder a este proceso");
                window.location.replace("login");
                return;
            }
        },
        [
            dataRemitenteDestinatario,
            dataCiudad,
            dataCodigoPostal,
            dataOperador,
            dataUnidad,
            dataTipoUnidad,
        ]
    );

    useEffect((value) => {
        getAllData();
    }, []);

    async function getAllData() {
        getAllEmbarque();
        getAllSucursales();
        getAllEstatusEmbarque();
        getAllTipoCobro();
        getAllTipoMoneda();
        getAllCiudades();
        getAllCodigosPostales();
        getAllOperadores();
        getAllTipoUnidad();
        getAllRemitentesDestinatarios();
        getAllEmbalajes();
        getUltimoFolioEmbarque();
        getTipoCambio()
        getFormatosImpresion()
    }

    async function getAllEmbarque() {
        obtenerEmbarques().then((respuesta) => {
            setData(respuesta.data);
        });
    }

    function getFormatosImpresion() {
        obtenerFormatosImpresion().then(respuesta => {
            setFormatosImpresion(respuesta.data)
        });
    };

    async function getAllRemitentesDestinatarios() {
        obtenerRemitentesDestinatarios().then((respuesta) => {
            setDataRemitenteDestinatario(respuesta.data);
        });
    }

    async function getAllSucursales() {
        obtenerSucursales().then((respuesta) => {
            setDataSucursal(respuesta.data);
        });
    }

    async function getAllEstatusEmbarque() {
        obtenerEstatusEmbarque().then((respuesta) => {
            setEstatusEmbarque(respuesta.data);
        });
    }

    async function getAllTipoCobro() {
        obtenerTipoCobro().then((respuesta) => {
            setDataTipoCobro(respuesta.data);
        });
    }

    async function getAllTipoMoneda() {
        obtenerMonedas().then((respuesta) => {
            setDataTipoMoneda(respuesta.data);
        });
    }

    async function getAllCiudades() {
        obtenerCiudades().then((respuesta) => {
            setDataCiudad(respuesta.data);
        });
    }

    async function getAllCodigosPostales() {
        obtenerCodigoPostal().then((respuesta) => {
            setDataCodigoPostal(respuesta.data);
        });
    }

    async function getAllOperadores() {
        obtenerOperadores().then((respuesta) => {
            setDataOperador(respuesta.data);
        });
    }

    async function getAllTipoUnidad() {
        obtenerTipoUnidades().then((respuesta) => {
            setDataTipoUnidad(respuesta.data);
            getAllUnidades(1);
        });
    }

    async function getAllUnidades(id) {
        obtenerUnidadesTipo(id).then((respuesta) => {
            setDataUnidad(respuesta.data);
        });
    }

    async function getAllEmbalajes() {
        obtenerEmbalajes().then((respuesta) => {
            setDataEmbalaje(respuesta.data);
        });
    }



    const headers = {
        "Content-Type": "application/json",
    };

    const headers2 = {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
    };

    function conDatos() {
        return data.length != 0;
    }

    function DefaultColumnFilter({
        column: { filterValue, preFilteredRows, setFilter },
    }) {
        const count = preFilteredRows.length;
        const [showResults, setShowResults] = React.useState(false);
        const onClick = () => setShowResults(!showResults);
        return (
            <div style={{ display: "flex" }}>
                <a onClick={onClick}>
                    <i className="fa fa-search" />
                </a>
                <br></br>
                <input
                    className="form-control"
                    type={showResults ? "" : "hidden"}
                    value={filterValue || ""}
                    onChange={(e) => {
                        setFilter(e.target.value || undefined);
                    }}
                    placeholder={`Buscar ${count} registros...`}
                />
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
                        {rows.map((row, i) => {
                            prepareRow(row);
                            return (
                                <tr
                                    style={{
                                        backgroundColor:
                                            row.original.m_nIdUnidad === select ? "#FCC88F" : "white",
                                    }}
                                    {...row.getRowProps()}
                                    onClick={handleSelectCP.bind(this, row.original)}
                                >
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
            <div
                className="col-md-12"
                style={{ maxHeight: "300px", overflow: "auto" }}
            >
                <table className="table" {...getTableProps()}>
                    <thead>
                        {headerGroups.map((headerGroup) => (
                            <tr {...headerGroup.getHeaderGroupProps()}>
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
                        {rows.map((row, i) => {
                            prepareRow(row);
                            return (
                                <tr
                                    style={{
                                        backgroundColor:
                                            row.original.m_nIdCP === select ? "orange" : "white",
                                    }}
                                    {...row.getRowProps()}
                                    onClick={handleSelectDatos.bind(this, row.original)}
                                    onDoubleClick={close}
                                >
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
                        {rows.map((row, i) => {
                            prepareRow(row);
                            return (
                                <tr
                                    style={{
                                        backgroundColor:
                                            row.original.m_nIdCiudad === select ? "orange" : "white",
                                    }}
                                    {...row.getRowProps()}
                                    onClick={handleSelectDatos.bind(this, row.original)}
                                >
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
                        {rows.map((row, i) => {
                            prepareRow(row);
                            return (
                                <tr
                                    style={{
                                        backgroundColor:
                                            row.original.m_nIdOperador === select
                                                ? "orange"
                                                : "white",
                                    }}
                                    {...row.getRowProps()}
                                    onClick={handleSelectDatos.bind(this, row.original)}
                                >
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
                        {rows.map((row, i) => {
                            prepareRow(row);
                            return (
                                <tr
                                    style={{
                                        backgroundColor:
                                            row.original.m_nIdTipoUnidad === select
                                                ? "orange"
                                                : "white",
                                    }}
                                    {...row.getRowProps()}
                                    onClick={handleSelectDatos.bind(this, row.original)}
                                >
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
                        {rows.map((row, i) => {
                            prepareRow(row);
                            return (
                                <tr
                                    style={{
                                        backgroundColor:
                                            row.original.m_nIdUnidad === select ? "orange" : "white",
                                    }}
                                    {...row.getRowProps()}
                                    onClick={handleSelectDatos.bind(this, row.original)}
                                >
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

    const handleImprimir = () => {
        imprimirFormatosId(state.formatoSeleccionado).then((response) => {
            var file = new Blob([response.data], { type: 'application/pdf' })
            var fileURL = URL.createObjectURL(file)
            console.log(fileURL)
            window.open(fileURL);
        })

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
        $("html, body").animate(
            {
                scrollTop: parseInt($section.offset().top - 150),
            },
            200
        );
    }



    if (redirect) {
        if (
            data.find((o) => o.m_nIdEmbarque == state.idEmbarque).m_sFolioGuia != ""
        ) {
            showSuccess("Embarque ya tiene Guía");
        } else {
            return (
                <Redirect
                    push
                    to={{
                        pathname: "/Guia",
                        idEmbarque: state.idEmbarque,
                    }}
                />
            );
        }
    }

    const framesPaquete = state.paquetes.map((p, index) => {
        return (
            <div key={`paquete${index}`}>
                <div className="col-sm-12 col-md-12 unit">
                    <h4>
                        <strong>{`Paquete #${index + 1}`}</strong>
                    </h4>
                </div>

                <div className="col-sm-4 col-md-2-5 unit">
                    <div className="input">
                        <TextField variant="outlined" margin="dense" label="Peso"
                            onChange={(event) => handleChangePaquete(event, index)}
                            className="form-control"
                            type="text"
                            value={state.paquetes[index].m_xPeso}
                            disabled={state.agregar === "Consultar"}
                            placeholder="kg"
                            name="m_xPeso"
                        />
                    </div>
                </div>

                <div className="col-sm-4 col-md-2-5 unit">
                    <div className="input">
                        <TextField variant="outlined" margin="dense" label="Largo"
                            onChange={(event) => handleChangePaquete(event, index)}
                            className="form-control"
                            type="text"
                            value={state.paquetes[index].m_xLargo}
                            disabled={state.agregar === "Consultar"}
                            placeholder="mts"
                            name="m_xLargo"
                        />
                    </div>
                </div>

                <div className="col-sm-4 col-md-2-5 unit">
                    <div className="input">
                        <TextField variant="outlined" margin="dense" label="Ancho"
                            onChange={(event) => handleChangePaquete(event, index)}
                            className="form-control"
                            type="text"
                            value={state.paquetes[index].m_xAncho}
                            disabled={state.agregar === "Consultar"}
                            placeholder="mts"
                            name="m_xAncho"
                        />
                    </div>
                </div>

                <div className="col-sm-4 col-md-2-5 unit">
                    <div className="input">
                        <TextField variant="outlined" margin="dense" label="Alto"
                            onChange={(event) => handleChangePaquete(event, index)}
                            className="form-control"
                            type="text"
                            value={state.paquetes[index].m_xAlto}
                            disabled={state.agregar === "Consultar"}
                            placeholder="mts"
                            name="m_xAlto"
                        />
                    </div>
                </div>

                <div className="col-sm-4 col-md-2-5 unit">
                    <div className="input">
                        <TextField variant="outlined" margin="dense" label="Volumen"
                            onChange={(event) => handleChangePaquete(event, index)}
                            className="form-control"
                            type="text"
                            value={state.paquetes[index].m_xVolumen}
                            disabled={state.agregar === "Consultar"}
                            placeholder="mts3"
                            name="m_xVolumen"
                        />
                    </div>
                </div>

                <div className="col-sm-4 col-md-6 unit">
                    <label className="input select">
                        <FormControl fullWidth variant="outlined" margin="dense">
                            <InputLabel id="idTipoEmbalajeLabel">Tipo de Embalaje</InputLabel>
                            <Select
                                labelId="idTipoEmbalajeLabel"
                                className="form-control"
                                value={state.paquetes[index].m_nIdTIpoEmpaque}
                                onChange={(event) => handleChangePaquete(event, index)}
                                disabled={state.agregar === "Consultar"}
                                id="m_nIdTIpoEmpaque"
                                label={"Tipo de Embalaje"}
                                name="m_nIdTIpoEmpaque"
                                InputProps={{
                                    name: "m_nIdTIpoEmpaque"
                                }}
                            >
                                {dataEmbalaje.map((embalaje) => (
                                    <option
                                        key={embalaje.m_nIdEmbalaje}
                                        value={embalaje.m_nIdEmbalaje}
                                    >
                                        {embalaje.m_sNombre}
                                    </option>
                                ))}
                            </Select>
                        </FormControl>
                    </label>
                </div>

                <div className="col-sm-4 col-md-6 unit">
                    <div className="input">
                        <TextField variant="outlined" margin="dense" label="Valor Declarado"
                            onChange={(event) => handleChangePaquete(event, index)}
                            className="form-control"
                            type="text"
                            value={state.paquetes[index].m_cyValorDeclarado}
                            disabled={state.agregar === "Consultar"}
                            placeholder="$"
                            name="m_cyValorDeclarado"
                        />
                    </div>
                </div>

                <div className="col-sm-4 col-md-8 unit">
                    <div className="input">
                        <TextField variant="outlined" margin="dense" label="Descripción"
                            onChange={(event) => handleChangePaquete(event, index)}
                            className="form-control"
                            type="text"
                            value={state.paquetes[index].m_sDescripcion}
                            disabled={state.agregar === "Consultar"}
                            placeholder="Descripción"
                            name="m_sDescripcion"
                        />
                    </div>
                </div>

                <div className="col-sm-4 col-md-4 unit">
                    <div className="input">
                        <TextField variant="outlined" margin="dense" label="Ctd"
                            onChange={(event) => handleChangePaquete(event, index)}
                            className="form-control"
                            type="text"
                            value={state.paquetes[index].m_nCantidad}
                            disabled={state.agregar === "Consultar"}
                            placeholder="Cantidad"
                            name="m_nCantidad"
                        />
                    </div>
                </div>

                <div className="col-sm-4 col-md-12 unit">
                    <div className="input">
                        <TextField variant="outlined" margin="dense" label="Observaciones"
                            onChange={(event) => handleChangePaquete(event, index)}
                            className="form-control"
                            type="text"
                            value={state.paquetes[index].m_sObservaciones}
                            disabled={state.agregar === "Consultar"}
                            placeholder="Observaciones"
                            name="m_sObservaciones"
                        />
                    </div>
                </div>
            </div>
        );
    });

    const framesSobre = state.sobres.map((p, index) => {
        return (
            <div key={`sobre${index}`}>
                <div className="col-md-12 unit">
                    <h4>
                        {" "}
                        <strong>{`Sobre #${index + 1}`}</strong>
                    </h4>
                    <div className="input">
                        <TextField variant="outlined" margin="dense" label="Descripcion"
                            onChange={(event) => handleChangeSobre(event, index)}
                            className="form-control"
                            type="text"
                            value={state.sobres[index].descripcion}
                            disabled={state.agregar === "Consultar"}
                            placeholder="Descripción"
                            name="descripcion"
                        />
                    </div>
                </div>
            </div>
        );
    });

    return (
        <div >

            <Dialog
                open={state.openDialog}
                onClose={() => setState({ ...state, openDialog: false })}
                fullWidth maxWidth="md"
            >
                <DialogContent>
                    {state.tipoModal === 0 && (
                        <div className="row" style={{ backgroundColor: "#FFFFFF" }}>
                            <div align="right">
                                <button
                                    onClick={() => {
                                        history.push("/Ciudades");
                                    }}
                                    className="btn btn-primary primary-btn"
                                >
                                    Agregar
                                </button>
                            </div>

                            {dataCodigoPostal.length != 0 ? (
                                <TableCodigoPostal
                                    object={state}
                                    select={
                                        state[state.identificadorModal] &&
                                        state[state.identificadorModal].m_nIdCP
                                    }
                                    columns={columnsCP}
                                    data={dataCodigoPostal}
                                    identificadorModal={state.identificadorModal}
                                />
                            ) : (
                                <div>No se encontró ningún registro</div>
                            )}

                            <DialogActions style={{ justifyContent: "left" }}>
                                <button
                                    onClick={() => setState({ ...state, openDialog: false })}
                                    className="btn btn-secondary secondary-btn"
                                >
                                    Cerrar
                                </button>
                                <button
                                    onClick={() => setState({ ...state, openDialog: false })}
                                    className="btn btn-primary primary-btn"
                                >
                                    Aceptar
                                </button>
                            </DialogActions>
                        </div>
                    )}
                    {state.tipoModal === 1 && (
                        <div className="row" style={{ backgroundColor: "#FFFFFF" }}>
                            <div align="right">
                                <button
                                    onClick={() => {
                                        history.push("/Ciudades");
                                    }}
                                    className="btn btn-primary primary-btn"
                                >
                                    Agregar
                                </button>
                            </div>

                            {dataCiudad.length != 0 ? (
                                <TableCiudades
                                    object={state}
                                    select={
                                        state[state.identificadorModal] &&
                                        state[state.identificadorModal].m_nIdCiudad
                                    }
                                    columns={columnsCiudades}
                                    data={dataCiudad}
                                    identificadorModal={state.identificadorModal}
                                />
                            ) : (
                                <div>No se encontró ningún registro</div>
                            )}
                            <DialogActions style={{ justifyContent: "left" }}>
                                <button
                                    onClick={() => setState({ ...state, openDialog: false })}
                                    className="btn btn-secondary secondary-btn"
                                >
                                    Cerrar
                                </button>
                                <button
                                    onClick={() => setState({ ...state, openDialog: false })}
                                    className="btn btn-primary primary-btn"
                                >
                                    Aceptar
                                </button>
                            </DialogActions>
                        </div>
                    )}
                    {state.tipoModal === 2 && (
                        <div className="row" style={{ backgroundColor: "#FFFFFF" }}>
                            <div align="right">
                                <button
                                    onClick={() => {
                                        history.push("/Operador");
                                    }}
                                    className="btn btn-primary primary-btn"
                                >
                                    Agregar
                                </button>
                            </div>

                            {dataOperador.length != 0 ? (
                                <TableOperadores
                                    object={state}
                                    select={
                                        state[state.identificadorModal] &&
                                        state[state.identificadorModal].m_nIdOperador
                                    }
                                    columns={columnsOperadores}
                                    data={dataOperador}
                                    identificadorModal={state.identificadorModal}
                                />
                            ) : (
                                <div>No se encontró ningún registro</div>
                            )}
                            <DialogActions style={{ justifyContent: "left" }}>
                                <button
                                    onClick={() => setState({ ...state, openDialog: false })}
                                    className="btn btn-secondary secondary-btn"
                                >
                                    Cerrar
                                </button>
                                <button
                                    onClick={() => setState({ ...state, openDialog: false })}
                                    className="btn btn-primary primary-btn"
                                >
                                    Aceptar
                                </button>
                            </DialogActions>
                        </div>
                    )}
                    {state.tipoModal === 3 && (
                        <div className="row" style={{ backgroundColor: "#FFFFFF" }}>
                            <div align="right">
                                <button
                                    onClick={() => {
                                        history.push("/TipoUnidad");
                                    }}
                                    className="btn btn-primary primary-btn"
                                >
                                    Agregar
                                </button>
                            </div>
                            {dataTipoUnidad.length != 0 ? (
                                <TableTipoUnidad
                                    object={state}
                                    select={
                                        state[state.identificadorModal] &&
                                        state[state.identificadorModal].m_nIdTipoUnidad
                                    }
                                    columns={columnsTipoUnidades}
                                    data={dataTipoUnidad}
                                    identificadorModal={state.identificadorModal}
                                />
                            ) : (
                                <div>No se encontró ningún registro</div>
                            )}
                            <DialogActions style={{ justifyContent: "left" }}>
                                <button
                                    onClick={() => setState({ ...state, openDialog: false })}
                                    className="btn btn-secondary secondary-btn"
                                >
                                    Cerrar
                                </button>
                                <button
                                    onClick={() => setState({ ...state, openDialog: false })}
                                    className="btn btn-primary primary-btn"
                                >
                                    Aceptar
                                </button>
                            </DialogActions>
                        </div>
                    )}
                    {state.tipoModal === 4 && (
                        <div className="row" style={{ backgroundColor: "#FFFFFF" }}>
                            <div align="right">
                                <button
                                    onClick={() => {
                                        history.push("/Unidades");
                                    }}
                                    className="btn btn-primary primary-btn"
                                >
                                    Agregar
                                </button>
                            </div>

                            {dataUnidad.length != 0 ? (
                                <TableUnidad
                                    object={state}
                                    select={
                                        state[state.identificadorModal] &&
                                        state[state.identificadorModal].m_nIdUnidad
                                    }
                                    columns={columnsUnidades}
                                    data={dataUnidad}
                                    identificadorModal={state.identificadorModal}
                                />
                            ) : (
                                <div>No se encontró ningún registro</div>
                            )}
                            <DialogActions style={{ justifyContent: "left" }}>
                                <button
                                    onClick={() => setState({ ...state, openDialog: false })}
                                    className="btn btn-secondary secondary-btn"
                                >
                                    Cerrar
                                </button>
                                <button
                                    onClick={() => setState({ ...state, openDialog: false })}
                                    className="btn btn-primary primary-btn"
                                >
                                    Aceptar
                                </button>
                            </DialogActions>
                        </div>
                    )}
                    {state.tipoModal === 5 && (
                        <div className="row" style={{ backgroundColor: "#FFFFFF" }}>
                            <div align="right">
                                <button
                                    onClick={() => {
                                        history.push("/RemitenteDestinatarios");
                                    }}
                                    className="btn btn-primary primary-btn"
                                >
                                    Agregar
                                </button>
                            </div>

                            {dataRemitenteDestinatario.length != 0 ? (
                                <TableRemitentesDestinatarios
                                    object={state}
                                    select={
                                        state[state.identificadorModal] &&
                                        state[state.identificadorModal].m_nIdRemitenteDestinatario
                                    }
                                    columns={columnsRemitenteDestinatarios}
                                    data={dataRemitenteDestinatario}
                                    identificadorModal={state.identificadorModal}
                                />
                            ) : (
                                <div>No se encontró ningún registro</div>
                            )}
                            <DialogActions style={{ justifyContent: "left" }}>
                                <button
                                    onClick={() => setState({ ...state, openDialog: false })}
                                    className="btn btn-secondary secondary-btn"
                                >
                                    Cerrar
                                </button>
                                <button
                                    onClick={() => setState({ ...state, openDialog: false })}
                                    className="btn btn-primary primary-btn"
                                >
                                    Aceptar
                                </button>
                            </DialogActions>
                        </div>
                    )}
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
                <Cabecera titulo="Embarque" >
                    <div className="page-header">
                        <ul className="list-page-breadcrumb">
                            <li className="active-page">Embarque</li>
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
                        <li className={props.location.idRecoleccion != undefined ? "" : "active"}>

                            <a onClick={(event) => { event.stopPropagation(); setState({ ...state, agregar: "Agregar" }); $('.nav-tabs li ').removeClass('active'); $('.nav-tabs li').eq(0).addClass('active'); $('.tab-content div ').removeClass('in show'); $('#Listado').addClass('in show'); }}>
                                <i className="fa fa-list" /> Listado
                            </a>
                        </li>


                        <li className={props.location.idRecoleccion != undefined ? "active" : ""}>
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
                        <li>
                            <ExportCSV csvData={data} fileName="Embarque_Listado" />
                        </li>
                        <li>
                            <a

                                onClick={handleShowCancelar}
                                className={state.idEmbarque === 0 ? classes.disabled : ""}
                            >
                                <i className="fa fa-times-circle" /> Cancelar
                            </a>
                        </li>
                        <li style={{ float: "right" }}>
                            <a
                                className={state.idEmbarque === 0 ? classes.disabled : ""}
                                style={{ textAlign: "right" }}
                                onClick={() => setRedirect(true)}
                            >
                                Generar Guía
                            </a>
                        </li>
                    </ul>

                    <div className="row tab-content">
                        <div id="Listado" className={props.location.idRecoleccion != undefined ? "tab-pane fade" : "tab-pane fade in active"}>

                            <div className="widget-wrap">
                                <div className="widget-content">
                                    <div className="row" style={{ paddingLeft: "8px" }}>
                                        <form className="j-forms">
                                            <div className="row" style={{ display: "flex" }}>
                                                <div
                                                    className="col-sm-6 col-md-3 "
                                                    style={{ paddingLeft: "0px" }}
                                                >
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

                                                <div
                                                    className="col-sm-6 col-md-3 "
                                                    style={{ paddingLeft: "0px" }}
                                                >
                                                    <div className="input">
                                                        <TextField
                                                            autoFocus
                                                            type="date"
                                                            margin="dense"
                                                            label="Fecha Final"
                                                            variant="outlined"
                                                            className="form-control"
                                                            InputLabelProps={{
                                                                shrink: true,
                                                            }}
                                                            value={state.fechaFinal}
                                                            onChange={handleFechaFinalFiltro}
                                                            id="fechaInicial"
                                                        />
                                                    </div>

                                                </div>

                                                <div
                                                    className="col-sm-6 col-md-3 "
                                                    style={{ paddingLeft: "0px" }}
                                                >
                                                    <label className="input select">
                                                        <FormControl fullWidth variant="outlined" margin="dense">
                                                            <InputLabel
                                                                id="idSucursalAgregarLabel">Sucursal</InputLabel>
                                                            <Select
                                                                labelId="idSucursalAgregarLabel"
                                                                className="form-control"
                                                                required
                                                                value={state.sucursalListado}
                                                                onChange={handleSucursalFiltro}
                                                                id="idSucursalAgregar"
                                                                label="Sucursal"
                                                                InputProps={{
                                                                    name: "Sucursal"
                                                                }}
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

                                                <div
                                                    className="col-sm-6 col-md-3 "
                                                    style={{ paddingLeft: "0px" }}
                                                >
                                                    <label className="input select">
                                                        <FormControl fullWidth variant="outlined" margin="dense">
                                                            <InputLabel id="idEstatusViajeLabel">Estatus</InputLabel>
                                                            <Select
                                                                labelId="idEstatusViajeLabel"
                                                                className="form-control"
                                                                required
                                                                value={state.estatusListado}
                                                                onChange={handleEstatusFiltro}
                                                                id="estatusListado"
                                                                label="Estatus"
                                                                InputProps={{
                                                                    id: "estatusListado"
                                                                }}
                                                            >
                                                                <option value="0">Todos</option>
                                                                {dataEstatusEmbarque.map((estatus) => (
                                                                    <option
                                                                        key={estatus.m_nIdEstatusEmbarque}
                                                                        value={estatus.m_nIdEstatusEmbarque}
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
                                    </div>
                                    <div
                                        className="row"
                                        style={{ height: state.height - 250, width: "100%" }}
                                    >
                                        {conDatos() ? (
                                            <DataGrid
                                                localeText={dataGridLocaleText}
                                                className={classes.root}
                                                rows={data}
                                                columns={columns}
                                                density="compact"
                                                pageSize={Math.floor((state.height - 310) / 30)}
                                                getRowId={(row) => row.m_nIdEmbarque}
                                                onRowSelected={(row) => {
                                                    setState({
                                                        ...state,
                                                        idEmbarque: row.data.m_nIdEmbarque,
                                                    });
                                                }}
                                            />
                                        ) : (
                                            <div>No se encontró ningún registro</div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div id="Agregar" className={props.location.idRecoleccion != undefined ? "tab-pane fade in active" : "tab-pane fade"}>

                            <form className="j-forms row" onSubmit={handleAceptar}>
                                <div className="form-content">
                                    <div
                                        className="wizard-breadcrumb number-style"
                                        style={{
                                            position: "sticky",
                                            top: "60px",
                                            padding: "5px",
                                            backgroundColor: "white",
                                            zIndex: 100,
                                            marginBottom: "10px",
                                        }}
                                    >
                                        <div className="row">
                                            <Stepper activeStep={stepActive - 1}>
                                                {
                                                    ["Información General", "Remitentes/Destinatario", "Paquetes y Sobres", "Información Adicional del Pago"].map((s, index) => (
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
                                                        <div className="col-sm-6 col-md-2-5 col-lg-2-5 unit">
                                                            <label className="input select">
                                                                <FormControl fullWidth variant="outlined"
                                                                    margin="dense">
                                                                    <InputLabel
                                                                        id="idSucursalAgregarLabel">Sucursal</InputLabel>
                                                                    <Select
                                                                        labelId="idSucursalAgregarLabel"
                                                                        className="form-control"
                                                                        required
                                                                        disabled
                                                                        value={state.idSucursalAgregar}
                                                                        onChange={handleSucursalFiltro}
                                                                        id="idSucursalAgregar"
                                                                        label="Sucursal"
                                                                        readOnly
                                                                        inputProps={{
                                                                            id: "idSucursalAgregar"
                                                                        }}
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

                                                        <div className="col-sm-6 col-md-2-5 col-lg-2-5 unit">
                                                            <div className="input">
                                                                <TextField variant="outlined" margin="dense"
                                                                    label="Folio Recolección"
                                                                    onChange={handleChange}
                                                                    className="form-control"
                                                                    type="text"
                                                                    value={state.folioRecoleccion}
                                                                    name="folioRecoleccion"
                                                                    readOnly
                                                                    disabled
                                                                />
                                                            </div>
                                                        </div>

                                                        <div className="col-sm-6 col-md-2-5 col-lg-2-5 unit">
                                                            <div className="input">
                                                                <TextField variant="outlined" margin="dense"
                                                                    label="Folio Embarque"
                                                                    onChange={handleChange}
                                                                    className="form-control"
                                                                    type="text"
                                                                    value={state.folioEmbarque}
                                                                    name="folioEmbarque"
                                                                    readOnly
                                                                    disabled
                                                                />
                                                            </div>
                                                        </div>

                                                        <div className="col-sm-6 col-md-2-5 col-lg-2-5 unit">
                                                            <div className="input">
                                                                <TextField variant="outlined" margin="dense"
                                                                    label="Folio Guía"
                                                                    onChange={handleChange}
                                                                    className="form-control"
                                                                    type="text"
                                                                    value={state.folioGuía}
                                                                    name="folioGuía"
                                                                    readOnly
                                                                    disabled
                                                                />
                                                            </div>
                                                        </div>

                                                        <div className="col-sm-6 col-md-2-5 col-lg-2-5 unit">
                                                            <div className="input">
                                                                <TextField variant="outlined" margin="dense"
                                                                    label="Folio Informe"
                                                                    onChange={handleChange}
                                                                    className="form-control"
                                                                    type="text"
                                                                    value={state.folioInforme}
                                                                    name="folioInforme"
                                                                    readOnly
                                                                    disabled
                                                                />
                                                            </div>
                                                        </div>

                                                        <div className="col-sm-6 col-md-2-5 col-lg-2-5 unit">
                                                            <div className="input">
                                                                <TextField variant="outlined" margin="dense"
                                                                    label="Fecha / Hora de Registro"
                                                                    onChange={handleChange}
                                                                    required
                                                                    value={state.fechaHoraRegistro}
                                                                    className="form-control"
                                                                    name="fechaHoraRegistro"
                                                                    type="datetime-local"
                                                                    InputLabelProps={{
                                                                        shrink: true,
                                                                    }}
                                                                    disabled={
                                                                        state.agregar === "Consultar" ||
                                                                        state.agregar === "Modificar"
                                                                    }
                                                                />
                                                            </div>
                                                        </div>

                                                        <div className="col-sm-6 col-md-2-5 col-lg-2-5 unit">

                                                            <label className="input select">
                                                                <FormControl fullWidth variant="outlined"
                                                                    margin="dense">
                                                                    <InputLabel id="idEstatusEmbarque">Estatus del
                                                                        Embarque</InputLabel>
                                                                    <Select
                                                                        labelId={"idEstatusEmbarque"}
                                                                        label={"Estatus del Embarque"}
                                                                        className="form-control"
                                                                        required
                                                                        onChange={handleChange}
                                                                        value={state.estatusEmbarque}
                                                                        disabled={state.agregar === "Consultar"}
                                                                        id="estatusEmbarque"
                                                                        inputProps={{
                                                                            name: "estatusEmbarque"
                                                                        }}
                                                                    >
                                                                        {dataEstatusEmbarque.map((estatus) => (
                                                                            <option
                                                                                key={estatus.m_nIdEstatusEmbarque}
                                                                                value={estatus.m_nIdEstatusEmbarque}
                                                                            >
                                                                                {estatus.m_sEstatus}
                                                                            </option>
                                                                        ))}
                                                                    </Select>
                                                                </FormControl>
                                                            </label>
                                                        </div>

                                                        <div className="col-sm-6 col-md-2-5 col-lg-2-5 unit">
                                                            <label className="input select">
                                                                <FormControl fullWidth variant="outlined"
                                                                    margin="dense">
                                                                    <InputLabel id="idMonedaLabel">Moneda</InputLabel>
                                                                    <Select
                                                                        labelId={"idMonedaLabel"}
                                                                        label={"Moneda"}
                                                                        className="form-control"
                                                                        required
                                                                        value={state.moneda}
                                                                        disabled={state.agregar === "Consultar"}
                                                                        onChange={handleChange}
                                                                        id="moneda"
                                                                        InputProps={{
                                                                            name: "moneda"
                                                                        }}
                                                                    >
                                                                        {dataTipoMoneda.map((moneda) => (
                                                                            <option
                                                                                key={moneda.m_nIdMoneda}
                                                                                value={moneda.m_nIdMoneda}
                                                                            >
                                                                                {moneda.m_sMoneda}
                                                                            </option>
                                                                        ))}
                                                                    </Select>
                                                                </FormControl>
                                                            </label>
                                                        </div>

                                                        <div className="col-sm-6 col-md-2-5 col-lg-2-5  unit">
                                                            <div className="input">
                                                                <FormControl fullWidth variant="outlined"
                                                                    margin="dense">
                                                                    <InputLabel id="tipoCambioLabel">Tipo de
                                                                        Cambio</InputLabel>
                                                                    <Select
                                                                        labelId="tipoCambioLabel"
                                                                        label="Tipo de Cambio"
                                                                        className="form-control"
                                                                        required
                                                                        value={state.tipoCambio}
                                                                        onChange={(event) => {
                                                                            event.preventDefault();
                                                                            setState({
                                                                                ...state,
                                                                                tipoCambio: event.target.value,
                                                                            });
                                                                        }}
                                                                        disabled={state.agregar === "Consultar"}
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
                                                            </div>
                                                        </div>

                                                        <div className="col-sm-6 col-md-2-5 col-lg-2-5 unit">
                                                            <label className="input select">
                                                                <FormControl fullWidth variant="outlined"
                                                                    margin="dense">
                                                                    <InputLabel id="idTipoCobroLabel">Tipo
                                                                        Cobro</InputLabel>
                                                                    <Select
                                                                        labelId={"idTipoCobroLabel"}
                                                                        label={"Tipo Cobro"}
                                                                        className="form-control"
                                                                        required
                                                                        value={state.tipoCobro}
                                                                        disabled={state.agregar === "Consultar"}
                                                                        onChange={(event) => {
                                                                            event.preventDefault();
                                                                            setState({
                                                                                ...state,
                                                                                tipoCobro: event.target.value,
                                                                            });
                                                                        }}
                                                                        id="tipoCobro"
                                                                        InputProps={{
                                                                            id: "tipoCobro",
                                                                            name: "tipoCobro"
                                                                        }}
                                                                    >
                                                                        {dataTipoCobro.map((tipoCobro) => (
                                                                            <option
                                                                                key={tipoCobro.m_nIdTipoCobro}
                                                                                value={tipoCobro.m_nIdTipoCobro}
                                                                            >
                                                                                {tipoCobro.m_sDescripcion}
                                                                            </option>
                                                                        ))}
                                                                    </Select>
                                                                </FormControl>
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
                                                                    <div className="col-sm-12 col-md-12  unit">
                                                                        <div className="input">
                                                                            <Autocomplete
                                                                                onChange={(event, newValue) => {
                                                                                    handleSelectRemitente(newValue);
                                                                                }}
                                                                                value={state.nombreRemitente}
                                                                                freeSolo

                                                                                id="nombreRemitente"
                                                                                disableClearable
                                                                                forcePopupIcon={false}
                                                                                disabled={state.agregar === "Consultar"}
                                                                                options={dataRemitenteDestinatario}
                                                                                getOptionLabel={(option) =>
                                                                                    option.m_sNombreFiscal
                                                                                }
                                                                                variant="outlined"
                                                                                style={{
                                                                                    transform: "translate(14px, 10px) scale(1) !important"
                                                                                }}
                                                                                renderInput={(params) => (
                                                                                    <div>
                                                                                        <TextField
                                                                                            required
                                                                                            label={"Nombre"}
                                                                                            {...params}
                                                                                            margin="dense"
                                                                                            variant="outlined"
                                                                                            InputProps={{
                                                                                                ...params.InputProps,
                                                                                                style: {
                                                                                                    height: "33px",
                                                                                                    fontSize: "14px",
                                                                                                },
                                                                                                type: "search",
                                                                                                disableUnderline: true,
                                                                                                endAdornment: (
                                                                                                    <InputAdornment
                                                                                                        position="end">
                                                                                                        <IconButton
                                                                                                            padding="0px"
                                                                                                            style={{
                                                                                                                paddingRight: "0px",
                                                                                                            }}
                                                                                                            disabled={
                                                                                                                state.agregar ===
                                                                                                                "Consultar"
                                                                                                            }
                                                                                                            onClick={() => {
                                                                                                                setState({
                                                                                                                    ...state,
                                                                                                                    identificadorModal:
                                                                                                                        "nombreRemitente",
                                                                                                                    tipoModal: 5,
                                                                                                                    openDialog: true,
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

                                                                    <div className="col-sm-12 col-md-12 unit">
                                                                        <div className="input">
                                                                            <TextField variant="outlined" margin="dense"
                                                                                label="RFC"
                                                                                onChange={handleChange}
                                                                                className="form-control"
                                                                                type="text"
                                                                                pattern="[A-Z&Ñ]{3,4}[0-9]{2}(0[1-9]|1[012])(0[1-9]|[12][0-9]|3[01])[A-Z0-9]{2}[0-9A]"
                                                                                title="Favor de introducir un RFC válido."
                                                                                required
                                                                                value={state.RFCRemitente}
                                                                                disabled={state.agregar === "Consultar"}
                                                                                name="RFCRemitente"
                                                                            />
                                                                        </div>
                                                                    </div>

                                                                    <div className="col-sm-12 col-md-12 unit">
                                                                        <div className="input">
                                                                            <TextField variant="outlined" margin="dense"
                                                                                label="Domicilio"
                                                                                onChange={handleChange}
                                                                                className="form-control"
                                                                                type="text"
                                                                                required
                                                                                value={state.domicilioRemitente}
                                                                                disabled={state.agregar === "Consultar"}
                                                                                name="domicilioRemitente"
                                                                            />
                                                                        </div>
                                                                    </div>

                                                                    <div className="col-sm-12 col-md-12 unit">
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
                                                                                value={state.codigoPostalRemitente}
                                                                                disableClearable
                                                                                disabled={state.agregar === "Consultar"}
                                                                                forcePopupIcon={false}
                                                                                options={dataCodigoPostal.filter(cp => cp.m_nIdCiudad == state.ciudadRemitente)}
                                                                                getOptionLabel={(option) =>
                                                                                    option.m_sCP
                                                                                }
                                                                                variant="outlined"
                                                                                style={{
                                                                                    transform: "translate(14px, 10px) scale(1) !important"
                                                                                }}
                                                                                renderInput={(params) => (
                                                                                    <div>
                                                                                        <TextField
                                                                                            required
                                                                                            margin="dense"
                                                                                            variant="outlined"
                                                                                            label={"Código Postal"}
                                                                                            {...params}
                                                                                            InputProps={{
                                                                                                ...params.InputProps,
                                                                                                style: {
                                                                                                    height: "33px",
                                                                                                    fontSize: "14px",
                                                                                                },
                                                                                                type: "search",
                                                                                                disableUnderline: true,
                                                                                                endAdornment: (
                                                                                                    <InputAdornment
                                                                                                        position="end">
                                                                                                        <IconButton
                                                                                                            padding="0px"
                                                                                                            style={{
                                                                                                                paddingRight: "0px",
                                                                                                            }}
                                                                                                            disabled={
                                                                                                                state.agregar ===
                                                                                                                "Consultar"
                                                                                                            }
                                                                                                            onClick={() => {
                                                                                                                setState({
                                                                                                                    ...state,
                                                                                                                    identificadorModal:
                                                                                                                        "codigoPostalRemitente",
                                                                                                                    tipoModal: 0,
                                                                                                                    openDialog: true,
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

                                                                    <div className="col-sm-12 col-md-12 col-lg-12 unit">
                                                                        <div className="input">
                                                                            <Autocomplete
                                                                                freeSolo
                                                                                onChange={handleSelectCiudadChange}
                                                                                value={state.ciudadRemitente}
                                                                                id="ciudadRemitente"
                                                                                disableClearable
                                                                                disabled={state.agregar === "Consultar"}
                                                                                forcePopupIcon={false}
                                                                                options={dataCiudad}
                                                                                getOptionLabel={(option) =>
                                                                                    option.m_sCiudad
                                                                                }
                                                                                variant="outlined"
                                                                                style={{
                                                                                    transform: "translate(14px, 10px) scale(1) !important"
                                                                                }}
                                                                                renderInput={(params) => (
                                                                                    <div>
                                                                                        <TextField
                                                                                            required
                                                                                            margin="dense"
                                                                                            variant="outlined"
                                                                                            label={"Ciudad"}
                                                                                            {...params}
                                                                                            InputProps={{
                                                                                                ...params.InputProps,
                                                                                                style: { height: 24 },
                                                                                                type: "search",
                                                                                                disabled:
                                                                                                    state.agregar === "Consultar",
                                                                                                endAdornment: (
                                                                                                    <InputAdornment
                                                                                                        position="end">
                                                                                                        <IconButton
                                                                                                            padding="0px"
                                                                                                            style={{
                                                                                                                paddingRight: "0px",
                                                                                                            }}
                                                                                                            disabled={
                                                                                                                state.agregar ===
                                                                                                                "Consultar"
                                                                                                            }
                                                                                                            onClick={() => {
                                                                                                                setState({
                                                                                                                    ...state,
                                                                                                                    identificadorModal:
                                                                                                                        "ciudadRemitente",
                                                                                                                    tipoModal: 1,
                                                                                                                    openDialog: true,
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
                                                                    { }
                                                                    <div className="col-sm-12 col-md-12 unit">
                                                                        <div className="input">
                                                                            <TextField variant="outlined" margin="dense"
                                                                                label="Correo Electrónico"
                                                                                onChange={handleChange}
                                                                                className="form-control"
                                                                                type="email"
                                                                                required
                                                                                value={state.correoRemitente}
                                                                                disabled={state.agregar === "Consultar"}
                                                                                name="correoRemitente"
                                                                            />
                                                                        </div>
                                                                    </div>
                                                                    { }
                                                                    <div className="col-sm-12 col-md-12 unit">
                                                                        <div className="input">
                                                                            <TextField variant="outlined" margin="dense"
                                                                                label="Teléfono"
                                                                                onChange={handleChange}
                                                                                className="form-control"
                                                                                type="tel"
                                                                                required
                                                                                value={state.telefonoRemitente}
                                                                                disabled={state.agregar === "Consultar"}
                                                                                name="telefonoRemitente"
                                                                            />
                                                                        </div>
                                                                    </div>

                                                                    <div className="col-sm-12 col-md-12 unit">
                                                                        <div className="input">
                                                                            <TextField variant="outlined" margin="dense"
                                                                                label="Contacto"
                                                                                onChange={handleChange}
                                                                                className="form-control"
                                                                                type="text"
                                                                                required
                                                                                value={state.contactoRemitente}
                                                                                disabled={state.agregar === "Consultar"}
                                                                                name="contactoRemitente"
                                                                            />
                                                                        </div>
                                                                    </div>

                                                                    <div className="col-sm-12 col-md-12 unit">
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
                                                                                id="ciudadOrigen"
                                                                                disableClearable
                                                                                disabled={state.agregar === "Consultar"}
                                                                                forcePopupIcon={false}
                                                                                options={dataCiudad}
                                                                                getOptionLabel={(option) =>
                                                                                    option.m_sCiudad
                                                                                }
                                                                                variant="outlined"
                                                                                style={{
                                                                                    transform: "translate(14px, 10px) scale(1) !important"
                                                                                }}
                                                                                renderInput={(params) => (
                                                                                    <div>
                                                                                        <TextField
                                                                                            required
                                                                                            margin="dense"
                                                                                            variant="outlined"
                                                                                            label={"Origen"}
                                                                                            {...params}
                                                                                            InputProps={{
                                                                                                ...params.InputProps,
                                                                                                style: {
                                                                                                    height: "33px",
                                                                                                    fontSize: "14px",
                                                                                                },
                                                                                                type: "search",
                                                                                                value: state.ciudadOrigen,
                                                                                                disableUnderline: true,
                                                                                                endAdornment: (
                                                                                                    <InputAdornment
                                                                                                        position="end">
                                                                                                        <IconButton
                                                                                                            padding="0px"
                                                                                                            style={{
                                                                                                                paddingRight: "0px",
                                                                                                            }}
                                                                                                            disabled={
                                                                                                                state.agregar ===
                                                                                                                "Consultar"
                                                                                                            }
                                                                                                            onClick={() => {
                                                                                                                setState({
                                                                                                                    ...state,
                                                                                                                    identificadorModal:
                                                                                                                        "ciudadOrigen",
                                                                                                                    tipoModal: 1,
                                                                                                                    openDialog: true,
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
                                                                        <label className="checkbox">
                                                                            Entrega en Sucursal
                                                                            <input
                                                                                onChange={handleEntregaEnSucursalCheckbox}
                                                                                className="form-control"
                                                                                type="checkbox"
                                                                                checked={state.entregaEnSucursal}
                                                                                style={{ height: "20px" }}
                                                                                disabled={state.agregar === "Consultar"}
                                                                                id="entregaEnSucursal"
                                                                            />
                                                                            <i />
                                                                        </label>
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
                                                                <div className="col-sm-12 col-md-12 unit">
                                                                    <div className="input">
                                                                        <Autocomplete
                                                                            onChange={(event, newValue) => {
                                                                                handleSelectDestinatario(newValue)
                                                                            }}
                                                                            value={state.nombreDestinatario}
                                                                            freeSolo

                                                                            id="nombreRemitente"
                                                                            disableClearable
                                                                            disabled={state.agregar === "Consultar"}
                                                                            forcePopupIcon={false}
                                                                            options={dataRemitenteDestinatario}
                                                                            getOptionLabel={(option) =>
                                                                                option.m_sNombreFiscal
                                                                            }
                                                                            variant="outlined"
                                                                            style={{
                                                                                transform: "translate(14px, 10px) scale(1) !important"
                                                                            }}
                                                                            renderInput={(params) => (
                                                                                <div>
                                                                                    <TextField
                                                                                        required
                                                                                        label={"Nombre"}
                                                                                        margin="dense"
                                                                                        variant="outlined"
                                                                                        {...params}
                                                                                        InputProps={{
                                                                                            ...params.InputProps,
                                                                                            style: {
                                                                                                height: "33px",
                                                                                                fontSize: "14px",
                                                                                            },
                                                                                            type: "search",
                                                                                            disableUnderline: true,
                                                                                            endAdornment: (
                                                                                                <InputAdornment
                                                                                                    position="end">
                                                                                                    <IconButton
                                                                                                        padding="0px"
                                                                                                        style={{
                                                                                                            paddingRight: "0px",
                                                                                                        }}
                                                                                                        disabled={
                                                                                                            state.agregar ===
                                                                                                            "Consultar"
                                                                                                        }
                                                                                                        /*onClick={() => {
                                                                                                            setState({
                                                                                                                ...state,
                                                                                                                identificadorModal:
                                                                                                                    "nombreDestinatario",
                                                                                                                tipoModal: 5,
                                                                                                                openDialog: true,
                                                                                                            });
                                                                                                            // open();
                                                                                                        }}*/
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
                                                                                                            /*onClick={() => {
                                                                                                                setState({
                                                                                                                    ...state,
                                                                                                                    identificadorModal:
                                                                                                                        "nombreDestinatario",
                                                                                                                    tipoModal: 5,
                                                                                                                    openDialog: true,
                                                                                                                });
                                                                                                            }}*/
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

                                                                <div className="col-sm-12 col-md-12 unit">
                                                                    <div className="input">
                                                                        <TextField variant="outlined" margin="dense"
                                                                            label="RFC"
                                                                            onChange={handleChange}
                                                                            className="form-control"
                                                                            type="text"
                                                                            pattern="[A-Z&Ñ]{3,4}[0-9]{2}(0[1-9]|1[012])(0[1-9]|[12][0-9]|3[01])[A-Z0-9]{2}[0-9A]"
                                                                            title="Favor de introducir un RFC válido."
                                                                            required
                                                                            value={state.RFCDestinatario}
                                                                            disabled={state.agregar === "Consultar"}
                                                                            name="RFCDestinatario"
                                                                        />
                                                                    </div>
                                                                </div>

                                                                <div className="col-sm-12 col-md-12 unit">
                                                                    <div className="input">
                                                                        <TextField variant="outlined" margin="dense"
                                                                            label="Domicilio"
                                                                            onChange={handleChange}
                                                                            className="form-control"
                                                                            type="text"
                                                                            required
                                                                            value={state.domicilioDestinatario}
                                                                            disabled={state.agregar === "Consultar"}
                                                                            name="domicilioDestinatario"
                                                                        />
                                                                    </div>
                                                                </div>

                                                                <div className="col-sm-12 col-md-12 unit">
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
                                                                            id="codigoPostalDestinatario"
                                                                            disableClearable
                                                                            disabled={state.agregar === "Consultar"}
                                                                            options={dataCodigoPostal.filter(cp => cp.m_nIdCiudad == state.ciudadDestinatario)}
                                                                            getOptionLabel={(option) => option.m_sCP}
                                                                            variant="outlined"
                                                                            style={{
                                                                                transform: "translate(14px, 10px) scale(1) !important"
                                                                            }}
                                                                            renderInput={(params) => (
                                                                                <div>
                                                                                    <TextField
                                                                                        required
                                                                                        margin="dense"
                                                                                        variant="outlined"
                                                                                        label={"Código Postal"}
                                                                                        {...params}
                                                                                        InputProps={{
                                                                                            ...params.InputProps,
                                                                                            style: {
                                                                                                height: "33px",
                                                                                                fontSize: "14px",
                                                                                            },
                                                                                            type: "search",
                                                                                            disableUnderline: true,
                                                                                            endAdornment: (
                                                                                                <InputAdornment
                                                                                                    position="end">
                                                                                                    {" "}
                                                                                                    <IconButton
                                                                                                        style={{
                                                                                                            paddingRight: "0px",
                                                                                                        }}
                                                                                                        disabled={
                                                                                                            state.agregar ===
                                                                                                            "Consultar"
                                                                                                        }
                                                                                                        onClick={() => {
                                                                                                            setState({
                                                                                                                ...state,
                                                                                                                identificadorModal:
                                                                                                                    "codigoPostalDestinatario",
                                                                                                                tipoModal: 0,
                                                                                                                openDialog: true,
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
                                                                            disabled={state.agregar === "Consultar"}
                                                                            id="ciudadDestinatario"
                                                                            disableClearable
                                                                            forcePopupIcon={false}
                                                                            options={dataCiudad}
                                                                            getOptionLabel={(option) =>
                                                                                option.m_sCiudad
                                                                            }
                                                                            variant="outlined"
                                                                            style={{
                                                                                transform: "translate(14px, 10px) scale(1) !important"
                                                                            }}
                                                                            renderInput={(params) => (
                                                                                <div>
                                                                                    <TextField
                                                                                        margin="dense"
                                                                                        variant="outlined"
                                                                                        label={"Ciudad"}
                                                                                        required
                                                                                        {...params}
                                                                                        InputProps={{
                                                                                            ...params.InputProps,
                                                                                            style: { height: 24 },
                                                                                            type: "search",
                                                                                            disabled:
                                                                                                state.agregar === "Consultar",
                                                                                            endAdornment: (
                                                                                                <InputAdornment
                                                                                                    position="end">
                                                                                                    <IconButton
                                                                                                        padding="0px"
                                                                                                        style={{
                                                                                                            paddingRight: "0px",
                                                                                                        }}
                                                                                                        disabled={
                                                                                                            state.agregar ===
                                                                                                            "Consultar"
                                                                                                        }
                                                                                                        onClick={() => {
                                                                                                            setState({
                                                                                                                ...state,
                                                                                                                identificadorModal:
                                                                                                                    "ciudadDestino",
                                                                                                                tipoModal: 1,
                                                                                                                openDialog: true,
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

                                                                <div className="col-sm-12 col-md-12 unit">
                                                                    <div className="input">
                                                                        <TextField variant="outlined" margin="dense"
                                                                            label="Correo Electrónico"
                                                                            onChange={handleChange}
                                                                            className="form-control"
                                                                            type="email"
                                                                            required
                                                                            value={state.correoDestinatario}
                                                                            disabled={state.agregar === "Consultar"}
                                                                            name="correoDestinatario"
                                                                        />
                                                                    </div>
                                                                </div>

                                                                <div className="col-sm-12 col-md-12 unit">
                                                                    <div className="input">
                                                                        <TextField variant="outlined" margin="dense"
                                                                            label="Teléfono"
                                                                            onChange={handleChange}
                                                                            className="form-control"
                                                                            type="text"
                                                                            required
                                                                            value={state.telefonoDestinatario}
                                                                            disabled={state.agregar === "Consultar"}
                                                                            name="telefonoDestinatario"
                                                                        />
                                                                    </div>
                                                                </div>

                                                                <div className="col-sm-12 col-md-12 unit">
                                                                    <div className="input">
                                                                        <TextField variant="outlined" margin="dense"
                                                                            label="Contacto"
                                                                            onChange={handleChange}
                                                                            className="form-control"
                                                                            type="text"
                                                                            required
                                                                            value={state.contactoDestinatario}
                                                                            disabled={state.agregar === "Consultar"}
                                                                            name="contactoDestinatario"
                                                                        />
                                                                    </div>
                                                                </div>

                                                                <div className="col-sm-12 col-md-12 unit">
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
                                                                            disabled={state.agregar === "Consultar"}
                                                                            id="ciudadDestino"
                                                                            disableClearable
                                                                            forcePopupIcon={false}
                                                                            options={dataCiudad}
                                                                            getOptionLabel={(option) =>
                                                                                option.m_sCiudad
                                                                            }
                                                                            variant="outlined"
                                                                            style={{
                                                                                transform: "translate(14px, 10px) scale(1) !important"
                                                                            }}
                                                                            renderInput={(params) => (
                                                                                <div>
                                                                                    <TextField
                                                                                        margin="dense"
                                                                                        variant="outlined"
                                                                                        label={"Destino"}
                                                                                        required
                                                                                        {...params}
                                                                                        InputProps={{
                                                                                            ...params.InputProps,
                                                                                            style: {
                                                                                                height: "33px",
                                                                                                fontSize: "14px",
                                                                                            },
                                                                                            type: "search",
                                                                                            value: state.ciudadDestino,
                                                                                            disableUnderline: true,
                                                                                            endAdornment: (
                                                                                                <InputAdornment
                                                                                                    position="end">
                                                                                                    <IconButton
                                                                                                        padding="0px"
                                                                                                        style={{
                                                                                                            paddingRight: "0px",
                                                                                                        }}
                                                                                                        disabled={
                                                                                                            state.agregar ===
                                                                                                            "Consultar"
                                                                                                        }
                                                                                                        onClick={() => {
                                                                                                            setState({
                                                                                                                ...state,
                                                                                                                identificadorModal:
                                                                                                                    "ciudadDestino",
                                                                                                                tipoModal: 1,
                                                                                                                openDialog: true,
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
                                                                    <label className="checkbox">
                                                                        Entrega en Diferente Domicilio
                                                                        <input
                                                                            onChange={handleEntregaCheckboxChange}
                                                                            className="form-control"
                                                                            type="checkbox"
                                                                            checked={state.diferenteEntrega}
                                                                            value={state.diferenteEntrega}
                                                                            style={{ height: "20px" }}
                                                                            disabled={state.agregar === "Consultar"}
                                                                            id="diferenteEntrega"
                                                                        />
                                                                        <i />
                                                                    </label>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                                {state.entregaEnSucursal ?

                                                    <div className="row">
                                                        <div className="col-sm-12 col-md-12 col-lg-12 unit">
                                                        <label className="input select">
                                                                <FormControl fullWidth variant="outlined"
                                                                    margin="dense">
                                                                    <InputLabel id="idSucursalEntrega">Sucursal de Entrega</InputLabel>
                                                                    <Select
                                                                        labelId={"idSucursalEntrega"}
                                                                        label="Sucursal de Entrega"
                                                                        className="form-control"
                                                                        required = {state.entregaEnSucursal}
                                                                        onChange={handleChangeSucursalEntrega}
                                                                        value={state.idSucursalEntrega}
                                                                        disabled={state.agregar === "Consultar"}
                                                                        id="idSucursalEntrega"
                                                                        inputProps={{
                                                                            name: "idSucursalEntrega"
                                                                        }}
                                                                    >
                                                                        {dataSucursal.map((sucursal) => (
                                                                            <option
                                                                                key={sucursal.m_nIdSucursal}
                                                                                value={sucursal.m_nIdSucursal}
                                                                                // value={sucursal}
                                                                            >
                                                                                {sucursal.m_sSucursal}
                                                                            </option>
                                                                        ))}
                                                                    </Select>
                                                                </FormControl>
                                                            </label>
                                                        </div>
                                                    </div>

                                                    :
                                                    <div />

                                                }

                                            </div>
                                        </div>

                                        <div className="widget-wrap col-md-5" id="paquetesSobres">
                                            <div className="row">
                                                <div className="col-md-6">
                                                    <form className="j-forms">
                                                        <div className="form-content">
                                                            <h2>Número de Paquetes</h2>

                                                            <a
                                                                className="btn"
                                                                style={{
                                                                    margin: "5px",
                                                                    backgroundColor: "#F9A03E",
                                                                    color: "white",
                                                                }}
                                                                onClick={() => removePaquete()}
                                                                disabled={state.agregar === "Consultar"}
                                                            >
                                                                <i className="zmdi zmdi-minus"></i>
                                                            </a>
                                                            <input
                                                                type="number"
                                                                value={state.countPaquetes}
                                                                style={{ width: "40px", textAlign: "center" }}
                                                            />
                                                            <a
                                                                className="btn"
                                                                style={{
                                                                    margin: "5px",
                                                                    backgroundColor: "#F9A03E",
                                                                    color: "white",
                                                                }}
                                                                onClick={() => addPaquete()}
                                                                disabled={state.agregar === "Consultar"}
                                                            >
                                                                <i className="zmdi zmdi-plus"></i>
                                                            </a>
                                                        </div>
                                                    </form>
                                                </div>
                                                <div className="col-md-6">
                                                    <h2>Número de Sobres</h2>
                                                    <a
                                                        className="btn"
                                                        style={{
                                                            margin: "10px",
                                                            backgroundColor: "#F9A03E",
                                                            color: "white",
                                                        }}
                                                        onClick={() => removeSobre()}
                                                        disabled={state.agregar === "Consultar"}
                                                    >
                                                        <i className="zmdi zmdi-minus"></i>
                                                    </a>
                                                    <input
                                                        type="number"
                                                        value={state.countSobres}
                                                        style={{ width: "40px", textAlign: "center" }}
                                                    />

                                                    <a
                                                        className="btn"
                                                        style={{
                                                            margin: "10px",
                                                            backgroundColor: "#F9A03E",
                                                            color: "white",
                                                        }}
                                                        onClick={() => addSobre()}
                                                        disabled={state.agregar === "Consultar"}
                                                    >
                                                        <i className="zmdi zmdi-plus"></i>
                                                    </a>
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
                                                                    ></Carousel>

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
                                    <div className="row">

                                        {state.diferenteEntrega ? (
                                            <div className="widget-wrap" id="detallesRecoleccion">
                                                <div className="widget-header">
                                                    <h2>Detalles de la Entrega</h2>
                                                </div>
                                                <div className="widget-container">
                                                    <div className="widget-content">
                                                        <div className="row">
                                                            <div className="col-md-12">
                                                                <div className="col-sm-6 col-md-4  unit">
                                                                    <div className="input">
                                                                        <Autocomplete
                                                                            freeSolo
                                                                            onChange={(event, newValue) =>
                                                                                setState({
                                                                                    ...state,
                                                                                    ciudadEntrega: newValue,
                                                                                    codigoPostalEntrega: null
                                                                                })
                                                                            }
                                                                            value={state.ciudadEntrega}
                                                                            disabled={
                                                                                state.agregar === "Consultar"
                                                                            }
                                                                            id="ciudadEntrega"
                                                                            disableClearable
                                                                            forcePopupIcon={false}
                                                                            options={dataCiudad}
                                                                            getOptionLabel={(option) =>
                                                                                option.m_sCiudad
                                                                            }
                                                                            variant="outlined"
                                                                            style={{
                                                                                transform: "translate(14px, 10px) scale(1) !important"
                                                                            }}
                                                                            renderInput={(params) => (
                                                                                <div>
                                                                                    <TextField
                                                                                        required
                                                                                        label={"Ciudad"}
                                                                                        margin="dense"
                                                                                        variant="outlined"
                                                                                        {...params}
                                                                                        InputProps={{
                                                                                            ...params.InputProps,
                                                                                            style: { height: 24 },
                                                                                            type: "search",
                                                                                            disabled:
                                                                                                state.agregar ===
                                                                                                "Consultar",
                                                                                            endAdornment: (
                                                                                                <InputAdornment
                                                                                                    position="end">
                                                                                                    <IconButton
                                                                                                        padding="0px"
                                                                                                        style={{
                                                                                                            paddingRight: "0px",
                                                                                                        }}
                                                                                                        disabled={
                                                                                                            state.agregar ===
                                                                                                            "Consultar"
                                                                                                        }
                                                                                                        onClick={() => {
                                                                                                            setState({
                                                                                                                ...state,
                                                                                                                identificadorModal:
                                                                                                                    "ciudadEntrega",
                                                                                                                tipoModal: 1,
                                                                                                                openDialog: true,
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


                                                                <div className="col-sm-4 col-md-4 unit">
                                                                    <div className="input">
                                                                        <Autocomplete
                                                                            freeSolo
                                                                            onSelect={handleSelectCodigoPostal()}
                                                                            onChange={(event, newValue) =>
                                                                                setState({
                                                                                    ...state,
                                                                                    codigoPostalEntrega: newValue,
                                                                                })
                                                                            }
                                                                            value={state.codigoPostalEntrega}
                                                                            disabled={
                                                                                state.agregar === "Consultar"
                                                                            }
                                                                            id="codigoPostalEntrega"
                                                                            disableClearable
                                                                            forcePopupIcon={false}
                                                                            options={dataCodigoPostal.filter(cp => cp.m_nIdCiudad == state.ciudadEntrega)}
                                                                            getOptionLabel={(option) =>
                                                                                option.m_sCP
                                                                            }
                                                                            variant="outlined"
                                                                            style={{
                                                                                transform: "translate(14px, 10px) scale(1) !important"
                                                                            }}
                                                                            renderInput={(params) => (
                                                                                <div>
                                                                                    <TextField
                                                                                        required
                                                                                        label={"Código Postal"}
                                                                                        margin="dense"
                                                                                        variant="outlined"
                                                                                        {...params}
                                                                                        InputProps={{
                                                                                            ...params.InputProps,
                                                                                            style: {
                                                                                                height: "24px",
                                                                                                fontSize: "14px",
                                                                                            },
                                                                                            type: "search",
                                                                                            disableUnderline: true,
                                                                                            endAdornment: (
                                                                                                <InputAdornment
                                                                                                    position="end">
                                                                                                    {" "}
                                                                                                    <IconButton
                                                                                                        style={{
                                                                                                            paddingRight: "0px",
                                                                                                        }}
                                                                                                        disabled={
                                                                                                            state.agregar ===
                                                                                                            "Consultar"
                                                                                                        }
                                                                                                        onClick={() => {
                                                                                                            setState({
                                                                                                                ...state,
                                                                                                                identificadorModal:
                                                                                                                    "codigoPostalEntrega",
                                                                                                                tipoModal: 0,
                                                                                                                openDialog: true,
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

                                                                <div className="col-sm-6 col-md-4 unit">
                                                                    <div className="input">
                                                                        <TextField variant="outlined" margin="dense"
                                                                            label="Zona"
                                                                            onChange={handleChange}
                                                                            className="form-control"
                                                                            type="text"
                                                                            required
                                                                            value={state.zonaEntrega}
                                                                            disabled={
                                                                                state.agregar == "Consultar"
                                                                            }
                                                                            name="zonaEntrega"
                                                                        />
                                                                    </div>
                                                                </div>

                                                                <div className="col-sm-4 col-md-4 unit">
                                                                    <div className="input">
                                                                        <TextField variant="outlined" margin="dense"
                                                                            label="Domicilio"
                                                                            onChange={handleChange}
                                                                            className="form-control"
                                                                            type="text"
                                                                            required
                                                                            value={state.domicilioEntrega}
                                                                            disabled={
                                                                                state.agregar === "Consultar"
                                                                            }
                                                                            name="domicilioEntrega"
                                                                        />
                                                                    </div>
                                                                </div>

                                                                <div className="col-sm-4 col-md-4  unit">
                                                                    <div className="input">
                                                                        <TextField variant="outlined" margin="dense"
                                                                            label="Entrega En"
                                                                            onChange={handleChange}
                                                                            className="form-control"
                                                                            type="text"
                                                                            required
                                                                            value={state.entregaEn}
                                                                            disabled={
                                                                                state.agregar === "Consultar"
                                                                            }
                                                                            name="entregaEn"
                                                                        />
                                                                    </div>
                                                                </div>

                                                                <div className="col-sm-4 col-md-4 unit">
                                                                    <div className="input">
                                                                        <TextField variant="outlined" margin="dense"
                                                                            label="Datos Adicionales para la Entrega"
                                                                            onChange={handleChange}
                                                                            className="form-control"
                                                                            type="text"
                                                                            required
                                                                            value={state.datosAdicionalesEntrega}
                                                                            disabled={
                                                                                state.agregar === "Consultar"
                                                                            }
                                                                            name="datosAdicionalesEntrega"
                                                                        />
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        ) : (
                                            <div />
                                        )}
                                    </div>
                                </div>
                                <div className="form-footer ol-md-12">
                                    <button
                                        type="button"
                                        onClick={(event) => { event.stopPropagation(); setState({ ...state, agregar: "Agregar" }); $('.nav-tabs li ').removeClass('active'); $('.nav-tabs li').eq(0).addClass('active'); $('.tab-content div ').removeClass('in show'); $('#Listado').addClass('in show'); }}
                                        className="btn btn-secondary secondary-btn"
                                    >
                                        Cancelar
                                    </button>
                                    <button
                                        type="submit"
                                        className="btn btn-primary primary-btn"
                                        disabled={state.agregar === "Consultar"}
                                    >
                                        Aceptar
                                    </button>
                                </div>
                            </form>
                        </div>

                        <div id="Cancelar" className="tab-pane fade">
                            <div className="widget-wrap">
                                <div className="widget-container">
                                    <div className="widget-content">
                                        <div className="row">
                                            <form className="j-forms" onSubmit={handleShowCancelarConfirmacion}>
                                                <div className="form-content">
                                                    <div className="col-sm-6 col-md-2-5 col-lg-2-5 unit">
                                                        <div className="input">
                                                            <TextField variant="outlined" margin="dense"
                                                                label="Folio Embarque"
                                                                onChange={handleChange}
                                                                className="form-control"
                                                                type="text"
                                                                value={state.folioEmbarque}
                                                                name="folioEmbarque"
                                                                readOnly
                                                            />
                                                        </div>
                                                    </div>

                                                    <div className="col-sm-6 col-md-2-5 col-lg-2-5 unit">
                                                        <div className="input">
                                                            <TextField variant="outlined" margin="dense"
                                                                label="Sucursal"
                                                                onChange={handleChange}
                                                                className="form-control"
                                                                type="text"
                                                                value={state.sucursalCancelacion}
                                                                name="sucursalCancelacion"
                                                                readOnly disabled
                                                            />
                                                        </div>
                                                    </div>

                                                    <div className="col-sm-6 col-md-2-5 col-lg-2-5 unit">
                                                        <div className="input">
                                                            <TextField variant="outlined" margin="dense" label="Fecha"
                                                                onChange={handleChange}
                                                                className="form-control"
                                                                type="text"
                                                                value={state.fechaCancelacion}
                                                                name="fechaCancelacion"
                                                                readOnly
                                                                disabled
                                                            />
                                                        </div>
                                                    </div>

                                                    <div className="col-sm-6 col-md-2-5 col-lg-2-5 unit">
                                                        <div className="input">
                                                            <TextField variant="outlined" margin="dense" label="Usuario"
                                                                onChange={handleChange}
                                                                className="form-control"
                                                                type="text"
                                                                value={state.usuario}
                                                                name="usuario"
                                                                readOnly
                                                                disabled
                                                            />
                                                        </div>
                                                    </div>

                                                    <div className="col-sm-6 col-md-2-5 col-lg-2-5 unit">
                                                        <div className="input">
                                                            <TextField variant="outlined" margin="dense" label="Estatus"
                                                                onChange={handleChange}
                                                                className="form-control"
                                                                type="text"
                                                                value={state.estatusEmbarque}
                                                                name="estatusEmbarque"
                                                                readOnly
                                                                disabled
                                                            />
                                                        </div>
                                                    </div>

                                                    <div className="col-sm-12 col-md-12 col-lg-12 unit">
                                                        <div className="input">
                                                            <TextField variant="outlined" margin="dense" label="Motivo"
                                                                onChange={handleChange}
                                                                className="form-control"
                                                                type="text"
                                                                value={state.motivoCancelacion}
                                                                name="motivoCancelacion"
                                                            />
                                                        </div>
                                                    </div>

                                                    <div className="form-footer col-md-12">
                                                        <button
                                                            type="button"
                                                            onClick={(event) => { event.stopPropagation(); setState({ ...state, agregar: "Agregar" }); $('.nav-tabs li ').removeClass('active'); $('.nav-tabs li').eq(0).addClass('active'); $('.tab-content div ').removeClass('in show'); $('#Listado').addClass('in show'); }}
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

export default Embarque;
