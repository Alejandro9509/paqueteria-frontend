import React, {Component} from 'react';
import {
  Route,
  Switch,
  Redirect
} from 'react-router-dom';
import Departamento from './Views/Departamento';
import Login from './Views/Login';
import {AplicationConsumer, AplicationProvider} from "./Util/Contexts/AplicationContext";
import {ACCESS_TOKEN} from './Constants';
import dashboardRoutes from './routes'

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
            <Route path="/departamento" component={Departamento} />
            {dashboardRoutes.map((r, key) => {
                  return (<Route exact key={key} path={r.path} component={r.component} />)
              })}
            <Redirect from="/" to="/departamento"/>
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