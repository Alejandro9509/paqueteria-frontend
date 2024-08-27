import React from 'react';
import {Button, Dialog, DialogActions, DialogContent, DialogTitle, Modal} from "@mui/material";

export const IdleTimeOutModal = ({showModal, handleClose, handleLogout, remainingTime}) => {

    return (
        <Dialog open={showModal} maxWidth={"md"} fullWidth onClose={handleClose}>
            <DialogTitle >
                Sesión próxima a caducar
            </DialogTitle>
            <DialogContent>Por tu seguridad y debido a que no has realizado ninguna operación.

                Si deseas extender el tiempo de sesión has clic en "Continuar"</DialogContent>
            <DialogActions>
                <Button variant="danger" onClick={handleLogout}>
                    Finalizar
                </Button>
                <Button variant="primary" onClick={handleClose}>
                    Continuar
                </Button>
            </DialogActions>
        </Dialog>
    )
}