import React, {useEffect, useRef, useState} from "react";
import {Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TextField} from "@mui/material";

export default function TableUnidades({ data, handleSelection }) {
    const [selectedRow, setSelectedRow] = useState(null);
    const textFieldRef = useRef(null);

    useEffect(() => {
        if (data.length > 0) {
            textFieldRef.current.focus();
        }
    }, [data]);

    const handleRowClick = (row) => {
        setSelectedRow(row);
        handleSelection(row);
    };
    const [filtro, setFiltro] = useState('');

    const handleChangeFiltro = (event) => {
        setFiltro(event.target.value);
    };

    const filteredData = data.filter(item => item.m_sDescripcion.toLowerCase().includes(filtro.toLowerCase()));

    return (
        <div>
            <TextField label="Filtrar por descripción" value={filtro} onChange={handleChangeFiltro}
                       variant="outlined" margin={"dense"} inputRef={textFieldRef}/>
            <br/>
            <br/>
            <TableContainer style={{ height: '400px' }}>
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
                                style={{
                                    pointerEvents: item.m_bDeshabilitado ? "none" : "auto"
                                }}
                            >
                                <TableCell style={{ color: item.m_bDeshabilitado ? "#888" : "inherit" }} align="center" >{item.m_sCodigo}</TableCell>
                                <TableCell style={{ color: item.m_bDeshabilitado ? "#888" : "inherit" }}>{item.m_sDescripcion}</TableCell>
                                <TableCell style={{ color: item.m_bDeshabilitado ? "#888" : "inherit" }}>{item.m_sTipoUnidad}</TableCell>
                                <TableCell style={{ color: item.m_bDeshabilitado ? "#888" : "inherit" }}>{item.EstatusUnidad}</TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
        </div>

    );
}
