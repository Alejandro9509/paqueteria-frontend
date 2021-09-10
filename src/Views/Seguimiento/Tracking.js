import React, { useEffect} from 'react';
import InformacionEntrega from './InformacionEntrega';
import logo from '../../iconos/LogoGM.png';
import axios from "axios";

import { makeStyles } from '@material-ui/core/styles';
import { List,ListItem, ListItemText, Collapse, Button } from '@material-ui/core';
import ExpandLess from '@material-ui/icons/ExpandLess';
import ExpandMore from '@material-ui/icons/ExpandMore';
import InformacionPaquete from './InformacionPaquete';
import DetallesSeguimiento from './DetallesSeguimiento';

const entrega = {
    destinationAddress: "C. Cerro de Las Campanas No.384, Insurgentes Oeste, 21280 Mexicali, B.C.",
    id: "FG-00001",
    date: "12-12-2020 12:00 pm",
    serviceType: "Unidad completa",
    packages: [
        {
            id: 1,
            weight: 100,
            large: 10,
            width: 14,
            height: 5,
            type: "Caja de madera",
            value: 1500.00,
            description: "Artículos de higiene personal",
            observation: "Los productos estan sellados correctamente y no presentan daños.",
            quantity: 1
        },
        {
            id: 2,
            weight: 200,
            large: 20,
            width: 24,
            height: 25,
            type: "Caja de madera",
            value: 2500.00,
            description: "Artículos de higiene personal",
            observation: "Los productos estan sellados correctamente y no presentan daños.",
            quantity: 2
        },
        {
            id: 3,
            weight: 300,
            large: 30,
            width: 34,
            height: 35,
            type: "Caja de madera",
            value: 3500.00,
            description: "Artículos de higiene personal",
            observation: "Los productos estan sellados correctamente y no presentan daños.",
            quantity: 3
        }
    ]
}

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
    const [openGuia, setOpenGuia] = React.useState(true);
    const [openRastreo, setOpenRastreo] = React.useState(true);
    const [guiaData, setGuiaData] = React.useState({
        destinatario: "",
        folio: "",
        fechaEnvio: "",
        tipoServicio: -1,
        paquetes: [],
        estatusGuia: 0
    });

    const headers = {
        'Content-Type': 'application/json'
    }
    
    useEffect(value =>{
        const { match: { params } } = props[0];
        handleShowConsultar(params.id)
    }, []);

    function handleShowConsultar(id) {
        const url = `${process.env.REACT_APP_API_URL}/Guia/GetById/` + id;
        axios.get(url, { headers }).then(({data}) => {
            console.log('data guia ',data)

            setGuiaData({
                ...guiaData,
                destinatario: data.m_sDomicilioDestinatario,
                folio: data.m_nFolioGuia,
                fechaEnvio: data.m_dFecha,
                tipoServicio: data.m_sTipoServicio,
                paquetes: data.m_arrClsDetalle,
                estatusGuia: data.m_nIdEstatusGuia
            })
        }).catch(function (err) {
            console.log(err.data)
        });   

    }

    const handleGuiaClick = () => {
        setOpenGuia(!openGuia);
      };

    const handleRastreoClick = () => {
        setOpenRastreo(!openRastreo);
    };
    return(
        <div>
            <header className={classes.heading}>
                <img className={classes.image} src={logo}/>
            </header>
            <div className="widget-wrap" style={{margin:10}}>
                <div className="widget-container">
                    <div className="widget-content">
                        <div className="row">
                            <InformacionEntrega entrega={guiaData}/>
                            <List component="nav">
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
                            </List>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}