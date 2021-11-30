import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {
    Button,
    DialogActions,
    DialogContent,
    FormControl,
    Grid,
    InputLabel,
    Select,
    TextField
} from "@material-ui/core";

class MyComponent extends Component {
    constructor(props) {
        super(props);
        this.state ={
            ...this.props.dataOcurre
        }
        this.handleFechaOcurre = this.handleFechaOcurre.bind(this)
        this.handleHoraOcurre = this.handleHoraOcurre.bind(this)
        this.handleChangeDataOcurre = this.handleChangeDataOcurre.bind(this)

    }

    handleFechaOcurre(event) {
        event.preventDefault()
        this.setState({
            fechaOcurre: event.target.value,
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

    render() {
        return (
            <form onSubmit={(e) => {e.preventDefault();this.props.handleEntregaOcurre(this.state)}}>
                <DialogContent>
                    <Grid container spacing={3}>
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
                        <Grid item xs={6}>
                            <FormControl fullWidth variant="outlined" margin="dense">
                                <InputLabel id="idTipoCobroLabel">Tipo Cobro</InputLabel>
                                <Select
                                    labelId={"idTipoCobroLabel"}
                                    label={"Tipo Cobro"}
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
                                            {tipoCobro.m_sDescripcion}
                                        </option>
                                    ))}
                                </Select>
                            </FormControl>
                        </Grid>
                        <Grid item xs={6}>
                            <FormControl fullWidth variant="outlined" margin="dense">
                                <TextField variant="outlined" margin="dense" label="Comentarios"
                                           onChange={(event) => this.handleChangeDataOcurre(event)}
                                           className="form-control"
                                           type="text"
                                           autoFocus
                                           key={"comentarioOcurre"}
                                           value={this.state.comentariosOcurre}
                                           disabled={this.props.agregar === "Consultar"}
                                           placeholder="Comentarios"
                                           name="comentariosOcurre"
                                />
                            </FormControl>
                        </Grid>
                        {(this.state.tipoCobroOcurre == 10 || this.state.tipoCobroOcurre == 3 || this.state.tipoCobroOcurre == 11) &&
                        <Grid item xs={12}>
                            <FormControl fullWidth variant="outlined" margin="dense">
                                <InputLabel id="idTipoPagoLabel">Tipo Pago</InputLabel>
                                <Select
                                    labelId={"idTipoPagoLabel"}
                                    label={"Tipo Pago"}
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
                                        <option
                                            key={tipoPago.m_nIdTipoPago}
                                            value={tipoPago.m_nIdTipoPago}
                                        >
                                            {tipoPago.m_sTipoPago}
                                        </option>
                                    ))}
                                </Select>
                            </FormControl>
                        </Grid>
                        }
                        {(this.state.tipoPago == 1) &&
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
                        }
                        {this.props.dataOcurre.tipoPago == 1 &&
                        <Grid item xs={6}>
                            <p> {`Importe a pagar: $${parseFloat(this.state.importeTotal)}`}</p>
                        </Grid>
                        }


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
