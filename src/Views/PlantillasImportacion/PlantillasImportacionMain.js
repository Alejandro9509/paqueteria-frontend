import React, {useEffect} from "react";
import Cabecera from "../../Components/Template/Cabecera";
import BarraLateralIzquierda from "../../Components/Template/BarraLateralIzquierda";
import {Button, Grid, TextField} from "@material-ui/core";
import $ from "jquery";
import PlantillasImportacionListado from "./PlantillasImportacionListado";
import {obtenerPlantillasImportacion} from "../../Util/Contexts/PlantillasContext";
import PlantillasImportacionAgregar from "./PlantillasImportacionAgregar";
window.jQuery = window.$ = $;
export default function PlantillasImportacionMain(){
    const TABS = {
        LISTADO: 0,
        AGREGAR: 1,
    };

    const [state, setState] = React.useState({
        listadoPlantillas: []
    })

    useEffect(() => {
        obtenerListadoPlantillas()
    },[])

    const obtenerListadoPlantillas = () => {
        obtenerPlantillasImportacion().then(respuesta => {
            setState({...state, listadoPlantillas: respuesta.data.data})
        })
    }

    const handleChangeTab = (tab) => {
        if (tab === TABS.LISTADO){
            obtenerListadoPlantillas()
            $('.nav-tabs li ').removeClass('active');
            $('.nav-tabs li').eq(0).addClass('active');
            $('.tab-content div ').removeClass('in show');
            $('#Listado').addClass('in show');
        }
        if (tab === TABS.AGREGAR){
            $('.nav-tabs li ').removeClass('active');
            $('.nav-tabs li').eq(1).addClass('active');
            $('.tab-content div ').removeClass('in show');
            $('#Agregar').addClass('in show');
        }
    }

    return (
        <div >

            <header className="topbar clearfix">
                <Cabecera titulo="Plantilla de importacion de embarques">
                    {/*<div className="page-header">
                        <ul className="list-page-breadcrumb">
                            <li>
                                <a href="/Catalogos" className="color-mapeo">
                                    Catálogos <i className="zmdi zmdi-chevron-right" />
                                </a>
                            </li>
                            <li className="active-page">Embalajes</li>
                        </ul>
                    </div>*/}
                </Cabecera>
            </header>

            <aside className="iconic-leftbar">
                <BarraLateralIzquierda />
            </aside>

            <section className="main-container">
                <div className="container-fluid">
                    <ul className="nav navStatica nav-tabs">
                        <li className="active">
                            <a onClick={(event) => {
                                event.stopPropagation();
                                handleChangeTab(TABS.LISTADO)
                            }}>
                                <i className="fa fa-list"/> Listado
                            </a>
                        </li>
                        <li>
                            <a onClick={(event) => {
                                event.stopPropagation();
                                handleChangeTab(TABS.AGREGAR)
                            }}>
                                <i className="fa fa-plus-circle" /> Agregar
                            </a>
                        </li>


                    </ul>

                    <div className="row" className="tab-content">
                        <div className="widget-wrap" id="Listado" className="tab-pane fade in show">
                            <PlantillasImportacionListado
                                listado={state.listadoPlantillas}
                                onConsultarRowClick={{}}
                                onEliminarRowClick={{}}
                                onModificarRowClick={{}}
                            />
                        </div>

                        <div className="widget-wrap" id="Agregar" className="tab-pane fade">
                            {/*<div className="widget-wrap">
                                <div className="widget-content">
                                    <div className="row">
                                        <div className="col-md-12">
                                            <form className="j-forms" id="formEmbalaje" onSubmit={handleAceptar}>
                                                <div className="form-content">
                                                    ****************************************Codigo***********************************************************
                                                    <div className="col-xs-4 col-sm-3 col-md-2-5 col-lg-2-5 unit">

                                                        <div className="input">
                                                            <TextField variant="outlined" margin="dense" label="Código"
                                                                       onChange={handleChange}
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
                                                    ****************************************Nombre***********************************************************
                                                    <div className="col-xs-4 col-sm-3 col-md-2-5 col-lg-2-5 unit">

                                                        <div className="input">
                                                            <TextField variant="outlined" margin="dense" label="Nombre"
                                                                       onChange={handleChange}
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
                                                    ****************************************Descripción******************************************************
                                                    <div className="col-xs-4 col-sm-3 col-md-2-5 col-lg-2-5 unit">
                                                        <div className="input">
                                                            <TextField variant="outlined" margin="dense" label="Descripción"
                                                                       onChange={handleChange}
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
                            </div>*/}
                            {
                                <PlantillasImportacionAgregar/>
                            }
                        </div>

                    </div>
                </div>

            </section>
            {/*Page Container End Here*/}

            {/*Rightbar Start Here*/}
            {/*<aside className="rightbar">
                <BarraLateralDerecha />
            </aside>*/}

        </div>
    );
}