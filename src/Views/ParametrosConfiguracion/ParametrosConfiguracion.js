import React, {useState, useEffect} from "react";
import Noty from "noty";
import Cabecera from "../../Components/Template/Cabecera";
import BarraLateralIzquierda from "../../Components/Template/BarraLateralIzquierda";
import {
    Box,
    Button,
    Checkbox,
    FormControl, Grid,
    InputLabel, MenuItem,
    Paper,
    Select,
    Tab,
    Tabs,
    TextField, Tooltip,
    Typography
} from "@mui/material";
import {
    obtenerEstatusRecoleccion,
    obtenerEstatusEmbarque,
    obtenerEstatusGuia,
} from "../../Util/Contexts/EstatusContext";
import {validarDerecho} from "../../Util/Util"
import {obtenerMonedas} from "../../Util/Contexts/MonedaContext";
import {obtenerTipoCambio} from "../../Util/Contexts/TipoCambioContext";
import {
    obtenerParametrosConfiguracion,
    modificarParametrosConfiguracion
} from "../../Util/Contexts/ParametrosConfiguracionContext";
import { styled } from '@mui/material/styles';
import {TabContext, TabPanel} from "@mui/lab";
import {DataGrid} from "@mui/x-data-grid";
import {dataGridLocaleText} from "../../Constants";
import {obtenerTipoCobro} from "../../Util/Contexts/TipoCobroContext";
import Correos from "./Correos";
import {EditorState, ContentState, convertToRaw} from "draft-js";
import draftToHtml from 'draftjs-to-html';
import htmlToDraft from 'html-to-draftjs';
import {obtenerConceptosFacturacion} from "../../Util/Contexts/ConceptosFacturacionContext";
// Import FilePond styles
import 'filepond/dist/filepond.min.css'
import DialogTiposDocumentoSucursal from "./DialogTiposDocumentoSucursal";
const PREFIX = 'ParametrosConfiguracion';

const classes = {
    subtitulo: `${PREFIX}-subtitulo`
};

const Root = styled('div')({
    [`& .${classes.subtitulo}`]: {
        font: "normal normal normal 16px/17px Calibri",
        color: "black",
        letterSpacing: "0.21px",
        padding: "5px",
    },
});

function showSuccess(mensaje) {
    new Noty({
        type: "information",
        layout: "topCenter",
        text: mensaje,
        timeout: "3000",
    }).show();
}

function ParametrosConfiguracion() {

    //--------------------------------------------------VARIABLES--------------------------------------------------------
    const [dataEstatusRecoleccion, setEstatusRecoleccion] = React.useState([]);
    const [dataEstatusEmbarque, setEstatusEmbarque] = React.useState([]);
    const [dataMonedaEmbarque, setMonedaEmbarque] = React.useState([])
    const [dataTipoCambioEmbarque, setTipoCambioEmbarque] = React.useState([])
    const [dataTipoCobro, setTipoCobro] = React.useState([])
    const [dataEstatusGuia, setEstatusGuia] = React.useState([])
    const [tabIndex, setTabIndex] = React.useState('0');
    const columnasTipoCobro = [
        {
            headerName: "Descripción",
            field: 'm_sDescripcion',
            width: 200,
        }
    ]
    const [dataConceptos, setDataConceptos] = useState([]);
    const [dialogTipoDocumento, setDialogTipoDocumento] = useState({
        open: false,
        seleccion: {
            idSucursal: 0,
            sucursal: '',
            idTipoDocumento: 0,
            documento: 'SIN DEFINIR'
        }

    })
    //variables de valores por defecto
    const [configuraciones, setConfiguraciones] = React.useState({
        estatusRecoleccion: 0,
        estatusEmbarque: 0,
        monedaPredeterminadaEmbarque: 0,
        tipoCambioEmbarque: 0,
        estatusGuia: 0,
        tipoTarifa: 2,
        cobrarConceptoCarga: false,
        cobrarConceptoDescarga: false,
        cobrarCargaDescargaDisabled: false,
        cobrarCita: false,
        costoCita: "0",
        detectarTipoCobro: false,
        tipoCobro: 0,
        limpiarProducto: false,
        idsTiposCobroSeleccionArray: [],
        idsTiposCobroSeleccionString: '',
        idConceptoFlete: 0,
        idConceptoCarga: 0,
        idConceptoDescarga: 0,
        idConceptoRecoleccion: 0,
        idConceptoEntrega: 0,
        idConceptoSeguro: 0,
        idConceptoCita: 0,
        validarInforme: false,
        timbradoPruebaGuia: true,
        validarTimbradoIngreso: false,
        plantillaImportarEmbarquesBase64: '',
        plantillaImportarEmbarquesNombreArchivo: '',
        modificarValorEmbarque:false,
        foliosPorSucursal: false,
        fijarCapturaValorDeclarado: false,
        documentos:[],
        factorConversion: 0.0,
        imprimirEtiquetasIndividuales:false,
        horasLimiteEntregasUltimaMilla: 23,
        porcentualSeguroDefecto:0,
        cobroPorcentual: false
    })
    //--------------------------------------------------HANDLERS---------------------------------------------------------
    const handleChange = (event) => {
        if (event.target.name === "tipoTarifa") {
            if (parseInt(event.target.value) === 3) {
                onSeleccionaTarifaRegion()
            } else {
                setConfiguraciones((config) => {
                    return {
                        ...config,
                        cobrarConceptoCarga: false,
                        cobrarConceptoDescarga: false,
                        cobrarCargaDescargaDisabled: false
                    }
                })
            }
        }
        if (event.target.name==='porcentualSeguroDefecto')
        {
            if(event.target.value>100 || event.target.value<0){
                showSuccess('El porcentual no puede tener valor menor a 0 o mayor a 100')
                return
            }
        }
        setConfiguraciones((config) => {
            return {
                ...config,
                [event.target.name]: event.target.value
            }
        })
    }

    const onSeleccionaTarifaRegion = () => {
        setConfiguraciones((config) => {
            return {
                ...config,
                cobrarConceptoCarga: false,
                cobrarConceptoDescarga: false,
                cobrarCargaDescargaDisabled: true
            }
        })
    }

    const handleChecked = (event) => {
        setConfiguraciones((config) => {
            return {
                ...config,
                [event.target.name]: event.target.checked
            }
        });
    };

    function onSubmit() {
        let params = {
            estatusRecoleccion: configuraciones.estatusRecoleccion,
            estatusEmbarque: configuraciones.estatusEmbarque,
            monedaEmbarque: configuraciones.monedaPredeterminadaEmbarque,
            tipoCambioEmbarque: configuraciones.tipoCambioEmbarque,
            estatusGuia: configuraciones.estatusGuia,
            tipoTarifaTarifas: configuraciones.tipoTarifa,
            costoCitaTarifas: configuraciones.cobrarCita ? configuraciones.costoCita : 0,
            cobrarConceptoCarga: configuraciones.cobrarConceptoCarga,
            cobrarConceptoDescarga: configuraciones.cobrarConceptoDescarga,
            cobrarCita: configuraciones.cobrarCita,
            detectarTipoCobro: configuraciones.detectarTipoCobro,
            limpiarProducto: configuraciones.limpiarProducto,
            tipoCobro: configuraciones.tipoCobro,
            tiposCobroActivos: configuraciones.idsTiposCobroSeleccionString,
            correoFacturacionViaje: draftToHtml(convertToRaw(configuraciones.correoFacturaViaje.getCurrentContent())),
            correoFacturacionUltimaMilla: draftToHtml(convertToRaw(configuraciones.correoFacturaUltimaMilla.getCurrentContent())),
            idConceptoFlete: configuraciones.idConceptoFlete,
            idConceptoCarga: configuraciones.idConceptoCarga,
            idConceptoDescarga: configuraciones.idConceptoDescarga,
            idConceptoRecoleccion: configuraciones.idConceptoRecoleccion,
            idConceptoEntrega: configuraciones.idConceptoEntrega,
            idConceptoSeguro: configuraciones.idConceptoSeguro,
            idConceptoCita: configuraciones.idConceptoCita,
            validarInforme: configuraciones.validarInforme,
            timbradoPruebaGuia: configuraciones.timbradoPruebaGuia,
            validarTimbrado: configuraciones.validarTimbrado,
            idComplemento: configuraciones.idComplemento,
            validarTimbradoIngreso: configuraciones.validarTimbradoIngreso,
            modificarValorEmbarque: configuraciones.modificarValorEmbarque,
            tipoTimbrado: configuraciones.tipoTimbrado,
            plantillaImportarEmbarquesBase64: "",
            plantillaImportarEmbarquesNombreArchivo: '',
            documentos: configuraciones.documentos,
            imprimirEtiquetasIndividuales:configuraciones.imprimirEtiquetasIndividuales,
            horasLimiteEntregasUltimaMilla:configuraciones.horasLimiteEntregasUltimaMilla,
            porcentualSeguroDefecto:configuraciones.porcentualSeguroDefecto
        }
        modificarParametrosConfiguracion(params)
            .then((respuesta) => {
                showSuccess(respuesta.data);
                getParametrosConfiguracion()
            })
            .catch((err) => {
                console.log(err);
                showSuccess(err);
            });
    }

    async function getParametrosConfiguracion() {
        obtenerParametrosConfiguracion().then(respuesta => {
            setConfiguraciones((config) => {
                return {
                    ...config,
                    estatusRecoleccion: respuesta.data.EstatusRecoleccion,
                    estatusEmbarque: respuesta.data.EstatusEmbarque,
                    monedaPredeterminadaEmbarque: respuesta.data.MonedaEmbarque,
                    tipoCambioEmbarque: respuesta.data.TipoCambioEmbarque,
                    estatusGuia: respuesta.data.EstatusGuia,
                    tipoTarifa: respuesta.data.TipoTarifaTarifas,
                    cobrarConceptoCarga: respuesta.data.CobrarConceptoCarga,
                    cobrarConceptoDescargaa: respuesta.data.CobrarConceptoDescarga,
                    cobroPorcentual: respuesta.data.CobroPorcentual,
                    cobrarCita: respuesta.data.esCobro,
                    costoCita: respuesta.data.CobroCitaTarifas || 0,
                    detectarTipoCobro: respuesta.data.DetectarTipoCobro,
                    limpiarProducto: respuesta.data.LimpiarProducto,
                    tipoCobro: respuesta.data.TipoCobro,
                    idsTiposCobroSeleccionString: respuesta.data.TiposCobroActivos,
                    idsTiposCobroSeleccionArray: respuesta.data.TiposCobroActivos ? respuesta.data.TiposCobroActivos.split(',') : [],
                    correoFacturaViaje: EditorState.createWithContent(
                        ContentState.createFromBlockArray(htmlToDraft(respuesta.data.CorreoFacturaViaje))),
                    correoFacturaUltimaMilla: EditorState.createWithContent(
                        ContentState.createFromBlockArray(htmlToDraft(respuesta.data.CorreoFacturaUltimaMilla))),
                    idConceptoFlete: respuesta.data.IdConceptoFlete || 0,
                    idConceptoCarga: respuesta.data.IdConceptoCarga || 0,
                    idConceptoDescarga: respuesta.data.IdConceptoDescarga || 0,
                    idConceptoRecoleccion: respuesta.data.IdConceptoRecoleccion || 0,
                    idConceptoEntrega: respuesta.data.IdConceptoEntrega || 0,
                    idConceptoSeguro: respuesta.data.IdConceptoSeguro || 0,
                    idConceptoCita: respuesta.data.IdConceptoCita || 0,
                    validarInforme: respuesta.data.validarQR,
                    timbradoPruebaGuia: respuesta.data.TimbradoPruebaGuia,
                    validarTimbrado: respuesta.data.ValidarTimbrado,
                    idComplemento: respuesta.data.IdComplemento,
                    validarTimbradoIngreso: respuesta.data.ValidarTimbradoIngreso,
                    modificarValorEmbarque: respuesta.data.ModificarValorEmbarque,
                    tipoTimbrado: respuesta.data.TipoTimbrado,
                    plantillaImportarEmbarquesBase64: "",
                    plantillaImportarEmbarquesNombreArchivo: "",
                    fijarCapturaValorDeclarado: respuesta.data.FijarCapturaValorDeclarado,
                    foliosPorSucursal: respuesta.data.FoliosPorSucursal,
                    documentos: respuesta.data.documentos || [],
                    factorConversion: respuesta.data.FactorConversion,
                    imprimirEtiquetasIndividuales:respuesta.data.ImprimirEtiquetasIndividuales,
                    horasLimiteEntregasUltimaMilla:respuesta.data.HorasLimiteEntregasUltimaMilla,
                    porcentualSeguroDefecto:respuesta.data.PorcentualSeguroDefecto,
                }
            })

            if (parseInt(respuesta.data.TipoTarifaTarifas) === 3) {
                onSeleccionaTarifaRegion()
            }
        })
    }

    const handleTab = (event, newValue) => {
        setTabIndex(newValue);
    };

    const handleTiposCobroSeleccionados = (e) => {
        setConfiguraciones((config) => {
            return {
                ...config,
                idsTiposCobroSeleccionArray: e,
                idsTiposCobroSeleccionString: e.join(),
            }
        })
    };

    //--------------------------------------------------SERVICIOS--------------------------------------------------------
    async function getAllEstatusRecoleccion() {
        obtenerEstatusRecoleccion().then((respuesta) => {
            setEstatusRecoleccion(respuesta.data);
        });
    }

    async function getAllEstatusEmbarque() {
        obtenerEstatusEmbarque().then((respuesta) => {
            setEstatusEmbarque(respuesta.data);
        });
    }

    async function getAllEstatusGuia() {
        obtenerEstatusGuia().then((respuesta) => {
            setEstatusGuia(respuesta.data);
        });
    }

    async function getAllTipoMoneda() {
        obtenerMonedas().then((respuesta) => {
            setMonedaEmbarque(respuesta.data);
        });
    }

    async function getTipoCambio() {
        obtenerTipoCambio().then(respuesta => {
            setTipoCambioEmbarque(respuesta.data)
        });
    }

    async function getTipoCobro() {
        obtenerTipoCobro().then(respuesta => {
            setTipoCobro(respuesta.data)
        });
    }

    async function getConceptosFacturacion() {
        obtenerConceptosFacturacion().then(respuesta => {
            setDataConceptos(respuesta.data);
        });
    }

    function modificarCorreo(data, variable) {
        setConfiguraciones({...configuraciones, [variable]: data})
    }

    const esConceptoDisponible = (c, parent) => {
        /**No se usa !== para que convierta string a int y pueda comparar.*/
        switch (parent) {
            case 'idConceptoFlete':
                return c.m_nIdConceptosFacturacion != configuraciones.idConceptoCarga
                    && c.m_nIdConceptosFacturacion != configuraciones.idConceptoDescarga
                    && c.m_nIdConceptosFacturacion != configuraciones.idConceptoRecoleccion
                    && c.m_nIdConceptosFacturacion != configuraciones.idConceptoEntrega
                    && c.m_nIdConceptosFacturacion != configuraciones.idConceptoSeguro
                    && c.m_nIdConceptosFacturacion != configuraciones.idConceptoCita
            case 'idConceptoCarga':
                return c.m_nIdConceptosFacturacion != configuraciones.idConceptoFlete
                    && c.m_nIdConceptosFacturacion != configuraciones.idConceptoDescarga
                    && c.m_nIdConceptosFacturacion != configuraciones.idConceptoRecoleccion
                    && c.m_nIdConceptosFacturacion != configuraciones.idConceptoEntrega
                    && c.m_nIdConceptosFacturacion != configuraciones.idConceptoSeguro
                    && c.m_nIdConceptosFacturacion != configuraciones.idConceptoCita
            case 'idConceptoDescarga':
                return c.m_nIdConceptosFacturacion != configuraciones.idConceptoFlete
                    && c.m_nIdConceptosFacturacion != configuraciones.idConceptoCarga
                    && c.m_nIdConceptosFacturacion != configuraciones.idConceptoRecoleccion
                    && c.m_nIdConceptosFacturacion != configuraciones.idConceptoEntrega
                    && c.m_nIdConceptosFacturacion != configuraciones.idConceptoSeguro
                    && c.m_nIdConceptosFacturacion != configuraciones.idConceptoCita
            case 'idConceptoRecoleccion':
                return c.m_nIdConceptosFacturacion != configuraciones.idConceptoFlete
                    && c.m_nIdConceptosFacturacion != configuraciones.idConceptoCarga
                    && c.m_nIdConceptosFacturacion != configuraciones.idConceptoDescarga
                    && c.m_nIdConceptosFacturacion != configuraciones.idConceptoEntrega
                    && c.m_nIdConceptosFacturacion != configuraciones.idConceptoSeguro
                    && c.m_nIdConceptosFacturacion != configuraciones.idConceptoCita
            case 'idConceptoEntrega':
                return c.m_nIdConceptosFacturacion != configuraciones.idConceptoFlete
                    && c.m_nIdConceptosFacturacion != configuraciones.idConceptoCarga
                    && c.m_nIdConceptosFacturacion != configuraciones.idConceptoDescarga
                    && c.m_nIdConceptosFacturacion != configuraciones.idConceptoRecoleccion
                    && c.m_nIdConceptosFacturacion != configuraciones.idConceptoSeguro
                    && c.m_nIdConceptosFacturacion != configuraciones.idConceptoCita
            case 'idConceptoSeguro':
                return c.m_nIdConceptosFacturacion != configuraciones.idConceptoFlete
                    && c.m_nIdConceptosFacturacion != configuraciones.idConceptoCarga
                    && c.m_nIdConceptosFacturacion != configuraciones.idConceptoDescarga
                    && c.m_nIdConceptosFacturacion != configuraciones.idConceptoRecoleccion
                    && c.m_nIdConceptosFacturacion != configuraciones.idConceptoEntrega
                    && c.m_nIdConceptosFacturacion != configuraciones.idConceptoCita
            case 'idConceptoCita':
                return c.m_nIdConceptosFacturacion != configuraciones.idConceptoFlete
                    && c.m_nIdConceptosFacturacion != configuraciones.idConceptoCarga
                    && c.m_nIdConceptosFacturacion != configuraciones.idConceptoDescarga
                    && c.m_nIdConceptosFacturacion != configuraciones.idConceptoRecoleccion
                    && c.m_nIdConceptosFacturacion != configuraciones.idConceptoEntrega
                    && c.m_nIdConceptosFacturacion != configuraciones.idConceptoSeguro
            default:
                return c.m_nIdConceptosFacturacion != configuraciones.idConceptoFlete
                    && c.m_nIdConceptosFacturacion != configuraciones.idConceptoCarga
                    && c.m_nIdConceptosFacturacion != configuraciones.idConceptoDescarga
                    && c.m_nIdConceptosFacturacion != configuraciones.idConceptoRecoleccion
                    && c.m_nIdConceptosFacturacion != configuraciones.idConceptoEntrega
                    && c.m_nIdConceptosFacturacion != configuraciones.idConceptoSeguro

        }

    }

    const handleShowEditTipoDocumento = (row) => {
        setDialogTipoDocumento({
            ...dialogTipoDocumento,
            open: true,
            seleccion: row,
        })
    }

    const handleOnCloseDialogTipoDocumento = (data) => {
        try {
            let array = [...configuraciones.documentos]
            let index = array.findIndex((obj => obj.idSucursal === data.idSucursal))
            array[index] = data
            setConfiguraciones({
                ...configuraciones,
                documentos: array
            })
            setDialogTipoDocumento({
                ...dialogTipoDocumento,
                open: false,
                seleccion: {
                    idSucursal: 0,
                    sucursal: '',
                    idTipoDocumento: 0,
                    documento: 'SIN DEFINIR'
                }
            })
        }catch (e) {
            console.log(e)
        }
    }

//--------------------------------------------------USE EFFECTS--------------------------------------------------------
    useEffect(value => {
        getParametrosConfiguracion()
        getAllEstatusRecoleccion()
        getAllEstatusEmbarque()
        getAllTipoMoneda()
        getTipoCambio()
        getTipoCobro()
        getAllEstatusGuia()
        getConceptosFacturacion()
    }, [])

    return (
        <Root>
            <DialogTiposDocumentoSucursal open={dialogTipoDocumento.open} onClose={handleOnCloseDialogTipoDocumento}
                                          value={dialogTipoDocumento.seleccion}/>

            <header className="topbar clearfix">
                <Cabecera titulo={"Parámetros de\nConfiguración"}>
                <div className="page-header">
                        <ul className="list-page-breadcrumb">
                            <li>
                                <a href="/Catalogos" className="color-mapeo">
                                    Catálogos <i className="zmdi zmdi-chevron-right"/>
                                </a>
                            </li>
                            <li className="active-page">Parametros Configuración</li>
                        </ul>
                    </div>
                </Cabecera>
            </header>
            <aside className="iconic-leftbar">
                <BarraLateralIzquierda/>
            </aside>
            <TabContext value={tabIndex}>
                <Paper square>
                    <Tabs
                        value={tabIndex}
                        indicatorColor="primary"
                        textColor="primary"
                        //variant="fullWidth"
                        onChange={handleTab}
                        centered
                    >
                        <Tab style={{fontSize:"1em", width: "9%"}} size={"medium"} label="General" value="0"/>
                        <Tab style={{fontSize:"1em", width: "9%"}} label="Embarque" value="1"/>
                        <Tab style={{fontSize:"1em", width: "9%"}} label="Recolección" value="2"/>
                        <Tab style={{fontSize:"1em", width: "9%"}} label="Guía" value="3"/>
                        <Tab style={{fontSize:"1em", width: "9%"}} label="Tarifas" value="4"/>
                        <Tab style={{fontSize:"1em", width: "9%"}} label="Correos" value="5"/>
                        <Tab style={{fontSize:"1em", width: "9%"}} label="Facturación" value="6"/>
                    </Tabs>
                </Paper>
                <section className="main-container">
                    <div className="container-fluid">
                        <TabPanel value="0">
                            <Box display="flex" p={1} my={0.5} bgcolor="background.paper"
                                 flexDirection="column">
                                <Box display="flex" p={1} my={0.5} flexDirection="column">
                                    <Box width="50%" display="flex">
                                        <Box width="40%" p={1} my={0.5}>
                                            <div className={classes.subtitulo}>Folios por sucursal</div>
                                        </Box>
                                        <Box width="60%" p={1} my={0.5}>
                                            <Checkbox
                                                checked={configuraciones.foliosPorSucursal}
                                                disabled
                                                color="primary"
                                                style={{transform: "scale(2)"}}
                                                inputProps={{'aria-label': 'primary checkbox'}}
                                            />
                                        </Box>
                                    </Box>
                                </Box>
                                <Box display="flex" p={1} my={0.5} flexDirection="column">
                                    <Box width="50%" display="flex">
                                        <Box width="40%" p={1} my={0.5}>
                                            <div className={classes.subtitulo}>Limitar tiempo entregas</div>
                                        </Box>
                                        <Box width="50" p={1} my={0.5}>
                                            <TextField
                                                type={"number"}
                                                value={configuraciones.horasLimiteEntregasUltimaMilla}
                                                variant="outlined"
                                                size="small"
                                                InputProps={{ inputProps: { min: 1,step: 1 } }}
                                                label="Horas"
                                                onChange={handleChange}
                                                name="horasLimiteEntregasUltimaMilla"
                                            />
                                        </Box>
                                    </Box>
                                </Box>

                                <Box margin={"0 auto"}>
                                    <Button disabled={!validarDerecho(9101409)} variant="contained"
                                            style={{width: "100px", fontSize:"1em"}} color="primary" onClick={onSubmit}>
                                        Modificar
                                    </Button>
                                </Box>
                            </Box>
                        </TabPanel>
                        <TabPanel value="1">
                            <Box display="flex" p={1} my={0.5} bgcolor="background.paper"
                                 flexDirection="column">
                                <Box width="40%" p={1} my={0.5} display="flex">
                                    <Box width="40%" p={1} my={0.5}>
                                        <div className={classes.subtitulo}>Estatus por defecto</div>
                                    </Box>
                                    <Box width="60%" p={1} my={0.5}>
                                        <FormControl size="small" fullWidth variant="outlined" width="25%">
                                            <InputLabel id="idEmbarqueLabel">Estatus</InputLabel>
                                            <Select
                                                labelId="estatusEmbarqueLabel"
                                                required
                                                onChange={handleChange}
                                                value={configuraciones.estatusEmbarque}
                                                label="Estatus"
                                                id="estatusEmbarque"
                                                name="estatusEmbarque"
                                                InputLabelProps={{shrink: true}}
                                            >
                                                {dataEstatusEmbarque.map((estatus) => (
                                                    <MenuItem key={estatus.m_nIdEstatusEmbarque}
                                                            value={estatus.m_nIdEstatusEmbarque}
                                                    >
                                                        {estatus.m_sEstatus}
                                                    </MenuItem>
                                                ))}
                                            </Select>
                                        </FormControl>
                                    </Box>
                                </Box>
                                <Box width="40%" p={1} my={0.5} display="flex">
                                    <Box width="40%" p={1} my={0.5}>
                                        <div className={classes.subtitulo}>Moneda predeterminada</div>
                                    </Box>
                                    <Box width="60%" p={1} my={0.5}>
                                        <FormControl fullWidth variant="outlined" size="small">
                                            <InputLabel id="idMonedaLabel">Moneda</InputLabel>
                                            <Select
                                                labelId={"idMonedaLabel"}
                                                label={"Moneda"}
                                                name="monedaPredeterminadaEmbarque"
                                                required
                                                onChange={handleChange}
                                                value={configuraciones.monedaPredeterminadaEmbarque}
                                                id="monedaPredeterminadaEmbarque"
                                                InputProps={{
                                                    name: "monedaPredeterminadaEmbarque"
                                                }}
                                                InputLabelProps={{shrink: true}}
                                            >
                                                {dataMonedaEmbarque.map((moneda) => (
                                                    <MenuItem
                                                        key={moneda.m_nIdMoneda}
                                                        value={moneda.m_nIdMoneda}
                                                    >
                                                        {moneda.m_sMoneda}
                                                    </MenuItem>
                                                ))}
                                            </Select>
                                        </FormControl>
                                    </Box>
                                </Box>
                                <Box width="40%" p={1} my={0.5} display="flex">
                                    <Box width="40%" p={1} my={0.5}>
                                        <div className={classes.subtitulo}>Tipo de cambio por defecto</div>
                                    </Box>
                                    <Box width="60%" p={1} my={0.5}>
                                        <FormControl fullWidth
                                                     variant="outlined"
                                                     required
                                                     size="small">
                                            <InputLabel id="tipoCambioLabel">Tipo de
                                                Cambio</InputLabel>
                                            <Select
                                                labelId="tipoCambioLabel"
                                                label="Tipo de Cambio"
                                                name="tipoCambioEmbarque"
                                                value={configuraciones.tipoCambioEmbarque}
                                                id="tipoCambioEmbarque"
                                                onChange={handleChange}
                                                InputLabelProps={{shrink: true}}
                                            >
                                                {dataTipoCambioEmbarque.map((cambio) => (
                                                    <MenuItem
                                                        key={cambio.m_nIdTipoCambio}
                                                        value={cambio.m_nIdTipoCambio}
                                                    >
                                                        {cambio.m_cTipoCambio}
                                                    </MenuItem>
                                                ))}
                                            </Select>
                                        </FormControl>
                                    </Box>
                                </Box>
                                <Box width="40%" p={1} my={0.5} display="flex">
                                    <Box width="40%" p={1} my={0.5}>
                                        <div className={classes.subtitulo}>Tipo de cobro por defecto</div>
                                    </Box>
                                    <Box width="60%" p={1} my={0.5}>

                                        <FormControl fullWidth
                                                     variant="outlined"
                                                     required
                                                     size="small">
                                            <InputLabel id="tipoCobroLabel">Tipo de Cobro</InputLabel>
                                            <Select
                                                labelId="tipoCambioLabel"
                                                label="Tipo de Cobro"
                                                name="tipoCobro"
                                                value={configuraciones.tipoCobro}
                                                id="tipoCobro"
                                                onChange={handleChange}
                                                InputLabelProps={{shrink: true}}
                                            >
                                                {dataTipoCobro.filter(item => configuraciones.idsTiposCobroSeleccionArray.find(i => i == item.m_nCodigo)).map((cambio) => (
                                                    <MenuItem
                                                        key={cambio.m_nIdTipoCobro}
                                                        value={cambio.m_nIdTipoCobro}
                                                    >
                                                        {cambio.m_sDescripcion}
                                                    </MenuItem>
                                                ))}
                                            </Select>
                                        </FormControl>
                                    </Box>
                                </Box>
                                <Box width="40%" p={1} my={0.5} display="flex">
                                    <Box width="40%" p={1} my={0.5}>
                                        <h2>Detectar tipo de cobro de cliente</h2>
                                    </Box>
                                    <Box width="40%" p={1} my={0.5}>
                                        <Checkbox
                                            checked={configuraciones.detectarTipoCobro}
                                            onChange={handleChecked}
                                            color="primary"
                                            style={{transform: "scale(2)"}}
                                            inputProps={{'aria-label': 'primary checkbox'}}
                                            name="detectarTipoCobro"
                                        />
                                    </Box>
                                </Box>
                                <Box width="40%" p={1} my={0.5} display="flex">
                                    <Box width="40%" p={1} my={0.5}>
                                        <h2>Tipos de cobro a mostrar</h2>
                                    </Box>
                                    <Box width="50%" p={1} my={0.5}>
                                        <div style={{display: 'flex', height: '100%'}}>
                                            <DataGrid
                                                localeText={dataGridLocaleText}
                                                rows={dataTipoCobro}
                                                columns={columnasTipoCobro}
                                                density="compact"
                                                getRowId={(row) => row.m_nCodigo}
                                                checkboxSelection
                                                hideFooter
                                                autoHeight {...{dataSet: 'Commodity', rowLength: 4, maxColumns: 6}}
                                                onRowSelectionModelChange={handleTiposCobroSeleccionados}
                                                /*onRowSelectionModelChange={(newModel,details)=>{
                                                    handleTiposCobroSeleccionados
                                                    console.log(newModel)
                                                    console.log(configuraciones)
                                                    console.log(details)
                                                    setConfiguraciones({...configuraciones,idsTiposCobroSeleccionArray: newModel})
                                                   // idsTiposCobroSeleccionArray: e.selectionModel,
                                                    //    idsTiposCobroSeleccionString: e.selectionModel.join(),

                                                   // handleTiposCobroSeleccionados
                                                }}*/
                                                rowSelectionModel={configuraciones.idsTiposCobroSeleccionArray}

                                              //  onSelectionModelChange={handleTiposCobroSeleccionados}
                                               // selectionModel={configuraciones.idsTiposCobroSeleccionArray}
                                            />
                                        </div>
                                    </Box>
                                </Box>
                                <Box width="40%" p={1} my={0.5} display="flex">
                                    <Box width="40%" p={1} my={0.5}>
                                        <h2>Limpiar producto al crear</h2>
                                    </Box>
                                    <Box width="40%" p={1} my={0.5}>
                                        <Checkbox
                                            checked={configuraciones.limpiarProducto}
                                            onChange={handleChecked}
                                            color="primary"
                                            style={{transform: "scale(2)"}}
                                            inputProps={{'aria-label': 'primary checkbox'}}
                                            name="limpiarProducto"
                                        />
                                    </Box>
                                </Box>
                                <Box width="40%" p={1} my={0.5} display="flex">
                                    <Box width="40%" p={1} my={0.5}>
                                        <h2>Fijar captura de Valor Declarado</h2>
                                    </Box>
                                    <Box width="40%" p={1} my={0.5}>
                                        <Checkbox
                                            checked={configuraciones.fijarCapturaValorDeclarado}
                                            color="primary"
                                            style={{transform: "scale(2)"}}
                                            inputProps={{'aria-label': 'primary checkbox'}}
                                            name="fijarCapturaValorDeclarado"
                                            disabled
                                        />
                                    </Box>
                                </Box>
                                {/*<Box width="100%" p={1} my={0.5} display="flex">
                                    <Box width="40%" p={1} my={0.5}>
                                        <h2>Plantilla importar embarques</h2>
                                    </Box>
                                    <Box width="100%" p={1} my={0.5}>
                                        <FilePond
                                            files={files}
                                            onupdatefiles={(files) => handleOnupdatefiles(files)}
                                            labelIdle='Haz click aquí para seleccionar un documento'
                                        />
                                    </Box>
                                    <Box width="100%" p={1} my={0.5}>
                                        <Button fullWidth variant="text" color="primary" onClick={descargarPlantillaImportar}>
                                            Descargar plantilla existente
                                        </Button>
                                    </Box>

                                    <Box width="100%" p={1} my={0.5}>
                                        <Button fullWidth variant="text" color="primary" onClick={convertirABase64}>
                                            convertir a base64
                                        </Button>
                                    </Box>
                                </Box>*/}
                                <Box margin={"0 auto"}>
                                    <Button disabled={!validarDerecho(9101408)} variant="contained" color="primary"
                                            style={{width: "100px", fontSize:"1em"}}
                                            onClick={onSubmit}>
                                        Modificar
                                    </Button>
                                </Box>
                            </Box>
                        </TabPanel>
                        <TabPanel value="2">
                            <Box display="flex" p={1} my={0.5} bgcolor="background.paper"
                                 flexDirection="column">
                                <Box display="flex" p={1} my={0.5} flexDirection="column">
                                    {/*<h2 className={classes.subtitulo}>Recolección</h2>*/}
                                    <Box width="40%" p={1} my={0.5} display="flex">
                                        <Box width="40%" p={1} my={0.5}>
                                            <div className={classes.subtitulo}>Estatus por defecto</div>
                                        </Box>
                                        <Box width="60%" p={1} my={0.5}>
                                            <FormControl size="small" fullWidth variant="outlined" width="25%">
                                                <InputLabel id="idRecoleccionLabel">Estatus</InputLabel>
                                                <Select
                                                    labelId="estatusRecoleccionLabel"
                                                    required
                                                    value={configuraciones.estatusRecoleccion}
                                                    label="Estatus"
                                                    id="estatusRecoleccion"
                                                    name="estatusRecoleccion"
                                                    onChange={handleChange}
                                                    InputLabelProps={{shrink: true}}
                                                >
                                                    {dataEstatusRecoleccion.map((estatus) => (
                                                        <MenuItem key={estatus.m_nIdEstatusRecoleccion}
                                                                value={estatus.m_nIdEstatusRecoleccion}
                                                        >
                                                            {estatus.m_sEstatus}
                                                        </MenuItem>
                                                    ))}
                                                </Select>
                                            </FormControl>
                                        </Box>
                                    </Box>
                                </Box>
                                <Box margin={"0 auto"}>
                                    <Button disabled={!validarDerecho(9101409)} variant="contained" color="primary"
                                            style={{width: "120px", fontSize:"1em"}}
                                            onClick={onSubmit}>
                                        Modificar
                                    </Button>
                                </Box>
                            </Box>
                        </TabPanel>
                        <TabPanel value="3">
                            <Box display="flex" p={1} my={0.5} bgcolor="background.paper"
                                 flexDirection="column">
                                <Box display="flex" p={1} my={0.5} bgcolor="background.paper"
                                     flexDirection="column">
                                    {/*<h2 className={classes.subtitulo}>Guías</h2>*/}
                                    <Box width="40%" p={1} my={0.5} display="flex">
                                        <Box width="40%" p={1} my={0.5}>
                                            <div className={classes.subtitulo}>Estatus por defecto</div>
                                        </Box>
                                        <Box width="60%" p={1} my={0.5}>
                                            <FormControl size="small" fullWidth variant="outlined" width="25%">
                                                <InputLabel id="idGuiaLabel">Estatus</InputLabel>
                                                <Select
                                                    labelId="estatusGuiaLabel"
                                                    required
                                                    value={configuraciones.estatusGuia}
                                                    label="Estatus"
                                                    id="estatusGuia"
                                                    name="estatusGuia"
                                                    onChange={handleChange}
                                                    InputLabelProps={{shrink: true}}
                                                >
                                                    {dataEstatusGuia.map((estatus) => (
                                                        <MenuItem key={estatus.m_nIdEstatusGuia}
                                                                value={estatus.m_nIdEstatusGuia}>
                                                            {estatus.m_sEstatus}
                                                        </MenuItem>
                                                    ))}
                                                </Select>
                                            </FormControl>
                                        </Box>
                                    </Box>
                                    <Box width="40%" p={1} my={0.5} display="flex">
                                        <Box width="40%" p={1} my={0.5}>
                                            <h2>Escanear Paquetes al Cargar Informe en Remolque</h2>
                                        </Box>
                                        <Box width="40%" p={1} my={0.5}>
                                            <Checkbox
                                                checked={configuraciones.validarInforme}
                                                onChange={handleChecked}
                                                color="primary"
                                                style={{transform: "scale(2)"}}
                                                inputProps={{'aria-label': 'primary checkbox'}}
                                                name="validarInforme"
                                            />
                                        </Box>
                                    </Box>
                                    <Box width="40%" p={1} my={0.5} display="flex">
                                        <Box width="40%" p={1} my={0.5}>
                                            <h2>Hacer timbrado de prueba</h2>
                                        </Box>
                                        <Box width="40%" p={1} my={0.5}>
                                            <Checkbox
                                                checked={configuraciones.timbradoPruebaGuia}
                                                onChange={handleChecked}
                                                color="primary"
                                                style={{transform: "scale(2)"}}
                                                inputProps={{'aria-label': 'primary checkbox'}}
                                                name="timbradoPruebaGuia"
                                            />
                                        </Box>
                                    </Box>
                                    <Box width="40%" p={1} my={0.5} display="flex">
                                        <Box width="40%" p={1} my={0.5}>
                                            <h2>¿Requiere etiquetas adicionales?</h2>
                                        </Box>
                                        <Box width="40%" p={1} my={0.5}>
                                            <Checkbox
                                                checked={configuraciones.imprimirEtiquetasIndividuales}
                                                onChange={handleChecked}
                                                color="primary"
                                                style={{transform: "scale(2)"}}
                                                inputProps={{'aria-label': 'primary checkbox'}}
                                                name="imprimirEtiquetasIndividuales"
                                            />
                                        </Box>
                                    </Box>
                                </Box>
                                <Box margin={"0 auto"}>
                                    <Button disabled={!validarDerecho(9101410)} variant="contained" color="primary"
                                            style={{width: "100px", fontSize: "1em"}}
                                            onClick={onSubmit}>
                                        Modificar
                                    </Button>
                                </Box>
                            </Box>
                        </TabPanel>
                        <TabPanel value="4">
                            <Box display="flex" p={1} my={0.5} bgcolor="background.paper"
                                 flexDirection="column">
                                {/*<h2 className={classes.subtitulo}>Tarifas</h2>*/}
                                <Box display="flex" flexDirection="column">
                                    <Box width="40%" display="flex">
                                        <Box width="40%" p={1} my={0.5}>
                                            <div className={classes.subtitulo}>Tipo de tarifa por defecto</div>
                                        </Box>
                                        <Box width="60%" p={1} my={0.5}>
                                            <FormControl fullWidth variant="outlined"
                                                         size="small" required>
                                                <InputLabel> Tipo de Tarifa</InputLabel>
                                                <Select
                                                    label="Tipo de Tarifa"
                                                    name="tipoTarifa"
                                                    read="true"
                                                    onChange={handleChange}
                                                    value={configuraciones.tipoTarifa}
                                                    InputLabelProps={{shrink: true}}
                                                >
                                                    {/*<MenuItem value="1">Por peso o volumen</MenuItem>*/}
                                                    <MenuItem value="2">Por rango</MenuItem>
                                                    <MenuItem value="3">Por región</MenuItem>
                                                </Select>
                                            </FormControl>
                                        </Box>
                                    </Box>
                                    <Box width="40%" display="flex">
                                        <Box width="40%" p={1} my={0.5}>
                                            <div className={classes.subtitulo}>Porcentual de Seguro por Defecto</div>
                                        </Box>
                                        <Box width="60%" p={1} my={0.5}>
                                            <FormControl fullWidth variant="outlined"
                                                         size="small" required>
                                                <TextField
                                                    variant={'outlined'}
                                                    type={'number'}
                                                    native
                                                    label='Porcentual de Seguro por Defecto'
                                                    name="porcentualSeguroDefecto"
                                                    read="true"
                                                    onChange={handleChange}
                                                    value={configuraciones.porcentualSeguroDefecto}
                                                    InputLabelProps={{shrink: true}}
                                                >
                                                </TextField>
                                            </FormControl>
                                        </Box>
                                    </Box>
                                    <Box width="40%" display="flex">
                                        <Box width="40%" p={1} my={0.5}>
                                            <div className={classes.subtitulo}>Cobro porcentual</div>
                                        </Box>
                                        <Box width="60%" p={1} my={0.5} display="flex">
                                            <Checkbox
                                                checked={configuraciones.cobroPorcentual}
                                                color="primary"
                                                disabled
                                                style={{transform: "scale(2)"}}
                                                inputProps={{'aria-label': 'primary checkbox'}}
                                                name="cobroPorcentual"
                                            />
                                        </Box>
                                    </Box>
                                    { configuraciones.tipoTarifa == 2 &&
                                        <Box width="40%" display="flex">
                                            <Box width="40%" p={1} my={0.5}>
                                                <div className={classes.subtitulo}>Factor de conversión</div>
                                            </Box>
                                            <Box width="60%" p={1} my={0.5}>
                                                <Typography variant={'h4'}>
                                                    {configuraciones.factorConversion}
                                                </Typography>
                                            </Box>
                                        </Box>
                                    }
                                    <Box width="40%" display="flex">
                                        <Box width="40%" p={1} my={0.5}>
                                            <div className={classes.subtitulo}>Cobro de cita</div>
                                        </Box>
                                        <Box width="60%" p={1} my={0.5} display="flex">
                                            <Checkbox
                                                checked={configuraciones.cobrarCita}
                                                onChange={handleChecked}
                                                color="primary"
                                                style={{transform: "scale(2)"}}
                                                inputProps={{'aria-label': 'primary checkbox'}}
                                                name="cobrarCita"
                                            />
                                            <TextField variant="outlined" size="small"
                                                       label="Costo($) "
                                                       type="text"
                                                       disabled={!configuraciones.cobrarCita}
                                                       onChange={handleChange}
                                                       value={configuraciones.costoCita}
                                                       name="costoCita"
                                                       placeholder="$"
                                                       InputLabelProps={{shrink: true}}
                                            />


                                        </Box>
                                    </Box>
                                    <Box width="40%" display="flex">
                                        <Box width="40%" p={1} my={0.5}>
                                            <div className={classes.subtitulo}>Cobrar concepto Carga</div>
                                        </Box>
                                        <Box width="60%" p={1} my={0.5}>
                                            <Checkbox
                                                checked={configuraciones.cobrarConceptoCarga}
                                                onChange={handleChecked}
                                                color="primary"
                                                style={{transform: "scale(2)"}}
                                                inputProps={{'aria-label': 'primary checkbox'}}
                                                name="cobrarConceptoCarga"
                                                disabled={configuraciones.cobrarCargaDescargaDisabled}
                                            />
                                        </Box>
                                    </Box>
                                    <Box width="40%" display="flex">
                                        <Box width="40%" p={1} my={0.5}>
                                            <div className={classes.subtitulo}>Cobrar concepto Descarga</div>
                                        </Box>
                                        <Box width="60%" p={1} my={0.5}>
                                            <Checkbox
                                                checked={configuraciones.cobrarConceptoDescarga}
                                                onChange={handleChecked}
                                                color="primary"
                                                style={{transform: "scale(2)"}}
                                                inputProps={{'aria-label': 'primary checkbox'}}
                                                name="cobrarConceptoDescarga"
                                                disabled={configuraciones.cobrarCargaDescargaDisabled}
                                            />
                                        </Box>
                                    </Box>
                                    {/*Conceptos*/}
                                    <Box width="40%" display="flex">
                                        <Box width="40%" p={1} my={0.5}>
                                            <div className={classes.subtitulo}>Concepto de flete</div>
                                        </Box>
                                        <Box width="60%" p={1} my={0.5}>
                                            <FormControl fullWidth variant="outlined" size="small" required>
                                                <InputLabel
                                                    htmlFor="outlined-age-native-simple">Seleccionar</InputLabel>
                                                <Select
                                                    name="idConceptoFlete"
                                                    read="true"
                                                    label="Seleccionar"
                                                    onChange={handleChange}
                                                    value={configuraciones.idConceptoFlete}
                                                    InputLabelProps={{shrink: true}}
                                                >
                                                    <MenuItem aria-label="None" value=""/>
                                                    {dataConceptos.filter(c => esConceptoDisponible(c, 'idConceptoFlete')).map(i => (
                                                        <MenuItem key={i.m_nIdConceptosFacturacion}
                                                                value={i.m_nIdConceptosFacturacion}>{i.m_sCodigo}.- {i.m_sConcepto}</MenuItem>
                                                    ))}
                                                </Select>
                                            </FormControl>
                                        </Box>
                                    </Box>
                                    <Box width="40%" display="flex">
                                        <Box width="40%" p={1} my={0.5}>
                                            <div className={classes.subtitulo}>Concepto de carga</div>
                                        </Box>
                                        <Box width="60%" p={1} my={0.5}>
                                            <FormControl fullWidth variant="outlined" size="small"
                                                         required={configuraciones.cobrarConceptoCarga}>
                                                <InputLabel
                                                    htmlFor="outlined-age-native-simple">Seleccionar</InputLabel>
                                                <Select
                                                    name="idConceptoCarga"
                                                    read="true"
                                                    label="Seleccionar"
                                                    onChange={handleChange}
                                                    value={configuraciones.idConceptoCarga}
                                                    InputLabelProps={{shrink: true}}
                                                >
                                                    <MenuItem aria-label="None" value=""/>
                                                    {dataConceptos.filter(c => esConceptoDisponible(c, 'idConceptoCarga')).map(i => (
                                                        <MenuItem key={i.m_nIdConceptosFacturacion}
                                                                value={i.m_nIdConceptosFacturacion}>{i.m_sCodigo}.- {i.m_sConcepto}</MenuItem>
                                                    ))}
                                                </Select>
                                            </FormControl>
                                        </Box>
                                    </Box>
                                    <Box width="40%" display="flex">
                                        <Box width="40%" p={1} my={0.5}>
                                            <div className={classes.subtitulo}>Concepto de descarga</div>
                                        </Box>
                                        <Box width="60%" p={1} my={0.5}>
                                            <FormControl fullWidth variant="outlined" size="small"
                                                         required={configuraciones.cobrarConceptoDescarga}>
                                                <InputLabel
                                                    htmlFor="outlined-age-native-simple">Seleccionar</InputLabel>
                                                <Select
                                                    name="idConceptoDescarga"
                                                    read="true"
                                                    label="Seleccionar"
                                                    onChange={handleChange}
                                                    value={configuraciones.idConceptoDescarga}
                                                    InputLabelProps={{shrink: true}}
                                                >
                                                    <MenuItem aria-label="None" value=""/>
                                                    {dataConceptos.filter(c => esConceptoDisponible(c, 'idConceptoDescarga')).map(i => (
                                                        <MenuItem key={i.m_nIdConceptosFacturacion}
                                                                value={i.m_nIdConceptosFacturacion}>{i.m_sCodigo}.- {i.m_sConcepto}</MenuItem>
                                                    ))}
                                                </Select>
                                            </FormControl>
                                        </Box>
                                    </Box>
                                    <Box width="40%" display="flex">
                                        <Box width="40%" p={1} my={0.5}>
                                            <div className={classes.subtitulo}>Concepto de recolección</div>
                                        </Box>
                                        <Box width="60%" p={1} my={0.5}>
                                            <FormControl fullWidth variant="outlined" size="small" required>
                                                <InputLabel
                                                    htmlFor="outlined-age-native-simple">Seleccionar</InputLabel>
                                                <Select
                                                    name="idConceptoRecoleccion"
                                                    read="true"
                                                    label="Seleccionar"
                                                    onChange={handleChange}
                                                    value={configuraciones.idConceptoRecoleccion}
                                                    InputLabelProps={{shrink: true}}
                                                >
                                                    <MenuItem aria-label="None" value=""/>
                                                    {dataConceptos.filter(c => esConceptoDisponible(c, 'idConceptoRecoleccion')).map(i => (
                                                        <MenuItem key={i.m_nIdConceptosFacturacion}
                                                                value={i.m_nIdConceptosFacturacion}>{i.m_sCodigo}.- {i.m_sConcepto}</MenuItem>
                                                    ))}
                                                </Select>
                                            </FormControl>
                                        </Box>
                                    </Box>
                                    <Box width="40%" display="flex">
                                        <Box width="40%" p={1} my={0.5}>
                                            <div className={classes.subtitulo}>Concepto de entrega</div>
                                        </Box>
                                        <Box width="60%" p={1} my={0.5}>
                                            <FormControl fullWidth variant="outlined" size="small" required>
                                                <InputLabel
                                                    htmlFor="outlined-age-native-simple">Seleccionar</InputLabel>
                                                <Select
                                                    name="idConceptoEntrega"
                                                    read="true"
                                                    label="Seleccionar"
                                                    onChange={handleChange}
                                                    value={configuraciones.idConceptoEntrega}
                                                    InputLabelProps={{shrink: true}}
                                                >
                                                    <MenuItem aria-label="None" value=""/>
                                                    {dataConceptos.filter(c => esConceptoDisponible(c, 'idConceptoEntrega')).map(i => (
                                                        <MenuItem key={i.m_nIdConceptosFacturacion}
                                                                value={i.m_nIdConceptosFacturacion}>{i.m_sCodigo}.- {i.m_sConcepto}</MenuItem>
                                                    ))}
                                                </Select>
                                            </FormControl>
                                        </Box>
                                    </Box>
                                    <Box width="40%" display="flex">
                                        <Box width="40%" p={1} my={0.5}>
                                            <div className={classes.subtitulo}>Concepto de seguro</div>
                                        </Box>
                                        <Box width="60%" p={1} my={0.5}>
                                            <FormControl fullWidth variant="outlined" size="small" required>
                                                <InputLabel
                                                    htmlFor="outlined-age-native-simple">Seleccionar</InputLabel>
                                                <Select
                                                    name="idConceptoSeguro"
                                                    read="true"
                                                    label="Seleccionar"
                                                    onChange={handleChange}
                                                    value={configuraciones.idConceptoSeguro}
                                                    InputLabelProps={{shrink: true}}
                                                >
                                                    <MenuItem aria-label="None" value=""/>
                                                    {dataConceptos.filter(c => esConceptoDisponible(c, 'idConceptoSeguro')).map(i => (
                                                        <MenuItem key={i.m_nIdConceptosFacturacion}
                                                                value={i.m_nIdConceptosFacturacion}>{i.m_sCodigo}.- {i.m_sConcepto}</MenuItem>
                                                    ))}
                                                </Select>
                                            </FormControl>
                                        </Box>
                                    </Box>
                                    <Box width="40%" display="flex">
                                        <Box width="40%" p={1} my={0.5}>
                                            <div className={classes.subtitulo}>Concepto de cita</div>
                                        </Box>
                                        <Box width="60%" p={1} my={0.5}>
                                            <FormControl fullWidth variant="outlined" size="small"
                                                         required={configuraciones.cobrarCita}>
                                                <InputLabel
                                                    htmlFor="outlined-age-native-simple">Seleccionar</InputLabel>
                                                <Select
                                                    name="idConceptoCita"
                                                    read="true"
                                                    label="Seleccionar"
                                                    onChange={handleChange}
                                                    value={configuraciones.idConceptoCita}
                                                    InputLabelProps={{shrink: true}}
                                                >
                                                    <MenuItem aria-label="None" value=""/>
                                                    {dataConceptos.filter(c => esConceptoDisponible(c, 'idConceptoCita')).map(i => (
                                                        <MenuItem key={i.m_nIdConceptosFacturacion}
                                                                value={i.m_nIdConceptosFacturacion}>{i.m_sCodigo}.- {i.m_sConcepto}</MenuItem>
                                                    ))}
                                                </Select>
                                            </FormControl>
                                        </Box>
                                    </Box>
                                </Box>
                                <Box margin={"0 auto"}>
                                    <Button disabled={!validarDerecho(9101411)} variant="contained" color="primary"
                                            style={{width: "100px", fontSize: "1em"}}
                                            onClick={onSubmit}>
                                        Modificar
                                    </Button>
                                </Box>
                            </Box>
                        </TabPanel>
                        <TabPanel value="5">
                            <Correos
                                data={[configuraciones.correoFacturaViaje, configuraciones.correoFacturaUltimaMilla]}
                                modficarCorreo={modificarCorreo}>
                                <Button disabled={!validarDerecho(9101412)} variant="contained" color="primary"
                                        style={{width: "100px", fontSize: "1em"}}
                                        onClick={onSubmit}>
                                    Modificar
                                </Button>
                            </Correos>
                        </TabPanel>
                        <TabPanel value="6">
                            <Box display="flex" p={1} my={0.5} bgcolor="background.paper">
                                <Grid container spacing={1}>
                                    <Grid item sm={2} xs={12}>
                                        <FormControl size="small" variant="outlined" fullWidth margin={"normal"}>
                                            <InputLabel id="idComplementoLabel">Tipo de servicio</InputLabel>
                                            <Select
                                                labelId="idComplementoLabel"
                                                required
                                                value={configuraciones.tipoTimbrado}
                                                label="Tipo de servicio"
                                                id="tipoTimbrado"
                                                name="tipoTimbrado"
                                                onChange={handleChange}
                                                InputLabelProps={{shrink: true}}
                                            >
                                                <MenuItem key={"1"}
                                                          value={1}
                                                >
                                                    Consolidado
                                                </MenuItem>
                                                <MenuItem key={"2"}
                                                          value={2}
                                                >
                                                    Paquetería
                                                </MenuItem>
                                            </Select>
                                        </FormControl>
                                    </Grid>
                                    <Grid item xs={12}>
                                        <div style={{display:"grid", gridTemplateColumns: "repeat(1, 1fr)",
                                            width:"400px", margin:"10px", gap: "10px", border:"1px solid #ccc", marginLeft: "1px",
                                            borderRadius:"10px"}}>
                                            <Box display="flex" style={{ marginLeft: "10px"}}>
                                                <Box width="66%"  my={1.5}>
                                                    <div className={classes.subtitulo}>Validar facturas de ingreso</div>
                                                </Box>
                                                <Box width="34%" p={1} my={0.5}>
                                                    <Checkbox
                                                        checked={configuraciones.validarTimbradoIngreso}
                                                        onChange={handleChecked}
                                                        color="primary"
                                                        style={{transform: "scale(2)"}}
                                                        inputProps={{'aria-label': 'primary checkbox'}}
                                                        name="validarTimbradoIngreso"
                                                        disabled
                                                    />
                                                </Box>
                                            </Box>
                                            <Box display="flex" style={{ marginLeft: "10px"}}>
                                                <Box width="66%" my={0.5}>
                                                    <div className={classes.subtitulo}>Permitir modificar este valor en Embarque</div>
                                                </Box>
                                                <Box width="34%" p={1} my={0.5}>
                                                    <Checkbox
                                                        checked={configuraciones.modificarValorEmbarque}
                                                        onChange={handleChecked}
                                                        color="primary"
                                                        style={{transform: "scale(2)"}}
                                                        inputProps={{'aria-label': 'primary checkbox'}}
                                                        name="modificarValorEmbarque"
                                                    />
                                                </Box>
                                            </Box>
                                        </div>
                                    </Grid>
                                    <Grid item xs={12}>
                                        <Box width="50%" display="flex">
                                            <Box width="40%" p={1} my={0.5}>
                                                <div className={classes.subtitulo}>Validar timbrado de informes</div>
                                            </Box>
                                            <Box width="60%" p={1} my={0.5}>
                                                <Checkbox
                                                    checked={configuraciones.validarTimbrado}
                                                    onChange={handleChecked}
                                                    color="primary"
                                                    style={{transform: "scale(2)"}}
                                                    inputProps={{'aria-label': 'primary checkbox'}}
                                                    name="validarTimbrado"
                                                />
                                            </Box>
                                        </Box>
                                    </Grid>
                                    <Grid item xs={12}>
                                        <div className={classes.subtitulo}>Documento por sucursal</div>
                                        <DataGridTiposDocumentoSucursal rows={configuraciones.documentos} handleEditRow={handleShowEditTipoDocumento}/>
                                    </Grid>
                                    <Grid container item xs={12} justifyContent="center" >
                                        <Button disabled={!validarDerecho(9101409)} variant="contained"
                                                color="primary"
                                                style={{width: "100px", marginBottom: "5px", fontSize: "1em"}}
                                                onClick={onSubmit}>
                                            Modificar
                                        </Button>
                                    </Grid>
                                </Grid >
                            </Box>
                        </TabPanel>
                    </div>
                </section>
            </TabContext>
        </Root>
    );
}

function DataGridTiposDocumentoSucursal(props) {
    const columns = [
        {
            field: 'sucursal',
            headerName: 'Sucursal',
            width: 200,
        },
        {
            field: 'documento',
            headerName: 'Documento',
            width: 250,
        },
        {
            headerName: "Acciones",
            sortable: false, filterable: false, width: 120,
            field: "",
            renderCell: (row) => {
                return (
                    <div>
                        <Tooltip title="Modificar" >
                            <a onClick={() => { props.handleEditRow(row.row) }}
                                className="btn btn-default btn-xs">
                                <i className="fa fa-pencil-square-o" style={{color: "#F9A03E"}}/>
                            </a>
                        </Tooltip>

                    </div>
                );
            },
        },
    ];
    return (
        <div style={{height: 400, width: 'flex', marginLeft:"20px", marginBottom:"30px"}}>
            <DataGrid
                rows={props.rows}
                columns={columns}
                pageSize={10}
                rowsPerPageOptions={[10]}
                rowCount={props.rows.length}
                autoPageSize
                disableSelectionOnClick
                getRowId={(row) => row.idSucursal}
                density={"compact"}
            />
        </div>
    );
}

export default ParametrosConfiguracion;
