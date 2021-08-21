import React, {Component} from 'react';
import PropTypes from 'prop-types';
import Marker from "react-leaflet-enhanced-marker";
import {Polyline} from "react-leaflet";
import {calcularRuta} from "../../Util/Contexts/UltimaMillaContext";
import {ReactComponent as UnidadesIcon} from "../../iconos/Catalogos/Icono Unidades/icono_unidades.svg";

class TourUltimaMilla extends Component {
    constructor(props) {
        super(props);
        this.state = {
            polygon: [],
        }
        this.getRoute = this.getRoute.bind(this)
    }

    componentWillMount() {
        this.getRoute()
    }

    componentDidMount() {

    }

    componentWillUnmount() {

    }

    getRoute() {

        var polygon = []
        var guias = this.props.data.m_arrClsProGuia.sort((a, b) => a.m_nUltimaMillaOrden - b.m_nUltimaMillaOrden)

        var result = guias.map(g => (
            {
                idGuia: g.m_nIdGuia,
                folio: g.m_nFolioGuia,
                IdSucursal: g.IdSucursal,
                m_nIdCiudadDestino: g.m_nIdCiudadDestino,
                m_nCiudadRemitente: g.m_nCiudadRemitente,
                paquetes: g.m_nNoPaquetes,
                lat: parseFloat(g.m_sLatitud),
                lng: parseFloat(g.m_sLongitud),
                embarqueId: g.m_nIdEmbarque,
                arrayPaquetes: g.m_arrClsDetalle
            }
        ))
        if (result.length !== 1) {
            if (this.props.data.m_xlat !== 0 && this.props.data.m_xlng !== 0 ) {
                calcularRuta(result, {lat:this.props.data.m_xlat, lng:this.props.data.m_xlng}).then((result) => {
                    result.polyline.plain.polyline.map(c => {
                        polygon.push([c.y, c.x])
                    })
                    this.setState({polygon: polygon})
                })
            }else {
                calcularRuta(result, this.props.sucursal).then((result) => {
                    result.polyline.plain.polyline.map(c => {
                        polygon.push([c.y, c.x])
                    })
                    this.setState({polygon: polygon})
                })
            }

        }

    }


    render() {
        const blackOptions = {color: this.props.data.color}
        return (
            <div style={{backgroundColor: "transparent"}}>
                {
                    this.props.data.m_arrClsProGuia.map((g, index) => {
                            return (
                                <Marker key={index}
                                        icon={<MarkerComponent color={g.color} index={g.m_nUltimaMillaOrden}/>}
                                        position={[parseFloat(g.m_sLatitud), parseFloat(g.m_sLongitud)]}>

                                </Marker>
                            )
                        }
                    )
                }

                {
                    this.props.data.m_xlat !== 0 && this.props.data.m_xlng !== 0 &&
                    <Marker key={"truckPoint"}
                            icon={<TruckMarkerComponent color={this.props.data.color}/>}
                            position={[this.props.data.m_xlat, this.props.data.m_xlng]}>
                    </Marker>
                }
                {
                    this.props.data.m_xlat === 0 && this.props.data.m_xlng === 0 &&
                    <Marker key={"sucursalPoint"}
                            icon={<MarkerComponent color={this.props.data.color} index={"s"}/>}
                            position={[this.props.sucursal.lat, this.props.sucursal.lng]}>
                    </Marker>
                }


                {
                    this.state.polygon.length !== 0 &&
                    <Polyline pathOptions={blackOptions} positions={this.state.polygon}/>

                }
            </div>
        );
    }
}

TourUltimaMilla.propTypes = {};

export default TourUltimaMilla;

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

class TruckMarkerComponent extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        const markerStyle = {
            backgroundColor: "transparent",
            display: "flex",
            justifyContent: "center",
            width: "25px",
            height: "25px",
            alignItems: "center",
        };
        return <div align={"center"} style={markerStyle}>
            <UnidadesIcon
                style={{
                    fill: this.props.color,
                    paddingTop: "5px",
                    paddingBottom: "5px",
                    width: "25px",
                    verticalAlign: "middle"
                }}/>
        </div>;
    }
}
