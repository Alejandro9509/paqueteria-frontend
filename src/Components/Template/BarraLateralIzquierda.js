import React from "react";
import Departamento from "../../Views/Departamento";
import AM from "../Departamento/AMDepartamento";
import Login from "../../Views/Login";
import {
  Route,
  Link,
  NavLink,
} from 'react-router-dom';
import dashboardRoutes from '../../routes'
import { BrowserRouter as Router } from 'react-router-dom';

function BarraLateralDerecha() {

  function logout(){
    localStorage.removeItem("accessToken");
  }

  function cambioDePagina(){
    window.open("/AM");
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
              <li><a href="index.html">Kamrujaman Shohel</a></li>
              <li><a href="index.html">Info@jaman.me</a></li>
            </ul>
          </div>
        </div>
        <div className="admin-bar">
          <ul>
            <li>
              <a href="login" onClick={() => (logout())}>
                <i className="zmdi zmdi-power" />
              </a>
            </li>
            <li><a href="index.html"><i className="zmdi zmdi-account" />
              </a>
            </li>
            <li><a href="index.html"><i className="zmdi zmdi-key" />
              </a>
            </li>
            <li><a href="index.html"><i className="zmdi zmdi-settings" />
              </a>
            </li>
          </ul>
        </div>
      </div>
      <ul className="list-accordion">
      {
        dashboardRoutes.map((r, index) => {
          return (
            <li key={index}>
              <Link to={r.path}><i className={r.icon} /><span className="list-label">{r.name}</span></Link>
            </li>
          )
        })
      }
      </ul>
      <Route exact path="/" component={Login} />
      <Route path="/AM" component={AM} />
    </div>

  );
}

export default BarraLateralDerecha;
