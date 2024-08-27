import React, { Component, useEffect } from 'react';
import PropTypes from 'prop-types';
import axios from "axios";
import { Dialog, DialogActions, DialogContent, FormControl, IconButton, InputAdornment, InputLabel, Select, TextField } from '@mui/material';
import PageviewIcon from "@mui/icons-material/Pageview";
import AddBoxIcon from '@mui/icons-material/AddBox';
import Autocomplete from '@mui/material/Autocomplete';
import CancelIcon from '@mui/icons-material/Cancel';
import {
    useTable,
    useFilters,
    useAsyncDebounce,
    useSortBy,
} from "react-table";
import {
    obtenerConceptosFacturacionManiobra,
    obtenerImpuestosByConceptosFacturacion
} from '../../Util/Contexts/ConceptosFacturacionContext';
import {API_HEADERS} from "../../Constants";

const headers = API_HEADERS

let timer;

class ConceptosAdicionales extends Component {
    constructor(props) {
        super(props);
        this.state = {
            conceptos: [],
            impuestos: [],
            importe: 0,
            importeRet: "0",
            retiene: 0,
            traslada: 0,
            importeIVA: "0",
            idConcepto: 0,
            concepto: null,
            rangoMinimo: 0,
            rangoMaximo: 0,
            nombreConcepto: "",
            tipoCalculo: 0,
            columnsConceptos: [
                {
                    Name: "Codigo",
                    accessor: "m_sCodigo",
                },
                {
                    Name: "Concepto",
                    accessor: "m_sConcepto",
                }
            ],
            agregadoDesde: 1,
            tiposCalculo:[],
            tipoMedida: 0,

        }
        this.getAllConceptos = this.getAllConceptos.bind(this)
        this.handleChange = this.handleChange.bind(this)
        this.calcularImpuestos = this.calcularImpuestos.bind(this)
        this.onSubmit = this.onSubmit.bind(this)
        this.removeConcepto = this.removeConcepto.bind(this)
        this.handleSelectCP = this.handleSelectCP.bind(this)
        this.handleRowClick = this.handleRowClick.bind(this)
        this.handleConceptoClick = this.handleConceptoClick.bind(this)

    }

    componentWillMount() {

    }

    componentDidMount() {
        this.getAllConceptos()
        this.getAllImpuestos()
        this.getAlTiposCalculo()
    }

    getAllImpuestos() {
        const url = `${process.env.REACT_APP_API_URL}/Impuestos/GetListado`;
        axios.get(url, { headers }).then(respuesta => {
            this.setState({ impuestos: respuesta.data })
        });
    };

    getAllConceptos() {
        obtenerConceptosFacturacionManiobra().then(respuesta => {
            /*if (this.props.conceptosAdicionales.length == 0){
                if (this.props.edit) {
                    this.props.select.m_arrArConceptos.forEach(element => {
                        this.props.removeConcepto(element)
                    })
                    this.props.select.m_arrArConceptos.forEach(element => {
                        this.props.addConcepto({
                            concepto: respuesta.data.find(c => c.m_nIdConceptosFacturacion === element.m_nIdConceptosFacturacion),
                            importe: element.m_cImporte,
                            traslada: element.m_nIdImpuestoTraslada,
                            importeIVA: element.m_cImporteIva,
                            retiene: element.m_nIdImpuestoRetiene,
                            importeRet: element.m_cImporteRetiene,
                            nombreConcepto: element.m_sConcepto,
                            rangoMinimo: element.m_xnRangoMinimo,
                            rangoMaximo: element.m_xnRangoMaximo,
                            agregadoDesde: element.m_nIdAgregadoDesde
                        })
                    })
                }
            }*/

            this.setState({ conceptos: respuesta.data })
        });
    }

    getAlTiposCalculo(){
        const url = `${process.env.REACT_APP_API_URL}/TipoCalculo/GetListado`;
        axios.get(url, { headers }).then(respuesta => {
            this.setState({ tiposCalculo: respuesta.data })
        });
    }

    handleChange(event) {
        event.preventDefault()
        if (event.target.name === "importe") {
            this.calcularImpuestos(this.state.traslada, this.state.retiene, event.target.value)
        } else if (event.target.name === "traslada") {
            this.calcularImpuestos(event.target.value, this.state.retiene, this.state.importe)
        } else if (event.target.name === "retiene") {
            this.calcularImpuestos(this.state.traslada, event.target.value, this.state.importe)
        } else {
            this.setState({
                [event.target.name]: event.target.value
            });
        }
    }


    componentWillUnmount() {

    }

    handleSelectCP(id, dobleClick, e) {
        clearTimeout(timer);
        if (e.detail === 1) {
            timer = setTimeout(() => {
                this.setState({
                    [this.state.identificadorModal]: id,
                    openDialog: true
                })
            }, 200)
        } else if (e.detail === 2) {
            this.setState({
                [this.state.identificadorModal]: id,
                openDialog: false
            });
        }

        console.log(dobleClick);
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
        this.setState({
            concepto: null,
            importe: 0,
            nombreConcepto: "",
            importeRet: "0",
            retiene: 0,
            traslada: 0,
            importeIVA: "0",
            rangoMinimo: 0,
            rangoMaximo: 0,
            tipoCalculo: 0,
            tipoMedida: 0,
        })
    }

    removeConcepto(event, item) {
        event.preventDefault()
        this.props.removeConcepto(item)
    }

    handleRowClick(event, index, concepto) {
        obtenerImpuestosByConceptosFacturacion(concepto.idConcepto).then(respuesta => {
            if (!this.props.consult) {
                const {removeConcepto} = this.props
                removeConcepto(concepto)
                const conceptoSelect = this.state.conceptos.find((c) => c.m_nIdConceptosFacturacion == concepto.idConcepto)
                conceptoSelect.arClsDetalle = respuesta.data
                this.setState({
                    concepto: conceptoSelect,
                    importe: concepto.importe,
                    nombreConcepto: concepto.m_sConcepto,
                    importeRet: concepto.importeRet,
                    retiene: concepto.retiene,
                    traslada: concepto.traslada,
                    importeIVA: concepto.importeIVA,
                    rangoMinimo: concepto.rangoMinimo,
                    rangoMaximo: concepto.rangoMaximo,
                    tipoCalculo: concepto.tipoCalculo,
                    tipoMedida: concepto.tipoMedida,
                })
            }
        })
    }

    handleConceptoClick(event, newValue){
        obtenerImpuestosByConceptosFacturacion(newValue.m_nIdConceptosFacturacion).then(respuesta => {
            newValue.arClsDetalle = respuesta.data
            this.setState({
                concepto: newValue,
                importe: newValue.m_cImporte,
                nombreConcepto: newValue.m_sConcepto,
                importeRet: newValue.m_cImporteRetiene,
                retiene: newValue.m_nIdImpuestoRetiene,
                traslada: newValue.m_nIdImpuestoTraslada,
                importeIVA: newValue.m_cImporteIva
            })
        });

    }

    render() {

        return (
            <div>
                <Dialog open={this.state.openDialog} onClose={() => this.setState({ openDialog: false })}>
                    <DialogContent>
                        {this.state.tipoModal == 1 &&
                            <div className="row" style={{ backgroundColor: '#FFFFFF' }}>
                                <div align="right">
                                    <button onClick={() => { this.props.history.push("/Ciudades") }} className="btn btn-primary primary-btn">Agregar</button>

                                </div>

                                {this.state.conceptos.length != 0 ? <TableConceptos handleSelectCP={this.handleSelectCP} object={this.state} select={this.state[this.state.identificadorModal] && this.state[this.state.identificadorModal].m_nIdConceptosFacturacion} columns={this.state.columnsConceptos} data={this.state.conceptos} identificadorModal={this.state.identificadorModal} /> : <div>No se encontró ningún registro</div>}


                                <DialogActions style={{ justifyContent: "left" }}>

                                    <button onClick={() => this.setState({ openDialog: false })} className="btn btn-primary primary-btn">Aceptar</button>
                                    <button onClick={() => this.setState({ openDialog: false })} className="btn btn-secondary secondary-btn">Cerrar</button>

                                </DialogActions>
                            </div>
                        }
                    </DialogContent>

                </Dialog>
                {
                    !this.props.consult &&
                    <div className="row">
                        <div className="col-md-2 col-sm-6" style={{ padding: "5px" }}>

                            <div className="input">
                                <Autocomplete
                                    value={this.state.concepto}
                                    freeSolo
                                    onChange={(event, newValue) => this.handleConceptoClick(event, newValue)}
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
                                        transform: "translate(14px, 10px) scale(1) !important"
                                    }}
                                    renderInput={(params) => (
                                        <div>
                                            <TextField
                                                {...params}
                                                variant="outlined"
                                                label="Concepto"
                                                className="form-control"
                                                margin="dense"
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
                                                                            "concepto",
                                                                        tipoModal: 1,
                                                                        openDialog: true
                                                                    });
                                                                }}
                                                                size="large">
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

                        <div className="col-md-1 col-sm-6" style={{ padding: "5px" }}>
                            <label className="input select" style={{ width: "100%" }}>
                                <FormControl fullWidth variant="outlined" margin="dense">
                                    <InputLabel id="tipoLabel">Medida</InputLabel>
                                    <Select
                                        labelId="tipoMedidaLabel"
                                        label="Tipo Medida"
                                        className="form-control"
                                        onChange={this.handleChange}
                                        name="tipoMedida"
                                        value={this.state.tipoMedida}
                                    >
                                        <option key={0} value={0}>Selecciona</option>
                                        <option key={1} value={1}>Kg</option>
                                        <option key={2} value={2}>Toneladas</option>
                                        <option key={3} value={3}>Piezas</option>

                                    </Select>
                                </FormControl>
                            </label>
                        </div>
                        <div className="col-md-1 col-sm-6" style={{ padding: "5px" }}>

                            <div className="input">
                                <TextField variant="outlined" margin="dense"
                                    onChange={this.handleChange}
                                    className="form-control"
                                    type="number"
                                    label="Min"
                                    style={{ textAlign: "right" }}
                                    value={this.state.rangoMinimo}
                                    name="rangoMinimo"
                                />
                            </div>
                        </div>
                        <div className="col-md-1 col-sm-6" style={{ padding: "5px" }}>

                            <div className="input">
                                <TextField variant="outlined" margin="dense"
                                    onChange={this.handleChange}
                                    className="form-control"
                                    type="number"
                                    label="Max"
                                    style={{ textAlign: "right" }}
                                    value={this.state.rangoMaximo}
                                    name="rangoMaximo"
                                />
                            </div>
                        </div>

                        <div className="col-md-1 col-sm-6" style={{ padding: "5px" }}>

                            <div className="input">
                                <TextField variant="outlined" margin="dense"
                                    onChange={this.handleChange}
                                    className="form-control"
                                    type="number"
                                    label="Importe"
                                    style={{ textAlign: "right" }}
                                    step="1"
                                    min="0"
                                    value={this.state.importe}
                                    name="importe"
                                />
                            </div>
                        </div>

                        <div className="col-md-1 col-sm-6" style={{ padding: "5px" }}>
                            <label className="input select" style={{ width: "100%" }}>
                                <FormControl fullWidth variant="outlined" margin="dense">
                                    <InputLabel id="trasladaLabel">Traslada</InputLabel>
                                    <Select
                                        labelId="trasladaLabel"
                                        label="Traslada"
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
                                        {this.state.concepto &&
                                            this.state.impuestos.filter(i => this.state.concepto.arClsDetalle.find(c => c.m_nIdImpuesto === i.m_nIdImpuesto && c.m_bTrasladado === true)).map((impuesto) => (
                                                <option
                                                    key={impuesto.m_nIdImpuesto}
                                                    value={impuesto.m_nIdImpuesto}
                                                >
                                                    {impuesto.m_sImpuesto}
                                                </option>
                                            ))}
                                    </Select>
                                </FormControl>
                            </label>
                        </div>
                        <div className="col-md-1 col-sm-6" style={{ padding: "5px" }}>

                            <div className="input">
                                <TextField variant="outlined" margin="dense"
                                    onChange={this.handleChange}
                                    className="form-control"
                                    type="number"
                                    style={{ textAlign: "right" }}
                                    disabled
                                    label="IVA"
                                    step="1"
                                    min="0"
                                    value={this.state.importeIVA}
                                    name="importeIVA"
                                />
                            </div>
                        </div>
                        <div className="col-md-1 col-sm-6" style={{ padding: "5px" }}>
                            <label className="input select" style={{ width: "100%" }}>
                                <FormControl fullWidth variant="outlined" margin="dense">
                                    <InputLabel id="retieneLabel">Retiene</InputLabel>
                                    <Select
                                        labelId="retieneLabel"
                                        label="Retiene"
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
                                        {this.state.concepto &&
                                            this.state.impuestos.filter(i => this.state.concepto.arClsDetalle.find(c => c.m_nIdImpuesto === i.m_nIdImpuesto && c.m_bTrasladado === false)).map((impuesto) => (
                                                <option
                                                    key={impuesto.m_nIdImpuesto}
                                                    value={impuesto.m_nIdImpuesto}
                                                >
                                                    {impuesto.m_sImpuesto}
                                                </option>
                                            ))}
                                    </Select>
                                </FormControl>
                            </label>
                        </div>

                        <div className="col-md-1 col-sm-6" style={{ padding: "5px" }}>

                            <div className="input">
                                <TextField variant="outlined" margin="dense"
                                    onChange={this.handleChange}
                                    className="form-control"
                                    type="number"
                                    style={{ textAlign: "right" }}
                                    disabled
                                    label="Ret"
                                    step="1"
                                    min="0"
                                    value={this.state.importeRet}
                                    name="importeRet"
                                />
                            </div>
                        </div>
                        <div className="col-md-1 col-sm-6" style={{ padding: "5px" }}>
                            <label className="input select" style={{ width: "100%" }}>
                                <FormControl fullWidth variant="outlined" margin="dense">
                                    <InputLabel id="tipoLabel">Tipo</InputLabel>
                                    <Select
                                        labelId="tipoLabel"
                                        label="Tipo"
                                        className="form-control"
                                        onChange={this.handleChange}
                                        name="tipoCalculo"
                                        value={this.state.tipoCalculo}
                                    >
                                        <option key={0} value={0}>Selecciona</option>
                                        {this.state.tiposCalculo.map((t) =>
                                            (t.m_nIdTarifaTipoCalculo == 3 ? this.state.tipoMedida == 3 &&
                                                <option key={t.m_nIdTarifaTipoCalculo} value={t.m_nIdTarifaTipoCalculo}>{t.m_sTarifaTipoCalculo}</option>
                                                : <option key={t.m_nIdTarifaTipoCalculo} value={t.m_nIdTarifaTipoCalculo}>{t.m_sTarifaTipoCalculo}</option>))
                                        }
                                    </Select>
                                </FormControl>
                            </label>
                        </div>

                        <div className="col-md-12 col-sm-12" style={{ padding: "0px", textAlign: "right" }}>
                            <IconButton onClick={this.onSubmit} style={{ padding: "0px" }} size="large">
                                <AddBoxIcon style={{ fill: "green", fontSize: "xx-large" }} />
                            </IconButton>
                        </div>
                    </div>
                }

                <div className="row">
                    <div className="col-md-12 col-sm-12" style={{ padding: "5px" }}>
                        {
                            this.props.conceptosAdicionales.length !== 0 &&
                            <table style={{ width: "100%" }}>
                                <tr>
                                    <th style={{ textAlign: "left" }}> Concepto</th>
                                    <th style={{ textAlign: "left" }}> Medida</th>
                                    <th style={{ textAlign: "left" }}> Min</th>
                                    <th style={{ textAlign: "left" }}> Max</th>
                                    <th style={{ textAlign: "left" }}> Importe</th>
                                    <th style={{ textAlign: "left" }}> Traslada</th>
                                    <th style={{ textAlign: "left" }}> Importe IVA</th>
                                    <th style={{ textAlign: "left" }}> Retiene</th>
                                    <th style={{ textAlign: "left" }}> Importe Ret</th>
                                    <th style={{ textAlign: "left" }}> Tipo</th>
                                </tr>
                                {
                                    this.props.conceptosAdicionales.map((c, index) => (
                                        <tr onClick={(e) => this.handleRowClick(e, index, c)}>
                                            <td style={{ textAlign: "left" }}>{c.nombreConcepto}</td>
                                            <td style={{ textAlign: "left" }}>{c.tipoMedida == 1 ? "Kg" : c.tipoMedida == 2 ? "Tons" : c.tipoMedida == 3 ? "Piezas" : ""}</td>
                                            <td style={{ textAlign: "left" }}>{c.rangoMinimo} {c.tipoMedida == 1 ? "kg" : c.tipoMedida == 2 ? "Tons" : c.tipoMedida == 3 ? "pzs": ""}</td>
                                            <td style={{ textAlign: "left" }}>{c.rangoMaximo} {c.tipoMedida == 1 ? "kg" : c.tipoMedida == 2 ? "Tons" : c.tipoMedida == 3 ? "pzs": ""}</td>
                                            <td style={{ textAlign: "left" }}>${parseFloat(c.importe).toFixed(2)}</td>
                                            <td style={{ textAlign: "left" }}>{this.state.impuestos.length !== 0 && (this.state.impuestos.find(i => i.m_nIdImpuesto === parseInt(c.traslada)) ? this.state.impuestos.find(i => i.m_nIdImpuesto === parseInt(c.traslada)).m_sImpuesto : "No Aplica")}</td>
                                            <td style={{ textAlign: "left" }}>${parseFloat(c.importeIVA).toFixed(2)}</td>
                                            <td style={{ textAlign: "left" }}>{this.state.impuestos.length !== 0 && (this.state.impuestos.find(i => i.m_nIdImpuesto === parseInt(c.retiene)) ? this.state.impuestos.find(i => i.m_nIdImpuesto === parseInt(c.retiene)).m_sImpuesto : "No Aplica")}</td>
                                            <td style={{ textAlign: "left" }}>${parseFloat(c.importeRet).toFixed(2)}</td>
                                            <td style={{ textAlign: "left" }}>{c.tipoCalculo == 1 ? "Fijo" : c.tipoCalculo == 2 ? "Factor" : c.tipoCalculo == 3 ? "Producto" : ""}</td>
                                            {
                                                !this.props.consult &&
                                                <td>
                                                    <IconButton
                                                        onClick={(e) => {
                                                            e.stopPropagation()
                                                            this.removeConcepto(e, c)
                                                        }}
                                                        size="large">
                                                        <CancelIcon style={{ fill: "red", fontSize: "x-large" }} />
                                                    </IconButton>
                                                </td>
                                            }
                                        </tr>
                                    ))
                                }
                            </table>
                        }

                    </div>
                    <div className="col-md-12 col-sm-12" style={{ padding: "5px", backgroundColor: "white", backgroundClip: "content-box" }}>

                        <div className="col-md-12 col-sm-12" style={{ alignItems: "right", display: "inline-flex", justifyContent: "flex-end" }}>
                            <div style={{ margin: "5px", padding: "5px" }}>Subtotal</div> <div style={{ margin: "4px", padding: "4px", marginRight: "15px", backgroundColor: "white", backgroundClip: "border-box", borderStyle: "solid", borderColor: "gray", minWidth: "230px", textAlign: "right" }}> ${parseFloat(this.props.conceptosAdicionales.reduce((total, arg) => total + parseFloat(arg.importe), 0)).toFixed(2)}</div>
                        </div>
                        <div className="col-md-12 col-sm-12" style={{ alignItems: "right", display: "inline-flex", justifyContent: "flex-end" }}>

                            <div style={{ margin: "4px", padding: "4px", marginRight: "15px", backgroundColor: "white", backgroundClip: "border-box", borderStyle: "solid", borderColor: "gray", minWidth: "230px", textAlign: "right" }}>  {this.props.ivaTraslada.map(t => (<div>{`${this.state.impuestos.length !== 0 ? this.state.impuestos.find(i => i.m_nIdImpuesto === parseInt(t)) ? this.state.impuestos.find(i => i.m_nIdImpuesto === parseInt(t)).m_sImpuesto : "" : ""} `}  ${parseFloat(this.props.conceptosAdicionales.filter(c => c.traslada === t).reduce((total, arg) => total + parseFloat(arg.importeIVA), 0)).toFixed(2)}<br /></div>))} {this.props.ivaRetiene.map(t => (<div>{`${this.state.impuestos.length !== 0 ? `${this.state.impuestos.find(i => i.m_nIdImpuesto === parseInt(t)) ? this.state.impuestos.find(i => i.m_nIdImpuesto === parseInt(t)).m_sImpuesto : ""}` : ""} `}  ${parseFloat(this.props.conceptosAdicionales.filter(c => c.retiene === t).reduce((total, arg) => total + parseFloat(arg.importeRet), 0)).toFixed(2)}<br /></div>))} </div>
                        </div>
                        <div className="col-md-12 col-sm-12" style={{ alignItems: "right", display: "inline-flex", justifyContent: "flex-end" }}>
                            <div style={{ margin: "5px", padding: "5px" }}>Total</div> <div style={{ margin: "4px", padding: "4px", marginRight: "15px", backgroundColor: "white", backgroundClip: "border-box", borderStyle: "solid", borderColor: "gray", minWidth: "230px", textAlign: "right" }}> ${parseFloat(this.props.conceptosAdicionales.reduce((total, arg) => total + parseFloat(arg.importe), 0) + this.props.conceptosAdicionales.filter(c => this.props.ivaTraslada.find(t => t === c.traslada) != null).reduce((total, arg) => total + parseFloat(arg.importeIVA), 0) + this.props.conceptosAdicionales.filter(c => this.props.ivaTraslada.find(t => t === c.traslada) != null).reduce((total, arg) => total + parseFloat(arg.importeRet), 0)).toFixed(2)}</div>
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

function DefaultColumnFilter({
    column: { filterValue, preFilteredRows, setFilter },
}) {
    const count = preFilteredRows.length;
    const [showResults, setShowResults] = React.useState(false)
    const onClick = () => setShowResults(!showResults)
    return (
        <div style={{ display: "flex" }}>
            <span style={{ display: "block", float: "right" }}>
                <a onClick={onClick}>
                    <i className="fa fa-search" />
                </a>
            </span>
            <br></br>
            <span style={{ display: "block" }}>
                <input
                    className="form-control"
                    type={showResults ? "" : "hidden"}
                    value={filterValue || ""}
                    onChange={(e) => {
                        setFilter(e.target.value || undefined);
                    }}
                    placeholder={`Buscar ${count} registros...`}
                />
            </span>
        </div>
    );
}

function TableConceptos({ columns, data, select, handleSelectCP }) {
    const defaultColumn = React.useMemo(
        () => ({
            // Default Filter UI
            Filter: DefaultColumnFilter,
        }),
        []
    );

    const {
        getTableProps,
        getTableBodyProps,
        headerGroups,
        rows,
        prepareRow,
        state,
    } = useTable(
        {
            columns,
            data,
            defaultColumn,
        },
        useFilters,
        useSortBy
    );

    return (
        <div
            className="col-md-12"
            style={{ maxHeight: "300px", overflow: "auto" }}
        >
            <table className="table" {...getTableProps()}>
                <thead>
                    {headerGroups.map((headerGroup) => (
                        <tr {...headerGroup.getHeaderGroupProps()}>
                            {headerGroup.headers.map(column => (
                                // Add the sorting props to control sorting. For this example
                                // we can add them into the header props
                                <th {...column.getHeaderProps(column.getSortByToggleProps())}>
                                    {column.render("Name")}
                                    {/* Add a sort direction indicator */}
                                    <span>
                                        {column.isSorted ? (
                                            column.isSortedDesc ? (
                                                <i className="fa fa-caret-up" />
                                            ) : (
                                                <i className="fa fa-caret-down" />
                                            )
                                        ) : (
                                            ""
                                        )}
                                    </span>
                                    <div>
                                        {column.canFilter ? column.render("Filter") : null}
                                    </div>
                                </th>
                            ))}
                        </tr>
                    ))}
                </thead>
                <tbody {...getTableBodyProps()}>
                    {rows.map(
                        (row, i) => {
                            prepareRow(row);
                            return (
                                <tr style={{ backgroundColor: row.original.m_nIdConceptosFacturacion === select ? "orange" : "white" }} {...row.getRowProps()} onClick={(event) => handleSelectCP(row.original, false, event)} onDoubleClick={(event) => handleSelectCP(row.original, true, event)}>
                                    {row.cells.map(cell => {
                                        return (
                                            <td {...cell.getCellProps()}>{cell.render('Cell')}</td>
                                        )
                                    })}
                                </tr>
                            )
                        }
                    )}
                </tbody>
            </table>
        </div>
    );
}