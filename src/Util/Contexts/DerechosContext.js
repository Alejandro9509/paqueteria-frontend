import axios from "axios";
import { trackPromise } from "react-promise-tracker";

const headers = {
    'Content-Type': 'application/json',
    //    'access-control-allow-origin': '*'
}

function GetListadoNombres(){
    const url = `${process.env.REACT_APP_API_URL}/SisDerechos/GetListadoNombres`;
    let result;
    trackPromise(
        result =  axios.get(url, Object.assign({}), { headers })
        );
    return result
}

export {GetListadoNombres}