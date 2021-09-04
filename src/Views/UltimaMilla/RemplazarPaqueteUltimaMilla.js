import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {Button, Dialog, DialogActions, DialogContent, DialogTitle, Typography} from "@material-ui/core";
import {DataGrid} from "@material-ui/data-grid";
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
                    width: 250,
                }, {
                    headerName: "Cliente",
                    field: "m_sNombreRemitente",
                    valueFormatter: (params) => `${params.row.m_bEsRecoleccion ? params.row.m_sNombreRemitente : params.row.m_sNombreDestinatario}`,
                    width: 300,
                }, {
                    headerName: "Dirección",
                    field: "m_sDomicilioRemitente",
                    valueFormatter: (params) => `${params.row.m_bEsRecoleccion? params.row.m_sDomicilioRemitente : params.row.m_sDomicilioDestinatario}`,
                    width: 300,
                }
            ]
        }
        this.handlePaquetesSeleccionadas = this.handlePaquetesSeleccionadas.bind(this)
        this.onSubmitData = this.onSubmitData.bind(this)
    }


    handlePaquetesSeleccionadas = (e) => {
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
                <DialogTitle><Typography variant={"h4"}>Seleccionar Paquete</Typography> </DialogTitle>
                <DialogContent>
                    <div style={{ display: 'flex', height: '400px' }}>
                        <DataGrid
                            localeText={dataGridLocaleText}
                            rows={this.props.data}
                            columns={this.state.columns}
                            density="compact"
                            pageSize={Math.floor((this.state.height - 310) / 30)}
                            getRowId={(row) => row.m_sFolio}
                            checkboxSelection={this.props.multiples}
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
