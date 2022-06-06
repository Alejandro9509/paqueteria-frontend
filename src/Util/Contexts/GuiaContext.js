import axios from "axios";
import { trackPromise } from "react-promise-tracker";
import { API_HEADERS } from "../../Constants";

const headers = API_HEADERS


function modificarGuia(id, params) {
    const url = `${process.env.REACT_APP_API_URL}/Guia/Modificar/` + id;
    let result;
    trackPromise(
        result =  axios.put(url, Object.assign({}, params), { headers })
        );
    return result
}

function entregaOcurreGuia(id, params) {
    const url = `${process.env.REACT_APP_REPORT_URL}/api/Guia/EntregaOcurre/` + id;
    let result;
    trackPromise(
        result =  axios.put(url, Object.assign({}, params), { headers })
    );
    return result
}

function agregarGuia(params) {
    const url = `${process.env.REACT_APP_API_URL}/Guia/Agregar`;
    let result;
    trackPromise(
        result =  axios.post(url, Object.assign({}, params), { headers })
        );
    return result
}

function eliminarGuia(id, idEliminadoPor) {
    const url = `${process.env.REACT_APP_API_URL}/Guia/Eliminar/` + id + `/${idEliminadoPor}`;
    let result;
    trackPromise(
        result =  axios.delete(url, { headers })
        );
    return result
}
function validarEliminarGuia(id){
    const url = `${process.env.REACT_APP_REPORT_URL}/api/Guia/ValidarEliminar/${id}`;
    let result;
    trackPromise(
        result =  axios.get(url, { headers })
        );
    return result
}

function cancelarGuia(id, params) {
    const url = `${process.env.REACT_APP_API_URL}/Guia/Cancelar/${id}`;
    let result;
    trackPromise(
        result =  axios.put(url, Object.assign({}, params), { headers })
        );
    return result
}

function validarCancelarGuia(id){
    const url = `${process.env.REACT_APP_REPORT_URL}/api/Guia/ValidarCancelar/${id}`;
    let result;
    trackPromise(
        result =  axios.get(url, { headers })
        );
    return result
}

function obtenerGuia() {
    const url = `${process.env.REACT_APP_API_URL}/Guia/GetListado`;
    let result;
    trackPromise(
        result =  axios.get(url, { headers })
        );
    return result
}
function obtenerGuiaUltimaMilla(zonasIds, tipoServicio) {
    const url = `${process.env.REACT_APP_REPORT_URL}/api/Guias/GetUltimaMilla`;
    let result;
    trackPromise(
        result =  axios.post(url, Object.assign({}, {zonas: zonasIds.join(","), tipoServicio: tipoServicio}), { headers })
    );
    return result
}

function reasignarGuia(idParadaDestino, idParadaFuente, idGuia) {
    const url = `${process.env.REACT_APP_API_URL}/ReasignarGuia/${idParadaDestino}/${idParadaFuente}/${idGuia}`;
    let result;
    trackPromise(
        result =  axios.put(url, Object.assign({}, {}), { headers })
    );
    return result
}

function cambiarTipoCobro(idGuia, tipoCobro) {
    const url = `${process.env.REACT_APP_API_URL}/Guias/CambiarTipoCobro/${idGuia}/${tipoCobro}`;
    let result;
    trackPromise(
        result =  axios.put(url, Object.assign({}, {}), { headers })
    );
    return result
}

function cambiarEstatusGuia(idGuia, estatus) {
    const url = `${process.env.REACT_APP_API_URL}/Guia/CambiarEstatusGuia/${idGuia}/${estatus}`;
    let result;
    trackPromise(
        result =  axios.put(url, Object.assign({}, {}), { headers })
    );
    return result
}

function asignarTrayectos(idGuia) {
    const url = `${process.env.REACT_APP_API_URL}/Guia/AsignarTrayectos/${idGuia}`;
    let result;
    trackPromise(
        result =  axios.put(url, Object.assign({}, {}), { headers })
    );
    return result
}

function actualizarCoordenadasGuia(idGuia, latitud, longitud) {
    const url = `${process.env.REACT_APP_API_URL}/Guia/ActualizarCoordenadas/${idGuia}/${latitud}/${longitud}`;
    let result;
    trackPromise(
        result =  axios.put(url, Object.assign({}, {}), { headers })
    );
    return result
}

function obtenerGuiaPendientes(idOrigen, idDestino) {
    const url = `${process.env.REACT_APP_REPORT_URL}/api/Guia/GetListadoPendientes/` +
        idOrigen +
        "/" +
        idDestino
        ;
    let result;
    trackPromise(
        result =  axios.get(url, { headers })
        );
    return result
}
function obtenerGuiaReporte(id) {
    const url = `${process.env.REACT_APP_REPORT_URL}/api/GenerarReporte/Guia/${id}`;
    let result;
    trackPromise(
        result =  axios.get(url, { headers })
    );
    return result
}
function obtenerGuiaReporteEtiqueta(id) {
    const url = `${process.env.REACT_APP_REPORT_URL}/api/GenerarReporte/EtiquetasGuia/${id}`;
    let result;
    trackPromise(
        result =  axios.get(url, { headers })
    );
    return result
}
function ultimoFolioGuia() {
    const url = `${process.env.REACT_APP_API_URL}/Guia/GetUltimoFolio`;
    let result;
    trackPromise(
        result =  axios.get(url, { headers })
        );
    return result
}

function obtenerGuiaId(id) {
    const url = `${process.env.REACT_APP_REPORT_URL}/api/Guia/GetById/` + id;
    let result;
    trackPromise(
        result =  axios.get(url, { headers })
        );
    return result
}

function imprimirGuia(id) {
    const url = `${process.env.REACT_APP_API_URL}/Guia/GetImpresion/` + id;
    let result;
    trackPromise(
        result =  axios.get(url, { headers })
        );
    return result
}

function obtenerGuiasFiltro(fechaInicial, fechaFinal, sucursalListado, estatusListado,folioGuia,Origen,Destino,idCliente) {
    if (folioGuia == ''){
        folioGuia = 0
    }
    const url =
        `${process.env.REACT_APP_REPORT_URL}/api/Guias/GetByFiltro/` +
        fechaInicial +
        "/" +
        fechaFinal +
        "/" +
        sucursalListado +
        "/" +
        estatusListado +
        "/" +
        folioGuia+
        "/" +
        Origen+
        "/" +
        Destino+
        "/" +
        idCliente;
    let result;
    trackPromise(
        result =  axios.get(url, { headers })
        );
    return result
}

function obtenerGuiasFiltroCorteCaja(fecha, destino, idMoneda, idTipoPago) {

    const url =
        `${process.env.REACT_APP_REPORT_URL}/api/Guias/GetListadoFiltrosCorteCaja/` +
        fecha +
        "/" +
        destino +
        "/" +
        idMoneda +
        "/" +
        idTipoPago
    let result;
    trackPromise(
        result =  axios.get(url, { headers })
    );
    return result
}

function obtenerValidacionGuia(id){
    
    const url = `${process.env.REACT_APP_REPORT_URL}/api/Guias/ValidacionById/`+id
    let result;
    trackPromise(
        result =  axios.get(url, { headers })
    );
    return result
}

function obtenerBancos() {
    const url = `${process.env.REACT_APP_API_URL_LOCAL}/api/Guia/GetBancos`;
    let result;
    trackPromise(
        result =  axios.get(url, { headers })
        );
    return result
}


export {actualizarCoordenadasGuia,cambiarEstatusGuia, obtenerGuiasFiltroCorteCaja, entregaOcurreGuia, modificarGuia, agregarGuia, eliminarGuia, obtenerGuiaId,
    obtenerGuia, ultimoFolioGuia, cancelarGuia, obtenerGuiasFiltro, obtenerGuiaPendientes, imprimirGuia,obtenerGuiaReporteEtiqueta,
    obtenerGuiaUltimaMilla, reasignarGuia, obtenerGuiaReporte , cambiarTipoCobro, obtenerValidacionGuia,asignarTrayectos,validarEliminarGuia,validarCancelarGuia,obtenerBancos}