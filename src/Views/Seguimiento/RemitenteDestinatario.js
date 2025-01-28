import React, {Component} from 'react';
import {Grid, Typography} from "@mui/material";

class RemitenteDestinatario extends Component {
    constructor(props) {
        super(props);
    }

    componentDidMount() {
    }

    render() {
        const {data} = this.props
        return (
            <Grid container direction="row" >
                <Grid item sm={12} md={6}>
                    <Grid container spacing={1}  >
                        <Grid item md={12}>
                            <Typography variant={"h4"} style={{alignItems: "center", width:"100%", fontWeight:"bold"}}>
                                Remitente
                            </Typography>
                        </Grid>
                        <Grid item md={8}>
                            <Typography style={{fontWeight: "bold", display: "flex", alignItems: "center", fontSize: "1.1em"}}>
                                Nombre:&nbsp;
                                <Typography style={{fontSize: "1em"}}>
                                    {data.m_sNombreRemitente}
                                </Typography>
                            </Typography>
                        </Grid>
                        <Grid item md={4}>
                            <Typography style={{fontWeight: "bold", display: "flex", alignItems: "center", fontSize: "1.1em"}}>
                                Contacto:&nbsp;
                                <Typography style={{fontSize: "1em"}}>
                                    {data.m_sContactoRemitente}
                                </Typography>
                            </Typography>
                        </Grid>
                        <Grid item md={8}>
                            <Typography style={{fontWeight: "bold", display: "flex", alignItems: "center", fontSize: "1.1em"}}>
                                Dirección:&nbsp;
                                <Typography style={{fontSize: "1em"}}>
                                    {data.m_sDomicilioRemitente}
                                </Typography>
                            </Typography>
                        </Grid>
                        <Grid item md={4}>
                            <Typography style={{fontWeight: "bold", display: "flex", alignItems: "center", fontSize: "1.1em"}}>
                                Teléfono:&nbsp;
                                <Typography style={{fontSize: "1em"}}>
                                    {data.m_sTelefonoRemitente}
                                </Typography>
                            </Typography>
                        </Grid>
                        {
                            data.m_bAplicaRecoleccion && data.m_bRecoleccionDiferenteDomicilio &&
                            <Grid item md={12}>
                                <Typography style={{fontWeight: "bold", display: "flex", alignItems: "center", fontSize: "1.1em"}}>
                                    Recolección en:&nbsp;
                                    <Typography style={{fontSize: "1em"}}>
                                        {data.m_sDomicilioDetalleRecoleccion }
                                    </Typography>
                                </Typography>
                            </Grid>
                        }
                        {
                            data.m_bRecoleccionConCita &&
                            <Grid item md={12}>
                                <Typography style={{fontWeight: "bold", display: "flex", alignItems: "center", fontSize: "1.1em"}}>
                                    Cita:&nbsp;
                                    <Typography style={{fontSize: "1em"}}>
                                        {data.m_sFechaRecoleccionCita} {data.m_sHoraCitarRecoleccionMinima}-{data.m_sHoraCitaRecoleccionMaxima}
                                    </Typography>
                                </Typography>
                            </Grid>
                        }
                    </Grid>
                </Grid>
                <Grid item sm={12} md={6}>
                    <Grid container spacing={1}  >
                        <Grid item md={12}>
                            <Typography variant={"h4"} style={{ alignItems: "center", width:"100%", fontWeight:"bold"}}>
                                Destinatario
                            </Typography>
                        </Grid>
                        <Grid item md={8}>
                            <Typography style={{fontWeight: "bold", display: "flex", alignItems: "center", fontSize: "1.1em"}}>
                                Nombre:&nbsp;
                                <Typography style={{fontSize: "1em"}}>
                                    {data.m_sNombreDestinatario}
                                </Typography>
                            </Typography>
                        </Grid>
                        <Grid item md={4}>
                            <Typography style={{fontWeight: "bold", display: "flex", alignItems: "center", fontSize: "1.1em"}}>
                                Contacto:&nbsp;
                                <Typography style={{fontSize: "1em"}}>
                                    {data.m_sContactoDestinatario}
                                </Typography>
                            </Typography>
                        </Grid>
                        <Grid item md={8}>
                            <Typography style={{fontWeight: "bold", display: "flex", alignItems: "center", fontSize: "1.1em"}}>
                                Dirección:&nbsp;
                                <Typography style={{fontSize: "1em"}}>
                                    {data.m_sDomicilioDestinatario}
                                </Typography>
                            </Typography>
                        </Grid>
                        <Grid item md={4}>
                            <Typography style={{fontWeight: "bold", display: "flex", alignItems: "center", fontSize: "1.1em"}}>
                                Teléfono:&nbsp;
                                <Typography style={{fontSize: "1em"}}>
                                    {data.m_sTelefonoDestinatario}
                                </Typography>
                            </Typography>
                        </Grid>
                        {
                            data.m_bEmbarqueConCita &&
                            <Grid item md={12}>
                                <Typography style={{fontWeight: "bold", display: "flex", alignItems: "center", fontSize: "1.1em"}}>
                                    Cita:&nbsp;
                                    <Typography style={{fontSize: "1em"}}>
                                        {data.m_sFechaEmbarqueCita} {data.m_sHoraEmbarqueCitaMinima}-{data.m_sHoraEmbarqueCitaMaxima}
                                    </Typography>
                                </Typography>
                            </Grid>
                        }
                        {
                            (data.m_bEntregaSucursal || !data.m_bEntregaMismoDomicilio) &&
                            <Grid item md={12}>
                                <Typography style={{fontWeight: "bold", display: "flex", alignItems: "center", fontSize: "1.1em"}}>
                                    Entrega:&nbsp;
                                    <Typography style={{fontSize: "1em"}}>
                                        {data.m_bEntregaSucursal ? ("Sucursal " + data.m_sSucursalEntrega) : !data.m_bEntregaMismoDomicilio ? data.m_sDomicilioDetalleEntrega : "" }
                                    </Typography>
                                </Typography>
                            </Grid>
                        }
                    </Grid>
                </Grid>
            </Grid>
        );
    }
}

RemitenteDestinatario.propTypes = {};

export default RemitenteDestinatario;
