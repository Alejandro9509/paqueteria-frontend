import React from 'react';
import { withStyles, makeStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';

const StyledTableCell = withStyles((theme) => ({
    head: {
        backgroundColor: theme.palette.common.black,
        color: theme.palette.common.white,
    },
    body: {
        fontSize: 14,
    },
}))(TableCell);

const StyledTableRow = withStyles((theme) => ({
    root: {
        '&:nth-of-type(odd)': {
            backgroundColor: theme.palette.action.hover,
        },
    },
}))(TableRow);

function createData(title, value) {
    return { title, value};
}

const useStyles = makeStyles({
    table: {
        /*paddingLeft:100,
        marginRight:100*/
    },
});

export default function InformacionEntrega2({entrega, guia}) {
    const classes = useStyles();
    const rows = [
        createData('Folio', guia.m_sFolio),
        createData('Remitente', guia.m_sNombreRemitente),
        createData('Destinatario', guia.m_sNombreDestinatario),
        createData('Dirección de origen', guia.m_bRecoleccionDiferenteDomicilio ? guia.m_sDomicilioDetalleRecoleccion : guia.m_sDomicilioRemitente),
        createData('Dirección de destino', guia.m_bEntregaDiferenteDomicilio ? guia.m_sDomicilioDetalleEntrega : guia.m_sDomicilioDestinatario),
        createData('Ciudad de origen', guia.m_sCiudadOrigen),
        createData('Ciudad de destino', guia.m_sCiudadDestino),
        createData('Tipo de servicio', guia.m_sTipoServicio)
    ];
    const rowsBitacora =[]
    if (guia.m_dFechaRegistro)
        rowsBitacora.push(createData(guia.m_dFechaRegistro,'Se registró la carga' ))
    if (guia.m_dFechaInforme)
        rowsBitacora.push(createData(guia.m_dFechaInforme,'Se agregó la guia a un informe' ))
    if (guia.m_dFechaViaje)
        rowsBitacora.push(createData(guia.m_dFechaViaje,'Viaje generado' ))
    if (guia.m_dFechaSalidaViaje)
        rowsBitacora.push(createData(guia.m_dFechaSalidaViaje,'La carga salió de la surcursal de origen' ))
    if (guia.m_dFechaLlegadaViaje)
        rowsBitacora.push(createData(guia.m_dFechaLlegadaViaje,'La carga llegó de la surcursal de destino' ))
    if (guia.m_dFechaUltimaMilla)
        rowsBitacora.push(createData(guia.m_dFechaUltimaMilla,'Entró en proceso de última milla' ))
    if (guia.m_dtFechaCancelacion)
        rowsBitacora.push(createData(guia.m_dFechaCancelacion,'El transporte de la carga fue cancelado.' ))
    if (guia.m_dtFechaEntrega)
        rowsBitacora.push(createData(guia.m_dFechaEntrega,'Carga entregada.' ))
    if (guia.m_dtFechaOcurre)
        rowsBitacora.push(createData(guia.m_dtFechaOcurre,'Carga entregada en sucursal.' ))
    return (
        <div style={{paddingLeft: '100px', paddingRight: '100px'}}>
            <Table className={classes.table} aria-label="customized table">
                {/*<TableHead>
                    <TableRow>
                        <StyledTableCell style={{ width: 100 }}>title</StyledTableCell>
                        <StyledTableCell style={{ width: 100 }}>value</StyledTableCell>
                    </TableRow>
                </TableHead>*/}
                <TableBody>
                    {rows.map((row) => (
                        <StyledTableRow key={row.title}>
                            <StyledTableCell component="th" scope="row">{row.title}</StyledTableCell>
                            <StyledTableCell >{row.value}</StyledTableCell>
                        </StyledTableRow>
                    ))}
                </TableBody>
            </Table>
            <div style={{marginTop: '100px'}}>
                <h2>Bitácora de avance</h2>
            </div>

            <Table className={classes.table} aria-label="customized table">
                {/*<TableHead>
                    <TableRow>
                        <StyledTableCell style={{ width: 100 }}>title</StyledTableCell>
                        <StyledTableCell style={{ width: 100 }}>value</StyledTableCell>
                    </TableRow>
                </TableHead>*/}
                <TableBody>
                    {rowsBitacora.map((row) => (
                        <StyledTableRow key={row.title}>
                            <StyledTableCell component="th" scope="row">{row.title}</StyledTableCell>
                            <StyledTableCell >{row.value}</StyledTableCell>
                        </StyledTableRow>
                    ))}
                </TableBody>
            </Table>
        </div>

    );
}
