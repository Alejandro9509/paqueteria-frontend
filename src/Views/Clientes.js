import logo from "../logo.svg";
import "../App.css";

import React, { useEffect, useState, setData, useMemo, Component } from "react";

import axios from "axios";

import Cabecera from "../Components/Template/Cabecera";
import BarraLateralIzquierda from "../Components/Template/BarraLateralIzquierda";
import BarraLateralDerecha from "../Components/Template/BarraLateralDerecha";
import { useTable, useFilters, useSortBy } from "react-table";
import ExportPDF from "../Components/Template/ExportPDF";
import TextField from "@material-ui/core/TextField";
import Autocomplete from "@material-ui/lab/Autocomplete";
import $ from "jquery";
import { remove_array_element } from "../Util/Util";
import SvgIcon from "@material-ui/core/SvgIcon";
import { ReactComponent as Activo } from '../iconos/Menu/palomita.svg';
import { ReactComponent as NoActivo } from '../iconos/Menu/cruz.svg';
import { makeStyles } from "@material-ui/core/styles";
import { DataGrid, GridToolbarExport, GridToolbarContainer } from '@material-ui/data-grid';
import { dataGridLocaleText } from '../Constants/index'
import Noty from 'noty';



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

window.jQuery = window.$ = $;
const headers = {
  "Content-Type": "application/json",
};

function Clientes(props) {
  const headers = {
    "Content-Type": "application/json",
  };

  const headers2 = {
    "Content-Type": "application/json",
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  };
  const classes = useStyles();

  const columns = React.useMemo(() => [
    {
      headerName: "Acciones",
      field: "",
      renderCell: (row) => {
        return (
          <div>
            <a href="#Agregar" role="tab" data-toggle="tab" onClick={() => (handleShowModificar(row.row.m_nIdCliente))} className="btn btn-default btn-xs"><i className="fa fa-pencil-square-o" style={{ color: "#F9A03E" }} /></a>
            <a href="#Agregar" role="tab" data-toggle="tab" className="btn btn-default btn-xs" onClick={() => (handleShowModificar(row.row.m_nIdCliente))}><i className="fa fa-eye" style={{ color: "#F9A03E" }} /></a>
            <a href="#" className="btn btn-default btn-xs" onClick={() => (handleEliminar(row.row.m_nIdCliente))}><i className="zmdi zmdi-delete" style={{ color: "#F30B0B" }} /></a>
          </div>
        )
      }
    },
    {
      headerName: "Núm. Cliente",
      field: "m_nNumeroCliente",
      width: 150,
    },
    {
      headerName: "Tipo Cliente",
      field: "m_nTipoCliente",
      width: 125,
    },
    {
      headerName: "RFC",
      field: "m_sRFC",
      width: 150,
    },
    {
      headerName: "Nombre",
      field: "m_sNombreFiscal",
      width: 200,
    },
    {
      headerName: "Nombre Corto",
      field: "m_sNombreCorto",
      width: 200,
    },
    {
      headerName: "Nombre Sucursal",
      field: "m_sNombreSucursal",
      width: 200,
    },
    {
      headerName: "Activo",
      field: "m_bActivo",
      width: 125,
      renderCell: (row) => {
        return (
          <div style={{ width: "100%", textAlign: "center", color: row.row.m_bActivo ? "green" : "red" }}>
            {row.row.m_bActivo ?
              <SvgIcon
                component={Activo}
              /> :
              <SvgIcon
                component={NoActivo}
              />
            }
          </div>
        )
      },
    }
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

  const locale = {
    toolbarExport: 'Exportar',
    toolbarExportLabel: 'Exportar',
    toolbarExportCSV: 'Descargar como CSV',

    // Columns panel text
    columnsPanelTextFieldLabel: 'Buscar columna',
    columnsPanelTextFieldPlaceholder: 'Columna title',
    columnsPanelDragIconLabel: 'Reorder columna',
    columnsPanelShowAllButton: 'Mostrar todo',
    columnsPanelHideAllButton: 'Ocultar todo',
  }

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
                      <input
                        onChange={handleChangeFormatoSelectCheckboxChange}
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
      <div className="" style={{ height: state.height - 270 }}>
        <div className="" >
          <table className="table tabla-listado" {...getTableProps()}>
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
                  <tr {...row.getRowProps()}
                    onClick={handleSelectRow.bind(this, row.original.m_nIdCliente)}
                    className={state.idCliente === row.original.m_nIdCliente ? classes.seleccionado : classes.noSeleccionado}>
                    <td>
                      <div>
                        <a
                          href="#Agregar"
                          role="tab"
                          data-toggle="tab"
                          onClick={() =>
                            handleShowModificar(row.original.m_nIdCliente)
                          }
                          className="btn btn-default  btn-sm"
                        >
                          <i className="fa fa-pencil-square-o" style={{ color: "#F9A03E" }} />
                        </a>
                        <a
                          href="#Agregar"
                          role="tab"
                          data-toggle="tab"
                          className="btn btn-default btn-sm"
                          onClick={() => handleShowModificar(row.original.m_nIdCliente)}
                        >
                          <i className="fa fa-eye" style={{ color: "#F9A03E" }} />
                        </a>
                        <a
                          href="#"
                          className="btn btn-default btn-sm"
                          onClick={() => handleEliminar(row.original.m_nIdCliente)}
                        >
                          <i className="zmdi zmdi-delete" style={{ color: "#F30B0B" }} />
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
      </div>
    );
  }

  const [dataPais, setDataPais] = React.useState([]);
  const [dataEstado, setDataEstado] = React.useState([]);
  const [dataImpuesto, setDataImpuesto] = React.useState([]);
  const [dataGrupoClientes, setDataGrupoClientes] = React.useState([]);
  const [dataSucursales, setDataSucursales] = React.useState([]);
  const [dataFormatos, setDataFormatos] = React.useState([]);
  const [selectedRows, setSelectedRows] = React.useState([]);
  const [dataListadoClientes, setDataListadoClientes] = React.useState([]);
  const [state, setState] = React.useState({
    CreadoPor: localStorage.getItem("UsuarioId"),
    ModificadoPor: localStorage.getItem("UsuarioId"),
    agregar: "Agregar",
    idCliente: 0,
    numeroCliente: 0,
    tipoCliente: 0,
    rfc: "",
    activo: false,
    operadorLogistico: false,
    nombreFiscal: "",
    nombreCorto: "",
    idSucursal: 0,
    DerechoBorrar: 45,
    idMoneda: 0,
    idImpuestoTransladado: 0,
    aplicarDetalleMaterialesCadaViajeXML: false,
    aplicarDetalleConceptoCadaViajeXML: false,
    idEstado: 0,
    idGrupoCliente: {},
    metodoPago: "",
    diasCredito: 0,
    creadoPor: localStorage.getItem("UsuarioId"),
    creadoEl: "",
    modificadoPor: localStorage.getItem("UsuarioId"),
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
    frecuenciaEnvioDias: 0,
    enviarApartir: "",
    fechaEnvioCorreo: "",
    envioAutomaticoSeguimiento: "",
    excluirNodo: 0,
    idUSOCFDI: "",
    agruparCantidadPorConcepto: "",
    ajustarImporte2Dec: "",
    detalleMateriales: "",

    formatoSelect: false,
    height: window.innerHeight,
    contactoNombre:"",
    contactoCorreo:"",
    contactoTelefono:"",
    RecibirFactura:0,
    RecibirEstadoCuenta:0,
    PermitirSeguimiento:0,
    UsoServicioWeb:0,
    PermitirVerPortal:0,
    RecibirCartaPorte:0,
    
    contactos: [
      {
        m_sNombre: "",
        m_sCorreo: "",
        m_sTelefono: "",
        m_bRecibirFactura:0,
        m_bRecibirEstadoCuenta:0,
        m_bPermitirSeguimiento:0,
        m_bUsoServicioWeb:0,
        m_bPermitirVerPortal:0,
        m_bRecibirCartaPorte:0


      
      }],
  });

  function handleShowAgregar() {
    setState({
      ...state,
    });
  }

  function handleShowModificar(id) {
    const url = `${process.env.REACT_APP_API_URL_LOCAL_L}/Clientes/GetById/` + id;
    axios.get(url, { headers }).then((respuesta) => {
      console.log(respuesta.data);
      setState({
        ...state,
      });
    });
  }

  useEffect((value) => {
    if (localStorage.getItem("UsuarioId") === null || localStorage.getItem("UsuarioId") <= 0) {
      showSuccess("Es necesario iniciar sesion para acceder a este proceso");
      window.location.replace("login");
      return;
    }
    getAllSucursales();
    getAllPaises();
    getAllImpuestos();
    getAllGrupoClientes();
    getAllClientes();
    getAllFormatos();
  }, []);

  function getAllGrupoClientes() {
    const url = `${process.env.REACT_APP_API_URL_LOCAL}/GruposClientes/GetListado`;
    axios.get(url, { headers }).then((respuesta) => {
      console.log(respuesta);

      setDataGrupoClientes(respuesta.data);
    });
  }
  function getAllFormatos() {
    const url = `${process.env.REACT_APP_API_URL_LOCAL}/Formato/GetListado`;
    axios.get(url, { headers }).then((respuesta) => {
      console.log(respuesta);

      setDataFormatos(respuesta.data);
    });
  }

  function getAllClientes() {
    const url = `${process.env.REACT_APP_API_URL_LOCAL}/Clientes/GetListado`;
    axios.get(url, { headers }).then((respuesta) => {
      console.log(respuesta);

      setDataListadoClientes(respuesta.data);
    });
  }

  function getAllPaises() {
    const url = `${process.env.REACT_APP_API_URL_LOCAL}/Pais/GetListado`;
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
    const url = `${process.env.REACT_APP_API_URL_LOCAL}/Estados/ByPais/` + id;
    axios.get(url, { headers }).then((respuesta) => {
      console.log(respuesta.data);
      setDataEstado(respuesta.data);
    });
    console.log(dataEstado);
  }

  function getAllImpuestos() {
    const url = `${process.env.REACT_APP_API_URL_LOCAL}/Impuestos/GetListado`;
    axios.get(url, { headers }).then((respuesta) => {
      console.log(respuesta.data);
      setDataImpuesto(respuesta.data);
    });
    console.log(dataImpuesto);
  }

  function getAllSucursales() {
    const url = `${process.env.REACT_APP_API_URL_LOCAL}/Sucursales/GetListado`;
    axios.get(url, { headers }).then((respuesta) => {
      setDataSucursales(respuesta.data);
    });
  }

  function getAllGruposClientes() {
    const url = `${process.env.REACT_APP_API_URL_LOCAL}/GrupoUnidad/GetListado`;
    axios.get(url, { headers }).then((respuesta) => { });
  }

  const handleChangeActivoCheckboxChange = (event) => {
    setState({
      ...state,
      activo: !state.activo,
    });
    console.log(event.target.name + " " + state.activo);
  };

  const handleChangeAplicarConcepto= (event) => {
    setState({
      ...state,
      aplicarDetalleConceptoCadaViajeXML: !state.aplicarDetalleConceptoCadaViajeXML,
    });
    console.log(event.target.name + " " + state.aplicarDetalleConceptoCadaViajeXML);
  };

  const handleChangeEnvioAutoSeguimientoViajes = (event) => {
    setState({
      ...state,
      envioAutomaticoSeguimiento: !state.envioAutomaticoSeguimiento,
    });
    console.log(event.target.name + " " + state.envioAutomaticoSeguimiento);
  };

  const handleChangeRecibirFactura = (event) => {
    setState({
      ...state,
      RecibirFactura: !state.RecibirFactura,
    });
    console.log(event.target.name + " " + state.RecibirFactura);
  };
  const handleChangeRecibirEstadoCuenta = (event) => {
    setState({
      ...state,
      activo: !state.RecibirEstadoCuenta,
    });
    console.log(event.target.name + " " + state.RecibirEstadoCuenta);
  };

  const handleChangePermitirSeguimiento = (event) => {
    setState({
      ...state,
      PermitirSeguimiento: !state.PermitirSeguimiento,
    });
    console.log(event.target.name + " " + state.PermitirSeguimiento);
  };
  const handleChangeUsoServicioWeb = (event) => {
    setState({
      ...state,
      UsoServicioWeb: !state.UsoServicioWeb,
    });
    console.log(event.target.name + " " + state.UsoServicioWeb);
  };
  const handlechangePermitirVerPortal = (event) => {
    setState({
      ...state,
      PermitirVerPortal: !state.PermitirVerPortal,
    });
    console.log(event.target.name + " " + state.PermitirVerPortal);
  };

  const HandleChangePermitirRecibirCartaPorte = (event) => {
    setState({
      ...state,
      RecibirCartaPorte: !state.RecibirCartaPorte,
    });
    console.log(event.target.name + " " + state.RecibirCartaPorte);
  };



  const handleChangeFormatoSelectCheckboxChange = (event) => {
    setState({
      ...state,
      formatoSelect: !state.formatoSelect,
    });
    console.log(event.target.name + " " + state.activo);
  };

 
  const handleChangeExcluirNodo= (event) => {
    console.log(event.target.name + " " + state.excluirNodo);
    setState({
      ...state,
      excluirNodo: !state.excluirNodo,
    });
  };

  const handleChangeOperadorLogistico= (event) => {
    console.log(event.target.name + " " + state.operadorLogistico);
    setState({
      ...state,
      operadorLogistico: !state.operadorLogistico,
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
    var derecho;
    const urlDelete = `${process.env.REACT_APP_API_URL_LOCAL}/Utilerias/ValidaDerechos/${state.creadoPor}/${state.DerechoBorrar}/3`;
    axios.get(urlDelete, { headers }).then(respuesta => {
      //showSuccess(respuesta.data)

      derecho = respuesta.data;
      if (derecho == false) {
        showSuccess("El usuario no tiene derechos para realizar el proceso");
        return;
      }

      const url = `${process.env.REACT_APP_API_URL_LOCAL}/Clientes/Eliminar/` + id;
      axios
        .delete(url, { headers })
        .then((respuesta) => {
          showSuccess(respuesta);
          getAllClientes();
        })
        .catch((err) => {
          console.log(err)
          showSuccess(JSON.stringify(err));
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

  const handleChangeCodigo = (event) => {
    const url =
      `${process.env.REACT_APP_API_URL_LOCAL}/Unidades/ValidaCodigoUnidad/` +
      state.codigo;
    axios
      .get(url, { headers })
      .then((respuesta) => {
        if (respuesta.data != "") {
          showSuccess(respuesta.data.m_sMensaje);
          console.log(respuesta.data);
          setState({
            ...state,

            codigo: respuesta.data.m_nNumero,
          });
        }
      })

      .catch((err) => {
        showSuccess(err);
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

  function handleSelectRow(id, event) {
    setState({
      ...state,
      idCliente: id
    });
  }


  const handleAceptar = (e) => {
    e.preventDefault();
    var params = {
      m_nCreadoPor: state.CreadoPor,
      m_nModificadoPor:state.ModificadoPor,
      m_nNumeroCliente:state.numeroCliente,
      m_nTipoCliente:state.tipoCliente,
      m_sRFC:state.rfc,
      m_bActivo:state.activo,
      m_bOperadorLogistico:state.operadorLogistico,
      m_sNombreFiscal:state.nombreFiscal,
      m_sNombreCorto:state.nombreCorto,
      m_nIdSucursal:state.idSucursal,
      m_nIdMoneda:state.idMoneda,
      m_nIdImpuestoTransladado:state.idImpuestoTransladado,
      m_bAplicarDetalleMaterialesCadaViajeXML:state.aplicarDetalleConceptoCadaViajeXML,
      m_nIdEstado:state.idEstado,
      m_nIdGrupoCliente:state.idGrupoCliente.m_nIdGrupoCliente,
      m_sMetodoPago:state.metodoPago,
      m_nDiasCredito:state.diasCredito,
      m_cyCredito:state.credito,
      m_cyCreditoDLLS:state.creditoDlls,
      m_cySaldoCredito:state.saldoCredito,
      m_cySaldoCreditoDLLS:state.saldoCreditoDLLS,
      m_cyPendFacturar:state.pendFacturar,
      m_cyPendFacturarDLLS:state.pendFacturarDLLS,
      m_sBancoOrdenante:state.bancoOrdenante,
      m_sRFCBancoOrdenante:state.rfcBancoOrdenante,
      m_sNoCuentaBancoOrdenante:state.cuentaBancoOrdenante,
      m_sCodigoPostal:state.codigoPostal,
      m_nIdEstado:state.idEstado,
      m_sMunicipio:state.municipio,
      m_sLocalidad:state.localidad,
      m_sColonia:state.colonia,
      m_sCalle:state.calle,
      m_sNoExterior:state.numeroExterior,
      m_sNoInterior:state.numeroInterior,
      m_sTelefono:state.telefono,
      m_sCelular:state.celular,
      m_sNextel:state.nextel,
      m_sCorreoElectronico:state.correoElectronico,
      m_sTableFormatos:state.tableformatos,
     // m_dtEnvioAutomaticoSeguimientoViajesFechaHoraInicio:state.m_dtEnvioAutomaticoSeguimientoViajesFechaHoraInicio,
      m_nEnvioCorreoDias:state.frecuenciaEnvioDias,
      m_sFechaEnvioCorreoApartir:state.fechaEnvioCorreo,
      m_bEnvioAutomaticoSeguimientoViajesActivar:state.envioAutomaticoSeguimiento,
      m_bExcluirNodoCondicionesPagoXML:state.excluirNodo,
      m_sIdUsoCFDI:state.idUSOCFDI,
      m_bPermitirAgruparCantidadPorConcepto:state.m_bPermitirAgruparCantidadPorConcepto,
      m_bAjustarImportes2DecimalesXML:state.ajustarImporte2Dec,
      m_bAplicarDetalleMaterialesCadaViajeXML:state.aplicarDetalleMaterialesCadaViajeXML,
      m_sContactoNombre: state.contactoNombre,
      m_sContactoCorreo:state.contactoCorreo,
      m_sContactoTelefono:state.contactoTelefono,
      m_bRecibirFactura:state.RecibirFactura,
      m_bRecibirEstadoCuenta:state.RecibirEstadoCuenta,
      m_bPermitirSeguimiento:state.PermitirSeguimiento,
      m_bUsoServicioWeb:state.UsoServicioWeb,
      m_bPermitirVerPortal:state.m_bPermitirVerPortal,
      m_bRecibirCartaPorte:state.RecibirCartaPorte,
      
      agregar: "Agregar",
      importar: "",
    };
    console.log(JSON.stringify(params));
    debugger;
    if (state.idCliente != 0) {
      const url =
        `${process.env.REACT_APP_API_URL_LOCAL}/Clientes/Modificar/` + state.idCliente;
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
      const url = `${process.env.REACT_APP_API_URL_LOCAL}/Clientes/Agregar`;
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

  function CustomToolbar() {
    return (
      <GridToolbarContainer>
        <GridToolbarExport />
      </GridToolbarContainer>
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
                <h2>Clientes</h2>
              </div>
              <div className="col-md-6 col-sm-6">
                <ul className="list-page-breadcrumb">
                  <li>
                    <a href="/Catalogos" className="color-mapeo">
                      Catálogos <i className="zmdi zmdi-chevron-right" />
                    </a>
                  </li>
                  <li className="active-page">Clientes</li>
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
              <a data-toggle="tab" href="#Imprimir" onClick={console.log(selectedRows)}>
                <i className="fa fa-plus-circle" /> Imprimir
              </a>
            </li>
            <li>
              <ExportPDF data={dataListadoClientes} column={columns} fileName="Unidades" />
            </li>
          </ul>

          <div className="tab-content">
            <div id="Listado" className="tab-pane fade in active">
              <div className="widget-wrap">
                <div className="widget-content">
                  <div className="row" style={{ height: state.height - 250, width: '100%' }}>
                    {dataListadoClientes.length != 0 ? (
                      <DataGrid
                        localeText={dataGridLocaleText}
                        rows={dataListadoClientes}
                        columns={columns}
                        density="compact"
                        pageSize={Math.floor((state.height - 310) / 30)}
                        getRowId={(row) => row.m_nIdCliente}
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
              <div className="widget-wrap">
                <div className="widget-content">
                  <div className="row" style={{ height: state.height - 250, width: '100%' }}>
                    {dataListadoClientes.length != 0 ? (
                      <DataGrid
                        components={{
                          Toolbar: CustomToolbar
                        }}
                        localeText={dataGridLocaleText}
                        rows={dataListadoClientes}
                        columns={columns}
                        density="compact"
                        checkboxSelection={true}
                        pageSize={Math.floor((state.height - 310) / 30)}
                        getRowId={(row) => row.m_nIdCliente}
                        onSelectionModelChange={(newSelection) => {
                          console.log(newSelection)
                          setSelectedRows(newSelection.rows);
                        }}
                      />
                    ) : (
                      <div>No se encontró ningún registro</div>
                    )}
                  </div>

                </div>
              </div>

            </div>

            <div id="Agregar" className="tab-pane fade">
              <form className="j-forms" onSubmit={handleAceptar}>
                {/*Inicio de ejemplo*/}
                <div className="form-content">
                  {/* start steps */}
                  <div
                    className="wizard-breadcrumb number-style"
                    style={{
                      position: "sticky",
                      top: "150px",
                      padding: "5px",
                      backgroundColor: "white",
                      zIndex: 100,
                      marginBottom: "10px",
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

                  <div className="widget-wrap" id="infogral">
                    <div className="widget-header block-header margin-bottom-0 clearfix">
                      <h3>Información General</h3>
                    </div>
                    <div className="widget-container">
                      <div className="widget-content">

                        <div className="row">
                          <div className="col-md-12">
                            <div className="form-content">
                              <div className="col-sm-4 col-md-2-5 unit">
                                <label className="label">Número de Cliente</label>
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
                              <div className="col-sm-4 col-md-2-5 unit">
                                <label className="label">
                                  RFC
                                  </label>
                                <div className="input">
                                  <input
                                    onChange={handleChange}
                                    className="form-control"
                                    type="text"
                                    pattern="[A-Z&Ñ]{3,4}[0-9]{2}(0[1-9]|1[012])(0[1-9]|[12][0-9]|3[01])[A-Z0-9]{2}[0-9A]"
                                    title="Favor de introducir un RFC válido."
                                    required
                                   value={state.rfc}
                                    id="rfc"
                                    name="rfc"
                                  />
                                </div>
                              </div>
                              <div className="col-sm-4 col-md-2-5 unit">
                                <label className="label">Nombre Fiscal</label>
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
                                <label className="label">Nombre Corto</label>
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
                                <label className="label">Tipo de Cliente</label>
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
                                    <option value="">Tipo de Cliente</option>
                                    <option value="1">Nacional</option>
                                    <option value="2">Extranjero</option>
                                  </select>
                                  <i></i>
                                </label>
                              </div>

                              <div className="col-sm-4 col-md-2-5 unit">
                                <label className="label">&nbsp; </label>
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
                                    <option value="">Sucursal</option>

                                    {dataSucursales.map((sucursal) => (
                                      <option value={sucursal.m_nIdSucursal}>
                                        {sucursal.m_sSucursal}
                                      </option>
                                    ))}
                                  </select>
                                  <i></i>
                                </label>
                              </div>
                              <div className="col-sm-4 col-md-2-5  unit">
                                <label className="label">&nbsp; </label>
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
                                    <option value="">Moneda</option>
                                    <option value="1">Pesos</option>
                                    <option value="2">Dolares</option>
                                  </select>
                                  <i></i>
                                </label>
                              </div>
                              <div className="col-sm-4 col-md-2-5 unit">
                                <label className="label">&nbsp; </label>
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

                                    {dataImpuesto.map((impuesto) => (
                                      <option value={impuesto.m_nIdImpuesto}>
                                        {impuesto.m_sImpuesto}
                                      </option>
                                    ))}
                                  </select>
                                  <i></i>
                                </label>
                              </div>
                              <div className="col-sm-4 col-md-2-5 unit">
                                <label className="label">Grupo</label>
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
                                  getOptionLabel={(option) => option.m_sGrupo}
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


                            </div>
                          </div>
                        </div>
                        <div className="unit">
                          <div className="inline-group">
                            <label className="checkbox">
                              <input
                                onChange={handleChangeActivoCheckboxChange}
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
                                onChange={handleChangeOperadorLogistico}
                                native
                                name="operadorLogistico"
                                type="checkbox"
                                id="operadorLogistico"
                                value={state.operadorLogistico}
                              />
                              <i />
                                  Operador Lógistico
                                </label>

                            <label className="label">{ }</label>
                            <label className="checkbox">
                              <input
                                onChange={handleChangeActivoCheckboxChange}
                                native
                                name="aplicarDetalleMaterialesCadaViajeXML"
                                type="checkbox"
                                value={
                                  state.aplicarDetalleMaterialesCadaViajeXML
                                }
                                id="aplicarDetalleMaterialesCadaViajeXML"
                              />
                              <i />
                                  Aplicar en el XML de factura, el detalle por
                                  Viaje
                                </label>
                          </div>
                        </div>





                      </div>
                    </div>
                  </div>
                  {/*Fin de ejemplo*/}

                  <div className="widget-wrap" id="caracteristicas">
                    <div className="widget-header block-header margin-bottom-0 clearfix">
                      <h3>Información Monetaria</h3>
                    </div>
                    <div className="widget-container">
                      <div className="widget-content">
                        <div className="row">
                          <div className="col-sm-12 col-md-8">
                            <div className="w-section-header ">
                              <h4>Metodos de Pago y Crédito</h4>
                            </div>
                            <div className="form-content">
                              {/* start text password */}
                              <div className="row">
                                <div className="col-sm-6 col-md-4 unit">
                                  <label className="label">Forma de pago</label>
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
                                      <option value="2">Efectivo</option>
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
                                      required
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
                              <h4>Información Adicional del Pago</h4>
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
                                  <label className="label">RFC</label>
                                  <div className="input">
                                    <input
                                      onChange={handleChange}
                                      className="form-control"
                                      type="text"
                                      value={state.rfcBancoOrdenante}
                                      pattern="[A-Z&Ñ]{3,4}[0-9]{2}(0[1-9]|1[012])(0[1-9]|[12][0-9]|3[01])[A-Z0-9]{2}[0-9A]"
                                      title="Favor de introducir un RFC válido."
                                      id="rfcBancoOrdenante"
                                      name="rfcBancoOrdenante"
                                    />
                                  </div>
                                </div>
                              </div>
                              <div className="row">
                                <div className="col-xs-6 col-ms-6 col-md-10 unit">
                                  <label className="label">Núm. Cuenta</label>
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

                  <div className="widget-wrap" id="detalles">
                    <div className="widget-header block-header margin-bottom-0 clearfix">
                      <h3>Datos generales</h3>
                    </div>
                    <div className="widget-container">
                      <div className="widget-content">
                        <div className="row">
                          <div className="col-md-12">
                            <ul className="nav nav-tabs">
                              <li className="active">
                                <a data-toggle="tab" href="#Domicilio">
                                  Domicilio
                                </a>
                              </li>
                              <li>
                                <a data-toggle="tab" href="#Formatos">
                                  Formatos
                                </a>
                              </li>
                              <li>
                                <a data-toggle="tab" href="#Especiales">
                                  Procesos Especiales
                                </a>
                              </li>
                              <li>
                                <a data-toggle="tab" href="#Adicional">
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
                                                    value={state.idPais}
                                                    id="idPais"
                                                    name="idPais"
                                                  >
                                                    <option value="">
                                                      Pais
                                                    </option>
                                                    {dataPais.map((pais) => (
                                                      <option
                                                        value={pais.m_nIdPais}
                                                      >
                                                        {pais.m_sPais}
                                                      </option>
                                                    ))}
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
                                                    onChange={handleChange}
                                                    className="form-control"
                                                    type="text"
                                                    placeholder=""
                                                    value={state.codigoPostal}
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
                                                    onChange={handleChange}
                                                    className="form-control"
                                                    required
                                                    native
                                                    name="idEstado"
                                                    value={state.idEstado}
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
                                                          {estado.m_sEstado}
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
                                                      onChange={handleChange}
                                                      className="form-control"
                                                      type="text"
                                                      placeholder=""
                                                      value={state.municipio}
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
                                                      onChange={handleChange}
                                                      className="form-control"
                                                      type="text"
                                                      placeholder=""
                                                      value={state.localidad}
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
                                                    onChange={handleChange}
                                                    className="form-control"
                                                    type="text"
                                                    placeholder=""
                                                    value={state.colonia}
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
                                                    onChange={handleChange}
                                                    className="form-control"
                                                    type="text"
                                                    placeholder=""
                                                    value={state.calle}
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
                                                      onChange={handleChange}
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
                                                      onChange={handleChange}
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
                                                      onChange={handleChange}
                                                      className="form-control"
                                                      type="text"
                                                      placeholder=""
                                                      value={state.telefono}
                                                      id="telefono"
                                                      name="telefono"
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
                                                      onChange={handleChange}
                                                      className="form-control"
                                                      type="text"
                                                      placeholder=""
                                                      value={state.celular}
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
                                                      onChange={handleChange}
                                                      className="form-control"
                                                      type="text"
                                                      placeholder=""
                                                      value={state.nextel}
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
                                                      onChange={handleChange}
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
                                              <TableFormatos
                                                columns={columns2}
                                                data={dataFormatos}
                                              />
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
                                                Envio de Estados de Cuentas
                                              </h3>
                                            </div>
                                            <div className="row">
                                              <div className="col-md-2-5">
                                                <label className="label">
                                                  Frecuencia de Envio (Dias)
                                                </label>
                                                <div className="input">
                                                  <div className="input">
                                                    <input
                                                      onChange={handleChange}
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
                                                      onChange={handleChange}
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
                                                  name="envioAutomaticoSeguimiento"
                                                  type="checkbox"
                                                  value={
                                                    state.envioAutomaticoSeguimiento
                                                  }
                                                  id="envioAutomaticoSeguimiento"
                                                />
                                                <i />
                                                Envio Automático de Seguimiento
                                                de Viajes
                                              </label>
                                            </div>
                                          </div>
                                          <div className="unit">
                                            <div className="inline-group">
                                              <label className="checkbox">
                                                <input
                                                  onChange={
                                                    handleChangeExcluirNodo
                                                  }
                                                  native
                                                  name="excluirNodo"
                                                  type="checkbox"
                                                  id="excluirNodo"
                                                  value={state.excluirNodo}
                                                />
                                                <i />
                                                Excluir Nodo Condiciones de Pago
                                                en el XML
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
                                                  onChange={handleChange}
                                                  className="form-control"
                                                  required
                                                  native
                                                  name="idUSOCFDI"
                                                  value={state.idUSOCFDI}
                                                  id="idUSOCFDI"
                                                >
                                                  <option value="1">1. Adqusicion de mercancias</option>
                                                  <option value="2">2. Devoluciones, descuentos o bonificaciones </option>
                                                  <option value="3">3. Gastos en general </option>
                                                  <option value="4">4. Construcciones </option>
                                                  <option value="5">5. Mobiliario y equipo </option>

                                                </select>
                                                <i></i>
                                              </label>
                                            </div>

                                            <div className="unit">
                                              <div className="inline-group">
                                                <label className="label">
                                                  { }
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
                                                  Permitir agrupar la cantidad
                                                  de conceptos al facturar
                                                </label>
                                              </div>
                                            </div>

                                            <div className="unit">
                                              <div className="inline-group">
                                                <label className="label">
                                                  { }
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
                                                  Ajusta a 2 Decimales los
                                                  importes de los conceptos en
                                                  Facturacion por viaje
                                                </label>
                                              </div>
                                            </div>

                                            <div className="unit">
                                              <div className="inline-group">
                                                <label className="label">
                                                  { }
                                                </label>
                                                <label className="checkbox">
                                                  <input
                                                    onChange={
                                                      handleChangeAplicarConcepto
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
                                                  Aplicar en el XML de la
                                                  factura, el Detalle por
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

                  <div className="widget-wrap" id="otros">
                    <div className="widget-header block-header margin-bottom-0 clearfix">
                      <div className="pull-left">
                        <h3> Contacto</h3>
                      </div>
                    </div>
                    <div className="widget-container">
                      <div className="widget-content">
                        <div className="row">
                          <div className="col-md-12">
                            <div className="form-content">
                              {/* start text password */}
                              <div className="row">
                                <div className="col-sm-6 col-md-2-5 col-lg-2-5 unit">
                                  <label className="label">Contacto</label>
                                  <div className="input">
                                    <input
                                      onChange={handleChange}
                                      value={state.contactoNombre}
                                      name="contactoNombre"
                                      className="form-control"
                                      type="text"
                                      placeholder=""
                                      id="contactoNombre"
                                    />
                                  </div>
                                </div>
                                <div className="col-sm-6  col-md-6 col-lg-2  unit">
                                  <div className="inline-group">
                                    <label className="label">&nbsp; </label>
                                    <label className="checkbox">
                                      <input
                                        onChange={
                                          handleChangeRecibirFactura
                                        }
                                        native
                                        name="RecibirFactura"
                                        type="checkbox"
                                        value={state.RecibirFactura}
                                        id="RecibirFactura"
                                      />
                                      <i />
                                      Recibir factura
                                    </label>
                                  </div>
                                </div>
                              </div>
                              <div className="row">
                                <div className="col-sm-6 col-md-2-5 col-lg-2-5 unit">
                                  <label className="label">Correo</label>
                                  <div className="input">
                                    <input
                                      onChange={handleChange}
                                      value={state.contactoCorreo}
                                      name="contactoCorreo"
                                      className="form-control"
                                      type="email"
                                      placeholder=""
                                      id="contactoCorreo"
                                    />
                                  </div>
                                </div>
                                <div className="col-sm-6  col-md-6 col-lg-4  unit">
                                  <div className="inline-group">
                                    <label className="checkbox">
                                      <input
                                        onChange={
                                          handleChangeRecibirEstadoCuenta
                                        }
                                        native
                                        name="RecibirEstadoCuenta"
                                        type="checkbox"
                                        id="RecibirEstadoCuenta"
                                        value={state.RecibirEstadoCuenta}
                                      />
                                      <i />
                                      Recibir Edo de cuenta
                                    </label>
                                  </div>
                                </div>
                              </div>
                              <div className="row">
                                <div className="col-sm-6 col-md-2-5 col-lg-2-5 unit">
                                  <label className="label">Teléfono</label>
                                  <div className="input">
                                    <input
                                      onChange={handleChange}
                                      value={state.contactoTelefono}
                                      name="contactoTelefono"
                                      className="form-control"
                                      required
                                      type="text"
                                      placeholder=""
                                      id="contactoTelefono"
                                    />
                                  </div>
                                </div>
                                <div className="col-sm-6  col-md-6 col-lg-4  unit">
                                  <div className="inline-group">
                                    <label className="checkbox">
                                      <input
                                        onChange={
                                          handleChangePermitirSeguimiento
                                        }
                                        native
                                        name="PermitirSeguimiento"
                                        type="checkbox"
                                        id="PermitirSeguimiento"
                                        value={state.PermitirSeguimiento}
                                      />
                                      <i />
                                      Permitir Seguiiento de Viajes/Unidades
                                    </label>
                                  </div>
                                </div>
                              </div>
                              <div className="row">
                                <div className="col-sm-6 col-md-2-5 col-lg-2-5 unit"></div>
                                <div className="col-sm-6  col-md-6 col-lg-4  unit">
                                  <div className="inline-group">
                                    <label className="checkbox">
                                      <input
                                        onChange={
                                          handleChangeUsoServicioWeb
                                        }
                                        native
                                        name="rentada"
                                        type="checkbox"
                                        id="rentada"
                                        value={state.UsoServicioWeb}
                                      />
                                      <i />
                                      Uso de un servicio web
                                    </label>
                                  </div>
                                </div>
                              </div>
                              <div className="row">
                                <div className="col-sm-6 col-md-2-5 col-lg-2-5 unit"></div>
                                <div className="col-sm-6  col-md-6 col-lg-4  unit">
                                  <div className="inline-group">
                                    <label className="checkbox">
                                      <input
                                        onChange={
                                          handlechangePermitirVerPortal
                                        }
                                        native
                                        name="PermitirVerPortal"
                                        type="checkbox"
                                        id="PermitirVerPortal"
                                        value={state.PermitirVerPortal}
                                      />
                                      <i />
                                      Permitir ver Portal de Clientes
                                    </label>
                                  </div>
                                </div>
                              </div>

                              <div className="row">
                                <div className="col-sm-6 col-md-2-5 col-lg-2-5 unit"></div>
                                <div className="col-sm-6  col-md-6 col-lg-4  unit">
                                  <div className="inline-group">
                                    <label className="checkbox">
                                      <input
                                        onChange={
                                          handlechangePermitirVerPortal
                                        }
                                        native
                                        name="RecibirCartaPorte"
                                        type="checkbox"
                                        id="RecibirCartaPorte"
                                        value={state.RecibirCartaPorte}
                                      />
                                      <i />
                                      Recibir carta porte
                                    </label>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                          <div className="form-footer" className="col-md-12">
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

                {/*Fin de ejemplo*/}
              </form>
            </div>
          </div>
        </div>
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

export default Clientes;
