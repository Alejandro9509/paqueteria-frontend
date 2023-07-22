import React, {useEffect, useRef, useState} from "react";
import {Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TextField, Checkbox} from "@material-ui/core";

export default function TableRemolques({ data, handleSelection }) {
    const [selectedRows, setSelectedRows] = useState([]);
    const textFieldRef = useRef(null);

    useEffect(() => {
        if (data.length > 0) {
            textFieldRef.current.focus();
        }
    }, [data]);

    const handleRowClick = (row) => {
        let newSelectedRows = [...selectedRows];
        if (selectedRows.find(r => r.m_nIdUnidad === row.m_nIdUnidad)) {
            newSelectedRows = newSelectedRows.filter(r => r.m_nIdUnidad !== row.m_nIdUnidad);
        } else {
            if (newSelectedRows.length < 2) {
                newSelectedRows.push(row);
            }
        }
        setSelectedRows(newSelectedRows);
        handleSelection(newSelectedRows);
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
            <TableContainer/* component={Paper}*/ style={{ height: '400px' }}>
                <Table size="small" stickyHeader>
                    <TableHead>
                        <TableRow>
                            <TableCell padding="checkbox">
                            </TableCell>
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
                                selected={selectedRows.some(r => r.m_nIdUnidad === item.m_nIdUnidad)}
                            >
                                <TableCell padding="checkbox">
                                    <Checkbox
                                        checked={selectedRows.some(r => r.m_nIdUnidad === item.m_nIdUnidad)}
                                        onClick={(event) => {
                                            event.stopPropagation();
                                            handleRowClick(item);
                                        }}
                                    />
                                </TableCell>
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
