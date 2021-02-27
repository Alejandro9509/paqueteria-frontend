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
        <div className="col-md-4 col-md-offset-4 col-sm-4 col-sm-offset-4">
          <div className="login-form-container">
            <div className="row">

              <div className="login-form-header">
                <div className="logo">
                  <a href="index.html" title="Admin Template"><img src="iconos/GM-naranja.png" width="230" height="58" alt="logo" /></a>
                </div>
              </div>
              <div className="login-form-content">
                {/* start login */}

                <div className="unit">
                  <div className="input login-input">
                    <label className="icon-left" htmlFor="login">
                      <i className="zmdi zmdi-account" />
                    </label>
                    <input className="form-control login-frm-input" type="text" id="rfc" name="rfc" placeholder="RFC" />
                  </div>
                </div>
                <div className="unit">
                  <div className="input login-input">
                    <label className="icon-left" htmlFor="login">
                      <i className="zmdi zmdi-account" />
                    </label>
                    <input className="form-control login-frm-input" type="text" id="usuario" name="usuario" placeholder="Usuario" />
                  </div>
                </div>
                {/* end login */}
                {/* start password */}
                <div className="unit">
                  <div className="input login-input">
                    <label className="icon-left" htmlFor="Contraseña">
                      <i className="zmdi zmdi-key" />
                    </label>
                    <input className="form-control login-frm-input" type="password" id="password" name="password" placeholder="Password" />
                    <span className="hint">
                      <a href="#" className="link">Olvidaste la contraseña?</a>
                    </span>
                  </div>
                </div>
                {/* end password */}
                {/* start keep logged */}

                {/* end keep logged */}
                {/* start response from server */}
                <div className="response" />
                {/* end response from server */}
              </div>
              <div className="login-form-footer">
                <button onClick={() => login()} className="btn-block btn btn-primary">Inicia Sesión</button>
              </div>

            </div>
          </div>
        </div>
      </div>

      <div className="split right">
        <div className="login-form-container">
          <div className="row">

            <div className="login-form-header">
              <div className="logo">
                <a href="index.html" title="Admin Template"><img src="iconos/GM-naranja.png" width="230" height="58" alt="logo" /></a>
              </div>
            </div>

            <div className="login-form-content centered">
              {/* start login */}

              <div className="col-xs-11 col-sm-11 col-md-11 col-lg-11 unit">
                <div className="input login-input">
                  <label className="icon-left" htmlFor="login">
                    <i className="zmdi zmdi-account" />
                  </label>
                  <input className="form-control login-frm-input" type="text" id="rfc" name="rfc" placeholder="RFC" />
                </div>
              </div>

              <div className="col-xs-11 col-sm-11 col-md-11 col-lg-11 unit">
                <div className="input login-input">
                  <label className="icon-left" htmlFor="login">
                    <i className="zmdi zmdi-account" />
                  </label>
                  <input className="form-control login-frm-input" type="text" id="usuario" name="usuario" placeholder="Usuario" />
                </div>
              </div>
              {/* end login */}

              {/* start password */}
              <div className="col-xs-11 col-sm-11 col-md-11 col-lg-11 unit">
                <div className="input login-input">
                  <label className="icon-left" htmlFor="Contraseña">
                    <i className="zmdi zmdi-key" />
                  </label>
                  <input className="form-control login-frm-input" type="password" id="password" name="password" placeholder="Password" />
                  <span className="hint">
                    <a href="#" className="link">Olvidaste la contraseña?</a>
                  </span>
                </div>
              </div>
              {/* end password */}

              <div className="col-xs-11 col-sm-11 col-md-11 col-lg-11">
                <button onClick={() => login()} className="btn-block btn btn-primary">Inicia Sesión</button>
              </div>

            </div>

          </div>

          <div className="login-form-footer" style={{}}>
            <button className="buttonCircle">
              <a href="http://www.facebook.com/GMTransportOficial/" target="_blank">
                <i className="fa fa-facebook" />
              </a>
            </button>
            <button className="buttonCircle">
              <a href=" https://www.instagram.com/grupogmtransport" target="_blank">
                <i className="fa fa-instagram" />
              </a>
            </button>
            <button className="buttonCircle">
              <a href="http://bit.ly/paqueteriaGM" target="_blank">
                <i className="fa fa-whatsapp" />
              </a>
            </button>
            <button className="buttonCircle">
              <a href="https://twitter.com/gmtransporterp?lang=es" target="_blank">
                <i className="fa fa-twitter" />
              </a>
            </button>
          </div>

        </div>
      </div>

    </section >
  );
}

export default Login;
