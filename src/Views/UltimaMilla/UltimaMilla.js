import React, {Component, useEffect} from 'react';
import PropTypes from 'prop-types';
import Cabecera from "../../Components/Template/Cabecera";
import BarraLateralIzquierda from "../../Components/Template/BarraLateralIzquierda";
import {MapContainer, Polyline, Popup, TileLayer} from "react-leaflet";
import {arrayGuias, arrayPonts} from "../../Util/Data";
import {Chip, List, ListItem, ListSubheader, makeStyles} from "@material-ui/core";
import FaceIcon from "@material-ui/icons/Face";
import Tooltip from "@material-ui/core/Tooltip";
import FiltersMap from "./FiltersMap";
import Cronograma from "./Cronograma";
import {obtenerRutas, obtenerGuiasUbicacion, randomColor} from "../../Util/Contexts/UltimaMillaContext";
import Tour from "./Tour";


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
            lng: -115.4552451
        }
        this.generarRuta = this.generarRuta.bind(this)
        this.getLocation = this.getLocation.bind(this)
        this.showPosition = this.showPosition.bind(this)
    }

    componentWillMount() {

    }

    componentDidMount() {

    }

    componentWillUnmount() {

    }

    getLocation() {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(this.showPosition);
        }
    }

    showPosition(position) {
        this.setState({lat: position.coords.latitude, lng: position.coords.longitude})
    }


    async generarRuta(data) {
        var guias = await obtenerGuiasUbicacion(arrayGuias)
        var unidades = data.unidadesSeleccionadas
        obtenerRutas(data.unidadesSeleccionadas, guias, data).then((results) => {
            if (results.vehicleIdsNotPlanned.length > 0) {
                unidades = unidades.filter(u => results.vehicleIdsNotPlanned.find(t => t === ("vehicle" + u.m_nIdUnidad)) === undefined)
            }
            results.tours.map(t => t.color = randomColor(10))
            console.log(results.tours)
            this.setState({tour: {tour: results, paquetes: guias, unidades: unidades}, openCronograma: true,})
        })
    }

    render() {
        return (
            <div>
                <header className="topbar clearfix">
                    <Cabecera titulo="Última Milla">
                    </Cabecera>
                </header>
                <section>
                    <div className="widget-content">
                        <div className="row" style={{height: window.innerHeight, width: '100%'}}>
                            <MapContainer style={{width: "100%", height: "100%", zIndex: 1}}
                                          center={[this.state.lat, this.state.lng]} zoom={13} scrollWheelZoom={false}
                                          whenCreated={(map) => this.setState({map: map})}>
                                <TileLayer style={{width: "100%", height: "100%"}}
                                           url="https://xserver2-america-test.cloud.ptvgroup.com/services/rest/XMap/tile/{z}/{x}/{y}?userLanguage=es&amp;xtok={token}"
                                           token="51FA3E8E-8BF3-49EF-AB82-59D807A0645C"
                                />
                                <FiltersMap generarRuta={this.generarRuta}/>
                                {
                                    this.state.tour && this.state.tour.tour.tours.map(t =>
                                        <Tour tour={t} paquetes={this.state.tour.paquetes}/>
                                    )
                                }
                                {
                                    this.state.tour && this.state.openCronograma &&
                                    <Cronograma tour={this.state.tour}/>
                                }
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


