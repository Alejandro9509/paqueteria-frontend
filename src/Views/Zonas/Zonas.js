import React, { Component } from "react";
import axios from "axios";
import Cabecera from "../../Components/Template/Cabecera";
import BarraLateralIzquierda from "../../Components/Template/BarraLateralIzquierda";
import BarraLateralDerecha from "../../Components/Template/BarraLateralDerecha";
import ZonasAgregar from "./ZonasAgregar"
import { makeStyles } from "@material-ui/core/styles";
import { DataGrid } from '@material-ui/data-grid';
import Noty from 'noty';
import $ from "jquery";

window.jQuery = window.$ = $;

const headers = {
  'Content-Type': 'application/json',
  //    'access-control-allow-origin': '*'
}

function showSuccess(mensaje) {
  new Noty({
    type: "information",
    layout: "topCenter",
    text: mensaje,
    timeout: "3000"
  }).show()
}

class Zonas extends Component {

  constructor(props) {
    super(props);
    this.state = {
      agregar: "Agregar",
      idZona: 0,
      idMunicipioSeleccionado: 0,
      idCiudadSeleccionado: 0,
      idCodigoPostalSeleccionado: 0,
      DerechoBorrar: 58,
      CreadoPor: localStorage.getItem("UsuarioId"),
      ModificadoPor: localStorage.getItem("UsuarioId"),
      height: window.innerHeight,
      selected: {},
      edit: true,
      data: [],
      dataSucursal: [],
      dataMunicipio: [],
      dataCiudad: [],
      dataLocalidad: [],
      dataCodigoPostal: [],
      columns: [
        {
          headerName: "Acciones",
          field: "",
          renderCell: (row) => {
            return (
              <div>
                <a href="#Agregar" role="tab" data-toggle="tab" onClick={() => (this.handleShowModificar(row.row.m_nIdZona))} className="btn btn-default btn-xs"><i className="fa fa-pencil-square-o" style={{ color: "#F9A03E" }} /></a>
                <a href="#Agregar" role="tab" data-toggle="tab" className="btn btn-default btn-xs" onClick={() => (this.handleShowConsultar(row.row.m_nIdZona))}><i className="fa fa-eye" style={{ color: "#F9A03E" }} /></a>
                <a href="#" className="btn btn-default btn-xs" onClick={() => (this.handleEliminar(row.row.m_nIdZona))}><i className="zmdi zmdi-delete" style={{ color: "#F30B0B" }} /></a>
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
          field: "m_sSucursal",
          width: 200,
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

      ],

    }
    this.getAllData = this.getAllData.bind(this)
    this.getAllMunicipios = this.getAllMunicipios.bind(this);
    this.getAllCiudades = this.getAllCiudades.bind(this);
    this.getAllCodigoPostal = this.getAllCodigoPostal.bind(this);
    this.getAllSucursalData = this.getAllSucursalData.bind(this);
    this.cambiarPantalla = this.cambiarPantalla.bind(this)
    this.handleShowModificar = this.handleShowModificar.bind(this)
    this.handleShowConsultar = this.handleShowConsultar.bind(this)
    this.handleEliminar = this.handleEliminar.bind(this)
    this.handleAceptar = this.handleAceptar.bind(this)
  }

  componentWillMount() {

  }

  componentDidMount() {
    this.getAllData()
    this.getAllMunicipios();
    this.getAllCiudades();
    this.getAllCodigoPostal();
    this.getAllSucursalData();
  }

  componentWillUnmount() {

  }

  handleAceptar(e) {
    e.preventDefault()
    var params = {

      "m_arrZonasCiudades": [],

      "CreadoPor": this.state.CreadoPor,
      "ModificadoPor": this.state.ModificadoPor
    }
    console.log(params)
    if (this.state.idDepartamento != 0) {
      const url = `${process.env.REACT_APP_API_URL}/Departamento/Modificar/` + this.state.idDepartamento;
      axios.put(url, Object.assign({}, params), { headers }).then(respuesta => {
        showSuccess(respuesta.data)
        this.getAllData()
      }).catch(err => {
        console.log(err)
        showSuccess("err")
      });
    } else {
      const url = `${process.env.REACT_APP_API_URL}/Departamento/Agregar`;
      axios.post(url, Object.assign({}, params), { headers }).then(respuesta => {
        showSuccess(respuesta.data)
        this.getAllData()
      }).catch(err => {
        console.log(err)
        showSuccess(err)
      });
    }

  }

  handleEliminar(id) {
    var derecho;
    const urlDelete = `${process.env.REACT_APP_API_URL}/Utilerias/ValidaDerechos/${this.state.CreadoPor}/${this.state.DerechoBorrar}/3`;
    axios.get(urlDelete, { headers }).then(respuesta => {
      derecho = respuesta.data;
      if (derecho == false) {
        showSuccess("El usuario no tiene derechos para realizar el proceso");
        return;
      }

      const url = `${process.env.REACT_APP_API_URL}/Departamento/Eliminar/` + id;
      axios.delete(url, { headers }).then(respuesta => {
        console.log(respuesta);
        this.getAllData();
      }).catch(err => {
        showSuccess(err)
      });
    }).catch(err => {
      showSuccess(err)
    });
  }

  handleShowModificar(id) {
    $('.nav-tabs li ').removeClass('active');
    $('.nav-tabs li').eq(1).addClass('active');
    $('.tab-content div ').removeClass('in show');
    $('#Agregar').addClass('in show');
    const url = `${process.env.REACT_APP_API_URL}/Departamento/GetById/` + id;
    axios.get(url, { headers }).then(respuesta => {
      console.log(respuesta.data)
      this.setState({
        pantalla: 2,
        agregar: "Modificar",
        showPopUp: true,
        edit: true,
        selected: respuesta.data
      })
    });
  }

  handleShowConsultar(id) {
    $('.nav-tabs li ').removeClass('active');
    $('.nav-tabs li').eq(1).addClass('active');
    $('.tab-content div ').removeClass('in show');
    $('#Agregar').addClass('in show');
    const url = `${process.env.REACT_APP_API_URL}/Departamento/GetById/` + id;
    axios.get(url, { headers }).then(respuesta => {
      console.log(respuesta.data)
      this.setState({
        pantalla: 2,
        agregar: "Consultar",
        showPopUp: true,
        edit: true,
        selected: respuesta.data
      })
    });
  }

  cambiarPantalla(id) {
    this.setState({ pantalla: id })
  }

  handleChange = event => {
    console.log(event.target.id + " : " + event.target.value)
    this.setState({

      [event.target.id]: event.target.value
    });
  };

  getAllData() {
    const url = `${process.env.REACT_APP_API_URL}/Zonas/GetListado`;
    axios.get(url, { headers }).then(respuesta => {
      this.setState({ data: respuesta.data })
    });
  };

  getAllSucursalData() {
    const url = `${process.env.REACT_APP_API_URL}/Sucursales/GetListado`;
    axios.get(url, { headers }).then((respuesta) => {
      this.setState({ dataSucursal: respuesta.data })
    });
  }

  getAllMunicipios() {
    const url = `${process.env.REACT_APP_API_URL}/Municipios/GetListado`;
    axios.get(url, { headers }).then((respuesta) => {
      this.setState({ dataMunicipio: respuesta.data })
    });
  }

  getAllCiudades() {
    const url = `${process.env.REACT_APP_API_URL}/Ciudades/GetListado`;
    axios.get(url, { headers }).then((respuesta) => {
      this.setState({ dataCiudad: respuesta.data })
    });
  }

  getAllCodigoPostal() {
    const url = `${process.env.REACT_APP_API_URL}/CodigoPostal/GetListado`;
    axios.get(url, { headers }).then((respuesta) => {
      console.log(respuesta.data)
      this.setState({ dataCodigoPostal: respuesta.data })
      this.getAllLocalidades(respuesta.data[0].m_nIdCP)
    });
  }

  getAllLocalidades(id) {
    const url = `${process.env.REACT_APP_API_URL}/Asentamiento/GetListadoByCodigoPostal/${id}`;
    axios.get(url, { headers }).then((respuesta) => {
      this.setState({ dataLocalidad: respuesta.data })
    });
  }

  handleSelectCodigoPostal(id) {
    this.setState({
      idCodigoPostalSeleccionado: id
    })
    this.getAllLocalidades(id)
  }


  render() {
    const { height, data, columns, edit, consult } = this.state
    return (
      <div>

        <header className="topbar clearfix">
          <Cabecera />
        </header>

        {/*Leftbar Start Here*/}
        <aside className="iconic-leftbar" style={{ minHeight: this.state.height }}>
          <BarraLateralIzquierda />
        </aside>
        {/*Leftbar End Here*/}

        {/*Page Container Start Here*/}
        <section className="main-container">

          <div className="container-fluid">

            <div className="page-header filled full-block light">
              <div className="row">
                <div className="col-md-6 col-sm-6">
                  <h2>Zonas</h2>
                </div>
                <div className="col-md-6 col-sm-6">
                  <ul className="list-page-breadcrumb">
                    <li>
                      <a href="/Catalogos" className="color-mapeo">
                        Configuración <i className="zmdi zmdi-chevron-right" />
                      </a>
                    </li>
                    <li className="active-page">Zonas</li>
                  </ul>
                </div>
              </div>
            </div>

            <ul className="nav navStatica nav-tabs">
              <li className="active">
                <a data-toggle="tab" data_id="1" href="#Listado" onClick={(event) => { event.stopPropagation(); this.setState({ pantalla: 1, edit: false, consult: false, agregar: "Agregar" }); $('.nav-tabs li ').removeClass('active'); $('.nav-tabs li').eq(0).addClass('active'); $('.tab-content div ').removeClass('in show'); $('#Listado').addClass('in show'); }}>
                  <i className="fa fa-list" /> Listado
              </a>
              </li>
              <li >
                <a data-toggle="tab" data_id="2" href="#Agregar" onClick={(event) => { event.stopPropagation(); this.setState({ pantalla: 2, edit: false, consult: false, agregar: "Agregar" }); $('.nav-tabs li ').removeClass('active'); $('.nav-tabs li').eq(1).addClass('active'); $('.tab-content div ').removeClass('in show'); $('#Agregar').addClass('in show'); }}>
                  <i className="fa fa-plus-circle" /> {this.state.agregar}
                </a>
              </li>
              {/**<button className="topbar-right pull-right">Boton</button>*/}
            </ul>

            <div className="row" className="tab-content">
              <div id="Listado" className="tab-pane fade in show">
                <div className="widget-wrap">
                  <div className="widget-content">
                    <div className="row" style={{ height: this.state.height - 250, width: '100%' }}>
                      {data.length != 0 ? (
                        <DataGrid
                          rows={data}
                          columns={columns}
                          density="compact"
                          pageSize={Math.floor((this.state.height - 310) / 30)}
                          getRowId={(row) => row.m_nIdZona}
                          onRowSelected={(row) => {
                            this.setState({

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
                {
                  this.state.pantalla == 2 &&
                  <ZonasAgregar edit={this.state.edit} select={this.state.selected} onSubmit={this.handleAceptar}></ZonasAgregar>
                }
              </div>
            </div>
          </div>

        </section>
        {/*Page Container End Here*/}

        {/*Rightbar Start Here*/}
        <aside className="rightbar">
          <BarraLateralDerecha />
        </aside>

      </div >

    );
  };

}

Zonas.propTypes = {

};
export default Zonas;