import React, {Component} from 'react';
import PropTypes from 'prop-types';
import Marker from "react-leaflet-enhanced-marker";
import {Polyline, Popup} from "react-leaflet";
import {calcularRuta} from "../../Util/Contexts/UltimaMillaContext";
import {ReactComponent as UnidadesIcon} from "../../iconos/Catalogos/Icono Unidades/icono_unidades.svg";
import L from "leaflet";
import MarkerImage from "../../iconos/Mapa/sucursalMarcador.png";
import {Grid, Typography, Dialog, DialogTitle, DialogActions, DialogContent} from "@material-ui/core";


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

        guias.forEach(g => {
            g.lat = g.m_sLatitud
            g.lng = g.m_sLongitud
        })
        if (guias.length !== 0) {
            if (this.props.data.m_xlat !== 0 && this.props.data.m_xlng !== 0 ) {
                calcularRuta(guias, {lat:this.props.data.m_xlat, lng:this.props.data.m_xlng}).then((result) => {
                    result.polyline.plain.polyline.map(c => {
                        polygon.push([c.y, c.x])
                    })
                    this.setState({polygon: polygon})
                })
            }else {
                calcularRuta(guias, this.props.sucursal).then((result) => {
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
                                        icon={<MarkerComponent color={this.props.data.color} index={g.m_nUltimaMillaOrden + 1}/>}
                                        position={[parseFloat(g.m_sLatitud), parseFloat(g.m_sLongitud)]}>
                                    <Popup>
                                        <Grid container spacing={1}>
                                            <Grid item md={12}>
                                                <Typography variant={"h2"}>{g.m_sFolio} - {g.m_bEsRecoleccion ? g.m_sEstatusRecoleccion : g.m_sEstatusEmbarque}</Typography>
                                            </Grid>

                                            <Grid item md={12}>
                                                <Typography variant={"body2"} style={{fontWeight:"bold"}}>Datos de la {g.m_bEsRecoleccion ? "Recolección" : "Entrega"}</Typography>
                                            </Grid>
                                            <Grid item md={12}>
                                                <Typography variant={"body1"} >{g.m_bEsRecoleccion ? g.m_sNombreRemitente : g.m_sNombreDestinatario}</Typography>
                                            </Grid>
                                            <Grid item md={12}>
                                                <Typography variant={"body1"} >{g.m_bEsRecoleccion ? g.m_sDomicilioRemitente : g.m_sDomicilioDestinatario}</Typography>
                                            </Grid>
                                            <Grid item md={12}>
                                                <Typography variant={"body1"} >{g.m_bEsRecoleccion ? g.m_sContactoRemitente : g.m_sContactoDestinatario}</Typography>
                                            </Grid>
                                            <Grid item md={12}>
                                                <Typography variant={"body1"} >{g.m_bEsRecoleccion ? g.m_sTelefonoRemitente : g.m_sTelefonoDestinatario}</Typography>
                                            </Grid>
                                            <Grid item md={12}>
                                                <Typography variant={"body1"} >No. Paquetes: {g.m_bEsRecoleccion ? g.m_parrPaquetes.reduce((a, b) => +a + +b.m_nCantidad, 0) : g.m_arrPaquetes.reduce((a, b) => +a + +b.m_nCantidad, 0)}</Typography>
                                            </Grid>
                                        </Grid>

                                    </Popup>
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
                        <Popup>{this.props.data.m_snNombreOperador} - {this.props.data.m_sPlacasUnidad}</Popup>
                    </Marker>
                }
                {
                    this.props.data.m_xlat === 0 && this.props.data.m_xlng === 0 &&
                    <Marker key={"truckPoint"}
                            icon={<TruckMarkerComponent color={this.props.data.color}/>}
                            position={[this.props.sucursal.lat, this.props.sucursal.lng]}>
                        <Popup>{this.props.data.m_snNombreOperador} - {this.props.data.m_sPlacasUnidad}</Popup>
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
        console.log(this.props.color)
    }

    render() {
        const markerStyle = {
            backgroundColor: this.props.color,
            color: "white",
            display: "flex",
            justifyContent: "center",
            width: "30px",
            height: "30px",
            borderRadius: "20px",
            alignItems: "center",
            borderStyle: "solid",
            borderColor: "white",
            boxShadow: "0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19)"
        };
        return <div  align={"center"} style={markerStyle}>{this.props.index}</div>;
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
