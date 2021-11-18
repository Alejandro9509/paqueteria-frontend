import React, { Component } from "react";
import PropTypes from "prop-types";
import axios from "axios";
import {
    FormControl,
    MenuItem,
    InputLabel,
    ListItem,
    TextField,
    Select,
    Button,
    IconButton,
} from "@material-ui/core";
import { DataGrid } from "@material-ui/data-grid";
import { dataGridLocaleText } from "../../Constants";
import SearchIcon from "@material-ui/icons/Search";
class ClavesCFDI extends Component {
    constructor(props) {
        super(props);
        this.state = {
            row:[],
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
    }

    componentDidMount() {

            this.setState({
                row:this.props.dataSAT,
                rowFilter: this.props.dataSAT
            })

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
                array.findIndex(
                    (a) => a.m_nIdImpuesto === this.state.impuestos[index].m_nIdImpuesto
                ),
                1
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
            predeterminadoSeleccionadosRetencion: event.target.checked
                ? this.state.impuestosRetencion[index]
                : {},
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
                array.findIndex(
                    (a) =>
                        a.m_nIdImpuesto ===
                        this.state.impuestosRetencion[index].m_nIdImpuesto
                ),
                1
            );
            this.setState({
                impuestosSeleccionadosRetencion: array,
            });
        }
    }

    onSubmit(event) {
        event.preventDefault();
        console.log("hola");
        this.props.onSubmit(this.state);
    }

    requestSearch = (searchValue) => {
        if(searchValue === "") {
            this.setState({
                rowFilter:this.state.row,
                searchText:searchValue
            })
            return
        }
        const filteredRows = this.state.row.filter((row) => {

                if (row.m_sClaveSAT.includes(searchValue) || row.m_sDescripcion.includes(searchValue)) {
                    return true
                }else {
                    return false
                }
        });

        this.setState({
            rowFilter:filteredRows,
            searchText:searchValue
        })
    };

    render() {

        return (
            <div>
                <div
                    className="row"
                    style={{ height: "400px", width: "100%" }}
                >
                    <div style={{display:"flex",justifyContent:"space-between"}}>
                        <TextField
                            variant="standard"
                            value={this.state.searchText}
                            onChange={(e) => this.requestSearch(e.target.value)}
                            placeholder
                            InputProps={{
                                startAdornment: <SearchIcon fontSize="small" />,
                            }}
                            style={{width:'60ch'}}
                        />
                        <Button
                            variant="contained"
                            onClick={this.props.closeDialog}
                            color="primary"
                        >
                            Seleccionar
                        </Button>
                    </div>
                    <div style={{height:"300px", padding:"5px"}}>
                        {this.props.dataSAT.length != 0 ? (
                            <DataGrid
                                localeText={dataGridLocaleText}
                                rows={this.state.rowFilter}
                                columns={this.state.columnsUnidades}

                                density="compact"
                                getRowId={ ((row)=> row.m_sClaveSAT)}
                                onRowSelected={(row) => {
                                    this.props.selectClase(row);
                                }}
                            />
                        ) : (
                            <div>No se encontró ningún registro</div>
                        )}
                    </div>

                </div>
            </div>
        );
    }
}

ClavesCFDI.propTypes = {};

export default ClavesCFDI;
