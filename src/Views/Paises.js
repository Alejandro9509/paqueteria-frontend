import React, { useEffect, useState, useMemo } from "react";
import axios from "axios";
import Cabecera from "../Components/Template/Cabecera";
import BarraLateralIzquierda from "../Components/Template/BarraLateralIzquierda";
import BarraLateralDerecha from "../Components/Template/BarraLateralDerecha";
import { useTable, useFilters, useSortBy } from 'react-table';
import { makeStyles } from "@material-ui/core/styles";
import { DataGrid } from '@material-ui/data-grid';

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

function PaisesEstado() {

  const classes = useStyles();
  const [data, setData] = React.useState([])
  const [dataEstado, setDataEstado] = React.useState([])
  const [dataMoneda, setDataMoneda] = React.useState([])
  const [state, setState] = React.useState({
    idPais: 0,
    idMoneda: 0,
    codigo: "",
    pais: "",
    DerechoBorrar:10,
    idEstado: 0,
    estado: "",
    codigoEstado: "",
    abreviacionEstado: "",

    agregarPais: "Agregar",
    agregarEstado: "Agregar",
    height: window.innerHeight,
    CreadoPor:localStorage.getItem("UsuarioId") ,
    ModificadoPor:localStorage.getItem("UsuarioId") 
  })

  const handleAceptarPais = (e) => {
    e.preventDefault()
    var params = {

      "m_nIdPais": state.idPais,
      "m_nIdMoneda": state.idMoneda,
      "m_sCodigo": state.codigo,
      "m_sPais": state.pais,
      "CreadoPor": state.CreadoPor,
      "ModificadoPor": state.ModificadoPor
    }
    console.log(params)
    if (state.idPais != 0) {
      const url = `${process.env.REACT_APP_API_URL}/Pais/Modificar/` + state.idPais;
      axios.put(url, Object.assign({}, params), { headers }).then(respuesta => {
        showSuccess(respuesta.data)
        getAllData();
      }).catch(err => {
        console.log(err)
        showSuccess("err")
      });
    } else {
      const url = `${process.env.REACT_APP_API_URL}/Pais/Agregar`;
      axios.post(url, Object.assign({}, params), { headers }).then(respuesta => {
        showSuccess(respuesta.data)
        getAllData();
      }).catch(err => {
        console.log(err)
        showSuccess(err)
      });
    }

  }

  const handleAceptarEstado = (e) => {
    e.preventDefault()
    let fecha = new Date();
    var params = {

      "IdEstado": state.idEstado,
      "IdPais": state.idPais,
      "Abreviacion": state.abreviacionEstado,
      "Codigo": state.codigoEstado,
      "Estado": state.estado,
      "CreadoPor": state.CreadoPor,
      "CreadoEl": fecha.getFullYear() + "-" + fecha.getMonth() + 1 + "-" + fecha.getDate(),
      "ModificadoEl": fecha.getFullYear() + "-" + fecha.getMonth() + 1 + "-" + fecha.getDate(),
      "ModificadoPor": 1,
      "Identificador": 0
    }
    console.log(params)
    if (state.idEstado != 0) {
      const url = `${process.env.REACT_APP_API_URL}/Estado/Modificar/` + state.idEstado;
      axios.put(url, Object.assign({}, params), { headers }).then(respuesta => {
        showSuccess(respuesta.data)
        getAllData();
      }).catch(err => {
        console.log(err)
        showSuccess("err")
      });
    } else {
      const url = `${process.env.REACT_APP_API_URL}/Estado/Agregar`;
      axios.post(url, Object.assign({}, params), { headers }).then(respuesta => {
        showSuccess(respuesta.data)
        console.log(respuesta.data)
        getAllData();
      }).catch(err => {
        console.log(err)
        showSuccess(err)
      });
    }

  }

  function handleEliminarPais(id) {
    var derecho;
    debugger;
    const urlDelete = `${process.env.REACT_APP_API_URL}/Utilerias/ValidaDerechos/${state.CreadoPor}/${state.DerechoBorrar}/3`;
    axios.get(urlDelete, { headers }).then(respuesta => {
      //showSuccess(respuesta.data)

      derecho = respuesta.data;
      if (derecho == false)
      {
        showSuccess ("El usuario no tiene derechos para realizar el proceso");
        return; 
      }
      const url = `${process.env.REACT_APP_API_URL}/Pais/Eliminar/` + id;
    axios.delete(url, { headers }).then(respuesta => {
      showSuccess(respuesta.data)
      getAllData();
    }).catch(err => {
      showSuccess(err)
    });
	}).catch(err => {
    showSuccess(err)
    });
    
  }

  function handleEliminarEstado(id) {
    const url = `${process.env.REACT_APP_API_URL}/Estado/Eliminar/` + id;
    axios.delete(url, { headers }).then(respuesta => {
      showSuccess(respuesta.data)
      getAllEstado(state.idPais)
    }).catch(err => {
      showSuccess(err)
    });
  }

  function handleShowModificarPais(id) {
    const url = `${process.env.REACT_APP_API_URL}/Pais/ById/${id}`;
    axios.get(url, { headers }).then(respuesta => {
      console.log(respuesta.data)
      setState({
        ...state,
        agregar: "Modificar",
        idPais: id,
        idMoneda: respuesta.data.m_nIdMoneda,
        codigo: respuesta.data.m_sCodigo,
        pais: respuesta.data.m_sPais,
      })
    });
  }

  function handleShowModificarEstado(id) {
    const url = `${process.env.REACT_APP_API_URL}/Estado/GetById/${id}`;
    axios.get(url, { headers }).then(respuesta => {
      console.log(respuesta.data)
      setState({
        ...state,
        agregar: "Modificar",
        idEstado: id,
        estado: respuesta.data.m_sEstado,
        codigoEstado: respuesta.data.m_sCodigo,
        abreviacionEstado: respuesta.data.m_sAbreviacion,
      })
    });
  }

  function handleShowAgregarPais() {
    setState({
      ...state,
      agregar: "Agregar",
      idPais: 0,
      idMoneda: 0,
      codigo: "",
      pais: "",
    })
  }

  function handleShowAgregarEstado() {
    setState({
      ...state,
      agregarEstado: "Agregar",
      idEstado: 0,
      estado: "",
      codigoEstado: "",
      abreviacionEstado: "",
    })
  }

  const handleChange = event => {
    console.log(event.target.value)
    setState({
      ...state,
      [event.target.id]: event.target.value
    });
  };

  function handleSelectPais(id, event) {
    console.log(event.target)
    setState({
      ...state,
      idPais: id
    });
    getAllEstado(id)
  }

  const columns = React.useMemo(() => [
    {
      headerName: "Acciones",
      field: "",
      renderCell: (row) => {
        return (
          <div>
            <a href="#Agregar" role="tab" data-toggle="tab" onClick={() => (handleShowModificarPais(row.row.m_nIdPais))} className="btn btn-default btn-xs"><i className="fa fa-pencil-square-o" style={{ color: "#F9A03E" }} /></a>
            <a href="#Agregar" role="tab" data-toggle="tab" className="btn btn-default btn-xs" onClick={() => (handleShowModificarPais(row.row.m_nIdPais))}><i className="fa fa-eye" style={{ color: "#F9A03E" }} /></a>
            <a href="#" className="btn btn-default btn-xs" onClick={() => (handleEliminarPais(row.row.m_nIdPais))}><i className="zmdi zmdi-delete" style={{ color: "#F30B0B" }} /></a>
          </div>
        )
      }
    },
    {
      headerName: "Código",
      field: "m_sCodigo",
      width: 100
    }, {
      headerName: "País",
      field: "m_sPais",
      width: 150
    }, {
      headerName: "Moneda",
      field: "m_nIdMoneda",
      width: 150
    }

  ]);

  const columnsEstado = React.useMemo(() => [
    {
      headerName: "Acciones",
      field: "",
      renderCell: (row) => {
        return (
          <div>
            <a href="#Agregar" role="tab" data-toggle="tab" onClick={() => (handleShowModificarEstado(row.row.m_nIdPais))} className="btn btn-default btn-xs"><i className="fa fa-pencil-square-o" style={{ color: "#F9A03E" }} /></a>
            <a href="#Agregar" role="tab" data-toggle="tab" className="btn btn-default btn-xs" onClick={() => (handleShowModificarEstado(row.row.m_nIdPais))}><i className="fa fa-eye" style={{ color: "#F9A03E" }} /></a>
            <a href="#" className="btn btn-default btn-xs" onClick={() => (handleEliminarEstado(row.row.m_nIdPais))}><i className="zmdi zmdi-delete" style={{ color: "#F30B0B" }} /></a>
          </div>
        )
      }
    },
    {
      headerName: "Código",
      field: "m_sCodigo",
      width: 100
    }, {
      headerName: "Estado",
      field: "m_sEstado",
      width: 150
    }, {
      headerName: "Abreviación",
      field: "m_sAbreviacion",
      width: 150
    }

  ]);

  useEffect(value => {
    if (localStorage.getItem("UsuarioId") === null || localStorage.getItem("UsuarioId") <= 0)
    {
      showSuccess("Es necesario iniciar sesion para acceder a este proceso");
      window.location.replace("login");
      return;
    }
    getAllData();
    getAllMoneda();
  }, []);

  function getAllData() {
    const url = `${process.env.REACT_APP_API_URL}/Pais/GetListado`;
    axios.get(url, { headers }).then(respuesta => {
      setData(respuesta.data)
      getAllEstado(respuesta.data[0].m_nIdPais)
      setState({
        ...state,
        idPais: respuesta.data[0].m_nIdPais
      });
    });
  };

  function getAllEstado(id) {
    const url = `${process.env.REACT_APP_API_URL}/Estados/ByPais/${id}`;
    axios.get(url, { headers }).then(respuesta => {
      setDataEstado(respuesta.data)
    });
  }

  function getAllMoneda() {
    const url = `${process.env.REACT_APP_API_URL}/Moneda/GetListado`;
    axios.get(url, { headers }).then((respuesta) => {
      setDataMoneda(respuesta.data);
    });
  }

  const headers = {
    'Content-Type': 'application/json',
    //    'access-control-allow-origin': '*'
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
    } = useTable(
      {
        columns,
        data,
        defaultColumn
      },
      useFilters,
      useSortBy,
    )

    return (
      <div className="col-md-12">
        <table className="table" {...getTableProps()}>
          <thead>
            {headerGroups.map(headerGroup => (
              <tr {...headerGroup.getHeaderGroupProps()}>
                <th>Acciones</th>
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
                  <tr {...row.getRowProps()}
                    onClick={handleSelectPais.bind(this, row.original.m_nIdPais)}
                    className={state.idPais === row.original.m_nIdPais ? classes.seleccionado : classes.noSeleccionado}>
                    <td>
                      <div>
                        <a href="#Agregar" role="tab" data-toggle="tab" onClick={() => (handleShowModificarPais(row.original.m_nIdPais))} className="btn btn-default btn-sm"><i className="fa fa-pencil-square-o" style={{color:"#F9A03E"}} /></a>
                        <a href="#Agregar" role="tab" data-toggle="tab" onClick={() => (handleShowModificarPais(row.original.m_nIdPais))} className="btn btn-default btn-sm"><i className="fa fa-eye" style={{color:"#F9A03E"}} /></a>
                        <a href="#" className="btn btn-default btn-sm" onClick={() => (handleEliminarPais(row.original.m_nIdPais))}><i className="zmdi zmdi-delete"  style={{color:"#F30B0B"}} /></a>
                      </div>
                    </td>
                    {row.cells.map(cell => {
                      return (
                        <td {...cell.getCellProps()} >{cell.render('Cell')}</td>
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

  function TableEstados({ columns, data }) {

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
    } = useTable(
      {
        columns,
        data,
        defaultColumn
      },
      useFilters,
      useSortBy,
    )

    return (
      <div className="col-md-12">
        <table className="table" {...getTableProps()}>
          <thead>
            {headerGroups.map(headerGroup => (
              <tr {...headerGroup.getHeaderGroupProps()}>
                <th>Acciones</th>
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
                        <a href="#AgregarEstado" role="tab" data-toggle="tab" onClick={() => (handleShowModificarEstado(row.original.m_nIdEstado))} className="btn btn-default btn-sm"><i className="fa fa-pencil-square-o"style={{color:"#F9A03E"}} /></a>
                        <a href="#AgregarEstado" role="tab" data-toggle="tab" className="btn btn-default btn-sm btn-sm" onClick={() => (handleShowModificarEstado(row.original.m_nIdEstado))}><i className="fa fa-eye" style={{color:"#F9A03E"}} /></a>
                        <a href="#" className="btn btn-default btn-sm btn-sm" onClick={() => (handleEliminarEstado(row.original.m_nIdEstado))}><i className="zmdi zmdi-delete"  style={{color:"#F30B0B"}} /></a>
                      </div>
                    </td>
                    {row.cells.map(cell => {
                      return (
                        <td {...cell.getCellProps()} >{cell.render('Cell')}</td>
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
                <h2>Países / Estados</h2>
              </div>
              <div className="col-md-6 col-sm-6">
                <ul className="list-page-breadcrumb">
                  <li>
                    <a href="/Configuracion" className="color-mapeo">
                      Configuración <i className="zmdi zmdi-chevron-right" />
                    </a>
                  </li>
                  <li className="active-page">Países / Estados</li>
                </ul>
              </div>
            </div>
          </div>

          <div className="row">
            <div className="col-md-6" >
              <ul className="nav navStatica nav-tabs">
                <li className="active">
                  <a data-toggle="tab" href="#Listado">
                    <i className="fa fa-list" /> Listado
            </a>
                </li>
                <li>
                  <a data-toggle="tab" href="#Agregar" onClick={handleShowAgregarPais}>
                    <i className="fa fa-plus-circle" /> {state.agregarPais}
                  </a>
                </li>
              </ul>

              <div className="tab-content">
                <div className="widget-wrap" id="Listado" className="tab-pane fade in active">
                  <div className="widget-wrap">
                    <div className="widget-content">
                    <div className="row" style={{ height: state.height - 250, width: '100%' }}>
                    {data.length != 0 ? (
                      <DataGrid
                        rows={data}
                        columns={columns}
                        pageSize={ Math.floor((state.height - 310)/30)}
                        getRowId={(row) => row.m_nIdPais}
                        onRowSelected={(row) => {
                          setState({
                            ...state,
                            idPais: row.data.m_nIdPais
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
                          <form className="j-forms" onSubmit={handleAceptarPais}>
                            <div className="form-content">

                              <div className="col-sm-4 col-md-4 unit">
                                <label className="label">
                                  Código
                              </label>
                                <div className="input">
                                  <input
                                    onChange={handleChange}
                                    className="form-control"
                                    type="text"
                                    required={true}
                                    value={state.codigo}
                                    id="codigo"
                                  />
                                </div>
                              </div>

                              <div className="col-sm-4 col-md-4 unit">
                                <label className="label">
                                  Moneda
                              </label>
                                <div className="input">
                                  <label className="input select">
                                    <select
                                      className="form-control"
                                      required
                                      onChange={handleChange}
                                      value={state.idMoneda}
                                      id="idMoneda"
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
                                    <i></i>
                                  </label>
                                </div>
                              </div>

                              <div className="col-sm-4 col-md-4  unit">
                                <label className="label">
                                  País
                              </label>
                                <div className="input">
                                  <input
                                    onChange={handleChange}
                                    className="form-control"
                                    type="text"
                                    required={true}
                                    value={state.pais}
                                    id="pais"
                                  />
                                </div>
                              </div>

                            </div>
                            <br></br>
                            <div className="form-footer" className="col-md-12">
                              <button href="#Listado" role="tab" data-toggle="tab" className="btn btn-secondary secondary-btn"
                              >
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

            <div className="col-md-6" >
              <ul className="nav navStatica nav-tabs">
                <li className="active">
                  <a data-toggle="tab" href="#ListadoEstado">
                    <i className="fa fa-list" /> Listado
                </a>
                </li>
                <li>
                  <a data-toggle="tab" href="#AgregarEstado" onClick={handleShowAgregarEstado}>
                    <i className="fa fa-plus-circle" /> {state.agregarEstado}
                  </a>
                </li>
              </ul>

              <div className="tab-content">
                <div className="widget-wrap" id="ListadoEstado" className="tab-pane fade in active">
                  <div className="widget-wrap">
                    <div className="widget-content">
                    <div className="row" style={{ height: state.height - 250, width: '100%' }}>
                    {dataEstado.length != 0 ? (
                      <DataGrid
                        rows={dataEstado}
                        columns={columnsEstado}
                        pageSize={ Math.floor((state.height - 310)/30)}
                        getRowId={(row) => row.m_nIdEstado}
                        onRowSelected={(row) => {
                          setState({
                            ...state,
                            idEstado: row.data.m_nIdEstado
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

                <div className="widget-wrap" id="AgregarEstado" className="tab-pane fade">
                  <div className="widget-wrap">
                    <div className="widget-content">
                      <div className="row">
                        <div className="col-md-12">
                          <form className="j-forms" onSubmit={handleAceptarEstado}>
                            <div className="form-content">

                              <div className="col-sm-4 col-md-4 unit">
                                <label className="label">
                                  Código
                                </label>
                                <div className="input">
                                  <input
                                    onChange={handleChange}
                                    className="form-control"
                                    type="text"
                                    maxLength="3"
                                    required={true}
                                    value={state.codigoEstado}
                                    id="codigoEstado"
                                  />
                                </div>
                              </div>

                              <div className="col-sm-4 col-md-4 unit">
                                <label className="label">
                                  Abreviación
                                </label>
                                <div className="input">
                                  <input
                                    onChange={handleChange}
                                    className="form-control"
                                    type="text"
                                    maxLength="5"
                                    required={true}
                                    value={state.abreviacionEstado}
                                    id="abreviacionEstado"
                                  />
                                </div>
                              </div>

                              <div className="col-sm-4 col-md-4 unit">
                                <label className="label">
                                  Estado
                                </label>
                                <div className="input">
                                  <input
                                    onChange={handleChange}
                                    className="form-control"
                                    required={true}
                                    type="text"
                                    maxLength="50"
                                    value={state.estado}
                                    id="estado"
                                  />
                                </div>
                              </div>

                            </div>
                            <br></br>
                            <div className="form-footer" className="col-md-12">
                              <button href="#Listado" role="tab" data-toggle="tab" className="btn btn-secondary secondary-btn"
                              >
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

export default PaisesEstado;
