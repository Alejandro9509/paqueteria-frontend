import logo from "../logo.svg";
import "../App.css";

import React, { useEffect, useState, setData, useMemo, Component } from "react";

import axios from "axios";
import { FormControl, Input, InputLabel } from "@material-ui/core";

import Cabecera from "../Components/Template/Cabecera";
import BarraLateralIzquierda from "../Components/Template/BarraLateralIzquierda";
import $ from "jquery";
import { useTable, useFilters,useGlobalFilter, useSortBy } from "react-table";
import useModal from "react-hooks-use-modal";
import IconButton from "@material-ui/core/IconButton";
import SearchIcon from "@material-ui/icons/Search";
import PageviewIcon from "@material-ui/icons/Pageview";
import Autocomplete from "@material-ui/lab/Autocomplete";
import TextField from "@material-ui/core/TextField";
import InputAdornment from "@material-ui/core/InputAdornment";
import ExportCSV from "../Components/Template/Export";
import ExportPDF from "../Components/Template/ExportPDF";
import { useHistory } from 'react-router-dom';

import Noty from 'noty';

function showSuccess(mensaje){
  new Noty({
    type:"information",
    layout:"topCenter",
    text: mensaje,
    timeout:"3000"
  }).show()
}

window.jQuery = window.$ = $;
const headers = {
  "Content-Type": "application/json",
};
function App(props) {
  const [dataPais, setDataPais] = React.useState([]);
  const [dataEstado, setDataEstado] = React.useState([]);
  const [data, setData] = React.useState([]);
  const [dataClientes, setDataClientes] = React.useState([]);
  const [dataCodigoPostal, setDataCodigoPostal] = React.useState([]);
  const [Modal, open, close, isOpen] = useModal("root", {
    preventScroll: true,
  });

  const [state, setState] = React.useState({
    idRemitenteDestinatario: 0,
    idCliente: {},
    cliente:{},
    numero: 0,
    nombre: "",
    rfc: "",
    activo: false,
    DerechoBorrar:50,
    calle: "",
    noExterior: 0,
    noInterior: 0,
    colonia: "",
    localidad: "",
    municipio: "",
    idPais: 0,
    idEstado: 0,
    codigoPostal: {},
    creadoPor: localStorage.getItem("UsuarioId") ,
    creadoEl: "",
    modificadoPor: localStorage.getItem("UsuarioId") ,
    modificadoEl: "",
    contacto: "",
    correoElectronico: "",
    telefono: "",
    agregar: "Agregar",
    importar: "",
    height: window.innerHeight
  });

  function handleShowAgregar() {
    setState({
      ...state,
      idRemitenteDestinatario: 0,
      idCliente: {},
      cliente: dataClientes[0],

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
      creadoPor: state.creadoPor,
      creadoEl: "",
      modificadoPor: state.modificadoPor,
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

  function handleSelectCP(id, cp) {
    setState({
      ...state,
      [state.identificadorModal]: id,
    });
    console.log(id);
    console.log(state.identificadorModal);
  }

  function getAllCodigosPostales() {
    const url = `${process.env.REACT_APP_API_URL}/CodigoPostal/GetListado`;
    axios.get(url, { headers }).then((respuesta) => {
      console.log(respuesta);

      setDataCodigoPostal(respuesta.data);
    });
  }

  const handleChangeNumero = (event) => {
    const url =
      `${process.env.REACT_APP_API_URL}/RemitentesDestinatarios/ValidaNumeroRemDes/` +
      state.numero;
    axios.get(url, { headers }).then((respuesta) => {
      if (respuesta.data != "") {
        showSuccess(respuesta.data.m_sMensaje);
        console.log(respuesta.data);
        setState({
          ...state,

          numero: respuesta.data.m_nNumero,
        });
      }
    });
  };
  const handleChangeActivoCheckboxChange = (event) => {
    console.log(event.target.name + " " + state.activo);
    setState({
      ...state,
      activo: !state.activo,
    });
  };

  const history = useHistory()


  const handleAceptar = (e) => {
    e.preventDefault();
    var params = {
      IdCliente: state.cliente.m_nIdCliente,
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
          showSuccess(respuesta.data);
          getAllDataRemDes();
          //window.location.reload();
        })
        .catch((err) => {
          console.log(err);
          showSuccess("err");
        });
    } else {
      const url = `${process.env.REACT_APP_API_URL}/RemitentesDestinatarios/Agregar`;
      axios
        .post(url, Object.assign({}, params), { headers })
        .then((respuesta) => {
          showSuccess(respuesta.data);
          getAllDataRemDes();
          //window.location.reload();
        })
        .catch((err) => {
          console.log(err);
          showSuccess(err);
        });
    }
  };

  function handleEliminar(id) {
    var derecho;
    const urlDelete = `${process.env.REACT_APP_API_URL}/Utilerias/ValidaDerechos/${state.creadoPor}/${state.DerechoBorrar}/3`;
    axios.get(urlDelete, { headers }).then(respuesta => {
      //showSuccess(respuesta.data)

      derecho = respuesta.data;
      if (derecho == false)
      {
        showSuccess ("El usuario no tiene derechos para realizar el proceso");
        return; 
      }
      
    const url =
    `${process.env.REACT_APP_API_URL}/RemitentesDestinatarios/Eliminar/` + id;
  axios
    .delete(url, { headers })
    .then((respuesta) => {
      showSuccess(respuesta.data);
      getAllDataRemDes();
    })
    .catch((err) => {
      showSuccess(err);
    });
	}).catch(err => {
    showSuccess(err)
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
        cliente: dataClientes.find(
          (o) => o.m_nIdCliente == respuesta.data.m_nIdCliente
        ),
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

  const columnsCP = React.useMemo(() => [
    {
      Name: "Codigo",
      accessor: "m_sCP",
    },
    {
      Name: "Estado",
      accessor: "m_sEstado",
    },
    {
      Name: "Ciudad",
      accessor: "m_sCiudad",
    },
  ]);

  const columnsCliente = React.useMemo(() => [
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

  function TableCodigoPostal({ columns, data, select }) {
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
      state,
      preGlobalFilteredRows,
      setGlobalFilter,
    } = useTable(
      {
        columns,
        data,
        defaultColumn,
      },
      useFilters,
      useGlobalFilter,
      useSortBy
    );

    return (
      <div
        className="col-md-12"
        style={{ maxHeight: "300px", overflow: "auto" }}
      >
        <table className="table" {...getTableProps()}>
          <thead>
            {headerGroups.map((headerGroup) => (
              <tr {...headerGroup.getHeaderGroupProps()}>
                <th>Acciones</th>
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
            {rows.map(
              (row, i) => {
                prepareRow(row);
                return (
                  <tr style={{backgroundColor: row.original.m_nIdCP === select ? "orange" : "white"}}  {...row.getRowProps()} onClick={handleSelectCP.bind(this, row.original)} onDoubleClick={close}>
                    {row.cells.map(cell => {
                      return (
                        <td {...cell.getCellProps()}>{cell.render('Cell')}</td>
                      )
                    })}
                  </tr>
                )
              }
            )}
          </tbody>
        </table>
      </div>
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
                <th>Acciones</th>
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
                        className="btn btn-default btn-sm"
                      >
                        <i className="fa fa-pencil-square-o"style={{color:"#F9A03E"}} />
                      </a>

                      <a
                        href="#"
                        className="btn btn-default btn-sm"
                        onClick={() =>
                          handleEliminar(
                            row.original.m_nIdRemitenteDestinatario
                          )
                        }
                      >
                        <i className="fa fa-eye" style={{color:"#F9A03E"}} /> 
                      </a>
                      <a
                        href="#"
                        className="btn btn-default btn-sm"
                        onClick={() =>
                          handleEliminar(
                            row.original.m_nIdRemitenteDestinatario
                          )
                        }
                      >
                        <i className="zmdi zmdi-delete"  style={{color:"#F30B0B"}} />
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

  function TableClientes({ columns, data, select }) {
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
      state,
      preGlobalFilteredRows,
      setGlobalFilter,
    } = useTable(
      {
        columns,
        data,
        defaultColumn,
      },
      useFilters,
      useGlobalFilter,
      useSortBy
    );

    return (
      <div
        className="col-md-12"
        style={{ maxHeight: "300px", overflow: "auto" }}
      >
        <table className="table" {...getTableProps()}>
          <thead>
            {headerGroups.map((headerGroup) => (
              <tr {...headerGroup.getHeaderGroupProps()}>
                <th>Acciones</th>
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
            {rows.map(
              (row, i) => {
                prepareRow(row);
                return (
                  <tr style={{backgroundColor: row.original.m_nIdCP === select ? "orange" : "white"}}  {...row.getRowProps()} onClick={handleSelectCP.bind(this, row.original)} onDoubleClick={close}>
                    {row.cells.map(cell => {
                      return (
                        <td {...cell.getCellProps()}>{cell.render('Cell')}</td>
                      )
                    })}
                  </tr>
                )
              }
            )}
          </tbody>
        </table>
      </div>
    );
  }

  useEffect((value) => {
    if (localStorage.getItem("UsuarioId") === null || localStorage.getItem("UsuarioId") <= 0)
    {
      showSuccess("Es necesario iniciar sesion para acceder a este proceso");
      window.location.replace("login");
      return;
    }
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
      getAllEstados(respuesta.data[0].m_nIdPais);
    });
  }

  const handleSelectChange = (event) => {
    setState({
      ...state,
      idPais: event.target.value,
    });
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

  const ruta = [
    {
      actual: false,
      nombre: "Catálogos",
      ruta: "/Catalogos",
    },
    {
      actual: true,
      nombre: "Remitente Destinatario",
      ruta: "/RemitenteDestinatarios",
    },
  ];

  return (
    <div>
  <Modal style={{height:"400px"}}>  
      {state.tipoModal == 0 && 
      <div className="row" style={{ backgroundColor: '#FFFFFF' }}>
        {dataClientes.length != 0 ? <TableClientes select={state[state.identificadorModal] && state[state.identificadorModal].m_nIdCliente} columns={columnsCliente} data={dataClientes} identificadorModal = {state.identificadorModal}/> : <div>No se encontró ningún registro</div>}
       <br></br>
       <br></br>
       <button onClick={close} className="btn btn-secondary secondary-btn">Cerrar</button>
       <button onClick={() => {history.push("/Clientes")}} className="btn btn-primary primary-btn">Agregar</button>
    </div>
      }
     
      {state.tipoModal == 1 && 
      <div className="row" style={{ backgroundColor: '#FFFFFF' }}>
        {dataCodigoPostal.length != 0 ? <TableCodigoPostal select={state[state.identificadorModal] && state[state.identificadorModal].m_nIdCP} columns={columnsCP} data={dataCodigoPostal} identificadorModal = {state.identificadorModal}/> : <div>No se encontró ningún registro</div>}
       <br></br>
       <br></br>
       <button onClick={close} className="btn btn-secondary secondary-btn">Cerrar</button>
       <button onClick={() => {history.push("/Ciudades")}} className="btn btn-primary primary-btn">Agregar</button>
    </div>
}
    
  </Modal>





      <header className="topbar clearfix">
        <Cabecera />
      </header>
      {/*Topbar End Here*/}
      {/*Leftbar Start Here*/}
      <aside className="iconic-leftbar" style={{ minHeight: state.height }}>
        <BarraLateralIzquierda />
      </aside>

      <section className="main-container">
        <div className="container-fluid">
          <div className="page-header filled full-block light">
            <div className="row">
              <div className="col-md-6 col-sm-6">
                <h2>Remitente / Destinatario</h2>
              </div>
              <div className="col-md-6 col-sm-6">
                <ul className="list-page-breadcrumb">
                  <li>
                    <a href="/Catalogos" className="color-mapeo">
                      Catálogos <i className="zmdi zmdi-chevron-right" />
                    </a>
                  </li>
                  <li className="active-page">Remitente / Destinatario</li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        <ul className="nav navStatica nav-tabs">
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
                <div className="col-md-12">
                  <div className="widget-wrap">
                    <div className="widget-container margin-top-0">
                      <div className="widget-content">
                        {/*Inicio de ejemplo*/}
                        <div className="widget-container">
                          <div className="widget-content">
                            <div className="row">
                              <div className="col-md-12">
                                <div className="w-section-header">
                                  <h3>Información General</h3>
                                </div>



                                <div className="row">

                                  <div className="col-sm-6 col-md-2-5 unit">
                                    <label className="label">Número</label>
                                    <div className="input">
                                      <input
                                        onChange={handleChange}
                                        onBlur={handleChangeNumero}
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

                                  <div className="col-sm-6 col-md-2-5 unit">
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
                                  <div className="col-sm-6 col-md-2-5 unit">
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
                                  <div className="col-sm-6 col-md-2-5 unit">
                                  <label className="label">
                                      Código Postal
                                    </label>
                                    <div className="input">
                                      <Autocomplete
                                        value={state.cliente}
                                        freeSolo
                                        onChange={(event, newValue) =>
                                          setState({
                                            ...state,
                                            cliente: newValue,
                                          })
                                        }
                                        id="cliente"
                                        disableClearable
                                        forcePopupIcon={false}
                                        options={dataClientes}
                                        getOptionLabel={(option) =>
                                          option.m_sNombreFiscal
                                        }
                                        variant="outlined"
                                        style={{
                                          borderWidth: "1px",
                                          borderColor: "#dddddd",
                                          borderStyle: "solid",
                                          borderRadius: "5px",
                                          
                                        }}
                                        renderInput={(params) => (
                                          <div>
                                            <TextField
                                              {...params}
                                              InputProps={{
                                                ...params.InputProps,
                                                style: { height: 21 },
                                                type: "search",
                                                disableUnderline: true,
                                                endAdornment: (
                                                  <InputAdornment position="end">
                                                    <IconButton
                                                      padding="0px"
                                                      style={{
                                                        paddingRight: "0px",
                                                      }}
                                                      onClick={() => {
                                                        setState({
                                                          ...state,
                                                          identificadorModal:
                                                            "cliente",
                                                          tipoModal: 0,
                                                        });
                                                        open();
                                                      }}
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
                                                ),
                                              }}
                                            />
                                          </div>
                                        )}
                                      />
                                    </div>
                                  </div>
                                  <div className="col-sm-12 col-md-2-5 unit">
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
                              </div>
                            </div>
                          </div>
                        </div>

                        <div className="widget-container">
                          <div className="widget-content">
                            <div className="row">
                              <div className="col-md-12">
                                <div className="w-section-header">
                                  <h3>Domicilio Fiscal</h3>
                                </div>

                                <div className="row">

                                  <div class="col-md-4 unit">
                                    <label className="label">País</label>
                                    <label className="input select">
                                      <select
                                        onChange={handleSelectChange}
                                        className="form-control"
                                        native
                                        value={state.idPais}
                                        id="idPais"
                                        name="idPais"
                                      >
                                        {dataPais.length < 1 ? (
                                          <option value="none">País</option>
                                        ) : (
                                            dataPais.map((pais) => (
                                              <option
                                                key={pais.m_nIdPais}
                                                value={pais.m_nIdPais}
                                              >
                                                {pais.m_sPais}
                                              </option>
                                            ))
                                          )}
                                      </select>
                                      <i></i>
                                    </label>
                                  </div>
                                  <div class="col-md-4 unit">
                                  <label className="label">
                                      Código Postal
                                    </label>
                                    <div className="input">
                                      <Autocomplete
                                        value={state.codigoPostalRemitente}
                                        freeSolo
                                        onChange={(event, newValue) =>
                                          setState({
                                            ...state,
                                            codigoPostalRemitente: newValue,
                                          })
                                        }
                                        id="codigoPostalRemitente"
                                        disableClearable
                                        forcePopupIcon={false}
                                        options={dataCodigoPostal}
                                        getOptionLabel={(option) =>
                                          option.m_sCP
                                        }
                                        variant="outlined"
                                        style={{
                                          borderWidth: "1px",
                                          borderColor: "#dddddd",
                                          borderStyle: "solid",
                                          borderRadius: "5px",
                                          
                                        }}
                                        renderInput={(params) => (
                                          <div>
                                            <TextField
                                              {...params}
                                              InputProps={{
                                                ...params.InputProps,
                                                style: { height: 21 },
                                                type: "search",
                                                disableUnderline: true,
                                                endAdornment: (
                                                  <InputAdornment position="end">
                                                    <IconButton
                                                      padding="0px"
                                                      style={{
                                                        paddingRight: "0px",
                                                      }}
                                                      onClick={() => {
                                                        setState({
                                                          ...state,
                                                          identificadorModal:
                                                            "codigoPostalRemitente",
                                                          tipoModal: 1,
                                                        });
                                                        open();
                                                      }}
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
                                                ),
                                              }}
                                            />
                                          </div>
                                        )}
                                      />
                                    </div>
                                  </div>
                                  <div className="col-md-4 unit">
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
                                        {dataEstado.length < 1 ? (
                                          <option value="none">Estados</option>
                                        ) : (
                                            dataEstado.map((estado) => (
                                              <option value={estado.m_nIdEstado}>
                                                {estado.m_sEstado}
                                              </option>
                                            ))
                                          )}
                                      </select>
                                      <i></i>
                                    </label>
                                  </div>
                                </div>

                                <div class="row">
                                  <div class="col-md-4 unit">
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
                                  <div class="col-md-4 unit">
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
                                  <div className="col-md-4 unit">
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
                                </div>

                                <div class="row">
                                  <div className="col-md-4 unit">
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
                                  <div class="col-md-4 unit">
                                    {" "}
                                    <label className="label">
                                      Núm. Exterior
                                    </label>
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
                                  <div class="col-md-4 unit">
                                    <label className="label">
                                      Núm. Interior
                                    </label>
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

                                <div class="row">
                                  <div className="col-md-4 ">
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
                                  <div class="col-md-4 unit">
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
                                  <div class="col-md-4 unit">
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
                                  <div
                                    className="form-footer"
                                    className="col-md-12"
                                  >
                                    <button
                                      data-layout="topCenter"
                                      data-type="information"
                                      className="btn btn-secondary secondary-btn"
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
