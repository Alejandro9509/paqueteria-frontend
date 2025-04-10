import React, {useEffect, useState} from "react";
import {
    Checkbox,
    FormControl,
    FormControlLabel,
    Grid,
    TextField,
} from "@mui/material";
import {
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
} from "@mui/material";
import ClavesCFDI from "./ClavesCFDI";
import Noty from 'noty';
import {
    obtenerSATPaginado,
    obtenerSATBusqueda
} from "../../Util/Contexts/ConceptosFacturacionContext";
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
        titulo:"",
        onFocus: true
    });
    const [errores, setErrores] = useState({
        errorCantidad:false,
        errorPeso:false,
        errorTexto:"Ingrese un numero mayor a 0",
        errorCaracteres: false,
        errorTextoPeso:""
    })
    const [disableSeleccionar, setDisableSeleccionar] = React.useState({
        disableProducto: true,
        disableUnidad: true,
        disableMaterialPeligroso: true,
        disableEmbalaje: true,
        disableFraccion: true
    });

    const handleChange = (event) => {
        if(event.target.name === "cantidad"){
            if(event.target.value!=="") {
                if (Number(event.target.value) <= 0) {
                    setErrores(errores => {
                        return {
                            ...errores,
                            errorCantidad: true,
                            errorTexto: "Ingrese un número mayor a 0"

                        }
                    })
                } else if (isNaN(Number(event.target.value))) {
                    setErrores(errores => {
                        return {
                            ...errores,
                            errorCantidad: true,
                            errorTexto: "Ingrese solo dígitos"
                        }
                    })
                }
                else if (!Number.isInteger((Number(event.target.value)))) {
                    setErrores(errores => {
                        return {
                            ...errores,
                            errorCantidad: true,
                            errorTexto: "Ingrese solo números enteros"
                        }
                    })
                }
                else {
                    setErrores(errores => {
                        return {
                            ...errores,
                            errorCantidad: false
                        }
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
        if (event.target.name === "peso"){
            if(event.target.value!=="") {
                if (Number(event.target.value) <= 0) {
                    setErrores(errores => {
                        return {
                            ...errores,
                            errorPeso: true,
                            errorTextoPeso: "Ingrese un número mayor a 0"

                        }
                    })
                } else if (isNaN(Number(event.target.value))) {
                    setErrores(errores => {
                        return {
                            ...errores,
                            errorPeso: true,
                            errorTextoPeso: "Ingrese solo dígitos"
                        }
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
        props.onChangeData(0, event)
    }

    const selectClase = (row) => {
        props.onChangeData(state.complementoSAT, row)
    }

    const closeDialog = () => {
        setState({ ...state, openDialog: false, catalogo: "",busqueda:"" });
        setPagina(0)
    }

    const cancelDialog = () => {
        props.onChangeData(0)
        setState({ ...state, openDialog: false, catalogo: "" });
        setPagina(0)
    }
    
    function cargarDesdeServidor(pagina,numRegistros,catalogo){
        /* if (state.catalogo !== "") { */
        if (catalogo === 1){
            return new obtenerSATPaginado(numRegistros, pagina || 0, "c_ClaveProdServCP", state.busqueda).then((respuesta) => {
                if(respuesta.data.length>0){
                setState({...state, dataSat: respuesta.data, openDialog: true,catalogo: "c_ClaveProdServCP", busqueda: "", complementoSAT: 1,titulo:"Producto o Servicio"})
                }else{
                    showSuccess("No se encontró ningún registro")
                }

            })
        }else if(catalogo === 2){
            return new obtenerSATPaginado(numRegistros, pagina || 0, "c_ClaveUnidad", state.busqueda).then((respuesta) => {
                if(respuesta.data.length>0){
                setState({...state, dataSat: respuesta.data, openDialog: true,catalogo: "c_ClaveUnidad", busqueda: "", complementoSAT: 2,titulo:"Unidad medida"})
                }else{
                    showSuccess("No se encontró ningún registro")
                }

            })
        }else if(catalogo === 3){
            return new obtenerSATPaginado(numRegistros, pagina || 0, "c_TipoEmbalaje", state.busqueda).then((respuesta) => {
                if(respuesta.data.length>0){
                setState({...state, dataSat: respuesta.data, openDialog: true,catalogo: "c_TipoEmbalaje", busqueda: "", complementoSAT: 3,titulo:"Embalaje"})
                }else{
                    showSuccess("No se encontró ningún registro")
                }

            })
        }else if (catalogo === 4){
            return new obtenerSATPaginado(numRegistros, pagina || 0, "c_FraccionArancelaria", state.busqueda).then((respuesta) => {
                if(respuesta.data.length>0){
                setState({...state, dataSat: respuesta.data, openDialog: true,catalogo: "c_FraccionArancelaria", busqueda: "", complementoSAT: 4,titulo:"Fracción arancelaria"})
                }else{
                    showSuccess("No se encontró ningún registro")
                }

            })
        }else if (catalogo === 5){
            return new obtenerSATPaginado(numRegistros, pagina || 0, "c_MaterialPeligroso", state.busqueda).then((respuesta) => {
                if(respuesta.data.length>0){
                setState({...state, dataSat: respuesta.data, openDialog: true,catalogo: "c_MaterialPeligroso", busqueda: "", complementoSAT: 5,titulo:"Material peligroso"})
                }else{
                    showSuccess("No se encontró ningún registro")
                }

            })
        }else if (catalogo === 6){
            return new obtenerSATPaginado(numRegistros, pagina || 0, "c_FormaFarmaceutica", state.busqueda).then((respuesta) => {
                if(respuesta.data.length>0){
                    setState({...state, dataSat: respuesta.data, openDialog: true,catalogo: "c_FormaFarmaceutica", busqueda: "", complementoSAT: 6,titulo:"Forma Farmaceutica"})
                }else{
                    showSuccess("No se encontró ningún registro")
                }

            })
        }
        else if (catalogo === 8){
            return new obtenerSATPaginado(numRegistros, pagina || 0, "c_CondicionesEspeciales", state.busqueda).then((respuesta) => {
                if(respuesta.data.length>0){
                    setState({...state, dataSat: respuesta.data, openDialog: true,catalogo: "c_CondicionesEspeciales", busqueda: "", complementoSAT: 8,titulo:"Condiciones Especiales"})
                }else{
                    showSuccess("No se encontró ningún registro")
                }

            })
        }
        else if (catalogo === 9){
            return new obtenerSATPaginado(numRegistros, pagina || 0, "c_SectorCOFEPRIS", state.busqueda).then((respuesta) => {
                if(respuesta.data.length>0){
                    setState({...state, dataSat: respuesta.data, openDialog: true,catalogo: "c_SectorCOFEPRIS", busqueda: "", complementoSAT: 9,titulo:"Categoría"})
                }else{
                    showSuccess("No se encontró ningún registro")
                }

            })
        }
        else{
            if(state.busqueda !== ""){
                return new obtenerSATPaginado(numRegistros, pagina || 0, state.catalogo, state.busqueda).then((respuesta) => {
                    if(respuesta.data.length>0){
                    setState({...state, dataSat: respuesta.data})
                    }else{
                        showSuccess("No se encontró ningún registro")
                    }
                })
            }else if(state.busqueda === "" && state.catalogo !== ""){
                return new obtenerSATPaginado(numRegistros, pagina || 0, state.catalogo, state.busqueda).then((respuesta) => {
                    if(respuesta.data.length>0){
                    setState({...state, dataSat: respuesta.data})
                    }else{
                        showSuccess("No se encontró ningún registro")
                    }
                })
            }
        }
       /*  } */
    }

    useEffect(() => {
        cargarDesdeServidor(pagina.page,numRegistros)
    }, [pagina,state.busqueda,state.catalogo])

    const handleKeyDown = e => {
        if (e.key === " ") {
          e.preventDefault();
        }
    }

    const handleChangeSpecial = (e) => {
        /* if(e.target.name === "claveUnidad"){ */
            const value = e.target.value;
            const sanitizedValue = value.replace(/[^\w\s]/gi, '');
            if (value !== sanitizedValue) {
                setErrores({
                    ...errores,
                    errorCaracteres: true});
                    /* setDisableSeleccionar({
                        ...disableSeleccionar,
                        disableUnidad: false}); */
                    props.onChangeData(99, e,true)
            } else {
                setErrores({
                    ...errores,
                    errorCaracteres: false});
/*                     setDisableSeleccionar({
                        ...disableSeleccionar,
                        disableUnidad: false});  */
                    props.onChangeData(99, e)
            }
/*         }else if (e.target.name === "claveProducto"){
            setDisableSeleccionar({
                ...disableSeleccionar,
                disableProducto: false});
            props.onChangeData(6, e)
        }else if (e.target.name === "claveMaterialPeligroso"){
            setDisableSeleccionar({
                ...disableSeleccionar,
                disableMaterialPeligroso: false});
            props.onChangeData(6, e)
        }else if(e.target.name === "claveEmbalaje"){
            setDisableSeleccionar({
                ...disableSeleccionar,
                disableEmbalaje: false});
            props.onChangeData(6, e)
        }else if(e.target.name === "claveFraccion"){
            setDisableSeleccionar({
                ...disableSeleccionar,
                disableFraccion: false});
            props.onChangeData(6, e)
        }
 */    }

    const handleClickBuscarClaveSat = (idcomplemento) =>{
        if(idcomplemento === 1 && props.dataComplemento.claveProducto){
            var catalogo = "c_ClaveProdServCP";
            setState({
                ...state,
                catalogo: "c_ClaveProdServCP",
                busqueda: "",
                complementoSAT: 1,
                titulo:"Producto o Servicio",
            })

            obtenerSATBusqueda(catalogo,props.dataComplemento.claveProducto).then(respuesta => {
                if(respuesta.data.Estatus){
                    props.onChangeData(1, respuesta.data)
                }else{
                    showSuccess(respuesta.data)
                    props.resetComplemento(1)
                }
            })
        }else if(idcomplemento === 2 && props.dataComplemento.claveUnidad){
            var catalogo = "c_ClaveUnidad";

            setState({
                ...state,
                catalogo: "c_ClaveUnidad",
                busqueda: "",
                complementoSAT: 2,
                titulo:"Unidad medida",
            })

            obtenerSATBusqueda(catalogo,props.dataComplemento.claveUnidad).then(respuesta => {
                if(respuesta.data.Estatus){
                    props.onChangeData(2, respuesta.data)
                }else{
                    props.resetComplemento(2)
                    showSuccess(respuesta.data)
                }
            })
        }else if(idcomplemento === 3 && props.dataComplemento.claveEmbalaje){
            var catalogo = "c_TipoEmbalaje";

            setState({
                ...state,
                catalogo: "c_TipoEmbalaje",
                busqueda: "",
                complementoSAT: 3,
                titulo:"Embalaje",
            })
            obtenerSATBusqueda(catalogo,props.dataComplemento.claveEmbalaje).then(respuesta => {
                if(respuesta.data.Estatus){
                    props.onChangeData(3, respuesta.data)
                }else{
                    props.resetComplemento(4)
                    showSuccess(respuesta.data)
                }
            })
        }else if(idcomplemento === 4 && props.dataComplemento.claveFraccion){
            var catalogo = "c_FraccionArancelaria";

            setState({
                ...state,
                catalogo: "c_FraccionArancelaria",
                busqueda: "",
                complementoSAT: 4,
                titulo:"Fracción arancelaria",
            })
            obtenerSATBusqueda(catalogo,props.dataComplemento.claveFraccion).then(respuesta => {
                if(respuesta.data.Estatus){
                    props.onChangeData(4, respuesta.data)
                }else{
                    props.resetComplemento(5)
                    showSuccess(respuesta.data)
                }
            })
        }else if(idcomplemento === 5 && props.dataComplemento.claveMaterialPeligroso){
            var catalogo = "c_MaterialPeligroso";

            setState({
                ...state,
                catalogo: "c_MaterialPeligroso",
                busqueda: "",
                complementoSAT: 5,
                titulo:"Material peligroso",
            })
            obtenerSATBusqueda(catalogo,props.dataComplemento.claveMaterialPeligroso).then(respuesta => {
                if(respuesta.data.Estatus){
                    props.onChangeData(5, respuesta.data)
                }else{
                    props.resetComplemento(3)
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
                        cancel ={props.resetComplemento}
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
                                    size="small"
                                    type="number"
                                    label="Cantidad"
                                    required
                                    disabled={props.consulta}
                                    value={props.dataComplemento.cantidad}
                                    onChange={handleChange}
                                    name="cantidad"
                                    error={errores.errorCantidad}
                                    helperText={errores.errorCantidad ? errores.errorTexto : null}
                                    InputProps={{ inputProps: { min: 1 } }}
                                />
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <TextField
                                    fullWidth
                                    variant="outlined"
                                    size="small"
                                    type="number"
                                    className="form-control"
                                    label="Peso"
                                    required
                                    disabled={props.consulta}
                                    value={props.dataComplemento.peso}
                                    onChange={handleChange}
                                    error={errores.errorPeso}
                                    helperText={errores.errorPeso ? errores.errorTextoPeso : null}
                                    name="peso"
                                    InputProps={{ inputProps: { min: 0 } }}
                                />
                                {
                                    errores.errorPeso &&
                                    <div style={{ "margin":"5%"}}>

                                    </div>
                                }
                            </Grid>
                            <Grid item xs={12} sm={2}>
                                <TextField
                                    variant="outlined"
                                    size="small"
                                    type="number"
                                    className="form-control"
                                    label="Clave SAT"
                                    value={props.dataComplemento.claveProducto}
                                    name="claveProducto"
                                    required
                                    onChange={(e)=>{handleChangeSpecial(e)}}
                                    aria-readonly={true}
                                    disabled={props.consulta}
                                    InputProps={{
                                        inputProps:{min: 1}
                                    }}
                                    onBlur={(e) => {
                                        handleClickBuscarClaveSat(1)
                                    }}
                                    onKeyUp={(e)=>{
                                        if(e.key === 'Enter' || e.keyCode === 13){
                                            handleClickBuscarClaveSat(1)
                                        }
                                    }}
                                />
                            </Grid>
                            <Grid item xs={12} sm={8}>
                                <TextField
                                    variant="outlined"
                                    size="small"
                                    type="text"
                                    fullWidth
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
                                    style={{margin: "0px", fontSize: "1em"}}
                                    onClick={() => cargarDesdeServidor(pagina.page,20,1)  /* handleClickBuscarClaveSat(1) *//* setState({...state,catalogo: "c_ClaveProdServCP", busqueda: "", complementoSAT: 1,titulo:"Producto o Servicio"}) */}
                                    //disabled= {disableSeleccionar.disableProducto}
                                    >
                                    Seleccionar
                                </Button>
                            </Grid>
                            <Grid item xs={12} sm={2}>
                                <TextField
                                    variant="outlined"
                                    size="small"
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
                                    onBlur={() => {
                                        handleClickBuscarClaveSat(2)
                                    }}
                                    onKeyUp={(e)=>{
                                        if(e.key === 'Enter' || e.keyCode === 13){
                                            handleClickBuscarClaveSat(2)
                                        }
                                    }}
                                />
                                {errores.errorCaracteres &&
                                    <span style={{ color: 'red' }}>Caracteres especiales no estan permitidos.</span>
                                }
                            </Grid>
                            <Grid item xs={12} sm={8}>
                                <TextField
                                    variant="outlined"
                                    size="small"
                                    className="form-control"
                                    type="text"
                                    fullWidth
                                    label="Unidad Medida"
                                    disabled={props.consulta}
                                    required
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
                                    style={{margin: "0px", fontSize: "1em"}}
                                    onClick={() => cargarDesdeServidor(pagina.page,20,2) /* setState({...state, catalogo: "c_ClaveUnidad", busqueda: "", complementoSAT: 2,titulo:"Unidad medida"}) */ /* handleClickBuscarClaveSat(2) */}
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
                            <Grid item xs={12} sm={3}>
                                <FormControlLabel
                                    control={
                                        <Checkbox
                                            checked={props.dataComplemento.esFarmaco}
                                            onChange={handleChange}
                                            name="esFarmaco"
                                            color="primary"
                                        />
                                    }
                                    label="Es Fármaco"
                                />
                            </Grid>
                        </Grid>
                        {props.dataComplemento.esPeligroso &&
                        <Grid container spacing={1}>
                            <Grid item xs={12} sm={2}>
                                <TextField
                                    variant="outlined"
                                    size="small"
                                    fullWidth
                                    type="text"
                                    className="form-control"
                                    label="Clave SAT"
                                    aria-readonly={true}
                                    required
                                    value={props.dataComplemento.claveMaterialPeligroso}
                                    onChange={(e)=>{ handleChangeSpecial(e)}/* props.onChangeData(6, e) */}
                                    name="claveMaterialPeligroso"
                                    onBlur={(e) => {
                                        handleClickBuscarClaveSat(5)
                                    }}
                                    onKeyUp={(e)=>{
                                        if(e.key === 'Enter' || e.keyCode === 13){
                                            handleClickBuscarClaveSat(5)
                                        }
                                    }}
                                />
                            </Grid>
                            <Grid item xs={12} sm={8}>
                                <TextField
                                    variant="outlined"
                                    size="small"
                                    className="form-control"
                                    type="text"
                                    fullWidth
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
                                    style={{margin: "0px", fontSize: "1em"}}
                                    name="materialPeligrosoSAT"
                                    onClick={() => cargarDesdeServidor(pagina.page,20,5) /* setState({...state,catalogo: "c_MaterialPeligroso", busqueda: "", complementoSAT: 5,titulo:"Material peligroso"}) */}>
                                    Seleccionar
                                </Button>
                            </Grid>

                            <Grid item xs={12} sm={2}>
                                <TextField
                                    variant="outlined"
                                    size="small"
                                    fullWidth
                                    type="text"
                                    className="form-control"
                                    label="Clave SAT"
                                    aria-readonly={true}
                                    required
                                    value={props.dataComplemento.claveEmbalaje}
                                    name="claveEmbalaje"
                                    onChange={(e)=>  { handleChangeSpecial(e)}}
                                    onBlur={(e) => {
                                        handleClickBuscarClaveSat(3)
                                    }}
                                    onKeyUp={(e)=>{
                                        if(e.key === 'Enter' || e.keyCode === 13){
                                            handleClickBuscarClaveSat(3)
                                        }
                                    }}
                                />
                            </Grid>
                            <Grid item xs={12} sm={4}>
                                <TextField
                                    variant="outlined"
                                    size="small"
                                    className="form-control"
                                    type="text"
                                    fullWidth
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
                                    size="small"
                                    type="text"
                                    fullWidth
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
                                    style={{margin: "0px", fontSize: "1em"}}
                                    name={"embalajeSAT"}
                                    onClick={() => cargarDesdeServidor(pagina.page,20,3) /* setState({...state,catalogo: "c_TipoEmbalaje", busqueda: "", complementoSAT: 3,titulo:"Embalaje"}) */}>
                                    Seleccionar
                                </Button>
                            </Grid>

                            <Grid item xs={12} sm={2}>
                                <TextField
                                    variant="outlined"
                                    size="small"
                                    type="text"
                                    className="form-control"
                                    label="Clave SAT"
                                    fullWidth
                                    aria-readonly={true}
                                    value={props.dataComplemento.claveFraccion}
                                    name="claveFraccion"
                                    onChange={(e)=> { handleChangeSpecial(e)}}
                                    onBlur={(e) => {
                                        handleClickBuscarClaveSat(4)
                                    }}
                                    onKeyUp={(e)=>{
                                        if(e.key === 'Enter' || e.keyCode === 13){
                                            handleClickBuscarClaveSat(4)
                                        }
                                    }}
                                />
                            </Grid>
                            <Grid item xs={12} sm={8}>
                                <TextField
                                    variant="outlined"
                                    size="small"
                                    fullWidth
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
                                    style={{margin: "0px", fontSize: "1em"}}
                                    name="fraccionSAT"
                                    onClick={() => cargarDesdeServidor(pagina.page,20,4) /* setState({...state,catalogo: "c_FraccionArancelaria", busqueda: "", complementoSAT: 4,titulo:"Fracción arancelaria"}) */}>
                                    Seleccionar
                                </Button>
                            </Grid>
                        </Grid>
                        }
                        {props.dataComplemento.esFarmaco &&
                        <Grid container  spacing={2} style={{marginTop:"10px"}}>
                            <Grid container sm={12} spacing={1} style={{paddingLeft:"1%"}}>
                                <Grid item xs={12} sm={2} >
                                    <TextField
                                        variant="outlined"
                                        type="text"
                                        size="small"
                                        fullWidth
                                        disabled={props.consulta}
                                        className="form-control"
                                        label="Clave SAT"
                                        value={props.dataComplemento.sectorCOFEPRIS}
                                        aria-readonly={true}
                                        required
                                    />
                                </Grid>
                                <Grid item sm={8}>
                                    <TextField
                                        variant="outlined"
                                        className="form-control"
                                        type="text"
                                        fullWidth
                                        size="small"
                                        label="Categoría"
                                        aria-readonly={true}
                                        value={props.dataComplemento.descripcionSectorCOFEPRIS}
                                        disabled
                                    />
                                </Grid>
                                <Grid item sm={2}>
                                    <Button
                                        type="button"
                                        fullWidth
                                        className="btn btn-primary primary-btn"
                                        name={"sectorCOFEPRIS"}
                                        style={{margin: "0px", fontSize: "1em"}}
                                        //disabled= {disableSeleccionar.disableFraccion}
                                        onClick={() => cargarDesdeServidor(pagina.page,20,9) /* setState({...state,catalogo: "c_FraccionArancelaria", busqueda: "", complementoSAT: 4,titulo:"Fracción arancelaria"}) */}
                                    >
                                        Seleccionar
                                    </Button>
                                </Grid>
                            </Grid>
                            {(props.dataComplemento.sectorCOFEPRIS==2 || props.dataComplemento.sectorCOFEPRIS==5) &&

                                    <Grid item sm={4}>
                                    <TextField
                                        variant="outlined"
                                        type="text"
                                        fullWidth
                                        id={"c2c5q"}
                                        size="small"
                                        value={props.dataComplemento.nombreIngredienteActivo}
                                        label={"Nombre del Ingrediente Activo"}
                                        onChange={(e)=>{props.setDataComplemento(dataComplemento =>{
                                            return {
                                                ...props.dataComplemento,
                                                nombreIngredienteActivo:e.target.value,
                                            }
                                        });}}
                                    >

                                    </TextField>
                                </Grid>
                            }
                            {(props.dataComplemento.sectorCOFEPRIS==2 || props.dataComplemento.sectorCOFEPRIS==4) &&

                                <Grid item sm={4}>
                                    <TextField
                                        variant="outlined"
                                        type="text"
                                        id={"c2c4p"}
                                        fullWidth
                                        size="small"
                                        inputProps={{maxLength:150}}
                                        value={props.dataComplemento.nomQuimico}
                                        label={"Nombre Químico"}
                                        onChange={(e)=>{props.setDataComplemento(dataComplemento =>{
                                            return {
                                                ...props.dataComplemento,
                                                nomQuimico:e.target.value,
                                            }
                                        });}}
                                    >

                                    </TextField>
                                </Grid>
                            }
                            {(props.dataComplemento.sectorCOFEPRIS==1 || props.dataComplemento.sectorCOFEPRIS==3) &&
                                <Grid item sm={4}>
                                    <TextField
                                        variant="outlined"
                                        type="text"
                                        fullWidth
                                        size="small"
                                        inputProps={{maxLength:50}}
                                        value={props.dataComplemento.denominacionGenerica}
                                        label={"Denominación Genérica"}
                                        className="clave1"
                                        id={"c1c3a"}
                                        onChange={(e)=>{props.setDataComplemento(dataComplemento =>{
                                            return {
                                                ...props.dataComplemento,
                                                denominacionGenerica:e.target.value,
                                            }
                                        });}}
                                    >
                                    </TextField>
                                </Grid>
                            }
                            {(props.dataComplemento.sectorCOFEPRIS==1 || props.dataComplemento.sectorCOFEPRIS==3) &&
                                <Grid item sm={4}>
                                    <TextField
                                        variant="outlined"
                                        id={"c1c3b"}
                                        type="text"
                                        fullWidth
                                        size="small"
                                        inputProps={{maxLength:50}}
                                        value={props.dataComplemento.denominacionDistintiva}
                                        label={"Denominación Distintiva (marca)"}
                                        onChange={(e)=>{props.setDataComplemento(dataComplemento =>{
                                            return {
                                                ...props.dataComplemento,
                                                denominacionDistintiva:e.target.value,
                                            }
                                        });}}
                                    >
                                    </TextField>
                                </Grid>
                            }
                            {(props.dataComplemento.sectorCOFEPRIS>=1 && props.dataComplemento.sectorCOFEPRIS<=3) &&
                                <Grid item sm={4}>
                                    <TextField
                                        variant="outlined"
                                        type="text"
                                        size="small"
                                        fullWidth
                                        value={props.dataComplemento.fabricante}
                                        id={"c1c2c3d"}
                                        inputProps={{maxLength:240}}
                                        label={"Fabricante"}
                                        onChange={(e)=>{props.setDataComplemento(dataComplemento =>{
                                            return {
                                                ...props.dataComplemento,
                                                fabricante:e.target.value,
                                            }
                                        });}}
                                    >
                                    </TextField>
                                </Grid>
                            }
                            {(props.dataComplemento.sectorCOFEPRIS>=1 && props.dataComplemento.sectorCOFEPRIS<=3) &&
                                <Grid item sm={4}>
                                    <FormControl className="input select" fullWidth variant="outlined">
                                        <TextField
                                            variant="outlined"
                                            type="date"
                                            fullWidth
                                            id={"c1c2c3e"}
                                            label={"Fecha de Caducidad"}
                                            value={props.dataComplemento.fechaCaducidad}
                                            InputLabelProps={{shrink: true,}}
                                            onChange={(e)=>{props.setDataComplemento(dataComplemento =>{
                                                return {
                                                    ...props.dataComplemento,
                                                    fechaCaducidad:e.target.value,
                                                }
                                            });}}
                                        >
                                        </TextField>
                                    </FormControl>
                                </Grid>
                            }
                            {(props.dataComplemento.sectorCOFEPRIS>=1 && props.dataComplemento.sectorCOFEPRIS<=3) &&
                                <Grid item sm={4}>
                                    <FormControl className="input select" fullWidth variant="outlined">
                                        <TextField
                                            variant="outlined"
                                            id={"c1c2c3f"}
                                            type="text"
                                            size="small"
                                            fullWidth
                                            label={"Lote Medicamento"}
                                            value={props.dataComplemento.loteMedicamento}
                                            inputProps={{maxLength:10}}
                                            onChange={(e)=>{props.setDataComplemento(dataComplemento =>{
                                                return {
                                                    ...props.dataComplemento,
                                                    loteMedicamento:e.target.value,
                                                }
                                            });}}
                                        >
                                        </TextField>
                                    </FormControl>
                                </Grid>
                            }
                            {(props.dataComplemento.sectorCOFEPRIS>=1 && props.dataComplemento.sectorCOFEPRIS<=3) &&
                                <Grid container sm={12} spacing={1} style={{paddingLeft:"2%",paddingTop:"2%"}}>
                                    <Grid item xs={12} sm={2} >
                                        <TextField
                                            variant="outlined"
                                            type="text"
                                            size="small"
                                            fullWidth
                                            disabled={props.consulta}
                                            className="form-control"
                                            label="Clave SAT"
                                            value={props.dataComplemento.claveFormaFarmaceutica}
                                            aria-readonly={true}
                                            required
                                        />
                                    </Grid>
                                    <Grid item sm={8}>
                                        <TextField
                                            variant="outlined"
                                            className="form-control"
                                            id={"c1c2c3g"}
                                            type="text"
                                            fullWidth
                                            size="small"
                                            label="Forma Farmacéutica"
                                            aria-readonly={true}
                                            value={props.dataComplemento.formaFarmaceutica}
                                            disabled
                                        />
                                    </Grid>
                                    <Grid item sm={2}>
                                        <Button
                                            type="button"
                                            fullWidth
                                            className="btn btn-primary primary-btn"
                                            style={{margin: "0px", fontSize: "1em"}}
                                            onClick={() => cargarDesdeServidor(pagina.page,20,6) /* setState({...state,catalogo: "c_FraccionArancelaria", busqueda: "", complementoSAT: 4,titulo:"Fracción arancelaria"}) */}
                                            >
                                            Seleccionar
                                        </Button>
                                    </Grid>
                                </Grid>
                            }
                            {(props.dataComplemento.sectorCOFEPRIS>=1 && props.dataComplemento.sectorCOFEPRIS<=3) &&
                                <Grid container sm={12} spacing={1} style={{paddingLeft:"2%", paddingTop:"1%"}}>
                                    <Grid item sm={2} >
                                        <TextField
                                            variant="outlined"
                                            type="text"
                                            size="small"
                                            fullWidth
                                            className="form-control"
                                            label="Clave SAT"
                                            aria-readonly={true}
                                            value={props.dataComplemento.claveCondicionesEspeciales}
                                        />
                                    </Grid>
                                    <Grid item sm={8}>
                                        <TextField
                                            variant="outlined"
                                            className="form-control"
                                            type="text"
                                            size="small"
                                            fullWidth
                                            id={"c1c2c3h"}
                                            label="Condición Especial de Transporte"
                                            aria-readonly={true}
                                            value={props.dataComplemento.condicionEspecial}
                                            disabled
                                        />
                                    </Grid>
                                    <Grid item sm={2}>
                                        <Button
                                            type="button"
                                            fullWidth
                                            className="btn btn-primary primary-btn"
                                            style={{margin: "0px", fontSize: "1em"}}
                                            onClick={() => cargarDesdeServidor(pagina.page,20,8) /* setState({...state,catalogo: "c_FraccionArancelaria", busqueda: "", complementoSAT: 4,titulo:"Fracción arancelaria"}) */}
                                        >
                                            Seleccionar
                                        </Button>
                                    </Grid>
                                </Grid>
                            }
                            {(props.dataComplemento.sectorCOFEPRIS==1 || props.dataComplemento.sectorCOFEPRIS==3) &&
                                <Grid item sm={4}>
                                    <TextField
                                        variant="outlined"
                                        type="text"
                                        id={"c1c3i"}
                                        fullWidth
                                        size="small"
                                        inputProps={{maxLength:15}}
                                        value={props.dataComplemento.regSanitario_folioAut}
                                        label={"Registro Sanitario/Folio de Autorización"}
                                        onChange={(e)=>{props.setDataComplemento(dataComplemento =>{
                                            return {
                                                ...props.dataComplemento,
                                                regSanitario_folioAut:e.target.value,
                                            }
                                        });}}
                                    >
                                    </TextField>
                                </Grid>
                            }
                            {props.dataComplemento.sectorCOFEPRIS==4 &&
                                <Grid item sm={4}>
                                    <TextField
                                        variant="outlined"
                                        type="text"
                                        id={"c4j"}
                                        fullWidth
                                        size="small"
                                        inputProps={{maxLength:15}}
                                        value={props.dataComplemento.numCAS}
                                        label={"Número CAS"}
                                        onChange={(e)=>{props.setDataComplemento(dataComplemento =>{
                                            return {
                                                ...props.dataComplemento,
                                                numCAS:e.target.value,
                                            }
                                        });}}
                                    >
                                    </TextField>
                                </Grid>
                            }
                            {props.dataComplemento.sectorCOFEPRIS==5 &&
                                <Grid item sm={4}>
                                    <TextField
                                        variant="outlined"
                                        type="text"
                                        id={"c5k"}
                                        fullWidth
                                        size="small"
                                        inputProps={{maxLength:60}}
                                        label={"Núm. Registro CICLOPLAFEST"}
                                        value={props.dataComplemento.numRegSanPlagCOFEPRIS}
                                        onChange={(e)=>{props.setDataComplemento(dataComplemento =>{
                                            return {
                                                ...props.dataComplemento,
                                                numRegSanPlagCOFEPRIS:e.target.value,
                                            }
                                        });}}
                                    >
                                    </TextField>
                                </Grid>
                            }
                            {props.dataComplemento.sectorCOFEPRIS==5 &&
                                <Grid item sm={12} >
                                    <TextField
                                        variant="outlined"
                                        type="text"
                                        id={"c5l"}
                                        fullWidth
                                        size="small"
                                        multiline
                                        style={{overflowY:"auto"}}
                                        label={"Datos del Fabricante"}
                                        value={props.dataComplemento.datosFabricante}
                                        onChange={(e)=>{props.setDataComplemento(dataComplemento =>{
                                            return {
                                                ...props.dataComplemento,
                                                datosFabricante:e.target.value,
                                            }
                                        });}}
                                    >
                                    </TextField>
                                </Grid>
                            }
                            {props.dataComplemento.sectorCOFEPRIS==5 &&
                                <Grid item sm={12} >
                                    <TextField
                                        variant="outlined"
                                        type="text"
                                        id={"c5m"}
                                        fullWidth
                                        size="small"
                                        multiline
                                        style={{overflowY:"auto"}}
                                        label={"Datos del Formulador"}
                                        value={props.dataComplemento.datosFormulador}
                                        onChange={(e)=>{props.setDataComplemento(dataComplemento =>{
                                            return {
                                                ...props.dataComplemento,
                                                datosFormulador:e.target.value,
                                            }
                                        });}}
                                    >
                                    </TextField>
                                </Grid>
                            }
                            {props.dataComplemento.sectorCOFEPRIS==5 &&
                                <Grid item sm={12} >
                                    <TextField
                                        variant="outlined"
                                        type="text"
                                        id={"c5n"}
                                        fullWidth
                                        size="small"
                                        multiline
                                        style={{overflowY:"auto"}}
                                        label={"Datos del Maquilador"}
                                        value={props.dataComplemento.datosMaquilador}
                                        onChange={(e)=>{props.setDataComplemento(dataComplemento =>{
                                            return {
                                                ...props.dataComplemento,
                                                datosMaquilador:e.target.value,
                                            }
                                        });}}
                                    >
                                    </TextField>
                                </Grid>
                            }
                            {props.dataComplemento.sectorCOFEPRIS==5 &&
                                <Grid item sm={12} >
                                    <TextField
                                        variant="outlined"
                                        type="text"
                                        id={"c5o"}
                                        fullWidth
                                        size="small"
                                        multiline
                                        style={{overflowY:"auto"}}
                                        value={props.dataComplemento.usoAutorizado}
                                        label={"Uso Autorizado"}
                                        onChange={(e)=>{props.setDataComplemento(dataComplemento =>{
                                            return {
                                                ...props.dataComplemento,
                                                usoAutorizado:e.target.value,
                                            }
                                        });}}
                                    >
                                    </TextField>
                                </Grid>
                            }
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
                         //type={"submit"}
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