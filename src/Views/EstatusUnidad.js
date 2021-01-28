import React, { useEffect, useState, useMemo } from "react";
import axios from "axios";
import Cabecera from "../Components/Template/Cabecera";
import BarraLateralIzquierda from "../Components/Template/BarraLateralIzquierda";
import BarraLateralDerecha from "../Components/Template/BarraLateralDerecha";
import ExportCSV from '../Components/Template/Export';
import ExportPDF from "../Components/Template/ExportPDF";
import { useTable, useFilters, useGlobalFilter, useAsyncDebounce, useSortBy } from 'react-table'

function EstatusUnidad() {

  const [data, setData] = React.useState([])
  const dataEstatus = [{
    idEstatus: 1,
    tipoEstatus: "Disponible"
  }, {
    idEstatus: 2,
    tipoEstatus: "No Disponible"
  }];

  const [state, setState] = React.useState({
    idEstatusUnidad: 0,
    estatusUnidad: "",
    abreviacionUnidad: "",
    tipoEstatusUnidad: 0,
    colorUnidad: "",
    agregar: "Agregar",
    importar: "",
    height: window.innerHeight
  })

  const handleAceptar = (e) => {
    e.preventDefault()
    var params = {

      "Estatus": state.estatusUnidad,
      "Color": state.colorUnidad.slice(-6),
      "ColorLetra": state.colorUnidad.slice(-6),
      "Abreviacion": state.abreviacionUnidad,
      "TipoEstatus": state.tipoEstatusUnidad,
      "CreadoPor": 1,
      "ModificadoPor": 1
    }
    console.log(params)
    if (state.idEstatusUnidad != 0) {
      const url = `${process.env.REACT_APP_API_URL}/EstatusUnidades/Modificar/` + state.idEstatusUnidad;
      axios.put(url, Object.assign({}, params), { headers }).then(respuesta => {
        alert(respuesta.data)
        getAllData();
      }).catch(err => {
        console.log(err)
        alert("err")
      });
    } else {
      const url = `${process.env.REACT_APP_API_URL}/EstatusUnidades/Agregar`;
      axios.post(url, Object.assign({}, params), { headers }).then(respuesta => {
        alert(respuesta.data)
        getAllData()
      }).catch(err => {
        console.log(err)
        alert(err)
      });
    }

  }

  function handleEliminar(id) {
    const url = `${process.env.REACT_APP_API_URL}/EstatusUnidades/Eliminar/` + id;
    axios.delete(url, { headers }).then(respuesta => {
      alert(respuesta)
      getAllData()
    }).catch(err => {
      alert(err)
    });
  }

  function handleShowModificar(id) {
    const url = `${process.env.REACT_APP_API_URL}/EstatusUnidades/GetById/${id}`;
    axios.get(url, { headers }).then(respuesta => {
      console.log(respuesta.data)
      setState({
        ...state,
        agregar: "Modificar",
        showPopUp: true,
        idEstatusUnidad: id,
        estatusUnidad: respuesta.data.m_sEstatus,
        abreviacionUnidad: respuesta.data.m_sAbreviacion,
        tipoEstatusUnidad: respuesta.data.m_nTipoEstatus,
        colorUnidad: "#" + respuesta.data.m_sColor,
      })
    });
  }

  function handleShowAgregar() {
    setState({
      ...state,
      agregar: "Agregar",
      idEstatusUnidad: 0,
      estatusUnidad: "",
      abreviacionUnidad: "",
      tipoEstatusUnidad: 1,
      colorUnidad: "#000000",
    })
  }

  const handleChange = event => {
    console.log(event.target.value)
    setState({
      ...state,
      [event.target.id]: event.target.value
    });
  };

  const columns = React.useMemo(() => [
    {
      Name: "Abreviación",
      accessor: "m_sAbreviacion",
    }, {
      Name: "Estatus",
      accessor: "m_sEstatus",
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
  }, []);

  function getAllData() {
    const url = `${process.env.REACT_APP_API_URL}/EstatusUnidades/GetListado`;
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
                        <a href="#Agregar" role="tab" data-toggle="tab" onClick={() => (handleShowModificar(row.original.m_nIdEstatusUnidad))} className="btn btn-default btn-sm m-user-edit"><i className="zmdi zmdi-edit" /></a>
                        <a href="#" className="btn btn-default btn-sm m-user-delete" onClick={() => (handleEliminar(row.original.m_nIdEstatusUnidad))}><i className="zmdi zmdi-close" /></a>
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
      <aside className="iconic-leftbar" style={{minHeight: state.height}}>
        <BarraLateralIzquierda />
      </aside>
      {/*Leftbar End Here*/}

      {/*Page Container Start Here*/}
      <section className="main-container">

        <div className="container-fluid">
          <div className="page-header filled full-block light">
            <div className="row">
              <div className="col-md-6 col-sm-6">
                <h2>Estatus Unidad</h2>
              </div>
              <div className="col-md-6 col-sm-6">
                <ul className="list-page-breadcrumb">
                  <li>
                    <a href="/Catalogos">
                      Catálogos <i className="zmdi zmdi-chevron-right" />
                    </a>
                  </li>
                  <li className="active-page">Estatus Unidad</li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        <div className="container-fluid">

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
            <div className="widget-wrap" id="Listado" className="tab-pane fade in active">
              <div className="widget-wrap">
                <div className="widget-content">
                  <div className="row">
                    <Table columns={columns} data={data} />
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

                        <div className="col-xs-6 col-sm-3 col-md-2-5 col-lg-2-5 unit">
                            <label className="label">
                              Estatus
                          </label>
                            <div className="input">
                              <input
                                onChange={handleChange}
                                className="form-control"
                                type="text"
                                maxLength="30"
                                required={true}
                                value={state.estatusUnidad}
                                id="estatusUnidad"
                              />
                            </div>
                          </div>

                          <div className="col-xs-6 col-sm-3 col-md-2-5 col-lg-2-5 unit">
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
                                value={state.abreviacionUnidad}
                                id="abreviacionUnidad"
                              />
                            </div>
                          </div>

                          <div className="col-xs-6 col-sm-3 col-md-2-5 col-lg-2-5 unit">
                            <label className="label">
                              Tipo Estatus
                            </label>
                            <label className="input select">
                              <select
                                className="form-control"
                                required
                                onChange={handleChange}
                                value={state.tipoEstatusUnidad}
                                id="tipoEstatusUnidad"
                              >
                                {dataEstatus.map(
                                  (estatus) => (
                                    <option key={estatus.idEstatus} value={estatus.idEstatus}>
                                      {
                                        estatus.tipoEstatus
                                      }
                                    </option>
                                  )
                                )}
                              </select>
                              <i className="fa fa-arrow-down" />
                            </label>
                          </div>

                          <div className="col-xs-6 col-sm-3 col-md-3 col-lg-2-5 unit">
                            <label className="label">
                              Color
                          </label>
                            <div className="input">
                              <input
                                onChange={handleChange}
                                className="form-control"
                                required={true}
                                type="color"
                                value={state.colorUnidad}
                                id="colorUnidad"
                              />
                            </div>
                          </div>

                        </div>
                        <br></br>
                        <div className="form-footer" className="col-12 col-sm-12 col-md-10 unit">
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

            <div className="widget-wrap" id="Importar" className="tab-pane fade">
              <div className="widget-wrap">
                <div className="widget-content">
                  <div className="row">
                    <div className="col-md-12">
                      <div className="form-footer" className="col-md-12">
                        <button className="btn btn-default btn-block ex-noty" data-layout="topCenter" data-type="information">Notificación</button>
                        <button data-layout="topCenter" data-type="information" className="btn btn-secondary secondary-btn"
                                    >
                                      Cancelar</button>
                        <button onClick={handleAceptar} className="btn btn-primary primary-btn">Aceptar</button>
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

export default EstatusUnidad;
