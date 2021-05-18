import axios from "axios";

const headers = {
    'Content-Type': 'application/json',
    //    'access-control-allow-origin': '*'
}

function modificarDepartamentos(id, params){
    const url = `${process.env.REACT_APP_API_URL}/Departamento/Modificar/` + id;
    return axios.put(url, Object.assign({}, params), { headers })
}

function agregarDepartamentos( params){
    const url = `${process.env.REACT_APP_API_URL}/Departamento/Agregar`;
    return axios.post(url, Object.assign({}, params), { headers })
}

function eliminarDepartamentos(id){
    const url = `${process.env.REACT_APP_API_URL}/Departamento/Eliminar/` + id;
    return axios.delete(url, { headers })
}

function obtenerDepartamentos(){
    const url = `${process.env.REACT_APP_API_URL}/Departamentos/GetListado`;
    return axios.get(url, { headers })
}

function obtenerDepartamentosId(id){
    const url = `${process.env.REACT_APP_API_URL}/Departamento/GetById/${id}`;
    return axios.get(url, { headers })
}

export {modificarDepartamentos, agregarDepartamentos, eliminarDepartamentos, obtenerDepartamentos, obtenerDepartamentosId}