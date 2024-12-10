import React from 'react';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Checkbox } from '@mui/material';

const TableGuias = ({ data, handleSelection, selectedRows2, disabled, sumarTotalSeleccion }) => {

    const handleRowSelection = (event, id) => {
        const selectedIndex = selectedRows2.indexOf(id);
        let newSelectedRows = [];

        if (selectedIndex === -1) {
            newSelectedRows = [...selectedRows2, id];
        } else {
            newSelectedRows = selectedRows2.filter(rowId => rowId.idGuia !== id.idGuia);
        }
        handleSelection(newSelectedRows);
    };

    /*SI SE HABILITA LA SUMA DE SELECCION SE HACE, SI NO SE SUMA EL TOTAL DE TODO EL LISTADO*/
    function totalSum(items) {
        if (sumarTotalSeleccion){
            return selectedRows2.map(({ total }) => total).reduce((sum, i) => sum + i, 0);
        } else {
            return items.map(({ total }) => total).reduce((sum, i) => sum + i, 0);
        }
    }

    const totalFinal = totalSum(data).toLocaleString('es-MX', { style: 'currency', currency: 'MXN' });

    return (
        <TableContainer style={{ height: '400px' }}>
            <Table size="small" stickyHeader>
                <TableHead>
                    <TableRow>
                        <TableCell>Seleccionar</TableCell>
                        <TableCell>Folio de Guía</TableCell>
                        <TableCell>Estatus</TableCell>
                        <TableCell>Fecha de Entrega</TableCell>
                        <TableCell>Operador/Usuario</TableCell>
                        <TableCell>Tipo de Cobro</TableCell>
                        <TableCell>Método de pago</TableCell>
                        <TableCell align={"right"}>Total</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {data.map((item) => (
                        <TableRow key={item.idGuia}
                                  // onClick={(event) => !disabled && handleRowSelection(event, item)} // Maneja el evento de clic en la fila
                                  selected={selectedRows2.indexOf(item) !== -1} // Marca la fila como seleccionada si es igual al registro seleccionado
                                  aria-disabled={disabled}
                        >
                            <TableCell>
                                <Checkbox
                                    checked={selectedRows2.indexOf(item) !== -1}
                                    onChange={(event) => handleRowSelection(event, item)}
                                    disabled={disabled || !item.fueEntregada}
                                />
                            </TableCell>
                            <TableCell>{item.folioGuia}</TableCell>
                            <TableCell>{item.fueEntregada ? 'ENTREGADA' : 'NO ENTREGADA'}</TableCell>
                            <TableCell>{item.fueEntregada ? item.fechaEntrega : 'NO APLICA'}</TableCell>
                            <TableCell>{item.nombrePersona}</TableCell>
                            <TableCell>{item.tipoCobro}</TableCell>
                            <TableCell>{item.metodoPago}</TableCell>
                            <TableCell align={"right"}>{item.total.toLocaleString('es-MX', { style: 'currency', currency: 'MXN' })}</TableCell>
                        </TableRow>
                    ))}
                    <TableRow>
                        <TableCell colSpan={6} />
                        <TableCell colSpan={1}>TOTAL</TableCell>
                        <TableCell align="right">{totalFinal}</TableCell>
                    </TableRow>
                </TableBody>
            </Table>
        </TableContainer>
    );
};

export default TableGuias;
