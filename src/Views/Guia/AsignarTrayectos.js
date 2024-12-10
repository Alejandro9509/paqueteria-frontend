import React from 'react';
import {
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    Typography
} from "@mui/material";

function MyComponent(props){

    return (
        <Dialog open={props.open} onClose={() => props.close()} maxWidth={"sm"} fullWidth>
            <DialogTitle>
                <Typography variant={"h3"}>Asignar trayectos</Typography>
            </DialogTitle>
            <form onSubmit={(e) => {e.preventDefault();props.submit(props.dataGuia.m_nIdGuia || 0)}}>
                <DialogContent>
                    <Typography variant={"h4"}>
                        {props.dataGuia &&
                        `¿Desea asignar los trayectos a la guia ${props.dataGuia.m_nFolioGuia}?`
                        }
                    </Typography>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => props.close()}>
                        Cancelar
                    </Button>
                    <Button type={"submit"} onClick={() => props.close()} color={"primary"}>
                        Asignar
                    </Button>
                </DialogActions>
            </form>
        </Dialog>
    );
}

MyComponent.propTypes = {};

export default MyComponent;
