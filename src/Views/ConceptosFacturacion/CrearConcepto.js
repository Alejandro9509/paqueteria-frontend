import React, { Component } from "react";
import PropTypes from "prop-types";
import axios from "axios";
import {
    Checkbox,
    FormControlLabel, Grid,
    List,
    ListItem,
    TextField,
} from "@material-ui/core";
import {
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    Tooltip,
} from "@material-ui/core";
import ClavesCFDI from "./ClavesCFDI";
import { obtenerImpuestos } from "../../Util/Contexts/ImpuestosContext";
import {
    obtenerSATEmbalajes,
    obtenerSATServicios,
    obtenerSATUnidades,
} from "../../Util/Contexts/ConceptosFacturacionContext";

class CrearConcepto extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isProducto: true,
            complementoSAT: 0,
            codigo: props.edit ? props.select.m_sCodigo : "",
            concepto: props.edit ? props.select.m_sConcepto : "",
            unidadMedida: props.edit ? props.select.m_sUnidadMedida : "",
            openDialog: false,
            claseSeleccionado: {},
            claveSAT: this.props.edit ? this.props.select.m_nIdProdServSAT : 0,
            claveSATUnidad: 0,
            descripcionUnidad:"",
            catalogoUnidad:"",
            claveSATEmbalaje: '',
            descripcionEmbalaje:"",
            catalogoEmbalaje:"",
            productoOServicio: this.props.edit ? this.props.select.m_sClase : "",
            dataSAT: [],
            dataUnidades: [],
            dataEmbalajes:[],
            impuestos: [],
            impuestosRetencion: [],
            rangoMinimo: props.edit ? props.select.m_nRangoMinimo : 0,
            rangoMaximo: props.edit ? props.select.m_nRangoMaximo : 0,
            impuestosSeleccionadosTraslado: props.edit
                ? props.select.arClsDetalle
                : [],
            predeterminadoSeleccionadosTraslado: {},
            impuestosSeleccionadosRetencion: props.edit
                ? props.select.arClsDetalle
                : [],
            predeterminadoSeleccionadosRetencion: {},
            activo: props.edit ? props.select.m_bActivo : false,
            incluirIngresosLiquidacion: props.edit
                ? props.select.m_bCalculoIngreso
                : false,
            incluirLiquidacionFlete: props.edit
                ? props.select.m_bCalculoFlete
                : false,
            unidadMedia: props.edit ? props.select.m_sUnidadMedida : "",
            getAllData: props.getAllData,
        };

        this.handleChange = this.handleChange.bind(this);
        this.getAllImpuestos = this.getAllImpuestos.bind(this);
        this.getAllSATServicios = this.getAllSATServicios.bind(this);
        this.getAllSATUnidades = this.getAllSATUnidades.bind(this);
        this.getAllSATEmbalajes = this.getAllSATEmbalajes.bind(this);
        this.onSubmit = this.onSubmit.bind(this);
        this.selectClase = this.selectClase.bind(this);
        this.closeDialog = this.closeDialog.bind(this);
    }

    componentDidMount() {
        /*if(!this.props.consulta){
            this.setState({
                claveSAT:this.props.dataComplemento.claveProducto,
                productoOServicio:this.props.dataComplemento.ProductoSAT,
                claveSATUnidad: this.props.dataComplemento.claveUnidad,
                descripcionUnidad:this.props.dataComplemento.UnidadSAT,
            })
            //this.getAllImpuestos();
            // this.setState({dataUnidades:this.props.dataSATUnidades})
            // this.setState({dataSAT:this.props.dataSAT})
        }*/
    }

    getAllImpuestos() {
        obtenerImpuestos().then((respuesta) => {
            this.setState({
                impuestos: respuesta.data.filter((i) => i.m_nTIpoCalculo === 0),
                impuestosRetencion: respuesta.data.filter(
                    (i) => i.m_nTIpoCalculo === 1
                ),
            });
        });
    }

    getAllSATServicios() {
        obtenerSATServicios().then((respuesta) => {
            this.setState({ dataSAT: respuesta.data });
        });
    }

    getAllSATUnidades() {
        obtenerSATUnidades().then((respuesta) => {
            this.setState({ dataUnidades: respuesta.data });
        });
    }

    getAllSATEmbalajes() {
        obtenerSATEmbalajes().then((respuesta) => {
            this.setState({ dataEmbalajes: respuesta.data });
        });
    }

    handleChange(event) {
        this.setState({
            [event.target.name]: event.target.value,
        });
    }

    onSubmit(event) {
        event.preventDefault();
        //   this.props.onSubmit(this.state)
    }

    selectClase(row) {
        /*if (this.state.complementoSAT === 1) {
            this.setState({
                claseSeleccionado: row.data,
                claveSAT: row.data.m_sClaveSAT,
                productoOServicio: row.data.m_sDescripcion,
            });
        } else if (this.state.complementoSAT === 2){
            this.setState({
                claveSATUnidad: row.data.m_sClaveSAT,
                descripcionUnidad:row.data.m_sDescripcion,
                catalogoUnidad:row.data.m_sCatalogoSAT,
            })
        }else if (this.state.complementoSAT === 3){
            this.setState({
                claveSATEmbalaje: row.data.m_sClaveSAT,
                descripcionEmbalaje:row.data.m_sDescripcion,
                catalogoEmbalaje:row.data.m_sCatalogoSAT,
            })
        }*/
        this.props.onChangeData(this.state.complementoSAT, row.data)
    }

    closeDialog() {
        this.setState({ openDialog: false });
    }

    Consulta = () =>{
        return(
            <>
                <div className="form-content j-forms">
                    <div className="main-container" style={{margin: "0px", padding: "0px"}}>
                        <div className="row" style={{ margin: "0px" }}>
                            <div className="col-sm-12 col-md-12 col-lg-12 unit" style={{ backgroundColor: "#E6E6E6", padding: "2px" }}>
                                <label
                                    className="label"
                                    style={{
                                        textAlign: "center",
                                        width: "100%",
                                        color: "#717171",
                                    }}
                                >
                                    <strong>Sección Claves CFDI</strong>
                                </label>
                            </div>
                        </div>
                        <div className="row" style={{ margin: "0px" }}>
                            <div
                                className="col-sm-4 col-md-4 col-lg-4 unit"
                                style={{ padding: "2px" }}
                            >
                                <div className="input">
                                    <TextField
                                        variant="outlined"
                                        margin="dense"
                                        type="text"
                                        className="form-control"
                                        label="Clave SAT"
                                        disabled={this.props.consulta}
                                        defaultValue={`${this.props.dataComplemento.claveProducto}`}
                                        name="unidadMedia"
                                        InputProps={{
                                            readOnly: true,
                                        }}
                                    />
                                </div>
                            </div>

                            <div
                                className="col-sm-8 col-md-8 col-lg-8 unit"
                                style={{ padding: "2px" }}
                            >
                                <div className="input">
                                    <TextField
                                        variant="outlined"
                                        margin="dense"
                                        type="text"
                                        className="form-control"
                                        label="Producto o Servicio"
                                        disabled={this.props.consulta}
                                        defaultValue={`${this.props.dataComplemento.ProductoSAT}`}
                                        name="unidadMedia"
                                        InputProps={{
                                            readOnly: true,
                                        }}
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="row" style={{ margin: "0px" }}>
                            <div
                                className="col-sm-4 col-md-4 col-lg-4 unit"
                                style={{ padding: "2px" }}
                            >
                                <div className="input">
                                    <TextField
                                        variant="outlined"
                                        margin="dense"
                                        type="text"
                                        className="form-control"
                                        label="Clave SAT"
                                        disabled={this.props.consulta}
                                        defaultValue={`${this.props.dataComplemento.claveUnidad}`}
                                        name="unidadMedia"
                                        InputProps={{
                                            readOnly: true,
                                        }}
                                    />
                                </div>
                            </div>

                            <div
                                className="col-sm-8 col-md-8 col-lg-8 unit"
                                style={{ padding: "2px" }}
                            >
                                <div className="input">
                                    <TextField
                                        variant="outlined"
                                        margin="dense"
                                        className="form-control"
                                        type="text"
                                        label="Unidad Medida"
                                        disabled={this.props.consulta}
                                        required
                                        defaultValue={`${this.props.dataComplemento.UnidadSAT}`}
                                        name="unidadMedida"
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="row" style={{ margin: "0px" }}>
                            <div className="col-sm-4 col-md-4 col-lg-4 unit" style={{ padding: "2px" }}>
                                <div className="input">
                                    <TextField
                                        variant="outlined"
                                        margin="dense"
                                        type="text"
                                        className="form-control"
                                        label="Clave SAT"
                                        disabled
                                        defaultValue={`${this.props.dataComplemento.claveEmbalaje}`}
                                        name="claveEmbalaje"
                                    />
                                </div>
                            </div>

                            <div className="col-sm-8 col-md-8 col-lg-8 unit" style={{ padding: "2px" }}>
                                <div className="input">
                                    <TextField
                                        variant="outlined"
                                        margin="dense"
                                        className="form-control"
                                        type="text"
                                        label="Embalaje"
                                        disabled
                                        required
                                        value={`${this.props.dataComplemento.embalajeSAT}`}
                                        name="embalajeSAT"
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                {this.props.children}
                <DialogActions>
                    <div style={{ display: "flex", justifyContent: "space-between" }}>
                        <button
                            type="button"
                            onClick={() => this.props.dialogVisible(false)}
                            className="btn btn-secondary secondary-btn"
                            style={{ marginRight: "20px" }}
                        >
                            Cancelar
                        </button>
                    </div>
                </DialogActions>
            </>
        )
    }

    render() {
        const { openDialog } = this.state;
        return (
            <div>
                <form className="j-forms">
                    <Dialog
                        open={openDialog}
                        fullWidth
                        maxWidth="xl"
                        onClose={() => this.setState({openDialog: false})}
                    >
                        <DialogTitle>Claves Productos y Servicios</DialogTitle>
                        <DialogContent>
                            <ClavesCFDI
                                selectClase={this.selectClase}
                                closeDialog={this.closeDialog}
                                dataSAT={this.state.complementoSAT === 1 ? this.props.dataSAT : this.state.complementoSAT === 2 ? this.props.dataSATUnidades : this.state.complementoSAT === 3 ? this.props.dataSATEmbalajes : []}
                                // isProducto={this.state.isProducto}
                            />
                        </DialogContent>
                    </Dialog>

                    <div className="form-content">
                        <div className="main-container" style={{margin: "0px", padding: "0px"}}>
                            <div className="row" style={{margin: "0px"}}>
                                <div className="col-sm-12 col-md-12 col-lg-12 unit"
                                     style={{backgroundColor: "#E6E6E6", padding: "2px"}}>
                                    <label className="label"
                                           style={{textAlign: "center", width: "100%", color: "#717171",}}>
                                        <strong>Sección Claves CFDI</strong>
                                    </label>
                                </div>
                            </div>

                            <Grid container spacing={1}>
                                <Grid item xs={2}>
                                    <TextField
                                        variant="outlined"
                                        margin="dense"
                                        type="text"
                                        className="form-control"
                                        label="Clave SAT"
                                        disabled={this.props.consulta}
                                        value={this.props.dataComplemento.claveProducto}
                                        onChange={this.handleChange}
                                        name="unidadMedia"
                                        InputProps={{
                                            readOnly: true,
                                        }}
                                    />
                                </Grid>
                                <Grid item xs>
                                    <TextField
                                        variant="outlined"
                                        margin="dense"
                                        type="text"
                                        className="form-control"
                                        label="Producto o Servicio"
                                        disabled={this.props.consulta}
                                        value={this.props.dataComplemento.ProductoSAT}
                                        onChange={this.handleChange}
                                        name="unidadMedia"
                                        InputProps={{
                                            readOnly: true,
                                        }}
                                    />
                                </Grid>
                                <Grid item xs={2}>
                                    <button
                                        type="button"
                                        className="btn btn-primary primary-btn"
                                        style={{margin: "0px"}}
                                        onClick={() => this.setState({openDialog: true, complementoSAT: 1})}>
                                        Seleccionar
                                    </button>
                                </Grid>
                            </Grid>

                            <Grid container spacing={1}>
                                <Grid item xs={2}>
                                    <TextField
                                        variant="outlined"
                                        margin="dense"
                                        type="text"
                                        className="form-control"
                                        label="Clave SAT"
                                        disabled={this.props.consulta}
                                        value={this.props.dataComplemento.claveUnidad}
                                        onChange={this.handleChange}
                                        name="unidadMedia"
                                        InputProps={{
                                            readOnly: true,
                                        }}
                                    />
                                </Grid>
                                <Grid item xs>
                                    <TextField
                                        variant="outlined"
                                        margin="dense"
                                        onChange={this.handleChange}
                                        className="form-control"
                                        type="text"
                                        label="Unidad Medida"
                                        disabled={this.props.consulta}
                                        required
                                        value={this.props.dataComplemento.UnidadSAT}
                                        name="unidadMedida"
                                        InputProps={{
                                            readOnly: true,
                                        }}
                                    />
                                </Grid>
                                <Grid item xs={2}>
                                    <button
                                        type="button"
                                        className="btn btn-primary primary-btn"
                                        style={{margin: "0px"}}
                                        onClick={() =>
                                            this.setState({openDialog: true, complementoSAT: 2})
                                        }
                                    >
                                        Seleccionar
                                    </button>
                                </Grid>
                            </Grid>

                            <Grid container spacing={1}>
                                <Grid item xs={2}>
                                    <TextField
                                        variant="outlined"
                                        margin="dense"
                                        type="text"
                                        className="form-control"
                                        label="Clave SAT"
                                        aria-readonly={true}
                                        value={this.props.dataComplemento.claveEmbalaje}
                                        name="claveSATEmbalaje"
                                    />
                                </Grid>
                                <Grid item xs>
                                    <TextField
                                        variant="outlined"
                                        margin="dense"
                                        className="form-control"
                                        type="text"
                                        label="Embalaje"
                                        aria-readonly={true}
                                        required
                                        value={this.props.dataComplemento.embalajeSAT}
                                        name="descripcionEmbalaje"
                                    />
                                </Grid>
                                <Grid item xs={2}>
                                    <button
                                        type="button"
                                        className="btn btn-primary primary-btn"
                                        style={{margin: "0px"}}
                                        onClick={() => this.setState({openDialog: true, complementoSAT: 3})}>
                                        Seleccionar
                                    </button>
                                </Grid>
                            </Grid>

                        </div>
                    </div>
                    {this.props.children}
                </form>
                <DialogActions>
                    <div style={{display: "flex", justifyContent: "space-between"}}>
                        <button
                            type="button"
                            onClick={() => this.props.dialogVisible(false)}
                            className="btn btn-secondary secondary-btn"
                            style={{marginRight: "20px"}}
                        >
                            Cancelar
                        </button>
                        <button
                            type="button"
                            onClick={() => this.props.handleAceptar(this.state)}
                            className="btn btn-primary primary-btn"
                        >
                            Aceptar
                        </button>
                    </div>
                </DialogActions>
            </div>
        );
    }
}

export default CrearConcepto;
