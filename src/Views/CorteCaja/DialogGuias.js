import React, {useEffect, useState} from 'react';
import {
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle
} from '@mui/material';
import TableOperadores from "./TableOperadores";
import {obtenerOperadores} from "../../Util/Contexts/OperadoresContext";
import {showSuccess} from "../../Util/Util";
import TableGuias from "./TableGuias";
import {obtenerGuiasFiltroCorteCaja} from "../../Util/Contexts/GuiaContext";

function DialogGuias({ open, handleClose, handleAccept, filtros,idsRowsHiden }) {
    const [listadoSeleccion, setListadoSeleccion] = useState([]);
    const [listado, setListado] = useState([]);

    useEffect(() => {
        if (open){
            obtenerGuiasFiltroCorteCaja(filtros.busquedaPorUsuario, filtros.idOperador, filtros.idUsuario, filtros.fecha).then((respuesta) => {
                setListado(respuesta.data)
            }).catch((e) => {
                console.log(e.toString())
                showSuccess('Hubo un problema al cargar el listado de operadores. Intente de nuevo.')
                handleCloseClick();
            })
        }
    },[open])

    const handleAcceptClick = () => {
        handleAccept(listadoSeleccion);
        handleCloseClick();
    };

    const handleCloseClick = () => {
        setListadoSeleccion([])
        setListado([])
        handleClose();
    };

    const handleRowSelection = (selectedRows) => {
        // Haz algo con los registros seleccionados
        setListadoSeleccion(selectedRows)
    };
    return (
        <div>
            <Dialog open={open} onClose={handleCloseClick} fullWidth maxWidth={"lg"}>
                <DialogTitle>Selecciona las guías para agregar al corte</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        Las guías mostradas coinciden con los datos dados.
                    </DialogContentText>
                    <TableGuias data={listado.filter((i) => !idsRowsHiden.some((j) => j === i.idGuia))}
                                handleSelection={handleRowSelection}
                                selectedRows2={listadoSeleccion}
                                sumarTotalSeleccion={true}
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCloseClick}>Cerrar</Button>
                    <Button onClick={handleAcceptClick} color="primary" autoFocus>
                        Aceptar
                    </Button>
                </DialogActions>
            </Dialog>
        </div>
    );
}

export default DialogGuias;
