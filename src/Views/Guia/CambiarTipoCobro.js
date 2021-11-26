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
} from "@material-ui/core";

class MyComponent extends Component {
    constructor(props) {
        super(props);
        this.state = {
            tipoCobro:"0"
        }
    }

    componentWillMount() {

    }


    render() {
        return (
            <Dialog open={this.props.open} onClose={() => this.props.close()} maxWidth={"md"} fullWidth>
                <DialogTitle>
                    <Typography variant={"h3"}>Cambiar Tipo de Cobro</Typography>
                </DialogTitle>
                <form>
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
                                    {this.props.dataTipoCobro.map(
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
                            Aceptar
                        </Button>
                        <Button onClick={() => this.props.close()}>
                            Cancelar
                        </Button>
                    </DialogActions>
                </form>

            </Dialog>
        );
    }
}

MyComponent.propTypes = {};

export default MyComponent;
