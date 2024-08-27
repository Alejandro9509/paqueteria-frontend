import React, {useEffect, useState} from 'react';
import logo from '../../iconos/LogoGM.png';
import axios from "axios";

import { styled } from '@mui/material/styles';
import makeStyles from '@mui/styles/makeStyles';
import {List, ListItem, ListItemText, Collapse, Button, Paper} from '@mui/material';
import ExpandLess from '@mui/icons-material/ExpandLess';
import ExpandMore from '@mui/icons-material/ExpandMore';
import {API_HEADERS} from "../../Constants";
import {obtenerInformeFolioTipo} from "../../Util/Contexts/SeguimientoContext";
import TrackingEmail from "./TrackingEmail";
const PREFIX = 'Tracking';

const classes = {
    root: `${PREFIX}-root`,
    heading: `${PREFIX}-heading`,
    image: `${PREFIX}-image`,
    listItem: `${PREFIX}-listItem`,
    collapseArrow: `${PREFIX}-collapseArrow`
};

const Root = styled('div')((
    {
        theme
    }
) => ({
    [`& .${classes.root}`]: {
      width: '100%',
      maxWidth: 360,
      backgroundColor: theme.palette.background.paper,
      display: 'inline'
    },

    [`& .${classes.heading}`]: {
        backgroundColor: theme.palette.primary.main,
        padding: '3px'
    },

    [`& .${classes.image}`]: {
        height: '40px'
    },

    [`& .${classes.listItem}`]: {
        backgroundColor: theme.palette.secondary.main,
        color: 'white',
        marginTop: '8px',
        '&:hover': {
            backgroundColor: theme.palette.secondary.main,
            color: 'white',
        }
    },

    [`& .${classes.collapseArrow}`]: {
        backgroundColor: theme.palette.primary.main,
        width: 25,
        height: 25,
        borderRadius: 25
    }
}));

const headers = {
    //'Accept': 'application/vnd.certuit-' + API_VERSION + '+json',
    'Content-Type': 'application/json',
};

export default function Tracking(...props){
    // console.log(entrega);


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

    return (
        <Root>
            <header className={classes.heading}>
                <img className={classes.image} src={logo}/>
            </header>
            <div className="widget-wrap" style={{margin:10}}>
                <Paper elevation={1} style={{height:"100%"}}>
                    <TrackingEmail data={guia}/>

                </Paper>
            </div>
        </Root>
    );
}