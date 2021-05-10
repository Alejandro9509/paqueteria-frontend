import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Cabecera from '../../Components/Template/Cabecera';
import BarraLateralIzquierda from '../../Components/Template/BarraLateralIzquierda';
import { Button, Dialog, DialogActions, DialogContent, DialogTitle, Tooltip } from '@material-ui/core';
import CrearConcepto from './CrearConcepto';
import { DataGrid } from '@material-ui/data-grid';
import SvgIcon from "@material-ui/core/SvgIcon";
import { ReactComponent as Activo } from "../../iconos/Menu/palomita.svg";
import { ReactComponent as NoActivo } from "../../iconos/Menu/cruz.svg";
import Noty from 'noty';
import axios from "axios";
import { dataGridLocaleText } from '../../Constants';

const headers = {
    'Content-Type': 'application/json',
    //    'access-control-allow-origin': '*'
}
function showSuccess(mensaje) {
    new Noty({
        type: "information",
        layout: "topCenter",
        text: mensaje,
        timeout: "3000"
    }).show()
}

class ConceptosFacturacion extends Component {
    constructor(props) {
        super(props);
        this.state = {
            DerechoBorrar: 1,
            CreadoPor: localStorage.getItem("UsuarioId"),
            height: window.innerHeight,
            openDialog: false,
            editar: false,
            selected: null,
            data: [],
            columns: [
                {
                    headerName: "Acciones",
                    sortable: false, filterable: false,
                    field: "",
                    renderCell: (row) => {
                        return (
                            <div>
                                <Tooltip title="Modificar">
                                    <a href="#Agregar" role="tab" data-toggle="tab" onClick={() => (this.handleShowModificar(row.row.m_nIdConceptosFacturacion))} className="btn btn-default btn-xs"><i className="fa fa-pencil-square-o" style={{ color: "#F9A03E" }} /></a>

                                </Tooltip>
                                <Tooltip title="Consultar">
                                    <a href="#Agregar" role="tab" data-toggle="tab" className="btn btn-default btn-xs" onClick={() => (this.handleShowConsultar(row.row.m_nIdConceptosFacturacion))}><i className="fa fa-eye" style={{ color: "#F9A03E" }} /></a>

                                </Tooltip>
                                <Tooltip title="Eliminar">
                                    <a href="#" className="btn btn-default btn-xs" onClick={() => (this.handleEliminar(row.row.m_nIdConceptosFacturacion))}><i className="zmdi zmdi-delete" style={{ color: "#F30B0B" }} /></a>

                                </Tooltip>
                            </div>
                        )
                    }
                },
                {
                    headerName: "Código",
                    field: "m_sCodigo",
                    width: 125,
                }, {
                    headerName: "Concepto de facturación",
                    field: "m_sConcepto",
                    width: 300,
                }, {
                    headerName: "Traslado IVA",
                    field: "m_dtCreadoEl",
                    width: 150,
                    renderCell: (row) => {
                        return (
                            <div
                                style={{
                                    width: "100%",
                                    textAlign: "center",
                                    color: row.row.arClsDetalle.filter(c => c.m_bTrasladado).length !== 0 ? "green" : "red",
                                }}
                            >
                                {row.row.arClsDetalle.filter(c => c.m_bTrasladado).length !== 0 ? (
                                    <SvgIcon component={Activo} />
                                ) : (
                                    <SvgIcon component={NoActivo} />
                                )}
                            </div>
                        );
                    },
                }, {
                    headerName: "Retiene IVA",
                    field: "m_nCreadoPor",
                    width: 150,
                    renderCell: (row) => {
                        return (
                            <div
                                style={{
                                    width: "100%",
                                    textAlign: "center",
                                    color: row.row.arClsDetalle.filter(c => !c.m_bTrasladado).length !== 0 ? "green" : "red",
                                }}
                            >
                                {row.row.arClsDetalle.filter(c => !c.m_bTrasladado).length !== 0 ? (
                                    <SvgIcon component={Activo} />
                                ) : (
                                    <SvgIcon component={NoActivo} />
                                )}
                            </div>
                        );
                    },
                }, {
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

            ]
        }
        this.getAllData = this.getAllData.bind(this)
        this.handleAceptar = this.handleAceptar.bind(this)
        this.handleShowModificar = this.handleShowModificar.bind(this)
        this.handleShowConsultar = this.handleShowConsultar.bind(this)
        this.handleEliminar = this.handleEliminar.bind(this)
    }

    handleShowModificar(id) {
        const url = `${process.env.REACT_APP_API_URL}/ConceptosFacturacion/GetById/` + id;
        axios.get(url, { headers }).then(respuesta => {
            console.log(respuesta.data)
            this.setState({
                openDialog: true,
                edit: true,
                consult: false,
                selected: respuesta.data,
            })
        });
    }

    handleShowConsultar(id) {
        const url = `${process.env.REACT_APP_API_URL}/ConceptosFacturacion/GetById/` + id;
        axios.get(url, { headers }).then(respuesta => {
            console.log(respuesta.data)
            this.setState({
                openDialog: true,
                edit: true,
                consult: true,
                selected: respuesta.data,
            })
        });
    }

    handleAceptar(data) {
        var arrayImpuestosTraslado = data.impuestosSeleccionadosTraslado.map(i => ({ m_nIdImpuesto: i.m_nIdImpuesto, m_bPredeterminado: i.m_nIdImpuesto === data.predeterminadoSeleccionadosTraslado.m_nIdImpuesto }))
        var arrayImpuestosRetencion = data.impuestosSeleccionadosRetencion.map(i => ({ m_nIdImpuesto: i.m_nIdImpuesto, m_bPredeterminado: i.m_nIdImpuesto === data.predeterminadoSeleccionadosRetencion.m_nIdImpuesto }))
        var arrayImpuestos = arrayImpuestosTraslado.concat(arrayImpuestosRetencion)
        var params = {
            m_sConcepto: data.concepto,
            m_sCodigo: data.codigo,
            m_sUnidadMedida: data.unidadMedia,
            m_bActivo: data.activo ? 1 : 0,
            m_bCalculoFlete: data.incluirLiquidacionFlete ? 1 : 0,
            m_bCalculoIngreso: data.incluirIngresosLiquidacion ? 1 : 0,
            m_nIdConceptosFacturacion: 1,
            m_nIdUnidadMedidaSAT: 1,
            m_nIdProdServSAT: 1,
            m_nCreadoPOr: localStorage.getItem("UsuarioId"),
            m_nModificadoPor: localStorage.getItem("UsuarioId"),
            arClsDetalle: arrayImpuestos
        }
        console.log(params)
        if (this.state.edit) {
            const url = `${process.env.REACT_APP_API_URL}/ConceptosFacturacion/Modificar/` + this.state.selected.idConceptosFacturacion;
            axios.put(url, Object.assign({}, params), { headers }).then(respuesta => {
                showSuccess(respuesta.data)
                this.getAllData()
                this.setState({ openDialog: false })
            }).catch(err => {
                console.log(err)
                showSuccess("err")
            });
        } else {
            const url = `${process.env.REACT_APP_API_URL}/ConceptosFacturacion/Agregar`;
            axios.post(url, Object.assign({}, params), { headers }).then(respuesta => {
                showSuccess(respuesta.data)
                this.getAllData()
                this.setState({ openDialog: false })
            }).catch(err => {
                console.log(err)
                showSuccess(err)
            });
        }

    }

    handleEliminar(id) {
        var derecho;
        const urlDelete = `${process.env.REACT_APP_API_URL}/Utilerias/ValidaDerechos/${this.state.CreadoPor}/${this.state.DerechoBorrar}/3`;
        axios.get(urlDelete, { headers }).then(respuesta => {
            derecho = respuesta.data;
            if (derecho == false) {
                showSuccess("El usuario no tiene derechos para realizar el proceso");
                return;
            }

            const url = `${process.env.REACT_APP_API_URL}/ConceptosFacturacion/Eliminar/` + id;
            axios.delete(url, { headers }).then(respuesta => {
                console.log(respuesta);
                this.getAllData();
            }).catch(err => {
                showSuccess(err)
            });
        }).catch(err => {
            showSuccess(err)
        });
    }
    componentWillMount() {

    }

    componentDidMount() {
        this.getAllData()
    }

    componentWillUnmount() {

    }

    getAllData() {
        const url = `${process.env.REACT_APP_API_URL}/ConceptosFacturacion/GetListado`;
        axios.get(url, { headers }).then(respuesta => {
            this.setState({ data: respuesta.data })
        });
    }

    render() {
        const { height, openDialog, data, columns, edit, consult } = this.state
        return (
            <div >
                <Dialog open={openDialog} fullWidth maxWidth="lg" onClose={() => this.setState({ openDialog: false })}>
                    <DialogTitle>Agregando Concepto de Facturación</DialogTitle>
                    <DialogContent>
                        <CrearConcepto onSubmit={this.handleAceptar} edit={edit} select={this.state.selected} consult={consult}>
                            <DialogActions>
                                <div className="form-footer" className="col-md-12">
                                    <button
                                        type="button"
                                        onClick={() => this.setState({ openDialog: false })}
                                        className="btn btn-secondary secondary-btn"
                                    >
                                        Cancelar
                                    </button>
                                    <button
                                        type="submit"
                                        className="btn btn-primary primary-btn"
                                    >
                                        Aceptar
                                    </button>
                                </div>
                            </DialogActions>
                        </CrearConcepto>
                    </DialogContent>
                </Dialog>

                <header className="topbar clearfix">
                    <Cabecera titulo="Conceptos de Facturación" >
                        <div className="page-header">
                            <ul className="list-page-breadcrumb">
                                <li>
                                    <a href="/Catalogos" className="color-mapeo">
                                        Catálogos <i className="zmdi zmdi-chevron-right" />
                                    </a>
                                </li>
                                <li className="active-page">Conceptos de Facturación</li>
                            </ul>
                        </div>
                    </Cabecera>
                </header>

                {/*Leftbar Start Here*/}
                <aside className="iconic-leftbar" style={{ minHeight: height }}>
                    <BarraLateralIzquierda />
                </aside>
                {/*Leftbar End Here*/}
                <section className="main-container">
                    <div className="container-fluid">

                        <button
                            className="btn btn-primary primary-btn"
                            style={{ margin: "5px" }}
                            onClick={() => this.setState({ openDialog: true, edit: false, consult: false })}
                        >
                            Agregar
                    </button>
                        <button
                            className="btn btn-primary primary-btn"
                            style={{ margin: "5px" }}
                            onClick={() => console.log("")}
                        >
                            Modificar
                    </button>
                        <button
                            className="btn btn-primary primary-btn"
                            style={{ margin: "5px" }}
                            onClick={() => this.handleEliminar(this.state.idConceptosFacturacion)}
                        >
                            Eliminar
                    </button>
                        <button
                            className="btn btn-primary primary-btn"
                            style={{ margin: "5px" }}
                        >
                            Imprimir
                    </button>

                        <div className="widget-wrap">
                            <div className="widget-content">
                                <div className="row" style={{ height: this.state.height - 250, width: '100%' }}>
                                    {data.length != 0 ? (
                                        <DataGrid
                                            localeText={dataGridLocaleText}
                                            rows={data}
                                            columns={columns}
                                            density="compact"
                                            pageSize={Math.floor((this.state.height - 310) / 30)}
                                            getRowId={(row) => row.m_nIdConceptosFacturacion}
                                            onRowSelected={(row) => {
                                                this.setState({
                                                    idConceptosFacturacion: row.data.m_nIdConceptosFacturacion
                                                })
                                            }}
                                        />
                                    ) : (
                                        <div>No se encontró ningún registro</div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </section>
            </div>
        );
    }
}

ConceptosFacturacion.propTypes = {

};

export default ConceptosFacturacion;