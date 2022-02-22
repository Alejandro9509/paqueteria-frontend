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
import {obtenerConceptosFacturacion} from "../../Util/Contexts/ConceptosFacturacionContext";
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import {obtenerListadoZonaOperativaBySucursal} from "../../Util/Contexts/ZonaOperativaContext";
import {DataGrid} from "@material-ui/data-grid";
import {dataGridLocaleText} from "../../Constants";
import SvgIcon from "@material-ui/core/SvgIcon";
import {ReactComponent as Activo} from "../../iconos/Menu/palomita.svg";
import {ReactComponent as NoActivo} from "../../iconos/Menu/cruz.svg";
import {getUniqueListBy} from "../../Util/Util";

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
    const [sucursalesListado, setSucursalesListado] = useState([])
    const [conceptosListado, setConceptosListado] = useState([])
    const [zonasListado, setZonasListado] = useState([])
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

    const handleDeleteViajeLocal = (viaje) => {
        let newViajes = []
        viajesLocalesListado.forEach(i => {
            newViajes.push(i)
        })

        setViajesLocalesListado(newViajes.filter(i => i.idViaje !== viaje.idViaje))
    }
    const handleShowDialogZonas = (viaje, show) => {
        if (show){
            obtenerListadoZonaOperativaBySucursal(viaje.idSucursal).then(respuesta => {
                setZonasListado(respuesta.data)
                setDialogZonas({
                    ...dialogZonas,
                    showDialogZonas: show,
                    idViaje: viaje.idViaje,
                    selection: viaje.zonasSeleccionadas.map(i => i.m_nIdZona)
                })
            })
        }else {
            setDialogZonas({
                ...dialogZonas,
                showDialogZonas: false,
                idViaje: null,
                selection: []
            })
        }

    }
    
    const handleConfirmZonas = (zonasSeleccion) => {
        let zonas = []
        zonasSeleccion.forEach(i => {
            zonas.push(zonasListado.find(j => j.m_nIdZona === parseInt(i)))
        })
        viajesLocalesListado.forEach(i => {
            if (i.idViaje === dialogZonas.idViaje){
                i.zonasSeleccionadas = zonas
            }
        })

        setDialogZonas({
            ...dialogZonas,
            showDialogZonas: false,
            idViaje: null,
            selection: []
        })

    }

    const esConceptoViajeLocal = (concepto) => {
        /*return concepto.m_nIdConceptosFacturacion === props.configuraciones.IdConceptoRecoleccion
        || concepto.m_nIdConceptosFacturacion === props.configuraciones.IdConceptoEntrega*/
        return true
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
                        rows={zonasListado}
                        columns={dialogZonas.columns}
                    />
            }
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
                            handleDeleteViajeLocal={handleDeleteViajeLocal}
                            handleShowDialogZonas={handleShowDialogZonas}
                        />
                    )
                }
            </Paper>

        </div>
    )
}

function ViajeLocal(props) {

    const [state, setState] = useState({
        idViaje: props.viaje.idViaje || 0,
        idSucursal: props.viaje.idSucursal || null,
        zonasSeleccionadas: props.viaje.zonasSeleccionadas || [],
        idConcepto: props.viaje.idConcepto || null,
        rangos: props.viaje.rangos || [],
        productosSeleccionados: props.viaje.productosSeleccionados || []
    })

    const handleChangeViajeLocal = (event) => {
        setState({
            ...state,
            [event.target.name]: event.target.value
        })
    }
    const handleShowDialogZonas = (event) => {
        props.handleShowDialogZonas(props.viaje, true)
    }
    useEffect(value => {
        console.log(state)
        props.handleChangeViajeLocal(state)
    }, [state])

    return(
        <div>
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
                        titulo={props.viaje.zonasSeleccionadas.map(i=> i.m_sCodigoZona).join(', ')}
                    />
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
                    <Typography>
                        Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse malesuada lacus ex,
                        sit amet blandit leo lobortis eget.
                    </Typography>
                </AccordionDetails>
            </Accordion>

        </div>
    );
}

function DialogCheckbox(props) {
    /** Props
     * handleShowDialog() - Controla si se abre o cierra el dialogo.
     * handleOnConfirmSelection() - Retorna al padre los items seleccionados.
     * openDialog Boolean - Controla si se abre o cierra el dialogo
     * rowId string - identificador para item de la lista que se usara en el datagrid
     * selection array - Lista de item seleccionados del datagrid
     * rows - lista de registros a mostrar en la tabla
     * columns - columnas que se veran en la tabla
     * */
    const [state, setState] = useState({
        height: window.innerHeight,
    })

    const [selection, setSelection] = useState(props.selection || [])

    const handleShowDialog = () => {
        props.handleShowDialog(null, false)
    }
    const handleConfirmSelection = () => {
        console.log(selection)
        props.handleOnConfirmSelection(selection)
    }
    const handleOnSelectionChange = (event) => {
        console.log(event.selectionModel)
        setSelection(event.selectionModel)
    }

    return(
        <Dialog
            fullWidth={true}
            maxWidth={'xl'}
            open={props.openDialog}
            onClose={handleShowDialog}
            aria-labelledby="max-width-dialog-title"
        >
            <DialogContent>
                <div style={{ display: 'flex', height: '800px' }}>
                    <DataGrid
                        localeText={dataGridLocaleText}
                        rows={props.rows}
                        columns={props.columns}
                        density="compact"
                        pageSize={Math.floor((state.height - 310) / 30)}
                        getRowId={(row) => row[props.rowId]}
                        checkboxSelection
                        onSelectionModelChange={(e) => handleOnSelectionChange(e)}
                        selectionModel={props.selection}
                    />
                </div>
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

