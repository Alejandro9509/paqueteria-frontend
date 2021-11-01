import axios from "axios";
import { trackPromise } from "react-promise-tracker";
import { API_HEADERS } from "../../Constants";

const headers = API_HEADERS



function obtenerMensajes(id){
    const url = `${process.env.REACT_APP_API_URL}/ChatEnLinea/GetMensajesPorUsuarioOperador/${localStorage.getItem("UsuarioId")}/${id}`;
    let result;
    trackPromise(
        result =  axios.get(url, { headers })
    );
    return result
}

function agregarMensajes(message, id){
    const url = `${process.env.REACT_APP_API_URL}/ChatEnLinea/EnviarMensaje`;
    let result;

    trackPromise(
        result =  axios.post(url, Object.assign({}, {m_nIdEnviadoPor: localStorage.getItem("UsuarioId"), m_nIdOperador: id, m_nIdUsuario: localStorage.getItem("UsuarioId"), m_sMensaje: message}), { headers })
    );
    return result
}

export { obtenerMensajes, agregarMensajes }