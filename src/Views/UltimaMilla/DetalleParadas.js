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
    TextField,
    Typography
} from "@material-ui/core";
import {ReactComponent as ParadasIcono} from "../../iconos/Mapa/paradas.svg";
import {ReactComponent as CalendarioIcono} from "../../iconos/Mapa/iconoCalendario.svg";
import MessageIcon from "@material-ui/icons/Message";
import CloseIcon from "@material-ui/icons/Close";
import SearchIcon from "@material-ui/icons/Search";
import {ReactComponent as UnidadesIcon} from "../../iconos/Catalogos/Icono Unidades/icono_unidades.svg";
import EmailIcon from "@material-ui/icons/Email";
import {obtenerMensajes} from "../../Util/Contexts/MensajesConetext";
import {PieChart} from 'react-minimal-pie-chart';
import {obtenerUnidades} from "../../Util/Contexts/UnidadesContext";


class DetalleParadas extends Component {
    constructor(props) {
        super(props);
        this.state = {
            openDetail: false,
            repartidoresFiltrados: this.props.tour.m_arrClsParadaUltimaMilla,
            newMessageText: "",
            paradas: [],
        }
        this.searchRepartidor = this.searchRepartidor.bind(this)
        this.openDetail = this.openDetail.bind(this)
    }

    componentDidMount() {
    }

    searchRepartidor(event) {
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

    render() {

        const totalPaquetes = this.props.tour.m_arrClsParadaUltimaMilla.map(a => a.m_arrClsProGuia.length).reduce((a, b) => a + b)
        const allGuias = [].concat(...this.props.tour.m_arrClsParadaUltimaMilla.map(a => a.m_arrClsProGuia))
        return (
            <div>
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
                            width: "450px",
                            pointerEvents: "auto",
                            height: window.innerHeight - 100,
                            backgroundColor: "white",
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
                                <div style={{height: "100px", padding: "10px 0 10px 0"}}>
                                    <PieChart
                                        lineWidth={15}
                                        paddingAngle={5}
                                        data={[
                                            {
                                                title: '',
                                                value: allGuias.filter(g => g.m_nIdEstatusGuia === 8).length,
                                                color: '#F51533'
                                            },
                                            {
                                                title: '',
                                                value: allGuias.filter(g => g.m_nIdEstatusGuia === 7).length,
                                                color: '#06B100'
                                            },
                                            {
                                                title: '',
                                                value: allGuias.filter(g => g.m_nIdEstatusGuia !== 8 && g.m_nIdEstatusGuia !== 7).length,
                                                color: '#F5E23E'
                                            },
                                        ]}
                                    />
                                </div>

                            </Grid>
                            <Grid item md={6} sm={12}>
                                <Grid container spacing={1} style={{paddingTop: "10px", paddingRight: "10px"}}>
                                    <Grid item sm={12}>
                                        <div style={{
                                            backgroundColor: "#F5E23E",
                                            display: "inline-block",
                                            width: "100%",
                                            textAlign: "center"
                                        }}>
                                            <strong>Pendientes </strong> {allGuias.filter(g => g.m_nIdEstatusGuia !== 8 && g.m_nIdEstatusGuia !== 7).length} de {totalPaquetes}
                                            <strong>{parseInt((allGuias.filter(g => g.m_nIdEstatusGuia !== 8 && g.m_nIdEstatusGuia !== 7).length / totalPaquetes) * 100)}%</strong>
                                        </div>
                                    </Grid>
                                    <Grid item sm={12}>
                                        <div style={{
                                            backgroundColor: "#06B100",
                                            display: "inline-block",
                                            width: "100%",
                                            textAlign: "center"
                                        }}>
                                            <strong>Exitosas </strong> {allGuias.filter(g => g.m_nIdEstatusGuia === 7).length} de {totalPaquetes}
                                            <strong> {parseInt((allGuias.filter(g => g.m_nIdEstatusGuia === 7).length / totalPaquetes) * 100)}%</strong>
                                        </div>
                                    </Grid>
                                    <Grid item sm={12}>
                                        <div style={{
                                            backgroundColor: "#F51533",
                                            display: "inline-block",
                                            width: "100%",
                                            textAlign: "center"
                                        }}>
                                            <strong>Fallidas </strong> {allGuias.filter(g => g.m_nIdEstatusGuia === 8).length} de {totalPaquetes}
                                            <strong>{parseInt((allGuias.filter(g => g.m_nIdEstatusGuia === 8).length / totalPaquetes) * 100)}%</strong>
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
                                                          onClick={() => this.openDetail(index)}>
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
                                                            <Grid item sm={6}>
                                                                {tour.m_arrClsProGuia.length} Paradas
                                                            </Grid>
                                                            <Grid item sm={6}>

                                                            </Grid>
                                                        </Grid>
                                                    }/>
                                                </ListItem>
                                                <Collapse in={this.state.indexOpen === index} timeout="auto"
                                                          unmountOnExit>
                                                    <div style={{
                                                        borderRadius: "5px",
                                                        margin: "5px",
                                                    }}>
                                                        <List component="div" disablePadding style={{
                                                            padding: "10px",
                                                            height: "400px",
                                                            overflow: "auto"
                                                        }}>

                                                            <ListItem style={{
                                                                borderRadius: "5px",
                                                                padding: "10px",
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
                                                                            </TableRow>
                                                                        </TableHead>

                                                                        <TableBody>
                                                                            {
                                                                                tour.m_arrClsProGuia.map((g, index) => {
                                                                                    return (
                                                                                        <TableRow key={index}>
                                                                                            <TableCell
                                                                                                style={{borderBottom: "none", display: "inline-block"}}
                                                                                                align="left">
                                                                                                {index + 1} {g.m_nFolioGuia}
                                                                                            </TableCell>
                                                                                            <TableCell
                                                                                                style={{borderBottom: "none"}}
                                                                                                align="left">
                                                                                                Sin definir
                                                                                            </TableCell>
                                                                                            <TableCell
                                                                                                style={{borderBottom: "none"}}
                                                                                                align="left">
                                                                                                <div style={{
                                                                                                    backgroundColor: g.m_nIdEstatusGuia !== 8 && g.m_nIdEstatusGuia !== 7 ? "#DBC50040" : g.m_nIdEstatusGuia === 8 ? "#06B10040" : "#F5153340",
                                                                                                    width: "100%",
                                                                                                    textAlign: "center"
                                                                                                }}>
                                                                                                    {g.m_nIdEstatusGuia === 8 &&
                                                                                                    "Exitosa"
                                                                                                    }
                                                                                                    {g.m_nIdEstatusGuia === 7 &&
                                                                                                    "Fallida"
                                                                                                    }
                                                                                                    {g.m_nIdEstatusGuia !== 8 && g.m_nIdEstatusGuia !== 7 &&
                                                                                                    "Pendiente"
                                                                                                    }
                                                                                                </div>
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
