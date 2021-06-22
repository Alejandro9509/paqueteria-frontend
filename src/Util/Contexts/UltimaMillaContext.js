import {arrayPonts} from "../Data";

const XTourClient = window.XTourClient;
const XLocateClient = window.XLocateClient;
var xtour = new XTourClient();
xtour.setCredentials("xtok", "51FA3E8E-8BF3-49EF-AB82-59D807A0645C")
var xlocate = new XLocateClient();
xlocate.setCredentials("xtok", "51FA3E8E-8BF3-49EF-AB82-59D807A0645C")

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
    array = array.concat((trucks.map(t => Depot(t.m_nIdUnidad,location.x,location.y , dateFilter.start, dateFilter.finish))));
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

async function obtenerGuiasUbicacion(paquetes){
    var guias = []
    for (var i = 0; i < paquetes.length; i++) {
        var g = paquetes[i]
        var location = await searchLocation(g.m_sCiudadDestino)
        guias.push({ idGuia: g.m_nIdGuia, index: i, folio: g.m_nFolioGuia, paquetes: g.m_nNoPaquetes, lat: location.y, lng: location.x, embarqueId: g.m_nIdEmbarque, arrayPaquetes: g.m_arrClsDetalle })
    };
    return guias
}

async function obtenerRutas(truck, guias, data) {

    return xtour.planTours({
        "locations": await convertData(truck, guias, data),
        "orders":
            guias.map((p, index) => (
                {
                    "$type": "VisitOrder",
                    "id":  index,
                    "locationId": "Customer" + index,
                }
            )),
        "fleet": {
            "vehicles":
                truck.map(t => (
                    {
                        "ids": [ "vehicle" + t.m_nIdUnidad],
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

async function searchLocationAddress(addess) {
    var location = await xlocate.searchLocations({
        "$type": "SearchByTextRequest",
        "text": addess
    });
    if (location.results) {
        if (location.results.length !== 0) {
            return location.results[0].location.referenceCoordinate
        } else {
            return { x: 0.0, y: 0.0 }
        }
    } else {
        return { x: 0.0, y: 0.0 }
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
            return { x: 0.0, y: 0.0 }
        }
    } else {
        return { x: 0.0, y: 0.0 }
    }

}

export {obtenerRutas, obtenerGuiasUbicacion}


