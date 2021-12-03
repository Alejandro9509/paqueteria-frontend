import axios from "axios";
import { trackPromise } from "react-promise-tracker";
import { API_HEADERS } from "../../Constants";

const headers = API_HEADERS

function modificarInformes(id, params){
    const url = `${process.env.REACT_APP_API_URL}/Informes/Modificar`;
    let result;
    trackPromise(
        result =  axios.put(url, Object.assign({}, params), { headers }),"progress"
        );
    return result
}

function obtenerInformeReporte(id) {
    const url = `${process.env.REACT_APP_REPORT_URL}/api/GenerarReporte/Informe/${id}`;
    let result;
    trackPromise(
        result =  axios.get(url, { headers })
    );
    return result
}

function cancelarInformes(id, params){
    const url = `${process.env.REACT_APP_API_URL}/Informes/Cancelar/${id}`;
    let result;
    trackPromise(
        result =  axios.put(url, Object.assign({}, params), { headers })
        );
    return result
}

function agregarInformes( params){
    const url = `${process.env.REACT_APP_API_URL}/Informes/Agregar`;
    let result;
    trackPromise(
        result =  axios.post(url, Object.assign({}, params), { headers }), "progress"
        );
    return result
}

function eliminarInformes(id, idEliminadoPor){
    const url = `${process.env.REACT_APP_API_URL}/Unidadd/Eliminar/` + id + `/${idEliminadoPor}`; //TODO: Cambiar a servicio de eliminar informe
    let result;
    trackPromise(
        result =  axios.delete(url, { headers })
        );
    return result
}

function obtenerInformes(){
    const url = `${process.env.REACT_APP_API_URL}/Informes/GetListadoSinViajes`;
    let result;
    trackPromise(
        result =  axios.get(url, { headers })
        );
    return result
}

function obtenerInformesEstatus(idEstatus){
    const url = `${process.env.REACT_APP_API_URL}/Informes/GetListadoEstatus/${idEstatus}`;
    let result;
    trackPromise(
        result =  axios.get(url, { headers })
    );
    return result
}
function obtenerInformesPorViaje(id){
    const url = `${process.env.REACT_APP_API_URL}/Informes/GetByIdViaje/${id}`;
    let result;
    trackPromise(
        result =  axios.get(url, { headers })
    );
    return result
}

function obtenerInformesDisponiblesViajes(idOrigen, idDestino, idRuta){
    const url = `${process.env.REACT_APP_API_URL}/Informes/GetListadoDisponiblesViaje`;
    let result;
    trackPromise(
        result =  axios.post(url, Object.assign({}, {idOrigen: idOrigen, idDestino: idDestino, idRuta: idRuta }), { headers })
    );
    return result
}

function obtenerInformesId(id){
    const url = `${process.env.REACT_APP_API_URL}/Informes/GetById/${id}`;
    let result;
    trackPromise(
        result =  axios.get(url, { headers })
        );
    return result
}

function obtenerInformeFiltro(fechaInicial, fechaFinal, sucursalListado, estatusListado, folioInforme,Origen,Destino) {
    if (folioInforme == ''){
        folioInforme = 0
    }
    const url =
        `${process.env.REACT_APP_API_URL}/Informes/GetByFiltros/` +
        fechaInicial +
        "/" +
        fechaFinal +
        "/" +
        sucursalListado +
        "/" +
        estatusListado +
        "/" +
        folioInforme+
        "/" +
        Origen+
        "/" +
        Destino;
    let result;
    trackPromise(
        result =  axios.get(url, { headers })
        );
    return result
}


export {modificarInformes, agregarInformes, eliminarInformes, obtenerInformes, obtenerInformesId, cancelarInformes, obtenerInformesDisponiblesViajes, obtenerInformesPorViaje,obtenerInformeFiltro,
    obtenerInformeReporte, obtenerInformesEstatus}