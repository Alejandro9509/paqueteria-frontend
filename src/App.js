import React, {Component} from 'react';
import {
  Route,
  Switch,
  Redirect
} from 'react-router-dom';
import Configuracion from './Views/Configuracion';
import Login from './Views/Login';
import {AplicationConsumer, AplicationProvider} from "./Util/Contexts/AplicationContext";
import {ACCESS_TOKEN} from './Constants';
import dashboardRoutes from './routes'
import catalogdRoutes from './routesCatalogos'
import configuracionRoutes from './routesConfiguraciones'
import "../node_modules/noty/lib/noty.css";  
import "../node_modules/noty/lib/themes/mint.css"; 
import Indicadores from './Views/Indicadores';
import Tracking from './Views/Seguimiento/Tracking';
import cabeceraRoutes from "./routesCabecera";
import LoginExterno from "./Components/Login/LoginExterno";


class App extends Component {
  constructor(props) { 
    super(props);
    this.state = {};
  }

render(){
  return (
  <AplicationProvider>
    <AplicationConsumer>{(value) => {
      return(
        localStorage.getItem(ACCESS_TOKEN) ? (
          <Switch>
            <Route path="/loginERP" component={LoginExterno} />
            <Route path="/Indicadores" component={Indicadores} />
            <Route path="/Configuracion" component={Configuracion} />
            <Route exact path="/app/applications/:esRecoleccion/:id/tracking" component={Tracking} />
            {dashboardRoutes.map((r, key) => {
                  return (<Route exact key={key} path={r.path} component={r.component} />)
              })}
            {catalogdRoutes.map((r, key) => {
                return (<Route exact key={r.path} path={r.path} component={r.component} />)
            })}
            {configuracionRoutes.map((r, key) => {
                return (<Route exact key={r.path} path={r.path} component={r.component} />)
            })}
            {cabeceraRoutes.map((r, key) => {
              return (<Route exact key={r.path} path={r.path} component={r.component} />)
            })}
            <Redirect from="/" to="/Indicadores"/>
          </Switch>
        ) : (
          <div className="app">
            {/*<div className="app-top-box">*/}
            {/*    <AppHeader />*/}
            {/*</div>*/}
              <div className="app-body">
                <Switch>
                  <Route exact path="/" component={Login} ></Route>
                  <Route path="/login" component={Login} ></Route>
                  <Route exact path="/app/applications/:id/tracking" component={Tracking} />
                  <Redirect from="/**" to="/login"/>

                </Switch>
              </div>
            </div>
        )
      );}}
    </AplicationConsumer>
    </AplicationProvider>
  );
}

}

export default App;