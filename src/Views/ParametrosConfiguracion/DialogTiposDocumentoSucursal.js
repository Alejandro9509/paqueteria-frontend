import React, {useEffect, useState} from "react";
import {obtenerTiposDocumento} from "../../Util/Contexts/TiposDocumentosContext";
import {Button, Dialog, DialogActions, DialogContent, DialogTitle, MenuItem, TextField} from "@material-ui/core";
import DialogContentText from "@material-ui/core/DialogContentText";

export default function DialogTiposDocumentoSucursal(props) {
    const [dataTiposDocumento, setDataTiposDocumento] = useState([]);

    useEffect(() => {
        getTiposDocumento()
    }, [])
    async function getTiposDocumento() {
        obtenerTiposDocumento().then(respuesta => {
            setDataTiposDocumento(respuesta.data);
        });
    }
    const handleOnChangeSelection = (selection) => {
        let data = {
            idSucursal: props.value.idSucursal,
            sucursal: props.value.sucursal,
            idTipoDocumento: selection.idDocumento,
            documento: selection.documento
        }
        props.onClose(data);
    };
    const handleClose = () => {
        props.onClose(props.value);
    };
    return (
        <div>
            <Dialog open={props.open} onClose={handleClose} aria-labelledby="form-dialog-title">
                <DialogTitle id="form-dialog-title">Subscribe</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        Selecciona el tipo de documento con el que se creará el viaje en el ERP
                    </DialogContentText>
                    <TextField
                        autoFocus
                        margin="dense"
                        name="idDocumento"
                        label="Documento"
                        fullWidth
                        select
                        value={props.value.idTipoDocumento}
                        onChange={(e) => handleOnChangeSelection(dataTiposDocumento.find(obj => obj.idDocumento === e.target.value))}
                    >
                        {dataTiposDocumento.map(obj => (
                            <MenuItem key={obj.idDocumento} value={obj.idDocumento}>{obj.documento}</MenuItem>
                        ))}
                    </TextField>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => handleClose()} color="primary">
                        Cancelar
                    </Button>
                    {/*<Button onClick={() => handleListItemClick(state)} color="primary">
                        Guardar
                    </Button>*/}
                </DialogActions>
            </Dialog>
        </div>
    );
}