import React, { useEffect, useState, useMemo } from "react";
import axios from "axios";
import Cabecera from "../Components/Template/Cabecera";
import BarraLateralIzquierda from "../Components/Template/BarraLateralIzquierda";
import BarraLateralDerecha from "../Components/Template/BarraLateralDerecha";
import { useTable, useFilters, useGlobalFilter, useRowSelect, useSortBy } from 'react-table'
import { makeStyles } from "@material-ui/core/styles";

const styles = {
  seleccionado: {
    backgroundColor: "#688ad9",
  },
  noSeleccionado: {
    backgroundColor: "#FFFFFF",
  }
};
const useStyles = makeStyles(styles);

function CiudadesCodigoPostal() {

  const classes = useStyles();
  const [data, setData] = React.useState([])
  const [dataCodigoPostal, setDataCodigoPostal] = React.useState([])
  const [dataPais, setDataPais] = React.useState([])
  const [dataEstado, setDataEstado] = React.useState([])
  const [state, setState] = React.useState({
    idCiudad: 0,
    codigoCiudad: "",
    ciudad: "",
    abreviacionCiudad: "",
    idEstado: 0,
    idPais: 0,

    idCodigoPostal: 0,
    codigoPostal: "",
    zona: "",

    agregarCiudad: "Agregar",
    agregarCodigoPostal: "Agregar",
  })

  const handleAceptarCiudad = (e) => {
    e.preventDefault()
    var params = {

      "m_nCodigo": state.codigoCiudad,
      "m_sCiudad": state.ciudad,
      "m_sAbreviacion": state.abreviacionCiudad,
      "m_nIdEstado": state.idEstado,
      "CreadoPor": 1,
      "ModificadoPor": 1,

    }
    console.log(params)
    if (state.idCiudad != 0) {
      const url = `${process.env.REACT_APP_API_URL}/Ciudades/Modificar/` + state.idCiudad;
      axios.put(url, Object.assign({}, params), { headers }).then(respuesta => {
        alert(respuesta.data)
        getAllData()
      }).catch(err => {
        console.log(err)
        alert("err")
      });
    } else {
      const url = `${process.env.REACT_APP_API_URL}/Ciudades/Agregar`;
      axios.post(url, Object.assign({}, params), { headers }).then(respuesta => {
        alert(respuesta.data)
        getAllData()
      }).catch(err => {
        console.log(err)
        alert(err)
      });
    }

  }

  const handleAceptarCodigoPostal = (e) => {
    e.preventDefault()
    var params = {

      "m_nIdEstado": state.idEstado,
      "m_nIdCiudad": state.idCiudad,
      "m_sCP": state.codigoPostal,
      "m_nIdCP": state.idCodigoPostal,
      "CreadoPor": 1,
      "ModificadoPor": 1
    }
    console.log(params)
    if (state.idCodigoPostal != 0) {
      const url = `${process.env.REACT_APP_API_URL}/CodigoPostal/Modificar/` + state.idCodigoPostal;
      axios.put(url, Object.assign({}, params), { headers }).then(respuesta => {
        alert(respuesta.data)
        getAllData()
      }).catch(err => {
        console.log(err)
        alert("err")
      });
    } else {
      const url = `${process.env.REACT_APP_API_URL}/CodigoPostal/Agregar`;
      axios.post(url, Object.assign({}, params), { headers }).then(respuesta => {
        alert(respuesta.data)
      }).catch(err => {
        console.log(err)
        alert(err)
      });
    }

  }

  function handleEliminarCiudad(id) {
    const url = `${process.env.REACT_APP_API_URL}/Ciudades/Eliminar/` + id;
    axios.delete(url, { headers }).then(respuesta => {
      alert(respuesta.data)
      getAllData();
    }).catch(err => {
      alert(err)
    });
  }

  function handleEliminarCodigoPostal(id) {
    const url = `${process.env.REACT_APP_API_URL}/CodigoPostal/Eliminar/` + id;
    axios.delete(url, { headers }).then(respuesta => {
      alert(respuesta.data)
      getAllCodigoPostal();
    }).catch(err => {
      alert(err)
    });
  }

  function handleShowModificarCiudad(id) {
    const url = `${process.env.REACT_APP_API_URL}/Ciudades/GetById/${id}`;
    axios.get(url, { headers }).then(respuesta => {
      console.log(respuesta.data)
      setState({
        ...state,
        agregar: "Modificar",
        idCiudad: id,
        codigoCiudad: respuesta.data.m_nCodigo,
        ciudad: respuesta.data.m_sCiudad,
        abreviacionCiudad: respuesta.data.m_sAbreviacion,
        idEstado: respuesta.data.m_nIdEstado

      })
    });
  }

  function handleShowModificarCodigoPostal(id) {
    const url = `${process.env.REACT_APP_API_URL}/CodigoPostal/GetById/${id}`;
    axios.get(url, { headers }).then(respuesta => {
      console.log(respuesta.data)
      setState({
        ...state,
        agregar: "Modificar",
        idCodigoPostal: id,
        codigoPostal: respuesta.data.m_sCP,
        zona: respuesta.data.m_sCiudad,
      })
    });
  }

  function handleShowAgregarCiudad() {
    setState({
      ...state,
      agregar: "Agregar",
      idCiudad: 0,
      codigoCiudad: "",
      ciudad: "",
      abreviacionCiudad: "",
      idEstado: dataEstado[0].m_nIdEstado,
      idPais: dataPais[0].m_nIdPais,
    })
  }

  function handleShowAgregarCodigoPostal() {
    setState({
      ...state,
      agregarCodigoPostal: "Agregar",
      idCodigoPostal: 0,
      codigoPostal: "",
      zona: "",
    })
  }

  const handleChange = event => {
    console.log(event.target.value)
    setState({
      ...state,
      [event.target.id]: event.target.value
    });
  };

  const handleSelectPais = event => {
    setState({
      ...state,
      idPais: event.target.value
    });
    getAllEstado(event.target.value)
  }

  function handleSelectCiudad(row, event) {
    setState({
      ...state,
      idCiudad: row.m_nIdCiudad,
      idEstado: row.m_nIdEstado
    });
    getAllCodigoPostal(row.m_nIdCiudad)
  }

  const columns = React.useMemo(() => [
    {
      Name: "Código",
      accessor: "m_nCodigo",
    }, {
      Name: "Ciudad",
      accessor: "m_sCiudad",
    }, {
      Name: "Abreviación",
      accessor: "m_sAbreviacion",
    }, {
      Name: "Estado",
      accessor: "m_nIdEstado",
    }

  ]);

  const columnsCodigoPostal = React.useMemo(() => [
    {
      Name: "Código",
      accessor: "m_sCP",
    }

  ]);

  useEffect(value => {
    getAllData();
    getAllPais();
  }, []);

  function getAllData() {
    const url = `${process.env.REACT_APP_API_URL}/Ciudades/GetListado`;
    axios.get(url, { headers }).then(respuesta => {
      setData(respuesta.data)
      getAllCodigoPostal(respuesta.data[0].m_nIdCiudad)
      setState({
        ...state,
        idCiudad: respuesta.data[0].m_nIdCiudad,
        idEstado: respuesta.data[0].m_nIdEstado
      });
    });
  };

  function getAllCodigoPostal() {
    const url = `${process.env.REACT_APP_API_URL}/CodigoPostal/GetListado`;
    axios.get(url, { headers }).then(respuesta => {
      setDataCodigoPostal(respuesta.data)
    });
  }

  function getAllPais() {
    const url = `${process.env.REACT_APP_API_URL}/Pais/GetListado`;
    axios.get(url, { headers }).then((respuesta) => {
      setDataPais(respuesta.data);
      getAllEstado(respuesta.data[0].m_nIdPais)
    });
  }

  function getAllEstado(id) {
    const url = `${process.env.REACT_APP_API_URL}/Estados/ByPais/${id}`;
    axios.get(url, { headers }).then((respuesta) => {
      setDataEstado(respuesta.data);
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
      useGlobalFilter,
      useSortBy,
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
                  <tr {...row.getRowProps()}
                    onClick={handleSelectCiudad.bind(this, row.original)}
                    className={state.idCiudad === row.original.m_nIdCiudad ? classes.seleccionado : classes.noSeleccionado}>
                    <td>
                      <div>
                        <a href="#Agregar" role="tab" data-toggle="tab" onClick={() => (handleShowModificarCiudad(row.original.m_nIdCiudad))} className="btn btn-default btn-sm m-user-edit"><i className="zmdi zmdi-edit" /></a>
                        <a href="#" className="btn btn-default btn-sm m-user-delete" onClick={() => (handleEliminarCiudad(row.original.m_nIdCiudad))}><i className="zmdi zmdi-close" /></a>
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

  function TableCodigoPostal({ columns, data }) {

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
      useSortBy,
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
                        <a href="#AgregarCP" role="tab" data-toggle="tab" onClick={() => (handleShowModificarCodigoPostal(row.original.m_nIdCP))} className="btn btn-default btn-sm m-user-edit"><i className="zmdi zmdi-edit" /></a>
                        <a href="#" className="btn btn-default btn-sm m-user-delete" onClick={() => (handleEliminarCodigoPostal(row.original.m_nIdCP))}><i className="zmdi zmdi-close" /></a>
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

  const ruta = [
    {
      actual : false,
      nombre: "Configuración",
      ruta: "/Configuracion"
    },
    {
      actual : true,
      nombre: "Ciudades",
      ruta: "/Ciudades"
    },
  ];

  return (
    <div>

      <header className="topbar clearfix">
        <Cabecera rutas={ruta}/>
      </header>

      {/*Leftbar Start Here*/}
      <aside className="iconic-leftbar">
        <BarraLateralIzquierda />
      </aside>
      {/*Leftbar End Here*/}

      {/*Page Container Start Here*/}
      <section className="main-container">
        <div className="container-fluid">

          <div className="row">
            <div className="col-md-7" >
              <ul className="nav nav-tabs">
                <li className="active">
                  <a data-toggle="tab" href="#Listado">
                    <i className="fa fa-list" /> Listado
            </a>
                </li>
                <li>
                  <a data-toggle="tab" href="#Agregar" onClick={handleShowAgregarCiudad}>
                    <i className="fa fa-plus-circle" /> {state.agregarCiudad}
                  </a>
                </li>
              </ul>

              <div className="tab-content">
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
                          <form className="j-forms" onSubmit={handleAceptarCiudad}>
                            <div className="form-content">

                              <div className="col-sm-12 col-md-6 unit">
                                <label className="label">
                                  Código
                              </label>
                                <div className="input">
                                  <input
                                    onChange={handleChange}
                                    className="form-control"
                                    type="number"
                                    min="0"
                                    required={true}
                                    value={state.codigoCiudad}
                                    id="codigoCiudad"
                                  />
                                </div>
                              </div>

                              <div className="col-sm-12 col-md-6 unit">
                                <label className="label">
                                  Abreviación
                              </label>
                                <div className="input">
                                  <input
                                    onChange={handleChange}
                                    className="form-control"
                                    type="text"
                                    required={true}
                                    value={state.abreviacionCiudad}
                                    id="abreviacionCiudad"
                                  />
                                </div>
                              </div>

                              <div className="col-sm-12 col-md-12 unit">
                                <label className="label">
                                  Ciudad
                              </label>
                                <div className="input">
                                  <input
                                    onChange={handleChange}
                                    className="form-control"
                                    type="text"
                                    required={true}
                                    value={state.ciudad}
                                    id="ciudad"
                                  />
                                </div>
                              </div>

                              <div className="col-sm-12 col-md-12 unit">
                                <label className="label">
                                  País
                              </label>
                                <div className="input">
                                  <label className="input select">
                                    <select
                                      className="form-control"
                                      required
                                      onChange={handleSelectPais}
                                      value={state.idPais}
                                      id="idPais"
                                    >
                                      {
                                        dataPais.length < 1 ?

                                          <option value="none">
                                            País
                                          </option>
                                          :
                                          dataPais.map((pais) => (
                                            <option key={pais.m_nIdPais} value={pais.m_nIdPais}>
                                              {pais.m_sPais}
                                            </option>
                                          ))
                                      }

                                    </select>
                                    <i></i>
                                  </label>
                                </div>
                              </div>

                              <div className="col-sm-12 col-md-12 unit">
                                <label className="label">
                                  Estado
                              </label>
                                <div className="input">
                                  <label className="input select">
                                    <select
                                      className="form-control"
                                      required
                                      onChange={handleChange}
                                      value={state.idEstado}
                                      id="idEstado"
                                    >
                                      {
                                        dataEstado.length < 1 ?

                                          <option value="none">
                                            Estados
                                    </option>
                                          :
                                          dataEstado.map((estado) => (
                                            <option value={estado.m_nIdEstado}>
                                              {estado.m_sEstado}
                                            </option>
                                          ))
                                      }
                                    </select>
                                    <i></i>
                                  </label>
                                </div>
                              </div>


                            </div>
                            <br></br>
                            <div className="form-footer" className="col-md-12">
                              <button href="#Listado" role="tab" data-toggle="tab" className="btn btn-primary secondary-btn">Cancelar</button>
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

            <div className="col-md-5" >
              <ul className="nav nav-tabs">
                <li className="active">
                  <a data-toggle="tab" href="#ListadoEstado">
                    <i className="fa fa-list" /> Listado
                </a>
                </li>
                <li>
                  <a data-toggle="tab" href="#AgregarCP" onClick={handleShowAgregarCodigoPostal}>
                    <i className="fa fa-plus-circle" /> {state.agregarCodigoPostal}
                  </a>
                </li>
              </ul>

              <div className="tab-content">
                <div className="widget-wrap" id="ListadoEstado" className="tab-pane fade in active">
                  <div className="widget-wrap">
                    <div className="widget-content">
                      <div className="row">
                        <TableCodigoPostal columns={columnsCodigoPostal} data={dataCodigoPostal} />
                      </div>
                    </div>
                  </div>
                </div>

                <div className="widget-wrap" id="AgregarCP" className="tab-pane fade">
                  <div className="widget-wrap">
                    <div className="widget-content">
                      <div className="row">
                        <div className="col-md-12">
                          <form className="j-forms" onSubmit={handleAceptarCodigoPostal}>
                            <div className="form-content">

                              <div className="col-sm-12 col-md-12 unit">
                                <label className="label">
                                  Código Postal
                                </label>
                                <div className="input">
                                  <input
                                    onChange={handleChange}
                                    className="form-control"
                                    type="text"
                                    required={true}
                                    value={state.codigoPostal}
                                    id="codigoPostal"
                                  />
                                </div>
                              </div>

                              <div className="col-sm-12 col-md-12 unit">
                                <label className="label">
                                  Zona
                                </label>
                                <div className="input">
                                  <input
                                    onChange={handleChange}
                                    className="form-control"
                                    type="text"
                                    required={true}
                                    value={state.zona}
                                    id="zona"
                                  />
                                </div>
                              </div>

                            </div>
                            <br></br>
                            <div className="form-footer" className="col-md-12">
                              <button href="#Listado" role="tab" data-toggle="tab" className="btn btn-primary secondary-btn">Cancelar</button>
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

export default CiudadesCodigoPostal;
