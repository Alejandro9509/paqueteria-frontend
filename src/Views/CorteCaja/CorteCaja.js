import React, {Component, useEffect, useMemo, useState} from 'react'
import Cabecera from "../../Components/Template/Cabecera";
import BarraLateralIzquierda from "../../Components/Template/BarraLateralIzquierda";
import $ from "jquery";
import CorteCajaAgregar from "./CorteCajaAgregar";
import Noty from "noty";
import {
    obtenerCorteId,
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
                            {/*<div className="widget-wrap">
                                <div className="widget-content">
                                    <div className="row">
                                        <div className="col-md-12">
                                            <Grid container spacing={2} alignItems="center">
                                                <Grid item xs={4}>
                                                    <FormControl className="input select" fullWidth variant="outlined">
                                                        <InputLabel
                                                            id="idCiudadLabel">Ciudad</InputLabel>
                                                        <Select
                                                            labelId="idCiudadLabel"
                                                            label="Ciudad"
                                                            className="form-control"
                                                            required
                                                            value={filtros.idCiudad}
                                                            onChange={handleChangeFiltros}
                                                            id="idCiudad"
                                                            name="idCiudad"
                                                        >
                                                            <option key={0} value={0}>{"Seleccionar"}</option>
                                                            {dataCiudad.map((ciudad) => (
                                                                <option
                                                                    key={ciudad.m_nIdCiudad}
                                                                    value={ciudad.m_nIdCiudad}
                                                                >
                                                                    {ciudad.m_sCiudad}
                                                                </option>
                                                            ))}
                                                        </Select>
                                                    </FormControl>
                                                </Grid>
                                                <Grid item xs={4}>
                                                    <div className="input">
                                                        <TextField
                                                            variant="outlined"
                                                            id="fechaRegistro"
                                                            label="Fecha de registro"
                                                            type="date"
                                                            onChange={handleChangeFiltros}
                                                            value={filtros.fechaRegistro}
                                                            className={"form-control"}
                                                            InputLabelProps={{shrink: true,}}
                                                            name={"fechaRegistro"}
                                                            // required={state.recoleccionConCita}
                                                        />
                                                    </div>
                                                </Grid>
                                                <Grid item container xs={4}>
                                                    <IconButton aria-label="delete" onClick={() => {
                                                        resetFiltros()
                                                        getAllCortes()
                                                    }}>
                                                        <RestartAltIcon fontSize={"large"} style={{marginRight: '10px'}}/>
                                                        Limpiar filtros
                                                    </IconButton>
                                                </Grid>

                                            </Grid>
                                        </div>
                                    </div>
                                    <div className={"row"}>
                                        <List
                                            sx={{ width: '100%', maxWidth: 360, bgcolor: 'background.paper' }}
                                            component="nav"
                                            aria-labelledby="nested-list-subheader"
                                        >
                                            {
                                                listaCortes.map((group,index) => (
                                                    <Accordion >
                                                           <AccordionSummary
                                                                   expandIcon={<ExpandMoreIcon />}
                                                                    aria-controls="panel2a-content"
                                                                 id="panel2a-header"
                                                                >
                                                              <ListItem button key={index} onClick={() => handleClick(index)} style={{backgroundColor:"lightgrey"}}>
                                                            <ListItemText primary={
                                                                <Grid container spacing={1} alignItems="center">
                                                                    <Grid item xs={1}>
                                                                        <IconButton aria-label="file" onClick={() => generarResumenReporte(group[0].m_nIdDestino, group[0].m_sFechaRegistro)}>
                                                                            <InsertDriveFile fontSize={"large"}/>
                                                                        </IconButton>
                                                                    </Grid>
                                                                    <Grid item xs={2}>{group[0].m_sDestino}</Grid>
                                                                    <Grid item xs={2}>{group[0].m_sFechaRegistro}</Grid>
                                                                    <Grid item xs={5}/>
                                                                    <Grid item xs={2}>Total: {currencyFormatter.format(Number(group.reduce((a, b) => +a + +b.m_cTotal, 0)))}</Grid>
                                                                </Grid>
                                                            } />
                                                        </ListItem>
                                                        </AccordionSummary>
                                                            <div className={"row"} style={{height: (group.length + 1) * 50, width: '100%'}}>
                                                                <DataGrid columns={columns} rows={group}
                                                                          locateText={dataGridLocaleText}
                                                                          density={"compact"}
                                                                          pageSize={Math.floor((state.height - 310) / 30)}
                                                                          getRowId={(row => row.m_nIdCorte)}
                                                                />
                                                            </div>
                                                
                                                    </Accordion>
                                                ))
                                            }

                                        </List>
                                    </div>

                                </div>
                            </div>*/}
                        </div>

                        <div id="Agregar" className="tab-pane fade">
                            <CorteCajaAgregar
                                value={corteSeleccionado}
                                disaled={false}
                            />
                        </div>
                    </div>
                </div>
            </section>
        </div>
    )
}

export default CorteCaja;