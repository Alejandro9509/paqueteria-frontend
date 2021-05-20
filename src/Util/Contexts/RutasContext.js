import axios from "axios";

const headers = {
    'Content-Type': 'application/json',
    //    'access-control-allow-origin': '*'
}

function modificarRutas(id, params) {
    const url = `${process.env.REACT_APP_API_URL}/Rutas/Modificar/${id}`;
    return axios.put(url, Object.assign({}, params), { headers })
}

function agregarRutas(params) {
    const url = `${process.env.REACT_APP_API_URL}/Rutas/Agregar`;
    return axios.post(url, Object.assign({}, params), { headers })
}

function eliminarRutas(id) {
    const url = `${process.env.REACT_APP_API_URL}/Rutas/Eliminar/` + id;
    return axios.delete(url, { headers })
}

function obtenerRutas() {
    const url = `${process.env.REACT_APP_API_URL}/Rutas/GetListado`;
    return axios.get(url, { headers })
}
function obtenerRutasOrigenes() {
    const url = `${process.env.REACT_APP_API_URL}/Rutas/GetListadoCoordenadas`;
    return axios.get(url, { headers })
}

function obtenerRutasId(id) {
    const url = `${process.env.REACT_APP_API_URL}/Rutas/GetById/${id}`;
    return axios.get(url, { headers })
}

export { modificarRutas, agregarRutas, eliminarRutas, obtenerRutasId, obtenerRutas, obtenerRutasOrigenes }