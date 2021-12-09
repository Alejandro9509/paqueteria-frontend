import axios from "axios";
import { trackPromise } from "react-promise-tracker";
import { API_HEADERS } from "../../Constants";

const headers = API_HEADERS

function modificarOperadores(id, params) {
    const url =
        `${process.env.REACT_APP_API_URL}/Operador/Modificar/` +
        id;
    let result;
    trackPromise(
        result =  axios
        .put(url, Object.assign({}, params), { headers })
        );
    return result
}

function agregarOperadores(params) {
    const url = `${process.env.REACT_APP_API_URL}/Operador/Agregar`;
    let result;
    trackPromise(
        result =  axios
        .post(url, Object.assign({}, params), { headers })
        );
    return result
}

function eliminarOperadores(id, idEliminadoPor) {
    const url = `${process.env.REACT_APP_API_URL}/Operador/Eliminar/` + id +`/${idEliminadoPor}`;
    let result;
    trackPromise(
        result =  axios.get(url, { headers })
        );
    return result
}

function obtenerOperadores() {
    const url = `${process.env.REACT_APP_REPORT_URL}/api/Operadores/GetListado`;
    let result;
    trackPromise(
        result =  axios.get(url, { headers })
        );
    return result
}

function validarNumeroOperadores(id) {
    const url = `${process.env.REACT_APP_API_URL}/Operadores/ValidaNumeroOperador/` + id;
    let result;
    trackPromise(
        result =  axios.get(url, { headers })
        );
    return result
}

function obtenerOperadoresId(id) {
    const url =
            `${process.env.REACT_APP_API_URL}/Operador/GetById/` +
            id;
    let result;
    trackPromise(
        result =  axios.get(url, { headers })
        );
    return result
}

export { modificarOperadores, agregarOperadores, eliminarOperadores, obtenerOperadoresId, obtenerOperadores, validarNumeroOperadores }