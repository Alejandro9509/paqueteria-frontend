import React, {useEffect, useState} from "react";
import {
    Button,
    Dialog,
    DialogActions,
    DialogContent, DialogContentText,
    DialogTitle,
    Table, TableBody, TableCell,
    TableContainer,
    TableHead, TableRow, TextField, Typography
} from "@mui/material";

export default function DialogImpresion({ open, handleClose, handleAccept, paquetes }) {
    const [listadoPaquete, setListadoPaquetes] = useState([]);

    useEffect(() => {
        if (open){
            paquetes.forEach((i) => {
                i.rangoInicio = 0
                i.rangoFin = 0
            })
            setListadoPaquetes(paquetes)
        }
    },[open, paquetes])

    const handleAcceptClick = () => {
        // paquetes.forEach((i) => {
        //     i.rangoInicio = parseInt(i.rangoInicio)
        //     i.rangoFin = parseInt(i.rangoFin)
        // })
        let paquetesFinal = [...listadoPaquete]
        paquetesFinal.forEach((i) => {
            i.rangoInicio = parseInt(i.rangoInicio)
            i.rangoFin = parseInt(i.rangoFin)
        })
        paquetesFinal = paquetesFinal.filter((i) => i.rangoInicio > 0)
        paquetesFinal = paquetesFinal.filter((i) => i.rangoFin > 0)

        handleAccept(paquetesFinal);
        handleClose();
    };

    const handleDataChange = (list) => {
        setListadoPaquetes(list);
    };
    return (
        <div>
            <Dialog open={open} onClose={handleClose} fullWidth maxWidth={"md"}>
                <DialogTitle>Define el rango de etiquetas que deseas imprimir</DialogTitle>
                    <DialogContentText align={"center"}>
                        <Typography variant="h5" component={"h3"}>
                            Los productos con un número inicial o final igual a 0 serán ignorados.
                        </Typography>
                    </DialogContentText>

                <DialogContent>

                    <TablePrint data={listadoPaquete} handleDataChange={handleDataChange} />
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

function TablePrint({ data, handleDataChange }) {
    const [selectedRow, setSelectedRow] = useState(null);

    const handleRowClick = (row) => {
        setSelectedRow(row);
    };

    const datosFiltrados = data;

    const handleChangeRango = (event, selection) => {
        try {
            let itemToChange = data.find((i) => i.idPaquete === selection.idPaquete)
            if (!itemToChange){
                return
            }
            if (event.target.name === 'rangoInicio'){
                if (parseInt(event.target.value) < 0){
                    // console.log('Cantidad fuera del rango válido')
                    // console.log('value: ' + parseInt(event.target.value))
                    return;
                }
                if (parseInt(event.target.value) > parseInt(selection.rangoFin)){
                    // console.log('Cantidad fuera del rango válido')
                    // console.log('value: ' + parseInt(event.target.value))
                    // console.log('Comparing:' + parseInt(selection.rangoFin))
                    return;
                }
            }
            if (event.target.name === 'rangoFin'){
                if (parseInt(event.target.value) < parseInt(selection.rangoInicio)){
                    // console.log('Cantidad fuera del rango válido')
                    // console.log('value: ' + parseInt(event.target.value))
                    // console.log('Comparing:' + parseInt(selection.rangoInicio))
                    return;
                }
                // if (parseInt(event.target.value) > parseInt(selection.cantidad)){
                //     console.log('Cantidad fuera del rango válido')
                //     console.log('value: ' + parseInt(event.target.value))
                //     console.log('Comparing:' + parseInt(selection.cantidad))
                //     return;
                // }
            }
            let indexItemToChange = data.indexOf(itemToChange)
            itemToChange[event.target.name] = event.target.value
            let newData = [...data]
            newData[indexItemToChange] = itemToChange
            handleDataChange(newData)
        }catch (e) {
            // console.log('mamó')
            console.log(e)
        }

    };
    return (
        <div>
            {/*<TextField label="Filtrar por nombre o número" value={filtro} onChange={handleChangeFiltro}*/}
            {/*           variant="outlined" margin={"dense"}/>*/}
            {/*<br/>*/}
            {/*<br/>*/}
            <TableContainer/* component={Paper}*/ style={{ height: '400px' }}>
                <Table size="small" stickyHeader>
                    <TableHead>
                        <TableRow>
                            <TableCell>Producto</TableCell>
                            <TableCell>Embalaje</TableCell>
                            <TableCell>Descripción</TableCell>
                            <TableCell>Etiqueta inicial</TableCell>
                            <TableCell>Etiqueta final</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {datosFiltrados.map((item) => (
                            <TableRow
                                key={item.idPaquete}
                                onClick={() => handleRowClick(item)} // Maneja el evento de clic en la fila
                                selected={selectedRow?.idPaquete === item.idPaquete} // Marca la fila como seleccionada si es igual al registro seleccionado
                            >
                                <TableCell>{item.producto}</TableCell>
                                <TableCell>{item.embalaje}</TableCell>
                                <TableCell>{item.descripcion}</TableCell>
                                <TableCell><TextField type="number" value={item.rangoInicio} onChange={(e) => handleChangeRango(e, item)} name={'rangoInicio'} variant="outlined" margin={"dense"}/></TableCell>
                                <TableCell><TextField type="number" value={item.rangoFin} onChange={(e) => handleChangeRango(e, item)} name={'rangoFin'} variant="outlined" margin={"dense"}/></TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
        </div>

    );
}