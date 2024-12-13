import React, {useEffect, useMemo, useState} from 'react';
import {
    Accordion,
    AccordionDetails,
    AccordionSummary,
    Button,
    createFilterOptions,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle, Fab,
    FormControl, FormControlLabel,
    Grid,
    InputLabel,
    List,
    ListItem,
    ListItemText,
    MenuItem,
    Paper,
    Select, Switch,
    TextField,
} from "@mui/material";
import makeStyles from '@mui/styles/makeStyles';
import Typography from "@mui/material/Typography";
import {obtenerSucursales} from "../../Util/Contexts/SucursalContext";
import {
    obtenerConceptosFacturacion,
    obtenerImpuestosByConceptosFacturacion
} from "../../Util/Contexts/ConceptosFacturacionContext";
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import {
    obtenerListadoZonaOperativaByOrigenDestino,
    obtenerListadoZonaOperativaBySucursal
} from "../../Util/Contexts/ZonaOperativaContext";
import {dataGridLocaleText} from "../../Constants";
import SvgIcon from "@mui/material/SvgIcon";
import {ReactComponent as Activo} from "../../iconos/Menu/palomita.svg";
import {ReactComponent as NoActivo} from "../../iconos/Menu/cruz.svg";
import {getCurrentDate, getRandomId, getUniqueListBy, validarDerecho} from "../../Util/Util";
import DialogCheckbox from "./DialogCheckbox";
import {obtenerTiposCalculo} from "../../Util/Contexts/TipoCalculoContext";
import IconButton from "@mui/material/IconButton";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import {obtenerImpuestos} from "../../Util/Contexts/ImpuestosContext";
import axios from "axios";
import DialogoNuevoConcepto from "./DialogoNuevoConcepto";
import ViajeLocal from "./ViajeLocal";
import RangosTarifa from "./RangosTarifa";
import Maniobras from "./Maniobras";
import {obtenerProductos} from "../../Util/Contexts/ProductosContext";
import ViajeForaneo from "./ViajeForaneo";
import {obtenerCiudades} from "../../Util/Contexts/CiudadesContext";
import AddIcon from '@mui/icons-material/AddBox';
import Noty from "noty";
import {agregarTarifaRangos, modificarTarifaRangos, obtenerTarifaRangosById} from "../../Util/Contexts/TarifasContext";
import DialogTableClientes from "../Clientes/DialogTableClientes";
import {
    obtenerClientePublicoGeneral,
    obtenerClienteTieneConvenio
} from "../../Util/Contexts/ClientesContext";
import {obtenerUnidadesMedida} from "../../Util/Contexts/UnidadesMedidaContext";
import {Clear, ExpandLess} from "@mui/icons-material";
import SearchIcon from "@mui/icons-material/Search";
import Autocomplete from '@mui/material/Autocomplete';
import Tooltip from "@mui/material/Tooltip";
import {fil} from "date-fns/locale";
import {StyledEngineProvider, ThemeProvider} from "@mui/material/styles";
import {DataGrid} from "@mui/x-data-grid";
import {confirmAlert} from "react-confirm-alert";

function showSuccess(mensaje) {
    new Noty({
        type: "information",
        layout: "topCenter",
        text: mensaje,
        timeout: "5000"
    }).show()
}

const OPTIONS_LIMIT = 20;
const filterOptions = createFilterOptions({
    limit: OPTIONS_LIMIT
});

export default function CrearTarifaRangos(props) {
    const [state, setState] = useState({
        idTarifa: props.selection?.idTarifa || 0,
        vigencia: props.selection?.vigencia || getCurrentDate(),
        cuotaMensual: props.selection?.cuotaMensual || null,
        cliente: props.selection?.cliente || null,
        showDialogClientes: false,
        showDialogTarifas: false,
        idForaneo: 0
    })
    const [viajesLocalesListado, setViajesLocalesListado] = useState(props.selection?.viajesLocales || [])
    const [maniobrasTarifa,setManiobrasTarifa] = useState(props.selection?.maniobras || [])
    const [viajesForaneosListado, setViajesForaneosListado] = useState(props.selection?.viajesForaneos || [])
    const [sucursalesListado, setSucursalesListado] = useState([])
    const [conceptosListado, setConceptosListado] = useState([])
    const [zonasListado, setZonasListado] = useState([])
    const [tiposCalculoListado, setTiposCalculoListado] = useState([])
    const [origenesDestinosListado, setOrigenesDestinosListado] = useState([])
    const [unidadesMedidaListado, setUnidadesMedidaListado] = useState([])
    const [productosListado, setProductosListado] = useState([])
    const [showPMUM,setShowPMUM]=useState(false)
    const [filtroPMUM,setFiltroPMUM]=useState({activo:false,sucursal:-1,concepto:-1,producto:null})
    const [filtroMM,setFiltroMM]=useState({activo:false,origen:-1,destino:-1,producto:null})
    const [showMM,setShowMM]=useState(false)
    const [showManiobras,setShowManiobras]=useState(false)
    const [viajesNuevos, setViajesNuevos] = useState([]);
    const [showNuevos, setShowNuevos] = useState(true);
    const [openForaneo, setOpenForaneo] = useState(false);
    const [viajeForaneo, setViajeForaneo] = useState({});

    const columnasForaneos = React.useMemo(() => [
        {
            headerName: "Origen",
            field: "idOrigen",
            width: 150,
            flex: 1,
            valueFormatter: ({ value }) => origenesDestinosListado.find((i) => i.m_nIdCiudad === value)?.m_sCiudad
        },
        {
            headerName: "Destino",
            field: "idDestino",
            width: 150,
            flex: 1,
            valueFormatter: ({ value }) => origenesDestinosListado.find((i) => i.m_nIdCiudad === value)?.m_sCiudad
        },
        {
            headerName: "Tipo Medida",
            field: "idTipoMedida",
            width: 100,
            flex: 1,
            valueFormatter: ({ value }) => {
                switch (value){
                    case 1: return "Peso";
                    case 2: return "Pieza";
                    case 3: return "Porcentaje";
                    default: return "";
                }
            }
        },
        {
            headerName: "Flete mínimo",
            field: "fleteMinimo",
            width: 100,
            flex: 1,
        },
        {
            headerName: "Acciones",
            sortable: false,
            filterable: false,
            width: 100,
            field: "",
            align: 'center',
            flex: 1,
            renderCell: (row) => {
                return (
                    <div>
                        <Tooltip title={props.disabled ? "Consultar" : "Modificar"}>
                            <a onClick={() => {handleShowModificar()}} className="btn btn-default btn-xs">
                                <i className="fa fa-external-link" style={{color: "#F9A03E"}}/>
                            </a>
                        </Tooltip>
                        <Tooltip title="Eliminar" disabled={props.disabled}>
                            <a
                                href="#"
                                className="btn btn-default btn-xs"
                                onClick={() => confirmAlert({
                                    title: 'Confirmar Eliminar',
                                    message: '¿Está seguro de eliminar el registro?',
                                    buttons: [
                                        {
                                            label: 'Si',
                                            onClick: () => handleDeleteViajeForaneo(viajeForaneo)
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
                    </div>
                );
            },
        }
    ]);

    const getAllSucursales = () => {
        obtenerSucursales().then(respuesta => {
            setSucursalesListado(respuesta.data)
        })
    }
    const getAllConceptos = () => {
        obtenerConceptosFacturacion().then(respuesta => {
            setConceptosListado(respuesta.data)
        })
    }
    const getAllTiposCalculo = () => {
        obtenerTiposCalculo().then(respuesta => {
            setTiposCalculoListado(respuesta.data)
        })
    }
    const getAllUnidadesMedida = () => {
        obtenerUnidadesMedida().then(respuesta => {
            setUnidadesMedidaListado(respuesta.data.filter(i => i.IdUnidadMedida === 21 || i.IdUnidadMedida === 48 || i.IdUnidadMedida === 38 || i.IdUnidadMedida === 55))
        })
    }
    const getOrigenesDestinos = () => {
        obtenerCiudades().then(respuesta => {
            setOrigenesDestinosListado(respuesta.data)
        })
    }
    const getAllProductos = () => {
        obtenerProductos().then(respuestas => {
            let productosList = respuestas.data.map(p => ({
                m_nIdProducto: p.m_nIdProducto,
                m_nNoProducto: p.m_nNoProducto,
                m_sDescripcion: p.m_sDescripcion,
                m_bActivo: p.m_bActivo
            }))

            productosList.forEach(i => i.numeroDescripcion = `${i.m_nNoProducto}.- ${i.m_sDescripcion}`)
            setProductosListado(productosList.filter(i => i.m_bActivo))
        })
    }
    const getClienteGenerico = () => {
        obtenerClientePublicoGeneral().then(respuesta => {
            setState({
                ...state,
                cliente: respuesta.data
            })
        })
    }

    useEffect(value => {
        getAllSucursales()
        getAllConceptos()
        getAllTiposCalculo()
        getAllUnidadesMedida()
        getAllProductos()
        getOrigenesDestinos()
        if (!props.convenio){
            getClienteGenerico()
        }
    }, [])

    const handleDialogVisible = (isVisible) => {
        setState({
            ...state,
            showDialogClientes: isVisible,
        });
    };

    /**Recibe el cliente seleccionado en el dialogo*/
    const handlePatrocinadorSelected = (row) => {
        if (props.convenio){
            obtenerClienteTieneConvenio(row.m_nIdCliente, 2).then(respuesta => {
                if (respuesta.data.value){
                    showSuccess("El cliente seleccionado ya tiene convenio activo.")
                }else{
                    setState(() => ({
                        ...state,
                        cliente: row,
                        showDialogClientes: false,
                    }))
                }
            })
        }

    }

    const handleOnChange = (event) => {
        setState({
            ...state,
            [event.target.name]: event.target.value,
        })

    }

    const handleChangeViajeLocal = (viaje) => {
        let newViajes = []
        viajesLocalesListado.forEach(i => {
            newViajes.push(i)
        })
        newViajes.forEach(i => {
            if (i.idViaje === viaje.idViaje ){
                i.idViaje = viaje.idViaje
                i.idSucursal = viaje.idSucursal
                i.idTipoMedida = viaje.idTipoMedida
                i.zonas = viaje.zonas
                i.idConcepto = viaje.idConcepto
                i.rangos = viaje.rangos
                i.productos = viaje.productos
            }
        })
        setViajesLocalesListado(newViajes)
    }
    const handleChangeManiobras = (maniobras) => {
        setManiobrasTarifa(maniobras)
    }

    /**
     * Debido a que la ventana de visualización de viaje foráneo se encuentra de forma exterior se guardan los datos
     * del viaje modificado en la ventana en este componente en paralelo, esto para que cuando este componente quiera
     * guardar los datos modificados ya se tengan estos viajes en el state 'viajeForaneo'
     * */
    const handleChangeViajeForaneo = (viaje) => {
        let newViajes = []
        viajesForaneosListado.forEach(i => {
            newViajes.push(i)
        })
        newViajes.forEach(i => {
            if (i.idViaje === viaje.idViaje ){
                i.idOrigen = viaje.idOrigen
                i.idTipoMedida = viaje.idTipoMedida
                i.fleteMinimo = viaje.fleteMinimo
                i.idDestino = viaje.idDestino
                i.grupos = viaje.grupos
            }
        })
        setViajesForaneosListado(newViajes)
    }

    const submmitViajeForaneo = () => {
        let newViajes = []
        viajesForaneosListado.forEach(i => {
            newViajes.push(i)
        })
        newViajes.forEach(i => {
            if (i.idViaje === viajeForaneo.idViaje ){
                i.idOrigen = viajeForaneo.idOrigen
                i.idTipoMedida = viajeForaneo.idTipoMedida
                i.fleteMinimo = viajeForaneo.fleteMinimo
                i.idDestino = viajeForaneo.idDestino
                i.grupos = viajeForaneo.grupos
            }
        })
        setViajesForaneosListado(newViajes);
        setOpenForaneo(false);
    }

    const handleOnAgregarViajeLocal = (e) => {
        e.preventDefault()

        const idGenerated = getRandomId();
        var viajeLocal = [...viajesLocalesListado]
        var viajes = [...viajesNuevos]

        viajeLocal.push({
            idViaje: idGenerated,
            idSucursal: null,
            zonas: [],
            idConcepto: null,
            rangos: [],
            productos: []
        })
        viajes.push(idGenerated);
        setViajesNuevos(viajes);
        setViajesLocalesListado(viajeLocal);
    }

    const handleDeleteViajeLocal = (viaje) => {
        setViajesLocalesListado(viajesLocalesListado.filter(i => i.idViaje !== viaje.idViaje))
        setViajesNuevos(viajesNuevos.filter(i => i !== viaje.idViaje))
    }

    const handleOnAgregarViajeForaneo = () => {
        const idGenerated = getRandomId();
        var viajeForaneo = [...viajesForaneosListado]
        var viajes = [...viajesNuevos]
        viajeForaneo.push({
            idViaje: idGenerated,
            idOrigen: null,
            idTipoMedida: null,
            idDestino: null,
            grupos: [],
        })
        viajes.push(idGenerated);
        setViajesNuevos(viajes);
        setViajesForaneosListado(viajeForaneo)

        setState({...state, idForaneo: idGenerated});
        setViajeForaneo({
            idViaje: idGenerated,
            idOrigen: null,
            idTipoMedida: null,
            idDestino: null,
            grupos: [],
        });
        setOpenForaneo(true);
    }

    const handleDeleteViajeForaneo = (viaje) => {
        let newViajes = []
        viajesForaneosListado.forEach(i => {
            newViajes.push(i)
        })

        setViajesForaneosListado(newViajes.filter(i => i.idViaje !== viaje.idViaje))
    }

    const [showDialogZonas, setShowDialogZonas] = useState(false)
    const handleShowDialogZonas = (show) => {
        setShowDialogZonas(show)
    }
    const handleOnRequestZonasBySucursal = (idSucursal) => {
        obtenerListadoZonaOperativaBySucursal(idSucursal).then(respuesta => {
            setZonasListado(respuesta.data)
            setShowDialogZonas(true)
        })
    }

    const handleOnRequestZonasByDestino = (idDestino) => {
        obtenerListadoZonaOperativaByOrigenDestino(idDestino).then(respuesta => {
            setZonasListado(respuesta.data)
            setShowDialogZonas(true)
        })
    }

    const handleShowModificar = () => {
        setOpenForaneo(true)
    }

    /**Valida que el concepto recibido sea uno de los configurados(en parametros de configuracion) como recoleccion o entrega*/
    const esConceptoViajeLocal = (concepto) => {
        return concepto.m_nIdConceptosFacturacion === props.configuraciones.IdConceptoRecoleccion
        || concepto.m_nIdConceptosFacturacion === props.configuraciones.IdConceptoEntrega
    }

    const esConceptoManiobra = (concepto) => {
        return concepto.m_nIdConceptosFacturacion === props.configuraciones.IdConceptoCarga
        || concepto.m_nIdConceptosFacturacion === props.configuraciones.IdConceptoDescarga
    }

    /**Filtra las zonas para que solo queden las que no se han usado en otro viaje local con la misma sucursal y concepto*/
    const filtrarZonasViajeLocal = (viaje) => {
        let zonasDisponibles = []
        zonasListado.forEach(i => {
            zonasDisponibles.push(i)
        })
        let otrosViajes = viajesLocalesListado.filter(v => v.idViaje !== viaje.idViaje)
        otrosViajes = otrosViajes.filter(v => v.idSucursal === viaje.idSucursal && v.idConcepto === viaje.idConcepto)
        otrosViajes.forEach(v => {
            v.zonas.forEach(z => {
                zonasDisponibles = zonasDisponibles.filter(j => j.m_nIdZona !== z.m_nIdZona)
            })
        })
        return zonasDisponibles
    }
    /**Filtra los productos para que solo queden los que no se han usado en otro viaje local con la misma sucursal, concepto y zona*/
    const filtrarProductosViajeLocal = (viaje) => {
        let productosDisponibles = []
        productosListado.forEach(i => {
            productosDisponibles.push(i)
        })
        let otrosViajes = viajesLocalesListado.filter(v => v.idViaje !== viaje.idViaje)
        otrosViajes = otrosViajes.filter(v => v.idSucursal === viaje.idSucursal && v.idConcepto === viaje.idConcepto)

        viaje.zonas.forEach(zonaViajeActual => {
            otrosViajes.forEach(v => {
                if (v.zonas.some(i => i.m_nIdZona === zonaViajeActual.m_nIdZona)){
                    otrosViajes.forEach(v => {
                        v.productos.forEach(z => {
                            productosDisponibles = productosDisponibles.filter(j => j.m_nIdProducto !== z.m_nIdProducto)
                        })
                    })
                }
            })
        })

        return productosDisponibles
    }

    /**Filtra los conceptos para que solo queden las que no se han usado en otro viaje local con la misma sucursal*/
    const filtrarConceptosViajeLocal = conceptosListado.filter(concepto => esConceptoViajeLocal(concepto))

    const filtrarUnidadesMedidaViajeLocal = unidadesMedidaListado.filter(i => i.IdUnidadMedida === 21 || i.IdUnidadMedida === 48 || i.IdUnidadMedida === 38)

    const filtrarUnidadesMedidaManiobras = unidadesMedidaListado.filter(i => i.IdUnidadMedida === 21 || i.IdUnidadMedida === 48)
    const filtrarTiposCalculoManiobras = tiposCalculoListado.filter(i => i.m_nIdTarifaTipoCalculo === 1 || i.m_nIdTarifaTipoCalculo === 2)

    const validaSucursalYConceptoViajeLocal = () => {
        let valid = true
        viajesLocalesListado.forEach(v => {
            if (!v.idSucursal || !v.idTipoMedida || !v.idConcepto){
                valid = false
            }
        })
        return valid
    }

    const validaOrigenDestinoMedidaViajeForaneo = () => {
        let valid = true
        viajesForaneosListado.forEach(v => {
            if (!v.idOrigen || !v.idTipoMedida || !v.idDestino){
                valid = false
            }
        })
        return valid
    }

    const validaCliente = () => {
        return state.cliente?.m_nIdCliente > 0
    }

    const validaVigencia = () => {
        return state.vigencia !== null
    }



    const handleGuardarTarifa = (event) => {
        if (!validaCliente()){
            if (props.convenio){
                showSuccess("El cliente es un dato necesario")
            }else{
                showSuccess("El cliente es un dato necesario. Verifique que se encuentra dado de alta un cliente con nombre \"PUBLICO EN GENERAL\" en el sistema")
            }
            return
        }
        if (!validaVigencia()){
            showSuccess("La vigencia es un dato necesario")
            return
        }
        if (!validaSucursalYConceptoViajeLocal()){
            showSuccess("No pueden guardar primera milla o última milla sin sucursal, tipo de medida o concepto")
            return
        }
        if (!validaOrigenDestinoMedidaViajeForaneo()){
            showSuccess("No pueden guardar milla intermedia sin origen, destino o tipo de medida")
            return
        }
        if (viajesLocalesListado.length === 0){
            showSuccess("No puede guardar una tarifa sin primera o última milla")
            return
        }
        const isConceptosEmpty = (element) => element.rangos.length === 0;
        const isZonasEmpty = (element) => element.zonas.length === 0;
        const isProductosEmpty = (element) => element.productos.length === 0;

        if (viajesLocalesListado.some(isConceptosEmpty)){
            showSuccess("No puede guardar una primera o última milla sin rangos")
            return
        }
        if (viajesLocalesListado.some(isZonasEmpty)){
            showSuccess("No puede guardar una primera o última milla sin zonas")
            return
        }
        if (viajesLocalesListado.some(isProductosEmpty)){
            showSuccess("No puede guardar una primera o última milla sin productos")
            return
        }
        if (props.configuraciones.CobrarConceptoCarga){
            if (maniobrasTarifa.filter(i => i.idConcepto === props.configuraciones.IdConceptoCarga).length === 0){
                showSuccess("La configuración actual no permite guardar una tarifa sin maniobra de carga.")
                return
            }
        }
        if (props.configuraciones.CobrarConceptoDescarga){
            if (maniobrasTarifa.filter(i => i.idConcepto === props.configuraciones.IdConceptoDescarga).length === 0){
                showSuccess("La configuración actual no permite guardar una tarifa sin maniobra de descarga.")
                return
            }
        }
        if (viajesForaneosListado.length === 0){
            showSuccess("No puede guardar una tarifa sin milla intermedia")
            return
        }
        const isGruposConceptosEmpty = (element) => element.grupos.some(grupo => grupo.rangos.length === 0);
        const isGruposZonasEmpty = (element) => element.grupos.some(grupo => grupo.zonas.length === 0);
        const isGruposProductosEmpty = (element) => element.grupos.some(grupo => grupo.productos.length === 0);
        const isGruposEmpty = (element) => element.grupos.length === 0;
        if (viajesForaneosListado.some(isGruposEmpty)){
            showSuccess("No puede guardar una milla intermedia sin grupos")
            return
        }
        if (viajesForaneosListado.some(isGruposConceptosEmpty)){
            showSuccess("No puede guardar una milla intermedia sin rangos")
            return
        }
        if (viajesForaneosListado.some(isGruposZonasEmpty)){
            showSuccess("No puede guardar una milla intermedia sin zonas")
            return
        }
        if (viajesForaneosListado.some(isGruposProductosEmpty)){
            showSuccess("No puede guardar una milla intermedia sin productos")
            return
        }
        viajesLocalesListado.forEach(v => {
            v.conceptos = v.rangos.map(rango => ({
                    idConceptoFacturacion: v.idConcepto,
                    importe: rango.importe,
                    minimo: rango.minimo,
                    maximo: rango.maximo,
                    idTipoCalculo: rango.idTipoCalculo,
                    idUnidadMedida: rango.idUnidadMedida
                })
            )
            v.zonas.forEach(zona => {
                zona.idZonaOperativa = zona.m_nIdZona
            })
            v.productos.forEach(prod => {
                prod.idProducto = prod.m_nIdProducto
            })
        })
        viajesForaneosListado.forEach(v => {
            v.grupos.forEach(g => {
                g.conceptos = g.rangos.map(rango => ({
                        idConceptoFacturacion: props.configuraciones.IdConceptoFlete,
                        importe: rango.importe || 0,
                        minimo: rango.minimo || 0,
                        maximo: rango.maximo || 0,
                        idTipoCalculo: rango.idTipoCalculo || 0,
                        idUnidadMedida: rango.idUnidadMedida,
                        porcentaje: rango.porcentaje || 0,

                    })
                )
                g.zonas.forEach(zona => {
                    zona.idZonaOperativa = zona.m_nIdZona
                })
                g.productos.forEach(prod => {
                    prod.idProducto = prod.m_nIdProducto
                })
            })
        })
        let maniobrasChidas = []
        maniobrasChidas = maniobrasTarifa.map(rango => ({
                idConceptoFacturacion: rango.idConcepto,
                importe: rango.importe,
                minimo: rango.minimo,
                maximo: rango.maximo,
                idTipoCalculo: rango.idTipoCalculo,
                idUnidadMedida: rango.idUnidadMedida
            })
        )

        let params = {
            idTarifa: state.idTarifa,
            vigencia: state.vigencia,
            cuotaMensual: state.cuotaMensual,
            idCliente: state.cliente.m_nIdCliente,
            viajesLocales: viajesLocalesListado,
            maniobras: maniobrasChidas,
            viajesForaneos: viajesForaneosListado,
        }
        console.log(params)
        console.log(JSON.stringify(params))

        if (state.idTarifa === 0){
            props.agregarTarifa(params)
        }else{
            props.modificarTarifa(params)
        }

    }

    const handleShowDialogTarifas = () => {

        setState({...state, showDialogTarifas: true})

    }
    const handleCloseDialogTarifas = (value) => {
        setState(state => {
            return {...state, showDialogTarifas: false}
        })
        if (value !== null){
            obtenerTarifaRangosById(value.IdTarifa).then(respuesta => {
                let selection = setDataParaConsultar(respuesta.data)
                setViajesLocalesListado(selection?.viajesLocales)
                setManiobrasTarifa(selection?.maniobras)
                setViajesForaneosListado(selection?.viajesForaneos)
            })

        }

    }

    const setDataParaConsultar = (data) => {
        let viajesLocales = data.ViajesLocales.map(viaje => ({
            idViaje: viaje.IdViajeLocal,
            idSucursal: viaje.IdSucursal,
            idTipoMedida: viaje.IdTipoMedida,
            zonas: data.Zonas.filter(i => i.IdViajeLocal === viaje.IdViajeLocal).map(j => ({
                m_nIdZona: j.IdZonaOperativa,
                m_sCodigoZona: j.CodigoZona
            })),
            idConcepto: viaje.IdConcepto,
            rangos: data.Conceptos.filter(i => i.IdViajeLocal === viaje.IdViajeLocal).map(rango => ({
                id: rango?.IdTarifaConcepto || Math.floor(Math.random() * 10000),
                idConcepto: rango.IdConceptoFacturacion || null,
                concepto: rango.ConceptoFacturacion || '',
                importe: rango.Importe || 0,
                minimo: rango.Minimo || 0,
                maximo: rango.Maximo || 0,
                idTipoCalculo: rango.IdTipoCalculo || null,
                idUnidadMedida: rango.IdUnidadMedida || null,
                tipoCalculo: rango.TipoCalculo || '',
                unidadMedida: rango.UnidadMedida || '',
            })),
            productos: data.Productos.filter(i => i.IdViajeLocal === viaje.IdViajeLocal).map(j => ({
                m_nIdProducto: j.IdProducto,
                m_sDescripcion: j.Descripcion,
                m_nNoProducto: j.NoProducto,
                m_bActivo: j.Activo
            })),
        }))
        let maniobras = data.Conceptos.filter(i => i.IdTarifa === data.IdTarifa).map(rango => ({
            id: rango?.IdTarifaConcepto || Math.floor(Math.random() * 10000),
            idConcepto: rango.IdConceptoFacturacion || null,
            concepto: rango.ConceptoFacturacion || '',
            importe: rango.Importe || 0,
            minimo: rango.Minimo || 0,
            maximo: rango.Maximo || 0,
            idTipoCalculo: rango.IdTipoCalculo || null,
            idUnidadMedida: rango.IdUnidadMedida || null,
            tipoCalculo: rango.TipoCalculo || '',
            unidadMedida: rango.UnidadMedida || '',
        }))

        let viajesForaneos = data.ViajesForaneos.map(viaje => ({
            idViaje: viaje.IdViajeForaneo || getRandomId(),
            idOrigen: viaje.IdOrigen || null,
            idTipoMedida: viaje.IdTipoMedida || null,
            idDestino: viaje.IdDestino || null,
            grupos: data.Grupos.filter(i => i.IdViajeForaneo === viaje.IdViajeForaneo).map(grupo => ({
                idGrupo: grupo.IdViajeForaneoGrupo || Math.floor(Math.random() * 10000),
                nombre: grupo.Referencia || '',
                zonas: data.Zonas.filter(i => i.IdViajeForaneoGrupo === grupo.IdViajeForaneoGrupo).map(j => ({
                    m_nIdZona: j.IdZonaOperativa,
                    m_sCodigoZona: j.CodigoZona
                })),
                rangos: data.Conceptos.filter(i => i.IdViajeForaneoGrupo === grupo.IdViajeForaneoGrupo).map(rango => ({
                    id: rango?.IdTarifaConcepto || Math.floor(Math.random() * 10000),
                    idConcepto: rango.IdConceptoFacturacion || null,
                    concepto: rango.ConceptoFacturacion || '',
                    importe: rango.Importe || 0,
                    minimo: rango.Minimo || 0,
                    maximo: rango.Maximo || 0,
                    idTipoCalculo: rango.IdTipoCalculo || null,
                    idUnidadMedida: rango.IdUnidadMedida || null,
                    tipoCalculo: rango.TipoCalculo || '',
                    unidadMedida: rango.UnidadMedida || '',
                    porcentaje: rango.Porcentaje || 0,
                })),
                productos: data.Productos.filter(i => i.IdViajeForaneoGrupo === grupo.IdViajeForaneoGrupo).map(j => ({
                    m_nIdProducto: j.IdProducto,
                    m_sDescripcion: j.Descripcion,
                    m_nNoProducto: j.NoProducto,
                    m_bActivo: j.Activo
                })),
            })),
        }))
        let tarifa = {
            idTarifa: data.IdTarifa,
            cliente: {
                m_nIdCliente: data.IdCliente,
                m_sNombreFiscal: data.Cliente
            },
            vigencia: data.Vigencia,
            cuotaMensual: data.CuotaMensual,
            viajesLocales: viajesLocales,
            maniobras: maniobras,
            viajesForaneos: viajesForaneos
        }

        return tarifa

    }

    const getRows = () => {
        if(filtroMM.activo){
            return viajesForaneosListado.filter(v => (
                        (filtroMM.origen!=-1 ? v.idOrigen==filtroMM.origen : true) &&
                        (filtroMM.destino!=-1 ? v.idDestino==filtroMM.destino : true) &&
                        (filtroMM.producto!=null ?
                            (v.grupos.filter(g=> g.productos.filter(p=>p.m_nIdProducto==filtroMM.producto.m_nIdProducto ).length > 0).length > 0)
                            :
                            true
                        )
                    ) || (showNuevos && viajesNuevos.includes(v.idViaje)) )
        }else{
            return viajesForaneosListado;
        }
    }

    return (
        <div>
            <Dialog
                open={state.showDialogClientes}
                onClose={() => setState({...state, showDialogClientes: false})}
                fullWidth maxWidth="md"
            >
                <DialogContent>
                    <div className="row" style={{backgroundColor: '#FFFFFF'}}>
                        <DialogTableClientes dialogVisible={handleDialogVisible } handlePatrocinadorSelected={handlePatrocinadorSelected}/>
                    </div>
                </DialogContent>
            </Dialog>
            <DialogSelectList
                open={state.showDialogTarifas}
                onClose={handleCloseDialogTarifas}
                rows={props.tarifasListado}
            />
            <Dialog open={openForaneo} onClose={() => setOpenForaneo(false)} fullWidth maxWidth="100%">
                <DialogTitle>
                    Viaje Milla Intermedia
                </DialogTitle>
                <DialogContent style={{minHeight: '500px'}}>
                    <ViajeForaneo
                        key={state.idForaneo}
                        viaje={viajeForaneo}
                        origenesDestinosListado={origenesDestinosListado}
                        handleChangeViajeForaneo={handleChangeViajeForaneo}
                        tiposCalculoListado={tiposCalculoListado}
                        unidadesMedidaListado={unidadesMedidaListado}
                        handleDeleteViajeForaneo={handleDeleteViajeForaneo}
                        zonasListado={zonasListado}
                        onRequestZonasByDestino={handleOnRequestZonasByDestino}
                        productosListado={productosListado}
                        disabled={props.disabled}
                        showDialogZonas={showDialogZonas}
                        handleShowDialogZonas={handleShowDialogZonas}
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => {
                        setOpenForaneo(false);
                        setViajeForaneo(viajesForaneosListado.find(i => i.idViaje === state.idForaneo));
                    }} style={{fontSize: '1em'}}>
                        Cerrar
                    </Button>
                    {/*<Button onClick={() => submmitViajeForaneo()}*/}
                    {/*        color={"primary"} style={{fontSize: '1em'}}>*/}
                    {/*    Guardar*/}
                    {/*</Button>*/}
                </DialogActions>
            </Dialog>
            <div>
                <Paper style={{padding: '20px', marginBottom: '10px'}}>

                    <Grid container spacing={2}>
                        <Grid item xs={12}>
                            <Typography variant="h3" component="h2">
                                Tarifa
                            </Typography>
                        </Grid>
                        <Grid item xs={3}>
                            <TextField
                                variant="outlined"
                                label="Responsable de pago"
                                size="small"
                                required
                                value={state.cliente?.m_sNombreFiscal}
                                placeholder={"No. Cliente: Nombre fiscal"}
                                InputLabelProps={{shrink: true}}
                                onClick={(props.disabled || !props.convenio) ?
                                    () => {
                                        return
                                    } : (() => {
                                        setState({...state, showDialogClientes: true})
                                    })}
                                disabled={props.disabled || !props.convenio}
                            />
                        </Grid>
                        <Grid item xs={2}>
                            <TextField
                                variant="outlined"
                                id="vigencia"
                                name="vigencia"
                                label="Vigencia"
                                fullWidth
                                type="date"
                                onChange={handleOnChange}
                                value={state.vigencia}
                                className={"form-control"}
                                InputProps={{inputProps: { min: getCurrentDate()}}}
                                disabled={props.disabled}
                                onKeyDown={(e) => e.preventDefault()}
                                InputLabelProps={{shrink: true}}
                                required
                            />
                        </Grid>
                        {
                            props.convenio &&
                            <Grid item xs={2}>
                                <TextField
                                    variant="outlined"
                                    label="Cuota mensual"
                                    size="small"
                                    required
                                    name={"cuotaMensual"}
                                    type="number"
                                    value={state.cuotaMensual}
                                    disabled={props.disabled}
                                    onChange={handleOnChange}
                                />
                            </Grid>
                        }
                        <Grid item xs={2}>
                            <Button size={"large"} style={{fontSize:".9em"}} fullWidth onClick={handleShowDialogTarifas} variant={"outlined"} disabled={props.disabled} color={"primary"}
                            >Importar tarifa existente</Button>
                        </Grid>
                        <Grid item xs>
                            <label className="input select">
                                <StyledEngineProvider injectFirst>
                                    <FormControlLabel
                                        control={
                                            <Switch
                                                checked={showNuevos}
                                                onChange={(e) => setShowNuevos(e.target.checked)}
                                                disabled={props.disabled}
                                                name="mostrarNuevos"
                                                color="primary"
                                            />
                                        }
                                        label="Mostrar siempre viajes recién creados"
                                    />
                                </StyledEngineProvider>
                            </label>
                        </Grid>

                    </Grid>
                </Paper>
                <Paper style={{padding: '20px', marginBottom: '10px'}}>
                    <Grid container spacing={1}>
                        <Grid item xs={2}>
                            <Typography variant="h3" component="h2">
                                Primera Milla y Última Milla
                            </Typography>
                        </Grid>
                        <Grid item xs={1}>
                            <IconButton
                                onClick={()=> {setShowPMUM(showPMUM?false:true); document.querySelector('.PMUM').classList.toggle('hide')}}
                                className='btn-secondary'
                                size="large">
                                {showPMUM?
                                    <ExpandLess fontSize='default'/>
                                :
                                    <ExpandMoreIcon fontSize='default'/>
                                }

                            </IconButton>
                        </Grid>
                        <Grid item xs={2}>
                            <FormControl fullWidth variant='outlined' size="small">
                                <InputLabel
                                    id="sucLabel">Sucursal</InputLabel>
                            <Select value={filtroPMUM.sucursal}
                                    onChange={(e)=>{
                                        //setSucursalesListado(sucursalesListado.filter(i => i.m_nIdSucursal === e.target.value))
                                        setFiltroPMUM({...filtroPMUM, sucursal: e.target.value})
                                    }}
                                    //onClick={(e) => getAllSucursales()}
                                    labelId='sucLabel'
                                    label=''>
                                <MenuItem value={-1}>{'Sin Filtro'}</MenuItem>
                                {
                                    sucursalesListado &&
                                    sucursalesListado.map(suc=>{
                                        return <MenuItem value={suc.m_nIdSucursal}>{suc.m_sSucursal}</MenuItem>
                                    })
                                }
                            </Select>
                            </FormControl>
                            </Grid>
                        <Grid item xs={2}>
                            <FormControl fullWidth variant='outlined' size="small">
                                <InputLabel
                                    id="conceptoLabel">Concepto</InputLabel>
                                <Select value={filtroPMUM.concepto}
                                        onChange={(e)=>{
                                            //setConceptosListado(conceptosListado.filter(i => i.m_nIdConceptosFacturacion === e.target.value));
                                            setFiltroPMUM({...filtroPMUM,concepto: e.target.value})
                                        }}
                                        labelId='conceptoLabel'
                                        //onClick={(e) => {getAllConceptos();}}
                                        label=''>
                                    <MenuItem value={-1}>{'Sin Filtro'}</MenuItem>
                                    {
                                        conceptosListado &&
                                        filtrarConceptosViajeLocal.map(item=>{
                                            return <MenuItem value={item.m_nIdConceptosFacturacion}>{item.m_sConcepto}</MenuItem>
                                        })
                                    }
                                </Select>
                            </FormControl>
                        </Grid>
                        <Grid item xs={2}>
                            <Autocomplete
                                freeSolo
                                size="small"
                                value={filtroPMUM.producto}
                                onChange={(e,newValue)=>{
                                    /*getAllProductos();
                                    setProductosListado(productosListado.filter(i => i.m_nIdConceptosFacturacion === e.target.value));*/
                                    setFiltroPMUM({...filtroPMUM,producto: newValue})
                                }}
                                id="PMUM_Productos"
                                forcePopupIcon={false}
                                options={productosListado}
                                filterOptions={filterOptions}
                                getOptionLabel={(option) =>
                                    option.numeroDescripcion
                                }
                                variant="outlined"
                                renderInput={(params) => (
                                    <div>
                                        <TextField
                                            variant="outlined"
                                            label="Producto"
                                            size="small"
                                            className="form-control"
                                            {...params}
                                            InputProps={{
                                                ...params.InputProps,
                                                type: "search",
                                                disableUnderline: true,
                                            }}
                                        />
                                    </div>
                                )}
                            />
                        </Grid>
                        <Grid item xs={1}>
                            <IconButton onClick={()=> {
                                setFiltroPMUM({...filtroPMUM, activo: true})
                            }} size="large">
                                <SearchIcon size="small" fontSize='large'/>
                            </IconButton>
                            /
                            <Tooltip title='Quitar Filtro'>
                            <IconButton onClick={()=>setFiltroPMUM({...filtroPMUM,activo:false})} size="large">
                                <Clear size="small" fontSize='large'/>
                            </IconButton>
                            </Tooltip>
                        </Grid>
                        <Grid item xs={2}>
                            <Button fullWidth variant={"contained"} color={"primary"} onClick={handleOnAgregarViajeLocal} disabled={props.disabled}>
                                <AddIcon fontSize={'large'} />
                                &nbsp;&nbsp;Agregar viaje
                            </Button>
                        </Grid>
                    </Grid>
                    <div className='PMUM hide'>
                    {
                        (filtroPMUM.activo ?
                            viajesLocalesListado.filter(v =>
                                (
                                (filtroPMUM.sucursal!=-1 ? v.idSucursal==filtroPMUM.sucursal : true)
                                && (filtroPMUM.concepto!=-1 ? v.idConcepto==filtroPMUM.concepto : true)
                                && v.productos.filter(prod=>(filtroPMUM.producto!=null ? prod.m_nIdProducto==filtroPMUM.producto.m_nIdProducto : true)).length > 0
                                )
                                || (showNuevos && viajesNuevos.includes(v.idViaje)) ) //No vamos a filtrar los viajes nuevos
                            : viajesLocalesListado).map((viaje) =>
                            <ViajeLocal
                                key={viaje.idViaje}
                                viaje={viaje}
                                sucursalesListado={sucursalesListado}
                                handleChangeViajeLocal={handleChangeViajeLocal}
                                conceptosListado={filtrarConceptosViajeLocal}
                                tiposCalculoListado={tiposCalculoListado}
                                unidadesMedidaListado={filtrarUnidadesMedidaViajeLocal}
                                handleDeleteViajeLocal={handleDeleteViajeLocal}
                                zonasListado={zonasListado}
                                onRequestZonasBySucursal={handleOnRequestZonasBySucursal}
                                productosListado={filtrarProductosViajeLocal(viaje)}
                                disabled={props.disabled}
                                showDialogZonas={showDialogZonas}
                                handleShowDialogZonas={handleShowDialogZonas}
                            />
                        )
                    }
                    </div>
                </Paper>
                <Paper style={{padding: '20px', marginBottom: '10px'}}>
                    <Typography variant="h3" component="h2">
                        Maniobras
                        <IconButton
                            style={{marginLeft:'10.5%'}}
                            onClick={()=> {setShowManiobras(showManiobras?false:true); document.querySelector('.MAN').classList.toggle('hide')}}
                            className='btn-secondary'
                            size="large">
                            {showManiobras?
                                <ExpandLess fontSize='default'/>
                                :
                                <ExpandMoreIcon fontSize='default'/>
                            }

                        </IconButton>
                    </Typography>
                    <div className='MAN hide'>
                    <Maniobras
                        handleChangeManiobras={handleChangeManiobras}
                        conceptosListado={conceptosListado.filter(concepto => esConceptoManiobra(concepto))}
                        tiposCalculoListado={filtrarTiposCalculoManiobras}
                        unidadesMedidaListado={filtrarUnidadesMedidaManiobras}
                        rangos={maniobrasTarifa}
                        disabled={props.disabled}
                    />
                    </div>
                </Paper>
                <Paper style={{padding: '20px'}}>
                    <Grid container spacing={2}>
                        <Grid item xs={2}>
                            <Typography variant="h3" component="h2">
                                Milla Intermedia
                            </Typography>
                        </Grid>
                        <Grid item xs={1}>
                            <IconButton
                                onClick={()=> {setShowMM(showMM?false:true); document.querySelector('.MM').classList.toggle('hide')}}
                                className='btn-secondary'
                                size="large">
                                {showMM?
                                    <ExpandLess fontSize='default'/>
                                    :
                                    <ExpandMoreIcon fontSize='default'/>
                                }

                            </IconButton>
                        </Grid>
                        <Grid item xs={2}>
                            <FormControl fullWidth variant='outlined' size="small">
                                <InputLabel
                                    id="origenLbl">Origen</InputLabel>
                                <Select value={filtroMM.origen} onChange={(e)=>setFiltroMM({...filtroMM,origen: e.target.value})} labelId='origenLbl' label=''>
                                    <MenuItem value={-1}>{'Sin Filtro'}</MenuItem>
                                    {origenesDestinosListado.map(item=>{
                                        return <MenuItem value={item.m_nIdCiudad}>{item.m_sCiudad}</MenuItem>
                                    })}
                                </Select>
                            </FormControl>
                        </Grid>
                        <Grid item xs={2}>
                            <FormControl fullWidth variant='outlined' size="small">
                                <InputLabel
                                    id="destLabel">Destino</InputLabel>
                                <Select value={filtroMM.destino} onChange={(e)=>setFiltroMM({...filtroMM,destino: e.target.value})} labelId='destLabel' label=''>
                                    <MenuItem value={-1}>{'Sin Filtro'}</MenuItem>
                                    {origenesDestinosListado.map(item=>{
                                        return <MenuItem value={item.m_nIdCiudad}>{item.m_sCiudad}</MenuItem>
                                    })}
                                </Select>
                            </FormControl>
                        </Grid>
                        <Grid item xs={2}>
                            <Autocomplete
                                freeSolo
                                size="small"
                                value={filtroMM.producto}
                                onChange={(e,newValue)=>setFiltroMM({...filtroMM,producto: newValue})}
                                id="MM_Prod"
                                forcePopupIcon={false}
                                options={productosListado}
                                getOptionLabel={(option) =>
                                    option.numeroDescripcion
                                }
                                variant="outlined"
                                renderInput={(params) => (
                                    <div>
                                        <TextField
                                            variant="outlined"
                                            label="Producto"
                                            size="small"
                                            className="form-control"
                                            {...params}
                                            InputProps={{
                                                ...params.InputProps,
                                                type: "search",
                                                disableUnderline: true,
                                            }}
                                        />
                                    </div>
                                )}
                            />
                        </Grid>
                        <Grid item xs={1}>
                            <IconButton onClick={()=>setFiltroMM({...filtroMM,activo:true})} size="large">
                                <SearchIcon size="small" fontSize='large'/>
                            </IconButton>
                            /
                            <Tooltip title='Quitar Filtro'>
                                <IconButton onClick={()=>setFiltroMM({...filtroMM,activo:false})} size="large">
                                    <Clear size="small" fontSize='large'/>
                                </IconButton>
                            </Tooltip>
                        </Grid>
                        <Grid item xs={2}>
                            <Button fullWidth variant={"contained"} color={"primary"} onClick={handleOnAgregarViajeForaneo} disabled={props.disabled}>
                                <AddIcon fontSize={'large'} />
                                &nbsp;&nbsp;Agregar viaje
                            </Button>
                        </Grid>
                    </Grid>
                    <div className='MM hide'>
                        <div align={"center"} style={{marginLeft: "15%", width:"60%"}} >
                            {
                                viajesForaneosListado &&
                                <DataGrid
                                    columns={columnasForaneos}
                                    rows={getRows()}
                                    locateText={dataGridLocaleText}
                                    pagination
                                    pageSize={20}
                                    getRowId={(row) => row.idViaje}
                                    autoHeight={true}
                                    getRowClassName={(params) => {
                                        return (params.row.idTipoMedida === null || params.row.idOrigen === null ||
                                            params.row.idDestino === null) ? "highlight" : "";
                                    }}
                                    sx={{
                                        ".highlight": {
                                            bgcolor: "#87de9e"
                                        },
                                    }}
                                    onRowSelectionModelChange={(newModel)=>{
                                        if(newModel.length<1)
                                            return;
                                        setState({...state, idForaneo: newModel[0]});
                                        setViajeForaneo(viajesForaneosListado.find(i => i.idViaje === newModel[0]));
                                    }}
                                />
                            }
                        </div>
                    {/*
                        (
                            filtroMM.activo ?
                                viajesForaneosListado.filter(v => (
                                (filtroMM.origen!=-1 ? v.idOrigen==filtroMM.origen : true) &&
                                (filtroMM.destino!=-1 ? v.idDestino==filtroMM.destino : true) &&
                                (filtroMM.producto!=null ?
                                    (v.grupos.filter(g=> g.productos.filter(p=>p.m_nIdProducto==filtroMM.producto.m_nIdProducto ).length > 0).length > 0)
                                    :
                                    true
                                )
                                ) || (showNuevos && viajesNuevos.includes(v.idViaje)) )
                            : viajesForaneosListado).map((viaje) =>
                            <ViajeForaneo
                                key={viaje.idViaje}
                                viaje={viaje}
                                origenesDestinosListado={origenesDestinosListado}
                                handleChangeViajeForaneo={handleChangeViajeForaneo}
                                tiposCalculoListado={tiposCalculoListado}
                                unidadesMedidaListado={unidadesMedidaListado}
                                handleDeleteViajeForaneo={handleDeleteViajeForaneo}
                                zonasListado={zonasListado}
                                onRequestZonasByDestino={handleOnRequestZonasByDestino}
                                productosListado={productosListado}
                                disabled={props.disabled}
                                showDialogZonas={showDialogZonas}
                                handleShowDialogZonas={handleShowDialogZonas}
                            />
                        )*/
                    }
                    </div>
                </Paper>
                <br/>
                <Button sx={{position:'fixed', bottom:'10px', width:'96%'}} fullWidth variant={"contained"} onClick={handleGuardarTarifa} color={"primary"} disabled={props.disabled}>
                    Guardar
                </Button>

            </div>

        </div>
    );
}

function DialogSelectList(props) {
    const { onClose, open } = props;

    const handleClose = () => {
        setSearch("")
        onClose(null);
    };

    const handleListItemClick = (value) => {
        setSearch("")
        onClose(value);
    };

    const [search, setSearch] = useState("")
    const [dataFiltered, setDataFiltered] = useState(props.rows)
    const handleOnChangeSearch = (event) => {
        setSearch(event.target.value)
    }

    const handleSearch = () => {
        if (search.length === 0 ){
            setDataFiltered(props.rows)
        }else{
            setDataFiltered(props.rows.filter(i => i.Cliente.toLowerCase().includes(search.toLowerCase())))
        }
    }

    return (
        <Dialog onClose={handleClose} aria-labelledby="simple-dialog-title" open={open} fullWidth={true}
                maxWidth={'md'}>
            <DialogTitle id="simple-dialog-title">Selecciona la tarifa para importar los datos</DialogTitle>
            <DialogContent>
                <Grid container spacing={1}>
                    <Grid item xs={11}>
                        <TextField variant="outlined" size="small"
                                   onChange={handleOnChangeSearch}
                                   label="Buscar"
                                   value={search}
                                   name="search"
                        />
                    </Grid>
                    <Grid item xs={1}>
                        <Button onClick={handleSearch} color="primary" variant={"contained"} fullWidth>
                            Buscar
                        </Button>
                    </Grid>
                </Grid>
                <List>
                    {dataFiltered.map((row) => (
                        <ListItem button onClick={() => handleListItemClick(row)} key={row.IdTarifa}>
                            <ListItemText primary={row.Cliente} />
                        </ListItem>
                    ))}
                </List>
            </DialogContent>

        </Dialog>
    );
}




