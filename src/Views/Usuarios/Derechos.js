import React, { Component } from 'react';
import { GetListadoNombres } from "../../Util/Contexts/DerechosContext";
import PropTypes from 'prop-types';

class Derechos extends Component {
    constructor(props) {
        super(props);
        this.state = {
            dataDerechos: [],
            procesos: [],//[{ id: 1, name: "Catálogo" }, { id: 2, name: "Recolección" }, { id: 3, name: "Embarque" }, { id: 4, name: "Guías" }, { id: 5, name: "Informes" }, { id: 6, name: "Viajes" }],
            acciones: [], //[{ id: 1, name: "Recolección" }, { id: 2, name: "Embarque" }, { id: 3, name: "Guías" }, { id: 4, name: "Informes" }, { id: 5, name: "Viajes" }],
            moduloSeleccionados: [],
            procesosSeleccionados: [],
            accionesSeleccionados: [],
            moduloAll: false,
            tiposProcesosAll: false,
            accionesAll: false
        }
        this.getAllNombreDerechos = this.getAllNombreDerechos.bind(this)
        this.handleChangeChecboxModulos = this.handleChangeChecboxModulos.bind(this)
        this.handleChangeChecboxProcesos = this.handleChangeChecboxProcesos.bind(this)
    }

    componentDidMount() {
        this.getAllNombreDerechos()
      }

    getAllNombreDerechos() {
        GetListadoNombres().then( (respuesta) => {
            this.setState({ dataDerechos: respuesta.data })
        })
      };

    handleChangeChecboxModulos(event, index, all) {
        const array = this.state.moduloSeleccionados
        if (all) {
            let arrayAll = Object.assign([], this.state.dataDerechos)
            this.setState({
                moduloAll: !this.state.moduloAll,
                moduloSeleccionados: !this.state.moduloAll ? arrayAll : []
            });
            return
        }
        if (event.target.checked) {
            array.push(this.state.dataDerechos[index])
            this.setState({
                procesos: this.state.dataDerechos[index].m_arrModulo,
                moduloSeleccionados: array
            });
        } else {
            array.splice(array.findIndex(a => a.m_nIdModulo === this.state.dataDerechos[index].m_nIdModulo), 1)
            this.setState({
                moduloAll: false,
                moduloSeleccionados: array
            });
        }

    }

    handleChangeChecboxProcesos(event, index, all) {
        const array = this.state.procesosSeleccionados
        if (all) {
            let arrayAll = Object.assign([], this.state.procesos)
            this.setState({
                tiposProcesosAll: !this.state.tiposProcesosAll,
                procesosSeleccionados: !this.state.tiposProcesosAll ? arrayAll : []
            });
            return
        }
        if (event.target.checked) {
            array.push(this.state.procesos[index])
            this.setState({
                acciones: this.state.procesos[index].m_arrAcciones,
                procesosSeleccionados: array
            });
        } else {
            array.splice(array.findIndex(a => a.m_nIdProceso === this.state.procesos[index].m_nIdProceso), 1)
            this.setState({
                tiposProcesosAll: false,
                procesosSeleccionados: array
            });
        }

    }

    handleChangeChecboxAcciones(event, index, all) {
        const array = this.state.accionesSeleccionados
        if (all) {
            let arrayAll = Object.assign([], this.state.acciones)
            this.setState({
                accionesAll: !this.state.accionesAll,
                accionesSeleccionados: !this.state.accionesAll ? arrayAll : []
            });
            return
        }
        if (event.target.checked) {
            array.push(this.state.acciones[index])
            this.setState({
                accionesSeleccionados: array
            });
        } else {
            array.splice(array.findIndex(a => a.m_nIdAccion === this.state.procesos[index].m_nIdAccion), 1)
            this.setState({
                accionesAll: false,
                accionesSeleccionados: array
            });
        }

    }

    render() {
        return (
            <div>
                <div className="col-md-4 col-sm-12" >

                    <table style={{ overflow: "auto", width: "100%" }}>
                        <tr>
                            <th>
                                <label className="checkbox">
                                    <input disabled={this.props.consult} type="checkbox" onChange={(event) => this.handleChangeChecboxModulos(event, 0, true)} checked={this.state.moduloAll} />
                                    <i />
                                </label>

                            </th>
                            <th><strong>Módulo</strong></th>
                        </tr>
                        {
                            this.state.dataDerechos.map((i, index) => {
                                return (
                                    <tr key={i.m_nIdModulo}>
                                        <td style={{ width: "50px" }}>
                                            <label className="checkbox">
                                                <input disabled={this.props.consult} type="checkbox" onChange={(event) => this.handleChangeChecboxModulos(event, index, false)} checked={this.state.moduloSeleccionados.find(t => t.m_nIdModulo === i.m_nIdModulo) != null} />
                                                <i />
                                            </label>
                                        </td>
                                        <td>{i.m_sTituloModulo}</td>
                                    </tr>

                                )
                            })
                        }
                    </table>
                </div>
                <div className="col-md-4 col-sm-12" >

                    <table style={{ overflow: "auto", width: "100%" }}>
                        <tr>
                            <th>
                                <label className="checkbox">
                                    <input disabled={this.props.consult} type="checkbox" onChange={(event) => this.handleChangeChecboxProcesos(event, 0, true)} checked={this.state.tiposProcesosAll} />
                                    <i />
                                </label>

                            </th>
                            <th><strong>Proceso</strong></th>
                        </tr>
                        {
                            this.state.procesos.map((i, index) => {
                                return (
                                    <tr key={i.m_nIdProceso}>
                                        <td style={{ width: "50px" }}>
                                            <label className="checkbox">
                                                <input disabled={this.props.consult} type="checkbox" onChange={(event) => this.handleChangeChecboxProcesos(event, index, false)} checked={this.state.procesosSeleccionados.find(t => t.m_nIdProceso === i.m_nIdProceso) != null} />
                                                <i />
                                            </label>
                                        </td>
                                        <td>{i.m_sTituloProceso}</td>
                                    </tr>

                                )
                            })
                        }
                    </table>
                </div>
                
                {/* <div className="col-md-3 col-sm-12" >

                    <table style={{ overflow: "auto", width: "100%" }}>
                        <tr>
                            <th>
                                <label className="checkbox">
                                    <input disabled={this.props.consult} type="checkbox" onChange={(event) => this.handleChangeChecboxProcesos(event, 0, true)} checked={this.state.tiposProcesosAll} />
                                    <i />
                                </label>

                            </th>
                            <th><strong>Opciones</strong></th>
                        </tr>
                        {
                            this.state.procesos.map((i, index) => {
                                return (
                                    <tr key={i.id}>
                                        <td style={{ width: "50px" }}>
                                            <label className="checkbox">
                                                <input disabled={this.props.consult} type="checkbox" onChange={(event) => this.handleChangeChecboxProcesos(event, index, false)} checked={this.state.procesosSeleccionados.find(t => t.id === i.id) != null} />
                                                <i />
                                            </label>
                                        </td>
                                        <td>{i.name}</td>
                                    </tr>

                                )
                            })
                        }
                    </table>
                </div>
                 */}
                <div className="col-md-4 col-sm-12" >

                    <table style={{ overflow: "auto", width: "100%" }}>
                        <tr>
                            <th>
                                <label className="checkbox">
                                    <input disabled={this.props.consult} type="checkbox" onChange={(event) => this.handleChangeChecboxProcesos(event, 0, true)} checked={this.state.tiposProcesosAll} />
                                    <i />
                                </label>

                            </th>
                            <th><strong>Acciones</strong></th>
                        </tr>
                        {
                            this.state.acciones.map((i, index) => {
                                return (
                                    <tr key={i.m_nIdAccion}>
                                        <td style={{ width: "50px" }}>
                                            <label className="checkbox">

                                                <input disabled={this.props.consult} type="checkbox" onChange={(event) => this.handleChangeChecboxAcciones(event, index, false)} checked={this.state.accionesSeleccionados.find(t => t.m_nIdAccion === i.m_nIdAccion) != null} />
                                                <i />
                                            </label>
                                        </td>
                                        <td>{i.m_sTituloAccion}</td>
                                    </tr>

                                )
                            })
                        }
                    </table>
                </div>
                
                <div className="col-md-12 col-sm-12" style={{ padding: "5px", display: "inline-flex" }}>
                    <div className="form-footer " className="col-md-12" style={{ padding: "10px" }}>
                        <button
                            type="button"
                            className="btn btn-secondary secondary-btn"
                            onClick={this.props.onCancel}
                        >
                            Cancelar
                                    </button>
                        <button
                            type="submit"

                            className="btn btn-primary primary-btn"
                        >
                            Aceptar
                                                    </button>


                    </div>
                </div>
            </div>
        );
    }
}

Derechos.propTypes = {

};

export default Derechos;