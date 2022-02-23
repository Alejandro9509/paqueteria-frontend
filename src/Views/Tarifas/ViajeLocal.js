import React, {useEffect, useState} from "react";
import DialogoNuevoRango from "./DialogoNuevoRango";
import {Accordion, AccordionDetails, AccordionSummary, Button, Grid, MenuItem, TextField} from "@material-ui/core";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import Typography from "@material-ui/core/Typography";
import RangosTarifa from "./RangosTarifa";


export default function ViajeLocal(props) {

    const [state, setState] = useState({
        idViaje: props.viaje.idViaje || 0,
        idSucursal: props.viaje.idSucursal || null,
        zonasSeleccionadas: props.viaje.zonasSeleccionadas || [],
        idConcepto: props.viaje.idConcepto || null,
        rangos: props.viaje.rangos || [],
        productosSeleccionados: props.viaje.productosSeleccionados || []
    })
    const [dialogRangos, setDialogRangos] = useState({
        showDialog: false,
        selection: null,
        idViaje: null,
        isEdit: false
    })

    const handleChangeViajeLocal = (event) => {
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
    const handleShowDialogZonas = (event) => {
        props.handleShowDialogZonas(props.viaje, true)
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
        console.log(state)
        props.handleChangeViajeLocal(state)
    }, [state])

    return(
        <div>

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
            <Grid container spacing={2}>
                <Grid item xs>
                    <TextField
                        id="idSucursal"
                        select
                        label="Sucursal"
                        value={props.viaje.idSucursal}
                        onChange={handleChangeViajeLocal}
                        name="idSucursal"
                        variant="outlined"
                        margin={"dense"}
                    >
                        {props.sucursalesListado.map((option) => (
                            <MenuItem key={option.m_nIdSucursal} value={option.m_nIdSucursal}>
                                {option.m_sSucursal}
                            </MenuItem>
                        ))}
                    </TextField>
                </Grid>
                <Grid item xs>
                    <TextField
                        id="idConcepto"
                        select
                        label="Concepto"
                        value={props.viaje.idConcepto}
                        onChange={handleChangeViajeLocal}
                        name="idConcepto"
                        variant="outlined"
                        margin={"dense"}
                    >
                        {props.conceptosListado.map((option) => (
                            <MenuItem key={option.m_nIdConceptosFacturacion} value={option.m_nIdConceptosFacturacion}>
                                {option.m_sConcepto}
                            </MenuItem>
                        ))}
                    </TextField>
                </Grid>
                <Grid item xs>
                    <Button fullWidth variant={"contained"} color={"primary"} onClick={handleShowDialogZonas}>
                        Zonas
                    </Button>
                </Grid>
                <Grid item xs>
                    <Button fullWidth variant={"text"} onClick={() => props.handleDeleteViajeLocal(props.viaje)}>
                        X
                    </Button>
                </Grid>
                <Grid item xs={12}>
                    <SimpleAccordion
                        titulo={props.viaje.zonasSeleccionadas.map(i=> i.m_sCodigoZona).join(', ')}>
                        <Grid container spacing={2}>
                            <Grid item xs={10}>
                                <RangosTarifa
                                    rows={props.viaje.rangos}
                                    onEditRow={handleOnEditRow}
                                    onDeleteRow={handleOnDeleteRow}
                                    onChangeList={handleChangeRangosViaje}
                                    disabled={false}
                                />
                            </Grid>
                            <Grid item xs={2}>
                                <Button fullWidth variant={"contained"} color={"primary"} onClick={() => handleShowDialogRangos(props.viaje, true)}>
                                    Rangos
                                </Button>
                            </Grid>
                        </Grid>


                    </SimpleAccordion>
                </Grid>
            </Grid>
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
                    <Typography>{props.titulo}</Typography>
                </AccordionSummary>
                <AccordionDetails>
                    {props.children}
                </AccordionDetails>
            </Accordion>

        </div>
    );
}