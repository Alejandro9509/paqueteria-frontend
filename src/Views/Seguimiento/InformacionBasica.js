import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {Grid, TextField, Typography} from "@material-ui/core";

class InformacionBasica extends Component {
    constructor(props) {
        super(props);
    }


    componentDidMount() {

    }

    render() {
        const {data} = this.props
        return (<div>
            <Grid container spacing={2} alignItems={"flex-start"} justify={"flex-start"}>
                <Grid item>
                    <Typography style={{fontWeight: "bold", display: "flex", alignItems: "center"}}>Folio
                        seguimiento: <Typography> {data.m_sFolio}</Typography></Typography>
                </Grid>
                <Grid item>
                    <Typography style={{fontWeight: "bold", display: "flex", alignItems: "center"}}>Fecha de
                        registro: <Typography> {data.m_dFechaRegistro}</Typography></Typography>
                </Grid>
                <Grid item>
                    <Typography style={{fontWeight: "bold", display: "flex", alignItems: "center"}}>Cliente: <Typography>{data.m_sNombreResponsablePago}</Typography></Typography>
                </Grid>
                <Grid item>
                    <Typography style={{fontWeight: "bold", display: "flex", alignItems: "center"}}>Tipo seguro: <Typography>FG0005</Typography></Typography>
                </Grid>
                <Grid item>
                    <Typography style={{fontWeight: "bold", display: "flex", alignItems: "center"}}>Estatus: <Typography>{data.m_sEstatus}</Typography></Typography>
                </Grid>
                <Grid item>
                    <Typography style={{fontWeight: "bold", display: "flex", alignItems: "center"}}>Registrada por: <Typography>FG0005</Typography></Typography>
                </Grid>
                <Grid item>
                    <Typography style={{fontWeight: "bold", display: "flex", alignItems: "center"}}>Estatus Pago: <Typography>FG0005</Typography></Typography>
                </Grid>

                <Grid item>
                    <Typography style={{fontWeight: "bold", display: "flex", alignItems: "center"}}>Valor declarado: <Typography>FG0005</Typography></Typography>
                </Grid>




            </Grid>
        </div>);
    }
}

InformacionBasica.propTypes = {};

export default InformacionBasica;
