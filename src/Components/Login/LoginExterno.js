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
const headers = {
    'Content-Type': 'application/json'
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
    render() {
        const rfc = this.getUrlParameter('RFC');
        const usuario = this.getUrlParameter('usuario');
        const contraseña = this.getUrlParameter('pass');
        if(rfc) {
            const url = `${process.env.REACT_APP_API_URL}/Usuarios/ValidarLogin/` + usuario + "/" + contraseña + "/" + rfc;
            axios.get(url, { headers }).then(respuesta => {
                try {
                    if (respuesta.data != undefined && respuesta.data.m_sUsuario != undefined && respuesta.data.m_sUsuario != "") {
                        console.log(respuesta.data)
                        localStorage.setItem("accessToken", true);
                        localStorage.setItem("UsuarioId", respuesta.data.m_nIdUsuario);
                        localStorage.setItem("Sucursal", respuesta.data.m_nIdSucursal);
                        localStorage.setItem("TipoUsuario", respuesta.data.m_nTipoUsuario);
                        localStorage.setItem("Email", respuesta.data.m_sCorreoElectronico);
                        localStorage.setItem("Usuario", respuesta.data.m_sUsuario);
                        localStorage.setItem("Nombre", respuesta.data.m_sNombre);
                        window.location.replace("indicadores");
                    }
                    else {
                        showSuccess(respuesta.data);
                    }
                } catch {
                    showSuccess(respuesta.data);
                }
            });

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
