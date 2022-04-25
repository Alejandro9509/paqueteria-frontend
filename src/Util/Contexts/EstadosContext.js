import axios from "axios";
import { trackPromise } from "react-promise-tracker";
import { API_HEADERS } from "../../Constants";

const headers = API_HEADERS


function modificarEstados(id, params) {
    const url = `${process.env.REACT_APP_API_URL}/Estado/Modificar/` + id;
    let result;
    trackPromise(
        result =  axios.put(url, Object.assign({}, params), { headers })
        );
    return result
}

function agregarEstados(params) {
    const url = `${process.env.REACT_APP_API_URL}/Estado/Agregar`;
    let result;
    trackPromise(
        result =  axios.post(url, Object.assign({}, params), { headers })
        );
    return result
}

function eliminarEstados(id) {
    const url = `${process.env.REACT_APP_API_URL}/Estado/Eliminar/` + id;
    let result;
    trackPromise(
        result =  axios.delete(url, { headers })
        );
    return result
}

function obtenerEstados() {
    const url = `${process.env.REACT_APP_API_URL}/Estados/GetListado`;
    let result;
    trackPromise(
        result =  axios.get(url, { headers })
        );
    return result
}

function obtenerEstadosId(id) {
    const url = `${process.env.REACT_APP_API_URL}/Estado/GetById/${id}`;
    let result;
    trackPromise(
        result =  axios.get(url, { headers })
        );
    return result
}
function obtenerEstadosPais(id) {
    const url = `${process.env.REACT_APP_API_URL}/Estados/ByPais/${id}`;
    let result;
    trackPromise(
        result =  axios.get(url, { headers })
        );
    return result
}
function obtenerAllEstados() {
    const url = `${process.env.REACT_APP_REPORT_URL}/api/Estados/GetListado`;
    let result;
    trackPromise(
        result =  axios.get(url, { headers })
        );
    return result
}

export {obtenerAllEstados, modificarEstados, agregarEstados, eliminarEstados, obtenerEstadosId, obtenerEstados, obtenerEstadosPais }