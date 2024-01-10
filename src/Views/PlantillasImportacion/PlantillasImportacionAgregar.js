import React, {useEffect, useState} from "react";
import {
    Button, Checkbox,
    Dialog,
    DialogContent, FormControl,
    FormControlLabel,
    FormLabel,
    Grid, Radio,
    RadioGroup,
    TextField,
    Tooltip
} from "@material-ui/core";
import {showSuccess, validarDerecho} from "../../Util/Util";
import DialogTableClientes from "../Clientes/DialogTableClientes";
import {FilePond} from "react-filepond";
import {agregarPlantillaImportacion, modificarPlantillaImportacion} from "../../Util/Contexts/PlantillasContext";
import {toBase64} from "../../Util/GlobalFunctions";
import InfoRoundedIcon from "@material-ui/icons/InfoRounded";

export default function PlantillasImportacionAgregar(props){
    const grid = {
        IDENTIFICACION: 3,
        GENERALES: 2,
        SEGURO: 2,
        TIMBRADO: 2,
        REMITENTE: 2,
        SUCURSAL: 2,
        DIFERENTE_DOM: 2,
        UBICACION: 2,
        CITA: 2,
        PAQUETES: 4,
        COMPLEMENTOS: 4,
    }
    const STYLES = {
        padding: '10px',
        paddingLeft:'20px',
        paddingRight: '40px'
    }
    const [files, setFiles] = useState([])
    const [openDialog, setOpenDialog] = useState(false)
    const [state,setState] = useState({
        "idPlantilla": 0,
        idTipoPlantilla: "1",
        cliente: null,
        "responsablePago": "",
        "archivoBase64": "",
        "archivoNombre": "",
        "hojaEmbarques": "",
        "hojaPaquetes": "",
        "hojaComplementos": "",
        "numeroEmbarque": "",
        "moneda": "",
        "tipoCambio": "",
        "tipoCobro": "",
        "tipoSeguro": "",
        "porcentajeSeguro": "",
        "valorDeclarado": "",
        "observacionesEmbarque": "",
        "validarTimbradoFactura": "",
        "tipoServicio": "",
        "numeroRemitente": "",
        "correoRemitente": "",
        "telefonoRemitente": "",
        "contactoRemitente": "",
        "numeroDestinatario": "",
        "correoDestinatario": "",
        "telefonoDestinatario": "",
        "contactoDestinatario": "",
        "entregaEnSucursal": "",
        "sucursalEntrega": "",
        "entregaDiferenteDomicilio": "",
        "codigoPostalDiferenteDomicilio": "",
        "coloniaDiferenteDomicilio": "",
        "calleNumeroDiferenteDomicilio": "",
        "entregarEn": "",
        "datosAdicionales": "",
        "recoleccionDiferenteDomicilio": "",
        "codigoPostalDiferenteDomicilioRecoleccion": "",
        "coloniaDiferenteDomicilioRecoleccion": "",
        "calleNumeroDiferenteDomicilioRecoleccion": "",
        "recogerEn": "",
        "datosAdicionalesRecoleccion": "",
        "latitud": "",
        "longitud": "",
        "conCita": "",
        "citaPendiente": "",
        "fechaCita": "",
        "horaMinimaCita": "",
        "horaMaximaCita": "",
        "cantidadPaquete": "",
        "numeroProducto": "",
        "embalajePaquete": "",
        "largo": "",
        "alto": "",
        "ancho": "",
        "pesoPaquete": "",
        "observacionesPaquete": "",
        "descripcionPaquete": "",
        "cantidadComplemento": "",
        "pesoComplemento": "",
        "claveProductoServicio": "",
        "claveUnidadMedida": "",
        "esMaterialPeligroso": "",
        "claveMaterialPeligroso": "",
        "claveEmbalaje": "",
        "descripcionEmbalajeComplemento": "",
        "claveFraccionArancelaria": "",
        "usarNumeroEquivalenciaDestinatario": false,
        "usarNumeroEquivalenciaResponsablePago": false,
        "referencia": '',
        "esFarmaco":'',
        "claveSectorCofepris":'',
        "nombreIngredienteActivo":'',
        "nombreQuimico":'',
        "denominacionGenericaProd":'',
        "denominacionDistintivaProd":'',
        "fabricante":'',
        "fechaCaducidad":'',
        "loteMedicamento":'',
        "formaFarmaceutica":'',
        "condicionesEspTransp":'',
        "registroSanitarioFolioAutorizacion":'',
        "numeroCAS":'',
        "numRegSanPlagCOFEPRIS":'',
        "datosFabricante":'',
        "datosFormulador":'',
        "datosMaquilador":'',
        "usoAutorizado":'',
    })
    const restartState = () => {
        setState({
            "idPlantilla": 0,
            idTipoPlantilla: "1",
            cliente: null,
            "responsablePago": "",
            "archivoBase64": "",
            "archivoNombre": "",
            "hojaEmbarques": "",
            "hojaPaquetes": "",
            "hojaComplementos": "",
            "numeroEmbarque": "",
            "esRecoleccion": "",
            "moneda": "",
            "tipoCambio": "",
            "tipoCobro": "",
            "tipoSeguro": "",
            "porcentajeSeguro": "",
            "valorDeclarado": "",
            "observacionesEmbarque": "",
            "validarTimbradoFactura": "",
            "tipoServicio": "",
            "numeroRemitente": "",
            "correoRemitente": "",
            "telefonoRemitente": "",
            "contactoRemitente": "",
            "numeroDestinatario": "",
            "correoDestinatario": "",
            "telefonoDestinatario": "",
            "contactoDestinatario": "",
            "entregaEnSucursal": "",
            "sucursalEntrega": "",
            "entregaDiferenteDomicilio": "",
            "codigoPostalDiferenteDomicilio": "",
            "coloniaDiferenteDomicilio": "",
            "calleNumeroDiferenteDomicilio": "",
            "entregarEn": "",
            "datosAdicionales": "",
            "recoleccionDiferenteDomicilio": "",
            "codigoPostalDiferenteDomicilioRecoleccion": "",
            "coloniaDiferenteDomicilioRecoleccion": "",
            "calleNumeroDiferenteDomicilioRecoleccion": "",
            "recogerEn": "",
            "datosAdicionalesRecoleccion": "",
            "latitud": "",
            "longitud": "",
            "conCita": "",
            "citaPendiente": "",
            "fechaCita": "",
            "horaMinimaCita": "",
            "horaMaximaCita": "",
            "cantidadPaquete": "",
            "numeroProducto": "",
            "embalajePaquete": "",
            "largo": "",
            "alto": "",
            "ancho": "",
            "pesoPaquete": "",
            "observacionesPaquete": "",
            "descripcionPaquete": "",
            "cantidadComplemento": "",
            "pesoComplemento": "",
            "claveProductoServicio": "",
            "claveUnidadMedida": "",
            "esMaterialPeligroso": "",
            "claveMaterialPeligroso": "",
            "claveEmbalaje": "",
            "descripcionEmbalajeComplemento": "",
            "claveFraccionArancelaria": "",
            "usarNumeroEquivalenciaDestinatario": false,
            "usarNumeroEquivalenciaResponsablePago": false,
            "referencia": '',
            "esFarmaco":'',
            "claveSectorCofepris":'',
            "nombreIngredienteActivo":'',
            "nombreQuimico":'',
            "denominacionGenericaProd":'',
            "denominacionDistintivaProd":'',
            "fabricante":'',
            "fechaCaducidad":'',
            "loteMedicamento":'',
            "formaFarmaceutica":'',
            "condicionesEspTransp":'',
            "registroSanitarioFolioAutorizacion":'',
            "numeroCAS":'',
            "numRegSanPlagCOFEPRIS":'',
            "datosFabricante":'',
            "datosFormulador":'',
            "datosMaquilador":'',
            "usoAutorizado":'',
        })
        setFiles([])
    }

    useEffect(() => {
        if (props.value !== null){
            setState(props.value)
        }else{
            restartState()
        }
    },[props.value])

    const handlePatrocinadorSelected = (row) => {
        setState(state => {
            return {
                ...state,
                cliente: {
                    idCliente: row.data.m_nIdCliente,
                    numeroCliente: row.data.m_nNumeroCliente,
                    nombreFiscal: row.data.m_sNombreFiscal,
                },
            }
        })
        setOpenDialog(false)
    }

    const handleOnSubmit = async () => {
        try {

            let params = {
                "idPlantilla": state.idPlantilla,
                "idCliente": state.cliente.idCliente,
                "idTipoPlantilla": state.idTipoPlantilla,
                // "archivoBase64": "",
                // "archivoNombre": files[0].filenameWithoutExtension,
                "hojaEmbarques": state.hojaEmbarques,
                "hojaPaquetes": state.hojaPaquetes,
                "hojaComplementos": state.hojaComplementos,
                "numeroEmbarque": state.numeroEmbarque,
                // "esRecoleccion": state.esRecoleccion,
                "moneda": state.moneda,
                "tipoCambio": state.tipoCambio,
                "tipoCobro": state.tipoCobro,
                "tipoSeguro": state.tipoSeguro,
                "porcentajeSeguro": state.porcentajeSeguro,
                "valorDeclarado": state.valorDeclarado,
                "observacionesEmbarque": state.observacionesEmbarque,
                "validarTimbradoFactura": state.validarTimbradoFactura,
                "tipoServicio": state.tipoServicio,
                "numeroRemitente": state.numeroRemitente,
                "correoRemitente": state.correoRemitente,
                "telefonoRemitente": state.telefonoRemitente,
                "contactoRemitente": state.contactoRemitente,
                "numeroDestinatario": state.numeroDestinatario,
                "correoDestinatario": state.correoDestinatario,
                "telefonoDestinatario": state.telefonoDestinatario,
                "contactoDestinatario": state.contactoDestinatario,
                "entregaEnSucursal": state.entregaEnSucursal,
                "sucursalEntrega": state.sucursalEntrega,
                "entregaDiferenteDomicilio": state.entregaDiferenteDomicilio,
                "codigoPostalDiferenteDomicilio": state.codigoPostalDiferenteDomicilio,
                "coloniaDiferenteDomicilio": state.coloniaDiferenteDomicilio,
                "calleNumeroDiferenteDomicilio": state.calleNumeroDiferenteDomicilio,
                "entregarEn": state.entregarEn,
                "datosAdicionales": state.datosAdicionales,
                "recoleccionDiferenteDomicilio": state.recoleccionDiferenteDomicilio,
                "codigoPostalDiferenteDomicilioRecoleccion": state.codigoPostalDiferenteDomicilioRecoleccion,
                "coloniaDiferenteDomicilioRecoleccion": state.coloniaDiferenteDomicilioRecoleccion,
                "calleNumeroDiferenteDomicilioRecoleccion": state.calleNumeroDiferenteDomicilioRecoleccion,
                "recogerEn": state.recogerEn,
                "datosAdicionalesRecoleccion": state.datosAdicionalesRecoleccion,
                "latitud": state.latitud,
                "longitud": state.longitud,
                "conCita": state.conCita,
                "citaPendiente": state.citaPendiente,
                "fechaCita": state.fechaCita,
                "horaMinimaCita": state.horaMinimaCita,
                "horaMaximaCita": state.horaMaximaCita,
                "cantidadPaquete": state.cantidadPaquete,
                "numeroProducto": state.numeroProducto,
                "embalajePaquete": state.embalajePaquete,
                "largo": state.largo,
                "alto": state.alto,
                "ancho": state.ancho,
                "pesoPaquete": state.pesoPaquete,
                "observacionesPaquete": state.observacionesPaquete,
                "descripcionPaquete": state.descripcionPaquete,
                "cantidadComplemento": state.cantidadComplemento,
                "pesoComplemento": state.pesoComplemento,
                "claveProductoServicio": state.claveProductoServicio,
                "claveUnidadMedida": state.claveUnidadMedida,
                "esMaterialPeligroso": state.esMaterialPeligroso,
                "claveMaterialPeligroso": state.claveMaterialPeligroso,
                "claveEmbalaje": state.claveEmbalaje,
                "descripcionEmbalajeComplemento": state.descripcionEmbalajeComplemento,
                "claveFraccionArancelaria": state.claveFraccionArancelaria,
                "usarNumeroEquivalenciaDestinatario": state.usarNumeroEquivalenciaDestinatario,
                "responsablePago": state.responsablePago,
                "usarNumeroEquivalenciaResponsablePago": state.usarNumeroEquivalenciaResponsablePago,
                "referencia": state.referencia,
                "esFarmaco":state.esFarmaco,
                "claveSectorCofepris":state.claveSectorCofepris,
                "nombreIngredienteActivo":state.nombreIngredienteActivo,
                "nombreQuimico":state.nombreQuimico,
                "denominacionGenericaProd":state.nenominacionGenericaProd,
                "denominacionDistintivaProd":state.DenominacionDistintivaProd,
                "fabricante":state.fabricante,
                "fechaCaducidad":state.fechaCaducidad,
                "loteMedicamento":state.loteMedicamento,
                "formaFarmaceutica":state.formaFarmaceutica,
                "condicionesEspTransp":state.condicionesEspTransp,
                "registroSanitarioFolioAutorizacion":state.registroSanitarioFolioAutorizacion,
                "numeroCAS":state.numeroCAS,
                "numRegSanPlagCOFEPRIS":state.numRegSanPlagCOFEPRIS,
                "datosFabricante":state.datosFabricante,
                "datosFormulador":state.datosFormulador,
                "datosMaquilador":state.datosMaquilador,
                "usoAutorizado":state.usoAutorizado,
            }
            if (state.idPlantilla > 0){
                if (files.length === 0){
                    params.archivoBase64 = state.archivoBase64
                    params.archivoNombre = state.archivoNombre
                }else{
                    params.archivoBase64 = await toBase64(files[0].file)
                    params.archivoNombre = files[0].filenameWithoutExtension
                }
            }else{
                params.archivoBase64 = await toBase64(files[0].file)
                params.archivoNombre = files[0].filenameWithoutExtension
            }
            console.log(params)
            if (props.value === null){
                agregarPlantillaImportacion(params).then(respuesta => {
                    showSuccess(respuesta.data.message)
                    restartState()
                    props.onSuccessSave()
                }).catch(err => {
                    showSuccess(err.response.data.message)
                })

            }else{
                modificarPlantillaImportacion(state.idPlantilla,params).then(respuesta => {
                    showSuccess(respuesta.data.message)
                    restartState()
                    props.onSuccessSave()
                }).catch(err => {
                    showSuccess(err.response.data.message)
                })

            }

        }catch (e){
            console.log(e)
            showSuccess("Adjunte el archivo de la plantilla base para el cliente.")
        }

    }

    const handleOnupdatefiles = (newFiles) => {
        setFiles(newFiles)
    }

    const handleOnChange = (event) => {
        if (event.target.name === "usarNumeroEquivalenciaDestinatario" || event.target.name === "usarNumeroEquivalenciaResponsablePago"){
            setState({
                ...state,
                [event.target.name]: event.target.checked
            })
        }else {
            setState({
                ...state,
                [event.target.name]: event.target.value
            })
        }
    }

    return(
        <div>
            <Dialog open={openDialog} onClose={() => setOpenDialog(false)} fullWidth maxWidth="md">
                <DialogContent>
                    <DialogTableClientes dialogVisible={(isVisible) => { setOpenDialog(isVisible)}}
                                         handlePatrocinadorSelected={handlePatrocinadorSelected}/>
                </DialogContent>
            </Dialog>
            <div className="widget-wrap">
                <div className="widget-content">
                    <section id={"main"} style={STYLES}>
                        <Grid container spacing={2}>
                            <Grid item xs={12} sm={3}>
                                <FormControl component="fieldset">
                                    <FormLabel >Tipo de plantilla</FormLabel>
                                    <RadioGroup row aria-label="gender" name="idTipoPlantilla" value={state.idTipoPlantilla} onChange={handleOnChange}>
                                        <FormControlLabel value={"1"} control={<Radio />} label="Segmentada" />
                                        <FormControlLabel value={"2"} control={<Radio />} label="Lineal" />
                                    </RadioGroup>
                                </FormControl>
                            </Grid>
                            <Grid item xs={12} sm={3}>
                                <TextField
                                    variant="outlined"
                                    label="Responsable de pago"
                                    margin="dense"
                                    required
                                    value={state.cliente ? state.cliente.numeroCliente + ". " + state.cliente.nombreFiscal : ""}
                                    placeholder={"No. Cliente: Nombre fiscal"}
                                    InputLabelProps={{shrink: true}}
                                    onClick={()=>{ setOpenDialog(true)}}
                                />
                            </Grid>
                            <Grid item xs={12} sm={3}>
                                <FilePond
                                    files={files}
                                    onupdatefiles={(files) => handleOnupdatefiles(files)}
                                    labelIdle={'Haz click aquí para seleccionar un documento'}
                                />
                            </Grid>
                            <Grid item xs={12} sm={3}>Archivo adjunto: {state.archivoNombre === "" ? "Sin archivo": state.archivoNombre }</Grid>
                        </Grid>
                    </section>
                    {   parseInt(state.idTipoPlantilla) === 1 &&
                        <>
                            <section id={"identificacion"} style={STYLES}>
                                <h2>Datos de identificacion</h2>
                                <br/>
                                <Grid container spacing={1}>
                                    <Grid item xs={12} sm={grid.IDENTIFICACION}>
                                        <TextField
                                            variant="outlined"
                                            label="Nombre de hoja con embarques"
                                            margin="dense"
                                            name="hojaEmbarques"
                                            value={state.hojaEmbarques}
                                            helperText={"Nombre de la hoja donde se estarán los datos del embarque."}
                                            onChange={handleOnChange}
                                            required
                                        />
                                    </Grid>
                                    <Grid item xs={12} sm={grid.IDENTIFICACION}>
                                        <TextField
                                            variant="outlined"
                                            label="Nombre de hoja con paquetes"
                                            margin="dense"
                                            name="hojaPaquetes"
                                            value={state.hojaPaquetes}
                                            helperText={"Nombre de la hoja donde se estarán los paquetes del embarque."}
                                            onChange={handleOnChange}
                                            required
                                        />
                                    </Grid>
                                    <Grid item xs={12} sm={grid.IDENTIFICACION}>
                                        <TextField
                                            variant="outlined"
                                            label="Nombre de hoja con complementos SAT"
                                            margin="dense"
                                            name="hojaComplementos"
                                            value={state.hojaComplementos}
                                            helperText={"Nombre de la hoja donde se estarán los complementos SAT del embarque."}
                                            onChange={handleOnChange}
                                            required
                                        />
                                    </Grid>
                                </Grid>
                            </section>
                            <section id={"generales"} style={STYLES}>
                                <h2>Datos generales</h2>
                                <br/>
                                <Grid container spacing={1}>
                                    <Grid item xs={12} sm={grid.GENERALES}>
                                        <TextField
                                            variant="outlined"
                                            label="Número de embarque"
                                            margin="dense"
                                            name="numeroEmbarque"
                                            value={state.numeroEmbarque}
                                            onChange={handleOnChange}
                                            required
                                        />
                                    </Grid>
                                    <Grid item xs={12} sm={grid.GENERALES}>
                                        <TextField
                                            variant="outlined"
                                            label="Moneda"
                                            margin="dense"
                                            name="moneda"
                                            value={state.moneda}
                                            onChange={handleOnChange}
                                            required
                                        />
                                    </Grid>
                                    <Grid item xs={12} sm={grid.GENERALES}>
                                        <TextField
                                            variant="outlined"
                                            label="Tipo de cambio"
                                            margin="dense"
                                            name="tipoCambio"
                                            value={state.tipoCambio}
                                            onChange={handleOnChange}
                                            required
                                        />
                                    </Grid>
                                    <Grid item xs={12} sm={grid.GENERALES}>
                                        <TextField
                                            variant="outlined"
                                            label="Tipo de cobro"
                                            margin="dense"
                                            name="tipoCobro"
                                            value={state.tipoCobro}
                                            onChange={handleOnChange}
                                            required
                                        />
                                    </Grid>
                                    <Grid item xs={12} sm={grid.GENERALES}>
                                        <TextField
                                            variant="outlined"
                                            label="Referencia"
                                            margin="dense"
                                            name="referencia"
                                            value={state.referencia}
                                            onChange={handleOnChange}
                                        />
                                    </Grid>
                                </Grid>
                            </section>
                            <section id={"seguro"} style={STYLES}>
                                <h2>Datos de seguro</h2>
                                <br/>
                                <Grid container spacing={1}>
                                    <Grid item xs={12} sm={grid.SEGURO}>
                                        <TextField
                                            variant="outlined"
                                            label="Tipo de seguro"
                                            margin="dense"
                                            name="tipoSeguro"
                                            value={state.tipoSeguro}
                                            onChange={handleOnChange}
                                            required
                                        />
                                    </Grid>
                                    <Grid item xs={12} sm={grid.SEGURO}>
                                        <TextField
                                            variant="outlined"
                                            label="Porcentaje de seguro"
                                            margin="dense"
                                            name="porcentajeSeguro"
                                            value={state.porcentajeSeguro}
                                            onChange={handleOnChange}
                                        />
                                    </Grid>
                                    <Grid item xs={12} sm={grid.SEGURO}>
                                        <TextField
                                            variant="outlined"
                                            label="Valor declarado"
                                            margin="dense"
                                            name="valorDeclarado"
                                            value={state.valorDeclarado}
                                            onChange={handleOnChange}
                                        />
                                    </Grid>
                                    <Grid item xs={12} sm={grid.SEGURO}>
                                        <TextField
                                            variant="outlined"
                                            label="Observaciones"
                                            margin="dense"
                                            name="observacionesEmbarque"
                                            value={state.observacionesEmbarque}
                                            onChange={handleOnChange}
                                        />
                                    </Grid>
                                </Grid>
                            </section>
                            <section id={"timbrado"} style={STYLES}>
                                <h2>Datos de timbrado</h2>
                                <br/>
                                <Grid container spacing={1}>
                                    <Grid item xs={12} sm={grid.TIMBRADO}>
                                        <TextField
                                            variant="outlined"
                                            label="Validar timbrado"
                                            margin="dense"
                                            name="validarTimbradoFactura"
                                            value={state.validarTimbradoFactura}
                                            onChange={handleOnChange}
                                            required
                                        />
                                    </Grid>
                                    <Grid item xs={12} sm={grid.TIMBRADO}>
                                        <TextField
                                            variant="outlined"
                                            label="Tipo de servicio"
                                            margin="dense"
                                            name="tipoServicio"
                                            value={state.tipoServicio}
                                            onChange={handleOnChange}
                                            required
                                        />
                                    </Grid>
                                </Grid>
                            </section>
                            <section id={"remitente"} style={STYLES}>
                                <h2>Datos de remitente</h2>
                                <br/>
                                <Grid container spacing={1}>
                                    <Grid item xs={12} sm={grid.REMITENTE}>
                                        <TextField
                                            variant="outlined"
                                            label="Número de remitente"
                                            margin="dense"
                                            name="numeroRemitente"
                                            value={state.numeroRemitente}
                                            onChange={handleOnChange}
                                            required
                                        />
                                    </Grid>
                                    <Grid item xs={12} sm={grid.REMITENTE}>
                                        <TextField
                                            variant="outlined"
                                            label="Correo de remitente"
                                            margin="dense"
                                            name="correoRemitente"
                                            value={state.correoRemitente}
                                            onChange={handleOnChange}
                                            required
                                        />
                                    </Grid>
                                    <Grid item xs={12} sm={grid.REMITENTE}>
                                        <TextField
                                            variant="outlined"
                                            label="Teléfono de remitente"
                                            margin="dense"
                                            name="telefonoRemitente"
                                            value={state.telefonoRemitente}
                                            onChange={handleOnChange}
                                        />
                                    </Grid>
                                    <Grid item xs={12} sm={grid.REMITENTE}>
                                        <TextField
                                            variant="outlined"
                                            label="Contacto de remitente"
                                            margin="dense"
                                            name="contactoRemitente"
                                            value={state.contactoRemitente}
                                            onChange={handleOnChange}
                                        />
                                    </Grid>
                                </Grid>
                            </section>
                            <section id={"destinatario"} style={STYLES}>
                                <h2>Datos de destinatario</h2>
                                <br/>
                                <Grid container spacing={1}>
                                    <Grid item xs={12} sm={grid.REMITENTE}>
                                        <TextField
                                            variant="outlined"
                                            label="Número de destinatario"
                                            margin="dense"
                                            name="numeroDestinatario"
                                            value={state.numeroDestinatario}
                                            onChange={handleOnChange}
                                            required
                                        />
                                    </Grid>
                                    <Grid item xs={12} sm={grid.REMITENTE}>
                                        <TextField
                                            variant="outlined"
                                            label="Correo de destinatario"
                                            margin="dense"
                                            name="correoDestinatario"
                                            value={state.correoDestinatario}
                                            onChange={handleOnChange}
                                            required
                                        />
                                    </Grid>
                                    <Grid item xs={12} sm={grid.REMITENTE}>
                                        <TextField
                                            variant="outlined"
                                            label="Teléfono de destinatario"
                                            margin="dense"
                                            name="telefonoDestinatario"
                                            value={state.telefonoDestinatario}
                                            onChange={handleOnChange}
                                        />
                                    </Grid>
                                    <Grid item xs={12} sm={grid.REMITENTE}>
                                        <TextField
                                            variant="outlined"
                                            label="Contacto de destinatario"
                                            margin="dense"
                                            name="contactoDestinatario"
                                            value={state.contactoDestinatario}
                                            onChange={handleOnChange}
                                        />
                                    </Grid>
                                </Grid>
                            </section>
                            <section id={"sucursa"} style={STYLES}>
                                <h2>Datos para entrega en sucursal</h2>
                                <br/>
                                <Grid container spacing={1}>
                                    <Grid item xs={12} sm={grid.SUCURSAL}>
                                        <TextField
                                            variant="outlined"
                                            label="Entrega en sucursal"
                                            margin="dense"
                                            name="entregaEnSucursal"
                                            value={state.entregaEnSucursal}
                                            onChange={handleOnChange}
                                        />
                                    </Grid>
                                    <Grid item xs={12} sm={grid.SUCURSAL}>
                                        <TextField
                                            variant="outlined"
                                            label="Sucursal de entrega"
                                            margin="dense"
                                            name="sucursalEntrega"
                                            value={state.sucursalEntrega}
                                            onChange={handleOnChange}
                                        />
                                    </Grid>
                                </Grid>
                            </section>
                            <section id={"entregaDiferenteDomicilio"} style={STYLES}>
                                <h2>Datos para entrega en diferente domicilio</h2>
                                <br/>
                                <Grid container spacing={1}>
                                    <Grid item xs={12} sm={grid.DIFERENTE_DOM}>
                                        <TextField
                                            variant="outlined"
                                            label="Entrega en diferente"
                                            margin="dense"
                                            name="entregaDiferenteDomicilio"
                                            value={state.entregaDiferenteDomicilio}
                                            onChange={handleOnChange}
                                        />
                                    </Grid>
                                    <Grid item xs={12} sm={grid.DIFERENTE_DOM}>
                                        <TextField
                                            variant="outlined"
                                            label="Código postal"
                                            margin="dense"
                                            name="codigoPostalDiferenteDomicilio"
                                            value={state.codigoPostalDiferenteDomicilio}
                                            onChange={handleOnChange}
                                        />
                                    </Grid>
                                    <Grid item xs={12} sm={grid.DIFERENTE_DOM}>
                                        <TextField
                                            variant="outlined"
                                            label="Colonia"
                                            margin="dense"
                                            name="coloniaDiferenteDomicilio"
                                            value={state.coloniaDiferenteDomicilio}
                                            onChange={handleOnChange}
                                        />
                                    </Grid>
                                    <Grid item xs={12} sm={grid.DIFERENTE_DOM}>
                                        <TextField
                                            variant="outlined"
                                            label="Calle y número"
                                            margin="dense"
                                            name="calleNumeroDiferenteDomicilio"
                                            value={state.calleNumeroDiferenteDomicilio}
                                            onChange={handleOnChange}
                                        />
                                    </Grid>
                                    <Grid item xs={12} sm={grid.DIFERENTE_DOM}>
                                        <TextField
                                            variant="outlined"
                                            label="Entregar en"
                                            margin="dense"
                                            name="entregarEn"
                                            value={state.entregarEn}
                                            onChange={handleOnChange}
                                        />
                                    </Grid>
                                    <Grid item xs={12} sm={grid.DIFERENTE_DOM}>
                                        <TextField
                                            variant="outlined"
                                            label="Datos adicionales"
                                            margin="dense"
                                            name="datosAdicionales"
                                            value={state.datosAdicionales}
                                            onChange={handleOnChange}
                                        />
                                    </Grid>
                                </Grid>
                            </section>
                            <section id={"recoleccionDiferenteDomicilio"} style={STYLES}>
                                <h2>Datos para recolección en diferente domicilio</h2>
                                <br/>
                                <Grid container spacing={1}>
                                    <Grid item xs={12} sm={grid.DIFERENTE_DOM}>
                                        <TextField
                                            variant="outlined"
                                            label="Recoleccion en diferente"
                                            margin="dense"
                                            name="recoleccionDiferenteDomicilio"
                                            value={state.recoleccionDiferenteDomicilio}
                                            onChange={handleOnChange}
                                        />
                                    </Grid>
                                    <Grid item xs={12} sm={grid.DIFERENTE_DOM}>
                                        <TextField
                                            variant="outlined"
                                            label="Código postal"
                                            margin="dense"
                                            name="codigoPostalDiferenteDomicilioRecoleccion"
                                            value={state.codigoPostalDiferenteDomicilioRecoleccion}
                                            onChange={handleOnChange}
                                        />
                                    </Grid>
                                    <Grid item xs={12} sm={grid.DIFERENTE_DOM}>
                                        <TextField
                                            variant="outlined"
                                            label="Colonia"
                                            margin="dense"
                                            name="coloniaDiferenteDomicilioRecoleccion"
                                            value={state.coloniaDiferenteDomicilioRecoleccion}
                                            onChange={handleOnChange}
                                        />
                                    </Grid>
                                    <Grid item xs={12} sm={grid.DIFERENTE_DOM}>
                                        <TextField
                                            variant="outlined"
                                            label="Calle y número"
                                            margin="dense"
                                            name="calleNumeroDiferenteDomicilioRecoleccion"
                                            value={state.calleNumeroDiferenteDomicilioRecoleccion}
                                            onChange={handleOnChange}
                                        />
                                    </Grid>
                                    <Grid item xs={12} sm={grid.DIFERENTE_DOM}>
                                        <TextField
                                            variant="outlined"
                                            label="Recogerr en"
                                            margin="dense"
                                            name="recogerEn"
                                            value={state.recogerEn}
                                            onChange={handleOnChange}
                                        />
                                    </Grid>
                                    <Grid item xs={12} sm={grid.DIFERENTE_DOM}>
                                        <TextField
                                            variant="outlined"
                                            label="Datos adicionales"
                                            margin="dense"
                                            name="datosAdicionalesRecoleccion"
                                            value={state.datosAdicionalesRecoleccion}
                                            onChange={handleOnChange}
                                        />
                                    </Grid>
                                </Grid>
                            </section>
                            <section id={"ubicacion"} style={STYLES}>
                                <h2>Datos de ubicación</h2>
                                <br/>
                                <Grid container spacing={1}>
                                    <Grid item xs={12} sm={grid.UBICACION}>
                                        <TextField
                                            variant="outlined"
                                            label="Latitud"
                                            margin="dense"
                                            name="latitud"
                                            value={state.latitud}
                                            onChange={handleOnChange}
                                            required
                                        />
                                    </Grid>
                                    <Grid item xs={12} sm={grid.UBICACION}>
                                        <TextField
                                            variant="outlined"
                                            label="Longitud"
                                            margin="dense"
                                            name="longitud"
                                            value={state.longitud}
                                            onChange={handleOnChange}
                                            required
                                        />
                                    </Grid>
                                </Grid>
                            </section>
                            <section id={"cita"} style={STYLES}>
                                <h2>Datos de cita</h2>
                                <br/>
                                <Grid container spacing={1}>
                                    <Grid item xs={12} sm={grid.CITA}>
                                        <TextField
                                            variant="outlined"
                                            label="Agregar cita"
                                            margin="dense"
                                            name="conCita"
                                            value={state.conCita}
                                            onChange={handleOnChange}
                                        />
                                    </Grid>
                                    <Grid item xs={12} sm={grid.CITA}>
                                        <TextField
                                            variant="outlined"
                                            label="Dejar cita pendiente"
                                            margin="dense"
                                            name="citaPendiente"
                                            value={state.citaPendiente}
                                            onChange={handleOnChange}
                                        />
                                    </Grid>
                                    <Grid item xs={12} sm={grid.CITA}>
                                        <TextField
                                            variant="outlined"
                                            label="Fecha de cita"
                                            margin="dense"
                                            name="fechaCita"
                                            value={state.fechaCita}
                                            onChange={handleOnChange}
                                        />
                                    </Grid>
                                    <Grid item xs={12} sm={grid.CITA}>
                                        <TextField
                                            variant="outlined"
                                            label="Hora mínima de cita"
                                            margin="dense"
                                            name="horaMinimaCita"
                                            value={state.horaMinimaCita}
                                            onChange={handleOnChange}
                                        />
                                    </Grid>
                                    <Grid item xs={12} sm={grid.CITA}>
                                        <TextField
                                            variant="outlined"
                                            label="Hora máxima de cita"
                                            margin="dense"
                                            name="horaMaximaCita"
                                            value={state.horaMaximaCita}
                                            onChange={handleOnChange}
                                        />
                                    </Grid>
                                </Grid>
                            </section>
                            <section id={"paquetes"} style={STYLES}>
                                <h2>Datos de paquetes</h2>
                                <br/>
                                <Grid container spacing={1}>
                                    <Grid item xs={12} sm={grid.PAQUETES}>
                                        <TextField
                                            variant="outlined"
                                            label="Cantidad de paquetes"
                                            margin="dense"
                                            name="cantidadPaquete"
                                            value={state.cantidadPaquete}
                                            onChange={handleOnChange}
                                            required
                                        />
                                    </Grid>
                                    <Grid item xs={12} sm={grid.PAQUETES}>
                                        <TextField
                                            variant="outlined"
                                            label="Número de paquete"
                                            margin="dense"
                                            name="numeroProducto"
                                            value={state.numeroProducto}
                                            onChange={handleOnChange}
                                            required
                                        />
                                    </Grid>
                                    <Grid item xs={12} sm={grid.PAQUETES}>
                                        <TextField
                                            variant="outlined"
                                            label="Descripción"
                                            margin="dense"
                                            name="descripcionPaquete"
                                            value={state.descripcionPaquete}
                                            onChange={handleOnChange}
                                            required
                                        />
                                    </Grid>
                                    <Grid item xs={12} sm={grid.PAQUETES}>
                                        <TextField
                                            variant="outlined"
                                            label="Largo"
                                            margin="dense"
                                            name="largo"
                                            value={state.largo}
                                            onChange={handleOnChange}
                                            required
                                        />
                                    </Grid>
                                    <Grid item xs={12} sm={grid.PAQUETES}>
                                        <TextField
                                            variant="outlined"
                                            label="Alto"
                                            margin="dense"
                                            name="alto"
                                            value={state.alto}
                                            onChange={handleOnChange}
                                            required
                                        />
                                    </Grid>
                                    <Grid item xs={12} sm={grid.PAQUETES}>
                                        <TextField
                                            variant="outlined"
                                            label="Ancho"
                                            margin="dense"
                                            name="ancho"
                                            value={state.ancho}
                                            onChange={handleOnChange}
                                            required
                                        />
                                    </Grid>
                                    <Grid item xs={12} sm={grid.PAQUETES}>
                                        <TextField
                                            variant="outlined"
                                            label="Embalaje de paquete"
                                            margin="dense"
                                            name="embalajePaquete"
                                            value={state.embalajePaquete}
                                            onChange={handleOnChange}
                                            required
                                        />
                                    </Grid>
                                    <Grid item xs={12} sm={grid.PAQUETES}>
                                        <TextField
                                            variant="outlined"
                                            label="Peso"
                                            margin="dense"
                                            name="pesoPaquete"
                                            value={state.pesoPaquete}
                                            onChange={handleOnChange}
                                            required
                                        />
                                    </Grid>
                                    <Grid item xs={12} sm={grid.PAQUETES}>
                                        <TextField
                                            variant="outlined"
                                            label="Observaciones"
                                            margin="dense"
                                            name="observacionesPaquete"
                                            value={state.observacionesPaquete}
                                            onChange={handleOnChange}
                                        />
                                    </Grid>
                                </Grid>
                            </section>
                            <section id={"complementos"} style={STYLES}>
                                <h2>Datos de complementos SAT</h2>
                                <br/>
                                <Grid container spacing={1}>
                                    <Grid item xs={12} sm={grid.COMPLEMENTOS}>
                                        <TextField
                                            variant="outlined"
                                            label="Cantidad"
                                            margin="dense"
                                            name="cantidadComplemento"
                                            value={state.cantidadComplemento}
                                            onChange={handleOnChange}
                                            required
                                        />
                                    </Grid>
                                    <Grid item xs={12} sm={grid.COMPLEMENTOS}>
                                        <TextField
                                            variant="outlined"
                                            label="Peso"
                                            margin="dense"
                                            name="pesoComplemento"
                                            value={state.pesoComplemento}
                                            onChange={handleOnChange}
                                            required
                                        />
                                    </Grid>
                                    <Grid item xs={12} sm={grid.COMPLEMENTOS}>
                                        <TextField
                                            variant="outlined"
                                            label="Clave producto/servicio"
                                            margin="dense"
                                            name="claveProductoServicio"
                                            value={state.claveProductoServicio}
                                            onChange={handleOnChange}
                                            required
                                        />
                                    </Grid>
                                    <Grid item xs={12} sm={grid.COMPLEMENTOS}>
                                        <TextField
                                            variant="outlined"
                                            label="Clave unidad de medida"
                                            margin="dense"
                                            name="claveUnidadMedida"
                                            value={state.claveUnidadMedida}
                                            onChange={handleOnChange}
                                            required
                                        />
                                    </Grid>
                                    <Grid item xs={12} sm={grid.COMPLEMENTOS}>
                                        <TextField
                                            variant="outlined"
                                            label="Es material peligroso"
                                            margin="dense"
                                            name="esMaterialPeligroso"
                                            value={state.esMaterialPeligroso}
                                            onChange={handleOnChange}
                                        />
                                    </Grid>
                                    <Grid item xs={12} sm={grid.COMPLEMENTOS}>
                                        <TextField
                                            variant="outlined"
                                            label="Clave material peligroso"
                                            margin="dense"
                                            name="claveMaterialPeligroso"
                                            value={state.claveMaterialPeligroso}
                                            onChange={handleOnChange}
                                        />
                                    </Grid>
                                    <Grid item xs={12} sm={grid.COMPLEMENTOS}>
                                        <TextField
                                            variant="outlined"
                                            label="Clave de embalaje"
                                            margin="dense"
                                            name="claveEmbalaje"
                                            value={state.claveEmbalaje}
                                            onChange={handleOnChange}
                                        />
                                    </Grid>
                                    <Grid item xs={12} sm={grid.COMPLEMENTOS}>
                                        <TextField
                                            variant="outlined"
                                            label="Descripcion de embalaje"
                                            margin="dense"
                                            name="descripcionEmbalajeComplemento"
                                            value={state.descripcionEmbalajeComplemento}
                                            onChange={handleOnChange}
                                        />
                                    </Grid>
                                    <Grid item xs={12} sm={grid.COMPLEMENTOS}>
                                        <TextField
                                            variant="outlined"
                                            label="Clave de fracción arancelaria"
                                            margin="dense"
                                            name="claveFraccionArancelaria"
                                            value={state.claveFraccionArancelaria}
                                            onChange={handleOnChange}
                                        />
                                    </Grid>
                                    <Grid item xs={12} sm={grid.COMPLEMENTOS}>
                                        <TextField
                                            variant="outlined"
                                            label="Es fármaco"
                                            margin="dense"
                                            name="EsFarmaco"
                                            value={state.esFarmaco}
                                            onChange={handleOnChange}
                                        />
                                    </Grid>
                                    <Grid item xs={12} sm={grid.COMPLEMENTOS}>
                                        <TextField
                                                   variant="outlined"
                                                   label="Clave de Sector COFEPRIS"
                                                   margin="dense"
                                                   name="ClaveSectorCofepris"
                                                   value={state.claveSectorCofepris}
                                                   onChange={handleOnChange}
                                        />
                                    </Grid>
                                    <Grid item xs={12} sm={grid.COMPLEMENTOS}>
                                        <TextField
                                                   variant="outlined"
                                                   label="Nombre de Ingrediente Activo"
                                                   margin="dense"
                                                   name="NombreIngredienteActivo"
                                                   value={state.nombreIngredienteActivo}
                                                   onChange={handleOnChange}
                                        />
                                    </Grid>
                                    <Grid item xs={12} sm={grid.COMPLEMENTOS}>
                                        <TextField
                                                   variant="outlined"
                                                   label="Nombre Químico"
                                                   margin="dense"
                                                   name="NombreQuimico"
                                                   value={state.nombreQuimico}
                                                   onChange={handleOnChange}
                                        />
                                    </Grid>
                                    <Grid item xs={12} sm={grid.COMPLEMENTOS}>
                                        <TextField
                                                   variant="outlined"
                                                   label="Denominación Genérica"
                                                   margin="dense"
                                                   name="DenominacionGenericaProd"
                                                   value={state.denominacionGenericaProd}
                                                   onChange={handleOnChange}
                                        />
                                    </Grid>
                                    <Grid item xs={12} sm={grid.COMPLEMENTOS}>
                                        <TextField
                                                   variant="outlined"
                                                   label="Denominación Distintiva"
                                                   margin="dense"
                                                   name="DenominacionDistintivaProd"
                                                   value={state.denominacionDistintivaProd}
                                                   onChange={handleOnChange}
                                        />
                                    </Grid>
                                    <Grid item xs={12} sm={grid.COMPLEMENTOS}>
                                        <TextField
                                                   variant="outlined"
                                                   label="Fabricante"
                                                   margin="dense"
                                                   name="Fabricante"
                                                   value={state.fabricante}
                                                   onChange={handleOnChange}
                                        />
                                    </Grid>
                                    <Grid item xs={12} sm={grid.COMPLEMENTOS}>
                                        <TextField
                                                   variant="outlined"
                                                   label="Fecha de Caducidad (dd/MM/AAAA o AAAA-MM-dd)"
                                                   margin="dense"
                                                   name="FechaCaducidad"
                                                   value={state.fechaCaducidad}
                                                   onChange={handleOnChange}
                                        />
                                    </Grid>
                                    <Grid item xs={12} sm={grid.COMPLEMENTOS}>
                                        <TextField
                                                   variant="outlined"
                                                   label="Lote de Medicamento"
                                                   margin="dense"
                                                   name="LoteMedicamento"
                                                   value={state.loteMedicamento}
                                                   onChange={handleOnChange}
                                        />
                                    </Grid>
                                    <Grid item xs={12} sm={grid.COMPLEMENTOS}>
                                        <TextField
                                                   variant="outlined"
                                                   label="Clave de Forma Farmacéutica"
                                                   margin="dense"
                                                   name="FormaFarmaceutica"
                                                   value={state.formaFarmaceutica}
                                                   onChange={handleOnChange}
                                        />
                                    </Grid>
                                    <Grid item xs={12} sm={grid.COMPLEMENTOS}>
                                        <TextField
                                                   variant="outlined"
                                                   label="Clave de Condición Especial de Transporte"
                                                   margin="dense"
                                                   name="CondicionesEspTransp"
                                                   value={state.condicionesEspTransp}
                                                   onChange={handleOnChange}
                                        />
                                    </Grid>
                                    <Grid item xs={12} sm={grid.COMPLEMENTOS}>
                                        <TextField
                                            variant="outlined"
                                            label="Registro Sanitario/Folio de Autorización"
                                            margin="dense"
                                            name="RegistroSanitarioFolioAutorizacion"
                                            value={state.registroSanitarioFolioAutorizacion}
                                            onChange={handleOnChange}
                                        />
                                    </Grid>
                                    <Grid item xs={12} sm={grid.COMPLEMENTOS}>
                                        <TextField
                                            variant="outlined"
                                            label="Número CAS"
                                            margin="dense"
                                            name="NumeroCAS"
                                            value={state.numeroCAS}
                                            onChange={handleOnChange}
                                        />
                                    </Grid>
                                    <Grid item xs={12} sm={grid.COMPLEMENTOS}>
                                        <TextField
                                            variant="outlined"
                                            label="Núm. Registro CICLOPLAFEST"
                                            margin="dense"
                                            name="NumRegSanPlagCOFEPRIS"
                                            value={state.numRegSanPlagCOFEPRIS}
                                            onChange={handleOnChange}
                                        />
                                    </Grid>
                                    <Grid item xs={12} sm={grid.COMPLEMENTOS}>
                                        <TextField
                                            variant="outlined"
                                            label="Datos del Fabricante"
                                            margin="dense"
                                            name="DatosFabricante"
                                            value={state.datosFabricante}
                                            onChange={handleOnChange}
                                        />
                                    </Grid>
                                    <Grid item xs={12} sm={grid.COMPLEMENTOS}>
                                        <TextField
                                            variant="outlined"
                                            label="Datos del Formulador"
                                            margin="dense"
                                            name="DatosFormulador"
                                            value={state.datosFormulador}
                                            onChange={handleOnChange}
                                        />
                                    </Grid>
                                    <Grid item xs={12} sm={grid.COMPLEMENTOS}>
                                        <TextField
                                            variant="outlined"
                                            label="Datos del Maquilador"
                                            margin="dense"
                                            name="DatosMaquilador"
                                            value={state.datosMaquilador}
                                            onChange={handleOnChange}
                                        />
                                    </Grid>
                                    <Grid item xs={12} sm={grid.COMPLEMENTOS}>
                                        <TextField
                                            variant="outlined"
                                            label="Uso Autorizado"
                                            margin="dense"
                                            name="UsoAutorizado"
                                            value={state.usoAutorizado}
                                            onChange={handleOnChange}
                                        />
                                    </Grid>
                                </Grid>
                            </section>
                        </>
                    }
                    {   parseInt(state.idTipoPlantilla) === 2 &&
                        <PlantillaLineal value={state} onChange={handleOnChange}/>
                    }


                    <Grid container spacing={1}>
                        <Grid item xs>
                            <Button fullWidth color={"secondary"} variant={"contained"} onClick={(event) => {

                            }} style={{color: "white"}}>
                                Cancelar
                            </Button>
                        </Grid>
                        <Grid item xs>
                            <Button fullWidth
                                    color={"primary"}
                                    variant={"contained"}
                                    onClick={handleOnSubmit}
                            >
                                Guardar
                            </Button>
                        </Grid>
                    </Grid>
                </div>
            </div>
        </div>
    )
}

function PlantillaLineal(props) {
    const grid = {
        IDENTIFICACION: 3,
        GENERALES: 2,
        SEGURO: 2,
        TIMBRADO: 3,
        REMITENTE: 2,
        SUCURSAL: 2,
        DIFERENTE_DOM: 2,
        UBICACION: 3,
        CITA: 2,
        PAQUETES: 2,
        COMPLEMENTOS: 3,
    }
    const STYLES = {
        padding: '10px',
        paddingLeft:'20px',
        paddingRight: '40px'
    }

    const handleOnChange = (event) => {
        props.onChange(event)
    }
    return(
        <div>
            <section id={"identificacion"} style={STYLES}>
                <h2>Datos de identificacion</h2>
                <br/>
                <Grid container spacing={1}>
                    <Grid item xs={12} sm={grid.IDENTIFICACION}>
                        <TextField
                            variant="outlined"
                            label="Nombre de hoja con embarques"
                            margin="dense"
                            name="hojaEmbarques"
                            value={props.value.hojaEmbarques}
                            helperText={"Es el nombre que tendrá la hoja donde se agregará los datos del embarque."}
                            onChange={handleOnChange}
                            required
                        />
                    </Grid>
                </Grid>
            </section>
            <section id={"generales"} style={STYLES}>
                <h2>Datos generales</h2>
                <br/>
                <Grid container spacing={1}>
                    <Grid item xs={12} sm={grid.GENERALES}>
                        <TextField
                            variant="outlined"
                            label="Número de embarque"
                            margin="dense"
                            name="numeroEmbarque"
                            value={props.value.numeroEmbarque}
                            onChange={handleOnChange}
                            required
                        />
                    </Grid>
                    <Grid item xs={12} sm={grid.GENERALES}>
                        <TextField
                            variant="outlined"
                            label="Referencia"
                            margin="dense"
                            name="referencia"
                            value={props.value.referencia}
                            onChange={handleOnChange}
                            required
                        />
                    </Grid>
                    {/*<Grid item xs={12} sm={grid.GENERALES}>
                        <TextField
                            variant="outlined"
                            label="Es recolección"
                            margin="dense"
                            name="esRecoleccion"
                            value={props.value.esRecoleccion}
                            onChange={handleOnChange}
                            required
                        />
                    </Grid>*/}
                </Grid>
            </section>
            <section id={"seguro"} style={STYLES}>
                <h2>Datos de seguro</h2>
                <br/>
                <Grid container spacing={1}>
                    <Grid item xs={12} sm={grid.SEGURO}>
                        <TextField
                            variant="outlined"
                            label="Responsable de pago"
                            margin="dense"
                            name="responsablePago"
                            value={props.value.responsablePago}
                            onChange={handleOnChange}
                            required
                        />
                    </Grid>
                    <Grid item xs={12} sm={1}>
                        <Tooltip title="Corresponde al número de remitente/destinatario del cual se tomará cliente que será responsable de pago" >
                            <InfoRoundedIcon color={"primary"} fontSize={"large"}/>
                        </Tooltip>
                    </Grid>
                    <Grid item xs={12} sm={grid.SEGURO}>
                        <Tooltip title="Al activar se buscará el remitente/destinatario cuyo no. de equivalencia coincida con el ingresado."
                                 arrow
                                 placement="right"
                        >
                            <FormControlLabel
                                control={
                                    <Checkbox
                                        checked={props.value.usarNumeroEquivalenciaResponsablePago}
                                        onChange={handleOnChange}
                                        name="usarNumeroEquivalenciaResponsablePago"
                                        color="primary"
                                        style={{
                                            transform: "scale(1.5)",
                                        }}
                                    />
                                }
                                label="Usar como número de equivalencia"
                            />
                        </Tooltip>
                    </Grid>
                    <Grid item xs={12} sm={grid.SEGURO}>
                        <TextField
                            variant="outlined"
                            label="Valor declarado"
                            margin="dense"
                            name="valorDeclarado"
                            value={props.value.valorDeclarado}
                            onChange={handleOnChange}
                            required
                        />
                    </Grid>
                    <Grid item xs={12} sm={grid.SEGURO}>
                        <TextField
                            variant="outlined"
                            label="Observaciones"
                            margin="dense"
                            name="observacionesEmbarque"
                            value={props.value.observacionesEmbarque}
                            onChange={handleOnChange}
                        />
                    </Grid>
                </Grid>
            </section>
            <section id={"remitente"} style={STYLES}>
                <h2>Datos de remitente</h2>
                <br/>
                <Grid container spacing={1}>
                    <Grid item xs={12} sm={grid.REMITENTE}>
                        <TextField
                            variant="outlined"
                            label="Número de remitente"
                            margin="dense"
                            name="numeroRemitente"
                            value={props.value.numeroRemitente}
                            onChange={handleOnChange}
                            required
                        />
                    </Grid>
                </Grid>
            </section>
            <section id={"destinatario"} style={STYLES}>
                <h2>Datos de destinatario</h2>
                <br/>
                <Grid container spacing={1}>
                    <Grid item xs={12} sm={grid.REMITENTE}>
                        <TextField
                            variant="outlined"
                            label="Número de destinatario"
                            margin="dense"
                            name="numeroDestinatario"
                            value={props.value.numeroDestinatario}
                            onChange={handleOnChange}
                            required
                        />
                    </Grid>
                    <Grid item xs={12} sm={grid.REMITENTE}>
                        <Tooltip title="Al activar se buscará el destinatario cuyo no. de equivalencia coincida con el ingresado."
                                 arrow
                                 placement="right"
                        >
                            <FormControlLabel
                                control={
                                    <Checkbox
                                        checked={props.value.usarNumeroEquivalenciaDestinatario}
                                        onChange={handleOnChange}
                                        name="usarNumeroEquivalenciaDestinatario"
                                        color="primary"
                                        style={{
                                            transform: "scale(1.5)",
                                        }}
                                    />
                                }
                                label="Usar como número de equivalencia"
                            />
                        </Tooltip>
                    </Grid>
                </Grid>
            </section>
            <section id={"sucursa"} style={STYLES}>
                <h2>Datos para entrega en sucursal</h2>
                <br/>
                <Grid container spacing={1}>
                    <Grid item xs={12} sm={grid.SUCURSAL}>
                        <TextField
                            variant="outlined"
                            label="Entrega en sucursal"
                            margin="dense"
                            name="entregaEnSucursal"
                            value={props.value.entregaEnSucursal}
                            onChange={handleOnChange}
                        />
                    </Grid>
                    <Grid item xs={12} sm={grid.SUCURSAL}>
                        <TextField
                            variant="outlined"
                            label="Sucursal de entrega"
                            margin="dense"
                            name="sucursalEntrega"
                            value={props.value.sucursalEntrega}
                            onChange={handleOnChange}
                        />
                    </Grid>
                </Grid>
            </section>
            <section id={"entregaDiferenteDomicilio"} style={STYLES}>
                <h2>Datos para entrega en diferente domicilio</h2>
                <br/>
                <Grid container spacing={1}>
                    <Grid item xs={12} sm={grid.DIFERENTE_DOM}>
                        <TextField
                            variant="outlined"
                            label="Entrega en diferente"
                            margin="dense"
                            name="entregaDiferenteDomicilio"
                            value={props.value.entregaDiferenteDomicilio}
                            onChange={handleOnChange}
                        />
                    </Grid>
                    <Grid item xs={12} sm={grid.DIFERENTE_DOM}>
                        <TextField
                            variant="outlined"
                            label="Código postal"
                            margin="dense"
                            name="codigoPostalDiferenteDomicilio"
                            value={props.value.codigoPostalDiferenteDomicilio}
                            onChange={handleOnChange}
                        />
                    </Grid>
                    <Grid item xs={12} sm={grid.DIFERENTE_DOM}>
                        <TextField
                            variant="outlined"
                            label="Colonia"
                            margin="dense"
                            name="coloniaDiferenteDomicilio"
                            value={props.value.coloniaDiferenteDomicilio}
                            onChange={handleOnChange}
                        />
                    </Grid>
                    <Grid item xs={12} sm={grid.DIFERENTE_DOM}>
                        <TextField
                            variant="outlined"
                            label="Calle y número"
                            margin="dense"
                            name="calleNumeroDiferenteDomicilio"
                            value={props.value.calleNumeroDiferenteDomicilio}
                            onChange={handleOnChange}
                        />
                    </Grid>
                    <Grid item xs={12} sm={grid.DIFERENTE_DOM}>
                        <TextField
                            variant="outlined"
                            label="Entregar en"
                            margin="dense"
                            name="entregarEn"
                            value={props.value.entregarEn}
                            onChange={handleOnChange}
                        />
                    </Grid>
                    <Grid item xs={12} sm={grid.DIFERENTE_DOM}>
                        <TextField
                            variant="outlined"
                            label="Datos adicionales"
                            margin="dense"
                            name="datosAdicionales"
                            value={props.value.datosAdicionales}
                            onChange={handleOnChange}
                        />
                    </Grid>
                </Grid>
            </section>
            <section id={"recoleccionDiferenteDomicilio"} style={STYLES}>
                <h2>Datos para recolección en diferente domicilio</h2>
                <br/>
                <Grid container spacing={1}>
                    <Grid item xs={12} sm={grid.DIFERENTE_DOM}>
                        <TextField
                            variant="outlined"
                            label="Recoleccion en diferente"
                            margin="dense"
                            name="recoleccionDiferenteDomicilio"
                            value={props.value.recoleccionDiferenteDomicilio}
                            onChange={handleOnChange}
                        />
                    </Grid>
                    <Grid item xs={12} sm={grid.DIFERENTE_DOM}>
                        <TextField
                            variant="outlined"
                            label="Código postal"
                            margin="dense"
                            name="codigoPostalDiferenteDomicilioRecoleccion"
                            value={props.value.codigoPostalDiferenteDomicilioRecoleccion}
                            onChange={handleOnChange}
                        />
                    </Grid>
                    <Grid item xs={12} sm={grid.DIFERENTE_DOM}>
                        <TextField
                            variant="outlined"
                            label="Colonia"
                            margin="dense"
                            name="coloniaDiferenteDomicilioRecoleccion"
                            value={props.value.coloniaDiferenteDomicilioRecoleccion}
                            onChange={handleOnChange}
                        />
                    </Grid>
                    <Grid item xs={12} sm={grid.DIFERENTE_DOM}>
                        <TextField
                            variant="outlined"
                            label="Calle y número"
                            margin="dense"
                            name="calleNumeroDiferenteDomicilioRecoleccion"
                            value={props.value.calleNumeroDiferenteDomicilioRecoleccion}
                            onChange={handleOnChange}
                        />
                    </Grid>
                    <Grid item xs={12} sm={grid.DIFERENTE_DOM}>
                        <TextField
                            variant="outlined"
                            label="Recogerr en"
                            margin="dense"
                            name="recogerEn"
                            value={props.value.recogerEn}
                            onChange={handleOnChange}
                        />
                    </Grid>
                    <Grid item xs={12} sm={grid.DIFERENTE_DOM}>
                        <TextField
                            variant="outlined"
                            label="Datos adicionales"
                            margin="dense"
                            name="datosAdicionalesRecoleccion"
                            value={props.value.datosAdicionalesRecoleccion}
                            onChange={handleOnChange}
                        />
                    </Grid>
                </Grid>
            </section>
            <section id={"cita"} style={STYLES}>
                <h2>Datos de cita</h2>
                <br/>
                <Grid container spacing={1}>
                    <Grid item xs={12} sm={grid.CITA}>
                        <TextField
                            variant="outlined"
                            label="Agregar cita"
                            margin="dense"
                            name="conCita"
                            value={props.value.conCita}
                            onChange={handleOnChange}
                        />
                    </Grid>
                    <Grid item xs={12} sm={grid.CITA}>
                        <TextField
                            variant="outlined"
                            label="Dejar cita pendiente"
                            margin="dense"
                            name="citaPendiente"
                            value={props.value.citaPendiente}
                            onChange={handleOnChange}
                        />
                    </Grid>
                    <Grid item xs={12} sm={grid.CITA}>
                        <TextField
                            variant="outlined"
                            label="Fecha de cita"
                            margin="dense"
                            name="fechaCita"
                            value={props.value.fechaCita}
                            onChange={handleOnChange}
                        />
                    </Grid>
                    <Grid item xs={12} sm={grid.CITA}>
                        <TextField
                            variant="outlined"
                            label="Hora mínima de cita"
                            margin="dense"
                            name="horaMinimaCita"
                            value={props.value.horaMinimaCita}
                            onChange={handleOnChange}
                        />
                    </Grid>
                    <Grid item xs={12} sm={grid.CITA}>
                        <TextField
                            variant="outlined"
                            label="Hora máxima de cita"
                            margin="dense"
                            name="horaMaximaCita"
                            value={props.value.horaMaximaCita}
                            onChange={handleOnChange}
                        />
                    </Grid>
                </Grid>
            </section>
            <section id={"paquetes"} style={STYLES}>
                <h2>Datos de paquetes</h2>
                <br/>
                <Grid container spacing={1}>
                    <Grid item xs={12} sm={grid.PAQUETES}>
                        <TextField
                            variant="outlined"
                            label="Cantidad de paquetes"
                            margin="dense"
                            name="cantidadPaquete"
                            value={props.value.cantidadPaquete}
                            onChange={handleOnChange}
                            required
                        />
                    </Grid>
                    <Grid item xs={12} sm={grid.PAQUETES}>
                        <TextField
                            variant="outlined"
                            label="Número de producto"
                            margin="dense"
                            name="numeroProducto"
                            value={props.value.numeroProducto}
                            onChange={handleOnChange}
                            required
                        />
                    </Grid>
                    <Grid item xs={12} sm={grid.PAQUETES}>
                        <TextField
                            variant="outlined"
                            label="Observaciones"
                            margin="dense"
                            name="observacionesPaquete"
                            value={props.value.observacionesPaquete}
                            onChange={handleOnChange}
                        />
                    </Grid>
                </Grid>
            </section>
            <section id={"complementos"} style={STYLES}>
                <h2>Datos de complementos SAT</h2>
                <br/>
                <Grid container spacing={1}>
                    <Grid item xs={12} sm={grid.COMPLEMENTOS}>
                        <TextField
                            variant="outlined"
                            label="Cantidad"
                            margin="dense"
                            name="cantidadComplemento"
                            value={props.value.cantidadComplemento}
                            onChange={handleOnChange}
                            required
                        />
                    </Grid>
                    <Grid item xs={12} sm={grid.COMPLEMENTOS}>
                        <TextField
                            variant="outlined"
                            label="Clave producto/servicio"
                            margin="dense"
                            name="claveProductoServicio"
                            value={props.value.claveProductoServicio}
                            onChange={handleOnChange}
                            required
                        />
                    </Grid>
                    <Grid item xs={12} sm={grid.COMPLEMENTOS}>
                        <TextField
                            variant="outlined"
                            label="Clave unidad de medida"
                            margin="dense"
                            name="claveUnidadMedida"
                            value={props.value.claveUnidadMedida}
                            onChange={handleOnChange}
                            required
                        />
                    </Grid>
                    <Grid item xs={12} sm={grid.COMPLEMENTOS}>
                        <TextField
                            variant="outlined"
                            label="Es material peligroso"
                            margin="dense"
                            name="esMaterialPeligroso"
                            value={props.value.esMaterialPeligroso}
                            onChange={handleOnChange}
                            required
                        />
                    </Grid>
                    <Grid item xs={12} sm={grid.COMPLEMENTOS}>
                        <TextField
                            variant="outlined"
                            label="Clave material peligroso"
                            margin="dense"
                            name="claveMaterialPeligroso"
                            value={props.value.claveMaterialPeligroso}
                            onChange={handleOnChange}
                            required
                        />
                    </Grid>
                    <Grid item xs={12} sm={grid.COMPLEMENTOS}>
                        <TextField
                            variant="outlined"
                            label="Clave de embalaje"
                            margin="dense"
                            name="claveEmbalaje"
                            value={props.value.claveEmbalaje}
                            onChange={handleOnChange}
                            required
                        />
                    </Grid>
                    <Grid item xs={12} sm={grid.COMPLEMENTOS}>
                        <TextField
                            variant="outlined"
                            label="Descripcion de embalaje"
                            margin="dense"
                            name="descripcionEmbalajeComplemento"
                            value={props.value.descripcionEmbalajeComplemento}
                            onChange={handleOnChange}
                            required
                        />
                    </Grid>
                    <Grid item xs={12} sm={grid.COMPLEMENTOS}>
                        <TextField
                            variant="outlined"
                            label="Clave de fracción arancelaria"
                            margin="dense"
                            name="claveFraccionArancelaria"
                            value={props.value.claveFraccionArancelaria}
                            onChange={handleOnChange}
                            required
                        />
                    </Grid>
                </Grid>
            </section>
        </div>
    )
}