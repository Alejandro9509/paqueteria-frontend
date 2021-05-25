import React, { Component } from 'react';
import PropTypes from 'prop-types';
import axios from "axios";
import { obtenerCodigoPostalCiudad } from '../../Util/Contexts/CodigoPostalContext';

const headers = {
    'Content-Type': 'application/json',
    //    'access-control-allow-origin': '*'
}

class CodigoPostal extends Component {
    constructor(props) {
        super(props);
        this.state = {
            dataCodigoPostales: [],
            anchorEl: null,
            height: window.innerHeight,
            codigo: "",
            descripcion: ""
        }
        this.getAllCodigoPostales = this.getAllCodigoPostales.bind(this)
        this.handleClose = this.handleClose.bind(this)
        this.handleChange = this.handleChange.bind(this)
    }

    componentWillMount() {
        this.getAllCodigoPostales()
    }

    componentDidMount() {

    }

    componentDidUpdate(prevProps) {
        console.log(this.props.codigoPostalesSeleccionado)
        if (this.props.idCiudadSeleccionado != prevProps.idCiudadSeleccionado) // Check if it's a new user, you can also use some unique property, like the ID  (this.props.user.id !== prevProps.user.id)
        {
            this.getAllCodigoPostales();
        }
    }

    componentWillUnmount() {

    }

    getAllCodigoPostales() {
        obtenerCodigoPostalCiudad(this.props.idCiudadSeleccionado).then(respuesta => {
            this.setState({ dataCodigoPostales: respuesta.data, anchorEl: null })
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

    render() {

        return (
            <table style={{ overflowY: "scroll", width: "100%" }}>
                <tr>
                    <th>
                        <label className="checkbox">
                            <input disabled={this.props.consult} type="checkbox" onChange={(event) => this.props.handleChange(event, 0, this.state.dataCodigoPostales, true)} checked={this.props.all} />
                            <i />
                        </label>
                    </th>
                    <th>Código Postales</th>
                </tr>
                {
                    this.state.dataCodigoPostales.map((i, index) => {
                        return (
                            <tr key={index} >
                                <td style={{ width: "50px" }}>
                                    <label className="checkbox">
                                        <input disabled={this.props.consult} type="checkbox"
                                            onChange={(event) => this.props.handleChange(event, index, this.state.dataCodigoPostales, false)}
                                            checked={this.props.codigoPostalesSeleccionado.find(t => t.m_nIdCP === i.m_nIdCP) != null}
                                        />
                                        <i />
                                    </label>
                                </td>
                                <td><strong>{i.m_sCP}</strong></td>
                            </tr>

                        )
                    })
                }
            </table>
        );
    }
}

CodigoPostal.propTypes = {

};

export default CodigoPostal;