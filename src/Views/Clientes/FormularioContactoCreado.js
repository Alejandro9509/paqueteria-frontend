import React, { Component} from "react";
import Grid from "@material-ui/core/Grid";
import BlockHeaderH3 from "./BlockHeaderH3";
import TextField from "@material-ui/core/TextField";
import {Button, Checkbox, FormControlLabel} from "@material-ui/core";
import CheckBoxOutlineBlankIcon from "@material-ui/icons/CheckBoxOutlineBlank";
import CheckBoxIcon from "@material-ui/icons/CheckBox";

export class FormularioContactoCreado extends Component{

    handleEliminar = () =>{
        this.props.handleEliminar(this.props.index)
    }

    render() {
        const {data} = this.props
        return(
            <div>
                <Grid container spacing={5} alignItems="center">
                    <Grid item container direction={"column"}  spacing={2} xs={6}>
                        <Grid item xs={12}>
                            <TextField
                                variant="outlined" margin="dense" label="Contacto"
                                onChange={this.handleChange}
                                value={data.contactoNombre}
                                name="contactoNombre"
                                className="form-control"
                                type="text"
                                placeholder=""
                                id="contactoNombre"
                                disabled
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                variant="outlined" margin="dense"
                                label="Correo"
                                onChange={this.handleChange}
                                value={data.contactoCorreo}
                                name="contactoCorreo"
                                className="form-control"
                                type="email"
                                placeholder=""
                                id="contactoCorreo"
                                disabled
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                variant="outlined" margin="dense" label="Teléfono"
                                onChange={this.handleChange}
                                value={data.contactoTelefono}
                                name="contactoTelefono"
                                className="form-control"
                                type="text"
                                placeholder=""
                                id="contactoTelefono"
                                disabled
                            />
                        </Grid>

                        <Grid item xs={12}>
                            <TextField
                                variant="outlined" margin="dense" label="Usuario"
                                onChange={this.handleChange}
                                value={data.usuarioContacto}
                                name="usuarioContacto"
                                className="form-control"
                                type="text"
                                placeholder=""
                                id="usuarioContacto"
                                disabled
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                variant="outlined" margin="dense" label="Contraseña"
                                onChange={this.handleChange}
                                value={data.contrasenaContacto}
                                name="contrasenaContacto"
                                className="form-control"
                                type="text"
                                placeholder=""
                                id="contrasenaContacto"
                                disabled
                            />
                        </Grid>

                    </Grid>
                    <Grid item xs={6}>
                        <FormControlLabel
                            control={
                                <Checkbox
                                    checked={data.RecibirFactura}
                                    onChange={this.handleChangeCheckBox}
                                    name="RecibirFactura"
                                    id="RecibirFactura"
                                    icon={<CheckBoxOutlineBlankIcon fontSize="large" />}
                                    checkedIcon={<CheckBoxIcon fontSize="large" />}
                                    color="primary"
                                    disabled
                                />
                            }
                            disabled
                            label="Recibir factura"/>
                        <FormControlLabel
                            control={
                                <Checkbox
                                    checked={data.RecibirEstadoCuenta}
                                    onChange={this.handleChangeCheckBox}
                                    name="RecibirEstadoCuenta"
                                    id="RecibirEstadoCuenta"
                                    icon={<CheckBoxOutlineBlankIcon fontSize="large" />}
                                    checkedIcon={<CheckBoxIcon fontSize="large" />}
                                    color="primary"
                                    disabled
                                />
                            }
                            disabled
                            label="Recibir Edo de cuenta"/>
                        <FormControlLabel
                            control={
                                <Checkbox
                                    checked={data.PermitirSeguimiento}
                                    onChange={this.handleChangeCheckBox}
                                    name="PermitirSeguimiento"
                                    id="PermitirSeguimiento"
                                    icon={<CheckBoxOutlineBlankIcon fontSize="large" />}
                                    checkedIcon={<CheckBoxIcon fontSize="large" />}
                                    color="primary"
                                    disabled
                                />
                            }
                            disabled
                            label="Permitir Seguimiento de Viajes/Unidades"/>
                        <FormControlLabel
                            control={
                                <Checkbox
                                    checked={data.UsoServicioWeb}
                                    onChange={this.handleChangeCheckBox}
                                    name="UsoServicioWeb"
                                    id="UsoServicioWeb"
                                    icon={<CheckBoxOutlineBlankIcon fontSize="large" />}
                                    checkedIcon={<CheckBoxIcon fontSize="large" />}
                                    color="primary"
                                    disabled
                                />
                            }
                            disabled
                            label="Uso de un servicio web"/>
                        <FormControlLabel
                            control={
                                <Checkbox
                                    checked={data.PermitirVerPortal}
                                    onChange={this.handleChangeCheckBox}
                                    name="PermitirVerPortal"
                                    id="PermitirVerPortal"
                                    icon={<CheckBoxOutlineBlankIcon fontSize="large" />}
                                    checkedIcon={<CheckBoxIcon fontSize="large" />}
                                    color="primary"
                                    disabled
                                />
                            }
                            disabled
                            label="Permitir ver Portal de Clientes"/>
                        <FormControlLabel
                            control={
                                <Checkbox
                                    checked={data.RecibirCartaPorte}
                                    onChange={this.handleChangeCheckBox}
                                    name="RecibirCartaPorte"
                                    id="RecibirCartaPorte"
                                    icon={<CheckBoxOutlineBlankIcon fontSize="large" />}
                                    checkedIcon={<CheckBoxIcon fontSize="large" />}
                                    color="primary"
                                    disabled
                                />
                            }
                            disabled
                            label="Recibir carta porte"/>
                        {data.PermitirVerPortal && <FormControlLabel
                            control={
                                <Checkbox
                                    checked={data.MostrarSeguimientosSolicitudes}
                                    onChange={this.handleChangeCheckBox}
                                    name="MostrarSeguimientosSolicitudes"
                                    id="MostrarSeguimientosSolicitudes"
                                    icon={<CheckBoxOutlineBlankIcon fontSize="large" />}
                                    checkedIcon={<CheckBoxIcon fontSize="large" />}
                                    color="primary"
                                    disabled
                                />
                            }
                            disabled
                            label="Mostrar todos los seguimientos/Solicitudes documentados"/>}
                        {data.PermitirVerPortal && <FormControlLabel
                            control={
                                <Checkbox
                                    checked={data.MostrarImportesEnHistoricoViajes}
                                    onChange={this.handleChangeCheckBox}
                                    name="MostrarImportesEnHistoricoViajes"
                                    id="MostrarImportesEnHistoricoViajes"
                                    icon={<CheckBoxOutlineBlankIcon fontSize="large" />}
                                    checkedIcon={<CheckBoxIcon fontSize="large" />}
                                    color="primary"
                                    disabled
                                />
                            }
                            disabled
                            label="Mostrar importes en el histórico de viajes"/>}
                    </Grid>
                </Grid>
                <Grid container style={{marginTop: '20px', marginBottom: '20px'}}>
                    <Grid item xs={2}>
                        <Button color="primary" style={{textTransform:'none'}} onClick={this.handleEliminar}>
                            Eliminar
                        </Button>
                    </Grid>
                    <Grid item xs={5}>
                        <Button color="primary" style={{textTransform:'none'}}>
                            Liga de seguimiento de unidades
                        </Button>
                    </Grid>
                    <Grid item xs={5}>
                        <Button color="primary" style={{textTransform:'none'}} variant={'contained'}>
                            Clientes asociados
                        </Button>
                    </Grid>
                </Grid>
            </div>
        )
    }
}