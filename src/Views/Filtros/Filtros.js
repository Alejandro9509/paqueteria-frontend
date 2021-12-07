import React, {useEffect, useState, useMemo} from "react";
import {Grid} from "@material-ui/core";
import TextField from "@material-ui/core/TextField";
import FormControl from "@material-ui/core/FormControl";
import InputLabel from "@material-ui/core/InputLabel";
import Select from "@material-ui/core/Select";
import IconButton from "@material-ui/core/IconButton";
import RestartAltIcon from "@material-ui/icons/Refresh";
import SearchIcon from '@material-ui/icons/Search';
import {obtenerEmbarquesFiltro} from "../../Util/Contexts/EmbarquesContext";
import {obtenerSucursales} from "../../Util/Contexts/SucursalContext";
import {obtenerEstatusEmbarque, obtenerEstatusRecoleccion} from "../../Util/Contexts/EstatusContext";
import {obtenerCiudades} from "../../Util/Contexts/CiudadesContext";
import {obtenerFechaFinal, obtenerFechaInicio} from "../../Util/Contexts/UtileriasContext";
import {obtenerRecoleccionFiltro} from "../../Util/Contexts/RecoleccionContext";

function Filtros(props) {
    const [dataSucursal, setDataSucursal] = React.useState([]);
    const [dataEstatus, setEstatus] = React.useState([]);
    const [dataCiudad, setDataCiudad] = React.useState([]);
    const [filtros, setFiltros] = useState({
        fechaInicial: 0,
        fechaFinal: 0,
        estatusListado:0,
        sucursalListado: 0,
        folio: '',
        OrigenListado:0,
        DestinoListado:0,
    })

    const handleChangeFiltros = (event) => {
        const {target} = event
        setFiltros(filtros => {
            return {
                ...filtros,
                [target.name]: target.value
            }
        })
        if (target.name && event.keyCode == 13){
            obtenerEmbarquesFiltro(0, 0,0, 0,target.value,0,0).then(respuesta => {
                if (respuesta.data == "Vacio") {
                    props.listaResultado([])
                } else {
                    props.listaResultado(respuesta.data)
                }
            })
        }
        /*if (target.name === "fechaInicial"){
            obtenerEmbarquesFiltro(target.value, filtros.fechaFinal,filtros.sucursalListado,filtros.estatusListado,filtros.folio,filtros.OrigenListado,filtros.DestinoListado).then(respuesta => {
                if (respuesta.data == "Vacio") {
                    props.listaResultado([])
                } else {
                    props.listaResultado(respuesta.data)
                }
            })
        }else if (target.name === "fechaFinal"){
            obtenerEmbarquesFiltro(filtros.fechaInicial, target.value,filtros.sucursalListado,filtros.estatusListado,filtros.folio,filtros.OrigenListado,filtros.DestinoListado).then(respuesta => {
                if (respuesta.data == "Vacio") {
                    props.listaResultado([])
                } else {
                    props.listaResultado(respuesta.data)
                }
            })
        }
        else if (target.name === "sucursalListado"){
            obtenerEmbarquesFiltro(filtros.fechaInicial, filtros.fechaFinal,target.value,filtros.estatusListado,filtros.folio,filtros.OrigenListado,filtros.DestinoListado).then(respuesta => {
                if (respuesta.data == "Vacio") {
                    props.listaResultado([])
                } else {
                    props.listaResultado(respuesta.data)
                }
            })
        }
        else if (target.name === "estatusListado"){
            obtenerEmbarquesFiltro(filtros.fechaInicial, filtros.fechaFinal,filtros.sucursalListado, target.value,filtros.folio,filtros.OrigenListado,filtros.DestinoListado).then(respuesta => {
                if (respuesta.data == "Vacio") {
                    props.listaResultado([])
                } else {
                    props.listaResultado(respuesta.data)
                }
            })
        }
        else if (target.name === "OrigenListado"){
            obtenerEmbarquesFiltro(filtros.fechaInicial, filtros.fechaFinal,filtros.sucursalListado, filtros.estatusListado,filtros.folio,target.value,filtros.DestinoListado).then(respuesta => {
                if (respuesta.data == "Vacio") {
                    props.listaResultado([])
                } else {
                    props.listaResultado(respuesta.data)
                }
            })
        }
        else if (target.name === "DestinoListado"){
            obtenerEmbarquesFiltro(filtros.fechaInicial, filtros.fechaFinal,filtros.sucursalListado, filtros.estatusListado,filtros.folio,filtros.OrigenListado,target.value).then(respuesta => {
                if (respuesta.data == "Vacio") {
                    props.listaResultado([])
                } else {
                    props.listaResultado(respuesta.data)
                }
            })
        }*/
    }

    const filtrar = () => {
        if (props.embarque){
            if (filtros.folio.length > 0){
                obtenerEmbarquesFiltro(0, 0,0, 0,filtros.folio,0,0).then(respuesta => {
                    if (respuesta.data == "Vacio") {
                        props.listaResultado([])
                    } else {
                        props.listaResultado(respuesta.data)
                    }
                })
            }else {
                obtenerEmbarquesFiltro(filtros.fechaInicial, filtros.fechaFinal,filtros.sucursalListado, filtros.estatusListado,filtros.folio,filtros.OrigenListado,filtros.DestinoListado).then(respuesta => {
                    if (respuesta.data == "Vacio") {
                        props.listaResultado([])
                    } else {
                        props.listaResultado(respuesta.data)
                    }
                })
            }

        }else if (props.recoleccion){
            if (filtros.folio.length > 0){
                obtenerRecoleccionFiltro(0, 0,0, 0,filtros.folio,0,0).then(respuesta => {
                    if (respuesta.data == "Vacio") {
                        props.listaResultado([])
                    } else {
                        props.listaResultado(respuesta.data)
                    }
                })
            }else{
                obtenerRecoleccionFiltro(filtros.fechaInicial, filtros.fechaFinal,filtros.sucursalListado, filtros.estatusListado,filtros.folio,filtros.OrigenListado,filtros.DestinoListado).then((respuesta) => {
                    props.listaResultado(respuesta.data)
                })
            }
        }

    }

    const resetFiltros = () => {
        setFiltros(filtros =>{
            return {
                ...filtros,
                fechaInicial: 0,
                fechaFinal: 0,
                estatusListado:0,
                sucursalListado: 0,
                folio: '',
                OrigenListado:0,
                DestinoListado:0,
            }
        })
    }

    async function getAllSucursales() {
        if (dataSucursal.length > 0)
            return
        obtenerSucursales().then((respuesta) => {
            console.log('sucursales: ', respuesta.data)
            setDataSucursal(respuesta.data);
        });
    }
    async function getAllEstatus() {
        if (dataEstatus.length > 0)
            return
        if (props.embarque){
            obtenerEstatusEmbarque().then((respuesta) => {
                setEstatus(respuesta.data);
            });
        }else if (props.recoleccion){
            obtenerEstatusRecoleccion().then((respuesta) => {
                setEstatus(respuesta.data);
            });
        }

    }
    async function getAllCiudades() {
        if (dataCiudad.length > 0)
            return
        obtenerCiudades().then((respuesta) => {
            setDataCiudad(respuesta.data);
        });
    }

    async function getAllListado(){
        obtenerFechaInicio().then((respuestaUno) => {
            obtenerFechaFinal().then((respuestaDos) => {
                console.log(respuestaUno.data[0].Fecha)
                console.log(respuestaDos.data[0].Fecha)
                setFiltros(filtros=>{
                    return {
                        ...filtros,
                        fechaInicial: respuestaUno.data[0].Fecha,
                        fechaFinal: respuestaDos.data[0].Fecha
                    }
                });

                if (props.embarque){
                    obtenerEmbarquesFiltro(respuestaUno.data[0].Fecha, respuestaDos.data[0].Fecha,0,0,0, 0, 0).then((respuesta) => {
                        props.listaResultado(respuesta.data);
                    })
                }else if (props.recoleccion){
                    obtenerRecoleccionFiltro(respuestaUno.data[0].Fecha, respuestaDos.data[0].Fecha,0,0,0, 0, 0).then((respuesta) => {
                        props.listaResultado(respuesta.data);
                    })
                }
            })
        })

    }

    useEffect(value => {
        getAllSucursales()
        getAllCiudades()
        getAllEstatus()
        getAllListado()
    },[])

    return(
        <div>
            <Grid container spacing={2} alignItems="center">
                <Grid item xs={2}>
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
                <Grid item xs={2}>
                    <FormControl className="input select" fullWidth variant="outlined">
                        <TextField
                            autoFocus
                            type="date"
                            margin="dense"
                            label="Fecha Inicial"
                            variant="outlined"
                            className="form-control"
                            InputLabelProps={{shrink: true,}}
                            value={filtros.fechaInicial}
                            onChange={handleChangeFiltros}
                            id="fechaInicial"
                            name="fechaInicial"
                        />
                    </FormControl>
                </Grid>
                <Grid item xs={2}>
                    <FormControl className="input select" fullWidth variant="outlined">
                        <TextField variant="outlined" margin="dense"
                                   type="date"
                                   className="form-control"
                                   label="Fecha Final"
                                   InputLabelProps={{
                                       shrink: true,
                                   }}
                                   value={filtros.fechaFinal}
                                   onChange={handleChangeFiltros}
                                   id="fechaFinal"
                                   name="fechaFinal"

                        />
                    </FormControl>

                </Grid>
                <Grid item xs={2}>
                    <FormControl className="input select" fullWidth variant="outlined">
                        <InputLabel id="idSucusalLabel">Sucursal</InputLabel>
                        <Select
                            labelId="sucursalListadoLabel"
                            label="Sucursal"
                            className="form-control"
                            required
                            value={filtros.sucursalListado}
                            onChange={handleChangeFiltros}
                            id="sucursalListado"
                            name="sucursalListado"
                        >
                            <option value="0">Todas</option>
                            {dataSucursal.map((sucursal) => (
                                <option
                                    key={sucursal.m_nIdSucursal}
                                    value={sucursal.m_nIdSucursal}
                                >
                                    {sucursal.m_sSucursal}
                                </option>
                            ))}
                        </Select>
                    </FormControl>
                </Grid>
                <Grid item xs={2}>
                    <FormControl className="input select" fullWidth variant="outlined">
                        <InputLabel id="idEstatusLabel">Estatus</InputLabel>
                        <Select
                            labelId="estatusListadoLabel"
                            className="form-control"
                            required
                            label="Estatus"
                            value={filtros.estatusListado}
                            onChange={handleChangeFiltros}
                            id="estatusListado"
                            name="estatusListado"
                        >
                            <option value="0">Todos</option>
                            {props.embarque && dataEstatus.map((estatus) => (
                                <option key={estatus.m_nIdEstatusEmbarque} value={estatus.m_nIdEstatusEmbarque}>
                                    {estatus.m_sEstatus}
                                </option>
                            )) }
                            {props.recoleccion && dataEstatus.map((estatus) => (
                                <option key={estatus.m_nIdEstatusRecoleccion} value={estatus.m_nIdEstatusRecoleccion}
                                >
                                    {estatus.m_sEstatus}
                                </option>
                            ))}
                        </Select>
                    </FormControl>
                </Grid>
                <Grid item xs={2}>
                    <FormControl className="input select" fullWidth variant="outlined">
                        <InputLabel id="OrigenListado">Origen</InputLabel>
                        <Select
                            labelId="OrigenListado"
                            className="form-control"
                            required
                            label="Origen"
                            value={filtros.OrigenListado}
                            onChange={handleChangeFiltros}
                            id="OrigenListado"
                            name="OrigenListado"
                        >
                            <option value="0">Todos</option>
                            {dataCiudad.map((ciudad) => (
                                <option
                                    key={ciudad.m_nIdCiudad}
                                    value={ciudad.m_nIdCiudad}
                                >
                                    {ciudad.m_sCiudad}
                                </option>
                            ))}
                        </Select>
                    </FormControl>
                </Grid>
                <Grid item xs={2}>
                    <FormControl className="input select" fullWidth variant="outlined">
                        <InputLabel id="DestinoListado">Destino</InputLabel>
                        <Select
                            labelId="DestinoListado"
                            className="form-control"
                            required
                            label="Destino"
                            value={filtros.DestinoListado}
                            onChange={handleChangeFiltros}
                            id="DestinoListado"
                            name="DestinoListado"
                        >
                            <option value="0">Todos</option>
                            {dataCiudad.map((ciudad) => (
                                <option
                                    key={ciudad.m_nIdCiudad}
                                    value={ciudad.m_nIdCiudad}
                                >
                                    {ciudad.m_sCiudad}
                                </option>
                            ))}
                        </Select>
                    </FormControl>
                </Grid>
                <Grid item container xs={2}>
                    <IconButton aria-label="delete" onClick={() => {
                        resetFiltros()
                        getAllListado()
                    }}>
                        <RestartAltIcon fontSize={"large"} style={{marginRight: '10px'}}/>
                        Limpiar filtros
                    </IconButton>
                </Grid>
                <Grid item container xs={2}>
                    <IconButton aria-label="delete" onClick={() => filtrar()}>
                        <SearchIcon fontSize={"large"} style={{marginRight: '10px'}}/>
                        Buscar
                    </IconButton>
                </Grid>
            </Grid>
        </div>
    );
}

export default Filtros;