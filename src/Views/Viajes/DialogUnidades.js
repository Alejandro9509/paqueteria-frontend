import React, {useEffect, useState} from 'react';
import {
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle
} from '@mui/material';
import TableUnidades from "./TableUnidades";
import { obtenerUnidadesOperador } from "../../Util/Contexts/UnidadesContext";
import {showSuccess} from "../../Util/Util";

function DialogUnidades({ open, handleClose, handleAccept, idOperador }) {
    const [selectedRow, setSelectedRow] = useState(null);
    const [listadoUnidades, setListadoUnidades] = useState([]);

    useEffect(() => {
        if (open){
            obtenerUnidadesOperador(idOperador).then((respuesta) => {
                if(respuesta.data.length <= 0){
                    showSuccess('No hay unidades disponibles asignadas a este operador. Seleccione manualmente')
                    handleClose();
                }
                console.log(respuesta.data);
                setListadoUnidades(respuesta.data)
            }).catch((e) => {
                console.log(e.toString())
                showSuccess('Hubo un problema al cargar el listado de unidades. Intente de nuevo.')
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
                <DialogTitle>Seleccione una Unidad</DialogTitle>
                <DialogContent>
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
