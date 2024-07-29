import axios from "axios";
import { trackPromise } from "react-promise-tracker";
import { API_HEADERS } from "../../Constants";

const headers = API_HEADERS


function modificarRecoleccion(id, params) {
    const url = `${process.env.REACT_APP_REPORT_URL}/api/Recoleccion/Modificar/${id}`;
    let result;
    trackPromise(
        result =  axios.put(url, params, { headers })
        );
    return result
}
function modificarRecoleccionSAT(params) {
    const url = `${process.env.REACT_APP_REPORT_URL}/api/Recoleccion/ModificarSAT`;
    let result;
    trackPromise(
        result =  axios.put(url, Object.assign({}, params), { headers })
        );
    return result
}

function obtenerRecoleccionReporte(id) {
    const url = `${process.env.REACT_APP_REPORT_URL}/api/GenerarReporte/Recoleccion/${id}`;
    let result;
    trackPromise(
        result =  axios.get(url, { headers })
    );
    return result
}


function agregarRecoleccion(params) {
    const url = `${process.env.REACT_APP_REPORT_URL}/api/Recoleccion/Agregar`;
    let result;
    trackPromise(
        result =  axios.post(url, params, { headers })
        );
    return result
}

function cancelarRecoleccion(id, params) {
    const url = `${process.env.REACT_APP_REPORT_URL}/api/Recoleccion/Cancelar/${id}`;
    let result;
    trackPromise(
        result =  axios.put(url, Object.assign({}, params), { headers })
        );
    return result
}
function actualizarCoordenadasRecoleccion(idRecoleccion, latitud, longitud) {
    const url = `${process.env.REACT_APP_REPORT_URL}/api/Recoleccion/ActualizarCoordenadas/${idRecoleccion}/${latitud}/${longitud}`;
    let result;
    trackPromise(
        result =  axios.put(url, Object.assign({}, {}), { headers })
    );
    return result
}

function eliminarRecoleccion(id, idEliminadoPor) {
    const url = `${process.env.REACT_APP_REPORT_URL}/api/Recoleccion/Eliminar/` + id + `/${idEliminadoPor}`;
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
    const url = `${process.env.REACT_APP_REPORT_URL}/api/Recoleccion/GetCancelarById/${id}`;
    let result;
    trackPromise(
        result =  axios.get(url, { headers })
        );
    return result
}

function obtenerRecoleccionId(id) {
    const url = `${process.env.REACT_APP_REPORT_URL}/api/Recoleccion/GetById/${id}`;
    let result;
    trackPromise(
        result =  axios.get(url, { headers })
        );
    return result
}

function obtenerRecoleccionFiltro(fechaInicial, fechaFinal, sucursalListado, estatusListado, folioRecoleccion,Origen,Destino, idCliente) {
    if (folioRecoleccion == ''){
        folioRecoleccion = 0
    }
    const url =
        `${process.env.REACT_APP_REPORT_URL}/api/Recoleccion/GetByFiltro/` +
        fechaInicial +
        "/" +
        fechaFinal +
        "/" +
        sucursalListado +
        "/" +
        estatusListado +
        "/" +
        folioRecoleccion+
        "/" +
        Origen+
        "/" +
        Destino+
        "/" +
        idCliente;
    let result;
    console.log('url filtro: ', url)
    trackPromise(
        result =  axios.get(url, { headers })
        );
    return result
}

export {modificarRecoleccionSAT, actualizarCoordenadasRecoleccion, modificarRecoleccion, agregarRecoleccion, obtenerRecoleccionReporte, eliminarRecoleccion, obtenerRecoleccionId, obtenerRecoleccion, obtenerRecoleccionCancelada, cancelarRecoleccion, obtenerRecoleccionFiltro }