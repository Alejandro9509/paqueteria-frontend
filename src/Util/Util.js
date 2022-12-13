import {useEffect, useRef} from "react";
import axios from "axios";
import {trackPromise} from "react-promise-tracker";
import {API_HEADERS} from "../Constants";
import * as XLSX from "xlsx";
import moment from "moment";

const XRouteClient = window.XRouteClient;
const XLoadClient = window.XLoadClient;
var xroute = new XRouteClient();
xroute.setCredentials("xtok", "51FA3E8E-8BF3-49EF-AB82-59D807A0645C")
var xload = new XLoadClient();
xload.setCredentials("xtok", "51FA3E8E-8BF3-49EF-AB82-59D807A0645C")


const headers = API_HEADERS

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


export  function cubicarGuias(guias, origin, destiny, remolque1, remolque2) {
    var result;
    trackPromise(
        result = new Promise(async (resolve, reject)  => {
            guias = guias.filter(g => g.m_nIdCiudadDestino !== origin.m_nIdCiudad && origin.m_nIdCiudad === g.m_nIdCiudadOrigen)
            var locationOrigin = await searchLocation(origin.m_sCiudad)
            var locationDestiny = await searchLocation(destiny.m_sCiudad)
            var guiasCoordenadas = []
            if (guias.length === 0) {
                return []
            }
            for (var i = 0; i < guias.length; i++) {
                var g = guias[i]
                var location = await searchLocation(g.m_sCiudadDestino)
                guiasCoordenadas.push({
                    idGuia: g.m_nIdGuia,
                    index: i,
                    folio: g.m_nFolioGuia,
                    destino: g.m_sCiudadDestino,
                    paquetes: g.m_nNoPaquetes,
                    lat: location.y,
                    lng: location.x,
                    embarqueId: g.m_nIdEmbarque,
                    arrayPaquetes: g.m_arrClsDetalle
                })
            }
            ;
            if (guiasCoordenadas.length === 0) {
                reject("No se encontraron guias en la ruta seleccionada")
                return
            }
            var routeEncode = await route(locationOrigin, locationDestiny)
            var locationMatch = await calculateReachableLocations(routeEncode, guiasCoordenadas)
            var guiasMatch = guiasCoordenadas.filter(g => locationMatch.includes(g.index))
            var bins = await packBins(remolque1, remolque2, guiasMatch)
            var destinos = getUniqueListBy(bins, "destino")
            resolve(destinos.map(d => bins.filter(b => b.destino === d.destino)))
        })
    )
    return result

}

async function searchLocation(city) {
    var location = await axios.get("https://geocode.search.hereapi.com/v1/geocode?languages=es-MX&q="
        + city  + "&apiKey=" + process.env.REACT_APP_HERE_API_TOEKN, {})

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
    if (location.reachableLocations) {
        return location.reachableLocations.map(r => r.inputLocationIndex);
    } else {
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
    console.log([].concat.apply([], location.packedBins.map(p => p.packedItems)))
    return getUniqueListBy([].concat.apply([], location.packedBins.map(p => p.packedItems)).map(i => guias.find(r => r.embarqueId === parseInt(i.itemTypeId.split("-")[1]))), "idGuia");

}

async function obtenerEmbarque(id) {
    const url = `${process.env.REACT_APP_API_URL}/Embarques/GetById/${id}`;
    var location = await axios.get(url, {headers})
    console.log(location)
    return location.data.m_arrPaquetes
}

export function getUniqueListBy(arr, key) {
    return [...new Map(arr.map(item => [item[key], item])).values()]
}

export function encode_utf8(s) {
    return unescape(encodeURIComponent(s));
}

export function decode_utf8(s) {
    return decodeURIComponent(escape(s));
}

/**Retorna = 2022-01-24T14:06*/
export const getCurrentDateTime = () => {
    return `${new Date().getFullYear()}-${`${new Date().getMonth() +
    1}`.padStart(2, 0)}-${`${new Date().getDate()}`.padStart(2, 0)}T${`${new Date().getHours()}`.padStart(2, 0)}:${`${new Date().getMinutes()}`.padStart(2, 0)}`
}

/**Retorna = 2022-01-24*/
export const getCurrentDate = () => {
    return `${new Date().getFullYear()}-${`${new Date().getMonth() +
    1}`.padStart(2, 0)}-${`${new Date().getDate()}`.padStart(2, 0)}`
}

/**Retorna = 14:06*/
export const getCurrentTime = () => {
    return `${`${new Date().getHours()}`.padStart(2, 0)}:${`${new Date().getMinutes()}`.padStart(2, 0)}`
}

export const getRandomId = () => {
  return Math.floor(Math.random() * 10000)
}

export function validarDerecho(idDerecho){
if (!JSON.parse(localStorage.getItem("Permisos"))){
    return false
}
    return (JSON.parse(localStorage.getItem("Permisos")).map(d => d.IdProceso).includes(idDerecho) || parseInt(localStorage.getItem("TipoUsuario")) === 1)
}

export const currencyFormatter = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
});

export function getAddressFormated(calle, numeroExterior, numeroInterior, colonia, codigoPostal,ciudad,  estado, pais){
    let addressComplete = "";
    if (calle){
        addressComplete += calle
    }
    if (numeroExterior){
        addressComplete += ","+numeroExterior
    }
    /*if (numeroInterior){
        addressComplete += ","+numeroInterior
    }*/
    if (colonia){
        addressComplete += ","+colonia
    }
    if (codigoPostal){
        addressComplete += ","+codigoPostal
    }
    if (ciudad){
        addressComplete += ","+ciudad
    }
    if (estado){
        addressComplete += ","+estado
    }
    if (pais){
        addressComplete += ","+pais
    }
    return addressComplete
}

export function readExcel(FORMAT,file){
    const promise = new Promise((resolve, reject) => {
        const fileReader = new FileReader();
        fileReader.readAsArrayBuffer(file);

        fileReader.onload = (e) => {
            const bufferArray = e.target.result;

            const wb = XLSX.read(bufferArray, { type: "buffer",cellDates: true });

            const wsGuias = (wb.Sheets['Embarques']);
            const wsPaquetes = (wb.Sheets['Paquetes']);

            const data = XLSX.utils.sheet_to_json(wsGuias, {range:0}).filter(item => item['Número de embarque'] > 0);
            const dataPaquetes = XLSX.utils.sheet_to_json(wsPaquetes, {range:0}).filter(item => item['Número de embarque'] > 0);
            console.log(data)
            //VALIDACIONES PAQUETES
            const arrayPaquetes = dataPaquetes.map((item) => ({
                numeroEmbarque: item[FORMAT.paquetes.numeroEmbarque],
                idProducto: item[FORMAT.paquetes.idProducto],
                idEmbalaje: item[FORMAT.paquetes.idEmbalaje],
                alto: item[FORMAT.paquetes.alto],
                ancho: item[FORMAT.paquetes.ancho],
                largo: item[FORMAT.paquetes.largo],
                peso: item[FORMAT.paquetes.peso],
                volumen: parseFloat(item[FORMAT.paquetes.alto]) * parseFloat(item[FORMAT.paquetes.ancho]) * parseFloat(item[FORMAT.paquetes.largo]),
                cantidad: item[FORMAT.paquetes.cantidad],
                descripcion: item[FORMAT.paquetes.descripcion],
                observaciones: item[FORMAT.paquetes.observaciones] || ""
            }))
            console.log(arrayPaquetes)

            //VALIDACIONES DE GUIAS
            const newArray = data.map(function(item,index){
                /*if(!item[FORMAT.nombreRemitente]){
                    reject(`El nombre del remitente es obligatorio linea ${index + comienzoLinea}`);
                }
                if(!item[FORMAT.rfcRemitente] ){
                    reject(`El rfc del remitente es obligatorio linea ${index + comienzoLinea}`);
                }

                if(!item[FORMAT.calleRemitente]){
                    reject(`El item del remitente es obligatorio linea ${index + comienzoLinea}`);
                }
                if(!item[FORMAT.numeroExtRemitente]){
                    reject(`El numero interno del remitente es obligatorio linea ${index + comienzoLinea}`);
                }

                if(!item[FORMAT.codigoPostalRemitente]){
                    reject(`El codigo postal del remitente es obligatorio linea ${index + comienzoLinea}`);
                }

                if( !item[FORMAT.correoRemitente] ){
                    reject(`El correo del remitente es obligatorio linea ${index + comienzoLinea}`);
                }

                if(!item[FORMAT.telefonoRemitente] ){
                    reject(`El telefono del remitente es obligatorio linea ${index + comienzoLinea}`);
                }

                if(!item[FORMAT.contactoRemitente]  ){
                    reject(`El contacto del remitente es obligatorio linea ${index + comienzoLinea}`);
                }

                if(!item[FORMAT.nombreDestinatario] ){
                    reject(`El nombre del destinatario es obligatorio linea ${index + comienzoLinea}`);
                }

                if( !item[FORMAT.rfcDestinatario] ){
                    reject(`El rfc del destinatario es obligatorio linea ${index + comienzoLinea}`);
                }

                if(!item[FORMAT.calleDestinatario] ){
                    reject(`La calle del destinatario es obligatorio linea ${index + comienzoLinea}`);
                }

                if( !item[FORMAT.numeroExtDestinatario]){
                    reject(`El numero exterior del destinatario es obligatorio linea ${index + comienzoLinea}`);
                }
                if(  !item[FORMAT.codigoPostalDestinatario] ){
                    reject(`El codigo postal del destinatario es obligatorio linea ${index + comienzoLinea}`);
                }

                if( !item[FORMAT.correoDestinatario]  ){
                    reject(`El correo del destinatario es obligatorio linea ${index + comienzoLinea}`);
                }

                if( !item[FORMAT.telefonoDestinatario] ){
                    reject(`El telefono del destinatario es obligatorio linea ${index + comienzoLinea}`);
                }

                if(!item[FORMAT.contactoDestinatario] ){
                    reject(`El contacto del destinatario es obligatorio linea ${index + comienzoLinea}`);
                }

                if(!item[FORMAT.latitud] ){
                    reject(`La latitud es obligatorio linea ${index + comienzoLinea}`);
                }

                if( !item[FORMAT.longitud]  ){
                    reject(`La longitud es obligatorio linea ${index + comienzoLinea}`);
                }
                if( !item[FORMAT.conCita]  ){
                    reject(`El campo con cita es obligatorio linea ${index + comienzoLinea}`);
                }

                if( !item[FORMAT.fechaCita] ){
                    reject(`La fecha cita es obligatoria linea ${index + comienzoLinea}`);
                }

                if(!item[FORMAT.horaCitaMinima] ){
                    reject(`La hora cita minima es obligatoria linea ${index + comienzoLinea}`);
                }
                if( !item[FORMAT.horaCitaMaxima] ){
                    reject(`La hora cita maxima es obligatoria linea ${index + comienzoLinea}`);
                }
                if(!item[FORMAT.citaPendiente]){
                    reject(`El campo de cita pendiente es obligatoria linea ${index + comienzoLinea}`);
                }*/

                /*arrayPaquetes.forEach(function (paquete,index) {
                    if(paquete.numeroGuia == item[FORMAT.numeroGuia]){
                        /!*if(!paquete.numeroGuia){
                            reject(`El numero guia es obligatorio linea ${index + comienzoLinea}`);
                        }
                        if(!paquete.embalaje){
                            reject(`El embalaje es obligatorio linea ${index + comienzoLinea}`);
                        }
                        if(!paquete.alto){
                            reject(`El alto es obligatorio linea ${index + comienzoLinea}`);
                        }

                        if(!paquete.ancho){
                            reject(`El ancho es obligatorio linea ${index + comienzoLinea}`);
                        }

                        if(!paquete.largo){
                            reject(`El largo es obligatorio linea ${index + comienzoLinea}`);
                        }

                        if(!paquete.peso){
                            reject(`El peso es obligatorio linea ${index + comienzoLinea}`);
                        }

                        if(!paquete.cantidad){
                            reject(`La cantidad es obligatoria linea ${index + comienzoLinea}`);
                        }

                        if(!paquete.descripcion){
                            reject(`La descripcion es obligatorio linea ${index + comienzoLinea}`);
                        }*!/
                        paquetesGuias.push(paquete);
                    }

                });*/
                let embarqueResumen = {
                    fechaRegistro:getCurrentDate(),
                    horaRegistro:getCurrentTime(),
                    numeroEmbarque : item[FORMAT.numeroEmbarque],
                    idUsuario: localStorage.getItem("UsuarioId"),
                    idMoneda: item[FORMAT.idMoneda],
                    idTipoCambio: item[FORMAT.idTipoCambio],
                    idTipoCobro: item[FORMAT.idTipoCobro],
                    idCliente: item[FORMAT.idCliente],
                    idTipoSeguro: item[FORMAT.idTipoSeguro],
                    porcentajeSeguro: item[FORMAT.porcentajeSeguro],
                    valorDeclarado: item[FORMAT.valorDeclarado],
                    validarTimbradoFactura: item[FORMAT.validarTimbradoFactura] === 'SI',
                    observaciones: item[FORMAT.observaciones],
                    idRemitente: item[FORMAT.idRemitente],
                    correoRemitente: item[FORMAT.correoRemitente],
                    telefonoRemitente: item[FORMAT.telefonoRemitente],
                    contactoRemitente: item[FORMAT.contactoRemitente],
                    idDestinatario: item[FORMAT.idDestinatario],
                    correoDestinatario: item[FORMAT.correoDestinatario],
                    telefonoDestinatario: item[FORMAT.telefonoDestinatario],
                    contactoDestinatario: item[FORMAT.contactoDestinatario],
                    entregaEnSucursal: item[FORMAT.entregaEnSucursal] === 'SI',
                    entregaDiferenteDomicilio: item[FORMAT.entregaDiferenteDomicilio] === 'SI',
                    latitud: item[FORMAT.latitud],
                    longitud: item[FORMAT.longitud],
                    entregaConCita: item[FORMAT.entregaConCita] === 'SI'
                }
                if (embarqueResumen.entregaEnSucursal){
                    embarqueResumen.idSucursalEntrega = item[FORMAT.idSucursalEntrega]
                }else{
                    if (embarqueResumen.entregaDiferenteDomicilio) {
                        embarqueResumen.codigoPostalDiferenteDomicilio = item[FORMAT.codigoPostalDiferenteDomicilio]
                        embarqueResumen.coloniaDiferenteDomicilio = item[FORMAT.coloniaDiferenteDomicilio]
                        embarqueResumen.calleNumeroDiferenteDomicilio = item[FORMAT.calleNumeroDiferenteDomicilio]
                        embarqueResumen.entregarEn = item[FORMAT.entregarEn]
                        embarqueResumen.datosAdicionalesEntrega = item[FORMAT.datosAdicionalesEntrega]
                    }
                }
                if (embarqueResumen.entregaConCita){
                    embarqueResumen.citaPendiente = item[FORMAT.citaPendiente] === 'SI'
                    if (!embarqueResumen.citaPendiente) {
                        embarqueResumen.fechaCita = moment(item[FORMAT.fechaCita]).format('YYYY-MM-DD')
                        embarqueResumen.horaMinima = moment(item[FORMAT.horaMinima]).format('HH:mm')
                        embarqueResumen.horaMaxima = moment(item[FORMAT.horaMaxima]).format('HH:mm')
                    }
                }
                embarqueResumen.paquetes = arrayPaquetes.filter(itemPaquete => parseInt(itemPaquete.numeroEmbarque) === parseInt(embarqueResumen.numeroEmbarque))
                return embarqueResumen
            })
            resolve(newArray);
        };

        fileReader.onerror = (error) => {
            reject(error);
        };
    });
    return promise
}

/**Se hace la relacion de los nombres de las columnas en el excel*/
export const DEFAULT_FORMAT = {
    //Todos son obligatorios
    numeroEmbarque:'Número de embarque',
    idMoneda: 'IdMoneda',
    idTipoCambio: 'IdTipoCambio',
    idTipoCobro: 'IdTipoCobro',
    idCliente: 'IdCliente',
    idTipoSeguro: 'IdTipoSeguro',
    porcentajeSeguro: 'Porcentaje de Seguro',
    valorDeclarado: 'Valor declarado',
    validarTimbradoFactura: 'Validar timbrado factura',
    observaciones: 'Observaciones',
    idRemitente: 'IdRemitente',
    correoRemitente: 'Correo remitente',
    telefonoRemitente: 'Telefono remitente',
    contactoRemitente: 'Contacto remitente',
    idDestinatario: 'IdDestinatario',
    correoDestinatario: 'Correo destinatario',
    telefonoDestinatario: 'Telefono destinatario',
    contactoDestinatario: 'Contacto destinatario',
    entregaEnSucursal: 'Entrega en sucursal',
    idSucursalEntrega: 'IdSucursalEntrega',
    entregaDiferenteDomicilio: 'Entrega en diferente domicilio',
    codigoPostalDiferenteDomicilio: 'Codigo postal',
    coloniaDiferenteDomicilio: 'Colonia',
    calleNumeroDiferenteDomicilio: 'Calle y numero',
    entregarEn: 'Entregar en',
    datosAdicionalesEntrega: 'Datos adicionales de entrega',
    latitud: 'Latitud',
    longitud: 'Longitud',
    entregaConCita: 'Entrega con cita',
    citaPendiente: 'Cita pendiente',
    fechaCita: 'Fecha cita',
    horaMinima: 'Hora mínima',
    horaMaxima: 'Hora máxima',
    paquetes:{
        numeroEmbarque: 'Número de embarque',
        cantidad: 'Cantidad',
        idProducto: 'IdProducto',
        descripcion: 'Descripcion',
        idEmbalaje: 'IdEmbalaje',
        largo: 'Largo',
        alto: 'Alto',
        ancho: 'Ancho',
        peso: 'Peso',
        observaciones: 'Observaciones'
    }
}