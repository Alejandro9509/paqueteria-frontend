import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import {Router} from "react-router-dom";
import {CircularProgress} from '@mui/material';
import {usePromiseTracker} from "react-promise-tracker";
import {createBrowserHistory} from "history";
import {Spinner} from "./Components/spinner";
import { ThemeProvider, StyledEngineProvider, CssBaseline } from '@mui/material';
import Themes from "./Assets/themes";
import MomentUtils from "@date-io/moment";
import IdleTimer from 'react-idle-timer'
import "@kenshooui/react-multi-select/dist/style.css"

const hist = createBrowserHistory();



ReactDOM.render(
    <StyledEngineProvider injectFirst>
        <ThemeProvider theme={Themes.default}>
            <Router history={hist} basename={'/'}>

                <Spinner/>

                    <App/>

            </Router>
        </ThemeProvider>
    </StyledEngineProvider>,
    document.getElementById('root')
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
