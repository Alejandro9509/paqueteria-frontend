import axios from "axios";

const headers = {
    'Content-Type': 'application/json',
    //    'access-control-allow-origin': '*'
}

function modificarGrupoUnidades(id, params){
    const url = `${process.env.REACT_APP_API_URL}/GrupoUnidad/Modificar/` + id;
    return axios.put(url, Object.assign({}, params), { headers })
}

function agregarGrupoUnidades( params){
    const url = `${process.env.REACT_APP_API_URL}/GrupoUnidad/Agregar`;
    return axios.post(url, Object.assign({}, params), { headers })
}

function eliminarGrupoUnidades(id){
    const url = `${process.env.REACT_APP_API_URL}/GrupoUnidad/Eliminar/` + id;
    return axios.delete(url, { headers })
}

function obtenerGrupoUnidades(){
    const url = `${process.env.REACT_APP_API_URL}/GrupoUnidad/GetListado`;
    return axios.get(url, { headers })
}

function obtenerGrupoUnidadesId(id){
    const url = `${process.env.REACT_APP_API_URL}/GrupoUnidad/GetById/` + id;
    return axios.get(url, { headers })
}

export {modificarGrupoUnidades, agregarGrupoUnidades, eliminarGrupoUnidades, obtenerGrupoUnidadesId, obtenerGrupoUnidades}