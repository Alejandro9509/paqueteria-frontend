import React, { useEffect, useState, useMemo } from "react";
import axios from "axios";
import Cabecera from "../Components/Template/Cabecera";
import BarraLateralIzquierda from "../Components/Template/BarraLateralIzquierda";
import BarraLateralDerecha from "../Components/Template/BarraLateralDerecha";
import * as XLSX from 'xlsx';
import { useTable, useFilters, useAsyncDebounce, useSortBy } from 'react-table'
import { makeStyles } from "@material-ui/core/styles";

import Noty from 'noty';
import { TextField, Tooltip } from "@material-ui/core";
import { DataGrid } from '@material-ui/data-grid';
import { dataGridLocaleText } from "../Constants";
import { agregarGrupoUnidades, eliminarGrupoUnidades, modificarGrupoUnidades, obtenerGrupoUnidades, obtenerGrupoUnidadesId } from "../Util/Contexts/GrupoUnidadesContext";
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

function GrupoUnidades() {

    const classes = useStyles();
    const [data, setData] = React.useState([])
    const [state, setState] = React.useState({
        showPopUp: false,
        IdGrupoUnidad: 0,
        Codigo: 0,
        GrupoUnidad: "",
        DefinidoPorSistema: 0,
        Color: "#000000",
        ColorLetra: 0,
        DerechoBorrar: 70,
        agregar: "Agregar",
        height: window.innerHeight,
        CreadoPor: localStorage.getItem("UsuarioId"),
        ModificadoPor: localStorage.getItem("UsuarioId")
    })
    const [fileUploaded, setFileUploaded] = React.useState([])


    const handleAceptar = (e) => {
        e.preventDefault()
        var params = {
            "Codigo": state.Codigo,
            "GrupoUnidad": state.GrupoUnidad.slice(-6),
            "Color": state.Color,
            "ColorLetra": state.ColorLetra,
            "CreadoPor": state.CreadoPor,
            "ModificadoPor": state.ModificadoPor
        }
        console.log(params)
        if (state.IdGrupoUnidad != 0) {
            modificarGrupoUnidades(state.IdGrupoUnidad, params).then(respuesta => {
                showSuccess(respuesta.data)
                getAllData();
            }).catch(err => {
                console.log(err)
                showSuccess("err")
            });
        } else {
            agregarGrupoUnidades(params).then(respuesta => {
                showSuccess(respuesta.data)
                getAllData();
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

            eliminarGrupoUnidades(id, state.CreadoPor).then(respuesta => {
                console.log(respuesta);
                getAllData();
            }).catch(err => {
                showSuccess(err)
            });
        }).catch(err => {
            showSuccess(err)
        });
    }

    function handleShowModificar(id) {
        obtenerGrupoUnidadesId(id).then(respuesta => {
            console.log(respuesta.data)
            setState({
                ...state,
                agregar: "Modificar",
                showPopUp: true,
                IdEmbalaje: id,
                Codigo: respuesta.data.m_nCodigo,
                GrupoUnidad: respuesta.data.m_sGrupoUnidad,
                Color: respuesta.data.m_sColor.slice(-6)
            })
        });
    }

    function handleShowConsultar(id) {
        obtenerGrupoUnidadesId(id).then(respuesta => {
            console.log(respuesta.data)
            setState({
                ...state,
                agregar: "Consultar",
                showPopUp: true,
                IdEmbalaje: id,
                Codigo: respuesta.data.m_nCodigo,
                GrupoUnidad: respuesta.data.m_sGrupoUnidad,
                Color: respuesta.data.m_sColor.slice(-6)
            })
        });
    }

    function handleShowAgregar() {
        setState({
            ...state,
            agregar: "Agregar",
            showPopUp: true,
            IdGrupoUnidad: 0,
            Codigo: 0,
            GrupoUnidad: "",
            Color: ""
        })
    }

    const handleChange = event => {
        console.log(event.target.id + " : " + event.target.value)
        setState({
            ...state,
            [event.target.id]: event.target.value
        });
    };

    function handleSelectRow(id, event) {
        setState({
            ...state,
            IdGrupoUnidad: id
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
                            <a href="#Agregar" role="tab" data-toggle="tab" onClick={() => (handleShowModificar(row.row.m_nIdGrupoCliente))} className="btn btn-default btn-xs"><i className="fa fa-pencil-square-o" style={{ color: "#F9A03E" }} /></a>

                        </Tooltip>
                        <Tooltip title="Consultar">
                            <a href="#Agregar" role="tab" data-toggle="tab" className="btn btn-default btn-xs" onClick={() => (handleShowConsultar(row.row.m_nIdGrupoCliente))}><i className="fa fa-eye" style={{ color: "#F9A03E" }} /></a>

                        </Tooltip>
                        <Tooltip title="Eliminar">
                            <a href="#" className="btn btn-default btn-xs" onClick={() => (handleEliminar(row.row.m_nIdGrupoCliente))}><i className="zmdi zmdi-delete" style={{ color: "#F30B0B" }} /></a>

                        </Tooltip>
                    </div>
                )
            }
        },
        {
            headerName: "Código",
            field: "m_nCodigo",
            width: 100,
        }, {
            headerName: "Grupo de Unidades",
            field: "m_sGrupoUnidad",
            width: 200,
        }, {
            headerName: "Creado El",
            field: "m_sCreadoEl",
            width: 200,
        }, {
            headerName: "Creado Por",
            field: "m_sCreadoPor",
            width: 150,
        }, {
            headerName: "Modificado El",
            field: "m_sModificadoEl",
            width: 200,
        }, {
            headerName: "Modificado Por",
            field: "m_sModificadoPor",
            width: 150,
        }

    ]);

    useEffect(value => {
        if (localStorage.getItem("UsuarioId") === null || localStorage.getItem("UsuarioId") <= 0) {
            showSuccess("Es necesario iniciar sesion para acceder a este proceso");
            window.location.replace("login");
            return;
        }
        getAllData();
    }, []);

    function getAllData() {
        obtenerGrupoUnidades().then(respuesta => {
            setData(respuesta.data)
        });
    };

    const handleUpload = (e) => {
        e.preventDefault();

        var files = e.target.files, f = files[0];
        var reader = new FileReader();
        console.log(e.target.files)
        reader.onload = function (e) {
            console.log("Nothing Happened")
            var data = e.target.result;
            let readedData = XLSX.read(data, { type: 'binary' });
            const wsname = readedData.SheetNames[0];
            const ws = readedData.Sheets[wsname];

            /* Convert array to json*/
            const dataParse = XLSX.utils.sheet_to_json(ws, { header: 1 });
            console.log("dataParse : " + dataParse)
            setFileUploaded(dataParse);
        };
        reader.readAsBinaryString(f)
    }

    const FilterComponent = ({ filterText, onFilter, onClear }) => (
        <>
            <TextField
                id="search"
                type="text"
                variant="outlined"
                placeholder="Filter By Name"
                aria-label="Search Input"
                value={filterText}
                onChange={handleChange} />
            <button type="button" onClick={onClear}>X</button>
        </>
    );



    const headers = {
        'Content-Type': 'application/json',
        //    'access-control-allow-origin': '*'
    }

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





                {/*AQUI MODIFICAS LO QUE NECESITES*/}

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
                                        onClick={handleSelectRow.bind(this, row.original.m_nIdGrupoUnidad)}
                                        className={state.IdGrupoUnidad === row.original.m_nIdGrupoUnidad ? classes.seleccionado : classes.noSeleccionado}>

                                        <td>
                                            <div>
                                                <a href="#Agregar" role="tab" data-toggle="tab" onClick={() => (handleShowModificar(row.original.m_nIdGrupoUnidad))} className="btn btn-default btn-sm"><i className="fa fa-pencil-square-o" style={{ color: "#F9A03E" }} /></a>
                                                <a href="#Agregar" role="tab" data-toggle="tab" className="btn btn-default btn-sm" onClick={() => (handleShowConsultar(row.original.m_nIdGrupoUnidad))}><i className="fa fa-eye" style={{ color: "#F9A03E" }} /></a>
                                                <a href="#" className="btn btn-default btn-sm" onClick={() => (handleEliminar(row.original.m_nIdGrupoUnidad))}><i className="zmdi zmdi-delete" style={{ color: "#F30B0B" }} /></a>
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
                <Cabecera titulo="Grupo Unidades" >
                    <div className="page-header">
                        <ul className="list-page-breadcrumb">
                            <li>
                                <a href="/Catalogos" className="color-mapeo">
                                    Catálogos <i className="zmdi zmdi-chevron-right" />
                                </a>
                            </li>
                            <li className="active-page">Grupo Unidades</li>
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
                                                getRowId={(row) => row.m_nIdGrupoUnidad}
                                                onRowSelected={(row) => {
                                                    setState({
                                                        ...state,
                                                        IdGrupoUnidad: row.data.m_nIdGrupoUnidad
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
                                                    {/*****************************************Codigo************************************************************/}
                                                    <div className="col-xs-4 col-sm-3 col-md-2-5 col-lg-2-5 unit">

                                                        <div className="input">
                                                            <TextField
                                                                label="Código"
                                                                onChange={handleChange}
                                                                type="number"
                                                                required
                                                                step="1"
                                                                margin="dense"
                                                                variant="outlined"
                                                                min="0"
                                                                max="999"
                                                                value={state.Codigo}
                                                                disabled={state.agregar == "Consultar"}
                                                                id="Codigo"
                                                            />
                                                        </div>
                                                    </div>
                                                    {/*****************************************Color************************************************************/}
                                                    <div className="col-xs-4 col-sm-3 col-md-2-5 col-lg-2-5 unit">

                                                        <div className="input">
                                                            <TextField
                                                                variant="outlined"
                                                                onChange={handleChange}
                                                                className="form-control"
                                                                margin="dense"
                                                                type="color"
                                                                label="Color"
                                                                required
                                                                value={state.Color}
                                                                readOnly={state.agregar == "Consultar"}
                                                                id="Color"
                                                            />
                                                        </div>
                                                    </div>
                                                    {/*****************************************GrupoUnidad*******************************************************/}
                                                    <div className="col-xs-4 col-sm-3 col-md-2-5 col-lg-2-5 unit">

                                                        <div className="input">
                                                            <TextField
                                                                variant="outlined"
                                                                onChange={handleChange}
                                                                className="form-control"
                                                                type="text"
                                                                margin="dense"
                                                                label="Grupo de Unidades"
                                                                required
                                                                value={state.GrupoUnidad}
                                                                readOnly={state.agregar == "Consultar"}
                                                                id="GrupoUnidad"
                                                            />
                                                        </div>
                                                    </div>


                                                </div>

                                                <br></br>
                                                <div className="form-footer" className="col-12 col-sm-9 col-md-7 unit">
                                                    <button data-layout="topCenter" data-type="information" className="btn btn-secondary secondary-btn"> Cancelar</button>
                                                    <button type="submit" className="btn btn-primary primary-btn">Aceptar</button>
                                                </div>
                                            </form>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="widget-wrap" id="Importar" className="tab-pane fade">
                                <div className="widget-wrap">
                                    <div className="widget-content">
                                        <div className="row">
                                            <div className="col-md-12">
                                                <form className="j-forms">
                                                    <div className="form-content">
                                                        <div className="col-sm-12 col-md-12 unit">



                                                        </div>
                                                    </div>
                                                    <br></br>
                                                    <div className="col-xs-6 col-sm-3 col-md-2-5 col-lg-2-5 unit">
                                                        <button className="btn btn-default btn-block ex-noty" data-layout="topCenter" data-type="information">Notificación</button>
                                                        <button data-layout="topCenter" data-type="information" className="btn btn-secondary secondary-btn" href="#Listado" role="tab" data-toggle="tab"
                                                        >
                                                            Cancelar</button>
                                                        <button onClick={handleAceptar} className="btn btn-primary primary-btn">Aceptar</button>
                                                    </div>
                                                </form>
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

export default GrupoUnidades;
