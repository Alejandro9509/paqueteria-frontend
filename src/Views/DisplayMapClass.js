// src/DisplayMapFC.js

import React from 'react';
import "../App.css"
import H, { mapevents } from "@here/maps-api-for-javascript";
import onResize from 'simple-element-resize-detector';
import { MapContainer, TileLayer, Marker, Popup, useMapEvents, Polyline } from 'react-leaflet'

const XRouteClient = window.XRouteClient;


const blackOptions = { color: 'black' }

var A = {
    "$type": "OnRoadWaypoint",
    "location": {
        "coordinate": {
            "x": -115.44632,
            "y": 32.62781
        },
        "considerAlternativeNearByRoads": true
    }
};

var B = {
    "$type": "OnRoadWaypoint",
    "location": {
        "coordinate": {
            "x": -117.00371,
            "y": 32.5027
        }
    }
};

export class DisplayMapClass extends React.Component {

    constructor(props) {
        super(props);
        // the reference to the container
        this.ref = React.createRef();
        this.state = {
            route: null,
            polygon: []
        }
        this.xroute = null
        this.routed = this.routed.bind(this)
        // reference to the map
    }

    
    calculateRoute(){
        
        this.xroute.calculateRoute({
            "waypoints": [A, B],
            "resultFields": {
                "polyline": true,
                "eventTypes": [
                    "MANEUVER_EVENT",
                    "TOLL_EVENT"
                ],
                "guidedNavigationRoute": true
            },
            "routeOptions": {
                "polylineOptions": {
                    "elevations": true
                }
            }
        }, this.routed);
    }


    componentDidMount() {
        this.xroute = new XRouteClient();
        this.xroute.setCredentials("xtok", "51FA3E8E-8BF3-49EF-AB82-59D807A0645C")
        this.calculateRoute()
    }

    routed(route, exc) {
        var polygon = []
        route.polyline.plain.polyline.map(c => {
            polygon.push([c.y, c.x])
        })
        this.setState({
            route: route,
            polygon: polygon
        })
    }




    render() {
        return (
            <MapContainer ref={this.ref} style={{ width: "100%", height: "400px" }} center={[ 32.62781,-115.44632]} zoom={13} scrollWheelZoom={false}>
                <TileLayer style={{ width: "100%", height: "100%" }}
                    attribution='&copy; <a href="http://osm.org/copyright">PTV, HERE</a> contributors'
                    url="https://xserver2-america-test.cloud.ptvgroup.com/services/rest/XMap/tile/{z}/{x}/{y}"
                />
                {this.props.markers.map(value => {
                    return (
                        <LocationMarker position={value.location} />
                    )
                })}
                <MapEvents />
                {
                    this.state.route &&
                    <Polyline pathOptions={blackOptions} positions={this.state.polygon} />

                }
            </MapContainer>
        )
    }


}

function MapEvents() {
    const map = useMapEvents({
        click(e) {
            map.locate()
            console.log(e)
        }
    })
    return ("")
}

function LocationMarker(props) {

    return (
        <Marker position={props.position}>
            <Popup>You are here</Popup>
        </Marker>
    )
}