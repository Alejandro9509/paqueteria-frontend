import React from "react";
import Cabecera from "../Components/Template/Cabecera";
import BarraLateralIzquierda from "../Components/Template/BarraLateralIzquierda";
import BarraLateralDerecha from "../Components/Template/BarraLateralDerecha";
import configurationRoutes from '../routesConfiguraciones';
import SvgIcon from "@material-ui/core/SvgIcon";
import {
  Link,
} from 'react-router-dom';
import $ from 'jquery';
window.jQuery = window.$ = $;

function Recoleccion() {

  return (
    <div>

      <header className="topbar clearfix">
        <Cabecera />
      </header>

      {/*Leftbar Start Here*/}
      <aside className="iconic-leftbar">
        <BarraLateralIzquierda />
      </aside>
      {/*Leftbar End Here*/}

      {/*Page Container Start Here*/}
      <section className="main-container">
        <div className="container-fluid">
          {configurationRoutes.map((r, index) => {
            return (

              <Link to={r.path}>
                <div className="col-md-2" style={{ textAlign: "center" }}>
                  <div className="input">
                    <button
                      type="button"
                      key={index}
                      style={{textAlign: "center", alignContent: "center"}}
                      className="boton-de-catalogos">
                      <SvgIcon
                        component={r.icon}
                        className="imagen-de-catalogos"
                        viewBox="0 0 50 60"
                      />
                    </button>
                  </div>
                  <label>{r.name}</label>
                </div>
              </Link>
            )
          })}
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

export default Recoleccion;
