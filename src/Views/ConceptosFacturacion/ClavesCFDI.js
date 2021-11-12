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
import { obtenerSAT } from "../../Util/Contexts/ConceptosFacturacionContext";
import SearchIcon from "@material-ui/icons/Search";
class ClavesCFDI extends Component {
    constructor(props) {
        super(props);
        this.state = {
            row:[],
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
            columns: [
                {
                    headerName: "Clave SAT",
                    field: "m_nClaveClase",
                    width: 125,
                },
                {
                    headerName: "Producto o Servicio",
                    field: "m_sClase",
                    flex: 1,
                },
            ],
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
    }

    componentDidMount() {
        if(this.props.isProducto)
        {
            // console.log("Es Producto")
            this.setState({
                row:this.props.dataSAT.filter((SAT) => {
                    if (this.state.claveGrupo != 0) {
                        return SAT.m_nClaveGrupo == this.state.claveGrupo;
                    } else if (this.state.claveDivision != 0) {
                        return SAT.m_nClaveDivision == this.state.claveDivision;
                    } else if (this.state.tipoSAT != "") {
                        return SAT.m_sTipo == this.state.tipoSAT;
                    } else {
                        return SAT;
                    }
                })})
        }
        else
        {
            // console.log("Es unidad")
            this.setState({
                row:this.props.dataSAT
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



    render() {
        const { impuestos, impuestosRetencion } = this.state;
        const  escapeRegExp = (value) =>{
            return value.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, '\\$&');
        }

        const requestSearch = (searchValue) => {
            this.setState({
                searchText:searchValue
            });
            const searchRegex = new RegExp(escapeRegExp(searchValue), 'i');
            const filteredRows = this.state.row.filter((row) => {
                return Object.keys(row).some((field) => {
                    return searchRegex.test(row[field].toString());
                });
            });

            this.setState({
                row:filteredRows
            })
        };


        return (
            <div>
                <div
                    className="row"
                    style={{ height: this.state.height - 250, width: "100%" }}
                >
                    <div style={{display:"flex",justifyContent:"space-between"}}>
                        <TextField
                            variant="standard"
                            value
                            onChange
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
                    {this.props.dataSAT.length != 0 ? (
                        <DataGrid
                            localeText={dataGridLocaleText}
                            rows={this.state.row}
                            columns={this.props.isProducto? this.state.columns: this.state.columnsUnidades}
                            componentsProps={{
                                toolbar:{
                                    value:this.searchText,
                                    onChange:(event)=> requestSearch(event.target.value)
                                }

                            }}
                            density="compact"
                            pageSize={Math.floor((this.state.height - 310) / 30)}
                            getRowId={this.props.isProducto ?((row) => row.m_nClaveClase ) : ((row)=> row.m_sClaveSAT)}//aqui esta el problema
                            onRowSelected={(row) => {
                                this.props.selectClase(row);
                            }}
                        />
                    ) : (
                        <div>No se encontró ningún registro</div>
                    )}
                </div>
            </div>
        );
    }
}

ClavesCFDI.propTypes = {};

export default ClavesCFDI;
