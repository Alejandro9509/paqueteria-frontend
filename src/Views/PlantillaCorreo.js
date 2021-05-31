import React from 'react';
import Cabecera from "../Components/Template/Cabecera";
import BarraLateralIzquierda from "../Components/Template/BarraLateralIzquierda";
import {Checkbox, makeStyles} from '@material-ui/core';

const useStyle = makeStyles({
    title:{
      marginBottom: 15
    },
    item: {
        display: 'flex',
        justifyContent: 'space-between',
        width: '30%'}
});

export default function PlantillaCorreo() {
    const classess = useStyle()
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
        <div>
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
                                <h3 className={classess.title}>Opciones de dirección de entrega</h3>
                                <div className={classess.item}>
                                    <span>Mostrar dirección de entrega.</span>
                                    <Checkbox checked={state.direccionEntrega} onChange={handleChanche} name="direccionEntrega"/>
                                </div>
                                <div className={classess.item}>
                                    <span>Mostrar estatus de guía.</span>
                                    <Checkbox checked={state.estatusGuia} onChange={handleChanche} name="estatusGuia"/>
                                </div>
                                <div className={classess.item}>
                                    <span>Mostrar paquetes de guía.</span>
                                    <Checkbox checked={state.paquetesGuia} onChange={handleChanche} name="paquetesGuia"/>
                                </div>
                                <div className={classess.item}>
                                    <span>Mostrar folio.</span>
                                    <Checkbox checked={state.folio} onChange={handleChanche} name="folio"/>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

        </div>
    )
}