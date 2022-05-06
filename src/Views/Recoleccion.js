import React, {useEffect, useState, useMemo, useCallback} from "react";
import axios from "axios";
import Cabecera from "../Components/Template/Cabecera";
import BarraLateralIzquierda from "../Components/Template/BarraLateralIzquierda";
import BarraLateralDerecha from "../Components/Template/BarraLateralDerecha";
import ExportCSV from "../Components/Template/Export";
import ExportPDF from "../Components/Template/ExportPDF";
import Carousel from "re-carousel";
import IndicatorDots from "../Util/Dots";
import Buttons from "../Util/CarruselButtons";
import {makeStyles} from "@material-ui/core/styles";
import * as XLSX from "xlsx";
import useModal from "react-hooks-use-modal";
import IconButton from "@material-ui/core/IconButton";
import SearchIcon from "@material-ui/icons/Search";
import ReplayIcon from '@material-ui/icons/Replay';
import Autocomplete from "@material-ui/lab/Autocomplete";
import TextField from "@material-ui/core/TextField";
import {GridOverlay, DataGrid} from '@material-ui/data-grid';
import InputAdornment from "@material-ui/core/InputAdornment";
import LinearProgress from '@material-ui/core/LinearProgress';
import SvgIcon from "@material-ui/core/SvgIcon";
import {ReactComponent as Activo} from "../iconos/Menu/palomita.svg";
import {ReactComponent as NoActivo} from "../iconos/Menu/cruz.svg";
import {
    useTable,
    useFilters,
    useAsyncDebounce,
    useSortBy,
} from "react-table";
import $ from "jquery";
import {getCurrentDateTime, validarDerecho} from "../Util/Util"
import {remove_array_element} from "../Util/Util";
import {useHistory, Redirect} from 'react-router-dom';
import {confirmAlert} from 'react-confirm-alert'; // Import
import 'react-confirm-alert/src/react-confirm-alert.css'; // Import css
import RestartAltIcon from '@material-ui/icons/Refresh';
import {obtenerParametrosConfiguracion} from "../Util/Contexts/ParametrosConfiguracionContext";
import Noty from 'noty';
import {
    Button, Chip,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    FormControl,
    FormControlLabel, Grid,
    InputLabel, MenuItem,
    Select,
    Step,
    StepLabel,
    Stepper,
    Tooltip
} from "@material-ui/core";
import {API_HEADERS, dataGridLocaleText} from "../Constants";
import {obtenerCiudades, obtenerCiudadId} from "../Util/Contexts/CiudadesContext";
import {
    obtenerCodigoPostal,
    obtenerCodigoPostalCiudad, obtenerCodigoPostalEstado,
    obtenerCodigoPostalId, obtenerCodigosPostalesPorCiudad, obtenerCodigosPostalesPorEstadoMunicipio
} from "../Util/Contexts/CodigoPostalContext";
import {
    actualizarRemitentesDestinatarios,
    obtenerRemitentesDestinatarios,
    obtenerRemitentesDestinatariosId
} from "../Util/Contexts/RemitenteDestinatarioContext";
import {obtenerEmbalajes, obtenerEmbalajesId} from "../Util/Contexts/EmbalajesContext";
import {obtenerEstatusRecoleccion} from "../Util/Contexts/EstatusContext";
import {obtenerMonedas} from "../Util/Contexts/MonedaContext";
import {obtenerOperadores} from "../Util/Contexts/OperadoresContext";
import {
    agregarRecoleccion,
    modificarRecoleccion,
    obtenerRecoleccionCancelada,
    cancelarRecoleccion,
    eliminarRecoleccion,
    obtenerRecoleccionId,
    obtenerRecoleccionFiltro,
    obtenerRecoleccion, obtenerRecoleccionReporte
} from "../Util/Contexts/RecoleccionContext";
import {obtenerTipoUnidades, obtenerTipoUnidadesId} from "../Util/Contexts/TipoUnidadContext";
import {obtenerUnidades, obtenerUnidadesId, obtenerUnidadesTipo} from "../Util/Contexts/UnidadesContext";
import {validarPermisos} from "../Util/Contexts/UsuarioContext";
import {obtenerTipoCambio} from "../Util/Contexts/TipoCambioContext";
import {obtenerSucursales} from "../Util/Contexts/SucursalContext";
import {obtenerTipoCobro} from "../Util/Contexts/TipoCobroContext";
import {obtenerFormatosImpresion, imprimirFormatosId} from "../Util/Contexts/FormatosImpresionContext";
import {obtenerCliente, obtenerClienteId} from "../Util/Contexts/ClientesContext";
import {forEach} from "react-bootstrap/ElementChildren";
import {obtenerZonasById} from "../Util/Contexts/ZonasContext";
import {obtenerProductoById} from "../Util/Contexts/ProductosContext";
import AddBoxIcon from "@material-ui/icons/AddBox";
import DeleteIcon from "@material-ui/icons/Delete";
import ConfirmarUbicacion from "../Components/Map/ConfirmarUbicacion";
import Paquetes from "./Paquetes/Paquetes";
import {obtenerMunicipiosByIdEstado} from "../Util/Contexts/MunicipiosContext";
import {obtenerAllEstados, obtenerEstadosPais} from "../Util/Contexts/EstadosContext";
import {obtenerByIdZonaOperativa, obtenerZonaOperativaByIdCodigoPostal} from "../Util/Contexts/ZonaOperativaContext";
import {obtenerByIdZonaTarifa, obtenerZonaTarifaByIdCodigoPostal} from "../Util/Contexts/ZonaTarifaContext";
import {obtenerFechaInicio, obtenerFechaFinal} from "../Util/Contexts/UtileriasContext";
import DialogTableClientes from "./Clientes/DialogTableClientes";
import RemitentesDestinatarios from "./RemitentesDestinatarios";
import ComplementosSAT from "./SAT/ComplementosSAT";
import {obtenerInformeReporte} from "../Util/Contexts/InformesContext";
import Filtros from "./Filtros/Filtros";
import Citas from "./Citas/Citas";
import Cotizador from "./ConceptosFacturacion/Cotizador";

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
        height: "280px !important",
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
    const [dataFechaFinal, setDataFechaFinal] = React.useState([]);
    const [dataFechaInicial, setDataFechaInicial] = React.useState([]);
    const [dataComplementosSAT, setDataComplementosSAT] = React.useState([])
    const [dataTipoCobro, setDataTipoCobro] = React.useState([]);
    const [dataCiudad, setDataCiudad] = React.useState([]);
    const [dataCiudadF, setDataCiudadF] = React.useState([]);
    const [dataConceptos, setDataConceptos] = useState([])
    const [dataZona, setDataZona] = React.useState([]);
    const [dataFolioRecoleccion, SetDataFolioRecoleccion] = React.useState([]);

    const [dataCodigosPostalesRemitente, setDataCodigosPostalesRemitente] = React.useState([]);
    const [dataCodigosPostalesDestinatario, setDataCodigosPostalesDestinatario] = React.useState([]);
    const [dataCodigosPostalesRecoleccionDD, setDataCodigosPostalesRecoleccionDD] = React.useState([]);
    const [dataCodigosPostalesEntregaDD, setDataCodigosPostalesEntregaDD] = React.useState([]);

    const [dataClientes, setDataClientes] = useState([])
    const [dataRemitenteDestinatario, setDataRemitenteDestinatario] = React.useState([]);
    const [dataEmbalaje, setDataEmbalaje] = React.useState([]);
    const [dataOperador, setDataOperador] = React.useState([]);
    const [dataTipoUnidad, setDataTipoUnidad] = React.useState([]);
    const [dataUnidad, setDataUnidad] = React.useState([]);
    //error en zona operativa y zona tarifa
    const [errorZonas, setErrorZonas] = React.useState(false)
    const [controlErrores, setControlErrores] = useState({
        correo:false
    })
    const [repetirConceptos,setRepetirConceptos] = React.useState(false)
    //variables de valores por defecto
    const [configuraciones, setConfiguraciones] = React.useState({
        estatusRecoleccion: 0,
        estatusEmbarque: 0,
        monedaPredeterminadaEmbarque: 0,
        tipoCambioEmbarque: 0,
        estatusGuia: 0,
        tipoTarifa: 0,
        cobroCargaDescarga: false,
        cobrarCita: false,
        costoCita: "0",
        detectarTipoCobro: false,
        tipoCobro:0,
        limpiarProducto: false,
        idsTiposCobroSeleccionArray: [],
        idsTiposCobroSeleccionString: ''
    })
    const [state, setState] = React.useState({
        // ===VARIABLES DE LISTADO===
        idRecoleccion: 0,
        valorDeclarado: 0,
        idTipoSeguro:5,
        porcentajeSeguro: 0,
        // ===VARIABLES DE CANCELAR===
        // folioRecoleccion: '', Se usa en agregar tambien
        // folioRecoleccion:'', se usa en agregar tambien
        sucursalCancelacion: '',
        mostrarFechaCancelacion: '',
        usuario: localStorage.getItem("Usuario"),
        // estatusRecoleccion: '', Se usa en agregar tambien
        motivoCancelacion: '',
        mostrarCotizador:false,
        // ==VARIABLES DE LLEGADA/SALIDA===
        // sucursalCancelacion: '', Se usa en cancelar tambien
        // folioRecoleccion: '', Se usa en agregar tambien
        fechaHoraCreacion: today.getDate() + "/" + (today.getMonth() + 1) + "/" + today.getFullYear() + " " + today.getHours() + ":" + today.getMinutes(),
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
        fechaHoraRegistro:getCurrentDateTime(),
        estatusRecoleccion: '',
        moneda: '',
        tipoCambio: '',
        tipoCobro: '',
        clientePaga: {},
        observaciones: '', 

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

    });

    const [filtros, setFiltros] = useState({
        fechaInicial: 0,
        fechaFinal: 0,
        estatusListado: 0,
        sucursalListado: 0,
        folio: '',
        OrigenListado:0,
        DestinoListado:0,
    })
    const [sortModel, setSortModel] = React.useState([
        {
          field: 'm_sFechaHora',
          sort: 'asc',
        },
      ]);
    const resetFiltros = () => {
        setFiltros({
            fechaInicial: 0,
            fechaFinal: 0,
            estatusListado: 0,
            sucursalListado: 0,
            folio: '',
            OrigenListado:0,
        DestinoListado:0,
        })
    }
    const [fileUploaded, setFileUploaded] = React.useState([]);
    const [selectedFile, setSelectedFile] = useState();
    const [isFilePicked, setIsFilePicked] = useState(false);
    const [stepActive, setStepActive] = React.useState(1);
    // const [Modal, open, close, isOpen] = useModal("root", {
    //     preventScroll: true,
    // });
    const [dataTiposSeguro, setDataTiposSeguro] = useState([])
    const [dataPaquetes, setDataPaquetes] = useState([])
    const [dataEstados, setDataEstados] = useState([])
    const [dataMunicipiosRecoleccionDD, setDataMunicipiosRecoleccionDD] = useState([])
    const [dataMunicipiosEntregaDD, setDataMunicipiosEntregaDD] = useState([])
    const [dataZonasOperativasEntregaDD, setDataZonasOperativasEntregaDD] = useState([])
    const [dataZonasTarifaEntregaDD, setDataZonasTarifaEntregaDD] = useState([])
    const [dataZonasOperativasRecoleccionDD, setDataZonasOperativasRecoleccionDD] = useState([])
    const [dataZonasTarifaRecoleccionDD, setDataZonasTarifaRecoleccionDD] = useState([])
    const [dataRecoleccionConsulta, setDataRecoleccionConsulta] = useState();
    const [tabActiva, setTabActiva] = useState(0);
    const [isAgregar, setIsAgregar] = useState(false);
    const [isModificar, setIsModificar] = useState(false);
    const [pagina, setPagina] = useState(0);
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
      //  console.log(data.zonaOperativa)
    };

    const handleClickCodigosPostalesInput = (input) => {
        if (input === "codigoPostalRemitente"){
            obtenerCodigosPostalesPorEstadoMunicipio(remitente.estadoRemitente, remitente.municipioRemitente).then(({data}) => {
                setDataCodigosPostalesRemitente(data)
            })
        }
        if (input === "codigoPostalDestinatario"){
            obtenerCodigosPostalesPorEstadoMunicipio(destinatario.estadoDestinatario, destinatario.municipioDestinatario).then(({data}) => {
                setDataCodigosPostalesDestinatario(data)
            })
        }
        if (input === "codigoPostalEnt"){
            obtenerCodigosPostalesPorEstadoMunicipio(entregaDD.estadoEnt, entregaDD.municipioEnt).then(({data}) => {
                setDataCodigosPostalesEntregaDD(data)
            })
        }
        if (input === "codigoPostalRec"){
            obtenerCodigosPostalesPorEstadoMunicipio(recoleccionDD.estadoRec, recoleccionDD.municipioRec).then(({data}) => {
                setDataCodigosPostalesRecoleccionDD(data)
            })
        }
    }

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
        estadoEnt: '',
        municipioEnt: '',
        codigoPostalEnt: '',
        zonaOperativaEnt: '',
        zonaTarifaEnt: '',
        domicilioEnt: '',
        entregarEnEnt: '',
        datosAdicionalesEnt: ''
    })

    const resetEntregaDD = () => {
        setEntregaDD({
            estadoEnt: '',
            municipioEnt: '',
            codigoPostalEnt: '',
            zonaOperativaEnt: '',
            zonaTarifaEnt: '',
            domicilioEnt: '',
            entregarEnEnt: '',
            datosAdicionalesEnt: ''
        })
    }

    const handleChangeEntregaDD = (event) => {
        event.preventDefault();
        setEntregaDD(entregaDD => {
            return {
                ...entregaDD,
                [event.target.name]: event.target.value,
            }
        });
        if (event.target.name === "estadoEnt") {
            setRepetirConceptos(true)
            obtenerMunicipiosByIdEstado(event.target.value).then(({data}) => {
                setDataMunicipiosEntregaDD(data)
            })
        }
        if (event.target.name === "municipioEnt") {
            setRepetirConceptos(true)
        }
    };

    const handleChangeAutocompleteEntregaDD = (input, newValue) => {
        setEntregaDD(entregaDD => {
            return {
                ...entregaDD,
                [input]: newValue
            }
        })
        if (input === "codigoPostalEnt") {
            obtenerZonaOperativaByIdCodigoPostal(newValue.m_sCP).then(({data}) => {
                if (data.length > 0){
                    if (data.length === 1){
                        setEntregaDD(entregaDD => {
                            return {
                                ...entregaDD,
                                zonaOperativaEnt: data[0]
                            }
                        })
                    }
                    setDataZonasOperativasEntregaDD(data)
                }else{
                    setEntregaDD(entregaDD => {
                        return{
                            ...entregaDD,
                            zonaOperativaEnt: {}
                        }
                    })
                }
                
            })
        }
    }

    const [recoleccionDD, setRecoleccionDD] = useState({
        estadoRec: '',
        municipioRec: '',
        codigoPostalRec: '',
        zonaOperativaRec: '',
        zonaTarifaRec: '',
        domicilioRec: '',
        recogerEnRec: '',
        datosAdicionalesRec: '',
        latitudRec: '',
        longitudRec: ''
    })

    const resetRecoleccionDD = () => {
        setRecoleccionDD({
            estadoRec: '',
            municipioRec: '',
            codigoPostalRec: '',
            zonaOperativaRec: '',
            zonaTarifaRec: '',
            domicilioRec: '',
            recogerEnRec: '',
            datosAdicionalesRec: '',
            latitudRec: '',
            longitudRec: ''
        })
    }

    const handleChangeRecoleccionDD = (event) => {
       
        event.preventDefault();
        setRecoleccionDD(recoleccionDD => {
            return {
                ...recoleccionDD,
                [event.target.name]: event.target.value,
            }
        });
        if (event.target.name === "estadoRec") {
            setRepetirConceptos(true)
            obtenerMunicipiosByIdEstado(event.target.value).then(({data}) => {
                setDataMunicipiosRecoleccionDD(data)
            })
        }
        if (event.target.name === "municipioRec") {
            setRepetirConceptos(true)
        }
    };

    const handleChangeAutocompleteRecoleccionDD = (input, newValue) => {
        setRepetirConceptos(true)
        setRecoleccionDD(recoleccionDD => {
            return {
                ...recoleccionDD,
                [input]: newValue
            }
        })
        if (input === "codigoPostalRec") {
            obtenerZonaOperativaByIdCodigoPostal(newValue.m_sCP).then(({data}) => {
                if (data.length > 0){
                    if (data.length === 1){
                        setRecoleccionDD(recoleccionDD => {
                            return {
                                ...recoleccionDD,
                                zonaOperativaRec: data[0]
                            }
                        })
                    }
                    setDataZonasOperativasRecoleccionDD(data)

                }else{
                    setRecoleccionDD(recoleccionDD => {
                        return{
                            ...recoleccionDD,
                            zonaOperativaRec: {}
                        }
                    })
                }
               
            })
            /*obtenerZonaTarifaByIdCodigoPostal(newValue.m_sCP).then(({data}) => {
                if (data.length > 0){ 
                    setDataZonasTarifaRecoleccionDD(data)
                }else{
                    setRecoleccionDD(recoleccionDD => {
                        return{
                            ...recoleccionDD,
                            zonaTarifaRec: {}
                        }
                    })
                }
              
            })*/
        }
    }

    const getAllEstados = () => {
        obtenerAllEstados().then((respuesta) => {
            setDataEstados(respuesta.data);
        });
    }

    const history = useHistory()

    function CustomLoadingOverlay() {
        return (
            <GridOverlay>
                <div style={{position: 'absolute', top: 0, width: '100%'}}>
                    <LinearProgress/>
                </div>
            </GridOverlay>
        );
    }

    useEffect(value => {
        
        if (state.tipoUnidad != 0 && state.tipoUnidad != '') {
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

        
        // getDataParaListado()
      
    }, []);

    const getDataParaListado = () => {
        // getAllSucursales();
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
            if (operacion == "Agregar"){ 
                setState((config) => {
                    return {
                        ...config,
                        estatusRecoleccion: respuesta.data.EstatusRecoleccion,
                        moneda: respuesta.data.MonedaEmbarque,
                        tipoCambio: respuesta.data.TipoCambioEmbarque,
                        tipoCobro: respuesta.data.TipoCobro
                    }
                })
           
        
         }    setConfiguraciones((config) => {
                return {
                    ...config,
                    estatusRecoleccion: respuesta.data.EstatusRecoleccion,
                    estatusEmbarque: respuesta.data.EstatusEmbarque,
                    monedaPredeterminadaEmbarque: respuesta.data.MonedaEmbarque,
                    tipoCambioEmbarque: respuesta.data.TipoCambioEmbarque,
                    estatusGuia: respuesta.data.EstatusGuia,
                    tipoTarifa: respuesta.data.TipoTarifaTarifas,
                    cobroCargaDescarga: respuesta.data.CobroCargaDescargaTarifa,
                    cobrarCita: respuesta.data.esCobro,
                    costoCita: respuesta.data.CobroCitaTarifas || 0,
                    detectarTipoCobro: respuesta.data.DetectarTipoCobro,
                    limpiarProducto: respuesta.data.LimpiarProducto,
                    tipoCobro: respuesta.data.TipoCobro,
                    idsTiposCobroSeleccionString: respuesta.data.TiposCobroActivos,
                    idsTiposCobroSeleccionArray: respuesta.data.TiposCobroActivos ? respuesta.data.TiposCobroActivos.split(',') : [],
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
        return !(data.length === 0 || data == '0')
    }

    const validarCoordenadas = (coordenadas) => {
        console.log("coordenadas"+coordenadas)
        /**Si es modificacion*/
        if (state.idRecoleccion != 0){
            /**Si es recoleccion diferente domicilio y no hay coordenadas guardadas*/
            if(state.diferenteRecoleccion
                && coordenadas==undefined)
                {
                mostrarDialogoMapa(true)
                   
                return false
                /**Si es entrega en el domicilio del destinatario y no hay coordenadas guardadas*/
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
                debugger;
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

        /**REMITENTE*/
        if (!esDatoValido(remitente.idRemitente)){
            showSuccess("El remitente es un dato requerido");
            return valid;
        }
        /*if (!esDatoValido(remitente.codigoPostalRemitente?.m_nIdCP)){
            showSuccess("El código postal del remitente es un dato requerido");
            return valid;
        }*/
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
        /*if (!esDatoValido(destinatario.codigoPostalDestinatario?.m_nIdCP)){
            showSuccess("El código postal del destinatario es un dato requerido");
            return valid;
        }*/
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
            if (!esDatoValido(entregaDD.codigoPostalEnt?.m_nIdCP)){
                showSuccess("El código postal de entrega es un dato requerido");
                return valid;
            }
            if (!esDatoValido(entregaDD.estadoEnt)){
                showSuccess("El estado de entrega es un dato requerido");
                return valid;
            }
            if (!esDatoValido(entregaDD.zonaOperativaEnt?.m_nIdZona)){
                showSuccess("La zona operativa de entrega es un dato requerido");
                return valid;
            }
         /*  if (!esDatoValido(entregaDD.zonaTarifaEnt?.m_nIdZona)){
                showSuccess("La zona de la tarifa de entrega es un dato requerido");
                return valid;
            }*/ 

        }else {
            /**Si es entrega en domicilio de destinatario*/
            if (!esDatoValido(destinatario.zonaOperativaDestinatario?.m_nIdZona)) {
                showSuccess("Verificar la zona operativa de destinatario")
                return valid;
            }
          /*  else if (!esDatoValido(destinatario.zonaTarifaDestinatario?.m_nIdZona)) {
                showSuccess("Verificar la zona tarifa de destinatario")
                return valid;
            }*/
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
            showSuccess("Debe agregar al menos un paquete")
            return
        }

        if (dataConceptos.length === 0){
            showSuccess("No se han agregado conceptos de facturación")
            return;
        }
        valid = true
        return valid;
    }
    const handleAceptar = (e, coordenadas) => {
        e.preventDefault();
        if(repetirConceptos && state.mostrarCotizador){
            showSuccess("Se requiere calcular tarifa otra vez")
            return;
        }
        if (!esRecoleccionValido()){
            return;
        }
        let error = false
        let params = {}
        if(state.diferenteEntrega){
            /*if(entregaDD.zonaTarifaEnt?.m_nIdZona==undefined){
                error = true
                showSuccess("Verificar la zona operativa de diferente domicilio entrega")
            }else */
                if(entregaDD.zonaOperativaEnt?.m_nIdZona==undefined){
                error = true
                showSuccess("Verificar la zona operativa de diferente domicilio entrega")
            }else if(entregaDD.domicilioEnt==""){
                error = true
                showSuccess("Verificar el domicilio de entrega")
            }else if(entregaDD.entregarEnEnt==""){
                error = true
                showSuccess("Verificar la direccion a entregar en")
            }else if(entregaDD.datosAdicionalesEnt==""){
                error = true
                showSuccess("Verificar los datos adicionales para la entrega")
            }
        }else if(destinatario.zonaOperativaDestinatario?.m_nIdZona==undefined){
            error = true
            showSuccess("Verificar la zona operativa de destinatario")
         }
        /*else if(destinatario.zonaTarifaDestinatario?.m_nIdZona==undefined){
            error = true
            showSuccess("Verificar la zona tarifa de destinatario")
         }*/
          else if(destinatario.correoDestinatario == ""){
            error = true
            showSuccess("Error al agregar recoleccion: El correo del destinatario es un campo requerido")
        }

         if(state.diferenteRecoleccion){
            if(recoleccionDD.zonaOperativaRec?.m_nIdZona==undefined){
                error = true
                showSuccess("Verificar la zona operativa de diferente domicilio recoleccion")
            }else
               /* if(recoleccionDD.zonaTarifaRec?.m_nIdZona==undefined){
                error = true
                showSuccess("Verificar la zona tarifa de diferente domicilio recoleccion")
            }else*/
                if(recoleccionDD.domicilioRec==""){
                error = true
                showSuccess("Verificar el domicilio de recoleccion")
            }else if(recoleccionDD.recogerEnRec==""){
                error = true
                showSuccess("Verificar la direccion a recoger en")
            }else if(recoleccionDD.datosAdicionalesRec==""){
                error = true
                showSuccess("Verificar los datos adicionales para la recoleccion")
            }
        }else if(remitente.zonaOperativaRemitente?.m_nIdZona==undefined){
            error = true
            showSuccess("Verificar la zona operativa de remitente")
        } else
          /*  if(remitente.zonaTarifaRemitente?.m_nIdZona==undefined){
            error = true
            showSuccess("Verificar la zona tarifa de remitente")
        } else*/
            if(remitente.correoRemitente == "" ){
            error = true
            showSuccess("Error al agregar recoleccion: El correo del remitente es un campo requerido")
        }
        if(!error){
            console.log("entra y cierra")
        setState({
            ...state,
            showConfirmarUbicacion: false,
            showConfirmarUbicacionDestinatario:false
        })
        if (!validarCoordenadas(coordenadas)){
            return
        }
        if (dataPaquetes.length === 0) {
            showSuccess("Debe agregar al menos 1 paquete o sobre.")
            return
        }
        dataPaquetes.forEach(item => {
            item.m_sClaveSATProducto = item.m_nClaveSATProducto
            item.m_sClaveSATUnidad = item.m_nClaveSATUnidad
        })
        dataComplementosSAT.forEach(item => {
            item.m_nCantidad = item.cantidad
            item.m_sClaveProductoServicio = item.claveProducto
            // item.m_sProductoServicio = item.ProductoSAT
            item.m_sClaveUnidad = item.claveUnidad
            // item.m_sUnidad = item.UnidadSAT
            item.m_sClaveFraccionArancelaria = item.claveFraccion
            // item.m_sFraccionArancelaria = item.fraccionSAT
            item.m_sUUIDComercioExterior = item.comercioExterior
            item.m_sClaveMaterialPeligroso = item.claveMaterialPeligroso
            item.m_sMaterialPeligroso = item.materialPeligrosoSAT
            item.m_bEsMaterialPeligroso = item.esPeligroso
            item.m_sClaveEmbalaje = item.claveEmbalaje
            // item.m_sTipoEmbalaje = item.embalajeSAT
            item.m_sDescripcionEmbalaje = item.descripcionEmbalajeSAT
            item.m_xPeso = item.peso
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
            params.ValorDeclarado = state.valorDeclarado
            params.m_sObservaciones = state.observaciones 
            params.m_nIdTipoSeguro = state.idTipoSeguro
            params.m_xPorcentajeSeguro = state.porcentajeSeguro
            params.m_bAplicaSeguro = state.aplicaSeguro
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
            // m_nIdZonaRemitente: remitente.zonaRemitente.m_nIdZona,
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
            // m_nIdZonaDestinatario: destinatario.zonaDestinatario.m_nIdZona,
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
            params.m_nIdCPDetalleRecoleccion = recoleccionDD.codigoPostalRec.m_nIdCP
            params.m_sDomicilioDetalleRecoleccion = recoleccionDD.domicilioRec
            params.m_sRecogerEnDetalleRecoleccion = recoleccionDD.recogerEnRec
            params.m_sDatosAdicionalesDetalleRecoleccion = recoleccionDD.datosAdicionalesRec
            params.m_nIdZonaOperativa = recoleccionDD.zonaOperativaRec.m_nIdZona
            params.m_nIdZonaTarifa = recoleccionDD.zonaTarifaRec? recoleccionDD.zonaTarifaRec.m_nIdZona : 0
            params.m_nIdEstadoRecoleccion = recoleccionDD.estadoRec
            params.m_sCodigoMunicipioRecoleccion = recoleccionDD.municipioRec
            params.m_sLatitudR = coordenadas ? coordenadas.lat : recoleccionDD.latitudRec
            params.m_sLongitudR = coordenadas ? coordenadas.lng : recoleccionDD.longitudRec
        } else {
            params.m_nIdZonaOperativa = remitente.zonaOperativaRemitente.m_nIdZona
            params.m_nIdZonaTarifa = remitente.zonaTarifaRemitente? remitente.zonaTarifaRemitente.m_nIdZona : 0
            params.m_sLatitudR = coordenadas ? coordenadas.lat : remitente.latitudR
            params.m_sLongitudR = coordenadas ? coordenadas.lng : remitente.longitudR
        } 
            params.m_bEntregaEnSucursal = state.entregaEnSucursal;
            params.m_nIdSucursalEntrega = state.idSucursalEntrega;

         if (state.diferenteEntrega) {
            params.m_nIdCPDetalleEntrega = entregaDD.codigoPostalEnt.m_nIdCP
            params.m_sDomicilioDetalleEntrega = entregaDD.domicilioEnt
            params.m_sEntregarEnDetalleEntrega = entregaDD.entregarEnEnt
            params.m_sDatosAdicionalesDetalleEntrega = entregaDD.datosAdicionalesEnt
            params.m_nIdZonaOperativaEntrega = entregaDD.zonaOperativaEnt.m_nIdZona
            params.m_nIdZonaTarifaEntrega = entregaDD.zonaTarifaEnt? entregaDD.zonaTarifaEnt.m_nIdZona : 0
            params.m_nIdEstadoEntrega = entregaDD.estadoEnt
            params.m_sCodigoMunicipioEntrega = entregaDD.municipioEnt
        } else {
            params.m_nIdZonaOperativaEntrega = destinatario.zonaOperativaDestinatario.m_nIdZona
            params.m_nIdZonaTarifaEntrega = destinatario.zonaTarifaDestinatario ? destinatario.zonaTarifaDestinatario.m_nIdZona : 0
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
    //    console.log(params)
        console.log(JSON.stringify(params))
        console.log(coordenadas)
     if (state.idRecoleccion != 0) {
            modificarRecoleccion(state.idRecoleccion, params)
                .then((respuesta) => {
                    showSuccess(respuesta.data);
                    handleShowListado();
                    limpiarInputsAgregar()
                })
                .catch((err) => {
                   // console.log(err);
                    showSuccess(err);
                });
        } else {
            console.log("ENTRO")
            confirmAlert({
                title: 'Confirmación',
                message: '¿Desea crear esta recolección?',
                buttons: [
                    {
                        label: 'Sí',
                        onClick: ()=>{
                            agregarRecoleccion(params)
                            .then((respuesta) => {
                             //   console.log(respuesta.data);
                             //    showSuccess(respuesta.data);
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
                             //   console.log(err);
                                showSuccess(err);
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

    //funcion para cancelar una recoleccion. Se usa en tab cancelar.
    const handleCancelar = (e) => {
        e.preventDefault();
        let params = {
            "motivoCancelacion": state.motivoCancelacion,
            "usuarioCancelacion": localStorage.getItem("UsuarioId"),
            "fechaCancelacion": state.fechaCancelacion
        }
        JSON.stringify(params)
        cancelarRecoleccion(state.idRecoleccion, params).then((respuesta) => {
            showSuccess(respuesta.data)
            handleShowListado();
        }).catch((err) => {

            showSuccess(err);
        });
    }

    const changeHandler = (event) => {
        event.preventDefault();
        setSelectedFile(event.target.files[0]);
        setIsFilePicked(true);
    };

    function handleSubmission() {
      //  console.log(selectedFile)
        var reader = new FileReader();
        reader.onload = function () {
         //   console.log(reader.result)
        }.bind(this);
        reader.readAsText(selectedFile);
        setState({
            ...setState,
            uploadedFileContent: "reader.result"
        })
    };

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
           // console.log("Recoleccion: ", respuesta.data);
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
                estadoRec: respuesta.data.m_nIdEstadoRecoleccion || 0,
                municipioRec: respuesta.data.m_sCodigoMunicipioRecoleccion || 0,
                domicilioRec: respuesta.data.m_sDomicilioDetalleRecoleccion,
                recogerEnRec: respuesta.data.m_sRecogerEnDetalleRecoleccion,
                datosAdicionalesRec: respuesta.data.m_sDatosAdicionalesDetalleRecoleccion,
                latitudRec: respuesta.data.m_sLatitud || '',
                longitudRec: respuesta.data.m_sLongitud || '',
                codigoPostalRec: {
                    m_nIdCP: respuesta.data.m_nIdCPDetalleRecoleccion,
                    m_sCP: respuesta.data.m_sCodigoPostalRecoleccion,
                    m_sColonia: respuesta.data.m_sColoniaRecoleccion ? respuesta.data.m_sColoniaRecoleccion : respuesta.data.m_sLocalidadRecoleccion
                },
            }
        })
        obtenerMunicipiosByIdEstado(respuesta.data.m_nIdEstadoRecoleccion).then(({data}) =>{
            setDataMunicipiosRecoleccionDD(data)
        })
        obtenerByIdZonaOperativa(respuesta.data.m_nIdZonaOperativa).then(({data}) => {
            setRecoleccionDD(recoleccionDD => {
                return {
                    ...recoleccionDD,
                    zonaOperativaRec: data
                }
            })
        })
    }

    const mostrarDatosEntregaDD = (respuesta) => {
        setEntregaDD(entregaDD =>{
            return {
                ...entregaDD,
                estadoEnt: respuesta.data.m_nIdEstadoEntrega || 0,
                municipioEnt: respuesta.data.m_sCodigoMunicipioEntrega || 0,
                domicilioEnt: respuesta.data.m_sDomicilioDetalleEntrega,
                entregarEnEnt: respuesta.data.m_sEntregarEnDetalleEntrega,
                datosAdicionalesEnt: respuesta.data.m_sDatosAdicionalesDetalleEntrega,
                codigoPostalEnt: {
                    m_nIdCP: respuesta.data.m_nIdCPDetalleEntrega,
                    m_sCP: respuesta.data.m_sCodigoPostalEntrega,
                    m_sColonia: respuesta.data.m_sColoniaEntrega ? respuesta.data.m_sColoniaEntrega : respuesta.data.m_sLocalidadEntrega
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
                    zonaOperativaEnt: data
                }
            })
        })
    }
    const setRecoleccionDataParaConsultaModificacion = (respuesta,operacion) => {
        console.log("DATA DE RECOLECCION CONSULTA Y MODIFICACION")
        console.log(respuesta)
        /**Este indicador se checa en el componente de RemitentesDestinatarios*/
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
            p.m_sTipo = p.m_nIdTipo == 1 ? 'Sobre' : 'Paquete'
        })
        setDataPaquetes(respuesta.data.m_parrPaquetes)
        respuesta.data.m_arrClsComplementoSAT.forEach(item => {
            item.id = item.m_nIdComplementoSAT
            item.cantidad = item.m_nCantidad
            item.claveProducto = item.m_sClaveProductoServicio
            item.ProductoSAT = item.m_sProductoServicio
            item.claveUnidad = item.m_sClaveUnidad
            item.UnidadSAT = item.m_sUnidad
            item.claveFraccion = item.m_sClaveFraccionArancelaria
            item.fraccionSAT = item.m_sFraccionArancelaria
            item.comercioExterior = item.m_sUUIDComercioExterior
            item.claveMaterialPeligroso = item.m_sClaveMaterialPeligroso
            item.materialPeligrosoSAT = item.m_sMaterialPeligroso
            item.esPeligroso = item.m_bEsMaterialPeligroso
            item.claveEmbalaje = item.m_sClaveEmbalaje
            item.embalajeSAT = item.m_sTipoEmbalaje
            item.descripcionEmbalajeSAT = item.m_sDescripcionEmbalaje
            item.peso = item.m_xPeso
        })
        setDataComplementosSAT(respuesta.data.m_arrClsComplementoSAT)
        if (respuesta.data.m_bRecoleccionDiferenteDomicilio){
            mostrarDatosRecoleccionDD(respuesta)
        }
        if (respuesta.data.m_bEntregaEnSucursal){
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
          //  console.log("Tiene seguro"+data.m_bTieneSeguro)
            setState(state => {
                return {
                    ...state,
                    clientePaga: data,
                  /*  idTipoSeguro: data.m_bTieneSeguro ? data.m_nIdTipoSeguro : 5,
                    porcentajeSeguro: data.m_bTieneSeguro ? data.m_cPorcentajeSeguro : 0,
                    aplicaSeguro: data.m_bTieneSeguro*/
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
        //console.log("SETEANDO COBRO" +respuesta.data.m_nIdTipoDeCobro)
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
                // fechaRecoleccion: respuesta.data.m_dFechaDetalleRecoleccion + "T" + respuesta.data.m_tHoraDetalleRecoleccion.slice(0, 5),
                diferenteEntrega: respuesta.data.m_bEntregaDiferenteDomicilio,
                entregaEnSucursal:respuesta.data.m_bEntregaSucursal,
                idSucursalEntrega:respuesta.data.m_nIdSucursalEntrega = 0 ? "" : respuesta.data.m_nIdSucursalEntrega
                

            }
        });
    
       // mostrarCotizadorRec(true)
    }
    useEffect(value => {
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

    function handleShowSalidaLlegada(type) {
        obtenerRecoleccionId(state.idRecoleccion).then((respuesta) => {
           // console.log(respuesta.data);
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
            setTabActiva(3)
        });
    }

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

    const handleShowListado = (event) => {
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
 
        let hours = today.getHours();
        let mostrarHora = today.getHours();
        let minutes = today.getMinutes();
        let ampm = hours >= 12 ? 'pm' : 'am';
        hours = hours % 12;
        hours = hours ? hours : 12; // the hour '0' should be '12'
        minutes = minutes < 10 ? '0' + minutes : minutes;
        let strTime = hours + ':' + minutes + ' ' + ampm;
        obtenerRecoleccionCancelada(state.idRecoleccion).then((respuesta) => { 
            
            const {
                m_sFolioRecoleccion,
                m_nIdSucursal,
                m_nIdEstatusRecoleccion,
                m_dtFechaCancelacion,
                m_sMotivoCancelacion,
                m_nIdInforme,
                m_nIdGuia,
                m_nIdEmbarque
            } = respuesta.data 
            if (respuesta.data.m_nSePuedeCancelar == 0 || m_nIdEmbarque > 0|| m_nIdInforme > 0 || m_nIdGuia > 0)
               {showSuccess("Recolección no se puede cancelar")
            }else{
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
         $('.nav-tabs li ').removeClass('active');
        $('.nav-tabs li').eq(3).addClass('active');
        $('.tab-content div ').removeClass('in show');
        $('#Cancelar').addClass('in show');} 
           
          
        })
    
      
        
   
    
    }

    const handlePatrocinadorSelected = (row) => {
        setState(() => ({
            ...state,
            clientePaga: row.data,
            idTipoSeguro: row.data.m_bTieneSeguro ? row.data.m_nIdTipoSeguro : 5,
            porcentajeSeguro: row.data.m_bTieneSeguro ? row.data.m_cPorcentajeSeguro : 0,
            aplicaSeguro: row.data.m_bTieneSeguro,
            tipoCobro: configuraciones.detectarTipoCobro ? row.data.m_bSinCredito ? "10" : "11" : state.tipoCobro,
            openDialog: false,
        }))
    }

    const handleClickResponsablePago = (event) => {
        event.preventDefault();
        if (dataClientes.length === 0) {
            getAllClientes()
        }
    }
    
  /*  const getCurrentDateTime = () => {
        return `${new Date().getFullYear()}-${`${new Date().getMonth() +
        1}`.padStart(2, 0)}-${`${new Date().getDate()}`.padStart(2, 0)}T${`${new Date().getHours()}`.padStart(2, 0)}:${`${new Date().getMinutes()}`.padStart(2, 0)}`
    }*/

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
                estatusRecoleccion: 1,
                moneda: 1,
                tipoCambio: 0,
                tipoCobro: '10',
                idTipoSeguro: 5,
                valorDeclarado: 0,
                observaciones: '',
                porcentajeSeguro: 0,
                clientePaga: {m_nNumeroCliente: 'No. Cliente', m_sNombreFiscal: 'Nombre fiscal'},
                showConfirmarUbicacion:false,
                //Remitente
                /*nombreRemitente: {m_sNombre: "Nombre", m_sAlias: "Alias"},
                RFCRemitente: '',
                domicilioRemitente: '',
                ciudadRemitente: '',
                codigoPostalRemitente: '',
                correoRemitente: '',
                telefonoRemitente: '',
                contactoRemitente: '',
                origenRemitente: '',
                zonaRemitente: {},
                idRemitente: '',
                aliasRemitente: '',
                calleRemitente: '',
                numeroIntRemitente: '0',
                numeroExtRemitente: '',
                coloniaRemitente: '',*/

                //Destinatario
                /*nombreDestinatario: {m_sNombre: "Nombre", m_sAlias: "Alias"},
                RFCDestinatario: '',
                domicilioDestinatario: '',
                ciudadDestinatario: '',
                codigoPostalDestinatario: '',
                correoDestinatario: '',
                telefonoDestinatario: '',
                contactoDestinatario: '',
                destinoDestinatario: '',
                zonaDestinatario: {},
                idDestinatario: '',
                aliasDestinatario: '',
                calleDestinatario: '',
                numeroIntDestinatario: '0',
                numeroExtDestinatario: '',
                coloniaDestinatario: '',*/

                //Paquetes/Sobres
                countPaquetes: 1,
                countSobres: 1,
                mismoPaquete: false,
                mismoSobre: false,
                paquetes: [
                    /*{
                        m_rPeso: "",
                        m_nId: 1,
                        m_rLargo: "",
                        m_rAncho: "",
                        m_rAlto: "",
                        m_rVolumen: "",
                        m_nIdTipoEmbalaje: "",
                        m_cyValorDeclarado: "",
                        m_sDescripcion: "",
                        m_nCantidad: "",
                        m_sObservaciones: "",
                    },*/
                ],
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
                /*ciudadEntrega: '',
                codigoPostalEntrega: '',
                zonaEntrega: '',
                domicilioEntrega: '',
                entregaEn: '',
                datosAdicionalesEntrega: '',*/

                //Recoleccion
                diferenteRecoleccion: false,
                /*fechaRecoleccion: '',
                ciudadRecoleccion: '',
                codigoPostalRecoleccion: '',
                zonaRecoleccion: '',
                domicilioRecoleccion: '',
                recogerEn: '',
                datosAdicionalesRecoleccion: '',*/

                //Operador
                operador: '',
                tipoUnidad: '',
                unidad: '',
                fechaHoraSalida: '',
                fechaHoraLlegada: '',
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
    const handleChangeFiltros = (event) => {
        event.preventDefault()
        const {target} = event
        setFiltros(filtros => {
            return {
                ...filtros,
                [target.name]: target.value
            }
        })
        if (target.name === "fechaInicial"){
            obtenerRecoleccionFiltro(target.value, filtros.fechaFinal,filtros.sucursalListado,filtros.estatusListado,filtros.folio,filtros.OrigenListado,filtros.DestinoListado).then(respuesta => {
                if (respuesta.data == "Vacio") {
                    setData([])
                } else {
                    setData(respuesta.data)
                }
            })
        }else if (target.name === "fechaFinal"){
            obtenerRecoleccionFiltro(filtros.fechaInicial, target.value,filtros.sucursalListado,filtros.estatusListado,filtros.folio,filtros.OrigenListado,filtros.DestinoListado).then(respuesta => {
                if (respuesta.data == "Vacio") {
                    setData([])
                } else {
                    setData(respuesta.data)
                }
            })
        }
        else if (target.name === "sucursalListado"){
            obtenerRecoleccionFiltro(filtros.fechaInicial, filtros.fechaFinal,target.value,filtros.estatusListado,filtros.folio,filtros.OrigenListado,filtros.DestinoListado).then(respuesta => {
                if (respuesta.data == "Vacio") {
                    setData([])
                } else {
                    setData(respuesta.data)
                }
            })
        }
        else if (target.name === "estatusListado"){
            obtenerRecoleccionFiltro(filtros.fechaInicial, filtros.fechaFinal,filtros.sucursalListado, target.value,filtros.folio,filtros.OrigenListado,filtros.DestinoListado).then(respuesta => {
                if (respuesta.data == "Vacio") {
                    setData([])
                } else {
                    setData(respuesta.data)
                }
            })
        }
        else if (target.name === "OrigenListado"){
            obtenerRecoleccionFiltro(filtros.fechaInicial, filtros.fechaFinal,filtros.sucursalListado, filtros.estatusListado,filtros.folio,target.value,filtros.DestinoListado).then(respuesta => {
                if (respuesta.data == "Vacio") {
                    setData([])
                } else {
                    setData(respuesta.data)
                }
            })
        }
        else if (target.name === "DestinoListado"){
            obtenerRecoleccionFiltro(filtros.fechaInicial, filtros.fechaFinal,filtros.sucursalListado, filtros.estatusListado,filtros.folio,filtros.OrigenListado,target.value).then(respuesta => {
                if (respuesta.data == "Vacio") {
                    setData([])
                } else {
                    setData(respuesta.data)
                }
            })
        }
    }
    const handleChange = (event) => {
        event.preventDefault();
        if(event.target.id == "porcentajeSeguro"){
            setRepetirConceptos(true)
        }
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
    const handleChangeSucursalEntrega = (event) => {
        setState(state => {
            return {
                ...state,
                [event.target.name]: event.target.value
            }
        });
        getZonaOperativaByCodigoPostal(dataSucursal.find(c => c.m_nIdSucursal == event.target.value).m_sCodigoPostal)
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
        // event.preventDefault();
        setState({
            ...state,
            diferenteRecoleccion: !state.diferenteRecoleccion,
        });
    };

    const handleCitaCheckboxChange = (event) => {
        // event.preventDefault();
        setRepetirConceptos(true)
        setState({
            ...state,
            recoleccionConCita: !state.recoleccionConCita,
        });
    };

    //setea si la entrega es en diferente direccion a la del destinatario
    const handleEntregaCheckboxChange = (event) => {
        // event.preventDefault();
        console.log("ENTRA CHECKBOX")
        setRepetirConceptos(true)
        setState({
            ...state,
            diferenteEntrega: !state.diferenteEntrega,
            entregaEnSucursal: !state.entregaEnSucursal && false
        });
    };
    const handleEntregaEnSucursalCheckbox = (event) => {
        setRepetirConceptos(true)
        setState({
          ...state,
          entregaEnSucursal: !state.entregaEnSucursal,
          diferenteEntrega: !state.entregaEnSucursal && false,
          entregaConCita: !state.entregaEnSucursal && false,
        });
      };
    const handleListComplementosSATChange = (newList) => {
        setDataComplementosSAT(newList)
    }
    //Maneja filtrado de listado embarque
    const handleFolioRecoleccionFiltro = async (event) => {
        if (event.keyCode == 13) {
            const {target} = event
            let value = target.value
            if (event.target.value == '') {
                value = 0
            }
            setFiltros(filtros => {
                return {
                    ...filtros,
                    [target.name]: target.value
                }
            })
            /*setState({
                ...state,
                folioRecoleccion: event.target.value,
            })*/
            const {fechaInicial, fechaFinal, sucursalListado, estatusListado} = filtros
            obtenerRecoleccionFiltro(fechaInicial, fechaFinal, sucursalListado, estatusListado, value).then(respuesta => {
                if (respuesta.data == "Vacio") {
                    setData([])
                } else {
                    setData(respuesta.data)
                }
            })
        }
    }

    const columns = React.useMemo(() => [
        {
            headerName: "Acciones",
            field: "",
            width: 120,
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
                            <a className="btn btn-default btn-xs"
                               onClick={() => (handleShowConsultar(row.row.m_nIdRecoleccion))}><i className="fa fa-eye"
                                                                                                  style={{color: "#F9A03E"}}/></a>
                        </Tooltip>
                        <Tooltip title="Reporte" disabled={!validarDerecho(9101418)}>
                            <a  className="btn btn-default btn-xs"
                                onClick={() => generarReporte(row.row.m_nIdRecoleccion, row.row.m_sFolioRecoleccion)}><i className="zmdi zmdi-file"
                                                                                                                 style={{color: "#F9A03E"}}/></a>

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
            headerName: "Folio Embarque",
            field: "m_sFolioEmbarque",
            width: 150,
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
        /*{
            headerName: "Operador",
            field: "m_sOperador",
            width: 250,
        },
        {
            headerName: "Unidad",
            field: "m_sUnidad",
            width: 125,
        }*/
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
    function generarReporte(id, folio){
        obtenerRecoleccionReporte(id).then(({data}) => {
            let pdfWindow = window.open("");
            pdfWindow.document.write("<embed  width='100%' height='100%' src='data:application/pdf;base64, " + encodeURI(data)+"'/>");
            pdfWindow.document.body.style.margin = "0px";
            pdfWindow.document.title = "Recolección " + folio;
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
                    console.log(respuesta.data)
                })
            })

        })
    }

    function confirmarUbicacion(coordenadas, e) {
        handleAceptar(e, coordenadas)
    }

    const getAllClientes = () => {
        obtenerCliente().then((respuesta) => {
            setDataClientes(respuesta.data)
          //  console.log(respuesta.data)
        })
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

    function getAllCiudadesFiltro() {
        obtenerCiudades().then((respuesta) => {
            setDataCiudadF(respuesta.data);
        });
    }

    function getAllZonas() {
        const url = `${process.env.REACT_APP_API_URL}/Zonas/GetListado`;
        axios.get(url, {headers}).then((respuesta) => {
            setDataZona(respuesta.data);
        });
    }

    async function getAllTiposSeguro() {
        axios.get(`${process.env.REACT_APP_REPORT_URL}/api/TipoSeguros/GetListado`, {headers}).then(({data}) => {
            setDataTiposSeguro(data)
        })
    }

    function getUltimoFolioRecoleccion() {
        const url = `${process.env.REACT_APP_API_URL}/Recoleccion/GetUltimoFolio`;
        axios.get(url, {headers}).then((respuesta) => {
            SetDataFolioRecoleccion(respuesta.data);
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
            if (respuesta.data == "Vacio") {
                setDataTipoUnidad([])
            } else {
                setDataTipoUnidad(respuesta.data)
            }
          //  console.log("tipos unidades listado: ", respuesta.data)
            // getAllUnidades(1);
        });
    }

    function getAllUnidades(id) {

        obtenerUnidadesTipo(id).then((respuesta) => {
           // console.log('unidades listado: ', respuesta);
            setDataUnidad(respuesta.data);
        });
    }

    const seCalculaTarifa = () =>{
        setRepetirConceptos(true)
    }

    const handleUpload = (e) => {
        e.preventDefault();

        var files = e.target.files,
            f = files[0];
        var reader = new FileReader();
       // console.log(e.target.files);
        reader.onload = function (e) {
          //  console.log("Nothing Happened");
            var data = e.target.result;
            let readedData = XLSX.read(data, {type: "binary"});
            const wsname = readedData.SheetNames[0];
            const ws = readedData.Sheets[wsname];

            /* Convert array to json*/
            const dataParse = XLSX.utils.sheet_to_json(ws, {header: 1});
          //  console.log("dataParse : " + dataParse);
            setFileUploaded(dataParse);
        };
        reader.readAsBinaryString(f);
    };

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
                            {headerGroup.headers.map((column) => (
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

    const handleFechaCita = (event) => {
        setState({
            ...state,
            fechaCita: event.target.value,
        })
    }

    const handleHoraCitaMinima = (event) => {
        setState({
            ...state,
            horaCitaMinima: event.target.value,
        })
    }

    const handleHoraCitaMaxima = (event) => {
        setState({
            ...state,
            horaCitaMaxima: event.target.value,
        })
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
        console.log("ENTRA PAQUETES")
        setRepetirConceptos(true)
        setDataPaquetes(newList)
    }

    const filtrarTipoCobro = (tipoCobro) => {
        // if (!state.clientePaga) {
        if (localStorage.getItem("RFC") === "ADI880815DA7") {
            return tipoCobro.m_nIdTipoCobro === 10 || tipoCobro.m_nIdTipoCobro === 11
        }else {
            return true
        }
        // }else {
        //     return (state.clientePaga.m_bSinCredito && tipoCobro.m_nIdTipoCobro === 10) || ( !state.clientePaga.m_bSinCredito && tipoCobro.m_nIdTipoCobro === 11)
        //
        // }
    }
    const dialogVisible = (isVisible) => {
        setState({
          ...state,
          openDialog: isVisible,
        });
      };

    const setDataListado = (listado) => {
        setPagina(0)
        setData(listado)
    }

    const handleChangeCita = (data) => {
        console.log(data)
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
        setState({
            ...state,
            idTipoSeguro: event.target.value,
            porcentajeSeguro: dataTiposSeguro.find(item => item.m_nIdTipoSeguro === event.target.value).m_xPorcentaje,
            aplicaSeguro: (event.target.value === 3) || (event.target.value === 4),
            valorDeclarado: 0
        });
    }

    return (
        <div>
            {/*Dialogo para cuando se elija una entrega en diferente domicilio en remitente*/}
               {state.showConfirmarUbicacion &&
                <ConfirmarUbicacion confirmarUbicacion={confirmarUbicacion} open={state.showConfirmarUbicacion}
                                    dataMunicipiosRecoleccionDD={dataMunicipiosRecoleccionDD}
                                    mostrarDialogoMapa={mostrarDialogoMapa}
                                    titulo={state.titulo}
                                    recoleccion={true}
                                    remitente={true}
                                    direccion={remitente}
                                    esDiferenteRecoleccion={state.diferenteRecoleccion}
                                    esDiferenteEntrega={state.diferenteEntrega}
                                    recoleccionDD={recoleccionDD}
                                    >
                </ConfirmarUbicacion>
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
                                                                                        data={dataCodigosPostalesRemitente.filter((cp) => cp.m_nIdCiudad == state.ciudadRemitente)}
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
                                                                                           data={dataCodigosPostalesDestinatario.filter((cp) => cp.m_nIdCiudad == state.ciudadDestinatario)}
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
                                                                                            data={dataCodigosPostalesRecoleccionDD.filter((cp) => cp.m_nIdCiudad == state.ciudadRecoleccion)}
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
                                                                                        data={dataCodigosPostalesEntregaDD.filter((cp) => cp.m_nIdCiudad == state.ciudadEntrega)}
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
                    {state.tipoModal === 6 &&
                    <div className="row" style={{backgroundColor: '#FFFFFF'}}>
                        <DialogTitle style={{padding: "0px"}}><h4>Selecciona el Formato</h4></DialogTitle>
                        <div>
                            <label className="input select" style={{width: "100%"}}>
                                <FormControl fullWidth variant="outlined" margin="dense">
                                    <InputLabel id="sucursalListadoLabel">Formato</InputLabel>
                                    <Select
                                        labelId="sucursalListadoLabel"
                                        label="Formato"
                                        className="form-control"
                                        required
                                        value={state.formatoSeleccionado}
                                        onChange={(event) => setState({
                                            ...state,
                                            formatoSeleccionado: event.target.value
                                        })}
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

                        <DialogActions style={{justifyContent: "left"}}>

                            <button onClick={() => handleImprimir()} className="btn btn-primary primary-btn">Aceptar
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
                            <a className={validarDerecho(9101414)?"":classes.disabled} data-toggle="tab" onClick={handleShowAgregar}>
                                <i className="fa fa-plus-circle"/> {state.agregar}
                            </a>
                        </li>

                        <li className="hide">
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
                                <i className="fa fa-print"/> Imprimir
                            </a>
                        </li>

                        <li>
                            <a className={(state.idRecoleccion === 0 || !validarDerecho(9101420)) ? classes.disabled : ""} onClick={handleShowCancelar}>
                                <i className="zmdi zmdi-print"/> Cancelar
                            </a>
                        </li>

                        <li className="hide">
                            <a onClick={() => handleShowSalidaLlegada(4)}
                               className={state.idRecoleccion === 0 ? classes.disabled : ""}>
                                <i className="fa fa-times-circle"/> Salida
                            </a>
                        </li>

                        <li className="hide">
                            <a onClick={() => handleShowSalidaLlegada(5)}
                               className={state.idRecoleccion === 0 ? classes.disabled : ""}>
                                <i className="fa fa-times-circle"/> Llegada
                            </a>
                        </li>

                        <li style={{float: "right"}}>
                            <a data-toggle="tab" href="#" className={(state.idRecoleccion === 0 || !validarDerecho(9101417)) ? classes.disabled : ""}
                               style={{textAlign: "right"}} onClick={() => setRedirect(true)}>
                                Generar embarque
                            </a>
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
                                                recoleccion={true}
                                            />
                                        </div>
                                    </div>
                                </div>

                                <div className="row" style={{height: state.height - 250, width: '100%'}}>
                                    <DataGrid
                                        localeText={dataGridLocaleText}
                                        className={classes.root}
                                        components={{
                                            LoadingOverlay: CustomLoadingOverlay,
                                        }}
                                        onSortModelChange={(model) => setSortModel(model)}
                                        rows={data}
                                        pagination
                                        page={pagina}
                                        onPageChange={(newPage) => {
                                            setPagina(newPage.page)
                                        }}
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
                            <form className="j-forms" onSubmit={handleAceptar} onKeyDown={e => {if(e.code === 13) {e.preventDefault()}}}>
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
                                                        <Step key={s} completed={false}
                                                              onClick={() => openSection(index + 1)}>
                                                            <StepLabel>{s}</StepLabel>
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
                                                                <TextField variant="outlined" margin="dense"
                                                                           onChange={handleChange}
                                                                           className="form-control"
                                                                           type="text"
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
                                                                <TextField variant="outlined" margin="dense"
                                                                           onChange={handleChange}
                                                                           className="form-control"
                                                                           type="text"
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
                                                                <TextField variant="outlined" margin="dense"
                                                                           onChange={handleChange}
                                                                           className="form-control"
                                                                           type="text"
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
                                                                <TextField variant="outlined" margin="dense"
                                                                           onChange={handleChange}
                                                                           className="form-control"
                                                                           type="text"
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
                                                                           disabled

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
                                                                        disabled={state.agregar === "Consultar" || state.recoleccionConEmbarque}
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
                                                                        disabled={state.agregar === "Consultar" || state.recoleccionConEmbarque}
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
                                                                <i className="fa fa-arrow-down"/>
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
                                                                        disabled={state.agregar === "Consultar" || state.recoleccionConEmbarque}
                                                                        id="tipoCambio"
                                                                    >
                                                                        <option value="0">Seleccionar</option>
                                                                        {dataTipoCambio.map((cambio) => (
                                                                            <option
                                                                                key={cambio.m_nIdTipoCambio}
                                                                                value={cambio.m_nIdTipoCambio}
                                                                            >
                                                                                {cambio.m_cTipoCambio.toFixed(4)}
                                                                            </option>
                                                                        ))}
                                                                    </Select>
                                                                </FormControl>
                                                                <i className="fa fa-arrow-down"/>
                                                            </label>
                                                        </div>
                                                        <div className="col-sm-6 col-md-2-5 col-lg-2-5 unit">
                                                            <label className="input select">
                                                                <FormControl fullWidth variant="outlined" required
                                                                             margin="dense">
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
                                                                        {dataTipoCobro.filter(item => configuraciones.idsTiposCobroSeleccionArray.find(i => i == item.m_nCodigo)).map((tipoCobro) => (
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
                                                        <Grid container spacing={2} style={{marginBottom:'10px'}}>
                                                            <Grid item xs>
                                                                <div className="input">                       
                                                                            <TextField
                                                                                variant="outlined"
                                                                                label="Responsable de pago"
                                                                                margin="dense"
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
                                                                        /*onChange={(event) => {
                                                                            event.preventDefault();
                                                                            setState({
                                                                                ...state,
                                                                                idTipoSeguro: event.target.value,
                                                                                porcentajeSeguro: dataTiposSeguro.find(item => item.m_nIdTipoSeguro === event.target.value).m_xPorcentaje,
                                                                                aplicaSeguro: (event.target.value === 3) || (event.target.value === 4)
                                                                            });
                                                                        }}*/
                                                                        onChange={handleChangeTipoSeguro}
                                                                        variant="outlined"
                                                                        disabled={state.agregar === "Consultar" || state.recoleccionConEmbarque}
                                                                    >
                                                                        {dataTiposSeguro.map((option) => (
                                                                            <option key={option.m_nIdTipoSeguro} value={option.m_nIdTipoSeguro}>
                                                                                {option.m_sDescripcion}
                                                                            </option>
                                                                        ))}
                                                                    </TextField>
                                                                </div>
                                                            </Grid>
                                                            <Grid item xs>
                                                                <div className="input">
                                                                    <TextField variant="outlined" margin="dense"
                                                                               className="form-control"
                                                                               type="number"
                                                                               required
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
                                                                    <TextField variant="outlined" margin="dense"
                                                                               className="form-control"
                                                                               type="number"
                                                                               required
                                                                               disabled={(state.agregar === "Consultar") || !state.aplicaSeguro || state.recoleccionConEmbarque}
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
                                                        <Grid container style={{marginBottom:'10px'}}>
                                                            <Grid item xs>
                                                                <div className="col-sm-12 col-md-12 col-lg-12 unit">
                                                                    <div className="input">                       
                                                                                    <TextField
                                                                                        variant="outlined"
                                                                                        margin="dense"
                                                                                        className="form-control"
                                                                                        type= "text"
                                                                                        label="Observaciones"
                                                                                        value={state.observaciones}
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
                                                                    </div>
                                                                </div>
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
                                            onChangeList={handleListPaquetesChange}
                                            disabled={state.agregar === "Consultar" || state.recoleccionConEmbarque}
                                            cliente={state.clientePaga}
                                        />
                                    </div>
                                    <div className="widget-wrap" id="complementosSat">
                                        <ComplementosSAT
                                            dataList={dataComplementosSAT}
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
                                                                        entregaDomicilioDestinatario={!state.entregaEnSucursal && !state.diferenteEntrega}
                                                                    />
                                                                }
                                                            <div className="row">
                                                            <div style={{width:'70%'}}>
                                                                <div className="col-sm-7 col-md-7 unit">
                                                                    <label className="checkbox">
                                                                        <input
                                                                            onChange={handleEntregaCheckboxChange}
                                                                            className="form-control"
                                                                            disabled={state.agregar === "Consultar" || state.recoleccionConEmbarque}
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
                                                                 <label className="checkbox">
                                                                      Entrega en Sucursal
                                                                         <input
                                                                             onChange={handleEntregaEnSucursalCheckbox}
                                                                               className="form-control"
                                                                               type="checkbox"
                                                                               checked={state.entregaEnSucursal}
                                                                               style={{ height: "20px" }}
                                                                               disabled={state.agregar === "Consultar" || state.recoleccionConEmbarque}
                                                                               id="entregaEnSucursal"
                                                                          />
                                                                           <i />
                                                                          </label>
                                                                      </div></div>
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
                                <div className="col-sm-12 col-md-12 col-lg-12 unit">
                                  <label className="input select">
                                    <FormControl
                                      fullWidth
                                      variant="outlined"
                                      margin="dense"
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
                                                            <div className="col-md-12">
                                                                <div className="col-sm-6 col-md-4  unit">
                                                                    <FormControl
                                                                        className="input select"
                                                                        fullWidth variant="outlined"
                                                                        margin="dense"
                                                                        required={state.diferenteRecoleccion}>
                                                                        <InputLabel
                                                                            id="idEstadoLabel">Estado</InputLabel>
                                                                        <Select
                                                                            fullWidth
                                                                            labelId="idEstadoLabel"
                                                                            label="Estado"
                                                                            className="form-control"
                                                                            value={recoleccionDD.estadoRec}
                                                                            onChange={handleChangeRecoleccionDD}
                                                                            id="estadoRec"
                                                                            name="estadoRec"
                                                                            disabled={state.agregar === "Consultar" || state.recoleccionConEmbarque}
                                                                        >
                                                                            {dataEstados.map((estado) => (
                                                                                <MenuItem
                                                                                    key={estado.m_nIdEstado}
                                                                                    value={estado.m_nIdEstado}
                                                                                >
                                                                                    {estado.m_sEstado}
                                                                                </MenuItem>
                                                                            ))}
                                                                        </Select>
                                                                    </FormControl>
                                                                </div>
                                                                <div className="col-sm-6 col-md-4  unit">
                                                                    <FormControl
                                                                        className="input select"
                                                                        fullWidth
                                                                        variant="outlined"
                                                                        margin="dense"
                                                                        required={state.diferenteRecoleccion}>
                                                                        <InputLabel
                                                                            id="idMunicipioLabel">Municipio</InputLabel>
                                                                        <Select
                                                                            fullWidth
                                                                            labelId={"idMunicipioLabel"}
                                                                            label={"Municipio"}
                                                                            className="form-control"
                                                                            value={recoleccionDD.municipioRec}
                                                                            onChange={handleChangeRecoleccionDD}
                                                                            // onSelect={handleClickCiudad}
                                                                            id="municipioRec"
                                                                            name="municipioRec"
                                                                            disabled={state.agregar === "Consultar" || state.recoleccionConEmbarque}
                                                                            InputProps={{name: "municipioRec"}}
                                                                        >
                                                                            {dataMunicipiosRecoleccionDD.map((municipio) => (
                                                                                <MenuItem
                                                                                    key={municipio.m_sCodigoMunicipio}
                                                                                    value={municipio.m_sCodigoMunicipio}
                                                                                >
                                                                                    {municipio.m_sMunicipio}
                                                                                </MenuItem>
                                                                            ))}
                                                                        </Select>
                                                                    </FormControl>
                                                                </div>
                                                                <div className="col-sm-6 col-md-4  unit">
                                                                    <div className="input">
                                                                        <Autocomplete
                                                                            freeSolo
                                                                            onChange={(event, newValue) => handleChangeAutocompleteRecoleccionDD("codigoPostalRec", newValue)}
                                                                            value={recoleccionDD.codigoPostalRec}
                                                                            disabled={state.agregar === "Consultar" || state.recoleccionConEmbarque}
                                                                            id="codigoPostalRec"
                                                                            name="codigoPostalRec"
                                                                            disableClearable
                                                                            forcePopupIcon={false}
                                                                            options={dataCodigosPostalesRecoleccionDD}
                                                                            getOptionLabel={(option) => (
                                                                                option ?
                                                                                    `${option.m_sCP} - ${option.m_sColonia ? option.m_sColonia : option.m_sLocalidad}`
                                                                                    : ''
                                                                            )}
                                                                            style={{
                                                                                transform: "translate(14px, 10px) scale(1) !important"
                                                                            }}
                                                                            renderInput={(params) => (
                                                                                <div>
                                                                                    <TextField
                                                                                        label="Código Postal"
                                                                                        margin="dense"
                                                                                        variant="outlined"
                                                                                        onClick={(e) => handleClickCodigosPostalesInput("codigoPostalRec")}
                                                                                        required={state.diferenteRecoleccion}
                                                                                        {...params}
                                                                                    />
                                                                                </div>
                                                                            )}
                                                                        />
                                                                    </div>
                                                                </div>

                                                                <div className="col-sm-6 col-md-6 unit">
                                                                    <div className="input">
                                                                        <Autocomplete
                                                                            value={recoleccionDD.zonaOperativaRec}
                                                                            freeSolo
                                                                            onChange={(event, newValue) => handleChangeAutocompleteRecoleccionDD("zonaOperativaRec", newValue)}
                                                                            id="zonaOperativaRec"
                                                                            disableClearable
                                                                            forcePopupIcon={false}
                                                                            options={dataZonasOperativasRecoleccionDD}
                                                                            disabled={state.agregar === "Consultar" || state.recoleccionConEmbarque}
                                                                            getOptionLabel={(option) => (
                                                                                option ?
                                                                                    option.m_sCodigoZona || 'Código Postal sin zona asignada'
                                                                                    : ''
                                                                            )}
                                                                            variant="outlined"
                                                                            name={"zonaOperativaRec"}
                                                                            style={{transform: "translate(14px, 10px) scale(1) !important"}}
                                                                            renderInput={(params) =>
                                                                                <TextField
                                                                                    variant="outlined"
                                                                                    label="Zona Operativa"
                                                                                    margin="dense"
                                                                                    required
                                                                                    // onClick={handleClickZona}
                                                                                    {...params}
                                                                                />
                                                                            }
                                                                        />
                                                                    </div>

                                                                </div>
                                                            { false && <div className="col-sm-6 col-md-6 unit">
                                                                    <div className="input">
                                                                        <Autocomplete
                                                                            value={recoleccionDD.zonaTarifaRec}
                                                                            freeSolo
                                                                            id="zonaTarifaRec"
                                                                            disableClearable
                                                                            forcePopupIcon={false}
                                                                            onChange={(event, newValue) => handleChangeAutocompleteRecoleccionDD("zonaTarifaRec", newValue)}
                                                                            disabled={state.agregar === "Consultar" || state.recoleccionConEmbarque}
                                                                            options={dataZonasTarifaRecoleccionDD}
                                                                            getOptionLabel={(option) => (
                                                                                option ?
                                                                                    option.m_sCodigoZona || 'Código Postal sin zona asignada'
                                                                                    : ''
                                                                            )}
                                                                            variant="outlined"
                                                                            name={"zonaTarifaRec"}
                                                                            style={{transform: "translate(14px, 10px) scale(1) !important"}}
                                                                            renderInput={(params) =>
                                                                                <TextField
                                                                                    variant="outlined"
                                                                                    label="Zona Tarifa"
                                                                                    margin="dense"
                                                                                    required
                                                                                    // onClick={handleClickZona}
                                                                                    {...params}
                                                                                />
                                                                            }
                                                                        />
                                                                    </div>
                                                                </div>
                                                                }

                                                                <div className="col-sm-6 col-md-4  unit">
                                                                    <div className="input">
                                                                        <TextField variant="outlined"
                                                                                   margin="dense"
                                                                                   onChange={handleChangeRecoleccionDD}
                                                                                   className="form-control"
                                                                                   type="text"
                                                                                   label="Calle y número"
                                                                                   value={recoleccionDD.domicilioRec}
                                                                                   disabled={state.agregar === "Consultar" || state.recoleccionConEmbarque}
                                                                                   id="domicilioRec"
                                                                                   name="domicilioRec"
                                                                                   required={state.diferenteRecoleccion}
                                                                        />
                                                                    </div>
                                                                </div>
                                                                <div className="col-sm-6 col-md-4  unit">
                                                                    <div className="input">
                                                                        <TextField variant="outlined"
                                                                                   margin="dense"
                                                                                   onChange={handleChangeRecoleccionDD}
                                                                                   className="form-control"
                                                                                   type="text"
                                                                                   label="Recoger En"
                                                                                   value={recoleccionDD.recogerEnRec}
                                                                                   disabled={state.agregar === "Consultar" || state.recoleccionConEmbarque}
                                                                                   id="recogerEnRec"
                                                                                   name="recogerEnRec"
                                                                                   required={state.diferenteRecoleccion}
                                                                        />
                                                                    </div>
                                                                </div>
                                                                <div className="col-sm-6 col-md-4  unit">
                                                                    <div className="input">
                                                                        <TextField variant="outlined"
                                                                                   margin="dense"
                                                                                   onChange={handleChangeRecoleccionDD}
                                                                                   className="form-control"
                                                                                   type="text"
                                                                                   label="Datos Adicionales para la Recolección"
                                                                                   value={recoleccionDD.datosAdicionalesRec}
                                                                                   disabled={state.agregar === "Consultar" || state.recoleccionConEmbarque}
                                                                                   id="datosAdicionalesRec"
                                                                                   name="datosAdicionalesRec"
                                                                                   required={state.diferenteRecoleccion}
                                                                        />
                                                                    </div>
                                                                </div>
                                                           
                                                            </div>
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
                                                    <h2>Detalles de la Entrega</h2>
                                                </div>
                                                <div className="widget-container">
                                                    <div className="widget-content">
                                                        <div className="row">
                                                            <div className="col-md-12">
                                                                <div className="col-sm-6 col-md-4  unit">
                                                                    <FormControl
                                                                        className="input select"
                                                                        fullWidth variant="outlined"
                                                                        margin="dense"
                                                                        required={state.diferenteEntrega}>
                                                                        <InputLabel
                                                                            id="idEstadoLabel">Estado</InputLabel>
                                                                        <Select
                                                                            fullWidth
                                                                            labelId="idEstadoLabel"
                                                                            label="Estado"
                                                                            className="form-control"
                                                                            value={entregaDD.estadoEnt}
                                                                            onChange={handleChangeEntregaDD}
                                                                            id="estadoEnt"
                                                                            name="estadoEnt"
                                                                            disabled={state.agregar === "Consultar" || state.recoleccionConEmbarque}
                                                                        >
                                                                            {dataEstados.map((estado) => (
                                                                                <MenuItem
                                                                                    key={estado.m_nIdEstado}
                                                                                    value={estado.m_nIdEstado}
                                                                                >
                                                                                    {estado.m_sEstado}
                                                                                </MenuItem>
                                                                            ))}
                                                                        </Select>
                                                                    </FormControl>
                                                                </div>
                                                                <div className="col-sm-6 col-md-4  unit">
                                                                    <FormControl
                                                                        className="input select"
                                                                        fullWidth
                                                                        variant="outlined"
                                                                        margin="dense"
                                                                        required={state.diferenteEntrega}>
                                                                        <InputLabel
                                                                            id="idMunicipioLabel">Municipio</InputLabel>
                                                                        <Select
                                                                            fullWidth
                                                                            labelId={"idMunicipioLabel"}
                                                                            label={"Municipio"}
                                                                            className="form-control"
                                                                            value={entregaDD.municipioEnt}
                                                                            onChange={handleChangeEntregaDD}
                                                                            // onSelect={handleClickCiudad}
                                                                            id="municipioEnt"
                                                                            name="municipioEnt"
                                                                            disabled={state.agregar === "Consultar" || state.recoleccionConEmbarque}
                                                                            inputProps={{name: "municipioEnt"}}
                                                                        >
                                                                            {dataMunicipiosEntregaDD.map((municipio) => (
                                                                                <MenuItem
                                                                                    key={municipio.m_sCodigoMunicipio}
                                                                                    value={municipio.m_sCodigoMunicipio}
                                                                                >
                                                                                    {municipio.m_sMunicipio}
                                                                                </MenuItem>
                                                                            ))}
                                                                        </Select>
                                                                    </FormControl>
                                                                </div>
                                                                <div className="col-sm-6 col-md-4  unit">
                                                                    <div className="input">
                                                                        <Autocomplete
                                                                            freeSolo
                                                                            onChange={(event, newValue) => handleChangeAutocompleteEntregaDD("codigoPostalEnt", newValue)}
                                                                            value={entregaDD.codigoPostalEnt}
                                                                            disabled={state.agregar === "Consultar" || state.recoleccionConEmbarque}
                                                                            id="codigoPostalEnt"
                                                                            name="codigoPostalEnt"
                                                                            disableClearable
                                                                            forcePopupIcon={false}
                                                                            options={dataCodigosPostalesEntregaDD}
                                                                            getOptionLabel={(option) => (
                                                                                option ?
                                                                                    `${option.m_sCP} - ${option.m_sColonia ? option.m_sColonia : option.m_sLocalidad}`
                                                                                    : ''
                                                                            )}
                                                                            style={{
                                                                                transform: "translate(14px, 10px) scale(1) !important"
                                                                            }}
                                                                            renderInput={(params) => (
                                                                                <div>
                                                                                    <TextField
                                                                                        label="Código Postal"
                                                                                        margin="dense"
                                                                                        variant="outlined"
                                                                                        onClick={(e) => handleClickCodigosPostalesInput("codigoPostalEnt")}
                                                                                        required={state.diferenteEntrega}
                                                                                        {...params}
                                                                                    />
                                                                                </div>
                                                                            )}
                                                                        />
                                                                    </div>
                                                                </div>

                                                                <div className="col-sm-6 col-md-6 unit">
                                                                    <div className="input">
                                                                        <Autocomplete
                                                                            value={entregaDD.zonaOperativaEnt}
                                                                            freeSolo
                                                                            onChange={(event, newValue) => handleChangeAutocompleteEntregaDD("zonaOperativaEnt", newValue)}
                                                                            id="zonaOperativaEnt"
                                                                            disableClearable
                                                                            forcePopupIcon={false}
                                                                            options={dataZonasOperativasEntregaDD}
                                                                            disabled={state.agregar === "Consultar" || state.recoleccionConEmbarque}
                                                                            getOptionLabel={(option) => (
                                                                                option ?
                                                                                    option.m_sCodigoZona || 'Código Postal sin zona asignada'
                                                                                    : ''
                                                                            )}
                                                                            variant="outlined"
                                                                            name={"zonaOperativaEnt"}
                                                                            style={{transform: "translate(14px, 10px) scale(1) !important"}}
                                                                            renderInput={(params) =>
                                                                                <TextField
                                                                                    variant="outlined"
                                                                                    label="Zona Operativa"
                                                                                    margin="dense"
                                                                                    required={state.diferenteEntrega}
                                                                                    // onClick={handleClickZona}
                                                                                    {...params}
                                                                                />
                                                                            }
                                                                        />
                                                                    </div>

                                                                </div>
                                                               { false && <div className="col-sm-6 col-md-6 unit">
                                                                    <div className="input">
                                                                        <Autocomplete
                                                                            value={entregaDD.zonaTarifaEnt}
                                                                            freeSolo
                                                                            id="zonaTarifaEnt"
                                                                            disableClearable
                                                                            onChange={(event, newValue) => handleChangeAutocompleteEntregaDD("zonaTarifaEnt", newValue)}
                                                                            forcePopupIcon={false}
                                                                            options={dataZonasTarifaEntregaDD}
                                                                            disabled={state.agregar === "Consultar" || state.recoleccionConEmbarque}
                                                                            getOptionLabel={(option) => (
                                                                                option ?
                                                                                    option.m_sCodigoZona || 'Código Postal sin zona asignada'
                                                                                    : ''
                                                                            )}
                                                                            variant="outlined"
                                                                            name={"zonaTarifaEnt"}
                                                                            style={{transform: "translate(14px, 10px) scale(1) !important"}}
                                                                            renderInput={(params) =>
                                                                                <TextField
                                                                                    variant="outlined"
                                                                                    label="Zona Tarifa"
                                                                                    margin="dense"
                                                                                    required={state.diferenteEntrega}
                                                                                    // onClick={handleClickZona}
                                                                                    {...params}
                                                                                />
                                                                            }
                                                                        />
                                                                    </div>
                                                                </div>
                                                                    }

                                                                <div className="col-sm-6 col-md-4  unit">

                                                                    <div className="input">
                                                                        <TextField variant="outlined"
                                                                                   margin="dense"
                                                                                   onChange={handleChangeEntregaDD}
                                                                                   className="form-control"
                                                                                   type="text"
                                                                                   label="Domicilio"
                                                                                   value={entregaDD.domicilioEnt}
                                                                                   disabled={state.agregar === "Consultar" || state.recoleccionConEmbarque}
                                                                                   id="domicilioEnt"
                                                                                   name="domicilioEnt"
                                                                                   required={state.diferenteEntrega}
                                                                        />
                                                                    </div>
                                                                </div>
                                                                <div className="col-sm-6 col-md-4  unit">
                                                                    <div className="input">
                                                                        <TextField variant="outlined"
                                                                                   margin="dense"
                                                                                   onChange={handleChangeEntregaDD}
                                                                                   className="form-control"
                                                                                   type="text"
                                                                                   label="Entregar En"
                                                                                   value={entregaDD.entregarEnEnt}
                                                                                   disabled={state.agregar === "Consultar" || state.recoleccionConEmbarque}
                                                                                   id="entregarEnEnt"
                                                                                   name="entregarEnEnt"
                                                                                   required={state.diferenteEntrega}
                                                                        />
                                                                    </div>
                                                                </div>
                                                                <div className="col-sm-6 col-md-4  unit">
                                                                    <div className="input">
                                                                        <TextField variant="outlined"
                                                                                   margin="dense"
                                                                                   onChange={handleChangeEntregaDD}
                                                                                   className="form-control"
                                                                                   type="text"
                                                                                   label="Datos Adicionales para la Entrega"
                                                                                   value={entregaDD.datosAdicionalesEnt}
                                                                                   disabled={state.agregar === "Consultar" || state.recoleccionConEmbarque}
                                                                                   id="datosAdicionalesEnt"
                                                                                   name="datosAdicionalesEnt"
                                                                                   required={state.diferenteEntrega}
                                                                        />
                                                                    </div>
                                                                </div>
                                                                                                               
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        }

                                        {/*<div className="widget-wrap" id="detallesRecoleccion">




                                            {state.diferenteRecoleccion || state.diferenteEntrega ? (
                                                <div >



                                                </div>
                                            ) : (
                                                <div></div>
                                            )}
                                        </div>*/}

                                        {/* <div className="widget-wrap" id="detallesOperacion">
                                            <div className="row">
                                                <div className="col-md-12">
                                                    <div className="widget-header">
                                                        <h2>Detalles de la Operación</h2>
                                                    </div>
                                                    <div className="widget-container">
                                                        <div className="widget-content">
                                                            <div className="row">
                                                                 --------------------------------------- Operador -------------------------------------------------
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
                                                                 --------------------------------------- TipoUnidad -------------------------------------------------
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
                                                                 --------------------------------------- Unidad -------------------------------------------------
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

                                        </div>*/}

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
                                            <div className="form-content" style={{display: "flex"}}>
                                                <input type="file" id="archivoFormato" onChange={changeHandler}/>
                                                <div>
                                                    <button onClick={handleSubmission} disabled={!isFilePicked}>Submit
                                                    </button>
                                                </div>
                                            </div>
                                            <article>
                                                <h2><a>Hello World</a></h2>
                                                <div
                                                    dangerouslySetInnerHTML={{__html: state.uploadedFileContent}}></div>
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
