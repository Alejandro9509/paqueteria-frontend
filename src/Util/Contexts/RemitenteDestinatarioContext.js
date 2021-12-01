import axios from "axios";
import { trackPromise } from "react-promise-tracker";
import { API_HEADERS } from "../../Constants";
const XLocateClient = window.XLocateClient;
var xlocate = new XLocateClient();
xlocate.setCredentials("xtok", "51FA3E8E-8BF3-49EF-AB82-59D807A0645C")

const headers = API_HEADERS


function modificarRemitentesDestinatarios(id, params){
    const url = `${process.env.REACT_APP_API_URL}/RemitentesDestinatarios/Modificar/` + id;
    let result;
    trackPromise(
        result =  axios.put(url, Object.assign({}, params), { headers })
        );
    return result
}


function obtenerUbicacion(city, address, subdistrict, number, code) {
    var result;
    trackPromise(
        result = new Promise((resolve, reject) => {
            xlocate.searchLocations({
                "$type": "SearchByAddressRequest",
                "address": {
                    "city": city,
                    "street": address,
                    "subdistrict": subdistrict,
                    "houseNumber": number,
                    "postalCode": code
                }
            }, (location) => {
                if (location) {
                    if (location.results) {
                        if (location.results.length !== 0) {
                            resolve(location.results[0].location.referenceCoordinate)
                        } else {
                            resolve({x: 0.0, y: 0.0})
                        }
                    } else {
                        resolve({x: 0.0, y: 0.0})
                    }
                }
                reject(null)
            });
        })
    )
    return result
}

function agregarRemitentesDestinatarios( params){
    const url = `${process.env.REACT_APP_API_URL}/RemitentesDestinatarios/Agregar`;
    let result;
    trackPromise(
        result =  axios.post(url, Object.assign({}, params), { headers })
        );
    return result
}

function eliminarRemitentesDestinatarios(id, idEliminadoPor){
    const url = `${process.env.REACT_APP_API_URL}/RemitentesDestinatarios/Eliminar/` + id + `/${idEliminadoPor}`;
    let result;
    trackPromise(
        result =  axios.delete(url, { headers })
        );
    return result
}

function obtenerRemitentesDestinatarios(){
    const url = `${process.env.REACT_APP_API_URL}/RemitentesDestinatarios/GetListado`;
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
function validarNumeroRemitente(state){
    const url = `${process.env.REACT_APP_API_URL}/RemitentesDestinatarios/ValidaNumeroRemDes/` + state.numero;
    let result;
    trackPromise(
        result =  axios.get(url, { headers })
        );
    return result
}

function obtenerRemitentesDestinatariosId(id){
    const url = `${process.env.REACT_APP_API_URL}/RemitentesDestinatarios/GetById/${id}`;
    let result;
    trackPromise(
        result =  axios.get(url, { headers })
        );
    return result
}
function obtenerRemitentesDestinatariosPaginado(pagina,registros, busqueda){
    const url = `${process.env.REACT_APP_API_URL}/RemitentesDestinatarios/GetListadoPaginado/${pagina}/${registros}`;
    let result;
    trackPromise(
        result =  axios.put(url, Object.assign({}, {busqueda: busqueda}), { headers })
        );
    return result
}
export {modificarRemitentesDestinatarios, agregarRemitentesDestinatarios, eliminarRemitentesDestinatarios, obtenerRemitentesDestinatarios,
    obtenerRemitentesDestinatariosId, validarNumeroRemitente, obtenerUbicacion, actualizarRemitentesDestinatarios,obtenerRemitentesDestinatariosPaginado}