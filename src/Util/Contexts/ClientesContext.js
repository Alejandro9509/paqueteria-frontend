import axios from "axios";
import { trackPromise } from "react-promise-tracker";
import { API_HEADERS } from "../../Constants";

const headers = API_HEADERS


function obtenerCliente(){
    const url = `${localStorage.getItem("Back") ?? process.env.REACT_APP_REPORT_URL}/api/Clientes/GetListado`;
    let result;
    trackPromise(
        result =  axios.get(url, { headers })
        );
    return result
}

function obtenerClientePaginado(pagina,registros,busqueda){
    const url = `${localStorage.getItem("Back") ?? process.env.REACT_APP_REPORT_URL}/api/Client/GetListadoPaginado/${pagina}/${registros}`;
    let result;
    trackPromise(
        result =  axios.put(url, Object.assign({}, {busqueda: busqueda}), { headers })
        );
    return result
}

function obtenerClienteId(id){
    const url = `${localStorage.getItem("Back") ?? process.env.REACT_APP_REPORT_URL}/api/Clientes/GetById/${id}`;
    let result;
    trackPromise(
        result =  axios.get(url, { headers })
        );
    return result
}

function obtenerClientePublicoGeneral(){
    const url = `${localStorage.getItem("Back") ?? process.env.REACT_APP_REPORT_URL}/api/Clientes/GetPublicoGeneral`;
    let result;
    trackPromise(
        result =  axios.get(url, { headers })
    );
    return result
}

function obtenerClienteTieneConvenio(idCliente, idTipoTarifa){
    const url = `${localStorage.getItem("Back") ?? process.env.REACT_APP_REPORT_URL}/api/Clientes/ValidarTieneConvenio/${idCliente}/${idTipoTarifa}`;
    let result;
    trackPromise(
        result =  axios.get(url, { headers })
    );
    return result
}

export {
    obtenerClienteTieneConvenio,
    obtenerCliente,
    obtenerClienteId,
    obtenerClientePaginado,
    obtenerClientePublicoGeneral
}