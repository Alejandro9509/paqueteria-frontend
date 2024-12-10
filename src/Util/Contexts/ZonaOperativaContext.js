import axios from "axios";
import { trackPromise } from "react-promise-tracker";
import { API_HEADERS } from "../../Constants";

const headers = API_HEADERS


function modificarZonaOperativa(id, params) {
    const url = `${process.env.REACT_APP_REPORT_URL}/api/ZonaOperativa/Modificar/` + id;
    let result;
    trackPromise(
        result =  axios.put(url, Object.assign({}, params), { headers })
    );
    return result
}

function agregarZonaOperativa(params) {
    const url = `${process.env.REACT_APP_REPORT_URL}/api/ZonaOperativa/Agregar`;
    let result;
    trackPromise(
        result =  axios.post(url, Object.assign({}, params), { headers })
    );
    return result
}

function eliminarZonaOperativa(id, idEliminadoPor) {
    const url = `${process.env.REACT_APP_REPORT_URL}/api/ZonaOperativa/Eliminar/` + id;
    let result;
    trackPromise(
        result =  axios.delete(url, { headers })
    );
    return result
}

function obtenerListadoZonaOperativa() {
    const url = `${process.env.REACT_APP_REPORT_URL}/api/ZonaOperativa/GetListado`;
    let result;
    trackPromise(
        result =  axios.get(url, { headers })
    );
    return result
}

function obtenerListadoZonaOperativaBySucursal(id) {
    const url = `${process.env.REACT_APP_REPORT_URL}/api/ZonaOperativa/GetListadoBySucursal/${id}`;
    let result;
    trackPromise(
        result =  axios.get(url, { headers })
    );
    return result
}

function obtenerListadoZonaOperativaByOrigenDestino(id) {
    const url = `${process.env.REACT_APP_REPORT_URL}/api/ZonaOperativa/GetByIdOrigenDestino/${id}`;
    let result;
    trackPromise(
        result =  axios.get(url, { headers })
    );
    return result
}

function obtenerByIdZonaOperativa(id) {
    const url = `${process.env.REACT_APP_REPORT_URL}/api/ZonaOperativa/GetById/` + id;
    let result;
    trackPromise(
        result =  axios.get(url, { headers })
    );
    return result
}

//Se va mandar el codigo postal porque surgio la necesidad
function obtenerZonaOperativaByIdCodigoPostal(id) {
    const url = `${process.env.REACT_APP_REPORT_URL}/api/ZonaOperativa/GetByIdCodigoPostal/` + id;
    let result;
    trackPromise(
        result =  axios.get(url, { headers })
    );
    return result
}

function obtenerParametrosDestino(idGuia) {
    const url = `${process.env.REACT_APP_REPORT_URL}/api/ZonaOperativa/GetDatosUbicacionDestinatario/` + idGuia;
    let result;
    trackPromise(
        result =  axios.get(url, { headers })
    );
    return result
}

function obtenerColoniasCPs() {
    const url = `${process.env.REACT_APP_REPORT_URL}/api/ZonaOperativa/GetColoniasCPs`;
    let result;
    trackPromise(
        result =  axios.get(url, { headers })
    );
    return result
}

function obtenerZonaOperativaByCodigoPostal(cp) {
    const url = `${process.env.REACT_APP_REPORT_URL}/api/ZonaOperativa/GetByCodigoPostal/` + cp;
    let result;
    trackPromise(
        result =  axios.get(url, { headers })
    );
    return result
}

export {
    obtenerZonaOperativaByCodigoPostal,
    obtenerColoniasCPs,
    obtenerParametrosDestino,
    obtenerZonaOperativaByIdCodigoPostal,
    modificarZonaOperativa,
    obtenerByIdZonaOperativa,
    obtenerListadoZonaOperativa,
    eliminarZonaOperativa,
    agregarZonaOperativa,
    obtenerListadoZonaOperativaBySucursal,
    obtenerListadoZonaOperativaByOrigenDestino
}