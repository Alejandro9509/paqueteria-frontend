import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import {Paper} from "@material-ui/core";


const useStyles = makeStyles((theme) =>({
    labelContainer:{
        margin: 5
    },
    label:{
        color: theme.palette.primary.main
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
        <Paper style={{margin:'20px', paddingLeft:'30px',paddingTop:'20px',paddingBottom:'30px'}}>
            <h3 className={classes.label}>Dirección de entrega</h3>
            <span className={classes.labelContainer}>{destinatario}</span>
            <h3 className={classes.label}>Detalle de Envío</h3>
            <div className={classes.detailsContainer}>
                <div className={classes.labelContainer}>
                    <span className={classes.label}>Folio: </span><br/><br/>
                    {folio}
                </div>
                <div className={classes.labelContainer}>
                    <span className={classes.label}>Fecha: </span><br/><br/>
                    {fecha}
                </div>
                <div className={classes.labelContainer}>
                    <span className={classes.label}>Tipo de servicio: </span><br/><br/>
                    <span>{tipoServicio}</span>
                </div>

            </div>
            
        </Paper>
    )
}

