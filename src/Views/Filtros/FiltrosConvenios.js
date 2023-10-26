import React, {useEffect, useState, useMemo} from "react";
import {Dialog, DialogActions, DialogContent, Grid} from "@material-ui/core";
import TextField from "@material-ui/core/TextField";
import IconButton from "@material-ui/core/IconButton";
import RestartAltIcon from "@material-ui/icons/Refresh";
import SearchIcon from '@material-ui/icons/Search';
import {obtenerTarifasRangosFiltro} from "../../Util/Contexts/TarifasContext"
import {obtenerFechaFinal, obtenerFechaInicio} from "../../Util/Contexts/UtileriasContext";

function Filtros(props) {

    const [filtros, setFiltros] = useState({
        clientePaga:'',
    })
    const resetFiltros = () => {
        setFiltros(filtros =>{
            return {
                ...filtros,

                folio:'',

            }
        })
    }
    const handleChangeFiltros = (event) => {
        console.log(event)
        const {target} = event
        setFiltros(filtros => {
            return {
                ...filtros,
                [target.name]: target.value
            }
        })
        if (target.name && event.keyCode == 13){
            obtenerTarifasRangosFiltro(target.value).then(respuesta => {
                if (respuesta.data == "Vacio") {

                    props.actualizarTarifas([]);
                } else {

                    props.actualizarTarifas(respuesta.data);
                }
            })
        }
    }

    const filtrar = () => {
        console.log(filtros)
        obtenerTarifasRangosFiltro(filtros.folio).then(respuesta => {

            props.actualizarTarifas(respuesta.data);
        })

    }

    async function getAllListado(){
        obtenerFechaInicio().then((respuestaUno) => {
            obtenerFechaFinal().then((respuestaDos) => {
                setFiltros(filtros=>{
                    return {
                        ...filtros,

                    }
                });


                obtenerTarifasRangosFiltro(0).then((respuesta) => {
                    props.actualizarTarifas(respuesta.data);
                })
            })
        })

    }


    return(
        <div>

            <Grid container spacing={1} alignItems="center" style={{paddingRight: "16px"}}>
                <Grid container spacing={2} xs={3} item={6}>
                    <Grid item xs={12}>
                        <TextField variant="outlined" margin="dense"
                                   onChange={handleChangeFiltros}
                                   onKeyDown={handleChangeFiltros}
                                   className="form-control"
                                   type="text"
                                   label="Folio"
                                   id="folio"
                                   name="folio"
                                   value={filtros.folio}
                        />
                    </Grid>





                </Grid>
                <Grid container spacing={2} xs={6} item={6}>


                    <Grid item container xs={6}>
                        <IconButton aria-label="delete" onClick={() => {
                            resetFiltros()
                            getAllListado()
                        }}>
                            <RestartAltIcon fontSize={"large"} style={{marginRight: '10px'}}/>
                            Limpiar filtros
                        </IconButton>
                    </Grid>
                    <Grid item container xs={6}>
                        <IconButton aria-label="delete" onClick={() => filtrar()}>
                            <SearchIcon fontSize={"large"} style={{marginRight: '10px'}}/>
                            Buscar
                        </IconButton>
                    </Grid>
                </Grid>

            </Grid>
        </div>
    );
}

export default Filtros;