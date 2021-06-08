import axios from "axios";
import { trackPromise } from "react-promise-tracker";

const headers = {
    'Content-Type': 'application/json',
    //    'access-control-allow-origin': '*'
}

function modificarCiudad(id, params){
    const url = `${process.env.REACT_APP_API_URL}/Ciudades/Modificar/` + id;
    let result;
    trackPromise(
        result =  axios.put(url, Object.assign({}, params), { headers })
        );
    return result
}

function agregarCiudad( params){
    const url = `${process.env.REACT_APP_API_URL}/Ciudades/Agregar`;
    let result;
    trackPromise(
        result =  axios.post(url, Object.assign({}, params), { headers })
        );
    return result
}

function eliminarCiudad(id, idEliminadoPor){
    const url = `${process.env.REACT_APP_API_URL}/Ciudades/Eliminar/` + id + `/${idEliminadoPor}`;
    let result;
    trackPromise(
        result =  axios.delete(url, { headers })
        );
    return result
}

function obtenerCiudades(){
    const url = `${process.env.REACT_APP_API_URL}/Ciudades/GetListado`;
    let result;
    trackPromise(
        result =  axios.get(url, { headers })
        );
    return result
}

function obtenerCiudadId(id){
    const url = `${process.env.REACT_APP_API_URL}/Ciudades/GetById/${id}`;
    let result;
    trackPromise(
        result =  axios.get(url, { headers })
        );
    return result
}

export {modificarCiudad, agregarCiudad, eliminarCiudad, obtenerCiudadId, obtenerCiudades}