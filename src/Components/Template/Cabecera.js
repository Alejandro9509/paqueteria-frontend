import {Hidden} from "@mui/material";
import { Link } from 'react-router-dom';
import React from "react";
import iconoAyuda from '../../iconos/Cabecera/icono_ayuda.svg';
import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';
import ExitToAppIcon from '@mui/icons-material/ExitToApp';

function Cabecera({ titulo }) {

    function logout() {
        localStorage.removeItem("accessToken");
        localStorage.removeItem("Back");
        localStorage.removeItem("Permisos")
        localStorage.removeItem("UsuarioId");
        localStorage.removeItem("Sucursal");
        localStorage.removeItem("RFC");
        localStorage.removeItem("TipoUsuario");
        localStorage.removeItem("Email");
        localStorage.removeItem("Usuario");
        localStorage.removeItem("Nombre");
    }

    return (
        <div style={{display: "flex"}}>
          

            <Hidden smDown implementation="css">
                <div className="topbar-left pull-left" style={{backgroundColor: "#F9A03E", height: "60px"}}>
                    <div className={"widget-container"} style={{
                        margin: "auto",
                        marginLeft: "70px",
                        marginTop: "30px",
                        display: "flex",
                        alignItems: "center"
                    }}>
                        <h2 style={{position: "absolute", alignContent: "center", whiteSpace: "pre-wrap"}}>{titulo}</h2>
                    </div>
                </div>
            </Hidden>

            <div className="user-profile clearfix" style={{flexGrow: 1}}>
                <div className="admin-user-info">
                    <ul style={{listStyleType: "none"}}>
                        <li>
                            <a href="index.html">{localStorage.getItem("Nombre")}</a>
                        </li>
                        <li>
                            SUCURSAL: <a href="index.html">{localStorage.getItem("SucursalNombre")}</a>
                        </li>
                        <li>
                            CORREO: <a href="index.html">{localStorage.getItem("Email")}</a>
                        </li>
                        <li>
                            RFC: <a href="index.html">{localStorage.getItem("RFC")}</a>
                        </li>
                    </ul>
                </div>
            </div>
            <div>
                VERSION: 1.7.42
            </div>
            <div className="topbar-left pull-left" style={{height: "60px"}}>
                <div className="clearfix">
                    <ul className="left-branding pull-left clickablemenu ttmenu dark-style menu-color-gradient">
                        <li>
                            <div className="logo">
                                <a href="index.html" title="Admin Template"><img src="iconos/LogoGM.png"
                                                                                 alt="logo"/></a>
                            </div>
                        </li>
                    </ul>
                </div>
            </div>

            <div className="topbar-right pull-right"
                 style={{display: 'flex', flexDirection: 'row', alignItems: 'center', height: 60}}>
                <div>
 
                    <Tooltip title={"Tutoriales"}>
                        <Link component="a" to={{pathname: "/Tutoriales"}} target="_blank">
                            <IconButton size="large">
                                <img src={iconoAyuda} style={{height: 30, width: 30, margin: 10}}/>
                            </IconButton>
                        </Link>
                    </Tooltip>

                </div>

                <div style={{height: 40}}>
                    <div className="user-profile clearfix">
                        <div className="admin-user-thumb" style={{padding: '0px 0px 0px 0px'}}>
                            <IconButton aria-label="delete" href="login" onClick={() => logout()} size="large">
                                <ExitToAppIcon fontSize="large"/>
                            </IconButton>
                        </div>
                    </div>
                </div>

            </div>
          
        </div>
    );
}

export default Cabecera;
