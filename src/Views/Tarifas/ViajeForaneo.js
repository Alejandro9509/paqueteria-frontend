import React, {useEffect, useState} from "react";
import {
    Button,
    Grid,
    MenuItem,
    Paper,
    TextField,
} from "@mui/material";
import Typography from "@mui/material/Typography";
import DeleteIcon from '@mui/icons-material/Delete';
import DialogTextView from "./DialogTextView";
import GrupoViajeForaneo from "./GrupoViajeForaneo";
import {getRandomId} from "../../Util/Util";
import AddIcon from "@mui/icons-material/AddBox";
import {obtenerParametrosConfiguracion} from "../../Util/Contexts/ParametrosConfiguracionContext";


export default function ViajeForaneo(props) {
    const [mostrarPorcentaje, setMostrarPorcentaje] = useState(true)
    const [state, setState] = useState({
        idViaje: props.viaje.idViaje || getRandomId(),
        idOrigen: props.viaje.idOrigen || null,
        idTipoMedida: props.viaje.idTipoMedida || null,
        idDestino: props.viaje.idDestino || null,
        fleteMinimo: props.viaje.fleteMinimo || 0,
        grupos: props.viaje.grupos || [],
    })
    const [dialogGrupo, setDialogGrupo] = useState({
        showDialog: false,
        selection: null,
        idGrupoo: null,
        isEdit: false
    })

    const handleChangeViajeForaneo = (event) => {
        setState({
            ...state,
            [event.target.name]: event.target.value
        })
    }

    const handleShowDialogGrupo = (show) => {
        if (show){
            setDialogGrupo({
                ...dialogGrupo,
                showDialog: show,
                selection: null,
            })
        }else{
            setDialogGrupo({
                ...dialogGrupo,
                showDialog: show,
                selection: null,
                idGrupoo: null,
                isEdit: false
            })
        }
    }

    const handleOnConfirmGrupoName = (data) => {
        if (dialogGrupo.isEdit){
            state.grupos.forEach(i => {
                if (i.idGrupo === data.idGrupo){
                    i.nombre = data.nombre
                }
            })
        }else {
            data.zonas = []
            data.rangos = []
            data.productos = []
            state.grupos.push(data)
        }
        setState({
            ...state,
            grupos: state.grupos
        })

        setDialogGrupo({
            ...dialogGrupo,
            showDialog: false,
            selection: null,
            isEdit: false
        })
    }

    const handleOnEditGrupo = (grupo) => {
        setDialogGrupo({
            ...dialogGrupo,
            showDialog: true,
            selection: grupo,
            isEdit: true
        })
    }

    const handleOnDeleteGrupo = (grupo) => {
        let newGrupos = []
        state.grupos.forEach(i => newGrupos.push(i))
        setState({
            ...state,
            grupos: newGrupos.filter(i => i.idGrupo !== grupo.idGrupo)
        })
    }

    const handleOnGrupoDataChange = (grupo) => {
        state.grupos.forEach(i => {
            if (i.idGrupo === grupo.idGrupo){
                i.idGrupo = grupo.idGrupo
                i.zonas = grupo.zonas
                i.rangos = grupo.rangos
                i.productos = grupo.productos
            }
        })
        setState({
            ...state,
            grupos: state.grupos
        })
    }

    useEffect(value => {
        props.handleChangeViajeForaneo(state)
    }, [state])

    useEffect(value => {
        obtenerParametrosConfiguracion().then(({data}) => {
            setMostrarPorcentaje(data.CobroPorcentual)
        })
    }, [])

    const filtrarTiposCalculoViajeForaneo =
        state.idTipoMedida === 1 ?
            props.tiposCalculoListado.filter(i => i.m_nIdTarifaTipoCalculo === 1 || i.m_nIdTarifaTipoCalculo === 2) :
            props.tiposCalculoListado

    /**Filtra las unidades de medida por tipo de medida. 1-PESO: KILOGRAMOS, TONELADAS. 2-PIEZA: KILOGRAMOS, TONELADAS, PIEZAS. 3-PORCENTAJE: PORCIENTO*/
    const filtrarUnidadesMedidaViajeForaneo =
        state.idTipoMedida === 1 ? props.unidadesMedidaListado.filter(i => i.IdUnidadMedida === 21 || i.IdUnidadMedida === 48)
            : state.idTipoMedida === 2 ? props.unidadesMedidaListado.filter(i => i.IdUnidadMedida === 38)
                : state.idTipoMedida === 3 ? props.unidadesMedidaListado.filter(i => i.IdUnidadMedida === 55)
                    : props.unidadesMedidaListado

    /**Filtra las zonas para que solo queden las que no se han usado en otro viaje local con la misma sucursal y concepto*/
    const filtrarZonasViajeForaneo = (grupo) => {
        let zonasDisponibles = []
        props.zonasListado.forEach(i => {
            zonasDisponibles.push(i)
        })
        let otrosGrupos = state.grupos.filter(v => v.idGrupo !== grupo.idGrupo)
        otrosGrupos.forEach(v => {
            v.zonas.forEach(z => {
                zonasDisponibles = zonasDisponibles.filter(j => j.m_nIdZona !== z.m_nIdZona)
            })
        })
        return zonasDisponibles
    }

    return(
        <div>
            <Paper variant={"outlined"} style={{padding: '5px', marginTop: '10px'}}>
                {
                    dialogGrupo.showDialog &&
                    <DialogTextView
                        handleShowDialog={handleShowDialogGrupo}
                        handleOnConfirmSelection={handleOnConfirmGrupoName}
                        openDialog={dialogGrupo.showDialog}
                        selection={dialogGrupo.selection}
                    />
                }
                <Grid container spacing={2} direction="row">
                    <Grid item xs={3}>
                        <TextField
                            id="idOrigen"
                            select
                            label="Origen"
                            value={props.viaje.idOrigen}
                            InputLabelProps={{shrink: true}}
                            onChange={handleChangeViajeForaneo}
                            name="idOrigen"
                            variant="outlined"
                            size="small"
                            required
                            disabled={props.disabled}
                        >
                            {props.origenesDestinosListado.map((option) => (
                                <MenuItem key={option.m_nIdCiudad} value={option.m_nIdCiudad}>
                                    {option.m_sCiudad}
                                </MenuItem>
                            ))}
                        </TextField>
                    </Grid>
                    <Grid item xs={2}>
                        <TextField
                            id="idTipoMedida"
                            select
                            label="Tipo medida"
                            value={props.viaje.idTipoMedida}
                            InputLabelProps={{shrink: true}}
                            onChange={handleChangeViajeForaneo}
                            name="idTipoMedida"
                            variant="outlined"
                            size="small"
                            required
                            disabled={props.disabled}
                        >
                            <MenuItem key={1} value={1}>Peso</MenuItem>
                            <MenuItem key={2} value={2}>Pieza</MenuItem>
                            {
                                mostrarPorcentaje &&
                                <MenuItem key={3} value={3}>Porcentaje</MenuItem>
                            }
                        </TextField>
                    </Grid>
                    <Grid item xs={3}>
                        <TextField
                            id="idDestino"
                            select
                            label="Destino"
                            value={props.viaje.idDestino}
                            InputLabelProps={{shrink: true}}
                            onChange={handleChangeViajeForaneo}
                            name="idDestino"
                            variant="outlined"
                            size="small"
                            required
                            disabled={props.disabled}
                        >
                            {props.origenesDestinosListado.map((option) => (
                                <MenuItem key={option.m_nIdCiudad} value={option.m_nIdCiudad}>
                                    {option.m_sCiudad}
                                </MenuItem>
                            ))}
                        </TextField>
                    </Grid>
                    <Grid item xs={2}>
                        <Button fullWidth variant={"contained"} color={"primary"} onClick={handleShowDialogGrupo} style={{fontSize: "1em"}}
                                disabled={!props.viaje.idDestino || !props.viaje.idOrigen || !props.viaje.idTipoMedida || props.disabled}>
                            <AddIcon fontSize={'large'} />
                            &nbsp;&nbsp;Agregar grupo
                        </Button>
                    </Grid>
                    <Grid item xs={2}>
                        <Button fullWidth onClick={() => props.handleDeleteViajeForaneo(props.viaje)}
                                disabled={props.disabled} style={{backgroundColor: '#FFD7D7'}} variant={"contained"}
                                startIcon={<DeleteIcon fontSize={'large'} color={'error'}/>}>
                            Eliminar viaje
                        </Button>
                    </Grid>
                    <Grid item xs={2}>
                        <TextField
                            id="fleteMinimo"
                            inputMode={"decimal"}
                            label="Flete Mínimo"
                            value={props.viaje.fleteMinimo}
                            InputLabelProps={{shrink: true}}
                            onChange={handleChangeViajeForaneo}
                            name="fleteMinimo"
                            variant="outlined"
                            size="small"
                            required
                            disabled={props.disabled}
                        />
                    </Grid>
                    <Grid item xs={3}>
                        <Typography variant={"h5"} color={"error"}>*La validación de flete mínimo no se aplicará si se deja en 0.</Typography>
                    </Grid>
                </Grid>
                <div style={{height: '200px', overflow: 'scroll'}}>
                    {
                        state.grupos.map((grupo) =>
                            <GrupoViajeForaneo
                                key={grupo.idGrupo}
                                grupo={grupo}
                                onEditGrupo={handleOnEditGrupo}
                                onDeleteGrupo={handleOnDeleteGrupo}
                                onRequestZonasByDestino={() => props.onRequestZonasByDestino(state.idDestino)}
                                zonasListado={filtrarZonasViajeForaneo(grupo)}
                                productosListado={props.productosListado}
                                tiposCalculoListado={filtrarTiposCalculoViajeForaneo}
                                unidadesMedidaListado={filtrarUnidadesMedidaViajeForaneo}
                                onGrupoDataChange={handleOnGrupoDataChange}
                                disabled={props.disabled}
                                showDialogZonas={props.showDialogZonas}
                                handleShowDialogZonas={props.handleShowDialogZonas}
                                mode={parseInt(state.idTipoMedida) === 3 ? 'PORCENTAJE' : 'OTRO'}
                            />
                        )
                    }
                </div>
            </Paper>
        </div>
    )
}



