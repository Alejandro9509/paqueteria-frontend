import React, { useEffect, useState, useMemo } from "react";
import $ from 'jquery';
import axios from "axios";
import Carousel from "re-carousel";
import Barra from "../Util/jquery-barcode"
import QR from "../Util/jquery.qrcode"
window.jQuery = window.$ = $; 

function ImpresionGuia() {
	var React = require('react');
	var QRCode = require('qrcode.react');

	const [data, setData] = React.useState([])
	const [state, setState] = React.useState({
		muestraPaquetes:false,
		nGuiaId:nGuia,
		paquetes:[{
		CiudadOrigen: "",
				Remitente: "",
				CiudadRemitente:"",
				RFC: "",
				Direccion: "",
				Zona: "",
				CP: 0,
				Telefono: "",
				CiudadDestino: "",
				RFCDestinatario: "",
				DireccionDestinatario: "",
				ZonaDestinatario: "",
				CPDestinatario:0,
				CiudadDestinatario: "",
				TelefonoDestinatario: "",
				FolioPaquete:"",
				Cantidad:0,
				Descripcion:""
		}]
	});
	const headers = {
		'Content-Type': 'application/json'
	  }
	 function getImpresion() {
		 //alert (state.nGuiaId);
		
		if (state.muestraPaquetes === true) return;
		
		const url = `${process.env.REACT_APP_API_URL}/Guia/GetImpresion/` + state.nGuiaId;
     axios.get(url, { headers }).then(respuesta => {
		setState({
			...state,		 	
			paquetes:[],
			muestraPaquetes:true 
		  });
		  const paquetesTemp = state.paquetes;
		  for (var i = 0; i < respuesta.data.length; i++) {

	
			paquetesTemp.push({
	
				CiudadOrigen: respuesta.data[i].m_sCiudadOrigen,
				Remitente: respuesta.data[i].m_sNOmbreRemitente,
				CiudadRemitente:respuesta.data[i].m_sCiudadRemitente,
				RFC: respuesta.data[i].m_sRFCRemitente,
				Direccion: respuesta.data[i].m_sDomicilioRemitente,
				Zona: respuesta.data[i].m_sZonaRemitente,
				CP: respuesta.data[i].m_nIdCodigoPostalRemitente,
				Telefono: respuesta.data[i].m_sTelefonoRemitente,
				CiudadDestino: respuesta.data[i].m_sCiudadDestino,
				RFCDestinatario: respuesta.data[i].m_sRFCDestinatario,
				DireccionDestinatario: respuesta.data[i].m_sDomicilioDestinatario,
				ZonaDestinatario: respuesta.data[i].m_sZonaDestino,
				CPDestinatario:respuesta.data[i].m_nIdCodigoPostalDestinatario,
				CiudadDestinatario: respuesta.data[i].m_sCiudadDestinatario,
				TelefonoDestinatario: respuesta.data[i].m_sTelefonoDestinatario,
				FolioPaquete:respuesta.data[i].m_sFolioPaquete,
				Cantidad:respuesta.data[i].m_nCantidadPaquete,
				Descripcion:respuesta.data[i].m_sDescripcionPaquete,
				Destinatario: respuesta.data[i].m_sNombreDestinatario,
				FolioPaquete:respuesta.data[i].m_sFolioPaquete,
				PaqueteCant:respuesta.data[i].m_nCantidadPaquete,
				DescripcionPaquete:respuesta.data[i].m_sDescripcionPaquete,
				RfcFiscal:respuesta.data[i].m_sRfcFiscal,
				NombreFiscal:respuesta.data[i].m_sNombreFiscal,
				Telefonos:respuesta.data[i].m_sTelefonos,
				Colonia:respuesta.data[i].m_sColonia,
				Calle:respuesta.data[i].m_sCalle
			});
		  }
		  paquetesTemp.splice(0,1);
		  setState({
			...state,
			paquetes:paquetesTemp,
			muestraPaquetes:true
		  });
		  //console.log(respuesta.data);
		  //alert(state.paquetes.length);
		  
		  //		,
		//	: respuesta.data.DireccionDestinatario,
		//	CPDestinatario: respuesta.data.CPDestinatario,
		//	TelefonoDestinatario: respuesta.data.TelefonoDestinatario,
	
	  });
	};
	function cargaDiv(indice,valor)
	{
		
		//console.log(obj);
		$("#idBarra" + indice).barcode(valor,"code128");
		
		
		

	}

	useEffect(value => {		
		getImpresion(state.nGuiaId);
	});
 	  const framesPaquete = state.paquetes.map((p, index) => {
		return (
			<div key={`paquete${index}`}>
   
		<div className="widget-wrap" id="conceptosFacturacion">
			
			<div className="widget-header">
				<div className="col-md-12">
					<div className="col-md-6">				
						<h2>{state.paquetes[index].NombreFiscal}</h2>
					<h3>{state.paquetes[index].Colonia} {state.paquetes[index].Calle}</h3>					
					<h3>Tel:{state.paquetes[index].Telefonos}</h3>
					<h3>RFC:{state.paquetes[index].RfcFiscal}</h3>
					</div>
					<div className="col-md-6">
						<div className="col-md-6">
						<div id={"idBarra"+index}>
							<label>{cargaDiv(index,state.paquetes[index].FolioPaquete)}</label>
						</div>
						</div>
						<div className="col-md-6">
						<QRCode value={state.paquetes[index].FolioPaquete} size="48"></QRCode>
						</div>
						<h3>{state.paquetes[index].FolioPaquete}</h3>
					</div>
				</div>                       
			</div>	<div className="widget-container">
				<div className="widget-content">
					<div className="row">
						<div className="col-md-12">
							<form className="j-forms">
								<div className="form-content">
									<div className="col-md-6">
										<div class="col-md-12 unit">
											<label className="label">
												Remitente
											</label>
											<div className="input">                  
												<input
												className="form-control"
												type="text"
												placeholder={state.paquetes[index].Remitente}
												id={"Remitente"+index}
												disabled="disabled"
												/>
											</div>
										</div>
										<div class="col-md-12 unit">
											<label className="label">
												RFC
											</label>
											<div className="input">                  
												<input                    
												className="form-control"
												type="text"
												placeholder={state.paquetes[index].RFC}
												id={"RFC"+index}
												disabled="disabled"
												/>
											</div>
										</div>
										<div class="col-md-12 unit">
											<label className="label">
												Dirección
											</label>
											<div className="input">                  
												<input
												className="form-control"
												type="text"
												placeholder={state.paquetes[index].Direccion}
												id={"Direccion"+index}
												disabled="disabled"
												/>
											</div>
										</div>
										<div class="col-md-12 unit">
											<label className="label">
												Zona
											</label>
											<div className="input">                  
												<input
												className="form-control"
												type="text"
												placeholder={state.paquetes[index].Zona}
												id={"Zona"+index}
												disabled="disabled"
												/>
											</div>
										</div>
										<div class="col-md-12 unit">
											<label className="label">
												CP
											</label>
											<div className="input">                  
												<input
												className="form-control"
												type="text"
												placeholder={state.paquetes[index].CP}
												id={"CP"+index}
												disabled="disabled"
												/>
											</div>
										</div>
										<div class="col-md-12 unit">
											<label className="label">
												Ciudad
											</label>
											<div className="input">                  
												<input
												className="form-control"
												type="text"
												placeholder={state.paquetes[index].CiudadRemitente}
												id={"CiudadRemitente"+index}
												disabled="disabled"
												/>
											</div>
										</div>
										<div class="col-md-12 unit">
											<label className="label">
												Teléfono
											</label>
											<div className="input">                  
												<input
												className="form-control"
												type="text"
												placeholder={state.paquetes[index].Telefono}
												id={"Telefono"+index}
												disabled="disabled"
												/>
											</div>
										</div>
										
										
									</div>							
									<div className="col-md-6">
										<div class="col-md-12 unit">
											<label className="label">
												Destinatario
											</label>
											<div className="input">                  
												<input
												className="form-control"
												type="text"
												placeholder={state.paquetes[index].Destinatario}
												id={"CiudadDestino"+index}
												disabled="disabled"
												/>
											</div>
										</div>
										<div class="col-md-12 unit">
											<label className="label">
												RFC
											</label>
											<div className="input">                  
												<input                    
												className="form-control"
												type="text"
												placeholder={state.paquetes[index].RFCDestinatario}
												id={"RFC"+index}
												disabled="disabled"
												/>
											</div>
										</div>
										<div class="col-md-12 unit">
											<label className="label">
												Dirección
											</label>
											<div className="input">                  
												<input
												className="form-control"
												type="text"
												placeholder={state.paquetes[index].DireccionDestinatario}
												id={"Direccion"+index}
												disabled="disabled"
												/>
											</div>
										</div>
										<div class="col-md-12 unit">
											<label className="label">
												Zona
											</label>
											<div className="input">                  
												<input
												className="form-control"
												type="text"
												placeholder={state.paquetes[index].ZonaDestinatario}
												id={"Zona"+index}
												disabled="disabled"
												/>
											</div>
										</div>
										<div class="col-md-12 unit">
											<label className="label">
												CP
											</label>
											<div className="input">                  
												<input
												className="form-control"
												type="text"
												placeholder={state.paquetes[index].CPDestinatario}
												id={"CP"+index}
												disabled="disabled"
												/>
											</div>
										</div>
										<div class="col-md-12 unit">
											<label className="label">
												Ciudad
											</label>
											<div className="input">                  
												<input
												className="form-control"
												type="text"
												placeholder={state.paquetes[index].CiudadDestinatario}
												id={"Ciudad"+index}
												disabled="disabled"
												/>
											</div>
										</div>
										<div class="col-md-12 unit">
											<label className="label">
												Teléfono
											</label>
											<div className="input">                  
												<input
												className="form-control"
												type="text"
												placeholder={state.paquetes[index].TelefonoDestinatario}
												id={"Telefono"+index}
												disabled="disabled"
												/>
											</div>
										</div>
										<div class="col-md-12 unit">
											<label className="label">
												Cantidad
											</label>
											<div className="input">                  
												<input
												className="form-control"
												type="text"
												placeholder={state.paquetes[index].PaqueteCant}
												id={"Cantidad"+index}
												disabled="disabled"
												/>
											</div>
										</div>
										<div class="col-md-12 unit">
											<label className="label">
												Descripcion
											</label>
											<div className="input">                  
												<input
												className="form-control"
												type="text"
												placeholder={state.paquetes[index].DescripcionPaquete}
												id="Cantidad"
												disabled="disabled"
												/>
											</div>
										</div>
										
									</div>	
									<div className="col-md-12">						
									<div className="col-md-6">
										<div className="widget-header">
											<div className="col-md-12">
												<h2>{state.paquetes[index].CiudadOrigen}</h2>
											</div>                                  
										</div>
									</div>
									<div className="col-md-6">
										<div className="widget-header">
											<div className="col-md-12">
												<h2>{state.paquetes[index].CiudadDestino}</h2>
											</div>                                  
										</div>
									</div>
									</div>
								</div>
							</form>
						</div>
					</div>
				</div>
			</div>
	
			</div>								
	   </div>
	   ); 
		});
		
		return <div style={{ padding: "20px" }}>
		<div>
		 
		  {framesPaquete}
		</div>
	  </div>
}
export default ImpresionGuia;
