import {trackPromise} from "react-promise-tracker";
import axios from "axios";
import { API_HEADERS } from "../../Constants";

const headers = API_HEADERS


function obtenerMunicipiosByIdEstado(id) {
    const url = `${process.env.REACT_APP_REPORT_URL}/api/Municipios/GetByIdEstado/` + id;
    let result;
    trackPromise(
        result =  axios.get(url, { headers })
    );
    return result
}

export {obtenerMunicipiosByIdEstado}