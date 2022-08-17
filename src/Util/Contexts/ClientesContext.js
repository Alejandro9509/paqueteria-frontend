import axios from "axios";
import { trackPromise } from "react-promise-tracker";
import { API_HEADERS } from "../../Constants";

const headers = API_HEADERS


function modificarCliente(id, params){
    const url = `${process.env.REACT_APP_API_URL}/Clientes/Modificar/` + id;
    let result;
    trackPromise(
        result =  axios.put(url, Object.assign({}, params), { headers })
        );
    return result
}

function agregarCliente( params){
    const url = `${process.env.REACT_APP_API_URL}/Clientes/Agregar`;
    let result;
    trackPromise(
        result =  axios.post(url, Object.assign({}, params), { headers })
        );
    return result
}

function eliminarCliente(id, idEliminadoPor){
    const url = `${process.env.REACT_APP_API_URL}/Clientes/Eliminar/` + id + `/${idEliminadoPor}`;
    let result;
    trackPromise(
        result =  axios.delete(url, { headers })
        );
    return result
}

function obtenerCliente(){
    const url = `${process.env.REACT_APP_REPORT_URL}/api/Clientes/GetListado`;
    let result;
    trackPromise(
        result =  axios.get(url, { headers })
        );
    return result
}
function obtenerClientePaginado(pagina,registros,busqueda){
    const url = `${process.env.REACT_APP_REPORT_URL}/api/Client/GetListadoPaginado/${pagina}/${registros}`;
    let result;
    trackPromise(
        result =  axios.put(url, Object.assign({}, {busqueda: busqueda}), { headers })
        );
    return result
}
function validarNumeroCliente(state){
    const url = `${process.env.REACT_APP_API_URL}/Clientes/ValidaNumeroCliente/` + state.numeroCliente + `/${state.idCliente}`;
    let result;
    trackPromise(
        result =  axios.get(url, { headers })
        );
    return result
}

function obtenerClienteId(id){
    const url = `${process.env.REACT_APP_REPORT_URL}/api/Clientes/GetById/${id}`;
    let result;
    trackPromise(
        result =  axios.get(url, { headers })
        );
    return result
}

function obtenerClientePublicoGeneral(){
    const url = `${process.env.REACT_APP_REPORT_URL}/api/Clientes/GetPublicoGeneral`;
    let result;
    trackPromise(
        result =  axios.get(url, { headers })
    );
    return result
}

function obtenerClienteTieneConvenio(idCliente, idTipoTarifa){
    const url = `${process.env.REACT_APP_REPORT_URL}/api/Clientes/ValidarTieneConvenio/${idCliente}/${idTipoTarifa}`;
    let result;
    trackPromise(
        result =  axios.get(url, { headers })
    );
    return result
}

export {obtenerClienteTieneConvenio,modificarCliente, agregarCliente, eliminarCliente, obtenerCliente, obtenerClienteId, validarNumeroCliente,obtenerClientePaginado,obtenerClientePublicoGeneral}