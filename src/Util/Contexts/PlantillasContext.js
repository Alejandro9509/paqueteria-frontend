import axios from "axios";
import { trackPromise } from "react-promise-tracker";
import { API_HEADERS } from "../../Constants";

const headers = API_HEADERS


function obtenerPlantillasImportacion() {
    const url = `${process.env.REACT_APP_REPORT_URL}/api/PlantillasImportacion/GetListado`;
    let result;
    trackPromise(
        result =  axios.get(url, { headers })
    );
    return result
}

function obtenerPlantillasImportacionById(idPlantilla) {
    const url = `${process.env.REACT_APP_REPORT_URL}/api/PlantillasImportacion/GetById/${idPlantilla}`;
    let result;
    trackPromise(
        result =  axios.get(url, { headers })
    );
    return result
}

function obtenerPlantillaImportacionByIdCliente(idCliente) {
    const url = `${process.env.REACT_APP_REPORT_URL}/api/PlantillasImportacion/GetByIdCliente/${idCliente}`;
    let result;
    trackPromise(
        result =  axios.get(url, { headers })
    );
    return result
}

function agregarPlantillaImportacion(params){
    const url = `${process.env.REACT_APP_REPORT_URL}/api/PlantillasImportacion/Agregar`;
    let result;
    trackPromise(
        result =  axios.post(url, Object.assign({}, params), { headers })
    );
    return result
}

function modificarPlantillaImportacion(idPlantilla, params){
    const url = `${process.env.REACT_APP_REPORT_URL}/api/PlantillasImportacion/Modificar/${idPlantilla}`;
    let result;
    trackPromise(
        result =  axios.put(url, Object.assign({}, params), { headers })
    );
    return result
}

function eliminarPlantillaImportacion(idPlantilla){
    const url = `${process.env.REACT_APP_REPORT_URL}/api/PlantillasImportacion/Eliminar/${idPlantilla}`;
    let result;
    trackPromise(
        result =  axios.delete(url, { headers })
    );
    return result
}


function obtenerNombrePlantillaImportacionByIdCliente(idCliente) {
    const url = `${process.env.REACT_APP_REPORT_URL}/api/PlantillasImportacion/GetNombrePlantilla/${idCliente}`;
    let result;
    trackPromise(
        result =  axios.get(url, { headers })
    );
    return result
}

export {
    obtenerPlantillasImportacion,
    agregarPlantillaImportacion,
    obtenerPlantillasImportacionById,
    modificarPlantillaImportacion,
    obtenerPlantillaImportacionByIdCliente,
    eliminarPlantillaImportacion,
    obtenerNombrePlantillaImportacionByIdCliente
}