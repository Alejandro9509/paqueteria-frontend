import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Cabecera from '../../Components/Template/Cabecera';
import BarraLateralIzquierda from '../../Components/Template/BarraLateralIzquierda';
import Noty from 'noty';
import axios from "axios";
import SvgIcon from "@material-ui/core/SvgIcon";
import { ReactComponent as Activo } from "../../iconos/Menu/palomita.svg";
import { ReactComponent as NoActivo } from "../../iconos/Menu/cruz.svg";
import { DataGrid } from '@material-ui/data-grid';
import $ from "jquery";
import { Dialog, DialogActions, DialogContent, DialogTitle } from "@material-ui/core";
import AgregarFolio from "./AgregarTipoUnidad";
import CrearTarifa from "../Tarifas/CrearTarifa";
import AgregarTipoUnidad from "./AgregarTipoUnidad";
import { agregarTipoUnidades, eliminarTipoUnidades, obtenerTipoUnidades, modificarTipoUnidades } from '../../Util/Contexts/TipoUnidadContext';
import { validarPermisos } from '../../Util/Contexts/UsuarioContext';
window.jQuery = window.$ = $;
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

class TipoUnidad extends Component {
    constructor(props) {
        super(props);
        this.state = {
            data: [],
            DerechoBorrar: 67,
            idTipoUnidad: null,
            agregar: "Agregar",
            CreadoPor: localStorage.getItem("UsuarioId"),
            ModificadoPor: localStorage.getItem("UsuarioId"),
            openDialog: false,
            height: window.innerHeight,
            pantalla: 1,
            selected: {},
            edit: false,
            columns: [
                {
                    headerName: "Acciones",
                    field: "",
                    renderCell: (row) => {
                        return (
                            <div>
                                <a href="#Agregar" role="tab" data-toggle="tab" onClick={() => (this.handleShowModificar(row.row.m_nIdTipoUnidad))} className="btn btn-default btn-xs"><i className="fa fa-pencil-square-o" style={{ color: "#F9A03E" }} /></a>
                                <a href="#" className="btn btn-default btn-xs" onClick={() => (this.handleEliminar(row.row.m_nIdTipoUnidad))}><i className="zmdi zmdi-delete" style={{ color: "#F30B0B" }} /></a>
                            </div>
                        )
                    }
                },
                {
                    headerName: "Tipo de Unidad",
                    field: "m_sTipoUnidad",
                    width: 250,
                }, {
                    headerName: "Tarifa x KMS Pesos",
                    valueFormatter: (params) => `$${parseFloat(params.value).toFixed(2)}`,
                    field: "m_cyTarifaPorKMS",
                    width: 200,
                }, {
                    headerName: "Tarifa x KMS Dólares",
                    field: "m_cyTarifaPorKMSDlls",
                    valueFormatter: (params) => `$${parseFloat(params.value).toFixed(2)}`,
                    width: 200,
                }, {
                    headerName: "Creado El",
                    field: "m_sCreadoEl",
                    width: 200,
                }, {
                    headerName: "Creado Por",
                    field: "m_sCreadoPor",
                    width: 150,
                }, {
                    headerName: "Modificado El",
                    field: "m_sModificadoEl",
                    width: 200,
                }, {
                    headerName: "Modificado Por",
                    field: "m_sModificadoPor",
                    width: 150,
                }

            ]
        }
        this.getAllData = this.getAllData.bind(this)
        this.handleEliminar = this.handleEliminar.bind(this)
        this.handleAceptar = this.handleAceptar.bind(this)
        this.handleAceptarAgregar = this.handleAceptarAgregar.bind(this)
        this.handleAceptarModificar = this.handleAceptarModificar.bind(this)
        this.handleClose = this.handleClose.bind(this)
        this.handleShowModificar = this.handleShowModificar.bind(this)
    }

    componentDidMount() {
        this.getAllData()
    }

    handleEliminar(id) {
        var derecho;
        validarPermisos(this.state).then(respuesta => {
            derecho = respuesta.data;
            if (derecho === false) {
                showSuccess("El usuario no tiene derechos para realizar el proceso");
                return;
            }
            eliminarTipoUnidades(id, this.state.ModificadoPor).then(respuesta => {
                this.getAllData();
            }).catch(err => {
                showSuccess(err)
            });
        }).catch(err => {
            showSuccess(err)
        });
    }

    handleAceptarAgregar(data) {
        const today = new Date();

        var params = {
            m_nIdTipoUnidad: data.idTipoUnidad,
            m_cyTarifaPorKMS: data.tarifaKMSDolares,
            m_cyTarifaPorKMSDlls: data.tarifaKMSPesos,
            m_sTipoUnidad: data.tipoUnidad,
            m_dtCreadoEl: today.getDate() + "/" + (today.getMonth() + 1) + "/" + today.getFullYear() + " " + today.getHours() + ":" + today.getMinutes(),
            m_nCreadoPor: localStorage.getItem("UsuarioId"),
            m_dtModificadoEl: today.getDate() + "/" + (today.getMonth() + 1) + "/" + today.getFullYear() + " " + today.getHours() + ":" + today.getMinutes(),
            m_nModificadoPor: localStorage.getItem("UsuarioId")
        }
        console.log(JSON.stringify(params));
        debugger;
        agregarTipoUnidades(params).then(respuesta => {
            console.log(respuesta)
            showSuccess(respuesta.data)

            $('.nav-tabs li ').removeClass('active');
            $('.nav-tabs li').eq(0).addClass('active');
            $('.tab-content div ').removeClass('in show');
            $('#Listado').addClass('in show');
            this.getAllData()
            this.setState({ edit: false, agregar: 'Agregar', pantalla: 1, idTipoUnidad: null })
        }).catch(err => {
            console.log(err)
            showSuccess(err)
        });

    }

    handleAceptarModificar(data) {
        const today = new Date();

        var params = {
            m_nIdTipoUnidad: data.idTipoUnidad,
            m_cyTarifaPorKMS: parseInt(data.tarifaKMSPesos),
            m_cyTarifaPorKMSDlls: parseInt(data.tarifaKMSDolares),
            m_sTipoUnidad: data.tipoUnidad,
            m_dtModificadoEl: today.getDate() + "/" + (today.getMonth() + 1) + "/" + today.getFullYear() + " " + today.getHours() + ":" + today.getMinutes(),
            m_nModificadoPor: localStorage.getItem("UsuarioId")
        }

        console.log(params)

        modificarTipoUnidades(data.idTipoUnidad, params).then(respuesta => {
            console.log(respuesta)
            showSuccess(respuesta.data)
            this.getAllData()
            this.setState({ edit: false, agregar: 'Agregar', pantalla: 1 })
        }).catch(err => {
            console.log(err)
            showSuccess(err)
        });

    }

    handleAceptar(data) {
        if (this.state.edit) {
            this.handleAceptarModificar(data)
        } else {
            this.handleAceptarAgregar(data)
        }
    }

    handleShowModificar(id) {
        $('.nav-tabs li ').removeClass('active');
        $('.nav-tabs li').eq(1).addClass('active');
        $('.tab-content div ').removeClass('in show');
        $('#Agregar').addClass('in show');
        this.setState({ pantalla: 2, edit: true, agregar: "Modificar", idTipoUnidad: id });
    }

    cambiarPantalla(id) {
        this.setState({ pantalla: id })
    }

    getAllData() {
        obtenerTipoUnidades().then(respuesta => {
            this.setState({ data: respuesta.data })
        });
    }

    handleClose() {
        $('.nav-tabs li ').removeClass('active');
        $('.nav-tabs li').eq(0).addClass('active');
        $('.tab-content div ').removeClass('in show');
        $('#Listado').addClass('in show');
        this.setState({ pantalla: 1, edit: false, agregar: "Agregar", idTipoUnidad: null });
    }

    render() {
        const { height, data, columns, edit, consult } = this.state

        return (
            <div>

                <header className="topbar clearfix">
                    <Cabecera titulo="Tipo Unidad" >
                        <div className="page-header">
                            <ul className="list-page-breadcrumb">
                                <li>
                                    <a href="/Catalogos" className="color-mapeo">
                                        Catálogos <i className="zmdi zmdi-chevron-right" />
                                    </a>
                                </li>
                                <li className="active-page">Tipo Unidad</li>
                            </ul>
                        </div>
                    </Cabecera>
                </header>

                {/*Leftbar Start Here*/}
                <aside className="iconic-leftbar" style={{ minHeight: this.state.height }}>
                    <BarraLateralIzquierda />
                </aside>

                <section className="main-container">
                    <div className="container-fluid">


                        <ul className="nav navStatica nav-tabs">
                            <li className="active">
                                <a data-toggle="tab" data_id="1" href="#Listado" onClick={(event) => { event.stopPropagation(); this.setState({ pantalla: 1, edit: false, agregar: "Agregar" }); $('.nav-tabs li ').removeClass('active'); $('.nav-tabs li').eq(0).addClass('active'); $('.tab-content div ').removeClass('in show'); $('#Listado').addClass('in show'); }}>
                                    <i className="fa fa-list" /> Listado
                                </a>
                            </li>
                            <li >
                                <a data-toggle="tab" data_id="2" href="#Agregar" onClick={(event) => { event.stopPropagation(); this.setState({ pantalla: 2, edit: false, agregar: "Agregar" }); $('.nav-tabs li ').removeClass('active'); $('.nav-tabs li').eq(1).addClass('active'); $('.tab-content div ').removeClass('in show'); $('#Agregar').addClass('in show'); }}>
                                    <i className="fa fa-plus-circle" /> {this.state.agregar}
                                </a>
                            </li>

                            {/**<button className="topbar-right pull-right">Boton</button>*/}
                        </ul>


                        <div
                            className="row tab-content"
                            style={{ paddingLeft: "-15px" }}
                        >
                            <div id="Listado" className="tab-pane fade in show">
                                <div className="widget-wrap">
                                    <div className="widget-content">
                                        <div className="row" style={{ height: this.state.height - 250, width: '100%' }}>
                                            {data.length !== 0 ? (
                                                <DataGrid
                                                    rows={data}
                                                    columns={columns}
                                                    density="compact"
                                                    pageSize={Math.floor((this.state.height - 310) / 30)}
                                                    getRowId={(row) => row.m_nIdTipoUnidad}
                                                    onRowSelected={(row) => {
                                                        this.setState({
                                                            idTipoUnidad: row.data.m_nIdTipoUnidad
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

                            <div id="Agregar" className="tab-pane fade">
                                {
                                    this.state.pantalla === 2 &&

                                    <AgregarTipoUnidad edit={this.state.edit} onSubmit={this.handleAceptar} onClose={this.handleClose} idTipoUnidad={this.state.idTipoUnidad} />
                                }

                            </div>

                        </div>
                    </div>
                </section>
            </div >
        );
    }
}

TipoUnidad.propTypes = {

};

export default TipoUnidad;