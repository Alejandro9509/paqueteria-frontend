import axios from "axios";
import { trackPromise } from "react-promise-tracker";
import { API_HEADERS } from "../../Constants";
import {getCurrentDateTime} from "../Util";

const headers = API_HEADERS


function agregarViaje( params){
    const url = `${process.env.REACT_APP_REPORT_URL}/api/Viajes/Agregar`;
    let result;
    trackPromise(
        result =  axios.post(url, Object.assign({}, params), { headers })
        );
    return result
}

function modificarViaje( id,params){
    const url = `${process.env.REACT_APP_REPORT_URL}/api/Viajes/Modificar`;
    let result;
    trackPromise(
        result =  axios.put(url, Object.assign({}, params), { headers })
    );
    return result
}

function agregarViajeSalida( params){
    const url = `${process.env.REACT_APP_REPORT_URL}/api/Viajes/AgregarSalida`;
    let result;
    trackPromise(
        result =  axios.post(url, Object.assign({}, params), { headers })
        );
    return result
}
    
function agregarViajeLlegada( params){
    const url = `${process.env.REACT_APP_REPORT_URL}/api/Viajes/AgregarLlegada`;
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

function validarCFDI(id){
    const url = `${process.env.REACT_APP_REPORT_URL}/api/Guias/GetValidacionCFDITraslada/${id}`;
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

/*function cancelarCFDI(id, motivo){
    const url = `${process.env.REACT_APP_API_URL}/Informes/CancelarCFDITraslada/${id}`;
    let result;
    trackPromise(
        result =  axios.post(url, Object.assign({}, {motivoCancelacion: motivo}), { headers })
    );
    return result
}*/

function obtenerReporteCFDIViaje(id, idInforme){
    const url = `${process.env.REACT_APP_REPORT_URL}/api/GenerarReporte/CFDIViaje/${id}/${idInforme}`;
    let result;
    trackPromise(
        result =  axios.get(url,  { headers })
    );
    return result
}

function obtenerViajesEstatus(idEstatus){
    const url = `${process.env.REACT_APP_REPORT_URL}/api/Viajes/GetListadoEstatus/${idEstatus}`;
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

function cancelarTrayecto(id, params){
    const url = `${process.env.REACT_APP_REPORT_URL}/api/Viajes/cancelarTrayecto/${id}`;
    let result;
    trackPromise(
        result =  axios.post(url, Object.assign({}, {
            usuarioId: localStorage.getItem("UsuarioId"),
            motivo: params.motivo,
            tipo:1,
            fecha:getCurrentDateTime().substr(0, 10),
            hora: getCurrentDateTime().substr(getCurrentDateTime().length - 5)
        }), { headers })
    );
    return result
}

function cancelarViaje(id, params){
    const url = `${process.env.REACT_APP_REPORT_URL}/api/Viajes/CancelarViaje/${id}`;
    let result;
    trackPromise(
        result =  axios.post(url, Object.assign({}, params), { headers })
    );
    return result
}

function validarSalidaParada(id){
    const url = `${process.env.REACT_APP_REPORT_URL}/api/Viajes/paradasTimbradas/${id}`;
    let result;
    trackPromise(
        result =  axios.get(url,  { headers })
    );
    return result
}

function eliminarViaje(idViaje,idEstatus){
    const url = `${process.env.REACT_APP_REPORT_URL}/api/Viajes/Eliminar/${idViaje}/${idEstatus}`
    let result;
    trackPromise(
        result =  axios.put(url, Object.assign({},{}), { headers })
    );
    return result
}

export {
    obtenerViajesByFiltro,
    agregarViaje,
    agregarViajeSalida,
    agregarViajeLlegada,
    obetenerViajeId,
    modificarViaje,
    cancelarTrayecto,
    obtenerViajes,
    obtenerViajesEstatus,
    obtenerXML,
    obtenerCFDI,
    obtenerReporteCFDI,
    obtenerReporteCFDIViaje,
    cancelarViaje,
    validarSalidaParada,
    eliminarViaje,
    validarCFDI
}