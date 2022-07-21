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
    makeStyles,
    TextField,
    Typography
} from "@material-ui/core";
import {MapContainer, Marker, Polyline, Popup, TileLayer, useMapEvents} from "react-leaflet";
import {LocationMarker} from "../../Views/DisplayMapClass";
import {obtenerUbicacion} from "../../Util/Contexts/RemitenteDestinatarioContext";
import L from "leaflet";
import MarkerImage from "../../iconos/Mapa/marker.png";
import SearchIcon from "@material-ui/icons/Search";
import {
    searchLocationAddress,
    searchAdressWithCoordinates,
    searchLocationGuia,
    searchLocationGuiav2
} from "../../Util/Contexts/UltimaMillaContext";
import IconButton from '@material-ui/core/IconButton';
import CloseIcon from '@material-ui/icons/Close';
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

        if(this.props.recoleccion){
            searchLocationGuiav2(
                this.props.direccion.calle,
                this.props.direccion.numeroExterior,
                this.props.direccion.numeroInterior,
                this.props.direccion.colonia,
                this.props.direccion.ciudad,
                this.props.direccion.codigoPostal,
                this.props.direccion.estado,
                this.props.direccion.pais).then(data => {
                this.setState({
                    coordenadas: {lat: data.y, lng: data.x}
                })
                this.state.map.setView([data.y, data.x], 18)
            })
    }
        if (!this.props.recoleccion) {//Si es embarque
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
                            <IconButton aria-label="close" onClick={() => this.props.mostrarDialogoMapa(false)}
                                        style={{position: 'absolute', right: '20px', top: '20px', padding: '5px'}}>
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
                                    variant={"h2"}>{this.props.remitente ? "Remitente:" : "Destinatario:"} {this.props.recoleccion ? this.props.direccion.nombreRemitente : this.props.direccion.nombreDestinatario}</Typography>
                            </Grid>
                        }

                        {!this.props.ultimaMilla &&
                            <Grid item sm={12}>
                                <Typography
                                    variant={"h3"}>Dirección:{this.props.remitente ?
                                    (`${this.props.direccion.calle}`
                                        +`${this.props.direccion.numeroExterior?','+this.props.direccion.numeroExterior:''}`
                                        +`${this.props.direccion.colonia?','+this.props.direccion.colonia:''}`
                                        +`${this.props.direccion.codigoPostal?','+this.props.direccion.codigoPostal:''}`
                                        +`${this.props.direccion.ciudad?','+this.props.direccion.ciudad:''}`
                                        +`${this.props.direccion.estado?','+this.props.direccion.estado:''}`
                                        +`${this.props.direccion.pais?','+this.props.direccion.pais:''}`)
                                    : (`${this.props.direccion.direccionCompleta}`)}
                                </Typography>
                            </Grid>
                        }
                        {this.props.ultimaMilla &&
                            <Grid item sm={12}>
                                <Typography
                                    variant={"h3"}>Dirección: {this.props.remitente ? this.props.direccion.domicilioRemitente : this.props.direccion.domicilioDestinatario}
                                </Typography>
                            </Grid>
                        }
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
                                   url="https://xserver2-america.cloud.ptvgroup.com/services/rest/XMap/tile/{z}/{x}/{y}?userLanguage=es&amp;xtok={token}"
                                   token="51FA3E8E-8BF3-49EF-AB82-59D807A0645C"
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
            console.log(e.latlng);
            props.cambiarCordenadas(e.latlng)
        },
    })
    return (<div></div>)
}