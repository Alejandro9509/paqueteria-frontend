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
    const [generalData, setGeneralData] = React.useState({
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
    });

    const handleOrigen = (e) => {
        setGeneralData({
            ...generalData,
            origen: e.target.value
        });
    }
    const handleDestino = (e) => {
        setGeneralData({
            ...generalData,
            destino: e.target.value
        });
    }
    const handleRemolqueUno = (e) => {
        setGeneralData({
            ...generalData,
            cargadoVacioRemolqueUno: e.target.value
        });
    }
    const handleRemolqueDos = (e) => {
        setGeneralData({
            ...generalData,
            cargadoVacioRemolqueDos: e.target.value
        });
    }
    const handleOperador = (e) => {
        setGeneralData({
            ...generalData,
            operador: e.target.value
        });
    }
    const handleUnidad = (e) => {
        setGeneralData({
            ...generalData,
            unidad: e.target.value
        });
    }
    const handlePlacasUnidad = (e) => {
        setGeneralData({
            ...generalData,
            placaIntUnidad: e.target.value
        });
    }
    const handleEstatus = (e) => {
        setGeneralData({
            ...generalData,
            estatusUnidad: e.target.value
        });
    }
    const handleReferencia = (e) => {
        setGeneralData({
            ...generalData,
            referencia: e.target.value
        });
    }
    const handleKilometros = (e) => {
        setGeneralData({
            ...generalData,
            kms: e.target.value
        });
    }
    const handleHoras = (e) => {
        setGeneralData({
            ...generalData,
            horas: e.target.value
        });
    }
    const handleFechaCarga = (e) => {
        setGeneralData({
            ...generalData,
            fechaCarga: e.target.value
        });
    }
    const handleHoraCarga = (e) => {
        setGeneralData({
            ...generalData,
            horaCarga: e.target.value
        });
    }
    const handleFechaEntrega = (e) => {
        setGeneralData({
            ...generalData,
            fechaEntrega: e.target.value
        });
    }
    const handleHoraEntrega = (e) => {
        setGeneralData({
            ...generalData,
            horaEntrega: e.target.value
        });
    }
    const handleHorasEnRuta = (e) => {
        setGeneralData({
            ...generalData,
            horasEnRuta: e.target.value
        });
    }

    function submit(event){
        console.log(generalData);
    }

    const handleChangeTab = (event, newValue) => {
        setTabActive(newValue);
    };
    return (
        <div>
            <AppBar position="static">
                <Tabs
                    value={tabActive}
                    onChange={handleChangeTab}
                    aria-label="simple tabs example">
                    <Tab label="Item One" {...a11yProps(0)} />
                    <Tab label="Item Two" {...a11yProps(1)} />
                </Tabs>
            </AppBar>
            <TabPanel value={tabActive} index={0}>
                <Grid container spacing={2}>
                    <Grid item xs={6}>
                        <TextField
                            margin={"dense"}
                            variant={"outlined"}
                            label={"Origen"}
                            onChange={handleOrigen}
                            value={generalData.origen}/>
                    </Grid>
                    <Grid item xs={6}>
                        <TextField
                            margin={"dense"}
                            variant={"outlined"}
                            label={"Destino"}
                            onChange={handleDestino}
                            value={generalData.destino}/>
                    </Grid>

                    <Grid item xs={3}>
                        <FormControlLabel
                            control={
                                <Checkbox
                                    checked={generalData.cargadoVacioRemolqueUno}
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
                                    checked={generalData.cargadoVacioRemolqueDos}
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
                            onChange={handleOperador}
                            value={generalData.operador}/>
                    </Grid>
                    <Grid item xs={6}/>

                    <Grid item xs={6}>
                        <TextField
                            margin={"dense"}
                            variant={"outlined"}
                            label={"Unidad"}
                            onChange={handleUnidad}
                            value={generalData.unidad}/>
                    </Grid>
                    <Grid item xs={2}>
                        <TextField
                            margin={"dense"}
                            variant={"outlined"}
                            label={"Placa int"}
                            onChange={handlePlacasUnidad}
                            value={generalData.placaIntUnidad}/>
                    </Grid>
                    <Grid item xs={3}>
                        <TextField
                            margin={"dense"}
                            variant={"outlined"}
                            label={"Estatus"}
                            onChange={handleEstatus}
                            value={generalData.estatus}/>
                    </Grid>
                    <Grid item xs={1}/>

                    <Grid item xs={3}>
                        <TextField
                            margin={"dense"}
                            variant={"outlined"}
                            label={"Referencia"}
                            onChange={handleReferencia}
                            value={generalData.referencia}/>
                    </Grid>
                    <Grid item xs={3}>
                        <TextField
                            margin={"dense"}
                            variant={"outlined"}
                            label={"Kilómetros"}
                            onChange={handleKilometros}
                            value={generalData.kms}/>
                    </Grid>
                    <Grid item xs={2}>
                        <TextField
                            margin={"dense"}
                            variant={"outlined"}
                            label={"Horas"}
                            onChange={handleHoras}
                            value={generalData.horas}/>
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
                            InputLabelProps={{shrink: true}}
                            label={"Fecha"}
                            onChange={handleFechaCarga}
                            value={generalData.fechaCarga}/>
                    </Grid>
                    <Grid item xs={2}>
                        <TextField
                            margin={"dense"}
                            variant={"outlined"}
                            type={"time"}
                            InputLabelProps={{shrink: true}}
                            label={"Hora"}
                            onChange={handleHoraCarga}
                            value={generalData.horaCarga}/>
                    </Grid>
                    <Grid item xs={3}>
                        <TextField
                            margin={"dense"}
                            variant={"outlined"}
                            label={"Fecha"}
                            type={"date"}
                            InputLabelProps={{shrink: true}}
                            onChange={handleFechaEntrega}
                            value={generalData.fechaEntrega}/>
                    </Grid>
                    <Grid item xs={2}>
                        <TextField
                            margin={"dense"}
                            variant={"outlined"}
                            label={"Hora"}
                            InputLabelProps={{shrink: true}}
                            type={"time"}
                            onChange={handleHoraEntrega}
                            value={generalData.horaEntrega}/>
                    </Grid>
                    <Grid item xs={2}>
                        <TextField
                            margin={"dense"}
                            variant={"outlined"}
                            label={"Horas en ruta"}
                            onChange={handleHorasEnRuta}
                            value={generalData.horasEnRuta}/>
                    </Grid>
                </Grid>
            </TabPanel>
            <TabPanel value={tabActive} index={1}>
                Item Two
            </TabPanel>
            {props.children}
        </div>
    );
}
