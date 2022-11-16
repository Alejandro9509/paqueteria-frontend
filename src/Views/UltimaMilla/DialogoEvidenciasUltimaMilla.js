import React from 'react';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import DownloadIcon from '@material-ui/icons/GetAppRounded';

import {Grid} from "@material-ui/core";

export default function DialogoEvidenciasUltimaMilla(props) {
    const handleClose = () => {
        props.setCloseDialog(false);
    };

    const handleDownloadImage = (imageBase64) => {
        let a = document.createElement("a"); //Create <a>
        a.href = "data:image/png;base64," + imageBase64; //Image Base64 Goes here
        a.download = "Image.png"; //File name Here
        a.click();
    }

    return (
        <div>
            <Dialog
                open={props.open}
                onClose={handleClose}
                fullWidth
                maxWidth={"sm"}
            >
                <DialogTitle id="alert-dialog-title">{"Evidencias"}</DialogTitle>
                <DialogContent>
                    {/*<ImageList rowHeight={160} cols={2}>
                        {props.imagenes.map((item) => (
                            <ImageListItem key={item.m_sImagen} cols={1} style={{ height: 'auto' }}>
                                <img src={`data:image/jpeg;base64,${item.m_sImagen}`} alt={''} />
                            </ImageListItem>
                        ))}

                    </ImageList>*/}
                    <h4>Firma</h4>
                    {
                        props.imagenes.filter(i => parseInt(i.m_nTipoArchivo) === 2).length > 0 ?
                        <Grid item md={12}>
                            <div align={"center"}>
                                <img src={`data:image/jpeg;base64,${props.imagenes.find(i => parseInt(i.m_nTipoArchivo) === 2).m_sImagen}`} alt={''}/>
                            </div>
                        </Grid>
                            :
                            <span>No se adjuntó firma</span>
                    }
                    <h4>Evidencias</h4>
                    {
                        props.imagenes.filter(i => parseInt(i.m_nTipoArchivo) === 1 || parseInt(i.m_nTipoArchivo) === 3).length > 0 ?
                            props.imagenes.filter(i => parseInt(i.m_nTipoArchivo) === 1 || parseInt(i.m_nTipoArchivo) === 3).map((item) => (
                                <Grid item md={12}>

                                    <div style={{position: "relative"}}>
                                        <Button variant={"contained"} color={"primary"} onClick={() => handleDownloadImage(item.m_sImagen)} style={{position: "absolute"}}>
                                            <DownloadIcon fontSize={'large'} />
                                        </Button>
                                        <img style={{display: "block"}}
                                             src={`data:image/jpeg;base64,${item.m_sImagen}`} alt={''}/>


                                    </div>
                                </Grid>
                            ))
                            :
                            <span>No se adjuntaron evidencias</span>
                    }
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose} color="primary">
                        Cerrar
                    </Button>
                </DialogActions>
            </Dialog>
        </div>
    );
}