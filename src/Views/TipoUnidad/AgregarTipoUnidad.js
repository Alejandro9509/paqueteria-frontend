import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Cabecera from '../../Components/Template/Cabecera';
import BarraLateralIzquierda from '../../Components/Template/BarraLateralIzquierda';
import Noty from 'noty';
import axios from "axios";
import SvgIcon from "@material-ui/core/SvgIcon";
import { ReactComponent as Activo } from "../../iconos/Menu/palomita.svg";
import { ReactComponent as NoActivo } from "../../iconos/Menu/cruz.svg";
import { DataGrid } from '@material-ui/data-grid';
import $ from "jquery";
import {Dialog, DialogActions, DialogContent, DialogTitle} from "@material-ui/core";
import FormControl from "@material-ui/core/FormControl";
import InputLabel from "@material-ui/core/InputLabel";
import Select from "@material-ui/core/Select";
import TextField from "@material-ui/core/TextField";
import { obtenerTipoUnidadesId } from '../../Util/Contexts/TipoUnidadContext';
window.jQuery = window.$ = $;
const headers = {
    'Content-Type': 'application/json',
    //    'access-control-allow-origin': '*'
}

class AgregarTipoUnidad extends Component {

    constructor(props) {
        super(props);
        this.state = {
            currenttipoUnidad: null,
            idTipoUnidad: props.idTipoUnidad,
            edit: props.edit,
            tarifaKMSDolares: '',
            tarifaKMSPesos: '',
            tipoUnidad: ''
        }

        if (props.edit) {
            this.handleShowConsultar(props.idTipoUnidad)
        }

        console.log(props)
        this.handleChange = this.handleChange.bind(this);
        this.onSubmit = this.onSubmit.bind(this)
        this.handleShowConsultar = this.handleShowConsultar.bind(this);
    }

    onSubmit(event) {
        event.preventDefault()
        this.props.onSubmit(this.state)
    }

    handleChange = (event) => {
        event.preventDefault();
        this.setState({
            [event.target.name]: event.target.value,
        });
    };

    handleShowConsultar(id) {
        obtenerTipoUnidadesId(id).then(respuesta => {
            console.log(respuesta.data)
            this.setState({
                tarifaKMSDolares: respuesta.data.m_cyTarifaPorKMS,
                tarifaKMSPesos: respuesta.data.m_cyTarifaPorKMSDlls,
                tipoUnidad: respuesta.data.m_sTipoUnidad
            })
        });
    }

    render() {
        return (
            <form className="j-forms" onSubmit={this.onSubmit}>
                <div className="main-container" style={{ marginLeft: "0px", padding: "0px" }}>
                    <div className="widget-wrap">
                        <div className="widget-content">
                <div className="row" >
                    <div className="col-sm-12 col-md-4 col-lg-4 unit">
                        <div className="input">
                            <TextField variant="outlined" margin="dense"
                                       onChange={this.handleChange}
                                       className="form-control"
                                       type="text"
                                       required
                                       label="Tipo de Unidad"
                                       value={this.state.tipoUnidad}
                                       name={"tipoUnidad"}
                                       id="tipoUnidad"
                            />
                        </div>
                    </div>

                    <div className="col-sm-6 col-md-4 col-lg-4 unit">
                        <div className="input">
                            <TextField variant="outlined" margin="dense"
                                       onChange={this.handleChange}
                                       className="form-control"
                                       type="number"
                                       required
                                       label="Tarifa x KMS Pesos"
                                       value={this.state.tarifaKMSPesos}
                                       name={"tarifaKMSPesos"}
                                       id="tarifaKMSPesos"
                            />
                        </div>
                    </div>

                    <div className="col-sm-6 col-md-4 col-lg-4 unit">
                        <div className="input">
                            <TextField variant="outlined" margin="dense"
                                       onChange={this.handleChange}
                                       className="form-control"
                                       type="number"
                                       required
                                       label="Tarifa x KMS Dólares"
                                       value={this.state.tarifaKMSDolares}
                                       name={"tarifaKMSDolares"}
                                       id="tarifaKMSDolares"
                            />
                        </div>
                    </div>
                </div>

                <div className={"row"}>
                    <div className="col-sm-12 col-md-12 col-lg-12 unit">
                    <button className="btn btn-secondary secondary-btn" onClick={this.props.onClose}>Cancelar</button>

                    <button className="btn btn-primary primary-btn" type={"submit"} >Aceptar</button>
                    </div>
                </div>
                        </div>
                    </div>
                </div>
            </form>
        );
    }
}

AgregarTipoUnidad.propTypes = {

};

export default AgregarTipoUnidad;