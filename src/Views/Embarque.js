import React, {useEffect, useState, useMemo} from "react";
import axios from "axios";
import Cabecera from "../Components/Template/Cabecera";
import BarraLateralIzquierda from "../Components/Template/BarraLateralIzquierda";
import BarraLateralDerecha from "../Components/Template/BarraLateralDerecha";
import ExportCSV from "../Components/Template/Export";
import ExportPDF from "../Components/Template/ExportPDF";
import Carousel from "re-carousel";
import IndicatorDots from "../Util/Dots";
import Buttons from "../Util/CarruselButtons";
import { createTheme, ThemeProvider, StyledEngineProvider, styled, adaptV4Theme } from "@mui/material/styles";
import makeStyles from '@mui/styles/makeStyles';
import SearchIcon from "@mui/icons-material/Search";
import RestartAltIcon from '@mui/icons-material/Refresh';
import InputAdornment from "@mui/material/InputAdornment";
import {DEFAULT_FORMAT, getAddressFormated, getCurrentDateTime, readExcel, validarDerecho} from "../Util/Util"
import {
    ReactTable,
    useTable,
    useFilters,
    useAsyncDebounce,
    useSortBy,
    usePagination,
} from "react-table";
import $ from "jquery";
import {getUniqueListBy, remove_array_element} from "../Util/Util";
import IconButton from "@mui/material/IconButton";
import PageviewIcon from "@mui/icons-material/Pageview";
import Autocomplete from '@mui/material/Autocomplete';
import TextField from "@mui/material/TextField";
import useModal from "react-hooks-use-modal";
import {useHistory, Redirect} from "react-router-dom";
import {DataGrid} from "@mui/x-data-grid";
import SvgIcon from "@mui/material/SvgIcon";
import {ReactComponent as Activo} from "../iconos/Menu/palomita.svg";
import {ReactComponent as NoActivo} from "../iconos/Menu/cruz.svg";
import Noty, { button } from "noty";
import {
    Button,
    Chip,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle, FormControlLabel,
    Grid, MenuItem,
    Step,
    StepLabel,
    Stepper, Switch,
    Tooltip
} from "@mui/material";
import { ToggleButtonGroup } from '@mui/material';
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import Select from "@mui/material/Select";
import {API_HEADERS, dataGridLocaleText, TICKET_ZABRA_TAMPLATE} from "../Constants";
import {confirmAlert} from 'react-confirm-alert'; // Import
import 'react-confirm-alert/src/react-confirm-alert.css'; // Import css
import {obtenerCiudades, obtenerCiudadId} from "../Util/Contexts/CiudadesContext";
import {
    obtenerCodigoPostal,
    obtenerCodigoPostalId,
    obtenerCodigosPostalesPorCiudad, obtenerCodigosPostalesPorEstadoMunicipio
} from "../Util/Contexts/CodigoPostalContext";
import {
    actualizarRemitentesDestinatarios,
    obtenerRemitentesDestinatarios,
    obtenerRemitentesDestinatariosId
} from "../Util/Contexts/RemitenteDestinatarioContext";
import {obtenerEmbalajes, obtenerEmbalajesId} from "../Util/Contexts/EmbalajesContext";
import {
    cancelarEmbarque,
    eliminarEmbarques,
    obtenerEmbarquesId,
    obtenerUltimoFolioEmbarques,
    obtenerEmbarqueCancelado,
    agregarEmbarques,
    modificarEmbarques,
    obtenerEmbarquesFiltro,
    obtenerEmbarques, obtenerEmbarqueReporte
} from "../Util/Contexts/EmbarquesContext";
import {obtenerMonedas} from "../Util/Contexts/MonedaContext";
import {obtenerOperadores} from "../Util/Contexts/OperadoresContext";
import {obtenerTipoUnidades} from "../Util/Contexts/TipoUnidadContext";
import {obtenerUnidadesTipo} from "../Util/Contexts/UnidadesContext";
import {obtenerTipoCambio} from "../Util/Contexts/TipoCambioContext";
import {obtenerRecoleccionFiltro, obtenerRecoleccionId} from "../Util/Contexts/RecoleccionContext";
import {obtenerSucursales} from "../Util/Contexts/SucursalContext";
import {obtenerEstatusEmbarque} from "../Util/Contexts/EstatusContext";
import {obtenerTipoCobro} from "../Util/Contexts/TipoCobroContext";
import {validarPermisos} from "../Util/Contexts/UsuarioContext";
import {
    imprimirFormatosIdIdTipoReporte,
    obtenerFormatosImpresion,
    obtenerFormatosImpresionProceso
} from "../Util/Contexts/FormatosImpresionContext";
import {obtenerCliente, obtenerClienteId} from "../Util/Contexts/ClientesContext";
import {obtenerProductoById} from "../Util/Contexts/ProductosContext";
import {obtenerZonasById} from "../Util/Contexts/ZonasContext";
import AddBoxIcon from "@mui/icons-material/AddBox";
import DeleteIcon from "@mui/icons-material/Delete";
import ConfirmarUbicacion from "../Components/Map/ConfirmarUbicacion";
import {obtenerMunicipiosByIdEstado} from "../Util/Contexts/MunicipiosContext";
import {obtenerByIdZonaOperativa, obtenerZonaOperativaByIdCodigoPostal} from "../Util/Contexts/ZonaOperativaContext";
import {obtenerByIdZonaTarifa, obtenerZonaTarifaByIdCodigoPostal} from "../Util/Contexts/ZonaTarifaContext";
import {obtenerAllEstados, obtenerEstadosPais} from "../Util/Contexts/EstadosContext";
import Paquetes from "./Paquetes/Paquetes";
import {
    obtenerFechaInicio,
    obtenerFechaFinal,
    descargarPlantillaImportarEmbarque
} from "../Util/Contexts/UtileriasContext";
import ReplayIcon from "@mui/icons-material/Replay";
import ZonaOperativa from "./ZonasOperativas/ZonaOperativa";
import RemitentesDestinatarios from "./RemitentesDestinatarios";
import ComplementosSAT from "./SAT/ComplementosSAT";
import DialogTableClientes from "./Clientes/DialogTableClientes";
import Cotizador from "./ConceptosFacturacion/Cotizador";
import {obtenerInformeFiltro, obtenerInformeReporte} from "../Util/Contexts/InformesContext";
import Filtros from "./Filtros/Filtros";
import {agregarGuia, modificarGuia, obtenerGuiasFiltro} from "../Util/Contexts/GuiaContext";
import {obtenerViajesByFiltro} from "../Util/Contexts/ViajesContext";
import Citas from "./Citas/Citas";
import SeleccionarRuta from "./Rutas/SeleccionarRuta";
import {
    asignarTipoDocumento,
    obtenerParametrosConfiguracion,
    validarRequiereDocumentoTimbrado
} from "../Util/Contexts/ParametrosConfiguracionContext";
import {obtenerRutasId} from "../Util/Contexts/RutasContext";
import DiferenteDomicilioForm from "./DiferenteDomicilio/DiferenteDomicilioForm";


import {
    useLocation
} from "react-router-dom";
import {obtenerTiposDocumentoSucursal} from "../Util/Contexts/TipoDocumentosContext";
import ImportarEmbarques from "./Embarque/ImportarEmbarques";
import DialogTiposDocumentoSucursal from "./ParametrosConfiguracion/DialogTiposDocumentoSucursal";

const PREFIX = 'Embarque';

const classes = {
    paqueteCarrusel: `${PREFIX}-paqueteCarrusel`,
    sobreCarrusel: `${PREFIX}-sobreCarrusel`,
    seleccionado: `${PREFIX}-seleccionado`,
    noSeleccionado: `${PREFIX}-noSeleccionado`,
    disabled: `${PREFIX}-disabled`,
    root: `${PREFIX}-root`
};

const Root = styled('div')({
    [`& .${classes.paqueteCarrusel}`]: {
        height: "280px !important",
    },
    [`& .${classes.sobreCarrusel}`]: {
        height: "100px !important",
    },
    [`& .${classes.seleccionado}`]: {
        backgroundColor: "#FCC88F",
    },
    [`& .${classes.noSeleccionado}`]: {
        backgroundColor: "#FFFFFF",
    },
    [`& .${classes.disabled}`]: {
        pointerEvents: "none",
        cursor: "default",
    },

    [`& .${classes.root}`]: {
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
});

function useQuery() {
    const {search} = useLocation();

    return React.useMemo(() => new URLSearchParams(search), [search]);
}
function showSuccess(mensaje) {
    new Noty({
        type: "information",
        layout: "topCenter",
        text: mensaje,
        timeout: "8000",
    }).show();
}
function showError(mensaje) {
    new Noty({
        type: "error",
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
    childrenElement: () => <Root/>,
    customUI: ({onClose}) => <div>Custom UI</div>,
    closeOnEscape: true,
    closeOnClickOutside: true,
    willUnmount: () => {
    },
    afterClose: () => {
    },
    onClickOutside: () => {
    },
    onKeypressEscape: () => {
    },
    overlayClassName: "overlay-custom-class-name"
};

window.jQuery = window.$ = $;
const theme = createTheme(adaptV4Theme({
    overrides: {
        MuiSwitch: {
            switchBase: {
                // Controls default (unchecked) color for the thumb
                color: "#ccc",
                "&.Mui-checked": {
                    color: "#ccc",
                    "& + .MuiSwitch-track": {
                        opacity: 1,
                        backgroundColor: "#575757",
                    }
                },
                "&.Mui-disabled": {
                    color: "#8f8f8f",
                    "&.Mui-checked": {
                        color: "#ccc",
                        "& + .MuiSwitch-track": {
                            opacity: 1,
                            backgroundColor: "#bfbfbd",
                        }
                    },
                    "& + .MuiSwitch-track": {
                        opacity: 0.5,
                        backgroundColor: "#ccc",
                    }
                }
            },
            thumb: {
                boxShadow: "0 2px 4px 0 rgb(0 35 11 / 20%)",
                color: "#8f8f8f"
            },
            colorPrimary: {
                "&$checked": {
                    // Controls checked color for the thumb
                    color: "rgb(249, 160, 62)",
                    "&$disabled": {
                        // Controls checked color for the thumb
                        color: "rgb(249, 160, 62)"
                    }
                },
            },
            track: {
                // Controls default (unchecked) color for the track
                opacity: 0.2,
                backgroundColor: "#8f8f8f",
                "$checked$checked + &": {
                    // Controls checked color for the track
                    opacity: 0.7,
                    backgroundColor: "#F9A03E"
                }
            }
        }
    }
}));
const TIPOS_SEGURO = {
    CON_POLIZA: 1,
    NO_ASEGURA: 2,
    SEGUN_SOLICITA: 3,
    OBLIGATORIO: 4,
    SIN_ASIGNAR: 5
}
const FORMATOS_IMPRESION = {
    EMBARQUE: 211
}
function Embarque(props) {






    var today = new Date();

    const [redirect, setRedirect] = React.useState(false);
    const [detectarModificaciones,setDetectar]=React.useState(false)
    const [data, setData] = React.useState([]);
    const [dataSucursal, setDataSucursal] = React.useState([]);
    const [dataTipoDocumento, setDataTipoDocumento] = React.useState([]);
    const [dataEstatusEmbarque, setEstatusEmbarque] = React.useState([]);
    const [dataTipoMoneda, setDataTipoMoneda] = React.useState([]);
    const [dataTipoCobro, setDataTipoCobro] = React.useState([]);
    const [dataTipoCambio, setDataTipoCambio] = React.useState([]);
    const [dataCiudad, setDataCiudad] = React.useState([]);
    const [dataCodigosPostalesRemitente, setDataCodigosPostalesRemitente] = React.useState([]);
    const [dataCodigosPostalesDestinatario, setDataCodigosPostalesDestinatario] = React.useState([]);
    const [dataCodigosPostalesEntregaDD, setDataCodigosPostalesEntregaDD] = React.useState([]);
    const [dataEmbarqueConsulta, setDataEmbarqueConsulta] = useState();
    const [dataRemitenteDestinatario, setDataRemitenteDestinatario,] = React.useState([]);
    const [dataClientes, setDataClientes] = useState([])
    const [stepActive, setStepActive] = React.useState(1);
    // const [openDialog, setOpenDialog] = useState(false)
    // const [dataReportes, setDataReportes] = useState([])
    // const [seleccion, setSeleccion] = useState(null)
    const [Modal, open, close, isOpen] = useModal("root", {
        preventScroll: true,
    });
    const [tabActiva, setTabActiva] = useState(0);
    const [repetirConceptos, setRepetirConceptos] = React.useState(false)
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
    const columns = React.useMemo(() => [
        {
            headerName: "Acciones",
            sortable: false, filterable: false, width: 120,
            field: "",
            renderCell: (row) => {
                return (
                    <div>
                        <Tooltip title="Modificar" disabled={!validarDerecho(9101423)}>
                            <a
                                onClick={() => {
                                    $.ajax({
                                        url:handleShowModificar(row.row, row.row.m_nIdEmbarque)
                                        ,
                                        success:function(){
                                       // monitorearCambios();
                                     }
                                     })
                                }}
                                className="btn btn-default btn-xs"
                            >
                                <i
                                    className="fa fa-pencil-square-o"
                                    style={{color: "#F9A03E"}}
                                />
                            </a>
                        </Tooltip>
                        <Tooltip title="Consultar" disabled={!validarDerecho(9101426)}>
                            <a
                                className="btn btn-default btn-xs"
                                onClick={() => handleShowConsultar(row.row.m_nIdEmbarque)}
                            >
                                <i className="fa fa-eye" style={{color: "#F9A03E"}}/>
                            </a>
                        </Tooltip>
                        {/*<Tooltip title="Reporte opcion 1" disabled={!validarDerecho(9101425)}>*/}
                        {/*    <a className="btn btn-default btn-xs"*/}
                        {/*       onClick={() => generarReporteOpcion1(row.row)}><i*/}
                        {/*        className="zmdi zmdi-file"*/}
                        {/*        style={{color: "#F9A03E"}}/></a>*/}

                        {/*</Tooltip>*/}
                        <Tooltip title="Reporte" disabled={!validarDerecho(9101425)}>
                            <a className="btn btn-default btn-xs"
                               onClick={() => generarReporte(row.row)}><i
                                className="zmdi zmdi-file"
                                style={{color: "#F9A03E"}}/></a>

                        </Tooltip>
                        <Tooltip title="Eliminar" disabled={!validarDerecho(9101424)}>
                            <a
                                href="#"
                                className="btn btn-default btn-xs"
                                onClick={() => confirmAlert({
                                    title: 'Confirmar Eliminar',
                                    message: '¿Está seguro de eliminar Embarque?',
                                    buttons: [
                                        {
                                            label: 'Si',
                                            onClick: () => handleEliminar(row.row)
                                        },
                                        {
                                            label: 'No',
                                        }
                                    ]
                                })}
                            >
                                <i className="zmdi zmdi-delete" style={{color: "#F30B0B"}}/>
                            </a>
                        </Tooltip>
                        {/*<Tooltip title="Duplicar">
                            <a
                                className="btn btn-default btn-xs"
                                onClick={() => handleShowDuplicarConsultar(row.row.m_nIdEmbarque)}
                            >
                                <i className="fa fa-copy" style={{color: "#F9A03E"}}/>
                            </a>
                        </Tooltip>*/}

                    </div>
                );
            },
        },
        {
            headerName: "Fecha/Hora Elaboración",
            field: "m_sFechaHora",
            width: 200,
        },
        {
            headerName: "Folio Embarque",
            field: "m_sFolioEmbarque",
            width: 150,
            renderCell: (row) => {
                return (
                    <div>
                        <Tooltip title={row.row.m_sObservaciones}>
                            <field>{row.row.m_sFolioEmbarque}</field>
                        </Tooltip>
                    </div>

                );

            }
        },
        {
            headerName: "Estatus de la Orden",
            field: "m_sEstatusEmbarque",
            width: 200,
            renderCell: (row) => {
                return (
                    <div align={"center"} style={{width: "100%"}}>
                        <Chip size="small" style={{
                            backgroundColor: `${row.row.m_sColorEstatus}`,
                            //color: row.row.m_nIdEstatusUnidad === 1 ? "black" : "white",
                            padding: "1px"
                        }} label={row.row.m_sEstatusEmbarque}/>
                    </div>
                )
            }
        },
        {
            headerName: "Origen",
            field: "m_sCiudadOrigen",
            width: 200,
        },
        {
            headerName: "Destino",
            field: "m_sCiudadDestino",
            width: 200,
        },
        {
            headerName: "Cliente",
            field: "m_sNombreCliente",
            width: 300,
        },
        {
            headerName: "Sucursal",
            field: "m_sSucursal",
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
                                <SvgIcon component={Activo}/>
                            ) : (
                                <SvgIcon component={NoActivo}/>
                            ))
                        }
                    </div>
                );
            },
        },
        {
            headerName: "Referencia",
            field: "m_sReferencia",
            width: 150,
        },
        {
            headerName: "Folio Recolección",
            field: "m_sFolioRecoleccion",
            width: 150,
        },
        {
            headerName: "Folio Guía",
            field: "m_sFolioGuia",
            width: 150,
        },
        {
            headerName: "Folio Informe",
            field: "m_sFolioInforme",
            width: 150,
        },
        {
            headerName: "Usuario Documento",
            field: "m_sUsuarioDocumento",
            width: 200,
            renderCell: (row) => {
                <div>
                    {row.row.m_sUsuarioDocumento == "0" ? "N/A" : row.row.m_sUsuarioDocumento}
                </div>
            }
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
    const [dataPaquetes, setDataPaquetes] = useState([])
    const [dataComplementosSAT, setDataComplementosSAT] = useState([])
    const [dataTiposSeguro, setDataTiposSeguro] = useState([])
    const [dataEstados, setDataEstados] = useState([])
    const [dataMunicipiosEntregaDD, setDataMunicipiosEntregaDD] = useState([])

    const [dialogTipoDocumento, setDialogTipoDocumento] = useState({
        open: false,
        seleccion: {
            idSucursal: 0,
            sucursal: '',
            idTipoDocumento: 0,
            documento: 'SIN DEFINIR'
        }

    })
    const [seguroClienteActual,setDataSeguroClienteActual]=useState({
        idTipoSeguro: TIPOS_SEGURO.SIN_ASIGNAR,
        porcentajeSeguro: 0,
        aplicaSeguro: false,
    })
    const [dataConceptos, setDataConceptos] = useState([])
    //variables de valores por defecto
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
        tipoCobro: 0,
        limpiarProducto: false,
        idsTiposCobroSeleccionArray: [],
        idsTiposCobroSeleccionString: '',
        idConceptoFlete: 0,
        modificarValorEmbarque:false,
        factorConversion: 0.0,
        fijarCapturaValorDeclarado: false,
        porcentualSeguroDefecto:0
    })
    const [errores, setErrores] = React.useState([])
    const [state, setState] = React.useState({
        //==VARIABLES DE LISTADO==
        idEmbarque: 0,
        idCotizacion: 0,
        fechaInicial: 0,
        fechaFinal: 0,
        sucursalListado: 0,
        estatusListado: 0,
        //==VARIABLES DE CANCELAR==
        // folioEmbarque: '', se usa en agregar tambien
        sucursalCancelacion: '',
        fechaCancelacion: '',
        usuario: localStorage.getItem("Usuario"),
        // estatusEmbarque: '', se usa en agregar tambien
        motivoCancelacion: '',
        mostrarCotizador: false,
        //==VARIABLES DE AGREGAR
        //Informacion general
        idSucursalAgregar: localStorage.getItem("Sucursal"),
        folioRecoleccion: '',
        idRecoleccion: 0,
        folioEmbarque: '',
        folioGuia: '',
        folioInforme: '',
        fechaHoraRegistro: '',
        estatusEmbarque: '',
        moneda: '',
        tipoCambio: '',
        tipoCobro: '',
        clientePaga: {},
        observaciones: '',
        valorDeclarado: 0,
        idTipoSeguro: TIPOS_SEGURO.SIN_ASIGNAR,
        porcentajeSeguro: 0,
        aplicaSeguro: false,
        idTipoTarifa: '',
        referencia: '',

        //Entrega
        entregaEnSucursal: false,
        idSucursalEntrega: '',
        diferenteEntrega: false,
        zonaOperativaSucursal: null,

        //Cita de recoleccion
        entregaConCita: false,
        recoleccionConCita: false,
        fechaCita: '',
        horaCitaMinima: '',
        horaCitaMaxima: '',
        citaPendiente: false,

        //Paquetes/sobres
        paquetes: [],
        sobres: [
            {
                m_nTipo: 1,
                m_sDescripcion: "",
            },
        ],
        countSobres: 1,
        countPaquetes: 1,

        //Ruta
        idRuta: 0,
        aplicaEntrega: false,
        // deshabilitarDiferenteDomicilio:false,
        DerechoBorrar: 139,
        identificadorModal: "",
        tipoModal: 0,
        openDialog: false,
        agregar: "Agregar",
        fechaHoraCreacion: today.getDate() + "/" + (today.getMonth() + 1) + "/" + today.getFullYear() + " " + today.getHours() + ":" + today.getMinutes(),
        CreadoPor: localStorage.getItem("UsuarioId"),
        ModificadoPor: localStorage.getItem("UsuarioId"),
        height: window.innerHeight,
        embarqueConGuia: false
    });
    let query = useQuery();

    // useEffect(()=>{
    //
    //     obtenerFormatosImpresionProceso(211).then(({data}) => {
    //         setDataReportes(data)
    //     })
    // }, [])

    //Limpia todos los campos. Se usa al pasar del listado a consultar o modificar un registro
    function limpiarCamposAgregar() {
        setState(state => {
            return {
                ...state,
                //==VARIABLES DE AGREGAR
                //Informacion general
                folioRecoleccion: '',
                idRecoleccion: 0,
                idCotizacion: '',
                folioEmbarque: '',
                folioGuia: '',
                folioInforme: '',
                tipoCambio: '',
                tipoCobro: '',
                clientePaga: {m_nNumeroCliente: 'No. Cliente', m_sNombreFiscal: 'Nombre fiscal'},
                idEmbarque: 0,
                idSucursalAgregar: localStorage.getItem("Sucursal"),
                fechaHoraRegistro: getCurrentDateTime(),
                moneda: '',
                estatusEmbarque: 0,
                valorDeclarado: 0,
                idTipoSeguro: TIPOS_SEGURO.SIN_ASIGNAR,
                porcentajeSeguro: 0,
                aplicaSeguro: false,
                idTipoTarifa: '',
                referencia: '',
                //Entrega
                entregaEnSucursal: false,
                diferenteEntrega: false,
                idSucursalEntrega: '',
                zonaOperativaSucursal: null,

                //Cita de recoleccion
                entregaConCita: false,
                recoleccionConCita: false,
                fechaCita: '',
                horaCitaMinima: '',
                horaCitaMaxima: '',
                citaPendiente: false,
                mostrarCotizador: false,

                //Paquetes/sobres
                paquetes: [],
                sobres: [
                    {
                        m_nTipo: 1,
                        m_sDescripcion: "",
                    },
                ],
                countSobres: 1,
                countPaquetes: 1,

                //Rutas
                idRuta: 0,
                esConsultaRuta: false,
                height: window.innerHeight,
                observaciones: '',
                idComplemento: null,
            }
        })
        setDataEmbarqueConsulta(undefined)
        setDataPaquetes([])
        resetEntregaDD()
        resetRecoleccionDD()
        setErrores([])
        setDataConceptos([])
        setDataComplementosSAT([])
        setRepetirConceptos(false)
        setConfiguraciones({
            estatusRecoleccion: 0,
            estatusEmbarque: 0,
            monedaPredeterminadaEmbarque: 0,
            tipoCambioEmbarque: 0,
            estatusGuia: 0,
            tipoTarifa: 0,
            cobrarCita: false,
            costoCita: "0",
            detectarTipoCobro: false,
            tipoCobro: 0,
            limpiarProducto: false,
            idsTiposCobroSeleccionArray: [],
            idsTiposCobroSeleccionString: '',
            idConceptoFlete: 0,
            modificarValorEmbarque:false,
            factorConversion: 0.0,
            fijarCapturaValorDeclarado: false
        })
    }

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
        origenRemitente: null,
        zonaOperativaRemitente: '',
        zonaTarifaRemitente: '',
        latitudR: '',
        longitudR: ''
    })

    const handleChangeRemitente = (data) => {
        setRemitente(() => ({
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
            municipioTexto: data.municipioTexto,
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
        }))
    };

    const handleClickCodigosPostalesInput = (input) => {
        if (input === "codigoPostalRemitente") {
            obtenerCodigosPostalesPorEstadoMunicipio(remitente.estadoRemitente, remitente.municipioRemitente).then(({data}) => {
                setDataCodigosPostalesRemitente(data)
            })
        }
        if (input === "codigoPostalDestinatario") {
            obtenerCodigosPostalesPorEstadoMunicipio(destinatario.estadoDestinatario, destinatario.municipioDestinatario).then(({data}) => {
                setDataCodigosPostalesDestinatario(data)
            })
        }
        if (input === "codigoPostalEnt") {
            obtenerCodigosPostalesPorEstadoMunicipio(entregaDD.estadoEnt, entregaDD.municipioEnt).then(({data}) => {
                setDataCodigosPostalesEntregaDD(data)
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
        destinoDestinatario: null,
        zonaOperativaDestinatario: '',
        zonaTarifaDestinatario: '',
        latitudD: '',
        longitudD: ''
    })

    const handleChangeDestinatario = (data) => {
        setDestinatario(() => ({
            idDestinatario: data.id,
            aliasDestinatario: data.alias,
            nombreDestinatario: data.nombre,
            RFCDestinatario: data.RFC,
            domicilioDestinatario: data.domicilio,
            calleDestinatario: data.calle,
            numeroIntDestinatario: data.numeroInt,
            numeroExtDestinatario: data.numeroExt,
            coloniaDestinatario: data.colonia,
            paisTexto: data.paisTexto,
            estadoDestinatario: data.estado,
            estadoTexto: data.estadoTexto,
            municipioDestinatario: data.municipio,
            municipioTexto: data.municipioTexto,
            codigoPostalDestinatario: data.codigoPostal,
            correoDestinatario: data.correo,
            telefonoDestinatario: data.telefono,
            contactoDestinatario: data.contacto,
            destinoDestinatario: data.destino,
            zonaOperativaDestinatario: data.zonaOperativa,
            latitudD: data.latitud,
            longitudD: data.longitud
        }))
    };

    const [entregaDD, setEntregaDD] = useState({
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

    const resetEntregaDD = () => {
        setEntregaDD({
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

    const [recoleccionDD, setRecoleccionDD] = useState({
        /*idPais: '',
        idEstado: '',
        idMunicipio: '',
        codigoPostal: '',*/
        zonaOperativa: '',
        /*domicilio: '',
        detalles: '',
        datosAdicionales: '',
        latitud: '',
        longitud: ''*/
    })

    const resetRecoleccionDD = () => {
        setRecoleccionDD({
            /*idPais: '',
            idEstado: '',
            idMunicipio: '',
            codigoPostal: '',*/
            zonaOperativa: '',
            /*domicilio: '',
            detalles: '',
            datosAdicionales: '',
            latitud: '',
            longitud: ''*/
        })
    }

    // function generarReporteOpcion1(row) {
    //     obtenerEmbarqueReporte(row.m_nIdEmbarque).then(({data}) => {
    //         let pdfWindow = window.open("");
    //         pdfWindow.document.write("<embed  width='100%' height='100%' src='data:application/pdf;base64, " + encodeURI(data) + "'/>");
    //         pdfWindow.document.body.style.margin = "0px";
    //         pdfWindow.document.title = "Embarque " + row.m_sFolioEmbarque;
    //     })
    // }

    function generarReporte(row) {
        // setSeleccion(row)
        // console.log(row)
        // setOpenDialog(true)
        obtenerFormatosImpresionProceso(FORMATOS_IMPRESION.EMBARQUE).then((respuesta) => {
            imprimirFormatosIdIdTipoReporte(respuesta.data[respuesta.data.length - 1]?.m_nIdFormato, row.m_nIdEmbarque).then(({data}) => { //poner aqui el id de Embarque
                let pdfWindow = window.open("");
                pdfWindow.document.write("<embed  width='100%' height='100%' src='data:application/pdf;base64, " + encodeURI(data.m_sArchivo) + "'/>");
                pdfWindow.document.body.style.margin = "0px";
                pdfWindow.document.title = "Embarque" + row.m_sFolioEmbarque;
            })
        })

    }
    // const handleOnChangeReporte = (data) => {
    //     console.log(data)
    //     setState({
    //         ...state,
    //         reporteSeleccionado: data
    //     })
    // }
    // const handleGenerarReporte=(e)=>{
    //     e.preventDefault()
    //
    //     if (state.reporteSeleccionado.length === 0) {
    //         showError("Es necesario seleccionar al menos un reporte")
    //         return
    //     }
    //
    //     imprimirFormatosIdIdTipoReporte(state.reporteSeleccionado, seleccion.m_nIdEmbarque).then(({data}) => { //poner aqui el id de Embarque
    //         console.log(data)
    //         let pdfWindow = window.open("");
    //         pdfWindow.document.write("<embed  width='100%' height='100%' src='data:application/pdf;base64, " + encodeURI(data.m_sArchivo) + "'/>");
    //         pdfWindow.document.body.style.margin = "0px";
    //         pdfWindow.document.title = "Embarque" + seleccion.m_sFolioEmbarque;
    //     })
    //     setState({
    //         ...state,
    //         reporteSeleccionado: null
    //     })
    //     setOpenDialog(false)
    // }

    const handleOnChangeEntregaDD = (newValue) => {
        setRepetirConceptos(true)
        setEntregaDD(entregaDD => {
            return {
                ...entregaDD,
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

    const getAllEstados = () => {
        obtenerAllEstados().then((respuesta) => {
            setDataEstados(respuesta.data);
        });
    }

    const history = useHistory();

    const handleClickRemitenteDestinatario = (event) => {
        event.preventDefault()
        if (dataRemitenteDestinatario.length === 0) {
            getAllRemitentesDestinatarios()
        }
    }

    function confirmarUbicacion(coordenadas, e) {
        handleAceptar(e, coordenadas)
    }

    const isValidText = (data) => {
        return !(data.length === 0 || data == '0')
    }

    const validarCoordenadas = (coordenadas) => {
        /**Si es modificacion*/
        if (state.idEmbarque != 0) {
            /**Si es entrega diferente domicilio y no hay coordenadas guardadas*/
            if (state.diferenteEntrega
                && coordenadas == undefined) {
                mostrarDialogoMapa(true)
                return false
                /**Si es entrega en el domicilio del destinatario y no hay coordenadas guardadas*/
            } else if (!state.diferenteEntrega
                && !isValidText(destinatario.latitudD)
                && !isValidText(destinatario.longitudD)
                && !coordenadas
            ) {
                mostrarDialogoMapa(true)
                return false
            }
            /**Si es agregar*/
        } else {
            /**Si es entrega diferente domicilio y no hay coordenadas guardadas*/
            if (state.diferenteEntrega && coordenadas == undefined) {
                mostrarDialogoMapa(true)
                return false
                /**Si es entrega en el domicilio del destinatario y no hay coordenadas*/
            } else if (!state.diferenteEntrega
                && !isValidText(destinatario.latitudD)
                && !isValidText(destinatario.longitudD)
                && !coordenadas) {
                mostrarDialogoMapa(true)
                return false
            }
        }
        return true
    }

    const mostrarDialogoMapa = (isVisible) => {
        setState(state => {
            return {
                ...state,
                showConfirmarUbicacion: isVisible,
                titulo: "entrega"
            }
        })
    }
    const mostrarCotizadorRec = (isVisible) => {
        setState(state => {
            return {
                ...state,
                mostrarCotizador: isVisible
            }
        })
    }
    /*const getCurrentDateTime = () => {
        return `${new Date().getFullYear()}-${`${new Date().getMonth() +
        1}`.padStart(2, 0)}-${`${new Date().getDate()}`.padStart(2, 0)}T${`${new Date().getHours()}`.padStart(2, 0)}:${`${new Date().getMinutes()}`.padStart(2, 0)}`
    }*/

    /**Valida que no sea null/undefined,
     * no sea campo vacio,
     * no sea cero,
     * no sea un string con cero*/
    const esDatoValido = (dato) => {
        return dato
            && dato !== ''
            && dato !== 0
            && dato !== "0";

    }

    const esEmbarqueValido = () => {
        let valid = false;
        /**INFORMACION GENERAl*/
        if (!esDatoValido(state.idTipoSeguro)) {
            showSuccess("El tipo de seguro es un dato requerido");
            return valid;
        }
        if (!esDatoValido(state.tipoCambio)) {
            showSuccess("El tipo de cambio es un dato requerido");
            return valid;
        }
        if (!esDatoValido(state.tipoCobro)) {
            showSuccess("El tipo de cobro es un dato requerido");
            return valid;
        }
        if (!esDatoValido(state.clientePaga?.m_nIdCliente)) {
            showSuccess("El responsable de pago es un dato requerido");
            return valid;
        }
        if (configuraciones.fijarCapturaValorDeclarado && parseFloat(state.valorDeclarado) <= 0) {
            showSuccess("El valor declarado no puede ser cero debido a la configuración.");
            return valid;
        }
        /**REMITENTE*/
        if (!esDatoValido(remitente.idRemitente)) {
            showSuccess("El remitente es un dato requerido");
            return valid;
        }
        if (!esDatoValido(remitente.codigoPostalRemitente?.m_nIdCP)) {
            showSuccess("El cÓdigo postal del remitente es un dato requerido");
            return valid;
        }
        if (!esDatoValido(remitente.correoRemitente)) {
            showSuccess("El correo del remitente es un dato requerido")
            return valid;
        }
        if (!esDatoValido(remitente.origenRemitente?.m_nIdCiudad)) {
            showSuccess("La ciudad de origen es un dato requerido");
            return valid;
        }

        /**DESTINATARIO*/
        if (!esDatoValido(destinatario.idDestinatario)) {
            showSuccess("El destinatario es un dato requerido");
            return valid;
        }
        if (!esDatoValido(destinatario.codigoPostalDestinatario?.m_nIdCP)) {
            showSuccess("El código postal del destinatario es un dato requerido");
            return valid;
        }
        if (!esDatoValido(destinatario.correoDestinatario)) {
            showSuccess("El correo del destinatario es un dato requerido")
            return valid;
        }
        if (!esDatoValido(destinatario.destinoDestinatario?.m_nIdCiudad)) {
            showSuccess("La ciudad de destino es un dato requerido");
            return valid;
        }

        /**Si es entrega en sucursal*/
        if (state.entregaEnSucursal) {
            if (!esDatoValido(state.idSucursalEntrega)) {
                showSuccess("La sucursal de entrega es un dato requerido");
                return valid;
            }
            /**Si es entrega en direfente domicilio*/
        } else if (state.diferenteEntrega) {
            if (!esDatoValido(entregaDD.codigoPostal?.m_nIdCP)) {
                showSuccess("El código postal de entrega es un dato requerido");
                return valid;
            }
            if (!esDatoValido(entregaDD.idEstado)) {
                showSuccess("El estado de entrega es un dato requerido");
                return valid;
            }
            if (!esDatoValido(entregaDD.zonaOperativa?.m_nIdZona)) {
                showSuccess("La zona operativa de entrega es un dato requerido");
                return valid;
            }
            /*  if (!esDatoValido(entregaDD.zonaTarifaEnt?.m_nIdZona)){
                  showSuccess("La zona de la tarifa de entrega es un dato requerido");
                  return valid;
              }*/

        } else {
            /**Si es entrega en domicilio de destinatario*/
            if (!esDatoValido(destinatario.zonaOperativaDestinatario?.m_nIdZona)) {
                showSuccess("Verificar la zona operativa de destinatario")
                return valid;
            }
            /* else if (!esDatoValido(destinatario.zonaTarifaDestinatario?.m_nIdZona)) {
                 showSuccess("Verificar la zona tarifa de destinatario")
                 return valid;
             }*/
        }
        if (state.entregaConCita) {
            if (!state.citaPendiente) {
                if (!esDatoValido(state.fechaCita)) {
                    showSuccess("La fecha de la cita es un dato requerido");
                    return;
                }
                if (!esDatoValido(state.horaCitaMinima)) {
                    showSuccess("La hora mínima de la cita es un dato requerido");
                    return;
                }
                if (!esDatoValido(state.horaCitaMaxima)) {
                    showSuccess("La hora máxima de la cita es un dato requerido");
                    return;
                }
            }
        }

        if (!esDatoValido(state.idRuta)) {
            showSuccess("La ruta es un dato requerido.")
            return valid;
        }
        if (dataPaquetes.length === 0) {
            showSuccess("Debe agregar al menos un paquete")
            return
        }
        if (dataComplementosSAT.length === 0) {
            showSuccess("Debe agregar al menos un complemento del SAT")
            return
        }
        if (dataConceptos.find(i => parseInt(i.idConcepto) === parseInt(configuraciones.idConceptoFlete)) === undefined) {
            showSuccess("La cotización debe incluir el concepto flete.")
            return;
        }
        if (dataConceptos.length === 0) {
            showSuccess("No se han agregado conceptos de facturación. Genere una cotización.")
            return;
        }
        valid = true
        return valid;
    }

    const esComplementoValido = (item) => {
        console.log('error complememto ', item)
        let valid = true
        if (!parseFloat(item.cantidad) > 0) {
            return false
        }
        if (!parseFloat(item.peso) > 0) {
            return false
        }
        if (!(item.claveProducto.toString())?.length > 0) {
            return false
        }        
        if (!item.claveUnidad?.length > 0) {
            return false
        }
        if (item.esPeligroso) {
            if (!item.claveFraccion?.length > 0) {
                return false
            }
            if (!item.claveMaterialPeligroso?.length > 0) {
                return false
            }
            if (!item.claveEmbalaje?.length > 0) {
                return false
            }
        }
        return valid
    }
    const handleAceptar = (e, coordenadas) => {
        e.preventDefault();
        
        if (errores.length > 0) {
            showSuccess("Errores en conceptos de facturacion")
            return;
        }
        if (repetirConceptos && state.mostrarCotizador) {
            showSuccess("Se requiere calcular tarifa otra vez")
            return;
        }
        /**Se cierra el dialogo porque si no se quedará abierto despues de darle aceptar.*/
        mostrarDialogoMapa(false)

        if (!esEmbarqueValido()) {
            return;
        }

        /**Si no es entrega en sucursal se validan las coordenadas*/
        if (!state.entregaEnSucursal) {
            if (!validarCoordenadas(coordenadas)) {
                return
            }
        }

        let packs = []
        dataPaquetes.forEach((p) => {
            p.m_xPeso = p.m_rPeso
            p.m_xLargo = p.m_rLargo
            p.m_xAncho = p.m_rAncho
            p.m_xAlto = p.m_rAlto
            p.m_xVolumen = p.m_rVolumen
            p.m_nIdTIpoEmpaque = p.m_nIdTipoEmbalaje
            p.ctd = p.m_nCantidad
            p.m_cValorDeclarado = p.m_cyValorDeclarado
            p.m_nTipo = p.m_nIdTipo
            p.claveSATProducto = p.m_nClaveSATProducto
            p.claveSATUnidad = p.m_nClaveSATUnidad
            p.claveEmbalaje = p.m_sClaveEmbalaje

            packs.push(p)
        })
        if (dataComplementosSAT.some(i => !esComplementoValido(i))) {
            showSuccess("Verifique los complementos SAT registrados.")
            return;
        }
        dataComplementosSAT.forEach(item => {
            item.m_nCantidad = item.cantidad
            item.m_sClaveProductoServicio = item.claveProducto
            item.m_sClaveUnidad = item.claveUnidad
            item.m_sClaveFraccionArancelaria = item.claveFraccion
            item.m_sUUIDComercioExterior = item.comercioExterior
            item.m_sClaveMaterialPeligroso = item.claveMaterialPeligroso
            item.m_bEsMaterialPeligroso = item.esPeligroso
            item.m_sClaveEmbalaje = item.claveEmbalaje
            item.m_sDescripcionEmbalaje = item.descripcionEmbalajeSAT
            item.m_xPeso = parseFloat(parseFloat(item.peso).toFixed(3))
            item.nombreQuimico=item.nomQuimico
            item.numeroCAS=item.numCAS
            item.claveCondicionEspecial=item.claveCondicionesEspeciales
            item.registroSanitario_folioAutorizacion=item.regSanitario_folioAut
        })
        const params = {
            m_nIdEmbarque: state.idEmbarque,
            m_nIdRecoleccion: state.idRecoleccion,
            idSucursal: state.idSucursalAgregar,
            m_sFolioEmbarque: state.folioEmbarque,
            m_nFolioGuia: state.folioGuia,
            m_nIdEmbarqueRelacionado: state.idEmbarqueRelacionado,
            m_nFolioInforme: state.folioInforme,
            m_nIdEstatusEmbarque: state.estatusEmbarque,
            m_nIdMoneda: state.moneda,
            m_cTIpoCambio: state.tipoCambio,
            m_nIdTIpoCobro: state.tipoCobro,
            m_dFecha: getCurrentDateTime().substr(0, 10),
            m_sHora: getCurrentDateTime().substr(getCurrentDateTime().length - 5),
            m_nIdCliente: state.clientePaga.m_nIdCliente,
            valorDeclarado: state.valorDeclarado,
            m_sObservaciones: state.observaciones,
            m_nIdTipoSeguro: state.idTipoSeguro,
            m_xPorcentajeSeguro: state.porcentajeSeguro,
            m_bAplicaSeguro: state.aplicaSeguro,

            m_sNOmbreRemitente: remitente.nombreRemitente,
            m_sRFCRemitente: remitente.RFCRemitente,
            m_sDomicilioRemitente: remitente.domicilioRemitente,
            m_nIdCodigoPostalRemitente: remitente.codigoPostalRemitente.m_nIdCP,
            // m_nCiudadRemitente: remitente.ciudadRemitente,
            m_sCorreoRemitente: remitente.correoRemitente,
            m_sTelefonoRemitente: remitente.telefonoRemitente,
            m_sContactoRemitente: remitente.contactoRemitente,
            m_nIdCiudadOrigen: remitente.origenRemitente.m_nIdCiudad,
            // m_nIdZonaRemitente: remitente.zonaRemitente.m_nIdZona,
            m_nIdRemitente: remitente.idRemitente,
            m_sAliasRemitente: remitente.aliasRemitente,
            m_sCalleRemitente: remitente.calleRemitente,
            m_sNoIntRemitente: remitente.numeroIntRemitente,
            m_sNoExtRemitente: remitente.numeroExtRemitente,
            m_nIdEstadoRemitente: remitente.estadoRemitente,
            m_sColoniaRemitente: remitente.coloniaRemitente,
            m_sMunicipioRemitente: remitente.municipioRemitente,

            m_sNombreDestinatario: destinatario.nombreDestinatario,
            m_sRFCDestinatario: destinatario.RFCDestinatario,
            m_sDomicilioDestinatario: destinatario.domicilioDestinatario,
            m_nIdCodigoPostalDestinatario: destinatario.codigoPostalDestinatario.m_nIdCP,
            m_nIdCIudadDestinatario: destinatario.ciudadDestinatario,
            m_sCorreoDestinatario: destinatario.correoDestinatario,
            m_sTelefonoDestinatario: destinatario.telefonoDestinatario,
            m_sContactoDestinatario: destinatario.contactoDestinatario,
            m_nIdCiudadDestino: destinatario.destinoDestinatario.m_nIdCiudad,
            // m_nIdZonaDestinatario: destinatario.zonaDestinatario.m_nIdZona
            m_sMunicipioDestinatario: destinatario.municipioDestinatario,
            m_nIdDestinatario: destinatario.idDestinatario,
            m_sAliasDestinatario: destinatario.aliasDestinatario,
            m_nIdEstadoDestinatario: destinatario.estadoDestinatario,
            m_sCalleDestinatario: destinatario.calleDestinatario,
            m_sNoIntDestinatario: destinatario.numeroIntDestinatario,
            m_sNoExtDestinatario: destinatario.numeroExtDestinatario,
            m_sColoniaDestinatario: destinatario.coloniaDestinatario,
            m_sLatitudD: coordenadas?coordenadas.lat?coordenadas.lat.toString():coordenadas[0].toString():destinatario.latitudD,
            m_sLongitudD: coordenadas?coordenadas.lng?coordenadas.lng.toString():coordenadas[1].toString():destinatario.longitudD,
            m_sLatitudR: remitente.latitudR,
            m_sLongitudR: remitente.longitudR,

            m_nNoPaquetes: state.paquetes.length,
            m_nNoSobres: state.sobres.length,
            m_arrClsDetalle: packs,
            m_arrClsComplementoSAT: dataComplementosSAT,
            creadoPor: state.CreadoPor,
            modificadoPor: state.ModificadoPor,

            // IdCiudadEntrega: state.ciudadDestinatario,
            codigoPostalEntrega: destinatario.codigoPostalDestinatario.m_nIdCP,
            domicilioEntrega: destinatario.domicilioDestinatario,
            entregarMismoDomicilio: !state.diferenteEntrega,
            //Cita de recoleccion
            m_bEmbarqueConCita: state.entregaConCita,
            m_nIdComplemento: state.idComplemento,
            m_nIdTipoDocumento: state.idTipoDocumento,
            m_bValidarTimbradoIngreso: state.validarTimbrado,
            m_nTipoTimbrado: state.tipoTimbrado,
            m_sReferencia: state.referencia
        }
        params.m_bEntregaEnSucursal = state.entregaEnSucursal
        /**Si es entrega en sucursal*/
        if (state.entregaEnSucursal) {
            params.m_nIdSucursalEntrega = state.idSucursalEntrega
            params.entregarMismoDomicilio = false
            params.m_nIdZonaOperativa = state.zonaOperativaSucursal.m_nIdZona

        } else {
            params.m_nIdSucursalEntrega = 0
            /**Si es entrega en direfente domicilio*/
            if (state.diferenteEntrega) {
                params.m_bEntregaEnSucursal = false
                params.codigoPostalEntrega = entregaDD.codigoPostal.m_nIdCP
                params.domicilioEntrega = entregaDD.domicilio
                params.entregarEn = entregaDD.detalles
                params.m_nIdEstadoEntrega = entregaDD.idEstado
                params.m_sCodigoMunicipioEntrega = entregaDD.idMunicipio
                params.datosAdicionales = entregaDD.datosAdicionales
                params.m_nIdZonaOperativa = entregaDD.zonaOperativa.m_nIdZona
                // params.m_nIdZonaTarifa = entregaDD.zonaTarifaEnt.m_nIdZona
                params.m_sLatitudD = coordenadas?coordenadas.lat?coordenadas.lat.toString():coordenadas[0].toString(): entregaDD.latitud
                params.m_sLongitudD = coordenadas?coordenadas.lng?coordenadas.lng.toString():coordenadas[1].toString(): entregaDD.longitud
            } else {
                /**Si es entrega en domicilio de destinatario*/
                params.m_nIdZonaOperativa = destinatario.zonaOperativaDestinatario ? destinatario.zonaOperativaDestinatario.m_nIdZona : 0
                params.m_nIdZonaTarifa = destinatario.zonaTarifaDestinatario ? destinatario.zonaTarifaDestinatario.m_nIdZona : 0
                params.m_sLatitudD = coordenadas?coordenadas.lat?coordenadas.lat.toString():coordenadas[0].toString():destinatario.latitudD
                params.m_sLongitudD = coordenadas?coordenadas.lng?coordenadas.lng.toString():coordenadas[1].toString():destinatario.longitudD
            }
        }

        if (state.entregaConCita) {
            params.m_bCitaPendiente = state.citaPendiente
            if (!state.citaPendiente) {
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

        params.m_nIdRuta = state.idRuta
        if (state.idEmbarque != 0) {
            modificarEmbarques(state.idEmbarque, params)
                .then((respuesta) => {
                    showSuccess(respuesta.data);
                    if (respuesta.data != "Modificado Exitosamente") {
                        return
                    }
                    handleShowListado();
                })
                .catch((err) => {
                    console.log(err);
                    showSuccess(err.response.data);
                });
        } else {
            agregarEmbarques(params)
                .then((respuesta) => {
                    if (respuesta.data.m_sFolioEmbarque.length === 0) {
                        return
                    }
                    showSuccess("Embarque creado con folio: " + respuesta.data.m_sFolioEmbarque);
                    // handleShowListado();
                    setState(state => {
                        return {
                            ...state,
                            idEmbarque: respuesta.data.m_nIdEmbarque,
                            folioEmbarque: respuesta.data.m_sFolioEmbarque,
                        }
                    })
                    mostrarCotizadorRec(false)
                    confirmAlert({
                        title: 'Confirmación',
                        message: '¿Desea crear la guía para este embarque?',
                        buttons: [
                            {
                                label: 'Sí',
                                onClick: async () => generarGuia(respuesta.data.m_nIdEmbarque)
                            },
                            {
                                label: 'No',
                                onClick: async () => handleShowListado()
                            }
                        ]
                    });
                })
                .catch((err) => {
                    console.log(err);
                    showSuccess(err.response.data);
                });
        }
    };

    function handleSelectCP(id, cp) {
        if (state.identificadorModal == "nombreRemitente") {
            setState(state => {
                return {
                    ...state,
                    [state.identificadorModal]: id,
                    RFCRemitente: id.m_sRFC,
                    domicilioRemitente: id.m_sDomicilio,

                    ciudadRemitente: dataCiudad.find(
                        (o) => o.m_nIdCiudad == dataCodigosPostalesRemitente.find((o) => o.m_nIdCP == id.m_nIdCP).m_nIdCiudad
                    ),

                    correoRemitente: id.m_sCorreoElectronico,
                    telefonoRemitente: id.m_sTelefono,
                    contactoRemitente: id.m_sContacto,
                }
            });
        } else {
            setState(state => {
                return {
                    ...state,
                    [state.identificadorModal]: id,
                    RFCDestinatario: id.m_sRFC,
                    domicilioDestinatario: id.m_sDomicilio,

                    ciudadDestinatario: dataCiudad.find(
                        (o) => o.m_nIdCiudad ==
                            dataCodigosPostalesDestinatario.find((o) => o.m_nIdCP == id.m_nIdCP).m_nIdCiudad
                    ),

                    correoDestinatario: id.m_sCorreoElectronico,
                    telefonoDestinatario: id.m_sTelefono,
                    contactoDestinatario: id.m_sContacto,
                }
            });
        }

    }

    function getTipoCambio() {
        obtenerTipoCambio().then(respuesta => {
            setDataTipoCambio(respuesta.data)
        });
    }

    function handleEliminar(embarque) {
        let derecho;
        if (embarque.m_sEstatusEmbarque !== "Cancelado") {
            showSuccess("El embarque tiene que estar cancelado.");
            return;
        }
        validarPermisos(state)
            .then((respuesta) => {
                //showSuccess(respuesta.data)

                derecho = respuesta.data;
                if (derecho === false) {
                    showSuccess("El usuario no tiene derechos para realizar el proceso");
                    return;
                }
                eliminarEmbarques(embarque.m_nIdEmbarque, state.CreadoPor)
                    .then((respuesta) => {
                        showSuccess(respuesta.data);
                        getAllEmbarque();

                    })
                    .catch((err) => {
                        showSuccess(err.response?.data);

                    });
            })
            .catch((err) => {
                showSuccess("Hubo un error al intentar eliminar.");
            });
    }

    //Funcion para cancelar un embarque. Se usa en tab cancelar.
    const handleCancelar = (e) => {
        e.preventDefault();

        let params = {
            motivoCancelacion: state.motivoCancelacion,
            usuarioCancelacion: localStorage.getItem("UsuarioId"),
            fechaCancelacion: state.fechaCancelacion.replace('T', ' '),
        };
        cancelarEmbarque(state, params).then((respuesta) => {
            showSuccess(respuesta.data);
            getAllEmbarque()

            $('.nav-tabs li ').removeClass('active');
            $('.nav-tabs li').eq(0).addClass('active');
            $('.tab-content div ').removeClass('in show');
            $('#Listado').addClass('in show');
        });


    };

    /*useEffect((value) => {
        if (props.location.idRecoleccion != undefined) {
            if (dataRemitenteDestinatario.length > 0 && dataCiudad.length > 0 && dataClientes.length > 0) {
                obtenerRecoleccionId(props.location.idRecoleccion)
                    .then((respuesta) => {
                        setDataRecoleccionOnState(respuesta)
                    })
            }
        }


    }, [dataRemitenteDestinatario, dataCiudad, dataClientes]);*/

    //Se checa si se entró a embarque por una recoleccion
    useEffect(async (value) => {

        if (query.get("id")) {
            handleShowConsultar(query.get("id"))
        }
        if (props.location.idRecoleccion !== undefined) {
            obtenerRecoleccionId(props.location.idRecoleccion)
                .then((respuesta) => {
                    setDataRecoleccionOnState(respuesta)
                    setTabActiva(1)
                    setRepetirConceptos(false)
                })
        }
        if (localStorage.getItem("UsuarioId") === null || localStorage.getItem("UsuarioId") <= 0) {
            showSuccess("Es necesario iniciar sesion para acceder a este proceso");
            window.location.replace("login");
            return;
        }
    }, []);

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

    const getZonaOperativaByCodigoPostal = (codigoPostal) => {
        obtenerZonaOperativaByIdCodigoPostal(codigoPostal).then(respuesta => {
            setState(state => {
                return {
                    ...state,
                    zonaOperativaSucursal: respuesta.data[0]
                }
            })
        })
    }

    function handleShowCancelar(e) {
        if (e) {
            e.preventDefault()
        }
        $('.nav-tabs li ').removeClass('active');
        $('.nav-tabs li').eq(4).addClass('active');
        $('.tab-content div ').removeClass('in show');
        $('#Cancelar').addClass('in show');
        setTabActiva(2)
        obtenerEmbarquesId(state.idEmbarque).then((respuesta) => {
            setState(state => {
                return {
                    ...state,
                    folioEmbarque: respuesta.data.m_sFolioEmbarque,
                    sucursalCancelacion: respuesta.data.m_sSucursal,
                    fechaCancelacion: respuesta.data.m_sFechaCancelacion ? respuesta.data.m_sFechaCancelacion.replace(' ', 'T') : getCurrentDateTime(),
                    estatusEmbarque: respuesta.data.m_sEstatusEmbarque,
                    motivoCancelacion: respuesta.data.m_sMotivoCancelacion || '',
                    sePuedeCancelar: respuesta.data.m_bSePuedeCancelar
                }
            });
            if (!respuesta.data.m_bSePuedeCancelar) {
                showSuccess("Embarque no se puede cancelar");
            }
            getAllEmbarque();
        });
    }

    function handleShowConsultar(id) {
        $('.nav-tabs li ').removeClass('active');
        $('.nav-tabs li').eq(1).addClass('active');
        $('.tab-content div ').removeClass('in show');
        $('#Agregar').addClass('in show');
        limpiarCamposAgregar()
        setTabActiva(1)
        obtenerEmbarquesId(id).then((respuesta) => {
            setState(state => {
                return {
                    ...state,
                    agregar: "Consultar",
                }
            });
            setDataParaConsultarModificar(respuesta, false, "Consultar")

        });
    }

    function handleShowDuplicarConsultar(id) {
        $('.nav-tabs li ').removeClass('active');
        $('.nav-tabs li').eq(1).addClass('active');
        $('.tab-content div ').removeClass('in show');
        $('#Agregar').addClass('in show');
        limpiarCamposAgregar()
        setTabActiva(1)
        obtenerEmbarquesId(id).then((respuesta) => {
            setState({
                ...state,
                agregar: "Agregar",
            });
            setDataParaConsultarModificar(respuesta, true, "Agregar")

        });
    }

    function handleShowAgregar() {
        let today = new Date();
        limpiarCamposAgregar()
        getDataParaEditar("Agregar")

        setState(state => {
                return {
                    ...state,
                    agregar: "Agregar",
                }



         }
        )
        $('.nav-tabs li ').removeClass('active');
        $('.nav-tabs li').eq(1).addClass('active');
        $('.tab-content div ').removeClass('in show');
        $('#Agregar').addClass('in show');
        setTabActiva(1)

    }
    function monitorearCambios(){
        setDetectar(true)

    }
    useEffect(() => {
        if( detectarModificaciones){
            window.onbeforeunload = confirmExit
        }
    }, [remitente,destinatario,state,dataComplementosSAT,dataPaquetes,entregaDD,dataConceptos])
    function confirmExit()
    {

      return "show warning";
    }
    function handleShowModificar(filaEmbarque, id) {
        if (filaEmbarque.m_nIdEstatusEmbarque == 21) {
            showSuccess("El embarque no puede ser modificado ya que se encuentra cancelado")
            return
        }
        if (filaEmbarque.m_sFolioGuia) {
            if (filaEmbarque.m_sFolioGuia.length != 0) {
                showSuccess("No es posible modificar el embarque ya que pertenece a una guia")
                return
            }
        }
        $('.nav-tabs li ').removeClass('active');
        $('.nav-tabs li').eq(1).addClass('active');
        $('.tab-content div ').removeClass('in show');
        $('#Agregar').addClass('in show');
        limpiarCamposAgregar()
        setTabActiva(1)
        obtenerEmbarquesId(id).then((respuesta) => {
            setState(state => {
                return {
                    ...state,
                    agregar: "Modificar",
                    embarqueConGuia: data.find((o) => o.m_nIdEmbarque == id).m_sFolioGuia != null,
                }
            });
            setDataParaConsultarModificar(respuesta, false, "Modificar")
        });
    }

    //Funcion para mostrar datos de recoleccion para crear embarque
    function setDataRecoleccionOnState(respuesta) {
        /**Este indicador se checa en el componente de RemitentesDestinatarios*/

        respuesta.data.recoleccionById = true
        setDataEmbarqueConsulta(respuesta)
        getDataParaEditar("Agregar")
        getAllCiudades()
        getAllSucursales()
        getAllEstatusEmbarque()
        getAllTiposSeguro()

        //PAQUETES
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

        //COMPLEMENTOS SAT
        /*respuesta.data.m_arrClsComplementoSAT.forEach(item => {
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
        })*/
        respuesta.data.m_arrClsComplementoSAT.forEach((item)=>{
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

        //CLIENTE
        obtenerClienteId(respuesta.data.m_nIdCliente).then(({data}) => {
            setState(state => {
                return {
                    ...state,
                    clientePaga: data,

                }
            })
        })

        //CONCEPTOS
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

        //ENTREGA EN SUCURSAL
        if (respuesta.data.m_bEntregaSucursal) {
            setState(state => {
                return {
                    ...state,
                    entregaEnSucursal: respuesta.data.m_bEntregaSucursal,
                    idSucursalEntrega: respuesta.data.m_nIdSucursalEntrega,
                    diferenteEntrega: false,
                    zonaOperativaSucursal: {
                        m_nIdZona: respuesta.data.m_nIdZonaOperativaEntrega,
                        m_sCodigoZona: respuesta.data.m_sCodigoZonaEntrega,
                    },
                    aplicaEntrega: respuesta.data.m_bAplicaEntrega,
                    // deshabilitarDiferenteDomicilio:respuesta.data.m_bAplicaEntrega,
                }
            })
            /*obtenerByIdZonaOperativa(respuesta.data.m_nIdZonaOperativaEntrega).then(({data}) => {
                console.log("entra"+JSON.stringify(data))
                setState(state => {
                    return {
                        ...state,
                        zonaOperativaSucursal: {
                            m_nIdZona: respuesta.data.m_nIdZonaOperativaEntrega,
                            m_sCodigoZona: respuesta.data.m_sCodigoZonaEntrega,
                        },
                        aplicaEntrega:respuesta.data.m_bAplicaEntrega,
                        deshabilitarDiferenteDomicilio:respuesta.data.m_bAplicaEntrega,
                    }
                })
            })*/
        } else {
            //ENTREGA EN DIFERENTE DOMICILIO
            if (respuesta.data.m_bEntregaDiferenteDomicilio) {
                setEntregaDD(entregaDD => {
                    return {
                        ...entregaDD,
                        idEstado: respuesta.data.m_nIdEstadoEntrega || 0,
                        estado: respuesta.data.m_sEstadoEntrega || '',
                        idPais: respuesta.data.m_nIdPaisEntrega || 0,
                        pais: respuesta.data.m_sPaisEntrega || '',
                        idMunicipio: respuesta.data.m_sCodigoMunicipioEntrega || 0,
                        municipio: respuesta.data.m_sMunicipioEntrega || '',
                        domicilio: respuesta.data.m_sDomicilioDetalleEntrega,
                        detalles: respuesta.data.m_sEntregarEnDetalleEntrega,
                        datosAdicionales: respuesta.data.m_sDatosAdicionalesDetalleEntrega,
                        codigoPostal: {
                            m_nIdCP: respuesta.data.m_nIdCPDetalleEntrega,
                            m_sCP: respuesta.data.m_sCodigoPostalEntrega,
                            m_sColonia: respuesta.data.m_sColoniaEntrega ? respuesta.data.m_sColoniaEntrega : respuesta.data.m_sLocalidadEntrega,
                            m_sLocalidad: respuesta.data.m_sLocalidadEntrega
                        },
                    }
                })
                obtenerMunicipiosByIdEstado(respuesta.data.m_nIdEstadoEntrega).then(({data}) => {
                    setDataMunicipiosEntregaDD(data)
                })

                obtenerByIdZonaOperativa(respuesta.data.m_nIdZonaOperativaEntrega).then(({data}) => {
                    setEntregaDD(entregaDD => {
                        return {
                            ...entregaDD,
                            zonaOperativa: data,
                        }
                    })
                })
            }
        }

        setState(state => {
            return {
                ...state,
                idRecoleccion: respuesta.data.m_nIdRecoleccion,
                fechaHoraRegistro: getCurrentDateTime(),
                idCotizacion: respuesta.data.m_nIdCotizacion,
                idSucursalAgregar: localStorage.getItem("Sucursal"),
                folioRecoleccion: respuesta.data.m_sFolioRecoleccion,
                folioEmbarque: respuesta.data.m_sFolioEmbarque,
                fechaHoraCreacion: today.getDate() + "/" + (today.getMonth() + 1) + "/" + today.getFullYear() + " " + today.getHours() + ":" + today.getMinutes(),
                moneda: respuesta.data.m_nMoneda,
                tipoCambio: respuesta.data.m_rTipoCambio,
                tipoCobro: respuesta.data.m_nIdTipoDeCobro,
                estatusEmbarque: 16,
                //Datos entrega
                diferenteEntrega: respuesta.data.m_bEntregaDiferenteDomicilio,
                idTipoSeguro: respuesta.data.m_bAplicaSeguro ? respuesta.data.m_nIdTipoSeguro : TIPOS_SEGURO.SIN_ASIGNAR,
                porcentajeSeguro: respuesta.data.m_bAplicaSeguro ? respuesta.data.m_xPorcentajeSeguro : 0,
                aplicaSeguro: respuesta.data.m_bAplicaSeguro,
                valorDeclarado: respuesta.data.m_xValorDeclarado,
                recoleccionConCita: respuesta.data.m_bRecoleccionConCita,
                //observaciones
                observaciones: respuesta.data.m_sObservaciones,
                referencia: respuesta.data.m_sReferencia,
            }
        });
    }

    const mostrarDatosEntregaDiferenteDomicilio = (respuesta) => {
        setEntregaDD(entregaDD => {
            return {
                ...entregaDD,
                idPais: respuesta.data.m_nIdPaisEntrega,
                pais: respuesta.data.m_sPaisEntrega || '',
                idEstado: respuesta.data.m_nIdEstadoEntrega,
                estado: respuesta.data.m_sEstadoEntrega || '',
                idMunicipio: respuesta.data.m_sCodigoMunicipioEntrega,
                municipio: respuesta.data.m_sMunicipioEntrega || '',
                domicilio: respuesta.data.DomicilioEntrega,
                detalles: respuesta.data.EntregarEn,
                datosAdicionales: respuesta.data.DatosAdicionalesis,
                latitud: respuesta.data.m_sLatitud,
                longitud: respuesta.data.m_sLongitud,
                codigoPostal: {
                    m_nIdCP: respuesta.data.m_nIdCodigoPostalEntrega,
                    m_sCP: respuesta.data.m_sCodigoPostalEntrega,
                    m_sColonia: respuesta.data.m_sColoniaEntrega ? respuesta.data.m_sColoniaEntrega : respuesta.data.m_sLocalidadEntrega
                },
                zonaOperativa: {
                    m_nIdZona: respuesta.data.m_nIdZonaOperativa,
                    m_sCodigoZona: respuesta.data.m_sZonaOperativa
                }
            }
        })
        setState(state => {
            return {
                ...state,
                entregaEnSucursal: false,
                diferenteEntrega: !respuesta.data.EntregarMismoDomicilio,
            }
        });
        /*obtenerMunicipiosByIdEstado(respuesta.data.m_nIdEstadoEntrega).then(({data}) =>{
            setDataMunicipiosEntregaDD(data)
        })*/
        /*obtenerByIdZonaOperativa(respuesta.data.m_nIdZonaOperativa).then(({data}) => {
            setEntregaDD(entregaDD => {
                return{
                    ...entregaDD,
                    zonaOperativaEnt: data
                }
            })
        })*/
    }

    const mostrarDatosRecoleccionDD = (respuesta) => {
        setRecoleccionDD(recoleccionDD => {
            return {
                ...recoleccionDD,
                zonaOperativa: {m_nIdZona: respuesta.data.m_nIdZonaOperativaRecoleccion}
            }
        })
    }

    //Funcion para mostrar datos de embarque para consultar o modificar
    const setDataParaConsultarModificar = (respuesta, duplicar, operacion) => {
        /**Este indicador se checa en el componente de RemitentesDestinatarios*/
        respuesta.data.embarqueById = true
        setDataEmbarqueConsulta(respuesta)
        getDataParaEditar(operacion)
        getAllCiudades()

        /**Si es entrega en sucursal*/
        if (respuesta.data.m_bEntregaEnSucursal) {
            /*setState(state => {
                return {
                    ...state,
                    entregaEnSucursal: respuesta.data.m_bEntregaEnSucursal,
                    idSucursalEntrega: respuesta.data.m_nIdSucursalEntrega,
                    diferenteEntrega: false,
                }
            })*/
            obtenerByIdZonaOperativa(respuesta.data.m_nIdZonaOperativa).then(({data}) => {
                setState(state => {
                    return {
                        ...state,
                        entregaEnSucursal: respuesta.data.m_bEntregaEnSucursal,
                        idSucursalEntrega: respuesta.data.m_nIdSucursalEntrega,
                        diferenteEntrega: false,
                        zonaOperativaSucursal: data
                    }
                })
            })
            /**Si es entrega es en diferente domicilio*/
        } else if (!respuesta.data.EntregarMismoDomicilio) {
            mostrarDatosEntregaDiferenteDomicilio(respuesta)
        }

        if (respuesta.data.m_bRecoleccionDiferenteDomicilio) {
            mostrarDatosRecoleccionDD(respuesta)
        }
        let totalPaquetes = 0
        respuesta.data.m_arrSobres.forEach((s) => {
            respuesta.data.m_arrPaquetes.push(s)
        })

        /**m_sClaveSATProducto = Clave producto SAT
         * m_nProducto = Producto del SAT
         * m_nIdProducto = id Producto
         * m_sProducto = descripcion producto*/

        /**Se castean porque el componente <Paquetes/> usa otros nombres para los datos */
        respuesta.data.m_arrPaquetes.forEach((p) => {
            p.m_nIdPaquete = p.m_nIdEmbarqueDetalle
            p.m_rPeso = p.m_xPeso
            p.m_rLargo = p.m_xLargo
            p.m_rAncho = p.m_xAncho
            p.m_rAlto = p.m_xAlto
            p.m_rVolumen = p.m_xVolumen
            p.m_nIdTipoEmbalaje = p.m_nIdTIpoEmpaque
            p.m_nCantidad = p.ctd
            p.m_cyValorDeclarado = p.m_cValorDeclarado
            p.m_nIdTipo = p.m_nTipo
            // p.m_nClaveSATProducto
            // p.m_nClaveSATUnidad
            // p.m_sUnidadSAT
            // p.m_sProductoSAT

            obtenerProductoById(p.m_nIdProducto).then(({data}) => {
                p["producto"] = data
                p.m_sProducto = data.m_sDescripcion
            })
            obtenerEmbalajesId(p.m_nIdTipoEmbalaje).then(({data}) => {
                p.m_sTipoEmbalaje = data.m_sNombre
            })
            p.m_sTipo = p.m_nIdTipo == 1 ? 'Sobre' : 'Paquete'
        })
        setDataPaquetes(respuesta.data.m_arrPaquetes)

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
            item.formaFarmaceutica=''
            item.nomQuimico=item.NombreQuimico
            item.loteMedicamento=item.LoteMedicamento
            item.numRegSanPlagCOFEPRIS=item.NumRegSanPlagCOFEPRIS
            item.numCAS=item.NumeroCAS
            item.regSanitario_folioAut=item.RegistroSanitarioFolioAutorizacion
            item.usoAutorizado=item.UsoAutorizado
            item.esFarmaco=item.esFarmaco

        })
        setDataComplementosSAT(respuesta.data.m_arrClsComplementoSAT)

        obtenerClienteId(respuesta.data.m_nIdCliente).then(({data}) => {
            setState(state => {
                return {
                    ...state,
                    clientePaga: data
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
                idEmbarque: duplicar ? 0 : respuesta.data.m_nIdEmbarque,
                idCotizacion: respuesta.data.m_nIdCotizacion,
                idEmbarqueRelacionado: duplicar ? respuesta.data.m_nIdEmbarque : 0,
                idRecoleccion: duplicar ? 0 : respuesta.data.m_nIdRecoleccion,
                idSucursalAgregar: respuesta.data.IdSucursal,
                folioRecoleccion: duplicar ? "" : respuesta.data.m_sFolioRecoleccion,
                // recoleccionConCita: respuesta.data.m_sFolioRecoleccion ? respuesta.data.m_sFolioRecoleccion.length > 0 : false,
                folioEmbarque: respuesta.data.m_sFolioEmbarque,
                folioGuia: duplicar ? "" : respuesta.data.m_sFolioGuia,
                folioInforme: duplicar ? "" : respuesta.data.m_sFolioInforme,
                fechaHoraRegistro: respuesta.data.m_dFechaRegistro + 'T' + respuesta.data.m_tHoraRegistro.substr(0, 5),
                estatusEmbarque: duplicar ? 16 : respuesta.data.m_nIdEstatusEmbarque,
                moneda: respuesta.data.m_nIdMoneda,
                tipoCambio: respuesta.data.m_cTIpoCambio,
                tipoCobro: respuesta.data.m_nIdTIpoCobro,
                valorDeclarado: respuesta.data.m_xValorDeclarado,
                idTipoSeguro: respuesta.data.m_nIdTipoSeguro,
                porcentajeSeguro: respuesta.data.m_xPorcentajeSeguro,
                aplicaSeguro: respuesta.data.m_bAplicaSeguro,
                // clientePaga: dataClientes.find((c) => c.m_nIdCliente == respuesta.data.m_nIdCliente),
                duplicar: duplicar,
                //Entrega

                entregaConCita: respuesta.data.m_bEmbarqueConCita,
                fechaCita: respuesta.data.m_sFechaCita,
                horaCitaMinima: respuesta.data.m_sHoraCitaMinima,
                horaCitaMaxima: respuesta.data.m_sHoraCitaMaxima,
                citaPendiente: respuesta.data.m_bCitaPendiente,

                recoleccionConCita: respuesta.data.m_bRecoleccionConCita,

                //Ruta
                idRuta: respuesta.data.m_nIdRuta,
                esConsultaRuta: true,

                //Paquetes/sobres
                paquetes: respuesta.data.m_arrPaquetes,
                sobres: respuesta.data.m_arrSobres,
                countPaquetes: respuesta.data.m_nNoPaquetes,
                countSobres: respuesta.data.m_nNoSobres,
                fechaHoraCreacion: today.getDate() + "/" + (today.getMonth() + 1) + "/" + today.getFullYear() + " " + today.getHours() + ":" + today.getMinutes(),
                //observaciones
                observaciones: respuesta.data.m_sObservaciones,
                idTipoDocumento: respuesta.data.m_nIdTipoDocumento,
                idComplemento: respuesta.data.m_nIdComplemento,
                validarTimbrado: respuesta.data.m_bValidarTimbraoIngreso,
                tipoTimbrado: respuesta.data.m_nTipoTimbrado,
                referencia: respuesta.data.m_sReferencia
            }
        });

    }

    const handleShowListado = (event) => {
        if (event) {
            event.stopPropagation();
        }
        setDetectar(false)
        window.onbeforeunload={}
        limpiarCamposAgregar()

        setState(state => {
            return {
                ...state,
                agregar: "Agregar",
                sucursalListado: 0,
                estatusListado: 0,
                folioRecoleccion: '',
                embarqueConGuia: false
            }
        });
        getAllEmbarque();
        $('.nav-tabs li ').removeClass('active');
        $('.nav-tabs li').eq(0).addClass('active');
        $('.tab-content div ').removeClass('in show');
        $('#Listado').addClass('in show');
        setTabActiva(0)
    }

    const handleShowImportar = (event) => {
        if (event) {
            event.stopPropagation();
        }
        $('.nav-tabs li ').removeClass('active');
        $('.nav-tabs li').eq(4).addClass('active');
        $('.tab-content div ').removeClass('in show');
        $('#Importar').addClass('in show');
    }

    const handleChange = (event) => {
        if (event.target.name == "porcentajeSeguro") {
            setRepetirConceptos(true)
        }
        setState(state => {
            return {
                ...state,
                [event.target.name]: event.target.value,
            }
        });
    };

    const handleChangeSucursalEntrega = (event) => {
        //Evaluar si este setState se usa para algo
        setState(state => {
            return {
                ...state,
                [event.target.name]: event.target.value,
            }
        });
        getZonaOperativaByCodigoPostal(dataSucursal.find(c => c.m_nIdSucursal == event.target.value).m_nIdCodigoPostal)
    };

    const handleEntregaCheckboxChange = (event) => {
        setRepetirConceptos(true)
        setState(state => {
            return {
                ...state,
                diferenteEntrega: !state.diferenteEntrega,
                entregaEnSucursal: false
            }
        });
    };

    const handleEntregaEnSucursalCheckbox = (event) => {
        setRepetirConceptos(true)
        getZonaOperativaByCodigoPostal(dataSucursal.find(c => c.m_nIdSucursal == destinatario.zonaOperativaDestinatario.m_nIdSucursal).m_nIdCodigoPostal)
        setState(state => {
            return {
                ...state,
                entregaEnSucursal: !state.entregaEnSucursal,
                diferenteEntrega: !state.entregaEnSucursal && false,
                entregaConCita: !state.entregaEnSucursal && false,
                idSucursalEntrega: destinatario.zonaOperativaDestinatario.m_nIdSucursal
            }
        });
    };

    const handleEntregaConCitaCheckbox = (event) => {
        setRepetirConceptos(true)
        setState(state => {
            return {
                ...state,
                entregaEnSucursal: !state.entregaConCita && false,
                entregaConCita: !state.entregaConCita
            }
        });
    };
    const seCalculaTarifa = () => {
        setRepetirConceptos(true)
    }

    const handleClickCiudad = (event) => {
        event.preventDefault()
        if (dataCiudad.length === 0) {
            getAllCiudades()
        }
    }

    const handleSucursalFiltro = async (event) => {
        setState(state => {
            return {
                ...state,
                sucursalListado: event.target.value,
            }
        });
        const {fechaInicial, fechaFinal, estatusListado, folioEmbarque} = state
        if((fechaInicial == '') || (fechaFinal == '')){
            showError("Debe ingresar un rango de fechas");
            return;
        }
        obtenerEmbarquesFiltro(fechaInicial, fechaFinal, event.target.value, estatusListado, folioEmbarque).then((respuesta) => {
            setData(respuesta.data);
        });
    };

    function handleSelectDatos(id, cp) {
        setState(state => {
            return {
                ...state,
                [state.identificadorModal]: id,
            }
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

    const getDataParaEditar = (operacion) => {
        console.log(operacion)
        getAllSucursales();
        getAllEstatusEmbarque();
        getAllTipoCobro();
        getAllTipoMoneda();
        getTipoCambio()
        getAllTiposSeguro()
        getAllEstados()
        getParametrosConfiguracion(operacion)
    }


    async function getParametrosConfiguracion(operacion) {
        obtenerParametrosConfiguracion().then(respuesta => {
            obtenerTiposDocumentoSucursal(localStorage.getItem("Sucursal")).then(({data}) => {
                setDataTipoDocumento(data)

                if (operacion === "Agregar") {
                    setState((config) => {
                        return {
                            ...config,
                            estatusEmbarque: respuesta.data.EstatusEmbarque,
                            moneda: state.idRecoleccion > 0 ? state.moneda : respuesta.data.MonedaEmbarque,
                            tipoCambio: state.idRecoleccion > 0 ? state.tipoCambio : respuesta.data.TipoCambioEmbarque,
                            tipoCobro: state.idRecoleccion > 0 ? state.tipoCobro : respuesta.data.TipoCobro,
                            tipoTimbrado: respuesta.data.TipoTimbrado,
                            validarTimbrado: respuesta.data.ValidarTimbradoIngreso,
                            porcentualSeguroDefecto:respuesta.data.PorcentualSeguroDefecto
                        }
                    })
                }
                setState(state => {
                    return {
                        ...state,
                        idTipoTarifa: respuesta.data.TipoTarifaTarifas,
                        // tipoTimbrado: respuesta.data.TipoTimbrado
                    }
                })
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
                        modificarValorEmbarque: respuesta.data.ModificarValorEmbarque,
                        factorConversion: respuesta.data.FactorConversion,
                        fijarCapturaValorDeclarado: respuesta.data.FijarCapturaValorDeclarado,
                        porcentualSeguroDefecto:respuesta.data.PorcentualSeguroDefecto
                    }
                })
                setDataTipoDocumento(data)
            })
        })

    }

    function validarErrores(errores) {
        setErrores(errores)
    }

    async function getAllEmbarque() {
        //console.log(">>>>>>> getAllEmbarque");
        obtenerFechaInicio().then((respuestaUno) => {
            obtenerFechaFinal().then((respuestaDos) => {
                obtenerEmbarquesFiltro(respuestaUno.data[0].Fecha, respuestaDos.data[0].Fecha, 0, 0, 0, 0, 0, 0).then((respuesta) => {
                    //console.log(respuesta.data);
                    setData(respuesta.data);
                })
            })
        })
    }

    /*function getFormatosImpresion() {
        obtenerFormatosImpresion().then(respuesta => {
            setFormatosImpresion(respuesta.data)
        });
    };*/

    const getAllRemitentesDestinatarios = () => {
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
            // const filter
            setEstatusEmbarque(respuesta.data);
        });
    }

    async function getAllTipoCobro() {
        obtenerTipoCobro().then((respuesta) => {
            respuesta.data.forEach((i) => {
                i.valid = true
            })
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

    async function getAllTiposSeguro() {
        axios.get(`${localStorage.getItem("Back") ?? process.env.REACT_APP_REPORT_URL}/api/TipoSeguros/GetListado`, {headers}).then(({data}) => {
            setDataTiposSeguro(data)
        })
    }

    const headers = API_HEADERS

    function DefaultColumnFilter({column: {filterValue, preFilteredRows, setFilter},}) {
        const count = preFilteredRows.length;
        const [showResults, setShowResults] = React.useState(false);
        const onClick = () => setShowResults(!showResults);
        return (
            <div style={{display: "flex"}}>
                <a onClick={onClick}>
                    <i className="fa fa-search"/>
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

    function TableCodigoPostal({columns, data, select}) {
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

    /*const handleImprimir = () => {
        imprimirFormatosId(state.formatoSeleccionado).then((response) => {
            var file = new Blob([response.data], {type: 'application/pdf'})
            var fileURL = URL.createObjectURL(file)
            console.log(fileURL)
            window.open(fileURL);
        })

    }*/

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
            data.find((o) => o.m_nIdEmbarque == state.idEmbarque).m_sFolioGuia != null
        ) {
            showSuccess("Embarque ya tiene Guía");
            setRedirect(false)
        } else {
            return (
                <Redirect
                    push
                    to={{
                        pathname: "/Guia",
                        idEmbarque: state.idEmbarque,
                        dataTipoCambio: dataTipoCambio,
                        dataSucursal: dataSucursal,
                        dataTipoCobro: dataTipoCobro,
                        dataMoneda: dataTipoMoneda,
                        dataCiudades: dataCiudad,
                    }}
                />
            );
        }
    }

    const handleChangeCita = (data) => {
        setState(state => {
            return {
                ...state,
                fechaCita: data.fechaCita,
                horaCitaMinima: data.horaCitaMinima,
                horaCitaMaxima: data.horaCitaMaxima,
                citaPendiente: data.citaPendiente
            }
        })
    }

    const handleListPaquetesChange = (newList) => {
        setRepetirConceptos(true)
        setDataPaquetes(newList)
    }

    const handleListComplementosSATChange = (newList) => {
        setDataComplementosSAT(newList)
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
        setData(listado)
    }

    const actualizarConceptos = (list) => {
        setDataConceptos(list);
    }

    const saveIdCotizacion = (id) => {
        if (id) {
            setState(state => {
                return {
                    ...state,
                    idCotizacion: id
                }
            });
        }

    }

    const handleChangeRuta = (idRuta) => {
        setState(state => {
            return {
                ...state,
                idRuta: idRuta,
            }
        })
    }

    const handleChangeTipoSeguro = (event) => {
        setRepetirConceptos(true)
        setState(state => {
            return {
                ...state,
                idTipoSeguro: event.target.value,
                //porcentajeSeguro: (event.target.value === TIPOS_SEGURO.SEGUN_SOLICITA) || (event.target.value === TIPOS_SEGURO.OBLIGATORIO)?configuraciones.porcentualSeguroDefecto:0,
                porcentajeSeguro: !(seguroClienteActual.idTipoSeguro===event.target.value)?(event.target.value===TIPOS_SEGURO.SEGUN_SOLICITA || event.target.value===TIPOS_SEGURO.OBLIGATORIO)?((state.idTipoSeguro===TIPOS_SEGURO.SEGUN_SOLICITA || state.idTipoSeguro===TIPOS_SEGURO.OBLIGATORIO)  && (event.target.value===TIPOS_SEGURO.SEGUN_SOLICITA || event.target.value===TIPOS_SEGURO.OBLIGATORIO))?state.porcentajeSeguro:configuraciones.porcentualSeguroDefecto:0:seguroClienteActual.porcentajeSeguro,
                aplicaSeguro: (event.target.value === TIPOS_SEGURO.SEGUN_SOLICITA) || (event.target.value === TIPOS_SEGURO.OBLIGATORIO),
                valorDeclarado: 0
            }
        });
    }
    const generarGuia = (idEmbarque) => {

        if (dataConceptos.length === 0) {
            showSuccess("No se puede guardar una guia sin conceptos.");
            handleShowListado()
            return
        }
        let params = {
            "m_nTIpoCambio": state.tipoCambio,
            "m_sFolioGuia": state.folioGuia,
            "m_nIdEstatusGuia": 4,
            "m_nidTipoServicio": 2,
            "m_nIdEmbarque": idEmbarque,
            "m_nIdMoneda": state.moneda,

            "m_nCreadoPor": state.CreadoPor,
            "m_nModificadoPor": state.ModificadoPor,
            "m_nIdSucursal": state.idSucursalAgregar,
            "m_nValorDeclarado": state.valorDeclarado,
            // "idTipoServicio": state.idTipoServicio,
            "m_dFecha": getCurrentDateTime().substr(0, 10),
            "m_sHora": getCurrentDateTime().substr(getCurrentDateTime().length - 5),

            "arClsGuiaConceptos": dataConceptos.map(c => ({
                m_nIdConceptosFacturacion: c.idConcepto,
                m_cImporte: c.importe,
                m_nIdImpuestoTraslada: c.traslada,
                m_nIdImpuestoRetiene: c.retiene,
                m_cImporteRetiene: c.importeRet,
                m_cImporteIva: c.importeIVA,
                m_bActivo: true,
                m_cDescuento: c.descuento || 0
            })),

        }
        console.log(params)
        console.log(JSON.stringify(params))
        if (idEmbarque > 0) {

            validarRequiereDocumentoTimbrado(state.idSucursalAgregar).then(({data}) => {
                if (data.tieneDocumentoAsignado){
                    agregarGuia(params).then(respuesta => {
                        showSuccess(respuesta.data)
                        handleShowListado()
                    }).catch(err => {
                        console.log(err)
                        showSuccess(err.response?.data)
                        handleShowListado()
                    });
                }else{
                    setDialogTipoDocumento({
                        ...dialogTipoDocumento,
                        open: true,
                        seleccion: {
                            idSucursal: state.idSucursalAgregar,
                            sucursal: '',
                            idTipoDocumento: 0,
                            documento: 'SIN DEFINIR'
                        },
                    })
                }
            })
        } else {
            showSuccess("Hubo un problema al tratar de generar la guia.")
        }
    }

    function esEntregaSucursal(aplicaEntrega,idSucursalDestinatario) {
        if (aplicaEntrega) {
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
                getZonaOperativaByCodigoPostal(dataSucursal.find(c => c.m_nIdSucursal == idSucursalDestinatario).m_nIdCodigoPostal)
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
        } else {
            setState(state => {
                return {
                    ...state,
                    aplicaEntrega: aplicaEntrega,
                    entregaEnSucursal: false,
                    // deshabilitarDiferenteDomicilio:false
                }
            })
        }

    }

    const obtenerDatosDireccion = (esRecoleccion) => {
        let esDiferenteDomicilio = state.diferenteEntrega
        if (!esRecoleccion) {
            if (esDiferenteDomicilio) {
                return {
                    nombreLugar: destinatario.nombreDestinatario,
                    numeroInterior: '',
                    numeroExterior: '',
                    calle: entregaDD.domicilio,
                    colonia: '',
                    ciudad: entregaDD.municipio,
                    estado: entregaDD.estado,
                    pais: entregaDD.pais,
                    codigoPostal: entregaDD.codigoPostal?.m_sCP,
                    direccionCompleta: getAddressFormated(
                        entregaDD.domicilio,
                        null,
                        null,
                        null,
                        entregaDD.codigoPostal?.m_sCP,
                        entregaDD.municipio,
                        entregaDD.estado,
                        entregaDD.pais
                    )
                }
            } else {
                return {
                    nombreLugar: destinatario.nombreDestinatario,
                    numeroInterior: destinatario.numeroIntDestinatario,
                    numeroExterior: destinatario.numeroExtDestinatario,
                    calle: destinatario.calleDestinatario,
                    colonia: destinatario.coloniaDestinatario,
                    ciudad: destinatario.municipioTexto,
                    estado: destinatario.estadoTexto,
                    pais: destinatario.paisTexto,
                    codigoPostal: destinatario.codigoPostalDestinatario?.m_sCP,
                    direccionCompleta: getAddressFormated(
                        destinatario.calleDestinatario,
                        destinatario.numeroExtDestinatario,
                        destinatario.numeroIntDestinatario,
                        destinatario.coloniaDestinatario,
                        destinatario.codigoPostalDestinatario?.m_sCP,
                        destinatario.municipioTexto,
                        destinatario.estadoTexto,
                        destinatario.paisTexto
                    )
                }
            }
        }
    }

    const handleOnCloseDialogTipoDocumento = (data) => {
        try {
            asignarTipoDocumento(data).then((respuesta) => {
                showSuccess('Se guardó el documento por defecto.')
                setDialogTipoDocumento({
                    ...dialogTipoDocumento,
                    open: false,
                    seleccion: {
                        idSucursal: 0,
                        sucursal: '',
                        idTipoDocumento: 0,
                        documento: 'SIN DEFINIR'
                    }

                })
                generarGuia(state.idEmbarque)

            }).catch(e => {
                setDialogTipoDocumento({
                    ...dialogTipoDocumento,
                    open: false,
                    seleccion: {
                        idSucursal: 0,
                        sucursal: '',
                        idTipoDocumento: 0,
                        documento: 'SIN DEFINIR'
                    }

                })
                handleShowListado()
                showSuccess('Hubo un error al asignar el documento a la sucursal, intente de nuevo.')
            })
        }catch (e) {
            console.log(e)
            handleShowListado()
            showSuccess('Hubo un error al asignar el documento a la sucursal, intente de nuevo.')
        }

    }
    return (
        <div>
            {/*{*/}
            {/*    openDialog &&*/}
            {/*    <Dialog*/}
            {/*        open={openDialog}*/}
            {/*        onClose={() => setOpenDialog(false)}*/}
            {/*        fullWidth maxWidth="md"*/}
            {/*    >*/}
            {/*        <DialogTitle>*/}
            {/*            Reporte de Embarque*/}
            {/*        </DialogTitle>*/}
            {/*        <DialogContent>*/}
            {/*            <div className="row" style={{backgroundColor: '#FFFFFF'}}>*/}
            {/*                <form onSubmit={handleGenerarReporte}>*/}
            {/*                    <Grid container spacing={1}>*/}
            {/*                        <Grid item sm={6}>*/}
            {/*                            <FormControl*/}
            {/*                                className="input select"*/}
            {/*                                fullWidth variant="outlined"*/}
            {/*                                required*/}
            {/*                                size="small">*/}
            {/*                                <InputLabel*/}
            {/*                                    id="idReporteLabel">Formato de Reporte</InputLabel>*/}
            {/*                                <Select*/}
            {/*                                    fullWidth*/}
            {/*                                    labelId="idReporteLabel"*/}
            {/*                                    label="Reporte"*/}
            {/*                                    className="form-control"*/}
            {/*                                    value={state.reporteSeleccionado ?? ''}*/}
            {/*                                    onChange={(e) => handleOnChangeReporte(e.target.value)}*/}
            {/*                                    name="reporteSeleccionado"*/}
            {/*                                >*/}
            {/*                                    {dataReportes.map((reporte) => (*/}
            {/*                                        <MenuItem*/}
            {/*                                            key={reporte.m_nIdFormato}*/}
            {/*                                            value={reporte.m_nIdFormato}*/}
            {/*                                        >*/}
            {/*                                            {reporte.m_sFormato}*/}
            {/*                                        </MenuItem>*/}
            {/*                                    ))}*/}
            {/*                                </Select>*/}
            {/*                            </FormControl>*/}
            {/*                        </Grid>*/}
            {/*                    </Grid>*/}
            {/*                    <DialogActions>*/}

            {/*                        <button className="btn btn-secondary secondary-btn" onClick={() => {*/}
            {/*                            setOpenDialog(false)*/}
            {/*                            setState({*/}
            {/*                                ...state,*/}
            {/*                                reporteSeleccionado: null*/}
            {/*                            })*/}
            {/*                        }*/}
            {/*                        }>*/}
            {/*                            Cancelar*/}
            {/*                        </button>*/}
            {/*                        <button className="btn btn-primary primary-btn" color={"primary"} type={"submit"}>*/}
            {/*                            Aceptar*/}
            {/*                        </button>*/}
            {/*                    </DialogActions>*/}
            {/*                </form>*/}
            {/*            </div>*/}
            {/*        </DialogContent>*/}
            {/*    </Dialog>*/}
            {/*}*/}
            {
                state.showConfirmarUbicacion &&
                <ConfirmarUbicacion confirmarUbicacion={confirmarUbicacion} open={state.showConfirmarUbicacion}
                                    titulo={state.titulo}
                                    remitente={false}
                                    mostrarDialogoMapa={mostrarDialogoMapa}
                                    direccion={obtenerDatosDireccion(false)}
                />
            }


            <Dialog
                open={state.openDialog}
                onClose={() => setState({...state, openDialog: false})}
                fullWidth maxWidth="md"
            >
                <DialogContent>
                    {state.tipoModal === 0 && (
                        <div className="row" style={{backgroundColor: "#FFFFFF"}}>
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

                            {dataCodigosPostalesRemitente.length != 0 ? (
                                <TableCodigoPostal
                                    object={state}
                                    select={
                                        state[state.identificadorModal] &&
                                        state[state.identificadorModal].m_nIdCP
                                    }
                                    columns={columnsCP}
                                    data={dataCodigosPostalesRemitente}
                                    identificadorModal={state.identificadorModal}
                                />
                            ) : (
                                <div>No se encontró ningún registro</div>
                            )}

                            <DialogActions style={{justifyContent: "left"}}>
                                <button
                                    onClick={() => setState({...state, openDialog: false})}
                                    className="btn btn-secondary secondary-btn"
                                >
                                    Cerrar
                                </button>
                                <button
                                    onClick={() => setState({...state, openDialog: false})}
                                    className="btn btn-primary primary-btn"
                                >
                                    Aceptar
                                </button>
                            </DialogActions>
                        </div>
                    )}
                    {state.tipoModal === 7 && (
                        <div className="row" style={{backgroundColor: "#FFFFFF"}}>
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

                            {dataCodigosPostalesDestinatario.length != 0 ? (
                                <TableCodigoPostal
                                    object={state}
                                    select={
                                        state[state.identificadorModal] &&
                                        state[state.identificadorModal].m_nIdCP
                                    }
                                    columns={columnsCP}
                                    data={dataCodigosPostalesDestinatario}
                                    identificadorModal={state.identificadorModal}
                                />
                            ) : (
                                <div>No se encontró ningún registro</div>
                            )}

                            <DialogActions style={{justifyContent: "left"}}>
                                <button
                                    onClick={() => setState({...state, openDialog: false})}
                                    className="btn btn-secondary secondary-btn"
                                >
                                    Cerrar
                                </button>
                                <button
                                    onClick={() => setState({...state, openDialog: false})}
                                    className="btn btn-primary primary-btn"
                                >
                                    Aceptar
                                </button>
                            </DialogActions>
                        </div>
                    )}
                    {state.tipoModal === 9 && (
                        <div className="row" style={{backgroundColor: "#FFFFFF"}}>
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

                            {dataCodigosPostalesEntregaDD.length != 0 ? (
                                <TableCodigoPostal
                                    object={state}
                                    select={
                                        state[state.identificadorModal] &&
                                        state[state.identificadorModal].m_nIdCP
                                    }
                                    columns={columnsCP}
                                    data={dataCodigosPostalesEntregaDD}
                                    identificadorModal={state.identificadorModal}
                                />
                            ) : (
                                <div>No se encontró ningún registro</div>
                            )}

                            <DialogActions style={{justifyContent: "left"}}>
                                <button
                                    onClick={() => setState({...state, openDialog: false})}
                                    className="btn btn-secondary secondary-btn"
                                >
                                    Cerrar
                                </button>
                                <button
                                    onClick={() => setState({...state, openDialog: false})}
                                    className="btn btn-primary primary-btn"
                                >
                                    Aceptar
                                </button>
                            </DialogActions>
                        </div>
                    )}
                    {state.tipoModal === 1 && (
                        <div className="row" style={{backgroundColor: "#FFFFFF"}}>
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
                            <DialogActions style={{justifyContent: "left"}}>
                                <button
                                    onClick={() => setState({...state, openDialog: false})}
                                    className="btn btn-secondary secondary-btn"
                                >
                                    Cerrar
                                </button>
                                <button
                                    onClick={() => setState({...state, openDialog: false})}
                                    className="btn btn-primary primary-btn"
                                >
                                    Aceptar
                                </button>
                            </DialogActions>
                        </div>
                    )}
                    {state.tipoModal === 5 && (
                        <div className="row" style={{backgroundColor: "#FFFFFF"}}>
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
                            <DialogActions style={{justifyContent: "left"}}>
                                <button
                                    onClick={() => setState({...state, openDialog: false})}
                                    className="btn btn-secondary secondary-btn"
                                >
                                    Cerrar
                                </button>
                                <button
                                    onClick={() => setState({...state, openDialog: false})}
                                    className="btn btn-primary primary-btn"
                                >
                                    Aceptar
                                </button>
                            </DialogActions>
                        </div>
                    )}
                    {/*{state.tipoModal === 6 &&
                    <div className="row" style={{backgroundColor: '#FFFFFF'}}>
                        <DialogTitle style={{padding: "0px"}}><h4>Selecciona el Formato</h4></DialogTitle>
                        <div>
                            <label className="input select" style={{width: "100%"}}>
                                <FormControl fullWidth variant="outlined" size="small">
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
                                            <MenuItem
                                                key={formato.m_nIdFormato}
                                                value={formato.m_nIdFormato}
                                            >
                                                {formato.m_sFormato}
                                            </MenuItem>
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
                    }*/}

                    {state.tipoModal === 10 &&
                        <div className="row" style={{backgroundColor: '#FFFFFF'}}>
                            <DialogTableClientes dialogVisible={dialogVisible}
                                                 handlePatrocinadorSelected={handlePatrocinadorSelected}/>
                        </div>
                    }
                </DialogContent>
            </Dialog>
            <DialogTiposDocumentoSucursal open={dialogTipoDocumento.open} onClose={handleOnCloseDialogTipoDocumento} value={dialogTipoDocumento.seleccion}/>
            <header className="topbar clearfix">
                <Cabecera titulo="Embarque">
                    <div className="page-header">
                        <ul className="list-page-breadcrumb">
                            <li className="active-page">Embarque</li>
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
                        <li className={props.location.idRecoleccion != undefined ? "" : "active"}>

                            <a onClick={(event) => handleShowListado(event)}>
                                <i className="fa fa-list"/> Listado
                            </a>
                        </li>


                        <li className={props.location.idRecoleccion != undefined ? "active" : ""}>
                            <a className={validarDerecho(9101422) ? "" : classes.disabled}
                               onClick={() => $.ajax({
                                url:handleShowAgregar(),
                                success:function(){
                                   // monitorearCambios()
                                      }
                             })
                             }>
                                <i className="fa fa-plus-circle"/> {state.agregar}
                            </a>
                        </li>

                        <li>
                            <ExportCSV disabled={!validarDerecho(9101428)} csvData={data} fileName="Embarque_Listado"/>
                        </li>

                        <li>
                            <a
                                onClick={handleShowCancelar}
                                className={state.idEmbarque === 0 || !validarDerecho(9101427) ? classes.disabled : ""}
                            >
                                <i className="fa fa-times-circle"/> Cancelar
                            </a>
                        </li>

                        <li>
                            <a onClick={() => handleShowImportar()}>
                                <i className="fa fa-print"/> Importar
                            </a>
                        </li>

                        <li style={{float: "right"}}>
                        <Button className={ state.idEmbarque === 0 || (!validarDerecho(9101429) || state.estatusEmbarque == 21) ? classes.disabled :""}  fullWidth color={"primary"} variant={"contained"} onClick={() => setRedirect(true)} >
                                            Generar Guia
                                        </Button>

                        </li>
                        
                    </ul>

                    <div className="row tab-content">
                        <div id="Listado"
                             className={props.location.idRecoleccion != undefined ? "tab-pane fade" : "tab-pane fade in show"}>

                            <div className="widget-wrap">
                                <Filtros
                                    listaResultado={setDataListado}
                                    embarque={true}
                                />

                                <div className="row" style={{height: state.height - 250, width: "100%"}}>
                                    <DataGrid
                                        localeText={dataGridLocaleText}
                                        className={classes.root}
                                        rows={data}
                                        columns={columns}
                                        density="compact"
                                        pageSize={Math.floor((state.height - 310) / 30)}
                                        getRowId={(row) => row.m_nIdEmbarque}
                                        rowsPerPageOptions={[]}
                                        onRowSelectionModelChange={(newModel)=>{
                                            if(newModel.length<1)
                                                return
                                            let rowSelect=data.find(i=>i.m_nIdEmbarque==newModel[0])
                                            setState({
                                                ...state,
                                                idEmbarque: rowSelect.m_nIdEmbarque,
                                                estatusEmbarque: rowSelect.m_nIdEstatusEmbarque
                                            })
                                        }}
                                        /*onRowSelected={(row) => {
                                            setState({
                                                ...state,
                                                idEmbarque: row.data.m_nIdEmbarque,
                                                estatusEmbarque: row.data.m_nIdEstatusEmbarque
                                            });
                                        }}*/
                                    />
                                </div>
                            </div>
                        </div>

                        <div onClick={monitorearCambios} id="Agregar"
                             className={props.location.idRecoleccion != undefined ? "tab-pane fade in show" : "tab-pane fade"}>
{/*  */}
                            <form className="j-forms row" onSubmit={handleAceptar}  onKeyDown={e => {
                                if (e.code === 13) {
                                    e.preventDefault()
                                }
                            }}>
                                <div className="form-content">
                                    {/*<div
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
                                                        <Step key={s} completed={false}
                                                              onClick={() => openSection(index + 1)}>
                                                            <StepLabel>{s}</StepLabel>
                                                        </Step>
                                                    ))
                                                }
                                            </Stepper>

                                        </div>
                                    </div>*/}

                                    <div className="widget-wrap" id="informacionGeneral">
                                        <div className="widget-header">
                                            <h2>Información General</h2>
                                        </div>
                                        <div className="widget-container">
                                            <div className="widget-content">
                                                <div className="row">
                                                    <div className="col-sm-6 col-md-2-5 col-lg-2-5 unit">
                                                        <label className="input select">
                                                            <FormControl fullWidth variant="outlined"
                                                                         size="small">
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
                                                                    <MenuItem value="0">Todas</MenuItem>
                                                                    {dataSucursal.map((sucursal) => (
                                                                        <MenuItem
                                                                            key={sucursal.m_nIdSucursal}
                                                                            value={sucursal.m_nIdSucursal}
                                                                        >
                                                                            {sucursal.m_sSucursal}
                                                                        </MenuItem>
                                                                    ))}
                                                                </Select>
                                                            </FormControl>
                                                        </label>
                                                    </div>

                                                    <div className="col-sm-6 col-md-2-5 col-lg-2-5 unit">
                                                        <div className="input">
                                                            <TextField variant="outlined"
                                                                       label="Folio Recolección"
                                                                       fullWidth
                                                                       size="small"
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
                                                            <TextField variant="outlined" size="small"
                                                                       label={state.duplicar ? "Folio Relacionado" : "Folio Embarque"}
                                                                       onChange={handleChange}
                                                                       fullWidth
                                                                       className="form-control"
                                                                       type="text"
                                                                       value={state.folioEmbarque}
                                                                       name="folioEmbarque"
                                                                       InputLabelProps={{
                                                                           shrink: true,
                                                                       }}
                                                                       readOnly
                                                                       disabled
                                                            />
                                                        </div>
                                                    </div>

                                                    <div className="col-sm-6 col-md-2-5 col-lg-2-5 unit">
                                                        <div className="input">
                                                            <TextField variant="outlined" size="small"
                                                                       fullWidth
                                                                       label="Folio Guía"
                                                                       onChange={handleChange}
                                                                       className="form-control"
                                                                       type="text"
                                                                       value={state.folioGuia}
                                                                       name="folioGuia"
                                                                       readOnly
                                                                       disabled
                                                            />
                                                        </div>
                                                    </div>

                                                    <div className="col-sm-6 col-md-2-5 col-lg-2-5 unit">
                                                        <div className="input">
                                                            <TextField variant="outlined" size="small"
                                                                       fullWidth
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
                                                            <TextField variant="outlined" size="small"
                                                                       fullWidth
                                                                       label="Fecha / Hora"
                                                                       onChange={handleChange}
                                                                       required
                                                                       value={state.fechaHoraRegistro}
                                                                       className="form-control"
                                                                       name="fechaHoraRegistro"
                                                                       type="datetime-local"
                                                                       InputLabelProps={{
                                                                           shrink: true,
                                                                       }}
                                                                       disabled
                                                            />
                                                        </div>
                                                    </div>

                                                    <div className="col-sm-6 col-md-2-5 col-lg-2-5 unit">

                                                        <label className="input select">
                                                            <FormControl fullWidth variant="outlined"
                                                                         size="small">
                                                                <InputLabel id="idEstatusEmbarque">Estatus del
                                                                    Embarque</InputLabel>
                                                                <Select
                                                                    labelId={"idEstatusEmbarque"}
                                                                    label={"Estatus del Embarque"}
                                                                    className="form-control"
                                                                    required
                                                                    onChange={handleChange}
                                                                    value={state.estatusEmbarque}
                                                                    disabled={state.agregar === "Consultar" || state.embarqueConGuia}
                                                                    id="estatusEmbarque"
                                                                    inputProps={{
                                                                        name: "estatusEmbarque"
                                                                    }}
                                                                >
                                                                    {dataEstatusEmbarque.map((estatus) => (
                                                                        <MenuItem
                                                                            key={estatus.m_nIdEstatusEmbarque}
                                                                            value={estatus.m_nIdEstatusEmbarque}
                                                                        >
                                                                            {estatus.m_sEstatus}
                                                                        </MenuItem>
                                                                    ))}
                                                                </Select>
                                                            </FormControl>
                                                        </label>
                                                    </div>

                                                    <div className="col-sm-6 col-md-2-5 col-lg-2-5 unit">
                                                        <label className="input select">
                                                            <FormControl fullWidth variant="outlined"
                                                                         size="small">
                                                                <InputLabel id="idMonedaLabel">Moneda</InputLabel>
                                                                <Select
                                                                    labelId={"idMonedaLabel"}
                                                                    label={"Moneda"}
                                                                    className="form-control"
                                                                    required
                                                                    value={state.moneda}
                                                                    disabled={state.agregar === "Consultar" || state.embarqueConGuia}
                                                                    onChange={handleChange}
                                                                    id="moneda"
                                                                    name="moneda"
                                                                    InputProps={{
                                                                        name: "moneda"
                                                                    }}
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
                                                        </label>
                                                    </div>

                                                    <div className="col-sm-6 col-md-2-5 col-lg-2-5  unit">
                                                        <div className="input">
                                                            <FormControl fullWidth variant="outlined" required

                                                                         size="small">
                                                                <InputLabel id="tipoCambioLabel">Tipo de
                                                                    Cambio</InputLabel>
                                                                <Select
                                                                    labelId="tipoCambioLabel"
                                                                    label="Tipo de Cambio"
                                                                    className="form-control"
                                                                    value={state.tipoCambio}
                                                                    onChange={(event) => {
                                                                        event.preventDefault();
                                                                        setState({
                                                                            ...state,
                                                                            tipoCambio: event.target.value,
                                                                        });
                                                                    }}
                                                                    disabled={state.agregar === "Consultar" || state.embarqueConGuia}
                                                                    id="tipoCambio"
                                                                >
                                                                    <MenuItem value="0">Seleccionar</MenuItem>
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
                                                        </div>
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
                                                                    disabled={state.agregar === "Consultar" || state.embarqueConGuia}
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
                                                                    {dataTipoCobro.filter(item => configuraciones.idsTiposCobroSeleccionArray.find(i => i == item.m_nCodigo)).map((tipoCobro) => (
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

                                                    <Grid container spacing={2}
                                                          style={{marginBottom: '10px', paddingRight: '15px'}}>
                                                        <Grid item xs>
                                                            <div className="input">
                                                                <TextField
                                                                    variant="outlined"
                                                                    label="Responsable de pago"
                                                                    size="small"
                                                                    required
                                                                    disabled={state.agregar === "Consultar" || state.embarqueConGuia}
                                                                    value={state.clientePaga.m_sNombreFiscal}
                                                                    error={state.clientePaga.m_bCreditoVencido && !state.clientePaga.m_bSinCredito}
                                                                    helperText={(state.clientePaga.m_bCreditoVencido && !state.clientePaga.m_bSinCredito) ? "El cliente presenta saldo vencido. Días de crédito: " + state.clientePaga.m_nDiasCredito : ""}
                                                                    placeholder={"No. Cliente: Nombre fiscal"}
                                                                    InputLabelProps={{shrink: true}}
                                                                    onClick={(state.agregar === "Consultar" || state.embarqueConGuia) ?
                                                                        () => {
                                                                            return
                                                                        } : (() => {
                                                                            setState({
                                                                                ...state,
                                                                                openDialog: true,
                                                                                tipoModal: 10
                                                                            })
                                                                        })}
                                                                />
                                                            </div>
                                                        </Grid>
                                                        <Grid item xs>
                                                            <div className="input">
                                                                <TextField
                                                                    name="idTipoSeguro"
                                                                    select
                                                                    required
                                                                    label="Tipo seguro"
                                                                    value={state.idTipoSeguro}
                                                                    onChange={handleChangeTipoSeguro}
                                                                    variant="outlined"
                                                                    disabled={state.agregar === "Consultar" || state.embarqueConGuia}
                                                                >
                                                                    {dataTiposSeguro.map((option) => (
                                                                        <MenuItem key={option.m_nIdTipoSeguro}
                                                                                value={option.m_nIdTipoSeguro}>
                                                                            {option.m_sDescripcion}
                                                                        </MenuItem>
                                                                    ))}
                                                                </TextField>
                                                            </div>
                                                        </Grid>
                                                        <Grid item xs>
                                                            <div className="input">
                                                                <TextField variant="outlined" size="small"
                                                                           type="number"
                                                                           required
                                                                           disabled={state.agregar === "Consultar" || !state.aplicaSeguro || state.embarqueConGuia}
                                                                           label="Porcentaje de seguro"
                                                                           onChange={(e) => {
                                                                            const value = e.target.value;
                                                                            // Validar y permitir solo hasta 3 decimales
                                                                            if (/^\d*\.?\d{0,3}$/.test(value)) {
                                                                                // Si el valor es válido (número con hasta 3 decimales), permitir la entrada
                                                                                handleChange({ target: { name: e.target.name, value: value } });
                                                                            } else {
                                                                                // Si el valor tiene más de 3 decimales, formatearlo para que solo tenga 3
                                                                                const formattedValue = parseFloat(value).toFixed(3);
                                                                                handleChange({ target: { name: e.target.name, value: formattedValue } });
                                                                            }
                                                                        }}
                                                                           value={state.porcentajeSeguro}
                                                                           placeholder="%"
                                                                           name="porcentajeSeguro"
                                                                           id="porcentajeSeguro"
                                                                           InputProps={{
                                                                               endAdornment: <InputAdornment
                                                                                   position="start">%</InputAdornment>,
                                                                           }}
                                                                />
                                                            </div>
                                                        </Grid>
                                                        <Grid item xs>
                                                            <div className="input">
                                                                <TextField variant="outlined" size="small"
                                                                           type="number"
                                                                           required
                                                                           disabled={(state.agregar === "Consultar") || (configuraciones.fijarCapturaValorDeclarado ? false : !state.aplicaSeguro) || state.embarqueConGuia}
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
                                                                           InputProps={{
                                                                               startAdornment: <InputAdornment
                                                                                   position="start">$</InputAdornment>,
                                                                           }}
                                                                />
                                                            </div>
                                                        </Grid>
                                                        <Grid item xs>
                                                            <label className="input select">
                                                                <FormControl fullWidth variant="outlined"
                                                                             size="small" required>
                                                                    <InputLabel> Tipo de Tarifa</InputLabel>
                                                                    <Select
                                                                        label="Tipo de Tarifa"
                                                                        className="form-control"
                                                                        onChange={handleChange}
                                                                        name="idTipoTarifa"
                                                                        read="true"
                                                                        value={state.idTipoTarifa}
                                                                        disabled
                                                                    >
                                                                        <MenuItem value="0">Sin definir</MenuItem>
                                                                        <MenuItem value="1">Por peso o volumen</MenuItem>
                                                                        <MenuItem value="2">Por rango</MenuItem>
                                                                        <MenuItem value="3">Por región</MenuItem>
                                                                    </Select>
                                                                </FormControl>
                                                            </label>
                                                        </Grid>
                                                        <Grid item xs>
                                                            <label className="input select">
                                                                <StyledEngineProvider injectFirst>
                                                                    <ThemeProvider theme={theme}>
                                                                        <FormControlLabel
                                                                            control={
                                                                                <Switch
                                                                                    checked={state.validarTimbrado ?? false}
                                                                                    onChange={(e) => setState((v) => {
                                                                                        return ({
                                                                                            ...v,
                                                                                            validarTimbrado: e.target.checked
                                                                                        })
                                                                                    })}
                                                                                    disabled={!configuraciones.modificarValorEmbarque}
                                                                                    name="validarTimbrado"
                                                                                    color="primary"
                                                                                />
                                                                            }
                                                                            label="Validar timbrado de factura"
                                                                        />
                                                                    </ThemeProvider>
                                                                </StyledEngineProvider>
                                                            </label>
                                                        </Grid>
                                                        <Grid item xs>
                                                            <label className="input select">
                                                                <FormControl fullWidth variant="outlined"
                                                                             size="small" required>
                                                                    <InputLabel>Tipo de servicio</InputLabel>
                                                                    <Select
                                                                        label="Tipo de servicio"
                                                                        onChange={handleChange}
                                                                        name="tipoTimbrado"
                                                                        required
                                                                        value={state.tipoTimbrado || ""}
                                                                        disabled={state.agregar === "Consultar"}
                                                                    >
                                                                        <MenuItem key={"1"}
                                                                                value={1}
                                                                        >
                                                                            Consolidado
                                                                        </MenuItem>
                                                                        <MenuItem key={"2"}
                                                                                value={2}
                                                                        >
                                                                            Paquetería
                                                                        </MenuItem>
                                                                    </Select>
                                                                </FormControl>
                                                            </label>
                                                        </Grid>
                                                    </Grid>

                                                    <Grid container spacing={2}
                                                          style={{marginBottom: '10px', paddingRight: '15px'}}>
                                                        <Grid item xs={6}>
                                                            <TextField
                                                                variant="outlined"
                                                                label="Observaciones"
                                                                size="small"
                                                                type="text"
                                                                disabled={state.agregar === "Consultar" || state.recoleccionConEmbarque}
                                                                value={state.observaciones}
                                                                onChange={(event) => {
                                                                    event.preventDefault();
                                                                    setState({
                                                                        ...state,
                                                                        observaciones: event.target.value,
                                                                    });
                                                                }}
                                                                name="observaciones"
                                                                id="observaciones"
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
                                            disabled={state.agregar === "Consultar" || state.embarqueConGuia}
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
                                            disabled={state.agregar === "Consultar" || state.embarqueConGuia}
                                        />
                                    </div>

                                    <div className="row">
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
                                                                    componentePadre={"Embarque"}
                                                                    consulta={state.agregar === "Consultar" || state.embarqueConGuia}
                                                                    modificar={state.agregar === "Modificar"}
                                                                    agregar={state.agregar === "Agregar"}
                                                                    mostrarZonas={false}
                                                                    dataRemitenteDestinatario={dataRemitenteDestinatario}
                                                                    dataEstados={dataEstados}
                                                                    dataCiudad={dataCiudad}
                                                                    handleClickRemitenteDestinatario={handleClickRemitenteDestinatario}
                                                                    handleClickCiudad={handleClickCiudad}
                                                                    handleDataChange={handleChangeRemitente}
                                                                    dataPadreConsulta={dataEmbarqueConsulta}
                                                                    seCalculaTarifa={seCalculaTarifa}

                                                                />
                                                            }

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
                                                                    componentePadre={"Embarque"}
                                                                    consulta={state.agregar === "Consultar" || state.embarqueConGuia}
                                                                    modificar={state.agregar === "Modificar"}
                                                                    agregar={state.agregar === "Agregar"}
                                                                    mostrarZonas={!(state.diferenteEntrega || state.entregaEnSucursal)}
                                                                    dataRemitenteDestinatario={dataRemitenteDestinatario}
                                                                    dataEstados={dataEstados}
                                                                    dataCiudad={dataCiudad}
                                                                    handleClickRemitenteDestinatario={handleClickRemitenteDestinatario}
                                                                    handleClickCiudad={handleClickCiudad}
                                                                    handleDataChange={handleChangeDestinatario}
                                                                    dataPadreConsulta={dataEmbarqueConsulta}
                                                                    seCalculaTarifa={seCalculaTarifa}
                                                                    soloEntregaSucursal={esEntregaSucursal}
                                                                    entregaDomicilioDestinatario={!state.entregaEnSucursal && !state.diferenteEntrega}

                                                                />
                                                            }
                                                            <div className="row">
                                                                <div style={{width: '70%'}}>
                                                                    <div className="col-sm-6 col-md-6  unit">
                                                                        <label className="checkbox" style={state.aplicaEntrega?{color:'orange'}:{color:"black"}}>
                                                                            Entrega en Sucursal
                                                                            <input
                                                                                onChange={handleEntregaEnSucursalCheckbox}
                                                                                className="form-control"
                                                                                type="checkbox"
                                                                                checked={state.entregaEnSucursal}
                                                                                style={{height: "20px"}}
                                                                                disabled={state.agregar === "Consultar" || state.embarqueConGuia || state.aplicaEntrega /*|| state.deshabilitarDiferenteDomicilio*/}
                                                                                id="entregaEnSucursal"
                                                                            />
                                                                            <i/>{state.aplicaEntrega && <>
                                                                            <div style={{
                                                                                color: "red",
                                                                                zIndex: "100",
                                                                                marginLeft: "220px",
                                                                                width: "250px",
                                                                                marginTop: "-15px"
                                                                            }}>
                                                                                No se realizará entrega de última milla
                                                                            </div>
                                                                        </>}
                                                                        </label>
                                                                    </div>
                                                                </div>

                                                            </div>
                                                            <div className="row">
                                                                <div style={{width: '70%'}}>
                                                                    <div className="col-sm-6 col-md-6  unit">
                                                                        <label className="checkbox" style={state.aplicaEntrega?{color:'#ccc'}:{color:"black"}}>
                                                                            Entrega en Diferente Domicilio
                                                                            <input
                                                                                onChange={handleEntregaCheckboxChange}
                                                                                className="form-control"
                                                                                type="checkbox"
                                                                                checked={state.diferenteEntrega}
                                                                                value={state.diferenteEntrega}
                                                                                style={{height: "20px"}}
                                                                                disabled={state.agregar === "Consultar" || state.embarqueConGuia || state.aplicaEntrega/*|| state.deshabilitarDiferenteDomicilio*/}
                                                                                id="diferenteEntrega"
                                                                            />
                                                                            <i/>
                                                                        </label>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                            <div className="row">
                                                                <div style={{width: '70%'}}>
                                                                    <div className="col-sm-6 col-md-6  unit">
                                                                        <label className="checkbox" style={state.aplicaEntrega?{color:'#ccc'}:{color:"black"}}>
                                                                            Entrega con cita
                                                                            <input
                                                                                onChange={handleEntregaConCitaCheckbox}
                                                                                className="form-control"
                                                                                type="checkbox"
                                                                                checked={state.entregaConCita}
                                                                                value={state.entregaConCita}
                                                                                style={{height: "20px"}}
                                                                                disabled={state.agregar === "Consultar" || state.aplicaEntrega /*|| state.deshabilitarDiferenteDomicilio*/}
                                                                                id="entregaConCita"
                                                                            />
                                                                            <i/>
                                                                        </label>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                            {state.entregaEnSucursal ?

                                                <div className="row">
                                                    <Grid container spacing={1}>
                                                        <Grid item xs={12} sm={6}>
                                                            <label className="input select">
                                                                <FormControl fullWidth variant="outlined"
                                                                             size="small">
                                                                    <InputLabel id="idSucursalEntrega">Sucursal de
                                                                        Entrega</InputLabel>
                                                                    <Select
                                                                        labelId={"idSucursalEntrega"}
                                                                        label="Sucursal de Entrega"
                                                                        className="form-control"
                                                                        required={state.entregaEnSucursal}
                                                                        onChange={handleChangeSucursalEntrega}
                                                                        value={state.idSucursalEntrega}
                                                                        disabled={state.agregar === "Consultar" || state.embarqueConGuia}
                                                                        id="idSucursalEntrega"
                                                                        name="idSucursalEntrega"
                                                                        inputProps={{
                                                                            name: "idSucursalEntrega"
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

                                                :
                                                <div/>

                                            }

                                        </div>


                                    </div>

                                    <div className="row">
                                        <div className="widget-wrap">
                                            <div className="widget-header">
                                                <h2>Ruta</h2>
                                            </div>
                                            <SeleccionarRuta
                                                IdRuta={state.idRuta}
                                                IdOrigen={remitente.origenRemitente ? remitente.origenRemitente.m_nIdCiudad : ''}
                                                IdDestino={destinatario.destinoDestinatario ? destinatario.destinoDestinatario.m_nIdCiudad : ''}
                                                IdCliente={state.clientePaga.m_nIdCliente}
                                                disabled={state.agregar === "Consultar"}
                                                onChangeRuta={handleChangeRuta}
                                                EsConsulta={state.esConsultaRuta}
                                            />
                                        </div>
                                    </div>

                                    {/*<div className="row">

                                        {state.diferenteEntrega ? (
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
                                                                            size="small"
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
                                                                                disabled={state.agregar === "Consultar" || state.embarqueConGuia}
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
                                                                            size="small"
                                                                            required={state.diferenteEntrega}>
                                                                            <InputLabel id="idMunicipioLabel">Municipio</InputLabel>
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
                                                                                disabled={state.agregar === "Consultar" || state.embarqueConGuia}
                                                                                InputProps={{name: "municipioEnt"}}
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
                                                                                disabled={state.agregar === "Consultar" || state.embarqueConGuia}
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
                                                                                            size="small"
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
                                                                                onChange={(event, newValue) => handleChangeAutocompleteEntregaDD("zonaOperativaEnt",newValue)}
                                                                                id="zonaOperativaEnt"
                                                                                disableClearable
                                                                                forcePopupIcon={false}
                                                                                options={dataZonasOperativasEntregaDD}
                                                                                disabled={state.agregar === "Consultar" || state.embarqueConGuia}
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
                                                                                        size="small"
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
                                                                                value={entregaDD.zonaTarifaEnt}
                                                                                freeSolo
                                                                                id="zonaTarifaEnt"
                                                                                disableClearable
                                                                                onChange={(event, newValue) => handleChangeAutocompleteEntregaDD("zonaTarifaEnt",newValue)}
                                                                                forcePopupIcon={false}
                                                                                options={dataZonasTarifaEntregaDD}
                                                                                disabled={state.agregar === "Consultar" || state.embarqueConGuia}
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
                                                                                        size="small"
                                                                                        required
                                                                                        // onClick={handleClickZona}
                                                                                        {...params}
                                                                                    />
                                                                                }
                                                                            />
                                                                        </div>
                                                                    </div>}

                                                                    <div className="col-sm-6 col-md-4  unit">

                                                                        <div className="input">
                                                                            <TextField variant="outlined"
                                                                                       size="small"
                                                                                       onChange={handleChangeEntregaDD}
                                                                                       className="form-control"
                                                                                       type="text"
                                                                                       label="Calle y número"
                                                                                       value={entregaDD.domicilioEnt}
                                                                                       disabled={state.agregar === "Consultar" || state.embarqueConGuia}
                                                                                       id="domicilioEnt"
                                                                                       name="domicilioEnt"
                                                                                       required={state.diferenteEntrega}
                                                                            />
                                                                        </div>
                                                                    </div>
                                                                    <div className="col-sm-6 col-md-4  unit">
                                                                        <div className="input">
                                                                            <TextField variant="outlined"
                                                                                       size="small"
                                                                                       onChange={handleChangeEntregaDD}
                                                                                       className="form-control"
                                                                                       type="text"
                                                                                       label="Entregar En"
                                                                                       value={entregaDD.entregarEnEnt}
                                                                                       disabled={state.agregar === "Consultar" || state.embarqueConGuia}
                                                                                       id="entregarEnEnt"
                                                                                       name="entregarEnEnt"
                                                                                       required={state.diferenteEntrega}
                                                                            />
                                                                        </div>
                                                                    </div>
                                                                    <div className="col-sm-6 col-md-4  unit">
                                                                        <div className="input">
                                                                            <TextField variant="outlined"
                                                                                       size="small"
                                                                                       onChange={handleChangeEntregaDD}
                                                                                       className="form-control"
                                                                                       type="text"
                                                                                       label="Datos Adicionales para la Entrega"
                                                                                       value={entregaDD.datosAdicionalesEnt}
                                                                                       disabled={state.agregar === "Consultar" || state.embarqueConGuia}
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
                                        ) : (
                                            <div/>
                                        )}
                                    </div>*/}
                                    <div className="row">

                                        {state.diferenteEntrega ? (
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
                                        ) : (
                                            <div/>
                                        )}
                                    </div>

                                    <div className="row">
                                        {state.entregaConCita &&
                                            <div className="widget-wrap" id="citaEntrega">
                                                <Citas titulo={"Programar cita de la Entrega"}
                                                       onDataChange={handleChangeCita}
                                                       dataPadreConsulta={dataEmbarqueConsulta}
                                                       embarque={true}
                                                       disabled={state.agregar === "Consultar"}
                                                       required={state.entregaConCita}
                                                />
                                            </div>
                                        }
                                    </div>

                                    <div className="row">
                                        <Cotizador embarque={state}
                                                   disabled={state.agregar === "Consultar"}
                                                   remitente={remitente}
                                                   destinatario={destinatario}
                                                   recoleccionDiferenteDom={recoleccionDD}
                                                   entregaDiferenteDom={entregaDD}
                                                   onChangeConceptosList={actualizarConceptos}
                                                   conceptos={dataConceptos}
                                                   recoleccion={false}
                                                   errores={errores}
                                                   validarErrores={validarErrores}
                                                   mostrarCotizadorRec={mostrarCotizadorRec}
                                                   saveIdCotizacion={saveIdCotizacion}
                                                   setCalculoTarifa={() => setRepetirConceptos(false)}
                                                   paquetes={dataPaquetes.map(p => ({
                                                       Tipo: p.m_nIdTipo,
                                                       Peso: p.m_rPeso,
                                                       Largo: p.m_rLargo,
                                                       Ancho: p.m_rAncho,
                                                       Alto: p.m_rAlto,
                                                       Volumen: p.m_rVolumen,
                                                       IdTipoEmpaque: p.m_nIdTipoEmbalaje,
                                                       Activo: 1,
                                                       ctd: p.m_nCantidad,
                                                       IdProducto: p.m_nIdProducto
                                                   }))}/>
                                    </div>

                                    {/*<div className="row">
                                        <Button fullWidth color={"primary"} variant={"contained"} onClick={() => generarGuia()} >
                                            Generar Guia
                                        </Button>
                                    </div>*/}

                                </div>
                                <div className="form-footer ol-md-12">
                                    <Grid container spacing={1}>
                                        <Grid item xs>
                                            <Button fullWidth color={"secondary"} variant={"contained"}
                                                    onClick={(event) => {
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
                                                    color={"primary"}
                                                    variant={"contained"}
                                                    type="submit"
                                                    disabled={state.agregar === "Consultar"}>
                                                Guardar embarque
                                            </Button>
                                        </Grid>
                                    </Grid>
                                    {/*<button
                                        type="submit"
                                        className="btn btn-primary primary-btn"
                                        disabled={state.agregar === "Consultar"}
                                        onClick={handleAceptar}
                                    >
                                        Guardar Embarque
                                    </button>
                                    <button
                                        type="button"
                                        onClick={(event) => {
                                            event.stopPropagation();
                                            setState({...state, agregar: "Agregar"});
                                            $('.nav-tabs li ').removeClass('active');
                                            $('.nav-tabs li').eq(0).addClass('active');
                                            $('.tab-content div ').removeClass('in show');
                                            $('#Listado').addClass('in show');
                                        }}
                                        className="btn btn-secondary secondary-btn"
                                    >
                                        Cancelar
                                    </button>*/}

                                </div>
                            </form>
                        </div>

                        <div id="Cancelar" className="tab-pane fade">
                            <div className="widget-wrap">
                                <div className="widget-container">
                                    <div className="widget-content">
                                        <form className="j-forms"  onSubmit={handleCancelar} onKeyDown={e => {
                                            if (e.code === 13) {
                                                e.preventDefault()
                                            }
                                        }} >
                                            <div className="form-content">
                                                <div className="col-sm-6 col-md-2-5 col-lg-2-5 unit">
                                                    <div className="input">
                                                        <TextField variant="outlined" size="small"
                                                                   label="Folio Embarque"
                                                                   onChange={handleChange}
                                                                   className="form-control"
                                                                   type="text"
                                                                   fullWidth
                                                                   value={state.folioEmbarque}
                                                                   name="folioEmbarque"
                                                                   disabled
                                                        />
                                                    </div>
                                                </div>

                                                <div className="col-sm-6 col-md-2-5 col-lg-2-5 unit">
                                                    <div className="input">
                                                        <TextField variant="outlined" size="small"
                                                                   label="Sucursal"
                                                                   onChange={handleChange}
                                                                   className="form-control"
                                                                   type="text"
                                                                   fullWidth
                                                                   value={state.sucursalCancelacion}
                                                                   name="sucursalCancelacion"
                                                                   disabled
                                                        />
                                                    </div>
                                                </div>

                                                <div className="col-sm-6 col-md-2-5 col-lg-2-5 unit">
                                                    <div className="input">
                                                        <TextField variant="outlined" size="small" label="Fecha"
                                                                   onChange={handleChange}
                                                                   className="form-control"
                                                                   type="datetime-local"
                                                                   fullWidth
                                                                   value={state.fechaCancelacion}
                                                                   name="fechaCancelacion"
                                                                   disabled
                                                        />
                                                    </div>
                                                </div>

                                                <div className="col-sm-6 col-md-2-5 col-lg-2-5 unit">
                                                    <div className="input">
                                                        <TextField variant="outlined" size="small" label="Usuario"
                                                                   onChange={handleChange}
                                                                   className="form-control"
                                                                   type="text"
                                                                   fullWidth
                                                                   value={state.usuario}
                                                                   name="usuario"
                                                                   disabled
                                                        />
                                                    </div>
                                                </div>

                                                <div className="col-sm-6 col-md-2-5 col-lg-2-5 unit">
                                                    <div className="input">
                                                        <TextField variant="outlined" size="small" label="Estatus"
                                                                   onChange={handleChange}
                                                                   className="form-control"
                                                                   type="text"
                                                                   fullWidth
                                                                   value={state.estatusEmbarque}
                                                                   name="estatusEmbarque"
                                                                   disabled
                                                        />
                                                    </div>
                                                </div>

                                                <div className="col-sm-12 col-md-12 col-lg-12 unit">
                                                    <div className="input">
                                                        <TextField variant="outlined" size="small" label="Motivo"
                                                                   onChange={handleChange}
                                                                   fullWidth
                                                                   className="form-control"
                                                                   type="text"
                                                                   value={state.motivoCancelacion}
                                                                   name="motivoCancelacion"
                                                                   required
                                                                   disabled={!state.sePuedeCancelar}
                                                        />
                                                    </div>
                                                </div>

                                                <div className="form-footer col-md-12">
                                                    <Grid container spacing={2}>
                                                        <Grid item xs>
                                                            <Button type={"submit"}
                                                                    className="btn btn-primary primary-btn"
                                                                    fullWidth
                                                                    disabled={!state.sePuedeCancelar}
                                                            >
                                                                Guardar cambios
                                                            </Button>
                                                        </Grid>
                                                    </Grid>

                                                </div>
                                            </div>
                                        </form>

                                    </div>
                                </div>
                            </div>
                        </div>

                        <div id="Importar" className="tab-pane fade">
                            <ImportarEmbarques
                                // mostrarListado={handleShowListado}
                            />
                        </div>
                    </div>
                </div>
            </section>
            {/*Page Container End Here*/}

            {/*Rightbar Start Here*/}
            <aside className="rightbar">
                <BarraLateralDerecha/>
            </aside>
        </div>
    );
}

export default Embarque;
