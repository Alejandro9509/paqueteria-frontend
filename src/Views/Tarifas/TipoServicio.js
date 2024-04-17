import React, { Component } from 'react';
import PropTypes from 'prop-types';
import axios from "axios";
import Noty from 'noty';
import { List, ListItem, Popover, TextField } from '@mui/material';
import { TrafficOutlined } from '@mui/icons-material';
import { agregarTipoServicio, obtenerTipoServicio } from '../../Util/Contexts/TipoServiciosContext';
import Button from "@mui/material/Button";

function showSuccess(mensaje) {
    new Noty({
        type: "information",
        layout: "topCenter",
        text: mensaje,
        timeout: "5000"
    }).show()
}

class TipoServicio extends Component {
    constructor(props) {
        super(props);
        this.state = {
            tiposServicio: [],
            anchorEl: null,
            Descripcion: "",
            DiasHabiles: '0',
            Costo: '0'

        }
        this.getAllTipos = this.getAllTipos.bind(this)
        this.handleClose = this.handleClose.bind(this)
        this.handleClick = this.handleClick.bind(this)
        this.handleChange = this.handleChange.bind(this)
        this.handleAceptar = this.handleAceptar.bind(this)
    }

    componentWillMount() {
        this.getAllTipos()
    }

    componentDidMount() {

    }

    getAllTipos() {
        obtenerTipoServicio().then(respuesta => {
            this.setState({ tiposServicio: respuesta.data })
        });
    }

    componentWillUnmount() {

    }

    handleChange(event) {
        this.setState({
            [event.target.name]: event.target.value
        });
    }

    handleAceptar(e) {
        e.preventDefault()
        if (this.state.Descripcion === '' || this.state.DiasHabiles === '' || this.state.Costo === ''){
            showSuccess("Todos los campos necesarios")
            return
        }
        let params = {
            "activo": 1,
            "CreadoPor": localStorage.getItem("UsuarioId"),
            "ModificadoPor": localStorage.getItem("UsuarioId"),
            "Descripcion": this.state.Descripcion,
            "DiasHabiles": this.state.DiasHabiles,
            "Costo": this.state.Costo,
        }
        console.log(params)
        agregarTipoServicio(params).then(respuesta => {
            showSuccess(respuesta.data)
            this.handleClose();
            this.getAllTipos();
        }).catch(err => {
            console.log(err)
            showSuccess(err)
        });


    }
    handleClose() {
        this.setState({ anchorEl: null });
    }
    handleClick(event) {
        this.setState({ anchorEl: event.currentTarget });
    }




    render() {
        const open = Boolean(this.state.anchorEl);
        const id = open ? 'simple-popover' : undefined;
        return (
            <table style={{ overflow: "scroll", width: "100%" }}>
                <thead>
                    <tr>
                        <th colSpan="3">
                            <h4>Tipos de Servicio</h4>
                            <button
                                style={{ float: "inherit", padding: "5px" }}
                                type="button"
                                onClick={this.handleClick}
                                className="btn btn-primary primary-btn"
                            >
                                Agregar
                            </button>
                            <Popover
                                id={id}
                                open={open}
                                anchorEl={this.state.anchorEl}
                                onClose={this.handleClose}
                                anchorOrigin={{
                                    vertical: 'bottom',
                                    horizontal: 'center',
                                }}
                                transformOrigin={{
                                    vertical: 'top',
                                    horizontal: 'center',
                                }}
                            >
                                <div style={{ padding: "10px" }} className="j-forms">
                                    <h5>Agregando Tipo de Servicio</h5>
                                    <div className="form-content">
                                        {/*****************************************Descripcion************************************************************/}
                                        <div className="col-sm-12 col-md-6 unit">
                                            <div className="input">
                                                <TextField variant="outlined" margin="dense"
                                                           label="Descripción"
                                                           onChange={this.handleChange}
                                                           className="form-control"
                                                           type="text"
                                                           maxLength="50"
                                                           required
                                                           value={this.state.Descripcion}
                                                           id="Descripcion"
                                                           name="Descripcion"
                                                />
                                            </div>
                                        </div>
                                        {/*****************************************Dias Habiles************************************************************/}
                                        <div className="col-sm-12 col-md-6 unit">
                                            <div className="input">
                                                <TextField variant="outlined" margin="dense"
                                                           label="Dias Habiles"
                                                           onChange={this.handleChange}
                                                           className="form-control"
                                                           type="number"
                                                           min="0"
                                                           step="1"
                                                           value={this.state.DiasHabiles}
                                                           id="DiasHabiles"
                                                           name="DiasHabiles"
                                                />
                                            </div>
                                        </div>

                                        {/*****************************************Costo*******************************************************/}
                                        <div className="col-sm-12 col-md-12 unit">
                                            <div className="input">
                                                <TextField variant="outlined" margin="dense" label="Costo"
                                                           onChange={this.handleChange}
                                                           className="form-control"
                                                           type="number"
                                                           min="0"
                                                           step="0.01"
                                                           required
                                                           value={this.state.Costo}
                                                           id="Costo"
                                                           name="Costo"
                                                />
                                            </div>
                                        </div>


                                    </div>
                                    <div className="col-sm-12 col-md-12 unit">
                                        <Button data-toggle="tab" className="btn btn-secondary secondary-btn"
                                            onClick={this.handleClose}
                                        >
                                            Cancelar</Button>
                                        <Button onClick={this.handleAceptar} className="btn btn-primary primary-btn">Aceptar</Button>
                                    </div>
                                </div>
                            </Popover>
                        </th>

                    </tr>
                </thead>
                <tr>
                    <th>
                        <label className="checkbox">
                            <input disabled={this.props.consult} type="checkbox" onChange={(event) => this.props.handleChange(event, 0, this.state.tiposServicio, true)} checked={this.props.all} />
                            <i />
                        </label>

                    </th>
                    <th>Código</th>
                    <th>Descripción</th>
                </tr>
                {
                    this.state.tiposServicio.map((i, index) => {
                        return (
                            <tr key={i.m_nIdTipoServicio}>
                                <td style={{ width: "50px" }}>
                                    <label className="checkbox">
                                        <input disabled={this.props.consult} type="checkbox" onChange={(event) => this.props.handleChange(event, index, this.state.tiposServicio, false)} checked={this.props.tiposServicioSeleccionado.find(t => t.m_nIdTipoServicio === i.m_nIdTipoServicio) != null} />
                                        <i />
                                    </label>
                                </td>
                                <td>{i.m_nIdTipoServicio}</td>
                                <td><strong>{i.m_sDescripcion}</strong></td>
                            </tr>

                        )
                    })
                }
            </table>
        );
    }
}

TipoServicio.propTypes = {

};

export default TipoServicio;