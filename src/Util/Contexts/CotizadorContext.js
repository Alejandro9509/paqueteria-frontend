import axios from "axios";
import { trackPromise } from "react-promise-tracker";
import { API_HEADERS } from "../../Constants";

const headers = API_HEADERS

function obtenerCotizacion( data, paquetes, remitente, destinatario, recoleccion) {
    const url = `${process.env.REACT_APP_API_URL}/Cotizador/Agregar`;
    let result;
    var params = {
        IdOrigen: remitente.origenRemitente.m_nIdCiudad,
        IdDestino: destinatario.destinoDestinatario.m_nIdCiudad,
        IdEmbarque: data.idEmbarque,
        IdRecoleccion: data.idRecoleccion,
        IdZonaEntrega: remitente.zonaTarifaDestinatario.m_nIdZona,
        IdZonaRecoleccion: destinatario.zonaTarifaRemitente.m_nIdZona,
        IdCliente: data.clientePaga.m_nIdCliente,
        EntregaEnSucursal:  data.entregaEnSucursal,
        IdSeguro: data.idTipoSeguro,
        ValorDeclarado: data.valorDeclarado,
        AplicaRecoleccion: data.idRecoleccion !== undefined || recoleccion,
        AplicaSeguro: data.aplicaSeguro,
        PorcentajeSeguro: data.porcentajeSeguro,
        paquetesCotizacion: paquetes
    }
    trackPromise(
        result =  axios.post(url, Object.assign({}, params), { headers })
    );
    return result
}

export {obtenerCotizacion}