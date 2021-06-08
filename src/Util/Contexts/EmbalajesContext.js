import axios from "axios";
import { trackPromise } from "react-promise-tracker";

const headers = {
    'Content-Type': 'application/json',
    //    'access-control-allow-origin': '*'
}

function modificarEmbalajes(id, params){
    const url = `${process.env.REACT_APP_API_URL}/Embalaje/Modificar/` + id;
    let result;
    trackPromise(
        result =  axios.put(url, Object.assign({}, params), { headers })
        );
    return result
}

function agregarEmbalajes( params){
    const url = `${process.env.REACT_APP_API_URL}/Embalaje/Agregar`;
    let result;
    trackPromise(
        result =  axios.post(url, Object.assign({}, params), { headers })
        );
    return result
}

function eliminarEmbalajes(id, idEliminadoPor){
    const url = `${process.env.REACT_APP_API_URL}/Embalaje/Eliminar/` + id + `/${idEliminadoPor}`;
    let result;
    trackPromise(
        result =  axios.delete(url, { headers })
        );
    return result
}

function obtenerEmbalajes(){
    const url = `${process.env.REACT_APP_API_URL}/Embalajes/GetListado`;
    let result;
    trackPromise(
        result =  axios.get(url, { headers })
        );
    return result
}

function obtenerEmbalajesId(id){
    const url = `${process.env.REACT_APP_API_URL}/Embalaje/GetById/${id}`;
    let result;
    trackPromise(
        result =  axios.get(url, { headers })
        );
    return result
}

export {modificarEmbalajes, agregarEmbalajes, eliminarEmbalajes, obtenerEmbalajes, obtenerEmbalajesId}