import React, {Component, useMemo, useRef} from 'react';
import PropTypes from 'prop-types';
import {
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    Grid,
    TextField,
    Typography
} from "@material-ui/core";
import {MapContainer, Marker, Polyline, Popup, TileLayer, useMapEvents} from "react-leaflet";
import {LocationMarker} from "../../Views/DisplayMapClass";
import {obtenerUbicacion} from "../../Util/Contexts/RemitenteDestinatarioContext";
import L from "leaflet";
import MarkerImage from "../../iconos/Mapa/marker.png";
import SearchIcon from "@material-ui/icons/Search";
import {searchLocationAddress} from "../../Util/Contexts/UltimaMillaContext";


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
    }

    componentDidMount() {
        if (this.props.direccion) {
console.log(this.props.direccion)
            obtenerUbicacion(this.props.direccion.municipioTexto, this.props.recoleccion ? this.props.direccion.calleRemitente : this.props.direccion.calleDestinatario, this.props.recoleccion ? this.props.direccion.coloniaRemitente : this.props.direccion.coloniaDestinatario,this.props.recoleccion ?  this.props.direccion.numeroIntRemitente : this.props.direccion.numeroIntDestinatario, this.props.recoleccion ? this.props.direccion.codigoPostalRemitente.m_sCP : this.props.direccion.codigoPostalDestinatario.m_sCP).then((coordenadas) => {
                this.setState({coordenadas: {lat: coordenadas.y, lng: coordenadas.x}})
                this.state.map.setView([coordenadas.y, coordenadas.x], 18)
            })
        }
    }


    cambiarCordenadas(posicion) {
        this.setState({
            coordenadas: posicion
        })
    }

    confirmarUbicacion(e) {
        this.props.confirmarUbicacion(this.state.coordenadas, e)
    }

     buscarDireccion(e){
        e.preventDefault()
        searchLocationAddress(this.state.busqueda).then(data => {

            this.setState({
                coordenadas: {lat:data.y, lng:data.x}
            })
            this.state.map.setView([data.y, data.x], 18)
        })
    }

    render() {
        return (
            <Dialog open={this.props.open} maxWidth={"lg"} fullWidth>
                <DialogTitle><Typography variant={"h1"}>Confirmar
                    ubicación de la {this.props.titulo}</Typography></DialogTitle>

                <DialogContent>
                    <Typography variant={"h4"}>Es importante selecciónar la ubicación exacta de
                        la {this.props.titulo} para facilitar el trabajo de los operadores</Typography>
                    <br/>
                    <Grid container>

                        <Grid item sm={12}>
                            <Typography
                                variant={"h2"}>{this.props.recoleccion ? "Remitente:" : "Destinatario:"} {this.props.recoleccion ? this.props.direccion.nombreRemitente : this.props.direccion.nombreDestinatario}</Typography>
                        </Grid>
                        <Grid item sm={12}>
                            <Typography
                                variant={"h3"}>Dirección: {this.props.recoleccion ? this.props.direccion.domicilioRemitente : this.props.direccion.domicilioDestinatario}</Typography>
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
                                    cursor:"pointer"
                                }} onClick={this.buscarDireccion}/>,
                            }}
                        />
                    </Grid>
                    <br/>
                    <MapContainer style={{width: "100%", height: "500px"}} center={[32.62781, -115.44632]} zoom={18}
                                  scrollWheelZoom={false} whenCreated={m => this.setState({map: m})}>
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