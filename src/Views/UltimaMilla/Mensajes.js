import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {
    IconButton,
    Grid,
    List,
    ListItem,
    ListItemIcon,
    ListItemText,
    Collapse,
    Typography,
    Divider,
    TextField, InputAdornment, Button
} from "@mui/material";
import MessageIcon from '@mui/icons-material/Message';
import CloseIcon from '@mui/icons-material/Close';
import EmailIcon from '@mui/icons-material/Email';
import {ReactComponent as UnidadesIcon} from "../../iconos/Catalogos/Icono Unidades/icono_unidades.svg";
import SearchIcon from '@mui/icons-material/Search';
import {agregarMensajes, obtenerMensajes} from "../../Util/Contexts/MensajesConetext";
import Buttons from "../../Util/CarruselButtons";
import Noty from "noty";

function showSuccess(mensaje) {
    new Noty({
        type: "information",
        layout: "topCenter",
        text: mensaje,
        timeout: "3000"
    }).show()
}
class Mensajes extends Component {
    constructor(props) {
        super(props);
        this.state = {
            openDetail: false,
            repartidoresFiltrados: this.props.tour.m_arrClsParadaUltimaMilla,
            indexOpen: -1,
            searchText: "",
            mensajes: [],
            newMessageText: "",
            idIntervalo:null,
        }
        this.searchRepartidor = this.searchRepartidor.bind(this)
        this.openChat = this.openChat.bind(this)
        this.enviarMensaje = this.enviarMensaje.bind(this)
    }

    componentWillMount() {

    }

    componentDidMount() {

    }

    componentWillUnmount() {

    }

    componentDidUpdate(prevProps, prevState, snapshot) {

        console.log(document.getElementById("listMessage"))
        if(document.getElementById("listMessage")){
            document.getElementById("listMessage").scrollTo(0,document.getElementById("listMessage").scrollHeight)
        }
    }

    searchRepartidor(event) {
        event.preventDefault()
        if (this.state.searchText === "") {
            this.setState({repartidoresFiltrados: this.props.tour.m_arrClsParadaUltimaMilla})
        } else {
            this.setState({repartidoresFiltrados: this.props.tour.m_arrClsParadaUltimaMilla.filter(u => u.m_sNombreOperador.toLowerCase().includes(this.state.searchText.toLowerCase()))})
        }

    }

    openChat(index) {
   console.log("index"+index)
        obtenerMensajes(this.state.repartidoresFiltrados[index].m_nIdOperador,this.props.fecha).then(({data}) => {
            this.setState({indexOpen: index === this.state.indexOpen ? -1 : index, mensajes: data, newMessageText: ""})
        })
        var intervalo = 0;
        if( index === this.state.indexOpen){//se cierra
              console.log(this.state.idIntervalo)
              clearInterval(this.state.idIntervalo)
        }else{

        intervalo = setInterval(()=>{
            console.log("entra cada 5")
            obtenerMensajes(this.state.repartidoresFiltrados[index].m_nIdOperador,this.props.fecha).then(({data}) => {
                this.setState({mensajes: data})
            })
             },5000)
             console.log("dentro de"+intervalo)
             this.setState({idIntervalo:intervalo})
        }
     


    }

    enviarMensaje() {
        if (this.state.newMessageText !== "") {
            agregarMensajes(this.state.newMessageText, this.state.repartidoresFiltrados[this.state.indexOpen].m_nIdOperador).then(({data}) => {
                showSuccess(data)
                obtenerMensajes(this.state.repartidoresFiltrados[this.state.indexOpen].m_nIdOperador,this.props.fecha).then(({data}) => {
                    this.setState({mensajes: data, newMessageText: ""})
                })
            })
        }
    }


    render() {

        return (
            <div className={"j-form"}>
                {
                    !this.state.openDetail &&
                    <IconButton
                        onClick={() => this.setState({openDetail: true})}
                        style={{
                            color: "white",
                            borderRadius: "10px",
                            width: "30px",
                            height: "30px",
                            backgroundColor: "#4F6AF3",
                            top: "150px",
                            right: "10px",
                            position: "fixed",
                            zIndex: 3000,
                            boxShadow: "0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19)"
                        }}
                        size="large">
                        <MessageIcon/>
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
                            backgroundColor: "#4F6AF3",
                            width: "100%",
                            height: "30px",
                            color: "white",
                            display: "inline-block"
                        }}>
                            <MessageIcon style={{
                                verticalAlign: "middle",
                                marginLeft: "5px",
                                marginRight: "5px",
                                height: "30px"
                            }}/>
                            Repartidores
                            <div style={{float: "right"}}>
                                <IconButton
                                    style={{height: "30px"}}
                                    onClick={() => this.setState({openDetail: false})}
                                    size="large">
                                    <CloseIcon style={{fill: "white"}} onClick={()=>{ 
                                         this.setState({indexOpen:-1 })
                                        clearInterval(this.state.idIntervalo)}}/>
                                </IconButton>
                            </div>
                        </div>
                        <TextField variant="outlined" size={"small"} placeholder={"Buscar repartidor"}
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
                        <Divider/>
                        <div style={{width: "100%", height: "30px", color: "black"}}>
                            <List style={{overflow: "auto"}}>
                                {
                                    this.state.repartidoresFiltrados.map((r, index) => {
                                        var tour = this.props.tour.m_arrClsParadaUltimaMilla.find(t => t.m_nIdUnidad ===  r.m_nIdUnidad)
                                        var color = tour.color
                                        return (
                                            <div>
                                                <ListItem button
                                                          onClick={() => this.openChat(index)}>
                                                    <ListItemText primary={
                                                        <Grid container spacing={2} alignItems={"baseline"}>
                                                            <Grid item>
                                                                <Typography>{r.m_snNombreOperador}</Typography>
                                                            </Grid>
                                                            <Grid item>
                                                                <UnidadesIcon
                                                                    style={{
                                                                        fill: color,
                                                                        paddingTop: "5px",
                                                                        paddingBottom: "5px",
                                                                        width: "20px",
                                                                        verticalAlign: "middle"
                                                                    }}/>
                                                            </Grid>
                                                            <Grid item>
                                                                {r.m_sPlacasUnidad}
                                                            </Grid>
                                                        </Grid>
                                                    }/>
                                                    <EmailIcon color={"primary"} fontSize={"large"}
                                                               style={{verticalAlign: "middle"}}/>
                                                </ListItem>
                                                <Collapse in={this.state.indexOpen === index} timeout="auto"
                                                          unmountOnExit>
                                                    <div style={{
                                                        borderRadius: "5px",
                                                        borderStyle: "solid",
                                                        margin: "5px",
                                                        border: "2px solid #868686"
                                                    }}>

                                                        <List id="listMessage"  component="div" disablePadding style={{
                                                            padding: "10px",
                                                            height: "200px",
                                                            overflow: "auto"
                                                        }}>
                                                            {
                                                                this.state.mensajes.map((m,index) => {
                                                                    return (
                                                                        <ListItem id={`item${index}`} autoFocus={true} style={{
                                                                            borderRadius: "5px",
                                                                            marginBottom:"5px",
                                                                            marginLeft: m.m_bEsOperador  ? "0px" : "20px",
                                                                            marginRight: m.m_bEsOperador  ? "20px" : "0px",
                                                                            textAlign: m.m_bEsOperador  ? "left" : "right",
                                                                            backgroundColor: m.m_bEsOperador  ? "#C6CDF3" : "#E6E6E6"
                                                                        }}>
                                                                            <ListItemText primary={m.m_sMensaje} secondary={m.m_sFechaHora}/>
                                                                        </ListItem>
                                                                    )
                                                                })
                                                            }
                                                        </List>

                                                        <TextField
                                                            variant={"outlined"}
                                                            style={{padding: "10px"}}
                                                            value={this.state.newMessageText}
                                                            onChange={(event) => this.setState({newMessageText: event.target.value})}
                                                            multiline
                                                            InputProps={{
                                                                endAdornment: (
                                                                    <InputAdornment position="end" style={{
                                                                        marginRight: "0px",
                                                                        paddingRight: "0px",
                                                                        marginBottom: "0px"
                                                                    }}>
                                                                        <Button
                                                                            variant={"contained"}
                                                                            color={"primary"}
                                                                            size={"small"}
                                                                            onClick={() => this.enviarMensaje()}
                                                                        >
                                                                            Enviar
                                                                        </Button>


                                                                    </InputAdornment>
                                                                ),
                                                            }}
                                                        />
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

Mensajes.propTypes = {};

export default Mensajes;
