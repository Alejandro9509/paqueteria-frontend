import React, { useState } from 'react';
import {Paper, Grid, TextField, Button, ThemeProvider, FormControlLabel, Switch} from '@material-ui/core';
import DialogOperadores from "./DialogOperador";
import {getCurrentDate, getCurrentTime} from "../../Util/Util";
import DialogUsuarios from "./DialogUsuarios";
import {createMuiTheme} from "@material-ui/core/styles";

const Filtros = ({value, onChange, onFiltrarClick}) => {
    const [clicked, setClicked] = useState(false);
    const [date, setDate] = useState('');
    const [openDialog, setOpenDialog] = useState(false);
    const [filtros, setFiltros] = useState({
        busquedaPorUsuario: false,
        usuario: null,
        operador: null,
        fecha: getCurrentDate(),
    })

    const theme = createMuiTheme({
        overrides: {
            MuiSwitch: {
                switchBase: {
                    // Controls default (unchecked) color for the thumb
                    color: "#ccc"
                },
                colorPrimary: {
                    "&$checked": {
                        // Controls checked color for the thumb
                        color: "rgb(249, 160, 62)",
                        "&$disabled": {
                            // Controls checked color for the thumb
                            color: "rgb(249, 160, 62)"
                        }
                    },

                },
                track: {
                    // Controls default (unchecked) color for the track
                    opacity: 0.2,
                    backgroundColor: "#ccc",
                    "$checked$checked + &": {
                        // Controls checked color for the track
                        opacity: 0.7,
                        backgroundColor: "#F9A03E"
                    }
                }
            }
        }
    });

    const handleDateChange = (event) => {
        onChange({
            ...filtros,
            fecha: event.target.value
        });
    };

    const handleButtonClick = () => {
        onFiltrarClick()
    };

    const handleOpenDialog = () => {
        setOpenDialog(true);
    };

    const handleCloseDialog = () => {
        setOpenDialog(false);
    };

    const handleAcceptData = (data) => {
        if (value.busquedaPorUsuario){
            onChange({
                ...value,
                usuario: data,
                operador: null
            })
        }else {
            onChange({
                ...value,
                usuario: null,
                operador: data
            })
        }
        handleCloseDialog();
    };

    const handleChange = (input, newData) => {
        if (input !== 'busquedaPorUsuario'){
            onChange({
                ...value,
                [input]: newData,
            });
        }
        if (input === 'busquedaPorUsuario'){
            onChange({
                ...value,
                [input]: newData,
                operador: null,
                usuario: null
            });
        }
    };

    return (
        <div>
            <DialogOperadores
                open={!!(openDialog && !value.busquedaPorUsuario)}
                handleClose={handleCloseDialog}
                handleAccept={handleAcceptData}
            />
            <DialogUsuarios
                open={!!(openDialog && value.busquedaPorUsuario)}
                handleClose={handleCloseDialog}
                handleAccept={handleAcceptData}
            />
            <Paper elevation={3} style={{ padding: '20px' }}>
                <Grid container spacing={2} alignItems="center">
                    <Grid item xs={2}>
                        <TextField
                            variant={"outlined"}
                            margin={"dense"}
                            label="Fecha"
                            type="date"
                            value={value.fecha}
                            onChange={(e) => handleChange('fecha', e.target.value)}
                            InputLabelProps={{
                                shrink: true,
                            }}
                            fullWidth
                        />
                    </Grid>
                    <Grid item xs={2}>
                        <ThemeProvider theme={theme}>
                            <FormControlLabel
                                control={
                                    <Switch
                                        checked={value.busquedaPorUsuario}
                                        onChange={(event) => handleChange('busquedaPorUsuario', event.target.checked)}
                                        color="primary"
                                    />
                                }
                                label="Busqueda por usuario"
                            />
                        </ThemeProvider>
                    </Grid>
                    <Grid item xs={3}>
                        <TextField
                            variant="outlined"
                            label={value.busquedaPorUsuario ? `Usuario` : `Operador`}
                            value={value.busquedaPorUsuario ? value.usuario?.nombre || '' : value.operador?.m_sNombreCompleto || ''}
                            margin={'dense'}
                            onClick={(e) => handleOpenDialog()}
                        />
                    </Grid>
                    <Grid item xs={2}>
                        <Button variant="contained" onClick={handleButtonClick} fullWidth color={"primary"}>
                            Buscar
                        </Button>
                    </Grid>
                </Grid>
            </Paper>
        </div>

    );
};

export default Filtros;
