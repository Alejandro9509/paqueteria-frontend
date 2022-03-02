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
        idCliente: props.selection?.idCliente || 0
    })
    const [viajesLocalesListado, setViajesLocalesListado] = useState([])
    const [maniobrasTarifa,setManiobrasTarifa] = useState([])
    const [viajesForaneosListado, setViajesForaneosListado] = useState([])
    const [sucursalesListado, setSucursalesListado] = useState([])
    const [conceptosListado, setConceptosListado] = useState([])
    const [zonasListado, setZonasListado] = useState([])
    const [tiposCalculoListado, setTiposCalculoListado] = useState([])
    const [origenesDestinosListado, setOrigenesDestinosListado] = useState([])
    const [unidadesMedidaListado, setUnidadesMedidaListado] = useState([
        {
            IdUnidadMedida: 1,
            UnidadMedida: 'KG'
        },{
            IdUnidadMedida: 2,
            UnidadMedida: 'TONS'
        },{
            IdUnidadMedida: 3,
            UnidadMedida: 'PIEZA'
        },
    ])
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
    const getZonasBySucursal = (idSucursal) => {
        if (zonasListado.length > 0){
            return
        }
        obtenerListadoZonaOperativaBySucursal(idSucursal).then(respuesta => {
            setZonasListado(respuesta.data)
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
            respuestas.data.forEach(i => i.numeroDescripcion = `${i.m_nNoProducto}.- ${i.m_sDescripcion}`)
            setProductosListado(respuestas.data.filter(i => i.m_bActivo))
        })
    }

    useEffect(value => {
        getAllSucursales()
        getAllConceptos()
        getZonasBySucursal()
        getAllTiposCalculo()
        getAllProductos()
        getOrigenesDestinos()
    }, [])

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
                i.gruposListado = viaje.gruposListado
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
            gruposListado: [],
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

    const filtrarUnidadesMedidaViajeLocal = unidadesMedidaListado.filter(i => i.IdUnidadMedida === 1 || i.IdUnidadMedida === 2)

    const filtrarTiposCalculoViajeLocal = tiposCalculoListado.filter(i => i.m_nIdTarifaTipoCalculo === 1 || i.m_nIdTarifaTipoCalculo === 2)

    const validarSucursalYConceptoViajeLocal = () => {
        let valid = true
        viajesLocalesListado.forEach(v => {
            if (!v.idSucursal || !v.idConcepto){
                valid = false
            }
        })
        return valid
    }

    const validarOrigenDestinoMedidaViajeForaneo = () => {
        let valid = true
        viajesForaneosListado.forEach(v => {
            if (!v.idOrigen || !v.idTipoMedida || !v.idDestino){
                valid = false
            }
        })
        return valid
    }

    const handleGuardarTarifa = (event) => {
        if (!validarSucursalYConceptoViajeLocal()){
            showSuccess("No pueden guardar viajes locales sin sucursal o concepto")
            return
        }
        if (!validarOrigenDestinoMedidaViajeForaneo()){
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
            v.gruposListado.forEach(g => {
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

        let tarifa = {
            idTarifa: state.idTarifa,
            vigencia: state.vigencia,
            activo: state.activo,
            idCliente: 123,
            viajesLocales: viajesLocalesListado,
            maniobras: maniobrasChidas,
            viajesForaneos: viajesForaneosListado,
        }
        console.log(tarifa)
    }

    return(
        <div>
            <div>
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
                        tiposCalculoListado={tiposCalculoListado}
                        unidadesMedidaListado={unidadesMedidaListado}
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




