import axios from "axios";
import { trackPromise } from "react-promise-tracker";

const headers = {
    'Content-Type': 'application/json',
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





export {agregarViaje,agregarViajeSalida,agregarViajeLlegada}