import React, {Component, useEffect, useState} from 'react';
import PropTypes from 'prop-types';
import {
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    FormControl,
    InputLabel, MenuItem, Select,
    Typography
} from "@material-ui/core";
import DiferenteDomicilioForm from "../DiferenteDomicilio/DiferenteDomicilioForm";
import ConfirmarUbicacion from "../../Components/Map/ConfirmarUbicacion";
import {obtenerMunicipiosByIdEstado} from "../../Util/Contexts/MunicipiosContext";
import {cambiarEstatusGuia} from "../../Util/Contexts/GuiaContext";
import Noty from "noty";
import {getAddressFormated} from "../../Util/Util";


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
    const [dataMunicipios, setDataMunicipios] = useState([])

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
        showConfirmarUbicacion: false
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
        })
        resetEntregaDD()
    }

    useEffect(() => {
        if (entregaDD.idEstado && entregaDD.idEstado.length > 0){
            obtenerMunicipiosByIdEstado(entregaDD.idEstado).then(({data}) =>{
                setDataMunicipios(data)
            })
        }

    }, [entregaDD.idEstado])

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
        if ((!entregaDD.latitud) || (!entregaDD.longitud)){
            showSuccess("Confirme el punto de entrega con el mapa, presionando el botón CONFIRMAR UBICACION.")
            return
        }
        let params = {}
        params.m_nIdEstatusGuia = state.idEstatusGuia

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
                colonia: '',
                ciudad: entregaDD.municipio,
                estado: entregaDD.estado,
                pais: entregaDD.pais,
                codigoPostal: entregaDD.codigoPostal?.m_sCP,
                direccionCompleta: getAddressFormated(
                    entregaDD.domicilio,
                    null,
                    null,
                    null,
                    entregaDD.codigoPostal?.m_sCP,
                    entregaDD.municipio,
                    entregaDD.estado,
                    entregaDD.pais
                )
            }
        }
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
                <Typography variant={"h3"}>Cambiar Estatus</Typography>
            </DialogTitle>
                <DialogContent>
                    <label className="input select" style={{width: "100%"}}>
                        <FormControl fullWidth variant="outlined"
                                     margin="dense">
                            <InputLabel id="idEstatusGuiaLabel"> Estatus de la
                                Guia</InputLabel>
                            <Select
                                labelId="idEstatusGuiaLabel"
                                label="Estatus de la Guia"
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
                                {props.dataEstatusGuia.filter(i => i.m_nIdEstatusGuia === 14).map(
                                    (estatusGuia) => {
                                        if (props.guia?.EntregaEnSucursal){
                                            return (
                                                <MenuItem
                                                    key={estatusGuia.m_nIdEstatusGuia}
                                                    value={estatusGuia.m_nIdEstatusGuia}>
                                                    {estatusGuia.m_sEstatus}
                                                </MenuItem>
                                            )
                                        }else{
                                            return null
                                        }
                                    }
                                )}
                            </Select>
                        </FormControl>
                    </label>
                    <DiferenteDomicilioForm
                        value={entregaDD}
                        onChange={handleOnChangeEntregaDD}
                        disabled={false}
                        requiered={false}
                        listadoEstadosLocal={true}
                    />
                    <p>
                        <span>Latitud: {entregaDD.latitud || "Indefinida"}</span>
                        <br/>
                        <span>Longitud: {entregaDD.longitud || "Indefinida"}</span>
                    </p>
                    <Button onClick={() => mostrarDialogoMapa(true)} variant={"outlined"} disabled={!sonDatosEntregaValidos}>Confirmar ubicación</Button>
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
