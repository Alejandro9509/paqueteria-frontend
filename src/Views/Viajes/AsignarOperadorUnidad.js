import React from 'react';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import Typography from '@material-ui/core/Typography';
import Box from '@material-ui/core/Box';
import {Checkbox, FormControlLabel, Grid, TextField} from "@material-ui/core";

function TabPanel(props) {
    const { children, value, index, ...other } = props;

    return (
        <div
            role="tabpanel"
            hidden={value !== index}
            id={`simple-tabpanel-${index}`}
            aria-labelledby={`simple-tab-${index}`}
            {...other}>
            {value === index && (
                <Box p={3}>
                    <Typography>{children}</Typography>
                </Box>
            )}
        </div>
    );
}

TabPanel.propTypes = {
    children: PropTypes.node,
    index: PropTypes.any.isRequired,
    value: PropTypes.any.isRequired,
};

function a11yProps(index) {
    return {
        id: `simple-tab-${index}`,
        'aria-controls': `simple-tabpanel-${index}`,
    };
}


export default function AsignarOperadorUnidad(props){
    const [tabActive, setTabActive] = React.useState(0);
    /*const [generalData, setGeneralData] = React.useState({
        origen: "",
        destino: "",
        cargadoVacioRemolqueUno: false,
        cargadoVacioRemolqueDos: false,
        operador: "",
        unidad: "",
        placaIntUnidad: "",
        estatusUnidad: "",
        referencia: "",
        kms: "",
        horas: "",
        fechaCarga: "",
        horaCarga: "",
        fechaEntrega: "",
        horaEntrega: "",
        horasEnRuta: "",
    });*/
    const [data, setData] = React.useState({
        origen: "",
        destino: "",
        cargadoVacioRemolqueUno: false,
        cargadoVacioRemolqueDos: false,
        operador: "",
        unidad: "",
        placaIntUnidad: "",
        estatusUnidad: "",
        referencia: "",
        kms: "",
        horas: "",
        fechaCarga: "",
        horaCarga: "",
        fechaEntregaGeneral: "",
        horaEntregaGeneral: "",
        horasEnRuta: "",

        fechaInforme: "",
        horaInforme: "",
        folioInforme: "",
        remolqueInforme: "",
        totalInforme: "",
        fechaEntregaInforme: "",
        horaEntregaInforme: "",
        entregado: false,
        estatusInforme: "",
    });
    /*const [informeData, setInformeData] = React.useState({
        fechaInforme: "",
        horaInforme: "",
        folioInforme: "",
        remolque: "",
        total: "",
        fechaEntrega: "",
        horaEntrega: "",
        entregado: false,
        estatus: "",
    });*/

    const handleFechaInforme = (e) => {
        setData({
            ...data,
            fechaInforme: e.target.value
        });
    }
    const handleHoraInforme = (e) => {
        setData({
            ...data,
            horaInforme: e.target.value
            });
    }
    const handleFolioInforme = (e) => {
        setData({
            ...data,
            folioInforme: e.target.value
        });
    }
    const handleRemolqueInforme = (e) => {
        setData({
            ...data,
            remolqueInforme: e.target.value
        });
    }
    const handleTotoalInforme = (e) => {
        setData({
            ...data,
            totalInforme: e.target.value
        });
    }
    const handleFechaEntregaInforme = (e) => {
        setData({
            ...data,
            fechaEntregaInforme: e.target.value
        });
    }
    const handleHoraEntregaInforme = (e) => {
        setData({
            ...data,
            horaEntregaInforme: e.target.value
        });
    }
    const handleEntregado = (e) => {
        setData({
            ...data,
            entregado: e.target.value
        });
    }
    const handleEstatusInforme = (e) => {
        setData({
            ...data,
            estatusInforme: e.target.value
        });
    }

    const handleOrigen = (e) => {
        setData({
            ...data,
            origen: e.target.value
        });
    }
    const handleDestino = (e) => {
        setData({
            ...data,
            destino: e.target.value
        });
    }
    const handleRemolqueUno = (e) => {
        setData({
            ...data,
            cargadoVacioRemolqueUno: e.target.value
        });
    }
    const handleRemolqueDos = (e) => {
        setData({
            ...data,
            cargadoVacioRemolqueDos: e.target.value
        });
    }
    const handleOperador = (e) => {
        setData({
            ...data,
            operador: e.target.value
        });
    }
    const handleUnidad = (e) => {
        setData({
            ...data,
            unidad: e.target.value
        });
    }
    const handlePlacasUnidad = (e) => {
        setData({
            ...data,
            placaIntUnidad: e.target.value
        });
    }
    const handleEstatus = (e) => {
        setData({
            ...data,
            estatusUnidad: e.target.value
        });
    }
    const handleReferencia = (e) => {
        setData({
            ...data,
            referencia: e.target.value
        });
    }
    const handleKilometros = (e) => {
        setData({
            ...data,
            kms: e.target.value
        });
    }
    const handleHoras = (e) => {
        setData({
            ...data,
            horas: e.target.value
        });
    }
    const handleFechaCarga = (e) => {
        setData({
            ...data,
            fechaCarga: e.target.value
        });
    }
    const handleHoraCarga = (e) => {
        setData({
            ...data,
            horaCarga: e.target.value
        });
    }
    const handleFechaEntrega = (e) => {
        setData({
            ...data,
            fechaEntrega: e.target.value
        });
    }
    const handleHoraEntrega = (e) => {
        setData({
            ...data,
            horaEntrega: e.target.value
        });
    }
    const handleHorasEnRuta = (e) => {
        setData({
            ...data,
            horasEnRuta: e.target.value
        });
    }

    function submit(event){
        event.preventDefault();
        props.onSubmit(data);
    }

    const handleChangeTab = (event, newValue) => {
        setTabActive(newValue);
    };
    return (
        <div>
            <Tabs
                value={tabActive}
                onChange={handleChangeTab}
                aria-label="simple tabs example">
                <Tab label="General" {...a11yProps(0)} />
                <Tab label="Informes" {...a11yProps(1)} />
            </Tabs>
            <form onSubmit={submit}>
                <TabPanel value={tabActive} index={0}>
                    <Grid container spacing={2}>
                        <Grid item xs={6}>
                            <TextField
                                margin={"dense"}
                                variant={"outlined"}
                                label={"Origen"}
                                required
                                onChange={handleOrigen}
                                value={data.origen}/>
                        </Grid>
                        <Grid item xs={6}>
                            <TextField
                                margin={"dense"}
                                variant={"outlined"}
                                label={"Destino"}
                                required
                                onChange={handleDestino}
                                value={data.destino}/>
                        </Grid>

                        <Grid item xs={3}>
                            <FormControlLabel
                                control={
                                    <Checkbox
                                        checked={data.cargadoVacioRemolqueUno}
                                        onChange={handleRemolqueUno}
                                        name="cargadoVacíoRemolqueUno"/>
                                }
                                label={"Cargado/Vacío Remolque 1"}
                            />
                        </Grid>
                        <Grid item xs={3}>
                            <FormControlLabel
                                control={
                                    <Checkbox
                                        checked={data.cargadoVacioRemolqueDos}
                                        onChange={handleRemolqueDos}
                                        name="cargadoVacíoRemolqueDos"/>
                                }
                                label={"Cargado/Vacío Remolque 2"}
                            />
                        </Grid>
                        <Grid item xs={6}/>

                        <Grid item xs={6}>
                            <TextField
                                margin={"dense"}
                                variant={"outlined"}
                                label={"Operador"}
                                required
                                onChange={handleOperador}
                                value={data.operador}/>
                        </Grid>
                        <Grid item xs={6}/>

                        <Grid item xs={6}>
                            <TextField
                                margin={"dense"}
                                variant={"outlined"}
                                label={"Unidad"}
                                required
                                onChange={handleUnidad}
                                value={data.unidad}/>
                        </Grid>
                        <Grid item xs={2}>
                            <TextField
                                margin={"dense"}
                                variant={"outlined"}
                                label={"Placa int"}
                                required
                                onChange={handlePlacasUnidad}
                                value={data.placaIntUnidad}/>
                        </Grid>
                        <Grid item xs={3}>
                            <TextField
                                margin={"dense"}
                                variant={"outlined"}
                                label={"Estatus"}
                                required
                                onChange={handleEstatus}
                                value={data.estatusUnidad}/>
                        </Grid>
                        <Grid item xs={1}/>

                        <Grid item xs={3}>
                            <TextField
                                margin={"dense"}
                                variant={"outlined"}
                                label={"Referencia"}
                                required
                                onChange={handleReferencia}
                                value={data.referencia}/>
                        </Grid>
                        <Grid item xs={3}>
                            <TextField
                                margin={"dense"}
                                variant={"outlined"}
                                label={"Kilómetros"}
                                required
                                onChange={handleKilometros}
                                value={data.kms}/>
                        </Grid>
                        <Grid item xs={2}>
                            <TextField
                                margin={"dense"}
                                variant={"outlined"}
                                label={"Horas"}
                                required
                                onChange={handleHoras}
                                value={data.horas}/>
                        </Grid>
                        <Grid item xs={4}/>

                        <Grid item xs={4}>
                            <h4>Detalles de la Carga</h4>
                        </Grid>
                        <Grid item xs={4}>
                            <h4>Detalles de la Entrega</h4>
                        </Grid>
                        <Grid item xs={4}/>

                        <Grid item xs={3}>
                            <TextField
                                margin={"dense"}
                                type={"date"}
                                variant={"outlined"}
                                required
                                InputLabelProps={{shrink: true}}
                                label={"Fecha"}
                                onChange={handleFechaCarga}
                                value={data.fechaCarga}/>
                        </Grid>
                        <Grid item xs={2}>
                            <TextField
                                margin={"dense"}
                                variant={"outlined"}
                                type={"time"}
                                InputLabelProps={{shrink: true}}
                                label={"Hora"}
                                required
                                onChange={handleHoraCarga}
                                value={data.horaCarga}/>
                        </Grid>
                        <Grid item xs={3}>
                            <TextField
                                margin={"dense"}
                                variant={"outlined"}
                                label={"Fecha"}
                                type={"date"}
                                required
                                InputLabelProps={{shrink: true}}
                                onChange={handleFechaEntrega}
                                value={data.fechaEntregaGeneral}/>
                        </Grid>
                        <Grid item xs={2}>
                            <TextField
                                margin={"dense"}
                                variant={"outlined"}
                                label={"Hora"}
                                InputLabelProps={{shrink: true}}
                                type={"time"}
                                required
                                onChange={handleHoraEntrega}
                                value={data.horaEntregaGeneral}/>
                        </Grid>
                        <Grid item xs={2}>
                            <TextField
                                margin={"dense"}
                                variant={"outlined"}
                                label={"Horas en ruta"}
                                required
                                onChange={handleHorasEnRuta}
                                value={data.horasEnRuta}/>
                        </Grid>
                    </Grid>
                </TabPanel>
                <TabPanel value={tabActive} index={1}>
                    <Grid container spacing={2}>
                        <Grid item xs={3}>
                            <TextField
                                margin={"dense"}
                                type={"date"}
                                required
                                variant={"outlined"}
                                InputLabelProps={{shrink: true}}
                                label={"Fecha"}
                                onChange={handleFechaInforme}
                                value={data.fechaInforme}/>
                        </Grid>
                        <Grid item xs={2}>
                            <TextField
                                margin={"dense"}
                                variant={"outlined"}
                                type={"time"}
                                required
                                InputLabelProps={{shrink: true}}
                                label={"Hora"}
                                onChange={handleHoraInforme}
                                value={data.horaInforme}/>
                        </Grid>
                        <Grid item xs={2}>
                            <TextField
                                margin={"dense"}
                                variant={"outlined"}
                                label={"Folio informe"}
                                required
                                onChange={handleFolioInforme}
                                value={data.folioInforme}/>
                        </Grid>
                        <Grid item xs={3}>
                            <TextField
                                margin={"dense"}
                                variant={"outlined"}
                                label={"Remolque"}
                                required
                                onChange={handleRemolqueInforme}
                                value={data.remolqueInforme}/>
                        </Grid>
                        <Grid item xs={2}>
                            <TextField
                                margin={"dense"}
                                variant={"outlined"}
                                label={"Total"}
                                required
                                onChange={handleTotoalInforme}
                                value={data.totalInforme}/>
                        </Grid>

                        <Grid item xs={12}>
                            <h4>Detalle de entrega</h4>
                        </Grid>

                        <Grid item xs={3}>
                            <TextField
                                margin={"dense"}
                                type={"date"}
                                variant={"outlined"}
                                InputLabelProps={{shrink: true}}
                                label={"Fecha"}
                                required
                                onChange={handleFechaEntregaInforme}
                                value={data.fechaEntregaInforme}/>
                        </Grid>
                        <Grid item xs={2}>
                            <TextField
                                margin={"dense"}
                                variant={"outlined"}
                                type={"time"}
                                InputLabelProps={{shrink: true}}
                                label={"Hora"}
                                required
                                onChange={handleHoraEntregaInforme}
                                value={data.horaEntregaInforme}/>
                        </Grid>
                        <Grid item xs={2}>
                            <FormControlLabel
                                control={
                                    <Checkbox
                                        checked={data.entregado}
                                        onChange={handleEntregado}
                                        name="entregado"/>
                                }
                                label={"Entregado"}
                            />
                        </Grid>
                        <Grid item xs={3}>
                            <TextField
                                margin={"dense"}
                                variant={"outlined"}
                                label={"Estatus"}
                                required
                                onChange={handleEstatusInforme}
                                value={data.estatusInforme}/>
                        </Grid>
                        <Grid item xs={2}/>
                    </Grid>
                </TabPanel>
                {props.children}
            </form>
        </div>
    );
}
