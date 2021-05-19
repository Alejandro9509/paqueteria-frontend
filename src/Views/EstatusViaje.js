import React, { useEffect, useState, useMemo } from "react";
import axios from "axios";
import Cabecera from "../Components/Template/Cabecera";
import BarraLateralIzquierda from "../Components/Template/BarraLateralIzquierda";
import BarraLateralDerecha from "../Components/Template/BarraLateralDerecha";
import { TextField } from '@material-ui/core';
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

function EstatusViaje() {

  const classes = useStyles();
  const [data, setData] = React.useState([])
  const [state, setState] = React.useState({
    idEstatusViaje: 0,
    DerechoBorrar: 81,
    estatusViaje: "",
    abreviacionViaje: "",
    colorViaje: "",
    noSeguimiento: false,
    archivo: false,
    carga: false,
    agregar: "Agregar",
    importar: "",
    height: window.innerHeight,
    CreadoPor: localStorage.getItem("UsuarioId"),
    ModificadoPor: localStorage.getItem("UsuarioId")
  })

  const handleAceptar = (e) => {
    e.preventDefault()
    var params = {

      "Estatus": state.estatusViaje,
      "Color": state.colorViaje.slice(-6),
      "Abreviacion": state.abreviacionViaje,
      "NoEnviarCorreo": state.noSeguimiento,
      "ArchivoEDI": state.archivo,
      "Carga": state.carga,
      "CreadoPor": state.CreadoPor,
      "CreadoEl": "",
      "ModificadoPor": state.ModificadoPor,
      "ModificadoEl": ""
    }
    console.log(params)
    if (state.idEstatusViaje != 0) {
      const url = `${process.env.REACT_APP_API_URL}/EstatusViajes/Modificar/` + state.idEstatusViaje;
      axios.put(url, Object.assign({}, params), { headers }).then(respuesta => {
        showSuccess(respuesta.data)
        getAllData();
      }).catch(err => {
        console.log(err)
        showSuccess("err")
      });
    } else {
      const url = `${process.env.REACT_APP_API_URL}/EstatusViajes/Agregar`;
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
      //showSuccess(respuesta.data)

      derecho = respuesta.data;
      if (derecho == false) {
        showSuccess("El usuario no tiene derechos para realizar el proceso");
        return;
      }

      const url = `${process.env.REACT_APP_API_URL}/EstatusViajes/Eliminar/` + id;
      axios.delete(url, { headers }).then(respuesta => {
        showSuccess(respuesta.data)
        getAllData()
      }).catch(err => {
        showSuccess(err.data)
      });
    }).catch(err => {
      showSuccess(err.data)
    });
  }

  function handleShowModificar(id) {
    const url = `${process.env.REACT_APP_API_URL}/Estatusviajes/GetById/${id}`;
    axios.get(url, { headers }).then(respuesta => {
      console.log(respuesta.data)
      setState({
        ...state,
        agregar: "Modificar",
        showPopUp: true,
        idEstatusViaje: id,
        estatusViaje: respuesta.data.m_sEstatus,
        abreviacionViaje: respuesta.data.m_sAbreviacion,
        tipoEstatusViaje: respuesta.data.m_nTipoEstatus,
        colorViaje: "#" + respuesta.data.m_sColor,
      })
    });
  }

  function handleShowConsultar(id) {
    const url = `${process.env.REACT_APP_API_URL}/Estatusviajes/GetById/${id}`;
    axios.get(url, { headers }).then(respuesta => {
      console.log(respuesta.data)
      setState({
        ...state,
        agregar: "Consultar",
        showPopUp: true,
        idEstatusViaje: id,
        estatusViaje: respuesta.data.m_sEstatus,
        abreviacionViaje: respuesta.data.m_sAbreviacion,
        tipoEstatusViaje: respuesta.data.m_nTipoEstatus,
        colorViaje: "#" + respuesta.data.m_sColor,
      })
    });
  }

  function handleShowAgregar() {
    setState({
      ...state,
      agregar: "Agregar",
      idEstatusViaje: 0,
      estatusViaje: "",
      abreviacionViaje: "",
      tipoEstatusViaje: 1,
      colorViaje: "#000000",
    })
  }

  const handleChange = event => {
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
            <a href="#Agregar" role="tab" data-toggle="tab" onClick={() => (handleShowModificar(row.row.m_nIdEstatusViaje))} className="btn btn-default btn-xs"><i className="fa fa-pencil-square-o" style={{ color: "#F9A03E" }} /></a>
            <a href="#Agregar" role="tab" data-toggle="tab" className="btn btn-default btn-xs" onClick={() => (handleShowConsultar(row.row.m_nIdEstatusViaje))}><i className="fa fa-eye" style={{ color: "#F9A03E" }} /></a>
            <a href="#" className="btn btn-default btn-xs" onClick={() => (handleEliminar(row.row.m_nIdEstatusViaje))}><i className="zmdi zmdi-delete" style={{ color: "#F30B0B" }} /></a>
          </div>
        )
      }
    },
    {
      headerName: "Abreviación",
      field: "m_sAbreviacion",
      width: 125,
      renderCell: (row) => {
        return (
          <div style={{ backgroundColor: "#" + row.row.m_sColor, width: "100%", textAlign: "center" }}>
            {row.row.m_sAbreviacion}
          </div>
        )
      }
    }, {
      headerName: "Estatus",
      field: "m_sEstatus",
      width: 125,
    }, {
      headerName: "Creado El",
      field: "m_dtCreadoEl",
      width: 200,
    }, {
      headerName: "Creado Por",
      field: "m_nCreadoPor",
      width: 200,
    }, {
      headerName: "Modificado El",
      field: "m_dtModificadoEl",
      width: 200,
    }, {
      headerName: "Modificado Por",
      field: "m_nModificadoPor",
      width: 200,
    }

  ]);

  useEffect(value => {
    if (localStorage.getItem("UsuarioId") === null || localStorage.getItem("UsuarioId") <= 0) {
      showSuccess("Es necesario iniciar sesion para acceder a este proceso");
      window.location.replace("configuracion");
      return;
    }
    getAllData();
  }, []);

  function getAllData() {
    const url = `${process.env.REACT_APP_API_URL}/EstatusViajes/GetListado`;
    axios.get(url, { headers }).then(respuesta => {
      setData(respuesta.data)
    });
  };

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
                <h2>Estatus Viaje</h2>
              </div>
              <div className="col-md-6 col-sm-6">
                <ul className="list-page-breadcrumb">
                  <li>
                    <a href="/Catalogos" className="color-mapeo">
                      Catálogos <i className="zmdi zmdi-chevron-right" />
                    </a>
                  </li>
                  <li className="active-page">Estatus Viaje</li>
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
                        getRowId={(row) => row.m_nIdEstatusViaje}
                        onRowSelected={(row) => {
                          setState({
                            ...state,
                            idEstatusViaje: row.data.m_nIdEstatusViaje
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
                    <div className="col-md-12">
                      <form className="j-forms" onSubmit={handleAceptar}>
                        <div className="form-content">

                          <div className="col-xs-6 col-sm-6 col-md-4 col-lg-4" style={{ padding: "5px" }}>

                            <div className="input">
                              <TextField variant="outlined" margin="dense"
                                onChange={handleChange}
                                className="form-control"
                                type="text"
                                label="Estatus"
                                required
                                value={state.estatusViaje}
                                id="estatusViaje"
                              />
                            </div>
                          </div>

                          <div className="col-xs-6 col-sm-6 col-md-4 col-lg-4" style={{ padding: "5px" }}>

                            <div className="input">
                              <TextField variant="outlined" margin="dense"
                                onChange={handleChange}
                                className="form-control"
                                type="text"
                                label="Abreviación"
                                required
                                value={state.abreviacionViaje}
                                id="abreviacionViaje"
                              />
                            </div>
                          </div>

                          <div className="col-xs-6 col-sm-6 col-md-4 col-lg-4" style={{ padding: "5px" }}>

                            <div className="input">
                              <TextField variant="outlined" margin="dense"
                                onChange={handleChange}
                                className="form-control"
                                type="color"
                                label="Color"
                                required
                                value={state.colorViaje}
                                id="colorViaje"
                              />
                            </div>
                          </div>

                          <div className="col-xs-6 col-sm-6 col-md-4 col-lg-4 unit">
                            <label className="checkbox">
                              <input
                                required
                                native="true"
                                checked={state.noSeguimiento}
                                name="noSeguimiento"
                                onChange={(e) => setState({ ...state, noSeguimiento: e.target.checked })}
                                type="checkbox"
                              />
                              <i />
                              No Enviar por Correo Seguimiento de Viajes
                            </label>
                          </div>

                          <div className="col-xs-6 col-sm-6 col-md-4 col-lg-4 unit">
                            <label className="checkbox">
                              <input
                                required
                                native="true"
                                checked={state.archivo}
                                name="archivo"
                                onChange={(e) => setState({ ...state, archivo: e.target.checked })}
                                type="checkbox"
                              />
                              <i />
                              Archivo EDI 214
                            </label>
                          </div>

                          <div className="col-xs-6 col-sm-6 col-md-4 col-lg-4 unit">
                            <label className="checkbox">
                              <input
                                required
                                native="true"
                                checked={state.carga}
                                name="carga"
                                onChange={(e) => setState({ ...state, carga: e.target.checked })}
                                type="checkbox"
                              />
                              <i />
                              Carga
                            </label>
                          </div>

                        </div>
                        <br></br>
                        <div className="form-footer" className="col-12 col-sm-12 col-md-10 unit">
                          <button href="#Listado" role="tab" data-toggle="tab" className="btn btn-secondary secondary-btn">
                            Cancelar</button>
                          <button type="submit" className="btn btn-primary primary-btn">Aceptar</button>
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

export default EstatusViaje;
