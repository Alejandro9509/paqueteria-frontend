import axios from "axios";
import { trackPromise } from "react-promise-tracker";
import { API_HEADERS } from "../../Constants";

const headers = API_HEADERS


function obtenerUbicacion(city, address, subdistrict, number, code) {
    var result;
    var addressComplete = address + ", " + subdistrict + ", " + city

    trackPromise(
        result = new Promise((resolve, reject) => {
            axios.get("https://geocode.search.hereapi.com/v1/geocode?languages=es-MX&q="
                + addressComplete  + "&qq=houseNumber=" + number +"postalCode=" + code + "&apiKey="
                + process.env.REACT_APP_HERE_API_TOEKN, {}).then(({data}) => {
                if (data) {
                    if (data.items) {
                        if (data.items.length !== 0) {
                            resolve( {x: data.items[0].position.lng, y: data.items[0].position.lat} )
                        } else {
                            resolve({x: 0.0, y: 0.0})
                        }
                    } else {
                        resolve({x: 0.0, y: 0.0})
                    }
                }
            })

        })
    )
    return result
}

function obtenerRemitentesDestinatarios(){
    const url = `${process.env.REACT_APP_REPORT_URL}/api/RemitentesDestinatarios/GetListado`;
    let result;
    trackPromise(
        result =  axios.get(url, { headers })
        );
    return result
}
function actualizarRemitentesDestinatarios(){
    const url = `${process.env.REACT_APP_API_URL}/RemitentesDestinatarios/ActualizarListado`;
    let result;
    trackPromise(
        result =  axios.get(url, { headers })
    );
    return result
}
function agregarRemitenteDestinatario(params){
    const url = `${process.env.REACT_APP_REPORT_URL}/api/RemitentesDestinatarios/Agregar`;
    let result;
    trackPromise(
        result =  axios.post(url, Object.assign({}, params), { headers })
    );
    return result
}
function obtenerRemitentesDestinatariosId(id){
    const url = `${process.env.REACT_APP_REPORT_URL}/api/RemitentesDestinatarios/GetById/${id}`;
    let result;
    trackPromise(
        result =  axios.get(url, { headers })
        );
    return result
}
function obtenerRemitentesDestinatariosNombre(nombre){
    const url = `${process.env.REACT_APP_REPORT_URL}/api/RemitentesDestinatarios/GetByName/${nombre}`;
    let result;
    trackPromise(
        result =  axios.get(url, { headers })
    );
    return result
}
function obtenerRemitentesDestinatariosPaginado(pagina,registros, busqueda){
    const url = `${process.env.REACT_APP_REPORT_URL}/api/Remitentes/GetListadoPaginado/${pagina}/${registros}`;
    let result;
    trackPromise(
        result =  axios.put(url, Object.assign({}, {busqueda: busqueda}), { headers })
        );
    return result
}

function actualizarCoordenadasRemitentesDestinatarios(rfc, nombre, latitud, longitud, idRecoleccion){
    const url = `${process.env.REACT_APP_REPORT_URL}/api/RemitentesDestinatarios/ConfirmarCoordenadas`;
    let result;
    trackPromise(
        result =  axios.put(url, Object.assign({}, {
            nombre: nombre, rfc: rfc, latitud: latitud, longitud: longitud, numero: idRecoleccion
        }), { headers })
    );
    return result
}

function obtenerClientesPaginado(pagina,registros, busqueda){
    const url = `${process.env.REACT_APP_REPORT_URL}/api/Client/GetListadoPaginado/${pagina}/${registros}`;
    let result;
    trackPromise(
        result =  axios.put(url, Object.assign({}, {busqueda: busqueda}), { headers })
        );
    return result
}
export {
    obtenerRemitentesDestinatarios,
    obtenerRemitentesDestinatariosId,
    obtenerUbicacion,
    actualizarRemitentesDestinatarios,
    obtenerRemitentesDestinatariosPaginado,
    obtenerClientesPaginado,
    actualizarCoordenadasRemitentesDestinatarios,
    agregarRemitenteDestinatario,
    obtenerRemitentesDestinatariosNombre
}