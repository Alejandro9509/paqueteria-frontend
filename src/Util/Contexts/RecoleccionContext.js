import axios from "axios";

const headers = {
    'Content-Type': 'application/json',
    //    'access-control-allow-origin': '*'
}

function modificarRecoleccion(id, params) {
    const url = `${process.env.REACT_APP_API_URL}/Recoleccion/Modificar/${id}`;
    return axios.put(url, Object.assign({}, params), { headers })
}

function agregarRecoleccion(params) {
    const url = `${process.env.REACT_APP_API_URL}/Recoleccion/Agregar`;
    return axios.post(url, Object.assign({}, params), { headers })
}

function cancelarRecoleccion(id, params) {
    const url = `${process.env.REACT_APP_API_URL}/Recoleccion/Agregar`;
    return axios.post(url, Object.assign({}, params), { headers })
}

function eliminarRecoleccion(id) {
    const url = `${process.env.REACT_APP_API_URL}/Recoleccion/Eliminar/` + id;
    return axios.delete(url, { headers })
}

function obtenerRecoleccion() {
    const url = `${process.env.REACT_APP_API_URL}/Puesto/GetListado`;
    return axios.get(url, { headers })
}

function obtenerRecoleccionCancelada(id) {
    const url = `${process.env.REACT_APP_API_URL}/Recoleccion/GetCancelarById/${id}`;
    return axios.get(url, { headers })
}

function obtenerRecoleccionId(id) {
    const url = `${process.env.REACT_APP_API_URL}/Recoleccion/GetById/${id}`;
    return axios.get(url, { headers })
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
    return axios.get(url, { headers })
}

export { modificarRecoleccion, agregarRecoleccion, eliminarRecoleccion, obtenerRecoleccionId, obtenerRecoleccion, obtenerRecoleccionCancelada, cancelarRecoleccion, obtenerRecoleccionFiltro }