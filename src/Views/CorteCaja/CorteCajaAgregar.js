import React, {useState, useEffect} from 'react'
import TextField from "@mui/material/TextField";
import {
    Box,
    Button,
    FormControlLabel,
    Grid,
    Paper,
    Switch,
    ThemeProvider,
    StyledEngineProvider,
    adaptV4Theme,
} from "@mui/material";
import Noty from "noty";
import {agregarCorte, modificarCorte} from "../../Util/Contexts/CorteCajaContext";
import {getCurrentDate, getCurrentTime} from "../../Util/Util";
import {createTheme} from "@mui/material/styles";
import DialogGuias from "./DialogGuias";
import TableGuias from "./TableGuias";
import DialogOperadores from "./DialogOperador";
import DialogUsuarios from "./DialogUsuarios";

function showSuccess(mensaje) {
    new Noty({
        type: "information",
        layout: "topCenter",
        text: mensaje,
        timeout: "3000"
    }).show()
}

function CorteCajaAgregar({value, disaled, setDisabled, onSaveSuccess}){
    const [guias, setGuias] = useState([])
    const [guiasSeleccionadas, setGuiasSeleccionadas] = useState([])

    const [filtros, setFiltros] = useState({
        busquedaPorUsuario: false,
        usuario: null,
        operador: null,
        fechaRegistro: null,
        horaRegistro: null
    })

    const [openDialog, setOpenDialog] = useState(false);
    const [openDialogGuias, setOpenDialogGuias] = useState(false);
    const theme = createTheme(adaptV4Theme({
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
    }));


    useEffect( () => {
        if (value?.idCorte > 0){
            setFiltros({
                busquedaPorUsuario: value.busquedaPorUsuario,
                usuario: value.usuario,
                operador: value.operador,
                fechaRegistro: value.fechaRegistro,
                horaRegistro: value.horaRegistro,
            })
            setGuias(value.guias)
        }
        if (!value?.idCorte > 0){
            setFiltros({
                busquedaPorUsuario: false,
                usuario: null,
                operador: null,
                fechaRegistro: null,
                horaRegistro: null
            })
            setGuias([])
        }
    }, [value])

    const limpiarCampos = () => {
        setFiltros({
            busquedaPorUsuario: false,
            usuario: null,
            operador: null,
            fechaRegistro: null,
            horaRegistro: null
        })
        setGuiasSeleccionadas([])
        setGuias([])
    }

    const handleChange = (input, newValue) => {
        if (input !== 'busquedaPorUsuario'){
            setFiltros({
                ...filtros,
                [input]: newValue,
            });
        }
        if (input === 'busquedaPorUsuario'){
            setFiltros({
                ...filtros,
                [input]: newValue,
                operador: null,
                usuario: null
            });
        }
    };

    const handleOpenDialog = () => {
        setOpenDialog(true);
    };

    const handleCloseDialog = () => {
        setOpenDialog(false);
    };

    const handleAcceptData = (data) => {
        if (filtros.busquedaPorUsuario){
            setFiltros({
                ...filtros,
                usuario: {
                    idUsuario: data.idUsuario,
                    nombre: data.nombre
                },
                operador: null
            })
        }else {
            setFiltros({
                ...filtros,
                usuario: null,
                operador: data
            })
        }
        handleCloseDialog();
    };

    const handleOpenDialogGuias = () => {
        setOpenDialogGuias(true);
    };

    const handleCloseDialogGuias = () => {
        setOpenDialogGuias(false);
    };

    const handleAcceptDataGuias = (data) => {

        setGuias([...guias, ...data])
        handleCloseDialogGuias();
    };

    const handleRowSelection = (selectedRows) => {
        setGuiasSeleccionadas(selectedRows)
    };

    const handleDescartarGuias = () => {
        let sel = [...guiasSeleccionadas]
        const listadoResultado = guias.filter((objeto1) => {
            // Comprobar si el objeto está presente en listado2
            return !sel.some((objeto2) => objeto2.idGuia === objeto1.idGuia);
        });
        setGuias(listadoResultado);
        setGuiasSeleccionadas([])
    };

    function totalSum(items) {
        return items.map(({ total }) => total).reduce((sum, i) => sum + i, 0);
    }

    function isDataValid(idUsuario, idOperador){
        if (idOperador > 0 && idUsuario > 0) {
            showSuccess("No se puede seleccionar operador y usuario.");
            return false;
        } else if (idOperador > 0 || idUsuario > 0) {
            return true;
        } else {
            showSuccess("Seleccione operador o usuario.");
            return false;
        }
    }

    const handleOnSaveSuccess = () =>{
        limpiarCampos()
        onSaveSuccess()
    }

    const handleGuardar = () => {
        const {fechaRegistro, horaRegistro, usuario, operador} = filtros
        if (!isDataValid(usuario?.idUsuario,operador?.m_nIdOperador)){
            return
        }
        let params = {
            "m_cTotal": totalSum(guias),
            "m_sFechaRegistro": fechaRegistro,
            "m_sHoraRegistro": horaRegistro,
            "m_nIdUsuario": usuario?.idUsuario || 0,
            "m_nIdOperador": operador?.m_nIdOperador || 0,
            "m_nIdSucursal": localStorage.getItem("Sucursal") || 0,
            "m_arrGuias": guias.map((i) => ({
                "m_nIdGuia": i.idGuia,
                "m_nTotal": i.total
            }))
        }
        if (disaled){
            return;
        }
        setDisabled(true)
        if (value?.idCorte > 0){
            modificarCorte(value.idCorte, params)
                .then((respuesta) => {
                    showSuccess(respuesta.data)
                    setDisabled(false)
                    handleOnSaveSuccess()
                })
                .catch((error) => {
                    console.log(error.toString())
                    showSuccess('Ocurrió un problema al guardar la información. Intente de nuevo.')
                    setDisabled(false)
                })
        }
        if (!value?.idCorte > 0){
            agregarCorte(params)
                .then((respuesta) => {
                    showSuccess(respuesta.data)
                    setDisabled(false)
                    handleOnSaveSuccess()
                })
                .catch((error) => {
                    console.log(error.toString())
                    showSuccess('Ocurrió un problema al guardar la información. Intente de nuevo.')
                    setDisabled(false)
                })
        }

    }

    return (
        <div>
            <DialogOperadores
                open={!!(openDialog && !filtros.busquedaPorUsuario)}
                handleClose={handleCloseDialog}
                handleAccept={handleAcceptData}
            />
            <DialogUsuarios
                open={!!(openDialog && filtros.busquedaPorUsuario)}
                handleClose={handleCloseDialog}
                handleAccept={handleAcceptData}
            />
            <DialogGuias
                open={openDialogGuias}
                handleClose={handleCloseDialogGuias}
                handleAccept={handleAcceptDataGuias}
                filtros={{
                    busquedaPorUsuario: filtros.busquedaPorUsuario,
                    idOperador: filtros.operador?.m_nIdOperador,
                    idUsuario: filtros.usuario?.idUsuario,
                    fecha: filtros.fechaRegistro
                }}
                idsRowsHiden={guias.map((i) => i.idGuia)}
            />
            <Paper style={{padding: '16px'}}>
                <section>
                    <Grid container spacing={1}>
                        <Grid item xs={2}>
                            <TextField
                                variant="outlined"
                                id="fechaRegistro"
                                label="Fecha de registro"
                                type="date"
                                onChange={(e) => handleChange('fechaRegistro', e.target.value) }
                                value={filtros.fechaRegistro}
                                InputLabelProps={{shrink: true,}}
                                required
                                disabled={disaled}
                            />
                        </Grid>
                        <Grid item xs={2}>
                            <TextField
                                variant="outlined"
                                id="horaRegistro"
                                label="Hora de registro"
                                type="time"
                                value={filtros.horaRegistro}
                                disabled={true}
                                InputLabelProps={{shrink: true,}}
                                inputProps={{step: 300,}}
                            />
                        </Grid>
                        <Grid item xs={2}>
                            <StyledEngineProvider injectFirst>
                                <ThemeProvider theme={theme}>
                                    <FormControlLabel
                                        control={
                                            <Switch
                                                checked={filtros.busquedaPorUsuario}
                                                onChange={(event) =>
                                                    handleChange('busquedaPorUsuario', event.target.checked)
                                                }
                                                color="primary"
                                                disabled={disaled}
                                            />
                                        }
                                        label="Busqueda por usuario"
                                    />
                                </ThemeProvider>
                            </StyledEngineProvider>
                        </Grid>
                        <Grid item xs={3}>
                            <TextField
                                variant="outlined"
                                label={filtros.busquedaPorUsuario ? `Usuario` : `Operador`}
                                value={filtros.busquedaPorUsuario ? filtros.usuario?.nombre || '' : filtros.operador?.m_sNombreCompleto || ''}
                                size={'small'}
                                onClick={(e) => handleOpenDialog()}
                                disabled={disaled}
                            />
                        </Grid>
                    </Grid>
                </section>
                <section style={{height: '50vh'}}>
                    <Box display="flex" justifyContent="flex-end">
                        <Button
                            onClick={handleDescartarGuias}
                            color={"primary"}
                            style={{fontSize:"1em"}}
                            disabled={disaled}>
                            Descartar Guias
                        </Button>
                        <Button
                            onClick={handleOpenDialogGuias}
                            variant={"contained"}
                            color={"primary"}
                            style={{fontSize:"1em"}}
                            disabled={disaled}>
                            Agregar Guias
                        </Button>
                    </Box>
                    <br/>
                    <TableGuias data={guias} handleSelection={handleRowSelection}
                                selectedRows2={guiasSeleccionadas}
                                disabled={disaled}
                    />
                </section>
                <section>
                    <Box display="flex" justifyContent="flex-end">
                        <Button
                            fullWidth
                            onClick={handleGuardar}
                            variant={"contained"}
                            color={"primary"}
                            style={{fontSize:"1em"}}
                            disabled={disaled}>
                            Guardar
                        </Button>
                    </Box>
                </section>
            </Paper>
        </div>
    );
}
export default CorteCajaAgregar