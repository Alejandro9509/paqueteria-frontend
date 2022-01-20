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
            estatusGuia:"0"
        }
    }

    componentWillMount() {

    }


    render() {
        return (
            <Dialog open={this.props.open} onClose={() => this.props.close()} maxWidth={"md"} fullWidth>
                <DialogTitle>
                    <Typography variant={"h3"}>Cambiar Estatus</Typography>
                </DialogTitle>
                <form onSubmit={(e) => {e.preventDefault();this.props.submit(this.state.estatusGuia)}}>
                    <DialogContent>
                        <label className="input select" style={{width: "100%"}}>
                            <FormControl fullWidth variant="outlined"
                                         margin="dense">
                                <InputLabel id="idEstatusGuiaLabel"> Estatus de la
                                    Guia</InputLabel>
                                <Select
                                    native
                                    labelId="idEstatusGuiaLabel"
                                    label="Estatus de la Guia"
                                    className="form-control"
                                    required
                                    onChange={(e) =>  this.setState({estatusGuia: e.target.value})}
                                    id="idEstatusGuia"
                                    name="idEstatusGuia"
                                    read="true"
                                    value={this.state.idEstatusGuia}
                                    InputLabelProps={{
                                        shrink: true,
                                    }}
                                >
                                    <option key={0} value="0">Seleccionar</option>
                                    {this.props.dataEstatusGuia.map(
                                        (estatusGuia) => (
                                           estatusGuia.m_nIdEstatusGuia!=8?
                                            <option
                                                key={estatusGuia.m_nIdEstatusGuia}
                                                value={estatusGuia.m_nIdEstatusGuia}>
                                                {estatusGuia.m_sEstatus}
                                            </option>
                                            :null
                                        )
                                    )}
                                </Select>
                            </FormControl>
                        </label>
                    </DialogContent>
                    <DialogActions>
                        <Button type={"submit"} onClick={() => this.props.close()}>
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
