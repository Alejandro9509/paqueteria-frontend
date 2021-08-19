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
import { GridOverlay, DataGrid } from '@material-ui/data-grid';
import InputAdornment from "@material-ui/core/InputAdornment";
import LinearProgress from '@material-ui/core/LinearProgress';
import SvgIcon from "@material-ui/core/SvgIcon";
import { ReactComponent as Activo } from "../iconos/Menu/palomita.svg";
import { ReactComponent as NoActivo } from "../iconos/Menu/cruz.svg";
import {
    useTable,
    useFilters,
    useAsyncDebounce,
    useSortBy,
} from "react-table";
import $ from "jquery";
import { remove_array_element } from "../Util/Util";
import { useHistory, Redirect } from 'react-router-dom';
import { confirmAlert } from 'react-confirm-alert'; // Import
import 'react-confirm-alert/src/react-confirm-alert.css'; // Import css

import Noty from 'noty';
import {
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    FormControl,
    FormControlLabel,
    InputLabel,
    Select,
    Step,
    StepLabel,
    Stepper,
    Tooltip
} from "@material-ui/core";
import { dataGridLocaleText } from "../Constants";
import { obtenerCiudades } from "../Util/Contexts/CiudadesContext";
import {
    obtenerCodigoPostal,
    obtenerCodigoPostalCiudad, obtenerCodigoPostalEstado,
    obtenerCodigoPostalId, obtenerCodigosPostalesPorCiudad
} from "../Util/Contexts/CodigoPostalContext";
import { obtenerRemitentesDestinatarios } from "../Util/Contexts/RemitenteDestinatarioContext";
import { obtenerEmbalajes } from "../Util/Contexts/EmbalajesContext";
import { obtenerEstatusRecoleccion } from "../Util/Contexts/EstatusContext";
import { obtenerMonedas } from "../Util/Contexts/MonedaContext";
import { obtenerOperadores } from "../Util/Contexts/OperadoresContext";
import { agregarRecoleccion, modificarRecoleccion, obtenerRecoleccionCancelada, cancelarRecoleccion, eliminarRecoleccion, obtenerRecoleccionId, obtenerRecoleccionFiltro, obtenerRecoleccion } from "../Util/Contexts/RecoleccionContext";
import {obtenerTipoUnidades, obtenerTipoUnidadesId} from "../Util/Contexts/TipoUnidadContext";
import {obtenerUnidades, obtenerUnidadesId, obtenerUnidadesTipo} from "../Util/Contexts/UnidadesContext";
import { validarPermisos } from "../Util/Contexts/UsuarioContext";
import { obtenerTipoCambio } from "../Util/Contexts/TipoCambioContext";
import { obtenerSucursales } from "../Util/Contexts/SucursalContext";
import { obtenerTipoCobro } from "../Util/Contexts/TipoCobroContext";
import { obtenerFormatosImpresion, imprimirFormatosId } from "../Util/Contexts/FormatosImpresionContext";

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
        height: "230px !important",
    },
    sobreCarrusel: {
        height: "70px !important",
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
    const [dataFormatos, setFormatosImpresion] = React.useState([]);
    const [dataTipoMoneda, setDataTipoMoneda] = React.useState([]);
    const [dataTipoCambio, setDataTipoCambio] = React.useState([]);
    const [dataTipoCobro, setDataTipoCobro] = React.useState([]);
    const [dataCiudad, setDataCiudad] = React.useState([]);
    const [dataZona, setDataZona] = React.useState([]);
    const [dataFolioRecoleccion, SetDataFolioRecoleccion] = React.useState([]);

    const [dataCodigoPostal, setDataCodigoPostal] = React.useState([]);
    const [dataCodigosPostalesRemitente, setDataCodigosPostalesRemitente] = React.useState([]);
    const [dataCodigosPostalesDestinatario, setDataCodigosPostalesDestinatario] = React.useState([]);
    const [dataCodigosPostalesRecoleccion, setDataCodigosPostalesRecoleccion] = React.useState([]);
    const [dataCodigosPostalesEntrega, setDataCodigosPostalesEntrega] = React.useState([]);

    const [dataRemitenteDestinatario, setDataRemitenteDestinatario] = React.useState([]);
    const [dataEmbalaje, setDataEmbalaje] = React.useState([]);
    const [dataOperador, setDataOperador] = React.useState([]);
    const [dataTipoUnidad, setDataTipoUnidad] = React.useState([]);
    const [dataUnidad, setDataUnidad] = React.useState([]);
    const [state, setState] = React.useState({
        // ===VARIABLES DE LISTADO===
        idRecoleccion: 0,
        fechaInicial: '',
        fechaFinal: '',
        sucursalListado: 0,
        estatusListado: 0,

        // ===VARIABLES DE CANCELAR===
        // folioRecoleccion: '', Se usa en agregar tambien
        // folioRecoleccion:'', se usa en agregar tambien
        sucursalCancelacion: '',
        mostrarFechaCancelacion: '',
        usuario: localStorage.getItem("Usuario"),
        // estatusRecoleccion: '', Se usa en agregar tambien
        motivoCancelacion: '',

        // ==VARIABLES DE LLEGADA/SALIDA===
        // sucursalCancelacion: '', Se usa en cancelar tambien
        // folioRecoleccion: '', Se usa en agregar tambien
        fechaHoraCreacion: '',
        // fechaRecoleccion: '', se usa en agregar tambien
        // zonaRecoleccion: '', se usa en agregar tambien
        // recogerEn: '', se usa en agregar tambien
        // operador: '', se usa en agregar tambien
        // motivoCancelacion: '', se usa en cancelar tambien
        // unidad: se usa en agregar tambien

        // ===VARIABLES DE AGREGAR===
        idSucursalAgregar: localStorage.getItem("Sucursal"),
        folioRecoleccion: '',
        folioEmbarque: '',
        folioGuia: '',
        folioInforme: '',
        fechaHoraRegistro: '',
        estatusRecoleccion: '',
        moneda: '',
        tipoCambio: '',
        tipoCobro: '',

    //Remitente
        nombreRemitente: '',
        RFCRemitente: '',
        domicilioRemitente: '',
        ciudadRemitente: '',
        codigoPostalRemitente: '',
        correoRemitente: '',
        telefonoRemitente: '',
        contactoRemitente: '',
        origenRemitente: '',
        zonaRemitente: {},

    //Destinatario
        nombreDestinatario: '',
        RFCDestinatario: '',
        domicilioDestinatario: '',
        ciudadDestinatario: '',
        codigoPostalDestinatario: '',
        correoDestinatario: '',
        telefonoDestinatario: '',
        contactoDestinatario: '',
        destinoDestinatario: '',
        zonaDestinatario: {},

    //Paquetes/Sobres
        countPaquetes: 1,
        countSobres: 1,
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
                m_sDescripcion: "",
                m_nCantidad: "",
                m_sObservaciones: "",
                //checar cual de las dos es la que se usa
                m_cyValorDeclarado: "",
                m_cValorDeclarado: "",
                m_nTipo: 2,
            },
        ],
        sobres: [
            {
                m_sDescripcion: "",
                m_nTipo: 2,
            },
        ],

    //Entrega
        diferenteEntrega: false,
        ciudadEntrega: '',
        codigoPostalEntrega: '',
        zonaEntrega: '',
        domicilioEntrega: '',
        entregaEn: '',
        datosAdicionalesEntrega: '',

    //Recoleccion
        diferenteRecoleccion: false,
        fechaRecoleccion: '',
        ciudadRecoleccion: '',
        codigoPostalRecoleccion: '',
        zonaRecoleccion: '',
        domicilioRecoleccion: '',
        recogerEn: '',
        datosAdicionalesRecoleccion: '',

    //Operador
        operador: '',
        tipoUnidad: '',
        unidad: '',
        fechaHoraSalida: '',
        fechaHoraLlegada: '',

        //VARIABLES DE USO GENERAL
        identificadorModal: "",
        tipoModal: 0,
        DerechoBorrar: 133,
        agregar: "Agregar",
        CreadoPor: parseInt(localStorage.getItem("UsuarioId")),
        ModificadoPor: parseInt(localStorage.getItem("UsuarioId")),
        fechaCancelacion: "",
        uploadedFileContent: "<div>Hello</div>",
        height: window.innerHeight,

        // nombreRemitente: "",
        // nombreDestinatario: "",
        // idRecoleccion: 0,
        // fechaInicial: "0",
        // sucursalListado: 0,
        // estatusListado: 0,
        // folioRecoleccion: "",
        // folioEmbarque: "",
        // folioGuia: "",
        // folioInforme: "",
        // fechaHoraCreacion: "",
        // fechaHoraRegistro: "",
        // estatusRecoleccion: "",
        // moneda: "",
        // tipoCambio: "",
        // tipoCobro: "",
        // countSobres: 1,
        // countPaquetes: 1,
        // RFCRemitente: "",
        // domicilioRemitente: "",
        // codigoPostalRemitente: "",
        // ciudadRemitente: "",
        // correoRemitente: "",
        // telefonoRemitente: "",
        // contactoRemitente: "",
        // origenRemitente: "",
        // RFCDestinatario: "",
        // domicilioDestinatario: "",
        // codigoPostalDestinatario: "",
        // ciudadDestinatario: "",
        // correoDestinatario: "",
        // telefonoDestinatario: "",
        // contactoDestinatario: "",
        // destinoDestinatario: "",
        // fechaRecoleccion: "",
        // codigoPostalRecoleccion: "",
        // ciudadRecoleccion: "",
        // zonaRecoleccion: "",
        // domicilioRecoleccion: "",
        // recogerEn: "",
        // datosAdicionalesRecoleccion: "",
        // codigoPostalEntrega: "",
        // ciudadEntrega: "",
        // zonaEntrega: "",
        // domicilioEntrega: "",
        // entregaEn: "",
        // datosAdicionalesEntrega: "",
        // diferenteRecoleccion: false,
        // diferenteEntrega: false,
        // operador: 0,
        // tipoUnidad: "",
        // unidad: 0,

        // mismoPaquete: false,
        // mismoSobre: false,
        // fechaHoraSalida: "",
        // fechaHoraLlegada: "",

        //Cancelacion
        // sucursalCancelacion: "",
        // motivoCancelacion: "",

    });
    const [fileUploaded, setFileUploaded] = React.useState([]);
    const [selectedFile, setSelectedFile] = useState();
    const [isFilePicked, setIsFilePicked] = useState(false);
    const [stepActive, setStepActive] = React.useState(1);
    const [Modal, open, close, isOpen] = useModal("root", {
        preventScroll: true,
    });

    const history = useHistory()

    function CustomLoadingOverlay() {
        return (
            <GridOverlay>
                <div style={{ position: 'absolute', top: 0, width: '100%' }}>
                    <LinearProgress />
                </div>
            </GridOverlay>
        );
    }

    //Se ejecuta cada que el check de mismo paquete se clickea
    useEffect(value => {
        if (state.mismoPaquete) {
            var array = state.paquetes
            for (var i in array) {
                array[i] = state.paquetes[0];
            }
            setState({ ...state, paquetes: array })
        }
    }, [state.mismoPaquete])

    //Se ejecuta cada que el check de mismo sobre se clickea
    useEffect(value => {
        if (state.mismoSobre) {
            var array = state.sobres
            for (var i in array) {
                array[i] = state.sobres[0];
            }
            setState({ ...state, sobres: array })
        }
    }, [state.mismoSobre])

    //Se ejecuta cada que el tipo de moneda cambia (para qué?)
   /* useEffect(value => {
        // console.log(dataTipoMoneda)
    }, [state.moneda])*/

    //Se iba a usar para obtener los cps que correspondieran a la ciudad que se puso para el remitente
    useEffect( value => {
        if (state.ciudadRemitente != ""){
            obtenerCodigosPostalesPorCiudad(state.ciudadRemitente).then((respuesta) => {
                if (respuesta.data.length > 0){
                    setDataCodigosPostalesRemitente(respuesta.data);
                }
            });
        }
    }, [state.ciudadRemitente])

    //Se iba a usar para obtener los cps que correspondieran a la ciudad que se puso para el destinatario
    useEffect( value => {
        if (state.ciudadDestinatario != ""){
            obtenerCodigosPostalesPorCiudad(state.ciudadDestinatario).then((respuesta) => {
                if (respuesta.data.length > 0){
                    setDataCodigosPostalesDestinatario(respuesta.data);
                }
            });
        }
    }, [state.ciudadDestinatario])

    //Se iba a usar para obtener los cps que correspondieran a la ciudad que se puso para recoleccion
    useEffect( value => {
        if (state.ciudadRecoleccion != ""){
            obtenerCodigosPostalesPorCiudad(state.ciudadRecoleccion).then((respuesta) => {
                if (respuesta.data.length > 0){
                    setDataCodigosPostalesRecoleccion(respuesta.data);
                }
            });
        }
    }, [state.ciudadRecoleccion])

    //Se iba a usar para obtener los cps que correspondieran a la ciudad que se puso para entrega
    useEffect( value => {
        if (state.ciudadEntrega != ""){
            obtenerCodigosPostalesPorCiudad(state.ciudadEntrega).then((respuesta) => {
                if (respuesta.data.length > 0){
                    setDataCodigosPostalesEntrega(respuesta.data);
                }
            });
        }
    }, [state.ciudadEntrega])

    useEffect( value => {
        if (state.tipoUnidad != 0 && state.tipoUnidad != ''){
            // console.log('tipo Unidad select: ', state.tipoUnidad)
            getAllUnidades(state.tipoUnidad.m_nIdTipoUnidad);
        }
    }, [state.tipoUnidad])

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
        // getAllCodigosPostales();
        //getAllCodigosPostalesRem(state.ciudadRemitente);
        //getAllCodigosPostalesDes(state.ciudadDestinatario);

        getAllOperadores();
        getAllTipoUnidad();
        getAllRemitentesDestinatarios();
        getAllEmbalajes();
        getAllZonas();
        getTipoCambio()
        getFormatosImpresion()
        getUltimoFolioRecoleccion();
    }, []);
    //setea todos los datos del remitente seleccionado
    function handleSelectRemitente(newValue) {
        obtenerCodigoPostalId(newValue.m_nIdCP).then(respuesta => {
            setState(state => {
                return {
                ...state,
                    nombreRemitente: newValue,
                    RFCRemitente: newValue.m_sRFC,
                    domicilioRemitente: newValue.m_sDomicilio,

                    codigoPostalRemitente: respuesta.data,

                    ciudadRemitente: respuesta.data.m_nIdCiudad,

                    correoRemitente: newValue.m_sCorreoElectronico,
                    telefonoRemitente: newValue.m_sTelefono,
                    contactoRemitente: newValue.m_sContacto,
                }
            })
        })

        console.log('Remitente')
        console.log(newValue)
    }
    //setea todos los datos del destinatario seleccionado
    function handleSelectDestinatario(newValue) {
        obtenerCodigoPostalId(newValue.m_nIdCP).then(respuesta => {
            setState(state => {
                return {
                ...state,
                    nombreDestinatario: newValue,
                    RFCDestinatario: newValue.m_sRFC,
                    domicilioDestinatario: newValue.m_sDomicilio,

                    codigoPostalDestinatario: respuesta.data,

                    ciudadDestinatario: respuesta.data.m_nIdCiudad,

                    correoDestinatario: newValue.m_sCorreoElectronico,
                    telefonoDestinatario: newValue.m_sTelefono,
                    contactoDestinatario: newValue.m_sContacto,
                }
            })
        })
    }

    const handleAceptar = (e) => {
        e.preventDefault();

        let params = {
            //Informacion general
            m_nIdRecoleccion: state.idRecoleccion,
            m_nIdSucursal: state.idSucursalAgregar,
            m_nIdEstatusRecoleccion: state.estatusRecoleccion,
            m_nIdEmbarque: state.folioEmbarque,
            m_nIdGuia: state.folioGuia,
            m_nIdInforme: state.folioInforme,
            m_dFecha: state.fechaHoraCreacion.split("T")[0],
            m_tHora: state.fechaHoraCreacion.split("T")[1],
            m_dFechaRegistro: state.fechaHoraRegistro.split("T")[0],
            m_tHoraRegistro: state.fechaHoraRegistro.split("T")[1],
            m_nMoneda: state.moneda,
            m_rTipoCambio: state.tipoCambio,
            m_nIdTipoDeCobro: state.tipoCobro,

            //Remitente
            m_sNombreRemitente: state.nombreRemitente.m_sNombre,
            m_sRFCRemitente: state.RFCRemitente,
            m_sDomicilioRemitente: state.domicilioRemitente,
            m_sIdCodigoPostalRemitente: state.codigoPostalRemitente.m_nIdCP,
            m_nIdCiudadRemitente: state.ciudadRemitente,
            m_sCorreoRemitente: state.correoRemitente,
            m_sTelefonoRemitente: state.telefonoRemitente,
            m_sContactoRemitente: state.contactoRemitente,
            m_nIdCiudadOrigen: state.origenRemitente.m_nIdCiudad,
            m_nIdZonaRemitente: state.zonaRemitente.m_nIdZona,

            //Destinatario
            m_sNombreDestinatario: state.nombreDestinatario.m_sNombre,
            m_sRFCDestinatario: state.RFCDestinatario,
            m_sDomicilioDestinatario: state.domicilioDestinatario,
            m_sIdCodigoPostalDestinatario: state.codigoPostalDestinatario.m_nIdCP,
            m_nIdCiudadDestinatario: state.ciudadDestinatario,
            m_sCorreoDestinatario: state.correoDestinatario,
            m_sTelefonoDestinatario: state.telefonoDestinatario,
            m_sContactoDestinatario: state.contactoDestinatario,
            m_nIdCiudadDestino: state.destinoDestinatario.m_nIdCiudad,
            m_nIdZonaDestinatario: state.zonaDestinatario.m_nIdZona,

            //Recoleccion
            m_dFechaDetalleRecoleccion: '',
            m_tHoraDetalleRecoleccion: '',
            m_nIdCPDetalleRecoleccion: state.codigoPostalRemitente.m_nIdCP,
            m_nIdCiudadDetalleRecoleccion: '',
            m_nIdZonaDetalleRecoleccion: '',
            m_sDomicilioDetalleRecoleccion: '',
            m_sRecogerEnDetalleRecoleccion: '',
            m_sDatosAdicionalesDetalleRecoleccion: '',
            m_bRecoleccionDiferenteDomicilio: false,

            //Entrega
            m_nIdCPDetalleEntrega: state.codigoPostalDestinatario.m_nIdCP,
            m_nIdCiudadDetalleEntrega: '',
            m_nIdZonaDetalleEntrega: '',
            m_sDomicilioDetalleEntrega: '',
            m_sEntregarEnDetalleEntrega: '',
            m_sDatosAdicionalesDetalleEntrega: '',
            m_bEntregaDiferenteDomicilio: false,

            //Detalles de la operación
            m_dFechaSalida: state.fechaHoraSalida.split("T")[0],
            m_dFechaLlegada: state.fechaHoraLlegada.split("T")[0],
            m_tHoraSalida: state.fechaHoraSalida.split("T")[1],
            m_tHoraLlegada: state.fechaHoraLlegada.split("T")[1],
            m_parrPaquetes: state.paquetes,
            m_nNoPaquetes: state.paquetes.length,
            m_parrSobres: state.sobres,
            m_nNoSobres: state.sobres.length,
            m_nIdOperador: state.operador.m_nIdOperador,
            m_nIdUnidad: state.unidad.m_nIdUnidad,
            m_nIdRemolque: state.unidad.m_nIdUnidad,
            m_nCreadoPor: state.CreadoPor,
            m_nModificadoPor: state.ModificadoPor
        }
        if (state.diferenteRecoleccion){
            params.m_dFechaDetalleRecoleccion = state.fechaRecoleccion.split("T")[0]
            params.m_tHoraDetalleRecoleccion = state.fechaRecoleccion.split("T")[1]
            params.m_nIdCPDetalleRecoleccion = state.codigoPostalRecoleccion.m_nIdCP
            params.m_nIdCiudadDetalleRecoleccion = state.ciudadRecoleccion
            params.m_nIdZonaDetalleRecoleccion = state.zonaRecoleccion
            params.m_sDomicilioDetalleRecoleccion = state.domicilioRecoleccion
            params.m_sRecogerEnDetalleRecoleccion = state.recogerEn
            params.m_sDatosAdicionalesDetalleRecoleccion = state.datosAdicionalesRecoleccion
            params.m_bRecoleccionDiferenteDomicilio = state.diferenteRecoleccion
        }

        if (state.diferenteEntrega){
            params.m_bEntregaDiferenteDomicilio = state.diferenteEntrega
            params.m_nIdCPDetalleEntrega = state.codigoPostalEntrega.m_nIdCP
            params.m_nIdCiudadDetalleEntrega = state.ciudadEntrega
            params.m_nIdZonaDetalleEntrega = state.zonaEntrega
            params.m_sDomicilioDetalleEntrega = state.domicilioEntrega
            params.m_sEntregarEnDetalleEntrega = state.entregaEn
            params.m_sDatosAdicionalesDetalleEntrega = state.datosAdicionalesEntrega
        }

        /*const infoGeneral = {
            m_nIdRecoleccion: state.idRecoleccion,
            m_nIdSucursal: state.idSucursalAgregar,
            m_nIdEstatusRecoleccion: state.estatusRecoleccion,
            m_nIdEmbarque: state.folioEmbarque,
            m_nIdGuia: state.folioGuia,
            m_nIdInforme: state.folioInforme,
            m_dFecha: state.fechaHoraCreacion.split("T")[0],
            m_tHora: state.fechaHoraCreacion.split("T")[1],
            m_dFechaRegistro: state.fechaHoraRegistro.split("T")[0],
            m_tHoraRegistro: state.fechaHoraRegistro.split("T")[1],
            m_nMoneda: state.moneda,
            m_rTipoCambio: state.tipoCambio,
            m_nIdTipoDeCobro: state.tipoCobro,
        }
        console.log('info general:')
        console.log(infoGeneral)

        const remitente = {
            m_sNombreRemitente: state.nombreRemitente.m_sNombre,
            m_sRFCRemitente: state.RFCRemitente,
            m_sDomicilioRemitente: state.domicilioRemitente,
            m_sIdCodigoPostalRemitente: state.codigoPostalRemitente.m_nIdCP,
            m_nIdCiudadRemitente: state.ciudadRemitente,
            m_sCorreoRemitente: state.correoRemitente,
            m_sTelefonoRemitente: state.telefonoRemitente,
            m_sContactoRemitente: state.contactoRemitente,
            m_nIdCiudadOrigen: state.origenRemitente.m_nIdCiudad,
        }
        console.log('remitente:')
        console.log(remitente)

        const destinatario = {
            m_sNombreDestinatario: state.nombreDestinatario.m_sNombre,
            m_sRFCDestinatario: state.RFCDestinatario,
            m_sDomicilioDestinatario: state.domicilioDestinatario,
            m_sIdCodigoPostalDestinatario: state.codigoPostalDestinatario.m_nIdCP,
            m_nIdCiudadDestinatario: state.ciudadDestinatario,
            m_sCorreoDestinatario: state.correoDestinatario,
            m_sTelefonoDestinatario: state.telefonoDestinatario,
            m_sContactoDestinatario: state.contactoDestinatario,
            m_nIdCiudadDestino: state.destinoDestinatario.m_nIdCiudad,
        }
        console.log('destinatario:')
        console.log(destinatario)

        const recoleccion = {
            diferenteRecoleccion : state.diferenteRecoleccion,
            m_dFechaDetalleRecoleccion: params.m_dFechaDetalleRecoleccion,
            m_tHoraDetalleRecoleccion: params.m_tHoraDetalleRecoleccion,
            m_nIdCPDetalleRecoleccion: params.m_nIdCPDetalleRecoleccion,
            m_nIdCiudadDetalleRecoleccion: params.m_nIdCiudadDetalleRecoleccion,
            m_nIdZonaDetalleRecoleccion: params.m_nIdZonaDetalleRecoleccion,
            m_sDomicilioDetalleRecoleccion: params.m_sDomicilioDetalleRecoleccion,
            m_sRecogerEnDetalleRecoleccion: params.m_sRecogerEnDetalleRecoleccion,
            m_sDatosAdicionalesDetalleRecoleccion: params.m_sDatosAdicionalesDetalleRecoleccion,
        }
        console.log('recoleccion:')
        console.log(recoleccion)

        const entrega = {
            m_nIdCPDetalleEntrega: params.m_nIdCPDetalleEntrega,
            m_nIdCiudadDetalleEntrega: params.m_nIdCiudadDetalleEntrega,
            m_nIdZonaDetalleEntrega: params.m_nIdZonaDetalleEntrega,
            m_sDomicilioDetalleEntrega: params.m_sDomicilioDetalleEntrega,
            m_sEntregarEnDetalleEntrega: params.m_sEntregarEnDetalleEntrega,
            m_sDatosAdicionalesDetalleEntrega: params.m_sDatosAdicionalesDetalleEntrega,
            diferenteEntrega: state.diferenteEntrega
        }
        console.log('entrega:')
        console.log(entrega)

        const otrosDatos = {
            m_dFechaSalida: state.fechaHoraSalida.split("T")[0],
            m_dFechaLlegada: state.fechaHoraLlegada.split("T")[0],
            m_tHoraSalida: state.fechaHoraSalida.split("T")[1],
            m_tHoraLlegada: state.fechaHoraLlegada.split("T")[1],
            m_parrPaquetes: state.paquetes,
            m_nNoPaquetes: state.paquetes.length,
            m_parrSobres: state.sobres,
            m_nNoSobres: state.sobres.length,
            m_nIdOperador: state.operador.m_nIdOperador,
            m_nIdUnidad: state.unidad.m_nIdUnidad,
            m_nIdRemolque: state.unidad.m_nIdUnidad,
            m_nCreadoPor: state.CreadoPor,
            m_nModificadoPor: state.ModificadoPor
        }
        console.log('otros datos:')
        console.log(otrosDatos)*/

        console.log(params)
        console.log(JSON.stringify(params))
        if (state.idRecoleccion != 0) {
            modificarRecoleccion(state.idRecoleccion, params)
                .then((respuesta) => {
                    showSuccess(respuesta.data);
                    getAllData();
                    $('.nav-tabs li ').removeClass('active');
                    $('.nav-tabs li').eq(0).addClass('active');
                    $('.tab-content div ').removeClass('in show');
                    $('#Listado').addClass('in show');
                    limpiarInputsAgregar()
                })
                .catch((err) => {
                    console.log(err);
                    showSuccess("err");
                });
        } else {
            agregarRecoleccion(params)
                .then((respuesta) => {
                    console.log(respuesta.data);
                    showSuccess(respuesta.data);
                    getAllData();
                    $('.nav-tabs li ').removeClass('active');
                    $('.nav-tabs li').eq(0).addClass('active');
                    $('.tab-content div ').removeClass('in show');
                    $('#Listado').addClass('in show');
                    limpiarInputsAgregar()
                })
                .catch((err) => {
                    console.log(err);
                    showSuccess(err);
                });
        }


    };

    function getTipoCambio() {
        obtenerTipoCambio().then(respuesta => {
            setDataTipoCambio(respuesta.data)
        });
    };

    function getFormatosImpresion() {
        obtenerFormatosImpresion().then(respuesta => {
            setFormatosImpresion(respuesta.data)
        });
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
    }

    //funcion para cancelar un embarque. Se usa en tab cancelar.
    const handleCancelar = (e) => {
        e.preventDefault();
        let params = {
            "motivoCancelacion": state.motivoCancelacion,
            "usuarioCancelacion": localStorage.getItem("UsuarioId"),
            "fechaCancelacion": state.fechaCancelacion
        }
        cancelarRecoleccion(state.idRecoleccion, params).then((respuesta) => {
            showSuccess(respuesta.data)
            setState({
                ...state,
                idRecoleccion: 0,
                folioRecoleccion:'',
                sucursalCancelacion: '',
                mostrarFechaCancelacion: '',
                estatusRecoleccion: '',
                motivoCancelacion: '',
            })
        })
    }

    const changeHandler = (event) => {
        event.preventDefault();
        setSelectedFile(event.target.files[0]);
        setIsFilePicked(true);
    };

    function handleSubmission() {
        console.log(selectedFile)
        var reader = new FileReader();
        reader.onload = function () {
            console.log(reader.result)
        }.bind(this);
        reader.readAsText(selectedFile);
        setState({
            ...setState,
            uploadedFileContent: "reader.result"
        })
    };

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
        setState({ ...state, paquetes: paquetes, countPaquetes: state.countPaquetes + 1 });
    }

    function removePaquete(index) {
        var { paquetes } = state;
        if (paquetes.length !== 1) {
            paquetes.pop()
            setState({ ...state, paquetes: paquetes, countPaquetes: state.countPaquetes - 1 });
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
            sobres.pop()
            setState({ ...state, sobres: sobres, countSobres: state.countSobres - 1 });
        }
    }

    function handleEliminar(id) {
        var derecho;
        validarPermisos(state)
            .then((respuesta) => {
                //showSuccess(respuesta.data)

                derecho = respuesta.data;
                if (derecho == false) {
                    showSuccess("El usuario no tiene derechos para realizar el proceso");
                    return;
                }

                eliminarRecoleccion(id, state.CreadoPor)
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
        $('.nav-tabs li ').removeClass('active');
        $('.nav-tabs li').eq(1).addClass('active');
        $('.tab-content div ').removeClass('in show');
        $('#Agregar').addClass('in show');
        obtenerRecoleccionId(id).then((respuesta) => {
            console.log('Recoleccion: ', respuesta.data);
            setState(state => {
                return {
                    ...state,
                    agregar: "Modificar",
                }
            })
            setRecoleccionDataParaConsultaModificacion(respuesta)

        });
    }

    function handleShowConsultar(id) {
        $('.nav-tabs li ').removeClass('active');
        $('.nav-tabs li').eq(1).addClass('active');
        $('.tab-content div ').removeClass('in show');
        $('#Agregar').addClass('in show');
        obtenerRecoleccionId(id).then((respuesta) => {
            console.log('Recoleccion: ', respuesta.data);
            setState(state => {
                return {
                    ...state,
                    agregar: "Consultar",
                }
            })
            setRecoleccionDataParaConsultaModificacion(respuesta)

        });
    }

    const setRecoleccionDataParaConsultaModificacion = (respuesta) => {
        const remitente = dataRemitenteDestinatario.find((o) => o.m_sRFC == respuesta.data.m_sRFCRemitente)
        handleSelectRemitente(remitente)

        const destinatario = dataRemitenteDestinatario.find((o) => o.m_sRFC == respuesta.data.m_sRFCDestinatario)
        handleSelectDestinatario(destinatario)

        obtenerCodigoPostalId(respuesta.data.m_nIdCPDetalleRecoleccion).then((cp) => {
            setState(state => {
                return {
                    ...state,
                    codigoPostalRecoleccion: cp.data
                }
            })
        })
        obtenerCodigoPostalId(respuesta.data.m_nIdCPDetalleEntrega).then((cp) => {
            setState(state => {
                return {
                    ...state,
                    codigoPostalEntrega: cp.data
                }
            })
        })
        obtenerUnidadesId(respuesta.data.m_nIdUnidad).then((unit) => {
            setState(state => {
                return {
                    ...state,
                    unidad: unit.data
                }
            })

            obtenerTipoUnidadesId(unit.data.m_nIdTipoUnidad).then((tipoUnidad) => {
                console.log('tipoUnidad: ', tipoUnidad)
                setState(state => {
                    return {
                        ...state,
                        tipoUnidad: tipoUnidad.data
                    }
                })
            })
        })

        setState(state =>{
            return {
                ...state,
                idRecoleccion: respuesta.data.m_nIdRecoleccion,
                idSucursalAgregar: respuesta.data.m_nIdSucursal,
                folioRecoleccion: respuesta.data.m_sFolioRecoleccion,
                folioEmbarque: respuesta.data.m_nIdEmbarque,
                folioGuia: respuesta.data.m_nIdGuia,
                folioInforme: respuesta.data.m_nIdInforme,
                fechaHoraRegistro: respuesta.data.m_dFechaRegistro + "T" + respuesta.data.m_tHoraRegistro.slice(0, 5),
                estatusRecoleccion: respuesta.data.m_nIdEstatusRecoleccion,
                moneda: respuesta.data.m_nMoneda,
                tipoCambio: respuesta.data.m_rTipoCambio,
                tipoCobro: respuesta.data.m_nIdTipoDeCobro,

                //Remitente
                origenRemitente: dataCiudad.find((o) => o.m_nIdCiudad == respuesta.data.m_nIdCiudadOrigen),
                zonaRemitente: dataZona.find((z) => z.m_nIdZona == respuesta.data.m_nIdZonaRemitente),
                //Destinatario
                destinoDestinatario: dataCiudad.find((o) => o.m_nIdCiudad == respuesta.data.m_nIdCiudadDestino),
                zonaDestinatario: dataZona.find((z) => z.m_nIdZona == respuesta.data.m_nIdZonaDestinatario),

                //Paquetes/Sobres
                countPaquetes: respuesta.data.m_parrPaquetes.length,
                countSobres: respuesta.data.m_parrSobres.length,
                mismoPaquete: false,
                mismoSobre: false,
                paquetes: respuesta.data.m_parrPaquetes, //agrega la variable de tipo
                sobres: respuesta.data.m_parrSobres, // agregar variable de tipo

                //Entrega
                diferenteEntrega: respuesta.data.m_bEntregaDiferenteDomicilio,
                ciudadEntrega: respuesta.data.m_nIdCiudadDetalleEntrega,
                zonaEntrega: respuesta.data.m_nIdZonaDetalleEntrega,
                domicilioEntrega: respuesta.data.m_sDomicilioDetalleEntrega,
                entregaEn: respuesta.data.m_sEntregarEnDetalleEntrega,
                datosAdicionalesEntrega: respuesta.data.m_sDatosAdicionalesDetalleEntrega,

                //Recoleccion
                diferenteRecoleccion: respuesta.data.m_bRecoleccionDiferenteDomicilio,
                fechaRecoleccion: respuesta.data.m_dFechaDetalleRecoleccion + "T" + respuesta.data.m_tHoraDetalleRecoleccion.slice(0, 5),
                ciudadRecoleccion: respuesta.data.m_nIdCiudadDetalleRecoleccion,
                zonaRecoleccion: respuesta.data.m_nIdZonaDetalleRecoleccion,
                domicilioRecoleccion: respuesta.data.m_sDomicilioDetalleRecoleccion,
                recogerEn: respuesta.data.m_sRecogerEnDetalleRecoleccion,
                datosAdicionalesRecoleccion: respuesta.data.m_sDatosAdicionalesDetalleRecoleccion,

                //Operador
                operador: dataOperador.find((o) => o.m_nIdOperador == respuesta.data.m_nIdOperador),
                fechaHoraSalida: respuesta.data.m_dFechaSalida + "T" + respuesta.data.m_tHoraSalida.slice(0, 5),
                fechaHoraLlegada: respuesta.data.m_dFechaLlegada + "T" + respuesta.data.m_tHoraLlegada.slice(0, 5),


            }
        });
    }

    function handleShowSalidaLlegada(type) {
        obtenerRecoleccionId(state.idRecoleccion).then((respuesta) => {
            console.log(respuesta.data);
            setState({
                ...state,
                sucursalCancelacion: dataSucursal.find(o => o.m_nIdSucursal == respuesta.data.m_nIdSucursal).m_sSucursal,
                folioRecoleccion: respuesta.data.m_sFolioRecoleccion,
                fechaHoraCreacion:
                    respuesta.data.m_dFecha + "T" + respuesta.data.m_tHora.slice(0, 5),
                unidad: dataUnidad.find(
                    (o) => o.m_nIdUnidad == respuesta.data.m_nIdUnidad
                ),
                operador: dataOperador.find(
                    (o) => o.m_nIdOperador == respuesta.data.m_nIdOperador
                ),
                recogerEn: respuesta.data.m_sRecogerEnDetalleRecoleccion,
                fechaRecoleccion: respuesta.data.m_dFechaDetalleRecoleccion
            });
            $('.nav-tabs li ').removeClass('active');
            $('.nav-tabs li').eq(type).addClass('active');
            $('.tab-content div ').removeClass('in show');
            $('#Salida-Llegada').addClass('in show');
        });
    }

    function handleShowAgregar(event) {
        event.stopPropagation()
        limpiarInputsAgregar()
        setState(state => {
            return {
                ...state,
                idSucursalAgregar: localStorage.getItem("Sucursal"),
                folioRecoleccion: dataFolioRecoleccion.length !== 0 ? dataFolioRecoleccion[0].m_sFolioRecoleccion : "",
                fechaHoraRegistro: `${new Date().getFullYear()}-${`${new Date().getMonth() +
            1}`.padStart(2, 0)}-${`${new Date().getDate() + 1}`.padStart(2, 0)}T${`${new Date().getHours()}`.padStart(2, 0)}:${`${new Date().getMinutes()}`.padStart(2, 0)}`,

            }
        });
        $('.nav-tabs li ').removeClass('active');
        $('.nav-tabs li').eq(1).addClass('active');
        $('.tab-content div ').removeClass('in show');
        $('#Agregar').addClass('in show');

    }

    const handleShowListado = (event) => {
        event.stopPropagation();
        setState(state =>{
            return {
                ...state,
                fechaInicial: '',
                sucursalListado: 0,
                estatusListado: 0,
                height: window.height,
                agregar: "Agregar",
                fechaFinal: (today.getMonth() + 1) + "-" + today.getDate() + "-" + today.getFullYear(),
            }
        });
        getAllSucursales()
        $('.nav-tabs li ').removeClass('active');
        $('.nav-tabs li').eq(0).addClass('active');
        $('.tab-content div ').removeClass('in show');
        $('#Listado').addClass('in show');
    }

    function handleShowCancelar() {
        let hours = today.getHours();
        let mostrarHora = today.getHours();
        let minutes = today.getMinutes();
        let ampm = hours >= 12 ? 'pm' : 'am';
        hours = hours % 12;
        hours = hours ? hours : 12; // the hour '0' should be '12'
        minutes = minutes < 10 ? '0' + minutes : minutes;
        let strTime = hours + ':' + minutes + ' ' + ampm;
        obtenerRecoleccionCancelada(state.idRecoleccion).then((respuesta) => {
            const {m_sFolioRecoleccion, m_nIdSucursal, m_nIdEstatusRecoleccion, m_dtFechaCancelacion, m_sMotivoCancelacion} = respuesta.data
            setState({
                ...state,
                folioRecoleccion: m_sFolioRecoleccion,
                sucursalCancelacion: dataSucursal.find(o => o.m_nIdSucursal == m_nIdSucursal).m_sSucursal,
                fechaCancelacion: m_nIdEstatusRecoleccion == "0" ? m_dtFechaCancelacion :
                    today.getFullYear() + "-" + (today.getMonth() + 1) + "-" + today.getDate() + " " + mostrarHora + ":" + minutes,
                mostrarFechaCancelacion: m_nIdEstatusRecoleccion == "0" ? m_dtFechaCancelacion :
                    today.getDate() + "/" + (today.getMonth() + 1) + "/" + today.getFullYear() + " " + strTime,
                estatusRecoleccion: dataEstatusRecoleccion.find(o => o.m_nIdEstatusRecoleccion == m_nIdEstatusRecoleccion).m_sEstatus,
                motivoCancelacion: m_sMotivoCancelacion,
            })
            console.log(respuesta.data)
            if (respuesta.data.m_nSePuedeCancelar == 0)
                showSuccess("Recolección no se puede cancelar")
        })
        $('.nav-tabs li ').removeClass('active');
        $('.nav-tabs li').eq(3).addClass('active');
        $('.tab-content div ').removeClass('in show');
        $('#Cancelar').addClass('in show');
    }

    //Limpia todos los inputs
    const limpiarInputsAgregar = () => {
        setState(state => {
            return {
            ...state,
                idSucursalAgregar: '',
                folioRecoleccion: '',
                folioEmbarque: '',
                folioGuia: '',
                folioInforme: '',
                fechaHoraRegistro: '',
                estatusRecoleccion: 1,
                moneda: 1,
                tipoCambio: '',
                tipoCobro: '',

                //Remitente
                nombreRemitente: '',
                RFCRemitente: '',
                domicilioRemitente: '',
                ciudadRemitente: '',
                codigoPostalRemitente: '',
                correoRemitente: '',
                telefonoRemitente: '',
                contactoRemitente: '',
                origenRemitente: '',
                zonaRemitente: {},

                //Destinatario
                nombreDestinatario: '',
                RFCDestinatario: '',
                domicilioDestinatario: '',
                ciudadDestinatario: '',
                codigoPostalDestinatario: '',
                correoDestinatario: '',
                telefonoDestinatario: '',
                contactoDestinatario: '',
                destinoDestinatario: '',
                zonaDestinatario: {},

                //Paquetes/Sobres
                countPaquetes: 1,
                countSobres: 1,
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

                //Entrega
                diferenteEntrega: false,
                ciudadEntrega: '',
                codigoPostalEntrega: '',
                zonaEntrega: '',
                domicilioEntrega: '',
                entregaEn: '',
                datosAdicionalesEntrega: '',

                //Recoleccion
                diferenteRecoleccion: false,
                fechaRecoleccion: '',
                ciudadRecoleccion: '',
                codigoPostalRecoleccion: '',
                zonaRecoleccion: '',
                domicilioRecoleccion: '',
                recogerEn: '',
                datosAdicionalesRecoleccion: '',

                //Operador
                operador: '',
                tipoUnidad: '',
                unidad: '',
                fechaHoraSalida: '',
                fechaHoraLlegada: '',
            }
        });
    }

    const handleChange = (event) => {
        event.preventDefault();
        setState({
            ...state,
            [event.target.id]: event.target.value,
        });
    };

    const handleImprimir = () => {
        imprimirFormatosId(state.formatoSeleccionado).then((response) => {
            window.open(new Blob([response.data]));
        })

    }

    const handleChangePaquete = (event, index) => {
        var { paquetes } = state;
        paquetes[index][event.target.name] = event.target.value;
        paquetes[index].m_rVolumen = paquetes[index].m_rLargo * paquetes[index].m_rAlto * paquetes[index].m_rAncho;
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

    //setea si la recoleccion es en diferente direccion a la del remitente
    const handleRecoleccionCheckboxChange = (event) => {
        // event.preventDefault();
        setState({
            ...state,
            diferenteRecoleccion: !state.diferenteRecoleccion,
        });
    };

    //setea si la entrega es en diferente direccion a la del destinatario
    const handleEntregaCheckboxChange = (event) => {
        // event.preventDefault();
        setState({
            ...state,
            diferenteEntrega: !state.diferenteEntrega,
        });
    };

    //Maneja filtrado de listado embarque
    const handleFechaInicialFiltro = async (event) => {
        setState({
            ...state,
            fechaInicial: event.target.value,
        })
        const {fechaFinal, sucursalListado, estatusListado} = state
        if (sucursalListado == 0 && estatusListado == 0){
            getAllData()
        }else {
            obtenerRecoleccionFiltro(event.target.value, fechaFinal, sucursalListado, estatusListado).then(respuesta => {
                if (respuesta.data == "Vacio"){
                    setData([])
                }else {
                    setData(respuesta.data)
                }
            })
        }
    }

    //Maneja filtrado de listado embarque
    const handleFechaFinalFiltro = async (event) => {
        setState({
            ...state,
            fechaFinal: event.target.value,
        })
        const {fechaInicial, sucursalListado, estatusListado} = state
        if (sucursalListado == 0 && estatusListado == 0){
            getAllData()
        }else{
            obtenerRecoleccionFiltro(fechaInicial, event.target.value, sucursalListado, estatusListado).then(respuesta => {
                if (respuesta.data == "Vacio"){
                    setData([])
                }else {
                    setData(respuesta.data)
                }
            })
        }
    }

    //Maneja filtrado de listado embarque
    const handleSucursalFiltro = async (event) => {
        setState({
            ...state,
            sucursalListado: event.target.value,
        })
        const {fechaInicial, fechaFinal, estatusListado} = state
        console.log('sucursal: ', event.target.value)
        console.log('fechaInicial ', fechaInicial)
        console.log('fechaFinal ', fechaFinal)
        console.log('estatusListado ', estatusListado)
        if (event.target.value == 0 && estatusListado == 0){
            getAllData()
        }else{
            obtenerRecoleccionFiltro(fechaInicial, fechaFinal, event.target.value, estatusListado).then(respuesta => {
                if (respuesta.data == "Vacio"){
                    setData([])
                }else {
                    setData(respuesta.data)
                }
            })
        }
    }

    //Maneja filtrado de listado embarque
    const handleEstatusFiltro = async (event) => {
        setState({
            ...state,
            estatusListado: event.target.value,
        })
        const {fechaInicial, fechaFinal, sucursalListado} = state
        if (event.target.value == 0 && sucursalListado == 0){
            getAllData()
        }else {
            obtenerRecoleccionFiltro(fechaInicial, fechaFinal, sucursalListado, event.target.value).then(respuesta => {
                if (respuesta.data == "Vacio"){
                    setData([])
                }else {
                    setData(respuesta.data)
                }
            })
        }
    }

    const columns = React.useMemo(() => [
        {
            headerName: "Acciones",
            field: "",
            sortable: false, filterable: false,
            renderCell: (row) => {
                return (
                    <div>
                        <Tooltip title="Modificar">
                            <a href="#Agregar" role="tab" data-toggle="tab"
                                onClick={() => (handleShowModificar(row.row.m_nIdRecoleccion))}
                                className="btn btn-default btn-xs"><i className="fa fa-pencil-square-o"
                                    style={{ color: "#F9A03E" }} /></a>
                        </Tooltip>
                        <Tooltip title="Consultar">
                            <a href="#Agregar" role="tab" data-toggle="tab" className="btn btn-default btn-xs"
                                onClick={() => (handleShowConsultar(row.row.m_nIdRecoleccion))}><i className="fa fa-eye"
                                    style={{ color: "#F9A03E" }} /></a>
                        </Tooltip>
                        <Tooltip title="Eliminar">
                            <a href="#" className="btn btn-default btn-xs"
                                onClick={() => confirmAlert({
                                    title: 'Confirmar Eliminar',
                                    message: 'Está seguro de eliminar Embarque?',
                                    buttons: [
                                      {
                                        label: 'Si',
                                        onClick: () => handleEliminar(row.row.m_nIdRecoleccion)
                                      },
                                      {
                                        label: 'No',
                                      }
                                    ]
                                  })}><i className="zmdi zmdi-delete"
                                    style={{ color: "#F30B0B" }} /></a>
                        </Tooltip>



                    </div>
                )
            }
        },
        {
            headerName: "Folio",
            field: "m_sFolioRecoleccion",
            width: 125,
        },
        {
            headerName: "Fecha/Hora Elaboración",
            field: "m_sFechaHora",
            width: 200,
        },
        {
            headerName: "Fecha/Hora Recolección",
            field: "m_sFechaHoraDetalleRec",
            width: 200,
        },
        {
            headerName: "Sucursal",
            field: "m_sSucursal",
            width: 125,
        },
        {
            headerName: "Zona Recolección",
            field: "m_sZonaRecoleccion",
            width: 150,
        },
        {
            headerName: "Recoger En",
            field: "m_sRecogerEnDetalleRecoleccion",
            width: 125,
        },
        {
            headerName: "Estatus",
            field: "m_sEstatusRecoleccion",
            width: 125,
        },
        {
            headerName: "Operador",
            field: "m_sOperador",
            width: 250,
        },
        {
            headerName: "Unidad",
            field: "m_sUnidad",
            width: 125,
        },

        {
            headerName: "Remolque",
            field: "m_sTipoRemolque",
            width: 125,
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
            accessor: "m_bActivo", width: 100,
            renderCell: (row) => {
                return (
                    <div
                        style={{
                            width: "100%",
                            textAlign: "center",
                            color: row.row.m_bActivo == 'true' ? "green" : "red",
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
            accessor: "m_sTipoUnidad",
        },
        {
            Name: "Identificador",
            accessor: "m_nIdTipoUnidad",
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
            accessor: "m_sNombre",
        },
    ]);

    function getAllData() {
        obtenerRecoleccion().then((respuesta) => {
            console.log('Recolecciones listado',respuesta.data);
            setData(respuesta.data);
        });
    }

    function getAllEmbalajes() {
        obtenerEmbalajes().then((respuesta) => {
            setDataEmbalaje(respuesta.data);
        });
    }

    function getAllSucursales() {
        obtenerSucursales().then((respuesta) => {
            setDataSucursal(respuesta.data);
        });
    }

    function getAllEstatusRecoleccion() {
        obtenerEstatusRecoleccion().then((respuesta) => {
            setEstatusRecoleccion(respuesta.data);
        });
    }

    function getAllTipoCobro() {
        obtenerTipoCobro().then((respuesta) => {
            setDataTipoCobro(respuesta.data);
        });
    }

    function getAllTipoMoneda() {
        obtenerMonedas().then((respuesta) => {
            setDataTipoMoneda(respuesta.data);
        });
    }

    function getAllCiudades() {
        obtenerCiudades().then((respuesta) => {
            setDataCiudad(respuesta.data);
        });
    }

    function getAllZonas() {
        const url = `${process.env.REACT_APP_API_URL}/Zonas/GetListado`;
        axios.get(url, { headers }).then((respuesta) => {
            setDataZona(respuesta.data);
        });
    }

    function getUltimoFolioRecoleccion() {
        const url = `${process.env.REACT_APP_API_URL}/Recoleccion/GetUltimoFolio`;
        axios.get(url, { headers }).then((respuesta) => {
            SetDataFolioRecoleccion(respuesta.data);
        });
    }

    async function getAllCodigosPostales() {
        /*obtenerCodigoPostal().then((respuesta) => {
            console.log(respuesta.data)
            setDataCodigoPostal(respuesta.data);
        });*/
    }

    //setea la ciudad seleccionada para el remitente
    const handleChangeCiudadRemitente = (event) => {
        event.preventDefault();
        setState({
            ...state,
            ciudadRemitente: event.target.value,
            codigoPostalRemitente: null
        });
    }
    //setea la ciudad seleccionada para el destinatario
    const handleChangeCiudadDestinatario = (event) => {
        event.preventDefault();
        setState({
            ...state,
            ciudadDestinatario: event.target.value,
            codigoPostalDestinatario: null
        });
    }
    //setea la ciudad seleccionada para recoleccion
    const handleChangeCiudadRecoleccion = (event) => {
        event.preventDefault();
        setState({
            ...state,
            ciudadRecoleccion: event.target.value,
            codigoPostalRecoleccion: null
        });
    }
    //setea la ciudad seleccionada para entrega
    const handleChangeCiudadEntrega = (event) => {
        event.preventDefault();
        setState({
            ...state,
            ciudadEntrega: event.target.value,
            codigoPostalEntrega: null
        });
    }
    //setea la zona seleccionada para recoleccion
    const handleChangeZonaRecoleccion = (event) => {
        event.preventDefault();
        setState({
            ...state,
            zonaRecoleccion: event.target.value,
        });
    }
    //setea la zona seleccionada para entrega
    const handleChangeZonaEntrega = (event) => {
        event.preventDefault();
        setState({
            ...state,
            zonaEntrega: event.target.value,
        });
    }

    function getAllRemitentesDestinatarios() {
        obtenerRemitentesDestinatarios().then((respuesta) => {
            setDataRemitenteDestinatario(respuesta.data);
        });
    }

    function getAllOperadores() {
        obtenerOperadores().then((respuesta) => {
            setDataOperador(respuesta.data);
        });
    }

    function getAllTipoUnidad() {
        obtenerTipoUnidades().then((respuesta) => {
            if (respuesta.data == "Vacio"){
                setDataTipoUnidad([])
            }else{
                setDataTipoUnidad(respuesta.data)
            }
            console.log("tipos unidades listado: ", respuesta.data)
            // getAllUnidades(1);
        });
    }

    function getAllUnidades(id) {

        obtenerUnidadesTipo(id).then((respuesta) => {
            console.log('unidades listado: ',respuesta);
            setDataUnidad(respuesta.data);
        });
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

    function DefaultColumnFilter({
        column: { filterValue, preFilteredRows, setFilter },
    }) {
        const count = preFilteredRows.length;
        const [showResults, setShowResults] = React.useState(false)
        const onClick = () => setShowResults(!showResults)
        return (
            <div style={{ display: "flex" }}>
                <span style={{ display: "block", float: "right" }}>
                    <a onClick={onClick}>
                        <i className="fa fa-search" />
                    </a>
                </span>
                <br></br>
                <span style={{ display: "block" }}>
                    <input
                        className="form-control"
                        type={showResults ? "" : "hidden"}
                        value={filterValue || ""}
                        onChange={(e) => {
                            setFilter(e.target.value || undefined);
                        }}
                        placeholder={`Buscar ${count} registros...`}
                    />
                </span>
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
                                    <tr style={{ backgroundColor: row.original.m_nIdCP === select ? "orange" : "white" }}  {...row.getRowProps()}
                                        onClick={handleSelectCP.bind(this, row.original, false)}
                                        onDoubleClick={handleSelectCP.bind(this, row.original, true)}>
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
                                    <tr style={{ backgroundColor: row.original.m_nIdCiudad === select ? "orange" : "white" }} {...row.getRowProps()}
                                        onClick={handleSelectCP.bind(this, row.original, false)}
                                        onDoubleClick={handleSelectCP.bind(this, row.original, true)}>
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
                                    <tr style={{ backgroundColor: row.original.m_nIdOperador === select ? "orange" : "white" }} {...row.getRowProps()}
                                        onClick={handleSelectCP.bind(this, row.original, false)}
                                        onDoubleClick={handleSelectCP.bind(this, row.original, true)}>
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
                                    <tr style={{ backgroundColor: row.original.m_nIdTipoUnidad === select ? "orange" : "white" }} {...row.getRowProps()}
                                        onClick={handleSelectCP.bind(this, row.original, false)}
                                        onDoubleClick={handleSelectCP.bind(this, row.original, true)}>
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
                                    <tr style={{ backgroundColor: row.original.m_nIdUnidad === select ? "orange" : "white" }} {...row.getRowProps()}
                                        onClick={handleSelectCP.bind(this, row.original, false)}
                                        onDoubleClick={handleSelectCP.bind(this, row.original, true)}>
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
                                    <tr style={{ backgroundColor: row.original.m_nIdRemitenteDestinatario === select ? "#FCC88F" : "white" }} {...row.getRowProps()}
                                        onClick={handleSelectCP.bind(this, row.original, false)}
                                        onDoubleClick={handleSelectCP.bind(this, row.original, true)}>

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
                $section = $("#paquetesSobres");

                break;
            case 4:
                setStepActive(4);
                $section = $("#detallesRecoleccion");
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
                <h4><strong>{`Paquete #${index + 1}`}</strong></h4>


                <div className="col-sm-4 col-md-2-5 unit">
                    <div className="input">
                        <TextField variant="outlined" margin="dense"
                            onChange={(event) => handleChangePaquete(event, index)}
                            className="form-control"
                            type="text"
                            label="Peso"
                            value={state.paquetes[index].m_rPeso}
                            required
                            disabled={state.agregar === "Consultar"}
                            placeholder="kg"
                            name="m_rPeso"
                        />
                    </div>
                </div>

                <div className="col-sm-4 col-md-2-5 unit">
                    <div className="input">
                        <TextField variant="outlined" margin="dense"
                            onChange={(event) => handleChangePaquete(event, index)}
                            className="form-control"
                            type="text"
                            value={state.paquetes[index].m_rLargo}
                            required
                            label="Largo"
                            disabled={state.agregar === "Consultar"}
                            placeholder="cms"
                            name="m_rLargo"
                        />
                    </div>
                </div>

                <div className="col-sm-4 col-md-2-5 unit">
                    <div className="input">
                        <TextField variant="outlined" margin="dense"
                            onChange={(event) => handleChangePaquete(event, index)}
                            className="form-control"
                            type="text"
                            label="Ancho"
                            value={state.paquetes[index].m_rAncho}
                            required
                            disabled={state.agregar === "Consultar"}
                            placeholder="cms"
                            name="m_rAncho"
                        />
                    </div>
                </div>

                <div className="col-sm-4 col-md-2-5 unit">
                    <div className="input">
                        <TextField variant="outlined" margin="dense"
                            onChange={(event) => handleChangePaquete(event, index)}
                            className="form-control"
                            type="text"
                            value={state.paquetes[index].m_rAlto}
                            required
                            label="Alto"
                            disabled={state.agregar === "Consultar"}
                            placeholder="cms"
                            name="m_rAlto"
                        />
                    </div>
                </div>

                <div className="col-sm-4 col-md-2-5 unit">
                    <div className="input">
                        <TextField variant="outlined" margin="dense"
                            // onChange={(event) => handleChangePaquete(event, index)}
                            className="form-control"
                            type="text"
                            value={state.paquetes[index].m_rVolumen}
                            required
                            label="Volumen"
                            disabled
                            placeholder="cm3"
                            name="m_rVolumen"
                        />
                    </div>
                </div>

                <div className="col-sm-4 col-md-6 unit">
                    <label className="input select">
                        <FormControl fullWidth variant="outlined" margin="dense">
                            <InputLabel id="m_nIdTipoEmbalajeLabel">Tipo de Embalaje</InputLabel>
                            <Select
                                label="Tipo de Embalaje"
                                labelId="m_nIdTipoEmbalajeLabel"
                                className="form-control"
                                value={state.paquetes[index].m_nIdTipoEmbalaje}
                                disabled={state.agregar === "Consultar"}
                                onChange={(event) => handleChangePaquete(event, index)}
                                id="m_nIdTipoEmbalaje"
                                name="m_nIdTipoEmbalaje"
                                required
                            >
                                {dataEmbalaje.map((embalaje) => (
                                    <option key={embalaje.m_nIdEmbalaje} value={embalaje.m_nIdEmbalaje}>
                                        {embalaje.m_sNombre}
                                    </option>
                                ))}
                            </Select>
                        </FormControl>
                        <i className="fa fa-arrow-down" />
                    </label>
                </div>

                <div className="col-sm-4 col-md-6 unit">
                    <div className="input">
                        <TextField variant="outlined" margin="dense"
                            onChange={(event) => handleChangePaquete(event, index)}
                            className="form-control"
                            type="text"
                            label="Valor Declarado"
                            value={state.paquetes[index].m_cyValorDeclarado}
                            required
                            disabled={state.agregar === "Consultar"}
                            placeholder="$"
                            name="m_cyValorDeclarado"
                        />
                    </div>
                </div>

                <div className="col-sm-4 col-md-8 unit">
                    <div className="input">
                        <TextField variant="outlined" margin="dense"
                            onChange={(event) => handleChangePaquete(event, index)}
                            className="form-control"
                            type="text"
                            label="Descripción"
                            value={state.paquetes[index].m_sDescripcion}
                            required
                            disabled={state.agregar === "Consultar"}
                            placeholder="Descripción"
                            name="m_sDescripcion"
                        />
                    </div>
                </div>

                <div className="col-sm-4 col-md-4 unit">
                    <div className="input">
                        <TextField variant="outlined" margin="dense"
                            onChange={(event) => handleChangePaquete(event, index)}
                            className="form-control"
                            type="text"
                            label="Ctd"
                            value={state.paquetes[index].m_nCantidad}
                            required
                            disabled={state.agregar === "Consultar"}
                            placeholder="Ctd"
                            name="m_nCantidad"
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
                            value={state.paquetes[index].m_sObservaciones}
                            required
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
                <h4><strong>{`Sobre #${index + 1}`}</strong></h4>




                <div className="col-md-12 unit">
                    <div className="input">
                        <TextField variant="outlined" margin="dense"
                            onChange={(event) => handleChangeSobre(event, index)}
                            className="form-control"
                            type="text"
                            label="Descripcion"
                            value={state.sobres[index].m_sDescripcion}
                            required
                            disabled={state.agregar === "Consultar"}
                            placeholder="Descripción"
                            name="m_sDescripcion"
                        />
                    </div>
                </div>
            </div>
        );
    });

    if (redirect) {
        if (data.find((o) => o.m_nIdRecoleccion == state.idRecoleccion).m_nIdEmbarque != 0) {
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

    const handleZonaRemitenteSelected = (newValue) => {
        setState({
            ...state,
            zonaRemitente: newValue
        })
    }

    const handleZonaDestinatarioSelected = (newValue) => {
        setState({
            ...state,
            zonaDestinatario: newValue
        })
    }

    return (
        <div >
            <Dialog open={state.openDialog} onClose={() => setState({ ...state, openDialog: false })} fullWidth maxWidth="md">
                <DialogContent>
                    {state.tipoModal === 0 &&
                        <div className="row" style={{ backgroundColor: '#FFFFFF' }}>
                            <div align="right">
                                <button onClick={() => {
                                    history.push("/Ciudades")
                                }} className="btn btn-primary primary-btn">Agregar
                            </button>

                            </div>

                            {dataCodigosPostalesRemitente.length !== 0 ? <TableCodigoPostal object={state}
                                select={state[state.identificadorModal] && state[state.identificadorModal].m_nIdCP}
                                columns={columnsCP} data={dataCodigosPostalesRemitente.filter((cp) => cp.m_nIdCiudad == state.ciudadRemitente)}
                                identificadorModal={state.identificadorModal} /> :
                                <div>No se encontró ningún registro</div>}

                            <DialogActions style={{ justifyContent: "left" }}>

                                <button onClick={() => setState({ ...state, openDialog: false })}
                                    className="btn btn-primary primary-btn">Aceptar
                            </button>
                                <button onClick={() => setState({ ...state, openDialog: false })}
                                    className="btn btn-secondary secondary-btn">Cerrar
                            </button>

                            </DialogActions>
                        </div>
                    }
                    {state.tipoModal === 7 &&
                    <div className="row" style={{ backgroundColor: '#FFFFFF' }}>
                        <div align="right">
                            <button onClick={() => {
                                history.push("/Ciudades")
                            }} className="btn btn-primary primary-btn">Agregar
                            </button>

                        </div>

                        {dataCodigosPostalesDestinatario.length !== 0 ? <TableCodigoPostal object={state}
                                                                            select={state[state.identificadorModal] && state[state.identificadorModal].m_nIdCP}
                                                                            columns={columnsCP} data={dataCodigosPostalesDestinatario.filter((cp) => cp.m_nIdCiudad == state.ciudadDestinatario)}
                                                                            identificadorModal={state.identificadorModal} /> :
                            <div>No se encontró ningún registro</div>}

                        <DialogActions style={{ justifyContent: "left" }}>

                            <button onClick={() => setState({ ...state, openDialog: false })}
                                    className="btn btn-primary primary-btn">Aceptar
                            </button>
                            <button onClick={() => setState({ ...state, openDialog: false })}
                                    className="btn btn-secondary secondary-btn">Cerrar
                            </button>

                        </DialogActions>
                    </div>
                    }
                    {state.tipoModal === 8 &&
                    <div className="row" style={{ backgroundColor: '#FFFFFF' }}>
                        <div align="right">
                            <button onClick={() => {
                                history.push("/Ciudades")
                            }} className="btn btn-primary primary-btn">Agregar
                            </button>

                        </div>

                        {dataCodigosPostalesRecoleccion.length !== 0 ? <TableCodigoPostal object={state}
                                                                            select={state[state.identificadorModal] && state[state.identificadorModal].m_nIdCP}
                                                                            columns={columnsCP} data={dataCodigosPostalesRecoleccion.filter((cp) => cp.m_nIdCiudad == state.ciudadRecoleccion)}
                                                                            identificadorModal={state.identificadorModal} /> :
                            <div>No se encontró ningún registro</div>}

                        <DialogActions style={{ justifyContent: "left" }}>

                            <button onClick={() => setState({ ...state, openDialog: false })}
                                    className="btn btn-primary primary-btn">Aceptar
                            </button>
                            <button onClick={() => setState({ ...state, openDialog: false })}
                                    className="btn btn-secondary secondary-btn">Cerrar
                            </button>

                        </DialogActions>
                    </div>
                    }
                    {state.tipoModal === 9 &&
                    <div className="row" style={{ backgroundColor: '#FFFFFF' }}>
                        <div align="right">
                            <button onClick={() => {
                                history.push("/Ciudades")
                            }} className="btn btn-primary primary-btn">Agregar
                            </button>

                        </div>

                        {dataCodigosPostalesEntrega.length !== 0 ? <TableCodigoPostal object={state}
                                                                            select={state[state.identificadorModal] && state[state.identificadorModal].m_nIdCP}
                                                                            columns={columnsCP} data={dataCodigosPostalesEntrega.filter((cp) => cp.m_nIdCiudad == state.ciudadEntrega)}
                                                                            identificadorModal={state.identificadorModal} /> :
                            <div>No se encontró ningún registro</div>}

                        <DialogActions style={{ justifyContent: "left" }}>

                            <button onClick={() => setState({ ...state, openDialog: false })}
                                    className="btn btn-primary primary-btn">Aceptar
                            </button>
                            <button onClick={() => setState({ ...state, openDialog: false })}
                                    className="btn btn-secondary secondary-btn">Cerrar
                            </button>

                        </DialogActions>
                    </div>
                    }
                    {state.tipoModal === 1 &&
                        <div className="row" style={{ backgroundColor: '#FFFFFF' }}>
                            <div align="right">
                                <button onClick={() => {
                                    history.push("/Ciudades")
                                }} className="btn btn-primary primary-btn">Agregar
                            </button>

                            </div>

                            {dataCiudad.length !== 0 ? <TableCiudades object={state}
                                select={state[state.identificadorModal] && state[state.identificadorModal].m_nIdCiudad}
                                columns={columnsCiudades} data={dataCiudad}
                                identificadorModal={state.identificadorModal} /> :
                                <div>No se encontró ningún registro</div>}


                            <DialogActions style={{ justifyContent: "left" }}>

                                <button onClick={() => setState({ ...state, openDialog: false })}
                                    className="btn btn-primary primary-btn">Aceptar
                            </button>
                                <button onClick={() => setState({ ...state, openDialog: false })}
                                    className="btn btn-secondary secondary-btn">Cerrar
                            </button>

                            </DialogActions>
                        </div>
                    }
                    {state.tipoModal === 2 &&
                        <div className="row" style={{ backgroundColor: '#FFFFFF' }}>
                            <div align="right">
                                <button onClick={() => {
                                    history.push("/Operador")
                                }} className="btn btn-primary primary-btn">Agregar
                            </button>

                            </div>

                            {dataOperador.length !== 0 ? <TableOperadores object={state}
                                select={state[state.identificadorModal] && state[state.identificadorModal].m_nIdOperador}
                                columns={columnsOperadores} data={dataOperador}
                                identificadorModal={state.identificadorModal} /> :
                                <div>No se encontró ningún registro</div>}

                            <DialogActions style={{ justifyContent: "left" }}>

                                <button onClick={() => setState({ ...state, openDialog: false })}
                                    className="btn btn-primary primary-btn">Aceptar
                            </button>
                                <button onClick={() => setState({ ...state, openDialog: false })}
                                    className="btn btn-secondary secondary-btn">Cerrar
                            </button>

                            </DialogActions>
                        </div>
                    }
                    {state.tipoModal === 3 &&
                        <div className="row" style={{ backgroundColor: '#FFFFFF' }}>
                            <div align="right">
                                <button onClick={() => {
                                    history.push("/TipoUnidad")
                                }} className="btn btn-primary primary-btn">Agregar
                            </button>
                            </div>
                            {dataTipoUnidad.length !== 0 ? <TableTipoUnidad object={state}
                                select={state[state.identificadorModal] && state[state.identificadorModal].m_nIdTipoUnidad}
                                columns={columnsTipoUnidades}
                                data={dataTipoUnidad}
                                identificadorModal={state.identificadorModal} /> :
                                <div>No se encontró ningún registro</div>}

                            <DialogActions style={{ justifyContent: "left" }}>

                                <button onClick={() => setState({ ...state, openDialog: false })}
                                    className="btn btn-primary primary-btn">Aceptar
                            </button>
                                <button onClick={() => setState({ ...state, openDialog: false })}
                                    className="btn btn-secondary secondary-btn">Cerrar
                            </button>

                            </DialogActions>
                        </div>
                    }
                    {state.tipoModal === 4 &&
                        <div className="row" style={{ backgroundColor: '#FFFFFF' }}>
                            <div align="right">
                                <button onClick={() => {
                                    history.push("/Unidades")
                                }} className="btn btn-primary primary-btn">Agregar
                            </button>

                            </div>

                            {dataUnidad.length !== 0 ? <TableUnidad object={state}
                                select={state[state.identificadorModal] && state[state.identificadorModal].m_nIdUnidad}
                                columns={columnsUnidades} data={dataUnidad}
                                identificadorModal={state.identificadorModal} /> :
                                <div>No se encontró ningún registro</div>}

                            <DialogActions style={{ justifyContent: "left" }}>
                                <button onClick={() => setState({ ...state, openDialog: false })}
                                    className="btn btn-primary primary-btn">Aceptar
                            </button>
                                <button onClick={() => setState({ ...state, openDialog: false })}
                                    className="btn btn-secondary secondary-btn">Cerrar
                            </button>

                            </DialogActions>
                        </div>
                    }
                    {state.tipoModal === 5 &&
                        <div className="row" style={{ backgroundColor: '#FFFFFF' }}>
                            <div align="right">
                                <button onClick={() => {
                                    history.push("/RemitenteDestinatarios")
                                }} className="btn btn-primary primary-btn">Agregar
                            </button>

                            </div>

                            {dataRemitenteDestinatario.length !== 0 ? <TableRemitentesDestinatarios object={state}
                                select={state[state.identificadorModal] && state[state.identificadorModal].m_nIdRemitenteDestinatario}
                                columns={columnsRemitenteDestinatarios}
                                data={dataRemitenteDestinatario}
                                identificadorModal={state.identificadorModal} /> :
                                <div>No se encontró ningún registro</div>}

                            <DialogActions style={{ justifyContent: "left" }}>

                                <button onClick={() => setState({ ...state, openDialog: false })}
                                    className="btn btn-primary primary-btn">Aceptar
                            </button>
                                <button onClick={() => setState({ ...state, openDialog: false })}
                                    className="btn btn-secondary secondary-btn">Cerrar
                            </button>

                            </DialogActions>
                        </div>
                    }
                    {state.tipoModal === 6 &&
                        <div className="row" style={{ backgroundColor: '#FFFFFF' }}>
                            <DialogTitle style={{padding:"0px"}}><h4>Selecciona el Formato</h4></DialogTitle>
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
                    }</DialogContent>

            </Dialog>

            <header className="topbar clearfix">
                <Cabecera titulo="Recolección" >
                    <div className="page-header">
                        <ul className="list-page-breadcrumb">
                            <li className="active-page">Recolección</li>
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
                        <li className="active">
                            <a data-toggle="tab" onClick={(event) => handleShowListado(event)}>
                                <i className="fa fa-list" /> Listado
                            </a>
                        </li>

                        <li>
                            <a data-toggle="tab" onClick={handleShowAgregar}>
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
                            <a data-toggle="tab" href="#Cancelar" onClick={handleShowCancelar}
                                className={state.idRecoleccion === 0 ? classes.disabled : ""}>
                                <i className="zmdi zmdi-print" /> Cancelar
                            </a>
                        </li>

                        <li>
                            <a data-toggle="tab" href="#Salida-Llegada" onClick={() => handleShowSalidaLlegada(4)}
                                className={state.idRecoleccion === 0 ? classes.disabled : ""}>
                                <i className="fa fa-times-circle" /> Salida
                            </a>
                        </li>

                        <li>
                            <a data-toggle="tab" href="#Salida-Llegada" onClick={() => handleShowSalidaLlegada(5)}
                                className={state.idRecoleccion === 0 ? classes.disabled : ""}>
                                <i className="fa fa-times-circle" /> Llegada
                            </a>
                        </li>

                        <li style={{ float: "right" }}>
                            <a data-toggle="tab" href="#" className={state.idRecoleccion === 0 ? classes.disabled : ""}
                                style={{ textAlign: "right" }} onClick={() => setRedirect(true)}>
                                Generar embarque
                            </a>
                        </li>

                        {/**<button className="topbar-right pull-right">Boton</button>*/}
                    </ul>

                    <div
                        className="row tab-content"
                        style={{ paddingLeft: "-15px" }}
                    >
                        <div id="Listado" className="tab-pane fade in show">
                            <div className="widget-wrap">
                                <form className="j-forms">
                                    <div className="row" style={{ display: "flex" }}>
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
                                                        labelId="estatusListadoLabel"
                                                        className="form-control"
                                                        required
                                                        label="Estatus"
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
                                                    </Select>
                                                </FormControl>
                                            </label>
                                        </div>
                                    </div>
                                </form>
                                <div className="row" style={{ height: state.height - 250, width: '100%' }}>
                                    <DataGrid
                                        localeText={dataGridLocaleText}
                                        className={classes.root}
                                        components={{
                                            LoadingOverlay: CustomLoadingOverlay,
                                        }}
                                        loading={data == undefined}
                                        rows={data}
                                        columns={columns}
                                        density="compact"
                                        pageSize={Math.floor((state.height - 310) / 30)}
                                        getRowId={(row) => row.m_nIdRecoleccion}
                                        onRowSelected={(row) => {
                                            setState({
                                                ...state,
                                                idRecoleccion: row.data.m_nIdRecoleccion
                                            })
                                        }}
                                    />
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
                                            top: "60px",
                                            padding: "1px",
                                            backgroundColor: "white",
                                            zIndex: 100,
                                            marginBottom: "10px",
                                        }}
                                    >
                                        <div className="row ">
                                            <Stepper activeStep={stepActive - 1}>
                                                {
                                                    ["Información General", "Remitente/Destinatario", "Paquetes y Sobres", "Información Adicional del Pago", "Detalles de Operación"].map((s, index) => (
                                                        <Step key={s} completed={false} onClick={() => openSection(index + 1)}>
                                                            <StepLabel >{s}</StepLabel>
                                                        </Step>
                                                    ))
                                                }
                                            </Stepper>
                                        </div>
                                    </div>

                                    <div className="widget-wrap2" id="informacionGeneral">
                                        <div className="widget-header">
                                            <h2>Información General</h2>
                                        </div>
                                        <div className="widget-container">
                                            <div className="widget-content">
                                                <div className="row ">
                                                    <div className="col-md-12">
                                                        <div className="col-sm-6 col-md-2-5 col-lg-2-5 unit">
                                                            {" "}
                                                            <label className="input select">
                                                                <FormControl fullWidth variant="outlined"
                                                                    margin="dense">
                                                                    <InputLabel
                                                                        id="idSucursalAgregarLabel">Sucursal</InputLabel>
                                                                    <Select
                                                                        labelId="idSucursalAgregarLabel"
                                                                        label="Sucursal"
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
                                                                    </Select>
                                                                </FormControl>
                                                            </label>
                                                        </div>

                                                        <div className="col-sm-6 col-md-2-5 col-lg-2-5 unit">
                                                            <div className="input">
                                                                <TextField variant="outlined" margin="dense"
                                                                    onChange={handleChange}
                                                                    className="form-control"
                                                                    type="text"
                                                                    label="Folio Recolección"
                                                                    value={state.folioRecoleccion}
                                                                    id="folioRecoleccion"
                                                                    readOnly
                                                                />
                                                            </div>
                                                        </div>

                                                        <div className="col-sm-6 col-md-2-5 col-lg-2-5 unit">
                                                            <div className="input">
                                                                <TextField variant="outlined" margin="dense"
                                                                    onChange={handleChange}
                                                                    className="form-control"
                                                                    type="text"
                                                                    label="Folio Embarque"
                                                                    value={state.folioEmbarque}
                                                                    id="folioEmbarque"
                                                                    readOnly
                                                                />
                                                            </div>
                                                        </div>

                                                        <div className="col-sm-6 col-md-2-5 col-lg-2-5 unit">
                                                            <div className="input">
                                                                <TextField variant="outlined" margin="dense"
                                                                    onChange={handleChange}
                                                                    className="form-control"
                                                                    type="text"
                                                                    label="Folio Guía"
                                                                    value={state.folioGuia}
                                                                    id="folioGuia"
                                                                    readOnly
                                                                />
                                                            </div>
                                                        </div>

                                                        <div className="col-sm-6 col-md-2-5 col-lg-2-5 unit">
                                                            <div className="input">
                                                                <TextField variant="outlined" margin="dense"
                                                                    onChange={handleChange}
                                                                    className="form-control"
                                                                    type="text"
                                                                    label="Folio Informe"
                                                                    value={state.folioInforme}
                                                                    id="folioInforme"
                                                                    readOnly
                                                                />
                                                            </div>
                                                        </div>

                                                        <div className="col-sm-6 col-md-2-5 col-lg-2-5 unit">
                                                            <div className="input">
                                                                <TextField variant="outlined" margin="dense"
                                                                    onChange={handleChange}
                                                                    required
                                                                    label="Fecha / Hora de Registro"
                                                                    InputLabelProps={{
                                                                        shrink: true,
                                                                    }}
                                                                    value={state.fechaHoraRegistro}
                                                                    className="form-control"
                                                                    id="fechaHoraRegistro"
                                                                    type="datetime-local"
                                                                    disabled={state.agregar === "Consultar" || state.agregar === "Modificar"}

                                                                />
                                                            </div>
                                                        </div>

                                                        <div className="col-sm-6 col-md-2-5 col-lg-2-5 unit">

                                                            <label className="input select">
                                                                <FormControl fullWidth variant="outlined"
                                                                    margin="dense">
                                                                    <InputLabel id="estatusRecoleccionLabel">Estatus de
                                                                        la Recolección</InputLabel>
                                                                    <Select
                                                                        labelId="estatusRecoleccion"
                                                                        className="form-control"
                                                                        required
                                                                        label="Estatus de la Recolección"
                                                                        value={state.estatusRecoleccion}
                                                                        onChange={(event) => {
                                                                            event.preventDefault();
                                                                            setState({
                                                                                ...state,
                                                                                estatusRecoleccion: event.target.value,
                                                                            });
                                                                        }}
                                                                        disabled={!(state.agregar === "Modificar")}
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
                                                                    </Select>
                                                                </FormControl>
                                                                <i></i>
                                                            </label>
                                                        </div>

                                                        <div className="col-sm-6 col-md-2-5 col-lg-2-5 unit">
                                                            <label className="input select">
                                                                <FormControl fullWidth variant="outlined"
                                                                    margin="dense">
                                                                    <InputLabel id="monedaLabel">Moneda</InputLabel>
                                                                    <Select
                                                                        labelId="monedaLabel"
                                                                        label="Moneda"
                                                                        className="form-control"
                                                                        required
                                                                        value={state.moneda}
                                                                        onChange={(event) => {
                                                                            event.preventDefault();
                                                                            setState({
                                                                                ...state,
                                                                                moneda: event.target.value,
                                                                            });
                                                                        }}
                                                                        disabled={state.agregar === "Consultar"}
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
                                                                    </Select>
                                                                </FormControl>
                                                                <i className="fa fa-arrow-down" />
                                                            </label>
                                                        </div>

                                                        <div className="col-sm-6 col-md-2-5 col-lg-2-5 unit">
                                                            <label className="input select">
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
                                                                <i className="fa fa-arrow-down" />
                                                            </label>
                                                        </div>


                                                        <div className="col-sm-6 col-md-2-5 col-lg-2-5 unit">
                                                            <label className="input select">
                                                                <FormControl fullWidth variant="outlined"
                                                                    margin="dense">
                                                                    <InputLabel id="tipoCobroLabel">Tipo
                                                                        Cobro</InputLabel>
                                                                    <Select
                                                                        labelId="tipoCobroLabel"
                                                                        label="Tipo Cobro"
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
                                                                    </Select>
                                                                </FormControl>
                                                            </label>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="row " >
                                        <div className="col-md-7" >
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
                                                                        <div className="input">
                                                                            <Autocomplete
                                                                                value={state.nombreRemitente}
                                                                                disabled={state.agregar === "Consultar"}
                                                                                freeSolo
                                                                                onChange={(event, newValue) => {
                                                                                    handleSelectRemitente(newValue)
                                                                                }}
                                                                                id="nombreRemitente"
                                                                                disableClearable
                                                                                label="Nombre"
                                                                                forcePopupIcon={false}
                                                                                options={dataRemitenteDestinatario}
                                                                                getOptionLabel={(option) => option.m_sAlias + " (" + option.m_sNombre + ")"}
                                                                                style={{
                                                                                    transform: "translate(14px, 10px) scale(1) !important"
                                                                                }}
                                                                                renderInput={(params) => (
                                                                                    <div>
                                                                                        <TextField
                                                                                            required
                                                                                            variant="outlined"
                                                                                            label="Nombre"
                                                                                            margin="dense"
                                                                                            className="form-control"

                                                                                            {...params}
                                                                                            InputProps={{
                                                                                                ...params.InputProps,
                                                                                                style: {
                                                                                                    height: "33px",
                                                                                                    fontSize: "14px"
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
                                                                                                            disabled={state.agregar === "Consultar"}
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
                                                                    <div className="col-sm-12 col-md-12 unit">
                                                                        {" "}
                                                                        <div className="input">
                                                                            <TextField variant="outlined" margin="dense"
                                                                                onChange={handleChange}
                                                                                className="form-control"
                                                                                type="text"
                                                                                fullWidth
                                                                                label="RFC"
                                                                                pattern="[A-Z&Ñ]{3,4}[0-9]{2}(0[1-9]|1[012])(0[1-9]|[12][0-9]|3[01])[A-Z0-9]{2}[0-9A]"
                                                                                title="Favor de introducir un RFC válido."
                                                                                required
                                                                                value={state.RFCRemitente}
                                                                                disabled={state.agregar === "Consultar"}
                                                                                id="RFCRemitente"
                                                                            />
                                                                        </div>
                                                                    </div>
                                                                    {/* --------------------------------------- Domicilio -------------------------------------- */}
                                                                    <div className="col-sm-12 col-md-12 unit">
                                                                        <div className="input">
                                                                            <TextField variant="outlined" margin="dense"
                                                                                onChange={handleChange}
                                                                                className="form-control"
                                                                                type="text"
                                                                                required
                                                                                label="Domicilio"
                                                                                value={state.domicilioRemitente}
                                                                                disabled={state.agregar === "Consultar"}
                                                                                id="domicilioRemitente"
                                                                            />
                                                                        </div>
                                                                    </div>
                                                                    {/* --------------------------------------- Ciudad ------------------------------------------------- */}
                                                                    <div className="col-sm-12 col-md-12 col-lg-12 unit">
                                                                        <label className="input select">
                                                                            <FormControl fullWidth variant="outlined"
                                                                                margin="dense">
                                                                                <InputLabel
                                                                                    id="ciudadRemitenteLabel">Ciudad</InputLabel>
                                                                                <Select
                                                                                    labelId="ciudadRemitenteLabel"
                                                                                    label="Ciudad"
                                                                                    className="form-control"
                                                                                    required
                                                                                    value={state.ciudadRemitente}
                                                                                    disabled={state.agregar === "Consultar"}
                                                                                    onChange={handleChangeCiudadRemitente}
                                                                                    //onSelect={ getAllCodigosPostales(state.ciudadRemitente)}

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
                                                                                </Select>
                                                                            </FormControl>
                                                                            <i className="fa fa-arrow-down" />
                                                                        </label>
                                                                    </div>

                                                                    {/* --------------------------------------- AutocompleteCPRemitente -------------------------------------- */}
                                                                    <div className="col-sm-12 col-md-12 unit">

                                                                        <div className="input">
                                                                            <Autocomplete
                                                                                value={state.codigoPostalRemitente}
                                                                                freeSolo
                                                                                onChange={(event, newValue) => {
                                                                                    console.log(state.ciudadRemitente)
                                                                                    console.log(
                                                                                        dataCodigosPostalesRemitente.filter(cp => cp.m_nIdCiudad == state.ciudadRemitente))
                                                                                    setState({
                                                                                        ...state,
                                                                                        codigoPostalRemitente: newValue
                                                                                    })
                                                                                }}
                                                                                id="codigoPostalRemitente"
                                                                                disableClearable
                                                                                forcePopupIcon={false}
                                                                                options={dataCodigosPostalesRemitente.filter((cp) => cp.m_nIdCiudad == state.ciudadRemitente)}
                                                                                disabled={state.agregar === "Consultar"}
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
                                                                                            variant="outlined"
                                                                                            label="Código Postal"
                                                                                            margin="dense"
                                                                                            required
                                                                                            {...params}
                                                                                            InputProps={{
                                                                                                ...params.InputProps,
                                                                                                style: {
                                                                                                    height: "33px",
                                                                                                    fontSize: "14px"
                                                                                                },
                                                                                                type: "search",
                                                                                                disableUnderline: true,
                                                                                                disabled: state.agregar === "Consultar",
                                                                                                endAdornment: (
                                                                                                    <InputAdornment
                                                                                                        position="end">
                                                                                                        <IconButton
                                                                                                            padding="0px"
                                                                                                            style={{
                                                                                                                paddingRight: "0px",
                                                                                                            }}
                                                                                                            disabled={state.agregar === "Consultar"}
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
                                                                    {/* --------------------------------------- Correo ------------------------------------------------- */}
                                                                    <div className="col-sm-12 col-md-12 unit">

                                                                        <div className="input">
                                                                            <TextField variant="outlined" margin="dense"
                                                                                onChange={handleChange}
                                                                                className="form-control"
                                                                                type="email"
                                                                                required
                                                                                label="Correo Electrónico"
                                                                                value={state.correoRemitente}
                                                                                disabled={state.agregar === "Consultar"}
                                                                                id="correoRemitente"
                                                                            />
                                                                        </div>
                                                                    </div>
                                                                    {/* --------------------------------------- Telefono ------------------------------------------------- */}
                                                                    <div className="col-sm-12 col-md-12 unit">
                                                                        <div className="input">
                                                                            <TextField variant="outlined" margin="dense"
                                                                                onChange={handleChange}
                                                                                className="form-control"
                                                                                type="text"
                                                                                pattern="[0-9]{10}"
                                                                                maxLength="10"
                                                                                required
                                                                                label="Teléfono"
                                                                                value={state.telefonoRemitente}
                                                                                disabled={state.agregar === "Consultar"}
                                                                                id="telefonoRemitente"
                                                                            />
                                                                        </div>
                                                                    </div>
                                                                    {/* --------------------------------------- Contacto ------------------------------------------------- */}
                                                                    <div className="col-sm-12 col-md-12 unit">
                                                                        <div className="input">
                                                                            <TextField variant="outlined" margin="dense"
                                                                                onChange={handleChange}
                                                                                className="form-control"
                                                                                type="text"
                                                                                label="Contacto"
                                                                                required
                                                                                value={state.contactoRemitente}
                                                                                disabled={state.agregar === "Consultar"}
                                                                                id="contactoRemitente"
                                                                            />
                                                                        </div>
                                                                    </div>
                                                                    {/* --------------------------------------- Origen ------------------------------------------------- */}
                                                                    <div className="col-sm-12 col-md-12 unit">
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
                                                                                disabled={state.agregar === "Consultar"}
                                                                                id="origenRemitente"
                                                                                disableClearable
                                                                                forcePopupIcon={false}
                                                                                options={dataCiudad}
                                                                                getOptionLabel={(option) =>
                                                                                    option.m_sCiudad
                                                                                }
                                                                                style={{
                                                                                    transform: "translate(14px, 10px) scale(1) !important"
                                                                                }}
                                                                                renderInput={(params) => (
                                                                                    <div>
                                                                                        <TextField
                                                                                            label="Origen"
                                                                                            margin="dense"
                                                                                            variant="outlined"
                                                                                            required
                                                                                            {...params}
                                                                                            InputProps={{
                                                                                                ...params.InputProps,
                                                                                                style: {
                                                                                                    height: "33px",
                                                                                                    fontSize: "14px"
                                                                                                },
                                                                                                type: "search",
                                                                                                value: state.origenRemitente,
                                                                                                disabled: state.agregar === "Consultar",
                                                                                                disableUnderline: true,
                                                                                                endAdornment: (
                                                                                                    <InputAdornment
                                                                                                        position="end">
                                                                                                        <IconButton
                                                                                                            padding="0px"
                                                                                                            style={{
                                                                                                                paddingRight: "0px",
                                                                                                            }}
                                                                                                            disabled={state.agregar === "Consultar"}
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
                                                                    <div className="col-sm-12 col-md-12 unit">
                                                                        <div className="input">
                                                                            <Autocomplete
                                                                                value={state.zonaRemitente}
                                                                                freeSolo
                                                                                onChange={(event, newValue) => handleZonaRemitenteSelected(newValue)}
                                                                                id="zonaRemitente"
                                                                                disableClearable
                                                                                forcePopupIcon={false}
                                                                                options={dataZona.filter((z) => z.m_nIdSucursal == state.idSucursalAgregar)}
                                                                                disabled={state.agregar === "Consultar"}
                                                                                getOptionLabel={(option) => option.m_sDescripcion}
                                                                                variant="outlined"
                                                                                name={"zonaRemitente"}
                                                                                style={{
                                                                                    transform: "translate(14px, 10px) scale(1) !important"
                                                                                }}
                                                                                renderInput={(params) =>
                                                                                    <TextField
                                                                                        variant="outlined"
                                                                                        label="Zona"
                                                                                        margin="dense"
                                                                                        required
                                                                                        {...params}
                                                                                    />
                                                                                }
                                                                            />
                                                                        </div>
                                                                    </div>
                                                                    {/* --------------------------------------- RecoleccionDD ------------------------------------------------- */}
                                                                    <div className="col-sm-12 col-md-12 unit">
                                                                        <label className="checkbox">
                                                                            <input
                                                                                onChange={
                                                                                    handleRecoleccionCheckboxChange
                                                                                }
                                                                                className="form-control"
                                                                                disabled={state.agregar === "Consultar"}
                                                                                checked={state.diferenteRecoleccion}
                                                                                type="checkbox"
                                                                                style={{ height: "20px" }}
                                                                                id="diferenteRecoleccion"
                                                                            />
                                                                            <i />
                                                                            Recolección en Diferente Domicilio
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
                                                                <div className="col-sm-12 col-md-12    unit">
                                                                    <div className="input">
                                                                        <Autocomplete
                                                                            onChange={(event, newValue) => {
                                                                                handleSelectDestinatario(newValue)
                                                                            }}
                                                                            value={state.nombreDestinatario}
                                                                            disabled={state.agregar === "Consultar"}
                                                                            freeSolo


                                                                            id="nombreRemitente"
                                                                            disableClearable
                                                                            forcePopupIcon={false}
                                                                            options={dataRemitenteDestinatario}
                                                                            getOptionLabel={(option) =>
                                                                                option.m_sAlias + " (" + option.m_sNombre + ")"
                                                                            }
                                                                            variant="outlined"
                                                                            style={{
                                                                                transform: "translate(14px, 10px) scale(1) !important"
                                                                            }}
                                                                            renderInput={(params) => (
                                                                                <div>
                                                                                    <TextField
                                                                                        label="Nombre"
                                                                                        margin="dense"
                                                                                        variant="outlined"
                                                                                        required
                                                                                        {...params}
                                                                                        InputProps={{
                                                                                            ...params.InputProps,
                                                                                            style: {
                                                                                                height: "33px",
                                                                                                fontSize: "14px"
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
                                                                                                        disabled={state.agregar === "Consultar"}
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

                                                                <div className="col-sm-12 col-md-12 unit">
                                                                    <div className="input">
                                                                        <TextField variant="outlined" margin="dense"
                                                                            onChange={handleChange}
                                                                            className="form-control"
                                                                            type="text"
                                                                            label="RFC"
                                                                            pattern="[A-Z&Ñ]{3,4}[0-9]{2}(0[1-9]|1[012])(0[1-9]|[12][0-9]|3[01])[A-Z0-9]{2}[0-9A]"
                                                                            title="Favor de introducir un RFC válido."
                                                                            required
                                                                            fullWidth
                                                                            value={state.RFCDestinatario}
                                                                            disabled={state.agregar === "Consultar"}
                                                                            id="RFCDestinatario"
                                                                        />
                                                                    </div>
                                                                </div>

                                                                <div className="col-sm-12 col-md-12 unit">
                                                                    <div className="input">
                                                                        <TextField variant="outlined" margin="dense"
                                                                            onChange={handleChange}
                                                                            className="form-control"
                                                                            type="text"
                                                                            required
                                                                            label="Domicilio"
                                                                            value={state.domicilioDestinatario}
                                                                            disabled={state.agregar === "Consultar"}
                                                                            id="domicilioDestinatario"
                                                                        />
                                                                    </div>
                                                                </div>

                                                                <div className="col-sm-12 col-md-12  unit">
                                                                    <label className="input select">
                                                                        <FormControl fullWidth variant="outlined"
                                                                            margin="dense">
                                                                            <InputLabel
                                                                                id="ciudadDestinatarioLabel">Ciudad</InputLabel>
                                                                            <Select
                                                                                labelId="ciudadDestinatarioLabel"
                                                                                label="Ciudad"
                                                                                className="form-control"
                                                                                required
                                                                                value={state.ciudadDestinatario}
                                                                                disabled={state.agregar === "Consultar"}
                                                                                onChange={handleChangeCiudadDestinatario}
                                                                                //onSelect={ getAllCodigosPostales(state.ciudadDestinatario)}
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
                                                                            </Select>
                                                                        </FormControl>
                                                                        <i className="fa fa-arrow-down" />
                                                                    </label>
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
                                                                            disabled={state.agregar === "Consultar"}
                                                                            id="codigoPostalDestinatario"
                                                                            disableClearable
                                                                            options={dataCodigosPostalesDestinatario.filter((cp) => cp.m_nIdCiudad == state.ciudadDestinatario)}
                                                                            getOptionLabel={(option) => option.m_sCP}
                                                                            variant="outlined"
                                                                            style={{
                                                                                transform: "translate(14px, 10px) scale(1) !important"
                                                                            }}
                                                                            renderInput={(params) => (
                                                                                <div>
                                                                                    <TextField
                                                                                        required
                                                                                        variant="outlined"
                                                                                        label="Código Postal"
                                                                                        margin="dense"
                                                                                        {...params}
                                                                                        InputProps={{
                                                                                            ...params.InputProps,
                                                                                            style: {
                                                                                                height: "33px",
                                                                                                fontSize: "14px"
                                                                                            },
                                                                                            type: "search",
                                                                                            disableUnderline: true,
                                                                                            disabled: state.agregar === "Consultar",
                                                                                            endAdornment: (
                                                                                                <InputAdornment
                                                                                                    position="end">
                                                                                                    {" "}
                                                                                                    <IconButton
                                                                                                        style={{
                                                                                                            paddingRight: "0px",
                                                                                                        }}
                                                                                                        disabled={state.agregar === "Consultar"}
                                                                                                        onClick={() => {
                                                                                                            setState({
                                                                                                                ...state,
                                                                                                                identificadorModal:
                                                                                                                    "codigoPostalDestinatario",
                                                                                                                tipoModal: 7,
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
                                                                            id="correoDestinatario"
                                                                        />
                                                                    </div>
                                                                </div>

                                                                <div className="col-sm-12 col-md-12 unit">
                                                                    <div className="input">
                                                                        <TextField variant="outlined" margin="dense"
                                                                            onChange={handleChange}
                                                                            className="form-control"
                                                                            type="text"
                                                                            label="Teléfono"
                                                                            required
                                                                            value={state.telefonoDestinatario}
                                                                            disabled={state.agregar === "Consultar"}
                                                                            id="telefonoDestinatario"
                                                                        />
                                                                    </div>
                                                                </div>

                                                                <div className="col-sm-12 col-md-12 unit">
                                                                    <div className="input">
                                                                        <TextField variant="outlined" margin="dense"
                                                                            onChange={handleChange}
                                                                            className="form-control"
                                                                            type="text"
                                                                            required
                                                                            label="Contacto"
                                                                            value={state.contactoDestinatario}
                                                                            disabled={state.agregar === "Consultar"}
                                                                            id="contactoDestinatario"
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
                                                                                    destinoDestinatario: newValue,
                                                                                })
                                                                            }
                                                                            value={state.destinoDestinatario}
                                                                            disabled={state.agregar === "Consultar"}
                                                                            id="destinoDestinatario"
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
                                                                                        variant="outlined"
                                                                                        className="form-control"
                                                                                        label="Destino"
                                                                                        margin="dense"
                                                                                        {...params}
                                                                                        InputProps={{
                                                                                            ...params.InputProps,
                                                                                            style: {
                                                                                                height: "33px",
                                                                                                fontSize: "14px"
                                                                                            },
                                                                                            type: "search",
                                                                                            value: state.origenRemitente,
                                                                                            disabled: state.agregar === "Consultar",
                                                                                            disableUnderline: true,
                                                                                            endAdornment: (
                                                                                                <InputAdornment
                                                                                                    position="end">
                                                                                                    <IconButton
                                                                                                        padding="0px"
                                                                                                        style={{
                                                                                                            paddingRight: "0px",
                                                                                                        }}
                                                                                                        disabled={state.agregar === "Consultar"}
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

                                                                <div className="col-sm-12 col-md-12 unit">
                                                                    <div className="input">
                                                                        <Autocomplete
                                                                            value={state.zonaDestinatario}
                                                                            freeSolo
                                                                            onChange={(event, newValue) => handleZonaDestinatarioSelected(newValue)}
                                                                            id="zonaDestinatario"
                                                                            disableClearable
                                                                            forcePopupIcon={false}
                                                                            options={dataZona}
                                                                            disabled={state.agregar === "Consultar"}
                                                                            getOptionLabel={(option) => option.m_sDescripcion}
                                                                            variant="outlined"
                                                                            name={"zonaDestinatario"}
                                                                            style={{
                                                                                transform: "translate(14px, 10px) scale(1) !important"
                                                                            }}
                                                                            renderInput={(params) =>
                                                                                <TextField
                                                                                    variant="outlined"
                                                                                    label="Zona"
                                                                                    margin="dense"
                                                                                    required
                                                                                    {...params}
                                                                                />
                                                                            }
                                                                        />
                                                                    </div>
                                                                </div>

                                                                <div className="col-sm-12 col-md-12  unit">
                                                                    <label className="checkbox">
                                                                        <input
                                                                            onChange={handleEntregaCheckboxChange}
                                                                            className="form-control"
                                                                            disabled={state.agregar === "Consultar"}
                                                                            // value={state.diferenteEntrega}
                                                                            checked={state.diferenteEntrega}
                                                                            type="checkbox"
                                                                            style={{ height: "20px" }}
                                                                            id="diferenteEntrega"
                                                                        />
                                                                        <i />
                                                                        Entrega en Diferente Domicilio
                                                                    </label>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="col-md-5" id="paquetesSobres" >
                                            <div className="widget-wrap">


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
                                                                        color: "white"
                                                                    }}
                                                                    onClick={() => removePaquete()}
                                                                    disabled={state.agregar === "Consultar"}
                                                                >
                                                                    <i className="zmdi zmdi-minus"></i>
                                                                </a>
                                                                <input type="number" value={state.countPaquetes}
                                                                    style={{ width: "40px", textAlign: "center" }} />
                                                                <a
                                                                    className="btn"
                                                                    style={{
                                                                        margin: "5px",
                                                                        backgroundColor: "#F9A03E",
                                                                        color: "white"
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
                                                                color: "white"
                                                            }}
                                                            onClick={() => removeSobre()}
                                                            disabled={state.agregar === "Consultar"}
                                                        >
                                                            <i className="zmdi zmdi-minus" />
                                                        </a>
                                                        <input type="number" value={state.countSobres}
                                                            style={{ width: "40px", textAlign: "center" }} />

                                                        <a
                                                            className="btn"
                                                            style={{
                                                                margin: "10px",
                                                                backgroundColor: "#F9A03E",
                                                                color: "white"
                                                            }}
                                                            onClick={() => addSobre()}
                                                            disabled={state.agregar === "Consultar"}
                                                        >
                                                            <i className="zmdi zmdi-plus" />
                                                        </a>


                                                    </div>
                                                </div>


                                                <div className="widget-container">
                                                    <div className="widget-content">
                                                        <div className="row">
                                                            <div className="col-md-12">
                                                                <form className="j-forms">
                                                                    <div className="form-content">

                                                                        {state.agregar !== "Consultar" ?
                                                                            <div style={{
                                                                                display: "flex",
                                                                                alignItems: "flex-end"
                                                                            }}>
                                                                                <div className="input">
                                                                                    <input
                                                                                        onChange={(event) => {
                                                                                            setState({
                                                                                                ...state,
                                                                                                mismoPaquete: event.target.checked
                                                                                            })
                                                                                        }}
                                                                                        type="checkbox"
                                                                                        required
                                                                                        disabled={state.agregar === "Consultar"}
                                                                                        value={state.mismoPaquete}
                                                                                        id="mismoPaquete"
                                                                                    />
                                                                                </div>
                                                                                <label className="label"
                                                                                    style={{ paddingLeft: "10px" }}>Mismo
                                                                                Paquete</label>

                                                                            </div>
                                                                            : <span />}
                                                                        <Carousel
                                                                            className={classes.paqueteCarrusel}
                                                                            widgets={[IndicatorDots, Buttons]}
                                                                            frames={framesPaquete}
                                                                        />


                                                                        {state.agregar !== "Consultar" ?
                                                                            <div style={{
                                                                                display: "flex",
                                                                                alignItems: "flex-end"
                                                                            }}>

                                                                                <div className="input">
                                                                                    <input
                                                                                        onChange={(event) => {
                                                                                            setState({
                                                                                                ...state,
                                                                                                mismoSobre: event.target.checked
                                                                                            })
                                                                                        }}
                                                                                        type="checkbox"
                                                                                        required
                                                                                        value={state.mismoSobre}
                                                                                        id="mismoSobre"
                                                                                    />
                                                                                </div>
                                                                                <label className="label"
                                                                                    style={{ paddingLeft: "10px" }}>Mismo
                                                                                Sobre</label>
                                                                            </div>
                                                                            : <span />}
                                                                        <Carousel
                                                                            className={classes.sobreCarrusel}
                                                                            widgets={[IndicatorDots, Buttons]}
                                                                            frames={framesSobre}
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

                                    <div className="col-md-12">
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
                                                                    <div className="col-sm-6 col-md-4  unit">

                                                                        <div className="input">
                                                                            <TextField variant="outlined"
                                                                                       margin="dense"
                                                                                       onChange={handleChange}
                                                                                       className="form-control"
                                                                                       type="datetime-local"
                                                                                       label="Fecha y Hora"
                                                                                       InputLabelProps={{
                                                                                           shrink: true,
                                                                                       }}
                                                                                       value={state.fechaRecoleccion}
                                                                                       disabled={state.agregar === "Consultar"}
                                                                                       id="fechaRecoleccion"
                                                                                       required={state.diferenteRecoleccion}
                                                                            />
                                                                        </div>
                                                                    </div>

                                                                    <div className="col-sm-6 col-md-4  unit">
                                                                        <label className="input select">
                                                                            <FormControl fullWidth
                                                                                         variant="outlined"
                                                                                         margin="dense">
                                                                                <InputLabel
                                                                                    id="ciudadRecoleccionLabel">Ciudad</InputLabel>
                                                                                <Select
                                                                                    labelId="ciudadRecoleccionLabel"
                                                                                    label="Ciudad"
                                                                                    className="form-control"
                                                                                    required={state.diferenteRecoleccion}
                                                                                    value={state.ciudadRecoleccion}
                                                                                    disabled={state.agregar === "Consultar"}
                                                                                    onChange={handleChangeCiudadRecoleccion}
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
                                                                                </Select>
                                                                            </FormControl>
                                                                            <i className="fa fa-arrow-down" />
                                                                        </label>
                                                                    </div>

                                                                    <div className="col-sm-6 col-md-4  unit">

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
                                                                                options={dataCodigosPostalesRecoleccion.filter((cp) => cp.m_nIdCiudad == state.ciudadRecoleccion)}
                                                                                disabled={state.agregar === "Consultar"}
                                                                                getOptionLabel={(option) =>
                                                                                    option.m_sCP
                                                                                }
                                                                                required={state.diferenteRecoleccion}
                                                                                variant="outlined"
                                                                                style={{
                                                                                    transform: "translate(14px, 10px) scale(1) !important"
                                                                                }}
                                                                                renderInput={(params) => (
                                                                                    <div>
                                                                                        <TextField
                                                                                            variant="outlined"
                                                                                            label="Código Postal"
                                                                                            margin="dense"
                                                                                            className="form-control"
                                                                                            {...params}
                                                                                            InputProps={{
                                                                                                ...params.InputProps,
                                                                                                style: {
                                                                                                    height: "33px",
                                                                                                    fontSize: "14px"
                                                                                                },
                                                                                                type: "search",
                                                                                                disabled: state.agregar === "Consultar",
                                                                                                disableUnderline: true,
                                                                                                endAdornment: (
                                                                                                    <InputAdornment
                                                                                                        position="end">
                                                                                                        {" "}
                                                                                                        <IconButton
                                                                                                            style={{
                                                                                                                paddingRight: "0px",
                                                                                                            }}
                                                                                                            disabled={state.agregar === "Consultar"}
                                                                                                            onClick={() => {
                                                                                                                setState({
                                                                                                                    ...state,
                                                                                                                    identificadorModal:
                                                                                                                        "codigoPostalRecoleccion",
                                                                                                                    tipoModal: 8,
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

                                                                    <div className="col-sm-6 col-md-4 unit">

                                                                        <label className="input select">
                                                                            <FormControl fullWidth
                                                                                         variant="outlined"
                                                                                         margin="dense">
                                                                                <InputLabel
                                                                                    id="zonaRecoleccionLabel">Zona</InputLabel>
                                                                                <Select
                                                                                    labelId="zonaRecoleccionLabel"
                                                                                    label="Zona"
                                                                                    className="form-control"
                                                                                    required={state.diferenteRecoleccion}
                                                                                    value={state.zonaRecoleccion}
                                                                                    disabled={state.agregar === "Consultar"}
                                                                                    onChange={handleChangeZonaRecoleccion}
                                                                                    id="zonaRecoleccion"
                                                                                >
                                                                                    <option value="">Selecciona
                                                                                    </option>
                                                                                    {dataZona.map((zona) => (
                                                                                        <option
                                                                                            key={zona.m_nIdZona}
                                                                                            value={zona.m_nIdZona}
                                                                                        >
                                                                                            {zona.m_sDescripcion}
                                                                                        </option>
                                                                                    ))}
                                                                                </Select>
                                                                            </FormControl>
                                                                            <i className="fa fa-arrow-down" />
                                                                        </label>


                                                                    </div>

                                                                    <div className="col-sm-6 col-md-8  unit">

                                                                        <div className="input">
                                                                            <TextField variant="outlined"
                                                                                       margin="dense"
                                                                                       onChange={handleChange}
                                                                                       className="form-control"
                                                                                       type="text"
                                                                                       label="Domicilio"
                                                                                       value={state.domicilioRecoleccion}
                                                                                       disabled={state.agregar === "Consultar"}
                                                                                       id="domicilioRecoleccion"
                                                                                       required={state.diferenteRecoleccion}
                                                                            />
                                                                        </div>
                                                                    </div>

                                                                    <div className="col-sm-12 col-md-6  unit">

                                                                        <div className="input">
                                                                            <TextField variant="outlined"
                                                                                       margin="dense"
                                                                                       onChange={handleChange}
                                                                                       className="form-control"
                                                                                       type="text"
                                                                                       label="Recoger En"
                                                                                       value={state.recogerEn}
                                                                                       disabled={state.agregar === "Consultar"}
                                                                                       id="recogerEn"
                                                                                       required={state.diferenteRecoleccion}
                                                                            />
                                                                        </div>
                                                                    </div>

                                                                    <div className="col-sm-12 col-md-6  unit">

                                                                        <div className="input">
                                                                            <TextField variant="outlined"
                                                                                       margin="dense"
                                                                                       onChange={handleChange}
                                                                                       className="form-control"
                                                                                       type="text"
                                                                                       label="Datos Adicionales para la Recolección"
                                                                                       value={
                                                                                           state.datosAdicionalesRecoleccion
                                                                                       }
                                                                                       disabled={state.agregar === "Consultar"}
                                                                                       id="datosAdicionalesRecoleccion"
                                                                                       required={state.diferenteRecoleccion}
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
                                                                    <div className="col-sm-6 col-md-4  unit">
                                                                        <label className="input select">
                                                                            <FormControl fullWidth
                                                                                         variant="outlined"
                                                                                         margin="dense">
                                                                                <InputLabel
                                                                                    id="ciudadEntregaLabel">Ciudad</InputLabel>
                                                                                <Select
                                                                                    labelId="ciudadEntregaLabel"
                                                                                    label="Ciudad"
                                                                                    className="form-control"
                                                                                    required={state.diferenteEntrega}
                                                                                    value={state.ciudadEntrega}
                                                                                    disabled={state.agregar === "Consultar"}
                                                                                    onChange={handleChangeCiudadEntrega}
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
                                                                                </Select>
                                                                            </FormControl>
                                                                            <i className="fa fa-arrow-down" />
                                                                        </label>
                                                                    </div>

                                                                    <div className="col-sm-6 col-md-4  unit">

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
                                                                                options={dataCodigosPostalesEntrega.filter((cp) => cp.m_nIdCiudad == state.ciudadEntrega)}
                                                                                disabled={state.agregar === "Consultar"}
                                                                                getOptionLabel={(option) =>
                                                                                    option.m_sCP
                                                                                }
                                                                                required={state.diferenteEntrega}
                                                                                variant="outlined"
                                                                                style={{
                                                                                    transform: "translate(14px, 10px) scale(1) !important"
                                                                                }}
                                                                                renderInput={(params) => (
                                                                                    <div>
                                                                                        <TextField
                                                                                            variant="outlined"
                                                                                            label="Código Postal"
                                                                                            margin="dense"
                                                                                            className="form-control"
                                                                                            {...params}
                                                                                            InputProps={{
                                                                                                ...params.InputProps,
                                                                                                style: {
                                                                                                    height: "33px",
                                                                                                    fontSize: "14px"
                                                                                                },
                                                                                                type: "search",
                                                                                                disabled: state.agregar === "Consultar",
                                                                                                disableUnderline: true,
                                                                                                endAdornment: (
                                                                                                    <InputAdornment
                                                                                                        position="end">
                                                                                                        {" "}
                                                                                                        <IconButton
                                                                                                            style={{
                                                                                                                paddingRight: "0px",
                                                                                                            }}
                                                                                                            disabled={state.agregar === "Consultar"}
                                                                                                            onClick={() => {
                                                                                                                setState({
                                                                                                                    ...state,
                                                                                                                    identificadorModal:
                                                                                                                        "codigoPostalEntrega",
                                                                                                                    tipoModal: 9,
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

                                                                    <div className="col-sm-6 col-md-4 unit">
                                                                        <label className="input select">
                                                                            <FormControl fullWidth
                                                                                         variant="outlined"
                                                                                         margin="dense">
                                                                                <InputLabel
                                                                                    id="zonaEntregaLabel">Zona</InputLabel>
                                                                                <Select
                                                                                    labelId="zonaEntregaLabel"
                                                                                    label="Zona"
                                                                                    className="form-control"
                                                                                    required={state.diferenteEntrega}
                                                                                    value={state.zonaEntrega}
                                                                                    disabled={state.agregar === "Consultar"}
                                                                                    onChange={handleChangeZonaEntrega}
                                                                                    id="zonaEntrega"
                                                                                >
                                                                                    <option value="">Selecciona
                                                                                    </option>

                                                                                    {dataZona.map((zona) => (
                                                                                        <option
                                                                                            key={zona.m_nIdZona}
                                                                                            value={zona.m_nIdZona}
                                                                                        >
                                                                                            {zona.m_sDescripcion}
                                                                                        </option>
                                                                                    ))}
                                                                                </Select>
                                                                            </FormControl>
                                                                            <i className="fa fa-arrow-down" />
                                                                        </label>
                                                                    </div>

                                                                    <div
                                                                        className="col-sm-4 col-md-4 col-lg-4 unit">

                                                                        <div className="input">
                                                                            <TextField variant="outlined"
                                                                                       margin="dense"
                                                                                       onChange={handleChange}
                                                                                       className="form-control"
                                                                                       type="text"
                                                                                       label="Domicilio"
                                                                                       value={state.domicilioEntrega}
                                                                                       disabled={state.agregar === "Consultar"}
                                                                                       id="domicilioEntrega"
                                                                                       required={state.diferenteEntrega}
                                                                            />
                                                                        </div>
                                                                    </div>

                                                                    <div
                                                                        className="col-sm-4 col-md-4 col-lg-4 unit">

                                                                        <div className="input">
                                                                            <TextField variant="outlined"
                                                                                       margin="dense"
                                                                                       onChange={handleChange}
                                                                                       className="form-control"
                                                                                       type="text"
                                                                                       label="Entrega En"
                                                                                       value={state.entregaEn}
                                                                                       disabled={state.agregar === "Consultar"}
                                                                                       id="entregaEn"
                                                                                       required={state.diferenteEntrega}
                                                                            />
                                                                        </div>
                                                                    </div>

                                                                    <div
                                                                        className="col-sm-4 col-md-4 col-lg-4 unit">

                                                                        <div className="input">
                                                                            <TextField variant="outlined"
                                                                                       margin="dense"
                                                                                       onChange={handleChange}
                                                                                       className="form-control"
                                                                                       type="text"
                                                                                       label="Datos Adicionales para la Entrega"
                                                                                       value={
                                                                                           state.datosAdicionalesEntrega
                                                                                       }
                                                                                       disabled={state.agregar === "Consultar"}
                                                                                       id="datosAdicionalesEntrega"
                                                                                       required={state.diferenteEntrega}
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

                                            {/*{state.diferenteRecoleccion || state.diferenteEntrega ? (
                                                <div >



                                                </div>
                                            ) : (
                                                <div></div>
                                            )}*/}
                                        </div>

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
                                                                            disabled
                                                                            getOptionLabel={(option) =>
                                                                                option.m_sNombreCompleto
                                                                            }
                                                                            variant="outlined"
                                                                            style={{
                                                                                transform: "translate(14px, 10px) scale(1) !important"
                                                                            }}
                                                                            renderInput={(params) => (
                                                                                <div>
                                                                                    <TextField
                                                                                        variant="outlined"
                                                                                        label="Operador"
                                                                                        margin="dense"
                                                                                        className="form-control"
                                                                                        {...params}
                                                                                        InputProps={{
                                                                                            ...params.InputProps,
                                                                                            style: {
                                                                                                height: "33px",
                                                                                                fontSize: "14px"
                                                                                            },
                                                                                            type: "search",
                                                                                            disabled: state.agregar === "Consultar",
                                                                                            disableUnderline: true,
                                                                                            endAdornment: (
                                                                                                <InputAdornment
                                                                                                    position="end">
                                                                                                    <IconButton
                                                                                                        padding="0px"
                                                                                                        style={{
                                                                                                            paddingRight: "0px",
                                                                                                        }}
                                                                                                        disabled={state.agregar === "Consultar"}
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

                                                                    <div className="input">
                                                                        <Autocomplete
                                                                            freeSolo
                                                                            onChange={(event, newValue) => {
                                                                                console.log('tipoUnidad select: ', newValue)
                                                                                setState({
                                                                                    ...state,
                                                                                    tipoUnidad: newValue,
                                                                                })
                                                                            }

                                                                            }
                                                                            value={state.tipoUnidad}
                                                                            id="tipoUnidad"
                                                                            disableClearable
                                                                            forcePopupIcon={false}
                                                                            options={dataTipoUnidad}
                                                                            disabled
                                                                            getOptionLabel={(option) =>
                                                                                option.m_sTipoUnidad
                                                                            }
                                                                            variant="outlined"
                                                                            style={{
                                                                                transform: "translate(14px, 10px) scale(1) !important"
                                                                            }}
                                                                            renderInput={(params) => (
                                                                                <div>
                                                                                    <TextField
                                                                                        variant="outlined"
                                                                                        label="Tipo de Unidad"
                                                                                        margin="dense"
                                                                                        className="form-control"
                                                                                        {...params}
                                                                                        InputProps={{
                                                                                            ...params.InputProps,
                                                                                            style: {
                                                                                                height: "33px",
                                                                                                fontSize: "14px"
                                                                                            },
                                                                                            type: "search",
                                                                                            disabled: state.agregar === "Consultar",
                                                                                            disableUnderline: true,
                                                                                            endAdornment: (
                                                                                                <InputAdornment
                                                                                                    position="end">
                                                                                                    <IconButton
                                                                                                        padding="0px"
                                                                                                        style={{
                                                                                                            paddingRight: "0px",
                                                                                                        }}
                                                                                                        disabled={state.agregar === "Consultar"}
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
                                                                            disabled
                                                                            getOptionLabel={(option) =>
                                                                                option.m_sDescripcion
                                                                            }
                                                                            variant="outlined"
                                                                            style={{
                                                                                transform: "translate(14px, 10px) scale(1) !important"
                                                                            }}
                                                                            renderInput={(params) => (
                                                                                <div>
                                                                                    <TextField
                                                                                        variant="outlined"
                                                                                        label="Unidad"
                                                                                        margin="dense"
                                                                                        className="form-control"
                                                                                        {...params}
                                                                                        InputProps={{
                                                                                            ...params.InputProps,
                                                                                            style: {
                                                                                                height: "33px",
                                                                                                fontSize: "14px"
                                                                                            },
                                                                                            type: "search",
                                                                                            disabled: state.agregar === "Consultar",
                                                                                            disableUnderline: true,
                                                                                            endAdornment: (
                                                                                                <InputAdornment
                                                                                                    position="end">
                                                                                                    <IconButton
                                                                                                        padding="0px"
                                                                                                        style={{
                                                                                                            paddingRight: "0px",
                                                                                                        }}
                                                                                                        disabled={state.agregar === "Consultar"}
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
                                                                <div className="input">
                                                                    <TextField variant="outlined" margin="dense"
                                                                        onChange={handleChange}
                                                                        className="form-control"
                                                                        type="datetime-local"
                                                                        readOnly
                                                                        InputLabelProps={{
                                                                            shrink: true,
                                                                        }}
                                                                        label="Fecha y Hora"
                                                                        value={state.fechaHoraSalida}
                                                                        disabled={state.agregar === "Consultar"}
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
                                                                <div className="input">
                                                                    <TextField variant="outlined" margin="dense"
                                                                        onChange={handleChange}
                                                                        className="form-control"
                                                                        type="datetime-local"
                                                                        readOnly
                                                                        InputLabelProps={{
                                                                            shrink: true,
                                                                        }}
                                                                        label="Fecha y Hora"
                                                                        value={state.fechaHoraLlegada}
                                                                        disabled={state.agregar === "Consultar"}
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

                                    <div className="form-footer col-md-12">
                                        {/*<button
                                            onClick={(event) => { event.stopPropagation(); setState({ ...state, agregar: "Agregar" }); $('.nav-tabs li ').removeClass('active'); $('.nav-tabs li').eq(0).addClass('active'); $('.tab-content div ').removeClass('in show'); $('#Listado').addClass('in show'); }}
                                            className="btn btn-secondary secondary-btn"
                                        >
                                            Cancelar
                                        </button>*/}
                                        <button
                                            type="submit"
                                            className="btn btn-primary primary-btn"
                                            disabled={state.agregar === "Consultar"}
                                        >
                                            Aceptar
                                        </button>
                                    </div>

                                </div>
                            </form>
                        </div>

                        <div id="Cancelar" className="tab-pane fade">
                            <div className="widget-wrap">
                                <div className="widget-container">
                                    <div className="widget-content">
                                        <div className="row">
                                            <form className="j-forms" onSubmit={handleCancelar}>
                                                <div className="form-content">

                                                    <div className="col-sm-6 col-md-2-5 col-lg-2-5 unit">
                                                        <div className="input">
                                                            <TextField variant="outlined" margin="dense"
                                                                onChange={handleChange}
                                                                className="form-control"
                                                                type="text"
                                                                label="Folio Recolección"
                                                                value={state.folioRecoleccion}
                                                                id="folioRecoleccion"
                                                                readOnly
                                                            />
                                                        </div>
                                                    </div>

                                                    <div className="col-sm-6 col-md-2-5 col-lg-2-5 unit">
                                                        <div className="input">
                                                            <TextField variant="outlined" margin="dense"
                                                                onChange={handleChange}
                                                                className="form-control"
                                                                type="text"
                                                                label="Sucursal"
                                                                value={state.sucursalCancelacion}
                                                                id="sucursalCancelacion"
                                                                readOnly
                                                            />
                                                        </div>
                                                    </div>

                                                    <div className="col-sm-6 col-md-2-5 col-lg-2-5 unit">
                                                        <div className="input">
                                                            <TextField variant="outlined" margin="dense"
                                                                onChange={handleChange}
                                                                className="form-control"
                                                                type="text"
                                                                label="Fecha"
                                                                value={state.mostrarFechaCancelacion}
                                                                id="mostrarFechaCancelacion"
                                                                readOnly
                                                            />
                                                        </div>
                                                    </div>

                                                    <div className="col-sm-6 col-md-2-5 col-lg-2-5 unit">
                                                        <div className="input">
                                                            <TextField variant="outlined" margin="dense"
                                                                onChange={handleChange}
                                                                className="form-control"
                                                                type="text"
                                                                label="Usuario"
                                                                value={state.usuario}
                                                                id="usuario"
                                                                readOnly
                                                            />
                                                        </div>
                                                    </div>

                                                    <div className="col-sm-6 col-md-2-5 col-lg-2-5 unit">
                                                        <div className="input">
                                                            <TextField variant="outlined" margin="dense"
                                                                onChange={handleChange}
                                                                className="form-control"
                                                                type="text"
                                                                label="Estatus"
                                                                value={state.estatusRecoleccion}
                                                                id="estatusRecoleccion"
                                                                readOnly
                                                            />
                                                        </div>
                                                    </div>

                                                    <div className="col-sm-12 col-md-12 col-lg-12 unit">
                                                        <div className="input">
                                                            <TextField variant="outlined" margin="dense"
                                                                onChange={handleChange}
                                                                className="form-control"
                                                                type="text"
                                                                label="Motivo"
                                                                value={state.motivoCancelacion}
                                                                id="motivoCancelacion"
                                                            />
                                                        </div>
                                                    </div>

                                                    <div className="form-footer col-md-12">
                                                        {/*<button
                                                            onClick={(event) => { event.stopPropagation(); setState({ ...state, agregar: "Agregar" }); $('.nav-tabs li ').removeClass('active'); $('.nav-tabs li').eq(0).addClass('active'); $('.tab-content div ').removeClass('in show'); $('#Listado').addClass('in show'); }}

                                                            className="btn btn-secondary secondary-btn"
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

                        <div id="Salida-Llegada" className="tab-pane fade">
                            <div className="widget-wrap">
                                <div className="widget-container">
                                    <div className="widget-content">
                                        <div className="row">
                                            <form className="j-forms" onSubmit={handleCancelar}>
                                                <div className="form-content">

                                                    <div className="col-sm-6 col-md-3 col-lg-3 unit">
                                                        <div className="input">
                                                            <TextField variant="outlined" margin="dense"
                                                                className="form-control"
                                                                type="text"
                                                                label="Sucursal"
                                                                value={state.sucursalCancelacion}
                                                                id="sucursalCancelacion"
                                                                name="sucursalCancelacion"
                                                                disabled
                                                            />
                                                        </div>
                                                    </div>

                                                    <div className="col-sm-6 col-md-3 col-lg-3 unit">
                                                        <div className="input">
                                                            <TextField variant="outlined" margin="dense"
                                                                className="form-control"
                                                                type="text"
                                                                label="Folio Recolección"
                                                                value={state.folioRecoleccion}
                                                                id="folioRecoleccion"
                                                                name="folioRecoleccion"
                                                                disabled
                                                            />
                                                        </div>
                                                    </div>

                                                    <div className="col-sm-6 col-md-3 col-lg-3 unit">
                                                        <div className="input">
                                                            <TextField variant="outlined" margin="dense"
                                                                       className="form-control"
                                                                       type="text"
                                                                       label="Fecha Elaboracion"
                                                                       value={state.fechaHoraCreacion}
                                                                       id="fechaHoraCreacion"
                                                                       name="fechaHoraCreacion"
                                                                       disabled
                                                            />
                                                        </div>
                                                    </div>

                                                    <div className="col-sm-6 col-md-3 col-lg-3 unit">
                                                        <div className="input">
                                                            <TextField variant="outlined" margin="dense"
                                                                       className="form-control"
                                                                       type="text"
                                                                       label="Fecha Recoleccion"
                                                                       value={state.fechaRecoleccion}
                                                                       id="fechaRecoleccion"
                                                                       name="fechaRecoleccion"
                                                                       disabled
                                                            />
                                                        </div>
                                                    </div>

                                                    <div className="col-sm-6 col-md-6 col-lg-6 unit">
                                                        <div className="input">
                                                            <TextField variant="outlined" margin="dense"
                                                                       className="form-control"
                                                                       type="text"
                                                                       label="Zona"
                                                                       value={state.zonaRecoleccion}
                                                                       id="zonaRecoleccion"
                                                                       name="zonaRecoleccion"
                                                                       disabled
                                                            />
                                                        </div>
                                                    </div>

                                                    <div className="col-sm-6 col-md-6 col-lg-6 unit">
                                                        <div className="input">
                                                            <TextField variant="outlined" margin="dense"
                                                                       className="form-control"
                                                                       type="text"
                                                                       label="Recoger En"
                                                                       value={state.recogerEn}
                                                                       id="recogerEn"
                                                                       name="recogerEn"
                                                                       disabled
                                                            />
                                                        </div>
                                                    </div>

                                                    <div className="col-sm-12 col-md-6 col-lg-6 unit">
                                                        <div className="input">
                                                            <TextField variant="outlined" margin="dense"
                                                                       className="form-control"
                                                                       type="text"
                                                                       label="Operador"
                                                                       value={state.operador ? state.operador.m_sNombreCompleto : ""}
                                                                       id="operador"
                                                                       name="operador"
                                                                       disabled
                                                            />
                                                        </div>
                                                    </div>

                                                    <div className="col-sm-12 col-md-6 col-lg-6 unit">
                                                        <div className="input">
                                                            <TextField variant="outlined" margin="dense"
                                                                       className="form-control"
                                                                       type="text"
                                                                       label="Estatus"
                                                                       value={''}
                                                                       id="estatusOperador"
                                                                       name="estatusOperador"
                                                                       disabled
                                                            />
                                                        </div>
                                                    </div>

                                                    <div className="col-sm-12 col-md-6 col-lg-6 unit">
                                                        <div className="input">
                                                            <TextField variant="outlined" margin="dense"
                                                                       className="form-control"
                                                                       type="text"
                                                                       label="Unidad"
                                                                       value={state.unidad ? state.unidad.m_sDescripcion : ""}
                                                                       id="unidad"
                                                                       name="unidad"
                                                                       disabled
                                                            />
                                                        </div>
                                                    </div>

                                                    <div className="col-sm-12 col-md-6 col-lg-6 unit">
                                                        <div className="input">
                                                            <TextField variant="outlined" margin="dense"
                                                                       className="form-control"
                                                                       type="text"
                                                                       label="Estatus"
                                                                       value={''}
                                                                       id="estatusUnidad"
                                                                       name="estatusUnidad"
                                                                       disabled
                                                            />
                                                        </div>
                                                    </div>

                                                    <div className="col-sm-12 col-md-6 col-lg-6 unit">
                                                        <div className="input">
                                                            <TextField variant="outlined" margin="dense"
                                                                       className="form-control"
                                                                       type="text"
                                                                       label="Remolque"
                                                                       value={''}
                                                                       id="remolqueSalida"
                                                                       name="remolqueSalida"
                                                                       disabled
                                                            />
                                                        </div>
                                                    </div>

                                                    <div className="col-sm-12 col-md-3 col-lg-3 unit">
                                                        <div className="input">
                                                            <TextField variant="outlined" margin="dense"
                                                                       className="form-control"
                                                                       type="text"
                                                                       label="Estatus"
                                                                       value={''}
                                                                       id="estatusRemolque"
                                                                       name="estatusRemolque"
                                                                       disabled
                                                            />
                                                        </div>
                                                    </div>

                                                    <div className="col-sm-12 col-md-3 col-lg-3 unit">
                                                        <div className="input">
                                                            <TextField variant="outlined" margin="dense"
                                                                       className="form-control"
                                                                       type="text"
                                                                       label="Cargado"
                                                                       value={''}
                                                                       id="cargado"
                                                                       disabled
                                                            />
                                                        </div>
                                                    </div>

                                                    <div className="col-sm-12 col-md-4 col-lg-4 unit">
                                                        <div className="input">
                                                            <TextField variant="outlined" margin="dense"
                                                                       className="form-control"
                                                                       type="text"
                                                                       label="Fecha Salida"
                                                                       value={''}
                                                                       id="fechaSalida"
                                                                       name="fechaSalida"
                                                                       disabled={true}
                                                            />
                                                        </div>
                                                    </div>

                                                    {/*<div className="form-footer" className="col-md-12">
                                                        <button
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
                                                    </div>*/}
                                                </div>
                                            </form>
                                        </div>

                                    </div>
                                </div>
                            </div>
                        </div>

                        <div id="Prueba" className="tab-pane fade">
                            <div className="widget-wrap">
                                <div className="widget-container">
                                    <div className="widget-content">
                                        <div className="row">
                                            <div className="form-content" style={{ display: "flex" }}>
                                                <input type="file" id="archivoFormato" onChange={changeHandler} />
                                                <div>
                                                    <button onClick={handleSubmission} disabled={!isFilePicked}>Submit
                                                    </button>
                                                </div>
                                            </div>
                                            <article>
                                                <h2><a>Hello World</a></h2>
                                                <div
                                                    dangerouslySetInnerHTML={{ __html: state.uploadedFileContent }}></div>
                                            </article>
                                        </div>
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
