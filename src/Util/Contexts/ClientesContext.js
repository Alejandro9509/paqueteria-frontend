import axios from "axios";

const headers = {
    'Content-Type': 'application/json',
    //    'access-control-allow-origin': '*'
}

function modificarCliente(id, params){
    const url = `${process.env.REACT_APP_API_URL}/Clientes/Modificar/` + id;
    return axios.put(url, Object.assign({}, params), { headers })
}

function agregarCliente( params){
    const url = `${process.env.REACT_APP_API_URL}/Clientes/Agregar`;
    return axios.post(url, Object.assign({}, params), { headers })
}

function eliminarCliente(id){
    const url = `${process.env.REACT_APP_API_URL}/Clientes/Eliminar/` + id;
    return axios.delete(url, { headers })
}

function obtenerCliente(){
    const url = `${process.env.REACT_APP_API_URL}/Clientes/GetListado`;
    return axios.get(url, { headers })
}
function validarNumeroCliente(state){
    const url = `${process.env.REACT_APP_API_URL}/Clientes/ValidaNumeroCliente/` + state.numeroCliente + `/${state.idCliente}`;
    return axios.get(url, { headers })
}

function obtenerClienteId(id){
    const url = `${process.env.REACT_APP_API_URL}/Clientes/GetById/${id}`;
    return axios.get(url, { headers })
}

export {modificarCliente, agregarCliente, eliminarCliente, obtenerCliente, obtenerClienteId, validarNumeroCliente}