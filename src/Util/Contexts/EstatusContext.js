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
    const url = `${localStorage.getItem("Back") ?? process.env.REACT_APP_REPORT_URL}/api/SisEstatus/GetListadoEmbarque`;
    let result;
    trackPromise(
        result =  axios.get(url, { headers })
        );
    return result
}

function obtenerEstatusGuia(){
    const url = `${localStorage.getItem("Back") ?? process.env.REACT_APP_REPORT_URL}/api/EstatusGuia/GetListado`;
    let result;
    trackPromise(
        result =  axios.get(url, { headers })
        );
    return result
}

function obtenerEstatusViaje(){
    const url = `${localStorage.getItem("Back") ?? process.env.REACT_APP_REPORT_URL}/api/SisEstatus/getListadoViajes`;
    let result;
    trackPromise(
        result =  axios.get(url, { headers })
        );
    return result
}

function obtenerEstatusInforme(){
    const url = `${localStorage.getItem("Back") ?? process.env.REACT_APP_REPORT_URL}/api/SisEstatus/getListadoInformes`;
    let result;
    trackPromise(
        result =  axios.get(url, { headers })
        );
    return result
}

function obtenerEstatusIncialInforme(){
    const url = `${localStorage.getItem("Back") ?? process.env.REACT_APP_REPORT_URL}/api/SisEstatus/getEstatusDefaultInformes`;
    let result;
    trackPromise(
        result =  axios.get(url, { headers })
    );
    return result
}

function obtenerEstatusRecoleccion(){
    const url = `${localStorage.getItem("Back") ?? process.env.REACT_APP_REPORT_URL}/api/SisEstatus/getListadoRecoleccion`;
    let result;
    trackPromise(
        result =  axios.get(url, { headers })
        );
    return result
}

export {
    obtenerEstatusViaje,
    obtenerEstatusDocumentos,
    obtenerEstatusEmbarque,
    obtenerEstatusGuia,
    obtenerEstatusInforme,
    obtenerEstatusRecoleccion,
    obtenerEstatusIncialInforme
}