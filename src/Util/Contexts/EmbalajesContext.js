import axios from "axios";

const headers = {
    'Content-Type': 'application/json',
    //    'access-control-allow-origin': '*'
}

function modificarEmbalajes(id, params){
    const url = `${process.env.REACT_APP_API_URL}/Embalaje/Modificar/` + id;
    return axios.put(url, Object.assign({}, params), { headers })
}

function agregarEmbalajes( params){
    const url = `${process.env.REACT_APP_API_URL}/Embalaje/Agregar`;
    return axios.post(url, Object.assign({}, params), { headers })
}

function eliminarEmbalajes(id){
    const url = `${process.env.REACT_APP_API_URL}/Embalaje/Eliminar/` + id;
    return axios.delete(url, { headers })
}

function obtenerEmbalajes(){
    const url = `${process.env.REACT_APP_API_URL}/Embalajes/GetListado`;
    return axios.get(url, { headers })
}

function obtenerEmbalajesId(id){
    const url = `${process.env.REACT_APP_API_URL}/Embalaje/GetById/${id}`;
    return axios.get(url, { headers })
}

export {modificarEmbalajes, agregarEmbalajes, eliminarEmbalajes, obtenerEmbalajes, obtenerEmbalajesId}