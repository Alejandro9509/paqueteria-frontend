import axios from "axios";
import { trackPromise } from "react-promise-tracker";
import { API_HEADERS } from "../../Constants";

const headers = API_HEADERS


function modificarCorte(id, params) {
    const url = `${process.env.REACT_APP_API_URL}/CorteCaja/Modificar/` + id;
    let result;
    trackPromise(
        result =  axios.put(url, Object.assign({}, params), { headers })
    );
    return result
}

function agregarTarifaRangos(params) {
    const url = `${process.env.REACT_APP_API_URL_LOCAL}/api/Tarifas/Rangos/Agregar`;
    let result;
    trackPromise(
        result =  axios.post(url, Object.assign({}, params), { headers })
    );
    return result
}

function eliminarCorte(id, idEliminadoPor) {
    const url = `${process.env.REACT_APP_API_URL}/CorteCaja/Eliminar/` + id + `/${idEliminadoPor}`;
    let result;
    trackPromise(
        result =  axios.delete(url, { headers })
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
function obtenerTarifasRangos() {
    const url = `${process.env.REACT_APP_API_URL_LOCAL}/api/Tarifas/Rangos/GetListado`;
    let result;
    trackPromise(
        result =  axios.get(url, { headers })
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
function obtenerTarifaRangosBy(id) {
    const url = `${process.env.REACT_APP_API_URL_LOCAL}/api/Tarifas/Rangos/GetById/` + id;
    let result;
    trackPromise(
        result =  axios.get(url, { headers })
    );
    return result
}

export { obtenerTarifaBy,obtenerTarifas,agregarTarifaRangos,obtenerTarifasRangos,obtenerTarifaRangosBy}