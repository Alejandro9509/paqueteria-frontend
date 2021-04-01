import React, { useEffect, useState, useMemo } from "react";
import DataTable from 'react-data-table-component';
import DataTableExtensions from "react-data-table-component-extensions";
import axios from "axios";
import Cabecera from "../Components/Template/Cabecera";
import BarraLateralIzquierda from "../Components/Template/BarraLateralIzquierda";
import BarraLateralDerecha from "../Components/Template/BarraLateralDerecha";
import BasicTable from "./BasicTable";
import ExportCSV from '../Components/Template/Export';
import ExportPDF from "../Components/Template/ExportPDF";
import * as XLSX from 'xlsx';
import { useTable, useFilters, useSortBy } from 'react-table'
import { makeStyles } from "@material-ui/core/styles";
import { DataGrid } from '@material-ui/data-grid';
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

function Zonas() {

  const classes = useStyles();
  const [data, setData] = React.useState([])
  const [dataSucursal, setDataSucursal] = React.useState([]);
  const [state, setState] = React.useState({
    idZona: 0,
    agregar: "Agregar",
    DerechoBorrar: 58,
    codigoDepartamento: "",
    descripcionDepartamento: "",
    importar: "",
    CreadoPor: localStorage.getItem("UsuarioId"),
    ModificadoPor: localStorage.getItem("UsuarioId"),
    height: window.innerHeight
  })
  const [fileUploaded, setFileUploaded] = React.useState([])

  const handleAceptar = (e) => {
    e.preventDefault()
    var params = {

      "Codigo": state.codigoDepartamento,
      "Descripcion": state.descripcionDepartamento,

      "CreadoPor": state.CreadoPor,
      "ModificadoPor": state.ModificadoPor
    }
    console.log(params)
    if (state.idDepartamento != 0) {
      const url = `${process.env.REACT_APP_API_URL}/Departamento/Modificar/` + state.idDepartamento;
      axios.put(url, Object.assign({}, params), { headers }).then(respuesta => {
        showSuccess(respuesta.data)
        getAllData()
      }).catch(err => {
        console.log(err)
        showSuccess("err")
      });
    } else {
      const url = `${process.env.REACT_APP_API_URL}/Departamento/Agregar`;
      axios.post(url, Object.assign({}, params), { headers }).then(respuesta => {
        showSuccess(respuesta.data)
        getAllData()
      }).catch(err => {
        console.log(err)
        showSuccess(err)
      });
    }

  }

  function handleEliminar(id) {
    var derecho;
    const urlDelete = `${process.env.REACT_APP_API_URL}/Utilerias/ValidaDerechos/${state.CreadoPor}/${state.DerechoBorrar}/3`;
    axios.get(urlDelete, { headers }).then(respuesta => {
      derecho = respuesta.data;
      if (derecho == false) {
        showSuccess("El usuario no tiene derechos para realizar el proceso");
        return;
      }

      const url = `${process.env.REACT_APP_API_URL}/Departamento/Eliminar/` + id;
      axios.delete(url, { headers }).then(respuesta => {
        console.log(respuesta);
        getAllData();
      }).catch(err => {
        showSuccess(err)
      });
    }).catch(err => {
      showSuccess(err)
    });
  }

  function handleShowModificar(id) {
    const url = `${process.env.REACT_APP_API_URL}/Departamento/GetById/` + id;
    axios.get(url, { headers }).then(respuesta => {
      console.log(respuesta.data)
      setState({
        ...state,
        agregar: "Modificar",
        showPopUp: true,
        idDepartamento: id,
        codigoDepartamento: respuesta.data.m_nCodigo,
        descripcionDepartamento: respuesta.data.m_sDescripcion
      })
    });
  }

  function handleShowConsultar(id) {
    const url = `${process.env.REACT_APP_API_URL}/Departamento/GetById/` + id;
    axios.get(url, { headers }).then(respuesta => {
      console.log(respuesta.data)
      setState({
        ...state,
        agregar: "Consultar",
        showPopUp: true,
        idDepartamento: id,
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
      codigoDepartamento: "",
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

  const columns = React.useMemo(() => [
    {
      headerName: "Acciones",
      field: "",
      renderCell: (row) => {
        return (
          <div>
            <a href="#Agregar" role="tab" data-toggle="tab" onClick={() => (handleShowModificar(row.row.m_nIdDepartamento))} className="btn btn-default btn-xs"><i className="fa fa-pencil-square-o" style={{ color: "#F9A03E" }} /></a>
            <a href="#Agregar" role="tab" data-toggle="tab" className="btn btn-default btn-xs" onClick={() => (handleShowConsultar(row.row.m_nIdDepartamento))}><i className="fa fa-eye" style={{ color: "#F9A03E" }} /></a>
            <a href="#" className="btn btn-default btn-xs" onClick={() => (handleEliminar(row.row.m_nIdDepartamento))}><i className="zmdi zmdi-delete" style={{ color: "#F30B0B" }} /></a>
          </div>
        )
      }
    },
    {
      headerName: "Folio",
      field: "m_nFolio",
      width: 125,
    },
    {
      headerName: "Descripción",
      field: "m_sDescripcion",
      width: 200,
    },
    {
      headerName: "Sucursal",
      field: "m_nIdSucursal",
      width: 200,
      renderCell: (row) => {
        return (
          <div>
            { dataSucursal.find(o => o.m_nIdSucursal == row.row.m_nIdSucursal).m_sSucursal}
          </div>
        )
      }
    },
    {
      headerName: "Creado El",
      field: "m_dtCreadoEl",
      width: 200,
    },
    {
      headerName: "Creado Por",
      field: "m_nCreadoPor",
      width: 125,
    },
    {
      headerName: "Modificado El",
      field: "m_dtModificadoEl",
      width: 200,
    },
    {
      headerName: "Modificado Por",
      field: "m_nModificadoPor",
      width: 150,
    }

  ]);

  useEffect( async value => {
    if (localStorage.getItem("UsuarioId") === null || localStorage.getItem("UsuarioId") <= 0) {
      showSuccess("Es necesario iniciar sesion para acceder a este proceso");
      window.location.replace("login");
      return;
    }
    getAllData();
    getAllSucursalData();
  }, []);

  function getAllData() {
    const url = `${process.env.REACT_APP_API_URL}/Zonas/GetListado`;
    axios.get(url, { headers }).then(respuesta => {
      setData(respuesta.data)
    });
  };

  async function getAllSucursalData() {
    const url = `${process.env.REACT_APP_API_URL}/Sucursales/GetListado`;
    await axios.get(url, { headers }).then((respuesta) => {
      setDataSucursal(respuesta.data);
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

  return (
    <div>

      <header className="topbar clearfix">
        <Cabecera />
      </header>

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
                <h2>Zonas</h2>
              </div>
              <div className="col-md-6 col-sm-6">
                <ul className="list-page-breadcrumb">
                  <li>
                    <a href="/Catalogos" className="color-mapeo">
                      Configuración <i className="zmdi zmdi-chevron-right" />
                    </a>
                  </li>
                  <li className="active-page">Zonas</li>
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
              <a data-toggle="tab" href="#Agregar">
                Imprimir
              </a>
            </li>
          </ul>

          <div className="row" className="tab-content">
            <div className="widget-wrap" id="Listado" className="tab-pane fade in active">
              <div className="widget-wrap">
                <div className="widget-content">
                  <div className="row" style={{ height: state.height - 250, width: '100%' }}>
                    {data.length != 0 ? (
                      <DataGrid
                        rows={data}
                        columns={columns}
                        density="compact"
                        pageSize={Math.floor((state.height - 310) / 30)}
                        getRowId={(row) => row.m_nIdZona}
                        onRowSelected={(row) => {
                          setState({
                            ...state,
                            idZona: row.data.m_nIdZona
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

            <div className="widget-wrap" id="Agregar" className="tab-pane fade">
              <div className="widget-wrap">
                <div className="widget-content">
                  <div className="row">
                      <form className="j-forms" onSubmit={handleAceptar}>
                        <div className="form-content">
                            <div className="row" style={{ display: "flex" }}>
                              <div className="col-sm-6 col-md-4 unit">
                                <label className="label">Folio</label>
                                <div className="input">
                                  <input
                                    type="text"
                                    className="form-control"
                                    value={state.fechaInicial}
                                    onChange={handleChange}
                                    id="fechaInicial"
                                  />
                                </div>
                              </div>

                              <div className="col-sm-6 col-md-4 unit">
                                <label className="label">Fecha Final</label>
                                <div className="input">
                                  <input
                                    type="date"
                                    className="form-control"
                                    value={state.fechaFinal}
                                    onChange={handleChange}
                                    id="fechaFinal"
                                  />
                                </div>

                              </div>

                              <div className="col-sm-6 col-md-4 unit">
                                <label className="label">Sucursal</label>
                                <label className="input select">
                                  <select
                                    className="form-control"
                                    required
                                    value={state.sucursalListado}
                                    onChange={handleChange}
                                    id="sucursalListado"
                                  >
                                    <option value="0">Todas</option>
                                    {dataSucursal.map((sucursal) => (
                                      <option
                                        key={sucursal.m_nIdSucursal}
                                        value={sucursal.m_nIdSucursal}
                                      >
                                        {sucursal.m_sSucursal}
                                      </option>
                                    ))}
                                  </select>
                                  <i></i>
                                </label>
                              </div>
                           </div>

                            <div className="widget-wrap col-sm-6 col-md-3">
                              <DataGrid
                                columns={columns}
                                data={data}
                              />
                            </div>

                            <div className="widget-wrap col-sm-6 col-md-3">
                              Código Postal
                            </div>

                            <div className="widget-wrap col-sm-6 col-md-3">
                              Localidades
                            </div>

                            <div className="widget-wrap col-sm-6 col-md-3">
                              Colonias
                            </div>

                          <div className="row">
                            <div className="form-footer" className="col-sm-12 col-md-12 unit">
                              <button data-layout="topCenter" data-type="information" className="btn btn-secondary secondary-btn"> Cancelar</button>
                              <button type="submit" className="btn btn-primary primary-btn">Aceptar</button>
                            </div>
                          </div>
                        </div>

                      </form>
                  </div>
                </div>
              </div>
            </div>

            <div className="widget-wrap" id="Importar" className="tab-pane fade">
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
                          <button data-layout="topCenter" data-type="information" className="btn btn-secondary secondary-btn"> Cancelar</button>
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

export default Zonas;
