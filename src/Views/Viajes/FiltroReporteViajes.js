import React, {Component} from 'react';
import {Button, Dialog, DialogContent, Grid, Typography} from "@mui/material";
import TextField from "@mui/material/TextField";
import {obtenerSucursales} from "../../Util/Contexts/SucursalContext";
import MultiSelect from "@kenshooui/react-multi-select";
import {imprimirFormatosECCId, imprimirFormatosId} from "../../Util/Contexts/FormatosImpresionContext";
import DialogTableClientes from "../Clientes/DialogTableClientes";
import Noty from "noty";

function showError(mensaje) {
    new Noty({
        type: "warning",
        layout: "topCenter",
        text: mensaje,
        timeout: "8000"
    }).show()
}
function showSuccess(mensaje) {
    new Noty({
        type: "information",
        layout: "topCenter",
        text: mensaje,
        timeout: "5000"
    }).show()
}
class FiltroReporteViajes extends Component {

    constructor(props) {
        super(props);
        var today = new Date();
        this.state = {
            fechaInicial: today.getFullYear() + "-" + ((today.getMonth() + 1) <= 9 ? ("0" + (today.getMonth() + 1)) : (today.getMonth() + 1)) + "-01",
            fechaFinal: today.getFullYear() + "-" + ((today.getMonth() +1) <= 9 ? ("0"+(today.getMonth() +1)) : (today.getMonth() +1)) + "-" + (today.getDate() <= 9 ? ("0"+today.getDate()) : today.getDate()),
            sucursalesSeleccionadas: [],
            showDialogClientes:false,
            cliente:null
        }
        this.handleChange = this.handleChange.bind(this)
        this.handleChangeSucursales = this.handleChangeSucursales.bind(this)
        this.imprimirFormato = this.imprimirFormato.bind(this)
        this.handleDialogVisible=this.handleDialogVisible.bind(this)
        this.handlePatrocinadorSelected=this.handlePatrocinadorSelected.bind(this)
    }

    componentDidMount() {

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

        if((this.props.select?.m_nTipoProceso !==43)&&(this.props.select?.m_nTipoProceso !==44)){
            if (this.state.sucursalesSeleccionadas.length === 0) {
                showError("Es necesario seleccionar al menos un destino")
                return
            }
            imprimirFormatosId(this.props.select.m_nIdFormato, this.state.fechaInicial, this.state.fechaFinal,this.state.sucursalesSeleccionadas).then(({data}) => {
                let pdfWindow = window.open("");
                pdfWindow.document.write("<embed  width='100%' height='100%' src='data:application/pdf;base64, " + encodeURI(data.m_sArchivo)+"'/>");
                pdfWindow.document.body.style.margin = "0px";
                pdfWindow.document.title = this.props.select.m_sFormato;
            })
        }
        else if(this.props.select?.m_nTipoProceso !==44) {
            imprimirFormatosECCId(this.props.select.m_nIdFormato, this.state.fechaInicial, this.state.fechaFinal, this.state.cliente.m_nIdCliente).then(({data}) => {
                /*console.log(data)
                var mediaType="data:application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;base64,";
                var a = document.createElement('a');
                a.href = mediaType+encodeURI(data.m_sArchivo);
                a.download = this.props.select.m_sFormato+'.xlsx';
                a.textContent = 'Descargar Archivo';
                document.body.appendChild(a);
                a.click();
                a.remove();*/
                var mediaType="data:text/plain;charset=utf-8,";
                var a = document.createElement('a');
                a.href = mediaType+encodeURI(data.m_sArchivo);
                a.download = this.props.select.m_sFormato+'.txt';
                a.textContent = 'Descargar Archivo';
                document.body.appendChild(a);
                a.click();
                a.remove();

                /*let pdfWindow = window.open("");
                pdfWindow.document.write("<embed  width='100%' height='100%' src='data:application/pdf;base64, " + encodeURI(data.m_sArchivo)+"'/>");
                pdfWindow.document.body.style.margin = "0px";
                pdfWindow.document.title = this.props.select.m_sFormato;*/
            })

        }
        else{
            imprimirFormatosECCId(this.props.select.m_nIdFormato, this.state.fechaInicial, this.state.fechaFinal, this.state.cliente.m_nIdCliente).then(({data}) => {
                var mediaType="data:application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;base64,";
                var a = document.createElement('a');
                a.href = mediaType+encodeURI(data.m_sArchivo);
                a.download = this.props.select.m_sFormato+'.xlsx';
                a.textContent = 'Descargar Archivo';
                document.body.appendChild(a);
                a.click();
                a.remove();

                /*
                let pdfWindow = window.open("");
                pdfWindow.document.write("<embed  width='100%' height='100%' src='data:application/pdf;base64, " + encodeURI(data.m_sArchivo)+"'/>");
                pdfWindow.document.body.style.margin = "0px";
                pdfWindow.document.title = this.props.select.m_sFormato;*/
            })
        }
    }
    handleDialogVisible(isVisible) {
        this.setState({
            showDialogClientes: isVisible,
        });
    };

    handlePatrocinadorSelected (row){
        this.setState( ({
            showDialogClientes: false,
            cliente: row
        }))

    }

    render() {
        return (
            <div>
                <Dialog
                    open={this.state.showDialogClientes}
                    onClose={() => this.setState({showDialogClientes: false})}
                    fullWidth maxWidth="md"
                >
                    <DialogContent>
                        <div className="row" style={{backgroundColor: '#FFFFFF'}}>
                            <DialogTableClientes dialogVisible={this.handleDialogVisible } handlePatrocinadorSelected={this.handlePatrocinadorSelected}/>
                        </div>
                    </DialogContent>
                </Dialog>
                <form onSubmit={this.imprimirFormato}>
                    {
                        this.props.visible &&
                        <>
                            <Typography variant={"h3"}>{this.props.select ? this.props.select.m_sFormato : ""} </Typography> <br/>
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
                                {
                                    this.props.select?.m_nTipoProceso !==43 && this.props.select?.m_nTipoProceso !==44 &&
                                    <Grid item md={12}>
                                        <Typography variant={"h4"}>Destinos:</Typography>
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
                                            items={this.props.origenesDestinos.map(s => ({id:s.m_nIdCiudad, label:s.m_sCiudad}))}
                                            selectedItems={this.state.sucursalesSeleccionadas}
                                            onChange={this.handleChangeSucursales}
                                        />
                                    </Grid>
                                }

                                {
                                    (this.props.select?.m_nTipoProceso !==43 || this.props.select?.m_nTipoProceso !==44) &&
                                    <Grid item xs={3}>
                                        <TextField
                                            variant="outlined"
                                            label="Cliente"
                                            margin="dense"
                                            required
                                            value={this.state.cliente?.m_sNombreFiscal}
                                            placeholder={"No. Cliente: Nombre fiscal"}
                                            InputLabelProps={{shrink: true}}
                                            onClick={(this.props.disabled) ?
                                                () => {
                                                    return
                                                } : (() => {
                                                    this.setState({showDialogClientes: true})
                                                })}
                                            disabled={this.props.disabled}
                                        />
                                    </Grid>
                                }


                                <Grid item md={12}>
                                    <button type={"submit"}
                                            className="btn btn-primary primary-btn">Imprimir
                                    </button>
                                    <button onClick={() => {
                                        this.props.abrirPantalla(1, null)
                                        this.setState({
                                            cliente:null
                                        })
                                    }

                                    }
                                            className="btn btn-secondary secondary-btn">Regresar
                                    </button>
                                </Grid>
                            </Grid>
                        </>
                    }

                </form>
            </div>

        );
    }
}

FiltroReporteViajes.propTypes = {};

export default FiltroReporteViajes;

