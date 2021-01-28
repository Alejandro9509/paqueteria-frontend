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
import { DisplayMapClass } from "./mapa";


window.jQuery = window.$ = $;
const headers = {
  "Content-Type": "application/json",
};

function App(props) {

  const [state, setState] = React.useState({
    height: window.innerHeight
  })

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
                <h2>Rutas</h2>
              </div>
              <div className="container-fluid">
                <div className="page-header filled full-block light">
                  <div className="row">
                    <div className="col-md-6 col-sm-6">
                      <h2>Rutas</h2>
                    </div>
                    <div className="col-md-6 col-sm-6">
                      <ul className="list-page-breadcrumb">
                        <li>
                          <a href="/Catalogos">
                            Catálogos <i className="zmdi zmdi-chevron-right" />
                          </a>
                        </li>
                        <li className="active-page">Rutas</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>

            </div>
          </div>
        </div>

        <ul className="nav navStatica nav-tabs">
          <li className="active">
            <a data-toggle="tab" href="#Listado">
              Listado
            </a>
          </li>
          <li>
            <a data-toggle="tab" href="#Agregar" >
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
                  listado
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
            <div className="row">
              <div className="col-md-12">
                <div className="widget-wrap">
                  <div className="widget-container margin-top-0">
                    <div className="widget-content">
                      <form className="j-forms j-multistep" id="j-forms">
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
                                        id="folio"
                                        maxlength="4"
                                      />
                                    </div>
                                  </div>
                                  <div className="col-md-4 unit">
                                    <label className="label">Origen</label>
                                    <div className="input">
                                      <input
                                        className="form-control"
                                        type="text"
                                        id="origen"
                                      />
                                    </div>
                                  </div>
                                  <div className="col-md-4 unit">
                                    <label className="label">Destino</label>
                                    <div className="input">
                                      <input
                                        className="form-control"
                                        type="text"
                                        id="destino"
                                      />
                                    </div>
                                  </div>
                                  <div className="col-md-2 unit">
                                    <label className="label">Descripción</label>
                                    <div className="input">
                                      <input
                                        className="form-control"
                                        type="text"
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
                                      <select className="form-control">
                                        <option value="none">
                                          Todos
                                                    </option>
                                      </select>
                                      <i></i>
                                    </label>
                                  </div>
                                  <div className="col-md-4 unit">
                                    <label className="label">
                                      Clasificación de viaje
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
                                  <div className="col-md-2 unit">
                                    <label className="label">
                                      Tipo de unidad
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
                                          name="i-radio"
                                          defaultChecked
                                        />
                                        <i />
                                                    Permanente
                                                  </label>
                                      <label className="radio">
                                        <input
                                          type="radio"
                                          name="i-radio"
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
                                        id="descripcion"
                                      />
                                    </div>
                                  </div>
                                  <div className="col-md-2 unit">
                                    <label className="label">ETA</label>
                                    <div className="input">
                                      <input
                                        className="form-control"
                                        type="text"
                                        id="descripcion"
                                      />
                                    </div>
                                  </div>
                                  <div className="col-md-2 unit">
                                    <label className="label">Kilometros</label>
                                    <div className="input">
                                      <input
                                        className="form-control"
                                        type="text"
                                        id="descripcion"
                                      />
                                    </div>
                                  </div>
                                  <div className="col-md-2 unit">
                                    <label className="label">Millas</label>
                                    <div className="input">
                                      <input
                                        className="form-control"
                                        type="text"
                                        id="descripcion"
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
                                          native
                                          name="activo"
                                          type="checkbox"
                                        />
                                        <i />
                                                    Activa
                                                  </label>

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
              </div>

            </div>
            <div className="row">
              <div className="col-md-12">
                <div className="widget-wrap">
                  <div className="widget-container margin-top-0">
                    <div className="widget-content">
                      <form className="j-forms j-multistep" id="j-forms">
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
                                      required
                                      native
                                      name="activo"
                                      type="checkbox"
                                    />
                                    <i />
                                                    Trazo libre
                                                  </label>
                                  <label className="checkbox">
                                    <input
                                      required
                                      native
                                      name="activo"
                                      type="checkbox"
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
                        <DisplayMapClass />

                      </form>
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
