import React, {useEffect, useState} from "react";
import DialogCheckbox from "./DialogCheckbox";
import DialogoNuevoRango from "./DialogoNuevoRango";
import DialogTransferList from "./DialogTransferList";
import {Accordion, AccordionDetails, AccordionSummary, Button, Grid, IconButton} from "@mui/material";
import RangosTarifa from "./RangosTarifa";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import Typography from "@mui/material/Typography";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import AddIcon from "@mui/icons-material/AddBox";
import DialogoNuevoPorcentaje from "./DialogoNuevoPorcentaje";

export default function GrupoViajeForaneo(props){
    const UNIDADES_MEDIDA = {KILOGRAMOS: 21, TONELADAS: 48, PIEZAS: 38, PORCIENTO: 55}
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
                headerName: "Destino",
                field: 'm_sOrigenDestino',
                minWidth: 200,
                flex: 1
            }
        ]
    })

    const handleShowDialogZonas = (show) => {
        if (show){
            props.onRequestZonasByDestino()
            setDialogZonas({
                ...dialogZonas,
                showDialogZonas: show,
                selection: state.zonas.map(i => i.m_nIdZona)
            })
        }else {
            setDialogZonas({
                ...dialogZonas,
                showDialogZonas: false,
                selection: []
            })
            props.handleShowDialogZonas(false)
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
        setDialogZonas({
            ...dialogZonas,
            showDialogZonas: false,
            selection: []
        })
        props.handleShowDialogZonas(false)
    }

    const [dialogRangos, setDialogRangos] = useState({
        showDialog: false,
        selection: null,
        isEdit: false
    })

    const handleShowDialogRangos = (show) => {
        if (show){
            setDialogRangos({
                ...dialogRangos,
                showDialog: show,
            })
        }else {
            setDialogRangos({
                ...dialogRangos,
                showDialog: false,
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

    const [dialogPorcentaje, setDialogPorcentaje] = useState({
        showDialog: false,
        selection: null,
        isEdit: false
    })

    const handleShowDialogPorcentaje = (show) => {
        if (show){
            setDialogPorcentaje({
                ...dialogPorcentaje,
                showDialog: show,
            })
        }else {
            setDialogPorcentaje({
                ...dialogPorcentaje,
                showDialog: false,
                selection: null,
                isEdit: false
            })
        }
    }

    const handleConfirmPorcentaje = (rango) => {
        let newRangos = []
        if (dialogPorcentaje.isEdit){
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

        setDialogPorcentaje({
            ...dialogPorcentaje,
            showDialog: false,
            idViaje: null,
            selection: null,
            isEdit: false
        })
    }

    const [dialogProdutos, setDialogProdutos] = useState({
        showDialog: false,
        selection: [],
    })

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
        if (props.mode === 'PORCENTAJE') {
            setDialogPorcentaje({
                ...dialogPorcentaje,
                showDialog: true,
                selection: row,
                isEdit: true
            })
        } else {
            setDialogRangos({
                ...dialogRangos,
                showDialog: true,
                selection: row,
                isEdit: true
            })
        }

    }

    const handleChangeRangosViaje = (newRangos) => {
        setState({
            ...state,
            rangos: newRangos
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
        props.onEditGrupo(props.grupo)
    }

    useEffect(() => {
        props.onGrupoDataChange(state)
    }, [state])

    return(
        <div>
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
                    tiposCalculoListado={props.tiposCalculoListado}
                    unidadesMedidaListado={props.unidadesMedidaListado}
                    handleShowDialog={handleShowDialogRangos}
                    openDialog={dialogRangos.showDialog}
                    rows={props.grupo.rangos}
                />
            }
            {
                dialogPorcentaje.showDialog &&
                <DialogoNuevoPorcentaje
                    handleOnConfirmData={handleConfirmPorcentaje}
                    rango={dialogPorcentaje.selection}
                    tiposCalculoListado={props.tiposCalculoListado}
                    unidadesMedidaListado={props.unidadesMedidaListado}
                    handleShowDialog={handleShowDialogPorcentaje}
                    openDialog={dialogPorcentaje.showDialog}
                    rows={props.grupo.rangos}
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
            <SimpleAccordion titulo={props.grupo.nombre} onDeleteGrupo={handleOnDeleteGrupo} onEditGrupo={handleOnEditGrupo} disabled={props.disabled}>
                <Grid container spacing={2}>
                    <Grid item xs={6}>
                        <Button fullWidth variant={"contained"} style={{fontSize:"1em"}} color={"primary"} onClick={handleShowDialogZonas}>
                            {`Zonas (${state.zonas.length})`}
                        </Button>
                    </Grid>
                    <Grid item xs={6}>
                        <Button fullWidth variant={"contained"} style={{fontSize:"1em"}} color={"primary"} onClick={handleShowDialogProductos}>
                            {`Productos (${state.productos.length})`}
                        </Button>
                    </Grid>
                    <Grid item xs={10}>
                        <RangosTarifa
                            rows={state.rangos}
                            onEditRow={handleOnEditRow}
                            onDeleteRow={handleOnDeleteRow}
                            onChangeList={handleChangeRangosViaje}
                            disabled={props.disabled}
                            mode={props.mode}
                        />
                    </Grid>
                    <Grid item xs={2}>
                        { props.mode === 'PORCENTAJE' ?
                            (<Button fullWidth variant={"contained"} color={"primary"}
                                     onClick={() => handleShowDialogPorcentaje(true)}
                                     disabled={props.disabled || (state.rangos.length > 0)}>
                                <AddIcon fontSize={'large'}/>
                                &nbsp;&nbsp;Agregar Porcentaje
                            </Button>)
                                :
                            (<Button fullWidth variant={"contained"} color={"primary"} style={{fontSize:"1em"}}
                                    onClick={() => handleShowDialogRangos(true)} disabled={props.disabled}>
                                <AddIcon fontSize={'large'}/>
                                &nbsp;&nbsp;Agregar Rangos
                            </Button>)
                        }
                    </Grid>

                </Grid>
            </SimpleAccordion>
        </div>
    )
}

function SimpleAccordion(props) {
    return (
        <div style={{marginTop: '10px'}}>
            <Accordion>
                <AccordionSummary
                    style={{backgroundColor: '#E6E6E6',height:'20px'}}
                    expandIcon={<ExpandMoreIcon fontSize={'large'}/>}
                    aria-controls="panel1a-content"
                    id="panel1a-header"
                >
                    <Grid container spacing={1} alignItems="center" direction="row">
                        <Grid item xs={10}>
                            <Typography variant={"h4"} component={"h2"}>{props.titulo}</Typography>
                        </Grid>
                        <Grid item xs={2}>
                            <IconButton onClick={props.onEditGrupo} disabled={props.disabled} size="large">
                                <EditIcon fontSize={'large'}/>
                            </IconButton>
                            <IconButton onClick={props.onDeleteGrupo} disabled={props.disabled} size="large">
                                <DeleteIcon fontSize={'large'}/>
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