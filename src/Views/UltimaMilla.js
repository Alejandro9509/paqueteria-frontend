
import * as React from 'react';
import Cabecera from "../Components/Template/Cabecera";
import BarraLateralIzquierda from "../Components/Template/BarraLateralIzquierda";
import Tooltip from '@material-ui/core/Tooltip';
import { MapContainer, TileLayer, Marker, Popup, useMapEvents, Polyline } from 'react-leaflet'
import "../App.css"
import { useEffect } from 'react';
import axios from "axios";
import FaceIcon from '@material-ui/icons/Face';
import { Chip, List, ListItem, ListSubheader, makeStyles, withStyles } from '@material-ui/core';
import L from 'leaflet';
import { arrayPonts } from '../Util/Data';
import MarkerImage from '../iconos/Mapa/marker.png';

const XTourClient = window.XTourClient;

const MarkerIcon = new L.Icon({
    iconUrl: MarkerImage,
    iconRetinaUrl: MarkerImage,
    iconAnchor: null,
    popupAnchor: null,
    shadowUrl: null,
    shadowSize: null,
    shadowAnchor: null,
    iconSize: new L.Point(30, 30),
});

const headers = {
    "Content-Type": "application/json",
    //'access-control-allow-origin': '*'
};

var DepotA = {
    "$type": "DepotSite",
    "id": "DepotA",
    "routeLocation": {
        "$type": "OffRoadRouteLocation",
        "offRoadCoordinate": {
            "x": -115.440285695247098,
            "y": 32.635112006525993
        }
    },
    "openingIntervals": [{
        "$type": "StartEndInterval",
        "start": "2016-12-06T08:00:00+01:00",
        "end": "2016-12-06T18:00:00+01:00"
    }]
};



var xtour = new XTourClient();
xtour.setCredentials("xtok", "51FA3E8E-8BF3-49EF-AB82-59D807A0645C")

export default function UltimaMilla(props) {
    const [map, setMap] = React.useState(null)
    const [unidades, setUnidades] = React.useState([])
    const [paquetes, setPaquetes] = React.useState([])
    const [open, setOpen] = React.useState(false);
    const [state, setState] = React.useState({
        tour: [],
        height: window.innerHeight,

    })

    function convertData() {
        var array = []
        array.push(DepotA);
        array = array.concat((arrayPonts.map((p, index) => (
            {
                "$type": "CustomerSite",
                "id": "Customer" + index,
                "routeLocation": {
                    "$type": "OffRoadRouteLocation",
                    "offRoadCoordinate": {
                        "x": p[0],
                        "y": p[1]
                    }
                },
                "openingIntervals": [{
                    "$type": "StartDurationInterval",
                    "start": "2016-12-06T10:00:00+01:00",
                    "duration": "7200.0"
                }]
            }
        ))))
        return array
    }

    useEffect(value => {
        calculatTour()
        getAllUnidades()
    }, [])



    function calculatTour() {
        xtour.planTours({
            "locations": convertData(),
            "orders":
                arrayPonts.map((p, index) => (
                    {
                        "$type": "VisitOrder",
                        "id": "VisitOrder" + index,
                        "locationId": "Customer" + index,
                    }
                )),
            "fleet": {
                "vehicles": [{
                    "ids": ["vehicle1"],
                    "maximumQuantityScenarios": [{
                        "quantities": [10000.0]
                    }],
                    "startLocationId": "DepotA",
                    "endLocationId": "DepotA"
                }]
            },
            "distanceMode": {
                "$type": "DirectDistance"
            }
        }, function (toursResponse, exception) {

            var tour = []


            setState({ ...state, tour: tour })
            console.log(toursResponse)
        })
    }

    function getAllUnidades() {
        const url = `${process.env.REACT_APP_API_URL}/Unidades/GetListado`;
        axios.get(url, { headers }).then((respuesta) => {
            setUnidades(respuesta.data);
        });
    }

    const handleTooltipClose = () => {
        setOpen(false);
    };



    return (
        <div>
            <header className="topbar clearfix">
                <Cabecera />
            </header>

            {/*Leftbar Start Here*/}
            <aside className="iconic-leftbar">
                <BarraLateralIzquierda />
            </aside>
            {/*Leftbar End Here*/}

            {/*Page Container Start Here*/}
            <section className="main-container">

                <div className="container-fluid">

                    <div className="page-header filled full-block light">
                        <div className="row">
                            <div className="col-md-6 col-sm-6">
                                <h2>Última Milla</h2>
                            </div>

                        </div>
                    </div>

                    <div className="widget-wrap">
                        <div className="widget-content">
                            <div className="row" style={{ height: state.height - 250, width: '100%' }}>
                                <MapContainer style={{ width: "100%", height: "100%", zIndex: 1 }} center={[32.62781, -115.44632]} zoom={15} scrollWheelZoom={false} whenCreated={setMap}>

                                    <TileLayer style={{ width: "100%", height: "100%" }}
                                        url="https://xserver2-america-test.cloud.ptvgroup.com/services/rest/XMap/tile/{z}/{x}/{y}?userLanguage=es&amp;xtok={token}"
                                        token="51FA3E8E-8BF3-49EF-AB82-59D807A0645C"
                                    />

                                    {arrayPonts.map((value, index) => {
                                        return (
                                            <Marker key={index} icon={MarkerIcon} draggable={false} position={[value[1], value[0]]} >
                                                <Popup>{index}</Popup>
                                            </Marker>
                                        )
                                    })}

                                    <div className="leaflet-top leaflet-right">
                                        <div className="leaflet-control leaflet-bar" style={{ border: "none" }}>
                                            <div className="container">
                                                <div className="row">
                                                    <div className="col-md-2">
                                                        <Chip
                                                            icon={<FaceIcon />}
                                                            label="Cuidad"
                                                            onClick={() => console.log("Press")}
                                                            variant="outlined"
                                                        />
                                                    </div>
                                                    <div className="col-md-1">
                                                        <Chip
                                                            icon={<FaceIcon />}
                                                            label="Fecha"
                                                            onClick={() => console.log("Press")}
                                                            variant="outlined"
                                                        />
                                                    </div>
                                                    <div className="col-md-1">
                                                        <Chip
                                                            icon={<FaceIcon />}
                                                            label="Paquetes"
                                                            onClick={() => console.log("Press")}
                                                            variant="outlined"
                                                        />
                                                    </div>

                                                    <div className="col-md-1">
                                                        <BootstrapTooltip
                                                            PopperProps={{
                                                                disablePortal: false,
                                                            }}
                                                            onClose={handleTooltipClose}
                                                            open={open}
                                                            disableFocusListener
                                                            disableHoverListener
                                                            disableTouchListener
                                                            title={
                                                                <List
                                                                    component="nav"
                                                                    aria-labelledby="nested-list-subheader"
                                                                    subheader={
                                                                        <ListSubheader component="div" id="nested-list-subheader" style={{ backgroundColor: "#F9A03E" }}>
                                                                            Selección de Unidades
                                                                  </ListSubheader>
                                                                    }
                                                                    style={{ width: '100%' }}
                                                                >
                                                                    {
                                                                        unidades.map(u =>
                                                                            <ListItem>

                                                                            </ListItem>)
                                                                    }
                                                                </List>
                                                            }>
                                                            <Chip
                                                                icon={<FaceIcon />}
                                                                label="Unidades"
                                                                onClick={() => setOpen(!open)}
                                                                variant="outlined"
                                                            />
                                                        </BootstrapTooltip>

                                                    </div>
                                                    <div className="col-md-1">
                                                        <Chip
                                                            icon={<FaceIcon />}
                                                            label="Ajustes"
                                                            onClick={() => console.log("Press")}
                                                            variant="outlined"
                                                        />
                                                    </div>
                                                    <div className="col-md-2">
                                                        <Chip
                                                            icon={<FaceIcon />}
                                                            label="Generar Rutas"
                                                            onClick={() => console.log("Press")}
                                                        />
                                                    </div>
                                                    <div className="col-md-2">
                                                        <Chip
                                                            icon={<FaceIcon />}
                                                            label="Enviar a Repartidores"
                                                            onClick={() => console.log("Press")}
                                                        />
                                                    </div>
                                                </div>
                                            </div>

                                        </div>
                                    </div>


                                </MapContainer>
                            </div>

                        </div>
                    </div>




                </div>

            </section>
        </div>
    );
}

const useStylesBootstrap = makeStyles((theme) => ({
    arrow: {
        color: "#F9A03E",
    },
    tooltip: {
        backgroundColor: "white",
    },
}));

function BootstrapTooltip(props) {
    const classes = useStylesBootstrap();

    return <Tooltip arrow classes={classes} {...props} />;
}

function TripPoint(props) {
    const [state, setState] = React.useState({ polygon: [] })
    const blackOptions = { color: '#65a0f4' }
    useEffect(value => {

    }, [])

    return <Polyline pathOptions={blackOptions} positions={state.polygon} />;
}