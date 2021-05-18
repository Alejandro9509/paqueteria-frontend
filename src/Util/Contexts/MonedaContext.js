import axios from "axios";

const headers = {
    'Content-Type': 'application/json',
    //    'access-control-allow-origin': '*'
}

function modificarMonedas(id, params){
    const url = `${process.env.REACT_APP_API_URL}/Moneda/Modificar/` + id;
    return axios.put(url, Object.assign({}, params), { headers })
}

function agregarMonedas( params){
    const url = `${process.env.REACT_APP_API_URL}/Moneda/Agregar`;
    return axios.post(url, Object.assign({}, params), { headers })
}

function eliminarMonedas(id){
    const url = `${process.env.REACT_APP_API_URL}/Moneda/Eliminar/` + id;
    return axios.delete(url, { headers })
}

function obtenerMonedas(){
    const url = `${process.env.REACT_APP_API_URL}/Moneda/GetListado`;
    return axios.get(url, { headers })
}

function obtenerMonedasId(id){
    const url = `${process.env.REACT_APP_API_URL}/Moneda/GetById/${id}`;
    return axios.get(url, { headers })
}

export {modificarMonedas, agregarMonedas, eliminarMonedas, obtenerMonedas, obtenerMonedasId}