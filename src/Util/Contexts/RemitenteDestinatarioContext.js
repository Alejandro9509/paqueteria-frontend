import axios from "axios";

const headers = {
    'Content-Type': 'application/json',
    //    'access-control-allow-origin': '*'
}

function modificarRemitentesDestinatarios(id, params){
    const url = `${process.env.REACT_APP_API_URL}/RemitentesDestinatarios/Modificar/` + id;
    return axios.put(url, Object.assign({}, params), { headers })
}

function agregarRemitentesDestinatarios( params){
    const url = `${process.env.REACT_APP_API_URL}/RemitentesDestinatarios/Agregar`;
    return axios.post(url, Object.assign({}, params), { headers })
}

function eliminarRemitentesDestinatarios(id){
    const url = `${process.env.REACT_APP_API_URL}/RemitentesDestinatarios/Eliminar/` + id;
    return axios.delete(url, { headers })
}

function obtenerRemitentesDestinatarios(){
    const url = `${process.env.REACT_APP_API_URL}/RemitentesDestinatarios/GetListado`;
    return axios.get(url, { headers })
}
function validarNumeroRemitente(state){
    const url = `${process.env.REACT_APP_API_URL}/RemitentesDestinatarios/ValidaNumeroRemDes/` + state.numero;
    return axios.get(url, { headers })
}

function obtenerRemitentesDestinatariosId(id){
    const url = `${process.env.REACT_APP_API_URL}/RemitentesDestinatarios/GetById/${id}`;
    return axios.get(url, { headers })
}

export {modificarRemitentesDestinatarios, agregarRemitentesDestinatarios, eliminarRemitentesDestinatarios, obtenerRemitentesDestinatarios, obtenerRemitentesDestinatariosId, validarNumeroRemitente}