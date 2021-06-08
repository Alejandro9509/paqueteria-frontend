import axios from "axios";
import { trackPromise } from "react-promise-tracker";

const headers = {
    'Content-Type': 'application/json',
    //    'access-control-allow-origin': '*'
}

function modificarPaises(id, params) {
    const url = `${process.env.REACT_APP_API_URL}/Pais/Modificar/` + id;
    let result;
    trackPromise(
        result =  axios.put(url, Object.assign({}, params), { headers })
        );
    return result
}

function agregarPaises(params) {
    const url = `${process.env.REACT_APP_API_URL}/Pais/Agregar`;
    let result;
    trackPromise(
        result =  axios.post(url, Object.assign({}, params), { headers })
        );
    return result
}

function eliminarPaises(id, idEliminadoPor) {
    const url = `${process.env.REACT_APP_API_URL}/Pais/Eliminar/` + id + `/${idEliminadoPor}`;
    let result;
    trackPromise(
        result =  axios.delete(url, { headers })
        );
    return result
}

function obtenerPaises() {
    const url = `${process.env.REACT_APP_API_URL}/Pais/GetListado`;
    let result;
    trackPromise(
        result =  axios.get(url, { headers })
        );
    return result
}

function obtenerPaisesId(id) {
    const url = `${process.env.REACT_APP_API_URL}/Pais/ById/${id}`;
    let result;
    trackPromise(
        result =  axios.get(url, { headers })
        );
    return result
}

export { modificarPaises, agregarPaises, eliminarPaises, obtenerPaisesId, obtenerPaises }