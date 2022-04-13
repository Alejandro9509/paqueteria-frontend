import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {Button, Dialog, DialogActions, DialogContent, DialogTitle, Typography} from "@material-ui/core";
import {DataGrid} from "@material-ui/data-grid";
import {dataGridLocaleText} from "../../Constants";

class PaquetesParcialesGuia extends Component{
    constructor(props){
        super(props);
        this.state ={
            height: window.innerHeight,
            idsPaquetesSeleccionadas: [],
            columns: [
                {
                    headerName: "Paquete",
                    field: "m_sFolio",
                    width: 150,
                }, {
                    headerName: "Identificador",
                    field: "IdTipoEmpaque",
                    valueFormatter: (params) => `${params.value ? "Recolección" : "Entrega"}`,
                    width: 250,
                }, {
                    headerName: "Embalaje",
                    field: "m_sNombreRemitente",
                    valueFormatter: (params) => `${params.row.m_bEsRecoleccion ? params.row.m_sNombreRemitente : params.row.m_sNombreDestinatario}`,
                    width: 150,
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
                maxWidth={'lg'}
                open={this.props.open}
                onClose={this.props.close}
                aria-labelledby="max-width-dialog-title"
            >
                <DialogTitle><Typography variant={"h4"}>Seleccionar Paquete</Typography> </DialogTitle>
                <DialogContent>
                    <div style={{ display: 'flex', height: '300px' }}>
                        <DataGrid
                            localeText={dataGridLocaleText}
                            rows={this.props.data}
                            columns={this.state.columns}
                            density="compact"
                            isRowSelectable={(params) => params.row.isItemSelected}
                            pageSize={Math.floor((this.state.height - 310) / 30)}
                            getRowId={(row) => row.m_sFolio}
                            checkboxSelection={true}
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

PaquetesParcialesGuia.propTypes = {};

export default PaquetesParcialesGuia;