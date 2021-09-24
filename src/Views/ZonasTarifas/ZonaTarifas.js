import React, {useEffect, useMemo, useState} from "react";
import Cabecera from "../../Components/Template/Cabecera";
import BarraLateralIzquierda from "../../Components/Template/BarraLateralIzquierda";
import {DataGrid, GridToolbar} from "@material-ui/data-grid";
import {dataGridLocaleText} from "../../Constants";
import $ from "jquery";
import {Tooltip} from "@material-ui/core";
import {confirmAlert} from "react-confirm-alert";
import {eliminarCorte, obtenerCortes} from "../../Util/Contexts/CorteCajaContext";
import ZonaTarifasAgregar from "./ZonaTarifasAgregar";
import Noty from "noty";
import {eliminarZonaTarifa, obtenerListadoZonaTarifa} from "../../Util/Contexts/ZonaTarifaContext";
window.jQuery = window.$ = $;

function showSuccess(mensaje) {
    new Noty({
        type: "information",
        layout: "topCenter",
        text: mensaje,
        timeout: "3000"
    }).show()
}

function ZonaTarifas() {
    const columns = useMemo(() => [
        {
            headerName: "Acciones",
            field: "",
            sortable: false, filterable: false,
            renderCell: (row) => {
                return (
                    <div>
                        <Tooltip title="Modificar">
                            <a href="#Agregar" role="tab" data-toggle="tab"
                               onClick={() => (handleShowModificar(row.row))}
                               className="btn btn-default btn-xs"><i className="fa fa-pencil-square-o"
                                                                     style={{ color: "#F9A03E" }} /></a>
                        </Tooltip>
                        <Tooltip title="Consultar">
                            <a href="#Agregar" role="tab" data-toggle="tab" className="btn btn-default btn-xs"
                               onClick={() => (handleShowConsultar(row.row))}><i className="fa fa-eye" style={{ color: "#F9A03E" }} /></a>
                        </Tooltip>
                        <Tooltip title="Eliminar">
                            <a href="#" className="btn btn-default btn-xs"
                               onClick={() => confirmAlert({
                                   title: 'Confirmar Eliminar',
                                   message: 'Está seguro de eliminar la zona?',
                                   buttons: [
                                       {
                                           label: 'Si',
                                           onClick: () => handleEliminar(row.row)
                                       },
                                       {
                                           label: 'No',
                                       }
                                   ]
                               })}><i className="zmdi zmdi-delete"
                                      style={{ color: "#F30B0B" }} /></a>
                        </Tooltip>

                    </div>
                )
            }
        },
        {
            headerName: "Código Zona",
            field: 'm_sCodigoZona',
            minWidth: 200,
            flex: 1
        },
        {
            headerName: "Estado",
            field: 'm_sEstado',
            minWidth: 200,
            flex: 1
        },
    ])
    const [pantallaActiva, setPantallaActiva ] = useState(1)
    const [consult, setConsult] = useState(false)
    const [listadoZonas, setListadoZonas] = useState([])
    const [state, setState] = useState({
        agregar: "Agregar",
        height: window. innerHeight,
    })
    const [seleccion, setSeleccion] = useState({})

    const listado = 1
    const agregar = 2
    const modificar = 3

    const handleShowListado = (event) => {
        event.stopPropagation();
        setPantallaActiva(listado)
        setSeleccion({})
        getAllZonas()
        setConsult(false)
        setState(state =>{
            return {
                ...state,
                agregar: "Agregar",
            }
        });
        $('.nav-tabs li ').removeClass('active');
        $('.nav-tabs li').eq(0).addClass('active');
        $('.tab-content div ').removeClass('in show');
        $('#Listado').addClass('in show');
    }

    const handleShowAgregar = (event) => {
        event.stopPropagation()
        // limpiarInputsAgregar()
        setPantallaActiva(agregar)
        setState(state => {
            return {
                ...state,
            }
        });
        $('.nav-tabs li ').removeClass('active');
        $('.nav-tabs li').eq(1).addClass('active');
        $('.tab-content div ').removeClass('in show');
        $('#Agregar').addClass('in show');

    }

    const handleShowModificar = (zona) => {
        setSeleccion(zona.m_nIdZona)
        setConsult(false)
        setPantallaActiva(modificar)
        setState(state =>{
            return {
                ...state,
                agregar: "Modificar",
            }
        });
        $('.nav-tabs li ').removeClass('active');
        $('.nav-tabs li').eq(1).addClass('active');
        $('.tab-content div ').removeClass('in show');
        $('#Agregar').addClass('in show');
    }

    const handleShowConsultar = (zona) => {
        setSeleccion(zona.m_nIdZona)
        setPantallaActiva(modificar)
        setConsult(true)
        setState(state =>{
            return {
                ...state,
                agregar: "Consultar",
            }
        });
        $('.nav-tabs li ').removeClass('active');
        $('.nav-tabs li').eq(1).addClass('active');
        $('.tab-content div ').removeClass('in show');
        $('#Agregar').addClass('in show');
    }

    const handleEliminar = (zona) => {
        eliminarZonaTarifa(zona.m_nIdZona, 0).then(({data}) => {
            showSuccess(data)
            getAllZonas()
        })
    }

    useEffect(value => {
        getAllZonas()
    }, [])

    const getAllZonas = () => {
        obtenerListadoZonaTarifa().then(({data}) => {
            setListadoZonas(data)
        })
    }

    const onSubmit = () => {
        setSeleccion({
            idSucursal: localStorage.getItem("Sucursal"),
            idZona: '',
            codigoZona: '',
            idEstado: '',
            idMunicipio: '',
            selectedCP: [],
        })
    }

    return(
        <div>
            <header className="topbar clearfix">
                <Cabecera titulo="Zonas Tarifas" >
                    <div className="page-header">
                        <ul className="list-page-breadcrumb">
                            <li className="active-page">Zonas Tarifas</li>
                        </ul>
                    </div>
                </Cabecera>
            </header>
            {/*Leftbar Start Here*/}
            <aside className="iconic-leftbar">
                <BarraLateralIzquierda />
            </aside>
            {/*Leftbar End Here*/}
            <section className={"main-container"}>
                <div className={"content-fluid"}>
                    <ul className={"nav navStatica nav-tabs"}>
                        <li className={"active"}>
                            <a data-toggle={"tab"} onClick={handleShowListado}>
                                <i className={"fa fa-list"}/> Listado
                            </a>
                        </li>

                        <li>
                            <a data-toggle="tab" onClick={handleShowAgregar}>
                                <i className="fa fa-plus-circle" /> {state.agregar}
                            </a>
                        </li>
                        {/*<li>
                                <a  onClick={handleShowImprimir}>
                                    <i className="fa fa-print" /> Imprimir
                                </a>
                            </li>*/}
                    </ul>

                    <div className={"row"} className={"tab-content"}>
                        <div id="Listado" className="tab-pane fade in show">
                            <div className="widget-wrap">
                                <div className="widget-content">
                                    <div className={"row"} style={{height: state.height -250, width: '100%'}}>
                                        <DataGrid columns={columns} rows={listadoZonas}
                                                  locateText={dataGridLocaleText}
                                                  density={"compact"}
                                                  pageSize={Math.floor((state.height - 310) / 30)}
                                                  getRowId={(row => row.m_nIdZona)}
                                                  disableColumnSelector
                                                  disableDensitySelector
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div id="Agregar" className="tab-pane fade">
                            {
                                (pantallaActiva === 2 || pantallaActiva === 3) &&
                                <ZonaTarifasAgregar
                                    consult={consult}
                                    idZona={seleccion}
                                    onSubmit={onSubmit}
                                />
                            }


                        </div>
                    </div>
                </div>
            </section>
        </div>
    )
}

export default ZonaTarifas