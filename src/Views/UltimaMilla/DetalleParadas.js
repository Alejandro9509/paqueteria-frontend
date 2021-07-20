import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {
    Button,
    Collapse,
    Divider,
    Grid,
    IconButton,
    InputAdornment,
    List,
    ListItem,
    ListItemText,
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
import { PieChart } from 'react-minimal-pie-chart';



class DetalleParadas extends Component {
    constructor(props) {
        super(props);
        this.state = {
            openDetail: false,
            repartidoresFiltrados: this.props.tour.unidades,
            newMessageText: "",
            paradas:[]
        }
        this.searchRepartidor = this.searchRepartidor.bind(this)
        this.openDetail = this.openDetail.bind(this)
    }

    componentDidMount() {

    }
    searchRepartidor(event) {
        event.preventDefault()
        if (this.state.searchText === "") {
            this.setState({repartidoresFiltrados: this.props.tour.unidades})
        } else {
            this.setState({repartidoresFiltrados: this.props.tour.unidades.filter(u => u.m_sNombreOperador.toLowerCase().includes(this.state.searchText.toLowerCase()))})
        }

    }
    openDetail(index) {
        obtenerMensajes(this.state.repartidoresFiltrados[index].m_nIdOperador).then(({data}) => {
            this.setState({indexOpen: index === this.state.indexOpen ? -1 : index, mensajes: data, newMessageText: ""})
        })

    }

    render() {
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
                        <ParadasIcono  style={{fill: "white"}}/>
                    </IconButton>
                }

                {
                    this.state.openDetail &&
                    <div
                        style={{
                            color: "black",
                            borderRadius: "10px",
                            width: "400px",
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
                                padding:"5px",
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
                                <div style={{height:"100px", padding:"10px 0 10px 0"}}>
                                    <PieChart
                                        lineWidth={15}
                                        paddingAngle={5}
                                        data={[
                                            { title: '', value: 0, color: '#F51533' },
                                            { title: '', value: 0, color: '#06B100' },
                                            { title: '', value: this.props.tour.paquetes.length, color: '#F5E23E' },
                                        ]}
                                    />
                                </div>

                            </Grid>
                            <Grid item md={6} sm={12}>
                                <Grid container spacing={1} style={{paddingTop: "10px", paddingRight:"10px"}}>
                                    <Grid item sm={12}>
                                        <div style={{backgroundColor:"#F5E23E", display:"inline-block", width:"100%", textAlign:"center"}}>
                                            <strong>Pendientes </strong> {this.props.tour.paquetes.length} de {this.props.tour.paquetes.length} <strong>100%</strong>
                                        </div>
                                    </Grid>
                                    <Grid item sm={12}>
                                        <div style={{backgroundColor:"#06B100", display:"inline-block", width:"100%", textAlign:"center"}}>
                                            <strong>Pendientes </strong> {0} de {0} <strong>0%</strong>
                                        </div>
                                    </Grid>
                                    <Grid item sm={12}>
                                        <div style={{backgroundColor:"#F51533", display:"inline-block", width:"100%", textAlign:"center"}}>
                                            <strong>Pendientes </strong> {0} de {0} <strong>0%</strong>
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
                                        var tour = this.props.tour.tour.tours.find(t => t.vehicleId === ("vehicle" + r.m_nIdUnidad))
                                        var color = tour.color
                                        return (
                                            <div>
                                                <ListItem button
                                                          onClick={() => this.openDetail(index)}>
                                                    <ListItemText primary={
                                                        <Grid container spacing={1} alignItems={"baseline"} justify={"space-between"}>
                                                            <Grid item>
                                                                <Typography>{r.m_sNombreOperador}</Typography>
                                                            </Grid>
                                                            <Grid item>
                                                                <UnidadesIcon
                                                                    style={{
                                                                        fill: color,
                                                                        paddingTop: "2px",
                                                                        paddingRight:"4px",
                                                                        paddingBottom: "2px",
                                                                        width: "20px",
                                                                        verticalAlign: "middle"
                                                                    }}/>
                                                                JT-5214

                                                            </Grid>
                                                            <Grid item sm={6}>
                                                                {tour.trips[0].stops.length} Paradas
                                                            </Grid>
                                                            <Grid item sm={6}>

                                                            </Grid>
                                                        </Grid>
                                                    }/>
                                                </ListItem>
                                               {/* <Collapse in={this.state.indexOpen === index} timeout="auto"
                                                          unmountOnExit>
                                                    <div style={{
                                                        borderRadius: "5px",
                                                        borderStyle: "solid",
                                                        margin: "5px",
                                                        border: "2px solid #868686"
                                                    }}>
                                                        <List component="div" disablePadding style={{
                                                            padding: "10px",
                                                            height: "200px",
                                                            overflow: "auto"
                                                        }}>
                                                            {
                                                                this.state.paradas.map(m => {
                                                                    return (
                                                                        <ListItem style={{
                                                                            borderRadius: "5px",
                                                                            padding:"10px",
                                                                            backgroundColor: m.m_nIdEnviadoPor === parseInt(localStorage.getItem("UsuarioId")) ? "#C6CDF3" : "#E6E6E6"
                                                                        }}>
                                                                            <ListItemText primary={m.m_sMensaje}/>
                                                                        </ListItem>
                                                                    )
                                                                })
                                                            }
                                                        </List>
                                                    </div>

                                                </Collapse>*/}
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
