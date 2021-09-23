import {trackPromise} from "react-promise-tracker";
import axios from "axios";

const headers = {
    'Content-Type': 'application/json',
    //    'access-control-allow-origin': '*'
}
function obtenerMunicipiosByIdEstado(id) {
    const url = `${process.env.REACT_APP_API_URL}/Municipios/GetByIdEstado/` + id;
    let result;
    trackPromise(
        result =  axios.get(url, { headers })
    );
    return result
}

export {obtenerMunicipiosByIdEstado}