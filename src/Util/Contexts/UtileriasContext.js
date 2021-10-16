import axios from "axios";
import { trackPromise } from "react-promise-tracker";


const headers = {
    'Content-Type': 'application/json',
    //'TimeZone' : Intl.DateTimeFormat().resolvedOptions().timeZone
    //    'access-control-allow-origin': '*'
}
async function obtenerFechaInicio(){
    const url = `${process.env.REACT_APP_API_URL}/Utilerias/GetFechaInicio`;
    let result;
    trackPromise(
        result =  axios.get(url, { headers })
        );
        console.log(result)

    return result
}

async function obtenerFechaFinal(){
    const url = `${process.env.REACT_APP_API_URL}/Utilerias/GetFechaFinal`;
    let result;
    trackPromise(
        result =  axios.get(url, { headers })
        );

        console.log(result)
    return result
}

export {obtenerFechaInicio, obtenerFechaFinal}