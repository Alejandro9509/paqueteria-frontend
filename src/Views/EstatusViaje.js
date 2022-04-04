import React, { useEffect, useState, useMemo } from "react";
import axios from "axios";
import Cabecera from "../Components/Template/Cabecera";
import BarraLateralIzquierda from "../Components/Template/BarraLateralIzquierda";
import BarraLateralDerecha from "../Components/Template/BarraLateralDerecha";
import { useTable, useFilters, useSortBy } from 'react-table'
import { makeStyles } from "@material-ui/core/styles";
import { DataGrid } from '@material-ui/data-grid';

import Noty from 'noty';
import { dataGridLocaleText } from "../Constants";
import { TextField, Tooltip } from "@material-ui/core";
import { agregarEstatusViaje, eliminarEstatusViaje, modificarEstatusViaje, obtenerEstatusViajeId, obtenerEstatusViaje } from "../Util/Contexts/EstatusViajeContext";
import { validarPermisos } from "../Util/Contexts/UsuarioContext";
import $ from "jquery";
import {validarDerecho} from "../Util/Util"
window.jQuery = window.$ = $;
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

function EstatusViaje() {

    const classes = useStyles();
    const [data, setData] = React.useState([])
    const [state, setState] = React.useState({
        idEstatusViaje: 0,
        DerechoBorrar: 93,
        estatusViaje: "",
        abreviacionViaje: "",
        tipoEstatusViaje: 0,
        colorViaje: "",
        noSeguimiento: false,
        archivo: false,
        carga: false,
        agregar: "Agregar",
        importar: "",
        height: window.innerHeight,
        CreadoPor: localStorage.getItem("UsuarioId"),
        ModificadoPor: localStorage.getItem("UsuarioId")
    })

    const handleAceptar = (e) => {
        e.preventDefault()
        var params = {

            "Estatus": state.estatusViaje,
            "Color": state.colorViaje.slice(-6),
            "ColorLetra": state.colorViaje.slice(-6),
            "Abreviacion": state.abreviacionViaje,
            "TipoEstatus": state.tipoEstatusViaje,
            "noSeguimiento": state.noSeguimiento,
            "archivo": state.archivo,
            "carga": state.carga,
            "CreadoPor": state.CreadoPor,
            "ModificadoPor": state.ModificadoPor
        }
        if (state.idEstatusViaje != 0) {
            modificarEstatusViaje(state.idEstatusViaje, params).then(respuesta => {
                showSuccess(respuesta.data)
                getAllData();
            }).catch(err => {
                console.log(err)
                showSuccess("err")
            });
        } else {
            agregarEstatusViaje(params).then(respuesta => {
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
            eliminarEstatusViaje(id, state.CreadoPor).then(respuesta => {
                showSuccess(respuesta)
                getAllData()
            }).catch(err => {
                showSuccess(err)
            });
        }).catch(err => {
            showSuccess(err)
        });
    }

    function handleShowModificar(id) {
        obtenerEstatusViajeId(id).then(respuesta => {
            console.log(respuesta.data)
            setState({
                ...state,
                agregar: "Modificar",
                showPopUp: true,
                idEstatusViaje: id,
                estatusViaje: respuesta.data.m_sEstatus,
                abreviacionViaje: respuesta.data.m_sAbreviacion,
                tipoEstatusViaje: respuesta.data.m_nTipoEstatus,
                colorViaje: "#" + respuesta.data.m_sColor,
                noSeguimiento: respuesta.data.m_bNoEnviarCorreo,
                archivo: respuesta.data.m_bArchivoEDI,
                carga: respuesta.data.m_bCarga,
            })
        });
    }

    function handleShowConsultar(id) {
        obtenerEstatusViajeId(id).then(respuesta => {
            console.log(respuesta.data)
            setState({
                ...state,
                agregar: "Consultar",
                showPopUp: true,
                idEstatusViaje: id,
                estatusViaje: respuesta.data.m_sEstatus,
                abreviacionViaje: respuesta.data.m_sAbreviacion,
                tipoEstatusViaje: respuesta.data.m_nTipoEstatus,
                colorViaje: "#" + respuesta.data.m_sColor,
                noSeguimiento: respuesta.data.m_bNoEnviarCorreo,
                archivo: respuesta.data.m_bArchivoEDI,
                carga: respuesta.data.m_bCarga,
            })
        });
    }

    function handleShowAgregar() {
        setState({
            ...state,
            agregar: "Agregar",
            idEstatusViaje: 0,
            estatusViaje: "",
            abreviacionViaje: "",
            tipoEstatusViaje: 1,
            colorViaje: "#000000",
            noSeguimiento: false,
            archivo: false,
            carga: false,
        })
    }

    const handleChange = event => {
        setState({
            ...state,
            [event.target.id]: event.target.value
        });
    };

    function handleSelectRow(id, event) {
        setState({
            ...state,
            idEstatusViaje: id
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
                            <a href="#Agregar" role="tab" data-toggle="tab" onClick={() => (handleShowModificar(row.row.m_nIdEstatusViaje))} className="btn btn-default btn-xs"
                            disabled={!validarDerecho(9101325)}><i className="fa fa-pencil-square-o" style={{ color: "#F9A03E" }} /></a>

                        </Tooltip>
                        <Tooltip title="Consultar">
                            <a href="#Agregar" role="tab" data-toggle="tab" className="btn btn-default btn-xs" onClick={() => (handleShowConsultar(row.row.m_nIdEstatusViaje))}><i className="fa fa-eye" style={{ color: "#F9A03E" }} /></a>

                        </Tooltip>
                        <Tooltip title="Eliminar">
                            <a href="#" className="btn btn-default btn-xs" onClick={() => (handleEliminar(row.row.m_nIdEstatusViaje))}
                            disabled={!validarDerecho(9101326)}><i className="zmdi zmdi-delete" style={{ color: "#F30B0B" }} /></a>

                        </Tooltip>
                    </div>
                )
            }
        },
        {
            headerName: "Abreviación",
            field: "m_sAbreviacion",
            width: 125,
            renderCell: (row) => {
                return (
                    <div style={{ backgroundColor: "#" + row.row.m_sColor, width: "100%", textAlign: "center" }}>
                        {row.row.m_sAbreviacion}
                    </div>
                )
            }
        }, {
            headerName: "Estatus",
            field: "m_sEstatus",
            width: 125,
        }, {
            headerName: "Creado El",
            field: "m_sCreadoEl",
            width: 200,
        }, {
            headerName: "Creado Por",
            field: "m_sCreadoPor",
            width: 200,
        }, {
            headerName: "Modificado El",
            field: "m_sModificadoEl",
            width: 200,
        }, {
            headerName: "Modificado Por",
            field: "m_sModificadoPor",
            width: 200,
        }

    ]);

    useEffect(value => {
        if (localStorage.getItem("UsuarioId") === null || localStorage.getItem("UsuarioId") <= 0) {
            showSuccess("Es necesario iniciar sesion para acceder a este proceso");
            window.location.replace("configuracion");
            return;
        }
        getAllData();
    }, []);

    function getAllData() {
        obtenerEstatusViaje().then(respuesta => {
            setData(respuesta.data)
        });
    };

    function DefaultColumnFilter({
        column: { filterValue, preFilteredRows, setFilter },
    }) {
        const count = preFilteredRows.length

        return (
            <input
                className="form-control"
                value={filterValue || ''}
                onChange={e => {
                    setFilter(e.target.value || undefined)
                }}
                placeholder={`Buscar ${count} registros...`}
            />
        )
    }

    function Table({ columns, data }) {

        const defaultColumn = React.useMemo(
            () => ({
                // Default Filter UI
                Filter: DefaultColumnFilter,
            }),
            []
        )

        const {
            getTableProps,
            getTableBodyProps,
            headerGroups,
            rows,
            prepareRow,
        } = useTable(
            {
                columns,
                data,
                defaultColumn
            },
            useFilters,
            useSortBy
        )

        return (
            <div className="col-md-12">
                <table className="table" {...getTableProps()}>
                    <thead>
                        {headerGroups.map(headerGroup => (
                            <tr {...headerGroup.getHeaderGroupProps()}>
                                <th>Acciones</th>
                                {headerGroup.headers.map(column => (
                                    // Add the sorting props to control sorting. For this example
                                    // we can add them into the header props
                                    <th {...column.getHeaderProps(column.getSortByToggleProps())}>
                                        {column.render('Name')}
                                        {/* Add a sort direction indicator */}
                                        <span>
                                            {column.isSorted
                                                ? column.isSortedDesc
                                                    ? <i className="fa fa-caret-up" />
                                                    : <i className="fa fa-caret-down" />
                                                : ''}
                                        </span>
                                        <div>{column.canFilter ? column.render('Filter') : null}</div>
                                    </th>
                                ))}
                            </tr>
                        ))}
                    </thead>
                    <tbody {...getTableBodyProps()}>
                        {rows.map(
                            (row, i) => {
                                prepareRow(row);
                                return (
                                    <tr {...row.getRowProps()}
                                        onClick={handleSelectRow.bind(this, row.original.m_nIdEstatusViaje)}
                                        className={state.idEstatusViaje === row.original.m_nIdEstatusViaje ? classes.seleccionado : classes.noSeleccionado}>
                                        <td>
                                            <div>
                                                <a href="#Agregar" role="tab" data-toggle="tab" className="btn btn-default btn-sm" onClick={() => (handleShowModificar(row.original.m_nIdEstatusViaje))} ><i className="fa fa-pencil-square-o" style={{ color: "#F9A03E" }} /></a>
                                                <a href="#Agregar" role="tab" data-toggle="tab" className="btn btn-default btn-sm" onClick={() => (handleShowConsultar(row.original.m_nIdEstatusViaje))}><i className="fa fa-eye" style={{ color: "#F9A03E" }} /></a>
                                                <a href="#" className="btn btn-default btn-sm" onClick={() => (handleEliminar(row.original.m_nIdEstatusViaje))}><i className="zmdi zmdi-delete" style={{ color: "#F30B0B" }} /></a>
                                            </div>
                                        </td>
                                        {row.cells.map(cell => {
                                            return (
                                                <td {...cell.getCellProps()}>{cell.render('Cell')}</td>
                                            )
                                        })}
                                    </tr>
                                )
                            }
                        )}
                    </tbody>
                </table>
            </div>
        )
    }

    return (
        <div >

            <header className="topbar clearfix">
                <Cabecera titulo="Estatus Viaje" >
                    <div className="page-header">
                        <ul className="list-page-breadcrumb">
                            <li>
                                <a href="/Catalogos" className="color-mapeo">
                                    Catálogos <i className="zmdi zmdi-chevron-right" />
                                </a>
                            </li>
                            <li className="active-page">Estatus Viaje</li>
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
                                                getRowId={(row) => row.m_nIdEstatusViaje}
                                                onRowSelected={(row) => {
                                                    setState({
                                                        ...state,
                                                        idEstatusViaje: row.data.m_nIdEstatusViaje
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

                                                    <div className="col-xs-6 col-sm-6 col-md-4 col-lg-4 unit">

                                                        <div className="input">
                                                            <TextField variant="outlined" margin="dense" label="Estatus"
                                                                onChange={handleChange}
                                                                className="form-control"
                                                                type="text"
                                                                maxLength="30"
                                                                required={true}
                                                                value={state.estatusViaje}
                                                                InputProps={{
                                                                    readOnly: state.agregar == "Consultar"
                                                                }}
                                                                id="estatusViaje"
                                                            />
                                                        </div>
                                                    </div>

                                                    <div className="col-xs-6 col-sm-6 col-md-4 col-lg-4 unit">

                                                        <div className="input">
                                                            <TextField variant="outlined" margin="dense" label="Abreviación"
                                                                onChange={handleChange}
                                                                className="form-control"
                                                                type="text"
                                                                maxLength="5"
                                                                required={true}
                                                                value={state.abreviacionViaje}
                                                                InputProps={{
                                                                    readOnly: state.agregar == "Consultar"
                                                                }}
                                                                id="abreviacionViaje"
                                                            />
                                                        </div>
                                                    </div>

                                                    <div className="col-xs-6 col-sm-6 col-md-4 col-lg-4 unit">
                                                        <div className="input">
                                                            <TextField variant="outlined" margin="dense" label="Color"
                                                                onChange={handleChange}
                                                                className="form-control"
                                                                required={true}
                                                                type="color"
                                                                value={state.colorViaje}
                                                                InputProps={{
                                                                    readOnly: state.agregar == "Consultar"
                                                                }}
                                                                disabled = {state.agregar == "Consultar"}
                                                                id="colorViaje"
                                                            />
                                                        </div>
                                                    </div>

                                                    <div className="col-xs-6 col-sm-6 col-md-4 col-lg-4 unit">
                                                        <label className="checkbox">
                                                            <input
                                                                required
                                                                native="true"
                                                                checked={state.noSeguimiento}
                                                                name="noSeguimiento"
                                                                onChange={(e) => setState({ ...state, noSeguimiento: e.target.checked })}
                                                                disabled = {state.agregar == "Consultar"}
                                                                type="checkbox"
                                                            />
                                                            <i />
                              No Enviar por Correo Seguimiento de Viajes
                            </label>
                                                    </div>

                                                    <div className="col-xs-6 col-sm-6 col-md-4 col-lg-4 unit">
                                                        <label className="checkbox">
                                                            <input
                                                                required
                                                                native="true"
                                                                checked={state.archivo}
                                                                name="archivo"
                                                                onChange={(e) => setState({ ...state, archivo: e.target.checked })}
                                                                disabled = {state.agregar == "Consultar"}
                                                                type="checkbox"
                                                            />
                                                            <i />
                              Archivo EDI 214
                            </label>
                                                    </div>

                                                    <div className="col-xs-6 col-sm-6 col-md-4 col-lg-4 unit">
                                                        <label className="checkbox">
                                                            <input
                                                                required
                                                                native="true"
                                                                checked={state.carga}
                                                                name="carga"
                                                                onChange={(e) => setState({ ...state, carga: e.target.checked })}
                                                                disabled = {state.agregar == "Consultar"}
                                                                type="checkbox"
                                                            />
                                                            <i />
                              Carga
                            </label>
                                                    </div>

                                                </div>
                                                <br></br>
                                                <div className="form-footer" className="col-12 col-sm-12 col-md-10 unit">
                                                    <button
                                                        onClick={(event) => { event.stopPropagation(); setState({ ...state, agregar: "Agregar" }); $('.nav-tabs li ').removeClass('active'); $('.nav-tabs li').eq(0).addClass('active'); $('.tab-content div ').removeClass('in show'); $('#Listado').addClass('in show'); }}
                                                        className="btn btn-secondary secondary-btn">
                                                        Cancelar</button>
                                                    <button type="submit" className="btn btn-primary primary-btn">Aceptar</button>
                                                </div>
                                            </form>
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

export default EstatusViaje;
