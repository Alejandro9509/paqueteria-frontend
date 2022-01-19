import axios from "axios";
import { trackPromise } from "react-promise-tracker";
import { API_HEADERS } from "../../Constants";

const headers = API_HEADERS

function obtenerInformeFolioTipo(folio, tipo ) {
    const url = `${process.env.REACT_APP_API_URL_LOCAL}/api/Seguimeinto/folio/${folio}/tipo/${tipo}`;
    let result;
    trackPromise(
        result = axios.get(url, { headers })
    );
    return result
}

export {obtenerInformeFolioTipo}