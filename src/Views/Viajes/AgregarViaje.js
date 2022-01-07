import React, {Component} from "react";
import Autocomplete from "@material-ui/lab/Autocomplete";
import TextField from "@material-ui/core/TextField";
import InputAdornment from "@material-ui/core/InputAdornment";
import IconButton from "@material-ui/core/IconButton";
import axios from "axios";
import PageviewIcon from "@material-ui/icons/Pageview";
import {
    Button,
    Checkbox,
    Dialog,
    DialogActions,
    DialogContent,
    FormControlLabel,
    Grid,
    Tooltip
} from "@material-ui/core";
import TableCiudades from "./TableCiudades";
import TableCiudadesViajes from "./TableCiudades";
import FormControl from "@material-ui/core/FormControl";
import InputLabel from "@material-ui/core/InputLabel";
import Select from "@material-ui/core/Select";
import TableUnidadViajes from "./TablaUnidadViajes";
import {DataGrid} from "@material-ui/data-grid";
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
import {ContactsOutlined} from "@material-ui/icons";
import {obtenerInformesDisponiblesViajes} from "../../Util/Contexts/InformesContext";
import InformesPorAsignar from "./InformesPorAsignar";
import Noty from "noty";
import {obtenerEstatusUnidadeId, obtenerUnidades} from "../../Util/Contexts/UnidadesContext";
import {obtenerOperadores, obtenerOperadoresId} from "../../Util/Contexts/OperadoresContext";
import {obtenerSucursales} from "../../Util/Contexts/SucursalContext";

const headers = API_HEADERS

function showSuccess(mensaje) {
    new Noty({
        type: "information",
        layout: "topCenter",
        text: mensaje,
        timeout: "3000"
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
            idRuta: {},
            idCiudadOrigen: {},
            idCiudadDestino: {},
            dataCiudad: [],
            dataUnidades: [],
            dataRutas: [],
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
            idSucursalAgregar: localStorage.getItem("Sucursal"),
            folioViaje: "",
            viajeCliente: "",
            fechaHoraCreacion: this.getCurrentDateTime(),
            fechaHoraRegistro: this.getCurrentDateTime(),
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
            cargadoVacioRemolqueUno: false,
            cargadoVacioRemolqueDos: false,
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
            openDialogInformes:false
        }

        this.getAllCiudades = this.getAllCiudades.bind(this);
        this.getAllRutas = this.getAllRutas.bind(this);
        this.getAllCodigosPostales = this.getAllCodigosPostales.bind(this);
        this.getAllSucursales = this.getAllSucursales.bind(this);
        this.getAllEstatusViaje = this.getAllEstatusViaje.bind(this);
        this.getAllUnidades = this.getAllUnidades.bind(this);
        this.handleSelectCP = this.handleSelectCP.bind(this);
        this.handleChange = this.handleChange.bind(this);
        this.getInformesByFiltro = this.getInformesByFiltro.bind(this);
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

    }

    componentWillMount() {
        this.getAllCiudades()
        //this.getAllRutas()
        //this.getAllCodigosPostales()
        this.getAllSucursales()
        this.getAllEstatusViaje();
        this.getAllUnidades();
        this.getAllOperadores();
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        if (this.state.id !== this.props.id && this.props.id > 0 && (this.props.consult || this.props.modificar)) {
            // console.log(this.props.select)
            this.setState(state => {
                return {
                    ...state,
                    id: this.props.select.m_nIdViaje,
                    idCiudadOrigen: {
                        "m_sCiudad": this.props.select.m_sOrigen,
                        "m_nIdCiudad": this.props.select.m_nIdOrigen
                    },
                    idCiudadDestino: {
                        "m_sCiudad": this.props.select.m_sDestino,
                        "m_nIdCiudad": this.props.select.m_nIdDestino
                    },
                    IdRemolque1: {
                        m_nIdUnidad: this.props.select.m_nIdRemolque1,
                        m_sDescripcion: this.props.select.m_sDescripcionRemolque1,
                        m_sCodigo: this.props.select.m_sCodigoRemolque1,
                    },
                    placasRemolque1: this.props.select.m_sPlacasRemolque1,
                    colorRemolque1: this.props.select.m_sColorRemolque1,
                    estatusRemolque1: this.props.select.m_sEstatusRemolque1,
                    IdRemolque2: {
                        m_nIdUnidad: this.props.select.m_nIdRemolque2,
                        m_sDescripcion: this.props.select.m_sDescripcionRemolque2,
                        m_sCodigo: this.props.select.m_sCodigoRemolque2,
                    },
                    placasRemolque2: this.props.select.m_sPlacasRemolque2,
                    colorRemolque2: this.props.select.m_sColorRemolque2,
                    estatusRemolque2: this.props.select.m_sEstatusRemolque2,
                    IdDolly: {
                        m_nIdUnidad: this.props.select.m_nIdDolly,
                        m_sDescripcion: this.props.select.m_sDescripcionDolly,
                        m_sCodigo: this.props.select.m_sCodigoDolly,
                    },
                    placasDolly: this.props.select.m_sPlacasDolly,
                    operador: {
                        m_nIdOperador: this.props.select.m_nIdOperador,
                        m_sNombreCompleto: this.props.select.m_sNombreOperador,
                    },
                    unidad: {
                        m_nIdUnidad: this.props.select.m_nIdUnidad,
                        m_sCodigo: this.props.select.m_sCodigoUnidad,
                        m_sDescripcion: this.props.select.m_sDescripcionUnidad
                    },
                    placaIntUnidad: this.props.select.m_sPlacasUnidad,
                    estatusUnidad: this.props.select.m_sEstatusUnidad,
                    colorUnidad: this.props.select.m_sColorUnidad,
                    kms: '',
                    horas: '',
                    fechaHoraRegistro: this.props.select.m_dFecha + "T" + this.props.select.m_tHora.substr(0, 5),
                    estatusListado: this.props.select.m_nIdEstatusViaje,
                    idSucursalAgregar: this.props.select.m_nIdSucursal,
                    candadoOficial: this.props.select.m_sCandadoOficial,
                    folioViaje: this.props.select.m_sFolioViaje,
                    identificadorViaje: this.props.select.m_sIdentificador,
                    viajeCliente: this.props.select.m_sNumViajeCliente,
                    CreadoPor: this.props.select.CreadoPor,
                    dataInformesAsignados: this.props.select.m_arrInformes,

                }
            })
        }
    }

    getCurrentDateTime = () => {
        return `${new Date().getFullYear()}-${`${new Date().getMonth() +
        1}`.padStart(2, 0)}-${`${new Date().getDate()}`.padStart(2, 0)}T${`${new Date().getHours()}`.padStart(2, 0)}:${`${new Date().getMinutes()}`.padStart(2, 0)}`
    }

    handleAceptar = (e) => {
        if (e){
            e.preventDefault();
        }
        if (this.state.dataInformesAsignados.length === 0){
            showSuccess("No puede guardar un viaje sin informes.")
            return
        }

        var params = {
            m_nIdViaje: this.props.id,
            m_sFecha: this.state.fechaHoraRegistro.substr(0, 10),
            m_sHora: this.state.fechaHoraRegistro.substr(this.state.fechaHoraRegistro.length - 5),
            m_nIdEstatusViaje: this.state.estatusListado,
            m_nIdSucursal: this.state.idSucursalAgregar,
            m_sCandadoOficial: this.state.candadoOficial,
            m_sFolioViaje: this.state.folioViaje,
            m_sIdentificador: this.state.identificadorViaje,
            m_sNumViajeCliente: this.state.viajeCliente,
            CreadoPor: this.state.CreadoPor,
            m_arrInformes: this.state.dataInformesAsignados,
            m_nIdOrigen: this.state.idCiudadOrigen.m_nIdCiudad,
            m_nDestino: this.state.idCiudadDestino.m_nIdCiudad,
            IdRemolque1: this.state.IdRemolque1.m_nIdUnidad,
            IdRemolque2: this.state.IdRemolque2 ? this.state.IdRemolque2.m_nIdUnidad : 0,
            IdDolly: this.state.IdDolly ? this.state.IdDolly.m_nIdUnidad : 0,
            asignacionUnidad: {
                idUnidad: this.state.unidad.m_nIdUnidad,
                idOperador: this.state.operador.m_nIdOperador,
                CRV1: this.state.cargadoVacioRemolqueUno,
                CRV2: this.state.cargadoVacioRemolqueDos,
                referencia: this.state.referencia,
                kilometro: this.state.kms,
                fechaCarga: this.state.fechaCarga,
                horas: this.state.horas,
                fechaEntrega: this.state.fechaEntregaGeneral,
                fechaInforme: this.state.fechaInforme,
                horaInforme: this.state.horaInforme,
                estatus: this.state.estatusInforme,
                horaEntrega: this.state.horaEntregaGeneral,
            }
        }
        console.log(this.props.modificar)
        if (this.props.modificar) {
            modificarViaje(this.props.id, params)
                .then((respuesta) => {
                    showSuccess(respuesta.data)

                    $('.nav-tabs li ').removeClass('active');
                    $('.nav-tabs li').eq(0).addClass('active');
                    $('.tab-content div ').removeClass('in show');
                    $('#Listado').addClass('in show');
                    this.props.reload()
                    this.handleClearData()
                })
                .catch((err) => {
                    // console.log(err);
                    showSuccess(err);
                });
        } else {
            agregarViaje(params)
                .then((respuesta) => {
                    showSuccess(respuesta.data)
                    $('.nav-tabs li ').removeClass('active');
                    $('.nav-tabs li').eq(0).addClass('active');
                    $('.tab-content div ').removeClass('in show');
                    $('#Listado').addClass('in show');
                    this.props.reload()
                    this.handleClearData()
                })
                .catch((err) => {
                    console.log(err);
                    showSuccess(err);
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
            idRuta: {},
            idCiudadOrigen: {},
            idCiudadDestino: {},
            dataInformesPorAsignar: [],
            dataInformesAsignados: [],
            dataInformesSeleccionados: [],
            showPopUp: false,
            showDialog: false,
            tipoModal: 0,
            idSucursalAgregar: localStorage.getItem("Sucursal"),
            folioViaje: "",
            viajeCliente: "",
            fechaHoraCreacion: this.getCurrentDateTime(),
            fechaHoraRegistro: this.getCurrentDateTime(),
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
            cargadoVacioRemolqueUno: false,
            cargadoVacioRemolqueDos: false,
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

    getAllRutas() {
        const url = `${process.env.REACT_APP_API_URL}/Rutas/GetListado`;
        axios.get(url, {headers}).then((respuesta) => {
            this.setState({dataRuta: respuesta.data})
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
        const url = `${process.env.REACT_APP_API_URL}/SisEstatus/getListadoViajes`;
        axios.get(url, {headers}).then((respuesta) => {
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

    getInformesByFiltro(nIdRuta, nIdCiudadOrigen, nIdCiudadDestino, nIdRemolque1, nIdRemolque2, nIdDolly) {
        const url = `${process.env.REACT_APP_API_URL}/Informes/GetByFiltro` + "/" + nIdRuta + "/" +
            nIdCiudadOrigen + "/" + nIdCiudadDestino + "/" + nIdRemolque1 + "/" + nIdRemolque2 + "/" + nIdDolly;
        axios.get(url, {headers}).then((respuesta) => {
            this.setState({dataInformesAsignados: respuesta.data})
        });
    }

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

    handleRemolqueUnoFiltro(event, newValue) {
        event.preventDefault();
        obtenerEstatusUnidadeId(newValue.m_nIdUnidad).then((resultado) => {
            if (resultado.data.m_sEstatus === "DISPONIBLE"){
                this.setState({
                    IdRemolque1: newValue,
                    placasRemolque1: newValue.m_sPlacas,
                    colorRemolque1: resultado.data instanceof String ? "" : resultado.data.m_sColor,
                    estatusRemolque1: resultado.data instanceof String ? "" : resultado.data.m_sEstatus
                })
            }else {
                showSuccess("La unidad seleccionada no está disponible")
            }

        })
        if (this.state.idRuta.m_nIdRuta && this.state.origen.m_nIdCiudad && this.state.destino.m_nIdCiudad && newValue.m_nIdUnidad && this.state.IdRemolque2.m_nIdUnidad && this.state.IdDolly.m_nIdUnidad) {

            this.getInformesByFiltro(this.state.idRuta.m_nIdRuta, this.state.origen.m_nIdCiudad, this.state.destino.m_nIdCiudad,
                newValue.m_nIdUnidad, this.state.IdRemolque2.m_nIdUnidad, this.state.IdDolly.m_nIdUnidad)
        }
    }

    handleRemolqueDosFiltro(event, newValue) {
        event.preventDefault();
        obtenerEstatusUnidadeId(newValue.m_nIdUnidad).then((resultado) => {
            if (resultado.data.m_sEstatus === "DISPONIBLE"){
                this.setState({
                    IdRemolque2: newValue,
                    placasRemolque2: newValue.m_sPlacas,
                    colorRemolque2: resultado.data instanceof String ? "" : resultado.data.m_sColor,
                    estatusRemolque2: resultado.data instanceof String ? "" : resultado.data.m_sEstatus
                })
            }else{
                showSuccess("La unidad seleccionada no está disponible")
            }
        })

        if (this.state.idRuta.m_nIdRuta && this.state.origen.m_nIdCiudad && this.state.destino.m_nIdCiudad && this.state.IdRemolque1.m_nIdUnidad && newValue.m_nIdUnidad && this.state.IdDolly.m_nIdUnidad) {

            this.getInformesByFiltro(this.state.idRuta.m_nIdRuta, this.state.origen.m_nIdCiudad, this.state.destino.m_nIdCiudad,
                this.state.IdRemolque1.m_nIdUnidad, newValue.m_nIdUnidad, this.state.IdDolly.m_nIdUnidad)
        }
    }

    handleUnidadFiltro(event, newValue) {
        event.preventDefault();
        obtenerEstatusUnidadeId(newValue.m_nIdUnidad).then((resultado) => {
            if (resultado.data.m_sEstatus === "DISPONIBLE"){
                this.setState({
                    unidad: newValue,
                    placaIntUnidad: newValue.m_sPlacas,
                    estatusUnidad: resultado.data instanceof String  ? "" : resultado.data.m_sEstatus,
                    colorUnidad: resultado.data instanceof String ? "" : resultado.data.m_sColor,
                    kms: newValue.m_nOdometro,
                    horas: newValue.m_nHorasTrabajadasMotorNoGPS
                })
            }else{
                showSuccess("La unidad seleccionada no está disponible")
            }
        })

        if (this.state.idRuta.m_nIdRuta && this.state.origen.m_nIdCiudad && this.state.destino.m_nIdCiudad && this.state.IdRemolque1.m_nIdUnidad && newValue.m_nIdUnidad && this.state.IdDolly.m_nIdUnidad) {

            this.getInformesByFiltro(this.state.idRuta.m_nIdRuta, this.state.origen.m_nIdCiudad, this.state.destino.m_nIdCiudad,
                this.state.IdRemolque1.m_nIdUnidad, newValue.m_nIdUnidad, this.state.IdDolly.m_nIdUnidad)
        }
    }

    handleDollyFiltro(event, newValue) {
        event.preventDefault();
        this.setState({IdDolly: newValue, placasDolly: newValue.m_sPlacas})
        if (this.state.idRuta.m_nIdRuta && this.state.origen.m_nIdCiudad && this.state.destino.m_nIdCiudad && this.state.IdRemolque1.m_nIdUnidad && this.state.IdRemolque2.m_nIdUnidad && newValue.m_nIdUnidad) {

            this.getInformesByFiltro(this.state.idRuta.m_nIdRuta, this.state.origen.m_nIdCiudad, this.state.destino.m_nIdCiudad,
                this.state.IdRemolque1.m_nIdUnidad, this.state.IdRemolque2.m_nIdUnidad, newValue.m_nIdUnidad)
        }
    }

    handleAgregarInforme(id) {
        if (this.state.dataInformesAsignados.find(i => i.m_nIdInforme === id) === undefined){
            var arrayInformesAsignados = this.state.dataInformesAsignados
            var informeAsignar = this.state.dataInformesPorAsignar.find(i => i.m_nIdInforme === id)
            arrayInformesAsignados.push(informeAsignar)
            this.setState({dataInformesAsignados: arrayInformesAsignados})
            showSuccess("El informe "+informeAsignar.m_sFolioInforme+" fue agregado con exito.")
        }else{
            showSuccess("El informe ya se encuentra en el viaje.")
        }

    }

    handleEliminarInforme(id) {
        var dataInformesAsignados = [...this.state.dataInformesAsignados]
        dataInformesAsignados.splice(dataInformesAsignados.findIndex(i => i.m_nIdInforme === id), 1)
        this.setState({dataInformesAsignados: dataInformesAsignados})
    }

    handleChangeAutocomplete = (input, value) => {
        this.setState({
            [input]: value
        });
    }

    handleChangeCheckbox = (e) => {
        this.setState({
            [e.target.name]: e.target.checked
        });
    }

    handleShowDialog = (event) => {
        event.preventDefault()
        this.setState({
            openDialogInformes: !this.state.openDialogInformes,
        })
    };

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
                headerName: "Operador",
                field: "m_sNombreCompleto",
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
                headerName: "Operador",
                field: "m_sNombreCompleto",
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
                            <Tooltip title={"Desasignar"}>
                                <a
                                    onClick={() => this.handleEliminarInforme(row.row.m_nIdInforme)}
                                    className="btn btn-default btn-xs">
                                    <i className={"fa fa-trash"}
                                       style={{color: "#F9A03E"}}/>
                                </a>
                            </Tooltip>
                        </div>
                    );
                },
                width: 100,
            }

        ]


        return (

            <div>
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
                                                onChange={this.handleOrigenFiltro}
                                                value={this.state.origen}
                                                //disabled={state.agregar == "Consultar"}
                                                id="origenRemitente"
                                                disableClearable
                                                forcePopupIcon={false}
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
                                                            label="Origen"
                                                            margin="dense"
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

                                                value={this.state.destino}
                                                //disabled={state.agregar == "Consultar"}
                                                id="destino"
                                                disableClearable
                                                forcePopupIcon={false}
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
                                                            margin="dense"
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
                                    onRowSelected={(row) => {
                                        this.setState({
                                            idInforme: row.data.m_nIdInforme

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
                                            <FormControl fullWidth variant="outlined" margin="dense" required>
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
                                            <TextField variant="outlined" margin="dense"
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
                                            <TextField variant="outlined" margin="dense"
                                                       onChange={this.handleChange}
                                                       className="form-control"
                                                       type="text"
                                                       disabled={this.props.consult}
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
                                            <TextField variant="outlined" margin="dense"
                                                       onChange={this.handleChange}
                                                       required
                                                       label="Fecha / Hora de Registro"
                                                       InputLabelProps={{shrink: true,}}
                                                       disabled={this.props.consult}
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
                                            <FormControl fullWidth variant="outlined" margin="dense" required>
                                                <InputLabel id="idEstatusAgregarLabel">Estatus Viaje</InputLabel>
                                                <Select
                                                    labelId="idEstatusAgregarLabel"
                                                    className="form-control"
                                                    value={this.state.estatusListado}
                                                    onChange={this.handleChange}
                                                    id="estatusListado"
                                                    label="Estatus Viaje"
                                                    name={"estatusListado"}
                                                    disabled={this.props.consult}
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
                                            <TextField variant="outlined" margin="dense"
                                                       onChange={this.handleChange}
                                                       className="form-control"
                                                       type="text"
                                                       disabled={this.props.consult}
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
                                            <TextField variant="outlined" margin="dense"
                                                       onChange={this.handleChange}
                                                       className="form-control"
                                                       type="text"
                                                       disabled={this.props.consult}
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
                                                disableClearable
                                                forcePopupIcon={false}
                                                disabled={this.props.consult}
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
                                                            label="Origen"
                                                            required
                                                            margin="dense"
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
                                                onChange={(e, newValue) => this.setState({idCiudadDestino: newValue})}
                                                value={this.state.idCiudadDestino}
                                                //disabled={state.agregar == "Consultar"}
                                                id="idCiudadDestino"
                                                disableClearable
                                                forcePopupIcon={false}
                                                disabled={this.props.consult}
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
                                                            margin="dense"
                                                            required
                                                            variant="outlined"
                                                            {...params}
                                                        />
                                                    </div>
                                                )}
                                            />
                                        </div>
                                    </div>
                                </div>

                                {/*{
                                    !this.props.consult &&
                                    <div>
                                        <div className="widget-header">
                                            <h2 color={'#717171'}>Informes para asignación</h2>
                                            <br/>
                                            <div className="row" style={{display: "flex"}}>
                                                <div className="col-sm-12 col-md-12 unit">
                                                    <div className="input">
                                                        <Autocomplete
                                                            freeSolo
                                                            onChange={this.handleOrigenFiltro}
                                                            value={this.state.origen}
                                                            //disabled={state.agregar == "Consultar"}
                                                            id="origenRemitente"
                                                            disableClearable
                                                            forcePopupIcon={false}
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
                                                                        label="Origen"
                                                                        margin="dense"
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

                                                            value={this.state.destino}
                                                            //disabled={state.agregar == "Consultar"}
                                                            id="destino"
                                                            disableClearable
                                                            forcePopupIcon={false}
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
                                                                        margin="dense"
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
                                        <div className="row" style={{height: "200px", width: '100%'}}>
                                            <DataGrid
                                                localeText={dataGridLocaleText}
                                                rows={this.state.dataInformesPorAsignar}
                                                columns={columnspRorAsignar}
                                                density="compact"
                                                pageSize={Math.floor((this.state.height - 310) / 30)}
                                                getRowId={(row) => row.m_nIdInforme}
                                                onRowSelected={(row) => {
                                                    this.setState({
                                                        idInforme: row.data.m_nIdInforme

                                                    })
                                                }}
                                                hideFooter
                                            />

                                        </div>
                                    </div>
                                }*/}



                                <div className="row">
                                    <div className="widget-header">
                                        <h2>Operador</h2>
                                    </div>
                                    <Grid container spacing={2}>
                                        {/*<Grid item xs={6}>
                        <TextField
                            margin={"dense"}
                            variant={"outlined"}
                            label={"Origen"}
                            disabled
                            value={data.origen}/>
                    </Grid>
                    <Grid item xs={6}>
                        <TextField
                            margin={"dense"}
                            variant={"outlined"}
                            label={"Destino"}
                            disabled
                            value={data.destino}/>
                    </Grid>*/}
                                        {/*<Grid item xs={3}>
                                            <FormControlLabel
                                                control={
                                                    <Checkbox
                                                        checked={this.state.cargadoVacioRemolqueUno}
                                                        onChange={this.handleChangeCheckbox}
                                                        name="cargadoVacioRemolqueUno"
                                                        //disabled={!(this.state.dataInformesAsignados.length !== 0 && !this.props.consult)}
                                                    />
                                                }
                                                label={"Cargado/Vacío Remolque 1"}
                                            />
                                        </Grid>
                                        <Grid item xs={3}>
                                            <FormControlLabel
                                                control={
                                                    <Checkbox
                                                        checked={this.state.cargadoVacioRemolqueDos}
                                                        onChange={this.handleChangeCheckbox}
                                                        name="cargadoVacioRemolqueDos"
                                                        //disabled={!(this.state.dataInformesAsignados.length !== 0 && !this.props.consult)}
                                                    />
                                                }
                                                label={"Cargado/Vacío Remolque 2"}
                                            />
                                        </Grid>*/}
                                        {/*<Grid item xs={6}/>*/}
                                        <Grid item xs={6}>
                                            <Autocomplete
                                                freeSolo
                                                onChange={(e, value) => this.handleChangeAutocomplete("operador", value)}
                                                value={this.state.operador}
                                                //disabled={state.agregar == "Consultar"}
                                                id="dataOperador"
                                                disableClearable
                                                forcePopupIcon={false}
                                                options={this.state.dataOperadores}
                                                getOptionLabel={(option) =>
                                                    option.m_sNombreCompleto
                                                }
                                                style={{
                                                    transform: "translate(14px, 10px) scale(1) !important"
                                                }}
                                                disabled={this.props.consult}
                                                renderInput={(params) => (
                                                    <div>
                                                        <TextField
                                                            label="Operador"
                                                            margin="dense"
                                                            variant="outlined"
                                                            required
                                                            {...params}
                                                            disabled={this.props.consult}
                                                        />
                                                    </div>
                                                )}
                                            />
                                        </Grid>
                                        <Grid item xs={6}/>

                                        <Grid item xs={6}>
                                            <Autocomplete
                                                // freeSolo
                                                onChange={(e, value) => this.handleUnidadFiltro(e, value)}
                                                value={this.state.unidad}
                                                inputValue={this.state.unidad ? this.state.unidad.m_sDescripcion : ""}
                                                //disabled={state.agregar == "Consultar"}
                                                id="unidad"
                                                disableClearable
                                                forcePopupIcon={false}
                                                options={this.state.dataUnidades.filter(i => i.m_bActivo)}
                                                getOptionLabel={(option) =>
                                                    option.m_sCodigo ? `${option.m_sCodigo} - ${option.m_sDescripcion}` : ""
                                                }
                                                style={{transform: "translate(14px, 10px) scale(1) !important"}}
                                                disabled={this.props.consult}
                                                renderInput={(params) => (
                                                    <div>
                                                        <TextField
                                                            label="Unidad"
                                                            margin="dense"
                                                            variant="outlined"
                                                            required
                                                            {...params}
                                                            disabled={this.props.consult}
                                                        />
                                                    </div>
                                                )}
                                            />
                                        </Grid>
                                        <Grid item xs={2}>
                                            <TextField
                                                margin={"dense"}
                                                variant={"outlined"}
                                                label={"Placa int"}
                                                disabled
                                                value={this.state.placaIntUnidad}/>
                                        </Grid>
                                        <Grid item xs={3}>
                                            <TextField
                                                margin={"dense"}
                                                variant={"outlined"}
                                                label={"Estatus"}
                                                disabled
                                                style={{backgroundColor: this.state.colorUnidad ? `#${this.state.colorUnidad}` : "white"}}
                                                value={this.state.estatusUnidad}/>
                                        </Grid>
                                        <Grid item xs={1}/>

                                        {/*<Grid item xs={3}>
                                            <TextField
                                                margin={"dense"}
                                                variant={"outlined"}
                                                label={"Referencia"}
                                                onChange={this.handleChange}
                                                value={this.state.referencia}
                                                name={"referencia"}
                                                disabled={!(this.state.dataInformesAsignados.length > 0 && !this.props.consult)}
                                            />
                                        </Grid>
                                        <Grid item xs={3}>
                                            <TextField
                                                margin={"dense"}
                                                variant={"outlined"}
                                                label={"Kilómetros"}
                                                disabled
                                                // onChange={(e) => setData({...data, kms: e.target.value})}
                                                value={this.state.kms}/>
                                        </Grid>
                                        <Grid item xs={2}>
                                            <TextField
                                                margin={"dense"}
                                                variant={"outlined"}
                                                label={"Horas"}
                                                disabled
                                                // onChange={(e) => setData({...data, horas: e.target.value})}
                                                value={this.state.horas}/>
                                        </Grid>*/}
                                        {/*<Grid item xs={4}/>*/}
                                    </Grid>
                                </div>

                                <div className="widget-header">
                                    <h2> Convoy</h2>
                                </div>

                                <div className="row">

                                    {/* Remolque 1 */}
                                    <Grid container spacing={2}>
                                        <Grid item xs={6}>
                                            <div className="input">

                                                <Autocomplete
                                                    // freeSolo
                                                    onChange={this.handleRemolqueUnoFiltro}
                                                    value={this.state.IdRemolque1}
                                                    inputValue={this.state.IdRemolque1 ? this.state.IdRemolque1.m_sDescripcion : ""}
                                                    //disabled={state.agregar == "Consultar"}
                                                    id="IdRemolque1"
                                                    disableClearable
                                                    disabled={this.props.consult}
                                                    forcePopupIcon={false}
                                                    options={this.state.dataUnidades.filter(i => i.m_bActivo)}
                                                    getOptionLabel={(option) =>
                                                        `${option.m_sCodigo} - ${option.m_sDescripcion}`
                                                    }
                                                    style={{
                                                        transform: "translate(14px, 10px) scale(1) !important"
                                                    }}
                                                    renderInput={(params) => (
                                                        <div>
                                                            <TextField
                                                                label="Remolque 1"
                                                                margin="dense"
                                                                required
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
                                                <TextField variant="outlined" margin="dense"
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
                                                <TextField variant="outlined" margin="dense"
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

                                    <Grid container spacing={2}>
                                        <Grid item xs={6}>
                                            <div className="input">
                                                <Autocomplete
                                                    // freeSolo
                                                    onChange={this.handleRemolqueDosFiltro}
                                                    value={this.state.IdRemolque2}
                                                    inputValue={this.state.IdRemolque2 ? this.state.IdRemolque2.m_sDescripcion : ""}
                                                    //disabled={state.agregar == "Consultar"}
                                                    id="IdRemolque2"
                                                    disableClearable
                                                    disabled={this.props.consult}
                                                    forcePopupIcon={false}
                                                    options={this.state.dataUnidades.filter(i => i.m_bActivo)}
                                                    getOptionLabel={(option) =>
                                                        `${option.m_sCodigo} - ${option.m_sDescripcion}`
                                                    }
                                                    style={{
                                                        transform: "translate(14px, 10px) scale(1) !important"
                                                    }}
                                                    renderInput={(params) => (
                                                        <div>
                                                            <TextField
                                                                label="Remolque 2"
                                                                margin="dense"
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
                                                <TextField variant="outlined" margin="dense"
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
                                                <TextField variant="outlined" margin="dense"
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

                                    <Grid container spacing={2}>
                                        <Grid item xs={6}>
                                            <div className="input">
                                                <Autocomplete
                                                    // freeSolo
                                                    onChange={this.handleDollyFiltro}
                                                    value={this.state.IdDolly}
                                                    inputValue={this.state.IdDolly ? this.state.IdDolly.m_sDescripcion : ""}
                                                    //disabled={state.agregar == "Consultar"}
                                                    id="IdDolly"
                                                    disableClearable
                                                    disabled={this.props.consult}
                                                    forcePopupIcon={false}
                                                    options={this.state.dataUnidades.filter(i => i.m_bActivo)}
                                                    getOptionLabel={(option) =>
                                                        option ? `${option.m_sCodigo} - ${option.m_sDescripcion}` : ""
                                                    }
                                                    style={{
                                                        transform: "translate(14px, 10px) scale(1) !important"
                                                    }}
                                                    renderInput={(params) => (
                                                        <div>
                                                            <TextField
                                                                label="Dolly"
                                                                margin="dense"
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
                                                <TextField variant="outlined" margin="dense"
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

                                </div>

                                <div>
                                    <div className="widget-header">
                                        <h2 color={'#717171'}>Detalle de paradas</h2>
                                    </div>
                                    <Button variant="contained" color="primary" fullWidth onClick={(event) => this.handleShowDialog(event)}>
                                        Agregar informes
                                    </Button>
                                    <div className="row" style={{height: "200px", width: '100%'}}>
                                        <InformesPorAsignar {...this.props} columns={columnspAsignadas}
                                                            dataInformesAsignados={this.state.dataInformesAsignados}
                                        />
                                    </div>
                                </div>

                                {/*<div className={"row"}>

                                    {
                                        Object.keys(this.state.asignacionEquipo).length !== 0 &&
                                        <div className="row" style={{display: "flex"}}>
                                            <div className="col-sm-6 col-md-4 unit">
                                                <div className="input">
                                                    <TextField variant="outlined" margin="dense"
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
                                                    <TextField variant="outlined" margin="dense"
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
                                                    event.stopPropagation();
                                                    this.setState({...this.state, agregar: "Agregar"});
                                                    $('.nav-tabs li ').removeClass('active');
                                                    $('.nav-tabs li').eq(0).addClass('active');
                                                    $('.tab-content div ').removeClass('in show');
                                                    $('#Listado').addClass('in show');
                                                }}
                                                className="btn btn-secondary secondary-btn"
                                            >
                                                Cancelar
                                            </Button>
                                        </Grid>
                                        <Grid item xs>
                                            <Button
                                                fullWidth
                                                type="submit"
                                                className="btn btn-primary primary-btn"
                                                disabled={this.agregar === "Consultar"}
                                            >
                                                Guardar viaje
                                            </Button>
                                        </Grid>
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