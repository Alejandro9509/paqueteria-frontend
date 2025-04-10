// src/DisplayMapFC.js

import React, { useEffect, useMemo, useRef } from 'react';
import "../App.css"

import onResize from 'simple-element-resize-detector';
import { MapContainer, TileLayer, Marker, Popup, useMapEvents, Polyline } from 'react-leaflet'
import MarkerImage from '../iconos/Mapa/marker.png';

import L from 'leaflet';

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

const blackOptions = { color: '#65a0f4' }

export function DisplayMapClass(props) {
    const [state, setState] = React.useState({})

    useEffect(value =>{
        setState({print: true})
    },[])

    return (
        <MapContainer style={{ width: "100%", height: "500px" }} center={[32.62781, -115.44632]} zoom={13} scrollWheelZoom={false} whenCreated={props.setMap}>
            <TileLayer style={{ width: "100%", height: "500px" }}
                url="https://xserver2-america.cloud.ptvgroup.com/services/rest/XMap/tile/{z}/{x}/{y}?userLanguage=es&amp;xtok={token}"
                token="51FA3E8E-8BF3-49EF-AB82-59D807A0645C"
            />
            {props.markers.map((value, index) => {
                return (
                    <LocationMarker markerId={index} position={value.location} label={value.label} />
                )
            })}
            <MapEvents isManual={props.isManual} setNewPoint={props.setNewPoint}/>
            {
                props.polygon &&
                <Polyline pathOptions={blackOptions} positions={props.polygon} />

            }
        </MapContainer>

    )


}

function MapEvents(props) {
    const map = useMapEvents({
        click(e) {
            console.log(e)
            if (props.isManual){
                props.setNewPoint(e.latlng)
            }
        },
    })
    return (<div></div>)
}

export function LocationMarker(props) {
    const markerRef = useRef(null)

    const eventHandlers = useMemo(
        () => ({
          dragend() {
            const marker = markerRef.current
            if (marker !== null) {
                props.cambiarUbicacion(marker._latlng)
            }
          },
        }),
        [],
      )

    return (
        <Marker key={props.markerId} eventHandlers={eventHandlers} icon={MarkerIcon} draggable={props.draggable} position={props.position} ref={markerRef}>
            {props.children}
        </Marker>
    )
}