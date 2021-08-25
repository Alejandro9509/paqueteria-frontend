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
        this.handleClose = this.handleClose.bind(this)
        this.handleChange = this.handleChange.bind(this)
    }

    componentWillMount() {
    }

    componentDidMount() {

    }

    componentDidUpdate(prevProps) {

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

    render() {
        const {seleccionarTodoCodigoPostales, handleChange, editar, codigoPostalesSeleccionado, dataCodigoPostales} = this.props

        return (
            <table style={{ overflowY: "scroll", width: "100%" }}>
                <tr>
                    <th>
                        <label className="checkbox">
                            <input disabled={editar} type="checkbox" onChange={(event) => handleChange(event, 0, dataCodigoPostales, true)} checked={seleccionarTodoCodigoPostales} />
                            <i />
                        </label>
                    </th>
                    <th>Código Postales</th>
                </tr>
                {
                    dataCodigoPostales.map((i, index) => {
                        return (
                            <tr key={index} >
                                <td style={{ width: "50px" }}>
                                    <label className="checkbox">
                                        <input disabled={editar} type="checkbox"
                                            onChange={(event) => handleChange(event.target.checked, index, dataCodigoPostales, false)}
                                            checked={codigoPostalesSeleccionado.find(t => t.m_nIdCP === i.m_nIdCP) != null}
                                        />
                                        <i />
                                    </label>
                                </td>
                                <td><strong>{i.m_sCiudad} ({i.m_sCP})</strong></td>
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