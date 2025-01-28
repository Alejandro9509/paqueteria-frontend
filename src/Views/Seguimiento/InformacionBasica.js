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
                        <Typography style={{fontWeight: "bold", display: "flex", alignItems: "center", fontSize: "1.1em"}}>
                            Folio seguimiento:&nbsp;
                            <Typography style={{fontSize: "1.1em"}}> {data.m_sFolio}</Typography>
                        </Typography>
                    </Grid>
                    <Grid item xs={3}>
                        <Typography style={{fontWeight: "bold", display: "flex", alignItems: "center", fontSize: "1.1em"}}>
                            Fecha de registro:&nbsp;
                            <Typography style={{fontSize: "1.1em"}}>
                                {data.m_dFechaRegistro} {data.m_tHoraRegistro}
                            </Typography>
                        </Typography>
                    </Grid>
                    <Grid item xs={3}>
                        <Typography style={{fontWeight: "bold", display: "flex", alignItems: "center", fontSize: "1.1em"}}>
                            Cliente:&nbsp;
                            <Typography style={{fontSize: "1.1em"}}>
                                {data.m_sNombreResponsablePago}
                            </Typography>
                        </Typography>
                    </Grid>
                    <Grid item xs={3}>
                        <Typography style={{fontWeight: "bold", display: "flex", alignItems: "center", fontSize: "1.1em"}}>
                            Núm. de seguimiento:&nbsp;
                            <Typography style={{fontSize: "1.1em"}}>
                                {data.m_sTracking}
                            </Typography>
                        </Typography>
                    </Grid>
                    <Grid item xs={3}>
                        <Typography style={{fontWeight: "bold", display: "flex", alignItems: "center", fontSize: "1.1em"}}>
                            Tipo seguro:&nbsp;
                            <Typography style={{fontSize: "1.1em"}}>
                                {data.m_sTipoSeguro}
                            </Typography>
                        </Typography>
                    </Grid>
                    <Grid item xs={3}>
                        <Typography style={{fontWeight: "bold", display: "flex", alignItems: "center", fontSize: "1.1em"}}>
                            Estatus:&nbsp;
                            <Typography style={{fontSize: "1.1em"}}>
                                {data.m_sEstatus}
                            </Typography>
                        </Typography>
                    </Grid>
                    <Grid item xs={3}>
                        <Typography style={{fontWeight: "bold", display: "flex", alignItems: "center", fontSize: "1.1em"}}>
                            Registrada por:&nbsp;
                            <Typography style={{fontSize: "1.1em"}}>
                                {data.m_sRegistradaPor}
                            </Typography>
                        </Typography>
                    </Grid>
                    <Grid item xs={3}>
                        <Typography style={{fontWeight: "bold", display: "flex", alignItems: "center", fontSize: "1.1em"}}>
                            Estatus Pago:&nbsp;
                            <Typography style={{fontSize: "1.1em"}}>
                                {data.m_sTipoCobro}
                            </Typography>
                        </Typography>
                    </Grid>

                    <Grid item xs={3}>
                        <Typography style={{fontWeight: "bold", display: "flex", alignItems: "center", fontSize: "1.1em"}}>
                            Valor declarado:&nbsp;
                            <Typography style={{fontSize: "1.1em"}}>
                                ${data.m_xValorDeclarado}
                            </Typography>
                        </Typography>
                    </Grid>
                    <Grid item xs={3}>
                        <Typography style={{fontWeight: "bold", display: "flex", alignItems: "center", fontSize: "1.1em"}}>
                            Recibió:&nbsp;
                            <Typography style={{fontSize: "1.1em"}}>
                                {data.m_sReceptor=='null'?'No Aplica':data.m_sReceptor}
                            </Typography>
                        </Typography>
                    </Grid>
                    <Grid item xs={3}>
                        <Typography style={{fontWeight: "bold", display: "flex", alignItems: "center", fontSize: "1.1em"}}>
                            Entregó Guía:&nbsp;
                            <Typography style={{fontSize: "1.1em"}}>
                                {data.operadorEntrega?data.operadorEntrega:'No Aplica'}
                            </Typography>
                        </Typography>
                    </Grid>
                    <Grid item xs={3}>
                        <Typography style={{fontWeight: "bold", display: "flex", alignItems: "center", fontSize: "1.1em"}}>
                            Factura:&nbsp;
                            <Typography style={{fontSize: "1.1em"}}>
                                {data.folioFactura!='NA'?data.folioFactura:'No Aplica'}
                            </Typography>
                        </Typography>
                    </Grid>
                    <Grid item xs={9}>
                    </Grid>
                    <Grid item xs={3}>
                        <Typography style={{fontWeight: "bold", display: "flex", alignItems: "center", fontSize: "1.1em"}}>
                            Estatus Factura:&nbsp;
                            <Typography style={{fontSize: "1.1em"}}>
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
