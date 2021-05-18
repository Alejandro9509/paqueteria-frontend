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
    },
    h3:{
        margin: 0
    }
}));

export default function InformacionEntrega(props){
    console.log(props.entrega);
    const classes = useStyles();
    const destinationAddress = props.entrega.destinationAddress;
    const id = props.entrega.id;
    const date = props.entrega.date;
    const serviceType = props.entrega.serviceType;

    return(
        <div>
            <h3>Dirección de entrega</h3>
            <span className={classes.labelContainer}>{destinationAddress}</span>
            <h3>Detalle de Envío</h3>
            <div className={classes.detailsContainer}>
                <div className={classes.labelContainer}><span className={classes.label}>Folio: </span><span>{id}</span></div>
                <div className={classes.labelContainer}><span className={classes.label}>Fecha: </span><span>{date}</span></div>
                <div className={classes.labelContainer}><span className={classes.label}>Tipo de servicio: </span><span>{serviceType}</span></div>
            </div>
            
        </div>
    )
}

