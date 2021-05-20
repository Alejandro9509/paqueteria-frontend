import axios from "axios";

const headers = {
    'Content-Type': 'application/json',
    //    'access-control-allow-origin': '*'
}

function modificarUsuarios(id, params){
    const url = `${process.env.REACT_APP_API_URL}/Usuarios/Modificar/` + id;
    return axios.put(url, Object.assign({}, params), { headers })
}

function agregarUsuarios( params){
    const url = `${process.env.REACT_APP_API_URL}/Usuarios/Agregar`;
    return axios.post(url, Object.assign({}, params), { headers })
}

function eliminarUsuarios(id){
    const url = `${process.env.REACT_APP_API_URL}/Usuarios/Eliminar/` + id;
    return axios.delete(url, { headers })
}

function obtenerUsuarios(){
    const url = `${process.env.REACT_APP_API_URL}/Usuarios/GetListado`;
    return axios.get(url, { headers })
}

function obtenerUsuariosId(id){
    const url = `${process.env.REACT_APP_API_URL}/Usuarios/GetById/${id}`;
    return axios.get(url, { headers })
}

export {modificarUsuarios, agregarUsuarios, eliminarUsuarios, obtenerUsuarios, obtenerUsuariosId}