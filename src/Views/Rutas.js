import React, { useEffect, useState, setData, useMemo, Component } from "react";
import logo from "../logo.svg";
import axios from "axios";
import { Dialog, DialogActions, DialogContent, FormControl, IconButton, Input, InputAdornment, InputLabel } from "@material-ui/core";

import DataTable from "react-data-table-component";
import Cabecera from "../Components/Template/Cabecera";
import BarraLateralIzquierda from "../Components/Template/BarraLateralIzquierda";
import $ from "jquery";
import { useTable, useFilters, useSortBy } from "react-table";
import TextField from "@material-ui/core/TextField";
import Autocomplete from "@material-ui/lab/Autocomplete";
import { DisplayMapClass } from "./DisplayMapClass";
import { makeStyles } from "@material-ui/core/styles";
import PageviewIcon from "@material-ui/icons/Pageview";

import Noty from 'noty';
import { point } from "leaflet";
import NavigationList from "../Components/Map/ListNavigation";
import { SettingsEthernet } from "@material-ui/icons";
import { useHistory } from "react-router";
import { Button } from "bootstrap";

const XLocateClient = window.XLocateClient;
const XRouteClient = window.XRouteClient;




var xlocate = new XLocateClient();
xlocate.setCredentials("xtok", "51FA3E8E-8BF3-49EF-AB82-59D807A0645C")
var xroute = new XRouteClient();
xroute.setCredentials("xtok", "51FA3E8E-8BF3-49EF-AB82-59D807A0645C")

var originFlag = false
let timer;


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
        backgroundColor: "#688ad9",
    },
    noSeleccionado: {
        backgroundColor: "#FFFFFF",
    }
};
const useStyles = makeStyles(styles);

window.jQuery = window.$ = $;
const headers = {
    "Content-Type": "application/json",
    //'access-control-allow-origin': '*'
};

function Rutas(props) {
    const classes = useStyles();
    const history = useHistory()
    const [data, setData] = React.useState([]);
    const [tiposViaje, setTiposViaje] = React.useState([])
    const [calificaciones, setCalificaciones] = React.useState([])
    const [dataTipoUnidad, setDataTipoUnidad] = React.useState([]);
    const [state, setState] = React.useState({
        openDialog: false,
        idRuta: 0,
        height: window.innerHeight,
        points: [],
        showMap: false,
        route: null,
        polygon: [],
        origin: "",
        destiny: "",
        originLocation: null,
        destinyLocation: null,
        isManual: false,
        isTour: false,
        showDialog: false,
        identificadorModal: "",
        tipoModal: 0,
        tipoUnidad: null,
        tipoViaje: null,
        trayecto: "PERMANENTE"
    })
    const [map, setMap] = useState(null)

    function conDatos() {
        return data.length != 0;
    }

    function getAllData() {
        const url = `${process.env.REACT_APP_API_URL}/Rutas/GetListado`;
        axios.get(url, { headers }).then((respuesta) => {
            console.log(respuesta.data);
            setData(respuesta.data);

        });
    }

    function routed(route, exc) {

        var polygon = []
        if (route) {
            route.polyline.plain.polyline.map(c => {
                polygon.push([c.y, c.x])
            })
            setState({
                ...state,
                route: route,
                polygon: polygon,
                description: (state.origin + " - " + state.destiny)
            })

            if (!state.isManual) {
                map.flyToBounds([state.points[0].location, state.points[state.points.length - 1].location], { padding: [0, 0] })
            }
        }

    }
    useEffect(value => {
        getTiposViajeData()
        getAllTipoUnidad()
        getCalificacionesData()
        getAllData();
    }, [])

    function handleEliminar(id) {
        var derecho;
    }

    const columnsTipoUnidades = React.useMemo(() => [
        {
            Name: "Tipo de unidad",
            accessor: "m_sTipoUnidad",
        },
        {
            Name: "Identificador",
            accessor: "m_nIdentificador",
        },
        {
            Name: "Nomenclatura",
            accessor: "m_sNomenclaturaSCT",
        },
        {
            Name: "Estatus",
            accessor: "m_bActivo",
        },
    ]);

    const columns = React.useMemo(() => [
        {
            Name: "Folio",
            accessor: "m_sFolio",
        },
        {
            Name: "Descripción",
            accessor: "m_sDescripcion",
        },
        {
            Name: "Origen",
            accessor: "m_sOrigen",
        },
        {
            Name: "Destino",
            accessor: "m_sDestino",
        },
        {
            Name: "Activa",
            accessor: "m_bActiva",
        },
    ]);

    function DefaultColumnFilter({
        column: { filterValue, preFilteredRows, setFilter },
    }) {
        const count = preFilteredRows.length;

        return (
            <input
                className="form-control"
                value={filterValue || ""}
                onChange={(e) => {
                    setFilter(e.target.value || undefined);
                }}
                placeholder={`Buscar ${count} registros...`}
            />
        );
    }

    function getAllTipoUnidad() {
        const url = `${process.env.REACT_APP_API_URL}/TiposUnidades/GetListado`;
        axios.get(url, { headers }).then((respuesta) => {
            console.log(respuesta.data)
            setDataTipoUnidad(respuesta.data);
        });
    }


    const handleAceptar = (e) => {

        e.preventDefault();

        var params = {

            "m_nIdFolio": state.folio,
            "m_sOrigen": state.origin,
            "m_sDestino": state.destiny,
            "m_sDescripcion": state.descripcion,
            "m_nIdTipoViaje": state.tipoViaje,
            "m_nIdClasificacionViaje": state.calificacion,
            "m_bTipoTrayecto": state.tipoUnidad,
            ".m_rHoras": state.horas,
            "m_rETA": state.eta,
            "m_rKM": state.kilometros,
            "m_rMillas": state.millas,
            "m_bActiva": state.activa,
            ".m_bPermanente": state.trayecto === "PERMANENTE",
            "m_bTrazoLibre": state.isManual,
            "m_xnOrigenLatitud": state.points[0].location[1],
            "m_xnOrigenLongitud": state.points[0].location[0],
            "m_xnDestinoLatitud": state.points[state.points.length - 1].location[1],
            "m_xnDestinoLongitud": state.points[state.points.length - 1].location[0],

        }
        console.log(params)
        if (state.idRuta != 0) {
            const url = `${process.env.REACT_APP_API_URL}/Rutas/Modificar/${state.idRuta}`;
            axios
                .put(url, Object.assign({}, params), { headers })
                .then((respuesta) => {
                    showSuccess(respuesta.data);
                    getAllData();
                })
                .catch((err) => {
                    console.log(err);
                    showSuccess("err");
                });
        } else {
            const url = `${process.env.REACT_APP_API_URL}/Rutas/Agregar`;
            axios
                .post(url, Object.assign({}, params), { headers })
                .then((respuesta) => {
                    console.log(respuesta.data);
                    showSuccess(respuesta.data);
                    getAllData();
                })
                .catch((err) => {
                    console.log(err);
                    showSuccess(err);
                });
        }
    };

    function getTiposViajeData() {
        const url = `${process.env.REACT_APP_API_URL}/TipoViaje/GetListado`;
        axios.get(url, { headers }).then(respuesta => {
            console.log(respuesta.data)
            setTiposViaje(respuesta.data)
        });
    };

    function getCalificacionesData() {
        const url = `${process.env.REACT_APP_API_URL}/CalificacionViaje/GetListado`;
        axios.get(url, { headers }).then(respuesta => {
            console.log(respuesta.data)
            setCalificaciones(respuesta.data)
        });
    };

    function handleTypeRoute(type, value) {
        switch (type) {
            case 1:
                setState({ ...state, isManual: value, isTour: false, points: [], originLocation: null, route: null, polygon: [] })
                break;
            case 2:
                setState({ ...state, isManual: false, isTour: value, points: [], destinyLocation: null, route: null, polygon: [] })
                break;
        }

    }

    function setPoint(point) {
        var points = state.points

        points.push({ key: points.length, label: "", location: [point.lat, point.lng] })
        setState({ ...state, points: points })
        calculateRoute();
    }

    function apiPoint(x, y) {
        return ({
            "$type": "OnRoadWaypoint",
            "location": {
                "coordinate": {
                    "x": x,
                    "y": y
                },
                "considerAlternativeNearByRoads": true
            }
        })
    };

    const columnsTipoViaje = React.useMemo(() => [
        {
            Name: "Código",
            accessor: "m_nCodigo",
        }, {
            Name: "Tipo de Viaje / Ruta",
            accessor: "m_sTipoViaje",
        },
        {
            Name: "Estatus",
            accessor: "m_bActivo",
        },
    ]);

    useEffect(value => {
        if (state.originLocation != null && state.destinyLocation != null) {
            calculateRoute()
        }
    }, [state.originLocation, state.destinyLocation])

    function calculateRoute() {

        xroute.calculateRoute({
            "waypoints": state.points.map(p => apiPoint(p.location[1], p.location[0])),
            "resultFields": {
                "polyline": true,
                "eventTypes": [
                    "MANEUVER_EVENT",
                    "TOLL_EVENT"
                ],
                "guidedNavigationRoute": true
            },
            "routeOptions": {
                "polylineOptions": {
                    "elevations": true
                }
            },
            "requestProfile": {
                "userLanguage": "es"
            }

        }, routed);
    }

    function handleShowConsultar(id) {
        console.log(id);
    }

    function handleShowModificar(id) {
        console.log(id);
    }

    function handleSelectRow(id, event) {
        setState({
            ...state,
            origin: "",
            destiny: "",
            originLocation: null,
            destinyLocation: null,
            IdEmbalaje: id
        });
    }

    const handleChange = (event) => {
        setState({
            ...state,
            [event.target.name]: event.target.value,
        });
    };

    function searchLocation(isOrigin) {
        originFlag = isOrigin
        xlocate.searchLocations({
            "$type": "SearchByTextRequest",
            "text": isOrigin ? state.origin : state.destiny
        }, searchCompleted);

    }
    function handleSelectCP(id, dobleClick, e) {
        clearTimeout(timer);
        if (e.detail === 1) {
            timer = setTimeout(() => {
                setState({
                    ...state,
                    [state.identificadorModal]: id,
                    openDialog: true
                })
            }, 200)
        } else if (e.detail === 2) {
            setState({
                ...state,
                [state.identificadorModal]: id,
                openDialog: false
            });
        }

        console.log(dobleClick);
    }

    function searchCompleted(response, exception) {
        if (response) {
            if (response.results.length != 0) {
                var points = state.points
                if (originFlag) {
                    points[0] = { key: 0, label: response.results[0].location.formattedAddress, location: [response.results[0].location.referenceCoordinate.y, response.results[0].location.referenceCoordinate.x] }
                    setState({ ...state, originLocation: response.results[0], points: points })
                    //map.flyTo(points[0].location , 10)
                } else {
                    points[1] = { key: points.length - 1, label: response.results[0].location.formattedAddress, location: [response.results[0].location.referenceCoordinate.y, response.results[0].location.referenceCoordinate.x] }
                    setState({ ...state, destinyLocation: response.results[0], points: points })
                }


            }
        } else {
            console.log(exception)
            showSuccess("No se encontraron coincidencias")
        }
    }

    function TableTipoViaje({ columns, data, select }) {

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
                                    <tr style={{ backgroundColor: row.original.m_nIdTipoViaje === select ? "orange" : "white" }} {...row.getRowProps()} onClick={handleSelectCP.bind(this, row.original, false)} onDoubleClick={handleSelectCP.bind(this, row.original, true)}>
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

    function TableTipoUnidad({ columns, data, select }) {
        const defaultColumn = React.useMemo(
            () => ({
                // Default Filter UI
                Filter: DefaultColumnFilter,
            }),
            []
        );

        const {
            getTableProps,
            getTableBodyProps,
            headerGroups,
            rows,
            prepareRow,
            state,
        } = useTable(
            {
                columns,
                data,
                defaultColumn,
            },
            useFilters,
            useSortBy
        );

        return (
            <div className="col-md-12">
                <table className="table" {...getTableProps()}>
                    <thead>
                        {headerGroups.map((headerGroup) => (
                            <tr {...headerGroup.getHeaderGroupProps()}>
                                {headerGroup.headers.map(column => (
                                    // Add the sorting props to control sorting. For this example
                                    // we can add them into the header props
                                    <th {...column.getHeaderProps(column.getSortByToggleProps())}>
                                        {column.render("Name")}
                                        {/* Add a sort direction indicator */}
                                        <span>
                                            {column.isSorted ? (
                                                column.isSortedDesc ? (
                                                    <i className="fa fa-caret-up" />
                                                ) : (
                                                    <i className="fa fa-caret-down" />
                                                )
                                            ) : (
                                                ""
                                            )}
                                        </span>
                                        <div>
                                            {column.canFilter ? column.render("Filter") : null}
                                        </div>
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
                                    <tr style={{ backgroundColor: row.original.m_nIdTipoUnidad === select ? "orange" : "white" }} {...row.getRowProps()} onClick={handleSelectCP.bind(this, row.original, false)} onDoubleClick={handleSelectCP.bind(this, row.original, true)}>
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
        );
    }


    function Table({ columns, data }) {
        const defaultColumn = React.useMemo(
            () => ({
                // Default Filter UI
                Filter: DefaultColumnFilter,
            }),
            []
        );

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
                defaultColumn,
            },
            useFilters,
            useSortBy
        );

        return (
            <div className="col-md-12">
                <table className="table" {...getTableProps()}>
                    <thead>
                        {headerGroups.map((headerGroup) => (
                            <tr {...headerGroup.getHeaderGroupProps()}>
                                <th>Acciones</th>
                                {headerGroup.headers.map((column) => (
                                    // Add the sorting props to control sorting. For this example
                                    // we can add them into the header props
                                    <th {...column.getHeaderProps(column.getSortByToggleProps())}>
                                        {column.render("Name")}
                                        {/* Add a sort direction indicator */}
                                        <span>
                                            {column.isSorted ? (
                                                column.isSortedDesc ? (
                                                    <i className="fa fa-caret-up" />
                                                ) : (
                                                    <i className="fa fa-caret-down" />
                                                )
                                            ) : (
                                                ""
                                            )}
                                        </span>
                                        <div>
                                            {column.canFilter ? column.render("Filter") : null}
                                        </div>
                                    </th>
                                ))}
                            </tr>
                        ))}
                    </thead>
                    <tbody {...getTableBodyProps()}>
                        {rows.map((row, i) => {
                            prepareRow(row);
                            return (
                                <tr {...row.getRowProps()}
                                    onClick={handleSelectRow.bind(this, row.original.m_nIdRuta)}
                                    className={classes.noSeleccionado}>
                                    <td>
                                        <div>
                                            <a
                                                href="#Agregar"
                                                role="tab"
                                                data-toggle="tab"
                                                onClick={() =>
                                                    handleShowModificar(row.original.m_nIdRuta)
                                                }
                                                className="btn btn-default btn-sm"
                                            >
                                                <i
                                                    className="fa fa-pencil-square-o"
                                                    style={{ color: "#F9A03E" }}
                                                />
                                            </a>
                                            <a
                                                href="#Agregar"
                                                role="tab"
                                                data-toggle="tab"
                                                className="btn btn-default btn-sm"
                                                onClick={() =>
                                                    handleShowConsultar(row.original.m_nIdRuta)
                                                }
                                            >
                                                <i className="fa fa-eye" style={{ color: "#F9A03E" }} />
                                            </a>
                                            <a
                                                href="#"
                                                className="btn btn-default btn-sm"
                                                onClick={() =>
                                                    handleEliminar(row.original.m_nIdRuta)
                                                }
                                            >
                                                <i
                                                    className="zmdi zmdi-delete"
                                                    style={{ color: "#F30B0B" }}
                                                />
                                            </a>
                                        </div>
                                    </td>
                                    {row.cells.map((cell) => {
                                        return (
                                            <td {...cell.getCellProps()}>{cell.render("Cell")}</td>
                                        );
                                    })}
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </div>
        );
    }

    return (
        <div>
            <Dialog open={state.openDialog} onClose={() => setState({ ...state, openDialog: false })}>
                <DialogContent>


                    {state.tipoModal == 3 &&
                        <div className="row" style={{ backgroundColor: '#FFFFFF' }}>
                            <div align="right">
                                <button onClick={() => { history.push("/TipoUnidad") }} className="btn btn-primary primary-btn">Agregar</button>
                            </div>
                            {dataTipoUnidad.length != 0 ? <TableTipoUnidad object={state} select={state[state.identificadorModal] && state[state.identificadorModal].m_nIdTipoUnidad} columns={columnsTipoUnidades} data={dataTipoUnidad} identificadorModal={state.identificadorModal} /> : <div>No se encontró ningún registro</div>}

                            <DialogActions style={{ justifyContent: "left" }}>

                                <button onClick={() => setState({ ...state, openDialog: false })} className="btn btn-primary primary-btn">Aceptar</button>
                                <button onClick={() => setState({ ...state, openDialog: false })} className="btn btn-secondary secondary-btn">Cerrar</button>

                            </DialogActions>
                        </div>
                    }
                    {state.tipoModal == 4 &&
                        <div className="row" style={{ backgroundColor: '#FFFFFF' }}>
                            <div align="right">
                                <button onClick={() => { history.push("/TipoUnidad") }} className="btn btn-primary primary-btn">Agregar</button>
                            </div>
                            {dataTipoUnidad.length != 0 ? <TableTipoViaje object={state} select={state[state.identificadorModal] && state[state.identificadorModal].m_nIdTipoViaje} columns={columnsTipoViaje} data={tiposViaje} identificadorModal={state.identificadorModal} /> : <div>No se encontró ningún registro</div>}

                            <DialogActions style={{ justifyContent: "left" }}>

                                <button onClick={() => setState({ ...state, openDialog: false })} className="btn btn-primary primary-btn">Aceptar</button>
                                <button onClick={() => setState({ ...state, openDialog: false })} className="btn btn-secondary secondary-btn">Cerrar</button>

                            </DialogActions>
                        </div>
                    }
                </DialogContent>

            </Dialog>
            <header className="topbar clearfix">
                <Cabecera />
            </header>

            {/*Leftbar Start Here*/}
            <aside className="iconic-leftbar" style={{ minHeight: state.height }}>
                <BarraLateralIzquierda />
            </aside>
            {/*Leftbar End Here*/}

            <section className="main-container">



                <div className="container-fluid">


                    <div className="page-header filled full-block light">
                        <div className="row">
                            <div className="col-md-6 col-sm-6">
                                <h2>Rutas</h2>
                            </div>
                            <div className="col-md-6 col-sm-6">
                                <ul className="list-page-breadcrumb">
                                    <li>
                                        <a href="/Catalogos" className="color-mapeo">
                                            Catálogos <i className="zmdi zmdi-chevron-right" />
                                        </a>
                                    </li>
                                    <li className="active-page">Rutas</li>
                                </ul>
                            </div>
                        </div>
                    </div>

                    <ul className="nav navStatica nav-tabs">
                        <li className="active">
                            <a data-toggle="tab" href="#Listado" onClick={() => setState({ ...state, showMap: false })}>
                                Listado
            </a>
                        </li>
                        <li>
                            <a data-toggle="tab" href="#Agregar" onClick={() => setState({ ...state, showMap: true })}>
                                Agregar
            </a>
                        </li>
                        <li>
                            <a data-toggle="tab" href="#Importar">
                                Importar
            </a>
                        </li>
                        <li>
                            <a data-toggle="tab" href="#Imprimir">
                                Imprimir
            </a>
                        </li>
                    </ul>

                    <div className="tab-content">
                        <div
                            className="widget-wrap"
                            id="Listado"
                            className="tab-pane fade in active"
                        >
                            <div className="widget-wrap">
                                <div className="widget-content">
                                    <div className="row">
                                        {conDatos() ? (
                                            <Table columns={columns} data={data} />
                                        ) : (
                                            <div>No se encontró ningún registro</div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div id="Importar" className="tab-pane fade "></div>
                        <div id="Imprimir" className="tab-pane fade ">
                            Imprimir
          </div>
                        <div id="Importar" className="tab-pane fade ">
                            Importar
          </div>
                        <div id="Agregar" className="tab-pane fade ">
                            <form className="j-forms" onSubmit={handleAceptar}>
                                <div className="row">
                                    <div className="col-md-12">
                                        <div className="widget-wrap">
                                            <div className="widget-container margin-top-0">
                                                <div className="widget-content">

                                                    {/*Inicio de ejemplo*/}
                                                    <div className="widget-container">
                                                        <div className="widget-content">
                                                            <div className="row">

                                                                <div className="col-md-12">
                                                                    <div className="row">
                                                                        <div className="col-md-2 unit">
                                                                            <label className="label">Folio</label>
                                                                            <div className="input">
                                                                                <input
                                                                                    type="text"
                                                                                    pattern="[0-9]*"
                                                                                    className="form-control"
                                                                                    name="folio"
                                                                                    value={state.folio}
                                                                                    onChange={handleChange}
                                                                                    maxLength="4"
                                                                                />
                                                                            </div>
                                                                        </div>
                                                                        <div className="col-md-4 unit">
                                                                            <label className="label">Origen</label>
                                                                            <div className="input">
                                                                                <Input
                                                                                    className="form-control"
                                                                                    type="text"
                                                                                    id="origin"
                                                                                    name="origin"
                                                                                    onChange={handleChange}
                                                                                    endAdornment={
                                                                                        <InputAdornment position="end">
                                                                                            <IconButton
                                                                                                onClick={() => searchLocation(true)}
                                                                                            >
                                                                                                <PageviewIcon
                                                                                                    style={{
                                                                                                        color: "#F9A03E",
                                                                                                        fontSize: 32,
                                                                                                        paddingInlineEnd: 0,
                                                                                                        paddingRight: 0,
                                                                                                        paddingBlockEnd: 0,
                                                                                                        paddingLeft: 0,
                                                                                                        paddingBlock: 0,
                                                                                                    }}
                                                                                                />
                                                                                            </IconButton>
                                                                                        </InputAdornment>
                                                                                    }
                                                                                />
                                                                            </div>
                                                                        </div>
                                                                        <div className="col-md-4 unit">
                                                                            <label className="label">Destino</label>
                                                                            <div className="input">
                                                                                <Input
                                                                                    className="form-control"
                                                                                    type="text"
                                                                                    id="destiny"
                                                                                    name="destiny"
                                                                                    onChange={handleChange}
                                                                                    endAdornment={
                                                                                        <InputAdornment position="end">
                                                                                            <IconButton
                                                                                                onClick={() => searchLocation(false)}
                                                                                            >
                                                                                                <PageviewIcon
                                                                                                    style={{
                                                                                                        color: "#F9A03E",
                                                                                                        fontSize: 32,
                                                                                                        paddingInlineEnd: 0,
                                                                                                        paddingRight: 0,
                                                                                                        paddingBlockEnd: 0,
                                                                                                        paddingLeft: 0,
                                                                                                        paddingBlock: 0,
                                                                                                    }}
                                                                                                />
                                                                                            </IconButton>
                                                                                        </InputAdornment>
                                                                                    }
                                                                                />
                                                                            </div>
                                                                        </div>
                                                                        <div className="col-md-2 unit">
                                                                            <label className="label">Descripción</label>
                                                                            <div className="input">
                                                                                <input
                                                                                    className="form-control"
                                                                                    type="text"
                                                                                    value={state.description}
                                                                                    name={"description"}
                                                                                    onChange={handleChange}
                                                                                    id="descripcion"
                                                                                />
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                    <div className="row">
                                                                        <div className="col-md-2 unit">

                                                                        </div>
                                                                        <div className="col-md-4 unit">
                                                                            <label className="label">
                                                                                Tipo de viaje
                                                </label>
                                                                            <label className="input select">
                                                                                <select
                                                                                    className="form-control"
                                                                                    required
                                                                                    value={state.tipoViaje}
                                                                                    disabled={state.agregar == "Consultar"}
                                                                                    onChange={handleChange}
                                                                                    name="tipoViaje"
                                                                                >
                                                                                    <option value="0">Seleccionar</option>
                                                                                    {tiposViaje.map((tipoViaje) => (
                                                                                        <option
                                                                                            key={tipoViaje.m_nIdTipoViaje}
                                                                                            value={tipoViaje.m_nIdTipoViaje}
                                                                                        >
                                                                                            {tipoViaje.m_sTipoViaje}
                                                                                        </option>
                                                                                    ))}
                                                                                </select>
                                                                                <i></i>
                                                                            </label>
                                                                        </div>
                                                                        <div className="col-md-4 unit">
                                                                            <label className="label">
                                                                                Clasificación de viaje
                                                </label>
                                                                            <label className="input select">
                                                                                <select
                                                                                    className="form-control"
                                                                                    required="false"
                                                                                    value={state.calificacion}
                                                                                    disabled={state.agregar == "Consultar"}
                                                                                    onChange={handleChange}
                                                                                    name="calificacion"
                                                                                >
                                                                                    <option value="0">Seleccionar</option>
                                                                                    
                                                                                </select>
                                                                                <i></i>
                                                                            </label>
                                                                        </div>
                                                                        <div className="col-md-2 unit">
                                                                            <label className="label">
                                                                                Tipo de Unidad
                                    </label>
                                                                            <label className="input select">
                                                                                <select
                                                                                    className="form-control"
                                                                                    required
                                                                                    value={state.tipoUnidad}
                                                                                    disabled={state.agregar == "Consultar"}
                                                                                    onChange={handleChange}
                                                                                    name="tipoUnidad"
                                                                                >
                                                                                    <option value="0">Seleccionar</option>
                                                                                    {dataTipoUnidad.map((tipoUnidad) => (
                                                                                        <option
                                                                                            key={tipoUnidad.m_nIdTipoUnidad}
                                                                                            value={tipoUnidad.m_nIdTipoUnidad}
                                                                                        >
                                                                                            {tipoUnidad.m_sTipoUnidad}
                                                                                        </option>
                                                                                    ))}
                                                                                </select>
                                                                                <i></i>
                                                                            </label>
                                                                        </div>
                                                                    </div>
                                                                    <div className="row">

                                                                        <div className="col-md-2 unit">
                                                                            <div className="inline-group">
                                                                                <label className="label">
                                                                                    Tipo Trayecto
                                                  </label>
                                                                                <label className="radio">
                                                                                    <input
                                                                                        type="radio"
                                                                                        name="trayecto"
                                                                                        value="PERMANETE"
                                                                                        onChange={handleChange}
                                                                                        defaultChecked
                                                                                        checked={state.trayecto === "PERMANETE"}
                                                                                    />
                                                                                    <i />
                                                    Permanente
                                                  </label>
                                                                                <label className="radio">
                                                                                    <input
                                                                                        value="EVENTUAL"
                                                                                        type="radio"
                                                                                        onChange={handleChange}
                                                                                        name="trayecto"
                                                                                        checked={state.trayecto === "EVENTUAL"}
                                                                                    />
                                                                                    <i />
                                                    Eventual
                                                  </label>

                                                                            </div>
                                                                        </div>
                                                                        <div className="col-md-2 unit">
                                                                            <label className="label">Horas</label>
                                                                            <div className="input">
                                                                                <input
                                                                                    className="form-control"
                                                                                    type="text"
                                                                                    onChange={handleChange}
                                                                                    value={state.horas}
                                                                                    name="horas"
                                                                                />
                                                                            </div>
                                                                        </div>
                                                                        <div className="col-md-2 unit">
                                                                            <label className="label">ETA</label>
                                                                            <div className="input">
                                                                                <input
                                                                                    className="form-control"
                                                                                    type="text"
                                                                                    onChange={handleChange}
                                                                                    value={state.eta}
                                                                                    name="eta"
                                                                                />
                                                                            </div>
                                                                        </div>
                                                                        <div className="col-md-2 unit">
                                                                            <label className="label">Kilometros</label>
                                                                            <div className="input">
                                                                                <input
                                                                                    className="form-control"
                                                                                    type="text"
                                                                                    onChange={handleChange}
                                                                                    value={state.kilometros}
                                                                                    name="kilometros"
                                                                                />
                                                                            </div>
                                                                        </div>
                                                                        <div className="col-md-2 unit">
                                                                            <label className="label">Millas</label>
                                                                            <div className="input">
                                                                                <input
                                                                                    className="form-control"
                                                                                    type="text"
                                                                                    onChange={handleChange}
                                                                                    value={state.millas}
                                                                                    name="millas"
                                                                                />
                                                                            </div>
                                                                        </div>
                                                                        <div className="col-md-2 unit">

                                                                            <div className="inline-group">
                                                                                <label className="label">
                                                                                    Estatus
                                                  </label>
                                                                                <label className="checkbox">
                                                                                    <input
                                                                                        required
                                                                                        native="true"
                                                                                        checked={state.activo}
                                                                                        name="activo"
                                                                                        onChange={(e) => setState({ ...state, activo: e.target.checked })}
                                                                                        type="checkbox"
                                                                                    />
                                                                                    <i />
                                                    Activa
                                                  </label>

                                                                            </div>



                                                                        </div>
                                                                        <div className="col-md-2 unit">
                                                                            <div align="right">

                                                                                <button
                                                                                    href="#Listado"
                                                                                    role="tab"
                                                                                    data-toggle="tab"
                                                                                    className="btn btn-secondary secondary-btn"
                                                                                >
                                                                                    Cancelar
                                                                                    </button>
                                                                                <button
                                                                                    type="submit"
                                                                                    className="btn btn-primary primary-btn"
                                                                                >
                                                                                    Agregar
                                                                                    </button>

                                                                            </div>
                                                                        </div>
                                                                    </div>

                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>

                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                </div>
                                <div className="row">
                                    <div className="col-md-12">
                                        <div className="widget-wrap">
                                            <div className="widget-container margin-top-0">
                                                <div className="widget-content">
                                                    {/*Inicio de ejemplo*/}
                                                    <div className="widget-container">
                                                        <div className="widget-content">
                                                            <div className="row">


                                                                <div className="col-md-4 unit">

                                                                    <div className="inline-group">
                                                                        <label className="label">
                                                                            Trazado de la ruta
                                                  </label>
                                                                        <label className="checkbox">
                                                                            <input
                                                                                native="true"
                                                                                name="activo"
                                                                                type="checkbox"
                                                                                onChange={(e) => handleTypeRoute(1, e.target.checked)}
                                                                                checked={state.isManual}
                                                                            />
                                                                            <i />
                                                    Trazo libre
                                                  </label>
                                                                        <label className="checkbox">
                                                                            <input
                                                                                native="true"
                                                                                name="activo"
                                                                                type="checkbox"
                                                                                onChange={(e) => handleTypeRoute(2, e.target.checked)}
                                                                                checked={state.isTour}
                                                                            />
                                                                            <i />
                                                    Modo recorrido
                                                  </label>

                                                                    </div>



                                                                </div>
                                                                <div className="col-md-8 unit">


                                                                </div>
                                                            </div>



                                                        </div>
                                                    </div>
                                                    <div className="row">
                                                        <div className="col-md-4 col-sm-12" >
                                                            Navegación
                                                        <NavigationList indications={state.route ? state.route.events : []} />
                                                        </div>
                                                        <div className="col-md-8 col-sm-12">
                                                            {
                                                                state.showMap &&
                                                                <DisplayMapClass markers={state.points} isManual={state.isManual} setNewPoint={setPoint} route={state.route} polygon={state.polygon} setMap={setMap} />
                                                            }

                                                        </div>

                                                    </div>



                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
}

export default Rutas;
