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
import {Dialog, DialogActions, DialogContent, DialogTitle} from "@material-ui/core";
import AgregarFolio from "./AgregarFolios";
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


class Folios extends Component {
    constructor(props) {
        super(props);
        this.state = {
            data: [],
            agregar: "Agregar",
            openDialog: false,
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
                                <a href="#" className="btn btn-default btn-xs" onClick={() => (this.handleEliminar(row.row.m_nIdFolio))}><i className="zmdi zmdi-delete" style={{ color: "#F30B0B" }} /></a>
                            </div>
                        )
                    }
                },
                // {
                //     headerName: "Folio",
                //     field: "m_nFolio",
                //     width: 300,
                // },
                {
                    headerName: "Serie",
                    field: "m_sSerie",
                    width: 300,
                }, {
                    headerName: "Documento",
                    field: "m_nIdTipoDocumento",
                    width: 200,
                }, {
                    headerName: "Sucursal",
                    field: "m_sSucursal",
                    width: 125,
                },
                // {
                //     headerName: "Estatus",
                //     field: "m_nEstatus",
                //     valueFormatter: (params) => `$${parseFloat(params.value).toFixed(2)}`,
                //     width: 125,
                // },

            ]
        }
        this.cambiarPantalla = this.cambiarPantalla.bind(this)
        this.getAllData = this.getAllData.bind(this)
        this.handleEliminar = this.handleEliminar.bind(this)
        this.handleAceptar = this.handleAceptar.bind(this)
        this.handleClose = this.handleClose.bind(this)
    }

    componentDidMount() {
        this.getAllData()
    }

    handleEliminar(id) {
        // var derecho;
        // const urlDelete = `${process.env.REACT_APP_API_URL}/Utilerias/ValidaDerechos/${this.state.CreadoPor}/${this.state.DerechoBorrar}/3`;
        // axios.get(urlDelete, { headers }).then(respuesta => {
        //     derecho = respuesta.data;
        //     if (derecho === false) {
        //         showSuccess("El usuario no tiene derechos para realizar el proceso");
        //         return;
        //     }

            const url = `${process.env.REACT_APP_API_URL}/Folios/Eliminar/` + id;
            axios.delete(url, { headers }).then(respuesta => {
                console.log(respuesta);
                showSuccess(respuesta.data)
                this.getAllData();
            }).catch(err => {
                showSuccess(err)
            });
        // }).catch(err => {
        //     showSuccess(err)
        // });
    }

    handleAceptar(data) {
        const today = new Date();

        var params = {
            m_nIdSucursal: data.idSucursalAgregar,
            m_nIdTipoDocumento: data.idTipoDocumentoAgregar,
            m_nIdFormato: data.idFormatoImpresion,
            m_sSerie: data.serie,
            m_nFolioInicial: parseInt(data.folioInicial),
            m_nFolioFinal: parseInt(data.folioFinal),
            m_dtCreadoEl: today.getDate() + "/" + (today.getMonth() + 1) + "/" + today.getFullYear() + " " + today.getHours() + ":" + today.getMinutes(),
            m_nCreadoPor: localStorage.getItem("UsuarioId")
        }

            const url = `${process.env.REACT_APP_API_URL}/Folios/Agregar`;
            axios.post(url, Object.assign({}, params), { headers }).then(respuesta => {

                showSuccess(respuesta.data)
                $('.nav-tabs li ').removeClass('active');
                $('.nav-tabs li').eq(0).addClass('active');
                $('.tab-content div ').removeClass('in show');
                $('#Listado').addClass('in show');

                this.getAllData()
                this.setState({ pantalla: 1})
            }).catch(err => {
                console.log(err)
                showSuccess(err)
            });

    }

    cambiarPantalla(id) {
        this.setState({ pantalla: id })
    }

    getAllData() {
        const url = `${process.env.REACT_APP_API_URL}/Folios/GetListado`;
        axios.get(url, { headers }).then(respuesta => {
            this.setState({ data: respuesta.data, agregar:"Agregar" })
        });
    }

    handleClose () {
        this.setState({openDialog: false})
        $('.nav-tabs li ').removeClass('active');
        $('.nav-tabs li').eq(0).addClass('active');
        $('.tab-content div ').removeClass('in show');
        $('#Listado').addClass('in show');
        this.setState({ pantalla: 1 });
    }

    render() {
        const { height, data, columns, edit, consult } = this.state

        return (
            <div>
                {/*<Dialog open={this.state.openDialog} onClose={() => this.setState({openDialog: false, pantalla: 1, edit: false, consult: false, agregar: "Agregar"})} maxWidth={"sm"} fullWidth>*/}
                {/*    <DialogTitle>*/}
                {/*        <h4>Agregando Folios</h4>*/}
                {/*    </DialogTitle>*/}
                {/*    <DialogContent>*/}
                {/*        <AgregarFolio onSubmit={this.handleAceptar} onClose={this.handleClose}/>*/}
                {/*    </DialogContent>*/}
                {/*</Dialog>*/}

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
                                    <h2>Folios</h2>
                                </div>
                                <div className="col-md-6 col-sm-6">
                                    <ul className="list-page-breadcrumb">
                                        <li>
                                            <a href="/Configuraciones" className="color-mapeo">
                                                Configuración <i className="zmdi zmdi-chevron-right" />
                                            </a>
                                        </li>
                                        <li className="active-page">Folios</li>
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
                                                    getRowId={(row) => row.m_nIdFolio}
                                                    onRowSelected={(row) => {
                                                        this.setState({
                                                            idTarifa: row.data.m_nIdFolio
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
                                    <AgregarFolio onSubmit={this.handleAceptar} onClose={this.handleClose}/>
                                }

                            </div>

                        </div>
                    </div>
                </section>
            </div >
        );
    }
}

Folios.propTypes = {

};

export default Folios;