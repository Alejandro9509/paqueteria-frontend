import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {Button, Grid, Typography} from "@material-ui/core";
import TextField from "@material-ui/core/TextField";
import {obtenerSucursales} from "../../Util/Contexts/SucursalContext";
import MultiSelect from "@kenshooui/react-multi-select";
import {imprimirFormatosId} from "../../Util/Contexts/FormatosImpresionContext";
import Noty from "noty";

function showError(mensaje) {
    new Noty({
        type: "warning",
        layout: "topCenter",
        text: mensaje,
        timeout: "8000"
    }).show()
}
class FiltroReporteViajes extends Component {

    constructor(props) {
        super(props);
        const today = new Date();
        this.state = {
            fechaInicial: today.getFullYear() + "-" + ((today.getMonth() - 3) <= 9 ? ("0" + (today.getMonth() - 3)) : (today.getMonth() - 3)) + "-" + (today.getDate() <= 9 ? ("0"+today.getDate()) : today.getDate()),
            fechaFinal: today.getFullYear() + "-" + ((today.getMonth() +1) <= 9 ? ("0"+(today.getMonth() +1)) : (today.getMonth() +1)) + "-" + (today.getDate() <= 9 ? ("0"+today.getDate()) : today.getDate()),
            sucursales: [],
            sucursalesSeleccionadas: []
        }
        this.handleChange = this.handleChange.bind(this)
        this.handleChangeSucursales = this.handleChangeSucursales.bind(this)
        this.imprimirFormato = this.imprimirFormato.bind(this)
    }

    componentDidMount() {
        obtenerSucursales().then(({data}) => {
            this.setState({sucursales: data})
        })
    }

    handleChange(event) {
        event.preventDefault()
        this.setState({
            [event.target.name]: event.target.value,
        });
    };
    handleChangeSucursales(value) {
        this.setState({
            sucursalesSeleccionadas: value,
        });
    };
    
    imprimirFormato(event){
        event.preventDefault()
        if (this.state.sucursalesSeleccionadas.length === 0) {
            showError("Es necesario seleccionar al menos una sucursal")
            return
        }
        imprimirFormatosId(this.props.select.m_nIdFormato, this.state.fechaInicial, this.state.fechaFinal,this.state.sucursalesSeleccionadas).then(({data}) => {
            console.log(data)
            let pdfWindow = window.open("");
            pdfWindow.document.write("<embed  width='100%' height='100%' src='data:application/pdf;base64, " + encodeURI(data.m_sArchivo)+"'/>");
            pdfWindow.document.body.style.margin = "0px";
            pdfWindow.document.title = this.props.select.m_sFormato;
        })
    }
    
    render() {
        return (
            <form onSubmit={this.imprimirFormato}>
                <Typography variant={"h3"}>{this.props.select.m_sFormato} </Typography> <br/>
                <Grid container spacing={1}>
                    <Grid item md={6}>
                        <TextField
                            variant="outlined" margin="dense"
                            onChange={this.handleChange}
                            className="form-control"
                            type="date"
                            InputLabelProps={{
                                shrink: true,
                            }}
                            inputProps={{
                                max:this.state.fechaFinal
                            }}
                            fullWidth
                            label="Fecha inicial"
                            value={this.state.fechaInicial}
                            id="fechaInicial"
                            name="fechaInicial"/>
                    </Grid>
                    <Grid item md={6}>
                        <TextField
                            variant="outlined" margin="dense"
                            onChange={this.handleChange}
                            className="form-control"
                            type="date"
                            InputLabelProps={{
                                shrink: true,
                            }}
                            inputProps={{
                                min:this.state.fechaInicial
                            }}
                            fullWidth
                            label="Fecha final"
                            value={this.state.fechaFinal}
                            id="fechaFinal"
                            name="fechaFinal"/>
                    </Grid>
                    <Grid item md={12}>
                        <Typography variant={"h4"}>Sucursales:</Typography>
                        <MultiSelect
                            showSelectedItems={false}
                            messages= {{
                                searchPlaceholder: "Buscar...",
                                noItemsMessage: "Sin datos...",
                                noneSelectedMessage: "Ninguno seleccionado",
                                selectedMessage: "Seleccionado",
                                selectAllMessage: "Seleccionar todos",
                                clearAllMessage: "Limpiar todos",
                            }}
                            items={this.state.sucursales.map(s => ({id:s.m_nIdSucursal, label:s.m_sSucursal}))}
                            selectedItems={this.state.sucursalesSeleccionadas}
                            onChange={this.handleChangeSucursales}
                        />
                    </Grid>

                    <Grid item md={12}>
                        <button type={"submit"}
                                className="btn btn-primary primary-btn">Imprimir
                        </button>
                        <button onClick={() => this.props.abrirPantalla(1, null)}
                                className="btn btn-secondary secondary-btn">Regresar
                        </button>
                    </Grid>
                </Grid>
            </form>
        );
    }
}

FiltroReporteViajes.propTypes = {};

export default FiltroReporteViajes;
