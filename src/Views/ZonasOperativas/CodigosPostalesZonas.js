import React, {useEffect, useState} from "react";
import {FormControl, Grid, InputLabel, Select} from "@material-ui/core";
import TextField from "@material-ui/core/TextField";
import {obtenerSucursales} from "../../Util/Contexts/SucursalContext";
import {obtenerEstadosPais} from "../../Util/Contexts/EstadosContext";
import CPTransferList from "./CPTransferList";
import {obtenerMunicipiosByIdEstado} from "../../Util/Contexts/MunicipiosContext";
import {obtenerCodigosPostalesPorEstadoMunicipio} from "../../Util/Contexts/CodigoPostalContext";

function not(a, b) {
    return a.filter((value) => b.find(v => v.m_nIdCP == value.m_nIdCP) === undefined);
}

function CodigosPostalesZonas({seleccion, onChange,consult}) {
    const [state, setState] = useState({
        idSucursal: localStorage.getItem("Sucursal"),
        idZona: '',
        codigoZona: '',
        idEstado: '',
        idMunicipio: '',
        selectedCP: [],
    })

    const [allCP, setAllCP] = useState([])
    const [dataSucursal, setDataSucursal] = useState([])
    const [dataEstados, setDataEstados] = useState([])
    const [dataMunicipio, setDataMunicipios] = useState([])

    useEffect(value => {
        getAllSucursales()
        getAllEstados()
    }, [])

    useEffect( value => {
        setState(state => {
            return {
                idZona: seleccion.m_nIdZona ? seleccion.m_nIdZona : 0,
                idSucursal: seleccion.m_nIdSucursal ? seleccion.m_nIdSucursal: localStorage.getItem("Sucursal"),
                codigoZona: seleccion.m_sCodigoZona ? seleccion.m_sCodigoZona : '',
                idEstado: seleccion.m_sIdEstado ? seleccion.m_sIdEstado: '',
                estado: seleccion.m_sEstado ? seleccion.m_sEstado : '',
                municipio: seleccion.m_sMunicipio ? seleccion.m_sMunicipio : '',
                idMunicipio: seleccion.m_sCodMunicipio ? seleccion.m_sCodMunicipio : '',
                selectedCP: seleccion.m_arrCPs ? seleccion.m_arrCPs : [],
            }
        })
        if (!seleccion.m_arrCPs){
            setAllCP([])
        }
        if (seleccion.m_sIdEstado && seleccion.m_sCodMunicipio){
            obtenerCodigosPostalesPorEstadoMunicipio(seleccion.m_sIdEstado, seleccion.m_sCodMunicipio).then(({data}) => {
                setAllCP(not(data,seleccion.m_arrCPs))
            })
        }
    }, [seleccion])

    useEffect(value =>{
        if (state.idEstado){
            getMunicipiosByIdEstado(state.idEstado)
        }
    },[state.idEstado])

    useEffect(value =>{
        onChange(state)
    }, [state])

    const getAllSucursales = () => {
        obtenerSucursales().then((respuesta) => {
            setDataSucursal(respuesta.data);
        });
    }

    const getAllEstados = () => {
        obtenerEstadosPais(1).then((respuesta) => {
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
            let municipio = dataMunicipio.find((i) => i.m_sCodigoMunicipio == target.value).m_sMunicipio
            setState(state => {
                return {
                    ...state,
                    [target.name]: target.value,
                    municipio: municipio
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
        obtenerCodigosPostalesPorEstadoMunicipio(state.idEstado, state.idMunicipio).then(({data}) => {
            setAllCP(data)
        })
    }

    return(
        <div>
            <div className="row">
                <Grid container spacing={2}>
                    <Grid item xs={3}>
                        <div className="input">
                            <TextField
                                fullWidth
                                margin="dense"
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
                    <Grid item xs={3}>
                        <FormControl className="input select" fullWidth variant="outlined" margin="dense">
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
                                disabled="disabled"
                            >
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
                        <FormControl className="input select" fullWidth variant="outlined" margin="dense" required>
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
                                    <option
                                        key={estado.m_nIdEstado}
                                        value={estado.m_nIdEstado}
                                    >
                                        {estado.m_sEstado}
                                    </option>
                                ))}
                            </Select>
                        </FormControl>
                    </Grid>
                    <Grid item xs={2}>
                        <FormControl className="input select" fullWidth variant="outlined" margin="dense" required>
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
                                    <option
                                        key={municipio.m_sCodigoMunicipio}
                                        value={municipio.m_sCodigoMunicipio}
                                    >
                                        {municipio.m_sMunicipio}
                                    </option>
                                ))}
                            </Select>
                        </FormControl>
                    </Grid>
                    <Grid item xs={2}>
                        <button type={"button"} className="btn btn-primary primary-btn" onClick={handleGetCPS} disabled={consult}>
                            Buscar Codigos Postales
                        </button>
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