import axios from "axios";
import { trackPromise } from "react-promise-tracker";

const headers = {
    'Content-Type': 'application/json',
    //    'access-control-allow-origin': '*'
}

function modificarTipoCambio(id, params) {
    const url = `${process.env.REACT_APP_API_URL}/TipoCambio/Modificar/` + id;
    let result;
    trackPromise(
        result =  axios.put(url, Object.assign({}, params), { headers })
        );
    return result
}

function agregarTipoCambio(params) {
    const url = `${process.env.REACT_APP_API_URL}/TipoCambio/Agregar`;
    let result;
    trackPromise(
        result =  axios.post(url, Object.assign({}, params), { headers })
        );
    return result
}

function eliminarTipoCambio(id) {
    const url = `${process.env.REACT_APP_API_URL}/TipoCambio/Eliminar/` + id;
    let result;
    trackPromise(
        result =  axios.delete(url, { headers })
        );
    return result
}

function obtenerTipoCambio() {
    const url = `${process.env.REACT_APP_API_URL}/TipoCambio/GetListado`;
    let result;
    trackPromise(
        result =  axios.get(url, { headers })
        );
    return result
}

function obtenerTipoCambioId(id) {
    const url = `${process.env.REACT_APP_API_URL}/TipoCambio/GetById/${id}`;
    let result;
    trackPromise(
        result =  axios.get(url, { headers })
        );
    return result
}

export { modificarTipoCambio, agregarTipoCambio, eliminarTipoCambio, obtenerTipoCambioId, obtenerTipoCambio }