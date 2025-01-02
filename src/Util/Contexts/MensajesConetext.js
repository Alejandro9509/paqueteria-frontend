import axios from "axios";
import { trackPromise } from "react-promise-tracker";
import { API_HEADERS } from "../../Constants";
import moment from "moment";
const headers = API_HEADERS


function obtenerMensajes(id,fecha){
    const url = `${localStorage.getItem("Back") ?? process.env.REACT_APP_REPORT_URL}/api/UltimaMilla/Chat/Operador`;
    let result;
    var dateString =  moment(fecha).format("yyyy-MM-DD")
    trackPromise(
        result =  axios.get(url, { headers:headers,params:{idOperador: id, fecha: dateString} })
    );
    return result
}

function agregarMensajes(message, id){
    const url = `${localStorage.getItem("Back") ?? process.env.REACT_APP_REPORT_URL}/api/UltimaMilla/Chat`;
    let result;
    const now = new Date();
    var dateString =  now.getFullYear() + "-" + ((now.getMonth()+1) <= 9 ? "0" + (now.getMonth()+1) : (now.getMonth()+1) )  + "-" + (now.getDate() <= 9 ? '0' + now.getDate() : now.getDate()) + " " +
        (now.getHours() <= 9 ? '0' + now.getHours() : now.getHours()) + ":" + (now.getMinutes() <= 9 ? '0' + now.getMinutes() : now.getMinutes())  + ":" + (now.getSeconds() <= 9 ? '0' + now.getSeconds() : now.getSeconds()) ;

    trackPromise(
        result =  axios.post(url, Object.assign({}, {esOperador: false, idOperador: id, idUsuario: localStorage.getItem("UsuarioId"), mensaje: message, fechaHora:dateString}), { headers })
    );
    return result
}

export { obtenerMensajes, agregarMensajes }