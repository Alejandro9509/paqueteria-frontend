import React from 'react';
import Cabecera from "../Components/Template/Cabecera";
import BarraLateralIzquierda from "../Components/Template/BarraLateralIzquierda";
import {FormGroup, Checkbox, FormControlLabel, FormControl } from '@material-ui/core';



export default function ConfigSeguimiento(){
    const [state, setState] = React.useState({
        folio: true,
        paquetesGuia: true,
        estatusGuia: true,
        direccionEntrega: true
    });

    const handleChanche = (event) => {
        setState({
            ...state, 
            [event.target.name]: event.target.checked
        });
    };

    return(
        <div>
            <header className="topbar clearfix">
                <Cabecera titulo="Configurar Seguimiento" >
                    <div className="page-header">
                        <ul className="list-page-breadcrumb">
                            <li>
                                <a href="/Catalogos" className="color-mapeo">
                                    Catálogos <i className="zmdi zmdi-chevron-right" />
                                </a>
                            </li>
                            <li className="active-page">Configurar Seguimiento</li>
                        </ul>
                    </div>
                </Cabecera>
            </header>

            {/*Leftbar Start Here*/}
            <aside className="iconic-leftbar">
                <BarraLateralIzquierda />
            </aside>
            {/*Leftbar End Here*/}

            <section className="main-container">
                <h3>Opciones de dirección de entrega</h3>
                <FormControl fullWidth>
                    <FormGroup>
                    <FormControlLabel
                        label="Mostrar dirección de entrega."
                        labelPlacement="start"
                        control= {
                            <Checkbox checked={state.direccionEntrega} onChange={handleChanche} name="direccionEntrega"/>
                        }
                    />
                    <FormControlLabel
                        label="Mostrar estatus de guia."
                        labelPlacement="start"
                        control= {
                            <Checkbox checked={state.estatusGuia} onChange={handleChanche} name="estatusGuia"/>
                        }
                    />
                    <FormControlLabel
                        label="Mostrar paquetes de guia."
                        labelPlacement="start"
                        control= {
                            <Checkbox checked={state.paquetesGuia} onChange={handleChanche} name="paquetesGuia"/>
                        }
                    />
                    <FormControlLabel
                        label="Mostrar folio."
                        labelPlacement="start"
                        control= {
                            <Checkbox checked={state.folio} onChange={handleChanche} name="folio"/>
                        }
                    />
                </FormGroup>
                </FormControl>
            </section>
            
        </div>
    )
}