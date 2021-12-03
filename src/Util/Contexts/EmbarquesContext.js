import axios from "axios";
import { trackPromise } from "react-promise-tracker";
import { API_HEADERS } from "../../Constants";

const headers = API_HEADERS


function modificarEmbarques(id, params){
    const url = `${process.env.REACT_APP_API_URL}/Embarques/Modificar/` + id;
    let result;
    trackPromise(
        result =  axios.put(url, Object.assign({}, params), { headers }), "progress"
        );
    return result
}

function agregarEmbarques( params){
    const url = `${process.env.REACT_APP_API_URL}/Embarques/Agregar`;
    let result;
    console.log()
    trackPromise(
        result =  axios.post(url, Object.assign({}, params), { headers }),"progress"
        );
    return result
}

function eliminarEmbarques(id, idEliminadoPor){
    const url = `${process.env.REACT_APP_API_URL}/Embarques/Eliminar/` + id + `/${idEliminadoPor}`;
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

function obtenerEmbarquesFiltro(fechaInicial, fechaFinal, sucursalListado, estatusListado, folioEmbarque,Origen,Destino) {
    if (folioEmbarque == ''){
        folioEmbarque = 0
    }
    const url =
        `${process.env.REACT_APP_REPORT_URL}/api/Embarque/GetByFiltro/` +
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
        Destino;
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
    const url = `${process.env.REACT_APP_API_URL}/Embarques/Cancelar/${state.idEmbarque}`;
    let result;
    trackPromise(
        result =  axios.put(url, Object.assign({}, params), { headers }),"progress"
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
    const url = `${process.env.REACT_APP_API_URL}/Embarques/GetById/${id}`;
    let result;
    trackPromise(
        result =  axios.get(url, { headers })
        );
    return result
}

function obtenerEmbarqueMoneda(valor, idMoneda, idGuia){
    const url = `${process.env.REACT_APP_API_URL}/Embarques/GetBySucursalMoneda/` + valor + "/" + idMoneda + "/" + idGuia;
    let result;
    trackPromise(
        result =  axios.get(url, { headers })
        );
    return result
}

export {modificarEmbarques, agregarEmbarques, eliminarEmbarques, obtenerEmbarques, obtenerEmbarquesId, obtenerUltimoFolioEmbarques, cancelarEmbarque, obtenerEmbarqueCancelado, obtenerEmbarquesFiltro, obtenerEmbarqueMoneda}