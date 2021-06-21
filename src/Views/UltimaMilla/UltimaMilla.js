import React, {Component, useEffect} from 'react';
import PropTypes from 'prop-types';
import Cabecera from "../../Components/Template/Cabecera";
import BarraLateralIzquierda from "../../Components/Template/BarraLateralIzquierda";
import {MapContainer, Marker, Polyline, Popup, TileLayer} from "react-leaflet";
import {arrayPonts} from "../../Util/Data";
import {Chip, List, ListItem, ListSubheader, makeStyles} from "@material-ui/core";
import FaceIcon from "@material-ui/icons/Face";
import Tooltip from "@material-ui/core/Tooltip";
import FiltersMap from "./FiltersMap";
import Cronograma from "./Cronograma";

class UltimaMilla extends Component {
    constructor(props) {
        super(props);
        this.state = {
            map: null,
            height: window.innerHeight,
            openCronograma: false,
            data: {}
        }
    }

    componentWillMount() {

    }

    componentDidMount() {

    }

    componentWillUnmount() {

    }


    generarRuta(data){

    }
    render() {
        return (
            <div>
                <header className="topbar clearfix">
                    <Cabecera titulo="Última Milla">
                    </Cabecera>
                </header>


                {/*Page Container Start Here*/}
                <section>
                    <div className="widget-content">
                        <div className="row" style={{height: window.innerHeight, width: '100%'}}>
                            <MapContainer style={{width: "100%", height: "100%", zIndex: 1}}
                                          center={[32.62781, -115.44632]} zoom={15} scrollWheelZoom={false}
                                          whenCreated={(map) => this.setState({map: map})}>

                                <TileLayer style={{width: "100%", height: "100%"}}
                                           url="https://xserver2-america-test.cloud.ptvgroup.com/services/rest/XMap/tile/{z}/{x}/{y}?userLanguage=es&amp;xtok={token}"
                                           token="51FA3E8E-8BF3-49EF-AB82-59D807A0645C"
                                />
                                <FiltersMap/>


                                    {
                                        this.state.openCronograma &&
                                        <Cronograma data={this.state.data} />
                                    }


                            </MapContainer>
                        </div>

                    </div>


                </section>

            </div>
        );
    }
}

UltimaMilla.propTypes = {};

export default UltimaMilla;



function TripPoint(props) {
    const [state, setState] = React.useState({polygon: []})
    const blackOptions = {color: '#65a0f4'}
    useEffect(value => {

    }, [])

    return <Polyline pathOptions={blackOptions} positions={state.polygon}/>;
}


