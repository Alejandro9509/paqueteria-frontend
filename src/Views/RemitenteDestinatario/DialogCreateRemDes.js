import React, { useState, useEffect } from "react";
import Noty from "noty";
import {
    Dialog,
    DialogActions,
    DialogContent,
    FormControl,
    InputLabel,
    TextField,
    Select,
    Grid, DialogTitle
} from "@material-ui/core";
import DialogTableClientes from "../Clientes/DialogTableClientes";
import {obtenerRemitentesDestinatariosNombre, agregarRemitenteDestinatario} from "../../Util/Contexts/RemitenteDestinatarioContext";
import { makeStyles } from '@material-ui/core/styles';
import Autocomplete from "@material-ui/lab/Autocomplete";
import {obtenerMunicipiosByIdEstado} from "../../Util/Contexts/MunicipiosContext";
import {obtenerZonaOperativaByIdCodigoPostal} from "../../Util/Contexts/ZonaOperativaContext";
import { obtenerCodigoPostalPorCodigo } from "../../Util/Contexts/CodigoPostalContext";
import {obtenerAllEstados} from "../../Util/Contexts/EstadosContext";
import IconButton from "@material-ui/core/IconButton";
import SearchIcon from "@material-ui/icons/Search";

const useStyles = makeStyles({
    root: {
        '& .MuiDataGrid-dataContainer': {
            minHeight: 'auto !important',
        },
        '& .MuiDataGrid-row': {
            minHeight: 'auto !important',
        },
        '& .MuiDataGrid-cell': {
            minHeight: 'auto !important',
        }
    },
});
//---------------------------->funcion para mostrar un mensaje<-----------------------------------------------------
function showSuccess(mensaje) {

    new Noty({
        type: "information",
        layout: "topCenter",
        text: mensaje,
        timeout: "3000",
    }).show();
}

function showError(mensaje) {
    new Noty({
        type: "error",
        layout: "topCenter",
        text: mensaje,
        timeout: "3000",
    }).show();
}

function DialogCreateRemDes(props) {
    const classes = useStyles();
    let { createVisible } = props

//----------------------------->Atributos<----------------------------------------------------------------------------
    const [dataMunicipios, setDataMunicipios] = React.useState([]);
    const [dataEstados, setDataEstados] = React.useState([]);
    const [state, setState] = React.useState({
        id: "",
        alias: "",
        nombre: "",
        RFC: "",
        calle: "",
        numeroInt: "",
        numeroExt: "",
        colonia: "",
        estado: '',
        idMunicipio: '',
        municipio: '',
        codigoPostal: "",
        correo: "",
        telefono: "",
        contacto: "",
        zonaOperativa: "",
        clientePaga: {},
        cliente:"",
        numero: 0,
        equivalencia: 0,
        openDialog: false,
        openCodigos: false
    });
//----------------------------->Hooks useState <----------------------------------------------------------------------
    const [pagina, setPagina] = React.useState(0);
    const [dataCodigosPostales, setDataCodigosPostales] = React.useState([]);
//----------------------------->Hooks useEffect <----------------------------------------------------------------------
    useEffect(() => {
        getAllEstados();
    }, [pagina])

//--------------------------->Funciones<----------------------------------------------------------------------
    const getAllEstados = () => {
        obtenerAllEstados().then((respuesta) => {
            setDataEstados(respuesta.data);
        });
    }

    const handleClienteSelected = (row) => {
        setState(state => {
            return {
                ...state,
                clientePaga: row.data,
                openDialog: false
            }
        });
        console.log(state.clientePaga);
    }

    const dialogVisible = (isVisible) => {
        setState(state => {
            return {
                ...state,
                openDialog: isVisible,
            }
        });
    };

    const handleChange = (event) => {
        event.preventDefault();
        setState((state) => {
            return {
                ...state,
                [event.target.name]: event.target.value,
            };
        });
        if (event.target.name === "estado") {
            obtenerMunicipiosByIdEstado(event.target.value).then(({ data }) => {
                setDataMunicipios(data);
            });
        }
    };

    const handleChangeCodigoPostal = (event) => {
        event.preventDefault();
        let nuevoCodigo = {
            idCP: state.codigoPostal.idCP,
            m_sCP: event.target.value,
            m_sColonia: ""
        }
        setState((state) => {
            return {
                ...state,
                codigoPostal: nuevoCodigo,
            };
        });
    };

    /**Se llama al seleccionar una opcion del autocomplete del dialog seleccionar código postal*/
    const handleChangeAutocomplete = (input, newValue) => {
        if(input=="codigoPostal"){
            obtenerZonaOperativaByIdCodigoPostal(newValue.m_nIdCP).then(
                (zonaOperativa ) => {
                    setState((state) => ({
                        ...state,
                        zonaOperativa: zonaOperativa.data.length !== 0 ? zonaOperativa.data[0] : null,
                        openCodigos: false,
                        codigoPostal: newValue,
                        estado: newValue.m_nIdEstado,
                        idMunicipio: newValue.m_nIdMunicipio,
                        municipio: newValue.m_sMunicipio,
                        colonia: newValue.m_sColonia
                    }));
                    obtenerMunicipiosByIdEstado(newValue.m_nIdEstado).then(({ data }) => {
                            setDataMunicipios(data);
                    });
                    // obtenerCodigosPostalesPorEstadoMunicipio(11, 20).then(({ data }) => {
                    //     setDataCodigosPostales(data);
                    // });
                }
            );
        }
    };

    /** Se llama al presionar el input del dialogo para seleccionar código postal*/
    const handleClickCodigosPostalesInput = (input) => {
        if (state.codigoPostal?.m_sCP.length > 0) {
            obtenerCodigoPostalPorCodigo(state.codigoPostal?.m_sCP).then(({ data }) => {
                setDataCodigosPostales(data);
            });
        }
    };

    const validacionesAgregar = () => {
        obtenerRemitentesDestinatariosNombre(state.nombre).then((respuesta) =>{
            if(respuesta.data.total > 0){
                showError("Ya se encuentra registrado un remitente/destnatario con ese nombre.")
                return false;
            }
        })
        if(!state.nombre || !state.RFC || !state.codigoPostal.m_sCP || !state.calle || !state.contacto || !state.correo || !state.telefono){
            showSuccess("Faltan campos por llenar");
            return false;
        }
        /*console.log(state.codigoPostal)
        if(state.codigoPostal.m_sCP && !state.codigoPostal.m_nIdCP){
            obtenerCodigoPostalPorCodigo(state.codigoPostal.m_sCP).then((response) => {
                console.log(response.data)
                if(response.data.length > 0) {
                    let nuevoCodigo = {
                        idCP: response.data[0].m_nIdCP,
                        m_sCP: state.codigoPostal.m_sCP
                    }
                    setState((state) => {
                        return {
                            ...state,
                            codigoPostal: nuevoCodigo
                        };
                    });
                    //estadoId = dataEstados.find(i => i.m_sAbreviacion === response.data[0].m_nIdEstado) //.m_nIdEstado
                }
            })
        }*/
        return true;
    }

    const handleAgregar = () => {
        if(validacionesAgregar()){
            const params = {
                idCliente: state.clientePaga.id,
                nombre: state.nombre,
                rfc: state.RFC,
                activo: true,
                calle: state.calle,
                noExterior: state.numeroExt,
                noInterior: state.numeroInt,
                colonia: state.colonia,
                localidad: state.colonia,
                idMunicipio: state.idMunicipio,
                municipio: state.municipio,
                idEstado: state.estado,
                creadoPor: localStorage.getItem("UsuarioId"),
                idCP: state.codigoPostal.m_nIdCP,
                codigoPostal: state.codigoPostal.m_sCP,
                idSucursal: localStorage.getItem("Sucursal") || 0,
                contacto: state.contacto,
                correoElectronico: state.correo,
                telefono: state.telefono,
                noRegistroIdentidadFiscal: state.RFC,
                alias: state.nombre,
                numero: state.numero,
                equivalencia: state.equivalencia
            };
            console.log(params);
            agregarRemitenteDestinatario(params).then((respuesta) => {
                showSuccess("Creado con número: "+respuesta.data);
                createVisible(false);
            }).catch((err) => {
                console.log(err);
                showSuccess(err.response.data);
            });
        }
    }

//----------------------------------------------Renderizado-------------------------------------------------
    return (
        <div>
            <Dialog fullWidth open={state.openCodigos} onClose={() => setState({...state, openCodigos: false})}>
                <DialogTitle>Seleccionar código postal</DialogTitle>
                <DialogContent>
                    <p>
                        <span>Se muestran los códigos pertenecientes al municipio seleccionado</span>
                        <br/>
                    </p>

                    <div style={{backgroundColor: '#FFFFFF'}}>
                        <Autocomplete
                                freeSolo
                                onChange={(event, newValue) =>
                                    handleChangeAutocomplete("codigoPostal", newValue)
                                }
                                value={state.codigoPostal}
                                name="codigoPostal"
                                disableClearable
                                forcePopupIcon={false}
                                options={dataCodigosPostales}
                                getOptionLabel={(option) => option ? `${option.m_sCP} - ${option.m_sColonia}` : ""}
                                style={{ transform: "translate(14px, 10px) scale(1) !important" }}
                                renderInput={(params) => (
                                    <div>
                                        <TextField
                                            label="Código Postal"
                                            margin="dense"
                                            variant="outlined"
                                            onClick={(e) =>
                                                handleClickCodigosPostalesInput("codigoPostal")
                                            }
                                            required
                                            {...params}
                                        />
                                    </div>
                                )}
                        />
                    </div>
                </DialogContent>
                <DialogActions style={{justifyContent: "rigth"}}>
                    <button onClick={() => {setState({...state, openCodigos: false})}} className="btn btn-secondary secondary-btn">
                        Cerrar
                    </button>
                </DialogActions>
            </Dialog>
            <Dialog fullWidth open={state.openDialog} onClose={() => setState({...state, openDialog: false})}>
                <DialogContent>
                    <div style={{backgroundColor: '#FFFFFF'}}>
                        <DialogTableClientes dialogVisible={dialogVisible} handlePatrocinadorSelected={handleClienteSelected}/>
                    </div>
                </DialogContent>
            </Dialog>
            <div className="widget-wrap" id="crearRemitenteDestinatario">
                <div className="widget-header">
                    <h2>Nuevo Remitente/Destinatario</h2>
                </div>
                <div>
                    <h3>Form Values in Real Time:</h3>
                    <pre>{JSON.stringify(state, null, 2)}</pre>
                </div>
                <div className="widget-container">
                    <div className="widget-content">
                        <Grid container spacing={2} alignItems="center" justifyContent="center">

                            <Grid item xs={4}>
                                <div className="input">
                                    <TextField
                                        variant="outlined"
                                        margin="dense"
                                        onChange={handleChange}
                                        className="form-control"
                                        type="text"
                                        label="RFC"
                                        // pattern="[A-Z&Ñ]{3,4}[0-9]{2}(0[1-9]|1[012])(0[1-9]|[12][0-9]|3[01])[A-Z0-9]{2}[0-9A]"
                                        title="Favor de introducir un RFC válido."
                                        required
                                        fullWidth
                                        value={state.RFC}
                                        name="RFC"
                                    />
                                </div>
                            </Grid>

                            <Grid item xs={6}>
                                <div className="input">
                                    <TextField
                                        variant="outlined"
                                        margin="dense"
                                        onChange={handleChange}
                                        className="form-control"
                                        type="text"
                                        required
                                        label="Nombre"
                                        value={state.nombre}
                                        name="nombre"
                                    />
                                </div>
                            </Grid>

                            <Grid item xs={6}>
                                <div className="input">
                                    <TextField
                                        variant="outlined"
                                        label="Cliente"
                                        margin="dense"
                                        value={state.clientePaga.m_sNombreFiscal}
                                        placeholder={"Cliente"}
                                        InputLabelProps={{shrink: true}}
                                        //onChange={handleChange}
                                        className="form-control"
                                        type="text"
                                        name="cliente"
                                        onClick={() => {
                                            setState({
                                                ...state,
                                                openDialog: true
                                            })
                                        }
                                        }
                                    />
                                </div>
                            </Grid>

                            <div className="col-md-12">
                                <p>Domicilio fiscal</p>
                            </div>

                            <Grid item xs={8}>
                                <div className="input">
                                    <TextField
                                        label="Código Postal"
                                        margin="dense"
                                        variant="outlined"
                                        onChange={handleChangeCodigoPostal}
                                        className="form-control"
                                        type="text"
                                        required
                                        value={state.codigoPostal.m_sCP}
                                        name="codigoPostal"
                                    />
                                </div>
                            </Grid>
                            <Grid item xs={4}>
                                <IconButton aria-label="Buscar código"
                                            onClick={() => setState({...state, openCodigos: true})}>
                                    <SearchIcon fontSize={"large"} style={{marginRight: '10px'}}/>
                                    Seleccionar código
                                </IconButton>
                            </Grid>

                            <Grid container rowSpacing={2} columnSpacing={{xs: 2, sm: 2, md: 3}}>
                                <Grid item xs={6}>
                                    <FormControl fullWidth variant="outlined" margin="dense" required>
                                        <InputLabel id="idEstadoLabel">Estado</InputLabel>
                                        <Select
                                            fullWidth
                                            labelId="idEstadoLabel"
                                            label="Estado"
                                            className="form-control"
                                            value={state.estado}
                                            onChange={handleChange}
                                            name="estado"
                                            disabled
                                        >
                                            {dataEstados.map((estado) => (
                                                <option key={estado.m_nIdEstado} value={estado.m_nIdEstado}>
                                                    {estado.m_sEstado}
                                                </option>
                                            ))}
                                        </Select>
                                    </FormControl>
                                </Grid>

                                <Grid item xs={6}>
                                    <FormControl
                                        className="input select"
                                        fullWidth
                                        variant="outlined"
                                        margin="dense"
                                        required
                                    >
                                        <InputLabel id="idMunicipioLabel">Municipio</InputLabel>
                                        <Select
                                            fullWidth
                                            labelId={"idMunicipioLabel"}
                                            label={"Municipio"}
                                            className="form-control"
                                            value={state.idMunicipio}
                                            onChange={handleChange}
                                            name="idMunicipio"
                                            InputProps={{name: "municipio"}}
                                            disabled
                                        >
                                            {dataMunicipios.map((municipio) => (
                                                <option
                                                    key={municipio.m_sCodigoMunicipio}
                                                    value={municipio.m_sCodigoMunicipio}
                                                >
                                                    {municipio.m_sMunicipio}
                                                </option>
                                            ))}
                                        </Select>
                                    </FormControl>
                                </Grid>

                                <Grid item xs={6}>
                                    <div className="input">
                                        <TextField
                                            variant="outlined"
                                            margin="dense"
                                            onChange={handleChange}
                                            className="form-control"
                                            type="text"
                                            required
                                            label="Colonia / Localidad"
                                            value={state.colonia}
                                            name="colonia"
                                            disabled
                                        />
                                    </div>
                                </Grid>

                                <Grid item xs={6}>
                                    <div className="input">
                                        <TextField
                                            variant="outlined"
                                            margin="dense"
                                            onChange={handleChange}
                                            className="form-control"
                                            type="text"
                                            required
                                            label="Calle"
                                            value={state.calle}
                                            name="calle"
                                        />
                                    </div>
                                </Grid>

                                <Grid item xs={3}>
                                    <div className="input">
                                        <TextField
                                            variant="outlined"
                                            margin="dense"
                                            onChange={handleChange}
                                            className="form-control"
                                            type="text"
                                            label="Número interior"
                                            value={state.numeroInt}
                                            name="numeroInt"
                                        />
                                    </div>
                                </Grid>

                                <Grid item xs={3}>
                                    <div className="input">
                                        <TextField
                                            variant="outlined"
                                            margin="dense"
                                            onChange={handleChange}
                                            className="form-control"
                                            type="text"
                                            label="Número exterior"
                                            value={state.numeroExt}
                                            name="numeroExt"
                                        />
                                    </div>
                                </Grid>

                                <Grid item xs={6}>
                                    <div className="input">
                                        <TextField
                                            variant="outlined"
                                            margin="dense"
                                            onChange={handleChange}
                                            className="form-control"
                                            type="text"
                                            required
                                            label="Contacto"
                                            value={state.contacto}
                                            name="contacto"
                                        />
                                    </div>
                                </Grid>

                                <Grid item xs={6}>
                                    <div className="input">
                                        <TextField
                                            variant="outlined"
                                            margin="dense"
                                            onChange={handleChange}
                                            className="form-control"
                                            type="text"
                                            label="Teléfono"
                                            required
                                            value={state.telefono}
                                            disabled={props.consulta}
                                            name="telefono"
                                        />
                                    </div>
                                </Grid>

                                <Grid item xs={6}>
                                    <div className="input">
                                        <TextField
                                            variant="outlined"
                                            margin="dense"
                                            label="Correo Electrónico"
                                            onChange={handleChange}
                                            className="form-control"
                                            type="email"
                                            required
                                            value={state.correo}
                                            disabled={props.consulta}
                                            name="correo"
                                        />
                                    </div>
                                </Grid>
                            </Grid>

                        </Grid>

                    </div>
                </div>
            </div>
            <DialogActions style={{justifyContent: "rigth"}}>
                <button
                    onClick={() => {
                        createVisible(false)
                    }}
                    className="btn btn-secondary secondary-btn"
                >
                    Cerrar
                </button>
                <button
                    onClick={() => {
                        handleAgregar();
                    }}
                    className="btn btn-primary primary-btn"
                >
                    Guardar
                </button>
            </DialogActions>
        </div>
    );
}

export default DialogCreateRemDes;
