import React, {Component, useState} from "react";
import PropTypes from "prop-types";
import axios from "axios";
import {
    Checkbox, CircularProgress,
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
import {Autocomplete} from "@material-ui/lab";
import {obtenerTipoCobro} from "../../Util/Contexts/TipoCobroContext";
import {API_HEADERS} from "../../Constants";

function CrearConceptoSAT(props) {

    const [state, setState] = React.useState({
        openDialog: false,
        complementoSAT: 0
    });

    const handleChange = (event) => {
        props.onChangeData(0, event)
    }

    const selectClase = (row) => {
        props.onChangeData(state.complementoSAT, row.data)
    }

    const closeDialog = () => {
        setState({ ...state, openDialog: false });
    }

    return(
        <div>
            <form className="j-forms">
                <Dialog
                    open={state.openDialog}
                    fullWidth
                    maxWidth="xl"
                    onClose={() => setState({...state,openDialog: false})}
                >
                    <DialogTitle>Claves Productos y Servicios</DialogTitle>
                    <DialogContent>
                        <ClavesCFDI
                            selectClase={selectClase}
                            closeDialog={closeDialog}
                            dataSAT={state.complementoSAT === 1 ? props.dataSAT : state.complementoSAT === 2 ? props.dataSATUnidades : state.complementoSAT === 3 ? props.dataSATEmbalajes : []}
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
                            <Grid item xs={12}>
                                <TextField
                                    variant="outlined"
                                    margin="dense"
                                    type="text"
                                    className="form-control"
                                    label="Cantidad"
                                    disabled={props.consulta}
                                    value={props.dataComplemento.cantidad}
                                    onChange={handleChange}
                                    name="cantidad"
                                />
                            </Grid>
                            <Grid item xs={2}>
                                <TextField
                                    variant="outlined"
                                    margin="dense"
                                    type="text"
                                    className="form-control"
                                    label="Clave SAT"
                                    disabled={props.consulta}
                                    value={props.dataComplemento.claveProducto}
                                    onChange={handleChange}
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
                                    disabled={props.consulta}
                                    value={props.dataComplemento.ProductoSAT}
                                    onChange={handleChange}
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
                                    onClick={() => setState({openDialog: true, complementoSAT: 1})}>
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
                                    disabled={props.consulta}
                                    value={props.dataComplemento.claveUnidad}
                                    onChange={handleChange}
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
                                    onChange={handleChange}
                                    className="form-control"
                                    type="text"
                                    label="Unidad Medida"
                                    disabled={props.consulta}
                                    required
                                    value={props.dataComplemento.UnidadSAT}
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
                                        setState({openDialog: true, complementoSAT: 2})
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
                                    value={props.dataComplemento.claveEmbalaje}
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
                                    value={props.dataComplemento.embalajeSAT}
                                    name="descripcionEmbalaje"
                                />
                            </Grid>
                            <Grid item xs={2}>
                                <button
                                    type="button"
                                    className="btn btn-primary primary-btn"
                                    style={{margin: "0px"}}
                                    onClick={() => setState({openDialog: true, complementoSAT: 3})}>
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
                                    value={props.dataComplemento.claveFraccion}
                                    name="claveFrraccion"
                                />
                            </Grid>
                            <Grid item xs>
                                <TextField
                                    variant="outlined"
                                    margin="dense"
                                    className="form-control"
                                    type="text"
                                    label="Fracción aracelaria"
                                    aria-readonly={true}
                                    required
                                    value={props.dataComplemento.fraccionSAT}
                                    name="fraccionSAT"
                                />
                            </Grid>
                            <Grid item xs={2}>
                                <button
                                    type="button"
                                    className="btn btn-primary primary-btn"
                                    style={{margin: "0px"}}
                                    onClick={() => setState({openDialog: true, complementoSAT: 4})}>
                                    Seleccionar
                                </button>
                            </Grid>
                        </Grid>
                        <Grid container spacing={1}>
                            <Grid item xs>
                                <TextField
                                    variant="outlined"
                                    margin="dense"
                                    type="text"
                                    className="form-control"
                                    label="UUID Comercio exterior"
                                    disabled={props.consulta}
                                    value={props.dataComplemento.comercioExterior}
                                    onChange={handleChange}
                                    name="comercioExterior"
                                />
                            </Grid>
                            <Grid item xs>
                                <FormControlLabel
                                    control={
                                        <Checkbox
                                            checked={props.dataComplemento.esPeligroso}
                                            onChange={handleChange}
                                            name="esPeligroso"
                                            color="primary"
                                        />
                                    }
                                    label="Es material peligroso"
                                />
                            </Grid>
                        </Grid>
                        {props.dataComplemento.esPeligroso &&
                            <Grid container spacing={1}>
                                <Grid item xs={2}>
                                    <TextField
                                        variant="outlined"
                                        margin="dense"
                                        type="text"
                                        className="form-control"
                                        label="Clave SAT"
                                        aria-readonly={true}
                                        value={props.dataComplemento.claveMaterialPeligroso}
                                        name="claveMaterialPeligroso"
                                    />
                                </Grid>
                                <Grid item xs>
                                    <TextField
                                        variant="outlined"
                                        margin="dense"
                                        className="form-control"
                                        type="text"
                                        label="Material peligroso"
                                        aria-readonly={true}
                                        required
                                        value={props.dataComplemento.materialPeligrosoSAT}
                                        name="materialPeligroso"
                                    />
                                </Grid>
                                <Grid item xs={2}>
                                    <button
                                        type="button"
                                        className="btn btn-primary primary-btn"
                                        style={{margin: "0px"}}
                                        onClick={() => setState({openDialog: true, complementoSAT: 5})}>
                                        Seleccionar
                                    </button>
                                </Grid>
                            </Grid>
                        }


                    </div>
                </div>
                {props.children}
            </form>
            <DialogActions>
                <div style={{display: "flex", justifyContent: "space-between"}}>
                    <button
                        type="button"
                        onClick={() => props.dialogVisible(false)}
                        className="btn btn-secondary secondary-btn"
                        style={{marginRight: "20px"}}
                    >
                        Cancelar
                    </button>
                    <button
                        type="button"
                        onClick={() => props.handleAceptar(state)}
                        className="btn btn-primary primary-btn"
                    >
                        Aceptar
                    </button>
                </div>
            </DialogActions>
        </div>
    )
}

export default CrearConceptoSAT;