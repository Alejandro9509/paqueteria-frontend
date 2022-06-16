import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Cabecera from '../../Components/Template/Cabecera';
import BarraLateralIzquierda from '../../Components/Template/BarraLateralIzquierda';
import Noty from 'noty';
import axios from "axios";
import SvgIcon from "@material-ui/core/SvgIcon";
import { ReactComponent as Activo } from "../../iconos/Menu/palomita.svg";
import { ReactComponent as NoActivo } from "../../iconos/Menu/cruz.svg";
import { DataGrid } from '@material-ui/data-grid';
import $ from "jquery";
import {Button, Dialog, DialogActions, DialogContent, DialogTitle, Grid} from "@material-ui/core";
import FormControl from "@material-ui/core/FormControl";
import InputLabel from "@material-ui/core/InputLabel";
import Select from "@material-ui/core/Select";
import TextField from "@material-ui/core/TextField";
import { obtenerClasificacionViajeId } from '../../Util/Contexts/ClasificacionViajeContext';
window.jQuery = window.$ = $;


class AgregarClasificacionViaje extends Component {

    constructor(props) {
        super(props);
        this.state = {
            dataTipoViaje: [],
            currentClasificacionViaje: null,
            idClasificacionViaje: props.idTipoUnidad,
            edit: props.edit,
            tipoViaje: '',
            activo: false,
            codigo: ''
        }

        if (props.edit) {
            this.handleShowConsultar(props.idTipoUnidad)
        }

        console.log(props)
        this.handleChange = this.handleChange.bind(this);
        this.onSubmit = this.onSubmit.bind(this)
        //this.getAllDataTipoViaje = this.getAllDataTipoViaje.bind(this);
        this.handleShowConsultar = this.handleShowConsultar.bind(this);
    }

    componentWillMount() {
        //this.getAllDataTipoViaje()
    }

    onSubmit(event) {
        event.preventDefault()
        this.props.onSubmit(this.state)
    }

    handleChange = (event) => {
        event.preventDefault();
        this.setState({
            [event.target.name]: event.target.value,
        });
    };

    // getAllDataTipoViaje() {
    //     const url = `${process.env.REACT_APP_API_URL}/TipoViaje/GetListado`;
    //     axios.get(url, { headers }).then(respuesta => {
    //         this.setState({dataTipoViaje: respuesta.data})
    //     });
    // };

    handleShowConsultar(id) {
        obtenerClasificacionViajeId(id).then(respuesta => {
            console.log(respuesta.data)
            this.setState({
                codigo: respuesta.data.Codigo,
                tipoViaje: respuesta.data.TipoViaje,
                activo: respuesta.data.Activo
            })
        });
    }

    render() {
        return (
            <form className="j-forms" onSubmit={this.onSubmit}>
                <div className="main-container" style={{ marginLeft: "0px", padding: "0px" }}>
                    <div className="widget-wrap">
                        <div className="widget-content">
                <div className="row" >
                    <div className="col-sm-12 col-md-4 col-lg-3 unit">
                        <div className="input">
                            <TextField variant="outlined" margin="dense"
                                       onChange={this.handleChange}
                                       className="form-control"
                                       type="number"
                                       required
                                       label="Código"
                                       value={this.state.codigo}
                                       name={"codigo"}
                                       id="codigo"
                            />
                        </div>
                    </div>

                    <div className="col-sm-12 col-md-1 col-lg-1 unit">
                        <div className="inline-group">
                            <label className="checkbox">
                                <input
                                    onChange={this.handleChange}
                                    native
                                    name="activo"
                                    type="checkbox"
                                    value={this.state.activo}
                                    id="timbrar"
                                />
                                <i />
                                Activo
                            </label>
                        </div>
                    </div>

                    <div className="col-sm-12 col-md-4 col-lg-3 unit">
                        <div className="input">
                            <TextField variant="outlined" margin="dense"
                                       onChange={this.handleChange}
                                       className="form-control"
                                       type="text"
                                       required
                                       label="Clasificación"
                                       value={this.state.tipoViaje}
                                       name={"tipoViaje"}
                                       id="tipoViaje"
                            />
                        </div>
                    </div>

                    {/*<div className="col-sm-6 col-md-4 col-lg-4 unit">*/}
                    {/*    <label className="input select">*/}
                    {/*        <FormControl fullWidth variant="outlined" margin="dense">*/}
                    {/*            <InputLabel id="idSucursalAgregarLabel">Tipo Viaje</InputLabel>*/}
                    {/*            <Select*/}
                    {/*                labelId="idSucursalAgregarLabel"*/}
                    {/*                className="form-control"*/}
                    {/*                required*/}
                    {/*                value={this.state.idSucursalAgregar}*/}
                    {/*                onChange={this.handleChange}*/}
                    {/*                id="idSucursalAgregar"*/}
                    {/*                name={"idSucursalAgregar"}*/}
                    {/*                label="Tipo Viaje"*/}
                    {/*            >*/}
                    {/*                {this.state.dataSucursal.map((sucursal) => (*/}
                    {/*                    <option*/}
                    {/*                        key={sucursal.m_nIdSucursal}*/}
                    {/*                        value={sucursal.m_nIdSucursal}*/}
                    {/*                    >*/}
                    {/*                        {sucursal.m_sSucursal}*/}
                    {/*                    </option>*/}
                    {/*                ))}*/}
                    {/*            </Select>*/}
                    {/*        </FormControl>*/}
                    {/*    </label>*/}
                    {/*</div>*/}
                </div>

                <div className={"row"}>
                                    <Grid container spacing={1}>
                                        <Grid item xs>
                                        <Button fullWidth className="btn btn-secondary secondary-btn" onClick={this.props.onClose}>CANCELAR</Button>
                                        </Grid>
                                        <Grid item xs>
                                        <Button fullWidth className="btn btn-primary primary-btn" type={"submit"} >AGREGAR CLASIFICACIÓN VIAJE</Button>
                                        </Grid>
                                    </Grid>
                                

                </div>
                        </div>
                    </div>
                </div>
            </form>
        );
    }
}

AgregarClasificacionViaje.propTypes = {

};

export default AgregarClasificacionViaje;