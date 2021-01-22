import logo from "../logo.svg";
import "../App.css";

import React, { useEffect, useState, setData, useMemo, Component } from "react";

import axios from "axios";
import { FormControl, Input, InputLabel } from "@material-ui/core";

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
function App(props) {
  const [stepActive, setStepActive] = React.useState(1);
  const [state, setState] = React.useState({
    height: window.innerHeight
  })

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
        $section = $("#combustible");

        break;
      case 4:
        setStepActive(4);
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

  const ruta = [
    {
      actual : false,
      nombre: "Configuración",
      ruta: "/Configuracion"
    },
    {
      actual : true,
      nombre: "Moneda",
      ruta: "/Moneda"
    },
  ];

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
                <h2>Plantilla sin pasos</h2>
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
              Listado
            </a>
          </li>
          <li>
            <a data-toggle="tab" href="#Agregar">
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
                <div className="row">Listado</div>
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
                                "col-md-3 col-sm-3 step " +
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
                                "col-md-3 col-sm-3 step " +
                                (stepActive == 2 && "active-step")
                              }
                              onClick={() => openSection(2)}
                            >
                              <div className="steps">
                                <span className="step-number">2</span>
                                <p>Detalles</p>
                              </div>
                            </div>
                            <div
                              className={
                                "col-md-3 col-sm-3 step " +
                                (stepActive == 3 && "active-step")
                              }
                              onClick={() => openSection(3)}
                            >
                              <div className="steps">
                                <span className="step-number">3</span>
                                <p>Detalles de la operacion</p>
                              </div>
                            </div>
                            <div
                              className={
                                "col-md-3 col-sm-3 step " +
                                (stepActive == 4 && "active-step")
                              }
                              onClick={() => openSection(4)}
                            >
                              <div className="steps">
                                <span className="step-number">4</span>
                                <p>Paquetes</p>
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
                                            FORM 1 
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
                                        <h3>Detalles de Recolección</h3>
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
                                            FORM 2
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
                                        <h3>Detalles de la operación</h3>
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
                                            FORM 3
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
                      <h3>Paquetes</h3>
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
                                        <form
                                          action="#"
                                          className="j-forms"
                                          noValidate
                                        >
                                          <div className="form-content">
                                            FORM CLONAR
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

export default App;
