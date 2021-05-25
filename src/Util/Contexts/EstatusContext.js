import axios from "axios";
import { trackPromise } from "react-promise-tracker";

const headers = {
    'Content-Type': 'application/json',
    //    'access-control-allow-origin': '*'
}

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
    const url = `${process.env.REACT_APP_API_URL}/EstatusGuia/GetListado`;
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
    const url = `${process.env.REACT_APP_API_URL}/SisEstatus/getListadoRecoleccion`;
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

function eliminarEstatusUnidades(id){
    const url = `${process.env.REACT_APP_API_URL}/EstatusUnidades/Eliminar/` + id;
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


export { obtenerEstatusDocumentos, obtenerEstatusEmbarque, obtenerEstatusGuia, obtenerEstatusInforme, obtenerEstatusRecoleccion, obtenerEstatusUnidades, agregarEstatusUnidades, modificarEstatusUnidades, obtenerEstatusUnidadesId, eliminarEstatusUnidades}