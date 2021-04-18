import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Cabecera from '../../Components/Template/Cabecera';
import BarraLateralIzquierda from '../../Components/Template/BarraLateralIzquierda';
import { Button, Dialog, DialogContent, DialogTitle } from '@material-ui/core';
import CrearConcepto from './CrearConcepto';

class ConceptosFacturacion extends Component {
    constructor(props) {
        super(props);
        this.state = {
            height: window.innerHeight,
            openDialog: false
        }
    }

    componentWillMount() {

    }

    componentDidMount() {

    }

    componentWillUnmount() {

    }

    render() {
        const { height, openDialog } = this.state
        return (
            <div>
                <Dialog open={openDialog} fullWidth maxWidth="lg"  onClose={() => this.setState({openDialog : false})}>
                    <DialogTitle>Agregando Concepto de Facturación</DialogTitle>
                    <DialogContent>
                        <CrearConcepto>

                        </CrearConcepto>
                    </DialogContent>
                </Dialog>

                <header className="topbar clearfix">
                    <Cabecera />
                </header>

                {/*Leftbar Start Here*/}
                <aside className="iconic-leftbar" style={{ minHeight: height }}>
                    <BarraLateralIzquierda />
                </aside>
                {/*Leftbar End Here*/}
                <section className="main-container">
                    <div className="container-fluid">
                        <div className="page-header filled full-block light">
                            <div className="row">
                                <div className="col-md-6 col-sm-6">
                                    <h2>Conceptos de Facturación</h2>
                                </div>
                                <div className="col-md-6 col-sm-6">
                                    <ul className="list-page-breadcrumb">
                                        <li>
                                            <a href="/Catalogos" className="color-mapeo">
                                                Catálogos <i className="zmdi zmdi-chevron-right" />
                                            </a>
                                        </li>
                                        <li className="active-page">Conceptos de Facturación</li>
                                    </ul>
                                </div>
                            </div>
                        </div>

                        <button
                            className="btn btn-primary primary-btn"
                            style={{margin: "5px"}}
                            onClick={() => this.setState({openDialog: true})}
                        >
                            Agregar
                    </button>
                        <button
                            className="btn btn-primary primary-btn"
                            style={{margin: "5px"}}
                        >
                            Modificar
                    </button>
                        <button
                            className="btn btn-primary primary-btn"
                            style={{margin: "5px"}}
                        >
                            Eliminar
                    </button>
                        <button
                            className="btn btn-primary primary-btn"
                            style={{margin: "5px"}}
                        >
                            Imprimir
                    </button>

                        <div className="widget-wrap">
                            <form className="j-forms">

                            </form>
                        </div>
                    </div>
                </section>
            </div>
        );
    }
}

ConceptosFacturacion.propTypes = {

};

export default ConceptosFacturacion;