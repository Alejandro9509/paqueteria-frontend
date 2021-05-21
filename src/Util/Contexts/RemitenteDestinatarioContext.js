import axios from "axios";
import { trackPromise } from "react-promise-tracker";

const headers = {
    'Content-Type': 'application/json',
    //    'access-control-allow-origin': '*'
}

function modificarRemitentesDestinatarios(id, params){
    const url = `${process.env.REACT_APP_API_URL}/RemitentesDestinatarios/Modificar/` + id;
    let result;
    trackPromise(
        result =  axios.put(url, Object.assign({}, params), { headers })
        );
    return result
}

function agregarRemitentesDestinatarios( params){
    const url = `${process.env.REACT_APP_API_URL}/RemitentesDestinatarios/Agregar`;
    let result;
    trackPromise(
        result =  axios.post(url, Object.assign({}, params), { headers })
        );
    return result
}

function eliminarRemitentesDestinatarios(id){
    const url = `${process.env.REACT_APP_API_URL}/RemitentesDestinatarios/Eliminar/` + id;
    let result;
    trackPromise(
        result =  axios.delete(url, { headers })
        );
    return result
}

function obtenerRemitentesDestinatarios(){
    const url = `${process.env.REACT_APP_API_URL}/RemitentesDestinatarios/GetListado`;
    let result;
    trackPromise(
        result =  axios.get(url, { headers })
        );
    return result
}
function validarNumeroRemitente(state){
    const url = `${process.env.REACT_APP_API_URL}/RemitentesDestinatarios/ValidaNumeroRemDes/` + state.numero;
    let result;
    trackPromise(
        result =  axios.get(url, { headers })
        );
    return result
}

function obtenerRemitentesDestinatariosId(id){
    const url = `${process.env.REACT_APP_API_URL}/RemitentesDestinatarios/GetById/${id}`;
    let result;
    trackPromise(
        result =  axios.get(url, { headers })
        );
    return result
}

export {modificarRemitentesDestinatarios, agregarRemitentesDestinatarios, eliminarRemitentesDestinatarios, obtenerRemitentesDestinatarios, obtenerRemitentesDestinatariosId, validarNumeroRemitente}