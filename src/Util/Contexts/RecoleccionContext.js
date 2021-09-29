import axios from "axios";
import { trackPromise } from "react-promise-tracker";

const headers = {
    'Content-Type': 'application/json',
    //'TimeZone' : Intl.DateTimeFormat().resolvedOptions().timeZone
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
        result =  axios.put(url, Object.assign({}, params), { headers })
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

function obtenerRecoleccionFiltro(fechaInicial, fechaFinal, sucursalListado, estatusListado, folioRecoleccion) {
    if (folioRecoleccion == ''){
        folioRecoleccion = 0
    }
    const url =
        `${process.env.REACT_APP_API_URL}/Recoleccion/GetByFiltro/` +
        fechaInicial +
        "/" +
        fechaFinal +
        "/" +
        sucursalListado +
        "/" +
        estatusListado +
        "/" +
        folioRecoleccion;
    let result;
    console.log('url filtro: ', url)
    trackPromise(
        result =  axios.get(url, { headers })
        );
    return result
}

export { modificarRecoleccion, agregarRecoleccion, eliminarRecoleccion, obtenerRecoleccionId, obtenerRecoleccion, obtenerRecoleccionCancelada, cancelarRecoleccion, obtenerRecoleccionFiltro }