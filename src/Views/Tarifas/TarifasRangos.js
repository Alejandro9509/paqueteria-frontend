import React, {useEffect, useState} from 'react';
import $ from "jquery";
import {DataGrid} from "@mui/x-data-grid";
import {dataGridLocaleText} from "../../Constants";
import Tooltip from '@mui/material/Tooltip';
import SvgIcon from "@mui/material/SvgIcon";
import {ReactComponent as Activo} from "../../iconos/Menu/palomita.svg";
import {ReactComponent as NoActivo} from "../../iconos/Menu/cruz.svg";
import {validarPermisos} from "../../Util/Contexts/UsuarioContext";
import Filtros from "../Filtros/FiltrosConvenios"
import CrearTarifaRangos from "./CrearTarifaRangos";
import {validarDerecho} from "../../Util/Util"
import styled from "@mui/styles/styled";
import {
    agregarTarifaRangos,
    eliminarTarifaRangos,
    modificarTarifaRangos,
    obtenerTarifaRangosById,
    obtenerTarifasRangos
} from "../../Util/Contexts/TarifasContext";
import Noty from "noty";
import {getRandomId} from "../../Util/Util";
import {obtenerClientePublicoGeneral} from "../../Util/Contexts/ClientesContext";
import { confirmAlert } from 'react-confirm-alert';
const PREFIX = 'TarifasRangos';

const classes = {
    seleccionado: `${PREFIX}-seleccionado`,
    noSeleccionado: `${PREFIX}-noSeleccionado`,
    disabled: `${PREFIX}-disabled`
};

const Root = styled('section')({
    [`& .${classes.seleccionado}`]: {
        backgroundColor: "#FCC88F",
    },
    [`& .${classes.noSeleccionado}`]: {
        backgroundColor: "#FFFFFF",
    },
    [`& .${classes.disabled}`]: {
        pointerEvents: "none",
        cursor: "default",
    },
});

window.jQuery = window.$ = $;

function showSuccess(mensaje) {
    new Noty({
        type: "information",
        layout: "topCenter",
        text: mensaje,
        timeout: "3000"
    }).show()
}


export default function TarifasRangos(props) {

    const [state, setState] = useState({
        tarifas: [],
        agregar: "Agregar",
        height: window.innerHeight,
        CreadoPor: localStorage.getItem("UsuarioId"),
        ModificadoPor: localStorage.getItem("UsuarioId"),
        pantalla: 1,
        selected: null,
        DerechoBorrar: 1, //TODO: Definir id
        dataSucursal: [],
        columns: [],
        consult: false,
        clienteGenerico: null
    })

    useEffect(() => {
        handleDefinirColumnas()
        getAllTarifas()
    }, [])

    const handleDefinirColumnas = () => {
        let columns = []
        columns.push(
            {
                headerName: "Acciones",
                sortable: false, filterable: false,
                field: "",
                minWidth: 100,
                renderCell: (row) => {
                    return (
                        <div>
                            <Tooltip title="Modificar" disabled={(!validarDerecho(9101347) && !props.convenio) || (!validarDerecho(9101395) && props.convenio)}>
                                <a href="#Agregar" role="tab" data-toggle="tab" onClick={() => (handleShowModificar(row.row.IdTarifa))} className="btn btn-default btn-xs"><i className="fa fa-pencil-square-o" style={{ color: "#F9A03E" }} /></a>

                            </Tooltip>
                            <Tooltip title="Consultar">
                                <a href="#Agregar" role="tab" data-toggle="tab" className="btn btn-default btn-xs" onClick={() => (handleShowConsultar(row.row.IdTarifa))}><i className="fa fa-eye" style={{ color: "#F9A03E" }} /></a>

                            </Tooltip>
                            <Tooltip title="Eliminar" disabled={(!validarDerecho(9101348) && !props.convenio) || (!validarDerecho(9101396) && props.convenio)}>
                                <a href="#" className="btn btn-default btn-xs" onClick={() =>  confirmAlert({
                                                        title: 'Confirmar Eliminar',
                                                        message: '¿Está seguro de eliminar Convenio?',
                                                        buttons: [
                                                            {
                                                                label: 'Si',
                                                                onClick: () =>  (handleEliminar(row.row.IdTarifa))
                                                            },
                                                            {
                                                                label: 'No',
                                                            }
                                                        ]
                                                    }) }><i className="zmdi zmdi-delete" style={{ color: "#F30B0B" }} /></a>
                            </Tooltip>

                        </div>
                    )
                }
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
                field: "Activo",
                width: 100,
                renderCell: (row) => {
                    return (
                        <div
                            style={{
                                width: "100%",
                                textAlign: "center",
                                color: row.row.Activo === 'true' ? "green" : "red",
                            }}
                        >
                            {row.row.Activo ? (
                                <SvgIcon component={Activo} />
                            ) : (
                                <SvgIcon component={NoActivo} />
                            )}
                        </div>
                    );
                },
            },
        )
        setState(state => {return {...state, columns: columns}})
    }

    const handleShowListado = (event) => {
        if (event){
            event.stopPropagation();
        }
        getAllTarifas()
        setState(state =>{
            return {...state,pantalla: 1, edit: false, consult: false, agregar: "Agregar",selected: null}
        });
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
        obtenerTarifaRangosById(idTarifa).then(respuesta => {
            setDataParaConsultar(respuesta.data)
            setState(state => {
                return {
                    ...state,
                    pantalla: 2,
                    agregar: "Consultar",
                    consult: true,
                    selected: setDataParaConsultar(respuesta.data)
                }
            });
        })

        $('.nav-tabs li ').removeClass('active');
        $('.nav-tabs li').eq(1).addClass('active');
        $('.tab-content div ').removeClass('in show');
        $('#Agregar').addClass('in show');
    }

    const handleShowModificar = (idTarifa) => {
        obtenerTarifaRangosById(idTarifa).then(respuesta => {
            setState(state =>{
                return {
                    ...state,
                    pantalla: 2,
                    agregar: "Modificar",
                    consult: false,
                    selected: setDataParaConsultar(respuesta.data)
                }
            });
        })

        $('.nav-tabs li ').removeClass('active');
        $('.nav-tabs li').eq(1).addClass('active');
        $('.tab-content div ').removeClass('in show');
        $('#Agregar').addClass('in show');
    }

    const setDataParaConsultar = (data) => {
        let viajesLocales = data.ViajesLocales.map(viaje => ({
            idViaje: viaje.IdViajeLocal,
            idSucursal: viaje.IdSucursal,
            idTipoMedida: viaje.IdTipoMedida,
            zonas: data.Zonas.filter(i => i.IdViajeLocal === viaje.IdViajeLocal).map(j => ({
                m_nIdZona: j.IdZonaOperativa,
                m_sCodigoZona: j.CodigoZona,
                m_bAplicaEntrega: j?.AplicaEntrega
            })),
            idConcepto: viaje.IdConcepto,
            rangos: data.Conceptos.filter(i => i.IdViajeLocal === viaje.IdViajeLocal).map(rango => ({
                id: rango?.IdTarifaConcepto || Math.floor(Math.random() * 10000),
                idConcepto: rango.IdConceptoFacturacion || null,
                concepto: rango.ConceptoFacturacion || '',
                importe: rango.Importe || 0,
                minimo: rango.Minimo || 0,
                maximo: rango.Maximo || 0,
                idTipoCalculo: rango.IdTipoCalculo || null,
                idUnidadMedida: rango.IdUnidadMedida || null,
                tipoCalculo: rango.TipoCalculo || '',
                unidadMedida: rango.UnidadMedida || '',
            })),
            productos: data.Productos.filter(i => i.IdViajeLocal === viaje.IdViajeLocal).map(j => ({
                m_nIdProducto: j.IdProducto,
                m_sDescripcion: j.Descripcion,
                m_nNoProducto: j.NoProducto,
                m_bActivo: j.Activo
            })),
        }))
        let maniobras = data.Conceptos.filter(i => i.IdTarifa === data.IdTarifa).map(rango => ({
                id: rango?.IdTarifaConcepto || Math.floor(Math.random() * 10000),
                idConcepto: rango.IdConceptoFacturacion || null,
                concepto: rango.ConceptoFacturacion || '',
                importe: rango.Importe || 0,
                minimo: rango.Minimo || 0,
                maximo: rango.Maximo || 0,
                idTipoCalculo: rango.IdTipoCalculo || null,
                idUnidadMedida: rango.IdUnidadMedida || null,
                tipoCalculo: rango.TipoCalculo || '',
                unidadMedida: rango.UnidadMedida || '',
                productos: getProductos(rango.Productos)
            }))

        let viajesForaneos = data.ViajesForaneos.map(viaje => ({
            idViaje: viaje.IdViajeForaneo || getRandomId(),
            idOrigen: viaje.IdOrigen || null,
            idTipoMedida: viaje.IdTipoMedida || null,
            idDestino: viaje.IdDestino || null,
            fleteMinimo: viaje.fleteMinimo || 0,
            grupos: data.Grupos.filter(i => i.IdViajeForaneo === viaje.IdViajeForaneo).map(grupo => ({
                idGrupo: grupo.IdViajeForaneoGrupo || Math.floor(Math.random() * 10000),
                nombre: grupo.Referencia || '',
                zonas: data.Zonas.filter(i => i.IdViajeForaneoGrupo === grupo.IdViajeForaneoGrupo).map(j => ({
                    m_nIdZona: j.IdZonaOperativa,
                    m_sCodigoZona: j.CodigoZona,
                    m_bAplicaEntrega: j?.AplicaEntrega
                })),
                rangos: data.Conceptos.filter(i => i.IdViajeForaneoGrupo === grupo.IdViajeForaneoGrupo).map(rango => ({
                    id: rango?.IdTarifaConcepto || Math.floor(Math.random() * 10000),
                    idConcepto: rango.IdConceptoFacturacion || null,
                    concepto: rango.ConceptoFacturacion || '',
                    importe: rango.Importe || 0,
                    minimo: rango.Minimo || 0,
                    maximo: rango.Maximo || 0,
                    idTipoCalculo: rango.IdTipoCalculo || null,
                    idUnidadMedida: rango.IdUnidadMedida || null,
                    tipoCalculo: rango.TipoCalculo || '',
                    unidadMedida: rango.UnidadMedida || '',
                    porcentaje: rango.Porcentaje || 0,
                })),
                productos: data.Productos.filter(i => i.IdViajeForaneoGrupo === grupo.IdViajeForaneoGrupo).map(j => ({
                    m_nIdProducto: j.IdProducto,
                    m_sDescripcion: j.Descripcion,
                    m_nNoProducto: j.NoProducto,
                    m_bActivo: j.Activo
                })),
            })),
        }))
        let tarifa = {
            idTarifa: data.IdTarifa,
            cliente: {
                m_nIdCliente: data.IdCliente,
                m_sNombreFiscal: data.Cliente
            },
            vigencia: data.Vigencia,
            cuotaMensual: data.CuotaMensual,
            viajesLocales: viajesLocales,
            maniobras: maniobras,
            viajesForaneos: viajesForaneos
        }

        return tarifa

    }

    const handleEliminar = (idTarifa) => {

        var derecho;
        validarPermisos(state).then(respuesta => {
            derecho = respuesta.data;
            if (derecho === false) {
                showSuccess("El usuario no tiene derechos para realizar el proceso");
                return;
            }

            eliminarTarifaRangos(idTarifa).then(respuesta => {
                if (respuesta.data.Estatus){
                    showSuccess("Registro eliminado con éxito.")
                    getAllTarifas();
                }
            })
        }).catch(err => {
            showSuccess(err)
        });
    }

    const getAllTarifas = () => {
        if (state.clienteGenerico === null){
            obtenerClientePublicoGeneral().then(respuestaCliente => {
                obtenerTarifasRangos().then(respuesta => {
                    setState(state => {
                        return{
                            ...state,
                            tarifas: respuesta.data,
                            clienteGenerico: respuestaCliente.data
                        }
                    })
                })
            })
        }else{
            obtenerTarifasRangos().then(respuesta => {
                setState(state => {
                    return{
                        ...state,
                        tarifas: respuesta.data
                    }
                })
            })
        }
    }

    const handleAgregarTarifa = (params) => {
        agregarTarifaRangos(params).then(respuesta => {
            if (respuesta.data.Estatus){
                if (props.convenio){
                    showSuccess("Se guardó el convenio con éxito");
                }else{
                    showSuccess("Se guardó la tarifa con éxito");
                }
                handleShowListado()
            }else{
                if(respuesta.data.error!=="")
                    showSuccess(respuesta.data.error)
                else
                    showSuccess("Hubo un error al guardar");
            }
        })
    }
    const handleModificarTarifa = (params) => {
        modificarTarifaRangos(params.idTarifa,params).then(respuesta => {
            if (respuesta.data.Estatus){
                if (props.convenio){
                    showSuccess("Se guardó el convenio con éxito");
                }else{
                    showSuccess("Se guardó la tarifa con éxito");
                }
                handleShowListado()
            }else{
                if(respuesta.data.error!=="")
                    showSuccess(respuesta.data.error)
                else
                    showSuccess("Hubo un error al guardar");
            }
        })
    }
    const actualizarTarifas = (nuevasTarifas) => {
        setState(prevState => ({
            ...prevState,
            tarifas: nuevasTarifas
        }));
    }

    const getProductos = (productos) => {
        productos = productos.map((i) => ({
            idTarifa: i.IdTarifa,
            idConceptoFacturacion: i.IdConceptoFacturacion,
            idProducto: i.IdProducto,
            m_nIdProducto: i.IdProducto,
            numeroDescripcion: i.numeroDescripcion,
            m_sDescripcion: i.m_sDescripcion
        }))
        return (productos || []);
    }

    const filtrarTarifas =
        props.convenio ?
            state.tarifas.filter(i => i.IdCliente !== state.clienteGenerico.m_nIdCliente)
            : state.tarifas.filter(i => i.IdCliente === state.clienteGenerico.m_nIdCliente)

    return (
        <Root className="main-container">
            <div className="container-fluid">
                <ul className="nav navStatica nav-tabs">
                    <li className="active">
                        <a onClick={(event) => handleShowListado(event)}>
                            <i className="fa fa-list"/> Listado
                        </a>
                    </li>
                    <li >
                        <a className= {(validarDerecho(9101347) && !props.convenio) || (validarDerecho(9101395) && props.convenio)? "":"hide"} onClick={(event) => handleShowAgregar()}>
                            <i className="fa fa-plus-circle"/> {state.agregar}
                        </a>
                    </li>
                </ul>

                <div className="row tab-content">
                    <div id="Listado" className="tab-pane fade in show">
                        <div className="widget-wrap">
                            <div className="widget-content">
                            <div className="row" style={{  width: '100%' }}>
                                   <Filtros actualizarTarifas={actualizarTarifas}/>
                                </div>
                                <div className="row" style={{ height: state.height - 250, width: '100%' }}>
                                    <DataGrid
                                        localeText={dataGridLocaleText}
                                        rows={filtrarTarifas}
                                        columns={state.columns}
                                        density="compact"
                                        pageSize={Math.floor((state.height - 310) / 30)}
                                        getRowId={(row) => row.IdTarifa}
                                        onRowSelectionModelChange={(newModel)=>{
                                            if(newModel.length<1)
                                                return
                                            setState({
                                                ...state,
                                                idTarifa: filtrarTarifas.find(i=>i.IdTarifa==newModel[0]).IdTarifa
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
                                        selection={state.selected}
                                        disabled={state.consult}
                                        agregarTarifa={handleAgregarTarifa}
                                        modificarTarifa={handleModificarTarifa}
                                        convenio={props.convenio}
                                        tarifasListado={props.convenio ? state.tarifas : filtrarTarifas}
                                    />
                        }
                    </div>
                </div>
            </div>
        </Root>
    );
}