import React, {Component} from 'react';
import PropTypes from 'prop-types';
import "./ParadasStyle.css"
import {ReactComponent as BanderaIcono} from "../../iconos/Mapa/flagIcon.svg";
import {ReactComponent as UnidadesIcon} from "../../iconos/Catalogos/Icono Unidades/icono_unidades.svg";

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
                    this.props.ultimaMilla ? (
                        <div>
                            {
                                this.props.tour.m_arrClsProGuia.map((s, index) => {
                                    return (
                                        <div className="pointBarPass"
                                             onClick={()=> this.props.selectGuiaReasignar(this.props.tour.m_nIdParadaUltimaMilla, s.m_nIdGuia)}
                                             style={{
                                                 left: `${((index+1) / this.props.tour.m_arrClsProGuia.length) * 90}%`,
                                                 color: this.props.color
                                             }}>
                                            {index+1}
                                        </div>
                                    )
                                })
                            }

                            <div className="pointBarFlag"
                                 style={{
                                     left: `${parseInt((this.props.tour.m_arrClsProGuia.filter(g => g.m_nIdEstatusGuia === 7).length/this.props.tour.m_arrClsProGuia.length) * 100)}%`

                                 }}>
                                <UnidadesIcon
                                    style={{
                                        fill: this.props.color,
                                        paddingTop: "5px",
                                        paddingBottom: "5px",
                                        width: "25px",
                                        verticalAlign: "middle"
                                    }}/>
                            </div>
                        </div>

                    ) : (
                        <div>
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

                        </div>
                    )
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
