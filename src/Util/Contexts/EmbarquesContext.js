import axios from "axios";

const headers = {
    'Content-Type': 'application/json',
    //    'access-control-allow-origin': '*'
}

function modificarEmbarques(id, params){
    const url = `${process.env.REACT_APP_API_URL}/Embarques/Modificar/` + id;
    return axios.put(url, Object.assign({}, params), { headers })
}

function agregarEmbarques( params){
    const url = `${process.env.REACT_APP_API_URL}/Embarques/Agregar`;
    return axios.post(url, Object.assign({}, params), { headers })
}

function eliminarEmbarques(id){
    const url = `${process.env.REACT_APP_API_URL}/Embarques/Eliminar/` + id;
    return axios.delete(url, { headers })
}

function obtenerEmbarques(){
    const url = `${process.env.REACT_APP_API_URL}/Embarques/GetListado`;
    return axios.get(url, { headers })
}

function obtenerEmbarquesFiltro(fechaInicial, fechaFinal, sucursalListado, estatusListado) {
    const url =
        `${process.env.REACT_APP_API_URL}/Embarques/GetByFiltro/` +
        fechaInicial +
        "/" +
        fechaFinal +
        "/" +
        sucursalListado +
        "/" +
        estatusListado;
    return axios.get(url, { headers })
}

function obtenerUltimoFolioEmbarques(){
    const url = `${process.env.REACT_APP_API_URL}/Embarques/GetUltimoFolio`;
    return axios.get(url, { headers })
}

function cancelarEmbarque(state, params){
    const url = `${process.env.REACT_APP_API_URL}/Embarques/Cancelar/${state.idEmbarque}`;
    return axios.put(url, Object.assign({}, params), { headers })
}
function obtenerEmbarqueCancelado(state){
    const url = `${process.env.REACT_APP_API_URL}/Embarques/GetCancelarById/${state.idEmbarque}`;
    return axios.get(url, { headers })
}
function obtenerEmbarquesId(id){
    const url = `${process.env.REACT_APP_API_URL}/Embarques/GetById/${id}`;
    return axios.get(url, { headers })
}

function obtenerEmbarqueMoneda(valor, idMoneda, idGuia){
    const url = `${process.env.REACT_APP_API_URL}/Embarques/GetBySucursalMoneda/` + valor + "/" + idMoneda + "/" + idGuia;
    return axios.get(url, { headers })
}

export {modificarEmbarques, agregarEmbarques, eliminarEmbarques, obtenerEmbarques, obtenerEmbarquesId, obtenerUltimoFolioEmbarques, cancelarEmbarque, obtenerEmbarqueCancelado, obtenerEmbarquesFiltro, obtenerEmbarqueMoneda}