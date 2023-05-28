import React, {useState, useEffect} from 'react'
import Cabecera from "../../Components/Template/Cabecera";
import BarraLateralIzquierda from "../../Components/Template/BarraLateralIzquierda";
import TextField from "@material-ui/core/TextField";
import {
    Box,
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    FormControl, FormControlLabel, FormGroup, FormLabel,
    Grid,
    InputLabel, MenuItem, Paper, Radio, RadioGroup,
    Select, Switch, ThemeProvider,
    Tooltip
} from "@material-ui/core";
import {obtenerSucursales} from "../../Util/Contexts/SucursalContext";
import Autocomplete from "@material-ui/lab/Autocomplete";
import IconButton from "@material-ui/core/IconButton";
import AddBoxIcon from "@material-ui/icons/AddBox";
import DeleteIcon from "@material-ui/icons/Delete";
import {DataGrid} from "@material-ui/data-grid";
import {dataGridLocaleText} from "../../Constants";
import InputAdornment from "@material-ui/core/InputAdornment";
import PageviewIcon from "@material-ui/icons/Pageview";
import {obtenerCiudades, obtenerCiudadId} from "../../Util/Contexts/CiudadesContext";
import {obtenerMonedas} from "../../Util/Contexts/MonedaContext";
import {obtenerGuiaId, obtenerGuiasFiltro, obtenerGuiasFiltroCorteCaja} from "../../Util/Contexts/GuiaContext";
import Noty from "noty";
import {agregarCorte, modificarCorte, obtenerCorteId} from "../../Util/Contexts/CorteCajaContext";
import {obtenerTiposPago} from "../../Util/Contexts/TipoPagoContext";
import {getCurrentDate, getCurrentTime} from "../../Util/Util";
import {createMuiTheme} from "@material-ui/core/styles";
import MyDialog from "./DialogOperador";
import DialogGuias from "./DialogGuias";
import TableGuias from "./TableGuias";

function showSuccess(mensaje) {
    new Noty({
        type: "information",
        layout: "topCenter",
        text: mensaje,
        timeout: "3000"
    }).show()
}

function CorteCajaAgregar({pantallaActiva, select, consult}){

    const currencyFormatter = new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
    });
    const [guias, setGuias] = useState([])
    const [guiasSeleccionadas, setGuiasSeleccionadas] = useState([])

    const [filtros, setFiltros] = useState({
        busquedaPorUsuario: false,
        usuario: null,
        operador: null,
        fechaRegistro: getCurrentDate(),
        horaRegistro: getCurrentTime(),
    })

    const [openDialog, setOpenDialog] = useState(false);
    const [openDialogGuias, setOpenDialogGuias] = useState(false);
    const theme = createMuiTheme({
        overrides: {
            MuiSwitch: {
                switchBase: {
                    // Controls default (unchecked) color for the thumb
                    color: "#ccc"
                },
                colorPrimary: {
                    "&$checked": {
                        // Controls checked color for the thumb
                        color: "rgb(249, 160, 62)",
                        "&$disabled": {
                            // Controls checked color for the thumb
                            color: "rgb(249, 160, 62)"
                        }
                    },

                },
                track: {
                    // Controls default (unchecked) color for the track
                    opacity: 0.2,
                    backgroundColor: "#ccc",
                    "$checked$checked + &": {
                        // Controls checked color for the track
                        opacity: 0.7,
                        backgroundColor: "#F9A03E"
                    }
                }
            }
        }
    });
    const listado = 1
    const agregar = 2
    const modificar = 3

    useEffect( value => {
        if (pantallaActiva === listado){
            limpiarCampos()
        }else if (pantallaActiva === agregar){
            limpiarCampos()
        }else if (pantallaActiva === modificar){
            limpiarCampos()
            obtenerCorteId(select).then(({data}) =>{

                let totalTotal = 0.0
                data.m_arrGuias.forEach((i) => {
                    let m_cImporte = 0
                    let m_cImporteIva = 0
                    let m_cImporteRetiene = 0
                    let m_cTotal = 0
                    let m_c_Descuento = 0
                    i.m_arClsGuiaConceptos.forEach((j) => {
                        m_cImporte += parseFloat(j.m_cImporte)
                        m_cImporteIva += parseFloat(j.m_cImporteIva)
                        m_cImporteRetiene += parseFloat(j.m_cImporteRetiene)
                        m_cTotal += parseFloat(j.m_cTotal)
                        m_c_Descuento += parseFloat(j.m_c_Descuento)
                    })
                    i.m_cImporte = m_cImporte
                    i.m_cImporteIva = m_cImporteIva
                    i.m_cImporteRetiene = m_cImporteRetiene
                    i.m_cDescuento = m_c_Descuento
                    i.m_cTotal = m_cTotal
                    totalTotal += parseFloat(m_cTotal)
                })

            })
        }
    }, [pantallaActiva])

    const limpiarCampos = () => {

    }

    const handleChange = (input, value) => {
        if (input !== 'busquedaPorUsuario'){
            setFiltros({
                ...filtros,
                [input]: value,
            });
        }
        if (input === 'busquedaPorUsuario'){
            if (value){
                setFiltros({
                    ...filtros,
                    [input]: value,
                    operador: null,
                    usuario: {
                        idUsuario: localStorage.getItem("UsuarioId"),
                        nombre: localStorage.getItem("Nombre")
                    }
                });
            }else {
                setFiltros({
                    ...filtros,
                    [input]: value,
                    operador: null,
                    usuario: null
                });
            }
        }
    };

    const handleOpenDialog = () => {
        setOpenDialog(true);
    };

    const handleCloseDialog = () => {
        setOpenDialog(false);
    };

    const handleAcceptData = (data) => {
        if (filtros.busquedaPorUsuario){
            setFiltros({
                ...filtros,
                usuario: data,
                operador: null
            })
        }else {
            setFiltros({
                ...filtros,
                usuario: null,
                operador: data
            })
        }
        handleCloseDialog();
    };

    const handleOpenDialogGuias = () => {
        setOpenDialogGuias(true);
    };

    const handleCloseDialogGuias = () => {
        setOpenDialogGuias(false);
    };

    const handleAcceptDataGuias = (data) => {

        setGuias([...guias, ...data])
        handleCloseDialogGuias();
    };

    const handleRowSelection = (selectedRows) => {
        setGuiasSeleccionadas(selectedRows)
    };

    const handleDescartarGuias = () => {
        let sel = [...guiasSeleccionadas]
        const listadoResultado = guias.filter((objeto1) => {
            // Comprobar si el objeto está presente en listado2
            return !sel.some((objeto2) => objeto2.idGuia === objeto1.idGuia);
        });
        setGuias(listadoResultado);
        setGuiasSeleccionadas([])
    };

    /*const TotalComponent = () => {
        // Calcula el total sumando los totales de cada objeto
        const totalSum = guias.reduce((acc, obj) => acc + obj.total, 0);
        // Formatea el total como moneda
        const formattedTotal = totalSum.toLocaleString('es-MX', { style: 'currency', currency: 'MXN' });

        return (
            <div>
                <h3>TOTAL CORTE: {formattedTotal}</h3>
            </div>
        );
    };*/

    function totalSum(items) {
        return items.map(({ total }) => total).reduce((sum, i) => sum + i, 0);
    }

    function isDataValid(idUsuario, idOperador){
        if (idOperador > 0 && idUsuario > 0) {
            console.log("No se puede seleccionar operador y usuario.");
            return false;
        } else if (idOperador > 0 || idUsuario > 0) {
            console.log("Válido.");
            return true;
        } else {
            console.log("Seleccione operador o usuario.");
            return false;
        }
    }

    const handleGuardar = () => {
        const {fechaRegistro, horaRegistro, usuario, operador} = filtros
        if (!isDataValid(usuario?.idUsuario,operador?.m_nIdOperador)){
            console.log("NO Guardar.");
            return
        }
        console.log("Guardar.");
        let params = {
            "m_cTotal": totalSum(guias),
            "m_sFechaRegistro": fechaRegistro,
            "m_sHoraRegistro": horaRegistro,
            "m_nIdUsuario": usuario?.idUsuario || 0,
            "m_nIdOperador": operador?.m_nIdOperador || 0,
            "m_arrGuias": guias.map((i) => ({
                "m_nIdGuia": i.idGuia,
                "m_nTotal": i.total
            }))
        }
        console.log(params)
        console.log(JSON.stringify(params))
        agregarCorte(params)
            .then((respuesta) => {
                console.log(respuesta.data)
            })
            .catch((error) => {
                console.log(error.toString())
            })
    }

    return(
        <div>
            <MyDialog
                open={openDialog}
                handleClose={handleCloseDialog}
                handleAccept={handleAcceptData}
            />
            <DialogGuias
                open={openDialogGuias}
                handleClose={handleCloseDialogGuias}
                handleAccept={handleAcceptDataGuias}
                filtros={{
                    busquedaPorUsuario: filtros.busquedaPorUsuario,
                    idOperador: filtros.operador?.m_nIdOperador,
                    idUsuario: filtros.usuario?.idUsuario,
                    fecha: filtros.fechaRegistro
                }}
                idsRowsHiden={guias.map((i) => i.idGuia)}
            />
            <Paper style={{padding: '16px'}}>
                <section>
                    <Grid container spacing={1}>
                        <Grid item xs={2}>
                            <TextField
                                variant="outlined"
                                id="fechaRegistro"
                                label="Fecha de registro"
                                type="date"
                                onChange={(e) => handleChange('fechaRegistro', e.target.value) }
                                value={filtros.fechaRegistro}
                                className={"form-control"}
                                InputLabelProps={{shrink: true,}}
                                // required={state.recoleccionConCita}
                            />
                        </Grid>
                        <Grid item xs={2}>
                            <TextField
                                variant="outlined"
                                id="horaRegistro"
                                label="Hora de registro"
                                type="time"
                                value={filtros.horaRegistro}
                                // onChange={handleHoraCitaMinima}
                                className={"form-control"}
                                disabled={true}
                                InputLabelProps={{shrink: true,}}
                                inputProps={{step: 300,}}
                                // required={state.recoleccionConCita}
                            />
                        </Grid>
                        <Grid item xs={2}>
                            <ThemeProvider theme={theme}>
                                <FormControlLabel
                                    control={
                                        <Switch
                                            checked={filtros.busquedaPorUsuario}
                                            onChange={(event) => handleChange('busquedaPorUsuario', event.target.checked)}
                                            color="primary"
                                        />
                                    }
                                    label="Busqueda por usuario"
                                />
                            </ThemeProvider>
                        </Grid>
                        <Grid item xs={3}>
                            <TextField
                                variant="outlined"
                                label={filtros.busquedaPorUsuario ? `Usuario` : `Operador`}
                                value={filtros.busquedaPorUsuario ? filtros.usuario?.nombre || '' : filtros.operador?.m_sNombreCompleto || ''}
                                margin={'dense'}
                                onClick={(e) => !filtros.busquedaPorUsuario && handleOpenDialog()}
                            />
                        </Grid>
                    </Grid>
                </section>
                <section style={{height: '50vh'}}>
                    <Box display="flex" justifyContent="flex-end">
                        <Button onClick={handleDescartarGuias}  color={"primary"}>
                            Descartar Guias
                        </Button>
                        <Button onClick={handleOpenDialogGuias} variant={"contained"} color={"primary"}>
                            Agregar Guias
                        </Button>
                    </Box>
                    <br/>
                    <TableGuias data={guias} handleSelection={handleRowSelection}
                                selectedRows2={guiasSeleccionadas} />
                </section>
                <section>
                    <Box display="flex" justifyContent="flex-end">
                        {/*<Button onClick={handleDescartarGuias}  color={"primary"}>
                            Descartar Guias
                        </Button>*/}
                        <Button fullWidth onClick={handleGuardar} variant={"contained"} color={"primary"}>
                            Guardar
                        </Button>
                    </Box>
                </section>

                {/*<br/>
                <br/>
                <TotalComponent/>*/}
            </Paper>
            {/*<section className={"main-container"} style={{ marginLeft: "0px", padding: "0px" }}>
                <div className={"content-fluid"}>

                </div>
            </section>*/}
        </div>
    )
}
export default CorteCajaAgregar