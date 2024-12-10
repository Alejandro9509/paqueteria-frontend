import axios from "axios";
import { trackPromise } from "react-promise-tracker";
import { API_HEADERS } from "../../Constants";

const headers = API_HEADERS


function obtenerDetalleParadasIdInformes(id) {
    const url =
            `${process.env.REACT_APP_API_URL}/Viajes/GetDetalleParadaByIdInforme/` +
            id;
    let result;
    trackPromise(
        result =  axios.get(url, { headers })
        );
    return result
}

function obtenerDetalleParadasIdViaje(id) {
    const url =
        `${process.env.REACT_APP_REPORT_URL}/api/Informes/GetPardasIdViaje/` +
        id;
    let result;
    trackPromise(
        result =  axios.get(url, { headers })
    );
    return result
}

export { obtenerDetalleParadasIdInformes, obtenerDetalleParadasIdViaje}