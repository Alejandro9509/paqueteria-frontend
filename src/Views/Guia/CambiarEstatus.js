import React, {Component, useEffect, useState} from 'react';
import PropTypes from 'prop-types';
import {
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    FormControl, Grid,
    InputLabel, MenuItem, Select,
    Typography
} from "@mui/material";
import DiferenteDomicilioForm from "../DiferenteDomicilio/DiferenteDomicilioForm";
import ConfirmarUbicacion from "../../Components/Map/ConfirmarUbicacion";
import {obtenerMunicipiosByIdEstado} from "../../Util/Contexts/MunicipiosContext";
import {cambiarEstatusGuia} from "../../Util/Contexts/GuiaContext";
import Noty from "noty";
import {getAddressFormated} from "../../Util/Util";
import {obtenerSucursales} from "../../Util/Contexts/SucursalContext";
import TextField from "@mui/material/TextField";
import {obtenerZonaOperativaByIdCodigoPostal} from "../../Util/Contexts/ZonaOperativaContext";


function showSuccess(mensaje) {
    new Noty({
        type: "information",
        layout: "topCenter",
        text: mensaje,
        timeout: "3000"
    }).show()
}

export default CambiarEstatus;

function CambiarEstatus(props){
    const [dataSucursales, setDataSucursales] = useState([])

    const [entregaDD, setEntregaDD] = useState({
        idPais: '',
        pais: '',
        idEstado: '',
        estado: '',
        idMunicipio: '',
        municipio: '',
        codigoPostal: '',
        zonaOperativa: '',
        domicilio: '',
        detalles: '',
        datosAdicionales: '',
        latitud: '',
        longitud: ''
    })

    const [state, setState] = useState({
        idEstatusGuia:'',
        showConfirmarUbicacion: false,
        idSucursalEntrega:'',
        zonaOperativaSucursal: null
    })

    const handleOnChangeEntregaDD = (newValue) => {
        setEntregaDD(entregaDD => {
            return{
                ...entregaDD,
                idPais: newValue.idPais,
                pais: newValue.pais,
                idEstado: newValue.idEstado,
                estado: newValue.estado,
                idMunicipio: newValue.idMunicipio,
                municipio: newValue.municipio,
                codigoPostal: newValue.codigoPostal,
                zonaOperativa: newValue.zonaOperativa,
                domicilio: newValue.domicilio,
                detalles: newValue.detalles,
                datosAdicionales: newValue.datosAdicionales,
                latitud: newValue.latitud,
                longitud: newValue.longitud,
            }
        });
    }

    const sonDatosEntregaValidos = !((entregaDD.idPais === '' || entregaDD.idPais === null)
        || (entregaDD.idEstado === '' || entregaDD.idEstado === null)
        || (entregaDD.idMunicipio === '' || entregaDD.idMunicipio === null)
        || (entregaDD.codigoPostal === '' || entregaDD.codigoPostal === null)
        || (entregaDD.zonaOperativa === '' || entregaDD.zonaOperativa === null)
        || (entregaDD.domicilio === '' || entregaDD.domicilio === null))

    const resetEntregaDD = () =>{
        setEntregaDD({
            idPais: '',
            pais: '',
            idEstado: '',
            estado: '',
            idMunicipio: '',
            municipio: '',
            codigoPostal: '',
            zonaOperativa: '',
            domicilio: '',
            detalles: '',
            datosAdicionales: '',
            latitud: '',
            longitud: ''
        })
    }

    const resetData = () =>{
        setState({
            idEstatusGuia:'',
            idSucursalEntrega:'',
            zonaOperativaSucursal: null
        })
        resetEntregaDD()
    }

    useEffect(() => {
        if (parseInt(state.idEstatusGuia) === 7){
            obtenerSucursales().then(({data}) =>{
                if (dataSucursales.length === 0){
                    setDataSucursales(data)
                }
            })
        }
    }, [state.idEstatusGuia])

    const mostrarDialogoMapa = (isVisible) => {
        setState(state => {
            return {
                ...state,
                showConfirmarUbicacion: isVisible,
            }
        })
    }

    function confirmarUbicacion(coordenadas, e) {
        setEntregaDD(entregaDD => {
            return{
                ...entregaDD,
                latitud: coordenadas.lat,
                longitud: coordenadas.lng,
            }
        });
        mostrarDialogoMapa(false)
    }

    const onSubmit = (e) => {
        e.preventDefault()
        let params = {}
        if (state.idEstatusGuia === 14){
            if ((!entregaDD.latitud) || (!entregaDD.longitud)){
                showSuccess("Confirme el punto de entrega con el mapa, presionando el botón CONFIRMAR UBICACION.")
                return
            }
            params.idPais =  entregaDD.idPais
            params.m_nIdEstadoEntrega =  entregaDD.idEstado
            params.m_sCodigoMunicipioEntrega =  entregaDD.idMunicipio
            params.codigoPostalEntrega =  entregaDD.codigoPostal?.m_nIdCP
            params.m_nIdZonaOperativa =  entregaDD.zonaOperativa?.m_nIdZona
            params.domicilioEntrega =  entregaDD.domicilio
            params.entregarEn =  entregaDD.detalles
            params.datosAdicionales =  entregaDD.datosAdicionales
            params.m_sLatitudD =  entregaDD.latitud
            params.m_sLongitudD =  entregaDD.longitud
        }else if (state.idEstatusGuia === 7){
            if (!(parseInt(state.idSucursalEntrega) > 0)){
                showSuccess("Seleccione una sucursal de entrega.")
                return
            }
            if (!(parseInt(state.zonaOperativaSucursal?.m_nIdZona) > 0)){
                showSuccess("La sucursal necesita pertenecer a una zona operativa.")
                return
            }
            params.idSucursalEntrega =  state.idSucursalEntrega
            params.m_nIdZonaOperativa =  state.zonaOperativa?.m_nIdZona
        }else{
            showSuccess("Seleccione un estatus para la guia")
            return
        }
        params.m_nIdEstatusGuia = state.idEstatusGuia

        console.log(params)
        console.log(JSON.stringify(params))
        params.m_nIdGuia = props.guia.m_nIdGuia

        cambiarEstatusGuia(params).then(({data}) => {
            resetData()
            props.submit(data)
            props.close()
        }).catch(err => {
            showSuccess(err.response?.data)
        })


    }

    const obtenerDatosDireccion = (esRecoleccion) => {
        if (!esRecoleccion){
            return {
                nombreLugar: props.guia.m_sNombreDestinatario,
                numeroInterior: '',
                numeroExterior: '',
                calle: entregaDD.domicilio,
                colonia: entregaDD.codigoPostal?.m_sColonia ||entregaDD.codigoPostal?.m_sLocalidad,
                ciudad: entregaDD.municipio,
                estado: entregaDD.estado,
                pais: entregaDD.pais,
                codigoPostal: entregaDD.codigoPostal?.m_sCP,
                direccionCompleta: getAddressFormated(
                    entregaDD.domicilio,
                    null,
                    null,
                    entregaDD.codigoPostal?.m_sColonia ||entregaDD.codigoPostal?.m_sLocalidad,
                    entregaDD.codigoPostal?.m_sCP,
                    entregaDD.municipio,
                    entregaDD.estado,
                    entregaDD.pais
                )
            }
        }
    }

    const handleChangeSucursalEntrega = (event) => {
        //Evaluar si este setState se usa para algo
        setState(state => {
            return {
                ...state,
                [event.target.name]: event.target.value,
            }
        });
        getZonaOperativaByCodigoPostal(dataSucursales.find(c => parseInt(c.m_nIdSucursal) === parseInt(event.target.value)).m_nIdCodigoPostal)
    };

    const getZonaOperativaByCodigoPostal = (codigoPostal) => {
        obtenerZonaOperativaByIdCodigoPostal(codigoPostal).then(respuesta => {
            setState(state => {
                return{
                    ...state,
                    zonaOperativaSucursal: respuesta.data[0]
                }
            })
        })
    }

    return (
        <>
            {
                state.showConfirmarUbicacion &&
                <ConfirmarUbicacion confirmarUbicacion={confirmarUbicacion} open={state.showConfirmarUbicacion}
                                    titulo={"entrega"}
                                    remitente={false}
                                    mostrarDialogoMapa={mostrarDialogoMapa}
                                    direccion={obtenerDatosDireccion(false)}
                />
            }
            <Dialog open={props.open} onClose={() => {
                resetData()
            props.close()
        }} maxWidth={"md"} fullWidth>
            <DialogTitle>
                <Typography variant={"h3"}>Cambiar Tipo de Entrega</Typography>
            </DialogTitle>
                <DialogContent>
                    <Typography variant={"caption"}>Al cambiar a estatus "Completado" se habilitará la guía para realizar entrega ocurre.</Typography>
                    <br/>
                    <Typography variant={"caption"}>Al cambiar a estatus "Ultima Milla" se habilitará la guía para realizar entrega a domicilio.</Typography>
                    <br/>
                    <br/>
                    <label className="input select" style={{width: "100%"}}>
                        <FormControl fullWidth variant="outlined">
                            <InputLabel id="idEstatusGuiaLabel"> Estatus de la
                                Guia</InputLabel>
                            <Select
                                labelId="idEstatusGuiaLabel"
                                label="Estatus de la Guia"
                                size="small"
                                className="form-control"
                                required
                                onChange={(e) =>  setState({idEstatusGuia: e.target.value})}
                                id="idEstatusGuia"
                                name="idEstatusGuia"
                                read="true"
                                value={state.idEstatusGuia}
                                InputLabelProps={{
                                    shrink: true,
                                }}
                            >
                                {props.dataEstatusGuia
                                    .filter(i => parseInt(i.m_nIdEstatusGuia) === 14 || parseInt(i.m_nIdEstatusGuia) === 7)
                                    .filter(i => parseInt(i.m_nIdEstatusGuia) !== parseInt(props.guia?.m_nIdEstatusGuia)).map(
                                    (estatusGuia) => (
                                        <MenuItem key={estatusGuia.m_nIdEstatusGuia} value={estatusGuia.m_nIdEstatusGuia}>
                                            {estatusGuia.m_sEstatus}
                                        </MenuItem>
                                    )
                                )}
                            </Select>
                        </FormControl>
                    </label>
                    <br/>
                    <br/>
                    {
                        state.idEstatusGuia === 14 &&
                        <div>
                            <DiferenteDomicilioForm
                                value={entregaDD}
                                onChange={handleOnChangeEntregaDD}
                                disabled={false}
                                requiered={false}
                                listadoEstadosLocal={true}
                                guia={props.guia}
                            />
                            <p>
                                <span>Latitud: {entregaDD.latitud || "Indefinida"}</span>
                                <br/>
                                <span>Longitud: {entregaDD.longitud || "Indefinida"}</span>
                            </p>
                            <Button onClick={() => mostrarDialogoMapa(true)} variant={"outlined"} disabled={!sonDatosEntregaValidos}>Confirmar ubicación</Button>
                        </div>
                    }
                    {
                        state.idEstatusGuia === 7 &&
                            <div>

                                <Grid container spacing={1}>
                                    <Grid item xs={12} sm={6}>
                                        <label className="input select" style={{width: "100%"}}>
                                            <FormControl fullWidth variant="outlined" >
                                                <InputLabel id="idSucursalEntrega">Sucursal de Entrega</InputLabel>
                                                <Select
                                                    labelId={"idSucursalEntrega"}
                                                    label="Sucursal de Entrega"
                                                    className="form-control"
                                                    onChange={handleChangeSucursalEntrega}
                                                    value={state.idSucursalEntrega}
                                                    id="idSucursalEntrega"
                                                    name="idSucursalEntrega"
                                                    inputProps={{ name: "idSucursalEntrega" }}
                                                    fullWidth
                                                >
                                                    {dataSucursales.map((sucursal) => (
                                                        <MenuItem key={sucursal.m_nIdSucursal} value={sucursal.m_nIdSucursal} >
                                                            {sucursal.m_sSucursal}
                                                        </MenuItem>
                                                    ))}
                                                </Select>
                                            </FormControl>
                                        </label>
                                    </Grid>
                                    <Grid item xs={12} sm={6}>
                                        <TextField variant="outlined"
                                                   size="small"
                                                   className="form-control"
                                                   type="text"
                                                   label="Zona operativa"
                                                   value={state.zonaOperativaSucursal?.m_sCodigoZona || "NO DETERMINDADA"}
                                                   disabled
                                        />
                                    </Grid>

                                </Grid>
                            </div>
                    }
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => {
                        resetData()
                        props.close()
                    }}>
                        Cancelar
                    </Button>
                    <Button type={"submit"} onClick={(e) => onSubmit(e)}>
                        Aceptar
                    </Button>
                </DialogActions>


        </Dialog>
        </>
    );
}
