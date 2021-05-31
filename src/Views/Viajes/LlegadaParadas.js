
import React from 'react';
import {FormControl, MenuItem, OutlinedInput, TextField} from "@material-ui/core";
import { makeStyles } from '@material-ui/core/styles';
import InputAdornment from '@material-ui/core/InputAdornment';
import clsx from 'clsx';

const useStyles = makeStyles(() => ({
    root: {
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
    },
}));

export default function LlegadaParadas(props){
    const classes = useStyles();

    const [data, setData] = React.useState({
        sucursal: "",
        viaje: "",
        documento: "",
        numViajeCliente: "",
        fecha: "",
        hora: "",
        cliente: "",
        ruta: "",
        origen: "",
        tipoDeCambioOrigen: "",
        destino: "",
        kms: "",
        millas: "",
        operador: "",
        liquidacion: "",
        unidad: "",
        idEstatusUnidad: 0,
        remolqueUno: "",
        kmsRemolqueUno: "",
        millasRemolqueUno: "",
        placasRemolqueUno: "",
        idEstatusRemolqueUno: 0,
        nameEstatusRemolqueUno: "",
        remolqueDos: "",
        kmsRemolqueDos: "",
        millasRemolqueDos: "",
        placasremolqueDos: "",
        dolly: "",
        fechaSalida: "",
        horaSalida: "",
        fechaLlegada: "",
        horaLlegada: "",
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
        <form onSubmit={onSubmit}  className={classes.root}>
            <div style={{display: "flex", flexDirection: "row"}}>
                <TextField
                    id={"sucursal"}
                    margin={"dense"}
                    disabled
                    label={"Sucursal"}
                    variant={"outlined"}
                    InputProps={{readOnly: true}}
                    value={data.sucursal}
                    />
                <TextField
                    id={"viaje"}
                    margin={"dense"}
                    label={"Viaje"}
                    InputProps={{readOnly: true}}
                    disabled
                    variant={"outlined"}
                    value={data.viaje}/>
                <TextField
                    id={"documento"}
                    margin={"dense"}
                    label={"Documento"}
                    InputProps={{readOnly: true}}
                    disabled
                    variant={"outlined"}
                    value={data.documento}/>
                <TextField
                    id={"numViajeCliente"}
                    margin={"dense"}
                    label={"Núm. Viaje cliente"}
                    InputProps={{readOnly: true}}
                    disabled
                    variant={"outlined"}
                    value={data.numViajeCliente}/>
                <TextField
                    id={"fecha"}
                    margin={"dense"}
                    label={"Fecha"}
                    InputProps={{readOnly: true}}
                    disabled
                    variant={"outlined"}
                    value={data.fecha}/>
                <TextField
                    id={"hora"}
                    margin={"dense"}
                    label={"Hora"}
                    InputProps={{readOnly: true}}
                    disabled
                    variant={"outlined"}
                    value={data.hora}/>
            </div>
            <div style={{display: "flex", flexDirection: "row"}}>
                <TextField
                    id={"cliente"}
                    margin={"dense"}
                    label={"Cliente"}
                    InputProps={{readOnly: true}}
                    disabled
                    variant={"outlined"}
                    value={data.cliente}/>
            </div>
            <div style={{display: "flex", flexDirection: "row"}}>
                <TextField
                    id={"ruta"}
                    margin={"dense"}
                    label={"Ruta"}
                    InputProps={{readOnly: true}}
                    disabled
                    variant={"outlined"}
                    value={data.ruta}/>
            </div>
            <div style={{display: "flex", flexDirection: "row"}}>
                <TextField
                    id={"origen"}
                    margin={"dense"}
                    label={"Origen"}
                    InputProps={{readOnly: true}}
                    disabled
                    variant={"outlined"}
                    value={data.origen}/>
                <TextField
                    id={"tipoCambioOrigen"}
                    margin={"dense"}
                    label={"Tipo de cambio"}
                    InputProps={{
                        startAdornment: <InputAdornment position="start">$</InputAdornment>,
                    }}
                    variant={"outlined"}
                    value={data.tipoDeCambioOrigen}
                    onChange={handleTipoDeCambio}
                />
            </div>
            <div style={{display: "flex", flexDirection: "row"}}>
                <TextField
                    id={"destino"}
                    margin={"dense"}
                    label={"Destino"}
                    InputProps={{readOnly: true}}
                    disabled
                    variant={"outlined"}
                    value={data.destino}/>
            </div>
            <div style={{display: "flex", flexDirection: "row"}}>
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
            </div>
            <div style={{display: "flex", flexDirection: "row"}}>
                <TextField
                    id={"operador"}
                    margin={"dense"}
                    label={"Operador"}
                    InputProps={{readOnly: true}}
                    disabled
                    variant={"outlined"}
                    value={data.operador}/>
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
            </div>
            <div style={{display: "flex", flexDirection: "row"}}>
                <TextField
                    id={"operador"}
                    margin={"dense"}
                    label={"Operador"}
                    InputProps={{readOnly: true}}
                    disabled
                    variant={"outlined"}
                    value={data.operador}/>
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
            </div>
            <div style={{display: "flex", flexDirection: "row"}}>
                <TextField
                    id={"remolqueUno"}
                    InputProps={{readOnly: true}}
                    margin={"dense"}
                    disabled
                    label={"Remolque 1"}
                    variant={"outlined"}
                    value={data.remolqueUno}
                />
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
                <TextField
                    id="placasRemolqueUno"
                    disabled
                    label={"Placas"}
                    InputProps={{readOnly: true}}
                    margin={"dense"}
                    value={data.placasRemolqueUno}
                    variant="outlined"
                />
            </div>
            <div style={{display: "flex", flexDirection: "row"}}>
                <TextField
                    id={"remolqueDos"}
                    InputProps={{readOnly: true}}
                    margin={"dense"}
                    disabled
                    label={"Remolque 2"}
                    variant={"outlined"}
                    value={data.remolqueDos}
                />
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
                <TextField
                    id="placasRemolqueDos"
                    disabled
                    InputProps={{readOnly: true}}
                    margin={"dense"}
                    label={"Placas"}
                    value={data.placasRemolqueDos}
                    variant="outlined"
                />
            </div>
            <div style={{display: "flex", flexDirection: "row"}}>
                <TextField
                    id={"dolly"}
                    margin={"dense"}
                    label={"Dolly"}
                    InputProps={{readOnly: true}}
                    disabled
                    variant={"outlined"}
                    value={data.dolly}/>
            </div>
            <div style={{display: "flex", flexDirection: "row"}}>
                <TextField
                    id={"fechaSalida"}
                    type={"date"}
                    margin={"dense"}
                    label={"Fecha Salida"}
                    variant={"outlined"}
                    InputLabelProps={{shrink: true,}}
                    value={data.fechaSalida}
                    onChange={handleChangeFechaSalida}
                />
                <TextField
                    id={"horaSalida"}
                    InputLabelProps={{shrink: true,}}
                    margin={"dense"}
                    type={"time"}
                    label={"Hora"}
                    variant={"outlined"}
                    value={data.horaSalida}
                    onChange={handleChangeHoraSalida}
                />
            </div>
            <div style={{display: "flex", flexDirection: "row"}}>
                <TextField
                    id={"fechaLlegada"}
                    type={"date"}
                    margin={"dense"}
                    label={"Fecha Llegada"}
                    variant={"outlined"}
                    InputLabelProps={{shrink: true,}}
                    value={data.fechaLlegada}
                    onChange={handleChangeFechaLlegada}
                />
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
            </div>
            <div style={{display: "flex", flexDirection: "row"}}>
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
                <TextField
                    id={"motivoRetraso"}
                    margin={"dense"}
                    label={"Motivo de retraso"}
                    variant={"outlined"}
                    value={data.motivoRetraso}
                    onChange={handleChangeMotivoRetraso}
                />
            </div>
            <div style={{display: "flex", flexDirection: "row"}}>
                <TextField
                    id={"pesoLiquidar"}
                    margin={"dense"}
                    disabled
                    label={"Peso a Liquidar"}
                    variant={"outlined"}
                    InputProps={{readOnly: true}}
                    value={data.pesoLiquidar}
                />
                <TextField
                    id={"pesoDescarga"}
                    margin={"dense"}
                    label={"Peso de Descarga"}
                    variant={"outlined"}
                    value={data.pesoDescarga}
                    onChange={handlePesoDescarga}
                />
            </div>
            {props.children}
        </form>
    )
}