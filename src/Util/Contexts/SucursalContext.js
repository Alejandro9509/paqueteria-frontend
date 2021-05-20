import axios from "axios";

const headers = {
    'Content-Type': 'application/json',
    //    'access-control-allow-origin': '*'
}

function modificarSucursales(id, params) {
    const url = `${process.env.REACT_APP_API_URL}/Sucursales/Modificar/` + id;
    return axios.put(url, Object.assign({}, params), { headers })
}

function agregarSucursales(params) {
    const url = `${process.env.REACT_APP_API_URL}/Sucursales/Agregar`;
    return axios.post(url, Object.assign({}, params), { headers })
}

function eliminarSucursales(id) {
    const url = `${process.env.REACT_APP_API_URL}/Sucursales/Eliminar/` + id;
    return axios.delete(url, { headers })
}

function obtenerSucursales() {
    const url = `${process.env.REACT_APP_API_URL}/Sucursales/GetListado`;
    return axios.get(url, { headers })
}

function obtenerSucursalesId(id) {
    const url = `${process.env.REACT_APP_API_URL}/Sucursales/GetById/` + id;
    return axios.get(url, { headers })
}

export { modificarSucursales, agregarSucursales, eliminarSucursales, obtenerSucursalesId, obtenerSucursales }