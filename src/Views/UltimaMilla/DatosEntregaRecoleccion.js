import React, {Component} from 'react';
import PropTypes from 'prop-types';
import Marker from "react-leaflet-enhanced-marker";
import {Polyline, Popup} from "react-leaflet";
import {calcularRuta, calcularRutaUltimaMilla, obtenerUltimaMillaReporte} from "../../Util/Contexts/UltimaMillaContext";
import {ReactComponent as UnidadesIcon} from "../../iconos/Catalogos/Icono Unidades/icono_unidades.svg";
import MarkerImage from "../../iconos/Mapa/sucursalMarcador.png";
import {Grid, Typography, Dialog, DialogTitle, DialogActions, DialogContent, Button} from "@material-ui/core";
import {InsertDriveFile} from "@material-ui/icons";
import IconButton from "@material-ui/core/IconButton";
import {obtenerGuiaReporte} from "../../Util/Contexts/GuiaContext";
import {obtenerRecoleccionReporte} from "../../Util/Contexts/RecoleccionContext";
import {decodePolyline} from "../../Util/HereDecoading";
import DialogoEvidenciasUltimaMilla from "./DialogoEvidenciasUltimaMilla";

class DatosEntregaRecoleccion extends Component {
    constructor(props) {
        super(props);
        this.state = {
            
        }
    }

    componentDidMount() {
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

    render() {
        const blackOptions = {color: this.props.data.color}
        return (
            <div style={{backgroundColor: "transparent"}}>
                                        <Grid container spacing={1}>
                                            <Grid item md={12}>
                                                <Typography
                                                    variant={"h2"}>{this.props.data.m_sFolio} - { this.props.data.m_sEstatusUltimaMilla}</Typography>
                                            </Grid>

                                            <Grid item md={12}>
                                                <Typography variant={"body2"} style={{fontWeight: "bold"}}>Datos de
                                                    la {this.props.data.m_bEsRecoleccion ? "Recolección" : "Entrega"}</Typography>
                                            </Grid>
                                            <Grid item md={12}>
                                                <Typography
                                                    variant={"body1"}>{this.props.data.m_bEsRecoleccion ?   this.props.data.m_sNombreRemitente : this.props.data.m_sNombreDestinatario}</Typography>
                                            </Grid>
                                            <Grid item md={12}>
                                                <Typography
                                                    variant={"body1"}>{this.props.data.m_bEsRecoleccion ? this.props.data.m_bRecoleccionDiferenteDomicilio ? this.props.data.m_sDomicilioDetalleRecoleccion : this.props.data.m_sDomicilioRemitente : this.props.data.m_bEntregaDiferenteDomicilio ? this.props.data.m_sDomicilioDetalleEntrega :  this.props.data.m_sDomicilioDestinatario}</Typography>
                                            </Grid>
                                            <Grid item md={12}>
                                                <Typography
                                                    variant={"body1"}>{this.props.data.m_bEsRecoleccion ? this.props.data.m_sContactoRemitente : this.props.data.m_sContactoDestinatario}</Typography>
                                            </Grid>
                                            <Grid item md={12}>
                                                <Typography
                                                    variant={"body1"}>{this.props.data.m_bEsRecoleccion ? this.props.data.m_sTelefonoRemitente : this.props.data.m_sTelefonoDestinatario}</Typography>
                                            </Grid>
                                            <Grid item md={10}>
                                                <Typography variant={"body1"}>No.
                                                    Paquetes: {this.props.data.m_bEsRecoleccion ? this.props.data.m_parrPaquetes.reduce((a, b) => +a + +b.m_nCantidad, 0) : this.props.data.m_arrPaquetes.reduce((a, b) => +a + +b.ctd, 0)}</Typography>
                                            </Grid>
                                            <Grid item md={12}>
                                                <Typography
                                                    variant={"body1"}>Recibío/Entregó: {this.props.data.m_sReceptor}</Typography>
                                            </Grid>
                                            <Grid item md={12}>
                                                <Typography
                                                    variant={"body1"}>Entrega/Recolecta: {this.props.data.m_sFechaHora}</Typography>
                                            </Grid>
                                            {
                                                this.props.isTour &&
                                                <Grid item md={2}>
                                                <IconButton aria-label="file" onClick={() => this.generarReporte(this.props.data)}>
                                                    <InsertDriveFile fontSize={"default"}/>
                                                </IconButton>
                                                </Grid>

                                            }
                                            { this.props.isTour &&
                                                <Grid item md={12}>
                                                <Button fullWidth variant="text" color="primary" onClick={() => this.props.open(true, this.props.data)}>
                                                    Ver evidencias
                                                </Button>
                                                </Grid>
                                            }
                                            {

                                                this.props.data.m_arrImagenes.find(i => parseInt(i.m_nTipoArchivo) === 1) !== undefined &&
                                                <Grid item md={12}>
                                                    <div align={"center"}>
                                                        <img style={{width: "80px", height: "80px",transform:"rotate(90deg)"}}
                                                             src={`data:image/jpeg;base64,${this.props.data.m_arrImagenes.find(i => parseInt(i.m_nTipoArchivo) === 1).m_sImagen}`}/>
                                                    </div>
                                                </Grid>
                                            }


                                        </Grid>
            </div>
        );
    }
}

DatosEntregaRecoleccion.propTypes = {};

export default DatosEntregaRecoleccion;