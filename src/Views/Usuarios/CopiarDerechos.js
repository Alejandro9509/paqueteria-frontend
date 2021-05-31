import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Derechos from './Derechos';
import { FormControl, InputLabel, Select } from '@material-ui/core';
import { obtenerUsuarios } from '../../Util/Contexts/UsuarioContext';

class CopiarDerechos extends Component {
    constructor(props) {
        super(props);
        this.state = {
            usuarios: []
        }
        this.handleChange = this.handleChange.bind(this)
    }

    componentWillMount() {
        obtenerUsuarios().then(respuesta => {
            this.setState({ usuarios: respuesta.data })
        })
    }


    handleChange(event) {
        event.preventDefault()
        this.setState({
            [event.target.name]: event.target.value
        });
    }

    render() {
        return (
            <div>
                <div className="col-xs-6 col-sm-6 col-md-6 col-lg-6 unit">
                    <label className="input select">
                        <FormControl fullWidth variant="outlined" margin="dense">
                            <InputLabel id="usuarioFuenteLabel">Del Usuario</InputLabel>
                            <Select
                                labelId="usuarioFuenteLabel"
                                label="Del Usuario"
                                className="form-control"
                                required
                                value={this.state.usuarioFuente}
                                onChange={this.handleChange}
                                id="usuarioFuente"
                            >
                                {this.state.usuarios.map((usuario) => (
                                    <option
                                        key={usuario.m_nIdUsuario}
                                        value={usuario.m_nIdUsuario}
                                    >
                                        {`${usuario.m_sNombre} ${usuario.m_sAPaterno} ${usuario.m_sAMaterno}`}
                                    </option>
                                ))}
                            </Select>
                        </FormControl>
                    </label>
                </div>
                <div className="col-xs-6 col-sm-6 col-md-6 col-lg-6 unit">
                    <label className="input select">
                        <FormControl fullWidth variant="outlined" margin="dense">
                            <InputLabel id="usuarioDestinoLabel">Al Usuario</InputLabel>
                            <Select
                                labelId="usuarioDestinoLabel"
                                label="Al Usuario"
                                className="form-control"
                                required
                                value={this.state.usuarioDestino}
                                onChange={this.handleChange}
                                id="usuarioDestino"
                            >
                                {this.state.usuarios.map((usuario) => (
                                    <option
                                        key={usuario.m_nIdUsuario}
                                        value={usuario.m_nIdUsuario}
                                    >
                                        {`${usuario.m_sNombre} ${usuario.m_sAPaterno} ${usuario.m_sAMaterno}`}
                                    </option>
                                ))}
                            </Select>
                        </FormControl>
                    </label>
                </div>
                <br/>
                <Derechos></Derechos>
            </div>
        );
    }
}

CopiarDerechos.propTypes = {

};

export default CopiarDerechos;