import axios from "axios";
import { trackPromise } from "react-promise-tracker";
import { API_HEADERS } from "../../Constants";
const headers = API_HEADERS


function modificarTipoCobro(id, params) {
    const url = `${localStorage.getItem("Back") ?? process.env.REACT_APP_REPORT_URL}/api/TipoCobro/Modificar/` + id;
    let result;
    trackPromise(
        result =  axios.put(url, Object.assign({}, params), { headers })
        );
    return result
}

function agregarTipoCobro(params) {
    const url = `${localStorage.getItem("Back") ?? process.env.REACT_APP_REPORT_URL}/api/TipoCobro/Agregar`;
    let result;
    trackPromise(
        result =  axios.post(url, Object.assign({}, params), { headers })
        );
    return result
}

function eliminarTipoCobro(id, idEliminadoPor) {
    const url = `${localStorage.getItem("Back") ?? process.env.REACT_APP_REPORT_URL}/api/TipoCobro/Eliminar/` + id;
    let result;
    trackPromise(
        result =  axios.delete(url, { headers })
        );
    return result
}

function obtenerTipoCobro() {
    const url = `${localStorage.getItem("Back") ?? process.env.REACT_APP_REPORT_URL}/api/TipoCobro/GetListado`;
    let result;
    trackPromise(
        result =  axios.get(url, { headers })
        );
    return result
}

function obtenerTipoCobroId(id) {
    const url = `${localStorage.getItem("Back") ?? process.env.REACT_APP_REPORT_URL}/api/TipoCobro/GetTipoCobro/${id}`;
    let result;
    trackPromise(
        result =  axios.get(url, { headers })
        );
    return result
}

export {
    modificarTipoCobro,
    agregarTipoCobro,
    eliminarTipoCobro,
    obtenerTipoCobroId,
    obtenerTipoCobro
}