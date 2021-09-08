import React, {useEffect, useState, setData, useMemo, Component} from "react";
import {cubicarGuias, remove_array_element} from "../Util/Util";
import {
    ButtonBase,
    Checkbox,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    FormControl,
    Grid,
    IconButton,
    Input,
    InputLabel,
    List,
    ListItem,
    ListItemIcon,
    ListItemSecondaryAction,
    ListItemText,
    Select,
    Step,
    StepLabel,
    Stepper,
} from "@material-ui/core";


import DataTable from "react-data-table-component";
import $ from "jquery";
import {useTable, useFilters, useSortBy} from "react-table";
import TextField from "@material-ui/core/TextField";
import Autocomplete from "@material-ui/lab/Autocomplete";
import InputAdornment from "@material-ui/core/InputAdornment";
import PageviewIcon from "@material-ui/icons/Pageview";
import useModal from "react-hooks-use-modal";
import axios from "axios";
import Cabecera from "../Components/Template/Cabecera";
import BarraLateralIzquierda from "../Components/Template/BarraLateralIzquierda";
import BarraLateralDerecha from "../Components/Template/BarraLateralDerecha";
import ExportCSV from "../Components/Template/Export";
import ExportPDF from "../Components/Template/ExportPDF";
import Carousel from "re-carousel";
import IndicatorDots from "../Util/Dots";
import Buttons from "../Util/CarruselButtons";
import {makeStyles} from "@material-ui/core/styles";
import * as XLSX from "xlsx";
import {render} from "react-dom";
import SearchIcon from "@material-ui/icons/Search";
import {DataGrid} from "@material-ui/data-grid";
import Noty from "noty";
import {API_BASE_URL, dataGridLocaleText} from "../Constants";
import {obtenerCiudades} from "../Util/Contexts/CiudadesContext";
import {obtenerEstatusInforme} from "../Util/Contexts/EstatusContext";
import {obtenerGuia, obtenerGuiaPendientes, obtenerGuiasFiltro} from "../Util/Contexts/GuiaContext";
import {obtenerOperadores} from "../Util/Contexts/OperadoresContext";
import {obtenerUnidades, obtenerUnidadesTipo} from "../Util/Contexts/UnidadesContext";
import {obtenerRutas} from "../Util/Contexts/RutasContext";
import {
    agregarInformes,
    cancelarInformes,
    eliminarInformes,
    modificarInformes, obtenerInformeFiltro,
    obtenerInformes,
    obtenerInformesId
} from "../Util/Contexts/InformesContext";
import {obtenerSucursales} from "../Util/Contexts/SucursalContext";
import {validarPermisos} from "../Util/Contexts/UsuarioContext";
import {imprimirFormatosId, obtenerFormatosImpresion} from "../Util/Contexts/FormatosImpresionContext";

function showSuccess(mensaje) {
    new Noty({
        type: "information",
        layout: "topCenter",
        text: mensaje,
        timeout: "3000",
    }).show();
}


const styles = {
    seleccionado: {
        backgroundColor: "#FCC88F",
    },
    noSeleccionado: {
        backgroundColor: "#FFFFFF",
    },
    disabled: {
        pointerEvents: "none",
        cursor: "default",
    },
};
const useStyles = makeStyles(styles);

window.jQuery = window.$ = $;
const headers = {
    "Content-Type": "application/json",
};
let timer;

function Informes({history}) {
    const classes = useStyles();
    const [stepActive, setStepActive] = React.useState(1);
    const [data, setData] = React.useState([]);
    const [dataRutas, setDataRutas] = React.useState([]);
    const [guias, setGuias] = React.useState([]);
    const [informes, setInformes] = React.useState([]);
    const [dataSucursal, setDataSucursal] = React.useState([]);
    const [dataEstatusInformes, setEstatusInformes] = React.useState([]);
    const [dataOperadores, setDataOperadores] = React.useState([]);
    const [dataOrigenes, setDataOrigenes] = React.useState([]);
    const [dataUnidades, setDataUnidades] = React.useState([]);
    const [dataFormatos, setFormatosImpresion] = React.useState([]);
    const [dataGuias, setDataGuias] = React.useState([]);
    const [dataViajes, setDataViajes] = React.useState([]);

    function getAllDataRutas() {
        obtenerRutas().then((respuesta) => {
            setDataRutas(respuesta.data);
        });
    }

    const handleChange = (event) => {
        setState({
            ...state,
            [event.target.id]: event.target.value,
        });
    };

    function handleSelectCP(id, dobleClick, e) {
        clearTimeout(timer);
        if (e.detail === 1) {
            timer = setTimeout(() => {
                setState({
                    ...state,
                    [state.identificadorModal]: id,
                    openDialog: true,
                });
            }, 200);
        } else if (e.detail === 2) {
            setState({
                ...state,
                [state.identificadorModal]: id,
                openDialog: false,
            });
        }
    }

    const columns = React.useMemo(() => [
        {
            headerName: "Acciones",
            sortable: false, filterable: false,
            field: "",
            renderCell: (row) => {
                return (
                    <div>
                        <a
                            onClick={() => handleShowModificar(row.row.m_nIdInforme)}
                            className="btn btn-default btn-xs"
                        >
                            <i
                                className="fa fa-pencil-square-o"
                                style={{color: "#F9A03E"}}
                            />
                        </a>
                        <a
                            className="btn btn-default btn-xs"
                            onClick={() => handleShowConsultar(row.row.m_nIdInforme)}
                        >
                            <i className="fa fa-eye" style={{color: "#F9A03E"}}/>
                        </a>
                        <a
                            href="#"
                            className="btn btn-default btn-xs"
                            onClick={() => handleEliminar(row.row.m_nIdInforme)}
                        >
                            <i className="zmdi zmdi-delete" style={{color: "#F30B0B"}}/>
                        </a>
                    </div>
                );
            },
        },
        {
            headerName: "Folio/Serie",
            field: "m_sFolioInforme",
            width: 125,
        },
        {
            headerName: "Fecha/Hora Elaboración",
            field: "m_sFechayHora",
            width: 200,
        },
        {
            headerName: "Viaje",
            field: "m_sFolioViaje",
            width: 125,
        },
        {
            headerName: "Oficina Emisora",
            field: "m_sSucursalEmisora",
            width: 150,
        },
        {
            headerName: "Oficina Receptora",
            field: "m_sSucursalReceptora",
            width: 150,
        },
        {
            headerName: "Operador",
            field: "m_sNombreCompleto",
            width: 250,
        },
        {
            headerName: "Tipo de Unidad",
            field: "m_sTipoUnidadIdentificador",
            width: 125,
        },
        {
            headerName: "Remolque",
            field: "m_sRemolque1",
            width: 125,
        },
        {
            headerName: "Origen",
            field: "m_sCiudadOrigen",
            width: 125,
        },
        {
            headerName: "Destino",
            field: "m_sCiudadDestino",
            width: 125,
        },
        {
            headerName: "Ruta",
            field: "m_sRuta",
            width: 150,
        },
        {
            headerName: "Cancelado",
            field: "m_dtFechaCancelacion",
            width: 150,
        },
    ]);

    function getAllGuias() {
        obtenerGuia().then((respuesta) => {
            setGuias(respuesta.data);
        });
    }

    function handleSelectViaje(event) {
        event.preventDefault()
        state.ruta2 = state.viaje.m_sRuta;
        state.operador2 = state.viaje.m_sNombreCompletoOperador;
        state.unidad2 = state.viaje.m_sTipoUnidad;
        state.remolque2 = state.viaje.m_sDescripcionUnidad;
    }

    function handleSelectDatos(id, cp) {
        setState({
            ...state,
            [state.identificadorModal]: id,
        });
    }


    const columnsCiudades = React.useMemo(() => [
        {
            Name: "Codigo",
            accessor: "m_nCodigo",
        },
        {
            Name: "Ciudad",
            accessor: "m_sCiudad",
        },
        {
            Name: "Abreviacion",
            accessor: "m_sAbreviacion",
        },
        {
            Name: "Estado",
            accessor: "m_nIdEstado",
        },
    ]);

    const columnsOperadores = React.useMemo(() => [
        {
            Name: "Numero Operador",
            accessor: "m_nNumeroOperador",
        },
        {
            Name: "Nombre",
            accessor: "m_sNombreCompleto",
        },
        {
            Name: "Sucursal",
            accessor: "m_nIdSucursal",
        },
        {
            Name: "Activo",
            accessor: "m_nIdEstado",
        },
    ]);


    const columnsUnidades = React.useMemo(() => [
        {
            Name: "Descripcion",
            accessor: "m_sDescripcion",
        },
        {
            Name: "Codigo",
            accessor: "m_sCodigo",
        },
        {
            Name: "Tipo de unidad",
            accessor: "m_nIdTipoUnidad",
        },
        {
            Name: "Estatus",
            accessor: "m_bActivo",
        },
    ]);

    function DefaultColumnFilter({
                                     column: {filterValue, preFilteredRows, setFilter},
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


    const [state, setState] = React.useState({
        showPopUp: false,
        identificadorModal: "",
        openDialog: false,
        viaje: {},
        agregar: "Agregar",
        height: window.innerHeight,

        ruta2: "",
        operador2: "",
        unidad2: "",
        remolque2: "",

        tipoModal: 0,
        IdInforme: 0,
        FolioInforme: 0,
        fechaHora: `${new Date().getFullYear()}-${`${new Date().getMonth() + 1}`.padStart(2, 0)}-${`${new Date().getDate() + 1}`.padStart(2, 0)}T${`${new Date().getHours()}`.padStart(2, 0)}:${`${new Date().getMinutes()}`.padStart(2, 0)}`,
        DerechoBorrar: 151,
        EstatusInforme: 5,
        IdViaje: {},
        sucursalEmisora: 0,
        sucursalReceptora: 0,
        IdOperador: null,
        IdRemolque1: null,
        IdRemolque2: null,
        PlacasRemolque1: "",
        PlacasRemolque2: "",
        PlacasDolly: "",
        IdTipoUnidad: {},
        IdCiudadDestino: null,
        IdCiudadOrigen: null,
        IdRuta: 0,
        IdSucursal: localStorage.getItem("Sucursal"),
        CreadoPor: localStorage.getItem("UsuarioId"),
        ModificadoPor: localStorage.getItem("UsuarioId"),
        usuarioCancelacion: "",
        estatusCancelacion: "",
        Guias: [
            {
                m_nIdGuia: 0,
                m_nFolioGuia: "",
                m_sEstatusGuia: "",
                m_cValorDeclarado: "",
                m_sCiudadDestinatario: "",
                tipoServicio: "",
                observaciones: "",
            },
        ],
        FechaCancelacion: "",
        motivoCancelacion: "",
        sucursalCancelacion: {},
        sePuedeCancelar: false,
        Informes: [],
        indexCubicar: 0,
        folioInformeListado: ''
    });

    const handleAceptar = (e) => {
        e.preventDefault();

        var params = {
            m_nIdInforme: state.IdInforme,
            m_nFolioInforme: state.FolioInforme,
            m_dFecha: state.fechaHora.split("T")[0],
            m_tHora: state.fechaHora.split("T")[1],
            m_nIdCiudadDestino: state.IdCiudadDestino.m_nIdCiudad,
            m_nIdCiudadOrigen: state.IdCiudadOrigen.m_nIdCiudad,
            m_nIdEstatusInforme: state.EstatusInforme,
            m_nIdOperador: state.IdOperador.m_nIdOperador,
            m_nIdRemolque1: state.IdRemolque1.m_nIdUnidad,
            m_nIdRemolque2: state.IdRemolque2 ? state.IdRemolque2.m_nIdUnidad : 0,
            m_sPlacasRemolque1: state.PlacasRemolque1,
            m_sPlacasRemolque2: state.PlacasRemolque2,
            m_nIdRuta: state.IdRuta.m_nIdRuta,
            m_nIdSucursalEmisora: state.sucursalEmisora,
            m_nIdSucursalReceptora: state.sucursalReceptora,
            m_nIdDolly: state.IdTipoUnidad.m_nIdUnidad,
            m_sPlacasDolly: state.PlacasDolly,

            m_nIdViaje: state.IdViaje.m_nIdViaje,
            TotalxCDestinatario: 0,
            TotalxCCobrarRemitente: 0,
            TotalPagoMostrador: 0,
            TotalUnidadCompleta: 0,
            TotalGeneral: 0,
            m_nCreadoPor: state.CreadoPor,
            m_arrClsProInformeGuia: dataGuias.filter(g => g.select),
        };

        if (state.IdInforme != 0) {
            modificarInformes(state.IdInforme, params)
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
                    showSuccess("El Usuario no tiene derecho para modificar");
                });
        } else {
            agregarInformes(params)
                .then((respuesta) => {
                    showSuccess(respuesta.data);
                    if (state.cuibicar && state.indexCubicar < informes.length) {
                        showAgregarFromCubicar(state.indexCubicar++)
                    } else {
                        getAllData();
                        $('.nav-tabs li ').removeClass('active');
                        $('.nav-tabs li').eq(0).addClass('active');
                        $('.tab-content div ').removeClass('in show');
                        $('#Listado').addClass('in show');
                        setState({...state, cubicar: false})
                    }

                })
                .catch((err) => {
                    showSuccess(err);
                });
        }
    };

    function getFormatosImpresion() {
        obtenerFormatosImpresion().then(respuesta => {
            setFormatosImpresion(respuesta.data)
        });
    };

    function showAgregarFromCubicar(index) {
        setState({
            ...state,
            index: index
        })
        var guiasArray = guias.filter(g => informes[index].map(i => i.idGuia).includes(g.m_nIdGuia))
        guias.forEach(g => g.select = true)
        setDataGuias(guiasArray)

    }

    const handleSelectSucursalEmisora = event => {
        event.preventDefault()
        setState({
            ...state,
            sucursalEmisora: event.target.value
        });

    }
    const handleSelectSucursalReceptora = event => {
        event.preventDefault()
        setState({
            ...state,
            sucursalReceptora: event.target.value
        });

    }

    const handleSelectEstatus = event => {
        event.preventDefault()
        setState({
            ...state,
            EstatusInforme: event.target.value
        });

    }


    function TableCiudades({columns, data, select}) {
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
            <div
                className="col-md-12"
                style={{maxHeight: "300px", overflow: "auto"}}
            >
                <table className="table" {...getTableProps()}>
                    <thead>
                    {headerGroups.map((headerGroup) => (
                        <tr {...headerGroup.getHeaderGroupProps()}>
                            {headerGroup.headers.map((column) => (
                                // Add the sorting props to control sorting. For this example
                                // we can add them into the header props
                                <th {...column.getHeaderProps(column.getSortByToggleProps())}>
                                    {column.render("Name")}
                                    {/* Add a sort direction indicator */}
                                    <span>
                                            {column.isSorted ? (
                                                column.isSortedDesc ? (
                                                    <i className="fa fa-caret-up"/>
                                                ) : (
                                                    <i className="fa fa-caret-down"/>
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
                            <tr
                                style={{
                                    backgroundColor:
                                        row.original.m_nIdCiudad === select ? "orange" : "white",
                                }}
                                {...row.getRowProps()}
                                onClick={handleSelectDatos.bind(this, row.original)}
                            >
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

    useEffect(value => {
        setState({
            ...state,
            PlacasRemolque1: state.IdRemolque1 ? state.IdRemolque1.m_sPlacas : "",
            PlacasRemolque2: state.IdRemolque2 ? state.IdRemolque2.m_sPlacas : "",
            PlacasDolly: state.IdTipoUnidad ? state.IdTipoUnidad.m_sPlacas : ""
        })
    }, [state.IdRemolque1, state.IdRemolque2, state.IdTipoUnidad])

    function TableOperadores({columns, data, select}) {
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
            <div
                className="col-md-12"
                style={{maxHeight: "300px", overflow: "auto"}}
            >
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
                                                    <i className="fa fa-caret-up"/>
                                                ) : (
                                                    <i className="fa fa-caret-down"/>
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
                            <tr
                                style={{
                                    backgroundColor:
                                        row.original.m_nIdOperador === select
                                            ? "#FCC88F"
                                            : "white",
                                }}
                                {...row.getRowProps()}
                                onClick={handleSelectCP.bind(this, row.original, false)}
                                onDoubleClick={handleSelectCP.bind(this, row.original, true)}
                            >
                                <td>
                                    <div>
                                        <a
                                            href="#Agregar"
                                            role="tab"
                                            data-toggle="tab"
                                            onClick={() =>
                                                handleShowModificar(row.original.m_nIdRecoleccion)
                                            }
                                            className="btn btn-default"
                                        >
                                            <i
                                                className="fa fa-pencil-square-o"
                                                style={{color: "#F9A03E"}}
                                            />
                                        </a>
                                        <a
                                            href="#"
                                            className="btn btn-default btn-sm m-user-delete"
                                            onClick={() =>
                                                handleEliminar(row.original.m_nIdRecoleccion)
                                            }
                                        >
                                            <i
                                                className="zmdi zmdi-delete"
                                                style={{color: "#F30B0B"}}
                                            />
                                        </a>
                                        <a
                                            href="#"
                                            className="btn btn-default btn-sm m-user-delete"
                                            onClick={() =>
                                                handleEliminar(row.original.m_nIdRecoleccion)
                                            }
                                        >
                                            <i className="fa fa-eye" style={{color: "#F9A03E"}}/>
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


    function TableUnidad({columns, data, select}) {
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
            <div
                className="col-md-12"
                style={{maxHeight: "300px", overflow: "auto"}}
            >
                <table className="table" {...getTableProps()}>
                    <thead>
                    {headerGroups.map((headerGroup) => (
                        <tr {...headerGroup.getHeaderGroupProps()}>
                            {headerGroup.headers.map((column) => (
                                // Add the sorting props to control sorting. For this example
                                // we can add them into the header props
                                <th {...column.getHeaderProps(column.getSortByToggleProps())}>
                                    {column.render("Name")}
                                    {/* Add a sort direction indicator */}
                                    <span>
                                            {column.isSorted ? (
                                                column.isSortedDesc ? (
                                                    <i className="fa fa-caret-up"/>
                                                ) : (
                                                    <i className="fa fa-caret-down"/>
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
                            <tr
                                style={{
                                    backgroundColor:
                                        row.original.m_nIdUnidad === select ? "orange" : "white",
                                }}
                                {...row.getRowProps()}
                                onClick={handleSelectCP.bind(this, row.original, false)}
                                onDoubleClick={handleSelectCP.bind(this, row.original, true)}
                            >
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

    const headers = {
        "Content-Type": "application/json",
    };

    function cubicarAccion(e) {
        e.preventDefault();
        getAllGuiasFrom(true);
    }


    const selectGuia = (index) => {
        const newGuia = [...dataGuias];

        newGuia[index]["select"] = newGuia[index].select ? false : true;
        setDataGuias(newGuia);
    };


    function handleShowCancelar(event) {
        event.stopPropagation()
        var today = new Date();
        obtenerInformesId(state.IdInforme).then((respuesta) => {
            setState({
                ...state,
                FolioInforme: respuesta.data.m_nIdInforme,
                sucursalCancelacion: dataSucursal.find(
                    (o) => o.m_nIdSucursal == respuesta.data.m_nIdSucursalEmisora
                ).m_sSucursal,
                fechaCancelacion:
                    today.getFullYear() +
                    "-" +
                    (today.getMonth() + 1) +
                    "-" +
                    today.getDate(),
                motivoCancelacion: respuesta.data.m_sMotivoCancelacion,
                usuarioCancelacion:
                    respuesta.data.m_nIdUsuarioCancelacion != 0
                        ? respuesta.data.m_nIdUsuarioCancelacion
                        : localStorage.getItem("UsuarioId"),
                estatusCancelacion: dataEstatusInformes[0].m_sEstatus, //dataEstatusInformes.find(o => o.m_nIdEstatusInforme == respuesta.data.m_nIdEstatusInforme),
                sePuedeCancelar: false,
            });

            if (respuesta.data.m_nSePuedeCancelar == 0) {
                state.sePuedeCancelar = true;
                showSuccess("Informe no se puede cancelar");
            } else {
                $('.nav-tabs li ').removeClass('active');
                $('.nav-tabs li').eq(3).addClass('active');
                $('.tab-content div ').removeClass('in show');
                $('#Cancelar').addClass('in show');
            }
        });
    }

    const handleCancelar = (e) => {
        e.preventDefault();
        var params = {
            motivoCancelacion: state.MotivoCancelacion,
            usuarioCancelacion: localStorage.getItem("UsuarioId"),
            fechaCancelacion: state.fechaCancelado,
        };
        cancelarInformes(state.IdInforme).then((respuesta) => {
            console.log(respuesta.data);
        });
    };

    function getAllGuiasFrom(cubicar) {
        if (!cubicar) {
            obtenerGuiaPendientes(state.IdCiudadOrigen.m_nIdCiudad, state.IdCiudadDestino.m_nIdCiudad).then((respuesta) => {
                if (respuesta.data !== "Vacio") {
                    setDataGuias(respuesta.data);
                }

            })
        } else {
            obtenerGuiasFiltro(0, 0, 0, 4).then(async (respuesta) => {
                setDataGuias(respuesta.data);
                if (cubicar) {
                    cubicarGuias(
                        respuesta.data,
                        state.IdCiudadOrigen,
                        state.IdCiudadDestino,
                        state.IdRemolque1,
                        state.IdRemolque2
                    ).then(result => {
                        setInformes(result);
                    })

                }
            })
        }


    }


    const handleImprimir = () => {
        imprimirFormatosId(state.formatoSeleccionado).then((response) => {
            window.open(new Blob([response.data]));
        })

    }

    function getAllCiudades() {
        obtenerCiudades().then((respuesta) => {
            setDataOrigenes(respuesta.data);
        });
    }

    /*   function getAllTipoUnidad() {
        const url = `${process.env.REACT_APP_API_URL}/TiposUnidades/GetListado`;
        axios.get(url, { headers }).then((respuesta) => {
          setDataTipoUnidad(respuesta.data);
          getAllUnidades(respuesta.data[0].m_nIdTipoUnidad);
        });
      }
     */
    function getAllUnidades() {
        obtenerUnidades().then((respuesta) => {
            setDataUnidades(respuesta.data);
        });
    }


    function getAllOperadores() {
        obtenerOperadores().then((respuesta) => {
            setDataOperadores(respuesta.data);
        });
    }

    function getAllEstatusInformes() {
        obtenerEstatusInforme().then((respuesta) => {
            setEstatusInformes(respuesta.data);
        });
    }

    function getAllSucursales() {
        obtenerSucursales().then((respuesta) => {
            setDataSucursal(respuesta.data);
        });
    }

    function getAllViajesOrigenDestino(origen, destino) {
        const url = `${API_BASE_URL}/Informes/GetViajes/` + origen + `/` + destino;
        axios.get(url, {headers}).then((respuesta) => {
            setDataViajes(respuesta.data);
        });
    }

    useEffect(value => {
        if (state.IdCiudadOrigen && state.IdCiudadDestino && state.IdRuta != 0) {
            getAllGuiasFrom();

        }
        if (state.IdCiudadOrigen && state.IdCiudadDestino) {
            getAllViajesOrigenDestino(
                state.IdCiudadOrigen
                    .m_nIdCiudad,
                state.IdCiudadDestino
                    .m_nIdCiudad
            );
        }
    }, [state.IdCiudadOrigen, state.IdCiudadDestino, state.IdRuta])

    function handleShowAgregar() {
        setState({
            ...state,
            agregar: "Agregar",
            showPopUp: true,
            IdGrupoUnidad: 0,
            Codigo: 0,
            GrupoUnidad: "",
            Color: "",
            IdOperador: 0,
            fechaHora: state.fechaHora,
            IdCiudadDestino: {},
            IdCiudadOrigen: {},
            sucursalEmisora: 0,
            sucursalReceptora: 0,
            IdRemolque1: null,
            IdRemolque2: null,
            IdTipoUnidad: {},
            IdRuta: {},
            IdEstatusInforme: "5",
            PlacasRemolque1: "",
            PlacasRemolque2: "",
            PlacasDolly: "",
            FolioInforme: "",
        });
        $('.nav-tabs li ').removeClass('active');
        $('.nav-tabs li').eq(1).addClass('active');
        $('.tab-content div ').removeClass('in show');
        $('#Agregar').addClass('in show');

    }

    function handleShowModificar(id) {
        $('.nav-tabs li ').removeClass('active');
        $('.nav-tabs li').eq(1).addClass('active');
        $('.tab-content div ').removeClass('in show');
        $('#Agregar').addClass('in show');
        obtenerInformesId(id).then(({data}) => {
            data.m_arrClsProGuia.forEach(g => g.select = true)
            setDataGuias(data.m_arrClsProGuia)
            setState({
                ...state,

                fechaHora: data.m_sFechayHora,
                IdCiudadDestino: dataOrigenes.find(c => c.m_nIdCiudad === data.m_nIdCiudadDestino),
                IdCiudadOrigen: dataOrigenes.find(c => c.m_nIdCiudad === data.m_nIdCiudadOrigen),
                IdOperador: dataOperadores.find(c => c.m_nIdOperador === data.m_nIdOperador),
                sucursalEmisora: data.m_nIdSucursalEmisora,
                sucursalReceptora: data.m_nIdSucursalReceptora,
                IdRemolque1: dataUnidades.find(c => c.m_nIdUnidad === data.m_nIdRemolque1),
                IdRemolque2: dataUnidades.find(c => c.m_nIdUnidad === data.m_nIdRemolque2),
                IdTipoUnidad: dataUnidades.find(c => c.m_nIdUnidad === data.m_nIdDolly),
                IdRuta: dataRutas.find(c => c.m_nIdRuta === data.m_nIdRuta),
                IdEstatusInforme: dataEstatusInformes.find(c => c.m_nIdEstatusInforme === data.m_nIdEstatusInforme),
                PlacasRemolque1: data.m_sPlacasRemolque1,
                PlacasRemolque2: data.m_sPlacasRemolque2,
                PlacasDolly: data.m_sPlacasDolly,
                FolioInforme: data.m_sFolioInforme,
                EstatusInforme: data.m_nIdEstatusInforme,
                agregar: "Modificar"
            });

        });
    }

    function handleShowConsultar(id) {
        $('.nav-tabs li ').removeClass('active');
        $('.nav-tabs li').eq(1).addClass('active');
        $('.tab-content div ').removeClass('in show');
        $('#Agregar').addClass('in show');
        obtenerInformesId(id).then(({data}) => {
            console.log(data.m_arrClsProGuia)
            setDataGuias(data.m_arrClsProGuia)
            setState({
                ...state,
                fechaHora: data.m_sFechayHora,
                IdCiudadDestino: dataOrigenes.find(c => c.m_nIdCiudad === data.m_nIdCiudadDestino),
                IdCiudadOrigen: dataOrigenes.find(c => c.m_nIdCiudad === data.m_nIdCiudadDestino),
                IdOperador: dataOperadores.find(c => c.m_nIdOperador === data.m_nIdOperador),
                sucursalEmisora: data.m_nIdSucursalEmisora,
                sucursalReceptora: data.m_nIdSucursalReceptora,
                IdRemolque1: dataUnidades.find(c => c.m_nIdUnidad === data.m_nIdRemolque1),
                IdRemolque2: dataUnidades.find(c => c.m_nIdUnidad === data.m_nIdRemolque2),
                IdTipoUnidad: dataUnidades.find(c => c.m_nIdUnidad === data.m_nIdDolly),
                IdRuta: dataRutas.find(c => c.m_nIdRuta === data.m_nIdRuta),
                IdEstatusInforme: dataEstatusInformes.find(c => c.m_nIdEstatusInforme === data.m_nIdEstatusInforme),
                PlacasRemolque1: data.m_sPlacasRemolque1,
                PlacasRemolque2: data.m_sPlacasRemolque2,
                PlacasDolly: data.m_sPlacasDolly,
                FolioInforme: data.m_sFolioInforme,
                EstatusInforme: data.m_nIdEstatusInforme,
                agregar: "Consultar"
            });

        });
    }

    function handleEliminar(id) {
        var derecho;
        validarPermisos(state)
            .then((respuesta) => {
                //showSuccess(respuesta.data)

                derecho = respuesta.data;
                if (derecho == false) {
                    showSuccess("El usuario no tiene derechos para realizar el proceso");
                    return;
                }

                eliminarInformes(id, state.CreadoPor)
                    .then((respuesta) => {
                        console.log(respuesta);
                    })
                    .catch((err) => {
                        showSuccess(err);
                    });
            })
            .catch((err) => {
                showSuccess(err);
            });
    }

    useEffect((value) => {
        if (
            localStorage.getItem("UsuarioId") === null ||
            localStorage.getItem("UsuarioId") <= 0
        ) {
            showSuccess("Es necesario iniciar sesion para acceder a este proceso");
            window.location.replace("login");
            return;
        }
        getAllData();
        getAllGuias();
        getAllEstatusInformes();
        getAllSucursales();
        getAllOperadores();
        getFormatosImpresion();
        getAllCiudades();
        getAllUnidades();
        //getAllTipoUnidad();
        getAllDataRutas();
    }, []);

    function getAllData() {
        obtenerInformes().then((respuesta) => {
            setData(respuesta.data);
        });
    }

    function openSection(index) {
        // closeSeccions();
        var $section;
        switch (index) {
            case 1:
                setStepActive(1);
                $section = $("#infogral");
                break;
            case 2:
                setStepActive(2);
                $section = $("#caracteristicas");

                break;

            case 3:
                setStepActive(3);
                $section = $("#seguros");
                break;

            default:
        }
        $("html, body").animate(
            {
                scrollTop: parseInt($section.offset().top - 150),
            },
            200
        );
    }

    //Maneja filtrado de listado informe
    const handleFolioInformeFiltro = async (event) => {
        if(event.keyCode == 13) {
            let value = event.target.value
            if (event.target.value == '') {
                value = 0
            }
            setState({
                ...state,
                folioInformeListado: event.target.value,
            })
            obtenerInformeFiltro(value).then(respuesta => {
                if (respuesta.data == "Vacio") {
                    setData([])
                } else {
                    setData(respuesta.data)
                }
            })
        }
    }


    return (
        <div>

            <Dialog
                open={state.openDialog}
                onClose={() => setState({...state, openDialog: false})}
                fullWidth maxWidth="md"
            >
                <DialogContent>
                    {state.tipoModal == 1 && (
                        <div className="row" style={{backgroundColor: "#FFFFFF"}}>
                            <div align="right">
                                <button
                                    onClick={() => {
                                        history.push("/Ciudades");
                                    }}
                                    className="btn btn-primary primary-btn"
                                >
                                    Agregar
                                </button>
                            </div>

                            {dataOrigenes.length != 0 ? (
                                <TableCiudades
                                    select={
                                        state[state.identificadorModal] &&
                                        state[state.identificadorModal].m_nIdCiudad
                                    }
                                    columns={columnsCiudades}
                                    data={dataOrigenes}
                                    identificadorModal={state.identificadorModal}
                                />
                            ) : (
                                <div>No se encontró ningún registro</div>
                            )}
                            <DialogActions style={{justifyContent: "left"}}>
                                <button
                                    onClick={() => setState({...state, openDialog: false})}
                                    className="btn btn-secondary secondary-btn"
                                >
                                    Cerrar
                                </button>
                                <button
                                    onClick={() => setState({...state, openDialog: false})}
                                    className="btn btn-primary primary-btn"
                                >
                                    Aceptar
                                </button>
                            </DialogActions>
                        </div>
                    )}
                    {state.tipoModal == 2 && (
                        <div className="row" style={{backgroundColor: "#FFFFFF"}}>
                            <div align="right">
                                <button
                                    onClick={() => {
                                        history.push("/Operadores");
                                    }}
                                    className="btn btn-primary primary-btn"
                                >
                                    Agregar
                                </button>
                            </div>

                            {dataOperadores.length != 0 ? (
                                <TableOperadores
                                    select={
                                        state[state.identificadorModal] &&
                                        state[state.identificadorModal].m_nIdOperador
                                    }
                                    columns={columnsOperadores}
                                    data={dataOperadores}
                                    identificadorModal={state.identificadorModal}
                                />
                            ) : (
                                <div>No se encontró ningún registro</div>
                            )}
                            <DialogActions style={{justifyContent: "left"}}>
                                <button
                                    onClick={() => setState({...state, openDialog: false})}
                                    className="btn btn-secondary secondary-btn"
                                >
                                    Cerrar
                                </button>
                                <button
                                    onClick={() => setState({...state, openDialog: false})}
                                    className="btn btn-primary primary-btn"
                                >
                                    Aceptar
                                </button>
                            </DialogActions>
                        </div>
                    )}

                    {state.tipoModal == 4 && (
                        <div className="row" style={{backgroundColor: "#FFFFFF"}}>
                            <div align="right">
                                <button
                                    onClick={() => {
                                        history.push("/Unidades");
                                    }}
                                    className="btn btn-primary primary-btn"
                                >
                                    Agregar
                                </button>
                            </div>

                            {dataUnidades.filter((g) => g.m_nIdTipoUnidad === 12 || g.m_nIdTipoUnidad === 30).length != 0 ? (
                                <TableUnidad
                                    select={
                                        state[state.identificadorModal] &&
                                        state[state.identificadorModal].m_nIdUnidad
                                    }
                                    columns={columnsUnidades}
                                    data={dataUnidades.filter((g) => g.m_nIdTipoUnidad === 12 || g.m_nIdTipoUnidad === 30)}
                                    identificadorModal={state.identificadorModal}
                                />
                            ) : (
                                <div>No se encontró ningún registro</div>
                            )}
                            <DialogActions style={{justifyContent: "left"}}>
                                <button
                                    onClick={() => setState({...state, openDialog: false})}
                                    className="btn btn-secondary secondary-btn"
                                >
                                    Cerrar
                                </button>
                                <button
                                    onClick={() => setState({...state, openDialog: false})}
                                    className="btn btn-primary primary-btn"
                                >
                                    Aceptar
                                </button>
                            </DialogActions>
                        </div>
                    )}
                    {state.tipoModal === 6 &&
                    <div className="row" style={{backgroundColor: '#FFFFFF'}}>
                        <DialogTitle style={{padding: "0px"}}><h4>Selecciona el Formato</h4></DialogTitle>
                        <div>
                            <label className="input select" style={{width: "100%"}}>
                                <FormControl fullWidth variant="outlined" margin="dense">
                                    <InputLabel id="sucursalListadoLabel">Formato</InputLabel>
                                    <Select
                                        labelId="sucursalListadoLabel"
                                        label="Formato"
                                        className="form-control"
                                        required
                                        value={state.formatoSeleccionado}
                                        onChange={(event) => setState({
                                            ...state,
                                            formatoSeleccionado: event.target.value
                                        })}
                                        id="formatoSeleccionado"
                                        name="formatoSeleccionado"
                                    >
                                        {dataFormatos.map((formato) => (
                                            <option
                                                key={formato.m_nIdFormato}
                                                value={formato.m_nIdFormato}
                                            >
                                                {formato.m_sFormato}
                                            </option>
                                        ))}
                                    </Select>
                                </FormControl>
                                <i></i>
                            </label>
                        </div>

                        <DialogActions style={{justifyContent: "left"}}>

                            <button onClick={() => handleImprimir()} className="btn btn-primary primary-btn">Aceptar
                            </button>
                            <button onClick={() => setState({...state, openDialog: false})}
                                    className="btn btn-secondary secondary-btn">Cerrar
                            </button>

                        </DialogActions>
                    </div>
                    }
                </DialogContent>
            </Dialog>

            <header className="topbar clearfix">
                <Cabecera titulo="Informes">
                    <div className="page-header">
                        <ul className="list-page-breadcrumb">
                            <li className="active-page"> Informes</li>
                        </ul>
                    </div>
                </Cabecera>
            </header>
            {/*Topbar End Here*/}
            {/*Leftbar Start Here*/}
            <aside className="iconic-leftbar">
                <BarraLateralIzquierda/>
            </aside>

            <section className="main-container">
                <div className="container-fluid">


                    <ul className="nav navStatica nav-tabs">
                        <li className="active">
                            <a onClick={(event) => {
                                event.stopPropagation();
                                setState({...state, agregar: "Agregar"});
                                $('.nav-tabs li ').removeClass('active');
                                $('.nav-tabs li').eq(0).addClass('active');
                                $('.tab-content div ').removeClass('in show');
                                $('#Listado').addClass('in show');
                            }}>
                                <i className="fa fa-list"/> Listado
                            </a>
                        </li>
                        <li>
                            <a onClick={handleShowAgregar}>
                                <i className="fa fa-plus-circle"/> {state.agregar}
                            </a>
                        </li>

                        <li>
                            <a onClick={(event) => {
                                event.stopPropagation();
                                setState({
                                    ...state,
                                    identificadorModal:
                                        "imprimir",
                                    tipoModal: 6,
                                    openDialog: true
                                });
                            }}>
                                <i className="fa fa-print"/> Imprimir
                            </a>
                        </li>

                        <li>
                            <a
                                data-toggle="tab"
                                href="#Cancelar"
                                onClick={handleShowCancelar}
                                className={state.IdInforme == 0 ? classes.disabled : ""}
                            >
                                <i className="fa fa-ban"/> Cancelar
                            </a>
                        </li>

                        <li>
                            <a data-toggle="tab" href="#Cubicar" onClick={(event) => {
                                event.stopPropagation();
                                setState({...state, agregar: "Agregar"});
                                $('.nav-tabs li ').removeClass('active');
                                $('.nav-tabs li').eq(4).addClass('active');
                                $('.tab-content div ').removeClass('in show');
                                $('#Cubicar').addClass('in show');
                            }}>
                                <i className="fa fa-adjust"/> Cubicar / Optimizar Rutas
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

                                    <div className="row " style={{display: "flex"}}>
                                        <div className="col-sm-6 col-md-3 unit" style={{paddingLeft: "0px"}}>

                                            <div className="input">
                                                <TextField variant="outlined" margin="dense"
                                                           onChange={handleChange}
                                                           onKeyDown={handleFolioInformeFiltro}
                                                           className="form-control"
                                                           type="text"

                                                           label="Folio Informe"
                                                           placeholder={state.folioInformeListado}
                                                           id="folioInformeListado"
                                                           name="folioInformeListado"
                                                />
                                            </div>
                                        </div>
                                    </div>

                                    <div className="row" style={{height: state.height - 250, width: "100%"}}>
                                        {data.length != 0 ? (
                                            <DataGrid
                                                localeText={dataGridLocaleText}
                                                rows={data}
                                                columns={columns}
                                                density="compact"
                                                pageSize={Math.floor((state.height - 310) / 30)}
                                                getRowId={(row) => row.m_nIdInforme}
                                                onRowSelected={(row) => {
                                                    setState({
                                                        ...state,
                                                        IdInforme: row.data.m_nIdInforme,
                                                    });
                                                }}
                                            />
                                        ) : (
                                            <div>No se encontró ningún registro</div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div id="Importar" className="tab-pane fade ">
                            Importar
                        </div>
                        <div id="Agregar" className="tab-pane fade ">
                            {/*INICIO DE ESTRUCTURA */}

                            <form className="j-forms row" onSubmit={handleAceptar}>
                                {/*Inicio de ejemplo*/}
                                <div className="form-content">
                                    {/* start steps */}
                                    <div
                                        className="wizard-breadcrumb number-style"
                                        style={{
                                            position: "sticky",
                                            top: "60px",
                                            padding: "5px",
                                            backgroundColor: "white",
                                            zIndex: 100,
                                            marginBottom: "10px",
                                        }}
                                    >
                                        <div className="row">
                                            <Stepper activeStep={stepActive - 1}>
                                                {
                                                    ["Información De Envio", "Asignar a un Viaje", "Detalles de Guias"].map((s, index) => (
                                                        <Step key={s} completed={false}
                                                              onClick={() => openSection(index + 1)}>
                                                            <StepLabel>{s}</StepLabel>
                                                        </Step>
                                                    ))
                                                }
                                            </Stepper>
                                        </div>
                                    </div>
                                    {/* end steps */}
                                </div>

                                <div className="row">
                                    <div className="col-md-6">
                                        <div className="widget-wrap">
                                            <div className="widget-container margin-top-0">
                                                <div className="widget-content">
                                                    <div
                                                        className="widget-header block-header margin-bottom-0 clearfix">
                                                        <div className="pull-left">
                                                            <h3>Información De Envio</h3>
                                                        </div>
                                                    </div>

                                                    <div className="widget-container">
                                                        <div className="widget-content">
                                                            <div className="row">
                                                                <div className="col-md-12">
                                                                    <div className="row">
                                                                        {/*****************************************Sucursal**********************************************************/}
                                                                        <div
                                                                            className="col-sm-12 col-md-6 unit">
                                                                            <label className="input select">
                                                                                <FormControl fullWidth
                                                                                             variant="outlined"
                                                                                             margin="dense">
                                                                                    <InputLabel
                                                                                        id="IdSucursalLabel">Sucursal</InputLabel>
                                                                                    <Select
                                                                                        labelId="IdSucursalLabel"
                                                                                        label="Sucursal"
                                                                                        className="form-control"
                                                                                        required
                                                                                        id="IdSucursal"
                                                                                        value={state.IdSucursal}
                                                                                        disabled
                                                                                    >
                                                                                        <option
                                                                                            value="0">Todas
                                                                                        </option>
                                                                                        {dataSucursal.map((sucursal) => (
                                                                                            <option
                                                                                                key={sucursal.m_nIdSucursal}
                                                                                                value={sucursal.m_nIdSucursal}
                                                                                            >
                                                                                                {sucursal.m_sSucursal}
                                                                                            </option>
                                                                                        ))}
                                                                                    </Select>
                                                                                </FormControl>
                                                                            </label>
                                                                        </div>
                                                                        <div
                                                                            className="col-sm-6 col-md-6 col-xs-12 unit">
                                                                            <div className="input">
                                                                                <TextField variant="outlined"
                                                                                           margin="dense"
                                                                                           label="Folio"
                                                                                           className="form-control"
                                                                                           type="text"
                                                                                           InputLabelProps={{
                                                                                               shrink: true,
                                                                                           }}
                                                                                           value={state.FolioInforme}
                                                                                           id="Folio"
                                                                                           disabled
                                                                                />
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                    {/*****************************************Folio************************************************************/}

                                                                    {/*****************************************Fecha*******************************************************/}
                                                                    <div className="col-sm-6 col-md-6 unit">
                                                                        <div className="input">
                                                                            <TextField variant="outlined"
                                                                                       margin="dense"
                                                                                       label="Fecha y Hora"
                                                                                       onChange={handleChange}
                                                                                       className="form-control"
                                                                                       type="datetime-local"
                                                                                       required
                                                                                       InputLabelProps={{
                                                                                           shrink: true,
                                                                                       }}
                                                                                       value={state.fechaHora}
                                                                                       disabled={
                                                                                           state.agregar == "Consultar"
                                                                                       }
                                                                                       id="fechaHora"
                                                                            />
                                                                        </div>
                                                                    </div>
                                                                    {/*****************************************Hora*******************************************************/}

                                                                    {/*****************************************Oficina Emisora***************************************************/}
                                                                    <div className="col-sm-6 col-md-6 unit">

                                                                        <label className="input select">
                                                                            <FormControl fullWidth
                                                                                         variant="outlined"
                                                                                         margin="dense">
                                                                                <InputLabel
                                                                                    id="sucursalEmisoraLabel">Oficina
                                                                                    Emisora</InputLabel>
                                                                                <Select
                                                                                    labelId="sucursalEmisoraLabel"
                                                                                    label="Oficina Emisora"
                                                                                    className="form-control"
                                                                                    required
                                                                                    value={state.sucursalEmisora}
                                                                                    id="sucursalEmisora"
                                                                                    onChange={handleSelectSucursalEmisora}
                                                                                >
                                                                                    {dataSucursal.map(
                                                                                        (sucursalEmisora) => (
                                                                                            <option
                                                                                                key={
                                                                                                    sucursalEmisora.m_nIdSucursal
                                                                                                }
                                                                                                value={
                                                                                                    sucursalEmisora.m_nIdSucursal
                                                                                                }
                                                                                            >
                                                                                                {
                                                                                                    sucursalEmisora.m_sSucursal
                                                                                                }
                                                                                            </option>
                                                                                        )
                                                                                    )}
                                                                                </Select>
                                                                            </FormControl>
                                                                        </label>
                                                                    </div>
                                                                    {/*****************************************Oficina Receptora*************************************************/}
                                                                    <div className="col-sm-6 col-md-6 unit">

                                                                        <label className="input select">
                                                                            <FormControl fullWidth
                                                                                         variant="outlined"
                                                                                         margin="dense">
                                                                                <InputLabel
                                                                                    id="sucursalReceptoraLabel">Oficina
                                                                                    Receptora</InputLabel>
                                                                                <Select
                                                                                    labelId="sucursalReceptoraLabel"
                                                                                    label="Oficina Receptora"
                                                                                    className="form-control"
                                                                                    required
                                                                                    value={state.sucursalReceptora}
                                                                                    id="sucursalReceptora"
                                                                                    onChange={handleSelectSucursalReceptora}
                                                                                >
                                                                                    {dataSucursal.map(
                                                                                        (sucursalReceptora) => (
                                                                                            <option
                                                                                                key={
                                                                                                    sucursalReceptora.m_nIdSucursal
                                                                                                }
                                                                                                value={
                                                                                                    sucursalReceptora.m_nIdSucursal
                                                                                                }
                                                                                            >
                                                                                                {
                                                                                                    sucursalReceptora.m_sSucursal
                                                                                                }
                                                                                            </option>
                                                                                        )
                                                                                    )}
                                                                                </Select>
                                                                            </FormControl>
                                                                        </label>
                                                                    </div>
                                                                    {/*****************************************Estatus de Entrega*************************************************/}
                                                                    <div className="col-sm-6 col-md-6 unit">

                                                                        <label className="input select">
                                                                            <FormControl required fullWidth
                                                                                         variant="outlined"
                                                                                         margin="dense">
                                                                                <InputLabel
                                                                                    id="EstatusInformeLabel">Estatus</InputLabel>
                                                                                <Select
                                                                                    labelId="EstatusInformeLabel"
                                                                                    label="Estatus"
                                                                                    className="form-control"
                                                                                    required
                                                                                    onChange={handleSelectEstatus}
                                                                                    value={state.EstatusInforme}
                                                                                    id="EstatusInforme"
                                                                                >
                                                                                    <option
                                                                                        value="">Seleccionar
                                                                                    </option>
                                                                                    {dataEstatusInformes.map(
                                                                                        (EstatusInforme) => (
                                                                                            <option
                                                                                                key={
                                                                                                    EstatusInforme.m_nIdEstatusInforme
                                                                                                }
                                                                                                value={
                                                                                                    EstatusInforme.m_nIdEstatusInforme
                                                                                                }
                                                                                            >
                                                                                                {EstatusInforme.m_sEstatus}
                                                                                            </option>
                                                                                        )
                                                                                    )}
                                                                                </Select>
                                                                            </FormControl>
                                                                        </label>
                                                                    </div>


                                                                    {/*****************************************Operador*************************************************/}

                                                                    {/*<div className="row">
                                                                        <div className="col-sm-12 col-md-12 unit">

                                                                              <input class="form-control" type="text" placeholder="Enter a letter" id="list-autocomplete" name="list-autocomplete"/>
                                                                            <Autocomplete
                                                                                freeSolo
                                                                                value={state.IdOperador}
                                                                                onChange={(event, newValue) =>
                                                                                    setState({
                                                                                        ...state,
                                                                                        IdOperador: newValue,
                                                                                    })
                                                                                }
                                                                                id="IdOperador"
                                                                                disableClearable
                                                                                forcePopupIcon={false}
                                                                                options={dataOperadores}
                                                                                getOptionLabel={(option) =>
                                                                                    option.m_sNombreCompleto
                                                                                }
                                                                                variant="outlined"
                                                                                style={{
                                                                                    transform: "translate(14px, 10px) scale(1) !important"
                                                                                }}
                                                                                renderInput={(params) => (
                                                                                    <div>
                                                                                        <TextField
                                                                                            variant="outlined"
                                                                                            label="Operador"
                                                                                            margin="dense"
                                                                                            className="form-control"
                                                                                            {...params}
                                                                                            InputProps={{
                                                                                                ...params.InputProps,
                                                                                                style: {
                                                                                                    height: 24,
                                                                                                },
                                                                                                type: "search",
                                                                                                disableUnderline: true,
                                                                                                endAdornment: (
                                                                                                    <InputAdornment
                                                                                                        position="end">
                                                                                                        <IconButton
                                                                                                            padding="0px"
                                                                                                            style={{
                                                                                                                paddingRight: "0px",
                                                                                                            }}
                                                                                                            onClick={() => {
                                                                                                                setState({
                                                                                                                    ...state,
                                                                                                                    identificadorModal:
                                                                                                                        "IdOperador",
                                                                                                                    tipoModal: 2,
                                                                                                                    openDialog: true,
                                                                                                                });
                                                                                                            }}
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
                                                                                                ),
                                                                                            }}
                                                                                        />
                                                                                    </div>
                                                                                )}
                                                                            />
                                                                        </div>
                                                                    </div>*/}
                                                                    {/*****************************************tipo Unidad*************************************************/}
                                                                    {/*<div className="row">
                                                                        <div className="col-sm-12 col-md-6 unit">

                                                                            <div className="input">
                                                                                <Autocomplete
                                                                                    freeSolo
                                                                                    onChange={(event, newValue) =>
                                                                                        setState({
                                                                                            ...state,
                                                                                            IdTipoUnidad: newValue,
                                                                                        })
                                                                                    }
                                                                                    value={state.IdTipoUnidad}
                                                                                    id="IdTipoUnidad"
                                                                                    disableClearable
                                                                                    forcePopupIcon={false}
                                                                                    options={dataUnidades && dataUnidades.filter((g) => g.m_nIdTipoUnidad === 28)}
                                                                                    getOptionLabel={(option) =>
                                                                                         option ? `${option.m_sCodigo} - ${option.m_sDescripcion}` : ""
                                                                                    }
                                                                                    variant="outlined"
                                                                                    style={{
                                                                                        transform: "translate(14px, 10px) scale(1) !important"
                                                                                    }}
                                                                                    renderInput={(params) => (
                                                                                        <div>
                                                                                            <TextField
                                                                                                variant="outlined"
                                                                                                label="Dolly"
                                                                                                margin="dense"
                                                                                                className="form-control"
                                                                                                {...params}
                                                                                                InputProps={{
                                                                                                    ...params.InputProps,
                                                                                                    style: {
                                                                                                        height: 24,
                                                                                                    },
                                                                                                    type: "search",
                                                                                                    disableUnderline: true,
                                                                                                    endAdornment: (
                                                                                                        <InputAdornment
                                                                                                            position="end">
                                                                                                            <IconButton
                                                                                                                padding="0px"
                                                                                                                style={{
                                                                                                                    paddingRight:
                                                                                                                        "0px",
                                                                                                                }}
                                                                                                                onClick={() => {
                                                                                                                    setState({
                                                                                                                        ...state,
                                                                                                                        identificadorModal:
                                                                                                                            "IdTipoUnidad",
                                                                                                                        tipoModal: 4,
                                                                                                                        openDialog: true,
                                                                                                                    });
                                                                                                                }}
                                                                                                            >
                                                                                                                <PageviewIcon
                                                                                                                    style={{
                                                                                                                        color:
                                                                                                                            "#F9A03E",
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
                                                                                                    ),
                                                                                                }}
                                                                                            />
                                                                                        </div>
                                                                                    )}
                                                                                />
                                                                            </div>
                                                                        </div>

                                                                        ****************************************Placa Int************************************************
                                                                        <div className="col-sm-12 col-md-6 unit">

                                                                            <div className="input">
                                                                                <TextField variant="outlined"
                                                                                           margin="dense"
                                                                                           label="Placa Int"
                                                                                           value={state.PlacasDolly}
                                                                                           disabled
                                                                                           className="form-control"
                                                                                           type="text"
                                                                                           id="PlacasDolly"
                                                                                />
                                                                            </div>
                                                                        </div>
                                                                    </div>*/}

                                                                    {/*****************************************Remolque*************************************************/}
                                                                    <div className="row">
                                                                        <div className="col-sm-12 col-md-6 unit">

                                                                            <div className="input">
                                                                                <Autocomplete
                                                                                    freeSolo

                                                                                    value={state.IdRemolque1}
                                                                                    onChange={(event, newValue) =>
                                                                                        setState({
                                                                                            ...state,
                                                                                            IdRemolque1: newValue,
                                                                                        })
                                                                                    }
                                                                                    id="IdRemolque1"
                                                                                    disableClearable
                                                                                    forcePopupIcon={false}
                                                                                    options={dataUnidades.filter((g) => g.m_nIdTipoUnidad === 12 || g.m_nIdTipoUnidad === 30)}
                                                                                    getOptionLabel={(option) =>
                                                                                        option ? `${option.m_sCodigo} - ${option.m_sDescripcion}` : ""
                                                                                    }
                                                                                    variant="outlined"
                                                                                    style={{
                                                                                        transform: "translate(14px, 10px) scale(1) !important"
                                                                                    }}
                                                                                    renderInput={(params) => (
                                                                                        <div>
                                                                                            <TextField
                                                                                                variant="outlined"
                                                                                                label="Remolque 1"
                                                                                                margin="dense"
                                                                                                required
                                                                                                className="form-control"
                                                                                                {...params}
                                                                                                InputProps={{
                                                                                                    ...params.InputProps,
                                                                                                    style: {
                                                                                                        height: 24,
                                                                                                    },
                                                                                                    type: "search",
                                                                                                    disableUnderline: true,
                                                                                                    endAdornment: (
                                                                                                        <InputAdornment
                                                                                                            position="end">
                                                                                                            <IconButton
                                                                                                                padding="0px"
                                                                                                                style={{
                                                                                                                    paddingRight:
                                                                                                                        "0px",
                                                                                                                }}
                                                                                                                onClick={() => {
                                                                                                                    setState({
                                                                                                                        ...state,
                                                                                                                        identificadorModal:
                                                                                                                            "IdRemolque1",
                                                                                                                        tipoModal: 4,
                                                                                                                        openDialog: true,
                                                                                                                    });
                                                                                                                }}
                                                                                                            >
                                                                                                                <PageviewIcon
                                                                                                                    style={{
                                                                                                                        color:
                                                                                                                            "#F9A03E",
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
                                                                                                    ),
                                                                                                }}
                                                                                            />
                                                                                        </div>
                                                                                    )}
                                                                                />
                                                                            </div>
                                                                        </div>
                                                                        {/*****************************************Placa Int*************************************************/}
                                                                        <div className="col-sm-12 col-md-6 unit">

                                                                            <div className="input">
                                                                                <TextField variant="outlined"
                                                                                           margin="dense"
                                                                                           label="Placa Int"
                                                                                           disabled
                                                                                           value={state.PlacasRemolque1}
                                                                                           className="form-control"
                                                                                           type="text"
                                                                                           id="PlacasRemolque1"
                                                                                />
                                                                            </div>
                                                                        </div>
                                                                    </div>

                                                                    <div className="row">
                                                                        <div className="col-sm-12 col-md-6 unit">

                                                                            <div className="input">
                                                                                <Autocomplete
                                                                                    freeSolo
                                                                                    value={state.IdRemolque2}
                                                                                    onChange={(event, newValue) =>
                                                                                        setState({
                                                                                            ...state,
                                                                                            IdRemolque2: newValue,
                                                                                        })
                                                                                    }
                                                                                    id="IdRemolque2"
                                                                                    disableClearable
                                                                                    forcePopupIcon={false}
                                                                                    options={dataUnidades.filter((g) => g.m_nIdTipoUnidad === 12 || g.m_nIdTipoUnidad === 30)}
                                                                                    getOptionLabel={(option) =>
                                                                                        option ? `${option.m_sCodigo} - ${option.m_sDescripcion}` : ""
                                                                                    }
                                                                                    variant="outlined"
                                                                                    style={{
                                                                                        transform: "translate(14px, 10px) scale(1) !important"
                                                                                    }}
                                                                                    renderInput={(params) => (
                                                                                        <div>
                                                                                            <TextField
                                                                                                variant="outlined"
                                                                                                label="Remolque 2"
                                                                                                margin="dense"
                                                                                                className="form-control"
                                                                                                {...params}
                                                                                                InputProps={{
                                                                                                    ...params.InputProps,
                                                                                                    style: {
                                                                                                        height: 24,
                                                                                                    },
                                                                                                    type: "search",
                                                                                                    disableUnderline: true,
                                                                                                    endAdornment: (
                                                                                                        <InputAdornment
                                                                                                            position="end">
                                                                                                            <IconButton
                                                                                                                padding="0px"
                                                                                                                style={{
                                                                                                                    paddingRight:
                                                                                                                        "0px",
                                                                                                                }}
                                                                                                                onClick={() => {
                                                                                                                    setState({
                                                                                                                        ...state,
                                                                                                                        identificadorModal:
                                                                                                                            "IdRemolque2",
                                                                                                                        tipoModal: 4,
                                                                                                                        openDialog: true,
                                                                                                                    });
                                                                                                                }}
                                                                                                            >
                                                                                                                <PageviewIcon
                                                                                                                    style={{
                                                                                                                        color:
                                                                                                                            "#F9A03E",
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
                                                                                                    ),
                                                                                                }}
                                                                                            />
                                                                                        </div>
                                                                                    )}
                                                                                />
                                                                            </div>
                                                                        </div>
                                                                        {/*****************************************Placa Int*************************************************/}
                                                                        <div className="col-sm-12 col-md-6 unit">

                                                                            <div className="input">
                                                                                <TextField variant="outlined"
                                                                                           margin="dense"
                                                                                           label="Placa Int"
                                                                                           value={state.PlacasRemolque2}
                                                                                           disabled
                                                                                           className="form-control"
                                                                                           type="text"
                                                                                           id="PlacasRemolque2"
                                                                                />
                                                                            </div>
                                                                        </div>
                                                                    </div>

                                                                    {/*****************************************Origen*************************************************/}
                                                                    <div className="row">
                                                                        <div className="col-sm-12 col-md-6 unit">

                                                                            <div className="input">
                                                                                <Autocomplete
                                                                                    freeSolo
                                                                                    onChange={(event, newValue) =>
                                                                                        setState({
                                                                                            ...state,
                                                                                            IdCiudadOrigen: newValue,
                                                                                        })
                                                                                    }
                                                                                    value={state.IdCiudadOrigen}
                                                                                    id="IdCiudadOrigen"
                                                                                    disableClearable
                                                                                    forcePopupIcon={false}
                                                                                    options={dataOrigenes}
                                                                                    getOptionLabel={(option) =>
                                                                                        option.m_sCiudad
                                                                                    }
                                                                                    variant="outlined"
                                                                                    style={{
                                                                                        transform: "translate(14px, 10px) scale(1) !important"
                                                                                    }}
                                                                                    renderInput={(params) => (
                                                                                        <div>
                                                                                            <TextField
                                                                                                variant="outlined"
                                                                                                label="Origen"
                                                                                                margin="dense"
                                                                                                required
                                                                                                className="form-control"
                                                                                                {...params}
                                                                                                InputProps={{
                                                                                                    ...params.InputProps,
                                                                                                    style: {
                                                                                                        height: 24,
                                                                                                    },
                                                                                                    type: "search",
                                                                                                    disableUnderline: true,
                                                                                                    endAdornment: (
                                                                                                        <InputAdornment
                                                                                                            position="end">
                                                                                                            <IconButton
                                                                                                                padding="0px"
                                                                                                                style={{
                                                                                                                    paddingRight:
                                                                                                                        "0px",
                                                                                                                }}
                                                                                                                onClick={() => {
                                                                                                                    setState({
                                                                                                                        ...state,
                                                                                                                        identificadorModal:
                                                                                                                            "IdCiudadOrigen",
                                                                                                                        tipoModal: 1,
                                                                                                                        openDialog: true,
                                                                                                                    });
                                                                                                                }}
                                                                                                            >
                                                                                                                <PageviewIcon
                                                                                                                    style={{
                                                                                                                        color:
                                                                                                                            "#F9A03E",
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
                                                                                                    ),
                                                                                                }}
                                                                                            />
                                                                                        </div>
                                                                                    )}
                                                                                />
                                                                            </div>
                                                                        </div>
                                                                        {/*****************************************Destino*************************************************/}
                                                                        <div className="col-sm-12 col-md-6 unit">

                                                                            <div className="input">
                                                                                <Autocomplete
                                                                                    freeSolo
                                                                                    onChange={(event, newValue) =>
                                                                                        setState({
                                                                                            ...state,
                                                                                            IdCiudadDestino: newValue,
                                                                                        })
                                                                                    }

                                                                                    value={state.IdCiudadDestino}
                                                                                    id="IdCiudadDestino"
                                                                                    disableClearable
                                                                                    forcePopupIcon={false}
                                                                                    options={dataOrigenes}
                                                                                    getOptionLabel={(option) =>
                                                                                        option.m_sCiudad
                                                                                    }
                                                                                    variant="outlined"
                                                                                    style={{
                                                                                        transform: "translate(14px, 10px) scale(1) !important"
                                                                                    }}
                                                                                    renderInput={(params) => (
                                                                                        <div>
                                                                                            <TextField
                                                                                                variant="outlined"
                                                                                                label="Destino"
                                                                                                margin="dense"
                                                                                                required
                                                                                                className="form-control"
                                                                                                {...params}
                                                                                                InputProps={{
                                                                                                    ...params.InputProps,
                                                                                                    style: {
                                                                                                        height: 24,
                                                                                                    },
                                                                                                    type: "search",
                                                                                                    disableUnderline: true,
                                                                                                    endAdornment: (
                                                                                                        <InputAdornment
                                                                                                            position="end">
                                                                                                            <IconButton
                                                                                                                padding="0px"
                                                                                                                style={{
                                                                                                                    paddingRight:
                                                                                                                        "0px",
                                                                                                                }}
                                                                                                                onClick={() => {
                                                                                                                    setState({
                                                                                                                        ...state,
                                                                                                                        identificadorModal:
                                                                                                                            "IdCiudadDestino",
                                                                                                                        tipoModal: 1,
                                                                                                                        openDialog: true,
                                                                                                                    });
                                                                                                                    getAllViajesOrigenDestino(
                                                                                                                        state
                                                                                                                            .IdCiudadOrigen
                                                                                                                            .m_nIdCiudad,
                                                                                                                        state
                                                                                                                            .IdCiudadDestino
                                                                                                                            .m_nIdCiudad
                                                                                                                    );
                                                                                                                    getAllGuiasFrom();
                                                                                                                }}
                                                                                                            >
                                                                                                                <PageviewIcon
                                                                                                                    style={{
                                                                                                                        color:
                                                                                                                            "#F9A03E",
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
                                                                                                    ),
                                                                                                }}
                                                                                            />
                                                                                        </div>
                                                                                    )}
                                                                                />
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                    {/*****************************************Ruta*************************************************/}
                                                                    {/*<div className="row">
                                                                        <div className="col-sm-12 col-md-12 unit">
                                                                              <input class="form-control" type="text" placeholder="Enter a letter" id="list-autocomplete" name="list-autocomplete"/>
                                                                            <div className="input">
                                                                                <Autocomplete
                                                                                    freeSolo
                                                                                    onChange={(event, newValue) =>
                                                                                        setState({
                                                                                            ...state,
                                                                                            IdRuta: newValue,
                                                                                        })
                                                                                    }
                                                                                    value={state.IdRuta}
                                                                                    id="idRuta"
                                                                                    disableClearable
                                                                                    forcePopupIcon={false}
                                                                                    options={dataRutas}
                                                                                    getOptionLabel={(option) =>
                                                                                        option.m_sDescripcion
                                                                                    }
                                                                                    variant="outlined"
                                                                                    style={{
                                                                                        transform: "translate(14px, 10px) scale(1) !important"
                                                                                    }}
                                                                                    renderInput={(params) => (
                                                                                        <div>
                                                                                            <TextField
                                                                                                variant="outlined"
                                                                                                label="Ruta"
                                                                                                margin="dense"
                                                                                                className="form-control"
                                                                                                {...params}
                                                                                                InputProps={{
                                                                                                    ...params.InputProps,
                                                                                                    style: {
                                                                                                        height: 24,
                                                                                                    },
                                                                                                    type: "search",
                                                                                                    disableUnderline: true,
                                                                                                    endAdornment: (
                                                                                                        <InputAdornment
                                                                                                            position="end">
                                                                                                            <IconButton
                                                                                                                padding="0px"
                                                                                                                style={{
                                                                                                                    paddingRight:
                                                                                                                        "0px",
                                                                                                                }}
                                                                                                                onClick={() => {
                                                                                                                    setState({
                                                                                                                        ...state,
                                                                                                                        identificadorModal:
                                                                                                                            "IdRuta",
                                                                                                                        tipoModal: 1,
                                                                                                                        openDialog: true,
                                                                                                                    });
                                                                                                                    getAllViajesOrigenDestino(
                                                                                                                        state
                                                                                                                            .IdCiudadOrigen
                                                                                                                            .m_nIdCiudad,
                                                                                                                        state
                                                                                                                            .IdCiudadDestino
                                                                                                                            .m_nIdCiudad
                                                                                                                    );
                                                                                                                    getAllGuiasFrom();
                                                                                                                }}
                                                                                                            >
                                                                                                                <PageviewIcon
                                                                                                                    style={{
                                                                                                                        color:
                                                                                                                            "#F9A03E",
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
                                                                                                    ),
                                                                                                }}
                                                                                            />
                                                                                        </div>
                                                                                    )}
                                                                                />
                                                                            </div>
                                                                        </div>
                                                                    </div>*/}
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>

                                                    <div className="row">
                                                        <div className="col-md-12">
                                                            <div className="widget-wrap">
                                                                <div
                                                                    className="widget-header block-header margin-bottom-0 clearfix">
                                                                    <div className="pull-left">
                                                                        <h3>Asignar a un Viaje</h3>
                                                                    </div>
                                                                </div>
                                                                <div className="widget-container">
                                                                    <div className="widget-content">
                                                                        <div className="row">
                                                                            <div className="col-md-12">
                                                                                <form
                                                                                    action="#"
                                                                                    className="j-forms"
                                                                                    noValidate
                                                                                >
                                                                                    <div className="form-content">
                                                                                        {/*****************************************Viaje*************************************************/}
                                                                                        <div className="row">
                                                                                            <div
                                                                                                className="col-sm-12 col-md-6 unit">

                                                                                                <label
                                                                                                    className="input select">
                                                                                                    <FormControl
                                                                                                        fullWidth
                                                                                                        variant="outlined"
                                                                                                        margin="dense">
                                                                                                        <InputLabel
                                                                                                            id="viajeLabel">Viaje</InputLabel>
                                                                                                        <Select
                                                                                                            labelId="viajeLabel"
                                                                                                            label="Viaje"
                                                                                                            className="form-control"
                                                                                                            required
                                                                                                            id="viaje"
                                                                                                            //onSelect={handleSelectViaje()}
                                                                                                        >
                                                                                                            <option
                                                                                                                value="0">
                                                                                                                Seleccionar
                                                                                                            </option>
                                                                                                            {/*  {dataViajes.map((viaje) => (
                                                      <option
                                                        key={viaje.m_nIdViaje}
                                                        value={viaje.m_nIdViaje}
                                                      >
                                                        {viaje.m_sFolioViaje}
                                                      </option>
                                                    ))} */}
                                                                                                        </Select>
                                                                                                    </FormControl>
                                                                                                </label>
                                                                                            </div>

                                                                                            {/*****************************************Ruta2*************************************************/}
                                                                                            <div
                                                                                                className="col-sm-12 col-md-6 unit">

                                                                                                <div className="input">
                                                                                                    <TextField
                                                                                                        variant="outlined"
                                                                                                        margin="dense"
                                                                                                        label="Ruta"
                                                                                                        className="form-control"
                                                                                                        type="text"
                                                                                                        value={state.ruta2}
                                                                                                        id="ruta2"
                                                                                                    />
                                                                                                </div>
                                                                                            </div>
                                                                                        </div>

                                                                                        {/*****************************************Operador2*************************************************/}
                                                                                        <div className="row">
                                                                                            <div
                                                                                                className="col-sm-12 col-md-12 unit">

                                                                                                <div className="input">
                                                                                                    <TextField
                                                                                                        variant="outlined"
                                                                                                        margin="dense"
                                                                                                        label="Operador"
                                                                                                        className="form-control"
                                                                                                        type="text"
                                                                                                        value={state.operador2}
                                                                                                        id="operador2"
                                                                                                    />
                                                                                                </div>
                                                                                            </div>

                                                                                            {/*****************************************Unidad2*************************************************/}
                                                                                            <div
                                                                                                className="col-sm-12 col-md-6 unit">
                                                                                                <div className="input">
                                                                                                    <TextField
                                                                                                        variant="outlined"
                                                                                                        margin="dense"
                                                                                                        label="Unidad"
                                                                                                        className="form-control"
                                                                                                        type="text"
                                                                                                        value={state.unidad2}
                                                                                                        id="unidad2"
                                                                                                    />
                                                                                                </div>
                                                                                            </div>
                                                                                        </div>

                                                                                        {/*****************************************Remolque2*************************************************/}
                                                                                        <div className="row">
                                                                                            <div
                                                                                                className="col-sm-12 col-md-6 unit">

                                                                                                <div className="input">
                                                                                                    <Autocomplete
                                                                                                        freeSolo
                                                                                                        value={state.IdRemolque2}
                                                                                                        onChange={(event, newValue) =>
                                                                                                            setState({
                                                                                                                ...state,
                                                                                                                IdRemolque2: newValue,
                                                                                                            })
                                                                                                        }
                                                                                                        id="IdRemolque2Viaje"
                                                                                                        disableClearable
                                                                                                        forcePopupIcon={false}
                                                                                                        options={dataUnidades.filter((g) => g.m_nIdTipoUnidad === 12 || g.m_nIdTipoUnidad === 30)}
                                                                                                        getOptionLabel={(option) =>
                                                                                                            option ? `${option.m_sCodigo} - ${option.m_sDescripcion}` : ""
                                                                                                        }
                                                                                                        variant="outlined"
                                                                                                        style={{
                                                                                                            transform: "translate(14px, 10px) scale(1) !important"
                                                                                                        }}
                                                                                                        renderInput={(params) => (
                                                                                                            <div>
                                                                                                                <TextField
                                                                                                                    variant="outlined"
                                                                                                                    label="Remolque 2"
                                                                                                                    margin="dense"
                                                                                                                    className="form-control"
                                                                                                                    {...params}
                                                                                                                    InputProps={{
                                                                                                                        ...params.InputProps,
                                                                                                                        style: {
                                                                                                                            height: 24,
                                                                                                                        },
                                                                                                                        type: "search",
                                                                                                                        disableUnderline: true,
                                                                                                                        endAdornment: (
                                                                                                                            <InputAdornment
                                                                                                                                position="end">
                                                                                                                                <IconButton
                                                                                                                                    padding="0px"
                                                                                                                                    style={{
                                                                                                                                        paddingRight:
                                                                                                                                            "0px",
                                                                                                                                    }}
                                                                                                                                    onClick={() => {
                                                                                                                                        setState({
                                                                                                                                            ...state,
                                                                                                                                            identificadorModal:
                                                                                                                                                "IdRemolque2",
                                                                                                                                            tipoModal: 4,
                                                                                                                                            openDialog: true,
                                                                                                                                        });
                                                                                                                                    }}
                                                                                                                                >
                                                                                                                                    <PageviewIcon
                                                                                                                                        style={{
                                                                                                                                            color:
                                                                                                                                                "#F9A03E",
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
                                                                                                                        ),
                                                                                                                    }}
                                                                                                                />
                                                                                                            </div>
                                                                                                        )}
                                                                                                    />
                                                                                                </div>
                                                                                            </div>
                                                                                        </div>
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
                                        </div>
                                    </div>
                                    <div className="col-md-6">
                                        <div className="widget-wrap">
                                            <div className="widget-header block-header margin-bottom-0 clearfix">
                                                <div className="pull-left">
                                                    <h3>Detalles de Guias</h3>
                                                </div>
                                            </div>
                                            <div className="widget-container">
                                                <div className="widget-content">
                                                    <div className="row">
                                                        <div className="col-md-12">
                                                            {dataGuias.length !== 0 &&
                                                            <form className="j-forms" noValidate>
                                                                <div className="form-content">
                                                                    <div style={{
                                                                        padding: "10px",
                                                                        maxHeight: "500px",
                                                                        overflow: "scroll"
                                                                    }}>
                                                                        {dataGuias.map((value, index) => {
                                                                            return (
                                                                                <div>
                                                                                    <br/>
                                                                                    <ButtonBase
                                                                                        style={{
                                                                                            width: "100%",
                                                                                            borderRadius: "10px",
                                                                                        }}
                                                                                        onClick={() => selectGuia(index)}
                                                                                    >
                                                                                        <Grid container spacing={2}>
                                                                                            <Grid
                                                                                                item
                                                                                                sm={1}
                                                                                                justify="center"
                                                                                                alignItems="center"
                                                                                                style={{
                                                                                                    display: "flex",
                                                                                                    justifyContent: "center",
                                                                                                    alignItems: "center",
                                                                                                    textAlign: "center",
                                                                                                    backgroundColor: value.select
                                                                                                        ? "#F9A03E"
                                                                                                        : "gray",
                                                                                                }}
                                                                                            >
                                                                                                {index + 1}
                                                                                            </Grid>
                                                                                            <Grid
                                                                                                item
                                                                                                sm={11}
                                                                                                style={{
                                                                                                    width: "100%",
                                                                                                    borderRadius: "10px",
                                                                                                }}
                                                                                            >
                                                                                                <Grid container
                                                                                                      spacing={2}>
                                                                                                    <Grid item sm={12}
                                                                                                          md={4}>
                                                                                                        <div
                                                                                                            className="input">

                                                                                                            <TextField
                                                                                                                variant="outlined"
                                                                                                                margin="dense"
                                                                                                                label="Folio Guía"
                                                                                                                onChange={handleChange}
                                                                                                                value={value.m_nFolioGuia}
                                                                                                                className="form-control"
                                                                                                                type="text"
                                                                                                                disabled="true"
                                                                                                                id={"folio-" + index}
                                                                                                            />
                                                                                                        </div>
                                                                                                    </Grid>
                                                                                                    <Grid item sm={12}
                                                                                                          md={4}>
                                                                                                        <div
                                                                                                            className="input">

                                                                                                            <TextField
                                                                                                                variant="outlined"
                                                                                                                margin="dense"
                                                                                                                label="Estatus Guía"
                                                                                                                className="form-control"
                                                                                                                type="text"
                                                                                                                disabled="true"
                                                                                                                value={
                                                                                                                    value.m_sEstatusGuia
                                                                                                                }
                                                                                                                id={"estatus-" + index}
                                                                                                            />
                                                                                                        </div>
                                                                                                    </Grid>
                                                                                                    <Grid item sm={12}
                                                                                                          md={4}>
                                                                                                        <div
                                                                                                            className="input">

                                                                                                            <TextField
                                                                                                                variant="outlined"
                                                                                                                margin="dense"
                                                                                                                label="Total"
                                                                                                                value={dataGuias[index].m_arClsGuiaConceptos.reduce((a, b) => +a + +b.m_cTotal, 0)}
                                                                                                                disabled="true"
                                                                                                                className="form-control"
                                                                                                                type="text"
                                                                                                                id={"total-" + index}
                                                                                                            />
                                                                                                        </div>
                                                                                                    </Grid>
                                                                                                    <Grid item sm={12}
                                                                                                          md={6}>
                                                                                                        <div
                                                                                                            className="input">

                                                                                                            <TextField
                                                                                                                variant="outlined"
                                                                                                                margin="dense"
                                                                                                                label="Destino"
                                                                                                                value={value.m_sCiudadDestino}
                                                                                                                className="form-control"
                                                                                                                type="text"
                                                                                                                disabled="true"
                                                                                                                id={"destino-" + index}
                                                                                                            />
                                                                                                        </div>
                                                                                                    </Grid>
                                                                                                    <Grid item sm={12}
                                                                                                          md={6}>
                                                                                                        <div
                                                                                                            className="input">

                                                                                                            <TextField
                                                                                                                variant="outlined"
                                                                                                                margin="dense"
                                                                                                                label="Tipo de Servicio"
                                                                                                                disabled="true"
                                                                                                                value={value.m_sTipoServicio}
                                                                                                                className="form-control"
                                                                                                                type="text"
                                                                                                                id={"servicio-" + index}
                                                                                                            />
                                                                                                        </div>
                                                                                                    </Grid>
                                                                                                    <Grid item sm={12}
                                                                                                          md={12}>
                                                                                                        <div
                                                                                                            className="input">

                                                                                                            <TextField
                                                                                                                variant="outlined"
                                                                                                                margin="dense"
                                                                                                                label="Observaciones"
                                                                                                                disabled="true"
                                                                                                                value={
                                                                                                                    value.m_sObservaciones
                                                                                                                }
                                                                                                                className="form-control"
                                                                                                                type="text"
                                                                                                                id={
                                                                                                                    "observacion-" + index
                                                                                                                }
                                                                                                            />
                                                                                                        </div>
                                                                                                    </Grid>
                                                                                                </Grid>
                                                                                            </Grid>
                                                                                        </Grid>
                                                                                    </ButtonBase>
                                                                                    <br/>
                                                                                </div>
                                                                            );
                                                                        })}
                                                                    </div>
                                                                    <br/>
                                                                    <Grid
                                                                        container
                                                                        style={{
                                                                            borderStyle: "solid",
                                                                            borderRadius: "10px",
                                                                        }}
                                                                        spacing={1}
                                                                    >
                                                                        <Grid
                                                                            item
                                                                            sm={4}
                                                                            justify="center"
                                                                            alignItems="center"
                                                                            style={{
                                                                                display: "flex",
                                                                                justifyContent: "center",
                                                                                alignItems: "center",
                                                                                textAlign: "center",
                                                                            }}
                                                                        >
                                                                            Total de guías :{" "}
                                                                            {dataGuias.filter((g) => g.select).length}
                                                                        </Grid>
                                                                        <Grid
                                                                            item
                                                                            sm={8}
                                                                            style={{
                                                                                justifyContent: "left",
                                                                                alignItems: "left",
                                                                                textAlign: "left",
                                                                            }}
                                                                        >
                                                                            <Grid container>
                                                                                {/*<Grid
                                                                                    item
                                                                                    sm={6}
                                                                                    style={{
                                                                                        justifyContent: "left",
                                                                                        alignItems: "left",
                                                                                        textAlign: "left",
                                                                                    }}
                                                                                >
                                                                                    Total Por Cobrar Destinatario
                                                                                </Grid>
                                                                                <Grid
                                                                                    item
                                                                                    sm={6}
                                                                                    style={{
                                                                                        justifyContent: "right",
                                                                                        alignItems: "right",
                                                                                        textAlign: "right",
                                                                                    }}
                                                                                >
                                                                                    ${dataGuias.filter((g) => g.select && g.m_nIdTIpoCobro === 3).length == 0 && 0}{dataGuias.filter((g) => g.select && g.m_nIdTIpoCobro === 3).length != 0 && dataGuias.filter((g) => g.select && g.m_nIdTIpoCobro === 3).reduce((accumulator, curr) => +accumulator + +(curr.m_arClsGuiaConceptos.length !== 0 ? curr.m_arClsGuiaConceptos.reduce((a, b) => +a + +b.m_cTotal, 0) : 0), 0)}
                                                                                </Grid>*/}
                                                                                {/*<Grid
                                                                                    item
                                                                                    sm={6}
                                                                                    style={{
                                                                                        justifyContent: "left",
                                                                                        alignItems: "left",
                                                                                        textAlign: "left",
                                                                                    }}
                                                                                >
                                                                                    Total Por Cobrar Remitente
                                                                                </Grid>
                                                                                <Grid
                                                                                    item
                                                                                    sm={6}
                                                                                    style={{
                                                                                        justifyContent: "right",
                                                                                        alignItems: "right",
                                                                                        textAlign: "right",
                                                                                    }}
                                                                                >
                                                                                    ${dataGuias.filter((g) => g.select && g.m_nIdTIpoCobro === 5).length == 0 && 0}{dataGuias.filter((g) => g.select && g.m_nIdTIpoCobro === 5).length != 0 && dataGuias.filter((g) => g.select && g.m_nIdTIpoCobro === 5).reduce((accumulator, curr) => +accumulator + +(curr.m_arClsGuiaConceptos.length !== 0 ? curr.m_arClsGuiaConceptos.reduce((a, b) => +a + +b.m_cTotal, 0) : 0), 0)}
                                                                                </Grid>*/}
                                                                                {/*<Grid*/}
                                                                                {/*    item*/}
                                                                                {/*    sm={6}*/}
                                                                                {/*    style={{*/}
                                                                                {/*        justifyContent: "left",*/}
                                                                                {/*        alignItems: "left",*/}
                                                                                {/*        textAlign: "left",*/}
                                                                                {/*    }}*/}
                                                                                {/*>*/}
                                                                                {/*    Total Pagado en Mostrador*/}
                                                                                {/*</Grid>*/}
                                                                                {/*<Grid*/}
                                                                                {/*    item*/}
                                                                                {/*    sm={6}*/}
                                                                                {/*    style={{*/}
                                                                                {/*        justifyContent: "right",*/}
                                                                                {/*        alignItems: "right",*/}
                                                                                {/*        textAlign: "right",*/}
                                                                                {/*    }}*/}
                                                                                {/*>*/}
                                                                                {/*    ${dataGuias.filter((g) => g.select && g.m_nIdTIpoCobro === 2).length == 0 && 0}{dataGuias.filter((g) => g.select && g.m_nIdTIpoCobro === 2).length != 0 && dataGuias.filter((g) => g.select && g.m_nIdTIpoCobro === 2).reduce((accumulator, curr) => +accumulator + +(curr.m_arClsGuiaConceptos.length !== 0 ? curr.m_arClsGuiaConceptos.reduce((a, b) => +a + +b.m_cTotal, 0) : 0), 0)}*/}
                                                                                {/*</Grid>*/}

                                                                                {/*    <Grid
                                                                                    item
                                                                                    sm={6}
                                                                                    style={{
                                                                                        justifyContent: "left",
                                                                                        alignItems: "left",
                                                                                        textAlign: "left",
                                                                                    }}
                                                                                >
                                                                                    Total Unidad Completa
                                                                                </Grid>
                                                                                <Grid
                                                                                    item
                                                                                    sm={6}
                                                                                    style={{
                                                                                        justifyContent: "right",
                                                                                        alignItems: "right",
                                                                                        textAlign: "right",
                                                                                    }}
                                                                                >
                                                                                    ${dataGuias.filter((g) => g.select && g.m_nIdTIpoCobro === 7).length == 0 && 0}{dataGuias.filter((g) => g.select && g.m_nIdTIpoCobro === 7).length != 0 && dataGuias.filter((g) => g.select && g.m_nIdTIpoCobro === 7).reduce((accumulator, curr) => +accumulator + +(curr.m_arClsGuiaConceptos.length !== 0 ? curr.m_arClsGuiaConceptos.reduce((a, b) => +a + +b.m_cTotal, 0) : 0), 0)}
                                                                                </Grid>*/}
                                                                                <Grid
                                                                                    item
                                                                                    sm={6}
                                                                                    style={{
                                                                                        justifyContent: "left",
                                                                                        alignItems: "left",
                                                                                        textAlign: "left",
                                                                                    }}
                                                                                >
                                                                                    <b style={{fontWeight: "bold"}}>
                                                                                        Total Flete
                                                                                    </b>
                                                                                </Grid>
                                                                                <Grid
                                                                                    item
                                                                                    sm={6}
                                                                                    style={{
                                                                                        justifyContent: "right",
                                                                                        alignItems: "right",
                                                                                        textAlign: "right",
                                                                                    }}
                                                                                >
                                                                                    ${dataGuias.filter((g) => g.select).length == 0 && 0}{dataGuias.filter((g) => g.select).length != 0 && dataGuias.filter((g) => g.select).reduce((accumulator, curr) => +accumulator + +(curr.m_arClsGuiaConceptos.length !== 0 ? curr.m_arClsGuiaConceptos.reduce((a, b) => +a + +b.m_cTotal, 0) : 0), 0)}
                                                                                </Grid>
                                                                            </Grid>
                                                                        </Grid>
                                                                    </Grid>
                                                                </div>
                                                            </form>
                                                            }

                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="form-footer" className="col-md-12">
                                    <button
                                        type="button"
                                        onClick={(event) => {
                                            event.stopPropagation();
                                            setState({...state, agregar: "Agregar"});
                                            $('.nav-tabs li ').removeClass('active');
                                            $('.nav-tabs li').eq(0).addClass('active');
                                            $('.tab-content div ').removeClass('in show');
                                            $('#Listado').addClass('in show');
                                        }}
                                        className="btn btn-secondary secondary-btn"
                                    >
                                        Cancelar
                                    </button>
                                    <button
                                        type="submit"
                                        className="btn btn-primary primary-btn"
                                        disabled={state.agregar == "Consultar"}
                                    >
                                        Aceptar
                                    </button>
                                    {
                                        state.cubicar &&
                                        <div>
                                            {state.indexCubicar + 1} de {informes.length}
                                        </div>
                                    }

                                </div>
                            </form>
                        </div>
                        <div id="Cancelar" className="tab-pane fade">
                            <div className="widget-wrap">
                                <div className="widget-container">
                                    <div className="widget-content">
                                        <div className="row">
                                            <form className="j-forms" onSubmit={handleCancelar}>
                                                <div className="form-content">
                                                    <div className="col-sm-6 col-md-2-5 col-lg-2-5 unit">
                                                        <div className="input">
                                                            <TextField variant="outlined" margin="dense"
                                                                       label="Folio Informes"
                                                                       className="form-control"
                                                                       type="text"
                                                                       value={state.FolioInforme}
                                                                       id="FolioInforme"
                                                                       disabled
                                                            />
                                                        </div>
                                                    </div>

                                                    <div className="col-sm-6 col-md-2-5 col-lg-2-5 unit">
                                                        <div className="input">
                                                            <TextField variant="outlined" margin="dense"
                                                                       label="Sucursal"
                                                                       className="form-control"
                                                                       type="text"
                                                                       value={state.sucursalCancelacion}
                                                                       id="sucursalCancelacion"
                                                                       disabled
                                                            />
                                                        </div>
                                                    </div>

                                                    <div className="col-sm-6 col-md-2-5 col-lg-2-5 unit">
                                                        <div className="input">
                                                            <TextField variant="outlined" margin="dense" label="Fecha"
                                                                       className="form-control"
                                                                       type="text"
                                                                       value={state.fechaCancelacion}
                                                                       id="fechaCancelacion"
                                                                       readOnly
                                                            />
                                                        </div>
                                                    </div>

                                                    <div className="col-sm-6 col-md-2-5 col-lg-2-5 unit">
                                                        <div className="input">
                                                            <TextField variant="outlined" margin="dense" label="Usuario"
                                                                       className="form-control"
                                                                       type="text"
                                                                       value={state.usuarioCancelacion}
                                                                       id="usuarioCancelacion"
                                                                       readOnly
                                                            />
                                                        </div>
                                                    </div>

                                                    <div className="col-sm-6 col-md-2-5 col-lg-2-5 unit">
                                                        <div className="input">
                                                            <TextField variant="outlined" margin="dense" label="Estatus"
                                                                       className="form-control"
                                                                       type="text"
                                                                       value={state.estatusCancelacion}
                                                                       id="estatusCancelacion"
                                                                       readOnly
                                                            />
                                                        </div>
                                                    </div>

                                                    <div className="col-sm-12 col-md-12 col-lg-12 unit">
                                                        <div className="input">
                                                            <TextField variant="outlined" margin="dense" label="Motivo"
                                                                       className="form-control"
                                                                       type="text"
                                                                       value={state.motivoCancelacion}
                                                                       id="motivoCancelacion"
                                                            />
                                                        </div>
                                                    </div>

                                                    <div className="form-footer" className="col-md-12">
                                                        <button
                                                            onClick={(event) => {
                                                                event.stopPropagation();
                                                                setState({...state, agregar: "Agregar"});
                                                                $('.nav-tabs li ').removeClass('active');
                                                                $('.nav-tabs li').eq(0).addClass('active');
                                                                $('.tab-content div ').removeClass('in show');
                                                                $('#Listado').addClass('in show');
                                                            }}
                                                            className="btn btn-secondary secondary-btn"
                                                        >
                                                            Cancelar
                                                        </button>
                                                        <button
                                                            type="submit"
                                                            className="btn btn-primary primary-btn"
                                                        >
                                                            Aceptar
                                                        </button>
                                                    </div>
                                                </div>
                                            </form>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div id="Cubicar" className="tab-pane fade">
                            <div className="widget-wrap">
                                <div className="widget-container">
                                    <div className="widget-content">
                                        <div className="row">
                                            <div className="col-sm-12 col-md-4 col-lg-4 unit">
                                                <form className="j-forms" onSubmit={cubicarAccion}>
                                                    <div className="row">
                                                        <div className="col-sm-12 col-md-12 col-lg-12 unit">
                                                            <div className="input">
                                                                <Autocomplete
                                                                    freeSolo
                                                                    onChange={(event, newValue) =>
                                                                        setState({
                                                                            ...state,
                                                                            IdCiudadOrigen: newValue,
                                                                        })
                                                                    }
                                                                    value={state.IdCiudadOrigen || ""}
                                                                    disabled={state.agregar == "Consultar"}
                                                                    id="IdCiudadOrigen"
                                                                    disableClearable
                                                                    forcePopupIcon={false}
                                                                    options={dataOrigenes}
                                                                    getOptionLabel={(option) => option.m_sCiudad}
                                                                    variant="outlined"
                                                                    style={{
                                                                        transform: "translate(14px, 10px) scale(1) !important"
                                                                    }}
                                                                    renderInput={(params) => (
                                                                        <div>
                                                                            <TextField
                                                                                required
                                                                                variant="outlined"
                                                                                label="Origen"
                                                                                margin="dense"
                                                                                className="form-control"
                                                                                {...params}
                                                                                InputProps={{
                                                                                    ...params.InputProps,
                                                                                    style: {
                                                                                        height: "33px",
                                                                                        fontSize: "14px",
                                                                                    },
                                                                                    type: "search",
                                                                                    disabled: state.agregar == "Consultar",
                                                                                    disableUnderline: true,
                                                                                    endAdornment: (
                                                                                        <InputAdornment position="end">
                                                                                            <IconButton
                                                                                                padding="0px"
                                                                                                style={{
                                                                                                    paddingRight: "0px",
                                                                                                }}
                                                                                                disabled={
                                                                                                    state.agregar == "Consultar"
                                                                                                }
                                                                                                onClick={() => {
                                                                                                    setState({
                                                                                                        ...state,
                                                                                                        identificadorModal:
                                                                                                            "IdCiudadOrigen",
                                                                                                        tipoModal: 1,
                                                                                                        openDialog: true,
                                                                                                    });
                                                                                                }}
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
                                                                                    ),
                                                                                }}
                                                                            />
                                                                        </div>
                                                                    )}
                                                                />
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div className="row">
                                                        <div className="col-sm-12 col-md-12 col-lg-12 unit">
                                                            <div className="input">
                                                                <Autocomplete
                                                                    freeSolo
                                                                    onChange={(event, newValue) =>
                                                                        setState({
                                                                            ...state,
                                                                            IdCiudadDestino: newValue,
                                                                        })
                                                                    }
                                                                    value={state.IdCiudadDestino || ""}
                                                                    disabled={state.agregar == "Consultar"}
                                                                    id="IdCiudadDestino"
                                                                    disableClearable
                                                                    forcePopupIcon={false}
                                                                    options={dataOrigenes}
                                                                    getOptionLabel={(option) => option.m_sCiudad}
                                                                    variant="outlined"
                                                                    style={{
                                                                        transform: "translate(14px, 10px) scale(1) !important"
                                                                    }}
                                                                    renderInput={(params) => (
                                                                        <div>
                                                                            <TextField
                                                                                required
                                                                                variant="outlined"
                                                                                label="Destino"
                                                                                margin="dense"
                                                                                className="form-control"
                                                                                {...params}
                                                                                InputProps={{
                                                                                    ...params.InputProps,
                                                                                    style: {
                                                                                        height: "33px",
                                                                                        fontSize: "14px",
                                                                                    },
                                                                                    type: "search",
                                                                                    value: state.destinoRemitente,
                                                                                    disabled: state.agregar == "Consultar",
                                                                                    disableUnderline: true,
                                                                                    endAdornment: (
                                                                                        <InputAdornment position="end">
                                                                                            <IconButton
                                                                                                padding="0px"
                                                                                                style={{
                                                                                                    paddingRight: "0px",
                                                                                                }}
                                                                                                disabled={
                                                                                                    state.agregar == "Consultar"
                                                                                                }
                                                                                                onClick={() => {
                                                                                                    setState({
                                                                                                        ...state,
                                                                                                        identificadorModal:
                                                                                                            "IdCiudadDestino",
                                                                                                        tipoModal: 1,
                                                                                                        openDialog: true,
                                                                                                    });
                                                                                                }}
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
                                                                                    ),
                                                                                }}
                                                                            />
                                                                        </div>
                                                                    )}
                                                                />
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div className="row">
                                                        <div className="col-sm-12 col-md-12 col-lg-12 unit">
                                                            <div className="input">
                                                                <Autocomplete
                                                                    freeSolo
                                                                    value={state.IdRemolque1 || {}}
                                                                    onChange={(event, newValue) =>
                                                                        setState({
                                                                            ...state,
                                                                            IdRemolque1: newValue,
                                                                        })
                                                                    }
                                                                    id="IdUnidad"
                                                                    disableClearable
                                                                    forcePopupIcon={false}
                                                                    options={dataUnidades.filter((g) => g.m_nIdTipoUnidad === 12 || g.m_nIdTipoUnidad === 30)}
                                                                    getOptionLabel={(option) =>
                                                                        option ? `${option.m_sCodigo} - ${option.m_sDescripcion}` : ""
                                                                    }
                                                                    variant="outlined"
                                                                    style={{
                                                                        transform: "translate(14px, 10px) scale(1) !important"
                                                                    }}
                                                                    renderInput={(params) => (
                                                                        <div>
                                                                            <TextField
                                                                                required
                                                                                variant="outlined"
                                                                                label="Remolque 1"
                                                                                margin="dense"
                                                                                className="form-control"
                                                                                {...params}
                                                                                InputProps={{
                                                                                    ...params.InputProps,
                                                                                    style: {
                                                                                        height: "33px",
                                                                                        fontSize: "14px",
                                                                                    },
                                                                                    type: "search",
                                                                                    disableUnderline: true,
                                                                                    endAdornment: (
                                                                                        <InputAdornment position="end">
                                                                                            <IconButton
                                                                                                padding="0px"
                                                                                                style={{
                                                                                                    paddingRight: "0px",
                                                                                                }}
                                                                                                onClick={() => {
                                                                                                    setState({
                                                                                                        ...state,
                                                                                                        identificadorModal:
                                                                                                            "IdRemolque1",
                                                                                                        tipoModal: 4,
                                                                                                        openDialog: true,
                                                                                                    });
                                                                                                }}
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
                                                                                    ),
                                                                                }}
                                                                            />
                                                                        </div>
                                                                    )}
                                                                />
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div className="row">
                                                        <div className="col-sm-12 col-md-12 col-lg-12 unit">
                                                            <div className="input">
                                                                <Autocomplete
                                                                    freeSolo
                                                                    value={state.IdRemolque2 || ""}
                                                                    onChange={(event, newValue) =>
                                                                        setState({
                                                                            ...state,
                                                                            IdRemolque2: newValue,
                                                                        })
                                                                    }
                                                                    id="remolqueSecundario"
                                                                    disableClearable
                                                                    forcePopupIcon={false}
                                                                    options={dataUnidades.filter((g) => g.m_nIdTipoUnidad === 12 || g.m_nIdTipoUnidad === 30)}
                                                                    getOptionLabel={(option) =>
                                                                        option ? `${option.m_sCodigo} - ${option.m_sDescripcion}` : ""
                                                                    }
                                                                    variant="outlined"
                                                                    style={{
                                                                        transform: "translate(14px, 10px) scale(1) !important"
                                                                    }}
                                                                    renderInput={(params) => (
                                                                        <div>
                                                                            <TextField
                                                                                {...params}
                                                                                variant="outlined"
                                                                                label="Remolque 2"
                                                                                margin="dense"
                                                                                className="form-control"
                                                                                InputProps={{
                                                                                    ...params.InputProps,
                                                                                    style: {
                                                                                        height: "33px",
                                                                                        fontSize: "14px",
                                                                                    },
                                                                                    type: "search",
                                                                                    disableUnderline: true,
                                                                                    endAdornment: (
                                                                                        <InputAdornment position="end">
                                                                                            <IconButton
                                                                                                padding="0px"
                                                                                                style={{
                                                                                                    paddingRight: "0px",
                                                                                                }}
                                                                                                onClick={() => {
                                                                                                    setState({
                                                                                                        ...state,
                                                                                                        identificadorModal:
                                                                                                            "IdRemolque2",
                                                                                                        tipoModal: 4,
                                                                                                        openDialog: true,
                                                                                                    });
                                                                                                }}
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
                                                                                    ),
                                                                                }}
                                                                            />
                                                                        </div>
                                                                    )}
                                                                />
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div className="row">
                                                        <div
                                                            align="center"
                                                            style={{padding: "10px", width: "100%"}}
                                                        >
                                                            <button
                                                                type="submit"
                                                                className="btn btn-primary primary-btn"
                                                                style={{float: "none"}}
                                                            >
                                                                Cubicar
                                                            </button>
                                                        </div>
                                                    </div>
                                                </form>
                                            </div>
                                            <div className="col-sm-12 col-md-4 col-lg-4 unit">
                                                {
                                                    <div
                                                        style={{
                                                            backgroundColor: "#ACACAC",
                                                            minHeight: "400px",
                                                        }}
                                                    >
                                                        <h4 style={{color: "white", padding: "5px"}}>
                                                            Informes: {informes.length}
                                                        </h4>
                                                        {informes.map((i, index) => (
                                                            <div style={{padding: "10px"}}>
                                                                <table
                                                                    style={{
                                                                        backgroundColor: "white",
                                                                        height: "100%",
                                                                        width: "100%",
                                                                        overflow: "scroll",
                                                                    }}
                                                                >
                                                                    <thead>
                                                                    <tr style={{backgroundColor: "#F9A03E"}}>
                                                                        <th tyle={{paddingLeft: "5px"}}>
                                                                            F1-00000{index} - {i[0].destino}
                                                                        </th>
                                                                        <th></th>
                                                                        <th
                                                                            style={{
                                                                                textAlign: "right",
                                                                                paddingRight: "5px",
                                                                            }}
                                                                        >
                                                                            {" "}
                                                                            Guias - {i.length}
                                                                        </th>
                                                                    </tr>
                                                                    </thead>
                                                                    <tr style={{backgroundColor: "#E6E6E6"}}>
                                                                        <th>Guía</th>
                                                                        <th>Destino</th>
                                                                        <th>Paquetes</th>
                                                                    </tr>
                                                                    {i.map((g) => (
                                                                        <tr
                                                                            onClick={() =>
                                                                                setState({...state, guiaSelected: g})
                                                                            }
                                                                        >
                                                                            <td>{g.folio}</td>
                                                                            <td>{g.destino}</td>
                                                                            <td style={{textAlign: "center"}}>
                                                                                {g.paquetes}
                                                                            </td>
                                                                        </tr>
                                                                    ))}
                                                                </table>
                                                            </div>
                                                        ))}
                                                    </div>
                                                }
                                            </div>
                                            <div className="col-sm-12 col-md-4 col-lg-4 unit">
                                                {state.guiaSelected && (
                                                    <div style={{backgroundColor: "#E6E6E6"}}>
                                                        <h4 style={{color: "#717171", padding: "5px"}}>
                                                            Detalles de Guía {state.guiaSelected.folio}
                                                        </h4>
                                                        {state.guiaSelected.arrayPaquetes.map(
                                                            (p, index) => (
                                                                <div
                                                                    style={{color: "#707070", padding: "5px"}}
                                                                >
                                                                    <h4>Paquete {index + 1}</h4>
                                                                    <div className="row">
                                                                        <div
                                                                            className="col-sm-12 col-md-2 col-lg-2 unit"
                                                                            style={{padding: "5px"}}>

                                                                            <div className="input">
                                                                                <TextField variant="outlined"
                                                                                           margin="dense" label="Peso"
                                                                                           style={{backgroundColor: "#FFFFFF"}}
                                                                                           className="form-control"
                                                                                           type="text"
                                                                                           disabled
                                                                                           value={p.m_xPeso}
                                                                                />
                                                                            </div>
                                                                        </div>
                                                                        <div
                                                                            className="col-sm-12 col-md-2 col-lg-2 unit"
                                                                            style={{padding: "5px"}}>

                                                                            <div className="input">
                                                                                <TextField variant="outlined"
                                                                                           margin="dense" label="Largo"
                                                                                           style={{backgroundColor: "#FFFFFF"}}
                                                                                           className="form-control"
                                                                                           type="text"
                                                                                           disabled
                                                                                           value={p.m_xLargo}
                                                                                />
                                                                            </div>
                                                                        </div>
                                                                        <div
                                                                            className="col-sm-12 col-md-2 col-lg-2 unit"
                                                                            style={{padding: "5px"}}>

                                                                            <div className="input">
                                                                                <TextField variant="outlined"
                                                                                           margin="dense" label="Ancho"
                                                                                           style={{backgroundColor: "#FFFFFF"}}
                                                                                           className="form-control"
                                                                                           type="text"
                                                                                           disabled
                                                                                           value={p.m_xAncho}
                                                                                />
                                                                            </div>
                                                                        </div>
                                                                        <div
                                                                            className="col-sm-12 col-md-2 col-lg-2 unit"
                                                                            style={{padding: "5px"}}>

                                                                            <div className="input">
                                                                                <TextField variant="outlined"
                                                                                           margin="dense" label="Alto"
                                                                                           style={{backgroundColor: "#FFFFFF"}}
                                                                                           className="form-control"
                                                                                           type="text"
                                                                                           disabled
                                                                                           value={p.m_xAlto}
                                                                                />
                                                                            </div>
                                                                        </div>
                                                                        <div
                                                                            className="col-sm-12 col-md-3 col-lg-3 unit"
                                                                            style={{padding: "5px"}}>

                                                                            <div className="input">
                                                                                <TextField variant="outlined"
                                                                                           margin="dense"
                                                                                           label="Volumen"
                                                                                           style={{backgroundColor: "#FFFFFF"}}
                                                                                           className="form-control"
                                                                                           type="text"
                                                                                           disabled
                                                                                           value={
                                                                                               p.m_xAlto * p.m_xAlto * p.m_xLargo
                                                                                           }
                                                                                />
                                                                            </div>
                                                                        </div>
                                                                        <div
                                                                            className="col-sm-12 col-md-6 col-lg-3 unit"
                                                                            style={{padding: "5px"}}>

                                                                            <div className="input">
                                                                                <TextField variant="outlined"
                                                                                           margin="dense"
                                                                                           label="Tipo embalaje"
                                                                                           style={{backgroundColor: "#FFFFFF"}}
                                                                                           className="form-control"
                                                                                           type="text"
                                                                                           disabled
                                                                                           value={""}
                                                                                />
                                                                            </div>
                                                                        </div>
                                                                        <div
                                                                            className="col-sm-12 col-md-6 col-lg-3 unit"
                                                                            style={{padding: "5px"}}>

                                                                            <div className="input">
                                                                                <TextField variant="outlined"
                                                                                           margin="dense"
                                                                                           label="Valor Declarado"
                                                                                           style={{backgroundColor: "#FFFFFF"}}
                                                                                           className="form-control"
                                                                                           type="text"
                                                                                           disabled
                                                                                           value={p.m_cValorDeclarado}
                                                                                />
                                                                            </div>
                                                                        </div>
                                                                        <div
                                                                            className="col-sm-12 col-md-12 col-lg-3 unit"
                                                                            style={{padding: "5px"}}>

                                                                            <div className="input">
                                                                                <TextField variant="outlined"
                                                                                           margin="dense"
                                                                                           label="Descripción"
                                                                                           style={{backgroundColor: "#FFFFFF"}}
                                                                                           className="form-control"
                                                                                           type="text"
                                                                                           disabled
                                                                                           value={p.m_sDescripcion}
                                                                                />
                                                                            </div>
                                                                        </div>
                                                                        <div
                                                                            className="col-sm-12 col-md-12 col-lg-3 unit"
                                                                            style={{padding: "5px"}}>

                                                                            <div className="input">
                                                                                <TextField variant="outlined"
                                                                                           margin="dense" label="Ctd"
                                                                                           style={{backgroundColor: "#FFFFFF"}}
                                                                                           className="form-control"
                                                                                           type="text"
                                                                                           disabled
                                                                                           value={p.ctd}
                                                                                />
                                                                            </div>
                                                                        </div>
                                                                        <div className="col-sm-12 col-md-12 unit"
                                                                             style={{padding: "5px"}}>

                                                                            <div className="input">
                                                                                <TextField variant="outlined"
                                                                                           margin="dense"
                                                                                           label="Observaciones"
                                                                                           style={{backgroundColor: "#FFFFFF"}}
                                                                                           className="form-control"
                                                                                           type="text"
                                                                                           disabled
                                                                                           value={p.m_sObservaciones}
                                                                                />
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            )
                                                        )}
                                                    </div>
                                                )}
                                            </div>
                                            <div
                                                className="form-footer"
                                                className="col-md-12"
                                                style={{padding: "10px"}}
                                                align="center"
                                            >
                                                <button
                                                    onClick={(event) => {
                                                        event.stopPropagation();
                                                        setState({...state, agregar: "Agregar", cubicar: true});
                                                        $('.nav-tabs li ').removeClass('active');
                                                        $('.nav-tabs li').eq(1).addClass('active');
                                                        $('.tab-content div ').removeClass('in show');
                                                        $('#Agregar').addClass('in show');
                                                        showAgregarFromCubicar(0);
                                                    }}
                                                    className="btn btn-primary primary-btn"
                                                    style={{margin: "10px"}}
                                                >
                                                    Aceptar
                                                </button>

                                                <button
                                                    onClick={(event) => {
                                                        event.stopPropagation();
                                                        setState({...state, agregar: "Agregar", guias: []});
                                                        $('.nav-tabs li ').removeClass('active');
                                                        $('.nav-tabs li').eq(0).addClass('active');
                                                        $('.tab-content div ').removeClass('in show');
                                                        $('#Listado').addClass('in show');
                                                    }}
                                                    className="btn btn-secondary primary-btn"
                                                    style={{margin: "10px"}}
                                                >
                                                    Cancelar
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
}

export default Informes;
