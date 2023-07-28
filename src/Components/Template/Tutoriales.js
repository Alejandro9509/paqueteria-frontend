import React, {useEffect, useState, useMemo,} from "react";
import {
    DialogContent,
    Dialog,
    DialogActions,
    DialogTitle,
    Grid, Chip
} from "@material-ui/core";
import Noty from "noty";
import { makeStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import Box from '@material-ui/core/Box';
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
import useDrivePicker from 'react-google-drive-picker';
import IconButton from '@material-ui/core/IconButton';
import iconoAyuda from '../../iconos/Cabecera/icono_ayuda.svg';
import Cabecera from "../../Components/Template/Cabecera";
import BarraLateralDerecha from "../../Components/Template/BarraLateralIzquierda";

const useStyles = makeStyles({
    root: {
      width: '100%',
      borderRadius: 5,
      /* backgroundColor: '#1a90ff', */
    },
    
  });

function Tutoriales(props) {
    const classes = useStyles();
    const [state, setState] = useState({
        agregar: "Tutoriales",
        height: window.innerHeight,
    })

    const [openPicker, authResponse] = useDrivePicker();  

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
      }

    /* useEffect(value => {
        console.log(props)
    }, [props.idSucursal]) */
    
    return (
        <div>
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
                               <div className="row" style={{height: state.height - 250, width: '100%'}}>
                                    <div className="widget-header">
                                        <h2>Descargas: </h2> 
                                        <a href={'https://drive.google.com/drive/folders/1qhJ2qJGfpkehlCP4qZChjKZhRD1375Qh'} to={{pathname: "https://drive.google.com/drive/folders/1qhJ2qJGfpkehlCP4qZChjKZhRD1375Qh"}} target="_blank">
                                                    <IconButton /* aria-label="help" component={Link} to={{pathname: "/Tutoriales"}} */ >
                                                        <img src={iconoAyuda} style={{height: 40, width:40, margin: 10}}/>
                                                    </IconButton>
                                        </a>
                                        <button onClick={() => handleOpenPicker()}>Open Picker</button>
                                        <ul className="new-file-lists">
                                            <li><a href={CATALOGOS}><i className="fa fa-file-excel-o" /> CATALOGOS.pdf</a></li>
                                            <li><a href={TARIFARIO}><i className="fa fa-file-excel-o" /> TARIFARIO.pdf</a></li>
                                            <li><a href={CONVENIOS}><i className="fa fa-file-excel-o" /> CONVENIOS.pdf</a></li>
                                            <li><a href={RECOLECCION}><i className="fa fa-file-excel-o" /> RECOLECCION.pdf</a></li>
                                            <li><a href={EMBARQUE}><i className="fa fa-file-excel-o" /> EMBARQUE.pdf</a></li>
                                            <li><a href={GUIAS}><i className="fa fa-file-excel-o" /> GUIAS.pdf</a></li>
                                            <li><a href={INFORMES}><i className="fa fa-file-excel-o" /> INFORMES.pdf</a></li>
                                            <li><a href={VIAJES}><i className="fa fa-file-excel-o" /> VIAJES.pdf</a></li>
                                            <li><a href={ULTIMAMILLA}><i className="fa fa-file-excel-o" /> ULTIMAMILLA.pdf</a></li>
                                            <li><a href={APPMOVIL}><i className="fa fa-file-excel-o" /> APPMOVIL.pdf</a></li>
                                            <li><a href={ESCANER}><i className="fa fa-file-excel-o" /> ESCANER.pdf</a></li>
                                            <li><a href={CORTEDECAJA}><i className="fa fa-file-excel-o" /> CORTEDECAJA.pdf</a></li>
                                        </ul>
                                    </div>
                              </div>
                            </div>
                       </div>
                   </div>
               </div>
           </section>
        </div>
    )
}
export default Tutoriales;