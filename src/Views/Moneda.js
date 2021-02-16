import React, { useEffect, useState, useMemo } from "react";
import axios from "axios";
import Cabecera from "../Components/Template/Cabecera";
import BarraLateralIzquierda from "../Components/Template/BarraLateralIzquierda";
import BarraLateralDerecha from "../Components/Template/BarraLateralDerecha";
import { useTable, useFilters, useAsyncDebounce, useSortBy } from 'react-table'

function Moneda() {

  const [data, setData] = React.useState([])
  const [state, setState] = React.useState({
    idMoneda: 0,
    codigo: "",
    moneda: "",
    simbolo: "",
    DerechoBorrar:33,
    abreviacion: "",
    CreadoPor:localStorage.getItem("UsuarioId"),
    ModificadoPor:localStorage.getItem("UsuarioId"),
    agregar: "Agregar",
    height: window.innerHeight
  })

  const handleAceptar = (e) => {
    
    e.preventDefault()
    var params = {

      "m_nIdMoneda": state.idMoneda,
      "m_sMoneda": state.moneda,
      "m_sCodigo": state.codigo,
      "m_sAbreviacion": state.abreviacion,
      "m_sSimbolo": state.simbolo,          
      "CreadoPor": state.CreadoPor,
      "ModificadoPor": state.ModificadoPor  
    }
    console.log(params)
    if (state.idMoneda != 0) {
      const url = `${process.env.REACT_APP_API_URL}/Moneda/Modificar/` + state.idMoneda;
      axios.put(url, Object.assign({}, params), { headers }).then(respuesta => {
        alert(respuesta.data)
        window.location.reload();
      }).catch(err => {
        console.log(err)
        alert("err")
      });
    } else {
      const url = `${process.env.REACT_APP_API_URL}/Moneda/Agregar`;
      axios.post(url, Object.assign({}, params), { headers }).then(respuesta => {
        alert(respuesta.data)
        window.location.reload();
      }).catch(err => {
        console.log(err)
        alert(err)
      });
    }
     
    //alert("No existe servicio todavia")

  }

  function handleEliminar(id) {
    var derecho;
    const urlDelete = `${process.env.REACT_APP_API_URL}/Utilerias/ValidaDerechos/${state.CreadoPor}/${state.DerechoBorrar}/3`;
    axios.get(urlDelete, { headers }).then(respuesta => {
      //alert(respuesta.data)

      derecho = respuesta.data;
      if (derecho == false)
      {
        alert ("El usuario no tiene derechos para realizar el proceso");
        return; 
      }
      const url = `${process.env.REACT_APP_API_URL}/Moneda/Eliminar/` + id;
    axios.delete(url, { headers }).then(respuesta => {
      alert(respuesta)
      window.location.reload();
    }).catch(err => {
      alert(err)
    });
	}).catch(err => {
      alert(err)
    });
    
  }

  function handleShowModificar(id) {
    const url = `${process.env.REACT_APP_API_URL}/Moneda/GetById/${id}`;
    axios.get(url, { headers }).then(respuesta => {
      console.log(respuesta.data)
      setState({
        ...state,
        agregar: "Modificar",
        idMoneda: id,
        codigo: respuesta.data.m_sCodigo,
        moneda: respuesta.data.m_sMoneda,
        simbolo: respuesta.data.m_sSimbolo,
        abreviacion: respuesta.data.m_sAbreviacion,
      })
    });
  }

  function handleShowAgregar() {
    setState({
      ...state,
      agregar: "Agregar",
      idMoneda: 0,
      codigo: "",
      moneda: "",
      simbolo: "",
      abreviacion: "",
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
      Name: "Código",
      accessor: "m_sCodigo",
    }, {
      Name: "Moneda",
      accessor: "m_sMoneda",
    }, {
      Name: "Símbolo",
      accessor: "m_sSimbolo",
    }, {
      Name: "Abreviación",
      accessor: "m_sAbreviacion",
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
      alert("Es necesario iniciar sesion para acceder a este proceso");
      window.location.replace("login");
      return;
    }
    getAllData();
  }, []);

  function getAllData() {
    const url = `${process.env.REACT_APP_API_URL}/Moneda/GetListado`;
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
                  <tr {...row.getRowProps()}>
                    <td>
                      <div>
                        <a href="#Agregar" role="tab" data-toggle="tab" onClick={() => (handleShowModificar(row.original.m_nIdMoneda))} className="btn btn-default btn-sm"><i className="fa fa-pencil-square-o"style={{color:"#F9A03E"}} /></a>
                        <a href="#" className="btn btn-default btn-sm" onClick={() => (handleEliminar(row.original.m_nIdMoneda))}><i className="zmdi zmdi-delete"  style={{color:"#F30B0B"}} /></a>
                        <a href="#" className="btn btn-default btn-sm" onClick={() => (handleEliminar(row.original.m_nIdMoneda))}><i className="fa fa-eye" style={{color:"#F9A03E"}} /></a>
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

  const ruta = [
    {
      actual: false,
      nombre: "Configuración",
      ruta: "/Configuracion"
    },
    {
      actual: true,
      nombre: "Moneda",
      ruta: "/Moneda"
    },
  ];

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
                <h2>Moneda</h2>
              </div>
              <div className="col-md-6 col-sm-6">
                <ul className="list-page-breadcrumb">
                  <li>
                    <a href="/Configuracion" className="color-mapeo">
                      Configuración <i className="zmdi zmdi-chevron-right" />
                    </a>
                  </li>
                  <li className="active-page">Moneda</li>
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

                          <div className="col-sm-12 col-md-8 unit">
                            <label className="label">
                              Código
                          </label>
                            <div className="input">
                              <input
                                onChange={handleChange}
                                className="form-control"
                                type="text"
                                maxLength="10"
                                required={true}
                                value={state.codigo}
                                id="codigo"
                              />
                            </div>
                          </div>

                          <div className="col-sm-12 col-md-4 unit">
                            <label className="label">
                              Moneda
                          </label>
                            <div className="input">
                              <input
                                onChange={handleChange}
                                className="form-control"
                                type="text"
                                required={true}
                                value={state.moneda}
                                id="moneda"
                              />
                            </div>
                          </div>

                          <div className="col-sm-12 col-md-8 unit">
                            <label className="label">
                              Símbolo
                            </label>
                            <div className="input">
                              <input
                                onChange={handleChange}
                                className="form-control"
                                type="text"
                                maxLength="3"
                                required={true}
                                value={state.simbolo}
                                id="simbolo"
                              />
                            </div>
                          </div>

                          <div className="col-sm-12 col-md-4 unit">
                            <label className="label">
                              Abreviación
                          </label>
                            <div className="input">
                              <input
                                onChange={handleChange}
                                className="form-control"
                                required={true}
                                type="text"
                                maxLength="3"
                                value={state.abreviacion}
                                id="abreviacion"
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

export default Moneda;
