import React, { Component } from 'react';
import PropTypes from 'prop-types';
import axios from "axios";
import { FormControl, InputLabel, List, ListItem, Select } from '@material-ui/core';
import "../../App.css";



class Embarques extends Component {
    constructor(props) {
        super(props);
        this.state = {
        }
        this.handleChange = this.handleChange.bind(this)
    }

    componentWillMount() {
    }


    handleChange(event) {
        this.setState({
            [event.target.name]: event.target.value,
        });
    }

    render() {
        return (
            <div className="widget-wrap j-forms">
                <div className="widget-content">
                    <div className="row" >
                        <div className="col-md-6 col-sm-6">
                        <div className="col-sm-12 col-md-12 unit" style={{ padding: "5px" }}>
                                <h4>Estatus al documentar la orden c/Recolecta</h4>

                                <div className="input select">
                                    <FormControl fullWidth variant="outlined" margin="dense">
                                        <InputLabel id="documentacionEstatusLabel">Estatus de orden</InputLabel>
                                        <Select
                                            labelId="documentacionEstatusLabel"
                                            label="Estatus de orden"
                                            onChange={this.handleChange}
                                            className="form-control"
                                            value={this.state.documentacionEstatus}
                                            required
                                            margin="dense"
                                            name="documentacionEstatus"
                                            id="documentacionEstatus"
                                        >
                                            <option value="1">Nacional</option>
                                            <option value="2">Extranjero</option>
                                        </Select>
                                    </FormControl>
                                </div>
                            </div>
                            <div className="col-sm-12 col-md-12 unit" style={{ padding: "5px" }}>
                                <h4>Estatus al documentar la orden s/Recolecta</h4>

                                <div className="input select">
                                    <FormControl fullWidth variant="outlined" margin="dense">
                                        <InputLabel id="estatusRemolque1Label">Estatus de Unidades</InputLabel>
                                        <Select
                                            labelId="estatusRemolque1Label"
                                            label="Estatus de orden"
                                            onChange={this.handleChange}
                                            className="form-control"
                                            value={this.state.estatusRemolque1}
                                            required
                                            margin="dense"
                                            name="estatusRemolque1"
                                            id="estatusRemolque1"
                                        >
                                            <option value="1">Nacional</option>
                                            <option value="2">Extranjero</option>
                                        </Select>
                                    </FormControl>
                                </div>
                            </div>
                            <div className="col-sm-12 col-md-12 unit" style={{ padding: "5px" }}>
                                <h4 >Definir estatus al documentar la orden c/Entrega</h4>

                                <div className="input select">
                                    <FormControl fullWidth variant="outlined" margin="dense">
                                        <InputLabel id="estatusSalidaLabel">Estatus de Viaje</InputLabel>
                                        <Select
                                            labelId="estatusSalidaLabel"
                                            label="Estatus de orden"
                                            onChange={this.handleChange}
                                            className="form-control"
                                            value={this.state.estatusSalida}
                                            required
                                            margin="dense"
                                            name="estatusSalida"
                                            id="estatusSalida"
                                        >
                                            <option value="1">Nacional</option>
                                            <option value="2">Extranjero</option>
                                        </Select>
                                    </FormControl>
                                </div>
                            </div>
                            <div className="col-sm-12 col-md-12 unit" style={{ padding: "5px" }}>
                                <h4 >Definir estatus al documentar la orden s/Entrega</h4>

                                <div className="input select">
                                    <FormControl fullWidth variant="outlined" margin="dense">
                                        <InputLabel id="estatusRemolque2Label">Estatus de Unidades</InputLabel>
                                        <Select
                                            labelId="estatusRemolque2Label"
                                            label="Estatus de orden"
                                            onChange={this.handleChange}
                                            className="form-control"
                                            value={this.state.estatusRemolque2}
                                            required
                                            margin="dense"
                                            name="estatusRemolque2"
                                            id="estatusRemolque2"
                                        >
                                            <option value="1">Nacional</option>
                                            <option value="2">Extranjero</option>
                                        </Select>
                                    </FormControl>
                                </div>
                            </div>
                            <div className="col-sm-12 col-md-12 unit" style={{ padding: "5px" }}>
                                <h4>Definir estatus al cancelar un embarque</h4>

                                <div className="input select">
                                    <FormControl fullWidth variant="outlined" margin="dense">
                                        <InputLabel id="estatusLlegadaLabel">Estatus de Viaje</InputLabel>
                                        <Select
                                            labelId="estatusLlegadaLabel"
                                            label="Estatus de orden"
                                            onChange={this.handleChange}
                                            className="form-control"
                                            value={this.state.estatusLlegada}
                                            required
                                            margin="dense"
                                            name="estatusLlegada"
                                            id="estatusLlegada"
                                        >
                                            <option value="1">Nacional</option>
                                            <option value="2">Extranjero</option>
                                        </Select>
                                    </FormControl>
                                </div>
                            </div>
                            <div className="col-sm-12 col-md-12 unit" style={{ padding: "5px" }}>
                                <h4>Cantidad de Impresiones de Formato de Orden de Embarque</h4>

                                <div className="input select">
                                    <FormControl  variant="outlined" margin="dense">
                                        <InputLabel id="impresionesEtiquetaLabel"></InputLabel>
                                        <Select
                                            labelId="impresionesEtiquetaLabel"
                                            label=""
                                            onChange={this.handleChange}
                                            className="form-control"
                                            value={this.state.impresionesEtiqueta}
                                            required
                                            margin="dense"
                                            name="impresionesEtiqueta"
                                            id="impresionesEtiqueta"
                                        >
                                            <option value="1">1</option>
                                            <option value="2">2</option>
                                            <option value="3">3</option>
                                            <option value="4">4</option>
                                        </Select>
                                    </FormControl>
                                </div>
                            </div>
                            
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

Embarques.propTypes = {

};

export default Embarques;