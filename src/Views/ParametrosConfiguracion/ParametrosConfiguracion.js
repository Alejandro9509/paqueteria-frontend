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
    TextField,
    Typography
} from "@material-ui/core";
import {
    obtenerEstatusRecoleccion,
    obtenerEstatusEmbarque,
    obtenerEstatusGuia,
    obtenerEstatusInforme,
    obtenerEstatusViaje
} from "../../Util/Contexts/EstatusContext";
import {validarDerecho} from "../../Util/Util"
import {obtenerMonedas} from "../../Util/Contexts/MonedaContext";
import {obtenerTipoCambio} from "../../Util/Contexts/TipoCambioContext";
import {
    obtenerParametrosConfiguracion,
    modificarParametrosConfiguracion
} from "../../Util/Contexts/ParametrosConfiguracionContext";
import {makeStyles} from '@material-ui/core/styles';
import {TabContext, TabPanel} from "@material-ui/lab";
import {DataGrid} from "@material-ui/data-grid";
import {dataGridLocaleText} from "../../Constants";
import {obtenerTipoCobro} from "../../Util/Contexts/TipoCobroContext";
import Correos from "./Correos";
import {EditorState, ContentState, convertToRaw} from "draft-js";
import draftToHtml from 'draftjs-to-html';
import htmlToDraft from 'html-to-draftjs';
import {obtenerConceptosFacturacion} from "../../Util/Contexts/ConceptosFacturacionContext";
import {FilePond} from "react-filepond";
// Import FilePond styles
import 'filepond/dist/filepond.min.css'
import {toBase64} from "../../Util/GlobalFunctions";
//-------------------------------------------STYLES---------------------------------------------------------------------
const useStyles = makeStyles({
    subtitulo: {
        font: "normal normal normal 16px/17px Calibri",
        color: "black",
        letterSpacing: "0.21px",
        padding: "5px",
    },
})

function showSuccess(mensaje) {
    new Noty({
        type: "information",
        layout: "topCenter",
        text: mensaje,
        timeout: "3000",
    }).show();
}

function ParametrosConfiguracion() {
    const classes = useStyles();

    //--------------------------------------------------VARIABLES--------------------------------------------------------
    const [dataEstatusRecoleccion, setEstatusRecoleccion] = React.useState([]);
    const [dataEstatusEmbarque, setEstatusEmbarque] = React.useState([]);
    const [dataMonedaEmbarque, setMonedaEmbarque] = React.useState([])
    const [dataTipoCambioEmbarque, setTipoCambioEmbarque] = React.useState([])
    const [dataTipoCobro, setTipoCobro] = React.useState([])
    const [dataEstatusGuia, setEstatusGuia] = React.useState([])
    const [tabIndex, setTabIndex] = React.useState('1');
    const columnasTipoCobro = [
        {
            headerName: "Descripción",
            field: 'm_sDescripcion',
            width: 200,
        }
    ]
    const [dataConceptos, setDataConceptos] = useState([]);

    const [files, setFiles] = useState([])
    //variables de valores por defecto
    const [configuraciones, setConfiguraciones] = React.useState({
        estatusRecoleccion: 0,
        estatusEmbarque: 0,
        monedaPredeterminadaEmbarque: 0,
        tipoCambioEmbarque: 0,
        estatusGuia: 0,
        tipoTarifa: 0,
        cobroCargaDescarga: false,
        cobroCargaDescargaDisabled: false,
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
        plantillaImportarEmbarquesNombreArchivo: ''
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
                        cobroCargaDescarga: false,
                        cobroCargaDescargaDisabled: false
                    }
                })
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
                cobroCargaDescarga: false,
                cobroCargaDescargaDisabled: true
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
        console.log(configuraciones.plantillaImportarEmbarquesBase64)
        let params = {
            estatusRecoleccion: configuraciones.estatusRecoleccion,
            estatusEmbarque: configuraciones.estatusEmbarque,
            monedaEmbarque: configuraciones.monedaPredeterminadaEmbarque,
            tipoCambioEmbarque: configuraciones.tipoCambioEmbarque,
            estatusGuia: configuraciones.estatusGuia,
            tipoTarifaTarifas: configuraciones.tipoTarifa,
            costoCitaTarifas: configuraciones.cobrarCita ? configuraciones.costoCita : 0,
            cobroCargaDescargaTarifa: configuraciones.cobroCargaDescarga,
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
            plantillaImportarEmbarquesBase64: "",
            plantillaImportarEmbarquesNombreArchivo: ''
        }
        console.log(params)
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
                    cobroCargaDescarga: respuesta.data.CobroCargaDescargaTarifa,
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
                    plantillaImportarEmbarquesBase64: "",
                    plantillaImportarEmbarquesNombreArchivo: ""
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
                idsTiposCobroSeleccionArray: e.selectionModel,
                idsTiposCobroSeleccionString: e.selectionModel.join(),
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

    /*const descargarPlantillaImportar = () => {
        if (configuraciones.plantillaImportarEmbarquesBase64 === ''){
            return
        }
        let mediaType="data:application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;base64,";
        let a = document.createElement('a');
        a.href = mediaType+encodeURI(configuraciones.plantillaImportarEmbarquesBase64);
        a.download = configuraciones.plantillaImportarEmbarquesNombreArchivo;
        a.textContent = 'Descargar Archivo';
        document.body.appendChild(a);
        a.click();
        a.remove();
    }*/

    /*const handleOnupdatefiles = (newFiles) => {
        // convertirABase64(newFiles[0].file)
        setFiles(newFiles)
    }*/

    /*const convertirABase64 = (file) => {
        /!*if(files.length === 0){
            return
        }*!/
        let fileName = file.name
        let fileBase64 = toBase64(file)
        console.log(fileBase64)
        setConfiguraciones(configuraciones => {
            return{
                ...configuraciones,
                plantillaImportarEmbarquesBase64: fileBase64,
                plantillaImportarEmbarquesNombreArchivo: fileName
            }
        })
    }*/


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

        <div>
            <header className="topbar clearfix">
                <Cabecera titulo="Parametros Configuración">
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
                        onChange={handleTab}
                        centered
                    >
                        <Tab label="Embarque" value="1"/>
                        <Tab label="Recoleccion" value="2"/>
                        <Tab label="Guia" value="3"/>
                        <Tab label="Tarifas" value="4"/>
                        <Tab label="Correos" value="5"/>
                        <Tab label="Facturación" value="6"/>
                    </Tabs>

                </Paper>
                <section className="main-container">
                    <div className="container-fluid">

                        <TabPanel value="1">


                            <Box display="flex" p={1} my={0.5} bgcolor="background.paper"
                                 flexDirection="column">
                                <Box width="40%" p={1} my={0.5} display="flex">
                                    <Box width="40%" p={1} my={0.5}>
                                        <div className={classes.subtitulo}>Estatus por defecto</div>
                                    </Box>
                                    <Box width="60%" p={1} my={0.5}>
                                        <FormControl fullWidth variant="outlined" width="25%">
                                            <InputLabel id="idEmbarqueLabel">Estatus</InputLabel>
                                            <Select
                                                labelId="estatusEmbarqueLabel"
                                                className="form-control"
                                                required
                                                onChange={handleChange}
                                                value={configuraciones.estatusEmbarque}
                                                label="Estatus"
                                                id="estatusEmbarque"
                                                name="estatusEmbarque"
                                            >
                                                {dataEstatusEmbarque.map((estatus) => (
                                                    <option key={estatus.m_nIdEstatusEmbarque}
                                                            value={estatus.m_nIdEstatusEmbarque}
                                                    >
                                                        {estatus.m_sEstatus}
                                                    </option>
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
                                        <FormControl fullWidth variant="outlined"
                                                     margin="dense">
                                            <InputLabel id="idMonedaLabel">Moneda</InputLabel>
                                            <Select
                                                labelId={"idMonedaLabel"}
                                                label={"Moneda"}
                                                name="monedaPredeterminadaEmbarque"
                                                className="form-control"
                                                required
                                                onChange={handleChange}
                                                value={configuraciones.monedaPredeterminadaEmbarque}
                                                id="monedaPredeterminadaEmbarque"
                                                InputProps={{
                                                    name: "monedaPredeterminadaEmbarque"
                                                }}
                                            >
                                                {dataMonedaEmbarque.map((moneda) => (
                                                    <option
                                                        key={moneda.m_nIdMoneda}
                                                        value={moneda.m_nIdMoneda}
                                                    >
                                                        {moneda.m_sMoneda}
                                                    </option>
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
                                                     margin="dense">
                                            <InputLabel id="tipoCambioLabel">Tipo de
                                                Cambio</InputLabel>
                                            <Select
                                                labelId="tipoCambioLabel"
                                                label="Tipo de Cambio"
                                                className="form-control"
                                                name="tipoCambioEmbarque"
                                                value={configuraciones.tipoCambioEmbarque}
                                                id="tipoCambioEmbarque"
                                                onChange={handleChange}
                                            >
                                                {dataTipoCambioEmbarque.map((cambio) => (
                                                    <option
                                                        key={cambio.m_nIdTipoCambio}
                                                        value={cambio.m_nIdTipoCambio}
                                                    >
                                                        {cambio.m_cTipoCambio}
                                                    </option>
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
                                                     margin="dense">
                                            <InputLabel id="tipoCobroLabel">Tipo de Cobro</InputLabel>
                                            <Select
                                                labelId="tipoCambioLabel"
                                                label="Tipo de Cobro"
                                                className="form-control"
                                                name="tipoCobro"
                                                value={configuraciones.tipoCobro}
                                                id="tipoCobro"
                                                onChange={handleChange}
                                            >
                                                {dataTipoCobro.filter(item => configuraciones.idsTiposCobroSeleccionArray.find(i => i == item.m_nCodigo)).map((cambio) => (
                                                    <option
                                                        key={cambio.m_nIdTipoCobro}
                                                        value={cambio.m_nIdTipoCobro}
                                                    >
                                                        {cambio.m_sDescripcion}
                                                    </option>
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
                                    <Box width="40%" p={1} my={0.5}>
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
                                                onSelectionModelChange={handleTiposCobroSeleccionados}
                                                selectionModel={configuraciones.idsTiposCobroSeleccionArray}
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
                                            style={{width: "100px"}}
                                            onClick={onSubmit}>
                                        Modificar
                                    </Button>
                                </Box>
                            </Box>


                        </TabPanel>
                        <TabPanel value="2">
                            <Box p={1}>
                                <Box display="flex" p={1} my={0.5} flexDirection="column">
                                    <h2 className={classes.subtitulo}>Recolección</h2>
                                    <Box width="40%" p={1} my={0.5} display="flex">
                                        <Box width="40%" p={1} my={0.5}>
                                            <div className={classes.subtitulo}>Estatus por defecto</div>
                                        </Box>
                                        <Box width="60%" p={1} my={0.5}>
                                            <FormControl fullWidth variant="outlined" width="25%">
                                                <InputLabel id="idRecoleccionLabel">Estatus</InputLabel>
                                                <Select
                                                    labelId="estatusRecoleccionLabel"
                                                    className="form-control"
                                                    required
                                                    value={configuraciones.estatusRecoleccion}
                                                    label="Estatus"
                                                    id="estatusRecoleccion"
                                                    name="estatusRecoleccion"
                                                    onChange={handleChange}
                                                >
                                                    {dataEstatusRecoleccion.map((estatus) => (
                                                        <option key={estatus.m_nIdEstatusRecoleccion}
                                                                value={estatus.m_nIdEstatusRecoleccion}
                                                        >
                                                            {estatus.m_sEstatus}
                                                        </option>
                                                    ))}
                                                </Select>
                                            </FormControl>
                                        </Box>
                                    </Box>
                                </Box>
                                <Box margin={"0 auto"}>
                                    <Button disabled={!validarDerecho(9101409)} variant="contained" color="primary"
                                            style={{width: "100px"}}
                                            onClick={onSubmit}>
                                        Modificar
                                    </Button>
                                </Box>
                            </Box></TabPanel>
                        <TabPanel value="3">
                            <Box p={1}>
                                <Box display="flex" p={1} my={0.5} bgcolor="background.paper"
                                     flexDirection="column">
                                    <h2 className={classes.subtitulo}>Guias</h2>
                                    <Box width="40%" p={1} my={0.5} display="flex">
                                        <Box width="40%" p={1} my={0.5}>
                                            <div className={classes.subtitulo}>Estatus por defecto</div>
                                        </Box>
                                        <Box width="60%" p={1} my={0.5}>
                                            <FormControl fullWidth variant="outlined" width="25%">
                                                <InputLabel id="idGuiaLabel">Estatus</InputLabel>
                                                <Select
                                                    labelId="estatusGuiaLabel"
                                                    className="form-control"
                                                    required
                                                    value={configuraciones.estatusGuia}
                                                    label="Estatus"
                                                    id="estatusGuia"
                                                    name="estatusGuia"
                                                    onChange={handleChange}
                                                >
                                                    {dataEstatusGuia.map((estatus) => (
                                                        <option key={estatus.m_nIdEstatusGuia}
                                                                value={estatus.m_nIdEstatusGuia}>
                                                            {estatus.m_sEstatus}
                                                        </option>
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
                                </Box>
                                <Box margin={"0 auto"}>
                                    <Button disabled={!validarDerecho(9101410)} variant="contained" color="primary"
                                            style={{width: "100px"}}
                                            onClick={onSubmit}>
                                        Modificar
                                    </Button>
                                </Box>
                            </Box>
                        </TabPanel>
                        <TabPanel value="4">
                            <Box p={1}>
                                <Box display="flex" p={1} my={0.5} bgcolor="background.paper"
                                     flexDirection="column">
                                    <h2 className={classes.subtitulo}>Tarifas</h2>
                                    <Box display="flex" flexDirection="column">
                                        <Box width="40%" display="flex">
                                            <Box width="40%" p={1} my={0.5}>
                                                <div className={classes.subtitulo}>Tipo de tarifa por defecto</div>
                                            </Box>
                                            <Box width="60%" p={1} my={0.5}>
                                                <FormControl fullWidth variant="outlined"
                                                             margin="dense" required>
                                                    <InputLabel> Tipo de Tarifa</InputLabel>
                                                    <Select
                                                        native
                                                        label="Tipo de Tarifa"
                                                        className="form-control"
                                                        name="tipoTarifa"
                                                        read="true"
                                                        onChange={handleChange}
                                                        value={configuraciones.tipoTarifa}
                                                    >
                                                        {/*<option value="1">Por peso o volumen</option>*/}
                                                        <option value="2">Por rango</option>
                                                        <option value="3">Por región</option>
                                                    </Select>
                                                </FormControl>
                                            </Box>
                                        </Box>
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
                                                <TextField variant="outlined" margin="dense"
                                                           label="Costo($) "
                                                           className="form-control"
                                                           type="text"
                                                           disabled={!configuraciones.cobrarCita}
                                                           onChange={handleChange}
                                                           value={configuraciones.costoCita}
                                                           name="costoCita"
                                                           placeholder="$"
                                                />


                                            </Box>
                                        </Box>
                                        <Box width="40%" display="flex">
                                            <Box width="40%" p={1} my={0.5}>
                                                <div className={classes.subtitulo}>Cobro carga y descarga</div>
                                            </Box>
                                            <Box width="60%" p={1} my={0.5}>
                                                <Checkbox
                                                    checked={configuraciones.cobroCargaDescarga}
                                                    onChange={handleChecked}
                                                    color="primary"
                                                    style={{transform: "scale(2)"}}
                                                    inputProps={{'aria-label': 'primary checkbox'}}
                                                    name="cobroCargaDescarga"
                                                    disabled={configuraciones.cobroCargaDescargaDisabled}
                                                />
                                            </Box>
                                        </Box>
                                        {/*Conceptos*/}
                                        <Box width="40%" display="flex">
                                            <Box width="40%" p={1} my={0.5}>
                                                <div className={classes.subtitulo}>Concepto de flete</div>
                                            </Box>
                                            <Box width="60%" p={1} my={0.5}>
                                                <FormControl fullWidth variant="outlined" margin="dense" required>
                                                    <InputLabel
                                                        htmlFor="outlined-age-native-simple">Seleccionar</InputLabel>
                                                    <Select
                                                        native
                                                        className="form-control"
                                                        name="idConceptoFlete"
                                                        read="true"
                                                        label="Seleccionar"
                                                        onChange={handleChange}
                                                        value={configuraciones.idConceptoFlete}
                                                    >
                                                        <option aria-label="None" value=""/>
                                                        {dataConceptos.filter(c => esConceptoDisponible(c, 'idConceptoFlete')).map(i => (
                                                            <option key={i.m_nIdConceptosFacturacion}
                                                                    value={i.m_nIdConceptosFacturacion}>{i.m_sCodigo}.- {i.m_sConcepto}</option>
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
                                                <FormControl fullWidth variant="outlined" margin="dense"
                                                             required={configuraciones.cobroCargaDescarga}>
                                                    <InputLabel
                                                        htmlFor="outlined-age-native-simple">Seleccionar</InputLabel>
                                                    <Select
                                                        native
                                                        className="form-control"
                                                        name="idConceptoCarga"
                                                        read="true"
                                                        label="Seleccionar"
                                                        onChange={handleChange}
                                                        value={configuraciones.idConceptoCarga}
                                                    >
                                                        <option aria-label="None" value=""/>
                                                        {dataConceptos.filter(c => esConceptoDisponible(c, 'idConceptoCarga')).map(i => (
                                                            <option key={i.m_nIdConceptosFacturacion}
                                                                    value={i.m_nIdConceptosFacturacion}>{i.m_sCodigo}.- {i.m_sConcepto}</option>
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
                                                <FormControl fullWidth variant="outlined" margin="dense"
                                                             required={configuraciones.cobroCargaDescarga}>
                                                    <InputLabel
                                                        htmlFor="outlined-age-native-simple">Seleccionar</InputLabel>
                                                    <Select
                                                        native
                                                        className="form-control"
                                                        name="idConceptoDescarga"
                                                        read="true"
                                                        label="Seleccionar"
                                                        onChange={handleChange}
                                                        value={configuraciones.idConceptoDescarga}
                                                    >
                                                        <option aria-label="None" value=""/>
                                                        {dataConceptos.filter(c => esConceptoDisponible(c, 'idConceptoDescarga')).map(i => (
                                                            <option key={i.m_nIdConceptosFacturacion}
                                                                    value={i.m_nIdConceptosFacturacion}>{i.m_sCodigo}.- {i.m_sConcepto}</option>
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
                                                <FormControl fullWidth variant="outlined" margin="dense" required>
                                                    <InputLabel
                                                        htmlFor="outlined-age-native-simple">Seleccionar</InputLabel>
                                                    <Select
                                                        native
                                                        className="form-control"
                                                        name="idConceptoRecoleccion"
                                                        read="true"
                                                        label="Seleccionar"
                                                        onChange={handleChange}
                                                        value={configuraciones.idConceptoRecoleccion}
                                                    >
                                                        <option aria-label="None" value=""/>
                                                        {dataConceptos.filter(c => esConceptoDisponible(c, 'idConceptoRecoleccion')).map(i => (
                                                            <option key={i.m_nIdConceptosFacturacion}
                                                                    value={i.m_nIdConceptosFacturacion}>{i.m_sCodigo}.- {i.m_sConcepto}</option>
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
                                                <FormControl fullWidth variant="outlined" margin="dense" required>
                                                    <InputLabel
                                                        htmlFor="outlined-age-native-simple">Seleccionar</InputLabel>
                                                    <Select
                                                        native
                                                        className="form-control"
                                                        name="idConceptoEntrega"
                                                        read="true"
                                                        label="Seleccionar"
                                                        onChange={handleChange}
                                                        value={configuraciones.idConceptoEntrega}
                                                    >
                                                        <option aria-label="None" value=""/>
                                                        {dataConceptos.filter(c => esConceptoDisponible(c, 'idConceptoEntrega')).map(i => (
                                                            <option key={i.m_nIdConceptosFacturacion}
                                                                    value={i.m_nIdConceptosFacturacion}>{i.m_sCodigo}.- {i.m_sConcepto}</option>
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
                                                <FormControl fullWidth variant="outlined" margin="dense" required>
                                                    <InputLabel
                                                        htmlFor="outlined-age-native-simple">Seleccionar</InputLabel>
                                                    <Select
                                                        native
                                                        className="form-control"
                                                        name="idConceptoSeguro"
                                                        read="true"
                                                        label="Seleccionar"
                                                        onChange={handleChange}
                                                        value={configuraciones.idConceptoSeguro}
                                                    >
                                                        <option aria-label="None" value=""/>
                                                        {dataConceptos.filter(c => esConceptoDisponible(c, 'idConceptoSeguro')).map(i => (
                                                            <option key={i.m_nIdConceptosFacturacion}
                                                                    value={i.m_nIdConceptosFacturacion}>{i.m_sCodigo}.- {i.m_sConcepto}</option>
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
                                                <FormControl fullWidth variant="outlined" margin="dense"
                                                             required={configuraciones.cobrarCita}>
                                                    <InputLabel
                                                        htmlFor="outlined-age-native-simple">Seleccionar</InputLabel>
                                                    <Select
                                                        native
                                                        className="form-control"
                                                        name="idConceptoCita"
                                                        read="true"
                                                        label="Seleccionar"
                                                        onChange={handleChange}
                                                        value={configuraciones.idConceptoCita}
                                                    >
                                                        <option aria-label="None" value=""/>
                                                        {dataConceptos.filter(c => esConceptoDisponible(c, 'idConceptoCita')).map(i => (
                                                            <option key={i.m_nIdConceptosFacturacion}
                                                                    value={i.m_nIdConceptosFacturacion}>{i.m_sCodigo}.- {i.m_sConcepto}</option>
                                                        ))}
                                                    </Select>
                                                </FormControl>
                                            </Box>
                                        </Box>
                                    </Box>
                                </Box>
                            </Box>

                            <Box margin={"0 auto"}>
                                <Button disabled={!validarDerecho(9101411)} variant="contained" color="primary"
                                        style={{width: "100px"}}
                                        onClick={onSubmit}>
                                    Modificar
                                </Button>
                            </Box>

                        </TabPanel>

                        <TabPanel value="5">
                            <Correos
                                data={[configuraciones.correoFacturaViaje, configuraciones.correoFacturaUltimaMilla]}
                                modficarCorreo={modificarCorreo}>
                                <Button disabled={!validarDerecho(9101412)} variant="contained" color="primary"
                                        style={{width: "100px"}}
                                        onClick={onSubmit}>
                                    Modificar
                                </Button>
                            </Correos>
                        </TabPanel>
                        <TabPanel value="6">
                            <Box display="flex" p={1} my={0.5} bgcolor="background.paper"
                                 flexDirection="column">
                                <Box display="flex" p={1} my={0.5} flexDirection="column">

                                    {/*<Box width="100%" p={1} my={0.5}>
                                        <FormControl fullWidth variant="outlined" width="25%">
                                            <InputLabel id="idComplementoLabel">Complemento</InputLabel>
                                            <Select
                                                labelId="idComplementoLabel"
                                                className="form-control"
                                                required
                                                value={configuraciones.idComplemento}
                                                label="Complemento"
                                                id="idComplemento"
                                                name="idComplemento"
                                                onChange={handleChange}
                                            >
                                                <option key={"1"}
                                                        value={2}
                                                >
                                                    Ingreso
                                                </option>
                                                <option key={"2"}
                                                        value={3}
                                                >
                                                    Ninguno
                                                </option>
                                            </Select>
                                        </FormControl>
                                    </Box>*/}
                                    <Box width="50%" display="flex">
                                        <Box width="40%" p={1} my={0.5}>
                                            <div className={classes.subtitulo}>Validar facturas de ingreso</div>
                                        </Box>
                                        <Box width="60%" p={1} my={0.5}>
                                            <Checkbox
                                                checked={configuraciones.validarTimbradoIngreso}
                                                onChange={handleChecked}
                                                color="primary"
                                                style={{transform: "scale(2)"}}
                                                inputProps={{'aria-label': 'primary checkbox'}}
                                                name="validarTimbradoIngreso"
                                            />
                                        </Box>
                                    </Box>
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
                                </Box>
                                <Box margin={"0 auto"}>
                                    <Button disabled={!validarDerecho(9101409)} variant="contained" color="primary"
                                            style={{width: "100px"}}
                                            onClick={onSubmit}>
                                        Modificar
                                    </Button>
                                </Box>
                            </Box></TabPanel>
                    </div>
                </section>

            </TabContext>
        </div>

    );
}

export default ParametrosConfiguracion;
