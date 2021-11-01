import axios from "axios";
import { trackPromise } from "react-promise-tracker";
import { API_HEADERS } from "../../Constants";


const headers = API_HEADERS

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