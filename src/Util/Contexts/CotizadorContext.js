import axios from "axios";
import { trackPromise } from "react-promise-tracker";
import { API_HEADERS } from "../../Constants";

const headers = API_HEADERS

function obtenerCotizacion( data, paquetes, remitente, destinatario, recoleccion) {
    const url = `${process.env.REACT_APP_API_URL}/Cotizador/Agregar`;
    let result;
    console.log(destinatario)
    var params = {
        IdOrigen: remitente.origenRemitente.m_nIdCiudad,
        IdDestino: destinatario.destinoDestinatario.m_nIdCiudad,
        IdEmbarque: data.idEmbarque,
        IdRecoleccion: data.idRecoleccion,
        IdZonaEntrega: destinatario.zonaTarifaDestinatario ?  destinatario.zonaTarifaDestinatario.m_nIdZona : 0,
        IdZonaRecoleccion: remitente.zonaTarifaRemitente ? remitente.zonaTarifaRemitente.m_nIdZona : 0,
        IdCliente: data.clientePaga.m_nIdCliente,
        EntregaEnSucursal:  data.entregaEnSucursal,
        IdSeguro: data.idTipoSeguro,
        ValorDeclarado: data.valorDeclarado,
        AplicaRecoleccion: data.folioRecoleccion.length > 0|| recoleccion,
        AplicaSeguro: data.aplicaSeguro,
        PorcentajeSeguro: data.porcentajeSeguro,
        RecoleccionConCita: data.recoleccionConCita,
        EmbarqueConCita: data.entregaConCita,
        paquetesCotizacion: paquetes
    }
    trackPromise(
        result =  axios.post(url, Object.assign({}, params), { headers })
    );
    return result
}

export {obtenerCotizacion}