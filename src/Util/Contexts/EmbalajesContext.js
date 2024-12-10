import axios from "axios";
import { trackPromise } from "react-promise-tracker";
import { API_HEADERS } from "../../Constants";

const headers = API_HEADERS


function modificarEmbalajes(id, params){
    const url = `${process.env.REACT_APP_REPORT_URL}/api/Embalaje/Modificar/` + id;
    let result;
    trackPromise(
        result =  axios.put(url, Object.assign({}, params), { headers })
        );
    return result
}

function agregarEmbalajes( params){
    const url = `${process.env.REACT_APP_REPORT_URL}/api/Embalaje/Agregar`;
    let result;
    trackPromise(
        result =  axios.post(url, Object.assign({}, params), { headers })
        );
    return result
}

function eliminarEmbalajes(id, idEliminadoPor){
    const url = `${process.env.REACT_APP_REPORT_URL}/api/Embalaje/Eliminar/` + id + `/${idEliminadoPor}`;
    let result;
    trackPromise(
        result =  axios.delete(url, { headers })
        );
    return result
}

function validarEliminarEmbalajes(id){
    const url = `${process.env.REACT_APP_REPORT_URL}/api/Embalajes/ValidarEliminar/${id}`;
    let result;
    trackPromise(
        result =  axios.get(url, { headers })
        );
    return result
}

function obtenerEmbalajes(){
    const url = `${process.env.REACT_APP_REPORT_URL}/api/Embalajes/GetListado`;
    let result;
    trackPromise(
        result =  axios.get(url, { headers })
        );
    return result
}

function obtenerEmbalajesId(id){
    const url = `${process.env.REACT_APP_REPORT_URL}/api/Embalajes/GetById/${id}`;
    let result;
    trackPromise(
        result =  axios.get(url, { headers })
        );
    return result
}

export {
    modificarEmbalajes,
    agregarEmbalajes,
    eliminarEmbalajes,
    obtenerEmbalajes,
    obtenerEmbalajesId,
    validarEliminarEmbalajes
}