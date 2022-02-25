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


export default function ViajeForaneo(props) {

    const [state, setState] = useState({
        idViaje: props.viaje.idViaje || getRandomId(),
        idOrigen: props.viaje.idOrigen || null,
        idTipoMedida: props.viaje.idTipoMedida || null,
        idDestino: props.viaje.idDestino || null,
        gruposListado: props.viaje.gruposListado || [],
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
            state.gruposListado.forEach(i => {
                if (i.idGrupo === data.idGrupo){
                    i.nombre = data.nombre
                }
            })
        }else {
            data.zonas = []
            data.rangos = []
            data.productos = []
            state.gruposListado.push(data)
        }
        setState({
            ...state,
            gruposListado: state.gruposListado
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
        state.gruposListado.forEach(i => newGrupos.push(i))
        setState({
            ...state,
            gruposListado: newGrupos.filter(i => i.idGrupo !== grupo.idGrupo)
        })
    }

    const handleOnGrupoDataChange = (grupo) => {
        state.gruposListado.forEach(i => {
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
            gruposListado: state.gruposListado
        })
    }

    useEffect(value => {
        props.handleChangeViajeForaneo(state)
    }, [state])



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
                        >
                            {props.origenesDestinosListado.map((option) => (
                                <MenuItem key={option.m_nIdCiudad} value={option.m_nIdCiudad}>
                                    {option.m_sCiudad}
                                </MenuItem>
                            ))}
                        </TextField>
                    </Grid>
                    <Grid item xs={3}>
                        <TextField
                            id="idTipoMedida"
                            select
                            label="Tipo medida"
                            value={props.viaje.idTipoMedida}
                            onChange={handleChangeViajeForaneo}
                            name="idTipoMedida"
                            variant="outlined"
                            margin={"dense"}
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
                        >
                            {props.origenesDestinosListado.map((option) => (
                                <MenuItem key={option.m_nIdCiudad} value={option.m_nIdCiudad}>
                                    {option.m_sCiudad}
                                </MenuItem>
                            ))}
                        </TextField>
                    </Grid>
                    <Grid item xs={2}>
                        <Button fullWidth variant={"contained"} color={"primary"} onClick={handleShowDialogGrupo}>
                            Agregar grupo
                        </Button>
                    </Grid>
                    <Grid item xs={1}>
                        <Button fullWidth onClick={() => props.handleDeleteViajeForaneo(props.viaje)}>
                            <CancelIcon fontSize={'large'} color={'error'}/>
                        </Button>
                    </Grid>

                </Grid>
                {
                    state.gruposListado.map((grupo) =>
                        <GrupoViajeForaneo
                            grupo={grupo}
                            onEditGrupo={handleOnEditGrupo}
                            onDeleteGrupo={handleOnDeleteGrupo}
                            onRequestZonasByDestino={props.onRequestZonasByDestino}
                            zonasListado={props.zonasListado}
                            productosListado={props.productosListado}
                            tiposCalculoListado={props.tiposCalculoListado}
                            unidadesMedidaListado={props.unidadesMedidaListado}
                            onGrupoDataChange={handleOnGrupoDataChange}
                        />
                    )
                }
            </Paper>
        </div>
    )
}



