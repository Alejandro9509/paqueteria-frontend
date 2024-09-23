import React, {Component} from 'react';
import PropTypes from 'prop-types';
import Cabecera from '../../Components/Template/Cabecera';
import BarraLateralIzquierda from '../../Components/Template/BarraLateralIzquierda';
import Noty from 'noty';
import axios from "axios";
import SvgIcon from "@mui/material/SvgIcon";
import {ReactComponent as Activo} from "../../iconos/Menu/palomita.svg";
import {ReactComponent as NoActivo} from "../../iconos/Menu/cruz.svg";
import $ from "jquery";
import {
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    Grid,
    IconButton,
    InputAdornment,
    MenuItem
} from "@mui/material";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import Select from "@mui/material/Select";
import TextField from "@mui/material/TextField";
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import {
    obtenerFormatosImpresionId,
    obtenerFormatosImpresionProceso
} from "../../Util/Contexts/FormatosImpresionContext";
import DownloadIcon from "@mui/icons-material/GetAppRounded";

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
            idTipoProcesoAgregar:"",
            dataTipoDocumento: [],
            file: [],
            image: [],
            modificadoEl:""
        }

        this.handleChange = this.handleChange.bind(this);
        this.getAllTipoDocumento = this.getAllTipoDocumento.bind(this)
        this.onSubmit = this.onSubmit.bind(this)
    }


    componentDidMount() {
        if(this.props.id>0){
            obtenerFormatosImpresionId(this.props.id).then(respuesta => {
                this.setState({
                    formato:respuesta.data[0].m_sFormato,
                    idTipoProcesoAgregar:respuesta.data[0].m_nTipoProceso,
                    file: {
                        length:1,
                        [0]:{
                            name:respuesta.data[0].m_sNombreArchivo,
                            file:respuesta.data[0].m_sFormatoWDE
                        }
                    },
                    modificadoEl:respuesta.data[0].m_sModificadoEl
                })
            })
        }
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
        this.props.onSubmit(this.props.id,this.state)
    }

    handleChange = (event) => {
        event.preventDefault();
        console.log(event.target.value)
        this.setState({
            [event.target.name]: event.target.value,
        });
    };

    handleDownloadWDE = (file) => {
        let a = document.createElement("a");
        a.href = "data:application/pdf;base64," + file.file;
        a.download = file.name;
        a.click();
    }

    handleDownloadImage = (file) => {
        let a = document.createElement("a");
        a.href = "data:image/png;base64," + file.file;
        a.download = file.name;
        a.click();
    }

    render() {
        return (
            <form className="j-forms" onSubmit={this.onSubmit}>
                <div className="main-container" style={{marginLeft: "0px", padding: "0px"}}>
                    <div className="widget-wrap">
                        <div className="widget-content">
                            <div className="row">

                                <div className="col-sm-6 col-md-6 col-lg-6 unit">
                                    <label className="input">
                                        <TextField variant="outlined" size="small"
                                                   onChange={this.handleChange}
                                                   className="form-control"
                                                   type="text"
                                                   fullWidth
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
                                        <FormControl fullWidth variant="outlined" size="small">
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
                                                <MenuItem
                                                    key={42}
                                                    value={42}
                                                >
                                                    Viajes Paquetería
                                                </MenuItem>
                                                <MenuItem
                                                    key={43}
                                                    value={43}
                                                >
                                                    Viajes Cliente TXT
                                                </MenuItem>
                                                <MenuItem
                                                    key={44}
                                                    value={44}
                                                >
                                                    Viajes Cliente EXCEL
                                                </MenuItem>
                                                <MenuItem
                                                    key={210}
                                                    value={210}
                                                >
                                                    Recolección
                                                </MenuItem>
                                                <MenuItem
                                                    key={211}
                                                    value={211}
                                                >
                                                    Embarque
                                                </MenuItem>
                                                <MenuItem
                                                    key={212}
                                                    value={212}
                                                >
                                                    Guía
                                                </MenuItem>
                                                <MenuItem
                                                    key={213}
                                                    value={213}
                                                >
                                                    Guía Etiqueta
                                                </MenuItem>
                                                {
                                                    localStorage.getItem("RFC") === "ECC9510049KA" &&
                                                    <MenuItem
                                                        key={222}
                                                        value={222}
                                                    >
                                                        Informe
                                                    </MenuItem>
                                                }
                                                {
                                                    localStorage.getItem("RFC") !== "ECC9510049KA" &&
                                                    <MenuItem
                                                        key={214}
                                                        value={214}
                                                    >
                                                        Informe
                                                    </MenuItem>
                                                }

                                                <MenuItem
                                                    key={215}
                                                    value={215}
                                                >
                                                    Informe Última Milla
                                                </MenuItem>
                                                <MenuItem
                                                    key={216}
                                                    value={216}
                                                >
                                                    CFDI Primera Milla
                                                </MenuItem>
                                                <MenuItem
                                                    key={217}
                                                    value={217}
                                                >
                                                    CFDI Última Milla
                                                </MenuItem>
                                                <MenuItem
                                                    key={218}
                                                    value={218}
                                                >
                                                    CFDI Timbrado Viajes
                                                </MenuItem>
                                                <MenuItem
                                                    key={219}
                                                    value={219}
                                                >
                                                    Corte de Caja
                                                </MenuItem>
                                                <MenuItem
                                                    key={220}
                                                    value={220}
                                                >
                                                    Corte de Caja General
                                                </MenuItem>
                                                <MenuItem
                                                    key={223}
                                                    value={223}
                                                >
                                                    Guía Etiqueta Rangos
                                                </MenuItem>
                                            </Select>
                                        </FormControl>
                                    </label>
                                </div>

                            </div>

                            <div className="row">

                                <div className="col-sm-6 col-md-6 col-lg-6 unit">
                                    <label className="input">
                                        <input type="file" id="file" accept=".WDE, .wde" onChange={(e) => {
                                            if (e.target.files.length > 1) {
                                                showSuccess("Debe adjuntar solo un archivo")
                                            } else {
                                                this.setState({file: e.target.files})
                                            }
                                        }} style={{display: "none"}
                                        }/>
                                        <TextField variant="outlined" size="small"
                                                   onChange={this.handleChange}
                                                   className="form-control"
                                                   type="text"
                                                   required
                                                   fullWidth
                                                   disabled={true}
                                                   label="Archivo WDE"
                                                   value={this.state.file.length !== 0 ? this.state.file[0].name : ""}
                                                   name={"file"}
                                                   InputProps={{
                                                       endAdornment:
                                                           <InputAdornment position="end">
                                                               {
                                                                   this.props.id === 0 ?
                                                                   <IconButton
                                                                       onClick={() => document.getElementById("file").click()}
                                                                       edge="end"
                                                                       size="large">
                                                                       <CloudUploadIcon color="primary" fontSize="large"/>
                                                                   </IconButton> :
                                                                   <IconButton
                                                                       onClick={() => this.handleDownloadWDE(this.state.file[0])}
                                                                       edge="end"
                                                                       size="large">
                                                                       <DownloadIcon color="primary" fontSize="large"/>
                                                                   </IconButton>
                                                               }

                                                           </InputAdornment>

                                                   }}
                                        />
                                    </label>
                                </div>

                                <div className="col-sm-6 col-md-6 col-lg-6 unit">
                                    <div className="input">
                                        <input type="file" id="image" accept="image/*" onChange={(e) => {
                                            if (e.target.files.length > 1) {
                                                showSuccess("Debe adjuntar solo una imagen")
                                            } else {
                                                this.setState({image: e.target.files})
                                            }
                                        }} style={{display: "none"}}/>
                                        <TextField variant="outlined" size="small"
                                                   className="form-control"
                                                   type="text"
                                                   disabled={true}
                                                   label="Archivo Imagen"
                                                   fullWidth
                                                   value={this.state.image.length !== 0 ? this.state.image[0].name : ""}
                                                   name={"nombreImagen"}
                                                   InputProps={{
                                                       endAdornment:
                                                           <InputAdornment position="end">
                                                               {
                                                                   this.props.id === 0 &&
                                                                   <IconButton
                                                                       disabled={this.props.id > 0}
                                                                       onClick={() => document.getElementById("image").click()}
                                                                       edge="end"
                                                                       size="large">
                                                                       <CloudUploadIcon color="primary" fontSize="large"/>
                                                                   </IconButton>
                                                               }

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
                                        <Button fullWidth className="btn btn-primary primary-btn"
                                                type={"submit"}>Aceptar</Button>
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