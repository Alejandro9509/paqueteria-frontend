import logo from "../logo.svg";
import "../App.css";

import React, { useEffect, useState, setData, useMemo, Component } from "react";

import axios from "axios";
import { FormControl, Input, InputLabel } from "@material-ui/core";

import Cabecera from "../Components/Template/Cabecera";
import BarraLateralIzquierda from "../Components/Template/BarraLateralIzquierda";
import $ from "jquery";
import { useTable, useFilters, useSortBy } from "react-table";
import TextField from "@material-ui/core/TextField";
import Autocomplete from "@material-ui/lab/Autocomplete";
import ExportCSV from "../Components/Template/Export";
import ExportPDF from "../Components/Template/ExportPDF";

window.jQuery = window.$ = $;
const headers = {
  "Content-Type": "application/json",
};
function App(props) {
  const [dataPais, setDataPais] = React.useState([]);
  const [dataEstado, setDataEstado] = React.useState([]);
  const [data, setData] = React.useState([]);
  const [dataClientes, setDataClientes] = React.useState([]);
  const [dataCP, setDataCP] = React.useState([]);

  const [state, setState] = React.useState({
    idRemitenteDestinatario: 0,
    idCliente: {},
    numero: 0,
    nombre: "",
    rfc: "",
    activo: false,
    calle: "",
    noExterior: 0,
    noInterior: 0,
    colonia: "",
    localidad: "",
    municipio: "",
    idPais: 0,
    idEstado: 0,
    codigoPostal: 0,
    creadoPor: 0,
    creadoEl: "",
    modificadoPor: "",
    modificadoEl: "",
    contacto: "",
    correoElectronico: "",
    telefono: "",
    agregar: "Agregar",
    importar: "",
  });

  function handleShowAgregar() {
    setState({
      ...state,
      idRemitenteDestinatario: 0,
      idCliente: {},
      numero: 0,
      nombre: "",
      rfc: "",
      activo: false,
      calle: "",
      noExterior: 0,
      noInterior: 0,
      colonia: "",
      localidad: "",
      municipio: "",
      idPais: 0,
      idEstado: 0,
      codigoPostal: 0,
      creadoPor: 0,
      creadoEl: "",
      modificadoPor: "",
      modificadoEl: "",
      contacto: "",
      correoElectronico: "",
      telefono: "",
      agregar: "Agregar",
      importar: "",
    });
  }
  function getAllClientes() {
    const url = `${process.env.REACT_APP_API_URL}/Clientes/GetListado`;
    axios.get(url, { headers }).then((respuesta) => {
      console.log(respuesta);

      setDataClientes(respuesta.data);
    });
  }

  function getAllCodigosPostales() {
    const url = `${process.env.REACT_APP_API_URL}/CodigoPostal/GetListado`;
    axios.get(url, { headers }).then((respuesta) => {
      console.log(respuesta);

      setDataCP(respuesta.data);
    });
  }

  const handleChangeActivoCheckboxChange = (event) => {
    console.log(event.target.name + " " + state.activo);
    setState({
      ...state,
      activo: !state.activo,
    });
  };

  const handleAceptar = (e) => {
    e.preventDefault();
    var params = {
      IdCliente: state.idCliente.m_nIdCliente,
      Numero: state.numero,
      Nombre: state.nombre,
      RFC: state.rfc,
      Activo: state.activo,
      Calle: state.calle,
      NoExterior: state.noExterior,
      NoInterior: state.noInterior,
      Colonia: state.colonia,
      Localidad: state.localidad,
      Municipio: state.municipio,
      IdEstado: state.idEstado,
      CreadoPor: state.creadoPor,
      CreadoEl: state.creadoEl,
      ModificadoPor: state.modificadoPor,
      ModificadoEl: state.modificadoEl,
      Contacto: state.contacto,
      CorreoElectronico: state.correoElectronico,
      Telefono: state.telefono,
      agregar: "Agregar",
      importar: "",
    };
    console.log(params);
    if (state.idRemitenteDestinatario != 0) {
      const url =
        `${process.env.REACT_APP_API_URL}/RemitentesDestinatarios/Modificar/` +
        state.idRemitenteDestinatario;
      axios
        .put(url, Object.assign({}, params), { headers })
        .then((respuesta) => {
          alert(respuesta.data);
          getAllDataRemDes();
          //window.location.reload();
        })
        .catch((err) => {
          console.log(err);
          alert("err");
        });
    } else {
      const url = `${process.env.REACT_APP_API_URL}/RemitentesDestinatarios/Agregar`;
      axios
        .post(url, Object.assign({}, params), { headers })
        .then((respuesta) => {
          alert(respuesta.data);
          getAllDataRemDes();
          //window.location.reload();
        })
        .catch((err) => {
          console.log(err);
          alert(err);
        });
    }
  };

  function handleEliminar(id) {
    const url = `${process.env.REACT_APP_API_URL}/RemitentesDestinatarios/Eliminar/` + id;
    axios
      .delete(url, { headers })
      .then((respuesta) => {
        alert(respuesta.data);
        getAllDataRemDes();
      })
      .catch((err) => {
        alert(err);
      });
  }

  function handleShowModificar(row) {
    console.log(row.original.m_nIdRemitenteDestinatario);
    const url =
    `${process.env.REACT_APP_API_URL}/RemitentesDestinatarios/GetById/` +
      row.original.m_nIdRemitenteDestinatario;
    axios.get(url, { headers }).then((respuesta) => {
      console.log(respuesta.data);
      getAllEstados(respuesta.data.m_nIdPais);
      setState({
        ...state,
        agregar: "Modificar",
        idRemitenteDestinatario: row.original.m_nIdRemitenteDestinatario,
        idCliente: respuesta.data.m_nIdCliente,
        numero: respuesta.data.m_nNumero,
        nombre: respuesta.data.m_sNombre,
        rfc: respuesta.data.m_sRFC,
        activo: respuesta.data.m_bActivo,
        calle: respuesta.data.m_sCalle,
        noExterior: respuesta.data.m_sNoExterior,
        noInterior: respuesta.data.m_sNoInterior,
        colonia: respuesta.data.m_sColonia,
        localidad: respuesta.data.m_sLocalidad,
        municipio: respuesta.data.m_sMunicipio,
        idPais: respuesta.data.m_nIdPais,
        idEstado: respuesta.data.m_nIdEstado,
        codigoPostal: respuesta.data.m_sCodigoPostal,
        creadoPor: respuesta.data.m_nCreadoPor,
        creadoEl: respuesta.data.m_dtCreadoEl,
        modificadoPor: respuesta.data.m_nModificadoPor,
        modificadoEl: respuesta.data.m_dtModificadoEl,
        contacto: respuesta.data.m_sContacto,
        correoElectronico: respuesta.data.m_sCorreoElectronico,
        telefono: respuesta.data.m_sTelefono,
      });
    });
  }

  const columns2 = React.useMemo(() => [
    {
      Name: "Número",
      accessor: "m_nNumero",
    },
    {
      Name: "RFC",
      accessor: "m_sRFC",
    },
    {
      Name: "Remitente-Destinatario",
      accessor: "m_sNombre",
    },
    {
      Name: "Núm.Cliente",
      accessor: "m_nNumeroCliente",
    },
    {
      Name: "Cliente",
      accessor: "m_sNombreFiscal",
    },
  ]);

  const headers = {
    "Content-Type": "application/json",
    //    'access-control-allow-origin': '*'
  };

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

  const handleChange = (event) => {
    console.log(event.target.id + " : " + event.target.value);
    setState({
      ...state,
      [event.target.id]: event.target.value,
    });
  };

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
                          handleEliminar(
                            row.original.m_nIdRemitenteDestinatario
                          )
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

  useEffect((value) => {
    getAllPaises();
    getAllDataRemDes();
    getAllClientes();
    getAllCodigosPostales();
  }, []);

  function getAllDataRemDes() {
    const url = `${process.env.REACT_APP_API_URL}/RemitentesDestinatarios/GetListado`;
    axios.get(url, { headers }).then((respuesta) => {
      setData(respuesta.data);
    });
  }

  function getAllPaises() {
    const url = `${process.env.REACT_APP_API_URL}/Pais/GetListado`;
    axios.get(url, { headers }).then((respuesta) => {
      setDataPais(respuesta.data);
      getAllEstados(respuesta.data[0].m_nIdPais)
    });
  }

  const handleSelectChange = (event) => {
    setState({
      ...state,
      idPais: event.target.value,
    })
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

      <section className="main-container">
        <div className="container-fluid">
          <div className="page-header filled full-block light">
            <div className="row">
              <div className="col-md-6 col-sm-6">
                <h2>Remitente/Destinatario</h2>
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
              <i className="fa fa-list" />
              Listado
            </a>
          </li>
          <li>
            <a data-toggle="tab" href="#Agregar" onClick={handleShowAgregar}>
              <i className="fa fa-plus-circle" /> {state.agregar}
            </a>
          </li>
          <li>
            <ExportCSV
              csvData={data}
              fileName="RemitentesDestinatarios_Listado"
            />
          </li>
          <li>
            <ExportPDF
              data={data}
              column={columns2}
              fileName="Remitentes-Destinatarios"
            />
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
                  <Table columns={columns2} data={data} />
                </div>
              </div>
            </div>
          </div>
          <div id="Imprimir" className="tab-pane fade ">
            Imprimir
          </div>

          <div id="Agregar" className="tab-pane fade ">
          <form className="j-forms" onSubmit={handleAceptar}>
            <div className="row">
              <div className="col-md-6">
                <div className="widget-wrap">
                  <div className="widget-container margin-top-0">
                    <div className="widget-content">
                        {/*Inicio de ejemplo*/}
                        <div className="widget-container">
                          <div className="widget-content">
                            <div className="row">
                              <div className="w-section-header">
                                <h3>Información General</h3>
                              </div>
                              <div className="col-md-12">
                                <div className="row">
                                  <div className="col-md-6 unit">
                                    <label className="label">Número</label>
                                    <div className="input">
                                      <input
                                        onChange={handleChange}
                                        type="number"
                                        min="0"
                                        pattern="[0-9]*"
                                        className="form-control"
                                        value={state.numero}
                                        id="numero"
                                        maxlength="4"
                                        required
                                      />
                                    </div>
                                  </div>
                                  <div className="col-md-6 unit">
                                    <label className="label">Estatus</label>
                                    <label className="checkbox">
                                      <input
                                        onChange={
                                          handleChangeActivoCheckboxChange
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
                                <div className="unit">
                                  <label className="label">RFC</label>
                                  <div className="input">
                                    <input
                                      onChange={handleChange}
                                      className="form-control"
                                      type="text"
                                      pattern="[A-Z&Ñ]{3,4}[0-9]{2}(0[1-9]|1[012])(0[1-9]|[12][0-9]|3[01])[A-Z0-9]{2}[0-9A]"
                                      title="Favor de introducir un RFC válido."
                                      value={state.rfc}
                                      id="rfc"
                                      required
                                    />
                                  </div>
                                </div>
                                <div className="unit">
                                  <label className="label">Nombre</label>
                                  <div className="input">
                                    <input
                                      onChange={handleChange}
                                      className="form-control"
                                      type="text"
                                      value={state.nombre}
                                      id="nombre"
                                      required
                                    />
                                  </div>
                                </div>
                                <div className="unit">
                                  <label className="label">Cliente</label>
                                  {/*  <input class="form-control" type="text" placeholder="Enter a letter" id="list-autocomplete" name="list-autocomplete"/> */}
                                  <Autocomplete
                                    freeSolo
                                    onChange={(event, newValue) =>
                                      setState({
                                        ...state,
                                        idCliente: newValue,
                                      })
                                    }
                                    value={state.idCliente}
                                    id="idCliente"
                                    disableClearable
                                    getOptionLabel={(option) =>
                                      option.m_sNombreFiscal
                                    }
                                    options={dataClientes}
                                    renderInput={(params) => (
                                      <TextField
                                        {...params}
                                        InputProps={{
                                          ...params.InputProps,
                                          type: "search",
                                          value: state.idCliente,
                                        }}
                                      />
                                    )}
                                  />{" "}
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                  </div></div>
                </div>
              </div>
              <div className="col-md-6">
                <div className="widget-wrap">
                  <div className="widget-container margin-top-0">
                    <div className="widget-content">
                        {/*Inicio de ejemplo*/}
                        <div className="widget-container">
                          <div className="widget-content">
                            <div className="row">
                              <div className="w-section-header">
                                <h3>Domicilio Fiscal</h3>
                              </div>
                              <div class="col-md-8 unit">
                                <label className="label">País</label>
                                <label className="input select">
                                  <select
                                    onChange={handleSelectChange}
                                    className="form-control"
                                    required
                                    native
                                    value={state.idPais}
                                    id="idPais"
                                  >
                                    {dataPais.map((pais) => (
                                      <option value={pais.m_nIdPais}>
                                        {pais.m_sPais}
                                      </option>
                                    ))}
                                  </select>
                                  <i></i>
                                </label>
                              </div>
                              <div class="col-md-4 unit">
                                <label className="label">C.P</label>
                                <div className="input">
                                  <Autocomplete
                                    freeSolo
                                    onChange={(event, newValue) =>
                                      setState({
                                        ...state,
                                        codigoPostal: newValue,
                                      })
                                    }
                                    value={state.codigoPostal}
                                    id="codigoPostal"
                                    disableClearable
                                    options={dataCP}
                                    getOptionLabel={(option) => option.m_sCP}
                                    renderInput={(params) => (
                                      <TextField
                                        {...params}
                                        InputProps={{
                                          ...params.InputProps,
                                          type: "search",
                                        }}
                                      />
                                    )}
                                  />{" "}
                                </div>
                              </div>
                            </div>

                            <div className="unit">
                              <label className="label">Estado</label>
                              <label className="input select">
                                <select
                                  onChange={handleChange}
                                  className="form-control"
                                  required
                                  native
                                  name="idEstado"
                                  value={state.idEstado}
                                  id="idEstado"
                                >
                                  {
                                    dataEstado.length < 1 ? 
                                    
                                    <option value="0">
                                      Estados
                                    </option> 
                                    :
                                    dataEstado.map((estado) => (
                                    <option value={estado.m_nIdEstado}>
                                      {estado.m_sEstado}
                                    </option>
                                  ))
                                  }
                                </select>
                                <i></i>
                              </label>
                            </div>
                            <div class="row">
                              <div class="col-md-6 unit">
                                {" "}
                                <label className="label">Municipio</label>
                                <div className="input">
                                  <input
                                    onChange={handleChange}
                                    className="form-control"
                                    type="text"
                                    id="text"
                                    value={state.municipio}
                                    id="municipio"
                                  />
                                </div>{" "}
                              </div>
                              <div class="col-md-6 unit">
                                <label className="label">Localidad</label>
                                <div className="input">
                                  <input
                                    onChange={handleChange}
                                    className="form-control"
                                    type="text"
                                    value={state.localidad}
                                    id="localidad"
                                  />
                                </div>
                              </div>
                            </div>
                            <div className="unit">
                              <label className="label">Colonia</label>
                              <div className="input">
                                <input
                                  onChange={handleChange}
                                  className="form-control"
                                  type="text"
                                  value={state.colonia}
                                  id="colonia"
                                />
                              </div>
                            </div>
                            <div className="unit">
                              <label className="label">Calle</label>
                              <div className="input">
                                <input
                                  onChange={handleChange}
                                  className="form-control"
                                  type="text"
                                  value={state.calle}
                                  id="calle"
                                />
                              </div>
                            </div>
                            <div class="row">
                              <div class="col-md-6 unit">
                                {" "}
                                <label className="label">Núm. Exterior</label>
                                <div className="input">
                                  <input
                                    onChange={handleChange}
                                    className="form-control"
                                    type="text"
                                    value={state.noExterior}
                                    id="noExterior"
                                  />
                                </div>{" "}
                              </div>
                              <div class="col-md-6 unit">
                                <label className="label">Núm. Interior</label>
                                <div className="input">
                                  <input
                                    onChange={handleChange}
                                    className="form-control"
                                    type="text"
                                    value={state.noInterior}
                                    id="noInterior"
                                  />
                                </div>
                              </div>
                            </div>
                            <div className="unit">
                              <label className="label">
                                Nombre del contacto
                              </label>
                              <div className="input">
                                <input
                                  onChange={handleChange}
                                  className="form-control"
                                  type="text"
                                  value={state.contacto}
                                  id="contacto"
                                />
                              </div>
                            </div>
                            <div class="row">
                              <div class="col-md-6 unit">
                                {" "}
                                <label className="label">Teléfonos</label>
                                <div className="input">
                                  <input
                                    onChange={handleChange}
                                    className="form-control"
                                    type="text"
                                    value={state.telefono}
                                    id="telefono"
                                  />
                                </div>{" "}
                              </div>
                              <div class="col-md-6 unit">
                                <label className="label">Correo</label>
                                <div className="input">
                                  <input
                                    onChange={handleChange}
                                    className="form-control"
                                    type="email"
                                    value={state.correoElectronico}
                                    id="correoElectronico"
                                  />
                                </div>
                              </div>
                              <div className="form-footer" className="col-md-12">
                  <button data-layout="topCenter" data-type="information" className="btn btn-primary secondary-btn">Cancelar</button>
                  <button type="submit" className="btn btn-primary primary-btn">Aceptar</button>
                </div>
                            </div>
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
      </section>
    </div>
  );
}

export default App;
