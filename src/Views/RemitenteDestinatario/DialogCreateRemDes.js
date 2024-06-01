import React, { useState, useEffect } from "react";
import Noty from "noty";
import {
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    FormControl,
    InputLabel,
    TextField,
    Select,
    Grid, MenuItem
} from "@mui/material";
import {obtenerClientePaginado} from "../../Util/Contexts/ClientesContext";
import {obtenerRemitentesDestinatarios,obtenerRemitentesDestinatariosPaginado, agregarRemitenteDestinatario} from "../../Util/Contexts/RemitenteDestinatarioContext";
import DialogTableClientes from "../Clientes/DialogTableClientes";
import { makeStyles } from "@mui/styles";
import Autocomplete from "@mui/lab/Autocomplete";
import {obtenerMunicipiosByIdEstado} from "../../Util/Contexts/MunicipiosContext";
import {obtenerZonaOperativaByIdCodigoPostal} from "../../Util/Contexts/ZonaOperativaContext";
import {obtenerZonaTarifaByIdCodigoPostal} from "../../Util/Contexts/ZonaTarifaContext";
import {obtenerCodigosPostalesPorEstadoMunicipio} from "../../Util/Contexts/CodigoPostalContext";
import {obtenerAllEstados} from "../../Util/Contexts/EstadosContext";

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
let rowSelect

/*function FormControl(props: {
    fullWidth: boolean,
    margin: string,
    variant: string,
    required: boolean,
    children: ReactNode
}) {
    return null;
}*/

function DialogCreateRemDes(props) {
    const classes = useStyles();
    let {createVisible,handleChangeAutoCompleteRemitenteDestinatario,handleCrearRemitente} = props

//----------------------------->Atributos<----------------------------------------------------------------------------
    const [dataMunicipios, setDataMunicipios] = React.useState([]);
    const [dataEstados, setDataEstados] = React.useState([]);
    const [state, setState] = React.useState({
        id: "",
        alias: "",
        nombre: "",
        RFC: "",
        domicilio: "",
        calle: "",
        numeroInt: "",
        numeroExt: "",
        colonia: "",
        estado: 11,
        estadoTexto: "",
        paisTexto: "",
        municipio: 20,
        municipioTexto: "",
        codigoPostal: "",
        correo: "",
        telefono: "",
        contacto: "",
        destino: "",
        origen:"",
        latitud:"",
        longitud:"",
        zonaOperativa: "",
        zonaTarifa: "",
        clientePaga: {},
        cliente:"",
        numero: 0,
        equivalencia: 0,
        openDialog: false
    });
//----------------------------->Hooks useState <----------------------------------------------------------------------
    const [pagina, setPagina] = React.useState(0);
    const [busqueda, setBusqueda] = React.useState("");
    const [dataCodigosPostales, setDataCodigosPostales] = React.useState([]);
//----------------------------->Hooks useEffect <----------------------------------------------------------------------
    useEffect(() => {
        getAllEstados();
        obtenerMunicipiosByIdEstado(11).then(({ data }) => {
            console.log(data);
            setDataMunicipios(data);
        });
        obtenerCodigosPostalesPorEstadoMunicipio(11, 20).then(({ data }) => {
            console.log(data);
            setDataCodigosPostales(data);
        });
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
                clientePaga: row,
                openDialog: false
            }
        });
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

    const handleChangeAutocomplete = (input, newValue) => {
        if(input=="codigoPostal"){
            obtenerZonaOperativaByIdCodigoPostal(newValue.m_nIdCP).then(
                ( zonaOperativa ) => {
                    obtenerZonaTarifaByIdCodigoPostal(newValue.m_sCP).then(
                        ( zonaTarifa ) => {
                            // if(zonaOperativa.data.length == 0){
                            //     showSuccess("El codigo postal del remitente no está registrado en ninguna zona operativa, favor de seleccionar otro")
                            // }
                            setState((state) => ({
                                ...state,
                                zonaOperativa: zonaOperativa.data.length !== 0 ? zonaOperativa.data[0] : null,
                                zonaTarifa: zonaTarifa.data.length !== 0  ? zonaTarifa.data[0] : null
                            }));
                        }
                    );
                }
            );
        }

        setState(() => ({
            ...state,
            [input]: newValue,
        }));
    };

    const handleClickCodigosPostalesInput = (input) => {
        obtenerCodigosPostalesPorEstadoMunicipio(state.estado, state.municipio).then(({ data }) => {
            setDataCodigosPostales(data);
        });
    };

    const handleAgregar = () => {
        const params = {
            idCliente: state.clientePaga.m_nIdCliente ? state.clientePaga.m_nIdCliente : null,
            nombre: state.nombre,
            rfc: state.RFC,
            activo: true,
            calle: state.calle,
            noExterior: state.numeroExt,
            noInterior: state.numeroInt,
            colonia: state.colonia,
            localidad: state.colonia,
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
        agregarRemitenteDestinatario(params).then((respuesta) => {
            showSuccess("Creado con número: "+respuesta.data);
            createVisible(false);
        }).catch((err) => {
            console.log(err);
            showSuccess(err.response.data);
        });
    }

//----------------------------------------------Renderizado-------------------------------------------------
    return (
        <div>
            <Dialog open={state.openDialog} onClose={() => setState({...state, openDialog: false})}>
                <DialogContent>
                    <div className="row" style={{backgroundColor: '#FFFFFF'}}>
                        <DialogTableClientes dialogVisible={dialogVisible} handlePatrocinadorSelected={handleClienteSelected}/>
                    </div>
                </DialogContent>
            </Dialog>
            <div className="widget-wrap" id="crearRemitenteDestinatario">
                <div className="widget-header">
                    <h2>Nuevo Remitente/Destinatario</h2>
                </div>
                <div className="widget-container">
                    <div className="widget-content">
                        <Grid container rowSpacing={2} columnSpacing={{ xs: 2, sm: 2, md: 3 }}>
                            {/*<Grid item xs={4}>
                                <div className="input">
                                    <TextField
                                        variant="outlined"
                                        margin="dense"
                                        onChange={handleChange}
                                        className="form-control"
                                        type="number"
                                        label="Número"
                                        value={state.numero}
                                        name="numero"
                                    />
                                </div>
                            </Grid>*/}

                            {/*<Grid item xs={4}>
                                <div className="input">
                                    <TextField
                                        variant="outlined"
                                        margin="dense"
                                        onChange={handleChange}
                                        className="form-control"
                                        type="number"
                                        label="No. equivalencia"
                                        value={state.equivalencia}
                                        name="equivalencia"
                                    />
                                </div>
                            </Grid>*/}

                            <Grid item xs={6}>
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
                                        fullWidth
                                    />
                                </div>
                            </Grid>

                            <Grid item xs={8}>
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
                                        fullWidth
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
                        </Grid>

                        <div className="col-md-12">
                            <br/>
                            <span>Domicilio fiscal</span>
                        </div>

                        <Grid container rowSpacing={2} columnSpacing={{xs: 2, sm: 2, md: 3}}>
                            <Grid item xs={8}>
                                <div className="input">
                                    <Autocomplete
                                        freeSolo
                                        onChange={(event, newValue) =>
                                            handleChangeAutocomplete("codigoPostal", newValue)
                                        }
                                        value={state.codigoPostal}
                                        name="codigoPostal"
                                        fullWidth
                                        disableClearable
                                        forcePopupIcon={false}
                                        options={dataCodigosPostales}
                                        getOptionLabel={(option) =>
                                            option ? `${option.m_sCP} - ${option.m_sColonia}` : ""
                                        }
                                        style={{
                                            transform: "translate(14px, 10px) scale(1) !important",
                                        }}
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
                            </Grid>

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
                                        defaultValue={11}
                                        InputLabelProps={{shrink: true}}
                                    >
                                        {dataEstados.map((estado) => (
                                            <MenuItem key={estado.m_nIdEstado} value={estado.m_nIdEstado}>
                                                {estado.m_sEstado}
                                            </MenuItem>
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
                                        value={state.municipio}
                                        onChange={handleChange}
                                        name="municipio"
                                        InputProps={{name: "municipio"}}
                                        defaultValue={20}
                                        InputLabelProps={{shrink: true}}
                                    >
                                        {dataMunicipios.map((municipio) => (
                                            <MenuItem
                                                key={municipio.m_sCodigoMunicipio}
                                                value={municipio.m_sCodigoMunicipio}
                                            >
                                                {municipio.m_sMunicipio}
                                            </MenuItem>
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
                                        fullWidth
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
                                        fullWidth
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
                                        fullWidth
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
                                        fullWidth
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
                                        fullWidth
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
                                        fullWidth
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
                                        fullWidth
                                    />
                                </div>
                            </Grid>

                            {/* {props.mostrarZonas && (
                            <div className="col-sm-12 col-md-12 unit">
                                <div className="input">
                                    <Autocomplete
                                        value={state.zonaOperativa}
                                        freeSolo
                                        onChange={(event, newValue) =>
                                            handleChangeAutocomplete("zonaOperativa", newValue)
                                        }
                                        id="zonaOperativa"
                                        disableClearable
                                        forcePopupIcon={false}
                                        options={dataZonasOperativas}
                                        disabled={props.consulta || props.modificar || props.agregar}
                                        getOptionLabel={(option) =>
                                            option
                                                ? `${option.m_sCodigoZona} - CP: ${state.codigoPostal.m_sCP}`|| "Código Postal sin zona asignada"
                                                : ""
                                        }
                                        variant="outlined"
                                        name={"zonaOperativa"}
                                        style={{
                                            transform: "translate(14px, 10px) scale(1) !important",
                                        }}
                                        renderInput={(params) => (
                                            <TextField
                                                variant="outlined"
                                                label="Zona Operativa"
                                                margin="dense"
                                                required={
                                                    !state.diferenteEntrega && !state.entregaEnSucursal
                                                }
                                                onClick={() => handleClickZona()}
                                                {...params}
                                            />
                                        )}
                                    />
                                </div>
                            </div>
                        )}
                        <div className="col-sm-12 col-md-12 unit">
                            <div className="input">
                                <Autocomplete
                                    value={state.zonaTarifa}
                                    freeSolo
                                    // onChange={(event, newValue) =>
                                    //     handleChangeAutocomplete("zonaTarifa", newValue)
                                    // }
                                    id="zonaTarifa"
                                    disableClearable
                                    forcePopupIcon={false}
                                    options={dataZonasTarifa}
                                    disabled={props.consulta || props.modificar || props.agregar}
                                    getOptionLabel={(option) =>
                                        option
                                            ? option.m_sCodigoZona || "Código Postal sin zona asignada"
                                            : ""
                                    }
                                    variant="outlined"
                                    name={"zonaTarifa"}
                                    style={{
                                        transform: "translate(14px, 10px) scale(1) !important",
                                    }}
                                    renderInput={(params) => (
                                        <TextField
                                            variant="outlined"
                                            label="Zona Tarifa"
                                            margin="dense"
                                            required={
                                                !state.diferenteEntrega && !state.entregaEnSucursal
                                            }
                                            onClick={handleClickZona}
                                            {...params}
                                        />
                                    )}
                                />
                            </div>
                        </div>*/}
                        </Grid>


                    </div>
                </div>
            </div>
            <DialogActions style={{justifyContent: "rigth"}}>
                <Button
                    onClick={() => {
                        createVisible(false)
                    }}
                    className="btn btn-secondary secondary-btn"
                >
                    Cerrar
                </Button>
                <Button
                    onClick={() => {
                        handleAgregar();
                    }}
                    className="btn btn-primary primary-btn"
                >
                    Guardar
                </Button>
            </DialogActions>
        </div>
    );
}

export default DialogCreateRemDes;
