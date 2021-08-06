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
      idCodigoPostalSeleccionado: 0,
      DerechoBorrar: 58,
      CreadoPor: localStorage.getItem("UsuarioId"),
      ModificadoPor: localStorage.getItem("UsuarioId"),
      height: window.innerHeight,
      selected: {},
      edit: true,
      consult: false,
      data: [],
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
          field: "m_sCreadoEl",
          width: 200,
        },
        {
          headerName: "Creado Por",
          field: "m_sCreadoPor",
          width: 125,
        },
        {
          headerName: "Modificado El",
          field: "m_sModificadoEl",
          width: 200,
        },
        {
          headerName: "Modificado Por",
          field: "m_sModificadoPor",
          width: 150,
        }

      ],

    }
    this.getAllData = this.getAllData.bind(this)
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
  }

  componentWillUnmount() {

  }

  handleAceptar(data) {
    console.log(data)
    var params = {
      "m_nIdZona": this.state.idZona,
      "m_nFolio": data.folio,
      "m_sDescripcion": data.descripcion,
      "m_nIdSucursal": data.sucursal,
      "m_cyCostoRecolectar": data.costoRecolectar,
      "m_cyCostoEntregar": data.costoEntregar,

      "m_nCreadoPor": localStorage.getItem("UsuarioId"),
      "m_nModificadoPor": localStorage.getItem("UsuarioId"),

      "m_arrZonasCiudades": data.ciudadesSeleccionado,
      "m_arrZonasCodigoPostales": data.codigoPostalesSeleccionado,
      "m_arrZonasLocalidades": data.localidadesSeleccionado
    }
    console.log(JSON.stringify(params))
    if (this.state.idZona !== 0) {
      const url = `${process.env.REACT_APP_API_URL}/Zonas/Modificar/` + this.state.idZona;
      axios.put(url, Object.assign({}, params), { headers }).then(respuesta => {
        showSuccess(respuesta.data)
        this.getAllData()
      }).catch(err => {
        console.log(err)
        showSuccess("err")
      });
    } else {
      const url = `${process.env.REACT_APP_API_URL}/Zonas/Agregar`;
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

      const url = `${process.env.REACT_APP_API_URL}/Zonas/Eliminar/` + id + `/${this.state.CreadoPor}`;
      axios.delete(url, { headers }).then(respuesta => {
        showSuccess(respuesta.data)
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
    const url = `${process.env.REACT_APP_API_URL}/Zonas/GetById/` + id;
    axios.get(url, { headers }).then(respuesta => {
      console.log(respuesta.data)
      this.setState({
        pantalla: 2,
        agregar: "Modificar",
        showPopUp: true,
        edit: true,
        consult: false,
        selected: respuesta.data
      })
    });
  }

  handleShowConsultar(id) {
    $('.nav-tabs li ').removeClass('active');
    $('.nav-tabs li').eq(1).addClass('active');
    $('.tab-content div ').removeClass('in show');
    $('#Agregar').addClass('in show');
    const url = `${process.env.REACT_APP_API_URL}/Zonas/GetById/` + id;
    axios.get(url, { headers }).then(respuesta => {
      console.log(respuesta.data)
      this.setState({
        pantalla: 2,
        agregar: "Consultar",
        showPopUp: true,
        edit: true,
        consult: true,
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

  render() {
    const { height, data, columns, edit, consult } = this.state
    return (
      <div>

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
        <aside className="iconic-leftbar" style={{ minHeight: this.state.height }}>
          <BarraLateralIzquierda />
        </aside>
        {/*Leftbar End Here*/}

        {/*Page Container Start Here*/}
        <section className="main-container">

          <div className="container-fluid">

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
                  this.state.pantalla === 2 &&
                  <ZonasAgregar edit={this.state.edit} consult={this.state.consult} select={this.state.selected} onSubmit={this.handleAceptar}></ZonasAgregar>
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