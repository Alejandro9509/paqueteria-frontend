import axios from "axios";
import { trackPromise } from "react-promise-tracker";
import { API_HEADERS } from "../../Constants";

const headers = API_HEADERS


function modificarEmbarques(id, params){
    const url = `${localStorage.getItem("Back") ?? process.env.REACT_APP_REPORT_URL}/api/Embarques/Modificar/` + id;
    let result;
    trackPromise(
        result =  axios.put(url,  params, { headers })
        );
    return result
}

function obtenerEmbarqueReporte(id) {
    const url = `${localStorage.getItem("Back") ?? process.env.REACT_APP_REPORT_URL}/api/GenerarReporte/Embarque/${id}`;
    let result;
    trackPromise(
        result =  axios.get(url, { headers })
    );
    return result
}

function agregarEmbarques( params){
    const url = `${localStorage.getItem("Back") ?? process.env.REACT_APP_REPORT_URL}/api/Embarques/Agregar`;
    let result;
    trackPromise(
        result =  axios.post(url, params, { headers })
        );
    return result
}

function eliminarEmbarques(id, idEliminadoPor){
    const url = `${localStorage.getItem("Back") ?? process.env.REACT_APP_REPORT_URL}/api/Embarques/Eliminar/` + id + `/${idEliminadoPor}`;
    let result;
    trackPromise(
        result =  axios.delete(url, { headers })
        );
    return result
}

function obtenerEmbarques(){
    const url = `${process.env.REACT_APP_API_URL}/Embarques/GetListado`;
    let result;
    trackPromise(
        result =  axios.get(url, { headers })
        );
    return result
}

function obtenerEmbarquesFiltro(fechaInicial, fechaFinal, sucursalListado, estatusListado, folioEmbarque,Origen,Destino, idCliente) {
    if (folioEmbarque === ''){
        folioEmbarque = 0
    }
    const url =
        `${localStorage.getItem("Back") ?? process.env.REACT_APP_REPORT_URL}/api/Embarque/GetByFiltro/` +
        fechaInicial +
        "/" +
        fechaFinal +
        "/" +
        sucursalListado +
        "/" +
        estatusListado +
        "/" +
        folioEmbarque+
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

function obtenerUltimoFolioEmbarques(){
    const url = `${process.env.REACT_APP_API_URL}/Embarques/GetUltimoFolio`;
    let result;
    trackPromise(
        result =  axios.get(url, { headers })
        );
    return result
}

function cancelarEmbarque(state, params){
    const url = `${localStorage.getItem("Back") ?? process.env.REACT_APP_REPORT_URL}/api/Embarques/Cancelar/${state.idEmbarque}`;
    let result;
    trackPromise(
        result =  axios.put(url, Object.assign({}, params), { headers })
        );
    return result
}

function obtenerEmbarqueCancelado(state){
    const url = `${process.env.REACT_APP_API_URL}/Embarques/GetCancelarById/${state.idEmbarque}`;
    let result;
    trackPromise(
        result =  axios.get(url, { headers })
        );
    return result
}

function obtenerEmbarquesId(id){
    const url = `${localStorage.getItem("Back") ?? process.env.REACT_APP_REPORT_URL}/api/Embarque/GetById/${id}`;
    let result;
    trackPromise(
        result =  axios.get(url, { headers })
        );
    return result
}

function obtenerEmbarqueMoneda(valor, idMoneda, idGuia){
    const url = `${localStorage.getItem("Back") ?? process.env.REACT_APP_REPORT_URL}/api/Embarques/GetBySucursalMoneda/` + valor + "/" + idMoneda + "/" + idGuia;
    let result;
    trackPromise(
        result =  axios.get(url, { headers })
        );
    return result
}

function validarEmbarquesImportados(params){
    const url = `${localStorage.getItem("Back") ?? process.env.REACT_APP_REPORT_URL}/api/Embarques/validar-importacion`;
    let result;
    trackPromise(result = axios.post(url, Object.assign({}, params), { headers }))
    return result
}

function agregarEmbarquesImportados(params){
    const url = `${localStorage.getItem("Back") ?? process.env.REACT_APP_REPORT_URL}/api/Embarques/agregar-importados`;
    let result;
    trackPromise(result = axios.post(url, Object.assign({}, params), { headers }))
    return result
}

export {
    modificarEmbarques,
    agregarEmbarques,
    obtenerEmbarqueReporte,
    eliminarEmbarques,
    obtenerEmbarques,
    obtenerEmbarquesId,
    obtenerUltimoFolioEmbarques,
    cancelarEmbarque,
    obtenerEmbarqueCancelado,
    obtenerEmbarquesFiltro,
    obtenerEmbarqueMoneda,
    validarEmbarquesImportados,
    agregarEmbarquesImportados
}