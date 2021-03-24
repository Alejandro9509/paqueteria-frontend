import React, { useEffect, useState, useMemo } from "react";
import axios from "axios";
import Cabecera from "../Components/Template/Cabecera";
import BarraLateralIzquierda from "../Components/Template/BarraLateralIzquierda";
import BarraLateralDerecha from "../Components/Template/BarraLateralDerecha";
import { useTable, useFilters, useSortBy } from 'react-table'
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

function TipoCambio() {

  const classes = useStyles();
  const [data, setData] = React.useState([])

  const [state, setState] = React.useState({
    idTipoCambio: 0,
    fecha: "",
    tipoCambio: "",
    DerechoBorrar:29,
    agregar: "Agregar",
    height: window.innerHeight
  })

  const handleAceptar = (e) => {
    e.preventDefault()
    var params = {

      "m_nIdTipoCambio": state.idTipoCambio,
      "m_dtFecha": state.fecha,
      "m_cTipoCambio": state.tipoCambio,
      "CreadoPor": state.CreadoPor,
      "ModificadoPor": state.ModificadoPor
    }
    console.log(params)
    if (state.idTipoCambio != 0) {
      const url = `${process.env.REACT_APP_API_URL}/TipoCambio/Modificar/` + state.idTipoCambio;
      axios.put(url, Object.assign({}, params), { headers }).then(respuesta => {
        showSuccess(respuesta.data)
        getAllData();
      }).catch(err => {
        console.log(err)
        showSuccess("err")
      });
    } else {
      const url = `${process.env.REACT_APP_API_URL}/TipoCambio/Agregar`;
      axios.post(url, Object.assign({}, params), { headers }).then(respuesta => {
        showSuccess(respuesta.data)
        getAllData();
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
      if (derecho == false)
      {
        showSuccess ("El usuario no tiene derechos para realizar el proceso");
        return; 
      }
      const url = `${process.env.REACT_APP_API_URL}/TipoCambio/Eliminar/` + id;
    axios.delete(url, { headers }).then(respuesta => {
      showSuccess(respuesta)
      getAllData();
    }).catch(err => {
      showSuccess(err)
    });
	}).catch(err => {
    showSuccess(err)
    });
    
  }

  function handleShowModificar(id) {
    const url = `${process.env.REACT_APP_API_URL}/TipoCambio/GetById/${id}`;
    axios.get(url, { headers }).then(respuesta => {
      console.log(respuesta.data)
      setState({
        ...state,
        agregar: "Modificar",
        showPopUp: true,
        idTipoCambio: id,
        fecha: respuesta.data.m_dtFecha.split("T")[0],
        tipoCambio: respuesta.data.m_cTipoCambio,
      })
    });
  }

  function handleShowAgregar() {
    setState({
      ...state,
      idTipoCambio: 0,
      fecha: "",
      tipoCambio: "",
      agregar: "Agregar",
    })
  }

  const handleChange = event => {
    console.log(event.target.value)
    setState({
      ...state,
      [event.target.id]: event.target.value
    });
  };

  function handleSelectRow(id, event) {
    setState({
      ...state,
      idTipoCambio: id
    });
  }

  const columns = React.useMemo(() => [
    {
      headerName: "Acciones",
      field: "",
      renderCell: (row) => {
        return (
          <div>
            <a href="#Agregar" role="tab" data-toggle="tab" onClick={() => (handleShowModificar(row.row.m_nIdTipoCambio))} className="btn btn-default btn-xs"><i className="fa fa-pencil-square-o" style={{ color: "#F9A03E" }} /></a>
            <a href="#Agregar" role="tab" data-toggle="tab" className="btn btn-default btn-xs" onClick={() => (handleShowModificar(row.row.m_nIdTipoCambio))}><i className="fa fa-eye" style={{ color: "#F9A03E" }} /></a>
            <a href="#" className="btn btn-default btn-xs" onClick={() => (handleEliminar(row.row.m_nIdTipoCambio))}><i className="zmdi zmdi-delete" style={{ color: "#F30B0B" }} /></a>
          </div>
        )
      }
    },
    {
      headerName: "Fecha",
      field: "m_dtFecha",
      width: 300
    }, {
      headerName: "Tipo de Cambio",
      field: "m_cTipoCambio",
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
  }, []);

  function getAllData() {
    const url = `${process.env.REACT_APP_API_URL}/TipoCambio/GetListado`;
    axios.get(url, { headers }).then(respuesta => {
      setData(respuesta.data)
    });
  };

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
      useSortBy
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
                  onClick={handleSelectRow.bind(this, row.original.m_nIdTipoCambio)}
                  className={state.idTipoCambio === row.original.m_nIdTipoCambio ? classes.seleccionado : classes.noSeleccionado}>
                    <td>
                      <div>
                        <a href="#Agregar" role="tab" data-toggle="tab" onClick={() => (handleShowModificar(row.original.m_nIdTipoCambio))} className="btn btn-default btn-sm"><i className="fa fa-pencil-square-o"style={{color:"#F9A03E"}} /></a>
                        <a href="#Agregar" role="tab" data-toggle="tab" onClick={() => (handleShowModificar(row.original.m_nIdTipoCambio))} className="btn btn-default btn-sm"><i className="fa fa-eye" style={{color:"#F9A03E"}} /></a>
                        <a href="#" className="btn btn-default btn-sm" onClick={() => (handleEliminar(row.original.m_nIdTipoCambio))}><i className="zmdi zmdi-delete"  style={{color:"#F30B0B"}} /></a>
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
                <h2>Tipo de Cambio</h2>
              </div>
              <div className="col-md-6 col-sm-6">
                <ul className="list-page-breadcrumb">
                  <li>
                    <a href="/Configuracion" className="color-mapeo">
                      Configuración <i className="zmdi zmdi-chevron-right" />
                    </a>
                  </li>
                  <li className="active-page">Tipo de Cambio</li>
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
                <div className="row wrapper-tabla" style={{ height: state.height - 200, width: '100%' }}>
                    {data.length != 0 ? (
                      <DataGrid
                        rows={data}
                        columns={columns}
                        pageSize={10}
                        getRowId={(row) => row.m_nIdTipoCambio}
                        onRowSelected={(row) => {
                          setState({
                            ...state,
                            idTipoCambio: row.data.m_nIdTipoCambio
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

                          <div className="col-sm-12 col-md-12 unit">
                            <label className="label">
                              Fecha
                          </label>
                            <div className="input">
                              <input
                                onChange={handleChange}
                                className="form-control"
                                type="date"
                                required={true}
                                value={state.fecha}
                                id="fecha"
                              />
                            </div>
                          </div>

                          <div className="col-sm-12 col-md-12 unit">
                            <label className="label">
                              Tipo de Cambio
                          </label>
                            <div className="input">
                              <input
                                onChange={handleChange}
                                className="form-control"
                                type="number"
                                min="0"
                                step="0.01"
                                required={true}
                                value={state.tipoCambio}
                                id="tipoCambio"
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

      </section>
      {/*Page Container End Here*/}

      {/*Rightbar Start Here*/}
      <aside className="rightbar">
        <BarraLateralDerecha />
      </aside>

    </div>

  );
}

export default TipoCambio;
