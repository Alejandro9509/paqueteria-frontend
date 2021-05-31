import React from 'react';
import {MenuItem, TextField} from "@material-ui/core";
import { makeStyles } from '@material-ui/core/styles';
import InputAdornment from "@material-ui/core/InputAdornment";

const useStyles = makeStyles(() => ({
    root: {
        '& .MuiTextField-root': {
            width: 200,
            marginLeft: 10
        },
        '& .MuiFormControl-marginDense': {
            margin: '10px !important',
        }
    },
}));

export default function SalidaParadas(props){
    const classes = useStyles();

    const [data, setData] = React.useState({
        sucursal: "",
        recorrido: "",
        fecha: "",
        hora: "",
        cliente: "",
        ruta: "",
        fechaEntrega: "",
        horaEntrega: "",
        remolqueUno: "",
        kmsRemolqueUno: "",
        millasRemolqueUno: "",
        idEstatusRemolqueUno: 0,
        nameEstatusRemolqueUno: "",
        remolqueDos: "",
        kmsRemolqueDos: "",
        millasRemolqueDos: "",
        idEstatusRemolqueDos: 0,
        nameEstatusRemolqueDos: "",
        dolly: "",
        origen: "",
        destino: "",
        operador: "",
        unidad: "",
        placasUnidad: "",
        fechaSalida: "",
        horaSalida: "",
        idEstatus: 0,
        nameEstatus: "",
        motivoRetraso: "",
        kms: "",
        millas: "",
        contactos: [
            /*{
                id: 0,
                name: "Pilar",
            },*/
        ]
    });
    const estatusRemolqueListado = [
        {
            id: 0,
            name: "Cargado",
        },
        {
            id: 1,
            name: "No cargado",
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

    const handleChangeEstatusRemolqueUno = (e) => {
        setData({
            ...data,
            idEstatusRemolqueUno: e.target.value
        });
    }

    const handleChangeEstatusRemolqueDos = (e) => {
        setData({
            ...data,
            idEstatusRemolqueDos: e.target.value
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

    function onSubmit(event) {
        event.preventDefault();
        props.onSubmit(data);
    }

    return(
        <form onSubmit={onSubmit} className={classes.root}>
            <div style={{display: 'flex', flexDirection: 'row'}}>
                <TextField
                    id="sucursal-text"
                    margin="dense"
                    disabled
                    label="Sucursal"
                    variant="outlined"
                    InputProps={{
                        readOnly: true,
                    }}
                    value={data.sucursal}/>
                <TextField
                    id={'recorrido-text'}
                    margin="dense"
                    disabled
                    label={"Recorrido"}
                    variant={"outlined"}
                    InputProps={{
                        readOnly: true,
                    }}
                    value={data.recorrido}/>
                <TextField
                    id="fecha"
                    margin="dense"
                    disabled
                    label="Fecha"
                    variant="outlined"
                    className="form-control"
                    InputProps={{readOnly: true,}}
                    value={data.fecha}
                />
                <TextField
                    id={"hora"}
                    InputProps={{readOnly: true,}}
                    margin={"dense"}
                    disabled
                    label={"Hora"}
                    variant={"outlined"}
                    value={data.hora}
                />

            </div>
            <TextField
                id={"cliente"}
                InputProps={{readOnly: true}}
                margin={"dense"}
                disabled
                label={"Cliente"}
                variant={"outlined"}
                value={data.cliente}
            />
            <div style={{display: "flex", flexDirection: "row"}}>
                <TextField
                    id={"ruta"}
                    InputProps={{readOnly: true}}
                    margin={"dense"}
                    disabled
                    label={"Ruta"}
                    variant={"outlined"}
                    value={data.ruta}
                />
                <TextField
                    id={"fechaEntrega"}
                    InputProps={{readOnly: true}}
                    margin={"dense"}
                    disabled
                    label={"Fecha Entrega"}
                    variant={"outlined"}
                    value={data.fechaEntrega}
                />
                <TextField
                    id={"horaEntrega"}
                    InputProps={{readOnly: true}}
                    margin={"dense"}
                    disabled
                    label={"Hora"}
                    variant={"outlined"}
                    value={data.horaEntrega}
                />
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
                    label={"Odómetro Kms"}
                    variant={"outlined"}
                    InputProps={{
                        endAdornment: <InputAdornment position="end">kms</InputAdornment>,
                    }}
                    value={data.kmsRemolqueUno}
                    onChange={handleChangeKmsRemolqueUno}
                />
                <TextField
                    id={"millasRemolqueUno"}
                    margin={"dense"}
                    label={"Odómetro Mi"}
                    InputProps={{
                        endAdornment: <InputAdornment position="end">mi</InputAdornment>,
                    }}
                    variant={"outlined"}
                    value={data.millasRemolqueUno}
                    onChange={handleChangeMillasRemolqueUno}
                />
                <TextField
                    id="estatusRemolqueUno"
                    select
                    margin={"dense"}
                    value={data.idEstatusRemolqueUno}
                    onChange={handleChangeEstatusRemolqueUno}
                    variant="outlined"
                >
                    {estatusRemolqueListado.map((estatus) => (
                        <MenuItem key={estatus.id} value={estatus.id}>{estatus.name}</MenuItem>
                    ))}
                </TextField>
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
                    label={"Odómetro Kms"}
                    variant={"outlined"}
                    InputProps={{
                        endAdornment: <InputAdornment position="end">kms</InputAdornment>,
                    }}
                    value={data.kmsRemolqueDos}
                    onChange={handleChangeKmsRemolqueDos}
                />
                <TextField
                    id={"millasRemolqueDos"}
                    margin={"dense"}
                    label={"Odómetro Mi"}
                    variant={"outlined"}
                    InputProps={{
                        endAdornment: <InputAdornment position="end">mi</InputAdornment>,
                    }}
                    value={data.millasRemolqueDos}
                    onChange={handleChangeMillasRemolqueDos}
                />
                <TextField
                    id="estatusRemolqueDos"
                    select
                    margin={"dense"}
                    value={data.idEstatusRemolqueDos}
                    onChange={handleChangeEstatusRemolqueDos}
                    variant="outlined"
                >
                    {estatusRemolqueListado.map((estatus) => (
                        <MenuItem key={estatus.id} value={estatus.id}>{estatus.name}</MenuItem>
                    ))}
                </TextField>
            </div>
            <TextField
                id={"dolly"}
                InputProps={{readOnly: true}}
                margin={"dense"}
                disabled
                label={"Dolly"}
                variant={"outlined"}
                value={data.dolly}
            />
            <TextField
                id={"origen"}
                InputProps={{readOnly: true}}
                margin={"dense"}
                disabled
                label={"Origen"}
                variant={"outlined"}
                value={data.origen}
            />
            <TextField
                id={"destino"}
                InputProps={{readOnly: true}}
                margin={"dense"}
                disabled
                label={"destino"}
                variant={"outlined"}
                value={data.destino}
            />
            <TextField
                id={"operador"}
                InputProps={{readOnly: true}}
                margin={"dense"}
                disabled
                label={"Operador"}
                variant={"outlined"}
                value={data.operador}
            />
            <div style={{display: "flex", flexDirection: "row"}}>
                <TextField
                    id={"unidad"}
                    InputProps={{readOnly: true}}
                    margin={"dense"}
                    disabled
                    label={"Unidad"}
                    variant={"outlined"}
                    value={data.unidad}
                />
                <TextField
                    id={"placas"}
                    InputProps={{readOnly: true}}
                    margin={"dense"}
                    disabled
                    label={"Placas"}
                    variant={"outlined"}
                    value={data.placasUnidad}
                />
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
                    label={"Hora"}
                    variant={"outlined"}
                    value={data.horaSalida}
                    onChange={handleChangeHoraSalida}
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
                    id={"kms"}
                    margin={"dense"}
                    label={"Odómetro Kms"}
                    variant={"outlined"}
                    InputProps={{
                        endAdornment: <InputAdornment position="end">kms</InputAdornment>,
                    }}
                    value={data.kms}
                    onChange={handleChangeKms}
                />
                <TextField
                    id={"millas"}
                    margin={"dense"}
                    label={"Odómetro Mi"}
                    variant={"outlined"}
                    InputProps={{
                        endAdornment: <InputAdornment position="end">mi</InputAdornment>,
                    }}
                    value={data.millas}
                    onChange={handleChangeMillas}
                />
            </div>
            {props.children}
        </form>
    )
}