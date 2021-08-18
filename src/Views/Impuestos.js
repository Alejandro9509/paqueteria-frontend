import React, { useEffect, useState, useMemo } from "react";
import axios from "axios";
import Cabecera from "../Components/Template/Cabecera";
import BarraLateralIzquierda from "../Components/Template/BarraLateralIzquierda";
import BarraLateralDerecha from "../Components/Template/BarraLateralDerecha";
import { DataGrid } from '@material-ui/data-grid';
import SvgIcon from "@material-ui/core/SvgIcon";
import { ReactComponent as ActivoIcon } from '../iconos/Menu/palomita.svg';
import { ReactComponent as NoActivoIcon } from '../iconos/Menu/cruz.svg';
import Noty from 'noty';
import { dataGridLocaleText } from "../Constants";
import { FormControl, InputLabel, Select, TextField, Tooltip } from "@material-ui/core";
import { agregarImpuestos, eliminarImpuestos, modificarImpuestos, obtenerImpuestosId, obtenerImpuestos } from "../Util/Contexts/ImpuestosContext"
import { validarPermisos } from "../Util/Contexts/UsuarioContext";

function showSuccess(mensaje) {
    new Noty({
        type: "information",
        layout: "topCenter",
        text: mensaje,
        timeout: "3000"
    }).show()
}

function Impuestos() {

    const [data, setData] = React.useState([])
    const [state, setState] = React.useState({
        idImpuestos: 0,
        DerechoBorrar: 109,
        descripcionImpuestos: "",
        impuestoLocal: false,
        porcentajeImpuesto: 0,
        tipoDeCalculo: "",
        tipoImpuesto: "",
        activo: false,
        agregar: "Agregar",
        CreadoPor: localStorage.getItem("UsuarioId"),
        ModificadoPor: localStorage.getItem("UsuarioId"),
        height: window.innerHeight
    })

    const handleAceptar = (e) => {
        e.preventDefault()
        var params = {

            "m_sImpuesto": state.descripcionImpuestos,
            "m_bImpuestoLocal": state.impuestoLocal,
            "m_nPorcentaje": state.porcentajeImpuesto,
            "m_nTIpoCalculo": state.tipoDeCalculo,
            "m_nTIpoImpuesto": state.tipoImpuesto,
            "m_bActivo": state.activo,

            "m_nCreadoPor": state.CreadoPor,
            "m_nModificadoPor": state.ModificadoPor
        }
        console.log(params)
        if (state.idImpuestos != 0) {
            modificarImpuestos(state.idImpuestos, params).then(respuesta => {
                showSuccess(respuesta.data)
                getAllData()
            }).catch(err => {
                console.log(err)
                showSuccess("err")
            });
        } else {
            agregarImpuestos(params).then(respuesta => {
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
        validarPermisos(state).then(respuesta => {
            derecho = respuesta.data;
            if (derecho == false) {
                showSuccess("El usuario no tiene derechos para realizar el proceso");
                return;
            }

            eliminarImpuestos(id, state.CreadoPor).then(respuesta => {
                console.log(respuesta);
                getAllData();
            }).catch(err => {
                showSuccess(err)
            });
        }).catch(err => {
            showSuccess(err)
        });
    }

    function handleShowModificar(id) {
        obtenerImpuestosId(id).then(respuesta => {
            console.log(respuesta.data)
            setState({
                ...state,
                agregar: "Modificar",
                showPopUp: true,
                idImpuestos: id,
                descripcionImpuestos: respuesta.data.m_sImpuesto,
                impuestoLocal: respuesta.data.m_bImpuestolocal,
                porcentajeImpuesto: respuesta.data.m_nPorcentaje,
                tipoDeCalculo: respuesta.data.m_nTIpoCalculo,
                tipoImpuesto: respuesta.data.m_nTIpoImpuesto,
                activo: respuesta.data.m_bActivo,
            })
        });
    }

    function handleShowConsultar(id) {
        obtenerImpuestosId(id).then(respuesta => {
            console.log(respuesta.data)
            setState({
                ...state,
                agregar: "Consultar",
                showPopUp: true,
                idImpuestos: id,
                codigoImpuestos: respuesta.data.m_nCodigo,
                descripcionImpuestos: respuesta.data.m_sDescripcion
            })
        });
    }

    function handleShowAgregar() {
        setState({
            ...state,
            agregar: "Agregar",
            showPopUp: true,
            idImpuestos: 0,
            codigoImpuestos: "",
            descripcionImpuestos: ""
        })
    }

    const handleChange = event => {
        console.log(event.target.id + " : " + event.target.value)
        setState({
            ...state,
            [event.target.id]: event.target.value
        });
    };

    const handleChangeTipoImpuesto = event => {
        let valor = 1
        if (event.target.value == 1) {
            valor = 1
        } else if (event.target.value == 3) {
            valor = 2
        }
        setState({
            ...state,
            [event.target.name]: event.target.value,
            tipoDeCalculo: valor
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
                            <a href="#Agregar" role="tab" data-toggle="tab" onClick={() => (handleShowModificar(row.row.m_nIdImpuesto))} className="btn btn-default btn-xs"><i className="fa fa-pencil-square-o" style={{ color: "#F9A03E" }} /></a>
                        </Tooltip>
                        <Tooltip title="Consultar">
                            <a href="#Agregar" role="tab" data-toggle="tab" className="btn btn-default btn-xs" onClick={() => (handleShowConsultar(row.row.m_nIdImpuesto))}><i className="fa fa-eye" style={{ color: "#F9A03E" }} /></a>
                        </Tooltip>
                        <Tooltip title="Eliminar">
                            <a href="#" className="btn btn-default btn-xs" onClick={() => (handleEliminar(row.row.m_nIdImpuesto))}><i className="zmdi zmdi-delete" style={{ color: "#F30B0B" }} /></a>
                        </Tooltip>
                    </div>
                )
            }
        },
        {
            headerName: "Clave Impuesto",
            field: "m_nIdImpuesto",
            width: 200,
        }, {
            headerName: "Descripción",
            field: "m_sImpuesto",
            width: 200,
        }, {
            headerName: "Porcentaje",
            field: "m_nPorcentaje",
            width: 125,
        }, {
            headerName: "Tipo Cálculo",
            field: "m_nTipoCalculo",
            width: 125,
            renderCell: (row) => {
                return (
                    <div>
                        {row.row.m_nTIpoCalculo == 1 ?
                            <div>Retención</div> :
                            <div>Traslado</div>
                        }
                    </div>
                )
            },
        }, {
            headerName: "Tipo de Impuesto",
            field: "m_nTipoImpuesto",
            width: 200,
            renderCell: (row) => {
                return (
                    <div>
                        {row.row.m_bImpuestolocal ?
                            <div>Local</div> :
                            <div>Federal</div>
                        }
                    </div>
                )
            },
        }
    ]);

    useEffect(value => {
        if (localStorage.getItem("UsuarioId") === null || localStorage.getItem("UsuarioId") <= 0) {
            showSuccess("Es necesario iniciar sesion para acceder a este proceso");
            window.location.replace("login");
            return;
        }
        getAllData();
    }, []);

    function getAllData() {
        obtenerImpuestos().then(respuesta => {
            setData(respuesta.data)
            console.log(respuesta.data)
        });
    };

    const headers = {
        'Content-Type': 'application/json',
        //    'access-control-allow-origin': '*'
    }

    return (
        <div >

            <header className="topbar clearfix">
                <Cabecera titulo="Impuestos" >
                    <div className="page-header">
                        <ul className="list-page-breadcrumb">
                            <li>
                                <a href="/Catalogos" className="color-mapeo">
                                    Catálogos <i className="zmdi zmdi-chevron-right" />
                                </a>
                            </li>
                            <li className="active-page">Impuestos</li>
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
                                                getRowId={(row) => row.m_nIdImpuesto}
                                                onRowSelected={(row) => {
                                                    setState({
                                                        ...state,
                                                        idImpuestos: row.data.m_nIdImpuesto
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
                                                    <div className="row">

                                                        <div className="col-xs-6 col-sm-6 col-md-4 col-lg-4 unit" style={{ paddingTop: "1px", marginBottom: "5px" }}>

                                                            <div className="input">
                                                                <TextField variant="outlined" margin="dense" label="Impuesto"
                                                                    onChange={handleChange}
                                                                    className="form-control"
                                                                    type="text"
                                                                    required
                                                                    readOnly={state.agregar == "Consultar"}
                                                                    value={state.descripcionImpuestos}
                                                                    id="descripcionImpuestos"
                                                                />
                                                            </div>
                                                        </div>

                                                        <div className="col-xs-6 col-sm-6 col-md-4 col-lg-4 unit" >
                                                            <label className="checkbox">
                                                                <input
                                                                    disabled={state.agregar == "Consultar"}
                                                                    native="true"
                                                                    checked={state.activo}
                                                                    name="activo"
                                                                    onChange={(e) => setState({ ...state, activo: e.target.checked })}
                                                                    type="checkbox"
                                                                />
                                                                <i />
                                Activo
                              </label>
                                                        </div>

                                                        <div className="col-xs-6 col-sm-6 col-md-4 col-lg-4 unit">
                                                            <label className="checkbox">
                                                                <input
                                                                    disabled={state.agregar == "Consultar"}
                                                                    native="true"
                                                                    checked={state.impuestoLocal}
                                                                    name="impuestoLocal"
                                                                    onChange={(e) => {
                                                                        setState({
                                                                            ...state,
                                                                            impuestoLocal: e.target.checked,
                                                                            tipoImpuesto: 0,
                                                                            tipoDeCalculo: 1,
                                                                        })
                                                                    }}
                                                                    type="checkbox"
                                                                />
                                                                <i />
                                Impuesto Local
                              </label>
                                                        </div>
                                                    </div>
                                                    <div className="row">

                                                        <div className="col-xs-6 col-sm-6 col-md-4 col-lg-4 unit">

                                                            <div className="input">
                                                                <TextField variant="outlined" margin="dense" label="Porcentaje"
                                                                    onChange={handleChange}
                                                                    className="form-control"
                                                                    min="0"
                                                                    max="999"
                                                                    step="0.01"
                                                                    required
                                                                    readOnly={state.agregar == "Consultar"}
                                                                    value={state.porcentajeImpuesto}
                                                                    id="porcentajeImpuesto"
                                                                />
                                                            </div>
                                                        </div>


                                                        <div className="col-xs-6 col-sm-6 col-md-4 col-lg-4 unit">
                                                            <label className="input select">
                                                                <FormControl fullWidth variant="outlined"
                                                                    margin="dense">
                                                                    <InputLabel id="tipoDeCalculoLabel">Tipo de Cálculo</InputLabel>
                                                                    <Select
                                                                        labelId="tipoDeCalculoLabel"
                                                                        label="Tipo de Cálculo"
                                                                        className="form-control"
                                                                        value={state.tipoDeCalculo}
                                                                        disabled={state.agregar == "Consultar" || state.impuestoLocal || state.tipoImpuesto == 1 || state.tipoImpuesto == 3}
                                                                        onChange={handleChange}
                                                                        id="tipoDeCalculo"
                                                                        name="tipoDeCalculo"
                                                                    >
                                                                        <option value="1">
                                                                            Retención
                                  </option>
                                                                        <option value="2">
                                                                            Traslado
                                  </option>
                                                                    </Select>
                                                                </FormControl>
                                                            </label>
                                                        </div>

                                                        {!state.impuestoLocal ?
                                                            <div className="col-xs-6 col-sm-6 col-md-4 col-lg-4 unit">
                                                                <label className="input select">
                                                                    <FormControl fullWidth variant="outlined"
                                                                        margin="dense">
                                                                        <InputLabel id="tipoImpuestoLabel">Tipo Impuesto</InputLabel>
                                                                        <Select
                                                                            labelId="tipoImpuestoLabel"
                                                                            label="Tipo Impuesto"
                                                                            className="form-control"
                                                                            value={state.tipoImpuesto}
                                                                            disabled={state.agregar == "Consultar"}
                                                                            onChange={handleChangeTipoImpuesto}
                                                                            id="tipoImpuesto"
                                                                            name="tipoImpuesto"
                                                                        >
                                                                            <option value="2">
                                                                                IVA
                                  </option>
                                                                            <option value="1">
                                                                                ISR
                                  </option>
                                                                            <option value="3">
                                                                                IEPS
                                  </option>
                                                                        </Select>
                                                                    </FormControl>
                                                                </label>
                                                            </div>
                                                            : <div></div>}

                                                    </div>
                                                    <div className="row">
                                                        <div className="form-footer" className="col-sm-12 col-md-12 unit">
                                                            <button href="#Listado" role="tab" data-toggle="tab" data-layout="topCenter" data-type="information" className="btn btn-secondary secondary-btn"> Cancelar</button>
                                                            <button type="submit" className="btn btn-primary primary-btn">Aceptar</button>
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

            </section>
            {/*Page Container End Here*/}

            {/*Rightbar Start Here*/}
            <aside className="rightbar">
                <BarraLateralDerecha />
            </aside>

        </div>

    );
}

export default Impuestos;
