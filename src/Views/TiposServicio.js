import React, { useEffect, useState, useMemo } from "react";
import axios from "axios";
import Cabecera from "../Components/Template/Cabecera";
import BarraLateralIzquierda from "../Components/Template/BarraLateralIzquierda";
import BarraLateralDerecha from "../Components/Template/BarraLateralDerecha";
import * as XLSX from 'xlsx';
import { useTable, useFilters, useAsyncDebounce, useSortBy } from 'react-table'

import Noty from 'noty';

function showSuccess(mensaje){
  new Noty({
    type:"information",
    layout:"topCenter",
    text: mensaje,
    timeout:"3000"
  }).show()
}
function TiposServicio() {

  const [data, setData] = React.useState([])
  const [state, setState] = React.useState({
    showPopUp: false,
    IdTipoServicio: 0,
    Descripcion: "",
    DiasHabiles: 0,
    DerechoBorrar:84,
    Costo: 0,
    Activo: 0,
    agregar: "Agregar",
    height: window.innerHeight,
    CreadoPor:localStorage.getItem("UsuarioId"),
    ModificadoPor:localStorage.getItem("UsuarioId")
  })
  const [fileUploaded, setFileUploaded] = React.useState([])


  const handleAceptar = (e) => {
    e.preventDefault()
    var params = {
      "Descripcion": state.Descripcion,
      "DiasHabiles": state.DiasHabiles,
      "Costo": state.Costo,
      "activo": state.Activo,
      "CreadoPor": state.CreadoPor,
      "ModificadoPor": state.ModificadoPor
    }
    console.log(params)
    if (state.IdTipoServicio != 0) {
      const url = `${process.env.REACT_APP_API_URL}/TipoServicio/Modificar/` + state.IdTipoServicio;
      axios.put(url, Object.assign({}, params), { headers }).then(respuesta => {
        showSuccess(respuesta.data)
        getAllData();
      }).catch(err => {
        console.log(err)
        showSuccess("err")
      });
    } else {
      const url = `${process.env.REACT_APP_API_URL}/TipoServicio/Agregar`;
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
      
    const url = `${process.env.REACT_APP_API_URL}/TipoServicio/Eliminar/` + id;
    axios.delete(url, { headers }).then(respuesta => {
      console.log(respuesta)
      getAllData();
    }).catch(err => {
      showSuccess(err)
    });
	}).catch(err => {
    showSuccess(err)
    });
  }

  function handleShowModificar(id) {
    console.log(id)
    const url = `${process.env.REACT_APP_API_URL}/TipoServicio/GetById/` + id;
    axios.get(url, { headers }).then(respuesta => {
      console.log(respuesta.data)
      setState({
        ...state,
        agregar: "Modificar",
        showPopUp: true,
        IdTipoServicio: id,
        Descripcion: respuesta.data.m_sDescripcion,
        DiasHabiles: respuesta.data.m_nDiashabiles,
        Activo: respuesta.data.m_bActivo,
        Costo: respuesta.data.m_cCosto
      })
    });
  }

  function handleShowAgregar() {
    setState({
      ...state,
      agregar: "Agregar",
      showPopUp: true,
      IdTipoServicio: 0,
      Costo: 0,
      Descripcion: "",
      DiasHabiles: 0,
      Activo: 0
    })
  }

  const handleChange = event => {
    console.log(event.target.id + " : " + event.target.value)
    setState({
      ...state,
      [event.target.id]: event.target.value
    });
  };

  const columns2 = React.useMemo(() => [
    {
      Name: "Descripción",
      accessor: "m_sDescripcion",
    }, {
      Name: "Costo",
      accessor: "m_cCosto",
    }, {
      Name: "Dias Habiles",
      accessor: "m_nDiashabiles",
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
    if (localStorage.getItem("UsuarioId") === null || localStorage.getItem("UsuarioId") <= 0)
    {
      showSuccess("Es necesario iniciar sesion para acceder a este proceso");
      window.location.replace("login");
      return;
    }
    getAllData();
  }, []);

  function getAllData() {
    const url = `${process.env.REACT_APP_API_URL}/TipoServicio/GetListado`;
    axios.get(url, { headers }).then(respuesta => {
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

  const FilterComponent = ({ filterText, onFilter, onClear }) => (
    <>
      <input
        id="search"
        type="text"
        placeholder="Filter By Name"
        aria-label="Search Input"
        value={filterText}
        onChange={handleChange} />
      <button type="button" onClick={onClear}>X</button>
    </>
  );

  const getSubHeaderComponent = () => {

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
      state,
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





        {/*AQUI MODIFICAS LO QUE NECESITES*/}

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
                        <a href="#Agregar" role="tab" data-toggle="tab" onClick={() => (handleShowModificar(row.original.m_nIdTipoServicio))} className="btn btn-default btn-sm"><i className="fa fa-pencil-square-o" style={{color:"#F9A03E"}} /></a>
                        <a href="#Agregar" role="tab" data-toggle="tab" onClick={() => (handleShowModificar(row.original.m_nIdTipoServicio))} className="btn btn-default btn-sm"><i className="fa fa-eye" style={{color:"#F9A03E"}} /></a>
                        <a href="#" className="btn btn-default btn-sm" onClick={() => (handleEliminar(row.original.m_nIdTipoServicio))}><i className="fa fa-eye" style={{color:"#F9A03E"}} /></a>
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
                <h2>Tipo de Servicio</h2>
              </div>
              <div className="col-md-6 col-sm-6">
                <ul className="list-page-breadcrumb">
                  <li>
                    <a href="/Configuracion" className="color-mapeo">
                      Catálogos <i className="zmdi zmdi-chevron-right" />
                    </a>
                  </li>
                  <li className="active-page">Tipo de Servicio</li>
                </ul>
              </div>
            </div>
          </div>

      <ul className="nav navStatica nav-tabs">
          <li className="active">
            <a data-toggle="tab" href="#Listado">
              <i className="fa fa-list"/> Listado
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
                  <div className="row">
                    <Table columns={columns2} data={data} />
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
                          {/*****************************************Descripcion************************************************************/}
                          <div className="col-sm-12 col-md-6 unit">
                            <label className="label">
                              Descripción
                          </label>
                            <div className="input">
                              <input
                                onChange={handleChange}
                                className="form-control"
                                type="text"
                                maxLength="50"
                                required
                                placeholder={state.Descripcion}
                                id="Descripcion"
                              />
                            </div>
                          </div>
                          {/*****************************************Dias Habiles************************************************************/}
                          <div className="col-sm-12 col-md-6 unit">
                            <label className="label">
                              Dias Habiles
                          </label>
                            <div className="input">
                              <input
                                onChange={handleChange}
                                className="form-control"
                                type="number"
                                min="0"
                                step="1"
                                placeholder={state.DiasHabiles}
                                id="DiasHabiles"
                              />
                            </div>
                          </div>
                          {/****************************************Activo*************************************************************/}
                          <div className="col-sm-12 col-md-6 unit">
                            <label className="label">
                              Activo
                          </label>
                            <div className="input">
                              <input
                                onChange={handleChange}
                                className="form-control"
                                type="checkbox"
                                placeholder={state.Activo}
                                id="Activo"
                              />
                            </div>
                          </div>

                          {/*****************************************Costo*******************************************************/}
                          <div className="col-sm-12 col-md-12 unit">
                            <label className="label">
                              Costo
                          </label>
                            <div className="input">
                              <input
                                onChange={handleChange}
                                className="form-control"
                                type="number"
                                min="0"
                                step="0.01"
                                required
                                placeholder={state.Costo}
                                id="Costo"
                              />
                            </div>
                          </div>


                        </div>
                        <br></br>
                        <div className="form-footer" className="col-md-12">
                          <button data-layout="topCenter" data-type="information" className="btn btn-secondary secondary-btn"
                          >
                            Cancelar</button>
                          <button onClick={handleAceptar} className="btn btn-primary primary-btn">Aceptar</button>
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
                      <form className="j-forms">
                        <div className="form-content">
                          <div className="col-sm-12 col-md-12 unit">



                          </div>
                        </div>
                        <br></br>
                        <div className="form-footer" className="col-md-12">
                          <button className="btn btn-default btn-block ex-noty" data-layout="topCenter" data-type="information">Notificación</button>
                          <button data-layout="topCenter" data-type="information" className="btn btn-secondary secondary-btn"
                          >
                            Cancelar</button>
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

export default TiposServicio;
