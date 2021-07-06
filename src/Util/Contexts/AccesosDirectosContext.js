import axios from "axios";
import { trackPromise } from "react-promise-tracker";

const headers = {
    'Content-Type': 'application/json',
    //    'access-control-allow-origin': '*'
}

function obtenerTodosAtajos(){
    const url = `${process.env.REACT_APP_API_URL}/Atajos/GetListado`;
    let result;
    trackPromise(
        result =  axios.get(url, { headers })
    );
    return result
}

function obtenerAtajosUsuario(id){
    const url = `${process.env.REACT_APP_API_URL}/Atajos/GetListado/` + id;
    let result;
    trackPromise(
        result =  axios.get(url, { headers })
    );
    return result
}

function agregarAtajo(params){
    const url = `${process.env.REACT_APP_API_URL}/Atajos/AgregarAtajos`
    let result
    trackPromise(
        result = axios.post(url, Object.assign({}, params), { headers })
    )
    return result
}

export { obtenerTodosAtajos, obtenerAtajosUsuario, agregarAtajo }