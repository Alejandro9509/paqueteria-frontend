import React, { useEffect, useState, useMemo } from "react";
import axios from "axios";
import Cabecera from "../Components/Template/Cabecera";
import BarraLateralIzquierda from "../Components/Template/BarraLateralIzquierda";
import BarraLateralDerecha from "../Components/Template/BarraLateralDerecha";
import ExportCSV from '../Components/Template/Export';
import ExportPDF from "../Components/Template/ExportPDF";
import { useTable, useFilters, useSortBy } from 'react-table'
import { makeStyles } from "@material-ui/core/styles";
import { DataGrid } from '@material-ui/data-grid';

import Noty from 'noty';
import { dataGridLocaleText } from "../Constants";
import { FormControl, InputLabel, Select, TextField, Tooltip } from "@material-ui/core";
import { agregarEstatusUnidades, modificarEstatusUnidades, obtenerEstatusUnidades, eliminarEstatusUnidades, obtenerEstatusUnidadesId } from "../Util/Contexts/EstatusContext";

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
        backgroundColor: "#FCC88F",
    },
    noSeleccionado: {
        backgroundColor: "#FFFFFF",
    }
};
const useStyles = makeStyles(styles);

function EstatusUnidad() {

    const classes = useStyles();
    const [data, setData] = React.useState([])
    const dataEstatus = [{
        idEstatus: 1,
        tipoEstatus: "Disponible"
    }, {
        idEstatus: 2,
        tipoEstatus: "No Disponible"
    }];

    const [state, setState] = React.useState({
        idEstatusUnidad: 0,
        DerechoBorrar: 81,
        estatusUnidad: "",
        abreviacionUnidad: "",
        tipoEstatusUnidad: 0,
        colorUnidad: "",
        agregar: "Agregar",
        importar: "",
        height: window.innerHeight,
        CreadoPor: localStorage.getItem("UsuarioId"),
        ModificadoPor: localStorage.getItem("UsuarioId")
    })

    const handleAceptar = (e) => {
        e.preventDefault()
        var params = {

            "Estatus": state.estatusUnidad,
            "Color": state.colorUnidad.slice(-6),
            "ColorLetra": state.colorUnidad.slice(-6),
            "Abreviacion": state.abreviacionUnidad,
            "TipoEstatus": state.tipoEstatusUnidad,
            "CreadoPor": state.CreadoPor,
            "ModificadoPor": state.ModificadoPor
        }
        console.log(params)
        if (state.idEstatusUnidad != 0) {
            modificarEstatusUnidades(state.idEstatusUnidad, params).then(respuesta => {
                showSuccess(respuesta.data)
                getAllData();
            }).catch(err => {
                console.log(err)
                showSuccess("err")
            });
        } else {
            agregarEstatusUnidades().then(respuesta => {
                showSuccess(respuesta.data)
                getAllData()
            }).catch(err => {
                console.log(err)
                showSuccess(err)
            });
        }

    }

    function handleEliminar(id) {
        var derecho;
        const urlDelete = `${process.env.REACT_APP_API_URL}/Utilerias/ValidaDerechos/${state.CreadoPor}/${state.DerechoBorrar}/3`;
        axios.get(urlDelete, { headers }).then(respuesta => {
            //showSuccess(respuesta.data)

            derecho = respuesta.data;
            if (derecho == false) {
                showSuccess("El usuario no tiene derechos para realizar el proceso");
                return;
            }

            eliminarEstatusUnidades(id).then(respuesta => {
                showSuccess(respuesta)
                getAllData()
            }).catch(err => {
                showSuccess(err)
            });
        }).catch(err => {
            showSuccess(err)
        });
    }

    function handleShowModificar(id) {
        obtenerEstatusUnidadesId(id).then(respuesta => {
            console.log(respuesta.data)
            setState({
                ...state,
                agregar: "Modificar",
                showPopUp: true,
                idEstatusUnidad: id,
                estatusUnidad: respuesta.data.m_sEstatus,
                abreviacionUnidad: respuesta.data.m_sAbreviacion,
                tipoEstatusUnidad: respuesta.data.m_nTipoEstatus,
                colorUnidad: "#" + respuesta.data.m_sColor,
            })
        });
    }

    function handleShowConsultar(id) {
        obtenerEstatusUnidadesId(id).then(respuesta => {
            console.log(respuesta.data)
            setState({
                ...state,
                agregar: "Consultar",
                showPopUp: true,
                idEstatusUnidad: id,
                estatusUnidad: respuesta.data.m_sEstatus,
                abreviacionUnidad: respuesta.data.m_sAbreviacion,
                tipoEstatusUnidad: respuesta.data.m_nTipoEstatus,
                colorUnidad: "#" + respuesta.data.m_sColor,
            })
        });
    }

    function handleShowAgregar() {
        setState({
            ...state,
            agregar: "Agregar",
            idEstatusUnidad: 0,
            estatusUnidad: "",
            abreviacionUnidad: "",
            tipoEstatusUnidad: 1,
            colorUnidad: "#000000",
        })
    }

    const handleChange = event => {
        setState({
            ...state,
            [event.target.id]: event.target.value
        });
    };

    function setContrast(rgb) {

        // http://www.w3.org/TR/AERT#color-contrast
        const brightness = Math.round(((parseInt(rgb.r) * 299) +
            (parseInt(rgb.g) * 587) +
            (parseInt(rgb.b) * 114)) / 1000);
        return (brightness > 125) ? 'black' : 'white';
    }

    function hexToRgb(hex) {
        var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
        return result ? {
            r: parseInt(result[1], 16),
            g: parseInt(result[2], 16),
            b: parseInt(result[3], 16)
        } : null;
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
                            <a href="#Agregar" role="tab" data-toggle="tab" onClick={() => (handleShowModificar(row.row.m_nIdEstatusUnidad))} className="btn btn-default btn-xs"><i className="fa fa-pencil-square-o" style={{ color: "#F9A03E" }} /></a>

                        </Tooltip>
                        <Tooltip title="Consultar">
                            <a href="#Agregar" role="tab" data-toggle="tab" className="btn btn-default btn-xs" onClick={() => (handleShowModificar(row.row.m_nIdEstatusUnidad))}><i className="fa fa-eye" style={{ color: "#F9A03E" }} /></a>

                        </Tooltip>
                        <Tooltip title="Eliminar">
                            <a href="#" className="btn btn-default btn-xs" onClick={() => (handleEliminar(row.row.m_nIdEstatusUnidad))}><i className="zmdi zmdi-delete" style={{ color: "#F30B0B" }} /></a>

                        </Tooltip>
                    </div>
                )
            }
        },
        {
            headerName: "Abreviación",
            field: "m_sAbreviacion",
            width: 125,
            renderCell: (row) => {
                return (
                    <div style={{ backgroundColor: "#" + row.row.m_sColor, width: "100%", textAlign: "center" }}>
                        <div style={{ color: setContrast(hexToRgb("#" + row.row.m_sColor)) }}>
                            {row.row.m_sAbreviacion}
                        </div>
                    </div>
                )
            }
        }, {
            headerName: "Estatus",
            field: "m_sEstatus",
            width: 125,
        }, {
            headerName: "Creado El",
            field: "m_dtCreadoEl",
            width: 200,
        }, {
            headerName: "Creado Por",
            field: "m_nCreadoPor",
            width: 200,
        }, {
            headerName: "Modificado El",
            field: "m_dtModificadoEl",
            width: 200,
        }, {
            headerName: "Modificado Por",
            field: "m_nModificadoPor",
            width: 200,
        }

    ]);

    useEffect(value => {
        if (localStorage.getItem("UsuarioId") === null || localStorage.getItem("UsuarioId") <= 0) {
            showSuccess("Es necesario iniciar sesion para acceder a este proceso");
            window.location.replace("configuracion");
            return;
        }
        getAllData();
    }, []);

    function getAllData() {
        obtenerEstatusUnidades().then(respuesta => {
            setData(respuesta.data)
        });
    };

    const headers = {
        'Content-Type': 'application/json',
        //    'access-control-allow-origin': '*'
    }

    return (
        <div >

            <header className="topbar clearfix">
                <Cabecera titulo="Estatus Unidad" >
                    <div className="page-header">
                        <ul className="list-page-breadcrumb">
                            <li>
                                <a href="/Catalogos" className="color-mapeo">
                                    Catálogos <i className="zmdi zmdi-chevron-right" />
                                </a>
                            </li>
                            <li className="active-page">Estatus Unidad</li>
                        </ul>
                    </div>
                </Cabecera>
            </header>

            {/*Leftbar Start Here*/}
            <aside className="iconic-leftbar">
                <BarraLateralIzquierda />
            </aside>
            {/*Leftbar End Here*/}

            {/*Page Container Start Here*/}
            <section className="main-container">

                <div className="container-fluid">

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
                            <a data-toggle="tab" href="#Importar">
                                <i className="fa fa-upload" /> Importar
            </a>
            </li>
            {/*<li>*/}
            {/*  <ExportCSV csvData={data} fileName="Departamento_Listado" />*/}
            {/*</li>*/}
            {/*<li>*/}
            {/*  <ExportPDF data={data} column={columns} fileName="Departamento" />*/}
            {/*</li>*/}
          </ul>

                    <div className="row" className="tab-content">
                        <div className="widget-wrap" id="Listado" className="tab-pane fade in active">
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
                                                getRowId={(row) => row.m_nIdEstatusUnidad}
                                                onRowSelected={(row) => {
                                                    setState({
                                                        ...state,
                                                        idEstatusUnidad: row.data.m_nIdEstatusUnidad
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

                        <div className="widget-wrap" id="Agregar" className="tab-pane fade">
                            <div className="widget-wrap">
                                <div className="widget-content">
                                    <div className="row">
                                        <div className="col-md-12">
                                            <form className="j-forms" onSubmit={handleAceptar}>
                                                <div className="form-content">

                                                    <div className="col-xs-6 col-sm-3 col-md-2-5 col-lg-2-5 unit">

                                                        <div className="input">
                                                            <TextField variant="outlined" margin="dense" label="Estatus"
                                                                onChange={handleChange}
                                                                className="form-control"
                                                                type="text"
                                                                maxLength="30"
                                                                required={true}
                                                                value={state.estatusUnidad}
                                                                readOnly={state.agregar == "Consultar"}
                                                                id="estatusUnidad"
                                                            />
                                                        </div>
                                                    </div>

                                                    <div className="col-xs-6 col-sm-3 col-md-2-5 col-lg-2-5 unit">

                                                        <div className="input">
                                                            <TextField variant="outlined" margin="dense" label="Abreviación"
                                                                onChange={handleChange}
                                                                className="form-control"
                                                                type="text"
                                                                maxLength="5"
                                                                required={true}
                                                                value={state.abreviacionUnidad}
                                                                readOnly={state.agregar == "Consultar"}
                                                                id="abreviacionUnidad"
                                                            />
                                                        </div>
                                                    </div>

                                                    <div className="col-xs-6 col-sm-3 col-md-2-5 col-lg-2-5 unit">

                                                        <label className="input select">
                                                            <FormControl fullWidth variant="outlined" margin="dense">
                                                                <InputLabel id="tipoEstatusUnidadLabel">Tipo Estatus</InputLabel>
                                                                <Select

                                                                    labelId="tipoEstatusUnidadLabel"
                                                                    label="Tipo Estatus"
                                                                    className="form-control"
                                                                    required
                                                                    onChange={handleChange}
                                                                    value={state.tipoEstatusUnidad}
                                                                    readOnly={state.agregar == "Consultar"}
                                                                    id="tipoEstatusUnidad"
                                                                >
                                                                    {dataEstatus.map(
                                                                        (estatus) => (
                                                                            <option key={estatus.idEstatus} value={estatus.idEstatus}>
                                                                                {
                                                                                    estatus.tipoEstatus
                                                                                }
                                                                            </option>
                                                                        )
                                                                    )}
                                                                </Select>
                                                            </FormControl>

                                                        </label>
                                                    </div>

                                                    <div className="col-xs-6 col-sm-3 col-md-3 col-lg-2-5 unit">

                                                        <div className="input">
                                                            <TextField variant="outlined" margin="dense" label="Color"
                                                                onChange={handleChange}
                                                                className="form-control"
                                                                required={true}
                                                                type="color"
                                                                value={state.colorUnidad}
                                                                readOnly={state.agregar == "Consultar"}
                                                                id="colorUnidad"
                                                            />
                                                        </div>
                                                    </div>

                                                </div>
                                                <br></br>
                                                <div className="form-footer" className="col-12 col-sm-12 col-md-10 unit">
                                                    <button href="#Listado" role="tab" data-toggle="tab" className="btn btn-secondary secondary-btn">
                                                        Cancelar</button>
                                                    <button type="submit" className="btn btn-primary primary-btn">Aceptar</button>
                                                </div>
                                            </form>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="widget-wrap" id="Importar" className="tab-pane fade">
                            <div className="widget-wrap">
                                <div className="widget-content">
                                    <div className="row">
                                        <div className="col-md-12">
                                            <div className="form-footer" className="col-md-12">
                                                <button className="btn btn-default btn-block ex-noty" data-layout="topCenter" data-type="information">Notificación</button>
                                                <button href="#Listado" role="tab" data-toggle="tab" data-layout="topCenter" data-type="information" className="btn btn-secondary secondary-btn"
                                                >
                                                    Cancelar</button>
                                                <button onClick={handleAceptar} className="btn btn-primary primary-btn">Aceptar</button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                    </div>
                </div>

            </section>
            {/*Page Container End Here*/}

            {/*Rightbar Start Here*/}
            <aside className="rightbar">
                <BarraLateralDerecha />
            </aside>

        </div>

    );
}

export default EstatusUnidad;
