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
import {obtenerListadoZonaOperativaBySucursal} from "../../Util/Contexts/ZonaOperativaContext";
import {DataGrid} from "@material-ui/data-grid";
import {dataGridLocaleText} from "../../Constants";
import SvgIcon from "@material-ui/core/SvgIcon";
import {ReactComponent as Activo} from "../../iconos/Menu/palomita.svg";
import {ReactComponent as NoActivo} from "../../iconos/Menu/cruz.svg";
import {getUniqueListBy} from "../../Util/Util";
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

export default function CrearTarifaRangos(props) {
    const [state, setState] = useState({

    })
    const [viajesLocalesListado, setViajesLocalesListado] = useState([{
        idViaje: 1,
        idSucursal: null,
        zonasSeleccionadas: [],
        idConcepto: null,
        rangos: [],
        productosSeleccionados: []
    },{
        idViaje: 2,
        idSucursal: null,
        zonasSeleccionadas: [],
        idConcepto: null,
        rangos: [],
        productosSeleccionados: []
    }
    ])
    const [maniobrasTarifa,setManiobrasTarifa] = useState([])
    const [sucursalesListado, setSucursalesListado] = useState([])
    const [conceptosListado, setConceptosListado] = useState([])
    const [zonasListado, setZonasListado] = useState([])
    const [tiposCalculoListado, setTiposCalculoListado] = useState([])
    const [unidadesMedidaListado, setUnidadesMedidaListado] = useState([
        {
            IdUnidadMedida: 1,
            UnidadMedida: 'KG'
        },{
            IdUnidadMedida: 2,
            UnidadMedida: 'TONS'
        },
    ])



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

    useEffect(value => {
        getAllSucursales()
        getAllConceptos()
        getZonasBySucursal()
        getAllTiposCalculo()
    }, [])

    const handleChangeViajeLocal = (viaje) => {
        let newViajes = []
        viajesLocalesListado.forEach(i => {
            newViajes.push(i)
        })
        newViajes.forEach(i => {
            if (i.idViaje === viaje.idViaje ){
                i.idSucursal = viaje.idSucursal
                i.zonasSeleccionadas = viaje.zonasSeleccionadas
                i.idConcepto = viaje.idConcepto
                i.rangos = viaje.rangos
                i.productosSeleccionados = viaje.productosSeleccionados
            }
        })
        setViajesLocalesListado(newViajes)
    }
    const handleChangeManiobras = (maniobras) => {
        setManiobrasTarifa(maniobras)
    }

    const handleDeleteViajeLocal = (viaje) => {
        let newViajes = []
        viajesLocalesListado.forEach(i => {
            newViajes.push(i)
        })

        setViajesLocalesListado(newViajes.filter(i => i.idViaje !== viaje.idViaje))
    }

    const handleOnRequestZonasBySucursal = (idSucursal) => {
        obtenerListadoZonaOperativaBySucursal(idSucursal).then(respuesta => {
            setZonasListado(respuesta.data)
        })
    }

    const esConceptoViajeLocal = (concepto) => {
        /*return concepto.m_nIdConceptosFacturacion === props.configuraciones.IdConceptoRecoleccion
        || concepto.m_nIdConceptosFacturacion === props.configuraciones.IdConceptoEntrega*/
        return true
    }
    const esConceptoManiobra = (concepto) => {
        /*return concepto.m_nIdConceptosFacturacion === props.configuraciones.IdConceptoRecoleccion
        || concepto.m_nIdConceptosFacturacion === props.configuraciones.IdConceptoEntrega*/
        return true
    }

    return(
        <div>

            <Paper style={{padding: '20px'}}>
                <Grid container spacing={2}>
                    <Grid item xs={10}>
                        <Typography variant="h3" component="h2">
                            Viaje Local
                        </Typography>
                    </Grid>
                    <Grid item xs={2}>
                        <Button variant={"contained"} color={"primary"}>
                            Agregar viaje
                        </Button>
                    </Grid>
                </Grid>
                {
                    viajesLocalesListado.map((viaje) =>
                        <ViajeLocal
                            viaje={viaje}
                            sucursalesListado={sucursalesListado}
                            handleChangeViajeLocal={handleChangeViajeLocal}
                            conceptosListado={conceptosListado.filter(concepto => esConceptoViajeLocal(concepto))}
                            tiposCalculoListado={tiposCalculoListado}
                            unidadesMedidaListado={unidadesMedidaListado}
                            handleDeleteViajeLocal={handleDeleteViajeLocal}
                            zonasListado={zonasListado}
                            onRequestZonasBySucursal={handleOnRequestZonasBySucursal}
                        />
                    )
                }
                <Grid container spacing={2}>
                    <Grid item xs={10}>
                        <Typography variant="h3" component="h2">
                            Maniobras
                        </Typography>
                    </Grid>
                </Grid>
                <Maniobras
                    handleChangeManiobras={handleChangeManiobras}
                    conceptosListado={conceptosListado.filter(concepto => esConceptoManiobra(concepto))}
                    tiposCalculoListado={tiposCalculoListado}
                    unidadesMedidaListado={unidadesMedidaListado}
                    rangos={maniobrasTarifa}
                />
            </Paper>

        </div>
    )
}




