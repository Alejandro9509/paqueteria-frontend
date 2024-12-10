import axios from "axios";
import { trackPromise } from "react-promise-tracker";
import { API_HEADERS } from "../../Constants";

const headers = API_HEADERS


function modificarTipoServicio(id, params) {
    const url = `${process.env.REACT_APP_REPORT_URL}/api/TipoServicio/Modificar/` + id;
    let result;
    trackPromise(
        result =  axios.put(url, Object.assign({}, params), { headers })
        );
    return result
}

function agregarTipoServicio(params) {
    const url = `${process.env.REACT_APP_REPORT_URL}/api/TipoServicio/Agregar`;
    let result;
    trackPromise(
        result =  axios.post(url, Object.assign({}, params), { headers })
        );
    return result
}

function eliminarTipoServicio(id, idEliminadoPor) {
    const url = `${process.env.REACT_APP_REPORT_URL}/api/TipoServicio/Eliminar/` + id + `/${idEliminadoPor}`;
    let result;
    trackPromise(
        result =  axios.delete(url, { headers })
        );
    return result
}

function obtenerTipoServicio() {
    const url = `${process.env.REACT_APP_REPORT_URL}/api/TipoServicio/GetListado`;
    let result;
    trackPromise(
        result =  axios.get(url, { headers })
        );
    return result
}

function obtenerTipoServicioId(id) {
    const url = `${process.env.REACT_APP_REPORT_URL}/api/TipoServicio/GetById/` + id;
    let result;
    trackPromise(
        result =  axios.get(url, { headers })
        );
    return result
}

export {
    modificarTipoServicio,
    agregarTipoServicio,
    eliminarTipoServicio,
    obtenerTipoServicioId,
    obtenerTipoServicio
}