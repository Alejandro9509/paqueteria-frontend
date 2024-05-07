import React, {useState} from "react";
import {Button, Dialog, DialogActions, DialogContent, DialogTitle, TextField} from "@mui/material";

export default function DialogTextView(props) {
    /** Props
     * handleShowDialog() - Controla si se abre o cierra el dialogo.
     * handleOnConfirmSelection() - Retorna al padre los items seleccionados.
     * openDialog Boolean - Controla si se abre o cierra el dialogo
     * selection array - Lista de item seleccionados del datagrid
     * */
    const [state, setState] = useState({
        idGrupo: props.selection?.idGrupo || Math.floor(Math.random() * 10000),
        nombre: props.selection?.nombre ||  '',
    })

    const [errores, setErrores] = useState({
        nombre: null,
        descripcionError: null
    })

    const handleShowDialog = () => {
        props.handleShowDialog(false)
    }

    const validarData = () => {
        setErrores(errores => {
            return {
                ...errores,
                nombre: null,
                descripcionError: null
            }
        })
        let valid = true
        if (state.nombre.length === 0){
            valid = false
            setErrores(errores => {
                return {
                        ...errores,
                        nombre: true,
                        descripcionError: 'Campo obligatorio'
                }
            })
        }
        return valid
    }
    const handleConfirmSelection = (event) => {
        if (validarData()){
            if (event.code === 'Enter'){
                event.preventDefault()
                props.handleOnConfirmSelection(state)
            }else{
                props.handleOnConfirmSelection(state)
            }
        }

    }
    const handleOnDataChange = (event) => {
        setState({
            ...state,
            [event.target.name]: event.target.value
        })
    }

    return(
        <Dialog
            fullWidth={true}
            maxWidth={'sm'}
            open={props.openDialog}
            onClose={handleShowDialog}
            aria-labelledby="max-width-dialog-title"
        >
            <form onKeyDown={e => {
                if (e.key === 'Enter') {
                    handleConfirmSelection(e)
                }}}>
                <DialogTitle>
                    Agregar nuevo grupo
                </DialogTitle>
                <DialogContent>
                    <TextField variant="outlined" margin="dense"
                               onChange={handleOnDataChange}
                               fullWidth
                               label="Nombre del grupo"
                               value={state.nombre}
                               name="nombre"
                               required
                               inputRef={input => input && input.focus()}
                               error={errores.nombre}
                               helperText={errores.nombre ? errores.descripcionError : null}
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleShowDialog} color="primary">
                        Cancelar
                    </Button>
                    <Button type={"submit"} onClick={handleConfirmSelection} color="primary" autoFocus>
                        Aceptar
                    </Button>

                </DialogActions>
            </form>

        </Dialog>
    )

}