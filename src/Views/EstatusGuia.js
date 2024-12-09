import React, { useEffect, useState, useMemo } from "react";
import axios from "axios";
import Cabecera from "../Components/Template/Cabecera";
import BarraLateralIzquierda from "../Components/Template/BarraLateralIzquierda";
import BarraLateralDerecha from "../Components/Template/BarraLateralDerecha";
import { DataGrid } from '@mui/x-data-grid';
import Noty from 'noty';
import { dataGridLocaleText } from "../Constants";
import { obtenerEstatusGuia } from "../Util/Contexts/EstatusContext";

function showSuccess(mensaje) {
    new Noty({
        type: "information",
        layout: "topCenter",
        text: mensaje,
        timeout: "3000"
    }).show()
}
function EstatusGuia() {

    const [data, setData] = React.useState([])

    const [state, setState] = React.useState({
        idEstatusGuia: 0,
        DerechoBorrar: 81,
        height: window.innerHeight,
        CreadoPor: localStorage.getItem("UsuarioId"),
        ModificadoPor: localStorage.getItem("UsuarioId")
    })

    const columns = React.useMemo(() => [
        {
            headerName: "Abreviación",
            field: "m_sAbreviacion",
            width: 125,
            renderCell: (row) => {
                return (
                    <div style={{ backgroundColor: row.row.m_sColor, width: "100%", textAlign: "center" }}>
                        {row.row.m_sAbreviacion}
                    </div>
                )
            }
        }, {
            headerName: "Estatus",
            field: "m_sEstatus",
            width: 200,
        }, {
            headerName: "Descripción",
            field: "m_sDescripcion",
            width: 900
        }
    ]);

    useEffect(value => {
        if (localStorage.getItem("UsuarioId") === null || localStorage.getItem("UsuarioId") <= 0) {
            showSuccess("Es necesario iniciar sesion para acceder a este proceso");
            window.location.replace("configuracion");
            return;
        }
        getAllData();
    }, []);

    function getAllData() {
        obtenerEstatusGuia().then(respuesta => {
            setData(respuesta.data)
        });
    };


    return (
        <div >

            <header className="topbar clearfix">
                <Cabecera titulo="Estatus Guía" >
                    <div className="page-header">
                        <ul className="list-page-breadcrumb">
                            <li>
                                <a href="/Catalogos" className="color-mapeo">
                                    Catálogos <i className="zmdi zmdi-chevron-right" />
                                </a>
                            </li>
                            <li className="active-page">Estatus Guía</li>
                        </ul>
                    </div>
                </Cabecera>
            </header>

            {/*Leftbar Start Here*/}
            <aside className="iconic-leftbar">
                <BarraLateralIzquierda />
            </aside>
            {/*Leftbar End Here*/}

            {/*Page Container Start Here*/}
            <section className="main-container">

                <div className="container-fluid">

                    <ul className="nav navStatica nav-tabs">
                        <li className="active">
                            <a data-toggle="tab" href="#Listado">
                                <i className="fa fa-list" /> Listado
              </a>
                        </li>
                    </ul>

                    <div className="row" className="tab-content">
                        <div className="widget-wrap" id="Listado" className="tab-pane fade in active">
                            <div className="widget-wrap">
                                <div className="widget-content">
                                    <div className="row" style={{ height: state.height - 250, width: '100%' }}>
                                        {data.length != 0 ? (
                                            <DataGrid
                                            localeText={dataGridLocaleText}
                                                rows={data}
                                                columns={columns}
                                                density="compact"
                                                pageSize={Math.floor((state.height - 310) / 30)}
                                                getRowId={(row) => row.m_nIdEstatusGuia}
                                            />
                                        ) : (
                                            <div>No se encontró ningún registro</div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

            </section>
            {/*Page Container End Here*/}

            {/*Rightbar Start Here*/}
            <aside className="rightbar">
                <BarraLateralDerecha />
            </aside>

        </div>

    );
}

export default EstatusGuia;
