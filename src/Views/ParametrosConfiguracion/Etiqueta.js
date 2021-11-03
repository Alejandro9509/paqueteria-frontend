import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {Button, TextField} from "@material-ui/core";
import axios from "axios";

class Etiqueta extends Component {
    constructor(props) {
        super(props);
        this.state = {
            formato: "",
            imagenEtiqueta: null
        }
        this.convertirEtiqueta = this.convertirEtiqueta.bind(this)
    }

    componentWillMount() {

    }

    componentDidMount() {

    }

    componentWillUnmount() {

    }

    convertirEtiqueta(){
        var bodyFormData = new FormData();
        bodyFormData.append("file", this.state.formato);
       axios.post("http://api.labelary.com/v1/printers/8dpmm/labels/4x6/0/", bodyFormData , {headers:{"Accept": "image/png"}}).then((data) => {

           this.setState({imagenEtiqueta: data.data})
       })
    }
    render() {
        return (
                <div className="widget-wrap j-forms">
                    <div className="widget-content">
                        <div className="row" >
                            <div className="col-md-6 col-sm-6 col-xs-12" >
                                <TextField
                                    multiline
                                    value={this.state.formato}
                                    onChange={(event) => this.setState({formato: event.target.value})}
                                />
                                <Button onClick={() => this.convertirEtiqueta()}>Actualizar</Button>
                            </div>
                            <div className="col-md-6 col-sm-6 col-xs-12" >
                                {
                                    this.state.imagenEtiqueta &&
                                        <img src={this.state.imagenEtiqueta}/>
                                }
                            </div>
                        </div>
                    </div>
                </div>
        );
    }
}

Etiqueta.propTypes = {};

export default Etiqueta;
