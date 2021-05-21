import axios from "axios";
import { trackPromise } from "react-promise-tracker";

const headers = {
    'Content-Type': 'application/json',
    //    'access-control-allow-origin': '*'
}

function modificarEstatusViaje(id, params){
    const url = `${process.env.REACT_APP_API_URL}/Estatusviajes/Modificar/` + id;
    let result;
    trackPromise(
        result =  axios.put(url, Object.assign({}, params), { headers })
        );
    return result
}

function agregarEstatusViaje( params){
    const url = `${process.env.REACT_APP_API_URL}/Estatusviajes/Agregar`;
    let result;
    trackPromise(
        result =  axios.post(url, Object.assign({}, params), { headers })
        );
    return result
}

function eliminarEstatusViaje(id){
    const url = `${process.env.REACT_APP_API_URL}/Estatusviajes/Eliminar/` + id;
    let result;
    trackPromise(
        result =  axios.delete(url, { headers })
        );
    return result
}

function obtenerEstatusViaje(){
    const url = `${process.env.REACT_APP_API_URL}/Estatusviajes/GetListado`;
    let result;
    trackPromise(
        result =  axios.get(url, { headers })
        );
    return result
}

function obtenerEstatusViajeId(id){
    const url = `${process.env.REACT_APP_API_URL}/Estatusviajes/GetById/${id}`;
    let result;
    trackPromise(
        result =  axios.get(url, { headers })
        );
    return result
}

export {modificarEstatusViaje, agregarEstatusViaje, eliminarEstatusViaje, obtenerEstatusViaje, obtenerEstatusViajeId}