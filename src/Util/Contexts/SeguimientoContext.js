import axios from "axios";
import { trackPromise } from "react-promise-tracker";
import { API_HEADERS } from "../../Constants";

const headers = API_HEADERS


function obtenerInformeFolioTipo(folio, tipo, headersAux ) {
    const url = `${localStorage.getItem("Back") ?? process.env.REACT_APP_REPORT_URL}/api/Seguimeinto/folio/${folio}/tipo/${tipo}`;
    let result;

    trackPromise(
        result = axios.get(url, { headers: headersAux ? headersAux : headers })
    );
    return result
}

function obtenerFoliosSeguimiento() {
    const url = `${localStorage.getItem("Back") ?? process.env.REACT_APP_REPORT_URL}/api/Seguimiento/folios`;
    let result;

    trackPromise(
        result = axios.get(url, { headers: headers })
    );
    return result
}

export {obtenerInformeFolioTipo,obtenerFoliosSeguimiento}