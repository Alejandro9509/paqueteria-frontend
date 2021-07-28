import { useEffect, useRef } from "react";
import axios from "axios";

const XLocateClient = window.XLocateClient;
const XRouteClient = window.XRouteClient;
const XLoadClient = window.XLoadClient;
var xlocate = new XLocateClient();
xlocate.setCredentials("xtok", "51FA3E8E-8BF3-49EF-AB82-59D807A0645C")
var xroute = new XRouteClient();
xroute.setCredentials("xtok", "51FA3E8E-8BF3-49EF-AB82-59D807A0645C")
var xload = new XLoadClient();
xload.setCredentials("xtok", "51FA3E8E-8BF3-49EF-AB82-59D807A0645C")


const headers = {
    "Content-Type": "application/json",
};

export function useInterval(callback, delay) {
    const savedCallback = useRef();

    // Remember the latest function.
    useEffect(() => {
        savedCallback.current = callback;
    }, [callback]);

    // Set up the interval.
    useEffect(() => {
        function tick() {
            savedCallback.current();
        }
        if (delay !== null) {
            let id = setInterval(tick, delay);
            return () => clearInterval(id);
        }
    }, [delay]);
}

export function remove_array_element(array, index) {
    if (index > -1) {
        if (index === 0) {
            array.shift();
        } else if (index === (array.length - 1)) {
            array.pop();
        } else {
            array = array.slice(0, index).concat(array.slice(-index));
        }
    }
    return array;
}


export async function cubicarGuias(guias, origin, destiny, remolque1, remolque2) {
    guias = guias.filter(g => g.m_nIdCiudadDestino !== origin.m_nIdCiudad && origin.m_nIdCiudad === g.m_nIdCiudadOrigen)
    var locationOrigin = await searchLocation(origin.m_sCiudad)
    var locationDestiny = await searchLocation(destiny.m_sCiudad)
    var guiasCoordenadas = []
    if(guias.length === 0){
        return []
    }
    for (var i = 0; i < guias.length; i++) {
        var g = guias[i]
        var location = await searchLocation(g.m_sCiudadDestino)
        guiasCoordenadas.push({ idGuia: g.m_nIdGuia, index: i, folio: g.m_nFolioGuia, destino: g.m_sCiudadDestino, paquetes: g.m_nNoPaquetes, lat: location.y, lng: location.x, embarqueId: g.m_nIdEmbarque, arrayPaquetes: [] })
    };

    var routeEncode = await route(locationOrigin, locationDestiny)
    var locationMatch = await calculateReachableLocations(routeEncode, guiasCoordenadas)
    var guiasMatch = guiasCoordenadas.filter(g => locationMatch.includes(g.index))
    for (var i = 0; i < guiasMatch.length; i++) {
        guiasMatch[i].arrayPaquetes = await obtenerEmbarque(guiasMatch[i].embarqueId)
    }
    var bins = await packBins(remolque1, remolque2, guiasMatch)
    var destinos = getUniqueListBy(bins, "destino")
    return destinos.map(d => bins.filter(b => b.destino === d.destino))
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

async function route(locationOrigin, locationDestiny) {
    var location = await xroute.calculateRoute(
        {
            "waypoints": [{
                "$type": "OffRoadWaypoint",
                "location": {
                    "offRoadCoordinate": locationOrigin,
                }
            }, {
                "$type": "OffRoadWaypoint",
                "location": {
                    "offRoadCoordinate": locationDestiny,
                }
            }],
            "resultFields": {
                "alternativeRoutes": true,
                "polyline": true,
                "encodedPath": true
            },
            "geometryOptions": {
                "responseGeometryTypes": ["GEOJSON"]
            }
        }
    );
    return location.encodedPath;

}

async function calculateReachableLocations(routeEncode, guias) {
    var location = await xroute.calculateReachableLocations(
        {
            'locations': guias.map(g => (
                {
                    "$type": "OffRoadRouteLocation",
                    "offRoadCoordinate": {
                        "x": g.lng,
                        "y": g.lat
                    }
                }
            )),
            'waypoint': {
                "$type": "PathWaypoint",
                "encodedPath": routeEncode
            },
            "reachableLocationsOptions": {
                "horizon": {
                    "$type": "TravelTimeBasedHorizon",
                    "travelTime": "1000"
                },
                "searchType": "LOCATION_REACHABLE_FROM_WAYPOINT"
            }
        }
    );
    if(location.reachableLocations) {
        return location.reachableLocations.map(r => r.inputLocationIndex);
    }else {
        return []
    }

}

async function packBins(remolque1, remolque2, guias) {
    var items = [].concat.apply([], guias.map(g => g.arrayPaquetes))
    var location = await xload.packBins(
        {
            "bins": [
                {
                    "id": "Truck",
                    "numberOfBins": 1,
                    "dimensions": {
                        "x": remolque1.Alto,
                        "y": remolque1.Ancho,
                        "z": remolque1.Largo
                    },
                    "maximumWeightCapacity": remolque1.m_nCapacidad
                },
                remolque2 && {
                    "id": "Truck 2",
                    "numberOfBins": 1,
                    "dimensions": {
                        "x": remolque2.Alto,
                        "y": remolque2.Ancho,
                        "z": remolque2.Largo
                    },
                    "maximumWeightCapacity": remolque2.m_nCapacidad
                }
            ],
            "items": items.map((i, index) => (
                {
                    "id": `${index}-${i.m_nIdEmbarque}`,
                        "numberOfItems": 1,
                        "dimensions": {
                            "x": i.m_xAlto < 50 ? 50 : i.m_xAlto,
                            "y": i.m_xAncho < 50 ? 50 : i.m_xAncho,
                            "z": i.m_xLargo < 50 ? 50 : i.m_xLargo
                        },
                        "weight": i.m_xPeso
                }
            ))
        }
    );
    console.log([].concat.apply([], location.packedBins.map(p=> p.packedItems)))
    return getUniqueListBy([].concat.apply([], location.packedBins.map(p=> p.packedItems)).map(i => guias.find(r => r.embarqueId === parseInt(i.itemTypeId.split("-")[1]))), "idGuia");

}

async function obtenerEmbarque(id) {
    const url = `${process.env.REACT_APP_API_URL}/Embarques/GetById/${id}`;
    var location = await axios.get(url, { headers })
    console.log(location)
    return location.data.m_arrPaquetes
}

export function getUniqueListBy(arr, key) {
    return [...new Map(arr.map(item => [item[key], item])).values()]
}

