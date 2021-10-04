import axios from "axios";
import { trackPromise } from "react-promise-tracker";

const headers = {
    'Content-Type': 'application/json',
  //  'TimeZone' : Intl.DateTimeFormat().resolvedOptions().timeZone
    //    'access-control-allow-origin': '*'
}

function modificarUsuarios(id, params){
    const url = `${process.env.REACT_APP_API_URL}/Usuarios/Modificar/` + id;
    let result;
    trackPromise(
        result =  axios.put(url, Object.assign({}, params), { headers })
        );
    return result
}

function agregarUsuarios( params){
    const url = `${process.env.REACT_APP_API_URL}/Usuarios/Agregar`;
    let result;
    trackPromise(
        result =  axios.post(url, Object.assign({}, params), { headers })
        );
    return result
}

function eliminarUsuarios(id, idEliminadoPor){
    const url = `${process.env.REACT_APP_API_URL}/Usuarios/Eliminar/` + id + `/${idEliminadoPor}`;
    let result;
    trackPromise(
        result =  axios.delete(url, { headers })
        );
    return result
}

function obtenerUsuarios(){
    const url = `${process.env.REACT_APP_API_URL}/Usuarios/GetListado`;
    let result;
    trackPromise(
        result =  axios.get(url, { headers })
        );
    return result
}

function obtenerUsuariosId(id){
    const url = `${process.env.REACT_APP_API_URL}/Usuarios/GetById/` + id;
    let result;
    trackPromise(
        result =  axios.get(url, { headers })
        );
    return result
}

function validarPermisos(state){
    const url = `${process.env.REACT_APP_API_URL}/Utilerias/ValidaDerechos/${localStorage.getItem("UsuarioId")}/${state.DerechoBorrar}/3`;
    let result;
    trackPromise(
        result =  axios.get(url, { headers })
        );
    return result
}

function obtenerTipoUsuarios(){
    const url = `${process.env.REACT_APP_API_URL}/TipoUsuario/GetListado`;
    let result;
    trackPromise(
        result =  axios.get(url, { headers })
    );
    return result
}

export {modificarUsuarios, agregarUsuarios, eliminarUsuarios, obtenerUsuarios, obtenerUsuariosId, validarPermisos, obtenerTipoUsuarios}