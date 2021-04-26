import React from "react";

function Cabecera({ rutas }) {

  function logout() {
    localStorage.removeItem("accessToken");
  }

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
      <div className="topbar-right pull-right iconic-aside-container">
        <div className="clearfix">
          <div className="user-profile-container">
            <div className="user-profile clearfix">
              <div className="admin-user-thumb">
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
      </div>
      {/*Topbar Left Branding With Logo End*/}
    </div>

  );
}

export default Cabecera;
