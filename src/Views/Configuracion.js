import React from "react";
import Cabecera from "../Components/Template/Cabecera";
import BarraLateralIzquierda from "../Components/Template/BarraLateralIzquierda";
import BarraLateralDerecha from "../Components/Template/BarraLateralDerecha";
import configurationRoutes from '../routesConfiguraciones';
import SvgIcon from "@mui/material/SvgIcon";
import {
    Link,
} from 'react-router-dom';
import $ from 'jquery';
import { Dialog, DialogActions, DialogContent, DialogTitle } from "@mui/material";
import CuentasCorreo from "./CuentasCorreo/CuentasCorreo";
window.jQuery = window.$ = $;

function Configuracion() {

    const [state, setState] = React.useState({
        height: window.innerHeight,
        openDialog: false,
    })

    function closeDialog() {
        setState({ ...state, openDialog: false })
    }


    return (
        <div>
            <Dialog open={state.openDialog} onClose={() => setState({ ...state, openDialog: false })} maxWidth={"sm"} fullWidth>
                <DialogTitle>
                    <h4>Configuración de Cuentas de Correo</h4>
                </DialogTitle>
                <DialogContent>
                    <CuentasCorreo closeDialog={closeDialog} />
                </DialogContent>
            </Dialog>

            <header className="topbar clearfix">
                <Cabecera titulo="Configuración" >
                    <div className="page-header">
                        <ul className="list-page-breadcrumb">
                            <li className="active-page">Configuración</li>
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



                    <div style={{ display: "flex", flexWrap: "wrap" }}>
                        {configurationRoutes.map((r, index) => {
                            if (!r.visible){
                                return ""
                            }
                            return (
                                r.isDialog ?
                                    <div className="caja-boton">
                                        <button
                                            type="button"
                                            key={index}
                                            style={{ textAlign: "center", alignContent: "center" }}
                                            className="boton-de-catalogos"
                                            onClick={() => setState({ ...state, openDialog: true })}>
                                            {r.icon}
                                        </button>
                                        <br></br>
                                        <label style={{ alignSelf: "center", paddingTop: "10px" }}>{r.name}</label>
                                        <br></br>
                                    </div>
                                    :
                                    <Link to={r.path}>
                                        <div className="caja-boton">
                                            <button
                                                type="button"
                                                key={index}
                                                style={{ textAlign: "center", alignContent: "center" }}
                                                className="boton-de-catalogos">
                                                {r.icon}
                                            </button>
                                            <br></br>
                                            <label style={{ alignSelf: "center", paddingTop: "10px" }}>{r.name}</label>
                                            <br></br>
                                        </div>
                                    </Link>
                            );
                        })}
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

export default Configuracion;
