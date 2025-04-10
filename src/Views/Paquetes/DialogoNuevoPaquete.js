import React, {useEffect, useState} from 'react';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import Noty from 'noty';
import {
    Checkbox,
    FormControl,
    FormControlLabel,
    Grid,
    InputLabel,
    MenuItem,
    Select
} from "@mui/material";
import Autocomplete from '@mui/material/Autocomplete';
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
        nameInput:'',
        errorTexto:""

    })

    const resetErrores = () => {
        setErrores(errores=>{
            return{
                ...errores,
                errorLargo:false,
                errorAlto:false,
                errorAncho:false,
                errorPeso:false,
                errorCantidad:false,
                nameInput:'',
                errorTexto:""

            }
        })
    }

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
                producto: props.limpiarProducto ? null : paquete.producto,
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
                m_nIdProducto: props.limpiarProducto ? '' : paquete.m_nIdProducto,
                m_sTipo: "Paquete",
                m_sClaveSATProducto:'',
                m_sClaveSATUnidad:'',
            }
        })
        props.resetPaquete()
    }

    useEffect(value => {
        getAllEmbalajes()
    }, [])

    useEffect(() => {
        if (props.paquete.m_nIdPaquete !== 0){
            setPaquete(props.paquete)
            setOpen(true);
        }
    }, [props.paquete])

    useEffect(() => {
        if (open){
            resetErrores()
        }
    }, [open])

    useEffect(value => {
        if (props.cliente !== null){
            getProductosByConvenioCliente()
        }else{
            getAllProductos()
        }
    }, [props.cliente])

    useEffect(value => {
        if (errores.nameInput === 'producto'){
            setPaquete(paquete => {
                return {
                    ...paquete,
                    producto: null,
                    m_nIdProducto: '',
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
                    m_sTipo: "Paquete",
                    m_sClaveSATProducto:'',
                    m_sClaveSATUnidad:'',
                }
            })
        }
    }, [errores.nameInput])

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
        if(errores.errorAlto || errores.errorAncho || errores.errorCantidad ||errores.errorPeso || errores.errorLargo){
            showSuccess("Uno o más campos tienen error")
        }else{
            if (paquete.producto !== null) {
                if (state.agregarMas) {
                    props.agregar(paquete)
                    resetPaquete()
                    resetErrores()
                } else {
                    handleClose()
                    setPaquete(paquete=>{
                        return{
                            ...paquete,
                            m_rLargo:Number(paquete.m_xLargo)
                        }
                    })
                    props.agregar(paquete)
                    resetPaquete()
                    resetErrores()
                }
            }
        }

    }

    const handleCancelar = () => {
        resetPaquete()
        handleClose()
    }

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

        if(event.target.name === "m_nCantidad"){
            if(event.target.value!==""){//si la cantidad no esta vacia procede a validar si es mayor a cero o no contiene caracteres
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
                            errorCantidad:false
                        }
                    })
                }
            }else{
                setErrores(errores=>{
                    return{
                        ...errores,
                        errorCantidad:false
                    }
                })
            }
        }

        if(event.target.name === "m_rLargo"){
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
                            errorLargo:false
                        }
                    })
                }
            }else{
                setErrores(errores=>{
                    return{
                        ...errores,
                        errorLargo:false}
                })
            }
        }

        if(event.target.name === "m_rAlto"){
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
                            errorAlto:false
                        }
                    })
                }
            }else{
                setErrores(errores=>{
                    return{
                        ...errores,
                        errorAlto:false
                    }
                })
            }
        }

        if(event.target.name === "m_rAncho"){
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
                            errorAncho:false
                        }
                    })
                }
            }else{
                setErrores(errores=>{
                    return{
                        ...errores,
                        errorAncho:false
                    }
                })
            }
        }

        if(event.target.name === "m_rPeso"){
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
                            errorPeso:false
                        }
                    })
                }
            }else{
                setErrores(errores=>{
                    return{
                        ...errores,
                        errorPeso:false
                    }
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

        if (event.target.name === "m_nIdTipoEmbalaje"){
            setPaquete(paquete => {
                return {
                    ...paquete,
                    m_sTipoEmbalaje: dataEmbalaje.find((i) => i.m_nIdEmbalaje === event.target.value).m_sNombre
                }
            })
        }
        if (event.target.name === "m_nIdTipo"){
            setPaquete(paquete => {
                return {
                    ...paquete,
                    m_sTipo: event.target.value === 1 ? "Sobre" : "Paquete"
                }
            })
        }
    };

    const handleChangePaqueteProductov2 = (event, newValue) => {
        if (newValue === null) {
            setPaquete(paquete => {
                return {
                    ...paquete,
                    producto: null,
                    m_nIdProducto: 0,
                }
            })
            return
        }
        if (parseInt(newValue.m_nIdProducto) > 0) {
            if (newValue?.m_xLargo !== undefined || newValue?.m_xLargo !== null) {//si la cantidad no esta vacia procede a validar si es mayor a cero o no contiene caracteres
                if (Number(newValue.m_xLargo) <= 0) {
                    setErrores(errores => {
                        return {
                            ...errores,
                            errorLargo: true,
                            errorTexto: "Ingrese un numero mayor a 0"

                        }
                    })

                } else if (isNaN(Number(newValue.m_xLargo))) {
                    setErrores(errores => {
                        return {
                            ...errores,
                            errorLargo: true,
                            errorTexto: "Ingrese solo digitos"
                        }
                    })
                } else {
                    setErrores(errores => {
                        return {
                            ...errores,
                            errorLargo: false
                        }
                    })
                }
            } else {
                setErrores(errores => {
                    return {
                        ...errores,
                        errorLargo: false
                    }
                })
            }

            if (newValue?.m_xAlto !== undefined || newValue?.m_xAlto !== null) {//si la cantidad no esta vacia procede a validar si es mayor a cero o no contiene caracteres
                if (Number(newValue.m_xAlto) <= 0) {
                    setErrores(errores => {
                        return {
                            ...errores,
                            errorAlto: true,
                            errorTexto: "Ingrese un numero mayor a 0"

                        }
                    })
                } else if (isNaN(Number(newValue.m_xAlto))) {
                    setErrores(errores => {
                        return {
                            ...errores,
                            errorAlto: true,
                            errorTexto: "Ingrese solo digitos"
                        }
                    })
                } else {
                    setErrores(errores => {
                        return {
                            ...errores,
                            errorAlto: false
                        }
                    })
                }
            } else {
                setErrores(errores => {
                    return {
                        ...errores,
                        errorAlto: false
                    }
                })

            }
            if (newValue?.m_xAncho !== undefined || newValue?.m_xAncho !== null) {//si la cantidad no esta vacia procede a validar si es mayor a cero o no contiene caracteres
                if (Number(newValue.m_xAncho) <= 0) {
                    setErrores(errores => {
                        return {
                            ...errores,
                            errorAncho: true,
                            errorTexto: "Ingrese un numero mayor a 0"

                        }
                    })
                } else if (isNaN(Number(newValue.m_xAncho))) {
                    setErrores(errores => {
                        return {
                            ...errores,
                            errorAncho: true,
                            errorTexto: "Ingrese solo digitos"
                        }
                    })
                } else {
                    setErrores(errores => {
                        return {
                            ...errores,
                            errorAncho: false
                        }
                    })
                }
            } else {
                setErrores(errores => {
                    return {
                        ...errores,
                        errorAncho: false
                    }
                })
            }

            if (newValue?.m_xPeso !== undefined || newValue?.m_xPeso !== null) {//si la cantidad no esta vacia procede a validar si es mayor a cero o no contiene caracteres
                if (Number(newValue.m_xPeso) <= 0) {
                    setErrores(errores => {
                        return {
                            ...errores,
                            errorPeso: true,
                            errorTexto: "Ingrese un numero mayor a 0"

                        }
                    })
                } else if (isNaN(Number(newValue.m_xPeso))) {
                    setErrores(errores => {
                        return {
                            ...errores,
                            errorPeso: true,
                            errorTexto: "Ingrese solo digitos"
                        }
                    })
                } else {
                    setErrores(errores => {
                        return {
                            ...errores,
                            errorPeso: false
                        }
                    })
                }
            } else {
                setErrores(errores => {
                    return {
                        ...errores,
                        errorPeso: false
                    }
                })
            }

            setPaquete(paquete => {
                return {
                    ...paquete,
                    producto: newValue,
                    m_nIdProducto: newValue.m_nIdProducto || 0,
                    m_rLargo: newValue.m_xLargo || 0,
                    m_rAlto: newValue.m_xAlto || 0,
                    m_rAncho: newValue.m_xAncho || 0,
                    m_rPeso: newValue.m_xPeso || 0,
                    m_nIdTipoEmbalaje: newValue.m_nIdEmbalaje,
                    m_sTipoEmbalaje: dataEmbalaje.find((i) => i.m_nIdEmbalaje === newValue.m_nIdEmbalaje).m_sNombre,
                    m_sDescripcion: newValue.m_nIdProducto === 1 ? "" : newValue.m_sDescripcion,
                    m_sProducto: newValue.m_sDescripcion
                }
            })
            setPaquete(paquete => {
                return {
                    ...paquete,
                    m_rVolumen: paquete.m_rLargo * paquete.m_rAlto * paquete.m_rAncho
                }
            })
            setErrores(errores => {
                return {
                    ...errores,
                    nameInput: '',
                    errorTexto: ""
                }
            })
        } else {
            setErrores(errores => {
                return {
                    ...errores,
                    nameInput: 'producto',
                    errorTexto: "Producto inválido"
                }
            })
        }
    };

    const handleChangeInputProductov2= (event, newInputValue) => {
        let productoEncontrado = dataProductos.find(option => `${option.m_nIdProducto}-${option.m_sDescripcion}` === newInputValue)
        /*if (productoEncontrado ){
            handleChangePaqueteProductov2(null, productoEncontrado)
        }*/
        if (!productoEncontrado && newInputValue !== ''){
            setErrores(errores=>{
                return{
                    ...errores,
                    nameInput:'producto',
                    errorTexto:"Producto inválido"
                }
            })
        }
    }

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
                <Button variant="contained" size="x-large" color="primary" onClick={handleClickOpen}
                        style={{float: 'left', fontSize: "1em"}} disabled={props.disabled}>
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
                                    <FormControl fullWidth variant="outlined" size="small" required>
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
                                            <MenuItem key={2} value={2}>
                                                Paquete
                                            </MenuItem>
                                            {/*<option key={1} value={1}>
                                                Sobre
                                            </option>*/}
                                        </Select>
                                    </FormControl>
                                </label>
                            </Grid>
                            {parseInt(paquete.m_nIdTipo) !== 1 &&
                                <Grid item xs={12}>
                                    <div className="input">
                                        <Autocomplete
                                            size="small"
                                            value={paquete.producto}
                                            freeSolo
                                            required
                                            onChange={(event, newValue) => handleChangePaqueteProductov2(event, newValue)}
                                            onInputChange={(event, newInputValue) => handleChangeInputProductov2(event, newInputValue)}
                                            forcePopupIcon={false}
                                            options={dataProductos}
                                            disabled={props.disabled}
                                            getOptionLabel={(option) => (option.m_nIdProducto ? `${option.m_nIdProducto}-${option.m_sDescripcion}` : '')}
                                            variant="outlined"
                                            name={"producto"}
                                            style={{transform: "translate(14px, 10px) scale(1) !important"}}
                                            renderInput={(params) =>
                                                <TextField
                                                    variant="outlined"
                                                    label="Producto"
                                                    required
                                                    size="small"
                                                    onClick={handleClickProducto}
                                                    {...params}
                                                    error={errores.nameInput === 'producto'}
                                                    helperText={errores.errorTexto}
                                                />
                                            }
                                        />
                                    </div>
                                </Grid>
                            }
                            {parseInt(paquete.m_nIdTipo) !== 1 &&
                                <Grid item xs={6}>
                                    <div className="input">
                                        <TextField variant="outlined" size="small"
                                                   onChange={(event) => handleChangePaquetev2(event)}
                                                   type="number"
                                                   label="Cantidad"
                                                   required
                                                   value={paquete.m_nCantidad}
                                                   disabled={props.disabled || errores.nameInput === 'producto' }
                                                   placeholder="Cantidad"
                                                   name="m_nCantidad"
                                                   helperText={errores.errorCantidad?errores.errorTexto:""}
                                                   error={errores.errorCantidad}
                                        />
                                    </div>
                                </Grid>
                            }
                            {parseInt(paquete.m_nIdTipo) !== 1 &&
                                <Grid item xs={6}>
                                    <div className="input">
                                        <TextField variant="outlined" size="small"
                                                   label="Embalaje"
                                                   labelId="m_nIdTipoEmbalajeLabel"
                                                   value={paquete.m_nIdTipoEmbalaje}
                                                   required
                                                   disabled={props.disabled || errores.nameInput === 'producto'}
                                                   onChange={(event) => handleChangePaquetev2(event)}
                                                   id="m_nIdTipoEmbalaje"
                                                   name="m_nIdTipoEmbalaje"
                                                   select
                                        >
                                            {dataEmbalaje.map((embalaje) => (
                                                <MenuItem key={embalaje.m_nIdEmbalaje} value={embalaje.m_nIdEmbalaje}>
                                                    {embalaje.m_sNombre}
                                                </MenuItem>
                                            ))}
                                        </TextField>
                                    </div>
                                    {/*<label className="input select" style={{width: "100%"}}>
                                        <FormControl fullWidth variant="outlined" size="small">
                                            <InputLabel id="m_nIdTipoEmbalajeLabel">Embalaje</InputLabel>

                                        </FormControl>
                                    </label>*/}
                                </Grid>
                            }
                            {parseInt(paquete.m_nIdTipo) !== 1 &&
                                <Grid item xs={6}>
                                    <div className="input">
                                        <TextField variant="outlined" size="small"
                                                   onChange={(event) => handleChangePaquetev2(event)}
                                                   type="text"
                                                   label="Peso"
                                                   required
                                                   value={paquete.m_rPeso}
                                                   disabled={props.disabled || errores.nameInput === 'producto'}
                                                   placeholder="kg"
                                                   name="m_rPeso"
                                                   helperText={errores.errorPeso?errores.errorTexto:""}
                                                   error={errores.errorPeso}
                                        />
                                    </div>
                                </Grid>
                            }
                            {parseInt(paquete.m_nIdTipo) !== 1 &&
                                <Grid item xs={6}>
                                    <div className="input">
                                    <TextField variant="outlined" size="small"
                                                   onChange={(event) => handleChangePaquetev2(event)}
                                                   type="text"
                                                   label="Largo"
                                                   required
                                                   value={paquete.m_rLargo}
                                                   disabled={props.disabled || errores.nameInput === 'producto'}
                                                   placeholder="cms"
                                                   name="m_rLargo"
                                                   helperText={errores.errorLargo?errores.errorTexto:""}
                                                   error={errores.errorLargo}
                                        />
                                    </div>
                                </Grid>
                            }
                            {parseInt(paquete.m_nIdTipo) !== 1 &&
                                <Grid item xs={6}>
                                    <div className="input">
                                        <TextField variant="outlined" size="small"
                                                   onChange={(event) => handleChangePaquetev2(event)}
                                                   type="text"
                                                   required
                                                   label="Ancho"
                                                   value={paquete.m_rAncho}
                                                   disabled={props.disabled || errores.nameInput === 'producto'}
                                                   placeholder="cms"
                                                   name="m_rAncho"
                                                   helperText={errores.errorAncho?errores.errorTexto:""}
                                                   error={errores.errorAncho}
                                        />
                                    </div>
                                </Grid>
                            }
                            {parseInt(paquete.m_nIdTipo) !== 1 &&
                                <Grid item xs={6}>
                                    <div className="input">
                                        <TextField variant="outlined" size="small"
                                                   onChange={(event) => handleChangePaquetev2(event)}
                                                   type="text"
                                                   value={paquete.m_rAlto}
                                                   label="Alto"
                                                   required
                                                   disabled={props.disabled || errores.nameInput === 'producto'}
                                                   placeholder="cms"
                                                   name="m_rAlto"
                                                   helperText={errores.errorAlto?errores.errorTexto:""}
                                                   error={errores.errorAlto}
                                        />
                                    </div>
                                </Grid>
                            }
                            {parseInt(paquete.m_nIdTipo) !== 1 &&
                                <Grid item xs={12}>
                                    <div className="input">
                                        <TextField fullWidth variant="outlined" size="small"
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
                                    <TextField fullWidth variant="outlined" size="small"
                                               onChange={(event) => handleChangePaquetev2(event)}
                                               className="form-control"
                                               type="text"
                                               required
                                               label="Descripción"
                                               value={paquete.m_sDescripcion}
                                               disabled={props.disabled || errores.nameInput === 'producto'}
                                               placeholder="Descripción"
                                               name="m_sDescripcion"
                                    />
                                </div>
                            </Grid>

                            {parseInt(paquete.m_nIdTipo) !== 1 &&
                                <Grid item xs={12}>
                                    <div className="input">
                                        <TextField fullWidth variant="outlined" size="small"
                                                   onChange={(event) => handleChangePaquetev2(event)}
                                                   className="form-control"
                                                   type="text"
                                                   label="Observaciones"
                                                   value={paquete.m_sObservaciones}
                                                   disabled={props.disabled || !paquete.producto}
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
