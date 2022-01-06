import {arrayPonts} from "../Data";
import {trackPromise} from "react-promise-tracker";
import axios from "axios";
import Tour from "../../Views/UltimaMilla/Tour";
import moment from "moment";
import { API_HEADERS } from "../../Constants";

const headers = API_HEADERS


const XTourClient = window.XTourClient;
const XLocateClient = window.XLocateClient;
const XRouteClient = window.XRouteClient;
var xtour = new XTourClient();
xtour.setCredentials("xtok", "51FA3E8E-8BF3-49EF-AB82-59D807A0645C")
var xlocate = new XLocateClient();
xlocate.setCredentials("xtok", "51FA3E8E-8BF3-49EF-AB82-59D807A0645C")
var xroute = new XRouteClient();
xroute.setCredentials("xtok", "51FA3E8E-8BF3-49EF-AB82-59D807A0645C")

const Depot = (id, x, y, startDate, finishDate) => ({
    "$type": "DepotSite",
    "id": "Depo" + id,
    "routeLocation": {
        "$type": "OffRoadRouteLocation",
        "offRoadCoordinate": {
            "x": x,
            "y": y
        }
    },
    "openingIntervals": [{
        "$type": "StartEndInterval",
        "start": startDate,// "2016-12-06T08:00:00+01:00",
        "end": finishDate
    }]
})

async function convertData(trucks, guias, dateFilter) {
    var array = []
    var location = await searchLocation(dateFilter.sucursalSeleccionada.m_sMunicipio, dateFilter.sucursalSeleccionada.m_sCalle)
    array = array.concat((trucks.map(t => Depot(t.m_nIdUnidad, location.x, location.y, dateFilter.startDate + "T" + dateFilter.startTime + ":00+00:00", dateFilter.finishDate + "T" + dateFilter.finishTime + ":00+00:00"))));
    array = array.concat((guias.map((p, index) => (
        {
            "$type": "CustomerSite",
            "id": "Customer" + index,
            "routeLocation": {
                "$type": "OffRoadRouteLocation",
                "offRoadCoordinate": {
                    "x": p.lng,
                    "y": p.lat
                }
            },
            "openingIntervals": [{
                "$type": "StartEndInterval",
                "start": dateFilter.startDate + "T" + dateFilter.startTime + ":00+00:00",
                "end": dateFilter.finishDate + "T" + dateFilter.finishTime + ":00+00:00"
            }
            ],
            "serviceTimePerStop": "600.0"
        }
    ))))
    return array
}

function randomColor(brightness) {
    function randomChannel(brightness) {
        var r = 255 - brightness;
        var n = 0 | ((Math.random() * r) + brightness);
        var s = n.toString(16);
        return (s.length == 1) ? '0' + s : s;
    }

    return '#' + randomChannel(brightness) + randomChannel(brightness) + randomChannel(brightness);
}

async function obtenerGuiasUbicacion(paquetes) {
    var guias = []
    for (var i = 0; i < paquetes.length; i++) {
        var g = paquetes[i]
        console.log("Inicio de validación")
        if (g.m_sLatitud.length === 0) {
            console.log("Se buscara la dirección")
            var location = await searchLocationGuia(g.m_bEsRecoleccion ? g.m_sCiudadOrigen : g.m_sCiudadDestino, g.m_bEsRecoleccion ? g.m_sDomicilioRemitente : g.m_sDomicilioDestinatario, g.m_bEsRecoleccion ? g.m_sCodigoPostalRemitente : g.m_sCodigoPostalDestinatario)
            guias.push({
                ...g,
                lat: location.y,
                lng: location.x,
                index: i
            })
        } else {
            console.log("Dirección ya obtenida")
            guias.push({
                ...g,
                lat: g.m_sLatitud,
                lng: g.m_sLongitud,
                index: i
            })
        }
    }
    ;
    return guias
}

async function obtenerRutas(truck, guias, data) {
    var converData = await convertData(truck, guias, data)
    var result;
    trackPromise(
        result = new Promise((resolve, reject) => {
            xtour.planTours({
                "locations": converData,
                "orders":
                    guias.map((p, index) => (
                        {
                            "$type": "VisitOrder",
                            "id": index,
                            "locationId": "Customer" + index,
                        }
                    )),
                "fleet": {
                    "vehicles":
                        truck.map(t => (
                            {
                                "ids": ["vehicle" + t.m_nIdUnidad],
                                "maximumQuantityScenarios": [{
                                    "quantities": [100.0]
                                }],
                                "startLocationId": "Depo" + t.m_nIdUnidad,
                                "endLocationId": "Depo" + t.m_nIdUnidad
                            }
                        ))
                },
                "distanceMode": {
                    "$type": "DirectDistance"
                }
            }, (r, e) => resolve(r))
        })
    )
    return result


}

function apiPoint(x, y) {
    return ({
        "$type": "OnRoadWaypoint",
        "location": {
            "coordinate": {
                "x": x,
                "y": y
            },
            "considerAlternativeNearByRoads": false
        }
    })
};

function calcularRuta(points, sucursal) {
    var array = []
    array.push(apiPoint(sucursal.lng, sucursal.lat))
    console.log(points)
    array = array.concat(points.map(p => apiPoint(parseFloat(p.lng), parseFloat(p.lat))))
    array.push(apiPoint(sucursal.lng, sucursal.lat))
    var result;
    trackPromise(
        result = new Promise((resolve, reject) => {
            xroute.calculateRoute({
                "waypoints": array,
                "resultFields": {
                    "polyline": true,
                    "eventTypes": [
                        "MANEUVER_EVENT"
                    ],
                    "encodedPath": true,
                    "guidedNavigationRoute": false
                },
                "routeOptions": {
                    "polylineOptions": {
                        "elevations": true
                    }
                },
                "requestProfile": {
                    "userLanguage": "es"
                }

            }, (r, e) => resolve(r))
        })
    )
    return result

}
function calcularRutaUltimaMilla(points, sucursal, camion) {
    var array = []
    array.push(apiPoint(camion.lng, camion.lat))
    console.log(points)
    array = array.concat(points.map(p => apiPoint(parseFloat(p.lng), parseFloat(p.lat))))
    array.push(apiPoint(sucursal.lng, sucursal.lat))
    var result;
    trackPromise(
        result = new Promise((resolve, reject) => {
            xroute.calculateRoute({
                "waypoints": array,
                "resultFields": {
                    "polyline": true,
                    "eventTypes": [
                        "MANEUVER_EVENT"
                    ],
                    "encodedPath": true,
                    "guidedNavigationRoute": false
                },
                "routeOptions": {
                    "polylineOptions": {
                        "elevations": true
                    }
                },
                "requestProfile": {
                    "userLanguage": "es"
                }

            }, (r, e) => resolve(r))
        })
    )
    return result

}

async function searchLocationAddress(address) {
    var location = await xlocate.searchLocations({
        "$type": "SearchByTextRequest",
        "text": address
    })
    if (location.results) {
        if (location.results.length !== 0) {
            return location.results[0].location.referenceCoordinate
        } else {
            return {x: 0.0, y: 0.0}
        }
    } else {
        return {x: 0.0, y: 0.0}
    }

}

async function searchLocationGuia(city, address, postalCode) {
    var location = await xlocate.searchLocations({
        "$type": "SearchByAddressRequest",
        "address": {
            "city": city,
            "street": address,
            "postalCode": postalCode
        }
    });
    if (location.results) {
        if (location.results.length !== 0) {
            return location.results[0].location.referenceCoordinate
        } else {
            return {x: 0.0, y: 0.0}
        }
    } else {
        return {x: 0.0, y: 0.0}
    }
}


function searchLocationWeb(city, address, subdistrict, number, code) {
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
                    "postalCode" : code

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
            });
        })
    )
    return result
}

async function searchLocation(city, address) {
    var location = await xlocate.searchLocations({
        "$type": "SearchByAddressRequest",
        "address": {
            "city": city,
            "street": address,
        }
    });
    if (location.results) {
        if (location.results.length !== 0) {
            return location.results[0].location.referenceCoordinate
        } else {
            return {x: 0.0, y: 0.0}
        }
    } else {
        return {x: 0.0, y: 0.0}
    }
}

function agregarRuta(idUltimaMilla, tour, data) {
    const url = `${process.env.REACT_APP_API_URL}/GuardarUltimaMilla`;
    let result;
    var ultimaMillaObject = {
        idUltimaMilla: idUltimaMilla,
        fecha: moment(data.fecha).format("YYYYMMDD"),
        m_nCreadoPor: localStorage.getItem("UsuarioId"),
        idSucursal: data.sucursalSeleccionada.m_nIdSucursal,
        zonas: [],
        rutas: []
    }
    tour.unidades.forEach((u) => {
        var tempTour = tour.tour.tours.find(t => t.vehicleId === ("vehicle" + u.m_nIdUnidad))
        console.log(tour)
        var guias = tour.paquetes.filter((p, index) => tempTour.trips[0].stops.find((s, i) => parseInt(s.tasks[0].orderId) === p.index) != null)
        guias = ordenarGuiasPorRuta(tempTour, guias)
        console.log(guias)
        ultimaMillaObject.rutas.push({
            idOperador: u.m_nIdOperador,
            idUnidad: u.m_nIdUnidad,
            guias: guias.map((g, index) => {
                var tourReport = tour.tour.tourReports.find(t => t.vehicleId === ("vehicle" + u.m_nIdUnidad))
                var distance = tourReport.legReports[index].distance
                var reportTime = tourReport.tourEvents.find(t => t.eventTypes[0] === "SERVICE" && g.index === parseInt(t.orderId))
                var date = new Date(reportTime.startTime)
                var userTimezoneOffset = date.getTimezoneOffset() * 60000;
                date = new Date(date.getTime() + userTimezoneOffset);
                var time = date.toLocaleTimeString()
                return ({
                    idGuia: g.m_nId,
                    lat: g.lat,
                    lng: g.lng,
                    orden: index + 1,
                    horaEstimada: time,
                    kilometros:distance/1000,
                    esRecoleccion: g.m_bEsRecoleccion
                })
            })
        })
    })
    data.zonasSeleccionada.forEach((z) => {
        ultimaMillaObject.zonas.push({id: z.m_nIdZona})
    })

    trackPromise(
        result = axios.post(url, Object.assign({}, ultimaMillaObject), {headers})
    );
    return result
}

async function ordenarParada(idParada, guias) {
    const url = `${process.env.REACT_APP_API_URL}/UltimaMilla/OrdenarParada/${idParada}`;
    let result;

    guias = await obtenerGuiasUbicacion(guias)
    var paquetes = guias.map((g, index) => ({
        idGuia: g.m_nId,
        lat: g.lat.toString(),
        lng: g.lng.toString(),
        orden: index + 1,
        esRecoleccion: g.m_bEsRecoleccion
    }))
    trackPromise(
        result = axios.put(url, Object.assign({}, {guias: paquetes}), {headers})
    )
    ;
    return result
}

function obtenerUltimaMillaFecha(date, idSucursal, zonas) {
    console.log(zonas)
    const url = `${process.env.REACT_APP_API_URL}/GetUltimaMillaFecha/` + moment(date).format("YYYYMMDD") + "/" + idSucursal;
    let result;
    trackPromise(
        result = axios.post(url, Object.assign({}, {zonas: zonas.join(",")}), {headers})
    );
    return result
}

function obtenerPaquetesInforme(idInforme, zonasIds) {
    const url = `${process.env.REACT_APP_API_URL}/UltimaMilla/GetListadoPaquetesByInforme/` + idInforme;
    let result;
    trackPromise(
        result = axios.post(url, Object.assign({}, {zonas: zonasIds.join(",")}), {headers})
    );
    return result
}
function obtenerPaquetesViaje(idViaje, zonasIds) {
    const url = `${process.env.REACT_APP_API_URL}/UltimaMilla/GetListadoPaquetesByViaje/` + idViaje;
    let result;
    trackPromise(
        result = axios.post(url, Object.assign({}, {zonas: zonasIds.join(",")}), {headers})
    );
    return result
}
function obtenerPaquetesUnidadOperador(idUnidad, idOperador,zonasIds ) {
    const url = `${process.env.REACT_APP_API_URL}/UltimaMilla/GetListadoPaquetesByUnidadOperador/${idUnidad}/${idOperador}` ;
    let result;
    trackPromise(
        result = axios.post(url,   Object.assign({}, {zonas: zonasIds.join(",")}), {headers})
    );
    return result
}
async function remplazarPaqueteUltimaMilla(idParada, paqueteViejo, paqueteNuevo) {
    const url = `${process.env.REACT_APP_API_URL}/UltimaMilla/RemplazarParada/${idParada}/${paqueteViejo.m_nId}`;
    let result;
    var guia = await obtenerGuiasUbicacion([paqueteNuevo])
    trackPromise(
        result = axios.put(url, Object.assign({}, {
            EsRecoleccion: paqueteViejo.m_bEsRecoleccion,
            IdNuevaGuia: paqueteNuevo.m_nId,
            NuevoEsRecoleccion: paqueteNuevo.m_bEsRecoleccion,
            Lat: guia[0].lat,
            Lng: guia[0].lng
        }), {headers})
    );
    return result
}

function eliminarPaqueteUltimaMilla(idParada, idGuia, esRecoleccion) {
    const url = `${process.env.REACT_APP_API_URL}/UltimaMilla/EliminarParadaOperador`;
    let result;
    trackPromise(
        result = axios.post(url, Object.assign({}, {
            EsRecoleccion: esRecoleccion,
            IdGuia: idGuia,
            IdParada: idParada,
        }), {headers})
    );
    return result
}

function confirmarUbicacion(coordenadas, id,esRecoleccion) {
    const url = `${process.env.REACT_APP_API_URL}/UltimaMilla/CambiarUbicacion`;
    let result;
    trackPromise(
        result = axios.put(url, Object.assign({}, {
            EsRecoleccion: esRecoleccion,
            IdGuia: id,
            Coordenadas: coordenadas,
        }), {headers})
    );
    return result
}

function obtenerUltimaMillaReporte(id) {
    const url = `${process.env.REACT_APP_REPORT_URL}/api/GenerarReporte/UltimaMilla/${id}`;
    let result;
    trackPromise(
        result =  axios.get(url, { headers })
    );
    return result
}

function cancelarRuta(id) {
    const url = `${process.env.REACT_APP_API_URL}/UltimaMilla/EliminarRuta/${id}`;
    let result;
    trackPromise(
        result =  axios.delete(url, { headers })
    );
    return result
}

function obtenerCFDI(id,esRecolecion, IdSucursal){
    const url = `${process.env.REACT_APP_API_URL}/UltimaMilla/GetCFDITraslada/${id}/${esRecolecion ? 1 : 0}/${IdSucursal}`;
    let result;
    trackPromise(
        result =  axios.get(url,  { headers })
    );
    return result
}

function obtenerXMLCFDI(id,esRecolecion, IdSucursal){
    const url = `${process.env.REACT_APP_API_URL}/UltimaMilla/GetXMLCFDITraslada/${id}/${esRecolecion ? 1 : 0}/${IdSucursal}`;
    let result;
    trackPromise(
        result =  axios.get(url,  { headers })
    );
    return result
}
function obtenerXMLPermisionario(id,esRecolecion, IdSucursal){
    const url = `${process.env.REACT_APP_API_URL}/UltimaMilla/GetXMLTrasladaPermisionario/${id}/${esRecolecion ? 1 : 0}/${IdSucursal}`;
    let result;
    trackPromise(
        result =  axios.get(url,  { headers })
    );
    return result
}
function obtenerReporteCFDIGuia(id){
    const url = `${process.env.REACT_APP_REPORT_URL}/api/GenerarReporte/CFDIGuia/${id}`;
    let result;
    trackPromise(
        result =  axios.get(url,  { headers })
    );
    return result
}
function obtenerReporteCFDIRecoleccion(id){
    const url = `${process.env.REACT_APP_REPORT_URL}/api/GenerarReporte/CFDIRecoleccion/${id}`;
    let result;
    trackPromise(
        result =  axios.get(url,  { headers })
    );
    return result
}
export {
    cancelarRuta,
    obtenerXMLPermisionario,
    obtenerXMLCFDI,
    obtenerCFDI,
    obtenerReporteCFDIGuia,
    obtenerReporteCFDIRecoleccion,
    obtenerUltimaMillaReporte,
    obtenerRutas,
    obtenerGuiasUbicacion,
    calcularRuta,
    randomColor,
    searchLocationWeb,
    agregarRuta,
    searchLocationAddress,
    obtenerUltimaMillaFecha,
    remplazarPaqueteUltimaMilla,
    ordenarParada,
    eliminarPaqueteUltimaMilla,
    obtenerPaquetesInforme,
    obtenerPaquetesViaje,
    obtenerPaquetesUnidadOperador,
    calcularRutaUltimaMilla
}


function ordenarGuiasPorRuta(tour, guias) {
    var result = []
    tour.trips[0].stops.forEach((item, index) => {
        var found = false;
        guias = guias.filter(function (guia, index) {
            if (!found && guia.index == parseInt(item.tasks[0].orderId)) {
                guia.orden = index + 1
                result.push(guia);
                found = true;
                return false;
            } else
                return true;
        })
    })
    return result
}