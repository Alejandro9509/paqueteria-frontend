import axios from "axios";
import { trackPromise } from "react-promise-tracker";
import { API_HEADERS } from "../../Constants";

const headers = API_HEADERS


function modificarEstatusViaje(id, params){
    const url = `${process.env.REACT_APP_API_URL}/EstatusViajes/Modificar/` + id;
    let result;
    trackPromise(
        result =  axios.put(url, Object.assign({}, params), { headers })
        );
    return result
}

function agregarEstatusViaje( params){
    const url = `${process.env.REACT_APP_API_URL_LOCAL}/api/EstatusViajes/Agregar`;
    let result;
    trackPromise(
        result =  axios.post(url, Object.assign({}, params), { headers })
        );
    return result
}

function eliminarEstatusViaje(id, idEliminadoPor){
    const url = `${process.env.REACT_APP_API_URL}/EstatusViajes/Eliminar/` + id + `/${idEliminadoPor}`;
    let result;
    trackPromise(
        result =  axios.delete(url, { headers })
        );
    return result
}

function obtenerEstatusViaje(){
    const url = `${process.env.REACT_APP_API_URL}/EstatusViajes/GetListado`;
    let result;
    trackPromise(
        result =  axios.get(url, { headers })
        );
    return result
}

function obtenerEstatusViajeId(id){
    const url = `${process.env.REACT_APP_API_URL}/EstatusViajes/GetById/${id}`;
    let result;
    trackPromise(
        result =  axios.get(url, { headers })
        );
    return result
}

export {modificarEstatusViaje, agregarEstatusViaje, eliminarEstatusViaje, obtenerEstatusViaje, obtenerEstatusViajeId}