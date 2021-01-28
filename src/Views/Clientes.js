import logo from "../logo.svg";
import "../App.css";

import React, { useEffect, useState, setData, useMemo, Component } from "react";

import axios from "axios";
import { FormControl, Input, InputLabel } from "@material-ui/core";

import DataTable from "react-data-table-component";
import Cabecera from "../Components/Template/Cabecera";
import BarraLateralIzquierda from "../Components/Template/BarraLateralIzquierda";
import BarraLateralDerecha from "../Components/Template/BarraLateralDerecha";
import { useTable, useFilters, useSortBy } from "react-table";
import ExportCSV from "../Components/Template/Export";
import ExportPDF from "../Components/Template/ExportPDF";
import TextField from "@material-ui/core/TextField";
import Autocomplete from "@material-ui/lab/Autocomplete";

import $ from "jquery";
import { remove_array_element } from "../Util/Util";

import { SettingsEthernet } from "@material-ui/icons";
window.jQuery = window.$ = $;
const headers = {
  "Content-Type": "application/json",
};

function App(props) {
  const columns = React.useMemo(() => [
    {
      Name: "Núm. Cliente",
      accessor: "m_nNumeroCliente",
    },
    {
      Name: "Tipo Cliente",
      accessor: "m_nTipoCliente",
    },
    {
      Name: "RFC",
      accessor: "m_sRFC",
    },
    {
      Name: "Nombre",
      accessor: "m_sNombreFiscal",
    },

    {
      Name: "Nombre Corto",
      accessor: "m_sNombreCorto",
    },
    {
      Name: "m_sNombreSucursal",
      accessor: "m_sNombreSucursal",
    },
  ]);


  const columns2 = React.useMemo(() => [
    
    {
      Name: "Formato",
      accessor: "m_sFormato",
    },
    {
      Name: "Tipo proceso",
      accessor: "m_nTipoProceso",
    },
    
  ]);

  function DefaultColumnFilter2({
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

  function TableFormatos({ columns, data }) {
    const defaultColumn = React.useMemo(
      () => ({
        // Default Filter UI
        Filter: DefaultColumnFilter2,
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
        <table className="tableFormatos" {...getTableProps()}>
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
                    <input
                                                  onChange={handleChangeFormatoSelectCheckboxChange
                                                    
                                                  }

                                                  native
                                                  name="formatoSelect"
                                                  type="checkbox"
                                                  value={state.formatoSelect}
                                                  id="formatoSelect"
                                                />
                   
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
                        onClick={() =>
                          handleShowModificar(row.original.m_nIdUnidad)
                        }
                        className="btn btn-default btn-sm m-user-edit"
                      >
                        <i className="zmdi zmdi-edit" />
                      </a>
                      <a
                        href="#"
                        className="btn btn-default btn-sm m-user-delete"
                        onClick={() => handleEliminar(row.original.m_nIdUnidad)}
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
  const [dataPais, setDataPais] = React.useState([]);
  const [dataEstado, setDataEstado] = React.useState([]);
  const [dataImpuesto, setDataImpuesto] = React.useState([]);
  const [dataGrupoClientes, setDataGrupoClientes] = React.useState([]);
  const [dataSucursales, setDataSucursales] = React.useState([]);
  const [dataFormatos, setDataFormatos] = React.useState([]);

  const [dataListadoClientes, setDataListadoClientes] = React.useState([]);
  const [state, setState] = React.useState({
    agregar: "Agregar",
    idCliente: 0,
    numeroCliente: 0,
    tipoCliente: 0,
    rfc: false,
    activo: false,
    operadorLogistico: false,
    nombreFiscal: "",
    nombreCorto: "",
    idSucursal: 0,
    idMoneda: 0,
    idImpuestoTransladado: 0,
    aplicarDetalleMaterialesCadaViajeXML: false,
    aplicarDetalleConceptoCadaViajeXML: false,
    idEstado: 0,
    idGrupoCliente: {},
    metodoPago: "",
    diasCredito: 0,
    creadoPor: 0,
    creadoEl: "",
    modificadoPor: "",
    modificadoEl: "",
    credito: 0,
    creditoDlls: 0,
    saldoCredito: 0,
    saldoCreditoDLLS: 0,
    pendFacturar: 0,
    pendFacturarDLLS: 0,
    bancoOrdenante: "",
    rfcBancoOrdenante: "",
    cuentaBancoOrdenante: "",

    codigoPostal: 0,
    idEstado: 0,
    municipio: "",
    localidad: "",
    colonia: "",
    calle: "",
    numeroExterior: "",
    numeroInterior: "",
    telefono: "",
    celular: "",
    nextel: "",
    correoElectronico: "",
    tableformatos: "",
    frecuenciaEnvioDias:0,
    enviarApartir:"",
    envioAutoSeguimientoViajes: "",
    fechaEnvioCorreo: "",
    envioAutomaticoSeguimiento: "",
    excluirNodo: 0,
    idUSOCFDI: "",
    agruparCantidadPorConcepto: "",
    ajustarImporte2Dec: "",
    detalleMateriales: "",
    formatoSelect:false
  });

  function handleShowAgregar() {
    setState({
      ...state,
     
      
    });
  }

  function handleShowModificar(id) {
    console.log(id);
    const url = `${process.env.REACT_APP_API_URL}/Unidad/GetById/` + id;
    axios.get(url, { headers }).then((respuesta) => {
      console.log(respuesta.data);
      setState({
        ...state,
        
      });
    });
  }

  useEffect((value) => {
    getAllSucursales();
    getAllPaises();
    getAllImpuestos();
    getAllGrupoClientes();
    getAllClientes();
    getAllFormatos();
  }, []);

  function getAllGrupoClientes() {
    const url = `${process.env.REACT_APP_API_URL}/GruposClientes/GetListado`;
    axios.get(url, { headers }).then((respuesta) => {
      console.log(respuesta);

      setDataGrupoClientes(respuesta.data);
    });
  }
  function getAllFormatos() {
    const url = `${process.env.REACT_APP_API_URL}/Formato/GetListado`;
    axios.get(url, { headers }).then((respuesta) => {
      console.log(respuesta);

      setDataFormatos(respuesta.data);
    });
  }


  function getAllClientes() {
    const url = `${process.env.REACT_APP_API_URL}/Clientes/GetListado`;
    axios.get(url, { headers }).then((respuesta) => {
      console.log(respuesta);

      setDataListadoClientes(respuesta.data);
    });
  }

  function getAllPaises() {
    const url = `${process.env.REACT_APP_API_URL}/Pais/GetListado`;
    axios.get(url, { headers }).then((respuesta) => {
      setDataPais(respuesta.data);
    });
  }
  const handleSelectChange = (event) => {
    console.log("onChangeSelect");
    getAllEstados(event.target.value);
  };

  function getAllEstados(id) {
    console.log(id);
    const url = `${process.env.REACT_APP_API_URL}/Estados/ByPais/` + id;
    axios.get(url, { headers }).then((respuesta) => {
      console.log(respuesta.data);
      setDataEstado(respuesta.data);
    });
    console.log(dataEstado);
  }


  function getAllImpuestos() {
  
    const url = `${process.env.REACT_APP_API_URL}/Impuestos/GetListado`;
    axios.get(url, { headers }).then((respuesta) => {
      console.log(respuesta.data);
      setDataImpuesto(respuesta.data);
    });
    console.log(dataImpuesto);
  }

  

  function getAllSucursales() {
    const url = `${process.env.REACT_APP_API_URL}/Sucursales/GetListado`;
    axios.get(url, { headers }).then((respuesta) => {
      setDataSucursales(respuesta.data);
    });
  }

  function getAllGruposClientes() {
    const url = `${process.env.REACT_APP_API_URL}/GrupoUnidad/GetListado`;
    axios.get(url, { headers }).then((respuesta) => {
    });
  }

  const handleChangeActivoCheckboxChange = (event) => {
    setState({
      ...state,
      activo: !state.activo,
    });
    console.log(event.target.name + " " + state.activo);
  };
  const handleChangeFormatoSelectCheckboxChange = (event) => {
    setState({
      ...state,
      formatoSelect: !state.formatoSelect,
    });
    console.log(event.target.name + " " + state.activo);
  };

  const handleChangeParoMotor = (event) => {
    console.log(event.target.name + " " + state.paroMotor);
    setState({
      ...state,
      paroMotor: !state.paroMotor,

      tiempoParoStatus: !state.tiempoParoStatus,
      tiempoParoStatus: 0,
    });
  };

  const handleChangeRentadaCheckboxChange = (event) => {
    console.log(event.target.name + " " + state.rentada);
    setState({
      ...state,
      rentada: !state.rentada,
    });
  };

  const handleChangePermisionarioCheckboxChange = (event) => {
    console.log(event.target.name + " " + state.esUnidadPermisionario);
    setState({
      ...state,
      esUnidadPermisionario: !state.esUnidadPermisionario,
    });
  };

  function handleEliminar(id) {
    const url = `${process.env.REACT_APP_API_URL}/Unidad/Eliminar/` + id;
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

  const handleChangeCodigo = (event) => {
    const url =
      `${process.env.REACT_APP_API_URL}/Unidades/ValidaCodigoUnidad/` +
      state.codigo;
    axios
      .get(url, { headers })
      .then((respuesta) => {
        if (respuesta.data != "") {
          alert(respuesta.data.m_sMensaje);
          console.log(respuesta.data);
          setState({
            ...state,

            codigo: respuesta.data.m_nNumero,
          });
        }
      })

      .catch((err) => {
        alert(err);
      });
  };

  const handleChangeDocumento = (event, index) => {
    var { documentos } = state;
    documentos[index][event.target.name] = event.target.value;

    setState({
      ...state,
      documentos: documentos,
    });
  };

  const handleChangeFotosDocs = (event, index) => {
    var { fotosDocs } = state;
    fotosDocs[index][event.target.name] = event.target.value;
    setState({
      ...state,
      fotosDocs: fotosDocs,
    });
  };

  const handleAceptar = (e) => {
    e.preventDefault();
    var params = {
      
    };

    console.log(params);
    if (state.idUnidad != 0) {
      const url =
        `${process.env.REACT_APP_API_URL}/Unidad/Modificar/` + state.idUnidad;
      axios
        .put(url, Object.assign({}, params), { headers })

        .then((respuesta) => {
          alert(respuesta.data);

          window.location.reload();
        })
        .catch((err) => {
          console.log(err);
          alert("err");
        });
    } else {
      const url = `${process.env.REACT_APP_API_URL}/Unidad/Agregar`;
      axios
        .post(url, Object.assign({}, params), { headers })
        .then((respuesta) => {
          alert(respuesta.data);
          //window.location.reload();
        })
        .catch((err) => {
          console.log(err);
          alert(err);
        });
    }
  };

  function addDocumento() {
    const { documentos } = state;
    documentos.push({
      numDocumento: "",
      documento: "",
      fechaDocumento: "",
    });
    console.log(documentos);
    setState({ ...state, documentos: documentos });
  }
  function addFotosDoc() {
    const { fotosDocs } = state;
    fotosDocs.push({
      descripcion: "",
      file: "",
    });
    console.log(fotosDocs);
    setState({ ...state, fotosDocs: fotosDocs });
  }

  function removeDocumento(index) {
    var { documentos } = state;
    documentos = remove_array_element(documentos, index);
    console.log(documentos);
    setState({ ...state, documentos: documentos });
  }
  function removeFotosDoc(index) {
    var { fotosDocs } = state;
    fotosDocs = remove_array_element(fotosDocs, index);
    console.log(fotosDocs);
    setState({ ...state, fotosDocs: fotosDocs });
  }

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
        $section = $("#caracteristicas");

        break;
      case 3:
        setStepActive(3);
        $section = $("#caracteristicas");

        break;

      case 4:
        setStepActive(4);
        $section = $("#detalles");
        break;
      case 5:
        setStepActive(5);
        $section = $("#otros");
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
    //closeSeccions();
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
                <h2>Clientes</h2>
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
              <ExportCSV csvData={data} fileName="Unidades_Listado" />
            </li>
            <li>
              <ExportPDF data={data} column={columns} fileName="Unidades" />
            </li>
          </ul>

          <div className="tab-content">
            <div id="Listado" className="tab-pane fade in active">
              <div className="widget-wrap">
                <div className="widget-content">
                  <div className="row">
                    <Table columns={columns} data={dataListadoClientes} />
                  </div>
                </div>
              </div>
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
                        <form
                          className="j-forms j-multistep"
                          onSubmit={handleAceptar}
                        >
                          {/*Inicio de ejemplo*/}

                          {/* start steps */}
                          <div
                            className="wizard-breadcrumb number-style"
                            style={{
                              position: "sticky",
                              top: "150px",
                              padding: "5px",
                              backgroundColor: "white",
                              zIndex: 100,
                            }}
                          >
                            <div className="row">
                              <div
                                className={
                                  "col-md-2-5 col-sm-3 step " +
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
                                  "col-md-2-5 col-sm-3 step " +
                                  (stepActive == 2 && "active-step")
                                }
                                onClick={() => openSection(2)}
                              >
                                <div className="steps">
                                  <span className="step-number">2</span>
                                  <p>Metodos de Pago y Crédito</p>
                                </div>
                              </div>
                              <div
                                className={
                                  "col-md-2-5 col-sm-3 step " +
                                  (stepActive == 3 && "active-step")
                                }
                                onClick={() => openSection(3)}
                              >
                                <div className="steps">
                                  <span className="step-number">3</span>
                                  <p>Información Adicional del pago</p>
                                </div>
                              </div>

                              <div
                                className={
                                  "col-md-2-5 col-sm-2 step " +
                                  (stepActive == 4 && "active-step")
                                }
                                onClick={() => openSection(4)}
                              >
                                <div className="steps">
                                  <span className="step-number">4</span>
                                  <p>Datos Generales</p>
                                </div>
                              </div>
                              <div
                                className={
                                  "col-md-2-5 col-sm-2 step " +
                                  (stepActive == 5 && "active-step")
                                }
                                onClick={() => openSection(5)}
                              >
                                <div className="steps">
                                  <span className="step-number">5</span>
                                  <p>Contacto</p>
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
                                        <div className="form-content">
                                          {/* start text password */}
                                            <div className="col-sm-4 col-md-2-5 unit">
                                              <label className="label">
                                                Número de Cliente
                                              </label>
                                              <div className="input">
                                                <input
                                                  onChange={handleChange}
                                                  onBlur={handleChangeCodigo}
                                                  className="form-control"
                                                  type="text"
                                                  value={state.numeroCliente}
                                                  id="numeroCliente"
                                                  name="numeroCliente"
                                                  required
                                                />
                                              </div>
                                            </div>
                                            <div className="col-sm-4 col-md-2-5  unit">
                                              <label className="label">
                                                RFC
                                              </label>
                                              <div className="input">
                                                <input
                                                  onChange={handleChange}
                                                  className="form-control"
                                                  type="text"
                                                  value={state.rfc}
                                                  id="rfc"
                                                  name="rfc"
                                                  required
                                                  native
                                                />
                                              </div>
                                            </div>
                                            <div className="col-sm-4 col-md-2-5 unit">
                                              <label className="label">
                                                Nombre Fiscal
                                              </label>
                                              <div className="input">
                                                <input
                                                  onChange={handleChange}
                                                  className="form-control"
                                                  type="text"
                                                  value={state.nombreFiscal}
                                                  id="nombreFiscal"
                                                  name="nombreFiscal"
                                                  required
                                                  native
                                                />
                                              </div>
                                            </div>

                                            <div className="col-sm-4 col-md-2-5 unit">
                                              <label className="label">
                                                Nombre Corto
                                              </label>
                                              <div className="input">
                                                <input
                                                  onChange={handleChange}
                                                  className="form-control"
                                                  type="text"
                                                  value={state.nombreCorto}
                                                  id="nombreCorto"
                                                  name="nombreCorto"
                                                  required
                                                  native
                                                />
                                              </div>
                                            </div>
                                            <div className="col-sm-4 col-md-2-5 unit">
                                              <label className="label">
                                                Tipo de Cliente
                                              </label>
                                              <label className="input select">
                                                <select
                                                  onChange={handleChange}
                                                  className="form-control"
                                                  value={state.tipoCliente}
                                                  required
                                                  native
                                                  name="tipoCliente"
                                                  id="tipoCliente"
                                                >
                                                  <option value="">
                                                    Tipo de Cliente
                                                  </option>
                                                  <option value="1">
                                                    Nacional
                                                  </option>
                                                  <option value="2">
                                                    Extranjero
                                                  </option>
                                                </select>
                                                <i></i>
                                              </label>
                                            </div>

                                            <div className="col-sm-4 col-md-2-5 unit">
                                              <label className="label">
                                                &nbsp;{" "}
                                              </label>
                                              <label className="input select">
                                                <select
                                                  onChange={handleChange}
                                                  value={state.idSucursal}
                                                  id="idSucursal"
                                                  native
                                                  className="form-control"
                                                  name="idSucursal"
                                                  required
                                                >
                                                  <option value="">
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
                                                </select>
                                                <i></i>
                                              </label>
                                            </div>
                                            <div className="col-sm-4 col-md-2-5  unit">
                                              <label className="label">
                                                &nbsp;{" "}
                                              </label>
                                              <label className="input select">
                                                <select
                                                  onChange={handleChange}
                                                  value={state.idMoneda}
                                                  id="idMoneda"
                                                  native
                                                  className="form-control"
                                                  name="idMoneda"
                                                  required
                                                >
                                                  <option value="">
                                                    Moneda
                                                  </option>
                                                  <option value="1">
                                                    Pesos
                                                  </option>
                                                  <option value="2">
                                                    Dolares
                                                  </option>
                                                </select>
                                                <i></i>
                                              </label>
                                            </div>
                                            <div className="col-sm-4 col-md-2-5 unit">
                                              <label className="label">
                                                &nbsp;{" "}
                                              </label>
                                              <label className="input select">
                                                <select
                                                  onChange={handleChange}
                                                  value={state.idImpuestoTransladado}
                                                  id="idImpuestoTransladado"
                                                  native
                                                  className="form-control"
                                                  name="idImpuestoTransladado"
                                                  required
                                                >
                                                  <option value="">IVA</option>
                                                 
                                                                {dataImpuesto.map(
                                                                  (impuesto) => (
                                                                    <option
                                                                      value={
                                                                        impuesto.m_nIdImpuesto
                                                                      }
                                                                    >
                                                                      {
                                                                        impuesto.m_sImpuesto
                                                                      }
                                                                    </option>
                                                                  )
                                                                )}
                                                </select>
                                                <i></i>
                                              </label>
                                            </div>

                                            <div className="col-sm-4 col-md-2-5 unit">
                                                <label className="label">
                                                  Grupo
                                                </label>
                                                <Autocomplete
                                    freeSolo
                                    onChange={(event, newValue) =>
                                      setState({
                                        ...state,
                                        idGrupoCliente: newValue,
                                      })
                                    }
                                    value={state.idGrupoCliente}
                                    id="idGrupoCliente"
                                    disableClearable
                                    getOptionLabel={(option) =>
                                      option.m_sGrupo
                                    }
                                    options={dataGrupoClientes}
                                    renderInput={(params) => (
                                      <TextField
                                        {...params}
                                        InputProps={{
                                          ...params.InputProps,
                                          type: "search",
                                          value: state.idGrupoCliente,
                                        }}
                                      />
                                    )}
                                  />{" "}
                                            </div>

                                          <div className="unit">
                                            <div className="inline-group">
                                              <label className="checkbox">
                                                <input
                                                  onChange={
                                                    handleChangeActivoCheckboxChange
                                                  }
                                                  native
                                                  name="activo"
                                                  type="checkbox"
                                                  value={state.activo}
                                                  id="activo"
                                                />
                                                <i />
                                                Activa
                                              </label>
                                              <label className="checkbox">
                                                <input
                                                  onChange={
                                                    handleChangeRentadaCheckboxChange
                                                  }
                                                  native
                                                  name="operadorLogistico"
                                                  type="checkbox"
                                                  id="operadorLogistico"
                                                  value={state.operadorLogistico}
                                                />
                                                <i />
                                                Operador Lógistico
                                              </label>

                                              <label className="label">
                                                {}
                                              </label>
                                              <label className="checkbox">
                                                <input
                                                  onChange={
                                                    handleChangeActivoCheckboxChange
                                                  }
                                                  native
                                                  name="aplicarDetalleMaterialesCadaViajeXML"
                                                  type="checkbox"
                                                  value={state.aplicarDetalleMaterialesCadaViajeXML}
                                                  id="aplicarDetalleMaterialesCadaViajeXML"
                                                />
                                                <i />
                                                Aplicar en el XML de factura, el
                                                detalle por Viaje
                                              </label>
                                            </div>
                                          </div>
                                        </div>
                                        {/* end textarea */}
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
                                    <h3>Información Monetaria</h3>
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
                                      <div className="col-sm-12 col-md-8">
                                        <div className="w-section-header">
                                          <h4>Metodos de Pago y Crédito</h4>
                                        </div>
                                        <div className="form-content">
                                          {/* start text password */}
                                          <div className="row">
                                            <div className="col-sm-6 col-md-4 unit">
                                              <label className="label">
                                                Forma de pago
                                              </label>
                                              <label className="input select">
                                                <select
                                                  onChange={handleChange}
                                                  value={state.metodoPago}
                                                  id="metodoPago"
                                                  native
                                                  className="form-control"
                                                  name="metodoPago"
                                                  required
                                                >
                                                  <option value="1">
                                                    Transferencia Eléctronica
                                                  </option>
                                                  <option value="2">
                                                    Efectivo
                                                  </option>
                                                </select>
                                                <i></i>
                                              </label>
                                            </div>
                                            <div className="col-sm-6 col-md-4 unit">
                                              <label className="label">
                                                Dias de Crédito
                                              </label>
                                              <div className="input">
                                                <input
                                                  onChange={handleChange}
                                                  className="form-control"
                                                  type="number"
                                                  value={state.diasCredito}
                                                  id="diasCredito"
                                                  name="diasCredito"
                                                  native
                                                />
                                              </div>
                                            </div>
                                          </div>

                                          <div className="row">
                                            <div className="w-section-header">
                                              <h3>Pesos</h3>
                                            </div>
                                            <div className="col-sm-4  col-md-4 unit">
                                              <label className="label">
                                                Limite Credito
                                              </label>
                                              <div className="input">
                                                <input
                                                  onChange={handleChange}
                                                  className="form-control"
                                                  type="number"
                                                  value={state.credito}
                                                  id="credito"
                                                  name="credito"
                                                />
                                              </div>
                                            </div>
                                            <div className="col-sm-4  col-md-4 unit">
                                              <label className="label">
                                                Saldo facturado por cobrar
                                              </label>
                                              <div className="input">
                                                <input
                                                  onChange={handleChange}
                                                  className="form-control"
                                                  type="number"
                                                  value={state.saldoCredito}
                                                  id="saldoCredito"
                                                  name="saldoCredito"
                                                />
                                              </div>
                                            </div>
                                            <div className="col-sm-4  col-md-4 unit">
                                              <label className="label">
                                                Viajes pendientes por facturar
                                              </label>
                                              <div className="input">
                                                <input
                                                  onChange={handleChange}
                                                  className="form-control"
                                                  type="number"
                                                  value={state.pendFacturar}
                                                  id="pendFacturar"
                                                  name="pendFacturar"
                                                />
                                              </div>
                                            </div>
                                          </div>
                                          <div className="row">
                                            <div className="w-section-header">
                                              <h5>Dolares</h5>
                                            </div>
                                            <div className="col-sm-4  col-md-4 unit">
                                              <label className="label">
                                                Limite Credito
                                              </label>
                                              <div className="input">
                                                <input
                                                  onChange={handleChange}
                                                  className="form-control"
                                                  type="number"
                                                  value={state.creditoDlls}
                                                  id="creditoDlls"
                                                  name="creditoDlls"
                                                />
                                              </div>
                                            </div>
                                            <div className="col-sm-4  col-md-4 unit">
                                              <label className="label">
                                                Saldo facturado por cobrar
                                              </label>
                                              <div className="input">
                                                <input
                                                  onChange={handleChange}
                                                  className="form-control"
                                                  type="number"
                                                  value={state.saldoCreditoDLLS}
                                                  id="saldoCreditoDLLS"
                                                  name="saldoCreditoDLLS"
                                                />
                                              </div>
                                            </div>
                                            <div className="col-sm-4  col-md-4 unit">
                                              <label className="label">
                                                Viajes pendientes por facturar
                                              </label>
                                              <div className="input">
                                                <input
                                                  onChange={handleChange}
                                                  className="form-control"
                                                  type="number"
                                                  value={state.pendFacturarDLLS}
                                                  id="pendFacturarDLLS"
                                                  name="pendFacturarDLLS"
                                                />
                                              </div>
                                            </div>
                                          </div>
                                        </div>
                                      </div>

                                      <div className="col-sm-12 col-md-3 bordesizquierdo">
                                        <div className="w-section-header">
                                          <h4>
                                            Información Adicional del Pago
                                          </h4>
                                        </div>
                                        <div className="form-content">
                                          {/* start text password */}
                                          <div className="row">
                                            <div className="col-xs-6 col-ms-6 col-md-10 unit">
                                              <label className="label">
                                                Banco Ordenante
                                              </label>
                                              <div className="input">
                                                <input
                                                  onChange={handleChange}
                                                  className="form-control"
                                                  type="text"
                                                  value={state.bancoOrdenante}
                                                  id="bancoOrdenante"
                                                  name="bancoOrdenante"
                                                />
                                              </div>
                                            </div>
                                          </div>

                                          <div className="row">
                                            <div className="col-xs-6 col-ms-6 col-md-10 unit">
                                              <label className="label">
                                                RFC
                                              </label>
                                              <div className="input">
                                                <input
                                                  onChange={handleChange}
                                                  className="form-control"
                                                  type="text"
                                                  value={state.rfcBancoOrdenante}
                                                  id="rfcBancoOrdenante"
                                                  name="rfcBancoOrdenante"
                                                />
                                              </div>
                                            </div>
                                          </div>
                                          <div className="row">
                                            <div className="col-xs-6 col-ms-6 col-md-10 unit">
                                              <label className="label">
                                                Núm. Cuenta
                                              </label>
                                              <div className="input">
                                                <input
                                                  onChange={handleChange}
                                                  className="form-control"
                                                  type="text"
                                                  value={state.cuentaBancoOrdenante}
                                                  id="cuentaBancoOrdenante"
                                                  name="cuentaBancoOrdenante"
                                                />
                                              </div>
                                            </div>
                                          </div>
                                        </div>
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
                                    <h3>Datos generales</h3>
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
                                            <a
                                              data-toggle="tab"
                                              href="#Domicilio"
                                            >
                                              Domicilio
                                            </a>
                                          </li>
                                          <li>
                                            <a
                                              data-toggle="tab"
                                              href="#Formatos"
                                            >
                                              Formatos
                                            </a>
                                          </li>
                                          <li>
                                            <a
                                              data-toggle="tab"
                                              href="#Especiales"
                                            >
                                              Procesos Especiales
                                            </a>
                                          </li>
                                          <li>
                                            <a
                                              data-toggle="tab"
                                              href="#Adicional"
                                            >
                                              Inf. Adicional
                                            </a>
                                          </li>
                                        
                                        </ul>

                                        <div className="form-content">
                                          {/* start text password */}
                                          <div className="widget-wrap">
                                            <div className="widget-container margin-top-0">
                                              <div className="widget-content">
                                                <div className="tab-content">
                                                  <div
                                                    id="Domicilio"
                                                    className="tab-pane fade in active"
                                                  >
                                                    <div className="row">
                                                      <div className="col-md-12 unit">
                                                        <div className="row">
                                                          <div className="col-sm-6 col-md-2-5 unit">
                                                            <label className="label">
                                                            &nbsp;{" "}

                                                            </label>
                                                            <label className="input select">
                                                              <select
                                                                onChange={
                                                                  handleSelectChange
                                                                }
                                                                className="form-control"
                                                                native
                                                                value={
                                                                  state.idPais
                                                                }
                                                                id="idPais"
                                                                name="idPais"
                                                              >
                                                                <option value="">
                                                                  Pais
                                                                </option>
                                                                {dataPais.map(
                                                                  (pais) => (
                                                                    <option
                                                                      value={
                                                                        pais.m_nIdPais
                                                                      }
                                                                    >
                                                                      {
                                                                        pais.m_sPais
                                                                      }
                                                                    </option>
                                                                  )
                                                                )}
                                                              </select>
                                                              <i></i>
                                                            </label>
                                                          </div>
                                                          <div className="col-sm-6 col-md-2-5 ">
                                                            <label className="label">
                                                              Código Postal
                                                            </label>
                                                            <div className="input">
                                                              <input
                                                                onChange={
                                                                  handleChange
                                                                }
                                                                className="form-control"
                                                                type="text"
                                                                placeholder=""
                                                                value={
                                                                  state.codigoPostal
                                                                }
                                                                id="codigoPostal"
                                                                name="codigoPostal"
                                                              />
                                                            </div>
                                                          </div>

                                                          <div className="col-sm-6 col-md-2-5 ">
                                                            <label className="label">
                                                            &nbsp;{" "}

                                                            </label>
                                                            <label className="input select">
                                                              <select
                                                                onChange={
                                                                  handleChange
                                                                }
                                                                className="form-control"
                                                                required
                                                                native
                                                                name="idEstado"
                                                                value={
                                                                  state.idEstado
                                                                }
                                                                id="idEstado"
                                                              >
                                                                <option value="">
                                                                  Estado
                                                                </option>

                                                                {dataEstado.map(
                                                                  (estado) => (
                                                                    <option
                                                                      value={
                                                                        estado.m_nIdEstado
                                                                      }
                                                                    >
                                                                      {
                                                                        estado.m_sEstado
                                                                      }
                                                                    </option>
                                                                  )
                                                                )}
                                                              </select>
                                                              <i></i>
                                                            </label>
                                                          </div>
                                                          <div className="col-sm-6 col-md-2-5 ">
                                                            <label className="label">
                                                              Municipio
                                                            </label>
                                                            <div className="input">
                                                              <div className="input">
                                                                <input
                                                                  onChange={
                                                                    handleChange
                                                                  }
                                                                  className="form-control"
                                                                  type="text"
                                                                  placeholder=""
                                                                  value={
                                                                    state.municipio
                                                                  }
                                                                  id="municipio"
                                                                  name="municipio"
                                                                />
                                                              </div>
                                                            </div>
                                                          </div>
                                                          <div className="col-sm-6 col-md-2-5 ">
                                                            <label className="label">
                                                              Localidad
                                                            </label>
                                                            <div className="input">
                                                              <div className="input">
                                                                <input
                                                                  onChange={
                                                                    handleChange
                                                                  }
                                                                  className="form-control"
                                                                  type="text"
                                                                  placeholder=""
                                                                  value={
                                                                    state.localidad
                                                                  }
                                                                  id="localidad"
                                                                  name="localidad"
                                                                />
                                                              </div>
                                                            </div>
                                                          </div>
                                                        </div>
                                                        <div className="row">
                                                          <div className="col-sm-6 col-md-2-5 unit">
                                                          <label className="label">
                                                            Colonia
                                                          </label>
                                                          <div className="input">
                                                            <input
                                                              onChange={
                                                                handleChange
                                                              }
                                                              className="form-control"
                                                              type="text"
                                                              placeholder=""
                                                              value={
                                                                state.colonia
                                                              }
                                                              id="colonia"
                                                              name="colonia"
                                                            />
                                                          </div>
                                                          </div>
                                                          <div className="col-sm-6 col-md-2-5 ">
                                                          <label className="label">
                                                            Calle
                                                          </label>
                                                          <div className="input">
                                                            <input
                                                              onChange={
                                                                handleChange
                                                              }
                                                              className="form-control"
                                                              type="text"
                                                              placeholder=""
                                                              value={
                                                                state.calle
                                                              }
                                                              id="calle"
                                                              name="calle"
                                                            />
                                                          </div>
                                                          </div>

                                                          <div className="col-sm-6 col-md-2-5 ">
                                                          <label className="label">
                                                              Núm. Exterior
                                                            </label>
                                                            <div className="input">
                                                              <div className="input">
                                                                <input
                                                                  onChange={
                                                                    handleChange
                                                                  }
                                                                  className="form-control"
                                                                  type="text"
                                                                  placeholder=""
                                                                  value={
                                                                    state.numeroExterior
                                                                  }
                                                                  id="numeroExterior"
                                                                  name="numeroExterior"
                                                                />
                                                              </div>
                                                            </div>
                                                          </div>
                                                          <div className="col-sm-6 col-md-2-5 ">
                                                            <label className="label">
                                                              Número Interior
                                                            </label>
                                                            <div className="input">
                                                              <div className="input">
                                                                <input
                                                                  onChange={
                                                                    handleChange
                                                                  }
                                                                  className="form-control"
                                                                  type="text"
                                                                  placeholder=""
                                                                  value={
                                                                    state.numeroInterior
                                                                  }
                                                                  id="numeroInterior"
                                                                  name="numeroInterior"
                                                                />
                                                              </div>
                                                            </div>
                                                          </div>
                                                          <div className="col-sm-6 col-md-2-5 ">
                                                            <label className="label">
                                                              Teléfonos
                                                            </label>
                                                            <div className="input">
                                                              <div className="input">
                                                                <input
                                                                  onChange={
                                                                    handleChange
                                                                  }
                                                                  className="form-control"
                                                                  type="text"
                                                                  placeholder=""
                                                                  value={
                                                                    state.telefono
                                                                  }
                                                                  id="permisoSCT"
                                                                  name="permisoSCT"
                                                                />
                                                              </div>
                                                            </div>
                                                          </div>
                                                        </div>

                            
                                                        
                                                        <div className="row">
                                                          <div className="col-sm-6  col-md-2-5 unit">
                                                            <label className="label">
                                                              Celular
                                                            </label>
                                                            <div className="input">
                                                              <div className="input">
                                                                <input
                                                                  onChange={
                                                                    handleChange
                                                                  }
                                                                  className="form-control"
                                                                  type="text"
                                                                  placeholder=""
                                                                  value={
                                                                    state.celular
                                                                  }
                                                                  id="celular"
                                                                  name="celular"
                                                                />
                                                              </div>
                                                            </div>
                                                          </div>
                                                          <div className="col-sm-6 col-md-2-5 unit">
                                                            <label className="label">
                                                              Nextel
                                                            </label>
                                                            <div className="input">
                                                              <div className="input">
                                                                <input
                                                                  onChange={
                                                                    handleChange
                                                                  }
                                                                  className="form-control"
                                                                  type="text"
                                                                  placeholder=""
                                                                  value={
                                                                    state.nextel
                                                                  }
                                                                  id="nextel"
                                                                  name="nextel"
                                                                />
                                                              </div>
                                                            </div>
                                                          </div>
                                                          <div className="col-sm-6 col-md-2-5 unit">

                                                          <label className="label">
                                                              Correo
                                                            </label>
                                                            <div className="input">
                                                              <div className="input">
                                                                <input
                                                                  onChange={
                                                                    handleChange
                                                                  }
                                                                  className="form-control"
                                                                  type="text"
                                                                  placeholder=""
                                                                  value={
                                                                    state.correoElectronico
                                                                  }
                                                                  id="correoElectronico"
                                                                  name="correoElectronico"
                                                                />
                                                              </div>
                                                            </div>
                                                            </div>
                                                        </div>
                                                       
                                                      </div>
                                                    </div>
                                                  </div>
                                                  <div
                                                    id="Formatos"
                                                    className="tab-pane fade"
                                                  >
                                                   <div className="widget-wrap">
                <div className="widget-content">
                  <div className="row">
                    <TableFormatos columns={columns2} data={dataFormatos} />
                  </div>
                </div>
              </div>
                                                  </div>
                                                  <div
                                                    id="Especiales"
                                                    className="tab-pane fade "
                                                  >
                                                    <div className="row">
                                                      <div className="col-md-12 unit">
                                                        <div className="w-section-header">
                                                          <h3>
                                                            Envio de Estados de
                                                            Cuentas
                                                          </h3>
                                                        </div>
                                                        <div className="row">
                                                          <div className="col-md-2-5">
                                                            <label className="label">
                                                              Frecuencia de
                                                              Envio (Dias)
                                                            </label>
                                                            <div className="input">
                                                              <div className="input">
                                                                <input
                                                                  onChange={
                                                                    handleChange
                                                                  }
                                                                  className="form-control"
                                                                  type="text"
                                                                  placeholder=""
                                                                  value={
                                                                    state.frecuenciaEnvioDias
                                                                  }
                                                                  id="frecuenciaEnvioDias"
                                                                  name="frecuenciaEnvioDias"
                                                                />
                                                              </div>
                                                            </div>
                                                          </div>
                                                        
                                                        </div>
<div className="row">
                                                        <div className="col-md-2-5">
                                                            <label className="label">
                                                              Enviar a partir de
                                                            </label>
                                                            <div className="input">
                                                              <div className="input">
                                                                <input
                                                                  onChange={
                                                                    handleChange
                                                                  }
                                                                  className="form-control"
                                                                  type="datetime-local"
                                                                  placeholder=""
                                                                  value={
                                                                    state.enviarApartir
                                                                  }
                                                                  id="enviarApartir"
                                                                  name="enviarApartir"
                                                                />
                                                              </div>
                                                            </div>
                                                          </div>
                                                          </div>
                                                       
                                                        
                                                      </div>
                                                      <div className="unit">
                                                          <div className="inline-group">
                                                            <label className="label">
                                                              &nbsp;{" "}
                                                            </label>
                                                            <label className="checkbox">
                                                              <input
                                                                onChange={
                                                                  handleChangeActivoCheckboxChange
                                                                }
                                                                native
                                                                name="envioAutoSeguimientoViajes"
                                                                type="checkbox"
                                                                value={
                                                                  state.envioAutomaticoSeguimiento
                                                                }
                                                                id="envioAutoSeguimientoViajes"
                                                              />
                                                              <i />
                                                              Envio Automático
                                                              de Seguimiento de
                                                              Viajes
                                                            </label>
                                                          
                                                          </div>

                                                        </div>
                                                        <div className="unit">
                                                          <div className="inline-group">
                                                         
                                                            <label className="checkbox">
                                                              <input
                                                                onChange={
                                                                  handleChangeRentadaCheckboxChange
                                                                }
                                                                native
                                                                name="excluirNodo"
                                                                type="checkbox"
                                                                id="excluirNodo"
                                                                value={
                                                                  state.excluirNodo
                                                                }
                                                              />
                                                              <i />
                                                              Excluir Nodo
                                                              Condiciones de
                                                              Pago en el XML
                                                            </label>
                                                          </div>

                                                        </div>
                                                    </div>
                                                  </div>
                                                
                                                  <div
                                                    id="Adicional"
                                                    className="tab-pane fade "
                                                  >
                                                    <div className="row">
                                                      <div className="col-md-12 unit">
                                                        <div className="unit ">
                                                          <label className="label">
                                                            Uso de CFDI
                                                          </label>
                                                          <label className="input select">
                                                            <select
                                                              onChange={
                                                                handleChange
                                                              }
                                                              className="form-control"
                                                              required
                                                              native
                                                              name="idUSOCFDI"
                                                              value={
                                                                state.idUSOCFDI
                                                              }
                                                              id="idUSOCFDI"
                                                            >
                                                              <option value="">
                                                                ""
                                                              </option>
                                                            </select>
                                                            <i></i>
                                                          </label>
                                                        </div>

                                                        <div className="unit">
                                                          <div className="inline-group">
                                                            <label className="label">
                                                              {}
                                                            </label>
                                                            <label className="checkbox">
                                                              <input
                                                                onChange={
                                                                  handleChangeActivoCheckboxChange
                                                                }
                                                                native
                                                                name="agruparCantidadPorConcepto"
                                                                type="checkbox"
                                                                value={
                                                                  state.agruparCantidadPorConcepto
                                                                }
                                                                id="agruparCantidadPorConcepto"
                                                              />
                                                              <i />
                                                              Permitir agrupar
                                                              la cantidad de
                                                              conceptos al
                                                              facturar
                                                            </label>
                                                          </div>
                                                        </div>

                                                        <div className="unit">
                                                          <div className="inline-group">
                                                            <label className="label">
                                                              {}
                                                            </label>
                                                            <label className="checkbox">
                                                              <input
                                                                onChange={
                                                                  handleChangeActivoCheckboxChange
                                                                }
                                                                native
                                                                name="ajustarImporte2Dec"
                                                                type="checkbox"
                                                                value={
                                                                  state.ajustarImporte2Dec
                                                                }
                                                                id="ajustarImporte2Dec"
                                                              />
                                                              <i />
                                                              Ajusta a 2
                                                              Decimales los
                                                              importes de los
                                                              conceptos en
                                                              Facturacion por
                                                              viaje
                                                            </label>
                                                          </div>
                                                        </div>

                                                        <div className="unit">
                                                          <div className="inline-group">
                                                            <label className="label">
                                                              {}
                                                            </label>
                                                            <label className="checkbox">
                                                              <input
                                                                onChange={
                                                                  handleChangeActivoCheckboxChange
                                                                }
                                                                native
                                                                name="aplicarDetalleConceptoCadaViajeXML"
                                                                type="checkbox"
                                                                value={
                                                                  state.aplicarDetalleConceptoCadaViajeXML
                                                                }
                                                                id="aplicarDetalleConceptoCadaViajeXML"
                                                              />
                                                              <i />
                                                              Aplicar en el XML
                                                              de la factura, el
                                                              Detalle por
                                                              Concepto de Cada
                                                              Viaje/CartaPorte
                                                            </label>
                                                          </div>
                                                        </div>
                                                      </div>
                                                    </div>
                                                  </div>
                                                </div>
                                              </div>
                                            </div>
                                          </div>
                                          {/* end textarea */}
                                        </div>
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
                                    <h3> Contacto</h3>
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
                                        <div className="form-content">
                                          {/* start text password */}
                                          <div className="row">
                                            <div className="col-sm-6 col-md-6 col-lg-4 unit">
                                              <label className="label">
                                                Contacto
                                              </label>
                                              <div className="input">
                                                <input
                                                  onChange={handleChange}
                                                  value={state.tarjetaIAVE}
                                                  name="tarjetaIAVE"
                                                  className="form-control"
                                                  type="text"
                                                  placeholder=""
                                                  id="text"
                                                />
                                              </div>
                                            </div>
                                            <div className="col-sm-6  col-md-6 col-lg-2  unit">
                                              <div className="inline-group">
                                                <label className="label">
                                                  &nbsp;{" "}
                                                </label>
                                                <label className="checkbox">
                                                  <input
                                                    onChange={
                                                      handleChangeActivoCheckboxChange
                                                    }
                                                    native
                                                    name="activo"
                                                    type="checkbox"
                                                    value={state.factura}
                                                    id="activo"
                                                  />
                                                  <i />
                                                  Recibir factura
                                                </label>
                                              </div>
                                            </div>
                                          </div>
                                          <div className="row">
                                            <div className="col-sm-6 col-md-6 col-lg-4 unit">
                                              <label className="label">
                                                Correo
                                              </label>
                                              <div className="input">
                                                <input
                                                  onChange={handleChange}
                                                  value={state.tarjetaEPASS}
                                                  name="tarjetaEPASS"
                                                  className="form-control"
                                                  type="text"
                                                  placeholder=""
                                                  id="text"
                                                />
                                              </div>
                                            </div>
                                            <div className="col-sm-6  col-md-6 col-lg-4  unit">
                                              <div className="inline-group">
                                                <label className="checkbox">
                                                  <input
                                                    onChange={
                                                      handleChangeRentadaCheckboxChange
                                                    }
                                                    native
                                                    name="rentada"
                                                    type="checkbox"
                                                    id="rentada"
                                                    value={state.rentada}
                                                  />
                                                  <i />
                                                  Recibir Edo de cuenta
                                                </label>
                                              </div>
                                            </div>
                                          </div>
                                          <div className="row">
                                            <div className="col-sm-6 col-md-6 col-lg-4 unit">
                                              <label className="label">
                                                Teléfono
                                              </label>
                                              <div className="input">
                                                <input
                                                  onChange={handleChange}
                                                  value={state.tarjetaEPASS}
                                                  name="tarjetaEPASS"
                                                  className="form-control"
                                                  type="text"
                                                  placeholder=""
                                                  id="text"
                                                />
                                              </div>
                                            </div>
                                            <div className="col-sm-6  col-md-6 col-lg-4  unit">
                                              <div className="inline-group">
                                                <label className="checkbox">
                                                  <input
                                                    onChange={
                                                      handleChangeRentadaCheckboxChange
                                                    }
                                                    native
                                                    name="rentada"
                                                    type="checkbox"
                                                    id="rentada"
                                                    value={state.rentada}
                                                  />
                                                  <i />
                                                  Permitir Seguiiento de
                                                  Viajes/Unidades
                                                </label>
                                              </div>
                                            </div>
                                          </div>
                                          <div className="row">
                                            <div className="col-sm-6 col-md-6 col-lg-4 unit"></div>
                                            <div className="col-sm-6  col-md-6 col-lg-4  unit">
                                              <div className="inline-group">
                                                <label className="checkbox">
                                                  <input
                                                    onChange={
                                                      handleChangeRentadaCheckboxChange
                                                    }
                                                    native
                                                    name="rentada"
                                                    type="checkbox"
                                                    id="rentada"
                                                    value={state.rentada}
                                                  />
                                                  <i />
                                                  Uso de un servicio web
                                                </label>
                                              </div>
                                            </div>
                                          </div>
                                          <div className="row">
                                            <div className="col-sm-6 col-md-6 col-lg-4 unit"></div>
                                            <div className="col-sm-6  col-md-6 col-lg-4  unit">
                                              <div className="inline-group">
                                                <label className="checkbox">
                                                  <input
                                                    onChange={
                                                      handleChangeRentadaCheckboxChange
                                                    }
                                                    native
                                                    name="rentada"
                                                    type="checkbox"
                                                    id="rentada"
                                                    value={state.rentada}
                                                  />
                                                  <i />
                                                  Permitir ver Portal de
                                                  Clientes
                                                </label>
                                              </div>
                                            </div>
                                         
                                          </div>

                                          <div className="row">
                                            <div className="col-sm-6 col-md-6 col-lg-4 unit"></div>
                                            <div className="col-sm-6  col-md-6 col-lg-4  unit">
                                              <div className="inline-group">
                                                <label className="checkbox">
                                                  <input
                                                    onChange={
                                                      handleChangeRentadaCheckboxChange
                                                    }
                                                    native
                                                    name="rentada"
                                                    type="checkbox"
                                                    id="rentada"
                                                    value={state.rentada}
                                                  />
                                                  <i />
                                                 Recibir carta porte
                                                </label>
                                              </div>
                                            </div>
                                         
                                          </div>
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              </div>

                              {/*Fin de ejemplo*/}
                            </div>
                            <div className="form-footer" className="col-md-12">
                              <button
                                data-layout="topCenter"
                                data-type="information"
                                className="btn btn-primary secondary-btn"
                              >
                                Cancelar
                              </button>
                              <button
                                type="submit"
                                className="btn btn-primary primary-btn"
                              >
                                Aceptar
                              </button>
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
