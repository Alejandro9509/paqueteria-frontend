import React, {Component, useMemo, useRef} from 'react';
import PropTypes from 'prop-types';
import {Button, Dialog, DialogActions, DialogContent, DialogTitle, Grid, Typography} from "@material-ui/core";
import {MapContainer, Marker, Polyline, Popup, TileLayer, useMapEvents} from "react-leaflet";
import {LocationMarker} from "../../Views/DisplayMapClass";
import {obtenerUbicacion} from "../../Util/Contexts/RemitenteDestinatarioContext";
import L from "leaflet";
import MarkerImage from "../../iconos/Mapa/marker.png";



class ConfirmarUbicacion extends Component {
    constructor(props) {
        super(props);
        this.state = {
            coordenadas: [32.62781,-115.44632],
            map: null
        }
        this.cambiarCordenadas = this.cambiarCordenadas.bind(this)
        this.confirmarUbicacion = this.confirmarUbicacion.bind(this)
    }

    componentDidMount() {
        if (this.props.direccion) {
            obtenerUbicacion(this.props.direccion.m_sMunicipio, this.props.direccion.m_sCalle, this.props.direccion.m_sColonia, this.props.direccion.m_sCodigoPostal).then((coordenadas) => {
                this.setState({coordenadas: {lat: coordenadas.y, lng: coordenadas.x}})
                this.state.map.flyTo({lat: coordenadas.y, lng: coordenadas.x}, 18)
            })
        }
    }


    cambiarCordenadas(posicion) {
        this.setState({
            coordenadas: posicion
        })
    }

    confirmarUbicacion(e) {
        this.props.confirmarUbicacion(this.state.coordenadas,e)
    }

    render() {
        return (
            <Dialog open={this.props.open} maxWidth={"lg"} fullWidth>
                <DialogTitle><Typography variant={"h1"}>Confirmar
                    ubicación de la {this.props.titulo}</Typography></DialogTitle>

                <DialogContent>
                    <Typography variant={"h4"}>Es importante selecciónar la ubicación exacta de la {this.props.titulo} para facilitar el trabajo de los operadores</Typography>
                    <br/>
                    <Grid container>
                        <Grid item sm={12}>
                            <Typography variant={"h2"}>Remitente: {this.props.direccion.m_sNombre}</Typography>
                        </Grid>
                        <Grid item sm={12}>
                            <Typography variant={"h3"}>Dirección: {this.props.direccion.m_sDomicilio}</Typography>
                        </Grid>
                    </Grid>
                    <br/>
                    <Grid item sm={12}>
                        <Typography variant={"h2"}></Typography>
                    </Grid>
                    <br/>
                    <MapContainer style={{width: "100%", height: "500px"}} center={[32.62781 ,  -115.44632]} zoom={18}
                                  scrollWheelZoom={false} whenCreated={m => this.setState({map: m})}>
                        <TileLayer style={{width: "100%", height: "500px"}}
                                   url="https://xserver2-america-test.cloud.ptvgroup.com/services/rest/XMap/tile/{z}/{x}/{y}?userLanguage=es&amp;xtok={token}"
                                   token="51FA3E8E-8BF3-49EF-AB82-59D807A0645C"
                        />

                        <MapEvents cambiarCordenadas={this.cambiarCordenadas}/>
                        {

                            this.state.coordenadas &&
                            <LocationMarker markerId={"ubicacion-lugar"} position={this.state.coordenadas} info={this.props.direccion} label={""} draggable={true} cambiarUbicacion={this.cambiarCordenadas}>

                            </LocationMarker>
                        }
                    </MapContainer>
                </DialogContent>
                <DialogActions>
                    <Button fullWidth variant={"contained"} color={"primary"} onClick={(e) => this.confirmarUbicacion(e)}>Confirmar</Button>
                </DialogActions>
            </Dialog>
        );
    }
}

ConfirmarUbicacion.propTypes = {};

export default ConfirmarUbicacion;

function MapEvents(props) {
    const map = useMapEvents({
        click(e) {
            props.cambiarCordenadas(e.latlng)
        },
    })
    return (<div></div>)
}