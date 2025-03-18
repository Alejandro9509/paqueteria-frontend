import React, {useEffect, useState} from 'react';
import {
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle
} from '@mui/material';
import TableRemolques from "./TableRemolques";
import { obtenerUnidadesConvoy } from "../../Util/Contexts/UnidadesContext";
import {showSuccess} from "../../Util/Util";


function DialogRemolques({ open, handleClose, handleAccept, idConvoy, isTorton }) {
    const [selectedRow, setSelectedRow] = useState(null);
    const [listadoRemolques, setListadoRemolques] = useState([]);

    useEffect(() => {
        if (open){
            if(idConvoy === ""){
                if(!isTorton){
                    showSuccess('La unidad seleccionada no tiene un convoy definido el que ando viendo')
                }
                handleClose()
            } else {
                obtenerUnidadesConvoy(idConvoy).then((respuesta) => {
                    if(respuesta.data.length <= 0){
                        showSuccess('No hay remolques que pertenezcan al mismo Convoy')
                        handleClose()
                    }
                    const remolques = respuesta?.data?.filter(i => i?.m_bActivo && i?.m_nIdTipoUnidad !== 28);
                    setListadoRemolques(remolques)
                }).catch((e) => {
                    console.log(e.toString())
                    showSuccess('Hubo un problema al cargar el listado de remolques. Intente de nuevo.')
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
                <DialogTitle>Seleccione uno o dos Remolques</DialogTitle>
                <DialogContent>
                    <TableRemolques data={listadoRemolques} handleSelection={handleRowSelection} />
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

export default DialogRemolques;
