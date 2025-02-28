import React from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import DownloadIcon from '@mui/icons-material/GetAppRounded';

import {Grid} from "@mui/material";

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
                                    <img src={`data:image/jpeg;base64,${props.imagenes.find(i => parseInt(i.m_nTipoArchivo) === 2).m_sImagen}`}
                                         alt={''}
                                         style={{width: "560px", height: "380px",marginBottom:"10px",paddingRight:"15px" ,display: "block"}}/>
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
                                        <Button variant={"contained"} color={"primary"}
                                                onClick={() => handleDownloadImage(item.m_sImagen)}
                                                style={{position: "absolute"}}>
                                            <DownloadIcon fontSize={'large'} />
                                        </Button>
                                        <img style={{width: "auto", height: "auto", minHeight: "500px",
                                            paddingBottom:"20px", paddingRight:"15px", display: "block"}}
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