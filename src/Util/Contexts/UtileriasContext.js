import axios from "axios";
import { trackPromise } from "react-promise-tracker";
import { API_HEADERS } from "../../Constants";


const headers = API_HEADERS

async function obtenerFechaInicio(){
    const url = `${process.env.REACT_APP_REPORT_URL}/api/Utilerias/GetFechaInicio`;
    let result;
    trackPromise(
        result =  axios.get(url, { headers })
        );
        console.log(result)

    return result
}

async function obtenerFechaFinal(){
    const url = `${process.env.REACT_APP_REPORT_URL}/api/Utilerias/GetFechaFinal`;
    let result;
    trackPromise(
        result =  axios.get(url, { headers })
        );

        console.log(result)
    return result
}

function validarDerecho(idUsuario,idPrivilegio,idTipo){
    const url = `${process.env.REACT_APP_REPORT_URL}/Utilerias/ValidaDerechos/${idUsuario}/${idPrivilegio}/${idTipo}`;
    let result;
    trackPromise(
        result =  axios.get(url, { headers })
        );

        console.log(result)
    return result
}

export {obtenerFechaInicio, obtenerFechaFinal,validarDerecho}