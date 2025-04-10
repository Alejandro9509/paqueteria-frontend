import React from "react";

function BarraLateralIzquierda() {
    return (
        <div className="rightbar-container">
            <div className="aside-chat-box">
                <div className="coversation-toolbar">
                    <div className="chat-back">
                        <i className="zmdi zmdi-long-arrow-left" />
                    </div>
                    <div className="active-conversation">
                        <div className="chat-avatar">
                            <img src="images/avatar/amarkdalen.jpg" alt="user" />
                        </div>
                        <div className="chat-user-status">
                            <ul>
                                <li>Feeling Blessed</li>
                                <li>Amarkdalen</li>
                            </ul>
                        </div>
                    </div>
                    <div className="conversation-action">
                        <ul>
                            <li><i className="zmdi zmdi-phone-in-talk" /></li>
                            <li className="dropdown">
                                <a href="index.html" className="btn-more dropdown-toggle" data-toggle="dropdown"><i className="zmdi zmdi-more-vert" /></a>
                                <ul className="dropdown-menu">
                                    <li><a href="index.html"><i className="zmdi zmdi-attachment-alt" />Attach A File</a></li>
                                    <li><a href="index.html"><i className="zmdi zmdi-mic" />Voice</a></li>
                                    <li><a href="index.html"><i className="zmdi zmdi-block" />Block User</a></li>
                                </ul>
                            </li>
                        </ul>
                    </div>
                </div>
                <div className="conversation-container">
                    <div className="conversation-row even">
                        <ul className="conversation-list">
                            <li>
                                <p>
                                    Hi! this is mike how can I help you?
                                </p>
                            </li>
                            <li>
                                <p>
                                    Hello Sir!
                                </p>
                            </li>
                        </ul>
                    </div>
                    <div className="conversation-row odd">
                        <ul className="conversation-list">
                            <li>
                                <p>
                                    Hi! Mike I need a support my account is suspended but I don't know why?
                                </p>
                            </li>
                        </ul>
                    </div>
                    <div className="conversation-row even">
                        <ul className="conversation-list">
                            <li>
                                <p>
                                    Ok Sir! Let me check this issue please wait a min
                                </p>
                            </li>
                        </ul>
                    </div>
                    <div className="conversation-row odd">
                        <ul className="conversation-list">
                            <li>
                                <p>
                                    Ok sure :D 
                                </p>
                            </li>
                        </ul>
                    </div>
                </div>
                <div className="chat-text-input">
                    <input type="text" className="form-control" />
                </div>
            </div>
            <ul className="nav nav-tabs material-tabs rightbar-tab" role="tablist">
                <li className="active"><a href="#chat" aria-controls="message" role="tab" data-toggle="tab">Chat</a></li>
                <li><a href="#activities" aria-controls="notifications" role="tab" data-toggle="tab">Activities</a></li>
            </ul>
            <div className="tab-content">
                <div role="tabpanel" className="tab-pane active" id="chat">
                    <div className="chat-user-toolbar clearfix">
                        <div className="chat-user-search pull-left">
                            <span className="addon-icon"><i className="zmdi zmdi-search" /></span>
                            <input type="text" className="form-control" placeholder="Search" />
                        </div>
                        <div className="add-chat-list pull-right">
                            <i className="zmdi zmdi-accounts-add" />
                        </div>
                    </div>
                    <div className="chat-user-container">
                        <h3 className="clearfix"><span className="pull-left">Members</span><span className="pull-right online-counter">3 Online</span></h3>
                        <ul className="chat-user-list">
                            <li>
                                <div data-trigger="hover" title="Robertoortiz" data-content="<div class='chat-user-info'>
                                  <div class='chat-user-avatar'>
                                  <img src='images/avatar/robertoortiz.jpg' alt='Avatar'>
                                  </div>
                                  <div class='chat-user-details'>
                                  <ul>
                                  <li>Status: <span>Online</span></li>
                                  <li>Type: <span>Admin</span></li>
                                  <li>Last Login: <span>3 hours Ago</span></li>
                                  <li></li>
                                  </ul>
                                  </div>
                                  </div>
                                  " data-placement="left"><span className="chat-avatar"><img src="images/avatar/robertoortiz.jpg" alt="Avatar" /></span><span className="chat-u-info">Adellecharles<cite>New York</cite></span>
                                </div>
                                <span className="chat-u-status"><i className="fa fa-circle" /></span>
                            </li>
                            <li className="chat-u-online">
                                <div data-trigger="hover" title="Kurafire" data-content="<div class='chat-user-info'>
                                  <div class='chat-user-avatar'>
                                  <img src='images/avatar/kurafire.jpg' alt='Avatar'>
                                  </div>
                                  <div class='chat-user-details'>
                                  <ul>
                                  <li>Status: <span>Online</span></li>
                                  <li>Type: <span>Moderator</span></li>
                                  <li>Last Login: <span>3 hours Ago</span></li>
                                  <li></li>
                                  </ul>
                                  </div>
                                  </div>
                                  " data-placement="left"><span className="chat-avatar"><img src="images/avatar/kurafire.jpg" alt="Avatar" /></span><span className="chat-u-info">Kurafire<cite>New York</cite></span>
                                </div>
                                <span className="chat-u-status"><i className="fa fa-circle" /></span>
                            </li>
                            <li className="chat-u-away">
                                <div data-trigger="hover" title="Mikeluby" data-content="<div class='chat-user-info'>
                                  <div class='chat-user-avatar'>
                                  <img src='images/avatar/mikeluby.jpg' alt='Avatar'>
                                  </div>
                                  <div class='chat-user-details'>
                                  <ul>
                                  <li>Status: <span>Online</span></li>
                                  <li>Type: <span>Moderator</span></li>
                                  <li>Last Login: <span>3 hours Ago</span></li>
                                  <li></li>
                                  </ul>
                                  </div>
                                  </div>
                                  " data-placement="left">
                                    <span className="chat-avatar"><img src="images/avatar/mikeluby.jpg" alt="Avatar" /></span><span className="chat-u-info">Bobbyjkane<cite>London City</cite></span>
                                </div>
                                <span className="chat-u-status"><i className="fa fa-circle" /></span>
                            </li>
                            <li className="chat-u-busy">
                                <div data-trigger="hover" title="Joostvanderree" data-content="<div class='chat-user-info'>
                                  <div class='chat-user-avatar'>
                                  <img src='images/avatar/joostvanderree.jpg' alt='Avatar'>
                                  </div>
                                  <div class='chat-user-details'>
                                  <ul>
                                  <li>Status: <span>Online</span></li>
                                  <li>Type: <span>Moderator</span></li>
                                  <li>Last Login: <span>3 hours Ago</span></li>
                                  <li></li>
                                  </ul>
                                  </div>
                                  </div>
                                  " data-placement="left">
                                    <span className="chat-avatar"><img src="images/avatar/joostvanderree.jpg" alt="Avatar" /></span><span className="chat-u-info">Joostvanderree<cite>New York</cite></span>
                                </div>
                                <span className="chat-u-status"><i className="fa fa-circle" /></span>
                            </li>
                        </ul>
                        <h3 className="clearfix"><span className="pull-left">Guests</span><span className="pull-right online-counter">1 Online</span></h3>
                        <ul className="chat-user-list">
                            <li>
                                <div data-trigger="hover" title="Kevinthompson" data-content="<div class='chat-user-info'>
                                  <div class='chat-user-avatar'>
                                  <img src='images/avatar/Kevinthompson.jpg' alt='Avatar'>
                                  </div>
                                  <div class='chat-user-details'>
                                  <ul>
                                  <li>Status: <span>Online</span></li>
                                  <li>Type: <span>Moderator</span></li>
                                  <li>Last Login: <span>3 hours Ago</span></li>
                                  <li></li>
                                  </ul>
                                  </div>
                                  </div>
                                  " data-placement="left">
                                    <span className="chat-avatar"><img src="images/avatar/kevinthompson.jpg" alt="Avatar" /></span><span className="chat-u-info">Kevinthompson<cite>Scotland</cite></span>
                                </div>
                                <span className="chat-u-status"><i className="fa fa-circle" /></span>
                            </li>
                            <li className="chat-u-online">
                                <div data-trigger="hover" title="Mds" data-content="<div class='chat-user-info'>
                                  <div class='chat-user-avatar'>
                                  <img src='images/avatar/mds.jpg' alt='Avatar'>
                                  </div>
                                  <div class='chat-user-details'>
                                  <ul>
                                  <li>Status: <span>Online</span></li>
                                  <li>Type: <span>Moderator</span></li>
                                  <li>Last Login: <span>3 hours Ago</span></li>
                                  <li></li>
                                  </ul>
                                  </div>
                                  </div>
                                  " data-placement="left">
                                    <span className="chat-avatar"><img src="images/avatar/mds.jpg" alt="Avatar" /></span><span className="chat-u-info">Mds<cite>South West, England</cite></span>
                                </div>
                                <span className="chat-u-status"><i className="fa fa-circle" /></span>
                            </li>
                            <li>
                                <div data-trigger="hover" title="Mko" data-content="<div class='chat-user-info'>
                                  <div class='chat-user-avatar'>
                                  <img src='images/avatar/mko.jpg' alt='Avatar'>
                                  </div>
                                  <div class='chat-user-details'>
                                  <ul>
                                  <li>Status: <span>Online</span></li>
                                  <li>Type: <span>Moderator</span></li>
                                  <li>Last Login: <span>3 hours Ago</span></li>
                                  <li></li>
                                  </ul>
                                  </div>
                                  </div>
                                  " data-placement="left">
                                    <span className="chat-avatar"><img src="images/avatar/mko.jpg" alt="Avatar" /></span><span className="chat-u-info">Mko<cite>New York</cite></span>
                                </div>
                                <span className="chat-u-status"><i className="fa fa-circle" /></span>
                            </li>
                            <li>
                                <div data-trigger="hover" title="Coreyweb" data-content="<div class='chat-user-info'>
                                  <div class='chat-user-avatar'>
                                  <img src='images/avatar/coreyweb.jpg' alt='Avatar'>
                                  </div>
                                  <div class='chat-user-details'>
                                  <ul>
                                  <li>Status: <span>Online</span></li>
                                  <li>Type: <span>Moderator</span></li>
                                  <li>Last Login: <span>3 hours Ago</span></li>
                                  <li></li>
                                  </ul>
                                  </div>
                                  </div>
                                  " data-placement="left">
                                    <span className="chat-avatar"><img src="images/avatar/coreyweb.jpg" alt="Avatar" /></span><span className="chat-u-info">Coreyweb<cite>Northern Ireland</cite></span>
                                </div>
                                <span className="chat-u-status"><i className="fa fa-circle" /></span>
                            </li>
                            <li>
                                <div data-trigger="hover" title="Amarkdalen" data-content="<div class='chat-user-info'>
                                  <div class='chat-user-avatar'>
                                  <img src='images/avatar/amarkdalen.jpg' alt='Avatar'>
                                  </div>
                                  <div class='chat-user-details'>
                                  <ul>
                                  <li>Status: <span>Online</span></li>
                                  <li>Type: <span>Moderator</span></li>
                                  <li>Last Login: <span>3 hours Ago</span></li>
                                  <li></li>
                                  </ul>
                                  </div>
                                  </div>
                                  " data-placement="left">
                                    <span className="chat-avatar"><img src="images/avatar/amarkdalen.jpg" alt="Avatar" /></span><span className="chat-u-info">Oykun<cite>New York</cite></span>
                                </div>
                                <span className="chat-u-status"><i className="fa fa-circle" /></span>
                            </li>
                        </ul>
                    </div>
                </div>
                <div role="tabpanel" className="tab-pane" id="activities">
                    <div className="activities-timeline">
                        <h3 className="tab-pane-header">Recent Activities</h3>
                        <ul className="activities-list">
                            <li>
                                <div className="activities-badge">
                                    <span className="w_bg_amber"><i className="zmdi zmdi-ticket-star" /></span>
                                </div>
                                <div className="activities-details">
                                    <h3 className="activities-header"><a href="index.html">Resolved Tickets #LTK7865</a></h3>
                                    <div className="activities-meta">
                                        <i className="fa fa-clock-o" /> 30 min ago
                                    </div>
                                </div>
                            </li>
                            <li>
                                <div className="activities-badge">
                                    <span className="w_bg_cyan"><i className="zmdi zmdi-file-plus" /></span>
                                </div>
                                <div className="activities-details">
                                    <h3 className="activities-header"><a href="index.html">Files Uploaded</a></h3>
                                    <div className="activities-meta">
                                        <i className="fa fa-clock-o" /> 1 hour ago
                                    </div>
                                    <div className="activities-post">
                                        <ul className="new-file-lists">
                                            <li><a href="index.html"><i className="fa fa-file-text" /> change-log.txt</a></li>
                                            <li><a href="index.html"><i className="fa fa-file-audio-o" /> skype-conversation.mp3</a></li>
                                            <li><a href="index.html"><i className="fa fa-file-powerpoint-o" /> presentation.ppt</a></li>
                                            <li><a href="index.html"><i className="fa fa-file-video-o" /> howtouse.avi</a></li>
                                            <li><a href="index.html"><i className="fa fa-file-image-o" /> screenshot.jpg</a></li>
                                            <li><a href="index.html"><i className="fa fa-file-word-o" /> nda.doc</a></li>
                                            <li><a href="index.html"><i className="fa fa-file-pdf-o" /> resume.pdf</a></li>
                                            <li><a href="index.html"><i className="fa fa-file-archive-o" /> all-files.zip</a></li>
                                            <li><a href="index.html"><i className="fa fa-file-excel-o" /> bill.xls</a></li>
                                            <li><a href="index.html">+10</a></li>
                                        </ul>
                                    </div>
                                </div>
                            </li>
                            <li>
                                <div className="activities-badge">
                                    <span className="w_bg_light_blue"><i className="zmdi zmdi-image" /></span>
                                </div>
                                <div className="activities-details">
                                    <h3 className="activities-header"><a href="index.html">Images Uploaded</a></h3>
                                    <div className="activities-meta">
                                        <i className="fa fa-clock-o" /> July 22 at 1:12pm
                                    </div>
                                    <div className="activities-post">
                                        <ul className="new-image-lists">
                                            <li><a href="index.html"><img src="images/img-1-thumb.jpg" alt="image" /></a></li>
                                            <li><a href="index.html"><img src="images/img-2-thumb.jpg" alt="image" /></a></li>
                                            <li><a href="index.html"><img src="images/img-3-thumb.jpg" alt="image" /></a></li>
                                            <li><a href="index.html" className="more-list"><i className="zmdi zmdi-more-horiz" /></a></li>
                                        </ul>
                                    </div>
                                </div>
                            </li>
                            <li>
                                <div className="activities-badge">
                                    <span className="w_bg_green"><i className="zmdi zmdi-accounts-alt" /></span>
                                </div>
                                <div className="activities-details">
                                    <h3 className="activities-header"><a href="index.html">Users Approved</a></h3>
                                    <div className="activities-meta">
                                        <i className="fa fa-clock-o" /> July 22 at 1:12pm
                                    </div>
                                    <div className="activities-post">
                                        <ul className="new-user-lists">
                                            <li><a href="index.html"><img src="images/avatar/oykun.jpg" alt="image" /></a></li>
                                            <li><a href="index.html"><img src="images/avatar/mds.jpg" alt="image" /></a></li>
                                            <li><a href="index.html"><img src="images/avatar/robertoortiz.jpg" alt="image" /></a></li>
                                            <li><a href="index.html" className="more-list"><i className="zmdi zmdi-more-horiz" /></a></li>
                                        </ul>
                                    </div>
                                </div>
                            </li>
                            <li>
                                <div className="activities-badge">
                                    <span className="w_bg_deep_purple"><i className="zmdi zmdi-file-text" /></span>
                                </div>
                                <div className="activities-details">
                                    <h3 className="activities-header"><a href="index.html">Post New Article</a></h3>
                                    <div className="activities-meta">
                                        <i className="fa fa-clock-o" /> July 22 at 1:12pm
                                    </div>
                                    <div className="activities-post">
                                        <ul className="new-post-lists">
                                            <li><a href="index.html">Man in the Verde Valley</a></li>
                                            <li><a href="index.html">Sinagua Pueblo Life</a></li>
                                            <li><a href="index.html">Montezuma Well</a></li>
                                            <li><a href="index.html">The Natural Scene</a></li>
                                            <li><a href="index.html">+6</a></li>
                                        </ul>
                                    </div>
                                </div>
                            </li>
                            <li>
                                <div className="activities-badge">
                                    <span className="w_bg_teal"><i className="zmdi zmdi-comments" /></span>
                                </div>
                                <div className="activities-details">
                                    <h3 className="activities-header"><a href="index.html">Comments Replied</a></h3>
                                    <div className="activities-meta">
                                        <i className="fa fa-clock-o" /> July 22 at 1:12pm
                                    </div>
                                    <div className="activities-post">
                                        <ul className="new-comments-lists">
                                            <li><a href="index.html">As long as you are reasonably careful about where you step and avoid putting ...</a></li>
                                            <li><a href="index.html">Montezuma Castle is 5 miles north of Camp Verde, 60 miles south...</a></li>
                                        </ul>
                                    </div>
                                </div>
                            </li>
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default BarraLateralIzquierda;
