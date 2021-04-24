import React, { Component } from 'react';
import PropTypes from 'prop-types';
import axios from "axios";
import { AppBar, Box, Tab, Tabs, Typography } from '@material-ui/core';
import ConceptosAdicionales from './ConceptosAdicionales';
import TipoCobro from './TipoCobro';
import TipoServicio from './TipoServicio';
import SvgIcon from "@material-ui/core/SvgIcon";
import { getUniqueListBy } from '../../Util/Util';

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
class CrearTarifa extends Component {
    constructor(props) {
        super(props);
        this.state = {
            dataSucursal: [],
            ciudades: [],
            tab: 0,
            conceptosAdicionales: [],
            tiposCobroSeleccionado: [],
            tiposServicioSeleccionado: [],
            tiposCobroAll: false,
            tiposServicioAll: false,
            ivaTraslada: [],
            ivaRetiene: []
        }
        this.getAllSucursales = this.getAllSucursales.bind(this)
        this.handleChange = this.handleChange.bind(this)
        this.getAllCiudades = this.getAllCiudades.bind(this)
        this.handleTabChange = this.handleTabChange.bind(this)
        this.addConcepto = this.addConcepto.bind(this)
        this.removeConcepto = this.removeConcepto.bind(this)
        this.handleChangeChecboxTiposCobro = this.handleChangeChecboxTiposCobro.bind(this)
        this.handleChangeChecboxTiposServicio = this.handleChangeChecboxTiposServicio.bind(this)
    }

    componentWillMount() {

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

    getAllSucursales() {
        const url = `${process.env.REACT_APP_API_URL}/Sucursales/GetListado`;
        axios.get(url, { headers }).then((respuesta) => {
            this.setState({ dataSucursal: respuesta.data });
        });
    }

    handleChange(event) {
        this.setState({
            [event.target.name]: event.target.value
        });
    }

    addConcepto(data) {
        const { conceptosAdicionales } = this.state
        var ivaTraslada = []
        var ivaRetiene = []
        conceptosAdicionales.push({ concepto: data.concepto, importe: data.importe, retiene: data.retiene, traslada: data.traslada, importeRet: data.importeRet, importeIVA: data.importeIVA })
        ivaTraslada = getUniqueListBy(conceptosAdicionales, "traslada").map(i => i.traslada);
        ivaRetiene = getUniqueListBy(conceptosAdicionales, "retiene").map(i => i.retiene);
        this.setState({ conceptosAdicionales: conceptosAdicionales, ivaRetiene: ivaRetiene, ivaTraslada: ivaTraslada })
    }

    removeConcepto(index) {
        const { conceptosAdicionales } = this.state
        conceptosAdicionales.splice(index, 1)
        this.setState({ conceptosAdicionales: conceptosAdicionales })
    }

    getAllCiudades() {
        const url = `${process.env.REACT_APP_API_URL}/Ciudades/GetListado`;
        axios.get(url, { headers }).then((respuesta) => {
            this.setState({ ciudades: respuesta.data });
        });
    }

    componentWillUnmount() {

    }

    handleTabChange(event, newValue) {
        this.setState({ tab: newValue });
    }

    handleChangeChecboxTiposCobro(event, index, arrayTipos, all) {
        const array = this.state.tiposCobroSeleccionado
        if (all) {
            this.setState({
                tiposCobroAll: true,
                tiposCobroSeleccionado: arrayTipos
            });
            return
        }
        if (event.target.checked) {
            array.push(arrayTipos[index])
            this.setState({
                tiposCobroSeleccionado: array
            });
        } else {
            array.splice(array.indexOf(a => a.m_nIdTipoCobro === arrayTipos[index].m_nIdTipoCobro), 1)
            this.setState({
                tiposCobroAll: false,
                tiposCobroSeleccionado: array
            });
        }

    }
    
    handleChangeChecboxTiposServicio(event, index, arrayTipos, all) {
        const array = this.state.tiposServicioSeleccionado
        if (all) {
            this.setState({
                tiposServicioAll: true,
                tiposServicioSeleccionado: arrayTipos
            });
            return
        }
        if (event.target.checked) {
            array.push(arrayTipos[index])
            this.setState({
                tiposServicioSeleccionado: array
            });
        } else {
            array.splice(array.indexOf(a => a.m_nIdTipoServicio === arrayTipos[index].m_nIdTipoServicio), 1)
            this.setState({
                tiposServicioAll: false,
                tiposServicioSeleccionado: array
            });
        }

    }

    render() {
        return (
            <form className="j-forms">
                <div className="main-container" style={{ marginLeft: "0px", padding: "0px" }}>
                    <div className="row">
                        <div className="col-md-4 col-sm-12">
                            <div className="widget-wrap">
                                <div className="widget-content">
                                    <div className="row">
                                        <div className="col-md-12 col-sm-12">
                                            <h4>Agregando Tarifas</h4>
                                        </div>
                                    </div>
                                    <div className="row">
                                        <div className="col-md-12 col-sm-12" style={{ padding: "2px" }}>
                                            <label className="label">Sucursal</label>
                                            <label className="input select" style={{ width: "100%" }}>
                                                <select
                                                    className="form-control"
                                                    required
                                                    name="sucursal"
                                                >
                                                    {this.state.dataSucursal.map((sucursal) => (
                                                        <option
                                                            key={sucursal.m_nIdSucursal}
                                                            value={sucursal.m_nIdSucursal}
                                                        >
                                                            {sucursal.m_sSucursal}
                                                        </option>
                                                    ))}
                                                </select>
                                                <i></i>
                                            </label>
                                        </div>
                                        <div className="col-md-12 col-sm-12" style={{ padding: "2px" }}>
                                            <label className="label">Destino</label>
                                            <label className="input select" style={{ width: "100%" }}>
                                                <select
                                                    className="form-control"
                                                    required
                                                    name="sucursal"
                                                >
                                                    {this.state.ciudades.map((sucursal) => (
                                                        <option
                                                            key={sucursal.m_nIdCiudad}
                                                            value={sucursal.m_nIdCiudad}
                                                        >
                                                            {sucursal.m_sCiudad}
                                                        </option>
                                                    ))}
                                                </select>
                                                <i></i>
                                            </label>
                                        </div>
                                        <div className="col-md-6 col-sm-6" style={{ padding: "2px" }}>
                                            <label className="label">
                                                Precio m<sup>3</sup>
                                            </label>
                                            <div className="input">
                                                <input
                                                    onChange={this.handleChange}
                                                    className="form-control"
                                                    type="number"
                                                    required
                                                    step="1"
                                                    value={this.state.precioM3}
                                                    name="precioM3"
                                                />
                                            </div>
                                        </div>
                                        <div className="col-md-6 col-sm-6" style={{ padding: "2px" }}>
                                            <label className="label">
                                                Precio Kilo
                                            </label>
                                            <div className="input">
                                                <input
                                                    onChange={this.handleChange}
                                                    className="form-control"
                                                    type="number"
                                                    required
                                                    step="2"
                                                    value={this.state.precioKilo}
                                                    name="precioKilo"
                                                />
                                            </div>
                                        </div>
                                        <div className="col-md-6 col-sm-6" style={{ padding: "2px" }}>
                                            <label className="label">
                                                Flete Minimo
                                            </label>
                                            <div className="input">
                                                <input
                                                    onChange={this.handleChange}
                                                    className="form-control"
                                                    type="number"
                                                    required
                                                    step="1"
                                                    value={this.state.precioFlete}
                                                    name="precioFlete"
                                                />
                                            </div>
                                        </div>
                                        <div className="col-md-6 col-sm-6" style={{ padding: "2px" }}>
                                            <label className="label">
                                                Precio Minimo
                                            </label>
                                            <div className="input">
                                                <input
                                                    onChange={this.handleChange}
                                                    className="form-control"
                                                    type="number"
                                                    required
                                                    step="2"
                                                    value={this.state.precioMinimo}
                                                    name="precioMinimo"
                                                />
                                            </div>
                                        </div>

                                        <div className="col-md-12 col-sm-12" style={{ padding: "2px", display:"inline-flex" }}>
                                            <div className="form-footer " className="col-md-12" style={{padding: "10px"}}>
                                                <button
                                                    type="button"
                                                    onClick={() => console.log("")}
                                                    className="btn btn-secondary secondary-btn"
                                                    onClick={() => this.props.cancelAction(1)}
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
                        <div className="col-md-8 col-sm-12" >
                            <div className="widget-wrap" style={{ margin: "0px", padding: "0px", minHeight: "500px" }}>
                                <div className="widget-content">
                                    <Tabs value={this.state.tab} onChange={this.handleTabChange} aria-label="simple tabs example">
                                        <Tab label="Concetos Adicionales por Destino" {...this.a11yProps(0)} className={{ backgroundColor: "white !important" }} />
                                        <Tab label="Condiciones de Precios por Destino" {...this.a11yProps(1)} />
                                        <Tab label="Condiciones de Precio por Tipo de Servicio" {...this.a11yProps(2)} />
                                    </Tabs>
                                    <TabPanel value={this.state.tab} index={0}>
                                        <ConceptosAdicionales conceptosAdicionales={this.state.conceptosAdicionales} addConcepto={this.addConcepto} removeConcepto={this.removeConcepto} ivaRetiene={this.state.ivaRetiene} ivaTraslada={this.state.ivaTraslada}>

                                        </ConceptosAdicionales>
                                    </TabPanel>
                                    <TabPanel value={this.state.tab} index={1}>
                                        <TipoCobro tiposCobroSeleccionado={this.state.tiposCobroSeleccionado} handleChange={this.handleChangeChecboxTiposCobro} all={this.state.tiposCobroAll}>

                                        </TipoCobro>
                                    </TabPanel>
                                    <TabPanel value={this.state.tab} index={2}>
                                        <TipoServicio tiposServicioSeleccionado={this.state.tiposServicioSeleccionado} handleChange={this.handleChangeChecboxTiposServicio} all={this.state.tiposServicioAll}>

                                        </TipoServicio>
                                    </TabPanel>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </form>
        );
    }
}

CrearTarifa.propTypes = {

};

export default CrearTarifa;

function TabPanel(props) {
    const { children, value, index, ...other } = props;

    return (
        <div
            role="tabpanel"
            hidden={value !== index}
            id={`simple-tabpanel-${index}`}
            aria-labelledby={`simple-tab-${index}`}
            {...other}
        >
            {value === index && (
                <Box p={1}>
                    {children}
                </Box>
            )}
        </div>
    );
}