import React from 'react';
import { makeStyles } from "@material-ui/core/styles";
import theme from '../../Assets/themes/default'
import {Grid, Paper} from "@material-ui/core";

const useStyles = makeStyles((theme) => ({
    attribute: {
        marginRight: 10,
        display: 'inline-block'
    },
    title:{
        fontWeight: 'bold'
    },
    id: {
        color: theme.palette.primary.main,
        fontWeight: 'bold',
        fontStyle: 'italic'
    },
    divider: {
        maginTop: 20,
        height: 3,
        backgroundColor: theme.palette.primary.main
    },
    label:{
        color: theme.palette.primary.main
    },
}));

export default function InformacionPaquete(props){
    console.log(props.package);
    const classes = useStyles();
    const producto = props.package.m_sProducto;
    const weight = props.package.m_xPeso;
    const large = props.package.m_xLargo;
    const width = props.package.m_xAncho;
    const height = props.package.m_xAlto;
    const type = props.package.m_sEmbalaje;
    const value = props.package.m_cValorDeclarado;
    const description = props.package.m_sDescripcion;
    const observation = props.package.m_sObservaciones;
    const quantity = props.package.ctd;

    return(
        <Paper elevation={0}>
            <Grid container style={{margin:'30px'}}>
                <Grid item xs={12} >
                    <span className={classes.label}>Producto:</span><br/><br/>
                    <span>{producto}</span>
                </Grid>
                <Grid item xs={12} style={{height: '20px'}}/>
                <Grid item xs={2}>
                    <span className={classes.label}>Peso</span><br/><br/>
                    <span>{weight} kg</span>
                </Grid>
                <Grid item xs={2}>
                    <span className={classes.label}>Largo</span><br/><br/>
                    <span>{large} cms</span>
                </Grid>
                <Grid item xs={2}>
                    <span className={classes.label}>Ancho</span><br/><br/>
                    <span>{width} cms</span>
                </Grid>
                <Grid item xs={2}>
                    <span className={classes.label}>Alto</span><br/><br/>
                    <span>{height} cms</span>
                </Grid>
                <Grid item xs={2}>
                    <span className={classes.label}>Tipo de Embalaje</span><br/><br/>
                    <span>{type}</span>
                </Grid>

                <Grid item xs={12} style={{height: '20px'}}/>
                <Grid item xs={3}>
                    <span className={classes.label}>Valor</span><br/><br/>
                    <span>{value ? value : "No declarado"}</span>
                </Grid>
                <Grid item xs={3}>
                    <span className={classes.label}>Descripción</span><br/><br/>
                    <span>{description}</span>
                </Grid>
                <Grid item xs={3}>
                    <span className={classes.label}>Observación</span><br/><br/>
                    <span>{observation ? observation : "No especificado" }</span>
                </Grid>
                <Grid item xs={3}>
                    <span className={classes.label}>Ctd</span><br/><br/>
                    <span>{quantity}</span>
                </Grid>
            </Grid>
            <Grid item xs={12} className={classes.divider}/>
        </Paper>
    )
}