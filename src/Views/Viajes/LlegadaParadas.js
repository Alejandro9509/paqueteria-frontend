import React from 'react';
import {MenuItem, TextField} from "@mui/material";
import { styled } from '@mui/material/styles';
import InputAdornment from '@mui/material/InputAdornment';
import Grid from '@mui/material/Grid';
import {getCurrentDate, getCurrentTime} from "../../Util/Util";


const PREFIX = 'LlegadaParadas';

const classes = {
    root: `${PREFIX}-root`
};

const Root = styled('form')(() => ({

    [`& .${classes.root}`]: {
        flexGrow: 1,
    }
}));

export default function LlegadaParadas(props){

    const [data, setData] = React.useState({
        sucursal: props.viaje.m_sSucursal,
        viaje: props.viaje.m_sFolioViaje,
        documento: "",
        numViajeCliente: props.viaje.m_sNumViajeCliente,
        fecha: props.viaje.m_dFechaRegistro,
        hora: props.viaje.m_tHoraRegistro,
        cliente: "",
        ruta: props.parada.m_sRuta,
        origen: props.viaje.m_sOringen,
        tipoDeCambioOrigen: "",
        destino: props.viaje.m_sDestino,
        millas: "",
        operador: props.viaje.m_sOperador,
        liquidacion: "",
        unidad: props.viaje.m_sUnidad,
        idEstatusUnidad: props.viaje.m_sEstatusUnidad,
        remolqueUno: props.viaje.m_sRemolque1,
        kmsRemolqueUno: "",
        millasRemolqueUno: "",
        placasRemolqueUno: props.viaje.m_sPlacasRemolque1,
        placasRemolqueDos: props.viaje.m_sPlacasRemolque2,
        idEstatusRemolqueUno: 0,
        nameEstatusRemolqueUno: "",
        remolqueDos: props.viaje.m_sRemolque2,
        kmsRemolqueDos: "",
        millasRemolqueDos: "",
        dolly: props.viaje.m_sDolly,
        fechaSalida: props.parada.m_dFechaSalida,
        horaSalida: props.parada.m_tHoraSalida,
        fechaLlegada: props.parada.m_dFechaLlegada || getCurrentDate(),
        horaLlegada: props.parada.m_tHoraLlegada || getCurrentTime(),
        idEstatus: 0,
        motivoRetraso: "",
        pesoLiquidar: "",
        pesoDescarga: "",
    });
    const estatusUnidadListado = [
        {
            id: 0,
            name: "Disponible"
        },
        {
            id: 1,
            name: "No disponible"
        },
        {
            id:2,
            name:"OCUPADA"
        }
    ]
    const estatusListado = [
        {
            id: 0,
            name: "Documentada",
        },
        {
            id: 1,
            name: "No documentada",
        }
    ]



    const handleLiquidacion = (e) => {
        setData({
            ...data,
            liquidacion: e.target.value
        });
    }

    const handleEstatusUnidad = (e) => {
        setData({
            ...data,
            idEstatusUnidad: e.target.value
        });
    }


    const handleChangeFechaSalida = (e) => {
        setData({
            ...data,
            fechaSalida: e.target.value
        });
    }

    const handleChangeHoraSalida = (e) => {
        setData({
            ...data,
            horaSalida: e.target.value
        });
    }

    const handleChangeFechaLlegada = (e) => {
        setData({
            ...data,
            fechaLlegada: e.target.value
        });
    }

    const handleChangeHoraLlegada = (e) => {
        setData({
            ...data,
            horaLlegada: e.target.value
        });
    }

    const handleChangeEstatus = (e) => {
        setData({
            ...data,
            idEstatus: e.target.value
        });
    }

    const handleChangeMotivoRetraso = (e) => {
        setData({
            ...data,
            motivoRetraso: e.target.value
        });
    }

    const handlePesoDescarga = (e) => {
        setData({
            ...data,
            pesoDescarga: e.target.value
        });
    }

    function onSubmit(event){
        event.preventDefault();
        props.onSubmit(data);
    }

    return (
        <Root onSubmit={onSubmit}>
            {/*<div className={classes.root}></div>*/}
            <ul style={{
                width: "100%",
                display: "flex",
                flexWrap: "wrap",
                listStyle: "none",
                padding: "5px",
                marginTop: "5px"
            }}>
                <Grid container spacing={2}>
                    <Grid item xs={2}>
                        <TextField
                            id={"sucursal"}
                            margin={"dense"}
                            disabled
                            label={"Sucursal"}
                            variant={"outlined"}
                            InputProps={{readOnly: true}}
                            InputLabelProps={{shrink: true,}}
                            value={data.sucursal}
                        />
                    </Grid>
                    <Grid item xs={2}>
                        <TextField
                            id={"viaje"}
                            margin={"dense"}
                            label={"Viaje"}
                            InputProps={{readOnly: true}}
                            InputLabelProps={{shrink: true,}}
                            disabled
                            variant={"outlined"}
                            value={data.viaje}/>
                    </Grid>
                    <Grid item xs={2}>
                        <TextField
                            id={"documento"}
                            margin={"dense"}
                            label={"Documento"}
                            InputProps={{readOnly: true}}
                            InputLabelProps={{shrink: true,}}
                            disabled
                            variant={"outlined"}
                            value={data.documento}/>
                    </Grid>
                    <Grid item xs={2}>
                        <TextField
                            id={"numViajeCliente"}
                            margin={"dense"}
                            label={"Núm. Viaje cliente"}
                            InputProps={{readOnly: true}}
                            InputLabelProps={{shrink: true,}}
                            disabled
                            variant={"outlined"}
                            value={data.numViajeCliente}/>
                    </Grid>
                    <Grid item xs={2}>
                        <TextField
                            id={"fecha"}
                            margin={"dense"}
                            label={"Fecha"}
                            InputProps={{readOnly: true}}
                            InputLabelProps={{shrink: true,}}
                            disabled
                            variant={"outlined"}
                            value={data.fecha}/>
                    </Grid>
                    <Grid item xs={2}>
                        <TextField
                            id={"hora"}
                            margin={"dense"}
                            label={"Hora"}
                            InputProps={{readOnly: true}}
                            InputLabelProps={{shrink: true,}}
                            disabled
                            variant={"outlined"}
                            value={data.hora}/>
                    </Grid>

                    <Grid item xs={5}>
                        <TextField
                            id={"origen"}
                            margin={"dense"}
                            label={"Origen"}
                            InputProps={{readOnly: true}}
                            disabled
                            variant={"outlined"}
                            value={data.origen}/>
                    </Grid>
                    <Grid item xs={5}/>

                    <Grid item xs={5}>
                        <TextField
                            id={"destino"}
                            margin={"dense"}
                            label={"Destino"}
                            InputProps={{readOnly: true}}
                            disabled
                            variant={"outlined"}
                            value={data.destino}/>
                    </Grid>
                    <Grid item xs={7}/>

                    <Grid item xs={5}>
                        <TextField
                            id={"operador"}
                            margin={"dense"}
                            label={"Operador"}
                            InputProps={{readOnly: true}}
                            disabled
                            variant={"outlined"}
                            value={data.operador}/>
                    </Grid>
                    <Grid item xs={2}>
                        <TextField
                            id={"liquidacion"}
                            margin={"dense"}
                            label={"Liquidación"}
                            InputProps={{
                                endAdornment: <InputAdornment position="end">%</InputAdornment>,
                            }}
                            variant={"outlined"}
                            value={data.liquidacion}
                            onChange={handleLiquidacion}
                        />
                    </Grid>
                    <Grid item xs={5}/>

                    <Grid item xs={5}>
                        <TextField
                            id={"unidad"}
                            margin={"dense"}
                            label={"Unidad"}
                            InputProps={{readOnly: true}}
                            disabled
                            variant={"outlined"}
                            value={data.unidad}/>
                    </Grid>
                    <Grid item xs={2}>
                        <TextField
                            id={"estatus"}
                            margin={"dense"}
                            label={"Estatus"}
                            InputProps={{readOnly: true}}
                            select
                            variant={"outlined"}
                            value={data.idEstatusUnidad}
                            disabled
                            onChange={handleEstatusUnidad}
                        >
                            {estatusUnidadListado.map((estatus) => (
                                <MenuItem key={estatus.id} value={estatus.id}>{estatus.name}</MenuItem>
                            ))}
                        </TextField>
                    </Grid>
                    <Grid item xs={5}/>

                    <Grid item xs={5}>
                        <TextField
                            id={"remolqueUno"}
                            InputProps={{readOnly: true}}
                            margin={"dense"}
                            disabled
                            label={"Remolque 1"}
                            variant={"outlined"}
                            value={data.remolqueUno}
                        />
                    </Grid>
                    <Grid item xs={2}>
                        <TextField
                            id="placasRemolqueUno"
                            disabled
                            label={"Placas"}
                            InputProps={{readOnly: true}}
                            margin={"dense"}
                            value={data.placasRemolqueUno}
                            variant="outlined"
                        />
                    </Grid>
                    <Grid item xs={1}/>

                    <Grid item xs={5}>
                        <TextField
                            id={"remolqueDos"}
                            InputProps={{readOnly: true}}
                            margin={"dense"}
                            disabled
                            label={"Remolque 2"}
                            variant={"outlined"}
                            value={data.remolqueDos}
                        />
                    </Grid>

                    <Grid item xs={2}>
                        <TextField
                            id="placasRemolqueDos"
                            disabled
                            InputProps={{readOnly: true}}
                            margin={"dense"}
                            label={"Placas"}
                            value={data.placasRemolqueDos}
                            variant="outlined"
                        />
                    </Grid>
                    <Grid item xs={1}/>

                    <Grid item xs={5}>
                        <TextField
                            id={"dolly"}
                            margin={"dense"}
                            label={"Dolly"}
                            InputProps={{readOnly: true}}
                            disabled
                            variant={"outlined"}
                            value={data.dolly}/>
                    </Grid>
                    <Grid item xs={2}>
                        <TextField
                            id={"kilometros"}
                            margin={"dense"}
                            label={"Kilometros"}
                            onChange={(e) => props.handleChangeKms(e)}

                            variant={"outlined"}
                            value={props.distancia}/>
                    </Grid>
                    <Grid item xs={7}/>
                    <Grid item xs={5}/>

                    <Grid item xs={2}>
                        <TextField
                            id={"fechaSalida"}
                            type={"date"}
                            margin={"dense"}
                            label={"Fecha Salida"}
                            variant={"outlined"}
                            InputLabelProps={{shrink: true,}}
                            value={data.fechaSalida}
                            onChange={handleChangeFechaSalida}
                            disabled
                        />
                    </Grid>
                    <Grid item xs={2}>
                        <TextField
                            id={"horaSalida"}
                            InputLabelProps={{shrink: true,}}
                            margin={"dense"}
                            type={"time"}
                            label={"Hora"}
                            variant={"outlined"}
                            value={data.horaSalida}
                            disabled
                            onChange={handleChangeHoraSalida}
                        />
                    </Grid>
                    <Grid item xs={8}/>

                    <Grid item xs={2}>
                        <TextField
                            id={"fechaLlegada"}
                            type={"date"}
                            margin={"dense"}
                            label={"Fecha Llegada"}
                            variant={"outlined"}
                            InputLabelProps={{shrink: true,}}
                            value={data.fechaLlegada}
                            InputProps={{inputProps: {min: data.fechaSalida}}}
                            onChange={handleChangeFechaLlegada}
                        />
                    </Grid>
                    <Grid item xs={2}>
                        <TextField
                            id={"horaLlegada"}
                            InputLabelProps={{shrink: true,}}
                            type={"time"}
                            margin={"dense"}
                            label={"Hora"}
                            variant={"outlined"}
                            value={data.horaLlegada}
                            onChange={handleChangeHoraLlegada}
                        />
                    </Grid>
                    <Grid item xs={8}/>

                    <Grid item xs={4}>
                        <TextField
                            id={"estatus"}
                            margin={"dense"}
                            select
                            label={"Estatus"}
                            variant={"outlined"}
                            value={data.idEstatus}
                            onChange={handleChangeEstatus}
                        >
                            {estatusListado.map((estatus) => (
                                <MenuItem key={estatus.id} value={estatus.id}>{estatus.name}</MenuItem>
                            ))}
                        </TextField>
                    </Grid>
                    <Grid item xs={5}>
                        <TextField
                            id={"motivoRetraso"}
                            margin={"dense"}
                            label={"Motivo de retraso"}
                            variant={"outlined"}
                            value={data.motivoRetraso}
                            onChange={handleChangeMotivoRetraso}
                        />
                    </Grid>
                    <Grid item xs={3}/>

                </Grid>
            </ul>
            {
                props.children
            }
        </Root>
    );
}