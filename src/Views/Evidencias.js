import { Box, Grid, Typography } from '@material-ui/core'
import React, { useEffect, useState } from 'react'
import { obtenerImagenEvidencia } from '../Util/Contexts/UltimaMillaContext'

function Evidencias(props) {
    const {esRecoleccion,idGuia} = props
    const [imagenesEvidencias, setImagenesEvidencias] = useState([])

    useEffect(value => {
        obtenerImagenEvidencia(idGuia,esRecoleccion).then(respuestaRec=>{
            setImagenesEvidencias(respuestaRec.data?respuestaRec.data:[])        
        })
    }, [idGuia])
  return (
                                <div style={{margin:"0 auto"}}>
                                <Box display="flex" p={1} bgcolor="background.paper" justifyContent={"center"}>
                                    {imagenesEvidencias.length == 0?
                                    <Typography variant={"h5"} >No hay evidencias</Typography>:

                                                

                                    esRecoleccion?
                                    imagenesEvidencias.find(i => parseInt(i.m_nTipoArchivo) === 1) !== undefined &&
                                    <Grid item md={6} style={{flexBasis:"0"}}>
                                         <div id="divRecoleccion">
                                        
                                       
                                                    <img style={{width: "180px", height: "180px",margin: "0 0 0 -10px",marginBottom:"10px",outline:"solid 1px black"}}
                                                     src={`data:image/jpeg;base64,${imagenesEvidencias.find(i => parseInt(i.m_nTipoArchivo) === 1).m_sImagen}`}/>
                                          </div>   
                                    </Grid>
                                    : 
                                    <Grid item md={6} style={{flexBasis:"0"}}>
                                         <div id="divEmbarque">
                                  
                                        <img style={{width: "180px", height: "180px",margin: "0 0 0 -10px",marginBottom:"10px",outline:"solid 1px black"}}
                                         src={`data:image/jpeg;base64,${imagenesEvidencias.find(i => parseInt(i.m_nTipoArchivo) === 1).m_sImagen}`} />
                                         
                                           </div>   
                                    </Grid>  
                                    
                                    }
                    
                                     </Box>
                          </div>
  )
}

export default Evidencias