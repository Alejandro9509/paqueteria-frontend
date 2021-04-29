import React, { Component } from 'react';
import PropTypes from 'prop-types';
import axios from "axios";
import { Checkbox, FormControlLabel, List, ListItem, TextField } from '@material-ui/core';

const headers = {
    'Content-Type': 'application/json',
    //    'access-control-allow-origin': '*'
}

class CrearConcepto extends Component {
    constructor(props) {
        super(props);
        this.state = {
            codigo: props.edit ? props.select.m_sCodigo : "",
            concepto: props.edit ? props.select.m_sConcepto : "",
            impuestos: [],
            impuestosRetencion: [],
            impuestosSeleccionadosTraslado: [],
            predeterminadoSeleccionadosTraslado: {},
            impuestosSeleccionadosRetencion: [],
            predeterminadoSeleccionadosRetencion: {},
            activo: props.edit ? props.select.m_bActivo : false,
            incluirIngresosLiquidacion: props.edit ? props.select.m_bCalculoIngreso : false,
            incluirLiquidacionFlete: props.edit ? props.select.m_bCalculoFlete : false,
            unidadMedia: props.edit ? props.select.m_sUnidadMedida : ""
        }

        this.handleChange = this.handleChange.bind(this)
        this.getAllImpuestos = this.getAllImpuestos.bind(this)
        this.onSubmit = this.onSubmit.bind(this)
        this.handleChangeChecboxTraslado = this.handleChangeChecboxTraslado.bind(this)
        this.handleChangeChecboxTrasladoPredeterminado = this.handleChangeChecboxTrasladoPredeterminado.bind(this)
        this.handleChangeChecboxRetencion = this.handleChangeChecboxRetencion.bind(this)
        this.handleChangeChecboxRetencionPredeterminado = this.handleChangeChecboxRetencionPredeterminado.bind(this)

    }

    componentWillMount() {

    }

    componentDidMount() {
        this.getAllImpuestos()
    }

    getAllImpuestos() {
        const url = `${process.env.REACT_APP_API_URL}/Impuestos/GetListado`;
        axios.get(url, { headers }).then(respuesta => {
            this.setState({ impuestos: respuesta.data.filter(i => i.m_nTIpoCalculo === 0), impuestosRetencion: respuesta.data.filter(i => i.m_nTIpoCalculo === 1) })
        });
    };

    handleChange(event) {
        this.setState({
            [event.target.name]: event.target.value
        });
    }

    handleChangeChecboxTraslado(event, index) {
        var array = this.state.impuestosSeleccionadosTraslado
        if (event.target.checked) {
            array.push(this.state.impuestos[index])
            this.setState({
                impuestosSeleccionadosTraslado: array
            });
        } else {
            array.splice(array.indexOf(a => a.m_nIdImpuesto === this.state.impuestos[index].m_nIdImpuesto), 1)
            this.setState({
                impuestosSeleccionadosTraslado: array
            });
        }

    }
    handleChangeChecboxTrasladoPredeterminado(event, index) {
        this.setState({
            predeterminadoSeleccionadosTraslado: event.target.checked ? this.state.impuestos[index] : {}
        });
    }
    handleChangeChecboxRetencionPredeterminado(event, index) {
        this.setState({
            predeterminadoSeleccionadosRetencion: event.target.checked ? this.state.impuestosRetencion[index] : {}
        });
    }

    handleChangeChecboxRetencion(event, index) {
        var array = this.state.impuestosSeleccionadosRetencion
        if (event.target.checked) {
            array.push(this.state.impuestosRetencion[index])
            this.setState({
                impuestosSeleccionadosRetencion: array
            });
        } else {
            array.splice(array.indexOf(a => a.m_nIdImpuesto === this.state.impuestosRetencion[index].m_nIdImpuesto), 1)
            this.setState({
                impuestosSeleccionadosRetencion: array
            });
        }

    }


    onSubmit(event) {
        event.preventDefault()
        this.props.onSubmit(this.state)
    }

    componentWillUnmount() {

    }

    render() {
        const { impuestos, impuestosRetencion } = this.state
        return (
            <form className="j-forms" onSubmit={this.onSubmit}>
                <div className="form-content">
                    <div className="main-container" style={{ margin: "0px", padding: "0px" }}>
                        <div className="row" style={{ margin: "0px" }}>
                            <div className="col-sm-6 col-md-3 col-lg-3 unit" style={{ padding: "2px" }}>
                                <div className="input">
                                    <TextField variant="outlined" margin="dense"
                                        onChange={this.handleChange}
                                        className="form-control"
                                        type="text"
                                        label="Código"
                                        disabled={this.props.consult}
                                        required
                                        step="1"
                                        value={this.state.codigo}
                                        name="codigo"
                                    />
                                </div>
                            </div>
                            <div className="col-sm-6 col-md-9 col-lg-9 unit" style={{ padding: "2px" }}>

                                <div className="input">
                                    <TextField variant="outlined" margin="dense"
                                        onChange={this.handleChange}
                                        className="form-control"
                                        type="text"
                                        disabled={this.props.consult}
                                        required
                                        label="Concepto"
                                        step="2"
                                        value={this.state.concepto}
                                        name="concepto"
                                    />
                                </div>
                            </div>

                        </div>
                        <div className="row" style={{ margin: "0px" }} >
                            <div className="col-sm-12 col-md-12 col-lg-12 unit" style={{ backgroundColor: "#E6E6E6", padding: "2px" }}>
                                <label className="label" style={{ textAlign: "center", width: "100%", color: "#717171" }}>
                                    <strong>Concepto</strong>
                                </label>
                            </div>
                        </div>
                        <div className="row" style={{ margin: "0px" }}>
                            <div className="col-sm-12 col-md-6 col-lg-6 unit" style={{ padding: "2px" }}>
                                <div className="row" style={{ margin: "0px" }}>
                                    <div className="col-sm-12 col-md-12 col-lg-12 unit" style={{ backgroundColor: "#E6E6E6", backgroundClip: "content-box", padding: "2px" }}>

                                        <label className="label" style={{ textAlign: "center", width: "100%", color: "#717171", marginBottom: "0px", display: "inline-block" }}>
                                            <strong>Traslado</strong>
                                        </label>
                                    </div>
                                </div>
                                <div className="row" style={{ margin: "0px" }}>
                                    <div className="col-sm-4 col-md-4 col-lg-4 unit" style={{ backgroundColor: "#E6E6E6", padding: "2px" }}>
                                        <label className="label" style={{ textAlign: "left", width: "100%", color: "#717171", marginBottom: "0px", display: "inline-block" }}>
                                            <strong>Impuesto</strong>
                                        </label>
                                    </div>
                                    <div className="col-sm-4 col-md-4 col-lg-4 unit" style={{ backgroundColor: "#E6E6E6", padding: "2px" }}>
                                        <label className="label" style={{ textAlign: "left", width: "100%", color: "#717171", marginBottom: "0px", display: "inline-block" }}>
                                            <strong>Traslado</strong>
                                        </label>
                                    </div>
                                    <div className="col-sm-4 col-md-4 col-lg-4 unit" style={{ backgroundColor: "#E6E6E6", padding: "2px" }}>
                                        <label className="label" style={{ textAlign: "left", width: "100%", color: "#717171", marginBottom: "0px", display: "inline-block" }}>
                                            <strong>Predeterminado</strong>
                                        </label>
                                    </div>
                                </div>
                                <List style={{ maxHeight: "300px", overflow: "auto" }}>
                                    {
                                        impuestos.map((i, index) => {
                                            return (
                                                <ListItem key={i.m_nIdImpuesto} dense >
                                                    <div className="row" style={{ margin: "0px", width: "100%" }} >
                                                        <div className="col-sm-4 col-md-4 col-lg-4 unit" style={{ padding: "2px" }}>
                                                            <label className="label" style={{ textAlign: "left", width: "100%", color: "#717171", marginBottom: "0px", display: "inline-block" }}>
                                                                <strong>{i.m_sImpuesto}</strong>
                                                            </label>
                                                        </div>
                                                        <div className="col-sm-4 col-md-4 col-lg-4 unit" style={{ padding: "2px" }}>
                                                            <input disabled={this.props.consult} type="checkbox" onChange={(event) => this.handleChangeChecboxTraslado(event, index)} checked={this.state.impuestosSeleccionadosTraslado.find(t => t.m_nIdImpuesto === i.m_nIdImpuesto) != null} />
                                                        </div>
                                                        <div className="col-sm-4 col-md-4 col-lg-4 unit" style={{ padding: "2px" }}>
                                                            <input disabled={this.props.consult} type="checkbox" onChange={(event) => this.handleChangeChecboxTrasladoPredeterminado(event, index)} checked={i.m_nIdImpuesto === this.state.predeterminadoSeleccionadosTraslado.m_nIdImpuesto} />
                                                        </div>
                                                    </div>
                                                </ListItem>
                                            )
                                        })
                                    }
                                </List>
                            </div>


                            <div className="col-sm-12 col-md-6 col-lg-6 unit" style={{ padding: "2px" }}>
                                <div className="row" style={{ margin: "0px" }}>
                                    <div className="col-sm-12 col-md-12 col-lg-12 unit" style={{ backgroundColor: "#E6E6E6", backgroundClip: "content-box", padding: "2px" }}>

                                        <label className="label" style={{ textAlign: "center", width: "100%", color: "#717171", marginBottom: "0px", display: "inline-block" }}>
                                            <strong>Retención</strong>
                                        </label>
                                    </div>
                                </div>
                                <div className="row" style={{ margin: "0px" }}>
                                    <div className="col-sm-4 col-md-4 col-lg-4 unit" style={{ backgroundColor: "#E6E6E6", padding: "2px" }}>
                                        <label className="label" style={{ textAlign: "left", width: "100%", color: "#717171", marginBottom: "0px", display: "inline-block" }}>
                                            <strong>Impuesto</strong>
                                        </label>
                                    </div>
                                    <div className="col-sm-4 col-md-4 col-lg-4 unit" style={{ backgroundColor: "#E6E6E6", padding: "2px" }}>
                                        <label className="label" style={{ textAlign: "left", width: "100%", color: "#717171", marginBottom: "0px", display: "inline-block" }}>
                                            <strong>Traslado</strong>
                                        </label>
                                    </div>
                                    <div className="col-sm-4 col-md-4 col-lg-4 unit" style={{ backgroundColor: "#E6E6E6", padding: "2px" }}>
                                        <label className="label" style={{ textAlign: "left", width: "100%", color: "#717171", marginBottom: "0px", display: "inline-block" }}>
                                            <strong>Predeterminado</strong>
                                        </label>
                                    </div>
                                </div>
                                <List style={{ maxHeight: "300px", overflow: "auto" }}>
                                    {
                                        impuestosRetencion.map((i, index) => {
                                            return (
                                                <ListItem key={i.m_nIdImpuesto} dense >
                                                    <div className="row" style={{ margin: "0px", width: "100%" }} >
                                                        <div className="col-sm-4 col-md-4 col-lg-4 unit" style={{ padding: "2px" }}>
                                                            <label className="label" style={{ textAlign: "left", width: "100%", color: "#717171", marginBottom: "0px", display: "inline-block" }}>
                                                                <strong>{i.m_sImpuesto}</strong>
                                                            </label>
                                                        </div>
                                                        <div className="col-sm-4 col-md-4 col-lg-4 unit" style={{ padding: "2px" }}>
                                                            <input disabled={this.props.consult} type="checkbox" onChange={(event) => this.handleChangeChecboxRetencion(event, index)} checked={this.state.impuestosSeleccionadosRetencion.find(t => t.m_nIdImpuesto === i.m_nIdImpuesto) != null} />
                                                        </div>
                                                        <div className="col-sm-4 col-md-4 col-lg-4 unit" style={{ padding: "2px" }}>
                                                            <input disabled={this.props.consult} type="checkbox" onChange={(event) => this.handleChangeChecboxRetencionPredeterminado(event, index)} checked={i.m_nIdImpuesto === this.state.predeterminadoSeleccionadosRetencion.m_nIdImpuesto} />
                                                        </div>
                                                    </div>
                                                </ListItem>
                                            )
                                        })
                                    }
                                </List>

                            </div>
                        </div>

                        <div className="row" style={{ margin: "0px" }}>
                            <div className="col-sm-12 col-md-12 col-lg-12 unit" style={{ backgroundColor: "#E6E6E6", padding: "2px" }}>
                                <label className="label" style={{ textAlign: "center", width: "100%", color: "#717171" }}>
                                    <strong>Configuración</strong>
                                </label>
                            </div>

                        </div>
                        <div className="row" style={{ margin: "0px" }}>
                            <div className="col-sm-12 col-md-4 col-lg-4 unit" style={{ padding: "2px" }}>
                                <FormControlLabel
                                    control={<input
                                        required
                                        disabled={this.props.consult}
                                        native="true"
                                        name="activo"
                                        checked={this.state.activo}
                                        onChange={(e) => this.setState({ activo: e.target.checked })}
                                        style={{ margin: "10px" }}
                                        type="checkbox"
                                    />}
                                    label="Activo"
                                />
                            </div>
                            <div className="col-sm-12 col-md-8 col-lg-8 unit" style={{ padding: "2px" }}>
                                <FormControlLabel
                                    control={<input
                                        required
                                        native="true"
                                        disabled={this.props.consult}
                                        checked={this.state.incluirIngresosLiquidacion}
                                        onChange={(e) => this.setState({ incluirIngresosLiquidacion: e.target.checked })}
                                        name="incluirIngresosLiquidacion"
                                        style={{ margin: "10px" }}
                                        type="checkbox"
                                    />}
                                    label="Incluir en el Cálculo de los Ingresos en la Liquidación"
                                />
                            </div>
                            <div className="col-sm-12 col-md-12 col-lg-12 unit" style={{ padding: "2px" }}>
                                <FormControlLabel
                                    control={<input
                                        required
                                        native="true"
                                        disabled={this.props.consult}
                                        name="incluirLiquidacionFlete"
                                        checked={this.state.incluirLiquidacionFlete}
                                        onChange={(e) => this.setState({ incluirLiquidacionFlete: e.target.checked })}
                                        style={{ margin: "10px" }}
                                        type="checkbox"
                                    />}
                                    label="Incluir en el Cálculo de la Liquidación % Sobre Importe Flete"
                                />
                            </div>
                        </div>
                        <div className="row" style={{ margin: "0px" }}>
                            <div className="col-sm-12 col-md-12 col-lg-12 unit" style={{ backgroundColor: "#E6E6E6", padding: "2px" }}>
                                <label className="label" style={{ textAlign: "center", width: "100%", color: "#717171" }}>
                                    <strong>Sección Claves CFDI</strong>
                                </label>
                            </div>

                        </div>
                        <div className="row" style={{ margin: "0px" }}>

                            <div className="col-sm-12 col-md-12 col-lg-12 unit" style={{ padding: "2px" }}>
                                <div className="input">
                                    <TextField variant="outlined" margin="dense"
                                        type="text"
                                        disabled={this.props.consult}
                                        className="form-control"
                                        label="Unidad Medida"
                                        value={this.state.unidadMedia}
                                        onChange={this.handleChange}
                                        name="unidadMedia"
                                    />
                                </div>
                            </div>
                        </div>
                    </div>

                </div>
                {this.props.children}
            </form >
        );
    }
}

CrearConcepto.propTypes = {

};

export default CrearConcepto;