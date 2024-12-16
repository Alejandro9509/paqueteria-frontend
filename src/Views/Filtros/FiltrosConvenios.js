import React, {useState} from "react";
import {Grid} from "@mui/material";
import TextField from "@mui/material/TextField";
import IconButton from "@mui/material/IconButton";
import RestartAltIcon from "@mui/icons-material/Refresh";
import SearchIcon from '@mui/icons-material/Search';
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

    return (
        <div>
            <Grid container spacing={1} alignItems="center" style={{paddingRight: "16px"}}>
                <Grid container spacing={2} xs={3} item={6}>
                    <Grid item xs={12}>
                        <TextField variant="outlined" size="small" fullWidth
                                   onChange={handleChangeFiltros}
                                   onKeyDown={handleChangeFiltros}
                                   className="form-control"
                                   type="text"
                                   label="Cliente"
                                   id="folio"
                                   name="folio"
                                   value={filtros.folio}
                        />
                    </Grid>
                </Grid>
                <Grid container spacing={2} xs={6} item={6}>
                    <Grid item container xs={2}>
                        <IconButton
                            aria-label="delete"
                            onClick={() => {
                                resetFiltros()
                                getAllListado()
                            }}
                            style={{fontSize: '1.2em'}}
                            size="large">
                            <RestartAltIcon fontSize={"large"} style={{marginRight: '10px'}}/>
                                Limpiar filtros
                        </IconButton>
                    </Grid>
                    <Grid item container xs={2}>
                        <IconButton aria-label="delete" onClick={() => filtrar()} size="large" style={{fontSize: '1.2em'}}>
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