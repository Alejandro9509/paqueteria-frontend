import axios from "axios";
import { trackPromise } from "react-promise-tracker";
import { API_HEADERS } from "../../Constants";

const headers = API_HEADERS


function modificarGuia(id, params) {
    const url = `${localStorage.getItem("Back") ?? process.env.REACT_APP_REPORT_URL}/api/Guia/Modificar`;
    let result;
    trackPromise(
        result =  axios.put(url, Object.assign({}, params), { headers })
        );
    return result
}

function entregaOcurreGuia(id, params) {
    const url = `${localStorage.getItem("Back") ?? process.env.REACT_APP_REPORT_URL}/api/Guia/EntregaOcurre/` + id;
    let result;
    trackPromise(
        result =  axios.put(url, Object.assign({}, params), { headers })
    );
    return result
}

function agregarGuia(params) {
    const url = `${localStorage.getItem("Back") ?? process.env.REACT_APP_REPORT_URL}/api/Guia/Agregar`;
    let result;
    trackPromise(
        result =  axios.post(url, Object.assign({}, params), { headers })
        );
    return result
}

function cubicarGuia(params) {
    const url = `${localStorage.getItem("Back") ?? process.env.REACT_APP_REPORT_URL}/api/Cubicar`;
    let result;
    trackPromise(
        result =  axios.post(url, Object.assign({}, params), { headers })
        );
    return result
}

function cubicarGuiaInforme(params) {
    const url = `${localStorage.getItem("Back") ?? process.env.REACT_APP_REPORT_URL}/api/Cubicar/Informe`;
    let result;
    trackPromise(
        result =  axios.post(url, Object.assign({}, params), { headers })
        );
    return result
}

function eliminarGuia(id, idEliminadoPor) {
    const url = `${localStorage.getItem("Back") ?? process.env.REACT_APP_REPORT_URL}/api/Guia/Eliminar/${id}/${idEliminadoPor}`;
    let result;
    trackPromise(
        result =  axios.delete(url, { headers })
        );
    return result
}

function validarEliminarGuia(id){
    const url = `${localStorage.getItem("Back") ?? process.env.REACT_APP_REPORT_URL}/api/Guia/ValidarEliminar/${id}`;
    let result;
    trackPromise(
        result =  axios.get(url, { headers })
        );
    return result
}

function cancelarGuia(params) {
    const url = `${localStorage.getItem("Back") ?? process.env.REACT_APP_REPORT_URL}/api/Guia/Cancelar`;
    let result;
    trackPromise(
        result =  axios.put(url, Object.assign({}, params), { headers })
        );
    return result
}

function validarCancelarGuia(id){
    const url = `${localStorage.getItem("Back") ?? process.env.REACT_APP_REPORT_URL}/api/Guia/ValidarCancelar/${id}`;
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
    const url = `${localStorage.getItem("Back") ?? process.env.REACT_APP_REPORT_URL}/api/Guias/GetUltimaMilla`;
    let result;
    trackPromise(
        result =  axios.post(url, Object.assign({}, {zonas: zonasIds.join(","), tipoServicio: tipoServicio}), { headers })
    );
    return result
}

function reasignarGuia(idParadaDestino, idParadaFuente, idGuia) {
    const url = `${localStorage.getItem("Back") ?? process.env.REACT_APP_REPORT_URL}/api/ReasignarGuia/${idParadaDestino}/${idParadaFuente}/${idGuia}`;
    let result;
    trackPromise(
        result =  axios.put(url, Object.assign({}, {}), { headers })
    );
    return result
}

function cambiarTipoCobro(idGuia, tipoCobro) {
    let params = {
        m_nIdGuia: idGuia,
        m_nIdTIpoCobro: tipoCobro
    }
    const url = `${localStorage.getItem("Back") ?? process.env.REACT_APP_REPORT_URL}/api/Guias/CambiarTipoCobro`;
    let result;
    trackPromise(
        result =  axios.put(url, Object.assign({}, params), { headers })
    );
    return result
}

function cambiarEstatusGuia(params) {
    const url = `${localStorage.getItem("Back") ?? process.env.REACT_APP_REPORT_URL}/api/Guia/CambiarEstatusGuia`;
    let result;
    trackPromise(
        result =  axios.put(url, Object.assign({}, params), { headers })
    );
    return result
}

function cambiarEstatusGuiaSAT(params) {
    const url = `${localStorage.getItem("Back") ?? process.env.REACT_APP_REPORT_URL}/api/Guia/CambiarEstatusGuiaSAT`;
    let result;
    trackPromise(
        result =  axios.put(url, Object.assign({}, params), { headers })
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
    let params = {
        m_nIdGuia: idGuia,
        m_sLatitud: latitud,
        m_sLongitud: longitud
    }
    const url = `${localStorage.getItem("Back") ?? process.env.REACT_APP_REPORT_URL}/api/Guia/ActualizarCoordenadas`;
    let result;
    trackPromise(
        result =  axios.put(url, Object.assign({}, params), { headers })
    );
    return result
}

function obtenerGuiaPendientes(idOrigen, idDestino, tipoTimbrado) {
    const url = `${localStorage.getItem("Back") ?? process.env.REACT_APP_REPORT_URL}/api/Guia/GetListadoPendientes/` +
        idOrigen +
        "/" +
        idDestino+
        "/" + tipoTimbrado
        ;
    let result;
    trackPromise(
        result =  axios.get(url, { headers })
        );
    return result
}

function obtenerGuiaReporte(id) {
    const url = `${localStorage.getItem("Back") ?? process.env.REACT_APP_REPORT_URL}/api/GenerarReporte/Guia/${id}`;
    let result;
    trackPromise(
        result =  axios.get(url, { headers })
    );
    return result
}

function obtenerGuiaReporteEtiqueta(id) {
    const url = `${localStorage.getItem("Back") ?? process.env.REACT_APP_REPORT_URL}/api/GenerarReporte/EtiquetasGuia/${id}`;
    let result;
    trackPromise(
        result =  axios.get(url, { headers })
    );
    return result
}

function validarRangosEtiqueta(params) {
    const url = `${localStorage.getItem("Back") ?? process.env.REACT_APP_REPORT_URL}/api/GenerarReporte/ValidarRangosEtiqueta`;
    let result;
    trackPromise(
        // result =  axios.get(url, { headers })
        result =  axios.post(url, params, { headers })
    );
    return result
}

function obtenerGuiaReporteEtiquetaGuiaRangos(idImpresion) {
    const url = `${localStorage.getItem("Back") ?? process.env.REACT_APP_REPORT_URL}/api/GenerarReporte/EtiquetasGuiaRangos/${idImpresion}`;
    let result;
    trackPromise(
        result =  axios.get(url, { headers })
        // result =  axios.post(url, params, { headers })
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
    const url = `${localStorage.getItem("Back") ?? process.env.REACT_APP_REPORT_URL}/api/Guia/GetById/` + id;
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
        `${localStorage.getItem("Back") ?? process.env.REACT_APP_REPORT_URL}/api/Guias/GetByFiltro/` +
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

function obtenerGuiasFiltroCorteCaja(busquedaPorUsuario, idOperador, idUsuario, fecha) {
    const url = `${localStorage.getItem("Back") ?? process.env.REACT_APP_REPORT_URL}/api/Guias/GetListadoFiltrosCorteCaja`
    let result;
    let params = {
        "busquedaPorUsuario": busquedaPorUsuario, //boolean
        "idOperador": idOperador,
        "idUsuario": idUsuario,
        "fecha": fecha?.length === 0 ? null : fecha // STRING. PUEDE SER NULL
    }
    trackPromise(
        result =  axios.post(url, params, { headers })
    );
    return result
}

function obtenerGuiasFiltroCorteCajaVIEJO(fecha, destino, idMoneda, idTipoPago) {
    const url =
        `${localStorage.getItem("Back") ?? process.env.REACT_APP_REPORT_URL}/api/Guias/GetListadoFiltrosCorteCaja/` +
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
    
    const url = `${localStorage.getItem("Back") ?? process.env.REACT_APP_REPORT_URL}/api/Guias/ValidacionById/`+id
    let result;
    trackPromise(
        result =  axios.get(url, { headers })
    );
    return result
}

function obtenerBancos() {
    const url = `${localStorage.getItem("Back") ?? process.env.REACT_APP_REPORT_URL}/api/Guia/GetBancos`;
    let result;
    trackPromise(
        result =  axios.get(url, { headers })
        );
    return result
}

function enviarCorreoGuia(idGuia, correos, correoDefault){
    const url = `${localStorage.getItem("Back") ?? process.env.REACT_APP_REPORT_URL}/api/Guia/ReenviarCorreoCartaPorte/${idGuia}`;
    let result;
    trackPromise(
        result =  axios.post(url, Object.assign({}, {correos: correos, correoDefault:correoDefault}), { headers })
    );
    return result
}

function obtenerPaquetesGuia(idGuia) {
    const url = `${localStorage.getItem("Back") ?? process.env.REACT_APP_REPORT_URL}/api/Guias/GetPaquetes/`+idGuia;
    let result;
    trackPromise(
        result =  axios.get(url, { headers })
    );
    return result
}

function subirImagenEvidencia(imagen,IdGuia,ImagenNombreArchivo,Descripcion,esRec,TipoArchivo) {
    const url = `${localStorage.getItem("Back") ?? process.env.REACT_APP_REPORT_URL}/api/Guia/SubirImagen`;
    let result;
    let config={
        headers:   {'Content-Type':headers["Content-Type"],'RFC':headers['RFC'],'EsRecoleccion':esRec,'IdGuia':IdGuia,'Descripcion':Descripcion,'ImagenNombreArchivo':ImagenNombreArchivo,'TipoArchivo':TipoArchivo}
    }
    trackPromise(

        result =  axios.post(url, imagen, config)
    );
    return result
}

export {
    cubicarGuiaInforme,
    cubicarGuia,
    cambiarEstatusGuiaSAT,
    actualizarCoordenadasGuia,
    cambiarEstatusGuia,
    obtenerGuiasFiltroCorteCaja,
    entregaOcurreGuia,
    modificarGuia,
    agregarGuia,
    eliminarGuia,
    obtenerGuiaId,
    obtenerGuia,
    ultimoFolioGuia,
    cancelarGuia,
    obtenerGuiasFiltro,
    obtenerGuiaPendientes,
    imprimirGuia,
    obtenerGuiaReporteEtiqueta,
    obtenerGuiaUltimaMilla,
    subirImagenEvidencia,reasignarGuia,
    obtenerGuiaReporte,
    cambiarTipoCobro,
    obtenerValidacionGuia,
    asignarTrayectos,
    validarEliminarGuia,
    validarCancelarGuia,
    obtenerBancos,
    obtenerGuiaReporteEtiquetaGuiaRangos,
    enviarCorreoGuia,
    obtenerPaquetesGuia,
    validarRangosEtiqueta
}