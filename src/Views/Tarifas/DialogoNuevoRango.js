import React, {useState} from "react";
import {Button, Dialog, DialogActions, DialogContent, MenuItem, TextField} from "@mui/material";
import Grid from "@mui/material/Grid";
import Noty from "noty";

function showSuccess(mensaje) {
    new Noty({
        type: "information",
        layout: "topCenter",
        text: mensaje,
        timeout: "3000"
    }).show()
}

export default function DialogoNuevoRango(props) {
    /** Props
     * handleShowDialog() - Controla si se abre o cierra el dialogo.
     * handleOnConfirmData() - Retorna al padre los items seleccionados.
     * openDialog Boolean - Controla si se abre o cierra el dialogo
     * rango object - rango a modificar
     * tiposCalculoListado - Listado de tipos de calculo xd
     * unidadesMedidaListado - Listado de unidades de medida xd
     * */
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
    })

    const [errores, setErrores] = useState({
        idConcepto: false,
        importe: false,
        minimo: false,
        maximo: false,
        idTipoCalculo: false,
        idUnidadMedida: false,
        conceptoRepetido: false,
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
                descripcionError: null
            }
        })
        let valid = true
        if (props.seccionPadre === 'MANIOBRAS'){
            if (!rango.idConcepto){
                setErrores(errores => {
                    return {
                        ...errores,
                        idConcepto: true,
                        descripcionError: "El concepto es un campo requerido"
                    }
                })
                valid = false
            }
        }
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
        if (!(parseFloat(rango.minimo) > 0) || parseFloat(rango.minimo) > parseFloat(rango.maximo)){
            setErrores(errores=>{
                return {
                    ...errores,
                    minimo: true,
                    descripcionError: "El valor mínimo debe ser mayor a cero y menor al maximo"
                }
            })
            valid = false
        }
        if (!(parseFloat(rango.maximo) > 0 || parseFloat(rango.minimo) > parseFloat(rango.maximo))){
            setErrores(errores=>{
                return {
                    ...errores,
                    maximo: true,
                    descripcionError: "El valor maximo debe ser mayor a cero y mayor al minimo"
                }
            })
            valid = false
        }
        if ((parseFloat(rango.importe) < 0)){
            setErrores(errores=>{
                return {
                    ...errores,
                    importe: true,
                    descripcionError: "El importe debe ser igual o mayor a cero"
                }
            })
            valid = false
        }
        if (!rango.idTipoCalculo){
            setErrores(errores => {
                return {
                    ...errores,
                    idTipoCalculo: true,
                    descripcionError: "El tipo de cálculo es un campo requerido"
                }
            })
            valid = false
        }
        if (props.seccionPadre === 'MANIOBRAS'){
            props.rows.forEach(i => {
                if (i.id != rango.id
                    && i.idConcepto == rango.idConcepto
                    && i.minimo == rango.minimo
                    && i.maximo == rango.maximo
                ){
                    valid = false
                    showSuccess("Ese rango ya existe.")
                }
            })
            props.rows.forEach(i => {
                if (i.id != rango.id && i.idConcepto == rango.idConcepto){
                    if(isRangoOcupado(i, rango)){
                        valid = false
                        showSuccess("El concepto tiene un rango ya ocupado.")

                    }
                }

            })
        }else{
            props.rows.forEach(i => {
                if (i.id != rango.id
                    && i.minimo == rango.minimo
                    && i.maximo == rango.maximo
                ){
                    valid = false
                    showSuccess("Ese rango ya existe.")
                }
            })
            props.rows.forEach(i => {
                if (i.id != rango.id){
                    if(isRangoOcupado(i, rango)){
                        valid = false
                        showSuccess("El concepto tiene un rango ya ocupado.")

                    }
                }
            })
        }
        return valid
    }

    const isRangoOcupado = (conceptoUno, conceptoDos) => {
        /**conceptoUno es un concepto del listado. conceptoDos es el concepto nuevo*/

        let ocupado = false

        conceptoUno.minimo = parseFloat(conceptoUno.minimo)
        conceptoUno.maximo = parseFloat(conceptoUno.maximo)
        conceptoDos.minimo = parseFloat(conceptoDos.minimo)
        conceptoDos.maximo = parseFloat(conceptoDos.maximo)
        if (conceptoDos.unidadMedida === "KILOGRAMOS"){
            if (conceptoUno.unidadMedida === "TONELADAS"){
                conceptoUno.minimo = conceptoUno.minimo*1000
                conceptoUno.maximo = conceptoUno.maximo*1000
            }
        }
        if (conceptoDos.unidadMedida === "TONELADAS"){
            if (conceptoUno.unidadMedida === "KILOGRAMOS"){
                conceptoUno.minimo = conceptoUno.minimo/1000
                conceptoUno.maximo = conceptoUno.maximo/1000
            }
        }
        if (conceptoDos.minimo >= conceptoUno.minimo && conceptoDos.minimo <= conceptoUno.maximo){
            ocupado = true
        }
        if (conceptoDos.maximo >= conceptoUno.minimo && conceptoDos.maximo <= conceptoUno.maximo){
            ocupado = true
        }
        if (conceptoUno.minimo >= conceptoDos.minimo && conceptoUno.minimo <= conceptoDos.maximo){
            ocupado = true
        }
        if (conceptoUno.maximo >= conceptoDos.minimo && conceptoUno.maximo <= conceptoDos.maximo){
            ocupado = true
        }
        return ocupado
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
        }else if (event.target.name === 'idTipoCalculo'){
            setRango({
                ...rango,
                [event.target.name]: event.target.value,
                tipoCalculo: props.tiposCalculoListado.find(i => i.m_nIdTarifaTipoCalculo == event.target.value).m_sTarifaTipoCalculo
            })
        }else if (event.target.name === 'idConcepto'){
            setRango({
                ...rango,
                [event.target.name]: event.target.value,
                concepto: props.conceptosListado.find(i => i.m_nIdConceptosFacturacion == event.target.value).m_sConcepto
            })
        }else if (event.target.name === 'minimo' || event.target.name === 'maximo'){
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
                    {
                        props.seccionPadre === 'MANIOBRAS' &&
                        <Grid item xs={12}>
                            <TextField
                                id="idConcepto"
                                select
                                label="Maniobra"
                                value={rango.idConcepto}
                                onChange={handleOnDataChange}
                                name="idConcepto"
                                variant="outlined"
                                size="small"
                                error={errores.idConcepto}
                                helperText={errores.idConcepto ? errores.descripcionError : null}
                            >
                                {props.conceptosListado.map((option) => (
                                    <MenuItem key={option.m_nIdConceptosFacturacion}
                                              value={option.m_nIdConceptosFacturacion}>
                                        {option.m_sConcepto}
                                    </MenuItem>
                                ))}
                            </TextField>
                        </Grid>
                    }
                    <Grid item xs={12}>
                        <TextField
                            id="idUnidadMedida"
                            select
                            label="Unidad de medida"
                            value={rango.idUnidadMedida}
                            onChange={handleOnDataChange}
                            name="idUnidadMedida"
                            variant="outlined"
                            size="small"
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
                        <TextField variant="outlined" size="small"
                                   onChange={handleOnDataChange}
                                   type="number"
                                   label="Mínimo"
                                   style={{textAlign: "right"}}
                                   step="1"
                                   min="0"
                                   value={rango.minimo}
                                   name="minimo"
                                   error={errores.minimo}
                                   helperText={errores.minimo ? errores.descripcionError : null}

                        />
                    </Grid>
                    <Grid item xs={12}>
                        <TextField variant="outlined" size="small"
                                   onChange={handleOnDataChange}
                                   type="number"
                                   label="Máximo"
                                   style={{textAlign: "right"}}
                                   step="1"
                                   min="0"
                                   value={rango.maximo}
                                   name="maximo"
                                   error={errores.maximo}
                                   helperText={errores.maximo ? errores.descripcionError : null}
                        />
                    </Grid>
                    <Grid item xs={12}>
                        <TextField variant="outlined" size="small"
                                   onChange={handleOnDataChange}
                                   type="number"
                                   label="Importe"
                                   style={{textAlign: "right"}}
                                   step="1"
                                   min="0"
                                   value={rango.importe}
                                   name="importe"
                                   error={errores.importe}
                                   helperText={errores.importe ? errores.descripcionError : null}
                        />
                    </Grid>
                    <Grid item xs={12}>
                        <TextField
                            id="idTipoCalculo"
                            select
                            label="Cálculo"
                            value={rango.idTipoCalculo}
                            onChange={handleOnDataChange}
                            name="idTipoCalculo"
                            variant="outlined"
                            size="small"
                            error={errores.idTipoCalculo}
                            helperText={errores.idTipoCalculo ? errores.descripcionError : null}
                        >
                            {props.tiposCalculoListado.map((option) => (
                                <MenuItem key={option.m_nIdTarifaTipoCalculo} value={option.m_nIdTarifaTipoCalculo}>
                                    {option.m_sTarifaTipoCalculo}
                                </MenuItem>
                            ))}
                        </TextField>
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