import logo from "../logo.svg";
import "../App.css";

import React, { useEffect, useState, setData, useMemo, Component } from "react";

import axios from "axios";
import { FormControl, Input, InputLabel, Select, Step, StepLabel, Stepper, TextField, Tooltip } from "@material-ui/core";

import DataTable from "react-data-table-component";
import Cabecera from "../Components/Template/Cabecera";
import BarraLateralIzquierda from "../Components/Template/BarraLateralIzquierda";
import { useTable, useFilters, useSortBy } from "react-table";
import ExportCSV from "../Components/Template/Export";
import ExportPDF from "../Components/Template/ExportPDF";
import { makeStyles } from "@material-ui/core/styles";
import { DataGrid } from '@material-ui/data-grid';
import SvgIcon from "@material-ui/core/SvgIcon";
import { ReactComponent as Activo } from "../iconos/Menu/palomita.svg";
import { ReactComponent as NoActivo } from "../iconos/Menu/cruz.svg";

import $ from "jquery";

import Noty from 'noty';
import { dataGridLocaleText } from "../Constants";
import { obtenerDepartamentos } from "../Util/Contexts/DepartamentoContext";
import { agregarOperadores, eliminarOperadores, modificarOperadores, obtenerOperadores, obtenerOperadoresId, validarNumeroOperadores } from "../Util/Contexts/OperadoresContext";
import { obtenerPaises } from "../Util/Contexts/PaisesContext";
import { obtenerPuestos } from "../Util/Contexts/PuestoContext";
import { obtenerUnidadesId } from "../Util/Contexts/UnidadesContext";
import { validarPermisos } from "../Util/Contexts/UsuarioContext";
import { obtenerSucursales } from "../Util/Contexts/SucursalContext";

function showSuccess(mensaje) {
    new Noty({
        type: "information",
        layout: "topCenter",
        text: mensaje,
        timeout: "3000"
    }).show()
}

window.jQuery = window.$ = $;

function Operadores(props) {

    const columns = React.useMemo(() => [
        {
            headerName: "Acciones",
            sortable: false, filterable: false,
            field: "",
            renderCell: (row) => {
                return (
                    <div>
                        <Tooltip title="Modificar">
                            <a href="#Agregar" role="tab" data-toggle="tab" onClick={() => (handleShowModificar(row.row.m_nIdOperador))} className="btn btn-default btn-xs"><i className="fa fa-pencil-square-o" style={{ color: "#F9A03E" }} /></a>

                        </Tooltip>
                        <Tooltip title="Consultar">
                            <a href="#Agregar" role="tab" data-toggle="tab" className="btn btn-default btn-xs" onClick={() => (handleShowModificar(row.row.m_nIdOperador))}><i className="fa fa-eye" style={{ color: "#F9A03E" }} /></a>

                        </Tooltip>
                        <Tooltip title="Eliminar">
                            <a href="#" className="btn btn-default btn-xs" onClick={() => (handleEliminar(row.row.m_nIdOperador))}><i className="zmdi zmdi-delete" style={{ color: "#F30B0B" }} /></a>

                        </Tooltip>
                    </div>
                )
            }
        },
        {
            headerName: "Código",
            field: "m_nNumeroOperador",
            width: 100,
        },
        {
            headerName: "Nombre",
            field: "m_sNombreCompleto",
            width: 300,
        },
        {
            headerName: "Sucursal",
            field: "m_sSucursal",
            width: 200,
        },
        {
            headerName: "Activo",
            field: "m_bActivo", width: 100,
            renderCell: (row) => {
                return (
                    <div
                        style={{
                            width: "100%",
                            textAlign: "center",
                            color: row.row.m_bActivo == 'true' ? "green" : "red",
                        }}
                    >
                        {row.row.m_bActivo ? (
                            <SvgIcon component={Activo} />
                        ) : (
                            <SvgIcon component={NoActivo} />
                        )}
                    </div>
                );
            },
        },
    ]);

    
    const [state, setState] = React.useState({

        agregar: "Agregar",
        IdOperador: 0,
        NumeroOperador: 0,
        Activo: true,
        Nombre: "",
        ApellidoMaterno: "",
        ApellidoPaterno: "",
        NombreCompleto: "",
        RFC: "",
        CURP: "",
        FechaContratacion: "",
        IdSucursal: 0,
        Telefono: "",
        TelefonoCelular: "",
        Domicilio: "",
        IdEstado: 0,
        IdPais: 0,
        HashGPS: "",
        FotoOperador: "",
        TipoRegimen: "",
        IdDepartamento: 0,
        TipoContrato: "",
        TipoJornada: "",
        PeriodicidadDePago: "",
        RiesgoPuesto: "",
        CorreoOperador: "",
        Licencia: "",
        LicenciaVencimiento: "",
        LicenciaA: false,
        LicenciaB: false,
        LicenciaC: false,
        Pasaporte: "",
        PasaporteVencimiento: "",
        NSS: "",
        GrupoSanguineo: "",
        Alergias: false,
        Diabetico: false,
        Hipertenso: false,
        CreadoEl: "",
        CreadoPor: localStorage.getItem("UsuarioId"),
        ModificadoEl: "",
        ModificadoPor: localStorage.getItem("UsuarioId"),
        IdBanco: 0,
        NumeroCuentaBancaria: "",
        NoTarjeta: "",
        Observaciones: "",
        TipoOperacion: 0,
        EstadoCivil: "",
        BeneficiarioFallecimiento: "",
        CasoAccidenteAvisarA: "",
        IdPuesto: 0,
        FechaNacimiento: "",
        FactorVSMinInvonavit: 0,
        FactorPorcentajeInfonavit: 0,
        RetencionDiariaInfonavit: 0,
        retencionDiariaFonacot: 0,
        AppMisViajes: false,
        UsuarioViajes: "",
        ContraseñaViajes: "",
        AppPaqueteria: false,
        UsuarioPaqueteria: "",
        ContraseñaPaqueteria: "",
        height: window.innerHeight,
        DerechoBorrar: 63,
    });

    function handleShowAgregar() {
        setState({
            ...state,
            agregar: "Agregar",
            IdOperador: 0,
            NumeroOperador: 0,
            Activo: true,
            Nombre: "",
            ApellidoMaterno: "",
            ApellidoPaterno: "",
            NombreCompleto: "",
            RFC: "",
            CURP: "",
            FechaContratacion: "",
            IdSucursal: 0,
            Telefono: "",
            TelefonoCelular: "",
            Domicilio: "",
            IdEstado: 0,
            IdPais: 0,
            HashGPS: "",
            FotoOperador: "",
            TipoRegimen: "",
            IdDepartamento: 0,
            TipoContrato: "",
            TipoJornada: "",
            PeriodicidadDePago: "",
            RiesgoPuesto: "",
            CorreoOperador: "",
            Licencia: "",
            LicenciaVencimiento: "",
            LicenciaA: false,
            LicenciaB: false,
            LicenciaC: false,
            Pasaporte: "",
            PasaporteVencimiento: "",
            NSS: "",
            GrupoSanguineo: "",
            Alergias: false,
            Diabetico: false,
            Hipertenso: false,
            CreadoEl: "",
            ModificadoEl: "",
            IdBanco: 0,
            NumeroCuentaBancaria: "",
            NoTarjeta: "",
            Observaciones: "",
            TipoOperacion: 0,
            EstadoCivil: "",
            BeneficiarioFallecimiento: "",
            CasoAccidenteAvisarA: "",
            IdPuesto: 0,
            FechaNacimiento: "",
            FactorVSMinInvonavit: 0,
            FactorPorcentajeInfonavit: 0,
            RetencionDiariaInfonavit: 0,
            retencionDiariaFonacot: 0,
            AppMisViajes: false,
            UsuarioViajes: "",
            ContraseñaViajes: "",
            AppPaqueteria: false,
            UsuarioPaqueteria: "",
            ContraseñaPaqueteria: "",
        });
    }

    const handleAceptar = (e) => {
        e.preventDefault();
        var params = {
            IdOperador: state.IdOperador,
            NumeroOperador: state.NumeroOperador,
            Activo: state.Activo,
            Nombre: state.Nombre,
            ApellidoMaterno: state.ApellidoMaterno,
            ApellidoPaterno: state.ApellidoPaterno,
            NombreCompleto: state.NombreCompleto,
            RFC: state.RFC,
            CURP: state.CURP,
            FechaContratacion: state.FechaContratacion,
            IdSucursal: state.IdSucursal,
            Telefono: state.Telefono,
            TelefonoCelular: state.TelefonoCelular,
            Domicilio: state.Domicilio,
            IdEstado: state.IdEstado,
            IdPais: state.IdPais,
            HashGPS: state.HashGPS,
            FotoOperador: state.FotoOperador,
            TipoRegimen: state.TipoRegimen,
            IdDepartamento: state.IdDepartamento,
            TipoContrato: state.TipoContrato,
            TipoJornada: state.TipoJornada,
            PeriodicidadDePago: state.PeriodicidadDePago,
            RiesgoPuesto: state.RiesgoPuesto,
            CorreoOperador: state.CorreoOperador,
            Licencia: state.Licencia,
            LicenciaVencimiento: state.LicenciaVencimiento,
            LicenciaA: state.LicenciaA,
            LicenciaB: state.LicenciaB,
            LicenciaC: state.LicenciaC,
            Pasaporte: state.Pasaporte,
            PasaporteVencimiento: state.PasaporteVencimiento,
            NSS: state.NSS,
            GrupoSanguineo: state.GrupoSanguineo,
            Alergias: state.Alergias,
            Diabetico: state.Diabetico,
            Hipertenso: state.Hipertenso,
            CreadoEl: state.CreadoEl,
            CreadoPor: state.CreadoPor,
            ModificadoEl: state.ModificadoEl,
            ModificadoPor: state.ModificadoPor,
            IdBanco: state.IdBanco,
            NumeroCuentaBancaria: state.NumeroCuentaBancaria,
            NoTarjeta: state.NoTarjeta,
            Observaciones: state.Observaciones,
            TipoOperacion: state.TipoOperacion,
            EstadoCivil: state.EstadoCivil,
            BeneficiarioFallecimiento: state.BeneficiarioFallecimiento,
            CasoAccidenteAvisarA: state.CasoAccidenteAvisarA,
            IdPuesto: state.IdPuesto,
            FechaNacimiento: state.FechaNacimiento,
            FactorVSMinInvonavit: state.FactorVSMinInvonavit,
            FactorPorcentajeInfonavit: state.FactorPorcentajeInfonavit,
            RetencionDiariaInfonavit: state.RetencionDiariaInfonavit,
            RetencionDiariaFonacot: state.retencionDiariaFonacot,
            AppMisViajes: state.AppMisViajes,
            UsuarioViajes: state.UsuarioViajes,
            ContrasenaViajes: state.ContraseñaViajes,
            AppPaqueteria: state.AppPaqueteria,
            UsuarioPaqueteria: state.UsuarioPaqueteria,
            ContrasenaPaqueteria: state.ContraseñaPaqueteria,

            agregar: "Agregar",
            importar: "",
        };

        console.log(params);
        if (state.IdOperador != 0) {
            modificarOperadores(state.IdOperador, params)

                .then((respuesta) => {
                    showSuccess(respuesta.data);

                    getAllOperadores();
                })
                .catch((err) => {
                    console.log(err);
                    showSuccess("err");
                });
        } else {
            agregarOperadores(params)
                .then((respuesta) => {
                    showSuccess(respuesta.data);
                    getAllOperadores();
                    //window.location.reload();
                })
                .catch((err) => {
                    console.log(err);
                    showSuccess(err);
                });
        }
    };

    const [dataSucursales, setDataSucursales] = React.useState([]);
    const [dataOperadores, setDataOperador] = React.useState([]);

    const [dataPais, setDataPais] = React.useState([]);
    const [dataDepartamento, setDataDepartamento] = React.useState([]);
    const [dataPuesto, setDataPuesto] = React.useState([]);

    const [dataEstado, setDataEstado] = React.useState([]);

    useEffect((value) => {
        if (localStorage.getItem("UsuarioId") === null || localStorage.getItem("UsuarioId") <= 0) {
            showSuccess("Es necesario iniciar sesion para acceder a este proceso");
            window.location.replace("configuracion");
            return;
        }
        getAllSucursales();
        getAllPaises();
        getAllOperadores();
        getAllPuestos();
        getAllDepartamentos();
    }, []);


    const handleChangeNumero = (event) => {
        validarNumeroOperadores(state.NumeroOperador)
            .then((respuesta) => {
                if (respuesta.data != "") {
                    showSuccess(respuesta.data.m_sMensaje);
                    console.log(respuesta.data);
                    setState({
                        ...state,

                        NumeroOperador: respuesta.data.m_nNumero,
                    });
                }
            })

            .catch((err) => {
                showSuccess(err);
            });
    };

    const handleChangeActivoCheckboxChange = (event) => {
        setState({
            ...state,
            activo: !state.activo,
        });
        console.log(event.target.name + " " + state.activo);
    };

    const handleChangeAppViajes = (event) => {
        setState({
            ...state,
            AppMisViajes: !state.AppMisViajes,
        });
        console.log(event.target.name + " " + state.AppMisViajes);
    };

    const handleChangeAppPaqueteria = (event) => {
        setState({
            ...state,
            AppPaqueteria: !state.AppPaqueteria,
        });
        console.log(event.target.name + " " + state.AppPaqueteria);
    };

    const handleChangeLicenciaA = (event) => {
        setState({
            ...state,
            LicenciaA: !state.LicenciaA,
        });
        console.log(event.target.name + " " + state.activo);
    };

    const handleChangeLicenciaB = (event) => {
        setState({
            ...state,
            LicenciaB: !state.LicenciaB,
        });
        console.log(event.target.name + " " + state.activo);
    };

    const handleChangeLicenciaC = (event) => {
        setState({
            ...state,
            LicenciaC: !state.LicenciaC,
        });
        console.log(event.target.name + " " + state.activo);
    };

    function handleShowModificar(id) {
        console.log(id);
        obtenerOperadoresId(id).then((respuesta) => {
            console.log(respuesta.data);
            setState({
                ...state,
                agregar: "Modificar",
                IdOperador: id,
                NumeroOperador: respuesta.data.m_nNumeroOperador,
                Activo: respuesta.data.m_bActivo,
                Nombre: respuesta.data.m_sNombre,
                ApellidoMaterno: respuesta.data.m_sApellidoMaterno,
                ApellidoPaterno: respuesta.data.m_sApellidoPaterno,
                NombreCompleto: respuesta.data.m_sNombreCompleto,
                RFC: respuesta.data.m_sRFC,
                CURP: respuesta.data.m_sCURP,
                FechaContratacion: respuesta.data.m_dtFechaContratacion,
                IdSucursal: respuesta.data.m_nIdSucursal,
                Telefono: respuesta.data.m_sTelefono,
                TelefonoCelular: respuesta.data.m_sTelefonoCelular,
                Domicilio: respuesta.data.m_sDomicilio,
                IdEstado: respuesta.data.m_nIdEstado,
                IdPais: respuesta.data.m_nIdPais,
                HashGPS: respuesta.data.m_sHashGPS,
                FotoOperador: respuesta.data.m_sFotoOperador,
                TipoRegimen: respuesta.data.m_sTipoRegimen,
                IdDepartamento: respuesta.data.m_nIdDepartamento,
                TipoContrato: respuesta.data.m_sTipoContrato,
                TipoJornada: respuesta.data.m_sTipoJornada,
                PeriodicidadDePago: respuesta.data.m_sPeriodicidadDePago,
                RiesgoPuesto: respuesta.data.m_sRiesgoPuesto,
                CorreoOperador: respuesta.data.m_sCorreoOperador,
                Licencia: respuesta.data.m_sLicencia,
                LicenciaVencimiento: respuesta.data.m_dtLicenciaVencimiento,
                LicenciaA: respuesta.data.m_bLicenciaA,
                LicenciaB: respuesta.data.m_bLicenciaB,
                LicenciaC: respuesta.data.m_bLicenciaC,
                Pasaporte: respuesta.data.m_sPasaporte,
                PasaporteVencimiento: respuesta.data.m_dtPasaporteVencimiento,
                NSS: respuesta.data.m_sNSS,
                GrupoSanguineo: respuesta.data.m_sGrupoSanguineo,
                Alergias: respuesta.data.m_sAlergias,
                Diabetico: respuesta.data.m_bDiabetico,
                Hipertenso: respuesta.data.m_bHipertenso,
                CreadoEl: respuesta.data.m_dtCreadoEl,
                ModificadoEl: respuesta.data.m_dtModificadoEl,
                IdBanco: respuesta.data.m_nIdBanco,
                NumeroCuentaBancaria: respuesta.data.m_sNumeroCuentaBancaria,
                NoTarjeta: respuesta.data.m_sNoTarjeta,
                Observaciones: respuesta.data.m_sObservaciones,
                TipoOperacion: respuesta.data.m_nTipoOperacion,
                EstadoCivil: respuesta.data.m_sEstadoCivil,
                BeneficiarioFallecimiento: respuesta.data.m_sBeneficiarioFallecimiento,
                CasoAccidenteAvisarA: respuesta.data.m_sCasoAccidenteAvisarA,
                IdPuesto: respuesta.data.m_nIdPuesto,
                FechaNacimiento: respuesta.data.m_dtFechaNacimiento,
                FactorVSMinInvonavit: respuesta.data.m_cyFactorVSMinInvonavit,
                FactorPorcentajeInfonavit: respuesta.data.m_cyFactorPorcentajeInfonavit,
                RetencionDiariaInfonavit: respuesta.data.m_cyRetencionDiariaInfonavit,
                retencionDiariaFonacot: respuesta.data.m_cyRetencionDiariaFonacot,
                AppMisViajes: respuesta.data.m_bAppMisViajes,
                UsuarioViajes: respuesta.data.m_sUsuarioViajes,
                ContraseñaViajes: respuesta.data.m_sContrasenaViajes,
                AppPaqueteria: respuesta.data.m_bAppPaqueteria,
                UsuarioPaqueteria: respuesta.data.m_sUsuarioPaqueteria,
                ContraseñaPaqueteria: respuesta.data.m_sContrasenaPaqueteria,
            });
        });
    }

    function getAllOperadores() {
        obtenerOperadores().then((respuesta) => {
            console.log(respuesta);

            setDataOperador(respuesta.data);
        });
    }

    function getAllDepartamentos() {
        obtenerDepartamentos().then((respuesta) => {
            console.log(respuesta);

            setDataDepartamento(respuesta.data);
        });
    }

    function getAllPuestos() {
        obtenerPuestos().then((respuesta) => {
            console.log(respuesta);

            setDataPuesto(respuesta.data);
        });
    }

    function getAllSucursales() {
        obtenerSucursales().then((respuesta) => {
            setDataSucursales(respuesta.data);
        });
    }

    function getAllPaises() {
        obtenerPaises().then((respuesta) => {
            console.log(respuesta);

            setDataPais(respuesta.data);
        });
    }

    function handleEliminar(id) {
        var derecho;
        validarPermisos(state).then(respuesta => {
            //showSuccess(respuesta.data)

            derecho = respuesta.data;
            if (derecho == false) {
                showSuccess("El usuario no tiene derechos para realizar el proceso");
                return;
            }
            eliminarOperadores(id, state.CreadoPor)
                .then((respuesta) => {
                    console.log(respuesta);
                    getAllOperadores();
                }).catch(err => {
                    showSuccess(err)
                });
        }).catch(err => {
            showSuccess(err)
        });
    }

    const handleChange = (event) => {
        console.log(event.target.name + " : " + event.target.value);
        setState({
            ...state,
            [event.target.name]: event.target.value,
        });
    };

    function handleSelectRow(id, event) {
        setState({
            ...state,
            IdOperador: id
        });
    }

    const handleChangeNombreCompleto = (event) => {
        console.log(event.target.name + " : " + event.target.value);
        setState({
            ...state,
            NombreCompleto:
                state.ApellidoPaterno +
                " " +
                state.ApellidoMaterno +
                " " +
                state.Nombre,
            [event.target.name]: event.target.value,
        });
    };

    const getModificar = (id) => {
        obtenerUnidadesId(id).then((respuesta) => {
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
        //closeSeccions();
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
                scrollTop: parseInt($section.offset().top - 150),
            },
            200
        );
    }

    
    useEffect((value) => {
        if (localStorage.getItem("UsuarioId") === null || localStorage.getItem("UsuarioId") <= 0) {
            showSuccess("Es necesario iniciar sesion para acceder a este proceso");
            window.location.replace("login");
            return;
        }
        //closeSeccions();
    }, []);

    return (
        <div >

            <header className="topbar clearfix">
                <Cabecera titulo="Operadores" >
                    <div className="page-header">
                        <ul className="list-page-breadcrumb">
                            <li>
                                <a href="/Catalogos" className="color-mapeo">
                                    Catálogos <i className="zmdi zmdi-chevron-right" />
                                </a>
                            </li>
                            <li className="active-page">Operadores</li>
                        </ul>
                    </div>
                </Cabecera>
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

                    <ul className="nav navStatica nav-tabs">
                        <li className="active">
                            <a data-toggle="tab" href="#Listado">
                                <i className="fa fa-list" /> Listado
              </a>
            </li>
            <li>
              <a data-toggle="tab" href="#Agregar" onClick={handleShowAgregar}>
                <i className="fa fa-plus-circle" /> {state.agregar}{" "}
              </a>
            </li>
            {/*<li>*/}
            {/*  <ExportCSV csvData={dataOperadores} fileName="Operadores_Listado" />*/}
            {/*</li>*/}
            {/*<li>*/}
            {/*  <ExportPDF data={dataOperadores} column={columns} fileName="Operadores" />*/}
            {/*</li>*/}
          </ul>

                    <div className="tab-content">
                        <div id="Listado" className="tab-pane fade in active">
                            <div className="widget-wrap">
                                <div className="widget-content">
                                    <div className="row" style={{ height: state.height - 250, width: '100%' }}>
                                        {dataOperadores.length != 0 ? (
                                            <DataGrid
                                                localeText={dataGridLocaleText}
                                                rows={dataOperadores}
                                                columns={columns}
                                                density="compact"
                                                pageSize={Math.floor((state.height - 310) / 30)}
                                                getRowId={(row) => row.m_nIdOperador}
                                                onRowSelected={(row) => {
                                                    setState({
                                                        ...state,
                                                        IdOperador: row.data.m_nIdOperador
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
                        <div id="Importar" className="tab-pane fade "></div>
                        <div id="Imprimir" className="tab-pane fade ">
                            Imprimir
            </div>

                        <div id="Agregar" className="tab-pane fade">

                            <form  onSubmit={handleAceptar} className="j-forms j-multistep" id="j-forms">
                                {/*Inicio de ejemplo*/}
                                <div className="form-content">

                                    {/* start steps */}
                                    <div
                                        className="wizard-breadcrumb number-style"
                                        style={{
                                            position: "sticky",
                                            top: "60px",
                                            padding: "5px",
                                            backgroundColor: "white",
                                            zIndex: 100,
                                            marginBottom: "10px",

                                        }}
                                    >
                                        <div className="row">
                                            <Stepper activeStep={stepActive - 1}>
                                                {
                                                    ["Información General", "General", "Liquidaciones CFDI", "Más Información", "Incidencias", "App. Móviles", "Fotos / Documentos"].map((s, index) => (
                                                        <Step key={s} completed={false} onClick={() => openSection(index + 1)}>
                                                            <StepLabel >{s}</StepLabel>
                                                        </Step>
                                                    ))
                                                }
                                            </Stepper>
                                        </div>
                                    </div>
                                    {/* end steps */}


                                    <div className="widget-wrap" id="infogral">
                                        <div className="widget-header block-header margin-bottom-0 clearfix">
                                            <div className="pull-left">
                                                <h3>Información General</h3>
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
                                                                    <div className="col-sm-12 col-md-2-5 ">
                                                                        <div className="input">
                                                                            <TextField variant="outlined" margin="dense" label="Número"
                                                                                onChange={handleChange}
                                                                                onBlur={handleChangeNumero}
                                                                                value={state.NumeroOperador}
                                                                                name="NumeroOperador"
                                                                                className="form-control"
                                                                                type="number"
                                                                                min="0"
                                                                            />
                                                                        </div>
                                                                    </div>
                                                                    <div className="col-sm-12 col-md-2-5 unit">
                                                                        <div className="inline-group">
                                                                            <label className="label">
                                                                                Estado del Operador
                                                  </label>
                                                                            <label className="checkbox">
                                                                                <input
                                                                                    onChange={
                                                                                        handleChangeActivoCheckboxChange
                                                                                    }
                                                                                    value={state.Activo}
                                                                                    name="Activo"
                                                                                    required
                                                                                    native
                                                                                    type="checkbox"
                                                                                />
                                                                                <i />
                                                    Activo
                                                  </label>
                                                                        </div>
                                                                    </div>
                                                                    <div className="col-md-4 unit">

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
                                                                                onChange={handleChange}
                                                                                value={state.FotoOperador}
                                                                                name="FotoOperador"
                                                                                className="form-control"
                                                                                type="text"
                                                                                id="prepend-small-btn"
                                                                                readOnly
                                                                                placeholder="no file selected"
                                                                            />
                                                                        </div>



                                                                    </div>
                                                                    <div className="col-ms-3 col-md-3 unit">
                                                                        <img
                                                                            src="src\iconos\operador.png"
                                                                            class="rounded float-right"
                                                                            alt="..."
                                                                        />
                                                                    </div>
                                                                </div>
                                                                {/* end text password */}
                                                                {/* start email url */}
                                                                <div className="col-sm-12 col-md-2-5 unit">
                                                                    <div className="input">
                                                                        <TextField variant="outlined" margin="dense" label="Apellido Paterno"
                                                                            className="form-control"
                                                                            onChange={handleChange}
                                                                            value={
                                                                                state.ApellidoPaterno
                                                                            }
                                                                            name="ApellidoPaterno"
                                                                            type="text"
                                                                            placeholder="Apellido Paterno"
                                                                            id="text"
                                                                            required
                                                                            native
                                                                        />
                                                                    </div>
                                                                </div>
                                                                <div className="col-sm-12 col-md-2-5 unit">
                                                                    <div className="input">
                                                                        <TextField variant="outlined" margin="dense" label="Apellido Materno"
                                                                            onChange={handleChange}
                                                                            value={
                                                                                state.ApellidoMaterno
                                                                            }
                                                                            name="ApellidoMaterno"
                                                                            className="form-control"
                                                                            type="text"
                                                                            placeholder="Apellido Materno"
                                                                            id="text"
                                                                            required
                                                                            native
                                                                        />
                                                                    </div>{" "}
                                                                </div>
                                                                <div className="col-sm-12 col-md-2-5 unit">
                                                                    <div className="input">
                                                                        <TextField variant="outlined" margin="dense" label="Nombre"
                                                                            onChange={handleChange}
                                                                            value={state.Nombre}
                                                                            name="Nombre"
                                                                            className="form-control"
                                                                            type="text"
                                                                            placeholder=""
                                                                            id="text"
                                                                            required
                                                                            native
                                                                        />
                                                                    </div>{" "}
                                                                </div>
                                                                <div className="col-sm-12 col-md-2-5 unit">
                                                                    <div className="input">
                                                                        <TextField variant="outlined" margin="dense" label="Nombre Completo"
                                                                            onChange={handleChange}
                                                                            value={state.NombreCompleto}
                                                                            name="NombreCompleto"
                                                                            className="form-control"
                                                                            type="text"
                                                                            placeholder="Nombre Completo"
                                                                            id="text"
                                                                            required
                                                                            native
                                                                        />
                                                                    </div>{" "}
                                                                </div>
                                                                <div className="col-sm-12 col-md-2-5 unit">
                                                                    <div className="input">
                                                                        <TextField variant="outlined" margin="dense" label="Fecha de Contratación"
                                                                            onChange={handleChange}
                                                                            value={
                                                                                state.FechaContratacion
                                                                            }
                                                                            InputLabelProps={{
                                                                                shrink: true,
                                                                            }}
                                                                            name="FechaContratacion"
                                                                            className="form-control"
                                                                            type="date"
                                                                            placeholder=""
                                                                        />
                                                                    </div>

                                                                </div>


                                                                {/* end search */}
                                                                {/* start textarea */}

                                                                <div className="col-sm-12 col-md-2-5 unit">
                                                                    <div className="input">
                                                                        <TextField variant="outlined" margin="dense" label="RFC"
                                                                            onChange={handleChange}
                                                                            value={state.RFC}
                                                                            name="RFC"
                                                                            className="form-control"
                                                                            type="text"
                                                                            pattern="[A-Z&Ñ]{3,4}[0-9]{2}(0[1-9]|1[012])(0[1-9]|[12][0-9]|3[01])[A-Z0-9]{2}[0-9A]"
                                                                            title="Favor de introducir un RFC válido."
                                                                            placeholder="RFC"
                                                                            id="text"
                                                                            required
                                                                            native
                                                                        />
                                                                    </div>
                                                                </div>
                                                                <div className="col-sm-12 col-md-2-5 unit ">
                                                                    <div className="input">
                                                                        <TextField variant="outlined" margin="dense" label="CURP"
                                                                            onChange={handleChange}
                                                                            value={state.CURP}
                                                                            name="CURP"
                                                                            placeholder="CURP"
                                                                            class="form-control"
                                                                            type="text"
                                                                            pattern="^([A-Z&]|[a-z&]{1})([AEIOU]|[aeiou]{1})([A-Z&]|[a-z&]{1})([A-Z&]|[a-z&]{1})([0-9]{2})(0[1-9]|1[0-2])(0[1-9]|1[0-9]|2[0-9]|3[0-1])([HM]|[hm]{1})([AS|as|BC|bc|BS|bs|CC|cc|CS|cs|CH|ch|CL|cl|CM|cm|DF|df|DG|dg|GT|gt|GR|gr|HG|hg|JC|jc|MC|mc|MN|mn|MS|ms|NT|nt|NL|nl|OC|oc|PL|pl|QT|qt|QR|qr|SP|sp|SL|sl|SR|sr|TC|tc|TS|ts|TL|tl|VZ|vz|YN|yn|ZS|zs|NE|ne]{2})([^A|a|E|e|I|i|O|o|U|u]{1})([^A|a|E|e|I|i|O|o|U|u]{1})([^A|a|E|e|I|i|O|o|U|u]{1})([0-9]{2})$"
                                                                            title="Favor de introducir un CURP válido."
                                                                            required
                                                                            id="CURP"
                                                                            native
                                                                        />
                                                                    </div>{" "}
                                                                </div>


                                                                <div className="col-sm-12 col-md-2-5 unit  ">
                                                                    <label className="input select">
                                                                        <FormControl fullWidth variant="outlined"
                                                                            margin="dense">
                                                                            <InputLabel id="sucursalLabel">Sucursal</InputLabel>
                                                                            <Select
                                                                                labelId="sucursalLabel"
                                                                                label="Sucursal"
                                                                                onChange={handleChange}
                                                                                value={state.IdSucursal}
                                                                                name="IdSucursal"
                                                                                native
                                                                                className="form-control"
                                                                                name="sucursal"
                                                                            >
                                                                                <option value="none">
                                                                                    Sucursal
                                                    </option>

                                                                                {dataSucursales.map(
                                                                                    (sucursal) => (
                                                                                        <option
                                                                                            value={
                                                                                                sucursal.m_nIdSucursal
                                                                                            }
                                                                                        >
                                                                                            {sucursal.m_sSucursal}
                                                                                        </option>
                                                                                    )
                                                                                )}
                                                                            </Select>
                                                                        </FormControl>
                                                                    </label>
                                                                </div>
                                                                <div className="col-sm-12 col-md-2-5 unit ">
                                                                    <div className="input">
                                                                        <TextField variant="outlined" margin="dense" label="Teléfono"
                                                                            onChange={handleChange}
                                                                            value={state.Telefono}
                                                                            name="Telefono"
                                                                            className="form-control"
                                                                            type="text"
                                                                            placeholder="Teléfono"
                                                                            id="text"
                                                                            native
                                                                        />
                                                                    </div>
                                                                </div>
                                                                <div className="col-sm-12 col-md-2-5 unit ">
                                                                    <div className="input">
                                                                        <TextField variant="outlined" margin="dense" label="Tel. Celular"
                                                                            onChange={handleChange}
                                                                            value={
                                                                                state.TelefonoCelular
                                                                            }
                                                                            name="TelefonoCelular"
                                                                            className="form-control"
                                                                            type="text"
                                                                            placeholder="Teléfono Celular"
                                                                            id="text"
                                                                            native
                                                                        />
                                                                    </div>{" "}
                                                                </div>

                                                                <div className="col-sm-12 col-md-2-5 unit">
                                                                    <div className="input">
                                                                        <TextField variant="outlined" margin="dense" label="Domicilio"
                                                                            onChange={handleChange}
                                                                            value={state.Domicilio}
                                                                            name="Domicilio"
                                                                            className="form-control"
                                                                            type="text"
                                                                            placeholder="Domicilio"
                                                                            id="text"
                                                                            native
                                                                        />
                                                                    </div>{" "}
                                                                </div>
                                                                <div className="col-sm-12 col-md-2-5 unit">
                                                                    <label className="input select">
                                                                        <FormControl fullWidth variant="outlined"
                                                                            margin="dense">
                                                                            <InputLabel id="IdPaisLabel">País</InputLabel>
                                                                            <Select
                                                                                labelId="IdPaisLabel"
                                                                                label="País"
                                                                                onChange={handleChange}
                                                                                value={state.IdPais}
                                                                                name="IdPais"
                                                                                className="form-control"
                                                                                required
                                                                                native
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
                                                                <div className="col-sm-12 col-md-2-5 unit">
                                                                    <label className="input select">
                                                                        <FormControl fullWidth variant="outlined"
                                                                            margin="dense">
                                                                            <InputLabel id="IdEstadoLabel">Estado</InputLabel>
                                                                            <Select
                                                                                labelId="IdEstadoLabel"
                                                                                label="Estado"
                                                                                onFocusCapture={
                                                                                    handleChange
                                                                                }
                                                                                value={state.IdEstado}
                                                                                name="IdEstado"
                                                                                className="form-control"
                                                                                required
                                                                                native
                                                                            >
                                                                                {
                                                                                    dataEstado.length < 1 ?

                                                                                        <option value="none">
                                                                                            Estados
                                    </option>
                                                                                        :
                                                                                        dataEstado.map((estado) => (
                                                                                            <option value={estado.m_nIdEstado}>
                                                                                                {estado.m_sEstado}
                                                                                            </option>
                                                                                        ))
                                                                                }
                                                                            </Select>
                                                                        </FormControl>
                                                                    </label>
                                                                </div>
                                                                <div className="col-sm-12 col-md-2-5 unit">
                                                                    <div className="input">
                                                                        <TextField variant="outlined" margin="dense" label="Hash GMT GPS"
                                                                            onFocusCapture={handleChange}
                                                                            value={state.HashGPS}
                                                                            name="HashGPS"
                                                                            className="form-control"
                                                                            type="text"
                                                                            placeholder="Hash GMT GPS"
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



                                    <div className="widget-wrap" id="general">
                                        <div className="widget-header block-header margin-bottom-0 clearfix">
                                            <div className="pull-left">
                                                <h3>General</h3>
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
                                                                    <div className="col-lg-4 col-md-6 col-sm-12 unit ">
                                                                        <div className="row">
                                                                            <div className="w-section-header">
                                                                                <h3>Documentos</h3>
                                                                            </div>
                                                                            <div className="col-md-6 unit">
                                                                                <div className="input">
                                                                                    <TextField variant="outlined" margin="dense" label="Licencia"
                                                                                        onChange={handleChange}
                                                                                        value={state.Licencia}
                                                                                        name="Licencia"
                                                                                        className="form-control"
                                                                                        type="text"
                                                                                        placeholder=""
                                                                                        id="text"
                                                                                        native
                                                                                    />
                                                                                </div>{" "}
                                                                            </div>
                                                                            <div className="col-md-6 unit">
                                                                                <div className="input">
                                                                                    <TextField variant="outlined" margin="dense" label="Vencimiento"
                                                                                        onChange={handleChange}
                                                                                        value={
                                                                                            state.LicenciaVencimiento
                                                                                        }
                                                                                        InputLabelProps={{
                                                                                            shrink: true,
                                                                                        }}
                                                                                        name="LicenciaVencimiento"
                                                                                        class="form-control"
                                                                                        type="datetime-local"
                                                                                        id="date-icon"
                                                                                    />
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
                                                                                        onChange={
                                                                                            handleChangeLicenciaA
                                                                                        }
                                                                                        value={state.LicenciaA}
                                                                                        name="LicenciaA"
                                                                                        type="checkbox"
                                                                                        defaultChecked
                                                                                    />
                                                                                    <i />A
                                                    </label>
                                                                                <label className="checkbox">
                                                                                    <input
                                                                                        onChange={
                                                                                            handleChangeLicenciaB
                                                                                        }
                                                                                        value={state.LicenciaB}
                                                                                        name="LicenciaB"
                                                                                        type="checkbox"
                                                                                    />
                                                                                    <i />B
                                                    </label>
                                                                                <label className="checkbox">
                                                                                    <input
                                                                                        onChange={
                                                                                            handleChangeLicenciaC
                                                                                        }
                                                                                        value={state.LicenciaC}
                                                                                        name="LicenciaC"
                                                                                        type="checkbox"
                                                                                    />
                                                                                    <i />C
                                                    </label>
                                                                            </div>
                                                                        </div>
                                                                        <div className="row">
                                                                            <div className="col-md-6 unit">
                                                                                <div className="input">
                                                                                    <TextField variant="outlined" margin="dense" label="Pasaporte"
                                                                                        onChange={
                                                                                            handleChangeLicenciaA
                                                                                        }
                                                                                        value={state.Pasaporte}
                                                                                        name="Pasaporte"
                                                                                        className="form-control"
                                                                                        type="text"
                                                                                        placeholder=""
                                                                                        id="text"
                                                                                        native
                                                                                    />
                                                                                </div>
                                                                            </div>
                                                                            <div className="col-md-6 unit">
                                                                                <div className="input">
                                                                                    <TextField variant="outlined" margin="dense" label="Vencimiento"
                                                                                        onChange={handleChange}
                                                                                        value={
                                                                                            state.PasaporteVencimiento
                                                                                        }
                                                                                        InputLabelProps={{
                                                                                            shrink: true,
                                                                                        }}
                                                                                        name="PasaporteVencimiento"
                                                                                        class="form-control"
                                                                                        type="datetime-local"
                                                                                        id="date-icon"
                                                                                    />
                                                                                </div>
                                                                            </div>
                                                                        </div>
                                                                        <div className="row">
                                                                            <div className="w-section-header">
                                                                                <h3>Datos Hospitalarios</h3>
                                                                            </div>
                                                                            <div className="col-md-4 unit">
                                                                                <div className="input">
                                                                                    <TextField variant="outlined" margin="dense" label="Núm. IMSS"
                                                                                        onChange={handleChange}
                                                                                        value={state.NSS}
                                                                                        name="NSS"
                                                                                        className="form-control"
                                                                                        type="text"
                                                                                        placeholder=""
                                                                                        id="text"
                                                                                        native
                                                                                    />
                                                                                </div>{" "}
                                                                            </div>
                                                                            <div className="col-md-8 unit">

                                                                                <label className="input select">
                                                                                    <FormControl fullWidth variant="outlined"
                                                                                        margin="dense">
                                                                                        <InputLabel id="GrupoSanguineoLabel">Grupo Sanguineo</InputLabel>
                                                                                        <Select
                                                                                            labelId="GrupoSanguineoLabel"
                                                                                            label="Grupo Sanguine"
                                                                                            onChange={handleChange}
                                                                                            value={
                                                                                                state.GrupoSanguineo
                                                                                            }
                                                                                            name="GrupoSanguineo"
                                                                                            native
                                                                                            className="form-control"
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
                                                                                        </Select>
                                                                                    </FormControl>
                                                                                </label>
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                    <div className="col-lg-4 col-md-6 col-sm-12 unit bordeslaterales">
                                                                        <div className="row">
                                                                            <div className="w-section-header">
                                                                                <h3>Cuenta Bancaria</h3>
                                                                            </div>
                                                                            <div className="col-sm-12 col-md-6 unit">
                                                                                <div className="input">
                                                                                    <TextField variant="outlined" margin="dense" label="Núm. IMSS"
                                                                                        onChange={handleChange}
                                                                                        value={state.IdBanco}
                                                                                        name="IdBanco"
                                                                                        className="form-control"
                                                                                        type="text"
                                                                                        placeholder=""
                                                                                        id="text"
                                                                                        disabled
                                                                                        native
                                                                                    />
                                                                                </div>{" "}
                                                                            </div>
                                                                            <div className="col-sm-12 col-md-6 unit">
                                                                                <div className="input">
                                                                                    <TextField variant="outlined" margin="dense" label="Cuenta CLABE"
                                                                                        onChange={handleChange}
                                                                                        value={
                                                                                            state.NumeroCuentaBancaria
                                                                                        }
                                                                                        name="NumeroCuentaBancaria"
                                                                                        className="form-control"
                                                                                        type="text"
                                                                                        placeholder=""
                                                                                        id="text"
                                                                                        native
                                                                                        disabled
                                                                                    />
                                                                                </div>{" "}
                                                                            </div>
                                                                            <div className="col-sm-12 col-md-6 unit">
                                                                                <div className="input">
                                                                                    <TextField variant="outlined" margin="dense" label="Núm. Tarjeta"
                                                                                        onChange={handleChange}
                                                                                        value={state.NoTarjeta}
                                                                                        name="NoTarjeta"
                                                                                        className="form-control"
                                                                                        type="text"
                                                                                        placeholder=""
                                                                                        id="text"
                                                                                        native
                                                                                        disabled
                                                                                    />
                                                                                </div>{" "}
                                                                            </div>
                                                                            <div className="col-sm-12 col-md-8 unit">
                                                                                <div className="w-section-header">
                                                                                    <h3>Observaciones</h3>
                                                                                </div>
                                                                                <div className="input">
                                                                                    <TextField variant="outlined" margin="dense" label=""
                                                                                        onChange={handleChange}
                                                                                        value={
                                                                                            state.Observaciones
                                                                                        }
                                                                                        name="Observaciones"
                                                                                        className="form-control"
                                                                                        type="text"
                                                                                        placeholder=""
                                                                                        id="text"
                                                                                        native
                                                                                        disabled
                                                                                    />
                                                                                </div>{" "}
                                                                            </div>
                                                                        </div>
                                                                    </div>

                                                                    <div className="col-lg-4 col-md-12 col-sm-12 unit " >
                                                                        <div className="row" style={{ paddingLeft: "10px" }}>
                                                                            <div className="w-section-header">
                                                                                <h3>
                                                                                    Vencimiento de Documentos
                                                    </h3>
                                                                            </div>
                                                                            <div className="unit">
                                                                                <div className="j-row toclone-widget-right toclone">
                                                                                    <div className="span4 unit">
                                                                                        <div className="input">
                                                                                            <TextField variant="outlined" margin="dense" label=""
                                                                                                disabled
                                                                                                className="form-control"
                                                                                                type="text"
                                                                                                placeholder="Documento"
                                                                                            />
                                                                                        </div>
                                                                                    </div>
                                                                                    <div className="span3 unit">
                                                                                        <div className="input">
                                                                                            <TextField variant="outlined" margin="dense" label=""
                                                                                                disabled
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
                                                                                                    name="Activo"
                                                                                                    type="checkbox"
                                                                                                    disabled
                                                                                                />
                                                                                                Activo
                                                                                                <i />
                                                                                            </label>
                                                                                        </div>
                                                                                    </div>
                                                                                    <div className="span3 unit">
                                                                                        <div className="input">
                                                                                            <div className="input">
                                                                                                <TextField variant="outlined" margin="dense" label=""
                                                                                                    class="form-control"
                                                                                                    InputLabelProps={{
                                                                                                        shrink: true,
                                                                                                    }}
                                                                                                    type="datetime-local"
                                                                                                    id="date-icon"
                                                                                                    readonly=""
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


                                    <div className="widget-wrap" id="liquidaciones">
                                        <div className="widget-header block-header margin-bottom-0 clearfix">
                                            <div className="pull-left">
                                                <h3>Liquidaciones CFDI</h3>
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
                                                                <div className="col-sm-12 col-md-2-5 unit">
                                                                    <label className="input select">
                                                                        <FormControl fullWidth variant="outlined"
                                                                            margin="dense">
                                                                            <InputLabel id="TipoRegimenLabel">Tipo de Regimen</InputLabel>
                                                                            <Select
                                                                                labelId="TipoRegimenLabel"
                                                                                label="Tipo de Regimen"
                                                                                className="form-control"
                                                                                onChange={handleChange}
                                                                                value={state.TipoRegimen}
                                                                                name="TipoRegimen"
                                                                            >
                                                                                <option value="Sueldos">
                                                                                    Sueldos
                                                    </option>
                                                                                <option value="Jubilados">
                                                                                    Jubilados
                                                    </option>
                                                                                <option value="Pensionados">
                                                                                    Pensionados
                                                    </option>
                                                                                <option value="Asimilados Acciones">
                                                                                    Asimilados Acciones
                                                    </option>
                                                                            </Select>
                                                                        </FormControl>
                                                                    </label>
                                                                </div>
                                                                <div className="col-sm-12 col-md-2-5 unit">
                                                                    <label className="input select">
                                                                        <FormControl fullWidth variant="outlined"
                                                                            margin="dense">
                                                                            <InputLabel id="IdDepartamentoLabel">Departamento</InputLabel>
                                                                            <Select
                                                                                labelId="IdDepartamentoLabel"
                                                                                label="Departamento"
                                                                                onChange={handleChange}
                                                                                value={state.IdDepartamento}
                                                                                name="IdDepartamento"
                                                                                className="form-control"
                                                                                required
                                                                                native
                                                                            >
                                                                                <option value="none">
                                                                                    Departamento
                                                    </option>

                                                                                {dataDepartamento.map(
                                                                                    (departamento) => (
                                                                                        <option
                                                                                            value={
                                                                                                departamento.m_nIdDepartamento
                                                                                            }
                                                                                        >
                                                                                            {
                                                                                                departamento.m_sDescripcion
                                                                                            }
                                                                                        </option>
                                                                                    )
                                                                                )}
                                                                            </Select>
                                                                        </FormControl>
                                                                    </label>
                                                                </div>
                                                                <div className="col-sm-12 col-md-2-5 unit">
                                                                    <label className="input select">
                                                                        <FormControl fullWidth variant="outlined"
                                                                            margin="dense">
                                                                            <InputLabel id="TipoContratoLabel">Tipo de Contrato</InputLabel>
                                                                            <Select
                                                                                labelId="TipoContratoLabel"
                                                                                label="Tipo de Contrato"
                                                                                className="form-control"
                                                                                onChange={handleChange}
                                                                                value={state.TipoContrato}
                                                                                name="TipoContrato"
                                                                            >
                                                                                <option
                                                                                    value="Contrato de trabajo por
                                                      tiempo indeterminado"
                                                                                >
                                                                                    Contrato de trabajo por
                                                                                    tiempo indeterminado
                                                    </option>
                                                                                <option
                                                                                    value="Contrato de trabajo por
                                                      tiempo determinado"
                                                                                >
                                                                                    Contrato de trabajo por
                                                                                    tiempo determinado
                                                    </option>
                                                                                <option value="Jubilación, Pensión, Retiro">
                                                                                    Jubilación, Pensión,
                                                                                    Retiro
                                                    </option>
                                                                                <option value="Otro contrato">
                                                                                    Otro contrato
                                                    </option>
                                                                            </Select>
                                                                        </FormControl>
                                                                    </label>
                                                                </div>

                                                                <div className="col-sm-12 col-md-2-5 unit">
                                                                    <label className="input select">
                                                                        <FormControl fullWidth variant="outlined"
                                                                            margin="dense">
                                                                            <InputLabel id="TipoJornadaLabel">Tipo de Jornada</InputLabel>
                                                                            <Select
                                                                                labelId="TipoJornadaLabel"
                                                                                label="Tipo de Jornada"
                                                                                className="form-control"
                                                                                onChange={handleChange}
                                                                                value={state.TipoJornada}
                                                                                name="TipoJornada"
                                                                            >
                                                                                <option value="Nocturno">
                                                                                    Nocturno
                                                    </option>
                                                                                <option value="Mixto">
                                                                                    Mixto
                                                    </option>
                                                                                <option value="Matutino">
                                                                                    Matutino
                                                    </option>
                                                                                <option value="Vespertino">
                                                                                    Vespertino
                                                    </option>
                                                                            </Select>
                                                                        </FormControl>
                                                                    </label>
                                                                </div>

                                                                <div className="col-sm-12 col-md-2-5 unit">
                                                                    <label className="input select">
                                                                        <FormControl fullWidth variant="outlined"
                                                                            margin="dense">
                                                                            <InputLabel id="PeriodicidadDePagoLabel">Periodicidad de pago</InputLabel>
                                                                            <Select
                                                                                labelId="PeriodicidadDePagoLabel"
                                                                                label="Periodicidad de pago"
                                                                                className="form-control"
                                                                                onChange={handleChange}
                                                                                value={
                                                                                    state.PeriodicidadDePago
                                                                                }
                                                                                name="PeriodicidadDePago"
                                                                            >
                                                                                <option value="Catorcena">
                                                                                    Catorcena
                                                    </option>
                                                                                <option value="Semanal">
                                                                                    Semanal
                                                    </option>
                                                                                <option value="Mensual">
                                                                                    Mensual
                                                    </option>
                                                                                <option value="Mensual B">
                                                                                    Mensual B
                                                    </option>
                                                                            </Select>
                                                                        </FormControl>
                                                                    </label>
                                                                </div>
                                                                <div className="col-sm-12 col-md-2-5 unit">
                                                                    <label className="input select">
                                                                        <FormControl fullWidth variant="outlined"
                                                                            margin="dense">
                                                                            <InputLabel id="RiesgoPuestoLabel">Riesgo del Puesto</InputLabel>
                                                                            <Select
                                                                                labelId="RiesgoPuestoLabel"
                                                                                label="Riesgo del Puesto"
                                                                                className="form-control"
                                                                                onChange={handleChange}
                                                                                value={state.RiesgoPuesto}
                                                                                name="RiesgoPuesto"
                                                                            >
                                                                                <option value="Clase 1">
                                                                                    Clase 1
                                                    </option>
                                                                                <option value="Clase 2">
                                                                                    Clase 2
                                                    </option>
                                                                                <option value="Clase 3">
                                                                                    Clase 3
                                                    </option>
                                                                                <option value="Clase 4">
                                                                                    Clase 4
                                                    </option>
                                                                            </Select>
                                                                        </FormControl>
                                                                    </label>
                                                                </div>

                                                                <div className="col-sm-12 col-md-2-5 unit">
                                                                    <div className="input">
                                                                        <TextField variant="outlined" margin="dense" label="Correo"
                                                                            onChange={handleChange}
                                                                            value={state.CorreoOperador}
                                                                            name="CorreoOperador"
                                                                            className="form-control"
                                                                            type="email"
                                                                            placeholder=""
                                                                            id="text"
                                                                            native
                                                                        />
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


                                    <div className="widget-wrap" id="mas">
                                        <div className="widget-header block-header margin-bottom-0 clearfix">
                                            <div className="pull-left">
                                                <h3>Más Información</h3>
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
                                                                <div className="col-sm-12 col-md-2-5 unit">
                                                                    <label className="input select">
                                                                        <FormControl fullWidth variant="outlined"
                                                                            margin="dense">
                                                                            <InputLabel id="TipoContratoLabel">Tipo de operación</InputLabel>
                                                                            <Select
                                                                                labelId="TipoContratoLabel"
                                                                                label="Tipo de operación"
                                                                                className="form-control"
                                                                                onChange={handleChange}
                                                                                value={state.TipoContrato}
                                                                                name="TipoContrato"
                                                                            >
                                                                                <option value=" 1) Carretero">
                                                                                    1) Carretero
                                                    </option>
                                                                                <option value="2) Cruce">
                                                                                    2) Cruce
                                                    </option>
                                                                                <option value=" 3) Cruce">
                                                                                    3) Local - Patios
                                                    </option>
                                                                                <option value="4) Eventual">
                                                                                    4) Eventual
                                                    </option>
                                                                            </Select>
                                                                        </FormControl>
                                                                    </label>
                                                                </div>
                                                                <div className="col-sm-12 col-md-2-5 unit">
                                                                    <div className="input">
                                                                        <TextField variant="outlined" margin="dense" label="Fecha de Nacimiento"
                                                                            onChange={handleChange}
                                                                            value={
                                                                                state.FechaNacimiento
                                                                            }
                                                                            InputLabelProps={{
                                                                                shrink: true,
                                                                            }}
                                                                            name="FechaNacimiento"
                                                                            class="form-control"
                                                                            type="datetime-local"
                                                                            id="date-icon"
                                                                        />
                                                                    </div>
                                                                </div>
                                                                <div className="col-sm-12 col-md-2-5 unit">

                                                                    <label className="input select">
                                                                        <FormControl fullWidth variant="outlined"
                                                                            margin="dense">
                                                                            <InputLabel id="EstadoCivilLabel">Estado Civil</InputLabel>
                                                                            <Select
                                                                                labelId="EstadoCivilLabel"
                                                                                label="Estado Civil"
                                                                                className="form-control"
                                                                                onChange={handleChange}
                                                                                value={state.EstadoCivil}
                                                                                name="EstadoCivil"
                                                                            >
                                                                                <option value="Soltero">
                                                                                    Soltero
                                                    </option>
                                                                                <option value="Casado">
                                                                                    Casado
                                                    </option>
                                                                            </Select>
                                                                        </FormControl>
                                                                    </label>
                                                                </div>
                                                                <div className="col-sm-12 col-md-2-5 unit">
                                                                    <div className="input">
                                                                        <TextField variant="outlined" margin="dense" label="Factor VSM Infonavit"
                                                                            onChange={handleChange}
                                                                            value={
                                                                                state.FactorVSMinInvonavit
                                                                            }
                                                                            name="FactorVSMinInfonavit"
                                                                            className="form-control"
                                                                            type="text"
                                                                            placeholder=""
                                                                        />
                                                                    </div>
                                                                </div>
                                                                <div className="col-sm-12 col-md-2-5 unit">
                                                                    <div className="input">
                                                                        <TextField variant="outlined" margin="dense" label="Beneficiario de Fallecimiento"
                                                                            onChange={handleChange}
                                                                            value={
                                                                                state.BeneficiarioFallecimiento
                                                                            }
                                                                            name="BeneficiarioFallecimiento"
                                                                            className="form-control"
                                                                            type="text"
                                                                            placeholder=""
                                                                            id="text"
                                                                        />
                                                                    </div>
                                                                </div>
                                                                <div className="col-sm-12 col-md-2-5 unit">
                                                                    <div className="input">
                                                                        <TextField variant="outlined" margin="dense" label="Factor % Infonavit"
                                                                            onChange={handleChange}
                                                                            value={state.FactorPorcentajeInfonavit}
                                                                            name="FactorPorcentajeInfonavit"
                                                                            className="form-control"
                                                                            type="text"
                                                                            placeholder=""
                                                                            id="text"
                                                                        />
                                                                    </div>
                                                                </div>
                                                                <div className="col-sm-12 col-md-2-5 unit">
                                                                    <div className="input">
                                                                        <TextField variant="outlined" margin="dense" label="En caso de accidente avisar a"
                                                                            onChange={handleChange}
                                                                            value={state.CasoAccidenteAvisarA}
                                                                            name="CasoAccidenteAvisarA"
                                                                            className="form-control"
                                                                            type="text"
                                                                            placeholder=""
                                                                            id="text"
                                                                        />
                                                                    </div>
                                                                </div>
                                                                <div className="col-sm-12 col-md-2-5 unit">
                                                                    <div className="input">
                                                                        <TextField variant="outlined" margin="dense" label="Retención Diaria Infonavit"
                                                                            onChange={handleChange}
                                                                            value={state.RetencionDiariaInfonavit}
                                                                            name="RetencionDiariaInfonavit"
                                                                            className="form-control"
                                                                            type="text"
                                                                            placeholder=""
                                                                            id="text"
                                                                        />
                                                                    </div>
                                                                </div>
                                                                <div className="col-sm-12 col-md-2-5 unit">
                                                                    <label className="input select">
                                                                        <FormControl fullWidth variant="outlined"
                                                                            margin="dense">
                                                                            <InputLabel id="IdPuestoLabel">Puesto</InputLabel>
                                                                            <Select
                                                                                labelId="IdPuestoLabel"
                                                                                label="Puesto"
                                                                                onChange={handleChange}
                                                                                value={state.IdPuesto}
                                                                                name="IdPuesto"
                                                                                className="form-control"
                                                                                required
                                                                                native
                                                                            >
                                                                                <option value="none">
                                                                                    Puesto
                                                    </option>

                                                                                {dataPuesto.map(
                                                                                    (puesto) => (
                                                                                        <option
                                                                                            value={
                                                                                                puesto.m_nIdPuesto
                                                                                            }
                                                                                        >
                                                                                            {
                                                                                                puesto.m_sPuesto
                                                                                            }
                                                                                        </option>
                                                                                    )
                                                                                )}
                                                                            </Select>
                                                                        </FormControl>
                                                                    </label>
                                                                </div>
                                                                <div className="col-sm-12 col-md-2-5 unit">
                                                                    <label className="label">
                                                                        Retención Diaria Fonacot
                                                </label>
                                                                    <div className="input">
                                                                        <TextField variant="outlined" margin="dense" label=""
                                                                            onChange={handleChange}
                                                                            value={state.retencionDiariaFonacot}
                                                                            name="retencionDiariaFonacot"
                                                                            className="form-control"
                                                                            type="text"
                                                                            placeholder=""
                                                                            id="text"
                                                                        />
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


                                    <div className="widget-wrap" id="incidencias">
                                        <div className="widget-header block-header margin-bottom-0 clearfix">
                                            <div className="pull-left">
                                                <h3>Incidencias</h3>
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
                                                                            <label className="input select">
                                                                                <FormControl fullWidth variant="outlined"
                                                                                    margin="dense">
                                                                                    <InputLabel id="IncidenciaLabel">Incidencia</InputLabel>
                                                                                    <Select
                                                                                        labelId="IncidenciaLabel"
                                                                                        label="Incidencia"
                                                                                        className="form-control disabled">
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
                                                                                    </Select>
                                                                                </FormControl>
                                                                            </label>
                                                                        </div>
                                                                        <div className="span3 unit">
                                                                            <div className="input">
                                                                                <div className="input">
                                                                                    <TextField variant="outlined" margin="dense" label="Fecha"
                                                                                        class="form-control"
                                                                                        type="text"
                                                                                        InputLabelProps={{
                                                                                            shrink: true,
                                                                                        }}
                                                                                        id="date-icon"
                                                                                        placeholder="12/20/2020"
                                                                                        disabled
                                                                                    />
                                                                                </div>
                                                                            </div>
                                                                        </div>
                                                                        <div className="span6 unit">
                                                                            <div className="input">
                                                                                <div className="input">
                                                                                    <TextField variant="outlined" margin="dense" label="Observaciones"
                                                                                        className="form-control"
                                                                                        type="text"
                                                                                        placeholder=""
                                                                                        id="text"
                                                                                        disabled
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


                                    <div className="widget-wrap" id="appmoviles">
                                        <div className="widget-header block-header margin-bottom-0 clearfix">
                                            <div className="pull-left">
                                                <h3>App. Móviles</h3>
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
                                                                                onChange={handleChangeAppViajes}
                                                                                value={state.AppMisViajes}
                                                                                name="AppMisViajes"
                                                                                native
                                                                                type="checkbox"
                                                                            />
                                                                            <i />
                                                  App Mis Viajes
                                                </label>
                                                                    </div>
                                                                    <div className="col-md-3 unit">
                                                                        {" "}
                                                                        <label className="label">
                                                                            Usuario
                                                </label>
                                                                        <div className="input">
                                                                            <TextField variant="outlined" margin="dense" label=""
                                                                                onChange={handleChange}
                                                                                value={state.UsuarioViajes}
                                                                                name="UsuarioViajes"
                                                                                className="form-control"
                                                                                type="text"
                                                                                placeholder=""
                                                                                id="text"
                                                                            />
                                                                        </div>
                                                                    </div>
                                                                    <div className="col-md-3 unit">
                                                                        {" "}
                                                                        <label className="label">
                                                                            Contraseña
                                                </label>
                                                                        <div className="input">
                                                                            <TextField variant="outlined" margin="dense" label=""
                                                                                onChange={handleChange}
                                                                                value={state.ContraseñaViajes}
                                                                                name="ContraseñaViajes"
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
                                                                                onChange={handleChangeAppPaqueteria}
                                                                                value={state.AppPaqueteria}
                                                                                name="AppPaqueteria"
                                                                                native
                                                                                type="checkbox"
                                                                            />
                                                                            <i />
                                                  App Paquetería
                                                </label>
                                                                    </div>
                                                                    <div className="col-md-3 unit">
                                                                        {" "}
                                                                        <label className="label">
                                                                            Usuario
                                                </label>
                                                                        <div className="input">
                                                                            <TextField variant="outlined" margin="dense" label=""
                                                                                onChange={handleChange}
                                                                                value={state.UsuarioPaqueteria}
                                                                                name="UsuarioPaqueteria"
                                                                                className="form-control"
                                                                                type="text"
                                                                                placeholder=""
                                                                                id="text"
                                                                            />
                                                                        </div>
                                                                    </div>
                                                                    <div className="col-md-3 unit">
                                                                        {" "}
                                                                        <label className="label">
                                                                            Contraseña
                                                </label>
                                                                        <div className="input">
                                                                            <TextField variant="outlined" margin="dense" label=""
                                                                                onChange={handleChange}
                                                                                value={state.ContrasenaPaqueteria}
                                                                                name="ContraseñaPaqueteria"
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


                                    <div className="widget-wrap" id="fotosDocs">
                                        <div className="widget-header block-header margin-bottom-0 clearfix">
                                            <div className="pull-left">
                                                <h3>Fotos / Documentos</h3>
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
                                                                            <TextField variant="outlined" margin="dense" label=""
                                                                                className="form-control"
                                                                                type="text"
                                                                                placeholder="Descripción"
                                                                                disabled
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
                                                                                                    disabled
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
                                    <button type="submit" className="btn btn-primary primary-btn">
                                        Aceptar
                              </button>
                                </div>


                            </form>

                        </div>
                    </div>
                </div>
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

export default Operadores;
