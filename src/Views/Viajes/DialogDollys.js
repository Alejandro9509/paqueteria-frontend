import React, {useEffect, useState} from 'react';
import {
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle
} from '@mui/material';
import TableDollys from "./TableDollys";
import { obtenerUnidadesConvoy } from "../../Util/Contexts/UnidadesContext";
import {showSuccess} from "../../Util/Util";

function DialogDollys({ open, handleClose, handleAccept, idConvoy }) {
    const [selectedRow, setSelectedRow] = useState(null);
    const [listadoDollys, setListadoDollys] = useState([]);

    useEffect(() => {
        if (open){
            if(idConvoy === ""){
                showSuccess('La unidad seleccionada no tiene un convoy definido')
                handleClose()
            } else {
                obtenerUnidadesConvoy(idConvoy).then((respuesta) => {
                    if(respuesta.data.length <= 0){
                        showSuccess('No hay dollys que pertenezcan al mismo Convoy')
                        handleClose()
                    }
                    console.log(respuesta.data);
                    // Filtra los Dollys
                    const dollys = respuesta.data.filter(i => i.m_bActivo && i.m_nIdTipoUnidad === 28);
                    setListadoDollys(dollys)
                }).catch((e) => {
                    console.log(e.toString())
                    showSuccess('Hubo un problema al cargar el listado de dollys. Intente de nuevo.')
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
                <DialogTitle>Seleccione un Dolly</DialogTitle>
                <DialogContent>
                    <TableDollys data={listadoDollys} handleSelection={handleRowSelection} />
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

export default DialogDollys;
