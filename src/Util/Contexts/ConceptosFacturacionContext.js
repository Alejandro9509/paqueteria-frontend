import axios from "axios";
import { trackPromise } from "react-promise-tracker";

const headers = {
    'Content-Type': 'application/json',
    //    'access-control-allow-origin': '*'
}

function modificarConceptosFacturacion(id, params){
    const url = `${process.env.REACT_APP_API_URL}/ConceptosFacturacion/Modificar/` + id;
    let result;
    trackPromise(
        result =  axios.put(url, Object.assign({}, params), { headers })
        );
    return result
}

function agregarConceptosFacturacion( params){
    const url = `${process.env.REACT_APP_API_URL}/ConceptosFacturacion/Agregar`;
    let result;
    trackPromise(
        result =  axios.post(url, Object.assign({}, params), { headers })
        );
    return result
}

function eliminarConceptosFacturacion(id, idEliminadoPor){
    const url = `${process.env.REACT_APP_API_URL}/ConceptosFacturacion/Eliminar/` + id + `/${idEliminadoPor}`;
    let result;
    trackPromise(
        result =  axios.delete(url, { headers })
        );
    return result
}

function obtenerConceptosFacturacion(){
    const url = `${process.env.REACT_APP_API_URL}/ConceptosFacturacion/GetListado`;
    let result;
    trackPromise(
        result =  axios.get(url, { headers })
        );
    return result
}

function obtenerConceptosFacturacionManiobra(){
    const url = `${process.env.REACT_APP_API_URL}/ConceptosFacturacion/GetListado/Maniobra`;
    let result;
    trackPromise(
        result =  axios.get(url, { headers })
        );
    return result
}

function obtenerConceptosFacturacionEntrega(){
    const url = `${process.env.REACT_APP_API_URL}/ConceptosFacturacion/GetListado/Entrega`;
    let result;
    trackPromise(
        result =  axios.get(url, { headers })
        );
    return result
}

function obtenerConceptosFacturacionRecoleccion(){
    const url = `${process.env.REACT_APP_API_URL}/ConceptosFacturacion/GetListado/Recoleccion`;
    let result;
    trackPromise(
        result =  axios.get(url, { headers })
        );
    return result
}

function obtenerConceptosFacturacionId(id){
    const url = `${process.env.REACT_APP_API_URL}/ConceptosFacturacion/GetById/` + id;
    let result;
    trackPromise(
        result =  axios.get(url, { headers })
        );
    return result
}

function obtenerSAT(){
    const url = `${process.env.REACT_APP_API_URL}/ConceptosFacturacion/GetListadoSAT`;
    let result;
    trackPromise(
        result =  axios.get(url, { headers })
        );
    return result
}

export {modificarConceptosFacturacion, agregarConceptosFacturacion, eliminarConceptosFacturacion, obtenerConceptosFacturacion, obtenerConceptosFacturacionId, obtenerSAT, obtenerConceptosFacturacionManiobra, obtenerConceptosFacturacionEntrega, obtenerConceptosFacturacionRecoleccion}