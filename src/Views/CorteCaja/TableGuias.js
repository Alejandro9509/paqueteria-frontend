import React, { useState } from 'react';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Checkbox } from '@material-ui/core';

const TableGuias = ({ data, handleSelection, selectedRows2 }) => {

    const handleRowSelection = (event, id) => {
        const selectedIndex = selectedRows2.indexOf(id);
        let newSelectedRows = [];

        if (selectedIndex === -1) {
            newSelectedRows = [...selectedRows2, id];
        } else {
            newSelectedRows = selectedRows2.filter(rowId => rowId.idGuia !== id.idGuia);
        }

        // setSelectedRows(newSelectedRows);
        handleSelection(newSelectedRows);
    };

    function totalSum(items) {
        return items.map(({ total }) => total).reduce((sum, i) => sum + i, 0);
    }

    const totalFinal = totalSum(data).toLocaleString('es-MX', { style: 'currency', currency: 'MXN' });

    return (
        <TableContainer>
            <Table size="small">
                <TableHead>
                    <TableRow>
                        <TableCell>Seleccionar</TableCell>
                        <TableCell>Folio de Guía</TableCell>
                        <TableCell>Estatus</TableCell>
                        <TableCell>Fecha de Entrega</TableCell>
                        <TableCell>Operador/Usuario</TableCell>
                        <TableCell>Tipo de Cobro</TableCell>
                        <TableCell align={"right"}>Total</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {data.map((item) => (
                        <TableRow key={item.idGuia}
                                  onClick={(event) => handleRowSelection(event, item)} // Maneja el evento de clic en la fila
                                  selected={selectedRows2.indexOf(item) !== -1} // Marca la fila como seleccionada si es igual al registro seleccionado
                        >
                            <TableCell>
                                <Checkbox
                                    checked={selectedRows2.indexOf(item) !== -1}
                                    onChange={(event) => handleRowSelection(event, item)}
                                />
                            </TableCell>
                            <TableCell>{item.folioGuia}</TableCell>
                            <TableCell>{item.fueEntregada ? 'ENTREGADA' : 'NO ENTREGADA'}</TableCell>
                            <TableCell>{item.fueEntregada ? item.fechaEntrega : 'NO APLICA'}</TableCell>
                            <TableCell>{item.nombrePersona}</TableCell>
                            <TableCell>{item.tipoCobro}</TableCell>
                            <TableCell align={"right"}>{item.total.toLocaleString('es-MX', { style: 'currency', currency: 'MXN' })}</TableCell>
                        </TableRow>
                    ))}
                    <TableRow>
                        <TableCell colSpan={5} />
                        <TableCell colSpan={1}>TOTAL</TableCell>
                        <TableCell align="right">{totalFinal}</TableCell>
                    </TableRow>
                </TableBody>
            </Table>
        </TableContainer>
    );
};

export default TableGuias;
