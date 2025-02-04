import axios from "axios";
import { trackPromise } from "react-promise-tracker";
import { API_HEADERS } from "../../Constants";

const headers = API_HEADERS;


function modificarInformes(id, params) {
    const url = `${localStorage.getItem("Back") ?? process.env.REACT_APP_REPORT_URL}/api/Informes/Modificar`;
    let result;
    trackPromise(
        (result = axios.put(url, Object.assign({}, params), { headers }))
    );
    return result;
}

function obtenerXMLCFDI(id) {
    const url = `${process.env.REACT_APP_API_URL}/Informes/GetXMLCFDI/${id}`;
    let result;
    trackPromise((result = axios.get(url, { headers })));
    return result;
}

function obtenerInformeReporte(id) {
    const url = `${localStorage.getItem("Back") ?? process.env.REACT_APP_REPORT_URL}/api/GenerarReporte/Informe/${id}`;
    let result;
    trackPromise((result = axios.get(url, { headers })));
    return result;
}

function cancelarInformes(id, params) {
    const url = `${localStorage.getItem("Back") ?? process.env.REACT_APP_REPORT_URL}/api/Informes/Cancelar/${id}`;
    let result;
    trackPromise(
        (result = axios.put(url, Object.assign({}, params), { headers }))
    );
    return result;
}

function agregarInformes(params) {
    const url = `${localStorage.getItem("Back") ?? process.env.REACT_APP_REPORT_URL}/api/Informes/Agregar`;
    let result;
    trackPromise(
        (result = axios.post(url, Object.assign({}, params), { headers }))
    );
    return result;
}

function eliminarInformes(id, idEliminadoPor) {
    const url =
        `${localStorage.getItem("Back") ?? process.env.REACT_APP_REPORT_URL}/api/Informes/Eliminar/` +
        id +
        `/${idEliminadoPor}`;
    let result;
    trackPromise((result = axios.delete(url, { headers })));
    return result;
}

function obtenerInformes() {
    const url = `${localStorage.getItem("Back") ?? process.env.REACT_APP_REPORT_URL}/api/Informes/GetListadoSinViajes`;
    let result;
    trackPromise((result = axios.get(url, { headers })));
    return result;
}

function obtenerInformesEstatus(idEstatus) {
    const url = `${localStorage.getItem("Back") ?? process.env.REACT_APP_REPORT_URL}/api/Informes/GetListadoEstatus/${idEstatus}`;
    let result;
    trackPromise((result = axios.get(url, { headers })));
    return result;
}

function obtenerInformesPorViaje(id) {
    const url = `${localStorage.getItem("Back") ?? process.env.REACT_APP_REPORT_URL}/api/Informes/GetByIdViaje/${id}`;
    let result;
    trackPromise((result = axios.get(url, { headers })));
    return result;
}

function obtenerInformesDisponiblesViajes(idOrigen, idDestino, idRuta) {
    const url = `${localStorage.getItem("Back") ?? process.env.REACT_APP_REPORT_URL}/api/Informes/GetListadoDisponiblesViaje`;
    let result;
    trackPromise(
        (result = axios.post(
            url,
            Object.assign(
                {},
                { idOrigen: idOrigen, idDestino: idDestino, idRuta: idRuta }
            ),
            { headers }
        ))
    );
    return result;
}

function obtenerInformesId(id) {
    const url = `${localStorage.getItem("Back") ?? process.env.REACT_APP_REPORT_URL}/api/Informes/GetById/${id}`;
    let result;
    trackPromise((result = axios.get(url, { headers })));
    return result;
}

function obtenerInformeFiltro(
    fechaInicial,
    fechaFinal,
    folioInforme,
    sucursarEmisora,
    sucursalReceptora
) {
    if (folioInforme == "") {
        folioInforme = 0;
    }
    const url =
        `${localStorage.getItem("Back") ?? process.env.REACT_APP_REPORT_URL}/api/Informes/GetByFiltro/` +
        fechaInicial +
        "/" +
        fechaFinal +
        "/" +
        folioInforme +
        "/" +
        sucursarEmisora +
        "/" +
        sucursalReceptora;
    let result;
    trackPromise((result = axios.get(url, { headers })));
    return result;
}

export {
    modificarInformes,
    agregarInformes,
    eliminarInformes,
    obtenerInformes,
    obtenerInformesId,
    cancelarInformes,
    obtenerInformesDisponiblesViajes,
    obtenerInformesPorViaje,
    obtenerInformeFiltro,
    obtenerInformeReporte,
    obtenerInformesEstatus,
    obtenerXMLCFDI
};
