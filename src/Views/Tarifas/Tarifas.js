import React, {useEffect, useState} from 'react';
import Cabecera from '../../Components/Template/Cabecera';
import BarraLateralIzquierda from '../../Components/Template/BarraLateralIzquierda';
import $ from "jquery";
import {obtenerParametrosConfiguracion} from "../../Util/Contexts/ParametrosConfiguracionContext";
import TarifasRangos from "./TarifasRangos";
import TarifasRegion from "./TarifasRegion";

window.jQuery = window.$ = $;

function Tarifa(){
    const [state, setState] = useState({
        data: [],
        agregar: "Agregar",
        height: window.innerHeight,
        CreadoPor: localStorage.getItem("UsuarioId"),
        ModificadoPor: localStorage.getItem("UsuarioId"),
        pantalla: 1,
        selected: {},
        DerechoBorrar: 1, //TODO: Definir id
        dataSucursal: [],
        columns: [],
        mostrarColumnasPesoVolumen: false,
        configuraciones: null,
    })

    useEffect(value => {
        getParametrosConfiguracion()
    }, [])

    const getParametrosConfiguracion = () =>  {
        obtenerParametrosConfiguracion().then(respuesta => {
            setState(state =>{
                return{
                    ...state,
                    configuraciones: {
                        TipoTarifaTarifas: respuesta.data.TipoTarifaTarifas || 0,
                        IdConceptoFlete: respuesta.data.IdConceptoFlete || 0,
                        IdConceptoCarga: respuesta.data.IdConceptoCarga || 0,
                        IdConceptoDescarga: respuesta.data.IdConceptoDescarga || 0,
                        IdConceptoRecoleccion: respuesta.data.IdConceptoRecoleccion || 0,
                        IdConceptoEntrega: respuesta.data.IdConceptoEntrega || 0,
                        IdConceptoSeguro: respuesta.data.IdConceptoSeguro || 0,
                        IdConceptoCita: respuesta.data.IdConceptoCita || 0,
                        CobrarConceptoCarga: respuesta.data.CobrarConceptoCarga || false,
                        CobrarConceptoDescarga: respuesta.data.CobrarConceptoDescarga || false
                    },
                }
            })
        })
    }

    return(
        <div >
            <header className="topbar clearfix">
                <Cabecera titulo="Tarifas" >
                    <div className="page-header">
                        <ul className="list-page-breadcrumb">
                            <li>
                                <a href="/Catalogos" className="color-mapeo">
                                    Catálogos <i className="zmdi zmdi-chevron-right" />
                                </a>
                            </li>
                            <li className="active-page">Tarifas</li>
                        </ul>
                    </div>
                </Cabecera>
            </header>

            {/*Leftbar Start Here*/}
            <aside className="iconic-leftbar" style={{ minHeight: state.height }}>
                <BarraLateralIzquierda />
            </aside>

            {
                state.configuraciones?.TipoTarifaTarifas === 2 &&
                    <TarifasRangos
                        configuraciones={state.configuraciones}
                    />
            }
            {
                state.configuraciones?.TipoTarifaTarifas === 3 &&
                    <TarifasRegion
                        configuraciones={state.configuraciones}
                    />
            }

        </div >
    )
}

/* export default Tarifas; */
export default Tarifa;