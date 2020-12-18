import logo from "../logo.svg";
import "../App.css";

import React, { useEffect, useState, setData, useMemo, Component } from "react";

import axios from "axios";
import { FormControl, Input, InputLabel } from "@material-ui/core";

import DataTable from "react-data-table-component";
import Cabecera from "../Components/Template/Cabecera";
import BarraLateralIzquierda from "../Components/Template/BarraLateralIzquierda";
import BarraLateralDerecha from "../Components/Template/BarraLateralDerecha";
import $ from 'jquery';
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
      name: "IdUnidad",
      selector: "m_nIdUnidad",
      type: "int",
      omit: "true",
    },
    {
      visible: true,
      name: "Tipo Unidad",
      selector: "m_sTipoUnidad",
    },
    {
      visible: true,
      name: "Código",
      selector: "m_sCodigo",
    },
    {
      visible: true,
      name: "Descripción",
      selector: "m_sDescripcion",

    },
    {
      visible: true,
      name: "Satelital",
      selector: "m_sIdentificadorSatelital",
    },
    {
      visible: true,
      name: "Nro. Operador",
      selector: "m_nNumeroOperador",
    },
    {
      visible: true,
      name: "Operador",
      selector: "m_sNombreOperador",
    },
    {
      visible: true,
      name: "Placas",
      selector: "m_sPlacas",
    },
    {
      visible: true,
      name: "Vencimiento",
      selector: "m_dtPlacasVencimiento",
    },
  ]);

  const [data, setData] = React.useState([]);
  const [state, setState] = React.useState({
    agregar: "Agregar",
  });
  const [dataTiposUnidad, setDataTiposUnidad] = React.useState([]);
  const [dataSucursales, setDataSucursales] = React.useState([]);
  const [dataGruposUnidades, setDataGruposUnidades] = React.useState([]);
  const [dataListadoUnidades, setDataListadoUnidades] = React.useState([]);

  useEffect((value) => {
    getAllOperadores();
    getAllTipoUnidades();
    getAllSucursales();
    getAllGruposUnidades();
    getAllUnidades();
  }, []);

  function getAllUnidades() {
    const url = "http://localhost/Unidades/GetListado";
    axios.get(url, { headers }).then((respuesta) => {
      console.log(respuesta);

      setDataListadoUnidades(respuesta.data);
    });
  }

  function getAllOperadores() {
    const url = "http://localhost/Operadores/GetListado";
    axios.get(url, { headers }).then((respuesta) => {
      setData(respuesta.data);
    });
  }

  function getAllTipoUnidades() {
    const url = "http://localhost/TiposUnidades/GetListado";
    axios.get(url, { headers }).then((respuesta) => {
      setDataTiposUnidad(respuesta.data);
    });
  }

  function getAllSucursales() {
    const url = "http://localhost/Sucursales/GetListado";
    axios.get(url, { headers }).then((respuesta) => {
      setDataSucursales(respuesta.data);
    });
  }
  function getAllGruposUnidades() {
    const url = "http://localhost/GrupoUnidad/GetListado";
    axios.get(url, { headers }).then((respuesta) => {
      setDataGruposUnidades(respuesta.data);
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


  function handleShowModificar(id) {
  

    
  }


  
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
    closeSeccions()
        var $section;
    switch (index) {
      case 1:
        setStepActive(1);
       $section= $("#infogral")
        break;
      case 2:
        setStepActive(2);
        $section= $("#caracteristicas")
        
        break;
      case 3:
        setStepActive(3);
        $section= $("#combustible")
       
        break;
      case 4:
        setStepActive(4);
        $section= $("#seguros")
        break;
      case 5:
        setStepActive(5);
        $section= $("#paromotor")
        break;
      case 6:
        setStepActive(6);
        $section= $("#detalles")
        break;
      case 7:
        setStepActive(7);
        $section= $("#otros")
        break;
      default:
    }

    var $welem = $section.parentsUntil(".widget-action-bar").parentsUntil(".w-action").parents(".widget-header").next(".widget-container");

    $welem.slideDown();
    $section.children("a").children("i").removeClass("zmdi-chevron-up");
    $section.children("a").children("i").addClass("zmdi-chevron-down");
    $('html, body').animate({
        scrollTop: parseInt($section.offset().top)
    }, 200);


  }


  function value(event) {
    console.log(event.target.value);
  }

  
  function closeSeccions() {
  //Cerrar todas las seciones
  var $section = $(".widget-toggle")
  $section.each(function () {
      var $welem = $(this).parentsUntil(".widget-action-bar").parentsUntil(".w-action").parents(".widget-header").next(".widget-container");
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
                <h2>Unidades</h2>
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
                title="Listado de Unidades"
                columns={columns}
                data={dataListadoUnidades}
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
                          <div className="wizard-breadcrumb number-style"style={{position: "sticky", top: "50px", padding: "5px", backgroundColor: "white", zIndex:100}}>
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
                                  <p>Carácteristicas de la unidad</p>
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
                                  <p>Combustible</p>
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
                                  <p>Seguros</p>
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
                                  <p>Paro de Motor</p>
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
                                  <p>Datos Generales</p>
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
                                  <p>Otros Datos</p>
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


                                    fdasd
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
                                              <div className="col-md-6 unit">
                                                <label className="label">
                                                  Código
                                                </label>
                                                <div className="input">
                                               
                                                  <input
                                                    onChange={value}
                                                    className="form-control"
                                                    type="text"
                                                    placeholder=""
                                                    id="text"
                                                  />
                                                </div>
                                              </div>
                                              <div className="col-md-6 unit">
                                                <div className="inline-group">
                                                  <label className="label">
                                                    Estados de unidad
                                                  </label>
                                                  <label className="checkbox">
                                                    <input
                                                      required
                                                      native
                                                      name="activo"
                                                      type="checkbox"
                                                    />
                                                    <i />
                                                    Activa
                                                  </label>
                                                  <label className="checkbox">
                                                    <input
                                                      required
                                                      native
                                                      name="rentada"
                                                      type="checkbox"
                                                    />
                                                    <i />
                                                    Rentada
                                                  </label>
                                                  <label className="checkbox">
                                                    <input
                                                      required
                                                      native
                                                      name="permisionario"
                                                      type="checkbox"
                                                    />
                                                    <i />
                                                    Unidad Permisionario
                                                  </label>
                                                </div>
                                              </div>
                                            </div>
                                            {/* end text password */}
                                            {/* start email url */}
                                            <div className="row">
                                              <div className="col-md-10 unit">
                                                <label className="label">
                                                  Descripción
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
                                              <div className="col-md-2 unit">
                                                <label className="label">
                                                  Modelo
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
                                            </div>

                                            <div className="unit">
                                              <label className="label">
                                                Tipos de Unidad
                                              </label>
                                              <label className="input select">
                                                <select
                                                  className="form-control"
                                                  required
                                                  native
                                                  name="tipoUnidad"
                                                >
                                                  <option value="none">
                                                    Tipos de Unidad
                                                  </option>

                                                  {dataTiposUnidad.map(
                                                    (tipoUnidad) => (
                                                      <option value="{tipoUnidad.m_nIdTipoUnidad}">
                                                        {
                                                          tipoUnidad.m_sTipoUnidad
                                                        }
                                                      </option>
                                                    )
                                                  )}
                                                </select>
                                                <i></i>
                                              </label>
                                            </div>
                                            {/* end search */}
                                            {/* start textarea */}
                                            <div className="unit">
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
                                            <div className="unit">
                                              <label className="input select">
                                                <select
                                                  native
                                                  className="form-control"
                                                  name="operador"
                                                >
                                                  <option value="none">
                                                    Operador
                                                  </option>

                                                  {data.map((operador) => (
                                                    <option value="{operador.m_nIdOperador}">
                                                      {
                                                        operador.m_nNumeroOperador
                                                      }{" "}
                                                      {
                                                        operador.m_sNombreCompleto
                                                      }
                                                    </option>
                                                  ))}
                                                </select>
                                                <i></i>
                                              </label>
                                            </div>
                                            <div className="row">
                                              <div className="col-md-6 unit">
                                                <label className="label">
                                                  Número Serie
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
                                              <div className="col-md-6 unit">
                                                <label className="label">
                                                  Color
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
                                            </div>

                                            <div className="row">
                                              <div className="col-md-6 unit">
                                                <label className="label">
                                                  Identificador Satelital
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
                                              <div className="col-md-6 unit">
                                                <label className="label">
                                                  Identificador Convoy
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
                                           < div className="unit">
                              
                                
                                  <label className="input select">
                                    <select
                                      native
                                      className="form-control"
                                      name="idGrupoUnidad"
                                      
                                    >
                                      <option value="none">
                                        Grupo Unidades
                                      </option>

                                      {dataGruposUnidades.map((grupoUnidad) => (
                                        <option value="">
                                          {grupoUnidad.m_nCodigo}{" "}
                                          {grupoUnidad.m_sGrupoUnidad}
                                        </option>
                                      ))}
                                    </select>
                                    <i></i>
                                  </label>
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
                                    <h3>Carácteristicas de la unidad</h3>
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
                                            {/* start text password */}
                                            <div className="row">
                                              <div className="w-section-header">
                                                <h3>Dimensiones</h3>
                                              </div>
                                              <div className="col-sm-12 col-md-2-5 unit">
                                                <label className="label">
                                                  Largo
                                                </label>
                                                <div className="input">
                                                 

                                                  <input
                                                    className="form-control"
                                                    type="text"
                                                    placeholder="mts"
                                                    id="text"
                                                    native
                                                  />
                                                </div>
                                              </div>
                                              <div className="col-sm-6 col-md-2-5 unit">
                                                <label className="label">
                                                  Ancho
                                                </label>
                                                <div className="input">
                                                  

                                                  <input
                                                    className="form-control"
                                                    type="text"
                                                    placeholder="mts"
                                                    id="text"
                                                    native
                                                  />
                                                </div>
                                              </div>
                                              <div className="col-sm-6 col-md-2-5 unit">
                                                <label className="label">
                                                  Alto
                                                </label>
                                                <div className="input">
                                                

                                                  <input
                                                    className="form-control"
                                                    type="text"
                                                    placeholder="mts"
                                                    id="text"
                                                    native
                                                  />
                                                </div>
                                              </div>
                                              <div className="col-sm-6 col-md-2-5 unit">
                                                <label className="label">
                                                  Capacidad
                                                </label>
                                                <div className="input">
                                                 
                                                  <input
                                                    className="form-control"
                                                    type="text"
                                                    placeholder="kgs"
                                                    id="text"
                                                    native
                                                  />
                                                </div>
                                              </div>
                                              <div className="col-sm-6 col-md-2-5 unit">
                                                <label className="label">
                                                  Número de Ejes
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
                                            </div>

                                            <div className="row">
                                              <div className="w-section-header">
                                                <h3>Llantas</h3>
                                              </div>
                                              <div className="col-sm-6  col-md-2 unit">
                                                <label className="label">
                                                  Número de llantas
                                                </label>
                                                <div className="input">
                                                
                                                  <input
                                                    className="form-control"
                                                    type="text"
                                                    placeholder=""
                                                    id="text"
                                                    disabled
                                                  />
                                                </div>
                                              </div>
                                              <div className="col-sm-6  col-md-2 unit">
                                                <label className="label">
                                                  Llantas de refacción
                                                </label>
                                                <div className="input">
                                                
                                                  <input
                                                    className="form-control"
                                                    type="text"
                                                    placeholder=""
                                                    id="text"
                                                    disabled
                                                  />
                                                </div>
                                              </div>
                                              <div className="col-sm-6  col-md-2 unit">
                                                <label className="label">
                                                  Marca de la llanta
                                                </label>
                                                <label className="input select">
                                                  <select className="form-control" disabled>
                                                    <option value="none">
                                                      Todos
                                                    </option>
                                                  </select>
                                                  <i></i>
                                                </label>
                                              </div>
                                              <div className="col-sm-6  col-md-2 unit">
                                                <label className="label">
                                                  Modelo de la llanta
                                                </label>
                                                <label className="input select">
                                                  <select className="form-control" disabled>
                                                    <option value="none">
                                                      Todos
                                                    </option>
                                                  </select>
                                                  <i></i>
                                                </label>
                                              </div>
                                              <div className="col-sm-6  col-md-2 unit">
                                                <label className="label">
                                                  Medida de la llanta
                                                </label>
                                                <label className="input select">
                                                  <select className="form-control" disabled>
                                                    <option value="none"></option>
                                                  </select>
                                                  <i></i>
                                                </label>
                                              </div>
                                              <div className="col-sm-6  col-md-2 unit">
                                                <label className="label">
                                                  Tipo de llanta
                                                </label>
                                                <label className="input select">
                                                  <select className="form-control" disabled>
                                                    <option value="none"></option>
                                                  </select>
                                                  <i></i>
                                                </label>
                                              </div>
                                            </div>

                                            <div className="row">
                                              <div className="w-section-header">
                                                <h3>Motor</h3>
                                              </div>

                                              <div className="col-sm-6  col-md-3 unit">
                                                <label className="label">
                                                  Tipo Motor
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
                                              <div className="col-sm-6  col-md-3 unit">
                                                <label className="label">
                                                  Número de serie
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
                                              <div className="col-sm-6  col-md-3 unit">
                                                <label className="label">
                                                  Tipo de Transmisión
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
                                              <div className="col-sm-6  col-md-3 unit">
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
                                    <h3>Combustible</h3>
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
                                            id="combustible"
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
                                              <div className="col-sm-12 col-md-12 unit">
                                                <label className="label">
                                                  Tipo de combustible
                                                </label>
                                                <label className="input select">
                                                  <select className="form-control">
                                                    <option value="none">
                                                      Todos
                                                    </option>
                                                  </select>
                                                  <i></i>
                                                </label>
                                              </div>

                                              <div className="col-sm-12 col-md-4 unit">
                                                <label className="label">
                                                  Capacidad de tanque
                                                </label>
                                                <div className="input">
                                              
                                                  <input
                                                    className="form-control"
                                                    type="text"
                                                    placeholder="Gal."
                                                    id="text"
                                                  />
                                                </div>
                                              </div>
                                              <div className="col-sm-12 col-lg-4 unit">
                                                <label className="label">
                                                  Rendimiento cargado
                                                </label>
                                                <div className="input">
                                                
                                                  <input
                                                    className="form-control"
                                                    type="text"
                                                    placeholder="Kms/Lts"
                                                    id="text"
                                                  />
                                                </div>
                                              </div>
                                              <div className="col-sm-12 col-md-4 unit">
                                                <label className="label">
                                                  Rendimiento Vacio
                                                </label>
                                                <div className="input">
                                               
                                                  <input
                                                    className="form-control"
                                                    type="text"
                                                    placeholder="Kms/Lts"
                                                    id="text"
                                                  />
                                                </div>
                                              </div>
                                              <div className="col-sm-12 col-md-4 unit">
                                                <label className="label">
                                                  Tarjeta combustible
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
                                              <div className="col-sm-12 col-md-4 unit">
                                                <label className="label">
                                                  Tarjeta combustible 2
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
                                              <div className="col-sm-12 col-md-4 unit">
                                                <label className="label">
                                                  Tarjeta combustible 3
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
                                    <h3>Seguros</h3>
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
                                            id="seguros"
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
                                              <div className="col-sm-6 col-md-2 col-lg-2 unit">
                                                <label className="label">
                                                  Aseguradora
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
                                              <div className="col-sm-6 col-md-2 col-lg-2 unit">
                                                <label className="label">
                                                  Teléfonos
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
                                              <div className="col-sm-6 col-md-2 col-lg-2 unit">
                                                <label className="label">
                                                  Núm. Seguro
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
                                              <div className="col-sm-6 col-md-2  col-lg-2 unit">
                                                <label className="label">
                                                  Vencimiento
                                                </label>
                                                <div className="input">
                                                

                                                <input
                                                    className="form-control"
                                                    type="date"
                                                    placeholder=""
                                                    id="text"
                                                  />                                                </div>
                                              </div>
                                              <div className="col-sm-12 col-md-4 col-lg-4 unit">
                                                <div className="inline-group">
                                                  <label className="label">
                                                    Tipo de cobertura
                                                  </label>
                                                  <label className="radio">
                                                    <input
                                                      type="radio"
                                                      name="i-radio1"
                                                      defaultChecked
                                                    />
                                                    <i />
                                                    Amplia
                                                  </label>
                                                  <label className="radio">
                                                    <input
                                                      type="radio"
                                                      name="i-radio1"
                                                    />
                                                    <i />
                                                    Limitada
                                                  </label>
                                                  <label className="radio">
                                                    <input
                                                      type="radio"
                                                      name="i-radio1"
                                                    />
                                                    <i />
                                                    S/Cobertura
                                                  </label>
                                                </div>
                                              </div>
                                              
                                            </div>
                                            <div className="row">
                                              <div className="col-sm-6 col-md-2 col-lg-2 unit">
                                                <label className="label">
                                                  Aseguradora
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
                                              <div className="col-sm-6 col-md-2 col-lg-2 unit">
                                                <label className="label">
                                                  Teléfonos
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
                                              <div className="col-sm-6 col-md-2 col-lg-2 unit">
                                                <label className="label">
                                                  Núm. Seguro
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
                                              <div className="col-sm-6 col-md-2  col-lg-2 unit">
                                                <label className="label">
                                                  Vencimiento
                                                </label>
                                                <div className="input">
                                                 
                                                <input
                                                    className="form-control"
                                                    type="date"
                                                    placeholder=""
                                                    id="text"
                                                  />
                                                </div>
                                              </div>
                                              <div className="col-sm-12 col-md-4 col-lg-4 unit">
                                                <div className="inline-group">
                                                  <label className="label">
                                                    Tipo de cobertura
                                                  </label>
                                                  <label className="radio">
                                                    <input
                                                      type="radio"
                                                      name="i-radio"
                                                      defaultChecked
                                                    />
                                                    <i />
                                                    Amplia
                                                  </label>
                                                  <label className="radio">
                                                    <input
                                                      type="radio"
                                                      name="i-radio"
                                                    />
                                                    <i />
                                                    Limitada
                                                  </label>
                                                  <label className="radio">
                                                    <input
                                                      type="radio"
                                                      name="i-radio"
                                                    />
                                                    <i />
                                                    S/Cobertura
                                                  </label>
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
                                    <h3>Paro de Motor de Ralentí</h3>
                                    
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
                                            id="paromotor"
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
                                    <div className="col-sm-6 col-md-2 unit">
                                      <label className="checkbox-toggle">
                                        <input type="checkbox" />
                                        <i />
                                        Paro por Ralenti
                                      </label>
                                    </div>
                                    <div className="col-sm-6 col-md-4 unit">
                                      <label className="label">
                                        Tiempo para paro
                                      </label>
                                      <div className="input">
                                       
                                        <input
                                          className="form-control"
                                          type="text"
                                          placeholder="Max. 30 min"
                                          id="text"
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
                                    <h3>Detalles</h3>
                                    
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
                                            id="detalles"
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
                                      <ul className="nav nav-tabs">
                                    <li className="active">
                                      <a data-toggle="tab" href="#Placas">
                                        Placas/Permisos
                                      </a>
                                    </li>
                                    <li>
                                      <a data-toggle="tab" href="#Adicionales">
                                        Adicionales
                                      </a>
                                    </li>
                                    <li>
                                      <a data-toggle="tab" href="#PConduccion">
                                        P. Conducción
                                      </a>
                                    </li>
                                    <li>
                                      <a data-toggle="tab" href="#Fotos">
                                        Fotos/Doc
                                      </a>
                                    </li>
                                  </ul>
                                        <form
                                          action="#"
                                          className="j-forms"
                                          noValidate
                                        >
                                          <div className="form-content">
                                            {/* start text password */}
                                            <div className="widget-wrap">
                                        <div className="widget-container margin-top-0">
                                          <div className="widget-content">
                                            <div className="tab-content">
                                              <div
                                                id="Placas"
                                                className="tab-pane fade in active"
                                              >
                                                <div className="row">
                                                  <div className="col-md-12 unit">
                                                    <div className="row">
                                                      <div className="col-sm-6 col-md-3 col-lg-3 unit">
                                                        <label className="label">
                                                          Placas Mex.
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
                                                      <div className="col-sm-6 col-md-3  col-lg-3 unit">
                                                        <label className="label">
                                                          Vencimiento
                                                        </label>
                                                        <div className="input">
                                                 
                                                <input
                                                    className="form-control"
                                                    type="date"
                                                    placeholder=""
                                                    id="text"
                                                  />
                                                </div>
                                                      </div>
                                                      <div className="col-sm-6 col-md-3 col-lg-3  unit ">
                                                        <label className="label">
                                                          Placas E.U.A.
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
                                                      <div className="col-sm-6 col-md-3  col-lg-3 unit">
                                                        <label className="label">
                                                          Vencimiento
                                                        </label>
                                                        <div className="input">
                                                 
                                                 <input
                                                     className="form-control"
                                                     type="date"
                                                     placeholder=""
                                                     id="text"
                                                   />
                                                 </div>
                                                      </div>
                                                    </div>
                                                    <div className="row">
                                                      <div className="col-sm-6  col-md-3 col-lg-3  unit">
                                                        <label className="label">
                                                          Placas Default
                                                        </label>
                                                        <label className="input select">
                                                          <select className="form-control">
                                                            <option value="1">
                                                              México
                                                            </option>
                                                            <option value="2">
                                                              E.U.A
                                                            </option>
                                                          </select>
                                                          <i></i>
                                                        </label>
                                                      </div>
                                                      <div className="col-sm-6 col-md-3  col-lg-3 unit">
                                                        <label className="label">
                                                          Permiso SCT
                                                        </label>
                                                        <div className="input">
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
                                                      <div className="col-sm-6 col-md-3  col-lg-3 unit">
                                                        <label className="label">
                                                          Verificación
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
                                                      <div className="col-sm-6 col-md-3  col-lg-3 unit">
                                                        <label className="label">
                                                          Vencimiento
                                                        </label>
                                                        <div className="input">
                                                 
                                                 <input
                                                     className="form-control"
                                                     type="date"
                                                     placeholder=""
                                                     id="text"
                                                   />
                                                 </div>
                                                      </div>
                                                    </div>
                                                  </div>
                                                </div>
                                              </div>
                                              <div
                                                id="Adicionales"
                                                className="tab-pane fade"
                                              >
                                                <div className="row">
                                                  <div className="col-md-12 unit">
                                                    {/* start cloned right side buttons element */}
                                                    <div className="clone-rightside-btn-1">
                                                      <label className="label">
                                                        Documentos
                                                      </label>
                                                      <div className="j-row toclone-widget-right toclone">
                                                        <div className="span5 unit">
                                                          <div className="input">
                                                            <input
                                                              className="form-control"
                                                              type="text"
                                                              placeholder="Número de Documento"
                                                            />
                                                          </div>
                                                        </div>
                                                        <div className="span5 unit">
                                                          <div className="input">
                                                            <input
                                                              className="form-control"
                                                              type="text"
                                                              placeholder="Documento"
                                                            />
                                                          </div>
                                                        </div>
                                                        <div className="span2 unit">
                                                          <div className="input">
                                                           
                                                              <input
                                                                className="form-control"
                                                                type="text"
                                                                placeholder="15/06/2020"
                                                                id="date_to"
                                                                name="date_to"
                                                              />
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
                                                    {/* end cloned right
                                                     */}
                                                  </div>
                                                </div>
                                              </div>
                                              <div
                                                id="PConduccion"
                                                className="tab-pane fade "
                                              >
                                                <div className="row">
                                                  <div className="col-md-12 unit">
                                                    <div className="row">
                                                     
                                                      <div className="col-sm-6 col-md-4 col-lg-4 unit">
                                                        <label className="label"></label>
                                                        <div className="input">
                                                          
                                                          <input
                                                            className="form-control"
                                                            type="text"
                                                            placeholder="Velocidad Promedio"
                                                            id="text"
                                                          />
                                                        </div>
                                                      </div>
                                                      <div className="col-sm-6  col-md-4 col-lg-4  unit">
                                                        <label className="label"></label>
                                                        <label className="input select">
                                                          <select className="form-control">
                                                            <option value="1">
                                                              %
                                                            </option>
                                                            <option value="2">
                                                              Veces
                                                            </option>
                                                            <option value="2">
                                                              RPM
                                                            </option>
                                                            <option value="2">
                                                              KM/HR
                                                            </option>
                                                          </select>
                                                          <i></i>
                                                        </label>
                                                      </div>
                                                      
                                                    </div>
                                                    <div className="row">
                                                     
                                                      <div className="col-sm-6 col-md-4 col-lg-4 unit">
                                                        <label className="label"></label>
                                                        <div className="input">
                                                       
                                                          <input
                                                            className="form-control"
                                                            type="text"
                                                            placeholder="Neutralización"
                                                            id="text"
                                                          />
                                                        </div>
                                                      </div>
                                                      <div className="col-sm-6  col-md-4 col-lg-4  unit">
                                                        <label className="label"></label>
                                                        <label className="input select">
                                                          <select className="form-control">
                                                            <option value="1">
                                                              %
                                                            </option>
                                                            <option value="2">
                                                              Veces
                                                            </option>
                                                            <option value="2">
                                                              RPM
                                                            </option>
                                                            <option value="2">
                                                              KM/HR
                                                            </option>
                                                          </select>
                                                          <i></i>
                                                        </label>
                                                      </div>
                                                      
                                                    </div>
                                                    <div className="row">
                                                      
                                                      <div className="col-sm-6 col-md-4 col-lg-4 unit">
                                                        <label className="label"></label>
                                                        <div className="input">
                                                      
                                                          <input
                                                            className="form-control"
                                                            type="text"
                                                            placeholder="Frenado Brusco"
                                                            id="text"
                                                          />
                                                        </div>
                                                      </div>
                                                      <div className="col-sm-6  col-md-4 col-lg-4  unit">
                                                        <label className="label"></label>
                                                        <label className="input select">
                                                          <select className="form-control">
                                                            <option value="1">
                                                              %
                                                            </option>
                                                            <option value="2">
                                                              Veces
                                                            </option>
                                                            <option value="2">
                                                              RPM
                                                            </option>
                                                            <option value="2">
                                                              KM/HR
                                                            </option>
                                                          </select>
                                                          <i></i>
                                                        </label>
                                                      </div>
                                                      
                                                    </div>
                                                    <div className="row">
                                                      
                                                      <div className="col-sm-6 col-md-4 col-lg-4 unit">
                                                        <label className="label"></label>
                                                        <div className="input">
                                                          
                                                          <input
                                                            className="form-control"
                                                            type="text"
                                                            placeholder="Carga de Aceleración"
                                                            id="text"
                                                          />
                                                        </div>
                                                      </div>
                                                      <div className="col-sm-6  col-md-4 col-lg-4  unit">
                                                        <label className="label"></label>
                                                        <label className="input select">
                                                          <select className="form-control">
                                                            <option value="1">
                                                              %
                                                            </option>
                                                            <option value="2">
                                                              Veces
                                                            </option>
                                                            <option value="2">
                                                              RPM
                                                            </option>
                                                            <option value="2">
                                                              KM/HR
                                                            </option>
                                                          </select>
                                                          <i></i>
                                                        </label>
                                                      </div>
                                                    </div>
                                                    <div className="row">
                                                      <div className="col-sm-6 col-md-4 col-lg-4 unit">
                                                        <label className="label"></label>
                                                        <div className="input">
                                                         
                                                          <input
                                                            className="form-control"
                                                            type="text"
                                                            placeholder="Accionamiento Pedal de Freno"
                                                            id="text"
                                                          />
                                                        </div>
                                                      </div>
                                                      <div className="col-sm-6  col-md-4 col-lg-4  unit">
                                                        <label className="label"></label>
                                                        <label className="input select">
                                                          <select className="form-control">
                                                            <option value="1">
                                                              %
                                                            </option>
                                                            <option value="2">
                                                              Veces
                                                            </option>
                                                            <option value="2">
                                                              RPM
                                                            </option>
                                                            <option value="2">
                                                              KM/HR
                                                            </option>
                                                          </select>
                                                          <i></i>
                                                        </label>
                                                      </div>
                                                    </div>
                                                    <div className="row">
                                                      <div className="col-sm-6 col-md-4 col-lg-4 unit">
                                                        <label className="label"></label>
                                                        <div className="input">
                                                          
                                                          <input
                                                            className="form-control"
                                                            type="text"
                                                            placeholder="Velocidad Máxima Motor"
                                                            id="text"
                                                          />
                                                        </div>
                                                      </div>
                                                      <div className="col-sm-6  col-md-4 col-lg-4  unit">
                                                        <label className="label"></label>
                                                        <label className="input select">
                                                          <select className="form-control">
                                                            <option value="1">
                                                              %
                                                            </option>
                                                            <option value="2">
                                                              Veces
                                                            </option>
                                                            <option value="2">
                                                              RPM
                                                            </option>
                                                            <option value="2">
                                                              KM/HR
                                                            </option>
                                                          </select>
                                                          <i></i>
                                                        </label>
                                                      </div>
                                                    </div>
                                                    <div className="row">
                                                      <div className="col-sm-6 col-md-4 col-lg-4 unit">
                                                        <label className="label"></label>
                                                        <div className="input">
                                                         
                                                          <input
                                                            className="form-control"
                                                            type="text"
                                                            placeholder="% Ultimo Cambio"
                                                            id="text"
                                                          />
                                                        </div>
                                                      </div>
                                                      <div className="col-sm-6  col-md-4 col-lg-4  unit">
                                                        <label className="label"></label>
                                                        <label className="input select">
                                                          <select className="form-control">
                                                            <option value="1">
                                                              %
                                                            </option>
                                                            <option value="2">
                                                              Veces
                                                            </option>
                                                            <option value="2">
                                                              RPM
                                                            </option>
                                                            <option value="2">
                                                              KM/HR
                                                            </option>
                                                          </select>
                                                          <i></i>
                                                        </label>
                                                      </div>
                                                    </div>
                                                  </div>
                                                </div>
                                              </div>
                                              <div
                                                id="Fotos"
                                                className="tab-pane fade "
                                              >
                                                <div className="row">
                                                  <div className="col-md-12 unit">
                                                    {/* start cloned right side buttons element */}
                                                    <div className="clone-rightside-btn-1">
                                                      <label className="label">
                                                        Fotos/Documentos
                                                      </label>
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
                                                    {/* end cloned right
                                                     */}
                                                  </div>
                                                </div>
                                              </div>
                                            </div>
                                          </div>
                                        </div>
                                      </div>
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
                                    <h3>Otros Datos</h3>
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
                                            id="otros"
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
                                    <div className="col-sm-6 col-md-4 col-lg-4 unit">
                                      <label className="label">
                                        Tarjeta IAVE
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
                                    <div className="col-sm-6  col-md-2 col-lg-2  unit">
                                      <label className="label">Horómetro</label>
                                      <div className="input">
                                        
                                        <input
                                          className="form-control"
                                          type="text"
                                          placeholder="00:00"
                                          id="text"
                                        />
                                      </div>
                                    </div>
                                  </div>
                                  <div className="row">
                                    <div className="col-sm-6 col-md-4 col-lg-4 unit">
                                      <label className="label">
                                        Tarjeta EPASS
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
                                    <div className="col-sm-6  col-md-4 col-lg-4  unit">
                                      <label className="label">
                                        Horas trabajadas motor GPS
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
                                    <div className="col-sm-6 col-md-4 col-lg-4 unit">
                                      <label className="label">
                                        Calculo Reporte de Ingresos (%)
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
                                    <div className="col-sm-6 col-md-4 col-lg-4 unit">
                                      <label className="label">
                                        Horas trabajadas Motor{" "}
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
                                    <div className="col-sm-6 col-md-2 col-lg-2 unit">
                                      <label className="label">
                                        Odómetro (Kms)
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
                                    <div className="col-sm-6  col-md-2 col-lg-2  unit">
                                      <label className="label">
                                        Odómetro GPS (Kms)
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
                                    <div className="col-sm-6  col-md-2 col-lg-2  unit">
                                      <label className="label">
                                        Propietario
                                      </label>
                                      <label className="input select">
                                        <select className="form-control" disabled>
                                          <option value="0">
                                            Sin Propietario
                                          </option>
                                          <option value="1">México</option>
                                          <option value="2">E.U.A</option>
                                        </select>
                                        <i></i>
                                      </label>
                                    </div>
                                    <div className="col-sm-0 col-md-1 col-lg-2 unit"></div>
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
                            <button  className="btn btn-primary primary-btn">Aceptar</button>
          

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
                  <span>
                   
                  </span>
                </div>
              </div>
              <div className="col-md-6 col-sm-6">
                <div className="footer-right">
                  <span className="footer-meta">
                    
                  </span>
                </div>
              </div>
            </div>
          </div>
        </footer>
        {/*Footer End Here */}
      </section>
      {/*Page Container End Here*/}
      {/*Rightbar Start Here*/}

  {/*Rightbar Start Here*/}
  <aside className="rightbar">
    <BarraLateralDerecha />
  </aside>
      {/*Rightbar End Here*/}
      {/*iCheck*/}
      {/*CHARTS*/}
      {/*Forms*/}


    </div>
  );
}

export default App;
