import axios from "axios";
import { trackPromise } from "react-promise-tracker";
import { API_HEADERS } from "../../Constants";

const headers = API_HEADERS


function modificarCuentasCorreo(id, params){
    const url = `${process.env.REACT_APP_API_URL}/CuentasCorreo/Modificar/` + id;
    let result;
    trackPromise(
        result =  axios.post(url, Object.assign({}, params), { headers })
        );
    return result
}

function agregarCuentasCorreo( params){
    const url = `${process.env.REACT_APP_API_URL}/CuentasCorreo/Agregar`;
    let result;
    trackPromise(
        result =  axios.post(url, Object.assign({}, params), { headers })
        );
    return result
}

function eliminarCuentasCorreo(id){
    const url = `${process.env.REACT_APP_API_URL}/CuentasCorreo/Eliminar/` + id;
    let result;
    trackPromise(
        result =  axios.delete(url, { headers })
        );
    return result
}

function obtenerCuentasCorreo(){
    const url = `${process.env.REACT_APP_API_URL}/CuentasCorreo/GetListado`;
    let result;
    trackPromise(
        result =  axios.get(url, { headers })
        );
    return result
}

function obtenerCuentasCorreoUsuarioId(id){
    const url = `${process.env.REACT_APP_API_URL}/CuentasCorreo/GetByIdUsuario/` + id;
    let result;
    trackPromise(
        result =  axios.get(url, { headers })
        );
    return result
}

export {modificarCuentasCorreo, agregarCuentasCorreo, eliminarCuentasCorreo, obtenerCuentasCorreo, obtenerCuentasCorreoUsuarioId}