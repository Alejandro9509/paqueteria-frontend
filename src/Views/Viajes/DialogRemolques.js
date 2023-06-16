import React, {useEffect, useState} from 'react';
import {
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle
} from '@material-ui/core';
import TableUnidades from "./TableRemolques";
import { obtenerUnidadesConvoy } from "../../Util/Contexts/UnidadesContext";
import {showSuccess} from "../../Util/Util";

function DialogUnidades({ open, handleClose, handleAccept, idConvoy }) {
    const [selectedRow, setSelectedRow] = useState(null);
    const [listadoUnidades, setListadoUnidades] = useState([]);

    useEffect(() => {
        if (open){
            if(idConvoy === ""){
                showSuccess('La unidad seleccionada no tiene un convoy definido')
                handleClose()
            } else {
                obtenerUnidadesConvoy(idConvoy).then((respuesta) => {
                    if(respuesta.data.length <= 0){
                        showSuccess('No hay remolques que pertenezcan al mismo Convoy')
                        handleClose()
                    }
                    console.log(respuesta.data);
                    setListadoUnidades(respuesta.data)
                }).catch((e) => {
                    console.log(e.toString())
                    showSuccess('Hubo un problema al cargar el listado de operadores. Intente de nuevo.')
                    handleClose();
                })
            }
        }
    },[open])

    const handleAcceptClick = () => {
        handleAccept(selectedRow);
        handleClose();
    };

    const handleRowSelection = (row) => {
        setSelectedRow(row);
    };
    return (
        <div>
            <Dialog open={open} onClose={handleClose} fullWidth maxWidth={"md"}>
                <DialogTitle>Seleccoine una Unidad</DialogTitle>
                <DialogContent>
                    {/*<DialogContentText>
                        Se buscaran las guías que fueron entregadas en última milla por el operador seleccionado.
                    </DialogContentText>*/}
                    <TableUnidades data={listadoUnidades} handleSelection={handleRowSelection} />
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose}>Cerrar</Button>
                    <Button onClick={handleAcceptClick} color="primary" autoFocus>
                        Aceptar
                    </Button>
                </DialogActions>
            </Dialog>
        </div>
    );
}

export default DialogUnidades;
