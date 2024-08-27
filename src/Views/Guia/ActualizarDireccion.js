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
import {cambiarEstatusGuiaSAT} from "../../Util/Contexts/GuiaContext";
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

export default ActualizarDireccion;

/**@params:
 * onSubmit = funcion que recibe objeto con informacion actualizada
 * open = booleano que indica si mostrar el dialogo principal
 * close = funcion que es llamada al cerrar el dialogo principal
 * idGuia = entero que corresponde a id de la guia
 */
function ActualizarDireccion(props){
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
        /*if ((!entregaDD.latitud) || (!entregaDD.longitud)){
            showSuccess("Confirme el punto de entrega con el mapa, presionando el botón CONFIRMAR UBICACION.")
            return
        }*/
        //params.idPais =  entregaDD.idPais
        params.m_nIdEstadoEntrega =  entregaDD.idEstado
        params.m_sCodigoMunicipioEntrega =  entregaDD.idMunicipio
        params.codigoPostalEntrega =  entregaDD.codigoPostal?.m_nIdCP
        params.m_nIdZonaOperativa =  entregaDD.zonaOperativa?.m_nIdZona
        params.domicilioEntrega =  entregaDD.domicilio
        params.entregarEn =  entregaDD.detalles
        params.datosAdicionales =  entregaDD.datosAdicionales || ""
        // params.m_sLatitudD =  entregaDD.latitud
        // params.m_sLongitudD =  entregaDD.longitud
        console.log(params)
        console.log(JSON.stringify(params))
        params.m_nIdGuia = props.guia.m_nIdGuia
        props.onSubmit(params)



    }

    const obtenerDatosDireccion = (esRecoleccion) => {
        if (!esRecoleccion){
            return {
                nombreLugar: props.guia?.m_sNombreDestinatario,
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
                    <Typography variant={"h3"}>Actualizar dirección</Typography>
                </DialogTitle>
                <DialogContent>
                    {/*<Typography variant={"caption"}>Al cambiar a estatus "Completado" se habilitará la guía para realizar entrega ocurre.</Typography>*/}
                    {/*<br/>*/}
                    {/*<Typography variant={"caption"}>Al cambiar a estatus "Ultima Milla" se habilitará la guía para realizar entrega a domicilio.</Typography>*/}
                    <div>
                        <DiferenteDomicilioForm
                            value={entregaDD}
                            onChange={handleOnChangeEntregaDD}
                            disabled={false}
                            requiered={false}
                            listadoEstadosLocal={true}
                        />
                        {/*<p>
                            <span>Latitud: {entregaDD.latitud || "Indefinida"}</span>
                            <br/>
                            <span>Longitud: {entregaDD.longitud || "Indefinida"}</span>
                        </p>
                        <Button onClick={() => mostrarDialogoMapa(true)} variant={"outlined"} disabled={!sonDatosEntregaValidos}>Confirmar ubicación</Button>*/}
                    </div>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => {
                        resetData()
                        props.close()
                    }}>
                        Cancelar
                    </Button>
                    <Button disabled={!sonDatosEntregaValidos} onClick={(e) => onSubmit(e)}>
                        Aceptar
                    </Button>
                </DialogActions>

            </Dialog>
        </>
    );
}
