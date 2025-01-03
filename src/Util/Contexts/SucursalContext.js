import axios from "axios";
import { trackPromise } from "react-promise-tracker";
import { API_HEADERS } from "../../Constants";

const headers = API_HEADERS


function obtenerSucursales() {
    const url = `${localStorage.getItem("Back") ?? process.env.REACT_APP_REPORT_URL}/api/Sucursales/GetListado`;
    let result;
    trackPromise(
        result =  axios.get(url, { headers })
        );
    return result
}

export { obtenerSucursales }