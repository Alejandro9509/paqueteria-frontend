import React, {Component} from 'react';
import Marker from "react-leaflet-enhanced-marker";
import {Polyline, Popup} from "react-leaflet";
import {calcularRuta, calcularRutaUltimaMilla, obtenerUltimaMillaReporte} from "../../Util/Contexts/UltimaMillaContext";
import {ReactComponent as UnidadesIcon} from "../../iconos/Catalogos/Icono Unidades/icono_unidades.svg";
import {obtenerGuiaReporte} from "../../Util/Contexts/GuiaContext";
import {obtenerRecoleccionReporte} from "../../Util/Contexts/RecoleccionContext";
import {decodePolyline} from "../../Util/HereDecoading";
import DialogoEvidenciasUltimaMilla from "./DialogoEvidenciasUltimaMilla";
import DatosEntregaRecoleccion from "./DatosEntregaRecoleccion"

class TourUltimaMilla extends Component {
    constructor(props) {
        super(props);
        this.state = {
            polygon: [],
            setOpenDialogEvidencias: false,
            guiaSeleccionada: null,
            openDatos: false
        }
        this.getRoute = this.getRoute.bind(this)
        this.handleClickOpenDialogoEvidencia = this.handleClickOpenDialogoEvidencia.bind(this)
        this.handleClickCloseDialogoEvidencia = this.handleClickCloseDialogoEvidencia.bind(this)
        this.handleOpenDatos = this.handleOpenDatos.bind(this)
    }

    componentDidUpdate(prevProps, prevState, snapshot) {

        if (this.props.data.m_arrClsProGuia.length !== prevProps.data.m_arrClsProGuia.length) {
            this.getRoute()
        }
    }

    componentDidMount() {
        this.getRoute()
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
            if (this.props.data.m_xlat !== 0 && this.props.data.m_xlng !== 0) {
                calcularRutaUltimaMilla(guias, this.props.sucursal, {lat: this.props.data.m_xlat, lng: this.props.data.m_xlng}).then((result) => {
                    if (result) {
                        result.routes[0].sections.map((c, index) => {
                            polygon = [...polygon, ...decodePolyline(c.polyline)]
                        })
                        this.setState({polygon:polygon })                    }
                })
            } else {
                calcularRuta(guias, this.props.sucursal).then((result) => {
                    if (result) {
                        result.routes[0].sections.map((c, index) => {
                            polygon = [...polygon, ...decodePolyline(c.polyline)]
                        })
                        this.setState({polygon:polygon })
                    }
                })
            }
        }

    }

    generarReporte(guia) {
        console.log(guia)
        if ( !guia.m_bEsRecoleccion ){
            obtenerGuiaReporte(guia.m_nId).then(({data}) => {
                let pdfWindow = window.open("");
                pdfWindow.document.write("<embed  width='100%' height='100%' src='data:application/pdf;base64, " + encodeURI(data) + "'/>");
                pdfWindow.document.body.style.margin = "0px";
                pdfWindow.document.title = "Guía "+ guia.m_sFolio;
            })
        }else{
            obtenerRecoleccionReporte(guia.m_nId).then(({data}) => {
                let pdfWindow = window.open("");
                pdfWindow.document.write("<embed  width='100%' height='100%' src='data:application/pdf;base64, " + encodeURI(data) + "'/>");
                pdfWindow.document.body.style.margin = "0px";
                pdfWindow.document.title = "Recolección " + guia.m_sFolio;
            })
        }

    }

    handleClickCloseDialogoEvidencia(openDialog){
        this.setState({
            setOpenDialogEvidencias: openDialog,
            guiaSeleccionada: null
        })
    }

    handleClickOpenDialogoEvidencia(openDialog, guia){
        this.setState({
            setOpenDialogEvidencias: openDialog,
            guiaSeleccionada: guia
        })
    }
    handleOpenDatos(){
        this.setState({
            openDatos: true
        })
    }

    render() {
        const blackOptions = {color: this.props.data.color}
        return (
            <div style={{backgroundColor: "transparent"}}>
                { (this.state.setOpenDialogEvidencias && this.state.guiaSeleccionada) &&
                    <DialogoEvidenciasUltimaMilla
                        open={this.state.setOpenDialogEvidencias}
                        setCloseDialog={this.handleClickCloseDialogoEvidencia}
                        imagenes={this.state.guiaSeleccionada.m_arrImagenes}
                    />
                }

                {
                    this.props.data.m_arrClsProGuia.map((g, index) => {
                            return (
                                <div>
                                        <Marker key={index}
                                        icon={<MarkerComponent color={this.props.data.color}
                                                               index={g.m_nUltimaMillaOrden}/>}
                                        position={[parseFloat(g.m_sLatitud), parseFloat(g.m_sLongitud)]}>
                                    <Popup>
                                            <DatosEntregaRecoleccion data={g} open={() => this.handleClickOpenDialogoEvidencia} isTour={true}/>
                                    </Popup>
                                </Marker>
                                </div>
                                
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
