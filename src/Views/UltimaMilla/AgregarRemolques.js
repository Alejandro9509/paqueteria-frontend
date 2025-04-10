import React, {Component} from 'react';
import {Button, Dialog, DialogActions, DialogContent, DialogTitle} from "@mui/material";
import Autocomplete from '@mui/material/Autocomplete';
import TextField from "@mui/material/TextField";
import {obtenerEstatusUnidadeId, obtenerRemolques} from "../../Util/Contexts/UnidadesContext";
import {cubicarGuiaInforme} from "../../Util/Contexts/GuiaContext";
import {showError} from "../../Util/GlobalFunctions";
import ProgressBarCubicaje from "../Viajes/ProgressBarCubicaje";

class AgregarRemolques extends Component {
    constructor(props) {
        super(props);
        this.state = {
            dataUnidades: [],
            IdRemolque1:null,
            IdRemolque2: null,
            IdDolly: null,
            utilizacion: 0
        }
        this.handleRemolqueUnoFiltro = this.handleRemolqueUnoFiltro.bind(this);
        this.handleRemolqueDosFiltro = this.handleRemolqueDosFiltro.bind(this);
        this.handleDollyFiltro = this.handleDollyFiltro.bind(this);
        this.getAllUnidades = this.getAllUnidades.bind(this);
        this.guardarRemolques = this.guardarRemolques.bind(this);
    }

    componentDidMount() {
        this.getAllUnidades();
    }

    getAllUnidades() {
        obtenerRemolques().then((respuesta) => {
            this.setState({
                dataUnidades: respuesta.data,
                IdRemolque1: this.props.select ? respuesta.data.find(c => c.m_nIdUnidad === this.props.select.m_nIdRemolque1) : null,
                IdRemolque2: this.props.select ? respuesta.data.find(c => c.m_nIdUnidad === this.props.select.m_nIdRemolque2) : null,
                IdDolly: this.props.select ? respuesta.data.find(c => c.m_nIdUnidad === this.props.select.m_nIdDolly) : null
            })
        });
    }

    handleRemolqueDosFiltro(event, newValue) {
        event.preventDefault();
        var params = {
            idRemolque1: this.state.IdRemolque1?.m_nIdUnidad ?? null,
            idRemolque2: newValue?.m_nIdUnidad ?? null,
            guias: this.props.paquetes.filter(p => !p.m_bEsRecoleccion).map(p => ({m_nIdGuia: p.m_nId}))
        }
        obtenerEstatusUnidadeId(newValue.m_nIdUnidad).then((resultado) => {
            cubicarGuiaInforme(params).then(({data}) => {
                this.setState({
                    IdRemolque2: newValue,
                    placasRemolque2: newValue.m_sPlacas,
                    colorRemolque2: resultado.data instanceof String ? "" : resultado.data.m_sColor,
                    estatusRemolque2: resultado.data instanceof String ? "" : resultado.data.m_sEstatus,
                    utilizacion: data.utilizacion.toFixed(0)
                })
            }).catch(e => {
                this.setState({
                    IdRemolque2: newValue,
                    placasRemolque2: newValue.m_sPlacas,
                    colorRemolque2: resultado.data instanceof String ? "" : resultado.data.m_sColor,
                    estatusRemolque2: resultado.data instanceof String ? "" : resultado.data.m_sEstatus,
                    utilizacion: 0
                })
                showError(e.response?.data)
            })
        })
    }

    handleDollyFiltro(event, newValue) {
        event.preventDefault();
        this.setState({IdDolly: newValue, placasDolly: newValue.m_sPlacas})

    }

    handleRemolqueUnoFiltro(event, newValue) {
        event.preventDefault();
        var params = {
            idRemolque1: newValue?.m_nIdUnidad ?? null,
            idRemolque2: this.state.IdRemolque2?.m_nIdUnidad ?? null,
            guias: this.props.paquetes.filter(p => !p.m_bEsRecoleccion).map(p => ({m_nIdGuia: p.m_nId}))
        }

        obtenerEstatusUnidadeId(newValue.m_nIdUnidad).then((resultado) => {
            cubicarGuiaInforme(params).then(({data}) => {
                this.setState({
                    IdRemolque1: newValue,
                    placasRemolque1: newValue.m_sPlacas,
                    colorRemolque1: resultado.data instanceof String ? "" : resultado.data.m_sColor,
                    estatusRemolque1: resultado.data instanceof String ? "" : resultado.data.m_sEstatus,
                    utilizacion: data.utilizacion.toFixed(0)
                })
            }).catch(e => {
                this.setState({
                    IdRemolque1: newValue,
                    placasRemolque1: newValue.m_sPlacas,
                    colorRemolque1: resultado.data instanceof String ? "" : resultado.data.m_sColor,
                    estatusRemolque1: resultado.data instanceof String ? "" : resultado.data.m_sEstatus,
                    utilizacion: 0
                })
                showError(e.response?.data)
            })
        })
    }

    guardarRemolques(e){
        e.preventDefault()
        this.props.asignarRemolquesUnidad(this.state)
        this.setState({
            IdRemolque1:null,
            IdRemolque2: null,
            IdDolly: null
        })
    }

    render() {
        return (
            <Dialog open={this.props.open} onClose={() => this.props.close()} maxWidth={"lg"} fullWidth>
                <DialogTitle>Asignar Remolques</DialogTitle>
                <DialogContent>
                    <div className="widget-wrap">
                        <div className="widget-content">
                            <form onSubmit={this.guardarRemolques} className="j-forms row">
                                {/* Remolque 1 */}
                                <div className="row" style={{display: "flex"}}>
                                    <div className="col-sm-12 col-md-12 unit">
                                        <div className="col-sm-12 col-md-6 unit">
                                            <div className="input">
                                                <Autocomplete
                                                    freeSolo
                                                    onChange={this.handleRemolqueUnoFiltro}
                                                    value={this.state.IdRemolque1}
                                                    //disabled={state.agregar === "Consultar"}
                                                    id="IdRemolque1"
                                                    disableClearable
                                                    getOptionDisabled={(option) => option.EstatusUnidad !== "DISPONIBLE"}
                                                    forcePopupIcon={false}
                                                    options={this.state.dataUnidades && this.state.dataUnidades.filter(u => u.m_bActivo && u.m_nIdTipoUnidad !== 28 && (this.state.IdRemolque2 ? this.state.IdRemolque2.m_nIdUnidad : 0 ) !== u.m_nIdUnidad)}
                                                    getOptionLabel={(option) =>
                                                        `${option.m_sCodigo} - ${option.m_sDescripcion} (${option.EstatusUnidad})`
                                                    }
                                                    style={{
                                                        transform: "translate(14px, 10px) scale(1) !important"
                                                    }}
                                                    renderInput={(params) => (
                                                        <div>
                                                            <TextField
                                                                label="Remolque 1"
                                                                margin="dense"
                                                                required
                                                                variant="outlined"
                                                                {...params}
                                                            />
                                                        </div>
                                                    )}
                                                />
                                            </div>
                                        </div>
                                        {/* Placa Int */}
                                        <div className="col-sm-12 col-md-3 unit">
                                            <div className="input">
                                                <TextField variant="outlined" margin="dense"
                                                           className="form-control"
                                                           type="text"
                                                           disabled
                                                           label="Placas Int"
                                                           InputLabelProps={{
                                                               shrink: true,
                                                           }}
                                                           value={this.state.placasRemolque1}
                                                           name="placasRemolque1"
                                                />
                                            </div>
                                        </div>
                                        {/* Estatus */}
                                        <div className="col-sm-12 col-md-3 unit">
                                            <div className="input">
                                                <TextField variant="outlined" margin="dense"
                                                           className="form-control"
                                                           type="text"
                                                           label="Estatus"
                                                           disabled
                                                           style={{backgroundColor: this.state.colorRemolque1 ? `#${this.state.colorRemolque1}` : "white"}}
                                                           InputLabelProps={{
                                                               shrink: true,
                                                           }}
                                                           value={this.state.estatusRemolque1}
                                                           name="estatusRemolque1"
                                                />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                {/* Remolque 2 */}
                                <div className="row" style={{display: "flex"}}>
                                    <div className="col-sm-12 col-md-12 unit">
                                        <div className="col-sm-12 col-md-6 unit">
                                            <div className="input">
                                                <Autocomplete
                                                    freeSolo
                                                    onChange={this.handleRemolqueDosFiltro}
                                                    value={this.state.IdRemolque2}
                                                    //disabled={state.agregar === "Consultar"}
                                                    id="IdRemolque2"
                                                    disableClearable
                                                    getOptionDisabled={(option) => option.EstatusUnidad !== "DISPONIBLE"}
                                                    disabled={this.props.consult}
                                                    forcePopupIcon={false}
                                                    options={this.state.dataUnidades && this.state.dataUnidades.filter(u => u.m_bActivo && u.m_nIdTipoUnidad !== 28 && (this.state.IdRemolque1 ? this.state.IdRemolque1.m_nIdUnidad : 0 ) !== u.m_nIdUnidad)}
                                                    getOptionLabel={(option) =>
                                                        `${option.m_sCodigo} - ${option.m_sDescripcion} (${option.EstatusUnidad})`
                                                    }
                                                    style={{
                                                        transform: "translate(14px, 10px) scale(1) !important"
                                                    }}
                                                    renderInput={(params) => (
                                                        <div>
                                                            <TextField
                                                                label="Remolque 2"
                                                                margin="dense"
                                                                variant="outlined"
                                                                {...params}
                                                            />
                                                        </div>
                                                    )}
                                                />
                                            </div>
                                        </div>

                                        {/* Placa Int */}
                                        <div className="col-sm-12 col-md-3 unit">
                                            <div className="input">
                                                <TextField variant="outlined" margin="dense"
                                                           disabled
                                                           className="form-control"
                                                           type="text"
                                                           InputLabelProps={{
                                                               shrink: true,
                                                           }}
                                                           label="Placas Int"
                                                           value={this.state.placasRemolque2}
                                                           name="placasRemolque2"
                                                />
                                            </div>
                                        </div>

                                        {/* Estatus */}
                                        <div className="col-sm-12 col-md-3 unit">
                                            <div className="input">
                                                <TextField variant="outlined" margin="dense"
                                                           disabled
                                                           className="form-control"
                                                           type="text"
                                                           label="Estatus"
                                                           style={{backgroundColor: this.state.colorRemolque2 ? `#${this.state.colorRemolque2}` : "white"}}
                                                           InputLabelProps={{
                                                               shrink: true,
                                                           }}
                                                           value={this.state.estatusRemolque2}
                                                           name="estatusRemolque2"
                                                />
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="row" style={{display: "flex"}}>
                                    {/* Dolly  */}
                                    <div className="col-sm-12 col-md-4 unit">
                                        <div className="input">
                                            <Autocomplete
                                                freeSolo
                                                onChange={this.handleDollyFiltro}
                                                value={this.state.IdDolly}
                                                //disabled={state.agregar === "Consultar"}
                                                id="IdDolly"
                                                disableClearable
                                                getOptionDisabled={(option) => option.EstatusUnidad !== "DISPONIBLE"}

                                                disabled={this.props.consult}
                                                forcePopupIcon={false}
                                                options={this.state.dataUnidades && this.state.dataUnidades.filter(u => u.m_bActivo && u.m_nIdTipoUnidad === 28)}
                                                getOptionLabel={(option) =>
                                                    `${option.m_sCodigo} - ${option.m_sDescripcion} (${option.EstatusUnidad})`
                                                }
                                                style={{
                                                    transform: "translate(14px, 10px) scale(1) !important"
                                                }}
                                                renderInput={(params) => (
                                                    <div>
                                                        <TextField
                                                            label="Dolly"
                                                            margin="dense"
                                                            variant="outlined"
                                                            {...params}
                                                        />
                                                    </div>
                                                )}
                                            />
                                        </div>
                                    </div>

                                    {/* Placa Int */}
                                    <div className="col-sm-12 col-md-4 unit">
                                        <div className="input">
                                            <TextField variant="outlined" margin="dense"
                                                       className="form-control"
                                                       type="text"
                                                       disabled
                                                       label="Placas Int"
                                                       InputLabelProps={{
                                                           shrink: true,
                                                       }}
                                                       value={this.state.placasDolly}
                                                       name="placasDolly"
                                            />
                                        </div>
                                    </div>

                                    <div className="col-sm-12 col-md-12 unit">
                                        <ProgressBarCubicaje value={this.state.utilizacion}>Espacio de carga usado: {this.state.utilizacion}%</ProgressBarCubicaje>
                                    </div>
                                </div>
                                <DialogActions>
                                    <Button
                                        variant={"contained"}
                                        onClick={() => this.props.close()}
                                        color={"secondary"}>Cancelar</Button>
                                    <Button
                                        variant={"contained"}
                                        type={"submit"}
                                        color={"primary"}>Asignar remolques</Button>
                                </DialogActions>
                            </form>
                        </div>
                    </div>
                </DialogContent>
            </Dialog>
        );
    }
}

AgregarRemolques.propTypes = {};

export default AgregarRemolques;
