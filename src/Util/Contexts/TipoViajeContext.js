import axios from "axios";

const headers = {
    'Content-Type': 'application/json',
    //    'access-control-allow-origin': '*'
}

function modificarTipoViaje(id, params) {
    const url = `${process.env.REACT_APP_API_URL}/TipoViaje/Modificar/` + id;
    return axios.put(url, Object.assign({}, params), { headers })
}

function agregarTipoViaje(params) {
    const url = `${process.env.REACT_APP_API_URL}/TipoViaje/Agregar`;
    return axios.post(url, Object.assign({}, params), { headers })
}

function eliminarTipoViaje(id) {
    const url = `${process.env.REACT_APP_API_URL}/TipoViaje/Eliminar/` + id;
    return axios.delete(url, { headers })
}

function obtenerTipoViaje() {
    const url = `${process.env.REACT_APP_API_URL}/TipoViaje/GetListado`;
    return axios.get(url, { headers })
}

function obtenerTipoViajeId(id) {
    const url = `${process.env.REACT_APP_API_URL}/TipoViaje/GetById/${id}`;
    return axios.get(url, { headers })
}

export { modificarTipoViaje, agregarTipoViaje, eliminarTipoViaje, obtenerTipoViajeId, obtenerTipoViaje }