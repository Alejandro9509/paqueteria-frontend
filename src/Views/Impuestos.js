import React, { useEffect, useState, useMemo } from "react";
import axios from "axios";
import Cabecera from "../Components/Template/Cabecera";
import BarraLateralIzquierda from "../Components/Template/BarraLateralIzquierda";
import BarraLateralDerecha from "../Components/Template/BarraLateralDerecha";
import { DataGrid } from '@material-ui/data-grid';
import SvgIcon from "@material-ui/core/SvgIcon";
import { ReactComponent as ActivoIcon } from '../iconos/Menu/palomita.svg';
import { ReactComponent as NoActivoIcon } from '../iconos/Menu/cruz.svg';
import Noty from 'noty';

function showSuccess(mensaje) {
  new Noty({
    type: "information",
    layout: "topCenter",
    text: mensaje,
    timeout: "3000"
  }).show()
}

function Impuestos() {

  const [data, setData] = React.useState([])
  const [state, setState] = React.useState({
    idImpuestos: 0,
    DerechoBorrar: 58,
    descripcionImpuestos: "",
    impuestoLocal: false,
    porcentajeImpuesto: 0,
    tipoDeCalculo: "",
    tipoImpuesto: "",
    activo: false,
    agregar: "Agregar",
    CreadoPor: localStorage.getItem("UsuarioId"),
    ModificadoPor: localStorage.getItem("UsuarioId"),
    height: window.innerHeight
  })

  const handleAceptar = (e) => {
    e.preventDefault()
    var params = {

      "m_sImpuesto": state.descripcionImpuestos,
      "m_bImpuestoLocal": state.impuestoLocal,
      "m_nPorcentaje": state.porcentajeImpuesto,
      "m_nTIpoCalculo": state.tipoDeCalculo,
      "m_nTIpoImpuesto": state.tipoImpuesto,
      "m_bActivo": state.activo,

      "m_nCreadoPor": state.CreadoPor,
      "m_nModificadoPor": state.ModificadoPor
    }
    console.log(params)
    if (state.idImpuestos != 0) {
      const url = `${process.env.REACT_APP_API_URL}/Impuestos/Modificar/` + state.idImpuestos;
      axios.put(url, Object.assign({}, params), { headers }).then(respuesta => {
        showSuccess(respuesta.data)
        getAllData()
      }).catch(err => {
        console.log(err)
        showSuccess("err")
      });
    } else {
      const url = `${process.env.REACT_APP_API_URL}/Impuestos/Agregar`;
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

      const url = `${process.env.REACT_APP_API_URL}/Impuestos/Eliminar/` + id;
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
    const url = `${process.env.REACT_APP_API_URL}/Impuestos/GetById/` + id;
    axios.get(url, { headers }).then(respuesta => {
      console.log(respuesta.data)
      setState({
        ...state,
        agregar: "Modificar",
        showPopUp: true,
        idImpuestos: id,
        descripcionImpuestos: respuesta.data.m_sImpuesto,
        impuestoLocal: respuesta.data.m_bImpuestolocal,
        porcentajeImpuesto: respuesta.data.m_nPorcentaje,
        tipoDeCalculo: respuesta.data.m_nTIpoCalculo,
        tipoImpuesto: respuesta.data.m_nTIpoImpuesto,
        activo: respuesta.data.m_bActivo,
      })
    });
  }

  function handleShowConsultar(id) {
    const url = `${process.env.REACT_APP_API_URL}/Impuestos/GetById/` + id;
    axios.get(url, { headers }).then(respuesta => {
      console.log(respuesta.data)
      setState({
        ...state,
        agregar: "Consultar",
        showPopUp: true,
        idImpuestos: id,
        codigoImpuestos: respuesta.data.m_nCodigo,
        descripcionImpuestos: respuesta.data.m_sDescripcion
      })
    });
  }

  function handleShowAgregar() {
    setState({
      ...state,
      agregar: "Agregar",
      showPopUp: true,
      idImpuestos: 0,
      codigoImpuestos: "",
      descripcionImpuestos: ""
    })
  }

  const handleChange = event => {
    console.log(event.target.id + " : " + event.target.value)
    setState({
      ...state,
      [event.target.id]: event.target.value
    });
  };

  const handleChangeTipoImpuesto = event => {
    let valor = 1
    if (event.target.value == 1) {
      valor = 1
    } else if (event.target.value == 3) {
      valor = 2
    }
    setState({
      ...state,
      [event.target.id]: event.target.value,
      tipoDeCalculo: valor
    });
  }

  const columns = React.useMemo(() => [
    {
      headerName: "Acciones",
      field: "",
      renderCell: (row) => {
        return (
          <div>
            <a href="#Agregar" role="tab" data-toggle="tab" onClick={() => (handleShowModificar(row.row.m_nIdImpuesto))} className="btn btn-default btn-xs"><i className="fa fa-pencil-square-o" style={{ color: "#F9A03E" }} /></a>
            <a href="#Agregar" role="tab" data-toggle="tab" className="btn btn-default btn-xs" onClick={() => (handleShowConsultar(row.row.m_nIdImpuesto))}><i className="fa fa-eye" style={{ color: "#F9A03E" }} /></a>
            <a href="#" className="btn btn-default btn-xs" onClick={() => (handleEliminar(row.row.m_nIdImpuesto))}><i className="zmdi zmdi-delete" style={{ color: "#F30B0B" }} /></a>
          </div>
        )
      }
    },
    {
      headerName: "Clave Impuesto",
      field: "m_nIdImpuesto",
      width: 200,
    }, {
      headerName: "Descripción",
      field: "m_sImpuesto",
      width: 200,
    }, {
      headerName: "Porcentaje",
      field: "m_nPorcentaje",
      width: 125,
    }, {
      headerName: "Tipo Cálculo",
      field: "m_nTipoCalculo",
      width: 125,
      renderCell: (row) => {
        return (
          <div>
            {row.row.m_nTIpoCalculo == 1 ?
              <div>Retención</div> :
              <div>Traslado</div>
            }
          </div>
        )
      },
    }, {
      headerName: "Tipo de Impuesto",
      field: "m_nTipoImpuesto",
      width: 200,
      renderCell: (row) => {
        return (
          <div>
            {row.row.m_bImpuestolocal ?
              <div>Local</div> :
              <div>Federal</div>
            }
          </div>
        )
      },
    }, {
      headerName: "Activo",
      field: "m_bActivo",
      width: 125,
      renderCell: (row) => {
        return (
          <div style={{ width: "100%", textAlign: "center", color: row.row.m_bActivo ? "green" : "red" }}>
            {row.row.m_bActivo ?
              <SvgIcon
                component={ActivoIcon}
              /> :
              <SvgIcon
                component={NoActivoIcon}
              />
            }
          </div>
        )
      },
    },

  ]);

  useEffect(value => {
    if (localStorage.getItem("UsuarioId") === null || localStorage.getItem("UsuarioId") <= 0) {
      showSuccess("Es necesario iniciar sesion para acceder a este proceso");
      window.location.replace("login");
      return;
    }
    getAllData();
  }, []);

  function getAllData() {
    const url = `${process.env.REACT_APP_API_URL}/Impuestos/GetListado`;
    axios.get(url, { headers }).then(respuesta => {
      setData(respuesta.data)
      console.log(respuesta.data)
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
                <h2>Impuestos</h2>
              </div>
              <div className="col-md-6 col-sm-6">
                <ul className="list-page-breadcrumb">
                  <li>
                    <a href="/Catalogos" className="color-mapeo">
                      Catálogos <i className="zmdi zmdi-chevron-right" />
                    </a>
                  </li>
                  <li className="active-page">Impuestos</li>
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
                        getRowId={(row) => row.m_nIdImpuesto}
                        onRowSelected={(row) => {
                          setState({
                            ...state,
                            idImpuestos: row.data.m_nIdImpuesto
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
                          <div className="row">

                            <div className="col-xs-6 col-sm-6 col-md-4 col-lg-4 unit">
                              <label className="label">
                                Impuesto
                          </label>
                              <div className="input">
                                <input
                                  onChange={handleChange}
                                  className="form-control"
                                  type="text"
                                  required
                                  readOnly={state.agregar == "Consultar"}
                                  value={state.descripcionImpuestos}
                                  id="descripcionImpuestos"
                                />
                              </div>
                            </div>

                            <div className="col-xs-6 col-sm-6 col-md-4 col-lg-4 unit" style={{ paddingTop: "20px", marginBottom: "15px" }}>
                              <label className="checkbox">
                                <input
                                  disabled={state.agregar == "Consultar"}
                                  native="true"
                                  checked={state.activo}
                                  name="activo"
                                  onChange={(e) => setState({ ...state, activo: e.target.checked })}
                                  type="checkbox"
                                />
                                <i />
                                Activo
                              </label>
                            </div>

                            <div className="col-xs-6 col-sm-6 col-md-4 col-lg-4 unit" style={{ paddingTop: "20px", marginBottom: "15px" }}>
                              <label className="checkbox">
                                <input
                                  disabled={state.agregar == "Consultar"}
                                  native="true"
                                  checked={state.impuestoLocal}
                                  name="impuestoLocal"
                                  onChange={(e) => {
                                    setState({
                                      ...state,
                                      impuestoLocal: e.target.checked,
                                      tipoImpuesto: 0,
                                      tipoDeCalculo: 1,
                                    })
                                  }}
                                  type="checkbox"
                                />
                                <i />
                                Impuesto Local
                              </label>
                            </div>

                            <div className="col-xs-6 col-sm-6 col-md-4 col-lg-4 unit">
                              <label className="label">
                                Porcentaje
                          </label>
                              <div className="input">
                                <input
                                  onChange={handleChange}
                                  className="form-control"
                                  min="0"
                                  max="999"
                                  step="0.01"
                                  required
                                  readOnly={state.agregar == "Consultar"}
                                  value={state.porcentajeImpuesto}
                                  id="porcentajeImpuesto"
                                />
                              </div>
                            </div>

                            <div className="col-xs-6 col-sm-6 col-md-4 col-lg-4 unit">
                              <label className="label">
                                Tipo de Cálculo
                              </label>
                              <label className="input select">
                                <select
                                  className="form-control"
                                  value={state.tipoDeCalculo}
                                  disabled={state.agregar == "Consultar" || state.impuestoLocal || state.tipoImpuesto == 1 || state.tipoImpuesto == 3}
                                  onChange={handleChange}
                                  id="tipoDeCalculo"
                                  name="tipoDeCalculo"
                                >
                                  <option value="1">
                                    Retención
                                  </option>
                                  <option value="2">
                                    Traslado
                                  </option>
                                </select>
                                <i className="fa fa-arrow-down" />
                              </label>
                            </div>

                            {!state.impuestoLocal ?
                              <div className="col-xs-6 col-sm-6 col-md-4 col-lg-4 unit">
                                <label className="label">
                                  Tipo Impuesto
                              </label>
                                <label className="input select">
                                  <select
                                    className="form-control"
                                    value={state.tipoImpuesto}
                                    disabled={state.agregar == "Consultar"}
                                    onChange={handleChangeTipoImpuesto}
                                    id="tipoImpuesto"
                                    name="tipoImpuesto"
                                  >
                                    <option value="2">
                                      IVA
                                  </option>
                                    <option value="1">
                                      ISR
                                  </option>
                                    <option value="3">
                                      IEPS
                                  </option>
                                  </select>
                                  <i className="fa fa-arrow-down" />
                                </label>
                              </div>
                              : <div></div>}

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

export default Impuestos;
