import axios from "axios";

const headers = {
    'Content-Type': 'application/json',
    //    'access-control-allow-origin': '*'
}

function modificarCiudad(id, params){
    const url = `${process.env.REACT_APP_API_URL}/Ciudades/Modificar/` + id;
    return axios.put(url, Object.assign({}, params), { headers })
}

function agregarCiudad( params){
    const url = `${process.env.REACT_APP_API_URL}/Ciudades/Agregar`;
    return axios.post(url, Object.assign({}, params), { headers })
}

function eliminarCiudad(id){
    const url = `${process.env.REACT_APP_API_URL}/Ciudades/Eliminar/` + id;
    return axios.delete(url, { headers })
}

function obtenerCiudades(){
    const url = `${process.env.REACT_APP_API_URL}/Ciudades/GetListado`;
    return axios.get(url, { headers })
}

function obtenerCiudadId(id){
    const url = `${process.env.REACT_APP_API_URL}/Ciudades/GetById/${id}`;
    return axios.get(url, { headers })
}

export {modificarCiudad, agregarCiudad, eliminarCiudad, obtenerCiudadId, obtenerCiudades}