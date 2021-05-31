import React, { useEffect, useState, useMemo } from "react";
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
import { useTable, useFilters, useSortBy } from 'react-table'
import { makeStyles } from "@material-ui/core/styles";
import { DataGrid } from '@material-ui/data-grid';
import Noty from 'noty';
import AgregarViaje from "./Viajes/AgregarViaje";
import FormControl from "@material-ui/core/FormControl";
import InputLabel from "@material-ui/core/InputLabel";
import Select from "@material-ui/core/Select";
import TextField from "@material-ui/core/TextField";
import { dataGridLocaleText } from "../Constants";
import {Button, Dialog, DialogActions, DialogContent, DialogTitle, Tooltip} from "@material-ui/core";
import { obtenerEstatusDocumentos } from "../Util/Contexts/EstatusContext";
import {confirmAlert} from "react-confirm-alert";
import ActualizarDiponibilidadEquipo from "./Viajes/ActualizarDiponibilidadEquipo";
import SalidaParadas from "./Viajes/SalidaParadas";
import LlegadaParadas from "./Viajes/LlegadaParadas";

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

function Viajes() {

    const classes = useStyles();
    const [data, setData] = React.useState([])
    const [dataSucursal, setDataSucursal] = React.useState([]);
    const [dataEstatusViaje, setEstatusViaje] = React.useState([]);
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
        idEquipo: 0,



    })
    const [fileUploaded, setFileUploaded] = React.useState([])

    function getAllEstatusViaje() {
         const url = `${process.env.REACT_APP_API_URL_LOCAL}/SisEstatus/getListadoViajes`;
        axios.get(url, { headers }).then((respuesta) => {
             setEstatusViaje(respuesta.data);
             console.log(respuesta.data);
         });
    }

    function getAllEstatusDocumento() {
        obtenerEstatusDocumentos().then((respuesta) => {
            setEstatusDocumento(respuesta.data);
        });
    }

    function getAllSucursales() {
        const url = `${process.env.REACT_APP_API_URL}/Sucursales/GetListado`;
        axios.get(url, { headers }).then((respuesta) => {
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
        // const url = `${process.env.REACT_APP_API_URL}/Departamento/GetById/` + id;
        // axios.get(url, { headers }).then(respuesta => {
        //   console.log(respuesta.data)
        //   setState({
        //     ...state,
        //     agregar: "Modificar",
        //     showPopUp: true,
        //     idDepartamento: id,
        //     codigoDepartamento: respuesta.data.m_nCodigo,
        //     descripcionDepartamento: respuesta.data.m_sDescripcion
        //   })
        // });
    }

    function handleShowConsultar(id) {
        // const url = `${process.env.REACT_APP_API_URL}/Departamento/GetById/` + id;
        // axios.get(url, { headers }).then(respuesta => {
        //   console.log(respuesta.data)
        //   setState({
        //     ...state,
        //     agregar: "Consultar",
        //     showPopUp: true,
        //     idDepartamento: id,
        //     codigoDepartamento: respuesta.data.m_nCodigo,
        //     descripcionDepartamento: respuesta.data.m_sDescripcion
        //   })
        // });
    }

    function handleShowAgregar() {
        setState({
            ...state,
            agregar: "Viaje",
            showPopUp: false
        })
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
        await axios.get(url, { headers }).then(respuesta => {
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

    function handleSelectRow(id, event) {
        setState({
            ...state,
            idViaje: id
        });
    }

    const columns = React.useMemo(() => [
        {
            headerName: "Acciones",
            sortable: false, filterable: false,
            field: "",
            renderCell: (row) => {
                return (
                    <div>
                        <Tooltip title="Modificar">
                            <a href="#Agregar" role="tab" data-toggle="tab" onClick={() => (handleShowModificar(row.row.m_nIdViaje))} className="btn btn-default btn-xs"><i className="fa fa-pencil-square-o" style={{ color: "#F9A03E" }} /></a>

                        </Tooltip>
                        <Tooltip title="Consultar">
                            <a href="#Agregar" role="tab" data-toggle="tab" className="btn btn-default btn-xs" onClick={() => (handleShowConsultar(row.row.m_nIdViaje))}><i className="fa fa-eye" style={{ color: "#F9A03E" }} /></a>

                        </Tooltip>
                        <Tooltip title="Eliminar">
                            <a href="#" className="btn btn-default btn-xs" onClick={() => (handleEliminar(row.row.m_nIdViaje))}><i className="zmdi zmdi-delete" style={{ color: "#F30B0B" }} /></a>

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

        // getEstatusEquipoListado();
        getDispEquipoListado();

        getParadasListado();
    }, []);

    function getAllData() {
        const url = `${process.env.REACT_APP_API_URL}/Viajes/GetListado`;
        axios.get(url, { headers }).then(respuesta => {
            setData(respuesta.data)
        });
    };

    const FilterComponent = ({ filterText, onFilter, onClear }) => (
        <>
            <input
                id="search"
                type="text"
                placeholder="Filter By Name"
                aria-label="Search Input"
                value={filterText}
                onChange={handleChange} />
            <button type="button" onClick={onClear}>X</button>
        </>
    );

    const headers = {
        'Content-Type': 'application/json',
        //    'access-control-allow-origin': '*'
    }

    function DefaultColumnFilter({
        column: { filterValue, preFilteredRows, setFilter },
    }) {
        const count = preFilteredRows.length

        return (
            <input
                className="form-control"
                value={filterValue || ''}
                onChange={e => {
                    setFilter(e.target.value || undefined)
                }}
                placeholder={`Buscar ${count} registros...`}
            />
        )
    }

    function Table({ columns, data }) {

        const defaultColumn = React.useMemo(
            () => ({
                // Default Filter UI
                Filter: DefaultColumnFilter,
            }),
            []
        )

        const {
            getTableProps,
            getTableBodyProps,
            headerGroups,
            rows,
            prepareRow,
        } = useTable(
            {
                columns,
                data,
                defaultColumn
            },
            useFilters,
            useSortBy
        )

        return (
            <div className="col-md-12">

                <table className="table" {...getTableProps()}>
                    <thead>
                        {headerGroups.map(headerGroup => (
                            <tr {...headerGroup.getHeaderGroupProps()}>
                                <th>Acciones</th>
                                {headerGroup.headers.map(column => (
                                    // Add the sorting props to control sorting. For this example
                                    // we can add them into the header props
                                    <th {...column.getHeaderProps(column.getSortByToggleProps())}>
                                        {column.render()}
                                        {/* Add a sort direction indicator */}
                                        <span>
                                            {column.isSorted
                                                ? column.isSortedDesc
                                                    ? <i className="fa fa-caret-up" />
                                                    : <i className="fa fa-caret-down" />
                                                : ''}
                                        </span>
                                        <div>{column.canFilter ? column.render() : null}</div>
                                    </th>
                                ))}
                            </tr>
                        ))}
                    </thead>
                    <tbody {...getTableBodyProps()}>
                        {rows.map(
                            (row, i) => {
                                prepareRow(row);
                                return (
                                    <tr {...row.getRowProps()}
                                        onClick={handleSelectRow.bind(this, row.original.m_nIdViaje)}
                                        className={state.idViaje === row.original.m_nIdViaje ? classes.seleccionado : classes.noSeleccionado}>
                                        <td>
                                            <div>
                                                <a href="#Agregar" className="btn btn-default btn-sm" role="tab" data-toggle="tab" onClick={() => (handleShowModificar(row.original.m_nIdViaje))} className="btn btn-default btn-sm"><i className="fa fa-pencil-square-o" style={{ color: "#F9A03E" }} /></a>
                                                <a href="#Agregar" role="tab" data-toggle="tab" className="btn btn-default btn-sm" onClick={() => (handleShowConsultar(row.original.m_nIdViaje))}><i className="fa fa-eye" style={{ color: "#F9A03E" }} /></a>
                                                <a href="#" className="btn btn-default btn-sm" onClick={() => (handleEliminar(row.original.m_nIdViaje))}><i className="zmdi zmdi-delete" style={{ color: "#F30B0B" }} /></a>
                                            </div>
                                        </td>
                                        {row.cells.map(cell => {
                                            return (
                                                <td {...cell.getCellProps()}>{cell.render()}</td>
                                            )
                                        })}
                                    </tr>
                                )
                            }
                        )}
                    </tbody>
                </table>
            </div>
        )
    }

    /**DISPONIBILIDAD DE EQUIPO*/

    const columnsEquipo = [
        {
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
        },
        {
            headerName: "Unidad",
            field: "unidad",
            width: 100,
        },
        {
            headerName: "Tipo unidad",
            field: "nameTipoUnidad",
            width: 150,
        }, {
            headerName: "Estado",
            field: "nameEstatus",
            width: 150,
        }, {
            headerName: "Días",
            field: "dias",
            width: 100,
        }, {
            headerName: "Ubicación",
            field: "ubicacion",
            width: 200,
        }, {
            headerName: "Desde",
            field: "desde",
            width: 150,
        },
    ]
    const [equipoListado, setEquipoListado] = React.useState([]);
    const [equipoSelected, setEquipoSelected] = React.useState();
    const [eventOptions, setEventOptions] = React.useState({
        showDispEquipoDialog : false,
        showSalidaParadasDialog: false,
        showLlegadaParadasDialog: false
    });

    function getDispEquipoListado(){
        setEquipoListado([
            {
                id: 0,
                unidad: "JT-5545",
                idIipoUnidad: 0,
                nameTipoUnidad: "Contenedor",
                idEstatus: 1,
                nameEstatus: "Documentado",
                dias: "944.0",
                ubicacion: "Mexicali, Baja California",
                desde: "12/12/2020",
                origen: "origen 1",
            },
            {
                id: 1,
                unidad: "JT-5545",
                idIipoUnidad: 0,
                nameTipoUnidad: "Contenedor",
                idEstatus: 0,
                nameEstatus: "Documentado",
                dias: "944.0",
                ubicacion: "Mexicali, Baja California",
                desde: "12/12/2020",
                origen: "origen 2",
            },
            {
                id: 2,
                unidad: "JT-5545",
                idIipoUnidad: 0,
                nameTipoUnidad: "Contenedor",
                idEstatus: 0,
                nameEstatus: "Documentado",
                dias: "944.0",
                ubicacion: "Mexicali, Baja California",
                desde: "12/12/2020",
                origen: "origen 3"
            }
        ]);
    }

    function updateEquipoData(equipo){
        console.log("Actualizar:");
        console.log(equipo);
    }

    const showActualizarDispEquipo = (equipo) => {
        setEquipoSelected(equipo)
        setEventOptions({...eventOptions, showDispEquipoDialog: true});
    }

    const closeActualizarDispEquipo = () =>{
        setEventOptions({...eventOptions, showDispEquipoDialog: false});
    }

    /**DETALLE DE PARADAS*/

    const columnsParadas = [
        {
            headerName: "Camión",
            field: "camion",
            renderCell: (row) => {
                return (
                    <a onClick={() => showCamionDialog()}>{row.row.camion}</a>
                );
            },
            width: 100,
        },
        {
            headerName: "Operador",
            field: "operador",
            width: 150,
            renderCell: (row) => {
              return (
                  <a onClick={() => showOperadorDialog()}>{row.row.operador}</a>
              )
            },
        },
        {
            headerName: "Salida",
            field: "nameSalida",
            width: 100,
            renderCell: (row) => {
                return(
                    <a onClick={() => showSalidaDialog()}>{row.row.nameSalida}</a>
                )
            }
        },
        {
            headerName: "Fecha",
            field: "fecha_salida",
            width: 150,
        },
        {
            headerName: "Origen",
            field: "origen",
            width: 200,
        },
        {
            headerName: "Llegada",
            field: "nameLlegada",
            width: 100,
            renderCell: (row) => {
                return(
                    <a onClick={() => showLlegadaDialog()}>{row.row.nameLlegada}</a>
                    )
            }
        },
        {
            headerName: "Fecha",
            field: "fecha_llegada",
            width: 150,
        },
        {
            headerName: "Destino",
            field: "destino",
            width: 200,
        },
        {
            headerName: "Liq",
            field: "liq",
            width: 80,
        },
    ]
    const [paradasListado, setParadasListado] = React.useState([]);

    function getParadasListado(){
        setParadasListado([
            {
                id: 0,
                camion: "JT-55455",
                operador: "Gonzalez Claudio",
                idSalida: 0,
                nameSalida: "Asignar",
                fecha_salida: "12/12/2020",
                origen: "Mexicali,Baja California",
                idLlegada: "0",
                nameLlegada: "Asignar",
                fecha_llegada: "12/12/2021",
                destino: "Tijuana. Baja California",
                liq: "",
            }
        ]);
    }

    const showCamionDialog = () =>{
        console.log("Espero se haya abierto el dialogo al clickear camion");
    }

    const showOperadorDialog = () => {
        console.log("Espero que se haya abierto el dialogo al clickear operador");
    }

    const showSalidaDialog = () => {
        setEventOptions({...eventOptions, showSalidaParadasDialog: true});
    }

    const closeSalidaDialog = () =>{
        setEventOptions({...eventOptions, showSalidaParadasDialog: false});
    }

    const showLlegadaDialog = () => {
        setEventOptions({...eventOptions, showLlegadaParadasDialog: true});
    }

    const closeLlegadaDialog = () =>{
        setEventOptions({...eventOptions, showLlegadaParadasDialog: false});
    }

    function updateSalida(data) {
        console.log("Actualizar datos da salida");
        console.log(data);
    }

    function updateLlegada(data) {
        console.log("Actualizar datos da llegada");
        console.log(data);
    }

    return (
        <div >
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
                            <Button variant={'outlined'} color={'primary'} onClick={closeActualizarDispEquipo}>Cancelar</Button>
                        </DialogActions>
                    </ActualizarDiponibilidadEquipo>
                </DialogContent>
            </Dialog>
            <Dialog open={eventOptions.showSalidaParadasDialog}
                    onClose={closeSalidaDialog}
                    fullWidth={true}
                    maxWidth={'xl'}>
                <DialogTitle>Salida de Paradas</DialogTitle>
                <DialogContent>
                    <SalidaParadas onSubmit={updateSalida}>
                        <DialogActions>
                            <Button
                                variant={'contained'} color={'primary'}
                                type="submit"
                                onClick={closeSalidaDialog}>Aceptar</Button>
                            <Button variant={'outlined'} color={'primary'} onClick={closeSalidaDialog}>Cancelar</Button>
                        </DialogActions>
                    </SalidaParadas>
                </DialogContent>
            </Dialog>
            <Dialog open={eventOptions.showLlegadaParadasDialog}
                    onClose={closeLlegadaDialog}
                    fullWidth={true}
                    maxWidth={'xl'}>
                <DialogTitle>Llegada de Paradas</DialogTitle>
                <DialogContent>
                    <LlegadaParadas onSubmit={updateLlegada}>
                        <DialogActions>
                            <Button
                                variant={'contained'} color={'primary'}
                                type="submit"
                                onClick={closeLlegadaDialog}>Aceptar</Button>
                            <Button variant={'outlined'} color={'primary'} onClick={closeLlegadaDialog}>Cancelar</Button>
                        </DialogActions>
                    </LlegadaParadas>
                </DialogContent>
            </Dialog>
            <header className="topbar clearfix">
                <Cabecera titulo="Viajes" >
                    <div className="page-header">
                        <ul className="list-page-breadcrumb">
                            <li>
                                <a href="/Catalogos" className="color-mapeo">
                                    Catálogos <i className="zmdi zmdi-chevron-right" />
                                </a>
                            </li>
                            <li className="active-page">Viajes</li>
                        </ul>
                    </div>
                </Cabecera>
            </header>

            {/*Leftbar Start Here*/}
            <aside className="iconic-leftbar">
                <BarraLateralIzquierda />
            </aside>
            {/*Leftbar End Here*/}

            {/*Page Container Start Here*/}
            <section className="main-container">

                <div className="container-fluid">

                    <ul className="nav navStatica nav-tabs">
                        <li className="active">
                            <a data-toggle="tab" href="#Listado">
                                <i className="fa fa-list" /> Listado
                            </a>
                        </li>
                        <li>
                            <a data-toggle="tab" href="#Agregar" onClick={handleShowAgregar}>
                                <i className="fa fa-plus-circle" /> {state.agregar}
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
                                <i className="fa fa-print" /> Imprimir
                            </a>
                        </li>

                    </ul>

                    <div className="row" className="tab-content">
                        <div className="widget-wrap" id="Listado" className="tab-pane fade in active">
                            <div className="widget-wrap">
                                <div className="widget-content">

                                    <div className="row" style={{ paddingLeft: "8px" }}>
                                        <form className="j-forms">
                                            <div className="row" style={{ display: "flex" }}>
                                                <div className="col-sm-6 col-md-2 " style={{ paddingLeft: "0px" }}>
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

                                                <div className="col-sm-6 col-md-2 " style={{ paddingLeft: "0px" }}>
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

                                                <div className="col-sm-6 col-md-2 " style={{ paddingLeft: "0px" }}>
                                                    <label className="input select">
                                                        <FormControl fullWidth variant="outlined" margin="dense">
                                                            <InputLabel id="idSucursalAgregarLabel">Sucursal</InputLabel>
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

                                                <div className="col-sm-6 col-md-3 " style={{ paddingLeft: "0px" }}>
                                                    <label className="input select">
                                                        <FormControl fullWidth variant="outlined" margin="dense">
                                                            <InputLabel id="idEstatusViajeLabel">Estatus Viaje</InputLabel>
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
                                                                        {estatus.m_sDescripcion}
                                                                    </option>
                                                                ))}
                                                            </Select>
                                                        </FormControl>
                                                    </label>
                                                </div>

                                                <div className="col-sm-6 col-md-3 " style={{ paddingLeft: "0px" }}>
                                                    <label className="input select">
                                                        <FormControl fullWidth variant="outlined" margin="dense">
                                                            <InputLabel id="idEstatusDocumentoLabel">Estatus Documento</InputLabel>
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

                                    <div className="row" style={{ height: state.height - 250, width: '100%' }}>
                                        {data.length != 0 ? (
                                            <DataGrid
                                                localeText={dataGridLocaleText}
                                                rows={data}
                                                columns={columns}
                                                density="compact"
                                                pageSize={Math.floor((state.height - 310) / 30)}
                                                getRowId={(row) => row.m_nIdViaje}
                                                onRowSelected={(row) => {
                                                    setState({
                                                        ...state,
                                                        idViaje: row.data.m_nIdViaje
                                                    })
                                                }}
                                            />
                                        ) : (
                                            <div>No se encontró ningún registro</div>
                                        )}
                                    </div>
                                </div>
                            </div>
                            <div className="row">
                                <div className="col-md-6">
                                    <label className="label" style={{ color: '#717171' }}>Disponibilidad del Equipo</label>
                                    <div className="widget-wrap">
                                        <div className="widget-content">
                                            <div className="row" style={{ height: state.height - 250, width: '100%' }}>
                                                {equipoListado.length !== 0 ? (
                                                  <DataGrid
                                                    rows={equipoListado}
                                                    columns={columnsEquipo}
                                                    density="compact"
                                                    pageSize={ Math.floor((state.height - 310)/30)}
                                                    getRowId={(row) => row.m_nIdEquipo}
                                                    onRowSelected={(row) => {
                                                      setState({
                                                        ...state,
                                                        idEquipo: row.data.m_nIdEquipo
                                                      })
                                                    }}
                                                  />
                                                ) : (
                                                  <div>No se encontró ningún registro</div>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="col-md-6">
                                    <label className="label" style={{ color: '#717171' }} >Detalle de Paradas</label>
                                    <div className="widget-wrap">
                                        <div className="widget-content">
                                            <div className="row" style={{ height: state.height - 250, width: '100%' }}>
                                                {paradasListado.length !== 0 ? (
                                                  <DataGrid
                                                    rows={paradasListado}
                                                    columns={columnsParadas}
                                                    density="compact"
                                                    pageSize={ Math.floor((state.height - 310)/30)}
                                                    // getRowId={(row) => row.m_nIdDepartamento}
                                                    // onRowSelected={(row) => {
                                                    //   setState({
                                                    //     ...state,
                                                    //       idViaje: row.data.m_nIdDepartamento
                                                    //   })
                                                    // }}
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

                            <AgregarViaje />

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
                                                    <button className="btn btn-default btn-block ex-noty" data-layout="topCenter" data-type="information">Notificación</button>
                                                    <button data-layout="topCenter" data-type="information" className="btn btn-secondary secondary-btn"> Cancelar</button>
                                                    <button onClick={handleAceptar} className="btn btn-primary primary-btn">Aceptar</button>
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
                <BarraLateralDerecha />
            </aside>

        </div>

    );
}

export default Viajes;
