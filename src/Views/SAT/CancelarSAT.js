import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {Button, Dialog, DialogActions, DialogContent, DialogTitle, MenuItem, Typography} from "@material-ui/core";
import FormControl from "@material-ui/core/FormControl";
import InputLabel from "@material-ui/core/InputLabel";
import Select from "@material-ui/core/Select";
import {obtenerClavesCancelacionSAT} from "../../Util/Contexts/SATContext";
import TextField from "@material-ui/core/TextField";

class CancelarSAT extends Component {
    constructor(props) {
        super(props);
        this.state= {
            catalogoSAT: []
        }
        this.handleChange = this.handleChange.bind(this);
        this.onSubmit = this.onSubmit.bind(this);
    }

    componentDidMount() {
        obtenerClavesCancelacionSAT().then(({data}) =>{
            this.setState({
                catalogoSAT: data,
                folioRelacionado: this.props.data.folioSustituye
            })
        })
    }

    handleChange = (event) => {
        event.preventDefault();
        this.setState({
            [event.target.name]: event.target.value,
        });
    };
    onSubmit(e){
        e.preventDefault()
        const data = this.state
        data.motivoSAT = this.state.catalogoSAT.find(c => c.m_nid === this.state.idCancelacionSAT).m_sDescripcion
        data.folioRelacionado = this.state.idCancelacionSAT === "01" ? data.folioRelacionado : "0"
        this.props.close()
        this.props.onSubmit(data)
    }
    render() {
        return (
            <Dialog open={this.props.open} onClose={() => this.props.close()} fullWidth maxWidth={"md"}>
                <DialogTitle><Typography variant={"h3"}>Cancelar SAT - {this.props.data.folioCancelar}</Typography></DialogTitle>
                <DialogContent>
                    <Typography>Folio: {this.props.data.m_sFolio}</Typography>
                    <br/>
                    <form onSubmit={this.onSubmit}>
                        <label className="input select" style={{width:"100%"}}>
                            <FormControl fullWidth variant="outlined" margin="dense" required>
                                <InputLabel id="idMotivoCancelacionSATLabel">Motivo cancelación SAT</InputLabel>
                                <Select
                                    labelId="idMotivoCancelacionSATLabel"
                                    className="form-control"
                                    value={this.state.idCancelacionSAT}
                                    onChange={this.handleChange}
                                    id="idMotivoCancelacionSAT"
                                    label="Motivo cancelación"
                                    name={"idCancelacionSAT"}
                                    required
                                    InputProps={{
                                        id: "idMotivoCancelacionSAT",
                                        name: "idCancelacionSAT"
                                    }}
                                >
                                    {this.state.catalogoSAT.map((estatus) => (
                                        <MenuItem
                                            key={estatus.m_nid}
                                            value={estatus.m_nid}
                                        >
                                            {estatus.m_nid+' - '+estatus.m_sDescripcion}
                                        </MenuItem>
                                    ))}
                                </Select>
                            </FormControl>
                        </label>

                        <br/>
                        {
                            this.state.idCancelacionSAT === "01" &&
                            < div className="input select">
                            <TextField variant="outlined" margin="dense"
                            onChange={this.handleChange}
                            className="form-control"
                            type="text" required
                            fullWidth
                            label="Folio Fiscal sustituye"
                            value={this.state.folioRelacionado}
                            id="idFolioRelacionado"
                            name="folioRelacionado"
                            />
                            </div>
                        }
                        <br/>
                        <div className="input select">
                            <TextField variant="outlined" margin="dense"
                                       onChange={this.handleChange}
                                       className="form-control"
                                       type="text"
                                       fullWidth
                                       required
                                       label="Motivo Cancelación"
                                       value={this.state.motivoCancelacion}
                                       id="motivoCancelacion"
                                       name="motivoCancelacion"
                            />
                        </div>
                        <DialogActions>
                            <Button variant={"contained"} color={"default"} onClick={() => this.props.close()}>Cancelar</Button>
                            <Button variant={"contained"} type={"submit"} color={"primary"}>Aceptar</Button>
                        </DialogActions>
                    </form>
                </DialogContent>
            </Dialog>
        );
    }
}

CancelarSAT.propTypes = {};

export default CancelarSAT;
