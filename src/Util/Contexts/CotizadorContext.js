import axios from "axios";
import { trackPromise } from "react-promise-tracker";
import { API_HEADERS } from "../../Constants";

const headers = API_HEADERS

function obtenerCotizacion( data, paquetes, remitente, destinatario, recoleccion, entregaDD, recoleccionDD) {
    const url = `${process.env.REACT_APP_REPORT_URL}/api/Cotizador/Agregar`;
    let result;
    console.log(entregaDD)
    let params = {
        idOrigen: remitente.origenRemitente.m_nIdCiudad,
        idDestino: destinatario.destinoDestinatario.m_nIdCiudad,
        idEmbarque: data.idEmbarque,
        idRecoleccion: data.idRecoleccion,
        idZonaEntrega: data.entregaEnSucursal ? data.zonaOperativaSucursal?.m_nIdZona : data.diferenteEntrega ? entregaDD.zonaOperativa?.m_nIdZona : destinatario.zonaOperativaDestinatario?.m_nIdZona,
        idZonaRecoleccion: data.diferenteRecoleccion ? recoleccionDD.zonaOperativa?.m_nIdZona : remitente.zonaOperativaRemitente.m_nIdZona,
        idCliente: data.clientePaga.m_nIdCliente,
        entregaEnSucursal:  data.entregaEnSucursal,
        idSeguro: data.idTipoSeguro,
        valorDeclarado: data.valorDeclarado,
        aplicaRecoleccion: data.folioRecoleccion?.length > 0|| recoleccion,
        aplicaSeguro: data.aplicaSeguro,
        porcentajeSeguro: data.porcentajeSeguro,
        recoleccionConCita: data.recoleccionConCita,
        embarqueConCita: data.entregaConCita,
        paquetesCotizacion: paquetes.map(p => ({
            idPaquete: p.IdPaquete,
            embajale: p.Embajale,
            tipo: p.Tipo,
            descripcion: p.Descripcion,
            peso: p.Peso,
            largo: p.Largo,
            ancho: p.Ancho,
            alto: p.Alto,
            volumen: p.Volumen,
            idTipoEmpaque: p.IdTipoEmpaque,
            valorDeclarado: p.ValorDeclarado,
            observaciones: p.Observaciones,
            activo: p.Activo,
            ctd: p.ctd,
            idProducto: p.IdProducto,
            producto: p.Producto,
            guia: p.Guia,
            claveEmbalaje: p.ClaveEmbalaje
        }))
    }
    trackPromise(
        result =  axios.post(url, Object.assign({}, params), { headers })
    );
    return result
}
function obtenerCotizacionTarifario(params) {
    const url = `${process.env.REACT_APP_REPORT_URL}/api/Cotizador/Busqueda`;
    let result;

    trackPromise(
        result =  axios.post(url, Object.assign({}, params), { headers })
    );
    return result
}
export {obtenerCotizacion,obtenerCotizacionTarifario}