import React, { Component } from 'react';
import PropTypes from 'prop-types';
import axios from "axios";

const headers = {
  'Content-Type': 'application/json',
  //    'access-control-allow-origin': '*'
}


class Ciudad extends Component {
  constructor(props) {
    super(props);
    this.state = {
      dataCiudades: [],
      anchorEl: null,
      height: window.innerHeight,
      codigo: "",
      descripcion: ""
    }
    this.getAllCiudades = this.getAllCiudades.bind(this)
    this.handleClose = this.handleClose.bind(this)
    this.handleClick = this.handleClick.bind(this)
    this.handleChange = this.handleChange.bind(this)
  }

  componentWillMount() {
    this.getAllCiudades()
  }

  componentDidMount() {

  }

  getAllCiudades() {
    const url = `${process.env.REACT_APP_API_URL}/Ciudades/GetByEstado/29`;
    axios.get(url, { headers }).then(respuesta => {
      this.setState({ dataCiudades: respuesta.data, anchorEl: null })
    });
  }
  
  handleChange(event) {
    this.setState({
      [event.target.name]: event.target.value
    });
  }

  componentWillUnmount() {

  }

  handleClose() {
    this.setState({ anchorEl: null });
  }
  handleClick(event) {
    this.setState({ anchorEl: event.currentTarget });
  }

  render() {

    return (
      <table style={{ overflow: "scroll", width: "100%" }}>
        <thead>
          <th></th>
          <th>Ciudades</th>
        </thead>
        <tr>
          <th>
            <input disabled={this.props.consult} type="checkbox" onChange={(event) => this.props.handleChange(event, 0, this.props.dataCiudades, true)} checked={this.props.all} />
          </th>
          <th>Ciudades</th>
        </tr>
        {
          this.props.dataCiudades.map((i, index) => {
            return (
              <tr key={index} onClick={(event) => this.props.handleCiudadRowClick(event, i.m_nIdCiudad)}>
                <td style={{ width: "50px" }}>
                  <input disabled={this.props.consult} type="checkbox" onChange={(event) => this.props.handleChangeChecboxCiudad(event, index, this.props.dataCiudades, false)} checked={this.props.ciudadesSeleccionado.find(t => t.m_nIdCiudad === i.m_nIdCiudad) != null} />
                </td>
                <td><strong>{i.m_sCiudad}</strong></td>
              </tr>

            )
          })
        }
      </table>
    );
  }
}

Ciudad.propTypes = {

};

export default Ciudad;