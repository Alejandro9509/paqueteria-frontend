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
import ViajeLocal from "../Tarifas/ViajeLocal";
import {
    obtenerListadoZonaOperativaBySucursal,
    obtenerColoniasCPs,
    obtenerListadoZonaOperativaByOrigenDestino
} from "../../Util/Contexts/ZonaOperativaContext";
import {obtenerTarifaRangosById, obtenerTarifaGeneral} from "../../Util/Contexts/TarifasContext";
import {getRandomId} from "../../Util/Util";
import {obtenerParametrosConfiguracion} from '../../Util/Contexts/ParametrosConfiguracionContext'
import Autocomplete from "@mui/lab/Autocomplete";
import ExpandLess from "@mui/icons-material/ExpandLess";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ViajeForaneo from "../Tarifas/ViajeForaneo";
import ListItem from "@mui/material/ListItem";
import List from "@mui/material/List";
import ListItemText from "@mui/material/ListItemText";
import {Label, RemoveCircle} from "@mui/icons-material";
import {obtenerCotizacionTarifario} from "../../Util/Contexts/CotizadorContext";

function BuscarTarifa() {

    const [listadoColoniasCPs, setListadoColoniasCPs] = useState([])
    const [viajesPrimeraMilla, setViajesPrimeraMilla] = useState([])
    const [viajesUltimaMilla, setViajesUltimaMilla] = useState([])
    const [viajesMillaIntermedia, setViajesMillaIntermedia] = useState([])
    const [maniobrasFiltradas, setManiobrasFiltradas] = useState([])
    const [viajesForaneosFiltrados, setViajesForaneosFiltrados] = useState([])
    const [viajesLocalesListado, setViajesLocalesListado] = useState([])
    const [maniobrasTarifa, setManiobrasTarifa] = useState([])
    const [viajesForaneosListado, setViajesForaneosListado] = useState([])
    const [sucursalesListado, setSucursalesListado] = useState([])
    const [listadoCodigoPostal, setListadoCodigoPostal] = useState([])
    const [listadoColonias, setListadoColonia] = useState([])
    const [conceptosListado, setConceptosListado] = useState([])
    const [conceptosParamsConfig, setConceptosParamsConfig] = useState([])
    const [zonasListado, setZonasListado] = useState([])
    const [tiposCalculoListado, setTiposCalculoListado] = useState([])
    const [origenesDestinosListado, setOrigenesDestinosListado] = useState([])
    const [unidadesMedidaListado, setUnidadesMedidaListado] = useState([])
    const [productosListado, setProductosListado] = useState([])
    const [filtrosProductos, setFiltrosProductos] = useState([])
    const [productosCotizados, setProductosCotizados] = useState([])
    const [conceptosResult, setConceptosResult] = useState([])
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


    const filtrarUnidadesMedidaViajeLocal = unidadesMedidaListado.filter(i => i.IdUnidadMedida === 21 || i.IdUnidadMedida === 48 || i.IdUnidadMedida === 38)

    const filtrarUnidadesMedidaManiobras = unidadesMedidaListado.filter(i => i.IdUnidadMedida === 21 || i.IdUnidadMedida === 48)
    const filtrarTiposCalculoManiobras = tiposCalculoListado.filter(i => i.m_nIdTarifaTipoCalculo === 1 || i.m_nIdTarifaTipoCalculo === 2)


    //  console.log(respuesta.data)
    /* setDataParaConsultar(respuesta.data)
     setState(state => {
         return {
             ...state,
             pantalla: 2,
             agregar: "Consultar",
             consult: true,
             selected: setDataParaConsultar(respuesta.data)
         }
     });
 })*/
    const getAllSucursales = () => {
        if (sucursalesListado.length > 0) {
            return
        }
        obtenerSucursales().then(respuesta => {
            setSucursalesListado(respuesta.data)
        })
    }
    /*const getAllTiposConceptos = () => {
        if (sucursalesListado.length > 0){
            return
        }
        getAllTiposConceptos().then(respuesta => {
            s(respuesta.data)
        })
    }*/
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

    const handleChangeViajeLocal = (viaje) => {
        let newViajes = []
        viajesLocalesListado.forEach(i => {
            newViajes.push(i)
        })
        newViajes.forEach(i => {
            if (i.idViaje === viaje.idViaje) {
                i.idViaje = viaje.idViaje
                i.idSucursal = viaje.idSucursal
                i.idTipoMedida = viaje.idTipoMedida
                i.zonas = viaje.zonas
                i.idConcepto = viaje.idConcepto
                i.rangos = viaje.rangos
                i.productos = viaje.productos
            }
        })
        setViajesLocalesListado(newViajes)
    }
    const handleChangeManiobras = (maniobras) => {
        setManiobrasTarifa(maniobras)
    }

    const handleChangeViajeForaneo = (viaje) => {
        let newViajes = []
        viajesForaneosListado.forEach(i => {
            newViajes.push(i)
        })
        newViajes.forEach(i => {
            if (i.idViaje === viaje.idViaje) {
                i.idOrigen = viaje.idOrigen
                i.idTipoMedida = viaje.idTipoMedida
                i.fleteMinimo = viaje.fleteMinimo
                i.idDestino = viaje.idDestino
                i.grupos = viaje.grupos
            }
        })
        setViajesForaneosListado(newViajes)
    }
    const handleDeleteViajeLocal = (viaje) => {
        setViajesLocalesListado(viajesLocalesListado.filter(i => i.idViaje !== viaje.idViaje))
    }
    const handleOnRequestZonasBySucursal = (idSucursal) => {
        obtenerListadoZonaOperativaBySucursal(idSucursal).then(respuesta => {
            setZonasListado(respuesta.data)
            setShowDialogZonas(true)
        })
    }
    /*function esConceptoViajeLocal(concepto){

            return concepto.m_nIdConceptosFacturacion === conceptosParamsConfig.IdConceptoRecoleccion
                || concepto.m_nIdConceptosFacturacion === conceptosParamsConfig.IdConceptoEntrega
    }*/
    const esConceptoViajeLocal = (concepto) => {
        return concepto.m_nIdConceptosFacturacion === conceptosParamsConfig.IdConceptoRecoleccion
            || concepto.m_nIdConceptosFacturacion === conceptosParamsConfig.IdConceptoEntrega
    }
    const filtrarProductosViajeLocal = (viaje) => {
        let productosDisponibles = []
        productosListado.forEach(i => {
            productosDisponibles.push(i)
        })
        let otrosViajes = viajesLocalesListado.filter(v => v.idViaje !== viaje.idViaje)
        otrosViajes = otrosViajes.filter(v => v.idSucursal === viaje.idSucursal && v.idConcepto === viaje.idConcepto)

        viaje.zonas.forEach(zonaViajeActual => {
            otrosViajes.forEach(v => {
                if (v.zonas.some(i => i.m_nIdZona === zonaViajeActual.m_nIdZona)) {
                    otrosViajes.forEach(v => {
                        v.productos.forEach(z => {
                            productosDisponibles = productosDisponibles.filter(j => j.m_nIdProducto !== z.m_nIdProducto)
                        })
                    })
                }
            })
        })

        return productosDisponibles
    }
    const filtrarConceptosViajeLocal = conceptosListado.filter(concepto => esConceptoViajeLocal(concepto))
    const [showDialogZonas, setShowDialogZonas] = useState(false)
    const handleShowDialogZonas = (show) => {
        setShowDialogZonas(show)
    }

    useEffect(() => {
        obtenerTarifaGeneral().then(respuesta => {

            setViajesLocalesListado(setDataParaConsultar(respuesta.data).viajesLocales)
            setViajesForaneosListado(setDataParaConsultar(respuesta.data).viajesForaneos)
            console.log(respuesta.data.ViajesLocales)
        })
        getAllSucursales()
        getAllTiposCalculo()
        getAllUnidadesMedida()
        getAllProductos()
        getAllConceptos()
        getOrigenesDestinos()
        getAllColoniasCPs()
        obtenerParametrosConfiguracion().then((respuesta) => {
            setConceptosParamsConfig({
                IdConceptoRecoleccion: respuesta.data.IdConceptoRecoleccion,
                IdConceptoEntrega: respuesta.data.IdConceptoEntrega,
                IdConceptoCarga: respuesta.data.IdConceptoCarga,
                IdConceptoDescarga: respuesta.data.IdConceptoDescarga
            })
            // return concepto.m_nIdConceptosFacturacion === respuesta.data.IdConceptoRecoleccion
            //     || concepto.m_nIdConceptosFacturacion === respuesta.data.IdConceptoEntrega
        })

    }, []);
    const setDataParaConsultar = (data) => {
        let viajesLocales = data.ViajesLocales.map(viaje => ({
            idViaje: viaje.IdViajeLocal,
            idSucursal: viaje.IdSucursal,
            idTipoMedida: viaje.IdTipoMedida,
            zonas: data.Zonas.filter(i => i.IdViajeLocal === viaje.IdViajeLocal).map(j => ({
                m_nIdZona: j.IdZonaOperativa,
                m_sCodigoZona: j.CodigoZona
            })),
            idConcepto: viaje.IdConcepto,
            rangos: data.Conceptos.filter(i => i.IdViajeLocal === viaje.IdViajeLocal).map(rango => ({
                id: rango?.IdTarifaConcepto || Math.floor(Math.random() * 10000),
                idConcepto: rango.IdConceptoFacturacion || null,
                concepto: rango.ConceptoFacturacion || '',
                importe: rango.Importe || 0,
                minimo: rango.Minimo || 0,
                maximo: rango.Maximo || 0,
                idTipoCalculo: rango.IdTipoCalculo || null,
                idUnidadMedida: rango.IdUnidadMedida || null,
                tipoCalculo: rango.TipoCalculo || '',
                unidadMedida: rango.UnidadMedida || '',
            })),
            productos: data.Productos.filter(i => i.IdViajeLocal === viaje.IdViajeLocal).map(j => ({
                m_nIdProducto: j.IdProducto,
                m_sDescripcion: j.Descripcion,
                m_nNoProducto: j.NoProducto,
                m_bActivo: j.Activo
            })),
        }))
        let maniobras = data.Conceptos.filter(i => i.IdTarifa === data.IdTarifa).map(rango => ({
            id: rango?.IdTarifaConcepto || Math.floor(Math.random() * 10000),
            idConcepto: rango.IdConceptoFacturacion || null,
            concepto: rango.ConceptoFacturacion || '',
            importe: rango.Importe || 0,
            minimo: rango.Minimo || 0,
            maximo: rango.Maximo || 0,
            idTipoCalculo: rango.IdTipoCalculo || null,
            idUnidadMedida: rango.IdUnidadMedida || null,
            tipoCalculo: rango.TipoCalculo || '',
            unidadMedida: rango.UnidadMedida || '',
        }))

        let viajesForaneos = data.ViajesForaneos.map(viaje => ({
            idViaje: viaje.IdViajeForaneo || getRandomId(),
            idOrigen: viaje.IdOrigen || null,
            idTipoMedida: viaje.IdTipoMedida || null,
            idDestino: viaje.IdDestino || null,
            fleteMinimo: viaje.fleteMinimo || 0,
            grupos: data.Grupos.filter(i => i.IdViajeForaneo === viaje.IdViajeForaneo).map(grupo => ({
                idGrupo: grupo.IdViajeForaneoGrupo || Math.floor(Math.random() * 10000),
                nombre: grupo.Referencia || '',
                zonas: data.Zonas.filter(i => i.IdViajeForaneoGrupo === grupo.IdViajeForaneoGrupo).map(j => ({
                    m_nIdZona: j.IdZonaOperativa,
                    m_sCodigoZona: j.CodigoZona
                })),
                rangos: data.Conceptos.filter(i => i.IdViajeForaneoGrupo === grupo.IdViajeForaneoGrupo).map(rango => ({
                    id: rango?.IdTarifaConcepto || Math.floor(Math.random() * 10000),
                    idConcepto: rango.IdConceptoFacturacion || null,
                    concepto: rango.ConceptoFacturacion || '',
                    importe: rango.Importe || 0,
                    minimo: rango.Minimo || 0,
                    maximo: rango.Maximo || 0,
                    idTipoCalculo: rango.IdTipoCalculo || null,
                    idUnidadMedida: rango.IdUnidadMedida || null,
                    tipoCalculo: rango.TipoCalculo || '',
                    unidadMedida: rango.UnidadMedida || '',
                    porcentaje: rango.Porcentaje || 0,
                })),
                productos: data.Productos.filter(i => i.IdViajeForaneoGrupo === grupo.IdViajeForaneoGrupo).map(j => ({
                    m_nIdProducto: j.IdProducto,
                    m_sDescripcion: j.Descripcion,
                    m_nNoProducto: j.NoProducto,
                    m_bActivo: j.Activo
                })),
            })),
        }))
        let tarifa = {
            idTarifa: data.IdTarifa,
            cliente: {
                m_nIdCliente: data.IdCliente,
                m_sNombreFiscal: data.Cliente
            },
            vigencia: data.Vigencia,
            cuotaMensual: data.CuotaMensual,
            viajesLocales: viajesLocales,
            maniobras: maniobras,
            viajesForaneos: viajesForaneos
        }

        return tarifa

    }
    const handleOnRequestZonasByDestino = (idDestino) => {
        obtenerListadoZonaOperativaByOrigenDestino(idDestino).then(respuesta => {
            setZonasListado(respuesta.data)
            setShowDialogZonas(true)
        })
    }

    function getCotizacionProducto(prod) {
        return new Promise((resolve) => {
            let params = {
                idOrigen: filtrosBusqueda.ciudadOrigen,
                idDestino: filtrosBusqueda.ciudadDestino,
                idEmbarque: 0,
                idRecoleccion: 0,
                idZonaEntrega: filtrosBusqueda.direccionOrigen.IdZona,
                idZonaRecoleccion: filtrosBusqueda.direccionDestino.IdZona,
                idCliente: 3140,
                entregaEnSucursal: 0,
                idSeguro: 5,
                valorDeclarado: 0,
                aplicaRecoleccion: 1,
                aplicaSeguro: 0,
                porcentajeSeguro: 0,
                recoleccionConCita: 0,
                embarqueConCita: 0,
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
            // setConceptosResult([...conceptosResult, data], resolve())
        })
    }

    async function handleCotizar() {

        try {
            await new Promise((resolve) => {
                setConceptosResult([], resolve());
            });
            filtrosProductos.forEach(async (prod) => {
                const llamarCotizacion = await getCotizacionProducto(prod);
            })
            setProductosCotizados(filtrosProductos)
            /*for (const prod of filtrosProductos) {
                console.log(prod)
                console.log(conceptosResult)
                const llamarCotizacion = await getCotizacionProducto(prod);
                // Process the result of getCotizacionProducto(prod) here
            }*/
        } catch (error) {
            console.error("Error:", error);
        }

        /*  const promise=await new Promise((resolve)=>{
              setConceptosResult([],resolve())
          })
          promise.then(()=> {
              for(const prod of filtrosProductos){
                  const llamarCotizacion= await getCotizacionProducto(prod)
              }
          })*/
        /*

        promise.then(()=>{
            for(const prod of filtrosProductos){
                const myPromise=new Promise((resolve)=>{
                    let params = {
                        idOrigen: filtrosBusqueda.ciudadOrigen,
                        idDestino: filtrosBusqueda.ciudadDestino,
                        idEmbarque: 0,
                        idRecoleccion: 0,
                        idZonaEntrega: filtrosBusqueda.direccionOrigen.IdZona,
                        idZonaRecoleccion: filtrosBusqueda.direccionDestino.IdZona,
                        idCliente: 3140,
                        entregaEnSucursal:  0,
                        idSeguro: 5,
                        valorDeclarado: 0,
                        aplicaRecoleccion: 1,
                        aplicaSeguro: 0,
                        porcentajeSeguro: 0,
                        recoleccionConCita: 0,
                        embarqueConCita: 0,
                        paquetesCotizacion: [{
                            tipo: 2,
                            peso: prod.desc.m_xPeso,
                            largo: prod.desc.m_xLargo,
                            ancho: prod.desc.m_xAncho,
                            alto: prod.desc.m_xAlto,
                            volumen: prod.desc.m_xLargo*prod.desc.m_xAncho*prod.desc.m_xAlto,
                            idTipoEmpaque: prod.desc.m_nIdEmbalaje,
                            activo: prod.desc.m_bActivo,
                            ctd: prod.cantidad,
                            idProducto: prod.desc.m_nIdProducto,
                        }]
                    }
                    obtenerCotizacionTarifario(params).then(({data})=>{
                        console.log(conceptosResult)
                        setConceptosResult([...conceptosResult,data],resolve())
                    })
                })
                myPromise.then(()=>console.log("sss"))

            }
        })
*/
        /* filtrosProductos.map(async (prod)=>{

         })*/

        /*  filtrosProductos.forEach((prod)=>{
              let params = {
                  idOrigen: filtrosBusqueda.ciudadOrigen,
                  idDestino: filtrosBusqueda.ciudadDestino,
                  idEmbarque: 0,
                  idRecoleccion: 0,
                  idZonaEntrega: filtrosBusqueda.direccionOrigen.IdZona,
                  idZonaRecoleccion: filtrosBusqueda.direccionDestino.IdZona,
                  idCliente: 3140,
                  entregaEnSucursal:  0,
                  idSeguro: 5,
                  valorDeclarado: 0,
                  aplicaRecoleccion: 1,
                  aplicaSeguro: 0,
                  porcentajeSeguro: 0,
                  recoleccionConCita: 0,
                  embarqueConCita: 0,
                  paquetesCotizacion: [{
                      tipo: 2,
                      peso: prod.desc.m_xPeso,
                      largo: prod.desc.m_xLargo,
                      ancho: prod.desc.m_xAncho,
                      alto: prod.desc.m_xAlto,
                      volumen: prod.desc.m_xLargo*prod.desc.m_xAncho*prod.desc.m_xAlto,
                      idTipoEmpaque: prod.desc.m_nIdEmbalaje,
                      activo: prod.desc.m_bActivo,
                      ctd: prod.cantidad,
                      idProducto: prod.desc.m_nIdProducto,
                  }]
              }
              obtenerCotizacionTarifario(params).then(({data})=>{
                  setConceptosResult([...conceptosResult,data])
              })
          })*/


    }

    function handleBuscar() {

        let localesRecoleccion
        let localesEntrega
        let foraneos
        const promisePrimeraMilla = new Promise((resolve, reject) => {
            localesRecoleccion = viajesLocalesListado.filter(v => (filtrosBusqueda.sucOrigen != -1 ? v.idSucursal == filtrosBusqueda.sucOrigen : true) && v.idConcepto == conceptosParamsConfig.IdConceptoRecoleccion)
            resolve(localesRecoleccion.filter(v => filtrosBusqueda.producto != null ? (v.productos.filter(prod => prod.m_nIdProducto == filtrosBusqueda.producto.m_nIdProducto).length > 0) : true))
        })
        promisePrimeraMilla.then((value) => setViajesPrimeraMilla(value))

        const promiseUltimaMilla = new Promise((resolve, reject) => {
            localesEntrega = viajesLocalesListado.filter(v => (filtrosBusqueda.sucDestino != -1 ? v.idSucursal == filtrosBusqueda.sucDestino : true) && v.idConcepto == conceptosParamsConfig.IdConceptoEntrega)
            resolve(localesEntrega.filter(v => filtrosBusqueda.producto != null ? (v.productos.filter(prod => prod.m_nIdProducto == filtrosBusqueda.producto.m_nIdProducto).length > 0) : true))
        })
        promiseUltimaMilla.then((value) => setViajesUltimaMilla(value))

        promisePrimeraMilla.then((value) => setViajesPrimeraMilla(value))

        const promiseMillaIntermedia = new Promise((resolve, reject) => {
            foraneos = viajesForaneosListado.filter(v => (filtrosBusqueda.ciudadOrigen != -1 ? v.idOrigen == filtrosBusqueda.ciudadOrigen : true) && (filtrosBusqueda.ciudadDestino != -1 ? v.idDestino == filtrosBusqueda.ciudadDestino : true))
            resolve(foraneos.filter(v => filtrosBusqueda.producto != null ? (v.grupos.filter(g => g.productos.filter(p => p.m_nIdProducto == filtrosBusqueda.producto.m_nIdProducto).length > 0).length > 0) : true))
        })
        promiseMillaIntermedia.then((value) => setViajesMillaIntermedia(value))

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
                        <Grid style={{marginLeft: '5%', marginTop: '5%', marginBottom: '5%'}} container spacing={3}>
                            <Grid item container spacing={3}>
                                <Grid item sm={12}>
                                    <h3>Origen</h3>
                                </Grid>
                                <Grid item sm={2}>
                                    <FormControl fullWidth variant='outlined' size='small'>
                                        <InputLabel
                                            id="sucLabel">Sucursal</InputLabel>
                                        <Select value={filtrosBusqueda.sucOrigen} onChange={(e) => {
                                            let valorOrigen = listadoColoniasCPs.find(cp => cp.IdSucursal == e.target.value)?.IdOrigenDestino
                                            setFiltrosBusqueda({
                                                ...filtrosBusqueda,
                                                sucOrigen: e.target.value,
                                                ciudadOrigen: valorOrigen ? valorOrigen : -1
                                            })
                                        }}
                                                labelId='sucLabel' label=''>
                                            <MenuItem value={-1}>{'TODAS'}</MenuItem>
                                            {sucursalesListado.map(suc => {
                                                return <MenuItem value={suc.m_nIdSucursal}>{suc.m_sSucursal}</MenuItem>
                                            })}
                                        </Select>
                                    </FormControl>

                                </Grid>
                                <Grid item sm={2}>
                                    <Autocomplete
                                        size='small'
                                        freeSolo
                                        value={filtrosBusqueda.direccionOrigen}
                                        onChange={(e, newValue) => {
                                            setFiltrosBusqueda({
                                                ...filtrosBusqueda,
                                                direccionOrigen: newValue,
                                                sucOrigen: newValue != null ? newValue.IdSucursal : -1,
                                                ciudadOrigen: newValue != null ? newValue.IdOrigenDestino : -1
                                            })
                                        }}
                                        disableClearable
                                        forcePopupIcon={false}
                                        options={listadoColoniasCPs}
                                        getOptionLabel={(option) =>
                                            `${option.CodigoPostal} - ${option.Colonia}`
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
                                            <MenuItem value={-1}>{'TODOS'}</MenuItem>
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
                                                    let valorDestino = listadoColoniasCPs.find(cp => cp.IdSucursal == e.target.value)?.IdOrigenDestino
                                                    setFiltrosBusqueda({
                                                        ...filtrosBusqueda,
                                                        sucDestino: e.target.value,
                                                        ciudadDestino: valorDestino ? valorDestino : -1
                                                    })
                                                }}
                                                labelId='sucLabel' label=''>
                                            <MenuItem value={-1}>{'TODAS'}</MenuItem>
                                            {sucursalesListado.map(suc => {
                                                return <MenuItem value={suc.m_nIdSucursal}>{suc.m_sSucursal}</MenuItem>
                                            })}
                                        </Select>
                                    </FormControl>
                                </Grid>
                                <Grid item sm={2}>
                                    <Autocomplete
                                        freeSolo
                                        size='small'
                                        value={filtrosBusqueda.direccionDestino}
                                        onChange={(e, newValue) => {
                                            setFiltrosBusqueda({
                                                ...filtrosBusqueda,
                                                direccionDestino: newValue,
                                                sucDestino: newValue != null ? newValue.IdSucursal : -1,
                                                ciudadDestino: newValue != null ? newValue.IdOrigenDestino : -1
                                            })
                                        }}
                                        forcePopupIcon={false}
                                        options={listadoColoniasCPs}
                                        getOptionLabel={(option) =>
                                            option.CodigoPostal + ' - ' + option.Colonia
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
                                            <MenuItem value={-1}>{'TODOS'}</MenuItem>
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
                                                                freeSolo
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
                                                                    //setFiltrosProductos(newArr)
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
                                                                               setFiltrosProductos(updatedArr);
                                                                           })
                                                                           myPromise.then((v) => setFiltrosProductos(v))
                                                                       }}
                                                                       value={p?.cantidad}>

                                                            </TextField>
                                                        </Grid>
                                                        <Grid item sm={1}>
                                                            <TextField label={"Largo"} type='number' size={'small'}
                                                                       disabled={p.desc?.m_nIdProducto != 1}
                                                                       onChange={(e) => {
                                                                           const myPromise = new Promise((resolve) => {
                                                                               const updatedArr = [...filtrosProductos];
                                                                               updatedArr[index].desc.m_xLargo = e.target.value;
                                                                               setFiltrosProductos(updatedArr);
                                                                           })
                                                                           myPromise.then((v) => setFiltrosProductos(v))
                                                                       }}
                                                                       value={p.desc?.m_xLargo}></TextField>
                                                        </Grid>
                                                        <Grid item sm={1}>
                                                            <TextField label={"Alto"} type='number' size={'small'}
                                                                       disabled={p.desc?.m_nIdProducto != 1}
                                                                       onChange={(e) => {
                                                                           const myPromise = new Promise((resolve) => {
                                                                               const updatedArr = [...filtrosProductos];
                                                                               updatedArr[index].desc.m_xAlto = e.target.value;
                                                                               setFiltrosProductos(updatedArr);
                                                                           })
                                                                           myPromise.then((v) => setFiltrosProductos(v))
                                                                       }}
                                                                       value={p.desc?.m_xAlto}></TextField>
                                                        </Grid>
                                                        <Grid item sm={1}>
                                                            <TextField label={"Ancho"} type='number' size={'small'}
                                                                       disabled={p.desc?.m_nIdProducto != 1}
                                                                       onChange={(e) => {
                                                                           const myPromise = new Promise((resolve) => {
                                                                               const updatedArr = [...filtrosProductos];
                                                                               updatedArr[index].desc.m_xAncho = e.target.value;
                                                                               setFiltrosProductos(updatedArr);
                                                                           })
                                                                           myPromise.then((v) => setFiltrosProductos(v))
                                                                       }}
                                                                       value={p.desc?.m_xAncho}></TextField>
                                                        </Grid>
                                                        <Grid item sm={1}>
                                                            <TextField label={"Peso"} type='number' size={'small'}
                                                                       disabled={p.desc?.m_nIdProducto != 1}
                                                                       onChange={(e)=>{
                                                                           const myPromise=new Promise((resolve)=>{
                                                                               const updatedArr = [...filtrosProductos];
                                                                               updatedArr[index].desc.m_xPeso = e.target.value;
                                                                               setFiltrosProductos(updatedArr);
                                                                           })
                                                                           myPromise.then((v)=>setFiltrosProductos(v))
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
                                <Grid item sm={12}>
                                    <h3>Conceptos</h3>
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
                                                conceptosResult.length > 0 &&
                                                <Grid item sm={7}>
                                                    <h5 style={{textAlign: "left"}}>MANIOBRAS DE RECOLECCIÓN</h5>
                                                </Grid>
                                            }
                                            {
                                                conceptosResult.length > 0 &&

                                                //conceptosResult.filter((c)=>c.IdConceptoRecoleccion==conceptosParamsConfig.IdConceptoRecoleccion).map((c,index)=>{
                                                conceptosResult.sort(function(a, b){return a.index - b.index}).map((c, index) => {
                                                    let concepto = c.find((c) => c.m_nIdConceptosFacturacion == conceptosParamsConfig.IdConceptoRecoleccion)
                                                    console.log(c)
                                                    console.log(c.find((comp) => comp.m_nIdConceptosFacturacion == conceptosParamsConfig.IdConceptoRecoleccion))
                                                    if (concepto.m_bError)
                                                        return (
                                                            <Grid style={{textAlign: "center"}} item container sm={12}
                                                                  spacing={1}>
                                                                <Grid item sm={12}>
                                                                    <h5 style={{textAlign: "right"}}>{productosCotizados[index].desc.m_sDescripcion}</h5>
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
                                                                    <h5 style={{textAlign: "right"}}>{productosCotizados[index].desc.m_sDescripcion}</h5>
                                                                </Grid>
                                                                <Grid item sm={2}>
                                                                    Tipo Medida
                                                                </Grid>
                                                                <Grid item sm={2}>
                                                                    Rango
                                                                </Grid>
                                                                <Grid item sm={2}>
                                                                    Importe
                                                                </Grid>
                                                                <Grid item sm={1}>
                                                                    IVA
                                                                </Grid>
                                                                <Grid item sm={1}>
                                                                    Retiene
                                                                </Grid>
                                                                <Grid item sm={2}>
                                                                    Cálculo
                                                                </Grid>
                                                                <Grid item sm={2}>
                                                                    Total
                                                                </Grid>
                                                                <Grid item style={{"font-weight":"normal"}} sm={2}>
                                                                    Tipo Medida
                                                                </Grid>
                                                                <Grid item style={{"font-weight":"normal"}} sm={2}>
                                                                    {concepto.rangoMin} - {concepto.rangoMax}
                                                                </Grid>
                                                                <Grid item style={{"font-weight":"normal"}} sm={2}>
                                                                    ${concepto.m_cImporte}
                                                                </Grid>
                                                                <Grid item style={{"font-weight":"normal"}} sm={1}>
                                                                    ${concepto.m_cImporteIva}
                                                                </Grid>
                                                                <Grid item style={{"font-weight":"normal"}} sm={1}>
                                                                    ${concepto.m_cImporteRetiene}
                                                                </Grid>
                                                                <Grid item style={{"font-weight":"normal"}} sm={2}>
                                                                    {tiposCalculoListado.find((t) => t.m_nIdTarifaTipoCalculo == concepto.m_nIdTipoCalculo).m_sTarifaTipoCalculo}
                                                                </Grid>
                                                                <Grid item style={{"font-weight":"normal"}} sm={2}>
                                                                    ${concepto.m_cImporte - concepto.m_cImporteRetiene + concepto.m_cImporteIva}
                                                                </Grid>
                                                                <Grid item sm={12}>
                                                                    <hr style={{color:"black",height:1,backgroundColor:"black"}}></hr>
                                                                </Grid>
                                                            </Grid>
                                                        )
                                                })
                                            }

                                            {/*
                                                conceptosResult.length>0 &&
                                                !conceptosResult[1].m_bError && (
                                                    <Grid style={{textAlign:"center"}} item container sm={12} spacing={1}>
                                                        <Grid item sm={12}>
                                                            <h5 style={{textAlign:"left"}}>{conceptosResult[1].m_sConcepto}</h5>
                                                        </Grid>
                                                        <Grid item sm={3}>
                                                            Tipo Medida
                                                        </Grid>
                                                        <Grid item sm={3}>
                                                            Rango
                                                        </Grid>
                                                        <Grid item sm={2}>
                                                            Importe
                                                        </Grid>
                                                        <Grid item sm={2}>
                                                            Cálculo
                                                        </Grid>
                                                        <Grid item sm={2}>
                                                            Total
                                                        </Grid>
                                                        <Grid item sm={3}>
                                                            Tipo Medida
                                                        </Grid>
                                                        <Grid item sm={3}>
                                                            {conceptosResult[1].rangoMin} - {conceptosResult[1].rangoMax}
                                                        </Grid>
                                                        <Grid item sm={2}>
                                                            Importe
                                                        </Grid>
                                                        <Grid item sm={2}>
                                                            Cálculo
                                                        </Grid>
                                                        <Grid item sm={2}>
                                                            Total
                                                        </Grid>
                                                    </Grid>
                                                )*/
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
                                    <Button onClick={() => console.log(conceptosResult)}>PRUEBA</Button>
                                    <div className='UM hide'>
                                        {

                                        }
                                    </div>
                                </Paper>

                            </Grid>

                            <Grid item container spacing={1}>
                                <Grid item sm={7}>
                                    <h3 style={{fontSize: '24px'}}>Tarifas</h3>
                                </Grid>
                                <Grid item sm={3}>
                                    <Button onClick={() => handleCotizar()} fullWidth
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
                                        <Button onClick={() => console.log(filtrosProductos)}>PRUEBA</Button>
                                        <div className='PM hide'>
                                            {
                                                viajesPrimeraMilla.map((viaje) =>
                                                    <ViajeLocal
                                                        key={viaje.idViaje}
                                                        viaje={viaje}
                                                        sucursalesListado={sucursalesListado}
                                                        handleChangeViajeLocal={() => {
                                                        }}
                                                        conceptosListado={conceptosListado.filter(concepto => esConceptoViajeLocal(concepto))}
                                                        tiposCalculoListado={tiposCalculoListado}
                                                        unidadesMedidaListado={filtrarUnidadesMedidaViajeLocal}
                                                        handleDeleteViajeLocal={() => {
                                                        }}
                                                        zonasListado={zonasListado}
                                                        onRequestZonasBySucursal={handleOnRequestZonasBySucursal}
                                                        productosListado={filtrarProductosViajeLocal(viaje)}
                                                        disabled={true}
                                                        showDialogZonas={showDialogZonas}
                                                        handleShowDialogZonas={handleShowDialogZonas}
                                                    />
                                                )
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
                                        <Button onClick={() => console.log(filtrosBusqueda)}>PRUEBA</Button>
                                        <div className='UM hide'>
                                            {
                                                viajesUltimaMilla.map((viaje) =>
                                                    <ViajeLocal
                                                        key={viaje.idViaje}
                                                        viaje={viaje}
                                                        sucursalesListado={sucursalesListado}
                                                        handleChangeViajeLocal={() => {
                                                        }}
                                                        conceptosListado={conceptosListado.filter(concepto => esConceptoViajeLocal(concepto))}
                                                        tiposCalculoListado={tiposCalculoListado}
                                                        unidadesMedidaListado={filtrarUnidadesMedidaViajeLocal}
                                                        handleDeleteViajeLocal={() => {
                                                        }}
                                                        zonasListado={zonasListado}
                                                        onRequestZonasBySucursal={handleOnRequestZonasBySucursal}
                                                        productosListado={filtrarProductosViajeLocal(viaje)}
                                                        disabled={true}
                                                        showDialogZonas={showDialogZonas}
                                                        handleShowDialogZonas={handleShowDialogZonas}
                                                    />
                                                )
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
                                        <Button onClick={() => console.log(viajesForaneosListado)}>PRUEBA</Button>
                                        <div className='MM hide'>
                                            {
                                                viajesMillaIntermedia.map((viaje) =>
                                                    <ViajeForaneo
                                                        key={viaje.idViaje}
                                                        viaje={viaje}
                                                        origenesDestinosListado={origenesDestinosListado}
                                                        handleChangeViajeForaneo={handleChangeViajeForaneo}
                                                        tiposCalculoListado={tiposCalculoListado}
                                                        unidadesMedidaListado={unidadesMedidaListado}
                                                        handleDeleteViajeForaneo={() => {
                                                        }}
                                                        zonasListado={zonasListado}
                                                        onRequestZonasByDestino={handleOnRequestZonasByDestino}
                                                        productosListado={productosListado}
                                                        disabled={true}
                                                        showDialogZonas={showDialogZonas}
                                                        handleShowDialogZonas={handleShowDialogZonas}
                                                    />
                                                )
                                            }
                                        </div>
                                    </Paper>

                                </Grid>
                            </Grid>
                        </Grid>


                    </div>
                </div>
            </section>
        </div>
    )
}

export default BuscarTarifa;