import React, { Component } from 'react';
import PropTypes from 'prop-types';
import axios from "axios";

const headers = {
    'Content-Type': 'application/json',
    //    'access-control-allow-origin': '*'
}


class Ciudad extends Component {
    constructor(props) {
        super(props);
        this.state = {
            dataCiudades: [],
            anchorEl: null,
            height: window.innerHeight,
            codigo: "",
            descripcion: ""
        }
        this.getAllCiudades = this.getAllCiudades.bind(this)
        this.handleClose = this.handleClose.bind(this)
        this.handleClick = this.handleClick.bind(this)
    }

    componentWillMount() {
        this.getAllCiudades()
    }

    componentDidMount() {

    }

    componentDidUpdate(prevProps) {
        console.log(this.props.ciudadesSeleccionado)
        if (this.props.idEstadoSucursal !== prevProps.idEstadoSucursal) // Check if it's a new user, you can also use some unique property, like the ID  (this.props.user.id !== prevProps.user.id)
        {
            this.getAllCiudades();
        }
    }

    getAllCiudades() {
        const {idEstadoSucursal} = this.props
        const url = `${process.env.REACT_APP_API_URL}/Ciudades/GetByEstado/${idEstadoSucursal}`;
        axios.get(url, { headers }).then(respuesta => {
            this.setState({ dataCiudades: respuesta.data, anchorEl: null })
            this.state.dataCiudades.forEach( (i, index) => {
                var isCheked = this.props.ciudadesSeleccionado.find(t => t.m_nIdCiudad === i.m_nIdCiudad) != null
                //this.setState({ checked: isCheked })
                if (isCheked){
                    this.props.handleChangeChecboxCiudad(isCheked, index, respuesta.data, false)
                }
            })
        });
    }

    componentWillUnmount() {

    }

    handleClose() {
        this.setState({ anchorEl: null });
    }
    handleClick(event) {
        this.setState({ anchorEl: event.currentTarget });
    }

    render() {
        const {dataCiudades} = this.state
        const {editar, ciudadesSeleccionado, handleChangeChecboxCiudad, seleccionarTodoCiudades} = this.props

        return (
            <table style={{ overflow: "scroll", width: "100%" }}>
                <tr>
                    <th>
                        <label className="checkbox">
                            <input disabled={editar} type="checkbox"
                                   onChange={(event) => handleChangeChecboxCiudad(event, 0, dataCiudades, true)}
                                   checked={seleccionarTodoCiudades}
                            />
                            <i />
                        </label>
                    </th>
                    <th>Ciudades</th>
                </tr>
                {
                    dataCiudades.map((i, index) => {
                        return (
                            <tr key={index} >
                                <td style={{ width: "50px" }}>
                                    <label className="checkbox">
                                        <input disabled={editar} type="checkbox"
                                            onChange={(event) => handleChangeChecboxCiudad(event.target.checked, index, dataCiudades, false)}
                                            checked={ciudadesSeleccionado.find(t => t.m_nIdCiudad === i.m_nIdCiudad) != null}
                                        />
                                        <i />
                                    </label>
                                </td>
                                <td><strong>{i.m_sCiudad}</strong></td>
                            </tr>

                        )
                    })
                }
            </table>
        );
    }
}

Ciudad.propTypes = {

};

export default Ciudad;