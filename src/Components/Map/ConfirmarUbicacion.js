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
import {searchLocationAddress} from "../../Util/Contexts/UltimaMillaContext";
import IconButton from '@material-ui/core/IconButton';
import CloseIcon from '@material-ui/icons/Close';

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
        if (this.props.remitente) {//si es recoleccion entrara y evaluara si es informacion solo de recoleccion de remitente o si es de diferente direccion de recoleccion
            if (this.props.esDiferenteRecoleccion) {//si es diferente de recoleccion consulta los valores de recoleccionDD
                let municipioTexto = this.props.dataMunicipiosRecoleccionDD.filter(m => m.m_sCodigoMunicipio == this.props.recoleccionDD.municipioRec)[0].m_sMunicipio
                searchLocationAddress(`${this.props.recoleccionDD.domicilioRec},${this.props.recoleccionDD.codigoPostalRec},${municipioTexto}`).then(data => {

                    this.setState({
                        coordenadas: {lat: data.y, lng: data.x}
                    })
                    this.state.map.setView([data.y, data.x], 18)
                })

            } else {//en cambio si esta haciendo recoleccion al remitente tomara sus valores
                let municipio = this.props.direccion.municipioTexto;
                let calle = this.props.direccion.calleRemitente
                let colonia = this.props.direccion.coloniaRemitente
                let numeroExterior = this.props.direccion.numeroExtRemitente
                let codigoPostal = this.props.direccion.codigoPostalRemitente.m_sCP
                searchLocationAddress(`${calle} ${numeroExterior} ${colonia} ${codigoPostal} ${municipio}`).then(data => {
                    this.setState({
                        coordenadas: {lat: data.y, lng: data.x}
                    })
                    this.state.map.setView([data.y, data.x], 18)
                })

            }

        }
        if (!this.props.recoleccion) {//Si es embarque
            // console.log("Entra en destinatario"+this.props.esDiferenteEntrega)
            if (this.props.esDiferenteDomicilio) {//si es diferente domicilio de entrega tomara los valores del form del diferente domicilio de entrega
                // debugger
                let municipioTexto = this.props.dataMunicipiosEntregaDD.find(m => m.m_sCodigoMunicipio == parseInt(this.props.direccion.municipioEnt))?.m_sMunicipio
                searchLocationAddress(`${this.props.direccion.domicilioEnt},${this.props.direccion.codigoPostalEnt},${municipioTexto}`).then(data => {

                    this.setState({
                        coordenadas: {lat: data.y, lng: data.x}
                    })
                    this.state.map.setView([data.y, data.x], 18)
                })

            } else {//en cambio si esta haciendo entrega al destinatario normal tomara sus valores
                let municipio = this.props.direccion.municipioTexto;
                let calle = this.props.direccion.calleDestinatario;
                let colonia = this.props.direccion.coloniaDestinatario;
                let numeroExterior = this.props.direccion.numeroExtDestinatario
                let codigoPostal = this.props.direccion.codigoPostalDestinatario.m_sCP

                searchLocationAddress(`${calle} ${numeroExterior} ${colonia} ${codigoPostal} ${municipio}`).then(data => {
                    this.setState({
                        coordenadas: {lat: data.y, lng: data.x}
                    })
                    this.state.map.setView([data.y, data.x], 18)
                })

            }
        }
    }


    cambiarCordenadas(posicion) {
        this.setState({
            coordenadas: posicion
        })
    }

    confirmarUbicacion(e) {
        this.props.confirmarUbicacion(this.state.coordenadas, e, this.props.direccion.idGuia?this.props.direccion.idGuia:0, this.props.remitente)
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
                <DialogTitle>
                    <Box display="flex">
                    <Box width="90%"><Typography variant={"h1"}>Confirmar ubicación de la {this.props.titulo}</Typography>
                     </Box>
                    <Box width="10%">
                    <IconButton aria-label="close" onClick={()=>this.props.mostrarDialogoMapa(false)} style={{position: 'absolute', right: '20px',top: '20px',padding:'5px'}}>
                    <CloseIcon  style={{fontSize: '30px'}} />
                    </IconButton>
                    </Box>
                </Box>
              </DialogTitle>

                <DialogContent>
                    <Typography variant={"h4"}>Es importante selecciónar la ubicación exacta de
                        la {this.props.titulo} para facilitar el trabajo de los operadores</Typography>
                    <br/>
                    <Grid container>

                        <Grid item sm={12}>
                            <Typography
                                variant={"h2"}>{this.props.remitente ? "Remitente:" : "Destinatario:"} {this.props.recoleccion ? this.props.direccion.nombreRemitente : this.props.direccion.nombreDestinatario}</Typography>
                        </Grid>
                        <Grid item sm={12}>
                            <Typography
                                variant={"h3"}>Dirección:{this.props.remitente?(this.props.esDiferenteRecoleccion? this.props.recoleccionDD.domicilioRec:(`${this.props.direccion.calleRemitente},${this.props.direccion.numeroExtRemitente},${this.props.direccion.coloniaRemitente} `)):(this.props.esDiferenteDomicilio?this.props.direccion.domicilioEnt:(`${this.props.direccion.calleDestinatario},${this.props.direccion.numeroExtDestinatario},${this.props.direccion.coloniaDestinatario} `))}
                                </Typography>
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