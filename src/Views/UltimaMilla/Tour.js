import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {Marker, Popup} from "react-leaflet";
import MarkerImage from '../../iconos/Mapa/marker.png';
import L from "leaflet";

const MarkerIcon = new L.Icon({
    iconUrl: MarkerImage,
    iconRetinaUrl: MarkerImage,
    iconAnchor: null,
    popupAnchor: null,
    shadowUrl: null,
    shadowSize: null,
    shadowAnchor: null,
    iconSize: new L.Point(30, 30),
});

class Tour extends Component {
    constructor(props) {
        super(props);
    }


    componentDidMount() {

    }

    componentWillUnmount() {

    }

    render() {
        return (
            <div>
                {
                    this.props.tour.tour.trips[0].stops.map((s,index) =>
                        <Marker key={index + 1} icon={MarkerIcon} draggable={false} position={[this.props.tour.paquetes[parseInt(s.tasks[0].orderId)].lat, this.props.tour.paquetes[parseInt(s.tasks[0].orderId)].lng]}>

                        </Marker>
                    )
                }
            </div>
        );
    }
}

Tour.propTypes = {};

export default Tour;
