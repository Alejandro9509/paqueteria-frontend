import React, {useEffect, useRef, useState} from "react";
import {Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TextField} from "@mui/material";

export default function TableUsuarios({ data, handleSelection }) {
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
        return (objeto.nombre + ' ' + objeto.usuario).toLowerCase().includes(filtro.toLowerCase());
    });
    return (
        <div>
            <TextField label="Filtrar por nombre o usuario" value={filtro} onChange={handleChangeFiltro}
                       variant="outlined" margin={"dense"} inputRef={textFieldRef}/>
            <br/>
            <br/>
            <TableContainer/* component={Paper}*/ style={{ height: '400px' }}>
                <Table size="small" stickyHeader>
                    <TableHead>
                        <TableRow>
                            <TableCell>Usuario</TableCell>
                            <TableCell>Nombre Completo</TableCell>
                            <TableCell>Sucursal</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {datosFiltrados.map((item) => (
                            <TableRow
                                key={item.idUsuario}
                                onClick={() => handleRowClick(item)} // Maneja el evento de clic en la fila
                                selected={selectedRow?.idUsuario === item.idUsuario} // Marca la fila como seleccionada si es igual al registro seleccionado
                            >
                                <TableCell>{item.usuario}</TableCell>
                                <TableCell>{item.nombre}</TableCell>
                                <TableCell>{item.sucursal}</TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
        </div>

    );
}