import React, {Component, useEffect, useState} from 'react';
import PropTypes from 'prop-types';
import Cabecera from '../../Components/Template/Cabecera';
import BarraLateralIzquierda from '../../Components/Template/BarraLateralIzquierda';
import CrearTarifa from './CrearTarifa';
import Noty from 'noty';
import axios from "axios";
import SvgIcon from "@mui/material/SvgIcon";
import { ReactComponent as Activo } from "../../iconos/Menu/palomita.svg";
import { ReactComponent as NoActivo } from "../../iconos/Menu/cruz.svg";
import $ from "jquery";
import {API_HEADERS, dataGridLocaleText} from '../../Constants';
import {FormControl, InputLabel, MenuItem, Select, Tooltip} from '@mui/material';
import { validarPermisos } from '../../Util/Contexts/UsuarioContext';
import {
    agregarTarifa,
    eliminarTarifa,
    modificarTarifa,
    obtenerTarifaBy,
    obtenerTarifasByTipo
} from "../../Util/Contexts/TarifasContext";
import {obtenerParametrosConfiguracion} from "../../Util/Contexts/ParametrosConfiguracionContext";
import {ContentState, EditorState} from "draft-js";
import htmlToDraft from "html-to-draftjs";
import TarifasRangos from "./TarifasRangos";
import {getCurrentDate, getCurrentDateTime, getCurrentTime, validarDerecho} from "../../Util/Util"
import makeStyles from '@mui/styles/makeStyles';
import withStyles from '@mui/styles/withStyles';
import CrearTarifaRegion from "./CrearTarifaRegion";
import TarifasRegion from "./TarifasRegion";
import { confirmAlert } from 'react-confirm-alert';

window.jQuery = window.$ = $;
/*function showSuccess(mensaje) {
    new Noty({
        type: "information",
        layout: "topCenter",
        text: mensaje,
        timeout: "3000"
    }).show()
}*/

function Tarifa(){
    const [state, setState] = useState({
        data: [],
        agregar: "Agregar",
        height: window.innerHeight,
        CreadoPor: localStorage.getItem("UsuarioId"),
        ModificadoPor: localStorage.getItem("UsuarioId"),
        pantalla: 1,
        selected: {},
        DerechoBorrar: 1, //TODO: Definir id
        dataSucursal: [],
        columns: [],
        mostrarColumnasPesoVolumen: false,
        configuraciones: null,
    })

    useEffect(value => {
        getParametrosConfiguracion()
    }, [])


    const getTarifas = (idTipoTarifa) => {
        obtenerTarifasByTipo(idTipoTarifa).then(respuesta => {
            setState(state =>{
                return {
                    ...state,
                    data: respuesta.data,
                    agregar: "Agregar"
                }
            })
        })
    }

    const getParametrosConfiguracion = () =>  {
        obtenerParametrosConfiguracion().then(respuesta => {
            setState(state =>{
                return{
                    ...state,
                    configuraciones: {
                        TipoTarifaTarifas: respuesta.data.TipoTarifaTarifas || 0,
                        IdConceptoFlete: respuesta.data.IdConceptoFlete || 0,
                        IdConceptoCarga: respuesta.data.IdConceptoCarga || 0,
                        IdConceptoDescarga: respuesta.data.IdConceptoDescarga || 0,
                        IdConceptoRecoleccion: respuesta.data.IdConceptoRecoleccion || 0,
                        IdConceptoEntrega: respuesta.data.IdConceptoEntrega || 0,
                        IdConceptoSeguro: respuesta.data.IdConceptoSeguro || 0,
                        IdConceptoCita: respuesta.data.IdConceptoCita || 0,
                        CobrarConceptoCarga: respuesta.data.CobrarConceptoCarga || false,
                        CobrarConceptoDescarga: respuesta.data.CobrarConceptoDescarga || false
                    },
                }
            })
            getTarifas(respuesta.data.TipoTarifaTarifas)
        })
    }

    return(
        <div >
            <header className="topbar clearfix">
                <Cabecera titulo="Tarifas" >
                    <div className="page-header">
                        <ul className="list-page-breadcrumb">
                            <li>
                                <a href="/Catalogos" className="color-mapeo">
                                    Catálogos <i className="zmdi zmdi-chevron-right" />
                                </a>
                            </li>
                            <li className="active-page">Tarifas</li>
                        </ul>
                    </div>
                </Cabecera>
            </header>

            {/*Leftbar Start Here*/}
            <aside className="iconic-leftbar" style={{ minHeight: state.height }}>
                <BarraLateralIzquierda />
            </aside>

            {
                state.configuraciones?.TipoTarifaTarifas === 2 &&
                    <TarifasRangos
                        configuraciones={state.configuraciones}
                    />
            }
            {
                state.configuraciones?.TipoTarifaTarifas === 3 &&
                    <TarifasRegion
                        configuraciones={state.configuraciones}
                    />
            }

        </div >
    )
}

/* export default Tarifas; */
export default Tarifa;