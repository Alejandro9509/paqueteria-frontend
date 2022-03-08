import axios from "axios";
import { trackPromise } from "react-promise-tracker";
import { API_HEADERS } from "../../Constants";

const headers = API_HEADERS

function obtenerUnidadesMedida() {
    const url = `${process.env.REACT_APP_API_URL_LOCAL}/api/UnidadesMedida/GetListado`;
    let result;
    trackPromise(
        result =  axios.get(url, { headers })
        );
    return result
}
function obtenerUnidadesMedidaId(id) {
    const url = `${process.env.REACT_APP_API_URL}/Unidad/GetById/` + id;
    let result;
    trackPromise(
        result =  axios.get(url, { headers })
        );
    return result
}

export {obtenerUnidadesMedida}