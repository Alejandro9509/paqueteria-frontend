import axios from "axios";
import { trackPromise } from "react-promise-tracker";

const headers = {
    'Content-Type': 'application/json',
    //    'access-control-allow-origin': '*'
}

function modificarFormatosImpresion(id, params){
    const url = `${process.env.REACT_APP_API_URL}/FormatosImpresion/Modificar/` + id;
    let result;
    trackPromise(
        result =  axios.put(url, Object.assign({}, params), { headers })
        );
    return result
}

function agregarFormatosImpresion( params){
    const url = `${process.env.REACT_APP_API_URL}/Formato/Agregar`;
    let result;
    trackPromise(
        result =  axios.post(url, Object.assign({}, params), { headers })
        );
    return result
}

function eliminarFormatosImpresion(id){
    const url = `${process.env.REACT_APP_API_URL}/FormatosImpresion/Eliminar/` + id;
    let result;
    trackPromise(
        result =  axios.delete(url, { headers })
        );
    return result
}

function obtenerFormatosImpresion(){
    const url = `${process.env.REACT_APP_API_URL}/Formato/GetListado`;
    let result;
    trackPromise(
        result =  axios.get(url, { headers })
        );
    return result
}

function obtenerFormatosImpresionId(id){
    const url = `${process.env.REACT_APP_API_URL}/FormatosImpresion/GetById/${id}`;
    let result;
    trackPromise(
        result =  axios.get(url, { headers })
        );
    return result
}

export {modificarFormatosImpresion, agregarFormatosImpresion, eliminarFormatosImpresion, obtenerFormatosImpresionId, obtenerFormatosImpresion}