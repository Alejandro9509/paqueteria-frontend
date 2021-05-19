import axios from "axios";

const headers = {
    'Content-Type': 'application/json',
    //    'access-control-allow-origin': '*'
}

function modificarPaises(id, params) {
    const url = `${process.env.REACT_APP_API_URL}/Pais/Modificar/` + id;
    return axios.put(url, Object.assign({}, params), { headers })
}

function agregarPaises(params) {
    const url = `${process.env.REACT_APP_API_URL}/Pais/Agregar`;
    return axios.post(url, Object.assign({}, params), { headers })
}

function eliminarPaises(id) {
    const url = `${process.env.REACT_APP_API_URL}/Pais/Eliminar/` + id;
    return axios.delete(url, { headers })
}

function obtenerPaises() {
    const url = `${process.env.REACT_APP_API_URL}/Pais/GetListado`;
    return axios.get(url, { headers })
}

function obtenerPaisesId(id) {
    const url = `${process.env.REACT_APP_API_URL}/Pais/ById/${id}`;
    return axios.get(url, { headers })
}

export { modificarPaises, agregarPaises, eliminarPaises, obtenerPaisesId, obtenerPaises }