import axios from "axios";
import { trackPromise } from "react-promise-tracker";

const headers = {
    'Content-Type': 'application/json',
    //    'access-control-allow-origin': '*'
}

function modificarInformes(id, params){
    const url = `${process.env.REACT_APP_API_URL}/Informes/Modificar/${id}`;
    let result;
    trackPromise(
        result =  axios.put(url, Object.assign({}, params), { headers })
        );
    return result
}

function cancelarInformes(id, params){
    const url = `${process.env.REACT_APP_API_URL}/Informes/Cancelar/${id}`;
    let result;
    trackPromise(
        result =  axios.put(url, Object.assign({}, params), { headers })
        );
    return result
}

function agregarInformes( params){
    const url = `${process.env.REACT_APP_API_URL}/Informes/Agregar`;
    let result;
    trackPromise(
        result =  axios.post(url, Object.assign({}, params), { headers })
        );
    return result
}

function eliminarInformes(id){
    const url = `${process.env.REACT_APP_API_URL}/Unidadd/Eliminar/` + id; //TODO: Cambiar a servicio de eliminar informe
    let result;
    trackPromise(
        result =  axios.delete(url, { headers })
        );
    return result
}

function obtenerInformes(){
    const url = `${process.env.REACT_APP_API_URL}/Informes/GetListado`;
    let result;
    trackPromise(
        result =  axios.get(url, { headers })
        );
    return result
}

function obtenerInformesId(id){
    const url = `${process.env.REACT_APP_API_URL}/Informes/GetById/${id}`;
    let result;
    trackPromise(
        result =  axios.get(url, { headers })
        );
    return result
}

export {modificarInformes, agregarInformes, eliminarInformes, obtenerInformes, obtenerInformesId, cancelarInformes }