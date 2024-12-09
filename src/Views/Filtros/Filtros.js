import React, {useEffect, useState, useMemo} from "react";
import {Dialog, DialogActions, DialogContent, Grid,MenuItem} from "@mui/material";
import TextField from "@mui/material/TextField";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import Select from "@mui/material/Select";
import IconButton from "@mui/material/IconButton";
import RestartAltIcon from "@mui/icons-material/Refresh";
import SearchIcon from '@mui/icons-material/Search';
import {obtenerEmbarquesFiltro} from "../../Util/Contexts/EmbarquesContext";
import {obtenerSucursales} from "../../Util/Contexts/SucursalContext";
import {
    obtenerEstatusEmbarque,
    obtenerEstatusGuia, obtenerEstatusInforme,
    obtenerEstatusRecoleccion, obtenerEstatusViaje
} from "../../Util/Contexts/EstatusContext";
import {obtenerCiudades} from "../../Util/Contexts/CiudadesContext";
import {obtenerFechaFinal, obtenerFechaInicio} from "../../Util/Contexts/UtileriasContext";
import {obtenerRecoleccionFiltro} from "../../Util/Contexts/RecoleccionContext";
import {obtenerGuiasFiltro} from "../../Util/Contexts/GuiaContext";
import {obtenerInformeFiltro} from "../../Util/Contexts/InformesContext";
import {obtenerViajesByFiltro} from "../../Util/Contexts/ViajesContext";
import InputAdornment from "@mui/material/InputAdornment";
import DialogTableRemDes from "../RemitenteDestinatario/DialogTableRemDes";
import {obtenerMunicipiosByIdEstado} from "../../Util/Contexts/MunicipiosContext";
import {obtenerZonaOperativaByIdCodigoPostal} from "../../Util/Contexts/ZonaOperativaContext";
import {obtenerZonaTarifaByIdCodigoPostal} from "../../Util/Contexts/ZonaTarifaContext";
import DialogTableClientes from "../Clientes/DialogTableClientes";

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
        clientePaga:'',
        sucursalEmisora:0,
        sucursalReceptora:0,
        operador:0
    })
    const [openDialog, setOpenDialog] = useState(false);

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
                clientePaga:'',
                sucursalEmisora:0,
                sucursalReceptora:0,
                operador:0
            }
        })
    }

    useEffect(value => {
        getAllSucursales()
        getAllCiudades()
        getAllEstatus()
        getAllListado()
    },[])

    const handleChangeFiltros = (event) => {
        const {target} = event
        setFiltros(filtros => {
            return {
                ...filtros,
                [target.name]: target.value
            }
        })
        if (target.name && event.keyCode == 13){
            if (props.embarque){
                obtenerEmbarquesFiltro(0, 0,0, 0,target.value,0,0,0).then(respuesta => {
                    if (respuesta.data == "Vacio") {
                        props.listaResultado([])
                    } else {
                        props.listaResultado(respuesta.data)
                    }
                })
            }else if (props.recoleccion){
                obtenerRecoleccionFiltro(0, 0,0, 0,target.value,0,0,0).then(respuesta => {
                    props.listaResultado(respuesta.data)
                })
            }else if (props.guia){
                obtenerGuiasFiltro(0, 0,0, 0,target.value,0,0,0).then(respuesta => {
                    props.listaResultado(respuesta.data)
                })
            }else if (props.informe){
                obtenerInformeFiltro(0, 0,target.value, 0,0).then(respuesta => {
                    props.listaResultado(respuesta.data)
                })
            }else if (props.viajes){
                obtenerViajesByFiltro(0, 0,0, target.value,0,0,0).then(respuesta => {
                    props.listaResultado(respuesta.data)
                })
            }
        }
    }

    const filtrar = () => {
        if (props.embarque){
            if (filtros.folio.length > 0){
                obtenerEmbarquesFiltro(0, 0,0, 0,filtros.folio,0,0, 0).then(respuesta => {
                    props.listaResultado(respuesta.data)
                })
            }else {
                obtenerEmbarquesFiltro(filtros.fechaInicial, filtros.fechaFinal,filtros.sucursalListado, filtros.estatusListado,filtros.folio,filtros.OrigenListado,filtros.DestinoListado, filtros.clientePaga.id||0).then(respuesta => {
                    props.listaResultado(respuesta.data)
                })
            }
        }else if (props.recoleccion){
            if (filtros.folio.length > 0){
                obtenerRecoleccionFiltro(0, 0,0, 0,filtros.folio,0,0,0).then(respuesta => {
                    props.listaResultado(respuesta.data)
                    
                })
            }else{
                obtenerRecoleccionFiltro(filtros.fechaInicial, filtros.fechaFinal,filtros.sucursalListado, filtros.estatusListado,filtros.folio,filtros.OrigenListado,filtros.DestinoListado, filtros.clientePaga.id||0).then((respuesta) => {
                    props.listaResultado(respuesta.data)
                })
            }
        }else if (props.guia){
            if (filtros.folio.length > 0){
                obtenerGuiasFiltro(0, 0,0, 0,filtros.folio,0,0,0).then(respuesta => {
                    props.listaResultado(respuesta.data)
                })
            }else{
                obtenerGuiasFiltro(filtros.fechaInicial, filtros.fechaFinal,filtros.sucursalListado, filtros.estatusListado,filtros.folio,filtros.OrigenListado,filtros.DestinoListado,filtros.clientePaga.id||0).then((respuesta) => {
                    props.listaResultado(respuesta.data)
                })
            }
        }else if (props.informe){
            if (filtros.folio.length > 0){
                obtenerInformeFiltro(0, 0,filtros.folio, 0,0).then(respuesta => {
                    props.listaResultado(respuesta.data)
                })
            }else{
                obtenerInformeFiltro(filtros.fechaInicial, filtros.fechaFinal,filtros.folio,filtros.sucursalEmisora, filtros.sucursalReceptora).then((respuesta) => {
                    props.listaResultado(respuesta.data)
                })
            }
        }else if (props.viajes){
            if (filtros.folio.length > 0){
                obtenerViajesByFiltro(0, 0,0, filtros.folio,0,0,0).then(respuesta => {
                    props.listaResultado(respuesta.data)
                })
            }else{
                obtenerViajesByFiltro(filtros.fechaInicial, filtros.fechaFinal, filtros.estatusListado,filtros.folio,filtros.OrigenListado,filtros.DestinoListado, filtros.operador).then((respuesta) => {
                    props.listaResultado(respuesta.data)
                })
            }
        }

    }

    async function getAllSucursales() {
        if (dataSucursal.length > 0)
            return
        obtenerSucursales().then((respuesta) => {
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
        }else if (props.guia){
            obtenerEstatusGuia().then((respuesta) => {
                setEstatus(respuesta.data);
            });
        }else if (props.informe){
            /*obtenerEstatusInforme().then((respuesta) => {
                setEstatus(respuesta.data);
            });*/
        }else if (props.viajes){
            obtenerEstatusViaje().then((respuesta) => {
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
                setFiltros(filtros=>{
                    return {
                        ...filtros,
                        fechaInicial: respuestaUno.data[0].Fecha,
                        fechaFinal: respuestaDos.data[0].Fecha
                    }
                });

                if (props.embarque){
                    obtenerEmbarquesFiltro(respuestaUno.data[0].Fecha, respuestaDos.data[0].Fecha,0,0,0, 0, 0, 0).then((respuesta) => {
                        props.listaResultado(respuesta.data);
                    })
                }else if (props.recoleccion){
                    obtenerRecoleccionFiltro(respuestaUno.data[0].Fecha, respuestaDos.data[0].Fecha,0,0,0, 0, 0,0).then((respuesta) => {
                        props.listaResultado(respuesta.data);
                    })
                }else if (props.guia){
                    obtenerGuiasFiltro(respuestaUno.data[0].Fecha, respuestaDos.data[0].Fecha,0,0,0, 0, 0,0).then((respuesta) => {
                        props.listaResultado(respuesta.data);
                    })
                }else if (props.informe){
                    obtenerInformeFiltro(respuestaUno.data[0].Fecha, respuestaDos.data[0].Fecha,0,0,0).then((respuesta) => {
                        props.listaResultado(respuesta.data);
                    })
                }else if (props.viajes){
                    obtenerViajesByFiltro(respuestaUno.data[0].Fecha, respuestaDos.data[0].Fecha,0,0,0, 0, 0).then((respuesta) => {
                        props.listaResultado(respuesta.data);
                    })
                }
            })
        })

    }


    const dialogVisible = (isVisible) => {
        setOpenDialog(isVisible);
    };

    const handlePatrocinadorSelected = (row) => {
        setFiltros(filtros => {
            return{
                ...filtros,
                clientePaga: row,
            }
        });
        setOpenDialog(false);
    }

    return (
        <div>
            <Dialog
                open={openDialog}
                onClose={() => setOpenDialog(false)}
                fullWidth maxWidth="md"
            >
                <DialogContent>
                    <DialogTableClientes dialogVisible={dialogVisible } handlePatrocinadorSelected={handlePatrocinadorSelected}/>
                </DialogContent>
            </Dialog>
            <Grid container spacing={1} alignItems="center" style={{paddingRight: "16px"}}>
                <Grid container spacing={2} item={12}>
                    <Grid item xs>
                        <TextField variant="outlined" size="small"
                                   fullWidth
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
                    <Grid item xs>
                        <FormControl className="input select" fullWidth variant="outlined">
                            <TextField
                                autoFocus
                                fullWidth
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
                    <Grid item xs>
                        <FormControl className="input select" fullWidth variant="outlined">
                            <TextField variant="outlined" margin="dense"
                                       type="date"
                                       fullWidth
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
                    {(props.embarque || props.recoleccion || props.guia) &&
                    <Grid item xs>
                        <FormControl className="input select" fullWidth variant="outlined" size="small">
                            <InputLabel id="idSucusalLabel">Sucursal</InputLabel>
                            <Select
                                labelId="sucursalListadoLabel"
                                label="Sucursal"
                                className="form-control"
                                value={filtros.sucursalListado}
                                onChange={handleChangeFiltros}
                                id="sucursalListado"
                                name="sucursalListado"
                            >
                                <MenuItem value="0">Todas</MenuItem>
                                {dataSucursal.map((sucursal) => (
                                    <MenuItem
                                        key={sucursal.m_nIdSucursal}
                                        value={sucursal.m_nIdSucursal}
                                    >
                                        {sucursal.m_sSucursal}
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                    </Grid>
                    }
                    {(props.embarque || props.recoleccion || props.guia || props.viajes) &&
                    <Grid item xs>
                        <FormControl className="input select" fullWidth size="small" variant="outlined">
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
                                <MenuItem value="0">Todos</MenuItem>
                                {props.embarque && dataEstatus.map((estatus) => (
                                    <MenuItem key={estatus.m_nIdEstatusEmbarque} value={estatus.m_nIdEstatusEmbarque}>
                                        {estatus.m_sEstatus}
                                    </MenuItem>
                                ))}
                                {props.recoleccion && dataEstatus.map((estatus) => (
                                    <MenuItem key={estatus.m_nIdEstatusRecoleccion}
                                            value={estatus.m_nIdEstatusRecoleccion}
                                    >
                                        {estatus.m_sEstatus}
                                    </MenuItem>
                                ))}
                                {props.guia && dataEstatus.map((estatus) => (
                                    <MenuItem key={estatus.m_nIdEstatusGuia} value={estatus.m_nIdEstatusGuia}>
                                        {estatus.m_sEstatus}
                                    </MenuItem>
                                ))}
                                {props.informe && dataEstatus.map((estatus) => (
                                    <MenuItem key={estatus.m_nIdEstatusInforme} value={estatus.m_nIdEstatusInforme}>
                                        {estatus.m_sEstatus}
                                    </MenuItem>
                                ))}
                                {props.viajes && dataEstatus.map((estatus) => (
                                    <MenuItem key={estatus.m_nIdEstatusViaje} value={estatus.m_nIdEstatusViaje}>
                                        {estatus.m_sEstatus}
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                    </Grid>
                    }
                    {(props.informe) &&
                    <Grid item xs>
                        <FormControl className="input select" fullWidth variant="outlined" size="small">
                            <InputLabel id="idSucusalLabel">Sucursal Emisora</InputLabel>
                            <Select
                                labelId="sucursalListadoLabel"
                                label="Sucursal Emisora"
                                className="form-control"
                                value={filtros.sucursalEmisora}
                                onChange={handleChangeFiltros}
                                id="sucursalEmisora"
                                name="sucursalEmisora"
                            >
                                <MenuItem value="0">Todas</MenuItem>
                                {dataSucursal.map((sucursal) => (
                                    <MenuItem
                                        key={sucursal.m_nIdSucursal}
                                        value={sucursal.m_nIdSucursal}
                                    >
                                        {sucursal.m_sSucursal}
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                    </Grid>
                    }
                    {(props.informe) &&
                    <Grid item xs>
                        <FormControl className="input select" size="small" fullWidth variant="outlined">
                            <InputLabel id="idSucusalLabel">Sucursal Receptora</InputLabel>
                            <Select
                                labelId="sucursalListadoLabel"
                                label="Sucursal"
                                className="form-control"
                                value={filtros.sucursalReceptora}
                                onChange={handleChangeFiltros}
                                id="sucursalReceptora"
                                name="sucursalReceptora"
                            >
                                <MenuItem value="0">Todas</MenuItem>
                                {dataSucursal.map((sucursal) => (
                                    <MenuItem
                                        key={sucursal.m_nIdSucursal}
                                        value={sucursal.m_nIdSucursal}
                                    >
                                        {sucursal.m_sSucursal}
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                    </Grid>
                    }
                </Grid>
                <Grid container spacing={2} item={12}>
                    {(props.embarque || props.recoleccion || props.guia || props.viajes) &&
                    <Grid item xs>
                        <FormControl className="input select" fullWidth variant="outlined" size="small">
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
                                <MenuItem value="0">Todos</MenuItem>
                                {dataCiudad.map((ciudad) => (
                                    <MenuItem
                                        key={ciudad.m_nIdCiudad}
                                        value={ciudad.m_nIdCiudad}
                                    >
                                        {ciudad.m_sCiudad}
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                    </Grid>
                    }
                    {(props.embarque || props.recoleccion || props.guia || props.viajes) &&
                    <Grid item xs>
                        <FormControl className="input select" size="small" fullWidth variant="outlined">
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
                                <MenuItem value="0">Todos</MenuItem>
                                {dataCiudad.map((ciudad) => (
                                    <MenuItem
                                        key={ciudad.m_nIdCiudad}
                                        value={ciudad.m_nIdCiudad}
                                    >
                                        {ciudad.m_sCiudad}
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                    </Grid>
                    }
                    {(props.embarque || props.recoleccion || props.guia) &&
                    <Grid item xs>
                        <div className="input">
                            <TextField
                                variant="outlined"
                                label="Cliente"
                                size="small"
                                value={filtros.clientePaga.m_sNombreFiscal||''}
                                placeholder={"No. Cliente: Nombre fiscal"}
                                // InputLabelProps={{shrink: true}}
                                onClick={()=>{setOpenDialog(true)}}
                            />
                        </div>
                    </Grid>
                    }
                    {/*{(props.viajes) &&
                    <Grid item xs>
                        <div className="input">
                            <TextField
                                variant="outlined"
                                label="Operador"
                                margin="dense"
                                value={filtros.operador.m_sIdOperdor||''}
                                placeholder={"Operador"}
                                // InputLabelProps={{shrink: true}}
                                onClick={()=>{setOpenDialog(true)}}
                            />
                        </div>
                    </Grid>
                    }*/}
                    <Grid item container xs>
                        <IconButton
                            aria-label="delete"
                            onClick={() => {
                                resetFiltros()
                                getAllListado()
                            }}
                            size="large">
                            <RestartAltIcon fontSize={"large"} style={{marginRight: '10px'}}/>
                            Limpiar filtros
                        </IconButton>
                    </Grid>
                    <Grid item container xs>
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