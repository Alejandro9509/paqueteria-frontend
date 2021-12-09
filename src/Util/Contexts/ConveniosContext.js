import axios from "axios";
import { trackPromise } from "react-promise-tracker";
import { API_HEADERS } from "../../Constants";

const headers = API_HEADERS

function obtenerConvenios () {
    const url = `${process.env.REACT_APP_REPORT_URL}/api/Convenios/GetListado`;
    let result;
    trackPromise(
        result =  axios.get(url, { headers })
    );
    return result
}

function obtenerConveniosId (id) {
    const url = `${process.env.REACT_APP_REPORT_URL}/api/Convenios/GetById/${id}`;
    let result;
    trackPromise(
        result =  axios.get(url, { headers })
    );
    return result
}

export {obtenerConvenios, obtenerConveniosId}