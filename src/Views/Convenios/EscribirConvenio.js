import React, { Component } from 'react';
import PropTypes from 'prop-types';
import axios from "axios";
import {
    AppBar,
    Box,
    FormControl,
    InputLabel,
    Select,
    Tab,
    Tabs,
    TextField,
    Typography,
    Checkbox,
    Dialog, DialogTitle, DialogContent, Button, DialogActions, Tooltip
} from '@material-ui/core';

import SvgIcon from "@material-ui/core/SvgIcon";
import { getUniqueListBy } from '../../Util/Util';
import { PowerInputSharp } from '@material-ui/icons';
import { obtenerCiudades } from '../../Util/Contexts/CiudadesContext';
import ConceptosAdicionales from "../Tarifas/ConceptosAdicionales";
import ConceptosAdicionalesManiobra from "../Tarifas/ConceptosAdicionalesManiobra";
import ConceptosAdicionalesEntrega from "../Tarifas/ConceptosAdicionalesEntrega";
import ConceptosAdicionalesRecoleccion from "../Tarifas/ConceptosAdicionalesRecoleccion";
import {dataGridLocaleText} from "../../Constants";
import {DataGrid} from "@material-ui/data-grid";
import {ReactComponent as Activo} from "../../iconos/Menu/palomita.svg";
import {ReactComponent as NoActivo} from "../../iconos/Menu/cruz.svg";

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
class EscribirConvenio extends Component {
    constructor(props) {
        super(props);
        this.state = {
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
            precioFlete: props.edit ? props.select.m_cFleteMinimo : "",
            precioMinimo: props.edit ? props.select.m_cMontoMinimo : "",
            precioKilo: props.edit ? props.select.m_cPrecioKilo : "",
            precioM3: props.edit ? props.select.m_cPrecioM3 : "",
            disabled: true,
            cliente: props.edit ? props.select.m_nIdCliente : "0",
            dataClientes: [],
            openDialog: false,
            dataTarifas: [],
            columnsTarifas: [
                {
                    headerName: "Sucursal Origen",
                    field: "m_sSucursal",
                    width: 300,
                }, {
                    headerName: "Destino",
                    field: "m_sDestino",
                    width: 300,
                }, {
                    headerName: "Precio m³",
                    field: "m_cPrecioM3",
                    valueFormatter: (params) => `$${parseFloat(params.value).toFixed(2)}`,
                    width: 200,
                }, {
                    headerName: "Precio Kilo",
                    field: "m_cPrecioKilo",
                    valueFormatter: (params) => `$${parseFloat(params.value).toFixed(2)}`,
                    width: 125,
                },
                {
                    headerName: "Flete mínimo",
                    field: "m_cFleteMinimo",
                    valueFormatter: (params) => `$${parseFloat(params.value).toFixed(2)}`,
                    width: 125,
                },
                {
                    headerName: "Monto mínimo",
                    field: "m_cMontoMinimo",
                    valueFormatter: (params) => `$${parseFloat(params.value).toFixed(2)}`,
                    width: 125,
                },
                {
                    headerName: "Activo",
                    field: "m_bActivo",
                    width: 200,
                    renderCell: (row) => {
                        return (
                            <div
                                style={{
                                    width: "100%",
                                    textAlign: "center",
                                    color: row.row.m_bActivo == 'true' ? "green" : "red",
                                }}
                            >
                                {row.row.m_bActivo ? (
                                    <SvgIcon component={Activo} />
                                ) : (
                                    <SvgIcon component={NoActivo} />
                                )}
                            </div>
                        );
                    },
                },
            ],
            idsTarifasSeleccionadas : [],
            tarifasSeleccionadas : [],
            height: window.innerHeight,
            columnsTarifasOverview: [
                {
                    headerName: "Sucursal Origen",
                    field: "m_sSucursal",
                    width: 150,
                },
                {
                    headerName: "Destino",
                    field: "m_sDestino",
                    width: 150,
                },
                {
                    headerName: "Activo",
                    field: "m_bActivo",
                    width: 100,
                    renderCell: (row) => {
                        return (
                            <div
                                style={{
                                    width: "100%",
                                    textAlign: "center",
                                    color: row.row.m_bActivo == 'true' ? "green" : "red",
                                }}
                            >
                                {row.row.m_bActivo ? (
                                    <SvgIcon component={Activo} />
                                ) : (
                                    <SvgIcon component={NoActivo} />
                                )}
                            </div>
                        );
                    },
                },
            ],
            tarifaDetalles: {m_arrArConceptos:[]}
        }
        this.handleChange = this.handleChange.bind(this)
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
        this.getAllClientes = this.getAllClientes.bind(this)
        this.handleShowDialog = this.handleShowDialog.bind(this)
        this.getAllTarifas = this.getAllTarifas.bind(this)
        this.onSubmit = this.onSubmit.bind(this)
    }

    castConceptos(){
        /*if (this.props.edit){
            const { todosConceptos, conceptosAdicionales, conceptosManiobra, conceptosEntrega, conceptosRecoleccion, tarifaDetalles } = this.state
            tarifaDetalles.m_arrArConceptos.forEach( element =>{
                var ivaTraslada = []
                var ivaRetiene = []

                todosConceptos.push({
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
                    agregadoDesde: element.m_nIdAgregadoDesde
                })
                if (element.m_nIdAgregadoDesde == 0){
                    conceptosAdicionales.push({
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
                        agregadoDesde: element.m_nIdAgregadoDesde
                    })
                }else if (element.m_nIdAgregadoDesde == 1){
                    conceptosManiobra.push({
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
                        agregadoDesde: element.m_nIdAgregadoDesde
                    })
                }else if (element.m_nIdAgregadoDesde == 2){
                    conceptosEntrega.push({
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
                        agregadoDesde: element.m_nIdAgregadoDesde
                    })
                }else if (element.m_nIdAgregadoDesde == 3){
                    conceptosRecoleccion.push({
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
                        agregadoDesde: element.m_nIdAgregadoDesde
                    })
                }

                ivaTraslada = getUniqueListBy(todosConceptos, "traslada").map(i => i.traslada);
                ivaRetiene = getUniqueListBy(todosConceptos, "retiene").map(i => i.retiene);
                this.setState({ todosConceptos: todosConceptos, ivaRetiene: ivaRetiene, ivaTraslada: ivaTraslada })
            })
        }*/

        let { todosConceptos, conceptosAdicionales, conceptosManiobra, conceptosEntrega, conceptosRecoleccion, tarifaDetalles } = this.state
        todosConceptos.length = 0
        conceptosAdicionales.length = 0
        conceptosManiobra.length = 0
        conceptosEntrega.length = 0
        conceptosRecoleccion.length = 0
        tarifaDetalles.m_arrArConceptos.forEach( element =>{
            let ivaTraslada = []
            let ivaRetiene = []
            todosConceptos.push({
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
                agregadoDesde: element.m_nIdAgregadoDesde
            })
            if (element.m_nIdAgregadoDesde == 0){
                conceptosAdicionales.push({
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
                    agregadoDesde: element.m_nIdAgregadoDesde
                })
            }else if (element.m_nIdAgregadoDesde == 1){
                conceptosManiobra.push({
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
                    agregadoDesde: element.m_nIdAgregadoDesde
                })
            }else if (element.m_nIdAgregadoDesde == 2){
                conceptosEntrega.push({
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
                    agregadoDesde: element.m_nIdAgregadoDesde
                })
            }else if (element.m_nIdAgregadoDesde == 3){
                conceptosRecoleccion.push({
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
                    agregadoDesde: element.m_nIdAgregadoDesde
                })
            }

            ivaTraslada = getUniqueListBy(todosConceptos, "traslada").map(i => i.traslada);
            ivaRetiene = getUniqueListBy(todosConceptos, "retiene").map(i => i.retiene);
            this.setState({ todosConceptos: todosConceptos, ivaRetiene: ivaRetiene, ivaTraslada: ivaTraslada })
        })

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
        this.getAllImpuestos()
        this.castConceptos()
        this.getAllClientes()
        this.getAllTarifas()
    }

    getAllImpuestos() {
        const url = `${process.env.REACT_APP_API_URL}/Impuestos/GetListado`;
        axios.get(url, { headers }).then(respuesta => {
            this.setState({ impuestos: respuesta.data })
        });
    };

    /*getAllSucursales() {
        const url = `${process.env.REACT_APP_API_URL}/Sucursales/GetListado`;
        axios.get(url, { headers }).then((respuesta) => {
            this.setState({ dataSucursal: respuesta.data });
        });
    }*/

    getAllClientes() {
        const url = `${process.env.REACT_APP_API_URL}/Clientes/GetListado`;
        axios.get(url, { headers }).then((respuesta) => {
            this.setState({ dataClientes: respuesta.data });
        });
    }

    handleChange(event) {
        event.preventDefault()
        this.setState({
            [event.target.name]: event.target.value,
        });

    }

    //Metodo agregar para listado de conceptos entrega
    addConcepto(data) {
        const { conceptosRecoleccion, todosConceptos,conceptosAdicionales, conceptosManiobra, conceptosEntrega } = this.state
        let ivaTraslada = [];
        let ivaRetiene = [];
        todosConceptos.push({
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
            agregadoDesde: data.agregadoDesde
        })
        ivaTraslada = getUniqueListBy(todosConceptos, "traslada").map(i => i.traslada);
        ivaRetiene = getUniqueListBy(todosConceptos, "retiene").map(i => i.retiene);
        if (data.agregadoDesde == 0){
            conceptosAdicionales.push({
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
                agregadoDesde: data.agregadoDesde
            })
            this.setState({ conceptosAdicionales: conceptosAdicionales, todosConceptos: todosConceptos, ivaRetiene: ivaRetiene, ivaTraslada: ivaTraslada })
        }else if (data.agregadoDesde == 1){
            conceptosManiobra.push({
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
                agregadoDesde: data.agregadoDesde
            })
            this.setState({ conceptosManiobra: conceptosManiobra, todosConceptos: todosConceptos, ivaRetiene: ivaRetiene, ivaTraslada: ivaTraslada })
        }else if (data.agregadoDesde == 2){
            conceptosEntrega.push({
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
                agregadoDesde: data.agregadoDesde
            })
            this.setState({ conceptosEntrega: conceptosEntrega, todosConceptos: todosConceptos, ivaRetiene: ivaRetiene, ivaTraslada: ivaTraslada })
        }else if (data.agregadoDesde == 3){
            conceptosRecoleccion.push({
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
                agregadoDesde: data.agregadoDesde
            })
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

    /*getAllCiudades() {
        obtenerCiudades().then((respuesta) => {
            this.setState({ ciudades: respuesta.data });
        });
    }*/

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

    /*onSubmit(event) {
        event.preventDefault()
        this.props.onSubmit(this.state)
    }*/

    handleShowDialog = (event) => {
        event.preventDefault()
        this.setState({
            openDialog: !this.state.openDialog
        })
    };

    handleConfirmTarifas = (event) => {
        event.preventDefault()
        const tarifas = []
        this.state.idsTarifasSeleccionadas.forEach((idTarifa) => {
            tarifas.push(this.state.dataTarifas.find((t) => t.m_nIdTarifa == idTarifa))
        })
        this.setState({
            openDialog: !this.state.openDialog,
            tarifasSeleccionadas: tarifas
        })

    };

    getAllTarifas() {
        const url = `${process.env.REACT_APP_API_URL}/Tarifas/GetListado`;
        axios.get(url, { headers }).then(respuesta => {
            this.setState({ dataTarifas: respuesta.data, agregar: "Agregar" })
        });
    }
    //Funcion para reaccionar al seleccionar una tarifa del LISTADO DE DIALOGO
    handleTarifasSeleccionadas = (e) => {
        this.setState({
            idsTarifasSeleccionadas: e.selectionModel,
        })
    }

    //Funcion para reaccionar al seleccionar una tarifa del LISTADO INFERIOR
    handleTarifaSeleccionada = (row) => {
        this.setState({
            tarifaDetalles: row.data
        }, () => {
            this.castConceptos()
        })
    }

    handleGuardarTarifa = (e) => {
        e.preventDefault()
        this.state.tarifasSeleccionadas.forEach((t) => {
            if (t.m_nIdTarifa == this.state.tarifaDetalles.id){
                t.m_arrArConceptos.length = 0
                this.state.todosConceptos.forEach((c) => {
                    t.m_arrArConceptos.push({
                        m_nIdConceptosFacturacion: c.idConcepto,
                        m_cImporte: c.importe,
                        m_nIdImpuestoTraslada: c.traslada,
                        m_nIdImpuestoRetiene: c.retiene,
                        m_cImporteRetiene: c.importeRet,
                        m_cImporteIva: c.importeIVA,
                        m_nIdTipoCalculo: c.tipoCalculo,
                        m_xnRangoMinimo: c.rangoMinimo,
                        m_xnRangoMaximo: c.rangoMaximo,
                        m_nIdAgregadoDesde: c.agregadoDesde,
                        m_sConcepto: c.nombreConcepto,
                    })
                })
            }
        })
        this.setState({
            tarifasSeleccionadas: this.state.tarifasSeleccionadas
        })
        console.log(this.state.tarifasSeleccionadas)
    }

    onSubmit = (e) => {
        e.preventDefault()
        console.log(this.state.tarifasSeleccionadas)
        console.log('Mandar tarifas ', this.state.tarifasSeleccionadas)

        let params = {
            m_nIdCliente: this.state.cliente,
            m_arrTarifas: this.state.tarifasSeleccionadas
        }
        console.log('agregar: ', params)
    }

    render() {
        const { disabled, conceptosAdicionales, conceptosManiobra, conceptosEntrega, conceptosRecoleccion, openDialog, columnsTarifas, dataTarifas, height,
            tarifasSeleccionadas,columnsTarifasOverview, tarifaDetalles} = this.state
        let { consult, edit } = this.props

        if (!consult && !edit){
            consult = disabled
        }
        return (
            <div>
                <Dialog
                    fullWidth={true}
                    maxWidth={'xl'}
                    open={openDialog}
                    onClose={this.handleShowDialog}
                    aria-labelledby="max-width-dialog-title"
                >
                    <DialogContent>
                        <div style={{ display: 'flex', height: '800px' }}>
                            <DataGrid
                                localeText={dataGridLocaleText}
                                rows={dataTarifas}
                                columns={columnsTarifas}
                                density="compact"
                                pageSize={Math.floor((height - 310) / 30)}
                                getRowId={(row) => row.m_nIdTarifa}
                                checkboxSelection
                                onSelectionModelChange={(e) => this.handleTarifasSeleccionadas(e)}
                            />
                        </div>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={this.handleShowDialog} color="primary">
                            Close
                        </Button>
                        <Button onClick={this.handleConfirmTarifas} color="primary" autoFocus>
                            Aceptar
                        </Button>

                    </DialogActions>
                </Dialog>

                <form className="j-forms" onSubmit={this.onSubmit}>
                    <div className="main-container" style={{ marginLeft: "0px", padding: "0px" }}>
                        <div className="row">
                            <div className="col-md-3 col-sm-12">
                                <div className="widget-wrap">
                                    <div className="widget-content">
                                        <div className="row">
                                            <div className="col-md-12 col-sm-12" style={{ padding: "5px" }}>
                                                <label className="input select" style={{ width: "100%" }}>
                                                    <FormControl fullWidth variant="outlined" margin="dense">
                                                        <InputLabel id="clienteLabel">Cliente</InputLabel>
                                                        <Select
                                                            native
                                                            labelId="clienteLabel"
                                                            label="Cliente"
                                                            disabled={this.props.consult}
                                                            className="form-control"
                                                            required
                                                            onChange={this.handleChange}
                                                            value={this.state.cliente}
                                                            name="cliente"
                                                            id="cliente"
                                                        >
                                                            <option
                                                                key={"0"}
                                                                value={"0"}>
                                                                Seleccionar
                                                            </option>
                                                            {this.state.dataClientes.map((cliente) => (
                                                                <option
                                                                    key={cliente.m_nIdCliente}
                                                                    value={cliente.m_nIdCliente}
                                                                >
                                                                    {cliente.m_sNombreCorto}
                                                                </option>
                                                            ))}
                                                        </Select>
                                                    </FormControl>
                                                </label>
                                            </div>

                                            <div className="col-md-12 col-sm-12" style={{ padding: "5px", display: "inline-flex" }}>
                                                <div className="form-footer " className="col-md-12" style={{ padding: "10px" }}>
                                                    <button className="btn btn-primary primary-btn"
                                                    onClick={this.handleShowDialog}>
                                                        Seleccionar tarifas
                                                    </button>

                                                    <button type="submit" className="btn btn-primary primary-btn">
                                                        Guardar convenio
                                                    </button>
                                                </div>
                                            </div>
                                        </div>

                                    </div>
                                </div>
                                <div className="widget-wrap">
                                    <div className="widget-content">
                                        <div className="row">
                                            <div className="col-md-12 col-sm-12" style={{ padding: "5px" }}>
                                                <div style={{ display: 'flex', height: '600px' }}>
                                                    <DataGrid
                                                        localeText={dataGridLocaleText}
                                                        rows={tarifasSeleccionadas}
                                                        columns={columnsTarifasOverview}
                                                        density="compact"
                                                        pageSize={Math.floor((height - 310) / 30)}
                                                        getRowId={(row) => row.m_nIdTarifa}
                                                        onRowSelected={(row) => this.handleTarifaSeleccionada(row)}
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="col-md-9 col-sm-12" >
                                <div className="widget-wrap" style={{ margin: "0px", padding: "0px" }}>
                                    <div className="widget-content">
                                        <button className="btn btn-primary primary-btn" onClick={this.handleGuardarTarifa}>
                                            Guardar tarifa
                                        </button>
                                        <div>
                                            <Tabs value={this.state.tab} onChange={this.handleTabChange} aria-label="simple tabs example" variant="scrollable" scrollButtons="auto">
                                                <Tab label="Concetos Adicionales por Destino" {...this.a11yProps(0)} className={{ backgroundColor: "white !important" }} />
                                                <Tab label="Maniobras" {...this.a11yProps(1)} />
                                                <Tab label="Entrega" {...this.a11yProps(2)} />
                                                <Tab label="Recolección" {...this.a11yProps(3)}/>
                                            </Tabs>

                                            <TabPanel value={this.state.tab} index={0}>
                                                {/*el filtrado por agregadoDesde está demas*/}
                                                <ConceptosAdicionales consult={false} edit={true}
                                                                      select={tarifaDetalles}
                                                                      conceptosAdicionales={conceptosAdicionales}
                                                                      addConcepto={this.addConcepto}
                                                                      removeConcepto={this.removeConceptoAdicional}
                                                                      ivaRetiene={this.state.ivaRetiene}
                                                                      ivaTraslada={this.state.ivaTraslada}
                                                                      mostrarRangos={true}/>
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
                                            <TabPanel value={this.state.tab} index={3}>
                                                {/*el filtrado por agregadoDesde está demas*/}
                                                <ConceptosAdicionalesRecoleccion consult={consult} edit={this.props.edit} select={this.props.select} conceptosAdicionales={conceptosRecoleccion} addConcepto={this.addConcepto} removeConcepto={this.removeConceptoRecoleccion} ivaRetiene={this.state.ivaRetiene} ivaTraslada={this.state.ivaTraslada}>

                                                </ConceptosAdicionalesRecoleccion>
                                            </TabPanel>

                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </form>
            </div>
        );
    }
}

EscribirConvenio.propTypes = {

};

export default EscribirConvenio;

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