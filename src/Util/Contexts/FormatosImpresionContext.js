import axios from "axios";

const headers = {
    'Content-Type': 'application/json',
    //    'access-control-allow-origin': '*'
}

function modificarFormatosImpresion(id, params){
    const url = `${process.env.REACT_APP_API_URL}/FormatosImpresion/Modificar/` + id;
    return axios.put(url, Object.assign({}, params), { headers })
}

function agregarFormatosImpresion( params){
    const url = `${process.env.REACT_APP_API_URL}/Formato/Agregar`;
    return axios.post(url, Object.assign({}, params), { headers })
}

function eliminarFormatosImpresion(id){
    const url = `${process.env.REACT_APP_API_URL}/FormatosImpresion/Eliminar/` + id;
    return axios.delete(url, { headers })
}

function obtenerFormatosImpresion(){
    const url = `${process.env.REACT_APP_API_URL}/FormatosImpresion/GetListado`;
    return axios.get(url, { headers })
}

function obtenerFormatosImpresionId(id){
    const url = `${process.env.REACT_APP_API_URL}/FormatosImpresion/GetById/${id}`;
    return axios.get(url, { headers })
}

export {modificarFormatosImpresion, agregarFormatosImpresion, eliminarFormatosImpresion, obtenerFormatosImpresionId, obtenerFormatosImpresion}