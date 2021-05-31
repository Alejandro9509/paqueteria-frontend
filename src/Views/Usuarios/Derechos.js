import React, { Component } from 'react';
import PropTypes from 'prop-types';

class Derechos extends Component {
    constructor(props) {
        super(props);
        this.state = {
            procesos: [{ id: 1, name: "Catálogo" }, { id: 2, name: "Recolección" }, { id: 3, name: "Embarque" }, { id: 4, name: "Guías" }, { id: 5, name: "Informes" }, { id: 6, name: "Viajes" }],
            subProcesos: [{ id: 1, name: "Recolección" }, { id: 2, name: "Embarque" }, { id: 3, name: "Guías" }, { id: 4, name: "Informes" }, { id: 5, name: "Viajes" }],
            procesosSeleccionados: [],
            tiposProcesosAll: false
        }
        this.handleChangeChecboxProcesos = this.handleChangeChecboxProcesos.bind(this)
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
                procesosSeleccionados: array
            });
        } else {
            array.splice(array.findIndex(a => a.id === this.state.procesos[index].id), 1)
            this.setState({
                tiposProcesosAll: false,
                procesosSeleccionados: array
            });
        }

    }

    render() {
        return (
            <div>
                <div className="col-md-3 col-sm-12" >

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
                <div className="col-md-3 col-sm-12" >

                    <table style={{ overflow: "auto", width: "100%" }}>
                        <tr>
                            <th>
                                <label className="checkbox">
                                    <input disabled={this.props.consult} type="checkbox" onChange={(event) => this.handleChangeChecboxProcesos(event, 0, true)} checked={this.state.tiposProcesosAll} />
                                    <i />
                                </label>

                            </th>
                            <th><strong>Subproceso</strong></th>
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
                <div className="col-md-3 col-sm-12" >

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
                <div className="col-md-3 col-sm-12" >

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