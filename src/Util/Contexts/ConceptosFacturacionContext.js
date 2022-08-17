import axios from "axios";
import { trackPromise } from "react-promise-tracker";
import { API_HEADERS } from "../../Constants";

const headers = API_HEADERS


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
    const url = `${process.env.REACT_APP_REPORT_URL}/api/ConceptosFacturacion/GetListado`;
    let result;
    trackPromise(
        result =  axios.get(url, { headers })
        );
    return result
}

function obtenerImpuestosByConceptosFacturacion(id){
    const url = `${process.env.REACT_APP_API_URL}/ConceptosFacturacion/GetImpuestosByIdConcepto/`+id;
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

function obtenerSATUnidades(){
    const url = `${process.env.REACT_APP_API_URL}/SAT/GetListadoUnidades`;
    let result;
    trackPromise(
        result =  axios.get(url, { headers })
    );
    return result
}

function obtenerSATEmbalajes(){
    const url = `${process.env.REACT_APP_API_URL}/SAT/GetListadoEmbalajes`;
    let result;
    trackPromise(
        result =  axios.get(url, { headers })
    );
    return result
}

function obtenerSATMaterialPeligroso(){
    const url = `${process.env.REACT_APP_API_URL}/SAT/GetListadoMaterialPeligroso`;
    let result;
    trackPromise(
        result =  axios.get(url, { headers })
    );
    return result
}

function obtenerSATFraccionArancelaria(){
    const url = `${process.env.REACT_APP_API_URL}/SAT/GetListadoFraccion`;
    let result;
    trackPromise(
        result =  axios.get(url, { headers })
    );
    return result
}

function obtenerSATServicios(){
    const url = `${process.env.REACT_APP_API_URL}/SAT/GetListadoProductosServicios`;
    let result;
    trackPromise(
        result =  axios.get(url, { headers })
    );
    return result
}
function obtenerSATPaginado(registros, pagina, catalogo, busqueda){

    const url = `${process.env.REACT_APP_REPORT_URL}/api/SAT/GetListadoPaginado/${registros}/${pagina}`;
    let result;
    trackPromise(
        result =  axios.put(url, Object.assign({}, {busqueda: busqueda, catalogo: catalogo}), { headers })
    );
    return result
}

function obtenerConceptosDefectoListado(){
    const url = `${process.env.REACT_APP_API_URL}/ConceptosDefecto/GetListado`;
    let result;
    trackPromise(
        result =  axios.get(url, { headers })
    );
    return result
}

export {obtenerSATFraccionArancelaria,obtenerSATMaterialPeligroso, obtenerSATPaginado,obtenerSATEmbalajes,obtenerSATServicios,obtenerSATUnidades,obtenerImpuestosByConceptosFacturacion,modificarConceptosFacturacion, agregarConceptosFacturacion, eliminarConceptosFacturacion, obtenerConceptosFacturacion, obtenerConceptosFacturacionId, obtenerSAT, obtenerConceptosFacturacionManiobra, obtenerConceptosFacturacionEntrega, obtenerConceptosFacturacionRecoleccion, obtenerConceptosDefectoListado}