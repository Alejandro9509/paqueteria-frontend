import axios from "axios";
import { trackPromise } from "react-promise-tracker";

const headers = {
    'Content-Type': 'application/json',
    //    'access-control-allow-origin': '*'
}

function modificarTipoCobro(id, params) {
    const url = `${process.env.REACT_APP_API_URL}/TipoCobro/Modificar/` + id;
    let result;
    trackPromise(
        result =  axios.put(url, Object.assign({}, params), { headers })
        );
    return result
}

function agregarTipoCobro(params) {
    const url = `${process.env.REACT_APP_API_URL}/TipoCobro/Agregar`;
    let result;
    trackPromise(
        result =  axios.post(url, Object.assign({}, params), { headers })
        );
    return result
}

function eliminarTipoCobro(id, idEliminadoPor) {
    const url = `${process.env.REACT_APP_API_URL}/TipoCobro/Eliminar/` + id + `/${idEliminadoPor}`;
    let result;
    trackPromise(
        result =  axios.delete(url, { headers })
        );
    return result
}

function obtenerTipoCobro() {
    const url = `${process.env.REACT_APP_API_URL}/TipoCobro/GetListado`;
    let result;
    trackPromise(
        result =  axios.get(url, { headers })
        );
    return result
}

function obtenerTipoCobroId(id) {
    const url = `${process.env.REACT_APP_API_URL}/TipoCobro/GetTipoCobro/${id}`;
    let result;
    trackPromise(
        result =  axios.get(url, { headers })
        );
    return result
}

export { modificarTipoCobro, agregarTipoCobro, eliminarTipoCobro, obtenerTipoCobroId, obtenerTipoCobro }