import React, {useEffect, useState} from "react";
import {
    agregarTarifa,
    eliminarTarifa,
    modificarTarifa,
    obtenerTarifaBy,
    obtenerTarifasByTipo
} from "../../Util/Contexts/TarifasContext";
import {validarPermisos} from "../../Util/Contexts/UsuarioContext";
import {Tooltip} from "@mui/material";
import {DataGrid} from "@mui/x-data-grid";
import {dataGridLocaleText} from "../../Constants";
import CrearTarifaRegion from "./CrearTarifaRegion";
import $ from "jquery";
import Noty from "noty";
import {obtenerClientePublicoGeneral} from "../../Util/Contexts/ClientesContext";
import {getRandomId} from "../../Util/Util";
import { confirmAlert } from "react-confirm-alert";
window.jQuery = window.$ = $;

function showSuccess(mensaje) {
    new Noty({
        type: "information",
        layout: "topCenter",
        text: mensaje,
        timeout: "6000"
    }).show()
}

function TarifasRegion(props){
    const [state, setState] = useState({
        data: [],
        agregar: "Agregar",
        height: window.innerHeight,
        CreadoPor: localStorage.getItem("UsuarioId"),
        ModificadoPor: localStorage.getItem("UsuarioId"),
        pantalla: 1,
        selected: {},
        DerechoBorrar: 1, //TODO: Definir id
        dataSucursal: [],
        columns: [],
        mostrarColumnasPesoVolumen: false,
        configuraciones: null,
        clienteGenerico: null,
    })

    useEffect(value => {
        definirColumnas()
        getTarifas(3)
    }, [])

    const handleShowAgregar = (event) => {
        event.stopPropagation();
        setState(state => {
            return {
                ...state,
                pantalla: 2,
                consult: false,
                agregar: "Agregar",
                selected: null,
            }
        });
        $('.nav-tabs li ').removeClass('active');
        $('.nav-tabs li').eq(1).addClass('active');
        $('.tab-content div ').removeClass('in show');
        $('#Agregar').addClass('in show');
    }

    const formatearRespuesta = (respuesta) => {
        let tarifa = {
            m_nIdTarifa: respuesta.data.m_nIdTarifa
        }
        tarifa.cliente = {
            m_nIdCliente : respuesta.data.m_nIdCliente,
            m_sNombreFiscal : respuesta.data.m_sCliente,
        }
        tarifa.viajes = respuesta.data.m_arrArViajes.map(v => ({
            idViaje: getRandomId(),
            idOrigen: v.IdOrigen,
            fleteMinimo: v.FleteMinimo,
            destinos: respuesta.data.m_arrArDestinos.filter(d => d.IdTarifaViaje === v.IdTarifaViaje),
            productos: respuesta.data.m_arrArProductos.filter(p => p.IdTarifaViaje === v.IdTarifaViaje),
        }))
        return tarifa
    }

    const handleShowModificar = (id) => {
        obtenerTarifaBy(id).then(respuesta => {
            setState(state => {
                return {
                    ...state,
                    pantalla: 2,
                    openDialog: true,
                    agregar: "Modificar",
                    consult: true,
                    selected: formatearRespuesta(respuesta),
                }
            })
            // mostrarDataTarifa(respuesta)
            $('.nav-tabs li ').removeClass('active');
            $('.nav-tabs li').eq(1).addClass('active');
            $('.tab-content div ').removeClass('in show');
            $('#Agregar').addClass('in show');
        });
    }

    const handleShowConsultar = (id) => {
        obtenerTarifaBy(id).then(respuesta => {
            setState(state => {
                return {
                    ...state,
                    pantalla: 2,
                    agregar: "Consultar",
                    openDialog: true,
                    consult: true,
                    selected: formatearRespuesta(respuesta),
                }
            })
            // mostrarDataTarifa(respuesta)
            $('.nav-tabs li ').removeClass('active');
            $('.nav-tabs li').eq(1).addClass('active');
            $('.tab-content div ').removeClass('in show');
            $('#Agregar').addClass('in show');
        });
    }

    const handleEliminar = (id) => {
        let derecho;
        validarPermisos(state).then(respuesta => {
            derecho = respuesta.data;
            if (derecho === false) {
                showSuccess("El usuario no tiene derechos para realizar el proceso");
                return;
            }
            eliminarTarifa(id,state.ModificadoPor).then(respuesta => {
                showSuccess("Registro eliminado")
                getTarifas(props.configuraciones.TipoTarifaTarifas);
            }).catch(err => {
                showSuccess(err)
            });
        }).catch(err => {
            showSuccess(err)
        });
    }

    const isTarifaValida = (tarifa) => {
        let valid = true
        if (!tarifa.viajes.length > 0){
            showSuccess("Debe haber al menos un viaje.")
            return false
        }
        if (tarifa.viajes.some(i => !(parseInt(i.idOrigen) > 0))){
            showSuccess("Todos los viajes deben tener un origen.")
            return false
        }
        if (tarifa.viajes.some(i => i.dataDestinosSeleccionados.length === 0)){
            showSuccess("Todos los viajes deben tener al menos un destino.")
            return false
        }
        if (tarifa.viajes.some(i => i.dataProductosSeleccionados.length === 0)){
            showSuccess("Todos los viajes deben tener al menos un producto.")
            return false
        }
        return valid
    }

    const handleAceptar = (data) => {
        if (!isTarifaValida(data)){
            return
        }
        let params = {
            creadoPor: localStorage.getItem("UsuarioId"),
            tipo: props.configuraciones?.TipoTarifaTarifas,
            idCliente: data.cliente?.m_nIdCliente || 0,
            viajes: data.viajes.map(v => ({
                idOrigen: v.idOrigen,
                fleteMinimo: v.fleteMinimo,
                destinos: v.dataDestinosSeleccionados,
                productos: v.dataProductosSeleccionados
            })) || []
        }
        if (state.selected?.m_nIdTarifa > 0) {
            modificarTarifa(state.selected.m_nIdTarifa, params).then(respuesta => {
                if (respuesta.data.Estatus){
                    showSuccess("Modificado con éxito")
                    handleShowListado()
                }else {
                    showSuccess("Hubo un error al agregar")
                }
            }).catch(err => {
                console.log(err)
                showSuccess("Hubo un error al modificar")
            });
        } else {
            agregarTarifa(params).then(respuesta => {
                if (respuesta.data.Estatus){
                    showSuccess("Agregado con éxito")
                    handleShowListado()
                }else {
                    showSuccess("Hubo un error al agregar")
                }
            }).catch(err => {
                console.log(err)
                showSuccess("Hubo un error al agregar")
            });
        }

    }

    const handleShowListado = (event) => {
        if (event !== undefined){
            event.stopPropagation();
        }
        setState(state => {
            return {
                ...state,
                pantalla: 1,
                consult: false,
                openDialog:false,
                agregar: "Agregar"
            }
        });
        $('.nav-tabs li ').removeClass('active');
        $('.nav-tabs li').eq(0).addClass('active');
        $('.tab-content div ').removeClass('in show');
        $('#Listado').addClass('in show');
        definirColumnas()
        getTarifas(3);
    }

    const getTarifas = (idTipoTarifa) => {
        if (state.clienteGenerico === null){
            obtenerClientePublicoGeneral().then(respuestaCliente => {
                obtenerTarifasByTipo(idTipoTarifa).then(respuesta => {
                    setState(state =>{
                        return {
                            ...state,
                            data: respuesta.data,
                            agregar: "Agregar",
                            clienteGenerico: respuestaCliente.data
                        }
                    })
                })
            })
        }else{
            obtenerTarifasByTipo(idTipoTarifa).then(respuesta => {
                setState(state =>{
                    return {
                        ...state,
                        data: respuesta.data,
                    }
                })
            })
        }
    }

    /**Se definen las columnas que se van a mostrar en el listado de tarifas*/
    const definirColumnas = () => {

        let columns = []
        if (state.mostrarColumnasPesoVolumen){
            columns.push(
                {
                    headerName: "Precio m³",
                    field: "m_cPrecioM3",
                    flex: 1,
                    valueFormatter: (params) => `$${parseFloat(params.value).toFixed(2)}`,
                    minWidth: 200,
                },
                {
                    headerName: "Precio Kilo",
                    field: "m_cPrecioKilo",
                    flex: 1,
                    valueFormatter: (params) => `$${parseFloat(params.value).toFixed(2)}`,
                    minWidth: 125,
                },
                {
                    headerName: "Flete mínimo",
                    field: "m_cFleteMinimo",
                    flex: 1,
                    valueFormatter: (params) => `$${parseFloat(params.value).toFixed(2)}`,
                    minWidth: 125,
                },
                {
                    headerName: "Monto mínimo",
                    field: "m_cMontoMinimo",
                    flex: 1,
                    valueFormatter: (params) => `$${parseFloat(params.value).toFixed(2)}`,
                    minWidth: 125,
                },
            )
        }
        columns.push(
            {
                headerName: "Acciones",
                sortable: false, filterable: false,
                field: "",
                minWidth: 250,
                renderCell: (row) => {
                    return (
                        <div>
                            <Tooltip title="Modificar" >
                                <a href="#Agregar" role="tab" data-toggle="tab" onClick={() => (handleShowModificar(row.row.m_nIdTarifa))} className="btn btn-default btn-xs"><i className="fa fa-pencil-square-o" style={{ color: "#F9A03E" }} /></a>

                            </Tooltip>
                            <Tooltip title="Consultar">
                                <a href="#Agregar" role="tab" data-toggle="tab" className="btn btn-default btn-xs" onClick={() => (handleShowConsultar(row.row.m_nIdTarifa))}><i className="fa fa-eye" style={{ color: "#F9A03E" }} /></a>

                            </Tooltip>
                            <Tooltip title="Eliminar">
                                <a href="#" className="btn btn-default btn-xs" onClick={() => confirmAlert({
                                    title: 'Confirmar Eliminar',
                                    message: '¿Está seguro de eliminar tarifa?',
                                    buttons: [
                                        {
                                            label: 'Si',
                                            onClick: () =>  handleEliminar(row.row.m_nIdTarifa)
                                        },
                                        {
                                            label: 'No',
                                        }
                                    ]
                                })}>
                                    <i className="zmdi zmdi-delete" style={{ color: "#F30B0B" }} />
                                </a>
                            </Tooltip>

                        </div>
                    )
                }
            },{
                headerName: "Cliente",
                field: "Cliente",
                width: 500,
            },
        )

        setState(state => {
            return{
                ...state,
                columns: columns
            }
        })
    }

    const filtrarTarifas =
        props.convenio ?
            state.data.filter(i => i.m_nIdCliente !== state.clienteGenerico.m_nIdCliente)
            : state.data.filter(i => i.m_nIdCliente === state.clienteGenerico.m_nIdCliente)

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
                        <a onClick={handleShowAgregar}>
                            <i className="fa fa-plus-circle"/> {state.agregar}
                        </a>
                    </li>

                    <li>
                        <a data_id="3">
                            <i className="fa fa-times-circle"/> Imprimir
                        </a>
                    </li>
                    {/**<button className="topbar-right pull-right">Boton</button>*/}
                </ul>

                <div className="row" className="tab-content" style={{ paddingLeft: "-15px" }}>
                    <div id="Listado" className="tab-pane fade in show">
                        <div className="widget-wrap">
                            <div className="widget-content">
                                <div className="row" style={{ height: state.height - 250, width: '100%' }}>
                                    <DataGrid
                                        localeText={dataGridLocaleText}
                                        rows={filtrarTarifas}
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
                            <CrearTarifaRegion edit={state.edit} consult={state.consult} select={state.selected}
                                               onSubmit={handleAceptar}
                                               listaCiudades={state.dataCiudades}
                                               disabled={state.agregar === "Consultar"}
                                               convenio={props.convenio}
                            />
                        }

                    </div>
                </div>
            </div>
        </section>
    )
}

export default TarifasRegion;