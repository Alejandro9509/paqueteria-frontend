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

function modificarFormatosImpresion( id, params,image){
    var bodyFormData = new FormData();

    const url = `${process.env.REACT_APP_REPORT_URL}/api/Formato/Modificar/${id}`;
    let result;
    var json = JSON.stringify({...params});
    var blob = new Blob([json] , { type: 'application/json' });
    bodyFormData.append("request", blob);
    if (image){
        bodyFormData.append("image", image, image.name);
    }
    trackPromise(
        result =  axios.put(url, bodyFormData, { headers})
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
function obtenerFormatosImpresionId(id){
    const url = `${process.env.REACT_APP_REPORT_URL}/api/Formato/${id}`;
    let result;
    trackPromise(
        result =  axios.get(url, { headers })
    );
    return result
}
function imprimirFormatosId(id, fechaInicial, fechaFinal, sucursales){
    const url = `${process.env.REACT_APP_API_URL}/ImprimirFormato/${id}`;
    let result;
    trackPromise(
        result =  axios.post(url,Object.assign({}, {fechaInicial: fechaInicial, fechaFinal: fechaFinal, sucursales: sucursales.map(s => s.id).join(",")}), { headers})
        );
    return result
}
function imprimirFormatosIdIdTipoReporte(id,idTipoReporte){
    const url = `${process.env.REACT_APP_API_URL}/ImprimirFormato/${id}`;
    let result;
    trackPromise(
        result =  axios.post(url,Object.assign({}, {idTipoReporte:idTipoReporte}), { headers})
    );
    return result
}
function imprimirFormatosIdInforme(id,idTipoReporte,esPDF){
    const url = `${process.env.REACT_APP_API_URL}/ImprimirFormato/${id}`;
    let result;
    trackPromise(
        result =  axios.post(url,Object.assign({}, {idTipoReporte:idTipoReporte,EsPDF:esPDF}), { headers})
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
function imprimirFormatosIdTimbradoViajes(id,idViaje,idInforme){
    const url = `${process.env.REACT_APP_API_URL}/ImprimirFormato/${id}`;
    let result;
    trackPromise(
        result =  axios.post(url,Object.assign({}, {idViaje:idViaje,idInforme:idInforme}), { headers})
    );
    return result
}
function imprimirFormatosIdCorteCajaGeneral(id,fechaRegistro,horaRegistro){
    const url = `${process.env.REACT_APP_API_URL}/ImprimirFormato/${id}`;
    let result;
    trackPromise(
        result =  axios.post(url,Object.assign({}, {fechaRegistro:fechaRegistro,horaRegistro:horaRegistro}), { headers})
    );
    return result
}
function imprimirFormatoGuiaMoroleon(id,idTipoReporte,anio,dia,mes,firma){
    const url = `${process.env.REACT_APP_API_URL}/ImprimirFormato/${id}`;
    let result;
    if(anio && dia && mes){
        trackPromise(
            result =  axios.post(url,Object.assign({}, {idTipoReporte:idTipoReporte, anio: anio, dia: dia,mes: mes,imagen64:firma?firma:""}), { headers})
        );
    }else{
        trackPromise(
            result =  axios.post(url,Object.assign({}, {idTipoReporte:idTipoReporte}), { headers})
        );
    }
    return result
}

export {agregarFormatosImpresion, obtenerFormatosImpresion, imprimirFormatosId,obtenerFormatosImpresionProceso,imprimirFormatosECCId,imprimirFormatosIdIdTipoReporte,imprimirFormatosIdTimbradoViajes,imprimirFormatosIdCorteCajaGeneral,imprimirFormatosIdInforme,modificarFormatosImpresion,obtenerFormatosImpresionId,imprimirFormatoGuiaMoroleon}