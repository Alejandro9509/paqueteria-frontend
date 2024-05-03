import React, {Component} from 'react';
import "./ParadasStyle.css"
import {ReactComponent as BanderaIcono} from "../../iconos/Mapa/flagIcon.svg";
import {ReactComponent as UnidadesIcon} from "../../iconos/Catalogos/Icono Unidades/icono_unidades.svg";
import Noty from "noty";
import DatosEntregaRecoleccion from "./DatosEntregaRecoleccion"
import {Dialog, DialogContent} from "@mui/material";

function showSuccess(mensaje) {
    new Noty({
        type: "information",
        layout: "topCenter",
        text: mensaje,
        timeout: "3000"
    }).show()
}

class Paradas extends Component {
    constructor(props) {
        super(props);
        this.state = {
            openDatos: false
        }
        this.handleOpenDatos = this.handleOpenDatos.bind(this)
    }

    componentDidMount() {
        console.log(this.props)
    }

    handleOpenDatos(){
        this.setState({
            openDatos: true
        })
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
                                             onClick={()=> {
                                                this.handleOpenDatos()
                                                }}
                                             style={{
                                                 left: `${((index+1) / this.props.tour.m_arrClsProGuia.length) * 90}%`,
                                                 color: this.props.color
                                             }}>
                                                {this.state.openDatos &&
                                                <Dialog fullWidth
                                                maxWidth={"sm"} open={this.state.openDatos} onClose={()=> this.setState({openDatos:false})}>
                                                        <DialogContent>
                                                            <DatosEntregaRecoleccion data={s} close={()=> this.setState({openDatos:false})}/>
                                                        </DialogContent>
                                                </Dialog>
                                                }
                                                
                                            {index+1}
                                        </div>
                                    )
                                })
                            }

                            <div className="pointBarFlag"
                                 style={{
                                     left: `${parseInt((this.props.tour.m_arrClsProGuia.filter(g => g.m_nEstatusUlimaMilla === 3 || g.m_nEstatusUlimaMilla === 4).length/this.props.tour.m_arrClsProGuia.length) * 97)}%`

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
