import React, { useEffect, useState, useMemo } from "react";
import axios from "axios";
import Cabecera from "../Components/Template/Cabecera";
import BarraLateralIzquierda from "../Components/Template/BarraLateralIzquierda";
import BarraLateralDerecha from "../Components/Template/BarraLateralDerecha";
import { makeStyles } from "@material-ui/core/styles";
import { DataGrid } from '@material-ui/data-grid';
import Noty from 'noty';
import { dataGridLocaleText } from "../Constants";
import { Tooltip } from "@material-ui/core";
import { obtenerCiudades } from "../Util/Contexts/CiudadesContext";
import { obtenerCodigoPostal } from "../Util/Contexts/CodigoPostalContext";
import { validarPermisos } from "../Util/Contexts/UsuarioContext";

function showSuccess(mensaje) {
    new Noty({
        type: "information",
        layout: "topCenter",
        text: mensaje,
        timeout: "3000"
    }).show()
}

function Zonas() {

  const [data, setData] = React.useState([])
  const [dataSucursal, setDataSucursal] = React.useState([]);
  const [dataCiudad, setDataCiudad] = React.useState([]);
  const [dataMunicipios, setDataMunicipios] = React.useState([]);
  const [dataLocalidades, setDataLocalidades] = React.useState([]);
  const [dataCodigoPostal, setDataCodigoPostal] = React.useState([]);
  const [state, setState] = React.useState({
    agregar: "Agregar",
    idZona: 0,
    idMunicipioSeleccionado: 0,
    idCiudadSeleccionado: 0,
    idCodigoPostalSeleccionado: 0,
    DerechoBorrar: 21,
    CreadoPor: localStorage.getItem("UsuarioId"),
    ModificadoPor: localStorage.getItem("UsuarioId"),
    height: window.innerHeight
  })

    const handleAceptar = (e) => {
        e.preventDefault()
        var params = {

            "Codigo": state.codigoDepartamento,
            "Descripcion": state.descripcionDepartamento,

            "CreadoPor": state.CreadoPor,
            "ModificadoPor": state.ModificadoPor
        }
        console.log(params)
        if (state.idDepartamento != 0) {
            const url = `${process.env.REACT_APP_API_URL}/Departamento/Modificar/` + state.idDepartamento;
            axios.put(url, Object.assign({}, params), { headers }).then(respuesta => {
                showSuccess(respuesta.data)
                getAllData()
            }).catch(err => {
                console.log(err)
                showSuccess("err")
            });
        } else {
            const url = `${process.env.REACT_APP_API_URL}/Departamento/Agregar`;
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
        validarPermisos(state).then(respuesta => {
            derecho = respuesta.data;
            if (derecho == false) {
                showSuccess("El usuario no tiene derechos para realizar el proceso");
                return;
            }

            const url = `${process.env.REACT_APP_API_URL}/Departamento/Eliminar/` + id;
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
        const url = `${process.env.REACT_APP_API_URL}/Departamento/GetById/` + id;
        axios.get(url, { headers }).then(respuesta => {
            console.log(respuesta.data)
            setState({
                ...state,
                agregar: "Modificar",
                showPopUp: true,
                idDepartamento: id,
                codigoDepartamento: respuesta.data.m_nCodigo,
                descripcionDepartamento: respuesta.data.m_sDescripcion
            })
        });
    }

    function handleShowConsultar(id) {
        const url = `${process.env.REACT_APP_API_URL}/Departamento/GetById/` + id;
        axios.get(url, { headers }).then(respuesta => {
            console.log(respuesta.data)
            setState({
                ...state,
                agregar: "Consultar",
                showPopUp: true,
                idDepartamento: id,
                codigoDepartamento: respuesta.data.m_nCodigo,
                descripcionDepartamento: respuesta.data.m_sDescripcion
            })
        });
    }

    function handleShowAgregar() {
        setState({
            ...state,
            agregar: "Agregar",
            showPopUp: true,
            idDepartamento: 0,
            codigoDepartamento: "",
            descripcionDepartamento: ""
        })
    }

    const handleChange = event => {
        console.log(event.target.id + " : " + event.target.value)
        setState({
            ...state,
            [event.target.id]: event.target.value
        });
    };

    const columns = React.useMemo(() => [
        {
            headerName: "Acciones",
            sortable: false, filterable: false,
            field: "",
            renderCell: (row) => {
                return (
                    <div>
                        <Tooltip title="Modificar">
                            <a href="#Agregar" role="tab" data-toggle="tab" onClick={() => (handleShowModificar(row.row.m_nIdZona))} className="btn btn-default btn-xs"><i className="fa fa-pencil-square-o" style={{ color: "#F9A03E" }} /></a>

                        </Tooltip>
                        <Tooltip title="Consultar">
                            <a href="#Agregar" role="tab" data-toggle="tab" className="btn btn-default btn-xs" onClick={() => (handleShowConsultar(row.row.m_nIdZona))}><i className="fa fa-eye" style={{ color: "#F9A03E" }} /></a>

                        </Tooltip>
                        <Tooltip title="Eliminar">
                            <a href="#" className="btn btn-default btn-xs" onClick={() => (handleEliminar(row.row.m_nIdZona))}><i className="zmdi zmdi-delete" style={{ color: "#F30B0B" }} /></a>

                        </Tooltip>
                    </div>
                )
            }
        },
        {
            headerName: "Folio",
            field: "m_nFolio",
            width: 125,
        },
        {
            headerName: "Descripción",
            field: "m_sDescripcion",
            width: 200,
        },
        {
            headerName: "Sucursal",
            field: "m_nIdSucursal",
            width: 200,
            renderCell: (row) => {
                return (
                    <div>
                        { dataSucursal.find(o => o.m_nIdSucursal == row.row.m_nIdSucursal).m_sSucursal}
                    </div>
                )
            }
        },
        {
            headerName: "Creado El",
            field: "m_dtCreadoEl",
            width: 200,
        },
        {
            headerName: "Creado Por",
            field: "m_nCreadoPor",
            width: 125,
        },
        {
            headerName: "Modificado El",
            field: "m_dtModificadoEl",
            width: 200,
        },
        {
            headerName: "Modificado Por",
            field: "m_nModificadoPor",
            width: 150,
        }

    ]);

  const columnsMunicipio = React.useMemo(() => [
    {
      headerName: "Municipios",
      field: "m_sMunicipio",
      width: "200",
    },
  ])

  const columnsCiudades = React.useMemo(() => [
    {
      headerName: "Ciudad",
      field: "m_sCiudad",
      width: "200",
    },
  ])

  const columnsCodigoPostal = React.useMemo(() => [
    {
      headerName: "CodigoPostal",
      field: "m_sCP",
      width: "200",
    },
  ])

  const columnsLocalidades = React.useMemo(() => [
    {
      headerName: "Localidades",
      field: "m_sLocalidad",
      width: "200",
    },
  ])

  useEffect(async value => {
    if (localStorage.getItem("UsuarioId") === null || localStorage.getItem("UsuarioId") <= 0) {
      showSuccess("Es necesario iniciar sesion para acceder a este proceso");
      window.location.replace("login");
      return;
    }
    getAllMunicipios();
    getAllCiudades();
    getAllCodigoPostal();
    getAllSucursalData();
    getAllData();
  }, []);

    function getAllData() {
        const url = `${process.env.REACT_APP_API_URL}/Zonas/GetListado`;
        axios.get(url, { headers }).then(respuesta => {
            setData(respuesta.data)
        });
    };

    async function getAllSucursalData() {
        const url = `${process.env.REACT_APP_API_URL}/Sucursales/GetListado`;
        await axios.get(url, { headers }).then((respuesta) => {
            setDataSucursal(respuesta.data);
        });
    }

  async function getAllMunicipios() {
    const url = `${process.env.REACT_APP_API_URL}/Municipios/GetListado`;
    await axios.get(url, { headers }).then((respuesta) => {
      setDataMunicipios(respuesta.data);
    });
  }

  async function getAllCiudades() {
    obtenerCiudades().then((respuesta) => {
      setDataCiudad(respuesta.data);
    });
  }

  async function getAllCodigoPostal() {
    obtenerCodigoPostal().then((respuesta) => {
      console.log(respuesta.data)
      setDataCodigoPostal(respuesta.data);
      getAllLocalidades(respuesta.data[0].m_nIdCP)
    });
  }

  async function getAllLocalidades(id) {
    const url = `${process.env.REACT_APP_API_URL}/Asentamiento/GetListadoByCodigoPostal/${id}` ;
    await axios.get(url, { headers }).then((respuesta) => {
      setDataLocalidades(respuesta.data);
    });
  }

  function handleSelectCodigoPostal(id){
    setState({
      ...state,
      idCodigoPostalSeleccionado: id
    })
    getAllLocalidades(id)
  }

    const headers = {
        'Content-Type': 'application/json',
        //    'access-control-allow-origin': '*'
    }

    return (
        <div >

            <header className="topbar clearfix">
                <Cabecera titulo="Zonas" >
                    <div className="page-header">
                        <ul className="list-page-breadcrumb">
                            <li>
                                <a href="/Catalogos" className="color-mapeo">
                                    Configuración <i className="zmdi zmdi-chevron-right" />
                                </a>
                            </li>
                            <li className="active-page">Zonas</li>
                        </ul>
                    </div>
                </Cabecera>
            </header>

            {/*Leftbar Start Here*/}
            <aside className="iconic-leftbar">
                <BarraLateralIzquierda />
            </aside>
            {/*Leftbar End Here*/}

            {/*Page Container Start Here*/}
            <section className="main-container">

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
                    </ul>

                    <div className="row" className="tab-content">
                        <div className="widget-wrap" id="Listado" className="tab-pane fade in active">
                            <div className="widget-wrap">
                                <div className="widget-content">
                                    <div className="row" style={{ height: state.height - 250, width: '100%' }}>
                                        {data.length != 0 ? (
                                            <DataGrid
                                                localeText={dataGridLocaleText}
                                                rows={data}
                                                columns={columns}
                                                density="compact"
                                                pageSize={Math.floor((state.height - 310) / 30)}
                                                getRowId={(row) => row.m_nIdZona}
                                                onRowSelected={(row) => {
                                                    setState({
                                                        ...state,
                                                        idZona: row.data.m_nIdZona
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
                                        <form className="j-forms" onSubmit={handleAceptar}>
                                            <div className="form-content">
                                                <div className="row" style={{ display: "flex" }}>
                                                    <div className="col-sm-6 col-md-4 unit">
                                                        <label className="label">Folio</label>
                                                        <div className="input">
                                                            <input
                                                                type="text"
                                                                className="form-control"
                                                                value={state.fechaInicial}
                                                                onChange={handleChange}
                                                                id="fechaInicial"
                                                            />
                                                        </div>
                                                    </div>

                                                    <div className="col-sm-6 col-md-4 unit">
                                                        <label className="label">Fecha Final</label>
                                                        <div className="input">
                                                            <input
                                                                type="date"
                                                                className="form-control"
                                                                value={state.fechaFinal}
                                                                onChange={handleChange}
                                                                id="fechaFinal"
                                                            />
                                                        </div>

                                                    </div>

                          <div className="col-sm-6 col-md-4 unit">
                            <label className="label">Sucursal</label>
                            <label className="input select">
                              <select
                                className="form-control"
                                required
                                value={state.sucursalListado}
                                onChange={handleChange}
                                id="sucursalListado"
                              >
                                <option value="0">Todas</option>
                                {dataSucursal.map((sucursal) => (
                                  <option
                                    key={sucursal.m_nIdSucursal}
                                    value={sucursal.m_nIdSucursal}
                                  >
                                    {sucursal.m_sSucursal}
                                  </option>
                                ))}
                              </select>
                              <i></i>
                            </label>
                          </div>
                        </div>
{/**
                        <div className="widget-wrap col-sm-6 col-md-3">
                          <div className="row" style={{ height: state.height - 250, width: '100%' }}>
                            {dataMunicipios.length != 0 ? (
                              <DataGrid
                                rows={dataMunicipios}
                                columns={columnsMunicipio}
                                hideFooterPagination="true"
                                hideFooterSelectedRowCount="true"
                                density="compact"
                                getRowId={(row) => row.m_nIdMunicipio}
                                checkboxSelection={true}
                                onRowSelected={(row) => {
                                  setState({
                                    ...state,
                                    idMunicipioSeleccionado: row.data.m_nIdMunicipio
                                  })
                                }}
                              />
                            ) : (
                              <div>No se encontró ningún registro</div>
                            )}
                          </div>
                        </div>
*/}
                        <div className="widget-wrap col-sm-6 col-md-4">
                          <div className="row" style={{ height: state.height - 250, width: '100%' }}>
                            {dataCiudad.length != 0 ? (
                              <DataGrid
                                rows={dataCiudad}
                                columns={columnsCiudades}
                                hideFooterPagination="true"
                                hideFooterSelectedRowCount="true"
                                density="compact"
                                getRowId={(row) => row.m_nIdCiudad}
                                checkboxSelection={true}
                                onRowSelected={(row) => {
                                  setState({
                                    ...state,
                                    idCiudadSeleccionado: row.data.m_nIdCiudad,
                                    idCodigoPostalSeleccionado: 0
                                  })
                                }}
                                onSelectionModelChange={(newSelection) => {
                                  console.log(newSelection);
                              }}
                              />
                            ) : (
                              <div>No se encontró ningún registro</div>
                            )}
                          </div>
                        </div>

                        <div className="widget-wrap col-sm-6 col-md-4">
                          <div className="row" style={{ height: state.height - 250, width: '100%' }}>
                            {dataCodigoPostal.length != 0 ? (
                              <DataGrid
                                rows={dataCodigoPostal.filter(cp => cp.m_nIdCiudad == state.idCiudadSeleccionado)}
                                columns={columnsCodigoPostal}
                                hideFooterPagination="true"
                                hideFooterSelectedRowCount="true"
                                density="compact"
                                getRowId={(row) => row.m_nIdCP}
                                checkboxSelection={true}
                                onRowSelected={(row) => {
                                  handleSelectCodigoPostal(row.data.m_nIdCP)
                                }}
                              />
                            ) : (
                              <div>No se encontró ningún registro</div>
                            )}
                          </div>

                        </div>

                        <div className="widget-wrap col-sm-6 col-md-4">
                          <div className="row" style={{ height: state.height - 250, width: '100%' }}>
                            {dataLocalidades.length != 0 ? (
                              <DataGrid
                                rows={dataLocalidades.filter(localidad => localidad.m_nIdCodigoPostal == state.idCodigoPostalSeleccionado)}
                                columns={columnsLocalidades}
                                hideFooterPagination="true"
                                hideFooterSelectedRowCount="true"
                                density="compact"
                                getRowId={(row) => row.m_nIdLocalidad}
                                checkboxSelection={true}
                                onRowSelected={(row) => {
                                  setState({
                                    ...state,
                                  })
                                }}
                              />
                            ) : (
                              <div>No se encontró ningún registro</div>
                            )}
                          </div>
                        </div>

                                                <div className="row">
                                                    <div className="form-footer" className="col-sm-12 col-md-12 unit">
                                                        <button href="#Listado" role="tab" data-toggle="tab" data-layout="topCenter" data-type="information" className="btn btn-secondary secondary-btn"> Cancelar</button>
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

            </section>
            {/*Page Container End Here*/}

            {/*Rightbar Start Here*/}
            <aside className="rightbar">
                <BarraLateralDerecha />
            </aside>

        </div>

    );
}

export default Zonas;
