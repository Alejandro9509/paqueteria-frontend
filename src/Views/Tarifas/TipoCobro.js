import React, { Component } from 'react';
import Noty from 'noty';
import { Popover, TextField } from '@mui/material';
import { agregarTipoCobro, obtenerTipoCobro } from '../../Util/Contexts/TipoCobroContext';
import {API_HEADERS} from "../../Constants";
import Button from "@mui/material/Button";

const headers = API_HEADERS

function showSuccess(mensaje) {
    new Noty({
        type: "information",
        layout: "topCenter",
        text: mensaje,
        timeout: "3000"
    }).show()
}

class TipoCobro extends Component {
    constructor(props) {
        super(props);
        this.state = {
            tiposCobro: [],
            anchorEl: null,
            codigo: "",
            descripcion: ""
        }
        this.getAllTipos = this.getAllTipos.bind(this)
        this.handleClose = this.handleClose.bind(this)
        this.handleClick = this.handleClick.bind(this)
        this.handleChange = this.handleChange.bind(this)
        this.handleAceptar = this.handleAceptar.bind(this)
    }

    componentWillMount() {
        this.getAllTipos()
    }

    componentDidMount() {

    }

    getAllTipos() {
        obtenerTipoCobro().then(respuesta => {
            this.setState({ tiposCobro: respuesta.data, anchorEl: null })
        });
    }
    handleChange(event) {
        this.setState({
            [event.target.name]: event.target.value
        });
    }

    handleAceptar(e) {
        e.preventDefault()
        var params = {
            "Codigo": this.state.codigo,
            "Descripcion": this.state.descripcion,
            "CreadoPor": localStorage.getItem("UsuarioId"),
            "ModificadoPor": localStorage.getItem("UsuarioId")
        }
        agregarTipoCobro(params).then(respuesta => {
            showSuccess(respuesta.data)
            this.getAllTipos();
        }).catch(err => {
            console.log(err)
            showSuccess(err)
        });
    }

    componentWillUnmount() {

    }

    handleClose() {
        this.setState({ anchorEl: null });
    }

    handleClick(event) {
        this.setState({ anchorEl: event.currentTarget });
    }

    render() {
        const open = Boolean(this.state.anchorEl);
        const id = open ? 'simple-popover' : undefined;

        return (
            <table style={{ overflow: "scroll", width: "100%" }}>
                <thead>
                    <tr>
                        <th colSpan="3">
                            <h4>Tipos de Cobro</h4>
                            <button
                                style={{ float: "inherit", padding: "5px" }}
                                type="button"
                                onClick={this.handleClick}
                                className="btn btn-primary primary-btn"
                            >
                                Agregar
                            </button>
                            <Popover
                                id={id}
                                open={open}
                                anchorEl={this.state.anchorEl}
                                onClose={this.handleClose}
                                anchorOrigin={{
                                    vertical: 'bottom',
                                    horizontal: 'center',
                                }}
                                transformOrigin={{
                                    vertical: 'top',
                                    horizontal: 'center',
                                }}
                            >
                                <div style={{ padding: "10px" }} className="j-forms">
                                    <h5>Agregando Tipo de Cobro</h5>
                                    <div className="col-sm-12 col-md-12 unit">

                                        <div className="input">
                                            <TextField variant="outlined" margin="dense"
                                                onChange={this.handleChange}
                                                className="form-control"
                                                type="text"
                                                label="Código"
                                                required={true}
                                                value={this.state.codigo}
                                                name="codigo"
                                            />
                                        </div>
                                    </div>

                                    <div className="col-sm-12 col-md-12 unit">

                                        <div className="input">
                                            <TextField variant="outlined" margin="dense"
                                                onChange={this.handleChange}
                                                className="form-control"
                                                label="Descripción"
                                                type="text"
                                                maxLenght="125"
                                                required={true}
                                                value={this.state.descripcion}
                                                name="descripcion"
                                            />
                                        </div>
                                    </div>
                                    <div className="col-sm-12 col-md-12 unit">
                                        <Button data-toggle="tab" className="btn btn-secondary secondary-btn"
                                            onClick={this.handleClose}>
                                            Cancelar
                                        </Button>
                                        <Button onClick={this.handleAceptar} className="btn btn-primary primary-btn">
                                            Aceptar
                                        </Button>
                                    </div>
                                </div>
                            </Popover>
                        </th>

                    </tr>
                </thead>
                <tr>
                    <th>
                        <label className="checkbox">
                            <input disabled={this.props.consult} type="checkbox"
                                   onChange={(event) => this.props.handleChange(event, 0, this.state.tiposCobro, true)}
                                   checked={this.props.all} />
                            <i/>
                        </label>

                    </th>
                    <th>Código</th>
                    <th>Descripción</th>
                </tr>
                {
                    this.state.tiposCobro.map((i, index) => {
                        return (
                            <tr key={i.m_nIdTipoCobro}>
                                <td style={{ width: "50px" }}>
                                    <label className="checkbox">
                                        <input disabled={this.props.consult} type="checkbox" onChange={(event) => this.props.handleChange(event, index, this.state.tiposCobro, false)} checked={this.props.tiposCobroSeleccionado.find(t => t.m_nIdTipoCobro === i.m_nIdTipoCobro) != null} />
                                        <i/>
                                    </label>
                                </td>
                                <td>{i.m_nCodigo}</td>
                                <td><strong>{i.m_sDescripcion}</strong></td>
                            </tr>
                        )
                    })
                }
            </table>
        );
    }
}

TipoCobro.propTypes = {

};

export default TipoCobro;