import React from 'react';

const labelContainerStyle ={
    margin: '10px'
}

const labelStyle = {
    color: '#F9A03E'
}
const detailsContainerStyle = {
    display: 'flex',
    flexDirection: 'row'
}

export default function InformacionEntrega(props){
    console.log(props.entrega);
    const destinationAddress = props.entrega.destinationAddress;
    const id = props.entrega.id;
    const date = props.entrega.date;
    const serviceType = props.entrega.serviceType;

    return(
        <div>
            <h3>Dirección de entrega</h3>
            <p>{destinationAddress}</p>
            <h3>Detalle de Envío</h3>
            <div style={detailsContainerStyle}>
                <div style={labelContainerStyle}><span style={labelStyle}>Folio: </span><span>{id}</span></div>
                <div style={labelContainerStyle}><span style={labelStyle}>Fecha: </span><span>{date}</span></div>
                <div style={labelContainerStyle}><span style={labelStyle}>Tipo de servicio: </span><span>{serviceType}</span></div>
            </div>
            
        </div>
    )
}

