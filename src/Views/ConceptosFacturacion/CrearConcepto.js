import React, {Component, useEffect, useState} from "react";
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
    obtenerSATEmbalajes, obtenerSATPaginado,
    obtenerSATServicios,
    obtenerSATUnidades,
} from "../../Util/Contexts/ConceptosFacturacionContext";
import {Autocomplete} from "@material-ui/lab";
import {obtenerTipoCobro} from "../../Util/Contexts/TipoCobroContext";
import {API_HEADERS} from "../../Constants";
import {obtenerRemitentesDestinatariosPaginado} from "../../Util/Contexts/RemitenteDestinatarioContext";
var numRegistros = 20
function CrearConceptoSAT(props) {
    const [pagina, setPagina] = React.useState(0);
    const [rows, setRow] = useState([])
    const [state, setState] = React.useState({
        openDialog: false,
        catalogo: "",
        busqueda: "",
        dataSat: []
    });

    
    const handleChange = (event) => {
        props.onChangeData(0, event)
    }

    const selectClase = (row) => {
        props.onChangeData(state.complementoSAT, row.data)
    }

    const closeDialog = () => {
        setState({ ...state, openDialog: false, catalogo: "" });
    }
    
    function cargarDesdeServidor(pagina,numRegistros){
        if (state.catalogo !== "") {
            return new obtenerSATPaginado(numRegistros, pagina || 0, state.catalogo, state.busqueda).then((respuesta) => {
                setState({...state, dataSat: respuesta.data, openDialog: true})
            })
        }
    }
    useEffect(() => {
        cargarDesdeServidor(pagina.page,numRegistros)
    }, [pagina, state.busqueda, state.catalogo])

    return(
        <div>

                <Dialog
                    open={state.openDialog}
                    fullWidth
                    maxWidth="xl"
                    onClose={() => setState({...state,openDialog: false, catalogo: ""})}
                >
                    <DialogTitle>Claves Productos y Servicios</DialogTitle>
                    <DialogContent>

                            <ClavesCFDI
                                selectClase={selectClase}
                                closeDialog={closeDialog}
                                dataSAT={state.dataSat}
                                catalogo={state.catalogo}
                                setPagina={setPagina}
                                setBusqueda={(value) => setState({...state, busqueda: value})}
                                // isProducto={this.state.isProducto}
                            />


                    </DialogContent>
                </Dialog>
            <form className="j-forms">
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
                                    onClick={() => setState({...state,catalogo: "c_ClaveProdServ", busqueda: "", complementoSAT: 1})}>
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
                                        setState({...state, catalogo: "c_ClaveUnidad", busqueda: "", complementoSAT: 2})
                                    }
                                >
                                    Seleccionar
                                </button>
                            </Grid>
                        </Grid>

                        <Grid container spacing={1}>
                            {/*<Grid item xs>
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
                            </Grid>*/}
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
                                    onClick={() => setState({...state,catalogo: "c_MaterialPeligroso", busqueda: "", complementoSAT: 5})}>
                                    Seleccionar
                                </button>
                            </Grid>
                        </Grid>
                        }
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
                            <Grid item xs>
                                <TextField
                                    variant="outlined"
                                    margin="dense"
                                    type="text"
                                    className="form-control"
                                    label="Descripción embalaje"
                                    disabled={props.consulta}
                                    value={props.dataComplemento.descripcionEmbalajeSAT}
                                    onChange={handleChange}
                                    name="descripcionEmbalajeSAT"
                                />
                            </Grid>
                            <Grid item xs={2}>
                                <button
                                    type="button"
                                    className="btn btn-primary primary-btn"
                                    style={{margin: "0px"}}
                                    onClick={() => setState({...state,catalogo: "c_TipoEmbalaje", busqueda: "", complementoSAT: 3})}>
                                    Seleccionar
                                </button>
                            </Grid>
                        </Grid>
                        }
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
                                    value={props.dataComplemento.fraccionSAT}
                                    name="fraccionSAT"
                                />
                            </Grid>
                            <Grid item xs={2}>
                                <button
                                    type="button"
                                    className="btn btn-primary primary-btn"
                                    style={{margin: "0px"}}
                                    onClick={() => setState({...state,catalogo: "c_FraccionArancelaria", busqueda: "", complementoSAT: 4})}>
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