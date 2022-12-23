import axios from "axios";
import { trackPromise } from "react-promise-tracker";
import { API_HEADERS } from "../../Constants";

const headers = API_HEADERS
function obtenerPlantillasImportacion() {
    const url = `${process.env.REACT_APP_API_URL_LOCAL}/api/PlantillasImportacion/GetListado`;
    let result;
    trackPromise(
        result =  axios.get(url, { headers })
    );
    return result
}
function obtenerPlantillasImportacionById(idPlantilla) {
    const url = `${process.env.REACT_APP_API_URL_LOCAL}/api/PlantillasImportacion/GetById/${idPlantilla}`;
    let result;
    trackPromise(
        result =  axios.get(url, { headers })
    );
    return result
}

function agregarPlantillaImportacion(params){
    const url = `${process.env.REACT_APP_API_URL_LOCAL}/api/PlantillasImportacion/Agregar`;
    let result;
    trackPromise(
        result =  axios.post(url, Object.assign({}, params), { headers })
    );
    return result
}

function modificarPlantillaImportacion(idPlantilla, params){
    const url = `${process.env.REACT_APP_API_URL_LOCAL}/api/PlantillasImportacion/Modificar/${idPlantilla}`;
    let result;
    trackPromise(
        result =  axios.put(url, Object.assign({}, params), { headers })
    );
    return result
}
export { obtenerPlantillasImportacion,agregarPlantillaImportacion,obtenerPlantillasImportacionById,modificarPlantillaImportacion }