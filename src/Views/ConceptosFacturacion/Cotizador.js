import React, {Component} from 'react';
import PropTypes from 'prop-types';
import ConceptosFacturacionGuias from "../Tarifas/ConceptosFacturacionGuias";
import {obtenerCotizacion} from "../../Util/Contexts/CotizadorContext";
import {obtenerConceptosFacturacion} from "../../Util/Contexts/ConceptosFacturacionContext";
import {getUniqueListBy} from "../../Util/Util";
import Noty from "noty";
import {Dialog, DialogActions, DialogContent, DialogTitle, IconButton} from "@material-ui/core";
import InfoOutlinedIcon from '@material-ui/icons/InfoOutlined';
import DialogContentText from "@material-ui/core/DialogContentText";
import Button from "@material-ui/core/Button";

function showSuccess(mensaje) {
    new Noty({
        type: "information",
        layout: "topCenter",
        text: mensaje,
        timeout: "3000",
    }).show();
}
class Cotizador extends Component {
    constructor(props) {
        super(props);
        this.state = {
            conceptos: [],
            mostarConceptos: false,
            conceptosBase: [],
            ivaRetiene: [],
            ivaTraslada: [],
            showErrorIconButton: false,
            showDialogError: false,
            errores: []
        }
        this.handleChangeListConceptos = this.handleChangeListConceptos.bind(this)
        this.calcularTarifa = this.calcularTarifa.bind(this)
        this.handleShowDialogError = this.handleShowDialogError.bind(this)
    }

    componentDidMount() {
        obtenerConceptosFacturacion().then(respuesta => {
            this.setState({
                conceptosBase: respuesta.data,
            })
        });
    }

    componentDidUpdate(prevProps: Readonly<P>, prevState: Readonly<S>, snapshot: SS) {
        if (prevProps.conceptos.length !== this.props.conceptos.length && this.props.conceptos.length > 0){
            let ivaTraslada = []
            let ivaRetiene = []
            ivaTraslada = getUniqueListBy(this.props.conceptos, "traslada").map(i => i.traslada);
            ivaRetiene = getUniqueListBy(this.props.conceptos, "retiene").map(i => i.retiene);
            this.setState({
                mostarConceptos: true,
                ivaRetiene: ivaRetiene,
                ivaTraslada: ivaTraslada
            })
            this.props.mostrarCotizadorRec(true)
        }
    }

    calcularTarifa() {
        if (this.props.paquetes.length === 0){
            showSuccess("No se puede crear cotización sin paquetes.")
            return
        }
        this.setState(state => {
            return {
                showErrorIconButton: false,
                errores: []
            }
        })
        obtenerCotizacion(this.props.embarque, this.props.paquetes, this.props.remitente, this.props.destinatario,this.props.recoleccion,this.props.entregaDiferenteDom).then(({data}) => {
            let conceptosCast = []
            let ivaTraslada = []
            let ivaRetiene = []
            let errores = []
            let errorConceptos = false
            data.forEach((element) => {
                if (element.m_nIdConceptosFacturacion > 0){
                    this.props.saveIdCotizacion(element.m_nIdCotizacion)
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
                        descuento: element.m_c_Descuento || 0,
                    })
                }
                if (element.m_bError){
                    errorConceptos = true
                    errores.push(element)
                }
            })

            ivaTraslada = getUniqueListBy(conceptosCast, "traslada").map(i => i.traslada);
            ivaRetiene = getUniqueListBy(conceptosCast, "retiene").map(i => i.retiene);
            this.props.onChangeConceptosList(conceptosCast)
            this.setState({
                mostarConceptos: true,
                ivaRetiene: ivaRetiene,
                ivaTraslada: ivaTraslada,
                showErrorIconButton: errorConceptos,
                errores: errores
            })
            this.props.mostrarCotizadorRec(true)

        })
    }

    handleChangeListConceptos(newList) {
        this.props.onChangeConceptosList(newList)
        // this.setState({conceptos: newList})
    }

    handleShowDialogError(show){
        this.setState({
            showDialogError: show
        })
    }

    render() {
        return (
            <div className="widget-wrap">
                <AlertDialog
                    open={this.state.showDialogError}
                    setShowDialogError={this.handleShowDialogError}
                    errores={this.state.errores}
                />
                <div className="widget-container">
                    <div className="widget-content">
                        <div className="row">
                            <div className="widget-header">
                                <h2>Conceptos de facturación
                                    {
                                        (this.props.embarque.mostrarCotizador && this.state.showErrorIconButton) &&
                                        <IconButton onClick={() => this.handleShowDialogError(true)}>
                                            <InfoOutlinedIcon color={"error"} fontSize={"large"} />
                                        </IconButton>
                                    }
                                </h2>

                            </div>

                            {
                                this.props.embarque.mostrarCotizador &&
                                <ConceptosFacturacionGuias
                                    keys={0}
                                    disabled={this.props.disabled}
                                    dataPaquetes={this.props.conceptos}
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
                                    this.props.setCalculoTarifa()
                                }}
                                disabled={this.props.disabled}
                            >
                                Calcular Tarifa
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

Cotizador.propTypes = {};

export default Cotizador;

function AlertDialog(props) {

    const handleClickOpen = () => {
    };

    const handleClose = () => {
        props.setShowDialogError(false);
    };

    return (
        <div>
            <Dialog
                open={props.open}
                onClose={handleClose}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
            >
                <DialogTitle id="alert-dialog-title">{"Errores al calcular tarifa"}</DialogTitle>
                <DialogContent>
                    {
                        props.errores.map(e => (
                            <DialogContentText id="alert-dialog-description" style={{fontSize: '12px'}}>
                                {e.m_sDetalles}
                            </DialogContentText>
                        ))
                    }

                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose} color="primary" autoFocus>
                        Aceptar
                    </Button>
                </DialogActions>
            </Dialog>
        </div>
    );
}