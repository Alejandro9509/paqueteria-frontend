import React, {useState, useEffect} from "react";
import Noty from "noty";
import {dataGridLocaleText} from "../../Constants";
import {Dialog, DialogActions, DialogContent, Grid, MenuItem, TextField} from "@mui/material";
import axios from "axios";
import InputAdornment from "@mui/material/InputAdornment";
import {trackPromise} from "react-promise-tracker";
import {API_HEADERS} from "../../Constants";

//---------------------------->funcion para mostrar un mensaje<-----------------------------------------------------
function showSuccess(mensaje) {
    new Noty({
        type: "information",
        layout: "topCenter",
        text: mensaje,
        timeout: "3000",
    }).show();
}

const headers = API_HEADERS

function DialogAsignarSeguros(props) {
    let {dialogVisible, idCliente, dataTiposSeguro, recargarClientes} = props
    const headers = API_HEADERS
    const [state, setState] = React.useState({
        idTipoSeguro: props.select.m_nIdTipoSeguro || 0,
        porcentajeSeguro: props.select.m_cPorcentajeSeguro || 0,
        valorDeclarado: 0,
        aplicaSeguro: props.select.m_bSeguroObligatorio || false,
        aseguradora: props.select.m_sAseguradora || "",
        poliza: props.select.m_sPoliza || ""
    })

    const handleChangeTipoSeguro = (event) => {
        event.preventDefault();
        setState({
            ...state,
            idTipoSeguro: event.target.value,
            porcentajeSeguro: dataTiposSeguro.find(item => item.m_nIdTipoSeguro === event.target.value).m_xPorcentaje,
            aplicaSeguro: (event.target.value === 3) || (event.target.value === 4),
            valorDeclarado: 0
        });
    }
    const handleChangePorcentajeSeguro = (event) => {
        event.preventDefault();
        setState({
            ...state,
            porcentajeSeguro: event.target.value,
        });
    };

    const handleAceptar = () => {
        modificarSeguroCliente(state.idTipoSeguro, idCliente.m_nIdCliente, state.porcentajeSeguro, state.aplicaSeguro, state.aseguradora, state.poliza)
            .then((respuesta) => {
                if (state.idTipoSeguro == 5) {
                    showSuccess("Se ha desasignado el tipo de seguro exitosamente");
                } else {
                    showSuccess("Se ha asignado el tipo de seguro exitosamente");
                }
                recargarClientes()
                dialogVisible(false)

            })
            .catch((err) => {
                showSuccess("No se ha podido editar el tipo de seguro");
            });
    }

    function modificarSeguroCliente(idTipoSeguro, idCliente, porcentajeSeguro, aplicaSeguro, aseguradora, poliza) {
        const url = `${process.env.REACT_APP_REPORT_URL}/api/Clientes/ModificarSeguro`;
        let result;
        trackPromise(
            result = axios.post(url, Object.assign({}, {
                idTipoSeguro: idTipoSeguro, idCliente: idCliente,
                porcentajeSeguro: porcentajeSeguro, aplicaSeguro: aplicaSeguro, aseguradora: aseguradora, poliza: poliza
            }), {headers})
        );
        return result
    }


    return (
        <div>
            <Grid container spacing={2} style={{marginBottom: '10px'}}>
                <Grid item xs={12}>
                    Asignar Seguro
                </Grid>

                <Grid item xs={6}>
                    <div className="input">
                        <TextField
                            name="idTipoSeguro"
                            id="idTipoSeguro"
                            select
                            fullWidth
                            required
                            label="Tipo seguro"
                            value={state.idTipoSeguro}
                            /*onChange={(event) => {
                                event.preventDefault();
                                setState({
                                    ...state,
                                    idTipoSeguro: event.target.value,
                                    porcentajeSeguro: dataTiposSeguro.find(item => item.m_nIdTipoSeguro === event.target.value).m_xPorcentaje,
                                    aplicaSeguro: (event.target.value === 3) || (event.target.value === 4)
                                });
                            }}*/
                            onChange={handleChangeTipoSeguro}
                            variant="outlined"
                        >
                            {dataTiposSeguro.map((option) => (
                                <MenuItem key={option.m_nIdTipoSeguro} value={option.m_nIdTipoSeguro}>
                                    {option.m_sDescripcion}
                                </MenuItem>
                            ))}
                        </TextField>
                    </div>
                </Grid>

                <Grid item xs={6}>
                    <TextField variant="outlined" margin="dense"
                               className="form-control"
                               type="number"
                               required
                               fullWidth
                               disabled={!state.aplicaSeguro}
                               label="Porcentaje de seguro"
                               onChange={handleChangePorcentajeSeguro}
                               value={state.porcentajeSeguro}
                               placeholder="%"
                               id="porcentajeSeguro"
                               name="porcentajeSeguro"
                               InputProps={{
                                   endAdornment: <InputAdornment position="start">%</InputAdornment>,
                               }}
                    />


                </Grid>
                {
                    state.idTipoSeguro === 1 &&
                    <Grid item xs={6}>

                        <TextField variant="outlined" margin="dense"
                                   className="form-control"
                                   type="text"
                                   required
                                   fullWidth
                                   label="Aseguradora"
                                   onChange={(e) => {
                                       e.preventDefault();
                                       setState({...state, aseguradora: e.target.value})
                                   }}
                                   value={state.aseguradora}
                                   id="aseguradora"
                                   name="aseguradora"
                        />

                    </Grid>
                }
                {
                    state.idTipoSeguro === 1 &&
                    <Grid item xs={6}>
                        <TextField variant="outlined" margin="dense"
                                   className="form-control"
                                   type="text"
                                   required
                                   fullWidth
                                   label="Póliza"
                                   onChange={(e) => {
                                       e.preventDefault();
                                       setState({...state, poliza: e.target.value})
                                   }}
                                   value={state.poliza}
                                   id="poliza"
                                   name="poliza"
                        />


                    </Grid>
                }


            </Grid>

            <DialogActions style={{justifyContent: "rigth"}}>
                <button
                    onClick={(e) => {
                        e.preventDefault();
                        dialogVisible(false)
                    }}
                    className="btn btn-secondary secondary-btn"
                >
                    Cerrar
                </button>
                <button
                    onClick={(e) => {
                        e.preventDefault();
                        handleAceptar()
                    }}
                    className="btn btn-primary primary-btn"
                >
                    Seleccionar
                </button>
            </DialogActions>
        </div>
    )
}

export default DialogAsignarSeguros