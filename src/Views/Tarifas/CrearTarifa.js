import React, {Component, useEffect, useState} from 'react';
import {
    Box,
    FormControl,
    InputLabel,
    Select,
    Tab,
    Tabs,
    TextField,
    DialogContent, Dialog, Grid, MenuItem, Paper
} from '@mui/material';
import ConceptosAdicionales from './ConceptosAdicionales';
import ConceptosAdicionalesManiobra from './ConceptosAdicionalesManiobra';
import ConceptosAdicionalesRecoleccion from './ConceptosAdicionalesRecoleccion';
import TipoCobro from './TipoCobro';
import TipoServicio from './TipoServicio';
import { getUniqueListBy } from '../../Util/Util';
import { obtenerCiudades } from '../../Util/Contexts/CiudadesContext';
import ProductosTarifa from "./ProductosTarifa";
import DestinosTarifa from "./DestinosTarifa";
import ProductosPrecios from "./ProductosPrecios";
import {obtenerProductos} from "../../Util/Contexts/ProductosContext";
import {obtenerImpuestos} from "../../Util/Contexts/ImpuestosContext";
import {API_HEADERS} from "../../Constants";
import ConceptosFacturacion from "./ConceptosFacturacion";
import {
    obtenerConceptosFacturacion,
    obtenerConceptosFacturacionManiobra
} from "../../Util/Contexts/ConceptosFacturacionContext";
import {obtenerSucursales} from "../../Util/Contexts/SucursalContext";
import {obtenerClientePublicoGeneral, obtenerClienteTieneConvenio} from "../../Util/Contexts/ClientesContext";
import Noty from "noty";
import DialogTableClientes from "../Clientes/DialogTableClientes";
import Button from "@mui/material/Button";

const headers = API_HEADERS

function a11yProps(index) {
    return {
        id: `simple-tab-${index}`,
        'aria-controls': `simple-tabpanel-${index}`,
    };
}

function showSuccess(mensaje) {
    new Noty({
        type: "information",
        layout: "topCenter",
        text: mensaje,
        timeout: "5000"
    }).show()
}

/**OBSOLETO DESDE MAYO 2022*/
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
            porPesoOVolumen: props.edit ? props.select.m_bPorPesoVolumen : false,
            porRangos: props.edit ? props.select.m_bPorRango : false,
            porRegion: props.edit ? props.select.m_bPorRegion : true,
            unidadPeso: props.edit ? props.select.m_sUnidadPeso : "Kg",
            factorConversion: props.edit ? props.select.m_nFactorConversion : 1,
            ivaTraslada: [],
            ivaRetiene: [],
            sucursal: props.edit ? props.select.m_nIdSucursal : "0",
            destino: props.edit && !props.select.m_bPorRegion ? props.select.m_arrArDestinos[0]?.m_nIdCiudad : "0",
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
            dataProductosSeleccionados: [],
            //Aqui se guardan todos los destinos que no estan seleccionados
            dataDestinosTemp: [],
            //Aqui pues el nombre de la variable ya es muy explicita
            dataDestinosSeleccionados: [],

            dataConceptos: [],
            dataConceptosBase: [],
            dataConceptosBaseManiobra: []
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
        this.handleChangeTipoTarifa = this.handleChangeTipoTarifa.bind(this)
        this.handleChangeListConceptos = this.handleChangeListConceptos.bind(this)
        this.getAllConceptos = this.getAllConceptos.bind(this)
        this.getAllConceptosManiobra = this.getAllConceptosManiobra.bind(this)
    }

    handleChangeListConceptos(data){
        /*const { conceptosEntrega, todosConceptos } = this.state
        const newArrayConceptos = conceptosEntrega.filter(c => this.filtrarConceptoAdicionalManiobraEmbarqueRecoleccion(c, item))
        let newArrayTodosConceptos = todosConceptos.filter(c => this.filtrarConceptoAdicionalManiobraEmbarqueRecoleccion(c, item))*/

        // this.setState({ conceptosEntrega: data })
        this.setState({dataConceptos: data})
    }

    castConceptos(){
        if (this.props.edit){
            const { todosConceptos, conceptosAdicionales, conceptosManiobra, conceptosEntrega, conceptosRecoleccion } = this.state
            const { select } = this.props
            select.m_arrArConceptos.forEach( element =>{
                let ivaTraslada = []
                let ivaRetiene = []
                const concept = {
                    id: Math.floor(Math.random() * 10000),
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
                if (element.m_nIdAgregadoDesde === 0){
                    conceptosAdicionales.push(concept)
                }else if (element.m_nIdAgregadoDesde === 1){
                    conceptosManiobra.push(concept)
                }else if (element.m_nIdAgregadoDesde === 2){
                    conceptosEntrega.push(concept)
                }else if (element.m_nIdAgregadoDesde === 3){
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
        this.getAllConceptos()
        this.getAllConceptosManiobra()
    }

    getAllConceptos() {
        obtenerConceptosFacturacion().then(respuesta => {this.setState({ dataConceptosBase: respuesta.data })});
    }

    getAllConceptosManiobra() {
        obtenerConceptosFacturacionManiobra().then(respuesta => {this.setState({ dataConceptosBaseManiobra: respuesta.data })});
    }

    getAllImpuestos() {
        obtenerImpuestos().then(respuesta => {
            this.setState({ impuestos: respuesta.data })
        });
    };

    getAllSucursales() {
        obtenerSucursales().then((respuesta) => {
            this.setState({ dataSucursal: respuesta.data });
        });
    }

    handleChange(event) {
        event.preventDefault()
        this.setState({
            [event.target.name]: event.target.value,
        });
        if (event.target.name === "destino"){
            let destino = []
            if (event.target.value !== 0){
                destino.push(this.state.ciudades.find((i) => i.m_nIdCiudad === event.target.value))
            }
            this.setState({
                dataDestinosSeleccionados: destino
            })
        }
        if (event.target.name === "sucursal"){
            if (event.target.name === 0 || this.state.destino === 0 || this.origen === 0){
                this.setState({disabled: true})
            }else{
                this.setState({disabled: false})
            }
        }else if (event.target.name === "destino"){
            if (event.target.name === 0 || this.state.sucursal === 0 || this.state.origen === 0){
                this.setState({disabled: true})
            }else{
                this.setState({disabled: false})
            }
        }else if (event.target.name === "origen"){
            if (event.target.name === 0 || this.state.sucursal === 0 || this.state.destino === 0){
                this.setState({disabled: true})
            }else{
                this.setState({disabled: false})
            }
        }
    }

    handleChangeTipoTarifa({target}){
        if (target.name === "porPesoOVolumen"){
            this.setState({
                porPesoOVolumen: !this.state.porPesoOVolumen,
                porRangos: !this.state.porPesoOVolumen && false,
                porRegion: !this.state.porPesoOVolumen && false,
                destino: 0,
                dataDestinosSeleccionados: []
            })
        }
        if (target.name === "porRangos"){
            this.setState({
                porPesoOVolumen: !this.state.porRangos && false,
                porRangos: !this.state.porRangos,
                porRegion: !this.state.porRangos && false,
                destino: 0,
                dataDestinosSeleccionados: []
            })
        }
        if (target.name === "porRegion"){
            this.setState({
                porPesoOVolumen: !this.state.porRegion && false,
                porRangos: !this.state.porRegion && false,
                porRegion: !this.state.porRegion,
                destino: 0,
                dataDestinosSeleccionados: []
            })
        }
    }

    //Metodo agregar para listado de conceptos entrega
    addConcepto(data) {
        const { conceptosRecoleccion, todosConceptos,conceptosAdicionales, conceptosManiobra, conceptosEntrega } = this.state
        let ivaTraslada = [];
        let ivaRetiene = [];
        const concept = {
            idConcepto : data.concepto.m_nIdConceptosFacturacion,
            id:data.id,
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
        if (data.agregadoDesde === 0){
            conceptosAdicionales.push(concept)
            this.setState({ conceptosAdicionales: conceptosAdicionales, todosConceptos: todosConceptos, ivaRetiene: ivaRetiene, ivaTraslada: ivaTraslada })
        }else if (data.agregadoDesde === 1){
            conceptosManiobra.push(concept)
            this.setState({ conceptosManiobra: conceptosManiobra, todosConceptos: todosConceptos, ivaRetiene: ivaRetiene, ivaTraslada: ivaTraslada })
        }else if (data.agregadoDesde === 2){
            conceptosEntrega.push(concept)
            this.setState({ conceptosEntrega: conceptosEntrega, todosConceptos: todosConceptos, ivaRetiene: ivaRetiene, ivaTraslada: ivaTraslada })
        }else if (data.agregadoDesde === 3){
            conceptosRecoleccion.push(concept)
            this.setState({ conceptosRecoleccion: conceptosRecoleccion, todosConceptos: todosConceptos, ivaRetiene: ivaRetiene, ivaTraslada: ivaTraslada })
        }
    }

    filtrarConceptoAdicional(c, item){
        let valid =  c.idConcepto === item.idConcepto
            && c.importe === item.importe
            && c.importeRet === item.importeRet
            && c.retiene === item.retiene
            && c.traslada === item.traslada
            && c.importeIVA === item.importeIVA
        return !valid
    }

    filtrarConceptoAdicionalManiobraEmbarqueRecoleccion(c, item){
        let valid =  c.idConcepto === item.idConcepto
            && c.importe === item.importe
            && c.importeRet === item.importeRet
            && c.retiene === item.retiene
            && c.traslada === item.traslada
            && c.importeIVA === item.importeIVA
            && c.rangoMinimo === item.rangoMinimo
            && c.rangoMaximo === item.rangoMaximo
            && c.tipoCalculo === item.tipoCalculo
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
            this.setState({
                ciudades: respuesta.data,
                dataDestinosTemp: respuesta.data,
            });
            if (this.props.edit) {
                const { select } = this.props
                this.state.dataDestinosTemp = respuesta.data
                select.m_arrArDestinos.forEach((p) => {
                    this.state.dataDestinosTemp = this.state.dataDestinosTemp.filter((f) => f.m_nIdCiudad !== p.m_nIdCiudad)
                })
                this.setState({
                    dataDestinosSeleccionados: select.m_arrArDestinos || [],
                    dataDestinosTemp: this.state.dataDestinosTemp
                })
            }
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
        obtenerProductos().then(respuesta => {
            this.setState({ dataProductos: respuesta.data, dataProductosTemp: respuesta.data, agregar: "Agregar" })
            if (this.props.edit) {
                const { select } = this.props
                this.state.dataProductosTemp = respuesta.data
                select.m_arrArProductos.forEach((p) => {
                    this.state.dataProductosTemp = this.state.dataProductosTemp.filter((f) => f.m_nIdProducto !== p.m_nIdProducto)
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

    actualizarDestinos = (todosDestinos, destinosSeleccionados) => {
        this.setState({
            dataDestinosTemp: todosDestinos,
            dataDestinosSeleccionados: destinosSeleccionados
        })
    }

    onSubmit(event) {
        event.preventDefault()
        this.props.onSubmit(this.state)
    }

    render() {
        const { disabled, conceptosAdicionales, conceptosManiobra, conceptosEntrega, conceptosRecoleccion,
            todosConceptos, dataProductosTemp,dataProductosSeleccionados,dataDestinosTemp,dataDestinosSeleccionados,
            porRegion, porPesoOVolumen } = this.state;
        let { consult, edit } = this.props

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
                                        {/*<div className="col-md-12 col-sm-12" style={{ padding: "5px" }}>
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
                                        </div>*/}
                                        <div className="col-md-12 col-sm-12" style={{ padding: "5px" }}>
                                            <label className="input select" style={{ width: "100%" }}>
                                                <FormControl fullWidth variant="outlined" margin="dense" required>
                                                    <InputLabel id="origenLabel">Origen (Bodega)</InputLabel>
                                                    <Select
                                                        native
                                                        className="form-control"
                                                        label="Origen (Bodega)"
                                                        disabled={this.props.consult}
                                                        labelId="origenLabel"
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
                                        {!porRegion &&
                                            <div className="col-md-12 col-sm-12" style={{ padding: "5px" }}>
                                                <label className="input select" style={{ width: "100%" }}>
                                                    <FormControl fullWidth variant="outlined" margin="dense" required={!porRegion}>
                                                        <InputLabel id="destinoLabel">Destino (Bodega)</InputLabel>
                                                        <Select
                                                            native
                                                            className="form-control"
                                                            label="Destino (Bodega)"
                                                            disabled={this.props.consult}
                                                            labelId="destinoLabel"
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
                                        }

                                        <div className="col-md-4 col-sm-4" style={{ padding: "5px" }}>
                                            <label className="checkbox">
                                                Peso o Volumen
                                                <input type="checkbox"
                                                        checked={this.state.porPesoOVolumen}
                                                        onChange={this.handleChangeTipoTarifa}
                                                        name="porPesoOVolumen"
                                                       disabled={this.props.consult  || this.props.select.m_bPorRegion}
                                                />
                                                <i />
                                            </label>
                                        </div>

                                        <div className="col-md-4 col-sm-4" style={{ padding: "5px" }}>
                                            <label className="checkbox">
                                                Rangos
                                                <input type="checkbox"
                                                    checked={this.state.porRangos}
                                                    onChange={this.handleChangeTipoTarifa}
                                                    name="porRangos"
                                                       disabled={this.props.consult || this.props.select.m_bPorRegion}
                                                />
                                                <i />
                                            </label>
                                        </div>

                                        <div className="col-md-4 col-sm-4" style={{ padding: "5px" }}>
                                            <label className="checkbox">
                                                Región
                                                <input type="checkbox"
                                                       checked={this.state.porRegion}
                                                       onChange={this.handleChangeTipoTarifa}
                                                       name="porRegion"
                                                       disabled={this.props.consult || this.props.select.m_bPorRegion}
                                                />
                                                <i />
                                            </label>
                                        </div>

                                        {porPesoOVolumen &&
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

                                            </div>
                                        }
                                        {(porPesoOVolumen || porRegion) &&
                                            <div>
                                                <div className="col-md-6 col-sm-6" style={{ padding: "5px" }}>
                                                    <div className="input">
                                                        <TextField variant="outlined" margin="dense"
                                                                   onChange={this.handleChange}
                                                                   className="form-control"
                                                                   type="number"
                                                                   required={porPesoOVolumen || porRegion}
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
                                                                   required={porPesoOVolumen || porRegion}
                                                                   disabled={this.props.consult}
                                                                   step="2"
                                                                   value={this.state.precioMinimo}
                                                                   name="precioMinimo"
                                                        />
                                                    </div>
                                                </div>
                                            </div>
                                        }
                                        {porPesoOVolumen &&
                                            <div>

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
                                                                <option key={0} value={""}>
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
                                            </div>
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
                                    {this.state.porRangos &&
                                        <div>
                                            <Tabs value={this.state.tab} onChange={this.handleTabChange} aria-label="simple tabs example" variant="scrollable" scrollButtons="auto">
                                                <Tab label="Conceptos Adicionales por Destino" {...this.a11yProps(0)} className={{ backgroundColor: "white !important" }} />
                                                <Tab label="Maniobras" {...this.a11yProps(1)} disabled={!this.state.porRangos} />
                                                <Tab label="Flete" {...this.a11yProps(2)} disabled={!this.state.porRangos} />
                                                {/*<Tab label="Recolección" {...this.a11yProps(3)} disabled={!this.state.porRangos} />*/}
                                                <Tab label="Productos" {...this.a11yProps(6)}/>
                                                <Tab label="Condiciones de Precios por Tipo de Cobro" {...this.a11yProps(4)} />
                                                <Tab label="Condiciones de Precio por Tipo de Servicio" {...this.a11yProps(5)} />

                                            </Tabs>

                                            <TabPanel value={this.state.tab} index={0}>
                                                {/*el filtrado por agregadoDesde está demas*/}
                                                {/*<ConceptosAdicionales consult={consult} edit={this.props.edit}
                                                                      select={this.props.select}
                                                                      conceptosAdicionales={conceptosAdicionales}
                                                                      addConcepto={this.addConcepto}
                                                                      removeConcepto={this.removeConceptoAdicional}
                                                                      ivaRetiene={this.state.ivaRetiene}
                                                                      ivaTraslada={this.state.ivaTraslada}
                                                                      mostrarRangos={false}>

                                                </ConceptosAdicionales>*/}
                                                <ConceptosFacturacion
                                                    consulta={consult}
                                                    dataList={conceptosAdicionales}
                                                    // onChangeList={this.handleChangeListConceptos}
                                                    mostrarRangos={false}
                                                    mostrarImpuestos={false}
                                                    mostrarDescuento={false}
                                                    mostrarTipoMedida={false}
                                                    mostrarTipoCalculo={false}
                                                    conceptosBase={this.state.dataConceptosBase}
                                                    keys={0}
                                                    agregarConcepto={this.addConcepto}
                                                    eliminarConcepto={this.removeConceptoAdicional}
                                                />
                                            </TabPanel>
                                            <TabPanel value={this.state.tab} index={1}>
                                                {/*el filtrado por agregadoDesde está demas*/}
                                                {/*<ConceptosAdicionalesManiobra consult={consult} edit={this.props.edit}
                                                                              select={this.props.select}
                                                                              conceptosAdicionales={conceptosManiobra}
                                                                              addConcepto={this.addConcepto}
                                                                              removeConcepto={this.removeConceptoManiobra}
                                                                              ivaRetiene={this.state.ivaRetiene}
                                                                              ivaTraslada={this.state.ivaTraslada}>

                                                </ConceptosAdicionalesManiobra>*/}
                                                <ConceptosFacturacion
                                                    consulta={consult}
                                                    dataList={conceptosManiobra}
                                                    // onChangeList={this.handleChangeListConceptos}
                                                    mostrarRangos={true}
                                                    mostrarImpuestos={false}
                                                    mostrarDescuento={false}
                                                    // mostrarConcepto={false}
                                                    conceptosBase={this.state.dataConceptosBaseManiobra}
                                                    keys={1}
                                                    agregarConcepto={this.addConcepto}
                                                    eliminarConcepto={this.removeConceptoManiobra}
                                                    // conceptoFijo={this.state.dataConceptosBase.find(i => i.m_nIdConceptosFacturacion === 1)}
                                                />
                                            </TabPanel>
                                            <TabPanel value={this.state.tab} index={2}>
                                                {/*el filtrado por agregadoDesde está demas*/}
                                                {/*<ConceptosAdicionalesEntrega consult={consult} edit={this.props.edit} select={this.props.select} conceptosAdicionales={conceptosEntrega} addConcepto={this.addConcepto} removeConcepto={this.removeConceptoEntrega} ivaRetiene={this.state.ivaRetiene} ivaTraslada={this.state.ivaTraslada}>*/}
                                                {/*</ConceptosAdicionalesEntrega>*/}
                                                <ConceptosFacturacion
                                                    consulta={consult}
                                                    dataList={conceptosEntrega}
                                                    mostrarRangos={true}
                                                    mostrarImpuestos={false}
                                                    mostrarDescuento={false}
                                                    mostrarConcepto={false}
                                                    keys={2}
                                                    agregarConcepto={this.addConcepto}
                                                    eliminarConcepto={this.removeConceptoEntrega}
                                                    conceptoFijo={this.state.dataConceptosBase.find(i => i.m_nIdConceptosFacturacion === 1)}
                                                />
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
                                                    consult={consult}
                                                />
                                            </TabPanel>
                                            <TabPanel value={this.state.tab} index={4}>
                                                <TipoCobro consult={consult}
                                                           tiposCobroSeleccionado={this.state.tiposCobroSeleccionado}
                                                           handleChange={this.handleChangeChecboxTiposCobro}
                                                           all={this.state.tiposCobroAll}/>
                                            </TabPanel>
                                            <TabPanel value={this.state.tab} index={5}>
                                                <TipoServicio consult={consult} tiposServicioSeleccionado={this.state.tiposServicioSeleccionado} handleChange={this.handleChangeChecboxTiposServicio} all={this.state.tiposServicioAll}>

                                                </TipoServicio>
                                            </TabPanel>
                                        </div>
                                    }
                                    {this.state.porPesoOVolumen &&
                                        <div>
                                            <Tabs value={this.state.tab} onChange={this.handleTabChange}
                                                  aria-label="simple tabs example" variant="scrollable"
                                                  scrollButtons="auto">
                                                <Tab label="Conceptos Adicionales por Destino" {...this.a11yProps(0)}
                                                     className={{backgroundColor: "white !important"}}/>
                                                <Tab
                                                    label="Condiciones de Precios por Tipo de Cobro" {...this.a11yProps(1)} />
                                                <Tab
                                                    label="Condiciones de Precio por Tipo de Servicio" {...this.a11yProps(2)} />
                                            </Tabs>
                                            <TabPanel value={this.state.tab} index={0}>
                                                <ConceptosAdicionales consult={consult} edit={this.props.edit}
                                                                      select={this.props.select}
                                                                      conceptosAdicionales={conceptosAdicionales}
                                                                      addConcepto={this.addConcepto}
                                                                      removeConcepto={this.removeConceptoAdicional}
                                                                      ivaRetiene={this.state.ivaRetiene}
                                                                      ivaTraslada={this.state.ivaTraslada}
                                                                      mostrarRangos={false}>

                                                </ConceptosAdicionales>
                                            </TabPanel>
                                            <TabPanel value={this.state.tab} index={1}>
                                                <TipoCobro consult={consult}
                                                           tiposCobroSeleccionado={this.state.tiposCobroSeleccionado}
                                                           handleChange={this.handleChangeChecboxTiposCobro}
                                                           all={this.state.tiposCobroAll}>

                                                </TipoCobro>
                                            </TabPanel>
                                            <TabPanel value={this.state.tab} index={2}>
                                                <TipoServicio consult={consult}
                                                              tiposServicioSeleccionado={this.state.tiposServicioSeleccionado}
                                                              handleChange={this.handleChangeChecboxTiposServicio}
                                                              all={this.state.tiposServicioAll}>

                                                </TipoServicio>
                                            </TabPanel>
                                        </div>
                                    }
                                    {this.state.porRegion &&
                                    <div>
                                        <Tabs value={this.state.tab} onChange={this.handleTabChange} aria-label="simple tabs example" variant="scrollable" scrollButtons="auto">
                                            <Tab label="Destinos" {...this.a11yProps(0)} className={{ backgroundColor: "white !important" }} />
                                            <Tab label="Productos" {...this.a11yProps(1)}/>
                                            <Tab label="Conceptos de Facturación" {...this.a11yProps(2)}/>

                                        </Tabs>

                                        <TabPanel value={this.state.tab} index={0}>
                                            {/*el filtrado por agregadoDesde está demas*/}
                                            <DestinosTarifa
                                                destinos={dataDestinosTemp}
                                                destinosSeleccionados={dataDestinosSeleccionados}
                                                actualizarDestinos={this.actualizarDestinos}
                                                consult={consult}
                                            />
                                        </TabPanel>
                                        <TabPanel value={this.state.tab} index={1}>
                                            <ProductosPrecios
                                                dataList={dataProductosSeleccionados}
                                                onChangeList={this.actualizarProductos}
                                                mostrarRangos={false}
                                                consult={consult}
                                                ivaRetiene={this.state.ivaRetiene}
                                                ivaTraslada={this.state.ivaTraslada}
                                                  />
                                        </TabPanel>
                                        <TabPanel value={this.state.tab} index={2}>
                                            <ConceptosAdicionales consult={consult} edit={this.props.edit}
                                                                  select={this.props.select}
                                                                  conceptosAdicionales={conceptosAdicionales}
                                                                  addConcepto={this.addConcepto}
                                                                  removeConcepto={this.removeConceptoAdicional}
                                                                  ivaRetiene={this.state.ivaRetiene}
                                                                  ivaTraslada={this.state.ivaTraslada}
                                                                  mostrarRangos={false}
                                                                  porRegion={true}
                                            />

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

function CrearTarifav2(props) {
    const [ciudades, setCiudadades] = useState([])
    const [state, setState] = useState({
        ciudades: [],
        showDialogClientes: false,
        origen: props.select?.m_nIdOrigen || null,
        codigoTarifa: props.select?.m_sCodigo || "",
        cliente: {
            m_nIdCliente : props.select?.m_nIdCliente,
            m_sNombreFiscal : props.select?.m_sCliente,
        },
        precioFlete: props.select?.m_cFleteMinimo || "0.00",

        //Aqui se guardan todos los productos y no se modifican
        dataProductos: [],
        //Aqui se guardan todos los productos que no estan seleccionados
        dataProductosTemp: [],
        //Aqui pues el nombre de la variable ya es muy explicita
        dataProductosSeleccionados: [],
        //Aqui se guardan todos los destinos que no estan seleccionados
        dataDestinosTemp: [],
        //Aqui pues el nombre de la variable ya es muy explicita
        dataDestinosSeleccionados: [],

        dataConceptos: [],
        dataConceptosBase: [],
        dataConceptosBaseManiobra: []
    })

    useEffect(() => {
        getAllCiudades()
        getAllProductos()
        getClienteGenerico()
    }, [])

    const getAllCiudades = () => {
        obtenerCiudades().then((respuesta) => {
            setState(state => {
                return {
                    ...state,
                    ciudades: respuesta.data,
                    dataDestinosTemp: respuesta.data,
                }
            });
            if (props.consult) {
                let dataDestinosTemp = respuesta.data
                props.select?.m_arrArDestinos?.forEach((p) => {
                    dataDestinosTemp = dataDestinosTemp.filter((f) => f.m_nIdCiudad !== p.m_nIdCiudad)
                })
                setState(state => {
                    return {
                        ...state,
                        dataDestinosSeleccionados: props.select?.m_arrArDestinos || [],
                        dataDestinosTemp: dataDestinosTemp
                    }
                })
            }
        });
    }

    const getAllProductos = () => {
        obtenerProductos().then(respuesta => {
            setState(state => {
                return {
                    ...state,
                    dataProductos: respuesta.data, dataProductosTemp: respuesta.data, agregar: "Agregar"
                }
            })
            if (props.consult) {
                let dataProductosTemp = respuesta.data
                props.select?.m_arrArProductos?.forEach((p) => {
                    dataProductosTemp = dataProductosTemp.filter((f) => f.m_nIdProducto !== p.m_nIdProducto)
                })
                setState(state => {
                    return {
                        ...state,
                        dataProductosSeleccionados: props.select?.m_arrArProductos,
                        dataProductosTemp: dataProductosTemp
                    }
                })
            }

        });
    }

    const getClienteGenerico = () => {
        obtenerClientePublicoGeneral().then(respuesta => {
            setState(state => {
                return {
                    ...state,
                    cliente: respuesta.data
                }
            })
        })
    }

    const handleChange = (event) => {
        event.preventDefault()
        setState({
            ...state,
            [event.target.name]: event.target.value
        });

    }

    const handlePatrocinadorSelected = (row) => {
        if (props.convenio){
            obtenerClienteTieneConvenio(row.m_nIdCliente,0).then(respuesta => {
                if (respuesta.data.value){
                    showSuccess("El cliente seleccionado ya tiene convenio activo.")
                }else{
                    setState(() => ({
                        ...state,
                        cliente: row,
                    }))
                }
            }).catch(e => {
                console.log(e)
                showSuccess("No fue posible validad si el cliente tiene convenio. Intente de nuevo.")
            })
        }
        setState(() => ({
            ...state,
            showDialogClientes: false,
        }))
    }

    const actualizarDestinos = (todosDestinos, destinosSeleccionados) => {
        setState({
            ...state,
            dataDestinosTemp: todosDestinos,
            dataDestinosSeleccionados: destinosSeleccionados
        })
    }

    const actualizarProductos = (todosProductos, productosSeleccionados) => {
        setState({
            ...state,
            dataProductosTemp: todosProductos,
            dataProductosSeleccionados: productosSeleccionados
        })
    }

    const handleDialogVisible = (isVisible) => {
        setState({
            ...state,
            showDialogClientes: isVisible,
        });
    };

    const onSubmit = (event) =>  {
        event.preventDefault()
        props.onSubmit(state)
    }

    const filtrarDestinos = (ciudades) => {
        return ciudades.filter(i  => i.m_nIdCiudad !== state.origen)
    }

    return(
        <div>
            <Dialog
                open={state.showDialogClientes}
                onClose={() => setState({...state, showDialogClientes: false})}
                fullWidth maxWidth="md"
            >
                <DialogContent>
                    <div className="row" style={{backgroundColor: '#FFFFFF'}}>
                        <DialogTableClientes dialogVisible={handleDialogVisible } handlePatrocinadorSelected={handlePatrocinadorSelected}/>
                    </div>
                </DialogContent>
            </Dialog>
            <form className="j-forms" onSubmit={onSubmit} onKeyDown={e => {
                if (e.code === 13){
                    e.preventDefault()
                }
            }}>
                <Paper style={{padding: '20px', marginBottom: '10px'}}>

                    <Grid container spacing={2}>
                        <Grid item xs={12}>
                            <h4>Agregando Tarifas</h4>
                        </Grid>
                        <Grid item xs={3}>
                            <TextField
                                variant="outlined"
                                label="Responsable de pago"
                                margin="dense"
                                required
                                value={state.cliente?.m_sNombreFiscal}
                                placeholder={"No. Cliente: Nombre fiscal"}
                                InputLabelProps={{shrink: true}}
                                onClick={(props.disabled || !props.convenio) ?
                                    () => {
                                        return
                                    } : (() => {
                                        setState({...state, showDialogClientes: true})
                                    })}
                                disabled={props.disabled || !props.convenio}
                            />
                        </Grid>
                        <Grid item xs={2}>
                            <TextField variant="outlined" margin="dense"
                                       onChange={handleChange}
                                       className="form-control"
                                       label={"Código"}
                                       required
                                       disabled={props.disabled}
                                       value={state.codigoTarifa}
                                       name="codigoTarifa"
                            />
                        </Grid>
                        <Grid item xs={2}>
                            <FormControl fullWidth variant="outlined" margin="dense" required>
                                <InputLabel id="origenLabel">Origen (Bodega)</InputLabel>
                                <Select
                                    className="form-control"
                                    label="Origen (Bodega)"
                                    disabled={props.disabled}
                                    labelId="origenLabel"
                                    value={state.origen}
                                    onChange={handleChange}
                                    name="origen"
                                >
                                    {state.ciudades.map((ciudad) => (
                                        <MenuItem
                                            key={ciudad.m_nIdCiudad}
                                            value={ciudad.m_nIdCiudad}
                                        >
                                            {ciudad.m_sCiudad}
                                        </MenuItem>
                                    ))}
                                </Select>
                            </FormControl>
                        </Grid>
                        <Grid item xs={2}>
                            <TextField variant="outlined" margin="dense"
                                       onChange={handleChange}
                                       className="form-control"
                                       type="number"
                                       label="Flete Minimo"
                                       step="1"
                                       disabled={props.disabled}
                                       value={state.precioFlete}
                                       name="precioFlete"
                            />
                        </Grid>

                    </Grid>
                    {/*<div className="widget-wrap" style={{ margin: "0px", padding: "20px" }}>
                        <div className="widget-content">

                            {this.state.porPesoOVolumen &&
                                <div>
                                    <Tabs value={this.state.tab} onChange={this.handleTabChange}
                                          aria-label="simple tabs example" variant="scrollable"
                                          scrollButtons="auto">
                                        <Tab label="Conceptos Adicionales por Destino" {...this.a11yProps(0)}
                                             className={{backgroundColor: "white !important"}}/>
                                        <Tab
                                            label="Condiciones de Precios por Tipo de Cobro" {...this.a11yProps(1)} />
                                        <Tab
                                            label="Condiciones de Precio por Tipo de Servicio" {...this.a11yProps(2)} />
                                    </Tabs>
                                    <TabPanel value={this.state.tab} index={0}>
                                        <ConceptosAdicionales consult={consult} edit={this.props.edit}
                                                              select={this.props.select}
                                                              conceptosAdicionales={conceptosAdicionales}
                                                              addConcepto={this.addConcepto}
                                                              removeConcepto={this.removeConceptoAdicional}
                                                              ivaRetiene={this.state.ivaRetiene}
                                                              ivaTraslada={this.state.ivaTraslada}
                                                              mostrarRangos={false}>

                                        </ConceptosAdicionales>
                                    </TabPanel>
                                    <TabPanel value={this.state.tab} index={1}>
                                        <TipoCobro consult={consult}
                                                   tiposCobroSeleccionado={this.state.tiposCobroSeleccionado}
                                                   handleChange={this.handleChangeChecboxTiposCobro}
                                                   all={this.state.tiposCobroAll}>

                                        </TipoCobro>
                                    </TabPanel>
                                    <TabPanel value={this.state.tab} index={2}>
                                        <TipoServicio consult={consult}
                                                      tiposServicioSeleccionado={this.state.tiposServicioSeleccionado}
                                                      handleChange={this.handleChangeChecboxTiposServicio}
                                                      all={this.state.tiposServicioAll}>

                                        </TipoServicio>
                                    </TabPanel>
                                </div>
                                }
                            {props.idTipoTarifa === 3 &&
                            <div>
                                <Tabs value={state.tab} onChange={handleTabChange} aria-label="simple tabs example" variant="scrollable" scrollButtons="auto">
                                    <Tab label="Destinos" {...a11yProps(0)} className={{ backgroundColor: "white !important" }} />
                                    <Tab label="Productos" {...a11yProps(1)}/>

                                </Tabs>

                                <TabPanel value={state.tab} index={0}>
                                    el filtrado por agregadoDesde está demas

                                </TabPanel>
                                <TabPanel value={state.tab} index={1}>
                                    <ProductosPrecios
                                        dataList={state.dataProductosSeleccionados}
                                        onChangeList={actualizarProductos}
                                        mostrarRangos={false}
                                        consult={props.consult}
                                        ivaRetiene={[]}
                                        ivaTraslada={[]}
                                    />
                                </TabPanel>

                            </div>
                            }
                        </div>
                    </div>*/}
                    <DestinosTarifa
                        destinos={filtrarDestinos(state.dataDestinosTemp)}
                        destinosSeleccionados={state.dataDestinosSeleccionados}
                        actualizarDestinos={actualizarDestinos}
                        disabled={props.disabled}
                    />

                    <div style={{marginTop:'20px', marginBottom: '20px'}}>
                        <ProductosPrecios
                            dataList={state.dataProductosSeleccionados}
                            onChangeList={actualizarProductos}
                            mostrarRangos={false}
                            consult={props.consult}
                            disabled={props.disabled}
                            ivaRetiene={[]}
                            ivaTraslada={[]}
                            mostrarTotal={false}
                        />
                    </div>

                    <Grid container item xs={12}>
                        {/*<Button
                            fullWidth
                            type="button"
                            className="btn btn-secondary secondary-btn"
                            onClick={props.onCancel}
                        >
                            Cancelar
                        </Button>*/}
                        <Button fullWidth type="submit" color={"primary"} variant={"contained"} disabled={props.disabled}>
                            Guardar Tarifa
                        </Button>
                    </Grid>
                </Paper>
            </form>
        </div>
    )

}

export default CrearTarifav2;

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