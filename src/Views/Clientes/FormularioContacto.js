import React, { Component } from 'react'
import Grid from "@material-ui/core/Grid";
import BlockHeaderH3 from "./BlockHeaderH3";
import TextField from "@material-ui/core/TextField";
import {Button, Checkbox, FormControlLabel} from "@material-ui/core";
import CheckBoxOutlineBlankIcon from "@material-ui/icons/CheckBoxOutlineBlank";
import CheckBoxIcon from "@material-ui/icons/CheckBox";
import {FormularioContactoCreado} from "./FormularioContactoCreado";

export default class FormularioContacto extends Component{
     state = {
         contactoNombre: "",
         contactoCorreo: "",
         contactoTelefono: "",
         usuarioContacto: "",
         contrasenaContacto: "",
         RecibirFactura: false,
         RecibirEstadoCuenta: false,
         PermitirSeguimiento: false,
         UsoServicioWeb: false,
         PermitirVerPortal: false,
         RecibirCartaPorte: false,
         MostrarSeguimientosSolicitudes: false,
         MostrarImportesEnHistoricoViajes: false,

         contactos: []

     }

     handleChange = ({target}) => {
         /*console.log(target.name +":"+ target.value,)
         console.log(target.name +":"+ target.checked,)*/
         // console.log(target.name  + ':' + target.value)
         this.setState({
             [target.name]: target.value,
         })
     }
     handleChangeCheckBox = ({target}) => {
         console.log(target.name  + ':' + target.checked)
         this.setState({
             [target.name]: target.checked
         })
     }

     generatePassword = () => {
         let length = 8,
             charset = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789",
             retVal = "";
         for (let i = 0, n = charset.length; i < length; ++i) {
             retVal += charset.charAt(Math.floor(Math.random() * n));
         }
         return retVal;
     }

     handleNuevoContacto = () => {
         this.state.contactos.push({
             contactoNombre: this.state.contactoNombre,
             contactoCorreo: this.state.contactoCorreo,
             contactoTelefono: this.state.contactoTelefono,
             usuarioContacto: this.state.contactoCorreo,
             contrasenaContacto: this.generatePassword(),
             RecibirFactura: this.state.RecibirFactura,
             RecibirEstadoCuenta: this.state.RecibirEstadoCuenta,
             PermitirSeguimiento: this.state.PermitirSeguimiento,
             UsoServicioWeb: this.state.UsoServicioWeb,
             PermitirVerPortal: this.state.PermitirVerPortal,
             RecibirCartaPorte: this.state.RecibirCartaPorte,
             MostrarSeguimientosSolicitudes: this.state.MostrarSeguimientosSolicitudes,
             MostrarImportesEnHistoricoViajes: this.state.MostrarImportesEnHistoricoViajes,
         })
         this.setState({
             contactoNombre: "",
             contactoCorreo: "",
             contactoTelefono: "",
             usuarioContacto: "",
             contrasenaContacto: "",
             RecibirFactura: false,
             RecibirEstadoCuenta: false,
             PermitirSeguimiento: false,
             UsoServicioWeb: false,
             PermitirVerPortal: false,
             RecibirCartaPorte: false,
             MostrarSeguimientosSolicitudes: false,
             MostrarImportesEnHistoricoViajes: false,
         })
     }

     handleEliminar = (index) => {
         console.log(index)
         console.log(this.state.contactos.length)
         const aux = this.state.contactos
         aux.splice(index, 1)
         this.setState({
             contactos: aux
         })

     }
    /* Des / habilitar boton agregar contacto*/
    render() {
        const { data } = this.props
        return(
            <form>
                <Grid container spacing={1}>
                    <Grid item xs={6}>
                        <BlockHeaderH3>{"Contacto"}</BlockHeaderH3>
                        <Grid container spacing={5} alignItems="center">
                            <Grid item container direction={"column"}  spacing={2} xs={6}>
                                <Grid item xs={12}>
                                    <TextField
                                        variant="outlined" margin="dense" label="Contacto"
                                        onChange={this.handleChange}
                                        value={this.state.contactoNombre}
                                        name="contactoNombre"
                                        className="form-control"
                                        type="text"
                                        placeholder=""
                                        id="contactoNombre"
                                    />
                                </Grid>
                                <Grid item xs={12}>
                                    <TextField
                                        variant="outlined" margin="dense"
                                        label="Correo"
                                        onChange={this.handleChange}
                                        value={this.state.contactoCorreo}
                                        name="contactoCorreo"
                                        className="form-control"
                                        type="email"
                                        placeholder=""
                                        id="contactoCorreo"
                                    />
                                </Grid>
                                <Grid item xs={12}>
                                    <TextField
                                        variant="outlined" margin="dense" label="Teléfono"
                                        onChange={this.handleChange}
                                        value={this.state.contactoTelefono}
                                        name="contactoTelefono"
                                        className="form-control"
                                        type="text"
                                        placeholder=""
                                        id="contactoTelefono"
                                    />
                                </Grid>

                                <Grid item xs={12}>
                                    <Button variant="contained" color="primary" onClick={this.handleNuevoContacto}>
                                        Agregar contacto
                                    </Button>
                                </Grid>
                            </Grid>
                            <Grid item xs={6}>
                                <FormControlLabel
                                    control={
                                        <Checkbox
                                            checked={this.state.RecibirFactura}
                                            onChange={this.handleChangeCheckBox}
                                            name="RecibirFactura"
                                            id="RecibirFactura"
                                            icon={<CheckBoxOutlineBlankIcon fontSize="large" />}
                                            checkedIcon={<CheckBoxIcon fontSize="large" />}
                                            color="primary"
                                        />
                                    }
                                    label="Recibir factura"/>
                                <FormControlLabel
                                    control={
                                        <Checkbox
                                            checked={this.state.RecibirEstadoCuenta}
                                            onChange={this.handleChangeCheckBox}
                                            name="RecibirEstadoCuenta"
                                            id="RecibirEstadoCuenta"
                                            icon={<CheckBoxOutlineBlankIcon fontSize="large" />}
                                            checkedIcon={<CheckBoxIcon fontSize="large" />}
                                            color="primary"
                                        />
                                    }
                                    label="Recibir Edo de cuenta"/>
                                <FormControlLabel
                                    control={
                                        <Checkbox
                                            checked={this.state.PermitirSeguimiento}
                                            onChange={this.handleChangeCheckBox}
                                            name="PermitirSeguimiento"
                                            id="PermitirSeguimiento"
                                            icon={<CheckBoxOutlineBlankIcon fontSize="large" />}
                                            checkedIcon={<CheckBoxIcon fontSize="large" />}
                                            color="primary"
                                        />
                                    }
                                    label="Permitir Seguimiento de Viajes/Unidades"/>
                                <FormControlLabel
                                    control={
                                        <Checkbox
                                            checked={this.state.UsoServicioWeb}
                                            onChange={this.handleChangeCheckBox}
                                            name="UsoServicioWeb"
                                            id="UsoServicioWeb"
                                            icon={<CheckBoxOutlineBlankIcon fontSize="large" />}
                                            checkedIcon={<CheckBoxIcon fontSize="large" />}
                                            color="primary"
                                        />
                                    }
                                    label="Uso de un servicio web"/>
                                <FormControlLabel
                                    control={
                                        <Checkbox
                                            checked={this.state.PermitirVerPortal}
                                            onChange={this.handleChangeCheckBox}
                                            name="PermitirVerPortal"
                                            id="PermitirVerPortal"
                                            icon={<CheckBoxOutlineBlankIcon fontSize="large" />}
                                            checkedIcon={<CheckBoxIcon fontSize="large" />}
                                            color="primary"
                                        />
                                    }
                                    label="Permitir ver Portal de Clientes"/>
                                <FormControlLabel
                                    control={
                                        <Checkbox
                                            checked={this.state.RecibirCartaPorte}
                                            onChange={this.handleChangeCheckBox}
                                            name="RecibirCartaPorte"
                                            id="RecibirCartaPorte"
                                            icon={<CheckBoxOutlineBlankIcon fontSize="large" />}
                                            checkedIcon={<CheckBoxIcon fontSize="large" />}
                                            color="primary"
                                        />
                                    }
                                    label="Recibir carta porte"/>
                                {this.state.PermitirVerPortal && <FormControlLabel
                                    control={
                                        <Checkbox
                                            checked={this.state.MostrarSeguimientosSolicitudes}
                                            onChange={this.handleChangeCheckBox}
                                            name="MostrarSeguimientosSolicitudes"
                                            id="MostrarSeguimientosSolicitudes"
                                            icon={<CheckBoxOutlineBlankIcon fontSize="large" />}
                                            checkedIcon={<CheckBoxIcon fontSize="large" />}
                                            color="primary"
                                        />
                                    }
                                    label="Mostrar todos los seguimientos/Solicitudes documentados"/>}
                                {this.state.PermitirVerPortal && <FormControlLabel
                                    control={
                                        <Checkbox
                                            checked={this.state.MostrarImportesEnHistoricoViajes}
                                            onChange={this.handleChangeCheckBox}
                                            name="MostrarImportesEnHistoricoViajes"
                                            id="MostrarImportesEnHistoricoViajes"
                                            icon={<CheckBoxOutlineBlankIcon fontSize="large" />}
                                            checkedIcon={<CheckBoxIcon fontSize="large" />}
                                            color="primary"
                                        />
                                    }
                                    label="Mostrar importes en el histórico de viajes"/>}
                            </Grid>
                        </Grid>
                    </Grid>
                    <Grid item xs={6} style={{overflow: 'scroll', height: '350px'}}>
                            { this.state.contactos.map((item, index) => (
                                <FormularioContactoCreado data={item} index={index} handleEliminar={this.handleEliminar}/>
                            ))}
                    </Grid>
                </Grid>
            </form>
        )
    }
 }