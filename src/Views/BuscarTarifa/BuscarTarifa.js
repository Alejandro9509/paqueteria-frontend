import {React, useEffect, useState} from "react";
import Cabecera from "../../Components/Template/Cabecera";
import BarraLateralIzquierda from "../../Components/Template/BarraLateralIzquierda";
import {Button, FormControl, Grid, InputLabel, MenuItem, Paper, Select, Switch, TextField} from "@mui/material";
import {obtenerUnidadesMedida} from "../../Util/Contexts/UnidadesMedidaContext";
import {obtenerCiudades} from "../../Util/Contexts/CiudadesContext";
import {obtenerProductos} from "../../Util/Contexts/ProductosContext";
import {obtenerTiposCalculo} from "../../Util/Contexts/TipoCalculoContext";
import {obtenerConceptosFacturacion} from "../../Util/Contexts/ConceptosFacturacionContext";
import {obtenerSucursales} from "../../Util/Contexts/SucursalContext";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import {
    obtenerColoniasCPs,
} from "../../Util/Contexts/ZonaOperativaContext";
import {obtenerParametrosConfiguracion} from '../../Util/Contexts/ParametrosConfiguracionContext'
import Autocomplete from "@mui/lab/Autocomplete";
import ExpandLess from "@mui/icons-material/ExpandLess";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ListItem from "@mui/material/ListItem";
import List from "@mui/material/List";
import {RemoveCircle} from "@mui/icons-material";
import {obtenerCotizacionTarifario} from "../../Util/Contexts/CotizadorContext";

function BuscarTarifa() {

    const [listadoColoniasCPs, setListadoColoniasCPs] = useState([])
    const [sucursalesListado, setSucursalesListado] = useState([])
    const [conceptosListado, setConceptosListado] = useState([])
    const [conceptosParamsConfig, setConceptosParamsConfig] = useState([])
    const [tiposCalculoListado, setTiposCalculoListado] = useState([])
    const [origenesDestinosListado, setOrigenesDestinosListado] = useState([])
    const [unidadesMedidaListado, setUnidadesMedidaListado] = useState([])
    const [productosListado, setProductosListado] = useState([])
    const [filtrosProductos, setFiltrosProductos] = useState([])
    const [productosCotizados, setProductosCotizados] = useState([])
    const [conceptosResult, setConceptosResult] = useState([])
    //Si no se decide origen, no se muestran cotizaciones de primera milla, etc
    const [conceptosActivos,setConceptosActivos]=useState({
        primeraMilla:false,
        ultimaMilla:false,
        millaIntermedia:false,
    })
    const [filtrosBusqueda, setFiltrosBusqueda] = useState({
        sucOrigen: -1,
        sucDestino: -1,
        direccionOrigen: null,
        direccionDestino: null,
        ciudadOrigen: -1,
        ciudadDestino: -1,
        producto: null,
        productos: [],
        showMillaM: false,
        showPM: false,
        showUM: false
    })

    const getAllSucursales = () => {
        if (sucursalesListado.length > 0) {
            return
        }
        obtenerSucursales().then(respuesta => {
            setSucursalesListado(respuesta.data)
        })
    }

    const getAllColoniasCPs = () => {
        if (listadoColoniasCPs.length > 0) {
            return
        }
        obtenerColoniasCPs().then(respuesta => {
            setListadoColoniasCPs(respuesta.data)
        })
    }

    const getAllConceptos = () => {
        if (conceptosListado.length > 0) {
            return
        }
        obtenerConceptosFacturacion().then(respuesta => {
            setConceptosListado(respuesta.data)
        })
    }

    const getAllTiposCalculo = () => {
        if (tiposCalculoListado.length > 0) {
            return
        }
        obtenerTiposCalculo().then(respuesta => {
            setTiposCalculoListado(respuesta.data)
        })
    }

    const getAllUnidadesMedida = () => {
        if (unidadesMedidaListado.length > 0) {
            return
        }
        obtenerUnidadesMedida().then(respuesta => {
            setUnidadesMedidaListado(respuesta.data.filter(i => i.IdUnidadMedida === 21 || i.IdUnidadMedida === 48 || i.IdUnidadMedida === 38 || i.IdUnidadMedida === 55))
        })
    }

    const getOrigenesDestinos = () => {
        if (origenesDestinosListado.length > 0) {
            return
        }
        obtenerCiudades().then(respuesta => {
            setOrigenesDestinosListado(respuesta.data)
        })
    }

    const getAllProductos = () => {
        if (productosListado.length > 0) {
            return
        }
        obtenerProductos().then(respuestas => {
            let productosList = respuestas.data.map(p => ({
                m_nIdProducto: p.m_nIdProducto,
                m_nNoProducto: p.m_nNoProducto,
                m_xAlto: p.m_xAlto,
                m_xAncho: p.m_xAncho,
                m_xLargo: p.m_xLargo,
                m_sEmbalaje: p.m_sEmbalaje,
                m_xPeso: p.m_xPeso,
                m_nIdEmbalaje: p.m_nIdEmbalaje,
                m_sDescripcion: p.m_sDescripcion,
                m_bActivo: p.m_bActivo
            }))

            productosList.forEach(i => i.numeroDescripcion = `${i.m_nNoProducto}.- ${i.m_sDescripcion}`)
            setProductosListado(productosList.filter(i => i.m_bActivo))
        })
    }

    useEffect(() => {
        getAllSucursales()
        getAllTiposCalculo()
        getAllUnidadesMedida()
        getAllProductos()
        getAllConceptos()
        getOrigenesDestinos()
        getAllColoniasCPs()
        obtenerParametrosConfiguracion().then((respuesta) => {
            setConceptosParamsConfig({
                FactorConversion:respuesta.data.FactorConversion,
                IdConceptoRecoleccion: respuesta.data.IdConceptoRecoleccion,
                IdConceptoEntrega: respuesta.data.IdConceptoEntrega,
                IdConceptoFlete:respuesta.data.IdConceptoFlete,
                IdConceptoCarga: respuesta.data.IdConceptoCarga,
                IdConceptoDescarga: respuesta.data.IdConceptoDescarga
            })

        })
    }, []);

    function getCotizacionProducto(prod) {
        return new Promise((resolve) => {
            let params = {
                idOrigen: filtrosBusqueda?.ciudadOrigen || 0,
                idDestino: filtrosBusqueda?.ciudadDestino || 0,
                idEmbarque: 0,
                idRecoleccion: 0,
                idZonaEntrega: filtrosBusqueda.direccionDestino?.IdZona || 0,
                idZonaRecoleccion: filtrosBusqueda.direccionOrigen?.IdZona || 0,
                idCliente: 3140,
                entregaEnSucursal: 0,
                idSeguro: 5,
                valorDeclarado: 0,
                aplicaRecoleccion: true,
                aplicaSeguro: false,
                porcentajeSeguro: 0,
                recoleccionConCita: false,
                embarqueConCita: false,
                paquetesCotizacion: [{
                    tipo: 2,
                    peso: prod.desc.m_xPeso,
                    largo: prod.desc.m_xLargo,
                    ancho: prod.desc.m_xAncho,
                    alto: prod.desc.m_xAlto,
                    volumen: prod.desc.m_xLargo * prod.desc.m_xAncho * prod.desc.m_xAlto,
                    idTipoEmpaque: prod.desc.m_nIdEmbalaje,
                    activo: prod.desc.m_bActivo,
                    ctd: prod.cantidad,
                    idProducto: prod.desc.m_nIdProducto,
                }]
            }
            obtenerCotizacionTarifario(params).then(({data}) => {

                data.index = filtrosProductos.indexOf(prod)
                setConceptosResult(conceptosResult => {
                    return [...conceptosResult, data]
                })
            }).then(() => resolve)
        })
    }

    function agregarComasNumero(num) {
        return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    }

    function determinarConceptosAplicados() {
        return new Promise((resolve) => {

            resolve({
                pm: filtrosBusqueda.direccionOrigen?.IdZona,
                um:filtrosBusqueda.direccionDestino?.IdZona,
                im:filtrosBusqueda?.ciudadOrigen && filtrosBusqueda.direccionDestino?.IdZona
            })
        })
    }

    async function handleCotizar() {
        try {
            await new Promise((resolve) => {
                setConceptosResult([], resolve());
            });
            await determinarConceptosAplicados().then((i)=>{
                setConceptosActivos({primeraMilla: i.pm,ultimaMilla: i.um,millaIntermedia: i.im})
            })
            filtrosProductos.forEach(async (prod) => {
                const llamarCotizacion = await getCotizacionProducto(prod);
            })
            setProductosCotizados(JSON.parse(JSON.stringify(filtrosProductos)))
        } catch (error) {
            console.error("Error:", error);
        }
    }

    return (
        <div>
            <header className="topbar clearfix">
                <Cabecera titulo="Buscar Tarifas">
                    <div className="page-header">
                        <ul className="list-page-breadcrumb">
                            <li className="active-page">Catálogos</li>
                        </ul>
                    </div>
                </Cabecera>
            </header>
            <aside className="iconic-leftbar">
                <BarraLateralIzquierda/>
            </aside>
            <section className="main-container">
                <div className="container-fluid">
                    <div className="widget-wrap">
                        <Grid style={{marginLeft: '5%', marginTop: '1%', marginBottom: '5%'}} container spacing={3}>
                            <Grid item container spacing={3}>
                                <Grid item sm={12}>
                                    <h3>Origen</h3>
                                </Grid>
                                <Grid item sm={2}>
                                    <FormControl fullWidth variant='outlined' size='small'>
                                        <InputLabel
                                            id="sucLabel">Sucursal</InputLabel>
                                        <Select value={filtrosBusqueda.sucOrigen} onChange={(e) => {
                                            let IdCPSuc=sucursalesListado.find((s)=>s.m_nIdSucursal==e.target.value)?.m_nIdCodigoPostal
                                            let valorOrigen=listadoColoniasCPs.find((cp)=>cp.IdCodigoPostal==IdCPSuc)
                                            setFiltrosBusqueda({
                                                ...filtrosBusqueda,
                                                sucOrigen: e.target.value,
                                                direccionOrigen: valorOrigen ? valorOrigen : null,
                                                ciudadOrigen: valorOrigen ? valorOrigen.IdOrigenDestino : -1
                                            })
                                        }} labelId='sucLabel' label=''>
                                            <MenuItem value={-1}>
                                                {'SIN ESPECIFICAR'}
                                            </MenuItem>
                                            {sucursalesListado.map(suc => {
                                                return <MenuItem value={suc.m_nIdSucursal}>{suc.m_sSucursal}</MenuItem>
                                            })}
                                        </Select>
                                    </FormControl>
                                </Grid>
                                <Grid item sm={2}>
                                    <Autocomplete
                                        noOptionsText="Sin resultados"
                                        size='small'
                                        value={filtrosBusqueda.direccionOrigen==null?"": filtrosBusqueda.direccionOrigen}
                                        onChange={(e, newValue) => {
                                            setFiltrosBusqueda({
                                                ...filtrosBusqueda,
                                                direccionOrigen: newValue,
                                                sucOrigen: newValue?.CodigoPostal ? newValue.IdSucursal : -1,
                                                ciudadOrigen: newValue?.CodigoPostal ? newValue.IdOrigenDestino : -1
                                            })
                                        }}
                                        forcePopupIcon={false}
                                        options={listadoColoniasCPs}
                                        getOptionLabel={(option) =>
                                            option.CodigoPostal?`${option.CodigoPostal} - ${option.Colonia}`:""
                                        }
                                        variant="outlined"
                                        style={{
                                            transform: "translate(14px, 10px) scale(1) !important"
                                        }}
                                        renderInput={(params) => (
                                            <div>
                                                <TextField
                                                    variant="outlined"
                                                    label="Código Postal - Colonia"
                                                    className="form-control"
                                                    {...params}
                                                    InputProps={{
                                                        ...params.InputProps,
                                                        type: "search",
                                                        disableUnderline: true,
                                                    }}
                                                />
                                            </div>
                                        )}
                                    />

                                </Grid>
                                <Grid item sm={2}>
                                    <FormControl disabled fullWidth variant='outlined' size='small'>
                                        <InputLabel
                                            id="origenLbl">Origen</InputLabel>
                                        <Select value={filtrosBusqueda.ciudadOrigen}
                                                onChange={(e) => setFiltrosBusqueda({
                                                    ...filtrosBusqueda,
                                                    ciudadOrigen: e.target.value
                                                })} labelId='origenLbl' label=''>
                                            <MenuItem value={-1}>{'SIN ESPECIFICAR'}</MenuItem>
                                            {origenesDestinosListado.map(i => {
                                                return <MenuItem value={i.m_nIdCiudad}>{i.m_sCiudad}</MenuItem>
                                            })}
                                        </Select>
                                    </FormControl>

                                </Grid>
                            </Grid>
                            <Grid item container spacing={3}>
                                <Grid item sm={12}>
                                    <h3>Destino</h3>
                                </Grid>
                                <Grid item sm={2}>
                                    <FormControl fullWidth variant='outlined' size='small'>
                                        <InputLabel
                                            id="sucLabel">Sucursal</InputLabel>
                                        <Select value={filtrosBusqueda.sucDestino}
                                                onChange={(e) => {
                                                    let IdCPSuc=sucursalesListado.find((s)=>s.m_nIdSucursal==e.target.value)?.m_nIdCodigoPostal
                                                    let valorDestino=listadoColoniasCPs.find((cp)=>cp.IdCodigoPostal==IdCPSuc)
                                                    setFiltrosBusqueda({
                                                        ...filtrosBusqueda,
                                                        sucDestino: e.target.value,
                                                        direccionDestino: valorDestino ? valorDestino : null,
                                                        ciudadDestino: valorDestino ? valorDestino.IdOrigenDestino : -1
                                                    })
                                                }}
                                                labelId='sucLabel' label=''>
                                            <MenuItem value={-1}>{'SIN ESPECIFICAR'}</MenuItem>
                                            {sucursalesListado.map(suc => {
                                                return <MenuItem value={suc.m_nIdSucursal}>{suc.m_sSucursal}</MenuItem>
                                            })}
                                        </Select>
                                    </FormControl>
                                </Grid>
                                <Grid item sm={2}>
                                    <Autocomplete
                                        size='small'
                                        noOptionsText="Sin resultados"
                                        value={filtrosBusqueda.direccionDestino==null?"":filtrosBusqueda.direccionDestino}
                                        onChange={(e, newValue) => {
                                            setFiltrosBusqueda({
                                                ...filtrosBusqueda,
                                                direccionDestino: newValue,
                                                sucDestino: newValue?.CodigoPostal ? newValue.IdSucursal : -1,
                                                ciudadDestino: newValue?.CodigoPostal ? newValue.IdOrigenDestino : -1
                                            })
                                        }}
                                        forcePopupIcon={false}
                                        options={listadoColoniasCPs}
                                        getOptionLabel={(option) =>
                                            option.CodigoPostal?`${option.CodigoPostal} - ${option.Colonia}`:""
                                        }
                                        variant="outlined"
                                        renderInput={(params) => (
                                            <div>
                                                <TextField
                                                    variant="outlined"
                                                    label="Código Postal - Colonia"
                                                    className="form-control"
                                                    {...params}
                                                    InputProps={{
                                                        ...params.InputProps,
                                                        type: "search",
                                                        disableUnderline: true,
                                                    }}
                                                />
                                            </div>
                                        )}
                                    />
                                </Grid>
                                <Grid item sm={2}>
                                    <FormControl disabled fullWidth variant='outlined' size='small'>
                                        <InputLabel
                                            id="origenLbl">Destino</InputLabel>
                                        <Select value={filtrosBusqueda.ciudadDestino}
                                                onChange={(e) => setFiltrosBusqueda({
                                                    ...filtrosBusqueda,
                                                    ciudadDestino: e.target.value
                                                })} labelId='origenLbl' label=''>
                                            <MenuItem value={-1}>{'SIN ESPECIFICAR'}</MenuItem>
                                            {origenesDestinosListado.map(i => {
                                                return <MenuItem value={i.m_nIdCiudad}>{i.m_sCiudad}</MenuItem>
                                            })}
                                        </Select>
                                    </FormControl>
                                </Grid>
                            </Grid>
                            <Grid item sm={12} spacing={1}>
                                <Button className='btn btn-primary primary-btn'
                                        onClick={() => setFiltrosProductos([...filtrosProductos, {
                                            desc: productosListado[0],
                                            cantidad: 1,
                                            medida: 0
                                        }])}>Agregar Producto</Button>
                            </Grid>
                            <Grid item container sm={12} spacing={1}>
                                <List fullWidth>
                                    {
                                        filtrosProductos.length > 0 &&
                                        filtrosProductos.map((p, index) => {
                                            return (

                                                <ListItem style={{width: '150%'}}>
                                                    <Grid item container spacing={1} sm={12}>
                                                        <Grid item sm={2}>

                                                            <Autocomplete
                                                                fullWidth
                                                                noOptionsText="Sin resultados"
                                                                disableClearable
                                                                size='small'
                                                                value={p.desc}
                                                                onChange={(e, newValue) => {
                                                                    const newArr = filtrosProductos
                                                                    newArr[index].desc = newValue
                                                                    setFiltrosProductos(prevState => {
                                                                        return [
                                                                            ...newArr
                                                                        ]
                                                                    })
                                                                }}
                                                                forcePopupIcon={false}
                                                                options={productosListado}
                                                                getOptionLabel={(option) =>
                                                                    option.numeroDescripcion
                                                                }
                                                                variant="outlined"
                                                                renderInput={(params) => (
                                                                    <TextField
                                                                        variant="outlined"
                                                                        label="Producto"
                                                                        className="form-control"
                                                                        {...params}
                                                                        InputProps={{
                                                                            ...params.InputProps,
                                                                            type: "search",
                                                                            disableUnderline: true,
                                                                        }}
                                                                    />
                                                                )}
                                                            />
                                                        </Grid>
                                                        <Grid item sm={1}>
                                                            <TextField label={"Cantidad"} type='number' size={'small'}
                                                                       onChange={(e) => {
                                                                           const myPromise = new Promise((resolve) => {
                                                                               const updatedArr = [...filtrosProductos];
                                                                               updatedArr[index].cantidad = e.target.value;
                                                                               resolve(updatedArr)
                                                                           })
                                                                           myPromise.then((v) => setFiltrosProductos(v))
                                                                       }}
                                                                       value={p?.cantidad}>

                                                            </TextField>
                                                        </Grid>
                                                        <Grid item sm={1}>
                                                            <TextField label={"Largo"} type='number' size={'small'}
                                                                       onChange={(e) => {
                                                                           const myPromise = new Promise((resolve) => {
                                                                               const updatedArr = [...filtrosProductos];
                                                                               updatedArr[index].desc.m_xLargo = e.target.value;
                                                                               resolve(updatedArr)
                                                                           })
                                                                           myPromise.then((v) => setFiltrosProductos(JSON.parse(JSON.stringify(v))))
                                                                       }}
                                                                       value={p.desc?.m_xLargo}></TextField>
                                                        </Grid>
                                                        <Grid item sm={1}>
                                                            <TextField label={"Alto"} type='number' size={'small'}
                                                                       onChange={(e) => {
                                                                           const myPromise = new Promise((resolve) => {
                                                                               const updatedArr = [...filtrosProductos];
                                                                               updatedArr[index].desc.m_xAlto = e.target.value;
                                                                               resolve(updatedArr)
                                                                           })
                                                                           myPromise.then((v) => setFiltrosProductos(JSON.parse(JSON.stringify(v))))
                                                                       }}
                                                                       value={p.desc?.m_xAlto}></TextField>
                                                        </Grid>
                                                        <Grid item sm={1}>
                                                            <TextField label={"Ancho"} type='number' size={'small'}
                                                                       onChange={(e) => {
                                                                           const myPromise = new Promise((resolve) => {
                                                                               const updatedArr = [...filtrosProductos];
                                                                               updatedArr[index].desc.m_xAncho = e.target.value;
                                                                               resolve(updatedArr)
                                                                           })
                                                                           myPromise.then((v) => setFiltrosProductos(JSON.parse(JSON.stringify(v))))
                                                                       }}
                                                                       value={p.desc?.m_xAncho}></TextField>
                                                        </Grid>
                                                        <Grid item sm={1}>
                                                            <TextField label={"Peso"} type='number' size={'small'}
                                                                       onChange={(e)=>{
                                                                           const myPromise=new Promise((resolve)=>{
                                                                               const updatedArr = [...filtrosProductos];
                                                                               updatedArr[index].desc.m_xPeso = e.target.value;
                                                                               setFiltrosProductos(updatedArr);
                                                                           })
                                                                           myPromise.then((v) => setFiltrosProductos(JSON.parse(JSON.stringify(v))))
                                                                       }}
                                                                       value={p.desc.m_xPeso}></TextField>
                                                        </Grid>
                                                        <Grid item sm={1}>
                                                            <IconButton onClick={() => {
                                                                let newArray = [...filtrosProductos]
                                                                newArray.splice(index, 1)
                                                                setFiltrosProductos(newArray)
                                                            }} size={'large'} style={{color: 'red'}}>
                                                                <RemoveCircle fontSize={'inherit'}/>
                                                            </IconButton>
                                                        </Grid>

                                                    </Grid>
                                                </ListItem>
                                            )
                                        })
                                    }
                                </List>
                            </Grid>
                            <Grid item container spacing={1}>
                                <Grid item sm={7}>
                                    <h3>Tarifas</h3>
                                </Grid>
                                <Grid item sm={3}>
                                    <Button style={{fontSize:"1em"}} onClick={() => handleCotizar()} fullWidth
                                            className='btn-primary'>Buscar</Button>
                                </Grid>
                                <Grid item sm={11}>
                                    <Paper elevation={7}
                                           style={{marginTop: '10px', padding: '20px', marginBottom: '10px'}}>
                                        <Grid container spacing={1}>
                                            <Grid item xs={2}>
                                                <Typography variant="h3" component="h2">
                                                    Primera Milla
                                                </Typography>
                                            </Grid>
                                            <Grid item sm={2}>
                                                <IconButton onClick={() => {
                                                    setFiltrosBusqueda({
                                                        ...filtrosBusqueda,
                                                        showPM: filtrosBusqueda.showPM ? false : true
                                                    });
                                                    document.querySelector('.PM').classList.toggle('hide')
                                                }} className='btn-secondary'>
                                                    {filtrosBusqueda.showPM ?
                                                        <ExpandLess fontSize='default'/>
                                                        :
                                                        <ExpandMoreIcon fontSize='default'/>
                                                    }
                                                </IconButton>
                                            </Grid>
                                        </Grid>
                                        <div className='PM hide'>
                                            {
                                                conceptosResult.length > 0 && !conceptosActivos.primeraMilla &&
                                                <Grid item sm={7}>
                                                    <h5 style={{"font-style":"italic",textAlign: "left",fontSize:"1.5em"}}>NO APLICA</h5>
                                                </Grid>
                                            }
                                            {
                                                conceptosResult.length > 0 && conceptosActivos.primeraMilla &&
                                                <Grid item sm={7}>
                                                    <h5 style={{"font-style":"italic",textAlign: "left",fontSize:"1.5em"}}>{conceptosListado.find((i)=>i.m_nIdConceptosFacturacion==conceptosParamsConfig.IdConceptoRecoleccion).m_sConcepto}</h5>
                                                </Grid>
                                            }
                                            {
                                                conceptosResult.length > 0 && conceptosActivos.primeraMilla &&

                                                //conceptosResult.filter((c)=>c.IdConceptoRecoleccion==conceptosParamsConfig.IdConceptoRecoleccion).map((c,index)=>{
                                                conceptosResult.sort(function(a, b){return a.index - b.index}).map((c, index) => {
                                                    let concepto = c.find((c) => c.m_nIdConceptosFacturacion == conceptosParamsConfig.IdConceptoRecoleccion)
                                                    let pesoVol=(productosCotizados[index].desc.m_xLargo*productosCotizados[index].desc.m_xAncho*productosCotizados[index].desc.m_xAlto*conceptosParamsConfig.FactorConversion)
                                                    if (concepto.m_bError)
                                                        return (
                                                            <Grid style={{textAlign: "center"}} item container sm={12}
                                                                  spacing={1}>
                                                                <Grid item sm={12}>
                                                                    <h5 style={{textAlign: "right"}}>{productosCotizados[index].desc.m_sDescripcion}, {productosCotizados[index].cantidad} PIEZA(S), {productosCotizados[index].desc.m_xPeso>pesoVol?productosCotizados[index].desc.m_xPeso*productosCotizados[index].cantidad:pesoVol*productosCotizados[index].cantidad +" (Vol)"} KG</h5>
                                                                </Grid>
                                                                <Grid item sm={12}>
                                                                    <Typography style={{fontSize:"1.1em"}}>{concepto?.m_sDetalles.replace(" ni para PUBLICO EN GENERAL","")}</Typography>
                                                                </Grid>
                                                                <Grid item sm={12}>
                                                                    <hr style={{color:"black",height:1,backgroundColor:"black"}}></hr>
                                                                </Grid>
                                                            </Grid>
                                                        )
                                                    else
                                                        return (
                                                            <Grid style={{textAlign: "center", fontSize:"1.1em"}} item container sm={12}
                                                                  spacing={1}>

                                                                <Grid item sm={12}>
                                                                    <h5 style={{textAlign: "right"}}>{productosCotizados[index].desc.m_sDescripcion}, {productosCotizados[index].cantidad} PIEZA(S), {productosCotizados[index].desc.m_xPeso>pesoVol?productosCotizados[index].desc.m_xPeso*productosCotizados[index].cantidad:pesoVol*productosCotizados[index].cantidad +" (Vol)"} KG</h5>
                                                                </Grid>
                                                                <Grid item sm={2}>
                                                                    Tipo Medida
                                                                </Grid>
                                                                <Grid item sm={2}>
                                                                    Rango
                                                                </Grid>
                                                                <Grid item sm={1}>
                                                                    Importe
                                                                </Grid>
                                                                <Grid item sm={2}>
                                                                    Subtotal
                                                                </Grid>
                                                                <Grid item sm={1}>
                                                                    IVA
                                                                </Grid>
                                                                <Grid item sm={1}>
                                                                    Retiene
                                                                </Grid>
                                                                <Grid item sm={1}>
                                                                    Cálculo
                                                                </Grid>
                                                                <Grid item sm={2}>
                                                                    Total
                                                                </Grid>
                                                                <Grid item style={{"font-weight":"normal"}} sm={2}>
                                                                    {unidadesMedidaListado.find((u)=>u.IdUnidadMedida==concepto.m_nIdTipoMedida).UnidadMedida }
                                                                </Grid>
                                                                <Grid item style={{"font-weight":"normal"}} sm={2}>
                                                                    {concepto.rangoMin} - {concepto.rangoMax}
                                                                </Grid>
                                                                <Grid item style={{"font-weight":"normal"}} sm={1}>
                                                                    ${agregarComasNumero((concepto.m_cImporte/productosCotizados[index].cantidad).toFixed(2))}
                                                                </Grid>
                                                                <Grid item style={{"font-weight":"normal"}} sm={2}>
                                                                    ${agregarComasNumero(concepto.m_cImporte.toFixed(2))}
                                                                </Grid>
                                                                <Grid item style={{"font-weight":"normal"}} sm={1}>
                                                                    ${agregarComasNumero(concepto.m_cImporteIva.toFixed(2))}
                                                                </Grid>
                                                                <Grid item style={{"font-weight":"normal"}} sm={1}>
                                                                    ${agregarComasNumero(concepto.m_cImporteRetiene.toFixed(2))}
                                                                </Grid>
                                                                <Grid item style={{"font-weight":"normal"}} sm={1}>
                                                                    {tiposCalculoListado.find((t) => t.m_nIdTarifaTipoCalculo == concepto.m_nIdTipoCalculo).m_sTarifaTipoCalculo}
                                                                </Grid>
                                                                <Grid item style={{"font-weight":"normal"}} sm={2}>
                                                                    ${agregarComasNumero((concepto.m_cImporte - concepto.m_cImporteRetiene + concepto.m_cImporteIva).toFixed(2))}
                                                                </Grid>
                                                                <Grid item sm={12}>
                                                                    <hr style={{color:"black",height:1,backgroundColor:"black"}}></hr>
                                                                </Grid>
                                                            </Grid>
                                                        )
                                                })
                                            }
                                            {
                                                conceptosResult.length > 0 && conceptosActivos.primeraMilla &&
                                                <Grid style={{textAlign: "center", fontSize:"1.1em"}} item container sm={12}
                                                      spacing={1}>
                                                    <Grid item sm={10}></Grid>
                                                    <Grid item sm={2}>Total Final</Grid>
                                                    <Grid item sm={10}></Grid>
                                                    <Grid item sm={2}>${agregarComasNumero((conceptosResult.reduce((acum,a)=>{
                                                        let val = a.find((comp) => comp.m_nIdConceptosFacturacion == conceptosParamsConfig.IdConceptoRecoleccion)
                                                        if(val.m_cImporte)
                                                            return acum + (val.m_cImporte - val.m_cImporteRetiene + val.m_cImporteIva)
                                                        else
                                                            return (acum+0)

                                                    },0)).toFixed(2))}</Grid>
                                                </Grid>
                                            }
                                        </div>
                                    </Paper>

                                </Grid>
                            </Grid>

                            <Grid item sm={11}>
                                <Paper elevation={7} style={{marginTop: '10px', padding: '20px', marginBottom: '10px'}}>
                                    <Grid container spacing={1}>
                                        <Grid item xs={2}>
                                            <Typography variant="h3" component="h2">
                                                Última Milla
                                            </Typography>
                                        </Grid>
                                        <Grid item sm={2}>
                                            <IconButton onClick={() => {
                                                setFiltrosBusqueda({
                                                    ...filtrosBusqueda,
                                                    showUM: filtrosBusqueda.showUM ? false : true
                                                });
                                                document.querySelector('.UM').classList.toggle('hide')
                                            }} className='btn-secondary'>
                                                {filtrosBusqueda.showUM ?
                                                    <ExpandLess fontSize='default'/>
                                                    :
                                                    <ExpandMoreIcon fontSize='default'/>
                                                }
                                            </IconButton>
                                        </Grid>
                                    </Grid>
                                    <div className='UM hide'>
                                        {
                                            conceptosResult.length > 0 && !conceptosActivos.ultimaMilla &&
                                            <Grid item sm={7}>
                                                <h5 style={{"font-style":"italic",textAlign: "left",fontSize:"1.5em"}}>NO APLICA</h5>
                                            </Grid>
                                        }
                                        {
                                            conceptosResult.length > 0 && conceptosActivos.ultimaMilla &&
                                            <Grid item sm={7}>
                                                <h5 style={{"font-style":"italic",textAlign: "left",fontSize:"1.5em"}}>{conceptosListado.find((i)=>i.m_nIdConceptosFacturacion==conceptosParamsConfig.IdConceptoEntrega).m_sConcepto}</h5>
                                            </Grid>
                                        }
                                        {
                                            conceptosResult.length > 0 && conceptosActivos.ultimaMilla &&

                                            conceptosResult.sort(function(a, b){return a.index - b.index}).map((c, index) => {
                                                let concepto = c.find((c) => c.m_nIdConceptosFacturacion == conceptosParamsConfig.IdConceptoEntrega)
                                                let pesoVol=(productosCotizados[index].desc.m_xLargo*productosCotizados[index].desc.m_xAncho*productosCotizados[index].desc.m_xAlto*conceptosParamsConfig.FactorConversion)
                                                if (concepto.m_bError)
                                                    return (
                                                        <Grid style={{textAlign: "center"}} item container sm={12}
                                                              spacing={1}>
                                                            <Grid item sm={12}>
                                                                <h5 style={{textAlign: "right"}}>{productosCotizados[index].desc.m_sDescripcion}, {productosCotizados[index].cantidad} PIEZA(S), {productosCotizados[index].desc.m_xPeso>pesoVol?productosCotizados[index].desc.m_xPeso*productosCotizados[index].cantidad:pesoVol*productosCotizados[index].cantidad +" (Vol)"} KG</h5>
                                                            </Grid>
                                                            <Grid item sm={12}>
                                                                <Typography style={{fontSize:"1.1em"}}>{concepto?.m_sDetalles.replace(" ni para PUBLICO EN GENERAL","")}</Typography>
                                                            </Grid>
                                                            <Grid item sm={12}>
                                                                <hr style={{color:"black",height:1,backgroundColor:"black"}}></hr>
                                                            </Grid>
                                                        </Grid>
                                                    )
                                                else
                                                    return (
                                                        <Grid style={{textAlign: "center", fontSize:"1.1em"}} item container sm={12}
                                                              spacing={1}>

                                                            <Grid item sm={12}>
                                                                <h5 style={{textAlign: "right"}}>{productosCotizados[index].desc.m_sDescripcion}, {productosCotizados[index].cantidad} PIEZA(S), {productosCotizados[index].desc.m_xPeso>pesoVol?productosCotizados[index].desc.m_xPeso*productosCotizados[index].cantidad:pesoVol*productosCotizados[index].cantidad +" (Vol)"} KG</h5>
                                                            </Grid>
                                                            <Grid item sm={2}>
                                                                Tipo Medida
                                                            </Grid>
                                                            <Grid item sm={2}>
                                                                Rango
                                                            </Grid>
                                                            <Grid item sm={1}>
                                                                Importe
                                                            </Grid>
                                                            <Grid item sm={2}>
                                                                Subtotal
                                                            </Grid>
                                                            <Grid item sm={1}>
                                                                IVA
                                                            </Grid>
                                                            <Grid item sm={1}>
                                                                Retiene
                                                            </Grid>
                                                            <Grid item sm={1}>
                                                                Cálculo
                                                            </Grid>
                                                            <Grid item sm={2}>
                                                                Total
                                                            </Grid>
                                                            <Grid item style={{"font-weight":"normal"}} sm={2}>
                                                                {unidadesMedidaListado.find((u)=>u.IdUnidadMedida==concepto.m_nIdTipoMedida).UnidadMedida }
                                                            </Grid>
                                                            <Grid item style={{"font-weight":"normal"}} sm={2}>
                                                                {concepto.rangoMin} - {concepto.rangoMax}
                                                            </Grid>
                                                            <Grid item style={{"font-weight":"normal"}} sm={1}>
                                                                ${agregarComasNumero((concepto.m_cImporte/productosCotizados[index].cantidad).toFixed(2))}
                                                            </Grid>
                                                            <Grid item style={{"font-weight":"normal"}} sm={2}>
                                                                ${agregarComasNumero(concepto.m_cImporte.toFixed(2))}
                                                            </Grid>
                                                            <Grid item style={{"font-weight":"normal"}} sm={1}>
                                                                ${agregarComasNumero(concepto.m_cImporteIva.toFixed(2))}
                                                            </Grid>
                                                            <Grid item style={{"font-weight":"normal"}} sm={1}>
                                                                ${agregarComasNumero(concepto.m_cImporteRetiene.toFixed(2))}
                                                            </Grid>
                                                            <Grid item style={{"font-weight":"normal"}} sm={1}>
                                                                {tiposCalculoListado.find((t) => t.m_nIdTarifaTipoCalculo == concepto.m_nIdTipoCalculo).m_sTarifaTipoCalculo}
                                                            </Grid>
                                                            <Grid item style={{"font-weight":"normal"}} sm={2}>
                                                                ${agregarComasNumero((concepto.m_cImporte - concepto.m_cImporteRetiene + concepto.m_cImporteIva).toFixed(2))}
                                                            </Grid>
                                                            <Grid item sm={12}>
                                                                <hr style={{color:"black",height:1,backgroundColor:"black"}}></hr>
                                                            </Grid>
                                                        </Grid>
                                                    )
                                            })
                                        }
                                        {
                                            conceptosResult.length > 0 && conceptosActivos.ultimaMilla &&
                                            <Grid style={{textAlign: "center", fontSize:"1.1em"}} item container sm={12}
                                                  spacing={1}>
                                                <Grid item sm={10}></Grid>
                                                <Grid item sm={2}>Total Final</Grid>
                                                <Grid item sm={10}></Grid>
                                                <Grid item sm={2}>${agregarComasNumero((conceptosResult.reduce((acum,a)=>{
                                                    let val = a.find((comp) => comp.m_nIdConceptosFacturacion == conceptosParamsConfig.IdConceptoEntrega)
                                                    if(val.m_cImporte)
                                                        return acum + (val.m_cImporte - val.m_cImporteRetiene + val.m_cImporteIva)
                                                    else
                                                        return (acum+0)

                                                },0)).toFixed(2))}</Grid>
                                            </Grid>
                                        }
                                    </div>
                                </Paper>

                            </Grid>
                            <Grid item sm={11}>
                                <Paper elevation={7}
                                       style={{marginTop: '10px', padding: '20px', marginBottom: '10px'}}>
                                    <Grid container spacing={1}>
                                        <Grid item xs={2}>
                                            <Typography variant="h3" component="h2">
                                                Milla Intermedia
                                            </Typography>
                                        </Grid>
                                        <Grid item sm={2}>
                                            <IconButton onClick={() => {
                                                setFiltrosBusqueda({
                                                    ...filtrosBusqueda,
                                                    showMillaM: filtrosBusqueda.showMillaM ? false : true
                                                });
                                                document.querySelector('.MM').classList.toggle('hide')
                                            }} className='btn-secondary'>
                                                {filtrosBusqueda.showMillaM ?
                                                    <ExpandLess fontSize='default'/>
                                                    :
                                                    <ExpandMoreIcon fontSize='default'/>
                                                }
                                            </IconButton>
                                        </Grid>
                                    </Grid>
                                    <div className='MM hide'>
                                        {
                                            conceptosResult.length > 0 && !conceptosActivos.millaIntermedia &&
                                            <Grid item sm={7}>
                                                <h5 style={{"font-style":"italic",textAlign: "left",fontSize:"1.5em"}}>NO APLICA</h5>
                                            </Grid>
                                        }
                                        {
                                            conceptosResult.length > 0 && conceptosActivos.millaIntermedia &&
                                            <Grid item sm={7}>
                                                <h5 style={{"font-style":"italic",textAlign: "left",fontSize:"1.5em"}}>{conceptosListado.find((i)=>i.m_nIdConceptosFacturacion==conceptosParamsConfig.IdConceptoFlete).m_sConcepto}</h5>
                                            </Grid>
                                        }
                                        {
                                            conceptosResult.length > 0 && conceptosActivos.millaIntermedia &&

                                            conceptosResult.sort(function(a, b){return a.index - b.index}).map((c, index) => {
                                                let concepto = c.find((c) => c.m_nIdConceptosFacturacion == conceptosParamsConfig.IdConceptoFlete)
                                                let pesoVol=(productosCotizados[index].desc.m_xLargo*productosCotizados[index].desc.m_xAncho*productosCotizados[index].desc.m_xAlto*conceptosParamsConfig.FactorConversion)
                                                if (concepto.m_bError)
                                                    return (
                                                        <Grid style={{textAlign: "center"}} item container sm={12}
                                                              spacing={1}>
                                                            <Grid item sm={12}>
                                                                <h5 style={{textAlign: "right"}}>{productosCotizados[index].desc.m_sDescripcion}, {productosCotizados[index].cantidad} PIEZA(S), {productosCotizados[index].desc.m_xPeso>pesoVol?productosCotizados[index].desc.m_xPeso*productosCotizados[index].cantidad:pesoVol*productosCotizados[index].cantidad +" (Vol)"} KG</h5>
                                                            </Grid>
                                                            <Grid item sm={12}>
                                                                <Typography style={{fontSize:"1.1em"}}>{concepto?.m_sDetalles.replace(" ni para PUBLICO EN GENERAL","")}</Typography>
                                                            </Grid>
                                                            <Grid item sm={12}>
                                                                <hr style={{color:"black",height:1,backgroundColor:"black"}}></hr>
                                                            </Grid>
                                                        </Grid>
                                                    )
                                                else
                                                    return (
                                                        <Grid style={{textAlign: "center", fontSize:"1.1em"}} item container sm={12}
                                                              spacing={1}>

                                                            <Grid item sm={12}>
                                                                <h5 style={{textAlign: "right"}}>{productosCotizados[index].desc.m_sDescripcion}, {productosCotizados[index].cantidad} PIEZA(S), {productosCotizados[index].desc.m_xPeso>pesoVol?productosCotizados[index].desc.m_xPeso*productosCotizados[index].cantidad:pesoVol*productosCotizados[index].cantidad +" (Vol)"} KG</h5>
                                                            </Grid>
                                                            <Grid item sm={2}>
                                                                Tipo Medida
                                                            </Grid>
                                                            <Grid item sm={2}>
                                                                Rango
                                                            </Grid>
                                                            <Grid item sm={1}>
                                                                Importe
                                                            </Grid>
                                                            <Grid item sm={2}>
                                                                Subtotal
                                                            </Grid>
                                                            <Grid item sm={1}>
                                                                IVA
                                                            </Grid>
                                                            <Grid item sm={1}>
                                                                Retiene
                                                            </Grid>
                                                            <Grid item sm={1}>
                                                                Cálculo
                                                            </Grid>
                                                            <Grid item sm={2}>
                                                                Total
                                                            </Grid>
                                                            <Grid item style={{"font-weight":"normal"}} sm={2}>
                                                                {unidadesMedidaListado.find((u)=>u.IdUnidadMedida==concepto.m_nIdTipoMedida).UnidadMedida }
                                                            </Grid>
                                                            <Grid item style={{"font-weight":"normal"}} sm={2}>
                                                                {concepto.rangoMin} - {concepto.rangoMax}
                                                            </Grid>
                                                            <Grid item style={{"font-weight":"normal"}} sm={1}>
                                                                ${agregarComasNumero((concepto.m_cImporte/productosCotizados[index].cantidad).toFixed(2))}
                                                            </Grid>
                                                            <Grid item style={{"font-weight":"normal"}} sm={2}>
                                                                ${agregarComasNumero(concepto.m_cImporte.toFixed(2))}
                                                            </Grid>
                                                            <Grid item style={{"font-weight":"normal"}} sm={1}>
                                                                ${agregarComasNumero(concepto.m_cImporteIva.toFixed(2))}
                                                            </Grid>
                                                            <Grid item style={{"font-weight":"normal"}} sm={1}>
                                                                ${agregarComasNumero(concepto.m_cImporteRetiene.toFixed(2))}
                                                            </Grid>
                                                            <Grid item style={{"font-weight":"normal"}} sm={1}>
                                                                {tiposCalculoListado.find((t) => t.m_nIdTarifaTipoCalculo == concepto.m_nIdTipoCalculo).m_sTarifaTipoCalculo}
                                                            </Grid>
                                                            <Grid item style={{"font-weight":"normal"}} sm={2}>
                                                                ${agregarComasNumero((concepto.m_cImporte - concepto.m_cImporteRetiene + concepto.m_cImporteIva).toFixed(2))}
                                                            </Grid>
                                                            <Grid item sm={12}>
                                                                <hr style={{color:"black",height:1,backgroundColor:"black"}}></hr>
                                                            </Grid>
                                                        </Grid>
                                                    )
                                            })
                                        }
                                        {
                                            conceptosResult.length > 0 && conceptosActivos.millaIntermedia &&
                                            <Grid style={{textAlign: "center", fontSize:"1.1em"}} item container sm={12}
                                                  spacing={1}>
                                                <Grid item sm={10}></Grid>
                                                <Grid item sm={2}>Total Final</Grid>
                                                <Grid item sm={10}></Grid>
                                                <Grid item sm={2}>${agregarComasNumero((conceptosResult.reduce((acum,a)=>{
                                                    let val = a.find((comp) => comp.m_nIdConceptosFacturacion == conceptosParamsConfig.IdConceptoFlete)
                                                    if(val.m_cImporte)
                                                        return acum + (val.m_cImporte - val.m_cImporteRetiene + val.m_cImporteIva)
                                                    else
                                                        return (acum+0)

                                                },0)).toFixed(2))}</Grid>
                                            </Grid>
                                        }
                                    </div>
                                </Paper>
                            </Grid>
                        </Grid>
                    </div>
                </div>
            </section>
        </div>
    )
}

export default BuscarTarifa;