import React, {useEffect, useState} from "react";
import DialogoNuevoRango from "./DialogoNuevoRango";
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
import {getRandomId} from "../../Util/Util";
import CancelIcon from "@mui/icons-material/Cancel";
import AddIcon from "@mui/icons-material/AddBox";
import DeleteIcon from "@mui/icons-material/Delete";


export default function ViajeLocal(props) {

    const [state, setState] = useState({
        idViaje: props.viaje.idViaje || getRandomId(),
        idSucursal: props.viaje.idSucursal || null,
        idTipoMedida: props.viaje.idTipoMedida || null,
        zonas: props.viaje.zonas || [],
        idConcepto: props.viaje.idConcepto || null,
        rangos: props.viaje.rangos || [],
        productos: props.viaje.productos || []
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
                field: 'm_sSucursal',
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

    const handleChangeViajeLocal = (event) => {
        if (event.target.name === "idSucursal"){
            setState({
                ...state,
                [event.target.name]: event.target.value,
                zonas: [],
            })
        }else{
            setState({
                ...state,
                [event.target.name]: event.target.value
            })
        }

    }

    const handleChangeRangosViaje = (newRangos) => {
        setState({
            ...state,
            rangos: newRangos
        })
    }

    const handleShowDialogZonas = (show) => {

        if (show){
            props.onRequestZonasBySucursal(state.idSucursal)
            setDialogZonas({
                ...dialogZonas,
                showDialogZonas: show,
                selection: state.zonas.map(i => i.m_nIdZona)
            })
        }else {
            props.handleShowDialogZonas(false)
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
                selection: state.productos
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
            zonas: zonas
        })
        props.handleShowDialogZonas(false)
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
            productos: productosSeleccion
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

    useEffect(value => {
        props.handleChangeViajeLocal(state)
    }, [state])

    const filtrarUnidadesMedidaViajeLocal =
        state.idTipoMedida === 1 ? props.unidadesMedidaListado.filter(i => i.IdUnidadMedida === 21 || i.IdUnidadMedida === 48)
                : state.idTipoMedida === 2 ? props.unidadesMedidaListado.filter(i => i.IdUnidadMedida === 38)
                    : props.unidadesMedidaListado

    const filtrarTiposCalculoViajeLocal =
        state.idTipoMedida === 1 ?
            props.tiposCalculoListado.filter(i => i.m_nIdTarifaTipoCalculo === 1 || i.m_nIdTarifaTipoCalculo === 2) :
            props.tiposCalculoListado

    return(
        <div>
            <Paper variant={"outlined"} style={{padding: '10px', marginTop: '10px'}}>
                {
                    props.showDialogZonas &&
                    <DialogCheckbox
                        handleShowDialog={handleShowDialogZonas}
                        handleOnConfirmSelection={handleConfirmZonas}
                        openDialog={dialogZonas.showDialogZonas}
                        rowId={dialogZonas.rowId}
                        selection={dialogZonas.selection}
                        rows={props.zonasListado}
                        columns={dialogZonas.columns}
                        disabled={props.disabled}
                    />
                }

                {
                    dialogRangos.showDialog &&
                    <DialogoNuevoRango
                        handleOnConfirmData={handleConfirmRangos}
                        rango={dialogRangos.selection}
                        tiposCalculoListado={filtrarTiposCalculoViajeLocal}
                        unidadesMedidaListado={filtrarUnidadesMedidaViajeLocal}
                        handleShowDialog={handleShowDialogRangos}
                        openDialog={dialogRangos.showDialog}
                        rows={props.viaje.rangos}
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
                        disabled={props.disabled}
                    />
                }

                <Grid container spacing={2}>
                    <Grid item xs={2}>
                        <TextField
                            id="idSucursal"
                            select
                            label="Sucursal"
                            value={props.viaje.idSucursal}
                            onChange={handleChangeViajeLocal}
                            name="idSucursal"
                            variant="outlined"
                            size="small"
                            required
                            disabled={props.disabled}
                        >
                            {props.sucursalesListado.map((option) => (
                                <MenuItem key={option.m_nIdSucursal} value={option.m_nIdSucursal}>
                                    {option.m_sSucursal}
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
                            onChange={handleChangeViajeLocal}
                            name="idTipoMedida"
                            variant="outlined"
                            size="small"
                            required
                            disabled={props.disabled}
                        >
                            <MenuItem key={1} value={1}>Peso</MenuItem>
                            <MenuItem key={2} value={2}>Pieza</MenuItem>
                        </TextField>
                    </Grid>
                    <Grid item xs={2}>
                        <TextField
                            id="idConcepto"
                            select
                            label="Concepto"
                            value={props.viaje.idConcepto}
                            onChange={handleChangeViajeLocal}
                            name="idConcepto"
                            variant="outlined"
                            size="small"
                            required
                            disabled={props.disabled}
                        >
                            {props.conceptosListado.map((option) => (
                                <MenuItem key={option.m_nIdConceptosFacturacion} value={option.m_nIdConceptosFacturacion}>
                                    {option.m_sConcepto}
                                </MenuItem>
                            ))}
                        </TextField>
                    </Grid>
                    <Grid item xs={2}>
                        <Button fullWidth variant={"contained"} color={"primary"} onClick={()=>handleShowDialogZonas(true)} disabled={!state.idSucursal || !state.idConcepto || !state.idTipoMedida}>
                            {`Zonas (${state.zonas.length})`}
                        </Button>
                    </Grid>
                    <Grid item xs={2}>
                        <Button fullWidth variant={"contained"} color={"primary"} onClick={handleShowDialogProductos} disabled={!state.idSucursal || !state.idConcepto || !state.idTipoMedida}>
                            {`Productos (${state.productos.length})`}
                        </Button>
                    </Grid>
                    <Grid item xs={2}>
                        <Button fullWidth onClick={() => props.handleDeleteViajeLocal(state)} disabled={props.disabled} style={{backgroundColor: '#FFD7D7'}} variant={"contained"}
                                startIcon={<DeleteIcon fontSize={'large'} color={'error'}/>}>
                            Eliminar Viaje
                        </Button>
                    </Grid>
                    {
                        state.zonas.length > 0 &&
                        <Grid item xs={12}>
                            <SimpleAccordion
                                titulo={state.zonas.map(i=> i.m_sCodigoZona).join(', ')}>
                                <Grid container spacing={2}>
                                    <Grid item xs={10}>
                                        <RangosTarifa
                                            rows={state.rangos}
                                            onEditRow={handleOnEditRow}
                                            onDeleteRow={handleOnDeleteRow}
                                            onChangeList={handleChangeRangosViaje}
                                            disabled={props.disabled}
                                        />
                                    </Grid>
                                    <Grid item xs={2}>
                                        <Button fullWidth variant={"contained"} color={"primary"} onClick={() => handleShowDialogRangos(props.viaje, true)} disabled={props.disabled}>
                                            <AddIcon fontSize={'large'} />
                                            &nbsp;&nbsp;Agregar Rangos
                                        </Button>
                                    </Grid>
                                </Grid>
                            </SimpleAccordion>
                        </Grid>
                    }
                </Grid>
            </Paper>
        </div>
    )
}

function SimpleAccordion(props) {
    return (
        <div>
            <Accordion>
                <AccordionSummary
                    style={{backgroundColor: '#E6E6E6'}}
                    expandIcon={<ExpandMoreIcon/>}
                    aria-controls="panel1a-content"
                    id="panel1a-header"
                >
                    <Typography variant={"h4"} component={"h2"}>{props.titulo}</Typography>
                </AccordionSummary>
                <AccordionDetails>
                    {props.children}
                </AccordionDetails>
            </Accordion>

        </div>
    );
}