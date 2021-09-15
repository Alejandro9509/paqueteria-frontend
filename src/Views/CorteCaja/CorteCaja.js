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
    InputLabel,
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
import {obtenerCiudades} from "../../Util/Contexts/CiudadesContext";
import {obtenerMonedas} from "../../Util/Contexts/MonedaContext";

function CorteCaja(){

    const [dataSucursal, setDataSucursal] = useState([])
    const [dataCiudad, setDataCiudad] = useState([])
    const [dataTipoMoneda, setDataTipoMoneda] = React.useState([]);
    const [dataGuias, setDataGuias] = useState([])
    const [showDialog, setShowDialog] = useState(false)
    const columnsGuias = React.useMemo(() => [
        {
            headerName: "Fecha/Hora Elaboración",
            field: "m_sFechaHora",
            width: 200,
        }, {
            headerName: "Estatus Guia",
            field: "m_sEstatusGuia",
            width: 125,
        }, {
            headerName: "Origen",
            field: "m_sCiudadOrigen",
            width: 125,
        }, {
            headerName: "Destino",
            field: "m_sCiudadDestino",
            width: 125,
        }, {
            headerName: "Folio Guia",
            field: "m_nFolioGuia",
            width: 125,
        },{
            headerName: "Folio Relacionado",
            field: "m_sFolioGuiaRelacionada",
            width: 125,
        },{
            headerName: "Cliente",
            field: "m_sCliente",
            width: 300,
        },{
            headerName: "Folio Informe",
            field: "m_sFolioInforme",
            width: 125,
        },{
            headerName: "Folio Embarque",
            field: "m_sFolioEmbarque",
            width: 150,
        }
    ]);
    const [infoGeneral, setInfoGeneral] = useState({
        idSucursal: localStorage.getItem("Sucursal"),
        fechaRegistro: `${new Date().getFullYear()}-${`${new Date().getMonth() + 1}`.padStart(2, 0)}-${`${new Date().getDate() + 1}`.padStart(2, 0)}`,
        horaRegistro: `${`${new Date().getHours()}`.padStart(2, 0)}:${`${new Date().getMinutes()}`.padStart(2, 0)}`,

    })
    const [state, setState] = useState({
        ciudadDestino: null,
        idTipoMoneda: null,
        idTipoPago: null
    })

    useEffect(value =>{
        getAllSucursales()
        getAllCiudades()
        getAllTipoMoneda()
    }, [])

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
                    <div style={{ display: 'flex', height: '800px' }}>
                        <DataGrid
                            localeText={dataGridLocaleText}
                            rows={dataGuias}
                            columns={columnsGuias}
                            density="compact"
                            pageSize={10}
                            getRowId={(row) => row.m_nIdGuia}
                            checkboxSelection
                            // onSelectionModelChange={(e) => handleGuiasSeleccionadas(e)}
                        />
                    </div>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCloseDialog} color="primary">
                        Cerrar
                    </Button>
                    <Button onClick={handleCloseDialog} color="primary" autoFocus>
                        Aceptar
                    </Button>
                </DialogActions>
            </Dialog>
            <header className="topbar clearfix">
                <Cabecera titulo="Corte de caja" >
                    <div className="page-header">
                        <ul className="list-page-breadcrumb">
                            <li className="active-page">Corte de caja</li>
                        </ul>
                    </div>
                </Cabecera>
            </header>
            {/*Leftbar Start Here*/}
            <aside className="iconic-leftbar">
                <BarraLateralIzquierda />
            </aside>
            {/*Leftbar End Here*/}
            <section className={"main-container"}>
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
                                                    id="fechaCita"
                                                    label="Fecha de la cita"
                                                    type="date"
                                                    // onChange={handleFechaCita}
                                                    value={infoGeneral.fechaRegistro}
                                                    className={"form-control"}
                                                    disabled
                                                    InputLabelProps={{shrink: true,}}
                                                    // required={state.recoleccionConCita}
                                                />
                                            </div>
                                        </Grid>
                                        <Grid item xs={4}>
                                            <div className="input">
                                                <TextField
                                                    variant="outlined"
                                                    id="horaMinima"
                                                    label="Hora mínima"
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
                                                    <FormControl className="input select" fullWidth variant="outlined" margin="dense">
                                                        <InputLabel id="idMonedaLabel">Moneda</InputLabel>
                                                        <Select
                                                            fullWidth
                                                            labelId={"idMonedaLabel"}
                                                            label={"Moneda"}
                                                            className="form-control"
                                                            required
                                                            value={state.moneda}
                                                            disabled={state.agregar === "Consultar"}
                                                            onChange={handleChange}
                                                            id="moneda"
                                                            name="moneda"
                                                            InputProps={{name: "moneda"}}
                                                        >
                                                            {dataTipoMoneda.map((moneda) => (
                                                                <option
                                                                    key={moneda.m_nIdMoneda}
                                                                    value={moneda.m_nIdMoneda}
                                                                >
                                                                    {moneda.m_sMoneda}
                                                                </option>
                                                            ))}
                                                        </Select>
                                                    </FormControl>
                                                </Grid>
                                                <Grid item xs={4}>

                                                </Grid>
                                            </Grid>
                                            <Grid container>
                                                <Grid item xs={10}>
                                                    <div className="widget-header">
                                                        <h2>Guias</h2>
                                                    </div>
                                                </Grid>
                                                <Grid item xs={1}>
                                                    <button
                                                        onClick={() => setShowDialog(true)}
                                                        className="btn btn-secundary primary-btn"
                                                    >
                                                        Eliminar Guia
                                                    </button>
                                                </Grid>
                                                <Grid item xs={1}>
                                                    <button
                                                        onClick={() => setShowDialog(true)}
                                                        className="btn btn-primary primary-btn"
                                                    >
                                                        Agregar Guia
                                                    </button>
                                                </Grid>
                                            </Grid>
                                        </div>
                                        <div className="row" style={{ height: 200}}>
                                            {/*<DataGrid
                                                localeText={dataGridLocaleText}
                                                density="compact"
                                                pageSize={10}
                                                columns={columnsPaquetes}
                                                rows={state.paquetes}
                                                getRowId={(row) => row.m_nIdEmbarqueDetalle}
                                                onRowSelected={(row) => handlePaqueteClick(row.data)}/>*/}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    )
}
export default CorteCaja