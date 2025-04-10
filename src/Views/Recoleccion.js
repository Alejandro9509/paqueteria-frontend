import React, {useEffect, useState} from "react";
import axios from "axios";
import Cabecera from "../Components/Template/Cabecera";
import BarraLateralIzquierda from "../Components/Template/BarraLateralIzquierda";
import { styled } from "@mui/material/styles";
import TextField from "@mui/material/TextField";
import { DataGrid} from '@mui/x-data-grid';
import InputAdornment from "@mui/material/InputAdornment";
import SvgIcon from "@mui/material/SvgIcon";
import {ReactComponent as Activo} from "../iconos/Menu/palomita.svg";
import {ReactComponent as NoActivo} from "../iconos/Menu/cruz.svg";
import {
    useTable,
    useFilters,
    useSortBy,
} from "react-table";
import $ from "jquery";
import {getAddressFormated, getCurrentDateTime, validarDerecho} from "../Util/Util"
import {useHistory, Redirect} from 'react-router-dom';
import {confirmAlert} from 'react-confirm-alert'; // Import
import 'react-confirm-alert/src/react-confirm-alert.css'; // Import css
import {obtenerParametrosConfiguracion} from "../Util/Contexts/ParametrosConfiguracionContext";
import Noty from 'noty';
import {
    Button,
    Chip,
    Dialog,
    DialogActions,
    DialogContent,
    FormControl,
    Grid,
    InputLabel, MenuItem,
    Select,
    Tooltip
} from "@mui/material";
import {API_HEADERS, dataGridLocaleText} from "../Constants";
import {obtenerCiudades} from "../Util/Contexts/CiudadesContext";

import {
    obtenerRemitentesDestinatarios
} from "../Util/Contexts/RemitenteDestinatarioContext";
import {obtenerEmbalajes, obtenerEmbalajesId} from "../Util/Contexts/EmbalajesContext";
import {obtenerEstatusRecoleccion} from "../Util/Contexts/EstatusContext";
import {obtenerMonedas} from "../Util/Contexts/MonedaContext";
import {
    agregarRecoleccion,
    modificarRecoleccion,
    obtenerRecoleccionCancelada,
    cancelarRecoleccion,
    eliminarRecoleccion,
    obtenerRecoleccionId,
    obtenerRecoleccionFiltro
} from "../Util/Contexts/RecoleccionContext";
import {obtenerUnidadesTipo} from "../Util/Contexts/UnidadesContext";
import {validarPermisos} from "../Util/Contexts/UsuarioContext";
import {obtenerTipoCambio} from "../Util/Contexts/TipoCambioContext";
import {obtenerSucursales} from "../Util/Contexts/SucursalContext";
import {obtenerTipoCobro} from "../Util/Contexts/TipoCobroContext";
import {
   
    obtenerFormatosImpresionProceso, imprimirFormatosIdIdTipoReporte
} from "../Util/Contexts/FormatosImpresionContext";
import {obtenerClienteId} from "../Util/Contexts/ClientesContext";
import {obtenerProductoById} from "../Util/Contexts/ProductosContext";
import ConfirmarUbicacion from "../Components/Map/ConfirmarUbicacion";
import Paquetes from "./Paquetes/Paquetes";
import {obtenerMunicipiosByIdEstado} from "../Util/Contexts/MunicipiosContext";
import {obtenerAllEstados} from "../Util/Contexts/EstadosContext";
import {obtenerByIdZonaOperativa, obtenerZonaOperativaByIdCodigoPostal} from "../Util/Contexts/ZonaOperativaContext";
import {obtenerFechaInicio, obtenerFechaFinal} from "../Util/Contexts/UtileriasContext";
import DialogTableClientes from "./Clientes/DialogTableClientes";
import RemitentesDestinatarios from "./RemitentesDestinatarios";
import ComplementosSAT from "./SAT/ComplementosSAT";
import Filtros from "./Filtros/Filtros";
import Citas from "./Citas/Citas";
import Cotizador from "./ConceptosFacturacion/Cotizador";
import DiferenteDomicilioForm from "./DiferenteDomicilio/DiferenteDomicilioForm";
import Evidencias from "./Evidencias";
import ImportarEmbarques from "./Embarque/ImportarEmbarques";

const PREFIX = 'Recoleccion';

const classes = {
    myComponent: `${PREFIX}-myComponent`,
    paqueteCarrusel: `${PREFIX}-paqueteCarrusel`,
    sobreCarrusel: `${PREFIX}-sobreCarrusel`,
    seleccionado: `${PREFIX}-seleccionado`,
    noSeleccionado: `${PREFIX}-noSeleccionado`,
    disabled: `${PREFIX}-disabled`
};

const Root = styled('div')({
    [`& .${classes.myComponent}`]: {
        "& .MuiIconButton-root": {
            padding: 0,
        },
    },
    [`& .${classes.paqueteCarrusel}`]: {
        height: "280px !important",
    },
    [`& .${classes.sobreCarrusel}`]: {
        height: "70px !important",
    }, [`& .${classes.seleccionado}`]: {
        backgroundColor: "#FCC88F",
    },
    [`& .${classes.noSeleccionado}`]: {
        backgroundColor: "#FFFFFF",
    },
    [`& .${classes.disabled}`]: {
        pointerEvents: "none",
        cursor: "default",
    }
});

let timer;

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
        type: "error",
        layout: "topCenter",
        text: mensaje,
        timeout: "3000",
    }).show();
}

window.jQuery = window.$ = $;

const TIPOS_SEGURO = {
    CON_POLIZA: 1,
    NO_ASEGURA: 2,
    SEGUN_SOLICITA: 3,
    OBLIGATORIO: 4,
    SIN_ASIGNAR: 5
}

const FORMATOS_IMPRESION = {
    RECOLECCION: 210
}

function Recoleccion() {

    const today = new Date();
    const [detectarModificaciones,setDetectar]=React.useState(false)
    const [redirect, setRedirect] = React.useState(false);
    const [data, setData] = React.useState([]);
    const [dataSucursal, setDataSucursal] = React.useState([]);
    const [dataEstatusRecoleccion, setEstatusRecoleccion] = React.useState([]);
    const [dataTipoMoneda, setDataTipoMoneda] = React.useState([]);
    const [dataTipoCambio, setDataTipoCambio] = React.useState([]);
    const [dataFechaFinal, ] = React.useState([]);
    const [dataFechaInicial, ] = React.useState([]);
    const [dataComplementosSAT, setDataComplementosSAT] = React.useState([])
    const [dataTipoCobro, setDataTipoCobro] = React.useState([]);
    const [dataCiudad, setDataCiudad] = React.useState([]);
    const [seguroClienteActual,setDataSeguroClienteActual]=useState({
        idTipoSeguro: TIPOS_SEGURO.SIN_ASIGNAR,
        porcentajeSeguro: 0,
        aplicaSeguro: false,
    })
    const [dataConceptos, setDataConceptos] = useState([])
    const [, setDataZona] = React.useState([]);
    const [dataFolioRecoleccion, ] = React.useState([]);

    const [dataCodigosPostalesRemitente, ] = React.useState([]);
    const [dataCodigosPostalesDestinatario, ] = React.useState([]);
    const [dataCodigosPostalesRecoleccionDD, ] = React.useState([]);
    const [dataCodigosPostalesEntregaDD, ] = React.useState([]);


    const [dataRemitenteDestinatario, setDataRemitenteDestinatario] = React.useState([]);
    const [, setDataEmbalaje] = React.useState([]);
    const [dataOperador, ] = React.useState([]);
    const [dataTipoUnidad, ] = React.useState([]);
    const [dataUnidad, setDataUnidad] = React.useState([]);
    //error en zona operativa y zona tarifa
    const [repetirConceptos,setRepetirConceptos] = React.useState(false)

    const [, setSortModel] = React.useState([
        {
            field: 'm_sFechaHora',
            sort: 'asc',
        },
    ]);


    const [dataTiposSeguro, setDataTiposSeguro] = useState([])
    const [dataPaquetes, setDataPaquetes] = useState([])
    const [dataEstados, setDataEstados] = useState([])
    const [, setDataMunicipiosRecoleccionDD] = useState([])
    const [, setDataMunicipiosEntregaDD] = useState([])
    const [dataRecoleccionConsulta, setDataRecoleccionConsulta] = useState();
    const [tabActiva, setTabActiva] = useState(0);
    const [, setIsAgregar] = useState(false);
    const [, setIsModificar] = useState(false);
    const [pagina, setPagina] = useState(0);
    const [errores,setErrores] = React.useState([])
    const [configuraciones, setConfiguraciones] = React.useState({
        estatusRecoleccion: 0,
        estatusEmbarque: 0,
        monedaPredeterminadaEmbarque: 0,
        tipoCambioEmbarque: 0,
        estatusGuia: 0,
        tipoTarifa: 0,
        cobrarCita: false,
        costoCita: "0",
        detectarTipoCobro: false,
        tipoCobro:0,
        limpiarProducto: false,
        idsTiposCobroSeleccionArray: [],
        idsTiposCobroSeleccionString: '',
        idConceptoFlete: 0,
        factorConversion: 0.0,
        fijarCapturaValorDeclarado: false,
        porcentualSeguroDefecto:0
    })
    const [state, setState] = React.useState({
        // ===VARIABLES DE LISTADO===
        idRecoleccion: 0,
        valorDeclarado: 0,
        idTipoSeguro:5,
        porcentajeSeguro: 0,
        // ===VARIABLES DE CANCELAR===
        sucursalCancelacion: '',
        mostrarFechaCancelacion: '',
        usuario: localStorage.getItem("Usuario"),
        // estatusRecoleccion: '', Se usa en agregar tambien
        motivoCancelacion: '',
        mostrarCotizador:false,
        // ==VARIABLES DE LLEGADA/SALIDA===
        fechaHoraCreacion: today.getDate() + "/" + (today.getMonth() + 1) + "/" + today.getFullYear() + " " + today.getHours() + ":" + today.getMinutes(),
   

        // ===VARIABLES DE AGREGAR===
        idSucursalAgregar: localStorage.getItem("Sucursal"),
        folioRecoleccion: '',
        folioEmbarque: '',
        folioGuia: '',
        folioInforme: '',
        fechaHoraRegistro:getCurrentDateTime(),
        estatusRecoleccion: '',
        moneda: '',
        tipoCambio: '',
        tipoCobro: '',
        clientePaga: {},
        observaciones: '',
        aplicaEntrega:false,
        // deshabilitarDiferenteDomicilio:false,
        //Paquetes/Sobres
        countPaquetes: 1,
        countSobres: 1,
        mismoPaquete: false,
        mismoSobre: false,
        sobres: [
            {
                m_sDescripcion: "",
                m_nTipo: 2,
            },
        ],

        //Cita de recoleccion
        recoleccionConCita: false,
        fechaCita: '',
        horaCitaMinima: '',
        horaCitaMaxima: '',
        citaPendiente:false,

        //Entrega
        diferenteEntrega: false,
        entregaEnSucursal: false,
        idSucursalEntrega: "",
        zonaOperativaSucursal: null,

        //Recoleccion
        diferenteRecoleccion: false,

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
        recoleccionConEmbarque: false,
        receptorRecoleccion: '',
        setOpenDialogEvidencias: false,
        referencia: '',
    });
    const [remitente, setRemitente] = useState({
        idRemitente: '',
        aliasRemitente: '',
        nombreRemitente: '',
        RFCRemitente: '',
        domicilioRemitente: '',
        calleRemitente: '',
        numeroIntRemitente: '0',
        numeroExtRemitente: '',
        coloniaRemitente: '',
        paisTexto: '',
        estadoRemitente: '',
        municipioRemitente: '',
        codigoPostalRemitente: '',
        correoRemitente: '',
        telefonoRemitente: '',
        contactoRemitente: '',
        origenRemitente: '',
        zonaOperativaRemitente: '',
        zonaTarifaRemitente: '',
        latitudR: 0,
        longitudR: 0
    })

    const handleChangeRemitente = (data) => {
        setRemitente({
            idRemitente: data.id,
            aliasRemitente: data.alias,
            nombreRemitente: data.nombre,
            RFCRemitente: data.RFC,
            domicilioRemitente: data.domicilio,
            calleRemitente: data.calle,
            numeroIntRemitente: data.numeroInt,
            numeroExtRemitente: data.numeroExt,
            coloniaRemitente: data.colonia,
            estadoRemitente: data.estado,
            estadoTexto: data.estadoTexto,
            paisTexto: data.paisTexto,
            municipioTexto:data.municipioTexto,
            municipioRemitente: data.municipio,
            codigoPostalRemitente: data.codigoPostal,
            correoRemitente: data.correo,
            telefonoRemitente: data.telefono,
            contactoRemitente: data.contacto,
            origenRemitente: data.origen,
            zonaOperativaRemitente: data.zonaOperativa,
            zonaTarifaRemitente: data.zonaTarifa,
            latitudR: data.latitud,
            longitudR: data.longitud
        })
    };



    const [destinatario, setDestinatario] = useState({
        idDestinatario: '',
        aliasDestinatario: '',
        nombreDestinatario: '',
        RFCDestinatario: '',
        domicilioDestinatario: '',
        calleDestinatario: '',
        numeroIntDestinatario: '0',
        numeroExtDestinatario: '',
        coloniaDestinatario: '',
        estadoDestinatario: '',
        municipioDestinatario: '',
        codigoPostalDestinatario: '',
        correoDestinatario: '',
        telefonoDestinatario: '',
        contactoDestinatario: '',
        destinoDestinatario: '',
        zonaOperativaDestinatario: '',
        zonaTarifaDestinatario: '',
        latitudD: 0,
        longitudD: 0
    })

    const handleChangeDestinatario = (data) => {
        setDestinatario({
            idDestinatario: data.id,
            aliasDestinatario: data.alias,
            nombreDestinatario: data.nombre,
            RFCDestinatario: data.RFC,
            domicilioDestinatario: data.domicilio,
            calleDestinatario: data.calle,
            numeroIntDestinatario: data.numeroInt,
            numeroExtDestinatario: data.numeroExt,
            coloniaDestinatario: data.colonia,
            estadoDestinatario: data.estado,
            municipioDestinatario: data.municipio,
            codigoPostalDestinatario: data.codigoPostal,
            correoDestinatario: data.correo,
            telefonoDestinatario: data.telefono,
            contactoDestinatario: data.contacto,
            destinoDestinatario: data.destino,
            zonaOperativaDestinatario: data.zonaOperativa,
            zonaTarifaDestinatario: data.zonaTarifa,
            latitudD: data.latitud,
            longitudD: data.longitud
        })
    };

    const [entregaDD, setEntregaDD] = useState({
        idPais: '',
        idEstado: '',
        idMunicipio: '',
        codigoPostal: '',
        zonaOperativa: '',
        domicilio: '',
        detalles: '',
        datosAdicionales: '',
        latitud: '',
        longitud: ''
    })

    const resetEntregaDD = () => {
        setEntregaDD({
            idPais: '',
            idEstado: '',
            idMunicipio: '',
            codigoPostal: '',
            zonaOperativa: '',
            domicilio: '',
            detalles: '',
            datosAdicionales: '',
            latitud: '',
            longitud: ''
        })
    }


    const [recoleccionDD, setRecoleccionDD] = useState({
        idPais: '',
        pais: '',
        idEstado: '',
        estado: '',
        idMunicipio: '',
        municipio: '',
        codigoPostal: '',
        zonaOperativa: '',
        domicilio: '',
        detalles: '',
        datosAdicionales: '',
        latitud: '',
        longitud: ''
    })

    const resetRecoleccionDD = () => {
        setRecoleccionDD({
            idPais: '',
            pais: '',
            idEstado: '',
            estado: '',
            idMunicipio: '',
            municipio: '',
            codigoPostal: '',
            zonaOperativa: '',
            domicilio: '',
            detalles: '',
            datosAdicionales: '',
            latitud: '',
            longitud: ''
        })
    }

    const getAllEstados = () => {
        obtenerAllEstados().then((respuesta) => {
            setDataEstados(respuesta.data);
        });
    }

    const history = useHistory()

    useEffect(() => {
        if (state.tipoUnidad !== 0 && state.tipoUnidad !== '') {
            getAllUnidades(state.tipoUnidad.m_nIdTipoUnidad);
        }
    }, [state.tipoUnidad])
    
    useEffect(() => {
        if (
            localStorage.getItem("UsuarioId") === null ||
            localStorage.getItem("UsuarioId") <= 0
        ) {
            showSuccess("Es necesario iniciar sesion para acceder a este proceso");
            window.location.replace("login");
            return;
        }
        getDataParaListado()
    }, []);

    const getDataParaListado = () => {
        getAllSucursales();
        getAllEstatusRecoleccion()
    }

    const getDataParaEditar = (operacion) => {
        getAllSucursales();
        getAllTipoCobro();
        getAllTipoMoneda();
        getTipoCambio()
        getAllCiudades()
        getAllTiposSeguro()
        getAllEstados()
        getAllEstatusRecoleccion()
        getParametrosConfiguracion(operacion)
    }

    async function getParametrosConfiguracion(operacion) {
        obtenerParametrosConfiguracion().then(respuesta => {
            if (operacion === "Agregar"){
                setState((config) => {
                    return {
                        ...config,
                        estatusRecoleccion: respuesta.data.EstatusRecoleccion,
                        moneda: respuesta.data.MonedaEmbarque,
                        tipoCambio: respuesta.data.TipoCambioEmbarque,
                        tipoCobro: respuesta.data.TipoCobro,
                        porcentualSeguroDefecto:respuesta.data.PorcentualSeguroDefecto
                    }
                })
            }
            setConfiguraciones((config) => {
                return {
                    ...config,
                    estatusRecoleccion: respuesta.data.EstatusRecoleccion,
                    estatusEmbarque: respuesta.data.EstatusEmbarque,
                    monedaPredeterminadaEmbarque: respuesta.data.MonedaEmbarque,
                    tipoCambioEmbarque: respuesta.data.TipoCambioEmbarque,
                    estatusGuia: respuesta.data.EstatusGuia,
                    tipoTarifa: respuesta.data.TipoTarifaTarifas,
                    cobrarCita: respuesta.data.esCobro,
                    costoCita: respuesta.data.CobroCitaTarifas || 0,
                    detectarTipoCobro: respuesta.data.DetectarTipoCobro,
                    limpiarProducto: respuesta.data.LimpiarProducto,
                    tipoCobro: respuesta.data.TipoCobro,
                    idsTiposCobroSeleccionString: respuesta.data.TiposCobroActivos,
                    idsTiposCobroSeleccionArray: respuesta.data.TiposCobroActivos ? respuesta.data.TiposCobroActivos.split(',') : [],
                    idConceptoFlete: respuesta.data.IdConceptoFlete || 0,
                    factorConversion: respuesta.data.FactorConversion || 0.0,
                    fijarCapturaValorDeclarado: respuesta.data.FijarCapturaValorDeclarado,
                    porcentualSeguroDefecto:respuesta.data.PorcentualSeguroDefecto
                }
            })
        })
    }

    const handleClickRemitenteDestinatario = (event) => {
        event.preventDefault()
        if (dataRemitenteDestinatario.length === 0) {
            getAllRemitentesDestinatarios()
        }
    }

    const isValidText = (data) => {
        return !(data.length === 0 || data === '0')
    }

    const validarCoordenadas = (coordenadas) => {
        /**Si es modificacion*/
        if (state.idRecoleccion !== 0){
            /**Si es recoleccion diferente domicilio y no hay coordenadas guardadas*/
            if(state.diferenteRecoleccion
                && coordenadas==undefined)
            {
                mostrarDialogoMapa(true)

                return false
            }else if (!state.diferenteRecoleccion
                && !isValidText(remitente.latitudR)
                && !isValidText(remitente.longitudR)
                && !coordenadas) {
                mostrarDialogoMapa(true)

                return false
            }
            /**Si es agregar*/
        }else{
            /**Si es entrega diferente domicilio y no hay coordenadas guardadas*/
            if (state.diferenteRecoleccion && coordenadas==undefined ){
                mostrarDialogoMapa(true)

                return false
                /**Si es recoleccion en el domicilio del remitente y no hay coordenadas*/
            }else if (!state.diferenteRecoleccion
                && !isValidText(remitente.latitudR)
                && !isValidText(remitente.longitudR)
                && !coordenadas){
                mostrarDialogoMapa(true)

                return false
            }
        }
        return true
    }

    const mostrarDialogoMapa = (isVisible) => {
        setState(state=>{
            return {
                ...state,
                showConfirmarUbicacion: isVisible,
                titulo: "recolección"}

        })
    }

    const mostrarCotizadorRec = (isVisible) =>{
        setState(state => {
            return {
                ...state,
                mostrarCotizador:isVisible
            }
        })
    }

    const esDatoValido = (dato) => {
        return dato
            && dato !== ''
            && dato !== 0
            && dato !== "0";
    }

    const esRecoleccionValido = () => {
        let valid = false;
        /**INFORMACION GENERAÑ*/
        if (!esDatoValido(state.idTipoSeguro)){
            showSuccess("El tipo de seguro es un dato requerido");
            return valid;
        }
        if (!esDatoValido(state.tipoCambio)){
            showSuccess("El tipo de cambio es un dato requerido");
            return valid;
        }
        if (!esDatoValido(state.tipoCobro)){
            showSuccess("El tipo de cobro es un dato requerido");
            return valid;
        }
        if (!esDatoValido(state.clientePaga?.m_nIdCliente)){
            showSuccess("El responsable de pago es un dato requerido");
            return valid;
        }
        if (configuraciones.fijarCapturaValorDeclarado && parseFloat(state.valorDeclarado) <= 0) {
            showSuccess("El valor declarado no puede ser cero debido a la configuración.");
            return valid;
        }
        /**REMITENTE*/
        if (!esDatoValido(remitente.idRemitente)){
            showSuccess("El remitente es un dato requerido");
            return valid;
        }
        if (!esDatoValido(remitente.codigoPostalRemitente?.m_nIdCP)){
            showSuccess("El código postal del remitente es un dato requerido");
            return valid;
        }
        if(!esDatoValido(remitente.correoRemitente)){
            showSuccess("El correo del remitente es un dato requerido")
            return valid;
        }
        if (!esDatoValido(remitente.origenRemitente?.m_nIdCiudad)){
            showSuccess("La ciudad de origen es un dato requerido");
            return valid;
        }

        /**DESTINATARIO*/
        if (!esDatoValido(destinatario.idDestinatario)){
            showSuccess("El destinatario es un dato requerido");
            return valid;
        }
        if (!esDatoValido(destinatario.codigoPostalDestinatario?.m_nIdCP)){
            showSuccess("El código postal del destinatario es un dato requerido");
            return valid;
        }
        if(!esDatoValido(destinatario.correoDestinatario)){
            showSuccess("El correo del destinatario es un dato requerido")
            return valid;
        }
        if (!esDatoValido(destinatario.destinoDestinatario?.m_nIdCiudad)){
            showSuccess("La ciudad de destino es un dato requerido");
            return valid;
        }

        /**Si es entrega en sucursal*/
        if (state.entregaEnSucursal){
            if (!esDatoValido(state.idSucursalEntrega)){
                showSuccess("La sucursal de entrega es un dato requerido");
                return valid;
            }
            /**Si es entrega en direfente domicilio*/
        }else if(state.diferenteEntrega){
            if (!esDatoValido(entregaDD.codigoPostal?.m_nIdCP)){
                showSuccess("El código postal de entrega es un dato requerido");
                return valid;
            }
            if (!esDatoValido(entregaDD.idEstado)){
                showSuccess("El estado de entrega es un dato requerido");
                return valid;
            }
            if (!esDatoValido(entregaDD.zonaOperativa?.m_nIdZona)){
                showSuccess("La zona operativa de entrega es un dato requerido");
                return valid;
            }
            if (!esDatoValido(entregaDD.domicilio)){
                showSuccess("El domicilio de entrega es un dato requerido");
                return valid;
            }
            if (!esDatoValido(entregaDD.detalles)){
                showSuccess("El detalle de entrega es un dato requerido");
                return valid;
            }
        }else {
            /**Si es entrega en domicilio de destinatario*/
            if (!esDatoValido(destinatario.zonaOperativaDestinatario?.m_nIdZona)) {
                showSuccess("Verificar la zona operativa de destinatario")
                return valid;
            }
        }
        if (state.diferenteRecoleccion){
            if (!esDatoValido(recoleccionDD.zonaOperativa?.m_nIdZona)){
                showSuccess("La zona operativa de recolección es un dato requerido");
                return valid;
            }
            if (!esDatoValido(recoleccionDD.domicilio)){
                showSuccess("La dirección de recolección es un dato requerido");
                return valid;
            }
            if (!esDatoValido(recoleccionDD.detalles)){
                showSuccess("El detalle de recolección es un dato requerido");
                return valid;
            }
        }else{
            if (!esDatoValido(remitente.zonaOperativaRemitente?.m_nIdZona)){
                showSuccess("La zona operativa de recolección es un dato requerido");
                return valid;
            }
        }
        if (state.entregaConCita){
            if (!state.citaPendiente){
                if (!esDatoValido(state.fechaCita)){
                    showSuccess("La fecha de la cita es un dato requerido");
                    return;
                }
                if (!esDatoValido(state.horaCitaMinima)){
                    showSuccess("La hora mínima de la cita es un dato requerido");
                    return;
                }
                if (!esDatoValido(state.horaCitaMaxima)){
                    showSuccess("La hora máxima de la cita es un dato requerido");
                    return;
                }
            }
        }
        if (dataPaquetes.length === 0) {
            showSuccess("Debe agregar al menos un paquete o sobre")
            return
        }
        if (dataComplementosSAT.length === 0) {
            showSuccess("Debe agregar al menos un complemento del SAT")
            return
        }
        if (dataConceptos.find(i => parseInt(i.idConcepto) === parseInt(configuraciones.idConceptoFlete)) === undefined){
            showSuccess("La cotización debe incluir el concepto flete.")
            return;
        }
        if (dataConceptos.length === 0){
            showSuccess("No se han agregado conceptos de facturación. Genere una cotización.")
            return;
        }
        valid = true
        return valid;
    }

    const handleAceptar = (e, coordenadas) => {
        e.preventDefault();
        setDetectar(false)
        if(errores.length>0){
            showSuccess("Errores en conceptos de facturacion")
            return;
        }
        if(repetirConceptos && state.mostrarCotizador){
            showSuccess("Se requiere calcular tarifa otra vez")
            return;
        }
        if (!esRecoleccionValido()){
            return;
        }
        let error = false
        let params = {}
        if(!error){
            setState(state => {
                return {
                ...state,
                    showConfirmarUbicacion: false,
                    showConfirmarUbicacionDestinatario:false
                }
            })
            if (!validarCoordenadas(coordenadas)){
                return
            }
            dataPaquetes.forEach(item => {
                item.m_sClaveSATProducto = item.m_nClaveSATProducto
                item.m_sClaveSATUnidad = item.m_nClaveSATUnidad
            })
            dataComplementosSAT.forEach(item => {
                item.m_nCantidad = item.cantidad
                item.m_sClaveProductoServicio = item.claveProducto
                item.m_sClaveUnidad = item.claveUnidad
                item.m_sClaveFraccionArancelaria = item.claveFraccion
                item.m_sUUIDComercioExterior = item.comercioExterior
                item.m_sClaveMaterialPeligroso = item.claveMaterialPeligroso
                item.m_sMaterialPeligroso = item.materialPeligrosoSAT
                item.m_bEsMaterialPeligroso = item.esPeligroso
                item.m_sClaveEmbalaje = item.claveEmbalaje
                item.m_sDescripcionEmbalaje = item.descripcionEmbalajeSAT
                item.m_xPeso = parseFloat(parseFloat(item.peso).toFixed(3))
                item.nombreQuimico=item.nomQuimico
                item.numeroCAS=item.numCAS
                item.claveCondicionEspecial=item.claveCondicionesEspeciales
                item.registroSanitario_folioAutorizacion=item.regSanitario_folioAut
            })

            //Informacion general
            params.m_nIdRecoleccion = state.idRecoleccion
            params.m_nIdSucursal = state.idSucursalAgregar
            params.m_nIdEstatusRecoleccion = state.estatusRecoleccion
            params.m_nIdEmbarque = state.folioEmbarque
            params.m_nIdGuia = state.folioGuia
            params.m_nIdInforme = state.folioInforme
            params.m_sFecha = getCurrentDateTime().substr(0, 10)
            params.m_sHora = getCurrentDateTime().substr(getCurrentDateTime().length - 5)
            params.m_nMoneda = state.moneda
            params.m_rTipoCambio = state.tipoCambio
            params.m_nIdTipoDeCobro = state.tipoCobro
            params.m_nIdCliente = state.clientePaga.m_nIdCliente
            params.valorDeclarado = state.valorDeclarado
            params.m_sObservaciones = state.observaciones
            params.m_nIdTipoSeguro = state.idTipoSeguro
            params.m_xPorcentajeSeguro = state.porcentajeSeguro
            params.m_bAplicaSeguro = state.aplicaSeguro
            params.m_sReferencia = state.referencia
            //Remitente
            params.m_sNombreRemitente = remitente.nombreRemitente
            params.m_sRFCRemitente = remitente.RFCRemitente
            params.m_sDomicilioRemitente = remitente.domicilioRemitente
            params.m_sIdCodigoPostalRemitente = remitente.codigoPostalRemitente.m_nIdCP
            params.m_nIdCiudadRemitente = remitente.municipioRemitente
            params.m_sMunicipioRemitente = remitente.municipioRemitente
            params.m_sCorreoRemitente = remitente.correoRemitente
            params.m_sTelefonoRemitente = remitente.telefonoRemitente
            params.m_sContactoRemitente = remitente.contactoRemitente
            params.m_nIdCiudadOrigen = remitente.origenRemitente.m_nIdCiudad
            params.m_nIdRemitente = remitente.idRemitente
            params.m_sAliasRemitente = remitente.aliasRemitente
            params.m_sCalleRemitente = remitente.calleRemitente
            params.m_sNoIntRemitente = remitente.numeroIntRemitente
            params.m_sNoExtRemitente = remitente.numeroExtRemitente
            params.m_sColoniaRemitente = remitente.coloniaRemitente
            params.m_nIdEstadoRemitente = remitente.estadoRemitente

            //Destinatario
            params.m_sNombreDestinatario = destinatario.nombreDestinatario
            params.m_sRFCDestinatario = destinatario.RFCDestinatario
            params.m_sDomicilioDestinatario = destinatario.domicilioDestinatario
            params.m_sIdCodigoPostalDestinatario = destinatario.codigoPostalDestinatario.m_nIdCP
            params.m_nIdCiudadDestinatario = destinatario.municipioDestinatario
            params.m_sMunicipioDestinatario = destinatario.municipioDestinatario
            params.m_sCorreoDestinatario = destinatario.correoDestinatario
            params.m_sTelefonoDestinatario = destinatario.telefonoDestinatario
            params.m_sContactoDestinatario = destinatario.contactoDestinatario
            params.m_nIdCiudadDestino = destinatario.destinoDestinatario.m_nIdCiudad
            params.m_nIdDestinatario = destinatario.idDestinatario
            params.m_sAliasDestinatario = destinatario.aliasDestinatario
            params.m_sCalleDestinatario = destinatario.calleDestinatario
            params.m_sNoIntDestinatario = destinatario.numeroIntDestinatario
            params.m_sNoExtDestinatario = destinatario.numeroExtDestinatario
            params.m_sColoniaDestinatario = destinatario.coloniaDestinatario
            params.m_nIdEstadoDestinatario = destinatario.estadoDestinatario
            params.m_sLatitudD = destinatario.latitudD
            params.m_sLongitudD = destinatario.longitudD

            //Cita de recoleccion
            params.m_bRecoleccionConCita = state.recoleccionConCita

            //Recoleccion
            params.m_nIdCPDetalleRecoleccion = remitente.codigoPostalRemitente.m_nIdCP
            params.m_bRecoleccionDiferenteDomicilio = state.diferenteRecoleccion

            //Entrega
            params.m_nIdCPDetalleEntrega = destinatario.codigoPostalDestinatario.m_nIdCP
            params.m_bEntregaDiferenteDomicilio = state.diferenteEntrega
            params.m_arrClsComplementoSAT = dataComplementosSAT
            //Detalles de la operación
            params.m_dFechaSalida = state.fechaHoraSalida.split("T")[0]
            params.m_dFechaLlegada = state.fechaHoraLlegada.split("T")[0]
            params.m_tHoraSalida = state.fechaHoraSalida.split("T")[1]
            params.m_tHoraLlegada = state.fechaHoraLlegada.split("T")[1]
            params.m_parrPaquetes = dataPaquetes
            params.m_nNoPaquetes = dataPaquetes.length
            params.m_parrSobres = state.sobres
            params.m_nNoSobres = state.sobres.length
            params.m_nIdOperador = state.operador.m_nIdOperador
            params.m_nIdUnidad = state.unidad.m_nIdUnidad
            params.m_nIdRemolque = state.unidad.m_nIdUnidad
            params.m_nCreadoPor = state.CreadoPor
            params.m_nModificadoPor = state.ModificadoPor
            if (state.diferenteRecoleccion) {
                params.m_nIdCPDetalleRecoleccion = recoleccionDD.codigoPostal.m_nIdCP
                params.m_sDomicilioDetalleRecoleccion = recoleccionDD.domicilio
                params.m_sRecogerEnDetalleRecoleccion = recoleccionDD.detalles
                params.m_sDatosAdicionalesDetalleRecoleccion = recoleccionDD.datosAdicionales
                params.m_nIdZonaOperativa = recoleccionDD.zonaOperativa.m_nIdZona
                params.m_nIdEstadoRecoleccion = recoleccionDD.idEstado
                params.m_sCodigoMunicipioRecoleccion = recoleccionDD.idMunicipio
                params.m_sLatitudR = coordenadas ? coordenadas.lat?coordenadas.lat.toString():coordenadas[0].toString() : recoleccionDD.latitud
                params.m_sLongitudR = coordenadas ? coordenadas.lng?coordenadas.lng.toString(): coordenadas[1].toString() : recoleccionDD.longitud
            } else {
                params.m_nIdZonaOperativa = remitente.zonaOperativaRemitente.m_nIdZona
                params.m_nIdZonaTarifa = remitente.zonaTarifaRemitente? remitente.zonaTarifaRemitente.m_nIdZona : 0
                params.m_sLatitudR = coordenadas ?coordenadas.lat?coordenadas.lat.toString(): coordenadas[0].toString() : remitente.latitudR
                params.m_sLongitudR = coordenadas ?coordenadas.lng?coordenadas.lng.toString(): coordenadas[1].toString() : remitente.longitudR
            }
            params.m_bEntregaEnSucursal = state.entregaEnSucursal;
            if (state.entregaEnSucursal){
                params.m_nIdSucursalEntrega = state.idSucursalEntrega;
                params.m_nIdZonaOperativaEntrega = state.zonaOperativaSucursal.m_nIdZona
            }else{
                params.m_nIdSucursalEntrega = 0;
                if (state.diferenteEntrega) {
                    params.m_nIdCPDetalleEntrega = entregaDD.codigoPostal.m_nIdCP
                    params.m_sDomicilioDetalleEntrega = entregaDD.domicilio
                    params.m_sEntregarEnDetalleEntrega = entregaDD.detalles
                    params.m_sDatosAdicionalesDetalleEntrega = entregaDD.datosAdicionales
                    params.m_nIdZonaOperativaEntrega = entregaDD.zonaOperativa.m_nIdZona
                    params.m_nIdEstadoEntrega = entregaDD.idEstado
                    params.m_sCodigoMunicipioEntrega = entregaDD.idMunicipio
                } else {
                    params.m_nIdZonaOperativaEntrega = destinatario.zonaOperativaDestinatario.m_nIdZona
                    params.m_nIdZonaTarifaEntrega = destinatario.zonaTarifaDestinatario ? destinatario.zonaTarifaDestinatario.m_nIdZona : 0
                }
            }

            if (state.recoleccionConCita) {
                params.m_bCitaPendiente = state.citaPendiente
                if (!state.citaPendiente){
                    params.m_sFechaCita = state.fechaCita
                    params.m_sHoraCitaMinima = state.horaCitaMinima
                    params.m_sHoraCitaMaxima = state.horaCitaMaxima
                }
            }
            params.m_arrConceptos = dataConceptos.map(item => ({
                m_nIdConceptoFacturacion: item.idConcepto,
                m_cImporte: item.importe,
                m_nIdImpuestoRetiene: item.retiene,
                m_nIdImpuestoTraslada: item.traslada,
                m_cImporteIva: item.importeIVA,
                m_cImporteRetiene: item.importeRet,
                m_c_Descuento: item.descuento
            }))
            params.m_nIdCotizacion = state.idCotizacion
            if (state.idRecoleccion !== 0) {
                modificarRecoleccion(state.idRecoleccion, params)
                    .then((respuesta) => {
                        showSuccess(respuesta.data);
                        handleShowListado();
                        limpiarInputsAgregar()
                        
                    })
                    .catch((err) => {
                        console.log(err);
                       
                        showSuccess(err.response.data);
                    });
            } else {
                confirmAlert({
                    title: 'Confirmación',
                    message: '¿Desea crear esta recolección?',
                    buttons: [
                        {
                            label: 'Sí',
                            onClick: ()=>{
                                agregarRecoleccion(params)
                                    .then((respuesta) => {
                                        showSuccess("Recolección creada con folio: "+respuesta.data.m_sFolioRecoleccion);
                                        limpiarInputsAgregar()
                                        confirmAlert({
                                            title: 'Confirmación',
                                            message: '¿Desea crear otra recolección?',
                                            buttons: [
                                                {
                                                    label: 'Sí',
                                                    onClick: ()=>{//limpia los inputs para volver a agregar denuevo la info
                                                        setLimpiarRemDes(e)
                                                        mostrarCotizadorRec(false)
                                                        limpiarInputsAgregar()
                                                    }
                                                },
                                                {
                                                    label: 'No',
                                                    onClick: ()=>{ handleShowListado();}
                                                }
                                            ]
                                        });

                                    })
                                    .catch((err) => {
                                        showSuccess(err.response.data);
                                    });
                            }
                        },
                        {
                            label: 'No',
                            onClick: ()=>{return}
                        }
                    ]
                });

            }
        }
    };

    function getTipoCambio() {
        obtenerTipoCambio().then(respuesta => {
            setDataTipoCambio(respuesta.data)
        });
    };

    function handleSelectCP(id, _dobleClick, e) {
        clearTimeout(timer);
        if (e.detail === 1) {
            timer = setTimeout(() => {
                setState(state => {
                    return {
                    ...state,
                        [state.identificadorModal]: id,
                        openDialog: true
                    }
                })
            }, 200)
        } else if (e.detail === 2) {
            setState(state => {
                return {
                ...state,
                    [state.identificadorModal]: id,
                    openDialog: false
                }
            });
        }
    }

    //funcion para cancelar una recoleccion. Se usa en tab cancelar.
    const handleCancelar = (e) => {
        e.preventDefault();
        let params = {
            "motivoCancelacion": state.motivoCancelacion,
            "usuarioCancelacion": localStorage.getItem("UsuarioId"),
            "fechaCancelacion": state.fechaCancelacion.replace('T', ' ')
        }
        JSON.stringify(params)
        cancelarRecoleccion(state.idRecoleccion, params).then((respuesta) => {
            showSuccess(respuesta.data)
            setState(state => {
                return {
                    ...state,
                    folioRecoleccion: '',
                    fechaCancelacion: '',
                    idRecoleccion: 0,
                    motivoCancelacion: ''
                }
            })
            handleShowListado();
        }).catch((err) => {
            showSuccess(err.response?.data);
        });
    }



    function handleEliminar(id) {
        var derecho;
        validarPermisos(state)
            .then((respuesta) => {
                derecho = respuesta.data;
                if (derecho === false) {
                    showSuccess("El usuario no tiene derechos para realizar el proceso");
                    return;
                }
                eliminarRecoleccion(id, state.CreadoPor)
                    .then((respuesta) => {
                        showSuccess(respuesta.data);
                        getAllData();
                    })
                    .catch((err) => {
                        showSuccess(err.response?.data);
                    });
            })
            .catch((err) => {
                showSuccess(err.response?.data);
            });
    }

    function handleShowModificar(id,row) {
        setIsModificar(true);
        if(row.m_nTimbrado){
            showSuccess("La recoleccion no puede ser modificada ya que se encuentra timbrada")
        }else{
            obtenerRecoleccionId(id).then((respuesta) => {
                $('.nav-tabs li ').removeClass('active');
                $('.nav-tabs li').eq(1).addClass('active');
                $('.tab-content div ').removeClass('in show');
                $('#Agregar').addClass('in show');
                setTabActiva(1)
                setState(state => {
                    return {
                        ...state,
                        agregar: "Modificar",
                        recoleccionConEmbarque: (data.find((o) => o.m_nIdRecoleccion === id).m_sFolioEmbarque)
                    }
                })
                setRecoleccionDataParaConsultaModificacion(respuesta,"Modificar")
               
            });
        }
    }

    function handleShowConsultar(id) {
        setIsAgregar(false);
        $('.nav-tabs li ').removeClass('active');
        $('.nav-tabs li').eq(1).addClass('active');
        $('.tab-content div ').removeClass('in show');
        $('#Agregar').addClass('in show');
        setTabActiva(1)
        obtenerRecoleccionId(id).then((respuesta) => {
            setState(state => {
                return {
                    ...state,
                    agregar: "Consultar",
                }
            })
            setRecoleccionDataParaConsultaModificacion(respuesta,"Consultar")
        });
    }

    const [limpiarRemDes,setLimpiarRemDes] = React.useState()

    const mostrarDatosRecoleccionDD = (respuesta) => {
        setRecoleccionDD(recoleccionDD => {
            return {
                ...recoleccionDD,
                idPais: respuesta.data.m_nIdPaisRecoleccion || 0,
                pais: respuesta.data.m_sPaisRecoleccion || '',
                idEstado: respuesta.data.m_nIdEstadoRecoleccion || 0,
                estado: respuesta.data.m_sEstadoRecoleccion || '',
                idMunicipio: respuesta.data.m_sCodigoMunicipioRecoleccion || 0,
                municipio: respuesta.data.m_sMunicipioRecoleccion || '',
                codigoPostal: {
                    m_nIdCP: respuesta.data.m_nIdCPDetalleRecoleccion,
                    m_sCP: respuesta.data.m_sCodigoPostalRecoleccion,
                    m_sColonia: respuesta.data.m_sColoniaRecoleccion ? respuesta.data.m_sColoniaRecoleccion : respuesta.data.m_sLocalidadRecoleccion
                },
                domicilio: respuesta.data.m_sDomicilioDetalleRecoleccion,
                detalles: respuesta.data.m_sRecogerEnDetalleRecoleccion,
                datosAdicionales: respuesta.data.m_sDatosAdicionalesDetalleRecoleccion,
                latitud: respuesta.data.m_sLatitud || '',
                longitud: respuesta.data.m_sLongitud || '',
            }
        })
        obtenerMunicipiosByIdEstado(respuesta.data.m_nIdEstadoRecoleccion).then(({data}) =>{
            setDataMunicipiosRecoleccionDD(data)
        })
        obtenerByIdZonaOperativa(respuesta.data.m_nIdZonaOperativa).then(({data}) => {
            setRecoleccionDD(recoleccionDD => {
                return {
                    ...recoleccionDD,
                    zonaOperativa: data
                }
            })
        })
    }

    const mostrarDatosEntregaDD = (respuesta) => {
        setEntregaDD(entregaDD =>{
            return {
                ...entregaDD,
                idPais: respuesta.data.m_nIdPaisEntrega,
                idEstado: respuesta.data.m_nIdEstadoEntrega || 0,
                idMunicipio: respuesta.data.m_sCodigoMunicipioEntrega || 0,
                domicilio: respuesta.data.m_sDomicilioDetalleEntrega,
                detalles:respuesta.data.m_sEntregarEnDetalleEntrega,
                datosAdicionales: respuesta.data.m_sDatosAdicionalesDetalleEntrega,
                codigoPostal: {
                    m_nIdCP: respuesta.data.m_nIdCPDetalleEntrega,
                    m_sCP: respuesta.data.m_sCodigoPostalEntrega,
                    m_sColonia: respuesta.data.m_sColoniaEntrega ? respuesta.data.m_sColoniaEntrega : respuesta.data.m_sLocalidadEntrega,
                    m_sLocalidad: respuesta.data.m_sLocalidadEntrega
                },
            }
        })
        obtenerMunicipiosByIdEstado(respuesta.data.m_nIdEstadoEntrega).then(({data}) =>{
            setDataMunicipiosEntregaDD(data)
        })
        obtenerByIdZonaOperativa(respuesta.data.m_nIdZonaOperativaEntrega).then(({data}) => {
            setEntregaDD(entregaDD => {
                return {
                    ...entregaDD,
                    zonaOperativa: data
                }
            })
        })
    }

    const setRecoleccionDataParaConsultaModificacion = (respuesta,operacion) => {
        respuesta.data.recoleccionById = true
        setDataRecoleccionConsulta(respuesta)
        getDataParaEditar(operacion)
        getAllCiudades()
        getAllZonas()
        getAllEmbalajes()

        respuesta.data.m_parrPaquetes.forEach((p) => {
            p.m_nClaveSATProducto = p.m_sClaveSATProducto
            p.m_nClaveSATUnidad = p.m_sClaveSATUnidad
            p.m_sProductoSAT = p.m_nProductoSAT
            p.m_sUnidadSAT = p.m_nUnidadSAT
            obtenerProductoById(p.m_nIdProducto).then(({data}) => {
                p["producto"] = data
                p.m_sProducto = data.m_sDescripcion
            })
            obtenerEmbalajesId(p.m_nIdTipoEmbalaje).then(({data}) => {
                p.m_sTipoEmbalaje = data.m_sNombre
            })
            p.m_sTipo = p.m_nIdTipo === 1 ? 'Sobre' : 'Paquete'
        })
        setDataPaquetes(respuesta.data.m_parrPaquetes)
       
        respuesta.data.m_arrClsComplementoSAT.forEach(item => {
            item.sectorCOFEPRIS=item.ClaveSectorCofepris
            item.claveCondicionesEspeciales=item.CondicionesEspTransp
            item.datosFabricante=item.DatosFabricante
            item.datosFormulador=item.DatosFormulador
            item.datosMaquilador=item.DatosMaquilador
            item.denominacionGenerica=item.DenominacionGenericaProd
            item.denominacionDistintiva=item.DenominacionDistintivaProd
            item.fabricante=item.Fabricante
            item.fechaCaducidad=item.FechaCaducidad
            item.claveFormaFarmaceutica=item.FormaFarmaceutica
            item.nombreIngredienteActivo=item.NombreIngredienteActivo
            item.nomQuimico=item.NombreQuimico
            item.loteMedicamento=item.LoteMedicamento
            item.numRegSanPlagCOFEPRIS=item.NumRegSanPlagCOFEPRIS
            item.numCAS=item.NumeroCAS
            item.regSanitario_folioAut=item.RegistroSanitarioFolioAutorizacion
            item.usoAutorizado=item.UsoAutorizado
            item.esFarmaco=item.esFarmaco

        })
        setDataComplementosSAT(respuesta.data.m_arrClsComplementoSAT)
        if (respuesta.data.m_bRecoleccionDiferenteDomicilio){
            mostrarDatosRecoleccionDD(respuesta)
        }
        if (respuesta.data.m_bEntregaSucursal){
            setState(state => {
                return {
                    ...state,
                    entregaEnSucursal:respuesta.data.m_bEntregaSucursal,
                    idSucursalEntrega:respuesta.data.m_nIdSucursalEntrega
                }
            })
            obtenerByIdZonaOperativa(respuesta.data.m_nIdZonaOperativaEntrega).then(({data}) => {
                setState(state => {
                    return {
                        ...state,
                        zonaOperativaSucursal: data
                    }
                })
            })

        }else if (respuesta.data.m_bEntregaDiferenteDomicilio){
            mostrarDatosEntregaDD(respuesta)
        }
        obtenerClienteId(respuesta.data.m_nIdCliente).then(({data}) => {
            setState(state => {
                return {
                    ...state,
                    clientePaga: data,
                }
            })
        })

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
        setDataConceptos(conceptosCast)
        setState(state => {
            return {
                ...state,
                idRecoleccion: respuesta.data.m_nIdRecoleccion,
                idSucursalAgregar: respuesta.data.m_nIdSucursal,
                folioRecoleccion: respuesta.data.m_sFolioRecoleccion,
                folioEmbarque: respuesta.data.m_sFolioEmbarque,
                valorDeclarado: respuesta.data.m_xValorDeclarado,
                observaciones: respuesta.data.m_sObservaciones,
                folioGuia: respuesta.data.m_sFolioGuia,
                idCotizacion: respuesta.data.m_nIdCotizacion,
                folioInforme: respuesta.data.m_nIdInforme,
                fechaHoraRegistro: respuesta.data.m_dFechaRegistro + "T" + respuesta.data.m_tHora.slice(0, 5),
                estatusRecoleccion: respuesta.data.m_nIdEstatusRecoleccion,
                moneda: respuesta.data.m_nMoneda,
                tipoCambio: respuesta.data.m_rTipoCambio,
                tipoCobro: respuesta.data.m_nIdTipoDeCobro,
                mostrarCotizador:true,
                //Paquetes/Sobres
                countPaquetes: dataPaquetes.length,
                countSobres: respuesta.data.m_parrSobres.length,
                mismoPaquete: false,
                mismoSobre: false,
                sobres: respuesta.data.m_parrSobres,
                ValorDeclarado: respuesta.data.m_xValorDeclarado,
                idTipoSeguro: respuesta.data.m_nIdTipoSeguro,
                porcentajeSeguro: respuesta.data.m_xPorcentajeSeguro,
                aplicaSeguro: respuesta.data.m_bAplicaSeguro,
                //Cita de recoleccion
                recoleccionConCita: respuesta.data.m_bRecoleccionConCita,
                diferenteRecoleccion: respuesta.data.m_bRecoleccionDiferenteDomicilio,
              
                diferenteEntrega: respuesta.data.m_bEntregaDiferenteDomicilio,
                receptorRecoleccion: respuesta.data.m_sReceptorRecoleccion,
                referencia: respuesta.data.m_sReferencia,

            }
        });
    }

    useEffect(() => {
        let newTiposCobro = []
        if (state.entregaEnSucursal) {
            if (state.tipoCobro === 5) {
                showSuccess("No se puede hacer cobro en origen cuando es entrega en sucursal, elige otra opción.")
                setState(state => {
                    return {
                        ...state,
                        tipoCobro: 0
                    }
                })
            }
            dataTipoCobro.forEach((i) => {
                i.valid = !(i.m_nIdTipoCobro === 5);
                newTiposCobro.push(i)
            })
        } else {
            dataTipoCobro.forEach((i) => {
                i.valid = true
                newTiposCobro.push(i)
            })
        }
        setDataTipoCobro(newTiposCobro)
    }, [state.entregaEnSucursal])



    function handleShowAgregar(event) {
        setIsAgregar(false);
        getDataParaEditar("Agregar")
        limpiarInputsAgregar()
        setState(state => {
            return {
                ...state,
                idSucursalAgregar: localStorage.getItem("Sucursal"),
                folioRecoleccion: dataFolioRecoleccion.length !== 0 ? dataFolioRecoleccion[0].m_sFolioRecoleccion : "",
                fechaHoraRegistro: getCurrentDateTime()

            }
        });
        
        $('.nav-tabs li ').removeClass('active');
        $('.nav-tabs li').eq(1).addClass('active');
        $('.tab-content div ').removeClass('in show');
        $('#Agregar').addClass('in show');
        setTabActiva(1)
    }
   
    useEffect(() => {
        if( detectarModificaciones){
            window.onbeforeunload = confirmExit
           
        }
    }, [remitente,state,destinatario,dataComplementosSAT,dataPaquetes,recoleccionDD,entregaDD,dataConceptos])

    function confirmExit()
    {
      return "Are you sure you want to leave?"
    }

    const handleShowListado = (event) => {
        setDetectar(false)
        window.onbeforeunload={}
        setIsAgregar(false);
        if (event !== undefined){
            event.stopPropagation();
        }
        limpiarInputsAgregar()
        setState(state => {
            return {
                ...state,
                fechaInicial: dataFechaInicial.Fecha,
                fechaFinal: dataFechaFinal.Fecha,
                sucursalListado: 0,
                estatusListado: 0,
                folioRecoleccion: '',
                mostrarCotizador:false,
                agregar: "Agregar",
            }
        });
        getAllData();
        $('.nav-tabs li ').removeClass('active');
        $('.nav-tabs li').eq(0).addClass('active');
        $('.tab-content div ').removeClass('in show');
        $('#Listado').addClass('in show');
        setTabActiva(0)
    }

    function handleShowCancelar() {
        obtenerSucursales().then((respuesta) => {
            setDataSucursal(respuesta.data);
            obtenerRecoleccionCancelada(state.idRecoleccion).then((respuesta) => {

                if (respuesta.data.m_nSePuedeCancelar){
                    showSuccess("Recolección no se puede cancelar")
                }else{
                    setState(state => {
                        return {
                        ...state,
                            folioRecoleccion: data.find(i => parseInt(i.m_nIdRecoleccion) === state.idRecoleccion)?.m_sFolioRecoleccion,
                            fechaCancelacion: getCurrentDateTime()
                        }
                    })
                    $('.nav-tabs li ').removeClass('active');
                    $('.nav-tabs li').eq(2).addClass('active');
                    $('.tab-content div ').removeClass('in show');
                    $('#Cancelar').addClass('in show');}
            })
        });
    }

    const handlePatrocinadorSelected = (row) => {
        setDataSeguroClienteActual(seguroClienteActual=>{
            return {
                ...seguroClienteActual,
                idTipoSeguro: row.m_nIdTipoSeguro !== 0 ? row.m_nIdTipoSeguro : TIPOS_SEGURO.SIN_ASIGNAR,
                porcentajeSeguro: row.m_cPorcentajeSeguro,
                aplicaSeguro: row.m_nIdTipoSeguro === TIPOS_SEGURO.SEGUN_SOLICITA || row.m_nIdTipoSeguro === TIPOS_SEGURO.OBLIGATORIO,
            }
        })
        setState(state => {
            return {
                ...state,
                clientePaga: row,
                idTipoSeguro: row.m_nIdTipoSeguro !== 0 ? row.m_nIdTipoSeguro : TIPOS_SEGURO.SIN_ASIGNAR,
                porcentajeSeguro: row.m_cPorcentajeSeguro,
                aplicaSeguro: row.m_nIdTipoSeguro === TIPOS_SEGURO.SEGUN_SOLICITA || row.m_nIdTipoSeguro === TIPOS_SEGURO.OBLIGATORIO,
                tipoCobro: configuraciones.detectarTipoCobro ? row.m_bSinCredito ? "10" : "11" : state.tipoCobro,
                observaciones: row.m_nIdTipoSeguro === TIPOS_SEGURO.CON_POLIZA ? ("Aseguradora: " + row.m_sAseguradora + ", Póliza: " + row.m_sPoliza) : "",
                openDialog: false,
            }
        })
    }

    //Limpia todos los inputs
    const limpiarInputsAgregar = () => {
        setState(state => {
            return {
                ...state,
                idRecoleccion:0,
                folioRecoleccion: '',
                folioEmbarque: '',
                folioGuia: '',
                folioInforme: '',
                fechaHoraRegistro: getCurrentDateTime(),
                estatusRecoleccion: configuraciones.estatusRecoleccion,
                moneda: configuraciones.monedaPredeterminadaEmbarque,
                tipoCambio: configuraciones.tipoCambioEmbarque,
                tipoCobro: configuraciones.tipoCobro,
                idTipoSeguro: 5,
                valorDeclarado: 0,
                observaciones: '',
                porcentajeSeguro: 0,
                clientePaga: {m_nNumeroCliente: 'No. Cliente', m_sNombreFiscal: 'Nombre fiscal'},
                showConfirmarUbicacion:false,

                countPaquetes: 1,
                countSobres: 1,
                mismoPaquete: false,
                mismoSobre: false,
                paquetes: [],
                sobres: [
                    {
                        m_sDescripcion: "",
                    },
                ],

                //Cita de recoleccion
                recoleccionConCita: false,
                fechaCita: '',
                horaCitaMinima: '',
                horaCitaMaxima: '',
                citaPendiente:false,

                //Entrega
                diferenteEntrega: false,
                entregaEnSucursal:false,

                //Recoleccion
                diferenteRecoleccion: false,
                aplicaEntrega:false,
                //Operador
                operador: '',
                tipoUnidad: '',
                unidad: '',
                fechaHoraSalida: '',
                fechaHoraLlegada: '',
                zonaOperativaSucursal: null,
                idSucursalEntrega: '',
                receptorRecoleccion: '',
                referencia: '',
            }
        });
        setDataPaquetes([])
        setDataConceptos([])
        setDataComplementosSAT([])
        resetRecoleccionDD()
        resetEntregaDD()
        setDataRecoleccionConsulta(undefined)
        setRepetirConceptos(false)
    }

    const handleChange = (event) => {
        event.preventDefault();
        if(event.target.id === "porcentajeSeguro"){
            setRepetirConceptos(true)
        }
        setState(state => {
            return {
            ...state,
                [event.target.id]: event.target.value,
            }
        });
    };


    const handleChangeSucursalEntrega = (event) => {
        setState(state => {
            return {
                ...state,
                [event.target.name]: event.target.value
            }
        });
        getZonaOperativaByCodigoPostal(dataSucursal.find(c => c.m_nIdSucursal === event.target.value).m_nIdCodigoPostal)
    };

    const getZonaOperativaByCodigoPostal = (codigoPostal) => {
        obtenerZonaOperativaByIdCodigoPostal(codigoPostal).then(respuesta => {
            setState(state => {
                return{
                    ...state,
                    zonaOperativaSucursal: respuesta.data[0]
                }
            })
        })
    }

    //setea si la recoleccion es en diferente direccion a la del remitente
    const handleRecoleccionCheckboxChange = (event) => {
        setState({
            ...state,
            diferenteRecoleccion: !state.diferenteRecoleccion,
        });
    };

    const handleCitaCheckboxChange = (event) => {
        setRepetirConceptos(true)
        setState({
            ...state,
            recoleccionConCita: !state.recoleccionConCita,
        });
    };

    //setea si la entrega es en diferente direccion a la del destinatario
    const handleEntregaCheckboxChange = (event) => {
        setRepetirConceptos(true)
        setState({
            ...state,
            diferenteEntrega: !state.diferenteEntrega,
            entregaEnSucursal: false
        });
    };

    const handleEntregaEnSucursalCheckbox = (event) => {
        setRepetirConceptos(true)
        if(destinatario.idDestinatario === ''){//Evita que cambie de estatus el check de entrega en sucursal
            showSuccess("Se requiere seleccionar Destinatario")
            return
        }
        getZonaOperativaByCodigoPostal(dataSucursal.find(c => c.m_nIdSucursal === destinatario.zonaOperativaDestinatario.m_nIdSucursal).m_nIdCodigoPostal)
        setState(state => {
            return{
                ...state,
                entregaEnSucursal: !state.entregaEnSucursal,
                diferenteEntrega: !state.entregaEnSucursal && false,
                entregaConCita: !state.entregaEnSucursal && false,
                idSucursalEntrega: destinatario.zonaOperativaDestinatario.m_nIdSucursal
            }
        })
    };

    const handleListComplementosSATChange = (newList) => {
        setDataComplementosSAT(newList)
    }

    const columns = React.useMemo(() => [
        {
            headerName: "Acciones",
            field: "",
            width: 130,
            sortable: false, filterable: false,
            renderCell: (row) => {
                return (
                    <div>
                        <Tooltip title="Modificar" disabled={!validarDerecho(9101415)}>
                            <a data-toggle="tab"
                               onClick={() =>
                                   { if(row.row.m_nIdEstatusRecoleccion==1 ||row.row.m_nIdEstatusRecoleccion==6){
                                           handleShowModificar(row.row.m_nIdRecoleccion,row.row)
                                       }else{
                                           showSuccess(`La recoleccion solo puede ser modificada en Estatus: Pendiente, Estatus Actual: ${row.row.m_sEstatusRecoleccion}`)
                                       }
                                   }
                               }
                               className="btn btn-default btn-xs"><i className="fa fa-pencil-square-o"
                                                                     style={{color: "#F9A03E"}}/></a>
                        </Tooltip>
                        <Tooltip title="Consultar" disabled={!validarDerecho(9101419)}>
                            <a className="btn btn-default btn-xs" onClick={() => (handleShowConsultar(row.row.m_nIdRecoleccion))}>
                                <i className="fa fa-eye" style={{color: "#F9A03E"}}/>
                            </a>
                        </Tooltip>
                        <Tooltip title="Reporte" disabled={!validarDerecho(9101418)}>
                            <a  className="btn btn-default btn-xs" onClick={() => generarReporte(row.row)}>
                                <i className="zmdi zmdi-file" style={{color: "#F9A03E"}}/>
                            </a>
                        </Tooltip>
                        <Tooltip title="Eliminar" disabled={!validarDerecho(9101416)}>
                            <a href="#" className="btn btn-default btn-xs"
                               onClick={() => confirmAlert({
                                   title: 'Confirmar Eliminar',
                                   message: '¿Está seguro de eliminar la recolección?',
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
                                      style={{color: "#F30B0B"}}/></a>
                        </Tooltip>
                    </div>
                )
            }
        },
        {
            headerName: "Fecha/Hora Elaboración",
            field: "m_sFechaHora",
            sortComparator: (v1, v2, param1, param2) =>

                param1.api.getCellValue(param1.id, 'm_sFechaHora').substring(0,10)>
                param2.api.getCellValue(param2.id, 'm_sFechaHora').substring(0,10),
            width: 200,
        },
        {
            headerName: "Folio Recolección",
            field: "m_sFolioRecoleccion",
            width: 150,
            renderCell:(row)=>{
                return(
                    <div>
                        <Tooltip title= {row.row.m_sObservaciones}>
                            <field>{row.row.m_sFolioRecoleccion}</field>
                        </Tooltip>
                    </div>

                );

            }
        },
        {
            headerName: "Estatus",
            field: "m_sEstatusRecoleccion",
            width: 125,
            renderCell: (row) => {
                return (
                    <div align={"center"} style={{width: "100%"}}>
                        <Chip size="small" style={{
                            backgroundColor: `${row.row.m_sColorEstatus}`,
                            //color: row.row.m_nIdEstatusUnidad === 1 ? "black" : "white",
                            padding: "1px"
                        }} label={row.row.m_sEstatusRecoleccion}/>
                    </div>
                )
            }
        },
        {
            headerName: "Origen",
            field: "m_sCiudadOrigen",
            width: 150,
        }, {
            headerName: "Destino",
            field: "m_sCiudadDestino",
            width: 150,
        },
        {
            headerName: "Referencia",
            field: "m_sReferencia",
            width: 150,
        },
        {
            headerName: "Folio Embarque",
            field: "m_sFolioEmbarque",
            width: 150,
        },
        {
            headerName: "Usuario Documento",
            field: "m_sUsuarioDocumento",
            width: 200,
            renderCell: (row) => {
                <div>
                    {row.row.m_sUsuarioDocumento === "0" ? "N/A" : row.row.m_sUsuarioDocumento}
                </div>
            }
        },
        {
            headerName: "Cliente",
            field: "m_sNombreCliente",
            width: 300,
        },
        {
            headerName: "Sucursal",
            field: "m_sSucursal",
            width: 125,
        },
        {
            headerName: "Zona Recolección",
            field: "m_sZonaRecoleccion",
            width: 200,
        },
        {
            headerName: "Fecha/Hora Cita",
            field: "m_sFechaHoraDetalleRec",
            width: 250,
        },
        {
            headerName: "Referencia",
            field: "m_sReferencia",
            width: 150,
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
                            color: row.row.m_bActivo === true  ? "green" : "red",
                        }}
                    >
                        {row.row.m_bActivo ? (
                            <SvgIcon component={Activo}/>
                        ) : (
                            <SvgIcon component={NoActivo}/>
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


    function generarReporte(row){

        obtenerFormatosImpresionProceso(FORMATOS_IMPRESION.RECOLECCION).then((respuesta) => {
          
            imprimirFormatosIdIdTipoReporte(respuesta.data[respuesta.data.length - 1]?.m_nIdFormato, row.m_nIdRecoleccion).then(({data}) => { //poner aqui el id de Embarque
                let pdfWindow = window.open("");
                pdfWindow.document.write("<embed  width='100%' height='100%' src='data:application/pdf;base64, " + encodeURI(data.m_sArchivo) + "'/>");
                pdfWindow.document.body.style.margin = "0px";
                pdfWindow.document.title = "Recolección " + row.m_sFolioRecoleccion;
            })
        })
    }

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

    async function getAllData() {
        obtenerFechaInicio().then((respuestaUno) => {
            obtenerFechaFinal().then((respuestaDos) => {
                obtenerRecoleccionFiltro(respuestaUno.data[0].Fecha, respuestaDos.data[0].Fecha,0,0,0, 0, 0,0).then((respuesta) => {
                    setData(respuesta.data);
                })
            })

        })
    }

    function confirmarUbicacion(coordenadas, e) {
        handleAceptar(e, coordenadas)
    }

    function getAllEmbalajes() {
        obtenerEmbalajes().then((respuesta) => {
            setDataEmbalaje(respuesta.data);
        });
    }

    function getAllSucursales() {
        if (dataSucursal.length === 0 ){
            obtenerSucursales().then((respuesta) => {
                setDataSucursal(respuesta.data);
            });
        }

    }

    function getAllEstatusRecoleccion() {
        obtenerEstatusRecoleccion().then((respuesta) => {
            setEstatusRecoleccion(respuesta.data);
        });
    }

    function getAllTipoCobro() {
        obtenerTipoCobro().then((respuesta) => {
            respuesta.data.forEach((i) => {
                i.valid = true
            })
            setDataTipoCobro(respuesta.data);
        });
    }

    function getAllTipoMoneda() {
        obtenerMonedas().then((respuesta) => {
            setDataTipoMoneda(respuesta.data);
        });
    }

    const actualizarConceptos = (list) => {
        setDataConceptos(list);
    }

    function getAllCiudades() {
        obtenerCiudades().then((respuesta) => {
            setDataCiudad(respuesta.data);
        });
    }

    function getAllZonas() {
        const url = `${process.env.REACT_APP_API_URL}/Zonas/GetListado`;
        axios.get(url, {headers}).then((respuesta) => {
            setDataZona(respuesta.data);
        });
    }

    async function getAllTiposSeguro() {
        axios.get(`${localStorage.getItem("Back") ?? process.env.REACT_APP_REPORT_URL}/api/TipoSeguros/GetListado`, {headers}).then(({data}) => {
            setDataTiposSeguro(data)
        })
    }



    function getAllRemitentesDestinatarios() {
        obtenerRemitentesDestinatarios().then((respuesta) => {
            setDataRemitenteDestinatario(respuesta.data);
        });
    }

    function getAllUnidades(id) {

        obtenerUnidadesTipo(id).then((respuesta) => {
            setDataUnidad(respuesta.data);
        });
    }

    const seCalculaTarifa = () =>{
        setRepetirConceptos(true)
    }



    const headers = API_HEADERS

    function DefaultColumnFilter({
                                     column: {filterValue, preFilteredRows, setFilter},
                                 }) {
        const count = preFilteredRows.length;
        const [showResults, setShowResults] = React.useState(false)
        const onClick = () => setShowResults(!showResults)
        return (
            <div style={{display: "flex"}}>
                <span style={{display: "block", float: "right"}}>
                    <a onClick={onClick}>
                        <i className="fa fa-search"/>
                    </a>
                </span>
                <br></br>
                <span style={{display: "block"}}>
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

    function TableCodigoPostal({columns, data, select, object}) {
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
            prepareRow
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
                style={{maxHeight: "300px", overflow: "auto"}}
            >
                <table className="table" {...getTableProps()}>
                    <thead>
                    {headerGroups.map((headerGroup) => (
                        <tr {...headerGroup.getHeaderGroupProps()}>
                            {headerGroup.headers.map((column) => (

                                <th {...column.getHeaderProps(column.getSortByToggleProps())}>
                                    {column.render("Name")}
                                  
                                    <span>
                                            {column.isSorted ? (
                                                column.isSortedDesc ? (
                                                    <i className="fa fa-caret-up"/>
                                                ) : (
                                                    <i className="fa fa-caret-down"/>
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
                                <tr style={{backgroundColor: row.original.m_nIdCP === select ? "orange" : "white"}}  {...row.getRowProps()}
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

    function TableCiudades({columns, data, select}) {
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
                style={{maxHeight: "300px", overflow: "auto"}}
            >
                <table className="table" {...getTableProps()}>
                    <thead>
                    {headerGroups.map((headerGroup) => (
                        <tr {...headerGroup.getHeaderGroupProps()}>
                            {headerGroup.headers.map(column => (

                                <th {...column.getHeaderProps(column.getSortByToggleProps())}>
                                    {column.render("Name")}
                                    
                                    <span>
                                            {column.isSorted ? (
                                                column.isSortedDesc ? (
                                                    <i className="fa fa-caret-up"/>
                                                ) : (
                                                    <i className="fa fa-caret-down"/>
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
                                <tr style={{backgroundColor: row.original.m_nIdCiudad === select ? "orange" : "white"}} {...row.getRowProps()}
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

    function TableOperadores({columns, data, select}) {
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
                style={{maxHeight: "300px", overflow: "auto"}}
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
                                                    <i className="fa fa-caret-up"/>
                                                ) : (
                                                    <i className="fa fa-caret-down"/>
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
                                <tr style={{backgroundColor: row.original.m_nIdOperador === select ? "orange" : "white"}} {...row.getRowProps()}
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

    function TableTipoUnidad({columns, data, select}) {
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
                               
                                <th {...column.getHeaderProps(column.getSortByToggleProps())}>
                                    {column.render("Name")}
                                    {/* Add a sort direction indicator */}
                                    <span>
                                            {column.isSorted ? (
                                                column.isSortedDesc ? (
                                                    <i className="fa fa-caret-up"/>
                                                ) : (
                                                    <i className="fa fa-caret-down"/>
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
                                <tr style={{backgroundColor: row.original.m_nIdTipoUnidad === select ? "orange" : "white"}} {...row.getRowProps()}
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

    function TableUnidad({columns, data, select}) {
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
                style={{maxHeight: "300px", overflow: "auto"}}
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
                                                    <i className="fa fa-caret-up"/>
                                                ) : (
                                                    <i className="fa fa-caret-down"/>
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
                                <tr style={{backgroundColor: row.original.m_nIdUnidad === select ? "orange" : "white"}} {...row.getRowProps()}
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

    function TableRemitentesDestinatarios({columns, data, select}) {
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
                style={{maxHeight: "300px", overflow: "auto"}}
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
                                                    <i className="fa fa-caret-up"/>
                                                ) : (
                                                    <i className="fa fa-caret-down"/>
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
                                <tr style={{backgroundColor: row.original.m_nIdRemitenteDestinatario === select ? "#FCC88F" : "white"}} {...row.getRowProps()}
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


    if (redirect) {
        if (data.find((o) => o.m_nIdRecoleccion === state.idRecoleccion).m_sFolioEmbarque) {
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

    const handleClickCiudad = (event) => {
        event.preventDefault()
        if (dataCiudad.length === 0) {
            getAllCiudades()
        }
    }

    const saveIdCotizacion = (id) => {
        if (id){
            setState(state => {
                return{
                    ...state,
                    idCotizacion: id
                }
            });
        }
    }

    const handleListPaquetesChange = (newList) => {
        setRepetirConceptos(true)
        setDataPaquetes(newList)
    }

    const dialogVisible = (isVisible) => {
        setState(state => {
            return {
            ...state,
                openDialog: isVisible,
            }
        });
    };

    const setDataListado = (listado) => {
        setPagina(0)
        setData(listado)
    }

    const handleChangeCita = (data) => {
        setState({
            ...state,
            fechaCita: data.fechaCita,
            horaCitaMinima: data.horaCitaMinima,
            horaCitaMaxima: data.horaCitaMaxima,
            citaPendiente: data.citaPendiente
        })
    }

    const handleChangeTipoSeguro = (event) => {
        setRepetirConceptos(true)
        setState(state => {
            return {
                ...state,
                idTipoSeguro: event.target.value,
                porcentajeSeguro: !(seguroClienteActual.idTipoSeguro===event.target.value)?(event.target.value===TIPOS_SEGURO.SEGUN_SOLICITA || event.target.value===TIPOS_SEGURO.OBLIGATORIO)?((state.idTipoSeguro===TIPOS_SEGURO.SEGUN_SOLICITA || state.idTipoSeguro===TIPOS_SEGURO.OBLIGATORIO)  && (event.target.value===TIPOS_SEGURO.SEGUN_SOLICITA || event.target.value===TIPOS_SEGURO.OBLIGATORIO))?state.porcentajeSeguro:configuraciones.porcentualSeguroDefecto:0:seguroClienteActual.porcentajeSeguro,
                aplicaSeguro: (event.target.value === TIPOS_SEGURO.SEGUN_SOLICITA) || (event.target.value === TIPOS_SEGURO.OBLIGATORIO),
                valorDeclarado: 0
            }
        });
    }

    const handleOnChangeEntregaDD = (newValue) => {
        setRepetirConceptos(true)
        setEntregaDD(entregaDD => {
            return{
                ...entregaDD,
                idPais: newValue.idPais,
                idEstado: newValue.idEstado,
                idMunicipio: newValue.idMunicipio,
                codigoPostal: newValue.codigoPostal,
                zonaOperativa: newValue.zonaOperativa,
                domicilio: newValue.domicilio,
                detalles: newValue.detalles,
                datosAdicionales: newValue.datosAdicionales,
                latitud: newValue.latitud,
                longitud: newValue.longitud,
            }
        });
    }

    const handleOnChangeRecoleccionDD = (newValue) => {
        setRepetirConceptos(true)
        setRecoleccionDD(recoleccionDD => {
            return{
                ...recoleccionDD,
                idPais: newValue.idPais,
                pais: newValue.pais,
                idEstado: newValue.idEstado,
                estado: newValue.estado,
                idMunicipio: newValue.idMunicipio,
                municipio: newValue.municipio,
                codigoPostal: newValue.codigoPostal,
                zonaOperativa: newValue.zonaOperativa,
                domicilio: newValue.domicilio,
                detalles: newValue.detalles,
                datosAdicionales: newValue.datosAdicionales,
                latitud: newValue.latitud,
                longitud: newValue.longitud,
            }
        });
    }

    function esEntregaSucursal(aplicaEntrega,idSucursalDestinatario){
        if(aplicaEntrega){
            setRepetirConceptos(true)
            setState(state => {
                return {
                    ...state,
                    aplicaEntrega: aplicaEntrega,
                    entregaEnSucursal: true,
                    // deshabilitarDiferenteDomicilio:true,
                    diferenteEntrega: false
                }
            })
            try{
                getZonaOperativaByCodigoPostal(dataSucursal.find(c => c.m_nIdSucursal === idSucursalDestinatario).m_nIdCodigoPostal)
                setState(state => {
                    return {
                        ...state,
                        idSucursalEntrega: idSucursalDestinatario
                    }
                });
            }
            catch{
                showError("No se encontró la sucursal asociada a este destinatario")
            }
        }
        else{
            setState(state => {
                return {
                ...state,
                    aplicaEntrega:aplicaEntrega,
                    entregaEnSucursal:false,
                    // deshabilitarDiferenteDomicilio:false
                }
            })
        }
    }

    function validarErrores(errores) {
        setErrores(errores)
    }

    const obtenerDatosDireccion = (esRecoleccion) => {
        let esDiferenteDomicilio = state.diferenteRecoleccion
        if (esRecoleccion){
            if (esDiferenteDomicilio){
                return {
                    nombreLugar: remitente.nombreRemitente,
                    numeroInterior: '',
                    numeroExterior: '',
                    calle: recoleccionDD.domicilio,
                    colonia: '',
                    ciudad: recoleccionDD.municipio,
                    estado: recoleccionDD.estado,
                    pais: recoleccionDD.pais,
                    codigoPostal: recoleccionDD.codigoPostal?.m_sCP,
                    direccionCompleta: getAddressFormated(
                        recoleccionDD.domicilio,
                        null,
                        null,
                        null,
                        recoleccionDD.codigoPostal?.m_sCP,
                        recoleccionDD.municipio,
                        recoleccionDD.estado,
                        recoleccionDD.pais
                    )
                }
            }else{
                return {
                    nombreLugar: remitente.nombreRemitente,
                    numeroInterior: remitente.numeroIntRemitente,
                    numeroExterior: remitente.numeroExtRemitente,
                    calle: remitente.calleRemitente,
                    colonia: remitente.coloniaRemitente,
                    ciudad: remitente.municipioTexto,
                    estado: remitente.estadoTexto,
                    pais: remitente.paisTexto,
                    codigoPostal: remitente.codigoPostalRemitente?.m_sCP,
                    direccionCompleta: getAddressFormated(
                        remitente.calleRemitente,
                        remitente.numeroExtRemitente,
                        remitente.numeroIntRemitente,
                        remitente.coloniaRemitente,
                        remitente.codigoPostalRemitente?.m_sCP,
                        remitente.municipioTexto,
                        remitente.estadoTexto,
                        remitente.paisTexto
                    )
                }
            }
        }
    }

    const handleShowImportar = (event) => {
        if (event) {
            event.stopPropagation();
        }
        $('.nav-tabs li ').removeClass('active');
        $('.nav-tabs li').eq(3).addClass('active');
        $('.tab-content div ').removeClass('in show');
        $('#Importar').addClass('in show');
    }

    return (
        <div>
            

            {state.showConfirmarUbicacion &&
                <ConfirmarUbicacion confirmarUbicacion={confirmarUbicacion} open={state.showConfirmarUbicacion}
                                    mostrarDialogoMapa={mostrarDialogoMapa}
                                    titulo={state.titulo}
                                    remitente={true}
                                    direccion={obtenerDatosDireccion(true)}
                />
            }
            <Dialog open={state.openDialog} onClose={() => setState({...state, openDialog: false})} fullWidth
                    maxWidth="md">
                <DialogContent>
                    {state.tipoModal === 0 &&
                        <div className="row" style={{backgroundColor: '#FFFFFF'}}>
                            <div align="right">
                                <button onClick={() => {
                                    history.push("/Ciudades")
                                }} className="btn btn-primary primary-btn">Agregar
                                </button>

                            </div>

                            {dataCodigosPostalesRemitente.length !== 0 ? <TableCodigoPostal object={state}
                                                                                            select={state[state.identificadorModal] && state[state.identificadorModal].m_nIdCP}
                                                                                            columns={columnsCP}
                                                                                            data={dataCodigosPostalesRemitente.filter((cp) => cp.m_nIdCiudad === state.ciudadRemitente)}
                                                                                            identificadorModal={state.identificadorModal}/> :
                                <div>No se encontró ningún registro</div>}

                            <DialogActions style={{justifyContent: "left"}}>

                                <button onClick={() => setState({...state, openDialog: false})}
                                        className="btn btn-primary primary-btn">Aceptar
                                </button>
                                <button onClick={() => setState({...state, openDialog: false})}
                                        className="btn btn-secondary secondary-btn">Cerrar
                                </button>

                            </DialogActions>
                        </div>
                    }
                    {state.tipoModal === 7 &&
                        <div className="row" style={{backgroundColor: '#FFFFFF'}}>
                            <div align="right">
                                <button onClick={() => {
                                    history.push("/Ciudades")
                                }} className="btn btn-primary primary-btn">Agregar
                                </button>

                            </div>

                            {dataCodigosPostalesDestinatario.length !== 0 ? <TableCodigoPostal object={state}
                                                                                               select={state[state.identificadorModal] && state[state.identificadorModal].m_nIdCP}
                                                                                               columns={columnsCP}
                                                                                               data={dataCodigosPostalesDestinatario.filter((cp) => cp.m_nIdCiudad === state.ciudadDestinatario)}
                                                                                               identificadorModal={state.identificadorModal}/> :
                                <div>No se encontró ningún registro</div>}

                            <DialogActions style={{justifyContent: "left"}}>

                                <button onClick={() => setState({...state, openDialog: false})}
                                        className="btn btn-primary primary-btn">Aceptar
                                </button>
                                <button onClick={() => setState({...state, openDialog: false})}
                                        className="btn btn-secondary secondary-btn">Cerrar
                                </button>

                            </DialogActions>
                        </div>
                    }
                    {state.tipoModal === 8 &&
                        <div className="row" style={{backgroundColor: '#FFFFFF'}}>
                            <div align="right">
                                <button onClick={() => {
                                    history.push("/Ciudades")
                                }} className="btn btn-primary primary-btn">Agregar
                                </button>

                            </div>

                            {dataCodigosPostalesRecoleccionDD.length !== 0 ? <TableCodigoPostal object={state}
                                                                                                select={state[state.identificadorModal] && state[state.identificadorModal].m_nIdCP}
                                                                                                columns={columnsCP}
                                                                                                data={dataCodigosPostalesRecoleccionDD.filter((cp) => cp.m_nIdCiudad === state.ciudadRecoleccion)}
                                                                                                identificadorModal={state.identificadorModal}/> :
                                <div>No se encontró ningún registro</div>}

                            <DialogActions style={{justifyContent: "left"}}>

                                <button onClick={() => setState({...state, openDialog: false})}
                                        className="btn btn-primary primary-btn">Aceptar
                                </button>
                                <button onClick={() => setState({...state, openDialog: false})}
                                        className="btn btn-secondary secondary-btn">Cerrar
                                </button>

                            </DialogActions>
                        </div>
                    }
                    {state.tipoModal === 9 &&
                        <div className="row" style={{backgroundColor: '#FFFFFF'}}>
                            <div align="right">
                                <button onClick={() => {
                                    history.push("/Ciudades")
                                }} className="btn btn-primary primary-btn">Agregar
                                </button>

                            </div>

                            {dataCodigosPostalesEntregaDD.length !== 0 ? <TableCodigoPostal object={state}
                                                                                            select={state[state.identificadorModal] && state[state.identificadorModal].m_nIdCP}
                                                                                            columns={columnsCP}
                                                                                            data={dataCodigosPostalesEntregaDD.filter((cp) => cp.m_nIdCiudad === state.ciudadEntrega)}
                                                                                            identificadorModal={state.identificadorModal}/> :
                                <div>No se encontró ningún registro</div>}

                            <DialogActions style={{justifyContent: "left"}}>

                                <button onClick={() => setState({...state, openDialog: false})}
                                        className="btn btn-primary primary-btn">Aceptar
                                </button>
                                <button onClick={() => setState({...state, openDialog: false})}
                                        className="btn btn-secondary secondary-btn">Cerrar
                                </button>

                            </DialogActions>
                        </div>
                    }
                    {state.tipoModal === 1 &&
                        <div className="row" style={{backgroundColor: '#FFFFFF'}}>
                            <div align="right">
                                <button onClick={() => {
                                    history.push("/Ciudades")
                                }} className="btn btn-primary primary-btn">Agregar
                                </button>

                            </div>

                            {dataCiudad.length !== 0 ? <TableCiudades object={state}
                                                                      select={state[state.identificadorModal] && state[state.identificadorModal].m_nIdCiudad}
                                                                      columns={columnsCiudades} data={dataCiudad}
                                                                      identificadorModal={state.identificadorModal}/> :
                                <div>No se encontró ningún registro</div>}


                            <DialogActions style={{justifyContent: "left"}}>

                                <button onClick={() => setState({...state, openDialog: false})}
                                        className="btn btn-primary primary-btn">Aceptar
                                </button>
                                <button onClick={() => setState({...state, openDialog: false})}
                                        className="btn btn-secondary secondary-btn">Cerrar
                                </button>

                            </DialogActions>
                        </div>
                    }
                    {state.tipoModal === 2 &&
                        <div className="row" style={{backgroundColor: '#FFFFFF'}}>
                            <div align="right">
                                <button onClick={() => {
                                    history.push("/Operador")
                                }} className="btn btn-primary primary-btn">Agregar
                                </button>

                            </div>

                            {dataOperador.length !== 0 ? <TableOperadores object={state}
                                                                          select={state[state.identificadorModal] && state[state.identificadorModal].m_nIdOperador}
                                                                          columns={columnsOperadores} data={dataOperador}
                                                                          identificadorModal={state.identificadorModal}/> :
                                <div>No se encontró ningún registro</div>}

                            <DialogActions style={{justifyContent: "left"}}>

                                <button onClick={() => setState({...state, openDialog: false})}
                                        className="btn btn-primary primary-btn">Aceptar
                                </button>
                                <button onClick={() => setState({...state, openDialog: false})}
                                        className="btn btn-secondary secondary-btn">Cerrar
                                </button>

                            </DialogActions>
                        </div>
                    }
                    {state.tipoModal === 3 &&
                        <div className="row" style={{backgroundColor: '#FFFFFF'}}>
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
                                                                            identificadorModal={state.identificadorModal}/> :
                                <div>No se encontró ningún registro</div>}

                            <DialogActions style={{justifyContent: "left"}}>

                                <button onClick={() => setState({...state, openDialog: false})}
                                        className="btn btn-primary primary-btn">Aceptar
                                </button>
                                <button onClick={() => setState({...state, openDialog: false})}
                                        className="btn btn-secondary secondary-btn">Cerrar
                                </button>

                            </DialogActions>
                        </div>
                    }
                    {state.tipoModal === 4 &&
                        <div className="row" style={{backgroundColor: '#FFFFFF'}}>
                            <div align="right">
                                <button onClick={() => {
                                    history.push("/Unidades")
                                }} className="btn btn-primary primary-btn">Agregar
                                </button>

                            </div>

                            {dataUnidad.length !== 0 ? <TableUnidad object={state}
                                                                    select={state[state.identificadorModal] && state[state.identificadorModal].m_nIdUnidad}
                                                                    columns={columnsUnidades} data={dataUnidad}
                                                                    identificadorModal={state.identificadorModal}/> :
                                <div>No se encontró ningún registro</div>}

                            <DialogActions style={{justifyContent: "left"}}>
                                <button onClick={() => setState({...state, openDialog: false})}
                                        className="btn btn-primary primary-btn">Aceptar
                                </button>
                                <button onClick={() => setState({...state, openDialog: false})}
                                        className="btn btn-secondary secondary-btn">Cerrar
                                </button>

                            </DialogActions>
                        </div>
                    }
                    {state.tipoModal === 5 &&
                        <div className="row" style={{backgroundColor: '#FFFFFF'}}>
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
                                                                                                    identificadorModal={state.identificadorModal}/> :
                                <div>No se encontró ningún registro</div>}

                            <DialogActions style={{justifyContent: "left"}}>

                                <button onClick={() => setState({...state, openDialog: false})}
                                        className="btn btn-primary primary-btn">Aceptar
                                </button>
                                <button onClick={() => setState({...state, openDialog: false})}
                                        className="btn btn-secondary secondary-btn">Cerrar
                                </button>

                            </DialogActions>
                        </div>
                    }
                    {state.tipoModal === 10 &&
                        <div className="row" style={{backgroundColor: '#FFFFFF'}}>
                            <DialogTableClientes dialogVisible={dialogVisible } handlePatrocinadorSelected={handlePatrocinadorSelected}/>
                        </div>
                    }
                </DialogContent>

            </Dialog>

            <header className="topbar clearfix">
                <Cabecera titulo="Recolección">
                    <div className="page-header">
                        <ul className="list-page-breadcrumb">
                            <li className="active-page">Recolección</li>
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
                            <a   data-toggle="tab" onClick={(event) => handleShowListado(event)}>
                                <i className="fa fa-list"/> Listado
                            </a>
                        </li>

                        <li>
                            <a className={validarDerecho(9101414)?"":"hide"} data-toggle="tab" onClick={handleShowAgregar}>
                                <i className="fa fa-plus-circle"/> {state.agregar}
                            </a>
                        </li>

                        <li>
                            <a className={(state.idRecoleccion === 0 || !validarDerecho(9101420)) ? classes.disabled : ""} onClick={handleShowCancelar}>
                                <i className="fa fa-ban"/> Cancelar
                            </a>
                        </li>

                        <li>
                            <a onClick={() => handleShowImportar()}>
                                <i className="fa fa-print"/> Importar
                            </a>
                        </li>


                        <li style={{float: "right"}}>
                        <Button className={ state.idRecoleccion === 0 || (!validarDerecho(9101417) ) ? classes.disabled :""}
                                fullWidth color={"primary"} style={{fontSize: "1em"}}
                                variant={"contained"} onClick={() => setRedirect(true)}>
                            Generar Embarque
                        </Button>
                        </li>

                        {/**<button className="topbar-right pull-right">Boton</button>*/}
                    </ul>

                    <div
                        className="row tab-content"
                        style={{paddingLeft: "-15px"}}
                    >
                        <div id="Listado" className="tab-pane fade in show">
                            <div className="widget-wrap">

                                <div className="widget-content">
                                    <div className="row">
                                        <div className="col-md-12">
                                            <Filtros
                                                listaResultado={setDataListado}
                                                listadoSucursales={setDataSucursal}
                                                recoleccion={true}
                                            />
                                        </div>
                                    </div>
                                </div>

                                <div className="row" style={{height: state.height - 250, width: '100%'}}>
                                    <DataGrid
                                        localeText={dataGridLocaleText}
                                        className={classes.root}
                                        onSortModelChange={(model) => setSortModel(model)}
                                        rows={data}
                                        pagination
                                        rowsPerPageOptions={[]}
                                        page={pagina}
                                        onPageChange={(newPage) => {
                                            setPagina(newPage.page)
                                        }}
                                        columns={columns}
                                        density="compact"
                                        pageSize={Math.floor((state.height - 310) / 30)}
                                        getRowId={(row) => row.m_nIdRecoleccion}
                                        onRowSelectionModelChange={(newModel)=>{
                                            if(newModel.length<1)
                                                return
                                            let rowSelect=data.find(i=>i.m_nIdRecoleccion==newModel[0])
                                            setState({
                                                ...state,
                                                idRecoleccion: rowSelect.m_nIdRecoleccion,
                                            })
                                        }}
                                    />
                                </div>
                            </div>

                        </div>

                        <div onClick={()=>setDetectar(true)} id="Agregar" className="tab-pane fade">
                            <form className="j-forms" onSubmit={handleAceptar} onKeyDown={e => {if(e.code === 13) {e.preventDefault()}}}>
                                <div className="form-content" >
                                   

                                    <div className="widget-wrap" id="informacionGeneral">
                                        <div className="widget-header">
                                            <h2>Información General</h2>
                                        </div>
                                        <div className="widget-container">
                                            <div className="widget-content">
                                                <div className="row ">
                                                    <div className="col-sm-6 col-md-2-5 col-lg-2-5 unit">
                                                        {" "}
                                                        <label className="input select">
                                                            <FormControl fullWidth variant="outlined"
                                                                         size="small">
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

                                                                    disabled
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
                                                            <TextField variant="outlined" size="small"
                                                                       onChange={handleChange}
                                                                       className="form-control"
                                                                       type="text"
                                                                       fullWidth
                                                                       label="Folio Recolección"
                                                                       value={state.folioRecoleccion}
                                                                       id="folioRecoleccion"
                                                                       readOnly
                                                                       disabled
                                                            />
                                                        </div>
                                                    </div>

                                                    <div className="col-sm-6 col-md-2-5 col-lg-2-5 unit">
                                                        <div className="input">
                                                            <TextField variant="outlined" size="small"
                                                                       onChange={handleChange}
                                                                       className="form-control"
                                                                       type="text"
                                                                       fullWidth
                                                                       label="Folio Embarque"
                                                                       value={state.folioEmbarque}
                                                                       id="folioEmbarque"
                                                                       readOnly
                                                                       disabled
                                                            />
                                                        </div>
                                                    </div>

                                                    <div className="col-sm-6 col-md-2-5 col-lg-2-5 unit">
                                                        <div className="input">
                                                            <TextField variant="outlined" size="small"
                                                                       onChange={handleChange}
                                                                       className="form-control"
                                                                       type="text"
                                                                       fullWidth
                                                                       label="Folio Guía"
                                                                       value={state.folioGuia}
                                                                       id="folioGuia"
                                                                       readOnly
                                                                       disabled
                                                            />
                                                        </div>
                                                    </div>

                                                    <div className="col-sm-6 col-md-2-5 col-lg-2-5 unit">
                                                        <div className="input">
                                                            <TextField variant="outlined" size="small"
                                                                       onChange={handleChange}
                                                                       className="form-control"
                                                                       type="text"
                                                                       fullWidth
                                                                       label="Folio Informe"
                                                                       value={state.folioInforme}
                                                                       id="folioInforme"
                                                                       readOnly
                                                                       disabled
                                                            />
                                                        </div>
                                                    </div>

                                                    <div className="col-sm-6 col-md-2-5 col-lg-2-5 unit">
                                                        <div className="input">
                                                            <TextField variant="outlined" size="small"
                                                                       onChange={handleChange}
                                                                       required
                                                                       fullWidth
                                                                       label="Fecha / Hora de Registro"
                                                                       InputLabelProps={{
                                                                           shrink: true,
                                                                       }}
                                                                       value={state.fechaHoraRegistro}
                                                                       className="form-control"
                                                                       id="fechaHoraRegistro"
                                                                       type="datetime-local"
                                                                       disabled

                                                            />
                                                        </div>
                                                    </div>

                                                    <div className="col-sm-6 col-md-2-5 col-lg-2-5 unit">

                                                        <label className="input select">
                                                            <FormControl fullWidth variant="outlined"
                                                                         size="small">
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
                                                                    disabled={state.agregar === "Consultar" || state.recoleccionConEmbarque}
                                                                    id="estatusRecoleccion"
                                                                >
                                                                    {dataEstatusRecoleccion.map((estatus) => (
                                                                        <MenuItem
                                                                            key={estatus.m_nIdEstatusRecoleccion}
                                                                            value={estatus.m_nIdEstatusRecoleccion}
                                                                        >
                                                                            {estatus.m_sEstatus}
                                                                        </MenuItem>
                                                                    ))}
                                                                </Select>
                                                            </FormControl>
                                                            <i></i>
                                                        </label>
                                                    </div>

                                                    <div className="col-sm-6 col-md-2-5 col-lg-2-5 unit">
                                                        <label className="input select">
                                                            <FormControl fullWidth variant="outlined"
                                                                         size="small">
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
                                                                    disabled={state.agregar === "Consultar" || state.recoleccionConEmbarque}
                                                                    id="moneda"
                                                                >
                                                                    {dataTipoMoneda.map((moneda) => (
                                                                        <MenuItem
                                                                            key={moneda.m_nIdMoneda}
                                                                            value={moneda.m_nIdMoneda}
                                                                        >
                                                                            {moneda.m_sMoneda}
                                                                        </MenuItem>
                                                                    ))}
                                                                </Select>
                                                            </FormControl>
                                                            <i className="fa fa-arrow-down"/>
                                                        </label>
                                                    </div>

                                                    <div className="col-sm-6 col-md-2-5 col-lg-2-5 unit">
                                                        <label className="input select">
                                                            <FormControl fullWidth variant="outlined"
                                                                         size="small">
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
                                                                    disabled={state.agregar === "Consultar" || state.recoleccionConEmbarque}
                                                                    id="tipoCambio"
                                                                >
                                                                    {dataTipoCambio.map((cambio) => (
                                                                        <MenuItem
                                                                            key={cambio.m_nIdTipoCambio}
                                                                            value={cambio.m_nIdTipoCambio}
                                                                        >
                                                                            {cambio.m_cTipoCambio.toFixed(4)}
                                                                        </MenuItem>
                                                                    ))}
                                                                </Select>
                                                            </FormControl>
                                                            <i className="fa fa-arrow-down"/>
                                                        </label>
                                                    </div>
                                                    <div className="col-sm-6 col-md-2-5 col-lg-2-5 unit">
                                                        <label className="input select">
                                                            <FormControl fullWidth variant="outlined" required
                                                                         size="small">
                                                                <InputLabel id="idTipoCobroLabel">Tipo
                                                                    Cobro</InputLabel>
                                                                <Select
                                                                    labelId={"idTipoCobroLabel"}
                                                                    label={"Tipo Cobro"}
                                                                    className="form-control"
                                                                    value={state.tipoCobro}
                                                                    disabled={state.agregar === "Consultar" || state.recoleccionConEmbarque}
                                                                    onChange={(event) => {
                                                                        event.preventDefault();
                                                                        setState({
                                                                            ...state,
                                                                            tipoCobro: event.target.value,
                                                                        });
                                                                    }}
                                                                    id="tipoCobro"
                                                                    inputProps={{
                                                                        id: "tipoCobro",
                                                                        name: "tipoCobro"
                                                                    }}
                                                                >
                                                                    {dataTipoCobro.filter(item => configuraciones.idsTiposCobroSeleccionArray.find(i => i === item.m_nCodigo)).map((tipoCobro) => (
                                                                        <MenuItem
                                                                            key={tipoCobro.m_nIdTipoCobro}
                                                                            value={tipoCobro.m_nIdTipoCobro}
                                                                        >
                                                                            {tipoCobro.m_sDescripcion}
                                                                        </MenuItem>
                                                                    ))}
                                                                </Select>
                                                            </FormControl>
                                                        </label>
                                                    </div>
                                                    <Grid container spacing={2} style={{marginBottom:'10px'}}>
                                                        <Grid item xs>
                                                            <div className="input">
                                                                <TextField
                                                                    variant="outlined"
                                                                    label="Responsable de pago"
                                                                    size="small"
                                                                    required
                                                                    disabled={state.agregar === "Consultar" || state.recoleccionConEmbarque}
                                                                    value={state.clientePaga.m_sNombreFiscal}
                                                                    error={state.clientePaga.m_bCreditoVencido && !state.clientePaga.m_bSinCredito}
                                                                    helperText={ (state.clientePaga.m_bCreditoVencido && !state.clientePaga.m_bSinCredito) ? "El cliente presenta saldo vencido. Días de crédito: " + state.clientePaga.m_nDiasCredito : ""}
                                                                    placeholder={"No. Cliente: Nombre fiscal"}
                                                                    InputLabelProps={{shrink: true}}
                                                                    onClick={(state.agregar === "Consultar" || state.embarqueConGuia)?
                                                                        ()=>{return}:(()=>{ setState({ ...state, openDialog: true,tipoModal:10})
                                                                        })}
                                                                />
                                                            </div>
                                                        </Grid>
                                                        <Grid item xs>
                                                            <div className="input">
                                                                <TextField
                                                                    name="idTipoSeguro"
                                                                    id="idTipoSeguro"
                                                                    select
                                                                    required
                                                                    label="Tipo seguro"
                                                                    value={state.idTipoSeguro}
                                                                    onChange={handleChangeTipoSeguro}
                                                                    variant="outlined"
                                                                    disabled={state.agregar === "Consultar" || state.recoleccionConEmbarque}
                                                                >
                                                                    {dataTiposSeguro.map((option) => (
                                                                        <MenuItem key={option.m_nIdTipoSeguro} value={option.m_nIdTipoSeguro}>
                                                                            {option.m_sDescripcion}
                                                                        </MenuItem>
                                                                    ))}
                                                                </TextField>
                                                            </div>
                                                        </Grid>
                                                        <Grid item xs>
                                                            <div className="input">
                                                                <TextField variant="outlined" size="small"
                                                                           className="form-control"
                                                                           type="number"
                                                                           required
                                                                           fullWidth
                                                                           disabled={state.agregar === "Consultar" || !state.aplicaSeguro || state.recoleccionConEmbarque}
                                                                           label="Porcentaje de seguro"
                                                                           onChange={handleChange}
                                                                           value={state.porcentajeSeguro}
                                                                           placeholder="%"
                                                                           id="porcentajeSeguro"
                                                                           name="porcentajeSeguro"
                                                                           InputProps={{
                                                                               endAdornment: <InputAdornment position="start">%</InputAdornment>,
                                                                           }}
                                                                />
                                                            </div>
                                                        </Grid>
                                                        <Grid item xs>
                                                            <div className="input">
                                                                <TextField variant="outlined" size="small"
                                                                           className="form-control"
                                                                           type="number"
                                                                           fullWidth
                                                                           required
                                                                           disabled={(state.agregar === "Consultar") || configuraciones.fijarCapturaValorDeclarado ? false : !state.aplicaSeguro || state.recoleccionConEmbarque}
                                                                           label="Valor Declarado"
                                                                           onChange={(event) => {
                                                                               event.preventDefault();
                                                                               setRepetirConceptos(true)
                                                                               setState({
                                                                                   ...state,
                                                                                   valorDeclarado: event.target.value,
                                                                               });
                                                                           }}
                                                                           value={state.valorDeclarado}
                                                                           placeholder="$"
                                                                           name="valorDeclarado"
                                                                           id="valorDeclarado"
                                                                           InputProps={{
                                                                               startAdornment: <InputAdornment position="start">$</InputAdornment>,
                                                                           }}
                                                                />
                                                            </div>
                                                        </Grid>
                                                    </Grid>
                                                    <Grid container spacing={2} style={{marginBottom:'10px'}}>
                                                        <Grid item xs={6}>
                                                            <TextField
                                                                variant="outlined"
                                                                size="small"
                                                                className="form-control"
                                                                type= "text"
                                                                label="Observaciones"
                                                                value={state.observaciones}
                                                                fullWidth
                                                                onChange={(event) => {
                                                                    event.preventDefault();
                                                                    setState({
                                                                        ...state,
                                                                        observaciones: event.target.value,
                                                                    });
                                                                }}
                                                                disabled={state.agregar === "Consultar" || state.recoleccionConEmbarque}
                                                                id="observaciones"
                                                                name="observaciones"
                                                                placeholder={"sin observaciones"}
                                                                InputLabelProps={{shrink: true}}
                                                            />
                                                        </Grid>
                                                        <Grid item xs={3}>
                                                            <TextField
                                                                variant="outlined"
                                                                label="Referencia"
                                                                size="small"
                                                                type="text"
                                                                fullWidth
                                                                disabled={state.agregar === "Consultar"}
                                                                value={state.referencia}
                                                                onChange={(event) => {
                                                                    event.preventDefault();
                                                                    setState({
                                                                        ...state,
                                                                        referencia: event.target.value,
                                                                    });
                                                                }}
                                                                name="referencia"
                                                                id="referencia"
                                                            />
                                                        </Grid>
                                                    </Grid>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="widget-wrap" id="paquetesSobres">
                                        <div className="widget-header">
                                            <h2>Paquetes</h2>
                                        </div>
                                        <Paquetes
                                            dataPaquetes={dataPaquetes}
                                            setDataPaquetes={(arrayNuevo)=>{
                                                setDataPaquetes(arrayNuevo)
                                                setRepetirConceptos(true)
                                            }}
                                            onChangeList={handleListPaquetesChange}
                                            disabled={state.agregar === "Consultar" || state.recoleccionConEmbarque}
                                            cliente={state.clientePaga}
                                            seCalculaTarifa={seCalculaTarifa}
                                            limpiarProducto={configuraciones.limpiarProducto}
                                            tipoTarifa={parseInt(configuraciones.tipoTarifa)}
                                            factorConversion={configuraciones.factorConversion}
                                        />
                                    </div>
                                    <div className="widget-wrap" id="complementosSat">
                                        <ComplementosSAT
                                            dataList={dataComplementosSAT}
                                            setDataList={(arrayNuevo)=>setDataComplementosSAT(arrayNuevo)}
                                            onChangeList={handleListComplementosSATChange}
                                            disabled={state.agregar === "Consultar" || state.recoleccionConEmbarque}
                                        />
                                    </div>

                                    <div className="row ">
                                        <div className="widget-wrap" id="remitenteDestinatario">
                                            <div className="row">
                                                <div className="col-md-6">
                                                    <div className="widget-header">
                                                        <h2>Remitente</h2>
                                                    </div>
                                                    <div className="widget-container">
                                                        <div className="widget-content">
                                                            {
                                                                (tabActiva === 1) &&
                                                                <RemitentesDestinatarios
                                                                    remitente={true}
                                                                    componentePadre={"Recoleccion"}
                                                                    consulta={state.agregar === "Consultar" || state.recoleccionConEmbarque}
                                                                    modificar={state.agregar === "Modificar"}
                                                                    agregar={state.agregar === "Agregar"}
                                                                    mostrarZonas={!state.diferenteRecoleccion}
                                                                    dataRemitenteDestinatario={dataRemitenteDestinatario}
                                                                    dataEstados={dataEstados}
                                                                    dataCiudad={dataCiudad}
                                                                    handleClickRemitenteDestinatario={handleClickRemitenteDestinatario}
                                                                    handleClickCiudad={handleClickCiudad}
                                                                    handleDataChange={handleChangeRemitente}
                                                                    dataPadreConsulta={dataRecoleccionConsulta}
                                                                    limpiarRemDes={limpiarRemDes}
                                                                    seCalculaTarifa={seCalculaTarifa}

                                                                />
                                                            }
                                                        </div>
                                                        <div className="row">
                                                            <div style={{width:'70%'}}>
                                                                {/* --------------------------------------- RecoleccionDD ------------------------------------------------- */}
                                                                <div className="col-sm-7 col-md-7 unit">
                                                                    <label className="checkbox">
                                                                        <input
                                                                            onChange={
                                                                                handleRecoleccionCheckboxChange
                                                                            }
                                                                            className="form-control"
                                                                            disabled={state.agregar === "Consultar" || state.recoleccionConEmbarque}
                                                                            checked={state.diferenteRecoleccion}
                                                                            type="checkbox"
                                                                            style={{height: "20px"}}
                                                                            id="diferenteRecoleccion"
                                                                        />
                                                                        <i/>
                                                                        Recolección en Diferente Domicilio
                                                                    </label>
                                                                </div>
                                                            </div>
                                                        </div>

                                                        <div className="row">
                                                            <div style={{width:'70%'}}>
                                                                <div className="col-sm-7 col-md-7 unit">
                                                                    <label className="checkbox">
                                                                        <input
                                                                            onChange={handleCitaCheckboxChange}
                                                                            className="form-control"
                                                                            disabled={state.agregar === "Consultar"}
                                                                            checked={state.recoleccionConCita}
                                                                            type="checkbox"
                                                                            style={{height: "20px"}}
                                                                            id="recoleccionConCita"
                                                                        />
                                                                        <i/>
                                                                        Programar cita de recolección
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
                                                            {
                                                                (tabActiva === 1) &&
                                                                <RemitentesDestinatarios
                                                                    destinatario={true}
                                                                    componentePadre={"Recoleccion"}
                                                                    consulta={state.agregar === "Consultar" || state.recoleccionConEmbarque}
                                                                    modificar={state.agregar === "Modificar"}
                                                                    agregar={state.agregar === "Agregar"}
                                                                    mostrarZonas={!state.diferenteEntrega && !state.entregaEnSucursal}
                                                                    dataRemitenteDestinatario={dataRemitenteDestinatario}
                                                                    dataEstados={dataEstados}
                                                                    dataCiudad={dataCiudad}
                                                                    handleClickRemitenteDestinatario={handleClickRemitenteDestinatario}
                                                                    handleClickCiudad={handleClickCiudad}
                                                                    handleDataChange={handleChangeDestinatario}
                                                                    dataPadreConsulta={dataRecoleccionConsulta}
                                                                    limpiarRemDes={limpiarRemDes}
                                                                    seCalculaTarifa={seCalculaTarifa}
                                                                    soloEntregaSucursal={esEntregaSucursal}
                                                                    entregaDomicilioDestinatario={!state.entregaEnSucursal && !state.diferenteEntrega}
                                                                />
                                                            }
                                                            <div className="row">
                                                                <div style={{width:'70%'}}>
                                                                    <div className="col-sm-7 col-md-7 unit">
                                                                        <label className="checkbox" style={state.aplicaEntrega?{color:'#ccc'}:{color:"black"}}>
                                                                            <input
                                                                                onChange={handleEntregaCheckboxChange}
                                                                                className="form-control"
                                                                                disabled={state.agregar === "Consultar" || state.recoleccionConEmbarque || state.aplicaEntrega/*|| state.deshabilitarDiferenteDomicilio*/}
                                                                                // value={state.diferenteEntrega}
                                                                                checked={state.diferenteEntrega}
                                                                                type="checkbox"
                                                                                style={{height: "20px"}}
                                                                                id="diferenteEntrega"
                                                                            />
                                                                            <i/>
                                                                            Entrega en Diferente Domicilio
                                                                        </label>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                            <div className="row">
                                                                <div style={{width:'70%'}}>
                                                                    <div className="col-sm-7 col-md-7 unit" >
                                                                        <label className="checkbox" style={state.aplicaEntrega?{color:'orange'}:{color:"black"}}>
                                                                            Entrega en Sucursal
                                                                            <input
                                                                                onChange={handleEntregaEnSucursalCheckbox}
                                                                                className="form-control"
                                                                                type="checkbox"
                                                                                checked={state.entregaEnSucursal}
                                                                                style={{ height: "20px" }}
                                                                                disabled={state.agregar === "Consultar" || state.recoleccionConEmbarque || state.aplicaEntrega/*|| state.deshabilitarDiferenteDomicilio*/}
                                                                                id="entregaEnSucursal"
                                                                            />
                                                                            <i />
                                                                        </label>

                                                                    </div>
                                                                </div>

                                                                   {  state.aplicaEntrega && <>



                                                                        <div style={{marginTop:"10px",color:"red"}}>No se realizará entrega de última milla</div>



                                                                    </>}
                                                            </div>



                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                    </div>

                                    <div className="col-md-12">
                                        {state.entregaEnSucursal ? (
                                            <div className="widget-wrap" id="detallesRecoleccion">
                                                <div>
                                                    <div className="widget-header">
                                                        <h2>Entrega en sucursal</h2>
                                                    </div>
                                                    <div className="widget-container">
                                                        <div className="widget-content">
                                                            <div className="row">
                                                                <Grid container spacing={1}>
                                                                    <Grid item xs={12} sm={6}>
                                                                        <label className="input select">
                                                                            <FormControl
                                                                                fullWidth
                                                                                variant="outlined"
                                                                                size="small"
                                                                                required={state.entregaEnSucursal}
                                                                            >
                                                                                <InputLabel id="idSucursalEntrega">
                                                                                    Sucursal de Entrega
                                                                                </InputLabel>
                                                                                <Select
                                                                                    labelId={"idSucursalEntrega"}
                                                                                    label="Sucursal de Entrega"
                                                                                    className="form-control"
                                                                                    required={state.entregaEnSucursal}
                                                                                    onChange={handleChangeSucursalEntrega}
                                                                                    value={state.idSucursalEntrega}
                                                                                    disabled={state.agregar === "Consultar"}
                                                                                    id="idSucursalEntrega"
                                                                                    name="idSucursalEntrega"
                                                                                    inputProps={{
                                                                                        name: "idSucursalEntrega",
                                                                                    }}
                                                                                >
                                                                                    {dataSucursal.map((sucursal) => (
                                                                                        <MenuItem
                                                                                            key={sucursal.m_nIdSucursal}
                                                                                            value={sucursal.m_nIdSucursal}

                                                                                            // value={sucursal}
                                                                                        >
                                                                                            {sucursal.m_sSucursal}
                                                                                        </MenuItem>
                                                                                    ))}
                                                                                </Select>
                                                                            </FormControl>
                                                                        </label>
                                                                    </Grid>
                                                                    <Grid item xs={12} sm={6}>
                                                                        <TextField variant="outlined"
                                                                                   size="small"
                                                                                   className="form-control"
                                                                                   type="text"
                                                                                   label="Zona operativa"
                                                                                   value={state.zonaOperativaSucursal?.m_sCodigoZona || "NO DETERMINDADA"}
                                                                                   disabled
                                                                        />
                                                                    </Grid>

                                                                </Grid>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        ) : (
                                            <div />
                                        )}
                                        {state.recoleccionConCita &&
                                            <div className="widget-wrap" id="citaRecoleccion">
                                                <Citas titulo={"Programar cita de la Recolección"}
                                                       onDataChange={handleChangeCita}
                                                       dataPadreConsulta={dataRecoleccionConsulta}
                                                       recoleccion={true}
                                                       disabled={state.agregar === "Consultar"}
                                                       required={state.recoleccionConCita}
                                                />
                                            </div>
                                        }

                                        {state.diferenteRecoleccion &&
                                            <div className="widget-wrap" id="detallesRecoleccion">
                                                <div>
                                                    <div className="widget-header">
                                                        <h2>Detalles de la Recolección</h2>
                                                    </div>
                                                    <div className="widget-container">
                                                        <div className="widget-content">
                                                            <div className="row">
                                                                <DiferenteDomicilioForm
                                                                    value={recoleccionDD}
                                                                    onChange={handleOnChangeRecoleccionDD}
                                                                    disabled={false}
                                                                    requiered={false}
                                                                    dataEstados={dataEstados}
                                                                />
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        }
                                        {state.diferenteEntrega &&
                                        <div className="widget-wrap" id="detallesRecoleccion">
                                            <div>
                                                <div className="widget-header">
                                                    <h2>Entrega en diferente domicilio</h2>
                                                </div>
                                                <div className="widget-container">
                                                    <div className="widget-content">
                                                        <div className="row">
                                                            <DiferenteDomicilioForm
                                                                value={entregaDD}
                                                                onChange={handleOnChangeEntregaDD}
                                                                disabled={false}
                                                                requiered={false}
                                                                dataEstados={dataEstados}
                                                            />
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        }

                                    </div>



                                    <div className="row">
                                        <Cotizador embarque={state}
                                                   disabled={state.agregar === "Consultar"}
                                                   remitente={remitente}
                                                   destinatario={destinatario}
                                                   onChangeConceptosList={actualizarConceptos}
                                                   conceptos={dataConceptos}
                                                   saveIdCotizacion={saveIdCotizacion}
                                                   recoleccion={true}
                                                   errores={errores}
                                                   validarErrores={validarErrores}
                                                   recoleccionDiferenteDom={recoleccionDD}
                                                   mostrarCotizadorRec={mostrarCotizadorRec}
                                                   entregaDiferenteDom={entregaDD}
                                                   setCalculoTarifa={()=>setRepetirConceptos(false)}
                                                   paquetes={dataPaquetes.map(p =>({
                                                       Tipo: p.m_nIdTipo,
                                                       Peso: p.m_rPeso,
                                                       Largo: p.m_rLargo,
                                                       Ancho: p.m_rAncho,
                                                       Alto:p.m_rAlto,
                                                       Volumen:p.m_rVolumen,
                                                       IdTipoEmpaque:p.m_nIdTipoEmbalaje,
                                                       Activo: 1,
                                                       ctd:p.m_nCantidad,
                                                       IdProducto:p.m_nIdProducto
                                                   }))} />
                                    </div>




                                    <div className="form-footer ol-md-12">
                                    <Grid container spacing={1}>
                                        <Grid item xs>
                                            <Button fullWidth className="btn btn-secondary secondary-btn" color={"secondary"} variant={"contained"} onClick={(event) => {
                                                event.stopPropagation();
                                                setState({...state, agregar: "Agregar"});
                                                setErrores([])
                                                $('.nav-tabs li ').removeClass('active');
                                                $('.nav-tabs li').eq(0).addClass('active');
                                                $('.tab-content div ').removeClass('in show');
                                                $('#Listado').addClass('in show');
                                            }} style={{color: "white"}}>
                                                Cancelar
                                            </Button>
                                        </Grid>
                                        <Grid item xs>
                                        <Button fullWidth
                                            type="submit"
                                            className="btn btn-primary primary-btn"
                                            disabled={state.agregar === "Consultar"}
                                        >
                                            GUARDAR RECOLECCIÓN
                                        </Button>

                                        </Grid>
                                    </Grid>
                                </div>


                                </div>
                                {
                                    state.agregar !== "Agregar" &&
                                    <div className="row">
                                        <div className="widget-wrap">
                                            <div className="widget-container">
                                                <Evidencias esRecoleccion={1}
                                                            idGuia={state.idRecoleccion} data={state}/>
                                           
                                            </div>
                                        </div>
                                    </div>
                                }
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
                                                            <TextField variant="outlined" size="small"
                                                                       onChange={handleChange}
                                                                       className="form-control"
                                                                       type="text"
                                                                       label="Folio Recolección"
                                                                       value={state.folioRecoleccion}
                                                                       id="folioRecoleccion"
                                                                       readOnly
                                                                       fullWidth
                                                            />
                                                        </div>
                                                    </div>
                                                    <div className="col-sm-6 col-md-2-5 col-lg-2-5 unit">
                                                        <div className="input">
                                                            <TextField variant="outlined" size="small"
                                                                       onChange={handleChange}
                                                                       className="form-control"
                                                                       type="datetime-local"
                                                                       fullWidth
                                                                       label="Fecha cancelación"
                                                                       value={state.fechaCancelacion}
                                                                       id="fechaCancelacion"
                                                                       readOnly
                                                                       InputLabelProps={{
                                                                           shrink: true,
                                                                       }}
                                                            />
                                                        </div>
                                                    </div>

                                                    <div className="col-sm-12 col-md-12 col-lg-12 unit">
                                                        <div className="input">
                                                            <TextField variant="outlined" size="small"
                                                                       onChange={handleChange}
                                                                       className="form-control"
                                                                       type="text"
                                                                       fullWidth
                                                                       label="Motivo"
                                                                       value={state.motivoCancelacion}
                                                                       id="motivoCancelacion"
                                                            />
                                                        </div>
                                                    </div>

                                                    <div className="form-footer col-md-12">
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

                        <div id="Importar" className="tab-pane fade">
                            <ImportarEmbarques
                                esRecoleccion={true}
                            />
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
}

export default Recoleccion;
