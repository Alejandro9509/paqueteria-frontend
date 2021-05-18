import axios from "axios";

const headers = {
    'Content-Type': 'application/json',
    //    'access-control-allow-origin': '*'
}

function modificarEstatusViaje(id, params){
    const url = `${process.env.REACT_APP_API_URL}/Estatusviajes/Modificar/` + id;
    return axios.put(url, Object.assign({}, params), { headers })
}

function agregarEstatusViaje( params){
    const url = `${process.env.REACT_APP_API_URL}/Estatusviajes/Agregar`;
    return axios.post(url, Object.assign({}, params), { headers })
}

function eliminarEstatusViaje(id){
    const url = `${process.env.REACT_APP_API_URL}/Estatusviajes/Eliminar/` + id;
    return axios.delete(url, { headers })
}

function obtenerEstatusViaje(){
    const url = `${process.env.REACT_APP_API_URL}/Estatusviajes/GetListado`;
    return axios.get(url, { headers })
}

function obtenerEstatusViajeId(id){
    const url = `${process.env.REACT_APP_API_URL}/Estatusviajes/GetById/${id}`;
    return axios.get(url, { headers })
}

export {modificarEstatusViaje, agregarEstatusViaje, eliminarEstatusViaje, obtenerEstatusViaje, obtenerEstatusViajeId}