import React, { Component } from 'react';
import PropTypes from 'prop-types';

class CrearConcepto extends Component {
    constructor(props) {
        super(props);
        this.state = {
            codigo: "",
            tiposCobro: []
        }

        this.handleChange = this.handleChange.bind(this)
    }

    componentWillMount() {

    }

    componentDidMount() {

    }

    handleChange(event) {

        this.setState({
            [event.target.name]: event.target.value
        });
    }


    componentWillUnmount() {

    }

    render() {
        return (
            <form className="j-forms">
                <div className="form-content">
                    <div className="main-container" style={{ margin: "0px", padding: "0px" }}>
                        <div className="row" style={{ margin: "0px" }}>
                            <div className="col-sm-6 col-md-3 col-lg-3 unit" style={{ padding: "2px" }}>
                                <label className="label">
                                    Código
                                </label>
                                <div className="input">
                                    <input
                                        onChange={this.handleChange}
                                        className="form-control"
                                        type="number"
                                        required
                                        step="1"
                                        min="0"
                                        max="999"
                                        value={this.state.Codigo}
                                        id="Codigo"
                                    />
                                </div>
                            </div>
                            <div className="col-sm-6 col-md-9 col-lg-9 unit" style={{ padding: "2px" }}>
                                <label className="label">
                                    Concepto
                                </label>
                                <div className="input">
                                    <input
                                        onChange={this.handleChange}
                                        className="form-control"
                                        type="text"
                                        required
                                        step="2"
                                        value={this.state.Codigo}
                                        id="Codigo"
                                    />
                                </div>
                            </div>

                        </div>
                        <div className="row" style={{ margin: "0px" }} >
                            <div className="col-sm-12 col-md-12 col-lg-12 unit" style={{ backgroundColor: "#E6E6E6", padding: "2px" }}>
                                <label className="label" style={{ textAlign: "center", width: "100%", color: "#717171" }}>
                                    <strong>Concepto</strong>
                                </label>
                            </div>
                        </div>
                        <div className="row" style={{ margin: "0px" }}>
                            <div className="col-sm-12 col-md-6 col-lg-6 unit" style={{ padding: "2px" }}>
                                <div className="row" style={{ margin: "0px" }}>
                                    <div className="col-sm-12 col-md-12 col-lg-12 unit" style={{ backgroundColor: "#E6E6E6", backgroundClip: "content-box", padding: "2px" }}>

                                        <label className="label" style={{ textAlign: "center", width: "100%", color: "#717171", marginBottom: "0px", display: "inline-block" }}>
                                            <strong>Traslado</strong>
                                        </label>
                                    </div>
                                </div>
                                <div className="row" style={{ margin: "0px" }}>
                                    <div className="col-sm-4 col-md-4 col-lg-4 unit" style={{ backgroundColor: "#E6E6E6", padding: "2px" }}>
                                        <label className="label" style={{ textAlign: "left", width: "100%", color: "#717171", marginBottom: "0px", display: "inline-block" }}>
                                            <strong>Impuesto</strong>
                                        </label>
                                    </div>
                                    <div className="col-sm-4 col-md-4 col-lg-4 unit" style={{ backgroundColor: "#E6E6E6", padding: "2px" }}>
                                        <label className="label" style={{ textAlign: "left", width: "100%", color: "#717171", marginBottom: "0px", display: "inline-block" }}>
                                            <strong>Traslado</strong>
                                        </label>
                                    </div>
                                    <div className="col-sm-4 col-md-4 col-lg-4 unit" style={{ backgroundColor: "#E6E6E6", padding: "2px" }}>
                                        <label className="label" style={{ textAlign: "left", width: "100%", color: "#717171", marginBottom: "0px", display: "inline-block" }}>
                                            <strong>Predeterminado</strong>
                                        </label>
                                    </div>
                                </div>
                            </div>


                            <div className="col-sm-12 col-md-6 col-lg-6 unit" style={{ padding: "2px" }}>
                                <div className="row" style={{ margin: "0px" }}>
                                    <div className="col-sm-12 col-md-12 col-lg-12 unit" style={{ backgroundColor: "#E6E6E6", backgroundClip: "content-box", padding: "2px" }}>

                                        <label className="label" style={{ textAlign: "center", width: "100%", color: "#717171", marginBottom: "0px", display: "inline-block" }}>
                                            <strong>Retención</strong>
                                        </label>
                                    </div>
                                </div>
                                <div className="row" style={{ margin: "0px" }}>
                                    <div className="col-sm-4 col-md-4 col-lg-4 unit" style={{ backgroundColor: "#E6E6E6", padding: "2px" }}>
                                        <label className="label" style={{ textAlign: "left", width: "100%", color: "#717171", marginBottom: "0px", display: "inline-block" }}>
                                            <strong>Impuesto</strong>
                                        </label>
                                    </div>
                                    <div className="col-sm-4 col-md-4 col-lg-4 unit" style={{ backgroundColor: "#E6E6E6", padding: "2px" }}>
                                        <label className="label" style={{ textAlign: "left", width: "100%", color: "#717171", marginBottom: "0px", display: "inline-block" }}>
                                            <strong>Traslado</strong>
                                        </label>
                                    </div>
                                    <div className="col-sm-4 col-md-4 col-lg-4 unit" style={{ backgroundColor: "#E6E6E6", padding: "2px" }}>
                                        <label className="label" style={{ textAlign: "left", width: "100%", color: "#717171", marginBottom: "0px", display: "inline-block" }}>
                                            <strong>Predeterminado</strong>
                                        </label>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                </div>
            </form >
        );
    }
}

CrearConcepto.propTypes = {

};

export default CrearConcepto;