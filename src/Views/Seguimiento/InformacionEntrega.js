import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import {Grid, Paper} from "@material-ui/core";


const useStyles = makeStyles((theme) =>({
    labelContainer:{
        margin: 5
    },
    label:{
        fontSize: '25px',
        color: theme.palette.primary.main
    },
    subtitle:{
        // color: theme.palette.primary.main,
        fontSize: '35px'
    },
    detailsContainer: {
        display: 'flex',
        flexDirection: 'row'
    }
}));

export default function InformacionEntrega(props){
    console.log(props.entrega);
    const classes = useStyles();
    const destinatario = props.entrega.destinatario;
    const folio = props.entrega.folio;
    const fecha = props.entrega.fechaEnvio;
    const tipoServicio = props.entrega.tipoServicio;

    return(
        // <Paper style={{margin:'20px', paddingLeft:'30px',paddingTop:'20px',paddingBottom:'30px'}}>
        <div style={{margin:'20px', paddingLeft:'30px',paddingTop:'20px'}}>
            <h3 className={classes.subtitle} style={{}}>Dirección de destino</h3>
            <span className={classes.labelContainer}>{destinatario}</span>
            <h3 className={classes.subtitle}>Detalle de Envío</h3>

            <Grid container spacing={2}>
                <Grid item xs={2}>
                    <p style={{fontSize: '20px'}}><span className={classes.label}>Folio: </span>{folio}</p>
                </Grid>
                <Grid item xs={2}>
                    <p style={{fontSize: '20px'}}> <span className={classes.label}>Fecha: </span>{fecha}</p>
                </Grid>
                <Grid item xs={3}>
                    <p style={{fontSize: '20px'}}><span className={classes.label}>Tipo de servicio: </span>{tipoServicio}</p>
                </Grid>
            </Grid>

            
        </div>

    )
}

