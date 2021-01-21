import React from "react";
import AM from "../Departamento/AMDepartamento";
import Login from "../../Views/Login";
import { Route, Link, NavLink } from "react-router-dom";
import dashboardRoutes from "../../routes";
import SvgIcon from "@material-ui/core/SvgIcon";

function BarraLateralDerecha() {

  const [state, setState] = React.useState({
    height: window.innerHeight
  })

  function logout() {
    localStorage.removeItem("accessToken");
  }

  return (
    <div className="iconic-aside-container">
      <div className="user-profile-container">
        <div className="user-profile clearfix">
          <div className="admin-user-thumb">
            <img src="images/avatar/jaman_01.jpg" alt="admin" />
          </div>
          <div className="admin-user-info">
            <ul>
              <li>
                <a href="index.html">Kamrujaman Shohel</a>
              </li>
              <li>
                <a href="index.html">Info@jaman.me</a>
              </li>
            </ul>
          </div>
        </div>
        <div className="admin-bar">
          <ul>
            <li>
              <a href="login" onClick={() => logout()}>
                <i className="zmdi zmdi-power" />
              </a>
            </li>
            <li>
              <a href="index.html">
                <i className="zmdi zmdi-account" />
              </a>
            </li>
            <li>
              <a href="index.html">
                <i className="zmdi zmdi-key" />
              </a>
            </li>
            <li>
              <a href="index.html">
                <i className="zmdi zmdi-settings" />
              </a>
            </li>
          </ul>
        </div>
      </div>
      <ul className="list-accordion">
        {dashboardRoutes.map((r, index) => {
          return r.single ? (
            <li>
              <Link component="a" to={r.path}>
                <i>
                  <SvgIcon
                    component={r.icon}
                    style={{
                      height: "100%",
                      textAlign: "center",
                      width: "50%",
                    }}
                    viewBox="0 0 40 40"
                  />
                </i>
                <span className="list-label">{r.name}</span>
              </Link>
            </li>
          ) : (
            <li>
              <a href="#">
                <i>
                  <SvgIcon
                    component={r.icon}
                    style={{
                      height: "100%",
                      textAlign: "center",
                      width: "50%",
                    }}
                    viewBox="0 0 40 40"
                  />
                </i>
                <span className="list-label">{r.name}</span>
              </a>
              <ul>
                {r.child.map((c) => (
                  <li key={c.name}>
                    <Link component="a" to={c.path}>
                      {c.name}
                    </Link>
                  </li>
                ))}
              </ul>
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
