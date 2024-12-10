import React, {useEffect, useState} from 'react';
import {
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle
} from '@mui/material';
import {showSuccess} from "../../Util/Util";
import {getListado} from "../../Util/Contexts/UsuarioContext";
import TableUsuarios from "./TableUsuarios";

function DialogOperadores({ open, handleClose, handleAccept }) {
    const [selectedRow, setSelectedRow] = useState(null);
    const [listado, setListado] = useState([]);

    useEffect(() => {
        if (open){
            getListado().then((respuesta) => {
                setListado(respuesta.data)
            }).catch((e) => {
                console.log(e.toString())
                showSuccess('Hubo un problema al cargar el listado de usuarios. Intente de nuevo.')
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
                <DialogTitle>Selecciona un usuario</DialogTitle>
                <DialogContent>
                    {/*<DialogContentText>
                        Se buscaran las guías que fueron entregadas en última milla por el operador seleccionado.
                    </DialogContentText>*/}
                    <TableUsuarios data={listado} handleSelection={handleRowSelection} />
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
