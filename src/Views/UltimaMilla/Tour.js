import React, {Component} from 'react';
import {Polyline, Popup} from "react-leaflet";
import {calcularRuta} from "../../Util/Contexts/UltimaMillaContext";
import Marker from 'react-leaflet-enhanced-marker'
import {Grid, Typography} from "@mui/material"
import {decodePolyline} from "../../Util/HereDecoading";

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
        var guias = this.props.paquetes.filter((p, index) => this.props.tour.stops.filter(j => j.activities[0].type === "delivery" || j.activities[0].type === "pickup").find((s, i) => parseInt(s.activities[0].jobId.replace('job_','')) === index) != null)

        var result = []
        this.props.tour.stops.filter(j => j.activities[0].type === "delivery" || j.activities[0].type === "pickup").forEach((item, index) => {
            var found = false;
            guias = guias.filter(function (guia, i) {
                if (!found && guia.index === parseInt(item.activities[0].jobId.replace('job_',''))) {
                    result.push(guia);
                    found = true;
                    return false;
                } else
                    return true;
            })
        })
        if (result.length !== 0) {
            calcularRuta(result, this.props.data).then((result) => {
                if (result) {
                    result.routes[0].sections.map((c, index) => {
                        polygon = [...polygon, ...decodePolyline(c.polyline)]
                    })
                    this.setState({polygon: polygon})
                }
            })
        }
    }

    render() {
        const blackOptions = {color: this.props.tour.color}
        return (
            <div style={{backgroundColor: "transparent"}}>
                {
                    this.props.tour.stops.map(a => a.activities).reduce((a,b) => a.concat(b)).filter(f => f.type === "pickup" || f.type === "delivery").map((activity, index) => {
                        const paquete = this.props.paquetes.find((p, i) => parseInt(activity.jobId.replace('job_','')) === i )
                        // var tour = this.props.tourReport.tourReports.find(t => t.vehicleId === this.props.tour.vehicleId)
                        // var reportTime = tour.tourEvents.find(t => t.eventTypes[0] === "SERVICE" && paquete.index === parseInt(t.orderId))
                        var date = new Date(activity.time?.start)
                        var userTimezoneOffset = date.getTimezoneOffset() * 60000;
                        date = new Date(date.getTime() + userTimezoneOffset);
                        var time = date.toLocaleTimeString()
                        return (
                                <Marker key={index}
                                        icon={<MarkerComponent color={this.props.tour.color} index={index + 1}/>}
                                        position={[paquete.lat, paquete.lng]}>
                                    <Popup>
                                        <Grid container spacing={1}>
                                            <Grid item md={12}>
                                                <Typography variant={"h2"}>
                                                    {paquete.m_sFolio} - {paquete.m_bEsRecoleccion ? paquete.m_sEstatusRecoleccion : paquete.m_sEstatusEmbarque}
                                                </Typography>
                                            </Grid>
                                            <Grid item md={12}>
                                                <Typography variant={"body1"} style={{fontWeight:"bold"}}>
                                                    Hora Estimada de entrega: {time}
                                                </Typography>
                                            </Grid>
                                            <Grid item md={12}>
                                                <Typography variant={"body2"} style={{fontWeight:"bold"}}>
                                                    Datos de la {paquete.m_bEsRecoleccion ? "Recolección" : "Entrega"}
                                                </Typography>
                                            </Grid>
                                            <Grid item md={12}>
                                                <Typography variant={"body1"}>
                                                    {paquete.m_bEsRecoleccion ? paquete.m_sNombreRemitente : paquete.m_sNombreDestinatario}
                                                </Typography>
                                            </Grid>
                                            <Grid item md={12}>
                                                <Typography variant={"body1"}>
                                                    {paquete.m_bEsRecoleccion ? paquete.m_bRecoleccionDiferenteDomicilio ? paquete.m_sDomicilioDetalleRecoleccion : paquete.m_sDomicilioRemitente : paquete.m_bEntregaDiferenteDomicilio ? paquete.m_sDomicilioDetalleEntrega :  paquete.m_sDomicilioDestinatario}
                                                </Typography>
                                            </Grid>
                                            <Grid item md={12}>
                                                <Typography variant={"body1"}>
                                                    {paquete.m_bEsRecoleccion ? paquete.m_sContactoRemitente : paquete.m_sContactoDestinatario}
                                                </Typography>
                                            </Grid>
                                            <Grid item md={12}>
                                                <Typography variant={"body1"}>
                                                    {paquete.m_bEsRecoleccion ? paquete.m_sTelefonoRemitente : paquete.m_sTelefonoDestinatario}
                                                </Typography>
                                            </Grid>
                                           {/* <Grid item md={12}>
                                                <Typography variant={"body1"} >No. Paquetes: {paquete.m_bEsRecoleccion ? paquete.m_parrPaquetes.reduce((a, b) => +a + +b.m_nCantidad, 0) : paquete.m_arrPaquetes.reduce((a, b) => +a + +b.m_nCantidad, 0)}</Typography>
                                            </Grid>*/}
                                        </Grid>
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

