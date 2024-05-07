import React, { useEffect, useState, useMemo } from "react";
import axios from "axios";
import Cabecera from "../Components/Template/Cabecera";
import BarraLateralIzquierda from "../Components/Template/BarraLateralIzquierda";
import BarraLateralDerecha from "../Components/Template/BarraLateralDerecha";
import { useTable, useFilters, useSortBy } from 'react-table'
import { styled } from "@mui/material/styles";
import makeStyles from '@mui/styles/makeStyles';
import { DataGrid } from '@mui/x-data-grid';

import Noty from 'noty';
import { dataGridLocaleText } from "../Constants";
import { Button, Grid, TextField, Tooltip } from "@mui/material";
import { obtenerEstatusViaje } from "../Util/Contexts/EstatusViajeContext";
import { validarPermisos } from "../Util/Contexts/UsuarioContext";
import $ from "jquery";
import {validarDerecho} from "../Util/Util"
import { confirmAlert } from "react-confirm-alert";
const PREFIX = 'EstatusViaje';

const classes = {
    seleccionado: `${PREFIX}-seleccionado`,
    noSeleccionado: `${PREFIX}-noSeleccionado`,
    disabled: `${PREFIX}-disabled`
};

const Root = styled('div')({
    [`& .${classes.seleccionado}`]: {
        backgroundColor: "#FCC88F",
    },
    [`& .${classes.noSeleccionado}`]: {
        backgroundColor: "#FFFFFF",
    },
    [`& .${classes.disabled}`]: {
        pointerEvents: "none",
        cursor: "default",
    },
});

window.jQuery = window.$ = $;
function showSuccess(mensaje) {
    new Noty({
        type: "information",
        layout: "topCenter",
        text: mensaje,
        timeout: "3000"
    }).show()
}

function EstatusViaje() {


    const [data, setData] = React.useState([])
    const [state, setState] = React.useState({
        idEstatusViaje: 0,
        DerechoBorrar: 93,
        estatusViaje: "",
        abreviacionViaje: "",
        tipoEstatusViaje: 0,
        colorViaje: "",
        noSeguimiento: false,
        archivo: false,
        carga: false,
        agregar: "Agregar",
        importar: "",
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
                    <Root style={{ backgroundColor: "#" + row.row.m_sColor, width: "100%", textAlign: "center" }}>
                        {row.row.m_sAbreviacion}
                    </Root>
                );
            }
        }, {
            headerName: "Estatus",
            field: "m_sEstatus",
            width: 125,
        }, {
            headerName: "Creado El",
            field: "m_sCreadoEl",
            width: 200,
        }, {
            headerName: "Creado Por",
            field: "m_sCreadoPor",
            width: 200,
        }, {
            headerName: "Modificado El",
            field: "m_sModificadoEl",
            width: 200,
        }, {
            headerName: "Modificado Por",
            field: "m_sModificadoPor",
            width: 200,
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
        obtenerEstatusViaje().then(respuesta => {
            setData(respuesta.data)
        });
    };

    function DefaultColumnFilter({
        column: { filterValue, preFilteredRows, setFilter },
    }) {
        const count = preFilteredRows.length

        return (
            <input
                className="form-control"
                value={filterValue || ''}
                onChange={e => {
                    setFilter(e.target.value || undefined)
                }}
                placeholder={`Buscar ${count} registros...`}
            />
        )
    }

    return (
        <div >

            <header className="topbar clearfix">
                <Cabecera titulo="Estatus Viaje" >
                    <div className="page-header">
                        <ul className="list-page-breadcrumb">
                            <li>
                                <a href="/Catalogos" className="color-mapeo">
                                    Catálogos <i className="zmdi zmdi-chevron-right" />
                                </a>
                            </li>
                            <li className="active-page">Estatus Viaje</li>
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
                        {/*<li>
                            <a className= {validarDerecho(9101324)? "":classes.disabled} data-toggle="tab" href="#Agregar" onClick={handleShowAgregar}>
                                <i className="fa fa-plus-circle" /> {state.agregar}
                            </a>
                        </li>*/}
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
                                                getRowId={(row) => row.m_nIdEstatusViaje}
                                                onRowSelected={(row) => {
                                                    setState({
                                                        ...state,
                                                        idEstatusViaje: row.data.m_nIdEstatusViaje
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

export default EstatusViaje;
