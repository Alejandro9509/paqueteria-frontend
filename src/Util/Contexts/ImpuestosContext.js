import axios from "axios";
import { trackPromise } from "react-promise-tracker";
import { API_HEADERS } from "../../Constants";

const headers = API_HEADERS


function modificarImpuestos(id, params){
    const url = `${process.env.REACT_APP_API_URL}/Impuestos/Modificar/` + id;
    let result;
    trackPromise(
        result =  axios.put(url, Object.assign({}, params), { headers })
        );
    return result
}

function agregarImpuestos( params){
    const url = `${process.env.REACT_APP_API_URL}/Impuestos/Agregar`;
    let result;
    trackPromise(
        result =  axios.post(url, Object.assign({}, params), { headers })
        );
    return result
}

function eliminarImpuestos(id, idEliminadoPor){
    const url = `${process.env.REACT_APP_API_URL}/Impuestos/Eliminar/` + id +`/${idEliminadoPor}`;
    let result;
    trackPromise(
        result =  axios.delete(url, { headers })
        );
    return result
}

function obtenerImpuestos(){
    const url = `${process.env.REACT_APP_REPORT_URL}/api/Impuestos/GetListado`;
    let result;
    trackPromise(
        result =  axios.get(url, { headers })
        );
    return result
}

function obtenerImpuestosId(id){
    const url = `${process.env.REACT_APP_API_URL}/Impuestos/GetById/` + id;
    let result;
    trackPromise(
        result =  axios.get(url, { headers })
        );
    return result
}

function obtenerImpuestosTipo(tipo){
    const url = `${process.env.REACT_APP_API_URL}/Impuestos/GetListadoByTipoImpuesto/${tipo}`;
    let result;
    trackPromise(
        result =  axios.get(url, { headers })
        );
    return result
}

export {modificarImpuestos, agregarImpuestos, eliminarImpuestos, obtenerImpuestosId, obtenerImpuestos, obtenerImpuestosTipo }