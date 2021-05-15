import React, { Component } from 'react';
import Ciudad from './Ciudad';
import CodigoPostal from './CodigoPostal';
import Localidad from './Localidad';
import PropTypes from 'prop-types';
import axios from "axios";
import { AppBar, Box, FormControl, InputLabel, Select, Tab, Tabs, TextField, Typography } from '@material-ui/core';

const headers = {
  'Content-Type': 'application/json',
  //    'access-control-allow-origin': '*'
}

function a11yProps(index) {
  return {
    id: `simple-tab-${index}`,
    'aria-controls': `simple-tabpanel-${index}`,
  };
}
class ZonasAgregar extends Component {
  constructor(props) {
    super(props);
    this.state = {
      height: window.innerHeight,
      dataSucursal: [],
      dataCiudades: [],
      tab: 0,
      ciudadesAll: false,
      codigoPostalesAll: false,
      localidadesAll: false,
      idCiudadSeleccionado: 0,
      idCodigoPostalSeleccionado: 0,
      ciudadesSeleccionado: props.edit ? props.select.m_arrZonasCiudades : [],
      codigoPostalesSeleccionado: props.edit ? props.select.m_arrZonasCodigoPostal : [],
      localidadesSeleccionado: props.edit ? props.select.m_arrZonasLocalidades : [],
      sucursal: 0,
      folio: props.edit ? props.select.m_sFolio : "0",
      descripcion: props.edit ? props.select.m_sDescripcion : "",
      costoRecolectar: props.edit ? props.select.m_cMontoMinimo : "",
      costoEntregar: props.edit ? props.select.m_cPrecioKilo : "",
    }
    this.getAllSucursales = this.getAllSucursales.bind(this)
    this.handleChange = this.handleChange.bind(this)
    this.handleCiudadRowClick = this.handleCiudadRowClick.bind(this)
    this.handleCodigoPostalRowClick = this.handleCodigoPostalRowClick.bind(this)
    this.handleSucursalChange = this.handleSucursalChange.bind(this)
    this.getAllCiudades = this.getAllCiudades.bind(this)
    this.handleTabChange = this.handleTabChange.bind(this)
    this.handleChangeChecboxCiudad = this.handleChangeChecboxCiudad.bind(this)
    this.handleChangeChecboxCodigoPostal = this.handleChangeChecboxCodigoPostal.bind(this)
    this.onSubmit = this.onSubmit.bind(this)
  }

  componentWillMount() {
    this.getAllSucursales()
  }

  a11yProps(index) {
    return {
      id: `simple-tab-${index}`,
      'aria-controls': `simple-tabpanel-${index}`,
    };
  }

  componentDidMount() {
    this.getAllSucursales()
    this.getAllCiudades()
  }

  async getAllSucursales() {
    const url = `${process.env.REACT_APP_API_URL}/Sucursales/GetListado`;
    await axios.get(url, { headers }).then((respuesta) => {
      this.setState({ dataSucursal: respuesta.data });
    });
  }

  handleChange(event) {
    event.preventDefault()
    this.setState({
      [event.target.name]: event.target.value
    });
  }

  handleCiudadRowClick(event, id) {
    event.preventDefault()
    this.setState({
      idCiudadSeleccionado: id,
      idCodigoPostalSeleccionado: 0
    });
  }

  handleCodigoPostalRowClick(event, id) {
    event.preventDefault()
    console.log(id)
    this.setState({
      idCodigoPostalSeleccionado: id
    });
  }

  handleSucursalChange(event) {
    event.preventDefault()
    this.setState({
      sucursal: event.target.value
    });
    var idEstado = this.state.dataSucursal.find(s => s.m_nIdSucursal == event.target.value).m_nIdEstado
    const url = `${process.env.REACT_APP_API_URL}/Ciudades/GetByEstado/${idEstado}`;
    axios.get(url, { headers }).then((respuesta) => {
      this.setState({
        dataCiudades: respuesta.data,
        idCiudadSeleccionado: 0,
        idCodigoPostalSeleccionado: 0
      });
    });
  }

  getAllCiudades() {
    //const url = `${process.env.REACT_APP_API_URL}/Ciudades/GetListado`;
    //axios.get(url, { headers }).then((respuesta) => {
    //this.setState({ dataCiudades: respuesta.data });
    //});
  }

  componentWillUnmount() {

  }

  handleTabChange(event, newValue) {
    this.setState({ tab: newValue });
  }

  handleChangeChecboxCiudad(event, index, arrayCiudades, all) {
    const array = this.state.ciudadesSeleccionado
    if (all) {
      this.setState({
        ciudadesAll: true,
        ciudadesSeleccionado: arrayCiudades
      });
      return
    }
    if (event.target.checked) {
      array.push(arrayCiudades[index])
      this.setState({
        ciudadesSeleccionado: array
      });
    } else {
      array.splice(array.indexOf(a => a.m_nIdCiudad === arrayCiudades[index].m_nIdCiudad), 1)
      this.setState({
        ciudadesAll: false,
        ciudadesSeleccionado: array
      });
    }

  }

  handleChangeChecboxCodigoPostal(event, index, arrayTipos, all) {
    const array = this.state.codigoPostalesSeleccionado
    if (all) {
      this.setState({
        codigoPostalAll: true,
        codigoPostalesSeleccionado: arrayTipos
      });
      return
    }
    if (event.target.checked) {
      array.push(arrayTipos[index])
      this.setState({
        codigoPostalesSeleccionado: array
      });
    } else {
      array.splice(array.indexOf(a => a.m_nIdCP === arrayTipos[index].m_nIdCP), 1)
      this.setState({
        codigoPostalAll: false,
        codigoPostalesSeleccionado: array
      });
    }

  }

  onSubmit(event) {
    event.preventDefault()
    this.props.onSubmit(this.state)
  }

  render() {
    return (
      <form className="j-forms" onSubmit={this.onSubmit}>
        <div className="main-container" style={{ marginLeft: "0px", padding: "0px" }}>
          <div className="row">
            <div className="col-md-12 col-sm-12">
              <div className="widget-wrap">
                <div className="widget-content">
                  <div className="row">
                    <div className="col-md-12 col-sm-12">
                      <h4>Agregando Tarifas</h4>
                    </div>
                  </div>
                  <div className="row">
                    <div className="col-md-4 col-sm-12" style={{ padding: "5px" }}>

                      <div className="input">
                        <TextField variant="outlined" margin="dense"
                          onChange={this.handleChange}
                          className="form-control"
                          type="number"
                          label={<div>Folio</div>}
                          step="1"
                          value={this.state.folio}
                          name="folio"
                        />
                      </div>
                    </div>
                    <div className="col-md-4 col-sm-12" style={{ padding: "5px" }}>

                      <div className="input">
                        <TextField variant="outlined" margin="dense"
                          onChange={this.handleChange}
                          className="form-control"
                          type="text"
                          label="Descripción"
                          required
                          value={this.state.descripcion}
                          name="descripcion"
                        />
                      </div>
                    </div>
                    <div className="col-md-4 col-sm-12" style={{ padding: "5px" }}>
                      <label className="input select" style={{ width: "100%" }}>
                        <FormControl fullWidth variant="outlined" margin="dense">
                          <InputLabel id="sucursalLabel">Sucursal</InputLabel>
                          <Select
                            native
                            labelId="sucursalLabel"
                            label="Sucursal"
                            className="form-control"
                            required
                            onChange={this.handleSucursalChange}
                            value={this.state.sucursal}
                            name="sucursal"
                            id="sucursal"
                          >
                            <option
                              key={"0"}
                              value={"0"}
                            >
                              Seleccionar
                            </option>
                            {this.state.dataSucursal.map((sucursal) => (
                              <option
                                key={sucursal.m_nIdSucursal}
                                value={sucursal.m_nIdSucursal}
                              >
                                {sucursal.m_sSucursal}
                              </option>
                            ))}
                          </Select>
                        </FormControl>
                      </label>
                    </div>

                    <div className="col-md-4 col-sm-12" style={{ height: this.state.height - 375, overflowY: "auto", padding: "5px" }}>
                      {this.state.sucursal != 0 ?
                        <Ciudad
                          dataCiudades={this.state.dataCiudades}
                          ciudadesSeleccionado={this.state.ciudadesSeleccionado}
                          handleChangeChecboxCiudad={this.handleChangeChecboxCiudad}
                          handleCiudadRowClick={this.handleCiudadRowClick}
                          all={this.state.ciudadesAll}
                        >
                        </Ciudad>
                        :
                        <div></div>

                      }

                    </div>

                    <div className="col-md-4 col-sm-12" style={{ height: this.state.height - 375, overflowY: "auto", padding: "5px" }}>
                      {this.state.idCiudadSeleccionado != 0 ?
                        <CodigoPostal
                          idCiudadSeleccionado={this.state.idCiudadSeleccionado}
                          codigoPostalesSeleccionado={this.state.codigoPostalesSeleccionado}
                          handleChange={this.handleChangeChecboxEstado}
                          handleCodigoPostalRowClick={this.handleCodigoPostalRowClick}
                          all={this.state.codigoPostalesAll}
                        >
                        </CodigoPostal>
                        :
                        <div></div>
                      }
                    </div>

                    <div className="col-md-4 col-sm-12" style={{ height: this.state.height - 375, overflowY: "auto", padding: "5px" }}>
                      {this.state.idCodigoPostalSeleccionado != 0 ?
                        <Localidad
                          localidadesSeleccionado={this.state.localidadesSeleccionado}
                          idCodigoPostalSeleccionado={this.state.idCodigoPostalSeleccionado}
                          handleChange={this.handleChangeChecboxEstado}
                          all={this.state.localidadesAll}
                        >
                        </Localidad>
                        :
                        <div></div>

                      }

                    </div>

                    <div style={{ float: "right", marginRight: "0px" }}>
                    </div>

                    <div className="col-md-12 col-sm-12" style={{ padding: "5px", display: "inline-flex" }}>
                      <div className="form-footer " className="col-md-12" style={{ padding: "10px" }}>

                        <div className="col-md-2 col-sm-2" style={{ float: "right", padding: "5px" }}>

                          <div className="input">
                            <TextField variant="outlined" margin="dense"
                              onChange={this.handleChange}
                              className="form-control"
                              type="number"
                              required
                              label="Costo Recolectar"
                              step="0.01"
                              value={this.state.costoRecolectar}
                              name="costoRecolectar"
                            />
                          </div>
                        </div>
                        <div className="col-md-2 col-sm-2" style={{ float: "right", padding: "5px" }}>

                          <div className="input">
                            <TextField variant="outlined" margin="dense"
                              onChange={this.handleChange}
                              className="form-control"
                              type="number"
                              label="Costo Entregar"
                              required
                              step="0.01"
                              value={this.state.costoEntregar}
                              name="costoEntregar"
                            />
                          </div>
                        </div>

                        <div className="col-md-12 col-sm-12">
                        </div>

                        <button
                          type="button"
                          className="btn btn-secondary secondary-btn"
                          role="tab" data-toggle="tab"
                          href="#Listado"
                        >
                          Cancelar
                                    </button>
                        <button
                          type="submit"
                          className="btn btn-primary primary-btn"
                        >
                          Aceptar
                                    </button>
                      </div>
                    </div>
                  </div>

                </div>
              </div>
            </div>
          </div>
        </div>
      </form>
    );
  }
}

ZonasAgregar.propTypes = {

};

export default ZonasAgregar;
