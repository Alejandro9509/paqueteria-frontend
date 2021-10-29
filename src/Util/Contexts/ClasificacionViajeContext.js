import axios from "axios";
import { trackPromise } from "react-promise-tracker";
import { API_HEADERS } from "../../Constants";

const headers = API_HEADERS


function modificarClasificacionViaje(id, params){
    const url = `${process.env.REACT_APP_API_URL}/ClasificacionViajes/Modificar/` + id;
    let result;
    trackPromise(
        result =  axios.put(url, Object.assign({}, params), { headers })
        );
    return result
}

function agregarClasificacionViaje( params){
    const url = `${process.env.REACT_APP_API_URL}/ClasificacionViajes/Agregar`;
    let result;
    trackPromise(
        result =  axios.post(url, Object.assign({}, params), { headers })
        );
    return result
}

function eliminarClasificacionViaje(id, idEliminadoPor){
    const url = `${process.env.REACT_APP_API_URL}/ClasificacionViajes/Eliminar/` + id +`/${idEliminadoPor}`;
    let result;
    trackPromise(
        result =  axios.delete(url, { headers })
        );
    return result
}

function obtenerClasificacionViaje(){
    const url = `${process.env.REACT_APP_API_URL}/ClasificacionViajes/GetListado`;
    let result;
    trackPromise(
        result =  axios.get(url, { headers })
        );
    return result
}

function obtenerClasificacionViajeId(id){
    const url = `${process.env.REACT_APP_API_URL}/ClasificacionViajes/GetById/${id}`;
    let result;
    trackPromise(
        result =  axios.get(url, { headers })
        );
    return result
}

export {modificarClasificacionViaje, agregarClasificacionViaje, eliminarClasificacionViaje, obtenerClasificacionViaje, obtenerClasificacionViajeId}