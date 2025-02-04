import axios from "axios";
import { trackPromise } from "react-promise-tracker";
import { API_HEADERS } from "../../Constants";

const headers = API_HEADERS


function cancelarInformeCFDI(id, claveSAT,motivoSAT,motivo, sUUIDRelacionado ) {
    const url = `${process.env.REACT_APP_API_URL}/Informes/CancelarCFDITraslada/${id}`;
    let result;
    trackPromise(
        result = axios.post(url,Object.assign({}, {motivoCancelacion: motivo,motivoCancelacionSAT: motivoSAT,claveCancelacionSAT: claveSAT,FolioFiscalUUID: sUUIDRelacionado }), { headers })
    );
    return result
}

function cancelarUltimaMillaCFDI(id, claveSAT,motivoSAT,motivo, sUUIDRelacionado, esRecoleccion) {
    const url = `${process.env.REACT_APP_API_URL}/UltimaMilla/CancelarCFDITraslada/${id}`;
    let result;
    trackPromise(
        result = axios.post(url,Object.assign({}, {motivoCancelacion: motivo,motivoCancelacionSAT: motivoSAT,claveCancelacionSAT: claveSAT,FolioFiscalUUID: sUUIDRelacionado,esRecoleccion: esRecoleccion ? 1 : 0 }), { headers })
    );
    return result
}

function obtenerClavesCancelacionSAT( ) {
    const url = `${localStorage.getItem("Back") ?? process.env.REACT_APP_REPORT_URL}/api/SAT/ObtenerClavesCancelacion`;
    let result;
    trackPromise(
        result = axios.get(url, { headers })
    );
    return result
}

function enviarCorreoCFDIViaje(id, correos, correoDefault, idViaje){
    const url = `${localStorage.getItem("Back") ?? process.env.REACT_APP_REPORT_URL}/api/SAT/${idViaje}/Informe/${id}/EnviarCorreoFactura`;
    let result;
    trackPromise(
        result =  axios.post(url, Object.assign({}, {correos: correos, correoDefault:correoDefault}), { headers })
    );
    return result
}

function enviarCorreoCFDIUltimaMilla(id, correos, correoDefault, esRecoleccion){
    const url = `${localStorage.getItem("Back") ?? process.env.REACT_APP_REPORT_URL}/api/SAT/UltimaMilla/${id}/${esRecoleccion ? 1 : 0}/EnviarCorreoFactura`;
    let result;
    trackPromise(
        result =  axios.post(url, Object.assign({}, {correos: correos, correoDefault:correoDefault}), { headers })
    );
    return result
}

function obtenerClavesByInforme(idInforme) {
    const url = `${localStorage.getItem("Back") ?? process.env.REACT_APP_REPORT_URL}/api/SAT/ObtenerClavesByInforme/${idInforme}`;
    let result;
    trackPromise(
        result = axios.get(url, { headers })
    );
    return result
}

function validarComplementoSat(catalogoSat, claveSat) {
    const url = `${localStorage.getItem("Back") ?? process.env.REACT_APP_REPORT_URL}/api/SAT/ValidarComplemento/${catalogoSat}/${claveSat}`;
    let result;
    trackPromise(
        result = axios.get(url, { headers })
    );
    return result
}

export {
    cancelarInformeCFDI,
    obtenerClavesCancelacionSAT,
    cancelarUltimaMillaCFDI,
    enviarCorreoCFDIViaje,
    enviarCorreoCFDIUltimaMilla,
    obtenerClavesByInforme,
    validarComplementoSat
}