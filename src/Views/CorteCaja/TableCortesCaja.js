import React from 'react';
import {
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    Collapse,
    Box,
    Typography,
    Tooltip
} from '@mui/material';
import IconButton from "@mui/material/IconButton";
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import { styled } from "@mui/material/styles";
import makeStyles from '@mui/styles/makeStyles';
import EditIcon from '@mui/icons-material/Edit';
import VisibilityIcon from '@mui/icons-material/Visibility';
import InsertDriveFileIcon from '@mui/icons-material/InsertDriveFile';

const PREFIX = 'TableCortesCaja';

const classes = {
    root: `${PREFIX}-root`
};

const StyledTableContainer = styled(TableContainer)({
    [`& .${classes.root}`]: {
        '& > *': {
            borderBottom: 'unset',
        },
    },
});

const TableCortesCaja = ({ data, onRowClick }) => {
    const useRowStyles = makeStyles({
        [`& .${classes.root}`]: {
            '& > *': {
                borderBottom: 'unset',
            },
        },
    });
    const ACTIONS = {
        MODIFICAR: 'MODIFICAR',
        CONSULTAR: 'CONSULTAR',
        REPORTE_CORTE: 'REPORTE_CORTE'
    }

    const handleRowClick = (selectedItem, action) => {
        onRowClick(selectedItem, action)
    };

    function totalSum(items) {
        return items.map(({ total }) => total).reduce((sum, i) => sum + i, 0);
    }
    const totalFinal = totalSum(data).toLocaleString('es-MX', { style: 'currency', currency: 'MXN' });

    function sumarTotalPorPersona(items) {
        console.log(data)
        const sumByPerson = {};

        items.forEach((item) => {
            const idPersona = item.idPersona;
            const total = item.total;

            if (!sumByPerson[idPersona]) {
                sumByPerson[idPersona] = {
                    total: 0,
                    nombrePersona: item.nombrePersona,
                    idPersona: idPersona
                };
            }

            sumByPerson[idPersona].total += total;
        });
        console.log(sumByPerson)
        console.log(Object.values(sumByPerson))
        return Object.values(sumByPerson);
    }
    const sumByPerson = sumarTotalPorPersona(data);

    function Row(props) {
        const { row, onRowClick } = props;
        const [open, setOpen] = React.useState(false);
        const classes = useRowStyles();

        return (
            <React.Fragment>
                <TableRow className={classes.root}>
                    <TableCell>
                        <IconButton aria-label="expand row" size="small" onClick={() => setOpen(!open)}>
                            {open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
                        </IconButton>
                    </TableCell>
                    <TableCell>
                        <Tooltip title="Consultar">
                            <IconButton aria-label="edit" size="small" onClick={() => onRowClick(row, ACTIONS.CONSULTAR)}>
                                <VisibilityIcon />
                            </IconButton>
                        </Tooltip>
                        <Tooltip title="Modificar">
                            <IconButton aria-label="edit" size="small" onClick={() => onRowClick(row, ACTIONS.MODIFICAR)}>
                                <EditIcon />
                            </IconButton>
                        </Tooltip>
                        <Tooltip title="Descargar reporte opción 2">
                            <IconButton aria-label="edit" size="small" onClick={() => onRowClick(row, ACTIONS.REPORTE_CORTE)}>
                                <InsertDriveFileIcon />
                            </IconButton>
                        </Tooltip>
                    </TableCell>
                    <TableCell component="th" scope="row">
                        {row.folioCorte}
                    </TableCell>
                    <TableCell>{row.fechaCorte}</TableCell>
                    <TableCell>{row.nombrePersona}</TableCell>
                    <TableCell align="right">{row.total.toLocaleString('es-MX', { style: 'currency', currency: 'MXN' })}</TableCell>
                </TableRow>
                <TableRow>
                    <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={6}>
                        <Collapse in={open} timeout="auto" unmountOnExit>
                            <Box margin={1}>
                                <Typography variant="h6" gutterBottom component="div">
                                    Guías
                                </Typography>
                                <Table size="small" aria-label="purchases">
                                    <TableHead>
                                        <TableRow>
                                            <TableCell>FOLIO GUIA</TableCell>
                                            <TableCell>FECHA ENTREGA</TableCell>
                                            <TableCell>OPERADOR/USUARIO</TableCell>
                                            <TableCell>FORMA DE PAGO</TableCell>
                                            <TableCell align="right">TOTAL GUIA</TableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {row.guias.map((historyRow) => (
                                            <TableRow key={historyRow.idGuia}>
                                                <TableCell component="th" scope="row">
                                                    {historyRow.folioGuia}
                                                </TableCell>
                                                <TableCell>{historyRow.fechaEntrega}</TableCell>
                                                <TableCell>{historyRow.nombrePersona}</TableCell>
                                                <TableCell>{historyRow.metodoPago}</TableCell>
                                                <TableCell align="right">
                                                    {historyRow.total.toLocaleString('es-MX', { style: 'currency', currency: 'MXN' })}
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </Box>
                        </Collapse>
                    </TableCell>
                </TableRow>
            </React.Fragment>
        );
    }

    return (
        <StyledTableContainer component={Paper}>
            <Table>
                <TableHead>
                    <TableRow>
                        <TableCell/>
                        <TableCell/>
                        <TableCell>Id Corte</TableCell>
                        <TableCell >FECHA DE CORTE</TableCell>
                        <TableCell>Operador/Usuario</TableCell>
                        <TableCell align="right">TOTAL CORTE</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {data.map((item) => (
                        <Row key={item.idCorte} row={item} onRowClick={handleRowClick} />
                    ))}

                    <TableRow>
                        <TableCell colSpan={3} />
                        <TableCell colSpan={2}>TOTAL CORTES</TableCell>
                        <TableCell align="right">{totalFinal}</TableCell>
                    </TableRow>
                    {sumByPerson.map((item) => (
                        <TableRow>
                            <TableCell colSpan={3} />
                            <TableCell colSpan={2}>TOTAL {item.nombrePersona}</TableCell>
                            <TableCell align="right">{item.total.toLocaleString('es-MX', { style: 'currency', currency: 'MXN' })}</TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </StyledTableContainer>
    );
};

export default TableCortesCaja;
