import React, {useEffect, useState} from "react";
import DialogoNuevoRango from "./DialogoNuevoRango";
import {
    Accordion,
    AccordionDetails,
    AccordionSummary,
    Button, Card, Checkbox,
    Dialog, DialogActions, DialogContent,
    Grid, IconButton, List, ListItem, ListItemIcon, ListItemText, makeStyles,
    MenuItem,
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


export default function ViajeForaneo(props) {

    const [state, setState] = useState({
        idViaje: props.viaje.idViaje || 0,
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

    const handleChangeRangosViaje = (newRangos) => {
        setState({
            ...state,
            rangos: newRangos
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

    useEffect(value => {
        props.handleChangeViajeForaneo(state)
    }, [state])

    return(
        <div>
            {
                dialogGrupo.showDialog &&
                <DialogTextView
                    handleShowDialog={handleShowDialogGrupo}
                    handleOnConfirmSelection={handleOnConfirmGrupoName}
                    openDialog={dialogGrupo.showDialog}
                    selection={dialogGrupo.selection}
                />
            }
            <Grid container spacing={2}>
                <Grid item xs>
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
                <Grid item xs>
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
                <Grid item xs>
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
                <Grid item xs>
                    <Button fullWidth variant={"contained"} color={"primary"} onClick={handleShowDialogGrupo}>
                        Agregar grupo
                    </Button>
                </Grid>
            </Grid>
            {
                state.gruposListado.map((grupo) =>
                    <GrupoViajeForaneo
                        grupo={grupo}
                        onEditGrupo={handleOnEditGrupo}
                        onDeleteGrupo={handleOnDeleteGrupo}
                    />
                )
            }
        </div>
    )
}

function DialogTextView(props) {
    /** Props
     * handleShowDialog() - Controla si se abre o cierra el dialogo.
     * handleOnConfirmSelection() - Retorna al padre los items seleccionados.
     * openDialog Boolean - Controla si se abre o cierra el dialogo
     * selection array - Lista de item seleccionados del datagrid
     * */
    const [state, setState] = useState({
        idGrupo: props.selection?.idGrupo || Math.floor(Math.random() * 10000),
        nombre: props.selection?.nombre ||  '',
    })

    const handleShowDialog = () => {
        props.handleShowDialog(false)
    }
    const handleConfirmSelection = () => {
        props.handleOnConfirmSelection(state)
    }
    const handleOnDataChange = (event) => {
        setState({
            ...state,
            [event.target.name]: event.target.value
        })
    }

    return(
        <Dialog
            fullWidth={true}
            maxWidth={'sm'}
            open={props.openDialog}
            onClose={handleShowDialog}
            aria-labelledby="max-width-dialog-title"
        >
            <DialogContent>
                <TextField variant="outlined" margin="dense"
                           onChange={handleOnDataChange}
                           fullWidth
                           label="Nombre"
                           value={state.nombre}
                           name="nombre"
                />
            </DialogContent>
            <DialogActions>
                <Button onClick={handleShowDialog} color="primary">
                    Close
                </Button>
                <Button onClick={handleConfirmSelection} color="primary" autoFocus>
                    Aceptar
                </Button>

            </DialogActions>
        </Dialog>
    )

}

function GrupoViajeForaneo(props){
    const [state, setState] = useState({
        idGrupo: props.grupo.idGrupo || Math.floor(Math.random() * 10000),
        nombre: props.grupo.nombre || '',
        zonas: props.grupo.zonas || [],
        rangos: props.grupo.rangos || [],
        productos: props.grupo.productos || []
    })
    const [dialogZonas, setDialogZonas] = useState({
        showDialogZonas: false,
        selection: [],
        rowId: 'm_nIdZona',
        idViaje: null,
        columns: [
            {
                headerName: "Código Zona",
                field: 'm_sCodigoZona',
                minWidth: 200,
                flex: 1
            },
            {
                headerName: "Sucursal",
                field: 'm_nIdSucursal',
                minWidth: 200,
                flex: 1
            }
        ]
    })
    const [dialogRangos, setDialogRangos] = useState({
        showDialog: false,
        selection: null,
        idViaje: null,
        isEdit: false
    })
    const [dialogProdutos, setDialogProdutos] = useState({
        showDialog: false,
        selection: [],
    })

    const handleShowDialogZonas = (show) => {

        if (show){
            props.onRequestZonasBySucursal(state.idSucursal)
            setDialogZonas({
                ...dialogZonas,
                showDialogZonas: show,
                selection: state.zonasSeleccionadas.map(i => i.m_nIdZona)
            })
        }else {
            setDialogZonas({
                ...dialogZonas,
                showDialogZonas: false,
                selection: []
            })
        }
    }

    const handleShowDialogRangos = (viaje, show) => {
        if (show){
            setDialogRangos({
                ...dialogRangos,
                showDialog: show,
                idViaje: viaje.idViaje,
            })
        }else {
            setDialogRangos({
                ...dialogRangos,
                showDialog: false,
                idViaje: null,
                selection: null,
                isEdit: false
            })
        }
    }

    const handleShowDialogProductos = (show) => {
        if (show){
            setDialogProdutos({
                ...dialogProdutos,
                showDialog: show,
                selection: state.productosSeleccionados
            })
        }else {
            setDialogProdutos({
                ...dialogProdutos,
                showDialog: show,
                selection: []
            })
        }
    }

    const handleConfirmZonas = (zonasSeleccion) => {
        let zonas = []
        zonasSeleccion.forEach(i => {
            zonas.push(props.zonasListado.find(j => j.m_nIdZona === parseInt(i)))
        })
        setState({
            ...state,
            zonasSeleccionadas: zonas
        })

        setDialogZonas({
            ...dialogZonas,
            showDialogZonas: false,
            selection: []
        })

    }

    const handleConfirmRangos = (rango) => {
        let newRangos = []
        if (dialogRangos.isEdit){
            newRangos = state.rangos.filter(i => i.id !== rango.id)
            newRangos.push(rango)
        }else{
            state.rangos.forEach(i => newRangos.push(i))
            newRangos.push(rango)
        }
        setState({
            ...state,
            rangos: newRangos
        })

        setDialogRangos({
            ...dialogRangos,
            showDialog: false,
            idViaje: null,
            selection: null,
            isEdit: false
        })
    }

    const handleConfirmProductos = (productosSeleccion) => {
        setState({
            ...state,
            productosSeleccionados: productosSeleccion
        })
        setDialogProdutos({
            ...dialogProdutos,
            showDialog: false,
            selection: []
        })

    }

    const handleOnDeleteRow = (row) => {
        setState({
            ...state,
            rangos: state.rangos.filter(i => i.id !== row.id)
        })
    }

    const handleOnEditRow = (row) => {
        setDialogRangos({
            ...dialogRangos,
            showDialog: true,
            selection: row,
            isEdit: true
        })
    }

    const handleOnChangeGrupo = (event) => {
        setState({
            ...state,
            [event.target.name]: event.target.value
        })
    }

    const handleOnDeleteGrupo = (event) => {
        event.preventDefault()
        event.stopPropagation()
        props.onDeleteGrupo(props.grupo)
    }

    const handleOnEditGrupo = (event) => {
        event.preventDefault()
        event.stopPropagation()
        console.log(state)
        console.log(props.grupo)
        props.onEditGrupo(props.grupo)
    }

    return(
        <div>
            {
                dialogZonas.showDialogZonas &&
                <DialogCheckbox
                    handleShowDialog={handleShowDialogZonas}
                    handleOnConfirmSelection={handleConfirmZonas}
                    openDialog={dialogZonas.showDialogZonas}
                    rowId={dialogZonas.rowId}
                    selection={dialogZonas.selection}
                    rows={props.zonasListado}
                    columns={dialogZonas.columns}
                />
            }

            {
                dialogRangos.showDialog &&
                <DialogoNuevoRango
                    handleOnConfirmData={handleConfirmRangos}
                    rango={dialogRangos.selection}
                    tiposCalculoListado={props.tiposCalculoListado}
                    unidadesMedidaListado={props.unidadesMedidaListado}
                    handleShowDialog={handleShowDialogRangos}
                    openDialog={dialogRangos.showDialog}

                />
            }
            {
                dialogProdutos.showDialog &&
                <DialogTransferList
                    handleShowDialog={handleShowDialogProductos}
                    handleOnConfirmSelection={handleConfirmProductos}
                    openDialog={dialogProdutos.showDialog}
                    selection={dialogProdutos.selection}
                    rows={props.productosListado}
                    columns={dialogProdutos.columns}
                />
            }
            <SimpleAccordion titulo={props.grupo.nombre} onDeleteGrupo={handleOnDeleteGrupo} onEditGrupo={handleOnEditGrupo}>
                <Grid container spacing={2}>
                    <Grid item xs={12}>
                        <Button fullWidth variant={"contained"} color={"primary"} onClick={handleShowDialogZonas}>
                            Zonas
                        </Button>
                    </Grid>
                    <Grid item xs>
                        <Button fullWidth variant={"contained"} color={"primary"} onClick={handleShowDialogProductos}>
                            Productos
                        </Button>
                    </Grid>
                    <Grid item xs>
                        <Button fullWidth variant={"text"} onClick={() => props.handleDeleteViajeLocal(props.viaje)}>
                            X
                        </Button>
                    </Grid>
                    <Grid item xs={10}>
                        <RangosTarifa
                            rows={state.rangos}
                            onEditRow={handleOnEditRow}
                            onDeleteRow={handleOnDeleteRow}
                            // onChangeList={handleChangeRangosViaje}
                            disabled={false}
                        />
                    </Grid>
                    <Grid item xs={2}>
                        <Button fullWidth variant={"contained"} color={"primary"}
                                onClick={() => handleShowDialogRangos(props.viaje, true)}>
                            Rangos
                        </Button>
                    </Grid>
                </Grid>
            </SimpleAccordion>
        </div>
    )
}

function SimpleAccordion(props) {
    return (
        <div>
            <Accordion>
                <AccordionSummary
                    expandIcon={<ExpandMoreIcon/>}
                    aria-controls="panel1a-content"
                    id="panel1a-header"
                >
                    <Grid container spacing={1}>
                        <Grid item xs={10}>
                            <Typography>{props.titulo}</Typography>
                        </Grid>
                        <Grid item xs={1}>
                            <IconButton onClick={props.onDeleteGrupo}>
                                <DeleteIcon/>
                            </IconButton>
                        </Grid>
                        <Grid item xs={1}>
                            <IconButton onClick={props.onEditGrupo}>
                                <EditIcon/>
                            </IconButton>
                        </Grid>
                    </Grid>
                </AccordionSummary>
                <AccordionDetails>
                    {props.children}
                </AccordionDetails>
            </Accordion>

        </div>
    );
}