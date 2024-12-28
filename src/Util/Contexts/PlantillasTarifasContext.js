import axios from "axios";
import { trackPromise } from "react-promise-tracker";
import { API_HEADERS } from "../../Constants";

const headers = API_HEADERS

function obtenerPlantillasImportacionTarifas() {
    const url = `${process.env.REACT_APP_REPORT_URL}/api/PlantillasImportacionTarifas/GetListado`;
    let result;
    trackPromise(
        result =  axios.get(url, { headers })
    );
    return result
}

function obtenerPlantillasImportacionTarifasById(idPlantilla) {
    const url = `${process.env.REACT_APP_REPORT_URL}/api/PlantillasImportacionTarifas/GetById/${idPlantilla}`;
    let result;
    trackPromise(
        result =  axios.get(url, { headers })
    );
    return result
}

function obtenerPlantillaImportacionTarifasByIdCliente(idCliente) {
    const url = `${process.env.REACT_APP_REPORT_URL}/api/PlantillasImportacionTarifas/GetByIdCliente/${idCliente}`;
    let result;
    trackPromise(
        result =  axios.get(url, { headers })
    );
    return result
}

function agregarPlantillaImportacionTarifas(params){
    const url = `${process.env.REACT_APP_REPORT_URL}/api/PlantillasImportacionTarifas/Agregar`;
    let result;
    trackPromise(
        result =  axios.post(url, Object.assign({}, params), { headers })
    );
    return result
}

function modificarPlantillaImportacionTarifas(idPlantilla, params){
    const url = `${process.env.REACT_APP_REPORT_URL}/api/PlantillasImportacionTarifas/Modificar/${idPlantilla}`;
    let result;
    trackPromise(
        result =  axios.put(url, Object.assign({}, params), { headers })
    );
    return result
}

function eliminarPlantillaImportacionTarifas(idPlantilla){
    const url = `${process.env.REACT_APP_REPORT_URL}/api/PlantillasImportacionTarifas/Eliminar/${idPlantilla}`;
    let result;
    trackPromise(
        result =  axios.delete(url, { headers })
    );
    return result
}


function obtenerNombrePlantillaImportacionTarifasByIdCliente(idCliente) {
    const url = `${process.env.REACT_APP_REPORT_URL}/api/PlantillasImportacionTarifas/GetNombrePlantilla/${idCliente}`;
    let result;
    trackPromise(
        result =  axios.get(url, { headers })
    );
    return result
}

export {
    obtenerPlantillasImportacionTarifas,
    agregarPlantillaImportacionTarifas,
    obtenerPlantillasImportacionTarifasById,
    modificarPlantillaImportacionTarifas,
    obtenerPlantillaImportacionTarifasByIdCliente,
    eliminarPlantillaImportacionTarifas,
    obtenerNombrePlantillaImportacionTarifasByIdCliente
}