import axios from "axios";
import { trackPromise } from "react-promise-tracker";

const headers = {
    'Content-Type': 'application/json',
    //    'access-control-allow-origin': '*'
}

function obtenerZonasSucursal(id) {
    const url = `${process.env.REACT_APP_API_URL}/Zonas/GetListadoBySucursal/${id}`;
    let result;
    trackPromise(
        result =  axios.get(url, { headers })
    );
    return result
}

function obtenerZonasById(id) {
    const url = `${process.env.REACT_APP_API_URL}/Zonas/GetById/${id}`;
    let result;
    trackPromise(
        result =  axios.get(url, { headers })
    );
    return result
}

export {obtenerZonasSucursal,obtenerZonasById}