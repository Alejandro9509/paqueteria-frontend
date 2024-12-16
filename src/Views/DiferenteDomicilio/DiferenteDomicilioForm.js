import React, {useEffect, useState} from "react";
import {Grid, MenuItem} from "@mui/material";
import InputLabel from "@mui/material/InputLabel";
import Select from "@mui/material/Select";
import FormControl from "@mui/material/FormControl";
import {obtenerMunicipiosByIdEstado} from "../../Util/Contexts/MunicipiosContext";
import TextField from "@mui/material/TextField";
import Noty from "noty";
import Autocomplete from '@mui/material/Autocomplete';
import {obtenerZonaOperativaByIdCodigoPostal,obtenerParametrosDestino} from "../../Util/Contexts/ZonaOperativaContext";
import {obtenerCodigosPostalesPorEstadoMunicipio} from "../../Util/Contexts/CodigoPostalContext";
import {obtenerPaises} from "../../Util/Contexts/PaisesContext";
import {obtenerAllEstados} from "../../Util/Contexts/EstadosContext";

function showSuccess(mensaje) {
    new Noty({
        type: "information",
        layout: "topCenter",
        text: mensaje,
        timeout: "8000",
    }).show();
}
/** PROPS
 value= objeto con los datos a mostrar en los inputs
 onChange= funcion que retorna datos actualizados
 disabled= booleano de desabilita inputs
 requiered= booleano que define si todos los campos sin necesarios
 dataEstados= listado de estados a mostrar
 listadoEstadosLocal= booleano que indica si el listado de estados se obtendra del mismo componente o de props*/
export default function DiferenteDomicilioForm(props){

    const [dataEstados, setDataEstados] = useState([])
    const [dataPaises, setDataPaises] = useState([])
    const [dataMunicipios, setDataMunicipios] = useState([])
    const [dataZonasOperativas, setDataZonasOperativas] = useState([])
    const [dataCodigosPostales, setDataCodigosPostales] = useState([])

    const [state, setState] = useState({
        idPais: props.value.idPais || null,
        pais: props.value.pais || null,
        idEstado: props.value.idEstado || null,
        estado: props.value.estado || null,
        idMunicipio: props.value.idMunicipio || null,
        municipio: props.value.municipio || null,
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
                        pais: dataPaises.find(i => i.m_nIdPais === event.target.value)?.m_sPais,
                        idEstado: null,
                        estado: null,
                        idMunicipio: null,
                        municipio: null,
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
                        estado: props.listadoEstadosLocal ? dataEstados.find(i => i.m_nIdEstado === event.target.value)?.m_sEstado : props.dataEstados.find(i => i.m_nIdEstado === event.target.value)?.m_sEstado,
                        idMunicipio: null,
                        municipio: null,
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
                        municipio: dataMunicipios.find(i => i.m_sCodigoMunicipio === event.target.value)?.m_sMunicipio,
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
        if (input === "codigoPostal" && newValue.m_nIdCP){
            obtenerZonaOperativaByIdCodigoPostal(newValue.m_nIdCP).then(({data}) => {
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
                            idPais: respuesta.data.find(i => i.m_sCodigo === "MEX").m_nIdPais,
                            pais: respuesta.data.find(i => i.m_sCodigo === "MEX").m_sPais
                        }
                    })
                }
            })
        }
    }

    const getAllEstados = () => {
        obtenerAllEstados().then((respuesta) => {
            setDataEstados(respuesta.data);
        });
    }

    useEffect(() => {
        getPaises()
        if (props.listadoEstadosLocal){
            getAllEstados()
        }
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

    useEffect(()=>{
        if(props.guia)
            obtenerParametrosDestino(props.guia.id).then(({data})=>{
                if(data[0].IdPais==1)
                setState({...state,idPais:data[0].IdPais, idEstado: data[0].IdEstado,idMunicipio:data[0].CodigoMunicipio,
                codigoPostal: {m_sCP:data[0].CodigoPostal,codigoFueradeZonaOperativa:data[0].codigoFueraDeZonaOperativa,m_bNoAplicaEntrega:data[0].m_bNoAplicaEntrega,
                    m_sColonia:data[0].Colonia,m_nIdCP:data[0].IdCodigoPostal},estado:data[0].Estado,municipio:data[0].Municipio,domicilio:data[0].domicilio,zonaOperativa:{m_sCodigoZona:data[0].CodigoZona,m_nIdZona:data[0].IdZona}})
         })
    },props)

    return(
        <Grid container spacing={2}>
            <Grid item xs={3}>
                <FormControl
                    className="input select"
                    fullWidth variant="outlined"
                    size="small"
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
                    size="small"
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
                        {props.listadoEstadosLocal ?
                            dataEstados.filter(i => parseInt(i.m_nIdPais) === parseInt(props.value.idPais)).map((estado) => (
                                <MenuItem
                                    key={estado.m_nIdEstado}
                                    value={estado.m_nIdEstado}
                                >
                                {estado.m_sEstado}
                            </MenuItem>)) :
                            props.dataEstados.filter(i => parseInt(i.m_nIdPais) === parseInt(props.value.idPais)).map((estado) => (
                                <MenuItem
                                    key={estado.m_nIdEstado}
                                    value={estado.m_nIdEstado}
                                >
                                    {estado.m_sEstado}
                                </MenuItem>))
                        }
                    </Select>
                </FormControl>
            </Grid>
            <Grid item xs={3}>
                <FormControl
                    className="input select"
                    fullWidth
                    variant="outlined"
                    size="small"
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
                    size="small"
                    disableClearable
                    forcePopupIcon={false}
                    options={dataCodigosPostales}
                    getOptionDisabled={(option) => option.m_bNoAplicaEntrega || option.codigoFueraDeZonaOperativa}
                    getOptionLabel={(option) => (
                        option.m_sCP ?
                            `${option.m_sCP} - ${option.m_sColonia ? option.m_sColonia : option.m_sLocalidad}`
                            : ''
                    )}
                    onKeyDown={e => {
                        if (e.code === "Enter") {
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
                                size="small"
                                variant="outlined"
                                onClick={(e) => handleClickCodigosPostalesInput("codigoPostal")}
                                required={props.required}
                                onKeyDown={e => {
                                    if (e.key === "Enter") {
                                       let value = {
                                        m_sCP:e.target.value
                                       }
                                        handleChangeAutocomplete("codigoPostal",value )
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
                    size="small"
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
                            size="small"
                            required
                            {...params}
                        />
                    }
                />
            </Grid>
            <Grid item xs={4}>
                <TextField variant="outlined"
                           size="small"
                           onChange={handleOnChange}
                           className="form-control"
                           type="text"
                           label="Calle y número"
                           fullWidth
                           value={props.value.domicilio}
                           disabled={props.disabled}
                           name="domicilio"
                           required={props.required}
                />
            </Grid>
            <Grid item xs={4}>
                <TextField variant="outlined"
                           size="small"
                           onChange={handleOnChange}
                           className="form-control"
                           type="text"
                           fullWidth
                           label="Entregar En"
                           value={props.value.detalles}
                           disabled={props.disabled}
                           name="detalles"
                           required={props.required}
                />
            </Grid>
            <Grid item xs={4}>
                <TextField variant="outlined"
                           size="small"
                           onChange={handleOnChange}
                           className="form-control"
                           type="text"
                           fullWidth
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