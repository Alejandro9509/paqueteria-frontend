import React from "react";
import axios from "axios";
import {
  FormControl,
  Input, InputLabel
} from "@material-ui/core";
import $ from 'jquery';
import { sha512 } from "../Util/Sha";
const headers = {
  'Content-Type': 'application/json'
}
function Login() {

  const [state, setState] = React.useState({
    isAuthenticated: false,
    idDepartamento: 0,
    resData: ''
})
  
function login(){
  const user = $("#usuario").val();
  const rfc = $("#rfc").val();
  const pass = sha512($("#password").val());

  const url = `${process.env.REACT_APP_API_URL}/Usuarios/ValidarLogin/` +  user + "/" + pass + "/"+rfc;
    axios.get(url, { headers }).then(respuesta => {
      try{
        debugger;
      if (respuesta.data != undefined && respuesta.data.m_sUsuario != undefined && respuesta.data.m_sUsuario != ""  )
      {
        console.log(respuesta.data)
        localStorage.setItem("accessToken", true);
        localStorage.setItem("UsuarioId",respuesta.data.m_nIdUsuario);
        localStorage.setItem("Sucursal",respuesta.data.m_nIdSucursal);
        localStorage.setItem("TipoUsuario",respuesta.data.m_nTipoUsuario);
        localStorage.setItem("Email",respuesta.data.m_sCorreoElectronico);
        localStorage.setItem("Usuario",respuesta.data.m_sUsuario);
        localStorage.setItem("Nombre",respuesta.data.m_sNombre);     
        window.location.replace("configuracion");  
      }
      else
      {
        alert(respuesta.data);
      }
      }catch{
        alert(respuesta.data);
      }
    });
  
}
  
  return (
    <div className="loginBg">
      {/*Page Container Start Here*/}
      <section className="login-container">
        <div className="container">
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
        {/*Footer Start Here */}
        <footer className="login-page-footer">
          <div className="container">
            <div className="row">
              <div className="col-md-4 col-md-offset-4 col-sm-4 col-sm-offset-4">
                <div className="footer-content">
                </div>
              </div>
            </div>
          </div>
        </footer>
        {/*Footer End Here */}
      </section>
      {/*Page Container End Here*/}
</div>

  );
}

export default Login;
