import React, {useEffect, useState} from 'react'
import Cabecera from "../../Components/Template/Cabecera";
import BarraLateralIzquierda from "../../Components/Template/BarraLateralIzquierda";
import $ from "jquery";
import CorteCajaAgregar from "./CorteCajaAgregar";
import Noty from "noty";
import {
    obtenerCorteId,
    obtenerCortes, obtenerCortesByFiltros
} from "../../Util/Contexts/CorteCajaContext";
import {getCurrentDate} from "../../Util/Util";
import CorteCajaListado from "./CorteCajaListado";
import {
    imprimirFormatosIdIdTipoReporte,
    obtenerFormatosImpresionProceso
} from "../../Util/Contexts/FormatosImpresionContext";
import DialogPagoFactura from "./DialogPagoFactura";

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

const FORMATOS_IMPRESION = {
    CORTE_CAJA: 219
}

function CorteCaja() {
    const [listaCortes, setListaCortes] = useState([])
    const [corteSeleccionado, setCorteSeleccionado] = useState(null)
    const [pantallaActiva, setPantallaActiva] = useState(1)
    const [consult, setConsult] = useState(false)
    const [state, setState] = useState({
        agregar: "Agregar",
        height: window.innerHeight

    })
    const [filtros, setFiltros] = useState({
        fecha: getCurrentDate(),
        operador: null,
        usuario: null,
        busquedaPorUsuario: false
    })
    const [openDialogPago, setOpenDialogPago] = useState(false);
    const [guiasPago, setGuiasPago] = useState([])

    const listado = 1
    const agregar = 2

    useEffect(value => {
        getAllCortes();
    }, [])

    const getAllCortes = () => {
        obtenerCortesByFiltros(getCurrentDate(), 0, 0).then(({data}) => {
            setListaCortes(data);
            setFiltros({
                ...filtros,
                fechaRegistro: getCurrentDate(),
            });
        }).catch(err => {
            showSuccess(err.toString())
        })
    }

    const handleShowListado = (event) => {
        if (event){
            event.stopPropagation();
        }
        resetFiltros()
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
            obtenerFormatosImpresionProceso(FORMATOS_IMPRESION.CORTE_CAJA).then(({data}) => {
                if (data.length === 0) {
                    showError("No se encontró un formato para el reporte solicitado. Comuniquese con las oficinas de GM.")
                    return
                }
                imprimirFormatosIdIdTipoReporte(data[data.length-1].m_nIdFormato, selectedItem.idCorte).then((respuesta) => { //poner aqui el id de Embarque
                    let pdfWindow = window.open("");
                    pdfWindow.document.write("<embed  width='100%' height='100%' src='data:application/pdf;base64, " + encodeURI(respuesta.data.m_sArchivo) + "'/>");
                    pdfWindow.document.body.style.margin = "0px";
                    pdfWindow.document.title = "CORTE " + selectedItem.idCorte;

                    try{
                        const link = document.createElement('a');
                        link.href = "data:application/pdf;base64," + respuesta.data.m_sArchivo;
                        link.setAttribute('download', "CORTE " + selectedItem.idCorte);
                        document.body.appendChild(link);
                        link.click();
                    }catch (e) {
                        console.log(e)
                        showSuccess("No se pudo descargar el pdf")
                    }
                }).catch((err) => {
                    showError(err.toString())
                })
            })
        }
        if (action === 'PAGAR') {
            const guiasAPagar = filterFacturasRepetidas(
                selectedItem.guias.filter((g) => g?.idFactura && g?.estatusFactura === "Pendiente Pago")
            );
            if(guiasAPagar.length > 0) {
                //console.log(guiasAPagar);
                setGuiasPago(guiasAPagar);
                setOpenDialogPago(true);
            }else{
                showSuccess("En el corte seleccionado no hay facturas que se puedan pagar");
            }
        }
    }

    const filterFacturasRepetidas = (guias) => {
        return guias.filter((value, index, self) =>
            index === self.findIndex((t) => (
                t.place === value.place && t.idFactura === value.idFactura
            ))
        )
    }

    const handleOnSaveSuccess = () => {
        handleShowListado(null)
    }

    const handleOpenDialogPago = () => {
        setOpenDialogPago(true);
    };

    const handleCloseDialogPago = () => {
        setGuiasPago([])
        setOpenDialogPago(false);
    };

    return (
        <div>
            <DialogPagoFactura
                open={openDialogPago}
                handleClose={handleCloseDialogPago}
                guias={guiasPago}
            />
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
                            value={{listadoCortes : listaCortes}}
                        />
                    </div>

                    <div id="Agregar" className="tab-pane fade">
                        <CorteCajaAgregar
                            value={corteSeleccionado}
                            disaled={consult}
                            setDisabled={(value) => setConsult(value)}
                            onSaveSuccess={handleOnSaveSuccess}
                        />
                    </div>
                </div>
            </div>
        </section>
    </div>
    )
}

export default CorteCaja;