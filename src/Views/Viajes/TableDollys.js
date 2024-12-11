import React, {useEffect, useRef, useState} from "react";
import {Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TextField} from "@mui/material";


export default function TableDollys({ data, handleSelection }) {
    const [selectedRow, setSelectedRow] = useState(null);
    const textFieldRef = useRef(null);
    const [filtro, setFiltro] = useState('');
    const filteredData = data.filter(item => item.m_sDescripcion.toLowerCase().includes(filtro.toLowerCase()));

    useEffect(() => {
        if (data.length > 0) {
            textFieldRef.current.focus();
        }
    }, [data]);

    const handleRowClick = (row) => {
        setSelectedRow(row);
        handleSelection(row);
    };

    const handleChangeFiltro = (event) => {
        setFiltro(event.target.value);
    };

    return (
        <div>
            <TextField label="Filtrar por descripción" value={filtro} onChange={handleChangeFiltro}
                       variant="outlined" margin={"dense"} inputRef={textFieldRef}/>
            <br/>
            <br/>
            <TableContainer/* component={Paper}*/ style={{ height: '400px' }}>
                <Table size="small" stickyHeader>
                    <TableHead>
                        <TableRow>
                            <TableCell align="center">Código de Unidad</TableCell>
                            <TableCell>Descripción</TableCell>
                            <TableCell>Tipo de unidad</TableCell>
                            <TableCell>Disponibilidad</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {filteredData.map((item) => (
                            <TableRow
                                key={item.m_nIdUnidad}
                                onClick={() => handleRowClick(item)}
                                selected={selectedRow?.m_nIdUnidad === item.m_nIdUnidad}
                            >
                                <TableCell align="center">{item.m_sCodigo}</TableCell>
                                <TableCell>{item.m_sDescripcion}</TableCell>
                                <TableCell>{item.m_sTipoUnidad}</TableCell>
                                <TableCell>{item.EstatusUnidad}</TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
        </div>
    );
}
