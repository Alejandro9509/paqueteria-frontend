import React, {Component} from "react";
import Autocomplete from "@material-ui/lab/Autocomplete";
import TextField from "@material-ui/core/TextField";
import InputAdornment from "@material-ui/core/InputAdornment";
import IconButton from "@material-ui/core/IconButton";
import axios from "axios";
import PageviewIcon from "@material-ui/icons/Pageview";
import {Button, Dialog, DialogActions, DialogContent} from "@material-ui/core";
import TableCiudades from "./TableCiudades";
import TableCiudadesViajes from "./TableCiudades";
import FormControl from "@material-ui/core/FormControl";
import InputLabel from "@material-ui/core/InputLabel";
import Select from "@material-ui/core/Select";
import TableUnidadViajes from "./TablaUnidadViajes";
import {DataGrid} from "@material-ui/data-grid";
import { dataGridLocaleText } from "../../Constants";
import Historial from "./Historial";

const headers = {
    'Content-Type': 'application/json',
    //    'access-control-allow-origin': '*'
}
let timer;

class AgregarViaje extends Component {


    constructor(props) {
        super(props);

        const today = new Date();

        this.state = {
            origen: 0,
            destino: 0,
            idRuta: 0,
            dataCiudad: [],
            dataRutas: [],
            dataCodigoPostal: [],
            dataSucursal: [],
            dataEstatusViaje: [],
            dataInformes: [],
            showPopUp: false,
            showDialog: false,
            identificadorModal: "",
            tipoModal: 0,
            idSucursalAgregar: localStorage.getItem("Sucursal"),
            folioViaje: "",
            viajeCliente: "",
            fechaHoraCreacion: today.getDate() + "/" + (today.getMonth() + 1) + "/" + today.getFullYear() + "T" + today.getHours() + ":" + today.getMinutes(),
            fechaHoraRegistro:"",
            candadoOficial: "",
            identificadorViaje: "",
            estatusListado: 0,
            placasDolly: "",
            placasRemolque1: "",
            placasRemolque2: "",
            height: window.innerHeight
        }

        this.getAllCiudades = this.getAllCiudades.bind(this);
        this.getAllRutas = this.getAllRutas.bind(this);
        this.getAllCodigosPostales = this.getAllCodigosPostales.bind(this);
        this.getAllSucursales = this.getAllSucursales.bind(this);
        this.getAllEstatusViaje = this.getAllEstatusViaje.bind(this);
        this.getAllUnidades = this.getAllUnidades.bind(this);
        this.handleSelectCP = this.handleSelectCP.bind(this);
        this.handleChange = this.handleChange.bind(this);
        this.getInformesByFiltro = this.getInformesByFiltro.bind(this);
        this.handleRutaFiltro = this.handleRutaFiltro.bind(this);
        this.handleRemolqueUnoFiltro = this.handleRemolqueUnoFiltro.bind(this);
        this.handleRemolqueDosFiltro = this.handleRemolqueDosFiltro.bind(this);
        this.handleOrigenFiltro = this.handleOrigenFiltro.bind(this);
        this.handleDestinoFiltro = this.handleDestinoFiltro.bind(this);
        this.handleDollyFiltro = this.handleDollyFiltro.bind(this);
    }

    componentWillMount() {
        this.getAllCiudades()
        this.getAllRutas()
        this.getAllCodigosPostales()
        this.getAllSucursales()
        this.getAllEstatusViaje();
        this.getAllUnidades();
    }

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

    getAllEstatusViaje() {
        const url = `${process.env.REACT_APP_API_URL_LOCAL}/SisEstatus/getListadoViajes`;
        axios.get(url, { headers }).then((respuesta) => {
            this.setState({dataEstatusViaje: respuesta.data})
        });
    }

    getAllUnidades() {
        const url = `${process.env.REACT_APP_API_URL}/Unidades/GetListado`;
        axios.get(url, { headers }).then((respuesta) => {
            this.setState({dataUnidades: respuesta.data})
        });
    }

    getInformesByFiltro (nIdCiudadOrigen, nIdCiudadDestino, nIdRemolque1, nIdRemolque2, sPlacasRemolque1, sPlacasRemolque2, sPlacasDolly) {
        const url = `${process.env.REACT_APP_API_URL}/Informes/GetByFiltro` + "/" +
            nIdCiudadOrigen + "/" + nIdCiudadDestino + "/" + nIdRemolque1 + "/" + nIdRemolque2 + "/" + sPlacasRemolque1 +
            + "/" + sPlacasRemolque2 + "/" + sPlacasDolly;
        axios.get(url, { headers }).then((respuesta) => {
            this.setState({dataInformes: respuesta.data})
        });
    }

    handleChange = (event) => {
        event.preventDefault();
        this.setState({
            [event.target.id]: event.target.value,
        });
    };

    handleRutaFiltro = async (event) => {
        event.preventDefault();
        this.setState({idRuta: event.target.value});

        this.getInformesByFiltro(event.target.value.m_nIdRuta, this.state.origen.m_nIdCiudad, this.state.destino.m_nIdCiudad,
            this.state.IdRemolque1.m_nIdUnidad, this.state.IdRemolque2.m_nIdUnidad, this.state.IdDolly.m_nIdUnidad)
    }

    handleOrigenFiltro = async (event) => {
        event.preventDefault();
        this.setState({origen: event.target.value});

        this.getInformesByFiltro(this.state.idRuta.m_nIdRuta, event.target.value.m_nIdCiudad, this.state.destino.m_nIdCiudad,
            this.state.IdRemolque1.m_nIdUnidad, this.state.IdRemolque2.m_nIdUnidad, this.state.IdDolly.m_nIdUnidad)
    }

    handleDestinoFiltro = async (event) => {
        event.preventDefault();
        this.setState({destino: event.target.value});

        this.getInformesByFiltro(this.state.idRuta.m_nIdRuta, this.state.origen.m_nIdCiudad, event.target.value.m_nIdCiudad,
            this.state.IdRemolque1.m_nIdUnidad, this.state.IdRemolque2.m_nIdUnidad, this.state.IdDolly.m_nIdUnidad)
    }

    handleRemolqueUnoFiltro = async (event) => {
        event.preventDefault();
        let newValue = event.target.value
        this.setState({IdRemolque1: newValue, placasRemolque1: newValue.m_sPlacas})

        this.getInformesByFiltro(this.state.idRuta.m_nIdRuta, this.state.origen.m_nIdCiudad, this.state.destino.m_nIdCiudad,
            newValue.m_nIdUnidad, this.state.IdRemolque2.m_nIdUnidad, this.state.IdDolly.m_nIdUnidad)
    }

    handleRemolqueDosFiltro = async (event) => {
        event.preventDefault();
        let newValue = event.target.value
        this.setState({IdRemolque2: newValue, placasRemolque2: newValue.m_sPlacas})

        this.getInformesByFiltro(this.state.idRuta.m_nIdRuta, this.state.origen.m_nIdCiudad, this.state.destino.m_nIdCiudad,
            this.state.IdRemolque1.m_nIdUnidad, newValue.m_nIdUnidad, this.state.IdDolly.m_nIdUnidad)
    }

    handleDollyFiltro = async (event) => {
        event.preventDefault();
        let newValue = event.target.value
        this.setState({IdDolly: newValue, placasDolly: newValue.m_sPlacas})

        this.getInformesByFiltro(this.state.idRuta.m_nIdRuta, this.state.origen.m_nIdCiudad, this.state.destino.m_nIdCiudad,
            this.state.IdRemolque1.m_nIdUnidad, this.state.IdRemolque2.m_nIdUnidad, newValue.m_nIdUnidad)
    }

    render() {

        const columns = [
            {
                headerName: "Folio/Serie",
                field: "m_sFolioInforme",
                width: 125,
            },
            {
                headerName: "Ruta",
                field: "m_sRuta",
                width: 150,
            },
            {
                headerName: "Origen",
                field: "m_sCiudadOrigen",
                width: 125,
            },
            {
                headerName: "Destino",
                field: "m_sCiudadDestino",
                width: 125,
            },
            {
                headerName: "Operador",
                field: "m_sNombreCompleto",
                width: 250,
            },
            {
                Name: "Unidad",
                accessor: "m_sCodigoUnidad",
            },
            {
                headerName: "Remolque",
                field: "m_sRemolque1",
                width: 125,
            }
        ];

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
                        {this.state.tipoModal === 4 && (
                            <div className="row" style={{ backgroundColor: "#FFFFFF" }}>
                                <div align="right">
                                    <button
                                        onClick={() => {
                                            this.props.history.push("/Unidades");
                                        }}
                                        className="btn btn-primary primary-btn"
                                    >
                                        Agregar
                                    </button>
                                </div>

                                {this.state.dataUnidades.length !== 0 ? (
                                    <TableUnidadViajes
                                        select={
                                            this.state[this.state.identificadorModal] &&
                                            this.state[this.state.identificadorModal].m_nIdUnidad
                                        }
                                        data={this.state.dataUnidades}
                                        identificadorModal={this.state.identificadorModal}
                                        func={() => this.handleSelectCP}
                                    />
                                ) : (
                                    <div>No se encontró ningún registro</div>
                                )}
                                <DialogActions style={{ justifyContent: "left" }}>
                                    <button
                                        onClick={() => this.setState({openDialog: false })}
                                        className="btn btn-secondary secondary-btn"
                                    >
                                        Cerrar
                                    </button>
                                    <button
                                        onClick={() => this.setState({ openDialog: false })}
                                        className="btn btn-primary primary-btn"
                                    >
                                        Aceptar
                                    </button>
                                </DialogActions>
                            </div>
                        )}
                        </DialogContent>
                </Dialog>
                <Dialog
                    fullWidth={true}
                    maxWidth={"md"}
                    open={this.state.openHistoryDialog}
                    onClose={() => this.setState({openHistoryDialog: false })}>
                    <Historial/>
                </Dialog>
                <div className="widget-wrap">
                    <div className="widget-content">

                        <div className="row" >
                            <form className="j-forms">
                                <div className={"row"} style={{ display: "flex" }}>
                                    {/* Sucursal */}
                                    <div className="col-sm-6 col-md-2 col-lg-2 unit">
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
                                    {/* Folio viaje */}
                                    <div className="col-sm-6 col-md-2 col-lg-2 unit">
                                        <div className="input">
                                            <TextField variant="outlined" margin="dense"
                                                       onChange={this.handleChange}
                                                       className="form-control"
                                                       type="text"
                                                       label="Folio Viaje"
                                                       value={this.state.folioViaje}
                                                       id="folioViaje"

                                                       disabled
                                            />
                                        </div>
                                    </div>
                                    {/* Num Viaje */}
                                    <div className="col-sm-6 col-md-2 col-lg-2 unit">
                                        <div className="input">
                                            <TextField variant="outlined" margin="dense"
                                                       onChange={this.handleChange}
                                                       className="form-control"
                                                       type="text"
                                                       label="Núm. Viaje Cliente"
                                                       value={this.state.viajeCliente}
                                                       id="numeroViajeCliente"

                                            />
                                        </div>
                                    </div>
                                    {/* Fecha */}
                                    <div className="col-sm-6 col-md-2 col-lg-2 unit">

                                    <div className="input">
                                                                <TextField variant="outlined" margin="dense"
                                                                          // onChange={handleChange}
                                                                           required
                                                                           label="Fecha / Hora de Registro"
                                                                           InputLabelProps={{
                                                                               shrink: true,
                                                                           }}
                                                                           value={this.state.fechaHoraRegistro}
                                                                           className="form-control"
                                                                           id="fechaHoraRegistro"
                                                                           type="datetime-local"
                                                                           //disabled={state.agregar === "Consultar" || state.agregar === "Modificar"}

                                                                />
                                                            </div>
                                                            </div>
                                    {/* Estatus viaje */}
                                    <div className="col-sm-6 col-md-2 col-lg-2 unit">
                                        <label className="input select">
                                            <FormControl fullWidth variant="outlined" margin="dense">
                                                <InputLabel id="idEstatusAgregarLabel">Estatus Viaje</InputLabel>
                                                <Select
                                                    labelId="idEstatusAgregarLabel"
                                                    className="form-control"
                                                    value={this.state.estatusListado}
                                                    onChange={this.handleChange}
                                                    id="idEstatusAgregar"
                                                    label="Estatus Viaje"
                                                >
                                                    {this.state.dataEstatusViaje.map((estatus) => (
                                                        <option
                                                            key={estatus.m_nIdEstatusViaje}
                                                            value={estatus.m_nIdEstatusViaje}
                                                        >
                                                            {estatus.m_sDescripcion}
                                                        </option>
                                                    ))}
                                                </Select>
                                            </FormControl>
                                        </label>
                                    </div>
                                    {/* Candado oficial */}
                                    <div className="col-sm-6 col-md-2 col-lg-2 unit">
                                        <div className="input">
                                            <TextField variant="outlined" margin="dense"
                                                       onChange={this.handleChange}
                                                       className="form-control"
                                                       type="text"
                                                       label="Candado Oficial"
                                                       value={this.state.candadoOficial}
                                                       id="candadoOficial"
                                            />
                                        </div>
                                    </div>
                                    {/* Identificador */}
                                    <div className="col-sm-6 col-md-2 col-lg-2 unit">
                                        <div className="input">
                                            <TextField variant="outlined" margin="dense"
                                                       onChange={this.handleChange}
                                                       className="form-control"
                                                       type="text"
                                                       label="Identificador"
                                                       value={this.state.identificadorViaje}
                                                       id="identificadorViaje"
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
                                                onChange={this.handleRutaFiltro}
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
                                                onChange={this.handleOrigenFiltro}
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
                                                onChange={this.handleDestinoFiltro}

                                                value={this.state.destino}
                                                //disabled={state.agregar == "Consultar"}
                                                id="destino"
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

                                <div className="widget-header">
                                    <h2> Convoy</h2>
                                </div>

                                <div className="row" style={{ display: "flex" }}>

                                    {/* Remolque 1 */}

                                    <div className="col-sm-12 col-md-6 unit">
                                        <div className="col-sm-12 col-md-6 unit">

                                            <div className="input">

                                                <Autocomplete
                                                    freeSolo
                                                    onChange={this.handleRemolqueUnoFiltro}
                                                    value={this.state.IdRemolque1}
                                                    //disabled={state.agregar == "Consultar"}
                                                    id="IdRemolque1"
                                                    disableClearable
                                                    forcePopupIcon={false}
                                                    options={this.state.dataUnidades && this.state.dataUnidades.filter((g) => g.m_sTipoUnidad !== 'Dolly')}
                                                    getOptionLabel={(option) =>
                                                        option.m_sDescripcion
                                                    }
                                                    style={{
                                                        transform: "translate(14px, 10px) scale(1) !important"
                                                    }}
                                                    renderInput={(params) => (
                                                        <div>
                                                            <TextField
                                                                label="Remolque 1"
                                                                margin="dense"
                                                                variant="outlined"
                                                                {...params}
                                                                InputProps={{
                                                                    ...params.InputProps,
                                                                    style: { height: "33px", fontSize: "14px" },
                                                                    type: "search",
                                                                    value: this.state.IdRemolque1,
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
                                                                                            "IdRemolque1",
                                                                                        tipoModal: 4,
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

                                        {/* Placa Int */}
                                        <div className="col-sm-12 col-md-3 unit">
                                            <div className="input">
                                                <TextField variant="outlined" margin="dense"
                                                           onChange={this.handleChange}
                                                           className="form-control"
                                                           type="text"
                                                           label="Placas Int"
                                                           value={this.state.placasRemolque1}
                                                           id="PlacasRemolque2"
                                                />
                                            </div>
                                        </div>

                                        {/* Estatus */}
                                        <div className="col-sm-12 col-md-3 unit">
                                            <div className="input">
                                                <TextField variant="outlined" margin="dense"
                                                           onChange={this.handleChange}
                                                           className="form-control"
                                                           type="text"
                                                           label="Estatus"
                                                           value={this.state.estatusRemolque2}
                                                           id="EstatusRemolque2"
                                                />
                                            </div>
                                        </div>

                                    </div>

                                    {/* Remolque 2 */}

                                    <div className="col-sm-12 col-md-6 unit">

                                        <div className="col-sm-12 col-md-6 unit">

                                            <div className="input">
                                                <Autocomplete
                                                    freeSolo
                                                    onChange={this.handleRemolqueDosFiltro}
                                                    value={this.state.IdRemolque2}
                                                    //disabled={state.agregar == "Consultar"}
                                                    id="IdRemolque2"
                                                    disableClearable
                                                    forcePopupIcon={false}
                                                    options={this.state.dataUnidades && this.state.dataUnidades.filter((g) => g.m_sTipoUnidad !== 'Dolly')}
                                                    getOptionLabel={(option) =>
                                                        option.m_sDescripcion
                                                    }
                                                    style={{
                                                        transform: "translate(14px, 10px) scale(1) !important"
                                                    }}
                                                    renderInput={(params) => (
                                                        <div>
                                                            <TextField
                                                                label="Remolque 2"
                                                                margin="dense"
                                                                variant="outlined"
                                                                {...params}
                                                                InputProps={{
                                                                    ...params.InputProps,
                                                                    style: { height: "33px", fontSize: "14px" },
                                                                    type: "search",
                                                                    value: this.state.IdRemolque2,
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
                                                                                            "IdRemolque2",
                                                                                        tipoModal: 4,
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

                                        {/* Placa Int */}
                                        <div className="col-sm-12 col-md-3 unit">
                                            <div className="input">
                                                <TextField variant="outlined" margin="dense"
                                                           onChange={this.handleChange}
                                                           className="form-control"
                                                           type="text"
                                                           label="Placas Int"
                                                           value={this.state.placasRemolque2}
                                                           id="PlacasRemolque2"
                                                />
                                            </div>
                                        </div>

                                        {/* Estatus */}
                                        <div className="col-sm-12 col-md-3 unit">
                                            <div className="input">
                                                <TextField variant="outlined" margin="dense"
                                                           onChange={this.handleChange}
                                                           className="form-control"
                                                           type="text"
                                                           label="Estatus"
                                                           value={this.state.estatusRemolque2}
                                                           id="EstatusRemolque2"
                                                />
                                            </div>
                                        </div>

                                    </div>

                                </div>

                                <div className="row" style={{ display: "flex" }}>
                                    {/* Dolly  */}

                                    <div className="col-sm-12 col-md-6 unit">

                                        <div className="col-sm-12 col-md-6 unit">

                                            <div className="input">
                                                <Autocomplete
                                                    freeSolo
                                                    onChange={this.handleDollyFiltro}
                                                    value={this.state.IdDolly}
                                                    //disabled={state.agregar == "Consultar"}
                                                    id="IdDolly"
                                                    disableClearable
                                                    forcePopupIcon={false}
                                                    options={this.state.dataUnidades && this.state.dataUnidades.filter((g) => g.m_sTipoUnidad === 'Dolly')}
                                                    getOptionLabel={(option) =>
                                                        option.m_sDescripcion
                                                    }
                                                    style={{
                                                        transform: "translate(14px, 10px) scale(1) !important"
                                                    }}
                                                    renderInput={(params) => (
                                                        <div>
                                                            <TextField
                                                                label="Dolly"
                                                                margin="dense"
                                                                variant="outlined"
                                                                {...params}
                                                                InputProps={{
                                                                    ...params.InputProps,
                                                                    style: { height: "33px", fontSize: "14px" },
                                                                    type: "search",
                                                                    value: this.state.IdDolly,
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
                                                                                            "IdDolly",
                                                                                        tipoModal: 4,
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

                                        {/* Placa Int */}
                                        <div className="col-sm-12 col-md-3 unit">
                                            <div className="input">
                                                <TextField variant="outlined" margin="dense"
                                                           onChange={this.handleChange}
                                                           className="form-control"
                                                           type="text"
                                                           label="Placas Int"
                                                           value={this.state.placasDolly}
                                                           id="PlacasDolly"
                                                />
                                            </div>
                                        </div>


                                    </div>
                                </div>
                            </form>
                        </div>

                    </div>
                </div>

                <div className="row">
                    <div className="col-md-12">
                        <div className="widget-wrap">
                            <div className="widget-header">
                                <h2 color={'#717171'} >Informes para asignación</h2>
                            </div>

                            <div className="row" style={{ height: this.state.height - 750, width: '100%' }}>
                                {this.state.dataInformes.length != 0 ? (
                                    <DataGrid
                                    localeText={dataGridLocaleText}
                                        rows={this.state.dataInformes}
                                        columns={columns}
                                        density="compact"
                                        pageSize={ Math.floor((this.state.height - 310)/30)}
                                        getRowId={(row) => row.m_nIdInforme}
                                        onRowSelected={(row) => {
                                            this.setState({
                                                idInforme: row.data.m_nIdInforme
                                            })
                                        }}
                                    />
                                ) : (
                                    <div>No se encontró ningún registro</div>
                                )}
                                <Button onClick={() => this.setState({openHistoryDialog: true })}>Historial</Button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

        );
    };
}


AgregarViaje.propTypes = {

};

export default AgregarViaje;