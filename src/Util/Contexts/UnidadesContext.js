import axios from "axios";
import { trackPromise } from "react-promise-tracker";
import { API_HEADERS } from "../../Constants";

const headers = API_HEADERS


function obtenerUnidades() {
    const url = `${process.env.REACT_APP_REPORT_URL}/api/Unidades/GetListado`;
    let result;
    trackPromise(
        result =  axios.get(url, { headers })
    );
    return result
}

function obtenerRemolques() {
    const url = `${process.env.REACT_APP_REPORT_URL}/api/Unidades/GetListadoRemolques`;
    let result;
    trackPromise(
        result =  axios.get(url, { headers })
    );
    return result
}

function obtenerUnidadesInforme() {
    const url = `${process.env.REACT_APP_REPORT_URL}/api/Unidades/GetListadoInformes`;
    let result;
    trackPromise(
        result =  axios.get(url, { headers })
    );
    return result
}

function obtenerUnidadesUltimaMilla(id, params) {
    const url = `${process.env.REACT_APP_REPORT_URL}/api/Unidades/GetListadoUltimaMilla/${id}`;
    let result;
    trackPromise(
        result =  axios.post(url, params, { headers })
    );
    return result
}

function obtenerUnidadesId(id) {
    const url = `${process.env.REACT_APP_API_URL}/Unidad/GetById/` + id;
    let result;
    trackPromise(
        result =  axios.get(url, { headers })
    );
    return result
}

function obtenerEstatusUnidadeId(id) {
    const url = `${process.env.REACT_APP_REPORT_URL}/api/InventarioUnidades/GetByIdUnidad/` + id;
    let result;
    trackPromise(
        result =  axios.get(url, { headers })
    );
    return result
}

function cambiarOperadorUnidad(idOperador, idUnidad) {
    const url = `${process.env.REACT_APP_API_URL}/Unidad/AsignarOperador/${idUnidad}/${idOperador}`;
    let result;
    trackPromise(
        result =  axios.put(url, {}, { headers })
    );
    return result
}

function obtenerUnidadesTipo(id) {
    const url = `${process.env.REACT_APP_REPORT_URL}/api/Unidades/ByTipoUnidad/${id}`;
    let result;
    trackPromise(
        result =  axios.get(url, { headers })
    );
    return result
}

function obtenerUnidadesOperador(id) {
    const url = `${process.env.REACT_APP_REPORT_URL}/api/Unidades/ByOperador/${id}`;
    let result;
    trackPromise(
        result =  axios.get(url, { headers })
    );
    return result
}

function obtenerUnidadesConvoy(id) {
    const url = `${process.env.REACT_APP_REPORT_URL}/api/Unidades/ByConvoy/${id}`;
    let result;
    trackPromise(
        result =  axios.get(url, { headers })
    );
    return result
}

export {
    obtenerRemolques,
    cambiarOperadorUnidad,
    obtenerUnidadesInforme,
    obtenerUnidadesUltimaMilla,
    obtenerUnidadesId,
    obtenerUnidades,
    obtenerUnidadesTipo,
    obtenerEstatusUnidadeId,
    obtenerUnidadesOperador,
    obtenerUnidadesConvoy
}