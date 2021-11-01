import axios from "axios";
import { trackPromise } from "react-promise-tracker";
import { API_HEADERS } from "../../Constants";

const headers = API_HEADERS


function modificarCaseta(id, params){
    const url = `${process.env.REACT_APP_API_URL}/Casetas/Modificar/` + id;
    let result;
    trackPromise(
        result = axios.put(url, Object.assign({}, params), { headers })
        );
    return result
}

function agregarCaseta( params){
    const url = `${process.env.REACT_APP_API_URL}/Casetas/Agregar`;
    let result;
    trackPromise(
    result = axios.post(url, Object.assign({}, params), { headers })
    );
    return result
}

function eliminarCaseta(id, idEliminadoPor){
    const url = `${process.env.REACT_APP_API_URL}/Casetas/Eliminar/` + id + `/${idEliminadoPor}`;
    let result;
    trackPromise(
    result =  axios.delete(url, { headers })
    );
    return result
}

function obtenerCaseta(){
    const url = `${process.env.REACT_APP_API_URL}/Casetas/GetListado`;
    let result;
    trackPromise(
    result =  axios.get(url, { headers })
    );
    return result
}

function obtenerCasetaId(id){
    const url = `${process.env.REACT_APP_API_URL}/Casetas/GetById/${id}`;
    let result;
    trackPromise(
    result =  axios.get(url, { headers })
    );
    return result
}

export {modificarCaseta, agregarCaseta, eliminarCaseta, obtenerCaseta, obtenerCasetaId}