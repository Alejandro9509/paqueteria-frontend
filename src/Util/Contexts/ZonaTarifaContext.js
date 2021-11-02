import axios from "axios";
import { trackPromise } from "react-promise-tracker";
import { API_HEADERS } from "../../Constants";

const headers = API_HEADERS


function modificarZonaTarifa(id, params) {
    const url = `${process.env.REACT_APP_API_URL}/ZonaTarifa/Modificar/` + id;
    let result;
    trackPromise(
        result =  axios.put(url, Object.assign({}, params), { headers })
    );
    return result
}

function agregarZonaTarifa(params) {
    const url = `${process.env.REACT_APP_API_URL}/ZonaTarifa/Agregar`;
    let result;
    trackPromise(
        result =  axios.post(url, Object.assign({}, params), { headers })
    );
    return result
}

function eliminarZonaTarifa(id, idEliminadoPor) {
    const url = `${process.env.REACT_APP_API_URL}/ZonaTarifa/Eliminar/` + id;
    let result;
    trackPromise(
        result =  axios.delete(url, { headers })
    );
    return result
}


function obtenerListadoZonaTarifa() {
    const url = `${process.env.REACT_APP_API_URL}/ZonaTarifa/GetListado`;
    let result;
    trackPromise(
        result =  axios.get(url, { headers })
    );
    return result
}

function obtenerByIdZonaTarifa(id) {
    const url = `${process.env.REACT_APP_API_URL}/ZonaTarifa/GetById/` + id;
    let result;
    trackPromise(
        result =  axios.get(url, { headers })
    );
    return result
}
//Se va mandar el codigo postal porque surgio la necesidad
function obtenerZonaTarifaByIdCodigoPostal(id) {
    const url = `${process.env.REACT_APP_API_URL}/ZonaTarifa/GetByIdCodigoPostal/` + id;
    let result;
    trackPromise(
        result =  axios.get(url, { headers })
    );
    return result
}

export {obtenerZonaTarifaByIdCodigoPostal, modificarZonaTarifa, obtenerByIdZonaTarifa, obtenerListadoZonaTarifa, eliminarZonaTarifa, agregarZonaTarifa}