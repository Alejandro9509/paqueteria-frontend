import axios from "axios";
import { trackPromise } from "react-promise-tracker";
import { API_HEADERS } from "../../Constants";

const headers = API_HEADERS


function obtenerUnidadesMedida() {
    const url = `${process.env.REACT_APP_REPORT_URL}/api/UnidadesMedida/GetListado`;
    let result;
    trackPromise(
        result =  axios.get(url, { headers })
        );
    return result
}

export {obtenerUnidadesMedida}