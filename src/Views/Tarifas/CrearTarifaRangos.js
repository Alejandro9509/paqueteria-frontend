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
import {
    obtenerConceptosFacturacion,
    obtenerImpuestosByConceptosFacturacion
} from "../../Util/Contexts/ConceptosFacturacionContext";
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import {obtenerListadoZonaOperativaBySucursal} from "../../Util/Contexts/ZonaOperativaContext";
import {DataGrid} from "@material-ui/data-grid";
import {dataGridLocaleText} from "../../Constants";
import SvgIcon from "@material-ui/core/SvgIcon";
import {ReactComponent as Activo} from "../../iconos/Menu/palomita.svg";
import {ReactComponent as NoActivo} from "../../iconos/Menu/cruz.svg";
import {getUniqueListBy} from "../../Util/Util";
import DialogCheckbox from "./DialogCheckbox";
import DialogoNuevoRango from "./DialogoNuevoRango";
import {obtenerTiposCalculo} from "../../Util/Contexts/TipoCalculoContext";
import IconButton from "@material-ui/core/IconButton";
import EditIcon from "@material-ui/icons/Edit";
import DeleteIcon from "@material-ui/icons/Delete";
import {obtenerImpuestos} from "../../Util/Contexts/ImpuestosContext";
import axios from "axios";
import DialogoNuevoConcepto from "./DialogoNuevoConcepto";

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
    const [tiposCalculoListado, setTiposCalculoListado] = useState([])
    const [unidadesMedidaListado, setUnidadesMedidaListado] = useState([
        {
            IdUnidadMedida: 1,
            UnidadMedida: 'KG'
        },{
            IdUnidadMedida: 2,
            UnidadMedida: 'TONS'
        },
    ])
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
    const getAllTiposCalculo = () => {
        if (tiposCalculoListado.length > 0){
            return
        }
        obtenerTiposCalculo().then(respuesta => {
            setTiposCalculoListado(respuesta.data)
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
        getAllTiposCalculo()
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
                            tiposCalculoListado={tiposCalculoListado}
                            unidadesMedidaListado={unidadesMedidaListado}
                            handleDeleteViajeLocal={handleDeleteViajeLocal}
                            handleShowDialogZonas={handleShowDialogZonas}
                            // handleShowDialogRangos={handleShowDialogRangos}
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

function RangosTarifa(props) {

    /**Props
     * rows = Listado de rangos
     * onDeleteRow = funcion que se ejecuta cuando se quiere borrar un registro
     * onEditRow = funcion que se ejecuta cuando se quiere editar un registro
     * disabled = para indicar si es se deshabilitarán los campos
     * */
    function RowMenuCell(propss) {
        const { api, id } = propss;

        const handleEditClick = (event) => {
            event.stopPropagation();
            let row = props.rows.filter((p) => p.id === id)[0];
            handleEditConcepto(row);
        };

        const handleDeleteClick = (event) => {
            event.stopPropagation();
            let row = props.rows.filter((p) => p.id === id)[0];
            handleDeleteConcepto(row);
        };

        return (
            <div>
                <IconButton color="inherit" size="small" aria-label="delete" onClick={handleEditClick}>
                    <EditIcon fontSize="large" />
                </IconButton>
                <IconButton color="inherit" size="small" aria-label="delete" onClick={handleDeleteClick}>
                    <DeleteIcon fontSize="large" />
                </IconButton>
            </div>
        );
    }

    const columns = React.useMemo(() => [
        {
            headerName: "Medida",
            field: "unidadMedida",
            width: 150,
        },{
            headerName: "Minimo",
            field: "minimo",
            type:'number',
            width: 150,
        },{
            headerName: "Maximo",
            field: "maximo",
            type:'number',
            width: 150,
        },{
            headerName: "Importe",
            field: "importe",
            type:'number',
            width: 150,
            valueFormatter: ({value}) => currencyFormatter.format(Number(value)),
        },{
            headerName: "Calculo",
            field: "tipoCalculo",
            width: 150,
        },
        // !props.props.disabled &&
        {
            field: 'complementos',
            headerName: 'Acciones',
            renderCell: RowMenuCell,
            sortable: false,
            width: 90,
            headerAlign: 'center',
            filterable: false,
            align: 'center',
            disableColumnMenu: true,
            disableReorder: true,
        }
    ]);

    const currencyFormatter = new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
    });
    /*const [concepto, setConcepto] = useState({
        id:Math.floor(Math.random() * 10000),
        importe: 0,
        rangoMinimo: 0,
        rangoMaximo: 0,
        idCalculo: null,
        idMedida: null,
    })
    const [state, setState] = useState({
        impuestos: [],
        ivaTraslada: [],
        ivaRetiene: [],
        tiposCalculo: [],
        columns: [],
        aplicaDescuento: false,
        aplicarDescuentoA: 'Concepto',
    })
    const [dialogRangos, setDialogRangos] = useState({
        showDialog: false,
        rango: {
            id:Math.floor(Math.random() * 10000),
            importe: 0,
            minimo: 0,
            maximo: 0,
            tipoCalculo: 0,
            tipoMedida: 0,
        },
        idViaje: null,
    })

    const resetPaquete = () =>{
        setConcepto(concepto => {
            return {
                ...concepto,
                id:Math.floor(Math.random() * 10000),
                importe: 0,
                rangoMinimo: 0,
                rangoMaximo: 0,
                idCalculo: null,
                idMedida: null,
            }
        })
    }
    
    const addPaquetev2 = (data) => {
        console.log(data)
        let paq = data
        
        const arraynew = []
        if (props.rows.find(item => item.id === data.id)){
            props.rows.forEach(item => {
                if (item.id === data.id){
                    item = data
                }
                arraynew.push(item)
            })
        }else{
            props.rows.push(paq);
            props.rows.forEach(item => {
                arraynew.push(item)
            })
        }
        props.onChangeList(arraynew)

    }*/

    /**Reacciona al hacer clic en editar concepto*/
    const handleEditConcepto = (data) =>{
        if(!props.disabled){
            props.onEditRow(data)
        }

    }

    /**Reacciona al hacer clic en eliminar concepto*/
    const handleDeleteConcepto = (data) =>{
        if(!props.disabled){
            props.onDeleteRow(data)
        }
    }

    return(
        <div>
            <div className="row" style={{height: `${(props.rows.length * 20)+80}px` , width: "100%"}}>
                <DataGrid
                    localeText={dataGridLocaleText}
                    density="compact"
                    columns={columns}
                    rows={props.rows}
                    hideFooter
                    getRowId={(row) => row.id}
                    // onRowSelected={(row) => handleRowClick(row.data)}
                />
            </div>
        </div>
    )
}



