import React, { Component, useEffect } from 'react';
import PropTypes from 'prop-types';
import axios from "axios";
import { IconButton, InputAdornment, TextField } from '@material-ui/core';
import PageviewIcon from "@material-ui/icons/Pageview";
import AddBoxIcon from '@material-ui/icons/AddBox';
import Autocomplete from "@material-ui/lab/Autocomplete";
import CancelIcon from '@material-ui/icons/Cancel';

const headers = {
    'Content-Type': 'application/json',
    //    'access-control-allow-origin': '*'
}

class ConceptosAdicionales extends Component {
    constructor(props) {
        super(props);
        this.state = {
            conceptos: [],
            impuestos: [],
            importe: 0,
            importeRet: "",
            retiene: 0,
            traslada: 0,
            importeIVA: "",
            concepto: {}

        }
        this.getAllConceptos = this.getAllConceptos.bind(this)
        this.handleChange = this.handleChange.bind(this)
        this.calcularImpuestos = this.calcularImpuestos.bind(this)
        this.onSubmit = this.onSubmit.bind(this)
        this.removeConcepto = this.removeConcepto.bind(this)
    }

    componentWillMount() {

    }

    componentDidMount() {
        this.getAllConceptos()
        this.getAllImpuestos()
    }

    getAllImpuestos() {
        const url = `${process.env.REACT_APP_API_URL}/Impuestos/GetListado`;
        axios.get(url, { headers }).then(respuesta => {
            this.setState({ impuestos: respuesta.data })
        });
    };

    getAllConceptos() {
        const url = `${process.env.REACT_APP_API_URL}/ConceptosFacturacion/GetListado`;
        axios.get(url, { headers }).then(respuesta => {
            this.setState({ conceptos: respuesta.data })
        });
    }


    handleChange(event) {
        if (event.target.name === "importe") {
            this.calcularImpuestos(this.state.traslada, this.state.retiene, event.target.value)
        } else if (event.target.name === "traslada") {
            this.calcularImpuestos(event.target.value, this.state.retiene, this.state.importe)
        } else if (event.target.name === "retiene") {
            this.calcularImpuestos(this.state.traslada, event.target.value, this.state.importe)
        }
    }


    componentWillUnmount() {

    }

    calcularImpuestos(traslada, retiene, importe) {
        this.setState({ retiene: retiene, importe: importe, traslada: traslada })
        if (this.state.impuestos.find(i => i.m_nIdImpuesto === parseInt(traslada)) != null) {
            const impuesto = this.state.impuestos.find(i => i.m_nIdImpuesto === parseInt(traslada))
            this.setState({ importeIVA: parseFloat((parseFloat(impuesto.m_nPorcentaje) / 100) * parseFloat(importe)).toFixed(2), retiene: retiene, importe: importe, traslada: traslada })
        }
        if (this.state.impuestos.find(i => i.m_nIdImpuesto === parseInt(retiene)) != null) {
            const impuesto = this.state.impuestos.find(i => i.m_nIdImpuesto === parseInt(retiene))
            this.setState({ importeRet: parseFloat((parseFloat(impuesto.m_nPorcentaje) / 100) * parseFloat(importe)).toFixed(2), retiene: retiene, importe: importe, traslada: traslada })
        }
    }

    onSubmit(event) {
        event.preventDefault()
        this.props.addConcepto(this.state)
    }

    removeConcepto(event) {
        event.preventDefault()
        this.props.removeConcepto(this.state)
    }

    render() {



        return (
            <div>

                <div className="row">
                    <div className="col-md-2 col-sm-6" style={{ padding: "2px", paddingLeft: "15px" }}>

                        <label className="label">
                            Concepto
                                  </label>
                        <div className="input">
                            <Autocomplete
                                value={this.state.concepto}
                                freeSolo
                                onChange={(event, newValue) =>
                                    this.setState({
                                        concepto: newValue,
                                        importeRet: "",
                                        retiene: 0,
                                        traslada: 0,
                                        importeIVA: ""
                                    })
                                }
                                id="concepto"
                                disableClearable
                                forcePopupIcon={false}
                                disabled={this.state.agregar == "Consultar"}
                                options={this.state.conceptos}
                                getOptionLabel={(option) =>
                                    option.m_sConcepto
                                }
                                variant="outlined"
                                style={{
                                    borderWidth: "1px",
                                    borderColor: "#dddddd",
                                    borderStyle: "solid",
                                    borderRadius: "5px",
                                }}
                                renderInput={(params) => (
                                    <div>
                                        <TextField
                                            {...params}
                                            InputProps={{
                                                ...params.InputProps,
                                                style: { height: "33px", fontSize: "14px" },
                                                type: "search",
                                                disableUnderline: true,
                                                endAdornment: (
                                                    <InputAdornment position="end">
                                                        <IconButton
                                                            padding="0px"
                                                            style={{
                                                                paddingRight: "0px",
                                                            }}
                                                            disabled={this.state.agregar == "Consultar"}
                                                            onClick={() => {
                                                                this.setState({
                                                                    identificadorModal:
                                                                        "nombreRemitente",
                                                                    tipoModal: 5,
                                                                    openDialog: true
                                                                });
                                                            }}
                                                        >
                                                            <PageviewIcon
                                                                style={{
                                                                    color: "#F9A03E",
                                                                    fontSize: 32,
                                                                    paddingInlineEnd: 0,
                                                                    paddingRight: 0,
                                                                    paddingBlockEnd: 0,
                                                                    paddingLeft: 0,
                                                                    paddingBlock: 0,
                                                                }}
                                                            />
                                                        </IconButton>
                                                    </InputAdornment>
                                                ),
                                            }}
                                        />
                                    </div>
                                )}
                            />
                        </div>
                    </div>
                    <div className="col-md-2 col-sm-6" style={{ padding: "2px" }}>
                        <label className="label">
                            Importe
                        </label>
                        <div className="input">
                            <input
                                onChange={this.handleChange}
                                className="form-control"
                                type="number"
                                style={{ textAlign: "right" }}
                                step="1"
                                min="0"
                                value={this.state.importe}
                                name="importe"
                            />
                        </div>
                    </div>
                    <div className="col-md-1 col-sm-6" style={{ padding: "2px" }}>
                        <label className="label">Traslada</label>
                        <label className="input select" style={{ width: "100%" }}>
                            <select
                                className="form-control"
                                value={this.state.traslada}
                                onChange={this.handleChange}
                                name="traslada"
                            >
                                <option
                                    key={0}
                                    value={""}
                                >
                                    Selecciona
                                        </option>
                                {this.state.impuestos.map((impuesto) => (
                                    <option
                                        key={impuesto.m_nIdImpuesto}
                                        value={impuesto.m_nIdImpuesto}
                                    >
                                        {impuesto.m_sImpuesto}
                                    </option>
                                ))}
                            </select>
                            <i></i>
                        </label>
                    </div>
                    <div className="col-md-2 col-sm-6" style={{ padding: "2px" }}>
                        <label className="label">
                            Importe IVA
                        </label>
                        <div className="input">
                            <input
                                onChange={this.handleChange}
                                className="form-control"
                                type="number"
                                style={{ textAlign: "right" }}
                                disabled
                                step="1"
                                min="0"
                                value={this.state.importeIVA}
                                name="importeIVA"
                            />
                        </div>
                    </div>
                    <div className="col-md-1 col-sm-6" style={{ padding: "2px" }}>
                        <label className="label">
                            Retiene
                        </label>
                        <label className="input select" style={{ width: "100%" }}>
                            <select
                                className="form-control"
                                onChange={this.handleChange}
                                name="retiene"
                                value={this.state.retiene}
                            >
                                <option
                                    key={0}
                                    value={""}
                                >
                                    Selecciona
                                        </option>
                                {this.state.impuestos.map((impuesto) => (
                                    <option
                                        key={impuesto.m_nIdImpuesto}
                                        value={impuesto.m_nIdImpuesto}
                                    >
                                        {impuesto.m_sImpuesto}
                                    </option>
                                ))}
                            </select>
                            <i></i>
                        </label>
                    </div>
                    <div className="col-md-2 col-sm-6" style={{ padding: "2px" }}>
                        <label className="label">
                            Importe Ret
                        </label>
                        <div className="input">
                            <input
                                onChange={this.handleChange}
                                className="form-control"
                                type="number"
                                style={{ textAlign: "right" }}
                                disabled
                                step="1"
                                min="0"
                                value={this.state.importeRet}
                                name="importeRet"
                            />
                        </div>
                    </div>
                    <div className="col-md-2 col-sm-6" style={{ padding: "2px" }}>
                        <IconButton onClick={this.onSubmit}>
                            <AddBoxIcon style={{ fill: "green", fontSize: "xxx-large" }} />
                        </IconButton>
                    </div>
                </div>
                <div className="row">
                    <div className="col-md-12 col-sm-12" style={{ padding: "2px", paddingLeft: "15px" }}>
                        {
                            this.props.conceptosAdicionales.length !== 0 &&
                            <table style={{ width: "100%" }}>
                                <tr>
                                    <th style={{ textAlign: "center" }}> Concepto de Faturación</th>
                                    <th style={{ textAlign: "right" }}> Importe</th>
                                    <th style={{ textAlign: "center" }}> Traslada</th>
                                    <th style={{ textAlign: "right" }}> Importe IVA</th>
                                    <th style={{ textAlign: "center" }}> Retiene</th>
                                    <th style={{ textAlign: "right" }}> Importe Ret</th>
                                </tr>
                                {
                                    this.props.conceptosAdicionales.map((c, index) => (
                                        <tr>
                                            <td style={{ textAlign: "center" }}>{c.concepto.m_sConcepto}</td>
                                            <td style={{ textAlign: "right" }}>${parseFloat(c.importe).toFixed(2)}</td>
                                            <td style={{ textAlign: "center" }}>{this.state.impuestos.length !== 0 && this.state.impuestos.find(i => i.m_nIdImpuesto === parseInt(c.traslada)).m_sImpuesto}</td>
                                            <td style={{ textAlign: "right" }}>${parseFloat(c.importeIVA).toFixed(2)}</td>
                                            <td style={{ textAlign: "center" }}>{this.state.impuestos.length !== 0 && this.state.impuestos.find(i => i.m_nIdImpuesto === parseInt(c.retiene)).m_sImpuesto}</td>
                                            <td style={{ textAlign: "right" }}>${parseFloat(c.importeRet).toFixed(2)}</td>
                                            <td>
                                                <IconButton onClick={this.removeConcepto}>
                                                    <CancelIcon style={{ fill: "red", fontSize: "x-large" }} />
                                                </IconButton>
                                            </td>
                                        </tr>
                                    ))
                                }
                            </table>
                        }

                    </div>
                    <div className="col-md-12 col-sm-12" style={{ padding: "2px", paddingLeft: "15px", backgroundColor: "lightgrey", backgroundClip: "content-box" }}>

                        <div className="col-md-12 col-sm-12" style={{ alignItems: "right", display: "inline-flex", justifyContent: "flex-end" }}>
                            <div style={{ margin: "5px", padding: "5px" }}>Subtotal</div> <div style={{ margin: "4px", padding: "4px", marginRight: "15px", backgroundColor: "white", backgroundClip: "border-box", borderStyle: "solid", borderColor: "gray", minWidth: "200px", textAlign: "right" }}> ${parseFloat(this.props.conceptosAdicionales.reduce((total, arg) => total + parseFloat(arg.importe), 0)).toFixed(2)}</div>
                        </div>
                        <div className="col-md-12 col-sm-12" style={{ alignItems: "right", display: "inline-flex", justifyContent: "flex-end" }}>
                            <div style={{ margin: "4px", padding: "4px", marginRight: "15px", backgroundColor: "white", backgroundClip: "border-box", borderStyle: "solid", borderColor: "gray", minWidth: "200px", textAlign: "right" }}>  {this.props.ivaTraslada.map(t => (<div>{`${this.state.impuestos.length !== 0 ? this.state.impuestos.find(i => i.m_nIdImpuesto === parseInt(t)).m_sImpuesto : ""} `}  ${parseFloat(this.props.conceptosAdicionales.filter(c => c.traslada === t).reduce((total, arg) => total + parseFloat(arg.importeIVA), 0)).toFixed(2)}<br /></div>))} {this.props.ivaRetiene.map(t => (<div>{`Retención ${this.state.impuestos.length !== 0 ? `${this.state.impuestos.find(i => i.m_nIdImpuesto === parseInt(t)).m_sImpuesto}` : ""} `}  ${parseFloat(this.props.conceptosAdicionales.filter(c => c.retiene === t).reduce((total, arg) => total + parseFloat(arg.importeRet), 0)).toFixed(2)}<br /></div>))} </div>
                        </div>
                        <div className="col-md-12 col-sm-12" style={{ alignItems: "right", display: "inline-flex", justifyContent: "flex-end" }}>
                            <div style={{ margin: "5px", padding: "5px" }}>Total</div> <div style={{ margin: "4px", padding: "4px", marginRight: "15px", backgroundColor: "white", backgroundClip: "border-box", borderStyle: "solid", borderColor: "gray", minWidth: "200px", textAlign: "right" }}> ${parseFloat(this.props.conceptosAdicionales.reduce((total, arg) => total + parseFloat(arg.importe), 0) + this.props.conceptosAdicionales.filter(c => this.props.ivaTraslada.find(t => t === c.traslada) != null).reduce((total, arg) => total + parseFloat(arg.importeIVA), 0) + this.props.conceptosAdicionales.filter(c => this.props.ivaTraslada.find(t => t === c.traslada) != null).reduce((total, arg) => total + parseFloat(arg.importeRet), 0)).toFixed(2)}</div>
                        </div>
                    </div>
                </div>

            </div>
        );
    }
}

ConceptosAdicionales.propTypes = {

};

export default ConceptosAdicionales;