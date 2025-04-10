import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import {Router} from "react-router-dom";
import {createBrowserHistory} from "history";
import {Spinner} from "./Components/spinner";
import { ThemeProvider, StyledEngineProvider } from '@mui/material';
import Themes from "./Assets/themes";

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

reportWebVitals();
