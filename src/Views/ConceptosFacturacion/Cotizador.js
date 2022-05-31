import React, {Component} from 'react';
import PropTypes from 'prop-types';
import ConceptosFacturacionGuias from "../Tarifas/ConceptosFacturacionGuias";
import {obtenerCotizacion} from "../../Util/Contexts/CotizadorContext";
import {obtenerConceptosFacturacion} from "../../Util/Contexts/ConceptosFacturacionContext";
import {currencyFormatter, getUniqueListBy} from "../../Util/Util";
import Noty from "noty";
import {Dialog, DialogActions, DialogContent, DialogTitle, IconButton} from "@material-ui/core";
import InfoOutlinedIcon from '@material-ui/icons/InfoOutlined';
import DialogContentText from "@material-ui/core/DialogContentText";
import Button from "@material-ui/core/Button";
import ListRoundedIcon from '@material-ui/icons/ListRounded';

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
            showJustificacionIconButton: false,
            showDialogError: false,
            showDialogJustificacion: false,
            errores: [],
            justificaciones: []
        }
        this.handleChangeListConceptos = this.handleChangeListConceptos.bind(this)
        this.calcularTarifa = this.calcularTarifa.bind(this)
        this.handleShowDialogError = this.handleShowDialogError.bind(this)
        this.handleShowDialogJustificacion = this.handleShowDialogJustificacion.bind(this)
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
        obtenerCotizacion(this.props.embarque, this.props.paquetes, this.props.remitente, this.props.destinatario,this.props.recoleccion,this.props.entregaDiferenteDom,this.props.recoleccionDiferenteDom).then(({data}) => {
            let conceptosCast = []
            let ivaTraslada = []
            let ivaRetiene = []
            let errores = []
            let justificaciones = []
            let showErrorConceptos = false
            let showJustificacionConceptos = false
            data.forEach((element) => {
                if (element.m_nIdConceptosFacturacion > 0){
                    this.props.saveIdCotizacion(element.m_nIdCotizacion)
                    conceptosCast.push({
                        id: Math.floor(Math.random() * 10000),
                        concepto: element,
                        idConcepto: element.m_nIdConceptosFacturacion || 0,
                        importe: element.m_cImporte || 0,
                        retiene: element.m_nIdImpuestoRetiene || 0,
                        traslada: element.m_nIdImpuestoTraslada || 0,
                        importeIVA: element.m_cImporteIva || 0,
                        importeRet: element.m_cImporteRetiene || 0,
                        nombreConcepto: element.m_sConcepto || "",
                        descuento: element.m_c_Descuento || 0,
                        esJustificacion: element.m_bJustificacion,
                        conceptoPorConvenio: element.m_bConceptoPorConvenio
                    })
                }
                if (element.m_bError){
                    showErrorConceptos = true
                    errores.push(element)
                }
                if (element.m_bJustificacion){
                    showJustificacionConceptos = true
                    justificaciones.push(element)
                }
            })

            let conceptosOnly = conceptosCast.filter(i => !i.esJustificacion)
            ivaTraslada = getUniqueListBy(conceptosOnly, "traslada").map(i => i.traslada);
            ivaRetiene = getUniqueListBy(conceptosOnly, "retiene").map(i => i.retiene);
            this.props.onChangeConceptosList(conceptosOnly)
            this.setState({
                mostarConceptos: true,
                ivaRetiene: ivaRetiene,
                ivaTraslada: ivaTraslada,
                showErrorIconButton: showErrorConceptos,
                showJustificacionIconButton: showJustificacionConceptos,
                errores: errores,
                justificaciones: justificaciones
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

    handleShowDialogJustificacion(show){
        this.setState({
            showDialogJustificacion: show
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
                <AlertDialogJustificaciones
                    open={this.state.showDialogJustificacion}
                    setShowDialogJustificacion={this.handleShowDialogJustificacion}
                    justificaciones={this.state.justificaciones}
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
                                    {
                                        (this.props.embarque.mostrarCotizador && this.state.showJustificacionIconButton) &&
                                        <IconButton onClick={() => this.handleShowDialogJustificacion(true)}>
                                            <ListRoundedIcon color={"primary"} fontSize={"large"} />
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

function AlertDialogJustificaciones(props) {

    const handleClickOpen = () => {
    };

    const handleClose = () => {
        props.setShowDialogJustificacion(false);
    };

    return (
        <div>
            <Dialog
                open={props.open}
                onClose={handleClose}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
            >
                <DialogTitle id="alert-dialog-title">{"Justificaciones al calcular tarifa"}</DialogTitle>
                <DialogContent>
                    {
                        props.justificaciones.map(e => (
                            <DialogContentText id="alert-dialog-description" style={{fontSize: '12px'}}>
                                {`${e.m_sConcepto}, ${currencyFormatter.format(Number(e.m_cImporte))}, ${e.m_bConceptoPorConvenio ? "CONVENIO ":"PUBLICO GENERAL"}`}
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