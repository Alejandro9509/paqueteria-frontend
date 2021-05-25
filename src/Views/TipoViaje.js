import React, { useEffect, useState, useMemo } from "react";
import axios from "axios";
import Cabecera from "../Components/Template/Cabecera";
import BarraLateralIzquierda from "../Components/Template/BarraLateralIzquierda";
import BarraLateralDerecha from "../Components/Template/BarraLateralDerecha";
import ExportCSV from '../Components/Template/Export';
import ExportPDF from "../Components/Template/ExportPDF";
import { useTable, useFilters, useSortBy } from 'react-table'
import { makeStyles } from "@material-ui/core/styles";
import { DataGrid } from '@material-ui/data-grid';

import Noty from 'noty';
import { dataGridLocaleText } from "../Constants";
import { TextField, Tooltip } from "@material-ui/core";
import { agregarTipoViaje, eliminarTipoViaje, modificarTipoViaje, obtenerTipoViaje, obtenerTipoViajeId } from "../Util/Contexts/TipoViajeContext";
import { validarPermisos } from "../Util/Contexts/UsuarioContext";

function showSuccess(mensaje) {
    new Noty({
        type: "information",
        layout: "topCenter",
        text: mensaje,
        timeout: "3000"
    }).show()
}

const styles = {
    seleccionado: {
        backgroundColor: "#FCC88F",
    },
    noSeleccionado: {
        backgroundColor: "#FFFFFF",
    }
};
const useStyles = makeStyles(styles);

function TipoViaje() {

    const classes = useStyles();
    const [data, setData] = React.useState([])

    const [state, setState] = React.useState({
        idTipoViaje: 0,
        DerechoBorrar: 90,
        agregar: "Agregar",
        Codigo: "",
        TipoViaje: "",
        CreadoEl: "",
        CreadoPor: localStorage.getItem("UsuarioId"),
        ModificadoPor: localStorage.getItem("UsuarioId"),
        height: window.innerHeight,

    })

    const handleAceptar = (e) => {
        e.preventDefault()
        var params = {

            "Codigo": state.Codigo,
            "TipoViaje": state.TipoViaje,
            "CreadoPor": state.CreadoPor,
            "ModificadoPor": state.ModificadoPor
        }
        if (state.idTipoViaje != 0) {
            modificarTipoViaje(state.idTipoViaje, params).then(respuesta => {
                showSuccess(respuesta.data)
                getAllData();
            }).catch(err => {
                console.log(err)
                showSuccess("err")
            });
        } else {
            agregarTipoViaje(params).then(respuesta => {
                showSuccess(respuesta.data)
                getAllData()
            }).catch(err => {
                console.log(err)
                showSuccess(err)
            });
        }

    }

    function handleEliminar(id) {
        var derecho;
        validarPermisos(state).then(respuesta => {
            //showSuccess(respuesta.data)

            derecho = respuesta.data;
            if (derecho == false) {
                showSuccess("El usuario no tiene derechos para realizar el proceso");
                return;
            }

            eliminarTipoViaje(id).then(respuesta => {
                alert(respuesta)
                getAllData()
            }).catch(err => {
                alert(err)
            });
        }).catch(err => {
            alert(err)
        });
    }

    function handleShowModificar(id) {
        obtenerTipoViajeId(id).then(respuesta => {
            console.log(respuesta.data)
            setState({
                ...state,
                idTipoViaje: id,
                agregar: "Modificar",
                Codigo: respuesta.data.Codigo,
                TipoViaje: respuesta.data.TipoViaje,
            })
        });
    }

    function handleShowConsultar(id) {
        obtenerTipoViajeId(id).then(respuesta => {
            console.log(respuesta.data)
            setState({
                ...state,
                idTipoViaje: id,
                agregar: "Consultar",
                Codigo: respuesta.data.Codigo,
                TipoViaje: respuesta.data.TipoViaje,
            })
        });
    }

    function handleShowAgregar() {
        setState({
            ...state,
            idTipoViaje: 0,
            agregar: "Agregar",
            Codigo: "",
            TipoViaje: "",
        })
    }

    const handleChange = event => {
        console.log(event.target.value)
        setState({
            ...state,
            [event.target.id]: event.target.value
        });
    };

    function handleSelectRow(id, event) {
        setState({
            ...state,
            idTipoViaje: id
        });
    }

    const columns = React.useMemo(() => [
        {
            headerName: "Acciones",
            sortable: false, filterable: false,
            field: "",
            renderCell: (row) => {
                return (
                    <div>
                        <Tooltip title="Modificar">
                            <a href="#Agregar" role="tab" data-toggle="tab" onClick={() => (handleShowModificar(row.row.m_nIdTipoViaje))} className="btn btn-default btn-xs"><i className="fa fa-pencil-square-o" style={{ color: "#F9A03E" }} /></a>

                        </Tooltip>
                        <Tooltip title="Consultar">
                            <a href="#Agregar" role="tab" data-toggle="tab" className="btn btn-default btn-xs" onClick={() => (handleShowConsultar(row.row.m_nIdTipoViaje))}><i className="fa fa-eye" style={{ color: "#F9A03E" }} /></a>

                        </Tooltip>
                        <Tooltip title="Eliminar">
                            <a href="#" className="btn btn-default btn-xs" onClick={() => (handleEliminar(row.row.m_nIdTipoViaje))}><i className="zmdi zmdi-delete" style={{ color: "#F30B0B" }} /></a>

                        </Tooltip>
                    </div>
                )
            }
        },
        {
            headerName: "Código",
            field: "m_nCodigo",
            width: 100
        }, {
            headerName: "Tipo de Viaje / Ruta",
            field: "m_sTipoViaje",
            width: 250
        }, {
            headerName: "Creado El",
            field: "m_sCreadoEl",
            width: 200
        }, {
            headerName: "Creado Por",
            field: "m_sCreadoPor",
            width: 150
        }, {
            headerName: "Modificado El",
            field: "m_sModificadoEl",
            width: 200
        }, {
            headerName: "Modificado Por",
            field: "m_sModificadoPor",
            width: 150
        }

    ]);

    useEffect(value => {
        if (localStorage.getItem("UsuarioId") === null || localStorage.getItem("UsuarioId") <= 0) {
            alert("Es necesario iniciar sesion para acceder a este proceso");
            window.location.replace("configuracion");
            return;
        }
        getAllData();
    }, []);

    function getAllData() {
        obtenerTipoViaje().then(respuesta => {
            setData(respuesta.data)
        });
    };

    const headers = {
        'Content-Type': 'application/json',
        //    'access-control-allow-origin': '*'
    }

    return (
        <div >

            <header className="topbar clearfix">
                <Cabecera titulo="Tipos de Viajes" >
                    <div className="page-header">
                        <ul className="list-page-breadcrumb">
                            <li>
                                <a href="/Catalogos" className="color-mapeo">
                                    Catálogos <i className="zmdi zmdi-chevron-right" />
                                </a>
                            </li>
                            <li className="active-page">Tipos de Viajes</li>
                        </ul>
                    </div>
                </Cabecera>
            </header>

            {/*Leftbar Start Here*/}
            <aside className="iconic-leftbar">
                <BarraLateralIzquierda />
            </aside>
            {/*Leftbar End Here*/}

            {/*Page Container Start Here*/}
            <section className="main-container">

                <div className="container-fluid">

                    <ul className="nav navStatica nav-tabs">
                        <li className="active">
                            <a data-toggle="tab" href="#Listado">
                                <i className="fa fa-list" /> Listado
            </a>
                        </li>
                        <li>
                            <a data-toggle="tab" href="#Agregar" onClick={handleShowAgregar}>
                                <i className="fa fa-plus-circle" /> {state.agregar}
                            </a>
                        </li>
                    </ul>

                    <div className="row" className="tab-content">
                        <div className="widget-wrap" id="Listado" className="tab-pane fade in active">
                            <div className="widget-wrap">
                                <div className="widget-content">
                                    <div className="row" style={{ height: state.height - 250, width: '100%' }}>
                                        {data.length != 0 ? (
                                            <DataGrid
                                                localeText={dataGridLocaleText}
                                                rows={data}
                                                columns={columns}
                                                density="compact"
                                                pageSize={Math.floor((state.height - 310) / 30)}
                                                getRowId={(row) => row.m_nIdTipoViaje}
                                                onRowSelected={(row) => {
                                                    setState({
                                                        ...state,
                                                        idTipoViaje: row.data.m_nIdTipoViaje
                                                    })
                                                }}
                                            />
                                        ) : (
                                            <div>No se encontró ningún registro</div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="widget-wrap" id="Agregar" className="tab-pane fade">
                            <div className="widget-wrap">
                                <div className="widget-content">
                                    <div className="row">
                                        <div className="col-md-12">
                                            <form className="j-forms" onSubmit={handleAceptar}>
                                                <div className="form-content">

                                                    <div className="col-xs-6 col-sm-3 col-md-2-5 col-lg-2-5 unit">
                                                        <div className="input">
                                                            <TextField variant="outlined" margin="dense" label="Código"
                                                                onChange={handleChange}
                                                                className="form-control"
                                                                type="text"
                                                                maxLength="5"
                                                                required={true}
                                                                value={state.Codigo}
                                                                readOnly={state.agregar == "Consultar"}
                                                                id="Codigo"
                                                            />
                                                        </div>
                                                    </div>

                                                    <div className="col-xs-6 col-sm-3 col-md-2-5 col-lg-2-5 unit">
                                                        <div className="input">
                                                            <TextField variant="outlined" margin="dense" label="Tipo de Viaje"
                                                                onChange={handleChange}
                                                                className="form-control"
                                                                type="text"
                                                                maxLength="30"
                                                                required={true}
                                                                value={state.TipoViaje}
                                                                readOnly={state.agregar == "Consultar"}
                                                                id="TipoViaje"
                                                            />
                                                        </div>
                                                    </div>

                                                </div>
                                                <br></br>
                                                <div className="form-footer" className="col-12 col-sm-12 col-md-10 unit">
                                                    <button href="#Listado" role="tab" data-toggle="tab" className="btn btn-secondary secondary-btn"
                                                    >
                                                        Cancelar</button>
                                                    <button type="submit" className="btn btn-primary primary-btn">Aceptar</button>
                                                </div>
                                            </form>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="widget-wrap" id="Importar" className="tab-pane fade">
                            <div className="widget-wrap">
                                <div className="widget-content">
                                    <div className="row">
                                        <div className="col-md-12">
                                            <div className="form-footer" className="col-md-12">
                                                <button className="btn btn-default btn-block ex-noty" data-layout="topCenter" data-type="information">Notificación</button>
                                                <button href="#Listado" role="tab" data-toggle="tab" data-layout="topCenter" data-type="information" className="btn btn-secondary secondary-btn"
                                                >
                                                    Cancelar</button>
                                                <button onClick={handleAceptar} className="btn btn-primary primary-btn">Aceptar</button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                    </div>
                </div>

            </section>
            {/*Page Container End Here*/}

            {/*Rightbar Start Here*/}
            <aside className="rightbar">
                <BarraLateralDerecha />
            </aside>

        </div>

    );
}

export default TipoViaje;
