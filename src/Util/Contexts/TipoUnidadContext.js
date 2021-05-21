import axios from "axios";
import { trackPromise } from "react-promise-tracker";

const headers = {
    'Content-Type': 'application/json',
    //    'access-control-allow-origin': '*'
}

function modificarTipoUnidades(id, params){
    const url = `${process.env.REACT_APP_API_URL}/TipoUnidad/Modificar/` + id;
    let result;
    trackPromise(
        result =  axios.post(url, Object.assign({}, params), { headers })
        );
    return result
}

function agregarTipoUnidades( params){
    const url = `${process.env.REACT_APP_API_URL}/TipoUnidad/Agregar`;
    let result;
    trackPromise(
        result =  axios.post(url, Object.assign({}, params), { headers })
        );
    return result
}

function eliminarTipoUnidades(id){
    const url = `${process.env.REACT_APP_API_URL}/TipoUnidad/Eliminar/` + id;
    let result;
    trackPromise(
        result =  axios.delete(url, { headers })
        );
    return result
}

function obtenerTipoUnidades(){
    const url = `${process.env.REACT_APP_API_URL}/TiposUnidades/GetListado`;
    let result;
    trackPromise(
        result =  axios.get(url, { headers })
        );
    return result
}

function obtenerTipoUnidadesId(id){
    const url = `${process.env.REACT_APP_API_URL}/TipoUnidades/GetById/` + id;
    let result;
    trackPromise(
        result =  axios.get(url, { headers })
        );
    return result
}

export {modificarTipoUnidades, agregarTipoUnidades, eliminarTipoUnidades, obtenerTipoUnidades, obtenerTipoUnidadesId}