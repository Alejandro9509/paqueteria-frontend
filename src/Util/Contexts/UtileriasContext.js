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
    return result
}

async function obtenerFechaFinal(){
    const url = `${process.env.REACT_APP_REPORT_URL}/api/Utilerias/GetFechaFinal`;
    let result;
    trackPromise(
        result =  axios.get(url, { headers })
        );
    return result
}

function validarDerecho(idUsuario,idPrivilegio,idTipo){
    const url = `${process.env.REACT_APP_REPORT_URL}/Utilerias/ValidaDerechos/${idUsuario}/${idPrivilegio}/${idTipo}`;
    let result;
    trackPromise(
        result =  axios.get(url, { headers })
        );
    return result
}

function descargarPlantillaImportarEmbarque(idCliente){
    const url = `${process.env.REACT_APP_REPORT_URL}/api/Utilerias/descargar-plantilla-importacion-embarques/${idCliente}`;
    let result;
    trackPromise(
        result =  axios.get(url, { headers: headers, responseType: 'blob' })
    );
    return result
}

export {obtenerFechaInicio, obtenerFechaFinal,validarDerecho,descargarPlantillaImportarEmbarque}