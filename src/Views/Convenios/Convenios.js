import React, {Component, useEffect, useMemo, useState} from 'react'
import Cabecera from "../../Components/Template/Cabecera";
import BarraLateralIzquierda from "../../Components/Template/BarraLateralIzquierda";
import {DataGrid, GridToolbar } from "@material-ui/data-grid";
import {API_HEADERS, dataGridLocaleText} from "../../Constants";
import SvgIcon from "@material-ui/core/SvgIcon";
import {ReactComponent as Activo} from "../../iconos/Menu/palomita.svg";
import {ReactComponent as NoActivo} from "../../iconos/Menu/cruz.svg";
import $ from "jquery";
import CrearTarifa from "../Tarifas/CrearTarifa";
import EscribirConvenio from "./EscribirConvenio";
import {Tooltip} from "@material-ui/core";
import {confirmAlert} from "react-confirm-alert";
import axios from "axios";
import Noty from "noty";
import {obtenerConvenios} from "../../Util/Contexts/ConveniosContext";

window.jQuery = window.$ = $;

const headers = API_HEADERS
function showSuccess(mensaje) {
    new Noty({
        type: "information",
        layout: "topCenter",
        text: mensaje,
        timeout: "3000"
    }).show()
}
function Convenios(){
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
                                   message: 'Está seguro de eliminar Convenio?',
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
            headerName: "No. Cliente",
            field: 'm_nNumeroCliente',
            width: 150,
        },
        {
            headerName: "Cliente",
            field: 'm_sNombreFiscal',
            width: 300,
        },
        {
            headerName: "Vigencia",
            field: 'm_sVigencia',
            width: 200,
        },
        {
            headerName: "Cuota Mensual",
            field: 'm_xCuotaMensual',
            width: 200,
        },
        {
            headerName: "Activo",
            field: 'm_bActivo',
            width: 100,
            renderCell: (row) => {
                return (
                    <div
                        style={{
                            width: "100%",
                            textAlign: "center",
                            color: row.row.m_bActivo ? "green" : "red",
                        }}>
                        {row.row.m_bActivo ? (
                            <SvgIcon component={Activo} />
                        ) : (
                            <SvgIcon component={NoActivo} />
                        )}
                    </div>
                );
            },
        },
    ])
    const [listaConvenios, setListaConvenios] = useState([])
    const [convenioSeleccionado, setConvenioSeleccionado] = useState(0)
    const [pantallaActiva, setPantallaActiva ] = useState(1)
    const [consult, setConsult] = useState(false)
    const [state, setState] = useState({
        agregar: "Agregar",
        height: window. innerHeight,
    })


    useEffect(value => {
        getAllConvenios()
    }, [])

    const getAllConvenios = () => {
        obtenerConvenios().then(respuesta => {
            setListaConvenios(respuesta.data)
        });
    }

    const handleShowListado = (event) => {
        event.stopPropagation();
        getAllConvenios()
        // limpiarInputsAgregar()
        setPantallaActiva(1)
        setConvenioSeleccionado(0)
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
        setConvenioSeleccionado(0)
        setPantallaActiva(2)
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
    const handleShowModificar = (convenio) => {
        setConsult(false)
        setConvenioSeleccionado(convenio.m_nIdConvenio)
        setPantallaActiva(3)
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
    const handleShowConsultar = (convenio) => {
        setConvenioSeleccionado(convenio.m_nIdConvenio)
        setPantallaActiva(3)
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

    const handleEliminar = (convenio) => {
        const url = `${process.env.REACT_APP_API_URL}/Convenios/Eliminar/${convenio.m_nIdConvenio}/0`;
        axios.delete(url,{ headers }).then(respuesta => {
            console.log(respuesta)
            showSuccess(respuesta.data);
            getAllConvenios()
        });
    }


    return(
        <div>
            <header className="topbar clearfix">
                <Cabecera titulo="Convenios" >
                    <div className="page-header">
                        <ul className="list-page-breadcrumb">
                            <li>
                                <a href="/Catalogos" className="color-mapeo">
                                    Catálogos <i className="zmdi zmdi-chevron-right" />
                                </a>
                            </li>
                            <li className="active-page">Convenios</li>
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
                                        <DataGrid columns={columns} rows={listaConvenios}
                                                  locateText={dataGridLocaleText}
                                                  density={"compact"}
                                                  pageSize={Math.floor((state.height - 310) / 30)}
                                                  components={{
                                                      Toolbar: GridToolbar,
                                                  }}
                                                  getRowId={(row => row.m_nIdConvenio)}
                                                  disableColumnSelector
                                                  disableDensitySelector
                                                  filterModel={{
                                                      items: [
                                                          { columnField: '', operatorValue: '', value: '' },
                                                      ],
                                                  }}
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div id="Agregar" className="tab-pane fade">
                            {/*{
                                this.state.pantalla == 2 &&
                                <CrearTarifa edit={edit} consult={consult} select={this.state.selected}
                                             onSubmit={this.handleAceptar} onCancel={(event) => {
                                    event.stopPropagation();
                                    this.setState({pantalla: 1, edit: false, consult: false, agregar: "Agregar"});
                                    $('.nav-tabs li ').removeClass('active');
                                    $('.nav-tabs li').eq(0).addClass('active');
                                    $('.tab-content div ').removeClass('in show');
                                    $('#Listado').addClass('in show');
                                }}></CrearTarifa>
                            }*/}

                                <EscribirConvenio
                                    select={convenioSeleccionado}
                                    consult={consult}
                                    pantallaActiva={pantallaActiva}
                                />


                        </div>
                    </div>
                </div>
            </section>
        </div>
    )
}

export default Convenios;