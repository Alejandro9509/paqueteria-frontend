import React, {Component, useMemo, useRef} from 'react';
import PropTypes from 'prop-types';
import {
    Box,
    Button,
    Checkbox,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    Grid,
    makeStyles, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TableSortLabel,
    TextField,
    Typography
} from "@material-ui/core";
import {MapContainer, Marker, Polyline, Popup, TileLayer, useMapEvents} from "react-leaflet";
import {LocationMarker} from "../../Views/DisplayMapClass";
import {obtenerUbicacion} from "../../Util/Contexts/RemitenteDestinatarioContext";
import L from "leaflet";
import MarkerImage from "../../iconos/Mapa/marker.png";
import SearchIcon from "@material-ui/icons/Search";
import {
    searchLocationAddress,
    searchAdressWithCoordinates,
    searchLocationGuia,
    searchLocationGuiav2
} from "../../Util/Contexts/UltimaMillaContext";
import IconButton from '@material-ui/core/IconButton';
import CloseIcon from '@material-ui/icons/Close';
import {getAddressFormated} from "../../Util/Util";

export default class ListaUbicaciones extends Component {
    constructor(props) {
        super(props);
        this.state = {
            listado: []
        }
    }

    componentDidMount(){
    }

    render() {
        return (
            <Dialog open={this.props.open} maxWidth={"lg"} fullWidth>
                <TableContainer className={"j-forms"} style={{height:"300px"}}>
                    <Typography variant={"h4"}>Guias sin ubicación de entrega </Typography>
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell padding="checkbox">
                                    <Checkbox
                                        indeterminate={this.props.paquetesSeleccionadas.length > 0 && this.props.paquetesSeleccionadas.length < this.state.paquetes.length}
                                        checked={this.state.paquetes.length > 0 && this.props.paquetesSeleccionadas.length === this.state.paquetes.length}
                                        onChange={this.handleSelectAllClickevent}
                                        inputProps={{'aria-label': 'select all desserts'}}
                                    />
                                </TableCell>
                                <TableCell
                                    sortDirection={this.state.orderBy === "m_sFolio" ? this.state.order : false}
                                    align="left">
                                    <TableSortLabel
                                        active={this.state.orderBy === "m_sFolio"}
                                        direction={this.state.orderBy === "m_sFolio" ? this.state.order : 'asc'}
                                        onClick={(event) => this.createSortHandler("m_sFolio", event)}
                                    >
                                        Folio
                                    </TableSortLabel>
                                </TableCell>
                                <TableCell
                                    sortDirection={this.state.orderBy === "m_sDomicilioDestinatario" ? this.state.order : false}
                                    align="left">Tipo</TableCell>
                                <TableCell
                                    sortDirection={this.state.orderBy === "m_sTipoCobro" ? this.state.order : false}
                                    align="left">Tipo de cobro</TableCell>
                                <TableCell
                                    sortDirection={this.state.orderBy === "m_sZona" ? this.state.order : false}
                                    align="left">Zona</TableCell>
                                <TableCell
                                    sortDirection={this.state.orderBy === "m_sTipoCobro" ? this.state.order : false}
                                    align="left">Cliente</TableCell>
                                <TableCell
                                    sortDirection={this.state.orderBy === "m_bClienteBloqueado" ? this.state.order : false}
                                    align="left">Estatus cliente</TableCell>
                                <TableCell
                                    sortDirection={this.state.orderBy === "m_sNombreDestinatario" ? this.state.order : false}
                                    align="left">Domicilio</TableCell>
                                <TableCell
                                    sortDirection={this.state.orderBy === "m_sNombreOperador" ? this.state.order : false}
                                    align="left">Ventana de entrega</TableCell>
                                <TableCell sortDirection={this.state.orderBy === "m_dFechaRegistro" ? this.state.order : false}
                                           align="left">Fecha</TableCell>
                                <TableCell
                                    sortDirection={this.state.orderBy === "m_sEstatusGuia" ? this.state.order : false}
                                    align="left">Estatus</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {
                                this.listado.map((u, index) => {
                                    const labelId = `enhanced-table-checkbox-${index}`;
                                    return (
                                        <TableRow>
                                            <TableCell padding="checkbox">
                                                <Checkbox
                                                    disabled={u.m_bClienteBloqueado}
                                                    onClick={(event) => this.handleClick(event, u)}
                                                    inputProps={{'aria-labelledby': labelId}}
                                                />
                                            </TableCell>
                                            <TableCell align="left">{u.m_sFolio}</TableCell>
                                            <TableCell align="left">{u.m_bEsRecoleccion ? "Recolección" : "Entrega"}</TableCell>
                                            <TableCell align="left">{u.m_sTipoCobro}</TableCell>
                                            <TableCell align="left">{u.m_sZona}</TableCell>
                                            <TableCell align="left">{u.m_bEsRecoleccion ? u.m_sNombreRemitente : u.m_sNombreDestinatario}</TableCell>
                                            <TableCell style={{color: u.m_bClienteBloqueado ? "red": "black"}}
                                                       align="left">{u.m_bClienteBloqueado ? "Bloqueado" : "Activo"}</TableCell>
                                            <TableCell align="left">{u.m_bEsRecoleccion ? u.m_sDomicilioRemitente: u.m_sDomicilioDestinatario}</TableCell>
                                            <TableCell align="left">{u.m_bEsRecoleccion ? (u.m_bRecoleccionConCita ? (u.m_bCitaPendiente ? "Cita pendiente" : (u.m_sFechaRecoleccionCita + " " + u.m_sHoraCitarRecoleccionMinima + " a " + u.m_sHoraCitaRecoleccionMaxima)) : "Sin cita") : u.m_bEmbarqueConCita ? u.m_bCitaPendiente ? "Cita pendiente" : (u.m_sFechaEmbarqueCita + " " + u.m_sHoraEmbarqueCitaMinima + " a " + u.m_sHoraEmbarqueCitaMaxima) : "Sin Cita"}</TableCell>
                                            <TableCell align="left">{u.m_dFechaRegistro}</TableCell>
                                            <TableCell align="left">{u.m_sEstatusUltimaMilla}</TableCell>
                                        </TableRow>
                                    )
                                })
                            }
                        </TableBody>
                    </Table>
                </TableContainer>
            </Dialog>
        );
    }
}

ListaUbicaciones.propTypes = {};