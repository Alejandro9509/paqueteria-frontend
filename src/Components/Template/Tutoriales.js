import React, {useEffect, useState, useMemo,} from "react";
import {
    DialogContent,
    Dialog,
    DialogActions,
    DialogTitle,
    Grid, Chip
} from "@mui/material";
import Noty from "noty";
import { styled } from '@mui/material/styles';
import makeStyles from '@mui/styles/makeStyles';
import Typography from '@mui/material/Typography';
import CATALOGOS from '../../Files/Tutoriales/Paqueteria/Paqueteria - 1 - CATALOGOS.pdf';
import TARIFARIO from '../../Files/Tutoriales/Paqueteria/Paqueteria - 2 - TARIFARIO.pdf';
import CONVENIOS from '../../Files/Tutoriales/Paqueteria/Paqueteria - 3 - CONVENIOS.pdf';
import RECOLECCION from '../../Files/Tutoriales/Paqueteria/Paqueteria - 4 - RECOLECCION.pdf';
import EMBARQUE from '../../Files/Tutoriales/Paqueteria/Paqueteria - 5 - EMBARQUE.pdf';
import GUIAS from '../../Files/Tutoriales/Paqueteria/Paqueteria - 6 - GUIAS.pdf';
import INFORMES from '../../Files/Tutoriales/Paqueteria/Paqueteria - 7 - INFORMES.pdf';
import VIAJES from '../../Files/Tutoriales/Paqueteria/Paqueteria - 8 - VIAJES.pdf';
import ULTIMAMILLA from '../../Files/Tutoriales/Paqueteria/Paqueteria - 9 - ULTIMA MILLA.pdf';
import APPMOVIL from '../../Files/Tutoriales/Paqueteria/Paqueteria - 10 - APP MOVIL.pdf';
import ESCANER from '../../Files/Tutoriales/Paqueteria/Paqueteria - 11 - Escaner.pdf';
import CORTEDECAJA from '../../Files/Tutoriales/Paqueteria/Paqueteria - 12 - Corte de Caja.pdf';
// import useDrivePicker from 'react-google-drive-picker';
import IconButton from '@mui/material/IconButton';
import iconoAyuda from '../../iconos/Cabecera/icono_ayuda.svg';
import Cabecera from "../../Components/Template/Cabecera";
import BarraLateralDerecha from "../../Components/Template/BarraLateralIzquierda";
import { fontSize } from "@mui/system";
import Box from '@mui/material/Box';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import Divider from '@mui/material/Divider';
import Link from '@mui/material/Link';
import pdficon from '@mui/icons-material/PictureAsPdfRounded';
import { Link2 } from 'react-router-dom';
import { circle } from "leaflet";

const PREFIX = 'Tutoriales';

const classes = {
    root: `${PREFIX}-root`,
    ol: `${PREFIX}-ol`,
    li: `${PREFIX}-li`
};

const Root = styled('div')({
    [`& .${classes.root}`]: {
      width: '100%',
      borderRadius: 5,
      /* backgroundColor: '#1a90ff', */
    },
    [`& .${classes.ol}`]: {
      fontSize: 20,
      marginTop: 50,
      listStyle: 'circle'
    },
    [`& .${classes.li}`]: {
        marginTop: 20,
    }
    
  });

let name = "Paqueteria - "
function Tutoriales(props) {

    const [state, setState] = useState({
        agregar: "Tutoriales",
        height: window.innerHeight,
    })

    /*const [openPicker, authResponse] = useDrivePicker();

    const handleOpenPicker = () => {
        openPicker({
          clientId: "gm.manuales@gmail.com",
          developerKey: "GMTrans0812",
          viewId: "DOCS",
          // token: token, // pass oauth token in case you already have one
          showUploadView: true,
          showUploadFolders: true,
          supportDrives: true,
          multiselect: true,
          // customViews: customViewsArray, // custom view
          callbackFunction: (data) => {
            if (data.action === 'cancel') {
              console.log('User clicked cancel/close button')
            }
            console.log(data)
          },
        })
      }*/

    /* useEffect(value => {
        console.log(props)
    }, [props.idSucursal]) */
    
    return (
        <Root>
            <header className="topbar clearfix">
                <Cabecera titulo="Tutoriales"></Cabecera>
            </header>
            <aside className="iconic-leftbar">
                <BarraLateralDerecha/>
            </aside>
            <section className="main-container">
               <div className="container-fluid">
                   <div className="widget-wrap">
                       <div className="widget-container">
                            <div className="widget-content">
                               <div className="row" style={{height: state.height - 100, width: '100%'}}>
                                    <div className="widget-header">
                                        <h2 style={{ fontSize: 30}}>Listado de Tutoriales </h2>
                                        
                                        
                                       {/*  <Box sx={{ width: '100%', maxWidth: 360, bgcolor: 'background.paper' }}>
                                            <nav aria-label="main mailbox folders">
                                                <List>
                                                    <ListItem disablePadding>
                                                        <ListItemIcon>
                                                            <pdficon>
                                                                <Link Link href={CATALOGOS} underline="hover"> 
                                                                    <ListItemText primary="Inbox" />     
                                                                </Link>
                                                            </pdficon>                                                 
                                                        </ListItemIcon>
                                                    </ListItem>
                                                </List>
                                            </nav>
                                        </Box> */}
                                        <ul className = {classes.ol}>
                                            <li className = {classes.li}><a href={CATALOGOS}><i/> {name} 1 - CATALOGOS.</a></li>
                                            <li className = {classes.li}><a href={TARIFARIO}><i/> {name} 2 - TARIFARIO.</a></li>
                                            <li className = {classes.li}><a href={CONVENIOS}><i/>  {name} 3 - CONVENIOS.</a></li>
                                            <li className = {classes.li}><a href={RECOLECCION}><i/> {name} 4 - RECOLECCION.</a></li>
                                            <li className = {classes.li}><a href={EMBARQUE}><i/> {name} 5 - EMBARQUE.</a></li>
                                            <li className = {classes.li}><a href={GUIAS}><i/> {name} 6 - GUIAS.</a></li>
                                            <li className = {classes.li}><a href={INFORMES}><i/> {name} 7 - INFORMES.</a></li>
                                            <li className = {classes.li}><a href={VIAJES}><i/> {name} 8 - VIAJES.</a></li>
                                            <li className = {classes.li}><a href={ULTIMAMILLA}><i/> {name} 9 - ULTIMAMILLA.</a></li>
                                            <li className = {classes.li}><a href={APPMOVIL}><i/>{name} 10 - APPMOVIL.</a></li>
                                            <li className = {classes.li}><a href={ESCANER}><i/>{name} 11 - ESCANER.</a></li>
                                            <li className = {classes.li}><a href={CORTEDECAJA}><i/>{name} 12 - CORTEDECAJA.</a></li>
                                        </ul>
                                    </div>
                              </div>
                            </div>
                       </div>
                   </div>
               </div>
           </section>
        </Root>
    );
}
export default Tutoriales;