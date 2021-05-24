import { Hidden } from "@material-ui/core";
import React from "react";
import iconoAyuda from '../../iconos/Cabecera/icono_ayuda.svg';
import iconoShortcuts from '../../iconos/Cabecera/icono_shortcuts.svg';
import iconoMenu from '../../iconos/Cabecera/icono_menu.svg';
import pdf from './prueba.pdf';
import IconButton from '@material-ui/core/IconButton';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import MoreVertIcon from '@material-ui/icons/MoreVert';

function Cabecera({ titulo, children }) {

    const shortcuts =[
        'Item 1',
        'Item 2',
    ];
    const menu_items = [
        'Accesos director',
        'GM Noticias',
        'Tutoriales',
        'Ayuda en línea',
        'Actualizaciónes',
        'Quejas y sugerencias',
    ];

    const ITEM_HEIGHT = 48;

    function logout() {
        localStorage.removeItem("accessToken");
    }
    const [shortcutsVisible, setShortcutsVisible] = React.useState(null);
    const [menuVisible, setMenuVisible] = React.useState(null);
    const menuOpen = Boolean(menuVisible);
    const shortcutsOpen = Boolean(shortcutsVisible);

    const handleShortcutsClick = (event) => {
        setShortcutsVisible(event.currentTarget);
    };
    const handleShortcutsClose = () => {
        setShortcutsVisible(null);
    };
    const handleMenuClick = (event) => {
        setMenuVisible(event.currentTarget);
    };
    const handleMenuClose =()=> {
        setMenuVisible(null);
    };

    return (
        <div>
            {/*Topbar Left Branding With Logo Start*/}
            <div className="topbar-left pull-left">
                <div className="clearfix">
                    <ul className="left-branding pull-left clickablemenu ttmenu dark-style menu-color-gradient">
                        <li><span className="left-toggle-switch"><i className="zmdi zmdi-menu" /></span></li>
                        <li>
                            <div className="logo">
                                <a href="index.html" title="Admin Template"><img src="iconos/LogoGM.png" alt="logo" /></a>
                            </div>
                        </li>

                    </ul>
                </div>
            </div>
            <Hidden xsDown implementation="css">
                <div className="topbar-left pull-left iconic-aside-container" style={{ backgroundColor: "white", height: "60px", width:"300px" }}>
                    <div style={{ display: "inline-block", verticalAlign: "middle", margin: "auto", marginLeft: "0px" }}>
                        <h2 style={{ position: "absolute" }}>{titulo}</h2>
                    </div>

                </div>
            </Hidden>

            <div className="topbar-right pull-right iconic-aside-container" style={{display:'flex', flexDirection:'row', alignItems: 'center', height: 60}}>
                <div>
                    <a href={pdf} target={"_blank"}>
                        <img src={iconoAyuda} style={{height: 30, width:30, margin: 10}}/>
                    </a>
                </div>
                <div className="clearfix" style={{display:'block'}}>
                    <div className="user-profile-container" style={{height: 40}}>
                        <div className="user-profile clearfix">
                            <div className="admin-user-thumb" style={{padding: '0px 0px 0px 0px'}}>
                                <img src="images/avatar/jaman_01.jpg" alt="admin" />
                            </div>
                            <div className="admin-user-info">
                                <ul>
                                    <li>
                                        <a href="index.html">{localStorage.getItem("Usuario")}</a>
                                    </li>
                                    <li>
                                        <a href="index.html">{localStorage.getItem("Email")}</a>
                                    </li>
                                </ul>
                            </div>
                        </div>
                        <div className="admin-bar">
                            <ul>
                                <li>
                                    <a href="login" onClick={() => logout()}>
                                        <i className="zmdi zmdi-power" />
                                    </a>
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>
                <div style={{position: "relative"}}>
                    <IconButton
                        aria-label="shortcuts"
                        aria-controls="shortcuts-menu"
                        aria-haspopup="true"
                        onClick={handleShortcutsClick}>
                        <img src={iconoShortcuts} style={{height:30, width:30, margin: 10}}/>
                    </IconButton>
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
                        {shortcuts.map((option) => (
                            /*<a key={option} onClick={handleShortcutsClose} href={'#'}>
                                <img src={iconoShortcuts} style={{height:20, width:20, margin:10}}/>
                                <p>{option}</p>
                            </a>*/
                            <MenuItem key={option} onClick={handleShortcutsClose}>
                                {option}
                            </MenuItem>
                        ))}
                    </Menu>
                    {/*<img src={iconoShortcuts} style={{height:30, width:30, margin: 10}}/>
                    <div className="shortcuts-menu"
                         style={{
                             backgroundColor:'#FFFF',
                             display:"none",
                             gridTemplateColumns: 'auto auto auto',
                             position: "absolute"}}>
                        <a href={'#'}>
                            <img src={iconoShortcuts} style={{height:20, width:20, margin:10}}/>
                            <p>Shortcut 1</p>
                        </a>
                        <a href={'#'}>
                            <img src={iconoShortcuts} style={{height:20, width:20, margin:10}}/>
                            <p>Shortcut 2</p>
                        </a>
                        <a href={'#'}>
                            <img src={iconoShortcuts} style={{height:20, width:20, margin:10}}/>
                            <p>Shortcut 3</p>
                        </a>
                        <a href={'#'}>
                            <img src={iconoShortcuts} style={{height:20, width:20, margin:10, display:"block"}}/>
                            <p>Shortcut 4</p>
                        </a>
                    </div>*/}
                </div>
                <div>
                    <IconButton
                        aria-label="more"
                        aria-controls="menu"
                        aria-haspopup="true"
                        onClick={handleMenuClick}>
                        <img src={iconoMenu} style={{height:30, width:30, margin: 10}}/>
                    </IconButton>
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
                            <MenuItem key={option} onClick={handleMenuClose}>
                                {option}
                            </MenuItem>
                        ))}
                    </Menu>
                    {/*<img src={iconoMenu} style={{height:30, width:30, margin: 10}}/>
                    <div className="menu-items" style={{display:"none", position: "absolute", backgroundColor:'#FFFF',}}>
                        <a href="#">Accesos director</a>
                        <a href="#">GM Noticias</a>
                        <a href={'#'}>Tutoriales</a>
                        <a href={'#'}>Ayuda en línea</a>
                        <a href={'#'}>Actualizaciónes</a>
                        <a href={'#'}>Quejas y sugerencias</a>
                    </div>*/}
                </div>
            </div>
            <Hidden smDown implementation="css">
                <div className="topbar-right pull-right iconic-aside-container" style={{ height: "60px", display: "inline-flex", width: "350px" }}>
                    <div style={{ display: "inline-block", verticalAlign: "middle", margin: "auto", marginRight: "0px", marginBottom: "0px", width: "100%" }}>
                        {children}
                    </div>
                </div>
            </Hidden>
            {/*Topbar Left Branding With Logo End*/}
        </div>

    );
}

export default Cabecera;
