import React, {Component} from 'react';
import {Checkbox, FormControlLabel, Grid, Typography} from "@mui/material";
import TextField from "@mui/material/TextField";

class InformacionViajes extends Component {
    constructor(props) {
        super(props);
    }

    componentDidMount() {
    }

    render() {
        const {data} = this.props
        return (
            <div>
                <Grid container direction="row" spacing={1}>
                    <Grid item sm={12} md={12}>
                        <Typography variant={"h4"} align={"center"} style={{marginBottom: "5px", fontWeight:"bold"}}>
                            Información de viajes
                        </Typography>
                    </Grid>
                    <Grid item sm={3} md={3}>
                        <Typography style={{fontWeight: "bold", display: "flex", alignItems: "center", fontSize: "1.1em"}}>
                            Viaje de unidad (Paquetería):&nbsp;
                            <Typography style={{fontSize: "1.1em"}}> {data.m_sViajePQ}</Typography>
                        </Typography>
                    </Grid>
                    <Grid item sm={3} md={3}>
                        <Typography style={{fontWeight: "bold", display: "flex", alignItems: "center", fontSize: "1.1em"}}>
                            Viaje de unidad (ERP):&nbsp;
                            <Typography style={{fontSize: "1.1em"}}> {data.m_sViajeERP}</Typography>
                        </Typography>
                    </Grid>
                    <Grid item sm={3} md={3}>
                        <Typography style={{fontWeight: "bold", display: "flex", alignItems: "center", fontSize: "1.1em"}}>
                            Liquidación:&nbsp;
                            <Typography style={{fontSize: "1.1em"}}> {data.m_sLiquidacion}</Typography>
                        </Typography>
                    </Grid>
                    <Grid item sm={3} md={3}>
                        <Typography style={{fontWeight: "bold", display: "flex", alignItems: "center", fontSize: "1.1em"}}>
                            Fecha de Liquidación:&nbsp;
                            <Typography style={{fontSize: "1.1em"}}> {data.m_sFechaLiquidacion}</Typography>
                        </Typography>
                    </Grid>
                </Grid>
            </div>
        );
    }
}

InformacionViajes.propTypes = {};

export default InformacionViajes;
