import React, { useEffect, useState, setData, useMemo, Component } from "react";

import axios from "axios";
import {
  ButtonBase,
  Checkbox,
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

import DataTable from "react-data-table-component";
import Cabecera from "../Components/Template/Cabecera";
import BarraLateralIzquierda from "../Components/Template/BarraLateralIzquierda";
import $ from "jquery";
import { useTable, useFilters, useSortBy } from "react-table";
import TextField from "@material-ui/core/TextField";
import Autocomplete from "@material-ui/lab/Autocomplete";

window.jQuery = window.$ = $;
const headers = {
  "Content-Type": "application/json",
};


function Informes(props) {
  const [stepActive, setStepActive] = React.useState(1);
  const [data, setData] = React.useState([]);

  const [dataSucursal, setDataSucursal] = React.useState([]);
  const [dataEstatusInformes, setEstatusInformes] = React.useState([]);
  const [dataOperadores, setDataOperadores] = React.useState([]);
  const [dataOrigenes, setDataOrigenes] = React.useState([]);
  const [dataUnidades, setDataUnidades] = React.useState([]);
  const [dataGuias, setDataGuias] = React.useState([]);
  const [guias, setGuias] = React.useState([
    {
      folio: "FE-100",
      estatus: "Documentada",
      total: "$30",
      destino: "Tijuana",
      servicio: "Unidad Completa",
      observaciones: "Los productos vienen sellados correctamente",
    },
    {
      folio: "FE-100",
      estatus: "Documentada",
      total: "$30",
      destino: "Tijuana",
      servicio: "Unidad Completa",
      observaciones: "Los productos vienen sellados correctamente",
    },
    {
      folio: "FE-100",
      estatus: "Documentada",
      total: "$30",
      destino: "Tijuana",
      servicio: "Unidad Completa",
      observaciones: "Los productos vienen sellados correctamente",
    },
    {
      folio: "FE-100",
      estatus: "Documentada",
      total: "$30",
      destino: "Tijuana",
      servicio: "Unidad Completa",
      observaciones: "Los productos vienen sellados correctamente",
    },
  ]);

    const columns = React.useMemo(() => [
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
      }
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
      <div className="col-md-12">
        <table className="table" {...getTableProps()}>
          <thead>
            {headerGroups.map((headerGroup) => (
              <tr {...headerGroup.getHeaderGroupProps()}>
                <th></th>
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
                <tr {...row.getRowProps()}>
                  <td>
                    <div>
                      <a
                        href="#Agregar"
                        role="tab"
                        data-toggle="tab"
                        onClick={() =>
                          handleShowModificar(row.original.m_nIdUnidad)
                        }
                        className="btn btn-default btn-sm m-user-edit"
                      >
                        <i className="zmdi zmdi-edit" />
                      </a>
                      <a
                        href="#"
                        className="btn btn-default btn-sm m-user-delete"
                        onClick={() => handleEliminar(row.original.m_nIdUnidad)}
                      >
                        <i className="zmdi zmdi-close" />
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








  const [state, setState] = React.useState({
    showPopUp: false,
    IdInforme: 0,
    FolioInforme: 0,
    Fecha: "",
    Hora: "",
    IdEstatusInforme: 0,
    IdViaje: 0,
    IdSucursalEmisora: 0,
    IdSucursalReceptora: 0,
    IdOperador: 0,
    IdUnidad: 0,
    IdRemolque: 0,
    IdCiudadDestino: 0,
    IdCiudadOrigen: 0,
    IdRuta: 0,
    FechaCancelacion: "",
    IdIdUsuarioCancelacion: 0,
    agregar: "Agregar",
    height: window.innerHeight
  });

  const selectGuia = (index) => {
    const newGuia = [...guias];

    newGuia[index]["select"] = newGuia[index].select ? false : true;
    console.log(newGuia);
    setGuias(newGuia);
  };

  function getAllGuiasFrom(origen,destino) {
    const url = `${process.env.REACT_APP_API_URL}/Guia/GetListadoPendientes/` + origen + "/" + destino;
    axios.get(url, { headers }).then((respuesta) => {
      console.log(respuesta);

      setDataGuias(respuesta.data);
    });
  }

  function getAllCiudades() {
    const url = `${process.env.REACT_APP_API_URL}/Ciudades/GetListado`;
    axios.get(url, { headers }).then((respuesta) => {
      console.log(respuesta);

      setDataOrigenes(respuesta.data);
    });
  }

  function getAllUnidades() {
    const url = `${process.env.REACT_APP_API_URL}/Unidades/GetListado`;
    axios.get(url, { headers }).then((respuesta) => {
      console.log(respuesta);

      setDataUnidades(respuesta.data);
    });
  }

  function getAllOperadores() {
    const url = `${process.env.REACT_APP_API_URL}/Operadores/GetListado`;
    axios.get(url, { headers }).then((respuesta) => {
      console.log(respuesta);

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

  function handleShowAgregar() {
    setState({
      ...state,
      agregar: "Agregar",
      showPopUp: true,
      IdGrupoUnidad: 0,
      Codigo: 0,
      GrupoUnidad: "",
      Color: "",
    });
  }

  function handleShowModificar(id) {
    console.log(id);
    const url = `${process.env.REACT_APP_API_URL}/Unidadd/GetById/` + id;
    axios.get(url, { headers }).then((respuesta) => {
      console.log(respuesta.data);
      setState({
        ...state,
       
      });
    });
  }

  function handleEliminar(id) {
    const url = `${process.env.REACT_APP_API_URL}/Unidadd/Eliminar/` + id;
    axios
      .get(url, { headers })
      .then((respuesta) => {
        console.log(respuesta);
      })
      .catch((err) => {
        alert(err);
      });
  }
  const handleChangeOrigenChange = event => {
    console.log(event.target.value)

    setState({
      ...state,
      idOrigen: event.target.value
    });
    //Aqui hacer la peticion
    //No se que peticion tienes que hacer, aqui lo haces
  };

  const handleChangeDestinoChange = event => {

    console.log(state.IdCiudadDestino)
    setState({
      ...state,
      idDestino: event.target.value
    });
    getAllGuiasFrom(state.IdCiudadOrigen, state.IdCiudadDestino)
  };

  const columns2 = React.useMemo(() => [
    {
      Name: "Folio/Serie",
      accessor: "m_nFolioInforme",
    },
    {
      Name: "Fecha",
      accessor: "m_dFecha",
    },
    {
      Name: "Hora Elaboración",
      accessor: "m_tHora",
    },
    {
      Name: "Viaje",
      accessor: "m_nIdViaje",
    },
    {
      Name: "Oficina Emisora",
      accessor: "m_nIdSucursalEmisora",
    },
    {
      Name: "Oficina Receptora",
      accessor: "m_nIdSucursalReceptora",
    },
    {
      Name: "Operador",
      accessor: "m_nIdOperador",
    },
    {
      Name: "Unidad",
      accessor: "m_nIdUnidad",
    },
    {
      Name: "Remolque",
      accessor: "m_nIdRemolque",
    },
    {
      Name: "Origen",
      accessor: "m_nIdCiudadOrigen",
    },
    {
      Name: "Destino",
      accessor: "m_nIdCiudadDestino",
    },
    {
      Name: "Ruta",
      accessor: "m_nIdRuta",
    },
    {
      Name: "Cancelado",
      accessor: "m_nIdEstatusInforme",
    },
    {
      Name: "Usuario que cancela",
      accessor: "m_nModificadoPor",
    },
  ]);

  useEffect((value) => {
    getAllData();
    getAllEstatusInformes();
    getAllSucursales();
    getAllOperadores();
    getAllUnidades();
    getAllCiudades();
  }, []);



  function getAllData() {
    const url = `${process.env.REACT_APP_API_URL}/Informes/GetListado`;
    axios.get(url, { headers }).then((respuesta) => {
      setData(respuesta.data);
    });
  }

  function openSection(index) {
    closeSeccions();
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
    closeSeccions();
  }, []);

  return (
    <div>
      <header className="topbar clearfix">
        <Cabecera />
      </header>
      {/*Topbar End Here*/}
      {/*Leftbar Start Here*/}
      <aside className="iconic-leftbar" style={{minHeight: state.height}}>
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
                  <li>
                    <a href="#">
                      Home <i className="zmdi zmdi-chevron-right" />
                    </a>
                  </li>
                  <li>
                    <a href="#">
                      Layout <i className="zmdi zmdi-chevron-right" />
                    </a>
                  </li>
                  <li className="active-page"> Dashboard</li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        <ul className="nav nav-tabs">
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
            <a data-toggle="tab" href="#Cancelar">
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
                  <div className="row">
                    <Table columns={columns} data={data} />
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
            {/*INICIO DE ESTRUCTURA */}
            <div className="row">
              <div className="col-md-12">
                <div className="widget-wrap">
                  <div className="widget-container margin-top-0">
                    <div className="widget-content">
                      <form className="j-forms j-multistep" id="j-forms">
                        {/*Inicio de ejemplo*/}

                        {/* start steps */}
                        <div
                          className="wizard-breadcrumb number-style"
                          style={{
                            position: "sticky",
                            top: "50px",
                            padding: "5px",
                            backgroundColor: "white",
                            zIndex: 100,
                          }}
                        >
                          <div className="row">
                            <div
                              className={
                                "col-md-4 col-sm-4 step " +
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
                                "col-md-4 col-sm-4 step " +
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
                                "col-md-4 col-sm-4 step " +
                                (stepActive == 3 && "active-step")
                              }
                              onClick={() => openSection(3)}
                            >
                              <div className="steps">
                                <span className="step-number">4</span>
                                <p>Detalles de Guias</p>
                              </div>
                            </div>
                            <div></div>
                          </div>
                        </div>
                        {/* end steps */}
                      </form>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="row">
              <div className="col-md-8">
                <div className="widget-wrap">
                  <div className="widget-container margin-top-0">
                    <div className="widget-content">
                      <div className="widget-container">
                        <div className="widget-content">
                          <div className="row">
                            <div className="col-md-12">
                              <div className="row">
                                <div className="col-md-12">
                                  <div className="widget-wrap">
                                    <div className="widget-header block-header margin-bottom-0 clearfix">
                                      <div className="pull-left">
                                        <h3>Información De Envio</h3>
                                      </div>
                                      <div className="pull-right w-action">
                                        <ul className="widget-action-bar">
                                          <li className="dropdown">
                                            <a
                                              href="#"
                                              className="dropdown-toggle"
                                              data-toggle="dropdown"
                                            >
                                              <i className="zmdi zmdi-more" />
                                            </a>
                                            <ul className="dropdown-menu">
                                              <li className="widget-reload">
                                                <a href="#">
                                                  <i className="zmdi zmdi-refresh-alt" />
                                                </a>
                                              </li>
                                              <li
                                                className="widget-toggle"
                                                id="infogral"
                                              >
                                                <a href="#">
                                                  <i className="zmdi zmdi-chevron-down" />
                                                </a>
                                              </li>
                                              <li className="widget-fullscreen">
                                                <a href="#">
                                                  <i className="zmdi zmdi-fullscreen" />
                                                </a>
                                              </li>
                                              <li className="widget-exit">
                                                <a href="#">
                                                  <i className="zmdi zmdi-power" />
                                                </a>
                                              </li>
                                            </ul>
                                          </li>
                                        </ul>
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
                                                  <div className="col-sm-6 col-md-2 unit">
                                                    <label className="label">
                                                      Sucursal
                                                    </label>
                                                    <label className="input select">
                                                      <select
                                                        className="form-control"
                                                        required
                                                        id="sucursal"
                                                      >
                                                        <option value="0">
                                                          Todas
                                                        </option>
                                                        {dataSucursal.map(
                                                          (sucursal) => (
                                                            <option
                                                              key={
                                                                sucursal.m_nIdSucursal
                                                              }
                                                              value={
                                                                sucursal.m_nIdSucursal
                                                              }
                                                            >
                                                              {
                                                                sucursal.m_sSucursal
                                                              }
                                                            </option>
                                                          )
                                                        )}
                                                      </select>
                                                    </label>
                                                  </div>
                                                  {/*****************************************Folio************************************************************/}
                                                  <div className="col-sm-12 col-md-2 unit">
                                                    <label className="label">
                                                      Folio
                                                    </label>
                                                    <div className="input">
                                                      <input
                                                        className="form-control"
                                                        type="text"
                                                        id="Folio"
                                                      />
                                                    </div>
                                                  </div>
                                                  {/*****************************************Fecha*******************************************************/}
                                                  <div className="col-sm-12 col-md-2 unit">
                                                    <label className="label">
                                                      Fecha
                                                    </label>
                                                    <div className="input">
                                                      <input
                                                        className="form-control"
                                                        type="text"
                                                        id="Fecha"
                                                      />
                                                    </div>
                                                  </div>
                                                  {/*****************************************Hora*******************************************************/}
                                                  <div className="col-sm-12 col-md-2 unit">
                                                    <label className="label">
                                                      Hora
                                                    </label>
                                                    <div className="input">
                                                      <input
                                                        className="form-control"
                                                        type="text"
                                                        id="Hora"
                                                      />
                                                    </div>
                                                  </div>
                                                  {/*****************************************Oficina Emisora***************************************************/}
                                                  <div className="col-sm-6 col-md-2 unit">
                                                    <label className="label">
                                                      Oficina Emisora
                                                    </label>
                                                    <label className="input select">
                                                      <select
                                                        className="form-control"
                                                        required
                                                        id="Oficina Emisora"
                                                      >
                                                        <option value="0">
                                                          Todas
                                                        </option>
                                                        {dataSucursal.map(
                                                          (sucursal) => (
                                                            <option
                                                              key={
                                                                sucursal.m_nIdSucursal
                                                              }
                                                              value={
                                                                sucursal.m_nIdSucursal
                                                              }
                                                            >
                                                              {
                                                                sucursal.m_sSucursal
                                                              }
                                                            </option>
                                                          )
                                                        )}
                                                      </select>
                                                    </label>
                                                  </div>
                                                  {/*****************************************Oficina Receptora*************************************************/}
                                                  <div className="col-sm-6 col-md-2 unit">
                                                    <label className="label">
                                                      Oficina Receptora
                                                    </label>
                                                    <label className="input select">
                                                      <select
                                                        className="form-control"
                                                        required
                                                        id="Oficina Receptora"
                                                      >
                                                        <option value="0">
                                                          Todas
                                                        </option>
                                                        {dataSucursal.map(
                                                          (sucursal) => (
                                                            <option
                                                              key={
                                                                sucursal.m_nIdSucursal
                                                              }
                                                              value={
                                                                sucursal.m_nIdSucursal
                                                              }
                                                            >
                                                              {
                                                                sucursal.m_sSucursal
                                                              }
                                                            </option>
                                                          )
                                                        )}
                                                      </select>
                                                    </label>
                                                  </div>
                                                </div>
                                                {/*****************************************Estatus de Entrega*************************************************/}
                                                <div className="row">
                                                  <div className="col-sm-6 col-md-3 unit">
                                                    <label className="label">
                                                      Estatus
                                                    </label>
                                                    <label className="input select">
                                                      <select
                                                        className="form-control"
                                                        required
                                                        id="estatus"
                                                      >
                                                        <option value="0">
                                                          Todos
                                                        </option>
                                                        {dataEstatusInformes.map(
                                                          (estatus) => (
                                                            <option
                                                              key={
                                                                estatus.m_nIdEstatusRecoleccion
                                                              }
                                                              value={
                                                                estatus.m_nIdEstatusRecoleccion
                                                              }
                                                            >
                                                              {
                                                                estatus.m_sEstatus
                                                              }
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
                                                      onChange={(
                                                        event,
                                                        newValue
                                                      ) =>
                                                        setState({
                                                          ...state,
                                                          idOperador: newValue,
                                                        })
                                                      }
                                                      placeholder={
                                                        state.idOperador
                                                      }
                                                      id="idOperador"
                                                      disableClearable
                                                      getOptionLabel={(
                                                        option
                                                      ) =>
                                                        option.m_sNombreCompleto
                                                      }
                                                      options={dataOperadores}
                                                      renderInput={(params) => (
                                                        <TextField
                                                          {...params}
                                                          InputProps={{
                                                            ...params.InputProps,
                                                            type: "search",
                                                          }}
                                                        />
                                                      )}
                                                    />{" "}
                                                  </div>
                                                </div>

                                                {/*****************************************Unidad*************************************************/}
                                                <div className="row">
                                                  <div className="col-sm-12 col-md-6 unit">
                                                    <label className="label">
                                                      Unidad
                                                    </label>
                                                    {/*  <input class="form-control" type="text" placeholder="Enter a letter" id="list-autocomplete" name="list-autocomplete"/> */}
                                                    <Autocomplete
                                                      freeSolo
                                                      onChange={(
                                                        event,
                                                        newValue
                                                      ) =>
                                                        setState({
                                                          ...state,
                                                          idUnidad: newValue,
                                                        })
                                                      }
                                                      placeholder={
                                                        state.idUnidad
                                                      }
                                                      id="idUnidad"
                                                      disableClearable
                                                      getOptionLabel={(
                                                        option
                                                      ) =>
                                                        option.m_sCodigo +
                                                        " " +
                                                        option.m_sDescripcion
                                                      }
                                                      options={dataUnidades}
                                                      renderInput={(params) => (
                                                        <TextField
                                                          {...params}
                                                          InputProps={{
                                                            ...params.InputProps,
                                                            type: "search",
                                                          }}
                                                        />
                                                      )}
                                                    />{" "}
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
                                                      Remolque
                                                    </label>
                                                    <div className="input">
                                                      <input
                                                        className="form-control"
                                                        type="text"
                                                        id="Remolque"
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

                                                {/*****************************************Origen*************************************************/}
                                                <div className="row">
                                                  <div className="col-sm-12 col-md-6 unit">
                                                    <label className="label">
                                                      Origen
                                                    </label>
                                                    {/*  <input class="form-control" type="text" placeholder="Enter a letter" id="list-autocomplete" name="list-autocomplete"/> */}
                                                    <Autocomplete
                                                      freeSolo
                                                      onChange={(event, newValue) => setState({...state, IdCiudadOrigen: newValue})}
                                                      placeholder={
                                                        state.idOrigen
                                                      }
                                                      id="idOrigen"
                                                      disableClearable
                                                      getOptionLabel={(
                                                        option
                                                      ) => option.m_sCiudad}
                                                      options={dataOrigenes}
                                                      renderInput={(params) => (
                                                        <TextField
                                                          {...params}
                                                          InputProps={{
                                                            ...params.InputProps,
                                                            type: "search",
                                                          }}
                                                        />
                                                      )}
                                                    />{" "}
                                                  </div>
                                                  {/*****************************************Destino*************************************************/}
                                                  <div className="col-sm-12 col-md-6 unit">
                                                    <label className="label">
                                                      Destino
                                                    </label>
                                                    {/*  <input class="form-control" type="text" placeholder="Enter a letter" id="list-autocomplete" name="list-autocomplete"/> */}
                                                    <Autocomplete
                                                      freeSolo
                                                      onChange={(event, newValue) => setState({...state, IdCiudadDestino: newValue}),handleChangeDestinoChange}
                                                      placeholder={
                                                        state.idDestino
                                                      }
                                                      id="idDestino"
                                                      disableClearable
                                                      getOptionLabel={(
                                                        option
                                                      ) => option.m_sCiudad}
                                                      options={dataOrigenes}
                                                      renderInput={(params) => (
                                                        <TextField
                                                          {...params}
                                                          InputProps={{
                                                            ...params.InputProps,
                                                            type: "search",
                                                          }}
                                                        />
                                                      )}
                                                    />{" "}
                                                  </div>
                                                </div>

                                                {/*****************************************Ruta*************************************************/}
                                                <div className="row">
                                                  <div className="col-sm-12 col-md-6 unit">
                                                    <label className="label">
                                                      Ruta
                                                    </label>
                                                    {/*  <input class="form-control" type="text" placeholder="Enter a letter" id="list-autocomplete" name="list-autocomplete"/> */}
                                                    <Autocomplete
                                                      freeSolo
                                                      onChange={(
                                                        event,
                                                        newValue
                                                      ) =>
                                                        setState({
                                                          ...state,
                                                          idRuta: newValue,
                                                        })
                                                      }
                                                      placeholder={state.idRuta}
                                                      id="idRuta"
                                                      disableClearable
                                                      getOptionLabel={(
                                                        option
                                                      ) => option.m_sCiudad}
                                                      options={dataOrigenes}
                                                      renderInput={(params) => (
                                                        <TextField
                                                          {...params}
                                                          InputProps={{
                                                            ...params.InputProps,
                                                            type: "search",
                                                          }}
                                                        />
                                                      )}
                                                    />{" "}
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
                              <div className="row">
                                <div className="col-md-12">
                                  <div className="widget-wrap">
                                    <div className="widget-header block-header margin-bottom-0 clearfix">
                                      <div className="pull-left">
                                        <h3>Asignar a un Viaje</h3>
                                      </div>
                                      <div className="pull-right w-action">
                                        <ul className="widget-action-bar">
                                          <li className="dropdown">
                                            <a
                                              href="#"
                                              className="dropdown-toggle"
                                              data-toggle="dropdown"
                                            >
                                              <i className="zmdi zmdi-more" />
                                            </a>
                                            <ul className="dropdown-menu">
                                              <li className="widget-reload">
                                                <a href="#">
                                                  <i className="zmdi zmdi-refresh-alt" />
                                                </a>
                                              </li>
                                              <li
                                                className="widget-toggle"
                                                id="caracteristicas"
                                              >
                                                <a href="#">
                                                  <i className="zmdi zmdi-chevron-down" />
                                                </a>
                                              </li>
                                              <li className="widget-fullscreen">
                                                <a href="#">
                                                  <i className="zmdi zmdi-fullscreen" />
                                                </a>
                                              </li>
                                              <li className="widget-exit">
                                                <a href="#">
                                                  <i className="zmdi zmdi-power" />
                                                </a>
                                              </li>
                                            </ul>
                                          </li>
                                        </ul>
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
                                                    <div className="input">
                                                      <input
                                                        className="form-control"
                                                        type="text"
                                                        id="Viaje"
                                                      />
                                                    </div>
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
                                                        id="Ruta2"
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
                                                        id="Operador2"
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
                                                        id="Unidad2"
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
                                                        id="Remolque2"
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
                    <div className="pull-right w-action">
                      <ul className="widget-action-bar">
                        <li className="dropdown">
                          <a
                            href="#"
                            className="dropdown-toggle"
                            data-toggle="dropdown"
                          >
                            <i className="zmdi zmdi-more" />
                          </a>
                          <ul className="dropdown-menu">
                            <li className="widget-reload">
                              <a href="#">
                                <i className="zmdi zmdi-refresh-alt" />
                              </a>
                            </li>
                            <li className="widget-toggle" id="seguros">
                              <a href="#">
                                <i className="zmdi zmdi-chevron-down" />
                              </a>
                            </li>
                            <li className="widget-fullscreen">
                              <a href="#">
                                <i className="zmdi zmdi-fullscreen" />
                              </a>
                            </li>
                            <li className="widget-exit">
                              <a href="#">
                                <i className="zmdi zmdi-power" />
                              </a>
                            </li>
                          </ul>
                        </li>
                      </ul>
                    </div>
                  </div>
                  <div className="widget-container">
                    <div className="widget-content">
                      <div className="row">
                        <div className="col-md-12">
                          <form action="#" className="j-forms" noValidate>
                            <div className="form-content">
                              {guias.map((value, index) => {
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
                                                  value={value.folio}
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
                                                  htmlFor={"estatus-" + index}
                                                >
                                                  Estatus Guía
                                                </label>
                                                <input
                                                  className="form-control"
                                                  type="text"
                                                  disabled="true"
                                                  value={value.estatus}
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
                                                  htmlFor={"destino-" + index}
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
                                                  htmlFor={"servicio-" + index}
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
                              <br/>
                              <Grid container style={{borderStyle: "solid",
                                    borderRadius: "10px"}} spacing={1}>
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
                                  {guias.filter((g) => g.select).length}
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
                                  <Grid container >
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
                                      <b style={{fontWeight: "bold"}}>Total General</b>
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
          </div>
        </div>
      </section>
    </div>
  );
}

export default Informes;
