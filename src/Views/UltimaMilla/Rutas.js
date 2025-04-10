import React, {Component} from 'react';
import {Polyline} from "react-leaflet";
import {calcularRuta} from "../../Util/Contexts/UltimaMillaContext";

class Rutas extends Component {
    constructor(props) {
        super(props);
        this.state = {
            polygon: []
        }
        this.getRoute = this.getRoute.bind(this)
    }

    componentWillMount() {
    }

    componentDidMount() {
        this.getRoute()
    }
    componentWillUnmount() {
    }

    getRoute(){
        var polygon = []
        calcularRuta(this.props.paquetes.filter((p, index) =>  this.props.tour.trips[0].stops.map((s,i) =>   parseInt(s.tasks[0].orderId) === index) !== null )).then((result) => {
            result.polyline.plain.polyline.map(c => {
                polygon.push([c.y, c.x])
            })
            this.setState({ polygon: polygon})
        })
    }

    render() {
        const blackOptions = { color: '#d3f461' }
        return (
            <Polyline pathOptions={blackOptions} positions={this.state.polygon} />
        );
    }
}

Rutas.propTypes = {};

export default Rutas;
