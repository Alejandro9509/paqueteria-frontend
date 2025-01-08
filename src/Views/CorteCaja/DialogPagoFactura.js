import React, {useEffect, useState} from 'react';
import {
    Button, Checkbox, Chip,
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle, FormControlLabel, Grid, MenuItem, Tooltip, Typography
} from '@mui/material';
import {showSuccess, validarDerecho} from "../../Util/Util";
import {DataGrid} from "@mui/x-data-grid";
import {dataGridLocaleText} from "../../Constants";
import {
    obtenerFacturasCorteByIds
} from "../../Util/Contexts/CorteCajaContext";
import CheckBoxOutlineBlankIcon from "@mui/icons-material/CheckBoxOutlineBlank";
import CheckBoxIcon from "@mui/icons-material/CheckBox";
import TextField from "@mui/material/TextField";
import DialogTableClientes from "../Clientes/DialogTableClientes";
import {obtenerTipoCambio} from "../../Util/Contexts/TipoCambioContext";
import InputLabel from "@mui/material/InputLabel";
import Select from "@mui/material/Select";
import FormControl from "@mui/material/FormControl";
import {obtenerTiposPago} from "../../Util/Contexts/TipoPagoContext";
import {obtenerConceptosCobranza} from "../../Util/Contexts/ConceptosCobranzaContext";
import {obtenerCuentasBancarias} from "../../Util/Contexts/CuentasBancariasContext";

export default function DialogPagoFactura({ open, handleClose, guias }) {
    const [listado, setListado] = useState(guias);
    const [form, setForm] = useState({
        fechaMovimiento: null,
        fechaCobro: null,
        idCliente: null,
        cliente: '',
        aplicarPago: "",
        tipoCambio: 0.0,
        formaPago: null,
        cuentaBancaria: null,
        idCuentaBancaria: null,
        referenciaBancaria: "",
        conceptoCobranza: null,
        idConceptoCobranza: null,
        saldoTotal: 0.0,
        importe: 0.0,
        importeSuma: 0.0,
        saldoAFavor: 0.0
    });
    const [openDialogCliente, setOpenDialogCliente] = useState(false);
    const [dataTipoCambio, setDataTipoCambio] = React.useState([]);
    const [dataTipoPago, setDataTipoPago] = React.useState([]);
    const [dataConceptos, setDataConceptos] = React.useState([]);
    const [dataCuentasBanco, setDataCuentasBanco] = React.useState([]);
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
            width: 200,
        },
        {
            headerName: "Viaje",
            field: "NumeroViajeFactura",
            width: 200,
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
            editable: true
        },
        {
            headerName: "Referencia",
            field: "ReferenciaFactura",
            width: 200,
        },
        {
            headerName: "Saldo",
            field: "SaldoClienteFactura",
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

    useEffect(() => {
        /*let ids = [];
        guias.forEach(guia => {
            ids.push(guia.idFactura);
        })
        obtenerFacturasCorteByIds(ids).then(({data}) => {
            console.log(data) //setListado(data)
        })*/
    },[guias])

    useEffect(()=>{
        getTipoCambio();
        getAllTipoPago();
        getAllConceptosCobranza();
        getAllCuentasBancarias();
    },[])

    function getTipoCambio() {
        obtenerTipoCambio().then(respuesta => {
            setDataTipoCambio(respuesta.data)
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

    const handleAcceptClick = () => {
        //handleAccept(listadoSeleccion);
        console.log(guias);
        handleCloseClick();
    };

    const handleCloseClick = () => {
        setListado([])
        handleClose();
    };

    const handleRowSelection = (selectedRows) => {
        setListado(selectedRows)
    };

    const handleChange = (event) => {
        event.preventDefault();
        setForm({
            [event.target.name]: event.target.value,
        });
    }

    const dialogCliente = (isVisible) => {
        setOpenDialogCliente(isVisible);
    };

    const handlePatrocinadorSelected = (row) => {
        setForm({
            cliente: row,
            idCliente: row.id
        });
        setOpenDialogCliente(false);
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
                            <Grid item xs={6}>
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
                            <Grid item xs={6}>
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
                                        <MenuItem value="0">Seleccionar</MenuItem>
                                        {dataTipoCambio.map((cambio) => (
                                            <MenuItem
                                                key={cambio.m_nIdTipoCambio}
                                                value={cambio.m_nIdTipoCambio}
                                            >
                                                {cambio.m_cTipoCambio.toFixed(4)}
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
                            <Grid item xs={5}>
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
                                            setForm({
                                                ...form,
                                                idCuentaBancaria: event.target.value,
                                                cuentaBancaria: dataCuentasBanco.find((item) => item.IdCuentaBancaria === event.target.value)
                                            });
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
                                    type="money"
                                    onChange={handleChange}
                                    value={form.importe}
                                    className={"form-control"}
                                    InputLabelProps={{shrink: true,}}
                                    required
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
                                            setForm({
                                                ...form,
                                                conceptoCobranza: dataConceptos.find((item) => item.IdConceptoCobranza === event.target.value),
                                                idConceptoCobranza: event.target.value,
                                            });
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
                                    rows={guias}
                                    columns={columns}
                                    density="compact"
                                    pageSize={Math.floor((window.innerHeight - 300) / 30)}
                                    getRowId={(row) => row.idGuia}
                                    // checkboxSelection
                                    // onRowSelectionModelChange={(newModel) => {
                                    //     setSelection(newModel)
                                    // }}
                                    //rowSelectionModel={selection}
                                    //disableSelectionOnClick={props.disabled}
                                    processRowUpdate={(updatedRow, originalRow) =>{
                                        if(updatedRow !== originalRow){
                                            console.log(updatedRow);
                                        }
                                    }}
                                />
                            </Grid>
                            <Grid item xs={4}>
                                <TextField
                                    variant="outlined"
                                    margin="dense"
                                    fullWidth
                                    autoFocus
                                    id="idSaldoTotal"
                                    name="saldoTotal"
                                    label="Saldo Total"
                                    type="text"
                                    disabled
                                    value={form.saldoTotal}
                                    className={"form-control"}
                                    InputLabelProps={{shrink: true}}
                                />
                            </Grid>
                            <Grid item xs={4}>
                                <TextField
                                    variant="outlined"
                                    margin="dense"
                                    fullWidth
                                    autoFocus
                                    id="idImporteSuma"
                                    name="importeSuma"
                                    label="Importe a Pagar"
                                    type="text"
                                    disabled
                                    value={form.importeSuma}
                                    className={"form-control"}
                                    InputLabelProps={{shrink: true}}
                                />
                            </Grid>
                            <Grid item xs={4}>
                                <TextField
                                    variant="outlined"
                                    margin="dense"
                                    fullWidth
                                    autoFocus
                                    id="idSaldoAFavor"
                                    name="saldoAFavor"
                                    label="Saldo a Favor"
                                    type="text"
                                    disabled
                                    value={form.saldoAFavor}
                                    className={"form-control"}
                                    InputLabelProps={{shrink: true}}
                                />
                            </Grid>
                        </Grid>
                        {/*</div>
                            </div>*/}
                        {/*</div>*/}
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
