import React, {Component, useEffect} from 'react';
import PropTypes from 'prop-types';
import Cabecera from "../../Components/Template/Cabecera";
import BarraLateralIzquierda from "../../Components/Template/BarraLateralIzquierda";
import {MapContainer, Polyline, Popup, TileLayer} from "react-leaflet";
import {arrayGuias, arrayPonts} from "../../Util/Data";
import {Chip, IconButton, List, ListItem, ListSubheader, makeStyles} from "@material-ui/core";
import FaceIcon from "@material-ui/icons/Face";
import Tooltip from "@material-ui/core/Tooltip";
import FiltersMap from "./FiltersMap";
import Cronograma from "./Cronograma";
import {
    obtenerRutas,
    obtenerGuiasUbicacion,
    randomColor,
    searchLocationWeb,
    generarRuta, agregarRuta, searchLocationAddress, obtenerUltimaMillaFecha
} from "../../Util/Contexts/UltimaMillaContext";
import Tour from "./Tour";
import Mensajes from "./Mensajes";
import MessageIcon from "@material-ui/icons/Message";
import {ReactComponent as FullscreenIcono} from "../../iconos/Mapa/fullscreen.svg";
import {ReactComponent as FullscreenExitIcono} from "../../iconos/Mapa/fullscreen-exit.svg";
import DetalleParadas from "./DetalleParadas";
import Noty from "noty";
import 'react-confirm-alert/src/react-confirm-alert.css';
import TourUltimaMilla from "./TourUltimaMilla"; // Import css


function showSuccess(mensaje) {
    new Noty({
        type: "information",
        layout: "topCenter",
        text: mensaje,
        timeout: "3000"
    }).show()
}
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
            ultimaMilla: null
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

    getFechaUltimaMilla(date, idSucursal, zonas) {
        clearInterval(this.interval);
        obtenerUltimaMillaFecha(date, idSucursal, zonas).then(({data}) => {
            if (data.m_nIdUltimaMilla !== 0) {
                if (actualizar) {
                    this.interval = setInterval(() => this.getFechaUltimaMilla(date, idSucursal, zonas), 10000);
                }
                if (!this.state.ultimaMilla) {
                    data.m_arrClsParadaUltimaMilla.forEach(t => t.color = randomColor(10))
                }else {
                    if (data.m_nIdUltimaMilla === this.state.ultimaMilla.m_nIdUltimaMilla) {
                        data.m_arrClsParadaUltimaMilla.forEach(t => t.color = this.state.ultimaMilla.m_arrClsParadaUltimaMilla.find(u => u.m_nIdParadaUltimaMilla === t.m_nIdParadaUltimaMilla).color)
                    }else {
                        data.m_arrClsParadaUltimaMilla.forEach(t => t.color = randomColor(10))
                    }
                }

                this.setState({modoEdicion: false, ultimaMilla: data})
                actualizar = false
            }else {
                this.setState({modoEdicion: true, ultimaMilla: null})
            }
        })
    }

    showPosition(position) {
        this.setState({lat: position.coords.latitude, lng: position.coords.longitude})
    }

    async changeMapLocation(location) {
        searchLocationWeb(location.m_sMunicipio, location.m_sCalle).then((data) => {
            this.setState({lat: data.y, lng: data.x})
            this.state.map.setView([data.y, data.x], 15)
        })

    }

    changeConfiguration(name, value) {
        this.setState({[name]: value})
    }

    guardarRuta() {
        agregarRuta(this.state.tour, this.state.filtros).then((data) => {
            showSuccess("Se guardo la información con exito")
            this.getFechaUltimaMilla(this.state.filtros.fecha, this.state.filtros.sucursalSeleccionada.m_nIdSucursal, this.state.filtros.zonasSeleccionada.map(z => z.m_nIdZona))
        })
    }

    async searchLocation(address) {
        let location = await searchLocationAddress(address)
        this.state.map.setView([location.y, location.x], 15)
    }


    async generarRuta(data) {
        this.setState({tour: null})
        if (data.paquetesSeleccionadas.length != 0) {
            var guias = await obtenerGuiasUbicacion(data.paquetesSeleccionadas)
            var unidades = data.unidadesSeleccionadas
            obtenerRutas(data.unidadesSeleccionadas, guias, data).then((results) => {
                if (results.vehicleIdsNotPlanned) {
                    if (results.vehicleIdsNotPlanned.length > 0) {
                        unidades = unidades.filter(u => results.vehicleIdsNotPlanned.find(t => t === ("vehicle" + u.m_nIdUnidad)) === undefined)
                    }
                }
                results.tours.map(t => t.color = randomColor(10))
                this.setState({tour: {tour: results, paquetes: guias, unidades: unidades}, filtros: data})

            })
        }
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

    render() {
        return (
            <div>
                {
                    !this.state.fullScreen &&
                    <header className="topbar clearfix">
                        <Cabecera titulo="Última Milla">
                        </Cabecera>
                    </header>
                }

                <section>
                    <div className="widget-content" id={"mapFullScreen"} >
                        <div className="row" style={{height:  this.state.fullScreen ? "100%" : window.innerHeight - 50, width: '100%'}}>
                            <MapContainer style={{width: "100%", height: "100%", zIndex: 1}}
                                          center={[this.state.lat, this.state.lng]} zoom={15} scrollWheelZoom={false}
                                          whenCreated={(map) => this.setState({map: map})}>
                                <TileLayer style={{width: "100%", height: "100%"}}
                                           url="https://xserver2-america-test.cloud.ptvgroup.com/services/rest/XMap/tile/{z}/{x}/{y}?userLanguage=es&amp;xtok={token}"
                                           token="51FA3E8E-8BF3-49EF-AB82-59D807A0645C"
                                />
                                {
                                    !this.state.fullScreen &&
                                    <FiltersMap  getFechaUltimaMilla={this.getFechaUltimaMilla} changeConfiguration={this.changeConfiguration} searchLocation={this.searchLocation} generarRuta={this.generarRuta}
                                                guardarRuta={this.guardarRuta}
                                                changeMapLocation={this.changeMapLocation} data={this.state}/>
                                }

                                {
                                    this.state.tour  && this.state.tour.tour.tours.map(t =>
                                        <Tour tour={t}  data={this.state} paquetes={this.state.tour.paquetes}/>
                                    )
                                }
                                {
                                    this.state.ultimaMilla && this.state.ultimaMilla.m_arrClsParadaUltimaMilla.map(t =>
                                        <TourUltimaMilla data={t} sucursal={this.state}/>
                                    )
                                }

                                {
                                    !this.state.modoEdicion  && (this.state.fullScreen === false || this.state.cronogramaFullscreen ) &&
                                    <Cronograma tour={this.state.ultimaMilla}/>
                                }
                                {
                                    !this.state.modoEdicion && (this.state.fullScreen === false || this.state.chatFullscreen ) &&
                                    <Mensajes tour={this.state.ultimaMilla}/>
                                }
                                {
                                    !this.state.modoEdicion && (this.state.fullScreen === false || this.state.resumenFullscreen ) &&
                                    <DetalleParadas tour={this.state.ultimaMilla}/>
                                }
                                <IconButton
                                    onClick={() => this.state.fullScreen ? this.closeFullscreen() : this.openFullscreen()}
                                    style={{
                                        color: "white",
                                        borderRadius: "10px",
                                        width: "30px",
                                        height: "30px",
                                        backgroundColor: "white",
                                        top: "110px",
                                        right: "10px",
                                        position: "fixed",
                                        zIndex: 3000,
                                        padding: "5px",
                                        boxShadow: "0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19)"
                                    }}>
                                    { this.state.fullScreen ? <FullscreenExitIcono style={{fill: "#F9A03E"}}/> : <FullscreenIcono style={{fill: "#F9A03E"}}/> }
                                </IconButton>


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


function TripPoint(props) {
    const [state, setState] = React.useState({polygon: []})
    const blackOptions = {color: '#65a0f4'}
    useEffect(value => {

    }, [])

    return <Polyline pathOptions={blackOptions} positions={state.polygon}/>;
}


