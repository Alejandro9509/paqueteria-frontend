import React, {Component} from 'react';
import {Checkbox, FormControlLabel, Grid, Typography} from "@mui/material";

class InformacionBasica extends Component {
    constructor(props) {
        super(props);
    }


    componentDidMount() {

    }

    render() {
        const {data} = this.props
        return (
            <div>
                <Grid container spacing={1} alignItems={"flex-start"} justifyContent={"flex-start"}>
                    <Grid item xs={3}>
                        <Typography style={{fontWeight: "bold", display: "flex", alignItems: "center"}}>Folio
                            seguimiento: <Typography> {data.m_sFolio}</Typography></Typography>
                    </Grid>
                    <Grid item xs={3}>
                        <Typography style={{fontWeight: "bold", display: "flex", alignItems: "center"}}>
                            Fecha de registro:
                            <Typography>
                                {data.m_dFechaRegistro} {data.m_tHoraRegistro}
                            </Typography>
                        </Typography>
                    </Grid>
                    <Grid item xs={3}>
                        <Typography style={{fontWeight: "bold", display: "flex", alignItems: "center"}}>
                            Cliente:
                            <Typography>
                                {data.m_sNombreResponsablePago}
                            </Typography>
                        </Typography>
                    </Grid>
                    <Grid item xs={3}>
                        <Typography style={{fontWeight: "bold", display: "flex", alignItems: "center"}}>
                            Núm. de seguimiento:
                            <Typography>
                                {data.m_sTracking}
                            </Typography>
                        </Typography>
                    </Grid>
                    <Grid item xs={3}>
                        <Typography style={{fontWeight: "bold", display: "flex", alignItems: "center"}}>
                            Tipo seguro:
                            <Typography>
                                {data.m_sTipoSeguro}
                            </Typography>
                        </Typography>
                    </Grid>
                    <Grid item xs={3}>
                        <Typography style={{fontWeight: "bold", display: "flex", alignItems: "center"}}>
                            Estatus:
                            <Typography>
                                {data.m_sEstatus}
                            </Typography>
                        </Typography>
                    </Grid>
                    <Grid item xs={3}>
                        <Typography style={{fontWeight: "bold", display: "flex", alignItems: "center"}}>
                            Registrada por:
                            <Typography>
                                {data.m_sRegistradaPor}
                            </Typography>
                        </Typography>
                    </Grid>
                    <Grid item xs={3}>
                        <Typography style={{fontWeight: "bold", display: "flex", alignItems: "center"}}>
                            Estatus Pago:
                            <Typography>
                                {data.m_sTipoCobro}
                            </Typography>
                        </Typography>
                    </Grid>

                    <Grid item xs={3}>
                        <Typography style={{fontWeight: "bold", display: "flex", alignItems: "center"}}>
                            Valor declarado:
                            <Typography>
                                ${data.m_xValorDeclarado}
                            </Typography>
                        </Typography>
                    </Grid>
                    <Grid item xs={3}>
                        <Typography style={{fontWeight: "bold", display: "flex", alignItems: "center"}}>
                            Recibió:
                            <Typography>
                                {data.m_sReceptor=='null'?'No Aplica':data.m_sReceptor}
                            </Typography>
                        </Typography>
                    </Grid>
                    <Grid item xs={3}>
                        <Typography style={{fontWeight: "bold", display: "flex", alignItems: "center"}}>
                            Entregó Guía:
                            <Typography>
                                {data.operadorEntrega?data.operadorEntrega:'No Aplica'}
                            </Typography>
                        </Typography>
                    </Grid>
                    <Grid item xs={3}>
                        <Typography style={{fontWeight: "bold", display: "flex", alignItems: "center"}}>
                            Factura:
                            <Typography>
                                {data.folioFactura!='NA'?data.folioFactura:'No Aplica'}
                            </Typography>
                        </Typography>
                    </Grid>
                    <Grid item xs={9}>
                    </Grid>
                    <Grid item xs={3}>
                        <Typography style={{fontWeight: "bold", display: "flex", alignItems: "center"}}>
                            Estatus Factura:
                            <Typography>
                                {data.estatusFactura!='NA'?data.estatusFactura:'No Aplica'}
                            </Typography>
                        </Typography>
                    </Grid>
                    <Grid item xs={3}>
                        <FormControlLabel disabled style={{padding:"0px !important"}}
                                          control={<Checkbox
                                              checked={!data.m_bEntregaSucursal}
                                              name="tieneEntregaDomicilio"/>}
                                          label="Tiene entrega a domicilio"/>
                    </Grid>
                    <Grid item xs={3}>
                        <FormControlLabel disabled style={{padding:"0px !important"}}
                                          control={<Checkbox
                                              checked={data.m_bRecoleccionConCita}
                                              name="tieneCita"/>}
                                          label="Tiene cita para recolección"/>
                    </Grid>
                    <Grid item xs={3}>
                        <FormControlLabel disabled style={{padding:"0px !important"}}
                                          control={<Checkbox
                                              checked={data.m_bEmbarqueConCita}
                                              name="tieneCita"/>}
                                          label="Tiene cita para entrega"/>
                    </Grid>
                    <Grid item xs={3}>
                        <FormControlLabel disabled style={{padding:"0px !important"}}
                                          control={<Checkbox
                                              checked={data.m_bEntregaSucursal}
                                              name="tieneEntreaSucursal"/>}
                                          label="Tiene entrega en sucursal"/>
                    </Grid>
                </Grid>
            </div>
        );
    }
}

InformacionBasica.propTypes = {};

export default InformacionBasica;
