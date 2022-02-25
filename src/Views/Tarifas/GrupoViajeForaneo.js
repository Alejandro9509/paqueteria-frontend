import React, {useEffect, useState} from "react";
import DialogCheckbox from "./DialogCheckbox";
import DialogoNuevoRango from "./DialogoNuevoRango";
import DialogTransferList from "./DialogTransferList";
import {Accordion, AccordionDetails, AccordionSummary, Button, Grid, IconButton} from "@material-ui/core";
import RangosTarifa from "./RangosTarifa";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import Typography from "@material-ui/core/Typography";
import EditIcon from "@material-ui/icons/Edit";
import DeleteIcon from "@material-ui/icons/Delete";

export default function GrupoViajeForaneo(props){
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
    const handleShowDialogZonas = (show) => {
        if (show){
            props.onRequestZonasByDestino(state.idDestino)
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
        setDialogRangos({
            ...dialogRangos,
            showDialog: true,
            selection: row,
            isEdit: true
        })
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
        console.log(state)
        console.log(props.grupo)
        props.onEditGrupo(props.grupo)
    }

    useEffect(() => {
        props.onGrupoDataChange(state)
    }, [state])

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
                    <Grid item xs={6}>
                        <Button fullWidth variant={"contained"} color={"primary"} onClick={handleShowDialogZonas}>
                            Zonas
                        </Button>
                    </Grid>
                    <Grid item xs={6}>
                        <Button fullWidth variant={"contained"} color={"primary"} onClick={handleShowDialogProductos}>
                            Productos
                        </Button>
                    </Grid>
                    <Grid item xs={10}>
                        <RangosTarifa
                            rows={state.rangos}
                            onEditRow={handleOnEditRow}
                            onDeleteRow={handleOnDeleteRow}
                            onChangeList={handleChangeRangosViaje}
                            disabled={false}
                        />
                    </Grid>
                    <Grid item xs={2}>
                        <Button fullWidth variant={"contained"} color={"primary"}
                                onClick={() => handleShowDialogRangos( true)}>
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
                            <Typography variant={"h4"} component={"h2"}>{props.titulo}</Typography>
                        </Grid>
                        <Grid item xs={2}>
                            <IconButton onClick={props.onEditGrupo}>
                                <EditIcon fontSize={'large'}/>
                            </IconButton>
                            <IconButton onClick={props.onDeleteGrupo}>
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