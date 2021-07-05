import React, {Component} from 'react'
import Cabecera from "../../Components/Template/Cabecera";
import BarraLateralIzquierda from "../../Components/Template/BarraLateralIzquierda";
import {DataGrid, GridToolbar } from "@material-ui/data-grid";
import {dataGridLocaleText} from "../../Constants";
import SvgIcon from "@material-ui/core/SvgIcon";
import {ReactComponent as Activo} from "../../iconos/Menu/palomita.svg";
import {ReactComponent as NoActivo} from "../../iconos/Menu/cruz.svg";

export default class Convenios extends Component {
    state = {
        columns: [
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

        ],
        height: window. innerHeight,
        listaConvenios: [
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
        ],

    }

    handleShowModificar = () => {}
    handleEliminar = () => {}

    render() {
        const {columns, listaConvenios, height} = this.state
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
                            {/*<li>
                                <a  onClick={handleShowImprimir}>
                                    <i className="fa fa-print" /> Imprimir
                                </a>
                            </li>*/}
                        </ul>

                        <div className={"row"} className={"tab-content"}>
                            <div className="widget-wrap" id="Listado" className="tab-pane fade in active">
                                <div className="widget-wrap">
                                    <div className="widget-content">
                                        <div className={"row"} style={{height: height -250, width: '100%'}}>
                                            <DataGrid columns={columns} rows={listaConvenios}
                                                      locateText={dataGridLocaleText}
                                                      density={"compact"}
                                                      pageSize={Math.floor((height - 310) / 30)}
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

                        </div>
                    </div>
                </section>
            </div>
        )
    }
}