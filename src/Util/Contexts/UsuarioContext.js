import axios from "axios";
import { trackPromise } from "react-promise-tracker";
import { API_HEADERS } from "../../Constants";

const headers = API_HEADERS


function validarPermisos(state){
    const url = `${process.env.REACT_APP_API_URL}/Utilerias/ValidaDerechos/${localStorage.getItem("UsuarioId")}/${state.DerechoBorrar}/3`;
    let result;
    trackPromise(
        result =  axios.get(url, { headers })
        );
    return result
}

function getListado(){
    const url = `${localStorage.getItem("Back") ?? process.env.REACT_APP_REPORT_URL}/api/Usuarios/GetListado`;
    let result;
    trackPromise(
        result =  axios.get(url, { headers })
    );
    return result
}

export {validarPermisos, getListado}