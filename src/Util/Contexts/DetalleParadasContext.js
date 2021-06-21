import axios from "axios";
import { trackPromise } from "react-promise-tracker";

const headers = {
    'Content-Type': 'application/json',
    //    'access-control-allow-origin': '*'
}

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

export { obtenerDetalleParadasIdInformes}