import React, {Component, useMemo, useRef} from 'react';
import PropTypes from 'prop-types';
import {
    Box,
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    Grid,
    TextField,
    Typography,
} from "@mui/material";
import makeStyles from '@mui/styles/makeStyles';
import {MapContainer, Marker, Polyline, Popup, TileLayer, useMapEvents} from "react-leaflet";
import {LocationMarker} from "../../Views/DisplayMapClass";
import {obtenerUbicacion} from "../../Util/Contexts/RemitenteDestinatarioContext";
import L from "leaflet";
import MarkerImage from "../../iconos/Mapa/marker.png";
import SearchIcon from "@mui/icons-material/Search";
import {
    searchLocationAddress,
    searchAdressWithCoordinates,
    searchLocationGuia,
    searchLocationGuiav2
} from "../../Util/Contexts/UltimaMillaContext";
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';
import {getAddressFormated} from "../../Util/Util";

class ConfirmarUbicacion extends Component {
    constructor(props) {
        super(props);
        this.state = {
            coordenadas: [32.62781, -115.44632],
            map: null,
            busqueda: ""
        }
        this.cambiarCordenadas = this.cambiarCordenadas.bind(this)
        this.confirmarUbicacion = this.confirmarUbicacion.bind(this)
        this.buscarDireccion = this.buscarDireccion.bind(this)
        this.cargarMapa = this.cargarMapa.bind(this)
    }

    componentDidMount() {
        if (this.props.ultimaMilla) {
            return
        }
        searchLocationGuiav2(
            null,
            null,
            null,
            null,
            null,
            this.props.direccion.codigoPostal,
            null,
            null,
            this.props.direccion.direccionCompleta,
        ).then(data => {
            this.setState({
                coordenadas: {lat: data.y, lng: data.x}
            })
            this.state.map.setView([data.y, data.x], 18)
        })

    }

    cargarMapa(map) {
        if (this.props.ultimaMilla) {
            this.setState({
                coordenadas: {map: map, lat: this.props.lat, lng: this.props.lng},
                map: map
            })
            map.setView([this.props.lat, this.props.lng], 18)
            return
        } else {
            this.setState({map: map})
        }
    }

    cambiarCordenadas(posicion) { 
        var popup = L.popup()
        .setLatLng([posicion.lat,posicion.lng])
        .setContent(`Latitud: ${posicion.lat} <br/> Longitud: ${posicion.lng}`)
        .openOn(this.state.map);

        searchAdressWithCoordinates(5,6)
        this.setState({
            coordenadas: posicion
        })
     
          
    }

    confirmarUbicacion(e) {
        this.props.confirmarUbicacion(this.state.coordenadas, e, this.props.direccion.idGuia ? this.props.direccion.idGuia : 0, this.props.remitente)
        searchLocationGuiav2(
            null,
            null,
            null,
            null,
            null,
            this.props.direccion.codigoPostal,
            null,
            null,
            this.props.direccion.direccionCompleta,
        ).then(data => {
            this.setState({
                coordenadas: {lat: data.y, lng: data.x}
            })
            this.state.map.setView([data.y, data.x], 18)
        })
    }

    buscarDireccion(e) {
        e.preventDefault()
        searchLocationAddress(this.state.busqueda).then(data => {

            this.setState({
                coordenadas: {lat: data.y, lng: data.x}
            })
            this.state.map.setView([data.y, data.x], 18)
            
        })
    }

    render() {
        return (
            <Dialog open={this.props.open} maxWidth={"lg"} fullWidth>
                <DialogTitle>
                    <Box display="flex">
                        <Box width="90%"><Typography variant={"h1"}>Confirmar ubicación de
                            la {this.props.titulo}</Typography>
                        </Box>
                        <Box width="10%">
                            <IconButton
                                aria-label="close"
                                onClick={() => this.props.mostrarDialogoMapa(false)}
                                style={{position: 'absolute', right: '20px', top: '20px', padding: '5px'}}
                                size="large">
                                <CloseIcon style={{fontSize: '30px'}}/>
                            </IconButton>
                        </Box>
                    </Box>
                </DialogTitle>

                <DialogContent>
                    <Typography variant={"h4"}>Es importante selecciónar la ubicación exacta de
                        la {this.props.titulo} para facilitar el trabajo de los operadores</Typography>
                    
                    <br/>
                    <Grid container>
                        {!this.props.ultimaMilla &&
                            <Grid item sm={12}>
                                <Typography
                                    variant={"h2"}>{this.props.remitente ? "Remitente:" : "Destinatario:"} {this.props.direccion.nombreLugar}</Typography>
                            </Grid>
                        }
                        <Grid item sm={12}>
                            <Typography
                                variant={"h3"}>Dirección:{`${this.props.direccion.direccionCompleta}`}
                            </Typography>
                        </Grid>

                        <br/>
                        <br/>
                        <Grid item sm={12}> 
                        <Typography variant={"h4"}>{(this.state.coordenadas.lat==0 && this.state.coordenadas.lng==0)?"No hay coordenadas seleccionadas":(`Latitud: ${this.state.coordenadas.lat}   Longitud: ${this.state.coordenadas.lng}`)}</Typography>
                        </Grid>
                   

                    </Grid>
                    <br/>
                    <Grid item sm={12}>
                        <TextField
                            margin="dense"
                            className="form-control"
                            variant={"filled"}
                            fullWidth
                            label={"Direccion"}
                            value={this.state.busqueda}
                            onChange={(e) => this.setState({busqueda: e.target.value})}
                            InputProps={{
                                endAdornment: <SearchIcon style={{
                                    color: "#F9A03E",
                                    fontSize: 32,
                                    paddingInlineEnd: 0,
                                    paddingRight: 0,
                                    paddingBlockEnd: 0,
                                    paddingLeft: 0,
                                    paddingBlock: 0,
                                    cursor: "pointer"
                                }} onClick={this.buscarDireccion}/>,
                            }}
                        />
                    </Grid>
                    <br/>
                    <MapContainer style={{width: "100%", height: "500px"}} center={[32.62781, -115.44632]} zoom={18}
                                  scrollWheelZoom={false} whenCreated={m => this.cargarMapa(m)}>
                        <TileLayer style={{width: "100%", height: "500px"}}
                                   url="https://2.base.maps.ls.hereapi.com/maptile/2.1/maptile/newest/normal.day/{z}/{x}/{y}/512/png8?apiKey={token}&ppi=320"
                                   token={process.env.REACT_APP_HERE_API_TOEKN}
                        />

                        <MapEvents cambiarCordenadas={this.cambiarCordenadas}/>
                        {

                            this.state.coordenadas &&
                            <LocationMarker markerId={"ubicacion-lugar"} position={this.state.coordenadas}
                                            info={this.props.direccion} label={""} draggable={true}
                                            cambiarUbicacion={this.cambiarCordenadas}>

                            </LocationMarker>
                        }
                    </MapContainer>
                </DialogContent>
                <DialogActions>
                    <Button fullWidth variant={"contained"} color={"primary"}
                            onClick={(e) => this.confirmarUbicacion(e)}>Confirmar</Button>
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