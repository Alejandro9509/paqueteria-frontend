import axios from "axios";
import { trackPromise } from "react-promise-tracker";
import { API_HEADERS } from "../../Constants";

const headers = API_HEADERS


function obtenerRutas() {
    const url = `${process.env.REACT_APP_API_URL}/Rutas/GetListado`;
    let result;
    trackPromise(
        result = axios.get(url, { headers })
    );
    return result
}

function obtenerRutasId(id) {
    const url = `${localStorage.getItem("Back") ?? process.env.REACT_APP_REPORT_URL}/api/Rutas/GetById/${id}`;
    let result;
    trackPromise(
        result = axios.get(url, { headers })
    );
    return result
}

function obtenerRutasByOrigenDestinoCliente(idCliente, idOrigen, idDestino) {
    const url = `${localStorage.getItem("Back") ?? process.env.REACT_APP_REPORT_URL}/api/Rutas/GetByIdClienteOrigenDestino/${idCliente}/${idOrigen}/${idDestino}`;
    let result;
    trackPromise(
        result = axios.get(url, { headers })
    );
    return result
}

function obtenerRutasByOrigenDestinoPublicoGeneral(idOrigen, idDestino) {
    const url = `${localStorage.getItem("Back") ?? process.env.REACT_APP_REPORT_URL}/api/Rutas/GetByOrigenDestino/${idOrigen}/${idDestino}`;
    let result;
    trackPromise(
        result = axios.get(url, { headers })
    );
    return result
}

function obtenerTrayectosByRuta(idRuta) {
    const url = `${localStorage.getItem("Back") ?? process.env.REACT_APP_REPORT_URL}/api/Rutas/GetTrayectosRuta/${idRuta}`;
    let result;
    trackPromise(
        result = axios.get(url, { headers })
    );
    return result
}

export {
    obtenerRutasId,
    obtenerRutas,
    obtenerRutasByOrigenDestinoCliente,
    obtenerTrayectosByRuta,
    obtenerRutasByOrigenDestinoPublicoGeneral
}