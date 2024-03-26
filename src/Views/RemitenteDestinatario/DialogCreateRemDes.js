import React, { useState, useEffect } from "react";
import Noty from "noty";
import { DataGrid } from "@material-ui/data-grid";
import { dataGridLocaleText } from "../../Constants";
import {Button, Dialog, DialogActions, DialogContent, TextField} from "@material-ui/core";
import {obtenerRemitentesDestinatarios,obtenerRemitentesDestinatariosPaginado} from "../../Util/Contexts/RemitenteDestinatarioContext";
import SearchIcon from "@material-ui/icons/Search";
import { makeStyles } from '@material-ui/core/styles';
import InputAdornment from "@material-ui/core/InputAdornment";
import IconButton from "@material-ui/core/IconButton";
import Autocomplete from "@material-ui/lab/Autocomplete";
import {obtenerMunicipiosByIdEstado} from "../../Util/Contexts/MunicipiosContext";

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
function DialogCreateRemDes(props) {
    const classes = useStyles();
    let {createVisible,handleChangeAutoCompleteRemitenteDestinatario,handleCrearRemitente} = props

//----------------------------->Atributos<----------------------------------------------------------------------------
    const columns = [
        {
            headerName: "No. Remitente / Destinatario",
            field: "m_nNumero",
            width: 150,
        },
        {
            headerName: "Nombre",
            field: "m_sNombre",
            width: 500,
        },
        {
            headerName: "Domicilio",
            field: "m_sDomicilio",
            width: 500,
        },
    ]
    let registros=10
    const [dataMunicipios, setDataMunicipios] = React.useState([]);
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
        estado: "",
        estadoTexto: "",
        paisTexto: "",
        municipio: "",
        municipioTexto: "",
        codigoPostal: "",
        correo: "",
        telefono: "",
        contacto: "",
        destino: "",
        origen: "",
        zonaOperativa: "",
        zonaTarifa: "",
        latitud: "",
        longitud: ""
    });
//----------------------------->Hooks useState <----------------------------------------------------------------------
    const [rows, setRow] = React.useState([])
    const [pagina, setPagina] = React.useState(0);
    const [busqueda, setBusqueda] = React.useState("");
//----------------------------->Hooks useEffect <----------------------------------------------------------------------
    useEffect(() => {
        //cargarDesdeServidor(pagina,registros)
    }, [pagina])

//--------------------------->Funciones<----------------------------------------------------------------------
    function cargarDesdeServidor(pagina,registros){
        return new obtenerRemitentesDestinatariosPaginado(pagina,registros, busqueda).then((respuesta)=>{
            setRow(respuesta.data)
        })
    }

    const handleChange = (event) => {
        // if(!event.target.name === "telefono" || !event.target.name === "correo" || !event.target.name === "contacto"){
        //     props.seCalculaTarifa()
        // }
        event.preventDefault();
        setState((state) => {
            return {
                ...state,
                [event.target.name]: event.target.value,
            };
        });
        // if (event.target.name === "estado") {
        //     obtenerMunicipiosByIdEstado(event.target.value).then(({ data }) => {
        //         setDataMunicipios(data);
        //     });
        // }
    };

//----------------------------------------------Renderizado-------------------------------------------------
    return (
        <div>
            <div className="col-md-6">
                <div className="col-sm-12 col-md-12    unit">
                    <div className="input">
                        <TextField
                            variant="outlined"
                            margin="dense"
                            onChange={handleChange}
                            className="form-control"
                            type="text"
                            required
                            label="Alias (Nombre)"
                            value={state.nombre}
                            name="nombre"
                        />
                    </div>
                </div>

                <div className="col-sm-12 col-md-12 unit">
                    <div className="input">
                        <TextField
                            variant="outlined"
                            margin="dense"
                            onChange={handleChange}
                            className="form-control"
                            type="text"
                            label="RFC"
                            pattern="[A-Z&Ñ]{3,4}[0-9]{2}(0[1-9]|1[012])(0[1-9]|[12][0-9]|3[01])[A-Z0-9]{2}[0-9A]"
                            title="Favor de introducir un RFC válido."
                            required
                            fullWidth
                            value={state.RFC}
                            name="RFC"
                        />
                    </div>
                </div>

                <div className="col-sm-12 col-md-12 unit">
                    <div className="input">
                        <TextField
                            variant="outlined"
                            margin="dense"
                            onChange={handleChange}
                            className="form-control"
                            type="text"
                            required
                            label="Domicilio"
                            value={state.domicilio}
                            name="domicilio"
                        />
                    </div>
                </div>

                <div className="col-sm-12 col-md-12 unit">
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
                </div>

                <div className="col-sm-12 col-md-12 unit">
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
                </div>

                <div className="col-sm-12 col-md-12 unit">
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
                </div>

                <div className="col-sm-12 col-md-12 unit">
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
                        />
                    </div>
                </div>

                <div className="col-sm-12 col-md-12  unit">
                    <TextField
                        variant="outlined"
                        margin="dense"
                        className="form-control"
                        label="Estado"
                        value={state.estadoTexto}
                        name="estado"
                    />
                </div>
            </div>
            <div className="col-md-6">
                <div className="col-sm-12 col-md-12 unit">
                    <TextField
                        variant="outlined"
                        margin="dense"
                        className="form-control"
                        label="Municipio"
                        value={state.municipioTexto}
                        name="municipio"
                    />
                </div>

                <div className="col-sm-12 col-md-12 unit">
                    <div className="input">
                        <Autocomplete
                            freeSolo
                            // onChange={(event, newValue) =>
                            //     handleChangeAutocomplete("codigoPostal", newValue)
                            // }
                            value={state.codigoPostal}
                            name="codigoPostal"
                            disableClearable
                            forcePopupIcon={false}
                            // options={dataCodigosPostales}
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
                                        // onClick={(e) =>
                                        //     handleClickCodigosPostalesInput("codigoPostal")
                                        // }
                                        required
                                        {...params}
                                    />
                                </div>
                            )}
                        />
                    </div>
                </div>

                <div className="col-sm-12 col-md-12 unit">
                    <div className="input">
                        <TextField
                            variant="outlined"
                            margin="dense"
                            label="Correo Electrónico"
                            // onChange={handleChange}
                            className="form-control"
                            type="email"
                            required
                            value={state.correo}
                            disabled={props.consulta}
                            name="correo"
                        />
                    </div>
                </div>

                <div className="col-sm-12 col-md-12 unit">
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
                            disabled={props.consulta }
                            name="telefono"
                        />
                    </div>
                </div>

                <div className="col-sm-12 col-md-12 unit">
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
                            disabled={props.consulta}
                            name="contacto"
                        />
                    </div>
                </div>

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
                        console.log("Creando contacto");
                        createVisible(false);
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
