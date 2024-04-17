import {Box, Button, Grid, Typography} from '@mui/material'
import React, {useEffect, useState} from 'react'
import {obtenerImagenEvidencia} from '../Util/Contexts/UltimaMillaContext'
import DialogoEvidenciasUltimaMilla from "./UltimaMilla/DialogoEvidenciasUltimaMilla";

function Evidencias(props) {
    const {esRecoleccion, idGuia} = props
    const [imagenesEvidencias, setImagenesEvidencias] = useState([])
    const [openDialogEvidencias, setOpenDialogEvidencias] = useState(false)

    useEffect(value => {
        obtenerImagenEvidencia(idGuia, esRecoleccion).then(respuestaRec => {
            setImagenesEvidencias(respuestaRec.data ? respuestaRec.data : [])
        })
    }, [idGuia])

    const handleClickCloseDialogoEvidencia = (openDialog) => {
        setOpenDialogEvidencias(openDialog)
    }
    const handleClickOpenDialogoEvidencia = (openDialog) => {
        setOpenDialogEvidencias(openDialog)
    }
    return (
        <div style={{margin: "0 auto"}}>

            { (openDialogEvidencias) &&
                <DialogoEvidenciasUltimaMilla
                    open={openDialogEvidencias}
                    setCloseDialog={handleClickCloseDialogoEvidencia}
                    imagenes={imagenesEvidencias}
                />
            }
            <Grid container>
                {
                    esRecoleccion ?
                        // imagenesEvidencias.find(i => parseInt(i.m_nTipoArchivo) === 1) !== undefined &&
                        <Grid item md={12}>
                            <div id="divRecoleccion">
                                Entregó: {props.data.receptorRecoleccion}
                                <Button fullWidth variant="text" color="primary" onClick={() => handleClickOpenDialogoEvidencia(true)}>
                                    Ver evidencias de recolección
                                </Button>
                                {/*<img style={{width: "180px", height: "180px",margin: "0 0 0 -10px",marginBottom:"10px",outline:"solid 1px black"}}
                                                     src={`data:image/jpeg;base64,${imagenesEvidencias.find(i => parseInt(i.m_nTipoArchivo) === 1).m_sImagen}`}/>*/}
                                {/*{imagenesEvidencias.reverse().map((img, index) => (
                                    <img style={{
                                        width: "180px",
                                        height: "180px",
                                        margin: "0 0 0 -10px",
                                        marginBottom: "10px",
                                        outline: "solid 1px black"
                                    }}
                                         src={`data:image/jpeg;base64,${img.m_sImagen}`} key={index}/>))
                                }
                                Entregó: {props.data.receptorRecoleccion}*/}
                            </div>
                        </Grid>
                        :
                        <Grid item md={12}>
                            <div id="divEmbarque">
                                Entregó Guía: {props.data.operadorEntrega} <br/>
                                Recibió: {props.data.receptorGuia=='NULL'?'':props.data.receptorGuia}<br/>
                                {props.data.tipoEntrega=='OCURRE'?('Comentarios: '+ props.data.m_sComentariosOcurre):null}
                                <Button fullWidth variant="text" color="primary"
                                        onClick={() => handleClickOpenDialogoEvidencia(true)}>
                                    Ver evidencias de entrega
                                </Button>
                                {/*<img style={{width: "180px", height: "180px",margin: "0 0 0 -10px",marginBottom:"10px",outline:"solid 1px black"}}
                                             src={`data:image/jpeg;base64,${imagenesEvidencias.find(i => parseInt(i.m_nTipoArchivo) === 1).m_sImagen}`} />*/}
                                {/*{imagenesEvidencias.reverse().map((img, index) => (
                                    <img style={{
                                        width: "180px",
                                        height: "180px",
                                        margin: "0 0 0 -10px",
                                        marginBottom: "10px",
                                        outline: "solid 1px black"
                                    }}
                                         src={`data:image/jpeg;base64,${img.m_sImagen}`} key={index}/>))
                                }
                                Recibió: {props.data.receptorGuia}*/}

                            </div>
                        </Grid>

                }

            </Grid>
        </div>
    )
}

export default Evidencias