import React, {useEffect, useState} from 'react';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import Noty from 'noty';
import {Checkbox, FormControl, FormControlLabel, Grid, InputLabel, Radio, RadioGroup, Select} from "@material-ui/core";
import Autocomplete from "@material-ui/lab/Autocomplete";
import InputAdornment from "@material-ui/core/InputAdornment";
import IconButton from "@material-ui/core/IconButton";
import ArrowForwardIcon from "@material-ui/icons/ArrowForward";
import {obtenerImpuestosByConceptosFacturacion} from "../../Util/Contexts/ConceptosFacturacionContext";
import {obtenerImpuestos} from "../../Util/Contexts/ImpuestosContext";
import AddBoxIcon from "@material-ui/icons/AddBox";
import DeleteIcon from "@material-ui/icons/Delete";
import {obtenerEmbalajes} from "../../Util/Contexts/EmbalajesContext";
import {obtenerProductos, obtenerProductosByConvenioCliente} from "../../Util/Contexts/ProductosContext";
function showSuccess(mensaje) {
    new Noty({
        type: "information",
        layout: "topCenter",
        text: mensaje,
        timeout: "3000"
    }).show()
}
export default function DialogoNuevoPaquete(props) {
    const [open, setOpen] = React.useState(false);
    const [dataEmbalaje, setDataEmbalaje] = React.useState([]);
    const [dataProductos, setDataProductos] = useState([])
    const [state, setState] = useState({
        agregarMas: false
    })
    const [errores, setErrores] = useState({
        errorLargo:false,
        errorAlto:false,
        errorAncho:false,
        errorPeso:false,
        errorCantidad:false,
        errorTexto:""
       
    })
    const [paquete, setPaquete] = useState({
        m_nIdPaquete: Math.floor(Math.random() * 10000),
        producto: null,
        m_rPeso: "",
        m_rLargo: "",
        m_rAncho: "",
        m_rAlto: "",
        m_rVolumen: "",
        m_nIdTipoEmbalaje: "",
        m_sDescripcion: "",
        m_nCantidad: "",
        m_sObservaciones: "",
        m_cyValorDeclarado: "0",
        m_nIdTipo: 2,
        m_nIdProducto:'',
        m_sTipo: "Paquete",
        m_sClaveSATProducto:'',
        m_sClaveSATUnidad:'',
    })

    const resetPaquete = () =>{
        setPaquete(paquete => {
            return {
                ...paquete,
                producto: props.LimpiarProducto ? null : paquete.producto,
                m_nIdPaquete: Math.floor(Math.random() * 10000),
                m_rPeso: "",
                m_rLargo: "",
                m_rAncho: "",
                m_rAlto: "",
                m_rVolumen: "",
                m_nIdTipoEmbalaje: "",
                m_sDescripcion: "",
                m_nCantidad: "",
                m_sObservaciones: "",
                m_cyValorDeclarado: "0",
                m_nIdTipo: 2,
                m_nIdProducto: props.LimpiarProducto ? '' : paquete.m_nIdProducto,
                m_sTipo: "Paquete",
                m_sClaveSATProducto:'',
                m_sClaveSATUnidad:'',
            }
        })
        props.resetPaquete()
    }

    useEffect(() => {
        if (props.paquete.m_nIdPaquete !== 0){
            setPaquete(props.paquete)
            setOpen(true);
        }
    }, [props.paquete])

    const handleClickOpen = () => {
        resetPaquete()
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };

    const handleAceptar = (e) => {
        e.stopPropagation()
        e.preventDefault()
        //Si es paquete
        if (paquete.m_nIdTipo === 2){
            if(errores.errorAlto || errores.errorAncho || errores.errorCantidad ||errores.errorPeso || errores.errorLargo){
                showSuccess("Uno o más campos tienen error")
            }else{
                if (paquete.producto !== null) {
                    if (state.agregarMas) {
                        props.agregar(paquete)
                        resetPaquete()
                    } else {
                        handleClose()
                        setPaquete(paquete=>{
                            return{
                                ...paquete,
                                m_rLargo:Number(paquete.m_rLargo)
                            }
                        })
                        props.agregar(paquete)
                        resetPaquete()
                    }
                }
            }
        //    Si es sobre
        }else if (paquete.m_nIdTipo === 1){
            let sobre = {
                m_nIdPaquete: paquete.m_nIdPaquete,
                producto: null,
                m_rPeso: "",
                m_rLargo: "",
                m_rAncho: "",
                m_rAlto: "",
                m_rVolumen: "",
                m_nIdTipoEmbalaje: "",
                m_sDescripcion: paquete.m_sDescripcion,
                m_nCantidad: "1",
                m_sObservaciones: "",
                m_nIdTipo: paquete.m_nIdTipo,
                m_nIdProducto:'',
                m_sTipo: paquete.m_sTipo,
            }
            if (state.agregarMas) {
                console.log(sobre)
                props.agregar(sobre)
                resetPaquete()
            } else {
                handleClose()
                console.log(sobre)
                props.agregar(sobre)
                resetPaquete()
            }
        }

    }

    const handleCancelar = () => {
        resetPaquete()
        handleClose()
    }

    useEffect(value => {
        getAllEmbalajes()
    }, [])

    useEffect(value => {
        if (props.cliente !== null){
            getProductosByConvenioCliente()
        }else{
            getAllProductos()
        }
    }, [props.cliente])

    const getAllEmbalajes = () => {
        if (dataEmbalaje.length === 0){
            obtenerEmbalajes().then((respuesta) => {
                setDataEmbalaje(respuesta.data);
            });
        }
    }

    const getAllProductos = () => {
        if (dataProductos.length === 0){
            obtenerProductos().then(respuesta => {
                setDataProductos(respuesta.data)
            });
        }
    }

    const getProductosByConvenioCliente = () => {
        if (props.cliente.m_nIdCliente){
            obtenerProductosByConvenioCliente(props.cliente.m_nIdCliente).then(respuesta => {
                setDataProductos(respuesta.data)
            });
        }

    }

    const handleChangePaquetev2 = (event) => {

        if(event.target.name == "m_nCantidad"){
            if(event.target.value!==""){//si la cantidad no esta vacia procede a validar si es mayor a cero o no contiene caracteres
                console.log("numero"+Number(event.target.value))
                console.log("valida si es numero"+isNaN(Number(event.target.value)))
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
                
        }else

        if(event.target.name == "m_rLargo"){
            if(event.target.value!==""){//si la cantidad no esta vacia procede a validar si es mayor a cero o no contiene caracteres
                if(Number(event.target.value)<=0){
                        setErrores(errores=>{
                            return{ 
                                ...errores,
                             errorLargo:true,
                             errorTexto:"Ingrese un numero mayor a 0"

                            }
                         })
                         
                }else if(isNaN(Number(event.target.value))){
                    setErrores(errores=>{
                        return{ 
                            ...errores,
                         errorLargo:true,
                         errorTexto:"Ingrese solo digitos"
                        }
                     })
                }else{
                    setErrores(errores=>{
                        return{ 
                            ...errores,
                         errorLargo:false}
                     })
                }
            }else{
                setErrores(errores=>{
                    return{ 
                        ...errores,
                     errorLargo:false}
                 })
            }
        }else
        if(event.target.name == "m_rAlto"){
            if(event.target.value!==""){//si la cantidad no esta vacia procede a validar si es mayor a cero o no contiene caracteres
                if(Number(event.target.value)<=0){
                        setErrores(errores=>{
                            return{ 
                                ...errores,
                             errorAlto:true,
                             errorTexto:"Ingrese un numero mayor a 0"
                            
                            }
                         })
                }else if(isNaN(Number(event.target.value))){
                    setErrores(errores=>{
                        return{ 
                            ...errores,
                         errorAlto:true,
                         errorTexto:"Ingrese solo digitos"
                        }
                     })
                }else{
                    setErrores(errores=>{
                        return{ 
                            ...errores,
                         errorAlto:false}
                     })
                }
            }else{
                setErrores(errores=>{
                    return{ 
                        ...errores,
                     errorAlto:false}
                 })
            }
        }else
        if(event.target.name == "m_rAncho"){
            if(event.target.value!==""){//si la cantidad no esta vacia procede a validar si es mayor a cero o no contiene caracteres
                if(Number(event.target.value)<=0){
                        setErrores(errores=>{
                            return{ 
                                ...errores,
                             errorAncho:true,
                             errorTexto:"Ingrese un numero mayor a 0"
                            
                            }
                         })
                }else if(isNaN(Number(event.target.value))){
                    setErrores(errores=>{
                        return{ 
                            ...errores,
                         errorAncho:true,
                         errorTexto:"Ingrese solo digitos"
                        }
                     })
                }else{
                    setErrores(errores=>{
                        return{ 
                            ...errores,
                         errorAncho:false}
                     })
                }
            }else{
                setErrores(errores=>{
                    return{ 
                        ...errores,
                     errorAncho:false}
                 })
            }
        }else
        if(event.target.name == "m_rPeso"){
            if(event.target.value!==""){//si la cantidad no esta vacia procede a validar si es mayor a cero o no contiene caracteres
                if(Number(event.target.value)<=0){
                        setErrores(errores=>{
                            return{ 
                                ...errores,
                             errorPeso:true,
                             errorTexto:"Ingrese un numero mayor a 0"
                            
                            }
                         })
                }else if(isNaN(Number(event.target.value))){
                    setErrores(errores=>{
                        return{ 
                            ...errores,
                         errorPeso:true,
                         errorTexto:"Ingrese solo digitos"
                        }
                     })
                }else{
                    setErrores(errores=>{
                        return{ 
                            ...errores,
                         errorPeso:false}
                     })
                }
            }else{
                setErrores(errores=>{
                    return{ 
                        ...errores,
                     errorPeso:false}
                 })
            }
        }
        
        setPaquete(paquete => {
            return {
                ...paquete,
                [event.target.name]: event.target.value,
            }
        })
        setPaquete(paquete => {
            return {
                ...paquete,
                m_rVolumen:paquete.m_rLargo * paquete.m_rAlto * paquete.m_rAncho,
            }
        })
        if (event.target.name == "m_nIdTipoEmbalaje"){
            setPaquete(paquete => {
                return {
                    ...paquete,
                    m_sTipoEmbalaje: dataEmbalaje.find((i) => i.m_nIdEmbalaje == event.target.value).m_sNombre,
                }
            })
        }
        if (event.target.name == "m_nIdTipo"){
            setPaquete(paquete => {
                return {
                    ...paquete,
                    m_sTipo: event.target.value == 1 ? "Sobre" : "Paquete",
                }
            })
        }
    };

    const handleChangePaqueteProductov2 = (event, newValue) => {
        console.log(newValue)
           if (newValue){  
            if(newValue?.m_xLargo !== undefined || newValue?.m_xLargo !== null){//si la cantidad no esta vacia procede a validar si es mayor a cero o no contiene caracteres
                if(Number(newValue.m_xLargo)<=0){
                        setErrores(errores=>{
                            return{ 
                                ...errores,
                             errorLargo:true,
                             errorTexto:"Ingrese un numero mayor a 0"

                            }
                         })
                         
                }else if(isNaN(Number(newValue.m_xLargo))){
                    setErrores(errores=>{
                        return{ 
                            ...errores,
                         errorLargo:true,
                         errorTexto:"Ingrese solo digitos"
                        }
                     })
                }else{
                    setErrores(errores=>{
                        return{ 
                            ...errores,
                         errorLargo:false}
                     })
                }
            }else{
                setErrores(errores=>{
                    return{ 
                        ...errores,
                     errorLargo:false}
                 })
            }
        

            if(newValue?.m_xAlto !== undefined || newValue?.m_xAlto !== null){//si la cantidad no esta vacia procede a validar si es mayor a cero o no contiene caracteres
                if(Number(newValue.m_xAlto)<=0){
                        setErrores(errores=>{
                            return{ 
                                ...errores,
                             errorAlto:true,
                             errorTexto:"Ingrese un numero mayor a 0"
                            
                            }
                         })
                }else if(isNaN(Number(newValue.m_xAlto))){
                    setErrores(errores=>{
                        return{ 
                            ...errores,
                         errorAlto:true,
                         errorTexto:"Ingrese solo digitos"
                        }
                     })
                }else{
                    setErrores(errores=>{
                        return{ 
                            ...errores,
                         errorAlto:false}
                     })
                }
            }else{
                setErrores(errores=>{
                    return{ 
                        ...errores,
                     errorAlto:false}
                 })
            
        }
            if(newValue?.m_xAncho !== undefined || newValue?.m_xAncho !== null){//si la cantidad no esta vacia procede a validar si es mayor a cero o no contiene caracteres
                if(Number(newValue.m_xAncho)<=0){
                        setErrores(errores=>{
                            return{ 
                                ...errores,
                             errorAncho:true,
                             errorTexto:"Ingrese un numero mayor a 0"
                            
                            }
                         })
                }else if(isNaN(Number(newValue.m_xAncho))){
                    setErrores(errores=>{
                        return{ 
                            ...errores,
                         errorAncho:true,
                         errorTexto:"Ingrese solo digitos"
                        }
                     })
                }else{
                    setErrores(errores=>{
                        return{ 
                            ...errores,
                         errorAncho:false}
                     })
                }
            }else{
                setErrores(errores=>{
                    return{ 
                        ...errores,
                     errorAncho:false}
                 })
            }

   
            if(newValue?.m_xPeso !== undefined ||newValue?.m_xPeso !== null){//si la cantidad no esta vacia procede a validar si es mayor a cero o no contiene caracteres
                if(Number(newValue.m_xPeso)<=0){
                        setErrores(errores=>{
                            return{ 
                                ...errores,
                             errorPeso:true,
                             errorTexto:"Ingrese un numero mayor a 0"
                            
                            }
                         })
                }else if(isNaN(Number(newValue.m_xPeso))){
                    setErrores(errores=>{
                        return{ 
                            ...errores,
                         errorPeso:true,
                         errorTexto:"Ingrese solo digitos"
                        }
                     })
                }else{
                    setErrores(errores=>{
                        return{ 
                            ...errores,
                         errorPeso:false}
                     })
                }
            }else{
                setErrores(errores=>{
                    return{ 
                        ...errores,
                     errorPeso:false}
                 })
            }

       
            setPaquete(paquete =>{
                return{
                    ...paquete,
                    producto: newValue,
                    m_nIdProducto: newValue.m_nIdProducto || 0,
                    m_rLargo: newValue.m_xLargo || 0,
                    m_rAlto: newValue.m_xAlto || 0,
                    m_rAncho: newValue.m_xAncho || 0,
                    m_rPeso: newValue.m_xPeso || 0,
                    m_nIdTipoEmbalaje: newValue.m_nIdEmbalaje,
                    m_sTipoEmbalaje: dataEmbalaje.find((i) => i.m_nIdEmbalaje == newValue.m_nIdEmbalaje).m_sNombre,
                    m_sDescripcion: newValue.m_nIdProducto== 1 ? "" : newValue.m_sDescripcion,
                    m_sProducto: newValue.m_sDescripcion
                }
            })
            setPaquete(paquete =>{
                return{
                    ...paquete,
                    m_rVolumen: paquete.m_rLargo * paquete.m_rAlto * paquete.m_rAncho
                }})
        }else{
            setPaquete(paquete =>{
                return{
                    ...paquete,
                    producto: null,
                    m_nIdProducto:  0,
                }
            })
        }
    };

    const handleChecked = (event) => {
        setState((state) => {
            return {
                ...state,
                [event.target.name]: event.target.checked
            }
        });
    };

    const handleClickProducto = () => {
        getAllEmbalajes()
    }

    return (
        <div>
            {!props.disabled &&
                <Button variant="contained" color="primary" onClick={handleClickOpen} style={{float: 'left'}} disabled={props.disabled}>
                    Agregar paquete
                </Button>
            }

            <Dialog open={open} onClose={handleClose} aria-labelledby="form-dialog-title"
                    fullWidth
                    maxWidth={'sm'}>
                <DialogTitle id="form-dialog-title">Agregar Paquete</DialogTitle>
                <form onSubmit={handleAceptar} onKeyDown={(e) => {if (e.code === 13){
                e.preventDefault()}
                }}>
                    <DialogContent>

                        <Grid container spacing={1}>

                            <Grid item xs={12}>
                                <label className="input select" style={{width: "100%"}}>
                                    <FormControl fullWidth variant="outlined" margin="dense" required>
                                        <InputLabel id="m_nIdTipoEmbalajeLabel">Tipo de paquete</InputLabel>
                                        <Select
                                            label="Tipo de paquete"
                                            labelId="m_nIdTipoLabel"
                                            className="form-control"
                                            value={paquete.m_nIdTipo}
                                            disabled={props.disabled}
                                            onChange={(event) => handleChangePaquetev2(event)}
                                            id="m_nIdTipo"
                                            name="m_nIdTipo"
                                        >
                                            <option key={2} value={2}>
                                                Paquete
                                            </option>
                                            <option key={1} value={1}>
                                                Sobre
                                            </option>
                                        </Select>
                                    </FormControl>
                                </label>
                            </Grid>
                            {paquete.m_nIdTipo != 1 &&
                            <Grid item xs={12}>
                                <div className="input">
                                    <Autocomplete
                                        value={paquete.producto}
                                        freeSolo
                                        required
                                        onChange={(event, newValue) => handleChangePaqueteProductov2(event, newValue)}
                                        // disableClearable
                                        forcePopupIcon={false}
                                        options={dataProductos}
                                        disabled={props.disabled}
                                        getOptionLabel={(option) => `${option.m_nNoProducto}-${option.m_sDescripcion}`}
                                        variant="outlined"
                                        name={"producto"}
                                        style={{transform: "translate(14px, 10px) scale(1) !important"}}
                                        renderInput={(params) =>
                                            <TextField
                                                variant="outlined"
                                                label="Producto"
                                                required
                                                margin="dense"
                                                onClick={handleClickProducto}
                                                {...params}
                                            />
                                        }
                                    />
                                </div>
                            </Grid>
                            }
                            {paquete.m_nIdTipo != 1 &&
                            <Grid item xs={6}>
                                <div className="input">
                                    <TextField variant="outlined" margin="dense"
                                               onChange={(event) => handleChangePaquetev2(event)}
                                               type="number"
                                               label="Cantidad"
                                               required
                                               value={paquete.m_nCantidad}
                                               disabled={props.disabled}
                                               placeholder="Cantidad"
                                               name="m_nCantidad"
                                               helperText={errores.errorCantidad?errores.errorTexto:""}
                                               error={errores.errorCantidad}
                                    />
                                </div>
                            </Grid>
                            }
                            {paquete.m_nIdTipo != 1 &&
                            <Grid item xs={6}>
                                <label className="input select" style={{width: "100%"}}>
                                    <FormControl fullWidth variant="outlined" margin="dense" required>
                                        <InputLabel id="m_nIdTipoEmbalajeLabel">Embalaje</InputLabel>
                                        <Select
                                            label="Embalaje"
                                            labelId="m_nIdTipoEmbalajeLabel"
                                            className="form-control"
                                            value={paquete.m_nIdTipoEmbalaje}
                                            disabled={props.disabled}
                                            required
                                            onChange={(event) => handleChangePaquetev2(event)}
                                            id="m_nIdTipoEmbalaje"
                                            name="m_nIdTipoEmbalaje"
                                        >
                                            {dataEmbalaje.map((embalaje) => (
                                                <option key={embalaje.m_nIdEmbalaje} value={embalaje.m_nIdEmbalaje}>
                                                    {embalaje.m_sNombre}
                                                </option>
                                            ))}
                                        </Select>
                                    </FormControl>
                                </label>
                            </Grid>
                            }
                            {paquete.m_nIdTipo != 1 &&
                            <Grid item xs={6}>
                                <div className="input">
                                    <TextField variant="outlined" margin="dense"
                                               onChange={(event) => handleChangePaquetev2(event)}
                                               type="text"
                                               label="Peso"
                                               required
                                               value={paquete.m_rPeso}
                                               disabled={props.disabled}
                                               placeholder="kg"
                                               name="m_rPeso"
                                               helperText={errores.errorPeso?errores.errorTexto:""}
                                               error={errores.errorPeso}
                                    />
                                </div>
                            </Grid>
                            }
                            {paquete.m_nIdTipo != 1 &&
                            <Grid item xs={6}>
                                <div className="input">
                                <TextField variant="outlined" margin="dense"
                                               onChange={(event) => handleChangePaquetev2(event)}
                                               type="text"
                                               label="Largo"
                                               required
                                               value={paquete.m_rLargo}
                                               disabled={props.disabled}
                                               placeholder="cms"
                                               name="m_rLargo"
                                               helperText={errores.errorLargo?errores.errorTexto:""}
                                               error={errores.errorLargo}
                                    />
                                </div>
                            </Grid>
                            }
                            {paquete.m_nIdTipo != 1 &&
                            <Grid item xs={6}>
                                <div className="input">
                                    <TextField variant="outlined" margin="dense"
                                               onChange={(event) => handleChangePaquetev2(event)}
                                               type="text"
                                               required
                                               label="Ancho"
                                               value={paquete.m_rAncho}
                                               disabled={props.disabled}
                                               placeholder="cms"
                                               name="m_rAncho"
                                               helperText={errores.errorAncho?errores.errorTexto:""}
                                               error={errores.errorAncho}
                                    />
                                </div>
                            </Grid>
                            }
                            {paquete.m_nIdTipo != 1 &&
                            <Grid item xs={6}>
                                <div className="input">
                                    <TextField variant="outlined" margin="dense"
                                               onChange={(event) => handleChangePaquetev2(event)}
                                               type="text"
                                               value={paquete.m_rAlto}
                                               label="Alto"
                                               required
                                               disabled={props.disabled}
                                               placeholder="cms"
                                               name="m_rAlto"
                                               helperText={errores.errorAlto?errores.errorTexto:""}
                                               error={errores.errorAlto}
                                    />
                                </div>
                            </Grid>
                            }
                            {paquete.m_nIdTipo != 1 &&
                            <Grid item xs={12}>
                                <div className="input">
                                    <TextField variant="outlined" margin="dense"
                                        // onChange={(event) => handleChangePaquete(event, index)}
                                               className="form-control"
                                               type="text"
                                               value={paquete.m_rVolumen}
                                               label="Volumen"
                                               disabled
                                               placeholder="cm3"
                                               name="m_rVolumen"
                                    />
                                </div>
                            </Grid>
                            }
                            <Grid item xs={12}>
                                <div className="input">
                                    <TextField variant="outlined" margin="dense"
                                               onChange={(event) => handleChangePaquetev2(event)}
                                               className="form-control"
                                               type="text"
                                               required
                                               label="Descripción"
                                               value={paquete.m_sDescripcion}
                                               disabled={props.disabled}
                                               placeholder="Descripción"
                                               name="m_sDescripcion"
                                    />
                                </div>
                            </Grid>

                            {paquete.m_nIdTipo != 1 &&
                            <Grid item xs={12}>
                                <div className="input">
                                    <TextField variant="outlined" margin="dense"
                                               onChange={(event) => handleChangePaquetev2(event)}
                                               className="form-control"
                                               type="text"
                                               label="Observaciones"
                                               value={paquete.m_sObservaciones}
                                               disabled={props.disabled}
                                               placeholder="Observaciones"
                                               name="m_sObservaciones"
                                    />
                                </div>
                            </Grid>
                            }
                            <Grid item xs={12}>
                                <FormControlLabel
                                    control={
                                        <Checkbox
                                            checked={state.agregarMas}
                                            onChange={handleChecked}
                                            color="primary"
                                            style={{transform: "scale(1.5)"}}
                                            inputProps={{'aria-label': 'primary checkbox'}}
                                            name="agregarMas"
                                        />
                                    }
                                    label="Agregar más paquetes"
                                    labelPlacement="end"
                                />

                            </Grid>
                        </Grid>

                    </DialogContent>
                    <DialogActions>
                        <Button  onClick={handleCancelar} color="primary">
                            Cancelar
                        </Button>
                        <Button type={"submit"} color="primary">
                            Agregar
                        </Button>
                    </DialogActions>
                </form>
            </Dialog>
        </div>
    );
}
