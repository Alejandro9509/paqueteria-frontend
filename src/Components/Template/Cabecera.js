import React from "react";

function Cabecera() {

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
        {/*Mobile Search and Rightbar Toggle*/}
        <ul className="branding-right pull-right">
          <li><a href="index.html" className="btn-mobile-search btn-top-search"><i className="zmdi zmdi-search" /></a></li>
          <li><a href="index.html" className="btn-mobile-bar"><i className="zmdi zmdi-menu" /></a></li>
        </ul>
      </div>
    </div>
    {/*Topbar Left Branding With Logo End*/}

    {/*Topbar Right Start*/}
    <div className="topbar-right pull-right">
      <div className="clearfix">
        {/*Mobile View Leftbar Toggle*/}
        <ul className="left-bar-switch pull-left">
          <li><span className="left-toggle-switch"><i className="zmdi zmdi-menu" /></span></li>
        </ul>
        <ul className="pull-right top-right-icons">
          <li className="dropdown apps-dropdown">
            <a href="index.html" className="btn-apps dropdown-toggle" data-toggle="dropdown"><i className="zmdi zmdi-apps" /></a>
            <div className="dropdown-menu">
              <ul className="apps-shortcut clearfix">
                <li>
                  <a href="index.html"><i className="zmdi zmdi-email" />
                    <span className="apps-noty">23</span>
                    <span className="apps-label">Email</span>
                  </a>
                </li>
                <li>
                  <a href="index.html"><i className="zmdi zmdi-accounts-alt" />
                    <span className="apps-noty">15</span>
                    <span className="apps-label">Forum</span>
                  </a>
                </li>
                <li>
                  <a href="index.html"><i className="zmdi zmdi-file-text" />
                    <span className="apps-label">Note</span>
                  </a>
                </li>
                <li>
                  <a href="index.html"><i className="zmdi zmdi-chart" />
                    <span className="apps-label">Analytics</span>
                  </a>
                </li>
              </ul>
              <ul className="more-apps">
                <li><a href="index.html"><i className="zmdi zmdi-camera" /> Gallery</a></li>
                <li><a href="index.html"><i className="zmdi zmdi-comments" /> Chat</a></li>
              </ul>
            </div>
          </li>
          <li className="dropdown notifications-dropdown">
            <a href="index.html" className="btn-notification dropdown-toggle" data-toggle="dropdown"><span className="noty-bubble">10</span><i className="zmdi zmdi-globe" /></a>
            <div className="dropdown-menu notifications-tabs">
              <div>
                <ul className="nav material-tabs nav-tabs" role="tablist">
                  <li className="active"><a href="#message" aria-controls="message" role="tab" data-toggle="tab">Message</a></li>
                  <li><a href="#notifications" aria-controls="notifications" role="tab" data-toggle="tab">Notifications</a></li>
                </ul>
                <div className="tab-content">
                  <div role="tabpanel" className="tab-pane active" id="message">
                    <div className="message-list-container">
                      <h4>You have 15 new messages</h4>
                      <ul className="clearfix">
                        <li className="clearfix">
                          <a href="index.html" className="message-thumb"><img src="images/avatar/robertoortiz.jpg" alt="image" />
                          </a><a href="index.html" className="message-intro"><span className="message-meta">Robertoortiz </span>Nunc aliquam dolor... <span className="message-time">today at 10:20 pm</span></a>
                        </li>
                        <li className="clearfix">
                          <a href="index.html" className="message-thumb"><span className="message-letter w_bg_purple">A</span>
                          </a><a href="index.html" className="message-intro"><span className="message-meta">Allisongrayce </span>In hac habitasse ... <span className="message-time">today at 8:29 pm</span></a>
                        </li>
                        <li className="clearfix">
                          <a href="index.html" className="message-thumb"><img src="images/avatar/michael-owens.jpg" alt="image" />
                          </a><a href="index.html" className="message-intro"><span className="message-meta">Michael </span>Suspendisse ac mauris ... <span className="message-time">yesterday at 12:29 pm</span></a>
                        </li>
                        <li className="clearfix">
                          <a href="index.html" className="message-thumb"><span className="message-letter w_bg_blue">B</span>
                          </a><a href="index.html" className="message-intro"><span className="message-meta">Bobbyjkane </span>Vivamus lacinia facilisis... <span className="message-time">yesterday at 11:48 pm</span></a>
                        </li>
                        <li className="clearfix">
                          <a href="index.html" className="message-thumb"><img src="images/avatar/bobbyjkane.jpg" alt="image" />
                          </a><a href="index.html" className="message-intro"><span className="message-meta">Bobbyjkane </span>Donec vel iaculis ... <span className="message-time">1 month ago</span></a>
                        </li>
                        <li className="clearfix">
                          <a href="index.html" className="message-thumb"><span className="message-letter w_bg_teal">C</span>
                          </a><a href="index.html" className="message-intro"><span className="message-meta">Chexee </span> Curabitur eget blandit...<span className="message-time">3 months ago</span></a>
                        </li>
                        <li className="clearfix">
                          <a href="index.html" className="message-thumb"><img src="images/avatar/coreyweb.jpg" alt="image" />
                          </a><a href="index.html" className="message-intro"><span className="message-meta">Coreyweb </span>Etiam molestie nulla... <span className="message-time">1 year ago</span></a>
                        </li>
                      </ul>
                      <a className="btn btn-link btn-block btn-view-all" href="index.html"><span>View All</span></a>
                    </div>
                  </div>
                  <div role="tabpanel" className="tab-pane" id="notifications">
                    <div className="notification-wrap">
                      <h4>You have 10 new notifications</h4>
                      <ul>
                        <li><a href="index.html" className="clearfix"><span className="ni w_bg_purple"><i className="fa fa-bullhorn" /></span><span className="notification-message">Pellentesque semper posuere. <span className="notification-time clearfix">3 Min Ago</span></span></a>
                        </li>
                        <li><a href="index.html" className="clearfix"><span className="ni w_bg_orange"><i className="fa fa-life-ring" /></span><span className="notification-message">Nulla commodo sem at purus. <span className="notification-time clearfix">1 Hours Ago</span></span></a>
                        </li>
                        <li><a href="index.html" className="clearfix"><span className="ni w_bg_red"><i className="fa fa-star-o" /></span><span className="notification-message">Fusce condimentum turpis. <span className="notification-time clearfix">3 Hours Ago</span></span></a>
                        </li>
                        <li><a href="index.html" className="clearfix"><span className="ni w_bg_light_blue"><i className="fa fa-trophy" /></span><span className="notification-message">Pellentesque habitant morbi. <span className="notification-time clearfix">Yesterday</span></span></a>
                        </li>
                        <li><a href="index.html" className="clearfix"><span className="ni w_bg_cyan"><i className="fa fa-bolt" /></span><span className="notification-message">Fusce bibendum lacus mauris.<span className="notification-time clearfix">1 Month Ago</span></span></a>
                        </li>
                        <li><a href="index.html" className="clearfix"><span className="ni w_bg_yellow"><i className="fa fa-bookmark-o" /></span><span className="notification-message">Donec id mi placerat, scelerisque.<span className="notification-time clearfix">3 Months Ago</span></span></a>
                        </li>
                      </ul>
                      <a className="btn btn-link btn-block btn-view-all clearfix" href="index.html"><span>View All</span></a>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </li>
          <li><a href="index.html" className="right-toggle-switch"><i className="zmdi zmdi-format-align-left" /><span className="more-noty" /></a></li>
        </ul>
      </div>
    </div>
    {/*Topbar Right End*/}
</div>

  );
}

export default Cabecera;
