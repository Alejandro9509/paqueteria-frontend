import React, {Component, useEffect, useState} from 'react';
import {Button, Dialog, DialogActions, DialogContent, DialogTitle, Grid, MenuItem, Typography} from "@material-ui/core";
import FormControl from "@material-ui/core/FormControl";
import InputLabel from "@material-ui/core/InputLabel";
import Select from "@material-ui/core/Select";
import {obtenerClavesCancelacionSAT} from "../../Util/Contexts/SATContext";
import TextField from "@material-ui/core/TextField";
import DialogTableClientes from "../Clientes/DialogTableClientes";
import {obtenerParametrosConfiguracion} from "../../Util/Contexts/ParametrosConfiguracionContext";
import {obtenerRecoleccionId} from "../../Util/Contexts/RecoleccionContext";
import {obtenerGuiaRecoleccionPorFolio} from "../../Util/Contexts/UltimaMillaContext";
import {obtenerTipoCobro} from "../../Util/Contexts/TipoCobroContext";
import {obtenerTipoSeguro} from "../../Util/Contexts/TipoSeguroContext";
import InputAdornment from "@material-ui/core/InputAdornment";
import Paquetes from "../Paquetes/Paquetes";
import ComplementosSAT from "./ComplementosSAT";
import DialogTableRemDes from "../RemitenteDestinatario/DialogTableRemDes";
import {obtenerByIdZonaOperativa, obtenerZonaOperativaByIdCodigoPostal} from "../../Util/Contexts/ZonaOperativaContext";
import Noty from "noty";
import RemitentesDestinatarios from "../RemitentesDestinatarios";
import {da} from "date-fns/locale";
import DiferenteDomicilioForm from "../DiferenteDomicilio/DiferenteDomicilioForm";
import {obtenerMunicipiosByIdEstado} from "../../Util/Contexts/MunicipiosContext";
import Cotizador from "../ConceptosFacturacion/Cotizador";

function showSuccess(mensaje) {
    new Noty({
        type: "information",
        layout: "topCenter",
        text: mensaje,
        timeout: "5000",
    }).show();
}

class CancelarSAT extends Component {
    constructor(props) {
        super(props);
        this.state= {
            catalogoSAT: [],
            openDialogRecoleccion: false,
            idGuia: 0
        }
        this.handleChange = this.handleChange.bind(this);
        this.onSubmit = this.onSubmit.bind(this);
        this.handleOnSaveDataRecoleccion = this.handleOnSaveDataRecoleccion.bind(this);
        this.handleOnCancelEditRecoleccion = this.handleOnCancelEditRecoleccion.bind(this);
    }

    componentDidMount() {
        obtenerClavesCancelacionSAT().then(({data}) =>{
            this.setState({
                catalogoSAT: data,
                folioRelacionado: this.props.data.folioSustituye
            })
        })
    }

    handleChange = (event) => {
        event.preventDefault();
        this.setState({
            [event.target.name]: event.target.value,
        });
        if (event.target.name === 'idCancelacionSAT' && event.target.value === '01'){
            try {
                obtenerGuiaRecoleccionPorFolio(this.props.data.m_sFolio).then(respuesta => {
                    let idRecoleccion = respuesta.data.data.m_nIdRecoleccion
                    this.setState({openDialogRecoleccion: true,idGuia: idRecoleccion})
                }).catch(err => {
                    console.log(err);
                })
            }catch(err) {
                console.log(err);
            }


        }
    };
    onSubmit(e){
        e.preventDefault()
        const data = this.state
        data.motivoSAT = this.state.catalogoSAT.find(c => c.m_nid === this.state.idCancelacionSAT).m_sDescripcion
        data.folioRelacionado = this.state.idCancelacionSAT === "01" ? data.folioRelacionado : "0"
        this.props.close()
        this.props.onSubmit(data)
    }

    handleOnSaveDataRecoleccion(data){
        console.log(data)
        this.setState({openDialogRecoleccion: false})
    }

    handleOnCancelEditRecoleccion(){
        this.setState({openDialogRecoleccion: false})
    }
    render() {
        return (
            <div>
                <Dialog open={this.state.openDialogRecoleccion} onClose={() => this.setState({openDialogRecoleccion: false})} fullWidth maxWidth={"xl"}>
                    <DialogTitle><Typography variant={"h3"}>Modificar recoleccion</Typography></DialogTitle>
                    <DialogContent>
                        <RecoleccionResumen
                            idRecoleccion={this.state.idGuia? this.state.idGuia : 0}
                            onSubmitData={this.handleOnSaveDataRecoleccion}
                            onCancel={this.handleOnCancelEditRecoleccion}
                        />
                    </DialogContent>
                </Dialog>
                <Dialog open={this.props.open} onClose={() => this.props.close()} fullWidth maxWidth={"md"}>
                    <DialogTitle><Typography variant={"h3"}>Cancelar SAT - {this.props.data.folioCancelar}</Typography></DialogTitle>
                    <DialogContent>
                        <Typography>Folio: {this.props.data.m_sFolio}</Typography>
                        <br/>
                        <form onSubmit={this.onSubmit}>
                            <label className="input select" style={{width:"100%"}}>
                                <FormControl fullWidth variant="outlined" margin="dense" required>
                                    <InputLabel id="idMotivoCancelacionSATLabel">Motivo cancelación SAT</InputLabel>
                                    <Select
                                        labelId="idMotivoCancelacionSATLabel"
                                        className="form-control"
                                        value={this.state.idCancelacionSAT}
                                        onChange={this.handleChange}
                                        id="idMotivoCancelacionSAT"
                                        label="Motivo cancelación"
                                        name={"idCancelacionSAT"}
                                        required
                                        InputProps={{
                                            id: "idMotivoCancelacionSAT",
                                            name: "idCancelacionSAT"
                                        }}
                                    >
                                        {this.state.catalogoSAT.filter(i => this.props.esInforme ? i.m_nid !== "01" : true).map((estatus) => (
                                            <MenuItem
                                                key={estatus.m_nid}
                                                value={estatus.m_nid}
                                            >
                                                {estatus.m_nid+' - '+estatus.m_sDescripcion}
                                            </MenuItem>
                                        ))}
                                    </Select>
                                </FormControl>
                            </label>

                            <br/>
                            {
                                this.state.idCancelacionSAT === "01" &&
                                < div className="input select">
                                    <TextField variant="outlined" margin="dense"
                                               onChange={this.handleChange}
                                               className="form-control"
                                               type="text" required
                                               fullWidth
                                               label="Folio Fiscal sustituye"
                                               value={this.state.folioRelacionado}
                                               id="idFolioRelacionado"
                                               name="folioRelacionado"
                                    />
                                </div>
                            }
                            <br/>
                            <div className="input select">
                                <TextField variant="outlined" margin="dense"
                                           onChange={this.handleChange}
                                           className="form-control"
                                           type="text"
                                           fullWidth
                                           required
                                           label="Motivo Cancelación"
                                           value={this.state.motivoCancelacion}
                                           id="motivoCancelacion"
                                           name="motivoCancelacion"
                                />
                            </div>
                            <DialogActions>
                                <Button variant={"contained"} color={"default"} onClick={() => this.props.close()}>Cancelar</Button>
                                <Button variant={"contained"} type={"submit"} color={"primary"}>Aceptar</Button>
                            </DialogActions>
                        </form>
                    </DialogContent>
                </Dialog>
            </div>

        );
    }
}

CancelarSAT.propTypes = {};

export default CancelarSAT;

/**Props:
 * idRecoleccion int
 * }*/
export function RecoleccionResumen(props) {

    const [configuraciones, setConfiguraciones] = React.useState({
        idsTiposCobroSeleccionArray: [],
        detectarTipoCobro: false,
        limpiarProducto: false,
    })
    const [dataTipoCobro, setDataTipoCobro] = React.useState([]);
    const [dataTiposSeguro, setDataTiposSeguro] = useState([])
    const [dataPaquetes, setDataPaquetes] = useState([])
    const [dataComplementosSAT, setDataComplementosSAT] = React.useState([])
    const [remitente, setRemitente] = useState({
        idRemitente: '',
        aliasRemitente: '',
        nombreRemitente: '',
        origenRemitente: '',
        zonaOperativaRemitente: '',
    })
    const [dataRecoleccionConsulta, setDataRecoleccionConsulta] = useState();
    const [recoleccionDD, setRecoleccionDD] = useState({
        idPais: '',
        pais: '',
        idEstado: '',
        estado: '',
        idMunicipio: '',
        municipio: '',
        codigoPostal: '',
        zonaOperativa: '',
        domicilio: '',
        detalles: '',
        datosAdicionales: '',
        latitud: '',
        longitud: ''
    })
    const [erroresCotizacion,setErroresCotizacion] = React.useState([])
    const [state, setState] = useState({
        openDialog: false,
        openDialogRemitentes: false
    })
    const [data, setData] = useState({
        "folio": "",
        "idTipoCobro": '',
        "clientePaga": {
            m_nIdCliente: 0,
            m_sNombreFiscal: ''
        },
        "idTipoSeguro": '',
        "porcentajeSeguro": '',
        "valorDeclarado": '',
        "observaciones": "",
        "complementosSat": [],
        "idRemitente": 0,
        "remitente": "",
        "numeroRemitente": 0,
        "diferenteRecoleccion": false,
        "conCita": false,
        "conceptosFacturacion": [],
        destinoDestinatario: { m_nIdCiudad:0 },
        zonaOperativaDestinatario: { m_nIdZona:0 },
        mostrarCotizador: true,
        zonaOperativa: { m_nIdZona:0 }
    })
    useEffect(() => {
        if (props.idRecoleccion > 0){
            obtenerRecoleccionId(props.idRecoleccion).then((respuesta) => {
                respuesta.data.recoleccionById = true
                setData({
                    ...data,
                    folio: respuesta.data.m_sFolioRecoleccion,
                    clientePaga: respuesta.data.cliente,
                    idTipoCobro: respuesta.data.m_nIdTipoDeCobro,
                    idTipoSeguro: respuesta.data.m_nIdTipoSeguro,
                    porcentajeSeguro: respuesta.data.m_xPorcentajeSeguro,
                    valorDeclarado: respuesta.data.m_xValorDeclarado,
                    observaciones: respuesta.data.m_sObservaciones || "",
                    diferenteRecoleccion: respuesta.data.m_bRecoleccionDiferenteDomicilio,
                    destinoDestinatario: { m_nIdCiudad:respuesta.data.m_nIdCiudadDestino },
                    zonaOperativaDestinatario: { m_nIdZona:respuesta.data.m_nIdZonaOperativaEntrega },
                    zonaOperativa: { m_nIdZona:respuesta.data.m_nIdZonaOperativaEntrega },
                    conceptosFacturacion: respuesta.data.m_arrConceptos.map(item => ({
                        id: Math.floor(Math.random() * 10000),
                        idConcepto: item.m_nIdConceptoFacturacion,
                        importe: item.m_cImporte,
                        retiene: item.m_nIdImpuestoRetiene,
                        traslada: item.m_nIdImpuestoTraslada,
                        importeIVA: item.m_cImporteIva,
                        importeRet: item.m_cImporteRetiene,
                        nombreConcepto: item.m_sConcepto,
                        descuento: item.m_c_Descuento
                    })),

                    aplicaSeguro: respuesta.data.m_bAplicaSeguro,
                })
                setDataPaquetes(respuesta.data.m_parrPaquetes)
                setDataComplementosSAT(respuesta.data.m_arrClsComplementoSAT)
                setDataRecoleccionConsulta(respuesta)
                if (respuesta.data.m_bRecoleccionDiferenteDomicilio){
                    mostrarDatosRecoleccionDD(respuesta)
                }

            }).catch( err => {
                console.log(err)
                // showSuccess(err.response.data)
            });
        }

    },[props.idRecoleccion])

    useEffect(() => {
        obtenerTipoCobro().then((respuesta) => {
            respuesta.data.forEach((i) => {
                i.valid = true
            })
            setDataTipoCobro(respuesta.data);
        });
        obtenerTipoSeguro().then(({data}) => {
            setDataTiposSeguro(data)
        })
        obtenerParametrosConfiguracion().then(respuesta => {
            setConfiguraciones((config) => {
                return {
                    ...config,
                    idsTiposCobroSeleccionArray: respuesta.data.TiposCobroActivos ? respuesta.data.TiposCobroActivos.split(',') : [],
                    detectarTipoCobro: respuesta.data.DetectarTipoCobro,
                    limpiarProducto: respuesta.data.LimpiarProducto,
                }
            })
        })

    },[])

    const handlePatrocinadorSelected = (row) => {
        setData(data => {
            return {
                ...data,
                clientePaga: row.data,
                idTipoSeguro: row.data.m_nIdTipoSeguro !== 0 ? row.data.m_nIdTipoSeguro : 5,
                porcentajeSeguro:  row.data.m_cPorcentajeSeguro,
                aplicaSeguro: row.data.m_bTieneSeguro,
                idTipoCobro: configuraciones.detectarTipoCobro ? row.data.m_bSinCredito ? "10" : "11" : state.tipoCobro,
                observaciones: row.data.m_nIdTipoSeguro === 1 ? ("Aseguradora: " + row.data.m_sAseguradora + ", Poliza: " + row.data.m_sPoliza) : "",
            }
        })
        setState({...state, openDialog: false})
    }

    const handleChange = (event) => {
        setData(data => {
            return {
                ...data,
                [event.target.name]: event.target.value,
            }
        });
        if (event.target.name === 'idTipoSeguro'){
            setData(data => {
                return {
                    ...data,
                    porcentajeSeguro: dataTiposSeguro.find(item => item.m_nIdTipoSeguro === event.target.value).m_xPorcentaje,
                    aplicaSeguro: (event.target.value === 3) || (event.target.value === 4),
                    valorDeclarado: 0
                }
            });
        }

    }

    const handleListPaquetesChange = (newList) => {
        setDataPaquetes(newList)
    }

    const handleListComplementosSATChange = (newList) => {
        setDataComplementosSAT(newList)
    }

    const handleChangeAutoCompleteRemitenteDestinatario = (row) => {
        if(!row.data.m_nIdCP){
            showSuccess("El código postal del remitente no se encuentra en el catálogo.\n Verifique la información en ERP paquetería para continuar.")
            return
        }
        obtenerZonaOperativaByIdCodigoPostal(row.data.m_sCodigoPostal).then(
            ( zonaOperativa ) => {
                console.log(JSON.stringify(zonaOperativa))
                if(props.destinatario){
                    props.soloEntregaSucursal(zonaOperativa.data.length!==0?zonaOperativa.data[0].m_bAplicaEntrega:false)
                }
                setData((data) => ({
                    ...data,
                    id: row.data.m_nIdRemitenteDestinatario,
                    alias: row.data.m_sAlias,
                    nombre: row.data.m_sNombre,
                    /*codigoPostal:
                        {
                            m_nIdCP: row.data.m_nIdCP,
                            m_sCP: row.data.m_sCodigoPostal,
                            m_sColonia: row.data.m_sColonia || "No especificado",
                        },*/
                    origen: zonaOperativa.data.length !== 0  ? {m_nIdCiudad: zonaOperativa.data[0].m_nIdOrigenDestino, m_sCiudad: zonaOperativa.data[0].m_sOrigenDestino} : null,
                    zonaOperativa: zonaOperativa.data.length !== 0 ? zonaOperativa.data[0] : null,
                }));
                setState({ ...state, openDialogRemitentes: false })
                if (zonaOperativa.data.length === 0){
                    showSuccess("El codigo postal del remitente no está registrado en ninguna zona operativa.")
                }

            }
        );
    };

    const handleChangeRemitente = (newData) => {
        setRemitente({
            idRemitente: newData.id,
            aliasRemitente: newData.alias,
            nombreRemitente: newData.nombre,
            origenRemitente: newData.origen,
            zonaOperativaRemitente: newData.zonaOperativa
        })
    };

    const handleRecoleccionCheckboxChange = (event) => {
        // event.preventDefault();
        setData({
            ...data,
            diferenteRecoleccion: !data.diferenteRecoleccion,
        });
    };

    const mostrarDatosRecoleccionDD = (respuesta) => {
        setRecoleccionDD(recoleccionDD => {
            return {
                ...recoleccionDD,
                idPais: respuesta.data.m_nIdPaisRecoleccion || 0,
                pais: respuesta.data.m_sPaisRecoleccion || '',
                idEstado: respuesta.data.m_nIdEstadoRecoleccion || 0,
                estado: respuesta.data.m_sEstadoRecoleccion || '',
                idMunicipio: respuesta.data.m_sCodigoMunicipioRecoleccion || 0,
                municipio: respuesta.data.m_sMunicipioRecoleccion || '',
                codigoPostal: {
                    m_nIdCP: respuesta.data.m_nIdCPDetalleRecoleccion,
                    m_sCP: respuesta.data.m_sCodigoPostalRecoleccion,
                    m_sColonia: respuesta.data.m_sColoniaRecoleccion ? respuesta.data.m_sColoniaRecoleccion : respuesta.data.m_sLocalidadRecoleccion
                },
                domicilio: respuesta.data.m_sDomicilioDetalleRecoleccion,
                detalles: respuesta.data.m_sRecogerEnDetalleRecoleccion,
                datosAdicionales: respuesta.data.m_sDatosAdicionalesDetalleRecoleccion,
                latitud: respuesta.data.m_sLatitud || '',
                longitud: respuesta.data.m_sLongitud || '',
            }
        })
        /*obtenerMunicipiosByIdEstado(respuesta.data.m_nIdEstadoRecoleccion).then(({data}) =>{
            setDataMunicipiosRecoleccionDD(data)
        })*/
        obtenerByIdZonaOperativa(respuesta.data.m_nIdZonaOperativa).then(({data}) => {
            setRecoleccionDD(recoleccionDD => {
                return {
                    ...recoleccionDD,
                    zonaOperativa: data
                }
            })
        })
    }

    const handleOnChangeRecoleccionDD = (newValue) => {
        setRecoleccionDD(recoleccionDD => {
            return{
                ...recoleccionDD,
                idPais: newValue.idPais,
                pais: newValue.pais,
                idEstado: newValue.idEstado,
                estado: newValue.estado,
                idMunicipio: newValue.idMunicipio,
                municipio: newValue.municipio,
                codigoPostal: newValue.codigoPostal,
                zonaOperativa: newValue.zonaOperativa,
                domicilio: newValue.domicilio,
                detalles: newValue.detalles,
                datosAdicionales: newValue.datosAdicionales,
                latitud: newValue.latitud,
                longitud: newValue.longitud,
            }
        });
    }
    const validarDatos = (params) => {
        const status = {valid: true, message: ""}
        if (!params.idRecoleccion > 0){
            status.valid = false
            status.message = "No hay identificador de recolección"
            return status
        }
        if (!params.idCliente > 0){
            status.valid = false
            status.message = "No hay cliente"
            return status
        }
        if (!params.idTipoSeguro > 0){
            status.valid = false
            status.message = "No hay tipo de seguro"
            return status
        }
        if (!params.porcentajeSeguro > 0){
            status.valid = false
            status.message = "No hay porcentaje de seguro"
            return status
        }
        if (!(params.valorDeclarado >= 0)){
            status.valid = false
            status.message = "No hay valor declarado"
            return status
        }
        if (!params.idTipoCobro > 0){
            status.valid = false
            status.message = "No hay tipo de cobro"
            return status
        }
        if (!params.idRemitente > 0){
            status.valid = false
            status.message = "No hay remitente"
            return status
        }
        if (!params.idOrigen > 0){
            status.valid = false
            status.message = "No hay origen"
            return status
        }
        if (params.recoleccionDiferenteDomicilio){
            if (!params.idPais > 0){
                status.valid = false
                status.message = "No hay país"
                return status
            }
            if (!params.idEstado > 0){
                status.valid = false
                status.message = "No hay estado"
                return status
            }
            if (!params.idMunicipio > 0){
                status.valid = false
                status.message = "No hay municipio"
                return status
            }
            if (!params.municipio > 0){
                status.valid = false
                status.message = "No hay municipio"
                return status
            }
            if (!params.idCodigoPostal > 0){
                status.valid = false
                status.message = "No hay código postal"
                return status
            }
            if (!params.calleNumero > 0){
                status.valid = false
                status.message = "No hay domicilio"
                return status
            }
            if (!params.entregarEn > 0){
                status.valid = false
                status.message = "No hay detalles de entrega"
                return status
            }
        }
        if (!params.idZonaOperativaRecoleccion > 0){
            status.valid = false
            status.message = "No hay zona operativa"
            return status
        }
        if (!params.complementosSat.length > 0){
            status.valid = false
            status.message = "No hay complementos SAT"
            return status
        }
        if (!params.conceptosFacturacion.length > 0){
            status.valid = false
            status.message = "No hay conceptos de facturación"
            return status
        }

        return status
    }

    const handleOnClickGuardar = (event) => {
        try {

            let params = {
                "idRecoleccion": props.idRecoleccion,
                "idCliente": data.clientePaga?.m_nIdCliente,
                "idTipoSeguro": data.idTipoSeguro,
                "porcentajeSeguro": data.porcentajeSeguro,
                "valorDeclarado": data.valorDeclarado,
                "observaciones": data.observaciones,
                "idTipoCobro": data.idTipoCobro,
                "idRemitente": remitente.idRemitente,
                "idOrigen": remitente.origenRemitente?.m_nIdCiudad,
                "recoleccionDiferenteDomicilio": data.diferenteRecoleccion,
                "paquetes": dataPaquetes.map(i => ({
                    "cantidad": i.m_nCantidad,
                    "idProducto": i.m_nIdProducto,
                    "idEmbalaje": i.m_nIdTipoEmbalaje,
                    "largo": i.m_rLargo,
                    "alto": i.m_rAlto,
                    "ancho": i.m_rAncho,
                    "peso": i.m_rPeso,
                    "volumen": i.m_rVolumen,
                    "descripcion": i.m_sDescripcion,
                    "observaciones": i.m_sObservaciones
                })),
                "complementosSat": dataComplementosSAT.map(i => ({
                    "cantidad": i.cantidad,
                    "peso": i.peso,
                    "claveProductoServicio": i.claveProducto,
                    "claveUnidadMedida": i.claveUnidad,
                    "esMaterialPeligroso": i.esPeligroso,
                    "claveMaterialPeligroso": i.claveMaterialPeligroso,
                    "claveEmbalaje": i.claveEmbalaje,
                    "descripcionEmbalaje": i.descripcionEmbalajeSAT,
                    "claveFraccionArancelaria": i.claveFraccion
                })),
                "conceptosFacturacion": data.conceptosFacturacion.map(i => ({
                    "idConceptoFacturacion": i.idConcepto,
                    "importe": i.importe,
                    "importeIva": i.importeIVA,
                    "importeRetencion": i.importeRet,
                    "idImpuestoIva": i.traslada,
                    "idImpuestoRetencion": i.retiene,
                    "descuento": i.descuento
                })),
            }
            if (params.recoleccionDiferenteDomicilio){
                params.idPais= recoleccionDD.idPais
                params.idEstado= recoleccionDD.idEstado
                params.idMunicipio= recoleccionDD.idMunicipio
                params.municipio= recoleccionDD.municipio
                params.idCodigoPostal= recoleccionDD.codigoPostal?.m_nIdCP
                params.calleNumero= recoleccionDD.domicilio
                params.entregarEn= recoleccionDD.detalles
                params.datosAdicionales= recoleccionDD.datosAdicionales
                params.idZonaOperativaRecoleccion= recoleccionDD.zonaOperativa?.m_nIdZona
            }else{
                params.idZonaOperativaRecoleccion= remitente.zonaOperativaRemitente?.m_nIdZona
            }
            let status = validarDatos(params)
            if (!status.valid){
                showSuccess(status.message)
                return
            }
            console.log(params)
            props.onSubmitData(params)
        }catch (err){
            showSuccess("Hubo un error al procesar la informacion intente más tarde")
        }
    }

    return(
        <div>
            <Dialog open={state.openDialog} onClose={() => setState({...state, openDialog: false})} fullWidth maxWidth="md">
                <DialogContent>
                    <DialogTableClientes dialogVisible={(isVisible) => { setState({ ...state,openDialog: isVisible })}}
                                         handlePatrocinadorSelected={handlePatrocinadorSelected}/>
                </DialogContent>
            </Dialog>
            <Dialog
                open={state.openDialogRemitentes}
                onClose={() => setState({ ...state, openDialogRemitentes: false })}
                fullWidth
                maxWidth="md"
            >
                <DialogContent>
                    <DialogTableRemDes
                        dialogVisible={(isVisible) => { setState({ ...state,openDialogRemitentes: isVisible })}}
                        openDialog={state.openDialogRemitentes}
                        handleChangeAutoCompleteRemitenteDestinatario={handleChangeAutoCompleteRemitenteDestinatario}
                    />
                </DialogContent>
            </Dialog>
            <section id={"informacionGeneral"}>
                <Grid container spacing={1}>
                    <Grid item xs={12} sm={2}>
                        <TextField variant="outlined" margin="dense"
                                   className="form-control"
                                   label="Folio"
                                   value={data.folio}
                                   readOnly
                                   disabled
                        />
                    </Grid>
                    <Grid item xs={12} sm={10}/>
                    <Grid item xs={12} sm>
                        <TextField
                            variant="outlined"
                            label="Responsable de pago"
                            margin="dense"
                            required
                            value={data.clientePaga?.m_sNombreFiscal}
                            error={data.clientePaga?.m_bCreditoVencido && !data.clientePaga?.m_bSinCredito}
                            helperText={ (data.clientePaga?.m_bCreditoVencido && !data.clientePaga?.m_bSinCredito) ? "El cliente presenta saldo vencido. Días de crédito: " + data.clientePaga.m_nDiasCredito : ""}
                            placeholder={"No. Cliente: Nombre fiscal"}
                            InputLabelProps={{shrink: true}}
                            onClick={()=>{ setState({ ...state, openDialog: true})}}
                        />
                    </Grid>
                    <Grid item xs={12} sm>
                        <TextField
                            name="idTipoSeguro"
                            select
                            label="Tipo seguro"
                            value={data.idTipoSeguro}
                            onChange={handleChange}
                            variant="outlined"
                        >
                            {dataTiposSeguro.map((option) => (
                                <MenuItem key={option.m_nIdTipoSeguro} value={option.m_nIdTipoSeguro}>
                                    {option.m_sDescripcion}
                                </MenuItem>
                            ))}
                        </TextField>
                    </Grid>
                    <Grid item xs={12} sm>
                        <TextField
                            variant="outlined" margin="dense"
                            className="form-control"
                            type="number"
                            label="Porcentaje de seguro"
                            onChange={handleChange}
                            value={data.porcentajeSeguro}
                            placeholder="%"
                            name="porcentajeSeguro"
                            InputProps={{endAdornment: <InputAdornment position="start">%</InputAdornment>}}
                        />
                    </Grid>
                    <Grid item xs={12} sm>
                        <TextField
                            variant="outlined" margin="dense"
                            className="form-control"
                            type="number"
                            label="Valor Declarado"
                            onChange={handleChange}
                            value={data.valorDeclarado}
                            placeholder="$"
                            name="valorDeclarado"
                            InputProps={{startAdornment: <InputAdornment position="start">$</InputAdornment>}}
                        />
                    </Grid>
                    <Grid item xs={12} sm>
                        <TextField
                            variant="outlined"
                            margin="dense"
                            label="Observaciones"
                            value={data.observaciones}
                            onChange={handleChange}
                            name="observaciones"
                            InputLabelProps={{shrink: true}}
                        />
                    </Grid>
                    <Grid item xs={12} sm>
                        <TextField
                            variant="outlined" margin="dense"
                            select
                            label="Tipo de cobro"
                            value={data.idTipoCobro}
                            name={"idTipoCobro"}
                            onChange={handleChange}
                        >
                            {dataTipoCobro.filter(item => configuraciones.idsTiposCobroSeleccionArray.find(i => i == item.m_nCodigo)).map((tipoCobro) => (
                                <MenuItem
                                    key={tipoCobro.m_nIdTipoCobro}
                                    value={tipoCobro.m_nIdTipoCobro}
                                >
                                    {tipoCobro.m_sDescripcion}
                                </MenuItem>
                            ))}
                        </TextField>
                    </Grid>
                </Grid>
            </section>
            <section id={"paquetes"}>
                <Paquetes
                    dataPaquetes={dataPaquetes}
                    onChangeList={handleListPaquetesChange}
                    // disabled={state.agregar === "Consultar" || state.recoleccionConEmbarque}
                    cliente={data.clientePaga}
                    limpiarProducto={configuraciones.limpiarProducto}
                />
            </section>
            <section id={"complementos"}>
                <ComplementosSAT
                    dataList={dataComplementosSAT}
                    onChangeList={handleListComplementosSATChange}
                />
            </section>
            <section id={"remitente"}>
                <h2>Remitente</h2>
                <span>No se modificará el punto de recolección.</span>
                <br/>
                <br/>
                <RemitentesDestinatarios
                    remitente={true}
                    componentePadre={"CANCELAR_SAT"}
                    handleDataChange={handleChangeRemitente}
                    dataPadreConsulta={dataRecoleccionConsulta}
                    dataEstados={[]}
                />
            </section>

            <section id={"recoleccionDiferenteDomicilio"}>
                <div style={{width:'70%'}}>
                    <label className="checkbox">
                        <input
                            onChange={handleRecoleccionCheckboxChange}
                            className="form-control"
                            checked={data.diferenteRecoleccion}
                            type="checkbox"
                            style={{height: "20px"}}
                            id="diferenteRecoleccion"
                        />
                        <i/>
                        Recolección en Diferente Domicilio
                    </label>
                </div>

                {data.diferenteRecoleccion &&
                    <div className="widget-wrap" id="detallesRecoleccion">
                        <div>
                            <div className="widget-header">
                                <h2>Detalles de la Recolección</h2>
                            </div>
                            <div className="widget-container">
                                <div className="widget-content">
                                    <div className="row">
                                        <DiferenteDomicilioForm
                                            value={recoleccionDD}
                                            onChange={handleOnChangeRecoleccionDD}
                                            disabled={false}
                                            requiered={false}
                                            listadoEstadosLocal={true}
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                }
            </section>
            <section id={"cotizador"}>
                <Cotizador embarque={data}
                           // disabled={state.agregar === "Consultar"}
                           remitente={remitente}
                           destinatario={data}
                           onChangeConceptosList={(list) => setData({...data, conceptosFacturacion: list})}
                           conceptos={data.conceptosFacturacion}
                           saveIdCotizacion={(idCotizacion) => setData({...data, idCotizacion: idCotizacion})}
                           recoleccion={true}
                           errores={erroresCotizacion}
                           validarErrores={(list) => setErroresCotizacion(list)}
                           recoleccionDiferenteDom={recoleccionDD}
                           mostrarCotizadorRec={() => {}}
                           entregaDiferenteDom={data}
                           setCalculoTarifa={() => {}}
                           paquetes={dataPaquetes.map(p =>({
                               Tipo: p.m_nIdTipo,
                               Peso: p.m_rPeso,
                               Largo: p.m_rLargo,
                               Ancho: p.m_rAncho,
                               Alto:p.m_rAlto,
                               Volumen:p.m_rVolumen,
                               IdTipoEmpaque:p.m_nIdTipoEmbalaje,
                               Activo: 1,
                               ctd:p.m_nCantidad,
                               IdProducto:p.m_nIdProducto
                           }))} />
            </section>

            <Grid container spacing={1}>
                <Grid item xs>
                    <Button
                        fullWidth color={"secondary"} variant={"contained"} style={{color: "white"}}
                        onClick={props.onCancel}>
                        Cancelar
                    </Button>
                </Grid>
                <Grid item xs>
                    <Button fullWidth
                            className="btn btn-primary primary-btn"
                            onClick={handleOnClickGuardar}
                    >
                        GUARDAR RECOLECCIÓN
                    </Button>

                </Grid>
            </Grid>
        </div>
    )

}
