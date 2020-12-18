import logo from "../logo.svg";
import "../App.css";

import React, { useEffect, useState, setData, useMemo, Component } from "react";

import axios from "axios";
import { FormControl, Input, InputLabel } from "@material-ui/core";

import DataTable from "react-data-table-component";
import Cabecera from "../Components/Template/Cabecera";
import BarraLateralIzquierda from "../Components/Template/BarraLateralIzquierda";
import $ from "jquery";
window.jQuery = window.$ = $;
const headers = {
  "Content-Type": "application/json",
};

function App(props) {
  const columns = useMemo(() => [
    {
      cell: (row) => (
        <div>
          <a
            data-toggle="tab"
            data-target="#Agregar"
            onClick={() => handleShowModificar(row.m_nIdUnidad)}
            className="btn btn-default btn-sm m-user-edit"
          >
            <i className="zmdi zmdi-edit" />
          </a>
          <a
            href="#"
            onClick={() => handleElimiar(row.m_nIdUnidad)}
            className="btn btn-default btn-sm m-user-delete"
          >
            <i className="zmdi zmdi-close" />
          </a>
        </div>
      ),
      ignoreRowClick: true,
      allowOverflow: true,
      button: true,
    },
    {
      name: "IdOperador",
      selector: "m_nIdOperador",
      type: "int",
      omit: "true",
    },
    {
      visible: true,
      name: "Código",
      selector: "m_nNumeroOperador",
    },
    {
      visible: true,
      name: "Nombre",
      selector: "m_sNombreCompleto",
    },
    {
      visible: true,
      name: "Sucursal",
      selector: "m_sSucursal",
    },
    {
      visible: true,
      name: "Activo",
      selector: "m_bActivo",
    },
  ]);

  const [data, setData] = React.useState([]);
  const [state, setState] = React.useState({
    agregar: "Agregar",
  });
  const [dataSucursales, setDataSucursales] = React.useState([]);
  const [dataOperadores, setDataOperador] = React.useState([]);

  const [dataPais, setDataPais] = React.useState([]);

  const [dataEstado, setDataEstado] = React.useState([]);

  useEffect((value) => {
    getAllSucursales();
    getAllPaises();
    getAllOperadores();
  }, []);

  function getAllOperadores() {
    const url = "http://localhost/Operadores/GetListado";
    axios.get(url, { headers }).then((respuesta) => {
      console.log(respuesta);

      setDataOperador(respuesta.data);
    });
  }

  function getAllSucursales() {
    const url = "http://localhost/Sucursales/GetListado";
    axios.get(url, { headers }).then((respuesta) => {
      setDataSucursales(respuesta.data);
    });
  }

  function getAllPaises() {
    const url = "http://localhost/Pais/GetListado";
    axios.get(url, { headers }).then((respuesta) => {
      console.log(respuesta);

      setDataPais(respuesta.data);
    });
  }

  function handleElimiar(id) {
    const url = "http://localhost/Unidad/Eliminar/" + id;
    axios
      .get(url, { headers })
      .then((respuesta) => {
        console.log(respuesta);
      })
      .catch((err) => {
        alert(err);
      });
  }

  const handleChange = (event) => {
    console.log(event.target.name + " : " + event.target.value);
    setState({
      ...state,
      [event.target.name]: event.target.value,
    });
  };

  function handleShowModificar(id) {}

  function handleShowModificar(id) {}

  const getModificar = (id) => {
    const url = "http://localhost/Unidad/GetById/" + id;
    axios.get(url, { headers }).then((respuesta) => {
      console.log(respuesta.data);

      setState({
        ...state,

        idUnidad: id,
        codigoUnidad: respuesta.data.m_sCodigo,
        descripcionUnidad: respuesta.data.m_sDescripcion,
      });
    });
  };

  const [stepActive, setStepActive] = React.useState(1);

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
        $section = $("#general");

        break;
      case 3:
        setStepActive(3);
        $section = $("#liquidaciones");

        break;
      case 4:
        setStepActive(4);
        $section = $("#mas");
        break;
      case 5:
        setStepActive(5);
        $section = $("#incidencias");
        break;
      case 6:
        setStepActive(6);
        $section = $("#appmoviles");
        break;
      case 7:
        setStepActive(7);
        $section = $("#fotosdocs");
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
      <aside className="iconic-leftbar">
        <BarraLateralIzquierda />
      </aside>
      {/*Leftbar End Here*/}
      {/*Page Container Start Here*/}
      <section className="main-container">
        <div className="container-fluid">
          <div className="page-header filled full-block light">
            <div className="row">
              <div className="col-md-6 col-sm-6">
                <h2>Operadores</h2>
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

          <ul className="nav nav-tabs">
            <li className="active">
              <a data-toggle="tab" href="#Listado">
                Listado
              </a>
            </li>
            <li>
              <a data-toggle="tab" href="#Agregar">
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
            <div id="Listado" className="tab-pane fade in active">
              <DataTable
                title="Listado de Operadores"
                columns={columns}
                data={dataOperadores}
              />
            </div>
            <div id="Importar" className="tab-pane fade "></div>
            <div id="Imprimir" className="tab-pane fade ">
              Imprimir
            </div>

            <div id="Agregar" className="tab-pane fade">
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
                              zIndex: 7,
                            }}
                          >
                            <div className="row">
                              <div
                                className={
                                  "col-md-2 col-sm-3 step " +
                                  (stepActive == 1 && "active-step")
                                }
                                onClick={() => openSection(1)}
                              >
                                <div className={"steps"}>
                                  <span className={"step-number"}>1</span>
                                  <p>Información General</p>
                                </div>
                              </div>
                              <div
                                className={
                                  "col-md-2 col-sm-3 step " +
                                  (stepActive == 2 && "active-step")
                                }
                                onClick={() => openSection(2)}
                              >
                                <div className="steps">
                                  <span className="step-number">2</span>
                                  <p>General</p>
                                </div>
                              </div>
                              <div
                                className={
                                  "col-md-1 col-sm-3 step " +
                                  (stepActive == 3 && "active-step")
                                }
                                onClick={() => openSection(3)}
                              >
                                <div className="steps">
                                  <span className="step-number">3</span>
                                  <p>Liquidaciones CFDI</p>
                                </div>
                              </div>
                              <div
                                className={
                                  "col-md-2 col-sm-3 step " +
                                  (stepActive == 4 && "active-step")
                                }
                                onClick={() => openSection(4)}
                              >
                                <div className="steps">
                                  <span className="step-number">4</span>
                                  <p>Más Información</p>
                                </div>
                              </div>
                              <div
                                className={
                                  "col-md-1 col-sm-2 step " +
                                  (stepActive == 5 && "active-step")
                                }
                                onClick={() => openSection(5)}
                              >
                                <div className="steps">
                                  <span className="step-number">5</span>
                                  <p>Incidencias</p>
                                </div>
                              </div>
                              <div
                                className={
                                  "col-md-2 col-sm-2 step " +
                                  (stepActive == 6 && "active-step")
                                }
                                onClick={() => openSection(6)}
                              >
                                <div className="steps">
                                  <span className="step-number">6</span>
                                  <p>App. Móviles</p>
                                </div>
                              </div>
                              <div
                                className={
                                  "col-md-2 col-sm-2 step " +
                                  (stepActive == 7 && "active-step")
                                }
                                onClick={() => openSection(7)}
                              >
                                <div className="steps">
                                  <span className="step-number">7</span>
                                  <p>Fotos / Documentos</p>
                                </div>
                              </div>
                            </div>
                          </div>
                          {/* end steps */}

                          <div className="row">
                            <div className="col-md-12 col-sm-12">
                              <div className="widget-wrap">
                                <div className="widget-header block-header margin-bottom-0 clearfix">
                                  <div className="pull-left">
                                    <h3>Información General</h3>
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
                                            {/* start text password */}
                                            <div className="row">
                                              <div className="col-md-4 unit">
                                                <label className="label">
                                                  Número
                                                </label>
                                                <div className="input">
                                                 
                                                  <input
                                                    onChange={value}
                                                    className="form-control"
                                                    type="text"
                                                    placeholder="Número"
                                                    id="text"
                                                  />
                                                </div>
                                              </div>
                                              <div className="col-md-4 unit">
                                                <div className="inline-group">
                                                  <label className="label">
                                                    Estado del Operador
                                                  </label>
                                                  <label className="checkbox">
                                                    <input
                                                      required
                                                      native
                                                      name="activo"
                                                      type="checkbox"
                                                    />
                                                    <i />
                                                    Activo
                                                  </label>
                                                </div>
                                              </div>
                                              <div className="col-md-4 unit">
                                                <img
                                                  src="src\Views\operador.png"
                                                  class="rounded float-right"
                                                  alt="..."
                                                />
                                              </div>
                                            </div>
                                            {/* end text password */}
                                            {/* start email url */}
                                            <div className="row">
                                              <div className="col-md-3 unit">
                                                <label className="label">
                                                  Apellido Paterno
                                                </label>
                                                <div className="input">
                                                 
                                                  <input
                                                    className="form-control"
                                                    type="text"
                                                    placeholder=""
                                                    id="text"
                                                    required
                                                    native
                                                  />
                                                </div>
                                              </div>
                                              <div className="col-md-3 unit">
                                                <label className="label">
                                                  Apellido Materno
                                                </label>
                                                
                                                  <div className="input">
                                                  

                                                    <input
                                                      className="form-control"
                                                      type="text"
                                                      placeholder=""
                                                      id="text"
                                                      required
                                                      native
                                                    />
                                                  </div>{" "}
                                              </div>
                                              <div className="col-md-3 unit">
                                                <label className="label">
                                                  Nombre
                                                </label>
                                                <div className="input">
                                              
                                                    

                                                    <input
                                                      className="form-control"
                                                      type="text"
                                                      placeholder=""
                                                      id="text"
                                                      required
                                                      native
                                                    />
                                                  </div>{" "}
                                              </div>
                                              <div className="col-md-3 unit">
                                                <label className="label">
                                                  Foto del Operador
                                                </label>
                                                <div className="input prepend-small-btn">
                                                  <div className="file-button">
                                                    Browse
                                                    <input
                                                      className="btn btn-success"
                                                      type="file"
                                                      onChange="document.getElementById('prepend-small-btn').value = this.value;"
                                                    />
                                                  </div>
                                                  <input
                                                    className="form-control"
                                                    type="text"
                                                    id="prepend-small-btn"
                                                    readOnly
                                                    placeholder="no file selected"
                                                  />
                                                </div>
                                              </div>
                                            </div>
                                            <div className="unit">
                                              <label className="label">
                                                Nombre Completo
                                              </label>
                                              <div className="input">
                                              

                                                  <input
                                                    className="form-control"
                                                    type="text"
                                                    placeholder=""
                                                    id="text"
                                                    required
                                                    native
                                                  />
                                                </div>{" "}
                                            </div>

                                            {/* end search */}
                                            {/* start textarea */}

                                            <div className="row">
                                              <div className="col-md-4 unit">
                                                <label className="label">
                                                  RFC
                                                </label>
                                                <div className="input">
                                                  
                                                  <input
                                                    className="form-control"
                                                    type="text"
                                                    placeholder=""
                                                    id="text"
                                                    required
                                                    native
                                                  />
                                                </div>
                                              </div>
                                              <div className="col-md-4 unit">
                                                <label className="label">
                                                  CURP
                                                </label>
                                                <div className="input">
                                               

                                                  <input
                                                    class="form-control"
                                                    type="text"
                                                    id="hex"
                                                    native
                                                    name="colorUnidad"
                                                  />
                                                </div>{" "}
                                              </div>
                                              <div className="col-md-4 unit">
                                                <label className="label">
                                                  Fecha de Contratación
                                                </label>
                                                <div className="input">
                                                
                                                  <input
                                                    className="form-control"
                                                    type="text"
                                                    placeholder=""
                                                  />
                                                </div>
                                              </div>
                                            </div>

                                            <div className="row">
                                              <div className="col-md-4 unit">
                                                <label className="label">
                                                  Sucursal
                                                </label>
                                                <label className="input select">
                                                  <select
                                                    native
                                                    className="form-control"
                                                    name="sucursal"
                                                  >
                                                    <option value="none">
                                                      Sucursal
                                                    </option>

                                                    {dataSucursales.map(
                                                      (sucursal) => (
                                                        <option value="{sucursal.m_nIdSucursal}">
                                                          {sucursal.m_sSucursal}
                                                        </option>
                                                      )
                                                    )}
                                                  </select>
                                                  <i></i>
                                                </label>
                                              </div>
                                              <div className="col-md-4 unit">
                                                <label className="label">
                                                  Teléfono
                                                </label>
                                                <div className="input">
                                              

                                                  <input
                                                    className="form-control"
                                                    type="text"
                                                    placeholder=""
                                                    id="text"
                                                    native
                                                  />
                                                </div>
                                              </div>
                                              <div className="col-md-4 unit">
                                                <label className="label">
                                                  Tel. Celular
                                                </label>
                                                <div className="input">
                                                
                                                  <input
                                                    className="form-control"
                                                    type="text"
                                                    placeholder=""
                                                    id="text"
                                                    native
                                                  />
                                                </div>{" "}
                                              </div>
                                            </div>
                                            <div className="unit">
                                              <label className="label">
                                                Domicilio
                                              </label>
                                              <div className="input">
                                               
                                                <input
                                                  className="form-control"
                                                  type="text"
                                                  placeholder=""
                                                  id="text"
                                                  native
                                                />
                                              </div>{" "}
                                            </div>
                                            <div className="row">
                                              <div className="col-md-6 unit">
                                                <label className="label">
                                                  País
                                                </label>
                                                <label className="input select">
                                                  <select
                                                    onChange={(value) =>
                                                      props.input.onChange(
                                                        value
                                                      )
                                                    }
                                                    className="form-control"
                                                    required
                                                    native
                                                    name="pais"
                                                  >
                                                    <option value="none">
                                                      País
                                                    </option>

                                                    {dataPais.map((pais) => (
                                                      <option value="{pais.m_nIdPais}">
                                                        {pais.m_sPais}
                                                      </option>
                                                    ))}
                                                  </select>
                                                  <i></i>
                                                </label>
                                              </div>
                                              <div className="col-md-6 unit">
                                                <label className="label">
                                                  Estado
                                                </label>
                                                <label className="input select">
                                                  <select
                                                    className="form-control"
                                                    required
                                                    native
                                                    name="estado"
                                                  >
                                                    <option value="none">
                                                      Estado
                                                    </option>

                                                    {dataEstado.map(
                                                      (estado) => (
                                                        <option value="{estado.m_nIdEstado}">
                                                          {estado.m_sEstado}
                                                        </option>
                                                      )
                                                    )}
                                                  </select>
                                                  <i></i>
                                                </label>
                                              </div>
                                            </div>
                                            <div className="unit">
                                              <label className="label">
                                                Hash GMT GPS
                                              </label>
                                              <div className="input">
                                                
                                                <input
                                                  className="form-control"
                                                  type="text"
                                                  placeholder=""
                                                  id="text"
                                                  native
                                                />
                                              </div>{" "}
                                            </div>
                                          </div>
                                          {/* end textarea */}
                                        </form>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              </div>
                              {/*Fin de ejemplo*/}
                            </div>
                          </div>

                          <div className="row">
                            <div className="col-md-12 col-sm-12">
                              <div className="widget-wrap">
                                <div className="widget-header block-header margin-bottom-0 clearfix">
                                  <div className="pull-left">
                                    <h3>General</h3>
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
                                            id="general"
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
                                            {/* start text password */}
                                            <div className="row">
                                              <div className="col-md-4 unit ">
                                                <div className="row">
                                                  <div className="w-section-header">
                                                    <h3>Documentos</h3>
                                                  </div>
                                                  <div className="col-md-8 unit">
                                                    <label className="label">
                                                      Licencia
                                                    </label>
                                                    <div className="input">
                                                     
                                                      <input
                                                        className="form-control"
                                                        type="text"
                                                        placeholder=""
                                                        id="text"
                                                        native
                                                      />
                                                    </div>{" "}
                                                  </div>
                                                  <div className="col-md-4 unit">
                                                    <label className="label">
                                                      Vencimiento
                                                    </label>
                                                    <div className="input">
                                                    
                                                    <input  class="form-control" type="text" id="date-icon" placeholder="12/20/2020" readonly=""/>

                                                    </div>
                                                  </div>
                                                </div>
                                                <div className="unit">
                                                  <div className="inline-group">
                                                    <label className="label">
                                                      Tipo de Licencia
                                                    </label>
                                                    <label className="checkbox">
                                                      <input
                                                        type="checkbox"
                                                        name="A"
                                                        defaultChecked
                                                      />
                                                      <i />A
                                                    </label>
                                                    <label className="checkbox">
                                                      <input
                                                        type="checkbox"
                                                        name="B"
                                                      />
                                                      <i />B
                                                    </label>
                                                    <label className="checkbox">
                                                      <input
                                                        type="checkbox"
                                                        name="C"
                                                      />
                                                      <i />C
                                                    </label>
                                                  </div>
                                                </div>
                                                <div className="row">
                                                  <div className="col-md-8 unit">
                                                    <label className="label">
                                                      Pasaporte
                                                    </label>
                                                    <div className="input">
                                                     
                                                      <input
                                                        className="form-control"
                                                        type="text"
                                                        placeholder=""
                                                        id="text"
                                                        native
                                                      />
                                                    </div>{" "}
                                                  </div>
                                                  <div className="col-md-4 unit">
                                                    <label className="label">
                                                      Vencimiento
                                                    </label>
                                                    <div className="input">
                                                      
                                                    <input  class="form-control" type="text" id="date-icon" placeholder="12/20/2020" readonly=""/>

                                                    </div>
                                                  </div>
                                                </div>
                                                <div className="row">
                                                  <div className="w-section-header">
                                                    <h3>Datos Hospitalarios</h3>
                                                  </div>
                                                  <div className="col-md-4">
                                                    <label className="label">
                                                      Núm. IMSS
                                                    </label>
                                                    <div className="input">
                                                    
                                                      <input
                                                        className="form-control"
                                                        type="text"
                                                        placeholder=""
                                                        id="text"
                                                        native
                                                      />
                                                    </div>{" "}
                                                  </div>
                                                  <div className="col-md-8">
                                                    <label className="label">
                                                      Grupo Sanguineo
                                                    </label>

                                                    <label className="input select">
                                                      <select
                                                        native
                                                        className="form-control"
                                                        name="operador"
                                                      >
                                                        <option value="A+">
                                                          A positivo
                                                        </option>
                                                        <option value="A-">
                                                          A Negativo
                                                        </option>
                                                        <option value="B+">
                                                          B Positivo
                                                        </option>
                                                        <option value="B-">
                                                          B Negativo
                                                        </option>
                                                        <option value="O+">
                                                          O Positivo
                                                        </option>
                                                        <option value="O-">
                                                          O Negativo
                                                        </option>
                                                      </select>
                                                      <i></i>
                                                    </label>
                                                  </div>
                                                </div>
                                              </div>
                                              <div className="col-md-4 unit bordeslaterales">
                                                <div className="row">
                                                  <div className="w-section-header">
                                                    <h3>Cuenta Bancaria</h3>
                                                  </div>
                                                  <div className="unit">
                                                    <label className="label">
                                                      Núm. IMSS
                                                    </label>
                                                    <div className="input">
                                                    
                                                      <input
                                                        className="form-control"
                                                        type="text"
                                                        placeholder=""
                                                        id="text"
                                                        native
                                                      />
                                                    </div>{" "}
                                                  </div>
                                                  <div className="unit">
                                                    <label className="label">
                                                      Cuenta CLABE
                                                    </label>
                                                    <div className="input">
                                                     
                                                      <input
                                                        className="form-control"
                                                        type="text"
                                                        placeholder=""
                                                        id="text"
                                                        native
                                                      />
                                                    </div>{" "}
                                                  </div>
                                                  <div className="unit">
                                                    <label className="label">
                                                      Núm. Tarjeta
                                                    </label>
                                                    <div className="input">
                                                  
                                                      <input
                                                        className="form-control"
                                                        type="text"
                                                        placeholder=""
                                                        id="text"
                                                        native
                                                      />
                                                    </div>{" "}
                                                  </div>
                                                  <div className="unit">
                                                    <div className="w-section-header">
                                                      <h3>Observaciones</h3>
                                                    </div>
                                                    <div className="input">
                                                    
                                                      <input
                                                        className="form-control"
                                                        type="text"
                                                        placeholder=""
                                                        id="text"
                                                        native
                                                      />
                                                    </div>{" "}
                                                  </div>
                                                </div>
                                              </div>

                                              <div className="col-md-4 unit">
                                                <div className="row">
                                                  <div className="w-section-header">
                                                    <h3>
                                                      Vencimiento de Documentos
                                                    </h3>
                                                  </div>
                                                  <div className="unit">
                                                    <div className="j-row toclone-widget-right toclone">
                                                      <div className="span4 unit">
                                                        <div className="input">
                                                          <input
                                                            className="form-control"
                                                            type="text"
                                                            placeholder="Documento"
                                                          />
                                                        </div>
                                                      </div>
                                                      <div className="span3 unit">
                                                        <div className="input">
                                                          <input
                                                            className="form-control"
                                                            type="text"
                                                            placeholder="Nombre"
                                                          />
                                                        </div>
                                                      </div>
                                                      <div className="span2 unit">
                                                        <div className="input">
                                                          <label className="checkbox">
                                                            <input
                                                              required
                                                              native
                                                              name="activo"
                                                              type="checkbox"
                                                            />
                                                            <i />
                                                          </label>
                                                        </div>
                                                      </div>
                                                      <div className="span3 unit">
                                                        <div className="input">
                                                          <div className="input">
                                                            
                                                          <input  class="form-control" type="text" id="date-icon" placeholder="12/20/2020" readonly=""/>

                                                          </div>
                                                        </div>
                                                      </div>
                                                      <button
                                                        type="button"
                                                        className="btn btn-primary clone-btn-right clone"
                                                      >
                                                        <i className="fa fa-plus" />
                                                      </button>
                                                      <button
                                                        type="button"
                                                        className="btn btn-secondary clone-btn-right delete"
                                                      >
                                                        <i className="fa fa-minus" />
                                                      </button>
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
                                </div>
                              </div>
                              {/*Fin de ejemplo*/}
                            </div>
                          </div>
                          <div className="row">
                            <div className="col-md-12 col-sm-12">
                              <div className="widget-wrap">
                                <div className="widget-header block-header margin-bottom-0 clearfix">
                                  <div className="pull-left">
                                    <h3>Liquidaciones CFDI</h3>
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
                                            id="liquidaciones"
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
                                            {/* start text password */}
                                            <div className="row">
                                              <div className="col-sm-12 col-md-4 unit">
                                                <label className="label">
                                                  Tipo de Regimen
                                                </label>
                                                <label className="input select">
                                                  <select className="form-control">
                                                    <option value="none">
                                                      Sueldos
                                                    </option>
                                                  </select>
                                                  <i></i>
                                                </label>
                                              </div>
                                              <div className="col-sm-12 col-md-4 unit">
                                                <label className="label">
                                                  Departamento
                                                </label>
                                                <label className="input select">
                                                  <select className="form-control">
                                                    <option value="none">
                                                      Informática
                                                    </option>
                                                  </select>
                                                  <i></i>
                                                </label>
                                              </div>
                                              <div className="col-sm-12 col-md-4 unit">
                                                <label className="label">
                                                  Tipo de Contrato
                                                </label>
                                                <label className="input select">
                                                  <select className="form-control">
                                                    <option value="none">
                                                      Contrato de trabajo por
                                                      tiempo indeterminado
                                                    </option>
                                                  </select>
                                                  <i></i>
                                                </label>
                                              </div>
                                            </div>

                                            <div className="row">
                                              <div className="col-sm-12 col-md-4 unit">
                                                <label className="label">
                                                  Tipo de Jornada
                                                </label>
                                                <label className="input select">
                                                  <select className="form-control">
                                                    <option value="none">
                                                      Nocturno
                                                    </option>
                                                  </select>
                                                  <i></i>
                                                </label>
                                              </div>

                                              <div className="col-sm-12 col-md-4 unit">
                                                <label className="label">
                                                  Periodicidad de pago
                                                </label>
                                                <label className="input select">
                                                  <select className="form-control">
                                                    <option value="none">
                                                      Catorcena
                                                    </option>
                                                  </select>
                                                  <i></i>
                                                </label>
                                              </div>
                                              <div className="col-sm-12 col-md-4 unit">
                                                <label className="label">
                                                  Riesgo del Puesto
                                                </label>
                                                <label className="input select">
                                                  <select className="form-control">
                                                    <option value="none">
                                                      Clase 1
                                                    </option>
                                                  </select>
                                                  <i></i>
                                                </label>
                                              </div>
                                            </div>

                                            <div className="row">
                                              <div className="col-sm-12 col-md-4 unit">
                                                <label className="label">
                                                  Correo
                                                </label>
                                                <div className="input">
                                                 
                                                  <input
                                                    className="form-control"
                                                    type="text"
                                                    placeholder=""
                                                    id="text"
                                                    native
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
                              </div>
                              {/*Fin de ejemplo*/}
                            </div>
                          </div>
                          <div className="row">
                            <div className="col-md-12 col-sm-12">
                              <div className="widget-wrap">
                                <div className="widget-header block-header margin-bottom-0 clearfix">
                                  <div className="pull-left">
                                    <h3>Más Información</h3>
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
                                            id="mas"
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
                                            {/* start text password */}
                                            <div className="row">
                                              <div className="col-sm-12 col-md-3 unit">
                                                <label className="label">
                                                  Tipo de operación
                                                </label>
                                                <label className="input select">
                                                  <select className="form-control">
                                                    <option value="none">
                                                      1) Carretero
                                                    </option>
                                                  </select>
                                                  <i></i>
                                                </label>
                                              </div>
                                              <div className="col-sm-6 col-md-2 col-lg-3 unit">
                                                <label className="label">
                                                  Fecha de vencimiento
                                                </label>
                                                <div className="input">
                                                  
                                                <input  class="form-control" type="text" id="date-icon" placeholder="12/20/2020" readonly=""/>

                                                </div>
                                              </div>
                                              <div className="col-sm-12 col-md-3 unit">
                                                <label className="label">
                                                  Estado Civil
                                                </label>
                                                <label className="input select">
                                                  <select className="form-control">
                                                    <option value="none">
                                                      Soltero
                                                    </option>
                                                    <option value="none">
                                                      Casado
                                                    </option>
                                                  </select>
                                                  <i></i>
                                                </label>
                                              </div>
                                              <div className="col-sm-6 col-md-2  col-lg-3 unit">
                                                <label className="label">
                                                  Factor VSM Infonavit
                                                </label>
                                                <div className="input">
                                                
                                                  <input
                                                    className="form-control"
                                                    type="text"
                                                    placeholder=""
                                                  />
                                                </div>
                                              </div>
                                            </div>
                                            <div className="row">
                                              <div className="col-sm-6 col-md-2 col-lg-3 unit">
                                                <label className="label">
                                                  Beneficiario de Fallecimiento
                                                </label>
                                                <div className="input">
                                                  
                                                  <input
                                                    className="form-control"
                                                    type="text"
                                                    placeholder=""
                                                    id="text"
                                                  />
                                                </div>
                                              </div>
                                              <div className="col-sm-6 col-md-2 col-lg-3 unit">
                                                <label className="label">
                                                  Factor % Infonavit
                                                </label>
                                                <div className="input">
                                                  
                                                  <input
                                                    className="form-control"
                                                    type="text"
                                                    placeholder=""
                                                    id="text"
                                                  />
                                                </div>
                                              </div>
                                              <div className="col-sm-6 col-md-2 col-lg-3 unit">
                                                <label className="label">
                                                  En caso de accidente avisar a
                                                </label>
                                                <div className="input">
                                                  
                                                  <input
                                                    className="form-control"
                                                    type="text"
                                                    placeholder=""
                                                    id="text"
                                                  />
                                                </div>
                                              </div>
                                              <div className="col-sm-6 col-md-2 col-lg-3 unit">
                                                <label className="label">
                                                  Retención Diaria Infonavit
                                                </label>
                                                <div className="input">
                                                  
                                                  <input
                                                    className="form-control"
                                                    type="text"
                                                    placeholder=""
                                                    id="text"
                                                  />
                                                </div>
                                              </div>
                                            </div>
                                            <div className="row">
                                              <div className="col-sm-12 col-md-3 unit">
                                                <label className="label">
                                                  Puesto
                                                </label>
                                                <label className="input select">
                                                  <select className="form-control">
                                                    <option value="none">
                                                      Asesor
                                                    </option>
                                                    <option value="none">
                                                      Administrador
                                                    </option>

                                                    <option value="none">
                                                      Operador
                                                    </option>
                                                  </select>
                                                  <i></i>
                                                </label>
                                              </div>
                                              <div className="col-sm-6 col-md-2 col-lg-3 unit">
                                                <label className="label">
                                                  Retención Diaria Fonacot
                                                </label>
                                                <div className="input">
                                                  
                                                  <input
                                                    className="form-control"
                                                    type="text"
                                                    placeholder=""
                                                    id="text"
                                                  />
                                                </div>
                                              </div>
                                            </div>
                                            {/* end text password */}
                                            {/* start email url */}

                                            {/* end textarea */}
                                          </div>
                                        </form>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              </div>
                              {/*Fin de ejemplo*/}
                            </div>
                          </div>
                          <div className="row">
                            <div className="col-md-12 col-sm-12">
                              <div className="widget-wrap">
                                <div className="widget-header block-header margin-bottom-0 clearfix">
                                  <div className="pull-left">
                                    <h3>Incidencias</h3>
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
                                            id="incidencias"
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
                                            {/* start text password */}
                                            <div className="unit">
                                              <div className="j-row toclone-widget-right toclone">
                                                <div className="span3 unit">
                                                  <label className="label">
                                                    Incidencia
                                                  </label>
                                                  <label className="input select">
                                                    <select className="form-control">
                                                      <option value="none">
                                                        Incidencia
                                                      </option>
                                                      <option value="none">
                                                        Indisciplina
                                                      </option>

                                                      <option value="none">
                                                        Accidente
                                                      </option>

                                                      <option value="none">
                                                        Tecate
                                                      </option>
                                                    </select>
                                                    <i></i>
                                                  </label>
                                                </div>
                                                <div className="span3 unit">
                                                  <div className="input">
                                                    <label className="label">
                                                      Fecha
                                                    </label>
                                                    <div className="input">
                                                     
                                                    <input  class="form-control" type="text" id="date-icon" placeholder="12/20/2020" readonly=""/>

                                                    </div>
                                                  </div>
                                                </div>
                                                <div className="span6 unit">
                                                  <div className="input">
                                                    <label className="label">
                                                      Observaciones
                                                    </label>
                                                    <div className="input">
                                                    
                                                      <input
                                                        className="form-control"
                                                        type="text"
                                                        placeholder=""
                                                        id="text"
                                                      />
                                                    </div>
                                                  </div>
                                                </div>

                                                <button
                                                  type="button"
                                                  className="btn btn-primary clone-btn-right clone"
                                                >
                                                  <i className="fa fa-plus" />
                                                </button>
                                                <button
                                                  type="button"
                                                  className="btn btn-secondary clone-btn-right delete"
                                                >
                                                  <i className="fa fa-minus" />
                                                </button>
                                              </div>
                                            </div>
                                          </div>
                                        </form>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              </div>
                              {/*Fin de ejemplo*/}
                            </div>
                          </div>
                          <div className="row">
                            <div className="col-md-12 col-sm-12">
                              <div className="widget-wrap">
                                <div className="widget-header block-header margin-bottom-0 clearfix">
                                  <div className="pull-left">
                                    <h3>App. Móviles</h3>
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
                                            id="appmoviles"
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
                                              <div className="col-md-2 unit">
                                                <label className="label"></label>
                                                <label className="checkbox">
                                                  <input
                                                    required
                                                    native
                                                    name="activo"
                                                    type="checkbox"
                                                  />
                                                  <i />
                                                  App Mis Viajes
                                                </label>
                                              </div>
                                              <div className="col-md-4 unit">
                                                {" "}
                                                <label className="label">
                                                  Usuario
                                                </label>
                                                <div className="input">
                                                  
                                                  <input
                                                    className="form-control"
                                                    type="text"
                                                    placeholder=""
                                                    id="text"
                                                  />
                                                </div>
                                              </div>
                                              <div className="col-md-4 unit">
                                                {" "}
                                                <label className="label">
                                                  Contraseña
                                                </label>
                                                <div className="input">
                                                  
                                                  <input
                                                    className="form-control"
                                                    type="password"
                                                    placeholder=""
                                                    id="password"
                                                  />
                                                </div>
                                              </div>
                                            </div>
                                            <div className="row">
                                              <div className="col-md-2 unit">
                                                <label className="label"></label>
                                                <label className="checkbox">
                                                  <input
                                                    required
                                                    native
                                                    name="activo"
                                                    type="checkbox"
                                                  />
                                                  <i />
                                                  App Paquetería
                                                </label>
                                              </div>
                                              <div className="col-md-4 unit">
                                                {" "}
                                                <label className="label">
                                                  Usuario
                                                </label>
                                                <div className="input">
                                                  
                                                  <input
                                                    className="form-control"
                                                    type="text"
                                                    placeholder=""
                                                    id="text"
                                                  />
                                                </div>
                                              </div>
                                              <div className="col-md-4 unit">
                                                {" "}
                                                <label className="label">
                                                  Contraseña
                                                </label>
                                                <div className="input">
                                                  
                                                  <input
                                                    className="form-control"
                                                    type="password"
                                                    placeholder=""
                                                    id="password"
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
                              {/*Fin de ejemplo*/}
                            </div>
                          </div>
                          <div className="row">
                            <div className="col-md-12 col-sm-12">
                              <div className="widget-wrap">
                                <div className="widget-header block-header margin-bottom-0 clearfix">
                                  <div className="pull-left">
                                    <h3>Fotos / Documentos</h3>
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
                                            id="fotosdocs"
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
                                            {/* start text password */}
                                            <div className="j-row toclone-widget-right toclone">
                                                        <div className="span12 unit">
                                                          <div className="input">
                                                            <input
                                                              className="form-control"
                                                              type="text"
                                                              placeholder="Descripción"
                                                            />
                                                          </div>
                                                        </div>
                                                        <div className="span12 unit">
                                                          <form
                                                            action="#"
                                                            className="j-forms"
                                                            noValidate
                                                          >
                                                            <div className="form-content">
                                                              <div className="row">
                                                                {/* start prepend small file button */}
                                                                <div className="col-md-12 unit">
                                                                  <div className="input prepend-small-btn">
                                                                    <div className="file-button">
                                                                      Browse
                                                                      <input
                                                                        className="btn btn-success"
                                                                        type="file"
                                                                        onChange="document.getElementById('prepend-small-btn').value = this.value;"
                                                                      />
                                                                    </div>
                                                                    <input
                                                                      className="form-control"
                                                                      type="text"
                                                                      id="prepend-small-btn"
                                                                      readOnly
                                                                      placeholder="no file selected"
                                                                    />
                                                                  </div>
                                                                </div>
                                                                {/* end prepend small
                                                                 */}
                                                              </div>
                                                            </div>
                                                          </form>
                                                        </div>

                                                        <button
                                                          type="button"
                                                          className="btn btn-primary clone-btn-right clone"
                                                        >
                                                          <i className="fa fa-plus" />
                                                        </button>
                                                        <button
                                                          type="button"
                                                          className="btn btn-secondary clone-btn-right delete"
                                                        >
                                                          <i className="fa fa-minus" />
                                                        </button>
                                                      </div>
                                          </div>
                                        </form>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              </div>

                              {/*Fin de ejemplo*/}
                            </div>
                            <div class="btn-ex-container">
                            <button className="btn btn-primary primary-btn">Aceptar</button>

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
        {/*Footer Start Here */}
        <footer className="footer-container">
          <div className="container-fluid">
            <div className="row">
              <div className="col-md-6 col-sm-6">
                <div className="footer-left">
                  <span></span>
                </div>
              </div>
              <div className="col-md-6 col-sm-6">
                <div className="footer-right">
                  <span className="footer-meta"></span>
                </div>
              </div>
            </div>
          </div>
        </footer>
        {/*Footer End Here */}
      </section>
      {/*Page Container End Here*/}
      {/*Rightbar Start Here*/}
      <aside className="rightbar"></aside>
      {/*Rightbar End Here*/}
      {/*iCheck*/}
      {/*CHARTS*/}
      {/*Forms*/}
    </div>
  );
}

export default App;
