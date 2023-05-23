import axios from "axios";
import { trackPromise } from "react-promise-tracker";
import {API_HEADERS, API_MULTIPART_HEADERS} from "../../Constants";

const headers = API_HEADERS
const headersMultipart = API_MULTIPART_HEADERS;



function agregarFormatosImpresion( params, file, image){
    var bodyFormData = new FormData();

    const url = `${process.env.REACT_APP_REPORT_URL}/api/Formato/Agregar`;
    let result;
    var json = JSON.stringify({...params});
    var blob = new Blob([json] , { type: 'application/json' });
    bodyFormData.append("request", blob);
    bodyFormData.append("file", file, file.name);
    if (image){
        bodyFormData.append("image", image, image.name);
    }
    trackPromise(
        result =  axios.post(url, bodyFormData, { headers: headersMultipart })
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

function obtenerFormatosImpresionProceso(id){
    const url = `${process.env.REACT_APP_REPORT_URL}/api/Formato/Proceso/${id}`;
    let result;
    trackPromise(
        result =  axios.get(url, { headers })
    );
    return result
}
function imprimirFormatosId(id, fechaInicial, fechaFinal, sucursales){
    const url = `${process.env.REACT_APP_API_URL}/ImprimirFormato/${id}`;
    console.log(sucursales)
    let result;
    trackPromise(
        result =  axios.post(url,Object.assign({}, {fechaInicial: fechaInicial, fechaFinal: fechaFinal, sucursales: sucursales.map(s => s.id).join(",")}), { headers})
        );
    return result
}
function imprimirFormatosECCId(id, fechaInicial, fechaFinal, idCliente){
    const url = `${process.env.REACT_APP_API_URL}/ImprimirFormato/${id}`;
    let result;
    trackPromise(
        result =  axios.post(url,Object.assign({}, {fechaInicio: fechaInicial, fechaFinal: fechaFinal, idCliente:idCliente}), { headers})
    );
    return result
}

export {agregarFormatosImpresion, obtenerFormatosImpresion, imprimirFormatosId,obtenerFormatosImpresionProceso,imprimirFormatosECCId}