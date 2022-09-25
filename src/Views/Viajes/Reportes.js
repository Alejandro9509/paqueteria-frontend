import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {ButtonBase, Grid, Paper, Typography} from "@material-ui/core";
import {obtenerFormatosImpresion, obtenerFormatosImpresionProceso} from "../../Util/Contexts/FormatosImpresionContext";
import FiltroReporteViajes from "./FiltroReporteViajes";
import {obtenerCiudades} from "../../Util/Contexts/CiudadesContext";

class ReportesViajes extends Component {
    constructor(props) {
        super(props);
        this.state = {
            reportes: [],
            pantalla:2,
            reporteSeleccionado: null,
            origenesdestinos: [],
        }
        this.abrirPantalla = this.abrirPantalla.bind(this)
    }


    componentDidMount() {
        obtenerFormatosImpresionProceso(42).then(({data}) => {
            this.setState({
                reportes: data,
                pantalla: 1
            })
        })
        obtenerCiudades().then(({data}) => {
            this.setState({origenesdestinos: data})
        })
    }

    abrirPantalla(pantalla, valor){
        this.setState({pantalla: pantalla, reporteSeleccionado: valor})
    }

    render() {
        return (
            <div className="widget-wrap">
                <div className="widget-content j-forms row">
                    {
                        this.state.pantalla ===1 &&
                        <Grid container style={{padding:"10px"}} justifyContent="space-between" alignItems="stretch">
                            {
                                this.state.reportes.map((r,index) => {
                                    return (
                                        <Grid item md={6} sm={12} key={r.m_nIdFormato}>
                                            <ButtonBase onClick={() => this.abrirPantalla(2, r)}>
                                                <Paper elevation={1} style={{margin:"5px"}}>
                                                    <Typography variant={"h3"}>{index+1}. {r.m_sFormato}</Typography>
                                                </Paper>
                                            </ButtonBase>
                                        </Grid>
                                    )
                                })
                            }
                        </Grid>
                    }
                    <FiltroReporteViajes origenesDestinos={this.state.origenesdestinos} visible={ this.state.pantalla === 2} select={this.state.reporteSeleccionado} abrirPantalla={this.abrirPantalla}/>




                </div>
            </div>
        );
    }
}

ReportesViajes.propTypes = {};

export default ReportesViajes;
