import axios from "axios";
import { trackPromise } from "react-promise-tracker";

const headers = {
    'Content-Type': 'application/json',
    //    'access-control-allow-origin': '*'
}


function modificarRutas(id, params) {
    const url = `${process.env.REACT_APP_API_URL}/Rutas/Modificar/${id}`;
    let result;
    trackPromise(
        result = axios.put(url, Object.assign({}, params), { headers })
    );
    return result
}

function agregarRutas(params) {
    const url = `${process.env.REACT_APP_API_URL}/Rutas/Agregar`;
    let result;
    trackPromise(
        result = axios.post(url, Object.assign({}, params), { headers })
    );
    return result
}

function eliminarRutas(id, idEliminadoPor) {
    const url = `${process.env.REACT_APP_API_URL}/Rutas/Eliminar/` + id + `/${idEliminadoPor}`;
    let result;
    trackPromise(
        result = axios.delete(url, { headers })
    );
    return result
}

function obtenerRutas() {
    const url = `${process.env.REACT_APP_API_URL}/Rutas/GetListado`;
    let result;
    trackPromise(
        result = axios.get(url, { headers })
    );
    return result
}
function obtenerRutasOrigenes() {
    const url = `${process.env.REACT_APP_API_URL}/Rutas/GetListadoCoordenadas`;
    let result;
    trackPromise(
        result = axios.get(url, { headers })
    );
    return result
}

function obtenerRutasId(id) {
    const url = `${process.env.REACT_APP_API_URL}/Rutas/GetById/${id}`;
    let result;
    trackPromise(
        result = axios.get(url, { headers })
    );
    return result
}

function calcularCosto(data) {
    const url = `https://xroute-na-n.cloud.ptvgroup.com/xroute/rs/XRoute/calculateExtendedRoute`;
    let result;
    trackPromise(
        result = axios.post(url, {
            "waypoints": data.map(p => ({
                "linkType": "NEXT_SEGMENT",
                "coords": [
                    {
                        "point": {
                            "x": p.location[1],
                            "y": p.location[0]
                        }
                    }
                ],
                "vehicleOptions": [{
                    "parameter": "NUMBER_OF_AXLES",
                    "value": "5"
                }]
            })),
            "options": [
                {
                    "parameter": "START_TIME",
                    "value": "NOW"
                },
                {
                    "parameter": "REQUEST_VERSION",
                    "value": "1.22"
                },
                {
                    "parameter": "ROUTE_LANGUAGE",
                    "value": "ES"
                }
            ],
            "exceptionPaths": null,
            "details": {
                "binaryPathDesc": false,
                "boundingRectanglesC": 1,
                "boundingRectanglesOffset": 300,
                "brunnelManoeuvres": false,
                "dynamicInfo": false,
                "manoeuvreAttributes": false,
                "manoeuvreGroupRatio": 1,
                "manoeuvreGroups": false,
                "manoeuvres": false,
                "tollManoeuvres": true,
                "nodes": false,
                "polygon": false,
                "segmentAttributes": false,
                "segments": false,
                "featureDescriptions": true,
                "texts": false,
                "totalRectangle": false,
                "urbanManoeuvres": false
            },
            "countryInfoOptions": {
                "namedToll": true,
                "tollTotals": true,
                "detailedTollCosts": true,
                "calculatePartTollCosts": false,
                "waypointIndexInTollCostInfo": true
            },
            "callerContext": {
                "properties": [
                    {
                        "key": "CoordFormat",
                        "value": "OG_GEODECIMAL"
                    }
                ]
            }
        }, { headers: { "Authorization": "Basic " + btoa("xtok:51FA3E8E-8BF3-49EF-AB82-59D807A0645C") } })
    );
    return result
}

export { modificarRutas, agregarRutas, eliminarRutas, obtenerRutasId, obtenerRutas, obtenerRutasOrigenes, calcularCosto }