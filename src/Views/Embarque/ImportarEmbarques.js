import React, {Component, useEffect, useState} from 'react';
import PropTypes from 'prop-types';
import {
    Button, Collapse,
    Dialog, DialogActions,
    DialogContent,
    FormControl,
    Grid,
    Input,
    InputLabel, List, ListItem, ListItemIcon, ListItemText,
    Select, Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
    TextField
} from "@material-ui/core";

import MenuItem from "@material-ui/core/MenuItem";
import {importarProductos} from "../../Util/Contexts/ProductosContext";
import {
    showSuccess,
    getCurrentDate,
    getCurrentTime,
    readExcel, DEFAULT_FORMAT, readExcelPlantillaLineal
} from "../../Util/Util";
import {FilePond} from "react-filepond";
import 'filepond/dist/filepond.min.css';
import {descargarPlantillaImportarEmbarque} from "../../Util/Contexts/UtileriasContext";
import {ExpandLess} from "@material-ui/icons";
import ExpandMore from "@material-ui/icons/ExpandMore";
import {DataGrid} from "@material-ui/data-grid";
import {dataGridLocaleText} from "../../Constants";
import {agregarEmbarquesImportados, validarEmbarquesImportados} from "../../Util/Contexts/EmbarquesContext";
import InfoRoundedIcon from '@material-ui/icons/InfoRounded';
import {obtenerParametrosConfiguracion} from "../../Util/Contexts/ParametrosConfiguracionContext";
import DialogTableClientes from "../Clientes/DialogTableClientes";
import {
    obtenerNombrePlantillaImportacionByIdCliente,
    obtenerPlantillaImportacionByIdCliente
} from "../../Util/Contexts/PlantillasContext";

function ImportarEmbarques(props) {
    const [configuraciones, setConfiguraciones] = React.useState({
        estatusEmbarque: 0,
        // plantillaImportarEmbarquesNombreArchivo: ''
    })
    const [files, setFiles] = useState([])
    const [state, setState] = useState({
        fechaEmbarque: getCurrentDate(),
        horaEntrega: getCurrentTime(),
        openDialog: false,
        openDialogToOpen: '',
        dataSucursal: [],
        archivo: [],
        embarques: [],
        cliente: null,
        embarqueSelect: null
    })
    useEffect(() => {
        obtenerParametrosConfiguracion().then(respuesta => {
            setConfiguraciones({
                estatusEmbarque: respuesta.data.EstatusEmbarque,
                // plantillaImportarEmbarquesNombreArchivo: respuesta.data.PlantillaImportarEmbarquesNombreArchivo,
            })
        })
    }, [])

    const handleOnupdatefiles = (newFiles) => {
        setFiles(newFiles)
    }

    const handleOnDescargarPlantillaClick = () => {
        obtenerNombrePlantillaImportacionByIdCliente(state.cliente.m_nIdCliente).then(respuesta => {
            descargarPlantillaImportarEmbarque(state.cliente.m_nIdCliente).then(response => {
                // create file link in browser's memory
                let file = new Blob([response.data],{type:'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'})
                console.log(file)
                console.log(response.data)
                const href = URL.createObjectURL(file);

                // create "a" HTML element with href to file & click
                const link = document.createElement('a');
                link.href = href;
                link.setAttribute('download', respuesta.data.data.archivoNombre); //or any other extension
                document.body.appendChild(link);
                link.click();

                // clean up "a" element & remove ObjectURL
                document.body.removeChild(link);
                URL.revokeObjectURL(href);
            })
        })

    }

    const handleOnImportarClick = () => {
        if (files.length === 0){
            return
        }
        obtenerPlantillaImportacionByIdCliente(state.cliente.m_nIdCliente).then(respuesta => {
            if (respuesta.data.data.idTipoPlantilla === 1){
                readExcel(respuesta.data.data,files[0].file).then((resultado)=>{
                    resultado.forEach(item => item.idCliente = state.cliente.m_nIdCliente)
                    let params = {
                        embarques: resultado
                    }
                    console.log(resultado)
                    console.log(params)
                    validarEmbarquesImportados(params).then(respuesta => {
                        console.log(respuesta.data)
                        setState({
                            ...state,
                            embarques: respuesta.data
                        })
                    }).catch((error)=>{
                        // showMessage(err,2000,"warning")
                        console.log('error al validar: ' + error)
                    })
                }).catch((err)=>{
                    // showMessage(err,2000,"warning")
                    console.log('error al importar' + err)
                })
            }else{
                readExcelPlantillaLineal(respuesta.data.data,files[0].file).then((resultado)=>{
                    resultado.forEach(item => item.idCliente = state.cliente.m_nIdCliente)
                    let params = {
                        embarques: resultado
                    }
                    console.log(resultado)
                    console.log(params)
                    validarEmbarquesImportados(params).then(respuesta => {
                        console.log(respuesta.data)
                        setState({
                            ...state,
                            embarques: respuesta.data
                        })
                    }).catch((error)=>{
                        // showMessage(err,2000,"warning")
                        console.log('error al validar: ' + error)
                    })
                }).catch((err)=>{
                    // showMessage(err,2000,"warning")
                    console.log('error al importar' + err)
                })
            }

        })

    }

    const handleOnClickAceptar = (e) => {
        try {
            let params = {
                embarques: state.embarques.filter(emb => emb.success === true).map(emb => emb.data)
            }
            params.embarques.forEach(embarque => {
                embarque.fechaRegistro = getCurrentDate()
                embarque.horaRegistro = getCurrentTime()
                embarque.idSucursalRegistro = localStorage.getItem("Sucursal")
                embarque.idUsuarioRegistro = localStorage.getItem("UsuarioId")
                embarque.idEstatus = configuraciones.estatusEmbarque
                embarque.idCotizacion = embarque.conceptosFacturacion[0]?.m_nIdCotizacion
                embarque.conceptosFacturacion = embarque.conceptosFacturacion.filter(concepto => concepto.m_bJustificacion!==true)
            })

            console.log(params)
            console.log(JSON.stringify(params))
            // return
            agregarEmbarquesImportados(params).then(respuesta => {
                showSuccess(respuesta.data)
            }).catch((error)=>{
                // showMessage(err,2000,"warning")
                console.log('error al agregar: ' + error)
            })
        }catch (err){
            console.log('error al agregar: ' + err)
        }

    }

    const handlePatrocinadorSelected = (row) => {
        console.log(row)
        setState(state => {
            return {
                ...state,
                cliente: row.data,
                /*idTipoSeguro: row.data.m_nIdTipoSeguro !== 0 ? row.data.m_nIdTipoSeguro : 5,
                porcentajeSeguro:  row.data.m_cPorcentajeSeguro,
                aplicaSeguro: row.data.m_bTieneSeguro,
                tipoCobro: configuraciones.detectarTipoCobro ? row.data.m_bSinCredito ? "10" : "11" : state.tipoCobro,
                observaciones: row.data.m_nIdTipoSeguro === 1 ? ("Aseguradora: " + row.data.m_sAseguradora + ", Poliza: " + row.data.m_sPoliza) : "",*/
                openDialog: false,
            }
        })
    }

    const handleOnLimpiarClick = () => {
        setFiles([])
        setState({
            fechaEmbarque: getCurrentDate(),
            horaEntrega: getCurrentTime(),
            openDialog: false,
            openDialogToOpen: '',
            dataSucursal: [],
            archivo: [],
            embarques: [],
            cliente: null
        })
    }

    const handleOnRutaChange = (event) => {
        try {
            let newList = [...state.embarques]
            let indexEmbarque = newList.findIndex(i => i.numeroEmbarque === state.embarqueSelect.numeroEmbarque)
            let ruta = newList[indexEmbarque].data.rutas.find(i => i.idRuta === event.target.value)
            newList[indexEmbarque].data.idRuta = ruta.idRuta
            newList[indexEmbarque].data.ruta = ruta.ruta
            setState({
                ...state,
                embarques: newList,
                openDialog: false
            })
        }catch (err){
            console.log(err)
        }

    }
    function SelectRuta(props) {
        return(
            <div>
                <TextField
                    variant={"outlined"}
                    label={"Selecciona una ruta"}
                    margin={"dense"}
                    select
                    onChange={props.onChange}
                >
                    {props.list.map( item => (
                        <MenuItem key={item.idRuta} value={item.idRuta}>{item.ruta}</MenuItem>
                    ))}
                </TextField>
            </div>
        )
    }
    return(
        <section className={"main-container"} style={{marginLeft: "0px", padding: "0px"}}>
            <Dialog
                open={state.openDialog}
                onClose={() => setState({...state,openDialog: false})}
                fullWidth maxWidth="md"
            >
                <DialogContent>
                    {(state.openDialog && state.openDialogToOpen === 'CLIENTES') &&
                        <div className="row" style={{backgroundColor: '#FFFFFF'}}>
                            <DialogTableClientes dialogVisible={(value) => setState({...state, openDialog: value})}
                                                 handlePatrocinadorSelected={handlePatrocinadorSelected}/>
                        </div>
                    }
                    {(state.openDialog && state.openDialogToOpen === 'RUTAS') &&
                        <div className="row" style={{backgroundColor: '#FFFFFF'}}>
                            <SelectRuta
                                embarque={state.embarqueSelect}
                                list={state.embarqueSelect?.data?.rutas || []}
                                onChange={handleOnRutaChange}
                            />
                        </div>
                    }
                </DialogContent>
            </Dialog>
            <div className={"content-fluid"}>
                <div className={'row'}>
                    <div className="widget-wrap">
                        <form className="j-forms" >
                            <div className="widget-container">
                                <div className="widget-content">
                                    <h2>Importar Embarques</h2>
                                    <Grid container spacing={1}>
                                        <Grid item xs={3}>
                                            <TextField
                                                variant="outlined"
                                                label="Cliente"
                                                required
                                                value={state.cliente ? state.cliente.m_sNombreFiscal : ''}
                                                InputLabelProps={{shrink: true}}
                                                onClick={() => {
                                                    setState({
                                                        ...state,
                                                        openDialog: true,
                                                        openDialogToOpen: 'CLIENTES'
                                                    })
                                                }}
                                            />
                                        </Grid>

                                        <Grid item xs={3}>
                                            <FilePond
                                                files={files}
                                                onupdatefiles={(files) => handleOnupdatefiles(files)}
                                                labelIdle={state.cliente ? 'Haz click aquí para seleccionar un documento': 'Selecciona un cliente antes de adjuntar archivo'}
                                                disabled={!state.cliente}
                                            />
                                        </Grid>
                                        <Grid item xs={1}>
                                            <Button fullWidth
                                                    color={"primary"}
                                                    variant={"contained"}
                                                    onClick={() => handleOnImportarClick()}
                                                    disabled={!state.cliente}
                                            >Importar</Button>
                                        </Grid>
                                        <Grid item xs={2}>
                                            <Button fullWidth
                                                    color={"primary"}
                                                    variant={"outlined"}
                                                    onClick={() => handleOnDescargarPlantillaClick()}
                                                    // disabled={configuraciones.plantillaImportarEmbarquesNombreArchivo===''}
                                            >Descargar plantilla</Button>
                                        </Grid>
                                        <Grid item xs={1}>
                                            <Button fullWidth
                                                    color={"primary"}
                                                    variant={"outlined"}
                                                    onClick={() => handleOnLimpiarClick()}
                                            >Limpiar</Button>
                                        </Grid>
                                        <Grid item xs={12}>Embarques</Grid>
                                        <Grid item xs={12}>

                                            <List>
                                                {
                                                    state.embarques.map((e, i) => {
                                                        const open = state.embarqueSeleccionado === i
                                                        return (
                                                            <>
                                                                <ListItem key={i} button
                                                                          onClick={() => setState({...state, embarqueSeleccionado: i === state.embarqueSeleccionado ? -1 : i})}>
                                                                    <ListItemText primary={e.data.esRecoleccion ? "Recolección #" + (e.numeroEmbarque) : "Embarque #" + (e.numeroEmbarque)}/>
                                                                    {!e.success && <InfoRoundedIcon color={"error"} fontSize={"large"}/> }
                                                                    {open ? <ExpandLess/> : <ExpandMore/>}
                                                                </ListItem>
                                                                <Collapse in={open}
                                                                          timeout="auto" unmountOnExit>
                                                                    <List component="div" disablePadding>
                                                                        <ListItem button>
                                                                            {
                                                                                e.success ?
                                                                                <>
                                                                                    <Grid container>
                                                                                        <Grid item xs={6}>
                                                                                            Cliente: {e.data.cliente}<br/>
                                                                                            Tipo de seguro: {e.data.tipoSeguro}<br/>
                                                                                            % de seguro: {e.data.porcentajeSeguro}<br/>
                                                                                            Valor declarado: {e.data.valorDeclarado}<br/>
                                                                                            Validar timbrado de factura: {e.data.validarTimbradoFactura?"Sí":"No"}<br/>
                                                                                            Observaciones: {e.data.observaciones}<br/>
                                                                                            Tipo de servicio: {e.data.idTipoServicio === 1 ? 'CONSOLIDADO' : 'PAQUETERIA'}<br/><br/>
                                                                                        </Grid>
                                                                                        <Grid item xs={6}>
                                                                                            Entrega en sucursal: {e.data.entregaEnSucursal?"Sí":"No"}<br/>
                                                                                            Entrega en diferente domicilio: {e.data.entregaDiferenteDomicilio?"Sí":"No"}<br/>
                                                                                            Latitud: {e.data.latitud}<br/>
                                                                                            Longitud: {e.data.longitud}<br/>
                                                                                            Entrega con cita: {e.data.conCita?"Sí":"No"}<br/>
                                                                                            Ruta: {e.data.ruta}<br/>
                                                                                            {e.data.rutas.length > 1 &&
                                                                                                <a
                                                                                                    onClick={() => {
                                                                                                        setState({
                                                                                                            ...state,
                                                                                                            openDialog: true,
                                                                                                            openDialogToOpen: 'RUTAS',
                                                                                                            embarqueSelect: e
                                                                                                        })
                                                                                                    }}>Click aqui para seleccionar ruta</a>
                                                                                            }

                                                                                        </Grid>
                                                                                        <Grid item xs={6}>
                                                                                            Remitente: {e.data.nombreRemitente}<br/>
                                                                                            Código Postal: {e.data.codigoPostalRemitente}<br/>
                                                                                            Domicilio: {e.data.domicilioRemitente + ', ' + e.data.estadoRemitente + ', '  + e.data.paisRemitente}<br/>
                                                                                            Correo: {e.data.correoRemitente}<br/>
                                                                                            Origen: {e.data.origen}<br/>
                                                                                            Zona operativa recolección: {e.data.zonaRecoleccion}<br/>
                                                                                        </Grid>
                                                                                        <Grid item xs={6}>
                                                                                            Destinatario: {e.data.nombreDestinatario}<br/>
                                                                                            Código Postal: {e.data.codigoPostalDestinatario}<br/>
                                                                                            Domicilio: {e.data.domicilioDestinatario + ', ' + e.data.estadoDestinatario + ', '  + e.data.paisDestinatario}<br/>
                                                                                            Correo: {e.data.correoDestinatario}<br/>
                                                                                            Destino: {e.data.destino}<br/>
                                                                                            Zona operativa entrega: {e.data.zonaEntrega}<br/>
                                                                                        </Grid>
                                                                                        <Grid item xs={12} sm={8}>
                                                                                            <br/>
                                                                                            Paquetes
                                                                                            <TablaImportadosPaquetes data={e.data.paquetes}/>
                                                                                        </Grid>
                                                                                        <Grid item xs={12} sm={12}>
                                                                                            <br/>
                                                                                            Complementos SAT
                                                                                            <TablaImportadosComplementosSAT data={e.data.complementosSAT}/>
                                                                                        </Grid>
                                                                                        <Grid item xs={12} sm={12}>
                                                                                            <br/>
                                                                                            Conceptos facturación
                                                                                            <TablaImportadosCoceptosFacturacion data={e.data.conceptosFacturacion.filter(concepto => concepto.m_bJustificacion!==true)}/>
                                                                                        </Grid>
                                                                                    </Grid>
                                                                                </>
                                                                                    :
                                                                                    <>
                                                                                        {e.message}
                                                                                    </>
                                                                            }

                                                                        </ListItem>
                                                                    </List>
                                                                </Collapse>
                                                            </>
                                                        )
                                                    })
                                                }
                                            </List>
                                        </Grid>
                                    </Grid>
                                </div>
                            </div>
                            <div className="row">
                                <Grid container spacing={2}>
                                    <Grid item xs={12}>
                                        <Button className="btn btn-primary primary-btn" onClick={handleOnClickAceptar} disabled={configuraciones.estatusEmbarque === 0}>
                                            Aceptar
                                        </Button>
                                        <Button type={"button"} onClick={() => {console.log('cancelar')}}
                                                className="btn btn-secondary secondary-btn">Cancelar
                                        </Button>
                                    </Grid>

                                </Grid>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </section>
    )

}

function TablaImportadosPaquetes(props) {
    return(
        <TableContainer style={{
            height: "100%",
            padding: "0px",
            paddingRight: "0px"
        }}>
            <Table size="small">
                <TableHead>
                    <TableRow>
                        <TableCell
                            style={{borderBottom: "none",fontWeight: "bold"}}
                            align="left">
                            Cantidad
                        </TableCell>
                        <TableCell
                            style={{borderBottom: "none",fontWeight: "bold"}}
                            align="left">Descripcion</TableCell>
                        <TableCell
                            style={{borderBottom: "none",fontWeight: "bold"}}
                            align="left">Embalaje</TableCell>
                        <TableCell
                            style={{borderBottom: "none",fontWeight: "bold"}}
                            align="left">Largo</TableCell>
                        <TableCell
                            style={{borderBottom: "none",fontWeight: "bold"}}
                            align="left">Alto</TableCell>
                        <TableCell
                            style={{borderBottom: "none",fontWeight: "bold"}}
                            align="left">Ancho</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {
                        props.data.map((item, index) => (
                            <TableRow key={index}>
                                <TableCell
                                    style={{borderBottom: "none"}}
                                    align="left">
                                    {item.cantidad}
                                </TableCell>
                                <TableCell
                                    style={{borderBottom: "none"}}
                                    align="left">
                                    {item.descripcion}
                                </TableCell>
                                <TableCell
                                    style={{borderBottom: "none"}}
                                    align="left">
                                    {item.embalaje}
                                </TableCell>
                                <TableCell
                                    style={{borderBottom: "none"}}
                                    align="left">
                                    {item.largo}
                                </TableCell>
                                <TableCell
                                    style={{borderBottom: "none"}}
                                    align="left">
                                    {item.alto}
                                </TableCell>
                                <TableCell
                                    style={{borderBottom: "none"}}
                                    align="left">
                                    {item.ancho}
                                </TableCell>
                            </TableRow>
                        ))
                    }
                </TableBody>
            </Table>

        </TableContainer>
    )
}

function TablaImportadosComplementosSAT(props) {
    return(
        <TableContainer style={{
            height: "100%",
            padding: "0px",
            paddingRight: "0px"
        }}>
            <Table size="small">
                <TableHead>
                    <TableRow>
                        <TableCell
                            style={{borderBottom: "none",fontWeight: "bold"}}
                            align="left">Cantidad</TableCell>
                        <TableCell
                            style={{borderBottom: "none",fontWeight: "bold"}}
                            align="left">Peso</TableCell>
                        <TableCell
                            style={{borderBottom: "none",fontWeight: "bold"}}
                            align="left">Producto/servicio</TableCell>
                        <TableCell
                            style={{borderBottom: "none",fontWeight: "bold"}}
                            align="left">Unidad medida</TableCell>
                        <TableCell
                            style={{borderBottom: "none",fontWeight: "bold"}}
                            align="left">Es material peligroso</TableCell>
                        <TableCell
                            style={{borderBottom: "none",fontWeight: "bold"}}
                            align="left">Material peligroso</TableCell>
                        <TableCell
                            style={{borderBottom: "none",fontWeight: "bold"}}
                            align="left">Embalaje</TableCell>
                        <TableCell
                            style={{borderBottom: "none",fontWeight: "bold"}}
                            align="left">Descripción embalaje</TableCell>
                        <TableCell
                            style={{borderBottom: "none",fontWeight: "bold"}}
                            align="left">Fracción arancelaria</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {
                        props.data.map((item, index) => (
                            <TableRow key={index}>
                                <TableCell
                                    style={{borderBottom: "none"}}
                                    align="left">
                                    {item.cantidad}
                                </TableCell>
                                <TableCell
                                    style={{borderBottom: "none"}}
                                    align="left">
                                    {item.peso}
                                </TableCell>
                                <TableCell
                                    style={{borderBottom: "none"}}
                                    align="left">
                                    {`${item.claveProductoServicio} - ${item.descripcionProductoServicio}`}
                                </TableCell>
                                <TableCell
                                    style={{borderBottom: "none"}}
                                    align="left">
                                    {`${item.claveUnidadMedida} - ${item.descripcionUnidadMedida}`}
                                </TableCell>
                                <TableCell
                                    style={{borderBottom: "none"}}
                                    align="left">
                                    {item.esMaterialPeligroso ? "Sí":"No"}
                                </TableCell>
                                <TableCell
                                    style={{borderBottom: "none"}}
                                    align="left">
                                    {item.esMaterialPeligroso ? `${item.claveMaterialPeligroso} - ${item.descripcionMaterialPeligroso}`: "No aplica"}
                                </TableCell>
                                <TableCell
                                    style={{borderBottom: "none"}}
                                    align="left">
                                    {item.esMaterialPeligroso ? `${item.claveEmbalaje} - ${item.descripcionSatEmbalaje}`: "No aplica"}
                                </TableCell>
                                <TableCell
                                    style={{borderBottom: "none"}}
                                    align="left">
                                    {item.esMaterialPeligroso ? `${item.descripcionEmbalaje}`: "No aplica"}
                                </TableCell>
                                <TableCell
                                    style={{borderBottom: "none"}}
                                    align="left">
                                    {item.esMaterialPeligroso ? `${item.claveFraccionArancelaria} - ${item.descripcionFraccionArancelaria}`: "No aplica"}
                                </TableCell>
                            </TableRow>
                        ))
                    }
                </TableBody>
            </Table>

        </TableContainer>
    )
}

function TablaImportadosCoceptosFacturacion(props) {
    return(
        <TableContainer style={{
            height: "100%",
            padding: "0px",
            paddingRight: "0px"
        }}>
            <Table size="small">
                <TableHead>
                    <TableRow>
                        <TableCell
                            style={{borderBottom: "none",fontWeight: "bold"}}
                            align="left">Concepto</TableCell>
                        <TableCell
                            style={{borderBottom: "none",fontWeight: "bold"}}
                            align="left">Importe</TableCell>
                        <TableCell
                            style={{borderBottom: "none",fontWeight: "bold"}}
                            align="left">IVA</TableCell>
                        <TableCell
                            style={{borderBottom: "none",fontWeight: "bold"}}
                            align="left">Retencion</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {
                        props.data.map((item, index) => (
                            <TableRow key={index}>
                                <TableCell
                                    style={{borderBottom: "none"}}
                                    align="left">
                                    {item.m_sConcepto}
                                </TableCell>
                                <TableCell
                                    style={{borderBottom: "none"}}
                                    align="left">
                                    {`$${item.m_cImporte}`}
                                </TableCell>
                                <TableCell
                                    style={{borderBottom: "none"}}
                                    align="left">
                                    {`$${item.m_cImporteIva}`}
                                </TableCell>
                                <TableCell
                                    style={{borderBottom: "none"}}
                                    align="left">
                                    {`$${item.m_cImporteRetiene}`}
                                </TableCell>
                            </TableRow>
                        ))
                    }
                </TableBody>
            </Table>

        </TableContainer>
    )
}
export default ImportarEmbarques;
