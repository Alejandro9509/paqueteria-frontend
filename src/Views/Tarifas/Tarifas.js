import React, {Component, useEffect, useState} from 'react';
import PropTypes from 'prop-types';
import Cabecera from '../../Components/Template/Cabecera';
import BarraLateralIzquierda from '../../Components/Template/BarraLateralIzquierda';
import CrearTarifa from './CrearTarifa';
import Noty from 'noty';
import axios from "axios";
import SvgIcon from "@material-ui/core/SvgIcon";
import { ReactComponent as Activo } from "../../iconos/Menu/palomita.svg";
import { ReactComponent as NoActivo } from "../../iconos/Menu/cruz.svg";
import { DataGrid } from '@material-ui/data-grid';
import $ from "jquery";
import {API_HEADERS, dataGridLocaleText} from '../../Constants';
import {FormControl, InputLabel, MenuItem, Select, Tooltip} from '@material-ui/core';
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
import {makeStyles} from "@material-ui/core/styles";
import { withStyles } from '@material-ui/core/styles';
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
        // definirColumnas()
        getParametrosConfiguracion()
    }, [])
/*
    const handleShowAgregar = (event) => {
        event.stopPropagation();
        setState(state => {
            return {
                ...state,
                pantalla: 2,
                consult: false,
                agregar: "Agregar",
                selected: null,
            }
        });
        $('.nav-tabs li ').removeClass('active');
        $('.nav-tabs li').eq(1).addClass('active');
        $('.tab-content div ').removeClass('in show');
        $('#Agregar').addClass('in show');
    }*/
/*
    const handleShowModificar = (id) => {
        obtenerTarifaBy(id).then(respuesta => {
            setState(state => {
                return {
                    ...state,
                    pantalla: 2,
                    openDialog: true,
                    agregar: "Modificar",
                    consult: true,
                    selected: respuesta.data,
                }
            })
            // mostrarDataTarifa(respuesta)
            $('.nav-tabs li ').removeClass('active');
            $('.nav-tabs li').eq(1).addClass('active');
            $('.tab-content div ').removeClass('in show');
            $('#Agregar').addClass('in show');
        });
    }

    const handleShowConsultar = (id) => {
        obtenerTarifaBy(id).then(respuesta => {
            setState(state => {
                return {
                    ...state,
                    pantalla: 2,
                    agregar: "Consultar",
                    openDialog: true,
                    consult: true,
                    selected: respuesta.data,
                }
            })
            // mostrarDataTarifa(respuesta)
            $('.nav-tabs li ').removeClass('active');
            $('.nav-tabs li').eq(1).addClass('active');
            $('.tab-content div ').removeClass('in show');
            $('#Agregar').addClass('in show');
        });
    }

    const handleEliminar = (id) => {
        let derecho;
        validarPermisos(state).then(respuesta => {
            derecho = respuesta.data;
            if (derecho == false) {
                showSuccess("El usuario no tiene derechos para realizar el proceso");
                return;
            }
            eliminarTarifa(id,state.ModificadoPor).then(respuesta => {
                showSuccess("Registro eliminado")
                getTarifas(state.configuraciones.TipoTarifaTarifas);
            }).catch(err => {
                showSuccess(err)
            });
        }).catch(err => {
            showSuccess(err)
        });
    }*/
/*

    const handleAceptar = (data) => {
        let params = {
            codigo: data.codigoTarifa,
            idOrigen: data.origen,
            fleteMinimo: data.precioFlete,
            productos: data.dataProductosSeleccionados,
            destinos: data.dataDestinosSeleccionados,
            creadoPor: localStorage.getItem("UsuarioId"),
            tipo: state.configuraciones?.TipoTarifaTarifas,
            idCliente: data.cliente?.m_nIdCliente || 0,
        }
        console.log(JSON.stringify(params))
        console.log(params)
        if (state.selected?.m_nIdTarifa > 0) {
            modificarTarifa(state.selected.m_nIdTarifa, params).then(respuesta => {
                if (respuesta.data.Estatus){
                    showSuccess("Modificado con éxito")
                    handleShowListado()
                }else {
                    showSuccess("Hubo un error al agregar")
                }
            }).catch(err => {
                console.log(err)
                showSuccess("Hubo un error al modificar")
            });
        } else {
            agregarTarifa(params).then(respuesta => {
                if (respuesta.data.Estatus){
                    showSuccess("Agregado con éxito")
                    handleShowListado()
                }else {
                    showSuccess("Hubo un error al agregar")
                }
            }).catch(err => {
                console.log(err)
                showSuccess("Hubo un error al agregar")
            });
        }

    }
*/
/*

    const handleShowListado = (event) => {
        if (event !== undefined){
            event.stopPropagation();
        }
        setState(state => {
            return {
                ...state,
                pantalla: 1,
                consult: false,
                openDialog:false,
                agregar: "Agregar"
            }
        });
        $('.nav-tabs li ').removeClass('active');
        $('.nav-tabs li').eq(0).addClass('active');
        $('.tab-content div ').removeClass('in show');
        $('#Listado').addClass('in show');
        definirColumnas()
        getTarifas(state.configuraciones.TipoTarifaTarifas);
    }
*/

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
                        CobroCargaDescargaTarifa: respuesta.data.CobroCargaDescargaTarifa
                    },
                }
            })
            getTarifas(respuesta.data.TipoTarifaTarifas)
        })
    }

    /**Se definen las columnas que se van a mostrar en el listado de tarifas*/
    /*const definirColumnas = () => {

        let columns = []
        if (state.mostrarColumnasPesoVolumen){
            columns.push(
                {
                    headerName: "Precio m³",
                    field: "m_cPrecioM3",
                    flex: 1,
                    valueFormatter: (params) => `$${parseFloat(params.value).toFixed(2)}`,
                    minWidth: 200,
                },
                {
                    headerName: "Precio Kilo",
                    field: "m_cPrecioKilo",
                    flex: 1,
                    valueFormatter: (params) => `$${parseFloat(params.value).toFixed(2)}`,
                    minWidth: 125,
                },
                {
                    headerName: "Flete mínimo",
                    field: "m_cFleteMinimo",
                    flex: 1,
                    valueFormatter: (params) => `$${parseFloat(params.value).toFixed(2)}`,
                    minWidth: 125,
                },
                {
                    headerName: "Monto mínimo",
                    field: "m_cMontoMinimo",
                    flex: 1,
                    valueFormatter: (params) => `$${parseFloat(params.value).toFixed(2)}`,
                    minWidth: 125,
                },
            )
        }
        columns.push(
            {
                headerName: "Acciones",
                sortable: false, filterable: false,
                field: "",
                minWidth: 250,
                renderCell: (row) => {
                    return (
                        <div>
                            <Tooltip title="Modificar" >
                                <a href="#Agregar" role="tab" data-toggle="tab" onClick={() => (handleShowModificar(row.row.m_nIdTarifa))} className="btn btn-default btn-xs"><i className="fa fa-pencil-square-o" style={{ color: "#F9A03E" }} /></a>

                            </Tooltip>
                            <Tooltip title="Consultar">
                                <a href="#Agregar" role="tab" data-toggle="tab" className="btn btn-default btn-xs" onClick={() => (handleShowConsultar(row.row.m_nIdTarifa))}><i className="fa fa-eye" style={{ color: "#F9A03E" }} /></a>

                            </Tooltip>
                            <Tooltip title="Eliminar">
                                <a href="#" className="btn btn-default btn-xs" onClick={() => (handleEliminar(row.row.m_nIdTarifa))}><i className="zmdi zmdi-delete" style={{ color: "#F30B0B" }} /></a>
                            </Tooltip>

                        </div>
                    )
                }
            },
            {
                headerName: "Código",
                field: "m_sCodigo",
                width: 300,
            },{
                headerName: "Cliente",
                field: "Cliente",
                width: 500,
            },
            {
                headerName: "Origen",
                field: "m_sOrigen",
                flex: 1,
                minWidth: 300,
            },
            {
                headerName: "Destino",
                field: "m_sDestino",
                flex: 1,
                minWidth: 300,
            },

            /!*{
                headerName: "Activo",
                field: "m_bActivo",
                width: 100,
                renderCell: (row) => {
                    return (
                        <div
                            style={{
                                width: "100%",
                                textAlign: "center",
                                color: row.row.m_bActivo == 'true' ? "green" : "red",
                            }}
                        >
                            {row.row.m_bActivo ? (
                                <SvgIcon component={Activo} />
                            ) : (
                                <SvgIcon component={NoActivo} />
                            )}
                        </div>
                    );
                },
            },*!/
        )

        setState(state => {
            return{
                ...state,
                columns: columns
            }
        })
    }*/


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


            {/*{
                state.configuraciones?.TipoTarifaTarifas === 1 &&
                    <section className="main-container">
                    <div className="container-fluid">


                        <ul className="nav navStatica nav-tabs">
                            <li className="active">
                                <a onClick={(event) => handleShowListado(event)}>
                                    <i className="fa fa-list"/> Listado
                                </a>
                            </li>
                            <li >
                                <a onClick={handleShowAgregar}>
                                    <i className="fa fa-plus-circle"/> {state.agregar}
                                </a>
                            </li>

                            <li>
                                <a data_id="3">
                                    <i className="fa fa-times-circle"/> Imprimir
                                </a>
                            </li>



                            *<button className="topbar-right pull-right">Boton</button>
                        </ul>


                        <div
                            className="row"
                            className="tab-content"
                            style={{ paddingLeft: "-15px" }}
                        >
                            <div id="Listado" className="tab-pane fade in show">
                                <div className="widget-wrap">
                                    <div className="widget-content">
                                        <div className="row" style={{ height: state.height - 250, width: '100%' }}>
                                            <DataGrid
                                                localeText={dataGridLocaleText}
                                                rows={state.data}
                                                columns={state.columns}
                                                density="compact"
                                                pageSize={Math.floor((state.height - 310) / 30)}
                                                getRowId={(row) => row.m_nIdTarifa}
                                                onRowSelected={(row) => {
                                                    setState({
                                                        ...state,
                                                        idTarifa: row.data.m_nIdTarifa
                                                    })
                                                }}
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div id="Agregar" className="tab-pane fade">
                                {
                                    (state.pantalla == 2 && state.configuraciones?.TipoTarifaTarifas === 3) &&
                                    <CrearTarifaRegion edit={state.edit} consult={state.consult} select={state.selected}
                                                       onSubmit={handleAceptar}
                                                       listaCiudades={state.dataCiudades}
                                                       disabled={state.agregar == "Consultar"}
                                    />
                                }

                            </div>

                        </div>
                    </div>
                </section>
            }*/}
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