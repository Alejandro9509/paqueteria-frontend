import axios from "axios";

const headers = {
    'Content-Type': 'application/json',
    //    'access-control-allow-origin': '*'
}

function modificarCodigoPostal(id, params){
    const url = `${process.env.REACT_APP_API_URL}/CodigoPostal/Modificar/` + id;
    return axios.put(url, Object.assign({}, params), { headers })
}

function agregarCodigoPostal( params){
    const url = `${process.env.REACT_APP_API_URL}/CodigoPostal/Agregar`;
    return axios.post(url, Object.assign({}, params), { headers })
}

function eliminarCodigoPostal(id){
    const url = `${process.env.REACT_APP_API_URL}/CodigoPostal/Eliminar/` + id;
    return axios.delete(url, { headers })
}

function obtenerCodigoPostalCiudad(id){
    const url = `${process.env.REACT_APP_API_URL}/Ciudades/GetListadoCP/` + id;
    return axios.get(url, { headers })
}

function obtenerCodigoPostal(){
    const url = `${process.env.REACT_APP_API_URL}/CodigoPostal/GetListado` ;
    return axios.get(url, { headers })
}
function obtenerCodigoPostalEstado(idEstado){
    const url = `${process.env.REACT_APP_API_URL}/CodigoPostal/GetListadoPorEstado/` + idEstado;
    return axios.get(url, { headers })
}

function obtenerCodigoPostalId(id){
    const url = `${process.env.REACT_APP_API_URL}/CodigoPostal/GetById/${id}`;
    return axios.get(url, { headers })
}

export {modificarCodigoPostal, agregarCodigoPostal, eliminarCodigoPostal, obtenerCodigoPostalId, obtenerCodigoPostalCiudad, obtenerCodigoPostal, obtenerCodigoPostalEstado}