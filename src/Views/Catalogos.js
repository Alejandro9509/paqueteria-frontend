import React from "react";
import Cabecera from "../Components/Template/Cabecera";
import BarraLateralIzquierda from "../Components/Template/BarraLateralIzquierda";
import catalogRoutes from "../routesCatalogos";
import { Link } from "react-router-dom";
import $ from "jquery";
import SvgIcon from "@mui/material/SvgIcon";
import {validarDerecho} from "../Util/Util"

window.jQuery = window.$ = $;

function Catalogo() {


    return (
        <div >

            <header className="topbar clearfix">
                <Cabecera titulo="Catálogos" >
                    <div className="page-header">
                        <ul className="list-page-breadcrumb">
                            <li className="active-page">Catálogos</li>
                        </ul>
                    </div>
                </Cabecera>
            </header>

            <aside className="iconic-leftbar">
                <BarraLateralIzquierda />
            </aside>

            <section className="main-container">

                <div className="container-fluid" style={{ paddingLeft: "-5px", paddingRight: "-15px", justifyContent: "flex-start" }}>



                    <div style={{ display: "flex", flexWrap: "wrap" }}>
                        {catalogRoutes.map((r, index) => {
                            if (!r.visible){
                                return ""
                            }
                            return (
                                <Link to={r.path} key={index}>
                                    <div className="caja-boton">
                                        <button
                                            type="button"
                                            key={index}
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
        </div>
    );
}

export default Catalogo;
