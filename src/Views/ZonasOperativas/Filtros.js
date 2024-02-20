import React, {useState} from "react";
import {Grid} from "@material-ui/core";
import TextField from "@material-ui/core/TextField";
import IconButton from "@material-ui/core/IconButton";
import RestartAltIcon from "@material-ui/icons/Refresh";
import SearchIcon from '@material-ui/icons/Search';
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

    return(
        <div>
            <Grid container spacing={1} alignItems="center" style={{paddingRight: "16px"}}>
                <Grid container item={6}>
                    <Grid item xs={3}>
                        <TextField variant="outlined" margin="dense"
                                   onChange={handleChangeFiltros}
                                   onKeyDown={handleChangeFiltros}
                                   className="form-control"
                                   type="text"
                                   label="Codigo Postal"
                                   id="cp"
                                   name="cp"
                                   value={filtros.cp}
                        />
                    </Grid>  
                    <Grid item xs={3}>
                        <IconButton aria-label="delete" onClick={() => {
                            resetFiltros()
                        }}>
                            <RestartAltIcon fontSize={"large"} style={{marginRight: '10px'}}/>
                            Limpiar filtro
                        </IconButton>
         
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