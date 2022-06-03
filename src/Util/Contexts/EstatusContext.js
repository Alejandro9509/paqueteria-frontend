import axios from "axios";
import { trackPromise } from "react-promise-tracker";
import { API_HEADERS } from "../../Constants";

const headers = API_HEADERS


function obtenerEstatusDocumentos(){
    const url = `${process.env.REACT_APP_API_URL}/SisEstatus/getListadoDocumentos`;
    let result;
    trackPromise(
        result =  axios.get(url, { headers })
        );
    return result
}

function obtenerEstatusEmbarque(){
    const url = `${process.env.REACT_APP_API_URL}/SisEstatus/GetListadoEmbarque`;
    let result;
    trackPromise(
        result =  axios.get(url, { headers })
        );
    return result
}

function obtenerEstatusGuia(){
    const url = `${process.env.REACT_APP_API_URL}/api/EstatusGuia/GetListado`;
    let result;
    trackPromise(
        result =  axios.get(url, { headers })
        );
    return result
}

function obtenerEstatusViaje(){
    const url = `${process.env.REACT_APP_API_URL}/SisEstatus/getListadoViajes`;
    let result;
    trackPromise(
        result =  axios.get(url, { headers })
        );
    return result
}

function obtenerEstatusInforme(){
    const url = `${process.env.REACT_APP_API_URL}/SisEstatus/getListadoInformes`;
    let result;
    trackPromise(
        result =  axios.get(url, { headers })
        );
    return result
}
function obtenerEstatusRecoleccion(){
    const url = `${process.env.REACT_APP_REPORT_URL}/api/SisEstatus/getListadoRecoleccion`;
    let result;
    trackPromise(
        result =  axios.get(url, { headers })
        );
    return result
}

function obtenerEstatusUnidades(){
    const url = `${process.env.REACT_APP_API_URL}/EstatusUnidades/GetListado`;
    let result;
    trackPromise(
        result =  axios.get(url, { headers })
        );
    return result
}

function obtenerEstatusUnidadesId(id){
    const url = `${process.env.REACT_APP_API_URL}/EstatusUnidades/GetById/${id}`;
    let result;
    trackPromise(
        result =  axios.get(url, { headers })
        );
    return result
}

function eliminarEstatusUnidades(id, idEliminadoPor){
    const url = `${process.env.REACT_APP_API_URL}/EstatusUnidades/Eliminar/` + id + `/${idEliminadoPor}`;
    let result;
    trackPromise(
        result =  axios.delete(url, { headers })
        );
    return result
}

function agregarEstatusUnidades(params){
    const url = `${process.env.REACT_APP_API_URL}/EstatusUnidades/Agregar`;
    let result;
    trackPromise(
        result =  axios.post(url, Object.assign({}, params), { headers })
        );
    return result
}

function modificarEstatusUnidades(id, params){
    const url = `${process.env.REACT_APP_API_URL}/EstatusUnidades/Modificar/` + id;
    let result;
    trackPromise(
        result =  axios.put(url, Object.assign({}, params), { headers })
        );
    return result
}


export {obtenerEstatusViaje, obtenerEstatusDocumentos, obtenerEstatusEmbarque, obtenerEstatusGuia, obtenerEstatusInforme, obtenerEstatusRecoleccion, obtenerEstatusUnidades, agregarEstatusUnidades, modificarEstatusUnidades, obtenerEstatusUnidadesId, eliminarEstatusUnidades}