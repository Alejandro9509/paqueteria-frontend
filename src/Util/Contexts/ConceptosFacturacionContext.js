import axios from "axios";
import { trackPromise } from "react-promise-tracker";
import { API_HEADERS } from "../../Constants";

const headers = API_HEADERS


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
    const url = `${process.env.REACT_APP_REPORT_URL}/api/ConceptosFacturacion/GetListado/Maniobra`;
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

function obtenerSATListado(catalogo,busqueda){

    const url = `${process.env.REACT_APP_REPORT_URL}/api/SAT/GetListado/${catalogo}/${busqueda}`;
    let result;
    trackPromise(
        result =  axios.get(url, { headers })
    );
    return result
}

function obtenerSATBusqueda(catalogo,busqueda){

    const url = `${process.env.REACT_APP_REPORT_URL}/api/SAT/Busqueda/${catalogo}/${busqueda}`;
    let result;
    trackPromise(
        result =  axios.get(url, { headers })
    );
    return result
}

export {
    obtenerSATFraccionArancelaria,
    obtenerSATMaterialPeligroso,
    obtenerSATPaginado,
    obtenerSATEmbalajes,
    obtenerSATServicios,
    obtenerSATUnidades,
    obtenerImpuestosByConceptosFacturacion,
    obtenerConceptosFacturacion,
    obtenerConceptosFacturacionManiobra,
    obtenerConceptosDefectoListado,
    obtenerSATListado,
    obtenerSATBusqueda
}