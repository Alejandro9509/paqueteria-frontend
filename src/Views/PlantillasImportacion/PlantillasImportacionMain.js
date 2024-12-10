import React, {useEffect} from "react";
import Cabecera from "../../Components/Template/Cabecera";
import BarraLateralIzquierda from "../../Components/Template/BarraLateralIzquierda";
import $ from "jquery";
import PlantillasImportacionListado from "./PlantillasImportacionListado";
import {
    eliminarPlantillaImportacion,
    obtenerPlantillasImportacion,
    obtenerPlantillasImportacionById
} from "../../Util/Contexts/PlantillasContext";
import PlantillasImportacionAgregar from "./PlantillasImportacionAgregar";
import {showSuccess} from "../../Util/Util";
window.jQuery = window.$ = $;

export default function PlantillasImportacionMain(){
    const TABS = {
        LISTADO: 0,
        AGREGAR: 1,
    };

    const [state, setState] = React.useState({
        listadoPlantillas: [],
        plantillaSeleccionada: null
    })

    useEffect(() => {
        obtenerListadoPlantillas()
    },[])

    const obtenerListadoPlantillas = () => {
        obtenerPlantillasImportacion().then(respuesta => {
            setState(state=>{
                return {...state, listadoPlantillas: respuesta.data.data}
            })
        })
    }

    const handleChangeTab = (tab) => {
        if (tab === TABS.LISTADO){
            obtenerListadoPlantillas()
            $('.nav-tabs li ').removeClass('active');
            $('.nav-tabs li').eq(0).addClass('active');
            $('.tab-content div ').removeClass('in show');
            $('#Listado').addClass('in show');
            setState(state => {
                return {
                    ...state, plantillaSeleccionada: null
                }
            })
        }
        if (tab === TABS.AGREGAR){
            $('.nav-tabs li ').removeClass('active');
            $('.nav-tabs li').eq(1).addClass('active');
            $('.tab-content div ').removeClass('in show');
            $('#Agregar').addClass('in show');
        }
    }

    const handleOnConsultarRowClick = (item) => {
        obtenerPlantillasImportacionById(item.idPlantilla).then(respuesta => {
            respuesta.data.data.idTipoPlantilla = respuesta.data.data.idTipoPlantilla.toString()
            setState({...state,plantillaSeleccionada: respuesta.data.data})
            handleChangeTab(TABS.AGREGAR)
        })
    }

    const handleOnEliminarRowClick = (item) => {
        eliminarPlantillaImportacion(item.idPlantilla).then(respuesta => {
            setState({...state,plantillaSeleccionada: null})
            obtenerListadoPlantillas()
            showSuccess(respuesta.data.message)
        })
    }

    const handleOnSuccessSave = () => {
        handleChangeTab(TABS.LISTADO)
    }

    return (
        <div>
            <header className="topbar clearfix">
                <Cabecera titulo={"Plantilla de importacion\nde embarques"}>
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
                                onConsultarRowClick={handleOnConsultarRowClick}
                                onEliminarRowClick={handleOnEliminarRowClick}
                                onModificarRowClick={handleOnConsultarRowClick}
                            />
                        </div>
                        <div className="widget-wrap" id="Agregar" className="tab-pane fade">
                            {
                                <PlantillasImportacionAgregar
                                    value={state.plantillaSeleccionada}
                                    onSuccessSave={handleOnSuccessSave}
                                />
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