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
    Typography, Tooltip, Popper, Paper, FormControl, InputLabel, Select
} from "@material-ui/core";
import {confirmAlert} from 'react-confirm-alert'; // Import
import 'react-confirm-alert/src/react-confirm-alert.css'; // Import css
import DeleteIcon from '@material-ui/icons/Delete';
import ReorderIcon from '@material-ui/icons/Reorder';
import CachedIcon from '@material-ui/icons/Cached';
import {ReactComponent as ParadasIcono} from "../../iconos/Mapa/paradas.svg";
import CloseIcon from "@material-ui/icons/Close";
import SearchIcon from "@material-ui/icons/Search";
import {ReactComponent as UnidadesIcon} from "../../iconos/Catalogos/Icono Unidades/icono_unidades.svg";
import {PieChart} from 'react-minimal-pie-chart';

import RemplazarPaqueteUltimaMilla from "./RemplazarPaqueteUltimaMilla";
import AgregarPaqueteUltimaMilla from "./AgregarPaqueteUltimaMilla";
import PaquetesList from "./PaquetesList";
import {obtenerGuiaUltimaMilla} from "../../Util/Contexts/GuiaContext";
import {
    eliminarPaqueteUltimaMilla, obtenerUltimaMillaReporte,
    ordenarParada,
    remplazarPaqueteUltimaMilla
} from "../../Util/Contexts/UltimaMillaContext";
import Noty from "noty";
import {obtenerCorteReporte} from "../../Util/Contexts/CorteCajaContext";
import {InsertDriveFile} from "@material-ui/icons";

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
            openAgregar: false,

        }
        this.searchRepartidor = this.searchRepartidor.bind(this)
        this.openDetail = this.openDetail.bind(this)
        this.openRemplazarPaquete = this.openRemplazarPaquete.bind(this)
        this.onSubmitRemplazarPaquete = this.onSubmitRemplazarPaquete.bind(this)
        this.onSubmitOrdenarPaquetes = this.onSubmitOrdenarPaquetes.bind(this)
        this.onSubmitBorrarPaquete = this.onSubmitBorrarPaquete.bind(this)
        this.confirmDeleteParada = this.confirmDeleteParada.bind(this)
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

    confirmDeleteParada(idParada, idGuia, esRecoleccion) {
        confirmAlert({
            title: 'Confirmación',
            message: '¿Está segura(o) que desea eliminar la parada?',
            buttons: [
                {
                    label: 'Yes',
                    onClick: () => this.onSubmitBorrarPaquete(idParada, idGuia, esRecoleccion)
                },
                {
                    label: 'No'
                }
            ]
        });
    }

    onSubmitBorrarPaquete(idParada, idGuia, esRecoleccion) {
        eliminarPaqueteUltimaMilla(idParada, idGuia, esRecoleccion).then(({data}) => {
            showSuccess(data.data)
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

    generarReporte(e, id) {
        e.preventDefault()
        // console.log('corte id: ' + id)
        obtenerUltimaMillaReporte(id).then(({data}) => {
            // console.log(data)
            // debugger
            let pdfWindow = window.open("");
            pdfWindow.document.write("<embed  width='100%' height='100%' src='data:application/pdf;base64, " + encodeURI(data) + "'/>");
            pdfWindow.document.body.style.margin = "0px";
            pdfWindow.document.title = "Última Milla";
        })
    }

    render() {

        const totalPaquetes = this.props.tour.m_arrClsParadaUltimaMilla.map(a => a.m_arrClsProGuia.length).reduce((a, b) => a + b)
        const allGuias = [].concat(...this.props.tour.m_arrClsParadaUltimaMilla.map(a => a.m_arrClsProGuia))
        return (
            <div>
                {
                    this.state.openAgregar &&
                    <AgregarPaqueteUltimaMilla zonasIds={this.props.filtros.zonasSeleccionada}
                                               tour={this.state.tour}
                                               onSubmit={this.onSubmitOrdenarPaquetes}
                                               tipoServicio={parseInt(this.props.filtros.tipoBusqueda)}
                                               close={() => this.setState({openAgregar: false})}
                                               open={this.state.openAgregar} paquetes={this.state.paquetes}/>
                }

                <RemplazarPaqueteUltimaMilla open={this.state.openRemplazar} multiples={false}
                                             onSubmit={this.onSubmitRemplazarPaquete}
                                             close={() => this.setState({openRemplazar: false})}
                                             data={this.state.paquetes}/>
                {
                    !this.state.openDetail &&
                    <IconButton
                        onClick={() => this.setState({openDetail: true})}
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
                                    onClick={() => this.setState({openDetail: false})}
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
                                            <strong> {parseInt((allGuias.filter(g => g.m_nEstatusUlimaMilla !== 3 && g.m_nEstatusUlimaMilla !== 4).length / totalPaquetes) * 100)}%</strong>
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
                                            <strong> {parseInt((allGuias.filter(g => g.m_nEstatusUlimaMilla === 3).length / totalPaquetes) * 100)}%</strong>
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
                                            <strong> {parseInt((allGuias.filter(g => g.m_nEstatusUlimaMilla === 4).length / totalPaquetes) * 100)}%</strong>
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
                                        var tour = this.props.tour.m_arrClsParadaUltimaMilla.find(t => t.m_nIdUnidad === r.m_nIdUnidad)
                                        var color = tour.color
                                        return (
                                            <div key={r.m_sNombreOperador}>
                                                <ListItem button
                                                          onClick={(e) => {
                                                              e.stopPropagation();
                                                              this.openDetail(index)
                                                          }}>
                                                    <ListItemText primary={
                                                        <Grid container spacing={1} alignItems={"baseline"}
                                                              justify={"space-between"}>
                                                            <Grid item>
                                                                <Typography>{r.m_snNombreOperador}</Typography>
                                                            </Grid>
                                                            <Grid item>
                                                                <UnidadesIcon
                                                                    style={{
                                                                        fill: color,
                                                                        paddingTop: "2px",
                                                                        paddingRight: "4px",
                                                                        paddingBottom: "2px",
                                                                        width: "20px",
                                                                        verticalAlign: "middle"
                                                                    }}/>
                                                                {r.m_sPlacasUnidad}

                                                            </Grid>
                                                            <Grid item>
                                                                {tour.m_arrClsProGuia.length} Paradas
                                                            </Grid>
                                                            <Grid item>
                                                                <IconButton aria-label="file" onClick={(e) => this.generarReporte(e,tour.m_nIdUltimaMilla)}>
                                                                    <InsertDriveFile fontSize={"large"}/>
                                                                </IconButton>
                                                            </Grid>
                                                        </Grid>
                                                    }/>
                                                </ListItem>
                                                <Collapse in={this.state.indexOpen === index} timeout="auto"
                                                          unmountOnExit>
                                                    <div align={"right"} style={{
                                                        borderRadius: "5px",
                                                        margin: "5px",
                                                        height:"100%",
                                                        overflow: "auto"
                                                    }}>

                                                        <Button variant={"contained"} color={"primary"}
                                                                onClick={() => this.setState({
                                                                    paquetes: tour.m_arrClsProGuia,
                                                                    tour: tour,
                                                                    openAgregar: true
                                                                })}>Ordenar
                                                            Paradas</Button>

                                                        <List component="div" disablePadding style={{
                                                            padding: "5px",
                                                            height: "400px",
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
                                                                                    align="left">Carta Porte</TableCell>
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
                                                                                                {
                                                                                                    g.m_bEsRecoleccion &&
                                                                                                    g.m_bRecoleccionConCita ? "" : "Sin Cita"
                                                                                                }
                                                                                            </TableCell>
                                                                                            <TableCell
                                                                                                style={{borderBottom: "none"}}
                                                                                                align="left">
                                                                                                <div style={{
                                                                                                    backgroundColor: g.m_nEstatusUlimaMilla !== 4 && g.m_nEstatusUlimaMilla !== 3 ? "#DBC50040" : g.m_nEstatusUlimaMilla === 3 ? "#06B10040" : "#F5153340",
                                                                                                    width: "100%",
                                                                                                    textAlign: "center"
                                                                                                }}>
                                                                                                    {g.m_sEstatusUltimaMilla}
                                                                                                </div>
                                                                                            </TableCell>
                                                                                            <TableCell
                                                                                                style={{borderBottom: "none"}}
                                                                                                align="left">
                                                                                                {
                                                                                                    g.m_nEstatusUlimaMilla !== 4 && g.m_nEstatusUlimaMilla !== 3 &&
                                                                                                    <ButtonGroup
                                                                                                        size="small"
                                                                                                        disableElevation
                                                                                                        variant="contained"
                                                                                                        color="primary">


                                                                                                        <IconButton
                                                                                                            aria-label="reorder">
                                                                                                            <Tooltip
                                                                                                                title={"Remplazar"}>
                                                                                                                <CachedIcon
                                                                                                                    onClick={() => this.openRemplazarPaquete(tour, g)}
                                                                                                                    fontSize="default"/>
                                                                                                            </Tooltip>
                                                                                                        </IconButton>
                                                                                                        <IconButton
                                                                                                            aria-label="delete">
                                                                                                            <Tooltip
                                                                                                                title={"Eliminar"}>
                                                                                                                <DeleteIcon
                                                                                                                    onClick={() => this.confirmDeleteParada(tour.m_nIdParadaUltimaMilla, g.m_nId, g.m_bEsRecoleccion)}
                                                                                                                    fontSize="default"/>
                                                                                                            </Tooltip>
                                                                                                        </IconButton>
                                                                                                    </ButtonGroup>
                                                                                                }

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
