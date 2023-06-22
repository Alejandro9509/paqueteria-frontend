import React, {Component, useEffect, useMemo, useState} from 'react'
import $ from "jquery";
import Noty from "noty";
import {
    eliminarCorte,
    obtenerCortesByFiltros, obtenerCortesGeneralReporte
} from "../../Util/Contexts/CorteCajaContext";
import TableCortesCaja from "./TableCortesCaja";
import Filtros from "./Filtros";
import {getCurrentDate, getCurrentTime} from "../../Util/Util";
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

function CorteCajaListado({onRowClick, value}){
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

    useEffect(() => {
        if (value.listadoCortes) {
            setListaCortes(value.listadoCortes)
        }
    }, [value])

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
        let hora = getCurrentTime()
        let dateTime = fecha + ' ' + hora
        obtenerCortesGeneralReporte(dateTime)
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
    };

    function totalSum(items) {
        return items.map(({ total }) => total).reduce((sum, i) => sum + i, 0);
    }
    function sumarTotalPorPersona(items) {
        const sumByPerson = {};

        items.forEach((item) => {
            const idPersona = item.idPersona;
            const total = item.total;

            if (!sumByPerson[idPersona]) {
                sumByPerson[idPersona] = {
                    total: 0,
                    nombrePersona: item.nombrePersona,
                    idPersona: idPersona
                };
            }

            sumByPerson[idPersona].total += total;
        });
        return Object.values(sumByPerson);
    }

    const handleExcelClick = () => {
        let arrayExcel = [];
        listaCortes.forEach(corte => {
            arrayExcel.push({
                'FOLIO CORTE': corte.folioCorte,
                'FOLIO GUIA': '',
                'FECHA ENTREGA': '',
                'OPERADOR/USUARIO': '',
                'FORMA DE PAGO': '',
                'TOTAL GUIA': '',
                'TOTAL CORTE': ''
            })
            corte.guias.forEach(guia => {
                arrayExcel.push({
                    'FOLIO CORTE': '',
                    'FOLIO GUIA': guia.folioGuia,
                    'FECHA ENTREGA': guia.fechaEntrega,
                    'OPERADOR/USUARIO': guia.nombrePersona,
                    'FORMA DE PAGO': guia.tipoPago,
                    'TOTAL GUIA': guia.total,
                    'TOTAL CORTE': ''
                })
            })
            arrayExcel.push({
                'FOLIO CORTE': '',
                'FOLIO GUIA': '',
                'FECHA ENTREGA': '',
                'OPERADOR/USUARIO': '',
                'FORMA DE PAGO': '',
                'TOTAL GUIA': '',
                'TOTAL CORTE': corte.total
            })
        })
        /*ESTE ES SOLO PARA HACER UNA SEPARACION*/
        arrayExcel.push({
            'FOLIO CORTE': '',
            'FOLIO GUIA': '',
            'FECHA ENTREGA': '',
            'OPERADOR/USUARIO': '',
            'FORMA DE PAGO': '',
            'TOTAL GUIA': '',
            'TOTAL CORTE': ''
        })
        const totalFinal = totalSum(listaCortes);
        arrayExcel.push({
            'FOLIO CORTE': '',
            'FOLIO GUIA': '',
            'FECHA ENTREGA': '',
            'OPERADOR/USUARIO': '',
            'FORMA DE PAGO': 'TOTAL CORTES',
            'TOTAL GUIA': '',
            'TOTAL CORTE': totalFinal
        })
        const sumByPerson = sumarTotalPorPersona(listaCortes);
        sumByPerson.forEach(person => {
            arrayExcel.push({
                'FOLIO CORTE': '',
                'FOLIO GUIA': '',
                'FECHA ENTREGA': '',
                'OPERADOR/USUARIO': '',
                'FORMA DE PAGO': 'TOTAL ' + person.nombrePersona,
                'TOTAL GUIA': '',
                'TOTAL CORTE': person.total
            })
        })
        exportarAExcel(arrayExcel)
    };

    function exportarAExcel(jsonData) {

        // Crear una hoja de cálculo nueva
        var workbook = XLSX.utils.book_new();

        // Convertir el JSON a una hoja de cálculo
        var worksheet = XLSX.utils.json_to_sheet(jsonData);

        // Agregar la hoja de cálculo al libro
        XLSX.utils.book_append_sheet(workbook, worksheet, 'Tabla');

        // Guardar el archivo Excel
        XLSX.writeFile(workbook, 'CORTES_CAJA.xlsx');
    }

        return(
        <div>
            <Filtros value={filtros} onChange={handleChangeFiltros} onFiltrarClick={handleFiltrarClick} onReportClick={handleReportGeneralClick} onExcelClick={handleExcelClick}/>
            <TableCortesCaja data={listaCortes} onRowClick={handleRowClick}/>
        </div>
    )
}

export default CorteCajaListado;