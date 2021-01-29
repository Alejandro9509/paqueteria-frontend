import React from "react";
import Cabecera from "../Components/Template/Cabecera";
import BarraLateralIzquierda from "../Components/Template/BarraLateralIzquierda";
import catalogRoutes from "../routesCatalogos";
import { Link } from "react-router-dom";
import $ from "jquery";
import SvgIcon from "@material-ui/core/SvgIcon";
window.jQuery = window.$ = $;

function Catalogo() {

  const [state, setState] = React.useState({
    height: window.innerHeight
  })

  return (
    <div>
      <header className="topbar clearfix">
        <Cabecera />
      </header>

      {/*Leftbar Start Here*/}
      <aside className="iconic-leftbar" style={{ minHeight: state.height }}>
        <BarraLateralIzquierda />
      </aside>
      {/*Leftbar End Here*/}

      {/*Page Container Start Here*/}
      <section className="main-container">

        <div className="container-fluid" style={{ paddingLeft: "-5px", paddingRight: "-15px" }}>
          
          <div className="page-header filled full-block light">
            <div className="row">
              <div className="col-md-6 col-sm-6">
                <h2>Catálogos</h2>
              </div>
              <div className="col-md-6 col-sm-6">
                <ul className="list-page-breadcrumb">
                  <li className="active-page">Catálogos</li>
                </ul>
              </div>
            </div>
          </div>

          {catalogRoutes.map((r, index) => {
            return (
              <Link to={r.path}>
                <div className="col-division-md-botones col-division-sm-botones col-division-lg-botones caja-boton" style={{ textAlign: "center" }}>
                  <button
                    type="button"
                    key={index}
                    style={{ textAlign: "center", alignContent: "center" }}
                    className="boton-de-catalogos">
                    <SvgIcon
                      component={r.icon}
                      className="imagen-de-catalogos"
                      viewBox="0 0 50 50"
                    />
                  </button>
                  <label>{r.name}</label>
                </div>
              </Link>
            );
          })}
        </div>
      </section>
      {/*Page Container End Here*/}

    </div>
  );
}

export default Catalogo;
