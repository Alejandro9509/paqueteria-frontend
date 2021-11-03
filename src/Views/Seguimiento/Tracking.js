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
    const [guiaData, setGuiaData] = React.useState({
        destinatario: "",
        folio: "",
        fechaEnvio: "",
        tipoServicio: '',
        paquetes: [],
        estatusGuia: 0
    });
    const [guia, setGuia] = useState({})

    useEffect(value =>{
        const { match: { params } } = props[0];
        handleShowConsultar(params.esRecoleccion, params.id, params.rfc)
    }, []);

    function handleShowConsultar(esRecoleccion,id,rfc) {
        headers.RFC = rfc
        const url = `${process.env.REACT_APP_API_URL}/GetParadasEsRecoleccion/${esRecoleccion}/${id}`;
        axios.get(url, { headers }).then(({data}) => {
            console.log(data)
            setGuia(data)
            let direccionDestino
            let direccionOrigen
            if(data.m_bEsRecoleccion){
                direccionOrigen = data.m_bRecoleccionDiferenteDomicilio ? data.m_sDomicilioDetalleRecoleccion : data.m_sDomicilioRemitente
            }
            else{
                direccionDestino = data.m_bEntregaDiferenteDomicilio ? data.m_sDomicilioDetalleEntrega : data.m_sDomicilioDestinatario
            }

            setGuiaData({
                destinatario: direccionDestino,
                folio: data.m_sFolio,
                fechaEnvio: data.m_dFechaRegistro,
                tipoServicio: data.m_sTipoServicio,
                paquetes: data.m_bEsRecoleccion? data.m_parrPaquetes : data.m_arrPaquetes,
                idEstatusGuia: data.m_nIdEstatusGuia,
                estatusGuia: data.m_sEstatusGuia
            })
        }).catch(function (err) {
            console.log(err.data)
        });

    }

    return(
        <div>
            <header className={classes.heading}>
                <img className={classes.image} src={logo}/>
            </header>
            <div className="widget-wrap" style={{margin:10}}>
                <Paper elevation={3} style={{paddingTop:30,paddingBottom:30,paddingLeft:200,paddingRight:200}}>
                    {/*<InformacionEntrega entrega={guiaData}/>*/}
                    {guia !== undefined &&
                        <DetallesSeguimiento guia={guia} estatusGuia={guiaData.estatusGuia}
                                          idEstatusGuia={guiaData.idEstatusGuia}/>}
                    {guia !== undefined &&
                        <InformacionEntrega entrega={guiaData} guia={guia}/>
                    }

                    {/*<List component="nav">
                        <ListItem
                            button
                            onClick={handleGuiaClick}
                            className={classes.listItem}>
                            <ListItemText
                                primary="Descripción Guía"/>
                            {openGuia ? <ExpandLess className={classes.collapseArrow} /> : <ExpandMore className={classes.collapseArrow} />}
                        </ListItem>
                        <Collapse
                            in={openGuia}
                            timeout="auto"
                            unmountOnExit>
                            <List component="div">
                                {
                                    guiaData.paquetes.map(
                                        p => (
                                            <ListItem key={p.m_nIdEmbarqueDetalle}>
                                                <InformacionPaquete package = {p}/>
                                            </ListItem>
                                        )
                                    )
                                }
                            </List>
                        </Collapse>
                        <ListItem
                            button
                            onClick={handleRastreoClick}
                            className={classes.listItem}>
                            <ListItemText
                                primary="Rastreo Envio" />
                            {openRastreo ? <ExpandLess className={classes.collapseArrow} /> : <ExpandMore className={classes.collapseArrow} />}
                        </ListItem>
                        <Collapse
                            in={openRastreo}
                            timeout="auto"
                            unmountOnExit>
                            <DetallesSeguimiento estatusGuia = {guiaData.estatusGuia}/>
                        </Collapse>
                    </List>*/}
                </Paper>
            </div>
        </div>
    )
}