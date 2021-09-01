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
    Dialog,
    DialogTitle,
    DialogContent,
    Button,
    DialogActions,
    Tooltip,
    Card,
    CardContent,
    CardActions,
    CardHeader,
    IconButton, Grid, CardActionArea, Menu, MenuItem
} from '@material-ui/core';
import MoreVertIcon from '@material-ui/icons/MoreVert';
import SvgIcon from "@material-ui/core/SvgIcon";
import { getUniqueListBy } from '../../Util/Util';
import { PowerInputSharp } from '@material-ui/icons';
import { obtenerCiudades } from '../../Util/Contexts/CiudadesContext';
import ConceptosAdicionales from "../Tarifas/ConceptosAdicionales";
import ConceptosAdicionalesManiobra from "../Tarifas/ConceptosAdicionalesManiobra";
import ConceptosAdicionalesEntrega from "../Tarifas/ConceptosAdicionalesEntrega";
import ConceptosAdicionalesRecoleccion from "../Tarifas/ConceptosAdicionalesRecoleccion";
import ProductosTarifa from "../Tarifas/ProductosTarifa";
import {dataGridLocaleText} from "../../Constants";
import {DataGrid} from "@material-ui/data-grid";
import {ReactComponent as Activo} from "../../iconos/Menu/palomita.svg";
import {ReactComponent as NoActivo} from "../../iconos/Menu/cruz.svg";
import Noty from "noty";

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

function showSuccess(mensaje) {
    new Noty({
        type: "information",
        layout: "topCenter",
        text: mensaje,
        timeout: "3000"
    }).show()
}
class EscribirConvenio extends Component {
    constructor(props) {
        super(props);
        this.state = {
            tab: 0,
            todosConceptos: [],
            conceptosAdicionales: [],
            conceptosManiobra: [],
            conceptosEntrega: [],
            conceptosRecoleccion: [],
            impuestos: [],
            // tiposCobroSeleccionado: props.edit ? props.select.m_arrArCobros : [],
            // tiposServicioSeleccionado: props.edit ? props.select.m_arrArServicios : [],
            tiposCobroAll: false,
            tiposServicioAll: false,
            // activo: true,
            // porPesoOVolumen: props.edit ? props.select.m_bPorPesoVolumen : true,
            // porRangos: props.edit ? props.select.m_bPorRango : false,
            // unidadPeso: props.edit ? props.select.m_sUnidadPeso : "Kg",
            // factorConversion: props.edit ? props.select.m_nFactorConversion : 1,
            ivaTraslada: [],
            ivaRetiene: [],
            // sucursal: props.edit ? props.select.m_nIdSucursal : "0",
            // destino: props.edit ? props.select.m_nIdDestino : "0",
            // precioFlete: props.edit ? props.select.m_cFleteMinimo : "",
            // precioMinimo: props.edit ? props.select.m_cMontoMinimo : "",
            // precioKilo: props.edit ? props.select.m_cPrecioKilo : "",
            // precioM3: props.edit ? props.select.m_cPrecioM3 : "",
            disabled: true,
            cliente: '',
            fechaVigencia: '',
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
            tarifaDetalles: {m_arrArConceptos:[]},
            columnsProductos: [
                {
                    headerName: "Descripcion",
                    field: "m_sDescripcion",
                    width: 200
                }
            ],
            //Aqui se guardan todos los productos y no se modifican
            dataProductos: [],
            //Aqui se guardan todos los productos que no estan seleccionados
            dataProductosTemp: [],
            //Aqui pues el nombre de la variable ya es muy explicita
            dataProductosSeleccionados: []
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
        this.getAllProductos = this.getAllProductos.bind(this)
        this.onSubmit = this.onSubmit.bind(this)
        this.getConvenioById = this.getConvenioById.bind(this)
        this.limpiarCampos = this.limpiarCampos.bind(this)
    }

    castConceptos(){

        let { todosConceptos, conceptosAdicionales, conceptosManiobra, conceptosEntrega, conceptosRecoleccion, tarifaDetalles } = this.state
        todosConceptos.length = 0
        conceptosAdicionales.length = 0
        conceptosManiobra.length = 0
        conceptosEntrega.length = 0
        conceptosRecoleccion.length = 0
        tarifaDetalles.m_arrArConceptos.forEach( element =>{
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
        this.getAllProductos()
    }

    getAllImpuestos() {
        const url = `${process.env.REACT_APP_API_URL}/Impuestos/GetListado`;
        axios.get(url, { headers }).then(respuesta => {
            this.setState({ impuestos: respuesta.data })
        });
    };

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

    componentWillUnmount() {

    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        if (prevProps.select !== this.props.select) {
            const {select} = this.props
            if (select != 0){
                this.getConvenioById(select)
            }else{
                console.log('limpiar')
                this.limpiarCampos()
            }
        }
    }

    getConvenioById(idConvenio){
        const url = `${process.env.REACT_APP_API_URL}/Convenios/GetById/${idConvenio}`;
        console.log(url)
        axios.get(url, { headers }).then(respuesta => {
            console.log(respuesta)
            this.setState({
                idConvenio: respuesta.data.m_nIdConvenio,
                cliente: respuesta.data.m_nIdCliente,
                fechaVigencia: respuesta.data.m_sVigencia,
                tarifasSeleccionadas : respuesta.data.m_arrArTarifas,
            })
        });
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
        tarifas.forEach((t) => {
            this.state.tarifasSeleccionadas.push(t)
        })

        this.setState({
            openDialog: !this.state.openDialog,
            tarifasSeleccionadas: this.state.tarifasSeleccionadas
        })

    };

    getAllTarifas() {
        const url = `${process.env.REACT_APP_API_URL}/Tarifas/GetListado`;
        axios.get(url, { headers }).then(respuesta => {
            this.setState({ dataTarifas: respuesta.data, agregar: "Agregar" })
        });
    }

    getAllProductos(){
        const url = `${process.env.REACT_APP_API_URL}/Productos/GetListado`;
        axios.get(url, { headers }).then(respuesta => {
            this.setState({ dataProductos: respuesta.data, dataProductosTemp: respuesta.data, agregar: "Agregar" })
        });
    }

    //Funcion para reaccionar al seleccionar una tarifa del LISTADO DE DIALOGO
    handleTarifasSeleccionadas = (e) => {
        this.setState({
            idsTarifasSeleccionadas: e.selectionModel,
        })
    }

    handleGuardarTarifa = (e) => {
        e.preventDefault()
        this.state.tarifasSeleccionadas.forEach((t) => {
            if (t.m_nIdTarifa == this.state.tarifaDetalles.m_nIdTarifa){
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
                        m_nIdTipoMedida: c.tipoMedida
                    })
                })
                t.m_arrArProductos.length = 0
                this.state.dataProductosSeleccionados.forEach((p) => {
                    t.m_arrArProductos.push(p)
                })
            }
        })
        this.setState({
            tarifasSeleccionadas: this.state.tarifasSeleccionadas
        })
        console.log(this.state.tarifasSeleccionadas)
    }

    handleCardClick = (e, t) => {
        e.preventDefault()
        this.state.dataProductosTemp = this.state.dataProductos
        t.m_arrArProductos.forEach((p) => {
                this.state.dataProductosTemp = this.state.dataProductosTemp.filter((f) => f.m_nIdProducto != p.m_nIdProducto)
            })
        this.setState({
            tarifaDetalles: t,
            dataProductosSeleccionados: t.m_arrArProductos,
            dataProductosTemp: this.state.dataProductosTemp
        }, () => {
            this.castConceptos()
        })
    }

    limpiarCampos = () => {
        this.setState({
            idConvenio: 0,
            cliente: '',
            fechaVigencia: '',
            tarifasSeleccionadas : [],
            todosConceptos: [],
            conceptosAdicionales: [],
            conceptosManiobra: [],
            conceptosEntrega: [],
            conceptosRecoleccion: [],
            impuestos: [],
            ivaTraslada: [],
            ivaRetiene: [],
            tarifaDetalles: {m_arrArConceptos:[]},
            idsTarifasSeleccionadas: [],
            dataProductosSeleccionados:[],
            dataProductosTemp:this.state.dataProductos
        })
    }

    onSubmit = (e) => {
        e.preventDefault()

        let params = {
            m_nIdConvenio: this.state.idConvenio,
            m_nIdCliente: this.state.cliente,
            m_sVigencia: this.state.fechaVigencia,
            m_bActivo: true,
            m_arrArTarifas: this.state.tarifasSeleccionadas
        }
        console.log(params)
        console.log(JSON.stringify(params))
        const {idConvenio} = this.state
        if (idConvenio == 0 || idConvenio == '' || idConvenio === undefined){
            const url = `${process.env.REACT_APP_API_URL}/Convenios/Agregar`;
            axios.post(url, Object.assign({}, params),{ headers }).then(respuesta => {
                console.log(respuesta)
                showSuccess(respuesta.data);
                this.limpiarCampos()
            });
        }else{
            const url = `${process.env.REACT_APP_API_URL}/Convenios/Modificar/${idConvenio}`;
            axios.put(url, Object.assign({}, params),{ headers }).then(respuesta => {
                console.log(respuesta)
                showSuccess(respuesta.data);
                this.limpiarCampos()
            });
        }
    }

    handleDuplicarTarifa = (e) => {
        e.preventDefault()
        this.state.tarifasSeleccionadas.push(
            this.state.tarifaDetalles
        )
        this.setState({
            tarifasSeleccionadas: this.state.tarifasSeleccionadas
        })
    }

    actualizarProductos = (todosProductos, productosSeleccionados) => {
        this.setState({
            dataProductosTemp: todosProductos,
            dataProductosSeleccionados: productosSeleccionados
        })
    }

    render() {
        const { disabled, todosConceptos, conceptosAdicionales, conceptosManiobra, conceptosEntrega, conceptosRecoleccion, openDialog,
            columnsTarifas, dataTarifas, height, tarifasSeleccionadas, tarifaDetalles, dataProductosTemp,dataProductosSeleccionados, columnsProductos,
            cliente, fechaVigencia, cardStyle} = this.state
        let { consult, edit} = this.props

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
                                                            disabled={consult}
                                                            className="form-control"
                                                            required
                                                            onChange={this.handleChange}
                                                            value={cliente}
                                                            name="cliente"
                                                            id="cliente"
                                                        >
                                                            <option aria-label={"Seleccionar"} value={""}/>
                                                            {this.state.dataClientes.map((c) => (
                                                                <option
                                                                    key={c.m_nIdCliente}
                                                                    value={c.m_nIdCliente}
                                                                >
                                                                    {c.m_sNombreFiscal}
                                                                </option>
                                                            ))}
                                                        </Select>
                                                    </FormControl>
                                                </label>

                                            </div>

                                            <div className="col-md-12 col-sm-12" style={{ padding: "5px" }}>
                                                <label className="input" style={{ width: "100%" }}>
                                                    <TextField
                                                        variant="outlined"
                                                        id="fechaVigencia"
                                                        name="fechaVigencia"
                                                        label="Vigencia"
                                                        type="date"
                                                        disabled={consult}
                                                        onChange={this.handleChange}
                                                        value={fechaVigencia}
                                                        className={"form-control"}
                                                        InputLabelProps={{shrink: true,}}
                                                        required
                                                    />
                                                </label>
                                            </div>
                                            <div className="col-md-12 col-sm-12" style={{ padding: "5px" }}>
                                                <div className="col-md-12 col-sm-12" style={{ padding: "5px" }}>
                                                    <button className="btn btn-primary primary-btn" onClick={this.handleShowDialog} disabled={consult}>
                                                        Seleccionar tarifas
                                                    </button>

                                                    <button type="submit" className="btn btn-primary primary-btn" disabled={consult}>
                                                        Guardar convenio
                                                    </button>
                                                </div>
                                            </div>
                                        </div>

                                    </div>
                                </div>
                                <div className="col-md-12 col-sm-12" style={{ padding: "5px" }}>
                                    {
                                        tarifasSeleccionadas.length > 0 &&
                                        <button className="btn btn-primary primary-btn" onClick={this.handleDuplicarTarifa} disabled={consult}>
                                            Duplicar Tarifa
                                        </button>
                                    }

                                </div>
                                <div className="col-md-12 col-sm-12" style={{ padding: "5px" }}>
                                    {
                                        tarifasSeleccionadas.map((t) => (
                                            <Card style={{marginBottom: '10px'}}>
                                                <CardActionArea onClick={(e) => this.handleCardClick(e, t)}>
                                                    <CardContent>
                                                        <Grid container>
                                                            <Grid item xs={12}>
                                                                <Typography variant="body2" color="textSecondary" component="p">
                                                                    {t.m_sSucursal} - {t.m_sDestino}
                                                                </Typography>
                                                            </Grid>
                                                            <Grid item xs={12}>
                                                                <Typography gutterBottom variant="h5" component="h2">
                                                                    {t.m_arrArProductos.map((p) => (
                                                                        p.m_sDescripcion + ', '
                                                                    ))}
                                                                </Typography>
                                                            </Grid>
                                                        </Grid>
                                                    </CardContent>
                                                </CardActionArea>
                                            </Card>
                                        ))
                                    }
                                </div>
                            </div>
                            <div className="col-md-9 col-sm-12" >
                                {
                                    todosConceptos.length > 0 &&
                                    `${tarifaDetalles.m_sSucursal} - ${tarifaDetalles.m_sDestino}`
                                }
                                {
                                    todosConceptos.length > 0 &&
                                    <button className="btn btn-primary primary-btn" onClick={this.handleGuardarTarifa} disabled={consult}>
                                        Guardar tarifa
                                    </button>
                                }

                            </div>
                            <div className="col-md-9 col-sm-12" >
                                <div className="widget-wrap" style={{ margin: "0px", padding: "0px" }}>
                                    <div className="widget-content">

                                        <div>
                                            <Tabs value={this.state.tab} onChange={this.handleTabChange} aria-label="simple tabs example" variant="scrollable" scrollButtons="auto">
                                                <Tab label="Concetos Adicionales por Destino" {...this.a11yProps(0)} className={{ backgroundColor: "white !important" }} />
                                                <Tab label="Maniobras" {...this.a11yProps(1)} />
                                                <Tab label="Entrega" {...this.a11yProps(2)} />
                                                <Tab label="Recolección" {...this.a11yProps(3)}/>
                                                <Tab label="Productos" {...this.a11yProps(4)}/>
                                            </Tabs>

                                            <TabPanel value={this.state.tab} index={0}>
                                                <ConceptosAdicionales consult={consult}
                                                                      select={tarifaDetalles}
                                                                      conceptosAdicionales={conceptosAdicionales}
                                                                      addConcepto={this.addConcepto}
                                                                      removeConcepto={this.removeConceptoAdicional}
                                                                      ivaRetiene={this.state.ivaRetiene}
                                                                      ivaTraslada={this.state.ivaTraslada}
                                                                      mostrarRangos={false}/>
                                            </TabPanel>
                                            <TabPanel value={this.state.tab} index={1}>
                                                <ConceptosAdicionalesManiobra consult={consult}
                                                                              select={tarifaDetalles}
                                                                              conceptosAdicionales={conceptosManiobra}
                                                                              addConcepto={this.addConcepto}
                                                                              removeConcepto={this.removeConceptoManiobra}
                                                                              ivaRetiene={this.state.ivaRetiene}
                                                                              ivaTraslada={this.state.ivaTraslada}
                                                                              />
                                            </TabPanel>
                                            <TabPanel value={this.state.tab} index={2}>
                                                {/*el filtrado por agregadoDesde está demas*/}
                                                <ConceptosAdicionalesEntrega consult={consult}
                                                                             select={tarifaDetalles}
                                                                             conceptosAdicionales={conceptosEntrega}
                                                                             addConcepto={this.addConcepto}
                                                                             removeConcepto={this.removeConceptoEntrega}
                                                                             ivaRetiene={this.state.ivaRetiene}
                                                                             ivaTraslada={this.state.ivaTraslada}
                                                                             />
                                            </TabPanel>
                                            <TabPanel value={this.state.tab} index={3}>
                                                {/*el filtrado por agregadoDesde está demas*/}
                                                <ConceptosAdicionalesRecoleccion consult={consult}
                                                                                 select={tarifaDetalles}
                                                                                 conceptosAdicionales={conceptosRecoleccion}
                                                                                 addConcepto={this.addConcepto}
                                                                                 removeConcepto={this.removeConceptoRecoleccion}
                                                                                 ivaRetiene={this.state.ivaRetiene}
                                                                                 ivaTraslada={this.state.ivaTraslada}
                                                                                 />
                                            </TabPanel>
                                            <TabPanel value={this.state.tab} index={4}>
                                                <ProductosTarifa
                                                    productos={dataProductosTemp}
                                                    productosSeleccionados={dataProductosSeleccionados}
                                                    actualizarProductos={this.actualizarProductos}
                                                />

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