-- =============================================
-- Author:		<Author,,Name>
-- Create date: <Create Date,,>
-- Description:	<Description,,>
-- =============================================
ALTER PROCEDURE [dbo].[usp_ProUltimaMillaGetPaquetesListadoPQ]
	@Zona varchar(MAX),
	@TipoBusqueda int

AS
BEGIN TRY
	BEGIN TRANSACTION
	DECLARE @tempUltimaMillaPaquetes TABLE  
    (
        id int PRIMARY KEY IDENTITY(1,1),
        m_nIdPaquete int,
		m_bEsRecoleccion bit,
		m_nEstatusUlimaMilla int,
		m_dFechaRegistro Date,
		m_tHoraRegistro Time,
		m_nIdTipoDeCobro int,
		m_sTipoCobro text,
		m_sFolio text,
		m_sCiudadDestino text,
		m_sCiudadOrigen text,
		m_bRecoleccionConCita  bit,
		m_sFechaRecoleccionCita date,
		m_sHoraCitarRecoleccionMinima time,
		m_sHoraCitaRecoleccionMaxima time,
		m_sEstatusRecoleccion  text,
		m_sEstatusEmbarque text,

		m_bRecoleccionDiferenteDomicilio bit,
		m_sDomicilioDetalleRecoleccion text,
		m_sRecogerEnDetalleRecoleccion text,
		m_sDatosAdicionalesDetalleRecoleccion text,

		m_bEntregaDiferenteDomicilio bit,
		m_sDomicilioDetalleEntrega text,
		m_sEntregarEnDetalleEntrega text,
		m_sDatosAdicionalesDetalleEntrega text,

		m_sNombreRemitente text,
		m_sCalleRemitente text,
		m_sNoIntRemitente text,
		m_sNoExtRemitente text,
		m_sColoniaRemitente text,
		m_sRFCRemitente text,
		m_sDomicilioRemitente text,
		m_sCorreoRemitente text,
		m_sCorreoDestinatario text,
		m_sTelefonoRemitente text,
		m_sContactoRemitente text,

		m_sNombreDestinatario text,
		m_sCalleDestinatario text,
		m_sNoIntDestinatario text,
		m_sNoExtDestinatario text,
		m_sColoniaDestinatario text,
		m_sContactoDestinatario text,
		m_sTelefonoDestinatario text,
		m_sDomicilioDestinatario text,
		m_sRFCDestinatario text,

		m_sCodigoPostalRemitente text,
		m_sCodigoPostalDestinatario text,
		m_sLatitud text,
		m_sLongitud text,
		m_nUltimaMillaOrden int,
		m_sEstatusUltimaMilla text,
		m_sMotivoCancelacion text,

		m_bEmbarqueConCita  bit,
		m_sFechaEmbarqueCita  date,
		m_sHoraEmbarqueCitaMinima  time,
		m_sHoraEmbarqueCitaMaxima  time,
		m_sNombreResponsablePago text,
		m_nMontoACobrar float,
		m_sZona varchar(50),
		m_sHoraEstimada text,
		m_nIdTipoPago int,
		m_sTipoPago text,
		m_nMontoRecibido float,
		m_nImporteFlete float,
		m_bClienteBloqueado bit
    )
	IF @TipoBusqueda = 1 OR @TipoBusqueda = 3 BEGIN  
	insert into @tempUltimaMillaPaquetes (m_nIdPaquete, m_bEsRecoleccion, m_dFechaRegistro, m_tHoraRegistro, m_nIdTipoDeCobro, m_sTipoCobro, m_sFolio, m_sCiudadDestino, m_sCiudadOrigen, 
		m_bRecoleccionConCita, m_sFechaRecoleccionCita, m_sHoraCitarRecoleccionMinima, m_sHoraCitaRecoleccionMaxima, m_sEstatusRecoleccion, m_sEstatusEmbarque, 
		m_bRecoleccionDiferenteDomicilio, m_sDomicilioDetalleRecoleccion, m_sRecogerEnDetalleRecoleccion, m_sDatosAdicionalesDetalleRecoleccion, m_bEntregaDiferenteDomicilio,
		m_sDomicilioDetalleEntrega, m_sEntregarEnDetalleEntrega, m_sDatosAdicionalesDetalleEntrega, m_sNombreRemitente, m_sCalleRemitente, m_sNoIntRemitente, m_sNoExtRemitente,
		m_sColoniaRemitente, m_sRFCRemitente, m_sDomicilioRemitente, m_sCorreoRemitente, m_sTelefonoRemitente, m_sContactoRemitente, m_sNombreDestinatario, m_sCalleDestinatario,
		m_sNoIntDestinatario, m_sNoExtDestinatario, m_sColoniaDestinatario, m_sContactoDestinatario, m_sTelefonoDestinatario, m_sCorreoDestinatario, m_sDomicilioDestinatario,
		m_sRFCDestinatario, m_sCodigoPostalRemitente, m_sCodigoPostalDestinatario,m_sLatitud, m_sLongitud, m_nUltimaMillaOrden,  m_sEstatusUltimaMilla, m_nEstatusUlimaMilla, m_sMotivoCancelacion,
		m_bEmbarqueConCita, m_sFechaEmbarqueCita, m_sHoraEmbarqueCitaMinima, m_sHoraEmbarqueCitaMaxima, m_sNombreResponsablePago, m_nMontoACobrar,
		m_sZona, m_sHoraEstimada, m_nIdTipoPago, m_sTipoPago, m_nMontoRecibido, m_nImporteFlete, m_bClienteBloqueado) 
		(SELECT pg.IdGuia,0, pg.Fecha, pg.Hora,pe.IdTipoCobro,
		ctc.Descripcion,pg.FolioGuia,
		(Select cc.OrigenDestino from CatOrigenesDestinos cc where cc.IdOrigenDestino = pe.IdCiudadDestino),
		(Select cc.OrigenDestino from CatOrigenesDestinos cc where cc.IdOrigenDestino = pe.IdCiudadOrigen),0, NULL, NULL,NULL, NULL,
		(select ce.Estatus from CatEstatusEmbarquePQ ce where ce.IdEstatusEmbarque = pe.IdEstatusEmbarque ),0,NULL, NULL, NULL, pe.EntregarMismoDomicilio,pe.DomicilioEntrega, pe.EntregarEn,pe.DatosAdicionales,
		pe.NombreRemitente, pe.CalleRemitente, pe.NoIntRemitente, pe.NoExtRemitente, pe.ColoniaRemitente, pe.RFCRemitente, pe.DomicilioRemitente, pe.CorreoRemitente, 
		pe.TelefonoRemitente, pe.ContactoRemitente, pe.NombreDestinatario, pe.CalleDestinatario, pe.NoIntDestinatario, pe.NoExtDestinatario, pe.ColoniaDestinatario, pe.ContactoDestinatario, 
		pe.TelefonoDestinatario, pe.CorreoDestinatario, pe.DomicilioDestinatario, pe.RFCDestinatario,(select CodigoPostal from CatCodigosPostales cc where cc.IdCodigoPostal = pe.IdCodigoPostalRemitente), 
		(select CodigoPostal from CatCodigosPostales cc where cc.IdCodigoPostal = pe.IdCodigoPostalDestinatario), pg.Latitud, pg.Longitud, pg.utimaMillaOrden, 
		(select cem.Estatus from CatEstatusUltimaMillaPQ cem where cem.IdEstatusUltimaMilla = pg.IdEstatusUltimaMilla), pg.IdEstatusUltimaMilla, pg.MotivoCancelacion,
		pe.EmbarqueConCita, pe.FechaCita, pe.HoraCitaMinima, pe.HoraCitaMaxima, (SELECT NombreFiscal FROM CatClientes cc where cc.IdCliente = pe.IdCliente),
		(select Sum((pgc.Importe + pgc.ImporteIva) - pgc.ImporteRetiene) from ProGuiaConceptoPQ pgc where pgc.IdGuia = pg.IdGuia),
		(select cz.Descripcion from CatZonasPQ cz where cz.IdZona = pe.IdZonaDestinatario), pg.HoraEstimadaUltimaMilla,  
		pg.TipoPago, (select ctp.TipoPago from CatTiposPagoPQ ctp where ctp.IdTipoPago = pg.TipoPago), pg.MontoRecibidoOperador, 
		(select SUM(pgc.Importe + pgc.ImporteRetiene) from ProGuiaConceptoPQ pgc where pgc.IdGuia = pg.IdGuia and pgc.IdConceptoFacturacion = 1),
                case when ( (cc.Bloqueado = 1) or  (ctc.BloquearUltimaMilla = 1) or (ctc.IdTipoCobro = 11 and (cc.SaldoCredito <= 0 or cc.DiasCredito <= 0))) then 1 else 0 end as Bloqueado
		FROM ProGuiaPQ pg inner join ProEmbarquePQ pe ON pe.IdGuia = pg.IdGuia inner join CatTipoCobroPQ ctc on ctc.IdTipoCobro = pe.IdTipoCobro inner join CatClientes cc on cc.IdCliente = pe.IdCliente  WHERE pe.IdZonaOperativa in ( select Item from SplitIntsPQ(@Zona, ',')) and pe.EntregaEnSucursal = 0 and pg.IdEstatusGuia = 14 );
	
	END
	IF @TipoBusqueda = 2 OR @TipoBusqueda = 3 BEGIN  
	
	insert into @tempUltimaMillaPaquetes (m_nIdPaquete, m_bEsRecoleccion, m_dFechaRegistro, m_tHoraRegistro, m_nIdTipoDeCobro, m_sTipoCobro, m_sFolio, m_sCiudadDestino, m_sCiudadOrigen, 
		m_bRecoleccionConCita, m_sFechaRecoleccionCita, m_sHoraCitarRecoleccionMinima, m_sHoraCitaRecoleccionMaxima, m_sEstatusRecoleccion, m_sEstatusEmbarque, 
		m_bRecoleccionDiferenteDomicilio, m_sDomicilioDetalleRecoleccion, m_sRecogerEnDetalleRecoleccion, m_sDatosAdicionalesDetalleRecoleccion, m_bEntregaDiferenteDomicilio,
		m_sDomicilioDetalleEntrega, m_sEntregarEnDetalleEntrega, m_sDatosAdicionalesDetalleEntrega, m_sNombreRemitente, m_sCalleRemitente, m_sNoIntRemitente, m_sNoExtRemitente,
		m_sColoniaRemitente, m_sRFCRemitente, m_sDomicilioRemitente, m_sCorreoRemitente, m_sTelefonoRemitente, m_sContactoRemitente, m_sNombreDestinatario, m_sCalleDestinatario,
		m_sNoIntDestinatario, m_sNoExtDestinatario, m_sColoniaDestinatario, m_sContactoDestinatario, m_sTelefonoDestinatario, m_sCorreoDestinatario, m_sDomicilioDestinatario,
		m_sRFCDestinatario, m_sCodigoPostalRemitente, m_sCodigoPostalDestinatario,m_sLatitud, m_sLongitud, m_nUltimaMillaOrden, m_sEstatusUltimaMilla, m_nEstatusUlimaMilla, m_sMotivoCancelacion,
		m_sNombreResponsablePago, m_sZona, m_sHoraEstimada,m_bClienteBloqueado) 
		(SELECT pe.IdRecoleccion,1, pe.Fecha, pe.Hora,pe.IdTipoDecobro,
		ctc.Descripcion,pe.FolioRecoleccion,
		(Select cc.OrigenDestino from CatOrigenesDestinos cc where cc.IdOrigenDestino = pe.IdCiudadDestino),
		(Select cc.OrigenDestino from CatOrigenesDestinos cc where cc.IdOrigenDestino = pe.IdCiudadOrigen),pe.RecoleccionConCita, pe.FechaCita, HoraCitaMinima,HoraCitaMaxima,(select ce.Estatus from CatEstatusRecoleccionPQ ce where ce.IdEstatusRecoleccion = pe.IdEstatusRecoleccion ),
		NULL,pe.RecoleccionDiferenteDomicilio,pe.DomicilioDetalleRecoleccion, pe.RecogerEnDetalleRecoleccion, DatosAdicionalesDetalleRecoleccion, 0,NULL, NULL,NULL,
		pe.NombreRemitente, pe.CalleRemitente, pe.NoIntRemitente, pe.NoExtRemitente, pe.ColoniaRemitente, pe.RFCRemitente, pe.DomicilioRemitente, pe.CorreoRemitente, 
		pe.TelefonoRemitente, pe.ContactoRemitente, pe.NombreDestinatario, pe.CalleDestinatario, pe.NoIntDestinatario, pe.NoExtDestinatario, pe.ColoniaDestinatario, pe.ContactoDestinatario, 
		pe.TelefonoDestinatario, pe.CorreoDestinatario, pe.DomicilioDestinatario, pe.RFCDestinatario, (select CodigoPostal from CatCodigosPostales cc where cc.IdCodigoPostal = pe.IdCodigoPostalRemitente), 
		(select CodigoPostal from CatCodigosPostales cc where cc.IdCodigoPostal = pe.IdCodigoPostalDestinatario), pe.Latitud, pe.Longitud, pe.OrdenUltimaMilla, 
		(select cem.Estatus from CatEstatusUltimaMillaPQ cem where cem.IdEstatusUltimaMilla = pe.IdEstatusUltimaMilla), pe.IdEstatusUltimaMilla, pe.MotivoCancelacion,
		(SELECT NombreFiscal FROM CatClientes cc where cc.IdCliente = pe.IdCliente),
		(select cz.Descripcion from CatZonasPQ cz where cz.IdZona = pe.IdZonaRemitente),  pe.HoraEstimadaUltimaMilla,
                case when (cc.Bloqueado = 1) then 1 else 0 end as Bloqueado
		FROM ProRecoleccionPQ pe inner join CatTipoCobroPQ ctc on ctc.IdTipoCobro = pe.IdTipoDecobro inner join CatClientes cc on cc.IdCliente = pe.IdCliente WHERE pe.IdZonaOperativa in ( select Item from SplitIntsPQ(@Zona, ',')) and pe.IdEstatusRecoleccion = 1 );
	
	END


	select * from @tempUltimaMillaPaquetes;

	

	COMMIT TRANSACTION
END TRY
BEGIN CATCH
	IF @@TRANCOUNT > 0 
		ROLLBACK TRANSACTION
	EXECUTE usp_GetErrorInfoPQ;
END CATCH
go

