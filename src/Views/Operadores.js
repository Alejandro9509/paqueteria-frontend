import logo from "../logo.svg";
import "../App.css";

import React, { useEffect, useState, setData, useMemo, Component } from "react";

import axios from "axios";
import { FormControl, Input, InputLabel } from "@material-ui/core";

import DataTable from "react-data-table-component";
import Cabecera from "../Components/Template/Cabecera";
import BarraLateralIzquierda from "../Components/Template/BarraLateralIzquierda";
import { useTable, useFilters, useSortBy } from "react-table";
import ExportCSV from "../Components/Template/Export";
import ExportPDF from "../Components/Template/ExportPDF";

import $ from "jquery";
window.jQuery = window.$ = $;
const headers = {
  "Content-Type": "application/json",
};

function App(props) {
  const columns = React.useMemo(() => [
    {
      Name: "Código",
      accessor: "m_nNumeroOperador",
    },
    {
      Name: "Nombre",
      accessor: "m_sNombreCompleto",
    },
    {
      Name: "Sucursal",
      accessor: "m_sSucursal",
    },
    {
      Name: "Activo",
      accessor: "m_bActivo",
    },
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
                        onClick={() => handleShowModificar(row)}
                        className="btn btn-default btn-sm m-user-edit"
                      >
                        <i className="zmdi zmdi-edit" />
                      </a>
                      <a
                        href="#"
                        className="btn btn-default btn-sm m-user-delete"
                        onClick={() =>
                          handleEliminar(row.original.m_nIdOperador)
                        }
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

  const [data, setData] = React.useState([]);
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
    CreadoPor: 0,
    ModificadoEl: "",
    ModificadoPor: 0,
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
    height: window.innerHeight
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
      CreadoPor: 0,
      ModificadoEl: "",
      ModificadoPor: 0,
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
    if (state.idUnidad != 0) {
      const url =
        `${process.env.REACT_APP_API_URL}/Operador/Modificar/` +
        state.IdOperador;
      axios
        .put(url, Object.assign({}, params), { headers })

        .then((respuesta) => {
          alert(respuesta.data);

          getAllOperadores();
        })
        .catch((err) => {
          console.log(err);
          alert("err");
        });
    } else {
      const url = `${process.env.REACT_APP_API_URL}/Operador/Agregar`;
      axios
        .post(url, Object.assign({}, params), { headers })
        .then((respuesta) => {
          alert(respuesta.data);
          getAllOperadores();
          //window.location.reload();
        })
        .catch((err) => {
          console.log(err);
          alert(err);
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
    getAllSucursales();
    getAllPaises();
    getAllOperadores();
    getAllPuestos();
    getAllDepartamentos();
  }, []);

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

  function handleShowModificar(row) {
    console.log(row.original.m_nIdOperador);
    const url =
      `${process.env.REACT_APP_API_URL}/Operador/GetById/` +
      row.original.m_nIdOperador;
    axios.get(url, { headers }).then((respuesta) => {
      console.log(respuesta.data);
      setState({
        ...state,
        agregar: "Modificar",
        IdOperador: row.original.m_nIdOperador,
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
        CreadoPor: respuesta.data.m_nCreadoPor,
        ModificadoEl: respuesta.data.m_dtModificadoEl,
        ModificadoPor: respuesta.data.m_nModificadoPor,
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
    const url = `${process.env.REACT_APP_API_URL}/Operadores/GetListado`;
    axios.get(url, { headers }).then((respuesta) => {
      console.log(respuesta);

      setDataOperador(respuesta.data);
    });
  }

  function getAllDepartamentos() {
    const url = `${process.env.REACT_APP_API_URL}/Departamento/GetListado`;
    axios.get(url, { headers }).then((respuesta) => {
      console.log(respuesta);

      setDataDepartamento(respuesta.data);
    });
  }
  function getAllPuestos() {
    const url = `${process.env.REACT_APP_API_URL}/Puesto/GetListado`;
    axios.get(url, { headers }).then((respuesta) => {
      console.log(respuesta);

      setDataPuesto(respuesta.data);
    });
  }

  function getAllSucursales() {
    const url = `${process.env.REACT_APP_API_URL}/Sucursales/GetListado`;
    axios.get(url, { headers }).then((respuesta) => {
      setDataSucursales(respuesta.data);
    });
  }

  function getAllPaises() {
    const url = `${process.env.REACT_APP_API_URL}/Pais/GetListado`;
    axios.get(url, { headers }).then((respuesta) => {
      console.log(respuesta);

      setDataPais(respuesta.data);
    });
  }

  function handleEliminar(id) {
    const url = `${process.env.REACT_APP_API_URL}/Operador/Eliminar/` + id;
    axios
      .get(url, { headers })
      .then((respuesta) => {
        console.log(respuesta);
        getAllOperadores();
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
    const url = `${process.env.REACT_APP_API_URL}/Unidad/GetById/` + id;
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
      <aside className="iconic-leftbar" style={{ minHeight: state.height }}>
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
                    <a href="/Catalogos">
                      Catálogos <i className="zmdi zmdi-chevron-right" />
                    </a>
                  </li>
                  <li className="active-page">Operadores</li>
                </ul>
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
