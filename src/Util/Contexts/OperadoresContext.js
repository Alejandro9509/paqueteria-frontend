import axios from "axios";

const headers = {
    'Content-Type': 'application/json',
    //    'access-control-allow-origin': '*'
}

function modificarOperadores(id, params) {
    const url =
        `${process.env.REACT_APP_API_URL}/Operador/Modificar/` +
        id;
    return axios
        .put(url, Object.assign({}, params), { headers })
}

function agregarOperadores(params) {
    const url = `${process.env.REACT_APP_API_URL}/Operador/Agregar`;
    return axios
                .post(url, Object.assign({}, params), { headers })
}

function eliminarOperadores(id) {
    const url = `${process.env.REACT_APP_API_URL}/Operadores/Eliminar/` + id;
    return axios.delete(url, { headers })
}

function obtenerOperadores() {
    const url = `${process.env.REACT_APP_API_URL}/Operadores/GetListado`;
    return axios.get(url, { headers })
}

function obtenerOperadoresId(id) {
    const url = `${process.env.REACT_APP_API_URL}/Operadores/GetById/${id}`;
    return axios.get(url, { headers })
}

export { modificarOperadores, agregarOperadores, eliminarOperadores, obtenerOperadoresId, obtenerOperadores }