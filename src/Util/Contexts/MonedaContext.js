import axios from "axios";
import { trackPromise } from "react-promise-tracker";
import { API_HEADERS } from "../../Constants";

const headers = API_HEADERS


function modificarMonedas(id, params){
    const url = `${localStorage.getItem("Back") ?? process.env.REACT_APP_REPORT_URL}/api/Moneda/Modificar/` + id;
    let result;
    trackPromise(
        result =  axios.put(url, Object.assign({}, params), { headers })
        );
    return result
}

function agregarMonedas( params){
    const url = `${localStorage.getItem("Back") ?? process.env.REACT_APP_REPORT_URL}/api/Moneda/Agregar`;
    let result;
    trackPromise(
        result =  axios.post(url, Object.assign({}, params), { headers })
        );
    return result
}

function eliminarMonedas(id){
    const url = `${localStorage.getItem("Back") ?? process.env.REACT_APP_REPORT_URL}/api/Moneda/Eliminar/` + id;
    let result;
    trackPromise(
        result =  axios.delete(url, { headers })
        );
    return result
}

function obtenerMonedas(){
    const url = `${localStorage.getItem("Back") ?? process.env.REACT_APP_REPORT_URL}/api/Moneda/GetListado`;
    let result;
    trackPromise(
        result =  axios.get(url, { headers })
        );
    return result
}

function obtenerMonedasId(id){
    const url = `${localStorage.getItem("Back") ?? process.env.REACT_APP_REPORT_URL}/api/Moneda/GetById/${id}`;
    let result;
    trackPromise(
        result =  axios.get(url, { headers })
        );
    return result
}

export {
    modificarMonedas,
    agregarMonedas,
    eliminarMonedas,
    obtenerMonedas,
    obtenerMonedasId
}