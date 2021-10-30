import axios from "axios";
import { trackPromise } from "react-promise-tracker";
import { API_HEADERS } from "../../Constants";

const headers = API_HEADERS


function modificarTipoViaje(id, params) {
    const url = `${process.env.REACT_APP_API_URL}/TipoViaje/Modificar/` + id;
    let result;
    trackPromise(
        result =  axios.put(url, Object.assign({}, params), { headers })
        );
    return result
}

function agregarTipoViaje(params) {
    const url = `${process.env.REACT_APP_API_URL}/TipoViaje/Agregar`;
    let result;
    trackPromise(
        result =  axios.post(url, Object.assign({}, params), { headers })
        );
    return result
}

function eliminarTipoViaje(id, idEliminadoPor) {
    const url = `${process.env.REACT_APP_API_URL}/TipoViaje/Eliminar/` + id + `/${idEliminadoPor}`;
    let result;
    trackPromise(
        result =  axios.delete(url, { headers })
        );
    return result
}

function obtenerTipoViaje() {
    const url = `${process.env.REACT_APP_API_URL}/TipoViaje/GetListado`;
    let result;
    trackPromise(
        result =  axios.get(url, { headers })
        );
    return result
}

function obtenerTipoViajeId(id) {
    const url = `${process.env.REACT_APP_API_URL}/TipoViaje/GetById/${id}`;
    let result;
    trackPromise(
        result =  axios.get(url, { headers })
        );
    return result
}

export { modificarTipoViaje, agregarTipoViaje, eliminarTipoViaje, obtenerTipoViajeId, obtenerTipoViaje }