import React, {useState} from "react";
import {Button, Dialog, DialogActions, DialogContent} from "@mui/material";
import {DataGrid} from "@mui/x-data-grid";
import {dataGridLocaleText} from "../../Constants";


export default function DialogCheckbox(props) {
    /** Props
     * handleShowDialog() - Controla si se abre o cierra el dialogo.
     * handleOnConfirmSelection() - Retorna al padre los items seleccionados.
     * openDialog Boolean - Controla si se abre o cierra el dialogo
     * rowId string - identificador para item de la lista que se usara en el datagrid
     * selection array - Lista de item seleccionados del datagrid
     * rows - lista de registros a mostrar en la tabla
     * columns - columnas que se veran en la tabla
     * */
    const [state, setState] = useState({
        height: window.innerHeight,
    })

    const [selection, setSelection] = useState(props.selection || [])

    const handleShowDialog = () => {
        props.handleShowDialog(false)
    }
    const handleConfirmSelection = () => {
        props.handleOnConfirmSelection(selection)
    }
    const handleOnSelectionChange = (event) => {
        setSelection(event.selectionModel)
    }

    return(
        <Dialog
            fullWidth={true}
            maxWidth={'md'}
            open={props.openDialog}
            onClose={handleShowDialog}
            aria-labelledby="max-width-dialog-title"
        >
            <DialogContent>
                <div style={{ display: 'flex', height: '800px' }}>
                    <DataGrid
                        localeText={dataGridLocaleText}
                        rows={props.rows}
                        columns={props.columns}
                        density="compact"
                        pageSize={Math.floor((state.height - 310) / 30)}
                        getRowId={(row) => row[props.rowId]}
                        checkboxSelection
                        onRowSelectionModelChange={(newModel)=>{
                            setSelection(newModel)
                        }}
                        rowSelectionModel={selection}
                        disableSelectionOnClick={props.disabled}
                    />
                </div>
            </DialogContent>
            <DialogActions>
                <Button onClick={handleShowDialog} color="primary">
                    Cancelar
                </Button>
                <Button onClick={handleConfirmSelection} color="primary" autoFocus disabled={props.disabled}>
                    Aceptar
                </Button>

            </DialogActions>
        </Dialog>
    )

}