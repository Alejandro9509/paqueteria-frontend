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

function agregarConvenio (params) {
    const url = `${process.env.REACT_APP_API_URL}/Convenios/Agregar`;
    let result;
    trackPromise(
        result =  axios.post(url, Object.assign({}, params),{ headers })
    );
    return result
}
function modificarConvenio (idConvenio, params) {
    const url = `${process.env.REACT_APP_API_URL}/Convenios/Modificar/${idConvenio}`;
    let result;
    trackPromise(
        result =  axios.put(url, Object.assign({}, params),{ headers })
    );
    return result
}

export {modificarConvenio,agregarConvenio, obtenerConvenios, obtenerConveniosId}