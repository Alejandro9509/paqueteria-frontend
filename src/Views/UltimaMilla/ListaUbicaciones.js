import React, {Component, useMemo, useRef} from 'react';
import PropTypes from 'prop-types';
import {
    Box,
    Button,
    Checkbox, Chip,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    Grid,
    makeStyles, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TableSortLabel,
    TextField, Tooltip,
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
import {getAddressFormated, validarDerecho} from "../../Util/Util";
import {confirmAlert} from "react-confirm-alert";
import SvgIcon from "@material-ui/core/SvgIcon";

export default class ListaUbicaciones extends Component {
    constructor(props) {
        super(props);
        this.state = {
            listado: []
        }
    }

    componentDidMount(){
        this.setState({listado: this.props.paquetes});
    }

    render() {
        return (
            <Dialog open={this.props.open} maxWidth={"lg"} fullWidth>
                <TableContainer className={"j-forms"} style={{height:"300px"}}>
                    <Typography variant={"h4"}>Guias sin ubicación de entrega </Typography>
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell sortDirection={this.state.orderBy === "m_sFolio" ? this.state.order : false} align="left">
                                    <TableSortLabel
                                        active={this.state.orderBy === "m_sFolio"}
                                        direction={this.state.orderBy === "m_sFolio" ? this.state.order : 'asc'}
                                        onClick={(event) => this.createSortHandler("m_sFolio", event)}>
                                        Folio
                                    </TableSortLabel>
                                </TableCell>
                                <TableCell sortDirection={this.state.orderBy === "m_sZona" ? this.state.order : false} align="left">
                                    Zona
                                </TableCell>
                                <TableCell sortDirection={this.state.orderBy === "m_sNombreDestinatario" ? this.state.order : false} align="left">
                                    Cliente
                                </TableCell>
                                <TableCell sortDirection={this.state.orderBy === "m_sDomicilioDestinatario" ? this.state.order : false} align="left">
                                    Domicilio
                                </TableCell>
                                <TableCell sortDirection={this.state.orderBy === "m_dFechaRegistro" ? this.state.order : false} align="left">
                                    Fecha
                                </TableCell>
                                <TableCell sortDirection={this.state.orderBy === "m_sEstatusUltimaMilla" ? this.state.order : false} align="left">
                                    Estatus
                                </TableCell>
                                <TableCell align="left">
                                    Seleccionar
                                </TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {
                                this.props.paquetes.map((u, index) => {
                                    return (
                                        <TableRow>
                                            <TableCell align="left">{u.m_sFolio}</TableCell>
                                            <TableCell align="left">{u.m_sZona}</TableCell>
                                            <TableCell align="left">{u.m_sNombreDestinatario}</TableCell>
                                            <TableCell align="left">{u.m_sDomicilioDestinatario}</TableCell>
                                            <TableCell align="left">{u.m_dFechaRegistro}</TableCell>
                                            <TableCell align="left">{u.m_sEstatusUltimaMilla}</TableCell>
                                            <TableCell>
                                                <button className="btn btn-default" onClick={this.props.selectPaquete(u)}>
                                                    Seleccionar
                                                </button>
                                            </TableCell>
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