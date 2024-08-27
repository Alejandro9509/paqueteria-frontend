import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {
    Button,
    Checkbox,
    DialogActions,
    DialogContent, DialogTitle,
    FormControl,
    FormControlLabel,
    Grid,
    InputLabel,
    Select,
    TextField, Typography
} from "@mui/material";
import { obtenerBancos } from '../../Util/Contexts/GuiaContext';
import MenuItem from "@mui/material/MenuItem";
import {numberToMoneyFormatt} from "../../Util/Util";
import $ from 'jquery';
window.jQuery = window.$ = $;
$.array=[]
function doThis(event){
    var picFile = event.target;
    var output = document.getElementById("result");

    let imageData=atob(picFile.result.replace(/^[^,]+,/, ''))
    let imageBytes = new Uint8Array(imageData.length);
    for (let j = 0; j < imageData.length; j++) {imageBytes[j] = imageData.charCodeAt(j);
    }

    $.array.push(imageBytes)
    //  this.state.dataImagenesEvidencia.push(picFile.result)
    var div = document.createElement("div");
    div.innerHTML = "<img style={{text-align: 'center'}} title='Evidencia' width='50%' height='50%' margin='10px' src='" + picFile.result + "'" +
        "title='" + picFile.name + "'/>";
    output.insertBefore(div, null);
}
class MyComponent extends Component {
    constructor(props) {
        super(props);
        this.state ={
            ...this.props.dataOcurre,
            dataImagenesEvidencia:[],
            recibe:'',
            dataBancos:[],
            aplicaDetalle:false,
            idBancoproveniente:0

        }
        this.handleFechaOcurre = this.handleFechaOcurre.bind(this)
        this.handleHoraOcurre = this.handleHoraOcurre.bind(this)
        this.handleChangeDataOcurre = this.handleChangeDataOcurre.bind(this)
        this.handleChangeChecked = this.handleChangeChecked.bind(this)
        this.handleFechaPago = this.handleFechaPago.bind(this)

    }

    componentDidMount(){
        obtenerBancos().then(respuesta=>{
            this.setState({
                dataBancos:respuesta.data
            })
        }).catch(function (err){
            console.log("Error al ejecutar el query"+err.data)
        })
        $.array=[]
            //Check File API support
            if (window.File && window.FileList && window.FileReader) {
                var filesInput = document.getElementById("files");
                filesInput.addEventListener("change", function(event) {
                    var files = event.target.files; //FileList object
                    var output = document.getElementById("result");
                    for (var i = 0; i < files.length; i++) {
                        var file = files[i];
                        //Only pics
                        if (!file.type.match('image'))
                            continue;
                        var picReader = new FileReader();
                        picReader.addEventListener("load", doThis);
                        //Read the image
                        picReader.readAsDataURL(file);

                    }
                });
            } else {
                console.log("Su navegador no soporta File API");
            }
    }

    componentDidUpdate(){
        console.log("Se refresca el componente Ocurre")
    }
    handleFechaOcurre(event) {
        event.preventDefault()
        this.setState({
            fechaOcurre: event.target.value,
        })
    }
    handleFechaPago(event) {
        event.preventDefault()
        this.setState({
            fechaPago: event.target.value,
        })
    }

    handleHoraOcurre(event){
        event.preventDefault()

        this.setState({
            horaOcurre: event.target.value,
        })
    }

    handleChangeDataOcurre (event){
        event.preventDefault()
        this.setState({
            [event.target.name]: event.target.value
        })
    }
    handleChangeChecked(event){
        this.setState({
            [event.target.name]: event.target.checked
        })
    }

    render() {
        return (
            <form onSubmit={(e) => {e.preventDefault();
                this.setState(state => {
                    return {
                        ...state,
                        dataImagenesEvidencia:$.array
                    }
                })
            this.props.handleEntregaOcurre(this.state,$.array)
            }}>
                <DialogTitle>Registrar entrega ocurre</DialogTitle>
                <DialogContent>
                    <Grid container spacing={2}>
                        <Grid item xs={6}>
                            <TextField
                                variant="outlined"
                                id="fechaOcurre"
                                name="fechaOcurre"
                                label="Fecha"
                                type="date"
                                onChange={this.handleFechaOcurre}
                                value={this.state.fechaOcurre}
                                className={"form-control"}
                                InputLabelProps={{shrink: true,}}
                                required={this.props.showDialogOcurre}
                            />
                        </Grid>
                        <Grid item xs={6}>
                            <TextField
                                variant="outlined"
                                id="horaOcurre"
                                name="horaOcurre"
                                label="Hora"
                                type="time"
                                key={"horaOcurre"}
                                value={this.state.horaOcurre}
                                onChange={this.handleHoraOcurre}
                                className={"form-control"}
                                InputLabelProps={{shrink: true,}}
                                inputProps={{step: 300,}}
                                required={this.props.showDialogOcurre}
                            />
                        </Grid>
                        {/*<Grid item xs={2}/>*/}
                        <Grid item xs={12}>
                            <FormControl fullWidth variant="outlined" size="small">
                                <InputLabel id="idTipoCobroLabel">Tipo Cobro</InputLabel>
                                <Select
                                    size="small"
                                    labelId={"idTipoCobroLabel"}
                                    label={"Tipo de cobro"}
                                    key={"tipoCobroOcurre"}
                                    className="form-control"
                                    value={this.props.dataOcurre.tipoCobroOcurre}
                                    disabled={true}
                                    onChange={(event) => {

                                        this.setState({
                                            tipoCobro: event.target.value,
                                        });
                                    }}
                                    id="tipoCobro"
                                    InputProps={{
                                        id: "tipoCobroOcurre",
                                        name: "tipoCobroOcurre"
                                    }}
                                >
                                    {this.props.dataTipoCobro.map((tipoCobro) => (
                                        <option
                                            key={tipoCobro.m_nIdTipoCobro}
                                            value={tipoCobro.m_nIdTipoCobro}
                                        >
                                            {tipoCobro.m_sDescripcion.toUpperCase()}
                                        </option>
                                    ))}
                                </Select>
                            </FormControl>
                        </Grid>
                        <Grid item xs={12}>
                            <FormControl fullWidth variant={'outlined'} size={"small"}>
                                <TextField size="small" fullWidth label={"Recibe"} name={"recibe"} className={"form-control"} variant={"outlined"}
                                value={this.state.recibe} onChange={(event) => this.handleChangeDataOcurre(event)}
                                           key={"recibe"}
                                           disabled={this.props.agregar === "Consultar"}>

                                </TextField>
                            </FormControl>
                        </Grid>
                        <Grid item xs={12} >
                            <FormControl fullWidth variant={'outlined'} size={"small"}>
                                <label style={{alignSelf:"center"}} htmlFor="files">Seleccione evidencia para adjuntarla</label>
                                <input style={{alignSelf:"center"}} id="files" name="file" type="file" multiple />
                                <output style={{textAlign:"center"}} id={"result"} ></output>
                            </FormControl>
                        </Grid>
                        {/*<Grid item xs={2}/>*/}
                        <Grid item xs={12}>
                            <FormControl fullWidth variant="outlined" size="small">
                                <InputLabel id="idTipoPagoLabel">Tipo Pago</InputLabel>
                                <Select
                                    labelId={"idTipoPagoLabel"}
                                    label={"Método de pago"}
                                    key={"idTipoPagoOcurre"}
                                    className="form-control"
                                    value={this.state.tipoPago}
                                    onChange={(event) => this.handleChangeDataOcurre(event)}
                                    id="tipoPago"
                                    InputProps={{
                                        id: "tipoPago",
                                        name: "tipoPago"
                                    }}
                                    name={"tipoPago"}
                                >
                                    {this.props.dataTipoPago.map((tipoPago) => (
                                        <MenuItem
                                            key={tipoPago.m_nIdTipoPago}
                                            value={tipoPago.m_nIdTipoPago}
                                        >
                                            {tipoPago.m_sTipoPago}
                                        </MenuItem>
                                    ))}
                                </Select>
                            </FormControl>
                        </Grid>
                        {/*<Grid item xs={2}/>*/}
                        <Grid item xs={12}>
                            <TextField
                                variant="outlined" label="Comentarios"
                                onChange={(event) => this.handleChangeDataOcurre(event)}
                                className="form-control"
                                type="text"
                                fullWidth
                                autoFocus
                                key={"comentarioOcurre"}
                                value={this.state.comentariosOcurre}
                                disabled={this.props.agregar === "Consultar"}
                                placeholder="Comentarios"
                                name="comentariosOcurre"
                                multiline
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <FormControlLabel
                                control={
                                    <Checkbox checked={this.state.aplicaDetalle}
                                              onChange={this.handleChangeChecked}
                                              name="aplicaDetalle"/>}
                                label="Aplica detalle de pago"
                            />
                        </Grid>

                        {this.state.aplicaDetalle && <>
                        <Grid item xs={6}>
                            <FormControl fullWidth variant="outlined" size="small">
                                <InputLabel id="idBancoproveniente">Banco proveniente</InputLabel>
                                <Select
                                    labelId={"idBancoproveniente"}
                                    label={"Banco proveniente"}
                                    key={"idBancoproveniente"}
                                    className="form-control"
                                    required={this.props.showDialogOcurre}
                                    value={this.state.Bancoproveniente}
                                    onChange={(event) => this.handleChangeDataOcurre(event)}
                                    id="idBancoproveniente"
                                    InputProps={{
                                        id: "idBancoproveniente",
                                        name: "idBancoproveniente"
                                    }}
                                    name={"idBancoproveniente"}
                                >
                                    {this.state.dataBancos.map((banco) => (
                                        <option
                                            key={banco.m_nIdBanco}
                                            value={banco.m_nIdBanco}
                                        >
                                            {banco.m_sBanco}
                                        </option>
                                    ))}
                                </Select>
                            </FormControl>
                        </Grid>
                        <Grid item xs={6}>
                        <TextField
                                variant="outlined"
                                id="Fechapago"
                                name="fechaPago"
                                label="Fecha de pago"
                                type="date"
                                onChange={this.handleFechaPago}
                                value={this.state.fechaPago}
                                className={"form-control"}
                                InputLabelProps={{shrink: true,}}
                                required={this.props.showDialogOcurre}
                            />
                        </Grid>
                        </>
                        }
                        {/*{(this.state.tipoPago == 1) &&
                        <Grid item xs={6}>
                            <TextField variant="outlined" size="small" label="Importe recibido"
                                       onChange={(event) => this.handleChangeDataOcurre(event)}
                                       className="form-control"
                                       type="number"
                                       autoFocus
                                       key={"importeOcurre"}
                                       value={this.state.importeOcurre}
                                       placeholder="Importe"
                                       name="importeOcurre"
                                       required={this.props.showDialogOcurre && (this.state.tipoPago == 1)}
                            />
                            <p style={{
                                marginLeft: '10px',
                                marginTop: '5px'
                            }}> {`Cambio: $${this.state.importeOcurre ? parseFloat(this.state.importeTotal) - parseFloat(this.state.importeOcurre) : 0.0}`}</p>
                        </Grid>
                        }*/}
                        <Grid item xs={12}>
                            <Typography variant={'h1'}> {`Importe a guía: $${numberToMoneyFormatt(this.state.importeTotal)}`}</Typography>
                        </Grid>
                    </Grid>
                    <DialogActions>
                        <Button onClick={() => {
                            this.props.closeOcurre()
                        }}>
                            Cancelar
                        </Button>
                        <Button type={"submit"} color="primary">
                            Aceptar
                        </Button>
                    </DialogActions>


                </DialogContent>
            </form>
        );
    }
}

MyComponent.propTypes = {};

export default MyComponent;
