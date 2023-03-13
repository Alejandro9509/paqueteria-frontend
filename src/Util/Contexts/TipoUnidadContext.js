import axios from "axios";
import { trackPromise } from "react-promise-tracker";
import { API_HEADERS } from "../../Constants";

const headers = API_HEADERS


function obtenerTipoUnidades(){
    const url = `${process.env.REACT_APP_API_URL}/TiposUnidades/GetListado`;
    let result;
    trackPromise(
        result =  axios.get(url, { headers })
        );
    return result
}

function obtenerTipoUnidadesId(id){
    const url = `${process.env.REACT_APP_API_URL}/TipoUnidad/GetById/` + id;
    let result;
    trackPromise(
        result =  axios.get(url, { headers })
        );
    return result
}

export {obtenerTipoUnidades, obtenerTipoUnidadesId}