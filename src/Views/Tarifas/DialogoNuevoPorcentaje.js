import React, {useState} from "react";
import {Button, Dialog, DialogActions, DialogContent, MenuItem, TextField,Grid} from "@mui/material";

export default function DialogoNuevoPorcentaje(props) {
    /** Props
     * handleShowDialog() - Controla si se abre o cierra el dialogo.
     * handleOnConfirmData() - Retorna al padre los items seleccionados.
     * openDialog Boolean - Controla si se abre o cierra el dialogo
     * rango object - rango a modificar
     * tiposCalculoListado - Listado de tipos de calculo xd
     * unidadesMedidaListado - Listado de unidades de medida xd
     * */
    const UNIDADES_MEDIDA = {KILOGRAMOS: 21, TONELADAS: 48, PIEZAS: 38, PORCIENTO: 55}
    const [state, setState] = useState({
        height: window.innerHeight,
    })

    const [rango, setRango] = useState({
        id: props.rango?.id || Math.floor(Math.random() * 10000),
        idConcepto: props.rango?.idConcepto || null,
        concepto: props.rango?.concepto || '',
        importe: props.rango?.importe || 0,
        minimo: props.rango?.minimo || 0,
        maximo: props.rango?.maximo || 0,
        idTipoCalculo: props.rango?.idTipoCalculo || null,
        idUnidadMedida: props.rango?.idUnidadMedida || null,
        tipoCalculo: props.rango?.tipoCalculo || '',
        unidadMedida: props.rango?.unidadMedida || '',
        porcentaje: props.rango?.porcentaje || 0,
    })

    const [errores, setErrores] = useState({
        idConcepto: false,
        importe: false,
        minimo: false,
        maximo: false,
        idTipoCalculo: false,
        idUnidadMedida: false,
        conceptoRepetido: false,
        porcentaje: false,
        descripcionError: null
    })

    const handleShowDialog = () => {
        props.handleShowDialog(null, false)
    }

    const validarData = () => {
        setErrores(errores => {
            return {
                ...errores,
                idConcepto: false,
                importe: false,
                minimo: false,
                maximo: false,
                idTipoCalculo: false,
                idUnidadMedida: false,
                porcentaje: false,
                descripcionError: null
            }
        })
        let valid = true
        if (!rango.idUnidadMedida){
            setErrores(errores => {
                return {
                    ...errores,
                    idUnidadMedida: true,
                    descripcionError: "La unidad de medida es un campo requerido"
                }
            })
            valid = false
        }
        if ((parseFloat(rango.porcentaje) <= 0)) {
            setErrores(errores => {
                return {
                    ...errores,
                    porcentaje: true,
                    descripcionError: "El valor porcentaje debe ser un número mayor de 0"
                }
            })
            valid = false
        }
        if ((parseFloat(rango.porcentaje) > 100)) {
            setErrores(errores => {
                return {
                    ...errores,
                    porcentaje: true,
                    descripcionError: "El valor porcentaje no puede ser superior a 100"
                }
            })
            valid = false
        }
        return valid
    }

    const handleConfirmSelection = () => {
        if (validarData()){
            props.handleOnConfirmData(rango)
        }
    }

    const handleOnDataChange = (event) => {
        if (event.target.name === 'idUnidadMedida'){
            setRango({
                ...rango,
                [event.target.name]: event.target.value,
                unidadMedida: props.unidadesMedidaListado.find(i => i.IdUnidadMedida == event.target.value).UnidadMedida
            })
        }else if (event.target.name === 'porcentaje'){
            setRango({
                ...rango,
                [event.target.name]: parseFloat(event.target.value),
            })
        }else{
            setRango({
                ...rango,
                [event.target.name]: event.target.value
            })
        }
    }

    return(
        <Dialog
            fullWidth={true}
            maxWidth={'sm'}
            open={props.openDialog}
            onClose={handleShowDialog}
            aria-labelledby="max-width-dialog-title"
        >
            <DialogContent>
                <Grid container spacing={1}>
                    <Grid item xs={12}>
                        <TextField
                            id="idUnidadMedida"
                            select
                            label="Unidad de medida"
                            value={rango.idUnidadMedida}
                            onChange={handleOnDataChange}
                            name="idUnidadMedida"
                            variant="outlined"
                            margin={"dense"}
                            error={errores.idUnidadMedida}
                            helperText={errores.idUnidadMedida ? errores.descripcionError : null}
                        >
                            {props.unidadesMedidaListado.map((option) => (
                                <MenuItem key={option.IdUnidadMedida} value={option.IdUnidadMedida}>
                                    {option.UnidadMedida}
                                </MenuItem>
                            ))}
                        </TextField>
                    </Grid>
                    <Grid item xs={12}>
                        <TextField variant="outlined" margin="dense"
                                   onChange={handleOnDataChange}
                                   type="number"
                                   label="Porcentaje"
                                   style={{textAlign: "right"}}
                                   min="0"
                                   max="100"
                                   value={rango.porcentaje}
                                   name="porcentaje"
                                   error={errores.porcentaje}
                                   helperText={errores.porcentaje ? errores.descripcionError : null}
                        />
                    </Grid>
                </Grid>
            </DialogContent>
            <DialogActions>
                <Button onClick={handleShowDialog} color="primary">
                    Cancelar
                </Button>
                <Button onClick={handleConfirmSelection} color="primary" autoFocus>
                    Aceptar
                </Button>
            </DialogActions>
        </Dialog>
    )
}