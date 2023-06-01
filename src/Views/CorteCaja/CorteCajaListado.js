import React, {Component, useEffect, useMemo, useState} from 'react'
import $ from "jquery";
import Noty from "noty";
import {
    eliminarCorte,
    obtenerCortesByFiltros
} from "../../Util/Contexts/CorteCajaContext";
import TableCortesCaja from "./TableCortesCaja";
import Filtros from "./Filtros";
import {getCurrentDate} from "../../Util/Util";

window.jQuery = window.$ = $;


function showSuccess(mensaje) {
    new Noty({
        type: "information",
        layout: "topCenter",
        text: mensaje,
        timeout: "3000"
    }).show()
}

function CorteCajaListado(){
    const [listaCortes, setListaCortes] = useState([])
    const [corteSeleccionado, setCorteSeleccionado] = useState(0)
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

    const modificar = 3

    const ACTIONS = {
        MODIFICAR: 'MODIFICAR',
        CONSULTAR: 'CONSULTAR',
    }

    useEffect(value => {
        getAllCortes()
    }, [])

    const getAllCortes = () => {
        obtenerCortesByFiltros(filtros.fecha, 0, 0).then(({data}) => {
            setListaCortes(data)
        })
    }

    const handleShowModificar = (corte) => {
        setConsult(false)
        setCorteSeleccionado(corte.m_nIdCorte)
        setPantallaActiva(modificar)
        setState(state =>{
            return {
                ...state,
                agregar: "Modificar",
            }
        });
        $('.nav-tabs li ').removeClass('active');
        $('.nav-tabs li').eq(1).addClass('active');
        $('.tab-content div ').removeClass('in show');
        $('#Agregar').addClass('in show');
    }
    const handleShowConsultar = (corte) => {
        setCorteSeleccionado(corte.m_nIdCorte)
        setPantallaActiva(modificar)
        setConsult(true)
        setState(state =>{
            return {
                ...state,
                agregar: "Consultar",
            }
        });
        $('.nav-tabs li ').removeClass('active');
        $('.nav-tabs li').eq(1).addClass('active');
        $('.tab-content div ').removeClass('in show');
        $('#Agregar').addClass('in show');
    }

    const handleEliminar = (corte) => {
        eliminarCorte(corte.m_nIdCorte, 0).then(respuesta => {
            console.log(respuesta)
            showSuccess(respuesta.data);
            getAllCortes()
        });
    }

    const handleChangeFiltros = (newData) => {
        setFiltros(newData)
    }

    const handleFiltrarClick = () => {
        let fecha = filtros.fecha ? filtros.fecha : 0
        let idOperador = filtros.operador?.m_nIdOperador ? filtros.operador?.m_nIdOperador : 0
        let idUsuario = filtros.usuario?.idUsuario ? filtros.usuario?.idUsuario : 0
        obtenerCortesByFiltros(fecha, idOperador, idUsuario)
            .then(({data}) => {
                setListaCortes(data)
            })
            .catch(err => {
                showSuccess(err.toString())
            })
    };

    return(
        <div>
            <Filtros value={filtros} onChange={handleChangeFiltros} onFiltrarClick={handleFiltrarClick}/>
            <TableCortesCaja data={listaCortes}/>
        </div>
    )
}

export default CorteCajaListado;