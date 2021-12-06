import React, {Component} from 'react';
import PropTypes from 'prop-types';
import ConceptosFacturacionGuias from "../Tarifas/ConceptosFacturacionGuias";
import {obtenerCotizacion} from "../../Util/Contexts/CotizadorContext";
import {obtenerConceptosFacturacion} from "../../Util/Contexts/ConceptosFacturacionContext";
import {getUniqueListBy} from "../../Util/Util";

class Cotizador extends Component {
    constructor(props) {
        super(props);
        this.state = {
            conceptos: [],
            mostarConceptos: false,
            conceptosBase: [],
            ivaRetiene: [],
            ivaTraslada: []
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

    calcularTarifa() {
        obtenerCotizacion(this.props.embarque, this.props.paquetes, this.props.remitente, this.props.destinatario).then(({data}) => {
            let conceptosCast = []
            let ivaTraslada = []
            let ivaRetiene = []
            data.forEach((element) => {
                conceptosCast.push({
                    id: Math.floor(Math.random() * 10000),
                    concepto: element,
                    idConcepto: element.m_nIdConceptosFacturacion,
                    importe: element.m_cImporte,
                    retiene: element.m_nIdImpuestoRetiene,
                    traslada: element.m_nIdImpuestoTraslada,
                    importeIVA: element.m_cImporteIva,
                    importeRet: element.m_cImporteRetiene,
                    nombreConcepto: element.m_sConcepto,
                    descuento: element.m_c_Descuento
                })
            })
            ivaTraslada = getUniqueListBy(conceptosCast, "traslada").map(i => i.traslada);
            ivaRetiene = getUniqueListBy(conceptosCast, "retiene").map(i => i.retiene);
            this.setState({
                conceptos: conceptosCast,
                mostarConceptos: true,
                ivaRetiene: ivaRetiene,
                ivaTraslada: ivaTraslada
            })
        })
    }

    handleChangeListConceptos(newList) {
        this.setState({conceptos: newList})
    }

    render() {
        return (
            <div className="widget-container">
                <div className="widget-content">
                    <div className="row">
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
                            onClick={(e) => {
                                e.preventDefault();
                                this.calcularTarifa()
                            }}
                        >
                            Calcular Tarifa
                        </button>
                    </div>
                </div>
            </div>
        );
    }
}

Cotizador.propTypes = {};

export default Cotizador;
