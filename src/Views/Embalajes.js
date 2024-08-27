import React, { useEffect, useState, useMemo } from "react";
import axios from "axios";
import Cabecera from "../Components/Template/Cabecera";
import BarraLateralIzquierda from "../Components/Template/BarraLateralIzquierda";
import BarraLateralDerecha from "../Components/Template/BarraLateralDerecha";
import * as XLSX from 'xlsx';
import { useTable, useFilters, useAsyncDebounce, useSortBy } from 'react-table'
import { styled } from "@mui/material/styles";
import makeStyles from '@mui/styles/makeStyles';
import { DataGrid } from '@mui/x-data-grid';
import $ from "jquery";
import Noty from 'noty';
import { dataGridLocaleText } from "../Constants";
import { Button, Grid, TextField, Tooltip } from "@mui/material";
import { agregarEmbalajes, modificarEmbalajes, eliminarEmbalajes, obtenerEmbalajesId, obtenerEmbalajes,validarEliminarEmbalajes } from "../Util/Contexts/EmbalajesContext";
import { validarPermisos } from "../Util/Contexts/UsuarioContext";
import { confirmAlert } from "react-confirm-alert";
import {validarDerecho} from "../Util/Util"

const PREFIX = 'Embalaje';

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
        pointerEvents: "none",
        cursor: "default",
    },
});

function showSuccess(mensaje) {
    new Noty({
        type: "information",
        layout: "topCenter",
        text: mensaje,
        timeout: "3000"
    }).show()
}

window.jQuery = window.$ = $;
function Embalaje() {


    const [data, setData] = React.useState([])
    const [state, setState] = React.useState({
        showPopUp: false,
        IdEmbalaje: 0,
        CodigoEmbalaje: undefined,
        NombreEmbalaje: "",
        DerechoBorrar: 87,
        DescripcionEmbalaje: "",
        agregar: "Agregar",
        height: window.innerHeight,
        CreadoPor: localStorage.getItem("UsuarioId"),
        ModificadoPor: localStorage.getItem("UsuarioId")
    })
    const [fileUploaded, setFileUploaded] = React.useState([])
    const [codigoError, setCodigoError] = useState(false)

    const handleAceptar = (e) => {  
        e.preventDefault()     
        if(state.CodigoEmbalaje.length>=10){
                showSuccess("Error el codigo debe ser menor a 10 digitos")
         }else if(state.CodigoEmbalaje <= 0){
            showSuccess("Error el codigo de embalaje debe ser mayor a 0")
         }
        else{
        var params = {
            "m_nIdEmbalaje": state.IdEmbalaje,
            "m_sCodigo": state.CodigoEmbalaje,
            "m_sNombre": state.NombreEmbalaje,
            "m_sDescripcion": state.DescripcionEmbalaje,
            "m_sCreadoPor": state.CreadoPor,
            "m_nModificadoPor": state.ModificadoPor
        }
        console.log(params)
      
        if (state.IdEmbalaje != 0) {
            console.log('Entra a modificar')
            modificarEmbalajes(state.IdEmbalaje, params).then(respuesta => {
                console.log("modificar"+JSON.stringify(respuesta))
                showSuccess(respuesta.data)
                getAllData()
                $('.nav-tabs li ').removeClass('active');
                $('.nav-tabs li').eq(0).addClass('active');
                $('.tab-content div ').removeClass('in show');
                $('#Listado').addClass('in show');
            }).catch(err => {
                console.log(err)
                showSuccess("err")
            });
        } else {
            console.log('Entra a agregar')
            agregarEmbalajes(params).then(respuesta => {
                console.log("agregar"+JSON.stringify(respuesta))
                showSuccess(respuesta.data)
                getAllData()
                $('.nav-tabs li ').removeClass('active');
                $('.nav-tabs li').eq(0).addClass('active');
                $('.tab-content div ').removeClass('in show');
                $('#Listado').addClass('in show');
            }).catch(err => {
                console.log(JSON.stringify(err))
                showSuccess(err)
            });
        }
}
    }

    function handleEliminar(id) {
        var derecho;
        confirmAlert({
            title: 'Confirmar Eliminar',
            message: '¿Está seguro de eliminar este embalaje?',
            buttons: [
                {
                    label: 'Si',
                    onClick: () => {
        validarPermisos(state).then(respuesta => {
            //showSuccess(respuesta.data)
            console.log(respuesta.data)
            derecho = respuesta.data;
            if (derecho == false) {
                showSuccess("El usuario no tiene derechos para realizar el proceso");
                return;
            }
            validarEliminarEmbalajes(id).then(respuesta=>{
                if(respuesta.data.sePuedeEliminar){
                    eliminarEmbalajes(id, state.CreadoPor).then(respuesta => {
                        showSuccess("Eliminacion de embalaje exitoso")
                        getAllData()
                    }).catch(err => {
                        showSuccess(err)
                    });                   
                }else{
                    showSuccess("El embalaje no puede ser eliminado ya que se encuentra relacionado a por lo menos una recoleccion o embarque")
                }
            })

        }).catch(err => {
            showSuccess(err)
        });

                    }
                },
                {
                    label: 'No',
                }
            ]
        })
       
    }

    function handleShowModificar(id) {
        console.log(id)
        obtenerEmbalajesId(id).then(respuesta => {
            setState({
                ...state,
                agregar: "Modificar",
                IdEmbalaje: id,
                CodigoEmbalaje: respuesta.data.m_sCodigo,
                NombreEmbalaje: respuesta.data.m_sNombre,
                DescripcionEmbalaje: respuesta.data.m_sDescripcion
            })
            $('.nav-tabs li ').removeClass('active'); $('.nav-tabs li').eq(1).addClass('active'); $('.tab-content div ').removeClass('in show'); $('#Agregar').addClass('in show');

        });
    }

    function handleShowConsultar(id) {
        obtenerEmbalajesId(id).then(respuesta => {
            setState({
                ...state,
                agregar: "Consultar",
                IdEmbalaje: id,
                CodigoEmbalaje: respuesta.data.m_sCodigo,
                NombreEmbalaje: respuesta.data.m_sNombre,
                DescripcionEmbalaje: respuesta.data.m_sDescripcion
            })
            $('.nav-tabs li ').removeClass('active'); $('.nav-tabs li').eq(1).addClass('active'); $('.tab-content div ').removeClass('in show'); $('#Agregar').addClass('in show');

        });
    }

    function handleShowAgregar() {
        setState({
            ...state,
            agregar: "Agregar",
            showPopUp: true,
            IdEmbalaje: 0,
            NombreEmbalaje: "",
            CodigoEmbalaje: undefined,
            DescripcionEmbalaje: ""
        })
        $('.nav-tabs li ').removeClass('active'); $('.nav-tabs li').eq(1).addClass('active'); $('.tab-content div ').removeClass('in show'); $('#Agregar').addClass('in show');

    }

    const handleChange = event => {
        if(event.target.id === "CodigoEmbalaje"){
            console.log(event.target.value.length)
            if(event.target.value.length>=10){
                setCodigoError(true)
            }else{
                setCodigoError(false)
            }
        }
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
                        <Tooltip title="Modificar">
                            <a  onClick={() => (handleShowModificar(row.row.m_nIdEmbalaje))} className="btn btn-default btn-xs"
                            disabled={!validarDerecho(9101319)}><i className="fa fa-pencil-square-o" style={{ color: "#F9A03E" }} /></a>

                        </Tooltip>
                        <Tooltip title="Consultar">
                            <a  className="btn btn-default btn-xs" onClick={() => (handleShowConsultar(row.row.m_nIdEmbalaje))}><i className="fa fa-eye" style={{ color: "#F9A03E" }} /></a>

                        </Tooltip>
                        <Tooltip title="Eliminar">
                            <a href="#" className="btn btn-default btn-xs" onClick={() => (handleEliminar(row.row.m_nIdEmbalaje))}
                            disabled={!validarDerecho(9101320)}><i className="zmdi zmdi-delete" style={{ color: "#F30B0B" }} /></a>

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
            headerName: "Nombre",
            field: "m_sNombre",
            width: 150,
        }, {
            headerName: "Descripción",
            field: "m_sDescripcion",
            width: 300,
        }, {
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

    ]);

    useEffect(value => {
        if (localStorage.getItem("UsuarioId") === null || localStorage.getItem("UsuarioId") <= 0) {
            showSuccess("Es necesario iniciar sesion para acceder a este proceso");
            window.location.replace("login");
            return;
        }
        getAllData();
    }, []);

    function getAllData() {
        obtenerEmbalajes().then(respuesta => {
            setData(respuesta.data)
        });
    };

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

    return (
        <div >

            <header className="topbar clearfix">
                <Cabecera titulo="Embalajes" >
                    <div className="page-header">
                        <ul className="list-page-breadcrumb">
                            <li>
                                <a href="/Catalogos" className="color-mapeo">
                                    Catálogos <i className="zmdi zmdi-chevron-right" />
                                </a>
                            </li>
                            <li className="active-page">Embalajes</li>
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
                            <a className= {validarDerecho(9101318)? "":classes.disabled} data-toggle="tab" href="#Agregar" onClick={handleShowAgregar}>
                                <i className="fa fa-plus-circle" /> {state.agregar}
                            </a>
                        </li>


                    </ul>

                    <div className="row" className="tab-content">
                        <div className="widget-wrap" id="Listado" className="tab-pane fade in show">
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
                                                getRowId={(row) => row.m_nIdEmbalaje}
                                                onRowSelectionModelChange={(newModel)=>{
                                                    if(newModel.length<1)
                                                        return
                                                    setState({
                                                        ...state,
                                                        IdEmbalaje: data.find(i=>i.m_nIdEmbalaje==newModel[0]).m_nIdEmbalaje,
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
                                            <form className="j-forms" id="formEmbalaje" onSubmit={handleAceptar}>
                                                <div className="form-content">
                                                    {/*****************************************Codigo************************************************************/}
                                                    <div className="col-xs-4 col-sm-3 col-md-2-5 col-lg-2-5 unit">

                                                        <div className="input">
                                                            <TextField variant="outlined" size="small" label="Código"
                                                                onChange={handleChange}
                                                                       fullWidth
                                                                className="form-control"
                                                                type="text"
                                                                maxlength="10"
                                                                required
                                                                value={state.CodigoEmbalaje}
                                                                readOnly={state.agregar == "Consultar"}
                                                                disabled={state.agregar == "Consultar"}
                                                                id="CodigoEmbalaje"
                                                                error={codigoError}
                                                                helperText={codigoError?"Menos de 10 digitos":""}
                                                            />
                                                        </div>
                                                    </div>
                                                    {/*****************************************Nombre************************************************************/}
                                                    <div className="col-xs-4 col-sm-3 col-md-2-5 col-lg-2-5 unit">

                                                        <div className="input">
                                                            <TextField variant="outlined" size="small" label="Nombre"
                                                                onChange={handleChange}
                                                                       fullWidth
                                                                className="form-control"
                                                                type="text"
                                                                required
                                                                disabled={state.agregar == "Consultar"}
                                                                value={state.NombreEmbalaje}
                                                                readOnly={state.agregar == "Consultar"}
                                                                id="NombreEmbalaje"
                                                            />
                                                        </div>
                                                    </div>
                                                    {/*****************************************Descripción*******************************************************/}
                                                    <div className="col-xs-4 col-sm-3 col-md-2-5 col-lg-2-5 unit">
                                                        <div className="input">
                                                            <TextField variant="outlined" size="small" label="Descripción"
                                                                onChange={handleChange}
                                                                       fullWidth
                                                                className="form-control"
                                                                type="text"
                                                                required
                                                                disabled={state.agregar == "Consultar"}
                                                                value={state.DescripcionEmbalaje}
                                                                readOnly={state.agregar == "Consultar"}
                                                                id="DescripcionEmbalaje"
                                                            />
                                                        </div>
                                                    </div>


                                                </div>
                                                <br></br>
                                                   <div className="form-footer" className="ol-md-12">
                                                   <Grid container spacing={1}>
                                  
                                    
                                                      {  state.agregar != "Consultar" &&  <Grid item xs> <Button fullWidth type="button" onClick={(event) => { event.stopPropagation(); setState({ ...state, agregar: "Agregar" }); $('.nav-tabs li ').removeClass('active'); $('.nav-tabs li').eq(0).addClass('active'); $('.tab-content div ').removeClass('in show'); $('#Listado').addClass('in show'); }} className="btn btn-secondary secondary-btn"> Cancelar</Button></Grid>}
                                                      {  state.agregar != "Consultar" && <Grid item xs> <Button fullWidth type="submit" form="formEmbalaje" className="btn btn-primary primary-btn">Aceptar</Button></Grid>}
                                                    </Grid> 
                                                    </div>
                                            </form>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="widget-wrap" id="Importar" className="tab-pane fade">
                            <div className="widget-wrap">
                                <div className="widget-content">
                                    <div className="row">
                                        <div className="col-md-12">
                                            <form className="j-forms">
                                                <div className="form-content">
                                                    <div className="col-sm-12 col-md-12 unit">



                                                    </div>
                                                </div>
                                                <br></br>
                                                <div className="col-xs-6 col-sm-3 col-md-2 col-lg-2-5 unit">
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

export default Embalaje;
