import React, {useEffect, useState} from 'react';
import {
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle
} from '@mui/material';
import TableOperadores from "./TableOperadores";
import {obtenerOperadores} from "../../Util/Contexts/OperadoresContext";
import {showSuccess} from "../../Util/Util";

function DialogOperadores({ open, handleClose, handleAccept }) {
    const [selectedRow, setSelectedRow] = useState(null);
    const [listadoOperadores, setListadoOperadores] = useState([]);

    useEffect(() => {
        if (open){
            obtenerOperadores().then((respuesta) => {
                setListadoOperadores(respuesta.data)
            }).catch((e) => {
                console.log(e.toString())
                showSuccess('Hubo un problema al cargar el listado de operadores. Intente de nuevo.')
                handleClose();
            })
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
                <DialogTitle>Selecciona un operador</DialogTitle>
                <DialogContent>
                    {/*<DialogContentText>
                        Se buscaran las guías que fueron entregadas en última milla por el operador seleccionado.
                    </DialogContentText>*/}
                    <TableOperadores data={listadoOperadores} handleSelection={handleRowSelection} />
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

export default DialogOperadores;
