import axios from "axios";

const headers = {
    'Content-Type': 'application/json',
    //    'access-control-allow-origin': '*'
}

function modificarGuia(id, params) {
    const url = `${process.env.REACT_APP_API_URL}/GruposClientes/Modificar/` + id;
    return axios.put(url, Object.assign({}, params), { headers })
}

function agregarGuia(params) {
    const url = `${process.env.REACT_APP_API_URL}/GruposClientes/Agregar`;
    return axios.post(url, Object.assign({}, params), { headers })
}

function eliminarGuia(id) {
    const url = `${process.env.REACT_APP_API_URL}/Guia/Eliminar/` + id;
    return axios.delete(url, { headers })
}
function cancelarGuia(id, params) {
    const url = `${process.env.REACT_APP_API_URL}/Guia/Cancelar/${id}`;
    return axios.put(url, Object.assign({}, params), { headers })
}

function obtenerGuia() {
    const url = `${process.env.REACT_APP_API_URL}/Guia/GetListado`;
    return axios.get(url, { headers })
}

function obtenerGuiaPendientes(idOrigen, idDestino) {
    const url = `${process.env.REACT_APP_API_URL}/Guia/GetListadoPendientes/` +
        idOrigen +
        "/" +
        idDestino
        ;
    return axios.get(url, { headers })
}

function ultimoFolioGuia() {
    const url = `${process.env.REACT_APP_API_URL}/Guia/GetUltimoFolio`;
    return axios.get(url, { headers })
}

function obtenerGuiaId(id) {
    const url = `${process.env.REACT_APP_API_URL}/Guia/GetById/` + id;
    return axios.get(url, { headers })
}

function obtenerGuiasFiltro(fechaInicial, fechaFinal, sucursalListado, estatusListado) {
    const url =
        `${process.env.REACT_APP_API_URL}/Guias/GetByFiltro/` +
        fechaInicial +
        "/" +
        fechaFinal +
        "/" +
        sucursalListado +
        "/" +
        estatusListado;
    return axios.get(url, { headers })
}

export { modificarGuia, agregarGuia, eliminarGuia, obtenerGuiaId, obtenerGuia, ultimoFolioGuia, cancelarGuia, obtenerGuiasFiltro, obtenerGuiaPendientes }