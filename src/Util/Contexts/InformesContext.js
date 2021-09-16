import axios from "axios";
import { trackPromise } from "react-promise-tracker";

const headers = {
    'Content-Type': 'application/json',
    //    'access-control-allow-origin': '*'
}

function modificarInformes(id, params){
    const url = `${process.env.REACT_APP_API_URL}/Informes/Modificar/${id}`;
    let result;
    trackPromise(
        result =  axios.put(url, Object.assign({}, params), { headers })
        );
    return result
}

function obtenerInformeReporte(id) {
    const url = `http://190.9.53.4:8081/reportes/api/GenerarReporte/Informe/${id}`;
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
        result =  axios.post(url, Object.assign({}, params), { headers })
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

function obtenerInformeFiltro(folioInforme) {
    if (folioInforme == ''){
        folioInforme = 0
    }
    const url = `${process.env.REACT_APP_API_URL}/Informes/GetByFiltros/` + folioInforme;
    let result;
    console.log(url)
    trackPromise(result =  axios.get(url, { headers }));
    return result
}

export {modificarInformes, agregarInformes, eliminarInformes, obtenerInformes, obtenerInformesId, cancelarInformes, obtenerInformesDisponiblesViajes, obtenerInformesPorViaje,obtenerInformeFiltro,
    obtenerInformeReporte}