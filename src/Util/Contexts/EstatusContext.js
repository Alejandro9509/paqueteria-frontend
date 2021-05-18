import axios from "axios";

const headers = {
    'Content-Type': 'application/json',
    //    'access-control-allow-origin': '*'
}

function obtenerEstatusDocumentos(){
    const url = `${process.env.REACT_APP_API_URL}/SisEstatus/getListadoDocumentos`;
    return axios.get(url, { headers })
}

function obtenerEstatusEmbarque(){
    const url = `${process.env.REACT_APP_API_URL}/SisEstatus/GetListadoEmbarque`;
    return axios.get(url, { headers })
}

function obtenerEstatusGuia(){
    const url = `${process.env.REACT_APP_API_URL}/EstatusGuia/GetListado`;
    return axios.get(url, { headers })
}

function obtenerEstatusInforme(){
    const url = `${process.env.REACT_APP_API_URL}/SisEstatus/getListadoInformes`;
    return axios.get(url, { headers })
}
function obtenerEstatusRecoleccion(){
    const url = `${process.env.REACT_APP_API_URL}/SisEstatus/getListadoRecoleccion`;
    return axios.get(url, { headers })
}

function obtenerEstatusUnidades(){
    const url = `${process.env.REACT_APP_API_URL}/EstatusUnidades/GetListado`;
    return axios.get(url, { headers })
}

function obtenerEstatusUnidadesId(id){
    const url = `${process.env.REACT_APP_API_URL}/EstatusUnidades/GetById/${id}`;
    return axios.get(url, { headers })
}

function eliminarEstatusUnidades(id){
    const url = `${process.env.REACT_APP_API_URL}/EstatusUnidades/Eliminar/` + id;
    return axios.delete(url, { headers })
}

function agregarEstatusUnidades(params){
    const url = `${process.env.REACT_APP_API_URL}/EstatusUnidades/Agregar`;
    return axios.post(url, Object.assign({}, params), { headers })
}

function modificarEstatusUnidades(id, params){
    const url = `${process.env.REACT_APP_API_URL}/EstatusUnidades/Modificar/` + id;
    return axios.put(url, Object.assign({}, params), { headers })
}


export { obtenerEstatusDocumentos, obtenerEstatusEmbarque, obtenerEstatusGuia, obtenerEstatusInforme, obtenerEstatusRecoleccion, obtenerEstatusUnidades, agregarEstatusUnidades, modificarEstatusUnidades, obtenerEstatusUnidadesId, eliminarEstatusUnidades}