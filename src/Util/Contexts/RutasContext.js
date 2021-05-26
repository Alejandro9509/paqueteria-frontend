import axios from "axios";
import { trackPromise } from "react-promise-tracker";

const headers = {
    'Content-Type': 'application/json',
    //    'access-control-allow-origin': '*'
}

function modificarRutas(id, params) {
    const url = `${process.env.REACT_APP_API_URL}/Rutas/Modificar/${id}`;
    let result;
    trackPromise(
        result =  axios.put(url, Object.assign({}, params), { headers })
        );
    return result
}

function agregarRutas(params) {
    const url = `${process.env.REACT_APP_API_URL}/Rutas/Agregar`;
    let result;
    trackPromise(
        result =  axios.post(url, Object.assign({}, params), { headers })
        );
    return result
}

function eliminarRutas(id) {
    const url = `${process.env.REACT_APP_API_URL}/Rutas/Eliminar/` + id;
    let result;
    trackPromise(
        result =  axios.delete(url, { headers })
        );
    return result
}

function obtenerRutas() {
    const url = `${process.env.REACT_APP_API_URL}/Rutas/GetListado`;
    let result;
    trackPromise(
        result =  axios.get(url, { headers })
        );
    return result
}
function obtenerRutasOrigenes() {
    const url = `${process.env.REACT_APP_API_URL}/Rutas/GetListadoCoordenadas`;
    let result;
    trackPromise(
        result =  axios.get(url, { headers })
        );
    return result
}

function obtenerRutasId(id) {
    const url = `${process.env.REACT_APP_API_URL}/Rutas/GetById/${id}`;
    let result;
    trackPromise(
        result =  axios.get(url, { headers })
        );
    return result
}

export { modificarRutas, agregarRutas, eliminarRutas, obtenerRutasId, obtenerRutas, obtenerRutasOrigenes }