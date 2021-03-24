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
import { DataGrid } from '@material-ui/data-grid';

import $ from "jquery";
import { remove_array_element } from "../Util/Util";

import { SettingsEthernet } from "@material-ui/icons";
import { makeStyles } from "@material-ui/core/styles";


import Noty from 'noty';

function showSuccess(mensaje){
  new Noty({
    type:"information",
    layout:"topCenter",
    text: mensaje,
    timeout:"3000"
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

function Unidades(props) {
  const columns = React.useMemo(() => [
    {
      headerName: "Acciones",
      field: "",
      renderCell: (row) => {
        return (
          <div>
            <a href="#Agregar" role="tab" data-toggle="tab" onClick={() => (handleShowModificar(row.row.m_nIdUnidad))} className="btn btn-default btn-xs"><i className="fa fa-pencil-square-o" style={{ color: "#F9A03E" }} /></a>
            <a href="#Agregar" role="tab" data-toggle="tab" className="btn btn-default btn-xs" onClick={() => (handleShowModificar(row.row.m_nIdUnidad))}><i className="fa fa-eye" style={{ color: "#F9A03E" }} /></a>
            <a href="#" className="btn btn-default btn-xs" onClick={() => (handleEliminar(row.row.m_nIdUnidad))}><i className="zmdi zmdi-delete" style={{ color: "#F30B0B" }} /></a>
          </div>
        )
      }
    },
    {
      headerName: "Tipo de unidad",
      field: "m_sTipoUnidad",
      width: 150
    },
    {
      headerName: "Código",
      field: "m_sCodigo",
      width: 100
    },
    {
      headerName: "Descripción",
      field: "m_sDescripcion",
      width: 200
    },
    {
      headerName: "ID Satelital",
      field: "m_sIdentificadorSatelital",
      width: 150
    },
    {
      headerName: "Núm. Operador",
      field: "m_nNumeroOperador",
      width: 150
    },
    {
      headerName: "Operador",
      field: "m_sNombreOperador",
      width: 275
    },
    {
      headerName: "Placas",
      field: "m_sPlacas",
      width: 150
    },
    {
      headerName: "Vencimiento",
      field: "m_dtPlacasVencimiento",
      width: 200
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
                onClick={handleSelectRow.bind(this, row.original.m_nIdUnidad)}
                className={state.idUnidad === row.original.m_nIdUnidad ? classes.seleccionado : classes.noSeleccionado}>

                  <td>
                    <div>
                      <a
                        href="#Agregar"
                        role="tab"
                        data-toggle="tab"
                        onClick={() =>
                          handleShowModificar(row.original.m_nIdUnidad)
                        }
                        className="btn btn-default btn-sm"
                      >
                        <i className="fa fa-pencil-square-o"style={{color:"#F9A03E"}} />
                      </a>
                      <a
                        href="#Agregar"
                        role="tab"
                        data-toggle="tab"
                        onClick={() =>
                          handleShowModificar(row.original.m_nIdUnidad)
                        }
                        className="btn btn-default btn-sm"
                      >
                        <i className="fa fa-eye" style={{color:"#F9A03E"}} />
                      </a>
                      <a
                        href="#"
                        className="btn btn-default btn-sm"
                        onClick={() => handleEliminar(row.original.m_nIdUnidad)}
                      >
                        <i className="zmdi zmdi-delete" style={{color:"#F30B0B"}} />
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

  const classes = useStyles();
  const [dataOperador, setDataOperador] = React.useState([]);

  const [dataTiposUnidad, setDataTiposUnidad] = React.useState([]);
  const [dataSucursales, setDataSucursales] = React.useState([]);
  const [dataGruposUnidades, setDataGruposUnidades] = React.useState([]);
  const [dataListadoUnidades, setDataListadoUnidades] = React.useState([]);
  const [state, setState] = React.useState({
    agregar: "Agregar",
    idUnidad: 0,
    idTipoUnidad: 0,
    codigo: "",
    activo: false,
    rentada: false,
    esUnidadPermisionario: false,
    idSucursal: 0,
    idOperador: 0,
    descripcion: "",
    modelo: "",
    serieUnidad: "",
    colorUnidad: "",
    idSatelital: "",
    idConvoy: "",
    idGrupoUnidad: 0,
    creadoEl: "",
    creadoPor: localStorage.getItem("UsuarioId"),
    creadoEl: "",
    modificadoPor: localStorage.getItem("UsuarioId"),
    modificadoEl: "",
    largo: 0,
    ancho: 0,
    alto: 0,
    capacidad: 0,
    numeroEjes: 0,
    numeroLlanta: 0,
    llantaRefaccion: 0,
    tipoLlanta: 0,
    marcaLlanta: 0,
    modeloLlanta: 0,
    medidaLlanta: 0,
    serieMotor: "",
    tipoMotor: "",
    tipoTransmision: "",
    tipoCombustible: 0,
    capacidadTanqueGal: 0,
    rendimientoCargado: 0,
    rendimientoVacio: 0,
    tarjetaDiesel1: "",
    tarjetaDiesel2: "",
    tarjetaDiesel3: "",
    companiaSeguros1: "",
    telefono1: "",
    numeroSeguro1: "",
    vencimientoSeguro1: "",
    tipoCobertura1: 0,
    companiaSeguros: "",
    telefono: "",
    numeroSeguro: "",
    vencimientoSeguro: "",
    tipoCobertura: 0,
    paroMotor: false,
    tiempoParo: 0,
    placas: "",
    placasVencimiento: "",
    placasExtranjeras: "",
    placasExtranjerasVencimiento: "",
    placasDefault: 0,
    permisoSCT: "",
    verificacionVehicular: "",
    verificacionVehicularVencimiento: "",
    velocidadPromedio: 0,
    neutralizaciones: 0,
    frenadoBrusco: 0,
    cargaAceleracion: 0,
    accionamientoPedal: 0,
    velocidadMaximaMotor: 0,
    porcUltimoCambio: 0,
    velocidadPromedioUM: "",
    neutralizacionesUM: "",
    frenadoBruscoUM: "",
    cargaAceleracionUM: "",
    accionamientoPedalUM: "",
    velocidadMaximaMotorUM: "",
    porcUltimoCambioUM: "",
    tarjetaIAVE: "",
    horometro: 0,
    tarjetaEPASS: "",
    horasTrabajasMotor: 0,
    horasTrabajadasMotorNoGPS: 0,
    porcentajeRepIngresos: 0,
    odometro: 0,
    odometroGPSKMS: "",
    idPropietario: 0,
    tiempoParoStatus: "disabled",
    documentos: [
      {
        numDocumento: "",
        documento: "",
        fechaDocumento: "",
      },
    ],
    fotosDocs: [
      {
        descripcion: "",
        file: "",
      },
    ],
    height: window.innerHeight
  });

  function handleShowAgregar() {
    setState({
      ...state,
      agregar: "Agregar",
      idUnidad: 0,
      idTipoUnidad: 0,
      codigo: "",
      activo: false,
      rentada: false,
      esUnidadPermisionario: false,
      idSucursal: 0,
      idOperador: 0,
      descripcion: "",
      modelo: "",
      serieUnidad: "",
      colorUnidad: "",
      idSatelital: "",
      idConvoy: "",
      idGrupoUnidad: 0,
      creadoEl: "",
      
      creadoEl: "",
      modificadoEl: "",
      largo: 0,
      ancho: 0,
      alto: 0,
      capacidad: 0,
      numeroEjes: 0,
      numeroLlanta: 0,
      llantaRefaccion: 0,
      tipoLlanta: 0,
      marcaLlanta: 0,
      modeloLlanta: 0,
      medidaLlanta: 0,
      serieMotor: "",
      tipoMotor: "",
      tipoTransmision: "",
      tipoCombustible: 0,
      capacidadTanqueGal: 0,
      rendimientoCargado: 0,
      rendimientoVacio: 0,
      tarjetaDiesel1: "",
      tarjetaDiesel2: "",
      tarjetaDiesel3: "",
      companiaSeguros1: "",
      telefono1: "",
      numeroSeguro1: "",
      vencimientoSeguro1: "",
      tipoCobertura1: 0,
      companiaSeguros: "",
      telefono: "",
      numeroSeguro: "",
      vencimientoSeguro: "",
      tipoCobertura: 0,
      paroMotor: false,
      tiempoParo: 0,
      placas: "",
      placasVencimiento: "",
      placasExtranjeras: "",
      placasExtranjerasVencimiento: "",
      placasDefault: 0,
      permisoSCT: "",
      verificacionVehicular: "",
      verificacionVehicularVencimiento: "",
      velocidadPromedio: 0,
      neutralizaciones: 0,
      frenadoBrusco: 0,
      cargaAceleracion: 0,
      accionamientoPedal: 0,
      velocidadMaximaMotor: 0,
      porcUltimoCambio: 0,
      velocidadPromedioUM: "",
      neutralizacionesUM: "",
      frenadoBruscoUM: "",
      cargaAceleracionUM: "",
      accionamientoPedalUM: "",
      velocidadMaximaMotorUM: "",
      porcUltimoCambioUM: "",
      tarjetaIAVE: "",
      horometro: 0,
      tarjetaEPASS: "",
      horasTrabajasMotor: 0,
      horasTrabajadasMotorNoGPS: 0,
      porcentajeRepIngresos: 0,
      odometro: 0,
      odometroGPSKMS: "",
      idPropietario: 0,
      tiempoParoStatus: "disabled",
      documentos: [
        {
          numDocumento: "",
          documento: "",
          fechaDocumento: "",
        },
      ],
      fotosDocs: [
        {
          descripcion: "",
          file: "",
        },
      ],
    });
  }

  function handleShowModificar(id) {
    console.log(id);
    const url = `${process.env.REACT_APP_API_URL}/Unidad/GetById/` + id;
    axios.get(url, { headers }).then((respuesta) => {
      console.log(respuesta.data);
      setState({
        ...state,
        idUnidad: id,
        idTipoUnidad: respuesta.data.m_nIdTipoUnidad,
        codigo: respuesta.data.m_sCodigo,
        activo: respuesta.data.m_bActivo,
        rentada: respuesta.data.m_bRentada,
        esUnidadPermisionario: respuesta.data.m_bEsUnidadPermisionario,
        idSucursal: respuesta.data.m_nIdSucursal,
        idOperador: respuesta.data.m_nIdOperador,
        descripcion: respuesta.data.m_sDescripcion,
        modelo: respuesta.data.m_nModelo,
        serieUnidad: respuesta.data.m_sSerieUnidad,
        colorUnidad: respuesta.data.m_sColorUnidad,
        idSatelital: respuesta.data.m_sIdentificadorSatelital,
        idConvoy: respuesta.data.m_sIdentificadorConvoy,
        idGrupoUnidad: respuesta.data.m_nIdGrupoUnidad,
        largo: respuesta.data.Largo,
        ancho: respuesta.data.Ancho,
        alto: respuesta.data.Alto,
        capacidad: respuesta.data.m_nCapacidad,
        numeroEjes: respuesta.data.m_nNumeroEjes,
        numeroLlanta: respuesta.data.m_nNumeroLlanta,
        llantaRefaccion: respuesta.data.m_nLlantaRefaccion,
        tipoLlanta: respuesta.data.m_nIdTipoLlanta,
        marcaLlanta: respuesta.data.m_nIdMarcaLlanta,
        modeloLlanta: respuesta.data.m_nIdModeloLLanta,
        medidaLlanta: respuesta.data.m_nIdMedidaLlanta,
        serieMotor: respuesta.data.m_sSerieMotor,
        tipoMotor: respuesta.data.m_sTipoMotor,
        tipoTransmision: respuesta.data.m_sTipoTransmision,
        tipoCombustible: respuesta.data.m_nTipoCombustible,
        capacidadTanqueGal: respuesta.data.m_nCapacidadTanqueCombustibleGalones,
        rendimientoCargado: respuesta.data.RendimientoCargado,
        rendimientoVacio: respuesta.data.RendimientoVacio,
        tarjetaDiesel1: respuesta.data.m_sTarjetaDiesel1,
        tarjetaDiesel2: respuesta.data.m_sTarjetaDiesel2,
        tarjetaDiesel3: respuesta.data.m_sTarjetaDiesel3,
        companiaSeguros1: respuesta.data.m_sCompaniaSeguros1,
        telefono1: respuesta.data.m_sTelefonosCompaniaSeguros1,
        numeroSeguro1: respuesta.data.m_sNumeroSeguro1,
        vencimientoSeguro1: respuesta.data.m_dtVencimientoSeguro1,
        tipoCobertura1: respuesta.data.m_nTipoCoberturaSeguro1,
        companiaSeguros: respuesta.data.m_sCompaniaSeguros,
        telefono: respuesta.data.m_sTelefonosCompaniaSeguros,
        numeroSeguro: respuesta.data.m_sNumeroSeguro,
        vencimientoSeguro: respuesta.data.m_dtVencimientoSeguro,
        tipoCobertura: respuesta.data.m_nTipoCoberturaSeguro,
        paroMotor: respuesta.data.m_bParoDeMotorRelenti,
        tiempoParo: respuesta.data.m_nTiempoParo,
        placas: respuesta.data.m_sPlacas,
        placasVencimiento: respuesta.data.m_dtPlacasVencimiento,
        placasExtranjeras: respuesta.data.m_sPlacasExtranjeras,
        placasExtranjerasVencimiento:
          respuesta.data.m_dtPlacasExtranjerasVencimiento,
        placasDefault: respuesta.data.m_nPlacasDefault,
        permisoSCT: respuesta.data.m_sPermisoSCT,
        verificacionVehicular: respuesta.data.m_sVerificacionVehicular,
        verificacionVehicularVencimiento:
          respuesta.data.m_dtVerificacionVehicularVencimiento,
        velocidadPromedio: respuesta.data.VelocidadPromedio,
        neutralizaciones: respuesta.data.Neutralizaciones,
        frenadoBrusco: respuesta.data.FrenadosBrusco,
        cargaAceleracion: respuesta.data.CargaDeAceleracion,
        accionamientoPedal: respuesta.data.AccionamientoPedalFreno,
        velocidadMaximaMotor: respuesta.data.VelocidadMaximaMotor,
        porcUltimoCambio: respuesta.data.PorcUltimoCambio,
        velocidadPromedioUM: respuesta.data.m_sVelocidadPromedioUM,
        neutralizacionesUM: respuesta.data.m_sNeutralizacionesUM,
        frenadoBruscoUM: respuesta.data.m_sFrenadosBruscoUM,
        cargaAceleracionUM: respuesta.data.m_sCargaDeAceleracionUM,
        accionamientoPedalUM: respuesta.data.m_sAccionamientoPedalFrenoUM,
        velocidadMaximaMotorUM: respuesta.data.m_sVelocidadMaximaMotorUM,
        porcUltimoCambioUM: respuesta.data.m_sPorcUltimoCambioUM,
        tarjetaIAVE: respuesta.data.m_sTarjetaIAVE,
        horometro: respuesta.data.m_nHorometro,
        tarjetaEPASS: respuesta.data.m_sTarjetaEPASS,
        horasTrabajasMotor: respuesta.data.m_nHorasTrabajadasMotor,
        horasTrabajadasMotorNoGPS: respuesta.data.m_nHorasTrabajadasMotorNoGPS,
        porcentajeRepIngresos: respuesta.data.PorcentajeRepIngresos,
        odometro: respuesta.data.m_nOdometro,
        odometroGPSKMS: respuesta.data.OdometroGPSKMS,
        idPropietario: respuesta.data.m_nIdPropietarioEquipo,
      });
    });
  }

  useEffect((value) => {
    if (localStorage.getItem("UsuarioId") === null || localStorage.getItem("UsuarioId") <= 0)
    {
      showSuccess("Es necesario iniciar sesion para acceder a este proceso");
      window.location.replace("login");
      return;
    }
    getAllOperadores();
    getAllTipoUnidades();
    getAllSucursales();
    getAllGruposUnidades();
    getAllUnidades();
  }, []);

  function getAllUnidades() {
    const url = `${process.env.REACT_APP_API_URL}/Unidades/GetListado`;
    axios.get(url, { headers }).then((respuesta) => {
      console.log(respuesta);

      setDataListadoUnidades(respuesta.data);
    });
  }

  function getAllOperadores() {
    const url = `${process.env.REACT_APP_API_URL}/Operadores/GetListado`;
    axios.get(url, { headers }).then((respuesta) => {
      setDataOperador(respuesta.data);
    });
  }

  function getAllTipoUnidades() {
    const url = `${process.env.REACT_APP_API_URL}/TiposUnidades/GetListado`;
    axios.get(url, { headers }).then((respuesta) => {
      setDataTiposUnidad(respuesta.data);
    });
  }

  function getAllSucursales() {
    const url = `${process.env.REACT_APP_API_URL}/Sucursales/GetListado`;
    axios.get(url, { headers }).then((respuesta) => {
      setDataSucursales(respuesta.data);
    });
  }
  function getAllGruposUnidades() {
    const url = `${process.env.REACT_APP_API_URL}/GrupoUnidad/GetListado`;
    axios.get(url, { headers }).then((respuesta) => {
      setDataGruposUnidades(respuesta.data);
    });
  }

  const handleChangeActivoCheckboxChange = (event) => {
    setState({
      ...state,
      activo: !state.activo,
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
    //no esta el derecho de borrar en el listado original
    const url = `${process.env.REACT_APP_API_URL}/Unidad/Eliminar/` + id;
    axios
      .get(url, { headers })
      .then((respuesta) => {
        console.log(respuesta);
        getAllUnidades();
      })
      .catch((err) => {
        showSuccess(err);
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
      idUnidad: id
    });
  }

  const handleChangeCodigo = (event) => {
    const url =
      `${process.env.REACT_APP_API_URL}/Unidades/ValidaCodigoUnidad/` + state.codigo
    axios.get(url, { headers }).then((respuesta) => {

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

  const handleAceptar = (e) => {
    e.preventDefault();
    var params = {
      IdTipoUnidad: state.idTipoUnidad,
      Codigo: state.codigo,
      Activo: state.activo,
      Rentada: state.rentada,
      EsUnidadPermisionario: state.esUnidadPermisionario,
      IdSucursal: state.idSucursal,
      IdOperador: state.idOperador,
      Descripcion: state.descripcion,
      Modelo: state.modelo,
      SerieUnidad: state.serieUnidad,
      ColorUnidad: state.colorUnidad,
      IdentificadorSatelital: state.idSatelital,
      IdentificadorConvoy: state.idConvoy,
      IdGrupoUnidad: state.idGrupoUnidad,
      CreadoPor: state.creadoPor,
      CreadoEl: state.creadoEl,
      ModificadoPor: state.modificadoPor,
      ModificadoEl: state.modificadoEl,
      Largo: state.largo,
      Ancho: state.ancho,
      Alto: state.alto,
      Capacidad: state.capacidad,
      NumeroEjes: state.numeroEjes,
      NumeroLlanta: state.numeroLlanda,
      LlantaRefaccion: state.llantaRefaccion,
      IdTipoLlanta: state.tipoLlanta,
      IdMarcaLlanta: state.marcaLlanta,
      IdModeloLLanta: state.modeloLlanta,
      IdMedidaLlanta: state.medidaLlanta,
      SerieMotor: state.serieMotor,
      TipoMotor: state.tipoMotor,
      TipoTransmision: state.tipoTransmision,
      TipoCombustible: state.tipoCombustible,
      CapacidadTanqueCombustibleGalones: state.capacidadTanqueGal,
      RendimientoCargado: state.rendimientoCargado,
      RendimientoVacio: state.rendimientoVacio,
      TarjetaDiesel1: state.tarjetaDiesel1,
      TarjetaDiesel2: state.tarjetaDiesel2,
      TarjetaDiesel3: state.tarjetaDiesel3,
      CompaniaSeguros1: state.companiaSeguros1,
      TelefonosCompaniaSeguros1: state.telefono1,
      NumeroSeguro1: state.numeroSeguro1,
      VencimientoSeguro1: state.vencimientoSeguro1,
      TipoCoberturaSeguro1: state.tipoCobertura1,
      CompaniaSeguros: state.companiaSeguros,
      TelefonosCompaniaSeguros: state.telefono,
      NumeroSeguro: state.numeroSeguro,
      VencimientoSeguro: state.vencimientoSeguro,
      TipoCoberturaSeguro: state.tipoCobertura,
      ParoDeMotorRelenti: state.paroMotor,
      TiempoParo: state.tiempoParo,
      Placas: state.placas,
      PlacasVencimiento: state.placasVencimiento,
      PlacasExtranjeras: state.placasExtranjeras,
      PlacasExtranjerasVencimiento: state.placasExtranjerasVencimiento,
      PlacasDefault: state.placasDefault,
      PermisoSCT: state.permisoSCT,
      VerificacionVehicular: state.verificacionVehicular,
      VerificacionVehicularVencimiento: state.verificacionVehicularVencimiento,
      VelocidadPromedio: state.velocidadPromedio,
      Neutralizaciones: state.neutralizaciones,
      FrenadosBrusco: state.frenadoBrusco,
      CargaDeAceleracion: state.cargaAceleracion,
      AccionamientoPedalFreno: state.accionamientoPedal,
      VelocidadMaximaMotor: state.velocidadMaximaMotor,
      PorcUltimoCambio: state.porcUltimoCambio,
      VelocidadPromedioUM: state.velocidadPromedioUM,
      NeutralizacionesUM: state.neutralizacionesUM,
      FrenadosBruscoUM: state.frenadoBruscoUM,
      CargaDeAceleracionUM: state.cargaAceleracionUM,
      AccionamientoPedalFrenoUM: state.accionamientoPedalUM,
      VelocidadMaximaMotorUM: state.velocidadMaximaMotorUM,
      PorcUltimoCambioUM: state.porcUltimoCambioUM,
      TarjetaIAVE: state.tarjetaIAVE,
      Horometro: state.horometro,
      TarjetaEPASS: state.tarjetaEPASS,
      HorasTrabajadasMotorNoGPS: state.horasTrabajadasMotorNoGPS,
      HorasTrabajadasMotor: state.horasTrabajasMotor,
      PorcentajeRepIngresos: state.porcentajeRepIngresos,
      Odometro: state.odometro,
      OdometroGPSKMS: state.odometroGPSKMS,
      IdPropietarioEquipo: state.idPropietario,

      arrAdicionales: state.documentos,

      agregar: "Agregar",
      importar: "",
    };

    console.log(params);
    if (state.idUnidad != 0) {
      const url =
        `${process.env.REACT_APP_API_URL}/Unidad/Modificar/` + state.idUnidad;
      axios
        .put(url, Object.assign({}, params), { headers })

        .then((respuesta) => {
          showSuccess(respuesta.data);
          getAllUnidades();
        })
        .catch((err) => {
          console.log(err);
          showSuccess("err");
        });
    } else {
      const url = `${process.env.REACT_APP_API_URL}/Unidad/Agregar`;
      axios
        .post(url, Object.assign({}, params), { headers })
        .then((respuesta) => {
          showSuccess(respuesta.data);
          getAllUnidades();
          //window.location.reload();
        })
        .catch((err) => {
          console.log(err);
          showSuccess(err);
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
        $section = $("#combustible");

        break;
      case 4:
        setStepActive(4);
        $section = $("#seguros");
        break;
      case 5:
        setStepActive(5);
        $section = $("#paromotor");
        break;
      case 6:
        setStepActive(6);
        $section = $("#detalles");
        break;
      case 7:
        setStepActive(7);
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

  const framesDocumentos = state.documentos.map((p, index) => {
    return (
      <div className="j-row toclone-widget-right toclone">
        <div className="span2 unit">
          <div className="input">
            <input
              onChange={(event) => handleChangeDocumento(event, index)}
              name="numDocumento"
              className="form-control"
              type="text"
              placeholder="Número de Documento"
            />
          </div>
        </div>
        <div className="span3 unit">
          <div className="input">
            <input
              onChange={(event) => handleChangeDocumento(event, index)}
              name="documento"
              className="form-control"
              type="text"
              placeholder="Documento"
            />
          </div>
        </div>
        <div className="span2 unit">
          <div className="input">
            <input
              onChange={(event) => handleChangeDocumento(event, index)}
              name="fechaDocumento"
              className="form-control"
              type="datetime-local"
              placeholder="15/06/2020"
            />
          </div>
        </div>
        <div className="span2 unit">
          {state.documentos.length !== 1 && (
            <a className="btn delete" onClick={() => removeDocumento(index)}>
              <i className="zmdi zmdi-delete"></i> Eliminar Documento
            </a>
          )}
        </div>
      </div>
    );
  });

  const framesFotosDocs = state.documentos.map((p, index) => {
    return (
      <div className="j-row toclone-widget-right toclone">
        <div className="span6 unit">
          <div className="input">
            <input
              onChange={(event) => handleChangeFotosDocs(event, index)}
              name="descripcion"
              className="form-control"
              type="text"
              placeholder="Descripción"
            />
          </div>
        </div>
        <div className="span4 unit">
          <div className="form-content">
            <div className="row">
              {/* start prepend small file button */}
              <div className="col-md-12 unit">
                <div className="input prepend-small-btn">
                  <div className="file-button">
                    Browse
                    <input
                      type="file"
                      id="file"
                      name="file"
                      onChange={(event) => handleChangeFotosDocs(event, index)}
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
        </div>
        <div className="span2 unit">
          {state.fotosDocs.length !== 1 && (
            <a className="btn delete" onClick={() => removeFotosDoc(index)}>
              <i className="zmdi zmdi-delete"></i> Eliminar Documento
            </a>
          )}
        </div>
      </div>
    );
  });

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
                <h2>Unidades</h2>
              </div>
              <div className="col-md-6 col-sm-6">
                <ul className="list-page-breadcrumb">
                  <li>
                    <a href="/Configuracion" className="color-mapeo">
                      Catálogos <i className="zmdi zmdi-chevron-right" />
                    </a>
                  </li>
                  <li className="active-page">Unidades</li>
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
              <ExportCSV csvData={dataListadoUnidades} fileName="Unidades_Listado" />
            </li>
            <li>
              <ExportPDF data={dataListadoUnidades} column={columns} fileName="Unidades" />
            </li>
          </ul>

          <div className="tab-content">
            <div id="Listado" className="tab-pane fade in active">
              <div className="widget-wrap">
                <div className="widget-content">
                <div className="row wrapper-tabla" style={{ height: state.height - 200, width: '100%' }}>
                    {dataListadoUnidades.length != 0 ? (
                      <DataGrid
                        rows={dataListadoUnidades}
                        columns={columns}
                        pageSize={10}
                        getRowId={(row) => row.m_nIdUnidad}
                        onRowSelected={(row) => {
                          setState({
                            ...state,
                            idUnidad: row.data.m_nIdUnidad
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
           
                        <form className="j-forms j-multistep" onSubmit={handleAceptar}>
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
                                  "col-md-2 col-sm-3 step " +
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
                                  "col-md-2 col-sm-3 step " +
                                  (stepActive == 2 && "active-step")
                                }
                                onClick={() => openSection(2)}
                              >
                                <div className="steps">
                                  <span className="step-number">2</span>
                                  <p>Carácteristicas de la unidad</p>
                                </div>
                              </div>
                              <div
                                className={
                                  "col-md-1 col-sm-3 step " +
                                  (stepActive == 3 && "active-step")
                                }
                                onClick={() => openSection(3)}
                              >
                                <div className="steps">
                                  <span className="step-number">3</span>
                                  <p>Combustible</p>
                                </div>
                              </div>
                              <div
                                className={
                                  "col-md-2 col-sm-3 step " +
                                  (stepActive == 4 && "active-step")
                                }
                                onClick={() => openSection(4)}
                              >
                                <div className="steps">
                                  <span className="step-number">4</span>
                                  <p>Seguros</p>
                                </div>
                              </div>
                              <div
                                className={
                                  "col-md-1 col-sm-2 step " +
                                  (stepActive == 5 && "active-step")
                                }
                                onClick={() => openSection(5)}
                              >
                                <div className="steps">
                                  <span className="step-number">5</span>
                                  <p>Paro de Motor</p>
                                </div>
                              </div>
                              <div
                                className={
                                  "col-md-2 col-sm-2 step " +
                                  (stepActive == 6 && "active-step")
                                }
                                onClick={() => openSection(6)}
                              >
                                <div className="steps">
                                  <span className="step-number">6</span>
                                  <p>Datos Generales</p>
                                </div>
                              </div>
                              <div
                                className={
                                  "col-md-2 col-sm-2 step " +
                                  (stepActive == 7 && "active-step")
                                }
                                onClick={() => openSection(7)}
                              >
                                <div className="steps">
                                  <span className="step-number">7</span>
                                  <p>Otros Datos</p>
                                </div>
                              </div>
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
                                        <div className="form-content">
                                          {/* start text password */}
                                          <div className="row ">
                                            <div className="col-md-2-5 col-sm-6 unit">
                                              <label className="label">
                                                Código
                                              </label>
                                              <div className="input">
                                                <input
                                                  onChange={handleChange}
                                                  onBlur={handleChangeCodigo}
                                                  className="form-control"
                                                  type="text"
                                                  value={state.codigo}
                                                  id="codigo"
                                                  name="codigo"
                                                  required
                                                />
                                              </div>
                                            </div>
                                        
                                          {/* end text password */}
                                          {/* start email url */}
                                            <div className="col-md-2-5 col-sm-6 unit">
                                              <label className="label">
                                                Descripción
                                              </label>
                                              <div className="input">
                                                <input

                                                  onChange={handleChange}
                                                  className="form-control"
                                                  type="text"
                                                  value={state.descripcion}
                                                  id="descripcion"
                                                  name="descripcion"
                                                  required
                                                  native
                                                />
                                              </div>
                                            </div>
                                            <div className="col-md-2-5 col-sm-6 unit">
                                              <label className="label">
                                                Modelo
                                              </label>
                                              <div className="input">
                                                <input
                                                  onChange={handleChange}
                                                  className="form-control"
                                                  type="number"
                                                  value={state.modelo}
                                                  id="modelo"
                                                  name="modelo"

                                                  native
                                                />
                                              </div>{" "}
                                            </div>
                                            <div className="col-md-4 col-sm-6 unit">
                                              <div className="inline-group">
                                                <label className="label">
                                                  Estados de unidad
                                                </label>
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
                                                    name="rentada"
                                                    type="checkbox"
                                                    id="rentada"
                                                    value={state.rentada}
                                                  />
                                                  <i />
                                                  Rentada
                                                </label>
                                                <label className="checkbox">
                                                  <input
                                                    onChange={
                                                      handleChangePermisionarioCheckboxChange
                                                    }
                                                    native
                                                    name="permisionario"
                                                    type="checkbox"
                                                    value={
                                                      state.esUnidadPermisionario
                                                    }
                                                    id="esUnidadPermisionario"
                                                  />
                                                  <i />
                                                  Unidad Permisionario
                                                </label>
                                              </div>
                                            </div>
                                            </div>

                                          <div className="col-sm-6 col-md-2-5 unit">
                                            <label className="label">
                                              Tipos de Unidad
                                            </label>
                                            <label className="input select">
                                              <select
                                                onChange={handleChange}
                                                className="form-control"
                                                value={state.idTipoUnidad}
                                                required
                                                native
                                                name="idTipoUnidad"
                                                id="idTipoUnidad"
                                              >
                                                <option value="">
                                                  Tipos de Unidad
                                                </option>

                                                {dataTiposUnidad.map(
                                                  (tipoUnidad) => (
                                                    <option
                                                      value={
                                                        tipoUnidad.m_nIdTipoUnidad
                                                      }
                                                    >
                                                      {tipoUnidad.m_sTipoUnidad}
                                                    </option>
                                                  )
                                                )}
                                              </select>
                                              <i></i>
                                            </label>
                                          </div>
                                          {/* end search */}
                                          {/* start textarea */}
                                          <div className="col-sm-6 col-md-2-5 unit">
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
                                          <div className="col-sm-6 col-md-2-5 unit">
                                                                          <label className="label">&nbsp; </label>

                                            <label className="input select">
                                              <select
                                                onChange={handleChange}
                                                value={state.idOperador}
                                                id="idOperador"
                                                native
                                                className="form-control"
                                                name="idOperador"
                                                required
                                              >
                                                <option value="">
                                                  Operador
                                                </option>

                                                {dataOperador.map((operador) => (
                                                  <option
                                                    value={
                                                      operador.m_nIdOperador
                                                    }
                                                  >
                                                    {operador.m_nNumeroOperador}{" "}
                                                    {operador.m_sNombreCompleto}
                                                  </option>
                                                ))}
                                              </select>
                                              <i></i>
                                            </label>
                                          </div>
                                            <div className="col-sm-6 col-md-2-5 unit">
                                              <label className="label">
                                                Número Serie
                                              </label>
                                              <div className="input">
                                                <input
                                                  onChange={handleChange}
                                                  className="form-control"
                                                  type="text"
                                                  value={state.serieUnidad}
                                                  id="serieUnidad"
                                                  name="serieUnidad"

                                                  native
                                                />
                                              </div>
                                            </div>
                                            <div className="col-sm-6 col-md-2-5 unit">
                                              <label className="label">
                                                Color
                                              </label>
                                              <div className="input">
                                                <input
                                                  onChange={handleChange}
                                                  value={state.colorUnidad}
                                                  class="form-control"
                                                  type="text"
                                                  id="hex"
                                                  name="colorUnidad"
                                                  native

                                                />
                                              </div>{" "}
                                            </div>

                                            <div className="col-sm-6 col-md-2-5 unit">
                                              <label className="label">
                                                Identificador Satelital
                                              </label>
                                              <div className="input">
                                                <input
                                                  onChange={handleChange}
                                                  className="form-control"
                                                  type="text"
                                                  value={state.idSatelital}
                                                  id="idSatelital"
                                                  name="idSatelital"
                                                  native

                                                />
                                              </div>
                                            </div>
                                            <div className="col-sm-6 col-md-2-5 unit">
                                              <label className="label">
                                                Identificador Convoy
                                              </label>
                                              <div className="input">
                                                <input
                                                  onChange={handleChange}
                                                  className="form-control"
                                                  type="text"
                                                  value={state.idConvoy}
                                                  id="idConvoy"
                                                  name="idConvoy"
                                                  native
                                                />
                                              </div>{" "}
                                            </div>
                                          <div className="col-sm-6 col-md-2-5 unit">
                                          <label className="label">&nbsp; </label>

                                            <label className="input select">
                                              <select
                                                onChange={handleChange}
                                                value={state.idGrupoUnidad}
                                                id="idGrupoUnidad"
                                                native
                                                className="form-control"
                                                name="idGrupoUnidad"
                                                required
                                              >
                                                <option value="none">
                                                  Grupo Unidades
                                                </option>

                                                {dataGruposUnidades.map(
                                                  (grupoUnidad) => (
                                                    <option
                                                      value={
                                                        grupoUnidad.m_nIdGrupoUnidad
                                                      }
                                                    >
                                                      {grupoUnidad.m_nCodigo}{" "}
                                                      {
                                                        grupoUnidad.m_sGrupoUnidad
                                                      }
                                                    </option>
                                                  )
                                                )}
                                              </select>
                                              <i></i>
                                            </label>
                                          </div>
                                        </div>
                                        {/* end textarea */}
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              </div>
                              {/*Fin de ejemplo*/}
                         

                       
                              <div className="widget-wrap" id="caracteristicas">
                                <div className="widget-header block-header margin-bottom-0 clearfix">
                                  <div className="pull-left">
                                    <h3>Carácteristicas de la unidad</h3>
                                  </div>
                                  
                                </div>
                                <div className="widget-container">
                                  <div className="widget-content">
                                    <div className="row">
                                      <div className="col-md-12">
                                        <div className="form-content">
                                          {/* start text password */}
                                          <div className="row">
                                            <div className="w-section-header">
                                              <h3>Dimensiones</h3>
                                            </div>
                                            <div className="col-sm-12 col-md-2-5 unit">
                                              <label className="label">
                                                Largo
                                              </label>
                                              <div className="input">
                                                <input
                                                  onChange={handleChange}
                                                  className="form-control"
                                                  type="text"
                                                  value={state.largo}
                                                  id="largo"
                                                  name="largo"
                                                  native
                                                />
                                              </div>
                                            </div>
                                            <div className="col-sm-6 col-md-2-5 unit">
                                              <label className="label">
                                                Ancho
                                              </label>
                                              <div className="input">
                                                <input
                                                  onChange={handleChange}
                                                  className="form-control"
                                                  type="text"
                                                  value={state.ancho}
                                                  id="ancho"
                                                  name="ancho"
                                                  native
                                                />
                                              </div>
                                            </div>
                                            <div className="col-sm-6 col-md-2-5 unit">
                                              <label className="label">
                                                Alto
                                              </label>
                                              <div className="input">
                                                <input
                                                  onChange={handleChange}
                                                  className="form-control"
                                                  type="text"
                                                  value={state.alto}
                                                  id="alto"
                                                  name="alto"
                                                  native
                                                />
                                              </div>
                                            </div>
                                            <div className="col-sm-6 col-md-2-5 unit">
                                              <label className="label">
                                                Capacidad
                                              </label>
                                              <div className="input">
                                                <input
                                                  onChange={handleChange}
                                                  className="form-control"
                                                  type="text"
                                                  value={state.capacidad}
                                                  id="capacidad"
                                                  name="capacidad"
                                                  native
                                                />
                                              </div>
                                            </div>
                                            <div className="col-sm-6 col-md-2-5 unit">
                                              <label className="label">
                                                Número de Ejes
                                              </label>
                                              <div className="input">
                                                <input
                                                  onChange={handleChange}
                                                  className="form-control"
                                                  type="text"
                                                  value={state.numeroEjes}
                                                  id="numeroEjes"
                                                  name="numeroEjes"
                                                  native
                                                />
                                              </div>
                                            </div>
                                          </div>

                                          <div className="row">
                                            <div className="w-section-header">
                                              <h3>Llantas</h3>
                                            </div>
                                            <div className="col-sm-6  col-md-2 unit">
                                              <label className="label">
                                                Número de llantas
                                              </label>
                                              <div className="input">
                                                <input
                                                  onChange={handleChange}
                                                  className="form-control"
                                                  type="number"
                                                  value={state.numeroLlanta}
                                                  id="numeroLlanta"
                                                  name="numeroLlanta"
                                                  disabled
                                                />
                                              </div>
                                            </div>
                                            <div className="col-sm-6  col-md-2 unit">
                                              <label className="label">
                                                Llantas de refacción
                                              </label>
                                              <div className="input">
                                                <input
                                                  onChange={handleChange}
                                                  className="form-control"
                                                  type="number"
                                                  value={state.llantaRefaccion}
                                                  id="llantaRefaccion"
                                                  name="llantaRefaccion"
                                                  disabled
                                                />
                                              </div>
                                            </div>
                                            <div className="col-sm-6  col-md-2 unit">
                                              <label className="label">
                                                Marca de la llanta
                                              </label>
                                              <label className="input select">
                                                <select
                                                  onChange={handleChange}
                                                  className="form-control"
                                                  disabled
                                                  value={state.marcaLlanta}
                                                  id="marcaLlanta"
                                                  name="marcaLlanta"
                                                >
                                                  <option value="none">
                                                    Todos
                                                  </option>
                                                </select>
                                                <i></i>
                                              </label>
                                            </div>
                                            <div className="col-sm-6  col-md-2 unit">
                                              <label className="label">
                                                Modelo de la llanta
                                              </label>
                                              <label className="input select">
                                                <select
                                                  onChange={handleChange}
                                                  className="form-control"
                                                  disabled
                                                  value={state.modeloLlanta}
                                                  id="modeloLlanta"
                                                  name="modeloLlanta"
                                                >
                                                  <option value="none">
                                                    Todos
                                                  </option>
                                                </select>
                                                <i></i>
                                              </label>
                                            </div>
                                            <div className="col-sm-6  col-md-2 unit">
                                              <label className="label">
                                                Medida de la llanta
                                              </label>
                                              <label className="input select">
                                                <select
                                                  onChange={handleChange}
                                                  className="form-control"
                                                  disabled
                                                  value={state.medidaLlanta}
                                                  id="medidaLlanta"
                                                  name="medidaLlanta"
                                                >
                                                  <option value="none"></option>
                                                </select>
                                                <i></i>
                                              </label>
                                            </div>
                                            <div className="col-sm-6  col-md-2 unit">
                                              <label className="label">
                                                Tipo de llanta
                                              </label>
                                              <label className="input select">
                                                <select
                                                  onChange={handleChange}
                                                  className="form-control"
                                                  disabled
                                                  value={state.tipoLlanta}
                                                  id="tipoLlanta"
                                                  name="tipoLlanta"
                                                >
                                                  <option value="none"></option>
                                                </select>
                                                <i></i>
                                              </label>
                                            </div>
                                          </div>

                                          <div className="row">
                                            <div className="w-section-header">
                                              <h3>Motor</h3>
                                            </div>

                                            <div className="col-sm-12 col-md-2-5 unit">
                                              <label className="label">
                                                Tipo Motor
                                              </label>
                                              <div className="input">
                                                <input
                                                  onChange={handleChange}
                                                  className="form-control"
                                                  type="text"
                                                  value={state.tipoMotor}
                                                  id="tipoMotor"
                                                  name="tipoMotor"
                                                />
                                              </div>
                                            </div>
                                            <div className="col-sm-12 col-md-2-5 unit">
                                              <label className="label">
                                                Número de serie
                                              </label>
                                              <div className="input">
                                                <input
                                                  onChange={handleChange}
                                                  className="form-control"
                                                  type="text"
                                                  value={state.serieMotor}
                                                  id="serieMotor"
                                                  name="serieMotor"
                                                />
                                              </div>
                                            </div>
                                            <div className="col-sm-12 col-md-2-5 unit">
                                              <label className="label">
                                                Tipo de Transmisión
                                              </label>
                                              <div className="input">
                                                <input
                                                  onChange={handleChange}
                                                  className="form-control"
                                                  type="text"
                                                  value={state.tipoTransmision}
                                                  id="tipoTransmision"
                                                  name="tipoTransmision"
                                                />
                                              </div>
                                            </div>
                                            <div className="col-sm-12 col-md-2-5 unit">
                                              <label className="label">
                                                Observaciones
                                              </label>
                                              <div className="input">
                                                <input
                                                  disabled
                                                  className="form-control"
                                                  type="text"
                                                  placeholder=""
                                                  id="text"
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
                    
                          
                              <div className="widget-wrap" id="combustible">
                                <div className="widget-header block-header margin-bottom-0 clearfix">
                                  <div className="pull-left">
                                    <h3>Combustible</h3>
                                  </div>
                                  
                                </div>
                                <div className="widget-container">
                                  <div className="widget-content">
                                    <div className="row">
                                      <div className="col-md-12">
                                        <div className="form-content">
                                          {/* start text password */}
                                            <div className="col-sm-12 col-md-2-5 unit">
                                              <label className="label">
                                                Tipo de combustible
                                              </label>
                                              <label className="input select">
                                                <select
                                                  className="form-control"
                                                  onChange={handleChange}
                                                  value={state.tipoCombustible}
                                                  id="tipoCombustible"
                                                  name="tipoCombustible"
                                                >
                                                  <option value="none">
                                                    Todos
                                                  </option>
                                                  <option value="1">
                                                    Por Materiales
                                                  </option>
                                                  <option value="2">
                                                    Gasolina
                                                  </option>
                                                  <option value="3">Gas</option>
                                                  <option value="4">
                                                    Etanol
                                                  </option>
                                                </select>
                                                <i></i>
                                              </label>
                                            </div>

                                            <div className="col-sm-12 col-md-2-5 unit">
                                              <label className="label">
                                                Capacidad de tanque
                                              </label>
                                              <div className="input">
                                                <input
                                                  onChange={handleChange}
                                                  className="form-control"
                                                  type="number"
                                                  value={
                                                    state.capacidadTanqueGal
                                                  }
                                                  id="capacidadTanqueGal"
                                                  name="capacidadTanqueGal"
                                                />
                                              </div>
                                            </div>
                                            <div className="col-sm-12 col-md-2-5 unit">
                                              <label className="label">
                                                Rendimiento cargado
                                              </label>
                                              <div className="input">
                                                <input
                                                  onChange={handleChange}
                                                  className="form-control"
                                                  type="number"
                                                  value={
                                                    state.rendimientoCargado
                                                  }
                                                  id="rendimientoCargado"
                                                  name="rendimientoCargado"
                                                />
                                              </div>
                                            </div>
                                            <div className="col-sm-12 col-md-2-5 unit">
                                              <label className="label">
                                                Rendimiento Vacio
                                              </label>
                                              <div className="input">
                                                <input
                                                  onChange={handleChange}
                                                  className="form-control"
                                                  type="number"
                                                  value={state.rendimientoVacio}
                                                  id="rendimientoVacio"
                                                  name="rendimientoVacio"
                                                />
                                              </div>
                                            </div>
                                            <div className="col-sm-12 col-md-2-5 unit">
                                              <label className="label">
                                                Tarjeta combustible
                                              </label>
                                              <div className="input">
                                                <input
                                                  onChange={handleChange}
                                                  className="form-control"
                                                  type="text"
                                                  value={state.tarjetaDiesel1}
                                                  id="tarjetaDiesel1"
                                                  name="tarjetaDiesel1"
                                                />
                                              </div>
                                            </div>
                                            <div className="col-sm-12 col-md-2-5 unit">
                                              <label className="label">
                                                Tarjeta combustible 2
                                              </label>
                                              <div className="input">
                                                <input
                                                  onChange={handleChange}
                                                  className="form-control"
                                                  type="text"
                                                  value={state.tarjetaDiesel2}
                                                  id="tarjetaDiesel2"
                                                  name="tarjetaDiesel2"
                                                />
                                              </div>
                                            </div>
                                            <div className="col-sm-12 col-md-2-5 unit">
                                              <label className="label">
                                                Tarjeta combustible 3
                                              </label>
                                              <div className="input">
                                                <input
                                                  onChange={handleChange}
                                                  className="form-control"
                                                  type="text"
                                                  value={state.tarjetaDiesel3}
                                                  id="tarjetaDiesel3"
                                                  name="tarjetaDiesel3"
                                                />
                                              </div>
                                            </div>
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              </div>
                              {/*Fin de ejemplo*/}
                     
                              <div className="widget-wrap" id="seguros">
                                <div className="widget-header block-header margin-bottom-0 clearfix">
                                  <div className="pull-left">
                                    <h3>Seguros</h3>
                                  </div>
                                  
                                </div>
                                <div className="widget-container">
                                  <div className="widget-content">
                                    <div className="row">
                                      <div className="col-md-12">
                                        <div className="form-content">
                                          {/* start text password */}
                                          <div className="row">
                                            <div className="col-sm-6 col-md-2 col-lg-2 unit">
                                              <label className="label">
                                                Aseguradora
                                              </label>
                                              <div className="input">
                                                <input
                                                  onChange={handleChange}
                                                  className="form-control"
                                                  type="text"
                                                  placeholder={
                                                    state.companiaSeguros1
                                                  }
                                                  id="companiaSeguros1"
                                                  name="companiaSeguros1"
                                                />
                                              </div>
                                            </div>
                                            <div className="col-sm-6 col-md-2 col-lg-2 unit">
                                              <label className="label">
                                                Teléfonos
                                              </label>
                                              <div className="input">
                                                <input
                                                  onChange={handleChange}
                                                  className="form-control"
                                                  type="text"
                                                  value={state.telefono1}
                                                  id="telefono1"
                                                  name="telefono1"
                                                />
                                              </div>
                                            </div>
                                            <div className="col-sm-6 col-md-2 col-lg-2 unit">
                                              <label className="label">
                                                Núm. Seguro
                                              </label>
                                              <div className="input">
                                                <input
                                                  onChange={handleChange}
                                                  className="form-control"
                                                  type="text"
                                                  value={state.numeroSeguro1}
                                                  id="numeroSeguro1"
                                                  name="numeroSeguro1"
                                                />
                                              </div>
                                            </div>
                                            <div className="col-sm-6 col-md-2  col-lg-2 unit">
                                              <label className="label">
                                                Vencimiento
                                              </label>
                                              <div className="input">
                                                <input
                                                  onChange={handleChange}
                                                  className="form-control"
                                                  type="datetime-local"
                                                  value={
                                                    state.vencimientoSeguro1
                                                  }
                                                  id="vencimientoSeguro1"
                                                  name="vencimientoSeguro1"
                                                />{" "}
                                              </div>
                                            </div>
                                            <div className="col-sm-12 col-md-4 col-lg-4 unit">
                                              <div className="inline-group">
                                                <label className="label">
                                                  Tipo de cobertura
                                                </label>
                                                <label className="radio">
                                                  <input
                                                    onChange={handleChange}
                                                    type="radio"
                                                    name="i-radio1"
                                                    defaultChecked
                                                    value="1"
                                                    placeholder={
                                                      state.TipoCoberturaSeguro1
                                                    }
                                                    id="TipoCoberturaSeguro1"
                                                    name="TipoCoberturaSeguro1"
                                                  />
                                                  <i />
                                                  Amplia
                                                </label>
                                                <label className="radio">
                                                  <input
                                                    onChange={handleChange}
                                                    onChange={handleChange}
                                                    type="radio"
                                                    name="i-radio1"
                                                    value="2"
                                                    placeholder={
                                                      state.TipoCoberturaSeguro1
                                                    }
                                                    id="TipoCoberturaSeguro1"
                                                    name="TipoCoberturaSeguro1"
                                                  />
                                                  <i />
                                                  Limitada
                                                </label>
                                                <label className="radio">
                                                  <input
                                                    onChange={handleChange}
                                                    type="radio"
                                                    name="i-radio1"
                                                    value="3"
                                                    placeholder={
                                                      state.TipoCoberturaSeguro1
                                                    }
                                                    id="TipoCoberturaSeguro1"
                                                    name="TipoCoberturaSeguro1"
                                                  />
                                                  <i />
                                                  S/Cobertura
                                                </label>
                                              </div>
                                            </div>
                                          </div>
                                          <div className="row">
                                            <div className="col-sm-6 col-md-2 col-lg-2 unit">
                                              <label className="label">
                                                Aseguradora
                                              </label>
                                              <div className="input">
                                                <input
                                                  onChange={handleChange}
                                                  className="form-control"
                                                  type="text"
                                                  value={state.CompaniaSeguros}
                                                  id="CompaniaSeguros"
                                                  name="CompaniaSeguros"
                                                />
                                              </div>
                                            </div>
                                            <div className="col-sm-6 col-md-2 col-lg-2 unit">
                                              <label className="label">
                                                Teléfonos
                                              </label>
                                              <div className="input">
                                                <input
                                                  onChange={handleChange}
                                                  className="form-control"
                                                  type="text"
                                                  value={state.telefono}
                                                  id="telefono"
                                                  name="telefono"
                                                />
                                              </div>
                                            </div>
                                            <div className="col-sm-6 col-md-2 col-lg-2 unit">
                                              <label className="label">
                                                Núm. Seguro
                                              </label>
                                              <div className="input">
                                                <input
                                                  onChange={handleChange}
                                                  className="form-control"
                                                  type="text"
                                                  value={state.numeroSeguro}
                                                  id="numeroSeguro"
                                                  name="numeroSeguro"
                                                />
                                              </div>
                                            </div>
                                            <div className="col-sm-6 col-md-2  col-lg-2 unit">
                                              <label className="label">
                                                Vencimiento
                                              </label>
                                              <div className="input">
                                                <input
                                                  onChange={handleChange}
                                                  className="form-control"
                                                  type="datetime-local"
                                                  placeholder=""
                                                  value={
                                                    state.vencimientoSeguro
                                                  }
                                                  id="vencimientoSeguro"
                                                  name="vencimientoSeguro"
                                                />
                                              </div>
                                            </div>
                                            <div className="col-sm-12 col-md-4 col-lg-4 unit">
                                              <div className="inline-group">
                                                <label className="label">
                                                  Tipo de cobertura
                                                </label>
                                                <label className="radio">
                                                  <input
                                                    onChange={handleChange}
                                                    type="radio"
                                                    name="i-radio"
                                                    value="1"
                                                    defaultChecked
                                                    placeholder={
                                                      state.tipoCobertura
                                                    }
                                                    id="tipoCobertura"
                                                    name="tipoCobertura"
                                                  />
                                                  <i />
                                                  Amplia
                                                </label>
                                                <label className="radio">
                                                  <input
                                                    onChange={handleChange}
                                                    type="radio"
                                                    name="i-radio"
                                                    value="2"
                                                    placeholder={
                                                      state.tipoCobertura
                                                    }
                                                    id="tipoCobertura"
                                                    name="tipoCobertura"
                                                  />
                                                  <i />
                                                  Limitada
                                                </label>
                                                <label className="radio">
                                                  <input
                                                    onChange={handleChange}
                                                    type="radio"
                                                    name="i-radio"
                                                    value="3"
                                                    placeholder={
                                                      state.tipoCobertura
                                                    }
                                                    id="tipoCobertura"
                                                    name="tipoCobertura"
                                                  />
                                                  <i />
                                                  S/Cobertura
                                                </label>
                                              </div>
                                            </div>
                                          </div>
                                          {/* end text password */}
                                          {/* start email url */}

                                          {/* end textarea */}
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              </div>
                              {/*Fin de ejemplo*/}
                           
                         
                              <div className="widget-wrap" id="paromotor">
                                <div className="widget-header block-header margin-bottom-0 clearfix">
                                  <div className="pull-left">
                                    <h3>Paro de Motor de Ralentí</h3>
                                  </div>
                            
                                </div>
                                <div className="widget-container">
                                  <div className="widget-content">
                                    <div className="row">
                                      <div className="col-md-12">
                                        <div className="form-content">
                                          {/* start text password */}
                                          <div className="row">
                                          <div className="col-sm-12 col-md-2-5 unit">
                                              <label className="checkbox-toggle">
                                                <input
                                                  type="checkbox"
                                                  onChange={
                                                    handleChangeParoMotor
                                                  }
                                                  value={state.paroMotor}
                                                  id="paroMotor"
                                                  name="paroMotor"
                                                />
                                                <i />
                                                Paro por Ralenti
                                              </label>
                                            </div>
                                            <div className="col-sm-12 col-md-2-5 unit">
                                              <label className="label">
                                                Tiempo para paro
                                              </label>
                                              <div className="input">
                                                <input
                                                  onChange={handleChange}
                                                  className="form-control"
                                                  type="number"
                                                  placeholder="Max. 30 min"
                                                  value={state.tiempoParo}
                                                  id="tiempoParo"
                                                  name="tiempoParo"
                                                  readOnly={
                                                    state.tiempoParoStatus
                                                  }
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
                                  <div className="pull-left">
                                    <h3>Detalles</h3>
                                  </div>
                                  
                                </div>
                                <div className="widget-container">
                                  <div className="widget-content">
                                    <div className="row">
                                      <div className="col-md-12">
                                        <ul className="nav nav-tabs">
                                          <li className="active">
                                            <a data-toggle="tab" href="#Placas">
                                              Placas/Permisos
                                            </a>
                                          </li>
                                          <li>
                                            <a
                                              data-toggle="tab"
                                              href="#Adicionales"
                                            >
                                              Adicionales
                                            </a>
                                          </li>
                                          <li>
                                            <a
                                              data-toggle="tab"
                                              href="#PConduccion"
                                            >
                                              P. Conducción
                                            </a>
                                          </li>
                                          <li>
                                            <a data-toggle="tab" href="#Fotos">
                                              Fotos/Doc
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
                                                    id="Placas"
                                                    className="tab-pane fade in active"
                                                  >
                                                    <div className="row">
                                                      <div className="col-md-12 unit">
                                                        <div className="row">
                                                          <div className="col-sm-6 col-md-3 col-lg-3 unit">
                                                            <label className="label">
                                                              Placas Mex.
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
                                                                  state.placas
                                                                }
                                                                id="placas"
                                                                name="placas"
                                                              />
                                                            </div>
                                                          </div>
                                                          <div className="col-sm-6 col-md-3  col-lg-3 unit">
                                                            <label className="label">
                                                              Vencimiento
                                                            </label>
                                                            <div className="input">
                                                              <input
                                                                onChange={
                                                                  handleChange
                                                                }
                                                                className="form-control"
                                                                type="datetime-local"
                                                                placeholder=""
                                                                value={
                                                                  state.placasVencimiento
                                                                }
                                                                id="placasVencimiento"
                                                                name="placasVencimiento"
                                                              />
                                                            </div>
                                                          </div>
                                                          <div className="col-sm-6 col-md-3 col-lg-3  unit ">
                                                            <label className="label">
                                                              Placas E.U.A.
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
                                                                  state.placasExtranjeras
                                                                }
                                                                id="placasExtranjeras"
                                                                name="placasExtranjeras"
                                                              />
                                                            </div>
                                                          </div>
                                                          <div className="col-sm-6 col-md-3  col-lg-3 unit">
                                                            <label className="label">
                                                              Vencimiento
                                                            </label>
                                                            <div className="input">
                                                              <input
                                                                onChange={
                                                                  handleChange
                                                                }
                                                                className="form-control"
                                                                type="datetime-local"
                                                                placeholder=""
                                                                value={
                                                                  state.placasExtranjerasVencimiento
                                                                }
                                                                id="placasExtranjerasVencimiento"
                                                                name="placasExtranjerasVencimiento"
                                                              />
                                                            </div>
                                                          </div>
                                                        </div>
                                                        <div className="row">
                                                          <div className="col-sm-6  col-md-3 col-lg-3  unit">
                                                            <label className="label">
                                                              Placas Default
                                                            </label>
                                                            <label className="input select">
                                                              <select
                                                                className="form-control"
                                                                onChange={
                                                                  handleChange
                                                                }
                                                                value={
                                                                  state.placasDefault
                                                                }
                                                                id="placasDefault"
                                                                name="placasDefault"
                                                              >
                                                                <option value="1">
                                                                  México
                                                                </option>
                                                                <option value="2">
                                                                  E.U.A
                                                                </option>
                                                              </select>
                                                              <i></i>
                                                            </label>
                                                          </div>
                                                          <div className="col-sm-6 col-md-3  col-lg-3 unit">
                                                            <label className="label">
                                                              Permiso SCT
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
                                                                    state.permisoSCT
                                                                  }
                                                                  id="permisoSCT"
                                                                  name="permisoSCT"
                                                                />
                                                              </div>
                                                            </div>
                                                          </div>
                                                          <div className="col-sm-6 col-md-3  col-lg-3 unit">
                                                            <label className="label">
                                                              Verificación
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
                                                                  state.verificacionVehicular
                                                                }
                                                                id="verificacionVehicular"
                                                                name="verificacionVehicular"
                                                              />
                                                            </div>
                                                          </div>
                                                          <div className="col-sm-6 col-md-3  col-lg-3 unit">
                                                            <label className="label">
                                                              Vencimiento
                                                            </label>
                                                            <div className="input">
                                                              <input
                                                                onChange={
                                                                  handleChange
                                                                }
                                                                className="form-control"
                                                                type="datetime-local"
                                                                placeholder=""
                                                                value={
                                                                  state.verificacionVehicularVencimiento
                                                                }
                                                                id="verificacionVehicularVencimiento"
                                                                name="verificacionVehicularVencimiento"
                                                              />
                                                            </div>
                                                          </div>
                                                        </div>
                                                      </div>
                                                    </div>
                                                  </div>
                                                  <div
                                                    id="Adicionales"
                                                    className="tab-pane fade"
                                                  >
                                                    <div className="row">
                                                      <div className="col-md-12 unit">
                                                        {/* start cloned right side buttons element */}
                                                        <div className="clone-rightside-btn-1">
                                                          <label className="label">
                                                            Documentos
                                                          </label>
                                                          {framesDocumentos}
                                                          <a
                                                            className="btn"
                                                            style={{
                                                              margin: "10px",
                                                            }}
                                                            onClick={() =>
                                                              addDocumento()
                                                            }
                                                          >
                                                            <i className="zmdi zmdi-plus"></i>{" "}
                                                            Agregar Documento
                                                          </a>
                                                        </div>
                                                      </div>
                                                    </div>
                                                  </div>
                                                  <div
                                                    id="PConduccion"
                                                    className="tab-pane fade "
                                                  >
                                                    <div className="row">
                                                      <div className="col-md-12 unit">
                                                        <div className="row">
                                                        <div className="col-sm-6 col-md-2-5 col-lg-2-5 unit">
                                                            <label className="label">
                                                              Velocidad Promedio
                                                            </label>
                                                            <div className="input">
                                                              <input
                                                                className="form-control"
                                                                type="number"
                                                                placeholder="Velocidad Promedio"
                                                                onChange={
                                                                  handleChange
                                                                }
                                                                value={
                                                                  state.velocidadPromedio
                                                                }
                                                                name="velocidadPromedio"
                                                              />
                                                            </div>
                                                          </div>
                                                          <div className="col-sm-6 col-md-2-5 col-lg-2-5 unit">
                                                            <label className="label">
                                                              &nbsp;
                                                            </label>
                                                            <label className="input select">
                                                              <select
                                                                className="form-control"
                                                                onChange={
                                                                  handleChange
                                                                }
                                                                value={
                                                                  state.velocidadPromedioUM
                                                                }
                                                                name="velocidadPromedioUM"
                                                              >
                                                                <option value="%">
                                                                  %
                                                                </option>
                                                                <option value="veces">
                                                                  Veces
                                                                </option>
                                                                <option value="RPM">
                                                                  RPM
                                                                </option>
                                                                <option value="KM/HR">
                                                                  KM/HR
                                                                </option>
                                                              </select>
                                                              <i></i>
                                                            </label>
                                                          </div>
                                                        </div>
                                                        <div className="row">
                                                        <div className="col-sm-6 col-md-2-5 col-lg-2-5 unit">
                                                            <label className="label">
                                                              Neutralizaciones
                                                            </label>
                                                            <div className="input">
                                                              <input
                                                                className="form-control"
                                                                type="text"
                                                                placeholder="Neutralización"
                                                                onChange={
                                                                  handleChange
                                                                }
                                                                value={
                                                                  state.neutralizaciones
                                                                }
                                                                name="neutralizaciones"
                                                                onChange={
                                                                  handleChange
                                                                }
                                                              />
                                                            </div>
                                                          </div>
                                                          <div className="col-sm-6 col-md-2-5 col-lg-2-5 unit">
                                                            <label className="label">
                                                              &nbsp;
                                                            </label>
                                                            <label className="input select">
                                                              <select
                                                                className="form-control"
                                                                onChange={
                                                                  handleChange
                                                                }
                                                                value={
                                                                  state.neutralizacionesUM
                                                                }
                                                                name="neutralizacionesUM"
                                                              >
                                                                <option value="%">
                                                                  %
                                                                </option>
                                                                <option value="veces">
                                                                  Veces
                                                                </option>
                                                                <option value="RPM">
                                                                  RPM
                                                                </option>
                                                                <option value="KM/HR">
                                                                  KM/HR
                                                                </option>
                                                              </select>
                                                              <i></i>
                                                            </label>
                                                          </div>
                                                        </div>
                                                        <div className="row">
                                                        <div className="col-sm-6 col-md-2-5 col-lg-2-5 unit">
                                                            <label className="label">
                                                              Frenado Brusco
                                                            </label>
                                                            <div className="input">
                                                              <input
                                                                className="form-control"
                                                                type="text"
                                                                placeholder="Frenado Brusco"
                                                                onChange={
                                                                  handleChange
                                                                }
                                                                value={
                                                                  state.frenadoBrusco
                                                                }
                                                                name="frenadoBrusco"
                                                              />
                                                            </div>
                                                          </div>
                                                          <div className="col-sm-6 col-md-2-5 col-lg-2-5 unit">
                                                            <label className="label">
                                                              &nbsp;
                                                            </label>
                                                            <label className="input select">
                                                              <select
                                                                className="form-control"
                                                                onChange={
                                                                  handleChange
                                                                }
                                                                value={
                                                                  state.frenadoBruscoUM
                                                                }
                                                                name="frenadoBruscoUM"
                                                              >
                                                                <option value="%">
                                                                  %
                                                                </option>
                                                                <option value="veces">
                                                                  Veces
                                                                </option>
                                                                <option value="RPM">
                                                                  RPM
                                                                </option>
                                                                <option value="KM/HR">
                                                                  KM/HR
                                                                </option>
                                                              </select>
                                                              <i></i>
                                                            </label>
                                                          </div>
                                                        </div>
                                                        <div className="row">
                                                        <div className="col-sm-6 col-md-2-5 col-lg-2-5 unit">
                                                            <label className="label">
                                                              Carga de
                                                              Aceleración
                                                            </label>
                                                            <div className="input">
                                                              <input
                                                                onChange={
                                                                  handleChange
                                                                }
                                                                value={
                                                                  state.cargaAceleracion
                                                                }
                                                                name="cargaAceleracion"
                                                                className="form-control"
                                                                type="text"
                                                                placeholder="Carga de Aceleración"
                                                                id="text"
                                                              />
                                                            </div>
                                                          </div>
                                                          <div className="col-sm-6 col-md-2-5 col-lg-2-5 unit">
                                                            <label className="label">
                                                              &nbsp;
                                                            </label>
                                                            <label className="input select">
                                                              <select
                                                                className="form-control"
                                                                onChange={
                                                                  handleChange
                                                                }
                                                                value={
                                                                  state.cargaAceleracionUM
                                                                }
                                                                name="cargaAceleracionUM"
                                                              >
                                                                <option value="%">
                                                                  %
                                                                </option>
                                                                <option value="veces">
                                                                  Veces
                                                                </option>
                                                                <option value="RPM">
                                                                  RPM
                                                                </option>
                                                                <option value="KM/HR">
                                                                  KM/HR
                                                                </option>
                                                              </select>
                                                              <i></i>
                                                            </label>
                                                          </div>
                                                        </div>
                                                        <div className="row">
                                                        <div className="col-sm-6 col-md-2-5 col-lg-2-5 unit">
                                                            <label className="label">
                                                              Accionamiento
                                                              Pedal Freno
                                                            </label>
                                                            <div className="input">
                                                              <input
                                                                className="form-control"
                                                                type="text"
                                                                placeholder="Accionamiento Pedal de Freno"
                                                                onChange={
                                                                  handleChange
                                                                }
                                                                value={
                                                                  state.accionamientoPedal
                                                                }
                                                                name="accionamientoPedal"
                                                              />
                                                            </div>
                                                          </div>
                                                          <div className="col-sm-6 col-md-2-5 col-lg-2-5 unit">
                                                            <label className="label">
                                                              &nbsp;
                                                            </label>
                                                            <label className="input select">
                                                              <select
                                                                className="form-control"
                                                                onChange={
                                                                  handleChange
                                                                }
                                                                value={
                                                                  state.accionamientoPedalUM
                                                                }
                                                                name="accionamientoPefalUM"
                                                              >
                                                                <option value="%">
                                                                  %
                                                                </option>
                                                                <option value="veces">
                                                                  Veces
                                                                </option>
                                                                <option value="RPM">
                                                                  RPM
                                                                </option>
                                                                <option value="KM/HR">
                                                                  KM/HR
                                                                </option>
                                                              </select>
                                                              <i></i>
                                                            </label>
                                                          </div>
                                                        </div>
                                                        <div className="row">
                                                        <div className="col-sm-6 col-md-2-5 col-lg-2-5 unit">
                                                            <label className="label">
                                                              Velocidad Máxima
                                                              Motor
                                                            </label>
                                                            <div className="input">
                                                              <input
                                                                className="form-control"
                                                                type="text"
                                                                placeholder="Velocidad Máxima Motor"
                                                                onChange={
                                                                  handleChange
                                                                }
                                                                value={
                                                                  state.velocidadMaximaMotor
                                                                }
                                                                name="velocidadMaximaMotor"
                                                              />
                                                            </div>
                                                          </div>
                                                          <div className="col-sm-6 col-md-2-5 col-lg-2-5 unit">
                                                            <label className="label">
                                                              &nbsp;
                                                            </label>
                                                            <label className="input select">
                                                              <select
                                                                className="form-control"
                                                                onChange={
                                                                  handleChange
                                                                }
                                                                value={
                                                                  state.velocidadMaximaMotorUM
                                                                }
                                                                name="velocidadMaximaMotorUM"
                                                              >
                                                                <option value="%">
                                                                  %
                                                                </option>
                                                                <option value="veces">
                                                                  Veces
                                                                </option>
                                                                <option value="RPM">
                                                                  RPM
                                                                </option>
                                                                <option value="KM/HR">
                                                                  KM/HR
                                                                </option>
                                                              </select>
                                                              <i></i>
                                                            </label>
                                                          </div>
                                                        </div>
                                                        <div className="row">
                                                        <div className="col-sm-6 col-md-2-5 col-lg-2-5 unit">
                                                            <label className="label">
                                                              % Ultimo Cambio
                                                            </label>
                                                            <div className="input">
                                                              <input
                                                                className="form-control"
                                                                type="text"
                                                                placeholder="% Ultimo Cambio"
                                                                onChange={
                                                                  handleChange
                                                                }
                                                                value={
                                                                  state.porcUltimoCambio
                                                                }
                                                                name="porcUltimoCambio"
                                                              />
                                                            </div>
                                                          </div>
                                                          <div className="col-sm-6 col-md-2-5 col-lg-2-5 unit">
                                                            <label className="label">
                                                              &nbsp;
                                                            </label>
                                                            <label className="input select">
                                                              <select
                                                                className="form-control"
                                                                onChange={
                                                                  handleChange
                                                                }
                                                                value={
                                                                  state.porcUltimoCambioUM
                                                                }
                                                                name="porcUltimoCambioUM"
                                                              >
                                                                <option value="%">
                                                                  %
                                                                </option>
                                                                <option value="veces">
                                                                  Veces
                                                                </option>
                                                                <option value="RPM">
                                                                  RPM
                                                                </option>
                                                                <option value="KM/HR">
                                                                  KM/HR
                                                                </option>
                                                              </select>
                                                              <i></i>
                                                            </label>
                                                          </div>
                                                        </div>
                                                      </div>
                                                    </div>
                                                  </div>
                                                  <div
                                                    id="Fotos"
                                                    className="tab-pane fade "
                                                  >
                                                    <div className="col-md-12 unit">
                                                      {/* start cloned right side buttons element */}
                                                      <div className="clone-rightside-btn-1">
                                                        <label className="label">
                                                          Fotos/Documentos
                                                        </label>
                                                        {framesFotosDocs}
                                                        <a
                                                          className="btn"
                                                          style={{
                                                            margin: "10px",
                                                          }}
                                                          onClick={() =>
                                                            addFotosDoc()
                                                          }
                                                        >
                                                          <i className="zmdi zmdi-plus"></i>{" "}
                                                          Agregar Archivo
                                                        </a>
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
               
                              <div className="widget-wrap">
                                <div className="widget-header block-header margin-bottom-0 clearfix">
                                  <div className="pull-left">
                                    <h3>Otros Datos</h3>
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
                                              <label className="label">
                                                Tarjeta IAVE
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
                                            <div className="col-sm-6 col-md-2-5 col-lg-2-5 unit">
                                              <label className="label">
                                                Horómetro
                                              </label>
                                              <div className="input">
                                                <input
                                                  onChange={handleChange}
                                                  value={state.horometro}
                                                  name="horometro"
                                                  className="form-control"
                                                  type="number"
                                                  placeholder="00:00"
                                                  id="text"
                                                />
                                              </div>
                                            </div>
                                          </div>
                                          <div className="row">
                                          <div className="col-sm-6 col-md-2-5 col-lg-2-5 unit">
                                              <label className="label">
                                                Tarjeta EPASS
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
                                            <div className="col-sm-6 col-md-2-5 col-lg-2-5 unit">
                                              <label className="label">
                                                Horas trabajadas motor GPS
                                              </label>
                                              <div className="input">
                                                <input
                                                  onChange={handleChange}
                                                  value={
                                                    state.horasTrabajadasMotorNoGPS
                                                  }
                                                  name="horasTrabajadasMotorNoGPS"
                                                  className="form-control"
                                                  type="number"
                                                  placeholder=""
                                                  id="text"
                                                />
                                              </div>
                                            </div>
                                          </div>
                                          <div className="row">
                                          <div className="col-sm-6 col-md-2-5 col-lg-2-5 unit">
                                                <label className="label">
                                                Calculo Reporte de Ingresos (%)
                                              </label>
                                              <div className="input">
                                                <input
                                                  onChange={handleChange}
                                                  value={
                                                    state.porcentajeRepIngresos
                                                  }
                                                  name="porcentajeRepIngresos"
                                                  className="form-control"
                                                  type="number"
                                                  placeholder=""
                                                  id="text"
                                                />
                                              </div>
                                            </div>
                                            <div className="col-sm-6 col-md-2-5 col-lg-2-5 unit">
                                              <label className="label">
                                                Horas trabajadas Motor{" "}
                                              </label>
                                              <div className="input">
                                                <input
                                                  onChange={handleChange}
                                                  value={
                                                    state.horasTrabajasMotor
                                                  }
                                                  name="horasTrabajasMotor"
                                                  className="form-control"
                                                  type="number"
                                                  placeholder=""
                                                  id="text"
                                                />
                                              </div>
                                            </div>
                                          </div>
                                          <div className="row">
                                          <div className="col-sm-6 col-md-2-5 col-lg-2-5 unit">
                                              <label className="label">
                                                Odómetro (Kms)
                                              </label>
                                              <div className="input">
                                                <input
                                                  onChange={handleChange}
                                                  value={state.odometro}
                                                  name="odometro"
                                                  className="form-control"
                                                  type="number"
                                                  placeholder=""
                                                  id="text"
                                                />
                                              </div>
                                            </div>
                                            <div className="col-sm-6 col-md-2-5 col-lg-2-5 unit">
                                              <label className="label">
                                                Odómetro GPS (Kms)
                                              </label>
                                              <div className="input">
                                                <input
                                                  onChange={handleChange}
                                                  value={state.odometroGPSKMS}
                                                  name="odometroGPSKMS"
                                                  className="form-control"
                                                  type="text"
                                                  placeholder=""
                                                  id="text"
                                                />
                                              </div>
                                            </div>
                                            <div className="col-sm-6 col-md-2-5 col-lg-2-5 unit">
                                              <label className="label">
                                                Propietario
                                              </label>
                                              <label className="input select">
                                                <select
                                                  onChange={handleChange}
                                                  value={state.idPropietario}
                                                  name="idPropietario"
                                                  className="form-control"
                                                  disabled
                                                >
                                                  <option value="0">
                                                    Sin Propietario
                                                  </option>
                                                </select>
                                                <i></i>
                                              </label>
                                            </div>
                                            <div className="col-sm-0 col-md-1 col-lg-2 unit"></div>
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

                              {/*Fin de ejemplo*/}
                           
                            </div>
                          </div>
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

export default Unidades;
