import axios from "axios";
import { trackPromise } from "react-promise-tracker";
import { API_HEADERS } from "../../Constants";

const headers = API_HEADERS

function obtenerOperadores() {
    const url = `${process.env.REACT_APP_REPORT_URL}/api/Operadores/GetListado`;
    let result;
    trackPromise(
        result =  axios.get(url, { headers })
        );
    return result
}
function reasignarOperador(idParadaFuente, idOperador) {
    const url = `${process.env.REACT_APP_REPORT_URL}/api/ReasignarOperador/${idParadaFuente}/${idOperador}`;
    let result;
    trackPromise(
        result =  axios.put(url, Object.assign({}, {}), { headers })
    );
    return result
}
function obtenerOperadoresId(id) {
    const url =
            `${process.env.REACT_APP_API_URL}/Operador/GetById/` +
            id;
    let result;
    trackPromise(
        result =  axios.get(url, { headers })
        );
    return result
}

function obtenerOperadoresPorSucursal(idSucursal) {
    const url = `${process.env.REACT_APP_REPORT_URL}/api/Operadores/GetListado/PorSucursal/${idSucursal}`;
    let result;
    trackPromise(
        result =  axios.get(url, { headers })
    );
    return result
}

export { obtenerOperadoresId, reasignarOperador,obtenerOperadores, obtenerOperadoresPorSucursal }