import axios from "axios";
import { trackPromise } from "react-promise-tracker";
import { API_HEADERS } from "../../Constants";

const headers = API_HEADERS

function agregarTarifaRangos(params) {
    const url = `${process.env.REACT_APP_REPORT_URL}/api/Tarifas/Rangos/Agregar`;
    let result;
    trackPromise(
        result =  axios.post(url, Object.assign({}, params), { headers })
    );
    return result
}

function modificarTarifaRangos(id,params) {
    const url = `${process.env.REACT_APP_REPORT_URL}/api/Tarifas/Rangos/Modificar/`+ id;
    let result;
    trackPromise(
        result =  axios.put(url, Object.assign({}, params), { headers })
    );
    return result
}

function eliminarTarifaRangos(id) {
    const url = `${process.env.REACT_APP_REPORT_URL}/api/Tarifas/Rangos/Eliminar/`+ id;
    let result;
    trackPromise(
        result =  axios.delete(url, { headers })
    );
    return result
}

function obtenerTarifasRangos() {
    const url = `${process.env.REACT_APP_REPORT_URL}/api/Tarifas/Rangos/GetListado`;
    let result;
    trackPromise(
        result =  axios.get(url, { headers })
    );
    return result
}

function obtenerTarifaRangosById(id) {
    const url = `${process.env.REACT_APP_REPORT_URL}/api/Tarifas/Rangos/GetById/` + id;
    let result;
    trackPromise(
        result =  axios.get(url, { headers })
    );
    return result
}

function obtenerTarifas() {
    const url = `${process.env.REACT_APP_API_URL}/Tarifas/GetListado`;
    let result;
    trackPromise(
        result =  axios.get(url, { headers })
    );
    return result
}

function obtenerTarifasByTipo(idTipotarifa) {
    const url = `${process.env.REACT_APP_API_URL_LOCAL}/api/Tarifas/GetByTipo/` + idTipotarifa;
    let result;
    trackPromise(
        result =  axios.get(url, { headers })
    );
    return result
}

function agregarTarifa(params){
    const url = `${process.env.REACT_APP_API_URL_LOCAL}/api/Tarifas/Agregar`;
    let result;
    trackPromise(
        result =  axios.post(url, Object.assign({}, params), { headers })
    );
    return result
}

function eliminarTarifa(idTarifa, idModificarPor) {
    const url = `${process.env.REACT_APP_API_URL}/Tarifas/Eliminar/` + idTarifa + `/`+ idModificarPor;
    let result;
    trackPromise(
        result =  axios.delete(url, { headers })
    );
    return result
}

function modificarTarifa(id,params) {
    const url = `${process.env.REACT_APP_API_URL_LOCAL}/api/Tarifas/Modificar/`+ id;
    let result;
    trackPromise(
        result =  axios.put(url, Object.assign({}, params), { headers })
    );
    return result
}

function obtenerTarifaBy(id) {
    const url = `${process.env.REACT_APP_API_URL}/Tarifas/GetById/` + id;
    let result;
    trackPromise(
        result =  axios.get(url, { headers })
    );
    return result
}

export {modificarTarifa,eliminarTarifa, obtenerTarifasByTipo,agregarTarifa,obtenerTarifaBy,obtenerTarifas,agregarTarifaRangos,obtenerTarifasRangos,obtenerTarifaRangosById,modificarTarifaRangos,eliminarTarifaRangos}