import React, {Component} from 'react';
import Cabecera from "../../Components/Template/Cabecera";
import BarraLateralIzquierda from "../../Components/Template/BarraLateralIzquierda";
import {
    Box,
    Button,
    Checkbox,
    createFilterOptions,
    FormControlLabel,
    FormGroup,
    FormLabel,
    Grid,
    Radio,
    RadioGroup,
    TextField,
    Typography
} from "@mui/material";
import InformacionBasica from "./InformacionBasica";
import RemitenteDestinatario from "./RemitenteDestinatario";
import Paquetes from "../Paquetes/Paquetes";
import Timeline from "react-time-line";
import ConceptosFacturacionGuias from "../Tarifas/ConceptosFacturacionGuias";
import {obtenerInformeFolioTipo} from "../../Util/Contexts/SeguimientoContext";
import moment from "moment";
import 'moment/locale/es';
import { obtenerImagenEvidencia } from '../../Util/Contexts/UltimaMillaContext';
import DialogoEvidenciasUltimaMilla from "../UltimaMilla/DialogoEvidenciasUltimaMilla";
import { Autocomplete } from '@mui/material';
import { obtenerFoliosSeguimiento } from "../../Util/Contexts/SeguimientoContext";
import {showSuccess} from "../../Util/Util";
const events = [
    {ts: "2017-09-17T12:22:46.587Z", text: 'Logged in'},
    {ts: "2017-09-17T12:21:46.587Z", text: 'Clicked Home Page'},
    {ts: "2017-09-17T12:20:46.587Z", text: 'Edited Profile'},
    {ts: "2017-09-16T12:22:46.587Z", text: 'Registred'},
    {ts: "2017-09-16T12:21:46.587Z", text: 'Clicked Cart'},
    {ts: "2017-09-16T12:20:46.587Z", text: 'Clicked Checkout'},
];

const OPTIONS_LIMIT = 100;
const filterOptions = createFilterOptions({
    limit: OPTIONS_LIMIT
});

class Seguimiento extends Component {
    constructor(props) {
        super(props);
        this.state = {
            folioBusqueda: "",
            tipoBusqueda: "3",
            data:{},
            imagenesEvidenciaRecoleccion:[],
            imagenesEvidenciaEmbarque:[],
            esRecoleccion:false,
            setOpenDialogEvidenciasRecoleccion:false,
            setOpenDialogEvidenciasEntrega:false,
            foliosAutocomplete: {},
        }
        this.handleChage = this.handleChage.bind(this)
        this.buscarAction = this.buscarAction.bind(this)
        this.handleClickOpenDialogoEvidencia = this.handleClickOpenDialogoEvidencia.bind(this)
        this.handleClickCloseDialogoEvidenciaRecoleccion = this.handleClickCloseDialogoEvidenciaRecoleccion.bind(this)
        this.handleClickCloseDialogoEvidenciaEntrega = this.handleClickCloseDialogoEvidenciaEntrega.bind(this)

    }

    componentDidMount() {
        obtenerFoliosSeguimiento()
            .then((res) => {
                this.setState({
                    foliosAutocomplete: res.data.embarques
                        .concat(res.data.recolecciones)
                        .concat(res.data.guias),
                });
            })
            .catch((err) => {});
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
        this.setState({
            imagenesEvidenciaRecoleccion:[],
            imagenesEvidenciaEmbarque:[],
            data: {},
        })
        obtenerInformeFolioTipo(this.state.folioBusqueda,this.state.tipoBusqueda).then(({data}) => {
            if(data.Estatus == true){
                obtenerImagenEvidencia(data.m_nIdRecoleccion?data.m_nIdRecoleccion:-1,1).then(respuestaRec=>{
                    obtenerImagenEvidencia(data.m_nIdGuia,0).then(respuestaEmb=>{
                        this.setState({
                            imagenesEvidenciaRecoleccion:respuestaRec.data?respuestaRec.data:[],
                            imagenesEvidenciaEmbarque:respuestaEmb.data?respuestaEmb.data:[],
                            data: data
                        })
                    })
                })
            }else{
                showSuccess(data)
                return;
            }
            
        })
    }
    handleClickCloseDialogoEvidenciaRecoleccion(openDialog){
        this.setState({
            setOpenDialogEvidenciasRecoleccion: openDialog
        })

    }

    handleClickCloseDialogoEvidenciaEntrega(openDialog){
        this.setState({
            setOpenDialogEvidenciasEntrega: openDialog
        })

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
    render() {


        moment.locale("es");
        return (
            <div>
                { (this.state.setOpenDialogEvidenciasRecoleccion && (this.state.imagenesEvidenciaRecoleccion)) &&
                    <DialogoEvidenciasUltimaMilla
                        open={this.state.setOpenDialogEvidenciasRecoleccion}
                        setCloseDialog={this.handleClickCloseDialogoEvidenciaRecoleccion}
                        imagenes={this.state.imagenesEvidenciaRecoleccion}
                    />
                }
                { (this.state.setOpenDialogEvidenciasEntrega && (this.state.imagenesEvidenciaEmbarque)) &&
                    <DialogoEvidenciasUltimaMilla
                        open={this.state.setOpenDialogEvidenciasEntrega}
                        setCloseDialog={this.handleClickCloseDialogoEvidenciaEntrega}
                        imagenes={this.state.imagenesEvidenciaEmbarque}
                    />
                }
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
                                <Grid container alignItems={"center"} justifyContent={"flex-start"}>

                                    <Grid item>
                                        <Typography style={{display: "flex", alignItems: "center"}}>Folio
                                            seguimiento: {/* <input type={"text"}
                                                                    style={{width: "50%", height:"20px"}}
                                                                    onChange={this.handleChage}
                                                                    value={this.state.folioBusqueda}
                                                                    name={"folioBusqueda"}/> */}</Typography>
                                    </Grid>
                                    <Grid item>
                                        {/* <input type={"text"}
                                                                    style={{width: "50%", height:"20px"}}
                                                                    onChange={this.handleChage}
                                                                    value={this.state.folioBusqueda}
                                                                    name={"folioBusqueda"}/> */}
                                        <div
                                            style={{
                                                display: "flex",
                                                alignItems: "center",
                                                justifyContent: "center",
                                                marginBottom: "10px",
                                            }}
                                        >
                                            <Autocomplete
                                                id="free-solo-demo"
                                                freeSolo
                                                size={"small"}
                                                style={{
                                                    width: "150px",
                                                    paddingRight: "8px",
                                                    paddingLeft: "8px",
                                                }}
                                                onChange={(event, newValue) => {
                                                    this.setState({
                                                        folioBusqueda: newValue,
                                                    });
                                                }}
                                                options={this.state.foliosAutocomplete}
                                                filterOptions={filterOptions}
                                                getOptionLabel={(option) => option}
                                                renderInput={(params) => (
                                                    <TextField
                                                        {...params}
                                                        variant="outlined"
                                                        name={"folioBusqueda"}
                                                        onChange={this.handleChage}
                                                    />
                                                )}
                                            />
                                        </div>
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
                                <Grid container alignItems={"stretch"} justifyContent={"flex-start"} spacing={1} style={{margin:"0px"}}>
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
                                         <Box display="flex" p={1} bgcolor="background.paper" flexDirection="column" textAlign="center" alignItems="center">
                                        <Typography variant={"h4"} style={{marginBottom:"10px"}}>Recolección</Typography>
                                             <Grid item md={12}>
                                                 Entregó: {this.state.data.m_sReceptorRecoleccion}
                                                 <Button fullWidth variant="text" color="primary" onClick={() => this.handleClickOpenDialogoEvidencia(true, true)}>
                                                     Ver evidencias de recolección
                                                 </Button>
                                             </Grid>
                                        {/*{
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
                                           }*/}
                                        
                                         </Box>
                                            
                                         </Grid>
                                         <Grid item md={12}>
                                             <Box display="flex" p={1} bgcolor="background.paper" flexDirection="column"
                                                  alignItems="center" textAlign="center">
                                                 <Typography variant={"h4"}
                                                             style={{marginBottom: "10px"}}>Entrega</Typography>
                                                 <Grid item md={6}>
                                                     Entregó: {this.state.data.operadorEntrega}
                                                     <br/>
                                                     Recibió: {this.state.data.m_sReceptorGuia}
                                                     <Button fullWidth variant="text" color="primary"
                                                             onClick={() => this.handleClickOpenDialogoEvidencia(true, false)}>
                                                         Ver evidencias de entrega
                                                     </Button>
                                                 </Grid>
                                                 {/*{
                                                     this.state.imagenesEvidenciaEmbarque.length == 0 ?
                                                         <Typography variant={"h5"}>No hay evidencias</Typography> :

                                                         <Grid item md={6}>

                                                             <div id="divEmbarque">
                                                                 {this.state.imagenesEvidenciaEmbarque.reverse().map((img, index) => (
                                                                     <img style={{
                                                                         width: "180px",
                                                                         height: "180px",
                                                                         margin: "0 0 0 -10px",
                                                                         marginBottom: "10px",
                                                                         outline: "solid 1px black"
                                                                     }}
                                                                          src={`data:image/jpeg;base64,${img.m_sImagen}`}
                                                                          key={index}/>))
                                                                 }
                                                                 Recibió: {this.state.data.m_sReceptorGuia}
                                                             </div>

                                                         </Grid>

                                                 }*/}
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
            </div>
        );
    }
}

Seguimiento.propTypes = {};

export default Seguimiento;
