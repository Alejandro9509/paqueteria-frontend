import React, { useEffect, useState, setData, useMemo, Component } from "react";
import logo from "../logo.svg";
import axios from "axios";
import { Dialog, DialogActions, DialogContent, FormControl, IconButton, Input, InputAdornment, InputLabel, Select, Tooltip } from "@material-ui/core";

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
import { DataGrid } from '@material-ui/data-grid';
import Noty from 'noty';
import { point } from "leaflet";
import NavigationList from "../Components/Map/ListNavigation";
import { SettingsEthernet } from "@material-ui/icons";
import { useHistory } from "react-router";
import { Button } from "bootstrap";
import { dataGridLocaleText } from "../Constants";
import { obtenerClasificacionViaje } from "../Util/Contexts/ClasificacionViajeContext";
import { agregarRutas, eliminarRutas, modificarRutas, obtenerRutas, obtenerRutasId, obtenerRutasOrigenes, calcularCosto } from "../Util/Contexts/RutasContext";
import { obtenerTipoUnidades } from "../Util/Contexts/TipoUnidadContext";
import { obtenerTipoViaje } from "../Util/Contexts/TipoViajeContext";
import { validarPermisos } from "../Util/Contexts/UsuarioContext";

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


function Rutas(props) {

    const classes = useStyles();
    const history = useHistory()
    const [data, setData] = React.useState([]);
    const [tiposViaje, setTiposViaje] = React.useState([])
    const [destinos, setDestinos] = React.useState([])
    const [ciudades, setCiudades] = React.useState([])
    const [calificaciones, setCalificaciones] = React.useState([])
    const [dataTipoUnidad, setDataTipoUnidad] = React.useState([]);
    const [state, setState] = React.useState({
        agregar: "Agregar",
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
        clasificacion: 0,
        tipoModal: 0,
        tipoUnidad: null,
        tipoViaje: null,
        trayecto: null,
        DerechoBorrar: 117,
        // trayecto: "PERMANENTE",
        activa: false,
        CreadoPor: localStorage.getItem("UsuarioId"),
    })
    const [map, setMap] = useState(null)


    function getAllData() {
        obtenerRutas().then((respuesta) => {
            console.log(respuesta.data);
            setData(respuesta.data);

        });
    }

    function getDestinos() {
        obtenerRutasOrigenes().then((respuesta) => {
            setDestinos(respuesta.data.filter(d => d.m_bPermanente));

        });
    }

    function routed(route, exc) {

        var polygon = []
        calcularCosto(state.points).then(data => console.log(data))
        if (route) {
            console.log(route)
            route.polyline.plain.polyline.map(c => {
                polygon.push([c.y, c.x])
            })
            setState({
                ...state,
                route: route,
                polygon: polygon,
                description: (state.origin + " - " + state.destiny),
                kilometros: (route.distance / 1000).toFixed(2),
                millas: (route.distance / 1609).toFixed(2),
                horas: (route.travelTime / 60 / 60).toFixed(0)
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
        getDestinos()
    }, [])


    useEffect(value => {
        if (map) {
            setTimeout(function () {
                map.invalidateSize(true);

            }, 500);

        }
    }, [map])

    function handleEliminar(id) {
        var derecho;
        validarPermisos(state).then(respuesta => {
            //showSuccess(respuesta.data)

            derecho = respuesta.data;
            if (derecho == false) {
                showSuccess("El usuario no tiene derechos para realizar el proceso");
                return;
            }
            eliminarRutas(id, state.CreadoPor).then(respuesta => {
                showSuccess(respuesta.data)
                getAllData()
            }).catch(err => {
                showSuccess(err)
            });
        }).catch(err => {
            showSuccess(err)
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
                            <a href="#Agregar" role="tab" data-toggle="tab" onClick={() => (handleShowModificar(row.row.m_nIdRuta))} className="btn btn-default btn-xs"><i className="fa fa-pencil-square-o" style={{ color: "#F9A03E" }} /></a>

                        </Tooltip>
                        <Tooltip title="Consultar">
                            <a href="#Agregar" role="tab" data-toggle="tab" className="btn btn-default btn-xs" onClick={() => (handleShowConsultar(row.row.m_nIdRuta))}><i className="fa fa-eye" style={{ color: "#F9A03E" }} /></a>

                        </Tooltip>
                        <Tooltip title="Eliminar">
                            <a href="#" className="btn btn-default btn-xs" onClick={() => (handleEliminar(row.row.m_nIdRuta))}><i className="zmdi zmdi-delete" style={{ color: "#F30B0B" }} /></a>

                        </Tooltip>
                    </div>
                )
            }
        },
        {
            headerName: "Folio",
            field: "m_nIdFolio",
            width: 150,

        },
        {
            headerName: "Descripción",
            field: "m_sDescripcion",
            width: 200,
        },
        {
            headerName: "Origen",
            field: "m_sOrigen",
            width: 150,
        },
        {
            headerName: "Destino",
            field: "m_sDestino",
            width: 150,
        },
        {
            headerName: "Activa",
            field: "m_bActiva",
            width: 100,
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
        obtenerTipoUnidades().then((respuesta) => {
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
            "m_sDescripcion": state.description,
            "m_nIdTipoViaje": state.tipoViaje,
            "m_nIdClasificacionViaje": state.clasificacion,
            "m_nIdTipoUnidad": state.tipoUnidad,
            "m_bTipoTrayecto": state.trayecto === "PERMANENTE" ? 1 : 0,
            "m_rHoras": state.horas,
            "m_rETA": state.eta,
            "m_rKM": state.kilometros,
            "m_rMillas": state.millas,
            "m_bActiva": state.activa,
            "m_nCreadoPor": state.CreadoPor,
            "m_bPermanente": state.trayecto === "PERMANENTE" ? 1 : 0,
            "m_bTrazoLibre": state.isManual,
            "m_xnOrigenLatitud": state.points[0].location[0],
            "m_xnOrigenLongitud": state.points[0].location[1],
            "m_xnDestinoLatitud": state.points[state.points.length - 1].location[0],
            "m_xnDestinoLongitud": state.points[state.points.length - 1].location[1],
            "m_arrClsTrazoLibre": state.points,

        }
        console.log(JSON.stringify(params))
        if (state.idRuta != 0) {
            modificarRutas(state.idRuta, params)
                .then((respuesta) => {
                    showSuccess(respuesta.data);
                    getAllData();
                    $('.nav-tabs li ').removeClass('active');
                    $('.nav-tabs li').eq(0).addClass('active');
                    $('.tab-content div ').removeClass('in show');
                    $('#Listado').addClass('in show');
                })
                .catch((err) => {
                    console.log(err);
                    showSuccess("err");
                });
        } else {
            agregarRutas(params)
                .then((respuesta) => {
                    console.log(respuesta.data);
                    showSuccess(respuesta.data);
                    getAllData();
                    $('.nav-tabs li ').removeClass('active');
                    $('.nav-tabs li').eq(0).addClass('active');
                    $('.tab-content div ').removeClass('in show');
                    $('#Listado').addClass('in show');
                })
                .catch((err) => {
                    console.log(JSON.stringify(err));
                    showSuccess(err);
                });
        }
    };

    function getTiposViajeData() {
        obtenerTipoViaje().then(respuesta => {
            console.log(respuesta.data)
            setTiposViaje(respuesta.data)
        });
    };

    function getCalificacionesData() {
        obtenerClasificacionViaje().then(respuesta => {
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

    function showAgregar(event) {
        event.stopPropagation();
        setState({
            ...state,
            openDialog: false,
            agregar: "Agregar",
            idRuta: 0,
            height: window.innerHeight,
            points: [],
            showMap: true,
            folio: "",
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
            trayecto: "PERMANENTE",
            activa: false,
            CreadoPor: localStorage.getItem("UsuarioId"),
        })
        $('.nav-tabs li ').removeClass('active'); $('.nav-tabs li').eq(1).addClass('active'); $('.tab-content div ').removeClass('in show'); $('#Agregar').addClass('in show');
    }

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
                "encodedPath": true,
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
        obtenerRutasId(id).then(respuesta => {
            setState({
                ...state,
                agregar: "Consultar",
                idRuta: id,
                height: window.innerHeight,
                showMap: true,
                folio: respuesta.data.m_nIdFolio,
                description: respuesta.data.m_sDescripcion,
                polygon: [],
                origin: respuesta.data.m_sOrigen,
                destiny: respuesta.data.m_sDestino,
                originLocation: { location: { referenceCoordinate: { x: respuesta.data.m_xnOrigenLongitud, y: respuesta.data.m_xnOrigenLatitud } } },
                destinyLocation: { location: { referenceCoordinate: { x: respuesta.data.m_xnDestinoLongitud, y: respuesta.data.m_xnDestinoLatitud } } },
                points: [{ key: 0, label: "", location: [respuesta.data.m_xnOrigenLatitud, respuesta.data.m_xnOrigenLongitud] }, { key: 1, label: "", location: [respuesta.data.m_xnDestinoLatitud, respuesta.data.m_xnDestinoLongitud] }],
                isManual: respuesta.data.m_bTrazoLibre,
                isTour: respuesta.data.m_bTrazoLibre,
                tipoUnidad: respuesta.data.m_nIdTipoUnidad,
                tipoViaje: respuesta.data.m_nIdTipoViaje,
                trayecto: respuesta.data.m_bTipoTrayecto === 1 ? "PERMANENTE" : "EVENTUAL",
                activo: respuesta.data.m_bActiva,
                eta: respuesta.data.m_rETA,
                horas: respuesta.data.m_rHoras,
                kilometros: respuesta.data.m_rKM,
                millas: respuesta.data.m_rMillas,
                CreadoPor: localStorage.getItem("UsuarioId"),

            })
            $('.nav-tabs li ').removeClass('active');
            $('.nav-tabs li').eq(1).addClass('active');
            $('.tab-content div ').removeClass('in show');
            $('#Agregar').addClass('in show');
        });
    }

    function handleShowModificar(id) {
        obtenerRutasId(id).then(respuesta => {
            setState({
                ...state,
                agregar: "Modificar",
                idRuta: id,
                height: window.innerHeight,
                showMap: true,
                folio: respuesta.data.m_nIdFolio,
                description: respuesta.data.m_sDescripcion,
                polygon: [],
                origin: respuesta.data.m_sOrigen,
                destiny: respuesta.data.m_sDestino,
                originLocation: { location: { referenceCoordinate: { x: respuesta.data.m_xnOrigenLongitud, y: respuesta.data.m_xnOrigenLatitud } } },
                destinyLocation: { location: { referenceCoordinate: { x: respuesta.data.m_xnDestinoLongitud, y: respuesta.data.m_xnDestinoLatitud } } },
                points: [{ key: 0, label: "", location: [respuesta.data.m_xnOrigenLatitud, respuesta.data.m_xnOrigenLongitud] }, { key: 1, label: "", location: [respuesta.data.m_xnDestinoLatitud, respuesta.data.m_xnDestinoLongitud] }],
                isManual: respuesta.data.m_bTrazoLibre,
                isTour: respuesta.data.m_bTrazoLibre,
                tipoUnidad: respuesta.data.m_nIdTipoUnidad,
                tipoViaje: respuesta.data.m_nIdTipoViaje,
                trayecto: respuesta.data.m_bTipoTrayecto === 1 ? "PERMANENTE" : "EVENTUAL",
                activo: respuesta.data.m_bActiva,
                eta: respuesta.data.m_rETA,
                horas: respuesta.data.m_rHoras,
                kilometros: respuesta.data.m_rKM,
                millas: respuesta.data.m_rMillas,
                CreadoPor: localStorage.getItem("UsuarioId"),

            })
            $('.nav-tabs li ').removeClass('active');
            $('.nav-tabs li').eq(1).addClass('active');
            $('.tab-content div ').removeClass('in show');
            $('#Agregar').addClass('in show');
        });

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

    const handleChangeDestino = (value, index) => {
        var points = state.points
        points[1] = { key: 0, label: destinos[index].m_sDescipcion, location: [destinos[index].m_xLatitud, destinos[index].m_xLongitud] }
        setState({
            ...state,
            destiny: value,
            points: points,
            destinyLocation: { location: { referenceCoordinate: { x: destinos[index].m_xLongitud, y: destinos[index].m_xLatitud } } }
        });
        map.flyTo(points[1].location, 15)
    };
    const handleChangeOrigen = (value, index) => {
        var points = state.points
        points[0] = { key: 0, label: destinos[index].m_sDescipcion, location: [destinos[index].m_xLatitud, destinos[index].m_xLongitud] }
        setState({
            ...state,
            origin: value,
            points: points,
            originLocation: { location: { referenceCoordinate: { x: destinos[index].m_xLongitud, y: destinos[index].m_xLatitud } } }
        });
        map.flyTo(points[0].location, 15)
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
                console.log(response.results[0])
                var points = state.points
                if (originFlag) {
                    points[0] = { key: 0, label: response.results[0].location.formattedAddress, location: [response.results[0].location.referenceCoordinate.y, response.results[0].location.referenceCoordinate.x] }
                    setState({ ...state, originLocation: response.results[0], points: points })
                    map.flyTo(points[0].location, 15)
                } else {
                    points[1] = { key: points.length - 1, label: response.results[0].location.formattedAddress, location: [response.results[0].location.referenceCoordinate.y, response.results[0].location.referenceCoordinate.x] }
                    setState({ ...state, destinyLocation: response.results[0], points: points })
                    map.flyTo(points[points.length - 1].location, 15)
                }
            }
        } else {
            console.log(exception)
            showSuccess("No se encontraron coincidencias")
        }
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
        <div >

            <header className="topbar clearfix">
                <Cabecera titulo="Rutas" >
                    <div className="page-header">
                        <ul className="list-page-breadcrumb">
                            <li>
                                <a href="/Catalogos" className="color-mapeo">
                                    Catálogos <i className="zmdi zmdi-chevron-right" />
                                </a>
                            </li>
                            <li className="active-page">Rutas</li>
                        </ul>
                    </div>
                </Cabecera>
            </header>

            {/*Leftbar Start Here*/}
            <aside className="iconic-leftbar">
                <BarraLateralIzquierda />
            </aside>
            {/*Leftbar End Here*/}

            <section className="main-container">



                <div className="container-fluid">

                    <ul className="nav navStatica nav-tabs">
                        <li className="active">
                            <a data-toggle="tab" data_id="1" href="#Listado" onClick={(event) => { event.stopPropagation(); setState({ showMap: false, agregar: "Agregar" }); $('.nav-tabs li ').removeClass('active'); $('.nav-tabs li').eq(0).addClass('active'); $('.tab-content div ').removeClass('in show'); $('#Listado').addClass('in show'); }}>
                                Listado
            </a>
                        </li>
                        <li>
                            <a data-toggle="tab" href="#Agregar" onClick={(e) => showAgregar(e)}>
                                {state.agregar}
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
                            className="tab-pane fade in show"
                        >
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
                                                getRowId={(row) => row.m_nIdRuta}
                                                onRowSelected={(row) => {
                                                    setState({
                                                        ...state,
                                                        idRuta: row.data.m_nIdRuta
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
                                                                            <div className="input">
                                                                                <TextField variant="outlined" margin="dense" label="Folio"
                                                                                    type="text"
                                                                                    pattern="[0-9]*"
                                                                                    required
                                                                                    disabled={state.agregar === "Consultar"}
                                                                                    className="form-control"
                                                                                    name="folio"
                                                                                    value={state.folio}
                                                                                    onChange={handleChange}
                                                                                    maxLength="4"
                                                                                />
                                                                            </div>
                                                                        </div>
                                                                        <div className="col-md-4 unit">
                                                                            <div className="input">
                                                                                <Autocomplete
                                                                                    className="form-control"
                                                                                    freeSolo
                                                                                    onChange={(event, value) => handleChangeOrigen(value, parseInt(value.slice(0, value.indexOf(" "))))}
                                                                                    value={state.origin}
                                                                                    id="origin"
                                                                                    disabled={state.agregar === "Consultar"}
                                                                                    name="origin"
                                                                                    onInputChange={(event, value) => setState({ ...state, origin: value })}
                                                                                    disableClearable
                                                                                    options={destinos.map((d, index) => `${index} ${d.m_sDescipcion}`)}
                                                                                    style={{
                                                                                        transform: "translate(14px, 10px) scale(1) !important"
                                                                                    }}
                                                                                    renderInput={(params) => (
                                                                                        <TextField
                                                                                            {...params}
                                                                                            variant="outlined"
                                                                                            label="Origen"
                                                                                            margin="dense"
                                                                                            InputProps={{
                                                                                                ...params.InputProps,
                                                                                                type: "search",
                                                                                                name: "origin",
                                                                                                endAdornment: (
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
                                                                                                )
                                                                                            }}

                                                                                        />
                                                                                    )}
                                                                                />

                                                                            </div>
                                                                        </div>
                                                                        <div className="col-md-4 unit">
                                                                            <div className="input">
                                                                                <Autocomplete
                                                                                    className="form-control"
                                                                                    freeSolo
                                                                                    onChange={(event, value) => handleChangeDestino(value, parseInt(value.slice(0, value.indexOf(" "))))}
                                                                                    value={state.destiny}
                                                                                    id="destiny"
                                                                                    disabled={state.agregar === "Consultar"}
                                                                                    name="destiny"
                                                                                    onInputChange={(event, value) => setState({ ...state, destiny: value })}
                                                                                    disableClearable
                                                                                    options={destinos.map((d, index) => `${index} ${d.m_sDescipcion}`)}
                                                                                    style={{
                                                                                        transform: "translate(14px, 10px) scale(1) !important"
                                                                                    }}
                                                                                    renderInput={(params) => (
                                                                                        <TextField
                                                                                            variant="outlined"
                                                                                            label="Destino"
                                                                                            margin="dense"
                                                                                            {...params}
                                                                                            InputProps={{
                                                                                                ...params.InputProps,
                                                                                                type: "search",
                                                                                                name: "origin",
                                                                                                endAdornment: (
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
                                                                                                )
                                                                                            }}

                                                                                        />
                                                                                    )}
                                                                                />

                                                                            </div>
                                                                        </div>
                                                                        <div className="col-md-2 unit">
                                                                            <div className="input">
                                                                                <TextField variant="outlined" margin="dense" label="Descripción"
                                                                                    className="form-control"
                                                                                    type="text"
                                                                                    required
                                                                                    disabled={state.agregar === "Consultar"}
                                                                                    InputLabelProps={{
                                                                                        shrink: true,
                                                                                    }}
                                                                                    value={state.description}
                                                                                    name={"description"}
                                                                                    onChange={handleChange}
                                                                                    id="description"
                                                                                />
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                    <div className="row">
                                                                        <div className="col-md-2 unit">

                                                                        </div>
                                                                        <div className="col-md-4 unit">

                                                                            <label className="input select">
                                                                                <FormControl fullWidth variant="outlined"
                                                                                    margin="dense"
                                                                                             disabled={state.agregar === "Consultar"}
                                                                                >
                                                                                    <InputLabel
                                                                                        id="tipoViajeLabel">Tipo de viaje</InputLabel>
                                                                                    <Select
                                                                                        labelId="tipoViajeLabel"
                                                                                        label="Tipo de viaje"
                                                                                        className="form-control"
                                                                                        required
                                                                                        value={state.tipoViaje}
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
                                                                                    </Select>
                                                                                </FormControl>
                                                                            </label>
                                                                        </div>
                                                                        <div className="col-md-4 unit">
                                                                            <label className="input select">
                                                                                <FormControl fullWidth variant="outlined"
                                                                                    margin="dense"
                                                                                             disabled={state.agregar === "Consultar"}
                                                                                >
                                                                                    <InputLabel
                                                                                        id="clasificacionLabel">Clasificación de viaje</InputLabel>
                                                                                    <Select
                                                                                        labelId="clasificacionLabel"
                                                                                        label="Clasificación de viaje"
                                                                                        className="form-control"
                                                                                        required="true"
                                                                                        value={state.clasificacion}
                                                                                        onChange={handleChange}
                                                                                        name="clasificacion"
                                                                                    >
                                                                                        <option value="0">Seleccionar</option>
                                                                                        {calificaciones.map((tipoViaje) => (
                                                                                            <option
                                                                                                key={tipoViaje.m_nIdClasificacionViaje}
                                                                                                value={tipoViaje.m_nIdClasificacionViaje}
                                                                                            >
                                                                                                {tipoViaje.m_sTipoViaje}
                                                                                            </option>
                                                                                        ))}
                                                                                    </Select>
                                                                                </FormControl>
                                                                            </label>
                                                                        </div>
                                                                        <div className="col-md-2 unit">
                                                                            <label className="input select">
                                                                                <FormControl fullWidth variant="outlined"
                                                                                    margin="dense"
                                                                                             disabled={state.agregar === "Consultar"}
                                                                                >
                                                                                    <InputLabel
                                                                                        id="tipoUnidadLabel">Tipo de Unidad</InputLabel>
                                                                                    <Select
                                                                                        labelId="tipoUnidadLabel"
                                                                                        label="Tipo de Unidad"
                                                                                        className="form-control"
                                                                                        required
                                                                                        value={state.tipoUnidad}
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
                                                                                    </Select>
                                                                                </FormControl>
                                                                            </label>
                                                                        </div>
                                                                    </div>
                                                                    <div className="row justify-content-md-center" style={{ display: "flex", alignItems: "center" }}>

                                                                        <div className="col-md-4" >
                                                                            <div className="inline-group" style={{ display: "flex", alignItems: "center" }}>
                                                                                <label className="label" style={{ paddingRight: "10px" }} >
                                                                                    Tipo Trayecto:
                                                  </label>
                                                                                <label className="radio">
                                                                                    <input
                                                                                        type="radio"
                                                                                        value="1"
                                                                                        name="trayecto"
                                                                                        disabled={state.agregar === "Consultar"}
                                                                                        //value="PERMANETE"
                                                                                        onChange={handleChange}
                                                                                        defaultChecked
                                                                                    // checked={state.trayecto === 1}

                                                                                    />
                                                                                    <i />
                                                    Permanente
                                                  </label>
                                                                                <label className="radio">
                                                                                    <input
                                                                                        // value="EVENTUAL"
                                                                                        value="0"
                                                                                        type="radio"
                                                                                        onChange={handleChange}
                                                                                        name="trayecto"
                                                                                        disabled={state.agregar === "Consultar"}
                                                                                        //checked={state.trayecto === "EVENTUAL"}
                                                                                    //checked={state.trayecto === 0}
                                                                                    />
                                                                                    <i />
                                                    Eventual
                                                  </label>

                                                                            </div>
                                                                        </div>
                                                                        <div className="col-md-1 ">
                                                                            <div className="input">
                                                                                <TextField variant="outlined" margin="dense" label="Horas"
                                                                                    className="form-control"
                                                                                    type="number"
                                                                                    onChange={handleChange}
                                                                                    value={state.horas}
                                                                                    disabled={state.agregar === "Consultar"}
                                                                                    InputLabelProps={{
                                                                                    shrink: true,
                                                                                    }}
                                                                                    name="horas"
                                                                                />
                                                                            </div>
                                                                        </div>
                                                                        <div className="col-md-1 ">
                                                                            <div className="input">
                                                                                <TextField variant="outlined" margin="dense" label="ETA"
                                                                                    className="form-control"
                                                                                    type="text"
                                                                                    disabled={state.agregar === "Consultar"}
                                                                                    onChange={handleChange}
                                                                                    value={state.eta}
                                                                                    name="eta"
                                                                                />
                                                                            </div>
                                                                        </div>
                                                                        <div className="col-md-1 ">
                                                                            <div className="input">
                                                                                <TextField variant="outlined" margin="dense" label="Kilometros"
                                                                                    className="form-control"
                                                                                    type="number"
                                                                                    disabled={state.agregar === "Consultar"}
                                                                                    onChange={handleChange}
                                                                                    value={state.kilometros}
                                                                                    InputLabelProps={{
                                                                                        shrink: true,
                                                                                    }}
                                                                                    name="kilometros"
                                                                                />
                                                                            </div>
                                                                        </div>
                                                                        <div className="col-md-1">
                                                                            <div className="input">
                                                                                <TextField variant="outlined" margin="dense" label="Millas"
                                                                                    className="form-control"
                                                                                    type="number"
                                                                                    onChange={handleChange}
                                                                                    value={state.millas}
                                                                                    disabled={state.agregar === "Consultar"}
                                                                                    InputLabelProps={{
                                                                                        shrink: true,
                                                                                    }}
                                                                                    name="millas"
                                                                                />
                                                                            </div>
                                                                        </div>
                                                                        <div className="col-md-1">

                                                                            <div className="inline-group" style={{ display: "flex", alignItems: "center" }}>
                                                                                <label className="label" style={{ paddingRight: "10px", marginBottom: "0px" }} >
                                                                                    Estatus
                                                                                        </label>
                                                                                <label className="checkbox" >
                                                                                    <input
                                                                                        required
                                                                                        disabled={state.agregar === "Consultar"}
                                                                                        checked={state.activa}
                                                                                        name="activa"
                                                                                        onChange={(e) => setState({ ...state, activa: e.target.checked })}
                                                                                        type="checkbox"
                                                                                    />
                                                                                    <i />
                                                                                        Activa
                                                                                         </label>
                                                                            </div>




                                                                        </div>
                                                                        <div className="col-md-3">
                                                                            <div align="right">

                                                                                <button
                                                                                    onClick={(event) => { event.stopPropagation(); setState({ showMap: false, agregar: "Agregar" }); $('.nav-tabs li ').removeClass('active'); $('.nav-tabs li').eq(0).addClass('active'); $('.tab-content div ').removeClass('in show'); $('#Listado').addClass('in show'); }}
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
                                                    <div className="widget-content">
                                                        <div className="row">


                                                            <div className="col-md-4">

                                                                <div className="inline-group">
                                                                    <label className="label">
                                                                        Trazado de la ruta
                                                  </label>
                                                                    <label className="checkbox">
                                                                        <input
                                                                            native="true"
                                                                            name="activo"
                                                                            type="checkbox"
                                                                            disabled={state.agregar === "Consultar"}
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
                                                                            disabled={state.agregar === "Consultar"}
                                                                            onChange={(e) => handleTypeRoute(2, e.target.checked)}
                                                                            checked={state.isTour}
                                                                        />
                                                                        <i />
                                                    Modo recorrido
                                                  </label>

                                                                </div>
                                                                <label className="label">
                                                                    Navegación
                                                  </label>

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
