import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {MapContainer, Polyline, Popup} from "react-leaflet";
import MarkerImage from '../../iconos/Mapa/sucursalMarcador.png';
import L from "leaflet";
import {calcularRuta, randomColor} from "../../Util/Contexts/UltimaMillaContext";
import Marker from 'react-leaflet-enhanced-marker'



class Tour extends Component {
    constructor(props) {
        super(props);
        this.state = {
            polygon: [],
        }
    }


    componentDidMount() {
        this.getRoute()

    }


    getRoute() {

        var polygon = []
        var guias = this.props.paquetes.filter((p, index) => this.props.tour.trips[0].stops.find((s, i) => parseInt(s.tasks[0].orderId) === p.idGuia) != null)

        var result = []
        this.props.tour.trips[0].stops.forEach((item, index) => {
            var found = false;
            guias = guias.filter(function (guia) {
                if (!found && guia.idGuia == parseInt(item.tasks[0].orderId)) {
                    result.push(guia);
                    found = true;
                    return false;
                } else
                    return true;
            })
        })
        if (result.length !== 0) {
            calcularRuta(result, this.props.data).then((result) => {
                result.polyline.plain.polyline.map(c => {
                    polygon.push([c.y, c.x])
                })
                this.setState({polygon: polygon})
            })
        }

    }

    render() {
        const blackOptions = {color: this.props.tour.color}
        return (
            <div style={{backgroundColor: "transparent"}}>
                {
                    this.props.tour.trips[0].stops.map((s, index) => {
                            const paquete = this.props.paquetes.find(p => parseInt(s.tasks[0].orderId) === p.idGuia)
                            console.log(paquete)
                            return (
                                <Marker key={index}
                                        icon={<MarkerComponent color={this.props.tour.color} index={index + 1}/>}
                                        position={[paquete.lat, paquete.lng]}>
                                    <Popup>
                                        {paquete.folio}
                                    </Popup>
                                </Marker>
                            )
                        }
                    )
                }


                {
                    this.state.polygon.length !== 0 &&
                    <Polyline pathOptions={blackOptions} positions={this.state.polygon}/>

                }
            </div>
        );
    }
}

Tour.propTypes = {};

export default Tour;

class MarkerComponent extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        const markerStyle = {
            backgroundColor: this.props.color,
            color: "white",
            display: "flex",
            justifyContent: "center",
            width: "20px",
            height: "20px",
            borderRadius: "20px",
            alignItems: "center",
            borderStyle: "solid",
            borderColor: "white",
            boxShadow: "0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19)"
        };
        return <div align={"center"} style={markerStyle}>{this.props.index}</div>;
    }
}

