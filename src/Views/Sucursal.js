import React, { useEffect, useState, useMemo } from "react";
import axios from "axios";
import Cabecera from "../Components/Template/Cabecera";
import BarraLateralIzquierda from "../Components/Template/BarraLateralIzquierda";
import BarraLateralDerecha from "../Components/Template/BarraLateralDerecha";
import Autocomplete from "@material-ui/lab/Autocomplete";
import TextField from "@material-ui/core/TextField";
import { useTable, useFilters, useSortBy } from 'react-table'
import { makeStyles } from "@material-ui/core/styles";
import { DataGrid } from '@material-ui/data-grid';

import Noty from 'noty';
import { dataGridLocaleText } from "../Constants";
import { FormControl, InputLabel, Select, Tooltip } from "@material-ui/core";
import { obtenerCodigoPostal } from "../Util/Contexts/CodigoPostalContext";
import { obtenerPaises } from "../Util/Contexts/PaisesContext";
import { obtenerEstadosPais } from "../Util/Contexts/EstadosContext";
import { agregarSucursales, eliminarSucursales, modificarSucursales, obtenerSucursales, obtenerSucursalesId } from "../Util/Contexts/SucursalContext";

function showSuccess(mensaje) {
    new Noty({
        type: "information",
        layout: "topCenter",
        text: mensaje,
        timeout: "3000"
    }).show()
}
function Sucursal() {

    const [data, setData] = React.useState([])
    const [dataPais, setDataPais] = React.useState([])
    const [dataEstado, setDataEstado] = React.useState([])
    const [dataCodigoPostal, setDataCodigoPostal] = React.useState([]);
    const [state, setState] = React.useState({
        agregar: "Agregar",
        idSucursal: 0,
        sucursal: "",
        abreviacion: "",
        idPais: 0,
        idEstado: {},
        codigoPostal: 0,
        municipio: "",
        DerechoBorrar: 17,
        localidad: "",
        colonia: "",
        calle: "",
        numInterior: 0,
        numExterior: 0,
        iva: "18",
        zonaHoraria: "08:00|America/Tijuana",
        activo: false,
        height: window.innerHeight,
        CreadoPor: localStorage.getItem("UsuarioId"),
        ModificadoPor: localStorage.getItem("UsuarioId")
    })


    const handleAceptar = (e) => {
        e.preventDefault()
        console.log(state.zonaHoraria.split("|"))
        var params = {

            "Sucursal": state.sucursal,
            "Abreviacion": state.abreviacion,
            "Calle": state.calle,
            "NoInterior": state.numInterior,
            "NoExterior": state.numExterior,
            "Colonia": state.colonia,
            "Localidad": state.localidad,
            "Municipio": state.municipio,
            "IdEstado": state.idEstado.m_nIdEstado,
            "IdImpuestoTraslado": state.iva,
            "Activa": state.activo,
            "CreadoPor": state.CreadoPor,
            "ModificadoPor": state.ModificadoPor,
            "ZonaHoraria": state.zonaHoraria.split("|")[0],
            "DescripcionZonaHoraria": state.zonaHoraria.split("|")[1],
        }
        if (state.idSucursal != 0) {
            modificarSucursales(state.idSucursal, params).then(respuesta => {
                showSuccess(respuesta.data)
                getAllData();
                //window.location.reload();
            }).catch(err => {
                console.log(err)
                showSuccess("err")
            });
        } else {
            agregarSucursales(params).then(respuesta => {
                showSuccess(respuesta.data)
                getAllData();
                //window.location.reload();
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
            eliminarSucursales(id).then(respuesta => {
                showSuccess(respuesta.data)
                getAllData();
            }).catch(err => {
                showSuccess(err)
            });

        }).catch(err => {
            showSuccess(err)
        });
    }

    function handleShowModificar(id) {
        obtenerSucursalesId(id).then(respuesta => {
            console.log(respuesta.data)
            setState({
                ...state,
                agregar: "Modificar",
                idSucursal: respuesta.data.m_nIdSucursal,
                sucursal: respuesta.data.m_sSucursal,
                abreviacion: respuesta.data.m_sAbreviacion,
                idPais: 0,
                idEstado: respuesta.data.m_nIdEstado,
                codigoPostal: 0,
                municipio: respuesta.data.m_sMunicipio,
                localidad: respuesta.data.m_sLocalidad,
                colonia: respuesta.data.m_sColonia,
                calle: respuesta.data.m_sCalle,
                numInterior: respuesta.data.m_sNoInterior,
                numExterior: respuesta.data.m_sNoExterior,
                iva: respuesta.data.m_sIdImpuestoTraslado,
                zonaHoraria: respuesta.data.m_xZonaHoraria,
                activo: respuesta.data.m_bActiva
            })
        });
    }

    function handleShowAgregar() {
        setState({
            ...state,
            agregar: "Agregar",
            idSucursal: 0,
            sucursal: "",
            abreviacion: "",
            idPais: dataPais[0].m_nIdPais,
            idEstado: {},
            municipio: "",
            localidad: "",
            colonia: "",
            calle: "",
            numInterior: 0,
            numExterior: 0,
            iva: "18",
            zonaHoraria: "08:00|America/Tijuana",
            activo: false
        })
    }

    const handleChange = event => {
        console.log(event.target.id + " : " + event.target.value)
        setState({
            ...state,
            [event.target.id]: event.target.value
        });
    };


    const handleSelectPais = event => {
        setState({
            ...state,
            idPais: event.target.value
        });
        getAllEstado(event.target.value)
    }

    function handleChangeBoolean() {
        setState({
            ...state,
            activo: !state.activo
        });
        console.log(state.activo)
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
                            <a href="#Agregar" role="tab" data-toggle="tab" onClick={() => (handleShowModificar(row.row.m_nIdSucursal))} className="btn btn-default btn-xs"><i className="fa fa-pencil-square-o" style={{ color: "#F9A03E" }} /></a>

                        </Tooltip>
                        <Tooltip title="Consultar">
                            <a href="#Agregar" role="tab" data-toggle="tab" className="btn btn-default btn-xs" onClick={() => (handleShowModificar(row.row.m_nIdSucursal))}><i className="fa fa-eye" style={{ color: "#F9A03E" }} /></a>

                        </Tooltip>
                        <Tooltip title="Eliminar">
                            <a href="#" className="btn btn-default btn-xs" onClick={() => (handleEliminar(row.row.m_nIdSucursal))}><i className="zmdi zmdi-delete" style={{ color: "#F30B0B" }} /></a>

                        </Tooltip>
                    </div>
                )
            }
        },
        {
            headerName: "Abreviación",
            field: "m_sAbreviacion",
            width: 125
        }, {
            headerName: "Sucursal",
            field: "m_sSucursal",
            width: 400
        }, {
            headerName: "Ubicación",
            field: "m_dtCreadoEl",
            width: 400
        }, {
            headerName: "Activo",
            field: "m_nCreadoPor",
            width: 100
        }

    ]);

    useEffect(value => {
        if (localStorage.getItem("UsuarioId") === null || localStorage.getItem("UsuarioId") <= 0) {
            showSuccess("Es necesario iniciar sesion para acceder a este proceso");
            window.location.replace("login");
            return;
        }
        getAllData();
        getAllPais();
        getAllCodigosPostales();
    }, []);

    function getAllData() {
       obtenerSucursales().then(respuesta => {
            setData(respuesta.data)
        });
    };

    function getAllPais() {
        obtenerPaises().then((respuesta) => {
            setDataPais(respuesta.data);
            getAllEstado(respuesta.data[0].m_nIdPais)
        });
    }

    function getAllEstado(id) {
        obtenerEstadosPais(id).then((respuesta) => {
            setDataEstado(respuesta.data);
        });
    }

    function getAllCodigosPostales() {
        obtenerCodigoPostal().then((respuesta) => {
            setDataCodigoPostal(respuesta.data);
        });
    }

    const headers = {
        'Content-Type': 'application/json',
        //    'access-control-allow-origin': '*'
    }

    return (
        <div>

            <header className="topbar clearfix">
                <Cabecera titulo="Sucursal" >
                    <div className="page-header">
                        <ul className="list-page-breadcrumb">
                            <li>
                                <a href="/Configuracion" className="color-mapeo">
                                    Configuración <i className="zmdi zmdi-chevron-right" />
                                </a>
                            </li>
                            <li className="active-page">Sucursal</li>
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
                                                getRowId={(row) => row.m_nIdSucursal}
                                                onRowSelected={(row) => {
                                                    setState({
                                                        ...state,
                                                        idSucursal: row.data.m_nIdSucursal
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
                                                        <div className="col-sm-6 col-md-2-5 unit">
                                                            <div className="input">

                                                                <TextField variant="outlined" margin="dense" label="Sucursal"
                                                                    onChange={handleChange}
                                                                    className="form-control"
                                                                    type="text"
                                                                    required
                                                                    value={state.sucursal}
                                                                    id="sucursal"
                                                                    maxLength="80"
                                                                />
                                                            </div>
                                                        </div>



                                                        <div className="col-sm-6 col-md-2-5 unit unit">
                                                            <div className="input">
                                                                <TextField variant="outlined" margin="dense" label="Abreviación"
                                                                    onChange={handleChange}
                                                                    className="form-control"
                                                                    type="text"
                                                                    required
                                                                    value={state.abreviacion}
                                                                    id="abreviacion"
                                                                    maxLength="50"
                                                                />
                                                            </div>
                                                        </div>


                                                        <div className="col-sm-12 col-md-2-5 unit">
                                                            <label className="label">Estatus</label>
                                                            <label className="checkbox">
                                                                <input
                                                                    onChange={
                                                                        handleChangeBoolean
                                                                    }
                                                                    native
                                                                    type="checkbox"
                                                                    value={state.activo}
                                                                    id="activo"
                                                                    name="activo"
                                                                />
                                                                <i />
                                    Activo
                                  </label>
                                                        </div>
                                                    </div>

                                                    <div className="row">
                                                        <div className="col-sm-12 col-md-2-5 unit">
                                                            <div className="input">
                                                                <label className="input select">
                                                                    <FormControl fullWidth variant="outlined" margin="dense">
                                                                        <InputLabel id="idPaisLabel">País</InputLabel>
                                                                        <Select
                                                                            labelId="idPaisLabel"
                                                                            label="País"
                                                                            className="form-control"
                                                                            required
                                                                            onChange={handleSelectPais}
                                                                            value={state.idPais}
                                                                            id="idPais"
                                                                        >
                                                                            {
                                                                                dataPais.length < 1 ?

                                                                                    <option value="none">
                                                                                        País
                                          </option>
                                                                                    :
                                                                                    dataPais.map((pais) => (
                                                                                        <option key={pais.m_nIdPais} value={pais.m_nIdPais}>
                                                                                            {pais.m_sPais}
                                                                                        </option>
                                                                                    ))
                                                                            }
                                                                        </Select>
                                                                    </FormControl>
                                                                </label>
                                                            </div>
                                                        </div>

                                                        <div className="col-sm-12 col-md-2-5 unit">
                                                            <div className="input">
                                                                <Autocomplete
                                                                    freeSolo
                                                                    onChange={(event, newValue) =>
                                                                        setState({
                                                                            ...state,
                                                                            idEstado: newValue,
                                                                        })
                                                                    }
                                                                    value={state.idEstado}
                                                                    disabled={
                                                                        state.agregar === "Consultar"
                                                                    }
                                                                    id="idEstado"
                                                                    disableClearable
                                                                    forcePopupIcon={false}
                                                                    options={dataEstado}
                                                                    getOptionLabel={(option) =>
                                                                        option.m_sEstado
                                                                    }
                                                                    variant="outlined"
                                                                    style={{
                                                                        transform: "translate(20px, 10px) scale(1) !important"
                                                                    }}
                                                                    renderInput={(params) => (
                                                                        <div>
                                                                            <TextField
                                                                                required
                                                                                label="Estado"
                                                                                margin="dense"
                                                                                variant="outlined"
                                                                                {...params}
                                                                                InputProps={{
                                                                                    ...params.InputProps,
                                                                                    style: { height: 24 },
                                                                                    type: "search",
                                                                                    disabled:
                                                                                        state.agregar === "Consultar",
                                                                                }}
                                                                            />
                                                                        </div>
                                                                    )}
                                                                />
                                                            </div>
                                                        </div>

                                                        <div className="col-sm-12 col-md-2-5 unit">
                                                            <label className="input select">
                                                                <FormControl fullWidth variant="outlined" margin="dense">
                                                                    <InputLabel id="codigoPostalLabel">Código Postal</InputLabel>
                                                                    <Select
                                                                        labelId="codigoPostalLabel"
                                                                        label="Código Postal"
                                                                        className="form-control"
                                                                        required
                                                                        value={state.codigoPostal}
                                                                        onChange={handleChange}
                                                                        id="codigoPostal"
                                                                    >
                                                                        {dataCodigoPostal.filter(cp => cp.m_nIdEstado == state.idEstado.m_nIdEstado).map(
                                                                            (codigoPostal) => (
                                                                                <option key={codigoPostal.m_nIdCP} value={codigoPostal.m_nIdCP}>
                                                                                    {
                                                                                        codigoPostal.m_sCP
                                                                                    }
                                                                                </option>
                                                                            )
                                                                        )}
                                                                    </Select>
                                                                </FormControl>
                                                            </label>
                                                        </div>

                                                        <div className="col-sm-12 col-md-2-5 unit">
                                                            <div className="input">

                                                                <TextField variant="outlined" margin="dense" label="Municipio"
                                                                    onChange={handleChange}
                                                                    className="form-control"
                                                                    type="text"
                                                                    required
                                                                    value={state.municipio}
                                                                    id="municipio"
                                                                    maxLength="80"
                                                                />
                                                            </div>
                                                        </div>

                                                        <div className="col-sm-12 col-md-2-5 unit">
                                                            <div className="input">
                                                                <TextField variant="outlined" margin="dense" label="Localidad"
                                                                    onChange={handleChange}
                                                                    className="form-control"
                                                                    type="text"
                                                                    required
                                                                    value={state.localidad}
                                                                    id="localidad"
                                                                    maxLength="50"
                                                                />
                                                            </div>
                                                        </div>

                                                    </div>
                                                    <div className="row">
                                                        <div className="col-sm-12 col-md-2-5  unit">
                                                            <div className="input">
                                                                <TextField variant="outlined" margin="dense" label="Colonia"
                                                                    onChange={handleChange}
                                                                    className="form-control"
                                                                    type="text"
                                                                    required
                                                                    value={state.colonia}
                                                                    id="colonia"
                                                                    maxLength="50"
                                                                />
                                                            </div>
                                                        </div>

                                                        <div className="col-sm-12 col-md-2-5  unit">
                                                            <div className="input">
                                                                <TextField variant="outlined" margin="dense" label="Calle"
                                                                    onChange={handleChange}
                                                                    className="form-control"
                                                                    type="text"
                                                                    required
                                                                    value={state.calle}
                                                                    id="calle"
                                                                    maxLength="50"
                                                                />
                                                            </div>
                                                        </div>

                                                        <div className="col-sm-12 col-md-2-5  unit">
                                                            <div className="input">
                                                                <TextField variant="outlined" margin="dense" label="Num. Interior"
                                                                    onChange={handleChange}
                                                                    className="form-control"
                                                                    type="text"
                                                                    required
                                                                    value={state.numInterior}
                                                                    id="numInterior"
                                                                    maxLength="50"
                                                                />
                                                            </div>
                                                        </div>

                                                        <div className="col-sm-12 col-md-2-5 unit">
                                                            <div className="input">
                                                                <TextField variant="outlined" margin="dense" label="Num. Exterior"
                                                                    onChange={handleChange}
                                                                    className="form-control"
                                                                    type="text"
                                                                    required
                                                                    value={state.numExterior}
                                                                    id="numExterior"
                                                                    maxLength="50"
                                                                />
                                                            </div>
                                                        </div>

                                                    </div>
                                                    <div className="row">


                                                        <div className="col-sm-12 col-md-2-5  unit">
                                                            <label className="input select">
                                                                <FormControl fullWidth variant="outlined" margin="dense">
                                                                    <InputLabel id="ivaLabel">IVA</InputLabel>
                                                                    <Select
                                                                        labelId="ivaLabel"
                                                                        label="IVA"
                                                                        className="form-control"
                                                                        required
                                                                        value={state.iva}
                                                                        onChange={handleChange}
                                                                        id="iva"
                                                                    >
                                                                        <option value="18">
                                                                            18%
                              </option>
                                                                        <option value="16">
                                                                            16%
                              </option>
                                                                    </Select>
                                                                </FormControl>
                                                            </label>
                                                        </div>

                                                        <div className="col-sm-12 col-md-2-5  unit">
                                                            <label className="input select">
                                                                <FormControl fullWidth variant="outlined" margin="dense">
                                                                    <InputLabel id="zonaHorariaLabel">Zona Horaria</InputLabel>
                                                                    <Select
                                                                        labelId="zonaHorariaLabel"
                                                                        label="Zona Horaria"
                                                                        className="form-control"
                                                                        required
                                                                        value={state.zonaHoraria}
                                                                        onChange={handleChange}
                                                                        id="zonaHoraria"
                                                                    >
                                                                        <option value="08:00|America/Tijuana">
                                                                            America/Tijuana
                              </option>
                                                                        <option value="06:00|America/Mexico_City">
                                                                            America/Mexico_City
                              </option>
                                                                    </Select>
                                                                </FormControl>
                                                            </label>
                                                        </div>
                                                    </div>
                                                </div>
                                                <br></br>
                                                <div className="form-footer" className="col-md-12">
                                                    <button data-layout="topCenter" data-type="information" className="btn btn-secondary secondary-btn"
                                                    >
                                                        Cancelar</button>
                                                    {/** TODO Realizar correctamente el cancelar*/}
                                                    <button type="submit" className="btn btn-primary primary-btn">Aceptar</button>
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

export default Sucursal;
