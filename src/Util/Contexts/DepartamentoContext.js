import axios from "axios";
import { trackPromise } from "react-promise-tracker";

const headers = {
    'Content-Type': 'application/json',
    //    'access-control-allow-origin': '*'
}

function modificarDepartamentos(id, params){
    const url = `${process.env.REACT_APP_API_URL}/Departamento/Modificar/` + id;
    let result;
    trackPromise(
        result =  axios.put(url, Object.assign({}, params), { headers })
        );
    return result
}

function agregarDepartamentos( params){
    const url = `${process.env.REACT_APP_API_URL}/Departamento/Agregar`;
    let result;
    trackPromise(
        result =  axios.post(url, Object.assign({}, params), { headers })
        );
    return result
}

function eliminarDepartamentos(id){
    const url = `${process.env.REACT_APP_API_URL}/Departamento/Eliminar/` + id;
    let result;
    trackPromise(
        result =  axios.delete(url, { headers })
        );
    return result
}

function obtenerDepartamentos(){
    const url = `${process.env.REACT_APP_API_URL}/Departamentos/GetListado`;
    let result;
    trackPromise(
        result =  axios.get(url, { headers })
        );
    return result
}

function obtenerDepartamentosId(id){
    const url = `${process.env.REACT_APP_API_URL}/Departamento/GetById/${id}`;
    let result;
    trackPromise(
        result =  axios.get(url, { headers })
        );
    return result
}

export {modificarDepartamentos, agregarDepartamentos, eliminarDepartamentos, obtenerDepartamentos, obtenerDepartamentosId}