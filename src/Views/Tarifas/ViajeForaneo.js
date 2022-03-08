import React, {useEffect, useState} from "react";
import DialogoNuevoRango from "./DialogoNuevoRango";
import {
    Accordion,
    AccordionDetails,
    AccordionSummary,
    Button, Card, Checkbox,
    Dialog, DialogActions, DialogContent,
    Grid, IconButton, List, ListItem, ListItemIcon, ListItemText, makeStyles,
    MenuItem, Paper,
    TextField
} from "@material-ui/core";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import Typography from "@material-ui/core/Typography";
import RangosTarifa from "./RangosTarifa";
import DialogCheckbox from "./DialogCheckbox";
import {DataGrid} from "@material-ui/data-grid";
import {dataGridLocaleText} from "../../Constants";
import CardHeader from "@material-ui/core/CardHeader";
import Divider from "@material-ui/core/Divider";
import DialogTransferList from "./DialogTransferList";
import DeleteIcon from '@material-ui/icons/Delete';
import CancelIcon from '@material-ui/icons/Cancel';
import EditIcon from '@material-ui/icons/Edit';
import DialogTextView from "./DialogTextView";
import GrupoViajeForaneo from "./GrupoViajeForaneo";
import {getRandomId} from "../../Util/Util";
import AddIcon from "@material-ui/icons/AddBox";


export default function ViajeForaneo(props) {

    const [state, setState] = useState({
        idViaje: props.viaje.idViaje || getRandomId(),
        idOrigen: props.viaje.idOrigen || null,
        idTipoMedida: props.viaje.idTipoMedida || null,
        idDestino: props.viaje.idDestino || null,
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
                i.nombre = grupo.nombre
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

    const filtrarTiposCalculoViajeForaneo =
        state.idTipoMedida === 1 ?
            props.tiposCalculoListado.filter(i => i.m_nIdTarifaTipoCalculo === 1 || i.m_nIdTarifaTipoCalculo === 2) :
            props.tiposCalculoListado

    const filtrarUnidadesMedidaViajeForaneo =
        state.idTipoMedida === 1 ?
            props.unidadesMedidaListado.filter(i => i.IdUnidadMedida === 21 || i.IdUnidadMedida === 48) :
            props.unidadesMedidaListado

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
            <Paper variant={"outlined"} style={{padding: '10px', marginTop: '10px'}}>
                {
                    dialogGrupo.showDialog &&
                    <DialogTextView
                        handleShowDialog={handleShowDialogGrupo}
                        handleOnConfirmSelection={handleOnConfirmGrupoName}
                        openDialog={dialogGrupo.showDialog}
                        selection={dialogGrupo.selection}
                    />
                }
                <Grid container spacing={2} justifyContent="center" direction="row">
                    <Grid item xs={3}>
                        <TextField
                            id="idOrigen"
                            select
                            label="Origen"
                            value={props.viaje.idOrigen}
                            onChange={handleChangeViajeForaneo}
                            name="idOrigen"
                            variant="outlined"
                            margin={"dense"}
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
                            onChange={handleChangeViajeForaneo}
                            name="idTipoMedida"
                            variant="outlined"
                            margin={"dense"}
                            required
                            disabled={props.disabled}
                        >
                            <MenuItem key={1} value={1}>Peso</MenuItem>
                            <MenuItem key={2} value={2}>Pieza</MenuItem>
                        </TextField>
                    </Grid>
                    <Grid item xs={3}>
                        <TextField
                            id="idDestino"
                            select
                            label="Destino"
                            value={props.viaje.idDestino}
                            onChange={handleChangeViajeForaneo}
                            name="idDestino"
                            variant="outlined"
                            margin={"dense"}
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
                        <Button fullWidth variant={"contained"} color={"primary"} onClick={handleShowDialogGrupo} disabled={!props.viaje.idDestino || !props.viaje.idOrigen || !props.viaje.idTipoMedida || props.disabled}>
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

                </Grid>
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
                        />
                    )
                }
            </Paper>
        </div>
    )
}



