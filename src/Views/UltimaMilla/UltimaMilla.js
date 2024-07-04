import React, {Component, useState, useEffect} from 'react';
import PropTypes from 'prop-types';
import Cabecera from "../../Components/Template/Cabecera";
import BarraLateralIzquierda from "../../Components/Template/BarraLateralIzquierda";
import {MapContainer, Polyline, Popup, TileLayer, Marker} from "react-leaflet";
import {arrayGuias, arrayPonts} from "../../Util/Data";
import {
    Chip,
    IconButton,
    List,
    ListItem,
    ListSubheader,
    Dialog,
    DialogContent,
    DialogActions,
    DialogTitle,
    Button,
    MenuItem,
    DialogContentText,
} from "@mui/material";
import makeStyles from '@mui/styles/makeStyles';
import FaceIcon from "@mui/icons-material/Face";
import Tooltip from "@mui/material/Tooltip";
import FiltersMap from "./FiltersMap";
import Cronograma from "./Cronograma";
import {
    obtenerRutas,
    obtenerGuiasUbicacion,
    randomColor,
    searchLocationWeb,
    generarRuta,
    agregarRuta,
    searchLocationAddress,
    obtenerUltimaMillaFecha,
    validarUnidadesSeleccionadas,
    validarUnidadOcupada, obtenerUltimaMillaFechaImagenes
} from "../../Util/Contexts/UltimaMillaContext";
import {actualizarCoordenadasRemitentesDestinatarios} from "../../Util/Contexts/RemitenteDestinatarioContext";
import Tour from "./Tour";
import Mensajes from "./Mensajes";
import MessageIcon from "@mui/icons-material/Message";
import {ReactComponent as FullscreenIcono} from "../../iconos/Mapa/fullscreen.svg";
import {ReactComponent as FullscreenExitIcono} from "../../iconos/Mapa/fullscreen-exit.svg";
import DetalleParadas from "./DetalleParadas";
import Noty from "noty";
import 'react-confirm-alert/src/react-confirm-alert.css';
import TourUltimaMilla from "./TourUltimaMilla";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import Select from "@mui/material/Select";
import Buttons from "../../Util/CarruselButtons";
import L from "leaflet";
import MarkerImage from "../../iconos/Mapa/sucursalMarcador.png";
import {forEach} from "react-bootstrap/ElementChildren";
import {getAddressFormated, getCurrentDate} from "../../Util/Util";
import moment from "moment";
import {obtenerOperadoresPorSucursal} from "../../Util/Contexts/OperadoresContext";
import {cambiarOperadorUnidad} from "../../Util/Contexts/UnidadesContext"; // Import css
import {reasignarOperador} from "../../Util/Contexts/OperadoresContext";
import {obtenerParametrosConfiguracion} from "../../Util/Contexts/ParametrosConfiguracionContext";
import ConfirmarUbicacion from "../../Components/Map/ConfirmarUbicacion";
import ListaUbicaciones from "./ListaUbicaciones"; // Import css


function showSuccess(mensaje) {
    new Noty({
        type: "information",
        layout: "topCenter",
        text: mensaje,
        timeout: "3000"
    }).show()
}
function showGuiaSinCoordenadas(mensaje) {
    new Noty({
        type: "information",
        layout: "topCenter",
        text: mensaje,
        timeout: "10000"
    }).show()
}
const MarkerIcon = new L.Icon({
    iconUrl: MarkerImage,
    iconRetinaUrl: MarkerImage,
    iconAnchor: null,
    popupAnchor: null,
    shadowUrl: null,
    shadowSize: null,
    shadowAnchor: null,
    iconSize: new L.Point(20, 20),
});

var actualizar = true


class UltimaMilla extends Component {
    constructor(props) {
        super(props);
        this.state = {
            map: null,
            height: window.innerHeight,
            openCronograma: false,
            data: {},
            tour: null,
            lat: 32.6464858,
            lng: -115.4552451,
            fullScreen: false,
            chatFullscreen: true,
            cronogramaFullscreen: true,
            resumenFullscreen: true,
            filtros: {},
            modoEdicion: true,
            modoPlaneacion: false,
            ultimaMilla: null,
            openDialog: false,
            closeFiltersMapDialogs: false,
            closeResumenParadas:false,
            openDialogGenerarRutaError: false,
            operadorSeleccionado: null,
            listadoOperadores:[],
            idOperador:0,
            operadores: [],
            unidad: null,
            showConfirmarUbicacion: false,
            showListaUbicaciones: false,
            paquetesSinCoord: [],
            titulo: "",
            entregaEnSucursal: false,
        }
        this.generarRuta = this.generarRuta.bind(this)
        this.getLocation = this.getLocation.bind(this)
        this.showPosition = this.showPosition.bind(this)
        this.changeMapLocation = this.changeMapLocation.bind(this)
        this.guardarRuta = this.guardarRuta.bind(this)
        this.searchLocation = this.searchLocation.bind(this)
        this.openFullscreen = this.openFullscreen.bind(this)
        this.closeFullscreen = this.closeFullscreen.bind(this)
        this.changeConfiguration = this.changeConfiguration.bind(this)
        this.getFechaUltimaMilla = this.getFechaUltimaMilla.bind(this)
        this.selectGuiaReasignar = this.selectGuiaReasignar.bind(this)
        this.reasignarParada = this.reasignarParada.bind(this)
        this.refreshUltimaMilla = this.refreshUltimaMilla.bind(this)
        this.refreshFilterUltimaMilla = this.refreshFilterUltimaMilla.bind(this)
        this.changeFiltersMapDialogsState = this.changeFiltersMapDialogsState.bind(this)
        this.closeResumenParada = this.closeResumenParada.bind(this)
        this.mostrarDialogoListado = this.mostrarDialogoListado.bind(this)
        this.cerrarListadoUbicaciones = this.cerrarListadoUbicaciones.bind(this)
        this.handleAceptar = this.handleAceptar.bind(this)
    }

    mostrarDialogoListado = (isVisible) => {
        this.setState({showListaUbicaciones: isVisible});
    }

    cerrarListadoUbicaciones (){
        this.mostrarDialogoListado(false)
    }

    async handleAceptar (e, paquetes) {
        e.preventDefault();
        var filtrosTemp = this.state.filtros;
        filtrosTemp.paquetesSeleccionadas = paquetes;
        this.mostrarDialogoListado(false);
        //this.generarRuta(filtrosTemp);
    }
    componentDidMount() {
    }

    componentWillUnmount() {
        clearInterval(this.interval);
    }

    getLocation() {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(this.showPosition);
        }
    }

    getFechaUltimaMilla(date, idSucursal, zonas, tipoBusqueda) {
        this.setState({mostrarRuta: false})

        obtenerUltimaMillaFecha(date, idSucursal, zonas).then(({data}) => {
            //Metes imagenes
            for (let parada of data.m_arrClsParadaUltimaMilla) {    //RECORRE LAS RUTAS
                for (let guia of parada.m_arrClsProGuia) {          //RECORRE LAS PARADAS
                    if (!guia.m_sLatitud) {
                        if (guia.m_sLatitud.length < 3) {
                            let index = parada.m_arrClsProGuia.findIndex(function (encontrar) {
                                return encontrar.m_sLatitud.length < 3
                            });
                            if (guia.m_sFolio) {
                                showGuiaSinCoordenadas("La guía " + guia.m_sFolio + " se ha ocultado de la ruta ya que no cuenta con coordenadas, comuníquese con las oficinas de GM Transport")
                            }
                            parada.m_arrClsProGuia.splice(index, 1)
                        }
                    }
                }
            }
          const filtered=data
            /*obtenerUltimaMillaFechaImagenes(date, idSucursal, zonas).then((respuesta) => {
                //imagenes
                let rutaConImagenes
                let guiaConImagenes
                filtered.m_arrClsParadaUltimaMilla.forEach(rutaSinImagenes => {
                    
                    rutaConImagenes = respuesta.data.m_arrClsParadaUltimaMilla.find(r => r.m_nIdParadaUltimaMilla === rutaSinImagenes.m_nIdParadaUltimaMilla)
                    rutaSinImagenes.m_arrClsProGuia.forEach(guiaSinImagenes => {
                        guiaConImagenes = rutaConImagenes.m_arrClsProGuia.find(g => g.m_nId === guiaSinImagenes.m_nId && g.m_bEsRecoleccion === guiaSinImagenes.m_bEsRecoleccion)
                        guiaSinImagenes.m_arrImagenes = guiaConImagenes.m_arrImagenes
                    })
                })

            })*/
            if (filtered.m_nIdUltimaMilla !== 0) {
                if (actualizar && !this.state.modoPlaneacion) {
                    this.interval = setInterval(() => this.getFechaUltimaMilla(date, idSucursal, zonas, tipoBusqueda), 150000);
                }
                if (!this.state.ultimaMilla) {
                    filtered.m_arrClsParadaUltimaMilla.forEach(t => t.color = randomColor(10))
                } else {
                    if (filtered.m_nIdUltimaMilla === this.state.ultimaMilla.m_nIdUltimaMilla) {
                        filtered.m_arrClsParadaUltimaMilla.forEach(t => t.color = this.state.ultimaMilla.m_arrClsParadaUltimaMilla.find(u => u.m_nIdParadaUltimaMilla === t.m_nIdParadaUltimaMilla) ? this.state.ultimaMilla.m_arrClsParadaUltimaMilla.find(u => u.m_nIdParadaUltimaMilla === t.m_nIdParadaUltimaMilla).color : randomColor(10))
                    } else {
                        filtered.m_arrClsParadaUltimaMilla.forEach(t => t.color = randomColor(10))
                    }
                }
                this.setState({
                    mostrarRuta: true,
                    modoEdicion: false,
                    ultimaMilla: filtered,
                    idSucursal: idSucursal,
                    fechaUltimaMilla: date,
                    zonasIds: zonas,
                    tipoBusqueda: tipoBusqueda
                })
                actualizar = false
            } else {
                actualizar = false
                this.setState({modoEdicion: true, ultimaMilla: null})
                clearInterval(this.interval);
            }
        })
    }

    showPosition(position) {
        this.setState({lat: position.coords.latitude, lng: position.coords.longitude})
    }

    async changeMapLocation(location) {
        searchLocationWeb(location.m_sMunicipio, location.m_sCalle, location.m_sColonia, location.m_sNoExterior, location.m_sCodigoPostal).then((data) => {
            if (data) {
                this.setState({lat: data.y, lng: data.x})
                this.state.map.setView([data.y, data.x], 14)
            }
        })

    }

    refreshFilterUltimaMilla(date, idSucursal, zonas, tipoBusqueda) {
        actualizar = true
        if (this.interval) {
            clearInterval(this.interval);
        }
        this.getFechaUltimaMilla(date, idSucursal, zonas, tipoBusqueda)
    }

    refreshUltimaMilla() {
        this.setState({ultimaMilla: null})
        this.getFechaUltimaMilla(this.state.fechaUltimaMilla, this.state.idSucursal, this.state.zonasIds, this.state.tipoBusqueda)
    }

    changeConfiguration(name, value) {
        this.setState({[name]: value})
    }

    guardarRuta() {
        var hora = new Date().getHours() + ":" + new Date().getMinutes()
        if (this.state.ultimaMilla) {
            if (this.state.tour) { 
                // console.log("unidades"+Object.values(this.state.tour.unidades.map(unidades => unidades.m_nIdUnidad)))

             /*   validarUnidadesSeleccionadas(Object.values(this.state.tour.unidades.map(unidades => unidades.m_nIdUnidad))).then(respuesta=>{
                    if(respuesta.data.sePuedeSeleccionar){
                        showSuccess("se puede seleccionar")
                    }else{
                        showSuccess("No se puede seleccionar la unidad")
                    }
                })*/
                agregarRuta(this.state.ultimaMilla.m_nIdUltimaMilla, this.state.tour, this.state.filtros,hora).then((data) => {
                    showSuccess("Se guardo la información con éxito")
                    actualizar = true
                    this.setState({tour: null})
                    this.getFechaUltimaMilla(this.state.filtros.fecha, this.state.filtros.sucursalSeleccionada.m_nIdSucursal, this.state.filtros.zonasSeleccionada.map(z => z.m_nIdZona), parseInt(this.state.filtros.tipoBusqueda))
                })
            }
        } else {
            if (this.state.tour) {
                  agregarRuta(0, this.state.tour, this.state.filtros,hora).then((data) => {
                    showSuccess("Se guardo la información con éxito")
                    actualizar = true
                    this.setState({tour: null})
                    this.getFechaUltimaMilla(this.state.filtros.fecha, this.state.filtros.sucursalSeleccionada.m_nIdSucursal, this.state.filtros.zonasSeleccionada.map(z => z.m_nIdZona), parseInt(this.state.filtros.tipoBusqueda))
                })
            }
        }
    }

    async searchLocation(address) {
        let location = await searchLocationAddress(address)
        this.state.map.setView([location.y, location.x], 14)
    }

    async generarRuta(data) {
        this.setState({tour: null})
        console.log(this.state);
        if (data.paquetesSeleccionadas.length !== 0 && data.unidadesSeleccionadas.length !== 0) {
            let unidades = data.unidadesSeleccionadas
            let unidadYaAsignada = false
            let varible
            if(this.state.ultimaMilla) {
                unidades.forEach(u => {
                    varible = this.state.ultimaMilla.m_arrClsParadaUltimaMilla.find(p => p.m_nIdUnidad === u.m_nIdUnidad && !this.ultimaMillaCompletada(p) && p.m_bActiva)
                  //  console.log("variable"+JSON.stringify(varible))
                //    console.log("ultimaMilla.m_arrClsParadaUltimaMilla"+JSON.stringify(this.state.ultimaMilla.m_arrClsParadaUltimaMilla.find(p => p.m_nIdUnidad === u.m_nIdUnidad && !this.ultimaMillaCompletada(p) && !p.m_bActiva )))
                    if (varible) {
                        unidadYaAsignada = true
                    }
                })
            }
            if (unidadYaAsignada){
                showSuccess("Una de las unidades seleccionadas ya se encuentra asignada y ocupada. Seleccione otra.")
            }else{
                let paqSinLoc = [];
                let guiasSinLoc = [];
                let guias = await obtenerGuiasUbicacion(data.paquetesSeleccionadas);
                data.paquetesSeleccionadas.forEach((paquete) => {
                    if(paquete.m_sLatitud === "0" || paquete.m_sLongitud === "0" || paquete.m_sLatitud === "" || paquete.m_sLongitud === ""){
                        paquete.actualizado = false;
                        paqSinLoc.push(paquete);
                    }
                })
                guias.forEach((guia) => {
                    //console.log(guia)
                    if(guia.m_sLatitud === "0" || guia.m_sLongitud === "0"){
                        guiasSinLoc.push(guia);
                    }
                })
                console.log(paqSinLoc);
                if(paqSinLoc.length > 0){
                    this.setState({
                        showListaUbicaciones: true,
                        paquetesSinCoord: paqSinLoc,
                        filtros: data
                    })
                    this.mostrarDialogoListado(true);
                    return
                }

                await obtenerParametrosConfiguracion().then((respuesta) => {
                    data.finishDate = moment(new Date()).add(respuesta.data.HorasLimiteEntregasUltimaMilla, 'hours').format('YYYY-MM-DDTHH:mm')
                })
                obtenerRutas(data.unidadesSeleccionadas, guias, data).then((results) => {
                    console.log('results', results)
                    if (results) {
                        if (results.unassigned?.length > 0){
                            results.unassigned?.forEach(i => {
                                let index = i.jobId.substring(4);
                                if (i.reasons[0]?.code === 'TIME_WINDOW_CONSTRAINT'){
                                    i.reasons[0].descripcion = `El registro ${guias[index].m_sFolio} no puede ser agregado a la ruta porque no alcanzaría a ser completado en límite de horas configurado.`
                                }else if (i.reasons[0]?.code === 'REACHABLE_CONSTRAINT'){
                                    this.setState({showListaUbicaciones: true, paquetesSinCoord: paqSinLoc})
                                    this.mostrarDialogoMapa(true);
                                    //i.reasons[0].descripcion = `El registro con folio ${guias[index].m_sFolio} no cuenta con coordenadas.`

                                }else{
                                    i.reasons[0].descripcion = `No se pudo agregar a la ruta el registro ${guias[index].m_sFolio}.`
                                }
                            })
                            this.setState({openDialogGenerarRutaError: true})
                        }else{
                            results.tours.map(t => t.color = randomColor(10))
                        }
                        this.setState({tour: {tour: results, paquetes: guias, unidades: unidades}, filtros: data})
                    }
                }).catch((err) => {
                    showSuccess("Hubo un error al generar la ruta. Intente más tarde.")
                })
            }

        }
    }

    ultimaMillaCompletada(ultimaMilla){
        return !ultimaMilla.m_arrClsProGuia.find(i => i.m_nEstatusUlimaMilla !== 3 && i.m_nEstatusUlimaMilla !== 4)
    }

    openFullscreen() {
        var elem = document.getElementById("mapFullScreen");
        if (elem.requestFullscreen) {
            elem.requestFullscreen();
        } else if (elem.webkitRequestFullscreen) { /* Safari */
            elem.webkitRequestFullscreen();
        } else if (elem.msRequestFullscreen) { /* IE11 */
            elem.msRequestFullscreen();
        }
        this.setState({fullScreen: true})
    }

    closeFullscreen() {
        if (document.exitFullscreen) {
            document.exitFullscreen();
        } else if (document.webkitExitFullscreen) { /* Safari */
            document.webkitExitFullscreen();
        } else if (document.msExitFullscreen) { /* IE11 */
            document.msExitFullscreen();
        }
        this.setState({fullScreen: false})
    }

    selectGuiaReasignar(idParadaFuente, idGuia) {
        obtenerOperadoresPorSucursal(this.state.idSucursal).then(({data}) => {
            const operadoresDisponibles = data.filter(operador => operador.ocupado === false)
            if(operadoresDisponibles.length < 1){
                showSuccess("Todos los operadores se encuentran en ruta.")
            }
            this.setState({
                operadores: data,
                unidad: idGuia
            })
        })
        this.setState({openDialog: true, paradaFuente: idParadaFuente, idGuia: idGuia})
    }

    reasignarParada(event) {
        event.preventDefault();
        reasignarOperador(this.state.paradaFuente, this.state.idOperador).then((data) => {
            showSuccess(data.data)
            this.setState({openDialog: false, paradaFuente: 0, idGuia: 0})
            this.getFechaUltimaMilla(this.state.fechaUltimaMilla, this.state.idSucursal, this.state.zonasIds, this.state.tipoBusqueda)
        })
        // reasignarGuia(this.state.unidadSeleccionada, this.state.paradaFuente, this.state.idGuia).then((data) => {
        //     showSuccess(data.data)
        //     this.setState({openDialog: false, paradaFuente: 0, idGuia: 0})
        //     this.getFechaUltimaMilla(this.state.fechaUltimaMilla, this.state.idSucursal, this.state.zonasIds, this.state.tipoBusqueda)
        // })
    }

    changeFiltersMapDialogsState(isVisible){
        this.setState({
            closeFiltersMapDialogs:isVisible
        })
    }

    closeResumenParada(isVisible){
        // console.log("linea is visible"+isVisible)
        this.setState({
            closeResumenParadas:isVisible
        })
    }

    render() {
        /*let obtenerDatosDireccion = (esRecoleccion) => {
            let esDiferenteDomicilio = true; //state.diferenteEntrega
            if (!esRecoleccion) {
                if (esDiferenteDomicilio) {
                    return {
                        nombreLugar: this.state.destinatario.nombreDestinatario,
                        numeroInterior: '',
                        numeroExterior: '',
                        calle: this.state.entregaDD.domicilio,
                        colonia: '',
                        ciudad: this.state.entregaDD.municipio,
                        estado: this.state.entregaDD.estado,
                        pais: this.state.entregaDD.pais,
                        codigoPostal: this.state.entregaDD.codigoPostal?.m_sCP,
                        direccionCompleta: getAddressFormated(
                            this.state.entregaDD.domicilio,
                            null,
                            null,
                            null,
                            this.state.entregaDD.codigoPostal?.m_sCP,
                            this.state.entregaDD.municipio,
                            this.state.entregaDD.estado,
                            this.state.entregaDD.pais
                        )
                    }
                }
                /!*else {
                    return {
                        nombreLugar: destinatario.nombreDestinatario,
                        numeroInterior: destinatario.numeroIntDestinatario,
                        numeroExterior: destinatario.numeroExtDestinatario,
                        calle: destinatario.calleDestinatario,
                        colonia: destinatario.coloniaDestinatario,
                        ciudad: destinatario.municipioTexto,
                        estado: destinatario.estadoTexto,
                        pais: destinatario.paisTexto,
                        codigoPostal: destinatario.codigoPostalDestinatario?.m_sCP,
                        direccionCompleta: getAddressFormated(
                            destinatario.calleDestinatario,
                            destinatario.numeroExtDestinatario,
                            destinatario.numeroIntDestinatario,
                            destinatario.coloniaDestinatario,
                            destinatario.codigoPostalDestinatario?.m_sCP,
                            destinatario.municipioTexto,
                            destinatario.estadoTexto,
                            destinatario.paisTexto
                        )
                    }
                }*!/
            }
        }*/

        return (
            <div>
                {
                    this.state.openDialog &&
                    <Dialog fullWidth
                            maxWidth={"sm"} open={this.state.openDialog} onClose={() => this.setState({openDialog: false})}>
                        <DialogTitle>Reasignar Paquete</DialogTitle>

                        <DialogContent>
                            <form onSubmit={this.reasignarParada}>
                                <label className="input select" style={{width: "100%"}}>
                                    <FormControl fullWidth variant="outlined" size="small" sx={{ marginTop: 1 }}>
                                        <InputLabel id="sucursalListadoLabel">Operador</InputLabel>
                                        <Select
                                            labelId="sucursalListadoLabel"
                                            label="Operador"
                                            className="form-control"
                                            required
                                            fullWidth
                                            value={this.state.operadorSeleccionado}
                                            onChange={(event) => {
                                                if(event.target.value.ocupado){
                                                    showSuccess("Este operador ya se encuentra en ruta.")
                                                    return
                                                }
                                                this.setState({
                                                    operadorSeleccionado: event.target.value
                                                })
                                            }
                                        }
                                            id="formatoSeleccionado"
                                            name="formatoSeleccionado"
                                        >
                                            {this.state.operadores.map((operador) => (
                                                <MenuItem
                                                    key={operador.m_nIdOperador}
                                                    value={operador}
                                                >
                                                    {`${operador.m_sNombreCompleto} ${operador.ocupado ? "- En ruta" : ""}`}
                                                </MenuItem>
                                            ))}
                                        </Select>
                                    </FormControl>
                                    <i></i>
                                </label>
                                <DialogActions>
                                    <Button onClick={() => this.setState({openDialog: false})}>
                                        Cancelar
                                    </Button>
                                    <Button color={"primary"} type={"submit"}>
                                        Aceptar
                                    </Button>
                                </DialogActions>
                            </form>
                        </DialogContent>
                    </Dialog>
                }
                <DialogGenerarRutaError
                    selectedValue={this.state.tour?.tour?.unassigned || null}
                    open={this.state.openDialogGenerarRutaError}
                    onClose={() => this.setState({openDialogGenerarRutaError: false})} />
                {
                    !this.state.fullScreen &&
                    <header className="topbar clearfix">
                        <Cabecera titulo="Última Milla">
                        </Cabecera>
                    </header>
                }
                {/*{
                    this.state.showConfirmarUbicacion &&
                    <ConfirmarUbicacion confirmarUbicacion={this.confirmarUbicacion}
                                        open={this.state.showConfirmarUbicacion}
                                        titulo={this.state.titulo}
                                        remitente={false}
                                        mostrarDialogoMapa={this.mostrarDialogoMapa}
                                        direccion={this.state.obtenerDatosDireccion}
                                        onClose={() => this.state({showConfirmarUbicacion: false})}
                    />
                }*/}
                {
                    this.state.showListaUbicaciones &&
                    <ListaUbicaciones
                                        open={this.state.showListaUbicaciones}
                                        paquetes={this.state.paquetesSinCoord}
                                        onClose={this.cerrarListadoUbicaciones}
                                        handleAceptar={this.handleAceptar}
                                        cerrarListadoUbicaciones={this.cerrarListadoUbicaciones}
                    />
                }
                <section>
                    <div className="widget-content" id={"mapFullScreen"}>
                        <div className="row"
                             style={{height: this.state.fullScreen ? "100%" : window.innerHeight - 60, width: '100%'}}>
                            <MapContainer style={{width: "100%", height: "100%", zIndex: 1}}
                                          center={[this.state.lat, this.state.lng]} zoom={15} scrollWheelZoom={false}
                                          whenCreated={(map) => this.setState({map: map})}>
                                <TileLayer style={{width: "100%", height: "100%"}}
                                           url="https://maps.hereapi.com/v3/base/mc/{z}/{x}/{y}/png8?style=logistics.day&apiKey={token}"
                                           token={process.env.REACT_APP_HERE_API_TOEKN}
                                />
                                {
                                    !this.state.fullScreen &&
                                    <FiltersMap refreshFilterUltimaMilla={this.refreshFilterUltimaMilla}
                                                closeResumenParada={this.closeResumenParada}
                                                closeFiltersMapDialogs={this.state.closeFiltersMapDialogs}
                                                changeConfiguration={this.changeConfiguration}
                                                searchLocation={this.searchLocation} generarRuta={this.generarRuta}
                                                guardarRuta={this.guardarRuta}
                                                cambiarModo={(value) => this.setState({modoPlaneacion: value})}
                                                guardarFiltros={(data) => this.setState({filtros: data})}
                                                changeMapLocation={this.changeMapLocation} data={this.state}/>
                                }

                                {
                                    this.state.tour && this.state.tour.tour.tours.map(t =>
                                        <Tour tourReport={this.state.tour.tour} tour={t} data={this.state}
                                              paquetes={this.state.tour.paquetes}/>
                                    )
                                }
                                {
                                    this.state.tour &&
                                    <Marker key={"sucursal"} icon={MarkerIcon}
                                            position={[this.state.lat, this.state.lng]}></Marker>
                                }
                                {
                                    this.state.ultimaMilla && this.state.mostrarRuta && this.state.ultimaMilla.m_arrClsParadaUltimaMilla.map(t =>
                                        <TourUltimaMilla data={t} sucursal={this.state}/>
                                    )
                                }

                                {
                                    !this.state.modoEdicion && (this.state.fullScreen === false || this.state.cronogramaFullscreen) &&
                                    <Cronograma selectGuiaReasignar={this.selectGuiaReasignar}
                                                tour={this.state.ultimaMilla} fecha={this.state.fechaUltimaMilla}/>
                                }
                                {
                                    !this.state.modoEdicion && (this.state.fullScreen === false || this.state.chatFullscreen) &&
                                    <Mensajes tour={this.state.ultimaMilla} fecha={this.state.fechaUltimaMilla}/>
                                }
                                {
                                    !this.state.modoEdicion && this.state.ultimaMilla && (this.state.fullScreen === false || this.state.resumenFullscreen) &&
                                    <DetalleParadas refresh={this.refreshUltimaMilla}
                                    closeResumenParadas={this.state.closeResumenParadas}
                                    changeFiltersMapDialogsState={this.changeFiltersMapDialogsState}
                                                    fecha={this.state.fechaUltimaMilla} filtros={{
                                        zonasSeleccionada: this.state.zonasIds,
                                        tipoBusqueda: this.state.tipoBusqueda,
                                        idSucursal: this.state.idSucursal
                                    }} tour={this.state.ultimaMilla}/>
                                }
                                {/*{*/}
                                {/*    (this.state.tour || this.state.ultimaMilla) &&*/}
                                {/*    <IconButton*/}
                                {/*        onClick={() => this.state.fullScreen ? this.closeFullscreen() : this.openFullscreen()}*/}
                                {/*        style={{*/}
                                {/*            color: "white",*/}
                                {/*            borderRadius: "10px",*/}
                                {/*            width: "30px",*/}
                                {/*            height: "30px",*/}
                                {/*            backgroundColor: "white",*/}
                                {/*            top: "110px",*/}
                                {/*            right: "10px",*/}
                                {/*            position: "fixed",*/}
                                {/*            zIndex: 3000,*/}
                                {/*            padding: "5px",*/}
                                {/*            boxShadow: "0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19)"*/}
                                {/*        }}>*/}
                                {/*        {this.state.fullScreen ? <FullscreenExitIcono style={{fill: "#F9A03E"}}/> :*/}
                                {/*            <FullscreenIcono style={{fill: "#F9A03E"}}/>}*/}
                                {/*    </IconButton>*/}
                                {/*}*/}


                            </MapContainer>
                        </div>

                    </div>


                </section>

            </div>
        );
    }
}

UltimaMilla.propTypes = {};

export default UltimaMilla;


function DialogGenerarRutaError(props) {

    const handleClose = () => {
        props.onClose();
    };

    return (
        <Dialog onClose={handleClose} aria-labelledby="simple-dialog-title" open={props.open} maxWidth={"sm"} fullWidth>
            <DialogTitle id="simple-dialog-title">Problemas encontrados al generar ruta</DialogTitle>
            <DialogContent>
                <DialogContentText id="alert-dialog-description">
                    {
                        props.selectedValue?.length > 0 &&
                        props.selectedValue.map(i => (<h6>{i.reasons[0].descripcion}</h6>))
                    }
                </DialogContentText>
            </DialogContent>
            <DialogActions>
                <Button onClick={handleClose} color="primary" autoFocus>
                    Aceptar
                </Button>
            </DialogActions>
        </Dialog>
    );
}


