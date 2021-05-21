import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Cabecera from '../../Components/Template/Cabecera';
import BarraLateralIzquierda from '../../Components/Template/BarraLateralIzquierda';
import Noty from 'noty';
import axios from "axios";
import SvgIcon from "@material-ui/core/SvgIcon";
import { ReactComponent as Activo } from "../../iconos/Menu/palomita.svg";
import { ReactComponent as NoActivo } from "../../iconos/Menu/cruz.svg";
import { DataGrid } from '@material-ui/data-grid';
import $ from "jquery";
import { dataGridLocaleText } from '../../Constants';
import { Tooltip } from '@material-ui/core';
import Viajes from './Viajes';
import Guias from './Guias';
import Embarques from './Embarques';

window.jQuery = window.$ = $;

const headers = {
    'Content-Type': 'application/json',
    //    'access-control-allow-origin': '*'
}
function showSuccess(mensaje) {
    new Noty({
        type: "information",
        layout: "topCenter",
        text: mensaje,
        timeout: "3000"
    }).show()
}


class ParametrosConfiguracion extends Component {
    constructor(props) {
        super(props);
        this.state = {

        }
        this.handleAceptar = this.handleAceptar.bind(this)
    }


    componentDidMount() {
    }

    handleAceptar(data) {
        var params = {
            m_nIdSucursal: data.sucursal,
            m_sDestino: data.destino,
            m_cFleteMinimo: data.precioFlete,
            m_bActivo: data.activo ? 1 : 0,
            m_cMontoMinimo: data.precioMinimo,
            m_cPrecioKilo: data.precioKilo,
            m_cPrecioM3: data.precioM3,
            m_arrArCobros: data.tiposCobroSeleccionado.map(c => ({ m_nIdTipoCobro: c.m_nIdTipoCobro })),
            m_arrArServicios: data.tiposServicioSeleccionado.map(s => ({ m_nIdTipoServicio: s.m_nIdTipoServicio })),
            m_arrArConceptos: data.conceptosAdicionales.map(c => ({ m_nIdConceptoFacturacion: c.concepto.m_nIdConceptoFacturacion, m_cImporte: c.importe, m_nIdImpuestoTraslada: c.traslada, m_nIdImpuestoRetiene: c.retiene, m_cImporteRetiene: c.importeRet, m_cImporteIva: c.importeIva })),
            m_nCreadoPOr: localStorage.getItem("UsuarioId"),
            m_nModificadoPor: localStorage.getItem("UsuarioId")
        }
        if (this.state.edit) {
            const url = `${process.env.REACT_APP_API_URL}/Tarifas/Modificar/` + this.state.selected.m_nIdTarifa;
            axios.put(url, Object.assign({}, params), { headers }).then(respuesta => {
                showSuccess(respuesta.data)
                this.getAllData()
                this.setState({ openDialog: false, pantalla: 1, agregar: "Agregar" })
                $('.nav-tabs li ').removeClass('active');
                $('.nav-tabs li').eq(0).addClass('active');
                $('.tab-content div ').removeClass('in show');
                $('#Listado').addClass('in show');
            }).catch(err => {
                console.log(err)
                showSuccess("err")
            });
        } else {
            const url = `${process.env.REACT_APP_API_URL}/Tarifas/Agregar`;
            axios.post(url, Object.assign({}, params), { headers }).then(respuesta => {
                showSuccess(respuesta.data)
                this.getAllData()
                this.setState({ openDialog: false, pantalla: 1, agregar: "Agregar" })
                $('.nav-tabs li ').removeClass('active');
                $('.nav-tabs li').eq(0).addClass('active');
                $('.tab-content div ').removeClass('in show');
                $('#Listado').addClass('in show');
            }).catch(err => {
                console.log(err)
                showSuccess(err)
            });
        }

    }






    render() {

        return (
            <div >
                <header className="topbar clearfix">
                    <Cabecera titulo="Parametros Configuración" >
                        <div className="page-header">
                            <ul className="list-page-breadcrumb">
                                <li>
                                    <a href="/Catalogos" className="color-mapeo">
                                        Catálogos <i className="zmdi zmdi-chevron-right" />
                                    </a>
                                </li>
                                <li className="active-page">Parametros Configuración</li>
                            </ul>
                        </div>
                    </Cabecera>
                </header>

                {/*Leftbar Start Here*/}
                <aside className="iconic-leftbar" >
                    <BarraLateralIzquierda />
                </aside>

                <section className="main-container">
                    <div className="container-fluid">


                        <ul className="nav navStatica nav-tabs">
                            <li >
                                <a data-toggle="tab" data_id="1" href="#Embarque" onClick={(event) => { event.stopPropagation(); $('.nav-tabs li ').removeClass('active'); $('.nav-tabs li').eq(0).addClass('active'); $('.tab-content div ').removeClass('in show'); $('#Embarque').addClass('in show'); }}>
                                    Orden de Embarque
                                </a>
                            </li>
                            <li >
                                <a data-toggle="tab" data_id="2" href="#Guia" onClick={(event) => { event.stopPropagation(); $('.nav-tabs li ').removeClass('active'); $('.nav-tabs li').eq(1).addClass('active'); $('.tab-content div ').removeClass('in show'); $('#Guia').addClass('in show'); }}>
                                    Guía
                                </a>
                            </li>

                            <li className="active">
                                <a data_id="3" href="#Viaje" onClick={(event) => { event.stopPropagation(); $('.nav-tabs li ').removeClass('active'); $('.nav-tabs li').eq(2).addClass('active'); $('.tab-content div ').removeClass('in show'); $('#Viaje').addClass('in show'); }}>
                                    Viajes
                                </a>
                            </li>



                            {/**<button className="topbar-right pull-right">Boton</button>*/}
                        </ul>


                        <div
                            className="row"
                            className="tab-content"
                            style={{ paddingLeft: "-15px" }}
                        >
                            <div id="Embarque" className="tab-pane fade">
                               <Embarques/>
                            </div>

                            <div id="Guia" className="tab-pane fade">
                                <Guias/>
                            </div>
                            <div id="Viaje" className="tab-pane fade in show">
                                <Viajes/>
                            </div>

                        </div>
                    </div>
                </section>
            </div >
        );
    }
}

ParametrosConfiguracion.propTypes = {

};

export default ParametrosConfiguracion;