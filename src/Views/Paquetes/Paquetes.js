import React, {useEffect, useState} from "react";
import {FormControl, Grid, InputLabel, Select} from "@material-ui/core";
import Autocomplete from "@material-ui/lab/Autocomplete";
import TextField from "@material-ui/core/TextField";
import IconButton from "@material-ui/core/IconButton";
import AddBoxIcon from "@material-ui/icons/AddBox";
import DeleteIcon from "@material-ui/icons/Delete";
import {DataGrid} from "@material-ui/data-grid";
import {dataGridLocaleText} from "../../Constants";
import Noty from "noty";
import {obtenerProductoById} from "../../Util/Contexts/ProductosContext";
import {obtenerEmbalajes} from "../../Util/Contexts/EmbalajesContext";
import axios from "axios";
import Recoleccion from "../Recoleccion";

function showSuccess(mensaje) {
    new Noty({
        type: "information",
        layout: "topCenter",
        text: mensaje,
        timeout: "3000"
    }).show()
}
function Paquetes({dataPaquetes = [],updatePaquetes, disabled, handleChangePaqueteProductov2, tieneSeguro}) {

    const columnsPaquetes = React.useMemo(() => [
        {
            headerName: "Tipo",
            field: "m_sTipo",
            minWidth: 100,
            width: 100,
        },
        {
            headerName: "Producto",
            field: "m_sProducto",
            flex: 1,
        },
        {
            headerName: "Largo",
            field: "m_rLargo",
            type:'number',
            width: 100,
        },
        {
            headerName: "Ancho",
            field: "m_rAncho",
            type:'number',
            width: 100,
        },
        {
            headerName: "Alto",
            field: "m_rAlto",
            type:'number',
            width: 100,
        },
        {
            headerName: "Peso",
            field: "m_rPeso",
            type:'number',
            width: 100,
        },
        {
            headerName: "Volumen",
            field: "m_rVolumen",
            type:'number',
            width: 100,
        },
        {
            headerName: "Embalaje",
            field: "m_sTipoEmbalaje",
            flex: 1,
        },
        {
            headerName: "Valor",
            field: "m_cyValorDeclarado",
            type:'number',
            valueFormatter: ({ value }) => currencyFormatter.format(Number(value)),
            width: 100,
        },
        {
            headerName: "Descripcion",
            field: "m_sDescripcion",
            flex: 1,
        },
        {
            headerName: "Cantidad",
            field: "m_nCantidad",
            type:'number',
            width: 100,
        },
        {
            headerName: "Observaciones",
            field: "m_sObservaciones",
            flex: 1,
        }
    ]);
    const currencyFormatter = new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
    });
    const [dataEmbalaje, setDataEmbalaje] = React.useState([]);
    const [dataProductos, setDataProductos] = useState([])
    const [paquete, setPaquete] = useState({
        m_nIdPaquete: 0,
        m_rPeso: "",
        m_rLargo: "",
        m_rAncho: "",
        m_rAlto: "",
        m_rVolumen: "",
        m_nIdTipoEmbalaje: "",
        m_sDescripcion: "",
        m_nCantidad: "",
        m_sObservaciones: "",
        m_cyValorDeclarado: "",
        m_nIdTipo: 2,
        m_nIdProducto:'',
        m_sTipo: "Paquete"
    })

    const validarPaquetes = (paquete) => {
        if (paquete.m_nIdTipo == 1){
            return !!(paquete.m_sDescripcion != '');
        }else{
            return !!(paquete.m_rPeso != ''
                && paquete.m_rLargo != ''
                && paquete.m_rAncho != ''
                && paquete.m_rAlto != ''
                && paquete.m_sDescripcion != ''
                && paquete.m_nCantidad != ''
                && paquete.producto
                && paquete.m_nIdTipoEmbalaje);
        }
    }

    const addPaquetev2 = (event) => {
        let paq = paquete
        if (validarPaquetes(paq)){
            paq.m_nIdPaquete = paq.m_nIdPaquete ? paq.m_nIdPaquete : dataPaquetes.length + 1
            paq.m_cyValorDeclarado = paq.m_cyValorDeclarado ? paq.m_cyValorDeclarado : 0
            if (paq.m_cyValorDeclarado === 0 && tieneSeguro){
                showSuccess("El campo de valor declarado es necesario para el seguro.")
                return
            }
            dataPaquetes.push(paq);
            resetPaquete()
            console.log(dataPaquetes);
            updatePaquetes(dataPaquetes)
        }else{
            showSuccess("Rellene los campos obligatorios.")
        }
    }

    const removePaquetev2 = (event) => {
        event.preventDefault()
        resetPaquete()
    }

    const handlePaqueteClick = (data) =>{
        if(disabled){
            updatePaquetes(dataPaquetes.filter((i) => i.m_nIdPaquete != data.m_nIdPaquete))
            if (dataProductos.length === 0 ){
                obtenerProductoById(data.m_nIdProducto).then((respuesta) =>{
                    data.producto = respuesta.data
                    data.m_sProducto = respuesta.data.m_sDescripcion
                })
            }else{
                data.producto = dataProductos.find((i) => i.m_nIdProducto == data.m_nIdProducto)
                data.m_sProducto = data.producto.m_sDescripcion
            }
            setPaquete(data)
        }

    }

    const handleChangePaquetev2 = (event) => {

        setPaquete(paquete => {
            return {
                ...paquete,
                [event.target.name]: event.target.value,
                m_rVolumen: paquete.m_rLargo * paquete.m_rAlto * paquete.m_rAncho,
            }
        })
        if (event.target.name == "m_nIdTipoEmbalaje"){
            setPaquete(paquete => {
                return {
                    ...paquete,
                    m_sTipoEmbalaje: dataEmbalaje.find((i) => i.m_nIdEmbalaje == event.target.value).m_sNombre,
                }
            })
        }
        if (event.target.name == "m_nIdTipo"){
            setPaquete(paquete => {
                return {
                    ...paquete,
                    m_sTipo: event.target.value == 1 ? "Sobre" : "Paquete",
                }
            })
        }

    };

    const resetPaquete = () =>{
        setPaquete({
            m_rPeso: "",
            m_rLargo: "",
            m_rAncho: "",
            m_rAlto: "",
            m_rVolumen: "",
            m_nIdTipoEmbalaje: "",
            m_sTipoEmbalaje: "",
            m_cyValorDeclarado: "",
            m_sDescripcion: "",
            m_nCantidad: "",
            m_nIdTipo: 2,
            m_sObservaciones: "",
            producto: null,
            m_nIdProducto: "",
            m_sTipo: "Paquete",
        })
    }

    const handleClickProducto = () => {
        if (dataProductos.length === 0 ){
            getAllProductos()
        }
        if (dataEmbalaje.length === 0 ) {
            getAllEmbalajes()
        }
    }

    const headers = {
        "Content-Type": "application/json",
        //    'access-control-allow-origin': '*'
    };

    const getAllProductos = () => {
        const url = `${process.env.REACT_APP_API_URL}/Productos/GetListado`;
        axios.get(url, {headers}).then(respuesta => {
            setDataProductos(respuesta.data)
        });
    }

    function getAllEmbalajes() {
        obtenerEmbalajes().then((respuesta) => {
            setDataEmbalaje(respuesta.data);
        });
    }

    return(
        <div>
            <Grid container>
                <Grid item xs={6}>
                    <div className="widget-header">
                        <h2>Paquetes y sobres</h2>
                    </div>
                </Grid>
            </Grid>

            <div className="widget-container">
                <div className="widget-content">
                    <div className="row">
                        <Grid container spacing={1}>
                            <Grid item xs={2}>
                                <label className="input select">
                                    <FormControl fullWidth variant="outlined" margin="dense" required>
                                        <InputLabel id="m_nIdTipoEmbalajeLabel">Tipo de paquete</InputLabel>
                                        <Select
                                            label="Tipo de paquete"
                                            labelId="m_nIdTipoLabel"
                                            className="form-control"
                                            value={paquete.m_nIdTipo}
                                            disabled={disabled}
                                            onChange={(event) => handleChangePaquetev2(event)}
                                            id="m_nIdTipo"
                                            name="m_nIdTipo"
                                        >
                                            <option key={2} value={2}>
                                                Paquete
                                            </option>
                                            <option key={1} value={1}>
                                                Sobre
                                            </option>
                                        </Select>
                                    </FormControl>
                                    <i className="fa fa-arrow-down"/>
                                </label>
                            </Grid>
                            {paquete.m_nIdTipo != 1 &&
                            <Grid item xs={2}>
                                <div className="input">
                                    <Autocomplete
                                        value={paquete.producto}
                                        freeSolo
                                        onChange={(event, newValue) => handleChangePaqueteProductov2(event, newValue)}
                                        disableClearable
                                        forcePopupIcon={false}
                                        options={dataProductos}
                                        disabled={disabled}
                                        getOptionLabel={(option) => `${option.m_sDescripcion}`}
                                        variant="outlined"
                                        inputValue={`${paquete.producto == null ? '' : paquete.producto.m_sDescripcion}`}
                                        name={"producto"}
                                        style={{transform: "translate(14px, 10px) scale(1) !important"}}
                                        renderInput={(params) =>
                                            <TextField
                                                variant="outlined"
                                                label="Producto"
                                                margin="dense"
                                                onClick={handleClickProducto}
                                                {...params}
                                            />
                                        }
                                    />
                                </div>
                            </Grid>
                            }
                            {paquete.m_nIdTipo != 1 &&
                            <Grid item xs={1}>
                                <div className="input">
                                    <TextField variant="outlined" margin="dense"
                                               onChange={(event) => handleChangePaquetev2(event)}
                                               className="form-control"
                                               type="text"
                                               value={paquete.m_rLargo}
                                               label="Largo"
                                               disabled={disabled}
                                               placeholder="cms"
                                               name="m_rLargo"
                                    />
                                </div>
                            </Grid>
                            }
                            {paquete.m_nIdTipo != 1 &&
                            <Grid item xs={1}>
                                <div className="input">
                                    <TextField variant="outlined" margin="dense"
                                               onChange={(event) => handleChangePaquetev2(event)}
                                               className="form-control"
                                               type="text"
                                               label="Ancho"
                                               value={paquete.m_rAncho}
                                               disabled={disabled}
                                               placeholder="cms"
                                               name="m_rAncho"
                                    />
                                </div>
                            </Grid>
                            }
                            {paquete.m_nIdTipo != 1 &&
                            <Grid item xs={1}>
                                <div className="input">
                                    <TextField variant="outlined" margin="dense"
                                               onChange={(event) => handleChangePaquetev2(event)}
                                               className="form-control"
                                               type="text"
                                               value={paquete.m_rAlto}
                                               label="Alto"
                                               disabled={disabled}
                                               placeholder="cms"
                                               name="m_rAlto"
                                    />
                                </div>
                            </Grid>
                            }
                            {paquete.m_nIdTipo != 1 &&
                            <Grid item xs={1}>
                                <div className="input">
                                    <TextField variant="outlined" margin="dense"
                                               onChange={(event) => handleChangePaquetev2(event)}
                                               className="form-control"
                                               type="text"
                                               label="Peso"
                                               value={paquete.m_rPeso}
                                               disabled={disabled}
                                               placeholder="kg"
                                               name="m_rPeso"
                                    />
                                </div>
                            </Grid>
                            }
                            {paquete.m_nIdTipo != 1 &&
                            <Grid item xs={1}>
                                <div className="input">
                                    <TextField variant="outlined" margin="dense"
                                        // onChange={(event) => handleChangePaquete(event, index)}
                                               className="form-control"
                                               type="text"
                                               value={paquete.m_rVolumen}
                                               label="Volumen"
                                               disabled
                                               placeholder="cm3"
                                               name="m_rVolumen"
                                    />
                                </div>
                            </Grid>
                            }
                            {paquete.m_nIdTipo != 1 &&
                            <Grid item xs={1}>
                                <label className="input select">
                                    <FormControl fullWidth variant="outlined" margin="dense" >
                                        <InputLabel id="m_nIdTipoEmbalajeLabel">Embalaje</InputLabel>
                                        <Select
                                            label="Embalaje"
                                            labelId="m_nIdTipoEmbalajeLabel"
                                            className="form-control"
                                            value={paquete.m_nIdTipoEmbalaje}
                                            disabled={disabled}
                                            onChange={(event) => handleChangePaquetev2(event)}
                                            id="m_nIdTipoEmbalaje"
                                            name="m_nIdTipoEmbalaje"
                                        >
                                            {dataEmbalaje.map((embalaje) => (
                                                <option key={embalaje.m_nIdEmbalaje} value={embalaje.m_nIdEmbalaje}>
                                                    {embalaje.m_sNombre}
                                                </option>
                                            ))}
                                        </Select>
                                    </FormControl>
                                    <i className="fa fa-arrow-down"/>
                                </label>
                            </Grid>
                            }
                            {paquete.m_nIdTipo != 1 &&
                            <Grid item xs={2}>
                                <div className="input">
                                    <TextField variant="outlined" margin="dense"
                                               onChange={(event) => handleChangePaquetev2(event)}
                                               className="form-control"
                                               type="text"
                                               label="Valor Declarado"
                                               value={paquete.m_cyValorDeclarado}
                                               disabled={disabled}
                                               placeholder="$"
                                               name="m_cyValorDeclarado"
                                    />
                                </div>
                            </Grid>
                            }
                            <Grid item xs={5}>
                                <div className="input">
                                    <TextField variant="outlined" margin="dense"
                                               onChange={(event) => handleChangePaquetev2(event)}
                                               className="form-control"
                                               type="text"
                                               label="Descripción"
                                               value={paquete.m_sDescripcion}
                                               disabled={disabled}
                                               placeholder="Descripción"
                                               name="m_sDescripcion"
                                    />
                                </div>
                            </Grid>
                            {paquete.m_nIdTipo != 1 &&
                            <Grid item xs={1}>
                                <div className="input">
                                    <TextField variant="outlined" margin="dense"
                                               onChange={(event) => handleChangePaquetev2(event)}
                                               className="form-control"
                                               type="text"
                                               label="Ctd"
                                               value={paquete.m_nCantidad}
                                               disabled={disabled}
                                               placeholder="Ctd"
                                               name="m_nCantidad"
                                    />
                                </div>
                            </Grid>
                            }
                            {paquete.m_nIdTipo != 1 &&
                            <Grid item xs={5}>
                                <div className="input">
                                    <TextField variant="outlined" margin="dense"
                                               onChange={(event) => handleChangePaquetev2(event)}
                                               className="form-control"
                                               type="text"
                                               label="Observaciones"
                                               value={paquete.m_sObservaciones}
                                               disabled={disabled}
                                               placeholder="Observaciones"
                                               name="m_sObservaciones"
                                    />
                                </div>
                            </Grid>
                            }
                            <Grid item xs={1}>
                                <IconButton onClick={addPaquetev2} style={{ padding: "0px" }} disabled={disabled}>
                                    <AddBoxIcon style={{ fill: "green", fontSize: "xx-large" }} />
                                </IconButton>
                                <IconButton onClick={removePaquetev2} style={{ padding: "0px" }} disabled={disabled}>
                                    <DeleteIcon style={{ fill: "red", fontSize: "xx-large" }} />
                                </IconButton>
                            </Grid>
                        </Grid>
                    </div>
                    <div className="row" style={{ height: 200}}>
                        <DataGrid
                            localeText={dataGridLocaleText}
                            density="compact"
                            pageSize={10}
                            columns={columnsPaquetes}
                            rows={dataPaquetes}
                            getRowId={(row) => row.m_nIdPaquete}
                            onRowSelected={(row) => handlePaqueteClick(row.data)}/>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Paquetes;