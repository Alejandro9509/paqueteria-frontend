import React, {useEffect, useRef, useState} from "react";
import {Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TextField} from "@mui/material";

export default function TableOperadores({ data, handleSelection }) {
    const [selectedRow, setSelectedRow] = useState(null);
    const textFieldRef = useRef(null);

    useEffect(() => {
        if (data.length > 0) {
            textFieldRef.current.focus();
        }
    }, [data]);

    const handleRowClick = (row) => {
        setSelectedRow(row);
        handleSelection(row); // Llama a la función handleSelection pasando el registro seleccionado
    };
    const [filtro, setFiltro] = useState('');

    const handleChangeFiltro = (event) => {
        setFiltro(event.target.value);
    };

    const datosFiltrados = data.filter((objeto) => {
        return (objeto.m_nNumeroOperador + ' ' + objeto.m_sNombreCompleto).toLowerCase().includes(filtro.toLowerCase());
    });
    return (
        <div>
            <TextField label="Filtrar por nombre o número" value={filtro} onChange={handleChangeFiltro}
                       variant="outlined" margin={"dense"} inputRef={textFieldRef}/>
            <br/>
            <br/>
            <TableContainer/* component={Paper}*/ style={{ height: '400px' }}>
                <Table size="small" stickyHeader>
                    <TableHead>
                        <TableRow>
                            <TableCell align="center">Número de Operador</TableCell>
                            <TableCell>Nombre Completo</TableCell>
                            <TableCell>Sucursal</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {datosFiltrados.map((item) => (
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
        </div>

    );
}