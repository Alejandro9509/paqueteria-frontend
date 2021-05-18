import React from 'react';
import { makeStyles } from '@material-ui/core/styles';


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
    const fecha = props.entrega.fecha;
    const tipoServicio = props.entrega.tipoServicio;

    return(
        <div>
            <h3>Dirección de entrega</h3>
            <span className={classes.labelContainer}>{destinatario}</span>
            <h3>Detalle de Envío</h3>
            <div className={classes.detailsContainer}>
                <div className={classes.labelContainer}><span className={classes.label}>Folio: </span><span>{folio}</span></div>
                <div className={classes.labelContainer}><span className={classes.label}>Fecha: </span><span>{fecha}</span></div>
                <div className={classes.labelContainer}><span className={classes.label}>Tipo de servicio: </span><span>{tipoServicio}</span></div>
            </div>
            
        </div>
    )
}

