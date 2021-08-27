import React, {Component, useEffect, useMemo, useState} from 'react'
import Cabecera from "../../Components/Template/Cabecera";
import BarraLateralIzquierda from "../../Components/Template/BarraLateralIzquierda";
import {DataGrid, GridToolbar } from "@material-ui/data-grid";
import {dataGridLocaleText} from "../../Constants";
import SvgIcon from "@material-ui/core/SvgIcon";
import {ReactComponent as Activo} from "../../iconos/Menu/palomita.svg";
import {ReactComponent as NoActivo} from "../../iconos/Menu/cruz.svg";
import $ from "jquery";
import CrearTarifa from "../Tarifas/CrearTarifa";
import EscribirConvenio from "./EscribirConvenio";
import {Tooltip} from "@material-ui/core";
import {confirmAlert} from "react-confirm-alert";

window.jQuery = window.$ = $;
function Convenios(){
    const columns = useMemo(() => [
        {
            headerName: "Acciones",
            field: "",
            sortable: false, filterable: false,
            renderCell: (row) => {
                return (
                    <div>
                        <Tooltip title="Modificar">
                            <a href="#Agregar" role="tab" data-toggle="tab"
                               onClick={() => (handleShowModificar(row.row))}
                               className="btn btn-default btn-xs"><i className="fa fa-pencil-square-o"
                                                                     style={{ color: "#F9A03E" }} /></a>
                        </Tooltip>
                        <Tooltip title="Consultar">
                            <a href="#Agregar" role="tab" data-toggle="tab" className="btn btn-default btn-xs"
                               onClick={() => (handleShowConsultar(row.row))}><i className="fa fa-eye" style={{ color: "#F9A03E" }} /></a>
                        </Tooltip>
                        {/*<Tooltip title="Eliminar">
                            <a href="#" className="btn btn-default btn-xs"
                               onClick={() => confirmAlert({
                                   title: 'Confirmar Eliminar',
                                   message: 'Está seguro de eliminar Embarque?',
                                   buttons: [
                                       {
                                           label: 'Si',
                                           onClick: () => handleEliminar(row.row.m_nIdRecoleccion)
                                       },
                                       {
                                           label: 'No',
                                       }
                                   ]
                               })}><i className="zmdi zmdi-delete"
                                      style={{ color: "#F30B0B" }} /></a>
                        </Tooltip>*/}

                    </div>
                )
            }
        },
        {
            headerName: "ID Convenio",
            field: 'm_nIdConvenio',
            width: 200,
        },
        {
            headerName: "ID Cliente",
            field: 'm_nIdCliente',
            width: 200,
        },
        {
            headerName: "Cliente",
            field: 'm_sNombreFiscal',
            width: 300,
        },
        {
            headerName: "Vigencia",
            field: 'm_sVigencia',
            width: 200,
        },
        {
            headerName: "Activo",
            field: 'm_bActivo',
            width: 100,
            renderCell: (row) => {
                return (
                    <div
                        style={{
                            width: "100%",
                            textAlign: "center",
                            color: row.row.m_bActivo ? "green" : "red",
                        }}>
                        {row.row.m_bActivo ? (
                            <SvgIcon component={Activo} />
                        ) : (
                            <SvgIcon component={NoActivo} />
                        )}
                    </div>
                );
            },
        },
    ])
    const [listaConvenios, setListaConvenios] = useState([])
    const [convenioSeleccionado, setConvenioSeleccionado] = useState(0)
    const [consult, setConsult] = useState(false)
    const [state, setState] = useState({
        agregar: "Agregar",
        height: window. innerHeight,
    })


    useEffect(value => {
        getAllConvenios()
    }, [])

    const getAllConvenios = () => {
        setListaConvenios([
            {
                "m_nIdConvenio": 1,
                "m_nIdCliente":1,
                "m_sNombreFiscal": "Ricardo Arjona",
                "m_sVigencia": "2022-04-05",
                "m_bActivo": true,
                "m_arrArTarifas": [
                    {
                        "m_nIdTarifa": 69,
                        "m_nIdSucursal": 1,
                        "m_sDestino": "MEXICO",
                        "m_nIdDestino": 5,
                        "m_sSucursal": "MERIDA",
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
                        "m_dtCreadoEl": "2021-08-25T21:56:15.000",
                        "m_dtModificadoEl": "2021-08-25T22:07:48.000",
                        "m_cCostoFinal": 0,
                        "m_arrArCobros": [],
                        "m_arrArServicios": [],
                        "m_arrArConceptos": [
                            {
                                "m_nIdTarifaConceptos": 515,
                                "m_nIdTarifa": 69,
                                "m_sConcepto": "MANIOBRAS DE RECOLECCION",
                                "m_cImporte": 1,
                                "m_nIdImpuestoTraslada": 3,
                                "m_cImporteIva": 0.16,
                                "m_nIdImpuestoRetiene": 4,
                                "m_cImporteRetiene": 0,
                                "m_dtCreadoEl": "2021-08-27T13:19:06.861",
                                "m_nCreadoPor": 0,
                                "m_dtModificadoEl": "2021-08-27T13:19:06.861",
                                "m_nModificadoPor": 0,
                                "m_bActivo": false,
                                "m_nIdConceptosFacturacion": 14,
                                "m_xnRangoMinimo": 0,
                                "m_xnRangoMaximo": 0,
                                "m_nIdTipoCalculo": 0,
                                "m_nIdAgregadoDesde": 0,
                                "mg_sUltimoError": "",
                                "arClsDetalle": [
                                    {
                                        "m_nIdConceptosFacturacionDetalle": 7,
                                        "m_nIdConceptosFacturacion": 14,
                                        "m_nIdImpuesto": 3,
                                        "m_sImpuesto": "IVA 16%",
                                        "m_xPorcentaje": 16,
                                        "m_bTrasladado": true,
                                        "m_bPredeterminado": true,
                                        "m_sUltimoError": "",
                                        "m_sMsgUltimoError": ""
                                    },
                                    {
                                        "m_nIdConceptosFacturacionDetalle": 8,
                                        "m_nIdConceptosFacturacion": 14,
                                        "m_nIdImpuesto": 4,
                                        "m_sImpuesto": "RETENCION IVA 0%",
                                        "m_xPorcentaje": 0,
                                        "m_bTrasladado": false,
                                        "m_bPredeterminado": true,
                                        "m_sUltimoError": "",
                                        "m_sMsgUltimoError": ""
                                    }
                                ]
                            },
                            {
                                "m_nIdTarifaConceptos": 516,
                                "m_nIdTarifa": 69,
                                "m_sConcepto": "MANIOBRAS DE ENTREGA",
                                "m_cImporte": 1,
                                "m_nIdImpuestoTraslada": 3,
                                "m_cImporteIva": 0.16,
                                "m_nIdImpuestoRetiene": 4,
                                "m_cImporteRetiene": 0,
                                "m_dtCreadoEl": "2021-08-27T13:19:06.873",
                                "m_nCreadoPor": 0,
                                "m_dtModificadoEl": "2021-08-27T13:19:06.873",
                                "m_nModificadoPor": 0,
                                "m_bActivo": false,
                                "m_nIdConceptosFacturacion": 15,
                                "m_xnRangoMinimo": 0,
                                "m_xnRangoMaximo": 0,
                                "m_nIdTipoCalculo": 0,
                                "m_nIdAgregadoDesde": 0,
                                "mg_sUltimoError": "",
                                "arClsDetalle": [
                                    {
                                        "m_nIdConceptosFacturacionDetalle": 9,
                                        "m_nIdConceptosFacturacion": 15,
                                        "m_nIdImpuesto": 3,
                                        "m_sImpuesto": "IVA 16%",
                                        "m_xPorcentaje": 16,
                                        "m_bTrasladado": true,
                                        "m_bPredeterminado": true,
                                        "m_sUltimoError": "",
                                        "m_sMsgUltimoError": ""
                                    },
                                    {
                                        "m_nIdConceptosFacturacionDetalle": 10,
                                        "m_nIdConceptosFacturacion": 15,
                                        "m_nIdImpuesto": 4,
                                        "m_sImpuesto": "RETENCION IVA 0%",
                                        "m_xPorcentaje": 0,
                                        "m_bTrasladado": false,
                                        "m_bPredeterminado": true,
                                        "m_sUltimoError": "",
                                        "m_sMsgUltimoError": ""
                                    }
                                ]
                            }
                        ]
                    }
                ]
            }
        ])
    }

    const handleShowListado = (event) => {
        event.stopPropagation();
        // limpiarInputsAgregar()
        setConvenioSeleccionado(0)
        setConsult(false)
        setState(state =>{
            return {
                ...state,
                agregar: "Agregar",
            }
        });
        $('.nav-tabs li ').removeClass('active');
        $('.nav-tabs li').eq(0).addClass('active');
        $('.tab-content div ').removeClass('in show');
        $('#Listado').addClass('in show');
    }

    const handleShowAgregar = (event) => {
        event.stopPropagation()
        // limpiarInputsAgregar()
        setState(state => {
            return {
                ...state,
            }
        });
        $('.nav-tabs li ').removeClass('active');
        $('.nav-tabs li').eq(1).addClass('active');
        $('.tab-content div ').removeClass('in show');
        $('#Agregar').addClass('in show');

    }
    const handleShowModificar = (convenio) => {
        setConsult(false)
        setConvenioSeleccionado(convenio.m_nIdConVenio)
        setState(state =>{
            return {
                ...state,
                agregar: "Modificar",
            }
        });
        $('.nav-tabs li ').removeClass('active');
        $('.nav-tabs li').eq(1).addClass('active');
        $('.tab-content div ').removeClass('in show');
        $('#Agregar').addClass('in show');
    }
    const handleShowConsultar = (convenio) => {
        setConvenioSeleccionado(convenio.m_nIdConVenio)
        setConsult(true)
        setState(state =>{
            return {
                ...state,
                agregar: "Consultar",
            }
        });
        $('.nav-tabs li ').removeClass('active');
        $('.nav-tabs li').eq(1).addClass('active');
        $('.tab-content div ').removeClass('in show');
        $('#Agregar').addClass('in show');
    }

    const handleEliminar = () => {}


    return(
        <div>
            <header className="topbar clearfix">
                <Cabecera titulo="Convenios" >
                    <div className="page-header">
                        <ul className="list-page-breadcrumb">
                            <li>
                                <a href="/Catalogos" className="color-mapeo">
                                    Catálogos <i className="zmdi zmdi-chevron-right" />
                                </a>
                            </li>
                            <li className="active-page">Convenios</li>
                        </ul>
                    </div>
                </Cabecera>
            </header>
            {/*Leftbar Start Here*/}
            <aside className="iconic-leftbar">
                <BarraLateralIzquierda />
            </aside>
            {/*Leftbar End Here*/}
            <section className={"main-container"}>
                <div className={"content-fluid"}>
                    <ul className={"nav navStatica nav-tabs"}>
                        <li className={"active"}>
                            <a data-toggle={"tab"} onClick={handleShowListado}>
                                <i className={"fa fa-list"}/> Listado
                            </a>
                        </li>

                        <li>
                            <a data-toggle="tab" onClick={handleShowAgregar}>
                                <i className="fa fa-plus-circle" /> {state.agregar}
                            </a>
                        </li>
                        {/*<li>
                                <a  onClick={handleShowImprimir}>
                                    <i className="fa fa-print" /> Imprimir
                                </a>
                            </li>*/}
                    </ul>

                    <div className={"row"} className={"tab-content"}>
                        <div id="Listado" className="tab-pane fade in show">
                            <div className="widget-wrap">
                                <div className="widget-content">
                                    <div className={"row"} style={{height: state.height -250, width: '100%'}}>
                                        <DataGrid columns={columns} rows={listaConvenios}
                                                  locateText={dataGridLocaleText}
                                                  density={"compact"}
                                                  pageSize={Math.floor((state.height - 310) / 30)}
                                                  components={{
                                                      Toolbar: GridToolbar,
                                                  }}
                                                  getRowId={(row => row.m_nIdConvenio)}
                                                  disableColumnSelector
                                                  disableDensitySelector
                                                  filterModel={{
                                                      items: [
                                                          { columnField: '', operatorValue: '', value: '' },
                                                      ],
                                                  }}
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div id="Agregar" className="tab-pane fade">
                            {/*{
                                this.state.pantalla == 2 &&
                                <CrearTarifa edit={edit} consult={consult} select={this.state.selected}
                                             onSubmit={this.handleAceptar} onCancel={(event) => {
                                    event.stopPropagation();
                                    this.setState({pantalla: 1, edit: false, consult: false, agregar: "Agregar"});
                                    $('.nav-tabs li ').removeClass('active');
                                    $('.nav-tabs li').eq(0).addClass('active');
                                    $('.tab-content div ').removeClass('in show');
                                    $('#Listado').addClass('in show');
                                }}></CrearTarifa>
                            }*/}
                            <EscribirConvenio
                                select={convenioSeleccionado}
                                consult={consult}
                            />

                        </div>
                    </div>
                </div>
            </section>
        </div>
    )
}

export default Convenios;