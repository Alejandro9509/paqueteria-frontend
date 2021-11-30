CREATE PROCEDURE [dbo].[usp_ProGuiaAgregarPQ](	
	@Tracking int ,
	@FolioGuia int ,
	@Fecha date,
	@Hora time,
	@IdEstatusGuia int,
	@IdEmbarque int,
	@IdMoneda int,
	@TipoCambio int ,
	@CreadoEl datetime,
	@CreadoPor int,
	@ModificadoEl datetime,
	@ModificadoPor int,
	@IdSucursal int,
	@ValorDeclarado money,
	@IdTipoServicio int,
	@IdInforme int
	)
AS
BEGIN
    BEGIN TRANSACTION
        DECLARE @IdGuia int;
        DECLARE @FOLIO int;
        DECLARE @FOLIOSTR varchar(10);
        DECLARE @TRACKINGSTR varchar(10);
        IF ISNULL(@IdSucursal, 0) = 0 begin
            RAISERROR(N'*INICIO*El Identificador de sucursal es un campo requerido*FIN*', 16, 1)
            GOTO CANCELAR_TRANSACCION
            return;
        end

        IF ISNULL(@IdEmbarque, 0) = 0 begin
            RAISERROR(N'*INICIO*El identificador del embarque es un campo requerido*FIN*', 16, 1)
            GOTO CANCELAR_TRANSACCION
            return;
        end
        /*
        IF ISNULL(@FolioGuia, 0) = 0 begin
            RAISERROR(N'*INICIO*El Folio de guia es un campo requerido*FIN*', 16, 1)
            GOTO CANCELAR_TRANSACCION
            return;
        end*/
        IF ISNULL(@IdEstatusGuia, 0) = 0 begin
            RAISERROR(N'*INICIO*El identificador del estatus de la guia es un campo requerido*FIN*', 16, 1)
            GOTO CANCELAR_TRANSACCION
            return;
        end
        IF ISNULL(@Fecha, '') = '' begin
            RAISERROR(N'*INICIO*La fecha es un campo requerido*FIN*', 16, 1)
            GOTO CANCELAR_TRANSACCION
            return;
        end
        /*IF ISNULL(@Hora, '') = '' begin
            RAISERROR(N'*INICIO*La hora es un campo requerido*FIN*', 16, 1)
            GOTO CANCELAR_TRANSACCION
            return;
        end*/
        IF ISNULL(@IdMoneda, 0) = 0 begin
            RAISERROR(N'*INICIO*La moneda es un campo requerido*FIN*', 16, 1)
            GOTO CANCELAR_TRANSACCION
            return;
        end
        IF ISNULL(@IdMoneda, 0) = 0 begin
            RAISERROR(N'*INICIO*La moneda es un campo requerido*FIN*', 16, 1)
            GOTO CANCELAR_TRANSACCION
            return;
        end
        IF ISNULL(@TipoCambio, 0) = 0 begin
            RAISERROR(N'*INICIO*El Tipo de cambio de estatus es un campo requerido*FIN*', 16, 1)
            GOTO CANCELAR_TRANSACCION
            return;
        end
        EXEC @FOLIO = GenerarSecuenciaPQ @proceso=3;
        --	RAISERROR(N'*INICIO*El Tipo de cambio de estatus es un campo requerido*FIN*' ,  -1, 1,@FOLIO )

        select @FOLIOSTR = [dbo].[GeneraFolioPQ](3, @FOLIO);

        insert into dbo.ProGuiaPQ (FolioGuia,Fecha,Hora,IdEstatusGuia,IdEmbarque,
                                   IdMoneda,TipoCambio,CreadoEl,CreadoPor,ModificadoEl,ModificadoPor,IdSucursal,
                                   ValorDeclarado,IdTipoServicio,IdInforme, Latitud, Longitud)

        VALUES
        (
            @FOLIOSTR,@Fecha,CONVERT(TIME, GETDATE()),@IdEstatusGuia,@IdEmbarque,
            @IdMoneda,@TipoCambio,@CreadoEl,@CreadoPor,@ModificadoEl,@ModificadoPor,@IdSucursal,
            @ValorDeclarado,@IdTipoServicio,@IdInforme, (select Latitud from ProEmbarquePQ where IdEmbarque = @IdEmbarque), (select Longitud from ProEmbarquePQ where IdEmbarque = @IdEmbarque));
        IF @@TRANCOUNT > 0
            BEGIN
                SELECT @IdGuia = @@identity;
                UPDATE ProGuiaPQ SET Tracking = (SELECT CONCAT('G',ABS(CAST(CAST(NEWID() AS VARBINARY) AS INT)), @IdGuia)) Where IdGuia = @IdGuia;
                UPDATE ProEmbarquePQ
                SET IdGuia = @IdGuia
                WHERE IdEmbarque = @IdEmbarque;
                COMMIT TRANSACTION
            END
        ELSE
            BEGIN
                GOTO CANCELAR_TRANSACCION


                CANCELAR_TRANSACCION:
                IF @@TRANCOUNT > 0
                    BEGIN
                        EXECUTE usp_GetErrorInfoPQ;
                        ROLLBACK TRANSACTION
                        RETURN -1
                    END
            END
end
go

