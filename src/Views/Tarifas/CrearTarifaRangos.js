import React, {useEffect, useState} from 'react';
import {
    Accordion,
    AccordionDetails,
    AccordionSummary,
    Button, Dialog, DialogActions, DialogContent,
    Grid, makeStyles,
    MenuItem,
    Paper,
    TextField
} from "@material-ui/core";
import Typography from "@material-ui/core/Typography";
import {obtenerSucursales} from "../../Util/Contexts/SucursalContext";
import {
    obtenerConceptosFacturacion,
    obtenerImpuestosByConceptosFacturacion
} from "../../Util/Contexts/ConceptosFacturacionContext";
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import {
    obtenerListadoZonaOperativaByOrigenDestino,
    obtenerListadoZonaOperativaBySucursal
} from "../../Util/Contexts/ZonaOperativaContext";
import {DataGrid} from "@material-ui/data-grid";
import {dataGridLocaleText} from "../../Constants";
import SvgIcon from "@material-ui/core/SvgIcon";
import {ReactComponent as Activo} from "../../iconos/Menu/palomita.svg";
import {ReactComponent as NoActivo} from "../../iconos/Menu/cruz.svg";
import {getCurrentDate, getRandomId, getUniqueListBy} from "../../Util/Util";
import DialogCheckbox from "./DialogCheckbox";
import DialogoNuevoRango from "./DialogoNuevoRango";
import {obtenerTiposCalculo} from "../../Util/Contexts/TipoCalculoContext";
import IconButton from "@material-ui/core/IconButton";
import EditIcon from "@material-ui/icons/Edit";
import DeleteIcon from "@material-ui/icons/Delete";
import {obtenerImpuestos} from "../../Util/Contexts/ImpuestosContext";
import axios from "axios";
import DialogoNuevoConcepto from "./DialogoNuevoConcepto";
import ViajeLocal from "./ViajeLocal";
import RangosTarifa from "./RangosTarifa";
import Maniobras from "./Maniobras";
import {obtenerProductos} from "../../Util/Contexts/ProductosContext";
import ViajeForaneo from "./ViajeForaneo";
import {obtenerCiudades} from "../../Util/Contexts/CiudadesContext";
import AddIcon from '@material-ui/icons/AddBox';
import Noty from "noty";
import {agregarTarifaRangos, modificarTarifaRangos} from "../../Util/Contexts/TarifasContext";
import DialogTableClientes from "../Clientes/DialogTableClientes";
import {obtenerClienteById} from "../../Util/Contexts/ClientesContext";
import {obtenerUnidadesMedida} from "../../Util/Contexts/UnidadesMedidaContext";

function showSuccess(mensaje) {
    new Noty({
        type: "information",
        layout: "topCenter",
        text: mensaje,
        timeout: "3000"
    }).show()
}

export default function CrearTarifaRangos(props) {
    const [state, setState] = useState({
        idTarifa: props.selection?.idTarifa || 0,
        vigencia: props.selection?.vigencia || getCurrentDate(),
        activo: props.selection?.activo || true,
        cliente: props.selection?.cliente || null,
        showDialogClientes: false
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

    const getAllSucursales = () => {
        if (sucursalesListado.length > 0){
            return
        }
        obtenerSucursales().then(respuesta => {
            setSucursalesListado(respuesta.data)
        })
    }
    const getAllConceptos = () => {
        if (conceptosListado.length > 0){
            return
        }
        obtenerConceptosFacturacion().then(respuesta => {
            setConceptosListado(respuesta.data)
        })
    }
    const getAllTiposCalculo = () => {
        if (tiposCalculoListado.length > 0){
            return
        }
        obtenerTiposCalculo().then(respuesta => {
            setTiposCalculoListado(respuesta.data)
        })
    }
    const getAllUnidadesMedida = () => {
        if (unidadesMedidaListado.length > 0){
            return
        }
        obtenerUnidadesMedida().then(respuesta => {
            setUnidadesMedidaListado(respuesta.data.filter(i => i.IdUnidadMedida === 21 || i.IdUnidadMedida === 48 || i.IdUnidadMedida === 38))
        })
    }
    const getOrigenesDestinos = () => {
        if (origenesDestinosListado.length > 0){
            return
        }
        obtenerCiudades().then(respuesta => {
            setOrigenesDestinosListado(respuesta.data)
        })
    }
    const getAllProductos = () => {
        if (productosListado.length > 0){
            return
        }
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
        obtenerClienteById(3140).then(respuesta => {
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
        getClienteGenerico()
    }, [])

    const handleDialogVisible = (isVisible) => {
        setState({
            ...state,
            showDialogClientes: isVisible,
        });
    };

    const handlePatrocinadorSelected = (row) => {
        console.log(row)
        setState(() => ({
            ...state,
            cliente: row.data,
            showDialogClientes: false,
        }))
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

    const handleChangeViajeForaneo = (viaje) => {
        let newViajes = []
        viajesForaneosListado.forEach(i => {
            newViajes.push(i)
        })
        newViajes.forEach(i => {
            if (i.idViaje === viaje.idViaje ){
                i.idOrigen = viaje.idOrigen
                i.idTipoMedida = viaje.idTipoMedida
                i.idDestino = viaje.idDestino
                i.grupos = viaje.grupos
            }
        })
        setViajesForaneosListado(newViajes)
    }

    const handleOnAgregarViajeLocal = () => {
        viajesLocalesListado.push({
            idViaje: getRandomId(),
            idSucursal: null,
            zonas: [],
            idConcepto: null,
            rangos: [],
            productos: []
        })
        setViajesLocalesListado(viajesLocalesListado)
    }

    const handleDeleteViajeLocal = (viaje) => {
        setViajesLocalesListado(viajesLocalesListado.filter(i => i.idViaje !== viaje.idViaje))
    }

    const handleOnAgregarViajeForaneo = () => {
        viajesForaneosListado.push({
            idViaje: getRandomId(),
            idOrigen: null,
            idTipoMedida: null,
            idDestino: null,
            grupos: [],
        })
        setViajesForaneosListado(viajesForaneosListado)
    }

    const handleDeleteViajeForaneo = (viaje) => {
        let newViajes = []
        viajesForaneosListado.forEach(i => {
            newViajes.push(i)
        })

        setViajesForaneosListado(newViajes.filter(i => i.idViaje !== viaje.idViaje))
    }

    const handleOnRequestZonasBySucursal = (idSucursal) => {
        obtenerListadoZonaOperativaBySucursal(idSucursal).then(respuesta => {
            setZonasListado(respuesta.data)
        })
    }

    const handleOnRequestZonasByDestino = (idDestino) => {
        obtenerListadoZonaOperativaByOrigenDestino(idDestino).then(respuesta => {
            setZonasListado(respuesta.data)
        })
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

    /**Filtra los conceptos para que solo queden las que no se han usado en otro viaje local con la misma sucursal*/
    const filtrarConceptosViajeLocal = conceptosListado.filter(concepto => esConceptoViajeLocal(concepto))

    const filtrarUnidadesMedidaViajeLocal = unidadesMedidaListado.filter(i => i.IdUnidadMedida === 21 || i.IdUnidadMedida === 48)
    const filtrarUnidadesMedidaManiobras = unidadesMedidaListado.filter(i => i.IdUnidadMedida === 21 || i.IdUnidadMedida === 48)

    const filtrarTiposCalculoViajeLocal = tiposCalculoListado.filter(i => i.m_nIdTarifaTipoCalculo === 1 || i.m_nIdTarifaTipoCalculo === 2)
    const filtrarTiposCalculoManiobras = tiposCalculoListado.filter(i => i.m_nIdTarifaTipoCalculo === 1 || i.m_nIdTarifaTipoCalculo === 2)

    const validaSucursalYConceptoViajeLocal = () => {
        let valid = true
        viajesLocalesListado.forEach(v => {
            if (!v.idSucursal || !v.idConcepto){
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
            showSuccess("El cliente es un dato necesario")
            return
        }
        if (!validaVigencia()){
            showSuccess("la vigencia")
            return
        }
        if (!validaSucursalYConceptoViajeLocal()){
            showSuccess("No pueden guardar viajes locales sin sucursal o concepto")
            return
        }
        if (!validaOrigenDestinoMedidaViajeForaneo()){
            showSuccess("No pueden guardar viajes foraneos sin origen, destino o tipo de medida")
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
                        importe: rango.importe,
                        minimo: rango.minimo,
                        maximo: rango.maximo,
                        idTipoCalculo: rango.idTipoCalculo,
                        idUnidadMedida: rango.idUnidadMedida
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
            activo: state.activo,
            idCliente: state.cliente.m_nIdCliente,
            viajesLocales: viajesLocalesListado,
            maniobras: maniobrasChidas,
            viajesForaneos: viajesForaneosListado,
        }
        console.log(params)
        console.log(JSON.stringify(params))

        if (state.idTarifa === 0){
            agregarTarifaRangos(params).then(respuesta => {
                console.log(respuesta.data)
                if (respuesta.data.Estatus){
                    showSuccess("Se guardó la tarifa con éxito");
                }else{
                    showSuccess("Hubo un error al guardar");
                }
            })
        }else{
            modificarTarifaRangos(state.idTarifa,params).then(respuesta => {
                console.log(respuesta.data)
                if (respuesta.data.Estatus){
                    showSuccess("Se guardó la tarifa con éxito");
                }else{
                    showSuccess("Hubo un error al guardar");
                }
            })
        }

    }

    return(
        <div>
            <Dialog
                open={state.showDialogClientes}
                onClose={() => setState({...state, openDialog: false})}
                fullWidth maxWidth="md"
            >
                <DialogContent>
                    <div className="row" style={{backgroundColor: '#FFFFFF'}}>
                        <DialogTableClientes dialogVisible={handleDialogVisible } handlePatrocinadorSelected={handlePatrocinadorSelected}/>
                    </div>
                </DialogContent>
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
                                margin="dense"
                                required
                                value={state.cliente?.m_sNombreFiscal}
                                placeholder={"No. Cliente: Nombre fiscal"}
                                InputLabelProps={{shrink: true}}
                                onClick={(props.disabled || !props.convenio)?
                                    ()=>{return}:(()=>{ setState({ ...state, showDialogClientes: true})
                                    })}
                                disabled
                            />
                        </Grid>
                        <Grid item xs={2}>
                            <TextField
                                variant="outlined"
                                id="vigencia"
                                name="vigencia"
                                label="Vigencia"
                                type="date"
                                onChange={handleOnChange}
                                value={state.vigencia}
                                className={"form-control"}
                                InputProps={{inputProps: { min: getCurrentDate()}}}
                                disabled={props.disabled}
                                InputLabelProps={{shrink: true,}}
                                required
                            />
                        </Grid>
                    </Grid>
                </Paper>
                <Paper style={{padding: '20px', marginBottom: '10px'}}>
                    <Grid container spacing={2}>
                        <Grid item xs={11}>
                            <Typography variant="h3" component="h2">
                                Viaje Local
                            </Typography>
                        </Grid>
                        <Grid item xs={1}>
                            <Button fullWidth variant={"contained"} color={"primary"} onClick={handleOnAgregarViajeLocal}>
                                <AddIcon fontSize={'large'} />
                            </Button>
                        </Grid>
                    </Grid>
                    {
                        viajesLocalesListado.map((viaje) =>
                            <ViajeLocal
                                key={viaje.idViaje}
                                viaje={viaje}
                                sucursalesListado={sucursalesListado}
                                handleChangeViajeLocal={handleChangeViajeLocal}
                                conceptosListado={filtrarConceptosViajeLocal}
                                tiposCalculoListado={filtrarTiposCalculoViajeLocal}
                                unidadesMedidaListado={filtrarUnidadesMedidaViajeLocal}
                                handleDeleteViajeLocal={handleDeleteViajeLocal}
                                zonasListado={filtrarZonasViajeLocal(viaje)}
                                onRequestZonasBySucursal={handleOnRequestZonasBySucursal}
                                productosListado={productosListado}
                            />
                        )
                    }
                </Paper>
                <Paper style={{padding: '20px', marginBottom: '10px'}}>
                    <Typography variant="h3" component="h2">
                        Maniobras
                    </Typography>
                    <Maniobras
                        handleChangeManiobras={handleChangeManiobras}
                        conceptosListado={conceptosListado.filter(concepto => esConceptoManiobra(concepto))}
                        tiposCalculoListado={filtrarTiposCalculoManiobras}
                        unidadesMedidaListado={filtrarUnidadesMedidaManiobras}
                        rangos={maniobrasTarifa}
                    />
                </Paper>
                <Paper style={{padding: '20px'}}>
                    <Grid container spacing={2}>
                        <Grid item xs={11}>
                            <Typography variant="h3" component="h2">
                                Viaje Foraneo
                            </Typography>
                        </Grid>
                        <Grid item xs={1}>
                            <Button fullWidth variant={"contained"} color={"primary"} onClick={handleOnAgregarViajeForaneo}>
                                <AddIcon fontSize={'large'} />
                            </Button>
                        </Grid>
                    </Grid>
                    {
                        viajesForaneosListado.map((viaje) =>
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
                            />
                        )
                    }
                </Paper>
                <br/>
                <Button fullWidth variant={"contained"} onClick={handleGuardarTarifa} color={"primary"}>
                    Guardar
                </Button>

            </div>

        </div>
    )
}




