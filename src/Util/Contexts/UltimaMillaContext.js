import {arrayPonts} from "../Data";
import {trackPromise} from "react-promise-tracker";

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
    var location = await searchLocation(dateFilter.sucursalSeleccionada.m_sMunicipio)
    array = array.concat((trucks.map(t => Depot(t.m_nIdUnidad, location.x, location.y, dateFilter.start, dateFilter.finish))));
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
                "$type": "StartDurationInterval",
                "start": "2021-06-20T18:00:00+01:00",
                "duration": "7200.0"
            }
            ]
        }
    ))))
    return array
}
function randomColor(brightness){
    function randomChannel(brightness){
        var r = 255-brightness;
        var n = 0|((Math.random() * r) + brightness);
        var s = n.toString(16);
        return (s.length==1) ? '0'+s : s;
    }
    return '#' + randomChannel(brightness) + randomChannel(brightness) + randomChannel(brightness);
}

async function obtenerGuiasUbicacion(paquetes) {
    var guias = []
    for (var i = 0; i < paquetes.length; i++) {
        var g = paquetes[i]
        var location = await searchLocationAddress( g.m_sDomicilioRemitente, g.m_sCiudadDestino)
        guias.push({
            idGuia: g.m_nIdGuia,
            index: i,
            folio: g.m_nFolioGuia,
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
                            "quantities": [10000.0]
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
            "considerAlternativeNearByRoads": true
        }
    })
};

function calcularRuta(points) {
    return new Promise((resolve, reject) => {
        console.log('Initial');
        xroute.calculateRoute({
            "waypoints": points.map(p => apiPoint(p.lng, p.lat)),
            "resultFields": {
                "polyline": true,
                "eventTypes": [
                    "MANEUVER_EVENT",
                    "TOLL_EVENT"
                ],
                "encodedPath": true,
                "guidedNavigationRoute": true
            },
            "routeOptions": {
                "polylineOptions": {
                    "elevations": true
                }
            },
            "requestProfile": {
                "userLanguage": "es"
            }

        }, (r,e) => resolve(r))
    })

}

async function searchLocationAddress(addess, city) {
    var location = await xlocate.searchLocations({
        "$type": "SearchByAddressRequest",
        "address": {
            "street": addess,
            "city": city
        }
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

async function searchLocation(city) {
    var location = await xlocate.searchLocations({
        "$type": "SearchByAddressRequest",
        "address": {
            "city": city,
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

export {obtenerRutas, obtenerGuiasUbicacion, calcularRuta, randomColor}


