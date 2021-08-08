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
        this.handleClose = this.handleClose.bind(this)
        this.handleClick = this.handleClick.bind(this)
        this.handleChange = this.handleChange.bind(this)
    }

    componentWillMount() {
    }

    componentDidUpdate(prevProps) {

    }

    componentDidMount() {

    }

    componentWillUnmount() {

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
        const {seleccionarTodoLocalidades, dataLocalidades, handleChange, consult, editar, localidadesSeleccionado} = this.props

        return (
            <table style={{ overflow: "scroll", width: "100%" }}>
                <tr>
                    <th>
                        <label className="checkbox">
                            <input disabled={consult} type="checkbox" onChange={(event) => handleChange(event, 0, dataLocalidades, true)} checked={seleccionarTodoLocalidades} />
                            <i />
                        </label>
                    </th>
                    <th>Localidad</th>
                </tr>
                {
                    dataLocalidades.map((i, index) => {
                        return (
                            <tr key={index}>
                                <td style={{ width: "50px" }}>
                                    <label className="checkbox">
                                        <input disabled={editar} type="checkbox"
                                               onChange={(event) => handleChange(event, index, dataLocalidades, false)}
                                               checked={localidadesSeleccionado.find(t => t.m_nIdLocalidad === i.m_nIdLocalidad) != null}/>
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