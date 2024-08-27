import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Cabecera from '../../Components/Template/Cabecera';
import BarraLateralIzquierda from '../../Components/Template/BarraLateralIzquierda';
import Noty from 'noty';
import axios from "axios";
import SvgIcon from "@mui/material/SvgIcon";
import { ReactComponent as Activo } from "../../iconos/Menu/palomita.svg";
import { ReactComponent as NoActivo } from "../../iconos/Menu/cruz.svg";
import $ from "jquery";
import {validarDerecho} from "../../Util/Util"
import {Dialog, DialogActions, DialogContent, DialogTitle} from "@mui/material";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import Select from "@mui/material/Select";
import TextField from "@mui/material/TextField";
import {
    agregarCuentasCorreo,
    modificarCuentasCorreo,
    obtenerCuentasCorreo,
} from '../../Util/Contexts/CuentasCorreoContext';
window.jQuery = window.$ = $;



function showSuccess(mensaje){
    new Noty({
        type:"information",
        layout:"topCenter",
        text: mensaje,
        timeout:"3000"
    }).show()
}

class CuentasCorreo extends Component {
    constructor(props) {
        super(props);
        this.state = {
            dataTipoCuenta: [{id: 1, name: 'Para Enviar Viajes'}, {id: 2, name: 'Para Enviar Tracking'},{id: 3, name: 'Para Facturación'}],
            dataSeguridad: [{id: 1, name: 'Cifrada SSL'}, {id: 2, name: 'Cifrada TLS'}],
            idTipoCuenta: '',
            idSeguridad: '',
            servidor: '',
            puerto: '',
            usuario: '',
            pass: '',
            idUsuario: localStorage.getItem("UsuarioId"),
            dataCuentas: [],
            idCuentaEnviarViajes: null,
            idCuentaEnviarTracking: null,
        }

        this.handleChange = this.handleChange.bind(this);
        this.handleAceptar = this.handleAceptar.bind(this);
        this.consultarPorUsuario = this.consultarPorUsuario.bind(this);
        this.handleChangeTipoCuenta = this.handleChangeTipoCuenta.bind(this)
    }

    handleAceptar(event) {
        event.preventDefault()
        const today = new Date();
        var params = {
            m_nIdCuentasCorreo:this.state.idCuenta,
            m_nTipoCuenta: this.state.idTipoCuenta,
            m_sServidor: this.state.servidor,
            m_nPuerto: this.state.puerto,
            m_sUsuario: this.state.usuario,
            m_sContrasenia: this.state.pass,
            m_nTipoCifrado: this.state.idSeguridad,
            m_sCreadoEl: today.getDate() + "/" + (today.getMonth() + 1) + "/" + today.getFullYear() + " " + today.getHours() + ":" + today.getMinutes(),
            m_sCreadoPor: localStorage.getItem("UsuarioId"),
            m_sModificadoEl: today.getDate() + "/" + (today.getMonth() + 1) + "/" + today.getFullYear() + " " + today.getHours() + ":" + today.getMinutes(),
            m_sModificadoPor: localStorage.getItem("UsuarioId")
        }
        if (this.state.edit) {
            modificarCuentasCorreo(this.state.idCuenta, params).then(respuesta => {
                console.log(respuesta)
                showSuccess(`Modificacion exitosa`)
                this.props.closeDialog()
            }).catch(err => {
                console.log(err)
                showSuccess(err)
            });
        } else {
            agregarCuentasCorreo(params).then(respuesta => {
                this.props.closeDialog()
                showSuccess(`Se ha agregado exitosamente`)
            }).catch(err => {
                console.log(err)
                showSuccess(err)
            });
        }

    }

    handleChange = (event) => {
        event.preventDefault();
        this.setState({
            [event.target.name]: event.target.value,
        });
    };

    handleChangeTipoCuenta = (event) => {
        event.preventDefault();
        let value = event.target.value;
        this.setState({
            [event.target.name]: value,
        });

        if (value === 1){
            console.log(this.state.cuentaEnviarViajes)
            let cuenta = this.state.cuentaEnviarViajes
            this.setState({
                idCuenta: cuenta ? cuenta.m_nIdCuentasCorreo : null,
                idSeguridad: cuenta ? cuenta.m_nTipoCifrado : null,
                servidor: cuenta ? cuenta.m_sServidor : '',
                puerto: cuenta ? cuenta.m_nPuerto : '',
                usuario: cuenta ? cuenta.m_sUsuario : '',
                pass: cuenta ? cuenta.m_sContrasenia : '',
                edit: !!cuenta
            })
        }

        if (value === 2){
            console.log(this.state.cuentaEnviarTracking)
            let cuenta = this.state.cuentaEnviarTracking
            this.setState({
                idCuenta: cuenta ? cuenta.m_nIdCuentasCorreo : null,
                idSeguridad: cuenta ? cuenta.m_nTipoCifrado : null,
                servidor: cuenta ? cuenta.m_sServidor : '',
                puerto: cuenta ? cuenta.m_nPuerto : '',
                usuario: cuenta ? cuenta.m_sUsuario : '',
                pass: cuenta ? cuenta.m_sContrasenia : '',
                edit: !!cuenta
            })
        }
        if (value === 3){
            console.log(this.state.cuentaEnviarFacturacion)
            let cuenta = this.state.cuentaEnviarFacturacion
            this.setState({
                idCuenta: cuenta ? cuenta.m_nIdCuentasCorreo : null,
                idSeguridad: cuenta ? cuenta.m_nTipoCifrado : null,
                servidor: cuenta ? cuenta.m_sServidor : '',
                puerto: cuenta ? cuenta.m_nPuerto : '',
                usuario: cuenta ? cuenta.m_sUsuario : '',
                pass: cuenta ? cuenta.m_sContrasenia : '',
                edit: !!cuenta
            })
        }
    };

    componentWillMount() {
        this.consultarPorUsuario()
    }

    consultarPorUsuario () {
        obtenerCuentasCorreo().then(respuesta => {
            console.log(respuesta.data)
            let info = respuesta.data
            let cuentaEnviarViajes = info && info.length > 0 ? info.filter(cuenta => cuenta.m_nTipoCuenta === 1) : []
            let cuentaEnviarTracking =info && info.length > 0 ? info.filter(cuenta => cuenta.m_nTipoCuenta === 2) : []
            let cuentaEnviarFacturacion =info && info.length > 0 ? info.filter(cuenta => cuenta.m_nTipoCuenta === 3) : []

            this.setState({
                dataCuentas: info,
                cuentaEnviarViajes: cuentaEnviarViajes && cuentaEnviarViajes.length > 0 ? cuentaEnviarViajes[0] : null,
                cuentaEnviarTracking: cuentaEnviarTracking && cuentaEnviarTracking.length > 0 ? cuentaEnviarTracking[0] : null,
                cuentaEnviarFacturacion: cuentaEnviarFacturacion && cuentaEnviarFacturacion.length > 0 ? cuentaEnviarFacturacion[0] : null,

            })
        });
    }

    render() {
        return (
            <form className="j-forms" onSubmit={this.handleAceptar}>
                <div className="row" >

                    <div className="col-sm-12 col-md-12 col-lg-12 unit">
                        <label className="input select">
                            <FormControl fullWidth variant="outlined" size="small">
                                <InputLabel id="idTipoCuentaLabel">Tipo de Cuenta</InputLabel>
                                <Select
                                    labelId="idTipoCuentaLabel"
                                    className="form-control"
                                    required
                                    value={this.state.idTipoCuenta}
                                    onChange={this.handleChangeTipoCuenta}
                                    id="idTipoCuenta"
                                    name={"idTipoCuenta"}
                                    label="Tipo de Cuenta"
                                >
                                    {this.state.dataTipoCuenta.map((tipoCuenta) => (
                                        <option
                                            key={tipoCuenta.id}
                                            value={tipoCuenta.id}
                                        >
                                            {tipoCuenta.name}
                                        </option>
                                    ))}
                                </Select>
                            </FormControl>
                        </label>
                    </div>

                    <div className="col-sm-12 col-md-12 col-lg-12 unit">
                        <div className="input">
                            <TextField variant="outlined" size="small"
                                       onChange={this.handleChange}
                                       className="form-control"
                                       type="text"
                                       fullWidth
                                       label="Servidor"
                                       required
                                       value={this.state.servidor}
                                       name="servidor"
                            />
                        </div>
                    </div>


                    <div className="col-sm-12 col-md-12 col-lg-12 unit">
                        <div className="input">
                            <TextField variant="outlined" size="small"
                                       onChange={this.handleChange}
                                       className="form-control"
                                       required
                                       fullWidth
                                       type="number"
                                       label="Puerto"
                                       value={this.state.puerto}
                                       name="puerto"
                            />
                        </div>
                    </div>

                    <div className="col-sm-12 col-md-12 col-lg-12 unit">
                        <div className="input">
                            <TextField variant="outlined" size="small"
                                       onChange={this.handleChange}
                                       className="form-control"
                                       required
                                       fullWidth
                                       type="text"
                                       label="Usuario"
                                       value={this.state.usuario}
                                       name="usuario"
                            />
                        </div>
                    </div>

                    <div className="col-sm-12 col-md-12 col-lg-12 unit">
                        <div className="input">
                            <TextField variant="outlined" size="small"
                                       onChange={this.handleChange}
                                       className="form-control"
                                       required
                                       fullWidth
                                       type="password"
                                       autoComplete="current-password"
                                       label="Contraseña"
                                       value={this.state.pass}
                                       name="pass"
                            />
                        </div>
                    </div>

                    <div className="col-sm-12 col-md-12 col-lg-12 unit">
                        <label className="input select">
                            <FormControl fullWidth variant="outlined" size="small">
                                <InputLabel id="idSeguridadLabel">Seguridad</InputLabel>
                                <Select
                                    labelId="idSeguridadLabel"
                                    className="form-control"
                                    required
                                    value={this.state.idSeguridad}
                                    onChange={this.handleChange}
                                    id="idSeguridad"
                                    name={"idSeguridad"}
                                    label="Seguridad"
                                >
                                    {this.state.dataSeguridad.map((seguridad) => (
                                        <option
                                            key={seguridad.id}
                                            value={seguridad.id}
                                        >
                                            {seguridad.name}
                                        </option>
                                    ))}
                                </Select>
                            </FormControl>
                        </label>
                    </div>

                </div>

                <div className={"row"}>
                    <button type="button" className="btn btn-secondary secondary-btn" onClick={this.props.closeDialog}>Cancelar</button>

                    <button disabled={!validarDerecho(9101272)} className="btn btn-primary primary-btn" type={"submit"} >Aceptar</button>
                </div>

            </form>
        );
    }
}

CuentasCorreo.propTypes = {

};

export default CuentasCorreo;