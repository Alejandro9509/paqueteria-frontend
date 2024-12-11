import React, {Component} from 'react';
import {Grid, Typography, Button} from "@mui/material";
import {InsertDriveFile} from "@mui/icons-material";
import IconButton from "@mui/material/IconButton";
import {obtenerGuiaReporte} from "../../Util/Contexts/GuiaContext";
import {obtenerRecoleccionReporte} from "../../Util/Contexts/RecoleccionContext";
import DialogoEvidenciasUltimaMilla from "./DialogoEvidenciasUltimaMilla";
import { obtenerImagenEvidencia } from '../../Util/Contexts/UltimaMillaContext';

class DatosEntregaRecoleccion extends Component {
    constructor(props) {
        super(props);
        this.state = {
            setOpenDialogEvidencia:false,
            imagenesEvidencia:[],
            imagenesCargadas:false,
        }
        this.handleClickCloseDialogoEvidencia = this.handleClickCloseDialogoEvidencia.bind(this)
        this.cargarImagenes = this.cargarImagenes.bind(this)
    }

    componentDidMount() {
    }


    generarReporte(guia) {
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
        this.setState({setOpenDialogEvidencia:openDialog})
    }

    cargarImagenes()
    {
        this.setState({setOpenDialogEvidencia:true})
        if(this.state.imagenesCargadas)
            return
            obtenerImagenEvidencia(this.props.data.m_nId,this.props.data.m_bEsRecoleccion).then(respuesta=>{
                this.setState({
                    imagenesEvidencia:respuesta.data?respuesta.data:[],

                })
            })
        this.setState({imagenesCargadas:true})
    }

    render() {
        const blackOptions = {color: this.props.data.color}
        return (
            <div style={{backgroundColor: "transparent"}}>
                <Grid container spacing={1}>
                    <Grid item md={12}>
                        <Typography variant={"h2"}>
                            {this.props.data.m_sFolio} - { this.props.data.m_sEstatusUltimaMilla}
                        </Typography>
                    </Grid>

                    <Grid item md={12}>
                        <Typography variant={"body2"} style={{fontWeight: "bold"}}>
                            Datos de la {this.props.data.m_bEsRecoleccion ? "Recolección" : "Entrega"}
                        </Typography>
                    </Grid>
                    <Grid item md={12}>
                        <Typography variant={"body1"}>
                            {this.props.data.m_bEsRecoleccion ? this.props.data.m_sNombreRemitente : this.props.data.m_sNombreDestinatario}
                        </Typography>
                    </Grid>
                    <Grid item md={12}>
                        <Typography variant={"body1"}>
                            {this.props.data.m_bEsRecoleccion ? this.props.data.m_bRecoleccionDiferenteDomicilio ? this.props.data.m_sDomicilioDetalleRecoleccion : this.props.data.m_sDomicilioRemitente : this.props.data.m_bEntregaDiferenteDomicilio ? this.props.data.m_sDomicilioDetalleEntrega :  this.props.data.m_sDomicilioDestinatario}
                        </Typography>
                    </Grid>
                    <Grid item md={12}>
                        <Typography variant={"body1"}>
                            {this.props.data.m_bEsRecoleccion ? this.props.data.m_sContactoRemitente : this.props.data.m_sContactoDestinatario}
                        </Typography>
                    </Grid>
                    <Grid item md={12}>
                        <Typography variant={"body1"}>
                            {this.props.data.m_bEsRecoleccion ? this.props.data.m_sTelefonoRemitente : this.props.data.m_sTelefonoDestinatario}
                        </Typography>
                    </Grid>
                    <Grid item md={10}>
                        <Typography variant={"body1"}>
                            No. Paquetes: {this.props.data.m_bEsRecoleccion ? this.props.data.m_parrPaquetes.reduce((a, b) => +a + +b.m_nCantidad, 0) : this.props.data.m_arrPaquetes.reduce((a, b) => +a + +b.ctd, 0)}
                        </Typography>
                    </Grid>
                    <Grid item md={12}>
                        <Typography variant={"body1"}>
                            Recibío/Entregó: {this.props.data.m_sReceptor}
                        </Typography>
                    </Grid>
                    <Grid item md={12}>
                        <Typography variant={"body1"}>
                            Entrega/Recolecta: {this.props.data.m_sFechaHora}
                        </Typography>
                    </Grid>
                    {
                        this.props.isTour &&
                        <Grid item md={2}>
                            <IconButton
                                aria-label="file"
                                onClick={() => this.generarReporte(this.props.data)}
                                size="large">
                                <InsertDriveFile fontSize={"default"}/>
                            </IconButton>
                        </Grid>
                    }
                    { this.props.isTour &&
                        <Grid item md={12}>
                             { (this.state.setOpenDialogEvidencia) &&
                                <DialogoEvidenciasUltimaMilla
                                    open={this.state.setOpenDialogEvidencia}
                                    setCloseDialog={this.handleClickCloseDialogoEvidencia}
                                    imagenes={this.state.imagenesEvidencia}
                                />
                             }
                            <Button fullWidth variant="text" color="primary" onClick={() =>this.cargarImagenes()}>
                                Ver evidencias
                            </Button>
                        </Grid>
                    }
                </Grid>
            </div>
        );
    }
}

DatosEntregaRecoleccion.propTypes = {};

export default DatosEntregaRecoleccion;