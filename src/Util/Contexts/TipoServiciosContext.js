import axios from "axios";

const headers = {
    'Content-Type': 'application/json',
    //    'access-control-allow-origin': '*'
}

function modificarTipoServicio(id, params) {
    const url = `${process.env.REACT_APP_API_URL}/TipoServicio/Modificar/` + id;
    return axios.put(url, Object.assign({}, params), { headers })
}

function agregarTipoServicio(params) {
    const url = `${process.env.REACT_APP_API_URL}/TipoServicio/Agregar`;
    return axios.post(url, Object.assign({}, params), { headers })
}

function eliminarTipoServicio(id) {
    const url = `${process.env.REACT_APP_API_URL}/TipoServicio/Eliminar/` + id;
    return axios.delete(url, { headers })
}

function obtenerTipoServicio() {
    const url = `${process.env.REACT_APP_API_URL}/TipoServicio/GetListado`;
    return axios.get(url, { headers })
}

function obtenerTipoServicioId(id) {
    const url = `${process.env.REACT_APP_API_URL}/TipoServicio/GetById/` + id;
    return axios.get(url, { headers })
}

export { modificarTipoServicio, agregarTipoServicio, eliminarTipoServicio, obtenerTipoServicioId, obtenerTipoServicio }