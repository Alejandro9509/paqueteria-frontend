import axios from "axios";

const headers = {
    'Content-Type': 'application/json',
    //    'access-control-allow-origin': '*'
}

function modificarCaseta(id, params){
    const url = `${process.env.REACT_APP_API_URL}/Casetas/Modificar/` + id;
    return axios.put(url, Object.assign({}, params), { headers })
}

function agregarCaseta( params){
    const url = `${process.env.REACT_APP_API_URL}/Casetas/Agregar`;
    return axios.post(url, Object.assign({}, params), { headers })
}

function eliminarCaseta(id){
    const url = `${process.env.REACT_APP_API_URL}/Casetas/Eliminar/` + id;
    return axios.delete(url, { headers })
}

function obtenerCaseta(){
    const url = `${process.env.REACT_APP_API_URL}/Casetas/GetListado`;
    return axios.get(url, { headers })
}

function obtenerCasetaId(id){
    const url = `${process.env.REACT_APP_API_URL}/Casetas/GetById/${id}`;
    return axios.get(url, { headers })
}

export {modificarCaseta, agregarCaseta, eliminarCaseta, obtenerCaseta, obtenerCasetaId}