import React, { Component } from 'react';
import PropTypes from 'prop-types';
import axios from "axios";

const headers = {
    'Content-Type': 'application/json',
    //    'access-control-allow-origin': '*'
}

class Localidad extends Component {
    constructor(props) {
        super(props);
        this.state = {
            dataLocalidades: [],
            anchorEl: null,
            height: window.innerHeight,
            codigo: "",
            descripcion: ""
        }
        this.getAllLocalidades = this.getAllLocalidades.bind(this)
        this.handleClose = this.handleClose.bind(this)
        this.handleClick = this.handleClick.bind(this)
        this.handleChange = this.handleChange.bind(this)
    }

    componentWillMount() {
        this.getAllLocalidades()
    }

    componentDidUpdate(prevProps) {
        if (this.props.idCodigoPostalSeleccionado != prevProps.idCodigoPostalSeleccionado) // Check if it's a new user, you can also use some unique property, like the ID  (this.props.user.id !== prevProps.user.id)
        {
            this.getAllLocalidades();
        }
    }

    componentDidMount() {

    }

    componentWillUnmount() {

    }

    getAllLocalidades() {
        const url = `${process.env.REACT_APP_API_URL}/Asentamiento/GetListadoByCodigoPostal/${this.props.idCodigoPostalSeleccionado}`;
        axios.get(url, { headers }).then(respuesta => {
            this.setState({ dataLocalidades: respuesta.data, anchorEl: null })
        });
    }

    handleChange(event) {
        this.setState({
            [event.target.name]: event.target.value
        });
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
                <tr>
                    <th>
                        <label className="checkbox">
                            <input disabled={this.props.consult} type="checkbox" onChange={(event) => this.props.handleChange(event, 0, this.state.dataLocalidades, true)} checked={this.props.all} />
                            <i />
                        </label>
                    </th>
                    <th>Localidad</th>
                </tr>
                {
                    this.state.dataLocalidades.map((i, index) => {
                        return (
                            <tr key={index}>
                                <td style={{ width: "50px" }}>
                                    <label className="checkbox">
                                        <input disabled={this.props.consult} type="checkbox" onChange={(event) => this.props.handleChange(event, index, this.state.dataLocalidades, false)} checked={this.props.localidadesSeleccionado.find(t => t.m_nIdLocalidad === i.m_nIdLocalidad) != null} />
                                        <i />
                                    </label>
                                </td>
                                <td><strong>{i.m_sLocalidad}</strong></td>
                            </tr>

                        )
                    })
                }
            </table>
        );
    }
}

Localidad.propTypes = {

};

export default Localidad;