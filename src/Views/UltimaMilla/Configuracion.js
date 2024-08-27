import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {Grid, Typography, RadioGroup, FormControlLabel, Radio, FormLabel} from "@mui/material"

class Configuracion extends Component {
    constructor(props) {
        super(props);
    }

    componentWillMount() {

    }

    componentDidMount() {

    }


    componentWillUnmount() {

    }

    render() {
        return (
            <Grid container className={"j-form"}>
                <Grid item md={6}>
                    <Typography variant={"h4"}>Sistema Unidad</Typography>
                    <RadioGroup aria-label="sistemaUnidad" name="sistemaUnidad" value={this.props.values.sistemaUnidad}>
                        <Grid container>
                            <Grid item>
                                <FormControlLabel value="1" control={<Radio/>} label="Kilómetros"/>
                            </Grid>
                            {/*<Grid item>
                                <FormControlLabel value="2" control={<Radio/>} label="Millas"/>
                            </Grid>
                             */}
                        </Grid>
                    </RadioGroup>
                </Grid>
                <Grid item md={6}>
                    <Typography variant={"h4"}>Optimizar</Typography>
                    <RadioGroup aria-label="optimizar" name="optimizar" value={this.props.values.optimizar}>
                        <Grid container>
                         {/*   <Grid item>
                                <FormControlLabel value="1" control={<Radio/>} label="Distancia"/>
                            </Grid>
                         */}
                            <Grid item>
                                <FormControlLabel value="2" control={<Radio/>} label="Tiempo"/>
                            </Grid>
                        </Grid>
                    </RadioGroup>
                </Grid>
                <Grid item md={6}>
                    <Typography variant={"h4"}>Creación de rutas</Typography>

                    <RadioGroup onChange={(e) => this.props.changeValue(e.target.name,e.target.value)} aria-label="tipoBusqueda" name="tipoBusqueda" value={this.props.values.tipoBusqueda}>
                        <Grid container>
                            <Grid item>
                                <FormControlLabel value="1" control={<Radio/>} label="Solo entregas"/>
                            </Grid>
                            <Grid item>
                                <FormControlLabel value="2" control={<Radio/>} label="Solo recolecciones"/>
                            </Grid>
                            <Grid item>
                                <FormControlLabel value="3" control={<Radio/>} label="Ambos"/>
                            </Grid>
                        </Grid>
                    </RadioGroup>
                </Grid>
                <Grid item md={6}>
                    <Typography variant={"h4"}>Unidades</Typography>
                        <Grid container>
                            <Grid item>

                            <Radio style={{margin:"0px -11px"}} type="checkbox" onChange={(e) => this.props.changeValue(e.target.name,e.target.checked)} name="unidades" checked={this.props.values.unidades} />
                            <FormLabel style={{color:"#878789",padding:"0 5px"}} >Una unidad</FormLabel>

                           </Grid>
                        </Grid>
                </Grid>

                <Grid item md={12}>
                    <Typography variant={"h4"}>Pantalla completa</Typography>
                    <Grid container spacing={2}>
                        <Grid item>
                            <label className="checkbox">

                                <input
                                    checked={this.props.fullScreenData.chatFullscreen}
                                    style={{marginRight: "5px", marginLeft: "0px", position: "relative"}}
                                    type="checkbox"
                                    name={"chatFullscreen"}
                                    onClick={(event) => this.props.changeConfigurationFullScreen(event.target.name, event.target.checked)}/>
                                <i/>
                                Chat Repartidores
                            </label>
                        </Grid>
                        <Grid item>
                            <label className="checkbox">
                                <input
                                    checked={this.props.fullScreenData.cronogramaFullscreen}
                                    style={{marginRight: "5px", marginLeft: "0px", position: "relative"}}
                                    type="checkbox"
                                    name={"cronogramaFullscreen"}
                                    onClick={(event) => this.props.changeConfigurationFullScreen(event.target.name, event.target.checked)}/>
                                <i/>
                                Cronograma
                            </label>
                        </Grid>
                        <Grid item>
                            <label className="checkbox">
                                <input
                                    checked={this.props.fullScreenData.resumenFullscreen}
                                    style={{marginRight: "5px", marginLeft: "0px", position: "relative"}}
                                    type="checkbox"
                                    name={"resumenFullscreen"}
                                    onClick={(event) => this.props.changeConfigurationFullScreen(event.target.name, event.target.checked)}
                                />
                                <i/>
                                Resumen Paradas
                            </label>
                        </Grid>
                    </Grid>


                </Grid>
            </Grid>
        );
    }
}

Configuracion.propTypes = {};

export default Configuracion;
