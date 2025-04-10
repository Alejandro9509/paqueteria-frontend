import React, { Component } from "react";
import {
    TextField,
    Button,
} from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import { dataGridLocaleText } from "../../Constants";
import SearchIcon from "@mui/icons-material/Search";

class ClavesCFDI extends Component {
    constructor(props) {
        super(props);
        this.state = {
            row:[],
            reload: false,
            rowFilter: [],
            searchText:"",
            height: window.innerHeight,
            codigo: props.edit ? props.select.m_sCodigo : "",
            concepto: props.edit ? props.select.m_sConcepto : "",
            tipoSAT: "",
            claveDivision: 0,
            claveGrupo: 0,
            claveClase: 0,
            impuestos: [],
            impuestosRetencion: [],
            impuestosSeleccionadosTraslado: [],
            predeterminadoSeleccionadosTraslado: {},
            impuestosSeleccionadosRetencion: [],
            predeterminadoSeleccionadosRetencion: {},
            activo: props.edit ? props.select.m_bActivo : false,
            incluirIngresosLiquidacion: props.edit
                ? props.select.m_bCalculoIngreso
                : false,
            incluirLiquidacionFlete: props.edit
                ? props.select.m_bCalculoFlete
                : false,
            unidadMedia: props.edit ? props.select.m_sUnidadMedida : "",

            columnsUnidades: [
                {
                    headerName: "Clave SAT",
                    field: "m_sClaveSAT",
                    width: 125,
                },
                {
                    headerName: "Descripcion",
                    field: "m_sDescripcion",
                    flex: 1,
                },
            ],
        };
        this.handleChange = this.handleChange.bind(this);
        this.onSubmit = this.onSubmit.bind(this);
        this.handleChangeChecboxTraslado =
            this.handleChangeChecboxTraslado.bind(this);
        this.handleChangeChecboxTrasladoPredeterminado =
            this.handleChangeChecboxTrasladoPredeterminado.bind(this);
        this.handleChangeChecboxRetencion =
            this.handleChangeChecboxRetencion.bind(this);
        this.handleChangeChecboxRetencionPredeterminado =
            this.handleChangeChecboxRetencionPredeterminado.bind(this);
        this.requestSearch = this.requestSearch.bind(this);
        this.cancelar = this.cancelar.bind(this);
    }

    componentDidMount() {
        this.setState({
            row:this.props.dataSAT,
            rowFilter: this.props.dataSAT
        })
    }

    componentDidUpdate(prevProps: Readonly<P>, prevState: Readonly<S>, snapshot: SS) {
        if (prevProps.catalogo !== this.props.catalogo || this.props.dataSAT.length !==  prevProps.dataSAT.length){
            this.setState({
                row:this.props.dataSAT,
                rowFilter: this.props.dataSAT
            })
        }
    }

    handleChange(event) {
        this.setState({
            [event.target.name]: event.target.value,
        });
    }

    handleChangeChecboxTraslado(event, index) {
        var array = this.state.impuestosSeleccionadosTraslado;
        if (event.target.checked) {
            array.push(this.state.impuestos[index]);
            this.setState({
                impuestosSeleccionadosTraslado: array,
            });
        } else {
            array.splice(
                 array.findIndex((a) => a.m_nIdImpuesto === this.state.impuestos[index].m_nIdImpuesto), 1
            );
            this.setState({
                impuestosSeleccionadosTraslado: array,
            });
        }
    }

    handleChangeChecboxTrasladoPredeterminado(event, index) {
        this.setState({
            predeterminadoSeleccionadosTraslado: event.target.checked
                ? this.state.impuestos[index]
                : {},
        });
    }

    handleChangeChecboxRetencionPredeterminado(event, index) {
        this.setState({
            predeterminadoSeleccionadosRetencion: event.target.checked ? this.state.impuestosRetencion[index] : {},
        });
    }

    handleChangeChecboxRetencion(event, index) {
        var array = this.state.impuestosSeleccionadosRetencion;
        if (event.target.checked) {
            array.push(this.state.impuestosRetencion[index]);
            this.setState({
                impuestosSeleccionadosRetencion: array,
            });
        } else {
            array.splice(
                array.findIndex((a) => a.m_nIdImpuesto === this.state.impuestosRetencion[index].m_nIdImpuesto), 1);
            this.setState({
                impuestosSeleccionadosRetencion: array,
            });
        }
    }

    onSubmit(event) {
        event.preventDefault();
        this.props.onSubmit(this.state);
    }

    requestSearch = (searchValue) => {
        this.setState({
            searchText:searchValue
        })
    };

    componentWillReceiveProps(props) {
        this.setState({
            row:this.props.dataSAT,
            rowFilter: this.props.dataSAT
        })
    }

    cancelar = () => {
        if(this.props.catalogo === "c_ClaveProdServCP"){
            this.props.cancel(1)
        }
        else if (this.props.catalogo === "c_ClaveUnidad"){
            this.props.cancel(2)
        }
        else if (this.props.catalogo === "c_MaterialPeligroso"){
            this.props.cancel(3)
        }
        else if (this.props.catalogo === "c_TipoEmbalaje"){
            this.props.cancel(4)
        }
        else if(this.props.catalogo === "c_FraccionArancelaria"){
            this.props.cancel(5)
        }
        else if(this.props.catalogo === "c_FormaFarmaceutica"){
            this.props.cancel(6)
        }
        else if(this.props.catalogo === "c_CondicionesEspeciales"){
            this.props.cancel(8)
        }
        else if(this.props.catalogo === "c_SectorCOFEPRIS"){
            this.props.cancel(9)
        }
        this.props.closeDialog()
    }

    render() {
        return (
            <div>
                <div
                    className="row"
                    style={{ height: "400px", width: "100%" }}>
                    <div style={{display:"flex",justifyContent:"space-between"}}>
                        <TextField
                            variant="standard"
                            value={this.state.searchText}
                            onChange={(e) => this.requestSearch(e.target.value)}
                            placeholder
                            InputProps={{
                                endAdornment: <SearchIcon style={{
                                    color: "#F9A03E",
                                    fontSize: 32,
                                    paddingInlineEnd: 0,
                                    paddingRight: 0,
                                    paddingBlockEnd: 0,
                                    paddingLeft: 0,
                                    paddingBlock: 0,
                                    cursor:"pointer"
                                }} onClick={() => this.props.setBusqueda(this.state.searchText)}/>,
                            }}
                            style={{width:'60ch'}}
                        />
                        <div>
                        <Button
                            variant="contained"
                            onClick={()=> this.cancelar()}
                            color="primary"
                            style={{marginRight:"10px"}}>
                            Cancelar
                        </Button>
                        <Button
                            variant="contained"
                            onClick={this.props.closeDialog}
                            color="primary">
                            Seleccionar
                        </Button>
                        </div>
                    </div>
                    <div className="complementoSAT" style={{height:"300px", padding:"5px"}}>
                        <DataGrid
                            localeText={dataGridLocaleText}
                            rows={this.props.dataSAT}
                            columns={this.state.columnsUnidades}
                            paginationMode="server"
                            autoPageSize
                            onPaginationModelChange={(newPaginationModel)=>{
                                this.props.setPagina(newPaginationModel)
                            }}
                            pagination
                            density="compact"
                            rowCount={100000}
                            getRowId={ ((row)=> row.m_sClaveSAT)}
                            onRowSelectionModelChange={(newRowSelectionModel,e) => {
                                this.props.selectClase(this.props.dataSAT.find(i=>i.m_sClaveSAT==newRowSelectionModel[0]))
                            }}
                        />
                    </div>
                </div>
            </div>
        );
    }
}

ClavesCFDI.propTypes = {};

export default ClavesCFDI;
