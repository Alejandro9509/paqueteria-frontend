import React, { useEffect, useState, setData, useMemo, Component } from "react";
import logo from "../logo.svg";
import axios from "axios";
import { FormControl, IconButton, Input, InputAdornment, InputLabel } from "@material-ui/core";

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

const XLocateClient = window.XLocateClient;

var xlocate = new XLocateClient();
xlocate.setCredentials("xtok", "51FA3E8E-8BF3-49EF-AB82-59D807A0645C")
var originFlag = false
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
};

function Rutas(props) {
    const classes = useStyles();

    const [state, setState] = React.useState({
        height: window.innerHeight,
        points: [],
        showMap: false
    })

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
        console.log(event.target.id + " : " + event.target.value);
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

    function searchCompleted(response, exception) {
        if (response.results instanceof Array) {
            if(response.results.length != 0) {
                console.log(response.results[0])
                alert(response.results[0].location.formattedAddress)
                if(originFlag) {
                    setState({...state, originLocation: response.results[0]})
                } else {
                    setState({...state, destinyLocation: response.results[0]})
                }
                
            }
        } else {
            console.log('No se encontraron coincidencias');
        }
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
                                                                                    id="horas"
                                                                                />
                                                                            </div>
                                                                        </div>
                                                                        <div className="col-md-2 unit">
                                                                            <label className="label">ETA</label>
                                                                            <div className="input">
                                                                                <input
                                                                                    className="form-control"
                                                                                    type="text"
                                                                                    id="eta"
                                                                                />
                                                                            </div>
                                                                        </div>
                                                                        <div className="col-md-2 unit">
                                                                            <label className="label">Kilometros</label>
                                                                            <div className="input">
                                                                                <input
                                                                                    className="form-control"
                                                                                    type="text"
                                                                                    id="kilometros"
                                                                                />
                                                                            </div>
                                                                        </div>
                                                                        <div className="col-md-2 unit">
                                                                            <label className="label">Millas</label>
                                                                            <div className="input">
                                                                                <input
                                                                                    className="form-control"
                                                                                    type="text"
                                                                                    id="millas"
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
                                                    {
                                                        state.showMap &&
                                                        <DisplayMapClass markers={state.points} />
                                                    }


                                                </form>
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

export default Rutas;
