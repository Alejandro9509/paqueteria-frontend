import React, {useEffect, useState, useMemo} from "react";
import axios from "axios";
import Cabecera from "../Components/Template/Cabecera";
import BarraLateralIzquierda from "../Components/Template/BarraLateralIzquierda";
import BarraLateralDerecha from "../Components/Template/BarraLateralDerecha";
import ExportCSV from '../Components/Template/Export';
import ExportPDF from "../Components/Template/ExportPDF";
import * as XLSX from 'xlsx';
import { useTable, useFilters, useGlobalFilter, useAsyncDebounce, useSortBy } from 'react-table'
function Guia() {
const [data, setData] = React.useState([])
const [state, setState] = React.useState({
    showPopUp: false,
    idGuia: 0,
    agregar: "Agregar",
    sucursal: "",
    folioRecoleccion: "",
    folioEmbarque: "",
    folioGuía: "",
    folioInforme: "",
    fecha: "",
    estatus: "",
    origen: "",
    destino:"",
    usuarioCancela:"",
    fechaCancelado:"",
    idGuia: 0,
    hora: "",
    idEstatusGuia:0,
    idMoneda:0,
    tipoCambio:0, 
	  idTipoCobro:0,
	  nombreRemitente:"",
	  rfcRemitente:"",
	  domicilioRemitente:"",
	  idCodigoPostalRemitente:0,
	  ciudadRemitente:0, 
	  correoRemitente:"",
	  telefonoRemitente:"",
    contactoRemitente:"",
    idCiudadOrigen:0,
    sNombreDestinatario:"", 
	  sRFCDestinatario:"",
	  sDomicilioDestinatario:"",
	  idCodigoPostalDestinatario:"", 
	  sCorreoDestinatario:"",
	  idCIudadDestinatario:0,
	  sTelefonoDestinatario:"",
	  sContactoDestinatario:"",
	  idCiudadDestino:0,
	  fechaEntrega:"",
	  HoraEntrega:"",
	  NoPaquetes:0,
    NoSobres:0,	
    idOperador:0, 
	  idCiudadRemitente:0,
	  idUnidad:0,
	  fechaSalida:"",
	  horaSalida:"",
	  arrClsDetalle:[],
	  FechaCancelacion:"",
	  usuarioCancelacion:0,
	  MotivoCancelacion:"",
	  entregarMismoDomicilio:false,
	  fechaLlegada:"", 
	  horaLlegada:"", 
	  codigoPostalEntrega:0, 
	  idCiudadEntrega:0,
	  idZonaEntrega:0,
	  domicilioEntrega:"", 
	  entregarEn:"" ,
	  datosAdicionalesis:""  ,
	  tracking:0,
	  arClsGuiaConceptos:[],
	  creadoPor:0,
	  modificadoPor:0,
	  creadoEl:"",
	  modificadoEl:"",
    idSucursal:2,
    valorDeclardao:0
})


const [fileUploaded, setFileUploaded] = React.useState([])
const [dataSucursal, setDataSucursal] = React.useState([])
const [stateSucursal, setStateSucursal] = React.useState({
idSucursal:0,
Sucursal:""
})

const [dataMoneda, setDataMoneda] = React.useState([])
const [stateMoneda, setStateMoneda] = React.useState({
idMoneda:0,
Moneda:""
})
const [dataTipoCobro, setDataTipoCobro] = React.useState([])
const [stateTipoCobro, setStateTipoCobro] = React.useState({
idTipoCobro:0,
Descripcion:""
})
const [dataEstatusGuia, setDataEstatusGuia] = React.useState([])
const [stateEstatusGuia, setStateEstatusGuia] = React.useState({
idEstatusGuia:0,
Estatus:"",
Color:""
})
const [dataTipoServicio, setDataTipoServicio] = React.useState([])
const [stateTipoServicio, setStateTipoServicio] = React.useState({
idTipoServicio:0,
Descripcion:""
})
const handleAceptar = (e) => {
  e.preventDefault()
	var params = {

	"IdSucursal" : state.idSucursal,
  "FolioGuía": state.folioGuia,
  "Fecha":state.fecha,
  "IdEstatusGuia": state.idEstatusGuia,
  "IdOrigen": state.origen,
  "destino":state.destino,
  "UsuarioCancela":state.usuarioCancela,
  "FechaCancelado":state.fechaCancelado,
  "Hora": state.hora,
  "IdMoneda":state.idMoneda,
  "TipoCambio":state.tipoCambio, 
	"IdTipoCobro":state.idTipoCobro,
	"NombreRemitente":state.nombreRemitente,
	"RfcRemitente":state.rfcRemitente,
	"DomicilioRemitente":state.domicilioRemitente,
	"IdCodigoPostalRemitente":state.idCodigoPostalRemitente,
	"CiudadRemitente":state.ciudadRemitente, 
	"CorreoRemitente":state.correoRemitente,
	"TelefonoRemitente":state.telefonoRemitente,
  "ContactoRemitente":state.contactoRemitente,
  "IdCiudadOrigen":state.idCiudadOrigen,
  "SNombreDestinatario":state.sNombreDestinatario, 
	"SRFCDestinatario":state.sRFCDestinatario,
	"SDomicilioDestinatario":state.sDomicilioDestinatario,
	"IdCodigoPostalDestinatario":state.idCodigoPostalDestinatario, 
	"SCorreoDestinatario":state.sCorreoDestinatario,
	"IdCIudadDestinatario":state.idCIudadDestinatario,
	"STelefonoDestinatario":state.sTelefonoDestinatario,
	"SContactoDestinatario":state.sContactoDestinatario,
  "IdCiudadDestino":state.idCiudadDestino,
	"FechaEntrega":state.fechaEntrega,
	"HoraEntrega":state.HoraEntrega,
	"NoPaquetes":state.NoPaquetes,
  "NoSobres":state.NoSobres,	
  "IdOperador":state.idOperador, 
	"IdCiudadRemitente":state.idCiudadRemitente,
	"IdUnidad":state.idUnidad,
	"FechaSalida":state.fechaSalida,
	"HoraSalida":state.horaSalida,
	"arrClsDetalle":[],
	"FechaCancelacion":state.FechaCancelacion,
	"UsuarioCancelacion":state.usuarioCancelacion,
	"MotivoCancelacion":state.MotivoCancelacion,
	"EntregarMismoDomicilio":state.entregarMismoDomicilio,
	"FechaLlegada":state.fechaLlegada, 
	"HoraLlegada":state.horaLlegada, 
	"CodigoPostalEntrega":state.codigoPostalEntrega, 
	"IdCiudadEntrega":state.idCiudadEntrega,
	"IdZonaEntrega":state.idZonaEntrega,
	"DomicilioEntrega":state.domicilioEntrega, 
	"EntregarEn":state.entregarEn ,
	"DatosAdicionalesis":state.datosAdicionalesis  ,
	"Tracking":state.tracking,
	"arClsGuiaConceptos":[],
	"CreadoPor":1,
	"ModificadoPor":1,
	"CreadoEl":state.creadoEl,
	"ModificadoEl":state.modificadoEl,
  }
  if(state.idGuia != 0){
    const url = "http://localhost/Guia/Modificar/" + state.idGuia;
    axios.put(url, Object.assign({}, params), {headers}).then(respuesta => {
    alert(respuesta.data)
    window.location.reload();
  }).catch(err => {
    console.log(err)
    alert("err")
  });
  } else {
  const url = "http://localhost/Guia/Agregar";
  axios.post(url, Object.assign({}, params), {headers}).then(respuesta => {
    alert(respuesta.data)
    window.location.reload();
  }).catch(err => {
    console.log(err)
    alert(err)
  });
  }

}

function handleEliminar(id){
  const url = "http://localhost/Guia/Eliminar/" + id;
  axios.delete(url, {headers}).then(respuesta => {
    console.log(respuesta)
  }).catch(err => {
    alert(err)
  });
}

function handleShowModificar(row){
  console.log(row.original.m_nIdGuia)
  //TODO
  const url = "http://localhost/Guia/GetById/" + row.original.m_nIdGuia;
    axios.get(url, {headers}).then(respuesta => {
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
    var today = new Date();
    setState({
      ...state,
      agregar: "Agregar",
      showPopUp: true,
      
      sucursal: "",
      folioRecoleccion: "",
      folioEmbarque: "",
      folioGuía: "",
      folioInforme: "",
      fecha: today.getDate() + "/" + (today.getMonth() + 1) +"/"+today.getFullYear() + " " + today.getHours() + ":" + today.getMinutes(),
      estatus: "",
      origen: "",
      destino:"",
      usuarioCancela:"",
      fechaCancelado:"",
      idGuia: 0,
      hora: "",
      idEstatusGuia:0,
      idMoneda:0,
      tipoCambio:0, 
      idTipoCobro:0,
      nombreRemitente:"",
      rfcRemitente:"",
      domicilioRemitente:"",
      idCodigoPostalRemitente:0,
      ciudadRemitente:0, 
      correoRemitente:"",
      telefonoRemitente:"",
      contactoRemitente:"",
      idCiudadOrigen:0,
      sNombreDestinatario:"", 
      sRFCDestinatario:"",
      sDomicilioDestinatario:"",
      idCodigoPostalDestinatario:"", 
      sCorreoDestinatario:"",
      idCIudadDestinatario:0,
      sTelefonoDestinatario:"",
      sContactoDestinatario:"",
      idCiudadDestino:0,
      fechaEntrega:"",
      HoraEntrega:"",
      NoPaquetes:0,
      NoSobres:0,	
      idOperador:0, 
      idCiudadRemitente:0,
      idUnidad:0,
      fechaSalida:"",
      horaSalida:"",
      arrClsDetalle:[],
      FechaCancelacion:"",
      usuarioCancelacion:0,
      MotivoCancelacion:"",
      entregarMismoDomicilio:false,
      fechaLlegada:"", 
      horaLlegada:"", 
      codigoPostalEntrega:0, 
      idCiudadEntrega:0,
      idZonaEntrega:0,
      domicilioEntrega:"", 
      entregarEn:"" ,
      datosAdicionalesis:""  ,
      tracking:0,
      arClsGuiaConceptos:[],
      creadoPor:0,
      modificadoPor:0,
      creadoEl:"",
      modificadoEl:"",
      idSucursal:0
      })
}

const handleChange = event => {
  console.log(event.target.id + " : " + event.target.value)
  setState( {
    ...state,
    [event.target.id] : event.target.value
  });
};

  const columns = useMemo(() => [{
    cell: (row) => <div>
          <a data-toggle="tab" data-target="#Agregar" onClick={() => (handleShowModificar(row.m_nIdGuia))} className="btn btn-default btn-sm m-user-edit"><i className="zmdi zmdi-edit" /></a>
          <a href="#" onClick={() => (handleEliminar(row.m_nIdGuia))} className="btn btn-default btn-sm m-user-delete"><i className="zmdi zmdi-close" /></a>
      </div>,
    ignoreRowClick: true,
    allowOverflow: true,
    button: true,
  },
  {
    name:"IdGuia",
    selector: "m_nIdGuia",
    omit: "true",
    type: "int"
  },
  {
    visible: true,
    name:"fecha",
    selector: "m_dFecha",
    sortable: true
  },{
    visible: true,
    name:"Sucursal",
    selector: "m_sSucursal",
    sortable: true
  },{
    visible: true,
    name:"EstatusGuia",
    selector: "m_sEstatusGuia",
    sortable: true
  },{
    visible: true,
    name:"Origen",
    selector: "m_sCiudadOrigen",
    sortable: true,
  },{
    visible: true,
    name:"Destino",
    selector: "m_sCiudadDestino",
    sortable: true
  },{
    visible: true,
    name:"Folio Informe",
    selector: "m_nFolioInforme",
    sortable: true
  },{
    visible: true,
    name:"Folio Embarque",
    selector: "m_nFolioEmbarque",
    sortable: true
  }
  ,{
    visible: true,
    name:"Fecha Cancelación",
    selector: "m_dtFechaCancelacion",
    sortable: true
  }
  
  ,{
    visible: true,
    name:"Usuario Cancelación",
    selector: "m_nUsuarioCancelacion",
    sortable: true
  }
  ]);
  
  const columns2 = React.useMemo(() => [
    {
      Name:"Fecha",
      accessor: "m_dFecha",
    },{
      Name:"Sucursal",
      accessor: "m_sSucursal",
    },{
      Name:"Estatus Guia",
      accessor: "m_sEstatusGuia",
    },{
      Name:"Origen",
      accessor: "m_sCiudadOrigen",      
    },{
      Name:"Destino",
      accessor: "m_sCiudadDestino",
    },{
      Name:"Folio Informe",
      accessor: "m_nFolioInforme",    
    },{
      Name:"Folio Embarque",
      accessor: "m_nFolioEmbarque",
    },
    {
      Name:"Fecha de Cancelacion",
      accessor: "m_dtFechaCancelacion"
    },
    {
      Name:"Usuario de Cancelacion",
      accessor: "m_nUsuarioCancelacion"
    }
    
    ]);

  useEffect(value => {
    getAllData();
  }, []);

  async function getAllData() {
    const url = "http://localhost/Guia/GetListado";
    await axios.get(url, {headers}).then(respuesta => {
      setData(respuesta.data)
    });
  };

  const handleUpload = (e) => {
    e.preventDefault();

    var files = e.target.files, f = files[0];
    var reader = new FileReader();
    console.log(e.target.files)
    reader.onload = function (e) {
      console.log("Nothing Happened")
        var data = e.target.result;
        let readedData = XLSX.read(data, {type: 'binary'});
        const wsname = readedData.SheetNames[0];
        const ws = readedData.Sheets[wsname];

        /* Convert array to json*/
        const dataParse = XLSX.utils.sheet_to_json(ws, {header:1});
        console.log("dataParse : " +dataParse)
        setFileUploaded(dataParse);
    };
    reader.readAsBinaryString(f)
}
useEffect(value => {
  getAllDataSucursal();
}, []);

async function getAllDataSucursal() {
  const url = "http://localhost/Sucursales/GetListado";
  await axios.get(url, {headers}).then(respuesta => {
    setDataSucursal(respuesta.data)
  });
};

useEffect(value => {
  getAllDataMoneda();
}, []);

async function getAllDataMoneda() {
  const url = "http://localhost/Moneda/GetListado";
  await axios.get(url, {headers}).then(respuesta => {
    setDataMoneda(respuesta.data)
  });
};
useEffect(value => {
  getAllDataTipoCobro();
}, []);

async function getAllDataTipoCobro() {
  const url = "http://localhost/TipoCobro/GetListado";
  await axios.get(url, {headers}).then(respuesta => {
    setDataTipoCobro(respuesta.data)
  });
};

useEffect(value => {
  getAllDataTipoServicio();
}, []);

async function getAllDataTipoServicio() {
  const url = "http://localhost/TipoServicio/GetListado";
  await axios.get(url, {headers}).then(respuesta => {
    setDataTipoServicio(respuesta.data)
  });
};
useEffect(value => {
  getAllDataEstatusGuia();
}, []);

async function getAllDataEstatusGuia() {
  const url = "http://localhost/EstatusGuia/GetListado";
  await axios.get(url, {headers}).then(respuesta => {
    setDataEstatusGuia(respuesta.data)
  });
};
const headers = {
  'Content-Type': 'application/json',
//    'access-control-allow-origin': '*'
}

function GlobalFilter({
  preGlobalFilteredRows,
  globalFilter,
  setGlobalFilter,
}) {
  const count = preGlobalFilteredRows.length
  const [value, setValue] = React.useState(globalFilter)
  const onChange = useAsyncDebounce(value => {
      setGlobalFilter(value || undefined)
  }, 200)

  return (
      <span>
          Buscar:{' '}
          <input
              className="form-control"
              value={value || ""}
              onChange={e => {
                  setValue(e.target.value);
                  onChange(e.target.value);
              }}
              placeholder={`${count} registros...`}
          />
      </span>
  )
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

function Table({ columns, data}) {

  const defaultColumn = React.useMemo(
      () => ({
          // Default Filter UI
          Filter: DefaultColumnFilter
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
      useSortBy,      
  )

  return (
    <div className="col-md-12">
      <table className="table" {...getTableProps()}>
        <thead className="">
        
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
        <h2>Guias</h2>
      </div>

      <ul className="nav nav-tabs">
          <li className="active">
            <a data-toggle="tab" href="#Listado">
              <i className="fa fa-list"/> Listado
            </a>
          </li>
          <li>
            <a data-toggle="tab" href="#Agregar" onClick={handleShowAgregar}>
            <i className="fa fa-plus-circle"/> {state.agregar}
            </a>
          </li>
          <li className="hide">
            <a data-toggle="tab" href="#Importar">
            <i className="fa fa-upload"/> Importar
            </a>
          </li>
          <li>
            <ExportCSV csvData={data} fileName="Guia_Listado" />
          </li>
          <li>
            <ExportPDF data={data} column={columns} fileName="Guia"/>
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
                        <div className="input-group date addon-datepicker">
                          <input type="text" className="form-control" /><span className="input-group-addon"><i className="fa fa-calendar" /></span>
                        </div>
                      </div>
                      
                      <div className="col-sm-6 col-md-3 unit">
                        <label className="label">
                            Fecha Inicial
                        </label>
                        <div className="input-group date addon-datepicker">
                          <input type="text" className="form-control" /><span className="input-group-addon"><i className="fa fa-calendar" /></span>
                        </div>
                      </div>
                    
                      <div className="col-sm-6 col-md-3 unit">
                        <label className="label">
                          Sucursal
                        </label>
                        <div className="input">
                          <input
                            onChange={handleChange}
                            className="form-control"
                            type="select"
                            placeholder={state.codigoDepartamento}
                            id="codigoDepartamento"
                          />
                        </div>
                      </div>

                      <div className="col-sm-6 col-md-3 unit">
                        <label className="label">
                          Estatus
                        </label>
                        <div className="input">
                          <select
                            onChange={handleChange}
                            className="form-control"
                            type="calendar"
                            placeholder={state.codigoDepartamento}
                            id="codigoDepartamento"
                          />
                        </div>
                      </div>


                    </div>
                    </form>
                  </div>
                <div className="row">
                  <Table columns={columns2} data={data} />
                </div>
              </div>
          </div>
        </div>

        <div id="Agregar" className="tab-pane fade">
          <div className="widget-wrap">
            <div className="widget-header">
              <h2>Información General</h2>
            </div>
            <div className="widget-container">
              <div className="widget-content">
                <div className="row">
                  <div className="col-md-12">
                    <form className="j-forms">
                      <div className="form-content">
                        
                        <div className="col-sm-4 col-md-2-5 unit">
                          <label className="label">
                            Sucursal
                          </label>
                          <select
                            className="form-control"
                            required
                            onChange={handleChange}
                            id="idSucursal"
                            read="true"
                            disabled="disabled"
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
                        </div>
                        
                        <div className="col-sm-4 col-md-2-5 unit">
                          <label className="label">
                            Folio Guia
                          </label>
                          <div className="input">
                            <input
                              onChange={handleChange}
                              className="form-control"
                              type="text"
                              placeholder={state.folioGuia}
                              id="folioGuia"
                              disabled="disabled"
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
                              disabled="disabled"
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
                              className="form-control"
                              type="text"
                              placeholder={state.fecha}
                              id="fecha"
                              disabled="disabled"
                            />
                          </div>
                        </div>
                        
                        <div className="col-sm-4 col-md-2-5 unit">
                          <label className="label">
                            Estatus de la Guia
                          </label>
                          <select
                            className="form-control"
                            required
                            onChange={handleChange}
                            id="idEstatusGuia"
                            read="true"
                          >                           
                            {dataEstatusGuia.map(
                              (estatusGuia) => (
                                <option key={estatusGuia.m_nIdEstatusGuia} value={estatusGuia.m_nIdEstatusGuia} >
                                  {
                                    estatusGuia.m_sEstatus
                                  }
                                </option>
                              )
                            )}
                          </select>
                       
                        </div>

                        <div className="col-sm-4 col-md-2-5 unit">
                          <label className="label">
                            Moneda
                          </label>
                          <select
                            className="form-control"
                            required
                            onChange={handleChange}
                            id="idMoneda"
                            read="true"
                          >                           
                            {dataMoneda.map(
                              (moneda) => (
                                <option key={moneda.m_nIdMoneda} value={moneda.m_nIdMoneda}>
                                  {
                                    moneda.m_sMoneda
                                  }
                                </option>
                              )
                            )}
                          </select>
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
                          <select
                            className="form-control"
                            required
                            onChange={handleChange}
                            id="idTipoCobro"
                            read="true"
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
                        </div>
                        
                      </div>
                    </form>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/*remitente*/}
          <div className="widget-wrap ">
            <div >
            <div className="widget-header">
              <h2>Remitente</h2>
            </div>
            <div className="widget-container">
              <div className="widget-content">
                <div className="row">
                  <div className="col-md-12">
                    <form className="j-forms">
                      <div className="form-content">
                        
                        <div className="col-md-8 unit">
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
                        
                        <div className="col-md-4 unit">
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

                        <div className="col-md-8 unit">
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
                        
                        <div className="col-md-4 unit">
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

                        <div className="col-md-4 unit">
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
                        
                        <div className="col-md-4 unit">
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
                        
                        <div className="col-md-4 unit">
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

                        <div className="col-md-6 unit">
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
                        
                        <div className="col-md-6 unit">
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
                    </form>
                  </div>
                </div>
              </div>
            </div>
           
            {/*destinatario*/}
            
            <div className="widget-header">
              <h2>Destinatario</h2>
            </div>
            <div className="widget-container">
            <div className="widget-header">
              <h2>Conceptos de Facturacion</h2>
            </div>
            <div className="widget-container">
              <div className="widget-content">
                <div className="row">
                  <div className="col-md-12">
                    <form className="j-forms">
                      <div className="form-content">
                        <div className="col-sm-4">
                          <label className="label">
                            Tipo Cobro
                          </label>
                          <select
                            className="form-control"
                            required
                            onChange={handleChange}
                            id="idTipoCobro"
                            read="true"
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
                          </div>
                          <div className="col-sm-4">
                          <label className="label">
                            Tipo Servicio
                          </label>
                          <select
                            className="form-control"
                            required
                            onChange={handleChange}
                            id="idTipoServicio"
                            read="true"
                          >                           
                            {dataTipoServicio.map(
                              (tipoServicio) => (
                                <option key={tipoServicio.m_nIdTipoServicio} value={tipoServicio.m_nIdTipoServicio}>
                                  {
                                    tipoServicio.m_sDescripcion
                                  }
                                </option>
                              )
                            )}
                          </select>
                          </div>
                          <div className="col-sm-4">
                     
                          <label className="label">
                            Valor Declarado
                          </label>
                          <div className="input">
                            <input
                              onChange={handleChange}
                              className="form-control"
                              type="text"
                              placeholder={state.valorDeclardao}
                              id="valorDeclarado"
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
            
            <div className="col-md-3">
            <div className="form-footer" className="col-md-12">
                      
            <button data-layout="topCenter" data-type="information" className="btn btn-primary secondary-btn">Cancelar</button>
                        <button onClick={handleAceptar} className="btn btn-primary primary-btn">Aceptar</button>
            </div>
            </div>
          </div>
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

export default Guia;
