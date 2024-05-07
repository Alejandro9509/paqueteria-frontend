import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {Button, Dialog, DialogActions, DialogContent, DialogTitle, Typography} from "@mui/material";
import {DataGrid} from "@mui/x-data-grid";
import {dataGridLocaleText} from "../../Constants";

class RemplazarPaqueteUltimaMilla extends Component {
    constructor(props) {
        super(props);
        this.state = {
            height: window.innerHeight,
            idsPaquetesSeleccionadas: [],
            columns: [
                {
                    headerName: "Folio",
                    field: "m_sFolio",
                    width: 150,
                }, {
                    headerName: "Tipo",
                    field: "m_bEsRecoleccion",
                    valueFormatter: (params) => `${params.value ? "Recolección" : "Entrega"}`,
                }, {
                    headerName: "Tipo de cobro",
                    field: "m_sTipoCobro",
                    width: 150,
                }, {
                    headerName: "Zona",
                    field: "m_sZona",
                    width: 150,
                }, {
                    headerName: "Cliente",
                    field: "m_sNombreRemitente",
                    valueFormatter: (params) => `${params.row.m_bEsRecoleccion ? params.row.m_sNombreRemitente : params.row.m_sNombreDestinatario}`,
                    width: 300,
                }, /*{
                    headerName: "Estatus cliente",
                    field: "m_bClienteBloqueado",
                    valueFormatter: (params) => `${params.row.m_bClienteBloqueado ? "Bloqueado" : "Activo"}`,
                    width: 150,
                },*/ {
                    headerName: "Domicilio",
                    field: "m_sDomicilioRemitente",
                    valueFormatter: (params) => `${params.row.m_bEsRecoleccion? params.row.m_sDomicilioRemitente : params.row.m_sDomicilioDestinatario}`,
                    width: 300,
                }, {
                    headerName: "Ventana de entrega",
                    field: "m_sFechaRecoleccionCita",
                    width: 150,
                    valueFormatter: (params) =>
                        `${params.row.m_bCitaPendiente ? "Cita pendiente" : 
                            (params.row.m_bEsRecoleccion ? 
                                (!params.row.m_bRecoleccionConCita ? "Sin cita" : 
                                        (params.row.m_sFechaRecoleccionCita + " " + params.row.m_sHoraCitarRecoleccionMinima + " a " + params.row.m_sHoraCitaRecoleccionMaxima)
                                ) : 
                                (!params.row.m_bEmbarqueConCita ? "Sin Cita" : 
                                    (params.row.m_sFechaEmbarqueCita + " " + params.row.m_sHoraEmbarqueCitaMinima + " a " + params.row.m_sHoraEmbarqueCitaMaxima)
                                )
                            )}`,

                }, {
                    headerName: "Fecha",
                    field: "m_dFechaRegistro",
                }, {
                    headerName: "Estatus",
                    field: "m_sEstatusUltimaMilla",
                }
            ]
        }
        this.handlePaquetesSeleccionadas = this.handlePaquetesSeleccionadas.bind(this)
        this.onSubmitData = this.onSubmitData.bind(this)
    }


    handlePaquetesSeleccionadas = (e) => {
        console.log(e)
        this.setState({
            idsPaquetesSeleccionadas: e.selectionModel,
        })
    }

    componentDidMount() {

    }

    onSubmitData(e){
        e.preventDefault()
        this.props.onSubmit(this.props.data.filter(g => this.state.idsPaquetesSeleccionadas.includes(g.m_sFolio) ))
    }


    render() {

        return (
            <Dialog
                fullWidth={true}
                maxWidth={'xl'}
                open={this.props.open}
                onClose={this.props.close}
                aria-labelledby="max-width-dialog-title"
            >
                <DialogTitle><Typography variant={"h4"}>Seleccionar Paquete</Typography></DialogTitle>
                <DialogContent>
                    <Typography variant={"h4"}>*No se muestran los registros que tienen cliente bloqueado.</Typography>
                    <div style={{ display: 'flex', height: '400px' }}>
                        <DataGrid
                            localeText={dataGridLocaleText}
                            rows={this.props.data.filter((i) => !i.m_bClienteBloqueado)}
                            columns={this.state.columns}
                            density="compact"
                            isRowSelectable={(params) => false}
                            pageSize={Math.floor((this.state.height - 310) / 30)}
                            getRowId={(row) => row.m_sFolio}
                            checkboxSelection
                            disableSelectionOnClick={true}
                            onSelectionModelChange={(e) => this.handlePaquetesSeleccionadas(e)}
                        />
                    </div>
                </DialogContent>
                <DialogActions>
                    <Button onClick={this.props.close} color="primary">
                        Cerrar
                    </Button>
                    <Button onClick={this.onSubmitData} color="primary" autoFocus>
                        Aceptar
                    </Button>

                </DialogActions>
            </Dialog>
        );
    }
}

RemplazarPaqueteUltimaMilla.propTypes = {};

export default RemplazarPaqueteUltimaMilla;
