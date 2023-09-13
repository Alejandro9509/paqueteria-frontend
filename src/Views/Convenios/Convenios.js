import React, {Component, useEffect, useMemo, useState} from 'react'
import Cabecera from "../../Components/Template/Cabecera";
import BarraLateralIzquierda from "../../Components/Template/BarraLateralIzquierda";
import {DataGrid, GridToolbar } from "@material-ui/data-grid";
import {API_HEADERS, dataGridLocaleText} from "../../Constants";
import SvgIcon from "@material-ui/core/SvgIcon";
import {ReactComponent as Activo} from "../../iconos/Menu/palomita.svg";
import {ReactComponent as NoActivo} from "../../iconos/Menu/cruz.svg";
import $ from "jquery";
import CrearTarifa from "../Tarifas/CrearTarifa";
import {Tooltip} from "@material-ui/core";
import {confirmAlert} from "react-confirm-alert";
import axios from "axios";
import Noty from "noty";
import TarifasRangos from "../Tarifas/TarifasRangos";
import {obtenerParametrosConfiguracion} from "../../Util/Contexts/ParametrosConfiguracionContext";
import {validarDerecho} from "../../Util/Util"
import {makeStyles} from "@material-ui/core/styles";
import { withStyles } from '@material-ui/core/styles';
import Tarifas from "../Tarifas/Tarifas";
import TarifasRegion from "../Tarifas/TarifasRegion";
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

const styles = {
    disabled: {
        pointerEvents: "none",
        cursor: "default",
    }
};
const useStyles = makeStyles(styles);

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

    return(
        <div>
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
        </div>
    )
}

export default Convenios;