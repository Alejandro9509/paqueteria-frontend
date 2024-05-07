import React, {useEffect, useState} from "react";
import {obtenerTiposDocumento, obtenerTiposDocumentoSucursal} from "../../Util/Contexts/TipoDocumentosContext";
import {Button, Dialog, DialogActions, DialogContent, DialogTitle, MenuItem, TextField} from "@mui/material";
import DialogContentText from "@mui/material/DialogContentText";

export default function DialogTiposDocumentoSucursal(props) {
    const [dataTiposDocumento, setDataTiposDocumento] = useState([]);

    useEffect(() => {
        if (props.value.idSucursal > 0){
            getTiposDocumento()
        }

    }, [props.value.idSucursal])
    async function getTiposDocumento() {
        obtenerTiposDocumentoSucursal(props.value.idSucursal).then(respuesta => {
            let array = respuesta.data.map(obj => ({
                idDocumento: obj.IdDocumento,
                documento: obj.Documento,
                idComplemento: obj.IdComplemento
            }))
            setDataTiposDocumento(array);
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
                <DialogTitle id="form-dialog-title">Definir documento de timbrado por defecto</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        Selecciona el tipo de documento con el que se creará el viaje en el ERP. <br/>
                        En caso de que no se despliegue un listado verifique en el sistema ERP que la sucursal actual tiene documentos asignados. El documento puede ser cambiado en cualquier momento desde parámetros de configuración.
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