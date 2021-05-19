import axios from "axios";

const headers = {
    'Content-Type': 'application/json',
    //    'access-control-allow-origin': '*'
}

function modificarPuestos(id, params) {
    const url = `${process.env.REACT_APP_API_URL}/Puesto/Modificar/` + id;
    return axios.put(url, Object.assign({}, params), { headers })
}

function agregarPuestos(params) {
    const url = `${process.env.REACT_APP_API_URL}/Puesto/Agregar`;
    return axios.post(url, Object.assign({}, params), { headers })
}

function eliminarPuestos(id) {
    const url = `${process.env.REACT_APP_API_URL}/Puesto/Eliminar/` + id;
    return axios.delete(url, { headers })
}

function obtenerPuestos() {
    const url = `${process.env.REACT_APP_API_URL}/Puesto/GetListado`;
    return axios.get(url, { headers })
}

function obtenerPuestosId(id) {
    const url = `${process.env.REACT_APP_API_URL}/Puesto/GetById/` + id;
    return axios.get(url, { headers })
}

export { modificarPuestos, agregarPuestos, eliminarPuestos, obtenerPuestosId, obtenerPuestos }