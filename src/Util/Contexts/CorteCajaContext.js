import axios from "axios";
import { trackPromise } from "react-promise-tracker";
import { API_HEADERS } from "../../Constants";

const headers = API_HEADERS


function modificarCorte(id, params) {
    const url = `${process.env.REACT_APP_API_URL}/CorteCaja/Modificar/` + id;
    let result;
    trackPromise(
        result =  axios.put(url, Object.assign({}, params), { headers }), "progress"
    );
    return result
}

function agregarCorte(params) {
    const url = `${process.env.REACT_APP_API_URL}/CorteCaja/Agregar`;
    let result;
    trackPromise(
        result =  axios.post(url, Object.assign({}, params), { headers }), "progress"
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


function obtenerCortes() {
    const url = `${process.env.REACT_APP_API_URL}/CorteCaja/GetListado`;
    let result;
    trackPromise(
        result =  axios.get(url, { headers })
    );
    return result
}

function obtenerCorteId(id) {
    const url = `${process.env.REACT_APP_API_URL}/CorteCaja/GetById/` + id;
    let result;
    trackPromise(
        result =  axios.get(url, { headers })
    );
    return result
}

function obtenerCortesByFiltros(fecha, idSucursal) {
    const url = `${process.env.REACT_APP_API_URL}/CorteCaja/GetListadoByFiltros/` + fecha +`/` + idSucursal;
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
function obtenerCortesResumenReporte(idDestino, fecha) {
    const url = `${process.env.REACT_APP_REPORT_URL}/api/GenerarReporte/CorteCajaResumen/${idDestino}/${fecha}`;
    let result;
    trackPromise(
        result =  axios.get(url, { headers })
    );
    return result
}

export { obtenerCorteReporte,obtenerCortesResumenReporte,obtenerCortesByFiltros,modificarCorte, obtenerCorteId, obtenerCortes, eliminarCorte, agregarCorte}