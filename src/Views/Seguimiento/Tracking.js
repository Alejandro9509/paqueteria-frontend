import React from 'react';
import InformacionEntrega from './InformacionEntrega';
import logo from '../../iconos/LogoGM.png';
import theme from '../../Assets/themes/default'

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
    },
    nested: {
      paddingLeft: theme.spacing(4),
    },
  }));

const styles ={
    heading:{
        backgroundColor: theme.palette.primary.main,
        padding: '3px'
    },
    image:{
        height: '40px'
    },
    container:{
        margin: '10px'
    },
    listItem:{
        backgroundColor: theme.palette.secondary.main,
        color: 'white',
        marginTop: '8px'
    },
    collapseArrow:{
        backgroundColor: theme.palette.primary.main,
        width: 25,
        height: 25,
        borderRadius: 25
    }
}

export default function Tracking(){
    console.log(entrega);
    const classes = useStyles();
    const [openGuia, setOpenGuia] = React.useState(true);
    const [openRastreo, setOpenRastreo] = React.useState(true);

    const handleGuiaClick = () => {
        setOpenGuia(!openGuia);
      };

    const handleRastreoClick = () => {
        setOpenRastreo(!openRastreo);
    };
    return(
        <div>
            <header style={styles.heading}>
                <img style={styles.image} src={logo}></img>
            </header>
            <div className="widget-wrap" style={styles.container}>
                <InformacionEntrega entrega = {entrega}/>
                <List
                    component="nav"
                    className={classes.root}
                    style={{display: 'inline'}}
                    >
                    <ListItem button onClick={handleGuiaClick} style={styles.listItem}>
                        <ListItemText primary="Descripción Guía"/>
                        {openGuia ? <ExpandLess style={styles.collapseArrow} /> : <ExpandMore style={styles.collapseArrow} />}
                    </ListItem>
                    <Collapse in={openGuia} timeout="auto" unmountOnExit>
                        <List component="div" disablePadding>{
                        entrega.packages.map(
                            p => (
                            <ListItem className={classes.nested}>
                                <InformacionPaquete package = {p} className={classes.nested}/>
                            </ListItem>
                            )
                        )
                        }
                        </List>
                    </Collapse>
                    <ListItem button onClick={handleRastreoClick} style={styles.listItem}>
                        <ListItemText primary="Rastreo Envio" />
                        {openRastreo ? <ExpandLess style={styles.collapseArrow} /> : <ExpandMore style={styles.collapseArrow} />}
                    </ListItem>
                    <Collapse in={openRastreo} timeout="auto" unmountOnExit>
                        <List component="div" disablePadding>{
                            <DetallesSeguimiento/>
                        }
                        </List>
                    </Collapse>
                    </List>
            </div>
        </div>
    )
}