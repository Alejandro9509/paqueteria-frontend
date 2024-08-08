import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {Redirect} from "react-router-dom";
import axios from "axios";
import Noty from "noty";

function showSuccess(mensaje) {
    new Noty({
        type: "information",
        layout: "topCenter",
        text: mensaje,
        timeout: "3000"
    }).show()
}
class MyComponent extends Component {
    constructor(props) {
        super(props);
    }

    componentWillMount() {

    }

    getUrlParameter(name) {
        name = name.replace(/[\[]/, '\\[').replace(/[\]]/, '\\]');
        var regex = new RegExp('[\\?&]' + name + '=([^&#]*)');

        var results = regex.exec(this.props.location.search);
        return results === null ? '' : decodeURIComponent(results[1].replace(/\+/g, ' '));
    };

    trylogin(desencriptar) {
        let rfc = this.getUrlParameter('RFC');
        let usuario = ''
        let contrasena = ''
        if (desencriptar) {
            try {
                usuario = atob(this.getUrlParameter('usuario')); //DESENCRIPTA LAS CREDENCIALES RECIBIDAS POR EL ERP
                contrasena = atob(this.getUrlParameter('pass'));
                rfc = atob(this.getUrlParameter('RFC'));
            } catch (e) {
                usuario = this.getUrlParameter('usuario'); //SI NO PUEDE DESENCRIPTAR ES PORQUE NO ESTAN ENCRIPTADAS...
                contrasena = this.getUrlParameter('pass'); //ASI QUE SE TOMAN EN CRUDO LOS VALORES
            }
        } else {
            usuario = this.getUrlParameter('usuario'); //SI NO PUEDE DESENCRIPTAR ES PORQUE NO ESTAN ENCRIPTADAS...
            contrasena = this.getUrlParameter('pass'); //ASI QUE SE TOMAN EN CRUDO LOS VALORES
        }

        const url = `${process.env.REACT_APP_REPORT_URL}/api/ValidarLogin/'${usuario}'/'${contrasena}' `;
        axios.get(url, { headers: {'Content-Type': 'application/json', 'RFC': rfc} }).then(respuesta => {
            try {
                if (respuesta.data != undefined && respuesta.data.m_sUsuario != undefined && respuesta.data.m_sUsuario != "") {

                    localStorage.setItem("Permisos",JSON.stringify(respuesta.data.m_arrayPermisos))
                    localStorage.setItem("accessToken", true);
                    localStorage.setItem("UsuarioId", respuesta.data.m_nIdUsuario);
                    localStorage.setItem("Sucursal", respuesta.data.m_nIdSucursal);
                    localStorage.setItem("RFC", rfc);
                    localStorage.setItem("TipoUsuario", respuesta.data.m_nTipoUsuario);
                    localStorage.setItem("Email", respuesta.data.m_sCorreoElectronico);
                    localStorage.setItem("Usuario", respuesta.data.m_sUsuario);
                    localStorage.setItem("Nombre", respuesta.data.m_sNombre);
                    window.location.replace("indicadores");
                } else {
                    if (desencriptar) {
                        this.trylogin(false)
                    } else {
                        console.log('else', respuesta)
                        showSuccess(respuesta.data);
                    }
                }
            } catch {
                if (desencriptar) {
                    this.trylogin(false)
                } else {
                    console.log('catch', respuesta)
                    showSuccess(respuesta.data);
                }
            }
        });

    }
    render() {
        const rfc = this.getUrlParameter('RFC');
        // let usuario = ''
        // let contrasena = ''
        // try {
        //     usuario = atob(this.getUrlParameter('usuario')); //DESENCRIPTA LAS CREDENCIALES RECIBIDAS POR EL ERP
        //     contrasena = atob(this.getUrlParameter('pass'));
        // } catch (e) {
        //     usuario = this.getUrlParameter('usuario'); //SI NO PUEDE DESENCRIPTAR ES PORQUE NO ESTAN ENCRIPTADAS...
        //     contrasena = this.getUrlParameter('pass'); //ASI QUE SE TOMAN EN CRUDO LOS VALORES
        // }

        if(rfc) {
            // const url = `${process.env.REACT_APP_REPORT_URL}/api/ValidarLogin/'${usuario}'/'${contrasena}' `;
            // axios.get(url, { headers: {'Content-Type': 'application/json', 'RFC': rfc} }).then(respuesta => {
            //     try {
            //         if (respuesta.data != undefined && respuesta.data.m_sUsuario != undefined && respuesta.data.m_sUsuario != "") {
            //
            //             localStorage.setItem("Permisos",JSON.stringify(respuesta.data.m_arrayPermisos))
            //             localStorage.setItem("accessToken", true);
            //             localStorage.setItem("UsuarioId", respuesta.data.m_nIdUsuario);
            //             localStorage.setItem("Sucursal", respuesta.data.m_nIdSucursal);
            //             localStorage.setItem("RFC", rfc);
            //             localStorage.setItem("TipoUsuario", respuesta.data.m_nTipoUsuario);
            //             localStorage.setItem("Email", respuesta.data.m_sCorreoElectronico);
            //             localStorage.setItem("Usuario", respuesta.data.m_sUsuario);
            //             localStorage.setItem("Nombre", respuesta.data.m_sNombre);
            //             window.location.replace("indicadores");
            //         } else {
            //             console.log('else',respuesta)
            //             showSuccess(respuesta.data);
            //         }
            //     } catch {
            //         console.log('catch',respuesta)
            //         showSuccess(respuesta.data);
            //     }
            // });
            this.trylogin(true)
            return <div></div>;
        } else {
            return <Redirect push to={{
                pathname: "/",
                state: {
                    from: this.props.location,
                }
            }}/>;
        }
    }
}

MyComponent.propTypes = {};

export default MyComponent;
