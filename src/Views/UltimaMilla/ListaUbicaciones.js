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
} from "@mui/material";
import {
    actualizarCoordenadasRemitentesDestinatarios,
    obtenerUbicacion
} from "../../Util/Contexts/RemitenteDestinatarioContext";
import {getAddressFormated, showSuccess, validarDerecho} from "../../Util/Util";
import ConfirmarUbicacion from "../../Components/Map/ConfirmarUbicacion";

export default class ListaUbicaciones extends Component {
    constructor(props) {
        super(props);
        this.state = {
            listado: [],
            showConfirmarUbicacion: false,
            titulo: "",
            entregaDD: {
                idPais: '',
                pais: '',
                idEstado: '',
                estado: '',
                idMunicipio: '',
                municipio: '',
                codigoPostal: '',
                zonaOperativa: '',
                domicilio: '',
                detalles: '',
                datosAdicionales: '',
                latitud: '',
                longitud: ''
            },
            destinatario:{
                idDestinatario: '',
                aliasDestinatario: '',
                nombreDestinatario: '',
                RFCDestinatario: '',
                domicilioDestinatario: '',
                calleDestinatario: '',
                numeroIntDestinatario: '0',
                numeroExtDestinatario: '',
                coloniaDestinatario: '',
                estadoDestinatario: '',
                municipioDestinatario: '',
                codigoPostalDestinatario: '',
                correoDestinatario: '',
                telefonoDestinatario: '',
                contactoDestinatario: '',
                destinoDestinatario: null,
                zonaOperativaDestinatario: '',
                zonaTarifaDestinatario: '',
                latitudD: '',
                longitudD: ''
            },
            obtenerDatosDireccion: {
                nombreLugar: '',
                numeroInterior: '',
                numeroExterior: '',
                calle: '',
                colonia: '',
                ciudad: '',
                estado: '',
                pais: '',
                codigoPostal: '',
                direccionCompleta: ''
            }
        }
        this.selectPaquete=this.selectPaquete.bind(this);
        this.mostrarDialogoMapa = this.mostrarDialogoMapa.bind(this)
        this.selectPaquete = this.selectPaquete.bind(this)
        this.selectDatosPaquete = this.selectDatosPaquete.bind(this)
        this.isValidText = this.isValidText.bind(this)
        this.confirmarUbicacion = this.confirmarUbicacion.bind(this)
        this.validarCoordenadas = this.validarCoordenadas.bind(this)
    }

    componentDidMount(){
        this.setState({listado: this.props.paquetes});
    }

    mostrarDialogoMapa = (isVisible) => {
        this.setState({
            showConfirmarUbicacion: isVisible,
            titulo: "entrega"
        });
    }

    isValidText = (data) => {
        return !(data.length === 0 || data == '0')
    }

    validarCoordenadas = (coordenadas) => {
        if (!coordenadas) {
            this.mostrarDialogoMapa(true)
            return false
        }
        return true
    }

    selectDatosPaquete = (paquete) => {
        let entrega = {
            idPais: '',
            pais: '',
            idEstado: '',
            estado: '',
            idMunicipio: '',
            municipio: '',
            codigoPostal: paquete.m_sCodigoPostalDestinatario,
            zonaOperativa: paquete.m_sZona,
            domicilio: paquete.m_sDomicilioDestinatario,
            detalles: "",
            datosAdicionales: paquete.m_sDatosAdicionalesDetalleRecoleccion,
            latitud: '0',
            longitud: '0'
        }
        let destinatario = {
            idDestinatario: paquete.m_nId,
            aliasDestinatario: '',
            nombreDestinatario: paquete.m_sNombreDestinatario,
            RFCDestinatario: paquete.m_sRFCDestinatario,
            domicilioDestinatario: paquete.m_sDomicilioDestinatario,
            calleDestinatario: paquete.m_sCalleDestinatario,
            numeroIntDestinatario: '0',
            numeroExtDestinatario: paquete.m_sNoExtDestinatario,
            coloniaDestinatario: paquete.m_sColoniaDestinatario,
            estadoDestinatario: '',
            municipioDestinatario: '',
            codigoPostalDestinatario: '',
            correoDestinatario: paquete.m_sCorreoDestinatario,
            telefonoDestinatario: paquete.m_sTelefonoDestinatario,
            contactoDestinatario: paquete.m_sContactoDestinatario,
            destinoDestinatario: null,
            zonaOperativaDestinatario: '',
            zonaTarifaDestinatario: paquete.m_sZona,
            latitudD: '0',
            longitudD: '0'
        }
        this.setState({
            entregaDD: entrega,
            destinatario: destinatario,
            obtenerDatosDireccion: {
                nombreLugar: destinatario.nombreDestinatario,
                numeroInterior: '',
                numeroExterior: '',
                calle: entrega.domicilio,
                colonia: '',
                ciudad: entrega.municipio,
                estado: entrega.estado,
                pais: entrega.pais,
                codigoPostal: entrega.codigoPostal,
                direccionCompleta: getAddressFormated(
                    entrega.domicilio,
                    null,
                    null,
                    null,
                    entrega.codigoPostal?.m_sCP,
                    entrega.municipio,
                    entrega.estado,
                    entrega.pais
                )
            }
        });
    }

    selectPaquete = (paquete) =>{
        this.selectDatosPaquete(paquete);
        this.mostrarDialogoMapa(true);
    }

    async confirmarUbicacion (coordenadas, e) {
        if (coordenadas.length === 0 || coordenadas == '0' ) {
            return;
        }
        let paqueteIndex = this.state.listado.findIndex(p => p.m_nId === this.state.destinatario.idDestinatario);
        let paquete = this.state.listado[paqueteIndex];
        let listadoTemporal = this.state.listado;
        this.mostrarDialogoMapa(false);

        await actualizarCoordenadasRemitentesDestinatarios(paquete.m_sRFCDestinatario, paquete.m_sNombreDestinatario, coordenadas.lat, coordenadas.lng, paquete.m_nId).then((respuesta)=>{
            showSuccess(respuesta.data);
            paquete.m_sLatitud = coordenadas.lat;
            paquete.m_sLongitud = coordenadas.lng;
            paquete.actualizado = true;
            listadoTemporal[paqueteIndex] = paquete;
            this.setState({
                showConfirmarUbicacion: false,
                listado: listadoTemporal
            });
        });
    }

    render() {
        return (
            <Dialog open={this.props.open} maxWidth={"lg"} fullWidth>
                <DialogTitle>
                    Guias sin ubicación de entrega
                </DialogTitle>
                <TableContainer className={"j-forms"} style={{height:"300px"}}>

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
                                    Estatus coordenadas
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
                                            <TableCell align="left">{u.actualizado ? "Confirmado" : "Sin confirmar"}</TableCell>
                                            <TableCell>
                                                <Button color="primary" autoFocus onClick={(event) => {
                                                    event.stopPropagation();
                                                    this.selectPaquete(u);
                                                }}>
                                                    Seleccionar
                                                </Button>
                                            </TableCell>
                                        </TableRow>
                                    )
                                })
                            }
                        </TableBody>
                    </Table>
                </TableContainer>
                <DialogActions>
                    <Button onClick={() => this.props.cerrarListadoUbicaciones()} color="secondary">Cerrar</Button>
                    <Button onClick={(e) => this.props.handleAceptar(e, this.state.listado)} color="primary">Aceptar</Button>
                </DialogActions>
                {
                    this.state.showConfirmarUbicacion  &&
                    <ConfirmarUbicacion confirmarUbicacion={this.confirmarUbicacion}
                                        open={this.state.showConfirmarUbicacion}
                                        titulo={this.state.titulo}
                                        remitente={false}
                                        mostrarDialogoMapa={this.mostrarDialogoMapa}
                                        direccion={this.state.obtenerDatosDireccion}
                                        onClose={() => this.state({showConfirmarUbicacion: false})}
                    />
                }
            </Dialog>
        );
    }
}

ListaUbicaciones.propTypes = {};