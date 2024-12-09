import React, { useEffect } from "react";
import Cabecera from "../Components/Template/Cabecera";
import BarraLateralIzquierda from "../Components/Template/BarraLateralIzquierda";
import BarraLateralDerecha from "../Components/Template/BarraLateralDerecha";
import { styled } from "@mui/material/styles";
import { DataGrid } from '@mui/x-data-grid';

import Noty from 'noty';
import { dataGridLocaleText } from "../Constants";
import { Button, Grid, TextField, Tooltip } from "@mui/material";
import { agregarMonedas, eliminarMonedas, modificarMonedas, obtenerMonedas, obtenerMonedasId } from "../Util/Contexts/MonedaContext";
import { validarPermisos } from "../Util/Contexts/UsuarioContext";
import {validarDerecho} from "../Util/Util"
import $ from "jquery";
const PREFIX = 'Moneda';

const classes = {
    seleccionado: `${PREFIX}-seleccionado`,
    noSeleccionado: `${PREFIX}-noSeleccionado`,
    disabled: `${PREFIX}-disabled`
};

const Root = styled('div')({
    [`& .${classes.seleccionado}`]: {
        backgroundColor: "#FCC88F",
    },
    [`& .${classes.noSeleccionado}`]: {
        backgroundColor: "#FFFFFF",
    },
    [`& .${classes.disabled}`]: {
        pointerEvents:"none",
        cursor:"default",
    }
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

function Moneda() {


    const [data, setData] = React.useState([])
    const [state, setState] = React.useState({
        idMoneda: 0,
        codigo: "",
        moneda: "",
        simbolo: "",
        DerechoBorrar: 33,
        abreviacion: "",
        CreadoPor: localStorage.getItem("UsuarioId"),
        ModificadoPor: localStorage.getItem("UsuarioId"),
        agregar: "Agregar",
        height: window.innerHeight
    })

    const handleAceptar = (e) => {
        e.preventDefault()
        var params = {

            "m_nIdMoneda": state.idMoneda,
            "m_sMoneda": state.moneda,
            "m_sCodigo": state.codigo,
            "m_sAbreviacion": state.abreviacion,
            "m_sSimbolo": state.simbolo,
            "m_nCreadoPor": parseInt(state.CreadoPor),
            "m_nModificadoPor": parseInt(state.ModificadoPor)
        }
        if (state.idMoneda != 0) {
            modificarMonedas(state.idMoneda, params).then(respuesta => {
                showSuccess(respuesta.data)
                getAllData();
                $('.nav-tabs li ').removeClass('active');
                $('.nav-tabs li').eq(0).addClass('active');
                $('.tab-content div ').removeClass('in show');
                $('#Listado').addClass('in show');
            }).catch(err => {
                console.log(err)
                showSuccess(err.response?.data)
            });
        } else {
            agregarMonedas(params).then(respuesta => {
                showSuccess(respuesta.data)
                window.location.reload();
              getAllData();
                $('.nav-tabs li ').removeClass('active');
                $('.nav-tabs li').eq(0).addClass('active');
                $('.tab-content div ').removeClass('in show');
                $('#Listado').addClass('in show');
            }).catch(err => {
                console.log(err)
                showSuccess(err.response?.data)
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
            eliminarMonedas(id).then(respuesta => {
                showSuccess(respuesta.data)
                console.log(JSON.stringify(respuesta))
                getAllData();
               // window.location.reload();
            }).catch(err => {
                showSuccess(err.response?.data)
            });
        }).catch(err => {
            showSuccess(err.response?.data)
        });

    }

    function handleShowModificar(id) {
        obtenerMonedasId(id).then(respuesta => {
            setState({
                ...state,
                agregar: "Modificar",
                idMoneda: id,
                codigo: respuesta.data.m_sCodigo,
                moneda: respuesta.data.m_sMoneda,
                simbolo: respuesta.data.m_sSimbolo,
                abreviacion: respuesta.data.m_sAbreviacion,
            })
        });
        $('.nav-tabs li ').removeClass('active');
        $('.nav-tabs li').eq(1).addClass('active');
        $('.tab-content div ').removeClass('in show');
        $('#Agregar').addClass('in show');
        $('#Listado').removeClass('in show');
    }

    function handleShowConsultar(id) {
        obtenerMonedasId(id).then(respuesta => {
            setState({
                ...state,
                agregar: "Consultar",
                idMoneda: id,
                codigo: respuesta.data.m_sCodigo,
                moneda: respuesta.data.m_sMoneda,
                simbolo: respuesta.data.m_sSimbolo,
                abreviacion: respuesta.data.m_sAbreviacion,
            })
        });
        $('.nav-tabs li ').removeClass('active');
        $('.nav-tabs li').eq(1).addClass('active');
        $('.tab-content div ').removeClass('in show');
        $('#Agregar').addClass('in show');
        $('#Listado').removeClass('in show');

    }

    function handleShowAgregar() {
        setState({
            ...state,
            agregar: "Agregar",
            idMoneda: 0,
            codigo: "",
            moneda: "",
            simbolo: "",
            abreviacion: "",
        })
        $('.nav-tabs li ').removeClass('active');
        $('.nav-tabs li').eq(1).addClass('active');
        $('.tab-content div ').removeClass('in show');
        $('#Agregar').addClass('in show');
        $('#Listado').removeClass('in show');

    }

    function limpiarCampos(event) {
        event.stopPropagation();
        setState({ ...state, agregar: "Agregar" });
        $('.nav-tabs li ').removeClass('active');
        $('.nav-tabs li').eq(0).addClass('active');
        $('.tab-content div ').removeClass('in show');
        $('#Listado').addClass('in show');
    }

    const handleChange = event => {
        console.log(event.target.value)
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
                    <Root>
                        <Tooltip title="Modificar" disabled={!validarDerecho(9101269)}>
                            <a onClick={() => (handleShowModificar(row.row.m_nIdMoneda))} className="btn btn-default btn-xs"><i className="fa fa-pencil-square-o" style={{ color: "#F9A03E" }} /></a >

                        </Tooltip>
                        <Tooltip title="Consultar">
                            <a className="btn btn-default btn-xs" onClick={() => (handleShowConsultar(row.row.m_nIdMoneda))}><i className="fa fa-eye" style={{ color: "#F9A03E" }} /></a>

                        </Tooltip>
                        <Tooltip title="Eliminar" disabled={!validarDerecho(9101270)}>
                            <a  className="btn btn-default btn-xs" onClick={() => (handleEliminar(row.row.m_nIdMoneda))}><i className="zmdi zmdi-delete" style={{ color: "#F30B0B" }} /></a>

                        </Tooltip>
                    </Root>
                );
            }
        },
        {
            headerName: "Código",
            field: "m_sCodigo",
            width: 100,
        }, {
            headerName: "Moneda",
            field: "m_sMoneda",
            width: 125,
        }, {
            headerName: "Símbolo",
            field: "m_sSimbolo",
            width: 100,
        }, {
            headerName: "Abreviación",
            field: "m_sAbreviacion",
            width: 150,
        }/*, {
            headerName: "Creado El",
            field: "m_sCreadoEl",
            width: 200,
        }, {
            headerName: "Creado Por",
            field: "m_sCreadoPor",
            width: 150,
        }, {
            headerName: "Modificado El",
            field: "m_sModificadoEl",
            width: 200,
        }, {
            headerName: "Modificado Por",
            field: "m_sModificadoPor",
            width: 150,
        }
*/
    ]);

    useEffect(value => {
        if (localStorage.getItem("UsuarioId") === null || localStorage.getItem("UsuarioId") <= 0) {
            showSuccess("Es necesario iniciar sesion para acceder a este proceso");
            window.location.replace("login");
            return;
        }
        getAllData();
        $('.nav-tabs li ').removeClass('active');
        $('.nav-tabs li').eq(0).addClass('active');
        $('.tab-content div ').removeClass('in show');
        $('#Listado').addClass('in show');
    }, []);

    function getAllData() {
        obtenerMonedas().then(respuesta => {
            setData(respuesta.data)
        });
        $('.nav-tabs li ').removeClass('active');
        $('.nav-tabs li').eq(0).addClass('active');
        $('.tab-content div ').removeClass('in show');
        $('#Listado').addClass('in show');
    };

    const headers = {
        'Content-Type': 'application/json',
        //    'access-control-allow-origin': '*'
    }

    return (
        <div >

            <header className="topbar clearfix">
                <Cabecera titulo="Moneda" >
                    <div className="page-header">
                        <ul className="list-page-breadcrumb">
                            <li>
                                <a href="/Configuracion" className="color-mapeo">
                                    Configuración <i className="zmdi zmdi-chevron-right" />
                                </a>
                            </li>
                            <li className="active-page">Moneda</li>
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
                            <a onClick={(event) => { event.stopPropagation(); setState({ ...state, agregar: "Agregar" }); $('.nav-tabs li ').removeClass('active'); $('.nav-tabs li').eq(0).addClass('active'); $('.tab-content div ').removeClass('in show'); $('#Listado').addClass('in show'); }}>
                                <i className="fa fa-list" /> Listado
                            </a>
                        </li>
                        <li>
                            <a className={validarDerecho(9101268)?"":"hide"}  data-toggle="tab" onClick={handleShowAgregar}>
                                <i className="fa fa-plus-circle" /> {state.agregar}
                            </a>
                        </li>
                    </ul>

                    <div className="row" className="tab-content">
                        <div className="widget-wrap" id="Listado" className="tab-pane fade">
                            <div className="widget-wrap">
                                <div className="widget-content">
                                    <div className="row" style={{ height: state.height - 250, width: '100%' }}>
                                        {data.length != 0 ? (
                                            <DataGrid
                                                localeText={dataGridLocaleText}
                                                rows={data}
                                                columns={columns}
                                                density="compact"
                                                pageSize={Math.floor((state.height - 310) / 30)}
                                                getRowId={(row) => row.m_nIdMoneda}
                                                onRowSelected={(row) => {
                                                    setState({
                                                        ...state,
                                                        idMoneda: row.data.m_nIdMoneda
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

                        <div className="widget-wrap" id="Agregar" className="tab-pane fade">
                            <div className="widget-wrap">
                                <div className="widget-content">
                                    <div className="row">
                                        <div className="col-md-12">
                                            <form className="j-forms" onSubmit={handleAceptar}>
                                                <div className="form-content">

                                                    <div className="col-sm-12 col-md-8 unit">
                                                        <div className="input">
                                                            <TextField variant="outlined" size="small" label="Código"
                                                                onChange={handleChange}
                                                                className="form-control"
                                                                       fullWidth
                                                                type="text"
                                                                maxLength="10"
                                                                required={true}
                                                                value={state.codigo}
                                                                disabled={state.agregar=="Consultar"}
                                                                id="codigo"
                                                            />
                                                        </div>
                                                    </div>

                                                    <div className="col-sm-12 col-md-4 unit">
                                                        <div className="input">
                                                            <TextField variant="outlined" size="small" label="Moneda"
                                                                onChange={handleChange}
                                                                       fullWidth
                                                                className="form-control"
                                                                type="text"
                                                                required={true}
                                                                disabled={state.agregar=="Consultar"}
                                                                value={state.moneda}
                                                                id="moneda"
                                                            />
                                                        </div>
                                                    </div>

                                                    <div className="col-sm-12 col-md-8 unit">
                                                        <div className="input">
                                                            <TextField variant="outlined" size="small" label="Símbolo"
                                                                onChange={handleChange}
                                                                className="form-control"
                                                                       fullWidth
                                                                type="text"
                                                                maxLength="3"
                                                                required={true}
                                                                disabled={state.agregar=="Consultar"}
                                                                value={state.simbolo}
                                                                id="simbolo"
                                                            />
                                                        </div>
                                                    </div>

                                                    <div className="col-sm-12 col-md-4 unit">
                                                        <div className="input">
                                                            <TextField variant="outlined" size="small" label="Abreviación"
                                                                onChange={handleChange}
                                                                className="form-control"
                                                                       fullWidth
                                                                required={true}
                                                                type="text"
                                                                maxLength="3"
                                                                disabled={state.agregar=="Consultar"}
                                                                value={state.abreviacion}
                                                                id="abreviacion"
                                                            />
                                                        </div>
                                                    </div>

                                                </div>
                                                <br></br>

                                                <div className="form-footer col-md-12">
                                                    <Grid container spacing={1}>
                                                        <Grid item xs>
                                                            <Button fullWidth onClick={(event) => {limpiarCampos(event)}}
                                                                    role="tab" data-toggle="tab"
                                                                    className="btn btn-secondary secondary-btn">
                                                                CANCELAR
                                                            </Button>
                                                        </Grid>
                                                        <Grid item xs>
                                                            <Button fullWidth type="submit"
                                                                    className="btn btn-primary primary-btn">
                                                                GUARDAR MONEDA
                                                            </Button>
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

export default Moneda;
