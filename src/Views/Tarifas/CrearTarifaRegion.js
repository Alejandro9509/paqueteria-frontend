import React, {useEffect, useState} from "react";
import {obtenerCiudades} from "../../Util/Contexts/CiudadesContext";
import {obtenerProductos} from "../../Util/Contexts/ProductosContext";
import {obtenerClientePublicoGeneral, obtenerClienteTieneConvenio} from "../../Util/Contexts/ClientesContext";
import {
    Dialog,
    DialogContent,
    FormControl,
    Grid,
    InputLabel,
    MenuItem,
    Paper,
    Select,
    TextField
} from "@material-ui/core";
import DialogTableClientes from "../Clientes/DialogTableClientes";
import DestinosTarifa from "./DestinosTarifa";
import ProductosPrecios from "./ProductosPrecios";
import Button from "@material-ui/core/Button";
import Noty from "noty";
import Region from "./Region";
import {getRandomId} from "../../Util/Util";

function showSuccess(mensaje) {
    new Noty({
        type: "information",
        layout: "topCenter",
        text: mensaje,
        timeout: "5000"
    }).show()
}

function CrearTarifaRegion(props) {
    const [ciudades, setCiudadades] = useState([])
    const [state, setState] = useState({
        ciudades: [],
        showDialogClientes: false,
        // origen: props.select?.m_nIdOrigen || null,
        codigoTarifa: props.select?.m_sCodigo || "",
        cliente: {
            m_nIdCliente : props.select?.cliente.m_nIdCliente,
            m_sNombreFiscal : props.select?.cliente.m_sNombreFiscal,
        },
        // precioFlete: props.select?.m_cFleteMinimo || "0.00",
/*
        //Aqui se guardan todos los productos y no se modifican
        dataProductos: [],
        //Aqui se guardan todos los productos que no estan seleccionados
        dataProductosTemp: [],
        //Aqui pues el nombre de la variable ya es muy explicita
        dataProductosSeleccionados: [],
        //Aqui se guardan todos los destinos que no estan seleccionados
        dataDestinosTemp: [],
        //Aqui pues el nombre de la variable ya es muy explicita
        dataDestinosSeleccionados: [],

        dataConceptos: [],
        dataConceptosBase: [],
        dataConceptosBaseManiobra: []*/
        viajes: props.select?.viajes || []
    })

    useEffect(() => {
        getAllCiudades()
        getAllProductos()
        if (!props.convenio){
            getClienteGenerico()
        }
    }, [])

    const getAllCiudades = () => {
        obtenerCiudades().then((respuesta) => {
            setState(state => {
                return {
                    ...state,
                    ciudades: respuesta.data,
                    dataDestinosTemp: respuesta.data,
                }
            });
            if (props.consult) {
                let dataDestinosTemp = respuesta.data
                props.select?.m_arrArDestinos?.forEach((p) => {
                    dataDestinosTemp = dataDestinosTemp.filter((f) => f.m_nIdCiudad != p.m_nIdCiudad)
                })
                setState(state => {
                    return {
                        ...state,
                        dataDestinosSeleccionados: props.select?.m_arrArDestinos || [],
                        dataDestinosTemp: dataDestinosTemp
                    }
                })
            }
        });
    }

    const getAllProductos = () => {
        obtenerProductos().then(respuesta => {
            setState(state => {
                return {
                    ...state,
                    dataProductos: respuesta.data, dataProductosTemp: respuesta.data, agregar: "Agregar"
                }
            })
            if (props.consult) {
                let dataProductosTemp = respuesta.data
                props.select?.m_arrArProductos?.forEach((p) => {
                    dataProductosTemp = dataProductosTemp.filter((f) => f.m_nIdProducto != p.m_nIdProducto)
                })
                setState(state => {
                    return {
                        ...state,
                        dataProductosSeleccionados: props.select?.m_arrArProductos,
                        dataProductosTemp: dataProductosTemp
                    }
                })
            }

        });
    }

    const getClienteGenerico = () => {
        obtenerClientePublicoGeneral().then(respuesta => {
            setState(state => {
                return {
                    ...state,
                    cliente: respuesta.data
                }
            })
        })
    }

    const handleChange = (event) => {
        event.preventDefault()
        setState({
            ...state,
            [event.target.name]: event.target.value
        });

    }

    const handlePatrocinadorSelected = (row) => {
        if (props.convenio){
            obtenerClienteTieneConvenio(row.data.m_nIdCliente, 3).then(respuesta => {
                if (respuesta.data.value){
                    showSuccess("El cliente seleccionado ya tiene convenio activo.")
                }else{
                    setState(state => {
                        return {
                            ...state,
                            cliente: row.data,
                        }
                    })
                }
            })
        }
        setState(state => {
            return {
                ...state,
                showDialogClientes: false
            }
        })

    }

    const actualizarDestinos = (todosDestinos, destinosSeleccionados) => {
        setState({
            ...state,
            dataDestinosTemp: todosDestinos,
            dataDestinosSeleccionados: destinosSeleccionados
        })
    }

    const actualizarProductos = (todosProductos, productosSeleccionados) => {
        setState({
            ...state,
            dataProductosTemp: todosProductos,
            dataProductosSeleccionados: productosSeleccionados
        })
    }

    const handleDialogVisible = (isVisible) => {
        setState({
            ...state,
            showDialogClientes: isVisible,
        });
    };

    const onSubmit = (event) =>  {
        event.preventDefault()
        props.onSubmit(state)
    }

    const filtrarDestinos = (ciudades) => {
        return ciudades.filter(i  => i.m_nIdCiudad !== state.origen)
    }

    const handleChangeViaje = (viaje) => {
        let newViajes = []
        state.viajes.forEach(i => {
            newViajes.push(i)
        })
        newViajes.forEach(i => {
            if (i.idViaje === viaje.idViaje ){
                i.idOrigen = viaje.idOrigen
                i.fleteMinimo = viaje.fleteMinimo
                i.dataDestinosSeleccionados = viaje.dataDestinosSeleccionados
                i.dataProductosSeleccionados = viaje.dataProductosSeleccionados
            }
        })
        setState({
            ...state,
            viajes: newViajes
        })
    }

    const handleDeleteViaje = (viaje) => {
        let newViajes = []
        state.viajes.forEach(i => {
            newViajes.push(i)
        })
        setState({
            ...state,
            viajes: newViajes.filter(i => i.idViaje !== viaje.idViaje)
        })
    }

    const handleOnAgregarViaje = () => {
        let viajes = [...state.viajes]
        viajes.push({
            idViaje: getRandomId(),
            idOrigen: null,
            fleteMinimo: 0.00,
            dataDestinosSeleccionados: [],
            dataProductosSeleccionados: [],
        })
        setState({
            ...state,
            viajes: viajes
        })
    }

    return(
        <div>
            <Dialog
                open={state.showDialogClientes}
                onClose={() => setState({...state, showDialogClientes: false})}
                fullWidth maxWidth="md"
            >
                <DialogContent>
                    <div className="row" style={{backgroundColor: '#FFFFFF'}}>
                        <DialogTableClientes dialogVisible={handleDialogVisible } handlePatrocinadorSelected={handlePatrocinadorSelected}/>
                    </div>
                </DialogContent>
            </Dialog>
            <form className="j-forms" onSubmit={onSubmit}>
                <Paper style={{padding: '20px', marginBottom: '10px'}}>

                    <Grid container spacing={2}>
                        <Grid item xs={10}>
                            <h4>Agregando Tarifas</h4>
                        </Grid>
                        <Grid item xs={2}>
                            <Button fullWidth color={"primary"} variant={"contained"} onClick={handleOnAgregarViaje}>Agregar viaje</Button>
                        </Grid>
                        <Grid item xs={3}>
                            <TextField
                                variant="outlined"
                                label="Responsable de pago"
                                margin="dense"
                                required
                                value={state.cliente?.m_sNombreFiscal}
                                placeholder={"No. Cliente: Nombre fiscal"}
                                InputLabelProps={{shrink: true}}
                                onClick={(props.disabled || !props.convenio) ?
                                    () => {
                                        return
                                    } : (() => {
                                        setState({...state, showDialogClientes: true})
                                    })}
                                disabled={props.disabled || !props.convenio}
                            />
                        </Grid>
                        <Grid item xs={2}>
                            <TextField variant="outlined" margin="dense"
                                       onChange={handleChange}
                                       className="form-control"
                                       label={"Código"}
                                       required
                                       disabled={props.disabled}
                                       value={state.codigoTarifa}
                                       name="codigoTarifa"
                            />
                        </Grid>

                    </Grid>
                    {
                        state.viajes.map(viaje => (
                            <Region
                                key={viaje.idViaje}
                                viaje={viaje}
                                origenesDestinosListado={state.ciudades}
                                handleChangeViajeForaneo={handleChangeViaje}
                                handleDeleteViajeForaneo={handleDeleteViaje}
                                // productosListado={productosListado}
                                disabled={props.disabled}
                                // tiposCalculoListado={tiposCalculoListado}
                                // unidadesMedidaListado={unidadesMedidaListado}
                                // zonasListado={zonasListado}
                                // onRequestZonasByDestino={handleOnRequestZonasByDestino}
                                // showDialogZonas={showDialogZonas}
                                // handleShowDialogZonas={handleShowDialogZonas}
                            />
                        ))
                    }
                    {/*<Region
                        key={viaje.idViaje}
                        viaje={viaje}
                        origenesDestinosListado={origenesDestinosListado}
                        handleChangeViajeForaneo={handleChangeViajeForaneo}
                        tiposCalculoListado={tiposCalculoListado}
                        unidadesMedidaListado={unidadesMedidaListado}
                        handleDeleteViajeForaneo={handleDeleteViajeForaneo}
                        zonasListado={zonasListado}
                        onRequestZonasByDestino={handleOnRequestZonasByDestino}
                        productosListado={productosListado}
                        disabled={props.disabled}
                        showDialogZonas={showDialogZonas}
                        handleShowDialogZonas={handleShowDialogZonas}
                    />*/}
                    {/*<DestinosTarifa
                        destinos={filtrarDestinos(state.dataDestinosTemp)}
                        destinosSeleccionados={state.dataDestinosSeleccionados}
                        actualizarDestinos={actualizarDestinos}
                        disabled={props.disabled}
                    />*/}

                    {/*<div style={{marginTop:'20px', marginBottom: '20px'}}>
                        <ProductosPrecios
                            dataList={state.dataProductosSeleccionados}
                            onChangeList={actualizarProductos}
                            mostrarRangos={false}
                            consult={props.consult}
                            disabled={props.disabled}
                            ivaRetiene={[]}
                            ivaTraslada={[]}
                            mostrarTotal={false}
                        />
                    </div>*/}

                    <Grid container item xs={12}>
                        <Button fullWidth type="submit" color={"primary"} variant={"contained"} disabled={props.disabled}>
                            Guardar Tarifa
                        </Button>
                    </Grid>
                </Paper>
            </form>
        </div>
    )

}

export default CrearTarifaRegion;