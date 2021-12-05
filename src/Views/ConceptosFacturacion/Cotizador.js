import React, {Component} from 'react';
import PropTypes from 'prop-types';
import ConceptosFacturacionGuias from "../Tarifas/ConceptosFacturacionGuias";
import {obtenerCotizacion} from "../../Util/Contexts/CotizadorContext";
import {obtenerConceptosFacturacion} from "../../Util/Contexts/ConceptosFacturacionContext";

class Cotizador extends Component {
    constructor(props) {
        super(props);
        this.state = {
            conceptos : [],
            mostarConceptos: false,
            conceptosBase: []
        }
        this.handleChangeListConceptos = this.handleChangeListConceptos.bind(this)
        this.calcularTarifa = this.calcularTarifa.bind(this)
    }
    componentDidMount() {
        obtenerConceptosFacturacion().then(respuesta => {
            this.setState({
                conceptosBase: respuesta.data,
            })
        });
    }

    calcularTarifa () {
        obtenerCotizacion(this.props.embarque, this.props.paquetes, this.props.remitente, this.props.destinatario).then(({data}) => {
            this.setState({
                conceptos: data,
                mostarConceptos: true
            })
        })
    }
    handleChangeListConceptos(newList) {
        this.setState({conceptos : newList})
    }

    render() {
        return (
            <div>
                {
                    this.state.mostarConceptos &&
                    <ConceptosFacturacionGuias
                        keys={0}
                        disabled={false}
                        dataPaquetes={this.state.conceptos}
                        onChangeList={this.handleChangeListConceptos}
                        conceptosBase={this.state.conceptosBase}
                        ivaTraslada={this.state.ivaTraslada}
                        ivaRetiene={this.state.ivaRetiene}
                    />
                }
                <button
                    type={"button"}
                    className="btn btn-secondary secondary-btn"
                    onClick={(e) => {e.preventDefault();this.calcularTarifa()}}
                >
                    Calcular Tarifa
                </button>
            </div>
        );
    }
}

Cotizador.propTypes = {};

export default Cotizador;
