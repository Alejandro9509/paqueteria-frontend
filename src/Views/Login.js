import React from "react";
import axios from "axios";
import {
  FormControl,
  Input, InputLabel
} from "@material-ui/core";
import $ from 'jquery';
import { sha512 } from "../Util/Sha";
import LogoGMTransportDIG from "../iconos/LogoGMTransportDIG.png"
import ERP from "../iconos/erp.png"
import Localizacion from "../iconos/Localizacion.png"
import HombreCamion from "../iconos/HombreCamion.png"
import AplicacionMovil from "../iconos/apps.png"
import LogoPaqueteria from "../iconos/LogoPaqueteria.png"

import Noty from 'noty';

function showSuccess(mensaje) {
  new Noty({
    type: "information",
    layout: "topCenter",
    text: mensaje,
    timeout: "3000"
  }).show()
}

const headers = {
  'Content-Type': 'application/json'
}
function Login() {

  const [state, setState] = React.useState({
    isAuthenticated: false,
    idDepartamento: 0,
    resData: ''
  })

  const login = (e) => {
    e.preventDefault();
    const user = $("#usuario").val();
    const rfc = $("#rfc").val();
    const pass = sha512($("#password").val());

    const url = `${process.env.REACT_APP_API_URL}/Usuarios/ValidarLogin/` + user + "/" + pass + "/" + rfc;
    axios.get(url, { headers }).then(respuesta => {
      try {
        debugger;
        if (respuesta.data != undefined && respuesta.data.m_sUsuario != undefined && respuesta.data.m_sUsuario != "") {
          console.log(respuesta.data)
          localStorage.setItem("accessToken", true);
          localStorage.setItem("UsuarioId", respuesta.data.m_nIdUsuario);
          localStorage.setItem("Sucursal", respuesta.data.m_nIdSucursal);
          localStorage.setItem("TipoUsuario", respuesta.data.m_nTipoUsuario);
          localStorage.setItem("Email", respuesta.data.m_sCorreoElectronico);
          localStorage.setItem("Usuario", respuesta.data.m_sUsuario);
          localStorage.setItem("Nombre", respuesta.data.m_sNombre);
          window.location.replace("configuracion");
        }
        else {
          showSuccess(respuesta.data);
        }
      } catch {
        showSuccess(respuesta.data);
      }
    });

  }

  return (
    <section className="login-container" >
      <div className="split left">
        <div style={{ display: "inline-flex", width: "100%" }}>
          <input type="image" className="imagenes-login" src={LogoGMTransportDIG} />
          <input type="image" className="imagenes-login" src={ERP} />
          <input type="image" className="imagenes-login" src={Localizacion} />
          <input type="image" className="imagenes-login" src={HombreCamion} />
          <input type="image" className="imagenes-login" src={AplicacionMovil} />
        </div>
        <div className="logo-paqueteria">
          <img className="imagen-logo-paqueteria" src={LogoPaqueteria}></img>
        </div>
        <div className="caja-copyright">
          <label className="copyright-texto">Copyright © 2012 Julián Gaxiola Montoya. Todos los derechos reservados.
          Grupo GM Transport S.A. de C.V. Alhóndiga de granaditas #800, Col. Independencia,
          Mexicali, Baja California, México, C.P. 21290
        </label>

        </div>
      </div>

      <div className="split right">
        <div style={{marginLeft: "10%", marginTop: "20%"}}>
          <form onSubmit={login}>
            {/* start login */}

            <div className="col-xs-12 col-sm-12 col-md-12 col-lg-12" style={{ textAlign: "center" }}>
              <label style={{ color: "#FFFFFF", fontSize: "3vw", textAlign: "center", marginLeft:"0%"}}>
                Bienvenido
              </label>
            </div>

            <div className="col-xs-11 col-sm-11 col-md-11 col-lg-11">
              <div className="input login-input login-text">
                <label className="icon-left" htmlFor="rfc">
                  <i className="zmdi zmdi-account" />
                </label>
                <input style={{ fontSize: "1vw" }} className="form-control login-frm-input" type="text" id="rfc" name="rfc" placeholder="RFC"
                  pattern="[A-Z&Ñ]{3,4}[0-9]{2}(0[1-9]|1[010])(0[1-9]|[10][0-9]|3[01])[A-Z0-9]{2}[0-9A]"
                  required title="Favor de introducir un RFC válido." />
              </div>
            </div>

            <div className="col-xs-11 col-sm-11 col-md-11 col-lg-11">
              <div className="input login-input login-text">
                <label className="icon-left" htmlFor="usuario">
                  <i className="zmdi zmdi-account" />
                </label>
                <input style={{ fontSize: "1vw" }} className="form-control login-frm-input" type="text" id="usuario" name="usuario" placeholder="Usuario" required />
              </div>
            </div>
            {/* end login */}

            {/* start password */}
            <div className="col-xs-11 col-sm-11 col-md-11 col-lg-11">
              <div className="input login-input login-text">
                <label className="icon-left" htmlFor="password">
                  <i className="zmdi zmdi-key" />
                </label>
                <input style={{ fontSize: "1vw" }} className="form-control login-frm-input" type="password" id="password" name="password" placeholder="Contraseña" required />
                <span className="hint">
                  <a href="#" className="link" style={{ color: "#FFFFFF" }}>Olvidaste la contraseña?</a>
                </span>
              </div>
            </div>
            {/* end password */}

            <div className="col-xs-11 col-sm-11 col-md-11 col-lg-11 login-text">
              <button style={{ fontSize: "1vw" }} type="submit" className="btn-block btn btn-primary">Inicia Sesión</button>
            </div>

            <div className="col-xs-12 col-sm-12 col-md-12 col-lg-12" style={{ textAlign: "center" }}>
              <label style={{ color: "#FFFFFF", fontSize: "1vw", textAlign: "center", marginLeft:"0%"}}>
                Versión 1.0
              </label>
            </div>


          </form>

        </div>
        <div style={{ position: "absolute", bottom: "5px" }}>
          <ul className="social-media">
            <li className="social-media-item">
              <a href="http://www.facebook.com/GMTransportOficial/" target="_blank">
                <i className="fa fa-facebook circle-icon" />
              </a>
            </li>
            <li className="social-media-item">
              <a href=" https://www.instagram.com/grupogmtransport" target="_blank">
                <i className="fa fa-instagram circle-icon" />
              </a>
            </li>
            <li className="social-media-item">
              <a href="http://bit.ly/paqueteriaGM" target="_blank">
                <i className="fa fa-whatsapp circle-icon" />
              </a>
            </li>
            <li className="social-media-item">
              <a href="https://twitter.com/gmtransporterp?lang=es" target="_blank">
                <i className="fa fa-twitter circle-icon" />
              </a>
            </li>
          </ul>
        </div>
      </div>

    </section >
  );
}

export default Login;
