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
            cliente: "",
            fechaVigencia:"",
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
            tarifasSeleccionadas : [
                {
                    "m_nIdTarifa": 65,
                    "m_nIdSucursal": 19,
                    "m_sDestino": "Ciudad de México",
                    "m_nIdDestino": 24301,
                    "m_sSucursal": "Mérida",
                    "m_bPorRango": true,
                    "m_bPorPesoVolumen": false,
                    "m_nFactorConversion": 1,
                    "m_cPrecioM3": 1,
                    "m_cPrecioKilo": 1,
                    "m_cFleteMinimo": 1,
                    "m_cMontoMinimo": 1,
                    "m_nIdImpuestoRetiene": 0,
                    "m_nIdImpuestoTraslada": 0,
                    "m_nCreadoPor": 0,
                    "m_bActivo": true,
                    "m_nModificadoPor": 1014,
                    "m_dtCreadoEl": "2021-08-17T09:18:30.000",
                    "m_dtModificadoEl": "2021-08-19T22:17:48.000",
                    "m_cCostoFinal": 0,
                    "m_arrArCobros": [],
                    "m_arrArServicios": [],
                    "m_arrArConceptos": [
                        {
                            "m_nIdTarifaConceptos": 474,
                            "m_nIdTarifa": 65,
                            "m_sConcepto": "Entrega",
                            "m_cImporte": 700,
                            "m_nIdImpuestoTraslada": 3,
                            "m_cImporteIva": 112,
                            "m_nIdImpuestoRetiene": 11,
                            "m_cImporteRetiene": 28,
                            "m_dtCreadoEl": "2021-08-25T10:39:09.875",
                            "m_nCreadoPor": 0,
                            "m_dtModificadoEl": "2021-08-25T10:39:09.875",
                            "m_nModificadoPor": 0,
                            "m_bActivo": false,
                            "m_nIdConceptosFacturacion": 52,
                            "m_xnRangoMinimo": 1,
                            "m_xnRangoMaximo": 5,
                            "m_nIdTipoCalculo": 1,
                            "m_nIdAgregadoDesde": 2,
                            "mg_sUltimoError": "",
                            "arClsDetalle": [
                                {
                                    "m_nIdConceptosFacturacionDetalle": 39,
                                    "m_nIdConceptosFacturacion": 52,
                                    "m_nIdImpuesto": 2,
                                    "m_sImpuesto": "IVA 11%",
                                    "m_xPorcentaje": 11,
                                    "m_bTrasladado": true,
                                    "m_bPredeterminado": false,
                                    "m_sUltimoError": "",
                                    "m_sMsgUltimoError": ""
                                },
                                {
                                    "m_nIdConceptosFacturacionDetalle": 40,
                                    "m_nIdConceptosFacturacion": 52,
                                    "m_nIdImpuesto": 10,
                                    "m_sImpuesto": "IVA 8%",
                                    "m_xPorcentaje": 8,
                                    "m_bTrasladado": false,
                                    "m_bPredeterminado": false,
                                    "m_sUltimoError": "",
                                    "m_sMsgUltimoError": ""
                                },
                                {
                                    "m_nIdConceptosFacturacionDetalle": 79,
                                    "m_nIdConceptosFacturacion": 52,
                                    "m_nIdImpuesto": 1,
                                    "m_sImpuesto": "IVA 0%",
                                    "m_xPorcentaje": 0,
                                    "m_bTrasladado": true,
                                    "m_bPredeterminado": false,
                                    "m_sUltimoError": "",
                                    "m_sMsgUltimoError": ""
                                },
                                {
                                    "m_nIdConceptosFacturacionDetalle": 80,
                                    "m_nIdConceptosFacturacion": 52,
                                    "m_nIdImpuesto": 11,
                                    "m_sImpuesto": "IVA 4%",
                                    "m_xPorcentaje": 4,
                                    "m_bTrasladado": false,
                                    "m_bPredeterminado": false,
                                    "m_sUltimoError": "",
                                    "m_sMsgUltimoError": ""
                                },
                                {
                                    "m_nIdConceptosFacturacionDetalle": 83,
                                    "m_nIdConceptosFacturacion": 52,
                                    "m_nIdImpuesto": 3,
                                    "m_sImpuesto": "IVA 16%",
                                    "m_xPorcentaje": 16,
                                    "m_bTrasladado": true,
                                    "m_bPredeterminado": false,
                                    "m_sUltimoError": "",
                                    "m_sMsgUltimoError": ""
                                }
                            ]
                        },
                        {
                            "m_nIdTarifaConceptos": 485,
                            "m_nIdTarifa": 65,
                            "m_sConcepto": "Seguro transporte",
                            "m_cImporte": 1,
                            "m_nIdImpuestoTraslada": 3,
                            "m_cImporteIva": 0.16,
                            "m_nIdImpuestoRetiene": 12,
                            "m_cImporteRetiene": 0,
                            "m_dtCreadoEl": "2021-08-25T10:39:10.033",
                            "m_nCreadoPor": 0,
                            "m_dtModificadoEl": "2021-08-25T10:39:10.033",
                            "m_nModificadoPor": 0,
                            "m_bActivo": false,
                            "m_nIdConceptosFacturacion": 57,
                            "m_xnRangoMinimo": 0,
                            "m_xnRangoMaximo": 0,
                            "m_nIdTipoCalculo": 0,
                            "m_nIdAgregadoDesde": 0,
                            "mg_sUltimoError": "",
                            "arClsDetalle": [
                                {
                                    "m_nIdConceptosFacturacionDetalle": 77,
                                    "m_nIdConceptosFacturacion": 57,
                                    "m_nIdImpuesto": 2,
                                    "m_sImpuesto": "IVA 11%",
                                    "m_xPorcentaje": 11,
                                    "m_bTrasladado": true,
                                    "m_bPredeterminado": false,
                                    "m_sUltimoError": "",
                                    "m_sMsgUltimoError": ""
                                },
                                {
                                    "m_nIdConceptosFacturacionDetalle": 78,
                                    "m_nIdConceptosFacturacion": 57,
                                    "m_nIdImpuesto": 10,
                                    "m_sImpuesto": "IVA 8%",
                                    "m_xPorcentaje": 8,
                                    "m_bTrasladado": false,
                                    "m_bPredeterminado": false,
                                    "m_sUltimoError": "",
                                    "m_sMsgUltimoError": ""
                                },
                                {
                                    "m_nIdConceptosFacturacionDetalle": 106,
                                    "m_nIdConceptosFacturacion": 57,
                                    "m_nIdImpuesto": 3,
                                    "m_sImpuesto": "IVA 16%",
                                    "m_xPorcentaje": 16,
                                    "m_bTrasladado": true,
                                    "m_bPredeterminado": true,
                                    "m_sUltimoError": "",
                                    "m_sMsgUltimoError": ""
                                },
                                {
                                    "m_nIdConceptosFacturacionDetalle": 107,
                                    "m_nIdConceptosFacturacion": 57,
                                    "m_nIdImpuesto": 1,
                                    "m_sImpuesto": "IVA 0%",
                                    "m_xPorcentaje": 0,
                                    "m_bTrasladado": true,
                                    "m_bPredeterminado": false,
                                    "m_sUltimoError": "",
                                    "m_sMsgUltimoError": ""
                                },
                                {
                                    "m_nIdConceptosFacturacionDetalle": 108,
                                    "m_nIdConceptosFacturacion": 57,
                                    "m_nIdImpuesto": 4,
                                    "m_sImpuesto": "IVA %8",
                                    "m_xPorcentaje": 8,
                                    "m_bTrasladado": true,
                                    "m_bPredeterminado": false,
                                    "m_sUltimoError": "",
                                    "m_sMsgUltimoError": ""
                                },
                                {
                                    "m_nIdConceptosFacturacionDetalle": 109,
                                    "m_nIdConceptosFacturacion": 57,
                                    "m_nIdImpuesto": 11,
                                    "m_sImpuesto": "IVA 4%",
                                    "m_xPorcentaje": 4,
                                    "m_bTrasladado": false,
                                    "m_bPredeterminado": false,
                                    "m_sUltimoError": "",
                                    "m_sMsgUltimoError": ""
                                },
                                {
                                    "m_nIdConceptosFacturacionDetalle": 110,
                                    "m_nIdConceptosFacturacion": 57,
                                    "m_nIdImpuesto": 12,
                                    "m_sImpuesto": "IVA 0%",
                                    "m_xPorcentaje": 0,
                                    "m_bTrasladado": false,
                                    "m_bPredeterminado": false,
                                    "m_sUltimoError": "",
                                    "m_sMsgUltimoError": ""
                                },
                                {
                                    "m_nIdConceptosFacturacionDetalle": 111,
                                    "m_nIdConceptosFacturacion": 57,
                                    "m_nIdImpuesto": 3,
                                    "m_sImpuesto": "IVA 16%",
                                    "m_xPorcentaje": 16,
                                    "m_bTrasladado": true,
                                    "m_bPredeterminado": false,
                                    "m_sUltimoError": "",
                                    "m_sMsgUltimoError": ""
                                },
                                {
                                    "m_nIdConceptosFacturacionDetalle": 112,
                                    "m_nIdConceptosFacturacion": 57,
                                    "m_nIdImpuesto": 1,
                                    "m_sImpuesto": "IVA 0%",
                                    "m_xPorcentaje": 0,
                                    "m_bTrasladado": true,
                                    "m_bPredeterminado": false,
                                    "m_sUltimoError": "",
                                    "m_sMsgUltimoError": ""
                                },
                                {
                                    "m_nIdConceptosFacturacionDetalle": 113,
                                    "m_nIdConceptosFacturacion": 57,
                                    "m_nIdImpuesto": 4,
                                    "m_sImpuesto": "IVA %8",
                                    "m_xPorcentaje": 8,
                                    "m_bTrasladado": true,
                                    "m_bPredeterminado": false,
                                    "m_sUltimoError": "",
                                    "m_sMsgUltimoError": ""
                                },
                                {
                                    "m_nIdConceptosFacturacionDetalle": 114,
                                    "m_nIdConceptosFacturacion": 57,
                                    "m_nIdImpuesto": 11,
                                    "m_sImpuesto": "IVA 4%",
                                    "m_xPorcentaje": 4,
                                    "m_bTrasladado": false,
                                    "m_bPredeterminado": false,
                                    "m_sUltimoError": "",
                                    "m_sMsgUltimoError": ""
                                },
                                {
                                    "m_nIdConceptosFacturacionDetalle": 115,
                                    "m_nIdConceptosFacturacion": 57,
                                    "m_nIdImpuesto": 12,
                                    "m_sImpuesto": "IVA 0%",
                                    "m_xPorcentaje": 0,
                                    "m_bTrasladado": false,
                                    "m_bPredeterminado": false,
                                    "m_sUltimoError": "",
                                    "m_sMsgUltimoError": ""
                                }
                            ]
                        },
                        {
                            "m_nIdTarifaConceptos": 486,
                            "m_nIdTarifa": 65,
                            "m_sConcepto": "Maniobra de carga",
                            "m_cImporte": 105,
                            "m_nIdImpuestoTraslada": 3,
                            "m_cImporteIva": 16.8,
                            "m_nIdImpuestoRetiene": 12,
                            "m_cImporteRetiene": 0,
                            "m_dtCreadoEl": "2021-08-25T10:39:10.054",
                            "m_nCreadoPor": 0,
                            "m_dtModificadoEl": "2021-08-25T10:39:10.054",
                            "m_nModificadoPor": 0,
                            "m_bActivo": false,
                            "m_nIdConceptosFacturacion": 58,
                            "m_xnRangoMinimo": 1,
                            "m_xnRangoMaximo": 199,
                            "m_nIdTipoCalculo": 1,
                            "m_nIdAgregadoDesde": 1,
                            "mg_sUltimoError": "",
                            "arClsDetalle": [
                                {
                                    "m_nIdConceptosFacturacionDetalle": 90,
                                    "m_nIdConceptosFacturacion": 58,
                                    "m_nIdImpuesto": 1,
                                    "m_sImpuesto": "IVA 0%",
                                    "m_xPorcentaje": 0,
                                    "m_bTrasladado": true,
                                    "m_bPredeterminado": true,
                                    "m_sUltimoError": "",
                                    "m_sMsgUltimoError": ""
                                },
                                {
                                    "m_nIdConceptosFacturacionDetalle": 91,
                                    "m_nIdConceptosFacturacion": 58,
                                    "m_nIdImpuesto": 3,
                                    "m_sImpuesto": "IVA 16%",
                                    "m_xPorcentaje": 16,
                                    "m_bTrasladado": true,
                                    "m_bPredeterminado": false,
                                    "m_sUltimoError": "",
                                    "m_sMsgUltimoError": ""
                                },
                                {
                                    "m_nIdConceptosFacturacionDetalle": 92,
                                    "m_nIdConceptosFacturacion": 58,
                                    "m_nIdImpuesto": 12,
                                    "m_sImpuesto": "IVA 0%",
                                    "m_xPorcentaje": 0,
                                    "m_bTrasladado": false,
                                    "m_bPredeterminado": false,
                                    "m_sUltimoError": "",
                                    "m_sMsgUltimoError": ""
                                },
                                {
                                    "m_nIdConceptosFacturacionDetalle": 93,
                                    "m_nIdConceptosFacturacion": 58,
                                    "m_nIdImpuesto": 11,
                                    "m_sImpuesto": "IVA 4%",
                                    "m_xPorcentaje": 4,
                                    "m_bTrasladado": false,
                                    "m_bPredeterminado": false,
                                    "m_sUltimoError": "",
                                    "m_sMsgUltimoError": ""
                                },
                                {
                                    "m_nIdConceptosFacturacionDetalle": 94,
                                    "m_nIdConceptosFacturacion": 58,
                                    "m_nIdImpuesto": 1,
                                    "m_sImpuesto": "IVA 0%",
                                    "m_xPorcentaje": 0,
                                    "m_bTrasladado": true,
                                    "m_bPredeterminado": false,
                                    "m_sUltimoError": "",
                                    "m_sMsgUltimoError": ""
                                },
                                {
                                    "m_nIdConceptosFacturacionDetalle": 95,
                                    "m_nIdConceptosFacturacion": 58,
                                    "m_nIdImpuesto": 3,
                                    "m_sImpuesto": "IVA 16%",
                                    "m_xPorcentaje": 16,
                                    "m_bTrasladado": true,
                                    "m_bPredeterminado": false,
                                    "m_sUltimoError": "",
                                    "m_sMsgUltimoError": ""
                                },
                                {
                                    "m_nIdConceptosFacturacionDetalle": 96,
                                    "m_nIdConceptosFacturacion": 58,
                                    "m_nIdImpuesto": 12,
                                    "m_sImpuesto": "IVA 0%",
                                    "m_xPorcentaje": 0,
                                    "m_bTrasladado": false,
                                    "m_bPredeterminado": true,
                                    "m_sUltimoError": "",
                                    "m_sMsgUltimoError": ""
                                },
                                {
                                    "m_nIdConceptosFacturacionDetalle": 97,
                                    "m_nIdConceptosFacturacion": 58,
                                    "m_nIdImpuesto": 11,
                                    "m_sImpuesto": "IVA 4%",
                                    "m_xPorcentaje": 4,
                                    "m_bTrasladado": false,
                                    "m_bPredeterminado": false,
                                    "m_sUltimoError": "",
                                    "m_sMsgUltimoError": ""
                                }
                            ]
                        },
                    ],
                    "m_arrProductos": [
                        {
                            m_nIdProducto: 1,
                            m_sDescripcion: 'Crema de cacahuate'
                        },
                        {
                            m_nIdProducto: 2,
                            m_sDescripcion: 'Platanos'
                        }
                    ],
                    "m_nN_AGREGAR": 120,
                    "m_nN_MODIFICAR": 121,
                    "m_nN_ELIMINAR": 122
                },
                {
                    "m_nIdTarifa": 66,
                    "m_nIdSucursal": 19,
                    "m_sDestino": "Ciudad de México",
                    "m_nIdDestino": 24301,
                    "m_sSucursal": "Mérida",
                    "m_bPorRango": true,
                    "m_bPorPesoVolumen": false,
                    "m_nFactorConversion": 1,
                    "m_cPrecioM3": 1,
                    "m_cPrecioKilo": 1,
                    "m_cFleteMinimo": 1,
                    "m_cMontoMinimo": 1,
                    "m_nIdImpuestoRetiene": 0,
                    "m_nIdImpuestoTraslada": 0,
                    "m_nCreadoPor": 0,
                    "m_bActivo": true,
                    "m_nModificadoPor": 1014,
                    "m_dtCreadoEl": "2021-08-17T09:18:30.000",
                    "m_dtModificadoEl": "2021-08-19T22:17:48.000",
                    "m_cCostoFinal": 0,
                    "m_arrArCobros": [],
                    "m_arrArServicios": [],
                    "m_arrArConceptos": [
                        {
                            "m_nIdTarifaConceptos": 474,
                            "m_nIdTarifa": 65,
                            "m_sConcepto": "Entrega",
                            "m_cImporte": 700,
                            "m_nIdImpuestoTraslada": 3,
                            "m_cImporteIva": 112,
                            "m_nIdImpuestoRetiene": 11,
                            "m_cImporteRetiene": 28,
                            "m_dtCreadoEl": "2021-08-25T10:39:09.875",
                            "m_nCreadoPor": 0,
                            "m_dtModificadoEl": "2021-08-25T10:39:09.875",
                            "m_nModificadoPor": 0,
                            "m_bActivo": false,
                            "m_nIdConceptosFacturacion": 52,
                            "m_xnRangoMinimo": 1,
                            "m_xnRangoMaximo": 5,
                            "m_nIdTipoCalculo": 1,
                            "m_nIdAgregadoDesde": 2,
                            "mg_sUltimoError": "",
                            "arClsDetalle": [
                                {
                                    "m_nIdConceptosFacturacionDetalle": 39,
                                    "m_nIdConceptosFacturacion": 52,
                                    "m_nIdImpuesto": 2,
                                    "m_sImpuesto": "IVA 11%",
                                    "m_xPorcentaje": 11,
                                    "m_bTrasladado": true,
                                    "m_bPredeterminado": false,
                                    "m_sUltimoError": "",
                                    "m_sMsgUltimoError": ""
                                },
                                {
                                    "m_nIdConceptosFacturacionDetalle": 40,
                                    "m_nIdConceptosFacturacion": 52,
                                    "m_nIdImpuesto": 10,
                                    "m_sImpuesto": "IVA 8%",
                                    "m_xPorcentaje": 8,
                                    "m_bTrasladado": false,
                                    "m_bPredeterminado": false,
                                    "m_sUltimoError": "",
                                    "m_sMsgUltimoError": ""
                                },
                                {
                                    "m_nIdConceptosFacturacionDetalle": 79,
                                    "m_nIdConceptosFacturacion": 52,
                                    "m_nIdImpuesto": 1,
                                    "m_sImpuesto": "IVA 0%",
                                    "m_xPorcentaje": 0,
                                    "m_bTrasladado": true,
                                    "m_bPredeterminado": false,
                                    "m_sUltimoError": "",
                                    "m_sMsgUltimoError": ""
                                },
                                {
                                    "m_nIdConceptosFacturacionDetalle": 80,
                                    "m_nIdConceptosFacturacion": 52,
                                    "m_nIdImpuesto": 11,
                                    "m_sImpuesto": "IVA 4%",
                                    "m_xPorcentaje": 4,
                                    "m_bTrasladado": false,
                                    "m_bPredeterminado": false,
                                    "m_sUltimoError": "",
                                    "m_sMsgUltimoError": ""
                                },
                                {
                                    "m_nIdConceptosFacturacionDetalle": 83,
                                    "m_nIdConceptosFacturacion": 52,
                                    "m_nIdImpuesto": 3,
                                    "m_sImpuesto": "IVA 16%",
                                    "m_xPorcentaje": 16,
                                    "m_bTrasladado": true,
                                    "m_bPredeterminado": false,
                                    "m_sUltimoError": "",
                                    "m_sMsgUltimoError": ""
                                }
                            ]
                        },
                        {
                            "m_nIdTarifaConceptos": 486,
                            "m_nIdTarifa": 65,
                            "m_sConcepto": "Maniobra de carga",
                            "m_cImporte": 105,
                            "m_nIdImpuestoTraslada": 3,
                            "m_cImporteIva": 16.8,
                            "m_nIdImpuestoRetiene": 12,
                            "m_cImporteRetiene": 0,
                            "m_dtCreadoEl": "2021-08-25T10:39:10.054",
                            "m_nCreadoPor": 0,
                            "m_dtModificadoEl": "2021-08-25T10:39:10.054",
                            "m_nModificadoPor": 0,
                            "m_bActivo": false,
                            "m_nIdConceptosFacturacion": 58,
                            "m_xnRangoMinimo": 1,
                            "m_xnRangoMaximo": 199,
                            "m_nIdTipoCalculo": 1,
                            "m_nIdAgregadoDesde": 1,
                            "mg_sUltimoError": "",
                            "arClsDetalle": [
                                {
                                    "m_nIdConceptosFacturacionDetalle": 90,
                                    "m_nIdConceptosFacturacion": 58,
                                    "m_nIdImpuesto": 1,
                                    "m_sImpuesto": "IVA 0%",
                                    "m_xPorcentaje": 0,
                                    "m_bTrasladado": true,
                                    "m_bPredeterminado": true,
                                    "m_sUltimoError": "",
                                    "m_sMsgUltimoError": ""
                                },
                                {
                                    "m_nIdConceptosFacturacionDetalle": 91,
                                    "m_nIdConceptosFacturacion": 58,
                                    "m_nIdImpuesto": 3,
                                    "m_sImpuesto": "IVA 16%",
                                    "m_xPorcentaje": 16,
                                    "m_bTrasladado": true,
                                    "m_bPredeterminado": false,
                                    "m_sUltimoError": "",
                                    "m_sMsgUltimoError": ""
                                },
                                {
                                    "m_nIdConceptosFacturacionDetalle": 92,
                                    "m_nIdConceptosFacturacion": 58,
                                    "m_nIdImpuesto": 12,
                                    "m_sImpuesto": "IVA 0%",
                                    "m_xPorcentaje": 0,
                                    "m_bTrasladado": false,
                                    "m_bPredeterminado": false,
                                    "m_sUltimoError": "",
                                    "m_sMsgUltimoError": ""
                                },
                                {
                                    "m_nIdConceptosFacturacionDetalle": 93,
                                    "m_nIdConceptosFacturacion": 58,
                                    "m_nIdImpuesto": 11,
                                    "m_sImpuesto": "IVA 4%",
                                    "m_xPorcentaje": 4,
                                    "m_bTrasladado": false,
                                    "m_bPredeterminado": false,
                                    "m_sUltimoError": "",
                                    "m_sMsgUltimoError": ""
                                },
                                {
                                    "m_nIdConceptosFacturacionDetalle": 94,
                                    "m_nIdConceptosFacturacion": 58,
                                    "m_nIdImpuesto": 1,
                                    "m_sImpuesto": "IVA 0%",
                                    "m_xPorcentaje": 0,
                                    "m_bTrasladado": true,
                                    "m_bPredeterminado": false,
                                    "m_sUltimoError": "",
                                    "m_sMsgUltimoError": ""
                                },
                                {
                                    "m_nIdConceptosFacturacionDetalle": 95,
                                    "m_nIdConceptosFacturacion": 58,
                                    "m_nIdImpuesto": 3,
                                    "m_sImpuesto": "IVA 16%",
                                    "m_xPorcentaje": 16,
                                    "m_bTrasladado": true,
                                    "m_bPredeterminado": false,
                                    "m_sUltimoError": "",
                                    "m_sMsgUltimoError": ""
                                },
                                {
                                    "m_nIdConceptosFacturacionDetalle": 96,
                                    "m_nIdConceptosFacturacion": 58,
                                    "m_nIdImpuesto": 12,
                                    "m_sImpuesto": "IVA 0%",
                                    "m_xPorcentaje": 0,
                                    "m_bTrasladado": false,
                                    "m_bPredeterminado": true,
                                    "m_sUltimoError": "",
                                    "m_sMsgUltimoError": ""
                                },
                                {
                                    "m_nIdConceptosFacturacionDetalle": 97,
                                    "m_nIdConceptosFacturacion": 58,
                                    "m_nIdImpuesto": 11,
                                    "m_sImpuesto": "IVA 4%",
                                    "m_xPorcentaje": 4,
                                    "m_bTrasladado": false,
                                    "m_bPredeterminado": false,
                                    "m_sUltimoError": "",
                                    "m_sMsgUltimoError": ""
                                }
                            ]
                        },
                    ],
                    "m_arrProductos": [
                        {
                            m_nIdProducto: 4,
                            m_sDescripcion: 'Aceite Nutrioli'
                        },
                        {
                            m_nIdProducto: 5,
                            m_sDescripcion: 'Crema de avellanas'
                        }
                    ],
                    "m_nN_AGREGAR": 120,
                    "m_nN_MODIFICAR": 121,
                    "m_nN_ELIMINAR": 122
                }
            ],
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
            dataProductos: [],
            anchorEl: null
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
        this.handleCloseCardMenu = this.handleCloseCardMenu.bind(this)
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

    handleCardClick = (e, t) => {
        e.preventDefault()
        console.log('card clicked')
        this.setState({
            dataProductos: t.m_arrProductos
        })
    }
    handleCloseCardMenu = () => {
        this.setState({
            anchorEl: null
        })
    }

    handleCardMenuClick = (e) => {
        this.setState({
            anchorEl: e.currentTarget
        })
    }
    handleDuplicarClick = (e) => {
        this.handleCloseCardMenu()
    }

    onSubmit = (e) => {
        e.preventDefault()
        console.log(this.state.tarifasSeleccionadas)
        console.log('Mandar tarifas ', this.state.tarifasSeleccionadas)

        let params = {
            m_nIdCliente: this.state.cliente,
            m_sVigencia: this.state.fechaVigencia,
            m_arrArTarifas: this.state.tarifasSeleccionadas
        }
        console.log('agregar: ', params)
    }

    render() {
        const { disabled, conceptosAdicionales, conceptosManiobra, conceptosEntrega, conceptosRecoleccion, openDialog,
            columnsTarifas, dataTarifas, height, tarifasSeleccionadas,columnsTarifasOverview, tarifaDetalles, dataProductos, columnsProductos, anchorEl,
            cliente, fechaVigencia} = this.state
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
                                                        onChange={this.handleChange}
                                                        value={fechaVigencia}
                                                        className={"form-control"}
                                                        InputLabelProps={{shrink: true,}}
                                                        required
                                                    />
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
                                {
                                    tarifasSeleccionadas.map((t) => (
                                        <Card style={{marginBottom: '10px'}}>
                                            <CardHeader
                                                style={{height: '10px', paddingBotton: '0px'}}
                                                action={
                                                    <IconButton aria-label="settings" onClick={(e) => this.handleCardMenuClick(e)}>
                                                        <MoreVertIcon />
                                                        <Menu
                                                            id="simple-menu"
                                                            anchorEl={anchorEl}
                                                            keepMounted
                                                            open={Boolean(anchorEl)}
                                                            onClose={this.handleCloseCardMenu}
                                                        >
                                                            <MenuItem onClick={(e) => this.handleDuplicarClick(e)}>Duplicar</MenuItem>
                                                        </Menu>
                                                    </IconButton>
                                                }
                                            />
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
                                                                {t.m_arrProductos.map((p) => (
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
                                {/*<div className="widget-wrap">
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
                                </div>*/}
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
                                                <Tab label="Productos" {...this.a11yProps(4)}/>
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
                                            <TabPanel value={this.state.tab} index={4}>
                                                <div style={{ display: 'flex', height: '500px' }}>
                                                    <DataGrid
                                                        columns={columnsProductos}
                                                        rows={dataProductos}
                                                        getRowId={(row) => row.m_nIdProducto}
                                                        checkboxSelection
                                                    />
                                                </div>

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