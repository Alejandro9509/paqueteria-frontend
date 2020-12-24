import React, { useEffect, useState, useMemo } from "react";
import axios from "axios";
import Cabecera from "../Components/Template/Cabecera";
import BarraLateralIzquierda from "../Components/Template/BarraLateralIzquierda";
import BarraLateralDerecha from "../Components/Template/BarraLateralDerecha";
import ExportCSV from '../Components/Template/Export';
import ExportPDF from "../Components/Template/ExportPDF";
import * as XLSX from 'xlsx';
import { useTable, useFilters, useGlobalFilter, useSortBy } from 'react-table'
import $ from 'jquery';
window.jQuery = window.$ = $;

function Recoleccion() {

  const [data, setData] = React.useState([])
  const [dataSucursal, setDataSucursal] = React.useState([]);
  const [dataEstatusRecoleccion, setEstatusRecoleccion] = React.useState([]);
  const [dataTipoCobro, setDataTipoCobro] = React.useState([]);
  const [state, setState] = React.useState({
    showPopUp: false,
    agregar: "Agregar",
    idRecoleccion: 0,
    fechaInicial: "",
    fechaIcinial2: "",
    sucursalListado: 0,
    estatusListado: 0,
    idSucursalAgregar: 0,
    folioRecoleccion: "",
    folioEmbarque: "",
    folioGuía: "",
    folioInforme: "",
    fechaHoraCreacion: "",
    estatusRecoleccion: 0,
    moneda: "",
    tipoCambio: "",
    tipoCobro: "",
    nombreRemitente: "",
    RFCRemitente: "",
    domicilioRemitente: "",
    codigoPostalRemitente: "",
    ciudadRemitente: "",
    correoRemitente: "",
    telefonoRemitente: "",
    contactoRemitente: "",
    origenRemitente: "",
    nombreDestinatario: "",
    RFCDestinatario: "",
    domicilioDestinatario: "",
    codigoPostalDestinatario: "",
    ciudadDestinatario: "",
    correoDestinatario: "",
    telefonoDestinatario: "",
    contactoDestinatario: "",
    destinoDestinatario: "",
    ciudadRemitente: "",
    ciudadDestinatario: "",
    fechaRecoleccion: "",
    horaRecoleccion: "",
    fechaEntrega: "",
    horaEntrega: "",
    codigoPostalRecoleccion: "",
    ciudadRecoleccion: "",
    zonaRecoleccion: "",
    domicilioRecoleccion: "",
    recogerEn: "",
    datosAdicionalesRecoleccion: "",
    codigoPostalEntrega: "",
    ciudadEntrega: "",
    zonaEntrega: "",
    domicilioEntrega: "",
    entregaEn: "",
    datosAdicionalesEntrega: "",
    cantidadDePaquetes: 0,
    cantidadDeSobres: 0,
    diferenteRecoleccion: false,
    diferenteEntrega: false,
  })
  const [fileUploaded, setFileUploaded] = React.useState([])
  const [stepActive, setStepActive] = React.useState(1);


  const handleAceptar = (e) => {
    e.preventDefault()

    var fechaYHora = state.fechaHoraCreacion.split("T")

    var params = {

      "m_nIdSucursal": state.idSucursalAgregar,
      "m_nIdEmbarque": state.folioEmbarque,
      "m_nIdGuia": state.folioGuía,
      "m_nIdInforme": state.folioInforme,
      "m_dFecha": fechaYHora[0],
      "m_tHora": fechaYHora[1],
      "m_nMoneda": state.moneda,
      "m_rTipoCambio": state.tipoCambio,
      "m_nIdTipoDeCobro": state.tipoCobro,
      "m_sNombreRemitente": state.nombreRemitente,
      "m_sNombreDestinatario": state.nombreDestinatario,
      "m_sRFCRemitente": state.RFCRemitente,
      "m_sRFCDestinatario": state.RFCDestinatario,
      "m_sDomicilioRemitente": state.domicilioRemitente,
      "m_sDomicilioDestinatario": state.domicilioDestinatario,
      "m_sIdCodigoPostalRemitente": state.codigoPostalRemitente,
      "m_sIdCodigoPostalDestinatario": state.codigoPostalDestinatario,
      "m_nIdCiudadRemitente": state.ciudadRemitente,
      "m_nIdCiudadDestinatario": state.ciudadDestinatario,
      "m_sCorreoRemitente": state.correoRemitente,
      "m_sCorreoDestinatario": state.correoDestinatario,
      "m_sTelefonoRemitente": state.telefonoRemitente,
      "m_sTelefonoDestinatario": state.telefonoDestinatario,
      "m_sContactoRemitente": state.contactoRemitente,
      "m_sContactoDestinatario": state.contactoDestinatario,
      "m_nIdCiudadOrigen": state.ciudadRemitente,
      "m_nIdCiudadDestino": state.ciudadDestinatario,
      "m_dFechaDetalleRecoleccion": state.fechaRecoleccion,
      "m_tHoraDetalleRecoleccion": state.horaRecoleccion,
      "m_tFechaDetalleEntrega": state.fechaEntrega,
      "m_tHoraDetalleEntrega": state.horaEntrega,
      "m_nIdCPDetalleRecoleccion": state.codigoPostalRecoleccion,
      "m_nIdCiudadDetalleRecoleccion": state.ciudadRecoleccion,
      "m_nIdZonaDetalleRecoleccion": state.zonaRecoleccion,
      "m_sDomicilioDetalleRecoleccion": state.domicilioRecoleccion,
      "m_sRecogerEnDetalleRecoleccion": state.recogerEn,
      "m_sDatosAdicionalesDetalleRecoleccion": state.datosAdicionalesRecoleccion,
      "m_nIdCPDetalleEntrega": state.codigoPostalEntrega,
      "m_nIdCiudadDetalleEntrega": state.ciudadEntrega,
      "m_nIdZonaDetalleEntrega": state.zonaEntrega,
      "m_sDomicilioDetalleEntrega": state.domicilioEntrega,
      "m_sEntregarEnDetalleEntrega": state.entregaEn,
      "m_sDatosAdicionalesDetalleEntrega": state.datosAdicionalesEntrega,
    }
    console.log(params)
    alert(JSON.stringify(params))
    if (state.idRecoleccion != 0) {
      const url = "http://localhost/Recoleccion/Modificar/" + state.idRecoleccion;
      axios.put(url, Object.assign({}, params), { headers }).then(respuesta => {
        alert(respuesta.data)
        //window.location.reload();
      }).catch(err => {
        console.log(err)
        alert("err")
      });
    } else {
      const url = "http://localhost/Recoleccion/Agregar";
      axios.post(url, Object.assign({}, params), { headers }).then(respuesta => {
        alert(respuesta.data)
        //window.location.reload();
      }).catch(err => {
        console.log(err)
        alert(err)
      });
    }

  }

  function handleEliminar(id) {
    const url = "http://localhost/Departamento/Eliminar/" + id;
    axios.delete(url, { headers }).then(respuesta => {
      alert(respuesta.data)
      window.location.reload();
    }).catch(err => {
      alert(err)
    });
  }

  function handleShowModificar(row) {
    console.log(row.original.m_nIdDepartamento)
    const url = "http://localhost/Departamento/GetById/" + row.original.m_nIdDepartamento;
    axios.get(url, { headers }).then(respuesta => {
      console.log(respuesta.data)
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

  function handleShowAgregar() {
    setState({
      ...state,
      agregar: "Agregar",
      showPopUp: true,
      idDepartamento: 0,
      codigoDepartamento: 0,
      descripcionDepartamento: ""
    })
  }

  const handleChange = event => {
    console.log(event.target.id + " : " + event.target.value)
    setState({
      ...state,
      [event.target.id]: event.target.value
    });
  };

  const handleRecoleccionCheckboxChange = event => {
    console.log("diferenteRecoleccion : " + state.diferenteRecoleccion)
    setState({
      ...state,
      diferenteRecoleccion: !state.diferenteRecoleccion
    });
  }

  const handleEntregaCheckboxChange = event => {
    console.log("diferenteEntrega : " + state.diferenteEntrega)
    setState({
      ...state,
      diferenteEntrega: !state.diferenteEntrega
    });
  }

  const columns = React.useMemo(() => [
    {
      Name: "Folio",
      accessor: "m_nCodigo",
    }, {
      Name: "Descripción",
      accessor: "m_sDescripcion",
    }, {
      Name: "Creado El",
      accessor: "m_dtCreadoEl",
    }, {
      Name: "Creado Por",
      accessor: "m_nCreadoPor",
    }, {
      Name: "Modificado El",
      accessor: "m_dtModificadoEl",
    }, {
      Name: "Modificado Por",
      accessor: "m_nModificadoPor",
    }

  ]);

  useEffect(value => {
    getAllData();
    getAllSucursales();
    getAllEstatusRecoleccion();
    getAllTipoCobro();
  }, []);

  function getAllData() {
    const url = "http://localhost/Recoleccion/GetListado";
    axios.get(url, { headers }).then(respuesta => {
      setData(respuesta.data)
    });
  };

  function getAllSucursales() {
    const url = "http://localhost/Sucursales/GetListado";
    axios.get(url, { headers }).then((respuesta) => {
      setDataSucursal(respuesta.data);
    });
  }

  function getAllEstatusRecoleccion() {
    const url = "http://localhost/SisEstatus/getListadoRecoleccion";
    axios.get(url, { headers }).then((respuesta) => {
      setEstatusRecoleccion(respuesta.data);
    });
  }

  function getAllTipoCobro() {
    const url = "http://localhost/TipoCobro/GetListado";
    axios.get(url, { headers }).then((respuesta) => {
      setDataTipoCobro(respuesta.data);
    });
  }

  const handleUpload = (e) => {
    e.preventDefault();

    var files = e.target.files, f = files[0];
    var reader = new FileReader();
    console.log(e.target.files)
    reader.onload = function (e) {
      console.log("Nothing Happened")
      var data = e.target.result;
      let readedData = XLSX.read(data, { type: 'binary' });
      const wsname = readedData.SheetNames[0];
      const ws = readedData.Sheets[wsname];

      /* Convert array to json*/
      const dataParse = XLSX.utils.sheet_to_json(ws, { header: 1 });
      console.log("dataParse : " + dataParse)
      setFileUploaded(dataParse);
    };
    reader.readAsBinaryString(f)
  }

  const headers = {
    'Content-Type': 'application/json',
    //    'access-control-allow-origin': '*'
  }

  function conDatos() {
    return data.length != 0
  }

  function DefaultColumnFilter({
    column: { filterValue, preFilteredRows, setFilter },
  }) {
    const count = preFilteredRows.length

    return (
      <input
        className="form-control"
        value={filterValue || ''}
        onChange={e => {
          setFilter(e.target.value || undefined)
        }}
        placeholder={`Buscar ${count} registros...`}
      />
    )
  }

  function Table({ columns, data }) {

    const defaultColumn = React.useMemo(
      () => ({
        // Default Filter UI
        Filter: DefaultColumnFilter,
      }),
      []
    )

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
        defaultColumn
      },
      useFilters,
      useGlobalFilter,
      useSortBy
    )

    return (
      <div className="col-md-12">
        <table className="table" {...getTableProps()}>
          <thead>
            {headerGroups.map(headerGroup => (
              <tr {...headerGroup.getHeaderGroupProps()}>
                <th></th>
                {headerGroup.headers.map(column => (
                  // Add the sorting props to control sorting. For this example
                  // we can add them into the header props
                  <th {...column.getHeaderProps(column.getSortByToggleProps())}>
                    {column.render('Name')}
                    {/* Add a sort direction indicator */}
                    <span>
                      {column.isSorted
                        ? column.isSortedDesc
                          ? <i className="fa fa-caret-up" />
                          : <i className="fa fa-caret-down" />
                        : ''}
                    </span>
                    <div>{column.canFilter ? column.render('Filter') : null}</div>
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
                  <tr {...row.getRowProps()}>
                    <td>
                      <div>
                        <a href="#Agregar" role="tab" data-toggle="tab" onClick={() => (handleShowModificar(row))} className="btn btn-default btn-sm m-user-edit"><i className="zmdi zmdi-edit" /></a>
                        <a href="#" className="btn btn-default btn-sm m-user-delete" onClick={() => (handleEliminar(row.original.m_nIdDepartamento))}><i className="zmdi zmdi-close" /></a>
                      </div>
                    </td>
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
    )
  }

  function openSection(index) {
    closeSeccions()
    var $section;
    switch (index) {
      case 1:
        setStepActive(1);
        $section = $("#informacionGeneral")
        break;
      case 2:
        setStepActive(2);
        $section = $("#remitenteDestinatario")

        break;
      case 3:
        setStepActive(3);
        $section = $("#detallesDeLaRecoleccion")

        break;
      case 4:
        setStepActive(4);
        $section = $("#informacionAdicional")
        break;
      case 5:
        setStepActive(5);
        $section = $("#general")
        break;
      case 6:
        setStepActive(6);
        $section = $("#contacto")
        break;
      case 7:
        setStepActive(7);
        $section = $("#otros")
        break;
      default:
    }

    var $welem = $section.parentsUntil(".widget-action-bar").parentsUntil(".w-action").parents(".widget-header").next(".widget-container");

    $welem.slideDown();
    $section.children("a").children("i").removeClass("zmdi-chevron-up");
    $section.children("a").children("i").addClass("zmdi-chevron-down");
    $('html, body').animate({
      scrollTop: parseInt($section.offset().top)
    }, 200);


  }

  function closeSeccions() {
    //Cerrar todas las seciones
    var $section = $(".widget-toggle")
    $section.each(function () {
      var $welem = $(this).parentsUntil(".widget-action-bar").parentsUntil(".w-action").parents(".widget-header").next(".widget-container");
      $welem.slideUp();
      $(this).children("a").children("i").removeClass("zmdi-chevron-down");
      $(this).children("a").children("i").addClass("zmdi-chevron-up");
    });
  }

  return (
    <div>

      <header className="topbar clearfix">
        <Cabecera />
      </header>

      {/*Leftbar Start Here*/}
      <aside className="iconic-leftbar">
        <BarraLateralIzquierda />
      </aside>
      {/*Leftbar End Here*/}

      {/*Page Container Start Here*/}
      <section className="main-container">
        <div className="container-fluid">

          <div className="page-header full-block light">
            <h2>Recolección</h2>
          </div>

          <ul className="nav nav-tabs">
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
              <a data-toggle="tab" href="#Importar">
                <i className="fa fa-upload" /> Importar
            </a>
            </li>
            <li>
              <ExportCSV csvData={data} fileName="Departamento_Listado" />
            </li>
            <li>
              <ExportPDF data={data} column={columns} fileName="Departamento" />
            </li>
          </ul>

          <div className="row" className="tab-content">
            <div id="Listado" className="tab-pane fade in active">
              <div className="widget-wrap">
                <div className="widget-content">
                  <div>
                    <form className="j-forms">
                      <div className="form-content">
                        <div className="col-sm-6 col-md-3 unit">
                          <label className="label">
                            Fecha Inicial
                        </label>
                          <div className="input">
                            <input type="date" className="form-control" />
                          </div>
                        </div>

                        <div className="col-sm-6 col-md-3 unit">
                          <label className="label">
                            Fecha Inicial
                        </label>
                          <div className="input">
                            <input
                              type="date"
                              className="form-control"
                              onChange={handleChange}
                              id="fechaInicial"
                            />

                          </div>
                        </div>

                        <div className="col-sm-6 col-md-3 unit">
                          <label className="label">
                            Sucursal
                        </label>
                          <label className="input select">
                            <select
                              className="form-control"
                              required
                              onChange={handleChange}
                              id="sucursal"
                            >
                              <option value="0">
                                Todas
                            </option>
                              {dataSucursal.map(
                                (sucursal) => (
                                  <option key={sucursal.m_nIdSucursal} value={sucursal.m_nIdSucursal}>
                                    {
                                      sucursal.m_sSucursal
                                    }
                                  </option>
                                )
                              )}
                            </select>
                            <i></i>
                          </label>
                        </div>

                        <div className="col-sm-6 col-md-3 unit">
                          <label className="label">
                            Estatus
                        </label>
                          <label className="input select">
                            <select
                              className="form-control"
                              required
                              onChange={handleChange}
                              id="estatus"
                            >
                              <option value="0">
                                Todos
                            </option>
                              {dataEstatusRecoleccion.map(
                                (estatus) => (
                                  <option key={estatus.m_nIdEstatusRecoleccion} value={estatus.m_nIdEstatusRecoleccion}>
                                    {
                                      estatus.m_sEstatus
                                    }
                                  </option>
                                )
                              )}
                            </select>
                            <i></i>
                          </label>
                        </div>

                      </div>
                    </form>
                  </div>
                  <div className="row">
                    {conDatos() ? <Table columns={columns} data={data} /> : <div>No se encontró ningún registro</div>}
                  </div>
                </div>
              </div>
            </div>

            <div id="Agregar" className="tab-pane fade">

              <form className="j-forms">
                <div className="form-content">

                  <div className="widget-wrap">
                    <div className="wizard-breadcrumb number-style" style={{ position: "sticky", top: "50px", padding: "5px", backgroundColor: "white", zIndex: 100 }}>
                      <div className="row">
                        <div className={"col-md-2 col-sm-2 step" + (stepActive == 1 && "active-step")}
                          onClick={() => openSection(1)}
                        >
                          <div className={"steps"}>
                            <span className={"step-number"}>1</span>
                            <p>Información General</p>
                          </div>
                        </div>
                        <div className={"col-md-2 col-sm-2 step" + (stepActive == 2 && "active-step")}
                          onClick={() => openSection(2)}
                        >
                          <div className="steps">
                            <span className="step-number">2</span>
                            <p>Remitentes / Destinatario</p>
                          </div>
                        </div>
                        <div className={"col-md-2 col-sm-2 step" + (stepActive == 3 && "active-step")}
                          onClick={() => openSection(3)}
                        >
                          <div className="steps">
                            <span className="step-number">3</span>
                            <p>Detalles de la Recolección</p>
                          </div>
                        </div>
                        <div className={"col-md-2-5 col-sm-2 step" + (stepActive == 4 && "active-step")}
                          onClick={() => openSection(4)}
                        >
                          <div className="steps">
                            <span className="step-number">4</span>
                            <p>Información Adicional del Pago</p>
                          </div>
                        </div>
                        <div className={"col-md-1-5 col-sm-2 step" + (stepActive == 5 && "active-step")}
                          onClick={() => openSection(5)}
                        >
                          <div className="steps">
                            <span className="step-number">5</span>
                            <p>General</p>
                          </div>
                        </div>
                        <div className={"col-md-1 col-sm-2 step" + (stepActive == 6 && "active-step")}
                          onClick={() => openSection(6)}
                        >
                          <div className="steps">
                            <span className="step-number">6</span>
                            <p>Contacto</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="widget-wrap" id="informacionGeneral">
                    <div className="widget-header">
                      <h2>Información General</h2>
                    </div>
                    <div className="widget-container">
                      <div className="widget-content">
                        <div className="row">
                          <div className="col-md-12">

                            <div className="col-sm-4 col-md-2-5 unit">
                              <label className="label">
                                Sucursal
                          </label>
                              <label className="input select">
                                <select
                                  className="form-control"
                                  required
                                  onChange={handleChange}
                                  id="sucursalAgregar"
                                >
                                  {dataSucursal.map(
                                    (sucursal) => (
                                      <option key={sucursal.m_nIdSucursal} value={sucursal.m_nIdSucursal}>
                                        {
                                          sucursal.m_sSucursal
                                        }
                                      </option>
                                    )
                                  )}
                                </select>
                                <i className="fa fa-arrow-down" />
                              </label>
                            </div>

                            <div className="col-sm-4 col-md-2-5 unit">
                              <label className="label">
                                Folio Recolección
                          </label>
                              <div className="input">
                                <input
                                  onChange={handleChange}
                                  className="form-control"
                                  type="text"
                                  placeholder={state.folioRecoleccion}
                                  id="folioRecoleccion"
                                  readOnly
                                />
                              </div>
                            </div>

                            <div className="col-sm-4 col-md-2-5 unit">
                              <label className="label">
                                Folio Embarque
                          </label>
                              <div className="input">
                                <input
                                  onChange={handleChange}
                                  className="form-control"
                                  type="text"
                                  placeholder={state.folioEmbarque}
                                  id="folioEmbarque"
                                  readOnly
                                />
                              </div>
                            </div>

                            <div className="col-sm-4 col-md-2-5 unit">
                              <label className="label">
                                Folio Guía
                          </label>
                              <div className="input">
                                <input
                                  onChange={handleChange}
                                  className="form-control"
                                  type="text"
                                  placeholder={state.folioGuía}
                                  id="folioGuía"
                                  readOnly
                                />
                              </div>
                            </div>

                            <div className="col-sm-4 col-md-2-5 unit">
                              <label className="label">
                                Folio Informe
                          </label>
                              <div className="input">
                                <input
                                  onChange={handleChange}
                                  className="form-control"
                                  type="text"
                                  placeholder={state.folioInforme}
                                  id="folioInforme"
                                  readOnly
                                />
                              </div>
                            </div>

                            <div className="col-sm-4 col-md-2-5 unit">
                              <label className="label">
                                Fecha / Hora
                          </label>
                              <div className="input">
                                <input
                                  onChange={handleChange}
                                  type="datetime-local"
                                  className="form-control"
                                  id="fechaHoraCreacion"
                                />
                              </div>
                            </div>

                            <div className="col-sm-4 col-md-2-5 unit">
                              <label className="label">
                                Estatus de la Recolección
                          </label>
                              <label className="input select">
                                <select
                                  className="form-control"
                                  required
                                  onChange={handleChange}
                                  id="estatus"
                                >
                                  {dataEstatusRecoleccion.map(
                                    (estatus) => (
                                      <option key={estatus.m_nIdEstatusRecoleccion} value={estatus.m_nIdEstatusRecoleccion}>
                                        {
                                          estatus.m_sEstatus
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
                                Moneda
                          </label>
                              <div className="input">
                                <input
                                  onChange={handleChange}
                                  className="form-control"
                                  type="text"
                                  placeholder={state.moneda}
                                  id="moneda"
                                />
                              </div>
                            </div>

                            <div className="col-sm-4 col-md-2-5 unit">
                              <label className="label">
                                Tipo de Cambio
                          </label>
                              <div className="input">
                                <input
                                  onChange={handleChange}
                                  className="form-control"
                                  type="text"
                                  placeholder={state.tipoCambio}
                                  id="tipoCambio"
                                />
                              </div>
                            </div>

                            <div className="col-sm-4 col-md-2-5 unit">
                              <label className="label">
                                Tipo Cobro
                          </label>
                              <label className="input select">
                                <select
                                  className="form-control"
                                  required
                                  onChange={handleChange}
                                  id="tipoCobro"
                                >

                                  {dataTipoCobro.map(
                                    (tipoCobro) => (
                                      <option key={tipoCobro.m_nIdTipoCobro} value={tipoCobro.m_nIdTipoCobro}>
                                        {
                                          tipoCobro.m_sDescripcion
                                        }
                                      </option>
                                    )
                                  )}
                                </select>
                                <i></i>
                              </label>
                            </div>

                          </div>
                        </div>
                      </div>
                    </div>

                  </div>


                  <div className="col-md-7">

                    <div className="widget-wrap">
                      <div className="widget-header">
                        <div className="col-md-6">
                          <h2>Remitente</h2>
                        </div>
                        <div className="col-md-6">
                          <h2>Destinatario</h2>
                        </div>
                      </div>
                      <div className="widget-container">
                        <div className="widget-content">
                          <div className="row">
                            <div className="col-md-6">

                              <div className="col-sm-4 col-md-6 unit">
                                <label className="label">
                                  Nombre
                        </label>
                                <div className="input">
                                  <input
                                    onChange={handleChange}
                                    className="form-control"
                                    type="text"
                                    placeholder={state.nombreRemitente}
                                    id="nombreRemitente"
                                  />
                                </div>
                              </div>

                              <div className="col-sm-4 col-md-6 unit">
                                <label className="label">
                                  RFC
                        </label>
                                <div className="input">
                                  <input
                                    onChange={handleChange}
                                    className="form-control"
                                    type="text"
                                    placeholder={state.RFCRemitente}
                                    id="RFCRemitente"
                                  />
                                </div>
                              </div>

                              <div className="col-sm-4 col-md-6 unit">
                                <label className="label">
                                  Domicilio
                        </label>
                                <div className="input">
                                  <input
                                    onChange={handleChange}
                                    className="form-control"
                                    type="text"
                                    placeholder={state.domicilioRemitente}
                                    id="domicilioRemitente"
                                  />
                                </div>
                              </div>

                              <div className="col-sm-4 col-md-6 unit">
                                <label className="label">
                                  Código Postal
                        </label>
                                <div className="input">
                                  <input
                                    onChange={handleChange}
                                    className="form-control"
                                    type="text"
                                    placeholder={state.codigoPostalRemitente}
                                    id="codigoPostalRemitente"
                                  />
                                </div>
                              </div>

                              <div className="col-sm-4 col-md-6 unit">
                                <label className="label">
                                  Ciudad
                        </label>
                                <div className="input">
                                  <input
                                    onChange={handleChange}
                                    className="form-control"
                                    type="text"
                                    placeholder={state.ciudadRemitente}
                                    id="ciudadRemitente"
                                  />
                                </div>
                              </div>

                              <div className="col-sm-4 col-md-6 unit">
                                <label className="label">
                                  Correo Electrónico
                        </label>
                                <div className="input">
                                  <input
                                    onChange={handleChange}
                                    className="form-control"
                                    type="text"
                                    placeholder={state.correoRemitente}
                                    id="correoRemitente"
                                  />
                                </div>
                              </div>

                              <div className="col-sm-4 col-md-6 unit">
                                <label className="label">
                                  Teléfono
                        </label>
                                <div className="input">
                                  <input
                                    onChange={handleChange}
                                    className="form-control"
                                    type="text"
                                    placeholder={state.telefonoRemitente}
                                    id="telefonoRemitente"
                                  />
                                </div>
                              </div>

                              <div className="col-sm-4 col-md-6 unit">
                                <label className="label">
                                  Contacto
                        </label>
                                <div className="input">
                                  <input
                                    onChange={handleChange}
                                    className="form-control"
                                    type="text"
                                    placeholder={state.contactoRemitente}
                                    id="contactoRemitente"
                                  />
                                </div>
                              </div>

                              <div className="col-sm-12 col-md-6 unit">
                                <label className="label">
                                  Recolección en Diferente Domicilio
                                </label>
                                <div className="input">
                                  <input
                                    onChange={handleRecoleccionCheckboxChange}
                                    className="form-control"
                                    type="checkbox"
                                    id="diferenteRecoleccion"
                                  />
                                </div>
                              </div>

                            </div>
                            <div className="col-md-6">

                              <div className="col-sm-4 col-md-6 unit">
                                <label className="label">
                                  Nombre
                          </label>
                                <div className="input">
                                  <input
                                    onChange={handleChange}
                                    className="form-control"
                                    type="text"
                                    placeholder={state.nombreDestinatario}
                                    id="nombreDestinatario"
                                  />
                                </div>
                              </div>

                              <div className="col-sm-4 col-md-6 unit">
                                <label className="label">
                                  RFC
                          </label>
                                <div className="input">
                                  <input
                                    onChange={handleChange}
                                    className="form-control"
                                    type="text"
                                    placeholder={state.RFCDestinatario}
                                    id="RFCDestinatario"
                                  />
                                </div>
                              </div>

                              <div className="col-sm-4 col-md-6 unit">
                                <label className="label">
                                  Domicilio
                          </label>
                                <div className="input">
                                  <input
                                    onChange={handleChange}
                                    className="form-control"
                                    type="text"
                                    placeholder={state.domicilioDestinatario}
                                    id="domicilioDestinatario"
                                  />
                                </div>
                              </div>

                              <div className="col-sm-4 col-md-6 unit">
                                <label className="label">
                                  Código Postal
                          </label>
                                <div className="input">
                                  <input
                                    onChange={handleChange}
                                    className="form-control"
                                    type="text"
                                    placeholder={state.codigoPostalDestinatario}
                                    id="codigoPostalDestinatario"
                                  />
                                </div>
                              </div>

                              <div className="col-sm-4 col-md-6 unit">
                                <label className="label">
                                  Ciudad
                          </label>
                                <div className="input">
                                  <input
                                    onChange={handleChange}
                                    className="form-control"
                                    type="text"
                                    placeholder={state.ciudadDestinatario}
                                    id="ciudadDestinatario"
                                  />
                                </div>
                              </div>

                              <div className="col-sm-4 col-md-6 unit">
                                <label className="label">
                                  Correo Electrónico
                          </label>
                                <div className="input">
                                  <input
                                    onChange={handleChange}
                                    className="form-control"
                                    type="text"
                                    placeholder={state.correoDestinatario}
                                    id="correoDestinatario"
                                  />
                                </div>
                              </div>

                              <div className="col-sm-4 col-md-6 unit">
                                <label className="label">
                                  Teléfono
                          </label>
                                <div className="input">
                                  <input
                                    onChange={handleChange}
                                    className="form-control"
                                    type="text"
                                    placeholder={state.telefonoDestinatario}
                                    id="telefonoDestinatario"
                                  />
                                </div>
                              </div>

                              <div className="col-sm-4 col-md-6 unit">
                                <label className="label">
                                  Contacto
                          </label>
                                <div className="input">
                                  <input
                                    onChange={handleChange}
                                    className="form-control"
                                    type="text"
                                    placeholder={state.contactoDestinatario}
                                    id="contactoDestinatario"
                                  />
                                </div>
                              </div>

                              <div className="col-sm-12 col-md-6 unit">
                                <label className="label">
                                  Entrega en Diferente Domicilio
                                </label>
                                <div className="input">
                                  <input
                                    onChange={handleEntregaCheckboxChange}
                                    className="form-control"
                                    type="checkbox"
                                    id="diferenteEntrega"
                                  />
                                </div>
                              </div>


                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    {(state.diferenteRecoleccion || state.diferenteEntrega) ?
                      <div className="widget-wrap" id="detallesDeLaRecoleccion">
                        {state.diferenteRecoleccion ?
                          <div>
                            <div className="widget-header">
                              <h2>Detalles de la Recolección</h2>
                            </div>
                            <div className="widget-container">
                              <div className="widget-content">
                                <div className="row">
                                  <div className="col-md-12">

                                    <div className="col-sm-4 col-md-4 unit">
                                      <label className="label">
                                        Fecha y Hora
                                            </label>
                                      <div className="input">
                                        <input
                                          onChange={handleChange}
                                          className="form-control"
                                          type="datetime-local"
                                          placeholder={state.fechaRecoleccion}
                                          id="fechaRecoleccion"
                                        />
                                      </div>
                                    </div>

                                    <div className="col-sm-4 col-md-4 unit">
                                      <label className="label">
                                        Código Postal
                                            </label>
                                      <div className="input">
                                        <input
                                          onChange={handleChange}
                                          className="form-control"
                                          type="text"
                                          placeholder={state.codigoPostalRecoleccion}
                                          id="codigoPostalRecoleccion"
                                        />
                                      </div>
                                    </div>

                                    <div className="col-sm-4 col-md-4 unit">
                                      <label className="label">
                                        Ciudad
                                            </label>
                                      <div className="input">
                                        <input
                                          onChange={handleChange}
                                          className="form-control"
                                          type="text"
                                          placeholder={state.ciudadRecoleccion}
                                          id="ciudadRecoleccion"
                                        />
                                      </div>
                                    </div>

                                    <div className="col-sm-4 col-md-4 unit">
                                      <label className="label">
                                        Zona
                                            </label>
                                      <div className="input">
                                        <input
                                          onChange={handleChange}
                                          className="form-control"
                                          type="text"
                                          placeholder={state.zonaRecoleccion}
                                          id="zonaRecoleccion"
                                        />
                                      </div>
                                    </div>

                                    <div className="col-sm-4 col-md-8 unit">
                                      <label className="label">
                                        Domicilio
                                            </label>
                                      <div className="input">
                                        <input
                                          onChange={handleChange}
                                          className="form-control"
                                          type="text"
                                          placeholder={state.domicilioRecoleccion}
                                          id="domicilioRecoleccion"
                                        />
                                      </div>
                                    </div>

                                    <div className="col-sm-4 col-md-12 unit">
                                      <label className="label">
                                        Recoger En
                                            </label>
                                      <div className="input">
                                        <input
                                          onChange={handleChange}
                                          className="form-control"
                                          type="text"
                                          placeholder={state.recogerEn}
                                          id="recogerEn"
                                        />
                                      </div>
                                    </div>

                                    <div className="col-sm-4 col-md-12 unit">
                                      <label className="label">
                                        Datos Adicionales para la Recolección
                                            </label>
                                      <div className="input">
                                        <input
                                          onChange={handleChange}
                                          className="form-control"
                                          type="text"
                                          placeholder={state.datosAdicionalesRecoleccion}
                                          id="datosAdicionalesRecoleccion"
                                        />
                                      </div>
                                    </div>

                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                          : <div></div>
                        }

                        {state.diferenteEntrega ?
                          <div>
                            <div className="widget-header">
                              <h2>Detalles de la Entrega</h2>
                            </div>
                            <div className="widget-container">
                              <div className="widget-content">
                                <div className="row">
                                  <div className="col-md-12">

                                    <div className="col-sm-4 col-md-4 unit">
                                      <label className="label">
                                        Fecha y Hora
                                                                    </label>
                                      <div className="input">
                                        <input
                                          onChange={handleChange}
                                          className="form-control"
                                          type="datetime-local"
                                          placeholder={state.fechaEntrega}
                                          id="fechaEntrega"
                                        />
                                      </div>
                                    </div>

                                    <div className="col-sm-4 col-md-4 unit">
                                      <label className="label">
                                        Código Postal
                                                                    </label>
                                      <div className="input">
                                        <input
                                          onChange={handleChange}
                                          className="form-control"
                                          type="text"
                                          placeholder={state.codigoPostalEntrega}
                                          id="codigoPostalEntrega"
                                        />
                                      </div>
                                    </div>

                                    <div className="col-sm-4 col-md-4 unit">
                                      <label className="label">
                                        Ciudad
                                                                    </label>
                                      <div className="input">
                                        <input
                                          onChange={handleChange}
                                          className="form-control"
                                          type="text"
                                          placeholder={state.ciudadEntrega}
                                          id="ciudadEntrega"
                                        />
                                      </div>
                                    </div>

                                    <div className="col-sm-4 col-md-4 unit">
                                      <label className="label">
                                        Zona
                                                                    </label>
                                      <div className="input">
                                        <input
                                          onChange={handleChange}
                                          className="form-control"
                                          type="text"
                                          placeholder={state.zonaEntrega}
                                          id="zonaEntrega"
                                        />
                                      </div>
                                    </div>

                                    <div className="col-sm-4 col-md-8 unit">
                                      <label className="label">
                                        Domicilio
                                                                    </label>
                                      <div className="input">
                                        <input
                                          onChange={handleChange}
                                          className="form-control"
                                          type="text"
                                          placeholder={state.domicilioEntrega}
                                          id="domicilioEntrega"
                                        />
                                      </div>
                                    </div>

                                    <div className="col-sm-4 col-md-12 unit">
                                      <label className="label">
                                        Entrega En
                                                                    </label>
                                      <div className="input">
                                        <input
                                          onChange={handleChange}
                                          className="form-control"
                                          type="text"
                                          placeholder={state.entregaEn}
                                          id="entregaEn"
                                        />
                                      </div>
                                    </div>

                                    <div className="col-sm-4 col-md-12 unit">
                                      <label className="label">
                                        Datos Adicionales para la Entrega
                                                                    </label>
                                      <div className="input">
                                        <input
                                          onChange={handleChange}
                                          className="form-control"
                                          type="text"
                                          placeholder={state.datosAdicionalesEntrega}
                                          id="datosAdicionalesEntrega"
                                        />
                                      </div>
                                    </div>

                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                          : <div></div>
                        }

                      </div>
                    : <div></div>
                    }

                    <div className="widget-wrap" id="informacionAdicionalDePago">
                      <div className="widget-header">
                        <h2>Paquetes</h2>
                      </div>
                      <div className="widget-container">
                        <div className="widget-content">
                          <div className="row">
                            <div className="col-md-12">

                              <div className="col-md-12">

                                <div className="col-sm-4 col-md-1-5 unit">
                                  <label className="label" htmlFor="peso">
                                    Peso
                  </label>
                                  <div className="input">
                                    <input
                                      onChange={handleChange}
                                      className="form-control"
                                      type="text"
                                      placeholder={state.peso}
                                      id="peso"
                                    />
                                  </div>
                                </div>

                                <div className="col-sm-4 col-md-1-5 unit">
                                  <label className="label" htmlFor="largo">
                                    Largo
                  </label>
                                  <div className="input">
                                    <input
                                      onChange={handleChange}
                                      className="form-control"
                                      type="text"
                                      placeholder={state.peso}
                                      id="largo"
                                    />
                                  </div>
                                </div>

                                <div className="col-sm-4 col-md-1-5 unit">
                                  <label className="label" htmlFor="ancho">
                                    Ancho
                  </label>
                                  <div className="input">
                                    <input
                                      onChange={handleChange}
                                      className="form-control"
                                      type="text"
                                      placeholder={state.peso}
                                      id="ancho"
                                    />
                                  </div>
                                </div>

                                <div className="col-sm-4 col-md-1-5 unit">
                                  <label className="label" htmlFor="alto">
                                    Alto
                  </label>
                                  <div className="input">
                                    <input
                                      onChange={handleChange}
                                      className="form-control"
                                      type="text"
                                      placeholder={state.peso}
                                      id="alto"
                                    />
                                  </div>
                                </div>

                                <div className="col-sm-4 col-md-1-5 unit">
                                  <label className="label" htmlFor="volumen">
                                    Volumen
                  </label>
                                  <div className="input">
                                    <input
                                      onChange={handleChange}
                                      className="form-control"
                                      type="text"
                                      placeholder={state.peso}
                                      id="volumen"
                                    />
                                  </div>
                                </div>

                                <div className="col-sm-4 col-md-4-5 unit">
                                  <label className="label">
                                    Tipo de Embalaje
                  </label>
                                  <div className="input">
                                    <input
                                      onChange={handleChange}
                                      className="form-control"
                                      type="text"
                                      placeholder={state.peso}
                                      id="peso"
                                    />
                                  </div>
                                </div>

                                <div className="col-sm-4 col-md-3 unit">
                                  <label className="label">
                                    Valor Declarado
                  </label>
                                  <div className="input">
                                    <input
                                      onChange={handleChange}
                                      className="form-control"
                                      type="text"
                                      placeholder={state.peso}
                                      id="peso"
                                    />
                                  </div>
                                </div>

                                <div className="col-sm-4 col-md-7-5 unit">
                                  <label className="label">
                                    Descripción
                  </label>
                                  <div className="input">
                                    <input
                                      onChange={handleChange}
                                      className="form-control"
                                      type="text"
                                      placeholder={state.peso}
                                      id="peso"
                                    />
                                  </div>
                                </div>

                                <div className="col-sm-4 col-md-1-5 unit">
                                  <label className="label" htmlFor="volumen">
                                    Ctd
                  </label>
                                  <div className="input">
                                    <input
                                      onChange={handleChange}
                                      className="form-control"
                                      type="text"
                                      placeholder={state.peso}
                                      id="volumen"
                                    />
                                  </div>
                                </div>

                                <div className="col-sm-4 col-md-12 unit">
                                  <label className="label" htmlFor="volumen">
                                    Observaciones
                  </label>
                                  <div className="input">
                                    <input
                                      onChange={handleChange}
                                      className="form-control"
                                      type="text"
                                      placeholder={state.peso}
                                      id="volumen"
                                    />
                                  </div>
                                </div>

                              </div>

                            </div>
                          </div>
                        </div>
                      </div>

                    </div>

                    <div className="widget-wrap" id="general">
                      <div className="widget-header">
                        <h2>General</h2>
                      </div>
                      <div className="widget-container">
                        <div className="widget-content">
                          <div className="row">
                            <div className="col-md-12">

                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="widget-header">
                        <h2>Destinatario</h2>
                      </div>
                      <div className="widget-container">
                        <div className="widget-content">
                          <div className="row">
                            <div className="col-md-12">

                              <div className="col-sm-4 col-md-2-5 unit">
                                <label className="label">
                                  Nombre
                          </label>
                                <div className="input">
                                  <input
                                    onChange={handleChange}
                                    className="form-control"
                                    type="text"
                                    placeholder={state.nombreDestinatario}
                                    id="nombreDestinatario"
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
                                    placeholder={state.RFCDestinatario}
                                    id="RFCDestinatario"
                                  />
                                </div>
                              </div>

                              <div className="col-sm-4 col-md-2-5 unit">
                                <label className="label">
                                  Domicilio
                          </label>
                                <div className="input">
                                  <input
                                    onChange={handleChange}
                                    className="form-control"
                                    type="text"
                                    placeholder={state.domicilioDestinatario}
                                    id="domicilioDestinatario"
                                  />
                                </div>
                              </div>

                              <div className="col-sm-4 col-md-2-5 unit">
                                <label className="label">
                                  Código Postal
                          </label>
                                <div className="input">
                                  <input
                                    onChange={handleChange}
                                    className="form-control"
                                    type="text"
                                    placeholder={state.codigoPostalDestinatario}
                                    id="codigoPostalDestinatario"
                                  />
                                </div>
                              </div>

                              <div className="col-sm-4 col-md-2-5 unit">
                                <label className="label">
                                  Ciudad
                          </label>
                                <div className="input">
                                  <input
                                    onChange={handleChange}
                                    className="form-control"
                                    type="text"
                                    placeholder={state.ciudadDestinatario}
                                    id="ciudadDestinatario"
                                  />
                                </div>
                              </div>

                              <div className="col-sm-4 col-md-2-5 unit">
                                <label className="label">
                                  Correo Electrónico
                          </label>
                                <div className="input">
                                  <input
                                    onChange={handleChange}
                                    className="form-control"
                                    type="text"
                                    placeholder={state.correoDestinatario}
                                    id="correoDestinatario"
                                  />
                                </div>
                              </div>

                              <div className="col-sm-4 col-md-2-5 unit">
                                <label className="label">
                                  Teléfono
                          </label>
                                <div className="input">
                                  <input
                                    onChange={handleChange}
                                    className="form-control"
                                    type="text"
                                    placeholder={state.telefonoDestinatario}
                                    id="telefonoDestinatario"
                                  />
                                </div>
                              </div>

                              <div className="col-sm-4 col-md-2-5 unit">
                                <label className="label">
                                  Contacto
                          </label>
                                <div className="input">
                                  <input
                                    onChange={handleChange}
                                    className="form-control"
                                    type="text"
                                    placeholder={state.contactoDestinatario}
                                    id="contactoDestinatario"
                                  />
                                </div>
                              </div>

                              <div className="col-sm-4 col-md-2-5 unit">
                                <label className="label">
                                  Origen
                          </label>
                                <div className="input">
                                  <input
                                    onChange={handleChange}
                                    className="form-control"
                                    type="text"
                                    placeholder={state.origenDestinatario}
                                    id="origenDestinatario"
                                  />
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="widget-wrap" id="contacto">
                      <div className="widget-header">
                        <h2>Contacto</h2>
                      </div>
                      <div className="widget-container">
                        <div className="widget-content">
                          <div className="row">
                            <div className="col-md-12">


                              <div className="col-sm-4 col-md-2-5 unit">
                                <label className="label">
                                  Nombre
                          </label>
                                <div className="input">
                                  <input
                                    onChange={handleChange}
                                    className="form-control"
                                    type="text"
                                    placeholder={state.nombreRemitente}
                                    id="nombreRemitente"
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
                                    placeholder={state.RFCRemitente}
                                    id="RFCRemitente"
                                  />
                                </div>
                              </div>

                              <div className="col-sm-4 col-md-2-5 unit">
                                <label className="label">
                                  Domicilio
                          </label>
                                <div className="input">
                                  <input
                                    onChange={handleChange}
                                    className="form-control"
                                    type="text"
                                    placeholder={state.domicilioRemitente}
                                    id="domicilioRemitente"
                                  />
                                </div>
                              </div>

                              <div className="col-sm-4 col-md-2-5 unit">
                                <label className="label">
                                  Código Postal
                          </label>
                                <div className="input">
                                  <input
                                    onChange={handleChange}
                                    className="form-control"
                                    type="text"
                                    placeholder={state.codigoPostalRemitente}
                                    id="codigoPostalRemitente"
                                  />
                                </div>
                              </div>

                              <div className="col-sm-4 col-md-2-5 unit">
                                <label className="label">
                                  Ciudad
                          </label>
                                <div className="input">
                                  <input
                                    onChange={handleChange}
                                    className="form-control"
                                    type="text"
                                    placeholder={state.ciudadRemitente}
                                    id="ciudadRemitente"
                                  />
                                </div>
                              </div>

                              <div className="col-sm-4 col-md-2-5 unit">
                                <label className="label">
                                  Correo Electrónico
                          </label>
                                <div className="input">
                                  <input
                                    onChange={handleChange}
                                    className="form-control"
                                    type="text"
                                    placeholder={state.correoRemitente}
                                    id="correoRemitente"
                                  />
                                </div>
                              </div>

                              <div className="col-sm-4 col-md-2-5 unit">
                                <label className="label">
                                  Teléfono
                          </label>
                                <div className="input">
                                  <input
                                    onChange={handleChange}
                                    className="form-control"
                                    type="text"
                                    placeholder={state.telefonoRemitente}
                                    id="telefonoRemitente"
                                  />
                                </div>
                              </div>

                              <div className="col-sm-4 col-md-2-5 unit">
                                <label className="label">
                                  Contacto
                          </label>
                                <div className="input">
                                  <input
                                    onChange={handleChange}
                                    className="form-control"
                                    type="text"
                                    placeholder={state.contactoRemitente}
                                    id="contactoRemitente"
                                  />
                                </div>
                              </div>

                              <div className="col-sm-4 col-md-2-5 unit">
                                <label className="label">
                                  Origen
                          </label>
                                <div className="input">
                                  <input
                                    onChange={handleChange}
                                    className="form-control"
                                    type="text"
                                    placeholder={state.origenRemitente}
                                    id="origenRemitente"
                                  />
                                </div>
                              </div>

                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="widget-header">
                        <h2>Destinatario</h2>
                      </div>
                      <div className="widget-container">
                        <div className="widget-content">
                          <div className="row">
                            <div className="col-md-12">


                              <div className="col-sm-4 col-md-2-5 unit">
                                <label className="label">
                                  Nombre
                          </label>
                                <div className="input">
                                  <input
                                    onChange={handleChange}
                                    className="form-control"
                                    type="text"
                                    placeholder={state.nombreDestinatario}
                                    id="nombreDestinatario"
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
                                    placeholder={state.RFCDestinatario}
                                    id="RFCDestinatario"
                                  />
                                </div>
                              </div>

                              <div className="col-sm-4 col-md-2-5 unit">
                                <label className="label">
                                  Domicilio
                          </label>
                                <div className="input">
                                  <input
                                    onChange={handleChange}
                                    className="form-control"
                                    type="text"
                                    placeholder={state.domicilioDestinatario}
                                    id="domicilioDestinatario"
                                  />
                                </div>
                              </div>

                              <div className="col-sm-4 col-md-2-5 unit">
                                <label className="label">
                                  Código Postal
                          </label>
                                <div className="input">
                                  <input
                                    onChange={handleChange}
                                    className="form-control"
                                    type="text"
                                    placeholder={state.codigoPostalDestinatario}
                                    id="codigoPostalDestinatario"
                                  />
                                </div>
                              </div>

                              <div className="col-sm-4 col-md-2-5 unit">
                                <label className="label">
                                  Ciudad
                          </label>
                                <div className="input">
                                  <input
                                    onChange={handleChange}
                                    className="form-control"
                                    type="text"
                                    placeholder={state.ciudadDestinatario}
                                    id="ciudadDestinatario"
                                  />
                                </div>
                              </div>

                              <div className="col-sm-4 col-md-2-5 unit">
                                <label className="label">
                                  Correo Electrónico
                          </label>
                                <div className="input">
                                  <input
                                    onChange={handleChange}
                                    className="form-control"
                                    type="text"
                                    placeholder={state.correoDestinatario}
                                    id="correoDestinatario"
                                  />
                                </div>
                              </div>

                              <div className="col-sm-4 col-md-2-5 unit">
                                <label className="label">
                                  Teléfono
                          </label>
                                <div className="input">
                                  <input
                                    onChange={handleChange}
                                    className="form-control"
                                    type="text"
                                    placeholder={state.telefonoDestinatario}
                                    id="telefonoDestinatario"
                                  />
                                </div>
                              </div>

                              <div className="col-sm-4 col-md-2-5 unit">
                                <label className="label">
                                  Contacto
                          </label>
                                <div className="input">
                                  <input
                                    onChange={handleChange}
                                    className="form-control"
                                    type="text"
                                    placeholder={state.contactoDestinatario}
                                    id="contactoDestinatario"
                                  />
                                </div>
                              </div>

                              <div className="col-sm-4 col-md-2-5 unit">
                                <label className="label">
                                  Origen
                          </label>
                                <div className="input">
                                  <input
                                    onChange={handleChange}
                                    className="form-control"
                                    type="text"
                                    placeholder={state.origenDestinatario}
                                    id="origenDestinatario"
                                  />
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                  </div>

                  <div className="col-md-12" style={{ width: '3%' }}></div>

                  <div className="widget-wrap col-md-5">
                    <div className="widget-header">
                      <h2>Número de Paquetes</h2>
                    </div>
                    <div className="widget-container">
                      <div className="widget-content">

                        <div className="clone-widget">
                          <div className="unit widget toclone">
                            <button type="button" className="btn btn-secondary delete">
                              <i className="fa fa-minus" />
                            </button>
                            <input className="uni" style={{ width: "10%" }} value={state.cantidadDePaquetes} readOnly />
                            <button type="button" className="btn btn-primary clone">
                              <i className="fa fa-plus" />
                            </button>

                            <br></br>
                            <br></br>

                            <div>
                              <div className="col-sm-12 col-md-3 unit">
                                <label className="label">
                                  Peso
                    </label>
                                <div className="input">
                                  <input
                                    onChange={handleChange}
                                    className="form-control"
                                    type="text"
                                    placeholder={state.pesoPaquete}
                                    id="pesoPaquete"
                                  />
                                </div>
                              </div>

                              <div className="col-sm-12 col-md-3 unit">
                                <label className="label">
                                  Largo
                    </label>
                                <div className="input">
                                  <input
                                    onChange={handleChange}
                                    className="form-control"
                                    type="text"
                                    placeholder={state.largoPaquete}
                                    id="largoPaquete"
                                  />
                                </div>
                              </div>

                              <div className="col-sm-12 col-md-3 unit">
                                <label className="label">
                                  Ancho
                    </label>
                                <div className="input">
                                  <input
                                    onChange={handleChange}
                                    className="form-control"
                                    type="text"
                                    placeholder={state.anchoPaquete}
                                    id="anchoPaquete"
                                  />
                                </div>
                              </div>

                              <div className="col-sm-12 col-md-3 unit">
                                <label className="label">
                                  Alto
                    </label>
                                <div className="input">
                                  <input
                                    onChange={handleChange}
                                    className="form-control"
                                    type="text"
                                    placeholder={state.altoPaquete}
                                    id="altoPaquete"
                                  />
                                </div>
                              </div>

                              <div className="col-sm-12 col-md-6 unit">
                                <label className="label">
                                  Valor Declarado
                    </label>
                                <div className="input">
                                  <input
                                    onChange={handleChange}
                                    className="form-control"
                                    type="text"
                                    placeholder={state.valorPaquete}
                                    id="valorPaquete"
                                  />
                                </div>
                              </div>

                              <div className="col-sm-12 col-md-6 unit">
                                <label className="label">
                                  Descripción
                    </label>
                                <div className="input">
                                  <input
                                    onChange={handleChange}
                                    className="form-control"
                                    type="text"
                                    placeholder={state.descripcionPaquete}
                                    id="descripcionPaquete"
                                  />
                                </div>
                              </div>

                              <div className="col-sm-12 col-md-3 unit">
                                <label className="label">
                                  Cantidad
                    </label>
                                <div className="input">
                                  <input
                                    onChange={handleChange}
                                    className="form-control"
                                    type="text"
                                    placeholder={state.cantidadPaquete}
                                    id="cantidadPaquete"
                                  />
                                </div>
                              </div>

                              <div className="col-sm-12 col-md-9 unit">
                                <label className="label">
                                  Observaciones
                    </label>
                                <div className="input">
                                  <input
                                    onChange={handleChange}
                                    className="form-control"
                                    type="text"
                                    placeholder={state.observacionesPaquete}
                                    id="observacionesPaquete"
                                  />
                                </div>
                              </div>
                            </div>

                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="widget-header">
                      <h2>Número de Sobres</h2>
                    </div>
                    <div className="widget-container">
                      <div className="widget-content">
                        <div className="clone-widget">
                          <div className="unit widget toclone">
                            <button type="button" className="btn btn-secondary delete" >
                              <i className="fa fa-minus" />
                            </button>
                            <input className="unit" style={{ width: "10%" }} value={state.cantidadDeSobres} readOnly />
                            <button type="button" className="btn btn-primary clone">
                              <i className="fa fa-plus" />
                            </button>

                            <br></br>
                            <br></br>

                            <div className="col-sm-12 col-md-12 unit">
                              <label className="label">
                                Descripción
                          </label>
                              <div className="input">
                                <input
                                  onChange={handleChange}
                                  className="form-control"
                                  type="text"
                                  placeholder={state.descripcionSobre}
                                  id="descripcionSobre"
                                />
                              </div>
                            </div>
                          </div>
                        </div>


                      </div>
                    </div>
                  </div>

                </div>
                <div className="form-footer" className="col-md-12">
                  <button data-layout="topCenter" data-type="information" className="btn btn-primary secondary-btn">Cancelar</button>
                  <button onClick={handleAceptar} className="btn btn-primary primary-btn">Aceptar</button>
                </div>
              </form>
            </div>

            <div id="Importar" className="tab-pane fade">
              <div className="widget-wrap">
                <div className="widget-content">
                  <div className="row">
                    <div className="col-md-12">
                      <form className="j-forms">
                        <div className="form-content">
                          <div className="col-sm-12 col-md-12 unit">
                            <label className="label">
                              Importar
                          </label>
                            <div className="input">
                              <label
                                className="icon-left"
                                htmlFor="importar"
                              >
                                <i className="fa fa-edit" />
                              </label>
                              <input
                                onChange={handleUpload}
                                className="form-control"
                                type="file"
                                placeholder="some text"
                                id="importar"
                              />
                            </div>
                          </div>
                        </div>
                        <br></br>
                        <div className="form-footer" className="col-md-12">
                          <button className="btn btn-default btn-block ex-noty" data-layout="topCenter" data-type="information">Notificación</button>
                          <button data-layout="topCenter" data-type="information" className="btn btn-primary secondary-btn">Cancelar</button>
                          <button onClick={handleAceptar} className="btn btn-primary primary-btn">Aceptar</button>
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

export default Recoleccion;
