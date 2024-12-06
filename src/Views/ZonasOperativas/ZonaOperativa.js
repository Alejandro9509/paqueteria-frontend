import React, {useEffect, useMemo, useState} from "react";
import Cabecera from "../../Components/Template/Cabecera";
import BarraLateralIzquierda from "../../Components/Template/BarraLateralIzquierda";
import {DataGrid, GridToolbar} from "@mui/x-data-grid";
import {dataGridLocaleText} from "../../Constants";
import CorteCajaAgregar from "../CorteCaja/CorteCajaAgregar";
import $ from "jquery";
import {Tooltip} from "@mui/material";
import {confirmAlert} from "react-confirm-alert";
import {eliminarCorte, obtenerCortes} from "../../Util/Contexts/CorteCajaContext";
import {validarDerecho} from "../../Util/Util"
import { styled } from "@mui/material/styles";
import makeStyles from '@mui/styles/makeStyles';
import {
    agregarZonaOperativa, eliminarZonaOperativa,
    modificarZonaOperativa, obtenerByIdZonaOperativa,
    obtenerListadoZonaOperativa
} from "../../Util/Contexts/ZonaOperativaContext";
import ZonaAgregar from "./ZonaAgregar";
import Noty from "noty";
import Filtros from "./Filtros";
const PREFIX = 'ZonaOperativa';

const classes = {
    disabled: `${PREFIX}-disabled`
};

const Root = styled('div')({
    [`& .${classes.disabled}`]: {
        pointerEvents: "none",
        cursor: "default",
    }
});

window.jQuery = window.$ = $;

function showSuccess(mensaje) {
    new Noty({
        type: "information",
        layout: "topCenter",
        text: mensaje,
        timeout: "3000"
    }).show()
}

function ZonaOperativa() {

    const columns = useMemo(() => [
        {
            headerName: "Acciones",
            field: "",
            sortable: false, filterable: false,
            renderCell: (row) => {
                return (
                    <Root>
                        <Tooltip title="Modificar" disabled={!validarDerecho(9101398)}>
                            <a href="#Agregar" role="tab" data-toggle="tab"
                               onClick={() => (handleShowModificar(row.row))}
                               className="btn btn-default btn-xs"><i className="fa fa-pencil-square-o"
                                                                     style={{ color: "#F9A03E" }} /></a>
                        </Tooltip>
                        <Tooltip title="Consultar">
                            <a href="#Agregar" role="tab" data-toggle="tab" className="btn btn-default btn-xs"
                               onClick={() => (handleShowConsultar(row.row))}><i className="fa fa-eye" style={{ color: "#F9A03E" }} /></a>
                        </Tooltip>
                        <Tooltip title="Eliminar" disabled={!validarDerecho(9101399)}>
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

                    </Root>
                );
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
        nuevo: false
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
                nuevo: false
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
                nuevo: true
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
                nuevo: false
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
                nuevo: false
            }
        });
        $('.nav-tabs li ').removeClass('active');
        $('.nav-tabs li').eq(1).addClass('active');
        $('.tab-content div ').removeClass('in show');
        $('#Agregar').addClass('in show');
    }

    const handleEliminar = (zona) => {
        eliminarZonaOperativa(zona.m_nIdZona, 0).then(({data}) => {
            showSuccess(data)
            getAllZonas()
        })
    }

    useEffect(value => {
        getAllZonas()
    }, [])

    const getAllZonas = () => {
        obtenerListadoZonaOperativa().then(({data}) => {
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
                <Cabecera titulo="Zonas Operativas" >
                    <div className="page-header">
                        <ul className="list-page-breadcrumb">
                            <li className="active-page">Zonas Operativas</li>
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
                            <a className= {validarDerecho(9101397)? "":"hide"} data-toggle="tab" onClick={handleShowAgregar}>
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
                                    
              
                                   <Filtros listaResultados={setListadoZonas}/>
                                   
                                 

                                    <div className={"row"} style={{height: state.height -250, width: '100%'}}>
                                        <DataGrid columns={columns} rows={listadoZonas}                                               
                                                  locateText={dataGridLocaleText}
                                                  density={"compact"}
                                                  autoPageSize={pantallaActiva==1?true:false}
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
                                    <ZonaAgregar
                                        consult={consult}
                                        idZona={seleccion}
                                        onSubmit={onSubmit}
                                        nuevo={state.nuevo}
                                        showListado={handleShowListado}
                                    />
                            }


                        </div>
                    </div>
                </div>
            </section>
        </div>
    )
}

export default ZonaOperativa