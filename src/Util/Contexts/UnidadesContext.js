import axios from "axios";

const headers = {
    'Content-Type': 'application/json',
    //    'access-control-allow-origin': '*'
}

function modificarUnidades(id, params) {
    const url =
                `${process.env.REACT_APP_API_URL}/Unidad/Modificar/` + id;
    return axios
                .put(url, Object.assign({}, params), { headers })
}

function agregarUnidades(params) {
    const url = `${process.env.REACT_APP_API_URL}/Unidad/Agregar`;
    return axios
        .post(url, Object.assign({}, params), { headers })
}

function eliminarUnidades(id) {
    const url = `${process.env.REACT_APP_API_URL}/Unidad/Eliminar/` + id;
    return axios
        .get(url, { headers })
}
function validaCodigoUnidad(code) {
    const url = `${process.env.REACT_APP_API_URL}/Unidades/ValidaCodigoUnidad/` + code
    return axios.get(url, { headers })
}


function obtenerUnidades() {
    const url = `${process.env.REACT_APP_API_URL}/Unidades/GetListado`;
    return axios.get(url, { headers })
}

function obtenerUnidadesId(id) {
    const url = `${process.env.REACT_APP_API_URL}/Unidad/GetById/` + id;
    return axios.get(url, { headers })
}

export { modificarUnidades, agregarUnidades, eliminarUnidades, obtenerUnidadesId, obtenerUnidades, validaCodigoUnidad }