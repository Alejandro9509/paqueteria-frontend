import React, {Component} from 'react';
import Ciudad from './Ciudad';
import CodigoPostal from './CodigoPostal';
import Localidad from './Localidad';
import PropTypes from 'prop-types';
import axios from "axios";
import {AppBar, Box, FormControl, InputLabel, Select, Tab, Tabs, TextField, Typography} from '@material-ui/core';
import {obtenerCodigoPostalCiudad} from "../../Util/Contexts/CodigoPostalContext";

const headers = {
    'Content-Type': 'application/json',
    //    'access-control-allow-origin': '*'
}

function a11yProps(index) {
    return {
        id: `simple-tab-${index}`,
        'aria-controls': `simple-tabpanel-${index}`,
    };
}

class ZonasAgregar extends Component {
    constructor(props) {
        super(props);
        this.state = {
            height: window.innerHeight,
            dataSucursal: [],
            idEstadoSucursal: 0,
            tab: 0,
            seleccionarTodoCiudades: false,
            seleccionarTodoCodigoPostales: false,
            seleccionarTodoLocalidades: false,
            idCiudadSeleccionado: 0,
            idCodigoPostalSeleccionado: 0,
            ciudadesSeleccionado: props.edit ? props.select.m_arrZonasCiudades : [],
            codigoPostalesSeleccionado: props.edit ? props.select.m_arrZonasCodigoPostales : [],
            localidadesSeleccionado: props.edit ? props.select.m_arrZonasLocalidad : [],
            sucursal: props.edit ? props.select.m_nIdSucursal : 0,
            folio: props.edit ? props.select.m_nFolio : "0",
            descripcion: props.edit ? props.select.m_sDescripcion : "",
            costoRecolectar: props.edit ? props.select.m_cyCostoRecolectar : "",
            costoEntregar: props.edit ? props.select.m_cyCostoEntregar : "",
            editar: props.consult,
            dataCodigoPostales: [],
            dataLocalidades: [],
        }
        this.getAllSucursales = this.getAllSucursales.bind(this)
        this.handleChange = this.handleChange.bind(this)
        this.handleSucursalChange = this.handleSucursalChange.bind(this)
        this.getAllCiudades = this.getAllCiudades.bind(this)
        this.handleTabChange = this.handleTabChange.bind(this)
        this.handleChangeChecboxCiudad = this.handleChangeChecboxCiudad.bind(this)
        this.handleChangeChecboxCodigoPostal = this.handleChangeChecboxCodigoPostal.bind(this)
        this.handleChangeChecboxLocalidad = this.handleChangeChecboxLocalidad.bind(this)
        this.onSubmit = this.onSubmit.bind(this)
        this.setEstadoId = this.setEstadoId.bind(this)
        this.getAllCodigoPostales = this.getAllCodigoPostales.bind(this)
        this.getAllLocalidades = this.getAllLocalidades.bind(this)
    }

    componentWillMount() {
        this.getAllSucursales().then(o => {
            //console.log(this.state.ciudadesSeleccionado)
            //console.log(this.state.codigoPostalesSeleccionado)
            //console.log(this.state.localidadesSeleccionado)
            if (this.state.sucursal) {
                this.setEstadoId()
            }
        })
        //console.log("editar aqui")
        //console.log(this.state.editar)
    }

    a11yProps(index) {
        return {
            id: `simple-tab-${index}`,
            'aria-controls': `simple-tabpanel-${index}`,
        };
    }

    componentDidMount() {
        this.getAllSucursales()
        this.getAllCiudades()
    }

    setEstadoId() {
        var idEstado = this.state.dataSucursal.find(s => s.m_nIdSucursal == this.state.sucursal).m_nIdEstado
        this.setState({
            idEstadoSucursal: idEstado,
            idCiudadSeleccionado: 0,
            idCodigoPostalSeleccionado: 0
        });
    }

    async getAllSucursales() {
        const url = `${process.env.REACT_APP_API_URL}/Sucursales/GetListado`;
        await axios.get(url, {headers}).then((respuesta) => {
            this.setState({dataSucursal: respuesta.data});
        });
    }

    handleChange(event) {
        event.preventDefault()
        this.setState({
            [event.target.name]: event.target.value
        });
    }

    handleSucursalChange(event) {
        event.preventDefault()
        this.setState({
            sucursal: event.target.value
        });
        let idEstado = this.state.dataSucursal.find(s => s.m_nIdSucursal == event.target.value).m_nIdEstado
        this.setState({
            idEstadoSucursal: idEstado,
            idCiudadSeleccionado: 0,
            idCodigoPostalSeleccionado: 0
        });
    }

    getAllCiudades() {
        //const url = `${process.env.REACT_APP_API_URL}/Ciudades/GetListado`;
        //axios.get(url, { headers }).then((respuesta) => {
        //this.setState({ dataCiudades: respuesta.data });
        //});
    }

    componentWillUnmount() {

    }

    handleTabChange(event, newValue) {
        this.setState({tab: newValue});
    }

    handleChangeChecboxCiudad(event, index, arrayCiudades, seleccionarTodoCiudades) {
        const array = this.state.ciudadesSeleccionado
        if (seleccionarTodoCiudades) {
            let arrayAll = Object.assign([], arrayCiudades)
            this.setState({
                seleccionarTodoCiudades: !this.state.seleccionarTodoCiudades,
                ciudadesSeleccionado: !this.state.seleccionarTodoCiudades ? arrayAll : []
            });
            return
        }
        console.log(event)
        if (event) {
            array.push(arrayCiudades[index])
            this.setState({
                ciudadesSeleccionado: array,
                idCiudadSeleccionado: arrayCiudades[index].m_nIdCiudad,
                idCodigoPostalSeleccionado: 0
            });
        } else {
            let position = array.findIndex(a => a.m_nIdCiudad == arrayCiudades[index].m_nIdCiudad)
            array.splice(position, 1)
            this.setState({
                seleccionarTodoCiudades: false,
                ciudadesSeleccionado: array,
                idCiudadSeleccionado: 0,
                idCodigoPostalSeleccionado: 0
            });
        }
        console.log(array)
        this.getAllCodigoPostales(array)
    }

    getAllCodigoPostales(ciudadesSeleccionado) {
        const {codigoPostalesSeleccionado} = this.state
        const todosCodigosPostales = []

        if (ciudadesSeleccionado.length > 0){
            ciudadesSeleccionado.forEach( ciudad => {
                obtenerCodigoPostalCiudad(ciudad.m_nIdCiudad).then(respuesta => {
                    respuesta.data.forEach( item => {
                        todosCodigosPostales.push(item)
                    })
                    todosCodigosPostales.forEach( (i, index) => {
                        let isCheked = codigoPostalesSeleccionado.find(t => t.m_nIdCP === i.m_nIdCP) != null
                        if (isCheked){
                            this.handleChangeChecboxCodigoPostal(isCheked, index, todosCodigosPostales, false)
                        }
                    })
                    this.setState({
                        dataCodigoPostales: todosCodigosPostales,
                        anchorEl: null
                    }, () => {
                        // console.log('todosCodigosPostales: ', todosCodigosPostales)
                    })
                });
            })
        }
    }

    handleChangeChecboxCodigoPostal(event, index, arrayCodigoPostales, all) {
        const array = this.state.codigoPostalesSeleccionado

        if (all) {
            let arrayAll = Object.assign([], arrayCodigoPostales)
            this.setState({
                seleccionarTodoCodigoPostales: !this.state.seleccionarTodoCodigoPostales,
                codigoPostalesSeleccionado: !this.state.seleccionarTodoCodigoPostales ? arrayAll : []
            });
            return
        }
        if (event) {
            array.push(arrayCodigoPostales[index])
            this.setState({
                codigoPostalesSeleccionado: array,
                idCodigoPostalSeleccionado: arrayCodigoPostales[index].m_nIdCP,
            });
        } else {
            let position = array.findIndex(a => a.m_nIdCP == arrayCodigoPostales[index].m_nIdCP)
            array.splice(position, 1)
            this.setState({
                seleccionarTodoCodigoPostales: false,
                codigoPostalesSeleccionado: array,
                idCodigoPostalSeleccionado: 0
            });
        }
        this.getAllLocalidades(array)

    }

    getAllLocalidades(codigosPostalesSeleccionados) {

        const todasLocalidades = []
        if (codigosPostalesSeleccionados.length > 0){
            codigosPostalesSeleccionados.forEach( cp => {
                const url = `${process.env.REACT_APP_API_URL}/Asentamiento/GetListadoByCodigoPostal/${cp.m_nIdCP}`;
                axios.get(url, { headers }).then(respuesta => {
                    respuesta.data.forEach( local => {
                        todasLocalidades.push(local)
                    })
                    this.setState({ dataLocalidades: todasLocalidades, anchorEl: null })
                });
            })
        }

    }

    handleChangeChecboxLocalidad(event, index, arrayLocalidades, all) {
        const array = this.state.localidadesSeleccionado

        if (all) {
            let arrayAll = Object.assign([], arrayLocalidades)
            this.setState({
                seleccionarTodoLocalidades: !this.state.seleccionarTodoLocalidades,
                localidadesSeleccionado: !this.state.seleccionarTodoLocalidades ? arrayAll : []
            });
            return
        }
        if (event.target.checked) {
            //console.log(index)
            array.push(arrayLocalidades[index])
            this.setState({
                localidadesSeleccionado: array
            });
        } else {
            var position = array.findIndex(a => a.m_nIdLocalidad == arrayLocalidades[index].m_nIdLocalidad)
            array.splice(position, 1)
            this.setState({
                seleccionarTodoLocalidades: false,
                localidadesSeleccionado: array
            });
        }

    }

    onSubmit(event) {
        event.preventDefault()
        this.props.onSubmit(this.state)
    }

    render() {
        //Pueden estar en la misma linea pero quedaría muy largo
        const {sucursal, idEstadoSucursal, ciudadesSeleccionado, editar, seleccionarTodoCiudades} = this.state
        const {idCiudadSeleccionado, codigoPostalesSeleccionado,seleccionarTodoCodigoPostales, dataCodigoPostales} = this.state
        const {dataLocalidades, localidadesSeleccionado, idCodigoPostalSeleccionado, seleccionarTodoLocalidades} = this.state



        return (
            <form className="j-forms" onSubmit={this.onSubmit}>
                <div className="main-container" style={{marginLeft: "0px", padding: "0px"}}>
                    <div className="row">
                        <div className="col-md-12 col-sm-12">
                            <div className="widget-wrap">
                                <div className="widget-content">
                                    <div className="row">
                                        <div className="col-md-12 col-sm-12">
                                            <h4>Agregando Zonas</h4>
                                        </div>
                                    </div>
                                    <div className="row">
                                        <div className="col-md-4 col-sm-12" style={{padding: "5px"}}>

                                            <div className="input">
                                                <TextField variant="outlined" margin="dense"
                                                           onChange={this.handleChange}
                                                           disabled={this.state.editar}
                                                           className="form-control"
                                                           type="number"
                                                           label={<div>Folio</div>}
                                                           step="1"
                                                           value={this.state.folio}
                                                           name="folio"
                                                />
                                            </div>
                                        </div>
                                        <div className="col-md-4 col-sm-12" style={{padding: "5px"}}>

                                            <div className="input">
                                                <TextField variant="outlined" margin="dense"
                                                           onChange={this.handleChange}
                                                           disabled={this.state.editar}
                                                           className="form-control"
                                                           type="text"
                                                           label="Descripción"
                                                           required
                                                           value={this.state.descripcion}
                                                           name="descripcion"
                                                />
                                            </div>
                                        </div>
                                        <div className="col-md-4 col-sm-12" style={{padding: "5px"}}>
                                            <label className="input select" style={{width: "100%"}}>
                                                <FormControl fullWidth variant="outlined" margin="dense">
                                                    <InputLabel id="sucursalLabel">Sucursal</InputLabel>
                                                    <Select
                                                        native
                                                        labelId="sucursalLabel"
                                                        label="Sucursal"
                                                        disabled={this.state.editar}
                                                        className="form-control"
                                                        required
                                                        onChange={this.handleSucursalChange}
                                                        value={this.state.sucursal}
                                                        name="sucursal"
                                                        id="sucursal"
                                                    >
                                                        <option
                                                            key={"0"}
                                                            value={"0"}
                                                        >
                                                            Seleccionar
                                                        </option>
                                                        {this.state.dataSucursal.map((sucursal) => (
                                                            <option
                                                                key={sucursal.m_nIdSucursal}
                                                                value={sucursal.m_nIdSucursal}
                                                            >
                                                                {sucursal.m_sSucursal}
                                                            </option>
                                                        ))}
                                                    </Select>
                                                </FormControl>
                                            </label>
                                        </div>

                                        <div className="col-md-4 col-sm-12" style={{
                                            height: this.state.height - 375,
                                            overflowY: "auto",
                                            padding: "5px"
                                        }}>
                                            {sucursal != 0 &&
                                                <Ciudad
                                                    idEstadoSucursal={idEstadoSucursal}
                                                    ciudadesSeleccionado={ciudadesSeleccionado}
                                                    handleChangeChecboxCiudad={this.handleChangeChecboxCiudad}
                                                    editar={editar}
                                                    seleccionarTodoCiudades={seleccionarTodoCiudades}
                                                />
                                            }

                                        </div>

                                        <div className="col-md-4 col-sm-12" style={{
                                            height: this.state.height - 375,
                                            overflowY: "auto",
                                            padding: "5px"
                                        }}>
                                            {ciudadesSeleccionado.length > 0 &&
                                                <CodigoPostal
                                                    ciudadesSeleccionado={ciudadesSeleccionado}
                                                    idCiudadSeleccionado={idCiudadSeleccionado}
                                                    codigoPostalesSeleccionado={codigoPostalesSeleccionado}
                                                    handleChange={this.handleChangeChecboxCodigoPostal}
                                                    editar={editar}
                                                    seleccionarTodoCodigoPostales={seleccionarTodoCodigoPostales}
                                                    dataCodigoPostales={dataCodigoPostales}
                                                />

                                            }
                                        </div>

                                        <div className="col-md-4 col-sm-12" style={{
                                            height: this.state.height - 375,
                                            overflowY: "auto",
                                            padding: "5px"
                                        }}>
                                            {codigoPostalesSeleccionado.length > 0 &&
                                                <Localidad
                                                    localidadesSeleccionado={localidadesSeleccionado}
                                                    idCodigoPostalSeleccionado={idCodigoPostalSeleccionado}
                                                    handleChange={this.handleChangeChecboxLocalidad}
                                                    editar={editar}
                                                    seleccionarTodoLocalidades={seleccionarTodoLocalidades}
                                                    dataLocalidades={dataLocalidades}
                                                />

                                            }

                                        </div>

                                        <div style={{float: "right", marginRight: "0px"}}>
                                        </div>

                                        <div className="col-md-12 col-sm-12"
                                             style={{padding: "5px", display: "inline-flex"}}>
                                            <div className="form-footer " className="col-md-12"
                                                 style={{padding: "10px"}}>
                                                <div className="col-md-12 col-sm-12">
                                                </div>

                                                <button
                                                    type="button"
                                                    className="btn btn-secondary secondary-btn"
                                                    role="tab" data-toggle="tab"
                                                    href="#Listado"
                                                >
                                                    Cancelar
                                                </button>
                                                <button
                                                    type="submit"
                                                    className="btn btn-primary primary-btn"
                                                >
                                                    Aceptar
                                                </button>
                                            </div>
                                        </div>
                                    </div>

                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </form>
        );
    }
}

ZonasAgregar.propTypes = {};

export default ZonasAgregar;
