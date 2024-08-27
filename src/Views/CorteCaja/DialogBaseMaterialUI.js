import React, {useState} from 'react';
import { Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, TextField } from '@mui/material';

function MyDialog({ open, handleClose, handleAccept }) {
    const [inputValue, setInputValue] = useState('');

    const handleInputChange = (event) => {
        setInputValue(event.target.value);
    };

    const handleAcceptClick = () => {
        handleAccept(inputValue);
        setInputValue('');
        handleClose();
    };
    return (
        <div>
            <Dialog open={open} onClose={handleClose}>
                <DialogTitle>Título del diálogo</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        Contenido del diálogo.
                    </DialogContentText>
                    <TextField
                        label="Ingresar datos"
                        value={inputValue}
                        onChange={handleInputChange}
                        fullWidth
                    />
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

export default MyDialog;
