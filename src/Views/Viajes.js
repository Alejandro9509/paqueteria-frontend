import React, {useEffect, useState, useMemo} from "react";
import DataTable from 'react-data-table-component';
import DataTableExtensions from "react-data-table-component-extensions";
import axios from "axios";
import Cabecera from "../Components/Template/Cabecera";
import BarraLateralIzquierda from "../Components/Template/BarraLateralIzquierda";
import BarraLateralDerecha from "../Components/Template/BarraLateralDerecha";
import BasicTable from "./BasicTable";
import ExportCSV from '../Components/Template/Export';
import ExportPDF from "../Components/Template/ExportPDF";
import * as XLSX from 'xlsx';
import {useTable, useFilters, useSortBy} from 'react-table'
import {makeStyles} from "@material-ui/core/styles";
import {DataGrid} from '@material-ui/data-grid';
import Noty from 'noty';
import AgregarViaje from "./Viajes/AgregarViaje";
import FormControl from "@material-ui/core/FormControl";
import InputLabel from "@material-ui/core/InputLabel";
import Select from "@material-ui/core/Select";
import TextField from "@material-ui/core/TextField";
import {dataGridLocaleText} from "../Constants";
import $ from "jquery";
import {
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    Tooltip,
    ButtonBase,
    List,
    ListItem,
    Collapse,
    ListItemText, Link
} from "@material-ui/core";
import {obtenerEstatusDocumentos} from "../Util/Contexts/EstatusContext";
import Historial from "./Viajes/Historial";
import {confirmAlert} from "react-confirm-alert";
import ActualizarDiponibilidadEquipo from "./Viajes/ActualizarDiponibilidadEquipo";
import SalidaParadas from "./Viajes/SalidaParadas";
import LlegadaParadas from "./Viajes/LlegadaParadas";
import AsignarOperador from "./Viajes/AsignarOperador";
import {agregarViajeSalida, agregarViajeLlegada, obetenerViajeId, obtenerViajes} from "../Util/Contexts/ViajesContext";
import ExpandLess from '@material-ui/icons/ExpandLess';
import ExpandMore from '@material-ui/icons/ExpandMore';
import {obtenerInformesPorViaje} from "../Util/Contexts/InformesContext";
import {getUniqueListBy} from "../Util/Util";
import DetalleInforme from "./Viajes/DetalleInforme";
import {obtenerDetalleParadasIdInformes, obtenerDetalleParadasIdViaje} from "../Util/Contexts/DetalleParadasContext";

function showSuccess(mensaje) {
    new Noty({
        type: "information",
        layout: "topCenter",
        text: mensaje,
        timeout: "3000"
    }).show()
}

const styles = {
    seleccionado: {
        backgroundColor: "#FCC88F",
    },
    noSeleccionado: {
        backgroundColor: "#FFFFFF",
    }
};
const useStyles = makeStyles(styles);
window.jQuery = window.$ = $;

function Viajes() {
    const [data, setData] = React.useState([])
    const [dataSucursal, setDataSucursal] = React.useState([]);
    const [indexOpen, setIndexOpen] = React.useState(-1);
    const [dataEstatusViaje, setEstatusViaje] = React.useState([]);
    const [informeSeleccionado, setInformeSeleccionado] = React.useState(null);
    const [dataEstatusDocumento, setEstatusDocumento] = React.useState([]);
    const [state, setState] = React.useState({
        showPopUp: false,
        idViaje: 0,
        DerechoBorrar: 58,
        codigoDepartamento: "",
        descripcionDepartamento: "",
        agregar: "Viaje",
        importar: "",
        CreadoPor: localStorage.getItem("UsuarioId"),
        ModificadoPor: localStorage.getItem("UsuarioId"),
        height: window.innerHeight,
        fechaInicial: "",
        fechaFinal: "",
        sucursalListado: 0,
        estatusListado: 0,
        estatusDocumentoListado: 0,
        idEquipo: 0


    })

    function getAllEstatusViaje() {
        const url = `${process.env.REACT_APP_API_URL}/SisEstatus/getListadoViajes`;
        axios.get(url, {headers}).then((respuesta) => {
            setEstatusViaje(respuesta.data);
        });
    }

    function getAllEstatusDocumento() {
        obtenerEstatusDocumentos().then((respuesta) => {
            setEstatusDocumento(respuesta.data);
        });
    }

    function getAllSucursales() {
        const url = `${process.env.REACT_APP_API_URL}/Sucursales/GetListado`;
        axios.get(url, {headers}).then((respuesta) => {
            setDataSucursal(respuesta.data);
        });
    }

    const handleAceptar = (e) => {
        e.preventDefault()
        // var params = {
        //
        //   "Codigo": state.codigoDepartamento,
        //   "Descripcion": state.descripcionDepartamento,
        //
        //   "CreadoPor": state.CreadoPor,
        //   "ModificadoPor": state.ModificadoPor
        // }
        // console.log(params)
        // if (state.idDepartamento != 0) {
        //   const url = `${process.env.REACT_APP_API_URL}/Departamento/Modificar/` + state.idDepartamento;
        //   axios.put(url, Object.assign({}, params), { headers }).then(respuesta => {
        //     showSuccess(respuesta.data)
        //     getAllData()
        //   }).catch(err => {
        //     console.log(err)
        //     showSuccess("err")
        //   });
        // } else {
        //   const url = `${process.env.REACT_APP_API_URL}/Departamento/Agregar`;
        //   axios.post(url, Object.assign({}, params), { headers }).then(respuesta => {
        //     showSuccess(respuesta.data)
        //     getAllData()
        //   }).catch(err => {
        //     console.log(err)
        //     showSuccess(err)
        //   });
        // }

    }

    function handleEliminar(id) {
        // var derecho;
        // const urlDelete = `${process.env.REACT_APP_API_URL}/Utilerias/ValidaDerechos/${state.CreadoPor}/${state.DerechoBorrar}/3`;
        // axios.get(urlDelete, { headers }).then(respuesta => {
        //   derecho = respuesta.data;
        //   if (derecho == false)
        //   {
        //     showSuccess ("El usuario no tiene derechos para realizar el proceso");
        //     return;
        //   }
        //
        // const url = `${process.env.REACT_APP_API_URL}/Departamento/Eliminar/` + id;
        // axios.delete(url, { headers }).then(respuesta => {
        //   console.log(respuesta);
        //   getAllData();
        // }).catch(err => {
        //   showSuccess(err)
        // });
        // }).catch(err => {
        // showSuccess(err)
        // });
    }

    function handleShowModificar(id) {
        $('.nav-tabs li ').removeClass('active');
        $('.nav-tabs li').eq(1).addClass('active');
        $('.tab-content div ').removeClass('in show');
        $('#Agregar').addClass('in show');

        obetenerViajeId(id).then(respuesta => {
            setState({
                ...state,
                agregar: "Viaje",
                edit: true,
                idViaje: id,
                selectViaje: respuesta.data
            })
        });
    }

    function handleShowConsultar(id) {
        $('.nav-tabs li ').removeClass('active');
        $('.nav-tabs li').eq(1).addClass('active');
        $('.tab-content div ').removeClass('in show');
        $('#Agregar').addClass('in show');
        obetenerViajeId(id).then(respuesta => {
            setState({
                ...state,
                agregar: "Viaje",
            })
        });
    }

    function handleShowAgregar() {
        setState({
            ...state,
            agregar: "Viaje",
            showPopUp: false,
            edit: false
        })
        $('.nav-tabs li ').removeClass('active');
        $('.nav-tabs li').eq(1).addClass('active');
        $('.tab-content div ').removeClass('in show');
        $('#Agregar').addClass('in show');
    }

    const handleChange = event => {
        console.log(event.target.id + " : " + event.target.value)
        setState({
            ...state,
            [event.target.id]: event.target.value
        });
    };

    async function getViajesByFiltro(fechaInicial, fechaFinal, sucursal, estatus) {
        const url = `${process.env.REACT_APP_API_URL}/Viajes/GetByFiltro/` +
            fechaInicial + "/" + fechaFinal + "/" + sucursal + "/" + estatus;
        await axios.get(url, {headers}).then(respuesta => {
            setData(respuesta.data)
        })
        console.log(url)
    }

    const handleFechaInicialFiltro = async (event) => {
        setState({
            ...state,
            fechaInicial: event.target.value,
        })
        await getViajesByFiltro(event.target.value, state.fechaFinal, state.sucursalListado, state.estatusDocumentoListado)
    }

    const handleFechaFinalFiltro = async (event) => {
        setState({
            ...state,
            fechaFinal: event.target.value,
        })
        await getViajesByFiltro(state.fechaInicial, event.target.value, state.sucursalListado, state.estatusDocumentoListado)

    }

    const handleSucursalFiltro = async (event) => {
        console.log(event.target.value)
        setState({
            ...state,
            sucursalListado: event.target.value,
        })
        await getViajesByFiltro(state.fechaInicial, state.fechaFinal, event.target.value, state.estatusDocumentoListado)
    }

    const handleEstatusFiltro = async (event) => {
        event.preventDefault()
        console.log(event.target.value)
        setState({
            ...state,
            estatusListado: event.target.value,
        })
        // const url = `${process.env.REACT_APP_API_URL}/Embarques/GetByFiltro/` +
        //     state.fechaInicial + "/" + state.fechaFinal + "/" + state.sucursalListado + "/" + event.target.value;
        // await axios.get(url, { headers }).then(respuesta => {
        //     setData(respuesta.data)
        // })
        // console.log(url)
    }

    const handleEstatusDocumentoFiltro = async (event) => {
        setState({
            ...state,
            estatusDocumentoListado: event.target.value,
        })
        await getViajesByFiltro(state.fechaInicial, state.fechaFinal, state.sucursalListado, event.target.value)

    }

    const columns = React.useMemo(() => [
        {
            headerName: "Acciones",
            sortable: false, filterable: false,
            field: "",
            width: 150,
            renderCell: (row) => {
                return (
                    <div>
                        <Tooltip title="Modificar">
                            <a
                                onClick={() => (handleShowModificar(row.row.m_nIdViaje))}
                                className="btn btn-default btn-xs"><i className="fa fa-pencil-square-o"
                                                                      style={{color: "#F9A03E"}}/></a>

                        </Tooltip>
                        <Tooltip title="Consultar">
                            <a className="btn btn-default btn-xs"
                               onClick={() => (handleShowConsultar(row.row.m_nIdViaje))}><i className="fa fa-eye"
                                                                                            style={{color: "#F9A03E"}}/></a>

                        </Tooltip>
                        <Tooltip title="Eliminar">
                            <a href="#" className="btn btn-default btn-xs"
                               onClick={() => (handleEliminar(row.row.m_nIdViaje))}><i className="zmdi zmdi-delete"
                                                                                       style={{color: "#F30B0B"}}/></a>

                        </Tooltip>
                    </div>
                )
            }
        },
        {
            headerName: "Estatus de Viaje",
            field: "m_sEstatus",
            width: 200,
        }, {
            headerName: "Fecha/Hora Elaboración",
            field: "m_sFechaHora",
            width: 200,
        }, {
            headerName: "Viaje",
            field: "m_sFolioViaje",
            width: 150,
        },{
            headerName: "Sucursal receptora",
            field: "m_sSucursalReceptora",
            width: 180,
        }, {
            headerName: "Sucursal",
            field: "m_sSucursal",
            width: 150,
        },
        //   {
        //   headerName: "Origen",
        //   field: "m_sDescripcion",
        //   width: 150,
        // }, {
        //   headerName: "Destino",
        //   field: "m_sDescripcion",
        //   width: 150,
        // },
        //   {
        //       headerName: "Ruta General",
        //       field: "m_sDescripcion",
        //       width: 150,
        //   },
        //   {
        //       headerName: "Estatus de Documento",
        //       field: "m_sEstatus",
        //       width: 200,
        //   }

    ]);

    useEffect(value => {
        if (localStorage.getItem("UsuarioId") === null || localStorage.getItem("UsuarioId") <= 0) {
            showSuccess("Es necesario iniciar sesion para acceder a este proceso");
            window.location.replace("login");
            return;
        }
        getAllData();
        getAllSucursales();
        getAllEstatusViaje();
        getAllEstatusDocumento();
        getInventarioUnidades()
    }, []);

    function getAllData() {
        obtenerViajes().then(respuesta => {
            setData(respuesta.data)
        });
    };


    const headers = {
        'Content-Type': 'application/json',
        //    'access-control-allow-origin': '*'
    }


    /**DISPONIBILIDAD DE EQUIPO*/

    const columnsEquipo = [
        /*{
            headerName: "Acciones",
            sortable: false, filterable: false,
            field: "",
            renderCell: (row) => {
                return (
                    <div>
                        <Tooltip title="Modificar">
                            <a
                                onClick={() => showActualizarDispEquipo(row.row)}
                                className="btn btn-default btn-xs">
                                <i className="fa fa-pencil-square-o"
                                    style={{ color: "#F9A03E" }}/>
                            </a>
                        </Tooltip>
                    </div>
                );
            },
            width: 100,
        },*/
        {
            headerName: "Unidad",
            field: "m_sCodigoUnidad",
            width: 100,
        },
        {
            headerName: "Tipo unidad",
            field: "m_sTipoUnidad",
            width: 150,
        }, {
            headerName: "Estado",
            field: "m_sEstatus",
            width: 150,
        }, {
            headerName: "Días",
            field: "m_nDias",
            width: 100,
        }, {
            headerName: "Ubicación",
            field: "m_sUbicacion",
            width: 200,
        }, {
            headerName: "Desde",
            field: "m_dDesde",
            width: 150,
        },
    ]
    const [equipoListado, setEquipoListado] = React.useState([]);
    const [equipoSelected, setEquipoSelected] = React.useState();
    const [eventOptions, setEventOptions] = React.useState({
        showDispEquipoDialog: false,
        showSalidaParadasDialog: false,
        showLlegadaParadasDialog: false,
        showAsignarOperadorDialog: false,
        showDetalleGuias: false,
    });


    function updateEquipoData(equipo) {
        //TODO: Integrar servicio de cambiar disponibilidad de equipo
    }

    const showActualizarDispEquipo = (equipo) => {
        setEquipoSelected(equipo)
        setEventOptions({...eventOptions, showDispEquipoDialog: true});
    }

    const closeActualizarDispEquipo = () => {
        setEventOptions({...eventOptions, showDispEquipoDialog: false});
    }


    /**DETALLE DE PARADAS*/

    const columnsParadas = [
        {
            headerName: "Folio Informe",
            field: "m_clsInforme",
            width: 200,
            valueFormatter: row => {
                return (row.value.m_sFolioInforme)
            }
        },
        {
            headerName: "Origen",
            field: "m_sOrigen",
            width: 200,
        },
        {
            headerName: "Salida",
            field: "m_dFechaSalida",
            valueFormatter: row => row.value.startsWith("0000") ? "Sin definir" : row.value
        },
        {
            headerName: "Llegada",
            field: "m_dFechaLlegada",
            width: 100,
            valueFormatter: row => row.value.startsWith("0000") ? "Sin definir" : row.value
        },
        {
            headerName: "Guías",
            field: "m_nIdViaje",
            renderCell: (row) => {
                return (
                    <Link style={{cursor: "pointer"}} onClick={() => {
                        setInformeSeleccionado(row.row);
                        setEventOptions({...eventOptions, showDetalleGuias: true})
                    }}>
                        Ver Guías
                    </Link>
                )
            }
        },
        {
            headerName: "Destino",
            field: "m_sDestino",
            width: 200,
        },
        {
            headerName: "Camión",
            field: "m_sCamion",
            width: 150,
        },
        {
            headerName: "Operador",
            field: "m_sNombreCompleto",
            width: 150
        },
        // {
        //     headerName: "Liq",
        //     field: "m_sNumeroNombreOperador",
        //     width: 80,
        // }, */
    ]
    const [paradasListado, setParadasListado] = React.useState([]);

    const [paradaData, setParadaData] = React.useState();

    function getParadasListado(row) {
        obtenerDetalleParadasIdViaje(row).then(respuesta => {
            var arrayInformes = getUniqueListBy(respuesta.data, "m_nIdOrigen")
            arrayInformes.forEach(a => {
                a["informes"] = respuesta.data.filter(r => r.m_nIdOrigen === a.m_nIdOrigen)
            })
            setParadasListado(arrayInformes);
        });
    }

    function getInventarioUnidades() {
        const url = `${process.env.REACT_APP_API_URL}/InventarioUnidades/GetListado`;
        axios.get(url, {headers}).then(({data}) => {
            setEquipoListado(data)
        });
    }


    const showSalidaDialog = (data) => {
        console.log(data);
        setParadaData(data);
        setEventOptions({...eventOptions, showSalidaParadasDialog: true});

    }

    const closeSalidaDialog = () => {
        setEventOptions({...eventOptions, showSalidaParadasDialog: false});
    }

    const showLlegadaDialog = (data) => {
        setParadaData(data);
        setEventOptions({...eventOptions, showLlegadaParadasDialog: true});
    }

    const closeLlegadaDialog = () => {
        setEventOptions({...eventOptions, showLlegadaParadasDialog: false});
    }

    function updateSalida(data) {


        //e.preventDefault();
        var params = {
            //m_dFecha: state.fechaHoraRegistro.split("T")[0],
            //m_tHora: state.fechaHoraRegistro.split("T")[1],
            m_nIdViaje: paradaData.m_nIdViaje,
            m_nCV1Km: data.kmsRemolqueUno,
            m_nCV2Km: data.kmsRemolqueDos,
            m_nCV1Millas: data.millasRemolqueUno,
            m_nCV2Millas: data.millasRemolqueDos,
            m_bCV1Estatus: data.idEstatusRemolqueUno,
            m_bCV2Estatus: data.idEstatusRemolqueDos,
            m_dFechaSalida: data.fechaSalida,
            m_tHoraSalida: data.horaSalida,
            m_nIdEstatusSalida: data.idEstatus,
            m_nKmViaje: data.kms,
            m_nMillasViaje: data.millas,
            m_sMotivoRetraso: data.motivoRetraso,
            m_nIdCiudadorigen: paradaData.m_nIdOrigen,
            IdRuta: paradaData.m_nIdRuta,


            // m_nIdEstatusViaje: this.state.estatusListado,
            // m_nIdSucursal : this.state.idSucursalAgregar,
            // m_sCandadoOficial : this.state.candadoOficial,
            // m_sFolioViaje : this.state.folioViaje,
            // m_sIdentificador : this.state.identificadorViaje,
            // m_sNumViajeCliente : this.state.viajeCliente,
            // CreadoPor : this.state.CreadoPor,
            // m_arrInformes : this.state.dataInformes

        }


        agregarViajeSalida(params)
            .then((respuesta) => {
                showSuccess(respuesta.data);
                console.log(respuesta.data);
                getParadasListado(paradaData.m_nIdViaje)
                getAllData()
            })
            .catch((err) => {
                console.log(err);
                showSuccess(err);
            });


    }

    function updateLlegada(data) {
        console.log("Actualizar datos de llegada");
        console.log(data);

        var params = {
            //m_dFecha: state.fechaHoraRegistro.split("T")[0],
            //m_tHora: state.fechaHoraRegistro.split("T")[1],
            m_nCV1Km: data.kmsRemolqueUno,
            m_nCV2Km: data.kmsRemolqueDos,
            m_nCV1Millas: data.millasRemolqueUno,
            m_nCV2Millas: data.millasRemolqueDos,
            m_bCV1Estatus: data.idEstatusRemolqueUno,
            m_bCV2Estatus: data.idEstatusRemolqueDos,
            m_nKmViaje: data.kms,
            m_nIdEstatusLlegada: data.idEstatus,
            m_nMillasViaje: data.millas,
            IdRuta: paradaData.m_nIdRuta,
            m_nIdViaje: paradaData.m_nIdViaje,
            m_sMotivoRetraso: data.motivoRetraso,
            m_nPesoCarga: data.pesoDescarga,
            m_dFechaSalida: data.fechaSalida,
            m_tHoraSalida: data.horaSalida,
            m_nLiquidacion: data.liquidacion,
            m_dFechaLlegada: data.fechaLlegada,
            m_tHoraLlegada: data.horaLlegada,
            m_nTipoCambio: data.tipoDeCambioOrigen
        }


        agregarViajeLlegada(params)
            .then((respuesta) => {
                showSuccess(respuesta.data);
                console.log(respuesta.data);
                getParadasListado(paradaData.m_nIdViaje)
                getAllData()

            })
            .catch((err) => {
                console.log(err);
                showSuccess(err);
            });

    }

    const showAsignarOperadorDialog = (data) => {
        setParadaData(data);
        setEventOptions({
            ...eventOptions,
            showAsignarOperadorDialog: true
        });
    }

    const closeAsignarOperadorDialog = () => {
        setEventOptions({
            ...eventOptions,
            showAsignarOperadorDialog: false
        })
    }

    function submitOperadorUnidad(data) {
        console.log("Llamar servicio operador unidad");
        console.log(data);
    }

    return (
        <div>
            {
                informeSeleccionado &&
                <Dialog open={eventOptions.showDetalleGuias}
                        onClose={() => setEventOptions({...eventOptions, showDetalleGuias: false})}
                        fullWidth={true}
                        maxWidth={'md'}>
                    <DialogTitle>
                        Detalle de Informe - {informeSeleccionado.m_clsInforme.m_sFolioInforme}
                    </DialogTitle>
                    <DialogContent>
                        <DetalleInforme guias={informeSeleccionado.m_clsInforme.m_arrClsProGuia}>
                            <DialogActions>
                                <Button
                                    variant={'contained'} color={'primary'}
                                    type="submit"
                                    onClick={() => setEventOptions({
                                        ...eventOptions,
                                        showDetalleGuias: false
                                    })}>Aceptar</Button>
                            </DialogActions>
                        </DetalleInforme>
                    </DialogContent>
                </Dialog>
            }

            <Dialog open={eventOptions.showDispEquipoDialog}
                    onClose={closeActualizarDispEquipo}
                    fullWidth={true}
                    maxWidth={'sm'}>
                <DialogContent>
                    <ActualizarDiponibilidadEquipo onSubmit={updateEquipoData} equipo={equipoSelected}>
                        <DialogActions>
                            <Button
                                variant={'contained'} color={'primary'}
                                type="submit"
                                onClick={closeActualizarDispEquipo}>Aceptar</Button>
                            <Button variant={'outlined'} color={'primary'}
                                    onClick={closeActualizarDispEquipo}>Cancelar</Button>
                        </DialogActions>
                    </ActualizarDiponibilidadEquipo>
                </DialogContent>
            </Dialog>
            {
                paradaData &&
                <Dialog open={eventOptions.showSalidaParadasDialog}
                        onClose={closeSalidaDialog}
                        fullWidth={true}
                        maxWidth={'xl'}>
                    <DialogTitle><h2>Salida de Paradas</h2></DialogTitle>
                    <DialogContent>
                        <SalidaParadas onSubmit={updateSalida} data={paradaData.m_clsInforme}>
                            <DialogActions>
                                <Button
                                    variant={'contained'} color={'primary'}
                                    type="submit"
                                    onClick={closeSalidaDialog}>Aceptar</Button>
                                <Button variant={'outlined'} color={'primary'}
                                        onClick={closeSalidaDialog}>Cancelar</Button>
                            </DialogActions>
                        </SalidaParadas>
                    </DialogContent>
                </Dialog>
            }
            {
                paradaData &&
                <Dialog open={eventOptions.showLlegadaParadasDialog}
                        onClose={closeLlegadaDialog}
                        fullWidth={true}
                        maxWidth={'xl'}>
                    <DialogTitle><h2>Llegada de Paradas</h2></DialogTitle>
                    <DialogContent>
                        <LlegadaParadas onSubmit={updateLlegada} data={paradaData.m_clsInforme}>
                            <DialogActions>
                                <Button
                                    variant={'contained'} color={'primary'}
                                    type="submit"
                                    onClick={closeLlegadaDialog}>Aceptar</Button>
                                <Button variant={'outlined'} color={'primary'}
                                        onClick={closeLlegadaDialog}>Cancelar</Button>
                            </DialogActions>
                        </LlegadaParadas>
                    </DialogContent>
                </Dialog>
            }
            <Dialog open={eventOptions.showAsignarOperadorDialog}
                    onClose={closeAsignarOperadorDialog}
                    fullWidth={true}
                    maxWidth={'xl'}>
                <DialogTitle style={{display: "flex", flexDirection: "row", justifyContent: "space-between"}}>
                    {/*<h3>Origen: {paradaData.m_sCiudadOrigen} Destino: {paradaData.m_sCiudadDestino}</h3>*/}
                    <h3>Origen: Destino: </h3>

                </DialogTitle>
                <DialogContent>
                    <AsignarOperador>
                        <DialogActions>
                            <Button
                                variant={'contained'}
                                color={'primary'}
                                onClick={closeAsignarOperadorDialog}>Cerrar</Button>
                        </DialogActions>
                    </AsignarOperador>

                </DialogContent>
            </Dialog>

            <header className="topbar clearfix">
                <Cabecera titulo="Viajes">
                    <div className="page-header">
                        <ul className="list-page-breadcrumb">
                            <li>
                                <a href="/Catalogos" className="color-mapeo">
                                    Catálogos <i className="zmdi zmdi-chevron-right"/>
                                </a>
                            </li>
                            <li className="active-page">Viajes</li>
                        </ul>
                    </div>
                </Cabecera>
            </header>

            {/*Leftbar Start Here*/}
            <aside className="iconic-leftbar">
                <BarraLateralIzquierda/>
            </aside>
            {/*Leftbar End Here*/}

            {/*Page Container Start Here*/}
            <section className="main-container">

                <div className="container-fluid">

                    <ul className="nav navStatica nav-tabs">
                        <li className="active">
                            <a onClick={(event) => {
                                event.stopPropagation();
                                setState({...state, agregar: "Viaje"});
                                $('.nav-tabs li ').removeClass('active');
                                $('.nav-tabs li').eq(0).addClass('active');
                                $('.tab-content div ').removeClass('in show');
                                $('#Listado').addClass('in show');
                            }}>
                                <i className="fa fa-list"/> Listado
                            </a>
                        </li>
                        <li>
                            <a onClick={handleShowAgregar}>
                                <i className="fa fa-plus-circle"/> {state.agregar}
                            </a>
                        </li>
                        <li>
                            <a onClick={() => {
                                setState({
                                    ...state,
                                    identificadorModal:
                                        "imprimir",
                                    tipoModal: 6,
                                    openDialog: true
                                });
                            }}>
                                <i className="fa fa-print"/> Imprimir
                            </a>
                        </li>

                    </ul>

                    <div className="row" className="tab-content">
                        <div className="widget-wrap" id="Listado" className="tab-pane fade in show">
                            <div className="widget-wrap">
                                <div className="widget-content">

                                    <div className="row" style={{paddingLeft: "8px"}}>
                                        <form className="j-forms">
                                            <div className="row" style={{display: "flex"}}>
                                                <div className="col-sm-6 col-md-2 " style={{paddingLeft: "0px"}}>
                                                    <div className="input">
                                                        <TextField
                                                            autoFocus
                                                            type="date"
                                                            margin="dense"
                                                            label="Fecha Inicial"
                                                            variant="outlined"
                                                            className="form-control"
                                                            InputLabelProps={{
                                                                shrink: true,
                                                            }}
                                                            value={state.fechaInicial}
                                                            onChange={handleFechaInicialFiltro}
                                                            id="fechaInicial"
                                                        />
                                                    </div>
                                                </div>

                                                <div className="col-sm-6 col-md-2 " style={{paddingLeft: "0px"}}>
                                                    <div className="input">
                                                        <TextField
                                                            autoFocus
                                                            type="date"
                                                            margin="dense"
                                                            label="Fecha Final"
                                                            variant="outlined"
                                                            className="form-control"
                                                            InputLabelProps={{
                                                                shrink: true,
                                                            }}
                                                            value={state.fechaFinal}
                                                            onChange={handleFechaFinalFiltro}
                                                            id="fechaFinal"
                                                        />
                                                    </div>
                                                </div>

                                                <div className="col-sm-6 col-md-2 " style={{paddingLeft: "0px"}}>
                                                    <label className="input select">
                                                        <FormControl fullWidth variant="outlined" margin="dense">
                                                            <InputLabel
                                                                id="idSucursalAgregarLabel">Sucursal</InputLabel>
                                                            <Select
                                                                labelId="idSucursalAgregarLabel"
                                                                className="form-control"
                                                                required
                                                                value={state.sucursalListado}
                                                                onChange={handleSucursalFiltro}
                                                                id="idSucursalAgregar"
                                                                label="Sucursal"
                                                            >
                                                                <option value="0">Todas</option>
                                                                {dataSucursal.map((sucursal) => (
                                                                    <option
                                                                        key={sucursal.m_nIdSucursal}
                                                                        value={sucursal.m_nIdSucursal}
                                                                    >
                                                                        {sucursal.m_sSucursal}
                                                                    </option>
                                                                ))}
                                                            </Select>
                                                        </FormControl>
                                                    </label>
                                                </div>

                                                <div className="col-sm-6 col-md-3 " style={{paddingLeft: "0px"}}>
                                                    <label className="input select">
                                                        <FormControl fullWidth variant="outlined" margin="dense">
                                                            <InputLabel id="idEstatusViajeLabel">Estatus
                                                                Viaje</InputLabel>
                                                            <Select
                                                                labelId="idEstatusViajeLabel"
                                                                className="form-control"
                                                                required
                                                                value={state.estatusListado}
                                                                onChange={handleEstatusFiltro}
                                                                id="estatusListado"
                                                                label="Estatus Viaje"
                                                            >
                                                                <option value="0">Todos</option>
                                                                {dataEstatusViaje.map((estatus) => (
                                                                    <option
                                                                        key={estatus.m_nIdEstatusViaje}
                                                                        value={estatus.m_nIdEstatusViaje}
                                                                    >
                                                                        {estatus.m_sEstatus}
                                                                    </option>
                                                                ))}
                                                            </Select>
                                                        </FormControl>
                                                    </label>
                                                </div>

                                                <div className="col-sm-6 col-md-3 " style={{paddingLeft: "0px"}}>
                                                    <label className="input select">
                                                        <FormControl fullWidth variant="outlined" margin="dense">
                                                            <InputLabel id="idEstatusDocumentoLabel">Estatus
                                                                Documento</InputLabel>
                                                            <Select
                                                                labelId="idEstatusDocumentoLabel"
                                                                className="form-control"
                                                                required
                                                                value={state.estatusDocumentoListado}
                                                                onChange={handleEstatusDocumentoFiltro}
                                                                id="estatusDocumentoListado"
                                                                label="Estatus Documento"
                                                            >
                                                                <option value="0">Todos</option>
                                                                {dataEstatusDocumento.map((estatus) => (
                                                                    <option
                                                                        key={estatus.m_nIdEstatusEmbarque}
                                                                        value={estatus}
                                                                    >
                                                                        {estatus.m_sEstatus}
                                                                    </option>
                                                                ))}
                                                            </Select>
                                                        </FormControl>
                                                    </label>
                                                </div>


                                            </div>
                                        </form>
                                    </div>

                                    <div className="row" style={{height: "400px", width: '100%'}}>
                                        <DataGrid
                                            localeText={dataGridLocaleText}
                                            rows={data}
                                            columns={columns}
                                            density="compact"
                                            getRowId={(row) => row.m_nIdViaje}
                                            onRowSelected={(row) => {
                                                /*  setState({
                                                     ...state,
                                                     idViaje: row.data.m_nIdViaje
                                                 }) */
                                                getParadasListado(row.data.m_nIdViaje)
                                            }}
                                        />

                                    </div>
                                </div>
                            </div>
                            <div className="row">


                                <div className="col-md-6">
                                    <div style={{color: '#717171', marginBottom: "10px", fontSize: "18px"}}>Detalle de
                                        Paradas
                                    </div>
                                    <div className="widget-wrap">
                                        <div className="widget-content">
                                            <div className="row"
                                                 style={{height: "400px", width: '100%', overflow: "auto"}}>
                                                <List>
                                                    {
                                                        paradasListado.map((p, index) => {

                                                            return (
                                                                <div>
                                                                    <ListItem
                                                                    >

                                                                        <ListItemText primary={`Ruta: ${p.m_sOrigen}  - ${p.m_sDestino}`}/>
                                                                        {
                                                                            p.m_dFechaSalida.startsWith("0000") &&

                                                                            <Link style={{cursor: "pointer"}}
                                                                                  onClick={() => showSalidaDialog(p)}>Marcar
                                                                                Salida</Link>
                                                                        }

                                                                        {p.m_dFechaLlegada.startsWith("0000") && p.m_dFechaSalida.startsWith("0000") &&
                                                                        "/"
                                                                        }


                                                                        {
                                                                            p.m_dFechaLlegada.startsWith("0000") &&

                                                                            <Link style={{cursor: "pointer"}}
                                                                                  onClick={() => showLlegadaDialog(p)}>Marcar
                                                                                Llegada</Link>
                                                                        }
                                                                        {indexOpen === index ?
                                                                            <ExpandLess style={{cursor: "pointer"}}
                                                                                        onClick={() => setIndexOpen(index === indexOpen ? -1 : index)}/> :
                                                                            <ExpandMore style={{cursor: "pointer"}}
                                                                                        onClick={() => setIndexOpen(index === indexOpen ? -1 : index)}/>}
                                                                    </ListItem>
                                                                    <Collapse in={indexOpen === index}
                                                                              timeout="auto" unmountOnExit>
                                                                        <div style={{height: "300px"}}>
                                                                            <DataGrid
                                                                                localeText={dataGridLocaleText}
                                                                                rows={p.informes}
                                                                                columns={columnsParadas}
                                                                                density="compact"
                                                                                getRowId={(row) => row.m_nIdInforme}
                                                                            />
                                                                        </div>

                                                                    </Collapse>
                                                                </div>
                                                            )
                                                        })
                                                    }

                                                </List>

                                                {/*{equipoListado.length !== 0 ? (
                                                        <DataGrid
                                                            rows={paradasListado}
                                                            columns={columnsParadas}
                                                            density="compact"
                                                            pageSize={Math.floor((state.height - 310) / 30)}
                                                            getRowId={(row) => row.m_nIdInforme}
                                                            onRowSelected={(row) => {
                                                                setState({
                                                                    ...state,
                                                                    idEquipo: row.data.m_nIdInventarioUnidad
                                                                })
                                                            }}
                                                        />
                                                    ) : (
                                                        <div>No se encontró ningún registro</div>
                                                    )}*/}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="col-md-6">
                                    <div style={{
                                        color: '#717171',
                                        marginBottom: "10px",
                                        fontSize: "18px"
                                    }}>Disponibilidad del
                                        Equipo
                                    </div>
                                    <div className="widget-wrap">
                                        <div className="widget-content">
                                            <div className="row" style={{height: "400px", width: '100%'}}>
                                                {equipoListado.length !== 0 ? (
                                                    <DataGrid
                                                        rows={equipoListado}
                                                        localeText={dataGridLocaleText}
                                                        columns={columnsEquipo}
                                                        density="compact"
                                                        getRowId={(row) => row.m_nIdInventarioUnidad}

                                                    />
                                                ) : (
                                                    <div>No se encontró ningún registro</div>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                        </div>

                        <div className="widget-wrap" id="Agregar" className="tab-pane fade">

                            <AgregarViaje reload={getAllData} edit={state.edit} select={state.selectViaje} id={state.idViaje}/>

                        </div>

                        <div className="widget-wrap" id="Importar" className="tab-pane fade">
                            <div className="widget-wrap">
                                <div className="widget-content">
                                    <div className="row">
                                        <div className="col-md-12">
                                            <form className="j-forms">
                                                <div className="form-content">
                                                    <div className="col-sm-12 col-md-12 unit">
                                                        <label className="label">
                                                            Importar
                                                        </label>
                                                        <div className="input">
                                                            <input
                                                                //onChange={handleUpload}
                                                                className="form-control"
                                                                type="file"
                                                                placeholder="some text"
                                                                id="importar"
                                                            />
                                                        </div>
                                                    </div>
                                                </div>
                                                <br></br>
                                                <div className="form-footer" className="col-md-12">
                                                    <button className="btn btn-default btn-block ex-noty"
                                                            data-layout="topCenter" data-type="information">Notificación
                                                    </button>
                                                    <button data-layout="topCenter" data-type="information"
                                                            className="btn btn-secondary secondary-btn"> Cancelar
                                                    </button>
                                                    <button onClick={handleAceptar}
                                                            className="btn btn-primary primary-btn">Aceptar
                                                    </button>
                                                </div>
                                            </form>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                    </div>
                </div>

            </section>
            {/*Page Container End Here*/}

            {/*Rightbar Start Here*/}
            <aside className="rightbar">
                <BarraLateralDerecha/>
            </aside>

        </div>

    );
}

export default Viajes;
