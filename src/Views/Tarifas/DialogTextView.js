import React, {useState} from "react";
import {Button, Dialog, DialogActions, DialogContent, TextField} from "@material-ui/core";

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

    const handleShowDialog = () => {
        props.handleShowDialog(false)
    }
    const handleConfirmSelection = () => {
        props.handleOnConfirmSelection(state)
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
            <DialogContent>
                <TextField variant="outlined" margin="dense"
                           onChange={handleOnDataChange}
                           fullWidth
                           label="Nombre"
                           value={state.nombre}
                           name="nombre"
                />
            </DialogContent>
            <DialogActions>
                <Button onClick={handleShowDialog} color="primary">
                    Close
                </Button>
                <Button onClick={handleConfirmSelection} color="primary" autoFocus>
                    Aceptar
                </Button>

            </DialogActions>
        </Dialog>
    )

}