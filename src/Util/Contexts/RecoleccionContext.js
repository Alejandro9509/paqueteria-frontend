import axios from "axios";
import { trackPromise } from "react-promise-tracker";

const headers = {
    'Content-Type': 'application/json',
    //    'access-control-allow-origin': '*'
}

function modificarRecoleccion(id, params) {
    const url = `${process.env.REACT_APP_API_URL}/Recoleccion/Modificar/${id}`;
    let result;
    trackPromise(
        result =  axios.put(url, Object.assign({}, params), { headers })
        );
    return result
}

function agregarRecoleccion(params) {
    const url = `${process.env.REACT_APP_API_URL}/Recoleccion/Agregar`;
    let result;
    trackPromise(
        result =  axios.post(url, Object.assign({}, params), { headers })
        );
    return result
}

function cancelarRecoleccion(id, params) {
    const url = `${process.env.REACT_APP_API_URL}/Recoleccion/Cancelar/${id}`;
    let result;
    trackPromise(
        result =  axios.post(url, Object.assign({}, params), { headers })
        );
    return result
}

function eliminarRecoleccion(id, idEliminadoPor) {
    const url = `${process.env.REACT_APP_API_URL}/Recoleccion/Eliminar/` + id + `/${idEliminadoPor}`;
    let result;
    trackPromise(
        result =  axios.delete(url, { headers })
        );
    return result
}

function obtenerRecoleccion() {
    const url = `${process.env.REACT_APP_API_URL}/Recoleccion/GetListado`;
    let result;
    trackPromise(
        result =  axios.get(url, { headers })
        );
    return result
}

function obtenerRecoleccionCancelada(id) {
    const url = `${process.env.REACT_APP_API_URL}/Recoleccion/GetCancelarById/${id}`;
    let result;
    trackPromise(
        result =  axios.get(url, { headers })
        );
    return result
}

function obtenerRecoleccionId(id) {
    const url = `${process.env.REACT_APP_API_URL}/Recoleccion/GetById/${id}`;
    let result;
    trackPromise(
        result =  axios.get(url, { headers })
        );
    return result
}

function obtenerRecoleccionFiltro(fechaInicial, fechaFinal, sucursalListado, estatusListado) {
    const url =
        `${process.env.REACT_APP_API_URL}/Recoleccion/GetByFiltro/` +
        fechaInicial +
        "/" +
        fechaFinal +
        "/" +
        sucursalListado +
        "/" +
        estatusListado;
    let result;
    trackPromise(
        result =  axios.get(url, { headers })
        );
    return result
}

export { modificarRecoleccion, agregarRecoleccion, eliminarRecoleccion, obtenerRecoleccionId, obtenerRecoleccion, obtenerRecoleccionCancelada, cancelarRecoleccion, obtenerRecoleccionFiltro }