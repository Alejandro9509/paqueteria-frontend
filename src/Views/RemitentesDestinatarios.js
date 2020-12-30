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
    showPopUp: false,
    idRemitenteDestinatario: 0,
    idCliente: {},
    numero: 0,
    nombre: "",
    rfc: "",
    activo: "false",
    calle: "",
    noExterior: 0,
    noInterior: 0,
    colonia: "",
    localidad: "",
    municipio: 0,
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
<<<<<<< HEAD
    importar: "",
=======
    importar: ""
})



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
>>>>>>> feature/componentes
  });

<<<<<<< HEAD
  function handleShowAgregar() {
    setState({
      ...state,
    });
=======


const handleAceptar = (e) => {
  e.preventDefault()
	var params = { 
    "IdCliente": state.idCliente,
    Numero: 0,
    Nombre: "",
    RFC: "",
    Activo: "true",
    Calle: "",
    NoExterior: 0,
    NoInterior: 0,
    Colonia: "",
    Localidad:"",
    Municipio: 0,
    IdEstado: 0,
    CodigoPostal: 0,
    IdSucursal: 0,
    CreadoPor:0,
    CreadoEl:"",
    ModificadoPor:"",
    ModificadoEl:"",
    Contacto:"",
    CorreoElectronico:"",
    Telefono:"",
    agregar: "Agregar",
    importar: ""
	  
  }
  console.log(params)
  if(state.idDepartamento != 0){
    const url = `${process.env.REACT_APP_API_URL}/Departamento/Modificar/` + state.idDepartamento;
    axios.put(url, Object.assign({}, params), {headers}).then(respuesta => {
    alert(respuesta.data)
    window.location.reload();
  }).catch(err => {
    console.log(err)
    alert("err")
  });
  } else {
  const url = `${process.env.REACT_APP_API_URL}/Departamento/Agregar`;
  axios.post(url, Object.assign({}, params), {headers}).then(respuesta => {
    alert(respuesta.data)
    window.location.reload();
  }).catch(err => {
    console.log(err)
    alert(err)
  });
>>>>>>> feature/componentes
  }
  function getAllClientes() {
    const url = "http://localhost/Clientes/GetListado";
    axios.get(url, { headers }).then((respuesta) => {
      console.log(respuesta);

<<<<<<< HEAD
      setDataClientes(respuesta.data);
    });
  }
=======
}


  function handleEliminar(id){
    const url = `${process.env.REACT_APP_API_URL}/Departamento/Eliminar/` + id;
    axios.delete(url, {headers}).then(respuesta => {
    }).catch(err => {
      alert(err)
    });
  }
  
  function handleShowModificar(row){
    console.log(row.original.m_nIdDepartamento)
    const url = `${process.env.REACT_APP_API_URL}/Departamento/GetById/` + row.original.m_nIdDepartamento;
      axios.get(url, {headers}).then(respuesta => {
        setState({
          ...state,
          agregar: "Modificar",
          showPopUp: true,
          idDepartamento: row.original.m_nIdDepartamento,
          codigoDepartamento: respuesta.data.m_nCodigo,
          descripcionDepartamento: respuesta.data.m_sDescripcion
        })
      });
    }
>>>>>>> feature/componentes

  function getAllCodigosPostales() {
    const url = "http://192.168.2.211:9090/CodigoPostal/GetListado";
    axios.get(url, { headers }).then((respuesta) => {
      console.log(respuesta);

      setDataCP(respuesta.data);
    });
  }

  
  const handleChangeActivoCheckboxChange = (event) => {
    console.log(event.target.name+" " + state.activo);
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
        "http://localhost/RemitentesDestinatarios/Modificar/" +
        state.idRemitenteDestinatario;
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
      const url = "http://localhost/RemitentesDestinatarios/Agregarr";
      axios
        .post(url, Object.assign({}, params), { headers })
        .then((respuesta) => {
          alert(respuesta.data);
          window.location.reload();
        })
        .catch((err) => {
          console.log(err);
          alert(err);
        });
    }
  };

  function handleEliminar(id) {
    const url = "http://localhost/RemitentesDestinatarios/Eliminar/" + id;
    axios
      .delete(url, { headers })
      .then((respuesta) => {})
      .catch((err) => {
        alert(err);
      });
  }

  function handleShowModificar(row) {
    console.log(row.original.m_nIdRemitenteDestinatario);
    const url =
      "http://localhost/RemitentesDestinatarios/GetById/" +
      row.original.m_nIdRemitenteDestinatario;
    axios.get(url, { headers }).then((respuesta) => {
      setState({
        ...state,
        agregar: "Modificar",
        idRemitenteDestinatario: row.original.m_nIdRemitenteDestinatario,
        idCliente: row.original.m_nIdCliente,
        numero: row.original.m_nNumero,
        nombre: row.original.m_sNombre,
        rfc: row.origial.m_sRFC,
        activo: row.original.m_bActivo,
        calle: row.original.m_sCalle,
        noExterior: row.original.m_sNoExterior,
        noInterior: row.original.m_sNoInterior,
        colonia: row.original.m_sColonia,
        localidad: row.original.m_sLocalidad,
        municipio: row.original.m_sMunicipio,
        idEstado: row.original.m_nIdEstado,
        codigoPostal: row.original.m_sCodigoPostal,
        creadoPor: row.original.m_nCreadoPor,
        creadoEl: row.original.m_dtCreadoEl,
        modificadoPor: row.original.m_nModificadoPor,
        modificadoEl: row.original.m_dtModificadoEl,
        contacto: row.original.m_sContacto,
        correoElectronico: row.original.m_sCorreoElectronico,
        telefono: row.original.m_sTelefono,
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
                          handleEliminar(row.original.m_nIdDepartamento)
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
<<<<<<< HEAD
    const url = "http://localhost/RemitentesDestinatarios/GetListado";
    axios.get(url, { headers }).then((respuesta) => {
      setData(respuesta.data);
=======
    const url = `${process.env.REACT_APP_API_URL}/RemitentesDestinatarios/GetListado`;
    axios.get(url, {headers}).then(respuesta => {
      setData(respuesta.data)
>>>>>>> feature/componentes
    });
  }

  function getAllPaises() {
    const url = `${process.env.REACT_APP_API_URL}/Pais/GetListado`;
    axios.get(url, { headers }).then((respuesta) => {
      setDataPais(respuesta.data);
    });
  }

  const handleSelectChange = (event) => {
    console.log("onChangeSelect")
    getAllEstados(event.target.value);
  }

<<<<<<< HEAD
  function getAllEstados(id) {
    console.log(id)
    const url = "http://localhost/Estados/ByPais/" + id;
=======
  const [idstate, setidState] = React.useState({
    idPais: 0,
  });

  function getAllEstados(idPais) {
    const url = `${process.env.REACT_APP_API_URL}/Estados/ByPais/` + idPais;
>>>>>>> feature/componentes
    axios.get(url, { headers }).then((respuesta) => {
      console.log(respuesta.data)
      setDataEstado(respuesta.data);
    });
    console.log(dataEstado)
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
              Listado
            </a>
          </li>
          <li>
            <a data-toggle="tab" href="#Agregar" onClick={handleShowAgregar}>
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
                  <Table columns={columns2} data={data} />
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
              <div className="col-md-6">
                <div className="widget-wrap">
                  <div className="widget-container margin-top-0">
                    <div className="widget-content">
                      <form className="j-forms j-multistep" id="j-forms">
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
                                        type="text"
                                        pattern="[0-9]*"
                                        className="form-control"
                                        placeholder={state.numero}
                                        id="numero"
                                        maxlength="4"
                                      />
                                    </div>
                                  </div>
                                  <div className="col-md-6 unit">
                                    <label className="label">Estatus</label>
                                    <label className="checkbox">
                                      <input
onChange={
  handleChangeActivoCheckboxChange
}                                        required
                                        native
                                        type="checkbox"
                                        placeholder={state.activo}
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
                                      placeholder={state.rfc}
                                      id="rfc"
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
                                      placeholder={state.nombre}
                                      id="nombre"
                                    />
                                  </div>
                                </div>
                                <div className="unit">
                                  <label className="label">Cliente</label>
                                  {/*  <input class="form-control" type="text" placeholder="Enter a letter" id="list-autocomplete" name="list-autocomplete"/> */}
                                  <Autocomplete
                                    freeSolo
                                    onChange={(event, newValue) => setState({...state, idCliente: newValue})}
                                    placeholder={state.idCliente}
                                    id="idCliente"
                                    disableClearable
                                    getOptionLabel={(option) => option.m_sNombreFiscal}
                                    options={dataClientes}
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
                          </div>
                        </div>
                      </form>
                    </div>
                  </div>
                </div>
              </div>
              <div className="col-md-6">
                <div className="widget-wrap">
                  <div className="widget-container margin-top-0">
                    <div className="widget-content">
                      <form className="j-forms j-multistep" id="j-forms">
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
                                    //onChange={handleChange}
                                    onChange={handleSelectChange}
                                    //onSelect={getAllEstados(state.idPais)}
                                    className="form-control"
                                    required
                                    native
                                    placeholder={state.idPais}
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
                                    onChange={(event, newValue) => setState({...state, codigoPostal: newValue})}
                                    placeholder={state.codigoPostal}
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
                                  placeholder={state.idEstado}
                                    id="idEstado"
                                >

                                  {dataEstado.map((estado) => (
                                    <option value={estado.m_nIdEstado}>
                                      {estado.m_sEstado}
                                    </option>
                                  ))}
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
                                    placeholder="Municipio"
                                    id="text"
                                    placeholder={state.municipio}
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
                                    placeholder={state.localidad}
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
                                  placeholder={state.colonia}
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
                                  placeholder={state.calle}
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
                                    placeholder={state.noExterior}
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
                                    placeholder={state.noInterior}
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
                                  placeholder={state.contacto}
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
                                    placeholder={state.telefono}
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
                                    placeholder={state.correoElectronico}
                                    id="correoElectronico"
                                  />
                                </div>
                              </div>
                              <button
                                onClick={handleAceptar}
                                className="btn btn-primary primary-btn"
                              >
                                Aceptar
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
          </div>
        </div>
      </section>
    </div>
  );
}

export default App;
