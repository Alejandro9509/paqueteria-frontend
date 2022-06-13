import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {
    Box,
    Button,
    Collapse,
    Divider,
    Grid,
    IconButton,
    InputAdornment,
    List,
    ListItem,
    ListItemText, Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
    TextField, ButtonGroup, Popover, Fade, Dialog, DialogContent, DialogTitle, DialogActions,
    Typography, Tooltip, Popper, Paper, FormControl, InputLabel, Select, Chip
} from "@material-ui/core";
import {confirmAlert} from 'react-confirm-alert'; // Import
import DescriptionIcon from '@material-ui/icons/Description';
import GpsFixedIcon from '@material-ui/icons/GpsFixed';
import 'react-confirm-alert/src/react-confirm-alert.css'; // Import css
import DeleteIcon from '@material-ui/icons/Delete';
import ReorderIcon from '@material-ui/icons/Reorder';
import CachedIcon from '@material-ui/icons/Cached';
import {ReactComponent as ParadasIcono} from "../../iconos/Mapa/paradas.svg";
import CloseIcon from "@material-ui/icons/Close";
import SearchIcon from "@material-ui/icons/Search";
import {ReactComponent as UnidadesIcon} from "../../iconos/Catalogos/Icono Unidades/icono_unidades.svg";
import {PieChart} from 'react-minimal-pie-chart';
import BlockIcon from '@material-ui/icons/Block';
import RemplazarPaqueteUltimaMilla from "./RemplazarPaqueteUltimaMilla";
import PaquetesParcialesGuia from './PaquetesParcialesGuia';
import AgregarPaqueteUltimaMilla from "./AgregarPaqueteUltimaMilla";
import PaquetesList from "./PaquetesList";
import GetAppIcon from '@material-ui/icons/GetApp';
import DepartureBoardIcon from '@material-ui/icons/DepartureBoard';

import {
    actualizarCoordenadasGuia,
    obtenerGuiaUltimaMilla
} from "../../Util/Contexts/GuiaContext";
import {
    cancelarRuta,
    eliminarPaqueteUltimaMilla,
    obtenerCFDI,
    obtenerReporteCFDIGuia,
    obtenerReporteCFDIRecoleccion,
    obtenerUltimaMillaReporte, obtenerXMLCFDI, obtenerXMLPermisionario,
    ordenarParada,
    remplazarPaqueteUltimaMilla
} from "../../Util/Contexts/UltimaMillaContext";
import Noty from "noty";
import {InsertDriveFile} from "@material-ui/icons";
import ConfirmarUbicacion from "../../Components/Map/ConfirmarUbicacion";
import {actualizarCoordenadasRecoleccion} from "../../Util/Contexts/RecoleccionContext";
import PictureAsPdfIcon from '@material-ui/icons/PictureAsPdf';
import CancelIcon from '@material-ui/icons/Cancel';
import {ReactComponent as EmbarqueIcon} from "../../iconos/Menu/IconoEmbarque/iconoEmbarque.svg";
import CancelarSAT from "../SAT/CancelarSAT";
import {
    cancelarInformeCFDI,
    cancelarUltimaMillaCFDI,
    enviarCorreoCFDIUltimaMilla,
    enviarCorreoCFDIViaje
} from "../../Util/Contexts/SATContext";
import EnvioCorreoDialogo from "../SAT/EnvioCorreoDialogo";
import {validarDerecho} from "../../Util/Util";

function showError(mensaje) {
    new Noty({
        type: "warning",
        layout: "topCenter",
        text: mensaje,
        timeout: "8000"
    }).show()
}
function showSuccess(mensaje) {
    new Noty({
        type: "information",
        layout: "topCenter",
        text: mensaje,
        timeout: "3000"
    }).show()
}

class DetalleParadas extends Component {
    constructor(props) {
        super(props);
        this.state = {
            openDetail: false,
            repartidoresFiltrados: this.props.tour.m_arrClsParadaUltimaMilla,
            newMessageText: "",
            paradas: [],
            paquetes: [],
            anchorEl: null,
            placement: null,
            open: false,
            tour: null,
            openRemplazar: false,
            openParciales: false,
            openAgregar: false,

        }
        this.searchRepartidor = this.searchRepartidor.bind(this)
        this.openDetail = this.openDetail.bind(this)
        this.openRemplazarPaquete = this.openRemplazarPaquete.bind(this)
        this.openPaquetesParciales = this.openPaquetesParciales.bind(this)
        this.onSubmitRemplazarPaquete = this.onSubmitRemplazarPaquete.bind(this)
        this.onSubmitOrdenarPaquetes = this.onSubmitOrdenarPaquetes.bind(this)
        this.onSubmitBorrarPaquete = this.onSubmitBorrarPaquete.bind(this)
        this.confirmDeleteParada = this.confirmDeleteParada.bind(this)
        this.confirmUbicacionParada = this.confirmUbicacionParada.bind(this)
        this.confirmarUbicacion = this.confirmarUbicacion.bind(this)
        this.generarCFDI = this.generarCFDI.bind(this)
        this.showCancelarCFDI = this.showCancelarCFDI.bind(this)
        this.cancelarCFDI = this.cancelarCFDI.bind(this)
        this.envioCorreoAction = this.envioCorreoAction.bind(this)

    }


    componentDidUpdate(prevProps, prevState, snapshot) {
        if (this.props.tour.m_nIdUltimaMilla !== prevProps.tour.m_nIdUltimaMilla || this.props.tour.m_arrClsParadaUltimaMilla.reduce((a, b) => +a + b.m_arrClsProGuia.reduce((c, d) => +c + d.m_nEstatusUlimaMilla, 0), 0) !== prevProps.tour.m_arrClsParadaUltimaMilla.reduce((a, b) => +a + b.m_arrClsProGuia.reduce((c, d) => +c + d.m_nEstatusUlimaMilla, 0), 0) ||  this.props.tour.m_arrClsParadaUltimaMilla.reduce((a, b) => +a + (b.m_bActivo ? 1 : 0), 0) !== prevProps.tour.m_arrClsParadaUltimaMilla.reduce((a, b) => +a + (b.m_bActivo ? 1 : 0), 0) || this.props.tour.m_arrClsParadaUltimaMilla.reduce((a, b) => +a + b.m_arrClsProGuia.reduce((c, d) => +c + (d.m_bTimbrado ? 1: 0), 0), 0) !== prevProps.tour.m_arrClsParadaUltimaMilla.reduce((a, b) => +a + b.m_arrClsProGuia.reduce((c, d) => +c + (d.m_bTimbrado ? 1 : 0), 0), 0)) {
            this.setState({repartidoresFiltrados: this.props.tour.m_arrClsParadaUltimaMilla})
        }

        if(this.props.closeResumenParadas!=prevProps.closeResumenParadas){//Cierra todas las ventanas
            this.setState({
                openDetail: false
            })
           }
    }

    searchRepartidor(event) {
        event.stopPropagation()
        event.preventDefault()
        if (this.state.searchText === "") {
            this.setState({repartidoresFiltrados: this.props.tour.m_arrClsParadaUltimaMilla})
        } else {
            this.setState({repartidoresFiltrados: this.props.tour.m_arrClsParadaUltimaMilla.filter(u => u.m_sNombreOperador.toLowerCase().includes(this.state.searchText.toLowerCase()))})
        }

    }

    openDetail(index) {
        this.setState({indexOpen: index === this.state.indexOpen ? -1 : index})

    }

    openRemplazarPaquete(tour, paquete) {
        obtenerGuiaUltimaMilla(this.props.filtros.zonasSeleccionada, parseInt(this.props.filtros.tipoBusqueda)).then(({data}) => {
            this.setState({paquetes: data, openRemplazar: true, tour: tour, paqueteSeleccionado: paquete})
        })
    }

    openPaquetesParciales(tour, paquete) {
            this.setState({openParciales: true, tour: tour, paqueteSeleccionado: paquete})
    }

    confirmDeleteParada(idParada, idGuia, esRecoleccion) {
        confirmAlert({
            title: 'Confirmación',
            message: '¿Está segura(o) que desea eliminar la parada?',
            buttons: [
                {
                    label: 'Sí',
                    onClick: () => this.onSubmitBorrarPaquete(idParada, idGuia, esRecoleccion)
                },
                {
                    label: 'No'
                }
            ]
        });
    }
    obtenerXMLCFDITimbrado(xml, folio){
        var filename = folio+".xml";
        var pom = document.createElement('a');
        var bb = new Blob([xml], {type: 'text/plain'});
        pom.setAttribute('href', window.URL.createObjectURL(bb));
        pom.setAttribute('download', filename);

        pom.dataset.downloadurl = ['text/plain', pom.download, pom.href].join(':');
        pom.draggable = true;
        pom.classList.add('dragout');

        pom.click();
    }
    descargarXMLCFDI(id,esRecoleccion, folio) {
        obtenerXMLCFDI(id,esRecoleccion, this.props.filtros.idSucursal).then(({data}) => {
            var filename = folio+".xml";
            var pom = document.createElement('a');
            var bb = new Blob([data], {type: 'text/plain'});
            pom.setAttribute('href', window.URL.createObjectURL(bb));
            pom.setAttribute('download', filename);

            pom.dataset.downloadurl = ['text/plain', pom.download, pom.href].join(':');
            pom.draggable = true;
            pom.classList.add('dragout');

            pom.click();
        }).catch((error) => {
            if (error.response){
                showError(error.response.data)
            }
        })
    }
    descargarXMLCFDIPermisionario(id,esRecoleccion, folio) {
        obtenerXMLPermisionario(id,esRecoleccion, this.props.filtros.idSucursal).then(({data}) => {
            var filename = folio+".xml";
            var pom = document.createElement('a');
            var bb = new Blob([data], {type: 'text/plain'});
            pom.setAttribute('href', window.URL.createObjectURL(bb));
            pom.setAttribute('download', filename);

            pom.dataset.downloadurl = ['text/plain', pom.download, pom.href].join(':');
            pom.draggable = true;
            pom.classList.add('dragout');

            pom.click();
        }).catch((error) => {
            if (error.response){
                showError(error.response.data)
            }
        })
    }
    obtenerPDFCFDI(id,esRecoleccion, folio){
            if (esRecoleccion){
                obtenerReporteCFDIRecoleccion(id).then(({data}) => {
                    console.log(data)
                    let pdfWindow = window.open("");
                    pdfWindow.document.write("<embed  width='100%' height='100%' src='data:application/pdf;base64, " + encodeURI(data) + "'/>");
                    pdfWindow.document.body.style.margin = "0px";
                    pdfWindow.document.title = "CFDI_ " + folio;
                })
            }else{
                obtenerReporteCFDIGuia(id).then(({data}) => {
                    let pdfWindow = window.open("");
                    pdfWindow.document.write("<embed  width='100%' height='100%' src='data:application/pdf;base64, " + encodeURI(data) + "'/>");
                    pdfWindow.document.body.style.margin = "0px";
                    pdfWindow.document.title = "CFDI_ " + folio;
                })
            }
    }
    generarCFDI(id,esRecoleccion, folio) {
        confirmAlert({
            title: 'Confirmar Timbrado',
            message: '¿Está seguro de realizar esta operación, el CFDI de traslado se timbrará ante el SAT?',
            buttons: [
                {
                    label: 'Sí',
                    onClick: () => {

                        obtenerCFDI(id,esRecoleccion, this.props.filtros.idSucursal).then((result) => {
                            this.setState({idParada: id, esRecoleccion: esRecoleccion, openEnvioCorreo: true, folio: folio})
                        }).catch((error) => {
                            if (error.response){
                                showError(error.response.data)
                            }
                        })
                    }
                },
                {
                    label: 'No',
                }
            ]
        })


    }
    confirmUbicacionParada(id,esRecoleccion, data) {

        const domicilioRecoleccion = data.m_bRecoleccionDiferenteDomicilio ? data.m_sDomicilioDetalleRecoleccion : data.m_sDomicilioRemitente
        const domicilioEntrega = data.m_bEntregaDiferenteDomicilio ? data.m_sDomicilioDetalleEntrega : data.m_sDomicilioDestinatario

        const direccion = esRecoleccion ?
            {
                idGuia: id,
                nombreRemitente: data.m_sNombreRemitente,
                municipioTexto: data.m_bRecoleccionDiferenteDomicilio ? '': '',
                calleRemitente: data.m_bRecoleccionDiferenteDomicilio ? '': data.m_sCalleRemitente,
                coloniaRemitente: data.m_bRecoleccionDiferenteDomicilio ? '': data.m_sColoniaRemitente,
                numeroIntRemitente: data.m_bRecoleccionDiferenteDomicilio ? '': '',
                codigoPostalRemitente: data.m_bRecoleccionDiferenteDomicilio ? {m_sCP: ''}: {m_sCP: data.m_sCodigoPostalRemitente},
                domicilioRemitente: domicilioRecoleccion,
            }
            :
            {
                idGuia: id,
                nombreDestinatario: data.m_sNombreDestinatario,
                municipioTexto: data.m_bEntregaDiferenteDomicilio ? '' : '',
                calleDestinatario: data.m_bEntregaDiferenteDomicilio ? '' : data.m_sCalleDestinatario,
                coloniaDestinatario: data.m_bEntregaDiferenteDomicilio ? '' : data.m_sColoniaDestinatario,
                numeroIntDestinatario: data.m_bEntregaDiferenteDomicilio ? '' : '',
                codigoPostalDestinatario: data.m_bEntregaDiferenteDomicilio ? {m_sCP: ''} : {m_sCP: data.m_sCodigoPostalDestinatario},
                domicilioDestinatario: domicilioEntrega,
            }
       this.setState({
           titulo: 'parada',
           showConfirmarUbicacion: true,
           direccion: direccion,
           lat: parseFloat(data.m_sLatitud),
           lng: parseFloat(data.m_sLongitud),
           recoleccion: esRecoleccion,

       })
    }

    onSubmitBorrarPaquete(idParada, idGuia, esRecoleccion) {
        eliminarPaqueteUltimaMilla(idParada, idGuia, esRecoleccion).then(({data}) => {
            showSuccess(data)
            this.props.refresh()
        })
    }

    onSubmitOrdenarPaquetes(paquetes) {
        ordenarParada(this.state.tour.m_nIdParadaUltimaMilla, paquetes).then(({data}) => {
            showSuccess("Parada Actualizada")
            this.setState({openAgregar: false})
            this.props.refresh()
        })
    }

    onSubmitRemplazarPaquete(paqueteNuevo) {
        remplazarPaqueteUltimaMilla(this.state.tour.m_nIdParadaUltimaMilla, this.state.paqueteSeleccionado, paqueteNuevo[0]).then(({data}) => {
            showSuccess("Parada Actualizada")
            this.setState({openRemplazar: false})
            this.props.refresh()
        })
    }

    confirmarUbicacion(coordenadas,e,idGuia, esRecoleccion) {
        if (esRecoleccion){
            actualizarCoordenadasRecoleccion(idGuia,coordenadas.lat,coordenadas.lng).then((respuesta) => {
                showSuccess(respuesta.data)
                this.props.refresh()
            })
        }else{
            actualizarCoordenadasGuia(idGuia,coordenadas.lat,coordenadas.lng).then((respuesta) => {
                showSuccess(respuesta.data)
                this.props.refresh()
            })
        }
        this.setState({
            showConfirmarUbicacion: false,
        })

    }

    showCancelarCFDI(paquete){
        this.setState({openCancelarSAT: true, paqueteSeleccionado: paquete})
    }

    cancelarCFDI( data) {
        confirmAlert({
            title: 'Confirmar Cancelación',
            message: '¿Está seguro de realizar la cancelación ante el SAT?',
            buttons: [
                {
                    label: 'Sí',
                    onClick: () => {
                        cancelarUltimaMillaCFDI(this.state.paqueteSeleccionado.m_nId,data.idCancelacionSAT,data.motivoSAT,data.motivoCancelacion,data.folioRelacionado,this.state.paqueteSeleccionado.m_bEsRecoleccion).then((result) => {
                            // showSuccess(result.data)
                            showSuccess("Se canceló ante el SAT con éxito.")
                            this.props.refresh()
                        }).catch((error) => {
                            if (error.response){
                                showError(error.response.data)
                            }
                        })
                    }
                },
                {
                    label: 'No',
                }
            ]
        })


    }
    generarReporte(e, id) {
        e.preventDefault()
        console.log(' id: ' + id)
        obtenerUltimaMillaReporte(id).then(({data}) => {
            // console.log(data)
            // debugger
            let pdfWindow = window.open("");
            pdfWindow.document.write("<embed  width='100%' height='100%' src='data:application/pdf;base64, " + encodeURI(data) + "'/>");
            pdfWindow.document.body.style.margin = "0px";
            pdfWindow.document.title = "Última Milla";
        })
    }
    validarRutasCompletadas(tour){
        return tour.m_arrClsProGuia.some(g=> g.m_sEstatusUltimaMilla == "Completado")
    }
    cancelarRutaAccion(e, id) {
        e.preventDefault()
        e.stopPropagation()
        confirmAlert({
            title: 'Confirmación',
            message: '¿Está segura(o) que desea cancelar la ruta?',
            buttons: [
                {
                    label: 'Sí',
                    onClick: async () =>  cancelarRuta(id).then(({data}) => {
                        showSuccess(data)
                        this.props.refresh()
                    })
                },
                {
                    label: 'No'
                }
            ]
        });

    }

    envioCorreoAction(data){
        enviarCorreoCFDIUltimaMilla(this.state.idParada, data.correos,data.correoDefault,this.state.esRecoleccion).then(({data}) => {
            showSuccess(data);
            this.obtenerPDFCFDI(this.state.idParada,this.state.esRecoleccion,this.state.folio)
            this.setState({ openEnvioCorreo: false})
            this.props.refresh()
        })
    }

    validarPaquetes(paquetes){
        return this.stableSort(this.state.paquetes, this.getComparator("asc", "m_sDescripcion")).map((u, index) =>{  
            u.isItemSelected = this.props.paquetesSeleccionadas.find(a => a.m_nId === u.m_nId) != null;
            return u})
    }

    stableSort(array, comparator) {
        const stabilizedThis = array.map((el, index) => [el, index]);
        stabilizedThis.sort((a, b) => {
            const order = comparator(a[0], b[0]);
            if (order !== 0) return order;
            return a[1] - b[1];
        });
        return stabilizedThis.map((el) => el[0]);
    }

    getComparator(order, orderBy) {
        return order === 'desc'
            ? (a, b) => this.descendingComparator(a, b, orderBy)
            : (a, b) => -this.descendingComparator(a, b, orderBy);
    }
    render() {
        var d = new Date();
        d.setHours(0,0,0,0);
        const todasParadas = this.props.tour.m_arrClsParadaUltimaMilla.filter(t => t.m_bActiva)
        const totalPaquetes = todasParadas.length === 0 ? 0 : todasParadas.map(a => a.m_arrClsProGuia.length).reduce((a, b) => a + b)
        const allGuias = [].concat(...this.props.tour.m_arrClsParadaUltimaMilla.filter(t => t.m_bActiva).map(a => a.m_arrClsProGuia)) || []
        return (
            <div>
                {
                    this.state.openEnvioCorreo &&
                    <EnvioCorreoDialogo onSubmit={this.envioCorreoAction} open={this.state.openEnvioCorreo} close={()=> {this.props.refresh();this.obtenerPDFCFDI(this.state.idParada,this.state.esRecoleccion,this.state.folio);this.setState({openEnvioCorreo:false});}}/>
                }
                {this.state.openCancelarSAT &&
                    <CancelarSAT open={this.state.openCancelarSAT} onSubmit={this.cancelarCFDI} data={{folioSustituye: this.state.paqueteSeleccionado.m_sFolioFiscalUUID,m_sFolio: this.state.paqueteSeleccionado.m_sFolio, folioCancelar: this.state.paqueteSeleccionado.m_sFolioFiscalUUIDSustituido || this.state.paqueteSeleccionado.m_sFolioFiscalUUID
                    }} close={() => this.setState({openCancelarSAT: false})}/>
                }
                {
                    this.state.showConfirmarUbicacion &&
                    <ConfirmarUbicacion confirmarUbicacion={this.confirmarUbicacion} open={this.state.showConfirmarUbicacion}
                                        titulo={this.state.titulo}
                                        remitente={this.state.recoleccion}
                                        ultimaMilla={true}
                                        lat={this.state.lat}
                                        lng={this.state.lng}
                                        mostrarDialogoMapa={(value) => this.setState({showConfirmarUbicacion: value})}
                                        direccion={this.state.direccion}>
                    </ConfirmarUbicacion>
                }
                {
                    this.state.openAgregar &&
                    <AgregarPaqueteUltimaMilla zonasIds={this.props.filtros.zonasSeleccionada}
                                               tour={this.state.tour}
                                               onSubmit={this.onSubmitOrdenarPaquetes}
                                               tipoServicio={parseInt(this.props.filtros.tipoBusqueda)}
                                               close={() => this.setState({openAgregar: false})}
                                               open={this.state.openAgregar} paquetes={this.state.paquetes}/>
                }
                {
                    this.state.openRemplazar &&
                    <RemplazarPaqueteUltimaMilla open={this.state.openRemplazar} multiples={false}
                                                 onSubmit={this.onSubmitRemplazarPaquete}
                                                 close={() => this.setState({openRemplazar: false})}
                                                 data={this.state.paquetes.filter(i => i.m_sFolio !== this.state.paqueteSeleccionado.m_sFolio)}/>

                }


                {this.state.openParciales &&
                <PaquetesParcialesGuia open={this.state.openParciales} multiples={false}
                                             tour={this.state.tour}
                                             guia={this.state.paqueteSeleccionado}
                                             close={() => this.setState({openParciales: false})}
                                             data={this.state.paquetes} />
                }
                {
                    !this.state.openDetail &&
                    <IconButton
                        onClick={(e) => { this.setState({openDetail: true}); 
                        this.props.changeFiltersMapDialogsState(e)} }
                        style={{
                            color: "white",
                            borderRadius: "10px",
                            width: "30px",
                            height: "30px",
                            backgroundColor: "#29B08A",
                            top: "190px",
                            right: "10px",
                            padding: "4px",
                            position: "fixed",
                            zIndex: 3000,
                            boxShadow: "0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19)"
                        }}>
                        <ParadasIcono style={{fill: "white"}}/>
                    </IconButton>
                }

                {
                    this.state.openDetail &&
                    <div
                        style={{
                            color: "black",
                            borderRadius: "10px",
                            width: "600px",
                            pointerEvents: "auto",
                            height: window.innerHeight - 100,
                            backgroundColor: "white",
                            overflow: "auto",
                            top: "80px",
                            right: "10px",
                            position: "fixed",
                            zIndex: 3001,
                            boxShadow: "0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19)"
                        }}>
                        <div style={{
                            backgroundColor: "#29B08A",
                            width: "100%",
                            height: "30px",
                            color: "white",
                            display: "inline-block"
                        }}>
                            <ParadasIcono style={{
                                verticalAlign: "middle",
                                marginLeft: "5px",
                                marginRight: "5px",
                                padding: "5px",
                                height: "30px",
                                fill: "white"
                            }}/>
                            Resumen de Paradas
                            <div style={{float: "right"}}>
                                <IconButton
                                    style={{height: "30px"}}
                                    onClick={(e) => {this.setState({openDetail: false})
                                    this.props.changeFiltersMapDialogsState(e)}}
                                >
                                    <CloseIcon style={{fill: "white"}}/>
                                </IconButton>
                            </div>
                        </div>
                        <Grid container spacing={1}>
                            <Grid item md={6} sm={12}>
                                <div style={{height: "150px", padding: "10px 0 10px 0"}}>
                                    <PieChart
                                        label={({dataEntry}) => `${allGuias.length} \n Paradas`}
                                        lineWidth={20}
                                        totalValue={allGuias.length}
                                        labelStyle={{
                                            fontSize: '10px',
                                            textAlign: "center",
                                            fill: 'black',
                                        }}
                                        labelPosition={0}
                                        data={[
                                            {
                                                title: '',
                                                value: allGuias.filter(g => g.m_nEstatusUlimaMilla === 4).length,
                                                color: '#F51533'
                                            },
                                            {
                                                title: '',
                                                value: allGuias.filter(g => g.m_nEstatusUlimaMilla === 3).length,
                                                color: '#06B100'
                                            },
                                            {
                                                title: '',
                                                value: allGuias.filter(g => g.m_nEstatusUlimaMilla !== 3 && g.m_nEstatusUlimaMilla !== 4).length,
                                                color: '#F5E23E'
                                            },
                                        ]}
                                    />
                                </div>

                            </Grid>
                            <Grid item md={6} sm={12}>
                                <Grid container spacing={1} justify={"space-between"}
                                      style={{paddingTop: "10px", paddingRight: "10px", height: "100%"}}>
                                    <Grid item sm={12}>
                                        <div style={{
                                            backgroundColor: "#F5E23E",
                                            display: "inline-block",
                                            width: "100%",
                                            textAlign: "center"
                                        }}>
                                            <strong>Pendientes </strong> {allGuias.filter(g => g.m_nEstatusUlimaMilla !== 3 && g.m_nEstatusUlimaMilla !== 4).length} de {totalPaquetes}
                                            <strong> {parseInt((allGuias.filter(g => g.m_nEstatusUlimaMilla !== 3 && g.m_nEstatusUlimaMilla !== 4).length / totalPaquetes) * 100) || 0 }%</strong>
                                        </div>
                                    </Grid>
                                    <Grid item sm={12}>
                                        <div style={{
                                            backgroundColor: "#06B100",
                                            display: "inline-block",
                                            width: "100%",
                                            textAlign: "center"
                                        }}>
                                            <strong>Exitosas </strong> {allGuias.filter(g => g.m_nEstatusUlimaMilla === 3).length} de {totalPaquetes}
                                            <strong> {parseInt((allGuias.filter(g => g.m_nEstatusUlimaMilla === 3).length / totalPaquetes) * 100) || 0}%</strong>
                                        </div>
                                    </Grid>
                                    <Grid item sm={12}>
                                        <div style={{
                                            backgroundColor: "#F51533",
                                            display: "inline-block",
                                            width: "100%",
                                            textAlign: "center"
                                        }}>
                                            <strong>Fallidas </strong> {allGuias.filter(g => g.m_nEstatusUlimaMilla === 4).length} de {totalPaquetes}
                                            <strong> {parseInt((allGuias.filter(g => g.m_nEstatusUlimaMilla === 4).length / totalPaquetes) * 100) || 0}%</strong>
                                        </div>
                                    </Grid>
                                </Grid>
                            </Grid>
                        </Grid>
                        <TextField variant="outlined" size={"small"} placeholder={"Buscar repartidor, unidad"}
                                   style={{padding: "10px"}}
                                   value={this.state.searchText}
                                   onChange={(e) => this.setState({searchText: e.target.value})}
                                   InputProps={{
                                       endAdornment: (
                                           <InputAdornment position="end">
                                               <SearchIcon fontSize={"large"}
                                                           style={{fill: "#868686", cursor: "pointer"}}
                                                           onClick={this.searchRepartidor}/>
                                           </InputAdornment>
                                       ),
                                   }}
                        />
                        <div style={{width: "100%", height: "30px", color: "black"}}>
                            <List style={{overflow: "auto"}}>
                                {
                                    this.state.repartidoresFiltrados.map((r, index) => {
                                        var tour = r
                                        var color = tour.color
                                        return (
                                            <div key={r.m_sNombreOperador}>
                                                <ListItem button
                                                          onClick={(e) => {
                                                              e.stopPropagation();
                                                              this.openDetail(index)
                                                          }}>
                                                    <ListItemText primary={
                                                        <Grid container spacing={1} style={{width:"100%"}} alignItems={"center"}
                                                              justify={"space-between"}>
                                                            <Grid item sm={5}>
                                                                <Typography color={tour.m_bActiva ? "inherit" : "textSecondary"} align={"left"}>{r.m_snNombreOperador}</Typography>
                                                            </Grid>
                                                            <Grid item sm={2}>

                                                                <Typography color={tour.m_bActiva ? "inherit" : "textSecondary"} style={{display:"flex", alignItems:"center"}}><UnidadesIcon
                                                                    style={{
                                                                        fill: color,
                                                                        paddingTop: "2px",
                                                                        paddingRight: "4px",
                                                                        paddingBottom: "2px",
                                                                        width: "20px",
                                                                        verticalAlign: "middle",display:"flex"
                                                                    }}/>
                                                                    {r.m_sPlacasUnidad}
                                                                </Typography>

                                                            </Grid>
                                                            <Grid item sm={2}>
                                                                <Typography color={tour.m_bActiva ? "inherit" : "textSecondary"} >{tour.m_arrClsProGuia.length} Paradas</Typography>

                                                            </Grid>
                                                            <Grid item sm={1}
                                                            >
                                                                <IconButton aria-label="file" onClick={(e) => this.generarReporte(e,tour.m_nIdParadaUltimaMilla)}>
                                                                    <InsertDriveFile fontSize={"large"}/>
                                                                </IconButton>
                                                            </Grid>

                                                                <Grid item sm={2}>
                                                                    {
                                                                        tour.m_bActiva &&
                                                                        <>
                                                                    <IconButton disabled={!validarDerecho(9101454) || this.validarRutasCompletadas(tour)} aria-label="file" onClick={(e) => this.cancelarRutaAccion(e,tour.m_nIdParadaUltimaMilla)}>
                                                                        <CancelIcon style={{fill:"red"}} fontSize={"large"}/>
                                                                    </IconButton>
                                                                    </>
                                                                    }
                                                                    {
                                                                        !tour.m_bActiva &&
                                                                        <Chip
                                                                            style={{
                                                                                backgroundColor: "red",
                                                                                color: "white",
                                                                            }}
                                                                            label={`Cancelado`}
                                                                            size={"small"}
                                                                            variant="outlined"
                                                                        />
                                                                    }
                                                                </Grid>
                                                        </Grid>
                                                    }/>
                                                </ListItem>
                                                <Collapse in={this.state.indexOpen === index} timeout="auto"
                                                          unmountOnExit>
                                                    <div align={"right"} style={{
                                                        borderRadius: "5px",
                                                        margin: "5px",
                                                        height: "100%",
                                                        overflow: "auto"
                                                    }}>


                                                        {
                                                            tour.m_bActiva &&
                                                            <Button disabled={!validarDerecho(9101447)} variant={"contained"} color={"primary"}
                                                                    onClick={() => this.setState({
                                                                        paquetes: tour.m_arrClsProGuia,
                                                                        tour: tour,
                                                                        openAgregar: true
                                                                    })}>Ordenar
                                                                Paradas</Button>
                                                        }



                                                        <List component="div" disablePadding style={{
                                                            padding: "5px",
                                                            height: "200px",
                                                            overflow: "auto"
                                                        }}>

                                                            <ListItem style={{
                                                                borderRadius: "5px",
                                                                padding: "5px",
                                                            }}>

                                                                <TableContainer style={{
                                                                    height: "100%",
                                                                    padding: "0px",
                                                                    paddingRight: "0px"
                                                                }}>
                                                                    <Table size="small">
                                                                        <TableHead>
                                                                            <TableRow>
                                                                                <TableCell
                                                                                    style={{
                                                                                        borderBottom: "none",
                                                                                        fontWeight: "bold"
                                                                                    }}
                                                                                    align="left">
                                                                                    Carta Porte
                                                                                </TableCell>
                                                                                <TableCell
                                                                                    style={{
                                                                                        borderBottom: "none",
                                                                                        fontWeight: "bold"
                                                                                    }}
                                                                                    align="left">Ventana</TableCell>
                                                                                <TableCell
                                                                                    style={{
                                                                                        borderBottom: "none",
                                                                                        fontWeight: "bold"
                                                                                    }}
                                                                                    align="left">Entrega</TableCell>
                                                                                <TableCell
                                                                                    style={{
                                                                                        borderBottom: "none",
                                                                                        fontWeight: "bold"
                                                                                    }}
                                                                                    align="center">Acciones</TableCell>
                                                                            </TableRow>
                                                                        </TableHead>

                                                                        <TableBody>
                                                                            {
                                                                                tour.m_arrClsProGuia.map((g, index) => {
                                                                                    return (
                                                                                        <TableRow key={index}>
                                                                                            <TableCell
                                                                                                style={{
                                                                                                    borderBottom: "none",
                                                                                                    display: "inline-block"
                                                                                                }}
                                                                                                align="left">
                                                                                                {index + 1}-{g.m_sFolio}
                                                                                            </TableCell>
                                                                                            <TableCell
                                                                                                style={{borderBottom: "none"}}
                                                                                                align="left">
                                                                                                {g.m_bEsRecoleccion ? (g.m_bRecoleccionConCita ? (g.m_bCitaPendiente ? "Cita pendiente" : (g.m_sFechaRecoleccionCita + " " + g.m_sHoraCitarRecoleccionMinima + " a " + g.m_sHoraCitaRecoleccionMaxima)) : "Sin cita") : g.m_bEmbarqueConCita ? g.m_bCitaPendiente ? "Cita pendiente" : (g.m_sFechaEmbarqueCita + " " + g.m_sHoraEmbarqueCitaMinima + " a " + g.m_sHoraEmbarqueCitaMaxima) : "Sin Cita"}
                                                                                            </TableCell>
                                                                                            <TableCell
                                                                                                style={{borderBottom: "none"}}
                                                                                                align="left">
                                                                                                <div style={{
                                                                                                    backgroundColor: !tour.m_bActiva ? "#F5153340" : (g.m_nEstatusUlimaMilla !== 4 && g.m_nEstatusUlimaMilla !== 3 ? "#DBC50040" : g.m_nEstatusUlimaMilla === 3 ? "#06B10040" : "#F5153340"),
                                                                                                    width: "100%",
                                                                                                    textAlign: "center"
                                                                                                }}>
                                                                                                    {!tour.m_bActiva ? "Cancelada" : g.m_sEstatusUltimaMilla}
                                                                                                </div>
                                                                                            </TableCell>
                                                                                            <TableCell
                                                                                                style={{borderBottom: "none"}}
                                                                                                align="left">

                                                                                                    <ButtonGroup
                                                                                                        size="small"
                                                                                                        disableElevation
                                                                                                        variant="contained"
                                                                                                        color="primary">
                                                                                                        
                                                                                                        {
                                                                                                            !g.m_bTimbrado && g.m_nEstatusUlimaMilla !== 4 && g.m_nEstatusUlimaMilla !== 3 && tour.m_bActiva &&
                                                                                                            <IconButton
                                                                                                                /* disabled={!validarDerecho(9101449)} */
                                                                                                                onClick={() => {
                                                                                                                    console.log(JSON.stringify(g))
                                                                                                                    this.openPaquetesParciales(tour, g)
                                                                                                                }}
                                                                                                                aria-label="reorder">
                                                                                                                <Tooltip
                                                                                                                    title={"Entregas Parciales"}>
                                                                                                                    <DepartureBoardIcon

                                                                                                                        fontSize="default"/>
                                                                                                                </Tooltip>
                                                                                                            </IconButton>
                                                                                                        }
                                                                                                        
                                                                                                        {
                                                                                                            !g.m_bTimbrado && g.m_nEstatusUlimaMilla !== 4 && g.m_nEstatusUlimaMilla !== 3 && tour.m_bActiva &&
                                                                                                            <IconButton
                                                                                                                disabled={!validarDerecho(9101449)}
                                                                                                                onClick={() => this.openRemplazarPaquete(tour, g)}
                                                                                                                aria-label="reorder">
                                                                                                                <Tooltip
                                                                                                                    title={"Remplazar"}>
                                                                                                                    <CachedIcon

                                                                                                                        fontSize="default"/>
                                                                                                                </Tooltip>
                                                                                                            </IconButton>
                                                                                                        }

                                                                                                    
                                                                                                        {
                                                                                                            !g.m_bTimbrado && g.m_nEstatusUlimaMilla !== 4 && g.m_nEstatusUlimaMilla !== 3 && tour.m_bActiva &&
                                                                                                            <IconButton
                                                                                                                disabled={!validarDerecho(9101450)}
                                                                                                                onClick={() => this.confirmUbicacionParada( g.m_nId, g.m_bEsRecoleccion, g)}
                                                                                                                aria-label="delete">
                                                                                                                <Tooltip
                                                                                                                    title={"Cambiar ubicación"}>
                                                                                                                    <GpsFixedIcon

                                                                                                                        fontSize="default"/>
                                                                                                                </Tooltip>
                                                                                                            </IconButton>
                                                                                                        }

                                                                                                        {
                                                                                                            r.m_bEsPermisionario && r.m_bUnidadPermisionario &&
                                                                                                            <IconButton
                                                                                                                disabled={!validarDerecho(9101452)}
                                                                                                                onClick={() => this.descargarXMLCFDIPermisionario( g.m_nId, g.m_bEsRecoleccion,g.m_sFolio)}
                                                                                                                aria-label="Descargar XML">
                                                                                                                <Tooltip
                                                                                                                    title={"Descargar XML Permisionario"}>
                                                                                                                    <GetAppIcon

                                                                                                                        fontSize="default"/>
                                                                                                                </Tooltip>
                                                                                                            </IconButton>
                                                                                                        }
                                                                                                        {
                                                                                                           (tour.m_bActiva && !r.m_bUnidadPermisionario && !g.m_bTimbrado) &&
                                                                                                            <IconButton
                                                                                                                disabled={!validarDerecho(9101451)}
                                                                                                                onClick={() =>
                                                                                                                    this.generarCFDI( g.m_nId, g.m_bEsRecoleccion,g.m_sFolio)
                                                                                                                }
                                                                                                                aria-label="Timbrar SAT">
                                                                                                                <Tooltip
                                                                                                                    title={"Generar CFDI Traslado"}>
                                                                                                                    <DescriptionIcon

                                                                                                                        fontSize="default"/>
                                                                                                                </Tooltip>
                                                                                                            </IconButton>
                                                                                                        }
                                                                                                        {
                                                                                                            !r.m_bUnidadPermisionario && !g.m_bTimbrado &&
                                                                                                            <IconButton
                                                                                                                disabled={!validarDerecho(9101451)}
                                                                                                                onClick={() => this.descargarXMLCFDI( g.m_nId, g.m_bEsRecoleccion,g.m_sFolio)}
                                                                                                                aria-label="XML SAT">
                                                                                                                <Tooltip
                                                                                                                    title={"Descargar XML Traslado"}>
                                                                                                                    <GetAppIcon

                                                                                                                        fontSize="default"/>
                                                                                                                </Tooltip>
                                                                                                            </IconButton>
                                                                                                        }
                                                                                                        {
                                                                                                            !r.m_bUnidadPermisionario && g.m_bTimbrado &&
                                                                                                            <IconButton
                                                                                                                aria-label="PDF TASLADO">
                                                                                                                <Tooltip
                                                                                                                    title={"Descargar PDF"}>
                                                                                                                    <PictureAsPdfIcon
                                                                                                                        onClick={() => this.obtenerPDFCFDI( g.m_nId, g.m_bEsRecoleccion,g.m_sFolioFiscalUUID)}
                                                                                                                        fontSize="default"/>
                                                                                                                </Tooltip>
                                                                                                            </IconButton>
                                                                                                        }
                                                                                                        {
                                                                                                            !r.m_bUnidadPermisionario && g.m_bTimbrado &&
                                                                                                            <IconButton
                                                                                                                aria-label="Descargar xml">
                                                                                                                <Tooltip
                                                                                                                    title={"Descargar XML"}>
                                                                                                                    <GetAppIcon
                                                                                                                        onClick={() => this.obtenerXMLCFDITimbrado(  g.m_sXMLTraslada,g.m_sFolioFiscalUUID)}
                                                                                                                        fontSize="default"/>
                                                                                                                </Tooltip>
                                                                                                            </IconButton>
                                                                                                        }
                                                                                                        {
                                                                                                            g.m_bTimbrado &&
                                                                                                            <IconButton
                                                                                                                disabled={!validarDerecho(9101451)}
                                                                                                                onClick={() => this.showCancelarCFDI(g)}
                                                                                                                aria-label="Cancelar SAT">
                                                                                                                <Tooltip
                                                                                                                    title={"Cancelar SAT"}>
                                                                                                                    <BlockIcon

                                                                                                                        fontSize="default"/>
                                                                                                                </Tooltip>
                                                                                                            </IconButton>
                                                                                                        }
                                                                                                        {
                                                                                                            !g.m_bTimbrado && g.m_nEstatusUlimaMilla !== 4 && g.m_nEstatusUlimaMilla !== 3 && tour.m_bActiva && !g.m_bTimbrado &&
                                                                                                            <IconButton
                                                                                                                disabled={!validarDerecho(9101453)}
                                                                                                                onClick={() => this.confirmDeleteParada(tour.m_nIdParadaUltimaMilla, g.m_nId, g.m_bEsRecoleccion)}
                                                                                                                aria-label="delete">
                                                                                                                <Tooltip
                                                                                                                    title={"Eliminar"}>
                                                                                                                    <DeleteIcon
                                                                                                                        fontSize="default"/>
                                                                                                                </Tooltip>
                                                                                                            </IconButton>
                                                                                                        }



                                                                                                    </ButtonGroup>

                                                                                            </TableCell>
                                                                                        </TableRow>
                                                                                    )
                                                                                })
                                                                            }
                                                                        </TableBody>
                                                                    </Table>

                                                                </TableContainer>
                                                            </ListItem>


                                                        </List>
                                                    </div>

                                                </Collapse>
                                            </div>
                                        )
                                    })
                                }

                            </List>
                        </div>

                    </div>
                }
            </div>
        );
    }
}

DetalleParadas.propTypes = {};

export default DetalleParadas;
