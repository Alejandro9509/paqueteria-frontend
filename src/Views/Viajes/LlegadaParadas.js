import React from 'react';
import {FormControl, MenuItem, OutlinedInput, TextField} from "@material-ui/core";
import { makeStyles } from '@material-ui/core/styles';
import InputAdornment from '@material-ui/core/InputAdornment';
import clsx from 'clsx';
import Grid from '@material-ui/core/Grid';
import {getCurrentDate, getCurrentTime} from "../../Util/Util";

const useStyles = makeStyles(() => ({
    /*root: {
        '& .MuiTextField-root': {
            width: 200,
            marginLeft: 10
        },
        '& .MuiFormControl-marginDense': {
            margin: '10px !important',
        },
        margin: {
        },
        withoutLabel: {
        },
        textField: {
            width: '25ch',
        },
    },*/
    root: {
        flexGrow: 1,
    },

}));

export default function LlegadaParadas(props){
    const classes = useStyles();

    const [data, setData] = React.useState({
        sucursal: props.data.m_sSucursalEmisora,
        viaje: props.data.m_sFolioViaje,
        documento: "",
        numViajeCliente: props.viaje.m_sNumViajeCliente,
        fecha: props.data.m_dFecha,
        hora: props.data.m_tHora,
        cliente: "",
        ruta: props.data.m_sRuta,
        origen: props.viaje.m_sOringen,
        tipoDeCambioOrigen: "",
        destino: props.viaje.m_sDestino,
        kms: "",
        millas: "",
        operador: props.data.m_sNombreCompleto,
        liquidacion: "",
        unidad: props.data.m_sUnidad,
        idEstatusUnidad: 0,
        remolqueUno: props.data.m_sRemolque1,
        kmsRemolqueUno: "",
        millasRemolqueUno: "",
        placasRemolqueUno: props.data.m_sPlacasRemolque1,
        placasRemolqueDos: props.data.m_sPlacasRemolque2,
        idEstatusRemolqueUno: 0,
        nameEstatusRemolqueUno: "",
        remolqueDos: props.data.m_sRemolque2,
        kmsRemolqueDos: "",
        millasRemolqueDos: "",
        dolly: props.data.m_sDolly,
        fechaSalida: props.parada.m_dFechaSalida,
        horaSalida: props.parada.m_tHoraSalida.substr(0,5),
        fechaLlegada: props.data.m_dFechaLlegada,
        horaLlegada: props.data.m_tHoraLlegada,
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

    const handleTipoDeCambio = (e) => {
        setData({
            ...data,
            tipoDeCambioOrigen: e.target.value
        });
    }

    const handleChangeKms = (e) => {
        setData({
            ...data,
            kms: e.target.value
        });
    }

    const handleChangeMillas = (e) => {
        setData({
            ...data,
            millas: e.target.value
        });
    }

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

    const handleChangeKmsRemolqueUno = (event) => {
        setData({
            ...data,
            kmsRemolqueUno: event.target.value});
    }

    const handleChangeMillasRemolqueUno = (e) => {
        setData({
            ...data,
            millasRemolqueUno: e.target.value
        });
    }

    const handleChangeKmsRemolqueDos = (e) => {
        setData({
            ...data,
            kmsRemolqueDos: e.target.value
        });
    }

    const handleChangeMillasRemolqueDos = (e) => {
        setData({
            ...data,
            millasRemolqueDos: e.target.value
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

    return(
        <form onSubmit={onSubmit}>
            {/*<div className={classes.root}></div>*/}
            <Grid container spacing={2}>
                <Grid item xs={2}>
                    <TextField
                        id={"sucursal"}
                        margin={"dense"}
                        disabled
                        label={"Sucursal"}
                        variant={"outlined"}
                        InputProps={{readOnly: true}}
                        value={data.sucursal}
                    />
                </Grid>
                <Grid item xs={1}>
                    <TextField
                        id={"viaje"}
                        margin={"dense"}
                        label={"Viaje"}
                        InputProps={{readOnly: true}}
                        disabled
                        variant={"outlined"}
                        value={data.viaje}/>
                </Grid>
                <Grid item xs={4}>
                    <TextField
                        id={"documento"}
                        margin={"dense"}
                        label={"Documento"}
                        InputProps={{readOnly: true}}
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
                        disabled
                        variant={"outlined"}
                        value={data.fecha}/>
                </Grid>
                <Grid item xs={1}>
                    <TextField
                        id={"hora"}
                        margin={"dense"}
                        label={"Hora"}
                        InputProps={{readOnly: true}}
                        disabled
                        variant={"outlined"}
                        value={data.hora}/>
                </Grid>

               {/*  <Grid item xs={7}>
                    <TextField
                        id={"cliente"}
                        margin={"dense"}
                        label={"Cliente"}
                        InputProps={{readOnly: true}}
                        disabled
                        variant={"outlined"}
                        value={data.cliente}/>
                </Grid>
                <Grid item xs={5}/> */}

                {/*<Grid item xs={7}>*/}
                {/*    <TextField*/}
                {/*        id={"ruta"}*/}
                {/*        margin={"dense"}*/}
                {/*        label={"Ruta"}*/}
                {/*        InputProps={{readOnly: true}}*/}
                {/*        disabled*/}
                {/*        variant={"outlined"}*/}
                {/*        value={data.ruta}/>*/}
                {/*</Grid>*/}
                {/*<Grid item xs={5}/>*/}

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

                {/*<Grid item xs={2}>
                    <TextField
                        id={"kilometros"}
                        margin={"dense"}
                        label={"Kilómetros"}
                        InputProps={{
                            endAdornment: <InputAdornment position="end">kms</InputAdornment>,
                        }}
                        variant={"outlined"}
                        value={data.kms}
                        onChange={handleChangeKms}
                    />
                </Grid>*/}
                {/*<Grid item xs={2}>
                    <TextField
                        id={"millas"}
                        margin={"dense"}
                        label={"Millas"}
                        variant={"outlined"}
                        InputProps={{
                            endAdornment: <InputAdornment position="end">mi</InputAdornment>,
                        }}
                        value={data.millas}
                        onChange={handleChangeMillas}
                    />
                </Grid>*/}
                {/*<Grid item xs={8}/>*/}

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
                {/*<Grid item xs={2}>
                    <TextField
                        id={"kmsRemolqueUno"}
                        margin={"dense"}
                        label={"Odómetro"}
                        InputProps={{
                            endAdornment: <InputAdornment position="end">kms</InputAdornment>,
                        }}
                        variant={"outlined"}
                        value={data.kmsRemolqueUno}
                        onChange={handleChangeKmsRemolqueUno}
                    />
                </Grid>*/}
                {/*<Grid item xs={2}>
                    <TextField
                        id={"millasRemolqueUno"}
                        margin={"dense"}
                        label={"Odómetro"}
                        variant={"outlined"}
                        InputProps={{
                            endAdornment: <InputAdornment position="end">mi</InputAdornment>,
                        }}
                        value={data.millasRemolqueUno}
                        onChange={handleChangeMillasRemolqueUno}
                    />
                </Grid>*/}
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
                {/*<Grid item xs={2}>
                    <TextField
                        id={"kmsRemolqueDos"}
                        margin={"dense"}
                        label={"Odómetro"}
                        InputProps={{
                            endAdornment: <InputAdornment position="end">kms</InputAdornment>,
                        }}
                        variant={"outlined"}
                        value={data.kmsRemolqueDos}
                        onChange={handleChangeKmsRemolqueDos}
                    />
                </Grid>*/}
                {/*<Grid item xs={2}>
                    <TextField
                        id={"millasRemolqueDos"}
                        margin={"dense"}
                        label={"Odómetro"}
                        InputProps={{
                            endAdornment: <InputAdornment position="end">mi</InputAdornment>,
                        }}
                        variant={"outlined"}
                        value={data.millasRemolqueDos}
                        onChange={handleChangeMillasRemolqueDos}
                    />
                </Grid>*/}
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
                <Grid item xs={7}/>

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
                        InputProps={{inputProps: { min: data.fechaSalida}}}
                        defaultValue={getCurrentDate()}
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
                        defaultValue={getCurrentTime()}
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

                {/*<Grid item xs={2}>
                    <TextField
                        id={"pesoLiquidar"}
                        margin={"dense"}
                        disabled
                        label={"Peso a Liquidar"}
                        variant={"outlined"}
                        InputProps={{readOnly: true}}
                        value={data.pesoLiquidar}
                    />
                </Grid>
                <Grid item xs={2}>
                    <TextField
                        id={"pesoDescarga"}
                        margin={"dense"}
                        label={"Peso de Descarga"}
                        variant={"outlined"}
                        value={data.pesoDescarga}
                        onChange={handlePesoDescarga}
                    />
                </Grid>*/}

            </Grid>
            {props.children}
        </form>
    )
}