import axios from "axios";
import { trackPromise } from "react-promise-tracker";
import { API_HEADERS } from "../../Constants";

const headers = API_HEADERS


function modificarCodigoPostal(id, params){
    const url = `${process.env.REACT_APP_API_URL}/CodigoPostal/Modificar/` + id;
    let result;
    trackPromise(
        result =  axios.put(url, Object.assign({}, params), { headers })
        );
    return result
}

function agregarCodigoPostal( params){
    const url = `${process.env.REACT_APP_API_URL}/CodigoPostal/Agregar`;
    let result;
    trackPromise(
        result =  axios.post(url, Object.assign({}, params), { headers })
        );
    return result
}

function eliminarCodigoPostal(id){
    const url = `${process.env.REACT_APP_API_URL}/CodigoPostal/Eliminar/` + id;
    let result;
    trackPromise(
        result =  axios.delete(url, { headers })
        );
    return result
}

function obtenerCodigoPostalCiudad(id){
    const url = `${process.env.REACT_APP_API_URL}/Ciudades/GetListadoCP/` + id;
    let result;
    trackPromise(
        result =  axios.get(url, { headers })
        );
    return result
}



function obtenerCodigoPostal(){
    const url = `${process.env.REACT_APP_API_URL}/CodigoPostal/GetListado` ;
    let result;
    trackPromise(
        result =  axios.get(url, { headers })
        );
    return result
}
function obtenerCodigoPostalEstado(idEstado){
    const url = `${process.env.REACT_APP_API_URL}/CodigoPostal/GetListadoPorEstado/` + idEstado;
    let result;
    trackPromise(
        result =  axios.get(url, { headers })
        );
    return result
}

function obtenerCodigoPostalId(id){
    const url = `${process.env.REACT_APP_REPORT_URL}/CodigoPostal/GetById/${id}`;
    let result;
    trackPromise(
        result =  axios.get(url, { headers })
        );
    return result
}

function obtenerCodigosPostalesPorCiudad(id){
    const url = `${process.env.REACT_APP_API_URL}/CodigoPostal/GetListadoPorCiudad/${id}`;
    let result;
    trackPromise(
        result =  axios.get(url, { headers })
    );
    return result
}

function obtenerCodigosPostalesPorEstadoMunicipio(estado, municipio){
    const url = `${process.env.REACT_APP_API_URL}/CodigoPostal/GetByEstadoMunicipio/${estado}/${municipio}`;
    let result;
    trackPromise(
        result =  axios.get(url, { headers })
    );
    return result
}
export {obtenerCodigosPostalesPorEstadoMunicipio,modificarCodigoPostal, agregarCodigoPostal, eliminarCodigoPostal, obtenerCodigoPostalId, obtenerCodigoPostalCiudad, obtenerCodigoPostal, obtenerCodigoPostalEstado, obtenerCodigosPostalesPorCiudad}