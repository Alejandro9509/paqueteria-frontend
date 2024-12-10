import {useEffect, useRef} from "react";
import axios from "axios";
import {trackPromise} from "react-promise-tracker";
import {API_HEADERS} from "../Constants";
import * as XLSX from "xlsx";
import moment from "moment";
import Noty from "noty";
import {es} from "date-fns/locale";

const headers = API_HEADERS

export function showSuccess(mensaje) {
    new Noty({
        type: "information",
        layout: "topCenter",
        text: mensaje,
        timeout: "8000",
    }).show();
}

export const mesString = (mes) => {
    if(mes === 1){
        return "enero"
    }           
    if(mes === 2){
        return "febrero"

    }
    if(mes === 3){
        return "marzo"

    }
    if(mes === 4){
        return "abril"

    }
    if(mes === 5){
        return "mayo"

    }
    if(mes === 6){
        return "junio"

    }
    if(mes === 7){
        return "julio"

    }
    if(mes === 8){
        return "agosto"

    }
    if(mes === 9){
        return "septiembre" 
    }           

    if(mes === 10){
        return "octubre"
    }
    if(mes === 11){
        return "noviembre"
    }
    if(mes === 12){
        return "diciembre"
    }
}

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

/*
export  function cubicarGuias(guias, origin, destiny, remolque1, remolque2) {
    var result;
    /*trackPromise(
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

}*/

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
/*
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

}*/

async function obtenerEmbarque(id) {
    const url = `${process.env.REACT_APP_API_URL}/Embarques/GetById/${id}`;
    var location = await axios.get(url, {headers})
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

export function readExcel(FORMAT,file, esRecoleccion){
    const promise = new Promise((resolve, reject) => {
        const fileReader = new FileReader();
        fileReader.readAsArrayBuffer(file);

        fileReader.onload = (e) => {
            const bufferArray = e.target.result;

            const wb = XLSX.read(bufferArray, { type: "buffer",cellDates: true });

            //SE OBTIENEN LAS HOJAS DEL EXCEL
            const wsGuias = (wb.Sheets[FORMAT.hojaEmbarques]);
            const wsPaquetes = (wb.Sheets[FORMAT.hojaPaquetes]);
            const wsComplementosSat = (wb.Sheets[FORMAT.hojaComplementos]);
            if(wsGuias == undefined || wsComplementosSat == undefined || wsPaquetes == undefined){
                resolve([]);
                let mensaje = ("En el documento no se encontraron la(s) hoja(s): " +
                    (wsComplementosSat == undefined ? FORMAT.hojaEmbarques+", " : "") +
                    (wsGuias == undefined ? FORMAT.hojaComplementos+", " : "") +
                    (wsPaquetes == undefined ? FORMAT.hojaPaquetes+", " : "")).slice(0, -2)
                    + "; el nombre de la hoja en el documento debe ser igual al configurado."
                showSuccess(mensaje)
                return;
            }

            //SE FILTRAN PARA SOLO OBTENER LAS QUE TIENEN NUMERO DE EMBARQUE AGREGADO
            const data = XLSX.utils.sheet_to_json(wsGuias, {range:0}).filter(item => item[FORMAT.numeroEmbarque] > 0);
            const dataPaquetes = XLSX.utils.sheet_to_json(wsPaquetes, {range:0}).filter(item => item[FORMAT.numeroEmbarque] > 0);
            const dataComplementosSat = XLSX.utils.sheet_to_json(wsComplementosSat, {range:0}).filter(item => item[FORMAT.numeroEmbarque] > 0);

            //SE RECORREN LAS FILAS CON DATOS Y SE TOMAN LOS DATOS CORRESPONDIENTES
            const arrayPaquetes = dataPaquetes.map((item) => ({
                numeroEmbarque: item[FORMAT.numeroEmbarque],
                // idProducto: item[FORMAT.paquetes.idProducto],
                numeroProducto: item[FORMAT.paquetes.numeroProducto],
                // idEmbalaje: item[FORMAT.paquetes.idEmbalaje],
                embalaje: item[FORMAT.paquetes.embalajePaquete],
                alto: item[FORMAT.paquetes.alto],
                ancho: item[FORMAT.paquetes.ancho],
                largo: item[FORMAT.paquetes.largo],
                peso: item[FORMAT.paquetes.pesoPaquete],
                volumen: parseFloat(item[FORMAT.paquetes.alto]) * parseFloat(item[FORMAT.paquetes.ancho]) * parseFloat(item[FORMAT.paquetes.largo]),
                cantidad: item[FORMAT.paquetes.cantidadPaquete],
                descripcion: item[FORMAT.paquetes.descripcionPaquete],
                observaciones: item[FORMAT.paquetes.observacionesPaquete] || ""
            }))
            const arrayComplementos = dataComplementosSat.map((item) => ({
                numeroEmbarque: item[FORMAT.numeroEmbarque],
                cantidad: item[FORMAT.complementosSat.cantidadComplemento],
                peso: item[FORMAT.complementosSat.pesoComplemento],
                claveProductoServicio: item[FORMAT.complementosSat.claveProductoServicio],
                claveUnidadMedida: item[FORMAT.complementosSat.claveUnidadMedida],
                esMaterialPeligroso: (item[FORMAT.complementosSat.esMaterialPeligroso])?.toUpperCase().trim() === 'SI'|| (item[FORMAT.complementosSat.esMaterialPeligroso])?.toUpperCase().trim() === 'SÍ',
                claveMaterialPeligroso: item[FORMAT.complementosSat.claveMaterialPeligroso],
                claveEmbalaje: item[FORMAT.complementosSat.claveEmbalaje],
                descripcionEmbalaje: item[FORMAT.complementosSat.descripcionEmbalajeComplemento],
                claveFraccionArancelaria: item[FORMAT.complementosSat.claveFraccionArancelaria],
                //esFarmaco: item[FORMAT.complementosSat.esFarmaco],
                nombreIngredienteActivo: item[FORMAT.complementosSat.nombreIngredienteActivo],
                claveSectorCofepris: item[FORMAT.complementosSat.claveSectorCofepris]?.toString().length==1?"0"+item[FORMAT.complementosSat.claveSectorCofepris]:item[FORMAT.complementosSat.claveSectorCofepris],
                esFarmaco: (item[FORMAT.complementosSat.esFarmaco])?.toUpperCase().trim() === 'SI'|| (item[FORMAT.complementosSat.esFarmaco])?.toUpperCase().trim() === 'SÍ',
                fechaCaducidad:item[FORMAT.complementosSat.fechaCaducidad],
                denominacionGenericaProd: item[FORMAT.complementosSat.denominacionGenericaProd],
                denominacionDistintivaProd: item[FORMAT.complementosSat.denominacionDistintivaProd],
                nombreQuimico: item[FORMAT.complementosSat.nombreQuimico],
                fabricante: item[FORMAT.complementosSat.fabricante],
                loteMedicamento: item[FORMAT.complementosSat.loteMedicamento],
                formaFarmaceutica: item[FORMAT.complementosSat.formaFarmaceutica]?.toString().length==1?"0"+item[FORMAT.complementosSat.formaFarmaceutica]:item[FORMAT.complementosSat.formaFarmaceutica],
                condicionesEspTransp: item[FORMAT.complementosSat.condicionesEspTransp]?.toString().length==1?"0"+item[FORMAT.complementosSat.condicionesEspTransp]:item[FORMAT.complementosSat.condicionesEspTransp],
                registroSanitarioFolioAutorizacion: item[FORMAT.complementosSat.registroSanitarioFolioAutorizacion],
                numeroCAS: item[FORMAT.complementosSat.numeroCAS],
                numRegSanPlagCOFEPRIS: item[FORMAT.complementosSat.numRegSanPlagCOFEPRIS],
                datosFabricante: item[FORMAT.complementosSat.datosFabricante],
                datosFormulador: item[FORMAT.complementosSat.datosFormulador],
                datosMaquilador: item[FORMAT.complementosSat.datosMaquilador],
                usoAutorizado: item[FORMAT.complementosSat.usoAutorizado],
            }))

            //VALIDACIONES DE GUIAS
            const newArray = data.map(function(item,index){
                let embarqueResumen = {
                    fechaRegistro:getCurrentDate(),
                    horaRegistro:getCurrentTime(),
                    numeroEmbarque : item[FORMAT.numeroEmbarque],
                    esRecoleccion : esRecoleccion,
                    idUsuario: localStorage.getItem("UsuarioId"),
                    moneda: item[FORMAT.moneda],
                    tipoCambio: item[FORMAT.tipoCambio],
                    tipoCobro: item[FORMAT.tipoCobro],
                    tipoSeguro: item[FORMAT.tipoSeguro],
                    porcentajeSeguro: item[FORMAT.porcentajeSeguro],
                    valorDeclarado: item[FORMAT.valorDeclarado],
                    validarTimbradoFactura: item[FORMAT.validarTimbradoFactura]?.toUpperCase().trim() === 'SI' || item[FORMAT.validarTimbradoFactura]?.toUpperCase().trim() === 'SÍ',
                    observaciones: item[FORMAT.observacionesEmbarque],
                    numeroRemitente: item[FORMAT.numeroRemitente],
                    correoRemitente: item[FORMAT.correoRemitente],
                    telefonoRemitente: item[FORMAT.telefonoRemitente],
                    contactoRemitente: item[FORMAT.contactoRemitente],
                    // idDestinatario: item[FORMAT.idDestinatario],
                    numeroDestinatario: item[FORMAT.numeroDestinatario],
                    correoDestinatario: item[FORMAT.correoDestinatario],
                    telefonoDestinatario: item[FORMAT.telefonoDestinatario],
                    contactoDestinatario: item[FORMAT.contactoDestinatario],
                    entregaEnSucursal: item[FORMAT.entregaEnSucursal]?.toUpperCase().trim() === 'SI' || item[FORMAT.entregaEnSucursal]?.toUpperCase().trim() === 'SÍ',
                    entregaDiferenteDomicilio: item[FORMAT.entregaDiferenteDomicilio]?.toUpperCase().trim() === 'SI' || item[FORMAT.entregaDiferenteDomicilio]?.toUpperCase().trim() === 'SÍ',
                    latitud: item[FORMAT.latitud],
                    longitud: item[FORMAT.longitud],
                    conCita: item[FORMAT.conCita]?.toUpperCase().trim() === 'SI' || item[FORMAT.conCita]?.toUpperCase().trim() === 'SÍ',
                    // idTipoServicio: item[FORMAT.idTipoServicio]
                    tipoServicio: item[FORMAT.tipoServicio],
                    referencia: item[FORMAT.referencia]
                }
                if (embarqueResumen.entregaEnSucursal){
                    // embarqueResumen.idSucursalEntrega = item[FORMAT.idSucursalEntrega]
                    embarqueResumen.sucursalEntrega = item[FORMAT.sucursalEntrega]
                }else{
                    if (embarqueResumen.entregaDiferenteDomicilio) {
                        embarqueResumen.codigoPostalDiferenteDomicilio = item[FORMAT.codigoPostalDiferenteDomicilio]
                        embarqueResumen.coloniaDiferenteDomicilio = item[FORMAT.coloniaDiferenteDomicilio]
                        embarqueResumen.calleNumeroDiferenteDomicilio = item[FORMAT.calleNumeroDiferenteDomicilio]
                        embarqueResumen.entregarEn = item[FORMAT.entregarEn]
                        embarqueResumen.datosAdicionalesEntrega = item[FORMAT.datosAdicionales]
                    }
                }
                if (embarqueResumen.esRecoleccion){
                    embarqueResumen.recoleccionDiferenteDomicilio = item[FORMAT.recoleccionDiferenteDomicilio]?.toUpperCase().trim() === 'SI' || item[FORMAT.recoleccionDiferenteDomicilio]?.toUpperCase().trim() === 'SÍ'
                    if (embarqueResumen.recoleccionDiferenteDomicilio){
                        embarqueResumen.codigoPostalDiferenteDomicilioRecoleccion = item[FORMAT.codigoPostalDiferenteDomicilioRecoleccion]
                        embarqueResumen.coloniaDiferenteDomicilioRecoleccion = item[FORMAT.coloniaDiferenteDomicilioRecoleccion]
                        embarqueResumen.calleNumeroDiferenteDomicilioRecoleccion = item[FORMAT.calleNumeroDiferenteDomicilioRecoleccion]
                        embarqueResumen.recogerEn = item[FORMAT.recogerEn]
                        embarqueResumen.datosAdicionalesRecoleccion = item[FORMAT.datosAdicionalesRecoleccion]
                    }
                }
                if (embarqueResumen.conCita){
                    embarqueResumen.citaPendiente = item[FORMAT.citaPendiente]?.toUpperCase().trim() === 'SI' || item[FORMAT.citaPendiente]?.toUpperCase().trim() === 'SÍ'
                    if (!embarqueResumen.citaPendiente) {
                        embarqueResumen.fechaCita = moment(item[FORMAT.fechaCita]).format('YYYY-MM-DD')
                        embarqueResumen.horaCitaMinima = moment(item[FORMAT.horaMinimaCita]).format('HH:mm')
                        embarqueResumen.horaCitaMaxima = moment(item[FORMAT.horaMaximaCita]).format('HH:mm')
                    }
                }
                embarqueResumen.paquetes = arrayPaquetes.filter(itemPaquete => parseInt(itemPaquete.numeroEmbarque) === parseInt(embarqueResumen.numeroEmbarque))
                embarqueResumen.complementosSAT = arrayComplementos.filter(itemPaquete => parseInt(itemPaquete.numeroEmbarque) === parseInt(embarqueResumen.numeroEmbarque))
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

const arrayUniqueByKey = (array, key) => {
    return [...new Map(array.map(item =>
        [item[key], item])).values()]
}

export function readExcelPlantillaLineal(FORMAT,file, esRecoleccion){
    const promise = new Promise((resolve, reject) => {
        const fileReader = new FileReader();
        fileReader.readAsArrayBuffer(file);

        fileReader.onload = (e) => {
            const bufferArray = e.target.result;
            const wb = XLSX.read(bufferArray, { type: "buffer",cellDates: true });

            //SE OBTIENEN LAS HOJAS DEL EXCEL
            const wsGuias = (wb.Sheets[FORMAT.hojaEmbarques]);
            if(wsGuias == undefined){
                resolve([]);
                showSuccess("No se encontró la hoja " + FORMAT.hojaEmbarques
                    +  ", el nombre de la hoja en el documento debe ser igual al configurado")
                return;
            }

            //SE FILTRAN PARA SOLO OBTENER LAS QUE TIENEN NUMERO DE EMBARQUE AGREGADO
            const data = XLSX.utils.sheet_to_json(wsGuias, {range:0}).filter(item => item[FORMAT.numeroEmbarque] > 0);
            const embarquesUnicos = arrayUniqueByKey(data,FORMAT.numeroEmbarque)

            //VALIDACIONES DE GUIAS
            const newArray = embarquesUnicos.map(function(item,index){
                let embarqueResumen = {
                    esRecoleccion: esRecoleccion,
                    fechaRegistro:getCurrentDate(),
                    horaRegistro:getCurrentTime(),
                    numeroEmbarque : item[FORMAT.numeroEmbarque],
                    idUsuario: localStorage.getItem("UsuarioId"),
                    valorDeclarado: item[FORMAT.valorDeclarado],
                    responsablePago: item[FORMAT.responsablePago],
                    observaciones: item[FORMAT.observacionesEmbarque],
                    numeroRemitente: item[FORMAT.numeroRemitente],
                    numeroDestinatario: item[FORMAT.numeroDestinatario],
                    entregaEnSucursal: item[FORMAT.entregaEnSucursal]?.toUpperCase().trim() === 'SI' || item[FORMAT.entregaEnSucursal]?.toUpperCase().trim() === 'SÍ',
                    entregaDiferenteDomicilio: item[FORMAT.entregaDiferenteDomicilio]?.toUpperCase().trim() === 'SI' || item[FORMAT.entregaDiferenteDomicilio]?.toUpperCase().trim() === 'SÍ',
                    conCita: item[FORMAT.conCita]?.toUpperCase().trim() === 'SI' || item[FORMAT.conCita]?.toUpperCase().trim() === 'SÍ',
                    referencia: item[FORMAT.referencia],
                }
                if (embarqueResumen.entregaEnSucursal){
                    embarqueResumen.sucursalEntrega = item[FORMAT.sucursalEntrega]
                }else{
                    if (embarqueResumen.entregaDiferenteDomicilio) {
                        embarqueResumen.codigoPostalDiferenteDomicilio = item[FORMAT.codigoPostalDiferenteDomicilio]
                        embarqueResumen.coloniaDiferenteDomicilio = item[FORMAT.coloniaDiferenteDomicilio]
                        embarqueResumen.calleNumeroDiferenteDomicilio = item[FORMAT.calleNumeroDiferenteDomicilio]
                        embarqueResumen.entregarEn = item[FORMAT.entregarEn]
                        embarqueResumen.datosAdicionalesEntrega = item[FORMAT.datosAdicionales]
                    }
                }
                if (embarqueResumen.esRecoleccion){
                    embarqueResumen.recoleccionDiferenteDomicilio = item[FORMAT.recoleccionDiferenteDomicilio]?.toUpperCase().trim() === 'SI' || item[FORMAT.recoleccionDiferenteDomicilio]?.toUpperCase().trim() === 'SÍ'
                    if (embarqueResumen.recoleccionDiferenteDomicilio){
                        embarqueResumen.codigoPostalDiferenteDomicilioRecoleccion = item[FORMAT.codigoPostalDiferenteDomicilioRecoleccion]
                        embarqueResumen.coloniaDiferenteDomicilioRecoleccion = item[FORMAT.coloniaDiferenteDomicilioRecoleccion]
                        embarqueResumen.calleNumeroDiferenteDomicilioRecoleccion = item[FORMAT.calleNumeroDiferenteDomicilioRecoleccion]
                        embarqueResumen.recogerEn = item[FORMAT.recogerEn]
                        embarqueResumen.datosAdicionalesRecoleccion = item[FORMAT.datosAdicionalesRecoleccion]
                    }
                }
                if (embarqueResumen.conCita){
                    embarqueResumen.citaPendiente = item[FORMAT.citaPendiente]?.toUpperCase().trim() === 'SI' || item[FORMAT.citaPendiente]?.toUpperCase().trim() === 'SÍ'
                    if (!embarqueResumen.citaPendiente) {
                        embarqueResumen.fechaCita = moment(item[FORMAT.fechaCita]).format('YYYY-MM-DD')
                        embarqueResumen.horaCitaMinima = moment(item[FORMAT.horaMinimaCita]).format('HH:mm')
                        embarqueResumen.horaCitaMaxima = moment(item[FORMAT.horaMaximaCita]).format('HH:mm')
                    }
                }
                embarqueResumen.paquetes = data.filter(itemPaquete => parseInt(itemPaquete[FORMAT.numeroEmbarque]) === parseInt(embarqueResumen.numeroEmbarque)).map(p => ({
                    numeroEmbarque: p[FORMAT.numeroEmbarque],
                    numeroProducto: p[FORMAT.paquetes.numeroProducto],
                    cantidad: p[FORMAT.paquetes.cantidadPaquete],
                    observaciones: p[FORMAT.paquetes.observacionesPaquete] || ""
                }))
                embarqueResumen.complementosSAT = data.filter(itemPaquete => parseInt(itemPaquete[FORMAT.numeroEmbarque]) === parseInt(embarqueResumen.numeroEmbarque)).map((c) => ({
                    numeroEmbarque: c[FORMAT.numeroEmbarque],
                    cantidad: c[FORMAT.complementosSat.cantidadComplemento],
                    claveProductoServicio: c[FORMAT.complementosSat.claveProductoServicio],
                    claveUnidadMedida: c[FORMAT.complementosSat.claveUnidadMedida],
                    numeroProducto: c[FORMAT.paquetes.numeroProducto],
                }))
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
    // idMoneda: 'IdMoneda',
    // idTipoCambio: 'IdTipoCambio',
    // idTipoCobro: 'IdTipoCobro',
    moneda: 'Moneda',
    tipoCambio: 'Tipo de cambio',
    tipoCobro: 'Tipo de cobro',
    // idCliente: 'IdCliente',
    // idTipoSeguro: 'IdTipoSeguro',
    tipoSeguro: 'Tipo de seguro',
    porcentajeSeguro: 'Porcentaje de Seguro',
    valorDeclarado: 'Valor declarado',
    validarTimbradoFactura: 'Validar timbrado factura',
    observaciones: 'Observaciones',
    // idTipoServicio: 'IdTipoServicio',
    tipoServicio: 'Tipo de servicio',
    // idRemitente: 'IdRemitente',
    numeroRemitente: 'No. Remitente',
    correoRemitente: 'Correo remitente',
    telefonoRemitente: 'Telefono remitente',
    contactoRemitente: 'Contacto remitente',
    // idDestinatario: 'IdDestinatario',
    numeroDestinatario: 'No. Destinatario',
    correoDestinatario: 'Correo destinatario',
    telefonoDestinatario: 'Telefono destinatario',
    contactoDestinatario: 'Contacto destinatario',
    entregaEnSucursal: 'Entrega en sucursal',
    // idSucursalEntrega: 'IdSucursalEntrega',
    sucursalEntrega: 'Sucursal de entrega',
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
    horaCitaMinima: 'Hora mínima',
    horaCitaMaxima: 'Hora máxima',
    paquetes:{
        numeroEmbarque: 'Número de embarque',
        cantidad: 'Cantidad',
        // idProducto: 'IdProducto',
        numeroProducto: 'Número de producto',
        descripcion: 'Descripcion',
        // idEmbalaje: 'IdEmbalaje',
        embalaje: 'Embalaje',
        largo: 'Largo',
        alto: 'Alto',
        ancho: 'Ancho',
        peso: 'Peso',
        observaciones: 'Observaciones'
    },
    complementosSat:{
        numeroEmbarque: 'Número de embarque',
        cantidad: 'Cantidad',
        peso: 'Peso',
        claveProducto: 'Clave producto o servicio',
        claveUnidadMedida: 'Clave unidad medida',
        esMaterialPeligroso: 'Es material peligroso',
        claveMaterialPeligroso: 'Clave material peligroso',
        claveEmbalaje: 'Clave embalaje',
        descripcionEmbalaje: 'Descripcion embalaje',
        claveFraccionArancelaria: 'Clave fracción arancelaria',
    }
}

export function numberToMoneyFormatt(number) {
    return number.toLocaleString('es-MX', { style: 'currency', currency: 'MXN' })
}