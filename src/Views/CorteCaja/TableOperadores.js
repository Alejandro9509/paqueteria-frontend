import React, {useState} from "react";
import {Table, TableBody, TableCell, TableContainer, TableHead, TableRow} from "@material-ui/core";

export default function TableOperadores({ data, handleSelection }) {
    const [selectedRow, setSelectedRow] = useState(null);

    const handleRowClick = (row) => {
        setSelectedRow(row);
        handleSelection(row); // Llama a la función handleSelection pasando el registro seleccionado
    };

    return (
        <TableContainer/* component={Paper}*/>
            <Table size="small">
                <TableHead>
                    <TableRow>
                        <TableCell align="center">Número de Operador</TableCell>
                        <TableCell>Nombre Completo</TableCell>
                        <TableCell>Sucursal</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {data.map((item) => (
                        <TableRow
                            key={item.m_nIdOperador}
                            onClick={() => handleRowClick(item)} // Maneja el evento de clic en la fila
                            selected={selectedRow?.m_nIdOperador === item.m_nIdOperador} // Marca la fila como seleccionada si es igual al registro seleccionado
                        >
                            <TableCell align="center">{item.m_nNumeroOperador}</TableCell>
                            <TableCell>{item.m_sNombreCompleto}</TableCell>
                            <TableCell>{item.m_sSucursal}</TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </TableContainer>
    );
}