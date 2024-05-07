import React from "react";
import AM from "../Departamento/AMDepartamento";
import Login from "../../Views/Login";
import { Route, Link, NavLink } from "react-router-dom";
import dashboardRoutes from "../../routes";
import SvgIcon from "@mui/material/SvgIcon";

function BarraLateralDerecha() {

  const [state, setState] = React.useState({
    height: window.innerHeight
  })

  function logout() {
    localStorage.removeItem("accessToken");
  }

  return (
    <div className="iconic-aside-container">
      <ul className="list-accordion">
        {dashboardRoutes.map((r, index) => {
            if (!r.visible){
                return ""
            }
          return !r.newWindow ? (

            <li  className="boton-de-menu">
              <Link component="a" to={r.path}>
                <i>
                  <SvgIcon
                    component={r.icon}
                    style={{
                      height: "100%",
                      textAlign: "center",
                      width: "75%",
                    }}
                    viewBox="0 0 45 45"
                  />
                </i>
                <span className="list-label">{r.name}</span>
              </Link>
            </li>
          ) : (
              <li  className="boton-de-menu">
                  <Link component="a" target={"_blank"} to={r.path}>
                      <i>
                          <SvgIcon
                              component={r.icon}
                              style={{
                                  height: "100%",
                                  textAlign: "center",
                                  width: "70%",
                              }}
                              viewBox="0 0 40 40"
                          />
                      </i>
                      <span className="list-label">{r.name}</span>
                  </Link>
              </li>
          )
        })}
      </ul>
      <Route exact path="/" component={Login} />
      <Route path="/AM" component={AM} />
    </div>
  );
}

export default BarraLateralDerecha;
