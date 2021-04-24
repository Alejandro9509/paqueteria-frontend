import React, { useEffect, useState, setData, useMemo, Component } from "react";
import { cubicarGuias, remove_array_element } from "../Util/Util";
import {
  ButtonBase,
  Checkbox,
  Dialog,
  DialogActions,
  DialogContent,
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
} from "@material-ui/core";

import { trackPromise } from "react-promise-tracker";

import DataTable from "react-data-table-component";
import $ from "jquery";
import { useTable, useFilters, useSortBy } from "react-table";
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
import { makeStyles } from "@material-ui/core/styles";
import * as XLSX from "xlsx";
import { render } from "react-dom";
import SearchIcon from "@material-ui/icons/Search";
import { DataGrid } from "@material-ui/data-grid";
import Noty from "noty";

function showSuccess(mensaje) {
  new Noty({
    type: "information",
    layout: "topCenter",
    text: mensaje,
    timeout: "3000",
  }).show();
}

const stylesInformes = {
  InformeCarrusel: {
    height: "900px !important",
  },
  sobreCarrusel: {
    height: "150px !important",
  },
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
  root: {
    "& .super-app-theme--cell": {
      backgroundColor: "rgba(224, 183, 60, 0.55)",
      color: "#1a3e72",
      fontWeight: "600",
    },
    "& .super-app.esRecolecta": {
      backgroundColor: "green",
    },
    "& .super-app.noRecolecta": {
      backgroundColor: "red",
    },
  },
};

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
const useInformeStyles = makeStyles(stylesInformes);

window.jQuery = window.$ = $;
const headers = {
  "Content-Type": "application/json",
};
let timer;

function Informes({ history }) {
  const classes = useStyles();
  const classesInforme = useInformeStyles();
  const [stepActive, setStepActive] = React.useState(1);
  const [data, setData] = React.useState([]);
  const [dataRutas, setDataRutas] = React.useState([]);
  const [guias, setGuias] = React.useState([]);
  const [informes, setInformes] = React.useState([]);
  const [dataTipoUnidad, setDataTipoUnidad] = React.useState([]);
  const [dataSucursal, setDataSucursal] = React.useState([]);
  const [dataEstatusInformes, setEstatusInformes] = React.useState([]);
  const [dataOperadores, setDataOperadores] = React.useState([]);
  const [dataOrigenes, setDataOrigenes] = React.useState([]);
  const [dataUnidades, setDataUnidades] = React.useState([]);
  const [dataGuias, setDataGuias] = React.useState([]);
  const [dataViajes, setDataViajes] = React.useState([]);
  const [dataGuiasCubicar, setDataGuiasCubicar] = React.useState([]);

  function getAllDataRutas() {
    const url = `${process.env.REACT_APP_API_URL}/Rutas/GetListado`;
    axios.get(url, { headers }).then((respuesta) => {
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
      field: "",
      renderCell: (row) => {
        return (
          <div>
            <a
              href="#Agregar"
              role="tab"
              data-toggle="tab"
              onClick={() => handleShowModificar(row.row.m_nIdInforme)}
              className="btn btn-default btn-xs"
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
              className="btn btn-default btn-xs"
              onClick={() => handleShowModificar(row.row.m_nIdInforme)}
            >
              <i className="fa fa-eye" style={{ color: "#F9A03E" }} />
            </a>
            <a
              href="#"
              className="btn btn-default btn-xs"
              onClick={() => handleEliminar(row.row.m_nIdInforme)}
            >
              <i className="zmdi zmdi-delete" style={{ color: "#F30B0B" }} />
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
    const url = `${process.env.REACT_APP_API_URL}/Guia/GetListado`;
    axios.get(url, { headers }).then((respuesta) => {
      setGuias(respuesta.data);
    });
  }

  function handleSelectViaje() {
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
    console.log(id);
    console.log(state.identificadorModal);
  }

  const columns2 = React.useMemo(() => [
    {
      Name: "Folio/Serie",
      accessor: "m_nFolioInforme",
    },
    {
      Name: "Fecha/Hora Elaboración",
      accessor: "m_dFecha",
    },
    {
      Name: "Viaje",
      accessor: "m_nIdViaje",
    },
    {
      Name: "Oficina Emisora",
      accessor: "m_sSucursalEmisora",
    },
    {
      Name: "Oficina Receptora",
      accessor: "m_sSucursalReceptora",
    },
    {
      Name: "Operador",
      accessor: "m_sNombreCompleto",
    },
    {
      Name: "Unidad",
      accessor: "m_sCodigoUnidad",
    },
  ]);

  const columnsCP = React.useMemo(() => [
    {
      Name: "Codigo",
      accessor: "m_sCP",
    },
    {
      Name: "Estado",
      accessor: "m_sEstado",
    },
    {
      Name: "Ciudad",
      accessor: "m_sCiudad",
    },
  ]);

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

  const columnsTipoUnidades = React.useMemo(() => [
    {
      Name: "Tipo de unidad",
      accessor: "m_nIdTipoUnidad",
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
      <div
        className="col-md-12"
        style={{ overflowX: "scroll", height: "100%" }}
      >
        <table className="table  tabla-listado" {...getTableProps()}>
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
                <tr
                  {...row.getRowProps()}
                  onClick={handleSelectRow.bind(
                    this,
                    row.original.m_nIdInforme
                  )}
                  className={
                    state.IdInforme === row.original.m_nIdInforme
                      ? classes.seleccionado
                      : classes.noSeleccionado
                  }
                >
                  <td>
                    <div>
                      <a
                        href="#Agregar"
                        role="tab"
                        data-toggle="tab"
                        onClick={() =>
                          handleShowModificar(row.original.m_nIdInforme)
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
                          handleShowModificar(row.original.m_nIdInforme)
                        }
                      >
                        <i className="fa fa-eye" style={{ color: "#F9A03E" }} />
                      </a>

                      <a
                        href="#"
                        className="btn btn-default btn-sm"
                        onClick={() =>
                          handleEliminar(row.original.m_nIdInforme)
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

  function TableOperadores({ columns, data, select }) {
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
        style={{ maxHeight: "300px", overflow: "auto" }}
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
                <tr
                  style={{
                    backgroundColor:
                      row.original.m_nIdOperador === select
                        ? "#FCC88F"
                        : "white",
                  }}
                  {...row.getRowProps()}
                  onClick={handleSelectCP.bind(this, row.original)}
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
                          style={{ color: "#F9A03E" }}
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
                          style={{ color: "#F30B0B" }}
                        />
                      </a>
                      <a
                        href="#"
                        className="btn btn-default btn-sm m-user-delete"
                        onClick={() =>
                          handleEliminar(row.original.m_nIdRecoleccion)
                        }
                      >
                        <i className="fa fa-eye" style={{ color: "#F9A03E" }} />
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

  const headers2 = {
    "Content-Type": "application/json",
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  };

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
    fechaHora: "",
    DerechoBorrar: 151,
    EstatusInforme: 0,
    IdViaje: {},
    sucursalEmisora: 0,
    sucursalReceptora: 0,
    IdOperador: {},
    IdRemolque1: {},
    IdRemolque2: {},
    PlacasRemolque1: "",
    PlacasRemolque2: "",
    IdTipoUnidad: {},
    IdCiudadDestino: {},
    IdCiudadOrigen: {},
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
      m_nIdRemolque2: state.IdRemolque2.m_nIdUnidad,
      m_sPlacasRemolque1: state.PlacasRemolque1,
      m_sPlacasRemolque2: state.PlacasRemolque2,
      m_nIdRuta: state.idRuta.m_nIdRuta,
      m_nIdSucursalEmisora: state.sucursalEmisora,
      m_nIdSucursalReceptora: state.sucursalReceptora,
      m_nIdTipoUnidad: state.IdTipoUnidad.m_nIdTipoUnidad,
      m_nIdViaje: state.IdViaje.m_nIdViaje,
      TotalxCDestinatario: 0,
      TotalxCCobrarRemitente: 0,
      TotalPagoMostrador: 0,
      TotalUnidadCompleta: 0,
      TotalGeneral: 0,
      m_nCreadoPor: state.CreadoPor,
      m_arrClsProInformeGuia: dataGuias,
    };
    console.log(JSON.stringify(params));
    //debugger;
    if (state.IdInforme != 0) {
      const url = `${process.env.REACT_APP_API_URL}/Informes/Modificar/${state.IdInforme}`;
      axios
        .put(url, Object.assign({}, params), { headers2 })
        .then((respuesta) => {
          showSuccess(respuesta.data);
          getAllData();
        })
        .catch((err) => {
          console.log(err);
          showSuccess("El Usuario no tiene derecho para modificar");
        });
    } else {
      const url = `${process.env.REACT_APP_API_URL}/Informes/Agregar`;
      axios
        .post(url, Object.assign({}, params), { headers })
        .then((respuesta) => {
          showSuccess(respuesta.data);
          console.log(respuesta.data);
          getAllData();
        })
        .catch((err) => {
          console.log(err);
          showSuccess(err);
        });
    }
  };

  function TableCiudades({ columns, data, select }) {
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
        style={{ maxHeight: "300px", overflow: "auto" }}
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

  function TableOperadores({ columns, data, select }) {
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
        style={{ maxHeight: "300px", overflow: "auto" }}
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
                <tr
                  style={{
                    backgroundColor:
                      row.original.m_nIdOperador === select
                        ? "#FCC88F"
                        : "white",
                  }}
                  {...row.getRowProps()}
                  onClick={handleSelectCP.bind(this, row.original)}
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
                          style={{ color: "#F9A03E" }}
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
                          style={{ color: "#F30B0B" }}
                        />
                      </a>
                      <a
                        href="#"
                        className="btn btn-default btn-sm m-user-delete"
                        onClick={() =>
                          handleEliminar(row.original.m_nIdRecoleccion)
                        }
                      >
                        <i className="fa fa-eye" style={{ color: "#F9A03E" }} />
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
                <tr
                  style={{
                    backgroundColor:
                      row.original.m_nIdTipoUnidad === select
                        ? "#FCC88F"
                        : "white",
                  }}
                  {...row.getRowProps()}
                  onClick={handleSelectCP.bind(this, row.original)}
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
                          style={{ color: "#F9A03E" }}
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
                          style={{ color: "#F30B0B" }}
                        />
                      </a>
                      <a
                        href="#"
                        className="btn btn-default btn-sm m-user-delete"
                        onClick={() =>
                          handleEliminar(row.original.m_nIdRecoleccion)
                        }
                      >
                        <i className="fa fa-eye" style={{ color: "#F9A03E" }} />
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
  function TableUnidad({ columns, data, select }) {
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
        style={{ maxHeight: "300px", overflow: "auto" }}
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
  function addInformeGuia() {
    const { Informes } = state;
    Informes.push({
      ruta2: "",
      operador2: "",
      unidad2: "",
      remolque2: "",
      viaje: {},
      tipoModal: 0,
      IdInforme: 0,
      FolioInforme: 0,
      fechaHoraLlegada: "",
      DerechoBorrar: 151,

      IdEstatusInforme: 0,
      IdViaje: 0,
      IdSucursalEmisora: 0,
      IdSucursalReceptora: 0,
      IdOperador: {},
      IdUnidad: {},
      IdTipoUnidad: {},
      IdRemolque: 0,
      IdCiudadDestino: 0,
      IdCiudadOrigen: 0,
      IdRuta: 0,
      usuarioCancelacion: "",
      estatusCancelacion: "",
      IdSucursal: localStorage.getItem("Sucursal"),
      agregar: "Agregar",
      height: window.innerHeight,
      CreadoPor: localStorage.getItem("UsuarioId"),
      ModificadoPor: localStorage.getItem("UsuarioId"),
      Guias: [
        {
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
    });
    setState({ ...state, Informes: Informes });
  }

  function removeInformeGuia(index) {
    var { Informes } = state;
    Informes = remove_array_element(Informes, index);
    setState({ ...state, Informes: Informes });
  }

  const handleChangeInformeGuia = (event, index) => {
    var { Informes } = state;
    Informes[index][event.target.name] = event.target.value;
    setState({
      ...state,
      Informes: Informes,
    });
  };

  const selectGuia = (index) => {
    const newGuia = [...dataGuias];

    newGuia[index]["select"] = newGuia[index].select ? false : true;
    setDataGuias(newGuia);
  };

  function handleSelectRow(id, event) {
    setState({
      ...state,
      IdInforme: id,
    });
  }

  function handleShowCancelar() {
    const url = `${process.env.REACT_APP_API_URL}/Informes/GetById/${state.IdInforme}`;
    var today = new Date();
    axios.get(url, { headers }).then((respuesta) => {
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
    const url = `${process.env.REACT_APP_API_URL}/Informes/Cancelar/${state.IdInforme}`;
    axios.put(url, Object.assign({}, params), { headers }).then((respuesta) => {
      console.log(respuesta.data);
    });
  };

  function getAllGuiasFrom(cubicar) {
    console.log("hola");
    const url = !cubicar
      ? `${process.env.REACT_APP_API_URL}/Guia/GetListadoPendientes/` +
        state.IdCiudadOrigen.m_nIdCiudad +
        "/" +
        state.IdCiudadDestino.m_nIdCiudad
      : `${process.env.REACT_APP_API_URL}/Guia/GetListado`;

    trackPromise(
      axios.get(url, { headers }).then(async (respuesta) => {
        setDataGuias(respuesta.data);
        if (cubicar) {
          let array = await cubicarGuias(
            respuesta.data,
            state.IdCiudadOrigen,
            state.IdCiudadDestino,
            state.IdUnidad,
            state.remolqueSecundario
          );
          setInformes(array);
        }
      })
    );
  }

  function getAllCiudades() {
    const url = `${process.env.REACT_APP_API_URL}/Ciudades/GetListado`;
    axios.get(url, { headers }).then((respuesta) => {
      setDataOrigenes(respuesta.data);
    });
  }

  function getAllTipoUnidad() {
    const url = `${process.env.REACT_APP_API_URL}/TiposUnidades/GetListado`;
    axios.get(url, { headers }).then((respuesta) => {
      setDataTipoUnidad(respuesta.data);
      getAllUnidades(respuesta.data[0].m_nIdTipoUnidad);
    });
  }

  async function getAllUnidades(id) {
    const url = `${process.env.REACT_APP_API_URL}/Unidades/ByTipoUnidad/${id}`;
    await axios.get(url, { headers }).then((respuesta) => {
      setDataUnidades(respuesta.data);
    });
  }

  function getAllOperadores() {
    const url = `${process.env.REACT_APP_API_URL}/Operadores/GetListado`;
    axios.get(url, { headers }).then((respuesta) => {
      setDataOperadores(respuesta.data);
    });
  }

  function getAllEstatusInformes() {
    const url = `${process.env.REACT_APP_API_URL}/SisEstatus/getListadoInformes`;
    axios.get(url, { headers }).then((respuesta) => {
      setEstatusInformes(respuesta.data);
    });
  }

  function getAllSucursales() {
    const url = `${process.env.REACT_APP_API_URL}/Sucursales/GetListado`;
    axios.get(url, { headers }).then((respuesta) => {
      setDataSucursal(respuesta.data);
    });
  }

  function getAllViajesOrigenDestino(origen, destino) {
    const url = `http://localhost/Informes/GetViajes/` + origen + `/` + destino;
    axios.get(url, { headers }).then((respuesta) => {
      setDataViajes(respuesta.data);
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
      Color: "",
      IdOperador: 0,
    });
  }

  function handleShowModificar(id) {
    const url = `${process.env.REACT_APP_API_URL}/Unidadd/GetById/` + id;
    axios.get(url, { headers }).then((respuesta) => {
      setState({
        ...state,
      });
    });
  }

  function handleEliminar(id) {
    var derecho;
    const urlDelete = `${process.env.REACT_APP_API_URL}/Utilerias/ValidaDerechos/${state.CreadoPor}/${state.DerechoBorrar}/3`;
    axios
      .get(urlDelete, { headers })
      .then((respuesta) => {
        //showSuccess(respuesta.data)

        derecho = respuesta.data;
        if (derecho == false) {
          showSuccess("El usuario no tiene derechos para realizar el proceso");
          return;
        }

        const url = `${process.env.REACT_APP_API_URL}/Unidadd/Eliminar/` + id;
        axios
          .get(url, { headers })
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

  const handleChangeOrigenChange = (event) => {
    setState({
      ...state,
      idOrigen: event.target.value,
    });
    //Aqui hacer la peticion
    //No se que peticion tienes que hacer, aqui lo haces
  };

  const handleChangeDestinoChange = (event) => {
    setState({
      ...state,
      idDestino: event.target.value,
    });
    getAllGuiasFrom(false);
  };

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
    getAllCiudades();
    getAllTipoUnidad();
    getAllDataRutas();
  }, []);

  function getAllData() {
    const url = `${process.env.REACT_APP_API_URL}/Informes/GetListado`;
    axios.get(url, { headers }).then((respuesta) => {
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

    var $welem = $section
      .parentsUntil(".widget-action-bar")
      .parentsUntil(".w-action")
      .parents(".widget-header")
      .next(".widget-container");

    $welem.slideDown();
    $section.children("a").children("i").removeClass("zmdi-chevron-up");
    $section.children("a").children("i").addClass("zmdi-chevron-down");
    $("html, body").animate(
      {
        scrollTop: parseInt($section.offset().top),
      },
      200
    );
  }

  function value(event) {
    console.log(event.target.value);
  }

  function closeSeccions() {
    //Cerrar todas las seciones
    var $section = $(".widget-toggle");
    $section.each(function () {
      var $welem = $(this)
        .parentsUntil(".widget-action-bar")
        .parentsUntil(".w-action")
        .parents(".widget-header")
        .next(".widget-container");
      $welem.slideUp();
      $(this).children("a").children("i").removeClass("zmdi-chevron-down");
      $(this).children("a").children("i").addClass("zmdi-chevron-up");
    });
  }

  useEffect((value) => {
    //closeSeccions();
  }, []);

  const framesInformeGuia = state.Informes.map((p, index) => {
    return (
      <div key={`Informe${index}`}>
        <div className="col-md-8">
          <div className="widget-wrap">
            <div className="widget-container margin-top-0">
              <div className="widget-content">
                <div className="widget-header block-header margin-bottom-0 clearfix">
                  <div className="pull-left">
                    <h3>Información De Envio</h3>
                  </div>
                </div>

                <div className="widget-container">
                  <div className="widget-content">
                    <div className="row">
                      <div className="col-md-12">
                        <form
                          action="#"
                          className="j-forms"
                          onSubmit={handleAceptar}
                        >
                          <div className="form-content">
                            <div className="row">
                              {/*****************************************Sucursal**********************************************************/}
                              <div className="col-sm-6 col-md-3 unit">
                                <label className="label">Sucursal</label>
                                <label className="input select">
                                  <select
                                    className="form-control"
                                    required
                                    id="IdSucursal"
                                    value={state.IdSucursal}
                                    disabled
                                  >
                                    <option value="0">Todas</option>
                                    {dataSucursal.map((sucursal) => (
                                      <option
                                        key={sucursal.m_sSucursal}
                                        value={sucursal.m_nIdSucursal}
                                      >
                                        {sucursal.m_sSucursal}
                                      </option>
                                    ))}
                                  </select>
                                </label>
                              </div>
                              {/*****************************************Folio************************************************************/}
                              <div className="col-sm-12 col-md-3 unit">
                                <label className="label">Folio</label>
                                <div className="input">
                                  <input
                                    className="form-control"
                                    type="text"
                                    id="Folio"
                                    disabled
                                  />
                                </div>
                              </div>
                              {/*****************************************Fecha*******************************************************/}
                              <div className="col-sm-12 col-md-6 unit">
                                <label className="label">Fecha y Hora</label>
                                <div className="input">
                                  <input
                                    onChange={handleChange}
                                    className="form-control"
                                    type="datetime-local"
                                    required
                                    value={state.fechaHora}
                                    disabled={state.agregar == "Consultar"}
                                    id="fechaHora"
                                  />
                                </div>
                              </div>
                              {/*****************************************Hora*******************************************************/}

                              {/*****************************************Oficina Emisora***************************************************/}
                              <div className="col-sm-6 col-md-3 unit">
                                <label className="label">Oficina Emisora</label>
                                <label className="input select">
                                  <select
                                    className="form-control"
                                    required
                                    id="Oficina Emisora"
                                  >
                                    <option value="0">Todas</option>
                                    {dataSucursal.map((sucursal) => (
                                      <option
                                        key={sucursal.m_nIdSucursal}
                                        value={sucursal.m_nIdSucursal}
                                      >
                                        {sucursal.m_sSucursal}
                                      </option>
                                    ))}
                                  </select>
                                </label>
                              </div>
                              {/*****************************************Oficina Receptora*************************************************/}
                              <div className="col-sm-6 col-md-3 unit">
                                <label className="label">
                                  Oficina Receptora
                                </label>
                                <label className="input select">
                                  <select
                                    className="form-control"
                                    required
                                    id="Oficina Receptora"
                                  >
                                    <option value="0">Todas</option>
                                    {dataSucursal.map((sucursal) => (
                                      <option
                                        key={sucursal.m_nIdSucursal}
                                        value={sucursal.m_nIdSucursal}
                                      >
                                        {sucursal.m_sSucursal}
                                      </option>
                                    ))}
                                  </select>
                                </label>
                              </div>
                              {/*****************************************Estatus de Entrega*************************************************/}
                              <div className="col-sm-6 col-md-3 unit">
                                <label className="label">Estatus</label>
                                <label className="input select">
                                  <select
                                    className="form-control"
                                    required
                                    id="estatus"
                                  >
                                    <option value="0">Todos</option>
                                    {dataEstatusInformes.map((estatus) => (
                                      <option
                                        key={estatus.m_nIdEstatusRecoleccion}
                                        value={estatus.m_nIdEstatusRecoleccion}
                                      >
                                        {estatus.m_sEstatus}
                                      </option>
                                    ))}
                                  </select>
                                </label>
                              </div>
                            </div>

                            {/*****************************************Operador*************************************************/}

                            <div className="row">
                              <div className="col-sm-12 col-md-6 unit">
                                <label className="label">Operador</label>
                                {/*  <input class="form-control" type="text" placeholder="Enter a letter" id="list-autocomplete" name="list-autocomplete"/> */}
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
                                    borderWidth: "1px",
                                    borderColor: "#dddddd",
                                    borderStyle: "solid",
                                    borderRadius: "5px",
                                  }}
                                  renderInput={(params) => (
                                    <div>
                                      <TextField
                                        {...params}
                                        InputProps={{
                                          ...params.InputProps,
                                          style: {
                                            height: 24,
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
                            </div>
                            {/*****************************************tipo Unidad*************************************************/}
                            <div className="row">
                              <div className="col-sm-12 col-md-6 unit">
                                <label className="label">Tipo de Unidad</label>
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
                                    options={dataTipoUnidad}
                                    getOptionLabel={(option) =>
                                      option.m_sTipoUnidad
                                    }
                                    variant="outlined"
                                    style={{
                                      borderWidth: "1px",
                                      borderColor: "#dddddd",
                                      borderStyle: "solid",
                                      borderRadius: "5px",
                                    }}
                                    renderInput={(params) => (
                                      <div>
                                        <TextField
                                          {...params}
                                          InputProps={{
                                            ...params.InputProps,
                                            style: {
                                              height: 24,
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
                                                        "IdTipoUnidad",
                                                      tipoModal: 3,
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

                              {/*****************************************Placa Int*************************************************/}
                              <div className="col-sm-12 col-md-2 unit">
                                <label className="label">Placa Int</label>
                                <div className="input">
                                  <input
                                    className="form-control"
                                    type="text"
                                    id="Placa Int"
                                  />
                                </div>
                              </div>
                            </div>

                            {/*****************************************Remolque*************************************************/}
                            <div className="row">
                              <div className="col-sm-12 col-md-6 unit">
                                <label className="label">Remolque</label>
                                <div className="input">
                                  <Autocomplete
                                    freeSolo
                                    value={state.IdUnidad}
                                    onChange={(event, newValue) =>
                                      setState({
                                        ...state,
                                        IdUnidad: newValue,
                                      })
                                    }
                                    id="IdUnidad"
                                    disableClearable
                                    forcePopupIcon={false}
                                    options={dataUnidades}
                                    getOptionLabel={(option) =>
                                      option.m_sDescripcion
                                    }
                                    variant="outlined"
                                    style={{
                                      borderWidth: "1px",
                                      borderColor: "#dddddd",
                                      borderStyle: "solid",
                                      borderRadius: "5px",
                                    }}
                                    renderInput={(params) => (
                                      <div>
                                        <TextField
                                          {...params}
                                          InputProps={{
                                            ...params.InputProps,
                                            style: {
                                              height: 24,
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
                                                        "IdUnidad",
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
                              {/*****************************************Placa Int*************************************************/}
                              <div className="col-sm-12 col-md-2 unit">
                                <label className="label">Placa Int</label>
                                <div className="input">
                                  <input
                                    className="form-control"
                                    type="text"
                                    id="Placa Int"
                                  />
                                </div>
                              </div>
                            </div>

                            {/*****************************************Origen*************************************************/}
                            <div className="row">
                              <div className="col-sm-12 col-md-6 unit">
                                <label className="label">Origen</label>
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
                                      borderWidth: "1px",
                                      borderColor: "#dddddd",
                                      borderStyle: "solid",
                                      borderRadius: "5px",
                                    }}
                                    renderInput={(params) => (
                                      <div>
                                        <TextField
                                          {...params}
                                          InputProps={{
                                            ...params.InputProps,
                                            style: {
                                              height: 24,
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
                              {/*****************************************Destino*************************************************/}
                              <div className="col-sm-12 col-md-6 unit">
                                <label className="label">Destino</label>
                                <div className="input">
                                  <Autocomplete
                                    freeSolo
                                    onChange={(event, newValue) =>
                                      setState({
                                        ...state,
                                        IdCiudadDestino: newValue,
                                      })
                                    }
                                    onSelect={() => {
                                      getAllGuiasFrom(false);
                                      getAllViajesOrigenDestino(
                                        state.IdCiudadOrigen.m_nIdCiudad,
                                        state.IdCiudadDestino.m_nIdCiudad
                                      );
                                    }}
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
                                      borderWidth: "1px",
                                      borderColor: "#dddddd",
                                      borderStyle: "solid",
                                      borderRadius: "5px",
                                    }}
                                    renderInput={(params) => (
                                      <div>
                                        <TextField
                                          {...params}
                                          InputProps={{
                                            ...params.InputProps,
                                            style: {
                                              height: 24,
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
                                                        "IdCiudadDestino",
                                                      tipoModal: 1,
                                                      openDialog: true,
                                                    });
                                                    getAllViajesOrigenDestino(
                                                      state.IdCiudadOrigen
                                                        .m_nIdCiudad,
                                                      state.IdCiudadDestino
                                                        .m_nIdCiudad
                                                    );
                                                    getAllGuiasFrom(false);
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
                            {/*****************************************Ruta*************************************************/}
                            <div className="row">
                              <div className="col-sm-12 col-md-6 unit">
                                <label className="label">Ruta</label>
                                {/*  <input class="form-control" type="text" placeholder="Enter a letter" id="list-autocomplete" name="list-autocomplete"/> */}
                                <div className="input">
                                  <Autocomplete
                                    freeSolo
                                    onChange={(event, newValue) =>
                                      setState({
                                        ...state,
                                        idRuta: newValue,
                                      })
                                    }
                                    value={state.IdCiudadDestino}
                                    id="idRuta"
                                    disableClearable
                                    forcePopupIcon={false}
                                    options={dataRutas}
                                    getOptionLabel={(option) =>
                                      option.m_sDescripcion
                                    }
                                    variant="outlined"
                                    style={{
                                      borderWidth: "1px",
                                      borderColor: "#dddddd",
                                      borderStyle: "solid",
                                      borderRadius: "5px",
                                    }}
                                    renderInput={(params) => (
                                      <div>
                                        <TextField
                                          {...params}
                                          InputProps={{
                                            ...params.InputProps,
                                            style: {
                                              height: 24,
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
                                                        "IdCiudadDestino",
                                                      tipoModal: 1,
                                                      openDialog: true,
                                                    });
                                                    getAllViajesOrigenDestino(
                                                      state.IdCiudadOrigen
                                                        .m_nIdCiudad,
                                                      state.IdCiudadDestino
                                                        .m_nIdCiudad
                                                    );
                                                    getAllGuiasFrom();
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
                                </div>{" "}
                              </div>
                            </div>
                          </div>
                        </form>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="row">
                  <div className="col-md-12">
                    <div className="widget-wrap">
                      <div className="widget-header block-header margin-bottom-0 clearfix">
                        <div className="pull-left">
                          <h3>Asignar a un Viaje</h3>
                        </div>
                      </div>
                      <div className="widget-container">
                        <div className="widget-content">
                          <div className="row">
                            <div className="col-md-12">
                              <form action="#" className="j-forms" noValidate>
                                <div className="form-content">
                                  {/*****************************************Viaje*************************************************/}
                                  <div className="row">
                                    <div className="col-sm-12 col-md-6 unit">
                                      <label className="label">Viaje</label>
                                      <label className="input select">
                                        <select
                                          className="form-control"
                                          required
                                          id="viaje"
                                          onSelect={handleSelectViaje()}
                                        >
                                          <option value="0">Seleccionar</option>
                                          {dataViajes.map((viaje) => (
                                            <option
                                              key={viaje.m_nIdViaje}
                                              value={viaje.m_nIdViaje}
                                            >
                                              {viaje.m_sFolioViaje}
                                            </option>
                                          ))}
                                        </select>
                                      </label>
                                    </div>

                                    {/*****************************************Ruta2*************************************************/}
                                    <div className="col-sm-12 col-md-6 unit">
                                      <label className="label">Ruta</label>
                                      <div className="input">
                                        <input
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
                                    <div className="col-sm-12 col-md-6 unit">
                                      <label className="label">Operador</label>
                                      <div className="input">
                                        <input
                                          className="form-control"
                                          type="text"
                                          value={state.operador2}
                                          id="operador2"
                                        />
                                      </div>
                                    </div>

                                    {/*****************************************Unidad2*************************************************/}
                                    <div className="col-sm-12 col-md-6 unit">
                                      <label className="label">Unidad</label>
                                      <div className="input">
                                        <input
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
                                    <div className="col-sm-12 col-md-6 unit">
                                      <label className="label">Remolque</label>
                                      <div className="input">
                                        <input
                                          className="form-control"
                                          type="text"
                                          value={state.remolque2}
                                          id="remolque2"
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
        <div className="col-md-4">
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
                    <form action="#" className="j-forms" noValidate>
                      <div className="form-content">
                        {dataGuias.map((value, index) => {
                          return (
                            <div>
                              <br />
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
                                    <Grid container spacing={2}>
                                      <Grid item sm={12} md={4}>
                                        <div className="input">
                                          <label htmlFor={"folio-" + index}>
                                            Folio Guía
                                          </label>
                                          <input
                                            value={value.m_nFolioGuia}
                                            className="form-control"
                                            type="text"
                                            disabled="true"
                                            id={"folio-" + index}
                                          />
                                        </div>
                                      </Grid>
                                      <Grid item sm={12} md={4}>
                                        <div className="input">
                                          <label htmlFor={"estatus-" + index}>
                                            Estatus Guía
                                          </label>
                                          <input
                                            className="form-control"
                                            type="text"
                                            disabled="true"
                                            value={value.m_sEstatusGuia}
                                            id={"estatus-" + index}
                                          />
                                        </div>
                                      </Grid>
                                      <Grid item sm={12} md={4}>
                                        <div className="input">
                                          <label htmlFor={"total-" + index}>
                                            Total
                                          </label>
                                          <input
                                            value={value.total}
                                            disabled="true"
                                            className="form-control"
                                            type="text"
                                            id={"total-" + index}
                                          />
                                        </div>
                                      </Grid>
                                      <Grid item sm={12} md={6}>
                                        <div className="input">
                                          <label htmlFor={"destino-" + index}>
                                            Destino
                                          </label>
                                          <input
                                            value={value.destino}
                                            className="form-control"
                                            type="text"
                                            disabled="true"
                                            id={"destino-" + index}
                                          />
                                        </div>
                                      </Grid>
                                      <Grid item sm={12} md={6}>
                                        <div className="input">
                                          <label htmlFor={"servicio-" + index}>
                                            Tipo de Servicio
                                          </label>
                                          <input
                                            disabled="true"
                                            value={value.servicio}
                                            className="form-control"
                                            type="text"
                                            id={"servicio-" + index}
                                          />
                                        </div>
                                      </Grid>
                                      <Grid item sm={12} md={12}>
                                        <div className="input">
                                          <label
                                            htmlFor={"observacion-" + index}
                                          >
                                            Observaciones
                                          </label>
                                          <input
                                            disabled="true"
                                            value={value.observaciones}
                                            className="form-control"
                                            type="text"
                                            id={"observacion-" + index}
                                          />
                                        </div>
                                      </Grid>
                                    </Grid>
                                  </Grid>
                                </Grid>
                              </ButtonBase>
                              <br />
                            </div>
                          );
                        })}
                        <br />
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
                              <Grid
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
                                {"$350"}
                              </Grid>
                              <Grid
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
                                {"$350"}
                              </Grid>
                              <Grid
                                item
                                sm={6}
                                style={{
                                  justifyContent: "left",
                                  alignItems: "left",
                                  textAlign: "left",
                                }}
                              >
                                Total Pagado en Mostrador
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
                                {"$350"}
                              </Grid>
                              <Grid
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
                                {"$350"}
                              </Grid>
                              <Grid
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
                                {"$350"}
                              </Grid>
                              <Grid
                                item
                                sm={6}
                                style={{
                                  justifyContent: "left",
                                  alignItems: "left",
                                  textAlign: "left",
                                }}
                              >
                                <b style={{ fontWeight: "bold" }}>
                                  Total General
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
                                {"$350"}
                              </Grid>
                            </Grid>
                          </Grid>
                        </Grid>
                      </div>
                    </form>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        {state.Informes.length !== 1 && (
          <a
            className="btn delete"
            onClick={() => removeInformeGuia(index)}
            disabled={state.agregar == "Consultar"}
          >
            <i className="zmdi zmdi-delete"></i> Eliminar Informe
          </a>
        )}
      </div>
    );
  });

  return (
    <div>
      <Dialog
        open={state.openDialog}
        onClose={() => setState({ ...state, openDialog: false })}
      >
        <DialogContent>
          {state.tipoModal == 1 && (
            <div className="row" style={{ backgroundColor: "#FFFFFF" }}>
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
              <DialogActions style={{ justifyContent: "left" }}>
                <button
                  onClick={() => setState({ ...state, openDialog: false })}
                  className="btn btn-secondary secondary-btn"
                >
                  Cerrar
                </button>
                <button
                  onClick={() => setState({ ...state, openDialog: false })}
                  className="btn btn-primary primary-btn"
                >
                  Aceptar
                </button>
              </DialogActions>
            </div>
          )}
          {state.tipoModal == 2 && (
            <div className="row" style={{ backgroundColor: "#FFFFFF" }}>
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
              <DialogActions style={{ justifyContent: "left" }}>
                <button
                  onClick={() => setState({ ...state, openDialog: false })}
                  className="btn btn-secondary secondary-btn"
                >
                  Cerrar
                </button>
                <button
                  onClick={() => setState({ ...state, openDialog: false })}
                  className="btn btn-primary primary-btn"
                >
                  Aceptar
                </button>
              </DialogActions>
            </div>
          )}
          {state.tipoModal == 3 && (
            <div className="row" style={{ backgroundColor: "#FFFFFF" }}>
              <div align="right">
                <button
                  onClick={() => {
                    history.push("/TipoUnidad");
                  }}
                  className="btn btn-primary primary-btn"
                >
                  Agregar
                </button>
              </div>
              {dataTipoUnidad.length != 0 ? (
                <TableTipoUnidad
                  select={
                    state[state.identificadorModal] &&
                    state[state.identificadorModal].m_nIdTipoUnidad
                  }
                  columns={columnsTipoUnidades}
                  data={dataTipoUnidad}
                  identificadorModal={state.identificadorModal}
                />
              ) : (
                <div>No se encontró ningún registro</div>
              )}
              <DialogActions style={{ justifyContent: "left" }}>
                <button
                  onClick={() => setState({ ...state, openDialog: false })}
                  className="btn btn-secondary secondary-btn"
                >
                  Cerrar
                </button>
                <button
                  onClick={() => setState({ ...state, openDialog: false })}
                  className="btn btn-primary primary-btn"
                >
                  Aceptar
                </button>
              </DialogActions>
            </div>
          )}
          {state.tipoModal == 4 && (
            <div className="row" style={{ backgroundColor: "#FFFFFF" }}>
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

              {dataUnidades.length != 0 ? (
                <TableUnidad
                  select={
                    state[state.identificadorModal] &&
                    state[state.identificadorModal].m_nIdUnidad
                  }
                  columns={columnsUnidades}
                  data={dataUnidades}
                  identificadorModal={state.identificadorModal}
                />
              ) : (
                <div>No se encontró ningún registro</div>
              )}
              <DialogActions style={{ justifyContent: "left" }}>
                <button
                  onClick={() => setState({ ...state, openDialog: false })}
                  className="btn btn-secondary secondary-btn"
                >
                  Cerrar
                </button>
                <button
                  onClick={() => setState({ ...state, openDialog: false })}
                  className="btn btn-primary primary-btn"
                >
                  Aceptar
                </button>
              </DialogActions>
            </div>
          )}
        </DialogContent>
      </Dialog>

      <header className="topbar clearfix">
        <Cabecera />
      </header>
      {/*Topbar End Here*/}
      {/*Leftbar Start Here*/}
      <aside className="iconic-leftbar" style={{ minHeight: state.height }}>
        <BarraLateralIzquierda />
      </aside>

      <section className="main-container">
        <div className="container-fluid">
          <div className="page-header filled full-block light">
            <div className="row">
              <div className="col-md-6 col-sm-6">
                <h2>Informes</h2>
              </div>
              <div className="col-md-6 col-sm-6">
                <ul className="list-page-breadcrumb">
                  <li className="active-page"> Informes</li>
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

            <li>
              <a data-toggle="tab" href="#Imprimir">
                <i className="fa fa-print" /> Imprimir
              </a>
            </li>

            <li>
              <a
                data-toggle="tab"
                href="#Cancelar"
                onClick={handleShowCancelar}
                className={state.IdInforme == 0 ? classes.disabled : ""}
              >
                <i className="fa fa-ban" /> Cancelar
              </a>
            </li>

            <li>
              <a data-toggle="tab" href="#Cubicar">
                <i className="fa fa-adjust" /> Cubicar / Optimizar Rutas
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
                  <div
                    className="row"
                    style={{ height: state.height - 250, width: "100%" }}
                  >
                    {data.length != 0 ? (
                      <DataGrid
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
            <div id="Imprimir" className="tab-pane fade ">
              Imprimir
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
                      top: "150px",
                      padding: "5px",
                      backgroundColor: "white",
                      zIndex: 100,
                      marginBottom: "10px",
                    }}
                  >
                    <div className="row">
                      <div
                        className={
                          "col-md-4 col-sm-2 step " +
                          (stepActive == 1 && "active-step")
                        }
                        onClick={() => openSection(1)}
                      >
                        <div className={"steps"}>
                          <span className={"step-number"}>1</span>
                          <p>Información De Envio</p>
                        </div>
                      </div>
                      <div
                        className={
                          "col-md-4 col-sm-2 step " +
                          (stepActive == 2 && "active-step")
                        }
                        onClick={() => openSection(2)}
                      >
                        <div className="steps">
                          <span className="step-number">2</span>
                          <p>Asignar a un Viaje</p>
                        </div>
                      </div>
                      <div
                        className={
                          "col-md-4 col-sm-2 step " +
                          (stepActive == 3 && "active-step")
                        }
                        onClick={() => openSection(3)}
                      >
                        <div className="steps">
                          <span className="step-number">3</span>
                          <p>Detalles de Guias</p>
                        </div>
                      </div>
                    </div>
                  </div>
                  {/* end steps */}
                </div>

                <div className="row">
                  <div className="col-md-8">
                    <div className="widget-wrap">
                      <div className="widget-container margin-top-0">
                        <div className="widget-content">
                          <div className="widget-header block-header margin-bottom-0 clearfix">
                            <div className="pull-left">
                              <h3>Información De Envio</h3>
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
                                      <div className="row">
                                        {/*****************************************Sucursal**********************************************************/}
                                        <div className="col-sm-6 col-md-3 unit">
                                          <label className="label">
                                            Sucursal
                                          </label>
                                          <label className="input select">
                                            <select
                                              className="form-control"
                                              required
                                              id="IdSucursal"
                                              value={state.IdSucursal}
                                              disabled
                                            >
                                              <option value="0">Todas</option>
                                              {dataSucursal.map((sucursal) => (
                                                <option
                                                  key={sucursal.m_nIdSucursal}
                                                  value={sucursal.m_nIdSucursal}
                                                >
                                                  {sucursal.m_sSucursal}
                                                </option>
                                              ))}
                                            </select>
                                          </label>
                                        </div>
                                        {/*****************************************Folio************************************************************/}
                                        <div className="col-sm-12 col-md-3 unit">
                                          <label className="label">Folio</label>
                                          <div className="input">
                                            <input
                                              className="form-control"
                                              type="text"
                                              id="Folio"
                                              disabled
                                            />
                                          </div>
                                        </div>
                                        {/*****************************************Fecha*******************************************************/}
                                        <div className="col-sm-12 col-md-6 unit">
                                          <label className="label">
                                            Fecha y Hora
                                          </label>
                                          <div className="input">
                                            <input
                                              onChange={handleChange}
                                              className="form-control"
                                              type="datetime-local"
                                              required
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
                                        <div className="col-sm-6 col-md-3 unit">
                                          <label className="label">
                                            Oficina Emisora
                                          </label>
                                          <label className="input select">
                                            <select
                                              className="form-control"
                                              required
                                              id="sucursalEmisora"
                                              onChange={handleChange}
                                            >
                                              <option value="0">Todas</option>
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
                                            </select>
                                          </label>
                                        </div>
                                        {/*****************************************Oficina Receptora*************************************************/}
                                        <div className="col-sm-6 col-md-3 unit">
                                          <label className="label">
                                            Oficina Receptora
                                          </label>
                                          <label className="input select">
                                            <select
                                              className="form-control"
                                              required
                                              id="sucursalReceptora"
                                              onChange={handleChange}
                                            >
                                              <option value="0">Todas</option>
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
                                            </select>
                                          </label>
                                        </div>
                                        {/*****************************************Estatus de Entrega*************************************************/}
                                        <div className="col-sm-6 col-md-3 unit">
                                          <label className="label">
                                            Estatus
                                          </label>
                                          <label className="input select">
                                            <select
                                              className="form-control"
                                              v
                                              onChange={handleChange}
                                              //value={state.EstatusInforme}
                                              id="EstatusInforme"
                                            >
                                              <option value="0">Todos</option>
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
                                            </select>
                                          </label>
                                        </div>
                                      </div>

                                      {/*****************************************Operador*************************************************/}

                                      <div className="row">
                                        <div className="col-sm-12 col-md-6 unit">
                                          <label className="label">
                                            Operador
                                          </label>
                                          {/*  <input class="form-control" type="text" placeholder="Enter a letter" id="list-autocomplete" name="list-autocomplete"/> */}
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
                                              borderWidth: "1px",
                                              borderColor: "#dddddd",
                                              borderStyle: "solid",
                                              borderRadius: "5px",
                                            }}
                                            renderInput={(params) => (
                                              <div>
                                                <TextField
                                                  {...params}
                                                  InputProps={{
                                                    ...params.InputProps,
                                                    style: {
                                                      height: 24,
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
                                      </div>
                                      {/*****************************************tipo Unidad*************************************************/}
                                      <div className="row">
                                        <div className="col-sm-12 col-md-6 unit">
                                          <label className="label">
                                            Tipo de Unidad
                                          </label>
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
                                              options={dataTipoUnidad}
                                              getOptionLabel={(option) =>
                                                option.m_sTipoUnidad
                                              }
                                              variant="outlined"
                                              style={{
                                                borderWidth: "1px",
                                                borderColor: "#dddddd",
                                                borderStyle: "solid",
                                                borderRadius: "5px",
                                              }}
                                              renderInput={(params) => (
                                                <div>
                                                  <TextField
                                                    {...params}
                                                    InputProps={{
                                                      ...params.InputProps,
                                                      style: {
                                                        height: 24,
                                                      },
                                                      type: "search",
                                                      disableUnderline: true,
                                                      endAdornment: (
                                                        <InputAdornment position="end">
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
                                                                tipoModal: 3,
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
                                        <div className="col-sm-12 col-md-2 unit">
                                          <label className="label">
                                            Placa Int
                                          </label>
                                          <div className="input">
                                            <input
                                              className="form-control"
                                              type="text"
                                              id="Placa Int"
                                            />
                                          </div>
                                        </div>
                                      </div>

                                      {/*****************************************Remolque*************************************************/}
                                      <div className="row">
                                        <div className="col-sm-12 col-md-6 unit">
                                          <label className="label">
                                            Remolque 1
                                          </label>
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
                                              options={dataUnidades}
                                              getOptionLabel={(option) =>
                                                option.m_sDescripcion
                                              }
                                              variant="outlined"
                                              style={{
                                                borderWidth: "1px",
                                                borderColor: "#dddddd",
                                                borderStyle: "solid",
                                                borderRadius: "5px",
                                              }}
                                              renderInput={(params) => (
                                                <div>
                                                  <TextField
                                                    {...params}
                                                    InputProps={{
                                                      ...params.InputProps,
                                                      style: {
                                                        height: 24,
                                                      },
                                                      type: "search",
                                                      disableUnderline: true,
                                                      endAdornment: (
                                                        <InputAdornment position="end">
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
                                        <div className="col-sm-12 col-md-2 unit">
                                          <label className="label">
                                            Placa Int
                                          </label>
                                          <div className="input">
                                            <input
                                              required
                                              onChange={handleChange}
                                              className="form-control"
                                              type="text"
                                              id="PlacasRemolque1"
                                            />
                                          </div>
                                        </div>
                                      </div>

                                      <div className="row">
                                        <div className="col-sm-12 col-md-6 unit">
                                          <label className="label">
                                            Remolque 2
                                          </label>
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
                                              options={dataUnidades}
                                              getOptionLabel={(option) =>
                                                option.m_sDescripcion
                                              }
                                              variant="outlined"
                                              style={{
                                                borderWidth: "1px",
                                                borderColor: "#dddddd",
                                                borderStyle: "solid",
                                                borderRadius: "5px",
                                              }}
                                              renderInput={(params) => (
                                                <div>
                                                  <TextField
                                                    {...params}
                                                    InputProps={{
                                                      ...params.InputProps,
                                                      style: {
                                                        height: 24,
                                                      },
                                                      type: "search",
                                                      disableUnderline: true,
                                                      endAdornment: (
                                                        <InputAdornment position="end">
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
                                        <div className="col-sm-12 col-md-2 unit">
                                          <label className="label">
                                            Placa Int
                                          </label>
                                          <div className="input">
                                            <input
                                              onChange={handleChange}
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
                                          <label className="label">
                                            Origen
                                          </label>
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
                                                borderWidth: "1px",
                                                borderColor: "#dddddd",
                                                borderStyle: "solid",
                                                borderRadius: "5px",
                                              }}
                                              renderInput={(params) => (
                                                <div>
                                                  <TextField
                                                    {...params}
                                                    InputProps={{
                                                      ...params.InputProps,
                                                      style: {
                                                        height: 24,
                                                      },
                                                      type: "search",
                                                      disableUnderline: true,
                                                      endAdornment: (
                                                        <InputAdornment position="end">
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
                                          <label className="label">
                                            Destino
                                          </label>
                                          <div className="input">
                                            <Autocomplete
                                              freeSolo
                                              onChange={(event, newValue) =>
                                                setState({
                                                  ...state,
                                                  IdCiudadDestino: newValue,
                                                })
                                              }
                                              onSelect={() => {
                                                getAllGuiasFrom();
                                                getAllViajesOrigenDestino(
                                                  state.IdCiudadOrigen
                                                    .m_nIdCiudad,
                                                  state.IdCiudadDestino
                                                    .m_nIdCiudad
                                                );
                                              }}
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
                                                borderWidth: "1px",
                                                borderColor: "#dddddd",
                                                borderStyle: "solid",
                                                borderRadius: "5px",
                                              }}
                                              renderInput={(params) => (
                                                <div>
                                                  <TextField
                                                    {...params}
                                                    InputProps={{
                                                      ...params.InputProps,
                                                      style: {
                                                        height: 24,
                                                      },
                                                      type: "search",
                                                      disableUnderline: true,
                                                      endAdornment: (
                                                        <InputAdornment position="end">
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
                                      <div className="row">
                                        <div className="col-sm-12 col-md-6 unit">
                                          <label className="label">Ruta</label>
                                          {/*  <input class="form-control" type="text" placeholder="Enter a letter" id="list-autocomplete" name="list-autocomplete"/> */}
                                          <div className="input">
                                            <Autocomplete
                                              freeSolo
                                              onChange={(event, newValue) =>
                                                setState({
                                                  ...state,
                                                  idRuta: newValue,
                                                })
                                              }
                                              value={state.IdCiudadDestino}
                                              id="idRuta"
                                              disableClearable
                                              forcePopupIcon={false}
                                              options={dataRutas}
                                              getOptionLabel={(option) =>
                                                option.m_sDescripcion
                                              }
                                              variant="outlined"
                                              style={{
                                                borderWidth: "1px",
                                                borderColor: "#dddddd",
                                                borderStyle: "solid",
                                                borderRadius: "5px",
                                              }}
                                              renderInput={(params) => (
                                                <div>
                                                  <TextField
                                                    {...params}
                                                    InputProps={{
                                                      ...params.InputProps,
                                                      style: {
                                                        height: 24,
                                                      },
                                                      type: "search",
                                                      disableUnderline: true,
                                                      endAdornment: (
                                                        <InputAdornment position="end">
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
                                          </div>{" "}
                                        </div>
                                      </div>
                                    </div>
                                  </form>
                                </div>
                              </div>
                            </div>
                          </div>

                          <div className="row">
                            <div className="col-md-12">
                              <div className="widget-wrap">
                                <div className="widget-header block-header margin-bottom-0 clearfix">
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
                                              <div className="col-sm-12 col-md-6 unit">
                                                <label className="label">
                                                  Viaje
                                                </label>
                                                <label className="input select">
                                                  <select
                                                    className="form-control"
                                                    required
                                                    id="viaje"
                                                    onSelect={handleSelectViaje()}
                                                  >
                                                    <option value="0">
                                                      Seleccionar
                                                    </option>
                                                    {dataViajes.map((viaje) => (
                                                      <option
                                                        key={viaje.m_nIdViaje}
                                                        value={viaje.m_nIdViaje}
                                                      >
                                                        {viaje.m_sFolioViaje}
                                                      </option>
                                                    ))}
                                                  </select>
                                                </label>
                                              </div>

                                              {/*****************************************Ruta2*************************************************/}
                                              <div className="col-sm-12 col-md-6 unit">
                                                <label className="label">
                                                  Ruta
                                                </label>
                                                <div className="input">
                                                  <input
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
                                              <div className="col-sm-12 col-md-6 unit">
                                                <label className="label">
                                                  Operador
                                                </label>
                                                <div className="input">
                                                  <input
                                                    className="form-control"
                                                    type="text"
                                                    value={state.operador2}
                                                    id="operador2"
                                                  />
                                                </div>
                                              </div>

                                              {/*****************************************Unidad2*************************************************/}
                                              <div className="col-sm-12 col-md-6 unit">
                                                <label className="label">
                                                  Unidad
                                                </label>
                                                <div className="input">
                                                  <input
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
                                              <div className="col-sm-12 col-md-6 unit">
                                                <label className="label">
                                                  Remolque
                                                </label>
                                                <div className="input">
                                                  <input
                                                    className="form-control"
                                                    type="text"
                                                    value={state.remolque2}
                                                    id="remolque2"
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
                  <div className="col-md-4">
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
                              <form action="#" className="j-forms" noValidate>
                                <div className="form-content">
                                  {dataGuias.map((value, index) => {
                                    return (
                                      <div>
                                        <br />
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
                                              <Grid container spacing={2}>
                                                <Grid item sm={12} md={4}>
                                                  <div className="input">
                                                    <label
                                                      htmlFor={"folio-" + index}
                                                    >
                                                      Folio Guía
                                                    </label>
                                                    <input
                                                      onChange={handleChange}
                                                      value={value.m_nFolioGuia}
                                                      className="form-control"
                                                      type="text"
                                                      disabled="true"
                                                      id={"folio-" + index}
                                                    />
                                                  </div>
                                                </Grid>
                                                <Grid item sm={12} md={4}>
                                                  <div className="input">
                                                    <label
                                                      htmlFor={
                                                        "estatus-" + index
                                                      }
                                                    >
                                                      Estatus Guía
                                                    </label>
                                                    <input
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
                                                <Grid item sm={12} md={4}>
                                                  <div className="input">
                                                    <label
                                                      htmlFor={"total-" + index}
                                                    >
                                                      Total
                                                    </label>
                                                    <input
                                                      value={value.total}
                                                      disabled="true"
                                                      className="form-control"
                                                      type="text"
                                                      id={"total-" + index}
                                                    />
                                                  </div>
                                                </Grid>
                                                <Grid item sm={12} md={6}>
                                                  <div className="input">
                                                    <label
                                                      htmlFor={
                                                        "destino-" + index
                                                      }
                                                    >
                                                      Destino
                                                    </label>
                                                    <input
                                                      value={value.destino}
                                                      className="form-control"
                                                      type="text"
                                                      disabled="true"
                                                      id={"destino-" + index}
                                                    />
                                                  </div>
                                                </Grid>
                                                <Grid item sm={12} md={6}>
                                                  <div className="input">
                                                    <label
                                                      htmlFor={
                                                        "servicio-" + index
                                                      }
                                                    >
                                                      Tipo de Servicio
                                                    </label>
                                                    <input
                                                      disabled="true"
                                                      value={value.servicio}
                                                      className="form-control"
                                                      type="text"
                                                      id={"servicio-" + index}
                                                    />
                                                  </div>
                                                </Grid>
                                                <Grid item sm={12} md={12}>
                                                  <div className="input">
                                                    <label
                                                      htmlFor={
                                                        "observacion-" + index
                                                      }
                                                    >
                                                      Observaciones
                                                    </label>
                                                    <input
                                                      disabled="true"
                                                      value={
                                                        value.observaciones
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
                                        <br />
                                      </div>
                                    );
                                  })}
                                  <br />
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
                                        <Grid
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
                                          {"$350"}
                                        </Grid>
                                        <Grid
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
                                          {"$350"}
                                        </Grid>
                                        <Grid
                                          item
                                          sm={6}
                                          style={{
                                            justifyContent: "left",
                                            alignItems: "left",
                                            textAlign: "left",
                                          }}
                                        >
                                          Total Pagado en Mostrador
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
                                          {"$350"}
                                        </Grid>
                                        <Grid
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
                                          {"$350"}
                                        </Grid>
                                        <Grid
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
                                          {"$350"}
                                        </Grid>
                                        <Grid
                                          item
                                          sm={6}
                                          style={{
                                            justifyContent: "left",
                                            alignItems: "left",
                                            textAlign: "left",
                                          }}
                                        >
                                          <b style={{ fontWeight: "bold" }}>
                                            Total General
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
                                          {"$350"}
                                        </Grid>
                                      </Grid>
                                    </Grid>
                                  </Grid>
                                </div>
                              </form>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="form-footer" className="col-md-12">
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
                    disabled={state.agregar == "Consultar"}
                  >
                    Aceptar
                  </button>
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
                            <label className="label">Folio Informes</label>
                            <div className="input">
                              <input
                                className="form-control"
                                type="text"
                                value={state.FolioInforme}
                                id="FolioInforme"
                                readOnly
                              />
                            </div>
                          </div>

                          <div className="col-sm-6 col-md-2-5 col-lg-2-5 unit">
                            <label className="label">Sucursal</label>
                            <div className="input">
                              <input
                                className="form-control"
                                type="text"
                                value={state.sucursalCancelacion}
                                id="sucursalCancelacion"
                                readOnly
                              />
                            </div>
                          </div>

                          <div className="col-sm-6 col-md-2-5 col-lg-2-5 unit">
                            <label className="label">Fecha</label>
                            <div className="input">
                              <input
                                className="form-control"
                                type="text"
                                value={state.fechaCancelacion}
                                id="fechaCancelacion"
                                readOnly
                              />
                            </div>
                          </div>

                          <div className="col-sm-6 col-md-2-5 col-lg-2-5 unit">
                            <label className="label">Usuario</label>
                            <div className="input">
                              <input
                                className="form-control"
                                type="text"
                                value={state.usuarioCancelacion}
                                id="usuarioCancelacion"
                                readOnly
                              />
                            </div>
                          </div>

                          <div className="col-sm-6 col-md-2-5 col-lg-2-5 unit">
                            <label className="label">Estatus</label>
                            <div className="input">
                              <input
                                className="form-control"
                                type="text"
                                value={state.estatusCancelacion}
                                id="estatusCancelacion"
                                readOnly
                              />
                            </div>
                          </div>

                          <div className="col-sm-12 col-md-12 col-lg-12 unit">
                            <label className="label">Motivo</label>
                            <div className="input">
                              <input
                                className="form-control"
                                type="text"
                                value={state.motivoCancelacion}
                                id="motivoCancelacion"
                              />
                            </div>
                          </div>

                          <div className="form-footer" className="col-md-12">
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
                            <label className="label">Origen</label>
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
                                  borderWidth: "1px",
                                  borderColor: "#dddddd",
                                  borderStyle: "solid",
                                  borderRadius: "5px",
                                }}
                                renderInput={(params) => (
                                  <div>
                                    <TextField
                                      required
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
                          <div className="row">
                            <label className="label">Destino</label>
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
                                  borderWidth: "1px",
                                  borderColor: "#dddddd",
                                  borderStyle: "solid",
                                  borderRadius: "5px",
                                }}
                                renderInput={(params) => (
                                  <div>
                                    <TextField
                                      required
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
                          <div className="row">
                            <label className="label">Remolque 1</label>
                            <div className="input">
                              <Autocomplete
                                freeSolo
                                value={state.IdUnidad || ""}
                                onChange={(event, newValue) =>
                                  setState({
                                    ...state,
                                    IdUnidad: newValue,
                                  })
                                }
                                id="IdUnidad"
                                disableClearable
                                forcePopupIcon={false}
                                options={dataUnidades}
                                getOptionLabel={(option) =>
                                  option.m_sDescripcion
                                }
                                variant="outlined"
                                style={{
                                  borderWidth: "1px",
                                  borderColor: "#dddddd",
                                  borderStyle: "solid",
                                  borderRadius: "5px",
                                }}
                                renderInput={(params) => (
                                  <div>
                                    <TextField
                                      required
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
                                                    "IdUnidad",
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
                          <div className="row">
                            <label className="label">Remolque 2</label>
                            <div className="input">
                              <Autocomplete
                                freeSolo
                                value={state.remolqueSecundario || ""}
                                onChange={(event, newValue) =>
                                  setState({
                                    ...state,
                                    remolqueSecundario: newValue,
                                  })
                                }
                                id="remolqueSecundario"
                                disableClearable
                                forcePopupIcon={false}
                                options={dataUnidades}
                                getOptionLabel={(option) =>
                                  option.m_sDescripcion
                                }
                                variant="outlined"
                                style={{
                                  borderWidth: "1px",
                                  borderColor: "#dddddd",
                                  borderStyle: "solid",
                                  borderRadius: "5px",
                                }}
                                renderInput={(params) => (
                                  <div>
                                    <TextField
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
                                                    "remolqueSecundario",
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
                          <div className="row">
                            <div
                              align="center"
                              style={{ padding: "10px", width: "100%" }}
                            >
                              <button
                                type="submit"
                                className="btn btn-primary primary-btn"
                                style={{ float: "none" }}
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
                            <h4 style={{ color: "white", padding: "5px" }}>
                              Informes: {informes.length}
                            </h4>
                            {informes.map((i, index) => (
                              <div style={{ padding: "10px" }}>
                                <table
                                  style={{
                                    backgroundColor: "white",
                                    height: "100%",
                                    width: "100%",
                                    overflow: "scroll",
                                  }}
                                >
                                  <thead>
                                    <tr style={{ backgroundColor: "#F9A03E" }}>
                                      <th tyle={{ paddingLeft: "5px" }}>
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
                                  <tr style={{ backgroundColor: "#E6E6E6" }}>
                                    <th>Guía</th>
                                    <th>Destino</th>
                                    <th>Paquetes</th>
                                  </tr>
                                  {i.map((g) => (
                                    <tr
                                      onClick={() =>
                                        setState({ ...state, guiaSelected: g })
                                      }
                                    >
                                      <td>{g.folio}</td>
                                      <td>{g.destino}</td>
                                      <td style={{ textAlign: "center" }}>
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
                          <div style={{ backgroundColor: "#E6E6E6" }}>
                            <h4 style={{ color: "#717171", padding: "5px" }}>
                              Detalles de Guía {state.guiaSelected.folio}
                            </h4>
                            {state.guiaSelected.arrayPaquetes.map(
                              (p, index) => (
                                <div
                                  style={{ color: "#707070", padding: "5px" }}
                                >
                                  <h4>Paquete {index + 1}</h4>
                                  <div className="row">
                                    <div className="col-sm-12 col-md-2 col-lg-2 unit">
                                      <label
                                        className="label"
                                        style={{ color: "#848484" }}
                                      >
                                        Peso{" "}
                                      </label>
                                      <div className="input">
                                        <input
                                          style={{ backgroundColor: "#FFFFFF" }}
                                          className="form-control"
                                          type="text"
                                          disabled
                                          value={p.m_xPeso}
                                        />
                                      </div>
                                    </div>
                                    <div className="col-sm-12 col-md-2 col-lg-2 unit">
                                      <label
                                        className="label"
                                        style={{ color: "#848484" }}
                                      >
                                        Largo{" "}
                                      </label>
                                      <div className="input">
                                        <input
                                          style={{ backgroundColor: "#FFFFFF" }}
                                          className="form-control"
                                          type="text"
                                          disabled
                                          value={p.m_xLargo}
                                        />
                                      </div>
                                    </div>
                                    <div className="col-sm-12 col-md-2 col-lg-2 unit">
                                      <label
                                        className="label"
                                        style={{ color: "#848484" }}
                                      >
                                        Ancho{" "}
                                      </label>
                                      <div className="input">
                                        <input
                                          style={{ backgroundColor: "#FFFFFF" }}
                                          className="form-control"
                                          type="text"
                                          disabled
                                          value={p.m_xAncho}
                                        />
                                      </div>
                                    </div>
                                    <div className="col-sm-12 col-md-2 col-lg-2 unit">
                                      <label
                                        className="label"
                                        style={{ color: "#848484" }}
                                      >
                                        Alto{" "}
                                      </label>
                                      <div className="input">
                                        <input
                                          style={{ backgroundColor: "#FFFFFF" }}
                                          className="form-control"
                                          type="text"
                                          disabled
                                          value={p.m_xAlto}
                                        />
                                      </div>
                                    </div>
                                    <div className="col-sm-12 col-md-3 col-lg-3 unit">
                                      <label
                                        className="label"
                                        style={{ color: "#848484" }}
                                      >
                                        Volumen{" "}
                                      </label>
                                      <div className="input">
                                        <input
                                          style={{ backgroundColor: "#FFFFFF" }}
                                          className="form-control"
                                          type="text"
                                          disabled
                                          value={
                                            p.m_xAlto * p.m_xAlto * p.m_xLargo
                                          }
                                        />
                                      </div>
                                    </div>
                                    <div className="col-sm-12 col-md-6 col-lg-3 unit">
                                      <label
                                        className="label"
                                        style={{ color: "#848484" }}
                                      >
                                        Tipo embalaje{" "}
                                      </label>
                                      <div className="input">
                                        <input
                                          style={{ backgroundColor: "#FFFFFF" }}
                                          className="form-control"
                                          type="text"
                                          disabled
                                          value={""}
                                        />
                                      </div>
                                    </div>
                                    <div className="col-sm-12 col-md-6 col-lg-3 unit">
                                      <label
                                        className="label"
                                        style={{ color: "#848484" }}
                                      >
                                        Valor Declarado{" "}
                                      </label>
                                      <div className="input">
                                        <input
                                          style={{ backgroundColor: "#FFFFFF" }}
                                          className="form-control"
                                          type="text"
                                          disabled
                                          value={p.m_cValorDeclarado}
                                        />
                                      </div>
                                    </div>
                                    <div className="col-sm-12 col-md-12 col-lg-3 unit">
                                      <label
                                        className="label"
                                        style={{ color: "#848484" }}
                                      >
                                        Descripción{" "}
                                      </label>
                                      <div className="input">
                                        <input
                                          style={{ backgroundColor: "#FFFFFF" }}
                                          className="form-control"
                                          type="text"
                                          disabled
                                          value={p.m_sDescripcion}
                                        />
                                      </div>
                                    </div>
                                    <div className="col-sm-12 col-md-12 col-lg-3 unit">
                                      <label
                                        className="label"
                                        style={{ color: "#848484" }}
                                      >
                                        Ctd{" "}
                                      </label>
                                      <div className="input">
                                        <input
                                          style={{ backgroundColor: "#FFFFFF" }}
                                          className="form-control"
                                          type="text"
                                          disabled
                                          value={p.ctd}
                                        />
                                      </div>
                                    </div>
                                    <div className="col-sm-12 col-md-12 unit">
                                      <label
                                        className="label"
                                        style={{ color: "#848484" }}
                                      >
                                        Observaciones{" "}
                                      </label>
                                      <div className="input">
                                        <input
                                          style={{ backgroundColor: "#FFFFFF" }}
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
                        style={{ padding: "10px" }}
                        align="center"
                      >
                        <button
                          className="btn btn-primary primary-btn"
                          style={{ margin: "10px" }}
                        >
                          Aceptar
                        </button>

                        <button
                          className="btn btn-secondary primary-btn"
                          style={{ margin: "10px" }}
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
