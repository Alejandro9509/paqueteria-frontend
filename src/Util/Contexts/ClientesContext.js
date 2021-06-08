import axios from "axios";
import { trackPromise } from "react-promise-tracker";

const headers = {
    'Content-Type': 'application/json',
    //    'access-control-allow-origin': '*'
}

function modificarCliente(id, params){
    const url = `${process.env.REACT_APP_API_URL}/Clientes/Modificar/` + id;
    let result;
    trackPromise(
        result =  axios.put(url, Object.assign({}, params), { headers })
        );
    return result
}

function agregarCliente( params){
    const url = `${process.env.REACT_APP_API_URL}/Clientes/Agregar`;
    let result;
    trackPromise(
        result =  axios.post(url, Object.assign({}, params), { headers })
        );
    return result
}

function eliminarCliente(id, idEliminadoPor){
    const url = `${process.env.REACT_APP_API_URL}/Clientes/Eliminar/` + id + `/${idEliminadoPor}`;
    let result;
    trackPromise(
        result =  axios.delete(url, { headers })
        );
    return result
}

function obtenerCliente(){
    const url = `${process.env.REACT_APP_API_URL}/Clientes/GetListado`;
    let result;
    trackPromise(
        result =  axios.get(url, { headers })
        );
    return result
}
function validarNumeroCliente(state){
    const url = `${process.env.REACT_APP_API_URL}/Clientes/ValidaNumeroCliente/` + state.numeroCliente + `/${state.idCliente}`;
    let result;
    trackPromise(
        result =  axios.get(url, { headers })
        );
    return result
}

function obtenerClienteId(id){
    const url = `${process.env.REACT_APP_API_URL}/Clientes/GetById/${id}`;
    let result;
    trackPromise(
        result =  axios.get(url, { headers })
        );
    return result
}

export {modificarCliente, agregarCliente, eliminarCliente, obtenerCliente, obtenerClienteId, validarNumeroCliente}