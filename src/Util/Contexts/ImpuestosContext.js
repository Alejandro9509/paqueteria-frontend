import axios from "axios";

const headers = {
    'Content-Type': 'application/json',
    //    'access-control-allow-origin': '*'
}

function modificarImpuestos(id, params){
    const url = `${process.env.REACT_APP_API_URL}/Impuestos/Modificar/` + id;
    return axios.put(url, Object.assign({}, params), { headers })
}

function agregarImpuestos( params){
    const url = `${process.env.REACT_APP_API_URL}/Impuestos/Agregar`;
    return axios.post(url, Object.assign({}, params), { headers })
}

function eliminarImpuestos(id){
    const url = `${process.env.REACT_APP_API_URL}/Impuestos/Eliminar/` + id;
    return axios.delete(url, { headers })
}

function obtenerImpuestos(){
    const url = `${process.env.REACT_APP_API_URL}/Impuestos/GetListado`;
    return axios.get(url, { headers })
}

function obtenerImpuestosId(id){
    const url = `${process.env.REACT_APP_API_URL}/Impuestos/GetById/` + id;
    return axios.get(url, { headers })
}

export {modificarImpuestos, agregarImpuestos, eliminarImpuestos, obtenerImpuestosId, obtenerImpuestos}