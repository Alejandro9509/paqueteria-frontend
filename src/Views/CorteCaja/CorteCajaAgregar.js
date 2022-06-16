import React, {useState, useEffect} from 'react'
import Cabecera from "../../Components/Template/Cabecera";
import BarraLateralIzquierda from "../../Components/Template/BarraLateralIzquierda";
import TextField from "@material-ui/core/TextField";
import {
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    FormControl,
    Grid,
    InputLabel, MenuItem,
    Select,
    Tooltip
} from "@material-ui/core";
import {obtenerSucursales} from "../../Util/Contexts/SucursalContext";
import Autocomplete from "@material-ui/lab/Autocomplete";
import IconButton from "@material-ui/core/IconButton";
import AddBoxIcon from "@material-ui/icons/AddBox";
import DeleteIcon from "@material-ui/icons/Delete";
import {DataGrid} from "@material-ui/data-grid";
import {dataGridLocaleText} from "../../Constants";
import InputAdornment from "@material-ui/core/InputAdornment";
import PageviewIcon from "@material-ui/icons/Pageview";
import {obtenerCiudades, obtenerCiudadId} from "../../Util/Contexts/CiudadesContext";
import {obtenerMonedas} from "../../Util/Contexts/MonedaContext";
import {obtenerGuiaId, obtenerGuiasFiltro, obtenerGuiasFiltroCorteCaja} from "../../Util/Contexts/GuiaContext";
import Noty from "noty";
import {agregarCorte, modificarCorte, obtenerCorteId} from "../../Util/Contexts/CorteCajaContext";
import {obtenerTiposPago} from "../../Util/Contexts/TipoPagoContext";

function showSuccess(mensaje) {
    new Noty({
        type: "information",
        layout: "topCenter",
        text: mensaje,
        timeout: "3000"
    }).show()
}

function CorteCajaAgregar({pantallaActiva, select, consult}){

    const [dataSucursal, setDataSucursal] = useState([])
    const [dataCiudad, setDataCiudad] = useState([])
    const [dataTipoMoneda, setDataTipoMoneda] = React.useState([]);
    const [dataTipoPago, setDataTipoPago] = React.useState([]);
    const [dataGuias, setDataGuias] = useState([])
    const [guiaSelect, setGuiaSelect] = useState(null)
    const [dataGuiasAgregar, setDataGuiasAgregar] = useState([])
    const [showDialog, setShowDialog] = useState(false)

    const currencyFormatter = new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
    });
    const columnsGuias = React.useMemo(() => [
        {
            headerName: "Fecha/Hora",
            field: "m_sFechaHora",
            flex: 1,
        }, {
            headerName: "Folio Guia",
            field: "m_nFolioGuia",
            flex: 1,
        },{
            headerName: "Estatus Guia",
            field: "m_sEstatusGuia",
            flex: 1,
        }, {
            headerName: "Origen",
            field: "m_sCiudadOrigen",
            flex: 1,
        }, {
            headerName: "Destino",
            field: "m_sCiudadDestino",
            flex: 1,
        },{
            headerName: "Cliente",
            field: "m_sCliente",
            flex: 1,
        },{
            headerName: "Importe",
            field: "m_cImporte",
            type:'number',
            valueFormatter: ({ value }) => currencyFormatter.format(Number(value)),
            flex: 1,
        },{
            headerName: "Importe IVA",
            field: "m_cImporteIva",
            type:'number',
            valueFormatter: ({ value }) => currencyFormatter.format(Number(value)),
            flex: 1,
        },{
            headerName: "Importe Retiene",
            field: "m_cImporteRetiene",
            type:'number',
            valueFormatter: ({ value }) => currencyFormatter.format(Number(value)),
            flex: 1,
        },{
            headerName: "Descuento",
            field: "m_cDescuento",
            type:'number',
            valueFormatter: ({ value }) => currencyFormatter.format(Number(value)),
            flex: 1,
        },{
            headerName: "Total",
            field: "m_cTotal",
            type:'number',
            valueFormatter: ({ value }) => currencyFormatter.format(Number(value)),
            flex: 1,
        },
    ]);
    const [infoGeneral, setInfoGeneral] = useState({
        idUsuario: localStorage.getItem("UsuarioId"),
        idSucursal: localStorage.getItem("Sucursal"),
        fechaRegistro: `${new Date().getFullYear()}-${`${new Date().getMonth() + 1}`.padStart(2, 0)}-${`${new Date().getDate()}`.padStart(2, 0)}`,
        horaRegistro: `${`${new Date().getHours()}`.padStart(2, 0)}:${`${new Date().getMinutes()}`.padStart(2, 0)}`,
    })
    const [guiasSeleccionadas, setGuiasSeleccionadas] = useState([])
    const [state, setState] = useState({
        idCorte: 0,
        ciudadDestino: null,
        idTipoMoneda: 0,
        idTipoPago: 0,
        folioGuia: null,
        total: 0.0,
        idEstatus: 0
    })

    const listado = 1
    const agregar = 2
    const modificar = 3

    useEffect(value =>{
        getAllSucursales()
        getAllCiudades()
        getAllTipoMoneda()
        getAllTipoPago()
    }, [])

    useEffect( value => {
        if (pantallaActiva === listado){
            limpiarCampos()
        }else if (pantallaActiva === agregar){
            limpiarCampos()
        }else if (pantallaActiva === modificar){
            limpiarCampos()
            obtenerCorteId(select).then(({data}) =>{
                obtenerCiudadId(data.m_nIdDestino).then(({data}) => {
                    setState(state => {
                        return {
                            ...state,
                            ciudadDestino: data
                        }
                    })
                })
                let totalTotal = 0.0
                data.m_arrGuias.forEach((i) => {
                    let m_cImporte = 0
                    let m_cImporteIva = 0
                    let m_cImporteRetiene = 0
                    let m_cTotal = 0
                    i.m_arClsGuiaConceptos.forEach((j) => {
                        m_cImporte += parseFloat(j.m_cImporte)
                        m_cImporteIva += parseFloat(j.m_cImporteIva)
                        m_cImporteRetiene += parseFloat(j.m_cImporteRetiene)
                        m_cTotal += parseFloat(j.m_cTotal)
                    })
                    i.m_cImporte = m_cImporte
                    i.m_cImporteIva = m_cImporteIva
                    i.m_cImporteRetiene = m_cImporteRetiene
                    i.m_cTotal = m_cTotal
                    totalTotal += parseFloat(m_cTotal)
                })
                setState(state =>{
                    return {
                        ...state,
                        idCorte: data.m_nIdCorte,
                        idTipoMoneda: data.m_nIdTipoMoneda,
                        idTipoPago: data.m_nIdTipoPago,
                        folioGuia: null,
                        total: totalTotal,
                        idEstatus: data.m_nIdEstatusCorte
                    }
                })

                setDataGuias(data.m_arrGuias)
            })
        }
    }, [pantallaActiva])

    useEffect( value => {
        if (pantallaActiva === agregar){
            if (state.ciudadDestino && state.idTipoMoneda && state.idTipoPago && infoGeneral.fechaRegistro){
                //pedir guias filtradas filtrado
                obtenerGuiasFiltroCorteCaja(infoGeneral.fechaRegistro, state.ciudadDestino.m_nIdCiudad, state.idTipoMoneda, state.idTipoPago).then(({data}) => {
                    let totalTotal = 0.0
                    data.forEach((i) => {
                        let m_cImporte = 0
                        let m_cImporteIva = 0
                        let m_cImporteRetiene = 0
                        let m_cDescuento = 0
                        let m_cTotal = 0
                        i.m_arClsGuiaConceptos.forEach((j) => {
                            m_cImporte += parseFloat(j.m_cImporte)
                            m_cImporteIva += parseFloat(j.m_cImporteIva)
                            m_cImporteRetiene += parseFloat(j.m_cImporteRetiene)
                            m_cDescuento += parseFloat(j.m_c_Descuento)
                            m_cTotal += parseFloat(j.m_cTotal)
                        })
                        i.m_cImporte = m_cImporte
                        i.m_cImporteIva = m_cImporteIva
                        i.m_cImporteRetiene = m_cImporteRetiene
                        i.m_cDescuento = m_cDescuento
                        i.m_cTotal = m_cTotal
                        totalTotal += parseFloat(m_cTotal)
                    })
                    setState( state => {
                        return{
                            ...state,
                            total: totalTotal
                        }
                    })
                    setDataGuias(data)
                })
            }
        }

    }, [state.ciudadDestino, state.idTipoMoneda, state.idTipoPago, infoGeneral.fechaRegistro])

    const limpiarCampos = () => {
        setState(state => {
            return {
                ...state,
                idCorte: 0,
                ciudadDestino: null,
                idTipoMoneda: 0,
                idTipoPago: 0,
                folioGuia: null,
                total: 0.0,
                idEstatus: 0
            }
        })

        setDataGuias([])
        setDataGuiasAgregar([])
        setGuiasSeleccionadas([])
        setGuiaSelect(null)
    }

    const getAllSucursales = () => {
        obtenerSucursales().then((respuesta) => {
            setDataSucursal(respuesta.data);
        });
    }

    async function getAllTipoMoneda() {
        obtenerMonedas().then((respuesta) => {
            setDataTipoMoneda(respuesta.data);
        });
    }

    const getAllTipoPago = () => {
        obtenerTiposPago().then(({data}) => {
            setDataTipoPago(data)
        })
    }

    async function getAllCiudades() {
        obtenerCiudades().then((respuesta) => {
            setDataCiudad(respuesta.data);
        });
    }

    const handleChangeInfoGeneral = (event) => {
        event.preventDefault()
        const {target} = event
        setInfoGeneral(infoGeneral => {
            return {
                ...infoGeneral,
                [target.name]: target.value
            }
        })
    }

    const handleChange = (event) => {
        setState({
            ...state,
            [event.target.name]: event.target.value,
        });
    };

    const handleCloseDialog = () => {
        setShowDialog(false)
    }

    const handleGuiasSeleccionadas = (event) => {
        setGuiasSeleccionadas(event.selectionModel)
    };

    const handleConfirmGuias = (event) => {
        event.preventDefault()
        let guiasNuevoListado = []
        let guias = []
        guiasSeleccionadas.forEach((id) => {
            obtenerGuiaId(id).then(({data}) => {
                guias.push(data)
                if (guias.length === guiasSeleccionadas.length){
                    dataGuias.forEach((i) => {
                        guiasNuevoListado.push(i)
                    })
                    guias.forEach((i) => {
                        guiasNuevoListado.push(i)
                    })
                    let totalTotal = 0.0
                    guiasNuevoListado.forEach((i) => {
                        let m_cImporte = 0
                        let m_cImporteIva = 0
                        let m_cImporteRetiene = 0
                        let m_cDescuento = 0
                        let m_cTotal = 0
                        i.m_arClsGuiaConceptos.forEach((j) => {
                            m_cImporte += parseFloat(j.m_cImporte)
                            m_cImporteIva += parseFloat(j.m_cImporteIva)
                            m_cImporteRetiene += parseFloat(j.m_cImporteRetiene)
                            m_cDescuento += parseFloat(j.m_c_Descuento)
                            m_cTotal += parseFloat(j.m_cTotal)
                        })
                        i.m_cImporte = m_cImporte
                        i.m_cImporteIva = m_cImporteIva
                        i.m_cImporteRetiene = m_cImporteRetiene
                        i.m_cDescuento = m_cDescuento
                        i.m_cTotal = m_cTotal
                        totalTotal += parseFloat(m_cTotal)
                    })
                    setState( state => {
                        return{
                            ...state,
                            total: totalTotal
                        }
                    })
                    setDataGuias(guiasNuevoListado)
                }
            }).catch(function (err) {
                console.log(err.data)
            });
        })
        handleCloseDialog()
    };

    const handleGuiaClick = (data) => {
        setGuiaSelect(data)
    }

    const handleEliminarGuia = (event) => {
        let guiasNuevas = []
        guiasNuevas = dataGuias.filter((i) => i.m_nIdGuia != guiaSelect.m_nIdGuia)
        let totalTotal = 0.0
        guiasNuevas.forEach((i) => {
            totalTotal += parseFloat(i.m_cTotal)
        })
        setState( state => {
            return{
                ...state,
                total: totalTotal
            }
        })
        setDataGuias(guiasNuevas)
        setGuiaSelect(null)
    }

    const handleGuardarCorte = (e) => {
        e.preventDefault()
        if (dataGuias.length === 0 ){
            showSuccess("Debe haber al menos una guia.")
            return
        }
        if (!state.ciudadDestino || !state.idTipoMoneda || !state.idTipoPago){
            showSuccess("Debe haber al menos una guia.")
            return
        }
        let params = {
            m_nIdCorte: state.idCorte,
            m_nIdUsuario: infoGeneral.idUsuario,
            m_nIdSucursal: infoGeneral.idSucursal,
            m_sFechaRegistro: infoGeneral.fechaRegistro,
            m_sHoraRegistro: infoGeneral.horaRegistro,
            m_nIdDestino: state.ciudadDestino.m_nIdCiudad,
            m_nIdTipoMoneda: state.idTipoMoneda,
            m_nIdTipoPago: state.idTipoPago,
            m_cTotal: state.total,
            m_nIdEstatusCorte: state.idEstatus==2 ? 3 : 1,
            m_arrGuias: dataGuias
        }
        console.log(params)
        console.log(JSON.stringify(params))

        if (state.idCorte === 0){
            agregarCorte(params).then((respuesta) =>{
                showSuccess(respuesta.data)
                limpiarCampos()
            })
        }else{
            modificarCorte(state.idCorte, params).then((respuesta) => {
                showSuccess(respuesta.data)
                limpiarCampos()
            })
        }
    }

    const handleCerrarCorte = (e) => {
        e.preventDefault()
        if (dataGuias.length === 0 ){
            showSuccess("Debe haber al menos una guia.")
            return
        }
        if (!state.ciudadDestino || !state.idTipoMoneda || !state.idTipoPago){
            showSuccess("Debe haber al menos una guia.")
            return
        }
        let params = {
            m_nIdCorte: state.idCorte,
            m_nIdSucursal: infoGeneral.idSucursal,
            m_sFechaRegistro: infoGeneral.fechaRegistro,
            m_sHoraRegistro: infoGeneral.horaRegistro,
            m_nIdDestino: state.ciudadDestino.m_nIdCiudad,
            m_nIdTipoMoneda: state.idTipoMoneda,
            m_nIdTipoPago: state.idTipoPago,
            m_cTotal: state.total,
            m_nIdEstatusCorte: 2,
            m_arrGuias: dataGuias
        }
        console.log(params)
        console.log(JSON.stringify(params))

        if (state.idCorte === 0){
            agregarCorte(params).then((respuesta) =>{
                showSuccess(respuesta.data)
                limpiarCampos()
            })
        }else{
            modificarCorte(state.idCorte, params).then((respuesta) => {
                showSuccess(respuesta.data)
                limpiarCampos()
            })
        }
    }

    //Maneja filtrado de listado guia
    const handleFolioGuiaFiltro = async (event) => {
        if(event.keyCode == 13) {
            let value = event.target.value
            if (event.target.value == '') {
                value = 0
            }
            setState({
                ...state,
                folioGuia: event.target.value,
            })
            obtenerGuiasFiltro(0, 0, 0, 0, value,0,0, 0).then(respuesta => {
                if (respuesta.data == "Vacio") {
                    setDataGuiasAgregar([])
                } else {
                    let totalTotal = 0.0
                    respuesta.data.forEach((i) => {
                        /*let m_cImporte = 0
                        let m_cImporteIva = 0
                        let m_cImporteRetiene = 0
                        let m_cTotal = 0*/
                        /*i.m_arClsGuiaConceptos.forEach((j) => {
                            m_cImporte += parseFloat(j.m_cImporte)
                            m_cImporteIva += parseFloat(j.m_cImporteIva)
                            m_cImporteRetiene += parseFloat(j.m_cImporteRetiene)
                            m_cTotal += parseFloat(j.m_cTotal)
                        })*/

                        totalTotal += parseFloat(i.m_cTotal)
                    })
                    setState( state => {
                        return{
                            ...state,
                            total: totalTotal
                        }
                    })
                    setDataGuiasAgregar(respuesta.data)
                }
            })
        }
    }

    return(
        <div>
            <Dialog
                fullWidth={true}
                maxWidth={'xl'}
                open={showDialog}
                onClose={handleCloseDialog}
                aria-labelledby="max-width-dialog-title"
            >
                <DialogContent>
                    <Grid container item xs={4}>
                        <div className="input">
                            <TextField variant="outlined" margin="dense"
                                       onChange={handleChange}
                                       onKeyDown={handleFolioGuiaFiltro}
                                       className="form-control"
                                       type="text"
                                       label="Folio Guia"
                                       placeholder={state.folioGuia}
                                       id="folioGuia"
                                       name="folioGuia"
                            />
                        </div>
                    </Grid>
                    <div style={{ display: 'flex', height: '800px' }}>
                        <DataGrid
                            localeText={dataGridLocaleText}
                            rows={dataGuiasAgregar}
                            columns={columnsGuias}
                            density="compact"
                            pageSize={10}
                            getRowId={(row) => row.m_nIdGuia}
                            checkboxSelection
                            onSelectionModelChange={(e) => handleGuiasSeleccionadas(e)}
                        />
                    </div>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCloseDialog} color="primary">
                        Cerrar
                    </Button>
                    <Button onClick={handleConfirmGuias} color="primary" autoFocus>
                        Aceptar
                    </Button>
                </DialogActions>
            </Dialog>
            <section className={"main-container"} style={{ marginLeft: "0px", padding: "0px" }}>
                <div className={"content-fluid"}>
                    <div className={'row'}>
                        <div className="widget-wrap">
                            <div className="widget-header">
                                <h2>Información general</h2>
                            </div>
                            <div className="widget-container">
                                <div className="widget-content">
                                    <div className="row">
                                        <div className="col-md-12">
                                            <Grid container spacing={2}>
                                                <Grid item xs={4}>
                                                    <FormControl className="input select" fullWidth variant="outlined">
                                                        <InputLabel
                                                            id="idSucursalLabel">Sucursal</InputLabel>
                                                        <Select
                                                            labelId="idSucursalLabel"
                                                            label="Sucursal"
                                                            className="form-control"
                                                            required
                                                            value={infoGeneral.idSucursal}
                                                            onChange={handleChangeInfoGeneral}
                                                            id="idSucursal"
                                                            name="idSucursal"
                                                            disabled="disabled"
                                                        >
                                                            {dataSucursal.map((sucursal) => (
                                                                <option
                                                                    key={sucursal.m_nIdSucursal}
                                                                    value={sucursal.m_nIdSucursal}
                                                                >
                                                                    {sucursal.m_sSucursal}
                                                                </option>
                                                            ))}
                                                        </Select>
                                                    </FormControl>
                                                </Grid>
                                                <Grid item xs={4}>
                                                    <div className="input">
                                                        <TextField
                                                            variant="outlined"
                                                            id="fechaRegistro"
                                                            label="Fecha de registro"
                                                            type="date"
                                                            onChange={(e) => setInfoGeneral({...infoGeneral,fechaRegistro: e.target.value}) }
                                                            value={infoGeneral.fechaRegistro}
                                                            className={"form-control"}
                                                            InputLabelProps={{shrink: true,}}
                                                            // required={state.recoleccionConCita}
                                                        />
                                                    </div>
                                                </Grid>
                                                <Grid item xs={4}>
                                                <div className="input">
                                                    <TextField
                                                        variant="outlined"
                                                        id="horaRegistro"
                                                        label="Hora de registro"
                                                        type="time"
                                                        value={infoGeneral.horaRegistro}
                                                        // onChange={handleHoraCitaMinima}
                                                        className={"form-control"}
                                                        disabled={true}
                                                        InputLabelProps={{shrink: true,}}
                                                        inputProps={{step: 300,}}
                                                        // required={state.recoleccionConCita}
                                                    />
                                                </div>
                                            </Grid>
                                            </Grid>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className={'row'}>
                        <div className="widget-wrap">
                            <div>
                                <form className="j-forms">
                                    <div className="widget-container">
                                        <div className="widget-content">
                                            <div className="row">
                                                <Grid container spacing={2}>
                                                    <Grid item xs={4}>
                                                        <div className="input">
                                                            <Autocomplete
                                                                freeSolo
                                                                onChange={(event, newValue) =>
                                                                    setState({
                                                                        ...state,
                                                                        ciudadDestino: newValue,
                                                                    })
                                                                }
                                                                value={state.ciudadDestino}
                                                                disabled={state.agregar === "Consultar"}
                                                                id="ciudadDestino"
                                                                disableClearable
                                                                forcePopupIcon={false}
                                                                options={dataCiudad}
                                                                getOptionLabel={(option) => option.m_sCiudad}
                                                                variant="outlined"
                                                                style={{transform: "translate(14px, 10px) scale(1) !important"}}
                                                                renderInput={(params) => (
                                                                    <div>
                                                                        <TextField
                                                                            margin="dense"
                                                                            variant="outlined"
                                                                            label={"Destino"}
                                                                            required
                                                                            {...params}
                                                                        />
                                                                    </div>
                                                                )}
                                                            />
                                                        </div>
                                                    </Grid>
                                                    <Grid item xs={4}>
                                                        <FormControl className="input select" fullWidth variant="outlined" margin="dense" required>
                                                            <InputLabel id="idMonedaLabel">Moneda</InputLabel>
                                                            <Select
                                                                fullWidth
                                                                labelId={"idMonedaLabel"}
                                                                label={"Moneda"}
                                                                className="form-control"
                                                                value={state.idTipoMoneda}
                                                                disabled={state.agregar === "Consultar"}
                                                                onChange={handleChange}
                                                                id="idTipoMoneda"
                                                                name="idTipoMoneda"
                                                                InputProps={{name: "moneda"}}
                                                            >
                                                                {dataTipoMoneda.map((moneda) => (
                                                                    <MenuItem
                                                                        key={moneda.m_nIdMoneda}
                                                                        value={moneda.m_nIdMoneda}
                                                                    >
                                                                        {moneda.m_sMoneda}
                                                                    </MenuItem>
                                                                ))}
                                                            </Select>
                                                        </FormControl>
                                                    </Grid>
                                                    <Grid item xs={4}>
                                                        <FormControl className="input select" fullWidth variant="outlined" margin="dense" required>
                                                            <InputLabel id="idTipoPagoLabel">Tipo de pago</InputLabel>
                                                            <Select
                                                                fullWidth
                                                                labelId={"idTipoPagoLabel"}
                                                                label={"Tipo Pago"}
                                                                className="form-control"
                                                                value={state.idTipoPago}
                                                                disabled={state.agregar === "Consultar"}
                                                                onChange={handleChange}
                                                                id="idTipoPago"
                                                                name="idTipoPago"
                                                                InputProps={{name: "idTipoPago"}}
                                                            >
                                                                {dataTipoPago.map((moneda) => (
                                                                    <MenuItem
                                                                        key={moneda.m_nIdTipoPago}
                                                                        value={moneda.m_nIdTipoPago}
                                                                    >
                                                                        {moneda.m_sTipoPago}
                                                                    </MenuItem>
                                                                ))}
                                                            </Select>
                                                        </FormControl>
                                                    </Grid>
                                                    <Grid item xs={10}>
                                                        <div className="widget-header">
                                                            <h2>Guias</h2>
                                                        </div>
                                                    </Grid>
                                                    <Grid item xs={1}>
                                                        <button
                                                            type={"button"}
                                                            disabled={!guiaSelect || consult}
                                                            onClick={handleEliminarGuia}
                                                            className="btn btn-primary primary-btn"
                                                        >
                                                            Eliminar Guia
                                                        </button>
                                                    </Grid>
                                                    <Grid item xs={1}>
                                                        <button
                                                            type={"button"}
                                                            onClick={() => {
                                                                setGuiasSeleccionadas([])
                                                                setShowDialog(true)
                                                            }}
                                                            disabled={consult}
                                                            className="btn btn-primary primary-btn"
                                                        >
                                                            Agregar Guia
                                                        </button>
                                                    </Grid>
                                                </Grid>
                                            </div>
                                            <div className="row" style={{ height: 500}}>
                                                <DataGrid
                                                    localeText={dataGridLocaleText}
                                                    density="compact"
                                                    pageSize={10}
                                                    columns={columnsGuias}
                                                    rows={dataGuias}
                                                    getRowId={(row) => row.m_nIdGuia}
                                                    onRowSelected={(row) => handleGuiaClick(row.data)}
                                                />
                                            </div>
                                            <div className="row">
                                                <Grid container spacing={2}>
                                                    <Grid item xs={12}>
                                                        <h3>Total: {currencyFormatter.format(Number(state.total.toFixed(2)))}</h3>
                                                    </Grid>
                                                    <Grid item xs={12}>
                                                        <button type={"button"} className="btn btn-primary primary-btn" disabled={consult} onClick={handleCerrarCorte}>
                                                            Cerrar corte
                                                        </button>
                                                        <button type={"button"} className="btn btn-primary primary-btn" disabled={consult} onClick={handleGuardarCorte}>
                                                            Guardar sin cerrar
                                                        </button>
                                                    </Grid>

                                                </Grid>
                                            </div>
                                        </div>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    )
}
export default CorteCajaAgregar