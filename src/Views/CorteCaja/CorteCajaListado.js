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

function CorteCajaListado({onRowClick}){
    const [listaCortes, setListaCortes] = useState([])
    const [filtros, setFiltros] = useState({
        fecha: getCurrentDate(),
        operador: null,
        usuario: null,
        busquedaPorUsuario: false
    })

    useEffect(value => {
        getAllCortes()
    }, [])

    const getAllCortes = () => {
        obtenerCortesByFiltros(0, 0, 0)
            .then(({data}) => {
                setListaCortes(data)
            })
            .catch(err => {
                showSuccess(err.toString())
            })
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

    const handleRowClick = (selectedItem, action) => {
        onRowClick(selectedItem, action)
    };

    return(
        <div>
            <Filtros value={filtros} onChange={handleChangeFiltros} onFiltrarClick={handleFiltrarClick}/>
            <TableCortesCaja data={listaCortes} onRowClick={handleRowClick}/>
        </div>
    )
}

export default CorteCajaListado;