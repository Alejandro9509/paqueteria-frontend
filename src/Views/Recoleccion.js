import React, {useEffect, useState, useMemo, useCallback} from "react";
import axios from "axios";
import Cabecera from "../Components/Template/Cabecera";
import BarraLateralIzquierda from "../Components/Template/BarraLateralIzquierda";
import BarraLateralDerecha from "../Components/Template/BarraLateralDerecha";
import ExportCSV from "../Components/Template/Export";
import ExportPDF from "../Components/Template/ExportPDF";
import Carousel from "re-carousel";
import IndicatorDots from "../Util/Dots";
import Buttons from "../Util/CarruselButtons";
import {makeStyles} from "@material-ui/core/styles";
import * as XLSX from "xlsx";
import useModal from "react-hooks-use-modal";
import IconButton from "@material-ui/core/IconButton";
import SearchIcon from "@material-ui/icons/Search";
import PageviewIcon from "@material-ui/icons/Pageview";
import Autocomplete from "@material-ui/lab/Autocomplete";
import TextField from "@material-ui/core/TextField";
import {GridOverlay, DataGrid} from '@material-ui/data-grid';
import InputAdornment from "@material-ui/core/InputAdornment";
import LinearProgress from '@material-ui/core/LinearProgress';
import SvgIcon from "@material-ui/core/SvgIcon";
import {ReactComponent as Activo} from "../iconos/Menu/palomita.svg";
import {ReactComponent as NoActivo} from "../iconos/Menu/cruz.svg";
import {
    useTable,
    useFilters,
    useAsyncDebounce,
    useSortBy,
} from "react-table";
import $ from "jquery";
import {remove_array_element} from "../Util/Util";
import {useHistory, Redirect} from 'react-router-dom';

import Noty from 'noty';
import {
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    FormControl,
    FormControlLabel,
    InputLabel,
    Select
} from "@material-ui/core";

let timer;

function showSuccess(mensaje) {
    new Noty({
        type: "information",
        layout: "topCenter",
        text: mensaje,
        timeout: "3000"
    }).show()
}

window.jQuery = window.$ = $;

const useStyles = makeStyles({
    myComponent: {
        "& .MuiIconButton-root": {
            padding: 0,
        },
    },
    paqueteCarrusel: {
        height: "230px !important",
    },
    sobreCarrusel: {
        height: "70px !important",
    }, seleccionado: {
        backgroundColor: "#FCC88F",
    },
    noSeleccionado: {
        backgroundColor: "#FFFFFF",
    },
    disabled: {
        pointerEvents: "none",
        cursor: "default",
    }
});

function Recoleccion() {
    const today = new Date();
    const classes = useStyles();
    const [redirect, setRedirect] = React.useState(false);
    const [data, setData] = React.useState([]);
    const [dataSucursal, setDataSucursal] = React.useState([]);
    const [dataEstatusRecoleccion, setEstatusRecoleccion] = React.useState([]);
    const [dataTipoMoneda, setDataTipoMoneda] = React.useState([]);
    const [dataTipoCambio, setDataTipoCambio] = React.useState([]);
    const [dataTipoCobro, setDataTipoCobro] = React.useState([]);
    const [dataCiudad, setDataCiudad] = React.useState([]);
    const [dataZona, setDataZona] = React.useState([]);
    const [dataFolioRecoleccion, SetDataFolioRecoleccion] = React.useState([]);

    const [dataCodigoPostal, setDataCodigoPostal] = React.useState([]);
    
    const [dataRemitenteDestinatario, setDataRemitenteDestinatario] = React.useState([]);
    const [dataEmbalaje, setDataEmbalaje] = React.useState([]);
    const [dataOperador, setDataOperador] = React.useState([]);
    const [dataTipoUnidad, setDataTipoUnidad] = React.useState([]);
    const [dataUnidad, setDataUnidad] = React.useState([]);
    const [state, setState] = React.useState({
        nombreRemitente: {},
        nombreDestinatario: {},

        shouldOpenList: false,
        showPopUp: false,
        showDialog: false,
        identificadorModal: "",
        tipoModal: 0,
        DerechoBorrar: 133,
        agregar: "Agregar",
        idRecoleccion: 0,
        fechaInicial: "0",
        fechaFinal: (today.getMonth() + 1) + "-" + today.getDate() + "-" + today.getFullYear(),
        sucursalListado: 0,
        estatusListado: 0,
        idSucursalAgregar: localStorage.getItem("Sucursal"),
        folioRecoleccion: "",
        folioEmbarque: "",
        folioGuía: "",
        folioInforme: "",
        fechaHoraCreacion: "",
        fechaHoraRegistro: "",
        estatusRecoleccion: 0,
        moneda: "",
        tipoCambio: "",
        tipoCobro: "",
        countSobres: 1,
        countPaquetes: 1,
        RFCRemitente: "",
        domicilioRemitente: "",
        codigoPostalRemitente: {},
        ciudadRemitente: 0,
        correoRemitente: "",
        telefonoRemitente: "",
        contactoRemitente: "",
        origenRemitente: 0,
        RFCDestinatario: "",
        domicilioDestinatario: "",
        codigoPostalDestinatario: 0,
        ciudadDestinatario: 0,
        correoDestinatario: "",
        telefonoDestinatario: "",
        contactoDestinatario: "",
        destinoDestinatario: 0,
        fechaRecoleccion: "",
        codigoPostalRecoleccion: 0,
        ciudadRecoleccion: 0,
        zonaRecoleccion: 0,
        domicilioRecoleccion: "",
        recogerEn: "",
        datosAdicionalesRecoleccion: "",
        codigoPostalEntrega: "",
        ciudadEntrega: 0,
        zonaEntrega: 0,
        domicilioEntrega: "",
        entregaEn: "",
        datosAdicionalesEntrega: "",
        cantidadDePaquetes: 0,
        cantidadDeSobres: 0,
        diferenteRecoleccion: true,
        diferenteEntrega: true,
        operador: 0,
        tipoUnidad: {},
        unidad: 0,
        CreadoPor: parseInt(localStorage.getItem("UsuarioId")),
        ModificadoPor: parseInt(localStorage.getItem("UsuarioId")),
        mismoPaquete: false,
        mismoSobre: false,
        paquetes: [
            {
                m_rPeso: "",
                m_rLargo: "",
                m_rAncho: "",
                m_rAlto: "",
                m_rVolumen: "",
                m_nIdTipoEmbalaje: "",
                m_cyValorDeclarado: "",
                m_sDescripcion: "",
                m_nCantidad: "",
                m_sObservaciones: "",
            },
        ],
        sobres: [
            {
                m_sDescripcion: "",
            },
        ],
        fechaHoraSalida: "",
        fechaHoraLlegada: "",

        //Cancelacion
        sucursalCancelacion: "",
        motivoCancelacion: "",
        fechaCancelacion: "",
        mostraFechaCancelacion: "",

        uploadedFileContent: "<div>Hello</div>",

        usuario: localStorage.getItem("Usuario"),
        height: window.innerHeight,
    });
    const [fileUploaded, setFileUploaded] = React.useState([]);
    const [selectedFile, setSelectedFile] = useState();
    const [isFilePicked, setIsFilePicked] = useState(false);
    const [stepActive, setStepActive] = React.useState(1);
    const [Modal, open, close, isOpen] = useModal("root", {
        preventScroll: true,
    });

    const history = useHistory()

    function CustomLoadingOverlay() {
        return (
            <GridOverlay>
                <div style={{position: 'absolute', top: 0, width: '100%'}}>
                    <LinearProgress/>
                </div>
            </GridOverlay>
        );
    }

    function handleSelectRemitente(newValue) {

        setState({
            ...state,
            nombreRemitente: newValue,
            RFCRemitente: newValue.m_sRFC,
            domicilioRemitente: newValue.m_sDomicilio,

            codigoPostalRemitente: dataCodigoPostal.find(
                (o) => o.m_nIdCodigoPostal == newValue.m_nIdCodigoPostal
            ),


            correoRemitente: newValue.m_sCorreoElectronico,
            telefonoRemitente: newValue.m_sTelefono,
            contactoRemitente: newValue.m_sContacto,
        })

    }

    useEffect(value => {
        if (state.mismoPaquete) {
            var array = state.paquetes
            for (var i in array) {
                array[i] = state.paquetes[0];
            }
            setState({...state, paquetes: array})
        }
    }, [state.mismoPaquete])

    useEffect(value => {
        if (state.mismoSobre) {
            var array = state.sobres
            for (var i in array) {
                array[i] = state.sobres[0];
            }
            setState({...state, sobres: array})
        }
    }, [state.mismoSobre])

    function handleSelectDestinatario(newValue) {

        setState({
            ...state,
            nombreDestinatario: newValue,
            RFCDestinatario: newValue.m_sRFC,
            domicilioDestinatario: newValue.m_sDomicilio,

            codigoPostalDestinatario: dataCodigoPostal.find(
                (o) => o.m_nIdCodigoPostal == newValue.m_nIdCodigoPostal
            ),


            correoDestinatario: newValue.m_sCorreoElectronico,
            telefonoDestinatario: newValue.m_sTelefono,
            contactoDestinatario: newValue.m_sContacto,
        })


    }

    const handleAceptar = (e) => {
        e.preventDefault();
        var params = {

            "m_nIdRecoleccion": state.idRecoleccion,
            "m_nIdSucursal": state.idSucursalAgregar,
            "m_nIdEstatusRecoleccion": state.estatusRecoleccion,
            "m_nIdEmbarque": state.folioEmbarque,
            "m_nIdGuia": state.folioGuía,
            "m_nIdInforme": state.folioInforme,
            "m_dFecha": state.fechaHoraCreacion.split("T")[0],
            "m_tHora": state.fechaHoraCreacion.split("T")[1],

            "m_dFechaRegistro": state.fechaHoraRegistro.split("T")[0],
            "m_tHoraRegistro": state.fechaHoraRegistro.split("T")[1],
            "m_nMoneda": state.moneda,
            "m_rTipoCambio": state.tipoCambio,
            "m_nIdTipoDeCobro": state.tipoCobro,
            "m_sNombreRemitente": state.nombreRemitente.m_sNombreFiscal,
            "m_sNombreDestinatario": state.nombreDestinatario.m_sNombreFiscal,
            "m_sRFCRemitente": state.RFCRemitente,
            "m_sRFCDestinatario": state.RFCDestinatario,
            "m_sDomicilioRemitente": state.domicilioRemitente,
            "m_sDomicilioDestinatario": state.domicilioDestinatario,
            "m_sIdCodigoPostalRemitente": state.codigoPostalRemitente.m_nIdCP,
            "m_sIdCodigoPostalDestinatario": state.codigoPostalDestinatario.m_nIdCP,
            "m_nIdCiudadRemitente": state.ciudadRemitente.m_nIdCiudad,
            "m_nIdCiudadDestinatario": state.ciudadDestinatario.m_nIdCiudad,
            "m_sCorreoRemitente": state.correoRemitente,
            "m_sCorreoDestinatario": state.correoDestinatario,
            "m_sTelefonoRemitente": state.telefonoRemitente,
            "m_sTelefonoDestinatario": state.telefonoDestinatario,
            "m_sContactoRemitente": state.contactoRemitente,
            "m_sContactoDestinatario": state.contactoDestinatario,
            "m_nIdCiudadOrigen": state.origenRemitente.m_nIdCiudad,
            "m_nIdCiudadDestino": state.destinoDestinatario.m_nIdCiudad,
            "m_dFechaDetalleRecoleccion": state.fechaRecoleccion.split("T")[0],
            "m_tHoraDetalleRecoleccion": state.fechaRecoleccion.split("T")[1],
            "m_nIdCPDetalleRecoleccion": state.codigoPostalRecoleccion.m_nIdCP,
            "m_nIdCiudadDetalleRecoleccion": state.ciudadRecoleccion,
            "m_nIdZonaDetalleRecoleccion": state.zonaRecoleccion,
            "m_sDomicilioDetalleRecoleccion": state.domicilioRecoleccion,
            "m_sRecogerEnDetalleRecoleccion": state.recogerEn,
            "m_sDatosAdicionalesDetalleRecoleccion": state.datosAdicionalesRecoleccion,
            "m_nIdCPDetalleEntrega": state.codigoPostalEntrega.m_nIdCP,
            "m_nIdCiudadDetalleEntrega": state.ciudadEntrega,
            "m_nIdZonaDetalleEntrega": state.zonaEntrega,
            "m_sDomicilioDetalleEntrega": state.domicilioEntrega,
            "m_sEntregarEnDetalleEntrega": state.entregaEn,
            "m_sDatosAdicionalesDetalleEntrega": state.datosAdicionalesEntrega,
            "m_dFechaSalida": state.fechaHoraSalida.split("T")[0],
            "m_dFechaLlegada": state.fechaHoraLlegada.split("T")[0],
            "m_tHoraSalida": state.fechaHoraSalida.split("T")[1],
            "m_tHoraLlegada": state.fechaHoraLlegada.split("T")[1],
            "m_parrPaquetes": state.paquetes,
            "m_nNoPaquetes": state.paquetes.length,
            "m_parrSobres": state.sobres,
            "m_nNoSobres": state.sobres.length,
            "m_nIdOperador": state.operador.m_nIdOperador,
            "m_nIdUnidad": state.unidad.m_nIdUnidad,
            "m_nIdRemolque": state.unidad.m_nIdUnidad,
            "m_nCreadoPor": state.CreadoPor,
            "m_nModificadoPor": state.ModificadoPor

        }
        console.log(JSON.stringify(params));
        debugger;
        if (state.idRecoleccion != 0) {
            const url = `${process.env.REACT_APP_API_URL}/Recoleccion/Modificar/${state.idRecoleccion}`;
            axios
                .put(url, Object.assign({}, params), {headers})
                .then((respuesta) => {
                    showSuccess(respuesta.data);
                    getAllData();
                })
                .catch((err) => {
                    console.log(err);
                    showSuccess("err");
                });
        } else {
            //debugger;
            const url = `${process.env.REACT_APP_API_URL}/Recoleccion/Agregar`;
            axios
                .post(url, Object.assign({}, params), {headers})
                .then((respuesta) => {
                    console.log(respuesta.data);
                    showSuccess(respuesta.data);
                    getAllData();
                })
                .catch((err) => {
                    console.log(err);
                    showSuccess(err);
                });
        }
    };

    function getTipoCambio() {
        const url = `${process.env.REACT_APP_API_URL}/TipoCambio/GetListado`;
        axios.get(url, {headers}).then(respuesta => {
            setDataTipoCambio(respuesta.data)
        });
    };

    function handleSelectCP(id, dobleClick, e) {
        clearTimeout(timer);
        if (e.detail === 1) {
            timer = setTimeout(() => {
                setState({
                    ...state,
                    [state.identificadorModal]: id,
                    openDialog: true
                })
            }, 200)
        } else if (e.detail === 2) {
            setState({
                ...state,
                [state.identificadorModal]: id,
                openDialog: false
            });
        }

        console.log(dobleClick);
    }

    function handleShowCancelar() {
        var hours = today.getHours();
        var mostrarHora = today.getHours();
        var minutes = today.getMinutes();
        var ampm = hours >= 12 ? 'pm' : 'am';
        hours = hours % 12;
        hours = hours ? hours : 12; // the hour '0' should be '12'
        minutes = minutes < 10 ? '0' + minutes : minutes;
        var strTime = hours + ':' + minutes + ' ' + ampm;
        const url = `${process.env.REACT_APP_API_URL}/Recoleccion/GetCancelarById/${state.idRecoleccion}`;
        axios.get(url, {headers}).then((respuesta) => {
            setState({
                ...state,
                folioRecoleccion: respuesta.data.m_sFolioRecoleccion,
                sucursalCancelacion: dataSucursal.find(o => o.m_nIdSucursal == respuesta.data.m_nIdSucursal).m_sSucursal,
                fechaCancelacion: respuesta.data.m_nIdEstatusRecoleccion == "0" ? respuesta.data.m_dtFechaCancelacion :
                    today.getFullYear() + "-" + (today.getMonth() + 1) + "-" + today.getDate() + " " + mostrarHora + ":" + minutes,
                mostrarFechaCancelacion: respuesta.data.m_nIdEstatusRecoleccion == "0" ? respuesta.data.m_dtFechaCancelacion :
                    today.getDate() + "/" + (today.getMonth() + 1) + "/" + today.getFullYear() + " " + strTime,
                estatusRecoleccion: dataEstatusRecoleccion.find(o => o.m_nIdEstatusRecoleccion == respuesta.data.m_nIdEstatusRecoleccion).m_sEstatus,
                motivoCancelacion: respuesta.data.m_sMotivoCancelacion
            })
            console.log(respuesta.data)
            if (respuesta.data.m_nSePuedeCancelar == 0)
                showSuccess("Recolección no se puede cancelar")
        })
    }

    const handleCancelar = (e) => {
        e.preventDefault();
        var params = {
            "motivoCancelacion": state.motivoCancelacion,
            "usuarioCancelacion": localStorage.getItem("UsuarioId"),
            "fechaCancelacion": state.fechaCancelacion
        }
        const url = `${process.env.REACT_APP_API_URL}/Recoleccion/Cancelar/${state.idRecoleccion}`;
        axios.put(url, Object.assign({}, params), {headers}).then((respuesta) => {
            showSuccess(respuesta.data)
        })
    }

    const changeHandler = (event) => {
        event.preventDefault();
        setSelectedFile(event.target.files[0]);
        setIsFilePicked(true);
    };

    function handleSubmission() {
        console.log(selectedFile)
        var reader = new FileReader();
        reader.onload = function () {
            console.log(reader.result)
        }.bind(this);
        reader.readAsText(selectedFile);
        setState({
            ...setState,
            uploadedFileContent: "reader.result"
        })
    };

    function addPaquete() {
        const {paquetes} = state;
        paquetes.push({
            m_xPeso: "",
            m_xLargo: "",
            m_xAncho: "",
            m_xAlto: "",
            m_xVolumen: "",
            m_nIdTIpoEmpaque: "",
            m_cValorDeclarado: "",
            m_sDescripcion: "",
            ctd: "",
            m_nTipo: 2,
            m_sObservaciones: "",
        });
        console.log(paquetes);
        setState({...state, paquetes: paquetes, countPaquetes: state.countPaquetes + 1});
    }

    function removePaquete(index) {
        var {paquetes} = state;
        if (paquetes.length !== 1) {
            paquetes.pop()
            setState({...state, paquetes: paquetes, countPaquetes: state.countPaquetes - 1});
        }

    }

    function addSobre() {
        const {sobres} = state;
        sobres.push({
            descripcion: "",
        });
        console.log(sobres);
        setState({...state, sobres: sobres, countSobres: state.countSobres + 1});
    }

    function removeSobre(index) {
        var {sobres} = state;
        if (sobres.length !== 1) {
            sobres.pop()
            setState({...state, sobres: sobres, countSobres: state.countSobres - 1});
        }
    }

    function handleEliminar(id) {
        var derecho;
        const urlDelete = `${process.env.REACT_APP_API_URL}/Utilerias/ValidaDerechos/${state.CreadoPor}/${state.DerechoBorrar}/3`;
        axios
            .get(urlDelete, {headers})
            .then((respuesta) => {
                //showSuccess(respuesta.data)

                derecho = respuesta.data;
                if (derecho == false) {
                    showSuccess("El usuario no tiene derechos para realizar el proceso");
                    return;
                }

                const url =
                    `${process.env.REACT_APP_API_URL}/Recoleccion/Eliminar/` + id;
                axios
                    .delete(url, {headers})
                    .then((respuesta) => {
                        showSuccess(respuesta.data);
                        getAllData();
                    })
                    .catch((err) => {
                        showSuccess(err);
                    });
            })
            .catch((err) => {
                showSuccess(err);
            });
    }

    function handleShowCiudadRemitente(id) {
        console.log(id);
        const url = `${process.env.REACT_APP_API_URL}/Ciudades/GetByCP/${id}`;
        axios.get(url, {headers}).then((respuesta) => {
            console.log(respuesta.data);
            setState({
                ...state,
                //ciudadRemitente: respuesta.data.m_nIdCiudad
                ciudadRemitente: dataCiudad.find(
                    (o) => o.m_nIdCiudad == respuesta.data.m_nIdCiudad
                ),
            });
        });
    }

    function handleShowModificar(id) {
        $('.nav-tabs li ').removeClass('active');
        $('.nav-tabs li').eq(1).addClass('active');
        console.log(id);
        const url = `${process.env.REACT_APP_API_URL}/Recoleccion/GetById/${id}`;
        axios.get(url, {headers}).then((respuesta) => {
            console.log(respuesta.data);
            debugger;
            setState({
                ...state,
                agregar: "Modificar",
                idRecoleccion: id,
                idSucursalAgregar: respuesta.data.m_nIdSucursal,
                folioRecoleccion: respuesta.data.m_sFolioRecoleccion,
                folioEmbarque: respuesta.data.m_nIdEmbarque,
                folioGuía: respuesta.data.m_nIdGuia,
                folioInforme: respuesta.data.m_nIdInforme,
                fechaHoraCreacion:
                    respuesta.data.m_dFecha + "T" + respuesta.data.m_tHora.slice(0, 5),
                estatusRecoleccion: respuesta.data.m_nIdEstatusRecoleccion,
                moneda: respuesta.data.m_nMoneda,
                tipoCambio: respuesta.data.m_rTipoCambio,
                tipoCobro: respuesta.data.m_nIdTipoDeCobro,
                nombreRemitente: dataRemitenteDestinatario.find((o) => o.m_sRFC == respuesta.data.m_sRFCRemitente),
                RFCRemitente: respuesta.data.m_sRFCRemitente,
                domicilioRemitente: respuesta.data.m_sDomicilioRemitente,
                codigoPostalRemitente: dataCodigoPostal.find(
                    (o) => o.m_nIdCP == respuesta.data.m_sIdCodigoPostalRemitente
                ),
                ciudadRemitente: dataCiudad.find(
                    (o) => o.m_nIdCiudad == respuesta.data.m_nIdCiudadRemitente
                ),
                correoRemitente: respuesta.data.m_sCorreoRemitente,
                telefonoRemitente: respuesta.data.m_sTelefonoRemitente,
                contactoRemitente: respuesta.data.m_sContactoRemitente,
                origenRemitente: dataCiudad.find(
                    (o) => o.m_nIdCiudad == respuesta.data.m_nIdCiudadOrigen
                ),
                nombreDestinatario: dataRemitenteDestinatario.find((o) => o.m_sRFC == respuesta.data.m_sRFCDestinatario),
                RFCDestinatario: respuesta.data.m_sRFCDestinatario,
                domicilioDestinatario: respuesta.data.m_sDomicilioDestinatario,
                //ERROR PORQUE NO HAY UNIDAD REGISTRADA
                tipoUnidad: dataTipoUnidad.find(o => o.m_nIdTipoUnidad == (dataUnidad.find(o => o.m_nIdUnidad == respuesta.data.m_nIdUnidad)).m_nIdTipoUnidad),
                unidad: dataUnidad.find(
                    (o) => o.m_nIdUnidad == respuesta.data.m_nIdUnidad
                ),

                //ERROR PORQUE NO HAY OPERADOR REGISTRADO
                operador: dataOperador.find(
                    (o) => o.m_nIdOperador == respuesta.data.m_nIdOperador
                ) ? dataOperador[0].m_sNombreCompleto : null,

                codigoPostalDestinatario: dataCodigoPostal.find(
                    (o) => o.m_nIdCP == respuesta.data.m_sIdCodigoPostalDestinatario
                ),
                ciudadDestinatario: dataCiudad.find(
                    (o) => o.m_nIdCiudad == respuesta.data.m_nIdCiudadDestinatario
                ),
                correoDestinatario: respuesta.data.m_sCorreoDestinatario,
                telefonoDestinatario: respuesta.data.m_sTelefonoDestinatario,
                contactoDestinatario: respuesta.data.m_sContactoDestinatario,
                destinoDestinatario: dataCiudad.find(
                    (o) => o.m_nIdCiudad == respuesta.data.m_nIdCiudadDestino
                ),
                codigoPostalRecoleccion: dataCodigoPostal.find(
                    (o) => o.m_nIdCP == respuesta.data.m_nIdCPDetalleRecoleccion
                ),
                ciudadRecoleccion: respuesta.data.m_nIdCiudadDetalleRecoleccion,
                zonaRecoleccion: respuesta.data.m_nIdZonaDetalleRecoleccion,
                domicilioRecoleccion: respuesta.data.m_sDomicilioDetalleRecoleccion,
                recogerEn: respuesta.data.m_sRecogerEnDetalleRecoleccion,
                datosAdicionalesRecoleccion:
                respuesta.data.m_sDatosAdicionalesDetalleRecoleccion,
                codigoPostalEntrega: dataCodigoPostal.find(
                    (o) => o.m_nIdCP == respuesta.data.m_nIdCPDetalleEntrega
                ),
                ciudadEntrega: respuesta.data.m_nIdCiudadDetalleEntrega,
                zonaEntrega: respuesta.data.m_nIdZonaDetalleEntrega,
                domicilioEntrega: respuesta.data.m_sDomicilioDetalleEntrega,
                entregaEn: respuesta.data.m_sEntregarEnDetalleEntrega,
                datosAdicionalesEntrega:
                respuesta.data.m_sDatosAdicionalesDetalleEntrega,
                fechaHoraSalida:
                    respuesta.data.m_dFechaElaboracionSalidaRecoleccion +
                    "T" +
                    respuesta.data.m_tHoraElaboracionSalidaRecoleccion.slice(0, 5),
                fechaHoraLlegada:
                    respuesta.data.m_dFechaElaboracionLlegadaRecoleccion +
                    "T" +
                    respuesta.data.m_tHoraElaboracionLlegadaRecoleccion.slice(0, 5),

                fechaHoraRegistro:
                    respuesta.data.m_dFechaRegistro +
                    "T" +
                    respuesta.data.m_tHoraRegistro.slice(0, 5),
                fechaRecoleccion:
                    respuesta.data.m_dFechaDetalleRecoleccion +
                    "T" +
                    respuesta.data.m_tHoraDetalleRecoleccion.slice(0, 5),
                paquetes: respuesta.data.m_parrPaquetes,
                sobres: respuesta.data.m_parrSobres,
                cantidadDePaquetes: respuesta.data.m_parrPaquetes.length,
                cantidadDeSobres: respuesta.data.m_parrSobres.length,
            });
        });
    }

    function handleShowConsultar(id) {
        $('.nav-tabs li ').removeClass('active');
        $('.nav-tabs li').eq(1).addClass('active');
        console.log(id);
        const url = `${process.env.REACT_APP_API_URL}/Recoleccion/GetById/${id}`;
        axios.get(url, {headers}).then((respuesta) => {
            console.log(respuesta.data);
            setState({
                ...state,
                agregar: "Consultar",
                idRecoleccion: id,
                idSucursalAgregar: respuesta.data.m_nIdSucursal,
                folioRecoleccion: respuesta.data.m_sFolioRecoleccion,
                folioEmbarque: respuesta.data.m_nIdEmbarque,
                folioGuía: respuesta.data.m_nIdGuia,
                folioInforme: respuesta.data.m_nIdInforme,
                fechaHoraCreacion:
                    respuesta.data.m_dFecha + "T" + respuesta.data.m_tHora.slice(0, 5),
                estatusRecoleccion: respuesta.data.m_nIdEstatusRecoleccion,
                moneda: respuesta.data.m_nMoneda,
                tipoCambio: respuesta.data.m_rTipoCambio,
                tipoCobro: respuesta.data.m_nIdTipoDeCobro,
                nombreRemitente: dataRemitenteDestinatario.find((o) => o.m_sRFC == respuesta.data.m_sRFCRemitente),
                RFCRemitente: respuesta.data.m_sRFCRemitente,
                domicilioRemitente: respuesta.data.m_sDomicilioRemitente,
                codigoPostalRemitente: dataCodigoPostal.find(
                    (o) => o.m_nIdCP == respuesta.data.m_sIdCodigoPostalRemitente
                ),
                ciudadRemitente: dataCiudad.find(
                    (o) => o.m_nIdCiudad == respuesta.data.m_nIdCiudadRemitente
                ),
                correoRemitente: respuesta.data.m_sCorreoRemitente,
                telefonoRemitente: respuesta.data.m_sTelefonoRemitente,
                contactoRemitente: respuesta.data.m_sContactoRemitente,
                origenRemitente: dataCiudad.find(
                    (o) => o.m_nIdCiudad == respuesta.data.m_nIdCiudadOrigen
                ),
                nombreDestinatario: dataRemitenteDestinatario.find((o) => o.m_sRFC == respuesta.data.m_sRFCDestinatario),
                RFCDestinatario: respuesta.data.m_sRFCDestinatario,
                domicilioDestinatario: respuesta.data.m_sDomicilioDestinatario,
                tipoUnidad: dataTipoUnidad.find(o => o.m_nIdTipoUnidad == (dataUnidad.find(o => o.m_nIdUnidad == respuesta.data.m_nIdUnidad)).m_nIdTipoUnidad),
                unidad: dataUnidad.find(
                    (o) => o.m_nIdUnidad == respuesta.data.m_nIdUnidad
                ),
                operador: dataOperador.find(
                    (o) => o.m_nIdOperador == respuesta.data.m_nIdOperador
                ),
                codigoPostalDestinatario: dataCodigoPostal.find(
                    (o) => o.m_nIdCP == respuesta.data.m_sIdCodigoPostalDestinatario
                ),
                ciudadDestinatario: dataCiudad.find(
                    (o) => o.m_nIdCiudad == respuesta.data.m_nIdCiudadDestinatario
                ),
                correoDestinatario: respuesta.data.m_sCorreoDestinatario,
                telefonoDestinatario: respuesta.data.m_sTelefonoDestinatario,
                contactoDestinatario: respuesta.data.m_sContactoDestinatario,
                destinoDestinatario: dataCiudad.find(
                    (o) => o.m_nIdCiudad == respuesta.data.m_nIdCiudadDestino
                ),
                codigoPostalRecoleccion: dataCodigoPostal.find(
                    (o) => o.m_nIdCP == respuesta.data.m_nIdCPDetalleRecoleccion
                ),
                ciudadRecoleccion: respuesta.data.m_nIdCiudadDetalleRecoleccion,
                zonaRecoleccion: respuesta.data.m_nIdZonaDetalleRecoleccion,
                domicilioRecoleccion: respuesta.data.m_sDomicilioDetalleRecoleccion,
                recogerEn: respuesta.data.m_sRecogerEnDetalleRecoleccion,
                datosAdicionalesRecoleccion:
                respuesta.data.m_sDatosAdicionalesDetalleRecoleccion,
                codigoPostalEntrega: dataCodigoPostal.find(
                    (o) => o.m_nIdCP == respuesta.data.m_nIdCPDetalleEntrega
                ),
                ciudadEntrega: respuesta.data.m_nIdCiudadDetalleEntrega,
                zonaEntrega: respuesta.data.m_nIdZonaDetalleEntrega,
                domicilioEntrega: respuesta.data.m_sDomicilioDetalleEntrega,
                entregaEn: respuesta.data.m_sEntregarEnDetalleEntrega,
                datosAdicionalesEntrega:
                respuesta.data.m_sDatosAdicionalesDetalleEntrega,
                fechaHoraSalida:
                    respuesta.data.m_dFechaElaboracionSalidaRecoleccion +
                    "T" +
                    respuesta.data.m_tHoraElaboracionSalidaRecoleccion.slice(0, 5),
                fechaHoraLlegada:
                    respuesta.data.m_dFechaElaboracionLlegadaRecoleccion +
                    "T" +
                    respuesta.data.m_tHoraElaboracionLlegadaRecoleccion.slice(0, 5),
                fechaRecoleccion:
                    respuesta.data.m_dFechaDetalleRecoleccion +
                    "T" +
                    respuesta.data.m_tHoraDetalleRecoleccion.slice(0, 5),
                paquetes: respuesta.data.m_parrPaquetes,
                sobres: respuesta.data.m_parrSobres,
                cantidadDePaquetes: respuesta.data.m_parrPaquetes.length,
                cantidadDeSobres: respuesta.data.m_parrSobres.length,
            });
            console.log("tipoUnidad:")
            console.log(dataTipoUnidad)
        });
    }

    function handleShowSalidaLlegada() {
        const url = `${process.env.REACT_APP_API_URL}/Recoleccion/GetById/${state.idRecoleccion}`;
        axios.get(url, {headers}).then((respuesta) => {
            console.log(respuesta.data);
            setState({
                ...state,
                sucursalCancelacion: dataSucursal.find(o => o.m_nIdSucursal == respuesta.data.m_nIdSucursal).m_sSucursal,
                folioRecoleccion: respuesta.data.m_sFolioRecoleccion,
                fechaHoraCreacion:
                    respuesta.data.m_dFecha + "T" + respuesta.data.m_tHora.slice(0, 5),
                unidad: dataUnidad.find(
                    (o) => o.m_nIdUnidad == respuesta.data.m_nIdUnidad
                ),
                operador: dataOperador.find(
                    (o) => o.m_nIdOperador == respuesta.data.m_nIdOperador
                ),
                recogerEn: respuesta.data.m_sRecogerEnDetalleRecoleccion,
                fechaRecoleccion: respuesta.data.m_dFechaDetalleRecoleccion
            });
        });
    }

    function handleShowAgregar(event) {
        event.stopPropagation()
        setState({
            ...state,
            nombreRemitente: dataRemitenteDestinatario[0],
            nombreDestinatario: dataRemitenteDestinatario[0],

            agregar: "Agregar",
            idRecoleccion: 0,
            //folioRecoleccion: parseInt(dataFolioRecoleccion[0].m_sFolioRecoleccion.split("E")[1]),
            folioRecoleccion: dataFolioRecoleccion.length !== 0 ? dataFolioRecoleccion[0].m_sFolioRecoleccion : "",
            folioEmbarque: "",
            folioGuía: "",
            folioInforme: "",
            fechaHoraRegistro: "",
            fechaHoraCreacion: today.getDate() + "/" + (today.getMonth() + 1) + "/" + today.getFullYear() + "T" + today.getHours() + ":" + today.getMinutes(),
            estatusRecoleccion: dataEstatusRecoleccion.length !== 0 ? dataEstatusRecoleccion[0].m_nIdEstatusRecoleccion : 2,
            moneda: 1,
            tipoCambio: dataTipoCambio.length !== 0 ? dataTipoCambio[0].m_nIdTipoCambio : 2,
            tipoCobro: 0,
            RFCRemitente: "",
            domicilioRemitente: "",
            codigoPostalRemitente: dataCodigoPostal.length !== 0 ? [0] : null,
            correoRemitente: "",
            telefonoRemitente: "",
            contactoRemitente: "",
            origenRemitente: dataCiudad.length !== 0 ? dataCiudad[0].m_nIdCiudad : 1,
            RFCDestinatario: "",
            domicilioDestinatario: "",
            codigoPostalDestinatario: dataCodigoPostal.length !== 0 ? dataCodigoPostal[0] : null,
            correoDestinatario: "",
            telefonoDestinatario: "",
            contactoDestinatario: "",
            destinoDestinatario: dataCiudad.length !== 0 ? dataCiudad[0].m_nIdCiudad : 1,
            ciudadRemitente: dataCiudad.length !== 0 ? dataCiudad[0].m_nIdCiudad : 1,
            ciudadDestinatario: dataCiudad.length !== 0 ? dataCiudad[0].m_nIdCiudad : 1,
            fechaRecoleccion: "",
            codigoPostalRecoleccion: dataCodigoPostal.length !== 0 ? dataCodigoPostal[0] : null,
            ciudadRecoleccion: dataCiudad.length !== 0 ? dataCiudad[0].m_nIdCiudad : 1,
            zonaRecoleccion: 0,
            domicilioRecoleccion: "",
            recogerEn: "",
            datosAdicionalesRecoleccion: "",
            codigoPostalEntrega: dataCodigoPostal.length !== 0 ? dataCodigoPostal[0] : 1,
            ciudadEntrega: dataCiudad.length !== 0 ? dataCiudad[0].m_nIdCiudad : 1,
            zonaEntrega: 0,
            domicilioEntrega: "",
            entregaEn: "",
            datosAdicionalesEntrega: "",
            cantidadDePaquetes: 0,
            cantidadDeSobres: 0,
            operador: dataOperador.length !== 0 ? dataOperador[0].m_nIdOperador : 1,
            unidad: dataUnidad.length !== 0 ? dataUnidad[0].m_nIdUnidad : 1,
            paquetes: [
                {
                    m_rPeso: "",
                    m_rLargo: "",
                    m_rAncho: "",
                    m_rAlto: "",
                    m_rVolumen: "",
                    m_nIdTipoEmbalaje: "",
                    m_cyValorDeclarado: "",
                    m_sDescripcion: "",
                    m_nCantidad: "",
                    m_sObservaciones: "",
                },
            ],
            sobres: [
                {
                    m_sDescripcion: "",
                },
            ],
        });
        $('.nav-tabs li ').removeClass('active');
        $('.nav-tabs li').eq(1).addClass('active');
        $('.tab-content div ').removeClass('active show');
        $('#Agregar').addClass('in active show in');
    }

    const handleChange = (event) => {
        event.preventDefault();
        setState({
            ...state,
            [event.target.id]: event.target.value,
        });
    };

    useEffect(value => {
        console.log(dataTipoMoneda)
    }, [state.moneda])

    const handleImprimir = (event) => {
        showSuccess("A imprimir se ha dicho")
        setState({...state, openDialog: false})
    }

    function handleSelectRow(id, event) {
        setState({
            ...state,
            idRecoleccion: id
        });
    }

    const handleChangePaquete = (event, index) => {
        var {paquetes} = state;
        paquetes[index][event.target.name] = event.target.value;
        setState({
            ...state,
            paquetes: paquetes,
        });
    };

    const handleChangeSobre = (event, index) => {
        var {sobres} = state;
        sobres[index][event.target.name] = event.target.value;
        setState({
            ...state,
            sobres: sobres,
        });
    };

    const handleRecoleccionCheckboxChange = (event) => {
        event.preventDefault();
        setState({
            ...state,
            diferenteRecoleccion: !state.diferenteRecoleccion,
        });
    };

    const handleEntregaCheckboxChange = (event) => {
        event.preventDefault();
        setState({
            ...state,
            diferenteEntrega: !state.diferenteEntrega,
        });
    };

    const handleFechaInicialFiltro = async (event) => {
        event.preventDefault();
        setState({
            ...state,
            fechaInicial: event.target.value,
        })
        const url = `${process.env.REACT_APP_API_URL}/Recoleccion/GetByFiltro/` +
            event.target.value + "/" + state.fechaFinal + "/" + state.sucursalListado + "/" + state.estatusListado;
        await axios.get(url, {headers}).then(respuesta => {
            setData(respuesta.data)
        })
    }

    const handleFechaFinalFiltro = async (event) => {
        event.preventDefault();
        setState({
            ...state,
            fechaFinal: event.target.value,
        })
        const url = `${process.env.REACT_APP_API_URL}/Recoleccion/GetByFiltro/` +
            state.fechaInicial + "/" + event.target.value + "/" + state.sucursalListado + "/" + state.estatusListado;
        await axios.get(url, {headers}).then(respuesta => {
            setData(respuesta.data)
        })
    }

    const handleSucursalFiltro = async (event) => {
        event.preventDefault();
        setState({
            ...state,
            sucursalListado: event.target.value,
        })
        const url = `${process.env.REACT_APP_API_URL}/Recoleccion/GetByFiltro/` +
            state.fechaInicial + "/" + state.fechaFinal + "/" + event.target.value + "/" + state.estatusListado;
        await axios.get(url, {headers}).then(respuesta => {
            setData(respuesta.data)
        })
    }

    const handleEstatusFiltro = async (event) => {
        event.preventDefault();
        setState({
            ...state,
            estatusListado: event.target.value,
        })
        const url = `${process.env.REACT_APP_API_URL}/Recoleccion/GetByFiltro/` +
            state.fechaInicial + "/" + state.fechaFinal + "/" + state.sucursalListado + "/" + event.target.value;
        await axios.get(url, {headers}).then(respuesta => {
            setData(respuesta.data)
        })
    }

    const handleSelectChange = (event) => {
        event.preventDefault();
        getAllUnidades(event.target.value);
    };

    const columns = React.useMemo(() => [
        {
            headerName: "Acciones",
            field: "",
            renderCell: (row) => {
                return (
                    <div>
                        <a href="#Agregar" role="tab" data-toggle="tab"
                           onClick={() => (handleShowModificar(row.row.m_nIdRecoleccion))}
                           className="btn btn-default btn-xs"><i className="fa fa-pencil-square-o"
                                                                 style={{color: "#F9A03E"}}/></a>
                        <a href="#Agregar" role="tab" data-toggle="tab" className="btn btn-default btn-xs"
                           onClick={() => (handleShowConsultar(row.row.m_nIdRecoleccion))}><i className="fa fa-eye"
                                                                                              style={{color: "#F9A03E"}}/></a>
                        <a href="#" className="btn btn-default btn-xs"
                           onClick={() => (handleEliminar(row.row.m_nIdRecoleccion))}><i className="zmdi zmdi-delete"
                                                                                         style={{color: "#F30B0B"}}/></a>
                    </div>
                )
            }
        },
        {
            headerName: "Folio",
            field: "m_sFolioRecoleccion",
            width: 125,
        },
        {
            headerName: "Fecha/Hora Elaboración",
            field: "m_sFechaHora",
            width: 200,
        },
        {
            headerName: "Fecha/Hora Recolección",
            field: "m_sFechaHoraDetalleRec",
            width: 200,
        },
        {
            headerName: "Sucursal",
            field: "m_sSucursal",
            width: 125,
        },
        {
            headerName: "Zona Recolección",
            field: "m_sZonaRecoleccion",
            width: 150,
        },
        {
            headerName: "Recoger En",
            field: "m_sRecogerEnDetalleRecoleccion",
            width: 125,
        },
        {
            headerName: "Estatus",
            field: "m_sEstatusRecoleccion",
            width: 125,
        },
        {
            headerName: "Operador",
            field: "m_sOperador",
            width: 250,
        },
        {
            headerName: "Unidad",
            field: "m_sUnidad",
            width: 125,
        },

        {
            headerName: "Remolque",
            field: "m_sTipoRemolque",
            width: 125,
        },
    ]);

    const columnsCP = React.useMemo(() => [
        {
            Name: "Codigo",
            accessor: "m_sCP",
        },
        {
            Name: "Estado",
            accessor: "m_sEstado",
        },
        {
            Name: "Ciudad",
            accessor: "m_sCiudad",
        },
    ]);

    const columnsCiudades = React.useMemo(() => [
        {
            Name: "Codigo",
            accessor: "m_nCodigo",
        },
        {
            Name: "Ciudad",
            accessor: "m_sCiudad",
        },
        {
            Name: "Abreviacion",
            accessor: "m_sAbreviacion",
        },
        {
            Name: "Estado",
            accessor: "m_nIdEstado",
        },
    ]);

    const columnsOperadores = React.useMemo(() => [
        {
            Name: "Numero Operador",
            accessor: "m_nNumeroOperador",
        },
        {
            Name: "Nombre",
            accessor: "m_sNombreCompleto",
        },
        {
            Name: "Activo",
            accessor: "m_bActivo", width: 100,
            renderCell: (row) => {
                return (
                    <div
                        style={{
                            width: "100%",
                            textAlign: "center",
                            color: row.row.m_bActivo == 'true' ? "green" : "red",
                        }}
                    >
                        {row.row.m_bActivo ? (
                            <SvgIcon component={Activo}/>
                        ) : (
                            <SvgIcon component={NoActivo}/>
                        )}
                    </div>
                );
            },
        },
    ]);

    const columnsTipoUnidades = React.useMemo(() => [
        {
            Name: "Tipo de unidad",
            accessor: "m_nIdTipoUnidad",
        },
        {
            Name: "Identificador",
            accessor: "m_nIdentificador",
        },
        {
            Name: "Nomenclatura",
            accessor: "m_sNomenclaturaSCT",
        },
        {
            Name: "Estatus",
            accessor: "m_bActivo",
        },
    ]);

    const columnsUnidades = React.useMemo(() => [
        {
            Name: "Descripcion",
            accessor: "m_sDescripcion",
        },
        {
            Name: "Codigo",
            accessor: "m_sCodigo",
        },
        {
            Name: "Tipo de unidad",
            accessor: "m_nIdTipoUnidad",
        },
        {
            Name: "Estatus",
            accessor: "m_bActivo",
        },
    ]);

    const columnsRemitenteDestinatarios = React.useMemo(() => [
        {
            Name: "Número",
            accessor: "m_nNumero",
        },
        {
            Name: "RFC",
            accessor: "m_sRFC",
        },
        {
            Name: "Remitente-Destinatario",
            accessor: "m_sNombre",
        },
        {
            Name: "Núm.Cliente",
            accessor: "m_nNumeroCliente",
        },
        {
            Name: "Cliente",
            accessor: "m_sNombreFiscal",
        },
    ]);

    useEffect((value) => {
        if (
            localStorage.getItem("UsuarioId") === null ||
            localStorage.getItem("UsuarioId") <= 0
        ) {
            showSuccess("Es necesario iniciar sesion para acceder a este proceso");
            window.location.replace("login");
            return;
        }
        getAllData();
        getAllSucursales();
        getAllEstatusRecoleccion();
        getAllTipoCobro();
        getAllTipoMoneda();
        getAllCiudades();
        //getAllCodigosPostales();
        //getAllCodigosPostalesRem(state.ciudadRemitente);
        //getAllCodigosPostalesDes(state.ciudadDestinatario);

        getAllOperadores();
        getAllTipoUnidad();
        getAllRemitentesDestinatarios();
        getAllEmbalajes();
        getAllZonas();
        getTipoCambio()
        getUltimoFolioRecoleccion();
    }, []);

    function getAllData() {
        const url = `${process.env.REACT_APP_API_URL}/Recoleccion/GetListado`;
        axios.get(url, {headers}).then((respuesta) => {
            console.log(respuesta.data);
            setData(respuesta.data);
        });
    }


    function getAllEmbalajes() {
        const url = `${process.env.REACT_APP_API_URL}/Embalajes/GetListado`;
        axios.get(url, {headers}).then((respuesta) => {
            setDataEmbalaje(respuesta.data);
        });
    }

    function getAllSucursales() {
        const url = `${process.env.REACT_APP_API_URL}/Sucursales/GetListado`;
        axios.get(url, {headers}).then((respuesta) => {
            setDataSucursal(respuesta.data);
        });
    }

    function getAllEstatusRecoleccion() {
        const url = `${process.env.REACT_APP_API_URL}/SisEstatus/getListadoRecoleccion`;
        axios.get(url, {headers}).then((respuesta) => {
            setEstatusRecoleccion(respuesta.data);
        });
    }

    function getAllTipoCobro() {
        const url = `${process.env.REACT_APP_API_URL}/TipoCobro/GetListado`;
        axios.get(url, {headers}).then((respuesta) => {
            setDataTipoCobro(respuesta.data);
        });
    }

    function getAllTipoMoneda() {
        const url = `${process.env.REACT_APP_API_URL}/Moneda/GetListado`;
        axios.get(url, {headers}).then((respuesta) => {
            setDataTipoMoneda(respuesta.data);
        });
    }

    function getAllCiudades() {
        const url = `${process.env.REACT_APP_API_URL}/Ciudades/GetListado`;
        axios.get(url, {headers}).then((respuesta) => {
            setDataCiudad(respuesta.data);
        });
    }

    function getAllZonas() {
        const url = `${process.env.REACT_APP_API_URL}/Zonas/GetListado`;
        axios.get(url, {headers}).then((respuesta) => {
            setDataZona(respuesta.data);
        });
    }

    function getUltimoFolioRecoleccion() {
        const url = `${process.env.REACT_APP_API_URL}/Recoleccion/GetUltimoFolio`;
        axios.get(url, {headers}).then((respuesta) => {
            SetDataFolioRecoleccion(respuesta.data);
        });
    }

    function getAllCodigosPostales(idCiudad) {
        const url = `${process.env.REACT_APP_API_URL}/CodigoPostal/GetListadoPorCiudad/`+idCiudad;
        axios.get(url, {headers}).then((respuesta) => {
            setDataCodigoPostal(respuesta.data);
        });
    }
  /*   function getAllCodigosPostalesRem(idCiudad) {
        const url = `${process.env.REACT_APP_API_URL}/CodigoPostal/GetListadoPorCiudad/`+idCiudad;
        axios.get(url, { headers }).then((respuesta) => {
          console.log(respuesta);
    
          setDataCodigoPostal(respuesta.data);
        });
      }
 */
     /*  function getAllCodigosPostalesDes(idCiudad) {
        const url = `${process.env.REACT_APP_API_URL}/CodigoPostal/GetListadoPorCiudad/`+idCiudad;
        axios.get(url, { headers }).then((respuesta) => {
          console.log(respuesta);
    
          setDataCodigoPostal(respuesta.data);
        });
      } */
    


    function getAllRemitentesDestinatarios() {
        const url = `${process.env.REACT_APP_API_URL}/RemitentesDestinatarios/GetListado`;
        axios.get(url, {headers}).then((respuesta) => {
            setDataRemitenteDestinatario(respuesta.data);
        });
    }

    function getAllOperadores() {
        const url = `${process.env.REACT_APP_API_URL}/Operadores/GetListado`;
        axios.get(url, {headers}).then((respuesta) => {
            setDataOperador(respuesta.data);
        });
    }

    function getAllTipoUnidad() {
        const url = `${process.env.REACT_APP_API_URL}/TiposUnidades/GetListado`;
        axios.get(url, {headers}).then((respuesta) => {
            setDataTipoUnidad(respuesta.data);
            getAllUnidades(respuesta.data[0].m_nIdTipoUnidad);
        });
    }

    function getAllUnidades(id) {
        console.log(id);
        const url = `${process.env.REACT_APP_API_URL}/Unidades/ByTipoUnidad/${id}`;
        axios.get(url, {headers}).then((respuesta) => {
            console.log(respuesta.data);
            setDataUnidad(respuesta.data);
        });
        console.log(dataUnidad);
    }

    const handleUpload = (e) => {
        e.preventDefault();

        var files = e.target.files,
            f = files[0];
        var reader = new FileReader();
        console.log(e.target.files);
        reader.onload = function (e) {
            console.log("Nothing Happened");
            var data = e.target.result;
            let readedData = XLSX.read(data, {type: "binary"});
            const wsname = readedData.SheetNames[0];
            const ws = readedData.Sheets[wsname];

            /* Convert array to json*/
            const dataParse = XLSX.utils.sheet_to_json(ws, {header: 1});
            console.log("dataParse : " + dataParse);
            setFileUploaded(dataParse);
        };
        reader.readAsBinaryString(f);
    };

    const headers = {
        "Content-Type": "application/json",
        //    'access-control-allow-origin': '*'
    };

    function conDatos() {
        return data.length != 0;
    }

    function DefaultColumnFilter({
                                     column: {filterValue, preFilteredRows, setFilter},
                                 }) {
        const count = preFilteredRows.length;
        const [showResults, setShowResults] = React.useState(false)
        const onClick = () => setShowResults(!showResults)
        return (
            <div style={{display: "flex"}}>
                <span style={{display: "block", float: "right"}}>
                    <a onClick={onClick}>
                        <i className="fa fa-search"/>
                    </a>
                </span>
                <br></br>
                <span style={{display: "block"}}>
                    <input
                        className="form-control"
                        type={showResults ? "" : "hidden"}
                        value={filterValue || ""}
                        onChange={(e) => {
                            setFilter(e.target.value || undefined);
                        }}
                        placeholder={`Buscar ${count} registros...`}
                    />
                </span>
            </div>
        );
    }

    function Table({columns, data}) {
        const defaultColumn = React.useMemo(
            () => ({
                // Default Filter UI
                Filter: DefaultColumnFilter,
            }),
            []
        );

        const {
            getTableProps,
            getTableBodyProps,
            headerGroups,
            rows,
            prepareRow,

        } = useTable(
            {
                columns,
                data,
                defaultColumn,
            },
            useFilters,
            useSortBy
        );

        return (
            <div className="wrapper-tabla" style={{height: state.height - 270}}>
                <div className="wrapper-tabla-2">
                    <table className="table tabla-listado" {...getTableProps()}>
                        <thead>
                        {headerGroups.map((headerGroup) => (
                            <tr {...headerGroup.getHeaderGroupProps()}>
                                <th style={{verticalAlign: "top"}}>Acciones</th>
                                {headerGroup.headers.map((column) => (
                                    // Add the sorting props to control sorting. For this example
                                    // we can add them into the header props
                                    <th {...column.getHeaderProps(column.getSortByToggleProps())}>
                                        <div style={{display: "flex"}}>
                                            {column.render("Name")}
                                            {/* Add a sort direction indicator */}
                                            <span>
                                                    {column.isSorted ? (
                                                        column.isSortedDesc ? (
                                                            <i className="fa fa-caret-up"/>
                                                        ) : (
                                                            <i className="fa fa-caret-down"/>
                                                        )
                                                    ) : (
                                                        ""
                                                    )}
                                                </span>
                                            <div style={{right: "0"}}>
                                                {column.canFilter ? column.render("Filter") : null}
                                            </div>
                                        </div>
                                    </th>
                                ))}
                            </tr>
                        ))}
                        </thead>
                        <tbody {...getTableBodyProps()}>
                        {rows.map((row, i) => {
                            prepareRow(row);
                            return (
                                <tr {...row.getRowProps()}
                                    onClick={handleSelectRow.bind(this, row.original.m_nIdRecoleccion)}
                                    className={state.idRecoleccion === row.original.m_nIdRecoleccion ? classes.seleccionado : classes.noSeleccionado}>
                                    <td>
                                        <div>
                                            <a
                                                href="#Agregar"
                                                role="tab"
                                                data-toggle="tab"
                                                onClick={() =>
                                                    handleShowModificar(row.original.m_nIdRecoleccion)
                                                }
                                                className="btn btn-default btn-xs"
                                            >
                                                <i
                                                    className="fa fa-pencil-square-o"
                                                    style={{color: "#F9A03E"}}
                                                />
                                            </a>
                                            <a
                                                href="#Agregar"
                                                role="tab"
                                                data-toggle="tab"
                                                className="btn btn-default btn-xs"
                                                onClick={() =>
                                                    handleShowConsultar(row.original.m_nIdRecoleccion)
                                                }
                                            >
                                                <i className="fa fa-eye" style={{color: "#F9A03E"}}/>
                                            </a>
                                            <a
                                                href="#"
                                                className="btn btn-default btn-xs"
                                                onClick={() =>
                                                    handleEliminar(row.original.m_nIdRecoleccion)
                                                }
                                            >
                                                <i
                                                    className="zmdi zmdi-delete"
                                                    style={{color: "#F30B0B"}}
                                                />
                                            </a>
                                        </div>
                                    </td>
                                    {row.cells.map((cell) => {
                                        return (
                                            <td {...cell.getCellProps()}>{cell.render("Cell")}</td>
                                        );
                                    })}
                                </tr>
                            );
                        })}
                        </tbody>
                    </table>
                </div>
            </div>
        );
    }

    function TableCodigoPostal({columns, data, select, object}) {
        const defaultColumn = React.useMemo(
            () => ({
                // Default Filter UI
                Filter: DefaultColumnFilter,
            }),
            []
        );

        const {
            getTableProps,
            getTableBodyProps,
            headerGroups,
            rows,
            prepareRow,
            state,
        } = useTable(
            {
                columns,
                data,
                defaultColumn,
            },
            useFilters,
            useSortBy
        );

        return (
            <div
                className="col-md-12"
                style={{maxHeight: "300px", overflow: "auto"}}
            >
                <table className="table" {...getTableProps()}>
                    <thead>
                    {headerGroups.map((headerGroup) => (
                        <tr {...headerGroup.getHeaderGroupProps()}>
                            <th>Acciones</th>
                            {headerGroup.headers.map((column) => (
                                // Add the sorting props to control sorting. For this example
                                // we can add them into the header props
                                <th {...column.getHeaderProps(column.getSortByToggleProps())}>
                                    {column.render("Name")}
                                    {/* Add a sort direction indicator */}
                                    <span>
                                            {column.isSorted ? (
                                                column.isSortedDesc ? (
                                                    <i className="fa fa-caret-up"/>
                                                ) : (
                                                    <i className="fa fa-caret-down"/>
                                                )
                                            ) : (
                                                ""
                                            )}
                                        </span>
                                    <div>
                                        {column.canFilter ? column.render("Filter") : null}
                                    </div>
                                </th>
                            ))}
                        </tr>
                    ))}
                    </thead>
                    <tbody {...getTableBodyProps()}>
                    {rows.map(
                        (row, i) => {
                            prepareRow(row);
                            return (
                                <tr style={{backgroundColor: row.original.m_nIdCP === select ? "orange" : "white"}}  {...row.getRowProps()}
                                    onClick={handleSelectCP.bind(this, row.original, false)}
                                    onDoubleClick={handleSelectCP.bind(this, row.original, true)}>
                                    {row.cells.map(cell => {
                                        return (
                                            <td {...cell.getCellProps()}>{cell.render('Cell')}</td>
                                        )
                                    })}
                                </tr>
                            )
                        }
                    )}
                    </tbody>
                </table>
            </div>
        );
    }

    function TableCiudades({columns, data, select}) {
        const defaultColumn = React.useMemo(
            () => ({
                // Default Filter UI
                Filter: DefaultColumnFilter,
            }),
            []
        );

        const {
            getTableProps,
            getTableBodyProps,
            headerGroups,
            rows,
            prepareRow,
            state,
        } = useTable(
            {
                columns,
                data,
                defaultColumn,
            },
            useFilters,
            useSortBy
        );

        return (
            <div
                className="col-md-12"
                style={{maxHeight: "300px", overflow: "auto"}}
            >
                <table className="table" {...getTableProps()}>
                    <thead>
                    {headerGroups.map((headerGroup) => (
                        <tr {...headerGroup.getHeaderGroupProps()}>
                            {headerGroup.headers.map(column => (
                                // Add the sorting props to control sorting. For this example
                                // we can add them into the header props
                                <th {...column.getHeaderProps(column.getSortByToggleProps())}>
                                    {column.render("Name")}
                                    {/* Add a sort direction indicator */}
                                    <span>
                                            {column.isSorted ? (
                                                column.isSortedDesc ? (
                                                    <i className="fa fa-caret-up"/>
                                                ) : (
                                                    <i className="fa fa-caret-down"/>
                                                )
                                            ) : (
                                                ""
                                            )}
                                        </span>
                                    <div>
                                        {column.canFilter ? column.render("Filter") : null}
                                    </div>
                                </th>
                            ))}
                        </tr>
                    ))}
                    </thead>
                    <tbody {...getTableBodyProps()}>
                    {rows.map(
                        (row, i) => {
                            prepareRow(row);
                            return (
                                <tr style={{backgroundColor: row.original.m_nIdCiudad === select ? "orange" : "white"}} {...row.getRowProps()}
                                    onClick={handleSelectCP.bind(this, row.original, false)}
                                    onDoubleClick={handleSelectCP.bind(this, row.original, true)}>
                                    {row.cells.map(cell => {
                                        return (
                                            <td {...cell.getCellProps()}>{cell.render('Cell')}</td>
                                        )
                                    })}
                                </tr>
                            )
                        }
                    )}
                    </tbody>
                </table>
            </div>
        );
    }

    function TableOperadores({columns, data, select}) {
        const defaultColumn = React.useMemo(
            () => ({
                // Default Filter UI
                Filter: DefaultColumnFilter,
            }),
            []
        );

        const {
            getTableProps,
            getTableBodyProps,
            headerGroups,
            rows,
            prepareRow,
            state,
        } = useTable(
            {
                columns,
                data,
                defaultColumn,
            },
            useFilters,
            useSortBy
        );

        return (
            <div
                className="col-md-12"
                style={{maxHeight: "300px", overflow: "auto"}}
            >
                <table className="table" {...getTableProps()}>
                    <thead>
                    {headerGroups.map((headerGroup) => (
                        <tr {...headerGroup.getHeaderGroupProps()}>
                            {headerGroup.headers.map(column => (
                                // Add the sorting props to control sorting. For this example
                                // we can add them into the header props
                                <th {...column.getHeaderProps(column.getSortByToggleProps())}>
                                    {column.render("Name")}
                                    {/* Add a sort direction indicator */}
                                    <span>
                                            {column.isSorted ? (
                                                column.isSortedDesc ? (
                                                    <i className="fa fa-caret-up"/>
                                                ) : (
                                                    <i className="fa fa-caret-down"/>
                                                )
                                            ) : (
                                                ""
                                            )}
                                        </span>
                                    <div>
                                        {column.canFilter ? column.render("Filter") : null}
                                    </div>
                                </th>
                            ))}
                        </tr>
                    ))}
                    </thead>
                    <tbody {...getTableBodyProps()}>
                    {rows.map(
                        (row, i) => {
                            prepareRow(row);
                            return (
                                <tr style={{backgroundColor: row.original.m_nIdOperador === select ? "orange" : "white"}} {...row.getRowProps()}
                                    onClick={handleSelectCP.bind(this, row.original, false)}
                                    onDoubleClick={handleSelectCP.bind(this, row.original, true)}>
                                    {row.cells.map(cell => {
                                        return (
                                            <td {...cell.getCellProps()}>{cell.render('Cell')}</td>
                                        )
                                    })}
                                </tr>
                            )
                        }
                    )}
                    </tbody>
                </table>
            </div>
        );
    }

    function TableTipoUnidad({columns, data, select}) {
        const defaultColumn = React.useMemo(
            () => ({
                // Default Filter UI
                Filter: DefaultColumnFilter,
            }),
            []
        );

        const {
            getTableProps,
            getTableBodyProps,
            headerGroups,
            rows,
            prepareRow,
            state,
        } = useTable(
            {
                columns,
                data,
                defaultColumn,
            },
            useFilters,
            useSortBy
        );

        return (
            <div className="col-md-12">
                <table className="table" {...getTableProps()}>
                    <thead>
                    {headerGroups.map((headerGroup) => (
                        <tr {...headerGroup.getHeaderGroupProps()}>
                            {headerGroup.headers.map(column => (
                                // Add the sorting props to control sorting. For this example
                                // we can add them into the header props
                                <th {...column.getHeaderProps(column.getSortByToggleProps())}>
                                    {column.render("Name")}
                                    {/* Add a sort direction indicator */}
                                    <span>
                                            {column.isSorted ? (
                                                column.isSortedDesc ? (
                                                    <i className="fa fa-caret-up"/>
                                                ) : (
                                                    <i className="fa fa-caret-down"/>
                                                )
                                            ) : (
                                                ""
                                            )}
                                        </span>
                                    <div>
                                        {column.canFilter ? column.render("Filter") : null}
                                    </div>
                                </th>
                            ))}
                        </tr>
                    ))}
                    </thead>
                    <tbody {...getTableBodyProps()}>
                    {rows.map(
                        (row, i) => {
                            prepareRow(row);
                            return (
                                <tr style={{backgroundColor: row.original.m_nIdTipoUnidad === select ? "orange" : "white"}} {...row.getRowProps()}
                                    onClick={handleSelectCP.bind(this, row.original, false)}
                                    onDoubleClick={handleSelectCP.bind(this, row.original, true)}>
                                    {row.cells.map(cell => {
                                        return (
                                            <td {...cell.getCellProps()}>{cell.render('Cell')}</td>
                                        )
                                    })}
                                </tr>
                            )
                        }
                    )}
                    </tbody>
                </table>
            </div>
        );
    }

    function TableUnidad({columns, data, select}) {
        const defaultColumn = React.useMemo(
            () => ({
                // Default Filter UI
                Filter: DefaultColumnFilter,
            }),
            []
        );

        const {
            getTableProps,
            getTableBodyProps,
            headerGroups,
            rows,
            prepareRow,
            state,
        } = useTable(
            {
                columns,
                data,
                defaultColumn,
            },
            useFilters,
            useSortBy
        );

        return (
            <div
                className="col-md-12"
                style={{maxHeight: "300px", overflow: "auto"}}
            >
                <table className="table" {...getTableProps()}>
                    <thead>
                    {headerGroups.map((headerGroup) => (
                        <tr {...headerGroup.getHeaderGroupProps()}>
                            {headerGroup.headers.map(column => (
                                // Add the sorting props to control sorting. For this example
                                // we can add them into the header props
                                <th {...column.getHeaderProps(column.getSortByToggleProps())}>
                                    {column.render("Name")}
                                    {/* Add a sort direction indicator */}
                                    <span>
                                            {column.isSorted ? (
                                                column.isSortedDesc ? (
                                                    <i className="fa fa-caret-up"/>
                                                ) : (
                                                    <i className="fa fa-caret-down"/>
                                                )
                                            ) : (
                                                ""
                                            )}
                                        </span>
                                    <div>
                                        {column.canFilter ? column.render("Filter") : null}
                                    </div>
                                </th>
                            ))}
                        </tr>
                    ))}
                    </thead>
                    <tbody {...getTableBodyProps()}>
                    {rows.map(
                        (row, i) => {
                            prepareRow(row);
                            return (
                                <tr style={{backgroundColor: row.original.m_nIdUnidad === select ? "orange" : "white"}} {...row.getRowProps()}
                                    onClick={handleSelectCP.bind(this, row.origina, false)}
                                    onDoubleClick={handleSelectCP.bind(this, row.original, true)}>
                                    {row.cells.map(cell => {
                                        return (
                                            <td {...cell.getCellProps()}>{cell.render('Cell')}</td>
                                        )
                                    })}
                                </tr>
                            )
                        }
                    )}
                    </tbody>
                </table>
            </div>
        );
    }

    function TableRemitentesDestinatarios({columns, data, select}) {
        const defaultColumn = React.useMemo(
            () => ({
                // Default Filter UI
                Filter: DefaultColumnFilter,
            }),
            []
        );

        const {
            getTableProps,
            getTableBodyProps,
            headerGroups,
            rows,
            prepareRow,
        } = useTable(
            {
                columns,
                data,
                defaultColumn,
            },
            useFilters,
            useSortBy
        );

        return (
            <div
                className="col-md-12"
                style={{maxHeight: "300px", overflow: "auto"}}
            >
                <table className="table" {...getTableProps()}>
                    <thead>
                    {headerGroups.map((headerGroup) => (
                        <tr {...headerGroup.getHeaderGroupProps()}>
                            {headerGroup.headers.map(column => (
                                // Add the sorting props to control sorting. For this example
                                // we can add them into the header props
                                <th {...column.getHeaderProps(column.getSortByToggleProps())}>
                                    {column.render("Name")}
                                    {/* Add a sort direction indicator */}
                                    <span>
                                            {column.isSorted ? (
                                                column.isSortedDesc ? (
                                                    <i className="fa fa-caret-up"/>
                                                ) : (
                                                    <i className="fa fa-caret-down"/>
                                                )
                                            ) : (
                                                ""
                                            )}
                                        </span>
                                    <div>
                                        {column.canFilter ? column.render("Filter") : null}
                                    </div>
                                </th>
                            ))}
                        </tr>
                    ))}
                    </thead>
                    <tbody {...getTableBodyProps()}>
                    {rows.map(
                        (row, i) => {
                            prepareRow(row);
                            return (
                                <tr style={{backgroundColor: row.original.m_nIdRemitenteDestinatario === select ? "#FCC88F" : "white"}} {...row.getRowProps()}
                                    onClick={handleSelectCP.bind(this, row.original, false)}
                                    onDoubleClick={handleSelectCP.bind(this, row.original, true)}>

                                    {row.cells.map(cell => {
                                        return (
                                            <td {...cell.getCellProps()}>{cell.render('Cell')}</td>
                                        )
                                    })}
                                </tr>
                            )
                        }
                    )}
                    </tbody>
                </table>
            </div>
        );
    }

    function openSection(index) {
        // closeSeccions()
        var $section;
        switch (index) {
            case 1:
                setStepActive(1);
                $section = $("#informacionGeneral");
                break;
            case 2:
                setStepActive(2);
                $section = $("#remitenteDestinatario");

                break;
            case 3:
                setStepActive(3);
                $section = $("#detallesRecoleccion");

                break;
            case 4:
                setStepActive(4);
                $section = $("#paquetesSobres");
                break;
            case 5:
                setStepActive(5);
                $section = $("#detallesOperacion");
                break;

            default:
        }

        var $welem = $section
            .parentsUntil(".widget-action-bar")
            .parentsUntil(".w-action")
            .parents(".widget-header")
            .next(".widget-container");

        $welem.slideDown();
        $section.children("a").children("i").removeClass("zmdi-chevron-up");
        $section.children("a").children("i").addClass("zmdi-chevron-down");
        $("html, body").animate(
            {
                scrollTop: parseInt($section.offset().top),
            },
            200
        );

        var $welem = $section
            .parentsUntil(".widget-action-bar")
            .parentsUntil(".w-action")
            .parents(".widget-header")
            .next(".widget-container");
    }

    function closeSeccions() {
        //Cerrar todas las seciones
        var $section = $(".widget-toggle");
        $section.each(function () {
            var $welem = $(this)
                .parentsUntil(".widget-action-bar")
                .parentsUntil(".w-action")
                .parents(".widget-header")
                .next(".widget-container");
            $welem.slideUp();
            $(this).children("a").children("i").removeClass("zmdi-chevron-down");
            $(this).children("a").children("i").addClass("zmdi-chevron-up");
        });
    }

    const framesPaquete = state.paquetes.map((p, index) => {
        return (
            <div key={`paquete${index}`}>
                <h4><strong>{`Paquete #${index + 1}`}</strong></h4>


                <div className="col-sm-4 col-md-2-5 unit">
                    <div className="input">
                        <TextField variant="outlined" margin="dense"
                                   onChange={(event) => handleChangePaquete(event, index)}
                                   className="form-control"
                                   type="text"
                                   label="Peso"
                                   value={state.paquetes[index].m_rPeso}
                                   required
                                   disabled={state.agregar === "Consultar"}
                                   placeholder="kg"
                                   name="m_rPeso"
                        />
                    </div>
                </div>

                <div className="col-sm-4 col-md-2-5 unit">
                    <div className="input">
                        <TextField variant="outlined" margin="dense"
                                   onChange={(event) => handleChangePaquete(event, index)}
                                   className="form-control"
                                   type="text"
                                   value={state.paquetes[index].m_rLargo}
                                   required
                                   label="Largo"
                                   disabled={state.agregar === "Consultar"}
                                   placeholder="mts"
                                   name="m_rLargo"
                        />
                    </div>
                </div>

                <div className="col-sm-4 col-md-2-5 unit">
                    <div className="input">
                        <TextField variant="outlined" margin="dense"
                                   onChange={(event) => handleChangePaquete(event, index)}
                                   className="form-control"
                                   type="text"
                                   label="Ancho"
                                   value={state.paquetes[index].m_rAncho}
                                   required
                                   disabled={state.agregar === "Consultar"}
                                   placeholder="mts"
                                   name="m_rAncho"
                        />
                    </div>
                </div>

                <div className="col-sm-4 col-md-2-5 unit">
                    <div className="input">
                        <TextField variant="outlined" margin="dense"
                                   onChange={(event) => handleChangePaquete(event, index)}
                                   className="form-control"
                                   type="text"
                                   value={state.paquetes[index].m_rAlto}
                                   required
                                   label="Alto"
                                   disabled={state.agregar === "Consultar"}
                                   placeholder="mts"
                                   name="m_rAlto"
                        />
                    </div>
                </div>

                <div className="col-sm-4 col-md-2-5 unit">
                    <div className="input">
                        <TextField variant="outlined" margin="dense"
                                   onChange={(event) => handleChangePaquete(event, index)}
                                   className="form-control"
                                   type="text"
                                   value={state.paquetes[index].m_rVolumen}
                                   required
                                   label="Volumen"
                                   disabled={state.agregar === "Consultar"}
                                   placeholder="mts3"
                                   name="m_rVolumen"
                        />
                    </div>
                </div>

                <div className="col-sm-4 col-md-6 unit">
                    <label className="input select">
                        <FormControl fullWidth variant="outlined" margin="dense">
                            <InputLabel id="m_nIdTipoEmbalajeLabel">Tipo de Embalaje</InputLabel>
                            <Select
                                className="form-control"
                                label="Tipo de Embalaje"
                                labelId="m_nIdTipoEmbalajeLabel"
                                value={state.paquetes[index].m_nIdTIpoEmpaque}
                                disabled={state.agregar === "Consultar"}
                                onChange={(event) => handleChangePaquete(event, index)}
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
                </div>

                <div className="col-sm-4 col-md-6 unit">
                    <div className="input">
                        <TextField variant="outlined" margin="dense"
                                   onChange={(event) => handleChangePaquete(event, index)}
                                   className="form-control"
                                   type="text"
                                   label="Valor Declarado"
                                   value={state.paquetes[index].m_cyValorDeclarado}
                                   required
                                   disabled={state.agregar === "Consultar"}
                                   placeholder="$"
                                   name="m_cyValorDeclarado"
                        />
                    </div>
                </div>

                <div className="col-sm-4 col-md-8 unit">
                    <div className="input">
                        <TextField variant="outlined" margin="dense"
                                   onChange={(event) => handleChangePaquete(event, index)}
                                   className="form-control"
                                   type="text"
                                   label="Descripción"
                                   value={state.paquetes[index].m_sDescripcion}
                                   required
                                   disabled={state.agregar === "Consultar"}
                                   placeholder="Descripción"
                                   name="m_sDescripcion"
                        />
                    </div>
                </div>

                <div className="col-sm-4 col-md-4 unit">
                    <div className="input">
                        <TextField variant="outlined" margin="dense"
                                   onChange={(event) => handleChangePaquete(event, index)}
                                   className="form-control"
                                   type="text"
                                   label="Ctd"
                                   value={state.paquetes[index].m_nCantidad}
                                   required
                                   disabled={state.agregar === "Consultar"}
                                   placeholder="Ctd"
                                   name="m_nCantidad"
                        />
                    </div>
                </div>

                <div className="col-sm-4 col-md-12 unit">
                    <div className="input">
                        <TextField variant="outlined" margin="dense"
                                   onChange={(event) => handleChangePaquete(event, index)}
                                   className="form-control"
                                   type="text"
                                   label="Observaciones"
                                   value={state.paquetes[index].m_sObservaciones}
                                   required
                                   disabled={state.agregar === "Consultar"}
                                   placeholder="Observaciones"
                                   name="m_sObservaciones"
                        />
                    </div>
                </div>
            </div>
        );
    });

    const framesSobre = state.sobres.map((p, index) => {
        return (
            <div key={`sobre${index}`}>
                <h4><strong>{`Sobre #${index + 1}`}</strong></h4>




                <div className="col-md-12 unit">
                    <div className="input">
                        <TextField variant="outlined" margin="dense"
                                   onChange={(event) => handleChangeSobre(event, index)}
                                   className="form-control"
                                   type="text"
                                   label="Descripcion"
                                   value={state.sobres[index].m_sDescripcion}
                                   required
                                   disabled={state.agregar === "Consultar"}
                                   placeholder="Descripción"
                                   name="m_sDescripcion"
                        />
                    </div>
                </div>
            </div>
        );
    });

    if (redirect) {
        if (data.find((o) => o.m_nIdRecoleccion == state.idRecoleccion).m_nIdEmbarque != 0) {
            showSuccess("Recolección ya tiene Embarque")
        } else {
            return (
                <Redirect push to={{
                    pathname: '/Embarque',
                    idRecoleccion: state.idRecoleccion,
                }}
                />
            )
        }
    }

    return (
        <div>
            <Dialog open={state.openDialog} onClose={() => setState({...state, openDialog: false})}>
                <DialogContent>
                    {state.tipoModal === 0 &&
                    <div className="row" style={{backgroundColor: '#FFFFFF'}}>
                        <div align="right">
                            <button onClick={() => {
                                history.push("/Ciudades")
                            }} className="btn btn-primary primary-btn">Agregar
                            </button>

                        </div>

                        {dataCodigoPostal.length !== 0 ? <TableCodigoPostal object={state}
                                                                            select={state[state.identificadorModal] && state[state.identificadorModal].m_nIdCP}
                                                                            columns={columnsCP} data={dataCodigoPostal}
                                                                            identificadorModal={state.identificadorModal}/> :
                            <div>No se encontró ningún registro</div>}

                        <DialogActions style={{justifyContent: "left"}}>

                            <button onClick={() => setState({...state, openDialog: false})}
                                    className="btn btn-primary primary-btn">Aceptar
                            </button>
                            <button onClick={() => setState({...state, openDialog: false})}
                                    className="btn btn-secondary secondary-btn">Cerrar
                            </button>

                        </DialogActions>
                    </div>
                    }
                    {state.tipoModal === 1 &&
                    <div className="row" style={{backgroundColor: '#FFFFFF'}}>
                        <div align="right">
                            <button onClick={() => {
                                history.push("/Ciudades")
                            }} className="btn btn-primary primary-btn">Agregar
                            </button>

                        </div>

                        {dataCiudad.length !== 0 ? <TableCiudades object={state}
                                                                  select={state[state.identificadorModal] && state[state.identificadorModal].m_nIdCiudad}
                                                                  columns={columnsCiudades} data={dataCiudad}
                                                                  identificadorModal={state.identificadorModal}/> :
                            <div>No se encontró ningún registro</div>}


                        <DialogActions style={{justifyContent: "left"}}>

                            <button onClick={() => setState({...state, openDialog: false})}
                                    className="btn btn-primary primary-btn">Aceptar
                            </button>
                            <button onClick={() => setState({...state, openDialog: false})}
                                    className="btn btn-secondary secondary-btn">Cerrar
                            </button>

                        </DialogActions>
                    </div>
                    }
                    {state.tipoModal === 2 &&
                    <div className="row" style={{backgroundColor: '#FFFFFF'}}>
                        <div align="right">
                            <button onClick={() => {
                                history.push("/Operador")
                            }} className="btn btn-primary primary-btn">Agregar
                            </button>

                        </div>

                        {dataOperador.length !== 0 ? <TableOperadores object={state}
                                                                      select={state[state.identificadorModal] && state[state.identificadorModal].m_nIdOperador}
                                                                      columns={columnsOperadores} data={dataOperador}
                                                                      identificadorModal={state.identificadorModal}/> :
                            <div>No se encontró ningún registro</div>}

                        <DialogActions style={{justifyContent: "left"}}>

                            <button onClick={() => setState({...state, openDialog: false})}
                                    className="btn btn-primary primary-btn">Aceptar
                            </button>
                            <button onClick={() => setState({...state, openDialog: false})}
                                    className="btn btn-secondary secondary-btn">Cerrar
                            </button>

                        </DialogActions>
                    </div>
                    }
                    {state.tipoModal === 3 &&
                    <div className="row" style={{backgroundColor: '#FFFFFF'}}>
                        <div align="right">
                            <button onClick={() => {
                                history.push("/TipoUnidad")
                            }} className="btn btn-primary primary-btn">Agregar
                            </button>
                        </div>
                        {dataTipoUnidad.length !== 0 ? <TableTipoUnidad object={state}
                                                                        select={state[state.identificadorModal] && state[state.identificadorModal].m_nIdTipoUnidad}
                                                                        columns={columnsTipoUnidades}
                                                                        data={dataTipoUnidad}
                                                                        identificadorModal={state.identificadorModal}/> :
                            <div>No se encontró ningún registro</div>}

                        <DialogActions style={{justifyContent: "left"}}>

                            <button onClick={() => setState({...state, openDialog: false})}
                                    className="btn btn-primary primary-btn">Aceptar
                            </button>
                            <button onClick={() => setState({...state, openDialog: false})}
                                    className="btn btn-secondary secondary-btn">Cerrar
                            </button>

                        </DialogActions>
                    </div>
                    }
                    {state.tipoModal === 4 &&
                    <div className="row" style={{backgroundColor: '#FFFFFF'}}>
                        <div align="right">
                            <button onClick={() => {
                                history.push("/Unidades")
                            }} className="btn btn-primary primary-btn">Agregar
                            </button>

                        </div>

                        {dataUnidad.length !== 0 ? <TableUnidad object={state}
                                                                select={state[state.identificadorModal] && state[state.identificadorModal].m_nIdUnidad}
                                                                columns={columnsUnidades} data={dataUnidad}
                                                                identificadorModal={state.identificadorModal}/> :
                            <div>No se encontró ningún registro</div>}

                        <DialogActions style={{justifyContent: "left"}}>
                            <button onClick={() => setState({...state, openDialog: false})}
                                    className="btn btn-primary primary-btn">Aceptar
                            </button>
                            <button onClick={() => setState({...state, openDialog: false})}
                                    className="btn btn-secondary secondary-btn">Cerrar
                            </button>

                        </DialogActions>
                    </div>
                    }
                    {state.tipoModal === 5 &&
                    <div className="row" style={{backgroundColor: '#FFFFFF'}}>
                        <div align="right">
                            <button onClick={() => {
                                history.push("/RemitenteDestinatarios")
                            }} className="btn btn-primary primary-btn">Agregar
                            </button>

                        </div>

                        {dataRemitenteDestinatario.length !== 0 ? <TableRemitentesDestinatarios object={state}
                                                                                                select={state[state.identificadorModal] && state[state.identificadorModal].m_nIdRemitenteDestinatario}
                                                                                                columns={columnsRemitenteDestinatarios}
                                                                                                data={dataRemitenteDestinatario}
                                                                                                identificadorModal={state.identificadorModal}/> :
                            <div>No se encontró ningún registro</div>}

                        <DialogActions style={{justifyContent: "left"}}>

                            <button onClick={() => setState({...state, openDialog: false})}
                                    className="btn btn-primary primary-btn">Aceptar
                            </button>
                            <button onClick={() => setState({...state, openDialog: false})}
                                    className="btn btn-secondary secondary-btn">Cerrar
                            </button>

                        </DialogActions>
                    </div>
                    }
                    {state.tipoModal === 6 &&
                    <div className="row" style={{backgroundColor: '#FFFFFF'}}>

                        <div>
                            <label className="input select">
                                <FormControl fullWidth variant="outlined" margin="dense">
                                    <InputLabel id="sucursalListadoLabel">Selecciona el Formato</InputLabel>
                                    <Select
                                        labelId="sucursalListadoLabel"
                                        label="Selecciona el Formato"
                                        className="form-control"
                                        required
                                        value={state.sucursalListado}
                                        onChange={handleSucursalFiltro}
                                        id="sucursalListado"
                                    >
                                        {dataSucursal.map((sucursal) => (
                                            <option
                                                key={sucursal.m_nIdSucursal}
                                                value={sucursal.m_nIdSucursal}
                                            >
                                                {sucursal.m_sSucursal}
                                            </option>
                                        ))}
                                    </Select>
                                </FormControl>
                                <i></i>
                            </label>
                        </div>

                        <DialogActions style={{justifyContent: "left"}}>

                            <button onClick={() => handleImprimir()} className="btn btn-primary primary-btn">Aceptar
                            </button>
                            <button onClick={() => setState({...state, openDialog: false})}
                                    className="btn btn-secondary secondary-btn">Cerrar
                            </button>

                        </DialogActions>
                    </div>
                    }</DialogContent>

            </Dialog>

            <header className="topbar clearfix">
                <Cabecera/>
            </header>

            {/*Leftbar Start Here*/}
            <aside className="iconic-leftbar" style={{minHeight: state.height}}>
                <BarraLateralIzquierda/>
            </aside>
            {/*Leftbar End Here*/}

            {/*Page Container Start Here*/}
            <section className="main-container">
                <div className="container-fluid">
                    <div className="page-header filled full-block light">
                        <div className="row ">
                            <div className="col-md-6 col-sm-6">
                                <h2>Recolección</h2>
                            </div>
                            <div className="col-md-6 col-sm-6">
                                <ul className="list-page-breadcrumb">
                                    <li className="active-page">Recolección</li>
                                </ul>
                            </div>
                        </div>
                    </div>

                    <ul className="nav navStatica nav-tabs">
                        <li className="active">
                            <a data-toggle="tab" href="#Listado">
                                <i className="fa fa-list"/> Listado
                            </a>
                        </li>
                        <li>
                            <a data-toggle="tab" href="#Agregar" onClick={handleShowAgregar}>
                                <i className="fa fa-plus-circle"/> {state.agregar}
                            </a>
                        </li>

                        <li>
                            <a onClick={() => {
                                setState({
                                    ...state,
                                    identificadorModal:
                                        "imprimir",
                                    tipoModal: 6,
                                    openDialog: true
                                });
                            }}>
                                <i className="fa fa-times-circle"/> Imprimir
                            </a>
                        </li>


                        <li>
                            <a data-toggle="tab" href="#Cancelar" onClick={handleShowCancelar}
                               className={state.idRecoleccion === 0 ? classes.disabled : ""}>
                                <i className="zmdi zmdi-print"/> Cancelar
                            </a>
                        </li>

                        <li>
                            <a data-toggle="tab" href="#Salida-Llegada" onClick={handleShowSalidaLlegada}
                               className={state.idRecoleccion === 0 ? classes.disabled : ""}>
                                <i className="fa fa-times-circle"/> Salida
                            </a>
                        </li>
                        <li>
                            <a data-toggle="tab" href="#Salida-Llegada" onClick={handleShowSalidaLlegada}
                               className={state.idRecoleccion === 0 ? classes.disabled : ""}>
                                <i className="fa fa-times-circle"/> Llegada
                            </a>
                        </li>

                        <li>
                            <a data-toggle="tab" href="#Prueba">
                                <i className="zmdi zmdi-print"/> Boton de prueba
                            </a>
                        </li>

                        <li style={{float: "right"}}>
                            <a data-toggle="tab" href="#" className={state.idRecoleccion === 0 ? classes.disabled : ""}
                               style={{textAlign: "right"}} onClick={() => setRedirect(true)}>
                                Generar embarque
                            </a>
                        </li>

                        {/**<button className="topbar-right pull-right">Boton</button>*/}
                    </ul>

                    <div
                        className="row tab-content"
                        style={{paddingLeft: "-15px"}}
                    >
                        <div id="Listado" className="tab-pane fade in active">
                            <div className="widget-wrap">
                                <form className="j-forms">
                                    <div className="row" style={{display: "flex"}}>
                                        <div className="col-sm-6 col-md-3 unit" style={{paddingLeft: "0px"}}>
                                            <div className="input">
                                                <TextField
                                                    autoFocus
                                                    type="date"
                                                    margin="dense"
                                                    label="Fecha Inicial"
                                                    variant="outlined"
                                                    className="form-control"
                                                    InputLabelProps={{
                                                        shrink: true,
                                                    }}
                                                    value={state.fechaInicial}
                                                    onChange={handleFechaInicialFiltro}
                                                    id="fechaInicial"
                                                />
                                            </div>
                                        </div>

                                        <div className="col-sm-6 col-md-3 unit" style={{paddingLeft: "0px"}}>
                                            <div className="input">
                                                <TextField variant="outlined" margin="dense"
                                                           type="date"
                                                           className="form-control"
                                                           label="Fecha Final"
                                                           InputLabelProps={{
                                                               shrink: true,
                                                           }}
                                                           value={state.fechaFinal}
                                                           onChange={handleFechaFinalFiltro}
                                                           id="fechaFinal"
                                                />
                                            </div>

                                        </div>

                                        <div className="col-sm-6 col-md-3 unit" style={{paddingLeft: "0px"}}>
                                            <label className="input select">
                                                <FormControl fullWidth variant="outlined" margin="dense">
                                                    <InputLabel id="sucursalListadoLabel">Sucursal</InputLabel>
                                                    <Select
                                                        labelId="sucursalListadoLabel"
                                                        label="Sucursal"
                                                        className="form-control"
                                                        required
                                                        value={state.sucursalListado}
                                                        onChange={handleSucursalFiltro}
                                                        id="sucursalListado"
                                                    >
                                                        <option value="0">Todas</option>
                                                        {dataSucursal.map((sucursal) => (
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

                                        <div className="col-sm-6 col-md-3 unit" style={{paddingLeft: "0px"}}>
                                            <label className="input select">
                                                <FormControl fullWidth variant="outlined" margin="dense">
                                                    <InputLabel id="estatusListadoLabel">Estatus</InputLabel>
                                                    <Select
                                                        labelId="estatusListadoLabel"
                                                        className="form-control"
                                                        required
                                                        label="Estatus"
                                                        value={state.estatusListado}
                                                        onChange={handleEstatusFiltro}
                                                        id="estatusListado"
                                                    >
                                                        <option value="0">Todos</option>
                                                        {dataEstatusRecoleccion.map((estatus) => (
                                                            <option
                                                                key={estatus.m_nIdEstatusRecoleccion}
                                                                value={estatus.m_nIdEstatusRecoleccion}
                                                            >
                                                                {estatus.m_sEstatus}
                                                            </option>
                                                        ))}
                                                    </Select>
                                                </FormControl>
                                            </label>
                                        </div>
                                    </div>
                                </form>
                                <div className="row" style={{height: state.height - 250, width: '100%'}}>
                                    {conDatos() ? (
                                        <DataGrid
                                            className={classes.root}
                                            components={{
                                                LoadingOverlay: CustomLoadingOverlay,
                                            }}
                                            loading={data == undefined}
                                            rows={data}
                                            columns={columns}
                                            density="compact"
                                            pageSize={Math.floor((state.height - 310) / 30)}
                                            getRowId={(row) => row.m_nIdRecoleccion}
                                            onRowSelected={(row) => {
                                                setState({
                                                    ...state,
                                                    idRecoleccion: row.data.m_nIdRecoleccion
                                                })
                                            }}
                                        />
                                    ) : (
                                        <div>No se encontró ningún registro</div>
                                    )}
                                </div>
                            </div>

                        </div>

                        <div id="Agregar" className="tab-pane fade">
                            <form className="j-forms" onSubmit={handleAceptar}>
                                <div className="form-content">
                                    <div
                                        className="wizard-breadcrumb number-style"
                                        style={{
                                            position: "sticky",
                                            top: "150px",
                                            padding: "5px",
                                            backgroundColor: "white",
                                            zIndex: 100,
                                            marginBottom: "10px",
                                        }}
                                    >
                                        <div className="row ">
                                            <div
                                                className={
                                                    "col-sm-3 col-md-2-5 col-lg-2-5 step " +
                                                    (stepActive === 1 && "active-step")
                                                }
                                                onClick={() => openSection(1)}
                                            >
                                                <div className={"steps"}>
                                                    <span className={"step-number"}>1</span>
                                                    <p>Información General</p>
                                                </div>
                                            </div>
                                            <div
                                                className={
                                                    "col-sm-3 col-md-2-5 col-lg-2-5 step " +
                                                    (stepActive === 2 && "active-step")
                                                }
                                                onClick={() => openSection(2)}
                                            >
                                                <div className="steps">
                                                    <span className="step-number">2</span>
                                                    <p>Remitentes / Destinatario</p>
                                                </div>
                                            </div>
                                            <div
                                                className={
                                                    "col-sm-3 col-md-2-5 col-lg-2-5 step " +
                                                    (stepActive === 3 && "active-step")
                                                }
                                                onClick={() => openSection(3)}
                                            >
                                                <div className="steps">
                                                    <span className="step-number">3</span>
                                                    <p>Paquetes y Sobres</p>
                                                </div>
                                            </div>

                                            <div
                                                className={
                                                    "col-sm-3 col-md-2-5 col-lg-2-5 step " +
                                                    (stepActive === 4 && "active-step")
                                                }
                                                onClick={() => openSection(4)}
                                            >
                                                <div className="steps">
                                                    <span className="step-number">4</span>
                                                    <p>Información Adicional del Pago</p>
                                                </div>
                                            </div>
                                            <div
                                                className={
                                                    "col-sm-3 col-md-2-5 col-lg-2-5 step" +
                                                    (stepActive === 5 && "active-step")
                                                }
                                                onClick={() => openSection(5)}
                                            >
                                                <div className="steps">
                                                    <span className="step-number">5</span>
                                                    <p>Detalles de Operación</p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="widget-wrap" id="informacionGeneral">
                                        <div className="widget-header">
                                            <h2>Información General</h2>
                                        </div>
                                        <div className="widget-container">
                                            <div className="widget-content">
                                                <div className="row ">
                                                    <div className="col-md-12">
                                                        <div className="col-sm-6 col-md-2-5 col-lg-2-5 unit">
                                                            {" "}
                                                            <label className="input select">
                                                                <FormControl fullWidth variant="outlined"
                                                                             margin="dense">
                                                                    <InputLabel
                                                                        id="idSucursalAgregarLabel">Sucursal</InputLabel>
                                                                    <Select
                                                                        labelId="idSucursalAgregarLabel"
                                                                        label="Sucursal"
                                                                        className="form-control"
                                                                        required
                                                                        value={state.idSucursalAgregar}
                                                                        onChange={handleChange}
                                                                        id="idSucursalAgregar"

                                                                        disabled="disabled"
                                                                    >
                                                                        {dataSucursal.map((sucursal) => (
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

                                                        <div className="col-sm-6 col-md-2-5 col-lg-2-5 unit">
                                                            <div className="input">
                                                                <TextField variant="outlined" margin="dense"
                                                                           onChange={handleChange}
                                                                           className="form-control"
                                                                           type="text"
                                                                           label="Folio Recolección"
                                                                           value={state.folioRecoleccion}
                                                                           id="folioRecoleccion"
                                                                           readOnly
                                                                />
                                                            </div>
                                                        </div>

                                                        <div className="col-sm-6 col-md-2-5 col-lg-2-5 unit">
                                                            <div className="input">
                                                                <TextField variant="outlined" margin="dense"
                                                                           onChange={handleChange}
                                                                           className="form-control"
                                                                           type="text"
                                                                           label="Folio Embarque"
                                                                           value={state.folioEmbarque}
                                                                           id="folioEmbarque"
                                                                           readOnly
                                                                />
                                                            </div>
                                                        </div>

                                                        <div className="col-sm-6 col-md-2-5 col-lg-2-5 unit">
                                                            <div className="input">
                                                                <TextField variant="outlined" margin="dense"
                                                                           onChange={handleChange}
                                                                           className="form-control"
                                                                           type="text"
                                                                           label="Folio Guía"
                                                                           value={state.folioGuía}
                                                                           id="folioGuía"
                                                                           readOnly
                                                                />
                                                            </div>
                                                        </div>

                                                        <div className="col-sm-6 col-md-2-5 col-lg-2-5 unit">
                                                            <div className="input">
                                                                <TextField variant="outlined" margin="dense"
                                                                           onChange={handleChange}
                                                                           className="form-control"
                                                                           type="text"
                                                                           label="Folio Informe"
                                                                           value={state.folioInforme}
                                                                           id="folioInforme"
                                                                           readOnly
                                                                />
                                                            </div>
                                                        </div>

                                                        <div className="col-sm-6 col-md-2-5 col-lg-2-5 unit">
                                                            <div className="input">
                                                                <TextField variant="outlined" margin="dense"
                                                                           onChange={handleChange}
                                                                           required
                                                                           label="Fecha / Hora de Registro"
                                                                           InputLabelProps={{
                                                                               shrink: true,
                                                                           }}
                                                                           value={state.fechaHoraRegistro}
                                                                           className="form-control"
                                                                           id="fechaHoraRegistro"
                                                                           type="datetime-local"
                                                                           disabled={state.agregar === "Consultar" || state.agregar === "Modificar"}

                                                                />
                                                            </div>
                                                        </div>

                                                        <div className="col-sm-6 col-md-2-5 col-lg-2-5 unit">

                                                            <label className="input select">
                                                                <FormControl fullWidth variant="outlined"
                                                                             margin="dense">
                                                                    <InputLabel id="estatusRecoleccionLabel">Estatus de
                                                                        la Recolección</InputLabel>
                                                                    <Select
                                                                        labelId="estatusRecoleccion"
                                                                        className="form-control"
                                                                        required
                                                                        label="Estatus de la Recolección"
                                                                        value={state.estatusRecoleccion}
                                                                        onChange={handleChange}
                                                                        disabled={state.agregar === "Consultar"}
                                                                        id="estatusRecoleccion"
                                                                    >
                                                                        {dataEstatusRecoleccion.map((estatus) => (
                                                                            <option
                                                                                key={estatus.m_nIdEstatusRecoleccion}
                                                                                value={estatus.m_nIdEstatusRecoleccion}
                                                                            >
                                                                                {estatus.m_sEstatus}
                                                                            </option>
                                                                        ))}
                                                                    </Select>
                                                                </FormControl>
                                                                <i></i>
                                                            </label>
                                                        </div>

                                                        <div className="col-sm-6 col-md-2-5 col-lg-2-5 unit">
                                                            <label className="input select">
                                                                <FormControl fullWidth variant="outlined"
                                                                             margin="dense">
                                                                    <InputLabel id="monedaLabel">Moneda</InputLabel>
                                                                    <Select
                                                                        labelId="monedaLabel"
                                                                        label="Moneda"
                                                                        className="form-control"
                                                                        required
                                                                        value={state.moneda}
                                                                        onChange={handleChange}
                                                                        disabled={state.agregar === "Consultar"}
                                                                        id="moneda"
                                                                    >
                                                                        <option value="0">Seleccionar</option>
                                                                        {dataTipoMoneda.map((moneda) => (
                                                                            <option
                                                                                key={moneda.m_nIdMoneda}
                                                                                value={moneda.m_nIdMoneda}
                                                                            >
                                                                                {moneda.m_sMoneda}
                                                                            </option>
                                                                        ))}
                                                                    </Select>
                                                                </FormControl>
                                                                <i className="fa fa-arrow-down"/>
                                                            </label>
                                                        </div>

                                                        <div className="col-sm-6 col-md-2-5 col-lg-2-5 unit">
                                                            <label className="input select">
                                                                <FormControl fullWidth variant="outlined"
                                                                             margin="dense">
                                                                    <InputLabel id="tipoCambioLabel">Tipo de
                                                                        Cambio</InputLabel>
                                                                    <Select
                                                                        labelId="tipoCambioLabel"
                                                                        label="Tipo de Cambio"
                                                                        className="form-control"
                                                                        required
                                                                        value={state.tipoCambio}
                                                                        onChange={handleChange}
                                                                        disabled={state.agregar === "Consultar"}
                                                                        id="tipoCambio"
                                                                    >
                                                                        <option value="0">Seleccionar</option>
                                                                        {dataTipoCambio.map((cambio) => (
                                                                            <option
                                                                                key={cambio.m_nIdTipoCambio}
                                                                                value={cambio.m_nIdTipoCambio}
                                                                            >
                                                                                {cambio.m_cTipoCambio}
                                                                            </option>
                                                                        ))}
                                                                    </Select>
                                                                </FormControl>
                                                                <i className="fa fa-arrow-down"/>
                                                            </label>
                                                        </div>


                                                        <div className="col-sm-6 col-md-2-5 col-lg-2-5 unit">
                                                            <label className="input select">
                                                                <FormControl fullWidth variant="outlined"
                                                                             margin="dense">
                                                                    <InputLabel id="tipoCobroLabel">Tipo
                                                                        Cobro</InputLabel>
                                                                    <Select
                                                                        labelId="tipoCobroLabel"
                                                                        label="Tipo Cobro"
                                                                        className="form-control"
                                                                        required
                                                                        value={state.tipoCobro}
                                                                        disabled={state.agregar === "Consultar"}
                                                                        onChange={handleChange}
                                                                        id="tipoCobro"
                                                                    >
                                                                        <option value="0">Seleccionar</option>
                                                                        {dataTipoCobro.map((tipoCobro) => (
                                                                            <option
                                                                                key={tipoCobro.m_nIdTipoCobro}
                                                                                value={tipoCobro.m_nIdTipoCobro}
                                                                            >
                                                                                {tipoCobro.m_sDescripcion}
                                                                            </option>
                                                                        ))}
                                                                    </Select>
                                                                </FormControl>
                                                            </label>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="row ">
                                        <div className="col-md-7" style={{height:"600px"}}>
                                            <div className="widget-wrap" id="remitenteDestinatario">
                                                <div className="row">
                                                    <div className="col-md-6">
                                                        <div className="widget-header">
                                                            <h2>Remitente</h2>
                                                        </div>
                                                        <div className="widget-container">
                                                            <div className="widget-content">
                                                                <div className="row">
                                                                    {/* --------------------------------------- Nombre -------------------------------------- */}
                                                                    <div className="col-sm-12 col-md-12  unit">
                                                                        <div className="input">
                                                                            <Autocomplete
                                                                                value={state.nombreRemitente}
                                                                                disabled={state.agregar === "Consultar"}
                                                                                freeSolo
                                                                                onChange={(event, newValue) => {
                                                                                    handleSelectRemitente(newValue)
                                                                                }}
                                                                                id="nombreRemitente"
                                                                                disableClearable
                                                                                label="Nombre"
                                                                                forcePopupIcon={false}
                                                                                options={dataRemitenteDestinatario}
                                                                                getOptionLabel={(option) =>
                                                                                    option.m_sNombreFiscal
                                                                                }
                                                                                style={{
                                                                                    transform: "translate(14px, 10px) scale(1) !important"
                                                                                }}
                                                                                renderInput={(params) => (
                                                                                    <div>
                                                                                        <TextField
                                                                                            required
                                                                                            variant="outlined"
                                                                                            label="Nombre"
                                                                                            margin="dense"
                                                                                            className="form-control"
                                                                                            
                                                                                            {...params}
                                                                                            InputProps={{
                                                                                                ...params.InputProps,
                                                                                                style: {
                                                                                                    height: "33px",
                                                                                                    fontSize: "14px"
                                                                                                },
                                                                                                type: "search",
                                                                                                disableUnderline: true,
                                                                                                endAdornment: (
                                                                                                    <InputAdornment
                                                                                                        position="end">
                                                                                                        <IconButton
                                                                                                            padding="0px"
                                                                                                            style={{
                                                                                                                paddingRight: "0px",
                                                                                                            }}
                                                                                                            disabled={state.agregar === "Consultar"}
                                                                                                            onClick={() => {
                                                                                                                setState({
                                                                                                                    ...state,
                                                                                                                    identificadorModal:
                                                                                                                        "nombreRemitente",
                                                                                                                    tipoModal: 5,
                                                                                                                    openDialog: true
                                                                                                                });
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
                                                                    {/* --------------------------------------- RFC -------------------------------------- */}
                                                                    <div className="col-sm-12 col-md-8 unit">
                                                                        {" "}
                                                                        <div className="input">
                                                                            <TextField variant="outlined" margin="dense"
                                                                                       onChange={handleChange}
                                                                                       className="form-control"
                                                                                       type="text"
                                                                                       fullWidth
                                                                                       label="RFC"
                                                                                       pattern="[A-Z&Ñ]{3,4}[0-9]{2}(0[1-9]|1[012])(0[1-9]|[12][0-9]|3[01])[A-Z0-9]{2}[0-9A]"
                                                                                       title="Favor de introducir un RFC válido."
                                                                                       required
                                                                                       value={state.RFCRemitente}
                                                                                       disabled={state.agregar === "Consultar"}
                                                                                       id="RFCRemitente"
                                                                            />
                                                                        </div>
                                                                    </div>
                                                                    {/* --------------------------------------- Domicilio -------------------------------------- */}
                                                                    <div className="col-sm-12 col-md-12 unit">
                                                                        <div className="input">
                                                                            <TextField variant="outlined" margin="dense"
                                                                                       onChange={handleChange}
                                                                                       className="form-control"
                                                                                       type="text"
                                                                                       required
                                                                                       label="Domicilio"
                                                                                       value={state.domicilioRemitente}
                                                                                       disabled={state.agregar === "Consultar"}
                                                                                       id="domicilioRemitente"
                                                                            />
                                                                        </div>
                                                                    </div>
                                                                    {/* --------------------------------------- AutocompleteCPRemitente -------------------------------------- */}
                                                                    <div className="col-sm-12 col-md-8 unit">

                                                                        <div className="input">
                                                                            <Autocomplete
                                                                                value={state.codigoPostalRemitente}
                                                                                freeSolo
                                                                                onChange={(event, newValue) => {
                                                                                    handleShowCiudadRemitente(newValue.m_nIdCP)
                                                                                }}
                                                                                id="codigoPostalRemitente"
                                                                                disableClearable
                                                                                forcePopupIcon={false}
                                                                                options={dataCodigoPostal}
                                                                                disabled={state.agregar === "Consultar"}
                                                                                getOptionLabel={(option) =>
                                                                                    option.m_sCP
                                                                                }
                                                                                variant="outlined"
                                                                                style={{
                                                                                    transform: "translate(14px, 10px) scale(1) !important"
                                                                                }}
                                                                                renderInput={(params) => (
                                                                                    <div>
                                                                                        <TextField
                                                                                            variant="outlined"
                                                                                            label="Código Postal"
                                                                                            margin="dense"
                                                                                            required
                                                                                            {...params}
                                                                                            InputProps={{
                                                                                                ...params.InputProps,
                                                                                                style: {
                                                                                                    height: "33px",
                                                                                                    fontSize: "14px"
                                                                                                },
                                                                                                type: "search",
                                                                                                disableUnderline: true,
                                                                                                disabled: state.agregar === "Consultar",
                                                                                                endAdornment: (
                                                                                                    <InputAdornment
                                                                                                        position="end">
                                                                                                        <IconButton
                                                                                                            padding="0px"
                                                                                                            style={{
                                                                                                                paddingRight: "0px",
                                                                                                            }}
                                                                                                            disabled={state.agregar === "Consultar"}
                                                                                                            onClick={() => {
                                                                                                                setState({
                                                                                                                    ...state,
                                                                                                                    identificadorModal:
                                                                                                                        "codigoPostalRemitente",
                                                                                                                    tipoModal: 0,
                                                                                                                    openDialog: true
                                                                                                                });
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
                                                                    {/* --------------------------------------- Ciudad ------------------------------------------------- */}
                                                                    <div className="col-sm-12 col-md-12 col-lg-12 unit">
                                                                        <label className="input select">
                                                                            <FormControl fullWidth variant="outlined"
                                                                                         margin="dense">
                                                                                <InputLabel
                                                                                    id="ciudadRemitenteLabel">Ciudad</InputLabel>
                                                                                <Select
                                                                                    labelId="ciudadRemitenteLabel"
                                                                                    label="Ciudad"
                                                                                    className="form-control"
                                                                                    required
                                                                                    value={state.ciudadRemitente}
                                                                                    disabled={state.agregar === "Consultar"}
                                                                                    onChange={handleChange}
                                                                                    onSelect={ getAllCodigosPostales(state.ciudadRemitente)}     
                                                
                                                                                    id="ciudadRemitente"
                                                                                >
                                                                                    {dataCiudad.map((ciudad) => (
                                                                                        <option
                                                                                            key={ciudad.m_nIdCiudad}
                                                                                            value={ciudad.m_nIdCiudad}
                                                                                        >
                                                                                            {ciudad.m_sCiudad}
                                                                                        </option>
                                                                                    ))}
                                                                                </Select>
                                                                            </FormControl>
                                                                            <i className="fa fa-arrow-down"/>
                                                                        </label>
                                                                    </div>
                                                                    {/* --------------------------------------- Correo ------------------------------------------------- */}
                                                                    <div className="col-sm-12 col-md-12 unit">

                                                                        <div className="input">
                                                                            <TextField variant="outlined" margin="dense"
                                                                                       onChange={handleChange}
                                                                                       className="form-control"
                                                                                       type="email"
                                                                                       required
                                                                                       label="Correo Electrónico"
                                                                                       value={state.correoRemitente}
                                                                                       disabled={state.agregar === "Consultar"}
                                                                                       id="correoRemitente"
                                                                            />
                                                                        </div>
                                                                    </div>
                                                                    {/* --------------------------------------- Telefono ------------------------------------------------- */}
                                                                    <div className="col-sm-12 col-md-12 unit">
                                                                        <div className="input">
                                                                            <TextField variant="outlined" margin="dense"
                                                                                       onChange={handleChange}
                                                                                       className="form-control"
                                                                                       type="text"
                                                                                       pattern="[0-9]{10}"
                                                                                       maxLength="10"
                                                                                       required
                                                                                       label="Teléfono"
                                                                                       value={state.telefonoRemitente}
                                                                                       disabled={state.agregar === "Consultar"}
                                                                                       id="telefonoRemitente"
                                                                            />
                                                                        </div>
                                                                    </div>
                                                                    {/* --------------------------------------- Contacto ------------------------------------------------- */}
                                                                    <div className="col-sm-12 col-md-12 unit">
                                                                        <div className="input">
                                                                            <TextField variant="outlined" margin="dense"
                                                                                       onChange={handleChange}
                                                                                       className="form-control"
                                                                                       type="text"
                                                                                       label="Contacto"
                                                                                       required
                                                                                       value={state.contactoRemitente}
                                                                                       disabled={state.agregar === "Consultar"}
                                                                                       id="contactoRemitente"
                                                                            />
                                                                        </div>
                                                                    </div>
                                                                    {/* --------------------------------------- Origen ------------------------------------------------- */}
                                                                    <div className="col-sm-12 col-md-12 unit">
                                                                        <div className="input">
                                                                            <Autocomplete
                                                                                freeSolo
                                                                                onChange={(event, newValue) =>
                                                                                    setState({
                                                                                        ...state,
                                                                                        origenRemitente: newValue,
                                                                                    })
                                                                                }
                                                                                value={state.origenRemitente}
                                                                                disabled={state.agregar === "Consultar"}
                                                                                id="origenRemitente"
                                                                                disableClearable
                                                                                forcePopupIcon={false}
                                                                                options={dataCiudad}
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
                                                                                            required
                                                                                            {...params}
                                                                                            InputProps={{
                                                                                                ...params.InputProps,
                                                                                                style: {
                                                                                                    height: "33px",
                                                                                                    fontSize: "14px"
                                                                                                },
                                                                                                type: "search",
                                                                                                value: state.origenRemitente,
                                                                                                disabled: state.agregar === "Consultar",
                                                                                                disableUnderline: true,
                                                                                                endAdornment: (
                                                                                                    <InputAdornment
                                                                                                        position="end">
                                                                                                        <IconButton
                                                                                                            padding="0px"
                                                                                                            style={{
                                                                                                                paddingRight: "0px",
                                                                                                            }}
                                                                                                            disabled={state.agregar === "Consultar"}
                                                                                                            onClick={() => {
                                                                                                                setState({
                                                                                                                    ...state,
                                                                                                                    identificadorModal:
                                                                                                                        "origenRemitente",
                                                                                                                    tipoModal: 1,
                                                                                                                    openDialog: true
                                                                                                                });
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
                                                                    {/* --------------------------------------- RecoleccionDD ------------------------------------------------- */}
                                                                    <div className="col-sm-12 col-md-12 unit">
                                                                        <label className="label">
                                                                            Recolección en Diferente Domicilio
                                                                        </label>
                                                                        <div className="form">
                                                                            <input
                                                                                onChange={
                                                                                    handleRecoleccionCheckboxChange
                                                                                }
                                                                                className="form-control"
                                                                                value={state.diferenteRecoleccion}
                                                                                disabled={state.agregar === "Consultar"}
                                                                                checked={state.diferenteRecoleccion}
                                                                                type="checkbox"
                                                                                style={{height:"20px"}}
                                                                                id="diferenteRecoleccion"
                                                                            />
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div className="col-md-6">
                                                        <div className="widget-header">
                                                            <h2>Destinatario</h2>
                                                        </div>
                                                        <div className="widget-container">
                                                            <div className="widget-content">
                                                                <div className="col-sm-12 col-md-12    unit">
                                                                    <div className="input">
                                                                        <Autocomplete
                                                                            onChange={(event, newValue) => {
                                                                                handleSelectDestinatario(newValue)
                                                                            }}
                                                                            value={state.nombreDestinatario}
                                                                            disabled={state.agregar === "Consultar"}
                                                                            freeSolo


                                                                            id="nombreRemitente"
                                                                            disableClearable
                                                                            forcePopupIcon={false}
                                                                            options={dataRemitenteDestinatario}
                                                                            getOptionLabel={(option) =>
                                                                                option.m_sNombreFiscal
                                                                            }
                                                                            variant="outlined"
                                                                            style={{
                                                                                transform: "translate(14px, 10px) scale(1) !important"
                                                                            }}
                                                                            renderInput={(params) => (
                                                                                <div>
                                                                                    <TextField
                                                                                        label="Nombre"
                                                                                        margin="dense"
                                                                                        variant="outlined"
                                                                                        required
                                                                                        {...params}
                                                                                        InputProps={{
                                                                                            ...params.InputProps,
                                                                                            style: {
                                                                                                height: "33px",
                                                                                                fontSize: "14px"
                                                                                            },
                                                                                            type: "search",
                                                                                            disableUnderline: true,
                                                                                            endAdornment: (
                                                                                                <InputAdornment
                                                                                                    position="end">
                                                                                                    <IconButton
                                                                                                        padding="0px"
                                                                                                        style={{
                                                                                                            paddingRight: "0px",
                                                                                                        }}
                                                                                                        disabled={state.agregar === "Consultar"}
                                                                                                        onClick={() => {
                                                                                                            setState({
                                                                                                                ...state,
                                                                                                                identificadorModal:
                                                                                                                    "nombreDestinatario",
                                                                                                                tipoModal: 5,
                                                                                                                openDialog: true
                                                                                                            });
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
                                                                                                            onClick={() => {
                                                                                                                setState({
                                                                                                                    ...state,
                                                                                                                    identificadorModal:
                                                                                                                        "nombreDestinatario",
                                                                                                                    tipoModal: 5,
                                                                                                                    openDialog: true
                                                                                                                });
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

                                                                <div className="col-sm-12 col-md-8 unit">
                                                                    <div className="input">
                                                                        <TextField variant="outlined" margin="dense"
                                                                                   onChange={handleChange}
                                                                                   className="form-control"
                                                                                   type="text"
                                                                                   label="RFC"
                                                                                   pattern="[A-Z&Ñ]{3,4}[0-9]{2}(0[1-9]|1[012])(0[1-9]|[12][0-9]|3[01])[A-Z0-9]{2}[0-9A]"
                                                                                   title="Favor de introducir un RFC válido."
                                                                                   required
                                                                                   fullWidth
                                                                                   value={state.RFCDestinatario}
                                                                                   disabled={state.agregar === "Consultar"}
                                                                                   id="RFCDestinatario"
                                                                        />
                                                                    </div>
                                                                </div>

                                                                <div className="col-sm-12 col-md-12 unit">
                                                                    <div className="input">
                                                                        <TextField variant="outlined" margin="dense"
                                                                                   onChange={handleChange}
                                                                                   className="form-control"
                                                                                   type="text"
                                                                                   required
                                                                                   label="Domicilio"
                                                                                   value={state.domicilioDestinatario}
                                                                                   disabled={state.agregar === "Consultar"}
                                                                                   id="domicilioDestinatario"
                                                                        />
                                                                    </div>
                                                                </div>
                                                                <div className="col-sm-12 col-md-8 unit">
                                                                    <div className="input">
                                                                        <Autocomplete
                                                                            freeSolo
                                                                            onChange={(event, newValue) =>
                                                                                setState({
                                                                                    ...state,
                                                                                    codigoPostalDestinatario: newValue,
                                                                                })
                                                                            }
                                                                            value={state.codigoPostalDestinatario}
                                                                            disabled={state.agregar === "Consultar"}
                                                                            id="codigoPostalDestinatario"
                                                                            disableClearable
                                                                            options={dataCodigoPostal}
                                                                            getOptionLabel={(option) => option.m_sCP}
                                                                            variant="outlined"
                                                                            style={{
                                                                                transform: "translate(14px, 10px) scale(1) !important"
                                                                            }}
                                                                            renderInput={(params) => (
                                                                                <div>
                                                                                    <TextField
                                                                                        required
                                                                                        variant="outlined"
                                                                                        label="Código Postal"
                                                                                        margin="dense"
                                                                                        {...params}
                                                                                        InputProps={{
                                                                                            ...params.InputProps,
                                                                                            style: {
                                                                                                height: "33px",
                                                                                                fontSize: "14px"
                                                                                            },
                                                                                            type: "search",
                                                                                            disableUnderline: true,
                                                                                            disabled: state.agregar === "Consultar",
                                                                                            endAdornment: (
                                                                                                <InputAdornment
                                                                                                    position="end">
                                                                                                    {" "}
                                                                                                    <IconButton
                                                                                                        style={{
                                                                                                            paddingRight: "0px",
                                                                                                        }}
                                                                                                        disabled={state.agregar === "Consultar"}
                                                                                                        onClick={() => {
                                                                                                            setState({
                                                                                                                ...state,
                                                                                                                identificadorModal:
                                                                                                                    "codigoPostalDestinatario",
                                                                                                                tipoModal: 0,
                                                                                                                openDialog: true
                                                                                                            });
                                                                                                        }}
                                                                                                    >
                                                                                                        <PageviewIcon
                                                                                                            style={{
                                                                                                                color: "#F9A03E",
                                                                                                                fontSize: 32,
                                                                                                            }}
                                                                                                        />
                                                                                                    </IconButton>{" "}
                                                                                                </InputAdornment>
                                                                                            ),
                                                                                        }}
                                                                                    />
                                                                                </div>
                                                                            )}
                                                                        />
                                                                    </div>
                                                                </div>

                                                                <div className="col-sm-12 col-md-12  unit">
                                                                    <label className="input select">
                                                                        <FormControl fullWidth variant="outlined"
                                                                                     margin="dense">
                                                                            <InputLabel
                                                                                id="ciudadDestinatarioLabel">Ciudad</InputLabel>
                                                                            <Select
                                                                                labelId="ciudadDestinatarioLabel"
                                                                                label="Ciudad"
                                                                                className="form-control"
                                                                                required
                                                                                value={state.ciudadDestinatario}
                                                                                disabled={state.agregar === "Consultar"}
                                                                                onChange={handleChange}
                                                                                onSelect={ getAllCodigosPostales(state.ciudadDestinatario)}  
                                                                                id="ciudadDestinatario"
                                                                            >
                                                                                {dataCiudad.map((ciudad) => (
                                                                                    <option
                                                                                        key={ciudad.m_nIdCiudad}
                                                                                        value={ciudad.m_nIdCiudad}
                                                                                    >
                                                                                        {ciudad.m_sCiudad}
                                                                                    </option>
                                                                                ))}
                                                                            </Select>
                                                                        </FormControl>
                                                                        <i className="fa fa-arrow-down"/>
                                                                    </label>
                                                                </div>

                                                                <div className="col-sm-12 col-md-12 unit">

                                                                    <div className="input">
                                                                        <TextField variant="outlined" margin="dense"
                                                                                   label="Correo Electrónico"
                                                                                   onChange={handleChange}
                                                                                   className="form-control"
                                                                                   type="email"
                                                                                   required
                                                                                   value={state.correoDestinatario}
                                                                                   disabled={state.agregar === "Consultar"}
                                                                                   id="correoDestinatario"
                                                                        />
                                                                    </div>
                                                                </div>

                                                                <div className="col-sm-12 col-md-12 unit">
                                                                    <div className="input">
                                                                        <TextField variant="outlined" margin="dense"
                                                                                   onChange={handleChange}
                                                                                   className="form-control"
                                                                                   type="text"
                                                                                   label="Teléfono"
                                                                                   required
                                                                                   value={state.telefonoDestinatario}
                                                                                   disabled={state.agregar === "Consultar"}
                                                                                   id="telefonoDestinatario"
                                                                        />
                                                                    </div>
                                                                </div>

                                                                <div className="col-sm-12 col-md-12 unit">
                                                                    <div className="input">
                                                                        <TextField variant="outlined" margin="dense"
                                                                                   onChange={handleChange}
                                                                                   className="form-control"
                                                                                   type="text"
                                                                                   required
                                                                                   label="Contacto"
                                                                                   value={state.contactoDestinatario}
                                                                                   disabled={state.agregar === "Consultar"}
                                                                                   id="contactoDestinatario"
                                                                        />
                                                                    </div>
                                                                </div>

                                                                <div className="col-sm-12 col-md-12  unit">
                                                                    <div className="input">
                                                                        <Autocomplete
                                                                            freeSolo
                                                                            onChange={(event, newValue) =>
                                                                                setState({
                                                                                    ...state,
                                                                                    destinoDestinatario: newValue,
                                                                                })
                                                                            }
                                                                            value={state.destinoDestinatario}
                                                                            disabled={state.agregar === "Consultar"}
                                                                            id="destinoDestinatario"
                                                                            disableClearable
                                                                            forcePopupIcon={false}
                                                                            options={dataCiudad}
                                                                            getOptionLabel={(option) =>
                                                                                option.m_sCiudad
                                                                            }
                                                                            variant="outlined"
                                                                            style={{
                                                                                transform: "translate(14px, 10px) scale(1) !important"
                                                                            }}
                                                                            renderInput={(params) => (
                                                                                <div>
                                                                                    <TextField
                                                                                        required
                                                                                        variant="outlined"
                                                                                        className="form-control"
                                                                                        label="Destino"
                                                                                        margin="dense"
                                                                                        {...params}
                                                                                        InputProps={{
                                                                                            ...params.InputProps,
                                                                                            style: {
                                                                                                height: "33px",
                                                                                                fontSize: "14px"
                                                                                            },
                                                                                            type: "search",
                                                                                            value: state.origenRemitente,
                                                                                            disabled: state.agregar === "Consultar",
                                                                                            disableUnderline: true,
                                                                                            endAdornment: (
                                                                                                <InputAdornment
                                                                                                    position="end">
                                                                                                    <IconButton
                                                                                                        padding="0px"
                                                                                                        style={{
                                                                                                            paddingRight: "0px",
                                                                                                        }}
                                                                                                        disabled={state.agregar === "Consultar"}
                                                                                                        onClick={() => {
                                                                                                            setState({
                                                                                                                ...state,
                                                                                                                identificadorModal:
                                                                                                                    "destinoDestinatario",
                                                                                                                tipoModal: 1,
                                                                                                                openDialog: true
                                                                                                            });
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

                                                                <div className="col-sm-12 col-md-12  unit">
                                                                    <label className="label">
                                                                        Entrega en Diferente Domicilio
                                                                    </label>
                                                                    <div className="input">
                                                                        <input
                                                                            onChange={handleEntregaCheckboxChange}
                                                                            className="form-control"
                                                                            value={state.diferenteEntrega}
                                                                            disabled={state.agregar === "Consultar"}
                                                                            checked={state.diferenteEntrega}
                                                                            type="checkbox"
                                                                            style={{height:"20px"}}
                                                                            id="diferenteEntrega"
                                                                        />
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="widget-wrap col-md-5" id="paquetesSobres" style={{height:"600px"}}>

                                            <div className="row">
                                                <div className="col-md-6">
                                                    <form className="j-forms">
                                                        <div className="form-content">
                                                            <h2>Número de Paquetes</h2>

                                                            <a
                                                                className="btn"
                                                                style={{
                                                                    margin: "5px",
                                                                    backgroundColor: "#F9A03E",
                                                                    color: "white"
                                                                }}
                                                                onClick={() => removePaquete()}
                                                                disabled={state.agregar === "Consultar"}
                                                            >
                                                                <i className="zmdi zmdi-minus"></i>
                                                            </a>
                                                            <input type="number" value={state.countPaquetes}
                                                                   style={{width: "40px", textAlign: "center"}}/>
                                                            <a
                                                                className="btn"
                                                                style={{
                                                                    margin: "5px",
                                                                    backgroundColor: "#F9A03E",
                                                                    color: "white"
                                                                }}
                                                                onClick={() => addPaquete()}
                                                                disabled={state.agregar === "Consultar"}
                                                            >
                                                                <i className="zmdi zmdi-plus"></i>
                                                            </a>


                                                        </div>
                                                    </form>
                                                </div>
                                                <div className="col-md-6">
                                                    <h2>Número de Sobres</h2>
                                                    <a
                                                        className="btn"
                                                        style={{
                                                            margin: "10px",
                                                            backgroundColor: "#F9A03E",
                                                            color: "white"
                                                        }}
                                                        onClick={() => removeSobre()}
                                                        disabled={state.agregar === "Consultar"}
                                                    >
                                                        <i className="zmdi zmdi-minus"/>
                                                    </a>
                                                    <input type="number" value={state.countSobres}
                                                           style={{width: "40px", textAlign: "center"}}/>

                                                    <a
                                                        className="btn"
                                                        style={{
                                                            margin: "10px",
                                                            backgroundColor: "#F9A03E",
                                                            color: "white"
                                                        }}
                                                        onClick={() => addSobre()}
                                                        disabled={state.agregar === "Consultar"}
                                                    >
                                                        <i className="zmdi zmdi-plus"/>
                                                    </a>


                                                </div>
                                            </div>


                                            <div className="widget-container">
                                                <div className="widget-content">
                                                    <div className="row">
                                                        <div className="col-md-12">
                                                            <form className="j-forms">
                                                                <div className="form-content">

                                                                    {state.agregar !== "Consultar" ?
                                                                        <div style={{
                                                                            display: "flex",
                                                                            alignItems: "flex-end"
                                                                        }}>
                                                                            <div className="input">
                                                                                <input
                                                                                    onChange={(event) => {
                                                                                        setState({
                                                                                            ...state,
                                                                                            mismoPaquete: event.target.checked
                                                                                        })
                                                                                    }}
                                                                                    type="checkbox"
                                                                                    required
                                                                                    disabled={state.agregar === "Consultar"}
                                                                                    value={state.mismoPaquete}
                                                                                    id="mismoPaquete"
                                                                                />
                                                                            </div>
                                                                            <label className="label"
                                                                                   style={{paddingLeft: "10px"}}>Mismo
                                                                                Paquete</label>

                                                                        </div>
                                                                        : <span/>}
                                                                    <Carousel
                                                                        className={classes.paqueteCarrusel}
                                                                        widgets={[IndicatorDots, Buttons]}
                                                                        frames={framesPaquete}
                                                                    />


                                                                    {state.agregar !== "Consultar" ?
                                                                        <div style={{
                                                                            display: "flex",
                                                                            alignItems: "flex-end"
                                                                        }}>

                                                                            <div className="input">
                                                                                <input
                                                                                    onChange={(event) => {
                                                                                        setState({
                                                                                            ...state,
                                                                                            mismoSobre: event.target.checked
                                                                                        })
                                                                                    }}
                                                                                    type="checkbox"
                                                                                    required
                                                                                    value={state.mismoSobre}
                                                                                    id="mismoSobre"
                                                                                />
                                                                            </div>
                                                                            <label className="label"
                                                                                   style={{paddingLeft: "10px"}}>Mismo
                                                                                Sobre</label>
                                                                        </div>
                                                                        : <span/>}
                                                                    <Carousel
                                                                        className={classes.sobreCarrusel}
                                                                        widgets={[IndicatorDots, Buttons]}
                                                                        frames={framesSobre}
                                                                    />
                                                                </div>
                                                            </form>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="col-md-12">
                                        {state.diferenteRecoleccion || state.diferenteEntrega ? (
                                            <div className="widget-wrap" id="detallesRecoleccion">
                                                {state.diferenteRecoleccion ? (
                                                    <div>
                                                        <div className="widget-header">
                                                            <h2>Detalles de la Recolección</h2>
                                                        </div>
                                                        <div className="widget-container">
                                                            <div className="widget-content">
                                                                <div className="row">
                                                                    <div className="col-md-12">
                                                                        <div className="col-sm-6 col-md-4  unit">

                                                                            <div className="input">
                                                                                <TextField variant="outlined"
                                                                                           margin="dense"
                                                                                           onChange={handleChange}
                                                                                           className="form-control"
                                                                                           type="datetime-local"
                                                                                           label="Fecha y Hora"
                                                                                           InputLabelProps={{
                                                                                               shrink: true,
                                                                                           }}
                                                                                           value={state.fechaRecoleccion}
                                                                                           disabled={state.agregar === "Consultar"}
                                                                                           id="fechaRecoleccion"
                                                                                />
                                                                            </div>
                                                                        </div>

                                                                        <div className="col-sm-6 col-md-4  unit">

                                                                            <div className="input">
                                                                                <Autocomplete
                                                                                    freeSolo
                                                                                    onChange={(event, newValue) =>
                                                                                        setState({
                                                                                            ...state,
                                                                                            codigoPostalRecoleccion: newValue,
                                                                                        })
                                                                                    }
                                                                                    value={
                                                                                        state.codigoPostalRecoleccion
                                                                                    }
                                                                                    id="codigoPostalRecoleccion"
                                                                                    disableClearable
                                                                                    options={dataCodigoPostal}
                                                                                    disabled={state.agregar === "Consultar"}
                                                                                    getOptionLabel={(option) =>
                                                                                        option.m_sCP
                                                                                    }
                                                                                    variant="outlined"
                                                                                    style={{
                                                                                        transform: "translate(14px, 10px) scale(1) !important"
                                                                                    }}
                                                                                    renderInput={(params) => (
                                                                                        <div>
                                                                                            <TextField
                                                                                                variant="outlined"
                                                                                                label="Código Postal"
                                                                                                margin="dense"
                                                                                                className="form-control"
                                                                                                {...params}
                                                                                                InputProps={{
                                                                                                    ...params.InputProps,
                                                                                                    style: {
                                                                                                        height: "33px",
                                                                                                        fontSize: "14px"
                                                                                                    },
                                                                                                    type: "search",
                                                                                                    disabled: state.agregar === "Consultar",
                                                                                                    disableUnderline: true,
                                                                                                    endAdornment: (
                                                                                                        <InputAdornment
                                                                                                            position="end">
                                                                                                            {" "}
                                                                                                            <IconButton
                                                                                                                style={{
                                                                                                                    paddingRight: "0px",
                                                                                                                }}
                                                                                                                disabled={state.agregar === "Consultar"}
                                                                                                                onClick={() => {
                                                                                                                    setState({
                                                                                                                        ...state,
                                                                                                                        identificadorModal:
                                                                                                                            "codigoPostalRecoleccion",
                                                                                                                        tipoModal: 0,
                                                                                                                        openDialog: true
                                                                                                                    });
                                                                                                                }}
                                                                                                            >
                                                                                                                <PageviewIcon
                                                                                                                    style={{
                                                                                                                        color: "#F9A03E",
                                                                                                                        fontSize: 32,
                                                                                                                    }}
                                                                                                                />
                                                                                                            </IconButton>{" "}
                                                                                                        </InputAdornment>
                                                                                                    ),
                                                                                                }}
                                                                                            />
                                                                                        </div>
                                                                                    )}
                                                                                />
                                                                            </div>
                                                                        </div>

                                                                        <div className="col-sm-6 col-md-4  unit">
                                                                            <label className="input select">
                                                                                <FormControl fullWidth
                                                                                             variant="outlined"
                                                                                             margin="dense">
                                                                                    <InputLabel
                                                                                        id="ciudadRecoleccionLabel">Ciudad</InputLabel>
                                                                                    <Select
                                                                                        labelId="ciudadRecoleccionLabel"
                                                                                        label="Ciudad"
                                                                                        className="form-control"

                                                                                        value={state.ciudadRecoleccion}
                                                                                        disabled={state.agregar === "Consultar"}
                                                                                        onChange={handleChange}
                                                                                        id="ciudadRecoleccion"
                                                                                    >
                                                                                        {dataCiudad.map((ciudad) => (
                                                                                            <option
                                                                                                key={ciudad.m_nIdCiudad}
                                                                                                value={ciudad.m_nIdCiudad}
                                                                                            >
                                                                                                {ciudad.m_sCiudad}
                                                                                            </option>
                                                                                        ))}
                                                                                    </Select>
                                                                                </FormControl>
                                                                                <i className="fa fa-arrow-down"/>
                                                                            </label>
                                                                        </div>

                                                                        <div className="col-sm-6 col-md-4 unit">

                                                                            <label className="input select">
                                                                                <FormControl fullWidth
                                                                                             variant="outlined"
                                                                                             margin="dense">
                                                                                    <InputLabel
                                                                                        id="zonaRecoleccionLabel">Zona</InputLabel>
                                                                                    <Select
                                                                                        labelId="zonaRecoleccionLabel"
                                                                                        label="Zona"
                                                                                        className="form-control"

                                                                                        value={state.zonaRecoleccion}
                                                                                        disabled={state.agregar === "Consultar"}
                                                                                        onChange={handleChange}
                                                                                        id="zonaRecoleccion"
                                                                                    >
                                                                                        <option value="">Selecciona
                                                                                        </option>
                                                                                        {dataZona.map((zona) => (
                                                                                            <option
                                                                                                key={zona.m_nIdZona}
                                                                                                value={zona.m_nIdZona}
                                                                                            >
                                                                                                {zona.m_sDescripcion}
                                                                                            </option>
                                                                                        ))}
                                                                                    </Select>
                                                                                </FormControl>
                                                                                <i className="fa fa-arrow-down"/>
                                                                            </label>


                                                                        </div>

                                                                        <div className="col-sm-6 col-md-6  unit">

                                                                            <div className="input">
                                                                                <TextField variant="outlined"
                                                                                           margin="dense"
                                                                                           onChange={handleChange}
                                                                                           className="form-control"
                                                                                           type="text"
                                                                                           label="Domicilio"
                                                                                           value={state.domicilioRecoleccion}
                                                                                           disabled={state.agregar === "Consultar"}
                                                                                           id="domicilioRecoleccion"
                                                                                />
                                                                            </div>
                                                                        </div>

                                                                        <div className="col-sm-12 col-md-6  unit">

                                                                            <div className="input">
                                                                                <TextField variant="outlined"
                                                                                           margin="dense"
                                                                                           onChange={handleChange}
                                                                                           className="form-control"
                                                                                           type="text"
                                                                                           label="Recoger En"
                                                                                           value={state.recogerEn}
                                                                                           disabled={state.agregar === "Consultar"}
                                                                                           id="recogerEn"
                                                                                />
                                                                            </div>
                                                                        </div>

                                                                        <div className="col-sm-12 col-md-6  unit">

                                                                            <div className="input">
                                                                                <TextField variant="outlined"
                                                                                           margin="dense"
                                                                                           onChange={handleChange}
                                                                                           className="form-control"
                                                                                           type="text"
                                                                                           label="Datos Adicionales para la Recolección"
                                                                                           value={
                                                                                               state.datosAdicionalesRecoleccion
                                                                                           }
                                                                                           disabled={state.agregar === "Consultar"}
                                                                                           id="datosAdicionalesRecoleccion"
                                                                                />
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                ) : (
                                                    <div></div>
                                                )}

                                                {state.diferenteEntrega ? (
                                                    <div>
                                                        <div className="widget-header">
                                                            <h2>Detalles de la Entrega</h2>
                                                        </div>
                                                        <div className="widget-container">
                                                            <div className="widget-content">
                                                                <div className="row">
                                                                    <div className="col-md-12">
                                                                        <div className="col-sm-6 col-md-4  unit">

                                                                            <div className="input">
                                                                                <Autocomplete
                                                                                    freeSolo

                                                                                    onChange={(event, newValue) =>
                                                                                        setState({
                                                                                            ...state,
                                                                                            codigoPostalEntrega: newValue,
                                                                                        })
                                                                                    }
                                                                                    value={state.codigoPostalEntrega}
                                                                                    id="codigoPostalEntrega"
                                                                                    disableClearable
                                                                                    options={dataCodigoPostal}
                                                                                    disabled={state.agregar === "Consultar"}
                                                                                    getOptionLabel={(option) =>
                                                                                        option.m_sCP
                                                                                    }
                                                                                    variant="outlined"
                                                                                    style={{
                                                                                        transform: "translate(14px, 10px) scale(1) !important"
                                                                                    }}
                                                                                    renderInput={(params) => (
                                                                                        <div>
                                                                                            <TextField
                                                                                                variant="outlined"
                                                                                                label="Código Postal"
                                                                                                margin="dense"
                                                                                                className="form-control"
                                                                                                {...params}
                                                                                                InputProps={{
                                                                                                    ...params.InputProps,
                                                                                                    style: {
                                                                                                        height: "33px",
                                                                                                        fontSize: "14px"
                                                                                                    },
                                                                                                    type: "search",
                                                                                                    disabled: state.agregar === "Consultar",
                                                                                                    disableUnderline: true,
                                                                                                    endAdornment: (
                                                                                                        <InputAdornment
                                                                                                            position="end">
                                                                                                            {" "}
                                                                                                            <IconButton
                                                                                                                style={{
                                                                                                                    paddingRight: "0px",
                                                                                                                }}
                                                                                                                disabled={state.agregar === "Consultar"}
                                                                                                                onClick={() => {
                                                                                                                    setState({
                                                                                                                        ...state,
                                                                                                                        identificadorModal:
                                                                                                                            "codigoPostalEntrega",
                                                                                                                        tipoModal: 0,
                                                                                                                        openDialog: true
                                                                                                                    });
                                                                                                                }}
                                                                                                            >
                                                                                                                <PageviewIcon
                                                                                                                    style={{
                                                                                                                        color: "#F9A03E",
                                                                                                                        fontSize: 32,
                                                                                                                    }}
                                                                                                                />
                                                                                                            </IconButton>{" "}
                                                                                                        </InputAdornment>
                                                                                                    ),
                                                                                                }}
                                                                                            />
                                                                                        </div>
                                                                                    )}
                                                                                />
                                                                            </div>
                                                                        </div>

                                                                        <div className="col-sm-6 col-md-4  unit">
                                                                            <label className="input select">
                                                                                <FormControl fullWidth
                                                                                             variant="outlined"
                                                                                             margin="dense">
                                                                                    <InputLabel
                                                                                        id="ciudadEntregaLabel">Ciudad</InputLabel>
                                                                                    <Select
                                                                                        labelId="ciudadEntregaLabel"
                                                                                        label="Ciudad"
                                                                                        className="form-control"

                                                                                        value={state.ciudadEntrega}
                                                                                        disabled={state.agregar === "Consultar"}
                                                                                        onChange={handleChange}
                                                                                        id="ciudadEntrega"
                                                                                    >
                                                                                        {dataCiudad.map((ciudad) => (
                                                                                            <option
                                                                                                key={ciudad.m_nIdCiudad}
                                                                                                value={ciudad.m_nIdCiudad}
                                                                                            >
                                                                                                {ciudad.m_sCiudad}
                                                                                            </option>
                                                                                        ))}
                                                                                    </Select>
                                                                                </FormControl>
                                                                                <i className="fa fa-arrow-down"/>
                                                                            </label>
                                                                        </div>

                                                                        <div className="col-sm-6 col-md-4 unit">
                                                                            <label className="input select">
                                                                                <FormControl fullWidth
                                                                                             variant="outlined"
                                                                                             margin="dense">
                                                                                    <InputLabel
                                                                                        id="zonaEntregaLabel">Zona</InputLabel>
                                                                                    <Select
                                                                                        labelId="zonaEntregaLabel"
                                                                                        label="Zona"
                                                                                        className="form-control"

                                                                                        value={state.zonaEntrega}
                                                                                        disabled={state.agregar === "Consultar"}
                                                                                        onChange={handleChange}
                                                                                        id="zonaEntrega"
                                                                                    >
                                                                                        <option value="">Selecciona
                                                                                        </option>

                                                                                        {dataZona.map((zona) => (
                                                                                            <option
                                                                                                key={zona.m_nIdZona}
                                                                                                value={zona.m_nIdZona}
                                                                                            >
                                                                                                {zona.m_sDescripcion}
                                                                                            </option>
                                                                                        ))}
                                                                                    </Select>
                                                                                </FormControl>
                                                                                <i className="fa fa-arrow-down"/>
                                                                            </label>
                                                                        </div>

                                                                        <div
                                                                            className="col-sm-6 col-md-6 col-lg-6 unit">

                                                                            <div className="input">
                                                                                <TextField variant="outlined"
                                                                                           margin="dense"
                                                                                           onChange={handleChange}
                                                                                           className="form-control"
                                                                                           type="text"
                                                                                           label="Domicilio"
                                                                                           value={state.domicilioEntrega}
                                                                                           disabled={state.agregar === "Consultar"}
                                                                                           id="domicilioEntrega"
                                                                                />
                                                                            </div>
                                                                        </div>

                                                                        <div
                                                                            className="col-sm-12 col-md-6 col-lg-6 unit">

                                                                            <div className="input">
                                                                                <TextField variant="outlined"
                                                                                           margin="dense"
                                                                                           onChange={handleChange}
                                                                                           className="form-control"
                                                                                           type="text"
                                                                                           label="Entrega En"
                                                                                           value={state.entregaEn}
                                                                                           disabled={state.agregar === "Consultar"}
                                                                                           id="entregaEn"
                                                                                />
                                                                            </div>
                                                                        </div>

                                                                        <div
                                                                            className="col-sm-12 col-md-6 col-lg-6 unit">

                                                                            <div className="input">
                                                                                <TextField variant="outlined"
                                                                                           margin="dense"
                                                                                           onChange={handleChange}
                                                                                           className="form-control"
                                                                                           type="text"
                                                                                           label="Datos Adicionales para la Entrega"
                                                                                           value={
                                                                                               state.datosAdicionalesEntrega
                                                                                           }
                                                                                           disabled={state.agregar === "Consultar"}
                                                                                           id="datosAdicionalesEntrega"
                                                                                />
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                ) : (
                                                    <div></div>
                                                )}
                                            </div>
                                        ) : (
                                            <div></div>
                                        )}


                                        <div className="widget-wrap" id="detallesOperacion">
                                            <div className="row">
                                                <div className="col-md-12">
                                                    <div className="widget-header">
                                                        <h2>Detalles de la Operación</h2>
                                                    </div>
                                                    <div className="widget-container">
                                                        <div className="widget-content">
                                                            <div className="row">
                                                                {/* --------------------------------------- Operador ------------------------------------------------- */}
                                                                <div className="col-sm-4 col-md-4 unit">
                                                                    <div className="input">
                                                                        <Autocomplete
                                                                            freeSolo
                                                                            onChange={(event, newValue) =>
                                                                                setState({
                                                                                    ...state,
                                                                                    operador: newValue,
                                                                                })
                                                                            }
                                                                            value={state.operador}
                                                                            id="operador"


                                                                            disableClearable
                                                                            forcePopupIcon={false}
                                                                            options={dataOperador}
                                                                            disabled
                                                                            getOptionLabel={(option) =>
                                                                                option.m_sNombreCompleto
                                                                            }
                                                                            variant="outlined"
                                                                            style={{
                                                                                transform: "translate(14px, 10px) scale(1) !important"
                                                                            }}
                                                                            renderInput={(params) => (
                                                                                <div>
                                                                                    <TextField
                                                                                        variant="outlined"
                                                                                        label="Operador"
                                                                                        margin="dense"
                                                                                        className="form-control"
                                                                                        {...params}
                                                                                        InputProps={{
                                                                                            ...params.InputProps,
                                                                                            style: {
                                                                                                height: "33px",
                                                                                                fontSize: "14px"
                                                                                            },
                                                                                            type: "search",
                                                                                            disabled: state.agregar === "Consultar",
                                                                                            disableUnderline: true,
                                                                                            endAdornment: (
                                                                                                <InputAdornment
                                                                                                    position="end">
                                                                                                    <IconButton
                                                                                                        padding="0px"
                                                                                                        style={{
                                                                                                            paddingRight: "0px",
                                                                                                        }}
                                                                                                        disabled={state.agregar === "Consultar"}
                                                                                                        onClick={() => {
                                                                                                            setState({
                                                                                                                ...state,
                                                                                                                identificadorModal:
                                                                                                                    "operador",
                                                                                                                tipoModal: 2,
                                                                                                                openDialog: true
                                                                                                            });
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
                                                                {/* --------------------------------------- TipoUnidad ------------------------------------------------- */}
                                                                <div className="col-sm-4 col-md-4 unit">

                                                                    <div className="input">
                                                                        <Autocomplete
                                                                            freeSolo
                                                                            onChange={(event, newValue) =>
                                                                                setState({
                                                                                    ...state,
                                                                                    tipoUnidad: newValue,
                                                                                })
                                                                            }
                                                                            value={state.tipoUnidad}
                                                                            id="tipoUnidad"
                                                                            disableClearable
                                                                            forcePopupIcon={false}
                                                                            options={dataTipoUnidad}
                                                                            disabled
                                                                            getOptionLabel={(option) =>
                                                                                option.m_sTipoUnidad
                                                                            }
                                                                            variant="outlined"
                                                                            style={{
                                                                                transform: "translate(14px, 10px) scale(1) !important"
                                                                            }}
                                                                            renderInput={(params) => (
                                                                                <div>
                                                                                    <TextField
                                                                                        variant="outlined"
                                                                                        label="Tipo de Unidad"
                                                                                        margin="dense"
                                                                                        className="form-control"
                                                                                        {...params}
                                                                                        InputProps={{
                                                                                            ...params.InputProps,
                                                                                            style: {
                                                                                                height: "33px",
                                                                                                fontSize: "14px"
                                                                                            },
                                                                                            type: "search",
                                                                                            disabled: state.agregar === "Consultar",
                                                                                            disableUnderline: true,
                                                                                            endAdornment: (
                                                                                                <InputAdornment
                                                                                                    position="end">
                                                                                                    <IconButton
                                                                                                        padding="0px"
                                                                                                        style={{
                                                                                                            paddingRight: "0px",
                                                                                                        }}
                                                                                                        disabled={state.agregar === "Consultar"}
                                                                                                        onClick={() => {
                                                                                                            setState({
                                                                                                                ...state,
                                                                                                                identificadorModal:
                                                                                                                    "tipoUnidad",
                                                                                                                tipoModal: 3,
                                                                                                                openDialog: true
                                                                                                            });
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
                                                                {/* --------------------------------------- Unidad ------------------------------------------------- */}
                                                                <div className="col-sm-4 col-md-4 unit">
                                                                    <div className="input">
                                                                        <Autocomplete
                                                                            freeSolo
                                                                            onChange={(event, newValue) =>
                                                                                setState({
                                                                                    ...state,
                                                                                    unidad: newValue,
                                                                                })
                                                                            }
                                                                            id="unidad"
                                                                            disableClearable
                                                                            forcePopupIcon={false}
                                                                            options={dataUnidad}
                                                                            value={state.unidad}
                                                                            disabled
                                                                            getOptionLabel={(option) =>
                                                                                option.m_sDescripcion
                                                                            }
                                                                            variant="outlined"
                                                                            style={{
                                                                                transform: "translate(14px, 10px) scale(1) !important"
                                                                            }}
                                                                            renderInput={(params) => (
                                                                                <div>
                                                                                    <TextField
                                                                                        variant="outlined"
                                                                                        label="Unidad"
                                                                                        margin="dense"
                                                                                        className="form-control"
                                                                                        {...params}
                                                                                        InputProps={{
                                                                                            ...params.InputProps,
                                                                                            style: {
                                                                                                height: "33px",
                                                                                                fontSize: "14px"
                                                                                            },
                                                                                            type: "search",
                                                                                            disabled: state.agregar === "Consultar",
                                                                                            disableUnderline: true,
                                                                                            endAdornment: (
                                                                                                <InputAdornment
                                                                                                    position="end">
                                                                                                    <IconButton
                                                                                                        padding="0px"
                                                                                                        style={{
                                                                                                            paddingRight: "0px",
                                                                                                        }}
                                                                                                        disabled={state.agregar === "Consultar"}
                                                                                                        onClick={() => {
                                                                                                            setState({
                                                                                                                ...state,
                                                                                                                identificadorModal:
                                                                                                                    "unidad",
                                                                                                                tipoModal: 4,
                                                                                                                openDialog: true
                                                                                                            });
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
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="col-md-6">
                                                    <div className="widget-header">
                                                        <h2>Salida para la Recolección</h2>
                                                    </div>
                                                    <div className="widget-container">
                                                        <div className="widget-content">
                                                            <div className="col-md-12">
                                                                <div className="input">
                                                                    <TextField variant="outlined" margin="dense"
                                                                               onChange={handleChange}
                                                                               className="form-control"
                                                                               type="datetime-local"
                                                                               readOnly
                                                                               InputLabelProps={{
                                                                                   shrink: true,
                                                                               }}
                                                                               label="Fecha y Hora"
                                                                               value={state.fechaHoraSalida}
                                                                               disabled={state.agregar === "Consultar"}
                                                                               id="fechaHoraSalida"
                                                                    />
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="col-md-6">
                                                    <div className="widget-header">
                                                        <h2>Llegada de la Recolección</h2>
                                                    </div>
                                                    <div className="widget-container">
                                                        <div className="widget-content">
                                                            <div className="col-md-12">
                                                                <div className="input">
                                                                    <TextField variant="outlined" margin="dense"
                                                                               onChange={handleChange}
                                                                               className="form-control"
                                                                               type="datetime-local"
                                                                               readOnly
                                                                               InputLabelProps={{
                                                                                   shrink: true,
                                                                               }}
                                                                               label="Fecha y Hora"
                                                                               value={state.fechaHoraLlegada}
                                                                               disabled={state.agregar === "Consultar"}
                                                                               id="fechaHoraLlegada"
                                                                    />
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>


                                    <div className="form-footer col-md-12">
                                        <button
                                            href="#Listado"
                                            role="tab"
                                            data-toggle="tab"
                                            className="btn btn-secondary secondary-btn"
                                        >
                                            Cancelar
                                        </button>
                                        <button
                                            type="submit"
                                            className="btn btn-primary primary-btn"
                                            disabled={state.agregar === "Consultar"}
                                        >
                                            Aceptar
                                        </button>
                                    </div>

                                </div>
                            </form>
                        </div>

                        <div id="Cancelar" className="tab-pane fade">
                            <div className="widget-wrap">
                                <div className="widget-container">
                                    <div className="widget-content">
                                        <div className="row">
                                            <form className="j-forms" onSubmit={handleCancelar}>
                                                <div className="form-content">

                                                    <div className="col-sm-6 col-md-2-5 col-lg-2-5 unit">
                                                        <div className="input">
                                                            <TextField variant="outlined" margin="dense"
                                                                       onChange={handleChange}
                                                                       className="form-control"
                                                                       type="text"
                                                                       label="Folio Recolección"
                                                                       value={state.folioRecoleccion}
                                                                       id="folioRecoleccion"
                                                                       readOnly
                                                            />
                                                        </div>
                                                    </div>

                                                    <div className="col-sm-6 col-md-2-5 col-lg-2-5 unit">
                                                        <div className="input">
                                                            <TextField variant="outlined" margin="dense"
                                                                       onChange={handleChange}
                                                                       className="form-control"
                                                                       type="text"
                                                                       label="Sucursal"
                                                                       value={state.sucursalCancelacion}
                                                                       id="sucursalCancelacion"
                                                                       readOnly
                                                            />
                                                        </div>
                                                    </div>

                                                    <div className="col-sm-6 col-md-2-5 col-lg-2-5 unit">
                                                        <div className="input">
                                                            <TextField variant="outlined" margin="dense"
                                                                       onChange={handleChange}
                                                                       className="form-control"
                                                                       type="text"
                                                                       label="Fecha"
                                                                       value={state.mostrarFechaCancelacion}
                                                                       id="mostrarFechaCancelacion"
                                                                       readOnly
                                                            />
                                                        </div>
                                                    </div>

                                                    <div className="col-sm-6 col-md-2-5 col-lg-2-5 unit">
                                                        <div className="input">
                                                            <TextField variant="outlined" margin="dense"
                                                                       onChange={handleChange}
                                                                       className="form-control"
                                                                       type="text"
                                                                       label="Usuario"
                                                                       value={state.usuario}
                                                                       id="usuario"
                                                                       readOnly
                                                            />
                                                        </div>
                                                    </div>

                                                    <div className="col-sm-6 col-md-2-5 col-lg-2-5 unit">
                                                        <div className="input">
                                                            <TextField variant="outlined" margin="dense"
                                                                       onChange={handleChange}
                                                                       className="form-control"
                                                                       type="text"
                                                                       label="Estatus"
                                                                       value={state.estatusRecoleccion}
                                                                       id="estatusRecoleccion"
                                                                       readOnly
                                                            />
                                                        </div>
                                                    </div>


                                                    <div className="col-sm-12 col-md-12 col-lg-12 unit">
                                                        <div className="input">
                                                            <TextField variant="outlined" margin="dense"
                                                                       onChange={handleChange}
                                                                       className="form-control"
                                                                       type="text"
                                                                       label="Motivo"
                                                                       value={state.motivoCancelacion}
                                                                       id="motivoCancelacion"
                                                            />
                                                        </div>
                                                    </div>

                                                    <div className="form-footer col-md-12">
                                                        <button
                                                            href="#Listado"
                                                            role="tab"
                                                            data-toggle="tab"
                                                            className="btn btn-secondary secondary-btn"
                                                        >
                                                            Cancelar
                                                        </button>
                                                        <button
                                                            type="submit"
                                                            className="btn btn-primary primary-btn"
                                                        >
                                                            Aceptar
                                                        </button>
                                                    </div>

                                                </div>
                                            </form>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div id="Salida-Llegada" className="tab-pane fade">
                            <div className="widget-wrap">
                                <div className="widget-container">
                                    <div className="widget-content">
                                        <div className="row">
                                            <form className="j-forms" onSubmit={handleCancelar}>
                                                <div className="form-content">

                                                    <div className="col-sm-6 col-md-3 col-lg-3 unit">
                                                        <div className="input">
                                                            <TextField variant="outlined" margin="dense"
                                                                       onChange={handleChange}
                                                                       className="form-control"
                                                                       type="text"
                                                                       label="Sucursal"
                                                                       value={state.sucursalCancelacion}
                                                                       id="sucursalCancelacion"
                                                                       readOnly
                                                            />
                                                        </div>
                                                    </div>

                                                    <div className="col-sm-6 col-md-3 col-lg-3 unit">
                                                        <div className="input">
                                                            <TextField variant="outlined" margin="dense"
                                                                       onChange={handleChange}
                                                                       className="form-control"
                                                                       type="text"
                                                                       label="Folio Recolección"
                                                                       value={state.folioRecoleccion}
                                                                       id="folioRecoleccion"
                                                                       readOnly
                                                            />
                                                        </div>
                                                    </div>

                                                    <div className="col-sm-6 col-md-3 col-lg-3 unit">
                                                        <div className="input">
                                                            <TextField variant="outlined" margin="dense"
                                                                       onChange={handleChange}
                                                                       className="form-control"
                                                                       type="text"
                                                                       label="Fecha Elaboracion"
                                                                       value={state.fechaHoraCreacion}
                                                                       id="fechaHoraCreacion"
                                                                       readOnly
                                                            />
                                                        </div>
                                                    </div>

                                                    <div className="col-sm-6 col-md-3 col-lg-3 unit">
                                                        <div className="input">
                                                            <TextField variant="outlined" margin="dense"
                                                                       onChange={handleChange}
                                                                       className="form-control"
                                                                       type="text"
                                                                       label="Fecha Recoleccion"
                                                                       value={state.fechaRecoleccion}
                                                                       id="fechaRecoleccion"
                                                                       readOnly
                                                            />
                                                        </div>
                                                    </div>

                                                    <div className="col-sm-6 col-md-6 col-lg-6 unit">
                                                        <div className="input">
                                                            <TextField variant="outlined" margin="dense"
                                                                       onChange={handleChange}
                                                                       className="form-control"
                                                                       type="text"
                                                                       label="Zona"
                                                                       value={state.zonaRecoleccion}
                                                                       id="zonaRecoleccion"
                                                                       readOnly
                                                            />
                                                        </div>
                                                    </div>

                                                    <div className="col-sm-6 col-md-6 col-lg-6 unit">
                                                        <div className="input">
                                                            <TextField variant="outlined" margin="dense"
                                                                       onChange={handleChange}
                                                                       className="form-control"
                                                                       type="text"
                                                                       label="Recoger En"
                                                                       value={state.recogerEn}
                                                                       id="recogerEn"
                                                                       readOnly
                                                            />
                                                        </div>
                                                    </div>

                                                    <div className="col-sm-12 col-md-6 col-lg-6 unit">
                                                        <div className="input">
                                                            <TextField variant="outlined" margin="dense"
                                                                       onChange={handleChange}
                                                                       className="form-control"
                                                                       type="text"
                                                                       label="Operador"
                                                                       value={state.operador.m_sNombreCompleto}
                                                                       id="operador"
                                                            />
                                                        </div>
                                                    </div>

                                                    <div className="col-sm-12 col-md-6 col-lg-6 unit">
                                                        <div className="input">
                                                            <TextField variant="outlined" margin="dense"
                                                                       onChange={handleChange}
                                                                       className="form-control"
                                                                       type="text"
                                                                       label="Estatus"
                                                                       value={state.motivoCancelacion}
                                                                       id="motivoCancelacion"
                                                            />
                                                        </div>
                                                    </div>

                                                    <div className="col-sm-12 col-md-6 col-lg-6 unit">
                                                        <div className="input">
                                                            <TextField variant="outlined" margin="dense"
                                                                       onChange={handleChange}
                                                                       className="form-control"
                                                                       type="text"
                                                                       label="Unidad"
                                                                       value={state.unidad.m_sDescripcion}
                                                                       id="unidad"
                                                            />
                                                        </div>
                                                    </div>

                                                    <div className="col-sm-12 col-md-6 col-lg-6 unit">
                                                        <div className="input">
                                                            <TextField variant="outlined" margin="dense"
                                                                       onChange={handleChange}
                                                                       className="form-control"
                                                                       type="text"
                                                                       label="Estatus"
                                                                       value={state.motivoCancelacion}
                                                                       id="motivoCancelacion"
                                                            />
                                                        </div>
                                                    </div>

                                                    <div className="col-sm-12 col-md-6 col-lg-6 unit">
                                                        <div className="input">
                                                            <TextField variant="outlined" margin="dense"
                                                                       onChange={handleChange}
                                                                       className="form-control"
                                                                       type="text"
                                                                       label="Remolque"
                                                                       value={state.motivoCancelacion}
                                                                       id="motivoCancelacion"
                                                            />
                                                        </div>
                                                    </div>

                                                    <div className="col-sm-12 col-md-3 col-lg-3 unit">
                                                        <div className="input">
                                                            <TextField variant="outlined" margin="dense"
                                                                       onChange={handleChange}
                                                                       className="form-control"
                                                                       type="text"
                                                                       label="Estatus"
                                                                       value={state.motivoCancelacion}
                                                                       id="motivoCancelacion"
                                                            />
                                                        </div>
                                                    </div>

                                                    <div className="col-sm-12 col-md-3 col-lg-3 unit">
                                                        <div className="input">
                                                            <TextField variant="outlined" margin="dense"
                                                                       onChange={handleChange}
                                                                       className="form-control"
                                                                       type="text"
                                                                       label="Cargado"
                                                                       value={state.motivoCancelacion}
                                                                       id="motivoCancelacion"
                                                            />
                                                        </div>
                                                    </div>

                                                    <div className="col-sm-12 col-md-4 col-lg-4 unit">
                                                        <div className="input">
                                                            <TextField variant="outlined" margin="dense"
                                                                       onChange={handleChange}
                                                                       className="form-control"
                                                                       type="text"
                                                                       label="Fecha Salida"
                                                                       value={state.motivoCancelacion}
                                                                       id="motivoCancelacion"
                                                            />
                                                        </div>
                                                    </div>

                                                    <div className="form-footer" className="col-md-12">
                                                        <button
                                                            href="#Listado"
                                                            role="tab"
                                                            data-toggle="tab"
                                                            className="btn btn-secondary secondary-btn"
                                                        >
                                                            Cancelar
                                                        </button>
                                                        <button
                                                            type="submit"
                                                            className="btn btn-primary primary-btn"
                                                        >
                                                            Aceptar
                                                        </button>
                                                    </div>
                                                </div>
                                            </form>
                                        </div>

                                    </div>
                                </div>
                            </div>
                        </div>

                        <div id="Prueba" className="tab-pane fade">
                            <div className="widget-wrap">
                                <div className="widget-container">
                                    <div className="widget-content">
                                        <div className="row">
                                            <div className="form-content" style={{display: "flex"}}>
                                                <input type="file" id="archivoFormato" onChange={changeHandler}/>
                                                <div>
                                                    <button onClick={handleSubmission} disabled={!isFilePicked}>Submit
                                                    </button>
                                                </div>
                                            </div>
                                            <article>
                                                <h2><a>Hello World</a></h2>
                                                <div
                                                    dangerouslySetInnerHTML={{__html: state.uploadedFileContent}}></div>
                                            </article>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>


                    </div>
                </div>
            </section>
        </div>
    );
}

export default Recoleccion;
