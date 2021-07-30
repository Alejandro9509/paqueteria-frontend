import axios from "axios";
import { trackPromise } from "react-promise-tracker";

const headers = {
    'Content-Type': 'application/json',
    //    'access-control-allow-origin': '*'
}

function modificarSucursales(id, params) {
    const url = `${process.env.REACT_APP_API_URL}/Sucursales/Modificar/` + id;
    let result;
    trackPromise(
        result =  axios.put(url, Object.assign({}, params), { headers })
        );
    return result
}

function agregarSucursales(params) {
    const url = `${process.env.REACT_APP_API_URL}/Sucursales/Agregar`;
    let result;
    trackPromise(
        result =  axios.post(url, Object.assign({}, params), { headers })
        );
    return result
}

function eliminarSucursales(id, idEliminadoPor) {
    const url = `${process.env.REACT_APP_API_URL}/Sucursales/Eliminar/` + id + `/${idEliminadoPor}`;
    let result;
    trackPromise(
        result =  axios.delete(url, { headers })
        );
    return result
}

function obtenerSucursales() {
    const url = `${process.env.REACT_APP_API_URL}/Sucursales/GetListado`;
    let result;
    trackPromise(
        result =  axios.get(url, { headers })
        );
    return result
}

function obtenerSucursalesId(id) {
    const url = `${process.env.REACT_APP_API_URL}/Sucursales/GetById/` + id;
    let result;
    trackPromise(
        result =  axios.get(url, { headers })
        );
    return result
}

function obtenerListadoImpuestos(){
    const url = `${process.env.REACT_APP_API_URL}/Impuestos/GetListado`;
    let result;
    trackPromise(
        result =  axios.get(url, { headers })
    );
    return result
}

export { modificarSucursales, agregarSucursales, eliminarSucursales, obtenerSucursalesId, obtenerSucursales, obtenerListadoImpuestos }