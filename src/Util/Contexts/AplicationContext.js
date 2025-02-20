import React, { Component } from 'react';
import {ACCESS_TOKEN, USER_ID_SESSION, USER_ROLES} from '../../Constants';
import IdleTimer from "react-idle-timer";
import {IdleTimeOutModal} from "../../Components/Login/IdleTimeOutModal";

export const AplicationContext = React.createContext();
export const AplicationConsumer = AplicationContext.Consumer;

export class AplicationProvider extends Component{
    constructor(props) {
        super(props);
        this.idleTimer = null
        this.state = {
            authenticated: false,
            currentUser: null,
            loading: true,
            isTimedOut:false
        };
        this.handleClose = this.handleClose.bind(this)
        this.handleLogout = this.handleLogout.bind(this)
        this.handleOnActive = this.handleOnActive.bind(this)
        this.handleOnIdle = this.handleOnIdle.bind(this)
    }

    render() {
        return (
            <AplicationContext.Provider
            value = {{
                aplicationCurrentUser: this.state.currentUser,
                userIsAuthenticated: this.state.authenticated,
                loading: this.loading,
                login: this.loginAction,
                logout: this.logout,
                showModal: this.state.showModal,
                handleClose: this.handleClose,
                handleLogout: this.handleLogout,
                loadCurrentlyLoggedInUser: this.loadCurrentlyLoggedInUser
            }}
            >
                {
                    localStorage.getItem(ACCESS_TOKEN) &&
                    <IdleTimer
                        crossTab={true}
                        ref={ref => { this.idleTimer = ref }}
                        timeout={1000 * 60 * 8}
                        onActive={this.handleOnActive}
                        onIdle={this.handleOnIdle}
                        debounce={250}
                    />
                }
                {this.props.children}
            </AplicationContext.Provider>
        );
    }

    handleClose() {
        this.setState({showModal: false})
    }

    handleLogout() {
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
        this.setState({showModal: false})
        // this.props.history.push('/')
    }

    handleOnActive (event) {
        this.setState({isTimedOut: false})
    }

    handleOnIdle (event) {
        const isTimedOut = this.state.isTimedOut
        if (isTimedOut) {
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
            window.location.replace("/");
        } else {
            this.setState({showModal: true})
            this.idleTimer.reset();
            this.setState({isTimedOut: true})
        }
    }

}

export default AplicationProvider;