import React, {Component} from 'react';
import PropTypes from 'prop-types';
import axios from 'axios';
import {
    Box,
    Button,
    Divider,
    Grid,
    Step,
    StepLabel,
    Stepper,
    Tab,
    Tabs,
    Typography,
} from "@mui/material";
import Timeline from "react-time-line";
import LogoPaqueteria from "../../iconos/LogoPaqueteria.png"
import StepConnector  from '@mui/material/StepConnector';
import clsx from "clsx";
import {Check} from "@mui/icons-material";
import { styled } from "@mui/material/styles";
import makeStyles from '@mui/styles/makeStyles';
import PaquetesList from "./PaquetesList";
import RemitenteDestinatario from "./RemitenteDestinatario";
import {ACCESS_TOKEN, API_HEADERS} from "../../Constants";
import {obtenerInformeFolioTipo} from "../../Util/Contexts/SeguimientoContext";
import { obtenerImagenEvidencia } from '../../Util/Contexts/UltimaMillaContext';
import DialogoEvidenciasUltimaMilla from "../UltimaMilla/DialogoEvidenciasUltimaMilla";
const PREFIX = 'TrackingEmail';

const classes = {
    alternativeLabel: `${PREFIX}-alternativeLabel`,
    active: `${PREFIX}-active`,
    completed: `${PREFIX}-completed`,
    line: `${PREFIX}-line`,
    root: `${PREFIX}-root`,
    active2: `${PREFIX}-active2`,
    circle: `${PREFIX}-circle`,
    completed2: `${PREFIX}-completed2`
};

const Root = styled('div')({
    [`&.${classes.root}`]: {
        color: '#eaeaf0',
        display: 'flex',
        height: 22,
        alignItems: 'center',
    },
    [`& .${classes.active2}`]: {
        color: '#F9A03E',
    },
    [`& .${classes.circle}`]: {
        width: 8,
        height: 8,
        borderRadius: '50%',
        backgroundColor: 'currentColor',
    },
    [`& .${classes.completed2}`]: {
        color: '#F9A03E',
        zIndex: 1,
        fontSize: 18,
    },
});

const headers = API_HEADERS

class TrackingEmail extends Component {
    constructor(props) {
        let rfc=window.location.pathname.split('/')
        if(headers.RFC==='null'){headers.RFC=rfc[rfc.length-3]}
        super(props);
        this.state = {
            activeTab: 0,
            logo:"",
            folioBusqueda: this.props.data.m_sFolio,
            tipoBusqueda: "3",
            data:{},
            imagenesEvidenciaRecoleccion:[],
            imagenesEvidenciaEmbarque:[],
            esRecoleccion:this.props.data.m_bAplicaRecoleccion,
            setOpenDialogEvidenciasRecoleccion:false,
            setOpenDialogEvidenciasEntrega:false,
            foliosAutocomplete: {},
            didSearch:false,
        }
        this.handleChangeTab = this.handleChangeTab.bind(this)
        const url=`${process.env.REACT_APP_REPORT_URL}/api/GetLogo`
        axios.get(url,{headers}).then((respuesta)=>{
            try{
                this.setState({logo: respuesta.data.Logo})
            }
            catch{
                //showSuccess("No se encontró el logo del proveedor")
            }
        })
    }
        
    handleGetEvidencias(props){
        if(!this.state.didSearch)
            obtenerInformeFolioTipo(props.data.m_sFolio,"3").then(({data}) => {
                this.setState({didSearch:true})
                if(data.Estatus == true){

                    obtenerImagenEvidencia(data.m_nIdRecoleccion?data.m_nIdRecoleccion:-1,1).then(respuestaRec=>{
                        obtenerImagenEvidencia(data.m_nIdGuia?data.m_nIdGuia:-1,0).then(respuestaEmb=>{
                            this.setState({
                                imagenesEvidenciaRecoleccion:respuestaRec.data?respuestaRec.data:[],
                                imagenesEvidenciaEmbarque:respuestaEmb.data?respuestaEmb.data:[],
                                data: data
                            })
                        })
                    })
                }else{
                    //showSuccess(data)
                    return;
                }
            })
    }    
    
    handleChangeTab(event, newValue){
        this.setState({activeTab: newValue})
    }

    handleClickOpenDialogoEvidencia(openDialog, esRecoleccion){
        if (esRecoleccion){
            this.setState({
                setOpenDialogEvidenciasRecoleccion: openDialog
            })
        }else{
            this.setState({
                setOpenDialogEvidenciasEntrega: openDialog
            })
        }
    }

    handleClickCloseDialogoEvidenciaEntrega(openDialog){
        this.setState({setOpenDialogEvidenciasEntrega:openDialog})
    }

    render() {

        function QontoStepIcon(props) {
            const classes = useQontoStepIconStyles();
            const { active, completed } = props;
            return (
                <Root className={clsx(classes.root, {[classes.active]: active,})}>
                    {completed ? <Check className={classes.completed} /> : <div className={classes.circle} />}
                </Root>
            );
        }

        const useQontoStepIconStyles = makeStyles({
            [`&.${classes.root}`]: {
                color: '#eaeaf0',
                display: 'flex',
                height: 22,
                alignItems: 'center',
            },
            [`& .${classes.active2}`]: {
                color: '#F9A03E',
            },
            [`& .${classes.circle}`]: {
                width: 8,
                height: 8,
                borderRadius: '50%',
                backgroundColor: 'currentColor',
            },
            [`& .${classes.completed2}`]: {
                color: '#F9A03E',
                zIndex: 1,
                fontSize: 18,
            },
        });

        const QontoConnector = StepConnector;
        
        return (
            <Grid container spacing={2} justifyContent="center" style={{padding:"5px",alignItems:"center"}}>
                { (this.state.setOpenDialogEvidenciasEntrega && (this.state.imagenesEvidenciaEmbarque)) &&
                <DialogoEvidenciasUltimaMilla
                    open={this.state.setOpenDialogEvidenciasEntrega}
                    setCloseDialog={()=>this.setState({setOpenDialogEvidenciasEntrega:false})}
                    imagenes={this.state.imagenesEvidenciaEmbarque}
                />
            }
            { (this.state.setOpenDialogEvidenciasRecoleccion && (this.state.imagenesEvidenciaRecoleccion)) &&
                <DialogoEvidenciasUltimaMilla
                    open={this.state.setOpenDialogEvidenciasRecoleccion}
                    setCloseDialog={()=>this.setState({setOpenDialogEvidenciasRecoleccion:false})}
                    imagenes={this.state.imagenesEvidenciaRecoleccion}
                />
            }
                <Grid item sx={12} md={12} style={{display:"flex",flexFlow:"column",alignItems:"center"}} >
                    <img src={"data:image/png;base64,"+this.state.logo} width="10%" ></img>
                    <Typography variant={"h4"}>{this.props.data.m_sNombreResponsablePago}</Typography>
                </Grid>
                <Grid item sx={12} md={12}>
                    <Typography variant={"h5"}>Número de rastreo: <b>{this.props.data.m_sTracking}</b></Typography>

                    <Grid item sx={12} md={12}>
                        <Typography align={"center"}  variant={"h3"}>{this.props.data.m_sEstatusSeguimiento}</Typography>
                    </Grid>
                    {
                        this.props.data.m_nEstatusSeguimiento === 2 &&
                        <Grid item sx={12} md={12}>
                            <Typography align={"center"}  variant={"h3"}>Recibió: {this.props.data.m_sReceptor}</Typography>
                        </Grid>
                    }

                    <Grid item sx={12} md={12}>
                        <Box sx={{ width: '100%' }}>
                            <Stepper alternativeLabel activeStep={this.props.data.m_nEstatusSeguimiento} connector={<QontoConnector
                                classes={{
                                    alternativeLabel: classes.alternativeLabel,
                                    active: classes.active,
                                    completed: classes.completed,
                                    line: classes.line
                                }} />}>
                                {[this.props.data.m_bAplicaRecoleccion ? "Recolectado" : "Documentado","En ruta", "Entregado"].map((label) => (
                                    <Step key={label}>
                                        <StepLabel StepIconComponent={QontoStepIcon}>{label}</StepLabel>
                                    </Step>
                                ))}
                            </Stepper>
                        </Box>
                    </Grid>
                    <Grid item sx={12} md={12}>
                        <RemitenteDestinatario data={this.props.data}/>
                    </Grid>
                    <Grid item sx={12} md={12}>
                        <Tabs variant={"standard"} centered value={this.state.activeTab} onChange={this.handleChangeTab} >
                                <Tab label="Historial de viaje"/>
                                <Tab label="Detalle del paquete" />
                                <Tab label="Evidencias" onClick={()=>this.handleGetEvidencias(this.props)}/>
                        </Tabs>
                        <TabPanel value={this.state.activeTab} index={0}>
                            <div lang={"es"} style={{
                                marginTop: "4px",
                                padding: "5px",
                                borderRadius: "10px"
                            }}>
                                <Timeline items={this.props.data.bitacora ? this.props.data.bitacora.map(b => ({
                                    ts: b.Fecha + "T" + b.Hora,
                                    text: b.Descripcion
                                })) : []} format="hh:mm a"/>
                            </div>
                        </TabPanel>
                        <TabPanel value={this.state.activeTab} index={1}>
                            <PaquetesList paquetes={this.props.data.paquetes}/>
                        </TabPanel>
                        <TabPanel value={this.state.activeTab} index={2}>
                            <div>
                                <div style={{marginTop:"4px",padding: "5px",borderStyle: "solid",borderWidth: "1px",borderRadius: "10px"}}>
                                    <Grid container spacing={3}>
                                        <Grid item md={12}>
                                            <Typography variant={"h4"} align={"center"}>Evidencias</Typography>
                                        </Grid>
                                        <Grid item md={6}  style={{borderRight: "dotted 2px rgb(249, 160, 62)"}}>
                                            <Box display="flex" p={1} bgcolor="background.paper" flexDirection="column"
                                            textAlign="center" alignItems="center">
                                                <Typography variant={"h4"} style={{marginBottom:"10px"}}>
                                                    Recolección
                                                </Typography>
                                                <Grid item md={12}>
                                                    Entregó: {this.state.data.m_sReceptorRecoleccion}
                                                    <Button fullWidth variant="text" color="primary" onClick={() => this.handleClickOpenDialogoEvidencia(true, true)}>
                                                        Ver evidencias de recolección
                                                    </Button>
                                                </Grid>
                                            </Box>
                                        </Grid>
                                        <Grid item md={12}>
                                            <Box display="flex" p={1} bgcolor="background.paper" flexDirection="column"
                                                alignItems="center" textAlign="center">
                                                <Typography variant={"h4"} style={{marginBottom: "10px"}}>
                                                    Entrega
                                                </Typography>
                                                <Grid item md={6}>
                                                    Entregó: {this.state.data.operadorEntrega}
                                                    <br/>
                                                    Recibió: {this.state.data.m_sReceptorGuia}
                                                    <Button fullWidth variant="text" color="primary"
                                                        onClick={() => this.handleClickOpenDialogoEvidencia(true, false)}>
                                                        Ver evidencias de entrega
                                                    </Button>
                                                </Grid>
                                            </Box>
                                        </Grid>
                                    </Grid>
                                </div>
                            </div>
                        </TabPanel>
                    </Grid>
                    <Grid style={{display:"flex"}}>
                        <img style={{position:"relative",marginLeft:"70%",marginTop:"100px"}} src={LogoPaqueteria} width="25%"></img>
                    </Grid>
                </Grid>
            </Grid>
        );
    }
}

TrackingEmail.propTypes = {};

export default TrackingEmail;

function TabPanel(props) {
    const { children, value, index, ...other } = props;
    return (
        <div
            role="tabpanel"
            hidden={value !== index}
            id={`simple-tabpanel-${index}`}
            aria-labelledby={`simple-tab-${index}`}
            {...other}
        >
            {value === index && (
                <Box sx={{ p: 3 }}>
                    <Typography>{children}</Typography>
                </Box>
            )}
        </div>
    );
}

TabPanel.propTypes = {
    children: PropTypes.node,
    index: PropTypes.number.isRequired,
    value: PropTypes.number.isRequired,
};