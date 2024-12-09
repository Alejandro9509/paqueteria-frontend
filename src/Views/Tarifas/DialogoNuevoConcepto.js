import React, {useEffect, useState} from 'react';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import {Checkbox, FormControl, FormControlLabel, Grid, InputLabel, Radio, RadioGroup, Select} from "@mui/material";
import Autocomplete from '@mui/material/Autocomplete';
import InputAdornment from "@mui/material/InputAdornment";
import IconButton from "@mui/material/IconButton";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import {obtenerImpuestosByConceptosFacturacion} from "../../Util/Contexts/ConceptosFacturacionContext";
import {obtenerImpuestos} from "../../Util/Contexts/ImpuestosContext";
import {validarDerecho} from "../../Util/Util";

export default function DialogoNuevoConcepto(props) {
    const [open, setOpen] = React.useState(false);
    const [state, setState] = useState({
        impuestos: [],
        ivaTraslada: [],
        ivaRetiene: [],
        tiposCalculo: [],
        columns: [],
        aplicaDescuento: false,
        aplicarDescuentoA: 'Concepto',
        options: [],
    })
    const [concepto, setConcepto] = useState({
        id:Math.floor(Math.random() * 10000),
        concepto: null,
        idConcepto: 0,
        importe: 0,
        importeInicial: 0,
        nombreConcepto: "",
        importeRet: "0",
        retiene: 0,
        traslada: 0,
        importeIVA: "0",
        rangoMinimo: 0,
        rangoMaximo: 0,
        tipoCalculo: 0,
        tipoMedida: 0,
        descuento: 0,
        agregadoDesde: props.keys
    })
    const [errores, setErrores] = useState({
        errorImporte:false,
        errorConcepto:false,
        errorTexto:'',
        errorTextoImporte:''
    })
    const resetPaquete = () =>{
        setConcepto(concepto => {
            return {
                ...concepto,
                id:Math.floor(Math.random() * 10000),
                concepto: null,
                idConcepto: 0,
                importe: 0,
                importeInicial: 0,
                nombreConcepto: "",
                importeRet: "0",
                retiene: 0,
                traslada: 0,
                importeIVA: "0",
                rangoMinimo: 0,
                rangoMaximo: 0,
                tipoCalculo: 0,
                tipoMedida: 0,
                descuento: 0,
                agregadoDesde: props.keys
            }
        })
        props.resetPaquete()
    }

    useEffect(() => {
        if (props.concepto.idConcepto !== 0){
            setConcepto(props.concepto)
            setOpen(true);
        }
        let filtered = props.conceptosBase.filter(function (item){
                return props.dataPaquetes.every((f) => {
                    return f.nombreConcepto !== item.m_sConcepto;
                })
            }
        );
        setState(state =>{
            return { ...state, options: filtered }
        })
        // console.log('Todos los conceptos: ' + props.conceptosBase.length);
        // console.log('Todos los conceptos filtrados: ' + filtered.length);
    }, [props.concepto])

    const handleClickOpen = () => {
        resetPaquete()
        setOpen(true);
    };

    const handleClose = () => {
        setErrores(errores=>{
            return{
                ...errores,
            errorImporte:false,
            errorConcepto:false
            }
          
        })

        setOpen(false);
    };

    const handleAceptar = (e) => {
        e.preventDefault()
        
        if(concepto.concepto == null){
        setErrores(errores=>{
            return{
                ...errores,
            errorConcepto:true,
            errorTexto:'Falta elegir concepto' 
            }
          
        })
       }else{
        setErrores(errores=>{
            return {
                ...errores,
                errorConcepto:false
            }
            
        })
        
       }
       
       if(parseFloat(concepto.importe)<0){
        setErrores(errores=>{
            return{
                ...errores,
            errorImporte:true,
            errorTextoImporte:'El importe debe ser igual o mayor a 0'
            }
           
        })
       }else{
        setErrores(errores=>{
            return{
                ...errores,
                errorImporte:false
            }
          
        })
        
       }
      
        if (concepto.concepto !== null && concepto.importe>=0){
            handleClose()
            props.agregarConcepto(concepto)
            resetPaquete()
        }

    }

    const handleCancelar = () => {
        resetPaquete()
        handleClose()
    }



    useEffect(value => {
        if (state.impuestos.length === 0 ){
            getAllImpuestos()
        }
        /*if (state.tiposCalculo.length === 0 ){
            getAlTiposCalculo()
        }*/
    }, [])

    const getAllImpuestos = () => {
        obtenerImpuestos().then(respuesta => {
            setState(state =>{
                return { ...state, impuestos: respuesta.data }
            })
        });
    };

    /**Al seleccionar un concepto del listado del autocomplete*/
    const handleConceptoClick = (event, newValue) => {
        if (newValue) {
            setErrores(errores => {
                return {...errores, errorConcepto: false}
            })
        }
        obtenerImpuestosByConceptosFacturacion(newValue.m_nIdConceptosFacturacion).then(respuesta => {
            newValue.arClsDetalle = respuesta.data
            let retiene = respuesta.data.find(i => i.m_bPredeterminado && !i.m_bTrasladado)?.m_nIdImpuesto || 0
            let traslada = respuesta.data.find(i => i.m_bPredeterminado && i.m_bTrasladado)?.m_nIdImpuesto || 0
            setConcepto(concepto =>{
                return {
                    ...concepto,
                    concepto: newValue,
                    idConcepto: newValue.m_nIdConceptosFacturacion,
                    importe: newValue.m_cImporte || 0,
                    nombreConcepto: newValue.m_sConcepto,
                    importeRet: newValue.m_cImporteRetiene || 0,
                    retiene: retiene,
                    traslada: traslada,
                    importeIVA: newValue.m_cImporteIva || 0
                }
            })
        });
    }

    const handleChangePaquetev2 = (event) => {
        event.preventDefault()
        if (event.target.name === "importe") {
            if(parseFloat(event.target.value)<0){
                setErrores(errores=>{
                    return{ 
                        ...errores,
                        errorImporte:true,
                        errorTextoImporte:"El importe debe ser mayor o igual a 0"

                    }
                 })
                 
        }else{
            setErrores(errores=>{
                return{ 
                    ...errores,
                    errorImporte:false}
             })
        }
            calcularImpuestos(concepto.traslada, concepto.retiene, event.target.value)
        } else if (event.target.name === "traslada") {
            calcularImpuestos(event.target.value, concepto.retiene, concepto.importe)
        } else if (event.target.name === "retiene") {
            calcularImpuestos(concepto.traslada, event.target.value, concepto.importe)
        } else if(event.target.name === "aplicaDescuento") {
            setState(state => {
                return {
                    ...state,
                    [event.target.name]: event.target.checked
                }
            })
        } else if(event.target.name === "aplicarDescuentoA") {
            setState(state => {
                return {
                    ...state,
                    [event.target.name]: event.target.value
                }
            })
        } else {
            setConcepto(concepto => {
                return {
                    ...concepto,
                    [event.target.name]: event.target.value
                }
            })
        }
    };

    const calcularImpuestos = (traslada, retiene, importe) => {
        setConcepto(concepto => {
            return { ...concepto,retiene: retiene, importe: importe, traslada: traslada }
        })
        if (state.impuestos.find(i => i.m_nIdImpuesto === parseInt(traslada)) != null) {
            const impuesto = state.impuestos.find(i => i.m_nIdImpuesto === parseInt(traslada))
            setConcepto(concepto=>{
                return {
                    ...concepto,
                    importeIVA: parseFloat((parseFloat(impuesto.m_nPorcentaje) / 100) * parseFloat(importe)).toFixed(2),
                    retiene: retiene,
                    importe: importe,
                    traslada: traslada
                }
            })
        }
        if (state.impuestos.find(i => i.m_nIdImpuesto === parseInt(retiene)) != null) {
            const impuesto = state.impuestos.find(i => i.m_nIdImpuesto === parseInt(retiene))
            setConcepto(concepto=>{
                return {
                    ...concepto,
                    importeRet: parseFloat((parseFloat(impuesto.m_nPorcentaje) / 100) * parseFloat(importe)).toFixed(2),
                    retiene: retiene,
                    importe: importe,
                    traslada: traslada
                }
            })
        }
    }

    return (
        <div>
            {
                !props.disabled &&
                <Button disabled={props.esRec?!validarDerecho(9101505):!validarDerecho(9101500)} variant="contained" color="primary" onClick={handleClickOpen} style={{float: 'right'}}>
                    Agregar concepto
                </Button>
            }

            <Dialog open={open} onClose={handleClose} aria-labelledby="form-dialog-title"
                    fullWidth
                    maxWidth={'sm'}>
                <DialogTitle id="form-dialog-title">Agregar concepto de facturación</DialogTitle>
                <form>
                    <DialogContent>

                        <Grid container spacing={1}>
                            <Grid item xs={6}>
                                <div className="input">
                                    <Autocomplete
                                        value={concepto.concepto}
                                        freeSolo
                                        onChange={(event, newValue) => handleConceptoClick(event, newValue)}
                                        id="concepto"
                                        disableClearable
                                        forcePopupIcon={false}
                                        options={state.options}
                                        getOptionLabel={(option) => option.m_sConcepto}
                                        variant="outlined"
                                        fullWidth
                                        required
                                        renderInput={(params) => (
                                            <div>
                                                <TextField
                                                    {...params}
                                                    variant="outlined"
                                                    size="small"
                                                    className="form-control"
                                                    label="Concepto"
                                                    fullWidth
                                                    required
                                                    helperText={errores.errorConcepto?errores.errorTexto:''}
                                                    error={errores.errorConcepto}
                                                />
                                            </div>
                                        )}
                                    />
                                </div>
                            </Grid>
                            <Grid item xs={6}>
                                    <TextField variant="outlined"
                                               onChange={handleChangePaquetev2}
                                               type="number"
                                               label="Importe"
                                               size="small"
                                               style={{textAlign: "right"}}
                                               step="1"
                                               min="0"
                                               value={concepto.importe}
                                               name="importe"
                                               helperText={errores.errorImporte?errores.errorTextoImporte:''}
                                               error={errores.errorImporte}
                                    />
                            </Grid>
                            <Grid item xs={6}>
                                <label className="input select" style={{width: "100%"}}>
                                    <FormControl fullWidth variant="outlined" >
                                        <InputLabel id="trasladaLabel">Traslada</InputLabel>
                                        <Select
                                            labelId="trasladaLabel"
                                            label="Traslada"
                                            size="small"
                                            className="form-control"
                                            value={concepto.traslada}
                                            onChange={handleChangePaquetev2}
                                            name="traslada"
                                        >
                                            <option key={0} value={0}>Selecciona</option>
                                            {state.impuestos.filter(i => i.m_nTIpoCalculo === 1).map((impuesto) => (
                                                <option
                                                    key={impuesto.m_nIdImpuesto}
                                                    value={impuesto.m_nIdImpuesto}
                                                >
                                                    {impuesto.m_sImpuesto}
                                                </option>
                                            ))}
                                        </Select>
                                    </FormControl>
                                </label>
                            </Grid>
                            <Grid item xs={6}>
                                    <TextField variant="outlined"
                                               onChange={handleChangePaquetev2}
                                               type="number"
                                               style={{textAlign: "right"}}
                                               disabled
                                               size="small"
                                               label="Importe IVA"
                                               step="1"
                                               min="0"
                                               value={concepto.importeIVA}
                                               name="importeIVA"
                                    />
                            </Grid>
                            <Grid item xs={6}>
                                <label className="input select" style={{width: "100%"}}>
                                    <FormControl fullWidth variant="outlined" margin="dense">
                                        <InputLabel id="retieneLabel">Retiene</InputLabel>
                                        <Select
                                            labelId="retieneLabel"
                                            label="Retiene"
                                            className="form-control"
                                            onChange={handleChangePaquetev2}
                                            name="retiene"
                                            size="small"
                                            value={concepto.retiene}
                                        >
                                            <option key={0} value={0}>Selecciona</option>
                                            {state.impuestos.filter(i => i.m_nTIpoCalculo === 2).map((impuesto) => (
                                                <option
                                                    key={impuesto.m_nIdImpuesto}
                                                    value={impuesto.m_nIdImpuesto}
                                                >
                                                    {impuesto.m_sImpuesto}
                                                </option>
                                            ))}
                                        </Select>
                                    </FormControl>
                                </label>
                            </Grid>
                            <Grid item xs={6}>
                                    <TextField variant="outlined"
                                               onChange={handleChangePaquetev2}
                                               type="number"
                                               style={{textAlign: "right"}}
                                               disabled
                                               label="Importe Ret"
                                               step="1"
                                               min="0"
                                               value={concepto.importeRet}
                                               name="importeRet"
                                    />
                            </Grid>
                            <Grid item xs={12}>
                                <TextField variant="outlined"
                                           onChange={handleChangePaquetev2}
                                           type="number"
                                           style={{textAlign: "right"}}
                                           label="Descuento ($)"
                                           step="1"
                                           min="0"
                                           value={concepto.descuento}
                                           name="descuento"
                                />
                            </Grid>


                        </Grid>

                    </DialogContent>
                    <DialogActions>
                        <Button  onClick={handleCancelar} color="primary">
                            Cancelar
                        </Button>
                        <Button type={"submit"} onClick={handleAceptar} color="primary">
                            Aceptar
                        </Button>
                    </DialogActions>
                </form>
            </Dialog>
        </div>
    );
}
