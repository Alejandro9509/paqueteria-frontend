import axios from "axios";

const headers = {
    'Content-Type': 'application/json',
    //    'access-control-allow-origin': '*'
}

function modificarTipoCobro(id, params) {
    const url = `${process.env.REACT_APP_API_URL}/TipoCobro/Modificar/` + id;
    return axios.put(url, Object.assign({}, params), { headers })
}

function agregarTipoCobro(params) {
    const url = `${process.env.REACT_APP_API_URL}/TipoCobro/Agregar`;
    return axios.post(url, Object.assign({}, params), { headers })
}

function eliminarTipoCobro(id) {
    const url = `${process.env.REACT_APP_API_URL}/TipoCobro/Eliminar/` + id;
    return axios.delete(url, { headers })
}

function obtenerTipoCobro() {
    const url = `${process.env.REACT_APP_API_URL}/TipoCobro/GetListado`;
    return axios.get(url, { headers })
}

function obtenerTipoCobroId(id) {
    const url = `${process.env.REACT_APP_API_URL}/TipoCobro/GetTipoCobro/${id}`;
    return axios.get(url, { headers })
}

export { modificarTipoCobro, agregarTipoCobro, eliminarTipoCobro, obtenerTipoCobroId, obtenerTipoCobro }