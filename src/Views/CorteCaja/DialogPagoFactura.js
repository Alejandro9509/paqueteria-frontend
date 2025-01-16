import React, {useEffect, useState} from 'react';
import {
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle, Grid, MenuItem
} from '@mui/material';
import {DataGrid} from "@mui/x-data-grid";
import {dataGridLocaleText} from "../../Constants";
import TextField from "@mui/material/TextField";
import DialogTableClientes from "../Clientes/DialogTableClientes";
import {obtenerTipoCambio} from "../../Util/Contexts/TipoCambioContext";
import InputLabel from "@mui/material/InputLabel";
import Select from "@mui/material/Select";
import FormControl from "@mui/material/FormControl";
import {obtenerTiposPago} from "../../Util/Contexts/TipoPagoContext";
import {obtenerConceptosCobranza} from "../../Util/Contexts/ConceptosCobranzaContext";
import {obtenerCuentasBancarias} from "../../Util/Contexts/CuentasBancariasContext";
import {obtenerParametrosConfiguracionCortes} from "../../Util/Contexts/ParametrosConfiguracionContext";
import {obtenerClienteId} from "../../Util/Contexts/ClientesContext";
import {agregarPagoCorte} from "../../Util/Contexts/CorteCajaContext";
import {showSuccess} from "../../Util/Util";
import moment from "moment/moment";
import {showError} from "../../Util/GlobalFunctions";
import {GridColumnHeaderParams} from "@mui/x-data-grid";

export default function DialogPagoFactura({ open, handleClose, guias }) {
    const [listado, setListado] = useState(guias);
    const [form, setForm] = useState({
        fechaMovimiento: moment(new Date()).format('YYYY-MM-DD'),
        horaMovimiento: moment(new Date()).format('HH:mm:ss'),
        fechaCobro: moment(new Date()).format('YYYY-MM-DD'),
        idCliente: null,
        cliente: '',
        aplicarPago: "",
        idAplicarPago: null,
        tipoCambio: 0.0,
        formaPago: null,
        cuentaBancaria: null,
        idCuentaBancaria: null,
        referenciaBancaria: "",
        conceptoCobranza: null,
        idConceptoCobranza: 2,
        saldoTotal: 0.0,
        saldoTotalDLLS: 0.0,
        importe: 0.0,
        importeDLLS: 0.0,
        importeSuma: 0.0,
        importeSumaDLLS: 0.0,
        saldoAFavor: 0.0,
        saldoAFavorDLLS: 0.0,
    });
    const [openDialogCliente, setOpenDialogCliente] = useState(false);
    const [dataTipoCambio, setDataTipoCambio] = React.useState([]);
    const [dataTipoPago, setDataTipoPago] = React.useState([]);
    const [dataConceptos, setDataConceptos] = React.useState([]);
    const [dataCuentasBanco, setDataCuentasBanco] = React.useState([]);
    const [dataCertificados, setDataCertificados] = React.useState([]);
    const columns = React.useMemo(() => [
        /*{
            headerName: "Acciones",
            sortable: false, filterable: false,
            width: 200,
            field: "",
            renderCell: (row) => {
                return (
                    <Root>
                        <Tooltip title="Modificar" disabled={!validarDerecho(9101457) || row.row.m_sEstatusGuia === "Cancelado"}>
                            <a
                                onClick={() => (handleShowModificar(row.row,row.row.m_nIdGuia,row.row.m_nFolioGuia))}
                                className="btn btn-default btn-xs"><i className="fa fa-pencil-square-o"
                                                                      style={{color: "#F9A03E"}}/></a>

                        </Tooltip>
                        <Tooltip title="Consultar">
                            <a className="btn btn-default btn-xs"
                               onClick={() => (handleShowConsultar(row.row.m_nIdGuia))}><i className="fa fa-eye"
                                                                                           style={{color: "#F9A03E"}}/></a>

                        </Tooltip>
                        <Tooltip title="Reporte" disabled={!validarDerecho(9101462)}>
                            <a className="btn btn-default btn-xs"
                               onClick={() => generarReporte(row.row)}><i
                                className="zmdi zmdi-file"
                                style={{color: "#F9A03E"}}/></a>

                        </Tooltip>
                        { row.row.EntregaEnSucursal &&
                            <Tooltip title="Ocurre" disabled={!validarDerecho(9101463) || row.row.m_sEstatusGuia === "Cancelado"}>
                                <a className="btn btn-default btn-xs"
                                   onClick={(event) => mostrarDialogoOcurre(event, row.row.m_nIdGuia)}><i
                                    className="zmdi zmdi-sign-in" style={{color: "#F9A03E"}}/></a>

                            </Tooltip>
                        }
                        <Tooltip title="Imprimir" disabled={!validarDerecho(9101464) || row.row.m_sEstatusGuia === "Cancelado"}>
                            <a className="btn btn-default btn-xs"
                               onClick={(event) => {
                                   /!*mostrarDialogoEtiqueta(event,row.row.m_nIdGuia)*!/
                                   handleOnClickImprimirEtiquetas(row.row.m_nIdGuia)
                               }}>
                                <i className="zmdi zmdi-print" style={{color: "#F9A03E"}}/>
                            </a>

                        </Tooltip>
                        <Tooltip title="Descargar PDF con etiquetas" disabled={!validarDerecho(9101465) || row.row.m_sEstatusGuia === "Cancelado"}>
                            <a className="btn btn-default btn-xs" onClick={() => handleOnClickDescargarEtiquetas(row.row.m_nIdGuia, row.row.m_nFolioGuia)}>
                                <i className="zmdi zmdi-inbox" style={{color: "#F9A03E"}}/>
                            </a>

                        </Tooltip>

                        <Tooltip title="Reenviar correo de seguimiento"  disabled={!validarDerecho(9101458) || row.row.m_sEstatusGuia === "Cancelado"} >
                            <a className="btn btn-default btn-xs"
                               onClick={() => handleReenviarCorreo(row.row.m_nIdGuia)}><EmailIcon style={{paddingTop:"2px"}}/></a>

                        </Tooltip>

                        <Tooltip title="Eliminar" disabled={!validarDerecho(9101458)}>
                            <a className="btn btn-default btn-xs"
                               onClick={() => (handleEliminar(row.row.m_nIdGuia))}><i className="zmdi zmdi-delete"
                                                                                      style={{color: "#F30B0B"}}/></a>

                        </Tooltip>
                    </Root>
                );
            }
        },*/
        {
            headerName: "Documento",
            field: "Factura",
            width: 220,
        },
        {
            headerName: "Viaje",
            field: "NumeroViajeFactura",
            width: 270,
        },
        {
            headerName: "Fecha",
            field: "FechaFactura",
            width: 150
        },
        {
            headerName: "Total",
            field: "TotalFactura",
            width: 150,
            valueFormatter: (params) => {
                return new Intl.NumberFormat('en-US', {
                    style: 'currency',
                    currency: 'USD',
                    minimumFractionDigits: 2,
                }).format(params.value);
            }
        },
        {
            headerName: "Importe",
            field: "ImporteFactura",
            width: 150,
            valueFormatter: (params) => {
                return new Intl.NumberFormat('en-US', {
                    style: 'currency',
                    currency: 'USD',
                    minimumFractionDigits: 2,
                }).format(params.value);
            },
            editable: true,
            renderHeader: (params: GridColumnHeaderParams) => (
                <strong>
                    {'Importe '}
                    <span role="img" aria-label="enjoy">
                      💵
                    </span>
                </strong>
            ),
        },
        {
            headerName: "Cliente",
            field: "ClienteFactura",
            width: 200,
        },
        {
            headerName: "Saldo",
            field: "AbonosFactura",
            width: 150,
            valueFormatter: (params) => {
                return new Intl.NumberFormat('en-US', {
                    style: 'currency',
                    currency: 'USD',
                    minimumFractionDigits: 2,
                }).format(params.value);
            },
        },
        {
            headerName: "Moneda",
            field: "MonedaFactura",
            width: 100,
        },
    ]);

    useEffect(()=>{
        getTipoCambio();
        getAllTipoPago();
        getAllConceptosCobranza();
        getAllCuentasBancarias();
        getAllCertificados();
    },[])

    useEffect(()=>{
        setListado(guias);
        if(guias.length > 0){
            obtenerClienteId(guias[0]?.IdClienteFactura).then(({data}) => {
                setForm({
                    ...form,
                    cliente: data,
                    idCliente: data.m_nIdCliente,
                    saldoTotal: data.m_cySaldoCredito,
                    saldoTotalDLLS: data.m_cySaldoCreditoDLLS,
                });
            })
        }
    }, [guias])

    function getTipoCambio() {
        obtenerTipoCambio().then(respuesta => {
            setDataTipoCambio(respuesta.data);
            setForm({
                ...form,
                tipoCambio: respuesta.data[0]?.m_nIdTipoCambio
            });
        });
    }

    const getAllTipoPago = () => {
        obtenerTiposPago().then(({data}) => {
            setDataTipoPago(data);
        })
    }

    const getAllConceptosCobranza = () => {
        obtenerConceptosCobranza().then(({data}) => {
            setDataConceptos(data);
        })
    }

    const getAllCuentasBancarias = () => {
        obtenerCuentasBancarias().then(({data}) => {
            setDataCuentasBanco(data);
        })
    }

    const getAllCertificados = () => {
        obtenerParametrosConfiguracionCortes().then(({data}) => {
            setDataCertificados(data);
        })
    }

    const handleAcceptClick = () => {
        //console.log(listado);
        //console.log(form);
        if(validarFormulario()){
            let listadoFacturas = listado.map((item) => ({
                idFactura: item.idFactura,
                importe: parseFloat(item.ImporteFactura),
                idMoneda: item.IdMonedaFactura,
                referencia: item.ReferenciaFactura,
                idSucursal: item.IdSucursalFactura,
                idContraReciboCliente: 0,
                esFactoraje: 0,
                importeCompensacion: 0.0,
                documentoConFactoraje: 0,
                idCliente: item.IdClienteFactura,
                metodoPago: form.formaPago
            }));
            let params = {
                fechaHora: form.fechaMovimiento + " " + form.horaMovimiento,
                idCuentaBancaria: form.idCuentaBancaria,
                importe: form.importe,
                tipoCambio: dataTipoCambio.find((item) => item.m_nIdTipoCambio === form.tipoCambio)?.m_cTipoCambio,
                referenciaBancaria: form.referenciaBancaria,
                idConceptoCobranza: form.idConceptoCobranza,
                idCliente: form.idCliente,
                importeSaldoFavor: form.saldoAFavor,
                creadoPor: localStorage.getItem("UsuarioId"),
                creadoEl: moment(new Date()).format('YYYY-MM-DD HH:mm:ss'),
                dsProFacturas: "",
                facturas: listadoFacturas,
                idPeticion: 0,
                pagoConContraRecibo: 0,
                cobranzaExterna: 0,
                idCertificado: 0,
                claveMetodoPago: form.formaPago,
                rfcEmisorCtaOrd: "",
                nomBancoOrdExt: "",
                ctaOrdenante: "",
                tipoCodPago: "",
                certPago: "",
                cadPago: "",
                selloPago: "",
                fechaCobro: form.fechaCobro
            };
            console.log(params)
            agregarPagoCorte(params).then(({data}) => {
                showSuccess(data);
            })
            handleCloseClick();
        }
    };

    const handleCloseClick = () => {
        setListado([]);
        setForm({
            fechaMovimiento: moment(new Date()).format('YYYY-MM-DD'),
            horaMovimiento: moment(new Date()).format('HH:mm:ss'),
            fechaCobro: moment(new Date()).format('YYYY-MM-DD'),
            idCliente: null,
            cliente: '',
            aplicarPago: "",
            idAplicarPago: null,
            tipoCambio: 0.0,
            formaPago: null,
            cuentaBancaria: null,
            idCuentaBancaria: null,
            referenciaBancaria: "",
            conceptoCobranza: null,
            idConceptoCobranza: 2,
            saldoTotal: 0.0,
            saldoTotalDLLS: 0.0,
            importe: 0.0,
            importeDLLS: 0.0,
            importeSuma: 0.0,
            importeSumaDLLS: 0.0,
            saldoAFavor: 0.0,
            saldoAFavorDLLS: 0.0,
        });
        handleClose();
    };

    const handleRowSelection = (selectedRows) => {
        setListado(selectedRows);
    };

    const handleChange = (event) => {
        event.preventDefault();
        setForm({
            ...form,
            [event.target.name]: event.target.value,
        });
        if(event.target.name === "cambio" || event.target.name === "cuentaBancaria") {
            calcularImporteAPagar(form.importe);
        }
    }

    const handleChangeImporte = (event) => {
        event.preventDefault();
        const aPagar = parseFloat(event.target.value);
        calcularImporteAPagar(aPagar);
    }

    const calcularImporteAPagar = (aPagar) => {
        const cambio = dataTipoCambio.find((item) => item.m_nIdTipoCambio === form.tipoCambio)?.m_cTipoCambio;
        if(form.cuentaBancaria?.IdMoneda === 2){//Dólares
            setForm({
                ...form,
                saldoAFavorDLLS: aPagar - form.importeSumaDLLS,
                saldoAFavor: (aPagar * cambio) - form.importeSuma,
                importe: aPagar,
            });
        }else if(form.cuentaBancaria?.IdMoneda === 1){ //Pesos
            setForm({
                ...form,
                saldoAFavorDLLS: (aPagar / cambio) - form.importeSumaDLLS,
                saldoAFavor: aPagar - form.importeSuma,
                importe: aPagar,
            });
        }else{
            setForm({
                ...form,
                saldoAFavor: aPagar - form.importeSuma,
                importe: aPagar,
            });
        }
    }

    const dialogCliente = (isVisible) => {
        setOpenDialogCliente(isVisible);
    };

    const handlePatrocinadorSelected = (row) => {
        setForm({
            ...form,
            cliente: row,
            idCliente: row.m_nIdCliente,
            saldoTotal: row.m_nSaldoCliente,
            saldoTotalDLLS: row.m_nSaldoDLLSCliente,
        });
        setListado(guias.filter((item) => (item.IdClienteFactura === row.m_nIdCliente)));
        setOpenDialogCliente(false);
    }

    const calcularImporte = () => {
        let suma = 0.0;
        let sumaDLLS = 0.0;
        let saldoRestante;
        let saldoRestanteDLLS;
        const importe = parseFloat(form.importe);
        const cambio = dataTipoCambio.find((item) => item.m_nIdTipoCambio === form.tipoCambio)?.m_cTipoCambio;

        listado.forEach((guia) => {
            if(guia.MonedaFactura === "PESOS"){
                suma += parseFloat(guia.ImporteFactura);
            }else {
                sumaDLLS += parseFloat(guia.ImporteFactura);
            }
        })
        suma = suma + (sumaDLLS * cambio);
        sumaDLLS = sumaDLLS + (suma / cambio);
        if(form.cuentaBancaria.IdMoneda === 2){//Dólares
            saldoRestante = (importe * cambio) - suma;
            saldoRestanteDLLS = importe - sumaDLLS;
        }else {
            saldoRestante = importe - suma;
            saldoRestanteDLLS = (importe / cambio) - sumaDLLS;
        }
        setForm({
            ...form,
            importeSuma: suma,
            importeSumaDLLS: sumaDLLS,
            saldoAFavor: saldoRestante,
            saldoAFavorDLLS: saldoRestanteDLLS
        })
    }

    const validarFormulario = () => {
        let camposFaltantes = "Favor de completar el/los campo(s): ";
        let valido = true;
        if(form.fechaMovimiento == null){
            camposFaltantes += "fecha de movimiento, ";
            valido = false;
        }
        if(form.horaMovimiento == null){
            camposFaltantes += "hora de movimiento, ";
            valido = false;
        }
        if(form.fechaCobro == null){
            camposFaltantes += "fecha de cobro, ";
            valido = false;
        }
        if(form.idCliente == null || form.idCliente == 0 || form.cliente == null || form.cliente == 0){
            camposFaltantes += "cliente, ";
            valido = false;
        }
        if(form.tipoCambio == null){
            camposFaltantes += "tipo de cambio, ";
            valido = false;
        }
        if(form.formaPago == null || form.formaPago == 0){
            camposFaltantes += "forma de pago, ";
            valido = false;
        }
        if(form.idCuentaBancaria == null || form.idCuentaBancaria == 0){
            camposFaltantes += "cuenta bancaria, ";
            valido = false;
        }
        if(form.referenciaBancaria == null || form.referenciaBancaria === ""){
            camposFaltantes += "referencia bancaría, ";
            valido = false;
        }
        if(form.idConceptoCobranza == null || form.idConceptoCobranza == 0){
            camposFaltantes += "concepto cobranza, ";
            valido = false;
        }
        if(form.importe == null || form.importe === 0.0){
            camposFaltantes += "importe, ";
            valido = false;
        }
        if(form.importeSuma == null || form.importeSuma === 0.0){
            camposFaltantes += "importes en listado de facturas, ";
            valido = false;
        }
        if(!valido){
            camposFaltantes = camposFaltantes.substring(0, camposFaltantes.length - 2);
            camposFaltantes += ". "
        }
        if(form.importeSuma > form.importe){
            showError("No cuadra el importe del movimiento bancario con la suma de los importes a pagar.");
            valido = false;
        }

        if(!valido){
            showError(camposFaltantes);
        }
        return valido;
    }

    return (
        <div>
            <Dialog
                open={openDialogCliente}
                onClose={() => setOpenDialogCliente(false)}
                fullWidth maxWidth="md"
            >
                <DialogContent>
                    <DialogTableClientes dialogVisible={dialogCliente} handlePatrocinadorSelected={handlePatrocinadorSelected}/>
                </DialogContent>
            </Dialog>

            <Dialog open={open} onClose={handleCloseClick} fullWidth maxWidth={"xl"}>
                <DialogTitle variant={"h3"}>Agregar pago/abono de facturas de guías</DialogTitle>
                <form className="j-forms" onSubmit={handleAcceptClick}>
                    <DialogContent>
                        {/*<div className="widget-container" style={{height: '800px'}}>*/}
                        {/*<div className="widget-content">
                                <div className="row">*/}
                        <Grid container spacing={3}>
                            <Grid item xs={4}>
                                <TextField
                                    variant="outlined"
                                    margin="dense"
                                    fullWidth
                                    autoFocus
                                    id="idFechaMovimiento"
                                    name="fechaMovimiento"
                                    label="Fecha movimiento"
                                    type="date"
                                    onChange={handleChange}
                                    value={form.fechaMovimiento}
                                    className={"form-control"}
                                    InputLabelProps={{shrink: true,}}
                                    required
                                />
                            </Grid>
                            <Grid item xs={2}>
                                <TextField
                                    variant="outlined"
                                    margin="dense"
                                    fullWidth
                                    autoFocus
                                    id="idHoraMovimiento"
                                    name="horaMovimiento"
                                    label="Hora movimiento"
                                    type="time"
                                    format="HH:mm:ss"
                                    inputProps={{ step: 1 }}
                                    onChange={handleChange}
                                    value={form.horaMovimiento}
                                    className={"form-control"}
                                    InputLabelProps={{shrink: true,}}
                                    required
                                />
                            </Grid>
                            <Grid item xs={6}>
                                <TextField
                                    variant="outlined"
                                    margin="dense"
                                    fullWidth
                                    autoFocus
                                    id="idfechaCobro"
                                    name="fechaCobro"
                                    label="Fecha cobro"
                                    type="date"
                                    onChange={handleChange}
                                    value={form.fechaCobro}
                                    className={"form-control"}
                                    InputLabelProps={{shrink: true,}}
                                    required
                                />
                            </Grid>
                            <Grid item xs={6}>
                                <div className="input">
                                    <TextField
                                        variant="outlined"
                                        label="Cliente"
                                        size="small"
                                        value={form.cliente?.m_sNombreFiscal || ''}
                                        placeholder={"No. Cliente: Nombre fiscal"}
                                        InputLabelProps={{shrink: true}}
                                        onClick={()=>{setOpenDialogCliente(true)}}
                                    />
                                </div>
                            </Grid>
                            <Grid item xs={4}>
                                <FormControl fullWidth variant="outlined"
                                             required={(dataCertificados.length > 0)}
                                             size="small">
                                    <InputLabel id="aplicarPagoLabel">
                                        Aplicar pago de
                                    </InputLabel>
                                    <Select
                                        labelId="aplicarPagoLabel"
                                        label="Aplicar pago de"
                                        className="form-control"
                                        value={form.idAplicarPago}
                                        onChange={(event) => {
                                            event.preventDefault();
                                            if(event.target.value != 0){
                                                setForm({
                                                    ...form,
                                                    aplicarPago: dataCertificados.find((item) => item.IdCertificado === event.target.value),
                                                    idAplicarPago: event.target.value
                                                });
                                            }else{
                                                setForm({
                                                    ...form,
                                                    aplicarPago: null,
                                                    idAplicarPago: event.target.value
                                                });
                                            }
                                        }}
                                        disabled={(dataCertificados.length <= 0)}
                                        id="aplicarPago"
                                        InputLabelProps={{shrink: true}}
                                    >
                                        <MenuItem value="0">Seleccionar</MenuItem>
                                        {
                                            dataCertificados.map((cer) => (
                                                <MenuItem
                                                    key={cer.IdCertificado}
                                                    value={cer.IdCertificado}
                                                >
                                                    {cer.RFC}
                                                </MenuItem>
                                            ))
                                        }
                                    </Select>
                                </FormControl>
                            </Grid>
                            <Grid item xs={2}>
                                <FormControl fullWidth variant="outlined" required size="small">
                                    <InputLabel id="tipoCambioLabel">
                                        Tipo de Cambio
                                    </InputLabel>
                                    <Select
                                        labelId="tipoCambioLabel"
                                        label="Tipo de Cambio"
                                        className="form-control"
                                        value={form.tipoCambio}
                                        onChange={(event) => {
                                            event.preventDefault();
                                            setForm({
                                                ...form,
                                                tipoCambio: event.target.value,
                                            });
                                        }}
                                        id="tipoCambio"
                                        InputLabelProps={{shrink: true}}
                                    >
                                        {dataTipoCambio.map((cambio) => (
                                            <MenuItem
                                                key={cambio.m_nIdTipoCambio}
                                                value={cambio.m_nIdTipoCambio}
                                            >
                                                {cambio.m_cTipoCambio.toFixed(2)}
                                            </MenuItem>
                                        ))}
                                    </Select>
                                </FormControl>
                            </Grid>
                            <Grid item xs={6}>
                                <FormControl fullWidth variant="outlined" required size="small">
                                    <InputLabel id="idTipoPagoLabel">Forma de pago</InputLabel>
                                    <Select
                                        fullWidth
                                        labelId="idTipoPagoLabel"
                                        label="Forma de Pago"
                                        className="form-control"
                                        value={form.formaPago}
                                        onChange={(event) => {
                                            event.preventDefault();
                                            setForm({
                                                ...form,
                                                formaPago: event.target.value,
                                            });
                                        }}
                                        id="formaPago"
                                        name="formaPago"
                                        InputLabelProps={{shrink: true,}}
                                    >
                                        <MenuItem value="0">Seleccionar</MenuItem>
                                        {dataTipoPago.map((pago) => (
                                            <MenuItem
                                                key={pago.m_nIdTipoPago}
                                                value={pago.m_nIdTipoPago}
                                            >
                                                {pago.m_sTipoPago}
                                            </MenuItem>
                                        ))}
                                    </Select>
                                </FormControl>
                            </Grid>
                            <Grid item xs={6}>
                                <FormControl fullWidth variant="outlined" required size="small">
                                    <InputLabel id="cuentaBancariaLabel">
                                        Cuenta bancaria
                                    </InputLabel>
                                    <Select
                                        labelId="cuentaBancariaLabel"
                                        label="Cuenta bancaria"
                                        className="form-control"
                                        value={form.idCuentaBancaria}
                                        onChange={(event) => {
                                            event.preventDefault();
                                            if(event.target.value != 0){
                                                setForm({
                                                    ...form,
                                                    idCuentaBancaria: event.target.value,
                                                    cuentaBancaria: dataCuentasBanco.find((item) => item.IdCuentaBancaria === event.target.value)
                                                });
                                            }else {
                                                setForm({
                                                    ...form,
                                                    idCuentaBancaria: event.target.value,
                                                    cuentaBancaria: null
                                                });
                                            }
                                        }}
                                        id="cuentaBancaria"
                                        InputLabelProps={{shrink: true}}
                                    >
                                        <MenuItem value="0">Seleccionar</MenuItem>
                                        {dataCuentasBanco.map((cuentas) => (
                                            <MenuItem
                                                key={cuentas.IdCuentaBancaria}
                                                value={cuentas.IdCuentaBancaria}
                                            >
                                                {cuentas.NumeroCuenta + " - " + cuentas.CuentaBancaria}
                                            </MenuItem>
                                        ))}
                                    </Select>
                                </FormControl>
                            </Grid>
                            <Grid item xs={2}>
                                <TextField
                                    variant="outlined"
                                    margin="dense"
                                    fullWidth
                                    autoFocus
                                    id="idImporte"
                                    name="importe"
                                    label="Importe Depositado"
                                    type="number"
                                    onChange={handleChangeImporte}
                                    value={form.importe}
                                    className={"form-control"}
                                    InputLabelProps={{shrink: true,}}
                                    required
                                />
                            </Grid>
                            <Grid item xs={1}>
                                <TextField
                                    variant="outlined"
                                    margin="dense"
                                    fullWidth
                                    autoFocus
                                    id="idMoneda"
                                    name="moneda"
                                    label="Moneda"
                                    type="text"
                                    disabled
                                    value={form?.cuentaBancaria?.Moneda}
                                    className={"form-control"}
                                    InputLabelProps={{shrink: true,}}
                                />
                            </Grid>
                            <Grid item xs={3}>
                                <TextField
                                    variant="outlined"
                                    margin="dense"
                                    fullWidth
                                    autoFocus
                                    id="idreferenciaBancaria"
                                    name="referenciaBancaria"
                                    label="Referencia bancaria"
                                    type="text"
                                    onChange={handleChange}
                                    value={form.referenciaBancaria}
                                    className={"form-control"}
                                    InputLabelProps={{shrink: true,}}
                                    required
                                />
                            </Grid>
                            <Grid item xs={2}>
                                <FormControl fullWidth variant="outlined" required size="small">
                                    <InputLabel id="conceptoCobranzaLabel">
                                        Concepto de cobranza
                                    </InputLabel>
                                    <Select
                                        labelId="conceptoCobranzaLabel"
                                        label="Concepto de cobranza"
                                        className="form-control"
                                        value={form.idConceptoCobranza}
                                        onChange={(event) => {
                                            event.preventDefault();
                                            if(event.target.value != 0){
                                                setForm({
                                                    ...form,
                                                    conceptoCobranza: dataConceptos.find((item) => item.IdConceptoCobranza === event.target.value),
                                                    idConceptoCobranza: event.target.value,
                                                });
                                            }else {
                                                setForm({
                                                    ...form,
                                                    conceptoCobranza: null,
                                                    idConceptoCobranza: event.target.value,
                                                });
                                            }
                                        }}
                                        id="conceptoCobranza"
                                        InputLabelProps={{shrink: true}}
                                    >
                                        <MenuItem value="0">Seleccionar</MenuItem>
                                        {dataConceptos.map((concepto) => (
                                            <MenuItem
                                                key={concepto.IdConceptoCobranza}
                                                value={concepto.IdConceptoCobranza}
                                            >
                                                {concepto.ConceptoCobranza}
                                            </MenuItem>
                                        ))}
                                    </Select>
                                </FormControl>
                            </Grid>
                            <Grid item xs={12} fullWidth>
                                <DataGrid
                                    localeText={dataGridLocaleText}
                                    rows={listado}
                                    columns={columns}
                                    density="compact"
                                    pageSize={Math.floor((window.innerHeight - 300) / 30)}
                                    getRowId={(row) => row.idGuia}
                                    /*checkboxSelection
                                    onRowSelectionModelChange={(newModel) => {
                                        handleRowSelection(newModel);
                                    }}
                                    rowSelectionModel={listado}*/
                                    processRowUpdate={(updatedRow, originalRow) =>{
                                        if(updatedRow !== originalRow){
                                            const row = guias.find((item) => item.idGuia === updatedRow.idGuia);
                                            row.ImporteFactura = updatedRow.ImporteFactura;
                                            calcularImporte();
                                        }
                                    }}
                                />
                            </Grid>
                            <Grid item xs={2}>
                                <TextField
                                    variant="outlined"
                                    margin="dense"
                                    fullWidth
                                    autoFocus
                                    id="idSaldoTotal"
                                    name="saldoTotal"
                                    label="Saldo Total"
                                    type="number"
                                    disabled
                                    value={form.saldoTotal}
                                    className={"form-control"}
                                    InputLabelProps={{shrink: true}}
                                />
                            </Grid>
                            <Grid item xs={2}>
                                <TextField
                                    variant="outlined"
                                    margin="dense"
                                    fullWidth
                                    autoFocus
                                    id="idSaldoTotalDLLS"
                                    name="saldoTotalDLLS"
                                    label="Saldo Total (DLLS)"
                                    type="number"
                                    disabled
                                    value={form.saldoTotalDLLS}
                                    className={"form-control"}
                                    InputLabelProps={{shrink: true}}
                                />
                            </Grid>
                            <Grid item xs={2}>
                                <TextField
                                    variant="outlined"
                                    margin="dense"
                                    fullWidth
                                    autoFocus
                                    id="idImporteSuma"
                                    name="importeSuma"
                                    label="Importe a Pagar (MXN)"
                                    type="number"
                                    disabled
                                    value={form.importeSuma.toFixed(2)}
                                    className={"form-control"}
                                    InputLabelProps={{shrink: true}}
                                />
                            </Grid>
                            <Grid item xs={2}>
                                <TextField
                                    variant="outlined"
                                    margin="dense"
                                    fullWidth
                                    autoFocus
                                    id="idImporteSumaDLLS"
                                    name="importeSumaDLLS"
                                    label="Importe a Pagar (USD)"
                                    type="number"
                                    disabled
                                    value={form.importeSumaDLLS.toFixed(2)}
                                    className={"form-control"}
                                    InputLabelProps={{shrink: true}}
                                />
                            </Grid>
                            <Grid item xs={2}>
                                <TextField
                                    variant="outlined"
                                    margin="dense"
                                    fullWidth
                                    autoFocus
                                    id="idSaldoAFavor"
                                    name="saldoAFavor"
                                    label="Saldo a Favor (MXN)"
                                    type="number"
                                    disabled
                                    value={form.saldoAFavor.toFixed(2)}
                                    className={"form-control"}
                                    InputLabelProps={{shrink: true}}
                                />
                            </Grid>
                            <Grid item xs={2}>
                                <TextField
                                    variant="outlined"
                                    margin="dense"
                                    fullWidth
                                    autoFocus
                                    id="idSaldoAFavorDLLS"
                                    name="saldoAFavorDLLS"
                                    label="Saldo a Favor (USD)"
                                    type="number"
                                    disabled
                                    value={form.saldoAFavorDLLS.toFixed(2)}
                                    className={"form-control"}
                                    InputLabelProps={{shrink: true}}
                                />
                            </Grid>
                        </Grid>
                    </DialogContent>
                </form>
            <DialogActions>
                <Button onClick={handleCloseClick}>Cerrar</Button>
                    <Button type={"submit"} onClick={handleAcceptClick} color="primary" autoFocus>
                        Aceptar
                    </Button>
                </DialogActions>
            </Dialog>
        </div>
    );
}
