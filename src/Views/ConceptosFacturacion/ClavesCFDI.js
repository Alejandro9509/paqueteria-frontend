import React, { Component } from 'react';
import PropTypes from 'prop-types';
import axios from "axios";
import { FormControl, MenuItem, InputLabel, ListItem, TextField, Select } from '@material-ui/core';
import { DataGrid } from '@material-ui/data-grid';
import { dataGridLocaleText } from '../../Constants';
import { obtenerSAT } from '../../Util/Contexts/ConceptosFacturacionContext';

class ClavesCFDI extends Component {
    constructor(props) {
        super(props);
        this.state = {
            height: window.innerHeight,
            codigo: props.edit ? props.select.m_sCodigo : "",
            concepto: props.edit ? props.select.m_sConcepto : "",
            tipoSAT: "",
            claveDivision: 0,
            claveGrupo: 0,
            claveClase: 0,
            impuestos: [],
            impuestosRetencion: [],
            impuestosSeleccionadosTraslado: [],
            predeterminadoSeleccionadosTraslado: {},
            impuestosSeleccionadosRetencion: [],
            predeterminadoSeleccionadosRetencion: {},
            activo: props.edit ? props.select.m_bActivo : false,
            incluirIngresosLiquidacion: props.edit ? props.select.m_bCalculoIngreso : false,
            incluirLiquidacionFlete: props.edit ? props.select.m_bCalculoFlete : false,
            unidadMedia: props.edit ? props.select.m_sUnidadMedida : "",
            columns: [
                {
                    headerName: "Clave SAT",
                    field: "m_nClaveClase",
                    width: 125,
                }, {
                    headerName: "Producto o Servicio",
                    field: "m_sClase",
                    flex: 1
                }

            ]
        }
        this.handleChange = this.handleChange.bind(this)
        this.onSubmit = this.onSubmit.bind(this)
        this.handleChangeChecboxTraslado = this.handleChangeChecboxTraslado.bind(this)
        this.handleChangeChecboxTrasladoPredeterminado = this.handleChangeChecboxTrasladoPredeterminado.bind(this)
        this.handleChangeChecboxRetencion = this.handleChangeChecboxRetencion.bind(this)
        this.handleChangeChecboxRetencionPredeterminado = this.handleChangeChecboxRetencionPredeterminado.bind(this)

    }

    componentDidMount() {
    }


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
        console.log("hola")
        this.props.onSubmit(this.state)
    }


    render() {
        const { impuestos, impuestosRetencion } = this.state
        return (
            <div>
                <form className="j-forms" onSubmit={this.onSubmit}>
                    <div className="form-content">
                        <div className="main-container" style={{ margin: "0px", padding: "0px" }}>
                            <div className="row" style={{ margin: "0px" }}>
                                <FormControl className="col-sm-12 col-md-4 col-lg-4 unit" style={{ padding: "2px" }}>
                                    <InputLabel id="TipoLabel">Tipo</InputLabel>
                                    <Select
                                        labelId="TipoLabel"
                                        className="form-control"
                                        required
                                        value={this.state.tipoSAT}
                                        onChange={(event) => this.setState({
                                            tipoSAT: event.target.value,
                                            claveDivision: 0,
                                            claveGrupo: 0
                                        })
                                        }
                                        id="tipoSAT"
                                        name="tipoSAT"
                                        label="Tipo"
                                    >
                                        <MenuItem
                                            key={1}
                                            value="Producto"
                                        >
                                            Producto
                                        </MenuItem>
                                        <MenuItem
                                            key={2}
                                            value="Servicio"
                                        >
                                            Servicio
                                        </MenuItem>
                                    </Select>
                                </FormControl>

                                <FormControl className="col-sm-12 col-md-4 col-lg-4 unit" style={{ padding: "2px" }}>

                                    <InputLabel id="claveDivisionLabel">División</InputLabel>
                                    <Select
                                        labelId="claveDivisionLabel"
                                        className="form-control"
                                        required
                                        onChange={(event) => this.setState({
                                            claveDivision: event.target.value,
                                            claveGrupo: 0
                                        })
                                        }
                                        id="claveDivision"
                                        name={"claveDivision"}
                                        label="Division"
                                    >
                                        {this.props.dataSAT.filter((division) => {
                                            return division.m_sTipo == this.state.tipoSAT
                                        }).filter((SAT, index) => {
                                            if (index - 1 < 0) {
                                                return SAT
                                            } else {
                                                if (this.props.dataSAT.filter((division) => {
                                                    return division.m_sTipo == this.state.tipoSAT
                                                })[index - 1].m_nClaveDivision != SAT.m_nClaveDivision) {
                                                    return SAT
                                                }
                                            }

                                        }).map((elemento) => (
                                            <MenuItem
                                                key={elemento.m_nClaveDivision}
                                                value={elemento.m_nClaveDivision}
                                            >
                                                {elemento.m_sDivision}
                                            </MenuItem>
                                        ))}
                                    </Select>

                                </FormControl>

                                <FormControl variant="standard" className="col-sm-12 col-md-4 col-lg-4 unit" style={{ padding: "2px" }}>

                                    <InputLabel id="claveGrupoLabel">Grupo</InputLabel>
                                    <Select
                                        labelId="claveGrupoLabel"
                                        className="form-control"
                                        required
                                        onChange={(event) => this.setState({
                                            claveGrupo: event.target.value
                                        })
                                        }
                                        id="claveGrupo"
                                        name={"claveGrupo"}
                                        label="Grupo"
                                    >
                                        {this.props.dataSAT.filter((grupo) => {
                                            return grupo.m_nClaveDivision == this.state.claveDivision
                                        }).filter((SAT, index) => {
                                            if (index - 1 < 0) {
                                                return SAT
                                            } else {
                                                if (this.props.dataSAT.filter((grupo) => {
                                                    return grupo.m_nClaveDivision == this.state.claveDivision
                                                })[index - 1].m_nClaveGrupo != SAT.m_nClaveGrupo) {
                                                    return SAT
                                                }
                                            }
                                        }).map((elemento) => (
                                            <MenuItem
                                                key={elemento.m_nClaveGrupo}
                                                value={elemento.m_nClaveGrupo}
                                            >
                                                {elemento.m_sGrupo}
                                            </MenuItem>
                                        ))}
                                    </Select>
                                </FormControl>

                            </div>
                        </div>

                    </div>
                </form >
                <div className="row" style={{ height: this.state.height - 250, width: '100%' }}>
                    {this.props.dataSAT.length != 0 ? (
                        <DataGrid
                            localeText={dataGridLocaleText}
                            rows={
                                this.props.dataSAT.filter((SAT) => {
                                    if (this.state.claveGrupo != 0) {
                                        return SAT.m_nClaveGrupo == this.state.claveGrupo
                                    } else if (this.state.claveDivision != 0) {
                                        return SAT.m_nClaveDivision == this.state.claveDivision
                                    } else if (this.state.tipoSAT != "") {
                                        return SAT.m_sTipo == this.state.tipoSAT
                                    } else {
                                        return SAT
                                    }
                                })
                            }
                            columns={this.state.columns}
                            density="compact"
                            pageSize={Math.floor((this.state.height - 310) / 30)}
                            getRowId={(row) => row.m_nClaveClase}
                            onRowSelected={(row) => {
                                this.props.selectClase(row)
                            }}
                        />
                    ) : (
                        <div>No se encontró ningún registro</div>
                    )}
                    <button
                        type="button"
                        onClick={this.props.closeDialog}
                        className="btn btn-secondary secondary-btn"
                    >
                        Seleccionar
                    </button>
                </div>

            </div>
        );
    }
}

ClavesCFDI.propTypes = {

};

export default ClavesCFDI;