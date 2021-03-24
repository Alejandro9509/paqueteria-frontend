import React, { useEffect, useState, useMemo } from "react";
import axios from "axios";
import Cabecera from "../Components/Template/Cabecera";
import BarraLateralIzquierda from "../Components/Template/BarraLateralIzquierda";
import BarraLateralDerecha from "../Components/Template/BarraLateralDerecha";
import * as XLSX from 'xlsx';
import { useTable, useFilters, useAsyncDebounce, useSortBy } from 'react-table'
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

function Embalaje() {

  const classes = useStyles();
  const [data, setData] = React.useState([])
  const [state, setState] = React.useState({
    showPopUp: false,
    IdEmbalaje: 0,
    CodigoEmbalaje: 0,
    NombreEmbalaje: "",
    DerechoBorrar:87,
    DescripcionEmbalaje: "",
    agregar: "Agregar",
    height: window.innerHeight,
    CreadoPor:localStorage.getItem("UsuarioId"),
    ModificadoPor: localStorage.getItem("UsuarioId")
  })
  const [fileUploaded, setFileUploaded] = React.useState([])


  const handleAceptar = (e) => {
    e.preventDefault()
    var params = {
      "IdEmbalaje": state.IdEmbalaje,
      "Codigo": state.CodigoEmbalaje,
      "Nombre": state.NombreEmbalaje,
      "Descripcion": state.DescripcionEmbalaje,
      
      "CreadoPor": state.CreadoPor,
      "ModificadoPor": state.ModificadoPor  
    }
    console.log(params)
    if (state.IdEmbalaje != 0) {
      const url = `${process.env.REACT_APP_API_URL}/Embalaje/Modificar/` + state.IdEmbalaje;
      axios.put(url, Object.assign({}, params), { headers }).then(respuesta => {
        showSuccess(respuesta.data)
        getAllData()
      }).catch(err => {
        console.log(err)
        showSuccess("err")
      });
    } else {
      const url = `${process.env.REACT_APP_API_URL}/Embalaje/Agregar`;
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
      if (derecho == false)
      {
        showSuccess ("El usuario no tiene derechos para realizar el proceso");
        return; 
      }
      
    const url = `${process.env.REACT_APP_API_URL}/Embalaje/Eliminar/` + id;
    axios.delete(url, { headers }).then(respuesta => {
      console.log(respuesta)
      getAllData()
    }).catch(err => {
      showSuccess(err)
    });
	}).catch(err => {
    showSuccess(err)
    });
  }

  function handleShowModificar(id) {
    console.log(id)
    const url = `${process.env.REACT_APP_API_URL}/Embalaje/GetById/` + id;
    axios.get(url, { headers }).then(respuesta => {
      console.log(respuesta.data)
      setState({
        ...state,
        agregar: "Modificar",
        IdEmbalaje: id,
        CodigoEmbalaje: respuesta.data.m_sCodigo,
        NombreEmbalaje: respuesta.data.m_sNombre,
        DescripcionEmbalaje: respuesta.data.m_sDescripcion
      })
    });
  }

  function handleShowConsultar(id) {
    const url = `${process.env.REACT_APP_API_URL}/Embalaje/GetById/` + id;
    axios.get(url, { headers }).then(respuesta => {
      console.log(respuesta.data)
      setState({
        ...state,
        agregar: "Consultar",
        IdEmbalaje: id,
        CodigoEmbalaje: respuesta.data.m_sCodigo,
        NombreEmbalaje: respuesta.data.m_sNombre,
        DescripcionEmbalaje: respuesta.data.m_sDescripcion
      })
    });
  }

  function handleShowAgregar() {
    setState({
      ...state,
      agregar: "Agregar",
      showPopUp: true,
      IdEmbalaje: 0,
      NombreEmbalaje: "",
      CodigoEmbalaje: 0,
      DescripcionEmbalaje: ""
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
      IdEmbalaje: id
    });
  }

  const columns = React.useMemo(() => [
    {
      headerName: "Acciones",
      field: "",
      renderCell: (row) => {
        return (
          <div>
            <a href="#Agregar" role="tab" data-toggle="tab" onClick={() => (handleShowModificar(row.row.m_nIdEmbalaje))} className="btn btn-default btn-xs"><i className="fa fa-pencil-square-o" style={{ color: "#F9A03E" }} /></a>
            <a href="#Agregar" role="tab" data-toggle="tab" className="btn btn-default btn-xs" onClick={() => (handleShowConsultar(row.row.m_nIdEmbalaje))}><i className="fa fa-eye" style={{ color: "#F9A03E" }} /></a>
            <a href="#" className="btn btn-default btn-xs" onClick={() => (handleEliminar(row.row.m_nIdEmbalaje))}><i className="zmdi zmdi-delete" style={{ color: "#F30B0B" }} /></a>
          </div>
        )
      }
    },
    {
      headerName: "Código",
      field: "m_sCodigo",
      width: 100,
    }, {
      headerName: "Nombre",
      field: "m_sNombre",
      width: 150,
    }, {
      headerName: "Descripción",
      field: "m_sDescripcion",
      width: 300,
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
    const url = `${process.env.REACT_APP_API_URL}/Embalajes/GetListado`;
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
        value="Filter By Name"
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
                  <tr {...row.getRowProps()}
                  onClick={handleSelectRow.bind(this, row.original.m_nIdEmbalaje)}
                  className={state.IdEmbalaje === row.original.m_nIdEmbalaje ? classes.seleccionado : classes.noSeleccionado}>

                    <td>
                      <div>
                        <a href="#Agregar" role="tab" data-toggle="tab" onClick={() => (handleShowModificar(row.original.m_nIdEmbalaje))} className="btn btn-default  btn-sm"><i className="fa fa-pencil-square-o"style={{color:"#F9A03E"}} /></a>
                        <a href="#Agregar" role="tab" data-toggle="tab" className="btn btn-default btn-sm" onClick={() => (handleShowConsultar(row.original.m_nIdEmbalaje))}><i className="fa fa-eye" style={{color:"#F9A03E"}} /></a>
                        <a href="#" className="btn btn-default btn-sm" onClick={() => (handleEliminar(row.original.m_nIdEmbalaje))}><i className="zmdi zmdi-delete"  style={{color:"#F30B0B"}} /></a>
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
                <h2>Embalajes</h2>
              </div>
              <div className="col-md-6 col-sm-6">
                <ul className="list-page-breadcrumb">
                  <li>
                    <a href="/Catalogos" className="color-mapeo">
                      Catálogos <i className="zmdi zmdi-chevron-right" />
                    </a>
                  </li>
                  <li className="active-page">Embalajes</li>
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
                        getRowId={(row) => row.m_nIdEmbalaje}
                        onRowSelected={(row) => {
                          setState({
                            ...state,
                            IdEmbalaje: row.data.m_nIdEmbalaje
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
                          {/*****************************************Codigo************************************************************/}
                          <div className="col-xs-4 col-sm-3 col-md-2-5 col-lg-2-5 unit">
                            <label className="label">
                              Código
                          </label>
                            <div className="input">
                              <input
                                onChange={handleChange}
                                className="form-control"
                                type="text"
                                maxlength="10"
                                required
                                value={state.CodigoEmbalaje}
                                readOnly={state.agregar == "Consultar"}
                                id="CodigoEmbalaje"
                              />
                            </div>
                          </div>
                          {/*****************************************Nombre************************************************************/}
                          <div className="col-xs-4 col-sm-3 col-md-2-5 col-lg-2-5 unit">
                            <label className="label">
                              Nombre
                          </label>
                            <div className="input">
                              <input
                                onChange={handleChange}
                                className="form-control"
                                type="text"
                                required
                                value={state.NombreEmbalaje}
                                readOnly={state.agregar == "Consultar"}
                                id="NombreEmbalaje"
                              />
                            </div>
                          </div>
                          {/*****************************************Descripción*******************************************************/}
                          <div className="col-xs-4 col-sm-3 col-md-2-5 col-lg-2-5 unit">
                            <label className="label">
                              Descripción
                          </label>
                            <div className="input">
                              <input
                                onChange={handleChange}
                                className="form-control"
                                type="text"
                                required
                                value={state.DescripcionEmbalaje}
                                readOnly={state.agregar == "Consultar"}
                                id="DescripcionEmbalaje"
                              />
                            </div>
                          </div>


                        </div>
                        <br></br>
                        <div className="form-footer" className="col-12 col-sm-9 col-md-7 unit">
                          <button data-layout="topCenter" data-type="information" className="btn btn-secondary secondary-btn"> Cancelar</button>
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
                      <form className="j-forms">
                        <div className="form-content">
                          <div className="col-sm-12 col-md-12 unit">



                          </div>
                        </div>
                        <br></br>
                        <div className="col-xs-6 col-sm-3 col-md-2 col-lg-2-5 unit">
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

export default Embalaje;
