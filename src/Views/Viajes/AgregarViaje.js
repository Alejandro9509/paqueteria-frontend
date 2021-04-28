import React, {Component} from "react";
import Autocomplete from "@material-ui/lab/Autocomplete";
import TextField from "@material-ui/core/TextField";
import InputAdornment from "@material-ui/core/InputAdornment";
import IconButton from "@material-ui/core/IconButton";
import axios from "axios";
import PageviewIcon from "@material-ui/icons/Pageview";
import {Dialog, DialogActions, DialogContent} from "@material-ui/core";
import TableCiudades from "./TableCiudades";
import TableCiudadesViajes from "./TableCiudades";
import FormControl from "@material-ui/core/FormControl";
import InputLabel from "@material-ui/core/InputLabel";
import Select from "@material-ui/core/Select";

const headers = {
    'Content-Type': 'application/json',
    //    'access-control-allow-origin': '*'
}
let timer;

class AgregarViaje extends Component {

    constructor(props) {
        super(props);

        this.state = {
            origen: 0,
            destino: 0,
            idRuta: 0,
            dataCiudad: [],
            dataRutas: [],
            dataCodigoPostal: [],
            dataSucursal: [],
            showPopUp: false,
            showDialog: false,
            identificadorModal: "",
            tipoModal: 0,
            idSucursalAgregar: localStorage.getItem("Sucursal"),
            folioViaje: ""
        }

        this.getAllCiudades = this.getAllCiudades.bind(this);
        this.getAllRutas = this.getAllRutas.bind(this);
        this.getAllCodigosPostales = this.getAllCodigosPostales.bind(this);
        this.handleSelectCP = this.handleSelectCP.bind(this);
        this.handleChange = this.handleChange.bind(this);
    }

    componentWillMount() {
        this.getAllCiudades()
        this.getAllRutas()
        this.getAllCodigosPostales()
        this.getAllSucursales()
    }

    handleChange = (event) => {
        this.setState({
            [event.target.id]: event.target.value,
        })
    };

    handleSelectCP(id, dobleClick, e) {
        clearTimeout(timer);
        if (e.detail === 1) {
            timer = setTimeout(() => {
                this.setState({
                    [this.state.identificadorModal]: id,
                    openDialog: true
                })
            }, 200)
        } else if (e.detail === 2) {
            this.setState({
                [this.state.identificadorModal]: id,
                openDialog: false
            })
        }
    }

    getAllSucursales() {
        const url = `${process.env.REACT_APP_API_URL}/Sucursales/GetListado`;
        axios.get(url, { headers }).then((respuesta) => {
            this.setState({dataSucursal: respuesta.data})
        });
    }

    getAllCiudades() {
        const url = `${process.env.REACT_APP_API_URL}/Ciudades/GetListado`;
        axios.get(url, { headers }).then((respuesta) => {
            this.setState({dataCiudad: respuesta.data})
        });
    }

    getAllRutas() {
        const url = `${process.env.REACT_APP_API_URL}/Rutas/GetListado`;
        axios.get(url, { headers }).then((respuesta) => {
            this.setState({dataRuta: respuesta.data})
        });
    }

    getAllCodigosPostales() {
        const url = `${process.env.REACT_APP_API_URL}/CodigoPostal/GetListado`;
        axios.get(url, { headers }).then((respuesta) => {
            this.setState({dataCodigoPostal: respuesta.data})
        });
    }

    render() {

        return (

            <div>
                <Dialog open={this.state.openDialog} onClose={() => this.setState({openDialog: false })}>
                    <DialogContent>
                        {this.state.tipoModal === 1 &&
                        <div className="row" style={{ backgroundColor: '#FFFFFF' }}>
                            <div align="right">
                                <button onClick={() => { this.props.history.push("/Ciudades") }} className="btn btn-primary primary-btn">Agregar</button>
                            </div>

                            {this.state.dataCiudad.length !== 0 ? <TableCiudadesViajes object={this.state}
                                                                                select={this.state[this.state.identificadorModal]
                                                                                && this.state[this.state.identificadorModal].m_nIdCiudad}
                                                                                 data={this.state.dataCiudad} identificadorModal={this.state.identificadorModal}
                                                                                       func={() => this.handleSelectCP} />
                                                                                : <div>No se encontró ningún registro</div>}


                            <DialogActions style={{ justifyContent: "left" }}>

                                <button onClick={() => this.setState({ openDialog: false })} className="btn btn-primary primary-btn">Aceptar</button>
                                <button onClick={() => this.setState({ openDialog: false })} className="btn btn-secondary secondary-btn">Cerrar</button>

                            </DialogActions>
                        </div>
                        }
                        </DialogContent>

                </Dialog>

                <div className="widget-content">
                    <div className="row" style={{ paddingLeft: "8px" }}>
                        <form className="j-forms">
                            <div className={"row"} style={{ display: "flex" }}>
                                <div className="col-sm-6 col-md-2 col-lg-2 unit">
                                    {" "}
                                    <label className="input select">
                                        <FormControl fullWidth variant="outlined" margin="dense">
                                            <InputLabel id="idSucursalAgregarLabel">Sucursal</InputLabel>
                                            <Select
                                                labelId="idSucursalAgregarLabel"
                                                className="form-control"
                                                required
                                                value={this.state.idSucursalAgregar}
                                                onChange={this.handleChange}
                                                id="idSucursalAgregar"
                                                label="Sucursal"
                                                disabled="disabled"
                                            >
                                                {this.state.dataSucursal.map((sucursal) => (
                                                    <option
                                                        key={sucursal.m_nIdSucursal}
                                                        value={sucursal.m_nIdSucursal}
                                                    >
                                                        {sucursal.m_sSucursal}
                                                    </option>
                                                ))}
                                            </Select>
                                        </FormControl>
                                    </label>
                                </div>
                                <div className="col-sm-6 col-md-2 col-lg-2 unit">
                                    <div className="input">
                                        <TextField variant="outlined" margin="dense"
                                                   // onChange={handleChange}
                                                   className="form-control"
                                                   type="text"
                                                   label="Folio Viaje"
                                                   value={this.state.folioViaje}
                                                   id="folioViaje"
                                                   readOnly
                                        />
                                    </div>
                                </div>
                            </div>
                            <div className="row" style={{ display: "flex" }}>
                                {/* Ruta */}
                                <div className="col-sm-12 col-md-12 unit">
                                    <div className="input">
                                        <Autocomplete
                                            freeSolo
                                            onChange={(event, newValue) =>
                                                this.setState({idRuta: newValue})
                                            }
                                            value={this.state.idRuta}
                                            //disabled={state.agregar == "Consultar"}
                                            id="ruta"
                                            disableClearable
                                            forcePopupIcon={false}
                                            options={this.state.dataRuta}
                                            getOptionLabel={(option) =>
                                                option.m_sDescripcion
                                            }
                                            style={{
                                                transform: "translate(14px, 10px) scale(1) !important"
                                            }}
                                            renderInput={(params) => (
                                                <div>
                                                    <TextField
                                                        label="Ruta"
                                                        margin="dense"
                                                        variant="outlined"
                                                        {...params}
                                                        InputProps={{
                                                            ...params.InputProps,
                                                            style: { height: "33px", fontSize: "14px" },
                                                            type: "search",
                                                            //value: this.state.rutaSeleccionada,
                                                            //disabled: state.agregar == "Consultar",
                                                            disableUnderline: true,
                                                            endAdornment: (
                                                                <InputAdornment position="end">
                                                                    <IconButton
                                                                        padding="0px"
                                                                        style={{
                                                                            paddingRight: "0px",
                                                                        }}
                                                                        //disabled={state.agregar == "Consultar"}
                                                                        onClick={() => {
                                                                            this.setState({
                                                                                identificadorModal:
                                                                                    "idRuta",
                                                                                tipoModal: 1,
                                                                                openDialog: true
                                                                            })
                                                                        }}
                                                                    >
                                                                        <PageviewIcon
                                                                            style={{
                                                                                color: "#F9A03E",
                                                                                fontSize: 32,
                                                                                paddingInlineEnd: 0,
                                                                                paddingRight: 0,
                                                                                paddingBlockEnd: 0,
                                                                                paddingLeft: 0,
                                                                                paddingBlock: 0,
                                                                            }}
                                                                        />
                                                                    </IconButton>
                                                                </InputAdornment>
                                                            ),
                                                        }}
                                                    />
                                                </div>
                                            )}
                                        />
                                    </div>
                                </div>
                                {/* Origen */}
                                <div className="col-sm-12 col-md-12 unit">
                                    <div className="input">
                                        <Autocomplete
                                            freeSolo
                                            onChange={(event, newValue) =>
                                                this.setState({origen: newValue})
                                            }
                                            value={this.state.origen}
                                            //disabled={state.agregar == "Consultar"}
                                            id="origenRemitente"
                                            disableClearable
                                            forcePopupIcon={false}
                                            options={this.state.dataCiudad}
                                            getOptionLabel={(option) =>
                                                option.m_sCiudad
                                            }
                                            style={{
                                                transform: "translate(14px, 10px) scale(1) !important"
                                            }}
                                            renderInput={(params) => (
                                                <div>
                                                    <TextField
                                                        label="Origen"
                                                        margin="dense"
                                                        variant="outlined"
                                                        {...params}
                                                        InputProps={{
                                                            ...params.InputProps,
                                                            style: { height: "33px", fontSize: "14px" },
                                                            type: "search",
                                                            value: this.state.origen,
                                                            //disabled: state.agregar == "Consultar",
                                                            disableUnderline: true,
                                                            endAdornment: (
                                                                <InputAdornment position="end">
                                                                    <IconButton
                                                                        padding="0px"
                                                                        style={{
                                                                            paddingRight: "0px",
                                                                        }}
                                                                        //disabled={state.agregar == "Consultar"}
                                                                        onClick={() => {
                                                                            this.setState({
                                                                                identificadorModal:
                                                                                    "origen",
                                                                                tipoModal: 1,
                                                                                openDialog: true})
                                                                        }}
                                                                    >
                                                                        <PageviewIcon
                                                                            style={{
                                                                                color: "#F9A03E",
                                                                                fontSize: 32,
                                                                                paddingInlineEnd: 0,
                                                                                paddingRight: 0,
                                                                                paddingBlockEnd: 0,
                                                                                paddingLeft: 0,
                                                                                paddingBlock: 0,
                                                                            }}
                                                                        />
                                                                    </IconButton>
                                                                </InputAdornment>
                                                            ),
                                                        }}
                                                    />
                                                </div>
                                            )}
                                        />
                                    </div>
                                </div>
                                {/* Destino */}
                                <div className="col-sm-12 col-md-12 unit">
                                    <div className="input">
                                        <Autocomplete
                                            freeSolo
                                            onChange={(event, newValue) =>
                                                this.setState({destino: newValue})
                                            }
                                            value={this.state.destino}
                                            //disabled={state.agregar == "Consultar"}
                                            id="origenRemitente"
                                            disableClearable
                                            forcePopupIcon={false}
                                            options={this.state.dataCiudad}
                                            getOptionLabel={(option) =>
                                                option.m_sCiudad
                                            }
                                            style={{
                                                transform: "translate(14px, 10px) scale(1) !important"
                                            }}
                                            renderInput={(params) => (
                                                <div>
                                                    <TextField
                                                        label="Destino"
                                                        margin="dense"
                                                        variant="outlined"
                                                        {...params}
                                                        InputProps={{
                                                            ...params.InputProps,
                                                            style: { height: "33px", fontSize: "14px" },
                                                            type: "search",
                                                            value: this.state.destino,
                                                            //disabled: state.agregar == "Consultar",
                                                            disableUnderline: true,
                                                            endAdornment: (
                                                                <InputAdornment position="end">
                                                                    <IconButton
                                                                        padding="0px"
                                                                        style={{
                                                                            paddingRight: "0px",
                                                                        }}
                                                                        //disabled={state.agregar == "Consultar"}
                                                                        onClick={() => {
                                                                            this.setState({
                                                                                identificadorModal:
                                                                                    "destino",
                                                                                tipoModal: 1,
                                                                                openDialog: true
                                                                            })
                                                                        }}
                                                                    >
                                                                        <PageviewIcon
                                                                            style={{
                                                                                color: "#F9A03E",
                                                                                fontSize: 32,
                                                                                paddingInlineEnd: 0,
                                                                                paddingRight: 0,
                                                                                paddingBlockEnd: 0,
                                                                                paddingLeft: 0,
                                                                                paddingBlock: 0,
                                                                            }}
                                                                        />
                                                                    </IconButton>
                                                                </InputAdornment>
                                                            ),
                                                        }}
                                                    />
                                                </div>
                                            )}
                                        />
                                    </div>
                                </div>

                            </div>
                        </form>
                    </div>

                </div>

            </div>

        );
    };
}


AgregarViaje.propTypes = {

};

export default AgregarViaje;