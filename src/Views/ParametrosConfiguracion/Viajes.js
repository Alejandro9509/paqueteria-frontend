import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { FormControl, InputLabel, List, ListItem, Select } from '@material-ui/core';
import "../../App.css";

class Viajes extends Component {
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
                        <div className="col-md-6 col-sm-6 col-xs-12" >
                            <List style={{ minHeight: "400px", overflow: "auto" }}>
                                {
                                    ["Controlar el inventario de equipo", "No mostrar unidades en mantenimiento al documentar viajes", "Permitir documentar viajes con licencias vencidas", "Permitir documentar viajes con placas vencidas", "Permitir documentar viajes con seguros vencidos", "Permitir documentar viajes con pasaportes vencidos", "Permitir documentar viajes cuando rebase el límite de crédito del cliente", "Registrar automáticamente unidades rentadas", "Editar el odómetro de Unidad y Remolque desde la opción de salida"].map((i, index) => {
                                        return (
                                            <ListItem key={index} dense >
                                                <div className="row" style={{ margin: "0px", width: "100%" }} >
                                                    <div className="col-sm-10 col-md-10 col-lg-10 unit" style={{ padding: "2px" }}>
                                                        <label className="label" style={{ textAlign: "left", width: "100%", color: "#717171", marginBottom: "0px", display: "inline-block" }}>
                                                            <strong>{i}</strong>
                                                        </label>
                                                    </div>
                                                    <div className="col-sm-2 col-md-2 col-lg-2 unit" style={{ padding: "2px" }}>
                                                        <label className="checkbox">
                                                            <input type="checkbox" />
                                                            <i/>
                                                        </label>

                                                    </div>
                                                </div>
                                            </ListItem>
                                        )
                                    })
                                }
                            </List>
                        </div>
                        <div className="col-md-6 col-sm-6">
                            <div className="col-sm-12 col-md-6 unit" style={{ padding: "5px" }}>
                                <h4>Estatus para documentación de viajes</h4>

                                <div className="input select">
                                    <FormControl fullWidth variant="outlined" margin="dense">
                                        <InputLabel id="documentacionEstatusLabel">Estatus de Viaje</InputLabel>
                                        <Select
                                            labelId="documentacionEstatusLabel"
                                            label="Estatus de Viaje"
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
                            <div className="col-sm-12 col-md-6 unit" style={{ padding: "5px" }}>
                                <h4>Estatus para el remolque1 al dar llegada</h4>

                                <div className="input select">
                                    <FormControl fullWidth variant="outlined" margin="dense">
                                        <InputLabel id="estatusRemolque1Label">Estatus de Unidades</InputLabel>
                                        <Select
                                            labelId="estatusRemolque1Label"
                                            label="Estatus de Unidades"
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
                            <div className="col-sm-12 col-md-6 unit" style={{ padding: "5px" }}>
                                <h4 >Estatus para dar salida al viaje</h4>

                                <div className="input select">
                                    <FormControl fullWidth variant="outlined" margin="dense">
                                        <InputLabel id="estatusSalidaLabel">Estatus de Viaje</InputLabel>
                                        <Select
                                            labelId="estatusSalidaLabel"
                                            label="Estatus de Viaje"
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
                            <div className="col-sm-12 col-md-6 unit" style={{ padding: "5px" }}>
                                <h4 >Estatus para el remolque2 al dar llegada</h4>

                                <div className="input select">
                                    <FormControl fullWidth variant="outlined" margin="dense">
                                        <InputLabel id="estatusRemolque2Label">Estatus de Unidades</InputLabel>
                                        <Select
                                            labelId="estatusRemolque2Label"
                                            label="Estatus de Unidades"
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
                            <div className="col-sm-12 col-md-6 unit" style={{ padding: "5px" }}>
                                <h4>Estatus para dar llegada al viaje</h4>

                                <div className="input select">
                                    <FormControl fullWidth variant="outlined" margin="dense">
                                        <InputLabel id="estatusLlegadaLabel">Estatus de Viaje</InputLabel>
                                        <Select
                                            labelId="estatusLlegadaLabel"
                                            label="Estatus de Viaje"
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
                            <div className="col-sm-12 col-md-6 unit" style={{ padding: "5px" }}>
                                <h4>Estatus para la unidad al dar llegada</h4>
                                <div className="input select">
                                    <FormControl fullWidth variant="outlined" margin="dense">
                                        <InputLabel id="estatusUnidadLabel">Estatus de Unidades</InputLabel>
                                        <Select
                                            labelId="estatusUnidadLabel"
                                            label="Estatus de Unidades"
                                            onChange={this.handleChange}
                                            className="form-control"
                                            value={this.state.estatusUnidad}
                                            required
                                            margin="dense"
                                            name="estatusUnidad"
                                            id="estatusUnidad"
                                        >
                                            <option value="1">Nacional</option>
                                            <option value="2">Extranjero</option>
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

Viajes.propTypes = {

};

export default Viajes;