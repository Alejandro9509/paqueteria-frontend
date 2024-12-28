import React, {useEffect} from "react";
import Cabecera from "../../Components/Template/Cabecera";
import BarraLateralIzquierda from "../../Components/Template/BarraLateralIzquierda";
import $ from "jquery";
import PlantillasImportacionTarifasListado from "./PlantillasImportacionTarifasListado";
import {
    eliminarPlantillaImportacionTarifas,
    obtenerPlantillasImportacionTarifas,
    obtenerPlantillasImportacionTarifasById
} from "../../Util/Contexts/PlantillasTarifasContext";
import PlantillasImportacionTarifasAgregar from "./PlantillasImportacionTarifasAgregar";
import {showSuccess} from "../../Util/Util";
window.jQuery = window.$ = $;

export default function PlantillasImportacionTarifas(){
    const TABS = {
        LISTADO: 0,
        AGREGAR: 1,
    };

    const [state, setState] = React.useState({
        listadoPlantillas: [],
        plantillaSeleccionada: null
    })

    useEffect(() => {
        obtenerListadoPlantillas();
    },[])

    const obtenerListadoPlantillas = () => {
        obtenerPlantillasImportacionTarifas().then(respuesta => {
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
        obtenerPlantillasImportacionTarifasById(item.idPlantilla).then(respuesta => {
            respuesta.data.data.idTipoPlantilla = respuesta.data.data.idTipoPlantilla.toString()
            setState({...state,plantillaSeleccionada: respuesta.data.data})
            handleChangeTab(TABS.AGREGAR)
        })
    }

    const handleOnEliminarRowClick = (item) => {
        eliminarPlantillaImportacionTarifas(item.idPlantilla).then(respuesta => {
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
                <Cabecera titulo={"Plantillas de importacion\nde tarifas"}>
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
                            <PlantillasImportacionTarifasListado
                                listado={state.listadoPlantillas}
                                onConsultarRowClick={handleOnConsultarRowClick}
                                onEliminarRowClick={handleOnEliminarRowClick}
                                onModificarRowClick={handleOnConsultarRowClick}
                            />
                        </div>
                        <div className="widget-wrap" id="Agregar" className="tab-pane fade">
                            {
                                <PlantillasImportacionTarifasAgregar
                                    value={state.plantillaSeleccionada}
                                    onSuccessSave={handleOnSuccessSave}
                                />
                            }
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
}