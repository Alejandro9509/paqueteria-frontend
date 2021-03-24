import React, { useEffect, useState, useMemo } from "react";
import axios from "axios";
import Cabecera from "../Components/Template/Cabecera";
import BarraLateralIzquierda from "../Components/Template/BarraLateralIzquierda";
import BarraLateralDerecha from "../Components/Template/BarraLateralDerecha";
import BasicTable from "./BasicTable";
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

function Sucursal() {

  const classes = useStyles();
  const [data, setData] = React.useState([])
  const [dataPais, setDataPais] = React.useState([])
  const [dataEstado, setDataEstado] = React.useState([])
  const [dataCodigoPostal, setDataCodigoPostal] = React.useState([]);
  const [state, setState] = React.useState({
    agregar: "Agregar",
    idSucursal: 0,
    sucursal: "",
    abreviacion: "",
    idPais: 0,
    idEstado: 0,
    codigoPostal: 0,
    municipio: "",
    DerechoBorrar:17,
    localidad: "",
    colonia: "",
    calle: "",
    numInterior: 0,
    numExterior: 0,
    iva: "18",
    zonaHoraria: "08:00|America/Tijuana",
    activo: false,
    height: window.innerHeight,
    CreadoPor:localStorage.getItem("UsuarioId"),
    ModificadoPor:localStorage.getItem("UsuarioId")
  })


  const handleAceptar = (e) => {
    e.preventDefault()
    console.log(state.zonaHoraria.split("|"))
    var params = {

      "Sucursal": state.sucursal,
      "Abreviacion": state.abreviacion,
      "Calle": state.calle,
      "NoInterior": state.numInterior,
      "NoExterior": state.numExterior,
      "Colonia": state.colonia,
      "Localidad": state.localidad,
      "Municipio": state.municipio,
      "IdEstado": state.idEstado,
      "IdImpuestoTraslado": state.iva,
      "Activa": state.activo,
      "CreadoPor": state.CreadoPor,
      "ModificadoPor":state.ModificadoPor,
      "ZonaHoraria": state.zonaHoraria.split("|")[0],
      "DescripcionZonaHoraria": state.zonaHoraria.split("|")[1],
    }
    console.log(params)
    if (state.idSucursal != 0) {
      const url = `${process.env.REACT_APP_API_URL}/Sucursales/Modificar/` + state.idSucursal;
      axios.put(url, Object.assign({}, params), { headers }).then(respuesta => {
        showSuccess(respuesta.data)
        getAllData();
        //window.location.reload();
      }).catch(err => {
        console.log(err)
        showSuccess("err")
      });
    } else {
      const url = `${process.env.REACT_APP_API_URL}/Sucursales/Agregar`;
      axios.post(url, Object.assign({}, params), { headers }).then(respuesta => {
        showSuccess(respuesta.data)
        getAllData();
        //window.location.reload();
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
      const url = `${process.env.REACT_APP_API_URL}/Sucursales/Eliminar/` + id;
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

  function handleShowModificar(id) {
    console.log(id)
    const url = `${process.env.REACT_APP_API_URL}/Sucursales/GetById/` + id;
    axios.get(url, { headers }).then(respuesta => {
      console.log(respuesta.data)
      setState({
        ...state,
        agregar: "Modificar",
        idSucursal: respuesta.data.m_nIdSucursal,
        sucursal: respuesta.data.m_sSucursal,
        abreviacion: respuesta.data.m_sAbreviacion,
        idPais: 0,
        idEstado: respuesta.data.m_nIdEstado,
        codigoPostal: 0,
        municipio: respuesta.data.m_sMunicipio,
        localidad: respuesta.data.m_sLocalidad,
        colonia: respuesta.data.m_sColonia,
        calle: respuesta.data.m_sCalle,
        numInterior: respuesta.data.m_sNoInterior,
        numExterior: respuesta.data.m_sNoExterior,
        iva: respuesta.data.m_sIdImpuestoTraslado,
        zonaHoraria: respuesta.data.m_xZonaHoraria,
        activo: respuesta.data.m_bActiva
      })
    });
  }

  function handleShowAgregar() {
    setState({
      ...state,
      agregar: "Agregar",
      idSucursal: 0,
      sucursal: "",
      abreviacion: "",
      idPais: dataPais[0].m_nIdPais,
      idEstado: dataEstado[0].m_nIdEstado,
      codigoPostal: dataCodigoPostal[0].m_nIdCP,
      municipio: "",
      localidad: "",
      colonia: "",
      calle: "",
      numInterior: 0,
      numExterior: 0,
      iva: "18",
      zonaHoraria: "08:00|America/Tijuana",
      activo: false
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
      idSucursal: id
    });
  }
  const handleSelectPais = event => {
    setState({
      ...state,
      idPais: event.target.value
    });
    getAllEstado(event.target.value)
  }

  function handleChangeBoolean() {
    setState({
      ...state,
      activo: !state.activo
    });
    console.log(state.activo)
  }

  const columns = React.useMemo(() => [
    {
      headerName: "Acciones",
      field: "",
      renderCell: (row) => {
        return (
          <div>
            <a href="#Agregar" role="tab" data-toggle="tab" onClick={() => (handleShowModificar(row.row.m_nIdSucursal))} className="btn btn-default btn-xs"><i className="fa fa-pencil-square-o" style={{ color: "#F9A03E" }} /></a>
            <a href="#Agregar" role="tab" data-toggle="tab" className="btn btn-default btn-xs" onClick={() => (handleShowModificar(row.row.m_nIdSucursal))}><i className="fa fa-eye" style={{ color: "#F9A03E" }} /></a>
            <a href="#" className="btn btn-default btn-xs" onClick={() => (handleEliminar(row.row.m_nIdSucursal))}><i className="zmdi zmdi-delete" style={{ color: "#F30B0B" }} /></a>
          </div>
        )
      }
    },
    {
      headerName: "Abreviación",
      field: "m_sAbreviacion",
      width: 125
    }, {
      headerName: "Sucursal",
      field: "m_sSucursal",
      width: 400
    }, {
      headerName: "Ubicación",
      field: "m_dtCreadoEl",
      width: 400
    }, {
      headerName: "Activo",
      field: "m_nCreadoPor",
      width: 100
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
    getAllPais();
    getAllCodigosPostales();
  }, []);

  function getAllData() {
    const url = `${process.env.REACT_APP_API_URL}/Sucursales/GetListado`;
    axios.get(url, { headers }).then(respuesta => {
      setData(respuesta.data)
    });
  };

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

  function getAllCodigosPostales() {
    const url = `${process.env.REACT_APP_API_URL}/CodigoPostal/GetListado`;
    axios.get(url, { headers }).then((respuesta) => {
      setDataCodigoPostal(respuesta.data);
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
                  onClick={handleSelectRow.bind(this, row.original.m_nIdSucursal)}
                  className={state.idSucursal === row.original.m_nIdSucursal ? classes.seleccionado : classes.noSeleccionado}>
                    <td>
                      <div>
                        <a href="#Agregar" role="tab" data-toggle="tab" onClick={() => (handleShowModificar(row.original.m_nIdSucursal))} className="btn btn-default btn-sm"><i className="fa fa-pencil-square-o" style={{color:"#F9A03E"}} /></a>
                        <a href="#Agregar" role="tab" data-toggle="tab" onClick={() => (handleShowModificar(row.original.m_nIdSucursal))} className="btn btn-default btn-sm"><i className="fa fa-eye" style={{color:"#F9A03E"}} /></a>
                        <a href="#" className="btn btn-default btn-sm" onClick={() => (handleEliminar(row.original.m_nIdSucursal))}><i className="zmdi zmdi-delete"  style={{color:"#F30B0B"}} /></a>
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
                <h2>Sucursal</h2>
              </div>
              <div className="col-md-6 col-sm-6">
                <ul className="list-page-breadcrumb">
                  <li>
                    <a href="/Configuracion" className="color-mapeo">
                      Configuración <i className="zmdi zmdi-chevron-right" />
                    </a>
                  </li>
                  <li className="active-page">Sucursal</li>
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
                <div className="row wrapper-tabla" style={{ height: state.height - 250, width: '100%' }}>
                    {data.length != 0 ? (
                      <DataGrid
                        rows={data}
                        columns={columns}
                        pageSize={10}
                        getRowId={(row) => row.m_nIdSucursal}
                        onRowSelected={(row) => {
                          setState({
                            ...state,
                            idSucursal: row.data.m_nIdSucursal
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
                          <div className="col-sm-6 col-md-2-5 unit">
                            <label className="label">
                              Sucursal
                          </label>
                            <div className="input">

                              <input
                                onChange={handleChange}
                                className="form-control"
                                type="text"
                                required
                                value={state.sucursal}
                                id="sucursal"
                                maxLength="80"
                              />
                            </div>
                          </div>

                         

                          <div className="col-sm-6 col-md-2-5 unit unit">
                            <label className="label">
                              Abreviación
                          </label>
                            <div className="input">
                              <input
                                onChange={handleChange}
                                className="form-control"
                                type="text"
                                required
                                value={state.abreviacion}
                                id="abreviacion"
                                maxLength="50"
                              />
                            </div>
                          </div>


                          <div className="col-sm-12 col-md-2-5 unit">
                                    <label className="label">Estatus</label>
                                    <label className="checkbox">
                                      <input
                                        onChange={
                                          handleChangeBoolean
                                        }
                                        native
                                        type="checkbox"
                                        value={state.activo}
                                        id="activo"
                                        name="activo"
                                      />
                                      <i />
                                    Activo
                                  </label>
                                  </div>
</div>

<div className="row">
                          <div className="col-sm-12 col-md-2-5 unit">
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

                          <div className="col-sm-12 col-md-2-5 unit">
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

                          <div className="col-sm-12 col-md-2-5 unit">
                            <label className="label">
                              Código Postal
                                  </label>
                            <label className="input select">
                              <select
                                className="form-control"
                                required
                                value={state.codigoPostal}
                                onChange={handleChange}
                                id="codigoPostal"
                              >
                                {dataCodigoPostal.map(
                                  (codigoPostal) => (
                                    <option key={codigoPostal.m_nIdCP} value={codigoPostal.m_nIdCP}>
                                      {
                                        codigoPostal.m_sCP
                                      }
                                    </option>
                                  )
                                )}
                              </select>
                              <i className="fa fa-arrow-down" />
                            </label>
                          </div>

                          <div className="col-sm-12 col-md-2-5 unit">
                            <label className="label">
                              Municipio
                          </label>
                            <div className="input">

                              <input
                                onChange={handleChange}
                                className="form-control"
                                type="text"
                                required
                                value={state.municipio}
                                id="municipio"
                                maxLength="80"
                              />
                            </div>
                          </div>

                          <div className="col-sm-12 col-md-2-5 unit">
                            <label className="label">
                              Localidad
                          </label>
                            <div className="input">
                              <input
                                onChange={handleChange}
                                className="form-control"
                                type="text"
                                required
                                value={state.localidad}
                                id="localidad"
                                maxLength="50"
                              />
                            </div>
                          </div>

                          </div>
<div className="row">
                          <div className="col-sm-12 col-md-2-5  unit">
                            <label className="label">
                              Colonia
                          </label>
                            <div className="input">
                              <input
                                onChange={handleChange}
                                className="form-control"
                                type="text"
                                required
                                value={state.colonia}
                                id="colonia"
                                maxLength="50"
                              />
                            </div>
                          </div>

                          <div className="col-sm-12 col-md-2-5  unit">
                            <label className="label">
                              Calle
                          </label>
                            <div className="input">
                              <input
                                onChange={handleChange}
                                className="form-control"
                                type="text"
                                required
                                value={state.calle}
                                id="calle"
                                maxLength="50"
                              />
                            </div>
                          </div>

                          <div className="col-sm-12 col-md-2-5  unit">
                            <label className="label">
                              Num. Interior
                          </label>
                            <div className="input">
                              <input
                                onChange={handleChange}
                                className="form-control"
                                type="text"
                                required
                                value={state.numInterior}
                                id="numInterior"
                                maxLength="50"
                              />
                            </div>
                          </div>

                          <div className="col-sm-12 col-md-2-5 unit">
                            <label className="label">
                              Num. Exterior
                          </label>
                            <div className="input">
                              <input
                                onChange={handleChange}
                                className="form-control"
                                type="text"
                                required
                                value={state.numExterior}
                                id="numExterior"
                                maxLength="50"
                              />
                            </div>
                          </div>

                          </div>
                          <div className="row">

                  
                          <div className="col-sm-12 col-md-2-5  unit">
                            <label className="label">
                              IVA
                            </label>
                            <label className="input select">
                              <select
                                className="form-control"
                                required
                                value={state.iva}
                                onChange={handleChange}
                                id="iva"
                              >
                                <option value="18">
                                  18%
                              </option>
                                <option value="16">
                                  16%
                              </option>
                              </select>
                              <i className="fa fa-arrow-down" />
                            </label>
                          </div>

                          <div className="col-sm-12 col-md-2-5  unit">
                            <label className="label">
                              Zona Horaria
                            </label>
                            <label className="input select">
                              <select
                                className="form-control"
                                required
                                value={state.zonaHoraria}
                                onChange={handleChange}
                                id="zonaHoraria"
                              >
                                <option value="08:00|America/Tijuana">
                                  America/Tijuana
                              </option>
                                <option value="06:00|America/Mexico_City">
                                  America/Mexico_City
                              </option>
                              </select>
                              <i className="fa fa-arrow-down" />
                            </label>
                          </div>
</div>
                        </div>
                        <br></br>
                        <div className="form-footer" className="col-md-12">
                          <button data-layout="topCenter" data-type="information" className="btn btn-secondary secondary-btn"
                          >
                            Cancelar</button> 
                            {/** TODO Realizar correctamente el cancelar*/}
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

export default Sucursal;
