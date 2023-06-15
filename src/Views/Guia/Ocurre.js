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
} from "@material-ui/core";
import { obtenerBancos } from '../../Util/Contexts/GuiaContext';
import MenuItem from "@material-ui/core/MenuItem";
import {numberToMoneyFormatt} from "../../Util/Util";

class MyComponent extends Component {
    constructor(props) {
        super(props);
        this.state ={
            ...this.props.dataOcurre,
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
            this.props.handleEntregaOcurre(this.state)}}>
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
                            <FormControl fullWidth variant="outlined" margin="dense">
                                <InputLabel id="idTipoCobroLabel">Tipo Cobro</InputLabel>
                                <Select
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
                        {/*<Grid item xs={2}/>*/}
                        <Grid item xs={12}>
                            <FormControl fullWidth variant="outlined" margin="dense">
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
                            <FormControl fullWidth variant="outlined" margin="dense">
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
                            <TextField variant="outlined" margin="dense" label="Importe recibido"
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
                        }} color="primary">
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
