import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Cabecera from '../../Components/Template/Cabecera';
import BarraLateralIzquierda from '../../Components/Template/BarraLateralIzquierda';
import CrearTarifa from './CrearTarifa';
import Noty from 'noty';
import axios from "axios";
import SvgIcon from "@material-ui/core/SvgIcon";
import { ReactComponent as Activo } from "../../iconos/Menu/palomita.svg";
import { ReactComponent as NoActivo } from "../../iconos/Menu/cruz.svg";
import { DataGrid } from '@material-ui/data-grid';
import $ from "jquery";
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


class Tarifas extends Component {
    constructor(props) {
        super(props);
        this.state = {
            data: [],
            agregar: "Agregar",
            height: window.innerHeight,
            pantalla: 1,
            selected: {},
            dataSucursal: [],
            columns: [
                {
                    headerName: "Acciones",
                    field: "",
                    renderCell: (row) => {
                        return (
                            <div>
                                <a href="#Agregar" role="tab" data-toggle="tab" onClick={() => (this.handleShowModificar(row.row.m_nIdTarifa))} className="btn btn-default btn-xs"><i className="fa fa-pencil-square-o" style={{ color: "#F9A03E" }} /></a>
                                <a href="#Agregar" role="tab" data-toggle="tab" className="btn btn-default btn-xs" onClick={() => (this.handleShowConsultar(row.row.m_nIdTarifa))}><i className="fa fa-eye" style={{ color: "#F9A03E" }} /></a>
                                <a href="#" className="btn btn-default btn-xs" onClick={() => (this.handleEliminar(row.row.m_nIdTarifa))}><i className="zmdi zmdi-delete" style={{ color: "#F30B0B" }} /></a>
                            </div>
                        )
                    }
                },
                {
                    headerName: "Sucursal Origen",
                    field: "m_nIdSucursal",
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

            ]
        }
        this.cambiarPantalla = this.cambiarPantalla.bind(this)
        this.getAllData = this.getAllData.bind(this)
        this.handleShowModificar = this.handleShowModificar.bind(this)
        this.handleShowConsultar = this.handleShowConsultar.bind(this)
        this.handleEliminar = this.handleEliminar.bind(this)
        this.handleAceptar = this.handleAceptar.bind(this)
    }


    componentDidMount() {
        this.getAllData()
    }

    handleShowModificar(id) {
        $('.nav-tabs li ').removeClass('active');
        $('.nav-tabs li').eq(1).addClass('active');
        $('.tab-content div ').removeClass('in show');
        $('#Agregar').addClass('in show');
        const url = `${process.env.REACT_APP_API_URL}/Tarifas/GetById/` + id;
        axios.get(url, { headers }).then(respuesta => {
            console.log(respuesta.data)
            this.setState({
                pantalla: 2,
                openDialog: true,
                agregar: "Modificar",
                edit: true,
                consult: false,
                selected: respuesta.data,
            })
        });
    }

    handleShowConsultar(id) {
        $('.nav-tabs li ').removeClass('active');
        $('.nav-tabs li').eq(1).addClass('active');
        $('.tab-content div ').removeClass('in show');
        $('#Agregar').addClass('in show');
        const url = `${process.env.REACT_APP_API_URL}/Tarifas/GetById/` + id;
        axios.get(url, { headers }).then(respuesta => {
            console.log(respuesta.data)
            this.setState({
                pantalla: 2,
                agregar: "Consultar",
                openDialog: true,
                edit: true,
                consult: true,
                selected: respuesta.data,
            })
        });
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

            const url = `${process.env.REACT_APP_API_URL}/Tarifas/Eliminar/` + id;
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

    handleAceptar(data) {
        var params = {
            m_nIdSucursal: data.sucursal,
            m_sDestino: data.destino,
            m_cFleteMinimo: data.precioFlete,
            m_bActivo: data.activo ? 1 : 0,
            m_cMontoMinimo: data.precioMinimo,
            m_cPrecioKilo: data.precioKilo,
            m_cPrecioM3: data.precioM3,
            m_arrArCobros: data.tiposCobroSeleccionado.map(c => ({ m_nIdTipoCobro: c.m_nIdTipoCobro })),
            m_arrArServicios: data.tiposServicioSeleccionado.map(s => ({ m_nIdTipoServicio: s.m_nIdTipoServicio })),
            m_arrArConceptos: data.conceptosAdicionales.map(c => ({ m_nIdConceptoFacturacion: c.concepto.m_nIdConceptoFacturacion, m_cImporte: c.importe, m_nIdImpuestoTraslada: c.traslada, m_nIdImpuestoRetiene: c.retiene, m_cImporteRetiene: c.importeRet, m_cImporteIva: c.importeIva })),
            m_nCreadoPOr: localStorage.getItem("UsuarioId"),
            m_nModificadoPor: localStorage.getItem("UsuarioId")
        }
        if (this.state.edit) {
            const url = `${process.env.REACT_APP_API_URL}/Tarifas/Modificar/` + this.state.selected.m_nIdTarifa;
            axios.put(url, Object.assign({}, params), { headers }).then(respuesta => {
                showSuccess(respuesta.data)
                this.getAllData()
                this.setState({ openDialog: false, pantalla: 1 })
                $('.nav-tabs li ').removeClass('active');
                $('.nav-tabs li').eq(0).addClass('active');
                $('.tab-content div ').removeClass('in show');
                $('#Listado').addClass('in show');
            }).catch(err => {
                console.log(err)
                showSuccess("err")
            });
        } else {
            const url = `${process.env.REACT_APP_API_URL}/Tarifas/Agregar`;
            axios.post(url, Object.assign({}, params), { headers }).then(respuesta => {
                showSuccess(respuesta.data)
                this.getAllData()
                this.setState({ openDialog: false, pantalla: 1 })
                $('.nav-tabs li ').removeClass('active');
                $('.nav-tabs li').eq(0).addClass('active');
                $('.tab-content div ').removeClass('in show');
                $('#Listado').addClass('in show');
            }).catch(err => {
                console.log(err)
                showSuccess(err)
            });
        }

    }

    cambiarPantalla(id) {
        this.setState({ pantalla: id })
    }

    getAllData() {
        const url = `${process.env.REACT_APP_API_URL}/Tarifas/GetListado`;
        axios.get(url, { headers }).then(respuesta => {
            this.setState({ data: respuesta.data, agregar:"Agregar" })
        });
    }


    render() {
        const { height, data, columns, edit, consult } = this.state

        return (
            <div>
                <header className="topbar clearfix">
                    <Cabecera />
                </header>

                {/*Leftbar Start Here*/}
                <aside className="iconic-leftbar" style={{ minHeight: this.state.height }}>
                    <BarraLateralIzquierda />
                </aside>

                <section className="main-container">
                    <div className="container-fluid">
                        <div className="page-header filled full-block light">
                            <div className="row">
                                <div className="col-md-6 col-sm-6">
                                    <h2>Tarifas</h2>
                                </div>
                                <div className="col-md-6 col-sm-6">
                                    <ul className="list-page-breadcrumb">
                                        <li>
                                            <a href="/Catalogos" className="color-mapeo">
                                                Catálogos <i className="zmdi zmdi-chevron-right" />
                                            </a>
                                        </li>
                                        <li className="active-page">Tarifas</li>
                                    </ul>
                                </div>
                            </div>
                        </div>


                        <ul className="nav navStatica nav-tabs">
                            <li className="active">
                                <a data-toggle="tab" data_id="1" href="#Listado" onClick={(event) => { event.stopPropagation(); this.setState({ pantalla: 1, edit: false, consult: false, agregar: "Agregar"}); $('.nav-tabs li ').removeClass('active'); $('.nav-tabs li').eq(0).addClass('active'); $('.tab-content div ').removeClass('in show'); $('#Listado').addClass('in show'); }}>
                                    <i className="fa fa-list" /> Listado
              </a>
                            </li>
                            <li >
                                <a data-toggle="tab" data_id="2" href="#Agregar" onClick={(event) => { event.stopPropagation(); this.setState({ pantalla: 2, edit: false, consult: false, agregar: "Agregar" }); $('.nav-tabs li ').removeClass('active'); $('.nav-tabs li').eq(1).addClass('active'); $('.tab-content div ').removeClass('in show'); $('#Agregar').addClass('in show'); }}>
                                    <i className="fa fa-plus-circle" /> {this.state.agregar}
                                </a>
                            </li>

                            <li>
                                <a data_id="3">
                                    <i className="fa fa-times-circle" /> Imprimir
                                </a>
                            </li>



                            {/**<button className="topbar-right pull-right">Boton</button>*/}
                        </ul>


                        <div
                            className="row"
                            className="tab-content"
                            style={{ paddingLeft: "-15px" }}
                        >
                            <div id="Listado" className="tab-pane fade in show">
                                <div className="widget-wrap">
                                    <div className="widget-content">
                                        <div className="row" style={{ height: this.state.height - 250, width: '100%' }}>
                                            {data.length != 0 ? (
                                                <DataGrid
                                                    rows={data}
                                                    columns={columns}
                                                    density="compact"
                                                    pageSize={Math.floor((this.state.height - 310) / 30)}
                                                    getRowId={(row) => row.m_nIdTarifa}
                                                    onRowSelected={(row) => {
                                                        this.setState({
                                                            idTarifa: row.data.m_nIdTarifa
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
                                    this.state.pantalla == 2 &&
                                    <CrearTarifa edit={this.state.edit} select={this.state.selected} onSubmit={this.handleAceptar}></CrearTarifa>
                                }

                            </div>

                        </div>
                    </div>
                </section>
            </div >
        );
    }
}

Tarifas.propTypes = {

};

export default Tarifas;