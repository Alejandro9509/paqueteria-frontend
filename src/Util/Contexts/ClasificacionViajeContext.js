import axios from "axios";

const headers = {
    'Content-Type': 'application/json',
    //    'access-control-allow-origin': '*'
}

function modificarClasificacionViaje(id, params){
    const url = `${process.env.REACT_APP_API_URL}/ClasificacionViajes/Modificar/` + id;
    return axios.put(url, Object.assign({}, params), { headers })
}

function agregarClasificacionViaje( params){
    const url = `${process.env.REACT_APP_API_URL}/ClasificacionViajes/Agregar`;
    return axios.post(url, Object.assign({}, params), { headers })
}

function eliminarClasificacionViaje(id){
    const url = `${process.env.REACT_APP_API_URL}/ClasificacionViajes/Eliminar/` + id;
    return axios.delete(url, { headers })
}

function obtenerClasificacionViaje(){
    const url = `${process.env.REACT_APP_API_URL}/ClasificacionViajes/GetListado`;
    return axios.get(url, { headers })
}

function obtenerClasificacionViajeId(id){
    const url = `${process.env.REACT_APP_API_URL}/ClasificacionViajes/GetById/${id}`;
    return axios.get(url, { headers })
}

export {modificarClasificacionViaje, agregarClasificacionViaje, eliminarClasificacionViaje, obtenerClasificacionViaje, obtenerClasificacionViajeId}