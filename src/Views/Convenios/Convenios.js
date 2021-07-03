import React, {Component} from 'react'
import Cabecera from "../../Components/Template/Cabecera";
import BarraLateralIzquierda from "../../Components/Template/BarraLateralIzquierda";
import {DataGrid} from "@material-ui/data-grid";
import {dataGridLocaleText} from "../../Constants";
import {TextField, Tooltip} from "@material-ui/core";
import {confirmAlert} from "react-confirm-alert";
import EscribirConvenio from "./EscribirConvenio";

export default class Convenios extends Component {
    state = {
        columns: [
            {
                headerName: "Acciones",
                soportable: false, filterable: false,
                field: "",
                renderCell: (row) => {
                    return(
                        <div>
                            <Tooltip title={"Agregar"}>
                                <a href={"#Agregar"}
                                   role={"tab"}
                                   data-toggle={"tab"}
                                   onClick={() => (this.handleShowModificar(row.row))}
                                   className={"btn btn-default btn-xs"}>
                                    <i className={"fa fa-pencil-square-o"}
                                       style={{ color: "#F9A03E" }}/>
                                </a>
                            </Tooltip>
                            <Tooltip title={"Consultar"}>
                                <a href={"#Agregar"}
                                   role={"tab"}
                                   data-toggle={"tab"}
                                   className={"btn btn-default btn-xs"}
                                   onClick={() => (this.handleShowModificar(row.row))}>
                                    <i className={"fa fa-eye"} style={{ color: "#F9A03E" }} />
                                </a>
                            </Tooltip>
                            <Tooltip title={"Eliminar"}>
                                <a href="#"
                                   className="btn btn-default btn-xs"
                                   onClick={() => confirmAlert({
                                       title: 'Confirmar Eliminar',
                                       message: 'Está seguro de eliminar Condición?',
                                       buttons: [
                                           {
                                               label: 'Si',
                                               onClick: () => this.handleEliminar(row.row)
                                           },
                                           {
                                               label: 'No',
                                           }
                                       ]
                                   })}>
                                    <i className="zmdi zmdi-delete" style={{ color: "#F30B0B" }} />
                                </a>
                            </Tooltip>
                        </div>
                    )
                }
            },
            {
                headerName: "ID",
                field: 'id',
                width: 100,
            },
            {
                headerName: "Nombre",
                field: 'nombre',
                width: 100,
            },
            {
                headerName: "vigencia",
                field: 'vigencia',
                width: 100,
            },
            {
                headerName: "RFC",
                field: 'rfc',
                width: 100,
            }

        ],
        height: window. innerHeight,
        conveniosList: [],

    }

    handleShowModificar = () => {}
    handleEliminar = () => {}

    render() {
        const {columns, conveniosList, height} = this.state
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
                                <a data-toggle={"tab"} href={"#Listado"}>
                                    <i className={"fa fa-list"}/> Listado
                                </a>
                            </li>
                            <li>
                                <a data-toggle={"tab"} href={"#Agregar"}>
                                    <i className={"fa fa-plus-circle"}/> Agregar
                                </a>
                            </li>
                        </ul>

                        <div className={"row"} className={"tab-content"}>
                            <div className="widget-wrap" id="Listado" className="tab-pane fade in active">
                                <div className="widget-wrap">
                                    <div className="widget-content">
                                        <div className={"row"} style={{height: height -250, width: '100%'}}>
                                            <DataGrid columns={columns} rows={conveniosList}
                                                      locateText={dataGridLocaleText}
                                                      density={"compact"}
                                                      pageSize={Math.floor((height - 310) / 30)}/>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="widget-wrap" id="Agregar" className="tab-pane fade">
                                <div className="widget-wrap">
                                    <div className="widget-content">
                                        <div className="row">
                                            {/*<div className="col-md-12">
                                                <form className="j-forms" onSubmit={handleAceptar}>
                                                    <div className="form-content">
                                                        <div className="row">
                                                            <div className="col-xs-6 col-sm-3 col-md-2-5 col-lg-2-5 unit">
                                                                <div className="input">
                                                                    <TextField variant="outlined" margin="dense" label="Descripción"
                                                                               onChange={handleChange}
                                                                               className="form-control"
                                                                               type="text"
                                                                               maxLength="50"
                                                                               required
                                                                               value={state.descripcion}
                                                                               placeholder={state.descripcion}
                                                                               id="descripcion"
                                                                               maxLength="50"/>
                                                                </div>
                                                            </div>
                                                        </div>
                                                        <div className="row">
                                                            <div className="form-footer" className="col-sm-6 col-md-5 unit">
                                                                <button href="#Listado"
                                                                        role="tab"
                                                                        data-toggle="tab"
                                                                        data-layout="topCenter"
                                                                        data-type="information"
                                                                        className="btn btn-secondary secondary-btn"> Cancelar</button>
                                                                <button type="submit"
                                                                        className="btn btn-primary primary-btn">Aceptar</button>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </form>
                                            </div>*/}
                                            <EscribirConvenio/>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>
            </div>
        )
    }
}