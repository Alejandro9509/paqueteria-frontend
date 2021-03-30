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
import { useTable, useFilters,useAsyncDebounce, useSortBy } from 'react-table'
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

function GrupoCliente() {

  const classes = useStyles();
  const [data, setData] = React.useState([])
  const [state, setState] = React.useState({
    showPopUp: false,
    idGrupoCliente: 0,
    DerechoBorrar:40,
    codigoGrupo: 0,
    grupoCliente: "",
    agregar: "Agregar",
    height: window.innerHeight,
    CreadoPor:localStorage.getItem("UsuarioId"),
    ModificadoPor:localStorage.getItem("UsuarioId")

  })
  const [fileUploaded, setFileUploaded] = React.useState([])


  const handleAceptar = (e) => {
    e.preventDefault()
    var params = {

      "Codigo": state.codigoGrupo,
      "Grupo": state.grupoCliente,         
      "CreadoPor": state.CreadoPor,
      "ModificadoPor": state.ModificadoPor    
    }
    console.log(params)
    if (state.idGrupoCliente != 0) {
      const url = `${process.env.REACT_APP_API_URL}/GruposClientes/Modificar/` + state.idGrupoCliente;
      axios.put(url, Object.assign({}, params), { headers }).then(respuesta => {
        showSuccess(respuesta.data)
        getAllData();
      }).catch(err => {
        console.log(err)
        showSuccess("err")
      });
    } else {
      const url = `${process.env.REACT_APP_API_URL}/GruposClientes/Agregar`;
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
      
    const url = `${process.env.REACT_APP_API_URL}/GruposClientes/Eliminar/` + id;
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
    console.log(id)
    const url = `${process.env.REACT_APP_API_URL}/GruposClientes/GetById/` + id;
    axios.get(url, { headers }).then(respuesta => {
      console.log(respuesta.data)
      setState({
        ...state,
        agregar: "Modificar",
        showPopUp: true,
        idGrupoCliente: id,
        codigoGrupo: respuesta.data.m_sCodigo,
        grupoCliente: respuesta.data.m_sGrupo
      })
    });
  }

  function handleShowConsultar(id) {
    console.log(id)
    const url = `${process.env.REACT_APP_API_URL}/GruposClientes/GetById/` + id;
    axios.get(url, { headers }).then(respuesta => {
      console.log(respuesta.data)
      setState({
        ...state,
        agregar: "Consultar",
        showPopUp: true,
        idGrupoCliente: id,
        codigoGrupo: respuesta.data.m_sCodigo,
        grupoCliente: respuesta.data.m_sGrupo
      })
    });
  }

  function handleShowAgregar() {
    setState({
      ...state,
      agregar: "Agregar",
      showPopUp: true,
      idGrupoCliente: 0,
      codigoGrupo: 0,
      grupoCliente: ""
    })
  }

  const handleChange = event => {
    console.log(event.target.id + " : " + event.target.value)
    setState({
      ...state,
      [event.target.id]: event.target.value
    });
  };

  function handleSelectRow(id, event) {
    setState({
      ...state,
      idGrupoCliente: id
    });
  }

  const columns = React.useMemo(() => [
    {
      headerName: "Acciones",
      field: "",
      renderCell: (row) => {
        return (
          <div>
            <a href="#Agregar" role="tab" data-toggle="tab" onClick={() => (handleShowModificar(row.row.m_nIdGrupoCliente))} className="btn btn-default btn-xs"><i className="fa fa-pencil-square-o" style={{ color: "#F9A03E" }} /></a>
            <a href="#Agregar" role="tab" data-toggle="tab" className="btn btn-default btn-xs" onClick={() => (handleShowConsultar(row.row.m_nIdGrupoCliente))}><i className="fa fa-eye" style={{ color: "#F9A03E" }} /></a>
            <a href="#" className="btn btn-default btn-xs" onClick={() => (handleEliminar(row.row.m_nIdGrupoCliente))}><i className="zmdi zmdi-delete" style={{ color: "#F30B0B" }} /></a>
          </div>
        )
      }
    },
    {
      headerName: "Código",
      field: "m_nCodigo",
      width: 100,
    }, {
      headerName: "Grupo",
      field: "m_sGrupo",
      width: 200,
    }, {
      headerName: "Creado El",
      field: "m_dtCreadoEl",
      width: 200,
    }, {
      headerName: "Creado Por",
      field: "m_nCreadoPor",
      width: 150,
    }, {
      headerName: "Modificado El",
      field: "m_dtModificadoEl",
      width: 200,
    }, {
      headerName: "Modificado Por",
      field: "m_nModificadoPor",
      width: 150,
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
    
    const url = `${process.env.REACT_APP_API_URL}/GruposClientes/GetListado`;
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
                  onClick={handleSelectRow.bind(this, row.original.m_nIdGrupoCliente)}
                  className={state.idGrupoCliente === row.original.m_nIdGrupoCliente ? classes.seleccionado : classes.noSeleccionado}>

                    <td>
                      <div>
                        <a href="#Agregar" role="tab" data-toggle="tab" onClick={() => (handleShowModificar(row.original.m_nIdGrupoCliente))} className="btn btn-default btn-sm"><i className="fa fa-pencil-square-o" style={{color:"#F9A03E"}} /></a>
                        <a href="#Agregar" role="tab" data-toggle="tab" onClick={() => (handleShowConsultar(row.original.m_nIdGrupoCliente))} className="btn btn-default btn-sm"><i className="fa fa-eye" style={{color:"#F9A03E"}} /></a>
                        <a href="#" className="btn btn-default btn-sm" onClick={() => (handleEliminar(row.original.m_nIdGrupoCliente))}><i className="zmdi zmdi-delete"  style={{color:"#F30B0B"}} /></a>
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
                <h2>Grupo de Clientes</h2>
              </div>
              <div className="col-md-6 col-sm-6">
                <ul className="list-page-breadcrumb">
                  <li>
                    <a href="/Catalogos" className="color-mapeo">
                      Catálogos <i className="zmdi zmdi-chevron-right" />
                    </a>
                  </li>
                  <li className="active-page">Grupo Clientes</li>
                </ul>
              </div>
            </div>
          </div>

          <ul className="nav navStatica nav-tabs">
            <li className={(state.agregar != "Modificar" && state.agregar != "Consultar" ) ? "active": ""} aria-expanded={(state.agregar != "Modificar" && state.agregar != "Consultar" ) ? "true": "false"} >
              <a data-toggle="tab" href="#Listado" onClick={() => setState({...state, agregar: "Agregar", showPopUp:false})}>
                <i className="fa fa-list" /> Listado
            </a>
            </li>
            <li className={(state.agregar == "Modificar" || state.agregar == "Consultar")  ? "active": ""} aria-expanded={(state.agregar == "Modificar" || state.agregar == "Consultar")  ? "true": "false"}>
              <a data-toggle="tab" href="#Agregar" onClick={handleShowAgregar}>
                <i className="fa fa-plus-circle" /> {state.agregar}
              </a>
            </li>

            <li>
              <ExportCSV csvData={data} fileName="GrupoCliente_Listado" />
            </li>
            <li>
              <ExportPDF data={data} column={columns} fileName="GrupoCliente" />
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
                        pageSize={10}
                        getRowId={(row) => row.m_nIdGrupoCliente}
                        onRowSelected={(row) => {
                          setState({
                            ...state,
                            idGrupoCliente: row.data.m_nIdGrupoCliente
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

                        <div className="col-xs-6 col-sm-3 col-md-2-5 col-lg-2-5 unit">
                            <label className="label">
                              Código
                          </label>
                            <div className="input">
                              <input
                                onChange={handleChange}
                                className="form-control"
                                type="number"
                                min="0"
                                max="999"
                                step="1"
                                required
                                value={state.codigoGrupo}
                                readOnly={state.agregar == "Consultar"}
                                id="codigoGrupo"
                              />
                            </div>
                          </div>

                          <div className="col-xs-6 col-sm-3 col-md-2-5 col-lg-2-5 unit">
                            <label className="label">
                              Descripción
                          </label>
                            <div className="input">
                              <input
                                onChange={handleChange}
                                className="form-control"
                                type="text"
                                required
                                maxLength="50"
                                value={state.grupoCliente}
                                readOnly={state.agregar == "Consultar"}
                                id="grupoCliente"
                              />
                            </div>
                          </div>

                          </div>
                          <div className="row">
                          <div className="form-footer" className="col-sm-6 col-md-5 unit">
                          <button data-layout="topCenter" data-type="information" className="btn btn-secondary secondary-btn"> Cancelar </button>
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

export default GrupoCliente;
