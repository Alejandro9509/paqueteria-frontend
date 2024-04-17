import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    FormControl,
    InputLabel, Select,
    Typography
} from "@mui/material";
import {obtenerTipoCobro} from "../../Util/Contexts/TipoCobroContext";

class MyComponent extends Component {
    constructor(props) {
        super(props);
        this.state = {
            tipoCobro:"0",
            dataTipoCobro: []
        }
        this.getAllDataTipoCobro = this.getAllDataTipoCobro.bind(this)
    }

    componentWillMount() {
        this.getAllDataTipoCobro()
    }
    getAllDataTipoCobro() {
        if (this.state.dataTipoCobro.length > 0) {
            return
        }
        obtenerTipoCobro().then(respuesta => {
            this.setState({
                dataTipoCobro: respuesta.data
            })
        });
    };

    render() {
        return (
            <Dialog open={this.props.open} onClose={() => this.props.close()} maxWidth={"md"} fullWidth>
                <DialogTitle>
                    <Typography variant={"h3"}>Cambiar Tipo de Cobro</Typography>
                </DialogTitle>
                <form onSubmit={(e) => {e.preventDefault(); this.props.submit(this.state.tipoCobro)}}>
                    <DialogContent>
                        <label className="input select" style={{width: "100%"}}>
                            <FormControl fullWidth
                                         variant="outlined"
                                         margin="dense">
                                <InputLabel id="idTipoCobroLabel">Tipo
                                    Cobro</InputLabel>
                                <Select
                                    native
                                    error={this.props.creditoVencido}
                                    labelId="idTipoCobroLabel"
                                    label="Tipo Cobro"
                                    className="form-control"
                                    helperText={ (this.props.creditoVencido) ? "El cliente presenta saldo vencido.": ""}
                                    required
                                    onChange={(e) =>  this.setState({tipoCobro: e.target.value})}
                                    id="idTipoCobro"
                                    InputProps={{shrink: true}}
                                    name="idTipoCobro"
                                    fullWidth
                                    value={this.state.tipoCobro}
                                    >

                                    <option value="0">
                                        Seleccionar
                                    </option>
                                    {this.state.dataTipoCobro.map(
                                        (tipoCobro) => (
                                            <option
                                                key={tipoCobro.m_nIdTipoCobro}
                                                value={tipoCobro.m_nIdTipoCobro}>
                                                {
                                                    tipoCobro.m_sDescripcion
                                                }
                                            </option>
                                        )
                                    )}
                                </Select>
                            </FormControl>
                        </label>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={() => this.props.close()}>
                            Cancelar
                        </Button>
                        <Button type={"submit"} onClick={() => this.props.close()}>
                            Aceptar
                        </Button>
                    </DialogActions>
                </form>

            </Dialog>
        );
    }
}

MyComponent.propTypes = {};

export default MyComponent;
