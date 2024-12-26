import React from "react";
import axios from "axios";
import $ from 'jquery';
import LogoGMTransportDIG from "../iconos/LogoGMTransportDIG.png"
import ERP from "../iconos/erp.png"
import Localizacion from "../iconos/Localizacion.png"
import HombreCamion from "../iconos/HombreCamion.png"
import AplicacionMovil from "../iconos/apps.png"
import LogoPaqueteria from "../iconos/LogoPaqueteria.png"
import { API_HEADERS } from "../Constants";

import Noty from 'noty';
import {showError} from "../Util/GlobalFunctions";
const headers = API_HEADERS
function showSuccess(mensaje) {
    new Noty({
        type: "information",
        layout: "topCenter",
        text: mensaje,
        timeout: "3000"
    }).show()
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
        //const pass = sha512($("#password").val());
        const pass = $("#password").val();

    const url = `${process.env.REACT_APP_REPORT_URL}/api/ValidarLogin/'${user}'/'${pass}' `;
    try {
      axios.get(url, { headers: {...headers, RFC: rfc} }).then(respuesta => {
        if(respuesta.status === 201){
          showSuccess(respuesta.data);
          return;
        }

        if (respuesta.data != undefined && respuesta.data.m_sUsuario != undefined && respuesta.data.m_sUsuario != "") {
          localStorage.setItem("Permisos",JSON.stringify(respuesta.data.m_arrayPermisos))
          localStorage.setItem("accessToken", true);
          localStorage.setItem("UsuarioId", respuesta.data.m_nIdUsuario);
          localStorage.setItem("RFC",rfc);
          localStorage.setItem("Sucursal", respuesta.data.m_nIdSucursal);
          localStorage.setItem("SucursalNombre", respuesta.data.m_sSucursal);
          localStorage.setItem("TipoUsuario", respuesta.data.m_nTipoUsuario);
          localStorage.setItem("Email", respuesta.data.m_sCorreoElectronico);
          localStorage.setItem("Usuario", respuesta.data.m_sUsuario);
          localStorage.setItem("Nombre", respuesta.data.m_sNombre);
          window.location.replace("indicadores");
        }
        else {
          showSuccess("Usuario/Contraseña inválida");
        }
      }).catch(function (error) {
        if (error.response) {
          showError(error.response.data);
        } else if (error.request) {
          showError(error.request);
        } else {
          showError(error.message);
        }
      });
    } catch (error){
      console.log(error);
    }
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
                <div style={{ marginLeft: "10%", marginTop: "20%" }}>
                    <form onSubmit={login}>
                        {/* start login */}

                        <div className="col-xs-11 col-sm-11 col-md-11 col-lg-11" style={{ textAlign: "center", paddingTop:"30%" }}>
                            <label style={{ color: "#FFFFFF", fontSize: "3vw", textAlign: "center", marginLeft: "0%" }}>
                                Bienvenido
                            </label>
                        </div>

                        <div className="col-xs-11 col-sm-11 col-md-11 col-lg-11">
                            <div className="input login-text">
                                <input style={{ fontSize: "1vw", paddingLeft:"1vw" }} className="form-control login-frm-input" type="text" id="rfc" name="rfc" placeholder="RFC"
                                    //pattern="[A-Z&Ñ]{3,4}[0-9]{2}(0[1-9]|1[010])(0[1-9]|[10][0-9]|3[01])[A-Z0-9]{2}[0-9A]"
                                       required title="Favor de introducir un RFC válido." />
                            </div>
                        </div>

                        <div className="col-xs-11 col-sm-11 col-md-11 col-lg-11">
                            <div className="input login-text">
                                <input style={{ fontSize: "1vw", paddingLeft:"1vw" }} className="form-control login-frm-input" type="text" id="usuario" name="usuario" placeholder="Usuario" required />
                            </div>
                        </div>
                        {/* end login */}

                        {/* start password */}
                        <div className="col-xs-11 col-sm-11 col-md-11 col-lg-11">
                            <div className="input login-text">
                                <input style={{ fontSize: "1vw", paddingLeft:"1vw" }} className="form-control login-frm-input" type="password" id="password" name="password" placeholder="Contraseña" required />
                            </div>
                        </div>
                        {/* end password */}

                        <div className="col-xs-11 col-sm-11 col-md-11 col-lg-11 login-text">
                            <button style={{ fontSize: "1.3vw", paddingBottom: "0px", paddingTop: "0px", marginTop: "10%"}}
                                    type="submit" className="btn-block btn btn-primary">Inicia Sesión</button>
                            <span className="hint" style={{textAlign: "center"}}>
                                <a href="#" className="link" style={{ color: "#FFFFFF" }}>¿Olvidaste la contraseña?</a>
                            </span>
                        </div>
                    </form>
                </div>
                <div className="col-xs-12 col-sm-12 col-md-12 col-lg-12" style={{ position: "absolute", bottom: "5px" }}>
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
