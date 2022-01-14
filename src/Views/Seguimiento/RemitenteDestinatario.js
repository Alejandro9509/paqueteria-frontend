import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {Grid, Typography} from "@material-ui/core";

class RemitenteDestinatario extends Component {
    constructor(props) {
        super(props);
    }


    componentDidMount() {

    }

    render() {
         const {data} = this.props
        return (
            <Grid container direction="row"  >
                <Grid item sm={12} md={6}>
                    <Grid container spacing={1}  >
                        <Grid item md={12}>
                            <Typography variant={"h4"} style={{alignItems: "center", width:"100%"}}>Remitente </Typography>
                        </Grid>
                        <Grid item md={8}>
                            <Typography style={{fontWeight: "bold", display: "flex", alignItems: "center"}}>Nombre: <Typography>{data.m_sNombreRemitente}</Typography></Typography>
                        </Grid>
                        <Grid item md={4}>
                            <Typography style={{fontWeight: "bold", display: "flex", alignItems: "center"}}>Contacto: <Typography>{data.m_sContactoRemitente}</Typography></Typography>
                        </Grid>
                        <Grid item md={8}>
                            <Typography style={{fontWeight: "bold", display: "flex", alignItems: "center"}}>Dirección: <Typography>{data.m_sDomicilioRemitente}</Typography></Typography>
                        </Grid>
                        <Grid item md={4}>
                            <Typography style={{fontWeight: "bold", display: "flex", alignItems: "center"}}>Teléfono: <Typography>{data.m_sTelefonoRemitente}</Typography></Typography>
                        </Grid>

                    </Grid>
                </Grid>
                <Grid item sm={12} md={6}>
                    <Grid container spacing={1}  >
                        <Grid item md={12}>
                            <Typography variant={"h4"}  style={{ alignItems: "center", width:"100%"}}>Destinatario </Typography>
                        </Grid>
                        <Grid item md={8}>
                            <Typography style={{fontWeight: "bold", display: "flex", alignItems: "center"}}>Nombre: <Typography>{data.m_sNombreDestinatario}</Typography></Typography>
                        </Grid>
                        <Grid item md={4}>
                            <Typography style={{fontWeight: "bold", display: "flex", alignItems: "center"}}>Contacto: <Typography>{data.m_sContactoDestinatario}</Typography></Typography>
                        </Grid>
                        <Grid item md={8}>
                            <Typography style={{fontWeight: "bold", display: "flex", alignItems: "center"}}>Dirección: <Typography>{data.m_sDomicilioDestinatario}</Typography></Typography>
                        </Grid>
                        <Grid item md={4}>
                            <Typography style={{fontWeight: "bold", display: "flex", alignItems: "center"}}>Teléfono: <Typography>{data.m_sTelefonoDestinatario}</Typography></Typography>
                        </Grid>
                    </Grid>
                </Grid>
            </Grid>
        );
    }
}

RemitenteDestinatario.propTypes = {};

export default RemitenteDestinatario;
