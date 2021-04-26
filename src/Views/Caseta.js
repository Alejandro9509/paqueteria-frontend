import React, { useEffect, useState, useMemo } from "react";
import axios from "axios";
import Cabecera from "../Components/Template/Cabecera";
import BarraLateralIzquierda from "../Components/Template/BarraLateralIzquierda";
import BarraLateralDerecha from "../Components/Template/BarraLateralDerecha";
import { useTable, useFilters, useSortBy } from 'react-table'
import { makeStyles } from "@material-ui/core/styles";
import { DataGrid } from '@material-ui/data-grid';

import Noty from 'noty';
import { TextField } from "@material-ui/core";

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

function Caseta() {

    const classes = useStyles();
    const [data, setData] = React.useState([])
    const [state, setState] = React.useState({
        idCaseta: 0,
        descripcion: "",
        DerechoBorrar: 105,
        tarifaEje2: "",
        tarifaEje3: "",
        tarifaEje4: "",
        tarifaEje5: "",
        tarifaEje6: "",
        tarifaEje7: "",
        tarifaEje8: "",
        tarifaEje9: "",
        CreadoPor: localStorage.getItem("UsuarioId"),
        ModificadoPor: localStorage.getItem("UsuarioId"),

        agregar: "Agregar",
        height: window.innerHeight
    })

    const handleAceptar = (e) => {
        e.preventDefault()
        var params = {

            "m_nIdCaseta": state.idCaseta,
            "m_sDescripcion": state.descripcion,
            "m_cTarifaEje2": state.tarifaEje2,
            "m_cTarifaEje3": state.tarifaEje3,
            "m_cTarifaEje4": state.tarifaEje4,
            "m_cTarifaEje5": state.tarifaEje5,
            "m_cTarifaEje6": state.tarifaEje6,
            "m_cTarifaEje7": state.tarifaEje7,
            "m_cTarifaEje8": state.tarifaEje8,
            "m_cTarifaEje9": state.tarifaEje9,
            "m_nCreadoPor": state.CreadoPor,
            "m_nModificadoPor": state.ModificadoPor
        }
        console.log(params)
        if (state.idCaseta != 0) {
            const url = `${process.env.REACT_APP_API_URL}/Casetas/Modificar/` + state.idCaseta;
            axios.put(url, Object.assign({}, params), { headers }).then(respuesta => {
                showSuccess(respuesta.data)
                getAllData()
            }).catch(err => {
                console.log(err)
                showSuccess("err")
            });
        } else {
            const url = `${process.env.REACT_APP_API_URL}/Casetas/Agregar`;
            //showSuccess(state.CreadoPor);
            axios.post(url, Object.assign({}, params), { headers }).then(respuesta => {
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
        const urlDelete = `${process.env.REACT_APP_API_URL}/Utilerias/ValidaDerechos/${state.CreadoPor}/${state.DerechoBorrar}/3`;
        axios.get(urlDelete, { headers }).then(respuesta => {
            //showSuccess(respuesta.data)

            derecho = respuesta.data;
            if (derecho == false) {
                showSuccess("El usuario no tiene derechos para realizar el proceso");
                return;
            }
            const url = `${process.env.REACT_APP_API_URL}/Casetas/Eliminar/` + id;
            axios.delete(url, { headers }).then(respuesta => {
                showSuccess(respuesta.data)
                getAllData()
            }).catch(err => {
                showSuccess(err)
            });
        }).catch(err => {
            showSuccess(err)
        });



    }

    function handleShowConsultar(id) {

        const url = `${process.env.REACT_APP_API_URL}/Casetas/GetById/${id}`;
        axios.get(url, { headers }).then(respuesta => {
            console.log(respuesta.data)
            setState({
                ...state,
                agregar: "Consultar",
                idCaseta: id,
                descripcion: respuesta.data.m_sDescripcion,
                tarifaEje2: respuesta.data.m_cTarifaEje2,
                tarifaEje3: respuesta.data.m_cTarifaEje3,
                tarifaEje4: respuesta.data.m_cTarifaEje4,
                tarifaEje5: respuesta.data.m_cTarifaEje5,
                tarifaEje6: respuesta.data.m_cTarifaEje6,
                tarifaEje7: respuesta.data.m_cTarifaEje7,
                tarifaEje8: respuesta.data.m_cTarifaEje8,
                tarifaEje9: respuesta.data.m_cTarifaEje9,

            })
        });

    }

    function handleShowModificar(id) {
        const url = `${process.env.REACT_APP_API_URL}/Casetas/GetById/${id}`;
        axios.get(url, { headers }).then(respuesta => {
            console.log(respuesta.data)
            setState({
                ...state,
                agregar: "Modificar",
                idCaseta: id,
                descripcion: respuesta.data.m_sDescripcion,
                tarifaEje2: respuesta.data.m_cTarifaEje2,
                tarifaEje3: respuesta.data.m_cTarifaEje3,
                tarifaEje4: respuesta.data.m_cTarifaEje4,
                tarifaEje5: respuesta.data.m_cTarifaEje5,
                tarifaEje6: respuesta.data.m_cTarifaEje6,
                tarifaEje7: respuesta.data.m_cTarifaEje7,
                tarifaEje8: respuesta.data.m_cTarifaEje8,
                tarifaEje9: respuesta.data.m_cTarifaEje9,

            })
        });
    }

    function handleShowAgregar() {
        setState({
            ...state,
            agregar: "Agregar",
            idCaseta: 0,
            descripcion: "",
            tarifaEje2: "",
            tarifaEje3: "",
            tarifaEje4: "",
            tarifaEje5: "",
            tarifaEje6: "",
            tarifaEje7: "",
            tarifaEje8: "",
            tarifaEje9: "",
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
            idCaseta: id
        });
    }

    const columns = React.useMemo(() => [
        {
            headerName: "Acciones",
            field: "",
            renderCell: (row) => {
                return (
                    <div>
                        <a href="#Agregar" role="tab" data-toggle="tab" onClick={() => (handleShowModificar(row.row.m_nIdCaseta))} className="btn btn-default btn-xs"><i className="fa fa-pencil-square-o" style={{ color: "#F9A03E" }} /></a>
                        <a href="#Agregar" role="tab" data-toggle="tab" className="btn btn-default btn-xs" onClick={() => (handleShowModificar(row.row.m_nIdCaseta))}><i className="fa fa-eye" style={{ color: "#F9A03E" }} /></a>
                        <a href="#" className="btn btn-default btn-xs" onClick={() => (handleEliminar(row.row.m_nIdCaseta))}><i className="zmdi zmdi-delete" style={{ color: "#F30B0B" }} /></a>
                    </div>
                )
            }
        },
        {
            headerName: "Casetas",
            field: "m_sDescripcion",
            width: 200
        }, {
            headerName: "2 Ejes",
            field: "m_cTarifaEje2",
            width: 100
        }, {
            headerName: "3 Ejes",
            field: "m_cTarifaEje3",
            width: 100
        }, {
            headerName: "4 Ejes",
            field: "m_cTarifaEje4",
            width: 100
        }, {
            headerName: "5 Ejes",
            field: "m_cTarifaEje5",
            width: 100
        }, {
            headerName: "6 Ejes",
            field: "m_cTarifaEje6",
            width: 100
        }, {
            headerName: "7 Ejes",
            field: "m_cTarifaEje7",
            width: 100
        }, {
            headerName: "8 Ejes",
            field: "m_cTarifaEje8",
            width: 100
        },
        {
            headerName: "9 Ejes",
            field: "m_cTarifaEje9",
            width: 100
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
        const url = `${process.env.REACT_APP_API_URL}/Casetas/GetListado`;
        axios.get(url, { headers }).then(respuesta => {
            setData(respuesta.data)
        });
    };

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
                                        onClick={handleSelectRow.bind(this, row.original.m_nIdCaseta)}
                                        className={state.idCaseta === row.original.m_nIdCaseta ? classes.seleccionado : classes.noSeleccionado}>
                                        <td>
                                            <div>
                                                <a href="#Agregar" role="tab" data-toggle="tab" className="btn btn-default btn-sm" onClick={() => (handleShowModificar(row.original.m_nIdCaseta))}><i className="fa fa-pencil-square-o" style={{ color: "#F9A03E" }} /></a>
                                                <a href="#Agregar" role="tab" data-toggle="tab" className="btn btn-default btn-sm" onClick={() => (handleShowConsultar(row.original.m_nIdCaseta))}><i className="fa fa-eye" style={{ color: "#F9A03E" }} /></a>
                                                <a href="#" className="btn btn-default btn-sm" onClick={() => (handleEliminar(row.original.m_nIdCaseta))}><i className="zmdi zmdi-delete" style={{ color: "#F30B0B" }} /></a>
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
        <div>

            <header className="topbar clearfix">
                <Cabecera />
            </header>

            {/*Leftbar Start Here*/}
            <aside className="iconic-leftbar" style={{ minHeight: state.height }}>
                <BarraLateralIzquierda />
            </aside>
            {/*Leftbar End Here*/}

            {/*Page Container Start Here*/}
            <section className="main-container">

                <div className="container-fluid">

                    <div className="page-header filled full-block light">
                        <div className="row">
                            <div className="col-md-6 col-sm-6">
                                <h2>Caseta</h2>
                            </div>
                            <div className="col-md-6 col-sm-6">
                                <ul className="list-page-breadcrumb">
                                    <li>
                                        <a href="/Catalogos" className="color-mapeo">
                                            Configuración <i className="zmdi zmdi-chevron-right" />
                                        </a>
                                    </li>
                                    <li className="active-page">Caseta</li>
                                </ul>
                            </div>
                        </div>
                    </div>


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
                                                rows={data}
                                                columns={columns}
                                                density="compact"
                                                pageSize={Math.floor((state.height - 310) / 30)}
                                                getRowId={(row) => row.m_nIdCaseta}
                                                onRowSelected={(row) => {
                                                    setState({
                                                        ...state,
                                                        idCaseta: row.data.m_nIdCaseta
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

                                                    <div className="col-md-12 unit">

                                                        <div className="input">
                                                            <TextField variant="outlined"
                                                                onChange={handleChange}
                                                                className="form-control"
                                                                type="text"
                                                                label="Caseta"
                                                                margin="dense"
                                                                required={true}
                                                                readOnly={state.agregar == "Consultar"}
                                                                value={state.descripcion}
                                                                id="descripcion"
                                                            />
                                                        </div>
                                                    </div>

                                                    <div className="col-md-12 unit" style={{padding: "10px"}}>
                                                        <div className="col-md-1">
                                                            Tarifas
                                                        </div>
                                                        <div className="col-md-1">
                                                            <div className="input">
                                                                <TextField variant="outlined" margin="dense"
                                                                    onChange={handleChange}
                                                                    className="form-control"
                                                                    placeholder="2 Ejes"
                                                                    margin="dense"
                                                                    type="number"
                                                                    min="0"
                                                                    label="2 Ejes"
                                                                    step="0.01"
                                                                    required={true}
                                                                    readOnly={state.agregar == "Consultar"}
                                                                    value={state.tarifaEje2}
                                                                    id="tarifaEje2"
                                                                />
                                                            </div>
                                                        </div>

                                                        <div className="col-md-1">
                                                            <div className="input">
                                                                <TextField variant="outlined"
                                                                    onChange={handleChange}
                                                                    className="form-control"
                                                                    placeholder="3 Ejes"
                                                                    margin="dense"
                                                                    type="number"
                                                                    min="0"
                                                                    step="0.01"
                                                                    label="3 Ejes"
                                                                    required={true}
                                                                    readOnly={state.agregar == "Consultar"}
                                                                    value={state.tarifaEje3}
                                                                    id="tarifaEje3"
                                                                />
                                                            </div>
                                                        </div>

                                                        <div className="col-md-1">
                                                            <div className="input">
                                                                <TextField variant="outlined"
                                                                    onChange={handleChange}
                                                                    className="form-control"
                                                                    placeholder="4 Ejes"
                                                                    type="number"
                                                                    margin="dense"
                                                                    label="4 Ejes"
                                                                    min="0"
                                                                    step="0.01"
                                                                    required={true}
                                                                    readOnly={state.agregar == "Consultar"}
                                                                    value={state.tarifaEje4}
                                                                    id="tarifaEje4"
                                                                />
                                                            </div>
                                                        </div>

                                                        <div className="col-md-1">
                                                            <div className="input">
                                                                <TextField variant="outlined"
                                                                    onChange={handleChange}
                                                                    className="form-control"
                                                                    placeholder="5 Ejes"
                                                                    type="number"
                                                                    min="0"
                                                                    margin="dense"
                                                                    label="5 Ejes"
                                                                    step="0.01"
                                                                    required={true}
                                                                    readOnly={state.agregar == "Consultar"}
                                                                    value={state.tarifaEje5}
                                                                    id="tarifaEje5"
                                                                />
                                                            </div>
                                                        </div>

                                                        <div className="col-md-1">
                                                            <div className="input">
                                                                <TextField variant="outlined"
                                                                    onChange={handleChange}
                                                                    className="form-control"
                                                                    placeholder="6 Ejes"
                                                                    type="number"
                                                                    margin="dense"
                                                                    min="0"
                                                                    label="6 Ejes"
                                                                    step="0.01"
                                                                    required={true}
                                                                    readOnly={state.agregar == "Consultar"}
                                                                    value={state.tarifaEje6}
                                                                    id="tarifaEje6"
                                                                />
                                                            </div>
                                                        </div>

                                                        <div className="col-md-1">
                                                            <div className="input">
                                                                <TextField variant="outlined"
                                                                    onChange={handleChange}
                                                                    className="form-control"
                                                                    placeholder="7 Ejes"
                                                                    type="number"
                                                                    margin="dense"
                                                                    min="0"
                                                                    label="7 Ejes"
                                                                    step="0.01"
                                                                    required={true}
                                                                    readOnly={state.agregar == "Consultar"}
                                                                    value={state.tarifaEje7}
                                                                    id="tarifaEje7"
                                                                />
                                                            </div>
                                                        </div>

                                                        <div className="col-md-1">
                                                            <div className="input">
                                                                <TextField variant="outlined"
                                                                    onChange={handleChange}
                                                                    className="form-control"
                                                                    placeholder="8 Ejes"
                                                                    type="number"
                                                                    margin="dense"
                                                                    label="8 Ejes"
                                                                    min="0"
                                                                    step="0.01"
                                                                    required={true}
                                                                    readOnly={state.agregar == "Consultar"}
                                                                    value={state.tarifaEje8}
                                                                    id="tarifaEje8"
                                                                />
                                                            </div>
                                                        </div>

                                                        <div className="col-md-1">
                                                            <div className="input">
                                                                <TextField variant="outlined"
                                                                    onChange={handleChange}
                                                                    className="form-control"
                                                                    placeholder="9 Ejes"
                                                                    type="number"
                                                                    margin="dense"
                                                                    label="9 Ejes"
                                                                    min="0"
                                                                    step="0.01"
                                                                    required={true}
                                                                    readOnly={state.agregar == "Consultar"}
                                                                    value={state.tarifaEje9}
                                                                    id="tarifaEje9"
                                                                />
                                                            </div>
                                                        </div>

                                                    </div>

                                                </div>
                                                <br></br>
                                                <div className="form-footer" className="col-md-12">
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

export default Caseta;
