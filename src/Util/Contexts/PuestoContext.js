import axios from "axios";
import { trackPromise } from "react-promise-tracker";

const headers = {
    'Content-Type': 'application/json',
    //    'access-control-allow-origin': '*'
}

function modificarPuestos(id, params) {
    const url = `${process.env.REACT_APP_API_URL}/Puesto/Modificar/` + id;
    let result;
    trackPromise(
        result =  axios.put(url, Object.assign({}, params), { headers })
        );
    return result
}

function agregarPuestos(params) {
    const url = `${process.env.REACT_APP_API_URL}/Puesto/Agregar`;
    let result;
    trackPromise(
        result =  axios.post(url, Object.assign({}, params), { headers })
        );
    return result
}

function eliminarPuestos(id) {
    const url = `${process.env.REACT_APP_API_URL}/Puesto/Eliminar/` + id;
    let result;
    trackPromise(
        result =  axios.delete(url, { headers })
        );
    return result
}

function obtenerPuestos() {
    const url = `${process.env.REACT_APP_API_URL}/Puesto/GetListado`;
    let result;
    trackPromise(
        result =  axios.get(url, { headers })
        );
    return result
}

function obtenerPuestosId(id) {
    const url = `${process.env.REACT_APP_API_URL}/Puesto/GetById/` + id;
    let result;
    trackPromise(
        result =  axios.get(url, { headers })
        );
    return result
}

export { modificarPuestos, agregarPuestos, eliminarPuestos, obtenerPuestosId, obtenerPuestos }