import React, { Component } from 'react';
import PropTypes from 'prop-types';
import axios from "axios";
import { obtenerCodigoPostalCiudad } from '../../Util/Contexts/CodigoPostalContext';

const headers = {
    'Content-Type': 'application/json',
    //    'access-control-allow-origin': '*'
}

class CodigoPostal extends Component {
    constructor(props) {
        super(props);
        this.state = {
            dataCodigoPostales: [],
            anchorEl: null,
            height: window.innerHeight,
            codigo: "",
            descripcion: ""
        }
        // this.getAllCodigoPostales = this.getAllCodigoPostales.bind(this)
        this.handleClose = this.handleClose.bind(this)
        this.handleChange = this.handleChange.bind(this)
    }

    componentWillMount() {
        // this.getAllCodigoPostales()
    }

    componentDidMount() {

    }

    componentDidUpdate(prevProps) {
        /*const {ciudadesSeleccionado} = this.props
        const {dataCodigoPostales} = this.state
        console.log('ciudadesSeleccionado: ',ciudadesSeleccionado)
        console.log('prevprops : ',prevProps.ciudadesSeleccionado)
        if (ciudadesSeleccionado !== prevProps.ciudadesSeleccionado) // Check if it's a new user, you can also use some unique property, like the ID  (this.props.user.id !== prevProps.user.id)
        {
            this.getAllCodigoPostales();
        }*/
        // this.getAllCodigoPostales();
    }

    componentWillUnmount() {

    }

    /*getAllCodigoPostales() {
        const {idCiudadSeleccionado, handleChange, ciudadesSeleccionado, codigoPostalesSeleccionado} = this.props
        const {dataCodigoPostales} = this.state
        const todosCodigosPostales = []

        if (ciudadesSeleccionado.length > 0){
            ciudadesSeleccionado.forEach( ciudad => {
                obtenerCodigoPostalCiudad(ciudad.m_nIdCiudad).then(respuesta => {
                    respuesta.data.forEach( item => {
                        todosCodigosPostales.push(item)
                    })
                    todosCodigosPostales.forEach( (i, index) => {
                        let isCheked = codigoPostalesSeleccionado.find(t => t.m_nIdCP === i.m_nIdCP) != null
                        if (isCheked){
                            handleChange(isCheked, index, todosCodigosPostales, false)
                        }
                    })
                    this.setState({
                        dataCodigoPostales: todosCodigosPostales, anchorEl: null
                    }, () => {
                        console.log('todosCodigosPostales: ', todosCodigosPostales)
                    })
                });
            })
        }

        /!*obtenerCodigoPostalCiudad(idCiudadSeleccionado).then(respuesta => {
            this.setState({ dataCodigoPostales: respuesta.data, anchorEl: null })
            dataCodigoPostales.forEach( (i, index) => {
                var isCheked = this.props.codigoPostalesSeleccionado.find(t => t.m_nIdCP === i.m_nIdCP) != null
               // this.setState({ checked: isCheked })
                if (isCheked){
                    handleChange(isCheked, index, respuesta.data, false)
                }
            })
        });*!/
    }*/

    handleChange(event) {
        this.setState({
            [event.target.name]: event.target.value
        });
    }

    handleClose() {
        this.setState({ anchorEl: null });
    }

    render() {
        const {consult, seleccionarTodoCodigoPostales, handleChange, editar, codigoPostalesSeleccionado, dataCodigoPostales} = this.props
        // const {dataCodigoPostales} = this.state

        return (
            <table style={{ overflowY: "scroll", width: "100%" }}>
                <tr>
                    <th>
                        <label className="checkbox">
                            <input disabled={consult} type="checkbox" onChange={(event) => handleChange(event, 0, dataCodigoPostales, true)} checked={seleccionarTodoCodigoPostales} />
                            <i />
                        </label>
                    </th>
                    <th>Código Postales</th>
                </tr>
                {
                    dataCodigoPostales.map((i, index) => {
                        return (
                            <tr key={index} >
                                <td style={{ width: "50px" }}>
                                    <label className="checkbox">
                                        <input disabled={editar} type="checkbox"
                                            onChange={(event) => handleChange(event.target.checked, index, dataCodigoPostales, false)}
                                            checked={codigoPostalesSeleccionado.find(t => t.m_nIdCP === i.m_nIdCP) != null}
                                        />
                                        <i />
                                    </label>
                                </td>
                                <td><strong>{i.m_sCP}</strong></td>
                            </tr>

                        )
                    })
                }
            </table>
        );
    }
}

CodigoPostal.propTypes = {

};

export default CodigoPostal;