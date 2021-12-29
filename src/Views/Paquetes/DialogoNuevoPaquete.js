import React, {useEffect, useState} from 'react';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import {Checkbox, FormControl, FormControlLabel, Grid, InputLabel, Radio, RadioGroup, Select} from "@material-ui/core";
import Autocomplete from "@material-ui/lab/Autocomplete";
import InputAdornment from "@material-ui/core/InputAdornment";
import IconButton from "@material-ui/core/IconButton";
import ArrowForwardIcon from "@material-ui/icons/ArrowForward";
import {obtenerImpuestosByConceptosFacturacion} from "../../Util/Contexts/ConceptosFacturacionContext";
import {obtenerImpuestos} from "../../Util/Contexts/ImpuestosContext";

export default function DialogoNuevoPaquete(props) {
    const [open, setOpen] = React.useState(false);
    const [state, setState] = useState({
        impuestos: [],
        ivaTraslada: [],
        ivaRetiene: [],
        tiposCalculo: [],
        columns: [],
        aplicaDescuento: false,
        aplicarDescuentoA: 'Concepto',
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
    }, [props.concepto])

    const handleClickOpen = () => {
        resetPaquete()
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };

    const handleAceptar = () => {
        if (concepto.concepto !== null){
            handleClose()
            console.log(concepto)
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
        obtenerImpuestosByConceptosFacturacion(newValue.m_nIdConceptosFacturacion).then(respuesta => {
            newValue.arClsDetalle = respuesta.data
            if (respuesta.data.length > 0){
                setConcepto(concepto =>{
                    return {
                        ...concepto,
                        concepto: newValue,
                        idConcepto: newValue.m_nIdConceptosFacturacion,
                        importe: newValue.m_cImporte || 0,
                        nombreConcepto: newValue.m_sConcepto,
                        importeRet: newValue.m_cImporteRetiene || 0,
                        retiene: respuesta.data.find(i => i.m_bPredeterminado && !i.m_bTrasladado).m_nIdImpuesto,
                        traslada: respuesta.data.find(i => i.m_bPredeterminado && i.m_bTrasladado).m_nIdImpuesto,
                        importeIVA: newValue.m_cImporteIva || 0
                    }
                })
            }
        });
    }

    const handleChangePaquetev2 = (event) => {
        event.preventDefault()
        if (event.target.name === "importe") {
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

    const calcularDescuento = (event) => {
        if (state.aplicarDescuentoA === "Concepto"){
            setConcepto(concepto=>{
                return {
                    ...concepto,
                    importeInicial: parseFloat(concepto.importe).toFixed(2)
                }
            })
            calcularImpuestos(concepto.traslada, concepto.retiene, concepto.importe - (concepto.importe * (concepto.descuento/100)))
        }else if (state.aplicarDescuentoA === "Total"){
            /*dataPaquetes.forEach(item => {
                item.importe = item.importe * (concepto.descuento/100)
            })
            onChangeList(dataPaquetes)*/
        }

    }

    return (
        <div>
            <Button variant="contained" color="primary" onClick={handleClickOpen} style={{float: 'right'}}>
                Agregar paquete
            </Button>
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
                                        options={props.conceptosBase}
                                        getOptionLabel={(option) => option.m_sConcepto}
                                        variant="outlined"
                                        fullWidth
                                        required
                                        style={{transform: "translate(14px, 10px) scale(1) !important"}}
                                        renderInput={(params) => (
                                            <div>
                                                <TextField
                                                    {...params}
                                                    variant="outlined"
                                                    label="Concepto"
                                                    className="form-control"
                                                    margin="dense"
                                                    fullWidth
                                                    required
                                                />
                                            </div>
                                        )}
                                    />
                                </div>
                            </Grid>
                            <Grid item xs={6}>
                                <div className="input">
                                    <TextField variant="outlined" margin="dense"
                                               onChange={handleChangePaquetev2}
                                               className="form-control"
                                               type="number"
                                               label="Importe"
                                               style={{textAlign: "right"}}
                                               step="1"
                                               min="0"
                                               value={concepto.importe}
                                               name="importe"
                                    />
                                </div>
                            </Grid>
                            <Grid item xs={6}>
                                <label className="input select" style={{width: "100%"}}>
                                    <FormControl fullWidth variant="outlined" margin="dense">
                                        <InputLabel id="trasladaLabel">Traslada</InputLabel>
                                        <Select
                                            labelId="trasladaLabel"
                                            label="Traslada"
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
                                <div className="input">
                                    <TextField variant="outlined" margin="dense"
                                               onChange={handleChangePaquetev2}
                                               className="form-control"
                                               type="number"
                                               style={{textAlign: "right"}}
                                               disabled
                                               label="Importe IVA"
                                               step="1"
                                               min="0"
                                               value={concepto.importeIVA}
                                               name="importeIVA"
                                    />
                                </div>
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
                                <div className="input">
                                    <TextField variant="outlined" margin="dense"
                                               onChange={handleChangePaquetev2}
                                               className="form-control"
                                               type="number"
                                               style={{textAlign: "right"}}
                                               disabled
                                               label="Importe Ret"
                                               step="1"
                                               min="0"
                                               value={concepto.importeRet}
                                               name="importeRet"
                                    />
                                </div>
                            </Grid>
                            <Grid item xs={12}>
                                <TextField variant="outlined" margin="dense"
                                           onChange={handleChangePaquetev2}
                                           className="form-control"
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
