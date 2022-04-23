import React, {useEffect, useState} from 'react';
import logo from '../../iconos/LogoGM.png';
import axios from "axios";

import { makeStyles } from '@material-ui/core/styles';
import {List, ListItem, ListItemText, Collapse, Button, Paper} from '@material-ui/core';
import ExpandLess from '@material-ui/icons/ExpandLess';
import ExpandMore from '@material-ui/icons/ExpandMore';
import InformacionPaquete from './InformacionPaquete';
import DetallesSeguimiento from './DetallesSeguimiento';
import InformacionEntrega from "./InformacionEntrega";
import {API_HEADERS} from "../../Constants";
import {obtenerInformeFolioTipo} from "../../Util/Contexts/SeguimientoContext";
import TrackingEmail from "./TrackingEmail";
const headers = {
    //'Accept': 'application/vnd.certuit-' + API_VERSION + '+json',
    'Content-Type': 'application/json',
};
const useStyles = makeStyles((theme) => ({
    root: {
      width: '100%',
      maxWidth: 360,
      backgroundColor: theme.palette.background.paper,
      display: 'inline'
    },
    heading:{
        backgroundColor: theme.palette.primary.main,
        padding: '3px'
    },
    image:{
        height: '40px'
    },
    listItem:{
        backgroundColor: theme.palette.secondary.main,
        color: 'white',
        marginTop: '8px',
        '&:hover': {
            backgroundColor: theme.palette.secondary.main,
            color: 'white',
        }
    },
    collapseArrow:{
        backgroundColor: theme.palette.primary.main,
        width: 25,
        height: 25,
        borderRadius: 25
    }
  }));

export default function Tracking(...props){
    // console.log(entrega);
    const classes = useStyles();

    const [guia, setGuia] = useState({})

    useEffect(value =>{
        const { match: { params } } = props[0];
        handleShowConsultar( params.id, params.rfc)
    }, []);

    function handleShowConsultar(id,rfc) {
        headers.RFC = rfc
        obtenerInformeFolioTipo(id, 5, headers).then(({data}) => {
            setGuia(data)
        })


    }

    return(
        <div>
            <header className={classes.heading}>
                <img className={classes.image} src={logo}/>
            </header>
            <div className="widget-wrap" style={{margin:10}}>
                <Paper elevation={1} style={{height:"100%"}}>
                    <TrackingEmail data={guia}/>

                </Paper>
            </div>
        </div>
    )
}