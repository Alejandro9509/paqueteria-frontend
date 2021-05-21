import axios from "axios";
import { trackPromise } from "react-promise-tracker";

const headers = {
    'Content-Type': 'application/json',
    //    'access-control-allow-origin': '*'
}


function agregarFolios( params){
    const url = `${process.env.REACT_APP_API_URL}/Folios/Agregar`;
    let result;
    trackPromise(
        result =  axios.post(url, Object.assign({}, params), { headers })
        );
    return result
}

function eliminarFolios(id){
    const url = `${process.env.REACT_APP_API_URL}/Folios/Eliminar/` + id;
    let result;
    trackPromise(
        result =  axios.delete(url, { headers })
        );
    return result
}

function obtenerFolios(){
    const url = `${process.env.REACT_APP_API_URL}/Folios/GetListado`;
    let result;
    trackPromise(
        result =  axios.get(url, { headers })
        );
    return result
}

function obtenerFoliosId(id){
    const url = `${process.env.REACT_APP_API_URL}/Folios/GetByIdUsuario/` + id;
    let result;
    trackPromise(
        result =  axios.get(url, { headers })
        );
    return result
}

export { agregarFolios, eliminarFolios, obtenerFolios, obtenerFoliosId}