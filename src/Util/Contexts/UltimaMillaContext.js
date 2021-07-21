import {arrayPonts} from "../Data";
import {trackPromise} from "react-promise-tracker";
import axios from "axios";

const headers = {
    'Content-Type': 'application/json',
    //    'access-control-allow-origin': '*'
}

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
    array = array.concat((trucks.map(t => Depot(t.m_nIdUnidad, location.x, location.y, dateFilter.startDate + "T" + dateFilter.startTime +":00+00:00", dateFilter.finishDate + "T" + dateFilter.finishTime+":00+00:00"))));
    array = array.concat((guias.map((p, index) => (
        {
            "$type": "CustomerSite",
            "id": "Customer" + p.idGuia,
            "routeLocation": {
                "$type": "OffRoadRouteLocation",
                "offRoadCoordinate": {
                    "x": p.lng,
                    "y": p.lat
                }
            },
            "openingIntervals": [{
                "$type": "StartEndInterval",
                "start":  dateFilter.startDate + "T" + dateFilter.startTime+":00+00:00",
                "end": dateFilter.finishDate + "T" + dateFilter.finishTime+":00+00:00"
            }
            ],
            "serviceTimePerStop": "300.0"
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
        var location = await searchLocationAddress(g.m_sDomicilioDestinatario)
        guias.push({
            idGuia: g.m_nIdGuia,
            index: i,
            folio: g.m_nFolioGuia,
            IdSucursal: g.IdSucursal,
            m_nIdCiudadDestino: g.m_nIdCiudadDestino,
            m_nCiudadRemitente: g.m_nCiudadRemitente,
            paquetes: g.m_nNoPaquetes,
            lat: location.y,
            lng: location.x,
            embarqueId: g.m_nIdEmbarque,
            arrayPaquetes: g.m_arrClsDetalle
        })
    }
    ;
    return guias
}

async function obtenerRutas(truck, guias, data) {

    return xtour.planTours({
        "locations": await convertData(truck, guias, data),
        "orders":
            guias.map((p, index) => (
                {
                    "$type": "VisitOrder",
                    "id": p.idGuia,
                    "locationId": "Customer" + p.idGuia,
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
    })

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
    array = array.concat(points.map(p => apiPoint(p.lng, p.lat)))
    array.push(apiPoint(sucursal.lng, sucursal.lat))
    return new Promise((resolve, reject) => {
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

function searchLocationWeb(city, address) {
    return new Promise((resolve, reject) => {
        xlocate.searchLocations({
            "$type": "SearchByAddressRequest",
            "address": {
                "city": city,
                "street": address,
            }
        }, (location) => {
            if (location.results) {
                if (location.results.length !== 0) {
                    resolve(location.results[0].location.referenceCoordinate)
                } else {
                    resolve({x: 0.0, y: 0.0})
                }
            } else {
                resolve({x: 0.0, y: 0.0})
            }
        });
    })
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

function agregarRuta(tour, data){
    const url = `${process.env.REACT_APP_API_URL}/GuardarUltimaMilla`;
    let result;
    var ultimaMillaObject = {fecha: data.fecha.split("T")[0], m_nCreadoPor: localStorage.getItem("UsuarioId"), idSucursal: data.sucursalSeleccionada.m_nIdSucursal,zonas: [], rutas:[]}
    console.log(tour)
    tour.unidades.forEach((u) => {
        var tempTour = tour.tour.tours.find( t => t.vehicleId === ("vehicle" + u.m_nIdUnidad))
        var guias = tour.paquetes.filter((p, index) => tempTour.trips[0].stops.find((s, i) => parseInt(s.tasks[0].orderId) === p.idGuia) != null)
        ultimaMillaObject.rutas.push({idOperador: u.m_nIdOperador, idUnidad: u.m_nIdUnidad, guias: guias})
    })
    data.zonasSeleccionada.forEach((z) => {
        ultimaMillaObject.zonas.push({id: z.m_nIdZona})
    })

    trackPromise(
        result = axios.post(url, Object.assign({}, ultimaMillaObject), { headers })
    );
    return result
}

export {obtenerRutas, obtenerGuiasUbicacion, calcularRuta, randomColor, searchLocationWeb, agregarRuta, searchLocationAddress}


