import React, {Component} from 'react';
import PropTypes from 'prop-types';
import Cabecera from '../../Components/Template/Cabecera';
import BarraLateralIzquierda from '../../Components/Template/BarraLateralIzquierda';
import Noty from 'noty';
import axios from "axios";
import SvgIcon from "@material-ui/core/SvgIcon";
import {ReactComponent as Activo} from "../../iconos/Menu/palomita.svg";
import {ReactComponent as NoActivo} from "../../iconos/Menu/cruz.svg";
import {DataGrid} from '@material-ui/data-grid';
import $ from "jquery";
import {Dialog, DialogActions, DialogContent, DialogTitle, IconButton, InputAdornment} from "@material-ui/core";
import FormControl from "@material-ui/core/FormControl";
import InputLabel from "@material-ui/core/InputLabel";
import Select from "@material-ui/core/Select";
import TextField from "@material-ui/core/TextField";
import CloudUploadIcon from '@material-ui/icons/CloudUpload';

window.jQuery = window.$ = $;
const headers = {
    'Content-Type': 'application/json',
    //    'access-control-allow-origin': '*'
}

class AgregarFormatoImpresion extends Component {

    constructor(props) {
        super(props);
        this.state = {
            dataSucursal: [],
            dataTipoDocumento: [],
            dataFormatoImpresion: [],
            data: [],
            idSucursalAgregar: localStorage.getItem("Sucursal"),
            idFormatoImpresion: '',
            folioFinal: '',
            folioInicial: '',
            serie: ''
        }

        this.handleChange = this.handleChange.bind(this);
        this.getAllDataFormato = this.getAllDataFormato.bind(this)
        this.getAllSucursales = this.getAllSucursales.bind(this)
        this.getAllFormatoImpresion = this.getAllFormatoImpresion.bind(this)
        this.getAllTipoDocumento = this.getAllTipoDocumento.bind(this)
        this.onSubmit = this.onSubmit.bind(this)
    }


    componentDidMount() {
        this.getAllDataFormato()
        this.getAllSucursales()
        this.getAllFormatoImpresion()
        this.getAllTipoDocumento()
    }

    getAllDataFormato() {
        const url = `${process.env.REACT_APP_API_URL}/Formato/GetListado`;
        axios.get(url, {headers}).then(respuesta => {
            this.setState({dataFormatoImpresion: respuesta.data})
        });
    }

    getAllSucursales() {
        const url = `${process.env.REACT_APP_API_URL}/Sucursales/GetListado`;
        axios.get(url, {headers}).then((respuesta) => {
            this.setState({dataSucursal: respuesta.data})
        });
    }

    getAllFormatoImpresion() {
        const url = `${process.env.REACT_APP_API_URL}/Formato/GetListado`;
        axios.get(url, {headers}).then((respuesta) => {
            this.setState({dataFormatoImpresion: respuesta.data})
        });
    }

    getAllTipoDocumento() {
        const url = `${process.env.REACT_APP_API_URL}/TipoDocumento/GetListado`;
        axios.get(url, {headers}).then((respuesta) => {
            this.setState({dataTipoDocumento: respuesta.data})
        });
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

    render() {
        return (
            <form className="j-forms" onSubmit={this.onSubmit}>
                <div className="main-container" style={{marginLeft: "0px", padding: "0px"}}>
                    <div className="widget-wrap">
                        <div className="widget-content">
                            <div className="row">

                                <div className="col-sm-6 col-md-6 col-lg-6 unit">
                                    <label className="input">
                                    <TextField variant="outlined" margin="dense"
                                                   onChange={this.handleChange}
                                                   className="form-control"
                                                   type="text"
                                                   required
                                                   label="Formato"
                                                   value={this.state.formtao}
                                                   name={"serie"}
                                                   id="formtao"
                                        />
                                    </label>
                                </div>

                                <div className="col-sm-6 col-md-6 col-lg-6 unit">
                                    <label className="input select">
                                        <FormControl fullWidth variant="outlined" margin="dense">
                                            <InputLabel id="idTipoProcesoAgregarLabel">Tipo de Proceso</InputLabel>
                                            <Select
                                                labelId="idTipoProcesoAgregarLabel"
                                                className="form-control"
                                                required
                                                value={this.state.idTipoProcesoAgregar}
                                                onChange={this.handleChange}
                                                id="idTipoProcesoAgregar"
                                                name={"idTipoProcesoAgregar"}
                                                label="Tipo de Proceso"
                                            >
                                                {this.state.dataTipoDocumento.map((tipoDocumento) => (
                                                    <option
                                                        key={tipoDocumento.m_nIdTipoDocumento}
                                                        value={tipoDocumento.m_nIdTipoDocumento}
                                                    >
                                                        {tipoDocumento.m_sTipoDocumento}
                                                    </option>
                                                ))}
                                            </Select>
                                        </FormControl>
                                    </label>
                                </div>

                            </div>

                            <div className="row">

                                <div className="col-sm-6 col-md-6 col-lg-6 unit">
                                    <label className="input select">
                                    <input type="file" id="file" style={{display: "none"}} />
                                    <TextField variant="outlined" margin="dense"
                                                   onChange={this.handleChange}
                                                   className="form-control"
                                                   type="text"
                                                   required
                                                   label="Archivo WDE"
                                                   value={this.state.nombre}
                                                   name={"file"}
                                                   InputProps={{
                                                       endAdornment:
                                                    <InputAdornment position="end">
                                                      <IconButton
                                                      onClick={() => document.getElementById("file").click()}
                                                        edge="end"
                                                      >
                                                        <CloudUploadIcon color="primary" fontSize="large" />
                                                      </IconButton>
                                                    </InputAdornment>
                                                  
                                                }}
                                        />
                                    </label>
                                </div>

                                <div className="col-sm-6 col-md-6 col-lg-6 unit">
                                    <div className="input">
                                        <TextField variant="outlined" margin="dense"
                                                   onChange={this.handleChange}
                                                   className="form-control"
                                                   type="text"
                                                   required
                                                   label="Nombre del archivo"
                                                   value={this.state.nombre}
                                                   name={"nombre"}
                                                   id="nombre"
                                        />
                                    </div>
                                </div>
                            </div>

                            <div className="row">

                                <div className="col-sm-6 col-md-6 col-lg-6 unit">
                                    <div className="input">
                                        <TextField variant="outlined" margin="dense"
                                                   onChange={this.handleChange}
                                                   className="form-control"
                                                   type="number"
                                                   required
                                                   label="Folio Inicial"
                                                   value={this.state.folioInicial}
                                                   name={"folioInicial"}
                                                   id="folioInicial"
                                        />
                                    </div>
                                </div>

                                <div className="col-sm-6 col-md-6 col-lg-6 unit">
                                    <div className="input">
                                        <TextField variant="outlined" margin="dense"
                                                   onChange={this.handleChange}
                                                   className="form-control"
                                                   type="number"
                                                   required
                                                   label="Folio Final"
                                                   value={this.state.folioFinal}
                                                   name={"folioFinal"}
                                                   id="folioFinal"
                                        />
                                    </div>
                                </div>
                            </div>

                            {/*<div className="row" >*/}
                            {/*    <InputLabel> *Estos folios son internos para llevar una administración de los comprobantes fiscales, ya que el folio digital se obtiene al momento de hacer un timbre y son 36 dígitos" </InputLabel>*/}
                            {/*</div>*/}

                            <div className={"row"}>
                                <div className="col-sm-12 col-md-12 col-lg-12 unit">
                                    <button className="btn btn-secondary secondary-btn"
                                            onClick={this.props.onClose}>Cancelar
                                    </button>

                                    <button className="btn btn-primary primary-btn" type={"submit"}>Aceptar</button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </form>
        );
    }
}

AgregarFormatoImpresion.propTypes = {};

export default AgregarFormatoImpresion;