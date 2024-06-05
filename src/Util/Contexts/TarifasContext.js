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
const obtenerTarifasRangosFiltro =(folioTarifas) =>{

    if (typeof folioTarifas == "undefined" || folioTarifas == ''){

        folioTarifas = 0
    }
    const url =`${process.env.REACT_APP_REPORT_URL}/api/Tarifas/Rangos/GetByFiltro/` +folioTarifas

    let result;
    trackPromise(
        result =  axios.get(url, { headers })
    );
    console.log(result)
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
function obtenerTarifaGeneral() {
    const url = `${process.env.REACT_APP_REPORT_URL}/api/Tarifas/Rangos/GetGeneral`;
    let result;
    trackPromise(
        result =  axios.get(url, { headers })
    );
    return result
}

function obtenerTarifasByTipo(idTipotarifa) {
    const url = `${process.env.REACT_APP_REPORT_URL}/api/Tarifas/GetByTipo/` + idTipotarifa;
    let result;
    trackPromise(
        result =  axios.get(url, { headers })
    );
    return result
}

function agregarTarifa(params){
    const url = `${process.env.REACT_APP_REPORT_URL}/api/Tarifas/Agregar`;
    let result;
    trackPromise(
        result =  axios.post(url, Object.assign({}, params), { headers })
    );
    return result
}

function eliminarTarifa(idTarifa, idModificarPor) {
    const url = `${process.env.REACT_APP_REPORT_URL}/api/Tarifas/Eliminar/` + idTarifa + `/`+ idModificarPor;
    let result;
    trackPromise(
        result =  axios.delete(url, { headers })
    );
    return result
}

function modificarTarifa(id,params) {
    const url = `${process.env.REACT_APP_REPORT_URL}/api/Tarifas/Modificar/`+ id;
    let result;
    trackPromise(
        result =  axios.put(url, Object.assign({}, params), { headers })
    );
    return result
}

function obtenerTarifaBy(id) {
    const url = `${process.env.REACT_APP_REPORT_URL}/api/Tarifas/GetById/` + id;
    let result;
    trackPromise(
        result =  axios.get(url, { headers })
    );
    return result
}

export {modificarTarifa,obtenerTarifaGeneral,eliminarTarifa,obtenerTarifasRangosFiltro,obtenerTarifasByTipo,agregarTarifa,obtenerTarifaBy,agregarTarifaRangos,obtenerTarifasRangos,obtenerTarifaRangosById,modificarTarifaRangos,eliminarTarifaRangos}