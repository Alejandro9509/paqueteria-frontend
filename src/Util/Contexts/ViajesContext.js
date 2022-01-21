import axios from "axios";
import { trackPromise } from "react-promise-tracker";
import { API_HEADERS } from "../../Constants";

const headers = API_HEADERS


function agregarViaje( params){
    const url = `${process.env.REACT_APP_API_URL}/Viajes/Agregar`;
    let result;
    trackPromise(
        result =  axios.post(url, Object.assign({}, params), { headers })
        );
    return result
}

function modificarViaje( id,params){
    const url = `${process.env.REACT_APP_API_URL}/Viajes/Modificar`;
    let result;
    trackPromise(
        result =  axios.put(url, Object.assign({}, params), { headers })
    );
    return result
}

function agregarViajeSalida( params){
    const url = `${process.env.REACT_APP_API_URL}/Viajes/AgregarSalida`;
    let result;
    trackPromise(
        result =  axios.post(url, Object.assign({}, params), { headers })
        );
    return result

    }

    
    
function agregarViajeLlegada( params){
    const url = `${process.env.REACT_APP_API_URL}/Viajes/AgregarLlegada`;
    let result;
    trackPromise(
        result =  axios.post(url, Object.assign({}, params), { headers })
        );
    return result
}

function obtenerViajes(){
    const url = `${process.env.REACT_APP_API_URL}/Viajes/GetListado`;
    let result;
    trackPromise(
        result =  axios.get(url,  { headers })
    );
    return result
}
function obtenerViajesByFiltro(fechaInicial, fechaFinal, estatusListado, folio,Origen,Destino, operador) {
    if (folio == '') {
        folio = 0
    }
    const url = `${process.env.REACT_APP_REPORT_URL}/api/Viajes/GetByFiltro`
        + "/"+ fechaInicial
        + "/" + fechaFinal
        + "/" + estatusListado
        + "/" + folio
        + "/" + Origen
        + "/" + Destino
        + "/" + operador
    ;
    let result;
    trackPromise(
        result =  axios.get(url,  { headers })
    );
    return result
}

function obtenerXML(id){
    const url = `${process.env.REACT_APP_API_URL}/Guia/GetXMLPermisionario/${id}`;
    let result;
    trackPromise(
        result =  axios.get(url,  { headers })
    );
    return result
}
function obtenerCFDI(id,sustituir){
    const url = `${process.env.REACT_APP_API_URL}/Guias/GetCFDITraslada/${id}/${sustituir ? 1 : 0}`;
    let result;
    trackPromise(
        result =  axios.get(url,  { headers })
    );
    return result
}
function obtenerReporteCFDI(id){
    const url = `${process.env.REACT_APP_REPORT_URL}/api/GenerarReporte/CFDI/${id}`;
    let result;
    trackPromise(
        result =  axios.get(url,  { headers })
    );
    return result
}

function cancelarCFDI(id, motivo){
    const url = `${process.env.REACT_APP_API_URL}/Informes/CancelarCFDITraslada/${id}`;
    let result;
    trackPromise(
        result =  axios.post(url, Object.assign({}, {motivoCancelacion: motivo}), { headers })
    );
    return result
}
function obtenerReporteCFDIViaje(id){
    const url = `${process.env.REACT_APP_REPORT_URL}/api/GenerarReporte/CFDIViaje/${id}`;
    let result;
    trackPromise(
        result =  axios.get(url,  { headers })
    );
    return result
}

function obtenerViajesEstatus(idEstatus){
    const url = `${process.env.REACT_APP_API_URL}/Viajes/GetListadoEstatus/${idEstatus}`;
    let result;
    trackPromise(
        result =  axios.get(url,  { headers })
    );
    return result
}


function obetenerViajeId( id){
    const url = `${process.env.REACT_APP_REPORT_URL}/api/Viajes/GetById/${id}`;
    let result;
    trackPromise(
        result =  axios.get(url,  { headers })
    );
    return result
}


function cancelarViaje(id, params){
    const url = `${process.env.REACT_APP_API_URL}/Viajes/CancelarViaje/${id}`;
    let result;
    trackPromise(
        result =  axios.put(url, Object.assign({}, params), { headers })
    );
    return result
}


export {obtenerViajesByFiltro,agregarViaje,agregarViajeSalida,agregarViajeLlegada, obetenerViajeId, modificarViaje,
    obtenerViajes, obtenerViajesEstatus, obtenerXML,obtenerCFDI, obtenerReporteCFDI, obtenerReporteCFDIViaje,cancelarCFDI,cancelarViaje}