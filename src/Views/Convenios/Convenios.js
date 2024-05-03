import React, {Component, useEffect, useMemo, useState} from 'react'
import Cabecera from "../../Components/Template/Cabecera";
import BarraLateralIzquierda from "../../Components/Template/BarraLateralIzquierda";
import {API_HEADERS, dataGridLocaleText} from "../../Constants";
import {ReactComponent as Activo} from "../../iconos/Menu/palomita.svg";
import {ReactComponent as NoActivo} from "../../iconos/Menu/cruz.svg";
import $ from "jquery";
import Noty from "noty";
import TarifasRangos from "../Tarifas/TarifasRangos";
import {obtenerParametrosConfiguracion} from "../../Util/Contexts/ParametrosConfiguracionContext";
import {validarDerecho} from "../../Util/Util"
import styled from "@mui/styles/styled";
import Tarifas from "../Tarifas/Tarifas";
import TarifasRegion from "../Tarifas/TarifasRegion";
const PREFIX = 'Convenios';

const classes = {
    disabled: `${PREFIX}-disabled`
};

const Root = styled('div')({
    [`& .${classes.disabled}`]: {
        pointerEvents: "none",
        cursor: "default",
    }
});

window.jQuery = window.$ = $;

const headers = API_HEADERS
function showSuccess(mensaje) {
    new Noty({
        type: "information",
        layout: "topCenter",
        text: mensaje,
        timeout: "3000"
    }).show()
}

function Convenios(){
    const [configuraciones, setConfiguraciones] = useState(null)


    useEffect(value => {
        getParametrosConfiguracion()
    }, [])

    const getParametrosConfiguracion = () => {
        obtenerParametrosConfiguracion().then(respuesta => {
            setConfiguraciones({
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
            })

        })
    }

    return (
        <Root>
            <header className="topbar clearfix">
                <Cabecera titulo="Convenios" >
                    <div className="page-header">
                        <ul className="list-page-breadcrumb">
                            <li>
                                <a href="/Catalogos" className="color-mapeo">
                                    Catálogos <i className="zmdi zmdi-chevron-right" />
                                </a>
                            </li>
                            <li className="active-page">Convenios</li>
                        </ul>
                    </div>
                </Cabecera>
            </header>
            {/*Leftbar Start Here*/}
            <aside className="iconic-leftbar">
                <BarraLateralIzquierda />
            </aside>
            {/*Leftbar End Here*/}
            {
                configuraciones?.TipoTarifaTarifas === 2 &&
                    <TarifasRangos
                        configuraciones={configuraciones}
                        convenio={true}
                    />

            }
            {
                configuraciones?.TipoTarifaTarifas === 3 &&
                <TarifasRegion
                    configuraciones={configuraciones}
                    convenio={true}
                />
            }
        </Root>
    );
}

export default Convenios;