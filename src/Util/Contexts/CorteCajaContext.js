import axios from "axios";
import { trackPromise } from "react-promise-tracker";
import { API_HEADERS } from "../../Constants";

const headers = API_HEADERS


function modificarCorte(id, params) {
    const url = `${process.env.REACT_APP_REPORT_URL}/api/CorteCaja/Modificar/` + id;
    let result;
    trackPromise(
        result =  axios.put(url, Object.assign({}, params), { headers })
    );
    return result
}

function agregarCorte(params) {
    const url = `${process.env.REACT_APP_REPORT_URL}/api/CorteCaja/Agregar`;
    let result;
    trackPromise(
        result =  axios.post(url, Object.assign({}, params), { headers })
    );
    return result
}

function eliminarCorte(id, idEliminadoPor) {
    const url = `${process.env.REACT_APP_REPORT_URL}/api/CorteCaja/Eliminar/` + id;
    let result;
    trackPromise(
        result =  axios.delete(url, { headers })
    );
    return result
}


function obtenerCortes() {
    const url = `${process.env.REACT_APP_REPORT_URL}/api/CorteCaja/GetListado`;
    let result;
    trackPromise(
        result =  axios.get(url, { headers })
    );
    return result
}

function obtenerCorteId(id) {
    const url = `${process.env.REACT_APP_REPORT_URL}/api/CorteCaja/GetById/` + id;
    let result;
    trackPromise(
        result =  axios.get(url, { headers })
    );
    return result
}

function obtenerCortesByFiltros(fecha, idOperador, idUsuario) {
    const url = `${process.env.REACT_APP_REPORT_URL}/api/CorteCaja/GetListadoByFiltros/` + fecha +`/` + idOperador +`/` + idUsuario;
    let result;
    trackPromise(
        result =  axios.get(url, { headers })
    );
    return result
}
function obtenerCorteReporte(id) {
    const url = `${process.env.REACT_APP_REPORT_URL}/api/GenerarReporte/CorteCaja/${id}`;
    let result;
    trackPromise(
        result =  axios.get(url, { headers })
    );
    return result
}
function obtenerCortesGeneralReporte(fecha) {
    const url = `${process.env.REACT_APP_REPORT_URL}/api/GenerarReporte/CorteCaja/General/${fecha}`;
    let result;
    trackPromise(
        result =  axios.get(url, { headers })
    );
    return result
}

export {
    obtenerCorteReporte,
    obtenerCortesGeneralReporte,
    obtenerCortesByFiltros,
    modificarCorte,
    obtenerCorteId,
    obtenerCortes,
    eliminarCorte,
    agregarCorte
}