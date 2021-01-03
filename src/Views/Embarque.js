import React, { useEffect, useState, useMemo } from "react";
import axios from "axios";
import Cabecera from "../Components/Template/Cabecera";
import BarraLateralIzquierda from "../Components/Template/BarraLateralIzquierda";
import BarraLateralDerecha from "../Components/Template/BarraLateralDerecha";
import ExportCSV from '../Components/Template/Export';
import ExportPDF from "../Components/Template/ExportPDF";
import Carousel from "re-carousel";
import IndicatorDots from "../Util/Dots";
import Buttons from "../Util/CarruselButtons";
import { makeStyles } from "@material-ui/core/styles";
import TextField from "@material-ui/core/TextField";
import Autocomplete from "@material-ui/lab/Autocomplete";
import * as XLSX from 'xlsx';
import { useTable, useFilters, useGlobalFilter, useSortBy } from 'react-table'
import $ from 'jquery';
import { remove_array_element } from "../Util/Util";
window.jQuery = window.$ = $;

const styles = {
  paqueteCarrusel: {
    height: "300px !important",
  },
  sobreCarrusel: {
    height: "150px !important"
  }
};
const useStyles = makeStyles(styles);

function Embarque() {

  const classes = useStyles();
  const [data, setData] = React.useState([])
  const [dataSucursal, setDataSucursal] = React.useState([]);
  const [dataEstatusEmbarque, setEstatusEmbarque] = React.useState([]);
  const [dataTipoMoneda, setDataTipoMoneda] = React.useState([]);
  const [dataTipoCobro, setDataTipoCobro] = React.useState([]);
  const [dataCiudad, setDataCiudad] = React.useState([]);
  const [dataCodigoPostal, setDataCodigoPostal] = React.useState([]);
  const [state, setState] = React.useState({
    showPopUp: false,
    agregar: "Agregar",
    idEmbarque: 0,
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
    estatusEmbarque: 0,
    moneda: 0,
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
    fechaEntrega: "",
    horaEntrega: "",
    codigoPostalEntrega: "",
    ciudadEntrega: "",
    zonaEntrega: "",
    domicilioEntrega: "",
    entregaEn: "",
    datosAdicionalesEntrega: "",
    cantidadDePaquetes: 0,
    cantidadDeSobres: 0,
    diferenteEntrega: false,
    paquetes: [
      {
        peso: "",
        largo: "",
        ancho: "",
        alto: "",
        volumen: "",
        peso: "",
        tipoEmbalaje: "",
        valorDeclarado: "",
        descripcionPaquete: "",
        ctd: "",
        observacionesPaquete: "",
      },
    ],
    sobres: [
      {
        descripcion: ""
      }
    ],
  })
  const [fileUploaded, setFileUploaded] = React.useState([])
  const [stepActive, setStepActive] = React.useState(1);


  const handleAceptar = (e) => {
    e.preventDefault()

    var fechaYHora = state.fechaHoraCreacion.split("T")

    var params = {

      "IdSucursal": state.idSucursalAgregar,
      "m_nIdEmbarque": state.folioEmbarque,
      "m_nIdGuia": state.folioGuía,
      "m_nIdInforme": state.folioInforme,
      "m_dFecha": fechaYHora[0],
      "m_tHora": fechaYHora[1],
      "m_nIdEstatusEmbarque": state.estatusEmbarque,
      "m_nMoneda": state.moneda,
      "m_rTipoCambio": state.tipoCambio,
      "m_nIdTipoDeCobro": state.tipoCobro,
      "m_sNOmbreRemitente": state.nombreRemitente,
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
      "m_tFechaDetalleEntrega": state.fechaEntrega,
      "m_tHoraDetalleEntrega": state.horaEntrega,
      "m_nIdCPDetalleEntrega": state.codigoPostalEntrega,
      "m_nIdCiudadDetalleEntrega": state.ciudadEntrega,
      "m_nIdZonaDetalleEntrega": state.zonaEntrega,
      "m_sDomicilioDetalleEntrega": state.domicilioEntrega,
      "m_sEntregarEnDetalleEntrega": state.entregaEn,
      "m_sDatosAdicionalesDetalleEntrega": state.datosAdicionalesEntrega,
      "m_parrPaquetes": state.paquetes,
      "m_nNoPaquetes": state.paquetes.length,
      "m_parrSobres": state.sobres,
      "m_nNoSobres": state.sobres.length,
      "m_nIdOperador": 1,
      "m_nIdUnidad": 13,

    }
    console.log(params)
    alert(JSON.stringify(params))
    if (state.idEmbarque != 0) {
      const url = `${process.env.REACT_APP_API_URL}/Embarques/Modificar/${state.idEmbarque}`;
      axios.put(url, Object.assign({}, params), { headers }).then(respuesta => {
        alert(respuesta.data)
        //window.location.reload();
      }).catch(err => {
        console.log(err)
        alert("err")
      });
    } else {
      const url = `${process.env.REACT_APP_API_URL}/Embarques/Agregar`;
      axios.post(url, Object.assign({}, params), { headers }).then(respuesta => {
        alert(respuesta.data)
        console.log(respuesta.data)
        //window.location.reload();
      }).catch(err => {
        console.log(err)
        alert(err)
      });
    }

  }

  function addPaquete() {
    const { paquetes } = state;
    paquetes.push({
      peso: "",
      largo: "",
      ancho: "",
      alto: "",
      volumen: "",
      peso: "",
      tipoEmbalaje: "",
      valorDeclarado: "",
      descripcionPaquete: "",
      ctd: "",
      observacionesPaquete: "",
    });
    console.log(paquetes);
    setState({ ...state, paquetes: paquetes });
  }

  function removePaquete(index) {
    var { paquetes } = state;
    paquetes = remove_array_element(paquetes, index)
    console.log(paquetes)
    setState({ ...state, paquetes: paquetes });
  }

  function addSobre() {
    const { sobres } = state;
    sobres.push({
      descripcion: "",
    });
    console.log(sobres);
    setState({ ...state, sobres: sobres });
  }

  function removeSobre(index) {
    var { sobres } = state;
    sobres = remove_array_element(sobres, index)
    console.log(sobres)
    setState({ ...state, sobres: sobres });
  }

  const handleChangePaquete = (event, index) => {

    var { paquetes } = state
    paquetes[index][event.target.name] = event.target.value
    setState({
      ...state,
      paquetes: paquetes
    });
  };

  const handleChangeSobre = (event, index) => {

    var { sobres } = state
    sobres[index][event.target.name] = event.target.value
    setState({
      ...state,
      sobres: sobres
    });
  };

  function handleEliminar(id) {
    const url = `${process.env.REACT_APP_API_URL}/Embarques/Eliminar/${id}`;
    axios.delete(url, { headers }).then(respuesta => {
      alert(respuesta.data)
      window.location.reload();
    }).catch(err => {
      alert(err)
    });
  }

  function handleShowModificar(row) {
    console.log(row.original.m_nIdDepartamento)
    const url = `${process.env.REACT_APP_API_URL}/Embarques/GetById/${row.original.m_nIdEmbarque}`;
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
      idEntrega: 0,
      idSucursalAgregar: dataSucursal[0].m_nIdSucursal,
      folioRecoleccion: "",
      folioEmbarque: "",
      folioGuía: "",
      folioInforme: "",
      fechaHoraCreacion: "",
      moneda: dataTipoMoneda[0].m_nIdMoneda,
      tipoCambio: "",
      tipoCobro: dataTipoCobro[0].m_nIdTipoCobro,
      estatusEmbarque: dataEstatusEmbarque[0].m_nIdEstatusEmbarque,
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
      fechaEntrega: "",
      horaEntrega: "",
      codigoPostalEntrega: "",
      ciudadEntrega: "",
      zonaEntrega: "",
      domicilioEntrega: "",
      entregaEn: "",
      datosAdicionalesEntrega: "",
      cantidadDePaquetes: 0,
      cantidadDeSobres: 0,
    })
  }

  const handleChange = event => {
    console.log(event.target.id + " : " + event.target.value)
    setState({
      ...state,
      [event.target.id]: event.target.value
    });
  };

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
      accessor: "m_nFolioEmbarque",
    }, {
      Name: "Fecha Elaboración",
      accessor: "m_dFecha",
    }, {
      Name: "Sucursal",
      accessor: "IdSucursal",
    }, {
      Name: "Estatus de la Orden",
      accessor: "m_nIdEstatusEmbarque",
    }, {
      Name: "Origen",
      accessor: "m_nIdCiudadOrigen",
    }, {
      Name: "Destino",
      accessor: "m_nIdCiudadDestino",
    }, {
      Name: "Folio Guía",
      accessor: "m_nFolioGuia",
    }, {
      Name: "Folio Informe",
      accessor: "m_nFolioInforme",
    }

  ]);

  useEffect(value => {
    getAllData();
    getAllSucursales();
    getAllEstatusEmbarque();
    getAllTipoCobro();
    getAllTipoMoneda();
    getAllCiudades();
    getAllCodigosPostales();
  }, []);

  function getAllData() {
    const url = `${process.env.REACT_APP_API_URL}/Embarques/GetListado`;
    axios.get(url, { headers }).then(respuesta => {
      setData(respuesta.data)
    });
  };

  function getAllSucursales() {
    const url = `${process.env.REACT_APP_API_URL}/Sucursales/GetListado`;
    axios.get(url, { headers }).then((respuesta) => {
      setDataSucursal(respuesta.data);
    });
  }

  function getAllEstatusEmbarque() {
    const url = `${process.env.REACT_APP_API_URL}/SisEstatus/GetListadoEmbarque`;
    axios.get(url, { headers }).then((respuesta) => {
      setEstatusEmbarque(respuesta.data);
    });
  }

  function getAllTipoCobro() {
    const url = `${process.env.REACT_APP_API_URL}/TipoCobro/GetListado`;
    axios.get(url, { headers }).then((respuesta) => {
      setDataTipoCobro(respuesta.data);
    });
  }

  function getAllTipoMoneda() {
    const url = `${process.env.REACT_APP_API_URL}/Moneda/GetListado`;
    axios.get(url, { headers }).then((respuesta) => {
      setDataTipoMoneda(respuesta.data);
    });
  }

  function getAllCiudades() {
    const url = `${process.env.REACT_APP_API_URL}/Ciudades/GetListado`;
    axios.get(url, { headers }).then((respuesta) => {
      setDataCiudad(respuesta.data);
    });
  }

  function getAllCodigosPostales() {
    const url = `${process.env.REACT_APP_API_URL}/CodigoPostal/GetListado`;
    axios.get(url, { headers }).then((respuesta) => {
      setDataCodigoPostal(respuesta.data);
    });
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
        value={`Buscar ${count} registros...`}
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

  const framesPaquete = state.paquetes.map((p, index) => {
    return (
      <div key={`paquete${index}`}>
        <div className="col-sm-4 col-md-1-5 unit">
          <label className="label">Peso</label>
          <div className="input">
            <input
              onChange={(event) => handleChangePaquete(event, index)}
              className="form-control"
              type="text"
              value={state.paquetes[index].peso}
              placeholder="Peso"
              name="peso"
            />
          </div>
        </div>

        <div className="col-sm-4 col-md-1-5 unit">
          <label className="label">Largo</label>
          <div className="input">
            <input
              onChange={(event) => handleChangePaquete(event, index)}
              className="form-control"
              type="text"
              value={state.paquetes[index].largo}
              placeholder="Largo"
              name="largo"
            />
          </div>
        </div>

        <div className="col-sm-4 col-md-1-5 unit">
          <label className="label">Ancho</label>
          <div className="input">
            <input
              onChange={(event) => handleChangePaquete(event, index)}
              className="form-control"
              type="text"
              value={state.paquetes[index].ancho}
              placeholder="Ancho"
              name="ancho"
            />
          </div>
        </div>

        <div className="col-sm-4 col-md-1-5 unit">
          <label className="label">Alto</label>
          <div className="input">
            <input
              onChange={(event) => handleChangePaquete(event, index)}
              className="form-control"
              type="text"
              value={state.paquetes[index].alto}
              placeholder="Alto"
              name="alto"
            />
          </div>
        </div>

        <div className="col-sm-4 col-md-1-5 unit">
          <label className="label">Volumen</label>
          <div className="input">
            <input
              onChange={(event) => handleChangePaquete(event, index)}
              className="form-control"
              type="text"
              value={state.paquetes[index].volumen}
              placeholder="Volumen"
              name="volumen"
            />
          </div>
        </div>

        <div className="col-sm-4 col-md-4-5 unit">
          <label className="label">Tipo de Embalaje</label>
          <div className="input">
            <input
              onChange={(event) => handleChangePaquete(event, index)}
              className="form-control"
              type="text"
              value={state.paquetes[index].tipoEmbalaje}
              placeholder="Tipo de Embarje"
              name="tipoEmbalaje"
            />
          </div>
        </div>

        <div className="col-sm-4 col-md-3 unit">
          <label className="label">Valor Declarado</label>
          <div className="input">
            <input
              onChange={(event) => handleChangePaquete(event, index)}
              className="form-control"
              type="text"
              value={state.paquetes[index].valorDeclarado}
              placeholder="Valor Declarado"
              name="valorDeclarado"
            />
          </div>
        </div>

        <div className="col-sm-4 col-md-7-5 unit">
          <label className="label">Descripción</label>
          <div className="input">
            <input
              onChange={(event) => handleChangePaquete(event, index)}
              className="form-control"
              type="text"
              value={state.paquetes[index].descripcionPaquete}
              placeholder="Descripción"
              name="descripcionPaquete"
            />
          </div>
        </div>

        <div className="col-sm-4 col-md-1-5 unit">
          <label className="label">Ctd</label>
          <div className="input">
            <input
              onChange={(event) => handleChangePaquete(event, index)}
              className="form-control"
              type="text"
              value={state.paquetes[index].Ctd}
              placeholder="Ctd"
              name="ctd"
            />
          </div>
        </div>

        <div className="col-sm-4 col-md-12 unit">
          <label className="label">Observaciones</label>
          <div className="input">
            <input
              onChange={(event) => handleChangePaquete(event, index)}
              className="form-control"
              type="text"
              value={state.paquetes[index].observacionesPaquete}
              placeholder="Observaciones"
              name="observacionesPaquete"
            />
          </div>
        </div>
        {
          state.paquetes.length !== 1 &&
          <a className="btn delete" onClick={() => removePaquete(index)}>
            <i className="zmdi zmdi-delete"></i> Eliminar Paquete
        </a>
        }

      </div>
    );
  });

  const framesSobre = state.sobres.map((p, index) => {
    return (
      <div key={`sobre${index}`}>

        <div className="col-sm-4 col-md-12 unit">
          <label className="label">Descripcion</label>
          <div className="input">
            <input
              onChange={(event) => handleChangeSobre(event, index)}
              className="form-control"
              type="text"
              value={state.sobres[index].descripcion}
              placeholder="Descripción"
              name="descripcion"
            />
          </div>
        </div>
        {
          state.sobres.length !== 1 &&
          <a className="btn delete" onClick={() => removeSobre(index)}>
            <i className="zmdi zmdi-delete"></i> Eliminar Sobre
          </a>
        }

      </div>
    );
  });


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
            <h2>Embarque</h2>
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
                              id="estatusListado"
                            >
                              <option value="0">
                                Todos
                            </option>
                              {dataEstatusEmbarque.map(
                                (estatus) => (
                                  <option key={estatus.m_nIdEstatusEmbarque} value={estatus.m_nIdEstatusEmbarque}>
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
                                  id="idSucursalAgregar"
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
                                  value={state.folioRecoleccion}
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
                                  value={state.folioEmbarque}
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
                                  value={state.folioGuía}
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
                                  value={state.folioInforme}
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
                                Estatus del Embarque
                          </label>
                              <label className="input select">
                                <select
                                  className="form-control"
                                  required
                                  onChange={handleChange}
                                  id="estatusEmbarque"
                                >
                                  {dataEstatusEmbarque.map(
                                    (estatus) => (
                                      <option key={estatus.m_nIdEstatusEmbarque} value={estatus.m_nIdEstatusEmbarque}>
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
                              <label className="input select">
                                <select
                                  className="form-control"
                                  required
                                  onChange={handleChange}
                                  id="moneda"
                                >
                                  {dataTipoMoneda.map(
                                    (moneda) => (
                                      <option key={moneda.m_nIdMoneda} value={moneda.m_nIdMoneda}>
                                        {
                                          moneda.m_sMoneda
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
                                Tipo de Cambio
                          </label>
                              <div className="input">
                                <input
                                  onChange={handleChange}
                                  className="form-control"
                                  type="text"
                                  value={state.tipoCambio}
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
                      <div className="row">
                        <div className="col-md-6">
                          <div className="widget-header">
                            <h2>Remitente</h2>
                          </div>
                          <div className="widget-container">
                            <div className="widget-content">
                              <div className="row">

                                <div className="col-sm-4 col-md-6 unit">
                                  <label className="label">
                                    Nombre
                        </label>
                                  <div className="input">
                                    <input
                                      onChange={handleChange}
                                      className="form-control"
                                      type="text"
                                      value={state.nombreRemitente}
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
                                      value={state.RFCRemitente}
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
                                      value={state.domicilioRemitente}
                                      id="domicilioRemitente"
                                    />
                                  </div>
                                </div>

                                <div className="col-sm-4 col-md-6 unit">
                                  <label className="label">
                                    Código Postal
                                  </label>
                                  <label className="input select">
                                    <select
                                      className="form-control"
                                      required
                                      onChange={handleChange}
                                      id="codigoPostalRemitente"
                                    >
                                      {dataCodigoPostal.map(
                                        (codigoPostal) => (
                                          <option key={codigoPostal.m_nIdCP} value={codigoPostal.m_nIdCP}>
                                            {
                                              codigoPostal.m_sCP
                                            }
                                          </option>
                                        )
                                      )}
                                    </select>
                                    <i className="fa fa-arrow-down" />
                                  </label>
                                </div>

                                <div className="col-sm-4 col-md-6 unit">
                                  <label className="label">
                                    Ciudad
                                  </label>
                                  <label className="input select">
                                    <select
                                      className="form-control"
                                      required
                                      onChange={handleChange}
                                      id="ciudadRemitente"
                                    >
                                      {dataCiudad.map(
                                        (ciudad) => (
                                          <option key={ciudad.m_nIdCiudad} value={ciudad.m_nIdCiudad}>
                                            {
                                              ciudad.m_sCiudad
                                            }
                                          </option>
                                        )
                                      )}
                                    </select>
                                    <i className="fa fa-arrow-down" />
                                  </label>

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
                                      value={state.correoRemitente}
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
                                      value={state.telefonoRemitente}
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
                                      value={state.contactoRemitente}
                                      id="contactoRemitente"
                                    />
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                        <div className="col-md-6">
                          <div className="widget-header">
                            <h2>Destinatario</h2>
                          </div>
                          <div className="widget-container">
                            <div className="widget-content">

                              <div className="col-sm-4 col-md-6 unit">
                                <label className="label">
                                  Nombre
                              </label>
                                <div className="input">
                                  <input
                                    onChange={handleChange}
                                    className="form-control"
                                    type="text"
                                    value={state.nombreDestinatario}
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
                                    value={state.RFCDestinatario}
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
                                    value={state.domicilioDestinatario}
                                    id="domicilioDestinatario"
                                  />
                                </div>
                              </div>

                              <div className="col-sm-4 col-md-6 unit">
                                <label className="label">
                                  Código Postal
                                </label>
                                <label className="input select">
                                  <select
                                    className="form-control"
                                    required
                                    onChange={handleChange}
                                    id="codigoPostalDestinatario"
                                  >
                                    {dataCodigoPostal.map(
                                      (codigoPostal) => (
                                        <option key={codigoPostal.m_nIdCP} value={codigoPostal.m_nIdCP}>
                                          {
                                            codigoPostal.m_sCP
                                          }
                                        </option>
                                      )
                                    )}
                                  </select>
                                  <i className="fa fa-arrow-down" />
                                </label>

                              </div>

                              <div className="col-sm-4 col-md-6 unit">
                                <label className="label">
                                  Ciudad
                                </label>
                                <label className="input select">
                                  <select
                                    className="form-control"
                                    required
                                    onChange={handleChange}
                                    id="ciudadDestinatario"
                                  >
                                    {dataCiudad.map(
                                      (ciudad) => (
                                        <option key={ciudad.m_nIdCiudad} value={ciudad.m_nIdCiudad}>
                                          {
                                            ciudad.m_sCiudad
                                          }
                                        </option>
                                      )
                                    )}
                                  </select>
                                  <i className="fa fa-arrow-down" />
                                </label>
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
                                    value={state.correoDestinatario}
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
                                    value={state.telefonoDestinatario}
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
                                    value={state.contactoDestinatario}
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

                    {state.diferenteEntrega ?
                      <div className="widget-wrap" id="detallesDeLaRecoleccion">

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
                                        Código Postal
                                    </label>
                                      <label className="input select">
                                        <select
                                          className="form-control"
                                          required
                                          onChange={handleChange}
                                          id="codigoPostalEntrega"
                                        >
                                          {dataCodigoPostal.map(
                                            (codigoPostal) => (
                                              <option key={codigoPostal.m_nIdCP} value={codigoPostal.m_nIdCP}>
                                                {
                                                  codigoPostal.m_sCP
                                                }
                                              </option>
                                            )
                                          )}
                                        </select>
                                        <i className="fa fa-arrow-down" />
                                      </label>
                                    </div>

                                    <div className="col-sm-4 col-md-4 unit">
                                      <label className="label">
                                        Ciudad
                                    </label>
                                      <label className="input select">
                                        <select
                                          className="form-control"
                                          required
                                          onChange={handleChange}
                                          id="ciudadEntrega"
                                        >
                                          {dataCiudad.map(
                                            (ciudad) => (
                                              <option key={ciudad.m_nIdCiudad} value={ciudad.m_nIdCiudad}>
                                                {
                                                  ciudad.m_sCiudad
                                                }
                                              </option>
                                            )
                                          )}
                                        </select>
                                        <i className="fa fa-arrow-down" />
                                      </label>
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
                                          value={state.zonaEntrega}
                                          id="zonaEntrega"
                                        />
                                      </div>
                                    </div>

                                    <div className="col-sm-4 col-md-12 unit">
                                      <label className="label">
                                        Domicilio
                                                                  </label>
                                      <div className="input">
                                        <input
                                          onChange={handleChange}
                                          className="form-control"
                                          type="text"
                                          value={state.domicilioEntrega}
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
                                          value={state.entregaEn}
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
                                          value={state.datosAdicionalesEntrega}
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
                      <div className="row">

                        <div className="col-md-12">
                          <div className="widget-header">
                            <h2>Detalles de la Operación</h2>
                          </div>
                          <div className="widget-container">
                            <div className="widget-content">
                              <div className="row">

                                <div className="col-sm-4 col-md-12 unit">
                                  <label className="label" htmlFor="operador">
                                    Operador
</label>
                                  <div className="input">
                                    <input
                                      onChange={handleChange}
                                      className="form-control"
                                      type="text"
                                      value={state.operador}
                                      id="operador"
                                    />
                                  </div>
                                </div>

                                <div className="col-sm-4 col-md-12 unit">
                                  <label className="label" htmlFor="tipoUnidad">
                                    Tipo Unidad
</label>
                                  <div className="input">
                                    <input
                                      onChange={handleChange}
                                      className="form-control"
                                      type="text"
                                      value={state.tipoUnidad}
                                      id="tipoUnidad"
                                    />
                                  </div>
                                </div>

                                <div className="col-sm-4 col-md-12 unit">
                                  <label className="label" htmlFor="unidad">
                                    Unidad
</label>
                                  <div className="input">
                                    <input
                                      onChange={handleChange}
                                      className="form-control"
                                      type="text"
                                      value={state.unidad}
                                      id="unidad"
                                    />
                                  </div>
                                </div>

                              </div>
                            </div>
                          </div>
                        </div>
                        <div className="col-md-6">
                          <div className="widget-header">
                            <h2>Salida para la Recolección</h2>
                          </div>
                          <div className="widget-container">
                            <div className="widget-content">

                              <div className="col-md-12">
                                <label className="label">
                                  Fecha y Hora
</label>
                                <div className="input">
                                  <input
                                    onChange={handleChange}
                                    className="form-control"
                                    type="datetime-local"
                                    value={state.fechaHoraSalida}
                                    id="fechaHoraSalida"
                                  />
                                </div>
                              </div>

                            </div>
                          </div>
                        </div>
                        <div className="col-md-6">
                          <div className="widget-header">
                            <h2>Llegada de la Recolección</h2>
                          </div>
                          <div className="widget-container">
                            <div className="widget-content">

                              <div className="col-md-12">
                                <label className="label">
                                  Fecha y Hora
</label>
                                <div className="input">
                                  <input
                                    onChange={handleChange}
                                    className="form-control"
                                    type="datetime-local"
                                    value={state.fechaHoraLlegada}
                                    id="fechaHoraLlegada"
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
                        <div className="row">
                          <div className="col-md-12">
                            <form className="j-forms">
                              <div className="form-content">
                                <a
                                  className="btn"
                                  style={{ margin: "10px" }}
                                  onClick={() => addPaquete()}
                                >
                                  <i className="zmdi zmdi-plus"></i> Agregar Paquete
                            </a>

                                <Carousel
                                  className={classes.paqueteCarrusel}
                                  widgets={[IndicatorDots, Buttons]}
                                  frames={framesPaquete}
                                ></Carousel>
                              </div>
                            </form>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="widget-header">
                      <h2>Número de Sobres</h2>
                    </div>
                    <div className="widget-container">
                      <div className="widget-content">
                        <div className="row">
                          <div className="col-md-12">
                            <form className="j-forms">
                              <div className="form-content">
                                <a
                                  className="btn"
                                  style={{ margin: "10px" }}
                                  onClick={() => addSobre()}
                                >
                                  <i className="zmdi zmdi-plus"></i> Agregar Sobre</a>

                                <Carousel
                                  className={classes.sobreCarrusel}
                                  widgets={[IndicatorDots, Buttons]}
                                  frames={framesSobre}
                                ></Carousel>
                              </div>
                            </form>
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

export default Embarque;
