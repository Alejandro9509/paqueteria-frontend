import React, {useState, useEffect} from "react";
import Noty from "noty";
import Cabecera from "../../Components/Template/Cabecera";
import BarraLateralIzquierda from "../../Components/Template/BarraLateralIzquierda";
import {
    Box,
    Button,
    Checkbox,
    FormControl, Grid,
    InputLabel,
    Paper,
    Select,
    Tab,
    Tabs,
    TextField,
    Typography
} from "@material-ui/core";
import {
    obtenerEstatusRecoleccion,
    obtenerEstatusEmbarque,
    obtenerEstatusGuia,
    obtenerEstatusInforme,
    obtenerEstatusViaje
} from "../../Util/Contexts/EstatusContext";
import {obtenerMonedas} from "../../Util/Contexts/MonedaContext";
import {obtenerTipoCambio} from "../../Util/Contexts/TipoCambioContext";
import {
    obtenerParametrosConfiguracion,
    modificarParametrosConfiguracion
} from "../../Util/Contexts/ParametrosConfiguracionContext";
import {makeStyles} from '@material-ui/core/styles';
import {TabContext, TabPanel} from "@material-ui/lab";
import {DataGrid} from "@material-ui/data-grid";
import {dataGridLocaleText} from "../../Constants";
import {obtenerTipoCobro} from "../../Util/Contexts/TipoCobroContext";
//-------------------------------------------STYLES---------------------------------------------------------------------
const useStyles = makeStyles({
    subtitulo: {
        font: "normal normal normal 16px/17px Calibri",
        color: "black",
        letterSpacing: "0.21px",
        padding: "5px",
    },
});

function showSuccess(mensaje) {
    new Noty({
        type: "information",
        layout: "topCenter",
        text: mensaje,
        timeout: "3000",
    }).show();
}

function ParametrosConfiguracion2() {
    const classes = useStyles();

    //--------------------------------------------------VARIABLES--------------------------------------------------------
    const [dataEstatusRecoleccion, setEstatusRecoleccion] = React.useState([]);
    const [dataEstatusEmbarque, setEstatusEmbarque] = React.useState([]);
    const [dataMonedaEmbarque, setMonedaEmbarque] = React.useState([])
    const [dataTipoCambioEmbarque, setTipoCambioEmbarque] = React.useState([])
    const [dataTipoCobro, setTipoCobro] = React.useState([])
    const [dataEstatusGuia, setEstatusGuia] = React.useState([])
    const [datatipoTarifa, setTipoTarifa] = React.useState([])
    const [tabIndex, setTabIndex] = React.useState('1');
    const [selectionModel, setSelectionModel] = React.useState([]);
    const columnasTipoCobro = [
        {
            headerName: "Descripción",
            field: 'm_sDescripcion',
            width: 200,
        }
    ]


    //variables de valores por defecto
    const [configuraciones, setConfiguraciones] = React.useState({
        estatusRecoleccion: 0,
        estatusEmbarque: 0,
        monedaPredeterminadaEmbarque: 0,
        tipoCambioEmbarque: 0,
        estatusGuia: 0,
        tipoTarifa: 0,
        cobroCargaDescarga: false,
        cobrarCita: false,
        costoCita: "0",
        detectarTipoCobro: false,
        tipoCobro:0,
        limpiarProducto: false,
        idsTiposCobroSeleccionArray: [],
        idsTiposCobroSeleccionString: ''
    })
    //--------------------------------------------------HANDLERS---------------------------------------------------------
    const handleChange = (event) => {
        setConfiguraciones((config) => {
            return {
                ...config,
                [event.target.name]: event.target.value
            }
        })
    }
    const handleChecked = (event) => {
        setConfiguraciones((config) => {
            return {
                ...config,
                [event.target.name]: event.target.checked
            }
        });
    };

    function onSubmit() {
        let params = {
            EstatusRecoleccion: configuraciones.estatusRecoleccion,
            EstatusEmbarque: configuraciones.estatusEmbarque,
            MonedaEmbarque: configuraciones.monedaPredeterminadaEmbarque,
            TipoCambioEmbarque: configuraciones.tipoCambioEmbarque,
            EstatusGuia: configuraciones.estatusGuia,
            TipoTarifaTarifas: configuraciones.tipoTarifa,
            CostoCitaTarifas: configuraciones.cobrarCita ? configuraciones.costoCita : 0,
            CobroCargaDescargaTarifa: configuraciones.cobroCargaDescarga,
            CobrarCita: configuraciones.cobrarCita,
            DetectarTipoCobro: configuraciones.detectarTipoCobro,
            LimpiarProducto: configuraciones.limpiarProducto,
            TipoCobro: configuraciones.tipoCobro,
            TiposCobroActivos: configuraciones.idsTiposCobroSeleccionString
        }

        modificarParametrosConfiguracion(params)
            .then((respuesta) => {
                showSuccess(respuesta.data);
                getParametrosConfiguracion()
            })
            .catch((err) => {
                console.log(err);
                showSuccess(err);
            });
    }

    async function getParametrosConfiguracion() {
        obtenerParametrosConfiguracion().then(respuesta => {
            console.log(respuesta)
            setConfiguraciones((config) => {
                return {
                    ...config,
                    estatusRecoleccion: respuesta.data.EstatusRecoleccion,
                    estatusEmbarque: respuesta.data.EstatusEmbarque,
                    monedaPredeterminadaEmbarque: respuesta.data.MonedaEmbarque,
                    tipoCambioEmbarque: respuesta.data.TipoCambioEmbarque,
                    estatusGuia: respuesta.data.EstatusGuia,
                    tipoTarifa: respuesta.data.TipoTarifaTarifas,
                    cobroCargaDescarga: respuesta.data.CobroCargaDescargaTarifa,
                    cobrarCita: respuesta.data.esCobro,
                    costoCita: respuesta.data.CobroCitaTarifas || 0,
                    detectarTipoCobro: respuesta.data.DetectarTipoCobro,
                    limpiarProducto: respuesta.data.LimpiarProducto,
                    tipoCobro: respuesta.data.TipoCobro,
                    idsTiposCobroSeleccionString: respuesta.data.TiposCobroActivos,
                    idsTiposCobroSeleccionArray: respuesta.data.TiposCobroActivos ? respuesta.data.TiposCobroActivos.split(',') : [],
                }
            })
        })
    }

    const handleTab = (event, newValue) => {
        setTabIndex(newValue);
    };

    const handleTiposCobroSeleccionados = (e) => {
        setConfiguraciones((config) => {
            return {
                ...config,
                idsTiposCobroSeleccionArray: e.selectionModel,
                idsTiposCobroSeleccionString: e.selectionModel.join(),
            }
        })
    };

    //--------------------------------------------------SERVICIOS--------------------------------------------------------
    async function getAllEstatusRecoleccion() {
        obtenerEstatusRecoleccion().then((respuesta) => {

            setEstatusRecoleccion(respuesta.data);
        });
    }

    async function getAllEstatusEmbarque() {
        obtenerEstatusEmbarque().then((respuesta) => {
            setEstatusEmbarque(respuesta.data);
        });
    }

    async function getAllEstatusGuia() {
        obtenerEstatusGuia().then((respuesta) => {
            setEstatusGuia(respuesta.data);
        });
    }

    async function getAllTipoMoneda() {
        obtenerMonedas().then((respuesta) => {
            setMonedaEmbarque(respuesta.data);
        });
    }

    async function getTipoCambio() {
        obtenerTipoCambio().then(respuesta => {
            setTipoCambioEmbarque(respuesta.data)
        });
    }

    async function getTipoCobro() {
        obtenerTipoCobro().then(respuesta => {
            setTipoCobro(respuesta.data)
        });
    }




//--------------------------------------------------USE EFFECTS--------------------------------------------------------
    useEffect(value => {
        getParametrosConfiguracion()
        getAllEstatusRecoleccion()
        getAllEstatusEmbarque()
        getAllTipoMoneda()
        getTipoCambio()
        getTipoCobro()
        getAllEstatusGuia()
    }, [])
    return (

        <div>
            <header className="topbar clearfix">
                <Cabecera titulo="Parametros Configuración">
                    <div className="page-header">
                        <ul className="list-page-breadcrumb">
                            <li>
                                <a href="/Catalogos" className="color-mapeo">
                                    Catálogos <i className="zmdi zmdi-chevron-right"/>
                                </a>
                            </li>
                            <li className="active-page">Parametros Configuración</li>
                        </ul>
                    </div>
                </Cabecera>
            </header>
            <aside className="iconic-leftbar">
                <BarraLateralIzquierda/>
            </aside>
            <TabContext value={tabIndex}>
                <Paper square>

                    <Tabs
                        value={tabIndex}
                        indicatorColor="primary"
                        textColor="primary"
                        onChange={handleTab}
                        centered
                    >
                        <Tab label="Embarque" value="1"/>
                        <Tab label="Recoleccion" value="2"/>
                        <Tab label="Guia" value="3"/>
                        <Tab label="Tarifas" value="4"/>
                    </Tabs>

                </Paper>
                <section className="main-container">
                    <div className="container-fluid" >

                            <TabPanel value="1">

                                <Box margin={"0 auto"}>
                                    <Button variant="contained" color="primary" style={{width: "100px"}}
                                            onClick={onSubmit}>
                                        Modificar
                                    </Button>
                                </Box>
                                    <Box display="flex" p={1} my={0.5} bgcolor="background.paper"
                                         flexDirection="column">
                                        <Box width="40%" p={1} my={0.5} display="flex">
                                            <Box width="40%" p={1} my={0.5}>
                                                <div className={classes.subtitulo}>Estatus por defecto</div>
                                            </Box>
                                            <Box width="60%" p={1} my={0.5}>
                                                <FormControl fullWidth variant="outlined" width="25%">
                                                    <InputLabel id="idEmbarqueLabel">Estatus</InputLabel>
                                                    <Select
                                                        labelId="estatusEmbarqueLabel"
                                                        className="form-control"
                                                        required
                                                        onChange={handleChange}
                                                        value={configuraciones.estatusEmbarque}
                                                        label="Estatus"
                                                        id="estatusEmbarque"
                                                        name="estatusEmbarque"
                                                    >
                                                        {dataEstatusEmbarque.map((estatus) => (
                                                            <option key={estatus.m_nIdEstatusEmbarque}
                                                                    value={estatus.m_nIdEstatusEmbarque}
                                                            >
                                                                {estatus.m_sEstatus}
                                                            </option>
                                                        ))}
                                                    </Select>
                                                </FormControl>
                                            </Box>
                                        </Box>
                                        <Box width="40%" p={1} my={0.5} display="flex">
                                            <Box width="40%" p={1} my={0.5}>
                                                <div className={classes.subtitulo}>Modenada predeterminada</div>
                                            </Box>
                                            <Box width="60%" p={1} my={0.5}>
                                                <FormControl fullWidth variant="outlined"
                                                             margin="dense">
                                                    <InputLabel id="idMonedaLabel">Moneda</InputLabel>
                                                    <Select
                                                        labelId={"idMonedaLabel"}
                                                        label={"Moneda"}
                                                        name="monedaPredeterminadaEmbarque"
                                                        className="form-control"
                                                        required
                                                        onChange={handleChange}
                                                        value={configuraciones.monedaPredeterminadaEmbarque}
                                                        id="monedaPredeterminadaEmbarque"
                                                        InputProps={{
                                                            name: "monedaPredeterminadaEmbarque"
                                                        }}
                                                    >
                                                        {dataMonedaEmbarque.map((moneda) => (
                                                            <option
                                                                key={moneda.m_nIdMoneda}
                                                                value={moneda.m_nIdMoneda}
                                                            >
                                                                {moneda.m_sMoneda}
                                                            </option>
                                                        ))}
                                                    </Select>
                                                </FormControl>

                                            </Box>
                                        </Box>
                                        <Box width="40%" p={1} my={0.5} display="flex">
                                            <Box width="40%" p={1} my={0.5}>
                                                <div className={classes.subtitulo}>Tipo de cambio por defecto</div>
                                            </Box>
                                            <Box width="60%" p={1} my={0.5}>

                                                <FormControl fullWidth
                                                             variant="outlined"
                                                             required
                                                             margin="dense">
                                                    <InputLabel id="tipoCambioLabel">Tipo de
                                                        Cambio</InputLabel>
                                                    <Select
                                                        labelId="tipoCambioLabel"
                                                        label="Tipo de Cambio"
                                                        className="form-control"
                                                        name="tipoCambioEmbarque"
                                                        value={configuraciones.tipoCambioEmbarque}
                                                        id="tipoCambioEmbarque"
                                                        onChange={handleChange}
                                                    >
                                                        {dataTipoCambioEmbarque.map((cambio) => (
                                                            <option
                                                                key={cambio.m_nIdTipoCambio}
                                                                value={cambio.m_nIdTipoCambio}
                                                            >
                                                                {cambio.m_cTipoCambio}
                                                            </option>
                                                        ))}
                                                    </Select>
                                                </FormControl>
                                            </Box>
                                        </Box>
                                        <Box width="40%" p={1} my={0.5} display="flex">
                                            <Box width="40%" p={1} my={0.5}>
                                                <div className={classes.subtitulo}>Tipo de cobro por defecto</div>
                                            </Box>
                                            <Box width="60%" p={1} my={0.5}>

                                                <FormControl fullWidth
                                                             variant="outlined"
                                                             required
                                                             margin="dense">
                                                    <InputLabel id="tipoCobroLabel">Tipo de Cobro</InputLabel>
                                                    <Select
                                                        labelId="tipoCambioLabel"
                                                        label="Tipo de Cobro"
                                                        className="form-control"
                                                        name="tipoCobro"
                                                        value={configuraciones.tipoCobro}
                                                        id="tipoCobro"
                                                        onChange={handleChange}
                                                    >
                                                        {dataTipoCobro.filter(item => configuraciones.idsTiposCobroSeleccionArray.find(i => i == item.m_nCodigo)).map((cambio) => (
                                                            <option
                                                                key={cambio.m_nIdTipoCobro}
                                                                value={cambio.m_nIdTipoCobro}
                                                            >
                                                                {cambio.m_sDescripcion}
                                                            </option>
                                                        ))}
                                                    </Select>
                                                </FormControl>
                                            </Box>
                                        </Box>
                                        <Box width="40%" p={1} my={0.5} display="flex">
                                            <Box width="40%" p={1} my={0.5}>
                                                <h2>Detectar tipo de cobro de cliente</h2>
                                            </Box>
                                            <Box width="40%" p={1} my={0.5}>
                                                <Checkbox
                                                    checked={configuraciones.detectarTipoCobro}
                                                    onChange={handleChecked}
                                                    color="primary"
                                                    style={{transform: "scale(2)"}}
                                                    inputProps={{'aria-label': 'primary checkbox'}}
                                                    name="detectarTipoCobro"
                                                />
                                            </Box>
                                        </Box>
                                        <Box width="40%" p={1} my={0.5} display="flex">
                                            <Box width="40%"  p={1} my={0.5}>
                                                <h2>Tipos de cobro a mostrar</h2>
                                            </Box>
                                            <Box width="40%" p={1} my={0.5}>
                                                <div style={{ display: 'flex', height: '100%' }}>
                                                    <DataGrid
                                                        localeText={dataGridLocaleText}
                                                        rows={dataTipoCobro}
                                                        columns={columnasTipoCobro}
                                                        density="compact"
                                                        getRowId={(row) => row.m_nCodigo}
                                                        checkboxSelection
                                                        hideFooter
                                                        autoHeight {...{dataSet:'Commodity', rowLength: 4, maxColumns: 6}}
                                                        onSelectionModelChange={handleTiposCobroSeleccionados}
                                                        selectionModel={configuraciones.idsTiposCobroSeleccionArray}
                                                    />
                                                </div>
                                            </Box>
                                        </Box>
                                        <Box width="40%" p={1} my={0.5} display="flex">
                                            <Box width="40%" p={1} my={0.5}>
                                                <h2>Limpiar producto al crear</h2>
                                            </Box>
                                            <Box width="40%" p={1} my={0.5}>
                                                <Checkbox
                                                    checked={configuraciones.limpiarProducto}
                                                    onChange={handleChecked}
                                                    color="primary"
                                                    style={{transform: "scale(2)"}}
                                                    inputProps={{'aria-label': 'primary checkbox'}}
                                                    name="limpiarProducto"
                                                />
                                            </Box>
                                        </Box>
                                    </Box>


                            </TabPanel>
                            <TabPanel value="2">
                                <Box p={1}>
                                    <Box display="flex" p={1} my={0.5} flexDirection="column">
                                        <h2 className={classes.subtitulo}>Recolección</h2>
                                        <Box width="40%" p={1} my={0.5} display="flex">
                                            <Box width="40%" p={1} my={0.5}>
                                                <div className={classes.subtitulo}>Estatus por defecto</div>
                                            </Box>
                                            <Box width="60%" p={1} my={0.5}>
                                                <FormControl fullWidth variant="outlined" width="25%">
                                                    <InputLabel id="idRecoleccionLabel">Estatus</InputLabel>
                                                    <Select
                                                        labelId="estatusRecoleccionLabel"
                                                        className="form-control"
                                                        required
                                                        value={configuraciones.estatusRecoleccion}
                                                        label="Estatus"
                                                        id="estatusRecoleccion"
                                                        name="estatusRecoleccion"
                                                        onChange={handleChange}
                                                    >
                                                        {dataEstatusRecoleccion.map((estatus) => (
                                                            <option key={estatus.m_nIdEstatusRecoleccion}
                                                                    value={estatus.m_nIdEstatusRecoleccion}
                                                            >
                                                                {estatus.m_sEstatus}
                                                            </option>
                                                        ))}
                                                    </Select>
                                                </FormControl>
                                            </Box>
                                        </Box>
                                    </Box>
                                    <Box margin={"0 auto"}>
                                        <Button variant="contained" color="primary" style={{width: "100px"}}
                                                onClick={onSubmit}>
                                            Modificar
                                        </Button>
                                    </Box>
                                </Box></TabPanel>
                            <TabPanel value="3">
                                <Box p={1}>
                                    <Box display="flex" p={1} my={0.5} bgcolor="background.paper"
                                         flexDirection="column">
                                        <h2 className={classes.subtitulo}>Guias</h2>
                                        <Box width="40%" p={1} my={0.5} display="flex">
                                            <Box width="40%" p={1} my={0.5}>
                                                <div className={classes.subtitulo}>Estatus por defecto</div>
                                            </Box>
                                            <Box width="60%" p={1} my={0.5}>
                                                <FormControl fullWidth variant="outlined" width="25%">
                                                    <InputLabel id="idGuiaLabel">Estatus</InputLabel>
                                                    <Select
                                                        labelId="estatusGuiaLabel"
                                                        className="form-control"
                                                        required
                                                        value={configuraciones.estatusGuia}
                                                        label="Estatus"
                                                        id="estatusGuia"
                                                        name="estatusGuia"
                                                        onChange={handleChange}
                                                    >
                                                        {dataEstatusGuia.map((estatus) => (
                                                            <option key={estatus.m_nIdEstatusGuia}
                                                                    value={estatus.m_nIdEstatusGuia}>
                                                                {estatus.m_sEstatus}
                                                            </option>
                                                        ))}
                                                    </Select>
                                                </FormControl>
                                            </Box>
                                        </Box>
                                    </Box>
                                    <Box margin={"0 auto"}>
                                        <Button variant="contained" color="primary" style={{width: "100px"}}
                                                onClick={onSubmit}>
                                            Modificar
                                        </Button>
                                    </Box>
                                </Box></TabPanel>
                            <TabPanel value="4">
                                <Box p={1}>
                                    <Box display="flex" p={1} my={0.5} bgcolor="background.paper"
                                         flexDirection="column">
                                        <h2 className={classes.subtitulo}>Tarifas</h2>
                                        <Box display="flex" p={1} my={0.5} flexDirection="column">
                                            <Box width="40%" p={1} my={0.5} display="flex">
                                                <Box width="40%" p={1} my={0.5}>
                                                    <div className={classes.subtitulo}>Tipo de tarifa por defecto</div>
                                                </Box>
                                                <Box width="60%" p={1} my={0.5}>
                                                    <FormControl fullWidth variant="outlined"
                                                                 margin="dense" required>
                                                        <InputLabel> Tipo de Tarifa</InputLabel>
                                                        <Select
                                                            native
                                                            label="Tipo de Tarifa"
                                                            className="form-control"
                                                            name="tipoTarifa"
                                                            read="true"
                                                            onChange={handleChange}
                                                            value={configuraciones.tipoTarifa}
                                                        >
                                                            <option value="1">Por peso o volumen</option>
                                                            <option value="2">Por rango</option>
                                                            <option value="3">Por región</option>
                                                        </Select>
                                                    </FormControl>
                                                </Box>
                                            </Box>
                                            <Box width="40%" p={1} my={0.5} display="flex">
                                                <Box width="40%" p={1} my={0.5}>
                                                    <div className={classes.subtitulo}>Cobro de cita</div>
                                                </Box>
                                                <Box width="60%" p={1} my={0.5} display="flex">
                                                    <Checkbox
                                                        checked={configuraciones.cobrarCita}
                                                        onChange={handleChecked}
                                                        color="primary"
                                                        style={{transform: "scale(2)"}}
                                                        inputProps={{'aria-label': 'primary checkbox'}}
                                                        name="cobrarCita"
                                                    />
                                                    <TextField variant="outlined" margin="dense"
                                                               label="Costo($) "
                                                               className="form-control"
                                                               type="text"
                                                               disabled={!configuraciones.cobrarCita}
                                                               onChange={handleChange}
                                                               value={configuraciones.costoCita}
                                                               name="costoCita"
                                                               placeholder="$"
                                                    />


                                                </Box>
                                            </Box>
                                            <Box width="40%" p={1} my={0.5} display="flex">
                                                <Box width="60%" p={1} my={0.5}>
                                                    <div className={classes.subtitulo}>Cobro carga y descarga</div>
                                                </Box>
                                                <Box width="40%" p={1} my={0.5}>
                                                    <Checkbox
                                                        checked={configuraciones.cobroCargaDescarga}
                                                        onChange={handleChecked}
                                                        color="primary"
                                                        style={{transform: "scale(2)"}}
                                                        inputProps={{'aria-label': 'primary checkbox'}}
                                                        name="cobroCargaDescarga"
                                                    />
                                                </Box>
                                            </Box>
                                        </Box>
                                    </Box>
                                </Box>

                                <Box margin={"0 auto"}>
                                    <Button variant="contained" color="primary" style={{width: "100px"}}
                                            onClick={onSubmit}>
                                        Modificar
                                    </Button>
                                </Box>

                            </TabPanel>
                    </div>
                </section>

            </TabContext>
            <section className="main-container">
                <div className="container-fluid" style={{width: "70%"}}>


                </div>
            </section>
        </div>

    );
}

export default ParametrosConfiguracion2;
