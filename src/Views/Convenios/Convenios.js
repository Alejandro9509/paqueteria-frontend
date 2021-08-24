import React, {Component, useMemo, useState} from 'react'
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

window.jQuery = window.$ = $;
function Convenios(){
    const columns = useMemo(() => [
        {
            headerName: "ID",
            field: 'id',
            width: 100,
        },
        {
            headerName: "RFC",
            field: 'rfc',
            width: 200,
        },
        {
            headerName: "Nombre",
            field: 'nombre',
            width: 300,
        },
        {
            headerName: "Vigencia",
            field: 'vigencia',
            width: 200,
        },
        {
            headerName: "Vigente",
            field: 'vigente',
            width: 100,
            renderCell: (row) => {
                return (
                    <div
                        style={{
                            width: "100%",
                            textAlign: "center",
                            color: row.row.vigente ? "green" : "red",
                        }}>
                        {row.row.vigente ? (
                            <SvgIcon component={Activo} />
                        ) : (
                            <SvgIcon component={NoActivo} />
                        )}
                    </div>
                );
            },
        },
    ])
    const [listaConvenios, setListaConvenios] = useState([
        {
            id: '001',
            rfc: "RFC12345",
            nombre: "Alberto Obregón",
            vigencia: "12/10/2021",
            vigente: true,
        },
        {
            id: '002',
            rfc: "RFC67890",
            nombre: "Alberto Obregón",
            vigencia: "12/01/2021",
            vigente: false,
        },
    ])
    const [state, setState] = useState({
        agregar: "Agregar",
        height: window. innerHeight,
    })


    const handleShowListado = (event) => {
        event.stopPropagation();
        // limpiarInputsAgregar()
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

    function handleShowAgregar(event) {
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
    const handleShowModificar = () => {}
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
                            <EscribirConvenio/>

                        </div>
                    </div>
                </div>
            </section>
        </div>
    )
}

export default Convenios;