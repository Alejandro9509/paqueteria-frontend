import axios from "axios";
import { trackPromise } from "react-promise-tracker";
import { API_HEADERS } from "../../Constants";

const headers = API_HEADERS


function modificarUnidades(id, params) {
    const url =
                `${process.env.REACT_APP_API_URL}/Unidad/Modificar/` + id;
    let result;
    trackPromise(
        result =  axios
                .put(url, Object.assign({}, params), { headers })
        );
    return result
}

function agregarUnidades(params) {
    const url = `${process.env.REACT_APP_API_URL}/Unidad/Agregar`;
    let result;
    trackPromise(
        result =  axios
        .post(url, Object.assign({}, params), { headers })
        );
    return result
}

function eliminarUnidades(id, idEliminadoPor) {
    const url = `${process.env.REACT_APP_API_URL}/Unidad/Eliminar/` + id + `/${idEliminadoPor}`;
    let result;
    trackPromise(
        result =  axios
        .get(url, { headers })
        );
    return result
}
function validaCodigoUnidad(code) {
    const url = `${process.env.REACT_APP_API_URL}/Unidades/ValidaCodigoUnidad/` + code
    let result;
    trackPromise(
        result =  axios.get(url, { headers })
        );
    return result
}


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
function obtenerUnidadesUltimaMilla(id) {
    const url = `${process.env.REACT_APP_REPORT_URL}/api/Unidades/GetListadoUltimaMilla/${id}`;
    let result;
    trackPromise(
        result =  axios.get(url, { headers })
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
    const url = `${process.env.REACT_APP_API_URL}/Unidades/ByTipoUnidad/${id}`;
    let result;
    trackPromise(
        result =  axios.get(url, { headers })
        );
    return result
}

export { obtenerRemolques,cambiarOperadorUnidad, obtenerUnidadesInforme, obtenerUnidadesUltimaMilla, modificarUnidades, agregarUnidades, eliminarUnidades, obtenerUnidadesId, obtenerUnidades, validaCodigoUnidad, obtenerUnidadesTipo, obtenerEstatusUnidadeId }