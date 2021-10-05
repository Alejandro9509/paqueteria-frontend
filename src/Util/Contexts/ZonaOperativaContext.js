import axios from "axios";
import { trackPromise } from "react-promise-tracker";

const headers = {
    'Content-Type': 'application/json',
    //    'access-control-allow-origin': '*'
}

function modificarZonaOperativa(id, params) {
    const url = `${process.env.REACT_APP_API_URL}/ZonaOperativa/Modificar/` + id;
    let result;
    trackPromise(
        result =  axios.put(url, Object.assign({}, params), { headers })
    );
    return result
}

function agregarZonaOperativa(params) {
    const url = `${process.env.REACT_APP_API_URL}/ZonaOperativa/Agregar`;
    let result;
    trackPromise(
        result =  axios.post(url, Object.assign({}, params), { headers })
    );
    return result
}

function eliminarZonaOperativa(id, idEliminadoPor) {
    const url = `${process.env.REACT_APP_API_URL}/ZonaOperativa/Eliminar/` + id;
    let result;
    trackPromise(
        result =  axios.delete(url, { headers })
    );
    return result
}


function obtenerListadoZonaOperativa() {
    const url = `${process.env.REACT_APP_API_URL}/ZonaOperativa/GetListado`;
    let result;
    trackPromise(
        result =  axios.get(url, { headers })
    );
    return result
}
function obtenerListadoZonaOperativaBySucursal(id) {
    const url = `${process.env.REACT_APP_API_URL}/ZonaOperativa/GetListadoBySucursal/${id}`;
    let result;
    trackPromise(
        result =  axios.get(url, { headers })
    );
    return result
}

function obtenerByIdZonaOperativa(id) {
    const url = `${process.env.REACT_APP_API_URL}/ZonaOperativa/GetById/` + id;
    let result;
    trackPromise(
        result =  axios.get(url, { headers })
    );
    return result
}
//Se va mandar el codigo postal porque surgio la necesidad
function obtenerZonaOperativaByIdCodigoPostal(id) {
    const url = `${process.env.REACT_APP_API_URL}/ZonaOperativa/GetByIdCodigoPostal/` + id;
    let result;
    trackPromise(
        result =  axios.get(url, { headers })
    );
    return result
}

export {obtenerZonaOperativaByIdCodigoPostal, modificarZonaOperativa, obtenerByIdZonaOperativa, obtenerListadoZonaOperativa, eliminarZonaOperativa, agregarZonaOperativa, obtenerListadoZonaOperativaBySucursal}