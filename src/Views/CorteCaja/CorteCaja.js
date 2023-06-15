import React, {Component, useEffect, useMemo, useState} from 'react'
import Cabecera from "../../Components/Template/Cabecera";
import BarraLateralIzquierda from "../../Components/Template/BarraLateralIzquierda";
import $ from "jquery";
import CorteCajaAgregar from "./CorteCajaAgregar";
import Noty from "noty";
import {
    obtenerCorteId, obtenerCorteReporte,
    obtenerCortes
} from "../../Util/Contexts/CorteCajaContext";
import {getCurrentDate} from "../../Util/Util";
import CorteCajaListado from "./CorteCajaListado";

window.jQuery = window.$ = $;


function showSuccess(mensaje) {
    new Noty({
        type: "information",
        layout: "topCenter",
        text: mensaje,
        timeout: "3000"
    }).show()
}
function CorteCaja(){
    const [listaCortes, setListaCortes] = useState([])
    const [corteSeleccionado, setCorteSeleccionado] = useState(null)
    const [pantallaActiva, setPantallaActiva ] = useState(1)
    const [consult, setConsult] = useState(false)
    const [state, setState] = useState({
        agregar: "Agregar",
        height: window. innerHeight,
    })
    const [filtros, setFiltros] = useState({
        fecha: getCurrentDate(),
        operador: null,
        usuario: null,
        busquedaPorUsuario: false
    })

    const listado = 1
    const agregar = 2

    useEffect(value => {
        getAllCortes()
    }, [])

    const getAllCortes = () => {
        obtenerCortes().then(({data}) => {

            setListaCortes(data)
            setFiltros({
                ...filtros,
                fechaRegistro: `${new Date().getFullYear()}-${`${new Date().getMonth() + 1}`.padStart(2, 0)}-${`${new Date().getDate()}`.padStart(2, 0)}`,
            })

        })
    }

    const handleShowListado = (event) => {
        event.stopPropagation();
        resetFiltros()
        getAllCortes()
        // limpiarInputsAgregar()
        setPantallaActiva(listado)
        setCorteSeleccionado(0)
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
        setCorteSeleccionado(null)
        setPantallaActiva(agregar)
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

    const resetFiltros = () => {
        setFiltros({
            fecha: getCurrentDate(),
            operador: null,
            usuario: null,
            busquedaPorUsuario: false
        })
    }

    const handleRowClick = (selectedItem, action) => {
        if (action === 'MODIFICAR'){
            // handleOpenDialog()
            obtenerCorteId(selectedItem.idCorte)
                .then(({data}) => {
                    setState(state =>{
                        return {
                            ...state,
                            agregar: "Modificar",
                        }
                    });
                    setCorteSeleccionado(data)
                    $('.nav-tabs li ').removeClass('active');
                    $('.nav-tabs li').eq(1).addClass('active');
                    $('.tab-content div ').removeClass('in show');
                    $('#Agregar').addClass('in show');
                })
                .catch((err) => {
                    showSuccess(err.toString())
                })
        }
        if (action === 'CONSULTAR'){
            // handleOpenDialog()
            obtenerCorteId(selectedItem.idCorte)
                .then(({data}) => {
                    setState(state =>{
                        return {
                            ...state,
                            agregar: "Consultar",
                        }
                    });
                    setConsult(true)
                    setCorteSeleccionado(data)
                    $('.nav-tabs li ').removeClass('active');
                    $('.nav-tabs li').eq(1).addClass('active');
                    $('.tab-content div ').removeClass('in show');
                    $('#Agregar').addClass('in show');
                })
                .catch((err) => {
                    showSuccess(err.toString())
                })
        }
        if (action === 'REPORTE_CORTE'){
            obtenerCorteReporte(selectedItem.idCorte)
                .then(({data}) => {
                    let pdfWindow = window.open("");
                    pdfWindow.document.write("<embed  width='100%' height='100%' src='data:application/pdf;base64, " + encodeURI(data) + "'/>");
                    pdfWindow.document.body.style.margin = "0px";
                    pdfWindow.document.title = "CORTE " + selectedItem.idCorte;

                    const link = document.createElement('a');
                    link.href = "data:application/pdf;base64," + data;
                    link.setAttribute('download', "CORTE " + selectedItem.idCorte);
                    document.body.appendChild(link);
                    link.click();
                })
                .catch((err) => {
                    showSuccess(err.toString())
                })
        }
    };

    const handleSetDisabled = (selectedItem, action) => {

    };

    return(
        <div>
            <header className="topbar clearfix">
                <Cabecera titulo="Corte Caja" >
                    <div className="page-header">
                        <ul className="list-page-breadcrumb">
                            <li className="active-page">Corte Caja</li>
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
                            <CorteCajaListado
                                onRowClick={handleRowClick}
                            />
                        </div>

                        <div id="Agregar" className="tab-pane fade">
                            <CorteCajaAgregar
                                value={corteSeleccionado}
                                disaled={consult}
                                setDisabled={(value) => setConsult(value)}
                            />
                        </div>
                    </div>
                </div>
            </section>
        </div>
    )
}

export default CorteCaja;