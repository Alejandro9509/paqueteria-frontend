import axios from "axios";
import { trackPromise } from "react-promise-tracker";

const headers = {
    'Content-Type': 'application/json',
    //    'access-control-allow-origin': '*'
}

function modificarGrupoUnidades(id, params){
    const url = `${process.env.REACT_APP_API_URL}/GrupoUnidad/Modificar/` + id;
    let result;
    trackPromise(
        result =  axios.put(url, Object.assign({}, params), { headers })
        );
    return result
}

function agregarGrupoUnidades( params){
    const url = `${process.env.REACT_APP_API_URL}/GrupoUnidad/Agregar`;
    let result;
    trackPromise(
        result =  axios.post(url, Object.assign({}, params), { headers })
        );
    return result
}

function eliminarGrupoUnidades(id){
    const url = `${process.env.REACT_APP_API_URL}/GrupoUnidad/Eliminar/` + id;
    let result;
    trackPromise(
        result =  axios.delete(url, { headers })
        );
    return result
}

function obtenerGrupoUnidades(){
    const url = `${process.env.REACT_APP_API_URL}/GrupoUnidad/GetListado`;
    let result;
    trackPromise(
        result =  axios.get(url, { headers })
        );
    return result
}

function obtenerGrupoUnidadesId(id){
    const url = `${process.env.REACT_APP_API_URL}/GrupoUnidad/GetById/` + id;
    let result;
    trackPromise(
        result =  axios.get(url, { headers })
        );
    return result
}

export {modificarGrupoUnidades, agregarGrupoUnidades, eliminarGrupoUnidades, obtenerGrupoUnidadesId, obtenerGrupoUnidades}