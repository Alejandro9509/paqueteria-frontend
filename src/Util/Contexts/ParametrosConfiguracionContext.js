import axios from "axios";
import { trackPromise } from "react-promise-tracker";
import { API_HEADERS } from "../../Constants";

const headers = API_HEADERS
function obtenerParametrosConfiguracion() {
    const url = `${process.env.REACT_APP_REPORT_URL}/api/ParametrosConfiguracion/GetListado`;
    let result;
    trackPromise(
        result =  axios.get(url, { headers })
    );
    return result
}

function modificarParametrosConfiguracion(params){
    const url = `${process.env.REACT_APP_API_URL}/ParametrosConfiguracion/Modificar`;
    let result;
    trackPromise(
        result =  axios.put(url, Object.assign({}, params), { headers })
    );
    return result
}
export { obtenerParametrosConfiguracion,modificarParametrosConfiguracion }