import axios from "axios";
import { trackPromise } from "react-promise-tracker";
import { API_HEADERS } from "../../Constants";

const headers = API_HEADERS


function agregarFolios( params){
    const url = `${process.env.REACT_APP_API_URL}/Folios/Agregar`;
    let result;
    trackPromise(
        result =  axios.post(url, Object.assign({}, params), { headers })
        );
    return result
}

function eliminarFolios(id, idEliminadoPor){
    const url = `${process.env.REACT_APP_API_URL}/Folios/Eliminar/` + id + `${idEliminadoPor}`;
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