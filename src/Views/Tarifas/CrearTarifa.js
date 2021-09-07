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
import ProductosTarifa from "./ProductosTarifa";

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
            todosConceptos: props.edit ? props.select.m_arrArCobros : [],
            conceptosAdicionales: [],
            conceptosManiobra: [],
            conceptosEntrega: [],
            conceptosRecoleccion: [],
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
            destino: props.edit ? props.select.m_nIdDestino : "0",
            origen: props.edit ? props.select.m_nIdOrigen : "0",
            codigoTarifa: props.edit ? props.select.m_sCodigo: "",

            precioFlete: props.edit ? props.select.m_cFleteMinimo : "",
            precioMinimo: props.edit ? props.select.m_cMontoMinimo : "",
            precioKilo: props.edit ? props.select.m_cPrecioKilo : "",
            precioM3: props.edit ? props.select.m_cPrecioM3 : "",
            disabled: true,
            //Aqui se guardan todos los productos y no se modifican
            dataProductos: [],
            //Aqui se guardan todos los productos que no estan seleccionados
            dataProductosTemp: [],
            //Aqui pues el nombre de la variable ya es muy explicita
            dataProductosSeleccionados: []
        }
        this.getAllSucursales = this.getAllSucursales.bind(this)
        this.handleChange = this.handleChange.bind(this)
        this.getAllCiudades = this.getAllCiudades.bind(this)
        this.handleTabChange = this.handleTabChange.bind(this)
        this.addConcepto = this.addConcepto.bind(this)
        this.removeConceptoAdicional = this.removeConceptoAdicional.bind(this)
        this.removeConceptoManiobra = this.removeConceptoManiobra.bind(this)
        this.removeConceptoEntrega = this.removeConceptoEntrega.bind(this)
        this.removeConceptoRecoleccion = this.removeConceptoRecoleccion.bind(this)
        this.handleChangeChecboxTiposCobro = this.handleChangeChecboxTiposCobro.bind(this)
        this.handleChangeChecboxTiposServicio = this.handleChangeChecboxTiposServicio.bind(this)
        this.onSubmit = this.onSubmit.bind(this)
        this.castConceptos = this.castConceptos.bind(this)
        this.filtrarConceptoAdicional = this.filtrarConceptoAdicional.bind(this)
        this.getAllProductos = this.getAllProductos.bind(this)
    }

    castConceptos(){
        if (this.props.edit){
            const { todosConceptos, conceptosAdicionales, conceptosManiobra, conceptosEntrega, conceptosRecoleccion } = this.state
            const { select } = this.props
            console.log(select)
            select.m_arrArConceptos.forEach( element =>{
                let ivaTraslada = []
                let ivaRetiene = []
                const concept = {
                    idConcepto : element.m_nIdConceptosFacturacion,
                    importe: element.m_cImporte,
                    retiene: element.m_nIdImpuestoRetiene,
                    traslada: element.m_nIdImpuestoTraslada,
                    importeRet: element.m_cImporteRetiene,
                    importeIVA: element.m_cImporteIva,
                    rangoMinimo: element.m_xnRangoMinimo,
                    rangoMaximo: element.m_xnRangoMaximo,
                    nombreConcepto: element.m_sConcepto,
                    tipoCalculo: element.m_nIdTipoCalculo,
                    agregadoDesde: element.m_nIdAgregadoDesde,
                    tipoMedida: element.m_nIdTipoMedida
                }
                todosConceptos.push(concept)
                if (element.m_nIdAgregadoDesde == 0){
                    conceptosAdicionales.push(concept)
                }else if (element.m_nIdAgregadoDesde == 1){
                    conceptosManiobra.push(concept)
                }else if (element.m_nIdAgregadoDesde == 2){
                    conceptosEntrega.push(concept)
                }else if (element.m_nIdAgregadoDesde == 3){
                    conceptosRecoleccion.push(concept)
                }

                ivaTraslada = getUniqueListBy(todosConceptos, "traslada").map(i => i.traslada);
                ivaRetiene = getUniqueListBy(todosConceptos, "retiene").map(i => i.retiene);
                this.setState({ todosConceptos: todosConceptos, ivaRetiene: ivaRetiene, ivaTraslada: ivaTraslada })
            })
        }

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
        this.getAllProductos()
        this.getAllSucursales()
        this.getAllCiudades()
        this.getAllImpuestos()
        this.castConceptos()
    }

    getAllImpuestos() {
        const url = `${process.env.REACT_APP_API_URL}/Impuestos/GetListado`;
        axios.get(url, { headers }).then(respuesta => {
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
            [event.target.name]: event.target.value,
        });
        if (event.target.name == "sucursal"){
            if (event.target.name == 0 || this.state.destino == 0 || this.origen == 0){
                this.setState({disabled: true})
            }else{
                this.setState({disabled: false})
            }
        }else if (event.target.name == "destino"){
            if (event.target.name == 0 || this.state.sucursal == 0 || this.state.origen == 0){
                this.setState({disabled: true})
            }else{
                this.setState({disabled: false})
            }
        }else if (event.target.name == "origen"){
            if (event.target.name == 0 || this.state.sucursal == 0 || this.state.destino == 0){
                this.setState({disabled: true})
            }else{
                this.setState({disabled: false})
            }
        }

    }

    //Metodo agregar para listado de conceptos entrega
    addConcepto(data) {
        const { conceptosRecoleccion, todosConceptos,conceptosAdicionales, conceptosManiobra, conceptosEntrega } = this.state
        let ivaTraslada = [];
        let ivaRetiene = [];
        const concept = {
            idConcepto : data.concepto.m_nIdConceptosFacturacion,
            concepto: data.concepto,
            importe: data.importe,
            retiene: data.retiene,
            traslada: data.traslada,
            importeRet: data.importeRet,
            importeIVA: data.importeIVA,
            rangoMinimo: data.rangoMinimo,
            rangoMaximo: data.rangoMaximo,
            nombreConcepto: data.concepto.m_sConcepto,
            tipoCalculo: data.tipoCalculo,
            agregadoDesde: data.agregadoDesde,
            tipoMedida: data.tipoMedida
        }
        todosConceptos.push(concept)
        ivaTraslada = getUniqueListBy(todosConceptos, "traslada").map(i => i.traslada);
        ivaRetiene = getUniqueListBy(todosConceptos, "retiene").map(i => i.retiene);
        if (data.agregadoDesde == 0){
            conceptosAdicionales.push(concept)
            this.setState({ conceptosAdicionales: conceptosAdicionales, todosConceptos: todosConceptos, ivaRetiene: ivaRetiene, ivaTraslada: ivaTraslada })
        }else if (data.agregadoDesde == 1){
            conceptosManiobra.push(concept)
            this.setState({ conceptosManiobra: conceptosManiobra, todosConceptos: todosConceptos, ivaRetiene: ivaRetiene, ivaTraslada: ivaTraslada })
        }else if (data.agregadoDesde == 2){
            conceptosEntrega.push(concept)
            this.setState({ conceptosEntrega: conceptosEntrega, todosConceptos: todosConceptos, ivaRetiene: ivaRetiene, ivaTraslada: ivaTraslada })
        }else if (data.agregadoDesde == 3){
            conceptosRecoleccion.push(concept)
            this.setState({ conceptosRecoleccion: conceptosRecoleccion, todosConceptos: todosConceptos, ivaRetiene: ivaRetiene, ivaTraslada: ivaTraslada })
        }

    }

    filtrarConceptoAdicional(c, item){
        let valid =  c.idConcepto == item.idConcepto
            && c.importe == item.importe
            && c.importeRet == item.importeRet
            && c.retiene == item.retiene
            && c.traslada == item.traslada
            && c.importeIVA == item.importeIVA
        return !valid
    }

    filtrarConceptoAdicionalManiobraEmbarqueRecoleccion(c, item){
        let valid =  c.idConcepto == item.idConcepto
            && c.importe == item.importe
            && c.importeRet == item.importeRet
            && c.retiene == item.retiene
            && c.traslada == item.traslada
            && c.importeIVA == item.importeIVA
            && c.rangoMinimo == item.rangoMinimo
            && c.rangoMaximo == item.rangoMaximo
            && c.tipoCalculo == item.tipoCalculo
        return !valid
    }
    //Metodo remover para listado de conceptos adicionales
    removeConceptoAdicional(item) {
        const { conceptosAdicionales, todosConceptos } = this.state
        const newArrayConceptos = conceptosAdicionales.filter(c => this.filtrarConceptoAdicional(c, item))
        const newArrayTodosConceptos = todosConceptos.filter(c => this.filtrarConceptoAdicional(c, item))
        this.setState({ conceptosAdicionales: newArrayConceptos, todosConceptos: newArrayTodosConceptos })
    }
    //Metodo remover para listado de conceptos de maniobra
    removeConceptoManiobra(item) {
        const { conceptosManiobra, todosConceptos } = this.state
        const newArrayConceptos = conceptosManiobra.filter(c => this.filtrarConceptoAdicionalManiobraEmbarqueRecoleccion(c, item))
        const newArrayTodosConceptos = todosConceptos.filter(c => this.filtrarConceptoAdicionalManiobraEmbarqueRecoleccion(c, item))
        this.setState({ conceptosManiobra: newArrayConceptos, todosConceptos: newArrayTodosConceptos })
    }
    //Metodo remover para listado de conceptos entrega
    removeConceptoEntrega(item) {
        const { conceptosEntrega, todosConceptos } = this.state
        const newArrayConceptos = conceptosEntrega.filter(c => this.filtrarConceptoAdicionalManiobraEmbarqueRecoleccion(c, item))
        const newArrayTodosConceptos = todosConceptos.filter(c => this.filtrarConceptoAdicionalManiobraEmbarqueRecoleccion(c, item))
        this.setState({ conceptosEntrega: newArrayConceptos, todosConceptos: newArrayTodosConceptos })
    }
    //Metodo remover para listado de conceptos recoleccion
    removeConceptoRecoleccion(item) {
        const { conceptosRecoleccion, todosConceptos } = this.state
        const newArrayConceptos = conceptosRecoleccion.filter(c => this.filtrarConceptoAdicionalManiobraEmbarqueRecoleccion(c, item))
        const newArrayTodosConceptos = todosConceptos.filter(c => this.filtrarConceptoAdicionalManiobraEmbarqueRecoleccion(c, item))
        this.setState({ conceptosRecoleccion: newArrayConceptos, todosConceptos: newArrayTodosConceptos })
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

    getAllProductos(){
        const url = `${process.env.REACT_APP_API_URL}/Productos/GetListado`;
        axios.get(url, { headers }).then(respuesta => {
            this.setState({ dataProductos: respuesta.data, dataProductosTemp: respuesta.data, agregar: "Agregar" })
            if (this.props.edit) {
                const { select } = this.props
                this.state.dataProductosTemp = respuesta.data
                select.m_arrArProductos.forEach((p) => {
                    this.state.dataProductosTemp = this.state.dataProductosTemp.filter((f) => f.m_nIdProducto != p.m_nIdProducto)
                })
                this.setState({
                    dataProductosSeleccionados: select.m_arrArProductos,
                    dataProductosTemp: this.state.dataProductosTemp
                })
            }

        });
    }

    actualizarProductos = (todosProductos, productosSeleccionados) => {
        this.setState({
            dataProductosTemp: todosProductos,
            dataProductosSeleccionados: productosSeleccionados
        })
    }

    onSubmit(event) {
        event.preventDefault()
        this.props.onSubmit(this.state)
    }

    render() {
        const { disabled, conceptosAdicionales, conceptosManiobra, conceptosEntrega, conceptosRecoleccion, todosConceptos,
            dataProductosTemp,dataProductosSeleccionados} = this.state
        let { consult, edit } = this.props

        if (!consult && !edit){
            consult = disabled
        }
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

                                            <div className="input">
                                                <TextField variant="outlined" margin="dense"
                                                           onChange={this.handleChange}
                                                           className="form-control"
                                                           label={"Código"}
                                                           required
                                                           disabled={this.props.consult}

                                                           value={this.state.codigoTarifa}
                                                           name="codigoTarifa"
                                                />
                                            </div>
                                        </div>
                                        <div className="col-md-12 col-sm-12" style={{ padding: "5px" }}>
                                            <label className="input select" style={{ width: "100%" }}>
                                                <FormControl fullWidth variant="outlined" margin="dense">
                                                    <InputLabel id="sucursalLabel">Sucursal</InputLabel>
                                                    <Select
                                                        native
                                                        labelId="sucursalLabel"
                                                        label="Sucursal"
                                                        disabled={this.props.consult}
                                                        className="form-control"
                                                        required
                                                        onChange={this.handleChange}
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
                                        <div className="col-md-12 col-sm-12" style={{ padding: "5px" }}>
                                            <label className="input select" style={{ width: "100%" }}>
                                                <FormControl fullWidth variant="outlined" margin="dense">
                                                    <InputLabel id="origenLabel">Origen</InputLabel>
                                                    <Select
                                                        native
                                                        className="form-control"
                                                        label="Origen"
                                                        disabled={this.props.consult}
                                                        labelId="origenLabel"
                                                        className="form-control"
                                                        required

                                                        value={this.state.origen}
                                                        onChange={this.handleChange}
                                                        name="origen"
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
                                                                value={ciudad.m_nIdCiudad}
                                                            >
                                                                {ciudad.m_sCiudad}
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
                                                        disabled={this.props.consult}
                                                        labelId="destinoLabel"
                                                        className="form-control"
                                                        required

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
                                                                value={ciudad.m_nIdCiudad}
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
                                                        name="porPesoOVolumen"
                                                       disabled={this.props.consult}
                                                />
                                                <i />
                                            </label>
                                        </div>

                                        <div className="col-md-6 col-sm-6" style={{ padding: "5px" }}>
                                            <label className="checkbox">
                                                Rangos
                                                <input type="checkbox"
                                                    checked={this.state.porRangos}
                                                    onChange={(e) => { this.setState({ porRangos: !this.state.porRangos, porPesoOVolumen: !this.state.porPesoOVolumen }) }}
                                                    name="porRangos"
                                                       disabled={this.props.consult}
                                                />
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
                                                                disabled={this.props.consult}
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
                                                                disabled={this.props.consult}
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
                                                {!consult &&
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
                                                {/*<Tab label="Recolección" {...this.a11yProps(3)} disabled={!this.state.porRangos} />*/}
                                                <Tab label="Productos" {...this.a11yProps(6)}/>
                                                <Tab label="Condiciones de Precios por Tipo de Cobro" {...this.a11yProps(4)} />
                                                <Tab label="Condiciones de Precio por Tipo de Servicio" {...this.a11yProps(5)} />

                                            </Tabs>

                                            <TabPanel value={this.state.tab} index={0}>
                                                {/*el filtrado por agregadoDesde está demas*/}
                                                <ConceptosAdicionales consult={consult} edit={this.props.edit} select={this.props.select} conceptosAdicionales={conceptosAdicionales} addConcepto={this.addConcepto} removeConcepto={this.removeConceptoAdicional} ivaRetiene={this.state.ivaRetiene} ivaTraslada={this.state.ivaTraslada} mostrarRangos={false}>

                                                </ConceptosAdicionales>
                                            </TabPanel>
                                            <TabPanel value={this.state.tab} index={1}>
                                                {/*el filtrado por agregadoDesde está demas*/}
                                                <ConceptosAdicionalesManiobra consult={consult} edit={this.props.edit} select={this.props.select} conceptosAdicionales={conceptosManiobra} addConcepto={this.addConcepto} removeConcepto={this.removeConceptoManiobra} ivaRetiene={this.state.ivaRetiene} ivaTraslada={this.state.ivaTraslada}>

                                                </ConceptosAdicionalesManiobra>
                                            </TabPanel>
                                            <TabPanel value={this.state.tab} index={2}>
                                                {/*el filtrado por agregadoDesde está demas*/}
                                                <ConceptosAdicionalesEntrega consult={consult} edit={this.props.edit} select={this.props.select} conceptosAdicionales={conceptosEntrega} addConcepto={this.addConcepto} removeConcepto={this.removeConceptoEntrega} ivaRetiene={this.state.ivaRetiene} ivaTraslada={this.state.ivaTraslada}>

                                                </ConceptosAdicionalesEntrega>
                                            </TabPanel>
                                            {/*<TabPanel value={this.state.tab} index={3}>
                                                el filtrado por agregadoDesde está demas
                                                <ConceptosAdicionalesRecoleccion consult={consult} edit={this.props.edit} select={this.props.select} conceptosAdicionales={conceptosRecoleccion} addConcepto={this.addConcepto} removeConcepto={this.removeConceptoRecoleccion} ivaRetiene={this.state.ivaRetiene} ivaTraslada={this.state.ivaTraslada}>

                                                </ConceptosAdicionalesRecoleccion>
                                            </TabPanel>*/}
                                            <TabPanel value={this.state.tab} index={3}>
                                                <ProductosTarifa
                                                    productos={dataProductosTemp}
                                                    productosSeleccionados={dataProductosSeleccionados}
                                                    actualizarProductos={this.actualizarProductos}
                                                />

                                            </TabPanel>
                                            <TabPanel value={this.state.tab} index={4}>
                                                <TipoCobro consult={consult} tiposCobroSeleccionado={this.state.tiposCobroSeleccionado} handleChange={this.handleChangeChecboxTiposCobro} all={this.state.tiposCobroAll}>

                                                </TipoCobro>
                                            </TabPanel>
                                            <TabPanel value={this.state.tab} index={5}>
                                                <TipoServicio consult={consult} tiposServicioSeleccionado={this.state.tiposServicioSeleccionado} handleChange={this.handleChangeChecboxTiposServicio} all={this.state.tiposServicioAll}>

                                                </TipoServicio>
                                            </TabPanel>
                                        </div>
                                        :
                                        <div>
                                            <Tabs value={this.state.tab} onChange={this.handleTabChange} aria-label="simple tabs example" variant="scrollable" scrollButtons="auto">
                                                <Tab label="Conceptos Adicionales por Destino" {...this.a11yProps(0)} className={{ backgroundColor: "white !important" }} />
                                                <Tab label="Condiciones de Precios por Tipo de Cobro" {...this.a11yProps(1)} />
                                                <Tab label="Condiciones de Precio por Tipo de Servicio" {...this.a11yProps(2)} />
                                            </Tabs>
                                            <TabPanel value={this.state.tab} index={0}>
                                                <ConceptosAdicionales consult={consult} edit={this.props.edit} select={this.props.select} conceptosAdicionales={conceptosAdicionales} addConcepto={this.addConcepto} removeConcepto={this.removeConceptoAdicional} ivaRetiene={this.state.ivaRetiene} ivaTraslada={this.state.ivaTraslada} mostrarRangos={false}>

                                                </ConceptosAdicionales>
                                            </TabPanel>
                                            <TabPanel value={this.state.tab} index={1}>
                                                <TipoCobro consult={consult} tiposCobroSeleccionado={this.state.tiposCobroSeleccionado} handleChange={this.handleChangeChecboxTiposCobro} all={this.state.tiposCobroAll}>

                                                </TipoCobro>
                                            </TabPanel>
                                            <TabPanel value={this.state.tab} index={2}>
                                                <TipoServicio consult={consult} tiposServicioSeleccionado={this.state.tiposServicioSeleccionado} handleChange={this.handleChangeChecboxTiposServicio} all={this.state.tiposServicioAll}>

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