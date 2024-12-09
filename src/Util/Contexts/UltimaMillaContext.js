import {arrayPonts} from "../Data";
import {trackPromise} from "react-promise-tracker";
import axios from "axios";
import Tour from "../../Views/UltimaMilla/Tour";
import moment from "moment";
import {ACCESS_TOKEN, API_HEADERS} from "../../Constants";
import {getAddressFormated} from "../Util";

const headers = API_HEADERS



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


async function convertData(trucks, guias) {
    var array = []
    array = array.concat((guias.map((p, index) => (
        {
            "id": "job_"+index,
            "tasks":
                p.m_bEsRecoleccion ? {
                    "pickups": [{
                        "places": [{
                            "location": {
                                "lat": parseFloat(p.lat),
                                "lng": parseFloat(p.lng)
                            },
                            "duration": 0,
                            "tag": "Index_"+index
                        }],

                        "demand": [
                            1
                        ]
                    }]
                } : {
                    "deliveries":[{
                        "places": [{
                            "location": {
                                "lat": parseFloat(p.lat),
                                "lng": parseFloat(p.lng)
                            },
                            "duration": 0,
                            "tag": "Index_"+index
                        }],
                        "demand": [
                            1
                        ]
                    }]
                }
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
        if (g.m_sLatitud.length === 0) {
            var location = await searchLocationGuia(g.m_bEsRecoleccion ? g.m_sCiudadOrigen : g.m_sCiudadDestino, g.m_bEsRecoleccion ? g.m_sDomicilioRemitente : g.m_sDomicilioDestinatario, g.m_bEsRecoleccion ? g.m_sCodigoPostalRemitente : g.m_sCodigoPostalDestinatario)
            guias.push({
                ...g,
                lat: location.y,
                lng: location.x,
                index: i
            })
        } else {
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
    var location = await searchLocation(data.sucursalSeleccionada.m_sMunicipio, data.sucursalSeleccionada.m_sCalle)
    var converData = await convertData(truck, guias, data)
    var result;
    var object = Object.assign({}, {
        "plan": {
            "jobs": converData
        },
        "fleet": {
            "types":
                truck.map(t => (
                    {
                        "id": "vehicle" + t.m_nIdUnidad,
                        "profile": "car_" + t.m_nIdUnidad,
                        "capacity": [
                            100.0
                        ],
                        "costs": {
                            "fixed": 5.0,
                            "distance": 0.007,
                            "time": 0.02
                        },
                        "amount": 1,
                        "shifts": [
                            {
                                "start": {
                                    "time": data.startDate + ":00+00:00",
                                    "location": {
                                        "lat": location.y,
                                        "lng": location.x
                                    }
                                },
                                "end": {
                                    "time": data.finishDate+ ":00+00:00",
                                    "location": {
                                        "lat": location.y,
                                        "lng": location.x
                                    }
                                }
                            }
                        ]
                    }
                )),
            "profiles": truck.map(t => (
                {
                    "type": "car",
                    "name": "car_" + t.m_nIdUnidad
                }
            ))
        }
    })
    //var token = await  axios.get(process.env.REACT_APP_REPORT_URL + "/api/here/getToken",{})

    trackPromise(
        result = new Promise((resolve, reject) => {
            axios.post("https://tourplanning.hereapi.com/v3/problems?apiKey=" + process.env.REACT_APP_HERE_API_TOEKN, object, {headers: {'Content-Type': 'application/json'}}).then(({data}) => {
                resolve(data)
            }).catch((err) => {
                reject(err)
            })

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
    var result;
    trackPromise(
        result = new Promise((resolve, reject) => {
            axios.get(`https://router.hereapi.com/v8/routes?transportMode=car&origin=${sucursal.lat},${sucursal.lng}&destination=${sucursal.lat},${sucursal.lng}${points.map(p => `&via=${p.lat},${p.lng}`).join('')}&return=polyline,summary,actions,instructions&apiKey=${process.env.REACT_APP_HERE_API_TOEKN}`, {}).then(({data}) => {
                resolve(data)

            })

        })
    )
    return result

}

function calcularRutaUltimaMilla(points, sucursal, camion) {
    var result;
    trackPromise(
        result = new Promise((resolve, reject) => {
            axios.get(`https://router.hereapi.com/v8/routes?transportMode=car&origin=${camion.lat},${camion.lng}&destination=${sucursal.lat},${sucursal.lng}${points.map(p => `&via=${p.lat},${p.lng}`).join('')}&return=polyline,summary,actions,instructions&apiKey=${process.env.REACT_APP_HERE_API_TOEKN}`, {}).then(({data}) => {
                resolve(data)

            })

        })
    )
    return result

}

async function searchLocationAddress(address) {
    var location = await axios.get("https://geocode.search.hereapi.com/v1/geocode?languages=es-MX&q=" + address + "&apiKey=" + process.env.REACT_APP_HERE_API_TOEKN, {})

    if (location.data.items) {
        if (location.data.items.length !== 0) {
            return {x: location.data.items[0].position.lng, y: location.data.items[0].position.lat}
        } else {
            return {x: 0.0, y: 0.0}
        }
    } else {
        return {x: 0.0, y: 0.0}
    }

}

async function searchLocationGuia(city, address, postalCode) {
    var addressComplete = address + ", " + city
    var location = await axios.get("https://geocode.search.hereapi.com/v1/geocode?languages=es-MX&q="
        + addressComplete + "&qq=postalCode=" + postalCode + "&apiKey=" + process.env.REACT_APP_HERE_API_TOEKN, {})

    if (location.data.items) {
        if (location.data.items.length !== 0) {
            return {x: location.data.items[0].position.lng, y: location.data.items[0].position.lat}
        } else {
            return {x: 0.0, y: 0.0}
        }
    } else {
        return {x: 0.0, y: 0.0}
    }
}

async function searchLocationGuiav2(calle, numeroExterior, numeroInterior, colonia, ciudad, codigoPostal, estado, pais, direccionCompleta) {
    let location = await axios.get("https://geocode.search.hereapi.com/v1/geocode?languages=es-MX&q="
        + direccionCompleta + "&qq=postalCode=" + codigoPostal + "&apiKey=" + process.env.REACT_APP_HERE_API_TOEKN, {})

    if (location.data.items) {
        if (location.data.items.length !== 0) {
            return {x: location.data.items[0].position.lng, y: location.data.items[0].position.lat}
        } else {
            return {x: 0.0, y: 0.0}
        }
    } else {
        return {x: 0.0, y: 0.0}
    }
}

function searchAdressWithCoordinates(x, y) {

}

function searchLocationWeb(city, address, subdistrict, number, code) {
    let arrayAddress = []
    if (address){
        arrayAddress.push(address)
    }
    if (subdistrict){
        arrayAddress.push(subdistrict)
    }
    if (city){
        arrayAddress.push(city)
    }
    let result;
    let addressComplete = arrayAddress.join(', ')
    let houseNumbre = ''
    if (number){
        houseNumbre = 'houseNumber=' + number + ';'
    }
    trackPromise(
        result = new Promise((resolve, reject) => {
            axios.get("https://geocode.search.hereapi.com/v1/geocode?languages=es-MX&q="
                + addressComplete + "&qq=" + houseNumbre + "postalCode=" + code + "&apiKey="
                + process.env.REACT_APP_HERE_API_TOEKN, {}).then(({data}) => {
                if (data) {
                    if (data.items) {
                        if (data.items.length !== 0) {
                            resolve({x: data.items[0].position.lng, y: data.items[0].position.lat})
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

async function searchLocation(city, address) {
    var addressComplete = address + ", " + city
    var location = await axios.get("https://geocode.search.hereapi.com/v1/geocode?languages=es-MX&q="
        + addressComplete + "&apiKey=" + process.env.REACT_APP_HERE_API_TOEKN, {})


    if (location.data.items) {
        if (location.data.items.length !== 0) {
            return {x: location.data.items[0].position.lng, y: location.data.items[0].position.lat}
        } else {
            return {x: 0.0, y: 0.0}
        }
    } else {
        return {x: 0.0, y: 0.0}
    }
}

function agregarRuta(idUltimaMilla, tour, data,hora) {
    const url = `${process.env.REACT_APP_REPORT_URL}/api/GuardarUltimaMilla`;
    let result;
    var ultimaMillaObject = {
        idUltimaMilla: idUltimaMilla,
        fecha: moment(data.fecha).format("YYYY-MM-DD"),
        hora: hora,
        creadoPor: localStorage.getItem("UsuarioId"),
        idSucursal: data.sucursalSeleccionada.m_nIdSucursal,
        arrZonas: [],
        rutas: []
    }
    tour.unidades.forEach((u) => {
        var tempTour = tour.tour.tours.find(t => t.typeId === ("vehicle" + u.m_nIdUnidad))
        var guias = tour.paquetes.filter((p, index) => tempTour.stops.map(a => a.activities).reduce((a,b) => a.concat(b)).filter(f => f.type === "pickup" || f.type === "delivery").map(a => parseInt(a.jobId.replace('job_',''))).includes(p.index))
        guias = ordenarGuiasPorRuta(tempTour, guias)
        ultimaMillaObject.rutas.push({
            idOperador: u.m_nIdOperador,
            idUnidad: u.m_nIdUnidad,
            idRemolque1: u.idRemolque1,
            idRemolque2: u.idRemolque2,
            idDolly: u.idDolly,
            guias: guias.map((g, index) => {
                var tourReport = tour.tour.tours.find(t => t.typeId === ("vehicle" + u.m_nIdUnidad))
                var distance = tourReport.statistic.distance
                var reportTime = tourReport.statistic.duration
                var date = new Date(tourReport.stops.find( s => (s.activities[0].type === "delivery" || s.activities[0].type === "pickup"))?.time.arrival)
                var userTimezoneOffset = date.getTimezoneOffset() * 60000;
                date = new Date(date.getTime() + userTimezoneOffset);
                var time = date.toLocaleTimeString()
                return ({
                    idGuia: g.m_nId,
                    lat: g.lat,
                    lng: g.lng,
                    orden: index + 1,
                    horaEstimada: time,
                    kilometros: distance / 1000,
                    esRecoleccion: g.m_bEsRecoleccion
                })
            })
        })
    })
    data.zonasSeleccionada.forEach((z) => {
        ultimaMillaObject.arrZonas.push({m_nIdZona: z.m_nIdZona})
    })
    trackPromise(
        result = axios.post(url, Object.assign({}, ultimaMillaObject), {headers})
    );
    return result
}

function validarUnidadesSeleccionadas(unidades) {
    const url = `${process.env.REACT_APP_REPORT_URL}/api/UltimaMilla/ValidarUnidades`;
    let result;
    var config = {
        method: 'post',
        url: url,
        headers: {
            'RFC': 'ADI880815DA7',
            'Content-Type': 'application/json'
        },
        data: JSON.stringify(unidades)
    };
    trackPromise(
        result = axios(config)
    )
    ;
    return result

}

async function ordenarParada(idParada, guias, guiasDescartadas) {
    const url = `${process.env.REACT_APP_REPORT_URL}/api/UltimaMilla/OrdenarParada`;
    let result;

    guias = await obtenerGuiasUbicacion(guias)
    let paquetes = guias.map((g, index) => ({
        idGuia: g.m_nId,
        lat: g.lat.toString(),
        lng: g.lng.toString(),
        idEstatus: g.m_nEstatusUlimaMilla,
        orden: index + 1,
        esRecoleccion: g.m_bEsRecoleccion,
        idParadaGuia: g.m_nIdParadaGuia
    }))
    let paquetesDescartados = guiasDescartadas.map((g, index) => ({
        idGuia: g.m_nId,
        lat: g.lat.toString(),
        lng: g.lng.toString(),
        orden: index + 1,
        esRecoleccion: g.m_bEsRecoleccion,
        idParadaGuia: g.m_nIdParadaGuia
    }))
    trackPromise(
        result = axios.put(url, Object.assign({}, {
            m_nIdParadaUltimaMilla: idParada,
            guias: paquetes,
            guiasDescartadasDeRuta: paquetesDescartados
        }), {headers})
    );
    return result
}

/**Se usará sólo para traer todos los datos de ultima milla sin imagenes*/
function obtenerUltimaMillaFecha(date, idSucursal, zonas) {
    const url = `${process.env.REACT_APP_REPORT_URL}/api/GetUltimaMillaFecha/` + moment(date).format("YYYY-MM-DD") + "/" + idSucursal;
    let result;
    trackPromise(
        result = axios.post(url, Object.assign({}, {zonas: zonas.join(",")}), {headers})
    );
    return result
}

/**Se usará sólo para traer las imagenes*/
function obtenerUltimaMillaFechaImagenes(date, idSucursal, zonas) {
    const url = `${process.env.REACT_APP_API_URL}/GetUltimaMillaFecha/` + moment(date).format("YYYYMMDD") + "/" + idSucursal;
    let result;
    trackPromise(
        result = axios.post(url, Object.assign({}, {zonas: zonas.join(",")}), {headers})
    );
    return result
}

function obtenerPaquetesInforme(idInforme, zonasIds) {
    const url = `${process.env.REACT_APP_REPORT_URL}/api/UltimaMilla/GetListadoPaquetesByInforme/` + idInforme;
    let result;
    trackPromise(
        result = axios.post(url, Object.assign({}, {zonas: zonasIds.join(",")}), {headers})
    );
    return result
}

function obtenerPaquetesViaje(idViaje, zonasIds) {
    const url = `${process.env.REACT_APP_REPORT_URL}/api/UltimaMilla/GetListadoPaquetesByViaje/` + idViaje;
    let result;
    trackPromise(
        result = axios.post(url, Object.assign({}, {zonas: zonasIds.join(",")}), {headers})
    );
    return result
}

function obtenerPaquetesUnidadOperador(idUnidad, idOperador, zonasIds) {
    const url = `${process.env.REACT_APP_REPORT_URL}/api/UltimaMilla/GetListadoPaquetesByUnidadOperador/${idUnidad}/${idOperador}`;
    let result;
    trackPromise(
        result = axios.post(url, Object.assign({}, {zonas: zonasIds.join(",")}), {headers})
    );
    return result
}

async function remplazarPaqueteUltimaMilla(idParada, paqueteViejo, paqueteNuevo) {
    const url = `${process.env.REACT_APP_REPORT_URL}/api/UltimaMilla/RemplazarParada/${idParada}/${paqueteViejo.m_nId}`;
    let result;
    var guia = await obtenerGuiasUbicacion([paqueteNuevo])
    trackPromise(
        result = axios.put(url, Object.assign({}, {
            esRecoleccion: paqueteViejo.m_bEsRecoleccion,
            idNuevaGuia: paqueteNuevo.m_nId,
            nuevoEsRecoleccion: paqueteNuevo.m_bEsRecoleccion,
            lat: guia[0].lat,
            lng: guia[0].lng
        }), {headers})
    );
    return result
}

function eliminarPaqueteUltimaMilla(idParada, idGuia, esRecoleccion) {
    const url = `${process.env.REACT_APP_REPORT_URL}/api/UltimaMilla/EliminarParadaOperador`;
    let result;
    trackPromise(
        result = axios.post(url, Object.assign({}, {
            esRecoleccion: esRecoleccion,
            idGuia: idGuia,
            idParada: idParada,
        }), {headers})
    );
    return result
}

/*function confirmarUbicacion(coordenadas, id, esRecoleccion) {
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
}*/

function obtenerUltimaMillaReporte(id) {
    const url = `${process.env.REACT_APP_REPORT_URL}/api/GenerarReporte/UltimaMilla/${id}`;
    let result;
    trackPromise(
        result = axios.get(url, {headers})
    );
    return result
}

function cancelarRuta(id) {
    const url = `${process.env.REACT_APP_REPORT_URL}/api/UltimaMilla/EliminarRuta/${id}`;
    let result;
    trackPromise(
        result = axios.delete(url, {headers})
    );
    return result
}

function obtenerCFDI(id, esRecolecion, IdSucursal,fecha,hora) {
    const url = `${process.env.REACT_APP_API_URL}/UltimaMilla/GetCFDITraslada/${id}/${esRecolecion ? 1 : 0}/${IdSucursal}/${fecha}/${hora}`;
    let result;
    trackPromise(
        result = axios.get(url, {headers})
    );
    return result
}

function obtenerXMLCFDI(id, esRecolecion, IdSucursal,fecha,hora) {
    const url = `${process.env.REACT_APP_API_URL}/UltimaMilla/GetXMLCFDITraslada/${id}/${esRecolecion ? 1 : 0}/${IdSucursal}/${fecha}/${hora}`;
    let result;
    trackPromise(
        result = axios.get(url, {headers})
    );
    return result
}

function obtenerXMLPermisionario(id, esRecolecion, IdSucursal) {
    const url = `${process.env.REACT_APP_API_URL}/UltimaMilla/GetXMLTrasladaPermisionario/${id}/${esRecolecion ? 1 : 0}/${IdSucursal}`;
    let result;
    trackPromise(
        result = axios.get(url, {headers})
    );
    return result
}

function obtenerReporteCFDIGuia(id) {
    const url = `${process.env.REACT_APP_REPORT_URL}/api/GenerarReporte/CFDIGuia/${id}`;
    let result;
    trackPromise(
        result = axios.get(url, {headers})
    );
    return result
}

function obtenerReporteCFDIRecoleccion(id) {
    const url = `${process.env.REACT_APP_REPORT_URL}/api/GenerarReporte/CFDIRecoleccion/${id}`;
    let result;
    trackPromise(
        result = axios.get(url, {headers})
    );
    return result
}

async function validarUnidadOcupada(idUnidad, fecha, idSucursal) {
    const url = `${process.env.REACT_APP_REPORT_URL}/api/UltimaMilla/ValidarUnidad/${idUnidad}/${fecha}/${idSucursal}`;
    let result;
    trackPromise(
        result = axios.get(url, {headers})
    );
    return result
}

function obtenerImagenEvidencia(idGuia,esRecoleccion){
    const url = `${process.env.REACT_APP_REPORT_URL}/api/UltimaMilla/GetImagenEvidencia/${idGuia}/${esRecoleccion}`;
    let result;
    trackPromise(
        result =  axios.get(url, { headers })
    );
    return result
}

//Cambiar a Local para pruebas
function obtenerPaquetesPorParada(idGuia){
    const url = `${process.env.REACT_APP_REPORT_URL}/api/UltimaMilla/paquetes-por-parada/consultar/${idGuia}`;
    let result;
    trackPromise(
        result =  axios.get(url, { headers })
    );
    return result
}

function obtenerPaquetesParciales(idParada, idGuia){
    const url = `${process.env.REACT_APP_REPORT_URL}/api/UltimaMilla/paquetes-parciales/consultar/${idParada}/${idGuia}`;
    let result;
    trackPromise(
        result =  axios.get(url, { headers })
    );
    return result
}

//Cambiar a Local para pruebas
function agregarPaquetesParciales(idParada, idGuia,params) {
    const url = `${process.env.REACT_APP_REPORT_URL}/api/UltimaMilla/paquetes-parciales/agregar/${idParada}/${idGuia}`;
    let result;
    trackPromise(
        result = axios.post(url, Object.assign([],params), {headers})
    );
    return result
}

function obtenerGuiaRecoleccionPorFolio(folio){
    const url = `${process.env.REACT_APP_REPORT_URL}/api/UltimaMilla/GetGuiaRecoleccionPorFolio/${folio}`;
    let result;
    trackPromise(
        result =  axios.get(url, { headers })
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
    obtenerUltimaMillaFechaImagenes,
    remplazarPaqueteUltimaMilla,
    ordenarParada,
    eliminarPaqueteUltimaMilla,
    obtenerPaquetesInforme,
    obtenerPaquetesViaje,
    obtenerPaquetesUnidadOperador,
    calcularRutaUltimaMilla,
    searchAdressWithCoordinates,
    validarUnidadesSeleccionadas,
    validarUnidadOcupada,
    searchLocationGuia,
    searchLocationGuiav2,
    obtenerImagenEvidencia,
    obtenerPaquetesPorParada,
    obtenerPaquetesParciales,
    agregarPaquetesParciales,
    obtenerGuiaRecoleccionPorFolio
}


function ordenarGuiasPorRuta(tour, guias) {
    var result = []
    tour.stops.map(a => a.activities).reduce((a,b) => a.concat(b)).filter(f => f.type === "pickup" || f.type === "delivery").forEach((item, index) => {
        var found = false;
        guias = guias.filter(function (guia, index) {
            if (!found && guia.index == parseInt(item.jobId.replace('job_',''))) {
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