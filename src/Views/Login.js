import React from "react";
import axios from "axios";
import {
  FormControl,
  Input, InputLabel
} from "@material-ui/core";
import $ from 'jquery';
import { sha512 } from "../Util/Sha";

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

  function login() {
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
        <input type="image" className="gm-boton"/>
        <input type="image" src="iconos/Icono_logotipo.png"/>
        <input type="image" src="iconos/erp.png"/>
        <input type="image" src="iconos/Localizacion.png"/>
        <input type="image" src="iconos/HombreCamion.png"/>
        <input type="image" src="iconos/apps.png"/>

        <label className="copyright-texto">Copyright © 2012 Julián Gaxiola Montoya. Todos los derechos reservados.
           Grupo GM Transport S.A. de C.V. Alhóndiga de granaditas #800, Col. Independencia,
            Mexicali, Baja California, México, C.P. 21290</label>
      </div>

      <div className="split right">
        <div className="centered">
          {/* start login */}

          <div className="col-xs-12 col-sm-12 col-md-12 col-lg-12 unit">
            <div className="input login-input">
              <label className="icon-left" htmlFor="rfc">
                <i className="zmdi zmdi-account" />
              </label>
              <input className="form-control login-frm-input" type="text" id="rfc" name="rfc" placeholder="RFC" />
            </div>
          </div>

          <div className="col-xs-12 col-sm-12 col-md-12 col-lg-12 unit">
            <div className="input login-input">
              <label className="icon-left" htmlFor="usuario">
                <i className="zmdi zmdi-account" />
              </label>
              <input className="form-control login-frm-input" type="text" id="usuario" name="usuario" placeholder="Usuario" />
            </div>
          </div>
          {/* end login */}

          {/* start password */}
          <div className="col-xs-12 col-sm-12 col-md-12 col-lg-12 unit">
            <div className="input login-input">
              <label className="icon-left" htmlFor="password">
                <i className="zmdi zmdi-key" />
              </label>
              <input className="form-control login-frm-input" type="password" id="password" name="password" placeholder="Contraseña" />
              <span className="hint">
                <a href="#" className="link" style={{ color: "#FFFFFF" }}>Olvidaste la contraseña?</a>
              </span>
            </div>
          </div>
          {/* end password */}

          <div className="col-xs-12 col-sm-12 col-md-12 col-lg-12">
            <button onClick={() => login()} className="btn-block btn btn-primary">Inicia Sesión</button>
          </div>
          <div style={{textAlign: "center"}}>
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
      </div>

    </section >
  );
}

export default Login;
