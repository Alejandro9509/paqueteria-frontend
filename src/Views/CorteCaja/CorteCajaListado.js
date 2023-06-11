import React, {Component, useEffect, useMemo, useState} from 'react'
import $ from "jquery";
import Noty from "noty";
import {
    eliminarCorte,
    obtenerCortesByFiltros, obtenerCortesGeneralReporte
} from "../../Util/Contexts/CorteCajaContext";
import TableCortesCaja from "./TableCortesCaja";
import Filtros from "./Filtros";
import {getCurrentDate} from "../../Util/Util";
import * as XLSX from "xlsx";

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

    const handleReportGeneralClick = () => {
        let fecha = filtros.fecha
        obtenerCortesGeneralReporte(fecha)
            .then(({data}) => {
                let pdfWindow = window.open("");
                pdfWindow.document.write("<embed  width='100%' height='100%' src='data:application/pdf;base64, " + encodeURI(data) + "'/>");
                pdfWindow.document.body.style.margin = "0px";
                pdfWindow.document.title = "REPORTE " + fecha;

                const link = document.createElement('a');
                link.href = "data:application/pdf;base64," + data;
                link.setAttribute('download', "REPORTE " + fecha);
                document.body.appendChild(link);
                link.click();
            })
            .catch((err) => {
                showSuccess(err.toString())
            })

        /*var jsonData = [
            { Nombre: 'John Doe', Edad: 30, Ciudad: 'Nueva York' },
            { Nombre: 'Jane Smith', Edad: 28, Ciudad: 'Los Ángeles' },
            { Nombre: 'Juan Pérez', Edad: 35, Ciudad: 'Ciudad de México' }
        ];
        // Crear una hoja de cálculo nueva
        var workbook = XLSX.utils.book_new();

        // Convertir el JSON a una hoja de cálculo
        var worksheet = XLSX.utils.json_to_sheet(jsonData);

        // Agregar la hoja de cálculo al libro
        XLSX.utils.book_append_sheet(workbook, worksheet, 'Datos');

        // Guardar el archivo Excel
        XLSX.writeFile(workbook, 'datos.xlsx');*/
    };

    return(
        <div>
            <Filtros value={filtros} onChange={handleChangeFiltros} onFiltrarClick={handleFiltrarClick} onReportClick={handleReportGeneralClick}/>
            <TableCortesCaja data={listaCortes} onRowClick={handleRowClick}/>
        </div>
    )
}

export default CorteCajaListado;