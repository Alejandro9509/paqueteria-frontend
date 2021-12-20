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
import DialogTableClientes from "../Clientes/DialogTableClientes";
import {API_HEADERS, dataGridLocaleText} from "../../Constants";
import {DataGrid} from "@material-ui/data-grid";
import {ReactComponent as Activo} from "../../iconos/Menu/palomita.svg";
import {ReactComponent as NoActivo} from "../../iconos/Menu/cruz.svg";
import Noty from "noty";
import {obtenerTarifaBy} from "../../Util/Contexts/TarifasContext";
import DestinosTarifa from "../Tarifas/DestinosTarifa";
import ProductosPrecios from "../Tarifas/ProductosPrecios";
import {obtenerCliente, obtenerClienteId} from "../../Util/Contexts/ClientesContext";
import {
    obtenerByIdZonaTarifa,
    obtenerByIdZonaTarifaSinCP,
    obtenerListadoZonaTarifa
} from "../../Util/Contexts/ZonaTarifaContext";
import CodigosPostalesZonas from "../ZonasOperativas/CodigosPostalesZonas";
import ConceptosFacturacion from "../Tarifas/ConceptosFacturacion";
import {obtenerConceptosFacturacion} from "../../Util/Contexts/ConceptosFacturacionContext";
import {obtenerProductos} from "../../Util/Contexts/ProductosContext";
import {obtenerConveniosId} from "../../Util/Contexts/ConveniosContext";
import DeleteIcon from "@material-ui/icons/Delete";

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
            tiposCobroAll: false,
            tiposServicioAll: false,
            ivaTraslada: [],
            ivaRetiene: [],
            disabled: true,
            cliente: '',
            nombreCliente:'',
            CuotaMensual:0,
            fechaVigencia: '',
            dataClientes: [],
            openDialog: false,
            dataTarifas: [],
            columnsTarifas: [
                {
                    headerName: "Código",
                    field: "m_sCodigo",
                    width: 300,
                },{
                    headerName: "Origen",
                    field: "m_sOrigen",
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
            columnsZonas: [
                {
                    headerName: "Código Zona",
                    field: 'm_sCodigoZona',
                    minWidth: 200,
                    flex: 1
                },
                {
                    headerName: "Estado",
                    field: 'm_sEstado',
                    minWidth: 200,
                    flex: 1
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
            tarifaDetalles: {m_arrArConceptos:[], m_bPorPesoVolumen: false, m_bPorRegion: false, m_bPorRango: false},
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
            dataProductosSeleccionados: [],
            dataZonas:[],
            dataRequerida:"",
            idsZonasSeleccionadas:[],
            zonasSeleccionadas: [],
            seleccionDetalles: {tipoSeleccion:null},
            conceptosZona:[]
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
        this.dialogVisible = this.dialogVisible.bind(this)
        this.handleClienteSelected = this.handleClienteSelected.bind(this)
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
        this.getAllZonas = this.getAllZonas.bind(this)
        this.addConceptoV2 = this.addConceptoV2.bind(this)
        this.removeConceptoV2 = this.removeConceptoV2.bind(this)
        this.getAllConceptos = this.getAllConceptos.bind(this)
        this.guardarZonaTarifa = this.guardarZonaTarifa.bind(this)
        this.handleDeleteTarifa = this.handleDeleteTarifa.bind(this)
        this.handleDeleteZona = this.handleDeleteZona.bind(this)
        this.removeConcepto = this.removeConcepto.bind(this)
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
            /*if (element.m_nIdAgregadoDesde == 0){
                conceptosAdicionales.push(concept)
            }else if (element.m_nIdAgregadoDesde == 1){
                conceptosManiobra.push(concept)
            }else if (element.m_nIdAgregadoDesde == 2){
                conceptosEntrega.push(concept)
            }else if (element.m_nIdAgregadoDesde == 3){
                conceptosRecoleccion.push(concept)
            }*/
/*
            ivaTraslada = getUniqueListBy(todosConceptos, "traslada").map(i => i.traslada);
            ivaRetiene = getUniqueListBy(todosConceptos, "retiene").map(i => i.retiene);*/
            this.setState({ todosConceptos: todosConceptos/*, ivaRetiene: ivaRetiene, ivaTraslada: ivaTraslada*/ })
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
        this.getAllData()
    }

    getAllData() {
        this.getAllImpuestos()
        this.castConceptos()
        // this.getAllClientes()
        this.getAllTarifas()
        this.getAllProductos()
        this.getAllZonas()
        this.getAllConceptos()
    }


    getAllConceptos() {
        obtenerConceptosFacturacion().then(respuesta => {this.setState({ dataConceptosBase: respuesta.data })});
    }

    getAllImpuestos() {
        const url = `${process.env.REACT_APP_API_URL}/Impuestos/GetListado`;
        axios.get(url, { headers }).then(respuesta => {
            this.setState({ impuestos: respuesta.data })
        });
    };

    getAllClientes() {
        // showSuccess('recuerda habilitar peticion')
        obtenerCliente().then((respuesta) => {
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
            id: data.id,
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
        this.setState({ todosConceptos: todosConceptos })
        /*ivaTraslada = getUniqueListBy(todosConceptos, "traslada").map(i => i.traslada);
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
        }*/

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
    removeConcepto(item) {
        const {todosConceptos } = this.state
        const newArrayTodosConceptos = todosConceptos.filter(c => c.id !== item.id)
        this.setState({ todosConceptos: newArrayTodosConceptos })
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
        if (prevProps.pantallaActiva !== this.props.pantallaActiva && this.props.pantallaActiva === 1){
            this.limpiarCampos()
            this.getAllImpuestos()
            this.castConceptos()
            // this.getAllClientes()
            this.getAllTarifas()
            this.getAllProductos()
            this.getAllZonas()
            this.getAllConceptos()
        }

        if (prevProps.pantallaActiva !== this.props.pantallaActiva && this.props.pantallaActiva === 3) {
            // debugger
            const {select, pantallaActiva} = this.props
            if (select != 0){
                this.getConvenioById(select)
            }
        }
        if (prevProps.pantallaActiva == this.props.pantallaActiva && this.props.pantallaActiva === 2){
            if (prevState.cliente != this.state.cliente){
                if (this.state.cliente != 0) {
                    
                    this.getConvenioByIdCliente(this.state.cliente)
                }
            }

        }

    }

    getConvenioById(idConvenio){
        obtenerConveniosId(idConvenio).then(respuesta => {
            console.log(respuesta)
            obtenerClienteId(respuesta.data.m_nIdCliente).then(dataCliente=>{
                console.log(dataCliente)
                this.setState({
                idConvenio: respuesta.data.m_nIdConvenio,
                cliente: respuesta.data.m_nIdCliente,
                nombreCliente: dataCliente.data.m_sNombreFiscal,
                fechaVigencia: respuesta.data.m_sVigencia,
                CuotaMensual:respuesta.data.m_xCuotaMensual,
                tarifasSeleccionadas : respuesta.data.m_arrArTarifas,
                zonasSeleccionadas : respuesta.data.m_arrArZonas
            })
            })
          
        });
    }

    getConvenioByIdCliente(idCliente){
        const url = `${process.env.REACT_APP_API_URL}/Convenios/GetByIdCliente/${idCliente}`;
        console.log(url)
        axios.get(url, { headers }).then(respuesta => {
            console.log(respuesta)
            if (respuesta.data.length > 0){
                this.setState({
                    idConvenio: respuesta.data[0].m_nIdConvenio,
                    cliente: respuesta.data[0].m_nIdCliente,
                    fechaVigencia: respuesta.data[0].m_sVigencia,
                    CuotaMensual:respuesta.data[0].m_xCuotaMensual,
                    tarifasSeleccionadas : respuesta.data[0].m_arrArTarifas,
                })
                showSuccess("Se detectó que el cliente seleccionado ya tiene convenio");
            }else{
                this.limpiarCamposMenosCliente()
            }

        });
    }

    limpiarCamposMenosCliente = () => {
        this.setState({
            idConvenio: 0,
            fechaVigencia: '',
            CuotaMensual:'',
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
            dataProductosTemp:this.state.dataProductos,
            seleccionDetalle: {tipoSeleccion:null}
        })
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

    handleShowDialog = (event, dataRequerida) => {
        event.preventDefault()
        this.setState({
            openDialog: !this.state.openDialog,
            dataRequerida: dataRequerida
        })
    };

    handleClienteSelected = (row) =>{
        this.setState({
            cliente:row.data.m_nIdCliente,
            nombreCliente:row.data.m_sNombreFiscal,
            openModal: false
        })
    }

     dialogVisible = (isVisible) => {
        this.setState({
            openModal: isVisible,
        });
      };

    handleConfirmTarifas = (event) => {
        event.preventDefault()

        if (this.state.dataRequerida === "Tarifas"){
            const tarifas = []
            this.state.idsTarifasSeleccionadas.forEach((idTarifa) => {
                obtenerTarifaBy(idTarifa).then(respuesta=> {
                    respuesta.data.m_nIdTarifaConvenio = Math.floor(Math.random() * 10000)
                    tarifas.push(respuesta.data)
                    this.state.tarifasSeleccionadas.push(respuesta.data)
                    if (tarifas.length === this.state.idsTarifasSeleccionadas.length){
                        this.setState({
                            openDialog: !this.state.openDialog,
                            tarifasSeleccionadas: this.state.tarifasSeleccionadas
                        })
                    }
                })
                // tarifas.push(this.state.dataTarifas.find((t) => t.m_nIdTarifa == idTarifa))
            })
        }else{
            const zonas = []
            this.state.idsZonasSeleccionadas.forEach((idZona) => {
                obtenerByIdZonaTarifaSinCP(idZona).then(respuesta => {
                    respuesta.data.m_nIdZonaConvenio = Math.floor(Math.random() * 10000)
                    zonas.push(respuesta.data)
                    this.state.zonasSeleccionadas.push(respuesta.data)
                    if (zonas.length === this.state.idsZonasSeleccionadas.length){
                        this.setState({
                            openDialog: !this.state.openDialog,
                            zonasSeleccionadas: this.state.zonasSeleccionadas
                        })
                    }
                })
            })
        }
    };

    getAllTarifas() {
        const url = `${process.env.REACT_APP_API_URL}/Tarifas/GetListado`;
        axios.get(url, { headers }).then(respuesta => {
            this.setState({ dataTarifas: respuesta.data, agregar: "Agregar" })
        });
    }

    getAllProductos(){
        obtenerProductos().then(respuesta => {
            this.setState({ dataProductos: respuesta.data, dataProductosTemp: respuesta.data, agregar: "Agregar" })
        });
    }

    //Funcion para reaccionar al seleccionar una tarifa del LISTADO DE DIALOGO
    handleTarifasSeleccionadas = (e) => {
        if (this.state.dataRequerida === "Tarifas"){
            this.setState({
                idsTarifasSeleccionadas: e.selectionModel,
            })
        }else{
            this.setState({
                idsZonasSeleccionadas: e.selectionModel,
            })
        }

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

                const listadoProductosTemp = []
                this.state.dataProductosSeleccionados.forEach((p) => {listadoProductosTemp.push(p)})
                t.m_arrArProductos.length = 0
                listadoProductosTemp.forEach((p) => {t.m_arrArProductos.push(p)})
            }
        })
        this.setState(state => {
            return {
                ...state,
                tarifasSeleccionadas: this.state.tarifasSeleccionadas
            }
        })
        console.log(this.state.tarifasSeleccionadas)
        showSuccess("Tarifa guardada.")
    }

    handleCardClick = (event, tarifa, tipo) => {
        event.preventDefault()
        if (tipo === "Tarifa"){
            this.state.dataProductosTemp = this.state.dataProductos
            tarifa.m_arrArProductos.forEach((p) => {
                this.state.dataProductosTemp = this.state.dataProductosTemp.filter((f) => f.m_nIdProducto != p.m_nIdProducto)
            })
            tarifa.tipoSeleccion = tipo
            this.setState({
                tarifaDetalles: tarifa,
                dataProductosSeleccionados: tarifa.m_arrArProductos,
                dataProductosTemp: this.state.dataProductosTemp,
                seleccionDetalles: tarifa
            }, () => {
                this.castConceptos()
            })
        }else if (tipo === "Zona"){
            console.log(tarifa)
            tarifa.tipoSeleccion = tipo
            let conceptos = []
            tarifa.m_arrArConceptos.forEach(element => {
                let concepto = {
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
                    tipoMedida: element.m_nIdTipoMedida,
                    concepto: element
                }
                conceptos.push(concepto)
            })
            this.setState({
                seleccionDetalles: tarifa,
                conceptosZona: conceptos
            })
        }
    }

    limpiarCampos = () => {
        this.setState({
            idConvenio: 0,
            cliente: '',
            nombreCliente:'',
            CuotaMensual:'',
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
            dataProductosTemp:this.state.dataProductos,
            dataZonas:[],
            dataRequerida:"",
            idsZonasSeleccionadas:[],
            zonasSeleccionadas: [],
            seleccionDetalles: {tipoSeleccion:null},
            conceptosZona:[]
        })

    }

    onSubmit = (e) => {
        e.preventDefault()

        let params = {
            m_nIdConvenio: this.state.idConvenio,
            m_nIdCliente: this.state.cliente,
            m_sVigencia: this.state.fechaVigencia,
            m_xCuotaMensual: this.state.CuotaMensual,
            m_bActivo: true,
            m_arrArTarifas: this.state.tarifasSeleccionadas,
            m_arrArZonas: this.state.zonasSeleccionadas
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

    getAllZonas = () => {
        obtenerListadoZonaTarifa().then(({data}) => {
            this.setState({ dataZonas: data, agregar: "Agregar" })
        })
    }

    removeConceptoV2 = (data) => {
        this.setState({
            conceptosZona: this.state.conceptosZona.filter(item => data.id !== item.id)
        })
    }

    addConceptoV2 = (data) => {
        data.idConcepto = data.concepto.m_nIdConceptosFacturacion
        data.nombreConcepto = data.concepto.m_sConcepto
        this.state.conceptosZona.push(data)
        this.setState({
            conceptosZona: this.state.conceptosZona
        })
    }

    guardarZonaTarifa(){
        this.state.zonasSeleccionadas.forEach(item => {
            if (item.m_nIdZona === this.state.seleccionDetalles.m_nIdZona){
                const conceptos = []
                this.state.conceptosZona.forEach(element => {
                    let concepto = {
                        m_nIdConceptosFacturacion : element.idConcepto,
                        m_cImporte: element.importe,
                        m_nIdImpuestoRetiene: element.retiene,
                        m_nIdImpuestoTraslada: element.traslada,
                        m_cImporteRetiene: element.importeRet,
                        m_cImporteIva: element.importeIVA,
                        m_xnRangoMinimo: element.rangoMinimo,
                        m_xnRangoMaximo: element.rangoMaximo,
                        nombreConcepto: element.m_sConcepto,
                        m_sConcepto: element.nombreConcepto,
                        m_nIdTipoCalculo: element.tipoCalculo,
                        m_nIdAgregadoDesde: element.agregadoDesde,
                        m_nIdTipoMedida: element.tipoMedida,
                        arClsDetalle:element.concepto.arClsDetalle
                    }
                    conceptos.push(concepto)
                })
                item.m_arrArConceptos = conceptos
            }
        })
        showSuccess("Tarifa guardada.")

    }

    cardZona(item){

        return(
            <Card style={{marginBottom: '10px'}}>
                <IconButton aria-label="delete" style={{alignItems: 'right'}} onClick={(e) => this.handleDeleteZona(e, item)}>
                    <DeleteIcon />
                </IconButton>
                <CardActionArea onClick={(e) => this.handleCardClick(e, item, "Zona")}>
                    <CardContent>
                        <Grid container>
                            <Grid item xs={12}>
                                <Typography variant="body2" color="textSecondary" component="p">
                                    {item.m_sCodigoZona}
                                </Typography>
                            </Grid>
                            <Grid item xs={12}>
                                <Typography gutterBottom variant="h5" component="h2">
                                    {item.m_sEstado}
                                </Typography>
                            </Grid>
                        </Grid>
                    </CardContent>
                </CardActionArea>
            </Card>
        )
    }

    handleDeleteTarifa(event, tarifa){
        const newArray = this.state.tarifasSeleccionadas.filter(item => item.m_nIdTarifaConvenio !== tarifa.m_nIdTarifaConvenio)
        this.setState({
            tarifasSeleccionadas: newArray
        })
    }
    handleDeleteZona(event, tarifa){
        const newArray = this.state.zonasSeleccionadas.filter(item => item.m_nIdZonaConvenio !== tarifa.m_nIdZonaConvenio)
        this.setState({
            zonasSeleccionadas: newArray
        })
    }

    render() {
        const { todosConceptos, conceptosAdicionales, conceptosManiobra, conceptosEntrega, openDialog,
            columnsTarifas, dataTarifas, height, tarifasSeleccionadas, tarifaDetalles, dataProductosTemp,
            dataProductosSeleccionados, nombreCliente, fechaVigencia,CuotaMensual} = this.state
        let { consult} = this.props

        return (
            <div>
                {
                    openDialog &&
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
                                    rows={this.state.dataRequerida === "Tarifas" ? dataTarifas : this.state.dataZonas}
                                    columns={this.state.dataRequerida === "Tarifas" ? columnsTarifas: this.state.columnsZonas}
                                    density="compact"
                                    pageSize={Math.floor((height - 310) / 30)}
                                    getRowId={(row) => this.state.dataRequerida === "Tarifas" ? row.m_nIdTarifa : row.m_nIdZona}
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
                        {  /*AQUI COMIENZA EL MODAL DE CLIENTES*/}


                    </Dialog>
                }

                <Dialog
                open={this.state.openModal}
                onClose={() => this.setState({ openModal: false})}
                fullWidth maxWidth="md"
            >   
             {this.state.tipoModal == "Clientes" &&
                     <DialogContent>
                    <div className="row" style={{backgroundColor: '#FFFFFF'}}>
                        <DialogTableClientes dialogVisible={this.dialogVisible} handlePatrocinadorSelected={this.handleClienteSelected}/>
                    </div>
                    </DialogContent>
                    }
                </Dialog>
                <form className="j-forms" onSubmit={this.onSubmit}>
                    <div className="main-container" style={{ marginLeft: "0px", padding: "0px" }}>
                        <div className="row">
                            <div className="col-md-3 col-sm-12">
                                <div className="widget-wrap">
                                    <div className="widget-content">
                                        <div className="row">
                                            <Grid container spacing={1}>
                                                <Grid item xs={12}>
                                                    <label className="input" style={{ width: "100%" }}>
                                         
                                                            <TextField
                                                           
                                                                labelId="clienteLabel"
                                                                label="Cliente"
                                                                margin="dense"
                                                                disabled={consult}
                                                                className="form-control"
                                                                required
                                                                placeholder={"Cliente"}
                                                                value={nombreCliente}
                                                                name="cliente"
                                                                id="cliente"
                                                                variant="outlined"
                                                                InputLabelProps={{shrink: true,}}
                                                                onClick={(e)=>{
                                                                    this.setState({
                                                                        openModal: true,
                                                                        tipoModal:"Clientes"
                                                                    })
                                                                    }} 
                                                            />
                                                       
                                                    </label>
                                                </Grid>
                                                <Grid item xs={12}>
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
                                                </Grid>
                                                <Grid item xs={12}>
                                                <label className="input" style={{ width: "100%" }}>
                                                    <TextField
                                                        variant="outlined"
                                                        id="CuotaMensual"
                                                        name="CuotaMensual"
                                                        label="Cuota Mensual"
                                                        type="number"
                                                        disabled={consult}
                                                        onChange={this.handleChange}
                                                        value={CuotaMensual}
                                                        className={"form-control"}
                                                        InputLabelProps={{shrink: true,}}
                                                        required
                                                    />
                                                </label>
                                            </Grid>
                                                <Grid item xs={12}>
                                                    <button className="btn btn-primary primary-btn" onClick={(event) => this.handleShowDialog(event,"Tarifas")} disabled={consult}>
                                                        Seleccionar tarifas
                                                    </button>
                                                </Grid>
                                                <Grid item xs={12}>
                                                    <button className="btn btn-primary primary-btn" onClick={(event) => this.handleShowDialog(event,"Zonas")} disabled={consult}>
                                                        Seleccionar zonas
                                                    </button>
                                                </Grid>
                                                <Grid item xs={12}>
                                                    <button type="submit" className="btn btn-primary primary-btn" disabled={consult}>
                                                        Guardar convenio
                                                    </button>
                                                </Grid>
                                            </Grid>
                                        </div>

                                    </div>
                                </div>
                                <div className="col-md-12 col-sm-12" style={{ padding: "5px" }}>
                                    {/*{
                                        tarifasSeleccionadas.length > 0 &&
                                        <button className="btn btn-primary primary-btn" onClick={this.handleDuplicarTarifa} disabled={consult}>
                                            Duplicar Tarifa
                                        </button>
                                    }*/}

                                </div>
                                <div className="col-md-12 col-sm-12" style={{ padding: "5px" }}>
                                    {/*Listado de tarjetas de tarifas*/}
                                    {
                                        tarifasSeleccionadas.map((t) => (
                                            <Card style={{marginBottom: '10px'}}>
                                                <IconButton aria-label="delete" style={{alignItems: 'right'}} onClick={(e) => this.handleDeleteTarifa(e, t)}>
                                                    <DeleteIcon />
                                                </IconButton>
                                                <CardActionArea onClick={(e) => this.handleCardClick(e, t, "Tarifa")}>
                                                    <CardContent>
                                                        <Grid container>
                                                            <Grid item xs={12}>
                                                                <Typography variant="body2" color="textSecondary" component="p">
                                                                    {t.m_sOrigen} - {t.m_sDestino}
                                                                </Typography>
                                                            </Grid>
                                                            <Grid item xs={12}>
                                                                <Typography gutterBottom variant="h5" component="h2">
                                                                    {t.m_arrArProductos &&
                                                                        t.m_arrArProductos.map((p) => (
                                                                            p.m_nIdProducto+'-' + p.m_sDescripcion + ', '
                                                                    ))}
                                                                </Typography>
                                                            </Grid>
                                                        </Grid>
                                                    </CardContent>
                                                </CardActionArea>
                                            </Card>
                                        ))
                                    }
                                    {/*Listado de tarjetas de tarifas por zona*/}
                                    {
                                        this.state.zonasSeleccionadas.map((item) => this.cardZona(item))
                                    }
                                </div>
                            </div>
                            <div className="col-md-9 col-sm-12" >
                                {
                                    todosConceptos.length > 0 &&
                                    `${tarifaDetalles.m_sOrigen} - ${tarifaDetalles.m_sDestino}`
                                }

                                {
                                    todosConceptos.length > 0  && this.state.seleccionDetalles.tipoSeleccion === "Tarifa" &&
                                    <button className="btn btn-primary primary-btn" onClick={this.handleGuardarTarifa} disabled={consult}>
                                        Guardar tarifa
                                    </button>
                                }
                            </div>
                            <div className="col-md-9 col-sm-12" >
                                <div className="widget-wrap" style={{ margin: "0px", padding: "0px" }}>
                                    <div className="widget-content">

                                        { this.state.seleccionDetalles.tipoSeleccion === "Tarifa" &&
                                            <div>

                                                {(tarifaDetalles.m_bPorRango || tarifaDetalles.m_bPorPesoVolumen) &&
                                                    <div>
                                                    <Tabs value={this.state.tab} onChange={this.handleTabChange} aria-label="simple tabs example" variant="scrollable" scrollButtons="auto">
                                                        <Tab label="Concetos Adicionales por Destino" {...this.a11yProps(0)} className={{ backgroundColor: "white !important" }} />
                                                        <Tab label="Maniobras" {...this.a11yProps(1)} />
                                                        <Tab label="Entrega" {...this.a11yProps(2)} />
                                                        {/*<Tab label="Recolección" {...this.a11yProps(3)}/>*/}
                                                        <Tab label="Productos" {...this.a11yProps(4)}/>
                                                    </Tabs>

                                                    <TabPanel value={this.state.tab} index={0}>
                                                        {/*<ConceptosAdicionales consult={consult}
                                                                              select={tarifaDetalles}
                                                                              conceptosAdicionales={conceptosAdicionales}
                                                                              addConcepto={this.addConcepto}
                                                                              removeConcepto={this.removeConceptoAdicional}
                                                                              ivaRetiene={this.state.ivaRetiene}
                                                                              ivaTraslada={this.state.ivaTraslada}
                                                                              mostrarRangos={false}/>*/}
                                                        <ConceptosFacturacion
                                                            consulta={consult}
                                                            dataList={todosConceptos.filter(item => item.agregadoDesde === 0)}
                                                            // onChangeList={this.handleChangeListConceptos}
                                                            mostrarRangos={true}
                                                            mostrarImpuestos={true}
                                                            mostrarDescuento={false}
                                                            mostrarTipoMedida={true}
                                                            mostrarTipoCalculo={true}
                                                            conceptosBase={this.state.dataConceptosBase}
                                                            keys={0}
                                                            agregarConcepto={this.addConcepto}
                                                            eliminarConcepto={this.removeConcepto}
                                                        />
                                                    </TabPanel>
                                                    <TabPanel value={this.state.tab} index={1}>
                                                        {/*<ConceptosAdicionalesManiobra consult={consult}
                                                                                      select={tarifaDetalles}
                                                                                      conceptosAdicionales={conceptosManiobra}
                                                                                      addConcepto={this.addConcepto}
                                                                                      removeConcepto={this.removeConceptoManiobra}
                                                                                      ivaRetiene={this.state.ivaRetiene}
                                                                                      ivaTraslada={this.state.ivaTraslada}

                                                        />*/}
                                                        <ConceptosFacturacion
                                                            consulta={consult}
                                                            dataList={todosConceptos.filter(item => item.agregadoDesde === 1)}
                                                            // onChangeList={this.handleChangeListConceptos}
                                                            mostrarRangos={true}
                                                            mostrarImpuestos={true}
                                                            mostrarDescuento={false}
                                                            mostrarTipoMedida={true}
                                                            mostrarTipoCalculo={true}
                                                            conceptosBase={this.state.dataConceptosBase}
                                                            keys={1}
                                                            agregarConcepto={this.addConcepto}
                                                            eliminarConcepto={this.removeConcepto}
                                                        />
                                                    </TabPanel>
                                                    <TabPanel value={this.state.tab} index={2}>
                                                        {/*el filtrado por agregadoDesde está demas*/}
                                                        {/*<ConceptosAdicionalesEntrega consult={consult}
                                                                                     select={tarifaDetalles}
                                                                                     conceptosAdicionales={conceptosEntrega}
                                                                                     addConcepto={this.addConcepto}
                                                                                     removeConcepto={this.removeConceptoEntrega}
                                                                                     ivaRetiene={this.state.ivaRetiene}
                                                                                     ivaTraslada={this.state.ivaTraslada}
                                                        />*/}
                                                        <ConceptosFacturacion
                                                            consulta={consult}
                                                            dataList={todosConceptos.filter(item => item.agregadoDesde === 2)}
                                                            // onChangeList={this.handleChangeListConceptos}
                                                            mostrarRangos={true}
                                                            mostrarImpuestos={true}
                                                            mostrarDescuento={false}
                                                            mostrarTipoMedida={true}
                                                            mostrarTipoCalculo={true}
                                                            conceptosBase={this.state.dataConceptosBase}
                                                            keys={2}
                                                            agregarConcepto={this.addConcepto}
                                                            eliminarConcepto={this.removeConcepto}
                                                        />
                                                    </TabPanel>
                                                    {/*<TabPanel value={this.state.tab} index={3}>
                                                el filtrado por agregadoDesde está demas
                                                <ConceptosAdicionalesRecoleccion consult={consult}
                                                                                 select={tarifaDetalles}
                                                                                 conceptosAdicionales={conceptosRecoleccion}
                                                                                 addConcepto={this.addConcepto}
                                                                                 removeConcepto={this.removeConceptoRecoleccion}
                                                                                 ivaRetiene={this.state.ivaRetiene}
                                                                                 ivaTraslada={this.state.ivaTraslada}
                                                                                 />
                                            </TabPanel>*/}
                                                    <TabPanel value={this.state.tab} index={3}>
                                                        <ProductosTarifa
                                                            productos={dataProductosTemp}
                                                            productosSeleccionados={dataProductosSeleccionados}
                                                            actualizarProductos={this.actualizarProductos}
                                                            consult={consult}
                                                        />

                                                    </TabPanel>
                                                </div>
                                                }
                                                {
                                                    tarifaDetalles.m_bPorRegion &&
                                                    <div>
                                                        <Tabs value={this.state.tab} onChange={this.handleTabChange} aria-label="simple tabs example" variant="scrollable" scrollButtons="auto">
                                                            <Tab label="Productos" {...this.a11yProps(0)}/>
                                                            <Tab label="Conceptos de Facturación" {...this.a11yProps(1)}/>

                                                        </Tabs>

                                                        <TabPanel value={this.state.tab} index={0}>
                                                            <ProductosPrecios
                                                                dataList={dataProductosSeleccionados}
                                                                onChangeList={this.actualizarProductos}
                                                                mostrarRangos={false}
                                                                consult={consult}
                                                                ivaRetiene={this.state.ivaRetiene}
                                                                ivaTraslada={this.state.ivaTraslada}
                                                            />
                                                        </TabPanel>
                                                        <TabPanel value={this.state.tab} index={1}>
                                                            <ConceptosAdicionales consult={consult}
                                                                                  select={tarifaDetalles}
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
                                        }
                                        { this.state.seleccionDetalles.tipoSeleccion === "Zona" &&
                                            <div>
                                                <div className="widget-header">
                                                    <h2>{this.state.seleccionDetalles.m_sCodigoZona}</h2>
                                                </div>
                                                <div className="widget-container">
                                                    <div className="widget-content">
                                                        <Box sx={{ width: '100%' }}>
                                                            <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                                                                <Tabs value={this.state.tab} onChange={this.handleTabChange} aria-label="basic tabs example">
                                                                    <Tab label="Recoleccion" {...a11yProps(0)} />
                                                                    <Tab label="Entrega" {...a11yProps(1)} />
                                                                </Tabs>
                                                            </Box>
                                                            <TabPanel value={this.state.tab} index={0}>
                                                                <div className="widget-container">
                                                                    <div className="widget-content">
                                                                        <ConceptosFacturacion
                                                                            consulta={consult}
                                                                            dataList={this.state.conceptosZona.filter(i => i.agregadoDesde === 3)}
                                                                            // onChangeList={this.handleChangeListConceptos}
                                                                            mostrarRangos={true}
                                                                            mostrarImpuestos={true}
                                                                            mostrarDescuento={false}
                                                                            mostrarTipoMedida={true}
                                                                            mostrarTipoCalculo={true}
                                                                            conceptosBase={this.state.dataConceptosBase}
                                                                            keys={3}
                                                                            agregarConcepto={this.addConceptoV2}
                                                                            eliminarConcepto={this.removeConceptoV2}
                                                                        />
                                                                    </div>
                                                                </div>

                                                            </TabPanel>
                                                            <TabPanel value={this.state.tab} index={1}>
                                                                <div className="widget-container">
                                                                    <div className="widget-content">
                                                                        <ConceptosFacturacion
                                                                            consulta={consult}
                                                                            dataList={this.state.conceptosZona.filter(i => i.agregadoDesde === 2)}
                                                                            // onChangeList={this.handleChangeListConceptos}
                                                                            mostrarRangos={true}
                                                                            mostrarImpuestos={true}
                                                                            mostrarDescuento={false}
                                                                            mostrarTipoMedida={true}
                                                                            mostrarTipoCalculo={true}
                                                                            conceptosBase={this.state.dataConceptosBase}
                                                                            keys={2}
                                                                            agregarConcepto={this.addConceptoV2}
                                                                            eliminarConcepto={this.removeConceptoV2}
                                                                        />
                                                                    </div>
                                                                </div>
                                                            </TabPanel>
                                                        </Box>
                                                    </div>
                                                </div>
                                                <div className="row">
                                                    <Grid container spacing={2}>
                                                        <Grid item xs={12}>
                                                            <button onClick={this.guardarZonaTarifa} type={"button"} className="btn btn-primary primary-btn">
                                                                Guardar tarifa
                                                            </button>
                                                        </Grid>

                                                    </Grid>
                                                </div>
                                            </div>
                                        }
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