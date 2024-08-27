import React from 'react';
import { styled } from '@mui/material/styles';
import Cabecera from "../Components/Template/Cabecera";
import BarraLateralIzquierda from "../Components/Template/BarraLateralIzquierda";
import { Checkbox } from '@mui/material';
import makeStyles from '@mui/styles/makeStyles';
import {validarDerecho} from "../Util/Util"

const PREFIX = 'PlantillaCorreo';

const classes = {
    title: `${PREFIX}-title`,
    item: `${PREFIX}-item`
};

const Root = styled('div')({
    [`& .${classes.title}`]: {
      marginBottom: 15
    },
    [`& .${classes.item}`]: {
        display: 'flex',
        justifyContent: 'space-between',
        width: '30%'}
});

export default function PlantillaCorreo() {
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

    return (
        <Root>
            <header className="topbar clearfix">
                <Cabecera titulo="Plantilla de Correo">
                    <div className="page-header">
                        <ul className="list-page-breadcrumb">
                            <li>
                                <a href="/Catalogos" className="color-mapeo">
                                    Catálogos <i className="zmdi zmdi-chevron-right"/>
                                </a>
                            </li>
                            <li className="active-page">Plantilla de Correo</li>
                        </ul>
                    </div>
                </Cabecera>
            </header>

            {/*Leftbar Start Here*/}
            <aside className="iconic-leftbar">
                <BarraLateralIzquierda/>
            </aside>
            {/*Leftbar End Here*/}

            <section className="main-container">
                <div className="widget-wrap" style={{paddingBottom: 15}}>
                    <div className="widget-container">
                        <div className="widget-content">
                            <div className="row">
                                <h3 className={classes.title}>Opciones de dirección de entrega</h3>
                                <div className={classes.item}>
                                    <span>Mostrar dirección de entrega.</span>
                                    <Checkbox disabled={!validarDerecho(9101390)} checked={state.direccionEntrega} onChange={handleChanche} name="direccionEntrega"/>
                                </div>
                                <div className={classes.item}>
                                    <span>Mostrar estatus de guía.</span>
                                    <Checkbox disabled={!validarDerecho(9101391)} checked={state.estatusGuia} onChange={handleChanche} name="estatusGuia"/>
                                </div>
                                <div className={classes.item}>
                                    <span>Mostrar paquetes de guía.</span>
                                    <Checkbox disabled={!validarDerecho(9101392)} checked={state.paquetesGuia} onChange={handleChanche} name="paquetesGuia"/>
                                </div>
                                <div className={classes.item}>
                                    <span>Mostrar folio.</span>
                                    <Checkbox disabled={!validarDerecho(9101393)} checked={state.folio} onChange={handleChanche} name="folio"/>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

        </Root>
    );
}