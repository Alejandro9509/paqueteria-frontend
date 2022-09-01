import React, {useEffect, useState} from "react";
import {Grid, MenuItem} from "@material-ui/core";
import InputLabel from "@material-ui/core/InputLabel";
import Select from "@material-ui/core/Select";
import FormControl from "@material-ui/core/FormControl";
import {obtenerMunicipiosByIdEstado} from "../../Util/Contexts/MunicipiosContext";
import TextField from "@material-ui/core/TextField";
import Noty from "noty";
import Autocomplete from "@material-ui/lab/Autocomplete";
import {obtenerZonaOperativaByIdCodigoPostal} from "../../Util/Contexts/ZonaOperativaContext";
import {obtenerCodigosPostalesPorEstadoMunicipio} from "../../Util/Contexts/CodigoPostalContext";
import {obtenerPaises} from "../../Util/Contexts/PaisesContext";

function showSuccess(mensaje) {
    new Noty({
        type: "information",
        layout: "topCenter",
        text: mensaje,
        timeout: "8000",
    }).show();
}
export default function DiferenteDomicilioForm(props){

    const [dataEstados, setDataEstados] = useState([])
    const [dataPaises, setDataPaises] = useState([])
    const [dataMunicipios, setDataMunicipios] = useState([])
    const [dataZonasOperativas, setDataZonasOperativas] = useState([])
    const [dataCodigosPostales, setDataCodigosPostales] = useState([])

    const [state, setState] = useState({
        idPais: props.value.idPais || null,
        idEstado: props.value.idEstado || null,
        idMunicipio: props.value.idMunicipio || null,
        codigoPostal: props.value.codigoPostal || null,
        zonaOperativa: props.value.zonaOperativa || null,
        domicilio: props.value.domicilio || null,
        detalles: props.value.detalles || null,
        datosAdicionales: props.value.datosAdicionales || null,
        latitud: props.value.latitud || null,
        longitud: props.value.longitud || null
    })

    const handleOnChange = (event) => {
        event.preventDefault();
        switch (event.target.name) {
            case 'idPais':
                setState(state => {
                    return{
                        ...state,
                        [event.target.name]: event.target.value,
                        idEstado: null,
                        idMunicipio: null,
                        codigoPostal: null,
                        zonaOperativa: null,
                    }
                });
                break;
            case 'idEstado':
                setState(state => {
                    return{
                        ...state,
                        [event.target.name]: event.target.value,
                        idMunicipio: null,
                        codigoPostal: null,
                        zonaOperativa: null,
                    }
                });
                break;
            case 'idMunicipio':
                setState(state => {
                    return{
                        ...state,
                        [event.target.name]: event.target.value,
                        codigoPostal: null,
                        zonaOperativa: null,
                    }
                });
                break;
            default:
                setState(state => {
                    return{
                        ...state,
                        [event.target.name]: event.target.value,
                    }
                });
        }
    }
    const handleChangeAutocomplete = (input, newValue) => {
      
        if (input === "codigoPostal" && newValue.m_sCP){
            obtenerZonaOperativaByIdCodigoPostal(newValue.m_sCP).then(({data}) => {
                
               
                if (data.length > 0){
                    if (data.length === 1){
                        if(data[0].m_bAplicaEntrega){
                        showSuccess(`No aplican entregas en la zona operativa`)
                        setState({
                            ...state,
                            [input]: null,
                            zonaOperativa: null
                        })
                       }else{
                        setState(state => {
                            return {
                                ...state,
                                [input]: newValue,
                                zonaOperativa: data[0]
                            }
                        })
                    }
                    setDataZonasOperativas(data)
                }
                }else{
                    setState(state => {
                        return{
                            ...state,
                            zonaOperativa: null
                        }
                    })
                }
            })
        }
    }

    const handleClickCodigosPostalesInput = (input) => {
        if (input === "codigoPostal"){
            obtenerCodigosPostalesPorEstadoMunicipio(props.value.idEstado, props.value.idMunicipio).then(({data}) => {
                setDataCodigosPostales(data)
            })
        }
    }

    const getPaises = () => {
        if (!dataPaises.length > 0){
            obtenerPaises().then(respuesta => {
                setDataPaises(respuesta.data.filter(i => i.m_sCodigo === "MEX" || i.m_sCodigo === "USA"))
                if (!(props.value.idPais > 0)){
                    setState(state => {
                        return {
                            ...state,
                            idPais: respuesta.data.find(i => i.m_sCodigo === "MEX").m_nIdPais
                        }
                    })
                }
            })

        }
    }

    useEffect(() => {
        getPaises()
    }, [])

    useEffect(() => {
       props.onChange(state)
    }, [state])

    useEffect(() => {
        if (props.value.idEstado && props.value.idEstado.length > 0){
            obtenerMunicipiosByIdEstado(props.value.idEstado).then(({data}) =>{
                setDataMunicipios(data)
            })
        }

    }, [props.value.idEstado])

    return(
        <Grid container spacing={2}>
            <Grid item xs={3}>
                <FormControl
                    className="input select"
                    fullWidth variant="outlined"
                    margin="dense"
                    required={props.required}>
                    <InputLabel
                        id="idEstadoLabel">País</InputLabel>
                    <Select
                        fullWidth
                        labelId="idEstadoLabel"
                        label="País"
                        className="form-control"
                        value={props.value.idPais}
                        onChange={handleOnChange}
                        name="idPais"
                        disabled={props.disabled}
                    >
                        {dataPaises.map((pais) => (
                            <MenuItem
                                key={pais.m_nIdPais}
                                value={pais.m_nIdPais}
                            >
                                {pais.m_sPais}
                            </MenuItem>
                        ))}
                    </Select>
                </FormControl>
            </Grid>
            <Grid item xs={3}>
                <FormControl
                    className="input select"
                    fullWidth variant="outlined"
                    margin="dense"
                    required={props.required}>
                    <InputLabel
                        id="idEstadoLabel">Estado</InputLabel>
                    <Select
                        fullWidth
                        labelId="idEstadoLabel"
                        label="Estado"
                        className="form-control"
                        value={props.value.idEstado}
                        onChange={handleOnChange}
                        name="idEstado"
                        disabled={props.disabled}
                    >
                        {props.dataEstados.filter(i => parseInt(i.m_nIdPais) === parseInt(props.value.idPais)).map((estado) => (
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
            <Grid item xs={3}>
                <FormControl
                    className="input select"
                    fullWidth
                    variant="outlined"
                    margin="dense"
                    required={props.required}>
                    <InputLabel id="idMunicipioLabel">Municipio</InputLabel>
                    <Select
                        fullWidth
                        labelId={"idMunicipioLabel"}
                        label={"Municipio"}
                        className="form-control"
                        value={props.value.idMunicipio}
                        onChange={handleOnChange}
                        name="idMunicipio"
                        disabled={props.disabled}
                        InputProps={{name: "idMunicipio"}}
                    >
                        {dataMunicipios.map((municipio) => (
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
            <Grid item xs={3}>
                <Autocomplete
                    freeSolo
                    onChange={(event, newValue) => handleChangeAutocomplete("codigoPostal", newValue)}
                    value={props.value.codigoPostal}
                    disabled={props.disabled}
                    name="codigoPostal"
                    disableClearable
                    forcePopupIcon={false}
                    options={dataCodigosPostales}
                    getOptionLabel={(option) => (
                        option.m_sCP ?
                            `${option.m_sCP} - ${option.m_sColonia ? option.m_sColonia : option.m_sLocalidad}`
                            : ''
                    )}
                    onKeyDown={e => {
                        if (e.code === "Enter") {
                            console.log(e)
                            e.preventDefault()
                        }
                    }}
                    style={{
                        transform: "translate(14px, 10px) scale(1) !important"
                    }}
                    renderInput={(params) => (
                        <div>
                            <TextField
                                label="Código Postal"
                                margin="dense"
                                variant="outlined"
                                onClick={(e) => handleClickCodigosPostalesInput("codigoPostal")}
                                required={props.required}
                                onKeyDown={e => {
                                    if (e.key === "Enter") {
                                        console.log(e)
                                        e.preventDefault()
                                    }
                                }}
                                {...params}
                            />
                        </div>
                    )}
                />
            </Grid>
            <Grid item xs={3}>
                <Autocomplete
                    value={props.value.zonaOperativa}
                    freeSolo
                    onChange={(event, newValue) => handleChangeAutocomplete("zonaOperativa",newValue)}
                    disableClearable
                    forcePopupIcon={false}
                    options={dataZonasOperativas}
                    disabled={true}
                    getOptionLabel={(option) => (
                        option ?
                            option.m_sCodigoZona || 'Código Postal sin zona asignada'
                            : ''
                    )}
                    variant="outlined"
                    name={"zonaOperativa"}
                    style={{transform: "translate(14px, 10px) scale(1) !important"}}
                    renderInput={(params) =>
                        <TextField
                            variant="outlined"
                            label="Zona Operativa"
                            margin="dense"
                            required
                            {...params}
                        />
                    }
                />
            </Grid>
            <Grid item xs={4}>
                <TextField variant="outlined"
                           margin="dense"
                           onChange={handleOnChange}
                           className="form-control"
                           type="text"
                           label="Calle y número"
                           value={props.value.domicilio}
                           disabled={props.disabled}
                           name="domicilio"
                           required={props.required}
                />
            </Grid>
            <Grid item xs={4}>
                <TextField variant="outlined"
                           margin="dense"
                           onChange={handleOnChange}
                           className="form-control"
                           type="text"
                           label="Entregar En"
                           value={props.value.detalles}
                           disabled={props.disabled}
                           name="detalles"
                           required={props.required}
                />
            </Grid>
            <Grid item xs={4}>
                <TextField variant="outlined"
                           margin="dense"
                           onChange={handleOnChange}
                           className="form-control"
                           type="text"
                           label="Datos Adicionales para la Entrega"
                           value={props.value.datosAdicionales}
                           disabled={props.disabled}
                           name="datosAdicionales"
                           required={props.required}
                />
            </Grid>
        </Grid>
    )
}