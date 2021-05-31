import React, { useEffect, useState, useMemo } from "react";
import axios from "axios";
import Cabecera from "../Components/Template/Cabecera";
import BarraLateralIzquierda from "../Components/Template/BarraLateralIzquierda";
import BarraLateralDerecha from "../Components/Template/BarraLateralDerecha";
import BasicTable from "./BasicTable";
import ExportCSV from '../Components/Template/Export';
import ExportPDF from "../Components/Template/ExportPDF";
import * as XLSX from 'xlsx';
import { makeStyles } from "@material-ui/core/styles";
import { DataGrid } from '@material-ui/data-grid';
import SvgIcon from "@material-ui/core/SvgIcon";
import { ReactComponent as ActivoIcon } from '../iconos/Menu/palomita.svg';
import { ReactComponent as NoActivoIcon } from '../iconos/Menu/cruz.svg';
import Noty from 'noty';
import IPut from 'iput';
import { dataGridLocaleText } from "../Constants";
import { FormControl, InputLabel, Select, TextField, Tooltip } from "@material-ui/core";
import { eliminarUsuarios, modificarUsuarios, obtenerUsuarios, obtenerUsuariosId, validarPermisos } from "../Util/Contexts/UsuarioContext";
import { agregarUnidades } from "../Util/Contexts/UnidadesContext";
import Derechos from "./Usuarios/Derechos";
import CopiarDerechos from "./Usuarios/CopiarDerechos";

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
    },
    disabled: {
        pointerEvents: "none",
        cursor: "default",
    }
};
const useStyles = makeStyles(styles);

function Usuarios() {

    const classes = useStyles();
    const [data, setData] = React.useState([])
    const [state, setState] = React.useState({
        DerechoBorrar: 58, //TODO: Definir id
        agregar: "Agregar",
        idUsuario: 0,
        idSucursal: 0,
        usuario: "",
        activo: false,
        nombreUsuario: "",
        apellidoPaternoUsuario: "",
        apellidoMaternoUsuario: "",
        password: "",
        confirmarPassword: "",
        correoElectronico: "",
        idTipoUsuario: 0,
        filtrarPorIP: false,
        ip: "",
        filtrarPorDiaHora: false,
        lunes: false,
        martes: false,
        miercoles: false,
        jueves: false,
        viernes: false,
        sabado: false,
        domingo: false,
        hora0: false,
        hora1: false,
        hora2: false,
        hora3: false,
        hora4: false,
        hora5: false,
        hora6: false,
        hora7: false,
        hora8: false,
        hora9: false,
        hora10: false,
        hora11: false,
        hora12: false,
        hora13: false,
        hora14: false,
        hora15: false,
        hora16: false,
        hora17: false,
        hora18: false,
        hora19: false,
        hora20: false,
        hora21: false,
        hora22: false,
        hora23: false,
        vencimientoCertificado: false,
        fotoPerfil: [],
        CreadoPor: localStorage.getItem("UsuarioId"),
        ModificadoPor: localStorage.getItem("UsuarioId"),
        height: window.innerHeight
    })
    const [dataSucursal, setDataSucursal] = React.useState([]);
    const [fileUploaded, setFileUploaded] = React.useState([])
    const [selectedFile, setSelectedFile] = useState();
    const [isFilePicked, setIsFilePicked] = useState(false);

    const handleAceptar = (e) => {
        e.preventDefault()
        console.log(state.CreadoPor)
        console.log(localStorage.getItem("UsuarioId"))
        var params = {

            "Usuario": state.usuario,
            "Nombre": state.nombreUsuario,
            "APaterno": state.apellidoPaternoUsuario,
            "AMaterno": state.apellidoMaternoUsuario,
            "Contrasena": state.password,
            "TipoUsuario": state.idTipoUsuario,
            "CorreoElectronico": state.correoElectronico,
            "IdSucursal": state.idSucursal,
            "Activo": state.activo,
            "FiltrarAccesoIP": state.filtrarPorIP,
            "FiltrarAccesoHora": state.filtrarPorDiaHora,

            "Lunes": state.lunes,
            "Martes": state.martes,
            "Miercoles": state.miercoles,
            "Jueves": state.jueves,
            "Viernes": state.viernes,
            "Sabado": state.sabado,
            "Domingo": state.domingo,

            "Hora0": state.hora0,
            "Hora1": state.hora1,
            "Hora2": state.hora2,
            "Hora3": state.hora3,
            "Hora4": state.hora4,
            "Hora5": state.hora5,
            "Hora6": state.hora6,
            "Hora7": state.hora7,
            "Hora8": state.hora8,
            "Hora9": state.hora9,
            "Hora10": state.hora10,
            "Hora11": state.hora11,
            "Hora12": state.hora12,
            "Hora13": state.hora13,
            "Hora14": state.hora14,
            "Hora15": state.hora15,
            "Hora16": state.hora16,
            "Hora17": state.hora17,
            "Hora18": state.hora18,
            "Hora19": state.hora19,
            "Hora20": state.hora20,
            "Hora21": state.hora21,
            "Hora22": state.hora22,
            "Hora23": state.hora23,

            "VencimientoCertificadoNotificaciones": state.vencimientoCertificado,

            "CreadoPor": localStorage.getItem("UsuarioId"),
            "ModificadoPor": localStorage.getItem("UsuarioId")
        }
        if (state.idUsuario != 0) {
            modificarUsuarios(state.idUsuario, params).then(respuesta => {
                showSuccess(respuesta.data)
                getAllData()
            }).catch(err => {
                console.log(err)
                showSuccess("err")
            });
        } else {
            agregarUnidades(params).then(respuesta => {
                showSuccess(respuesta.data)
                getAllData()
            }).catch(err => {
                console.log(err)
                showSuccess(err)
            });
        }

    }

    function handleEliminar(id) {
        var derecho;
        validarPermisos(state).then(respuesta => {
            derecho = respuesta.data;
            if (derecho == false) {
                showSuccess("El usuario no tiene derechos para realizar el proceso");
                return;
            }

            eliminarUsuarios(id).then(respuesta => {
                console.log(respuesta);
                getAllData();
            }).catch(err => {
                showSuccess(err)
            });
        }).catch(err => {
            showSuccess(err)
        });
    }

    function handleShowModificar(id) {
        obtenerUsuariosId(id).then(respuesta => {
            console.log(respuesta.data)
            setState({
                ...state,
                agregar: "Modificar",
                idUsuario: id,
                usuario: respuesta.data.m_sUsuario,
                nombreUsuario: respuesta.data.m_sNombre,
                apellidoPaternoUsuario: respuesta.data.m_sAPaterno,
                apellidoMaternoUsuario: respuesta.data.m_sAMaterno,
                password: respuesta.data.m_sContrasena,
                idTipoUsuario: respuesta.data.m_nTipoUsuario,
                correoElectronico: respuesta.data.m_sCorreoElectronico,
                idSucursal: respuesta.data.m_nIdSucursal,
                activo: respuesta.data.m_bActivo,
                filtrarPorIP: respuesta.data.m_sFiltrarAccesoIP,
                filtrarPorDiaHora: respuesta.data.m_bFiltrarAccesoHora,

                hora0: respuesta.data.m_bHora0,
                hora1: respuesta.data.m_bHora1,
                hora2: respuesta.data.m_bHora2,
                hora3: respuesta.data.m_bHora3,
                hora4: respuesta.data.m_bHora4,
                hora5: respuesta.data.m_bHora5,
                hora6: respuesta.data.m_bHora6,
                hora7: respuesta.data.m_bHora7,
                hora8: respuesta.data.m_bHora8,
                hora9: respuesta.data.m_bHora9,
                hora10: respuesta.data.m_bHora10,
                hora11: respuesta.data.m_bHora11,
                hora12: respuesta.data.m_bHora12,
                hora13: respuesta.data.m_bHora13,
                hora14: respuesta.data.m_bHora14,
                hora15: respuesta.data.m_bHora15,
                hora16: respuesta.data.m_bHora16,
                hora17: respuesta.data.m_bHora17,
                hora18: respuesta.data.m_bHora18,
                hora19: respuesta.data.m_bHora19,
                hora20: respuesta.data.m_bHora20,
                hora21: respuesta.data.m_bHora21,
                hora22: respuesta.data.m_bHora22,
                hora23: respuesta.data.m_bHora23,

                lunes: respuesta.data.m_bLunes,
                martes: respuesta.data.m_bMartes,
                miercoles: respuesta.data.m_bMiercoles,
                jueves: respuesta.data.m_bJueves,
                viernes: respuesta.data.m_bViernes,
                sabado: respuesta.data.m_bSabado,
                domingo: respuesta.data.m_bDomingo,

                vencimientoCertificado: respuesta.data.m_bVencimientoCertificadoNotificaciones

            })
        });
    }

    function handleShowConsultar(id) {
        obtenerUsuariosId(id).then(respuesta => {
            console.log(respuesta.data)
            setState({
                ...state,
                agregar: "Consultar",
                idUsuario: id,
                usuario: respuesta.data.m_sUsuario,
                nombreUsuario: respuesta.data.m_sNombre,
                apellidoPaternoUsuario: respuesta.data.m_sAPaterno,
                apellidoMaternoUsuario: respuesta.data.m_sAMaterno,
                password: respuesta.data.m_sContrasena,
                idTipoUsuario: respuesta.data.m_nTipoUsuario,
                correoElectronico: respuesta.data.m_sCorreoElectronico,
                idSucursal: respuesta.data.m_nIdSucursal,
                activo: respuesta.data.m_bActivo,
                filtrarPorIP: respuesta.data.m_sFiltrarAccesoIP,
                ip: respuesta.data.m_sFiltrarAccesoIP,
                filtrarPorDiaHora: respuesta.data.m_bFiltrarAccesoHora,

                hora0: respuesta.data.m_bHora0,
                hora1: respuesta.data.m_bHora1,
                hora2: respuesta.data.m_bHora2,
                hora3: respuesta.data.m_bHora3,
                hora4: respuesta.data.m_bHora4,
                hora5: respuesta.data.m_bHora5,
                hora6: respuesta.data.m_bHora6,
                hora7: respuesta.data.m_bHora7,
                hora8: respuesta.data.m_bHora8,
                hora9: respuesta.data.m_bHora9,
                hora10: respuesta.data.m_bHora10,
                hora11: respuesta.data.m_bHora11,
                hora12: respuesta.data.m_bHora12,
                hora13: respuesta.data.m_bHora13,
                hora14: respuesta.data.m_bHora14,
                hora15: respuesta.data.m_bHora15,
                hora16: respuesta.data.m_bHora16,
                hora17: respuesta.data.m_bHora17,
                hora18: respuesta.data.m_bHora18,
                hora19: respuesta.data.m_bHora19,
                hora20: respuesta.data.m_bHora20,
                hora21: respuesta.data.m_bHora21,
                hora22: respuesta.data.m_bHora22,
                hora23: respuesta.data.m_bHora23,

                lunes: respuesta.data.m_bLunes,
                martes: respuesta.data.m_bMartes,
                miercoles: respuesta.data.m_bMiercoles,
                jueves: respuesta.data.m_bJueves,
                viernes: respuesta.data.m_bViernes,
                sabado: respuesta.data.m_bSabado,
                domingo: respuesta.data.m_bDomingo,

                vencimientoCertificado: respuesta.data.m_bVencimientoCertificadoNotificaciones
            })
        });
    }

    function handleShowAgregar() {
        setState({
            ...state,
            agregar: "Agregar",
            idUsuario: 0,
            idSucursal: 0,
            usuario: "",
            activo: false,
            nombreUsuario: "",
            apellidoPaternoUsuario: "",
            apellidoMaternoUsuario: "",
            password: "",
            confirmarPassword: "",
            correoElectronico: "",
            idTipoUsuario: 0,
            filtrarPorIP: false,
            ip: "",
            filtrarPorDiaHora: false,
            lunes: false,
            martes: false,
            miercoles: false,
            jueves: false,
            viernes: false,
            sabado: false,
            domingo: false,
            hora0: false,
            hora1: false,
            hora2: false,
            hora3: false,
            hora4: false,
            hora5: false,
            hora6: false,
            hora7: false,
            hora8: false,
            hora9: false,
            hora10: false,
            hora11: false,
            hora12: false,
            hora13: false,
            hora14: false,
            hora15: false,
            hora16: false,
            hora17: false,
            hora18: false,
            hora19: false,
            hora20: false,
            hora21: false,
            hora22: false,
            hora23: false,
        })
    }

    const handleChange = event => {
        console.log(event.target.id + " : " + event.target.value)
        setState({
            ...state,
            [event.target.id]: event.target.value
        });
    };

    const columns = React.useMemo(() => [
        {
            headerName: "Acciones",
            sortable: false, filterable: false,
            field: "",
            renderCell: (row) => {
                return (
                    <div>
                        <Tooltip title="Modificar">
                            <a href="#Agregar" role="tab" data-toggle="tab" onClick={() => (handleShowModificar(row.row.m_nIdUsuario))} className="btn btn-default btn-xs"><i className="fa fa-pencil-square-o" style={{ color: "#F9A03E" }} /></a>

                        </Tooltip>
                        <Tooltip title="Consultar">
                            <a href="#Agregar" role="tab" data-toggle="tab" className="btn btn-default btn-xs" onClick={() => (handleShowConsultar(row.row.m_nIdUsuario))}><i className="fa fa-eye" style={{ color: "#F9A03E" }} /></a>

                        </Tooltip>
                        <Tooltip title="Eliminar">
                            <a href="#" className="btn btn-default btn-xs" onClick={() => (handleEliminar(row.row.m_nIdUsuario))}><i className="zmdi zmdi-delete" style={{ color: "#F30B0B" }} /></a>

                        </Tooltip>
                    </div>
                )
            }
        },
        {
            headerName: "Usuario",
            field: "m_sUsuario",
            width: 125,
        }, {
            headerName: "Nombre",
            field: "m_sNombre",
            width: 200,
        }, {
            headerName: "Tipo Usuario",
            field: "m_nTipoUsuario",
            width: 150,
        },
        {
            headerName: "Sucursal",
            field: "m_nIdSucursal",
            width: 150,
            renderCell: (row) => {
                return (
                    <div style={{ width: "100%" }}>
                        { dataSucursal.length != 0 ? dataSucursal.find(o => o.m_nIdSucursal == row.row.m_nIdSucursal).m_sSucursal : ""}
                    </div>
                )
            }
        }, {
            headerName: "Creado El",
            field: "m_sCreadoEl",
            width: 200,
        }, {
            headerName: "Creado Por",
            field: "m_sCreadoPor",
            width: 125,
        }, {
            headerName: "Modificado El",
            field: "m_sModificadoEl",
            width: 200,
        }, {
            headerName: "Modificado Por",
            field: "m_sModificadoPor",
            width: 150,
        }, {
            headerName: "Activo",
            field: "m_bActivo",
            width: 150,
            renderCell: (row) => {
                return (
                    <div style={{ width: "100%", textAlign: "center", color: row.row.m_bActivo ? "green" : "red" }}>
                        {row.row.m_bActivo ?
                            <SvgIcon
                                component={ActivoIcon}
                            /> :
                            <SvgIcon
                                component={NoActivoIcon}
                            />
                        }
                    </div>
                )
            }
        }

    ]);

    useEffect(value => {
        if (localStorage.getItem("UsuarioId") === null || localStorage.getItem("UsuarioId") <= 0) {
            showSuccess("Es necesario iniciar sesion para acceder a este proceso");
            window.location.replace("login");
            return;
        }
        getAllSucursalData();
        getAllData();
    }, []);

    async function getAllData() {
        obtenerUsuarios().then(respuesta => {
            setData(respuesta.data)
        });
    };

    async function getAllSucursalData() {
        const url = `${process.env.REACT_APP_API_URL}/Sucursales/GetListado`;
        await axios.get(url, { headers }).then((respuesta) => {
            setDataSucursal(respuesta.data);
        });
    }

    const handleUpload = (e) => {
        e.preventDefault();

        var files = e.target.files, f = files[0];
        var reader = new FileReader();
        console.log(e.target.files)
        reader.onload = function (e) {
            console.log("Nothing Happened")
            var data = e.target.result;
            let readedData = XLSX.read(data, { type: 'binary' });
            const wsname = readedData.SheetNames[0];
            const ws = readedData.Sheets[wsname];

            /* Convert array to json*/
            const dataParse = XLSX.utils.sheet_to_json(ws, { header: 1 });
            console.log("dataParse : " + dataParse)
            setFileUploaded(dataParse);
        };
        reader.readAsBinaryString(f)
    }

    const headers = {
        'Content-Type': 'application/json',
        //    'access-control-allow-origin': '*'
    }

    const onChangeFile = (event) => {
        console.log(event.target.files[0])
        var file = event.target.files[0];
        var reader = new FileReader();
        var url = reader.readAsDataURL(file);
        console.log(file)
        reader.onloadend = function (e) {
            setState({
                ...setState,
                fotoPerfil: reader.result
            })
        }.bind(this);
        console.log(url) // Would see a path?
        // TODO: concat files
    };

    return (
        <div >

            <header className="topbar clearfix">
                <Cabecera titulo="Usuarios" >
                    <div className="page-header">
                        <ul className="list-page-breadcrumb">
                            <li>
                                <a href="/Catalogos" className="color-mapeo">
                                    Configuración <i className="zmdi zmdi-chevron-right" />
                                </a>
                            </li>
                            <li className="active-page">Usuarios</li>
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
                            <a data-toggle="tab" href="#Derechos" className={state.idUsuario == 0 ? classes.disabled : ""}>
                                <i className="fa fa-plus-circle" /> Derechos
                            </a>
                        </li>
                        <li>
                            <a data-toggle="tab" href="#CopiarDerechos" >
                                <i className="fa fa-plus-circle" /> Copiar Derechos
                            </a>
                        </li>
                        {/*<li>*/}
                        {/*  <a data-toggle="tab" href="#Importar">*/}
                        {/*    <i className="fa fa-upload" /> Importar*/}
                        {/*</a>*/}
                        {/*</li>*/}
                        {/*<li>*/}
                        {/*  <ExportCSV csvData={data} fileName="Departamento_Listado" />*/}
                        {/*</li>*/}
                        {/*<li>*/}
                        {/*  <ExportPDF data={data} column={columns} fileName="Departamento" />*/}
                        {/*</li>*/}
                    </ul>


                    <div className="tab-content">
                        <div id="Derechos" className="tab-pane fade">
                            <div className="widget-wrap j-forms">
                                <div className="row">
                                    <Derechos />
                                </div>
                            </div>
                        </div>
                        <div id="CopiarDerechos" className="tab-pane fade">
                            <div className="widget-wrap j-forms">
                                <div className="row">
                                    <CopiarDerechos />
                                </div>
                            </div>
                        </div>
                        <div id="Listado" className="tab-pane fade in active">
                            <div className="widget-wrap">
                                <div className="row" style={{ height: state.height - 250, width: '100%' }}>
                                    {data.length != 0 ? (
                                        <DataGrid
                                            localeText={dataGridLocaleText}
                                            rows={data}
                                            columns={columns}
                                            density="compact"
                                            pageSize={Math.floor((state.height - 310) / 30)}
                                            getRowId={(row) => row.m_nIdUsuario}
                                            onRowSelected={(row) => {
                                                setState({
                                                    ...state,
                                                    idUsuario: row.data.m_nIdUsuario
                                                })
                                            }}
                                        />
                                    ) : (
                                        <div>No se encontró ningún registro</div>
                                    )}
                                </div>
                            </div>
                        </div>

                        <div id="Agregar" className="tab-pane fade">
                            <div className="widget-wrap" style={{ paddingRight: "0px" }}>
                                <div className="widget-container">
                                    <div className="widget-content">
                                        <div className="row">
                                            <form className="j-forms" onSubmit={handleAceptar}>
                                                <div className="form-content">

                                                    <div className="row" style={{ paddingBottom: "15px" }}>

                                                        <div className="col-xs-12 col-sm-12 col-md-7 col-lg-7" style={{ paddingRight: "0px", paddingLeft: "0px" }}>

                                                            <div className="col-xs-6 col-sm-6 col-md-6 col-lg-6 unit">
                                                                <label className="input select">
                                                                    <FormControl fullWidth variant="outlined" margin="dense">
                                                                        <InputLabel id="idSucursalLabel">Sucursal</InputLabel>
                                                                        <Select
                                                                            labelId="idSucursalLabel"
                                                                            label="Sucursal"
                                                                            className="form-control"
                                                                            required
                                                                            value={state.idSucursal}
                                                                            onChange={handleChange}
                                                                            disabled={state.agregar == "Consultar"}
                                                                            id="idSucursal"
                                                                        >
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

                                                            <div className="col-xs-6 col-sm-6 col-md-6 col-lg-6 unit" >
                                                                <label className="checkbox">
                                                                    <input
                                                                        disabled={state.agregar == "Consultar"}
                                                                        native="true"
                                                                        checked={state.activo}
                                                                        name="activo"
                                                                        onChange={(e) => setState({ ...state, activo: e.target.checked })}
                                                                        type="checkbox"
                                                                    />
                                                                    <i />
                                Activa
                              </label>
                                                            </div>

                                                            <div className="col-xs-6 col-sm-6 col-md-6 col-lg-6 unit">
                                                                <div className="input">
                                                                    <TextField variant="outlined" margin="dense" label="Usuario"
                                                                        onChange={handleChange}
                                                                        className="form-control"
                                                                        type="text"
                                                                        required
                                                                        readOnly={state.agregar == "Consultar"}
                                                                        value={state.usuario}
                                                                        id="usuario"
                                                                    />
                                                                </div>
                                                            </div>

                                                            <div className="col-xs-6 col-sm-6 col-md-6 col-lg-6 unit">
                                                                <div className="input">
                                                                    <TextField variant="outlined" margin="dense" label="Nombre"
                                                                        onChange={handleChange}
                                                                        className="form-control"
                                                                        type="text"
                                                                        readOnly={state.agregar == "Consultar"}
                                                                        value={state.nombreUsuario}
                                                                        id="nombreUsuario"
                                                                    />
                                                                </div>
                                                            </div>

                                                            <div className="col-xs-6 col-sm-6 col-md-6 col-lg-6 unit">
                                                                <div className="input">
                                                                    <TextField variant="outlined" margin="dense" label="Apellido Paterno"
                                                                        onChange={handleChange}
                                                                        className="form-control"
                                                                        type="text"
                                                                        required
                                                                        readOnly={state.agregar == "Consultar"}
                                                                        value={state.apellidoPaternoUsuario}
                                                                        id="apellidoPaternoUsuario"
                                                                    />
                                                                </div>
                                                            </div>

                                                            <div className="col-xs-6 col-sm-6 col-md-6 col-lg-6 unit">
                                                                <div className="input">
                                                                    <TextField variant="outlined" margin="dense" label="Apellido Materno"
                                                                        onChange={handleChange}
                                                                        className="form-control"
                                                                        type="text"
                                                                        readOnly={state.agregar == "Consultar"}
                                                                        value={state.apellidoMaternoUsuario}
                                                                        id="apellidoMaternoUsuario"
                                                                    />
                                                                </div>
                                                            </div>

                                                            <div className="col-xs-6 col-sm-6 col-md-6 col-lg-6 unit">
                                                                <div className="input">
                                                                    <TextField variant="outlined" margin="dense" label="Contraseña"
                                                                        onChange={handleChange}
                                                                        className="form-control"
                                                                        type="password"
                                                                        required
                                                                        readOnly={state.agregar == "Consultar"}
                                                                        value={state.password}
                                                                        id="password"
                                                                    />
                                                                </div>
                                                            </div>

                                                            <div className="col-xs-6 col-sm-6 col-md-6 col-lg-6 unit">
                                                                <div className="input">
                                                                    <TextField variant="outlined" margin="dense" label="Confirmar Contraseña"
                                                                        onChange={handleChange}
                                                                        className="form-control"
                                                                        type="password"
                                                                        readOnly={state.agregar == "Consultar"}
                                                                        value={state.confirmarPassword}
                                                                        id="confirmarPassword"
                                                                    />
                                                                </div>
                                                            </div>

                                                            <div className="col-xs-6 col-sm-6 col-md-6 col-lg-6 unit">
                                                                <div className="input">
                                                                    <TextField variant="outlined" margin="dense" label="Correo Electrónico"
                                                                        onChange={handleChange}
                                                                        className="form-control"
                                                                        type="email"
                                                                        required
                                                                        readOnly={state.agregar == "Consultar"}
                                                                        value={state.correoElectronico}
                                                                        id="correoElectronico"
                                                                    />
                                                                </div>
                                                            </div>

                                                            <div className="col-xs-6 col-sm-6 col-md-6 col-lg-6 unit">
                                                                <label className="input select">
                                                                    <FormControl fullWidth variant="outlined" margin="dense">
                                                                        <InputLabel id="sucursalListadoLabel">Tipo Usuario</InputLabel>
                                                                        <Select
                                                                            labelId="sucursalListadoLabel"
                                                                            label="Tipo Usuario"
                                                                            className="form-control"
                                                                            required
                                                                            value={state.sucursalListado}
                                                                            onChange={handleChange}
                                                                            disabled={state.agregar == "Consultar"}
                                                                            id="sucursalListado"
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

                                                            <div className="col-xs-12 col-sm-12 col-md-12 col-lg-12 unit">
                                                                <label className="label">
                                                                    Foto de Perfil
                              </label>
                                                                <input
                                                                    onChange={onChangeFile}
                                                                    type="file"
                                                                    readOnly={state.agregar == "Consultar"}
                                                                    value={selectedFile}
                                                                    id="fotoPerfil"
                                                                />
                                                                <div style={{ paddingTop: "15px" }}>
                                                                    <img style={{ width: "52px", height: "52px" }} src={state.fotoPerfil} />
                                                                </div>
                                                            </div>

                                                        </div>

                                                        <div className="col-xs-12 col-sm-12 col-md-5 col-lg-5" style={{ paddingRight: "0px" }}>
                                                            <ul className="nav navStatica nav-tabs" style={{ backgroundColor: "#FFFFFF" }}>
                                                                <li className="active">
                                                                    <a data-toggle="tab" href="#SeguridadDeAcceso">
                                                                        <i className="fa fa-list" /> Seguridad de Accesos
                              </a>
                                                                </li>
                                                                <li>
                                                                    <a data-toggle="tab" href="#Notificaciones">
                                                                        <i className="fa fa-plus-circle" /> Notificaciones
                              </a>
                                                                </li>
                                                            </ul>

                                                            <div className="tab-content">

                                                                <div id="SeguridadDeAcceso" className="tab-pane fade in active">

                                                                    <div className="col-xs-6 col-sm-6 col-md-6 col-lg-6 inline-group" style={{ paddingTop: "20px", marginBottom: "15px", paddingLeft: "0px", paddingRight: "0px" }}>
                                                                        <label className="checkbox">
                                                                            <input
                                                                                disabled={state.agregar == "Consultar"}
                                                                                native="true"
                                                                                checked={state.filtrarPorIP}
                                                                                name="filtrarPorIP"
                                                                                onChange={(e) => setState({ ...state, filtrarPorIP: e.target.checked })}
                                                                                type="checkbox"
                                                                            />
                                                                            <i />
                                      Filtrar Acceso por IP
                                    </label>
                                                                    </div>

                                                                    <div style={{ paddingTop: "20px", marginBottom: "15px" }}>
                                                                        <IPut
                                                                            className={state.filtrarPorIP ? "" : classes.disabled}
                                                                            onChange={(e) => {
                                                                                console.log(e)
                                                                                setState({ ...state, ip: e })
                                                                            }}
                                                                            value={state.ip}
                                                                        />
                                                                    </div>

                                                                    <div className="col-xs-12 col-sm-12 col-md-12 col-lg-12" style={{ paddingLeft: "0px", paddingRight: "0px" }}>
                                                                        <label className="checkbox">
                                                                            <input
                                                                                disabled={state.agregar == "Consultar"}
                                                                                native="true"
                                                                                checked={state.filtrarPorDiaHora}
                                                                                name="filtrarPorDiaHora"
                                                                                onChange={(e) => setState({ ...state, filtrarPorDiaHora: e.target.checked })}
                                                                                type="checkbox"
                                                                            />
                                                                            <i />
                                      Filtrar Acceso por Día y Hora
                                    </label>
                                                                    </div>

                                                                    <div className="col-xs-12 col-sm-12 col-md-12 col-lg-12" style={{ paddingLeft: "0px", paddingRight: "0px" }}>
                                                                        <h2>Días</h2>
                                                                        <div id="dia" className={state.filtrarPorDiaHora ? "" : classes.disabled} style={{ display: "flex" }}>

                                                                            <label className="checkbox" style={{ marginRight: "5px" }}>
                                                                                <input
                                                                                    disabled={state.agregar == "Consultar"}
                                                                                    native="true"
                                                                                    checked={state.lunes}
                                                                                    name="lunes"
                                                                                    onChange={(e) => setState({ ...state, lunes: e.target.checked })}
                                                                                    type="checkbox"
                                                                                />
                                                                                <i />
                                        Lun
                                      </label>

                                                                            <label className="checkbox" style={{ marginRight: "5px" }}>
                                                                                <input
                                                                                    disabled={state.agregar == "Consultar"}
                                                                                    native="true"
                                                                                    checked={state.martes}
                                                                                    name="martes"
                                                                                    onChange={(e) => setState({ ...state, martes: e.target.checked })}
                                                                                    type="checkbox"
                                                                                />
                                                                                <i />
                                        Mar
                                      </label>

                                                                            <label className="checkbox" style={{ marginRight: "5px" }}>
                                                                                <input
                                                                                    disabled={state.agregar == "Consultar"}
                                                                                    native="true"
                                                                                    checked={state.miercoles}
                                                                                    name="miercoles"
                                                                                    onChange={(e) => setState({ ...state, miercoles: e.target.checked })}
                                                                                    type="checkbox"
                                                                                />
                                                                                <i />
                                        Mier
                                      </label>

                                                                            <label className="checkbox" style={{ marginRight: "5px" }}>
                                                                                <input
                                                                                    disabled={state.agregar == "Consultar"}
                                                                                    native="true"
                                                                                    checked={state.jueves}
                                                                                    name="jueves"
                                                                                    onChange={(e) => setState({ ...state, jueves: e.target.checked })}
                                                                                    type="checkbox"
                                                                                />
                                                                                <i />
                                        Jue
                                      </label>

                                                                            <label className="checkbox" style={{ marginRight: "5px" }}>
                                                                                <input
                                                                                    disabled={state.agregar == "Consultar"}
                                                                                    native="true"
                                                                                    checked={state.viernes}
                                                                                    name="viernes"
                                                                                    onChange={(e) => setState({ ...state, viernes: e.target.checked })}
                                                                                    type="checkbox"
                                                                                />
                                                                                <i />
                                        Vie
                                        </label>

                                                                            <label className="checkbox" style={{ marginRight: "5px" }}>
                                                                                <input
                                                                                    disabled={state.agregar == "Consultar"}
                                                                                    native="true"
                                                                                    checked={state.sabado}
                                                                                    name="sabado"
                                                                                    onChange={(e) => setState({ ...state, sabado: e.target.checked })}
                                                                                    type="checkbox"
                                                                                />
                                                                                <i />
                                        Sab
                                      </label>

                                                                            <label className="checkbox" style={{ marginRight: "5px" }}>
                                                                                <input
                                                                                    disabled={state.agregar == "Consultar"}
                                                                                    native="true"
                                                                                    checked={state.domingo}
                                                                                    name="domingo"
                                                                                    onChange={(e) => setState({ ...state, domingo: e.target.checked })}
                                                                                    type="checkbox"
                                                                                />
                                                                                <i />
                                        Dom
                                      </label>

                                                                        </div>
                                                                    </div>

                                                                    <div className="col-xs-12 col-sm-12 col-md-12 col-lg-12" style={{ paddingLeft: "0px", paddingRight: "0px" }}>
                                                                        <h2>Horas</h2>
                                                                        <div id="hora" className={state.filtrarPorDiaHora ? "" : classes.disabled} style={{ display: "flex" }}>

                                                                            <div style={{ width: "25%" }}>

                                                                                <label className="checkbox" style={{ marginRight: "5px" }}>
                                                                                    <input
                                                                                        disabled={state.agregar == "Consultar"}
                                                                                        native="true"
                                                                                        checked={state.hora0}
                                                                                        name="hora0"
                                                                                        onChange={(e) => setState({ ...state, hora0: e.target.checked })}
                                                                                        type="checkbox"
                                                                                    />
                                                                                    <i />
                                          0:00 - 0:59
                                        </label>

                                                                                <label className="checkbox" style={{ marginRight: "5px" }}>
                                                                                    <input
                                                                                        disabled={state.agregar == "Consultar"}
                                                                                        native="true"
                                                                                        checked={state.hora1}
                                                                                        name="hora1"
                                                                                        onChange={(e) => setState({ ...state, hora1: e.target.checked })}
                                                                                        type="checkbox"
                                                                                    />
                                                                                    <i />
                                        1:00 - 1:59
                                        </label>

                                                                                <label className="checkbox" style={{ marginRight: "5px" }}>
                                                                                    <input
                                                                                        disabled={state.agregar == "Consultar"}
                                                                                        native="true"
                                                                                        checked={state.hora2}
                                                                                        name="hora2"
                                                                                        onChange={(e) => setState({ ...state, hora2: e.target.checked })}
                                                                                        type="checkbox"
                                                                                    />
                                                                                    <i />
                                        2:00 - 2:59
                                        </label>

                                                                                <label className="checkbox" style={{ marginRight: "5px" }}>
                                                                                    <input
                                                                                        disabled={state.agregar == "Consultar"}
                                                                                        native="true"
                                                                                        checked={state.hora3}
                                                                                        name="hora3"
                                                                                        onChange={(e) => setState({ ...state, hora3: e.target.checked })}
                                                                                        type="checkbox"
                                                                                    />
                                                                                    <i />
                                          3:00 - 3:59
                                        </label>

                                                                                <label className="checkbox" style={{ marginRight: "5px" }}>
                                                                                    <input
                                                                                        disabled={state.agregar == "Consultar"}
                                                                                        native="true"
                                                                                        checked={state.hora4}
                                                                                        name="hora4"
                                                                                        onChange={(e) => setState({ ...state, hora4: e.target.checked })}
                                                                                        type="checkbox"
                                                                                    />
                                                                                    <i />
                                          4:00 - 4:59
                                        </label>

                                                                                <label className="checkbox" style={{ marginRight: "5px" }}>
                                                                                    <input
                                                                                        disabled={state.agregar == "Consultar"}
                                                                                        native="true"
                                                                                        checked={state.hora5}
                                                                                        name="hora5"
                                                                                        onChange={(e) => setState({ ...state, hora5: e.target.checked })}
                                                                                        type="checkbox"
                                                                                    />
                                                                                    <i />
                                          5:00 - 5:59
                                        </label>

                                                                            </div>

                                                                            <div style={{ width: "25%" }}>

                                                                                <label className="checkbox" style={{ marginRight: "5px" }}>
                                                                                    <input
                                                                                        disabled={state.agregar == "Consultar"}
                                                                                        native="true"
                                                                                        checked={state.hora6}
                                                                                        name="hora6"
                                                                                        onChange={(e) => setState({ ...state, hora6: e.target.checked })}
                                                                                        type="checkbox"
                                                                                    />
                                                                                    <i />
                                          6:00 - 6:59
                                        </label>

                                                                                <label className="checkbox" style={{ marginRight: "5px" }}>
                                                                                    <input
                                                                                        disabled={state.agregar == "Consultar"}
                                                                                        native="true"
                                                                                        checked={state.hora7}
                                                                                        name="hora7"
                                                                                        onChange={(e) => setState({ ...state, hora7: e.target.checked })}
                                                                                        type="checkbox"
                                                                                    />
                                                                                    <i />
                                          7:00 - 7:59
                                        </label>

                                                                                <label className="checkbox" style={{ marginRight: "5px" }}>
                                                                                    <input
                                                                                        disabled={state.agregar == "Consultar"}
                                                                                        native="true"
                                                                                        checked={state.hora8}
                                                                                        name="hora8"
                                                                                        onChange={(e) => setState({ ...state, hora8: e.target.checked })}
                                                                                        type="checkbox"
                                                                                    />
                                                                                    <i />
                                          8:00 - 8:59
                                        </label>

                                                                                <label className="checkbox" style={{ marginRight: "5px" }}>
                                                                                    <input
                                                                                        disabled={state.agregar == "Consultar"}
                                                                                        native="true"
                                                                                        checked={state.hora9}
                                                                                        name="hora9"
                                                                                        onChange={(e) => setState({ ...state, hora9: e.target.checked })}
                                                                                        type="checkbox"
                                                                                    />
                                                                                    <i />
                                          9:00 - 9:59
                                        </label>

                                                                                <label className="checkbox" style={{ marginRight: "5px" }}>
                                                                                    <input
                                                                                        disabled={state.agregar == "Consultar"}
                                                                                        native="true"
                                                                                        checked={state.hora10}
                                                                                        name="hora10"
                                                                                        onChange={(e) => setState({ ...state, hora10: e.target.checked })}
                                                                                        type="checkbox"
                                                                                    />
                                                                                    <i />
                                          10:00 - 10:59
                                        </label>

                                                                                <label className="checkbox" style={{ marginRight: "5px" }}>
                                                                                    <input
                                                                                        disabled={state.agregar == "Consultar"}
                                                                                        native="true"
                                                                                        checked={state.hora11}
                                                                                        name="hora11"
                                                                                        onChange={(e) => setState({ ...state, hora11: e.target.checked })}
                                                                                        type="checkbox"
                                                                                    />
                                                                                    <i />
                                          11:00 - 11:59
                                        </label>

                                                                            </div>

                                                                            <div style={{ width: "25%" }}>

                                                                                <label className="checkbox" style={{ marginRight: "5px" }}>
                                                                                    <input
                                                                                        disabled={state.agregar == "Consultar"}
                                                                                        native="true"
                                                                                        checked={state.hora12}
                                                                                        name="hora12"
                                                                                        onChange={(e) => setState({ ...state, hora12: e.target.checked })}
                                                                                        type="checkbox"
                                                                                    />
                                                                                    <i />
                                          12:00 - 12:59
                                        </label>

                                                                                <label className="checkbox" style={{ marginRight: "5px" }}>
                                                                                    <input
                                                                                        disabled={state.agregar == "Consultar"}
                                                                                        native="true"
                                                                                        checked={state.hora13}
                                                                                        name="hora13"
                                                                                        onChange={(e) => setState({ ...state, hora13: e.target.checked })}
                                                                                        type="checkbox"
                                                                                    />
                                                                                    <i />
                                          13:00 - 13:59
                                        </label>

                                                                                <label className="checkbox" style={{ marginRight: "5px" }}>
                                                                                    <input
                                                                                        disabled={state.agregar == "Consultar"}
                                                                                        native="true"
                                                                                        checked={state.hora14}
                                                                                        name="hora14"
                                                                                        onChange={(e) => setState({ ...state, hora14: e.target.checked })}
                                                                                        type="checkbox"
                                                                                    />
                                                                                    <i />
                                          14:00 - 14:59
                                        </label>

                                                                                <label className="checkbox" style={{ marginRight: "5px" }}>
                                                                                    <input
                                                                                        disabled={state.agregar == "Consultar"}
                                                                                        native="true"
                                                                                        checked={state.hora15}
                                                                                        name="hora15"
                                                                                        onChange={(e) => setState({ ...state, hora15: e.target.checked })}
                                                                                        type="checkbox"
                                                                                    />
                                                                                    <i />
                                          15:00 - 15:59
                                        </label>

                                                                                <label className="checkbox" style={{ marginRight: "5px" }}>
                                                                                    <input
                                                                                        disabled={state.agregar == "Consultar"}
                                                                                        native="true"
                                                                                        checked={state.hora16}
                                                                                        name="hora16"
                                                                                        onChange={(e) => setState({ ...state, hora16: e.target.checked })}
                                                                                        type="checkbox"
                                                                                    />
                                                                                    <i />
                                          16:00 - 16:59
                                        </label>

                                                                                <label className="checkbox" style={{ marginRight: "5px" }}>
                                                                                    <input
                                                                                        disabled={state.agregar == "Consultar"}
                                                                                        native="true"
                                                                                        checked={state.hora17}
                                                                                        name="hora17"
                                                                                        onChange={(e) => setState({ ...state, hora17: e.target.checked })}
                                                                                        type="checkbox"
                                                                                    />
                                                                                    <i />
                                          17:00 - 17:59
                                        </label>

                                                                            </div>

                                                                            <div style={{ width: "25%" }}>

                                                                                <label className="checkbox" style={{ marginRight: "5px" }}>
                                                                                    <input
                                                                                        disabled={state.agregar == "Consultar"}
                                                                                        native="true"
                                                                                        checked={state.hora18}
                                                                                        name="hora18"
                                                                                        onChange={(e) => setState({ ...state, hora18: e.target.checked })}
                                                                                        type="checkbox"
                                                                                    />
                                                                                    <i />
                                          18:00 - 18:59
                                        </label>

                                                                                <label className="checkbox" style={{ marginRight: "5px" }}>
                                                                                    <input
                                                                                        disabled={state.agregar == "Consultar"}
                                                                                        native="true"
                                                                                        checked={state.hora19}
                                                                                        name="hora19"
                                                                                        onChange={(e) => setState({ ...state, hora19: e.target.checked })}
                                                                                        type="checkbox"
                                                                                    />
                                                                                    <i />
                                          19:00 - 19:59
                                        </label>

                                                                                <label className="checkbox" style={{ marginRight: "5px" }}>
                                                                                    <input
                                                                                        disabled={state.agregar == "Consultar"}
                                                                                        native="true"
                                                                                        checked={state.hora20}
                                                                                        name="hora20"
                                                                                        onChange={(e) => setState({ ...state, hora20: e.target.checked })}
                                                                                        type="checkbox"
                                                                                    />
                                                                                    <i />
                                          20:00 - 20:59
                                        </label>

                                                                                <label className="checkbox" style={{ marginRight: "5px" }}>
                                                                                    <input
                                                                                        disabled={state.agregar == "Consultar"}
                                                                                        native="true"
                                                                                        checked={state.hora21}
                                                                                        name="hora21"
                                                                                        onChange={(e) => setState({ ...state, hora21: e.target.checked })}
                                                                                        type="checkbox"
                                                                                    />
                                                                                    <i />
                                          21:00 - 21:59
                                        </label>

                                                                                <label className="checkbox" style={{ marginRight: "5px" }}>
                                                                                    <input
                                                                                        disabled={state.agregar == "Consultar"}
                                                                                        native="true"
                                                                                        checked={state.hora22}
                                                                                        name="hora22"
                                                                                        onChange={(e) => setState({ ...state, hora22: e.target.checked })}
                                                                                        type="checkbox"
                                                                                    />
                                                                                    <i />
                                          22:00 - 22:59
                                        </label>

                                                                                <label className="checkbox" style={{ marginRight: "5px" }}>
                                                                                    <input
                                                                                        disabled={state.agregar == "Consultar"}
                                                                                        native="true"
                                                                                        checked={state.hora23}
                                                                                        name="hora23"
                                                                                        onChange={(e) => setState({ ...state, hora23: e.target.checked })}
                                                                                        type="checkbox"
                                                                                    />
                                                                                    <i />
                                          23:00 - 23:59
                                        </label>

                                                                            </div>

                                                                        </div>
                                                                    </div>

                                                                </div>

                                                                <div id="Notificaciones" className="tab-pane fade" style={{ paddingTop: "20px" }}>
                                                                    <label className="checkbox" style={{ marginRight: "5px" }}>
                                                                        <input
                                                                            disabled={state.agregar == "Consultar"}
                                                                            native="true"
                                                                            checked={state.vencimientoCertificado}
                                                                            name="vencimientoCertificado"
                                                                            onChange={(e) => setState({ ...state, vencimientoCertificado: e.target.checked })}
                                                                            type="checkbox"
                                                                        />
                                                                        <i />
                                    Vencimiento de Certificado
                                  </label>

                                                                </div>

                                                            </div>

                                                        </div>

                                                    </div>

                                                    <div className="form-footer">
                                                        <button type="reset" href="#Listado" role="tab" data-toggle="tab" className="btn btn-secondary secondary-btn">
                                                            Cancelar
                              </button>
                                                        <button type="submit" className="btn btn-primary primary-btn">Aceptar</button>
                                                    </div>

                                                </div>

                                            </form>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div id="Importar" className="tab-pane fade">
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
                                                                onChange={handleUpload}
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
                                                    <button href="#Listado" role="tab" data-toggle="tab" data-layout="topCenter" data-type="information" className="btn btn-secondary secondary-btn"> Cancelar</button>
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

export default Usuarios;
