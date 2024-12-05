import {Hidden} from "@mui/material";
import { Link } from 'react-router-dom';
import React, {useEffect} from "react";
import iconoAyuda from '../../iconos/Cabecera/icono_ayuda.svg';
import iconoShortcuts from '../../iconos/Cabecera/icono_shortcuts.svg';
import iconoMenu from '../../iconos/Cabecera/icono_menu.svg';
import pdfAyuda from '../../Files/AYUDA_EN_LINEA.pdf';
import IconButton from '@mui/material/IconButton';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import ListItemIcon from '@mui/material/ListItemIcon';
import Tooltip from '@mui/material/Tooltip';
import {ReactComponent as GClienteIcon} from "../../iconos/Catalogos/Icono Grupo Clientes/icono_grupo_cliente.svg";
import ExitToAppIcon from '@mui/icons-material/ExitToApp';
import HelpOutlineIcon from '@mui/icons-material/HelpOutline';

function Cabecera({ titulo, children }) {

    const menu_items = [
        {
            id: '0',
            name: 'Accesos directos',
            path: '/AccesosDirectos'
        },
        {
            id: '1',
            path: "https://gmnoticiasblog.wordpress.com/author/gmnoticiasblog/",
            name: 'GM Noticias',
        },
        {
            id: '2',
            path: "/Tutoriales",
            name: 'Tutoriales',
        },
        {
            id: '3',
            name: 'Ayuda en línea',
        },
        {
            id: '4',
            name: 'Actualizaciónes',
            path: "/Actualizacion",
        },
        {
            id: '5',
            name: 'Quejas y sugerencias',
            path: "/QuejasSugerencias",
        },
    ];

    const ITEM_HEIGHT = 48;

    function logout() {
        localStorage.removeItem("accessToken");
    }
    const [atajos, setAtajos] = React.useState([])
    const [shortcutsVisible, setShortcutsVisible] = React.useState(false);
    const [menuVisible, setMenuVisible] = React.useState(null);
    const menuOpen = Boolean(menuVisible);
    const shortcutsOpen = Boolean(shortcutsVisible);

    /*const handleShortcutsClick = (event) => {
        setShortcutsVisible(event.currentTarget);
        obtenerAtajosUsuario(localStorage.getItem("UsuarioId")).then((respuesta) => {
            setAtajos(respuesta.data)
            // console.log(respuesta.data)
        })
    };*/
    const handleShortcutsClose = () => {
        setShortcutsVisible(null);
    };
    const handleMenuClick = (event) => {
        setMenuVisible(event.currentTarget);
        // console.log(event.currentTarget);
    };
    const handleMenuClose = ()=> {
        setMenuVisible(null);
    };
    const handleMenuItemClick = (event) => {
        console.log(event.target.value);
        switch (event.target.value) {
            case 1:
                window.open("https://gmnoticiasblog.wordpress.com/author/gmnoticiasblog/");
                break;
        }
    }

    return (
        <div style={{display:"flex"}}>
            {/*Topbar Left Branding With Logo Start*/}
            
            <Hidden smDown implementation="css">
                <div className="topbar-left pull-left" style={{ backgroundColor: "#F9A03E", height: "60px" }}>
                    <div className={"widget-container"} style={{ margin: "auto", marginLeft: "70px", marginTop:"25px", display:"flex", alignItems: "center"}}>
                        <h2 style={{ position: "absolute", alignContent:"center", whiteSpace: "pre-wrap"}}>{titulo}</h2>
                    </div>
                </div>
            </Hidden>

           <div className="user-profile clearfix" style={{flexGrow:1}}>
            <div className="admin-user-info" >
                                <ul style={{ listStyleType: "none"}}>
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
            <div className="topbar-left pull-left" style={{height: "60px" }}>
                <div className="clearfix">
                    <ul className="left-branding pull-left clickablemenu ttmenu dark-style menu-color-gradient">
                      
                        <li>
                            <div className="logo">
                                <a href="index.html" title="Admin Template"><img src="iconos/LogoGM.png" alt="logo" /></a>
                            </div>
                        </li>

                    </ul>
                </div>
            </div>
            <div className="topbar-right pull-right"
                 style={
                     {
                         display:'flex',
                         flexDirection:'row',
                         alignItems: 'center',
                         height: 60
                     }
                 }>
                <div>
                    {/* <Tooltip title={"Tutoriales"}>
                            <a href={'https://drive.google.com/drive/folders/1qhJ2qJGfpkehlCP4qZChjKZhRD1375Qh'} to={{pathname: "https://drive.google.com/drive/folders/1qhJ2qJGfpkehlCP4qZChjKZhRD1375Qh"}} target="_blank">
                                <img src={iconoAyuda} style={{height: 40, width:40, margin: 10}}/>
                            </a>
                    </Tooltip> */}
                    <Tooltip title={"Tutoriales"}>
                        <Link component="a" to={{pathname: "/Tutoriales"}} target="_blank">
                                    <IconButton size="large">
                                        <img src={iconoAyuda} style={{height: 30, width:30, margin: 10}}/>
                                    </IconButton>
                        </Link>
                    </Tooltip>
                    
                   {/*  <Tooltip title={"Tutoriales"}>
                        
                                   <IconButton aria-label="help" component={Link} to={{
                                        pathname: "/Tutoriales",
                                        search:`?idSucursal=${'entro'}`,
                                        state:{
                                            idSucursal: 5
                                        }
                                        }}
                                        
                                        target="_blank">
                                        <img src={iconoAyuda} style={{height: 40, width:40, margin: 10}}/>
                                    </IconButton> */}
                               {/*  <IconButton aria-label="help" component={Link} to={{pathname: "/Tutoriales"}} >
                                    <HelpOutlineIcon/>
                                </IconButton> */}
                        {/* <a href={pdfAyuda} target={"_blank"}>
                            <img src={iconoAyuda} style={{height: 40, width:40, margin: 10}}/>
                        </a> 
                    </Tooltip>*/}
                </div>

                    <div style={{height: 40}}>
                        <div className="user-profile clearfix">
                            <div className="admin-user-thumb" style={{padding: '0px 0px 0px 0px'}}>
                                    <IconButton aria-label="delete" href="login" onClick={() => logout()} size="large">
                                      <ExitToAppIcon fontSize="large" />
                                    </IconButton>
                            </div>
                        </div>
                    </div>
        
                {/*<div style={{position: "relative"}}>
                    <Tooltip title={"Shortcuts"}>
                        <IconButton
                            style={{height:60, width:60}}
                            aria-label="shortcuts"
                            aria-controls="shortcuts-menu"
                            aria-haspopup="true"
                            onClick={handleShortcutsClick}>
                            <img src={iconoShortcuts} style={{height:30, width:30, margin: 10}}/>
                        </IconButton>
                    </Tooltip>
                    <Menu
                        id="shortcuts-menu"
                        anchorEl={shortcutsVisible}
                        keepMounted
                        open={shortcutsOpen}
                        onClose={handleShortcutsClose}
                        PaperProps={{
                            style:{
                                maxHeight: ITEM_HEIGHT * 4.5,
                                width: '20ch',
                            },
                        }}>
                        {atajos.map((option) => (
                            <Link href={option.m_sURLAtajo}>
                            <MenuItem key={option.m_nIdProceso} onClick={handleShortcutsClose}>
                                <ListItemIcon>
                                    {option.icon}
                                </ListItemIcon>
                                {option.m_sNombreAtajo}
                            </MenuItem>
                            </Link>
                        ))}
                    </Menu>
                </div>*/}
                {/*<div>
                    <Tooltip title={"Menú"}>
                        <IconButton
                            style={{height:60, width:60}}
                            aria-label="more"
                            aria-controls="menu"
                            aria-haspopup="true"
                            onClick={handleMenuClick}>
                            <img src={iconoMenu} style={{height:30, width:30, margin: 10}}/>
                        </IconButton>
                    </Tooltip>
                    <Menu
                        id="menu"
                        anchorEl={menuVisible}
                        keepMounted
                        open={menuOpen}
                        onClose={handleMenuClose}
                        PaperProps={{
                            style:{
                                maxHeight: ITEM_HEIGHT * 4.5,
                                width: '20ch',
                            },
                        }}>
                        {menu_items.map((option) => (
                            <Link href={option.path}>
                                <MenuItem key={option.id} value={option.id} onClick={handleMenuClose}>
                                    {option.name}
                                </MenuItem>
                            </Link>
                        ))}
                    </Menu>
                </div>*/}
            </div>
            {/**Se comentó ruta de navegación. No se borra porque chance y se usa despues.*/}
            {/*<Hidden smDown implementation="css">
                <div className="topbar-right pull-right iconic-aside-container" style={{ height: "60px", display: "inline-flex", width: "350px" }}>
                    <div style={{ display: "inline-block", verticalAlign: "middle", margin: "auto", marginRight: "0px", marginBottom: "0px", width: "100%" }}>
                        {children}
                    </div>
                </div>
            </Hidden>*/}
            {/*Topbar Left Branding With Logo End*/}
        </div>
    );
}

export default Cabecera;
