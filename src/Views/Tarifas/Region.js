import React, {useEffect, useState} from "react";
import {
    Accordion,
    AccordionDetails,
    AccordionSummary,
    Button,
    Card,
    Checkbox,
    Dialog,
    DialogActions,
    DialogContent,
    Grid,
    IconButton,
    List,
    ListItem,
    ListItemIcon,
    ListItemText,
    MenuItem,
    Paper,
    TextField,
} from "@mui/material";
import makeStyles from '@mui/styles/makeStyles';
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import Typography from "@mui/material/Typography";
import RangosTarifa from "./RangosTarifa";
import DialogCheckbox from "./DialogCheckbox";
import {dataGridLocaleText} from "../../Constants";
import CardHeader from "@mui/material/CardHeader";
import Divider from "@mui/material/Divider";
import DialogTransferList from "./DialogTransferList";
import DeleteIcon from '@mui/icons-material/Delete';
import CancelIcon from '@mui/icons-material/Cancel';
import EditIcon from '@mui/icons-material/Edit';
import DialogTextView from "./DialogTextView";
import GrupoViajeForaneo from "./GrupoViajeForaneo";
import {getRandomId} from "../../Util/Util";
import AddIcon from "@mui/icons-material/AddBox";
import DestinosTarifa from "./DestinosTarifa";
import ProductosPrecios from "./ProductosPrecios";


export default function Region(props) {

    const [state, setState] = useState({
        idViaje: props.viaje.idViaje || getRandomId(),
        idOrigen: props.viaje.idOrigen || null,
        fleteMinimo: props.viaje.fleteMinimo || 0.00,
        //Aqui se guardan todos los productos y no se modifican
        dataProductos: [],
        //Aqui se guardan todos los productos que no estan seleccionados
        dataProductosTemp: [],
        //Aqui pues el nombre de la variable ya es muy explicita
        dataProductosSeleccionados: props.viaje.productos || [],
        //Aqui se guardan todos los destinos que no estan seleccionados
        dataDestinosTemp: [],
        //Aqui pues el nombre de la variable ya es muy explicita
        dataDestinosSeleccionados: props.viaje.destinos || [],
    })


    const handleChangeViajeForaneo = (event) => {
        setState({
            ...state,
            [event.target.name]: event.target.value
        })
    }

    useEffect(value => {
        props.handleChangeViajeForaneo(state)
    }, [state])

    const filtrarDestinos = (ciudades) => {
        return ciudades.filter(i  => i.m_nIdCiudad !== state.idOrigen)
    }

    const actualizarDestinos = (todosDestinos, destinosSeleccionados) => {
        setState({
            ...state,
            dataDestinosTemp: todosDestinos,
            dataDestinosSeleccionados: destinosSeleccionados
        })
    }

    const actualizarProductos = (todosProductos, productosSeleccionados) => {
        setState({
            ...state,
            dataProductosTemp: todosProductos,
            dataProductosSeleccionados: productosSeleccionados
        })
    }
    return(
        <div>
            <Paper variant={"outlined"} style={{padding: '10px', marginTop: '10px'}}>
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
                            id="fleteMinimo"
                            inputMode={"decimal"}
                            label="Flete Mínimo"
                            value={props.viaje.fleteMinimo}
                            onChange={handleChangeViajeForaneo}
                            name="fleteMinimo"
                            variant="outlined"
                            margin={"dense"}
                            required
                            disabled={props.disabled}
                        />
                    </Grid>
                    <Grid item xs={2}>
                        <Button fullWidth onClick={() => props.handleDeleteViajeForaneo(props.viaje)}
                                disabled={props.disabled} style={{backgroundColor: '#FFD7D7'}} variant={"contained"}
                                startIcon={<DeleteIcon fontSize={'large'} color={'error'}/>}>
                            Eliminar viaje
                        </Button>
                    </Grid>

                </Grid>
                {/*<div style={{height: '200px', overflow: 'scroll'}}>
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
                            />
                        )
                    }
                </div>*/}
                <DestinosTarifa
                    destinos={filtrarDestinos(props.origenesDestinosListado)}
                    destinosSeleccionados={state.dataDestinosSeleccionados}
                    actualizarDestinos={actualizarDestinos}
                    disabled={props.disabled}
                />

                <div style={{marginTop:'20px', marginBottom: '20px'}}>
                    <ProductosPrecios
                        dataList={state.dataProductosSeleccionados}
                        onChangeList={actualizarProductos}
                        mostrarRangos={false}
                        consult={props.consult}
                        disabled={props.disabled}
                        ivaRetiene={[]}
                        ivaTraslada={[]}
                        mostrarTotal={false}
                    />
                </div>

            </Paper>
        </div>
    )
}



