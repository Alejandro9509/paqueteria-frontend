import axios from "axios";
import { trackPromise } from "react-promise-tracker";
import { API_HEADERS } from "../../Constants";

const headers = API_HEADERS


function obtenerCodigoPostalCiudad(id){
    const url = `${process.env.REACT_APP_REPORT_URL}/api/Ciudades/GetListadoCP/` + id;
    let result;
    trackPromise(
        result =  axios.get(url, { headers })
        );
    return result
}

function obtenerCodigoPostal(){
    const url = `${process.env.REACT_APP_REPORT_URL}/api/CodigoPostal/GetListado` ;
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
    const url = `${process.env.REACT_APP_REPORT_URL}/api/CodigoPostal/GetById/${id}`;
    let result;
    trackPromise(
        result =  axios.get(url, { headers })
        );
    return result
}

function obtenerCodigoPostalPorCodigo(code){
    const url = `${process.env.REACT_APP_REPORT_URL}/api/CodigoPostal/GetByCode/${code}`;
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
    const url = `${process.env.REACT_APP_REPORT_URL}/api/CodigoPostal/GetByEstadoMunicipio/${estado}/${municipio}`;
    let result;
    trackPromise(
        result =  axios.get(url, { headers })
    );
    return result
}

function obtenerCodigosPostalesPorEstadoMunicipioDisponibles(estado, municipio){
    const url = `${process.env.REACT_APP_REPORT_URL}/api/CodigoPostal/GetByEstadoMunicipioDisponible/${estado}/${municipio}`;
    let result;
    trackPromise(
        result =  axios.get(url, { headers })
    );
    return result
}
export {
    obtenerCodigosPostalesPorEstadoMunicipio,
    obtenerCodigoPostalId,
    obtenerCodigoPostalPorCodigo,
    obtenerCodigoPostalCiudad,
    obtenerCodigoPostal,
    obtenerCodigoPostalEstado,
    obtenerCodigosPostalesPorCiudad,
    obtenerCodigosPostalesPorEstadoMunicipioDisponibles
}