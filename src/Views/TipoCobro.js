import React, { useEffect, useState, useMemo } from "react";
import axios from "axios";
import Cabecera from "../Components/Template/Cabecera";
import BarraLateralIzquierda from "../Components/Template/BarraLateralIzquierda";
import BarraLateralDerecha from "../Components/Template/BarraLateralDerecha";
import { DataGrid } from '@material-ui/data-grid';

import Noty from 'noty';
import { dataGridLocaleText } from "../Constants";
import {Checkbox, FormControlLabel, MenuItem, TextField, Tooltip} from "@material-ui/core";
import { Button, Grid } from "@material-ui/core";
import { agregarTipoCobro, eliminarTipoCobro, modificarTipoCobro, obtenerTipoCobroId, obtenerTipoCobro } from "../Util/Contexts/TipoCobroContext";
import { validarPermisos } from "../Util/Contexts/UsuarioContext";
import {validarDerecho} from "../Util/Util"
import {makeStyles} from "@material-ui/core/styles";
import {obtenerTiposPago} from "../Util/Contexts/TipoPagoContext";
import HelpOutlineOutlinedIcon from '@material-ui/icons/HelpOutlineOutlined';
import $ from "jquery";
window.jQuery = window.$ = $;

function showSuccess(mensaje) {
    new Noty({
        type: "information",
        layout: "topCenter",
        text: mensaje,
        timeout: "3000"
    }).show()
}

const styles = {
    disabled: {
        pointerEvents: "none",
        cursor: "default",
    }
};
const useStyles = makeStyles(styles);

function TipoCobro() {
    const classes = useStyles();
    const [data, setData] = React.useState([])
    const [dataTipoPago, setDataTipoPago] = React.useState([])
    const [state, setState] = React.useState({
        idTipoCobro: 0,
        codigo: "",
        descripcion: "",
        idTipoPago: '',
        bloqueaUM: false,
        solicitaMonto: false,
        DerechoBorrar: 126,
        agregar: "Agregar",
        height: window.innerHeight,
        CreadoPor: localStorage.getItem("UsuarioId"),
        ModificadoPor: localStorage.getItem("UsuarioId")
    })

    const handleAceptar = (e) => {
        e.preventDefault()
        let params = {

            "codigo": state.codigo,
            "descripcion": state.descripcion,
            "idTipoPago": state.idTipoPago,
            "bloqueaUltimaMilla": state.bloqueaUM,
            "solicitaMonto": state.solicitaMonto,
            "creadoPor": state.CreadoPor,
            "modificadoPor": state.ModificadoPor
        }
        console.log(params)
        if (state.idTipoCobro != 0) {
            modificarTipoCobro(state.idTipoCobro, params).then(respuesta => {
                showSuccess(respuesta.data)
                handleShowListado();
            }).catch(err => {
                console.log(err)
                showSuccess("err")
            });
        } else {
            agregarTipoCobro(params).then(respuesta => {
                showSuccess(respuesta.data)
                handleShowListado();
            }).catch(err => {
                console.log(err)
                showSuccess(err)
            });
        }

    }

    function handleEliminar(id) {
        var derecho;
        validarPermisos(state).then(respuesta => {
            //showSuccess(respuesta.data)

            derecho = respuesta.data;
            if (derecho == false) {
                showSuccess("El usuario no tiene derechos para realizar el proceso");
                return;
            }

            eliminarTipoCobro(id, state.ModificadoPor).then(respuesta => {
                showSuccess(respuesta.data)
                getAllData();
            }).catch(err => {
                console.log(err)
                showSuccess(err)
            });
        }).catch(err => {
            showSuccess(err)
        });
    }

    const handleChange = event => {
        setState({
            ...state,
            [event.target.name]: event.target.value
        });
    };

    const handleChangeCheckbox = event => {
        setState({
            ...state,
            [event.target.name]: event.target.checked
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
                            <a href="#Agregar" role="tab" data-toggle="tab" onClick={() => (handleShowModificar(row.row.m_nIdTipoCobro))} className="btn btn-default btn-xs"
                            disabled={!validarDerecho(9101351)}><i className="fa fa-pencil-square-o" style={{ color: "#F9A03E" }} /></a>

                        </Tooltip>
                        <Tooltip title="Consultar">
                            <a href="#Agregar" role="tab" data-toggle="tab" className="btn btn-default btn-xs" onClick={() => (handleShowConsultar(row.row.m_nIdTipoCobro))}><i className="fa fa-eye" style={{ color: "#F9A03E" }} /></a>

                        </Tooltip>
                        <Tooltip title="Eliminar">
                            <a href="#" className="btn btn-default btn-xs" onClick={() => (handleEliminar(row.row.m_nIdTipoCobro))}
                            disabled={!validarDerecho(9101352)}><i className="zmdi zmdi-delete" style={{ color: "#F30B0B" }} /></a>

                        </Tooltip>
                    </div>
                )
            }
        },
        {
            headerName: "Código",
            field: "m_nCodigo",
            width: 100
        }, {
            headerName: "Descripción",
            field: "m_sDescripcion",
            width: 300
        },{
            headerName: "Tipo de Pago",
            field: "m_sTipoPago",
            width: 200
        }, {
            headerName: "Bloquea última milla",
            field: "m_bBloquearUltimaMilla",
            width: 100,
            renderCell: (row) => {
                return (
                    <div>
                        {row.row.m_bBloquearUltimaMilla ?
                            <div>Sí</div> :
                            <div>No</div>
                        }
                    </div>
                )
            }
        }, {
            headerName: "Solicita monto",
            field: "m_bSolicitarMonto",
            width: 100,
            renderCell: (row) => {
                return (
                    <div>
                        {row.row.m_bSolicitarMonto ?
                            <div>Sí</div> :
                            <div>No</div>
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
        getAllData();
        getAllTipoPago()
    }, []);

    const getAllData = () => {
        obtenerTipoCobro().then(respuesta => {
            setData(respuesta.data)
        });
    }

    const getAllTipoPago = () => {
        obtenerTiposPago().then(({data}) => {
            setDataTipoPago(data)
        })
    }

    const handleClickCancelar = () =>{
        getAllData();
    }

    const showTab = (index) => {
        switch (index) {
            case 0:
                $('.nav-tabs li ').removeClass('active');
                $('.nav-tabs li').eq(index).addClass('active');
                $('.tab-content div ').removeClass('in show');
                $('#Listado').addClass('in show');
                break;
            case 1:
                $('.nav-tabs li ').removeClass('active');
                $('.nav-tabs li').eq(index).addClass('active');
                $('.tab-content div ').removeClass('in show');
                $('#Agregar').addClass('in show');
                break;
            default:
                $('.nav-tabs li ').removeClass('active');
                $('.nav-tabs li').eq(0).addClass('active');
                $('.tab-content div ').removeClass('in show');
                $('#Listado').addClass('in show');
                break;
        }
    }

    const handleShowListado = (event) => {
        if (event !== undefined){
            event.stopPropagation();
        }
        setState(state => {
            return {
                ...state,
                agregar: "Agregar",
            }
        })
        showTab(0)
        getAllData()
        limpiarInputsAgregar()
    }

    const handleShowAgregar = (event) => {
        if (event !== undefined){
            event.stopPropagation();
        }
        setState(state => {
            return {
                ...state,
                agregar: "Agregar",
            }
        })
        showTab(1);
    }

    const handleShowModificar = (id) => {
        obtenerTipoCobroId(id).then(respuesta => {
            mostrarDataConsulta(respuesta, "Modificar")
        });
    }

    const handleShowConsultar = (id) => {
        obtenerTipoCobroId(id).then(respuesta => {
            mostrarDataConsulta(respuesta, "Consultar")
        });
    }

    const mostrarDataConsulta = (respuesta, accion) => {
        setState(state => {
            return {
                ...state,
                agregar: accion,
                idTipoCobro: respuesta.data.IdTipoCobro,
                codigo: respuesta.data.Codigo,
                descripcion: respuesta.data.Descripcion,
                idTipoPago: respuesta.data.IdTipoPago,
                bloqueaUM: respuesta.data.BloquearUltimaMilla,
                solicitaMonto: respuesta.data.SolicitarMonto,
            }
        })
        showTab(1)
    }

    const limpiarInputsAgregar = () => {
        setState(state => {
            return {
                ...state,
                idTipoCobro: 0,
                codigo: "",
                descripcion: "",
                idTipoPago: "",
                bloqueaUM: false,
                solicitaMonto: false,
            }
        })
    }

    return (
        <div >

            <header className="topbar clearfix">
                <Cabecera titulo="Tipo de Cobro" >
                    <div className="page-header">
                        <ul className="list-page-breadcrumb">
                            <li>
                                <a href="/Catalogos" className="color-mapeo">
                                    Catálogos <i className="zmdi zmdi-chevron-right" />
                                </a>
                            </li>
                            <li className="active-page">Tipo de Cobro</li>
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
                            <a onClick={(event) => handleShowListado(event)}>
                                <i className="fa fa-list" /> Listado
            </a>
                        </li>
                        <li>
                            <a onClick={(event) => handleShowAgregar(event)} className={validarDerecho(9101350) ? "" : classes.disabled} data-toggle="tab">
                                <i className="fa fa-plus-circle"/> {state.agregar}
                            </a>
                        </li>
                    </ul>

                    <div className="row" className="tab-content">
                        <div id="Listado" className="tab-pane fade in show">
                            <div className="widget-wrap">
                                <div className="widget-content">
                                    <div className="row" style={{ height: state.height - 250, width: '100%' }}>
                                        <DataGrid
                                            localeText={dataGridLocaleText}
                                            rows={data}
                                            columns={columns}
                                            density="compact"
                                            pageSize={Math.floor((state.height - 310) / 30)}
                                            getRowId={(row) => row.m_nIdTipoCobro}
                                            onRowSelected={(row) => {
                                                setState({
                                                    ...state,
                                                    idTipoCobro: row.data.m_nIdTipoCobro
                                                })
                                            }}
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div id="Agregar" className="tab-pane fade">
                            <div className="widget-wrap">
                                <div className="widget-content">
                                    <div className="row">
                                        <div className="col-md-12">
                                            <form className="j-forms" onSubmit={handleAceptar}>
                                                <div className="form-content">
                                                    <Grid container spacing={1} style={{margin:'20px'}}>
                                                        <Grid item xs={12} sm={2}>
                                                            <TextField variant="outlined" margin="dense" label="Código"
                                                                       onChange={handleChange}
                                                                       className="form-control"
                                                                       type="number"
                                                                       required={true}
                                                                       value={state.codigo}
                                                                       disabled={state.agregar === "Consultar"}
                                                                       name="codigo"
                                                            />
                                                        </Grid>
                                                        <Grid item xs={12} sm={2}>
                                                            <TextField variant="outlined" margin="dense" label="Descripción"
                                                                       onChange={handleChange}
                                                                       className="form-control"
                                                                       type="text"
                                                                       maxLenght="125"
                                                                       required={true}
                                                                       value={state.descripcion}
                                                                       name="descripcion"
                                                                       disabled={state.agregar === "Consultar"}
                                                            />
                                                        </Grid>
                                                        <Grid item xs={12} sm={2}>
                                                            <TextField variant="outlined" margin="dense" label="Tipo de pago por defecto"
                                                                       onChange={handleChange}
                                                                       className="form-control"
                                                                       required={true}
                                                                       value={state.idTipoPago}
                                                                       name="idTipoPago"
                                                                       select
                                                                       disabled={state.agregar === "Consultar"}
                                                            >
                                                                {
                                                                    dataTipoPago.map(i => (
                                                                        <MenuItem key={i.m_nIdTipoPago} value={i.m_nIdTipoPago}>{i.m_sTipoPago}</MenuItem>
                                                                    ))
                                                                }
                                                            </TextField>
                                                        </Grid>
                                                        <Grid item xs={12} sm={1}>
                                                            <Tooltip title="El tipo de pago seleccionado se le asignará automaticamente a la guia al pagarla si se registra con este tipo de cobro.">
                                                                <HelpOutlineOutlinedIcon/>
                                                            </Tooltip>
                                                        </Grid>
                                                        <Grid item xs={12} sm={5}/>
                                                        <Grid item xs={12} sm={2}>
                                                            <FormControlLabel
                                                                control={
                                                                    <Checkbox
                                                                        checked={state.bloqueaUM}
                                                                        onChange={handleChangeCheckbox}
                                                                        name="bloqueaUM"
                                                                        color="primary"
                                                                        disabled={state.agregar === "Consultar"}
                                                                    />
                                                                }
                                                                label="Bloquea Última Milla"
                                                            />
                                                        </Grid>
                                                        <Grid item xs={12} sm={1}>
                                                            <Tooltip title="En caso de que la guia no esté pagada y tenga registrado este tipo de cobro no se podrá agregar a un proceso de última milla">
                                                                <HelpOutlineOutlinedIcon/>
                                                            </Tooltip>
                                                        </Grid>
                                                        <Grid item xs={12} sm={9}/>
                                                        <Grid item xs={12} sm={2}>
                                                            <FormControlLabel
                                                                control={
                                                                    <Checkbox
                                                                        checked={state.solicitaMonto}
                                                                        onChange={handleChangeCheckbox}
                                                                        name="solicitaMonto"
                                                                        color="primary"
                                                                        disabled={state.agregar === "Consultar"}
                                                                    />
                                                                }
                                                                label="Solicita monto"
                                                            />
                                                        </Grid>
                                                        <Grid item xs={12} sm={1}>
                                                            <Tooltip title="Si la guia tiene este tipo de cobro se solicitará el tipo de pago para finalizar el viaje la guia.">
                                                                <HelpOutlineOutlinedIcon/>
                                                            </Tooltip>
                                                        </Grid>

                                                    </Grid>



                                                </div>
                                                <br></br>
                                                <div className="form-footer ol-md-12">
                                    <Grid container spacing={1}>
                                        <Grid item xs>
                                        <Button fullWidth href="#Listado" role="tab" data-toggle="tab" className="btn btn-secondary secondary-btn" onClick={handleClickCancelar}
                                                    >
                                                        CANCELAR
                                        </Button>
                                        </Grid>
                                        <Grid item xs>
                                        <Button fullWidth type="submit" className="btn btn-primary primary-btn">AGREGAR TIPO DE COBRO</Button>
                                        </Grid>
                                    </Grid>
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

export default TipoCobro;
