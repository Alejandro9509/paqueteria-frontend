import axios from "axios";

const headers = {
    'Content-Type': 'application/json',
    //    'access-control-allow-origin': '*'
}

function modificarGrupoClientes(id, params){
    const url = `${process.env.REACT_APP_API_URL}/GruposClientes/Modificar/` + id;
    return axios.put(url, Object.assign({}, params), { headers })
}

function agregarGrupoClientes( params){
    const url = `${process.env.REACT_APP_API_URL}/GruposClientes/Agregar`;
    return axios.post(url, Object.assign({}, params), { headers })
}

function eliminarGrupoClientes(id){
    const url = `${process.env.REACT_APP_API_URL}/GruposClientes/Eliminar/` + id;
    return axios.delete(url, { headers })
}

function obtenerGrupoClientes(){
    const url = `${process.env.REACT_APP_API_URL}/GruposClientes/GetListado`;
    return axios.get(url, { headers })
}

function obtenerGrupoClientesId(id){
    const url = `${process.env.REACT_APP_API_URL}/GruposClientes/GetById/` + id;
    return axios.get(url, { headers })
}

export {modificarGrupoClientes, agregarGrupoClientes, eliminarGrupoClientes, obtenerGrupoClientesId, obtenerGrupoClientes}