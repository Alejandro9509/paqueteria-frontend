import axios from "axios";
import { trackPromise } from "react-promise-tracker";
import { API_HEADERS } from "../../Constants";

const headers = API_HEADERS


function obtenerImpuestos(){
    const url = `${localStorage.getItem("Back") ?? process.env.REACT_APP_REPORT_URL}/api/Impuestos/GetListado`;
    let result;
    trackPromise(
        result =  axios.get(url, { headers })
        );
    return result
}

function obtenerImpuestosTipo(tipo){
    const url = `${process.env.REACT_APP_API_URL}/Impuestos/GetListadoByTipoImpuesto/${tipo}`;
    let result;
    trackPromise(
        result =  axios.get(url, { headers })
        );
    return result
}

export {obtenerImpuestos, obtenerImpuestosTipo }