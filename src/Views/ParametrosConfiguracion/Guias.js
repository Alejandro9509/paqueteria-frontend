import React, { Component } from 'react';
import PropTypes from 'prop-types';
import axios from "axios";
import { FormControl, InputLabel, List, ListItem, Select } from '@material-ui/core';
import "../../App.css";
import { obtenerConceptosFacturacion } from '../../Util/Contexts/ConceptosFacturacionContext';


class Guias extends Component {
    constructor(props) {
        super(props);
        this.state = {
            conceptos: []
        }
        this.handleChange = this.handleChange.bind(this)
        this.getAllConceptos = this.getAllConceptos.bind(this)
    }

    componentWillMount() {
        this.getAllConceptos()
    }

    getAllConceptos() {
        obtenerConceptosFacturacion().then(respuesta => {
            this.setState({ conceptos: respuesta.data })
        });
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
                                   this.state.conceptos.map((i, index) => {
                                        return (
                                            <ListItem key={index} dense >
                                                <div className="row" style={{ margin: "0px", width: "100%" }} >
                                                    <div className="col-sm-10 col-md-10 col-lg-10 unit" style={{ padding: "2px" }}>
                                                        <label className="label" style={{ textAlign: "left", width: "100%", color: "#717171", marginBottom: "0px", display: "inline-block" }}>
                                                            <strong>{i.m_sConcepto}</strong>
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
                            <div className="col-sm-12 col-md-12 unit" style={{ padding: "5px" }}>
                                <h4>Cantidad de Impresiones de Formato de Guías</h4>

                                <div className="input select">
                                    <FormControl  variant="outlined" margin="dense">
                                        <InputLabel id="impresionGuiaLabel"></InputLabel>
                                        <Select
                                            labelId="impresionGuiaLabel"
                                            label=""
                                            onChange={this.handleChange}
                                            className="form-control"
                                            value={this.state.impresionGuia}
                                            required
                                            margin="dense"
                                            name="impresionGuia"
                                            id="impresionGuia"
                                        >
                                            <option value="1">1</option>
                                            <option value="2">2</option>
                                            <option value="3">3</option>
                                            <option value="4">4</option>
                                        </Select>
                                    </FormControl>
                                </div>
                            </div>
                            <div className="col-sm-12 col-md-12 unit" style={{ padding: "5px" }}>
                                <h4>Cantidad de Impresiones de Formato de Etiqueta</h4>

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

Guias.propTypes = {

};

export default Guias;