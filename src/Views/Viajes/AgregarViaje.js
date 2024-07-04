import React, {Component} from "react";
import Autocomplete from '@mui/material/Autocomplete';
import TextField from "@mui/material/TextField";
import InputAdornment from "@mui/material/InputAdornment";
import IconButton from "@mui/material/IconButton";
import axios from "axios";
import PageviewIcon from "@mui/icons-material/Pageview";
import {
    Button,
    Checkbox,
    Dialog,
    DialogActions,
    DialogContent, DialogTitle,
    FormControlLabel,
    Grid,
    Tooltip
} from "@mui/material";
import {getCurrentDateTime} from "../../Util/Util"
import TableCiudades from "./TableCiudades";
import TableCiudadesViajes from "./TableCiudades";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import Select from "@mui/material/Select";
import TableUnidadViajes from "./TablaUnidadViajes";
import {DataGrid} from "@mui/x-data-grid";
import {API_HEADERS, dataGridLocaleText} from "../../Constants";
import Historial from "./Historial";
import {obtenerCiudades} from "../../Util/Contexts/CiudadesContext";
import {obtenerCodigoPostal} from "../../Util/Contexts/CodigoPostalContext";
import AsignarOperadorUnidad from "./AsignarOperadorUnidad";
import {
    cancelarEmbarque,
    eliminarEmbarques,
    obtenerEmbarquesId,
    obtenerUltimoFolioEmbarques,
    obtenerEmbarqueCancelado,
    agregarViaje,
    modificarEmbarques,
    obtenerEmbarquesFiltro,
    obtenerEmbarques, modificarViaje
} from "../../Util/Contexts/ViajesContext";
import $ from "jquery";
import {ContactsOutlined} from "@mui/icons-material";
import {obtenerInformesDisponiblesViajes} from "../../Util/Contexts/InformesContext";
import InformesPorAsignar from "./InformesPorAsignar";
import Noty from "noty";
import {obtenerEstatusUnidadeId, obtenerRemolques, obtenerUnidades} from "../../Util/Contexts/UnidadesContext";
import {obtenerOperadores, obtenerOperadoresId} from "../../Util/Contexts/OperadoresContext";
import {obtenerSucursales} from "../../Util/Contexts/SucursalContext";
import {obtenerRutasByOrigenDestinoPublicoGeneral, obtenerTrayectosByRuta} from "../../Util/Contexts/RutasContext";
import SeleccionarRuta from "../Rutas/SeleccionarRuta";
import {cubicarGuia, validarEliminarGuia} from "../../Util/Contexts/GuiaContext";
import {obtenerEstatusViaje} from "../../Util/Contexts/EstatusContext";
import DialogUnidades from "./DialogUnidades";
import DialogRemolques from "./DialogRemolques";
import DialogDollys from "./DialogDollys";
import ProgressBarCubicaje from "./ProgressBarCubicaje";
import {showError} from "../../Util/GlobalFunctions";

const headers = API_HEADERS

function showSuccess(mensaje) {
    new Noty({
        type: "information",
        layout: "topCenter",
        text: mensaje,
        timeout: "6000"
    }).show()
}

let timer;
window.jQuery = window.$ = $;

/**Props
 * reload FUNCION recarga el listado de viajes del tab Listado.
 * consult BOOLEAN inidica si es consulta.
 * modificar BOOLEAN indica si es modificacion.
 * select OBJECT contiene el viaje si es consulta o modificación
 * idViaje INT contiene el identificador del Viaje
 * */
class AgregarViaje extends Component {


    constructor(props) {
        super(props);

        const today = new Date();

        this.state = {
            id: 0,
            origen: "",
            destino: "",
            IdRemolque1: null,
            IdRemolque2: null,
            IdDolly: null,
            idRuta: 0,
            arrayIdRutas:[],
            idCiudadOrigen: null,
            idCiudadDestino: null,
            dataCiudad: [],
            dataUnidades: [],
            dataRemolques: [],
            dataCodigoPostal: [],
            dataSucursal: [],
            dataEstatusViaje: [],
            dataInformesPorAsignar: [],
            dataInformesAsignados: [],
            dataInformesSeleccionados: [],
            showPopUp: false,
            showDialog: false,
            identificadorModal: "",
            tipoModal: 0,
            utilizacion: 0,
            dataRutas: [],
            idSucursalAgregar: localStorage.getItem("Sucursal"),
            folioViaje: "",
            viajeCliente: "",
            fechaHoraCreacion: getCurrentDateTime(),
            fechaHoraRegistro: getCurrentDateTime(),
            candadoOficial: "",
            identificadorViaje: "",
            estatusListado: '8',
            CreadoPor: localStorage.getItem("UsuarioId"),
            ModificadoPor: localStorage.getItem("UsuarioId"),
            placasDolly: "",
            placasRemolque1: "",
            placasRemolque2: "",
            estatusRemolque1:"",
            estatusRemolque2:'',
            height: window.innerHeight,
            showAsignarOperadorDialog: false,
            idInforme: 0,
            asignacionEquipo: {},

            //OPERADOR
            operador: {},
            cargadoVacioRemolqueUno: 0,
            cargadoVacioRemolqueDos: 0,
            unidad: null,
            placaIntUnidad: "",
            estatusUnidad: "",
            referencia: "",
            kms: "",
            horas: "",
            fechaCarga: "",
            horaCarga: "",
            fechaEntregaGeneral: "",
            horaEntregaGeneral: "",
            horasEnRuta: "",

            //PERMISIONARIO
            esOperadorPermisionario: false,
            licenciaPermisionario: null,
            nombrePermisionario: null,
            fechaVigenciaPermisionario: null,

            fechaInforme: "",
            horaInforme: "",
            folioInforme: "",
            remolqueInforme: "",
            totalInforme: "",
            fechaEntregaInforme: "",
            horaEntregaInforme: "",
            entregado: false,
            estatusInforme: "",
            dataOperadores: [],
            openDialogInformes:false,
            Remolque2Select:false,
            dollySelect:false,

            //Cambios de la 801
            openDialogUnidades: false,
            openDialogRemolques: false,
            openDialogDollys: false,
            identificadorConvoyUnidad: ""
        }

        this.getAllCiudades = this.getAllCiudades.bind(this);
        this.getAllCodigosPostales = this.getAllCodigosPostales.bind(this);
        this.getAllSucursales = this.getAllSucursales.bind(this);
        this.getAllEstatusViaje = this.getAllEstatusViaje.bind(this);
        this.getAllUnidades = this.getAllUnidades.bind(this);
        this.handleSelectCP = this.handleSelectCP.bind(this);
        this.handleChange = this.handleChange.bind(this);
        // this.getInformesByFiltro = this.getInformesByFiltro.bind(this);
        this.handleRutaFiltro = this.handleRutaFiltro.bind(this);
        this.handleRemolqueUnoFiltro = this.handleRemolqueUnoFiltro.bind(this);
        this.handleRemolqueDosFiltro = this.handleRemolqueDosFiltro.bind(this);
        this.handleOrigenFiltro = this.handleOrigenFiltro.bind(this);
        this.handleDestinoFiltro = this.handleDestinoFiltro.bind(this);
        this.handleDollyFiltro = this.handleDollyFiltro.bind(this);
        this.handleAgregarInforme = this.handleAgregarInforme.bind(this);
        this.handleEliminarInforme = this.handleEliminarInforme.bind(this);
        this.handleClearData = this.handleClearData.bind(this);
        this.handleChangeAutocomplete = this.handleChangeAutocomplete.bind(this);
        this.handleChangeCheckbox = this.handleChangeCheckbox.bind(this);
        this.getAllOperadores = this.getAllOperadores.bind(this);
        this.handleUnidadFiltro = this.handleUnidadFiltro.bind(this);
        this.handleShowDialog = this.handleShowDialog.bind(this);
        this.getAllRemolques = this.getAllRemolques.bind(this);
        this.handleChangeRuta = this.handleChangeRuta.bind(this);
        this.onSubmitDestinoInforme = this.onSubmitDestinoInforme.bind(this);
        this.handleChangeDataPermisionario = this.handleChangeDataPermisionario.bind(this);
        this.handleCloseDialogUnidades = this.handleCloseDialogUnidades.bind(this);
        this.handleAcceptDataUnidades = this.handleAcceptDataUnidades.bind(this);
        this.handleCloseDialogRemolques = this.handleCloseDialogRemolques.bind(this);
        this.handleAcceptDataRemolques = this.handleAcceptDataRemolques.bind(this);
        this.handleCloseDialogDollys = this.handleCloseDialogDollys.bind(this);
        this.handleAcceptDataDollys = this.handleAcceptDataDollys.bind(this);
        this.cubicarViaje = this.cubicarViaje.bind(this);

    }

    componentWillMount() {
       
       this.getAllCiudades()
        //this.getAllRutas()
        //this.getAllCodigosPostales()
        this.getAllSucursales()
        this.getAllEstatusViaje();
        this.getAllUnidades();
        this.getAllRemolques();
        this.getAllOperadores();
        $.primerClick=false
    }
    confirmExit(){
        return "show warning"
    }
    componentDidUpdate(prevProps, prevState, snapshot) {
        if(prevState!=this.state && typeof $.primerClick!=='undefined'){
            if($.primerClick===true)
            {
        $(window).bind('beforeunload',this.confirmExit);
        console.log("disproporcionado")}}
        if (this.state.id !== this.props.id && this.props.id > 0 && (this.props.consult || this.props.modificar)) {
             console.log(this.props.select)
             obtenerTrayectosByRuta(this.props.select.m_nIdRuta).then(({data}) => {
                this.setState(state => {
                    return {
                        ...state,
                        id: this.props.select.m_nIdViaje,
                        idRuta: this.props.select.m_nIdRuta,
                        idCiudadOrigen: {
                            "m_sCiudad": this.props.select.m_sOrigen,
                            "m_nIdCiudad": this.props.select.m_nIdOrigen
                        },
                        idCiudadDestino: {
                            "m_sCiudad": this.props.select.m_sDestino,
                            "m_nIdCiudad": this.props.select.m_nIdDestino
                        },
                        IdRemolque1: this.props.select.m_nIdRemolque1 ? {
                            m_nIdUnidad: this.props.select.m_nIdRemolque1,
                            m_sDescripcion: this.props.select.m_sDescripcionRemolque1,
                            m_sCodigo: this.props.select.m_sCodigoRemolque1,
                            EstatusUnidad: this.props.select.m_sEstatusRemolque1,

                        } : null,
                        placasRemolque1: this.props.select.m_sPlacasRemolque1,
                        colorRemolque1: this.props.select.m_sColorRemolque1,
                        estatusRemolque1: this.props.select.m_sEstatusRemolque1,
                        IdRemolque2: this.props.select.m_nIdRemolque2 ? {
                            m_nIdUnidad: this.props.select.m_nIdRemolque2,
                            m_sDescripcion: this.props.select.m_sDescripcionRemolque2,
                            m_sCodigo: this.props.select.m_sCodigoRemolque2,
                            EstatusUnidad: this.props.select.m_sEstatusRemolque2,
                        } : null,
                        placasRemolque2: this.props.select.m_sPlacasRemolque2,
                        colorRemolque2: this.props.select.m_sColorRemolque2,
                        estatusRemolque2: this.props.select.m_sEstatusRemolque2,
                        IdDolly: this.props.select.m_nIdDolly ? {
                            m_nIdUnidad: this.props.select.m_nIdDolly,
                            m_sDescripcion: this.props.select.m_sDescripcionDolly,
                            m_sCodigo: this.props.select.m_sCodigoDolly,
                        } : null,
                        placasDolly: this.props.select.m_sPlacasDolly,
                        operador: {
                            m_nIdOperador: this.props.select.m_nIdOperador,
                            m_sNombreCompleto: this.props.select.m_sNombreOperador,
                        },
                        unidad: {
                            m_nIdUnidad: this.props.select.m_nIdUnidad,
                            m_sCodigo: this.props.select.m_sCodigoUnidad,
                            m_sDescripcion: this.props.select.m_sDescripcionUnidad,
                            EstatusUnidad: this.props.select.m_sEstatusUnidad,

                        },
                        placaIntUnidad: this.props.select.m_sPlacasUnidad,
                        estatusUnidad: this.props.select.m_sEstatusUnidad,
                        colorUnidad: this.props.select.m_sColorUnidad,
                        kms: '',
                        horas: '',
                        fechaHoraRegistro: this.props.select.m_dFechaRegistro + "T" + this.props.select.m_tHoraRegistro.substr(0, 5),
                        estatusListado: this.props.select.m_nIdEstatusViaje,
                        idSucursalAgregar: this.props.select.m_nIdSucursal,
                        candadoOficial: this.props.select.m_sCandadoOficial,
                        folioViaje: this.props.select.m_sFolioViaje,
                        identificadorViaje: this.props.select.m_sIdentificador,
                        viajeCliente: this.props.select.m_sNumViajeCliente,
                        CreadoPor: this.props.select.CreadoPor,
                        dataInformesAsignados: this.props.select.m_arrInformes,
                        estatusViaje:this.props.m_sEstatusViaje,
                        esOperadorPermisionario: this.props.select.EsOperadorPermisionario,
                        licenciaPermisionario: this.props.select.LicenciaPermisionario,
                        nombrePermisionario: this.props.select.NombrePermisionario,
                        fechaVigenciaPermisionario: this.props.select.FechaVigenciaPermisionario,
                        dollySelect:this.props.select.m_nIdDolly?true:false,
                        Remolque2Select:this.props.select.m_nIdRemolque2?true:false,
                        trayectos: data

                    }
                })
            })
            /* this.setState(state => {
                return {
                    ...state,
                    id: this.props.select.m_nIdViaje,
                    idRuta: this.props.select.m_nIdRuta,
                    idCiudadOrigen: {
                        "m_sCiudad": this.props.select.m_sOrigen,
                        "m_nIdCiudad": this.props.select.m_nIdOrigen
                    },
                    idCiudadDestino: {
                        "m_sCiudad": this.props.select.m_sDestino,
                        "m_nIdCiudad": this.props.select.m_nIdDestino
                    },
                    IdRemolque1: this.props.select.m_nIdRemolque1 ? {
                        m_nIdUnidad: this.props.select.m_nIdRemolque1,
                        m_sDescripcion: this.props.select.m_sDescripcionRemolque1,
                        m_sCodigo: this.props.select.m_sCodigoRemolque1,
                        EstatusUnidad: this.props.select.m_sEstatusRemolque1,

                    } : null,
                    placasRemolque1: this.props.select.m_sPlacasRemolque1,
                    colorRemolque1: this.props.select.m_sColorRemolque1,
                    estatusRemolque1: this.props.select.m_sEstatusRemolque1,
                    IdRemolque2: this.props.select.m_nIdRemolque2 ? {
                        m_nIdUnidad: this.props.select.m_nIdRemolque2,
                        m_sDescripcion: this.props.select.m_sDescripcionRemolque2,
                        m_sCodigo: this.props.select.m_sCodigoRemolque2,
                        EstatusUnidad: this.props.select.m_sEstatusRemolque2,
                    } : null,
                    placasRemolque2: this.props.select.m_sPlacasRemolque2,
                    colorRemolque2: this.props.select.m_sColorRemolque2,
                    estatusRemolque2: this.props.select.m_sEstatusRemolque2,
                    IdDolly: this.props.select.m_nIdDolly ? {
                        m_nIdUnidad: this.props.select.m_nIdDolly,
                        m_sDescripcion: this.props.select.m_sDescripcionDolly,
                        m_sCodigo: this.props.select.m_sCodigoDolly,
                    } : null,
                    placasDolly: this.props.select.m_sPlacasDolly,
                    operador: {
                        m_nIdOperador: this.props.select.m_nIdOperador,
                        m_sNombreCompleto: this.props.select.m_sNombreOperador,
                    },
                    unidad: {
                        m_nIdUnidad: this.props.select.m_nIdUnidad,
                        m_sCodigo: this.props.select.m_sCodigoUnidad,
                        m_sDescripcion: this.props.select.m_sDescripcionUnidad,
                        EstatusUnidad: this.props.select.m_sEstatusUnidad,

                    },
                    placaIntUnidad: this.props.select.m_sPlacasUnidad,
                    estatusUnidad: this.props.select.m_sEstatusUnidad,
                    colorUnidad: this.props.select.m_sColorUnidad,
                    kms: '',
                    horas: '',
                    fechaHoraRegistro: this.props.select.m_dFechaRegistro + "T" + this.props.select.m_tHoraRegistro.substr(0, 5),
                    estatusListado: this.props.select.m_nIdEstatusViaje,
                    idSucursalAgregar: this.props.select.m_nIdSucursal,
                    candadoOficial: this.props.select.m_sCandadoOficial,
                    folioViaje: this.props.select.m_sFolioViaje,
                    identificadorViaje: this.props.select.m_sIdentificador,
                    viajeCliente: this.props.select.m_sNumViajeCliente,
                    CreadoPor: this.props.select.CreadoPor,
                    dataInformesAsignados: this.props.select.m_arrInformes,
                    estatusViaje:this.props.m_sEstatusViaje,
                    esOperadorPermisionario: this.props.select.EsOperadorPermisionario,
                    licenciaPermisionario: this.props.select.LicenciaPermisionario,
                    nombrePermisionario: this.props.select.NombrePermisionario,
                    fechaVigenciaPermisionario: this.props.select.FechaVigenciaPermisionario,
                    dollySelect:this.props.select.m_nIdDolly?true:false,
                    Remolque2Select:this.props.select.m_nIdRemolque2?true:false

                }
            })
            obtenerTrayectosByRuta(this.props.select.m_nIdRuta).then(({data}) => {
                this.setState( {
                    trayectos: data
                })
            }) */
        }
    }

 /*   getCurrentDateTime = () => {
        return `${new Date().getFullYear()}-${`${new Date().getMonth() +
        1}`.padStart(2, 0)}-${`${new Date().getDate()}`.padStart(2, 0)}T${`${new Date().getHours()}`.padStart(2, 0)}:${`${new Date().getMinutes()}`.padStart(2, 0)}`
    }*/

    handleAceptar = (e) => {
        if (e){
            e.preventDefault();
        }
        if (this.state.dataInformesAsignados.length === 0){
            showSuccess("No puede guardar un viaje sin informes.")
            return
        }

        if(this.state.Remolque2Select && !this.state.dollySelect){
            showSuccess("Al seleccionar Remolque 2, se requiere dolly")
            return
        }

        if(!this.state.Remolque2Select && this.state.dollySelect){
            showSuccess("Al seleccionar dolly, se requiere Remolque 2")
            return
        }

        var params = {
            m_nIdViaje: this.props.id,
            m_sFecha: getCurrentDateTime().substr(0, 10),
            m_sHora: getCurrentDateTime().substr(getCurrentDateTime().length-5, 5),
            m_nIdEstatusViaje: this.state.estatusListado,
            m_nIdSucursal: this.state.idSucursalAgregar,
            m_sCandadoOficial: this.state.candadoOficial,
            m_sFolioViaje: this.state.folioViaje,
            m_sIdentificador: this.state.identificadorViaje,
            m_sNumViajeCliente: this.state.viajeCliente,
            CreadoPor: this.state.CreadoPor,
            m_arrInformes: this.state.dataInformesAsignados,
            m_nIdOrigen: this.state.idCiudadOrigen.m_nIdCiudad,
            m_nIdDestino: this.state.idCiudadDestino.m_nIdCiudad,
            idRemolque1: this.state.IdRemolque1 ? this.state.IdRemolque1.m_nIdUnidad : 0,
            idRemolque2: this.state.IdRemolque2 ? this.state.IdRemolque2.m_nIdUnidad : 0,
            idDolly: this.state.IdDolly ? this.state.IdDolly.m_nIdUnidad : 0,
            m_nIdRuta: this.state.idRuta,
            /*asignacionUnidad: {
                idUnidad: this.state.unidad.m_nIdUnidad,
                idOperador: this.state.operador.m_nIdOperador,
                cvr1: this.state.cargadoVacioRemolqueUno,
                cvr2: this.state.cargadoVacioRemolqueDos,
                referencia: this.state.referencia,
                kilometro: this.state.kms,
                fechaCarga: this.state.fechaCarga,
                horas: this.state.horas,
                fechaEntrega: this.state.fechaEntregaGeneral,
                fechaInforme: this.state.fechaInforme,
                horaInforme: this.state.horaInforme,
                estatus: this.state.estatusInforme,
                horaEntrega: this.state.horaEntregaGeneral,
            },*/
            idUnidad: this.state.unidad.m_nIdUnidad,
            idOperador: this.state.operador.m_nIdOperador,
            cvr1: this.state.cargadoVacioRemolqueUno,
            cvr2: this.state.cargadoVacioRemolqueDos,
            referencia: this.state.referencia,
            kilometro: this.state.kms,
            fechaCarga: this.state.fechaCarga,
            horas: this.state.horas,
            fechaEntrega: this.state.fechaEntregaGeneral,
            fechaInforme: this.state.fechaInforme,
            horaInforme: this.state.horaInforme,
            estatus: this.state.estatusInforme,
            horaEntrega: this.state.horaEntregaGeneral,
            esOperadorPermisionario: this.state.esOperadorPermisionario,
            licenciaPermisionario: this.state.licenciaPermisionario,
            nombrePermisionario: this.state.nombrePermisionario,
            fechaVigenciaPermisionario: this.state.fechaVigenciaPermisionario,
        }
        //console.log(params)
       if (this.props.modificar) {
            modificarViaje(this.props.id, params)
                .then((respuesta) => {
                    showSuccess(respuesta.data)

                    $('.nav-tabs li ').removeClass('active');
                    $('.nav-tabs li').eq(0).addClass('active');
                    $('.tab-content div ').removeClass('in show');
                    $('#Listado').addClass('in show');
                    this.props.cancel()
                    this.handleClearData()
                })
                .catch((err) => {
                    // console.log(err);
                    showSuccess(err.response?.data);
                });
        } else {
            agregarViaje(params)
                .then((respuesta) => {
                    showSuccess(respuesta.data)
                    $('.nav-tabs li ').removeClass('active');
                    $('.nav-tabs li').eq(0).addClass('active');
                    $('.tab-content div ').removeClass('in show');
                    $('#Listado').addClass('in show');
                    this.props.cancel()
                    this.handleClearData()
                })
                .catch((err) => {
                    showSuccess(err.response?.data);
                });
        }


    };

    handleClearData(){
        this.setState({
            id: 0,
            origen: "",
            destino: "",
            IdRemolque1: null,
            IdRemolque2: null,
            IdDolly: null,
            idRuta: 0,
            idCiudadOrigen: null,
            idCiudadDestino: null,
            dataInformesPorAsignar: [],
            dataInformesAsignados: [],
            dataInformesSeleccionados: [],
            showPopUp: false,
            showDialog: false,
            tipoModal: 0,
            idSucursalAgregar: localStorage.getItem("Sucursal"),
            folioViaje: "",
            viajeCliente: "",
            fechaHoraCreacion: getCurrentDateTime(),
            fechaHoraRegistro: getCurrentDateTime(),
            candadoOficial: "",
            identificadorViaje: "",
            estatusListado: '8',
            CreadoPor: localStorage.getItem("UsuarioId"),
            ModificadoPor: localStorage.getItem("UsuarioId"),
            placasDolly: "",
            placasRemolque1: "",
            placasRemolque2: "",
            estatusRemolque1:'',
            estatusRemolque2:'',
            idInforme: 0,
            asignacionEquipo: {},

            dataCiudad: [],
            dataUnidades: [],
            dataRutas: [],
            dataCodigoPostal: [],
            dataSucursal: [],
            dataEstatusViaje: [],
            identificadorModal: "",
            height: window.innerHeight,
            showAsignarOperadorDialog: false,


            //OPERADOR
            operador: {},
            cargadoVacioRemolqueUno: 0,
            cargadoVacioRemolqueDos: 0,
            unidad: null,
            placaIntUnidad: "",
            estatusUnidad: "",
            referencia: "",
            kms: "",
            horas: "",
            fechaCarga: "",
            horaCarga: "",
            fechaEntregaGeneral: "",
            horaEntregaGeneral: "",
            horasEnRuta: "",

            fechaInforme: "",
            horaInforme: "",
            folioInforme: "",
            remolqueInforme: "",
            totalInforme: "",
            fechaEntregaInforme: "",
            horaEntregaInforme: "",
            entregado: false,
            estatusInforme: "",
            dataOperadores: [],
        })
    }

    handleSelectCP(id, dobleClick, e) {
        debugger
        console.log("le pique x2")
        /*clearTimeout(timer);
        if (e.detail === 1) {
            timer = setTimeout(() => {
                this.setState({
                    [this.state.identificadorModal]: id,
                    openDialog: true
                })
            }, 200)
        } else if (e.detail === 2) {
            this.setState({
                [this.state.identificadorModal]: id,
                openDialog: false
            })
        }*/
    }

    getAllSucursales() {
        obtenerSucursales().then((respuesta) => {
            this.setState({dataSucursal: respuesta.data})
        });
    }

    getAllCiudades() {
        obtenerCiudades().then((respuesta) => {
            this.setState({
                dataCiudad: respuesta.data,
                /*idCiudadOrigen: this.props.select ? respuesta.data.find(c => c.m_nIdCiudad === this.props.select.m_nIdOrigen) : null,
                idCiudadDestino: this.props.select ? respuesta.data.find(c => c.m_nIdCiudad === this.props.select.m_nIdDestino) : null*/
            })
            /*  const url = `${process.env.REACT_APP_API_URL}/Ciudades/GetListado`;
             axios.get(url, { headers }).then((respuesta) => {
                 this.setState({ dataCiudad: respuesta.data }) */
        });
    }


    getAllCodigosPostales() {
        obtenerCodigoPostal().then((respuesta) => {
            this.setState({dataCodigoPostal: respuesta.data})
            /*   const url = `${process.env.REACT_APP_API_URL}/CodigoPostal/GetListado`;
              axios.get(url, { headers }).then((respuesta) => {
                  this.setState({ dataCodigoPostal: respuesta.data }) */
        });
    }

    getAllEstatusViaje() {
        obtenerEstatusViaje().then((respuesta) => {
            this.setState({dataEstatusViaje: respuesta.data})
        });
    }

    getAllUnidades() {
        obtenerUnidades().then((respuesta) => {
            this.setState({
                dataUnidades: respuesta.data,
            })
        });
    }



    getAllRemolques() {
        obtenerRemolques().then((respuesta) => {
            this.setState({
                dataRemolques: respuesta.data,
            })
        });
    }

    getAllOperadores() {
        obtenerOperadores().then((respuesta) => {
            this.setState({
                dataOperadores: respuesta.data,
            })
        });
    }

    getInformesDisponibles(nIdRuta, nIdCiudadOrigen, nIdCiudadDestino) {
        obtenerInformesDisponiblesViajes(nIdCiudadOrigen, nIdCiudadDestino, nIdRuta).then(({data}) => {
            this.setState({dataInformesPorAsignar: data})
        })
    }

    /*getInformesByFiltro(nIdRuta, nIdCiudadOrigen, nIdCiudadDestino, nIdRemolque1, nIdRemolque2, nIdDolly) {
        const url = `${process.env.REACT_APP_API_URL}/Informes/GetByFiltro` + "/" + nIdRuta + "/" +
            nIdCiudadOrigen + "/" + nIdCiudadDestino + "/" + nIdRemolque1 + "/" + nIdRemolque2 + "/" + nIdDolly;
        axios.get(url, {headers}).then((respuesta) => {
            this.setState({dataInformesAsignados: respuesta.data})
        });
    }*/

    handleChange = (event) => {
        event.preventDefault();
        this.setState({
            [event.target.name]: event.target.value,
        });
    };

    handleRutaFiltro(event, newValue) {
        this.setState({idRuta: newValue});
        this.getInformesDisponibles(newValue.m_nIdRuta, this.state.origen.m_nIdCiudad, this.state.destino.m_nIdCiudad)
    }

    handleOrigenFiltro(event, newValue) {
        this.setState({origen: newValue});
        this.getInformesDisponibles(this.state.idRuta.m_nIdRuta, newValue.m_nIdCiudad, this.state.destino.m_nIdCiudad)

    }

    handleDestinoFiltro(event, newValue) {
        event.preventDefault();
        this.setState({destino: newValue});
        this.getInformesDisponibles(this.state.idRuta.m_nIdRuta, this.state.origen.m_nIdCiudad, newValue.m_nIdCiudad)
    }

    isUnidadAvailable(idUnidad, origen){
        switch (origen) {
            case 'UNIDAD':
                return !((idUnidad === this.state.IdRemolque1 ? this.state.IdRemolque1.m_nIdUnidad : 0) || (idUnidad === this.state.IdRemolque2 ? this.state.IdRemolque2.m_nIdUnidad : 0) || (idUnidad === this.state.IdDolly ? this.state.IdDolly.m_nIdUnidad : 0));
                break;
            case 'REMOLQUE1':
                return !((idUnidad === this.state.unidad ? this.state.unidad.m_nIdUnidad : 0) || (idUnidad === this.state.IdRemolque2 ? this.state.IdRemolque2.m_nIdUnidad : 0) || (idUnidad === this.state.IdDolly ? this.state.IdDolly.m_nIdUnidad : 0));
                break;
            case 'REMOLQUE2':
                return !((idUnidad === this.state.unidad ? this.state.unidad.m_nIdUnidad : 0) || (idUnidad === this.state.IdRemolque1 ? this.state.IdRemolque1.m_nIdUnidad : 0) || (idUnidad === this.state.IdDolly ? this.state.IdDolly.m_nIdUnidad : 0));
                break;
            case 'DOLLY':
                return !((idUnidad === this.state.unidad ? this.state.unidad.m_nIdUnidad : 0) || (idUnidad === this.state.IdRemolque1 ? this.state.IdRemolque1.m_nIdUnidad : 0) || (idUnidad === this.state.IdRemolque2 ? this.state.IdRemolque2.m_nIdUnidad : 0));
                break;
            default:
                return true;
                break;
        }
    }

    handleRemolqueUnoFiltro(event, newValue) {
        event.preventDefault();
        if (newValue){
            obtenerEstatusUnidadeId(newValue.m_nIdUnidad).then((resultado) => {
                if (resultado.data.m_sEstatus === "DISPONIBLE"){
                    if (!this.isUnidadAvailable(newValue, "REMOLQUE1")){
                        showSuccess("La unidad elegida ya se encuentra seleccionada.");
                        this.setState({
                            IdRemolque1: null,
                            placasRemolque1: "",
                            colorRemolque1: "",
                            estatusRemolque1: ""
                        })
                        return
                    }
                    this.setState({
                        IdRemolque1: newValue,
                        placasRemolque1: newValue.m_sPlacas,
                        colorRemolque1: resultado.data instanceof String ? "" : resultado.data.m_sColor,
                        estatusRemolque1: resultado.data instanceof String ? "" : resultado.data.m_sEstatus
                    })
                }else {
                    showSuccess("La unidad seleccionada no está disponible")
                    this.setState({
                        IdRemolque1: null,
                        placasRemolque1: "",
                        colorRemolque1: "",
                        estatusRemolque1: ""
                    })
                }

            })
            /*if (this.state.idRuta.m_nIdRuta && this.state.origen.m_nIdCiudad && this.state.destino.m_nIdCiudad && newValue.m_nIdUnidad && this.state.IdRemolque2.m_nIdUnidad && this.state.IdDolly.m_nIdUnidad) {

                this.getInformesByFiltro(this.state.idRuta.m_nIdRuta, this.state.origen.m_nIdCiudad, this.state.destino.m_nIdCiudad,
                    newValue.m_nIdUnidad, this.state.IdRemolque2.m_nIdUnidad, this.state.IdDolly.m_nIdUnidad)
            }*/

        }else{
            this.setState({
                IdRemolque1: null,
                placasRemolque1: "",
                colorRemolque1: "",
                estatusRemolque1: ""
            })
        }
    }

    handleRemolqueDosFiltro(event, newValue) {
        event.preventDefault();
        if (newValue){
            obtenerEstatusUnidadeId(newValue.m_nIdUnidad).then((resultado) => {
                if (resultado.data.m_sEstatus === "DISPONIBLE"){
                    if (!this.isUnidadAvailable(newValue, "REMOLQUE2")){
                        showSuccess("La unidad elegida ya se encuentra seleccionada.");
                        this.setState({
                            IdRemolque2: null,
                            placasRemolque2: "",
                            colorRemolque2: "",
                            estatusRemolque2: "",
                            Remolque2Select:false
                        })
                        return
                    }
                    this.setState({
                        IdRemolque2: newValue,
                        placasRemolque2: newValue.m_sPlacas,
                        colorRemolque2: resultado.data instanceof String ? "" : resultado.data.m_sColor,
                        estatusRemolque2: resultado.data instanceof String ? "" : resultado.data.m_sEstatus,
                        Remolque2Select:true

                    })
                }else{
                    showSuccess("La unidad seleccionada no está disponible")
                    this.setState({
                        IdRemolque2: null,
                        placasRemolque2: "",
                        colorRemolque2: "",
                        estatusRemolque2: ""
                    })
                }
            })

            /*if (this.state.idRuta.m_nIdRuta && this.state.origen.m_nIdCiudad && this.state.destino.m_nIdCiudad && this.state.IdRemolque1.m_nIdUnidad && newValue.m_nIdUnidad && this.state.IdDolly.m_nIdUnidad) {

                this.getInformesByFiltro(this.state.idRuta.m_nIdRuta, this.state.origen.m_nIdCiudad, this.state.destino.m_nIdCiudad,
                    this.state.IdRemolque1.m_nIdUnidad, newValue.m_nIdUnidad, this.state.IdDolly.m_nIdUnidad)
            }*/
        }else{
            this.setState({
                IdRemolque2: null,
                placasRemolque2: "",
                colorRemolque2: "",
                estatusRemolque2: "",
                Remolque2Select:false
            })
        }
    }

    handleUnidadFiltro(event, newValue) {
        event.preventDefault();
        if (newValue){
            obtenerEstatusUnidadeId(newValue.m_nIdUnidad).then((resultado) => {
                if (resultado.data.m_sEstatus === "DISPONIBLE"){
                    if (!this.isUnidadAvailable(newValue, "UNIDAD")){
                        showSuccess("La unidad elegida ya se encuentra seleccionada.");
                        this.setState({
                            unidad: null,
                            placaIntUnidad: "",
                            estatusUnidad: "",
                            colorUnidad: "",
                            kms: 0,
                            horas: 0
                        })
                        return
                    }
                    this.setState({
                        unidad: newValue,
                        placaIntUnidad: newValue.m_sPlacas,
                        estatusUnidad: resultado.data instanceof String  ? "" : resultado.data.m_sEstatus,
                        colorUnidad: resultado.data instanceof String ? "" : resultado.data.m_sColor,
                        kms: newValue.m_nOdometro,
                        horas: newValue.m_nHorasTrabajadasMotorNoGPS,
                        aplicaRemolque: newValue.m_bAplicaRemolque
                    })
                }else{
                    this.setState({
                        unidad: null,
                        placaIntUnidad: "",
                        estatusUnidad: "",
                        colorUnidad: "",
                        kms: 0,
                        horas: 0
                    })
                    showSuccess("La unidad seleccionada no está disponible")

                }
            })
        }else {
            this.setState({
                unidad: null,
                placaIntUnidad: "",
                estatusUnidad: "",
                colorUnidad: '',
                kms: '',
                horas: '',
            })
        }



        /*if (this.state.idRuta.m_nIdRuta && this.state.origen.m_nIdCiudad && this.state.destino.m_nIdCiudad && this.state.IdRemolque1.m_nIdUnidad && newValue.m_nIdUnidad && this.state.IdDolly.m_nIdUnidad) {

            this.getInformesByFiltro(this.state.idRuta.m_nIdRuta, this.state.origen.m_nIdCiudad, this.state.destino.m_nIdCiudad,
                this.state.IdRemolque1.m_nIdUnidad, newValue.m_nIdUnidad, this.state.IdDolly.m_nIdUnidad)
        }*/
    }

    handleDollyFiltro(event, newValue) {
        event.preventDefault();
        if (newValue){
            if (!this.isUnidadAvailable(newValue, "DOLLY")){
                showSuccess("La unidad elegida ya se encuentra seleccionada.");
                return
            }
            this.setState({IdDolly: newValue, placasDolly: newValue.m_sPlacas,dollySelect:true})
            /*if (this.state.idRuta.m_nIdRuta && this.state.origen.m_nIdCiudad && this.state.destino.m_nIdCiudad && this.state.IdRemolque1.m_nIdUnidad && this.state.IdRemolque2.m_nIdUnidad && newValue.m_nIdUnidad) {

                this.getInformesByFiltro(this.state.idRuta.m_nIdRuta, this.state.origen.m_nIdCiudad, this.state.destino.m_nIdCiudad,
                    this.state.IdRemolque1.m_nIdUnidad, this.state.IdRemolque2.m_nIdUnidad, newValue.m_nIdUnidad)
            }*/
        }
        else{
            this.setState({IdDolly: null, placasDolly: "",dollySelect:false})
        }
    }


    handleAgregarInforme(id) {
        if (this.state.dataInformesAsignados.find(i => i.m_nIdInforme === id) === undefined) {
            var informeAsignar = this.state.dataInformesPorAsignar.find(i => i.m_nIdInforme === id)
            informeAsignar.m_bSePuedeBorrar = true
            if (this.state.trayectos.map(t => t.IdDestino).includes(informeAsignar.m_nIdDestino) === false) {
                this.setState({openDestino: true, idInformeSeleccionado: id})
                return
            }
            var arrayInformesAsignados = this.state.dataInformesAsignados
            informeAsignar.m_nDestinoSeleccionado = informeAsignar.m_nIdDestino
            informeAsignar.m_sDestinoSeleccionado = informeAsignar.m_sCiudadDestino


            arrayInformesAsignados=[...arrayInformesAsignados,informeAsignar]
            try {
                this.cubicarViaje(arrayInformesAsignados)
            } catch (e) {
                showSuccess("El informe "+informeAsignar.m_sFolioInforme+" fue agregado pero hubo un error al calcular cubicaje con el informe seleccionado.")
            }
            this.setState({dataInformesAsignados: arrayInformesAsignados})
            showSuccess("El informe "+informeAsignar.m_sFolioInforme+" fue agregado con exito.")
        }else{
            showSuccess("El informe ya se encuentra en el viaje.")
        }

    }

    cubicarViaje(arrayInformesAsignados){
        const paquetes = arrayInformesAsignados.reduce((array1, a) => array1.concat(a.m_arrClsProGuia.reduce((array, i) => array.concat(i.m_arrClsDetalle), [])), []);
        console.log('Los paquetes', paquetes)
        const params = {
            idRemolque1: this.state.IdRemolque1?.m_nIdUnidad ?? null,
            idRemolque2: this.state.IdRemolque2?.m_nIdUnidad ?? null,
            paquetes: paquetes.map(p => ({
                alto: p.m_xAlto,
                ancho: p.m_xAncho,
                largo: p.m_xLargo,
                peso: p.m_xPeso,
                cantidad: p.ctd
            }))
        }
        cubicarGuia(params).then(({data}) => {
            this.setState({utilizacion: data.utilizacion.toFixed(0)})
        }).catch(e => {
            this.setState({utilizacion: 0})
            showError(e.response?.data)
        })
    }


    handleEliminarInforme(id) {
        var dataInformesAsignados = [...this.state.dataInformesAsignados]
        dataInformesAsignados.splice(dataInformesAsignados.findIndex(i => i.m_nIdInforme === id), 1)
        this.cubicarViaje(dataInformesAsignados)
        this.setState({dataInformesAsignados: dataInformesAsignados})
    }

    handleChangeAutocomplete = (input, value) => {
        console.log(JSON.stringify(value))
        if(value?.m_bEsPermisionario){
            console.log("entra a validar")
            this.setState(state => {
                return {
                    ...state,
                    nombrePermisionario: value.m_sNombreCompleto,
                    fechaVigenciaPermisionario:value.m_dLicenciaVencimiento?value.m_dLicenciaVencimiento.substr(0, 10):"",
                    licenciaPermisionario: value.m_sLicencia
                }
            });
        }
        this.setState({
            [input]: value,
            esOperadorPermisionario: value?.m_bEsPermisionario,
            openDialogUnidades: true
        });

    }

    handleChangeRuta (idRuta) {

        obtenerTrayectosByRuta(idRuta).then(({data}) => {
            this.setState( {
                idRuta: idRuta,
                trayectos: data
            })
        })

    }

    handleChangeCheckbox = (e) => {
        this.setState({
            [e.target.name]: e.target.checked
        });
    }

    handleShowDialog = (event) => {
        event.preventDefault()
        if(!this.state.trayectos){
            showSuccess("Debes seleccionar una ruta.")
            return
        }
        this.setState({
            openDialogInformes: !this.state.openDialogInformes,
        })
    };
    onSubmitDestinoInforme(e){
        e.preventDefault()
        var informeAsignar = this.state.dataInformesPorAsignar.find(i => i.m_nIdInforme === this.state.idInformeSeleccionado)
        var arrayInformesAsignados = [...this.state.dataInformesAsignados]
        informeAsignar.m_nDestinoSeleccionado = this.state.destinoSeleccionado.IdDestino
        informeAsignar.m_sDestinoSeleccionado =  this.state.destinoSeleccionado.Destino
        arrayInformesAsignados.push(informeAsignar)
        console.log(arrayInformesAsignados)
        this.setState({dataInformesAsignados: arrayInformesAsignados, openDestino: false})
        showSuccess("El informe "+informeAsignar.m_sFolioInforme+" fue agregado con exito.")
    }
    //Funcion para reaccionar al seleccionar una tarifa del LISTADO DE DIALOGO
    handleTarifasSeleccionadas = (e) => {
        if (this.state.dataRequerida === "Tarifas"){
            this.setState({
                idsTarifasSeleccionadas: e.selectionModel,
            })
        }else{
            this.setState({
                idsZonasSeleccionadas: e.selectionModel,
            })
        }

    }

    handleChangeDataPermisionario = (e) => {
        if (e.target.name === "esOperadorPermisionario"){
            if (e.target.checked){
                this.setState({
                    [e.target.name]: e.target.checked
                })
            }else{
                this.setState({
                    [e.target.name]: e.target.checked,
                    licenciaPermisionario: null,
                    nombrePermisionario: null,
                    fechaVigenciaPermisionario: null,
                })
            }
        }else{
            this.setState({
                [e.target.name]: e.target.value
            })
        }

    }

    handleCloseDialogUnidades(){
        this.setState({ openDialogUnidades: false })
        /** Para evitar que se quite la barra de navegacion */
        document.body.style.overflow = 'auto';
    }

    handleAcceptDataUnidades = (data) => {
        console.log(data);
        this.handleCloseDialogUnidades();
        this.setState({
            unidad: data,
            placaIntUnidad: data.m_sPlacas,
            estatusUnidad: data.EstatusUnidad,
            colorUnidad: data.ColorEstatus,
            kms: data.m_nOdometro,
            identificadorConvoyUnidad: data.IdentificadorConvoy,
            // horas: newValue.m_nHorasTrabajadasMotorNoGPS,
            aplicaRemolque: data.m_bAplicaRemolque
        })
        this.setState({ openDialogRemolques: true })
    }

    handleCloseDialogRemolques(){
        this.setState({ openDialogRemolques: false })
        document.body.style.overflow = 'auto';
    }

    handleAcceptDataRemolques = (data) => {
        if(data.length <= 0){
            this.handleCloseDialogUnidades();
            return;
        }

        const [firstData, secondData] = data;

        const newState = {
            IdRemolque1: firstData,
            placasRemolque1: firstData.m_sPlacas,
            colorRemolque1: firstData.ColorEstatus,
            estatusRemolque1: firstData.EstatusUnidad
        };

        if(secondData){
            newState.IdRemolque2 = secondData;
            newState.placasRemolque2 = secondData.m_sPlacas;
            newState.colorRemolque2 = secondData.ColorEstatus;
            newState.estatusRemolque2 = secondData.EstatusUnidad;
            newState.Remolque2Select = true;
        }

        this.setState(newState);
        this.handleCloseDialogUnidades();
        this.setState({ openDialogDollys: true })
    }

    handleCloseDialogDollys(){
        this.setState({ openDialogDollys: false })
        document.body.style.overflow = 'auto';
    }

    handleAcceptDataDollys = (data) => {
        console.log(data);
        this.handleCloseDialogDollys();
        this.setState({
            IdDolly: data,
            placasDolly: data.m_sPlacas,
            dollySelect:true
        })
        this.handleCloseDialogUnidades();
    }

    render() {

        const columnspRorAsignar = [
            {
                headerName: "Folio/Serie",
                field: "m_sFolioInforme",
                flex: 1,
            },
            {
                headerName: "Fecha informe",
                field: "m_sFechaHora",
                flex: 1,
            },
            {
                headerName: "Ubicación actual",
                field: "m_sCiudadOrigen",
                flex: 1,
            },
            {
                headerName: "Destino",
                field: "m_sCiudadDestino",
                flex: 1,
            },
            {
                headerName: "Remolque 1",
                field: "m_sRemolque1",
                flex: 1,
            },
            {
                headerName: "Remolque 2",
                field: "m_sRemolque2",
                flex: 1,
            },
            {
                headerName: "Acciones",
                flex: 1,
                field: "",
                renderCell: (row) => {
                    return (
                        <div>
                            <Tooltip title={"Asignar"}>
                                <a
                                    onClick={() => this.handleAgregarInforme(row.row.m_nIdInforme)}
                                    className="btn btn-default btn-xs">
                                    <i className={"fa fa-plus"}
                                       style={{color: "#F9A03E"}}/>
                                </a>
                            </Tooltip>
                        </div>
                    );
                },
                width: 100,
            }

        ]
        const columnspAsignadas = [
            {
                headerName: "Folio/Serie",
                field: "m_sFolioInforme",
                flex: 1,
            },
            {
                headerName: "Fecha informe",
                field: "m_sFechaHora",
                flex: 1,
            },
            {
                headerName: "Origen",
                field: "m_sCiudadOrigen",
                flex: 1,
            },
            {
                headerName: "Destino",
                field: "m_sCiudadDestino",
                flex: 1,
            },
            {
                headerName: "Destino seleccionado",
                field: "m_sDestinoSeleccionado",
                flex: 1,
            },
            {
                headerName: "Remolque 1",
                field: "m_sRemolque1",
                flex: 1,
            },
            {
                headerName: "Remolque 2",
                field: "m_sRemolque2",
                flex: 1,
            },
            {
                headerName: "Acciones",
                flex: 1,
                field: "",
                renderCell: (row) => {
                    return (
                        <div>
                            {
                                row.row.m_bSePuedeBorrar || this.state.estatusListado === 8?
                                    <Tooltip title={"Desasignar"}>
                                        <a
                                            onClick={() => this.handleEliminarInforme(row.row.m_nIdInforme)}
                                            className="btn btn-default btn-xs">
                                            <i className={"fa fa-trash"}
                                               style={{color: "#F9A03E"}}/>
                                        </a>
                                    </Tooltip> : ""
                            }

                        </div>
                    );
                },
                width: 100,
            }

        ]



        return (

            <div onClick={()=>$.primerClick=true}>
                {/*<Dialog open={this.state.openDialog} onClose={() => this.setState({openDialog: false})}>
                    <DialogContent>
                        {this.state.tipoModal === 1 &&
                        <div className="row" style={{backgroundColor: '#FFFFFF'}}>
                            <div align="right">
                                <button onClick={() => {
                                    this.props.history.push("/Ciudades")
                                }} className="btn btn-primary primary-btn">Agregar
                                </button>
                            </div>

                            {this.state.dataCiudad.length !== 0 ? <TableCiudadesViajes object={this.state}
                                                                                       select={this.state[this.state.identificadorModal]
                                                                                       && this.state[this.state.identificadorModal].m_nIdCiudad}
                                                                                       data={this.state.dataCiudad}
                                                                                       identificadorModal={this.state.identificadorModal}
                                                                                       func={() => this.handleSelectCP}/>
                                : <div>No se encontró ningún registro</div>}


                            <DialogActions style={{justifyContent: "left"}}>

                                <button onClick={() => this.setState({openDialog: false})}
                                        className="btn btn-primary primary-btn">Aceptar
                                </button>
                                <button onClick={() => this.setState({openDialog: false})}
                                        className="btn btn-secondary secondary-btn">Cerrar
                                </button>

                            </DialogActions>
                        </div>
                        }
                        {this.state.tipoModal === 4 && (
                            <div className="row" style={{backgroundColor: "#FFFFFF"}}>
                                <div align="right">
                                    <button
                                        onClick={() => {
                                            this.props.history.push("/Unidades");
                                        }}
                                        className="btn btn-primary primary-btn"
                                    >
                                        Agregar
                                    </button>
                                </div>

                                {this.state.dataUnidades.length !== 0 ? (
                                    <TableUnidadViajes
                                        select={
                                            this.state[this.state.identificadorModal] &&
                                            this.state[this.state.identificadorModal].m_nIdUnidad
                                        }
                                        data={this.state.dataUnidades}
                                        identificadorModal={this.state.identificadorModal}
                                        func={() => this.handleSelectCP}
                                    />
                                ) : (
                                    <div>No se encontró ningún registro</div>
                                )}
                                <DialogActions style={{justifyContent: "left"}}>
                                    <button
                                        onClick={() => this.setState({openDialog: false})}
                                        className="btn btn-secondary secondary-btn"
                                    >
                                        Cerrar
                                    </button>
                                    <button
                                        onClick={() => this.setState({openDialog: false})}
                                        className="btn btn-primary primary-btn"
                                    >
                                        Aceptar
                                    </button>
                                </DialogActions>
                            </div>
                        )}
                    </DialogContent>
                </Dialog>
                <Dialog
                    fullWidth={true}
                    maxWidth={"md"}
                    open={this.state.openHistoryDialog}
                    onClose={() => this.setState({openHistoryDialog: false})}>
                    <Historial/>
                </Dialog>*/}
                {/*{
                    this.state.showAsignarOperadorDialog &&
                    <Dialog open={this.state.showAsignarOperadorDialog}
                            fullWidth={true}
                            maxWidth={"md"}
                            onClose={() => this.setState({showAsignarOperadorDialog: false})}>
                        <DialogContent>
                            <AsignarOperadorUnidad unidadAsignada={this.state.asignacionEquipo}
                                                   rutaSeleccionada={this.state}

                                                   onSubmit={(data) => this.setState({
                                                       showAsignarOperadorDialog: false,
                                                       asignacionEquipo: data
                                                   })}>
                                <DialogActions>
                                    <Button
                                        variant={"contained"}
                                        color={"primary"}
                                        type={"submit"}
                                    >Aceptar</Button>
                                    <Button
                                        variant={"outlined"}
                                        color={"primary"}
                                        onClick={() => this.setState({showAsignarOperadorDialog: false})}>Cancelar</Button>
                                </DialogActions>
                            </AsignarOperadorUnidad>
                        </DialogContent>
                    </Dialog>
                }*/}
                <DialogUnidades open={this.state.openDialogUnidades} handleClose={this.handleCloseDialogUnidades} handleAccept={this.handleAcceptDataUnidades} idOperador={this.state.operador?.m_nIdOperador} />
                {/*<DialogRemolques open={this.state.openDialogRemolques} handleClose={this.handleCloseDialogRemolques} handleAccept={this.handleAcceptDataRemolques} idConvoy={'BLANCA'} />*/}
                <DialogRemolques open={this.state.openDialogRemolques} handleClose={this.handleCloseDialogRemolques} handleAccept={this.handleAcceptDataRemolques} idConvoy={this.state.identificadorConvoyUnidad} />
                <DialogDollys open={this.state.openDialogDollys} handleClose={this.handleCloseDialogDollys} handleAccept={this.handleAcceptDataDollys} idConvoy={this.state.identificadorConvoyUnidad} />
                <Dialog
                    fullWidth={true}
                    maxWidth={'xl'}
                    open={this.state.openDestino}
                    onClose={() => this.setState({openDestino: false})}
                    aria-labelledby="max-width-dialog-title"
                >
                    <DialogTitle>Seleccione el destino al cual llegara el informe</DialogTitle>
                    <DialogContent>
                        <form onSubmit={this.onSubmitDestinoInforme}>
                            <div className="input">
                                <Autocomplete
                                    freeSolo
                                    size={"small"}
                                    onChange={(e,newValue) => this.setState({destinoSeleccionado: newValue}) }
                                    value={this.state.destinoSeleccionado}
                                    //disabled={state.agregar == "Consultar"}
                                    id="origenRemitente"
                                    disableClearable
                                    forcePopupIcon={false}
                                    options={this.state.trayectos}
                                    getOptionLabel={(option) =>
                                        option.Destino
                                    }
                                    style={{
                                        transform: "translate(14px, 10px) scale(1) !important"
                                    }}
                                    renderInput={(params) => (
                                        <div>
                                            <TextField
                                                label="Destino"
                                                size="small"
                                                variant="outlined"
                                                {...params}
                                            />
                                        </div>
                                    )}
                                />
                            </div>
                            <DialogActions>
                                <Button type={"submit"}>Aceptar</Button>
                            </DialogActions>
                        </form>
                    </DialogContent>

                </Dialog>
                <Dialog
                    fullWidth={true}
                    maxWidth={'xl'}
                    open={this.state.openDialogInformes}
                    onClose={this.handleShowDialog}
                    aria-labelledby="max-width-dialog-title"
                >
                    <DialogContent>
                        <div>
                            <div className="widget-header">
                                <h2 color={'#717171'}>Informes para asignación</h2>
                                <br/>
                                <div className="row" style={{display: "flex"}}>
                                    <div className="col-sm-12 col-md-12 unit">
                                        <div className="input">
                                            <Autocomplete
                                                freeSolo
                                                size={"small"}
                                                onChange={this.handleOrigenFiltro}
                                                value={this.state.origen}
                                                //disabled={state.agregar == "Consultar"}
                                                id="origenRemitente"
                                                disableClearable
                                                forcePopupIcon={false}
                                                options={this.state.dataCiudad.filter(c => this.props.select ? this.props.select.m_arrIdRutas.filter(t => !t.Terminado && !t.Iniciado).map(t => t.IdOrigen).includes(c.m_nIdCiudad) : true)}
                                                getOptionLabel={(option) =>
                                                    option?option.m_sCiudad:""
                                                }
                                                style={{
                                                    transform: "translate(14px, 10px) scale(1) !important"
                                                }}
                                                renderInput={(params) => (
                                                    <div>
                                                        <TextField
                                                            label="Origen"
                                                            size="small"
                                                            variant="outlined"
                                                            {...params}
                                                        />
                                                    </div>
                                                )}
                                            />
                                        </div>
                                    </div>
                                    <div className="col-sm-12 col-md-12 unit">
                                        <div className="input">
                                            <Autocomplete
                                                freeSolo
                                                onChange={this.handleDestinoFiltro}
                                                size={"small"}
                                                value={this.state.destino}
                                                //disabled={state.agregar == "Consultar"}
                                                id="destino"
                                                disableClearable
                                                forcePopupIcon={false}
                                                options={this.state.dataCiudad.filter(c => this.props.select ? !this.props.select.m_arrIdRutas.filter(t => t.Terminado || t.Iniciado).map(t => t.IdDestino).includes(c.m_nIdCiudad) : true)}
                                                getOptionLabel={(option) =>
                                                    option?option.m_sCiudad:""
                                                }
                                                style={{
                                                    transform: "translate(14px, 10px) scale(1) !important"
                                                }}
                                                renderInput={(params) => (
                                                    <div>
                                                        <TextField
                                                            label="Destino"
                                                            size="small"
                                                            variant="outlined"
                                                            {...params}
                                                        />
                                                    </div>
                                                )}
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div style={{ display: 'flex', height: '800px' }}>
                                <DataGrid
                                    localeText={dataGridLocaleText}
                                    rows={this.state.dataInformesPorAsignar}
                                    columns={columnspRorAsignar}
                                    density="compact"
                                    pageSize={Math.floor((this.state.height - 310) / 30)}
                                    getRowId={(row) => row.m_nIdInforme}
                                    onRowSelectionModelChange={(newModel)=>{
                                        if(newModel.length<1)
                                            return
                                        let row=this.state.dataInformesPorAsignar.find(i=>i.m_nIdInforme==newModel[0])
                                        this.setState({
                                            idInforme: row.m_nIdInforme
                                        })
                                    }}
                                    hideFooterRowCount
                                    hideFooterSelectedRowCount
                                />
                            </div>
                        </div>
                        {/*<DataGrid
                                localeText={dataGridLocaleText}
                                rows={this.state.dataInformesPorAsignar}
                                columns={columnspRorAsignar}
                                density="compact"
                                pageSize={Math.floor((this.state.height - 310) / 30)}
                                getRowId={(row) => row.m_nIdInforme}
                                checkboxSelection
                                onSelectionModelChange={(e) => this.handleTarifasSeleccionadas(e)}
                            />*/}

                    </DialogContent>
                    <DialogActions>
                        <Button onClick={this.handleShowDialog} color="primary" autoFocus>
                            Aceptar
                        </Button>

                    </DialogActions>
                    {  /*AQUI COMIENZA EL MODAL DE CLIENTES*/}


                </Dialog>
                <div className="widget-wrap">
                    <div className="widget-content">

                        <div className="row">
                            <form className="j-forms row"
                                  onSubmit={this.handleAceptar}
                                  onKeyDown={(e) => {if (e.code === 13){e.preventDefault()}}}>
                                <div className={"row"} style={{display: "flex"}}>
                                    {/* Sucursal */}
                                    <div className="col-sm-6 col-md-2 col-lg-2 unit">
                                        <label className="input select">
                                            <FormControl fullWidth variant="outlined" size="small" required>
                                                <InputLabel id="idSucursalAgregarLabel">Sucursal</InputLabel>
                                                <Select
                                                    labelId="idSucursalAgregarLabel"
                                                    className="form-control"
                                                    value={this.state.idSucursalAgregar}
                                                    onChange={this.handleChange}
                                                    id="idSucursalAgregar"
                                                    label="Sucursal"
                                                    disabled
                                                    name="idSucursalAgregar"
                                                >
                                                    {this.state.dataSucursal.map((sucursal) => (
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
                                    {/* Folio viaje */}
                                    <div className="col-sm-6 col-md-2 col-lg-2 unit">
                                        <div className="input">
                                            <TextField variant="outlined" size="small"
                                                       onChange={this.handleChange}
                                                       className="form-control"
                                                       type="text"
                                                       label="Folio Viaje"
                                                       value={this.state.folioViaje}
                                                       id="folioViaje"
                                                       name="folioViaje"
                                                       disabled
                                            />
                                        </div>
                                    </div>
                                    {/* Num Viaje */}
                                    <div className="col-sm-6 col-md-2 col-lg-2 unit">
                                        <div className="input">
                                            <TextField variant="outlined" size="small"
                                                       onChange={this.handleChange}
                                                       className="form-control"
                                                       type="text"
                                                       disabled={this.props.consult ||  this.state.estatusListado === 5 || this.state.estatusListado === 6 || this.state.estatusListado === 10}
                                                       required
                                                       label="Núm. Viaje Cliente"
                                                       value={this.state.viajeCliente}
                                                       id="viajeCliente"
                                                       name="viajeCliente"

                                            />
                                        </div>
                                    </div>
                                    {/* Fecha */}
                                    <div className="col-sm-6 col-md-2 col-lg-2 unit">

                                        <div className="input">
                                            <TextField variant="outlined" size="small"
                                                       onChange={this.handleChange}
                                                       required
                                                       label="Fecha / Hora de Registro"
                                                       InputLabelProps={{shrink: true,}}
                                                       disabled={this.props.consult || this.state.estatusListado === 5 || this.state.estatusListado === 6 || this.state.estatusListado === 10}
                                                       value={this.state.fechaHoraRegistro}
                                                       className="form-control"
                                                       id="fechaHoraRegistro"
                                                       type="datetime-local"
                                                       name="fechaHoraRegistro"

                                            />
                                        </div>
                                    </div>
                                    {/* Estatus viaje */}
                                    <div className="col-sm-6 col-md-2 col-lg-2 unit">
                                        <label className="input select">
                                            <FormControl fullWidth variant="outlined" size="small" required>
                                                <InputLabel id="idEstatusAgregarLabel">Estatus Viaje</InputLabel>
                                                <Select
                                                    labelId="idEstatusAgregarLabel"
                                                    className="form-control"
                                                    value={this.state.estatusListado}
                                                    onChange={this.handleChange}
                                                    id="estatusListado"
                                                    label="Estatus Viaje"
                                                    name={"estatusListado"}
                                                    disabled
                                                    InputProps={{
                                                        id: "estatusListado",
                                                        name: "estatusListado"
                                                    }}
                                                >
                                                    {this.state.dataEstatusViaje.map((estatus) => (
                                                        <option
                                                            key={estatus.m_nIdEstatusViaje}
                                                            value={estatus.m_nIdEstatusViaje}
                                                        >
                                                            {estatus.m_sEstatus}
                                                        </option>
                                                    ))}
                                                </Select>
                                            </FormControl>
                                        </label>
                                    </div>
                                    {/* Candado oficial */}
                                    <div className="col-sm-6 col-md-2 col-lg-2 unit">
                                        <div className="input">
                                            <TextField variant="outlined" size="small"
                                                       onChange={this.handleChange}
                                                       className="form-control"
                                                       type="text"
                                                       disabled={this.props.consult || this.state.estatusListado === 5 || this.state.estatusListado === 6 || this.state.estatusListado === 10}
                                                       label="Candado Oficial"
                                                       value={this.state.candadoOficial}
                                                       name="candadoOficial"
                                                       required
                                            />
                                        </div>
                                    </div>
                                    {/* Identificador */}
                                    <div className="col-sm-6 col-md-2 col-lg-2 unit">
                                        <div className="input">
                                            <TextField variant="outlined" size="small"
                                                       onChange={this.handleChange}
                                                       className="form-control"
                                                       type="text"
                                                       disabled={this.props.consult || this.state.estatusListado === 5 || this.state.estatusListado === 6 || this.state.estatusListado === 10}
                                                       label="Identificador"
                                                       value={this.state.identificadorViaje}
                                                       name="identificadorViaje"
                                                       required
                                            />
                                        </div>
                                    </div>

                                </div>

                                <div className={"row"}>
                                    {/* Origen */}
                                    <div className="col-sm-12 col-md-6 unit">
                                        <div className="input">
                                            <Autocomplete
                                                freeSolo
                                                onChange={(e, newValue) => this.setState({idCiudadOrigen: newValue})}
                                                value={this.state.idCiudadOrigen}
                                                //disabled={state.agregar == "Consultar"}
                                                id="idCiudadOrigen"
                                                size={"small"}
                                                forcePopupIcon={false}
                                                disabled={this.props.consult || this.state.estatusListado === 5 || this.state.estatusListado === 6 || this.state.estatusListado === 10}
                                                options={this.state.dataCiudad}
                                                getOptionLabel={(option) =>
                                                    option?option.m_sCiudad:""
                                                }
                                                style={{
                                                    transform: "translate(14px, 10px) scale(1) !important"
                                                }}
                                                renderInput={(params) => (
                                                    <div>
                                                        <TextField
                                                            label="Origen"
                                                            required
                                                            size="small"
                                                            variant="outlined"
                                                            {...params}
                                                        />
                                                    </div>
                                                )}
                                            />
                                        </div>
                                    </div>
                                    {/* Destino */}
                                    <div className="col-sm-12 col-md-6 unit">
                                        <div className="input">
                                            <Autocomplete
                                                freeSolo
                                                size={"small"}
                                                onChange={(e, newValue) => this.setState({idCiudadDestino: newValue})}
                                                value={this.state.idCiudadDestino}
                                                //disabled={state.agregar == "Consultar"}
                                                id="idCiudadDestino"
                                                disableClearable
                                                forcePopupIcon={false}
                                                disabled={this.props.consult || this.state.estatusListado === 5 || this.state.estatusListado === 6 || this.state.estatusListado === 10}
                                                options={this.state.dataCiudad}
                                                getOptionLabel={(option) =>
                                                    option.m_sCiudad
                                                }
                                                style={{
                                                    transform: "translate(14px, 10px) scale(1) !important"
                                                }}
                                                renderInput={(params) => (
                                                    <div>
                                                        <TextField
                                                            label="Destino"
                                                            size="small"
                                                            required
                                                            variant="outlined"
                                                            {...params}
                                                        />
                                                    </div>
                                                )}
                                            />
                                        </div>
                                    </div>
                                    <div className="col-sm-12 col-md-12 unit">
                                    <SeleccionarRuta
                                        IdRuta={this.state.idRuta}
                                        IdOrigen={this.state.idCiudadOrigen?.m_nIdCiudad ? this.state.idCiudadOrigen?.m_nIdCiudad : '' }
                                        IdDestino={this.state.idCiudadDestino?.m_nIdCiudad ? this.state.idCiudadDestino?.m_nIdCiudad : '' }
                                        IdCliente={0}
                                        viaje={true}
                                        disabled={this.props.consult || this.state.estatusListado === 5 || this.state.estatusListado === 6 || this.state.estatusListado === 10}
                                        onChangeRuta={this.handleChangeRuta}
                                        EsConsulta={this.props.consult || this.state.estatusListado === 5 || this.state.estatusListado === 6 || this.state.estatusListado === 10}
                                    />
                                    </div>
                                </div>
                                <div className="row">
                                    <div className="widget-header">
                                        <h2>Operador</h2>
                                    </div>
                                    <Grid container spacing={2}>
                                        <Grid item xs={6}>
                                            <Autocomplete
                                                freeSolo
                                                size={"small"}
                                                onChange={(e, value) => this.handleChangeAutocomplete("operador", value)}
                                                value={this.state.operador=={}?"":this.state.operador}
                                                //disabled={state.agregar == "Consultar"}
                                                id="dataOperador"
                                                forcePopupIcon={false}
                                                options={this.state.dataOperadores}
                                                getOptionLabel={(option) =>
                                                    option.m_sNombreCompleto?option.m_sNombreCompleto:""
                                                }
                                                style={{
                                                    transform: "translate(14px, 10px) scale(1) !important"
                                                }}
                                                disabled={this.props.consult || this.state.estatusListado === 5 || this.state.estatusListado === 6 || this.state.estatusListado === 10}
                                                renderInput={(params) => (
                                                    <div>
                                                        <TextField
                                                            label="Operador"
                                                            size="small"
                                                            variant="outlined"
                                                            required
                                                            {...params}
                                                            disabled={this.props.consult || this.state.estatusListado === 5 || this.state.estatusListado === 6 || this.state.estatusListado === 10}
                                                        />
                                                    </div>
                                                )}
                                            />
                                        </Grid>
                                        <Grid item xs={6}/>

                                        <Grid item xs={6}>
                                            <Autocomplete
                                                freeSolo
                                                size={"small"}
                                                onChange={(e, value) => this.handleUnidadFiltro(e, value)}
                                                value={this.state.unidad}
                                                // inputValue={this.state.unidad ? this.state.unidad.m_sDescripcion : ""}
                                                id="unidad"
                                                // disableClearable
                                                // forcePopupIcon={false}
                                                options={this.state.dataUnidades.filter(i => i.m_bActivo && i.m_nIdTipoUnidad !== 34 && (i.m_nIdentificador === 1 || i.m_nIdentificador === 2) && (this.state.IdRemolque1 ? this.state.IdRemolque1.m_nIdUnidad : 0 ) !== i.m_nIdUnidad && (this.state.IdRemolque2 ? this.state.IdRemolque2.m_nIdUnidad : 0 ) !== i.m_nIdUnidad)}
                                                getOptionLabel={(option) =>
                                                    option.m_sCodigo ? `${option.m_sCodigo} - ${option.m_sDescripcion} (${option.EstatusUnidad})` : ""
                                                }
                                                getOptionDisabled={(option) => option.EstatusUnidad !== "DISPONIBLE"}
                                                // style={{transform: "translate(14px, 10px) scale(1) !important"}}
                                                disabled={this.props.consult || this.state.estatusListado === 5 || this.state.estatusListado === 6 || this.state.estatusListado === 10}
                                                renderInput={(params) => (
                                                    <div>
                                                        <TextField
                                                            label="Unidad"
                                                            size="small"
                                                            variant="outlined"
                                                            required
                                                            {...params}
                                                            disabled={this.props.consult || this.state.estatusListado === 5 || this.state.estatusListado === 6 || this.state.estatusListado === 10}
                                                        />
                                                    </div>
                                                )}
                                            />
                                        </Grid>
                                        <Grid item xs={2}>
                                            <TextField
                                                size={"small"}
                                                variant={"outlined"}
                                                label={"Placa int"}
                                                disabled
                                                value={this.state.placaIntUnidad}/>
                                        </Grid>
                                        <Grid item xs={3}>
                                            <TextField
                                                size={"small"}
                                                variant={"outlined"}
                                                label={"Estatus"}
                                                disabled
                                                style={{backgroundColor: this.state.colorUnidad ? `#${this.state.colorUnidad}` : "white"}}
                                                value={this.state.estatusUnidad}/>
                                        </Grid>
                                        <Grid item xs={1}/>
                                        <Grid item xs={2}>
                                            <FormControlLabel
                                                control={
                                                    <Checkbox
                                                        checked={this.state.esOperadorPermisionario}
                                                        onChange={this.handleChangeDataPermisionario}
                                                        name="esOperadorPermisionario"
                                                        color="primary"
                                                        disabled
                                                        size={"medium"}
                                                    />
                                                }
                                                label="Es operador permisionario"
                                            />
                                        </Grid>
                                        <Grid item xs={10}/>

                                        {
                                            this.state.esOperadorPermisionario &&
                                            <Grid item xs={2}>
                                                <TextField
                                                    size={"small"}
                                                    variant={"outlined"}
                                                    label={"Nombre completo"}
                                                    name={"nombrePermisionario"}
                                                    inputMode={"text"}
                                                    required={this.state.esOperadorPermisionario}
                                                    value={this.state.nombrePermisionario}
                                                    onChange={this.handleChangeDataPermisionario}
                                                />
                                            </Grid>
                                        } {
                                        this.state.esOperadorPermisionario &&
                                        <Grid item xs={2}>
                                            <TextField
                                                size={"small"}
                                                variant={"outlined"}
                                                label={"No. de licencia"}
                                                name={"licenciaPermisionario"}
                                                required={this.state.esOperadorPermisionario}
                                                value={this.state.licenciaPermisionario}
                                                onChange={this.handleChangeDataPermisionario}
                                            />
                                        </Grid>
                                    }
                                        {
                                            this.state.esOperadorPermisionario &&
                                            <Grid item xs={2}>
                                                <TextField
                                                    variant="outlined"
                                                    name="fechaVigenciaPermisionario"
                                                    label="Vigencia"
                                                    type="date"
                                                    onChange={this.handleChangeDataPermisionario}
                                                    value={this.state.fechaVigenciaPermisionario}
                                                    className={"form-control"}
                                                    InputLabelProps={{shrink: true,}}
                                                    required={this.state.esOperadorPermisionario}
                                                />
                                            </Grid>
                                        }
                                    </Grid>
                                </div>

                                <div className="widget-header">
                                    <h2> Convoy</h2>
                                </div>

                                <div className="row">
                                    <Grid container spacing={1}>

                                    {/* Remolque 1 */}
                                    <Grid item container spacing={2}>
                                        <Grid item xs={6}>
                                            <div className="input">

                                                <Autocomplete
                                                    freeSolo
                                                    size={"small"}
                                                    onChange={this.handleRemolqueUnoFiltro}
                                                    value={this.state.IdRemolque1}
                                                    // inputValue={this.state.IdRemolque1 ? this.state.IdRemolque1.m_sDescripcion : ""}
                                                    //disabled={state.agregar == "Consultar"}
                                                    id="IdRemolque1"
                                                    // disableClearable
                                                    disabled={this.props.consult || this.state.estatusListado === 5 || this.state.estatusListado === 6 || this.state.estatusListado === 10}
                                                    // forcePopupIcon={false}
                                                    options={this.state.dataRemolques.filter(i => i.m_bActivo && i.m_nIdTipoUnidad !== 28 && (this.state.unidad ? this.state.unidad.m_nIdUnidad : 0 ) !== i.m_nIdUnidad && (this.state.IdRemolque2 ? this.state.IdRemolque2.m_nIdUnidad : 0 ) !== i.m_nIdUnidad)}
                                                    getOptionLabel={(option) =>
                                                        `${option.m_sCodigo} - ${option.m_sDescripcion} (${option.EstatusUnidad})`
                                                    }
                                                    getOptionDisabled={(option) => option.EstatusUnidad !== "DISPONIBLE"}
                                                    style={{
                                                        transform: "translate(14px, 10px) scale(1) !important"
                                                    }}
                                                    renderInput={(params) => (
                                                        <div>
                                                            <TextField
                                                                label="Remolque 1"
                                                                size="small"
                                                                required={this.state.aplicaRemolque === 1}
                                                                variant="outlined"
                                                                {...params}
                                                            />
                                                        </div>
                                                    )}
                                                />

                                            </div>
                                        </Grid>
                                        <Grid item xs={2}>
                                            <div className="input">
                                                <TextField variant="outlined" size="small"
                                                           className="form-control"
                                                           type="text"
                                                           disabled
                                                           label="Placas Int"

                                                           value={this.state.placasRemolque1}
                                                           name="placasRemolque1"
                                                />
                                            </div>
                                        </Grid>
                                        <Grid item xs={3}>
                                            <div className="input">
                                                <TextField variant="outlined" size="small"
                                                           className="form-control"
                                                           type="text"
                                                           label="Estatus"
                                                           disabled
                                                           style={{backgroundColor: this.state.colorRemolque1 ? `#${this.state.colorRemolque1}` : "white"}}
                                                           value={this.state.estatusRemolque1}
                                                           name="estatusRemolque1"
                                                />
                                            </div>
                                        </Grid>
                                    </Grid>

                                    <Grid item container spacing={2}>
                                        <Grid item xs={6}>
                                            <div className="input">
                                                <Autocomplete
                                                    freeSolo
                                                    size={"small"}
                                                    onChange={this.handleRemolqueDosFiltro}
                                                    value={this.state.IdRemolque2}
                                                    // inputValue={this.state.IdRemolque2 ? this.state.IdRemolque2.m_sDescripcion : ""}
                                                    //disabled={state.agregar == "Consultar"}
                                                    id="IdRemolque2"
                                                    // disableClearable
                                                    disabled={this.props.consult || this.state.estatusListado === 5 || this.state.estatusListado === 6 || this.state.estatusListado === 10}
                                                    // forcePopupIcon={false}
                                                    options={this.state.dataRemolques.filter(i => i.m_bActivo && i.m_nIdTipoUnidad !== 28 && (this.state.unidad ? this.state.unidad.m_nIdUnidad : 0 ) !== i.m_nIdUnidad && (this.state.IdRemolque1 ? this.state.IdRemolque1.m_nIdUnidad : 0 ) !== i.m_nIdUnidad)}
                                                    getOptionLabel={(option) =>
                                                        `${option.m_sCodigo} - ${option.m_sDescripcion} (${option.EstatusUnidad})`
                                                    }
                                                    getOptionDisabled={(option) => option.EstatusUnidad !== "DISPONIBLE"}
                                                    style={{
                                                        transform: "translate(14px, 10px) scale(1) !important"
                                                    }}
                                                    renderInput={(params) => (
                                                        <div>
                                                            <TextField
                                                                label="Remolque 2"
                                                                size="small"
                                                                variant="outlined"
                                                                {...params}
                                                            />
                                                        </div>
                                                    )}
                                                />

                                            </div>
                                        </Grid>
                                        <Grid item xs={2}>
                                            <div className="input">
                                                <TextField variant="outlined" size="small"
                                                           disabled
                                                           className="form-control"
                                                           type="text"
                                                           label="Placas Int"
                                                           value={this.state.placasRemolque2}
                                                           name="placasRemolque2"
                                                />
                                            </div>
                                        </Grid>
                                        <Grid item xs={3}>
                                            <div className="input">
                                                <TextField variant="outlined" size="small"
                                                           disabled
                                                           className="form-control"
                                                           type="text"
                                                           label="Estatus"
                                                           style={{backgroundColor: this.state.colorRemolque2 ? `#${this.state.colorRemolque2}` : "white"}}
                                                           value={this.state.estatusRemolque2}
                                                           name="estatusRemolque2"
                                                />
                                            </div>
                                        </Grid>
                                    </Grid>

                                    <Grid item container spacing={2}>
                                        <Grid item xs={6}>
                                            <div className="input">
                                                <Autocomplete
                                                    freeSolo
                                                    size={"small"}
                                                    onChange={this.handleDollyFiltro}
                                                    value={this.state.IdDolly}
                                                    // inputValue={this.state.IdDolly ? this.state.IdDolly.m_sDescripcion : ""}
                                                    //disabled={state.agregar == "Consultar"}
                                                    id="IdDolly"
                                                    // disableClearable
                                                    disabled={this.props.consult || this.state.estatusListado === 5 || this.state.estatusListado === 6 || this.state.estatusListado === 10}
                                                    // forcePopupIcon={false}
                                                    options={this.state.dataRemolques.filter(i => i.m_bActivo && i.m_nIdTipoUnidad === 28)}
                                                    getOptionLabel={(option) =>
                                                        option ? `${option.m_sCodigo} - ${option.m_sDescripcion} (${option.EstatusUnidad})` : ""
                                                    }
                                                    style={{
                                                        transform: "translate(14px, 10px) scale(1) !important"
                                                    }}
                                                    renderInput={(params) => (
                                                        <div>
                                                            <TextField
                                                                label="Dolly"
                                                                size="small"
                                                                variant="outlined"
                                                                {...params}
                                                            />
                                                        </div>
                                                    )}
                                                />

                                            </div>
                                        </Grid>
                                        <Grid item xs={2}>
                                            <div className="input">
                                                <TextField variant="outlined" size="small"
                                                           className="form-control"
                                                           type="text"
                                                           disabled
                                                           label="Placas Int"
                                                           value={this.state.placasDolly}
                                                           name="placasDolly"
                                                />
                                            </div>
                                        </Grid>
                                    </Grid>
                                    </Grid>

                                </div>

                                <div>
                                    <div className="widget-header">
                                        <h2 color={'#717171'}>Detalle de paradas</h2>
                                    </div>
                                    {

                                        (!this.props.consult && this.props.modificar) &&
                                        <Button variant="contained" color="primary" disabled={this.props.viajeSeleccionado.m_arrTrayectos.some(p=>
                                            (p.m_nIdSalida && !p.m_bSalidaCancelada && !p.m_nIdLlegada && !p.deshabilitado))} fullWidth onClick={(event) => this.handleShowDialog(event)}>
                                            Agregar informes
                                        </Button>
                                    }
                                    {
                                        (!this.props.consult && !this.props.modificar) &&
                                        <Button variant="contained" color="primary" fullWidth onClick={(event) => this.handleShowDialog(event)}>
                                            Agregar informes
                                        </Button>
                                    }

                                    <div className="row" style={{height: "200px", width: '100%'}}>
                                        <InformesPorAsignar {...this.props} columns={columnspAsignadas}
                                                            dataInformesAsignados={this.state.dataInformesAsignados}
                                        />
                                    </div>

                                    <br/>
                                    <ProgressBarCubicaje value={this.state.utilizacion}>{this.state.utilizacion > 100 ? `Capacidad máxima superada` : `Espacio de carga usado: ${this.state.utilizacion}%`}</ProgressBarCubicaje>
                                </div>

                                {/*<div className={"row"}>

                                    {
                                        Object.keys(this.state.asignacionEquipo).length !== 0 &&
                                        <div className="row" style={{display: "flex"}}>
                                            <div className="col-sm-6 col-md-4 unit">
                                                <div className="input">
                                                    <TextField variant="outlined" size="small"
                                                               className="form-control"
                                                               type="text"
                                                               disabled
                                                               label="Operador"
                                                               value={this.state.asignacionEquipo.operador ? this.state.asignacionEquipo.operador.m_sNombreCompleto : ""}
                                                               name="placasDolly"
                                                    />
                                                </div>
                                            </div>
                                            <div className="col-sm-6 col-md-4 unit">
                                                <div className="input">
                                                    <TextField variant="outlined" size="small"
                                                               className="form-control"
                                                               type="text"
                                                               disabled
                                                               label="Unidad"
                                                               value={`${this.state.asignacionEquipo.unidad ? this.state.asignacionEquipo.unidad.m_sCodigo : ""} - ${this.state.asignacionEquipo.unidad ? this.state.asignacionEquipo.unidad.m_sDescripcion : ""}`}
                                                               name="placasDolly"
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                    }

                                </div>*/}

                                <div className="form-footer col-md-12" style={{marginTop:'30px'}}>
                                    <Grid container spacing={1}>
                                        <Grid item xs>
                                            <Button
                                                fullWidth
                                                type="button"
                                                onClick={(event) => {
                                                    this.props.cancel()
                                                }}
                                                className="btn btn-secondary secondary-btn"
                                            >
                                                Cancelar
                                            </Button>
                                        </Grid>
                                        {
                                            !this.props.consult &&
                                            <Grid item xs>
                                                <Button
                                                    fullWidth
                                                    type="submit"
                                                    className="btn btn-primary primary-btn"
                                                    disabled={this.props.consult}
                                                >
                                                    Guardar viaje
                                                </Button>
                                            </Grid>
                                        }

                                    </Grid>
                                </div>

                            </form >
                        </div>

                    </div>
                </div>
                {/*
                <div className="row">
                    <div className="col-md-12">
                        <div className="widget-wrap">
                            <div className="widget-header">
                                <h2 color={'#717171'} >Detalle de paradas</h2>
                            </div>

                            <div className="row" style={{ height: this.state.height - 650, width: '100%' }}>
                                {this.state.dataInformesSeleccionados.length != 0 ? (
                                    <DataGrid
                                        localeText={dataGridLocaleText}
                                        rows={this.state.dataInformesSeleccionados}
                                        columns={columns2}
                                        density="compact"
                                        pageSize={Math.floor((this.state.height - 310) / 30)}
                                        getRowId={(row) => row.m_nIdInforme}
                                        onRowSelected={(row) => {
                                            this.setState({
                                                idInforme: row.data.m_nIdInforme
                                            })
                                        }}
                                    />
                                ) : (
                                    <div>No se encontró ningún registro</div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>  */}
            </div>

        );
    };
}


AgregarViaje.propTypes = {};

export default AgregarViaje;