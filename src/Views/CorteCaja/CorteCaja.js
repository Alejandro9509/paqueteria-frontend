import React, {Component, useEffect, useMemo, useState} from 'react'
import Cabecera from "../../Components/Template/Cabecera";
import BarraLateralIzquierda from "../../Components/Template/BarraLateralIzquierda";
import {DataGrid, GridToolbar } from "@material-ui/data-grid";
import {dataGridLocaleText} from "../../Constants";
import SvgIcon from "@material-ui/core/SvgIcon";
import {ReactComponent as Activo} from "../../iconos/Menu/palomita.svg";
import {ReactComponent as NoActivo} from "../../iconos/Menu/cruz.svg";
import $ from "jquery";
import CorteCajaAgregar from "./CorteCajaAgregar";
import {
    Collapse,
    FormControl,
    Grid,
    IconButton,
    InputLabel,
    ListItem,
    ListItemText,
    Select,
    Tooltip
} from "@material-ui/core";
import {confirmAlert} from "react-confirm-alert";
import axios from "axios";
import Noty from "noty";
import {eliminarCorte, obtenerCortes, obtenerCortesByFiltros} from "../../Util/Contexts/CorteCajaContext";
import TextField from "@material-ui/core/TextField";
import {obtenerSucursales} from "../../Util/Contexts/SucursalContext";
import {ExpandLess} from "@material-ui/icons";
import ExpandMore from "@material-ui/icons/ExpandMore";
import List from "@material-ui/core/List";
import {obtenerCiudades} from "../../Util/Contexts/CiudadesContext";
import DeleteIcon from "@material-ui/icons/Delete";
import RestartAltIcon from '@material-ui/icons/Refresh';

window.jQuery = window.$ = $;

const headers = {
    'Content-Type': 'application/json',
    //    'access-control-allow-origin': '*'
}
function showSuccess(mensaje) {
    new Noty({
        type: "information",
        layout: "topCenter",
        text: mensaje,
        timeout: "3000"
    }).show()
}
function CorteCaja(){
    const columns = useMemo(() => [
        {
            headerName: "Acciones",
            field: "",
            sortable: false, filterable: false,
            renderCell: (row) => {
                return (
                    <div>
                        <Tooltip title="Modificar">
                            <a href="#Agregar" role="tab" data-toggle="tab"
                               onClick={() => (handleShowModificar(row.row))}
                               className="btn btn-default btn-xs"><i className="fa fa-pencil-square-o"
                                                                     style={{ color: "#F9A03E" }} /></a>
                        </Tooltip>
                        <Tooltip title="Consultar">
                            <a href="#Agregar" role="tab" data-toggle="tab" className="btn btn-default btn-xs"
                               onClick={() => (handleShowConsultar(row.row))}><i className="fa fa-eye" style={{ color: "#F9A03E" }} /></a>
                        </Tooltip>
                        <Tooltip title="Eliminar">
                            <a href="#" className="btn btn-default btn-xs"
                               onClick={() => confirmAlert({
                                   title: 'Confirmar Eliminar',
                                   message: 'Está seguro de eliminar Convenio?',
                                   buttons: [
                                       {
                                           label: 'Si',
                                           onClick: () => handleEliminar(row.row)
                                       },
                                       {
                                           label: 'No',
                                       }
                                   ]
                               })}><i className="zmdi zmdi-delete"
                                      style={{ color: "#F30B0B" }} /></a>
                        </Tooltip>

                    </div>
                )
            }
        },
        {
            headerName: "ID Corte",
            field: 'm_nIdCorte',
            minWidth: 200,
            flex: 1
        },
        {
            headerName: "Destino",
            field: 'm_sDestino',
            minWidth: 200,
            flex: 1
        },
        {
            headerName: "Fecha Registro",
            field: 'm_sFechaRegistro',
            minWidth: 200,
            type: 'date',
            flex: 1
        },
        {
            headerName: "Estado",
            field: 'm_sEstatusCorte',
            minWidth: 200,
            flex: 1
        },
        {
            headerName: "Total",
            field: 'm_cTotal',
            minWidth: 200,
            valueFormatter: ({ value }) => currencyFormatter.format(Number(value)),
            flex: 1
        },

    ])
    const [listaCortes, setListaCortes] = useState([])
    const [corteSeleccionado, setCorteSeleccionado] = useState(0)
    const [pantallaActiva, setPantallaActiva ] = useState(1)
    const [consult, setConsult] = useState(false)
    const [state, setState] = useState({
        agregar: "Agregar",
        height: window. innerHeight,
    })
    const [dataCiudad, setDataCiudad] = useState([])
    const [filtros, setFiltros] = useState({
        fechaRegistro: 0,
        idCiudad: 0
    })
    const [openItemKey, setOpenItemKey] = useState(0);


    const listado = 1
    const agregar = 2
    const modificar = 3

    useEffect(value => {
        getAllCortes()
        getAllCiudades()
    }, [])

    const getAllCortes = () => {
        obtenerCortes().then(({data}) => {
            data.map((i) => i.destinoFecha = i.m_sDestino+i.m_sFechaRegistro)
            let group = groupBy(data, 'destinoFecha')
            console.log(group)
            // debugger
            let newArray = []
            Object.keys(group).forEach(function(k){
                console.log(k + ' - ' + group[k]);
                newArray.push(group[k])
            });
            setListaCortes(newArray)

        })
    }

    const groupBy = function(xs, key) {
        return xs.reduce(function(rv, x) {
            (rv[x[key]] = rv[x[key]] || []).push(x);
            return rv;
        }, {});
    };

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
        setCorteSeleccionado(0)
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

    const getAllCiudades = () => {
        obtenerCiudades().then((respuesta) => {
            setDataCiudad(respuesta.data);
        });
    }

    const handleChangeFiltros = (event) => {
        event.preventDefault()
        const {target} = event
        setFiltros(filtros => {
            return {
                ...filtros,
                [target.name]: target.value
            }
        })
        if (target.name === "fechaRegistro"){
            getCortesByFiltros(target.value, filtros.idCiudad)
        }else if (target.name === "idCiudad"){
            getCortesByFiltros(filtros.fechaRegistro, target.value)
        }
    }

    const resetFiltros = () => {
        setFiltros({
            fechaRegistro: 0,
            idCiudad: 0
        })
    }
    const getCortesByFiltros = (fecha, ciudad) =>{
        obtenerCortesByFiltros(fecha, ciudad).then(({data}) => {
            console.log(data)
            data.map((i) => i.destinoFecha = i.m_sDestino+i.m_sFechaRegistro)
            let group = groupBy(data, 'destinoFecha')
            console.log(group)
            // debugger
            let newArray = []
            Object.keys(group).forEach(function(k){
                newArray.push(group[k])
            });
            setListaCortes(newArray)
        })
    }

    const handleClick = (itemKey) => {
        setOpenItemKey(itemKey);
    };

    const currencyFormatter = new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
    });
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
                            <div className="widget-wrap">
                                <div className="widget-content">
                                    <div className="row">
                                        <div className="col-md-12">
                                            <Grid container spacing={2}>
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
                                                        <RestartAltIcon fontSize={"large"}/>
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
                                                    <div>
                                                        <ListItem button key={index} onClick={() => handleClick(index)} style={{backgroundColor:"lightgrey"}}>
                                                            <ListItemText primary={
                                                                <Grid container spacing={1}>
                                                                    <Grid item xs={2}>{group[0].m_sDestino}</Grid>
                                                                    <Grid item xs={2}>{group[0].m_sFechaRegistro}</Grid>
                                                                    <Grid item xs={6}/>
                                                                    <Grid item xs={2}>Total: {currencyFormatter.format(Number(group.reduce((a, b) => +a + +b.m_cTotal, 0)))}</Grid>
                                                                </Grid>
                                                            } />
                                                            {openItemKey === index ? <ExpandLess /> : <ExpandMore />}
                                                        </ListItem>
                                                        <Collapse in={openItemKey === index} timeout="auto" unmountOnExit>
                                                            <div className={"row"} style={{height: (group.length + 1) * 50, width: '100%'}}>
                                                                <DataGrid columns={columns} rows={group}
                                                                          locateText={dataGridLocaleText}
                                                                          density={"compact"}
                                                                          pageSize={Math.floor((state.height - 310) / 30)}
                                                                          getRowId={(row => row.m_nIdCorte)}
                                                                />
                                                            </div>
                                                        </Collapse>
                                                    </div>
                                                ))
                                            }

                                        </List>
                                    </div>

                                </div>
                            </div>
                        </div>

                        <div id="Agregar" className="tab-pane fade">
                            {
                                (pantallaActiva === agregar || pantallaActiva === modificar) &&
                                <CorteCajaAgregar
                                    select={corteSeleccionado}
                                    consult={consult}
                                    pantallaActiva={pantallaActiva}
                                />
                            }
                        </div>
                    </div>
                </div>
            </section>
        </div>
    )
}

export default CorteCaja;