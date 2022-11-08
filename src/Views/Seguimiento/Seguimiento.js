import React, {Component} from 'react';
import PropTypes from 'prop-types';
import Cabecera from "../../Components/Template/Cabecera";
import BarraLateralIzquierda from "../../Components/Template/BarraLateralIzquierda";
import {
    Box,
    Button,
    Checkbox, FormControlLabel, FormGroup, FormLabel, Grid, Radio, RadioGroup, TextField, Typography
} from "@material-ui/core";
import InformacionBasico from "./InformacionBasica";
import InformacionBasica from "./InformacionBasica";
import RemitenteDestinatario from "./RemitenteDestinatario";
import Paquetes from "../Paquetes/Paquetes";
import Timeline from "react-time-line";
import ConceptosFacturacionGuias from "../Tarifas/ConceptosFacturacionGuias";
import {obtenerInformeFolioTipo} from "../../Util/Contexts/SeguimientoContext";
import moment from "moment";
import 'moment/locale/es';
import { obtenerImagenEvidencia } from '../../Util/Contexts/UltimaMillaContext';

const events = [
    {ts: "2017-09-17T12:22:46.587Z", text: 'Logged in'},
    {ts: "2017-09-17T12:21:46.587Z", text: 'Clicked Home Page'},
    {ts: "2017-09-17T12:20:46.587Z", text: 'Edited Profile'},
    {ts: "2017-09-16T12:22:46.587Z", text: 'Registred'},
    {ts: "2017-09-16T12:21:46.587Z", text: 'Clicked Cart'},
    {ts: "2017-09-16T12:20:46.587Z", text: 'Clicked Checkout'},
];
class Seguimiento extends Component {
    constructor(props) {
        super(props);
        this.state = {
            folioBusqueda: "",
            tipoBusqueda: "3",
            data:{},
            imagenesEvidenciaRecoleccion:[],
            imagenesEvidenciaEmbarque:[],
            esRecoleccion:false
        }
        this.handleChage = this.handleChage.bind(this)
        this.buscarAction = this.buscarAction.bind(this)

    }

    componentDidMount() {

    }

    handleChage(e){
        e.preventDefault()
        console.log(e.target.name)
        this.setState({
            [e.target.name] : e.target.value
        })
    }

    buscarAction(e) {
        e.preventDefault()
        obtenerInformeFolioTipo(this.state.folioBusqueda,this.state.tipoBusqueda).then(({data}) => {
            obtenerImagenEvidencia(data.m_nIdRecoleccion,1).then(respuestaRec=>{
                obtenerImagenEvidencia(data.m_nIdGuia,0).then(respuestaEmb=>{
                    this.setState({
                        imagenesEvidenciaRecoleccion:respuestaRec.data?respuestaRec.data:[],
                        imagenesEvidenciaEmbarque:respuestaEmb.data?respuestaEmb.data:[],
                        data: data
                    })
                })
            })
        })
    }
    render() {
        var imgsEmbarque =  this.state.imagenesEvidenciaEmbarque.map( img=>{
              return `<img style={{width: "180px", height: "180px",transform:"rotate(90deg)",margin: "0 0 0 -10px"}}
             src=data:image/jpeg;base64,${img.m_sImagen}`
        }
         ).join('')

        moment.locale("es");
        return (<div>
            <header className="topbar clearfix">
                <Cabecera titulo="Seguimiento">
                    <div className="page-header">
                        <ul className="list-page-breadcrumb">
                            <li className="active-page">Seguimiento</li>
                        </ul>
                    </div>
                </Cabecera>
            </header>

            {/*Leftbar Start Here*/}
            <aside className="iconic-leftbar">
                <BarraLateralIzquierda/>
            </aside>
            {/*Leftbar End Here*/}

            {/*Page Container Start Here*/}
            <section className="main-container">
                <div className="container-fluid">
                    <div className="widget-wrap">

                        <div className="widget-content">
                            <Grid container alignItems={"center"} justify={"flex-start"}>

                                <Grid item>
                                    <Typography style={{display: "flex", alignItems: "center"}}>Folio
                                        seguimiento: <input type={"text"}
                                                                style={{width: "50%", height:"20px"}}
                                                                onChange={this.handleChage}
                                                                value={this.state.folioBusqueda}
                                                                name={"folioBusqueda"}/></Typography>
                                </Grid>
                                <Grid item>
                                    <RadioGroup row aria-label="position" onChange={this.handleChage} name="tipoBusqueda" value={this.state.tipoBusqueda} defaultValue="top">
                                        <FormControlLabel
                                            value="1"
                                            control={<Radio color="primary"/>}
                                            label="Folio Recolección"
                                            labelPlacement="end"
                                        />
                                        <FormControlLabel
                                            value="2"
                                            control={<Radio color="primary"/>}
                                            label="Folio Embarque"
                                            labelPlacement="end"
                                        />
                                        <FormControlLabel
                                            value="3"
                                            control={<Radio color="primary"/>}
                                            label="Folio Guía"
                                            labelPlacement="end"
                                        />
                                        <FormControlLabel value="4" control={<Radio color="primary"/>}
                                                          label="Factura"/>
                                        <FormControlLabel
                                            value="5"
                                            control={<Radio color="primary"/>}
                                            label="Tracking"
                                            labelPlacement="end"
                                        />
                                    </RadioGroup>
                                </Grid>
                                <Grid item>
                                    <Button size={"small"} color={"primary"} onClick={this.buscarAction} variant={"contained"}>Buscar</Button>
                                </Grid>
                            </Grid>
                        </div>

                        {
                            Object.keys(this.state.data).length !== 0 &&
                            <div style={{padding: "10px"}}>
                                <InformacionBasica data={this.state.data}/>
                            </div>
                        }
                        {
                            Object.keys(this.state.data).length !== 0 &&
                            <div style={{padding: "5px",borderStyle: "solid",borderWidth: "1px",borderRadius: "10px"}}>
                                <RemitenteDestinatario data={this.state.data}/>
                            </div>
                        }
                        {
                            Object.keys(this.state.data).length !== 0 &&
                            <div style={{marginTop:"4px",padding: "5px",borderStyle: "solid",borderWidth: "1px",borderRadius: "10px"}}>
                                <Typography variant={"h4"} align={"center"}>Paquetes y Sobres</Typography>
                                <Paquetes
                                    dataPaquetes={this.state.data.paquetes}
                                    onChangeList={() => console.log("")}
                                    disabled={true}
                                />
                            </div>
                        }

                        {
                            Object.keys(this.state.data).length !== 0 &&
                            <Grid container alignItems={"stretch"} justify={"flex-start"} spacing={1} style={{margin:"0px"}}>
                                <Grid item md={6}>
                                    <div lang={"es"} style={{
                                        marginTop: "4px",
                                        padding: "5px",
                                        borderStyle: "solid",
                                        borderWidth: "1px",
                                        borderRadius: "10px"
                                    }}>
                                        <Timeline items={this.state.data.bitacora ? this.state.data.bitacora.map(b => ({
                                            ts: b.Fecha + "T" + b.Hora,
                                            text: b.Descripcion
                                        })) : []} format="hh:mm a"/>

                                    </div>
                                  <div>
                                    <div style={{marginTop:"4px",padding: "5px",borderStyle: "solid",borderWidth: "1px",borderRadius: "10px"}}>
                                     <Grid container spacing={3}>
                                     <Grid item md={12}>
                                        <Typography variant={"h4"} align={"center"}>Evidencias</Typography>
                                     </Grid>

                                     <Grid item md={6}  style={{borderRight: "dotted 2px rgb(249, 160, 62)"}}>
                                     <Box display="flex" p={1} bgcolor="background.paper" flexDirection="column" alignItems="center">
                                    <Typography variant={"h4"} style={{marginBottom:"10px"}}>Recolección</Typography>
                                    {
                                    this.state.imagenesEvidenciaRecoleccion.length == 0?
                                     <Typography variant={"h5"} style={{margin:"20%"}}>No hay evidencias</Typography>:
                                    this.state.imagenesEvidenciaRecoleccion.length != 0 &&
                                    <Grid item md={6}>
                                       <div id="divRecoleccion">

                                        {this.state.imagenesEvidenciaRecoleccion.reverse().map( (img,index)=>(
                                                    <img style={{width: "180px", height: "180px",margin: "0 0 0 -10px",marginBottom:"10px",outline:"solid 1px black"}}
                                                     src={`data:image/jpeg;base64,${img.m_sImagen}`} key={index} />))
                                        }
                                           Entregó: {this.state.data.m_sReceptorRecoleccion}
                                          </div>
                                                                      
                                    </Grid>
                                       }

                                     </Box>

                                     </Grid>
                                     <Grid item md={6}>
                                     <Box display="flex" p={1} bgcolor="background.paper" flexDirection="column"  alignItems="center">
                                        <Typography variant={"h4"} style={{marginBottom:"10px"}}>Entrega</Typography>
                                         {
                                         this.state.imagenesEvidenciaEmbarque.length == 0?
                                            <Typography variant={"h5"} >No hay evidencias</Typography>:

                                        <Grid item md={6}>

                                          <div id="divEmbarque">
                                          {this.state.imagenesEvidenciaEmbarque.reverse().map( (img,index)=>(
                                           <img style={{width: "180px", height: "180px",margin: "0 0 0 -10px",marginBottom:"10px",outline:"solid 1px black"}}
                                            src={`data:image/jpeg;base64,${img.m_sImagen}`} key={index} />))
                                             }
                                            Recibió: {this.state.data.m_sReceptorGuia}
                                          </div>

                                        </Grid>

                                        }
                                        </Box>
                                     </Grid>


                                        </Grid>
                                    </div>
                                    </div>

                                </Grid>
                                <Grid item md={6}>
                                    <div style={{
                                        marginTop: "4px",
                                        padding: "5px",
                                        borderStyle: "solid",
                                        borderWidth: "1px",
                                        borderRadius: "10px"
                                    }}>
                                        <ConceptosFacturacionGuias
                                            keys={0}
                                            disabled={true}
                                            dataPaquetes={this.state.data.conceptos}
                                            conceptosBase={[]}
                                        />

                                    </div>
                                </Grid>
                            </Grid>

                        }


                    </div>
                </div>
            </section>
        </div>);
    }
}

Seguimiento.propTypes = {};

export default Seguimiento;
