import React, {useState} from "react";
import {Grid} from "@mui/material";
import TextField from "@mui/material/TextField";
import IconButton from "@mui/material/IconButton";
import RestartAltIcon from "@mui/icons-material/Refresh";
import SearchIcon from '@mui/icons-material/Search';
import {
    obtenerListadoZonaOperativa,
    obtenerZonaOperativaByCodigoPostal
} from "../../Util/Contexts/ZonaOperativaContext";



function Filtros(props) {
    const [filtros, setFiltros] = useState({
        cp:""
    })

    const resetFiltros = () => {
        setFiltros(filtros =>{
            return {
                ...filtros,
               cp:""
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
    }

    const filtrar = () => {
            if (filtros.cp.length > 0){
                obtenerZonaOperativaByCodigoPostal(filtros.cp).then(respuesta => {
                    console.log(respuesta)
                    props.listaResultados(respuesta.data)
                })
            }else{
                obtenerListadoZonaOperativa().then(({data}) => {
                    props.listaResultados(data)
                })
            }
    }

    return (
        <div>
            <Grid container spacing={1} alignItems="center" style={{paddingRight: "16px"}}>
                <Grid container item={6}>
                    <Grid item xs={3}>
                        <TextField variant="outlined" size="small"
                                   onChange={handleChangeFiltros}
                                   onKeyDown={handleChangeFiltros}
                                   className="form-control"
                                   type="text"
                                   label="Código Postal"
                                   id="cp"
                                   name="cp"
                                   value={filtros.cp}
                        />
                    </Grid>  
                    <Grid item xs={3}>
                        <IconButton
                            aria-label="delete"
                            onClick={() => {
                                resetFiltros()
                            }}
                            size="large">
                            <RestartAltIcon fontSize={"large"} style={{marginRight: '10px'}}/>
                            Limpiar filtro
                        </IconButton>
         
                        <IconButton aria-label="delete" onClick={() => filtrar()} size="large">
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