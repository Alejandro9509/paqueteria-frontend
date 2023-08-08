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
import {Button, Dialog, DialogActions, DialogContent, DialogTitle, Grid, IconButton, InputAdornment} from "@material-ui/core";
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
function showSuccess(mensaje) {
    new Noty({
        type: "information",
        layout: "topCenter",
        text: mensaje,
        timeout: "3000"
    }).show()
}


class AgregarFormatoImpresion extends Component {

    constructor(props) {
        super(props);
        this.state = {
            formato: "",
            dataTipoDocumento: [],
            file: [],
            image: []
        }

        this.handleChange = this.handleChange.bind(this);
        this.getAllTipoDocumento = this.getAllTipoDocumento.bind(this)
        this.onSubmit = this.onSubmit.bind(this)
    }


    componentDidMount() {
        this.getAllTipoDocumento()
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
        console.log(event.target.value)
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
                                                   value={this.state.formato}
                                                   name={"formato"}
                                                   id="formato"
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
                                                <option
                                                    key={42}
                                                    value={42}
                                                >
                                                    Viajes Paquetería
                                                </option>
                                                <option
                                                    key={43}
                                                    value={43}
                                                >
                                                    Viajes Cliente TXT
                                                </option>
                                                <option
                                                    key={44}
                                                    value={44}
                                                >
                                                    Viajes Cliente EXCEL
                                                </option>
                                                <option
                                                    key={210}
                                                    value={210}
                                                >
                                                   Recolección
                                                </option>
                                                <option
                                                    key={211}
                                                    value={211}
                                                >
                                                    Embarque
                                                </option>
                                                <option
                                                    key={212}
                                                    value={212}
                                                >
                                                    Guía
                                                </option>
                                                <option
                                                    key={213}
                                                    value={213}
                                                >
                                                    Guía Etiqueta
                                                </option>
                                                {
                                                    localStorage.getItem("RFC")==="ECC9510049KA" &&
                                                    <option
                                                        key={222}
                                                        value={222}
                                                    >
                                                        Informe
                                                    </option>
                                                }
                                                {
                                                    localStorage.getItem("RFC")!=="ECC9510049KA" &&
                                                    <option
                                                        key={214}
                                                        value={214}
                                                    >
                                                        Informe
                                                    </option>
                                                }

                                                <option
                                                    key={215}
                                                    value={215}
                                                >
                                                    Informe Última Milla
                                                </option>
                                                <option
                                                    key={216}
                                                    value={216}
                                                >
                                                    CFDI Primera Milla
                                                </option>
                                                <option
                                                    key={217}
                                                    value={217}
                                                >
                                                    CFDI Última Milla
                                                </option>
                                                <option
                                                    key={218}
                                                    value={218}
                                                >
                                                    CFDI Timbrado Viajes
                                                </option>
                                                <option
                                                    key={219}
                                                    value={219}
                                                >
                                                    Corte de Caja
                                                </option>
                                                <option
                                                    key={220}
                                                    value={220}
                                                >
                                                    Corte de Caja General
                                                </option>
                                            </Select>
                                        </FormControl>
                                    </label>
                                </div>

                            </div>

                            <div className="row">

                                <div className="col-sm-6 col-md-6 col-lg-6 unit">
                                    <label className="input">
                                    <input type="file" id="file" accept=".WDE, .wde" onChange={(e) => {if(e.target.files.length > 1) { showSuccess("Debe adjuntar solo un archivo")}else { this.setState({file: e.target.files})}}} style={{display: "none"}} />
                                    <TextField variant="outlined" margin="dense"
                                                   onChange={this.handleChange}
                                                   className="form-control"
                                                   type="text"
                                                   required
                                                   disabled={true}
                                                   label="Archivo WDE"
                                                   value={this.state.file.length !== 0 ? this.state.file[0].name : ""}
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
                                    <input type="file" id="image" accept="image/*" onChange={(e) => {if(e.target.files.length > 1) { showSuccess("Debe adjuntar solo una imagen")}else { this.setState({image: e.target.files})}}}  style={{display: "none"}} />
                                        <TextField variant="outlined" margin="dense"
                                                   className="form-control"
                                                   type="text"
                                                   disabled={true}
                                                   label="Archivo Imagen"
                                                   value={this.state.image.length !== 0 ? this.state.image[0].name : ""}
                                                   name={"nombreImagen"}
                                                   InputProps={{
                                                    endAdornment:
                                                 <InputAdornment position="end">
                                                   <IconButton
                                                   onClick={() => document.getElementById("image").click()}
                                                     edge="end"
                                                   >
                                                     <CloudUploadIcon color="primary" fontSize="large" />
                                                   </IconButton>
                                                 </InputAdornment>
                                               
                                             }}
                                        />
                                    </div>
                                </div>

                            </div>

                            {/*<div className="row" >*/}
                            {/*    <InputLabel> *Estos folios son internos para llevar una administración de los comprobantes fiscales, ya que el folio digital se obtiene al momento de hacer un timbre y son 36 dígitos" </InputLabel>*/}
                            {/*</div>*/}

          
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

AgregarFormatoImpresion.propTypes = {};

export default AgregarFormatoImpresion;