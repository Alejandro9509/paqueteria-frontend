import axios from "axios";
import { trackPromise } from "react-promise-tracker";

const headers = {
    'Content-Type': 'application/json',
    'TimeZone' : Intl.DateTimeFormat().resolvedOptions().timeZone
    //    'access-control-allow-origin': '*'
}

function agregarViaje( params){
    const url = `${process.env.REACT_APP_API_URL}/Viajes/Agregar`;
    let result;
    trackPromise(
        result =  axios.post(url, Object.assign({}, params), { headers })
        );
    return result
}

function modificarViaje( id,params){
    const url = `${process.env.REACT_APP_API_URL}/Viajes/Modificar/${id}`;
    let result;
    trackPromise(
        result =  axios.put(url, Object.assign({}, params), { headers })
    );
    return result
}

function agregarViajeSalida( params){
    const url = `${process.env.REACT_APP_API_URL}/Viajes/AgregarSalida`;
    let result;
    trackPromise(
        result =  axios.post(url, Object.assign({}, params), { headers })
        );
    return result

    }

    
    
function agregarViajeLlegada( params){
    const url = `${process.env.REACT_APP_API_URL}/Viajes/AgregarLlegada`;
    let result;
    trackPromise(
        result =  axios.post(url, Object.assign({}, params), { headers })
        );
    return result
}

function obtenerViajes(){
    const url = `${process.env.REACT_APP_API_URL}/Viajes/GetListado`;
    let result;
    trackPromise(
        result =  axios.get(url,  { headers })
    );
    return result
}


function obetenerViajeId( id){
    const url = `${process.env.REACT_APP_API_URL}/Viajes/GetById/${id}`;
    let result;
    trackPromise(
        result =  axios.get(url,  { headers })
    );
    return result
}




export {agregarViaje,agregarViajeSalida,agregarViajeLlegada, obetenerViajeId, modificarViaje, obtenerViajes}