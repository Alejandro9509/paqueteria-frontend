import React, { Component } from 'react';
import PropTypes from 'prop-types';
import axios from "axios";
import { Checkbox, FormControlLabel, List, ListItem, TextField } from '@material-ui/core';
import { Button, Dialog, DialogActions, DialogContent, DialogTitle, Tooltip } from '@material-ui/core';
import ClavesCFDI from './ClavesCFDI';
import { obtenerImpuestos } from '../../Util/Contexts/ImpuestosContext';
import { obtenerSAT } from '../../Util/Contexts/ConceptosFacturacionContext';

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
            unidadMedida: props.edit ? props.select.m_sUnidadMedida : "",
            openDialog: false,
            claseSeleccionado: {},
            claveSAT: this.props.edit ? this.props.select.m_nIdProdServSAT : 0,
            productoOServicio: this.props.edit ? this.props.select.m_sClase : "",
            dataSAT: [],
            impuestos: [],
            impuestosRetencion: [],
            rangoMinimo: props.edit ? props.select.m_nRangoMinimo : 0,
            rangoMaximo: props.edit ? props.select.m_nRangoMaximo : 0,
            impuestosSeleccionadosTraslado: props.edit ? props.select.arClsDetalle : [],
            predeterminadoSeleccionadosTraslado: {},
            impuestosSeleccionadosRetencion: props.edit ? props.select.arClsDetalle : [],
            predeterminadoSeleccionadosRetencion: {},
            activo: props.edit ? props.select.m_bActivo : false,
            incluirIngresosLiquidacion: props.edit ? props.select.m_bCalculoIngreso : false,
            incluirLiquidacionFlete: props.edit ? props.select.m_bCalculoFlete : false,
            unidadMedia: props.edit ? props.select.m_sUnidadMedida : ""
        }

        this.handleChange = this.handleChange.bind(this)
        this.getAllImpuestos = this.getAllImpuestos.bind(this)
        this.getAllSAT = this.getAllSAT.bind(this)
        this.onSubmit = this.onSubmit.bind(this)
        this.handleChangeChecboxTraslado = this.handleChangeChecboxTraslado.bind(this)
        this.handleChangeChecboxTrasladoPredeterminado = this.handleChangeChecboxTrasladoPredeterminado.bind(this)
        this.handleChangeChecboxRetencion = this.handleChangeChecboxRetencion.bind(this)
        this.handleChangeChecboxRetencionPredeterminado = this.handleChangeChecboxRetencionPredeterminado.bind(this)
        this.selectClase = this.selectClase.bind(this)
        this.closeDialog = this.closeDialog.bind(this)
        this.getClase = this.getClase.bind(this)
    }

    componentDidMount() {
        this.getAllImpuestos()
        this.getAllSAT()
    }

    getAllImpuestos() {
        obtenerImpuestos().then(respuesta => {
            this.setState({ impuestos: respuesta.data.filter(i => i.m_nTIpoCalculo === 0), impuestosRetencion: respuesta.data.filter(i => i.m_nTIpoCalculo === 1) })
        });
    };

    getAllSAT() {
        obtenerSAT().then(respuesta => {
            this.setState({ dataSAT: respuesta.data })
        })
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
            array.splice(array.findIndex(a => a.m_nIdImpuesto === this.state.impuestos[index].m_nIdImpuesto), 1)
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
            array.splice(array.findIndex(a => a.m_nIdImpuesto === this.state.impuestosRetencion[index].m_nIdImpuesto), 1)
            this.setState({
                impuestosSeleccionadosRetencion: array
            });
        }

    }

    onSubmit(event) {
        event.preventDefault()
        this.props.onSubmit(this.state)
    }

    selectClase(row) {
        console.log(row)
        this.setState({
            claseSeleccionado: row.data,
            claveSAT: row.data.m_nClaveClase,
            productoOServicio: row.data.m_sClase
        })
    }

    closeDialog() {
        this.setState({ openDialog: false })
    }

    getClase(){
        if(this.state.dataSAT.find(producto => producto.m_nClaveClase == this.props.select.m_nIdProdServSAT) != undefined){
            return this.state.dataSAT.find(producto => producto.m_nClaveClase == this.props.select.m_nIdProdServSAT).m_sClase
        } 
    }

    render() {
        const { impuestos, impuestosRetencion, openDialog } = this.state
        return (
            <form className="j-forms" onSubmit={this.onSubmit}>
                <Dialog open={openDialog} fullWidth maxWidth="lg" onClose={() => this.setState({ openDialog: false })}>
                    <DialogTitle>Claves Productos y Servicios</DialogTitle>
                    <DialogContent>
                        <ClavesCFDI selectClase={this.selectClase} closeDialog={this.closeDialog} dataSAT={this.state.dataSAT}>
                        </ClavesCFDI>
                    </DialogContent>
                </Dialog>

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
                                                            <label className="checkbox">
                                                                <input disabled={this.props.consult} type="checkbox" onChange={(event) => this.handleChangeChecboxTraslado(event, index)} checked={this.state.impuestosSeleccionadosTraslado.find(t => t.m_nIdImpuesto === i.m_nIdImpuesto) != null} />
                                                                <i />
                                                            </label>
                                                        </div>
                                                        <div className="col-sm-4 col-md-4 col-lg-4 unit" style={{ padding: "2px" }}>
                                                            <label className="checkbox">
                                                                <input disabled={this.props.consult} type="checkbox" onChange={(event) => this.handleChangeChecboxTrasladoPredeterminado(event, index)} checked={i.m_nIdImpuesto === this.state.predeterminadoSeleccionadosTraslado.m_nIdImpuesto} />
                                                                <i />
                                                            </label>
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
                                                            <label className="checkbox">
                                                                <input disabled={this.props.consult} type="checkbox" onChange={(event) => this.handleChangeChecboxRetencion(event, index)} checked={this.state.impuestosSeleccionadosRetencion.find(t => t.m_nIdImpuesto === i.m_nIdImpuesto) != null} />
                                                                <i />
                                                            </label>
                                                        </div>
                                                        <div className="col-sm-4 col-md-4 col-lg-4 unit" style={{ padding: "2px" }}>
                                                            <label className="checkbox">
                                                                <input disabled={this.props.consult} type="checkbox" onChange={(event) => this.handleChangeChecboxRetencionPredeterminado(event, index)} checked={i.m_nIdImpuesto === this.state.predeterminadoSeleccionadosRetencion.m_nIdImpuesto} />
                                                                <i />
                                                            </label>
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
                                <label className="checkbox">
                                    <input

                                        disabled={this.props.consult}
                                        native="true"
                                        name="activo"
                                        checked={this.state.activo}
                                        onChange={(e) => this.setState({ activo: e.target.checked })}
                                        style={{ margin: "10px" }}
                                        type="checkbox"
                                    />
                                    <i />
                                    Activo
                                </label>

                            </div>
                            <div className="col-sm-12 col-md-8 col-lg-8 unit" style={{ padding: "2px" }}>
                                <label className="checkbox">
                                    <input

                                        native="true"
                                        disabled={this.props.consult}
                                        checked={this.state.incluirIngresosLiquidacion}
                                        onChange={(e) => this.setState({ incluirIngresosLiquidacion: e.target.checked })}
                                        name="incluirIngresosLiquidacion"
                                        style={{ margin: "10px" }}
                                        type="checkbox"
                                    />

                                    <i />
                                    Incluir en el Cálculo de los Ingresos en la Liquidación
                                </label>

                            </div>
                            <div className="col-sm-12 col-md-12 col-lg-12 unit" style={{ padding: "2px" }}>
                                <label className="checkbox">
                                    <input

                                        native="true"
                                        disabled={this.props.consult}
                                        name="incluirLiquidacionFlete"
                                        checked={this.state.incluirLiquidacionFlete}
                                        onChange={(e) => this.setState({ incluirLiquidacionFlete: e.target.checked })}
                                        style={{ margin: "10px" }}
                                        type="checkbox"
                                    />
                                    <i />
                                    Incluir en el Cálculo de la Liquidación % Sobre Importe Flete
                                    </label>

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

                            <div className="col-sm-3 col-md-3 col-lg-3 unit" style={{ padding: "2px" }}>
                                <div className="input">
                                    <TextField variant="outlined" margin="dense"
                                        type="text"
                                        className="form-control"
                                        label="Clave SAT"
                                        disabled={this.props.consult}
                                        value={this.state.claveSAT}
                                        onChange={this.handleChange}
                                        name="unidadMedia"
                                        InputProps={{
                                            readOnly: true,
                                        }}
                                    />
                                </div>
                            </div>

                            <div className="col-sm-8 col-md-8 col-lg-8 unit" style={{ padding: "2px" }}>
                                <div className="input">
                                    <TextField variant="outlined" margin="dense"
                                        type="text"
                                        className="form-control"
                                        label="Producto o Servicio"
                                        disabled={this.props.consult}
                                        value={this.state.productoOServicio}
                                        onChange={this.handleChange}
                                        name="unidadMedia"
                                        InputProps={{
                                            readOnly: true,
                                        }}
                                    />
                                </div>
                            </div>

                            <button
                                type="button"
                                className="btn btn-primary primary-btn"
                                style={{ margin: "0px" }}
                                onClick={() => this.setState({ openDialog: true })}
                            >
                                Seleccionar
                            </button>
                        </div>
                        <div className="row" style={{ margin: "0px" }}>
                            <div className="col-sm-12 col-md-12 col-lg-12 unit" style={{ padding: "2px" }}>
                                <div className="input">
                                    <TextField variant="outlined" margin="dense"
                                        onChange={this.handleChange}
                                        className="form-control"
                                        type="text"
                                        label="Unidad Medida"
                                        disabled={this.props.consult}
                                        required
                                        value={this.state.unidadMedida}
                                        name="unidadMedida"
                                    />
                                </div>
                            </div>
                            <div className="col-sm-12 col-md-6 col-lg-6 unit" style={{ padding: "2px" }}>
                                <div className="input">
                                    <TextField variant="outlined" margin="dense"
                                        onChange={this.handleChange}
                                        className="form-control"
                                        type="number"
                                        label="Unidad Medida"
                                        disabled={this.props.consult}
                                        value={this.state.rangoMinimo}
                                        name="rangoMinimo"
                                    />
                                </div>
                            </div>
                            <div className="col-sm-12 col-md-6 col-lg-6 unit" style={{ padding: "2px" }}>
                                <div className="input">
                                    <TextField variant="outlined" margin="dense"
                                        onChange={this.handleChange}
                                        className="form-control"
                                        type="number"
                                        label="Rango Máximo"
                                        disabled={this.props.consult}
                                        value={this.state.rangoMaximo}
                                        name="rangoMaximo"
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