import React, {Component, useEffect, useState} from 'react';
import $ from "jquery";
import {DataGrid} from "@material-ui/data-grid";
import {dataGridLocaleText} from "../../Constants";
import {Tooltip} from "@material-ui/core";
import SvgIcon from "@material-ui/core/SvgIcon";
import {ReactComponent as Activo} from "../../iconos/Menu/palomita.svg";
import {ReactComponent as NoActivo} from "../../iconos/Menu/cruz.svg";
import {validarPermisos} from "../../Util/Contexts/UsuarioContext";
import axios from "axios";
import CrearTarifaRangos from "./CrearTarifaRangos";
window.jQuery = window.$ = $;

export default function TarifasRangos(props) {
    const [state, setState] = useState({
        tarifas: [],
        agregar: "Agregar",
        height: window.innerHeight,
        CreadoPor: localStorage.getItem("UsuarioId"),
        ModificadoPor: localStorage.getItem("UsuarioId"),
        pantalla: 1,
        selected: {},
        DerechoBorrar: 1, //TODO: Definir id
        dataSucursal: [],
        columns: []
    })

    useEffect(() => {
        handleDefinirTarifas()
        getAllTarifas()
    }, [])

    const handleDefinirTarifas = () => {
        let columns = []
        columns.push(
            {
                headerName: "Acciones",
                sortable: false, filterable: false,
                field: "",
                minWidth: 250,
                renderCell: (row) => {
                    return (
                        <div>
                            <Tooltip title="Modificar">
                                <a href="#Agregar" role="tab" data-toggle="tab" onClick={() => (handleShowModificar(row.row.m_nIdTarifa))} className="btn btn-default btn-xs"><i className="fa fa-pencil-square-o" style={{ color: "#F9A03E" }} /></a>

                            </Tooltip>
                            <Tooltip title="Consultar">
                                <a href="#Agregar" role="tab" data-toggle="tab" className="btn btn-default btn-xs" onClick={() => (handleShowConsultar(row.row.m_nIdTarifa))}><i className="fa fa-eye" style={{ color: "#F9A03E" }} /></a>

                            </Tooltip>
                            <Tooltip title="Eliminar">
                                <a href="#" className="btn btn-default btn-xs" onClick={() => (handleEliminar(row.row.m_nIdTarifa))}><i className="zmdi zmdi-delete" style={{ color: "#F30B0B" }} /></a>
                            </Tooltip>

                        </div>
                    )
                }
            },
            {
                headerName: "Código",
                field: "m_sCodigo",
                width: 300,
            },
            {
                headerName: "Cliente",
                field: "Cliente",
                width: 500,
            },
            {
                headerName: "Vigencia",
                field: "Vigencia",
                width: 200,
            },
            {
                headerName: "Activo",
                field: "m_bActivo",
                width: 100,
                renderCell: (row) => {
                    return (
                        <div
                            style={{
                                width: "100%",
                                textAlign: "center",
                                color: row.row.m_bActivo == 'true' ? "green" : "red",
                            }}
                        >
                            {row.row.m_bActivo ? (
                                <SvgIcon component={Activo} />
                            ) : (
                                <SvgIcon component={NoActivo} />
                            )}
                        </div>
                    );
                },
            },
        )
        setState(state => {
            return {
                ...state,
                columns: columns
            }
        })
    }

    const handleShowListado = (event) => {
        if (event){
            event.stopPropagation();
        }
        setState({...state,pantalla: 1, edit: false, consult: false, agregar: "Agregar"});
        $('.nav-tabs li ').removeClass('active');
        $('.nav-tabs li').eq(0).addClass('active');
        $('.tab-content div ').removeClass('in show');
        $('#Listado').addClass('in show');
    }

    const handleShowAgregar = (event) => {
        if (event){
            event.stopPropagation();
        }
        setState({...state,pantalla: 2, edit: false, consult: false, agregar: "Agregar"});
        $('.nav-tabs li ').removeClass('active');
        $('.nav-tabs li').eq(1).addClass('active');
        $('.tab-content div ').removeClass('in show');
        $('#Agregar').addClass('in show');
    }

    const handleShowConsultar = (idTarifa) => {
        setState({
            ...state,
            pantalla: 2,
            agregar: "Consultar",
            openDialog: true,
            edit: true,
            consult: true,
            selected: {}
        });
        $('.nav-tabs li ').removeClass('active');
        $('.nav-tabs li').eq(1).addClass('active');
        $('.tab-content div ').removeClass('in show');
        $('#Agregar').addClass('in show');
    }

    const handleShowModificar = (idTarifa) => {
        setState({
            ...state,
            pantalla: 2,
            openDialog: true,
            agregar: "Modificar",
            edit: true,
            consult: false,
            selected: {}
        });
        $('.nav-tabs li ').removeClass('active');
        $('.nav-tabs li').eq(1).addClass('active');
        $('.tab-content div ').removeClass('in show');
        $('#Agregar').addClass('in show');
    }

    const handleEliminar = (idTarifa) => {
        var derecho;
        /*validarPermisos(this.state).then(respuesta => {
            derecho = respuesta.data;
            if (derecho == false) {
                showSuccess("El usuario no tiene derechos para realizar el proceso");
                return;
            }

            const url = `${process.env.REACT_APP_API_URL}/Tarifas/Eliminar/` + id + `/${this.state.ModificadoPor}`;
            axios.delete(url, { headers }).then(respuesta => {
                console.log(respuesta);
                this.getAllData();
            }).catch(err => {
                showSuccess(err)
            });
        }).catch(err => {
            showSuccess(err)
        });*/
    }

    const getAllTarifas = () => {
        setState(state => {
            return {
                ...state,
                tarifas: [{
                    m_nIdTarifa: 1,
                    IdCliente: 1,
                    Cliente: 'PUBLICO GENERAL',
                    Vigencia: '2023-02-21',
                    m_bActivo: true
                },
                {
                    m_nIdTarifa: 2,
                    IdCliente: 2,
                    Cliente: 'PUBLICO GENERAL',
                    Vigencia: '2022-02-20',
                    m_bActivo: false
                }]
            }
        })
    }

    return(
        <section className="main-container">
            <div className="container-fluid">
                <ul className="nav navStatica nav-tabs">
                    <li className="active">
                        <a onClick={(event) => handleShowListado(event)}>
                            <i className="fa fa-list"/> Listado
                        </a>
                    </li>
                    <li >
                        <a onClick={(event) => handleShowAgregar()}>
                            <i className="fa fa-plus-circle"/> {state.agregar}
                        </a>
                    </li>
                </ul>

                <div className="row tab-content">
                    <div id="Listado" className="tab-pane fade in show">
                        <div className="widget-wrap">
                            <div className="widget-content">
                                <div className="row" style={{ height: state.height - 250, width: '100%' }}>
                                    <DataGrid
                                        localeText={dataGridLocaleText}
                                        rows={state.tarifas}
                                        columns={state.columns}
                                        density="compact"
                                        pageSize={Math.floor((state.height - 310) / 30)}
                                        getRowId={(row) => row.m_nIdTarifa}
                                        onRowSelected={(row) => {
                                            setState({
                                                ...state,
                                                idTarifa: row.data.m_nIdTarifa
                                            })
                                        }}
                                    />
                                </div>
                            </div>
                        </div>
                    </div>

                    <div id="Agregar" className="tab-pane fade">
                        {
                                state.pantalla === 2 &&
                                    <CrearTarifaRangos
                                        configuraciones={props.configuraciones}
                                    />
                                /*<CrearTarifa edit={state.edit} consult={state.consult} select={state.selected}
                                             onSubmit={handleAceptar} onCancel={(event) => {
                                    event.stopPropagation();
                                    setState({
                                        ...state, pantalla: 1, edit: false, consult: false, agregar: "Agregar"
                                    });
                                    $('.nav-tabs li ').removeClass('active');
                                    $('.nav-tabs li').eq(0).addClass('active');
                                    $('.tab-content div ').removeClass('in show');
                                    $('#Listado').addClass('in show');
                                }}
                                             listaCiudades={state.dataCiudades}
                                />*/
                        }

                    </div>

                </div>
            </div>
        </section>
    )
}