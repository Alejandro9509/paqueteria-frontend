import axios from "axios";

const headers = {
    'Content-Type': 'application/json',
    //    'access-control-allow-origin': '*'
}

function modificarTipoCambio(id, params) {
    const url = `${process.env.REACT_APP_API_URL}/TipoCambio/Modificar/` + id;
    return axios.put(url, Object.assign({}, params), { headers })
}

function agregarTipoCambio(params) {
    const url = `${process.env.REACT_APP_API_URL}/TipoCambio/Agregar`;
    return axios.post(url, Object.assign({}, params), { headers })
}

function eliminarTipoCambio(id) {
    const url = `${process.env.REACT_APP_API_URL}/TipoCambio/Eliminar/` + id;
    return axios.delete(url, { headers })
}

function obtenerTipoCambio() {
    const url = `${process.env.REACT_APP_API_URL}/TipoCambio/GetListado`;
    return axios.get(url, { headers })
}

function obtenerTipoCambioId(id) {
    const url = `${process.env.REACT_APP_API_URL}/TipoCambio/GetById/${id}`;
    return axios.get(url, { headers })
}

export { modificarTipoCambio, agregarTipoCambio, eliminarTipoCambio, obtenerTipoCambioId, obtenerTipoCambio }