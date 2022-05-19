import axios from "axios";
import { trackPromise } from "react-promise-tracker";
import {API_HEADERS, API_MULTIPART_HEADERS} from "../../Constants";

const headers = API_HEADERS
const headersMultipart = API_MULTIPART_HEADERS;



function modificarFormatosImpresion(id, params){
    const url = `${process.env.REACT_APP_API_URL}/FormatosImpresion/Modificar/` + id;
    let result;
    trackPromise(
        result =  axios.put(url, Object.assign({}, params), { headers: headersMultipart })
        );
    return result
}

function agregarFormatosImpresion( params, file, image){
    var bodyFormData = new FormData();

    const url = `${process.env.REACT_APP_API_URL_LOCAL}/api/Formato/Agregar`;
    let result;
    var json = JSON.stringify({...params});
    var blob = new Blob([json] , { type: 'application/json' });
    bodyFormData.append("request", blob);
    bodyFormData.append("file", file, file.name);
    bodyFormData.append("image", image, image.name);

    trackPromise(
        result =  axios.post(url, bodyFormData, { headers: headersMultipart })
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
function imprimirFormatosId(id){
    const url = `${process.env.REACT_APP_API_URL}/ImprimirFormato/${id}`;
    let result;
    trackPromise(
        result =  axios.get(url, { headers, responseType:"arraybuffer" })
        );
    return result
}

export {modificarFormatosImpresion, agregarFormatosImpresion, eliminarFormatosImpresion, obtenerFormatosImpresionId, obtenerFormatosImpresion, imprimirFormatosId}