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
import {
    imprimirFormatosIdIdTipoReporte,
    obtenerFormatosImpresionProceso
} from "../../Util/Contexts/FormatosImpresionContext";
import {
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    FormControl,
    Grid,
    InputLabel,
    MenuItem,
    Select
} from "@material-ui/core";

window.jQuery = window.$ = $;


function showSuccess(mensaje) {
    new Noty({
        type: "information",
        layout: "topCenter",
        text: mensaje,
        timeout: "3000"
    }).show()
}
function showError(mensaje) {
    new Noty({
        type: "error",
        layout: "topCenter",
        text: mensaje,
        timeout: "3000",
    }).show();
}
function CorteCaja() {
    const [listaCortes, setListaCortes] = useState([])
    const [corteSeleccionado, setCorteSeleccionado] = useState(null)
    const [pantallaActiva, setPantallaActiva] = useState(1)
    const [consult, setConsult] = useState(false)
    const [openDialog, setOpenDialog] = useState(false)
    const [dataReportes, setDataReportes] = useState([])
    const [seleccion, setSeleccion] = useState(null)
    const [state, setState] = useState({
        agregar: "Agregar",
        height: window.innerHeight,
        reporteSeleccionado: null

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

    useEffect(() => {

        obtenerFormatosImpresionProceso(219).then(({data}) => {
            setDataReportes(data)
        })
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
        setState(state => {
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
        if (action === 'MODIFICAR') {
            // handleOpenDialog()
            obtenerCorteId(selectedItem.idCorte)
                .then(({data}) => {
                    setState(state => {
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
        if (action === 'CONSULTAR') {
            // handleOpenDialog()
            obtenerCorteId(selectedItem.idCorte)
                .then(({data}) => {
                    setState(state => {
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
        if (action === 'REPORTE_CORTE') {


            setSeleccion(selectedItem)
            console.log(selectedItem)
            setOpenDialog(true)

            /* obtenerCorteReporte(selectedItem.idCorte)
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
        }*/
        }
    }

        const handleOnChangeReporte = (data) => {
            console.log(data)
            setState({
                ...state,
                reporteSeleccionado: data
            })
        }
        const handleGenerarReporte = (e) => {
            e.preventDefault()
            console.log(state.reporteSeleccionado)
            console.log(seleccion)

            if (state.reporteSeleccionado.length === 0) {
                showError("Es necesario seleccionar al menos un reporte")
                return
            }

            imprimirFormatosIdIdTipoReporte(state.reporteSeleccionado, seleccion.idCorte).then(({data}) => { //poner aqui el id de Embarque
                console.log(data)
                let pdfWindow = window.open("");
                pdfWindow.document.write("<embed  width='100%' height='100%' src='data:application/pdf;base64, " + encodeURI(data.m_sArchivo) + "'/>");
                pdfWindow.document.body.style.margin = "0px";
                pdfWindow.document.title = "CORTE " + seleccion.idCorte;

                try{
                    const link = document.createElement('a');
                    link.href = "data:application/pdf;base64," + data.m_sArchivo;
                    link.setAttribute('download', "CORTE " + seleccion.idCorte);
                    document.body.appendChild(link);
                    link.click();
                }catch (e) {
                    console.log(e)
                    showSuccess("No se pudo descargar el pdf")
                }
            }).catch((err) => {
                showError(err.toString())
            })
            setState({
                ...state,
                reporteSeleccionado: null
            })
            setOpenDialog(false)
        }

        return (
            <div>
                {
                    openDialog &&
                    <Dialog
                        open={openDialog}
                        onClose={() => setOpenDialog(false)}
                        fullWidth maxWidth="md"
                    >
                        <DialogTitle>
                            Reporte de Corte de Caja
                        </DialogTitle>
                        <DialogContent>
                            <div className="row" style={{backgroundColor: '#FFFFFF'}}>
                                <form onSubmit={handleGenerarReporte}>
                                    <Grid container spacing={1}>
                                        <Grid item sm={6}>
                                            <FormControl
                                                className="input select"
                                                fullWidth variant="outlined"
                                                required
                                                margin="dense">
                                                <InputLabel
                                                    id="idReporteLabel">Formato de Reporte</InputLabel>
                                                <Select
                                                    fullWidth
                                                    labelId="idReporteLabel"
                                                    label="Reporte"
                                                    className="form-control"
                                                    value={state.reporteSeleccionado ?? ''}
                                                    onChange={(e) => handleOnChangeReporte(e.target.value)}
                                                    name="reporteSeleccionado"
                                                >
                                                    {dataReportes.map((reporte) => (
                                                        <MenuItem
                                                            key={reporte.m_nIdFormato}
                                                            value={reporte.m_nIdFormato}
                                                        >
                                                            {reporte.m_sFormato}
                                                        </MenuItem>
                                                    ))}
                                                </Select>
                                            </FormControl>
                                        </Grid>
                                    </Grid>
                                    <DialogActions>

                                        <button className="btn btn-secondary secondary-btn" onClick={() => {
                                            setOpenDialog(false)
                                            setState({
                                                ...state,
                                                reporteSeleccionado: null
                                            })
                                        }
                                        }>
                                            Cancelar
                                        </button>
                                        <button className="btn btn-primary primary-btn" color={"primary"} type={"submit"}>
                                            Aceptar
                                        </button>
                                    </DialogActions>
                                </form>
                            </div>
                        </DialogContent>
                    </Dialog>
                }
                <header className="topbar clearfix">
                    <Cabecera titulo="Corte Caja">
                        <div className="page-header">
                            <ul className="list-page-breadcrumb">
                                <li className="active-page">Corte Caja</li>
                            </ul>
                        </div>
                    </Cabecera>
                </header>
                {/*Leftbar Start Here*/}
                <aside className="iconic-leftbar">
                    <BarraLateralIzquierda/>
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
                                    <i className="fa fa-plus-circle"/> {state.agregar}
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
                                />
                            </div>
                        </div>
                    </div>
                </section>
            </div>
        )

}
export default CorteCaja;