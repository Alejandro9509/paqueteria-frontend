import axios from "axios";

const headers = {
    'Content-Type': 'application/json',
    //    'access-control-allow-origin': '*'
}

function modificarEstados(id, params) {
    const url = `${process.env.REACT_APP_API_URL}/Estado/Modificar/` + id;
    return axios.put(url, Object.assign({}, params), { headers })
}

function agregarEstados(params) {
    const url = `${process.env.REACT_APP_API_URL}/Estado/Agregar`;
    return axios.post(url, Object.assign({}, params), { headers })
}

function eliminarEstados(id) {
    const url = `${process.env.REACT_APP_API_URL}/Estado/Eliminar/` + id;
    return axios.delete(url, { headers })
}

function obtenerEstados() {
    const url = `${process.env.REACT_APP_API_URL}/Estados/GetListado`;
    return axios.get(url, { headers })
}

function obtenerEstadosId(id) {
    const url = `${process.env.REACT_APP_API_URL}/Estado/GetById/${id}`;
    return axios.get(url, { headers })
}
function obtenerEstadosPais(id) {
    const url = `${process.env.REACT_APP_API_URL}/Estados/ByPais/${id}`;
    return axios.get(url, { headers })
}

export { modificarEstados, agregarEstados, eliminarEstados, obtenerEstadosId, obtenerEstados, obtenerEstadosPais }