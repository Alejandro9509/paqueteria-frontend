import React from "react";
import Cabecera from "../Components/Template/Cabecera";
import BarraLateralIzquierda from "../Components/Template/BarraLateralIzquierda";
import catalogRoutes from "../routesCatalogos";
import { Link } from "react-router-dom";
import $ from "jquery";
import SvgIcon from "@material-ui/core/SvgIcon";
window.jQuery = window.$ = $;

function Catalogo() {

  const ruta = [
    {
      actual : true,
      nombre: "Catálogos",
      ruta: "/Catalogos"
    },
  ];

  return (
    <div>
      <header className="topbar clearfix">
        <Cabecera rutas={ruta}/>
      </header>

      {/*Leftbar Start Here*/}
      <aside className="iconic-leftbar">
        <BarraLateralIzquierda />
      </aside>
      {/*Leftbar End Here*/}

      {/*Page Container Start Here*/}
      <section className="main-container">
        <div className="container-fluid">
          {catalogRoutes.map((r, index) => {
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
            );
          })}
        </div>
      </section>
      {/*Page Container End Here*/}

    </div>
  );
}

export default Catalogo;
