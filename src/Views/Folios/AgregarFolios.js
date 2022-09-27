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
import {Button, Dialog, DialogActions, DialogContent, DialogTitle, Grid} from "@material-ui/core";
import FormControl from "@material-ui/core/FormControl";
import InputLabel from "@material-ui/core/InputLabel";
import Select from "@material-ui/core/Select";
import TextField from "@material-ui/core/TextField";
import { obtenerSucursales } from '../../Util/Contexts/SucursalContext';

window.jQuery = window.$ = $;
const headers = {
    'Content-Type': 'application/json',
    //    'access-control-allow-origin': '*'
}

class AgregarFolio extends Component {

    constructor(props) {
        super(props);
        this.state = {
            dataSucursal: [],
            dataTipoDocumento: [],
            dataFormatoImpresion: [],
            data: [],
            idTipoDocumentoAgregar: '',
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
        obtenerSucursales().then((respuesta) => {
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
                                    <label className="input select">
                                        <FormControl fullWidth variant="outlined" margin="dense">
                                            <InputLabel id="idSucursalAgregarLabel">Sucursal</InputLabel>
                                            <Select
                                                labelId="idSucursalAgregarLabel"
                                                className="form-control"
                                                required
                                                value={this.state.idSucursalAgregar}
                                                onChange={this.handleChange}
                                                id="idSucursalAgregar"
                                                name={"idSucursalAgregar"}
                                                label="Sucursal"
                                            >
                                                {this.state.dataSucursal.map((sucursal) => (
                                                    <option
                                                        key={sucursal.m_nIdSucursal}
                                                        value={sucursal.m_nIdSucursal}
                                                    >
                                                        {sucursal.m_sSucursal}
                                                    </option>
                                                ))}
                                            </Select>
                                        </FormControl>
                                    </label>
                                </div>

                                <div className="col-sm-6 col-md-6 col-lg-6 unit">
                                    <label className="input select">
                                        <FormControl fullWidth variant="outlined" margin="dense">
                                            <InputLabel id="idTipoDocumentoAgregarLabel">Tipo de Documento</InputLabel>
                                            <Select
                                                labelId="idTipoDocumentoAgregarLabel"
                                                className="form-control"
                                                required
                                                value={this.state.idTipoDocumentoAgregar}
                                                onChange={this.handleChange}
                                                id="idTipoDocumentoAgregar"
                                                name={"idTipoDocumentoAgregar"}
                                                label="Tipo de Documento"
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
                                        <FormControl fullWidth variant="outlined" margin="dense">
                                            <InputLabel id="idFormatoImpresionLabel">Formato Impresión</InputLabel>
                                            <Select
                                                labelId="idFormatoImpresionLabel"
                                                className="form-control"
                                                required
                                                value={this.state.idFormatoImpresion}
                                                onChange={this.handleChange}
                                                id="idFormatoImpresion"
                                                name={"idFormatoImpresion"}
                                                label="Formato Impresión"
                                            >
                                                {this.state.dataFormatoImpresion.map((sucursal) => (
                                                    <option
                                                        key={sucursal.m_nIdFormato}
                                                        value={sucursal.m_nIdFormato}
                                                    >
                                                        {sucursal.m_sFormato}
                                                    </option>
                                                ))}
                                            </Select>
                                        </FormControl>
                                    </label>
                                </div>

                                <div className="col-sm-6 col-md-6 col-lg-6 unit">
                                    <div className="input">
                                        <TextField variant="outlined" margin="dense"
                                                   onChange={this.handleChange}
                                                   className="form-control"
                                                   type="text"
                                                   required
                                                   label="Serie"
                                                   value={this.state.serie}
                                                   name={"serie"}
                                                   id="serie"
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


                            <div className="form-footer ol-md-12">
                                    <Grid container spacing={1}>
                                        <Grid item xs>
                                             <Button fullWidth className="btn btn-secondary secondary-btn"
                                            onClick={this.props.onClose}>Cancelar
                                             </Button>

                                        </Grid>
                                        <Grid item xs>
                                             <Button fullWidth className="btn btn-primary primary-btn" type={"submit"}>Aceptar</Button>
                                        </Grid>
                                    </Grid>
                                </div>
                        </div>
                    </div>
                </div>
            </form>
        );
    }
}

AgregarFolio.propTypes = {};

export default AgregarFolio;