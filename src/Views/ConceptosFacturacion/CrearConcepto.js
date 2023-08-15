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
import Noty from 'noty';
import { obtenerImpuestos } from "../../Util/Contexts/ImpuestosContext";
import {
    obtenerSATEmbalajes, obtenerSATPaginado,
    obtenerSATServicios,
    obtenerSATUnidades,obtenerSATListado
} from "../../Util/Contexts/ConceptosFacturacionContext";
import {Autocomplete} from "@material-ui/lab";
import {obtenerTipoCobro} from "../../Util/Contexts/TipoCobroContext";
import {API_HEADERS} from "../../Constants";
import {obtenerRemitentesDestinatariosPaginado} from "../../Util/Contexts/RemitenteDestinatarioContext";
import { ContactSupportOutlined } from "@material-ui/icons";
var numRegistros = 20


function showSuccess(mensaje) {
    new Noty({
        type: "information",
        layout: "topCenter",
        text: mensaje,
        timeout: "3000"
    }).show()
}

function CrearConceptoSAT(props) {
    const [pagina, setPagina] = React.useState(0);
    const [rows, setRow] = useState([])
    const [state, setState] = React.useState({
        openDialog: false,
        catalogo: "",
        busqueda: "",
        dataSat: [],
        titulo:""
    });
    const [errores, setErrores] = useState({
        errorCantidad:false,
        errorTexto:"Ingrese un numero mayor a 0",
        errorCaracteres: false,
    })
    const [disableSeleccionar, setDisableSeleccionar] = React.useState({
        disableProducto: true,
        disableUnidad: true,
        disableMaterialPeligroso: true,
        disableEmbalaje: true,
        disableFraccion: true
    });

    
    
    const handleChange = (event) => {

        if(event.target.name == "cantidad"){
            if(event.target.value!==""){
                if(Number(event.target.value)<=0){
                    setErrores(errores=>{
                        return{ 
                            ...errores,
                            errorCantidad:true,
                         errorTexto:"Ingrese un numero mayor a 0"
                        
                        }
                     })
            }else if(isNaN(Number(event.target.value))){
                setErrores(errores=>{
                    return{ 
                        ...errores,
                        errorCantidad:true,
                     errorTexto:"Ingrese solo digitos"
                    }
                 })
            }else{
                setErrores(errores=>{
                    return{ 
                        ...errores,
                        errorCantidad:false}
                 })
            }
            }else{
                setErrores(errores=>{
                    return{ 
                        ...errores,
                     errorCantidad:false}
                 })
            }
        }
        props.onChangeData(0, event)
    }    

    const selectClase = (row) => {
        props.onChangeData(state.complementoSAT, row.data)
    }

    const closeDialog = () => {
        setState({ ...state, openDialog: false, catalogo: "" });
        setPagina(0)
    }
    
    function cargarDesdeServidor(pagina,numRegistros){
        if (state.catalogo !== "") {
            return new obtenerSATPaginado(numRegistros, pagina || 0, state.catalogo, state.busqueda).then((respuesta) => {
                if(respuesta.data.length>0){
                setState({...state, dataSat: respuesta.data, openDialog: true})
                }else{
                    showSuccess("No se encontró ningún registro")
                }
              
            })
        }
    }
    /* useEffect(() => {
        cargarDesdeServidor(pagina.page,numRegistros)
    }, [pagina, state.busqueda, state.catalogo]) */

    /* useEffect(() => {
        obtenerSATListado().then(respuesta => {
            console.log(respuesta.data)
            setDataSat(respuesta.data)
        });
    }, []) */

    const handleKeyDown = e => {
        if (e.key === " ") {
          e.preventDefault();
        }
      }
    const handleChangeSpecial = (e) => {
        if(e.target.name == "claveUnidad"){
            const value = e.target.value;
            const sanitizedValue = value.replace(/[^\w\s]/gi, ''); 
            if (value !== sanitizedValue) {
                setErrores({
                    ...errores,
                    errorCaracteres: true});
                    setDisableSeleccionar({
                        ...disableSeleccionar,
                        disableUnidad: false});
                    props.onChangeData(6, e,true)
            } else {
                setErrores({
                    ...errores,
                    errorCaracteres: false});
                    setDisableSeleccionar({
                        ...disableSeleccionar,
                        disableUnidad: false});                    
                    props.onChangeData(6, e)    
            }           
        }else if (e.target.name == "claveProducto"){
            setDisableSeleccionar({
                ...disableSeleccionar,
                disableProducto: false});             
            props.onChangeData(6, e)
        }else if (e.target.name == "claveMaterialPeligroso"){
            setDisableSeleccionar({
                ...disableSeleccionar,
                disableMaterialPeligroso: false});             
            props.onChangeData(6, e)
        }else if(e.target.name == "claveEmbalaje"){
            setDisableSeleccionar({
                ...disableSeleccionar,
                disableEmbalaje: false});             
            props.onChangeData(6, e)
        }else if(e.target.name == "claveFraccion"){
            setDisableSeleccionar({
                ...disableSeleccionar,
                disableFraccion: false});             
            props.onChangeData(6, e)
        }
    }

    const handleClickBuscarClaveSat = (idcomplemento) =>{

        if(idcomplemento === 1){
            var catalogo = "c_ClaveProdServCP";
            setState({
                ...state,
                catalogo: "c_ClaveProdServCP", 
                busqueda: "", 
                complementoSAT: 1,
                titulo:"Producto o Servicio"
            })

    
            obtenerSATListado(catalogo,props.dataComplemento.claveProducto).then(respuesta => {
                if(respuesta.data.Estatus){
                    props.onChangeData(1, respuesta.data)
                }else{
                    showSuccess(respuesta.data)
                }
            })        
        }else if(idcomplemento === 2){
            var catalogo = "c_ClaveUnidad";

            setState({
                ...state, 
                catalogo: "c_ClaveUnidad", 
                busqueda: "", 
                complementoSAT: 2,
                titulo:"Unidad medida"
            })
    
    
            obtenerSATListado(catalogo,props.dataComplemento.claveUnidad).then(respuesta => {
                if(respuesta.data.Estatus){
                    props.onChangeData(2, respuesta.data)
                }else{
                    showSuccess(respuesta.data)
                }
            })       
        }else if(idcomplemento === 3){
            var catalogo = "c_TipoEmbalaje";

            setState({
                ...state,
                catalogo: "c_TipoEmbalaje", 
                busqueda: "", 
                complementoSAT: 3,
                titulo:"Embalaje"
            })

            obtenerSATListado(catalogo,props.dataComplemento.claveEmbalaje).then(respuesta => {
                if(respuesta.data.Estatus){
                    props.onChangeData(3, respuesta.data)
                }else{
                    showSuccess(respuesta.data)
                }
            })               
        }else if(idcomplemento === 4){
            var catalogo = "c_FraccionArancelaria";

            setState({
                ...state,
                catalogo: "c_FraccionArancelaria", 
                busqueda: "", 
                complementoSAT: 4,
                titulo:"Fracción arancelaria"
            })

            obtenerSATListado(catalogo,props.dataComplemento.claveFraccion).then(respuesta => {
                if(respuesta.data.Estatus){
                    props.onChangeData(4, respuesta.data)
                }else{
                    showSuccess(respuesta.data)
                }
            })               
        }else if(idcomplemento === 5){
            var catalogo = "c_MaterialPeligroso";

            setState({
                ...state,
                catalogo: "c_MaterialPeligroso", 
                busqueda: "", 
                complementoSAT: 5,
                titulo:"Material peligroso"
            })

            obtenerSATListado(catalogo,props.dataComplemento.claveMaterialPeligroso).then(respuesta => {
                if(respuesta.data.Estatus){
                    props.onChangeData(5, respuesta.data)
                }else{
                    showSuccess(respuesta.data)
                }
            })        
        }
    }

    return(
        <div>

                <Dialog
                    open={state.openDialog}
                    fullWidth
                    maxWidth="xl"
                    onClose={() => setState({...state,openDialog: false, catalogo: ""})}
                >
                    <DialogTitle>{state.titulo}</DialogTitle>
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
            <form className="j-forms" onSubmit={e => {e.preventDefault(); e.stopPropagation()}}>
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
                            <Grid item xs={12} sm={6}>
                                <TextField
                                    variant="outlined"
                                    margin="dense"
                                    type="number"
                                    label="Cantidad"
                                    required
                                    disabled={props.consulta}
                                    value={props.dataComplemento.cantidad}
                                    onChange={handleChange}
                                    name="cantidad"
                                />
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <TextField
                                    variant="outlined"
                                    margin="dense"
                                    type="number"
                                    className="form-control"
                                    label="Peso"
                                    required
                                    disabled={props.consulta}
                                    value={props.dataComplemento.peso}
                                    onChange={handleChange}
                                    name="peso"
                                />
                            </Grid>
                            <Grid item xs={12} sm={2}>
                                <TextField
                                    variant="outlined"
                                    margin="dense"
                                    type="number"
                                    className="form-control"
                                    label="Clave SAT"
                                    value={props.dataComplemento.claveProducto}
                                    name="claveProducto"
                                    required
                                    onChange={(e)=> handleChangeSpecial(e)/* { props.onChangeData(6, e)} */}
                                    aria-readonly={true}
                                    disabled={props.consulta}
                                    InputProps={{
                                        inputProps:{min: 1}
                                    }}
                                />
                            </Grid>
                            <Grid item xs={12} sm={8}>
                                <TextField
                                    variant="outlined"
                                    margin="dense"
                                    type="text"
                                    className="form-control"
                                    label="Producto o Servicio"
                                    value={props.dataComplemento.ProductoSAT}
                                    name="ProductoSAT"
                                    required
                                    onChange={(e)=>{ props.onChangeData(6, e)}}
                                    aria-readonly={true}
                                    disabled
                                />
                            </Grid>
                            <Grid item xs={12} sm={2}>
                                <Button
                                    type="button"
                                    fullWidth
                                    className="btn btn-primary primary-btn"
                                    style={{margin: "0px"}}
                                    onClick={() =>  handleClickBuscarClaveSat(1)/* setState({...state,catalogo: "c_ClaveProdServCP", busqueda: "", complementoSAT: 1,titulo:"Producto o Servicio"}) */}
                                    disabled= {disableSeleccionar.disableProducto}
                                    >
                                    Seleccionar
                                </Button>
                            </Grid>
                            <Grid item xs={12} sm={2}>
                                <TextField
                                    variant="outlined"
                                    margin="dense"
                                    type="text"
                                    className="form-control"
                                    label="Clave SAT"
                                    required
                                    onChange={(e)=>{ handleChangeSpecial(e)}}
                                    disabled={props.consulta}
                                    value={props.dataComplemento.claveUnidad}
                                    name="claveUnidad"
                                    aria-readonly={true}
                                    onKeyDown={handleKeyDown}
                                />
                                {errores.errorCaracteres &&
                                    <span style={{ color: 'red' }}>Caracteres especiales no estan permitidos.</span>
                                }
                            </Grid>
                            <Grid item xs={12} sm={8}>
                                <TextField
                                    variant="outlined"
                                    margin="dense"
                                    className="form-control"
                                    type="text"
                                    label="Unidad Medida"
                                    disabled={props.consulta}
                                    required
                                    onChange={(e)=>{ props.onChangeData(6, e)}}
                                    value={props.dataComplemento.UnidadSAT}
                                    name="UnidadSAT"
                                    aria-readonly={true}
                                    disabled
                                />
                            </Grid>
                            <Grid item xs={12} sm={2}>
                                <Button
                                    type="button"
                                    fullWidth
                                    className="btn btn-primary primary-btn"
                                    style={{margin: "0px"}}
                                    onClick={() => handleClickBuscarClaveSat(2)}
                                    disabled= {disableSeleccionar.disableUnidad}
                                >
                                    Seleccionar
                                </Button>
                            </Grid>
                            <Grid item xs={12} sm={3}>
                                <FormControlLabel
                                    control={
                                        <Checkbox
                                            checked={props.dataComplemento.esPeligroso}
                                            onChange={handleChange}
                                            name="esPeligroso"
                                            disabled={!props.dataComplemento.esPeligrosoOpcional}
                                            color="primary"
                                        />
                                    }
                                    label="Es material peligroso"
                                />
                            </Grid>
                        </Grid>

                        {props.dataComplemento.esPeligroso &&
                        <Grid container spacing={1}>
                            <Grid item xs={12} sm={2}>
                                <TextField
                                    variant="outlined"
                                    margin="dense"
                                    type="text"
                                    className="form-control"
                                    label="Clave SAT"
                                    aria-readonly={true}
                                    required
                                    value={props.dataComplemento.claveMaterialPeligroso}
                                    onChange={(e)=> handleChangeSpecial(e)/* props.onChangeData(6, e) */}
                                    name="claveMaterialPeligroso"
                                />
                            </Grid>
                            <Grid item xs={12} sm={8}>
                                <TextField
                                    variant="outlined"
                                    margin="dense"
                                    className="form-control"
                                    type="text"
                                    label="Material peligroso"
                                    aria-readonly={true}
                                    required
                                    value={props.dataComplemento.materialPeligrosoSAT}
                                    name="materialPeligrosoSAT"
                                    onChange={(e)=>{ props.onChangeData(6, e)}}
                                    disabled
                                />
                            </Grid>
                            <Grid item xs={12} sm={2}>
                                <Button
                                    type="button"
                                    fullWidth
                                    className="btn btn-primary primary-btn"
                                    style={{margin: "0px"}}
                                    disabled= {disableSeleccionar.disableMaterialPeligroso}
                                    name="materialPeligrosoSAT"
                                    onClick={() => handleClickBuscarClaveSat(5)/* () => setState({...state,catalogo: "c_MaterialPeligroso", busqueda: "", complementoSAT: 5,titulo:"Material peligroso"}) */}>
                                    Seleccionar
                                </Button>
                            </Grid>

                            <Grid item xs={12} sm={2}>
                                <TextField
                                    variant="outlined"
                                    margin="dense"
                                    type="text"
                                    className="form-control"
                                    label="Clave SAT"
                                    aria-readonly={true}
                                    required
                                    value={props.dataComplemento.claveEmbalaje}
                                    name="claveEmbalaje"
                                    onChange={(e)=> handleChangeSpecial(e)/* { props.onChangeData(6, e)} */}
                                />
                            </Grid>
                            <Grid item xs={12} sm={4}>
                                <TextField
                                    variant="outlined"
                                    margin="dense"
                                    className="form-control"
                                    type="text"
                                    label="Embalaje"
                                    aria-readonly={true}
                                    required
                                    value={props.dataComplemento.embalajeSAT}
                                    name="embalajeSAT"
                                    onChange={(e)=>{ props.onChangeData(6, e)}}
                                    disabled
                                />
                            </Grid>
                            <Grid item xs={12} sm={4}>
                                <TextField
                                    variant="outlined"
                                    margin="dense"
                                    type="text"
                                    className="form-control"
                                    label="Descripción embalaje"
                                    disabled={props.consulta}
                                    value={props.dataComplemento.descripcionEmbalajeSAT}
                                    name="descripcionEmbalajeSAT"
                                    onChange={(e)=>{ props.onChangeData(6, e)}}
                                />
                            </Grid>
                            <Grid item xs={12} sm={2}>
                                <Button
                                    type="button"
                                    fullWidth
                                    className="btn btn-primary primary-btn"
                                    style={{margin: "0px"}}
                                    disabled= {disableSeleccionar.disableEmbalaje}
                                    name={"embalajeSAT"}
                                    onClick={() => handleClickBuscarClaveSat(3)/* () => setState({...state,catalogo: "c_TipoEmbalaje", busqueda: "", complementoSAT: 3,titulo:"Embalaje"}) */}>
                                    Seleccionar
                                </Button>
                            </Grid>

                            <Grid item xs={12} sm={2}>
                                <TextField
                                    variant="outlined"
                                    margin="dense"
                                    type="text"
                                    className="form-control"
                                    label="Clave SAT"
                                    aria-readonly={true}
                                    value={props.dataComplemento.claveFraccion}
                                    name="claveFraccion"
                                    onChange={(e)=> handleChangeSpecial(e)/* { props.onChangeData(6, e)} */}
                                />
                            </Grid>
                            <Grid item xs={12} sm={8}>
                                <TextField
                                    variant="outlined"
                                    margin="dense"
                                    className="form-control"
                                    type="text"
                                    label="Fracción arancelaria"
                                    aria-readonly={true}
                                    value={props.dataComplemento.fraccionSAT}
                                    name="fraccionSAT"
                                    onChange={(e)=>{ props.onChangeData(6, e)}}
                                    disabled
                                />
                            </Grid>
                            <Grid item xs={12} sm={2}>
                                <Button
                                    type="button"
                                    fullWidth
                                    className="btn btn-primary primary-btn"
                                    style={{margin: "0px"}}
                                    disabled= {disableSeleccionar.disableFraccion}
                                    name="fraccionSAT"
                                    onClick={() => handleClickBuscarClaveSat(4)/* () => setState({...state,catalogo: "c_FraccionArancelaria", busqueda: "", complementoSAT: 4,titulo:"Fracción arancelaria"}) */}>
                                    Seleccionar
                                </Button>
                            </Grid>
                        </Grid>
                        }

                    </div>
                </div>
                {props.children}

            <DialogActions>
                <Button
                    onClick={() => props.dialogVisible(false)}
                    style={{marginRight: "20px"}}
                    color={"secondary"}
                >
                    Cancelar
                </Button>
                <Button
                    type={"submit"}
                    onClick={() => props.handleAceptar(state)}
                    color={"primary"}
                >
                    Aceptar
                </Button>
            </DialogActions>
        </form>
        </div>
    )
}

export default CrearConceptoSAT;