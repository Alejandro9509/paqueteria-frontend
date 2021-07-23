import React, { Component } from 'react';
import PropTypes from 'prop-types';
import axios from "axios";
import { AppBar, Box, FormControl, InputLabel, Select, Tab, Tabs, TextField, Typography, Checkbox } from '@material-ui/core';
import ConceptosAdicionales from './ConceptosAdicionales';
import ConceptosAdicionalesManiobra from './ConceptosAdicionalesManiobra';
import ConceptosAdicionalesEntrega from './ConceptosAdicionalesEntrega';
import ConceptosAdicionalesRecoleccion from './ConceptosAdicionalesRecoleccion';
import TipoCobro from './TipoCobro';
import TipoServicio from './TipoServicio';
import SvgIcon from "@material-ui/core/SvgIcon";
import { getUniqueListBy } from '../../Util/Util';
import { PowerInputSharp } from '@material-ui/icons';
import { obtenerCiudades } from '../../Util/Contexts/CiudadesContext';

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
            impuestos: [],
            tiposCobroSeleccionado: props.edit ? props.select.m_arrArCobros : [],
            tiposServicioSeleccionado: props.edit ? props.select.m_arrArServicios : [],
            tiposCobroAll: false,
            tiposServicioAll: false,
            activo: true,
            porPesoOVolumen: props.edit ? props.select.m_bPorPesoVolumen : true,
            porRangos: props.edit ? props.select.m_bPorRango : false,
            unidadPeso: props.edit ? props.select.m_sUnidadPeso : "Kg",
            factorConversion: props.edit ? props.select.m_nFactorConversion : 1,
            ivaTraslada: [],
            ivaRetiene: [],
            sucursal: props.edit ? props.select.m_nIdSucursal : "0",
            destino: props.edit ? props.select.m_sDestino : "0",
            precioFlete: props.edit ? props.select.m_cFleteMinimo : "",
            precioMinimo: props.edit ? props.select.m_cMontoMinimo : "",
            precioKilo: props.edit ? props.select.m_cPrecioKilo : "",
            precioM3: props.edit ? props.select.m_cPrecioM3 : ""
        }
        this.getAllSucursales = this.getAllSucursales.bind(this)
        this.handleChange = this.handleChange.bind(this)
        this.getAllCiudades = this.getAllCiudades.bind(this)
        this.handleTabChange = this.handleTabChange.bind(this)
        this.addConcepto = this.addConcepto.bind(this)
        this.removeConcepto = this.removeConcepto.bind(this)
        this.handleChangeChecboxTiposCobro = this.handleChangeChecboxTiposCobro.bind(this)
        this.handleChangeChecboxTiposServicio = this.handleChangeChecboxTiposServicio.bind(this)
        this.onSubmit = this.onSubmit.bind(this)
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
        this.getAllImpuestos()
    }

    getAllImpuestos() {
        const url = `${process.env.REACT_APP_API_URL}/Impuestos/GetListado`;
        axios.get(url, { headers }).then(respuesta => {
            console.log(respuesta.data)
            this.setState({ impuestos: respuesta.data })
        });
    };

    getAllSucursales() {
        const url = `${process.env.REACT_APP_API_URL}/Sucursales/GetListado`;
        axios.get(url, { headers }).then((respuesta) => {
            this.setState({ dataSucursal: respuesta.data });
        });
    }

    handleChange(event) {
        event.preventDefault()
        this.setState({
            [event.target.name]: event.target.value
        });
    }


    addConcepto(data) {
        console.log(data)
        const { conceptosAdicionales } = this.state
        var ivaTraslada = []
        var ivaRetiene = []
        conceptosAdicionales.push({ concepto: data.concepto, importe: data.importe, retiene: data.retiene, traslada: data.traslada, importeRet: data.importeRet, importeIVA: data.importeIVA, rangoMinimo: data.rangoMinimo, rangoMaximo: data.rangoMaximo, nombreConcepto: data.nombreConcepto, tipoCalculo: data.tipoCalculo, rangoMinimo: data.rangoMinimo, rangoMaximo: data.rangoMaximo })
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
        obtenerCiudades().then((respuesta) => {
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
            let arrayAll = Object.assign([], arrayTipos)
            this.setState({
                tiposCobroAll: !this.state.tiposCobroAll,
                tiposCobroSeleccionado: !this.state.tiposCobroAll ? arrayAll : []
            });
            return
        }
        if (event.target.checked) {
            array.push(arrayTipos[index])
            this.setState({
                tiposCobroSeleccionado: array
            });
        } else {
            array.splice(array.findIndex(a => a.m_nIdTipoCobro === arrayTipos[index].m_nIdTipoCobro), 1)
            this.setState({
                tiposCobroAll: false,
                tiposCobroSeleccionado: array
            });
        }

    }

    handleChangeChecboxTiposServicio(event, index, arrayTipos, all) {
        const array = this.state.tiposServicioSeleccionado

        if (all) {
            let arrayAll = Object.assign([], arrayTipos)
            this.setState({
                tiposServicioAll: !this.state.tiposServicioAll,
                tiposServicioSeleccionado: !this.state.tiposServicioAll ? arrayAll : []
            });
            return
        }
        if (event.target.checked) {
            array.push(arrayTipos[index])
            this.setState({
                tiposServicioSeleccionado: array
            });
        } else {
            var position = array.findIndex(a => a.m_nIdTipoServicio === arrayTipos[index].m_nIdTipoServicio)
            array.splice(position, 1)
            this.setState({
                tiposServicioAll: false,
                tiposServicioSeleccionado: array
            });
        }

    }

    onSubmit(event) {
        event.preventDefault()
        this.props.onSubmit(this.state)
    }

    render() {
        return (
            <form className="j-forms" onSubmit={this.onSubmit}>
                <div className="main-container" style={{ marginLeft: "0px", padding: "0px" }}>
                    <div className="row">
                        <div className="col-md-3 col-sm-12">
                            <div className="widget-wrap" style={{ margin: "0px", padding: "0px" }}>
                                <div className="widget-content">
                                    <div className="row">
                                        <div className="col-md-12 col-sm-12" style={{ padding: "5px" }}>
                                            <h4>Agregando Tarifas</h4>
                                        </div>
                                    </div>
                                    <div className="row">
                                        <div className="col-md-12 col-sm-12" style={{ padding: "5px" }}>
                                            <label className="input select" style={{ width: "100%" }}>
                                                <FormControl fullWidth variant="outlined" margin="dense">
                                                    <InputLabel id="sucursalLabel">Sucursal</InputLabel>
                                                    <Select
                                                        native
                                                        labelId="sucursalLabel"
                                                        label="Sucursal"
                                                        className="form-control"
                                                        required
                                                        onChange={this.handleChange}
                                                        value={this.state.sucursal}
                                                        disabled={this.props.consult}
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
                                        <div className="col-md-12 col-sm-12" style={{ padding: "5px" }}>
                                            <label className="input select" style={{ width: "100%" }}>
                                                <FormControl fullWidth variant="outlined" margin="dense">
                                                    <InputLabel id="destinoLabel">Destino</InputLabel>
                                                    <Select
                                                        native
                                                        className="form-control"
                                                        label="Destino"
                                                        labelId="destinoLabel"
                                                        className="form-control"
                                                        required
                                                        disabled={this.props.consult}
                                                        value={this.state.destino}
                                                        onChange={this.handleChange}
                                                        name="destino"
                                                    >
                                                        <option
                                                            key={"0"}
                                                            value={"0"}
                                                        >
                                                            Seleccionar
                                                        </option>
                                                        {this.state.ciudades.map((ciudad) => (
                                                            <option
                                                                key={ciudad.m_nIdCiudad}
                                                                value={ciudad.m_sCiudad}
                                                            >
                                                                {ciudad.m_sCiudad}
                                                            </option>
                                                        ))}
                                                    </Select>
                                                </FormControl>
                                            </label>
                                        </div>

                                        <div className="col-md-6 col-sm-6" style={{ padding: "5px" }}>
                                            <label className="checkbox">
                                                Peso o Volumen
                                                <input type="checkbox"
                                                    checked={this.state.porPesoOVolumen}
                                                    onChange={(e) => { this.setState({ porPesoOVolumen: !this.state.porPesoOVolumen, porRangos: !this.state.porRangos }) }}
                                                    name="porPesoOVolumen" />
                                                <i />
                                            </label>
                                        </div>

                                        <div className="col-md-6 col-sm-6" style={{ padding: "5px" }}>
                                            <label className="checkbox">
                                                Rangos
                                                <input type="checkbox"
                                                    checked={this.state.porRangos}
                                                    onChange={(e) => { this.setState({ porRangos: !this.state.porRangos, porPesoOVolumen: !this.state.porPesoOVolumen }) }}
                                                    name="porRangos" />
                                                <i />
                                            </label>
                                        </div>

                                        {this.state.porPesoOVolumen ?
                                            <div>

                                                <div className="col-md-12 col-sm-12" style={{ padding: "5px" }}>
                                                    <label className="input select" style={{ width: "100%" }}>
                                                        <FormControl fullWidth variant="outlined" margin="dense">
                                                            <InputLabel id="unidadPesoLabel">Unidad Peso</InputLabel>
                                                            <Select
                                                                native
                                                                className="form-control"
                                                                label="Unidad Peso"
                                                                labelId="unidadPesoLabel"
                                                                className="form-control"
                                                                required
                                                                disabled={this.props.consult}
                                                                value={this.state.unidadPeso}
                                                                onChange={this.handleChange}
                                                                name="unidadPeso"
                                                            >
                                                                <option
                                                                    key={"0"}
                                                                    value={"Kg"}
                                                                >
                                                                    Kilogramos
                                                                </option>
                                                                <option
                                                                    key={"1"}
                                                                    value={"Lb"}
                                                                >
                                                                    Libras
                                                                </option>
                                                                <option
                                                                    key={"2"}
                                                                    value={"Ton"}
                                                                >
                                                                    Toneladas
                                                                </option>

                                                            </Select>
                                                        </FormControl>
                                                    </label>
                                                </div>

                                                <div className="col-md-12 col-sm-12" style={{ padding: "5px" }}>

                                                    <div className="input">
                                                        <TextField variant="outlined" margin="dense"
                                                            onChange={this.handleChange}
                                                            className="form-control"
                                                            type="number"
                                                            label={<div>{this.state.unidadPeso}/Kg</div>}
                                                            required
                                                            step="2"
                                                            disabled={this.props.consult}
                                                            value={this.state.factorConversion}
                                                            name="factorConversion"
                                                        />
                                                    </div>
                                                </div>

                                                <div className="col-md-6 col-sm-6" style={{ padding: "5px" }}>

                                                    <div className="input">
                                                        <TextField variant="outlined" margin="dense"
                                                            onChange={this.handleChange}
                                                            className="form-control"
                                                            type="number"
                                                            label={<div>Precio m<sup>3</sup></div>}
                                                            step="1"
                                                            disabled={this.props.consult}
                                                            value={this.state.precioM3}
                                                            name="precioM3"
                                                        />
                                                    </div>
                                                </div>
                                                <div className="col-md-6 col-sm-6" style={{ padding: "5px" }}>

                                                    <div className="input">
                                                        <TextField variant="outlined" margin="dense"
                                                            onChange={this.handleChange}
                                                            className="form-control"
                                                            type="number"
                                                            label="Precio Kilo"
                                                            required={this.state.porPesoOVolumen}
                                                            step="2"
                                                            disabled={this.props.consult}
                                                            value={this.state.precioKilo}
                                                            name="precioKilo"
                                                        />
                                                    </div>
                                                </div>
                                                <div className="col-md-6 col-sm-6" style={{ padding: "5px" }}>

                                                    <div className="input">
                                                        <TextField variant="outlined" margin="dense"
                                                            onChange={this.handleChange}
                                                            className="form-control"
                                                            type="number"
                                                            required={this.state.porPesoOVolumen}
                                                            label="Flete Minimo"
                                                            step="1"
                                                            disabled={this.props.consult}
                                                            value={this.state.precioFlete}
                                                            name="precioFlete"
                                                        />
                                                    </div>
                                                </div>
                                                <div className="col-md-6 col-sm-6" style={{ padding: "5px" }}>

                                                    <div className="input">
                                                        <TextField variant="outlined" margin="dense"
                                                            onChange={this.handleChange}
                                                            className="form-control"
                                                            type="number"
                                                            label="Precio Minimo"
                                                            required={this.state.porPesoOVolumen}
                                                            disabled={this.props.consult}
                                                            step="2"
                                                            value={this.state.precioMinimo}
                                                            name="precioMinimo"
                                                        />
                                                    </div>
                                                </div>

                                                <div className="col-md-6 col-sm-6" style={{ padding: "5px" }}>
                                                    <label className="input select" style={{ width: "100%" }}>
                                                        <FormControl fullWidth variant="outlined" margin="dense">
                                                            <InputLabel id="trasladaLabel">Traslada</InputLabel>
                                                            <Select
                                                                labelId="trasladaLabel"
                                                                label="Traslada"
                                                                className="form-control"
                                                                value={this.state.traslada}
                                                                onChange={this.handleChange}
                                                                name="traslada"
                                                            >
                                                                <option
                                                                    key={0}
                                                                    value={""}
                                                                >
                                                                    Selecciona
                                                                </option>
                                                                {this.state.impuestos.filter(i => i.m_nTIpoImpuesto === 1).map((impuesto) => (
                                                                        <option
                                                                            key={impuesto.m_nIdImpuesto}
                                                                            value={impuesto.m_nIdImpuesto}
                                                                        >
                                                                            {impuesto.m_sImpuesto}
                                                                        </option>
                                                                    ))}
                                                            </Select>
                                                        </FormControl>
                                                    </label>
                                                </div>
                                                <div className="col-md-6 col-sm-6" style={{ padding: "5px" }}>
                                                    <label className="input select" style={{ width: "100%" }}>
                                                        <FormControl fullWidth variant="outlined" margin="dense">
                                                            <InputLabel id="retieneLabel">Retiene</InputLabel>
                                                            <Select
                                                                labelId="retieneLabel"
                                                                label="Retiene"
                                                                className="form-control"
                                                                onChange={this.handleChange}
                                                                name="retiene"
                                                                value={this.state.retiene}
                                                            >
                                                                <option
                                                                    key={0}
                                                                    value={""}
                                                                >
                                                                    Selecciona
                                                                </option>
                                                                {this.state.impuestos.filter(i => i.m_nTIpoImpuesto === 0).map((impuesto) => (
                                                                        <option
                                                                            key={impuesto.m_nIdImpuesto}
                                                                            value={impuesto.m_nIdImpuesto}
                                                                        >
                                                                            {impuesto.m_sImpuesto}
                                                                        </option>
                                                                    ))}
                                                            </Select>
                                                        </FormControl>
                                                    </label>
                                                </div>
                                            </div> : <div></div>
                                        }

                                        <div className="col-md-12 col-sm-12" style={{ padding: "5px", display: "inline-flex" }}>
                                            <div className="form-footer " className="col-md-12" style={{ padding: "10px" }}>
                                                <button
                                                    type="button"
                                                    className="btn btn-secondary secondary-btn"
                                                    onClick={this.props.onCancel}
                                                >
                                                    Cancelar
                                                </button>
                                                {!this.props.consult &&
                                                    <button
                                                        type="submit"

                                                        className="btn btn-primary primary-btn"
                                                    >
                                                        Aceptar
                                                    </button>
                                                }

                                            </div>
                                        </div>
                                    </div>

                                </div>
                            </div>
                        </div>
                        <div className="col-md-9 col-sm-12" >
                            <div className="widget-wrap" style={{ margin: "0px", padding: "0px" }}>
                                <div className="widget-content">

                                    {this.state.porRangos ?
                                        <div>
                                            <Tabs value={this.state.tab} onChange={this.handleTabChange} aria-label="simple tabs example" variant="scrollable" scrollButtons="auto">
                                                <Tab label="Concetos Adicionales por Destino" {...this.a11yProps(0)} className={{ backgroundColor: "white !important" }} />
                                                <Tab label="Maniobras" {...this.a11yProps(1)} disabled={!this.state.porRangos} />
                                                <Tab label="Entrega" {...this.a11yProps(2)} disabled={!this.state.porRangos} />
                                                <Tab label="Recolección" {...this.a11yProps(3)} disabled={!this.state.porRangos} />
                                                <Tab label="Condiciones de Precios por Tipo de Cobro" {...this.a11yProps(4)} />
                                                <Tab label="Condiciones de Precio por Tipo de Servicio" {...this.a11yProps(5)} />
                                            </Tabs>

                                            <TabPanel value={this.state.tab} index={0}>
                                                <ConceptosAdicionales consult={this.props.consult} edit={this.props.edit} select={this.props.select} conceptosAdicionales={this.state.conceptosAdicionales} addConcepto={this.addConcepto} removeConcepto={this.removeConcepto} ivaRetiene={this.state.ivaRetiene} ivaTraslada={this.state.ivaTraslada} mostrarRangos={true}>

                                                </ConceptosAdicionales>
                                            </TabPanel>
                                            <TabPanel value={this.state.tab} index={1}>
                                                <ConceptosAdicionalesManiobra consult={this.props.consult} edit={this.props.edit} select={this.props.select} conceptosAdicionales={this.state.conceptosAdicionales} addConcepto={this.addConcepto} removeConcepto={this.removeConcepto} ivaRetiene={this.state.ivaRetiene} ivaTraslada={this.state.ivaTraslada}>

                                                </ConceptosAdicionalesManiobra>
                                            </TabPanel>
                                            <TabPanel value={this.state.tab} index={2}>
                                                <ConceptosAdicionalesEntrega consult={this.props.consult} edit={this.props.edit} select={this.props.select} conceptosAdicionales={this.state.conceptosAdicionales} addConcepto={this.addConcepto} removeConcepto={this.removeConcepto} ivaRetiene={this.state.ivaRetiene} ivaTraslada={this.state.ivaTraslada}>

                                                </ConceptosAdicionalesEntrega>
                                            </TabPanel>
                                            <TabPanel value={this.state.tab} index={3}>
                                                <ConceptosAdicionalesRecoleccion consult={this.props.consult} edit={this.props.edit} select={this.props.select} conceptosAdicionales={this.state.conceptosAdicionales} addConcepto={this.addConcepto} removeConcepto={this.removeConcepto} ivaRetiene={this.state.ivaRetiene} ivaTraslada={this.state.ivaTraslada}>

                                                </ConceptosAdicionalesRecoleccion>
                                            </TabPanel>
                                            <TabPanel value={this.state.tab} index={4}>
                                                <TipoCobro consult={this.props.consult} tiposCobroSeleccionado={this.state.tiposCobroSeleccionado} handleChange={this.handleChangeChecboxTiposCobro} all={this.state.tiposCobroAll}>

                                                </TipoCobro>
                                            </TabPanel>
                                            <TabPanel value={this.state.tab} index={5}>
                                                <TipoServicio consult={this.props.consult} tiposServicioSeleccionado={this.state.tiposServicioSeleccionado} handleChange={this.handleChangeChecboxTiposServicio} all={this.state.tiposServicioAll}>

                                                </TipoServicio>
                                            </TabPanel>

                                        </div>
                                        :
                                        <div>
                                            <Tabs value={this.state.tab} onChange={this.handleTabChange} aria-label="simple tabs example" variant="scrollable" scrollButtons="auto">
                                                <Tab label="Concetos Adicionales por Destino" {...this.a11yProps(0)} className={{ backgroundColor: "white !important" }} />
                                                <Tab label="Condiciones de Precios por Tipo de Cobro" {...this.a11yProps(1)} />
                                                <Tab label="Condiciones de Precio por Tipo de Servicio" {...this.a11yProps(2)} />
                                            </Tabs>
                                            <TabPanel value={this.state.tab} index={0}>
                                                <ConceptosAdicionales consult={this.props.consult} edit={this.props.edit} select={this.props.select} conceptosAdicionales={this.state.conceptosAdicionales} addConcepto={this.addConcepto} removeConcepto={this.removeConcepto} ivaRetiene={this.state.ivaRetiene} ivaTraslada={this.state.ivaTraslada} mostrarRangos={false}>

                                                </ConceptosAdicionales>
                                            </TabPanel>
                                            <TabPanel value={this.state.tab} index={1}>
                                                <TipoCobro consult={this.props.consult} tiposCobroSeleccionado={this.state.tiposCobroSeleccionado} handleChange={this.handleChangeChecboxTiposCobro} all={this.state.tiposCobroAll}>

                                                </TipoCobro>
                                            </TabPanel>
                                            <TabPanel value={this.state.tab} index={2}>
                                                <TipoServicio consult={this.props.consult} tiposServicioSeleccionado={this.state.tiposServicioSeleccionado} handleChange={this.handleChangeChecboxTiposServicio} all={this.state.tiposServicioAll}>

                                                </TipoServicio>
                                            </TabPanel>
                                        </div>
                                    }
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