import React, {useEffect, useState} from "react";
import {FormControl, Grid, InputLabel, MenuItem, Select} from "@mui/material";
import TextField from "@mui/material/TextField";
import {obtenerSucursales} from "../../Util/Contexts/SucursalContext";
import {obtenerEstadosPais} from "../../Util/Contexts/EstadosContext";
import CPTransferList from "./CPTransferList";
import {obtenerMunicipiosByIdEstado} from "../../Util/Contexts/MunicipiosContext";
import {obtenerCodigosPostalesPorEstadoMunicipio,obtenerCodigosPostalesPorEstadoMunicipioDisponibles} from "../../Util/Contexts/CodigoPostalContext";
import {obtenerCiudades} from "../../Util/Contexts/CiudadesContext";
import { Autocomplete } from '@mui/material';
import Button from "@mui/material/Button";
import { CheckBox } from "@mui/icons-material";
import { showSuccess } from "../../Util/Util";

function not(a, b) {
    return a.filter((value) => b.find(v => v.m_nIdCP == value.m_nIdCP) === undefined);
}

function CodigosPostalesZonas({seleccion, onChange,consult, tarifa = false,nuevo}) {
    const [state, setState] = useState({
        idSucursal: '',
        idZona: '',
        codigoZona: '',
        idEstado: '',
        idMunicipio: '',
        selectedCP: [],
        idOrigenDestino: '',
        idPais: '',
        aplicaEntrega:false
    })

    const [allCP, setAllCP] = useState([])
    const [dataSucursal, setDataSucursal] = useState([])
    const [dataEstados, setDataEstados] = useState([])
    const [dataMunicipio, setDataMunicipios] = useState([])
    const [dataCiudades, setDataCiudades] = useState([])

    useEffect(value => {
        getAllSucursales()
        getAllCiudades()
    }, [])

    useEffect( value => {
        console.log(seleccion)
        setState(state => {
            return {
                idZona: seleccion.m_nIdZona ? seleccion.m_nIdZona : 0,
                idSucursal: seleccion.m_nIdSucursal ? seleccion.m_nIdSucursal: '',
                codigoZona: seleccion.m_sCodigoZona ? seleccion.m_sCodigoZona : '',
                idEstado: seleccion.m_sIdEstado ? seleccion.m_sIdEstado: '',
                estado: seleccion.m_sEstado ? seleccion.m_sEstado : '',
                selectedCP: seleccion.m_arrCPs ? seleccion.m_arrCPs : [],
                idOrigenDestino: seleccion.m_nIdOrigenDestino || '',
                idPais: seleccion.m_nIdPais || '',
                aplicaEntrega: seleccion.m_bAplicaEntrega ?  seleccion.m_bAplicaEntrega : false
            }
        })
        if (!seleccion.m_arrCPs){
            setAllCP([])
        }
    }, [seleccion])

    useEffect(value =>{
        if (state.idEstado){
            getMunicipiosByIdEstado(state.idEstado)
        }
    },[state.idEstado])

    useEffect(value =>{
        console.log(state)
        if (state.idPais){
            getEstadosByIdPais(state.idPais)
        }
    },[state.idPais])

    useEffect(value =>{
        onChange(state)
    }, [state])

    const getAllSucursales = () => {
        if (tarifa ) {
            obtenerCiudades().then((respuesta) => {
                setDataSucursal(respuesta.data);
            });
        }else {
            obtenerSucursales().then((respuesta) => {
                setDataSucursal(respuesta.data);
            });
        }

    }

    const getAllCiudades = () => {
        obtenerCiudades().then((respuesta) => {
            setDataCiudades(respuesta.data);
        });

    }

    const getEstadosByIdPais = (idPais) => {
        obtenerEstadosPais(idPais).then((respuesta) => {
            setDataEstados(respuesta.data);
        });
    }

    const getMunicipiosByIdEstado = (id) => {
        obtenerMunicipiosByIdEstado(id).then(({data}) =>{
            setDataMunicipios(data)
        })
    }

    const handleChangeState = (event) => {
        event.preventDefault()
        const {target} = event
        if (target.name == 'idEstado'){
            let estado = dataEstados.find((i) => i.m_nIdEstado == target.value).m_sEstado
            setState(state => {
                return {
                    ...state,
                    [target.name]: target.value,
                    estado: estado
                }
            })
        }else if (target.name == 'idMunicipio'){
            setState(state => {
                return {
                    ...state,
                    [target.name]: target.value,
                    municipio: dataMunicipio.find((i) => i.m_sCodigoMunicipio == target.value).m_sMunicipio
                }
            })
        }else {
            setState(state => {
                return {
                    ...state,
                    [target.name]: target.value
                }
            })
        }
    }

    const handleCheck = (event) =>{
        const {target} = event
        setState(state => {
            return {
                ...state,
                [target.name]: target.checked
            }
        })
    }

    const onChangeList = (allItems, selectedItems) => {
        setAllCP(allItems)
        setState( state =>{
            return{
                ...state,
                selectedCP: selectedItems
            }
        })
    }

    const handleGetCPS = (e) =>{
        e.preventDefault()
        getAllCPByEstadoMunicipio()
    }

    const getAllCPByEstadoMunicipio = () =>{
/*         if(nuevo){
 */            obtenerCodigosPostalesPorEstadoMunicipioDisponibles(state.idEstado, state.idMunicipio).then(({data}) => {
                setAllCP(not(data,state.selectedCP))
                if (data.length==0){
                    showSuccess("No hay codigos postales disponibles.")
                }
                // setAllCP(data)
            })
/*         }else{
            obtenerCodigosPostalesPorEstadoMunicipio(state.idEstado, state.idMunicipio).then(({data}) => {
                setAllCP(not(data,state.selectedCP))
                // setAllCP(data)
            })
        } */

    }

    return(
        <div>
            <div className="row">
                <Grid container spacing={2}>
                    <Grid item xs={2}>
                        <div className="input">
                            <TextField
                                fullWidth
                                size="small"
                                variant="outlined"
                                id="codigoZona"
                                name="codigoZona"
                                label="Código de Zona"
                                type="text"
                                onChange={handleChangeState}
                                value={state.codigoZona}
                                className={"form-control"}
                                required={true}
                                disabled={consult}
                            />
                        </div>
                    </Grid>
                    <Grid item xs={2}>
                        {
                            tarifa ? (
                                <FormControl className="input select" fullWidth variant="outlined" size="small" required>
                                    <InputLabel
                                        id="idSucursalLabel">Destino</InputLabel>
                                    <Select
                                        fullWidth
                                        labelId="idSucursalLabel"
                                        label="Sucursal"
                                        className="form-control"
                                        required
                                        value={state.idSucursal}
                                        onChange={handleChangeState}
                                        id="idSucursal"
                                        name="idSucursal"
                                    >
                                        {dataSucursal.map((sucursal) => (
                                            <MenuItem
                                                key={sucursal.m_nIdCiudad}
                                                value={sucursal.m_nIdCiudad}
                                            >
                                                {sucursal.m_sCiudad}
                                            </MenuItem>
                                        ))}
                                    </Select>
                                </FormControl>
                            ) : (
                                <FormControl className="input select" fullWidth variant="outlined" size="small">
                                    <InputLabel
                                        id="idSucursalLabel">Sucursal</InputLabel>
                                    <Select
                                        fullWidth
                                        labelId="idSucursalLabel"
                                        label="Sucursal"
                                        className="form-control"
                                        required
                                        value={state.idSucursal}
                                        onChange={handleChangeState}
                                        id="idSucursal"
                                        name="idSucursal"
                                        disabled={consult}
                                    >
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
                            )
                        }

                    </Grid>
                    <Grid item xs={2}>
                        <FormControl className="input select" fullWidth variant="outlined" size="small" required>
                            <InputLabel
                                id="idOrigenDestino">Origen/Destino</InputLabel>
                            <Select
                                fullWidth
                                label="Origen/Destino"
                                className="form-control"
                                required
                                value={state.idOrigenDestino}
                                onChange={handleChangeState}
                                id="idOrigenDestino"
                                name="idOrigenDestino"
                            >
                                {dataCiudades.map((ciudades) => (
                                    <MenuItem
                                        key={ciudades.m_nIdCiudad}
                                        value={ciudades.m_nIdCiudad}
                                    >
                                        {ciudades.m_sCiudad}
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                    </Grid>
                    <Grid item xs={2}>
                        <FormControl className="input select" fullWidth variant="outlined" size="small" required>
                            <InputLabel
                                id="idPaisLabel">País</InputLabel>
                            <Select
                                fullWidth
                                labelId="idPaisLabel"
                                label="Pais"
                                className="form-control"
                                value={state.idPais}
                                onChange={handleChangeState}
                                id="idPais"
                                name="idPais"
                                disabled={consult}
                            >
                                <MenuItem key={1} value={1}>
                                    MÉXICO
                                </MenuItem>
                                <MenuItem key={2} value={2}>
                                    ESTADOS UNIDOS
                                </MenuItem>
                            </Select>
                        </FormControl>
                    </Grid>
                    <Grid item xs={2}>
                        <FormControl className="input select" fullWidth variant="outlined" size="small" required>
                            <InputLabel
                                id="idEstadoLabel">Estado</InputLabel>
                            <Select
                                fullWidth
                                labelId="idEstadoLabel"
                                label="Esatdo"
                                className="form-control"
                                value={state.idEstado}
                                onChange={handleChangeState}
                                id="idEstado"
                                name="idEstado"
                                disabled={consult}
                            >
                                {dataEstados.map((estado) => (
                                    <MenuItem
                                        key={estado.m_nIdEstado}
                                        value={estado.m_nIdEstado}
                                    >
                                        {estado.m_sEstado}
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                    </Grid>
                    <Grid item xs={2}>
                        <FormControl className="input select" fullWidth variant="outlined" size="small">
                            <InputLabel id="idMunicipioLabel">Municipio</InputLabel>
                            <Select
                                fullWidth
                                labelId={"idMunicipioLabel"}
                                label={"Municipio"}
                                className="form-control"
                                value={state.idMunicipio}
                                onChange={handleChangeState}
                                id="idMunicipio"
                                name="idMunicipio"
                                disabled={consult}
                                InputProps={{name: "idMunicipio"}}
                            >
                                {dataMunicipio.map((municipio) => (
                                    <MenuItem
                                        key={municipio.m_sCodigoMunicipio}
                                        value={municipio.m_sCodigoMunicipio}
                                    >
                                        {municipio.m_sMunicipio}
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                    </Grid>
                    <Grid item xs={2}>
                    <FormControl className="input select" fullWidth variant="outlined" size="small">
                    <div className="row" style={{display:"flex",justifyContent:"space-evenly",marginLeft:"-60px"}}>


                    <label className="checkbox">
                                                                                No aplican entregas
                   
                    </label> <input
                                                                                onChange={handleCheck}
                                                                                type="checkbox"
                                                                                checked={state.aplicaEntrega}
                                                                                style={{ height: "20px",left:"150px",top:"1px"}}
                                                                                name="aplicaEntrega"
                                                                                id="aplicaEntrega"
                                                                            />
                                                                     
                    </div>
                    </FormControl>
                    </Grid>
                    <Grid item xs={12}>
                        <Button fullWidth type={"button"} className="btn btn-primary primary-btn" onClick={handleGetCPS} disabled={consult}>
                            Buscar Códigos Postales
                        </Button>
                    </Grid>
                </Grid>
            </div>
            <div className="row" style={{ height: 500, margin: 50}}>
                <CPTransferList
                    onChange={onChangeList}
                    allItems={allCP}
                    selectedItems={state.selectedCP}
                    consult={consult}
                />
            </div>

        </div>
    )
}

export default CodigosPostalesZonas