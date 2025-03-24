import React, {useEffect, useState, setData, useMemo, Component} from "react";
import {validarDerecho} from "../Util/Util"
import {
    ButtonBase,
    Checkbox, Chip,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    FormControl, FormControlLabel,
    Grid,
    IconButton,
    Input,
    InputLabel,
    List,
    ListItem,
    ListItemIcon,
    ListItemSecondaryAction,
    ListItemText, MenuItem,
    Select,
    Step,
    StepLabel,
    Stepper, Tooltip,
} from "@mui/material";
import RestartAltIcon from '@mui/icons-material/Refresh';
import {obtenerFechaInicio, obtenerFechaFinal} from "../Util/Contexts/UtileriasContext";
import {getCurrentDateTime} from "../Util/Util"

import $ from "jquery";
import {useTable, useFilters, useSortBy} from "react-table";
import TextField from "@mui/material/TextField";
import Autocomplete from '@mui/material/Autocomplete';
import InputAdornment from "@mui/material/InputAdornment";
import PageviewIcon from "@mui/icons-material/Pageview";
import useModal from "react-hooks-use-modal";
import axios from "axios";
import Cabecera from "../Components/Template/Cabecera";
import BarraLateralIzquierda from "../Components/Template/BarraLateralIzquierda";
import BarraLateralDerecha from "../Components/Template/BarraLateralDerecha";
import ExportCSV from "../Components/Template/Export";
import ExportPDF from "../Components/Template/ExportPDF";
import Carousel from "re-carousel";
import IndicatorDots from "../Util/Dots";
import Buttons from "../Util/CarruselButtons";
import { styled } from "@mui/material/styles";
import makeStyles from '@mui/styles/makeStyles';
import * as XLSX from "xlsx";
import {render} from "react-dom";
import SearchIcon from "@mui/icons-material/Search";
import {DataGrid} from "@mui/x-data-grid";
import Noty from "noty";
import {API_BASE_URL, API_HEADERS, dataGridLocaleText} from "../Constants";
import {obtenerCiudades} from "../Util/Contexts/CiudadesContext";
import {obtenerEstatusIncialInforme} from "../Util/Contexts/EstatusContext";
import {
    cubicarGuiaInforme,
    obtenerGuia,
    obtenerGuiaPendientes,
    obtenerGuiaReporte,
    obtenerGuiasFiltro
} from "../Util/Contexts/GuiaContext";
import {obtenerOperadores} from "../Util/Contexts/OperadoresContext";
import {obtenerUnidades, obtenerUnidadesInforme, obtenerUnidadesTipo} from "../Util/Contexts/UnidadesContext";
import {obtenerRutas} from "../Util/Contexts/RutasContext";
import {
    agregarInformes,
    cancelarInformes,
    eliminarInformes,
    modificarInformes, obtenerInformeFiltro, obtenerInformeReporte,
    obtenerInformes,
    obtenerInformesId
} from "../Util/Contexts/InformesContext";
import {obtenerSucursales} from "../Util/Contexts/SucursalContext";
import {validarPermisos} from "../Util/Contexts/UsuarioContext";
import {
    imprimirFormatosId, imprimirFormatosIdIdTipoReporte, imprimirFormatosIdInforme,
    obtenerFormatosImpresion,
    obtenerFormatosImpresionProceso
} from "../Util/Contexts/FormatosImpresionContext";
import Filtros from "./Filtros/Filtros";
import SeleccionarRuta from "./Rutas/SeleccionarRuta";
import Button from "@mui/material/Button";
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward';
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward';
import {confirmAlert} from "react-confirm-alert";
import {obtenerParametrosConfiguracion} from "../Util/Contexts/ParametrosConfiguracionContext";
import {obtenerTiposDocumentoSucursal} from "../Util/Contexts/TipoDocumentosContext";
import DialogFormatosImpresion from "./DialogFormatosImpresion";
import {showError} from "../Util/GlobalFunctions";
import ProgressBarCubicaje from "./Viajes/ProgressBarCubicaje";

const PREFIX = 'Informes';

const classes = {
    seleccionado: `${PREFIX}-seleccionado`,
    noSeleccionado: `${PREFIX}-noSeleccionado`,
    disabled: `${PREFIX}-disabled`
};

const Root = styled('div')({
    [`& .${classes.seleccionado}`]: {
        backgroundColor: "#FCC88F",
    },
    [`& .${classes.noSeleccionado}`]: {
        backgroundColor: "#FFFFFF",
    },
    [`& .${classes.disabled}`]: {
        pointerEvents: "none",
        cursor: "default",
    },
});

function showSuccess(mensaje) {
    new Noty({
        type: "information",
        layout: "topCenter",
        text: mensaje,
        timeout: "8000",
    }).show();
}

window.jQuery = window.$ = $;

let timer;

function Informes({history}) {

    const [utilizacion, setUtilizacion] = React.useState(0);
    const [data, setData] = React.useState([]);
    const [guias, setGuias] = React.useState([]);
    const [informes, setInformes] = React.useState([]);
    const [dataSucursal, setDataSucursal] = React.useState([]);
    const [dataEstatusInformes, setEstatusInformes] = React.useState([]);
    const [dataOperadores, setDataOperadores] = React.useState([]);
    const [dataOrigenes, setDataOrigenes] = React.useState([]);
    const [dataUnidades, setDataUnidades] = React.useState([]);
    const [ordenAscendente, setOrdenAscendente] = React.useState(true);
    const [dataFormatos, setFormatosImpresion] = React.useState([]);
    const [dataGuiasSeleccionadas, setDataGuiasSeleccionadas] = React.useState([]);
    const [dataGuias, setDataGuias] = React.useState([]);
    const [filtroFolio, setFiltroFolio] = React.useState(false);
    const [textoFiltro,setTextoFiltro]=React.useState('');
    const [openDialogReportes, setOpenDialogReportes] = useState(false)
    const [mensajesUtilizacion,setMensajeUtilizacion]=useState('')

    const [detectarModificaciones,setDetectar]=React.useState(false)

    function confirmExit()
    {

      return "show warning";
    }
    const handleChange = (event) => {
        setState({
            ...state,
            [event.target.id]: event.target.value,
        });
    };

    const handleChangeOrden = () => {

        if (!ordenAscendente) {
            setDataGuias(dataGuias.sort(function (a, b) {
                if (a.m_nFolioGuia > b.m_nFolioGuia) {
                    return -1;
                }
                if (a.m_nFolioGuia < b.m_nFolioGuia) {
                    return 1;
                }
                // a must be equal to b
                return 0;
            }))
        } else {
            setDataGuias(dataGuias.sort(function (a, b) {
                if (a.m_nFolioGuia > b.m_nFolioGuia) {
                    return 1;
                }
                if (a.m_nFolioGuia < b.m_nFolioGuia) {
                    return -1;
                }
                // a must be equal to b
                return 0;
            }))
        }

        setOrdenAscendente(!ordenAscendente)
    };
    const handleFiltroFolio = () => {

        let filtro=document.getElementById('filtroFolio').value
        if(filtro=='')
        {
            setTextoFiltro('')
            setFiltroFolio(false)
        }
        else
        {
            setTextoFiltro(filtro)
            setFiltroFolio(true)
        }
    };
    function handleSelectCP(id, dobleClick, e) {
        clearTimeout(timer);
        if (e.detail === 1) {
            timer = setTimeout(() => {
                setState({
                    ...state,
                    [state.identificadorModal]: id,
                    openDialog: true,
                });
            }, 200);
        } else if (e.detail === 2) {
            setState({
                ...state,
                [state.identificadorModal]: id,
                openDialog: false,
            });
        }
    }

    const columns = React.useMemo(() => [
        {
            headerName: "Acciones",
            sortable: false, filterable: false,
            field: "",
            width: 200,
            renderCell: (row) => {
                return (
                    <Root>
                        <a
                            onClick={() => handleShowModificar(row.row.m_nIdInforme, row.row)}
                            className="btn btn-default btn-xs"
                            disabled={!validarDerecho(9101433)}
                        >
                            <i
                                className="fa fa-pencil-square-o"
                                style={{color: "#F9A03E"}}
                            />
                        </a>
                        <a
                            className="btn btn-default btn-xs"
                            onClick={() => handleShowConsultar(row.row.m_nIdInforme)}
                            disabled={!validarDerecho(9101432)}
                        >
                            <i className="fa fa-eye" style={{color: "#F9A03E"}}/>
                        </a>
                        {/*<Tooltip title="Reporte opción 1">*/}
                        {/*    <a className="btn btn-default btn-xs"*/}
                        {/*       onClick={() => generarReporteOpcion1(row.row)}*/}
                        {/*       disabled={!validarDerecho(9101435)}><i className="zmdi zmdi-file"*/}
                        {/*                                              style={{color: "#F9A03E"}}/></a>*/}

                        {/*</Tooltip>*/}
                        <Tooltip title="Reporte">
                            <a className="btn btn-default btn-xs"
                               onClick={() => handleOnReporteClick(row.row)}
                               disabled={!validarDerecho(9101435)}><i className="zmdi zmdi-file"
                                                                      style={{color: "#F9A03E"}}/></a>

                        </Tooltip>
                        <a
                            href="#"
                            className="btn btn-default btn-xs"
                            onClick={() => confirmAlert({
                                title: 'Confirmar Eliminar',
                                message: '¿Está seguro de eliminar informe?',
                                buttons: [
                                    {
                                        label: 'Sí',
                                        onClick: () => handleEliminar(row.row.m_nIdInforme)
                                    },
                                    {
                                        label: 'No',
                                    }
                                ]
                            })}
                            disabled={!validarDerecho(9101434)}
                        >
                            <i className="zmdi zmdi-delete" style={{color: "#F30B0B"}}/>
                        </a>
                    </Root>
                );
            },
        },
        {
            headerName: "Folio/Serie",
            field: "m_sFolioInforme",
            width: 150,
        },
        {
            headerName: "Fecha/Hora Elaboración",
            field: "m_sFechaHora",
            width: 200,
        },
        {
            headerName: "Estatus",
            field: "m_sEstatusInforme",
            width: 125,
            renderCell: (row) => {
                return (
                    <div align={"center"} style={{width: "100%"}}>
                        <Chip size="small" style={{
                            backgroundColor: `${row.row.m_sColorEstatus}`,
                            //color: row.row.m_nIdEstatusUnidad === 1 ? "black" : "white",
                            padding: "1px"
                        }} label={row.row.m_sEstatusInforme}/>
                    </div>
                )
            }
        },
        {
            headerName: "Ubicación actual",
            field: "m_sUbicacionActual",
            width: 150,
        },
        {
            headerName: "Viaje",
            field: "m_sFolioViaje",
            width: 200,
        },
        {
            headerName: "Oficina Emisora",
            field: "m_sSucursalEmisora",
            width: 150,
        },
        {
            headerName: "Oficina Receptora",
            field: "m_sSucursalReceptora",
            width: 150,
        },
        {
            headerName: "Operador",
            field: "m_sNombreCompleto",
            width: 250,
        },
        {
            headerName: "Remolque",
            field: "remolqueCompleto",
            //valueFormatter: (params) => `Hola`,
            width: 180,
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
            headerName: "Cancelado",
            field: "m_dtFechaCancelacion",
            width: 150,
        },
    ]);

    async function handleOnReporteClick(row) {
        setOpenDialogReportes(true)
    }
    const handleGenerarReporte=(data)=>{
        if (data === null) {
            return
        }
        if (data.m_sNombreArchivo.toUpperCase().includes('EXCEL')) {
            // let a = document.createElement('a');
            // a.href = "data:application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;base64, "+ encodeURI(data.m_sArchivo);
            // a.download = "Informe " + row.m_sFolioInforme.replace(/\./g, ' ');
            // a.textContent = 'Descargar Archivo';
            // document.body.appendChild(a);
            // a.click();
            // a.remove();

            // Tu cadena base64 (por ejemplo, obtenida de una fuente externa)
            const base64String = data.m_sArchivo

            // Decodifica la cadena base64 a un ArrayBuffer
            const arrayBuffer = atob(base64String);
            const length = arrayBuffer.length;
            const uint8Array = new Uint8Array(length);
            for (let i = 0; i < length; i++) {
                uint8Array[i] = arrayBuffer.charCodeAt(i);
            }

            // Crea un libro de Excel a partir de los datos decodificados
            const wb = XLSX.read(uint8Array, { type: 'array' });

            // Puedes trabajar con el libro de Excel como desees

            // Por ejemplo, si deseas descargarlo
            XLSX.writeFile(wb, 'Informe ' + state.FolioInforme.replace(/\./g, ' ')+'.xlsx');
        } else {
            let pdfWindow = window.open("");
            pdfWindow.document.write("<embed  width='100%' height='100%' src='data:application/pdf;base64, " + encodeURI(data.m_sArchivo) + "'/>");
            pdfWindow.document.body.style.margin = "0px";
            pdfWindow.document.title = "Informe" + state.FolioInforme.replace(/\./g, ' ');
        }
    }

    function handleSelectDatos(id, cp) {
        setState({
            ...state,
            [state.identificadorModal]: id,
        });
    }

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
            Name: "Sucursal",
            accessor: "m_nIdSucursal",
        },
        {
            Name: "Activo",
            accessor: "m_nIdEstado",
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

    function DefaultColumnFilter({column: {filterValue, preFilteredRows, setFilter},}) {
        const count = preFilteredRows.length;

        return (
            <input
                className="form-control"
                value={filterValue || ""}
                onChange={(e) => {
                    setFilter(e.target.value || undefined);
                }}
                placeholder={`Buscar ${count} registros...`}
            />
        );
    }

    const [state, setState] = React.useState({
        showPopUp: false,
        identificadorModal: "",
        openDialog: false,
        viaje: {},
        agregar: "Agregar",
        height: window.innerHeight,

        ruta2: "",
        operador2: "",
        unidad2: "",
        remolque2: "",

        tipoModal: 0,
        IdInforme: 0,
        FolioInforme: '',
        fechaHora: '',
        DerechoBorrar: 151,
        EstatusInforme: 5,
        IdViaje: {},
        sucursalEmisora: localStorage.getItem("Sucursal"),
        sucursalReceptora: '',
        IdOperador: null,
        IdRemolque1: null,
        IdRemolque2: null,
        PlacasRemolque1: "",
        PlacasRemolque2: "",
        PlacasDolly: "",
        IdTipoUnidad: {},
        IdCiudadDestino: null,
        IdCiudadOrigen: null,
        IdRuta: 0,
        IdSucursal: localStorage.getItem("Sucursal"),
        CreadoPor: localStorage.getItem("UsuarioId"),
        ModificadoPor: localStorage.getItem("UsuarioId"),
        usuarioCancelacion: "",
        estatusCancelacion: "",
        Guias: [
            {
                m_nIdGuia: 0,
                m_nFolioGuia: "",
                m_sEstatusGuia: "",
                m_cValorDeclarado: "",
                m_sCiudadDestinatario: "",
                tipoServicio: "",
                observaciones: "",
            },
        ],
        fechaCancelacion: "",
        motivoCancelacion: "",
        sucursalCancelacion: {},
        sePuedeCancelar: false,
        Informes: [],
        indexCubicar: 0,
        tipoTimbrado:1,
    });

    const getEmptyState = () => {
        setState(state => {
            return {
                ...state,
                showPopUp: false,
                identificadorModal: "",
                openDialog: false,
                viaje: {},
                agregar: "Agregar",
                height: window.innerHeight,
                fechaHora: getCurrentDateTime(),
                ruta2: "",
                operador2: "",
                unidad2: "",
                remolque2: "",

                tipoModal: 0,
                IdInforme: 0,
                FolioInforme: '',
                DerechoBorrar: 151,
                EstatusInforme: 5,
                IdViaje: {},
                sucursalEmisora: localStorage.getItem("Sucursal"),
                sucursalReceptora: '',
                IdOperador: null,
                IdRemolque1: null,
                IdRemolque2: null,
                PlacasRemolque1: "",
                PlacasRemolque2: "",
                PlacasDolly: "",
                IdTipoUnidad: {},
                IdCiudadDestino: null,
                IdCiudadOrigen: null,
                IdRuta: 0,
                IdSucursal: localStorage.getItem("Sucursal"),
                CreadoPor: localStorage.getItem("UsuarioId"),
                ModificadoPor: localStorage.getItem("UsuarioId"),
                usuarioCancelacion: "",
                estatusCancelacion: "",
                Guias: [
                    {
                        m_nIdGuia: 0,
                        m_nFolioGuia: "",
                        m_sEstatusGuia: "",
                        m_cValorDeclarado: "",
                        m_sCiudadDestinatario: "",
                        tipoServicio: "",
                        observaciones: "",
                    },
                ],
                fechaCancelacion: "",
                motivoCancelacion: "",
                sucursalCancelacion: {},
                sePuedeCancelar: false,
                Informes: [],
                indexCubicar: 0,
            }
        })
        setMensajeUtilizacion('')
        setDataGuiasSeleccionadas([])
        setDataGuias([])
        setUtilizacion(0)
    }

    /* const getCurrentDateTime = () => {
         return `${new Date().getFullYear()}-${`${new Date().getMonth() +
         1}`.padStart(2, 0)}-${`${new Date().getDate()}`.padStart(2, 0)}T${`${new Date().getHours()}`.padStart(2, 0)}:${`${new Date().getMinutes()}`.padStart(2, 0)}`
     }*/

    const handleAceptar = (e) => {
        if (e) {
            e.preventDefault();
        }
        var params = {
            m_nIdInforme: state.IdInforme,
            m_nFolioInforme: state.FolioInforme,
            m_dFecha: getCurrentDateTime().substr(0, 10),
            m_tHora: getCurrentDateTime().substr(getCurrentDateTime().length - 5),
            m_nIdCiudadDestino: state.IdCiudadDestino.m_nIdCiudad,
            m_nIdCiudadOrigen: state.IdCiudadOrigen.m_nIdCiudad,
            m_nIdEstatusInforme: state.EstatusInforme,
            //m_nIdOperador: state.IdOperador.m_nIdOperador,
            m_nIdRemolque1: state.IdRemolque1.m_nIdUnidad,
            m_nIdRemolque2: state.IdRemolque2 ? state.IdRemolque2.m_nIdUnidad : 0,
            m_sPlacasRemolque1: state.PlacasRemolque1,
            m_sPlacasRemolque2: state.PlacasRemolque2,
            m_nIdRuta: 0,
            m_nIdSucursalEmisora: state.sucursalEmisora,
            m_nIdSucursalReceptora: state.sucursalReceptora,
            m_nIdDolly: state.IdTipoUnidad ? state.IdTipoUnidad.m_nIdUnidad : 0,
            m_sPlacasDolly: state.PlacasDolly,

            m_nIdViaje: state.IdViaje.m_nIdViaje,
            TotalxCDestinatario: 0,
            TotalxCCobrarRemitente: 0,
            TotalPagoMostrador: 0,
            TotalUnidadCompleta: 0,
            TotalGeneral: 0,
            m_nCreadoPor: state.CreadoPor,
            m_arrClsProInformeGuia: dataGuias.filter(g => g.select),
            m_nTipoTimbrado: state.tipoTimbrado
        };
        // handleShowListado()
        if (state.IdInforme !== 0) {
            modificarInformes(state.IdInforme, params)
                .then((respuesta) => {
                    showSuccess(respuesta.data);
                    setTextoFiltro('')
                    setFiltroFolio(false)
                    $.mostrarMensaje=false
                    handleShowListado()
                })
                .catch((err) => {
                    console.log(err);
                    showSuccess("El Usuario no tiene derecho para modificar");
                });
        } else {
            agregarInformes(params)
                .then((respuesta) => {
                    showSuccess(respuesta.data);
                    if (state.cuibicar && state.indexCubicar < informes.length) {
                        showAgregarFromCubicar(state.indexCubicar++)
                    } else {
                        setTextoFiltro('')
                        setFiltroFolio(false)
                        $.mostrarMensaje=false
                        handleShowListado()
                    }

                })
                .catch((err) => {
                    showSuccess(err);
                });
        }
    };

    function showAgregarFromCubicar(index) {
        setState({
            ...state,
            index: index
        })
        var guiasArray = guias.filter(g => informes[index].map(i => i.idGuia).includes(g.m_nIdGuia))
        guias.forEach(g => g.select = true)
        setDataGuias(guiasArray)

    }

    const handleSelectSucursalEmisora = event => {
        event.preventDefault()
        setState({
            ...state,
            sucursalEmisora: event.target.value
        });

    }
    const handleSelectSucursalReceptora = event => {
        event.preventDefault()
        setState({
            ...state,
            sucursalReceptora: event.target.value
        });

    }
    const handleSelectTipoTimbrado = event => {
        event.preventDefault()
        setState({
            ...state,
            tipoTimbrado: event.target.value
        });

    }

    const handleSelectEstatus = event => {
        event.preventDefault()
        setState({
            ...state,
            EstatusInforme: event.target.value
        });

    }

    useEffect(value => {
        setState({
            ...state,
            PlacasRemolque1: state.IdRemolque1 ? state.IdRemolque1.m_sPlacas : "",
            PlacasRemolque2: state.IdRemolque2 ? state.IdRemolque2.m_sPlacas : "",
            PlacasDolly: state.IdTipoUnidad ? state.IdTipoUnidad.m_sPlacas : ""
        })
        if(state.IdRemolque1==null){
            document.getElementById("IdRemolque1").defaultValue=""
            document.getElementById("IdRemolque1").value=""
            document.getElementById("IdRemolque1").inputValue=""
        }
            console.dir(document.getElementById("IdRemolque1"))


        //cubicarInforme(dataGuias);
    }, [state.IdRemolque1, state.IdRemolque2, state.IdTipoUnidad])

    function cubicarAccion(e) {
        e.preventDefault();
        getAllGuiasFrom(true);
    }

    const selectGuia = (guia) => {
        const newGuia = [...dataGuias];
        let index=dataGuias.findIndex(g=>g==guia)
        newGuia[index]["select"] = newGuia[index].select ? false : true;
        cubicarInforme(newGuia);
        setDataGuias(newGuia);
    };

    function cubicarInforme(newGuia){
        var params = {
            idRemolque1: state.IdRemolque1?.m_nIdUnidad ?? null,
            idRemolque2: state.IdRemolque2?.m_nIdUnidad ?? null,
            guias: newGuia.filter(g => g.select)
        }
        if(params.guias.length > 0){
            setDataGuiasSeleccionadas(params.guias)
            cubicarGuiaInforme(params).then(({data}) => {
                setUtilizacion( data.utilizacion.toFixed(0))
                if(data.mensaje!=null)
                {
                    setMensajeUtilizacion(data.mensaje)
                }
            }).catch(e => {
                setUtilizacion(0)
                showError(e.response?.data)
            })
        }
        else{
            setUtilizacion(0)
        }
        setDataGuias(newGuia);
    };

    const onChangeRemolque1 = (index,newValue) =>{
        const newGuia = [...dataGuiasSeleccionadas];
        var params = {
            idRemolque1: newValue?.m_nIdUnidad ?? null,
            idRemolque2: state.IdRemolque2?.m_nIdUnidad ?? null,
            guias: newGuia
        }
        if(dataGuiasSeleccionadas.length > 0){
            cubicarGuiaInforme(params).then(({data}) => {
                setUtilizacion( data.utilizacion.toFixed(0))
            }).catch(e => {
                setUtilizacion(0)
                showError(e.response?.data)
                console.log(e.response?.data)
            })
        }

        setState({
            ...state,
            IdRemolque1: newValue,
        })
    }

    const onChangeRemolque2 = (index,newValue) =>{
        const newGuia = [...dataGuiasSeleccionadas];
        var params = {
            idRemolque1: state.IdRemolque1?.m_nIdUnidad ?? null,
            idRemolque2: newValue?.m_nIdUnidad ?? null,
            guias: newGuia
        }
        if(params.guias.length > 0){
            cubicarGuiaInforme(params).then(({data}) => {
                setUtilizacion( data.utilizacion.toFixed(0))
            }).catch(e => {
                setUtilizacion(0)
                showError(e.response?.data)
            })
        }else {
            setUtilizacion(0)
        }

        setState({
            ...state,
            IdRemolque2: newValue,
        })
    }

    function handleShowCancelar(event) {
        obtenerInformesId(state.IdInforme).then((respuesta) => {
            setState({
                ...state,
                FolioInforme: respuesta.data.m_sFolioInforme,
                sucursalCancelacion: respuesta.data.m_sSucursalEmisora,
                fechaCancelacion: respuesta.data.m_dtFechaCancelacion ? respuesta.data.m_dtFechaCancelacion.replace(' ', 'T') : getCurrentDateTime(),
                motivoCancelacion: respuesta.data.m_sMotivoCancelacion || '',
                usuarioCancelacion: respuesta.data.m_sUsuarioCancelacion || localStorage.getItem("Usuario"),
                estatusCancelacion: respuesta.data.m_sEstatusInforme,
                sePuedeCancelar: respuesta.data.m_bSePuedeCancelar,
                countGuias:respuesta.data.countGuias,
            });

            if (!respuesta.data.m_bSePuedeCancelar) {
                showSuccess("Este informe no se puede cancelar.");
            }
            $('.nav-tabs li ').removeClass('active');
            $('.nav-tabs li').eq(3).addClass('active');
            $('.tab-content div ').removeClass('in show');
            $('#Cancelar').addClass('in show');
        });
    }

    const handleCancelar = (e) => {
        if (e) {
            e.preventDefault();
        }
        if(state.motivoCancelacion?.trim()==""){
            showSuccess("Favor de llenar campo de motivo")
            return;
        }
        confirmAlert({
            title: 'Este informe cuenta con '+state.countGuias+' guía(s)',
            message: '¿Esta seguro de que quiere cancelar?',
            buttons: [
                {
                    label: 'Sí',
                    onClick: async () => {
                        let params = {
                            motivoCancelacion: state.motivoCancelacion,
                            usuarioCancelacion: localStorage.getItem("UsuarioId"),
                            fechaCancelacion: state.fechaCancelacion.replace('T', ' '),
                        };
                        cancelarInformes(state.IdInforme, params).then((respuesta) => {
                            showSuccess(respuesta.data)
                            setDetectar(false)
                            $.mostrarMensaje=false
                            handleShowListado()
                        });
                    }
                },
                {
                    label: 'No',
                    onClick: async () => {console.log(state)}
                }
            ]
        });

    };

    function getAllGuiasFrom(cubicar) {
        // if (!cubicar) {
            obtenerGuiaPendientes(state.IdCiudadOrigen.m_nIdCiudad, state.IdCiudadDestino.m_nIdCiudad, state.tipoTimbrado).then((respuesta) => {
                if (respuesta.data !== "Vacio") {
                    if (state.agregar === "Modificar") {
                        let arr = []
                        arr = arr.concat(state.guiasInforme)
                        arr = arr.concat(respuesta.data)
                        setDataGuias(arr);
                    } else {
                        setDataGuias(respuesta.data);

                    }
                }
            })
        // } else {
        //     obtenerGuiasFiltro(0, 0, 0, 4).then(async (respuesta) => {
        //         setDataGuias(respuesta.data);
        //         if (cubicar) {
        //             cubicarGuias(
        //                 respuesta.data,
        //                 state.IdCiudadOrigen,
        //                 state.IdCiudadDestino,
        //                 state.IdRemolque1,
        //                 state.IdRemolque2
        //             ).then(result => {
        //                 setInformes(result);
        //             })
        //
        //         }
        //     })
        // }


    }

    const handleImprimir = () => {
        imprimirFormatosId(state.formatoSeleccionado).then((response) => {
            window.open(new Blob([response.data]));
        })

    }

    function getAllCiudades() {
        obtenerCiudades().then((respuesta) => {
            setDataOrigenes(respuesta.data);
        });
    }

    useEffect((value) => {
        if (
            localStorage.getItem("UsuarioId") === null ||
            localStorage.getItem("UsuarioId") <= 0
        ) {
            showSuccess("Es necesario iniciar sesion para acceder a este proceso");
            window.location.replace("login");
            return;
        }
        getDataParaEditar()
    }, []);

    const getDataParaListado = () => {
        getAllData();

    }

    const getDataParaEditar = () => {
        getAllEstatusInformes();
        getAllSucursales();
        getAllCiudades();
        getAllUnidades();
        getParametrosConfiguracion("Agregar")
    }

    function getParametrosConfiguracion(operacion) {

        obtenerParametrosConfiguracion().then(respuesta => {
            if (operacion === "Agregar") {
                setState((config) => {
                    return {
                        ...config,
                        validarTimbrado:respuesta.data.ValidarTimbrado,
                        tipoTimbrado: respuesta.data.TipoTimbrado,
                    }
                })
            }

        })

    }

    function getAllUnidades() {
        if (dataUnidades > 0) {
            return
        }
        obtenerUnidadesInforme().then((respuesta) => {
            setDataUnidades(respuesta.data);
        });
    }

    function getAllEstatusInformes() {
        if (dataEstatusInformes > 0) {
            return
        }
        obtenerEstatusIncialInforme().then((respuesta) => {
            setEstatusInformes(respuesta.data);
        });
    }

    function getAllSucursales() {
        if (dataSucursal > 0) {
            return
        }
        obtenerSucursales().then((respuesta) => {
            setDataSucursal(respuesta.data);
        });
    }

    useEffect(value => {
        console.dir(document.getElementById("IdCiudadOrigen"))
        if (state.IdCiudadOrigen && state.IdCiudadDestino && state.agregar !== "Consultar") {
            getAllGuiasFrom();
            setFiltroFolio(false)
        }
    }, [state.IdCiudadOrigen, state.IdCiudadDestino, state.agregar, state.tipoTimbrado])
    const clickCancelar=()=>{
        $.mostrarMensaje=false
        handleShowListado()
    }
    const handleShowListado = () => {
        if($.mostrarMensaje===true) {
            if (window.onbeforeunload) {
                let confirmarSalida = window.confirm("¿Desea regresar al listado? Hay cambios sin guardar")
                if (!confirmarSalida) {
                    return
                }
            }
        }
        setDetectar(false)
        window.onbeforeunload={}
        getDataParaListado()
        getEmptyState()
        $('.nav-tabs li ').removeClass('active');
        $('.nav-tabs li').eq(0).addClass('active');
        $('.tab-content div ').removeClass('in show');
        $('#Listado').addClass('in show');
    }

    function handleShowAgregar() {
        setDataParaAgregar()
        getEmptyState()
        setDetectar(false)
        setTextoFiltro('')
        setFiltroFolio(false)
        $.mostrarMensaje=false
        window.onbeforeunload={}
        $('.nav-tabs li ').removeClass('active');
        $('.nav-tabs li').eq(1).addClass('active');
        $('.tab-content div ').removeClass('in show');
        $('#Agregar').addClass('in show');

    }
    useEffect(() => {
        if( detectarModificaciones){
           $.mostrarMensaje=true
            window.onbeforeunload = confirmExit


        }
    }, [state])
    const handleShowCubicar = () => {
        if($.mostrarMensaje===true){
            if (window.onbeforeunload) {
                let confirmarSalida = window.confirm("¿Desea salir de la pestaña actual? Hay cambios sin guardar")
                if (!confirmarSalida) {
                    return
                }
            }
        }
        $.mostrarMensaje=false
        setDetectar(false)
        getEmptyState()
        $('.nav-tabs li ').removeClass('active');
        $('.nav-tabs li').eq(4).addClass('active');
        $('.tab-content div ').removeClass('in show');
        $('#Cubicar').addClass('in show');

    }

    function handleShowModificar(id, row) {
        if (parseInt(row.m_nIdEstatusInforme) !== 5) {
            showSuccess("Solo se pueden modificar informes con estatus pendiente")
            return
        }
        handleShowAgregar()
        obtenerInformesId(id).then(({data}) => {
            data.m_arrClsProGuia.forEach(g => g.select = true)
            setTextoFiltro('')
            setFiltroFolio(false)
            setDataParaModificarConsultar(data, "Modificar")
        });
    }


    function handleShowConsultar(id) {
        handleShowAgregar()
        obtenerInformesId(id).then(({data}) => {
            data.m_arrClsProGuia.forEach(g => g.select = true)
            setDataGuias(data.m_arrClsProGuia)
            setTextoFiltro('')
            setFiltroFolio(false)
            setDataParaModificarConsultar(data, "Consultar")
        });
    }

    const setDataParaModificarConsultar = (data, accion) => {
        setState(state => {
            return {
                ...state,
                fechaHora: data.m_dFecha + 'T' + data.m_tHora.substr(0, 5),
                IdInforme: data.m_nIdInforme,
                guiasInforme: data.m_arrClsProGuia,
                IdCiudadDestino: dataOrigenes.find(c => c.m_nIdCiudad === data.m_nIdCiudadDestino),
                IdCiudadOrigen: dataOrigenes.find(c => c.m_nIdCiudad === data.m_nIdCiudadOrigen),
                sucursalEmisora: data.m_nIdSucursalEmisora,
                sucursalReceptora: data.m_nIdSucursalReceptora,
                IdRemolque1: dataUnidades.find(c => c.m_nIdUnidad === data.m_nIdRemolque1),
                IdRemolque2: dataUnidades.find(c => c.m_nIdUnidad === data.m_nIdRemolque2),
                IdTipoUnidad: dataUnidades.find(c => c.m_nIdUnidad === data.m_nIdDolly),
                IdRuta: 0,
                IdEstatusInforme: dataEstatusInformes.find(c => c.m_nIdEstatusInforme === data.m_nIdEstatusInforme),
                PlacasRemolque1: data.m_sPlacasRemolque1,
                PlacasRemolque2: data.m_sPlacasRemolque2,
                PlacasDolly: data.m_sPlacasDolly,
                FolioInforme: data.m_sFolioInforme,
                EstatusInforme: data.m_nIdEstatusInforme,
                agregar: accion,
                tipoTimbrado:data.m_nTipoTimbrado
            }
        });
        var params = {
            idRemolque1: dataUnidades.find(c => c.m_nIdUnidad === data.m_nIdRemolque1)?.m_nIdUnidad ?? null,
            idRemolque2: dataUnidades.find(c => c.m_nIdUnidad === data.m_nIdRemolque2)?.m_nIdUnidad ?? null,
            guias: data.m_arrClsProGuia
        }
        if(params.guias.length > 0){
            cubicarGuiaInforme(params).then(({data}) => {
                setUtilizacion( data.utilizacion.toFixed(0))
            }).catch(e => {
                setUtilizacion(0)
                showError(e.response?.data)
            })
        }
    }

    const setDataParaAgregar = () => {
        setDataUnidades(dataUnidades.filter(m => m.m_nIdentificador == 1 || m.m_nIdentificador == 4))
        //    setDataUnidades()
    }

    function handleEliminar(id) {
        var derecho;
        validarPermisos(state)
            .then((respuesta) => {
                //showSuccess(respuesta.data)

                derecho = respuesta.data;
                if (derecho == false) {
                    showSuccess("El usuario no tiene derechos para realizar el proceso");
                    return;
                }

                eliminarInformes(id, state.CreadoPor)
                    .then(({data}) => {
                        showSuccess(data)
                        getAllData()
                    })
                    .catch((err) => {
                        showSuccess(err.response?.data);
                    });
            })
            .catch((err) => {
                showSuccess(err.response?.data);
            });
    }

    /**Obtiene el listado inicial de informes*/
    async function getAllData() {
        obtenerFechaInicio().then((respuestaUno) => {
            obtenerFechaFinal().then((respuestaDos) => {
                obtenerInformeFiltro(respuestaUno.data[0].Fecha, respuestaDos.data[0].Fecha, 0, 0, 0).then((respuesta) => {
                    respuesta.data.forEach((i) => i.remolqueCompleto = i.m_nIdentificador + " - " + i.m_sRemolque1)
                    setData(respuesta.data);
                })
            })
        })
    }


    const setDataListado = (listado) => {
        setData(listado)
    }

    const todasGuiasSeleccionadas = () => {
        return dataGuias.length === dataGuias.filter((g) => g.select).length
    }

    return (
        <div>

            { (openDialogReportes && (state.IdInforme > 0)) &&
                <DialogFormatosImpresion
                    idRegistro={state.IdInforme}
                    idProceso={214}
                    handleOnClose={handleGenerarReporte}
                    setOpenDialog={setOpenDialogReportes}
                    openDialog={openDialogReportes}
                />
            }
            <Dialog
                open={state.openDialog}
                onClose={() => setState({...state, openDialog: false})}
                fullWidth maxWidth="md"
            >
                <DialogContent>

                    {state.tipoModal === 6 &&
                        <div className="row" style={{backgroundColor: '#FFFFFF'}}>
                            <DialogTitle style={{padding: "0px"}}><h4>Selecciona el Formato</h4></DialogTitle>
                            <div>
                                <label className="input select" style={{width: "100%"}}>
                                    <FormControl fullWidth variant="outlined" size="small">
                                        <InputLabel id="sucursalListadoLabel">Formato</InputLabel>
                                        <Select
                                            labelId="sucursalListadoLabel"
                                            label="Formato"
                                            className="form-control"
                                            required
                                            value={state.formatoSeleccionado}
                                            onChange={(event) => setState({
                                                ...state,
                                                formatoSeleccionado: event.target.value
                                            })}
                                            id="formatoSeleccionado"
                                            name="formatoSeleccionado"
                                        >
                                            {dataFormatos.map((formato) => (
                                                <MenuItem
                                                    key={formato.m_nIdFormato}
                                                    value={formato.m_nIdFormato}
                                                >
                                                    {formato.m_sFormato}
                                                </MenuItem>
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
                    }
                </DialogContent>
            </Dialog>

            <header className="topbar clearfix">
                <Cabecera titulo="Informes">
                    <div className="page-header">
                        <ul className="list-page-breadcrumb">
                            <li className="active-page"> Informes</li>
                        </ul>
                    </div>
                </Cabecera>
            </header>
            {/*Topbar End Here*/}
            {/*Leftbar Start Here*/}
            <aside className="iconic-leftbar">
                <BarraLateralIzquierda/>
            </aside>

            <section className="main-container">
                <div className="container-fluid">


                    <ul className="nav navStatica nav-tabs">
                        <li className="active">
                            <a onClick={handleShowListado}>
                                <i className="fa fa-list"/> Listado
                            </a>
                        </li>
                        <li>
                            <a className={validarDerecho(9101431) ? "" : classes.disabled} onClick={()=>document.getElementById('Agregar').classList.contains('show')?null:handleShowAgregar()}>
                                <i className="fa fa-plus-circle"/> {state.agregar}
                            </a>
                        </li>

                        <li className="hide">
                            <a onClick={(event) => {
                                event.stopPropagation();
                                setState({
                                    ...state,
                                    identificadorModal:
                                        "imprimir",
                                    tipoModal: 6,
                                    openDialog: true
                                });
                            }}>
                                <i className="fa fa-print"/> Imprimir
                            </a>
                        </li>

                        <li>
                            <a className={state.IdInforme == 0 && !validarDerecho(9101436) ? classes.disabled : ""}
                               href={()=>document.getElementById('Agregar').classList.contains('show')?null:'#Cancelar'}
                               onClick={()=>document.getElementById('Agregar').classList.contains('show') && state.agregar=='Agregar'?null:handleShowCancelar()}>
                                <i className="fa fa-ban"/> Cancelar
                            </a>
                        </li>

                        {/*<li>
                            <a data-toggle="tab" href="#Cubicar" onClick={handleShowCubicar}
                               className={validarDerecho(9101437) ? "" : classes.disabled}>
                                <i className="fa fa-adjust"/> Cubicar / Optimizar Rutas
                            </a>
                        </li>*/}
                    </ul>

                    <div className="tab-content">
                        <div
                            className="widget-wrap"
                            id="Listado"
                            className="tab-pane fade in show"
                        >
                            <div className="widget-wrap">
                                <div className="widget-content">

                                    <div className="row">
                                        <div className="col-md-12">

                                            <Filtros
                                                listaResultado={setDataListado}
                                                informe={true}
                                            />
                                        </div>
                                    </div>

                                    <div className="row" style={{height: state.height - 250, width: "100%"}}>
                                        <DataGrid
                                            localeText={dataGridLocaleText}
                                            rows={data}
                                            columns={columns}
                                            density="compact"
                                            pageSize={Math.floor((state.height - 310) / 30)}
                                            getRowId={(row) => row.m_nIdInforme}
                                            rowsPerPageOptions={[]}
                                            onRowSelectionModelChange={(newModel,e) => {
                                                if(newModel.length<1)
                                                    return
                                                let row=data.find(i=>i.m_nIdInforme==newModel[0])
                                                setState({
                                                    ...state,
                                                    IdInforme: row.m_nIdInforme,
                                                    FolioInforme: row.m_sFolioInforme,
                                                });
                                            }}
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div id="Importar" className="tab-pane fade ">
                            Importar
                        </div>
                        <div id="Agregar" className="tab-pane fade ">
                            {/*INICIO DE ESTRUCTURA */}

                            <form onClick={()=>setDetectar(true)} className="j-forms row" onSubmit={handleAceptar} onKeyDown={e => {
                                if (e.code === 13) {
                                    e.preventDefault()
                                }
                            }}>


                                <div className="row">
                                    <div className="col-md-6">
                                        <div className="widget-wrap">
                                            <div className="widget-container margin-top-0">
                                                <div className="widget-content">
                                                    <div
                                                        className="widget-header">
                                                        <div className="pull-left">
                                                            <h3 style={{marginBottom:"3%"}}>Información De Envío</h3>
                                                        </div>
                                                    </div>

                                                    <div className="widget-container">
                                                        <div className="widget-content">
                                                            <div className="row">
                                                                <div className="col-md-12">
                                                                    <div className="row">
                                                                        <div
                                                                            className="col-sm-6 col-md-6 col-xs-12 unit">
                                                                            <div className="input">
                                                                                <TextField variant="outlined"
                                                                                           size="small"
                                                                                           label="Folio"
                                                                                           fullWidth
                                                                                           className="form-control"
                                                                                           type="text"
                                                                                           InputLabelProps={{
                                                                                               shrink: true,
                                                                                           }}
                                                                                           value={state.FolioInforme}
                                                                                           id="Folio"
                                                                                           disabled
                                                                                />
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                    {/*****************************************Folio************************************************************/}

                                                                    {/*****************************************Fecha*******************************************************/}
                                                                    <div className="col-sm-6 col-md-6 unit">
                                                                        <div className="input">
                                                                            <TextField variant="outlined"
                                                                                       size="small"
                                                                                       fullWidth
                                                                                       label="Fecha y Hora"
                                                                                       onChange={handleChange}
                                                                                       className="form-control"
                                                                                       type="datetime-local"
                                                                                       required
                                                                                       InputLabelProps={{
                                                                                           shrink: true,
                                                                                       }}
                                                                                       value={state.fechaHora}
                                                                                       disabled
                                                                                       id="fechaHora"
                                                                            />
                                                                        </div>
                                                                    </div>
                                                                    {/*****************************************Hora*******************************************************/}
                                                                    {/*****************************************Estatus de Entrega*************************************************/}
                                                                    <div className="col-sm-6 col-md-6 unit">

                                                                        <label className="input select">
                                                                            <FormControl required fullWidth
                                                                                         variant="outlined"
                                                                                         size="small">
                                                                                <InputLabel
                                                                                    id="EstatusInformeLabel">Estatus</InputLabel>
                                                                                <Select
                                                                                    labelId="EstatusInformeLabel"
                                                                                    label="Estatus"
                                                                                    fullWidth
                                                                                    className="form-control"
                                                                                    required
                                                                                    onChange={handleSelectEstatus}
                                                                                    value={state.EstatusInforme}
                                                                                    id="EstatusInforme"
                                                                                    disabled={state.agregar === "Agregar" || state.agregar === "Consultar"}
                                                                                >
                                                                                    <MenuItem
                                                                                        value="">Seleccionar
                                                                                    </MenuItem>
                                                                                    {dataEstatusInformes.map(
                                                                                        (EstatusInforme) => (
                                                                                            <MenuItem
                                                                                                key={EstatusInforme.m_nIdEstatusInforme}
                                                                                                value={EstatusInforme.m_nIdEstatusInforme}
                                                                                            >{EstatusInforme.m_sEstatus}
                                                                                            </MenuItem>
                                                                                        )
                                                                                    )
                                                                                    }
                                                                                </Select>
                                                                            </FormControl>
                                                                        </label>
                                                                    </div>
                                                                    <div className="row">
                                                                        <div className="col-sm-12 col-md-6 unit">
                                                                            <label className="input select">
                                                                                <FormControl fullWidth
                                                                                             variant="outlined"
                                                                                             size="small" required>
                                                                                    <InputLabel
                                                                                        id="tipoTimbradoLabel">Tipo de servicio</InputLabel>
                                                                                    <Select
                                                                                        labelId="tipoTimbradoLabel"
                                                                                        label="Tipo de timbrado"
                                                                                        className="form-control"
                                                                                        required
                                                                                        id="tipoTimbrado"
                                                                                        name="tipoTimbrado"
                                                                                        read="true"
                                                                                        disabled={state.FolioInforme !== ''}
                                                                                        onChange={handleSelectTipoTimbrado}
                                                                                        value={state.tipoTimbrado}
                                                                                    >
                                                                                        <MenuItem key={"1"}
                                                                                                value={1}
                                                                                        >
                                                                                            Consolidado
                                                                                        </MenuItem>
                                                                                        <MenuItem key={"2"}
                                                                                                value={2}
                                                                                        >
                                                                                            Paquetería
                                                                                        </MenuItem>
                                                                                    </Select>
                                                                                </FormControl>
                                                                            </label>
                                                                        </div>
                                                                    </div>

                                                                    <div className="row">
                                                                        {/*****************************************Oficina Emisora***************************************************/}
                                                                        <div className="col-sm-6 col-md-6 unit">

                                                                            <label className="input select">
                                                                                <FormControl fullWidth
                                                                                             variant="outlined"
                                                                                             size="small" required>
                                                                                    <InputLabel
                                                                                        id="sucursalEmisoraLabel">Oficina
                                                                                        Emisora</InputLabel>
                                                                                    <Select
                                                                                        labelId="sucursalEmisoraLabel"
                                                                                        label="Oficina Emisora"
                                                                                        className="form-control"
                                                                                        required
                                                                                        value={state.sucursalEmisora}
                                                                                        id="sucursalEmisora"
                                                                                        onChange={handleSelectSucursalEmisora}
                                                                                        disabled
                                                                                    >
                                                                                        {dataSucursal.filter(i => parseInt(i.m_nIdSucursal) !== parseInt(state.sucursalReceptora)).map((sucursalEmisora) => (
                                                                                                <MenuItem
                                                                                                    key={sucursalEmisora.m_nIdSucursal}
                                                                                                    value={sucursalEmisora.m_nIdSucursal}>
                                                                                                    {sucursalEmisora.m_sSucursal}
                                                                                                </MenuItem>
                                                                                            )
                                                                                        )}
                                                                                    </Select>
                                                                                </FormControl>
                                                                            </label>

                                                                        </div>


                                                                        {/*****************************************Oficina Receptora*************************************************/}
                                                                        <div className="col-sm-12 col-md-6 unit">

                                                                            <label className="input select">
                                                                                <FormControl fullWidth
                                                                                             variant="outlined"
                                                                                             size="small" required>
                                                                                    <InputLabel
                                                                                        id="sucursalReceptoraLabel">Oficina
                                                                                        Receptora</InputLabel>
                                                                                    <Select
                                                                                        labelId="sucursalReceptoraLabel"
                                                                                        label="Oficina Receptora"
                                                                                        className="form-control"
                                                                                        required
                                                                                        value={state.sucursalReceptora}
                                                                                        id="sucursalReceptora"
                                                                                        onChange={handleSelectSucursalReceptora}
                                                                                    >
                                                                                        {dataSucursal.filter(i => parseInt(i.m_nIdSucursal) !== parseInt(state.sucursalEmisora)).map(
                                                                                            (sucursalReceptora) => (
                                                                                                <MenuItem
                                                                                                    key={sucursalReceptora.m_nIdSucursal}
                                                                                                    value={sucursalReceptora.m_nIdSucursal}>
                                                                                                    {sucursalReceptora.m_sSucursal}
                                                                                                </MenuItem>
                                                                                            )
                                                                                        )}
                                                                                    </Select>
                                                                                </FormControl>
                                                                            </label>
                                                                        </div>
                                                                    </div>
                                                                    {/*****************************************TipoTimbrado*************************************************/}



                                                                    {/*****************************************Remolque*************************************************/}
                                                                    <div className="row">
                                                                        <div className="col-sm-12 col-md-6 unit">

                                                                            <div className="input">
                                                                                <Autocomplete
                                                                                    freeSolo
                                                                                    size="small"
                                                                                    value={state.IdRemolque1==null?"":state.IdRemolque1}
                                                                                    onChange={(index, newValue) => onChangeRemolque1(index,newValue) }
                                                                                    id="IdRemolque1"
                                                                                    forcePopupIcon={false}
                                                                                    options={dataUnidades}
                                                                                    getOptionLabel={(option) =>
                                                                                        option ? `${option.m_sCodigo} - ${option.m_sDescripcion}` : ""
                                                                                    }
                                                                                    variant="outlined"
                                                                                    style={{
                                                                                        transform: "translate(14px, 10px) scale(1) !important"
                                                                                    }}
                                                                                    renderInput={(params) => (
                                                                                        <div>
                                                                                            <TextField
                                                                                                variant="outlined"
                                                                                                id="Aut1"
                                                                                                label="Remolque 1"
                                                                                                size="small"
                                                                                                required
                                                                                                className="form-control"
                                                                                                {...params}
                                                                                                InputProps={{
                                                                                                    ...params.InputProps,
                                                                                                    style: {
                                                                                                        height: 24,
                                                                                                    },
                                                                                                    type: "search",
                                                                                                    disableUnderline: true,
                                                                                                }}
                                                                                            />
                                                                                        </div>
                                                                                    )}
                                                                                />
                                                                            </div>
                                                                        </div>
                                                                        {/*****************************************Placa Int*************************************************/}
                                                                        <div className="col-sm-12 col-md-6 unit">

                                                                            <div className="input">
                                                                                <TextField variant="outlined"
                                                                                           size="small"
                                                                                           label="Placa Int"
                                                                                           fullWidth
                                                                                           disabled
                                                                                           value={state.PlacasRemolque1}
                                                                                           className="form-control"
                                                                                           type="text"
                                                                                           id="PlacasRemolque1"
                                                                                />
                                                                            </div>
                                                                        </div>
                                                                    </div>

                                                                    <div className="row">
                                                                        <div className="col-sm-12 col-md-6 unit">

                                                                            <div className="input">
                                                                                <Autocomplete
                                                                                    freeSolo
                                                                                    size="small"
                                                                                    value={state.IdRemolque2==null?"":state.IdRemolque2}
                                                                                    onChange={(index, newValue) => onChangeRemolque2(index,newValue) }
                                                                                    id="IdRemolque2"
                                                                                    onInputChange={(event, newInputValue, reason) => {
                                                                                        if (reason === 'reset') {
                                                                                            setState({
                                                                                                ...state,
                                                                                                IdRemolque2: null
                                                                                            })

                                                                                        }
                                                                                    }}
                                                                                    forcePopupIcon={false}
                                                                                    options={dataUnidades}
                                                                                    getOptionLabel={(option) =>
                                                                                        option ? `${option.m_sCodigo} - ${option.m_sDescripcion}` : ""
                                                                                    }
                                                                                    variant="outlined"
                                                                                    style={{
                                                                                        transform: "translate(14px, 10px) scale(1) !important"
                                                                                    }}
                                                                                    renderInput={(params) => (
                                                                                        <div>
                                                                                            <TextField
                                                                                                variant="outlined"
                                                                                                label="Remolque 2"
                                                                                                size="small"
                                                                                                className="form-control"
                                                                                                {...params}
                                                                                                InputProps={{
                                                                                                    ...params.InputProps,
                                                                                                    style: {
                                                                                                        height: 24,
                                                                                                    },
                                                                                                    type: "search",
                                                                                                    disableUnderline: true,
                                                                                                }}
                                                                                            />
                                                                                        </div>
                                                                                    )}
                                                                                />
                                                                            </div>
                                                                        </div>
                                                                        {/*****************************************Placa Int*************************************************/}
                                                                        <div className="col-sm-12 col-md-6 unit">

                                                                            <div className="input">
                                                                                <TextField variant="outlined"
                                                                                           size="small"
                                                                                           fullWidth
                                                                                           label="Placa Int"
                                                                                           value={state.PlacasRemolque2}
                                                                                           disabled
                                                                                           className="form-control"
                                                                                           type="text"
                                                                                           id="PlacasRemolque2"
                                                                                />
                                                                            </div>
                                                                        </div>
                                                                    </div>

                                                                    {/*****************************************Origen*************************************************/}
                                                                    <div className="row">
                                                                        <div className="col-sm-12 col-md-6 unit">

                                                                            <div className="input">
                                                                                <Autocomplete
                                                                                    freeSolo
                                                                                    size="small"
                                                                                    onChange={(event, newValue) =>
                                                                                        setState({
                                                                                            ...state,
                                                                                            IdCiudadOrigen: newValue,
                                                                                        })
                                                                                    }
                                                                                    value={state.IdCiudadOrigen==null?"":state.IdCiudadOrigen}
                                                                                    id="IdCiudadOrigen"
                                                                                    forcePopupIcon={false}
                                                                                    options={dataOrigenes}
                                                                                    getOptionLabel={(option) =>
                                                                                        option? option.m_sCiudad:""
                                                                                    }
                                                                                    variant="outlined"
                                                                                    style={{
                                                                                        transform: "translate(14px, 10px) scale(1) !important"
                                                                                    }}
                                                                                    renderInput={(params) => (
                                                                                        <div>
                                                                                            <TextField
                                                                                                variant="outlined"
                                                                                                label="Origen"
                                                                                                size="small"
                                                                                                required
                                                                                                className="form-control"
                                                                                                {...params}
                                                                                                InputProps={{
                                                                                                    ...params.InputProps,
                                                                                                    style: {
                                                                                                        height: 24,
                                                                                                    },
                                                                                                    type: "search",
                                                                                                    disableUnderline: true,
                                                                                                }}
                                                                                            />
                                                                                        </div>
                                                                                    )}
                                                                                />
                                                                            </div>
                                                                        </div>
                                                                        {/*****************************************Destino*************************************************/}
                                                                        <div className="col-sm-12 col-md-6 unit">

                                                                            <div className="input">
                                                                                <Autocomplete
                                                                                    freeSolo
                                                                                    required
                                                                                    size="small"
                                                                                    onChange={(event, newValue) =>
                                                                                        setState({
                                                                                            ...state,
                                                                                            IdCiudadDestino: newValue,
                                                                                        })
                                                                                    }

                                                                                    value={state.IdCiudadDestino==null?"":state.IdCiudadDestino}
                                                                                    id="IdCiudadDestino"
                                                                                    forcePopupIcon={false}
                                                                                    options={dataOrigenes}
                                                                                    getOptionLabel={(option) =>
                                                                                        option?option.m_sCiudad:""
                                                                                    }
                                                                                    variant="outlined"
                                                                                    className="form-control"
                                                                                    style={{
                                                                                        transform: "translate(14px, 10px) scale(1) !important"
                                                                                    }}
                                                                                    renderInput={(params) => (
                                                                                        <div>
                                                                                            <TextField
                                                                                                variant="outlined"
                                                                                                label="Destino"
                                                                                                required
                                                                                                size="small"
                                                                                                {...params}
                                                                                                InputProps={{
                                                                                                    ...params.InputProps,
                                                                                                    style: {
                                                                                                        height: 24,
                                                                                                    },
                                                                                                    type: "search",
                                                                                                    disableUnderline: true,
                                                                                                }}
                                                                                            />
                                                                                        </div>
                                                                                    )}
                                                                                />
                                                                            </div>
                                                                        </div>
                                                                        {/*****************************************Utilización*************************************************/}

                                                                        <div className="col-sm-12 col-md-12 unit">
                                                                            <ProgressBarCubicaje
                                                                                value={utilizacion}>{utilizacion > 100 ? mensajesUtilizacion : `Espacio de carga usado: ${utilizacion}%`}
                                                                            </ProgressBarCubicaje>

                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>

                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="col-md-6">
                                        <div className="widget-wrap">
                                            <div className="widget-header">
                                                <div className="pull-left">
                                                    <h3>Detalles de Guías</h3>
                                                </div>
                                            </div>
                                            <div className="widget-container">
                                                <div className="widget-content">
                                                    <div className="row">
                                                        <div className="col-md-12">
                                                            {dataGuias.length !== 0 &&
                                                                <form className="j-forms" noValidate>
                                                                    <div className="form-content">
                                                                        <FormControlLabel
                                                                            checked={todasGuiasSeleccionadas()}
                                                                            control={
                                                                                <Checkbox
                                                                                    name="selecionarGuias"
                                                                                    onClick={(e) => setDataGuias(dataGuias.map(d => {
                                                                                        if ((filtroFolio?dataGuias.filter((g)=>g.m_nFolioGuia.includes(textoFiltro)):dataGuias).map(g => g.m_nIdGuia).includes(d.m_nIdGuia)){
                                                                                            d.select = e.target.checked;
                                                                                        }
                                                                                        return d;
                                                                                    }))}
                                                                                    color="primary"
                                                                                />
                                                                            }
                                                                            label="Seleccionar todas"
                                                                        />
                                                                        <IconButton
                                                                            aria-label="delete"
                                                                            className={classes.margin}
                                                                            onClick={handleChangeOrden}
                                                                            size="large">
                                                                            {
                                                                                ordenAscendente ?
                                                                                    <ArrowUpwardIcon
                                                                                        fontSize="default"/>
                                                                                    :
                                                                                    <ArrowDownwardIcon
                                                                                        fontSize="default"/>
                                                                            }
                                                                            {
                                                                                ordenAscendente ?
                                                                                    "Ordenar ascendentemente"
                                                                                    :
                                                                                    "Ordenar descendentemente"
                                                                            }

                                                                        </IconButton>


                                                                        <TextField style={{width:'40%'}}
                                                                                   /*onChange={(e)=>{
                                                                                       const waitTime=1000
                                                                                       let timer
                                                                                       clearTimeout(timer)
                                                                                       timer=setTimeout(()=>{
                                                                                           setFiltro(e.target.value)
                                                                                       },waitTime)
                                                                                   }}*/
                                                                                   id='filtroFolio' variant={'outlined'} margin='dense' label='Filtro por Folio' type='text'></TextField>
                                                                        <IconButton aria-label="search"
                                                                                    className={classes.margin}
                                                                                    onClick={()=>handleFiltroFolio()}>
                                                                            <SearchIcon fontSize={'default'}></SearchIcon>
                                                                            BUSCAR

                                                                        </IconButton>
                                                                        <div style={{
                                                                            padding: "10px",
                                                                            maxHeight: "500px",
                                                                            overflow: "scroll"
                                                                        }}>
                                                                            {(filtroFolio?dataGuias.filter((g)=>g.m_nFolioGuia.includes(textoFiltro)):dataGuias).map((value, index) => {
                                                                                return (
                                                                                    <div>
                                                                                        <br/>
                                                                                        <ButtonBase
                                                                                            style={{
                                                                                                width: "100%",
                                                                                                borderRadius: "10px",
                                                                                            }}
                                                                                            disabled={state.agregar === "Consultar"}
                                                                                            onClick={() => selectGuia(value)}
                                                                                        >
                                                                                            <Grid container spacing={2}>
                                                                                                <Grid
                                                                                                    item
                                                                                                    sm={1}
                                                                                                    style={{
                                                                                                        display:"flex",
                                                                                                        justifyContent: "center",
                                                                                                        alignItems: "center",
                                                                                                        textAlign: "center",
                                                                                                        padding:"0% 0% 0% 1%",
                                                                                                        backgroundColor: state.validarTimbrado? value.isTimbrada? value.select? "#F9A03E" : "gray" : value.select? "#FF6600": "#ffc9bb" :value.select
                                                                                                            ? "#F9A03E"
                                                                                                            : "gray",
                                                                                                    }}

                                                                                                >
                                                                                                    {index + 1}
                                                                                                </Grid>
                                                                                                <Grid
                                                                                                    container
                                                                                                    item
                                                                                                    sm={11}
                                                                                                    style={{
                                                                                                        width: "100%",
                                                                                                        borderRadius: "10px",
                                                                                                    }}
                                                                                                >
                                                                                                    <Grid container
                                                                                                          spacing={2}>
                                                                                                        <Grid item
                                                                                                              sm={12}
                                                                                                              md={4}>
                                                                                                            <div
                                                                                                                className="input">

                                                                                                                <TextField
                                                                                                                    variant="outlined"
                                                                                                                    size="small"
                                                                                                                    fullWidth
                                                                                                                    label="Folio Guía"
                                                                                                                    onChange={handleChange}
                                                                                                                    value={value.m_nFolioGuia}
                                                                                                                    className="form-control"
                                                                                                                    type="text"
                                                                                                                    disabled="true"
                                                                                                                    id={"folio-" + index}
                                                                                                                />
                                                                                                            </div>
                                                                                                        </Grid>
                                                                                                        <Grid item
                                                                                                              sm={12}
                                                                                                              md={4}>
                                                                                                            <div
                                                                                                                className="input">

                                                                                                                <TextField
                                                                                                                    variant="outlined"
                                                                                                                    fullWidth
                                                                                                                    size="small"
                                                                                                                    label="Estatus Guía"
                                                                                                                    className="form-control"
                                                                                                                    type="text"
                                                                                                                    disabled="true"
                                                                                                                    value={
                                                                                                                        value.m_sEstatusGuia
                                                                                                                    }
                                                                                                                    id={"estatus-" + index}
                                                                                                                />
                                                                                                            </div>
                                                                                                        </Grid>
                                                                                                        <Grid item
                                                                                                              sm={12}
                                                                                                              md={4}>
                                                                                                            <div
                                                                                                                className="input">

                                                                                                                <TextField
                                                                                                                    variant="outlined"
                                                                                                                    size="small"
                                                                                                                    label="Total"
                                                                                                                    fullWidth
                                                                                                                    value={`$${value.m_xTotal.toFixed(2)}`}
                                                                                                                    disabled="true"
                                                                                                                    className="form-control"
                                                                                                                    type="text"
                                                                                                                    id={"total-" + index}
                                                                                                                />
                                                                                                            </div>
                                                                                                        </Grid>
                                                                                                        <Grid item
                                                                                                              sm={12}
                                                                                                              md={6}>
                                                                                                            <div
                                                                                                                className="input">

                                                                                                                <TextField
                                                                                                                    variant="outlined"
                                                                                                                    size="small"
                                                                                                                    fullWidth
                                                                                                                    label="Destino"
                                                                                                                    value={value.m_sCiudadDestino}
                                                                                                                    className="form-control"
                                                                                                                    type="text"
                                                                                                                    disabled="true"
                                                                                                                    id={"destino-" + index}
                                                                                                                />
                                                                                                            </div>
                                                                                                        </Grid>
                                                                                                        <Grid item
                                                                                                              sm={12}
                                                                                                              md={6}>
                                                                                                            <div
                                                                                                                className="input">

                                                                                                                <TextField
                                                                                                                    variant="outlined"
                                                                                                                    fullWidth
                                                                                                                    size="small"
                                                                                                                    label="Tipo de Servicio"
                                                                                                                    disabled="true"
                                                                                                                    value={parseInt(state.tipoTimbrado) === 1? 'Consolidado' : parseInt(state.tipoTimbrado) === 2?'Paqueteria':'Indefinido'}
                                                                                                                    className="form-control"
                                                                                                                    type="text"
                                                                                                                    id={"servicio-" + index}
                                                                                                                />
                                                                                                            </div>
                                                                                                        </Grid>
                                                                                                        <Grid item
                                                                                                              sm={12}
                                                                                                              md={12}>
                                                                                                            <div
                                                                                                                className="input">

                                                                                                                <TextField
                                                                                                                    variant="outlined"
                                                                                                                    size="small"
                                                                                                                    fullWidth
                                                                                                                    label="Observaciones"
                                                                                                                    disabled="true"
                                                                                                                    InputLabelProps={{ shrink: true }}
                                                                                                                    value={
                                                                                                                        value.m_sObservaciones
                                                                                                                    }
                                                                                                                    className="form-control"
                                                                                                                    type="text"
                                                                                                                    id={
                                                                                                                        "observacion-" + index
                                                                                                                    }
                                                                                                                />
                                                                                                            </div>
                                                                                                        </Grid>
                                                                                                    </Grid>
                                                                                                </Grid>
                                                                                            </Grid>
                                                                                        </ButtonBase>
                                                                                        <br/>
                                                                                    </div>
                                                                                );
                                                                            })}
                                                                        </div>
                                                                        <br/>
                                                                        <Grid
                                                                            container
                                                                            style={{
                                                                                borderStyle: "solid",
                                                                                borderRadius: "10px",
                                                                            }}
                                                                            spacing={1}
                                                                        >
                                                                            <Grid
                                                                                item
                                                                                sm={4}
                                                                                justifyContent="center"
                                                                                alignItems="center"
                                                                                style={{
                                                                                    display: "flex",
                                                                                    justifyContent: "center",
                                                                                    alignItems: "center",
                                                                                    textAlign: "center",
                                                                                }}
                                                                            >
                                                                                Total de guías :{" "}
                                                                                {dataGuias.filter((g) => g.select).length}
                                                                            </Grid>
                                                                            <Grid
                                                                                item
                                                                                sm={8}
                                                                                style={{
                                                                                    justifyContent: "left",
                                                                                    alignItems: "left",
                                                                                    textAlign: "left",
                                                                                }}
                                                                            >
                                                                                <Grid container>
                                                                                    {/*<Grid
                                                                                    item
                                                                                    sm={6}
                                                                                    style={{
                                                                                        justifyContent: "left",
                                                                                        alignItems: "left",
                                                                                        textAlign: "left",
                                                                                    }}
                                                                                >
                                                                                    Total Por Cobrar Destinatario
                                                                                </Grid>
                                                                                <Grid
                                                                                    item
                                                                                    sm={6}
                                                                                    style={{
                                                                                        justifyContent: "right",
                                                                                        alignItems: "right",
                                                                                        textAlign: "right",
                                                                                    }}
                                                                                >
                                                                                    ${dataGuias.filter((g) => g.select && g.m_nIdTIpoCobro === 3).length == 0 && 0}{dataGuias.filter((g) => g.select && g.m_nIdTIpoCobro === 3).length != 0 && dataGuias.filter((g) => g.select && g.m_nIdTIpoCobro === 3).reduce((accumulator, curr) => +accumulator + +(curr.m_arClsGuiaConceptos.length !== 0 ? curr.m_arClsGuiaConceptos.reduce((a, b) => +a + +b.m_cTotal, 0) : 0), 0)}
                                                                                </Grid>*/}
                                                                                    {/*<Grid
                                                                                    item
                                                                                    sm={6}
                                                                                    style={{
                                                                                        justifyContent: "left",
                                                                                        alignItems: "left",
                                                                                        textAlign: "left",
                                                                                    }}
                                                                                >
                                                                                    Total Por Cobrar Remitente
                                                                                </Grid>
                                                                                <Grid
                                                                                    item
                                                                                    sm={6}
                                                                                    style={{
                                                                                        justifyContent: "right",
                                                                                        alignItems: "right",
                                                                                        textAlign: "right",
                                                                                    }}
                                                                                >
                                                                                    ${dataGuias.filter((g) => g.select && g.m_nIdTIpoCobro === 5).length == 0 && 0}{dataGuias.filter((g) => g.select && g.m_nIdTIpoCobro === 5).length != 0 && dataGuias.filter((g) => g.select && g.m_nIdTIpoCobro === 5).reduce((accumulator, curr) => +accumulator + +(curr.m_arClsGuiaConceptos.length !== 0 ? curr.m_arClsGuiaConceptos.reduce((a, b) => +a + +b.m_cTotal, 0) : 0), 0)}
                                                                                </Grid>*/}
                                                                                    {/*<Grid*/}
                                                                                    {/*    item*/}
                                                                                    {/*    sm={6}*/}
                                                                                    {/*    style={{*/}
                                                                                    {/*        justifyContent: "left",*/}
                                                                                    {/*        alignItems: "left",*/}
                                                                                    {/*        textAlign: "left",*/}
                                                                                    {/*    }}*/}
                                                                                    {/*>*/}
                                                                                    {/*    Total Pagado en Mostrador*/}
                                                                                    {/*</Grid>*/}
                                                                                    {/*<Grid*/}
                                                                                    {/*    item*/}
                                                                                    {/*    sm={6}*/}
                                                                                    {/*    style={{*/}
                                                                                    {/*        justifyContent: "right",*/}
                                                                                    {/*        alignItems: "right",*/}
                                                                                    {/*        textAlign: "right",*/}
                                                                                    {/*    }}*/}
                                                                                    {/*>*/}
                                                                                    {/*    ${dataGuias.filter((g) => g.select && g.m_nIdTIpoCobro === 2).length == 0 && 0}{dataGuias.filter((g) => g.select && g.m_nIdTIpoCobro === 2).length != 0 && dataGuias.filter((g) => g.select && g.m_nIdTIpoCobro === 2).reduce((accumulator, curr) => +accumulator + +(curr.m_arClsGuiaConceptos.length !== 0 ? curr.m_arClsGuiaConceptos.reduce((a, b) => +a + +b.m_cTotal, 0) : 0), 0)}*/}
                                                                                    {/*</Grid>*/}

                                                                                    {/*    <Grid
                                                                                    item
                                                                                    sm={6}
                                                                                    style={{
                                                                                        justifyContent: "left",
                                                                                        alignItems: "left",
                                                                                        textAlign: "left",
                                                                                    }}
                                                                                >
                                                                                    Total Unidad Completa
                                                                                </Grid>
                                                                                <Grid
                                                                                    item
                                                                                    sm={6}
                                                                                    style={{
                                                                                        justifyContent: "right",
                                                                                        alignItems: "right",
                                                                                        textAlign: "right",
                                                                                    }}
                                                                                >
                                                                                    ${dataGuias.filter((g) => g.select && g.m_nIdTIpoCobro === 7).length == 0 && 0}{dataGuias.filter((g) => g.select && g.m_nIdTIpoCobro === 7).length != 0 && dataGuias.filter((g) => g.select && g.m_nIdTIpoCobro === 7).reduce((accumulator, curr) => +accumulator + +(curr.m_arClsGuiaConceptos.length !== 0 ? curr.m_arClsGuiaConceptos.reduce((a, b) => +a + +b.m_cTotal, 0) : 0), 0)}
                                                                                </Grid>*/}
                                                                                    <Grid
                                                                                        item
                                                                                        sm={6}
                                                                                        style={{
                                                                                            justifyContent: "left",
                                                                                            alignItems: "left",
                                                                                            textAlign: "left",
                                                                                        }}
                                                                                    >
                                                                                        <b style={{fontWeight: "bold"}}>
                                                                                            Total Flete:
                                                                                            ${dataGuias.filter((g) => g.select).length == 0 && 0}{dataGuias.filter((g) => g.select).length != 0 && `${parseFloat(dataGuias.filter((g) => g.select).reduce((accumulator, curr) => +accumulator + +(curr.m_xTotal), 0)).toFixed(2)}`}
                                                                                        </b>
                                                                                    </Grid>
                                                                                    <Grid
                                                                                        item
                                                                                        sm={6}
                                                                                        style={{
                                                                                            justifyContent: "right",
                                                                                            alignItems: "right",
                                                                                            textAlign: "right",
                                                                                        }}
                                                                                    >

                                                                                    </Grid>

                                                                                </Grid>

                                                                            </Grid>
                                                                            <Grid
                                                                                item
                                                                                sm={4}
                                                                                justifyContent="center"
                                                                                alignItems="center"
                                                                                style={{
                                                                                    display: "flex",
                                                                                    justifyContent: "center",
                                                                                    alignItems: "center",
                                                                                    textAlign: "center",
                                                                                }}
                                                                            >
                                                                                Peso total : {" "}
                                                                                {dataGuias.filter((g) => g.select).length == 0 && 0}{dataGuias.filter((g) => g.select).length != 0 && `${(parseFloat(dataGuias.filter((g) => g.select).reduce((accumulator, curr) => +accumulator + +(curr.m_xPeso), 0))).toFixed(2)}`} kg
                                                                            </Grid>

                                                                        </Grid>
                                                                    </div>
                                                                </form>
                                                            }

                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="form-footer" className="col-md-12">
                                    <Grid container spacing={1}>
                                        <Grid item xs>
                                            <Button
                                                fullWidth
                                                type="button"
                                                onClick={clickCancelar}
                                                className="btn btn-secondary secondary-btn"
                                                disabled={!validarDerecho(9101436)}
                                            >
                                                Cancelar
                                            </Button>
                                        </Grid>
                                        <Grid item xs>
                                            <Button
                                                fullWidth
                                                type="submit"
                                                className="btn btn-primary primary-btn"
                                                disabled={state.agregar == "Consultar"}
                                            >
                                                Guardar informe
                                            </Button>
                                        </Grid>
                                    </Grid>

                                    {
                                        state.cubicar &&
                                        <div>
                                            {state.indexCubicar + 1} de {informes.length}
                                        </div>
                                    }

                                </div>
                            </form>
                        </div>
                        <div id="Cancelar" className="tab-pane fade">
                            <div className="widget-wrap">
                                <div className="widget-container">
                                    <div className="widget-content">
                                        <div className="row">
                                            <form className="j-forms" onSubmit={handleCancelar} onKeyDown={e => {
                                                if (e.code === 13) {
                                                    e.preventDefault()
                                                }
                                            }}>
                                                <div className="form-content">
                                                    <div className="col-sm-6 col-md-2-5 col-lg-2-5 unit">
                                                        <div className="input">
                                                            <TextField variant="outlined" size="small"
                                                                       label="Folio Informe"
                                                                       className="form-control"
                                                                       type="text"
                                                                       fullWidth
                                                                       value={state.FolioInforme}
                                                                       id="FolioInforme"
                                                                       disabled
                                                            />
                                                        </div>
                                                    </div>

                                                    <div className="col-sm-6 col-md-2-5 col-lg-2-5 unit">
                                                        <div className="input">
                                                            <TextField variant="outlined" size="small"
                                                                       label="Sucursal Emisora"
                                                                       className="form-control"
                                                                       type="text"
                                                                       fullWidth
                                                                       value={state.sucursalCancelacion}
                                                                       id="sucursalCancelacion"
                                                                       disabled
                                                            />
                                                        </div>
                                                    </div>

                                                    <div className="col-sm-6 col-md-2-5 col-lg-2-5 unit">
                                                        <div className="input">
                                                            <TextField variant="outlined" size="small"
                                                                       label="Fecha de cancelación"
                                                                       className="form-control"
                                                                       type="datetime-local"
                                                                       fullWidth
                                                                       value={state.fechaCancelacion}
                                                                       id="fechaCancelacion"
                                                                       disabled
                                                            />
                                                        </div>
                                                    </div>

                                                    <div className="col-sm-6 col-md-2-5 col-lg-2-5 unit">
                                                        <div className="input">
                                                            <TextField variant="outlined" size="small" label="Usuario"
                                                                       className="form-control"
                                                                       type="text"
                                                                       fullWidth
                                                                       value={state.usuarioCancelacion}
                                                                       id="usuarioCancelacion"
                                                                       disabled
                                                            />
                                                        </div>
                                                    </div>

                                                    <div className="col-sm-6 col-md-2-5 col-lg-2-5 unit">
                                                        <div className="input">
                                                            <TextField variant="outlined" size="small" label="Estatus"
                                                                       className="form-control"
                                                                       type="text"
                                                                       fullWidth
                                                                       value={state.estatusCancelacion}
                                                                       id="estatusCancelacion"
                                                                       disabled
                                                            />
                                                        </div>
                                                    </div>

                                                    <div className="col-sm-12 col-md-12 col-lg-12 unit">
                                                        <div className="input">
                                                            <TextField variant="outlined" size="small" label="Motivo"
                                                                       className="form-control"
                                                                       type="text"
                                                                       fullWidth
                                                                       onChange={handleChange}
                                                                       value={state.motivoCancelacion}
                                                                       id="motivoCancelacion"
                                                                       disabled={!state.sePuedeCancelar}
                                                            />
                                                        </div>
                                                    </div>

                                                    <div className="form-footer" className="col-md-12">
                                                        <Grid container spacing={2}>
                                                            <Grid item xs>
                                                                <Button
                                                                    fullWidth
                                                                    type="submit"
                                                                    className="btn btn-primary primary-btn"
                                                                    disabled={!state.sePuedeCancelar}
                                                                >
                                                                    Guardar Cambios
                                                                </Button>
                                                            </Grid>
                                                        </Grid>
                                                    </div>
                                                </div>
                                            </form>
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

export default Informes;
