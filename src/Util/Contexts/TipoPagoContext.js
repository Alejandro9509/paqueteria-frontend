import axios from "axios";
import { trackPromise } from "react-promise-tracker";

const headers = {
    'Content-Type': 'application/json',
    //    'access-control-allow-origin': '*'
}



function obtenerTiposPago() {
    const url = `${process.env.REACT_APP_API_URL}/TiposPago/GetListado`;
    let result;
    trackPromise(
        result =  axios.get(url, { headers })
        );
    return result
}

export { obtenerTiposPago }