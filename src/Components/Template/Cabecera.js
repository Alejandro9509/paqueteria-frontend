import React from "react";

function Cabecera({ rutas }) {

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
      {/*Topbar Left Branding With Logo End*/}
    </div>

  );
}

export default Cabecera;
