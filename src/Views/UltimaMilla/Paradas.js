import React, {Component} from 'react';
import PropTypes from 'prop-types';
import "./ParadasStyle.css"
import {ReactComponent as BanderaIcono} from "../../iconos/Mapa/flagIcon.svg";

class Paradas extends Component {
    constructor(props) {
        super(props);
    }

    componentDidMount() {

    }

    render() {
        return (
            <div className="progress" >
                {
                    this.props.tour.trips[0].stops.map((s, index) => {
                        return (
                            <div className="pointBarPass"
                                 style={{
                                     left: `${((index+1) / this.props.tour.trips[0].stops.length) * 90}%`,
                                     color: this.props.color
                                 }}>
                                {index+1}
                            </div>
                        )
                    })
                }
                <div className="pointBarFlag"
                     style={{
                         left: `100%`

                     }}>
                    <BanderaIcono style={{fill: this.props.color}}/>
                </div>
                <div className="progress-bar" style={{width: "100%", backgroundColor: this.props.color}}/>
            </div>
        );
    }
}

Paradas.propTypes = {};

export default Paradas;
