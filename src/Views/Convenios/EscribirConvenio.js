import React, {Component} from "react";
import {Grid, IconButton, MenuItem, TextField} from "@material-ui/core";
import AddBoxIcon from "@material-ui/icons/AddBox";
import {DataGrid} from "@material-ui/data-grid";
import CancelIcon from "@material-ui/icons/Cancel";
import {FormularioContactoCreado} from "../Clientes/FormularioContactoCreado";

export default class EscribirConvenio extends Component{
    state = {
        nombreBeneficiario: "",
        tarifa : "",
        vigencia: "",
        rfc: "",
        tarifas : [{
            tipoServicioName: "Prueba",
            tipoServicioId: 1,
            tarifa: 0.0
        }],
        servicioSelecId : -1,
        servicioSelecName : "",
        tipoServicios : [
            {
                id: 0,
                name: 'Recolección',
            },
            {
                id: 1,
                name: 'Servicio 2',
            },
            {
                id: 2,
                name: 'Servicio 3',
            },
        ],
    }

    handleChange = ({target}) => {
        this.setState({
            [target.name] : target.value
        })
    }
    handleServicioChange = ({target}) => {
        let itemSelectec = this.state.tipoServicios.filter(function (item){
            return item.id === target.value
        })
        console.log(itemSelectec)
        this.setState({
            servicioSelecId : itemSelectec[0].id,
            servicioSelecName : itemSelectec[0].name
        })
    }

    handleAddTarifa = () => {
        let value = this.state.tarifas
        value.push(
            {
                tarifa : this.state.tarifa,
                tipoServicioName : this.state.servicioSelecName,
                tipoServicioId : this.state.servicioSelecId
            })
        this.setState({
            tarifa : "",
            tarifas : value,
        })
    }

    handleRemoveTarifa = (index) => {
        let aux = this.state.tarifas
        aux.splice(index, 1)
        this.setState({
            servicioSelecId : "",
            servicioSelecName : "",
            tarifa : "",
            tarifas : aux,
        })
    }

    getTipoServicios = () => {
        this.setState({
            tipoServicios : [
                {
                    id: 0,
                    name: 'Recolección',
                },
                {
                    id: 1,
                    name: 'Servicio 2',
                },
                {
                    id: 2,
                    name: 'Servicio 3',
                },
            ]
        })
    }

    render() {
        const usuario = "Roberto Martinez"
        const IdConvenio = "42342353"
        const {nombreBeneficiario, rfc, tarifa, vigencia, tarifas, tipoServicios, servicioSelecId} = this.state
        console.log(this.state)
        return (
            <form>
                <Grid container spacing={3}>
                    <Grid item xs={3}>
                        <p>Usuario: <span>{usuario}</span></p>
                    </Grid>
                    <Grid item xs={7}/>
                    <Grid item xs={2}>
                        <p>ID: <span>{IdConvenio}</span></p>
                    </Grid>
                    <Grid item xs={3}>
                        <TextField
                            id={'beneficiario'} required
                            variant={'outlined'}
                            margin={'dense'}
                            type={'text'}
                            label={'Nombre beneficiario'}
                            name={'nombreBeneficiario'}
                            value={nombreBeneficiario}
                            onChange={this.handleChange}
                            InputLabelProps={{
                                shrink: true,
                            }}
                        />
                    </Grid>
                    <Grid item xs={2}>
                        <TextField
                            id={'rfc'} required
                            variant={'outlined'}
                            margin={'dense'}
                            type={'text'}
                            label={'RFC'}
                            name={'rfc'}
                            value={rfc}
                            onChange={this.handleChange}
                            InputLabelProps={{
                                shrink: true,
                            }}
                        />
                    </Grid>
                    <Grid item xs={2}>
                        <TextField
                            variant="outlined" margin="dense"
                            onChange={this.handleChange}
                            className="form-control"
                            type="datetime-local"
                            InputLabelProps={{
                                shrink: true,
                            }}
                            fullWidth
                            label="Vigencia"
                            value={vigencia}
                            id="vigencia"
                            name="vigencia"/>
                    </Grid>
                    <Grid item xs={2}>
                        <TextField
                            id="servicioSelecId"
                            select
                            label="Tipo de servicio"
                            value={servicioSelecId}
                            onChange={this.handleServicioChange}
                            name={'servicio'}
                            variant="outlined"
                        >
                            {tipoServicios.map((option) => (
                                <MenuItem key={option.id} value={option.id}>
                                    {option.name}
                                </MenuItem>
                            ))}
                        </TextField>
                    </Grid>
                    <Grid item xs={3} container direction={'row'}>
                        <Grid item xs={11}>
                            <TextField
                                id={'tarifa'} required
                                variant={'outlined'}
                                margin={'dense'}
                                type={'text'}
                                label={'Tarifa'}
                                name={'tarifa'}
                                value={tarifa}
                                onChange={this.handleChange}
                                InputLabelProps={{
                                    shrink: true,
                                }}
                            />
                        </Grid>
                        <Grid item xs={1}>
                            <IconButton onClick={this.handleAddTarifa} style={{ padding: "0px" }}>
                                <AddBoxIcon style={{ fill: "green", fontSize: "xx-large" }} />
                            </IconButton>
                        </Grid>
                    </Grid>
                    <Grid item xs={9}/>
                    <Grid item xs={3}>
                        {
                            this.state.tarifas.length !== 0 &&
                            <table style={{ width: "100%" }}>
                                <tr>
                                    <th style={{ textAlign: "left" }}>Tipo de servicio</th>
                                    <th style={{ textAlign: "left" }}>Tarifas</th>
                                </tr>
                                {
                                    tarifas.map((t, index) => (
                                        <tr>
                                            <td style={{ textAlign: "left" }}>{t.tipoServicioName}</td>
                                            <td style={{ textAlign: "left" }}>{t.tarifa}</td>
                                            <td>
                                                <IconButton onClick={() => this.handleRemoveTarifa(index)}>
                                                    <CancelIcon style={{ fill: "red", fontSize: "x-large" }} />
                                                </IconButton>
                                            </td>
                                        </tr>
                                    ))
                                }
                            </table>
                        }
                    </Grid>
                </Grid>

            </form>
        );
    }
}