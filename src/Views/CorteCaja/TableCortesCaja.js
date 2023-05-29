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
    Typography
} from '@material-ui/core';
import IconButton from "@material-ui/core/IconButton";
import KeyboardArrowDownIcon from '@material-ui/icons/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@material-ui/icons/KeyboardArrowUp';
import {makeStyles} from "@material-ui/core/styles";

const CollapsibleTable = ({ data }) => {
    const useRowStyles = makeStyles({
        root: {
            '& > *': {
                borderBottom: 'unset',
            },
        },
    });
    const [open, setOpen] = React.useState({});

    const handleRowClick = (idCorte) => {
        setOpen((prevState) => ({
            ...prevState,
            [idCorte]: !prevState[idCorte]
        }));
    };

    function Row(props) {
        const { row } = props;
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
                    <TableCell component="th" scope="row">
                        {row.idCorte}
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
                                                <TableCell>{historyRow.tipoPago}</TableCell>
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
        <TableContainer component={Paper}>
            <Table>
                <TableHead>
                    <TableRow>
                        <TableCell/>
                        <TableCell>Id Corte</TableCell>
                        <TableCell>FECHA DE CORTE</TableCell>
                        <TableCell>OPERADOR/USUARIO</TableCell>
                        <TableCell align="right">TOTAL CORTE</TableCell>
                        {/*<TableCell colSpan={6} />*/}
                    </TableRow>
                </TableHead>
                <TableBody>
                    {data.map((item) => (
                        <Row key={item.idCorte} row={item} />
                        /*<React.Fragment key={item.idCorte}>
                            <TableRow onClick={() => handleRowClick(item.idCorte)}>
                                <TableCell>
                                    <IconButton aria-label="expand row" size="small" onClick={() => setOpen(!open)}>
                                        {open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
                                    </IconButton>
                                </TableCell>
                                <TableCell>{item.idCorte}</TableCell>
                                <TableCell>{item.total}</TableCell>
                            </TableRow>
                            <TableRow>
                                <TableCell colSpan={2}>
                                    <Collapse in={open[item.idCorte]} timeout="auto" unmountOnExit>
                                        <Box margin={1}>
                                            <Table>
                                                <TableHead>
                                                    <TableRow>
                                                        <TableCell>Folio Guía</TableCell>
                                                        <TableCell>Nombre Persona</TableCell>
                                                        <TableCell>Total</TableCell>
                                                        <TableCell>Tipo Cobro</TableCell>
                                                        <TableCell>Estatus Guía</TableCell>
                                                    </TableRow>
                                                </TableHead>
                                                <TableBody>
                                                    {item.guias.map((guia) => (
                                                        <TableRow key={guia.idGuia}>
                                                            <TableCell>{guia.folioGuia}</TableCell>
                                                            <TableCell>{guia.nombrePersona}</TableCell>
                                                            <TableCell>{guia.total}</TableCell>
                                                            <TableCell>{guia.tipoCobro}</TableCell>
                                                            <TableCell>{guia.estatusGuia}</TableCell>
                                                        </TableRow>
                                                    ))}
                                                </TableBody>
                                            </Table>
                                        </Box>
                                    </Collapse>
                                </TableCell>
                            </TableRow>
                        </React.Fragment>*/
                    ))}
                </TableBody>
            </Table>
        </TableContainer>
    );
};

export default CollapsibleTable;
