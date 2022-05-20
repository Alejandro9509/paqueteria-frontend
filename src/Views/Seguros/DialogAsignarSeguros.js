import React, { useState, useEffect } from "react";
import Noty from "noty";
import { DataGrid } from "@material-ui/data-grid";
import { dataGridLocaleText } from "../../Constants";
import {Dialog, DialogActions, DialogContent, Grid, TextField} from "@material-ui/core";
import axios from "axios";
import InputAdornment from "@material-ui/core/InputAdornment";
import { trackPromise } from "react-promise-tracker";
import { API_HEADERS } from "../../Constants";
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
    let {dialogVisible,idCliente,dataTiposSeguro,recargarClientes} = props
    const headers = API_HEADERS
    const [state, setState] = React.useState({
        idTipoSeguro:0,
        porcentajeSeguro:0,
        valorDeclarado:0,
        aplicaSeguro:false
    })
   
    const handleChangeTipoSeguro = (event) => {
        setState({
            ...state,
            idTipoSeguro: event.target.value,
            porcentajeSeguro: dataTiposSeguro.find(item => item.m_nIdTipoSeguro === event.target.value).m_xPorcentaje,
            aplicaSeguro: (event.target.value === 3) || (event.target.value === 4),
            valorDeclarado: 0
        });
    }
    const handleChangePorcentajeSeguro = (event) => {
        setState({
            ...state,
            porcentajeSeguro: event.target.value,
        });
    };

    const handleAceptar = (event) =>{
       modificarSeguroCliente(state.idTipoSeguro,idCliente.data.m_nIdCliente,state.porcentajeSeguro,state.aplicaSeguro)
        .then((respuesta) => {
            if(state.idTipoSeguro==5){
                showSuccess("Se ha desasignado el tipo de seguro exitosamente");
            }
            else{
                showSuccess("Se ha asignado el tipo de seguro exitosamente");
            }
            recargarClientes()
            dialogVisible(false)

        })
        .catch((err) => {
            showSuccess("No se ha podido editar el tipo de seguro");
        }); 
    }

    function modificarSeguroCliente(idTipoSeguro,idCliente,porcentajeSeguro,aplicaSeguro){
        const url = `${process.env.REACT_APP_API_URL_LOCAL}/api/Clientes/ModificarSeguro/${idTipoSeguro}/${idCliente}/${porcentajeSeguro}/${aplicaSeguro}`;
        let result;
        trackPromise(
            result =  axios.post(url, Object.assign({}, {}), { headers })
            );
        return result
    }

    
  return (
    <div>
          <Grid container spacing={2} style={{marginBottom:'10px'}}>
             <Grid item xs={12}>
                Asignar Seguro
            </Grid>
       
            <Grid item xs={6}>
        <div className="input">
                   <TextField
                       name="idTipoSeguro"
                       id="idTipoSeguro"
                       select
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
                           <option key={option.m_nIdTipoSeguro} value={option.m_nIdTipoSeguro}>
                               {option.m_sDescripcion}
                           </option>
                       ))}
                   </TextField>
               </div>
               </Grid>

                 <Grid item xs={6}>
                   <TextField variant="outlined" margin="dense"
                                className="form-control"
                                type="number"
                                required
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


               
            </Grid>
           
            <DialogActions style={{justifyContent: "rigth"}}>
                   <button
                    onClick={() => {
                        dialogVisible(false)}}
                    className="btn btn-secondary secondary-btn"
                >
                    Cerrar
                </button>
                <button
                    onClick={() => {
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