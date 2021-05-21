import axios from "axios";
import { trackPromise } from "react-promise-tracker";

const headers = {
    'Content-Type': 'application/json',
    //    'access-control-allow-origin': '*'
}

function modificarGrupoClientes(id, params){
    const url = `${process.env.REACT_APP_API_URL}/GruposClientes/Modificar/` + id;
    let result;
    trackPromise(
        result =  axios.put(url, Object.assign({}, params), { headers })
        );
    return result
}

function agregarGrupoClientes( params){
    const url = `${process.env.REACT_APP_API_URL}/GruposClientes/Agregar`;
    let result;
    trackPromise(
        result =  axios.post(url, Object.assign({}, params), { headers })
        );
    return result
}

function eliminarGrupoClientes(id){
    const url = `${process.env.REACT_APP_API_URL}/GruposClientes/Eliminar/` + id;
    let result;
    trackPromise(
        result =  axios.delete(url, { headers })
        );
    return result
}

function obtenerGrupoClientes(){
    const url = `${process.env.REACT_APP_API_URL}/GruposClientes/GetListado`;
    let result;
    trackPromise(
        result =  axios.get(url, { headers })
        );
    return result
}

function obtenerGrupoClientesId(id){
    const url = `${process.env.REACT_APP_API_URL}/GruposClientes/GetById/` + id;
    let result;
    trackPromise(
        result =  axios.get(url, { headers })
        );
    return result
}

export {modificarGrupoClientes, agregarGrupoClientes, eliminarGrupoClientes, obtenerGrupoClientesId, obtenerGrupoClientes}