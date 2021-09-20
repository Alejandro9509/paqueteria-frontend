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
import {makeStyles} from "@material-ui/core/styles";
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
import {remove_array_element} from "../Util/Util";
import IconButton from "@material-ui/core/IconButton";
import PageviewIcon from "@material-ui/icons/Pageview";
import Autocomplete from "@material-ui/lab/Autocomplete";
import TextField from "@material-ui/core/TextField";
import useModal from "react-hooks-use-modal";
import {useHistory, Redirect} from "react-router-dom";
import {DataGrid} from "@material-ui/data-grid";
import SvgIcon from "@material-ui/core/SvgIcon";
import {ReactComponent as Activo} from "../iconos/Menu/palomita.svg";
import {ReactComponent as NoActivo} from "../iconos/Menu/cruz.svg";
import Noty from "noty";
import {
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    Grid,
    Step,
    StepLabel,
    Stepper,
    Tooltip
} from "@material-ui/core";
import {ToggleButtonGroup} from "@material-ui/lab";
import FormControl from "@material-ui/core/FormControl";
import InputLabel from "@material-ui/core/InputLabel";
import Select from "@material-ui/core/Select";
import {dataGridLocaleText} from "../Constants";
import {confirmAlert} from 'react-confirm-alert'; // Import
import 'react-confirm-alert/src/react-confirm-alert.css'; // Import css
import {obtenerCiudades, obtenerCiudadId} from "../Util/Contexts/CiudadesContext";
import {
    obtenerCodigoPostal,
    obtenerCodigoPostalId,
    obtenerCodigosPostalesPorCiudad
} from "../Util/Contexts/CodigoPostalContext";
import {
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
    obtenerEmbarques
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
import {imprimirFormatosId, obtenerFormatosImpresion} from "../Util/Contexts/FormatosImpresionContext";
import {obtenerCliente, obtenerClienteId} from "../Util/Contexts/ClientesContext";
import {obtenerProductoById} from "../Util/Contexts/ProductosContext";
import {obtenerZonasById} from "../Util/Contexts/ZonasContext";
import AddBoxIcon from "@material-ui/icons/AddBox";
import DeleteIcon from "@material-ui/icons/Delete";
import ConfirmarUbicacion from "../Components/Map/ConfirmarUbicacion";

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
    childrenElement: () => <div/>,
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

const styles = {
    paqueteCarrusel: {
        height: "280px !important",
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
    const [dataCodigosPostalesRemitente, setDataCodigosPostalesRemitente] = React.useState([]);
    const [dataCodigosPostalesDestinatario, setDataCodigosPostalesDestinatario] = React.useState([]);
    const [dataCodigosPostalesEntrega, setDataCodigosPostalesEntrega] = React.useState([]);
    const [dataOperador, setDataOperador] = React.useState([]);
    const [dataTipoUnidad, setDataTipoUnidad] = React.useState([]);
    const [dataUnidad, setDataUnidad] = React.useState([]);
    const [dataZona, setDataZona] = React.useState([]);

    const [dataEmbalaje, setDataEmbalaje] = React.useState([]);
    const [dataFolioEmbarque, SetDataFolioEmbarque] = React.useState([]);
    const [dataFormatos, setFormatosImpresion] = React.useState([]);
    const [dataRemitenteDestinatario, setDataRemitenteDestinatario,] = React.useState([]);
    const [state, setState] = React.useState({
        //==VARIABLES DE LISTADO==
        idEmbarque: 0,
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

        //==VARIABLES DE AGREGAR
        //Informacion general
        idSucursalAgregar: localStorage.getItem("Sucursal"),
        folioRecoleccion: '',
        folioEmbarque: '',
        folioGuia: '',
        folioInforme: '',
        fechaHoraRegistro: '',
        estatusEmbarque: '',
        moneda: '',
        tipoCambio: '',
        tipoCobro: '',
        clientePaga: {},

        //Remitente
        idRemitente: '',
        aliasRemitente: '',
        nombreRemitente: '',
        RFCRemitente: '',
        domicilioRemitente: '',
        ciudadRemitente: '',
        codigoPostalRemitente: '',
        correoRemitente: '',
        telefonoRemitente: '',
        contactoRemitente: '',
        ciudadOrigen: '',
        zonaRemitente: {},
        calleRemitente: '',
        numeroIntRemitente: '0',
        numeroExtRemitente: '',
        coloniaRemitente: '',

        //Destinatario
        idDestinatario: '',
        aliasDestinatario: '',
        nombreDestinatario: '',
        RFCDestinatario: '',
        domicilioDestinatario: '',
        ciudadDestinatario: '',
        codigoPostalDestinatario: '',
        correoDestinatario: '',
        telefonoDestinatario: '',
        contactoDestinatario: '',
        ciudadDestino: '',
        zonaDestinatario: {},
        calleDestinatario: '',
        numeroIntDestinatario: '0',
        numeroExtDestinatario: '',
        coloniaDestinatario: '',

        //Entrega
        entregaEnSucursal: false,
        idSucursalEntrega: '',
        diferenteEntrega: false,
        ciudadEntrega: '',
        codigoPostalEntrega: '',
        zonaEntrega: '',
        domicilioEntrega: '',
        entregaEn: '',
        datosAdicionalesEntrega: '',

        //Cita de recoleccion
        entregaConCita: false,
        fechaCita: '',
        horaCitaMinima: '',
        horaCitaMaxima: '',

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

        DerechoBorrar: 139,
        identificadorModal: "",
        tipoModal: 0,
        openDialog: false,
        agregar: "Agregar",
        fechaHoraCreacion: today.getDate() + "/" + (today.getMonth() + 1) + "/" + today.getFullYear() + " " + today.getHours() + ":" + today.getMinutes(),
        CreadoPor: localStorage.getItem("UsuarioId"),
        ModificadoPor: localStorage.getItem("UsuarioId"),
        height: window.innerHeight,

    });
    const [dataClientes, setDataClientes] = useState([])
    const [stepActive, setStepActive] = React.useState(1);
    const [Modal, open, close, isOpen] = useModal("root", {
        preventScroll: true,
    });

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
    const columns = React.useMemo(() => [
        {
            headerName: "Acciones",
            sortable: false, filterable: false, width: 120,
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
                                    style={{color: "#F9A03E"}}
                                />
                            </a>
                        </Tooltip>
                        <Tooltip title="Consultar">
                            <a
                                className="btn btn-default btn-xs"
                                onClick={() => handleShowConsultar(row.row.m_nIdEmbarque)}
                            >
                                <i className="fa fa-eye" style={{color: "#F9A03E"}}/>
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
                                <i className="zmdi zmdi-delete" style={{color: "#F30B0B"}}/>
                            </a>
                        </Tooltip>
                        <Tooltip title="Duplicar">
                            <a
                                className="btn btn-default btn-xs"
                                onClick={() => handleShowDuplicarConsultar(row.row.m_nIdEmbarque)}
                            >
                                <i className="fa fa-copy" style={{color: "#F9A03E"}}/>
                            </a>
                        </Tooltip>

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
            headerName: "Estatus de la Orden",
            field: "m_sEstatusEmbarque",
            width: 200,
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
            headerName: "Folio",
            field: "m_nFolioEmbarque",
            width: 125,
        },
        {
            headerName: "Folio Relacionado",
            field: "m_sFolioEmbarqueRelacionado",
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
    const columnsPaquetes = React.useMemo(() => [
        {
            headerName: "Tipo",
            field: "m_sTipo",
            minWidth: 100,
            width: 100,
        },
        {
            headerName: "Producto",
            field: "m_sProducto",
            flex: 1,
        },
        {
            headerName: "Peso",
            field: "m_xPeso",
            width: 100,
        },
        {
            headerName: "Largo",
            field: "m_xLargo",
            width: 100,
        },
        {
            headerName: "Ancho",
            field: "m_xAncho",
            width: 100,
        },
        {
            headerName: "Alto",
            field: "m_xAlto",
            width: 100,
        },
        {
            headerName: "Volumen",
            field: "m_xVolumen",
            width: 100,
        },
        {
            headerName: "Embalaje",
            field: "m_sTipoEmbalaje",
            flex: 1,
        },
        {
            headerName: "Valor",
            field: "m_cValorDeclarado",
            width: 100,
        },
        {
            headerName: "Descripcion",
            field: "m_sDescripcion",
            flex: 1,
        },
        {
            headerName: "Cantidad",
            field: "ctd",
            width: 100,
        },
        {
            headerName: "Observaciones",
            field: "m_sObservaciones",
            flex: 1,
        }
    ]);
    const [dataProductos, setDataProductos] = useState([])
    const [totalPaquetes, setTotalPaquetes] = useState(0)
    const [paquete, setPaquete] = useState({
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
        m_sTipo: "Paquete",
        m_sObservaciones: "",
        m_nIdProducto: '',
    })

    const history = useHistory();

    function handleSelectRemitente(newValue) {
        console.log(newValue)
        let user = newValue
        obtenerCodigoPostalId(newValue.m_nIdCP).then(respuesta => {
            setState(state => {
                return {
                    ...state,
                    idRemitente: newValue.m_nIdRemitenteDestinatario,
                    aliasRemitente: newValue.m_sAlias,
                    nombreRemitente: user,
                    RFCRemitente: user.m_sRFC,
                    domicilioRemitente: user.m_sDomicilio,
                    codigoPostalRemitente: respuesta.data,
                    ciudadRemitente: respuesta.data.m_nIdCiudad,
                    correoRemitente: user.m_sCorreoElectronico,
                    telefonoRemitente: user.m_sTelefono,
                    contactoRemitente: user.m_sContacto,
                    calleRemitente: newValue.m_sCalle,
                    numeroExtRemitente: newValue.m_sNoExterior,
                    numeroIntRemitente: newValue.m_sNoInterior || 0,
                    coloniaRemitente: newValue.m_sColonia,
                    remitente: newValue,
                    latitudR: newValue.m_sLatitud,
                    longitudR: newValue.m_sLongitud

                }
            });
        })

    }

    function handleSelectDestinatario(newValue) {
        obtenerCodigoPostalId(newValue.m_nIdCP).then(respuesta => {
            setState(state => {
                return {
                    ...state,
                    idDestinatario: newValue.m_nIdRemitenteDestinatario,
                    aliasDestinatario: newValue.m_sAlias,
                    nombreDestinatario: newValue,
                    RFCDestinatario: newValue.m_sRFC,
                    domicilioDestinatario: newValue.m_sDomicilio,
                    codigoPostalDestinatario: respuesta.data,
                    ciudadDestinatario: respuesta.data.m_nIdCiudad,
                    correoDestinatario: newValue.m_sCorreoElectronico,
                    telefonoDestinatario: newValue.m_sTelefono,
                    contactoDestinatario: newValue.m_sContacto,
                    calleDestinatario: newValue.m_sCalle,
                    numeroExtDestinatario: newValue.m_sNoExterior,
                    numeroIntDestinatario: newValue.m_sNoInterior || 0,
                    coloniaDestinatario: newValue.m_sColonia,
                    destinatario: newValue,
                    latitudD: newValue.m_sLatitud,
                    longitudD: newValue.m_sLongitud
                }
            });
        })

    }

    const handleClickRemitenteDestinatario = (event) => {
        event.preventDefault()
        if (dataRemitenteDestinatario.length === 0) {
            getAllRemitentesDestinatarios()
        }
    }

    const validarPaquetes = (paquete) => {
        if (paquete.m_nTipo == 1) {
            return !!(paquete.m_sDescripcion != '');
        } else {
            return !!(paquete.m_xPeso != ''
                && paquete.m_xLargo != ''
                && paquete.m_xAncho != ''
                && paquete.m_xAlto != ''
                && paquete.m_sDescripcion != ''
                && paquete.ctd != ''
                && paquete.producto
                && paquete.m_nIdTIpoEmpaque);
        }
    }

    const validarSobre = (sobre) => {
        if (sobre.m_sDescripcion != '') {
            return true
        } else {
            return false
        }
    }

    function confirmarUbicacion(coordenadas, e) {
        handleAceptar(e, coordenadas)
    }

    const handleAceptar = (e, coordenadas) => {
        e.preventDefault();
        setState({
            ...state,
            showConfirmarUbicacion: false
        })
        const {paquetes, sobres} = state;

        if (paquetes.length === 0) {
            showSuccess("Debe agregar al menos un paquete")
            return
        }
        if (!state.entregaEnSucursal) {
            if (state.latitudD.length === 0 && state.longitudD.length === 0 && !coordenadas) {
                setState({
                    ...state,
                    showConfirmarUbicacion: true,
                    titulo: "entrega"
                })
                return
            }
        }
        const params = {
            m_nIdEmbarque: state.idEmbarque,
            m_nIdRecoleccion: props.location.idRecoleccion,
            IdSucursal: state.idSucursalAgregar,
            m_nFolioEmbarque: state.folioEmbarque,
            m_nFolioGuia: state.folioGuia,
            m_nIdEmbarqueRelacionado: state.idEmbarqueRelacionado,
            m_nFolioInforme: state.folioInforme,
            m_dFechaRegistro: state.fechaHoraRegistro.split("T")[0],
            m_tHoraRegistro: state.fechaHoraRegistro.split("T")[1],
            m_nIdEstatusEmbarque: state.estatusEmbarque,
            m_nIdMoneda: state.moneda,
            m_cTIpoCambio: state.tipoCambio,
            m_nIdTIpoCobro: state.tipoCobro,
            m_dFecha: state.fechaHoraCreacion.split("T")[0],
            m_tHora: state.fechaHoraCreacion.split("T")[1],
            m_nIdCliente: state.clientePaga.m_nIdCliente,

            m_sNOmbreRemitente: state.nombreRemitente.m_sNombre,
            m_sRFCRemitente: state.RFCRemitente,
            m_sDomicilioRemitente: state.domicilioRemitente,
            m_nIdCodigoPostalRemitente: state.codigoPostalRemitente.m_nIdCP,
            m_nCiudadRemitente: state.ciudadRemitente,
            m_sCorreoRemitente: state.correoRemitente,
            m_sTelefonoRemitente: state.telefonoRemitente,
            m_sContactoRemitente: state.contactoRemitente,
            m_nIdCiudadOrigen: state.ciudadOrigen.m_nIdCiudad,
            m_nIdZonaRemitente: state.zonaRemitente.m_nIdZona,
            m_nIdRemitente: state.idRemitente,
            m_sAliasRemitente: state.aliasRemitente,
            m_sCalleRemitente: state.calleRemitente,
            m_sNoIntRemitente: state.numeroIntRemitente,
            m_sNoExtRemitente: state.numeroExtRemitente,
            m_sColoniaRemitente: state.coloniaRemitente,

            m_sNombreDestinatario: state.nombreDestinatario.m_sNombre,
            m_sRFCDestinatario: state.RFCDestinatario,
            m_sDomicilioDestinatario: state.domicilioDestinatario,
            m_nIdCodigoPostalDestinatario: state.codigoPostalDestinatario.m_nIdCP,
            m_nIdCIudadDestinatario: state.ciudadDestinatario,
            m_sCorreoDestinatario: state.correoDestinatario,
            m_sTelefonoDestinatario: state.telefonoDestinatario,
            m_sContactoDestinatario: state.contactoDestinatario,
            m_nIdCiudadDestino: state.ciudadDestino.m_nIdCiudad,
            m_nIdZonaDestinatario: state.zonaDestinatario.m_nIdZona,
            m_nIdDestinatario: state.idDestinatario,
            m_sAliasDestinatario: state.aliasDestinatario,
            m_sCalleDestinatario: state.calleDestinatario,
            m_sNoIntDestinatario: state.numeroIntDestinatario,
            m_sNoExtDestinatario: state.numeroExtDestinatario,
            m_sColoniaDestinatario: state.coloniaDestinatario,
            m_sLatitudD: coordenadas ? coordenadas.lat : state.latitudD,
            m_sLongitudD: coordenadas ? coordenadas.lng : state.latitudD,
            m_sLatitudR: state.latitudR,
            m_sLongitudR: state.latitudR,

            m_nNoPaquetes: state.paquetes.length,
            m_nNoSobres: state.sobres.length,
            m_arrClsDetalle: state.paquetes,
            // m_dFechaSalida: state.fechaHoraSalida.split("T")[0],
            // m_tHoraSalida: state.fechaHoraSalida.split("T")[1],
            // FechaLlegada: state.fechaHoraLlegada.split("T")[0],
            // HoraLlegada: state.fechaHoraLlegada.split("T")[1],
            CreadoPor: state.CreadoPor,
            ModificadoPor: state.ModificadoPor,
            m_bEntregaEnSucursal: state.entregaEnSucursal,

            IdCiudadEntrega: state.ciudadDestinatario,
            CodigoPostalEntrega: state.codigoPostalDestinatario.m_nIdCP,
            DomicilioEntrega: state.domicilioDestinatario,
            EntregarMismoDomicilio: !state.diferenteEntrega,
            //Cita de recoleccion
            m_bEmbarqueConCita: state.entregaConCita,
        }

        if (state.entregaEnSucursal) {
            params.m_nIdSucursalEntrega = state.idSucursalEntrega
            params.EntregarMismoDomicilio = false
        }
        if (state.diferenteEntrega) {
            params.m_bEntregaEnSucursal = false
            params.IdCiudadEntrega = state.ciudadEntrega
            params.CodigoPostalEntrega = state.codigoPostalEntrega.m_nIdCP
            params.IdZonaEntrega = state.zonaEntrega
            params.DomicilioEntrega = state.domicilioEntrega
            params.EntregarEn = state.entregaEn
            params.DatosAdicionales = state.datosAdicionalesEntrega
        }
        if (state.entregaConCita) {

            params.m_sFechaCita = state.fechaCita
            params.m_sHoraCitaMinima = state.horaCitaMinima
            params.m_sHoraCitaMaxima = state.horaCitaMaxima
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
        if (state.identificadorModal == "nombreRemitente") {
            setState({
                ...state,
                [state.identificadorModal]: id,
                RFCRemitente: id.m_sRFC,
                domicilioRemitente: id.m_sDomicilio,

                /*codigoPostalRemitente: dataCodigoPostal.find(
                    (o) => o.m_nIdCP == id.m_nIdCP
                ),*/

                ciudadRemitente: dataCiudad.find(
                    (o) => o.m_nIdCiudad == dataCodigosPostalesRemitente.find((o) => o.m_nIdCP == id.m_nIdCP).m_nIdCiudad
                ),

                correoRemitente: id.m_sCorreoElectronico,
                telefonoRemitente: id.m_sTelefono,
                contactoRemitente: id.m_sContacto,
            });
        } else {
            setState({
                ...state,
                [state.identificadorModal]: id,
                RFCDestinatario: id.m_sRFC,
                domicilioDestinatario: id.m_sDomicilio,

                /*codigoPostalDestinatario: dataCodigosPostalesDestinatario.find(
                    (o) => o.m_nIdCP == id.m_nIdCP
                ),*/

                ciudadDestinatario: dataCiudad.find(
                    (o) => o.m_nIdCiudad ==
                        dataCodigosPostalesDestinatario.find((o) => o.m_nIdCP == id.m_nIdCP).m_nIdCiudad
                ),

                correoDestinatario: id.m_sCorreoElectronico,
                telefonoDestinatario: id.m_sTelefono,
                contactoDestinatario: id.m_sContacto,
            });
        }

        console.log(id);
        console.log(state.identificadorModal);
    }

    function getTipoCambio() {
        obtenerTipoCambio().then(respuesta => {
            setDataTipoCambio(respuesta.data)
        });
    }

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

    //Funcion para cancelar un embarque. Se usa en tab cancelar.
    const handleCancelar = (e) => {
        e.preventDefault();

        let params = {
            motivoCancelacion: state.motivoCancelacion,
            usuarioCancelacion: localStorage.getItem("UsuarioId"),
            fechaCancelacion: state.fechaCancelacion,
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

    useEffect((value) => {
        if (props.location.idRecoleccion != undefined) {
            if (dataRemitenteDestinatario.length > 0 && dataCiudad.length > 0 && dataClientes.length > 0) {
                obtenerRecoleccionId(props.location.idRecoleccion)
                    .then((respuesta) => {
                        console.log('Recoleccion: ', respuesta.data);
                        setDataRecoleccionOnState(respuesta)
                    })
            }
        }


    }, [dataRemitenteDestinatario, dataCiudad, dataClientes]);

    //Se checa si se entró a embarque por una recoleccion
    useEffect(async (value) => {
        if (props.location.idRecoleccion === undefined) {
            getDataParaListado()
        } else {
            // getDataParaEditar()
            obtenerRecoleccionId(props.location.idRecoleccion)
                .then((respuesta) => {
                    console.log('Recoleccion: ', respuesta.data);
                    setDataRecoleccionOnState(respuesta)
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
            if (state.tipoCobro == 3 || state.tipoCobro == 5) {
                showSuccess("No se puede hacer cobro en origen ni destino cuando es entrega en sucursal, elige otra opción.")
                setState(state => {
                    return {
                        ...state,
                        tipoCobro: 0
                    }
                })
            }
            dataTipoCobro.forEach((i) => {
                i.valid = !(i.m_nIdTipoCobro == 3 || i.m_nIdTipoCobro == 5);
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

    function handleShowCancelar() {
        var today = new Date();
        var hours = today.getHours();
        var minutes = today.getMinutes();
        var ampm = hours >= 12 ? "pm" : "am";
        hours = hours % 12;
        hours = hours ? hours : 12; // the hour '0' should be '12'
        minutes = minutes < 10 ? "0" + minutes : minutes;
        var strTime = hours + ":" + minutes + " " + ampm;
        $('.nav-tabs li ').removeClass('active');
        $('.nav-tabs li').eq(4).addClass('active');
        $('.tab-content div ').removeClass('in show');
        $('#Cancelar').addClass('in show');

        obtenerEmbarqueCancelado(state).then((respuesta) => {
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
            }
        });
    }

    //Limpia todos los campos. Se usa al pasar del listado a consultar o modificar un registro
    function limpiarCamposAgregar() {
        setState(state => {
            return {
                ...state,
                //==VARIABLES DE AGREGAR
                //Informacion general
                folioRecoleccion: '',
                folioEmbarque: '',
                folioGuia: '',
                folioInforme: '',
                tipoCambio: '',
                tipoCobro: '',
                clientePaga: {m_nNumeroCliente: 'No. Cliente', m_sNombreFiscal: 'Nombre fiscal'},
                idEmbarque: 0,
                idSucursalAgregar: localStorage.getItem("Sucursal"),
                fechaHoraRegistro: `${new Date().getFullYear()}-${`${new Date().getMonth() +
                1}`.padStart(2, 0)}-${`${new Date().getDate() + 1}`.padStart(2, 0)}T${`${new Date().getHours()}`.padStart(2, 0)}:${`${new Date().getMinutes()}`.padStart(2, 0)}`,
                moneda: 1,
                estatusEmbarque: 16,

                //Remitente
                nombreRemitente: {m_sNombre: "Nombre", m_sAlias: "Alias"},
                RFCRemitente: '',
                domicilioRemitente: '',
                ciudadRemitente: '',
                codigoPostalRemitente: '',
                correoRemitente: '',
                telefonoRemitente: '',
                contactoRemitente: '',
                ciudadOrigen: '',
                zonaRemitente: {},
                idRemitente: '',
                aliasRemitente: '',
                calleRemitente: '',
                numeroIntRemitente: '0',
                numeroExtRemitente: '',
                coloniaRemitente: '',

                //Destinatario
                nombreDestinatario: {m_sNombre: "Nombre", m_sAlias: "Alias"},
                RFCDestinatario: '',
                domicilioDestinatario: '',
                ciudadDestinatario: '',
                codigoPostalDestinatario: '',
                correoDestinatario: '',
                telefonoDestinatario: '',
                contactoDestinatario: '',
                ciudadDestino: '',
                zonaDestinatario: {},
                idDestinatario: '',
                aliasDestinatario: '',
                calleDestinatario: '',
                numeroIntDestinatario: '0',
                numeroExtDestinatario: '',
                coloniaDestinatario: '',

                //Entrega
                entregaEnSucursal: false,
                diferenteEntrega: false,
                idSucursalEntrega: '',
                ciudadEntrega: '',
                codigoPostalEntrega: '',
                zonaEntrega: '',
                domicilioEntrega: '',
                entregaEn: '',
                datosAdicionalesEntrega: '',

                //Cita de recoleccion
                entregaConCita: false,
                fechaCita: '',
                horaCitaMinima: '',
                horaCitaMaxima: '',

                //Paquetes/sobres
                paquetes: [
                    /*{
                        m_xPeso: "",
                        m_xLargo: "",
                        m_xAncho: "",
                        m_xAlto: "",
                        m_xVolumen: "",
                        m_nIdTIpoEmpaque: "",
                        m_cValorDeclarado: "",
                        m_sDescripcion: "",
                        m_nCantidad: "",
                        m_nTipo: 2,
                        m_sObservaciones: "",
                        m_nIdProducto:'',
                        producto: ''
                    },*/
                ],
                sobres: [
                    {
                        m_nTipo: 1,
                        m_sDescripcion: "",
                    },
                ],
                countSobres: 1,
                countPaquetes: 1,
                height: window.innerHeight,
            }
        })
    }

    //===TABS NAVEGACION===

    function handleShowConsultar(id) {
        $('.nav-tabs li ').removeClass('active');
        $('.nav-tabs li').eq(1).addClass('active');
        $('.tab-content div ').removeClass('in show');
        $('#Agregar').addClass('in show');
        limpiarCamposAgregar()
        obtenerEmbarquesId(id).then((respuesta) => {
            console.log('Embarque: ', respuesta)
            setState({
                ...state,
                agregar: "Consultar",
            });
            setDataParaConsultarModificar(respuesta, false)

        });
    }

    function handleShowDuplicarConsultar(id) {
        $('.nav-tabs li ').removeClass('active');
        $('.nav-tabs li').eq(1).addClass('active');
        $('.tab-content div ').removeClass('in show');
        $('#Agregar').addClass('in show');
        limpiarCamposAgregar()
        obtenerEmbarquesId(id).then((respuesta) => {
            console.log('Embarque: ', respuesta)
            setState({
                ...state,
                agregar: "Agregar",
            });
            setDataParaConsultarModificar(respuesta, true)

        });
    }

    function handleShowAgregar() {
        let today = new Date();
        limpiarCamposAgregar()
        getDataParaEditar()
        setState(state => {
            return {
                ...state,
                agregar: "Agregar",
            }
        });
        $('.nav-tabs li ').removeClass('active');
        $('.nav-tabs li').eq(1).addClass('active');
        $('.tab-content div ').removeClass('in show');
        $('#Agregar').addClass('in show');

    }

    function handleShowModificar(id) {
        $('.nav-tabs li ').removeClass('active');
        $('.nav-tabs li').eq(1).addClass('active');
        $('.tab-content div ').removeClass('in show');
        $('#Agregar').addClass('in show');
        limpiarCamposAgregar()
        obtenerEmbarquesId(id).then((respuesta) => {
            setState({
                ...state,
                agregar: "Modificar",
            });
            setDataParaConsultarModificar(respuesta, false)
        });
    }

    //Funcion para mostrar datos de recoleccion para crear embarque
    function setDataRecoleccionOnState(respuesta) {

        getAllTipoMoneda()
        getAllTipoCobro()
        getTipoCambio()
        getAllZonas()
        getAllEmbalajes()
        getAllCiudades()
        getAllSucursales()
        getAllEstatusEmbarque()

        const {m_parrPaquetes, m_parrSobres} = respuesta.data;
        let totalPaquetes = 0
        m_parrSobres.forEach(sobre => {
            m_parrPaquetes.push(sobre)
        })
        m_parrPaquetes.forEach(paq => {
            paq.m_nIdEmbarqueDetalle = paq.m_nIdPaquete
            paq["m_nTipo"] = paq.m_nIdTipo;
            paq["m_xPeso"] = paq.m_rPeso;
            paq["m_xLargo"] = paq.m_rLargo;
            paq["m_xAncho"] = paq.m_rAncho;
            paq["m_xAlto"] = paq.m_rAlto;
            paq["m_xVolumen"] = paq.m_rVolumen;
            paq["m_nIdTIpoEmpaque"] = paq.m_nIdTipoEmbalaje;
            paq["m_cValorDeclarado"] = paq.m_cyValorDeclarado;
            paq.ctd = paq.m_nCantidad
            obtenerProductoById(paq.m_nIdProducto).then(({data}) => {
                paq.producto = data
                paq.m_sProducto = data.m_sDescripcion
                totalPaquetes += parseInt(paq.ctd)
            })
            obtenerEmbalajesId(paq.m_nIdTipoEmbalaje).then(({data}) => {
                paq.m_sTipoEmbalaje = data.m_sNombre
            })
            paq.m_sTipo = paq.m_nTipo == 1 ? 'Sobre' : 'Paquete'
        })
        m_parrSobres.forEach(sobre => {
            sobre["m_nTipo"] = 1
        })

        obtenerClienteId(respuesta.data.m_nIdCliente).then(({data}) => {
            setState(state => {
                return {
                    ...state,
                    clientePaga: data
                }
            })
        })

        obtenerRemitentesDestinatariosId(respuesta.data.m_nIdRemitente).then(({data}) => {
            setState(state => {
                return {
                    ...state,
                    nombreRemitente: data
                }
            })
            obtenerCodigoPostalId(data.m_nIdCP).then((cp) => {
                setState(state => {
                    return {
                        ...state,
                        codigoPostalDestinatario: cp.data
                    }
                })
            })
        })
        obtenerRemitentesDestinatariosId(respuesta.data.m_nIdDestinatario).then(({data}) => {
            setState(state => {
                return {
                    ...state,
                    nombreDestinatario: data
                }
            })
            obtenerCodigoPostalId(data.m_nIdCP).then((cp) => {
                setState(state => {
                    return {
                        ...state,
                        codigoPostalRemitente: cp.data
                    }
                })
            })
        })

        obtenerCiudadId(respuesta.data.m_nIdCiudadOrigen).then(({data}) => {
            setState(state => {
                return {
                    ...state,
                    ciudadOrigen: data
                }
            })
        })

        obtenerCiudadId(respuesta.data.m_nIdCiudadDestino).then(({data}) => {
            setState(state => {
                return {
                    ...state,
                    ciudadDestino: data
                }
            })
        })

        obtenerZonasById(respuesta.data.m_nIdZonaRemitente).then(({data}) => {
            setState(state => {
                return {
                    ...state,
                    zonaRemitente: data
                }
            })
        })

        obtenerZonasById(respuesta.data.m_nIdZonaDestinatario).then(({data}) => {
            setState(state => {
                return {
                    ...state,
                    zonaDestinatario: data
                }
            })
        })

        setState(state => {
            return {
                ...state,
                fechaHoraRegistro: `${new Date().getFullYear()}-${`${new Date().getMonth() +
                1}`.padStart(2, 0)}-${`${new Date().getDate() + 1}`.padStart(
                    2,
                    0
                )}T${`${new Date().getHours()}`.padStart(
                    2,
                    0
                )}:${`${new Date().getMinutes()}`.padStart(2, 0)}`,
                idSucursalAgregar: localStorage.getItem("Sucursal"),
                folioRecoleccion: respuesta.data.m_sFolioRecoleccion,
                folioEmbarque: respuesta.data.m_nFolioEmbarque,
                fechaHoraCreacion: today.getDate() + "/" + (today.getMonth() + 1) + "/" + today.getFullYear() + " " + today.getHours() + ":" + today.getMinutes(),
                moneda: respuesta.data.m_nMoneda,
                tipoCambio: respuesta.data.m_rTipoCambio,
                tipoCobro: respuesta.data.m_nIdTipoDeCobro,
                clientePaga: dataClientes.find((c) => c.m_nIdCliente == respuesta.data.m_nIdCliente),

                // nombreRemitente: remitente,
                RFCRemitente: respuesta.data.m_sRFCRemitente,
                domicilioRemitente: respuesta.data.m_sDomicilioRemitente,
                ciudadRemitente: respuesta.data.m_nIdCiudadRemitente,
                correoRemitente: respuesta.data.m_sCorreoRemitente,
                telefonoRemitente: respuesta.data.m_sTelefonoRemitente,
                contactoRemitente: respuesta.data.m_sContactoRemitente,
                // ciudadOrigen: dataCiudad.find((o) => o.m_nIdCiudad == respuesta.data.m_nIdCiudadOrigen),
                idRemitente: respuesta.data.m_nIdRemitente,
                aliasRemitente: respuesta.data.m_sAliasRemitente,
                calleRemitente: respuesta.data.m_sCalleRemitente,
                numeroIntRemitente: respuesta.data.m_sNoIntRemitente || 0,
                numeroExtRemitente: respuesta.data.m_sNoExtRemitente,
                coloniaRemitente: respuesta.data.m_sColoniaRemitente,

                // nombreDestinatario: destinatario,
                RFCDestinatario: respuesta.data.m_sRFCDestinatario,
                domicilioDestinatario: respuesta.data.m_sDomicilioDestinatario,
                ciudadDestinatario: respuesta.data.m_nIdCiudadDestinatario,
                correoDestinatario: respuesta.data.m_sCorreoDestinatario,
                telefonoDestinatario: respuesta.data.m_sTelefonoDestinatario,
                contactoDestinatario: respuesta.data.m_sContactoDestinatario,
                idDestinatario: respuesta.data.m_nIdDestinatario,
                aliasDestinatario: respuesta.data.m_sAliasDestinatario,
                calleDestinatario: respuesta.data.m_sCalleDestinatario,
                numeroIntDestinatario: respuesta.data.m_sNoIntDestinatario || 0,
                numeroExtDestinatario: respuesta.data.m_sNoExtDestinatario,
                coloniaDestinatario: respuesta.data.m_sColoniaDestinatario,

                // ciudadDestino: dataCiudad.find((o) => o.m_nIdCiudad == respuesta.data.m_nIdCiudadDestino),
                // zonaRemitente: dataZona.find((z) => z.m_nIdZona == respuesta.data.m_nIdZonaRemitente),
                // zonaDestinatario: dataZona.find((z) => z.m_nIdZona == respuesta.data.m_nIdZonaDestinatario),

                paquetes: m_parrPaquetes,
                // sobres: m_parrSobres,

                //Datos entrega
                diferenteEntrega: false,
                zonaEntrega: '',
                domicilioEntrega: '',
                entregaEn: '',
                datosAdicionalesEntrega: '',
                codigoPostalEntrega: '',
                ciudadEntrega: '',
            }
        });

        if (respuesta.data.m_bEntregaDiferenteDomicilio) {
            obtenerCodigoPostalId(respuesta.data.m_nIdCPDetalleEntrega).then(cp => {
                setState(state => {
                    return {
                        ...state,
                        diferenteEntrega: true,
                        zonaEntrega: respuesta.data.m_nIdZonaDetalleEntrega,
                        domicilioEntrega: respuesta.data.m_sDomicilioDetalleEntrega,
                        entregaEn: respuesta.data.m_sEntregarEnDetalleEntrega,
                        datosAdicionalesEntrega: respuesta.data.m_sDatosAdicionalesDetalleEntrega,
                        // fechaEntrega: respuesta.data.m_dFechaEntrega + "T" + respuesta.data.m_tHoraEntrega,
                        codigoPostalEntrega: cp.data,
                        ciudadEntrega: respuesta.data.m_nIdCiudadDetalleEntrega,
                    }
                })
            })
        }
    }

    //Funcion para mostrar datos de embarque para consultar o modificar
    const setDataParaConsultarModificar = (respuesta, duplicar) => {

        getDataParaEditar()
        getAllZonas()
        getAllEmbalajes()
        getAllCiudades()

        obtenerRemitentesDestinatariosId(respuesta.data.m_nIdRemitente).then(({data}) => {
            setState(state => {
                return {
                    ...state,
                    nombreRemitente: data
                }
            })
            obtenerCodigoPostalId(data.m_nIdCP).then((cp) => {
                setState(state => {
                    return {
                        ...state,
                        codigoPostalRemitente: cp.data
                    }
                })
            })
        })
        obtenerRemitentesDestinatariosId(respuesta.data.m_nIdDestinatario).then(({data}) => {
            setState(state => {
                return {
                    ...state,
                    nombreDestinatario: data
                }
            })
            obtenerCodigoPostalId(data.m_nIdCP).then((cp) => {
                setState(state => {
                    return {
                        ...state,
                        codigoPostalDestinatario: cp.data
                    }
                })
            })
        })
        obtenerCodigoPostalId(respuesta.data.CodigoPostalEntrega).then((cp) => {
            setState(state => {
                return {
                    ...state,
                    codigoPostalEntrega: cp.data
                }
            })
        })

        let totalPaquetes = 0
        respuesta.data.m_arrSobres.forEach((s) => {
            respuesta.data.m_arrPaquetes.push(s)
        })

        respuesta.data.m_arrPaquetes.forEach(p => {
            obtenerProductoById(p.m_nIdProducto).then(({data}) => {
                p.producto = data
                totalPaquetes += parseInt(p.ctd)
            })
            obtenerEmbalajesId(p.m_nIdTIpoEmpaque).then(({data}) => {
                p.m_sTipoEmbalaje = data.m_sNombre
                p.m_sTipo = p.m_nTipo == 1 ? 'Sobre' : 'Paquete'
            })
        })
        setTotalPaquetes(totalPaquetes)

        obtenerClienteId(respuesta.data.m_nIdCliente).then(({data}) => {
            setState(state => {
                return {
                    ...state,
                    clientePaga: data
                }
            })
        })

        obtenerCiudadId(respuesta.data.m_nIdCiudadOrigen).then(({data}) => {
            setState(state => {
                return {
                    ...state,
                    ciudadOrigen: data
                }
            })
        })

        obtenerCiudadId(respuesta.data.m_nIdCiudadDestino).then(({data}) => {
            setState(state => {
                return {
                    ...state,
                    ciudadDestino: data
                }
            })
        })

        obtenerZonasById(respuesta.data.m_nIdZonaRemitente).then(({data}) => {
            setState(state => {
                return {
                    ...state,
                    zonaRemitente: data
                }
            })
        })

        obtenerZonasById(respuesta.data.m_nIdZonaDestinatario).then(({data}) => {
            setState(state => {
                return {
                    ...state,
                    zonaDestinatario: data
                }
            })
        })

        setState(state => {
            return {
                ...state,
                idEmbarque: duplicar ? 0 : respuesta.data.m_nIdEmbarque,
                idEmbarqueRelacionado: duplicar ? respuesta.data.m_nIdEmbarque : 0,
                idRecoleccion: duplicar ? 0 : respuesta.data.m_nIdRecoleccion,
                idSucursalAgregar: respuesta.data.IdSucursal,
                folioRecoleccion: duplicar ? "" : respuesta.data.m_sFolioRecoleccion,
                folioEmbarque: respuesta.data.m_nFolioEmbarque,
                folioGuia: duplicar ? "" : respuesta.data.m_sFolioGuia,
                folioInforme: duplicar ? "" : respuesta.data.m_nFolioInforme,
                fechaHoraRegistro: respuesta.data.m_dFechaRegistro + "T" + respuesta.data.m_tHoraRegistro.slice(0, 5),
                estatusEmbarque: duplicar ? 16 : respuesta.data.m_nIdEstatusEmbarque,
                moneda: respuesta.data.m_nIdMoneda,
                tipoCambio: respuesta.data.m_cTIpoCambio,
                tipoCobro: respuesta.data.m_nIdTIpoCobro,
                // clientePaga: dataClientes.find((c) => c.m_nIdCliente == respuesta.data.m_nIdCliente),
                duplicar: duplicar,
                //Remitente
                // nombreRemitente: remitente,
                RFCRemitente: respuesta.data.m_sRFCRemitente,
                domicilioRemitente: respuesta.data.m_sDomicilioRemitente,
                ciudadRemitente: respuesta.data.m_nCiudadRemitente,
                correoRemitente: respuesta.data.m_sCorreoRemitente,
                telefonoRemitente: respuesta.data.m_sTelefonoRemitente,
                contactoRemitente: respuesta.data.m_sContactoRemitente,
                // ciudadOrigen: dataCiudad.find((o) => o.m_nIdCiudad == respuesta.data.m_nIdCiudadOrigen),
                // zonaRemitente: dataZona.find((z) => z.m_nIdZona == respuesta.data.m_nIdZonaRemitente),
                idRemitente: respuesta.data.m_nIdRemitente,
                aliasRemitente: respuesta.data.m_sAliasRemitente,
                calleRemitente: respuesta.data.m_sCalleRemitente,
                numeroIntRemitente: respuesta.data.m_sNoIntRemitente || 0,
                numeroExtRemitente: respuesta.data.m_sNoExtRemitente,
                coloniaRemitente: respuesta.data.m_sColoniaRemitente,

                //Destinatario
                // nombreDestinatario: destinatario,
                RFCDestinatario: respuesta.data.m_sRFCDestinatario,
                domicilioDestinatario: respuesta.data.m_sDomicilioDestinatario,
                ciudadDestinatario: respuesta.data.m_nIdCIudadDestinatario,
                correoDestinatario: respuesta.data.m_sCorreoDestinatario,
                telefonoDestinatario: respuesta.data.m_sTelefonoDestinatario,
                contactoDestinatario: respuesta.data.m_sContactoDestinatario,
                // ciudadDestino: dataCiudad.find((o) => o.m_nIdCiudad == respuesta.data.m_nIdCiudadDestino),
                // zonaDestinatario: dataZona.find((z) => z.m_nIdZona == respuesta.data.m_nIdZonaDestinatario),
                idDestinatario: respuesta.data.m_nIdDestinatario,
                aliasDestinatario: respuesta.data.m_sAliasDestinatario,
                calleDestinatario: respuesta.data.m_sCalleDestinatario,
                numeroIntDestinatario: respuesta.data.m_sNoIntDestinatario || 0,
                numeroExtDestinatario: respuesta.data.m_sNoExtDestinatario,
                coloniaDestinatario: respuesta.data.m_sColoniaDestinatario,

                //Entrega
                entregaEnSucursal: false,
                idSucursalEntrega: respuesta.data.m_nIdSucursalEntrega,
                diferenteEntrega: !respuesta.data.EntregarMismoDomicilio,
                ciudadEntrega: respuesta.data.IdCiudadEntrega,
                zonaEntrega: respuesta.data.IdZonaEntrega,
                domicilioEntrega: respuesta.data.DomicilioEntrega,
                entregaEn: respuesta.data.EntregarEn,
                datosAdicionalesEntrega: respuesta.data.DatosAdicionalesis,

                //Cita de recoleccion
                entregaConCita: respuesta.data.m_bEmbarqueConCita,
                fechaCita: respuesta.data.m_sFechaCita,
                horaCitaMinima: respuesta.data.m_sHoraCitaMinima,
                horaCitaMaxima: respuesta.data.m_sHoraCitaMaxima,

                //Paquetes/sobres
                paquetes: respuesta.data.m_arrPaquetes,
                sobres: respuesta.data.m_arrSobres,
                countPaquetes: respuesta.data.m_nNoPaquetes,
                countSobres: respuesta.data.m_nNoSobres,
                fechaHoraCreacion: today.getDate() + "/" + (today.getMonth() + 1) + "/" + today.getFullYear() + " " + today.getHours() + ":" + today.getMinutes(),
            }
        });

        //si el cp de entrega es igual al de destinatario significa que no es entrega en diferente domicilio
        if (respuesta.data.m_nIdCPDetalleEntrega != respuesta.data.m_sIdCodigoPostalDestinatario) {
            obtenerCodigoPostalId(respuesta.data.m_nIdCPDetalleEntrega).then(cp => {
                setState(state => {
                    return {
                        ...state,
                        diferenteEntrega: true,
                        zonaEntrega: respuesta.data.m_nIdZonaDetalleEntrega,
                        domicilioEntrega: respuesta.data.m_sDomicilioDetalleEntrega,
                        entregaEn: respuesta.data.m_sEntregarEnDetalleEntrega,
                        datosAdicionalesEntrega: respuesta.data.m_sDatosAdicionalesDetalleEntrega,
                        // fechaEntrega: respuesta.data.m_dFechaEntrega + "T" + respuesta.data.m_tHoraEntrega,
                        codigoPostalEntrega: cp.data,
                        ciudadEntrega: respuesta.data.m_nIdCiudadDetalleEntrega,
                    }
                })
            })
        }
    }

    const handleShowListado = (event) => {
        event.stopPropagation();
        limpiarCamposAgregar()
        setState(state => {
            return {
                ...state,
                agregar: "Agregar",
            }
        });
        getAllEmbarque();
        $('.nav-tabs li ').removeClass('active');
        $('.nav-tabs li').eq(0).addClass('active');
        $('.tab-content div ').removeClass('in show');
        $('#Listado').addClass('in show');
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
        setState({
            ...state,
            [event.target.name]: event.target.value,
            codigoPostalEntrega: dataSucursal.find(c => c.m_nIdSucursal == event.target.value).m_nIdCodigoPostal

        });
    };

    const handleEntregaCheckboxChange = (event) => {
        setState({
            ...state,
            diferenteEntrega: !state.diferenteEntrega,
            entregaEnSucursal: !state.diferenteEntrega && false
        });
    };

    const handleEntregaEnSucursalCheckbox = (event) => {
        setState({
            ...state,
            entregaEnSucursal: !state.entregaEnSucursal,
            diferenteEntrega: !state.entregaEnSucursal && false,
            entregaConCita: !state.entregaEnSucursal && false
        });
    };

    const handleEntregaConCitaCheckbox = (event) => {
        setState({
            ...state,
            entregaEnSucursal: !state.entregaConCita && false,
            entregaConCita: !state.entregaConCita
        });
    };

    const handleCodigoPostalRemitenteClick = (event) => {
        event.preventDefault();
        if (dataCodigosPostalesRemitente.length > 0) {
            if (dataCodigosPostalesRemitente[0].m_nIdCiudad != state.ciudadRemitente) {
                obtenerCodigosPostalesPorCiudad(state.ciudadRemitente).then((respuesta) => {
                    setDataCodigosPostalesRemitente(respuesta.data);
                });
            }
        } else {
            obtenerCodigosPostalesPorCiudad(state.ciudadRemitente).then((respuesta) => {
                setDataCodigosPostalesRemitente(respuesta.data);
            });
        }

    }

    const handleCodigoPostalDestinatarioClick = (event) => {
        event.preventDefault();
        if (dataCodigosPostalesDestinatario.length > 0) {
            if (dataCodigosPostalesDestinatario[0].m_nIdCiudad != state.ciudadDestinatario) {
                obtenerCodigosPostalesPorCiudad(state.ciudadDestinatario).then((respuesta) => {
                    setDataCodigosPostalesDestinatario(respuesta.data);
                });
            }
        } else {
            obtenerCodigosPostalesPorCiudad(state.ciudadDestinatario).then((respuesta) => {
                setDataCodigosPostalesDestinatario(respuesta.data);
            });
        }
    }

    const handleCodigoPostalEntregaClick = (event) => {
        event.preventDefault();
        if (dataCodigosPostalesEntrega.length > 0) {
            if (dataCodigosPostalesEntrega[0].m_nIdCiudad != state.ciudadEntrega) {
                obtenerCodigosPostalesPorCiudad(state.ciudadEntrega).then((respuesta) => {
                    setDataCodigosPostalesEntrega(respuesta.data);
                });
            }
        } else {
            obtenerCodigosPostalesPorCiudad(state.ciudadEntrega).then((respuesta) => {
                setDataCodigosPostalesEntrega(respuesta.data);
            });
        }
    }

    const handleChangeCiudadRemitente = (event) => {
        event.preventDefault();
        setState({
            ...state,
            ciudadRemitente: event.target.value,
        });
    }

    const handleClickCiudad = (event) => {
        event.preventDefault()
        if (dataCiudad.length === 0) {
            getAllCiudades()
        }
    }

    const handleChangeCiudadDestinatario = (event) => {
        event.preventDefault();
        setState({
            ...state,
            ciudadDestinatario: event.target.value,
        });
    }

    const handleChangeCiudadEntrega = (event) => {
        event.preventDefault();
        setState({
            ...state,
            ciudadEntrega: event.target.value,
        });
    }

    const handleFechaInicialFiltro = async (event) => {
        setState({
            ...state,
            fechaInicial: event.target.value,
        });
        const {fechaFinal, sucursalListado, estatusListado, folioEmbarque} = state
        obtenerEmbarquesFiltro(event.target.value, fechaFinal, sucursalListado, estatusListado, folioEmbarque).then((respuesta) => {
            setData(respuesta.data);
        });
    };

    const handleFechaFinalFiltro = async (event) => {
        setState({
            ...state,
            fechaFinal: event.target.value,
        });
        const {fechaInicial, sucursalListado, estatusListado, folioEmbarque} = state
        obtenerEmbarquesFiltro(fechaInicial, event.target.value, sucursalListado, estatusListado, folioEmbarque).then((respuesta) => {
            setData(respuesta.data);
        });
    };

    const handleSucursalFiltro = async (event) => {
        setState({
            ...state,
            sucursalListado: event.target.value,
        });
        const {fechaInicial, fechaFinal, estatusListado, folioEmbarque} = state
        obtenerEmbarquesFiltro(fechaInicial, fechaFinal, event.target.value, estatusListado, folioEmbarque).then((respuesta) => {
            setData(respuesta.data);
        });
    };

    const handleEstatusFiltro = async (event) => {
        setState({
            ...state,
            estatusListado: event.target.value,
        });
        const {fechaInicial, fechaFinal, sucursalListado, folioEmbarque} = state
        obtenerEmbarquesFiltro(fechaInicial, fechaFinal, sucursalListado, event.target.value, folioEmbarque).then((respuesta) => {
            setData(respuesta.data);
        });
    };

    //Maneja filtrado de listado embarque
    const handleFolioEmbarqueFiltro = async (event) => {
        if (event.keyCode == 13) {
            let value = event.target.value
            if (event.target.value == '') {
                value = 0
            }
            setState({
                ...state,
                folioEmbarque: event.target.value,
            })
            const {fechaInicial, fechaFinal, sucursalListado, estatusListado} = state
            obtenerEmbarquesFiltro(fechaInicial, fechaFinal, sucursalListado, estatusListado, value).then(respuesta => {
                if (respuesta.data == "Vacio") {
                    setData([])
                } else {
                    setData(respuesta.data)
                }
            })
        }
    }

    function handleSelectDatos(id, cp) {
        setState({
            ...state,
            [state.identificadorModal]: id,
        });
        console.log(id);
        console.log(state.identificadorModal);
    }

    const handleZonaRemitenteSelected = (newValue) => {
        setState({
            ...state,
            zonaRemitente: newValue,
        })
    }

    const handleClickZona = (event) => {
        event.preventDefault()
        if (dataZona.length === 0) {
            getAllZonas()
        }

    }

    const handleZonaDestinatarioSelected = (newValue) => {
        setState({
            ...state,
            zonaDestinatario: newValue
        })
    }

    const handlePatrocinadorSelected = (newValue) => {
        setState({
            ...state,
            clientePaga: newValue
        })
    }

    const handleClickResponsablePago = (event) => {
        event.preventDefault();
        if (dataClientes.length === 0) {
            getAllClientes()
        }
    }

    function getAllZonas() {
        const url = `${process.env.REACT_APP_API_URL}/Zonas/GetListado`;
        axios.get(url, {headers}).then((respuesta) => {
            setDataZona(respuesta.data);
        });
    }

    const getAllClientes = () => {
        obtenerCliente().then((respuesta) => {
            setDataClientes(respuesta.data)
        })
    }

    const handleChangeZonaEntrega = (event) => {
        event.preventDefault();
        setState({
            ...state,
            zonaEntrega: event.target.value,
        });
    }

    const getDataParaListado = () => {
        getAllEmbarque();
        getAllSucursales();
        getAllEstatusEmbarque();
    }

    const getDataParaEditar = () => {
        getAllTipoCobro();
        getAllTipoMoneda();
        getTipoCambio()
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

    const getAllRemitentesDestinatarios = () => {
        obtenerRemitentesDestinatarios().then((respuesta) => {
            setDataRemitenteDestinatario(respuesta.data);
        });
    }

    async function getAllSucursales() {
        obtenerSucursales().then((respuesta) => {
            console.log('sucursales: ', respuesta.data)
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
            var file = new Blob([response.data], {type: 'application/pdf'})
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
            setRedirect(false)
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

    /*=PAQUETES Y SOBRES=*/

    function addPaquete() {
        const {paquetes} = state;
        paquetes.push({
            m_xPeso: "",
            m_xLargo: "",
            m_xAncho: "",
            m_xAlto: "",
            m_xVolumen: "",
            m_nIdTIpoEmpaque: "",
            m_cValorDeclarado: "",
            m_sDescripcion: "",
            m_nCantidad: "",
            m_nTipo: 2,
            m_sObservaciones: "",
            producto: '',
            m_nIdProducto: "",
        });
        console.log(paquetes);
        setState({
            ...state,
            paquetes: paquetes,
            countPaquetes: paquetes.length,
        });
    }

    const addPaquetev2 = (event) => {
        const {paquetes} = state;
        let paq = paquete
        if (validarPaquetes(paq)) {
            paq.m_nIdEmbarqueDetalle = paq.m_nIdEmbarqueDetalle ? paq.m_nIdEmbarqueDetalle : paquetes.length + 1
            paq.m_cValorDeclarado = paq.m_cValorDeclarado ? paq.m_cValorDeclarado : 0
            paquetes.push(paq);
            setPaquete({
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
                producto: null,
                m_nIdProducto: "",
                m_sTipo: "Paquete",
            })
            console.log(paquetes);
            setState({...state, paquetes: paquetes, countPaquetes: state.countPaquetes + 1});
        } else {
            showSuccess("Rellene los campos obligatorios.")
        }
    }

    function removePaquete(index) {
        var {paquetes} = state;
        if (paquetes.length !== 1) {
            paquetes.pop();
            setState({
                ...state,
                paquetes: paquetes,
                countPaquetes: state.paquetes.length,
            });
            let totalCantidad = 0
            paquetes.forEach((p) => {
                totalCantidad += parseInt(p.m_nCantidad)
            })
            setTotalPaquetes(totalCantidad)
        }
    }

    const removePaquetev2 = (event) => {
        event.preventDefault()
        setPaquete({
            m_xPeso: "",
            m_xLargo: "",
            m_xAncho: "",
            m_xAlto: "",
            m_xVolumen: "",
            m_nIdTIpoEmpaque: "",
            m_sTipoEmbalaje: "",
            m_cValorDeclarado: "",
            m_sDescripcion: "",
            ctd: "",
            m_nTipo: 2,
            m_sObservaciones: "",
            producto: null,
            m_nIdProducto: "",
            m_sTipo: "Paquete",
        })

    }

    function addSobre() {
        const {sobres} = state;
        sobres.push({
            m_nTipo: 1,
            m_sDescripcion: "",
        });
        console.log(sobres);
        setState({...state, sobres: sobres, countSobres: state.sobres.length});
    }

    function removeSobre(index) {
        var {sobres} = state;
        if (sobres.length !== 1) {
            sobres.pop();
            setState({
                ...state,
                sobres: sobres,
                countSobres: state.sobres.length,
            });
        }
    }

    const handleChangePaquete = (event, index) => {
        var {paquetes} = state;
        paquetes[index][event.target.name] = event.target.value;
        paquetes[index].m_xVolumen = paquetes[index].m_xLargo * paquetes[index].m_xAlto * paquetes[index].m_xAncho;
        setState({
            ...state,
            paquetes: paquetes,
        });
        let totalCantidad = 0
        paquetes.forEach((p) => {
            totalCantidad += parseInt(p.m_nCantidad)
        })
        setTotalPaquetes(totalCantidad)
    };

    const handleChangePaquetev2 = (event) => {
        let {paquetes} = state;
        setPaquete(paquete => {
            return {
                ...paquete,
                [event.target.name]: event.target.value,
                m_xVolumen: paquete.m_xLargo * paquete.m_xAlto * paquete.m_xAncho,
            }
        })
        if (event.target.name == "m_nIdTIpoEmpaque") {
            setPaquete(paquete => {
                return {
                    ...paquete,
                    m_sTipoEmbalaje: dataEmbalaje.find((i) => i.m_nIdEmbalaje == event.target.value).m_sNombre,
                }
            })
        }
        if (event.target.name == "m_nTipo") {
            setPaquete(paquete => {
                return {
                    ...paquete,
                    m_sTipo: event.target.value == 1 ? "Sobre" : "Paquete",
                }
            })
        }
        let totalCantidad = 0
        paquetes.forEach((p) => {
            totalCantidad += parseInt(p.ctd)
        })
        setTotalPaquetes(totalCantidad)
    };

    const handleChangePaqueteProducto = (event, index, newValue) => {
        let {paquetes} = state;
        console.log('seleccion ', newValue)
        paquetes[index].producto = newValue;
        paquetes[index].m_nIdProducto = newValue.m_nIdProducto
        paquetes[index].m_xLargo = newValue.m_xLargo
        paquetes[index].m_xAlto = newValue.m_xAlto
        paquetes[index].m_xAncho = newValue.m_xAncho
        paquetes[index].m_xPeso = newValue.m_xPeso
        paquetes[index].m_nIdTIpoEmpaque = newValue.m_nIdEmbalaje
        paquetes[index].m_sDescripcion = newValue.m_nIdProducto == 1 ? "" : newValue.m_sDescripcion
        paquetes[index].m_xVolumen = paquetes[index].m_xLargo * paquetes[index].m_xAlto * paquetes[index].m_xAncho;
        setState({
            ...state,
            paquetes: paquetes,
        });
    };

    const handleChangePaqueteProductov2 = (event, newValue) => {
        setPaquete(paquete => {
            return {
                ...paquete,
                producto: newValue,
                m_nIdProducto: newValue.m_nIdProducto,
                m_xLargo: newValue.m_xLargo,
                m_xAlto: newValue.m_xAlto,
                m_xAncho: newValue.m_xAncho,
                m_xPeso: newValue.m_xPeso,
                m_nIdTIpoEmpaque: newValue.m_nIdEmbalaje,
                m_sTipoEmbalaje: dataEmbalaje.find((i) => i.m_nIdEmbalaje == newValue.m_nIdEmbalaje).m_sNombre,
                m_sDescripcion: newValue.m_nIdProducto == 1 ? "" : newValue.m_sDescripcion,
                m_sProducto: newValue.m_sDescripcion
            }
        })
        setPaquete(paquete => {
            return {
                ...paquete,
                m_xVolumen: paquete.m_xLargo * paquete.m_xAlto * paquete.m_xAncho
            }
        })

    };

    const handlePaqueteClick = (data) => {
        if (state.agregar != "Consultar") {
            setState({
                ...state,
                paquetes: state.paquetes.filter((i) => i.m_nIdEmbarqueDetalle != data.m_nIdEmbarqueDetalle)
            })

            if (dataProductos.length === 0) {
                obtenerProductoById(data.m_nIdProducto).then((respuesta) => {
                    data.producto = respuesta.data
                    data.m_sProducto = respuesta.data.m_sDescripcion
                })
            } else {
                data.producto = dataProductos.find((i) => i.m_nIdProducto == data.m_nIdProducto)
                data.m_sProducto = data.producto.m_sDescripcion
            }
            setPaquete(data)
        }

    }

    const handleClickProducto = () => {
        if (dataProductos.length === 0) {
            getAllProductos()
        }
        if (dataEmbalaje.length === 0) {
            getAllEmbalajes()
        }
    }

    const handleChangeSobre = (event, index) => {
        var {sobres} = state;
        sobres[index][event.target.name] = event.target.value;
        setState({
            ...state,
            sobres: sobres,
        });
    };

    const getAllProductos = () => {
        const url = `${process.env.REACT_APP_API_URL}/Productos/GetListado`;
        axios.get(url, {headers}).then(respuesta => {
            setDataProductos(respuesta.data)
        });
    }


    /*const framesPaquete = state.paquetes.map((p, index) => {
        return (
            <div key={`paquete${index}`}>
                <div className="col-sm-12 col-md-12 unit">
                    <h4>
                        <strong>{`Paquete #${index + 1}`}</strong>
                    </h4>
                </div>

                <div className="col-sm-4 col-md-12 unit">
                    <div className="input">
                        <Autocomplete
                            value={state.paquetes[index].producto}
                            freeSolo
                            onChange={(event, newValue) => handleChangePaqueteProducto(event, index, newValue)}
                            disableClearable
                            forcePopupIcon={false}
                            options={dataProductos}
                            disabled={state.agregar === "Consultar"}
                            getOptionLabel={(option) => `${option.m_sDescripcion}`}
                            variant="outlined"
                            name={"producto"}
                            style={{
                                transform: "translate(14px, 10px) scale(1) !important"
                            }}
                            renderInput={(params) =>
                                <TextField
                                    variant="outlined"
                                    label="Producto"
                                    margin="dense"
                                    onClick={handleClickProducto}
                                    required
                                    {...params}
                                />
                            }
                        />
                    </div>
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
                                   placeholder="cms"
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
                                   placeholder="cms"
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
                                   placeholder="cms"
                                   name="m_xAlto"
                        />
                    </div>
                </div>

                <div className="col-sm-4 col-md-2-5 unit">
                    <div className="input">
                        <TextField variant="outlined" margin="dense" label="Volumen"
                            // onChange={(event) => handleChangePaquete(event, index)}
                                   className="form-control"
                                   type="text"
                                   value={state.paquetes[index].m_xVolumen}
                                   disabled
                                   placeholder="cms3"
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
                                   value={state.paquetes[index].m_cValorDeclarado}
                                   disabled={state.agregar === "Consultar"}
                                   placeholder="$"
                                   name="m_cValorDeclarado"
                                   InputLabelProps={{shrink: true,}}
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
                                   value={state.sobres[index].m_sDescripcion}
                                   disabled={state.agregar === "Consultar"}
                                   placeholder="Descripción"
                                   name="m_sDescripcion"
                        />
                    </div>
                </div>
            </div>
        );
    });*/

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

    return (
        <div>

            {
                state.showConfirmarUbicacion &&
                <ConfirmarUbicacion confirmarUbicacion={confirmarUbicacion} open={state.showConfirmarUbicacion}
                                    titulo={state.titulo}
                                    direccion={state.destinatario}>

                </ConfirmarUbicacion>
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

                            {dataCodigosPostalesEntrega.length != 0 ? (
                                <TableCodigoPostal
                                    object={state}
                                    select={
                                        state[state.identificadorModal] &&
                                        state[state.identificadorModal].m_nIdCP
                                    }
                                    columns={columnsCP}
                                    data={dataCodigosPostalesEntrega}
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
                    {state.tipoModal === 2 && (
                        <div className="row" style={{backgroundColor: "#FFFFFF"}}>
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
                    {state.tipoModal === 3 && (
                        <div className="row" style={{backgroundColor: "#FFFFFF"}}>
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
                    {state.tipoModal === 4 && (
                        <div className="row" style={{backgroundColor: "#FFFFFF"}}>
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
                </DialogContent>
            </Dialog>

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
                            <a onClick={() => handleShowAgregar()}>
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
                            <ExportCSV csvData={data} fileName="Embarque_Listado"/>
                        </li>
                        <li>
                            <a

                                onClick={handleShowCancelar}
                                className={state.idEmbarque === 0 ? classes.disabled : ""}
                            >
                                <i className="fa fa-times-circle"/> Cancelar
                            </a>
                        </li>
                        <li style={{float: "right"}}>
                            <a
                                className={state.idEmbarque === 0 ? classes.disabled : ""}
                                style={{textAlign: "right"}}
                                onClick={() => setRedirect(true)}
                            >
                                Generar Guía
                            </a>
                        </li>
                    </ul>

                    <div className="row tab-content">
                        <div id="Listado"
                             className={props.location.idRecoleccion != undefined ? "tab-pane fade" : "tab-pane fade in show"}>

                            <div className="widget-wrap">
                                <div className="widget-content">
                                    <div className="row" style={{paddingLeft: "8px"}}>
                                        <form className="j-forms">
                                            <div className="row" style={{display: "flex"}}>

                                                <div className="col-sm-6 col-md-3 unit" style={{paddingLeft: "0px"}}>
                                                    <div className="input">
                                                        <TextField variant="outlined" margin="dense"
                                                                   onChange={handleChange}
                                                            // onBlur={handleFolioEmbarqueFiltro}
                                                                   onKeyDown={handleFolioEmbarqueFiltro}
                                                                   className="form-control"
                                                                   type="text"
                                                                   label="Folio Embarque"
                                                                   value={state.folioEmbarque}
                                                                   id="folioEmbarque"
                                                                   name="folioEmbarque"
                                                        />
                                                    </div>
                                                </div>

                                                <div
                                                    className="col-sm-6 col-md-3 "
                                                    style={{paddingLeft: "0px"}}
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
                                                    style={{paddingLeft: "0px"}}
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
                                                    style={{paddingLeft: "0px"}}
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
                                                    style={{paddingLeft: "0px"}}
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
                                        style={{height: state.height - 250, width: "100%"}}
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

                        <div id="Agregar"
                             className={props.location.idRecoleccion != undefined ? "tab-pane fade in show" : "tab-pane fade"}>

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
                                                        <Step key={s} completed={false}
                                                              onClick={() => openSection(index + 1)}>
                                                            <StepLabel>{s}</StepLabel>
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
                                                                           label={state.duplicar ? "Folio Relacionado" : "Folio Embarque"}
                                                                           onChange={handleChange}
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
                                                                <TextField variant="outlined" margin="dense"
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
                                                                        {dataEstatusEmbarque.filter(e => e.m_nIdEstatusEmbarque < 17).map((estatus) => (
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
                                                                        name="moneda"
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
                                                                            tipoCobro.valid &&
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

                                    <div className="widget-wrap" id="paquetesSobres">
                                        <div>
                                            <Grid container>
                                                <Grid item xs={6}>
                                                    <div className="widget-header">
                                                        <h2>Paquetes y sobres</h2>
                                                    </div>
                                                </Grid>
                                            </Grid>

                                            <div className="widget-container">
                                                <div className="widget-content">
                                                    <div className="row">
                                                        <Grid container spacing={1}>
                                                            <Grid item xs={2}>
                                                                <label className="input select">
                                                                    <FormControl fullWidth variant="outlined"
                                                                                 margin="dense" required>
                                                                        <InputLabel id="m_nIdTipoEmbalajeLabel">Tipo de
                                                                            paquete</InputLabel>
                                                                        <Select
                                                                            label="Tipo de paquete"
                                                                            labelId="m_nIdTipoLabel"
                                                                            className="form-control"
                                                                            value={paquete.m_nTipo}
                                                                            disabled={state.agregar === "Consultar"}
                                                                            onChange={(event) => handleChangePaquetev2(event)}
                                                                            id="m_nTipo"
                                                                            name="m_nTipo"
                                                                        >
                                                                            <option key={2} value={2}>
                                                                                Paquete
                                                                            </option>
                                                                            <option key={1} value={1}>
                                                                                Sobre
                                                                            </option>
                                                                        </Select>
                                                                    </FormControl>
                                                                    <i className="fa fa-arrow-down"/>
                                                                </label>
                                                            </Grid>
                                                            {paquete.m_nTipo != 1 &&
                                                            <Grid item xs={2}>
                                                                <div className="input">
                                                                    <Autocomplete
                                                                        value={paquete.producto}
                                                                        freeSolo
                                                                        onChange={(event, newValue) => handleChangePaqueteProductov2(event, newValue)}
                                                                        disableClearable
                                                                        forcePopupIcon={false}
                                                                        options={dataProductos}
                                                                        disabled={state.agregar === "Consultar"}
                                                                        getOptionLabel={(option) => `${option.m_sDescripcion}`}
                                                                        variant="outlined"
                                                                        inputValue={`${paquete.producto == null ? '' : paquete.producto.m_sDescripcion}`}
                                                                        name={"producto"}
                                                                        style={{transform: "translate(14px, 10px) scale(1) !important"}}
                                                                        renderInput={(params) =>
                                                                            <TextField
                                                                                variant="outlined"
                                                                                label="Producto"
                                                                                margin="dense"
                                                                                onClick={handleClickProducto}
                                                                                {...params}
                                                                            />
                                                                        }
                                                                    />
                                                                </div>
                                                            </Grid>
                                                            }
                                                            {paquete.m_nTipo != 1 &&
                                                                <Grid item xs={1}>
                                                                    <div className="input">
                                                                        <TextField variant="outlined" margin="dense"
                                                                                   onChange={(event) => handleChangePaquetev2(event)}
                                                                                   className="form-control"
                                                                                   type="text"
                                                                                   label="Peso"
                                                                                   value={paquete.m_xPeso}
                                                                                   disabled={state.agregar === "Consultar"}
                                                                                   placeholder="kg"
                                                                                   name="m_xPeso"
                                                                        />
                                                                    </div>
                                                                </Grid>
                                                            }
                                                            {paquete.m_nTipo != 1 &&
                                                            <Grid item xs={1}>
                                                                <div className="input">
                                                                    <TextField variant="outlined" margin="dense"
                                                                               onChange={(event) => handleChangePaquetev2(event)}
                                                                               className="form-control"
                                                                               type="text"
                                                                               value={paquete.m_xLargo}
                                                                               label="Largo"
                                                                               disabled={state.agregar === "Consultar"}
                                                                               placeholder="cms"
                                                                               name="m_xLargo"
                                                                    />
                                                                </div>
                                                            </Grid>
                                                            }
                                                            {paquete.m_nTipo != 1 &&
                                                            <Grid item xs={1}>
                                                                <div className="input">
                                                                    <TextField variant="outlined" margin="dense"
                                                                               onChange={(event) => handleChangePaquetev2(event)}
                                                                               className="form-control"
                                                                               type="text"
                                                                               label="Ancho"
                                                                               value={paquete.m_xAncho}
                                                                               disabled={state.agregar === "Consultar"}
                                                                               placeholder="cms"
                                                                               name="m_xAncho"
                                                                    />
                                                                </div>
                                                            </Grid>
                                                            }
                                                            {paquete.m_nTipo != 1 &&
                                                            <Grid item xs={1}>
                                                                <div className="input">
                                                                    <TextField variant="outlined" margin="dense"
                                                                               onChange={(event) => handleChangePaquetev2(event)}
                                                                               className="form-control"
                                                                               type="text"
                                                                               value={paquete.m_xAlto}
                                                                               label="Alto"
                                                                               disabled={state.agregar === "Consultar"}
                                                                               placeholder="cms"
                                                                               name="m_xAlto"
                                                                    />
                                                                </div>
                                                            </Grid>
                                                            }
                                                            {paquete.m_nTipo != 1 &&
                                                            <Grid item xs={1}>
                                                                <div className="input">
                                                                    <TextField variant="outlined" margin="dense"
                                                                        // onChange={(event) => handleChangePaquete(event, index)}
                                                                               className="form-control"
                                                                               type="text"
                                                                               value={paquete.m_xVolumen}
                                                                               label="Volumen"
                                                                               disabled
                                                                               placeholder="cm3"
                                                                               name="m_xVolumen"
                                                                    />
                                                                </div>
                                                            </Grid>
                                                            }
                                                            {paquete.m_nTipo != 1 &&
                                                            <Grid item xs={1}>
                                                                <label className="input select">
                                                                    <FormControl fullWidth variant="outlined"
                                                                                 margin="dense">
                                                                        <InputLabel
                                                                            id="m_nIdTipoEmbalajeLabel">Embalaje</InputLabel>
                                                                        <Select
                                                                            label="Embalaje"
                                                                            labelId="m_nIdTipoEmbalajeLabel"
                                                                            className="form-control"
                                                                            value={paquete.m_nIdTIpoEmpaque}
                                                                            disabled={state.agregar === "Consultar"}
                                                                            onChange={(event) => handleChangePaquetev2(event)}
                                                                            id="m_nIdTIpoEmpaque"
                                                                            name="m_nIdTIpoEmpaque"
                                                                        >
                                                                            {dataEmbalaje.map((embalaje) => (
                                                                                <option key={embalaje.m_nIdEmbalaje}
                                                                                        value={embalaje.m_nIdEmbalaje}>
                                                                                    {embalaje.m_sNombre}
                                                                                </option>
                                                                            ))}
                                                                        </Select>
                                                                    </FormControl>
                                                                    <i className="fa fa-arrow-down"/>
                                                                </label>
                                                            </Grid>
                                                            }
                                                            {paquete.m_nTipo != 1 &&
                                                            <Grid item xs={2}>
                                                                <div className="input">
                                                                    <TextField variant="outlined" margin="dense"
                                                                               onChange={(event) => handleChangePaquetev2(event)}
                                                                               className="form-control"
                                                                               type="text"
                                                                               label="Valor Declarado"
                                                                               value={paquete.m_cValorDeclarado}
                                                                               disabled={state.agregar === "Consultar"}
                                                                               placeholder="$"
                                                                               name="m_cValorDeclarado"
                                                                    />
                                                                </div>
                                                            </Grid>
                                                            }
                                                            <Grid item xs={5}>
                                                                <div className="input">
                                                                    <TextField variant="outlined" margin="dense"
                                                                               onChange={(event) => handleChangePaquetev2(event)}
                                                                               className="form-control"
                                                                               type="text"
                                                                               label="Descripción"
                                                                               value={paquete.m_sDescripcion}
                                                                               disabled={state.agregar === "Consultar"}
                                                                               placeholder="Descripción"
                                                                               name="m_sDescripcion"
                                                                    />
                                                                </div>
                                                            </Grid>
                                                            {paquete.m_nTipo != 1 &&
                                                            <Grid item xs={1}>
                                                                <div className="input">
                                                                    <TextField variant="outlined" margin="dense"
                                                                               onChange={(event) => handleChangePaquetev2(event)}
                                                                               className="form-control"
                                                                               type="text"
                                                                               label="Ctd"
                                                                               value={paquete.ctd}
                                                                               disabled={state.agregar === "Consultar"}
                                                                               placeholder="Ctd"
                                                                               name="ctd"
                                                                    />
                                                                </div>
                                                            </Grid>
                                                            }
                                                            {paquete.m_nTipo != 1 &&
                                                            <Grid item xs={5}>
                                                                <div className="input">
                                                                    <TextField variant="outlined" margin="dense"
                                                                               onChange={(event) => handleChangePaquetev2(event)}
                                                                               className="form-control"
                                                                               type="text"
                                                                               label="Observaciones"
                                                                               value={paquete.m_sObservaciones}
                                                                               disabled={state.agregar === "Consultar"}
                                                                               placeholder="Observaciones"
                                                                               name="m_sObservaciones"
                                                                    />
                                                                </div>
                                                            </Grid>
                                                            }
                                                            <Grid item xs={1}>
                                                                <IconButton onClick={addPaquetev2}
                                                                            style={{padding: "0px"}}
                                                                            disabled={state.agregar === "Consultar"}>
                                                                    <AddBoxIcon
                                                                        style={{fill: "green", fontSize: "xx-large"}}/>
                                                                </IconButton>
                                                                <IconButton onClick={removePaquetev2}
                                                                            style={{padding: "0px"}}
                                                                            disabled={state.agregar === "Consultar"}>
                                                                    <DeleteIcon
                                                                        style={{fill: "red", fontSize: "xx-large"}}/>
                                                                </IconButton>
                                                            </Grid>
                                                        </Grid>
                                                    </div>
                                                    <div className="row" style={{height: 200}}>
                                                        <DataGrid
                                                            localeText={dataGridLocaleText}
                                                            density="compact"
                                                            pageSize={10}
                                                            columns={columnsPaquetes}
                                                            rows={state.paquetes}
                                                            getRowId={(row) => row.m_nIdEmbarqueDetalle}
                                                            onRowSelected={(row) => handlePaqueteClick(row.data)}/>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="row">
                                        <div className="col-md-12">
                                            <div className="widget-wrap" id="remitenteDestinatario">
                                                <div className="row">
                                                    <div className="col-md-12">
                                                        <div className="col-sm-12 col-md-12 unit">
                                                            <div className="input">
                                                                <Autocomplete
                                                                    value={state.clientePaga}
                                                                    freeSolo
                                                                    onChange={(event, newValue) => handlePatrocinadorSelected(newValue)}
                                                                    id="clientePaga"
                                                                    disableClearable
                                                                    forcePopupIcon={false}
                                                                    options={dataClientes}
                                                                    disabled={state.agregar === "Consultar"}
                                                                    getOptionLabel={(option) => `${option.m_nNumeroCliente}: ${option.m_sNombreFiscal}`}
                                                                    variant="outlined"
                                                                    name={"clientePaga"}
                                                                    style={{
                                                                        transform: "translate(14px, 10px) scale(1) !important"
                                                                    }}
                                                                    renderInput={(params) =>
                                                                        <TextField
                                                                            variant="outlined"
                                                                            label="Responsable de pago"
                                                                            margin="dense"
                                                                            required
                                                                            placeholder={"No. Cliente: Nombre fiscal"}
                                                                            InputLabelProps={{shrink: true}}
                                                                            onClick={handleClickResponsablePago}
                                                                            {...params}
                                                                        />
                                                                    }
                                                                />
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div className="col-md-6">
                                                        <div className="widget-header">
                                                            <h2>Remitente</h2>
                                                        </div>
                                                        <div className="widget-container">
                                                            <div className="widget-content">
                                                                <div className="col-md-6">
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
                                                                                getOptionLabel={(option) => option.m_sAlias + " (" + option.m_sNombre + ")"}
                                                                                variant="outlined"
                                                                                style={{
                                                                                    transform: "translate(14px, 10px) scale(1) !important"
                                                                                }}
                                                                                renderInput={(params) => (
                                                                                    <div>
                                                                                        <TextField
                                                                                            required
                                                                                            label={"Alias (Nombre)"}
                                                                                            {...params}
                                                                                            margin="dense"
                                                                                            variant="outlined"
                                                                                            onClick={handleClickRemitenteDestinatario}
                                                                                            placeholder={"Alias (Nombre)"}
                                                                                            InputLabelProps={{shrink: true}}
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
                                                                            <TextField variant="outlined" margin="dense"
                                                                                       onChange={handleChange}
                                                                                       className="form-control"
                                                                                       type="text"
                                                                                       required
                                                                                       label="Calle"
                                                                                       value={state.calleRemitente}
                                                                                       disabled={state.agregar === "Consultar"}
                                                                                       id="calleRemitente"
                                                                                       name="calleRemitente"
                                                                            />
                                                                        </div>
                                                                    </div>

                                                                    <div className="col-sm-12 col-md-12 unit">
                                                                        <div className="input">
                                                                            <TextField variant="outlined" margin="dense"
                                                                                       onChange={handleChange}
                                                                                       className="form-control"
                                                                                       type="text"
                                                                                       label="Número interior"
                                                                                       value={state.numeroIntRemitente}
                                                                                       disabled={state.agregar === "Consultar"}
                                                                                       id="numeroIntRemitente"
                                                                                       name="numeroIntRemitente"
                                                                            />
                                                                        </div>
                                                                    </div>

                                                                    <div className="col-sm-12 col-md-12 unit">
                                                                        <div className="input">
                                                                            <TextField variant="outlined" margin="dense"
                                                                                       onChange={handleChange}
                                                                                       className="form-control"
                                                                                       type="text"
                                                                                       label="Número exterior"
                                                                                       value={state.numeroExtRemitente}
                                                                                       disabled={state.agregar === "Consultar"}
                                                                                       id="numeroExtRemitente"
                                                                                       name="numeroExtRemitente"
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
                                                                                       label="Colonia"
                                                                                       value={state.coloniaRemitente}
                                                                                       disabled={state.agregar === "Consultar"}
                                                                                       id="coloniaRemitente"
                                                                                       name="coloniaRemitente"
                                                                            />
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                                <div className="col-md-6">
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
                                                                                    onClick={handleClickCiudad}
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
                                                                            <i className="fa fa-arrow-down"/>
                                                                        </label>
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
                                                                                disableClearable
                                                                                disabled={state.agregar === "Consultar"}
                                                                                forcePopupIcon={false}
                                                                                options={dataCodigosPostalesRemitente.filter(cp => cp.m_nIdCiudad == state.ciudadRemitente)}
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
                                                                                            onClick={handleCodigoPostalRemitenteClick}
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
                                                                                            onClick={handleClickCiudad}
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
                                                                                        onClick={handleClickZona}
                                                                                        {...params}
                                                                                    />
                                                                                }
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
                                                                <div className="col-md-6">
                                                                    <div className="col-sm-12 col-md-12 unit">
                                                                        <div className="input">
                                                                            <Autocomplete
                                                                                onChange={(event, newValue) => {
                                                                                    handleSelectDestinatario(newValue)
                                                                                }}
                                                                                value={state.nombreDestinatario}
                                                                                freeSolo
                                                                                id="nombreDestinatario"
                                                                                disableClearable
                                                                                disabled={state.agregar === "Consultar"}
                                                                                forcePopupIcon={false}
                                                                                options={dataRemitenteDestinatario}
                                                                                getOptionLabel={(option) => option.m_sAlias + " (" + option.m_sNombre + ")"}
                                                                                variant="outlined"
                                                                                style={{
                                                                                    transform: "translate(14px, 10px) scale(1) !important"
                                                                                }}
                                                                                renderInput={(params) => (
                                                                                    <div>
                                                                                        <TextField
                                                                                            required
                                                                                            label={"Alias (Nombre)"}
                                                                                            {...params}
                                                                                            margin="dense"
                                                                                            variant="outlined"
                                                                                            onClick={handleClickRemitenteDestinatario}
                                                                                            placeholder={"Alias (Nombre)"}
                                                                                            InputLabelProps={{shrink: true}}
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
                                                                            <TextField variant="outlined" margin="dense"
                                                                                       onChange={handleChange}
                                                                                       className="form-control"
                                                                                       type="text"
                                                                                       required
                                                                                       label="Calle"
                                                                                       value={state.calleDestinatario}
                                                                                       disabled={state.agregar === "Consultar"}
                                                                                       id="calleDestinatario"
                                                                                       name="calleDestinatario"
                                                                            />
                                                                        </div>
                                                                    </div>

                                                                    <div className="col-sm-12 col-md-12 unit">
                                                                        <div className="input">
                                                                            <TextField variant="outlined" margin="dense"
                                                                                       onChange={handleChange}
                                                                                       className="form-control"
                                                                                       type="text"
                                                                                       label="Número interior"
                                                                                       value={state.numeroIntDestinatario}
                                                                                       disabled={state.agregar === "Consultar"}
                                                                                       id="numeroIntDestinatario"
                                                                                       name="numeroIntDestinatario"
                                                                            />
                                                                        </div>
                                                                    </div>

                                                                    <div className="col-sm-12 col-md-12 unit">
                                                                        <div className="input">
                                                                            <TextField variant="outlined" margin="dense"
                                                                                       onChange={handleChange}
                                                                                       className="form-control"
                                                                                       type="text"
                                                                                       label="Número exterior"
                                                                                       value={state.numeroExtDestinatario}
                                                                                       disabled={state.agregar === "Consultar"}
                                                                                       id="numeroExtDestinatario"
                                                                                       name="numeroExtDestinatario"
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
                                                                                       label="Colonia"
                                                                                       value={state.coloniaDestinatario}
                                                                                       disabled={state.agregar === "Consultar"}
                                                                                       id="coloniaDestinatario"
                                                                                       name="coloniaDestinatario"
                                                                            />
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                                <div className="col-md-6">
                                                                    <div className="col-sm-12 col-md-12  unit">
                                                                        {/*<div className="input">
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
                                                                    </div>*/}
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
                                                                                    onClick={handleClickCiudad}
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
                                                                            <i className="fa fa-arrow-down"/>
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
                                                                                id="codigoPostalDestinatario"
                                                                                disableClearable
                                                                                disabled={state.agregar === "Consultar"}
                                                                                options={dataCodigosPostalesDestinatario.filter(cp => cp.m_nIdCiudad == state.ciudadDestinatario)}
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
                                                                                            onClick={handleCodigoPostalDestinatarioClick}
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
                                                                                                                    tipoModal: 7,
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
                                                                                            onClick={handleClickCiudad}
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

                                                                    {
                                                                        (!state.diferenteEntrega && !state.entregaEnSucursal) &&
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
                                                                                            onClick={handleClickZona}
                                                                                            required
                                                                                            {...params}
                                                                                        />
                                                                                    }
                                                                                />
                                                                            </div>
                                                                        </div>
                                                                    }
                                                                </div>

                                                                <div className="col-sm-12 col-md-12  unit">
                                                                    <label className="checkbox">
                                                                        Entrega en Sucursal
                                                                        <input
                                                                            onChange={handleEntregaEnSucursalCheckbox}
                                                                            className="form-control"
                                                                            type="checkbox"
                                                                            checked={state.entregaEnSucursal}
                                                                            style={{height: "20px"}}
                                                                            disabled={state.agregar === "Consultar"}
                                                                            id="entregaEnSucursal"
                                                                        />
                                                                        <i/>
                                                                    </label>
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
                                                                            style={{height: "20px"}}
                                                                            disabled={state.agregar === "Consultar"}
                                                                            id="diferenteEntrega"
                                                                        />
                                                                        <i/>
                                                                    </label>
                                                                </div>

                                                                <div className="col-sm-12 col-md-12  unit">
                                                                    <label className="checkbox">
                                                                        Entrega con cita
                                                                        <input
                                                                            onChange={handleEntregaConCitaCheckbox}
                                                                            className="form-control"
                                                                            type="checkbox"
                                                                            checked={state.entregaConCita}
                                                                            value={state.entregaConCita}
                                                                            style={{height: "20px"}}
                                                                            disabled={state.agregar === "Consultar"}
                                                                            id="entregaConCita"
                                                                        />
                                                                        <i/>
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
                                                                    <InputLabel id="idSucursalEntrega">Sucursal de
                                                                        Entrega</InputLabel>
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
                                                    <div/>

                                                }

                                            </div>
                                        </div>

                                        {/*<div className="widget-wrap col-md-5" id="paquetesSobres">
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
                                                                value={state.paquetes.length}
                                                                style={{width: "40px", textAlign: "center"}}
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
                                                        value={state.sobres.length}
                                                        style={{width: "40px", textAlign: "center"}}
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
                                                                    <h2>Número total de elementos: {totalPaquetes}</h2>

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
                                        </div>*/}
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
                                                                        <i className="fa fa-arrow-down"/>
                                                                    </label>
                                                                </div>


                                                                <div className="col-sm-4 col-md-4 unit">
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
                                                                            disabled={state.agregar === "Consultar"}
                                                                            id="codigoPostalEntrega"
                                                                            disableClearable
                                                                            forcePopupIcon={false}
                                                                            options={dataCodigosPostalesEntrega.filter(cp => cp.m_nIdCiudad == state.ciudadEntrega)}
                                                                            getOptionLabel={(option) => option.m_sCP}
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
                                                                                        onClick={handleCodigoPostalEntregaClick}
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
                                                                                                                tipoModal: 9,
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
                                                                    <label className="input select">
                                                                        <FormControl fullWidth
                                                                                     variant="outlined"
                                                                                     margin="dense">
                                                                            <InputLabel
                                                                                id="zonaEntregaLabel">Zona</InputLabel>
                                                                            <Select
                                                                                labelId="zonaEntregaLabel"
                                                                                label="Zona"
                                                                                onClick={handleClickZona}
                                                                                className="form-control"

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
                                                                        <i className="fa fa-arrow-down"/>
                                                                    </label>
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
                                            <div/>
                                        )}
                                    </div>

                                    <div className="row">
                                        {state.entregaConCita &&
                                        <div className="widget-wrap" id="citaEntrega">
                                            <div>
                                                <div className="widget-header">
                                                    <h2>Programar cita de la Entrega</h2>
                                                </div>
                                                <div className="widget-container">
                                                    <div className="widget-content">
                                                        <div className="row">
                                                            <div className="col-md-12">
                                                                <div className="col-sm-6 col-md-4  unit">

                                                                    <div className="input">
                                                                        <TextField
                                                                            variant="outlined"
                                                                            id="fechaCita"
                                                                            label="Fecha de la cita"
                                                                            type="date"
                                                                            onChange={handleFechaCita}
                                                                            value={state.fechaCita}
                                                                            className={"form-control"}
                                                                            disabled={state.agregar === "Consultar"}
                                                                            InputLabelProps={{shrink: true,}}
                                                                            required={state.entregaConCita}
                                                                        />
                                                                    </div>
                                                                </div>
                                                                <div className="col-sm-6 col-md-4  unit">
                                                                    <div className="input">
                                                                        <TextField
                                                                            variant="outlined"
                                                                            id="horaMinima"
                                                                            label="Hora mínima"
                                                                            type="time"
                                                                            value={state.horaCitaMinima}
                                                                            onChange={handleHoraCitaMinima}
                                                                            className={"form-control"}
                                                                            disabled={state.agregar === "Consultar"}
                                                                            InputLabelProps={{shrink: true,}}
                                                                            inputProps={{step: 300,}}
                                                                            required={state.entregaConCita}
                                                                        />
                                                                    </div>
                                                                </div>
                                                                <div className="col-sm-6 col-md-4  unit">
                                                                    <div className="input">
                                                                        <TextField
                                                                            variant="outlined"
                                                                            id="horaMaxima"
                                                                            label="Hora máxima"
                                                                            type="time"
                                                                            onChange={handleHoraCitaMaxima}
                                                                            value={state.horaCitaMaxima}
                                                                            className={"form-control"}
                                                                            InputLabelProps={{shrink: true,}}
                                                                            inputProps={{step: 300,}}
                                                                            disabled={state.agregar === "Consultar"}
                                                                            required={state.entregaConCita}
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
                                    </div>

                                </div>
                                <div className="form-footer ol-md-12">
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
                                            <form className="j-forms" onSubmit={handleCancelar}>
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
                                                                       required
                                                            />
                                                        </div>
                                                    </div>

                                                    <div className="form-footer col-md-12">
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
                <BarraLateralDerecha/>
            </aside>
        </div>
    );
}

export default Embarque;
