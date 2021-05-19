import React, { useEffect, useState, useMemo } from "react";
import axios from "axios";
import Cabecera from "../Components/Template/Cabecera";
import BarraLateralIzquierda from "../Components/Template/BarraLateralIzquierda";
import BarraLateralDerecha from "../Components/Template/BarraLateralDerecha";
import { useTable, useFilters, useSortBy } from 'react-table'
import { makeStyles } from "@material-ui/core/styles";
import { Breadcrumbs, FormControl, InputLabel, Link, Select, TextField, Tooltip, Typography } from '@material-ui/core';
import { DataGrid } from '@material-ui/data-grid';
import $ from "jquery";
import Noty from 'noty';
import { dataGridLocaleText } from "../Constants";
import { modificarCiudad, agregarCiudad, eliminarCiudad, obtenerCiudadId, obtenerCiudades } from "../Util/Contexts/CiudadesContext";
import { agregarCodigoPostal, modificarCodigoPostal, obtenerCodigoPostalCiudad, obtenerCodigoPostalId, eliminarCodigoPostal } from "../Util/Contexts/CodigoPostalContext";
import { obtenerPaises } from "../Util/Contexts/PaisesContext";

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

function CiudadesCodigoPostal() {

    const classes = useStyles();
    const [data, setData] = React.useState([])
    const [dataCodigoPostal, setDataCodigoPostal] = React.useState([])
    const [dataPais, setDataPais] = React.useState([])
    const [dataEstado, setDataEstado] = React.useState([])
    const [state, setState] = React.useState({
        idCiudad: 0,
        codigoCiudad: "",
        ciudad: "",
        abreviacionCiudad: "",
        idEstado: 0,
        idPais: 0,
        DerechoBorrar: 13,
        idCodigoPostal: 0,
        codigoPostal: "",
        zona: "",
        CreadoPor: localStorage.getItem("UsuarioId"),
        ModificadoPor: localStorage.getItem("UsuarioId"),
        agregarCiudad: "Agregar",
        agregarCodigoPostal: "Agregar",
        height: window.innerHeight
    })

    const handleAceptarCiudad = (e) => {
        e.preventDefault()
        var params = {

            "m_nCodigo": state.codigoCiudad,
            "m_sCiudad": state.ciudad,
            "m_sAbreviacion": state.abreviacionCiudad,
            "m_nIdEstado": state.idEstado,
            "m_nCreadoPor": state.CreadoPor,
            "m_nModificadoPor": state.ModificadoPor
        }
        if (state.idCiudad != 0) {
            modificarCiudad(state.idCiudad, params).then(respuesta => {
                showSuccess(respuesta.data)
                getAllData()
                $('#ciudadTabs li ').removeClass('active');
                $('#ciudadTabs li').eq(1).addClass('active');
                $('#ciudadContentTabs div ').removeClass('in show');
                $('#Agregar').addClass('in show');
            });
        } else {
            agregarCiudad().then(respuesta => {
                showSuccess(respuesta.data)
                getAllData()
                $('#ciudadTabs li ').removeClass('active');
                $('#ciudadTabs li').eq(1).addClass('active');
                $('#ciudadContentTabs div ').removeClass('in show');
                $('#Agregar').addClass('in show');
            }).catch(err => {
                console.log(err)
                showSuccess(err)
            });
        }

    }

    const handleAceptarCodigoPostal = (e) => {
        e.preventDefault()
        var params = {

            "m_nIdEstado": state.idEstado,
            "m_nIdCiudad": state.idCiudad,
            "m_sCP": state.codigoPostal,
            "m_nIdCP": state.idCodigoPostal,
            "m_nCreadoPor": state.CreadoPor,
            "m_nModificadoPor": state.ModificadoPor
        }
        
        if (state.idCodigoPostal != 0) {
            modificarCodigoPostal(state.idCodigoPostal, params).then(respuesta => {
                showSuccess(respuesta.data)
                getAllData()
            }).catch(err => {
                console.log(err)
                showSuccess("err")
            });
        } else {
            agregarCodigoPostal(params).then(respuesta => {
                showSuccess(respuesta.data)
            }).catch(err => {
                console.log(err)
                showSuccess(err)
            });
        }

    }

    function handleEliminarCiudad(id) {
        eliminarCiudad(id).then(respuesta => {
            showSuccess(respuesta.data)
            getAllData();
        }).catch(err => {
            showSuccess(err)
        });
    }

    function handleEliminarCodigoPostal(id) {
        var derecho;
        const urlDelete = `${process.env.REACT_APP_API_URL}/Utilerias/ValidaDerechos/${state.CreadoPor}/${state.DerechoBorrar}/3`;
        axios.get(urlDelete, { headers }).then(respuesta => {
            //showSuccess(respuesta.data)

            derecho = respuesta.data;
            if (derecho == false) {
                showSuccess("El usuario no tiene derechos para realizar el proceso");
                return;
            }
            eliminarCodigoPostal(id).then(respuesta => {
                showSuccess(respuesta.data)
                getAllCodigoPostal();
            }).catch(err => {
                showSuccess(err)
            });
        }).catch(err => {
            showSuccess(err)
        });

    }

    function handleShowModificarCiudad(id) {
        obtenerCiudadId(id).then(respuesta => {
            setState({
                ...state,
                agregar: "Modificar",
                idCiudad: id,
                codigoCiudad: respuesta.data.m_nCodigo,
                ciudad: respuesta.data.m_sCiudad,
                abreviacionCiudad: respuesta.data.m_sAbreviacion,
                idEstado: respuesta.data.m_nIdEstado

            })
        });
        $('#ciudadTabs li ').removeClass('active'); $('#ciudadTabs li').eq(1).addClass('active'); $('#ciudadContentTabs div').removeClass('in show'); $('#Agregar').addClass('in show');
    }

    function handleShowConsultaCiudad(id) {
        obtenerCiudadId(id).then(respuesta => {
            console.log(respuesta.data)
            setState({
                ...state,
                agregar: "Consultar",
                idCiudad: id,
                codigoCiudad: respuesta.data.m_nCodigo,
                ciudad: respuesta.data.m_sCiudad,
                abreviacionCiudad: respuesta.data.m_sAbreviacion,
                idEstado: respuesta.data.m_nIdEstado

            })
        });
        $('#ciudadTabs li ').removeClass('active'); $('#ciudadTabs li').eq(1).addClass('active'); $('#ciudadContentTabs div').removeClass('in show'); $('#Agregar').addClass('in show');
    }

    function handleShowModificarCodigoPostal(id) {
        obtenerCodigoPostalId(id).then(respuesta => {
            setState({
                ...state,
                agregarCodigoPostal: "Modificar",
                idCodigoPostal: id,
                codigoPostal: respuesta.data.m_sCP,
                zona: respuesta.data.m_sCiudad,
            })
        });
        $('#codigoTabs li ').removeClass('active'); $('#codigoTabs li').eq(1).addClass('active'); $('#codigoContentTabs div').removeClass('in show'); $('#AgregarCP').addClass('in show');

    }

    function handleConsultarCodigoPostal(id) {
        obtenerCodigoPostalId(id).then(respuesta => {
            setState({
                ...state,
                agregarCodigoPostal: "Consultar",
                idCodigoPostal: id,
                codigoPostal: respuesta.data.m_sCP,
                zona: respuesta.data.m_sCiudad,
            })
        });
        $('#codigoTabs li ').removeClass('active'); $('#codigoTabs li').eq(1).addClass('active'); $('#codigoContentTabs div').removeClass('in show'); $('#AgregarCP').addClass('in show');

        
    }

    function handleShowAgregarCiudad() {
        setState({
            ...state,
            agregar: "Agregar",
            idCiudad: 0,
            codigoCiudad: "",
            ciudad: "",
            abreviacionCiudad: "",
            idEstado: dataEstado[0].m_nIdEstado,
            idPais: dataPais[0].m_nIdPais,
        })
        $('#ciudadTabs li ').removeClass('active'); $('#ciudadTabs li').eq(1).addClass('active'); $('#ciudadContentTabs div').removeClass('in show'); $('#Agregar').addClass('in show');
    }

    function handleShowAgregarCodigoPostal() {
        setState({
            ...state,
            agregarCodigoPostal: "Agregar",
            idCodigoPostal: 0,
            codigoPostal: "",
            zona: "",
        })
        $('#codigoTabs li ').removeClass('active'); $('#codigoTabs li').eq(1).addClass('active'); $('#codigoContentTabs div').removeClass('in show'); $('#AgregarCP').addClass('in show');

    }

    const handleChange = event => {
        console.log(event.target.value)
        setState({
            ...state,
            [event.target.id]: event.target.value
        });
    };

    const handleSelectPais = event => {
        setState({
            ...state,
            idPais: event.target.value
        });
        getAllEstado(event.target.value)
    }

    function handleSelectCiudad(row, event) {
        setState({
            ...state,
            idCiudad: row.m_nIdCiudad,
            idEstado: row.m_nIdEstado
        });
        getAllCodigoPostal(row.m_nIdCiudad)
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
                            <a  onClick={() => (handleShowModificarCiudad(row.row.m_nIdCiudad))} className="btn btn-default btn-xs"><i className="fa fa-pencil-square-o" style={{ color: "#F9A03E" }} /></a>

                        </Tooltip>
                        <Tooltip title="Consultar">
                            <a  className="btn btn-default btn-xs" onClick={() => (handleShowConsultaCiudad(row.row.m_nIdCiudad))}><i className="fa fa-eye" style={{ color: "#F9A03E" }} /></a>

                        </Tooltip>
                        <Tooltip title="Eliminar">
                            <a href="#" className="btn btn-default btn-xs" onClick={() => (handleEliminarCiudad(row.row.m_nIdCiudad))}><i className="zmdi zmdi-delete" style={{ color: "#F30B0B" }} /></a>

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
            headerName: "Ciudad",
            field: "m_sCiudad",
            width: 200,
        }, {
            headerName: "Abreviación",
            field: "m_sAbreviacion",
            width: 125,
        }, {
            headerName: "Estado",
            field: "m_sEstado",
            width: 150,
        }

    ]);

    const columnsCodigoPostal = React.useMemo(() => [
        {
            headerName: "Acciones",
            sortable: false, filterable: false,
            field: "",
            renderCell: (row) => {
                return (
                    <div>
                        <Tooltip title="Modificar">
                            <a onClick={() => (handleShowModificarCodigoPostal(row.row.m_nIdCP))} className="btn btn-default btn-xs"><i className="fa fa-pencil-square-o" style={{ color: "#F9A03E" }} /></a>

                        </Tooltip>
                        <Tooltip title="Consultar">
                            <a className="btn btn-default btn-xs" onClick={() => (handleShowModificarCodigoPostal(row.row.m_nIdCP))}><i className="fa fa-eye" style={{ color: "#F9A03E" }} /></a>

                        </Tooltip>
                        <Tooltip title="Eliminar">
                            <a href="#" className="btn btn-default btn-xs" onClick={() => (handleEliminarCodigoPostal(row.row.m_nIdCP))}><i className="zmdi zmdi-delete" style={{ color: "#F30B0B" }} /></a>

                        </Tooltip>
                    </div>
                )
            }
        },
        {
            headerName: "Código",
            field: "m_sCP",
        }

    ]);

    useEffect(value => {
        if (localStorage.getItem("UsuarioId") === null || localStorage.getItem("UsuarioId") <= 0) {
            showSuccess("Es necesario iniciar sesion para acceder a este proceso");
            window.location.replace("login");
            return;
        }
        getAllData();
        getAllPais();
    }, []);

    function getAllData() {
        obtenerCiudades().then(respuesta => {
            setData(respuesta.data)
            getAllCodigoPostal(respuesta.data[0].m_nIdCiudad)
            setState({
                ...state,
                idCiudad: respuesta.data[0].m_nIdCiudad,
                idEstado: respuesta.data[0].m_nIdEstado
            });
        });
    };

    function getAllCodigoPostal(id) {
        obtenerCodigoPostalCiudad(id).then(respuesta => {
            setDataCodigoPostal(respuesta.data)
        });
    }

    function getAllPais() {
        obtenerPaises().then((respuesta) => {
            setDataPais(respuesta.data);
            getAllEstado(respuesta.data[0].m_nIdPais)
        });
    }

    function getAllEstado(id) {
        const url = `${process.env.REACT_APP_API_URL}/Estados/ByPais/${id}`;
        axios.get(url, { headers }).then((respuesta) => {
            setDataEstado(respuesta.data);
        });
    }

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
            useSortBy,
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
                                        onClick={handleSelectCiudad.bind(this, row.original)}
                                        className={state.idCiudad === row.original.m_nIdCiudad ? classes.seleccionado : classes.noSeleccionado}>
                                        <td>
                                            <div>
                                                <a  className="btn btn-default btn-sm" onClick={() => (handleShowModificarCiudad(row.original.m_nIdCiudad))}><i className="fa fa-pencil-square-o" style={{ color: "#F9A03E" }} /></a>
                                                <a className="btn btn-default btn-sm" onClick={() => (handleShowConsultaCiudad(row.original.m_nIdCiudad))}><i className="fa fa-eye" style={{ color: "#F9A03E" }} /></a>
                                                <a href="#" className="btn btn-default btn-sm" onClick={() => (handleEliminarCiudad(row.original.m_nIdCiudad))}><i className="zmdi zmdi-delete" style={{ color: "#F30B0B" }} /></a>
                                            </div>
                                        </td>
                                        {row.cells.map(cell => {
                                            return (
                                                <td {...cell.getCellProps()} >{cell.render('Cell')}</td>
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

    function TableCodigoPostal({ columns, data }) {

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
            useSortBy,
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
                                    <tr {...row.getRowProps()}>
                                        <td>
                                            <div>
                                                <a  className="btn btn-default btn-sm" onClick={() => (handleShowModificarCodigoPostal(row.original.m_nIdCP))} className="btn btn-default btn-sm"><i className="fa fa-pencil-square-o" style={{ color: "#F9A03E" }} /></a>
                                                <a  className="btn btn-default btn-sm" onClick={() => (handleConsultarCodigoPostal(row.original.m_nIdCP))}><i className="fa fa-eye" style={{ color: "#F9A03E" }} /></a>
                                                <a  onClick={() => (handleEliminarCodigoPostal(row.original.m_nIdCP))}><i className="zmdi zmdi-delete" style={{ color: "#F30B0B" }} /></a>
                                            </div>
                                        </td>
                                        {row.cells.map(cell => {
                                            return (
                                                <td {...cell.getCellProps()} >{cell.render('Cell')}</td>
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
                <Cabecera titulo="Ciudades/Código Postal" >
                    <div className="page-header">
                        <ul className="list-page-breadcrumb">
                            <li>
                                <a href="/Configuracion" className="color-mapeo">
                                    Configuración <i className="zmdi zmdi-chevron-right" />
                                </a>
                            </li>
                            <li className="active-page">Ciudades</li>
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



                    <div className="row">
                        <div className="col-md-7" >
                            <ul className="nav navStatica nav-tabs" id="ciudadTabs">
                                <li className="active">
                                    <a onClick={(event) => { event.stopPropagation(); setState({...state, agregarCiudad: "Agregar" }); $('#ciudadTabs li ').removeClass('active'); $('#ciudadTabs li').eq(0).addClass('active'); $('#ciudadContentTabs div ').removeClass('in show'); $('#Listado').addClass('in show'); }}>
                                        <i className="fa fa-list" /> Listado
            </a>
                                </li>
                                <li>
                                    <a onClick={handleShowAgregarCiudad}>
                                        <i className="fa fa-plus-circle" /> {state.agregarCiudad}
                                    </a>
                                </li>
                            </ul>

                            <div className="tab-content" id="ciudadContentTabs">
                                <div className="widget-wrap" id="Listado" className="tab-pane fade in show">
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
                                                        getRowId={(row) => row.m_nIdCiudad}
                                                        onRowSelected={(row) => {
                                                            handleSelectCiudad(row.data, this)
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
                                                    <form className="j-forms" onSubmit={handleAceptarCiudad}>
                                                        <div className="form-content">

                                                            <div className="col-sm-4 col-md-4 unit">

                                                                <div className="input">
                                                                    <TextField variant="outlined" margin="dense"
                                                                        onChange={handleChange}
                                                                        label="Código"
                                                                        className="form-control"
                                                                        type="number"
                                                                        min="0"
                                                                        required={true}
                                                                        readOnly={state.agregar == "Consultar"}
                                                                        value={state.codigoCiudad}
                                                                        id="codigoCiudad"
                                                                    />
                                                                </div>
                                                            </div>

                                                            <div className="col-sm-4 col-md-4 unit">

                                                                <div className="input">
                                                                    <TextField variant="outlined" margin="dense"
                                                                        onChange={handleChange}
                                                                        className="form-control"
                                                                        type="text"
                                                                        label="Abreviación"
                                                                        required={true}
                                                                        readOnly={state.agregar == "Consultar"}
                                                                        value={state.abreviacionCiudad}
                                                                        id="abreviacionCiudad"
                                                                    />
                                                                </div>
                                                            </div>

                                                            <div className="col-sm-4 col-md-4 unit">

                                                                <div className="input">
                                                                    <TextField variant="outlined" margin="dense"
                                                                        onChange={handleChange}
                                                                        className="form-control"
                                                                        type="text"
                                                                        label="Ciudad"
                                                                        required={true}
                                                                        readOnly={state.agregar == "Consultar"}
                                                                        value={state.ciudad}
                                                                        id="ciudad"
                                                                    />
                                                                </div>
                                                            </div>

                                                            <div className="col-sm-4 col-md-4 unit">
                                                                <div className="input">
                                                                    <label className="input select">
                                                                        <FormControl fullWidth variant="outlined" margin="dense">
                                                                            <InputLabel id="idPaisLabel">País</InputLabel>
                                                                            <Select
                                                                                labelId="idPaisLabel"
                                                                                label="País"
                                                                                className="form-control"
                                                                                required
                                                                                onChange={handleSelectPais}
                                                                                readOnly={state.agregar == "Consultar"}
                                                                                value={state.idPais}
                                                                                id="idPais"
                                                                            >
                                                                                {
                                                                                    dataPais.length < 1 ?

                                                                                        <option value="none">
                                                                                            País
                                          </option>
                                                                                        :
                                                                                        dataPais.map((pais) => (
                                                                                            <option key={pais.m_nIdPais} value={pais.m_nIdPais}>
                                                                                                {pais.m_sPais}
                                                                                            </option>
                                                                                        ))
                                                                                }

                                                                            </Select>
                                                                        </FormControl>
                                                                    </label>
                                                                </div>
                                                            </div>

                                                            <div className="col-sm-4 col-md-4 unit">
                                                                <div className="input">
                                                                    <label className="input select">
                                                                        <FormControl fullWidth variant="outlined" margin="dense">
                                                                            <InputLabel id="idEstadoLabel">Estado</InputLabel>
                                                                            <Select
                                                                                labelId="idEstadoLabel"
                                                                                label="Estado"
                                                                                className="form-control"
                                                                                required
                                                                                onChange={handleChange}
                                                                                readOnly={state.agregar == "Consultar"}
                                                                                value={state.idEstado}
                                                                                id="idEstado"
                                                                            >
                                                                                {
                                                                                    dataEstado.length < 1 ?

                                                                                        <option value="none">
                                                                                            Estados
                                    </option>
                                                                                        :
                                                                                        dataEstado.map((estado) => (
                                                                                            <option value={estado.m_nIdEstado}>
                                                                                                {estado.m_sEstado}
                                                                                            </option>
                                                                                        ))
                                                                                }
                                                                            </Select>
                                                                        </FormControl>
                                                                    </label>
                                                                </div>
                                                            </div>


                                                        </div>
                                                        <br></br>
                                                        <div className="form-footer" className="col-md-12">
                                                            <button type="button" onClick={(event) => { event.stopPropagation(); setState({...state, agregarCiudad: "Agregar" }); $('#ciudadTabs li ').removeClass('active'); $('#ciudadTabs li').eq(0).addClass('active'); $('#ciudadContentTabs div ').removeClass('in show'); $('#Listado').addClass('in show'); }} className="btn btn-secondary secondary-btn"
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

                            </div>
                        </div>

                        <div className="col-md-5" >
                            <ul className="nav navStatica nav-tabs" id="codigoTabs">
                                <li className="active">
                                    <a onClick={(event) => { event.stopPropagation(); setState({...state, agregarCodigoPostal: "Agregar" }); $('#codigoTabs li ').removeClass('active'); $('#codigoTabs li').eq(0).addClass('active'); $('#codigoContentTabs div ').removeClass('in show'); $('#ListadoEstado').addClass('in show'); }}>
                                        <i className="fa fa-list" /> Listado
                </a>
                                </li>
                                <li>
                                    <a  onClick={handleShowAgregarCodigoPostal}>
                                        <i className="fa fa-plus-circle" /> {state.agregarCodigoPostal}
                                    </a>
                                </li>
                            </ul>

                            <div className="tab-content" id="codigoContentTabs">
                                <div className="widget-wrap" id="ListadoEstado" className="tab-pane fade in show">
                                    <div className="widget-wrap">
                                        <div className="widget-content">
                                            <div className="row" style={{ height: state.height - 250, width: '100%' }}>
                                                {dataCodigoPostal.length != 0 ? (
                                                    <DataGrid
                                                        localeText={dataGridLocaleText}
                                                        rows={dataCodigoPostal}
                                                        columns={columnsCodigoPostal}
                                                        density="compact"
                                                        pageSize={Math.floor((state.height - 310) / 30)}
                                                        getRowId={(row) => row.m_nIdCP}
                                                        onRowSelected={(row) => {
                                                            setState({
                                                                ...state,
                                                                idCodigoPostal: row.data.m_nIdCP
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

                                <div className="widget-wrap" id="AgregarCP" className="tab-pane fade">
                                    <div className="widget-wrap">
                                        <div className="widget-content">
                                            <div className="row">
                                                <div className="col-md-12">
                                                    <form className="j-forms" onSubmit={handleAceptarCodigoPostal}>
                                                        <div className="form-content">

                                                            <div className="col-sm-4 col-md-4 unit">

                                                                <div className="input">
                                                                    <TextField variant="outlined" margin="dense"
                                                                        onChange={handleChange}
                                                                        className="form-control"
                                                                        type="text"
                                                                        label="Código Postal"
                                                                        required={true}
                                                                        readOnly={state.agregarCodigoPostal == "Consultar"}
                                                                        value={state.codigoPostal}
                                                                        id="codigoPostal"
                                                                    />
                                                                </div>
                                                            </div>

                                                            <div className="col-sm-4 col-md-4 unit">

                                                                <div className="input">
                                                                    <TextField variant="outlined" margin="dense"
                                                                        onChange={handleChange}
                                                                        className="form-control"
                                                                        type="text"
                                                                        label="Zona"
                                                                        required={true}
                                                                        readOnly={state.agregarCodigoPostal == "Consultar"}
                                                                        value={state.zona}
                                                                        id="zona"
                                                                    />
                                                                </div>
                                                            </div>

                                                        </div>
                                                        <br></br>
                                                        <div className="form-footer" className="col-md-12">
                                                            <button type="button" onClick={(event) => { event.stopPropagation(); setState({...state, agregarCodigoPostal: "Agregar" }); $('#codigoTabs li ').removeClass('active'); $('#codigoTabs li').eq(0).addClass('active'); $('#codigoContentTabs div ').removeClass('in show'); $('#ListadoEstado').addClass('in show'); }} className="btn btn-secondary secondary-btn"
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

export default CiudadesCodigoPostal;
