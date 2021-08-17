import logo from "../logo.svg";
import "../App.css";

import React, { useEffect, useState, setData, useMemo, Component } from "react";

import axios from "axios";

import Cabecera from "../Components/Template/Cabecera";
import BarraLateralIzquierda from "../Components/Template/BarraLateralIzquierda";
import BarraLateralDerecha from "../Components/Template/BarraLateralDerecha";
import { useTable, useFilters, useSortBy } from "react-table";
import ExportPDF from "../Components/Template/ExportPDF";
import TextField from "@material-ui/core/TextField";
import Autocomplete from "@material-ui/lab/Autocomplete";
import $ from "jquery";
import { remove_array_element } from "../Util/Util";
import SvgIcon from "@material-ui/core/SvgIcon";
import { ReactComponent as Activo } from "../iconos/Menu/palomita.svg";
import { ReactComponent as NoActivo } from "../iconos/Menu/cruz.svg";
import { makeStyles } from "@material-ui/core/styles";
import {
    DataGrid,
    GridToolbarExport,
    GridToolbarContainer,
} from "@material-ui/data-grid";
import { dataGridLocaleText } from "../Constants/index";
import Noty from "noty";
import {
    InputLabel,
    Select,
    FormControl,
    Tooltip,
    Stepper,
    Step,
    StepLabel,
    FormControlLabel,
    Checkbox, Button
} from "@material-ui/core";
import Grid from '@material-ui/core/Grid'
import CheckBoxOutlineBlankIcon from '@material-ui/icons/CheckBoxOutlineBlank';
import CheckBoxIcon from '@material-ui/icons/CheckBox';
import { agregarCliente, eliminarCliente, modificarCliente, obtenerCliente, obtenerClienteId, validarNumeroCliente } from "../Util/Contexts/ClientesContext";
import { obtenerGrupoClientes } from "../Util/Contexts/GrupoClientesContext";
import { obtenerMonedas } from "../Util/Contexts/MonedaContext";
import { obtenerPaises } from "../Util/Contexts/PaisesContext";
import { obtenerFormatosImpresion } from "../Util/Contexts/FormatosImpresionContext";
import { obtenerImpuestos } from "../Util/Contexts/ImpuestosContext";
import { obtenerSucursales } from "../Util/Contexts/SucursalContext";
import { obtenerEstadosPais } from "../Util/Contexts/EstadosContext";
import { validarPermisos } from "../Util/Contexts/UsuarioContext";
import NavTabs from "./Clientes/NavTabs";
import BlockHeaderH3 from "./Clientes/BlockHeaderH3";
import SectionHeaderH4 from "./Clientes/SectionHeaderH4";
import FormularioContacto from "./Clientes/FormularioContacto";

function showSuccess(mensaje) {
    new Noty({
        type: "information",
        layout: "topCenter",
        text: mensaje,
        timeout: "3000",
    }).show();
}

window.jQuery = window.$ = $;
const headers = {
    "Content-Type": "application/json",
};

const styles = {
    stepper: {
        position: "sticky",
        top: "60px",
        padding: "15px",
        backgroundColor: "white",
        zIndex: 100,
        marginBottom: "10px",
    },
}

function Clientes(props) {
    const headers = {
        "Content-Type": "application/json",
    };
    const columns = React.useMemo(() => [
        {
            headerName: "Acciones",
            sortable: false, filterable: false,
            field: "",
            renderCell: (row) => {
                return (
                    <div>
                        <Tooltip title="Modificar">
                            <a
                                onClick={() => handleShowModificar(row.row.m_nIdCliente)}
                                className="btn btn-default btn-xs"
                            >
                                <i
                                    className="fa fa-pencil-square-o"
                                    style={{ color: "#F9A03E" }}
                                />
                            </a>
                        </Tooltip>
                        <Tooltip title="Consultar">
                            <a
                                className="btn btn-default btn-xs"
                                onClick={() => handleShowModificar(row.row.m_nIdCliente)}
                            >
                                <i className="fa fa-eye" style={{ color: "#F9A03E" }} />
                            </a>
                        </Tooltip>
                        <Tooltip title="Eliminar">
                            <a
                                className="btn btn-default btn-xs"
                                onClick={() => handleEliminar(row.row.m_nIdCliente)}
                            >
                                <i className="zmdi zmdi-delete" style={{ color: "#F30B0B" }} />
                            </a>
                        </Tooltip>



                    </div>
                );
            },
        },
        {
            headerName: "Núm. Cliente",
            field: "m_nNumeroCliente",
            width: 150,
        },
        {
            headerName: "Tipo Cliente",
            field: "m_nTipoCliente",
            width: 125,
        },
        {
            headerName: "RFC",
            field: "m_sRFC",
            width: 150,
        },
        {
            headerName: "Nombre",
            field: "m_sNombreFiscal",
            width: 200,
        },
        {
            headerName: "Nombre Corto",
            field: "m_sNombreCorto",
            width: 200,
        },
        {
            headerName: "Nombre Sucursal",
            field: "m_sNombreSucursal",
            width: 200,
        },
        {
            headerName: "Activo",
            field: "m_bActivo",
            width: 125,
            renderCell: (row) => {
                return (
                    <div
                        style={{
                            width: "100%",
                            textAlign: "center",
                            color: row.row.m_bActivo ? "green" : "red",
                        }}
                    >
                        {row.row.m_bActivo ? (
                            <SvgIcon component={Activo} />
                        ) : (
                            <SvgIcon component={NoActivo} />
                        )}
                    </div>
                );
            },
        },
    ]);
    const columns2 = React.useMemo(() => [
        {
            headerName: "Formato",
            field: "m_sFormato",
            width : 200,
        },
        {
            headerName: "Tipo proceso",
            field: "m_nTipoProceso",
            width : 200,
        },
    ]);

    function DefaultColumnFilter2({
        column: { filterValue, preFilteredRows, setFilter },
    }) {
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

    function TableFormatos({ columns, data }) {
        const defaultColumn = React.useMemo(
            () => ({
                // Default Filter UI
                Filter: DefaultColumnFilter2,
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
            <div className="col-md-12">
                <table className="tableFormatos" {...getTableProps()}>
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
                                                    <i className="fa fa-caret-up" />
                                                ) : (
                                                    <i className="fa fa-caret-down" />
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
                        {rows.map((row, i) => {
                            prepareRow(row);
                            return (
                                <tr {...row.getRowProps()}>
                                    <td>
                                        <div>
                                            <input
                                                onChange={handleChangeFormatoSelectCheckboxChange}
                                                native
                                                name="formatoSelect"
                                                type="checkbox"
                                                value={state.formatoSelect}
                                                id="formatoSelect"
                                            />
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
        );
    }


    const [dataPais, setDataPais] = React.useState([]);
    const [dataEstado, setDataEstado] = React.useState([]);
    const [dataImpuesto, setDataImpuesto] = React.useState([]);
    const [dataGrupoClientes, setDataGrupoClientes] = React.useState([]);
    const [dataSucursales, setDataSucursales] = React.useState([]);
    const [dataFormatos, setDataFormatos] = React.useState([]);
    const [selectedRows, setSelectedRows] = React.useState([]);
    const [dataListadoClientes, setDataListadoClientes] = React.useState([]);
    const [dataTipoMoneda, setDataTipoMoneda] = React.useState([]);
    const [state, setState] = React.useState({
        CreadoPor: localStorage.getItem("UsuarioId"),
        ModificadoPor: localStorage.getItem("UsuarioId"),
        agregar: "Agregar",
        idCliente: 0,
        numeroCliente: 0,
        tipoCliente: 0,
        rfc: "",
        activo: false,
        operadorLogistico: false,
        nombreFiscal: "",
        nombreCorto: "",
        idSucursal: 0,
        DerechoBorrar: 45,
        idMoneda: 0,
        idImpuestoTransladado: 0,
        aplicarDetalleMaterialesCadaViajeXML: false,

        //ver variable
        aplicarDetalleConceptoCadaViajeXML: false,
        idGrupoCliente: {},

        metodoPago: "",
        diasCredito: 0,
        creadoPor: localStorage.getItem("UsuarioId"),
        creadoEl: "",
        modificadoPor: localStorage.getItem("UsuarioId"),
        modificadoEl: "",
        credito: 0,
        creditoDlls: 0,
        saldoCredito: 0,
        saldoCreditoDLLS: 0,
        pendFacturar: 0,
        pendFacturarDLLS: 0,

        bancoOrdenante: "",
        rfcBancoOrdenante: "",
        cuentaBancoOrdenante: "",

        codigoPostal: 0,
        idEstado: 0,

        municipio: "",
        localidad: "",
        colonia: "",
        calle: "",
        numeroExterior: "",
        numeroInterior: "",
        telefono: "",
        celular: "",
        nextel: "",
        correoElectronico: "",

        tableformatos: "",
        frecuenciaEnvioDias: "",
        enviarApartir: "",

        envioAutomaticoSeguimiento: "",
        excluirNodo: 0,

        idUSOCFDI: "",
        numResgistoIdentidadFiscal: "",
        agruparCantidadPorConcepto: "",
        ajustarImporte2Dec: "",

        formatoSelect: false,
        height: window.innerHeight,
        contactoNombre: "",
        contactoCorreo: "",
        contactoTelefono: "",
        RecibirFactura: 0,
        RecibirEstadoCuenta: 0,
        PermitirSeguimiento: 0,
        UsoServicioWeb: 0,
        PermitirVerPortal: 0,
        RecibirCartaPorte: 0,

        //Variables seguro
        companiaSeguros1: "",
        telefonoSeguro1: "",
        numeroSeguro1: "",
        vencimientoSeguro1: "",
        tipoCobertura1: "",
        companiaSeguros2:"",
        telefonoSeguro2: "",
        numeroSeguro2: "",
        vencimientoSeguro2: "",
        tipoCobertura2: "",

        contactos: [
            {
                m_sNombre: "",
                m_sCorreo: "",
                m_sTelefono: "",
                m_bRecibirFactura: 0,
                m_bRecibirEstadoCuenta: 0,
                m_bPermitirSeguimiento: 0,
                m_bUsoServicioWeb: 0,
                m_bPermitirVerPortal: 0,
                m_bRecibirCartaPorte: 0,
            },
        ],
    });

    const limpiarCamposAgregar = () => {
        setState(state => {
            return {
                ...state,
                agregar: "Agregar",
                idCliente: 0,
                numeroCliente: 0,
                tipoCliente: 0,
                rfc: "",
                activo: false,
                operadorLogistico: false,
                nombreFiscal: "",
                nombreCorto: "",
                idSucursal: 0,
                idMoneda: 0,
                idImpuestoTransladado: 0,
                aplicarDetalleMaterialesCadaViajeXML: false,

                //ver variable
                aplicarDetalleConceptoCadaViajeXML: false,
                idGrupoCliente: {},
                metodoPago: "",
                diasCredito: 0,
                credito: 0,
                creditoDlls: 0,
                saldoCredito: 0,
                saldoCreditoDLLS: 0,
                pendFacturar: 0,
                pendFacturarDLLS: 0,

                bancoOrdenante: "",
                rfcBancoOrdenante: "",
                cuentaBancoOrdenante: "",
                codigoPostal: 0,
                idEstado: 0,
                municipio: "",
                localidad: "",
                colonia: "",
                calle: "",
                numeroExterior: "",
                numeroInterior: "",
                telefono: "",
                celular: "",
                nextel: "",
                correoElectronico: "",

                tableformatos: "",
                frecuenciaEnvioDias: "",
                enviarApartir: "",

                envioAutomaticoSeguimiento: "",
                excluirNodo: 0,

                idUSOCFDI: "",
                agruparCantidadPorConcepto: "",
                ajustarImporte2Dec: "",

                formatoSelect: false,
                contactoNombre: "",
                contactoCorreo: "",
                contactoTelefono: "",
                RecibirFactura: 0,
                RecibirEstadoCuenta: 0,
                PermitirSeguimiento: 0,
                UsoServicioWeb: 0,
                PermitirVerPortal: 0,
                RecibirCartaPorte: 0,

                //Variables seguro
                companiaSeguros1: "",
                telefonoSeguro1: "",
                numeroSeguro1: "",
                vencimientoSeguro1: "",
                tipoCobertura1: "1",
                companiaSeguros2:"",
                telefonoSeguro2: "",
                numeroSeguro2: "",
                vencimientoSeguro2: "",
                tipoCobertura2: "1",
        }
    });
    }

    function handleShowAgregar() {
        limpiarCamposAgregar()
        $('.nav-tabs li ').removeClass('active'); $('.nav-tabs li').eq(1).addClass('active'); $('.tab-content div ').removeClass('in show'); $('#Agregar').addClass('in show');

    }

    function handleShowModificar(id) {
        obtenerClienteId(id).then((respuesta) => {
            setState(state =>{
                return{
                    ...state,
                    agregar: "Modificar",
                }
            })
            mostrarInfo(respuesta)
            $('.nav-tabs li ').removeClass('active'); $('.nav-tabs li').eq(1).addClass('active'); $('.tab-content div ').removeClass('in show'); $('#Agregar').addClass('in show');

        });
    }

    const mostrarInfo = (respuesta) => {
        setState(state => {
            return {
                ...state,
                //idCliente: id,
                idCliente: respuesta.data.m_nIdCliente,
                numeroCliente: respuesta.data.m_nNumeroCliente,
                tipoCliente: respuesta.data.m_nTipoCliente,
                rfc: respuesta.data.m_sRFC,
                activo: respuesta.data.m_bActivo,
                operadorLogistico: respuesta.data.m_bOperadorLogistico,
                nombreFiscal: respuesta.data.m_sNombreFiscal,
                nombreCorto: respuesta.data.m_sNombreCorto,
                idSucursal: respuesta.data.m_nIdSucursal,
                idMoneda: respuesta.data.m_nIdMoneda,
                idImpuestoTransladado: respuesta.data.m_nIdImpuestoTransladado,
                aplicarDetalleMaterialesCadaViajeXML:
                respuesta.data.m_bAplicarDetalleMaterialesCadaViajeXML,
                    //idEstado: respuesta.data.m_nIdEstado,
                    //idGrupoCliente: respuesta.data.m_nIdGrupoCliente,

                    idGrupoCliente: dataGrupoClientes.find(
                (o) => o.m_nIdGrupoCliente == respuesta.data.m_nIdGrupoCliente
            ),
                metodoPago: respuesta.data.m_sMetodoPago,
                diasCredito: respuesta.data.m_nDiasCredito,
                credito: respuesta.data.m_cyCredito,
                creditoDlls: respuesta.data.m_cyCreditoDLLS,
                saldoCredito: respuesta.data.m_cySaldoCredito,
                saldoCreditoDLLS: respuesta.data.m_cySaldoCreditoDLLS,
                pendFacturar: respuesta.data.m_cyPendFacturar,
                pendFacturarDLLS: respuesta.data.m_cyPendFacturarDLLS,
                bancoOrdenante: respuesta.data.m_sBancoOrdenante,
                rfcBancoOrdenante: respuesta.data.m_sRFCBancoOrdenante,
                cuentaBancoOrdenante: respuesta.data.m_sNoCuentaBancoOrdenante,
                codigoPostal: respuesta.data.m_sCodigoPostal,
                idEstado: respuesta.data.m_nIdEstado,
                municipio: respuesta.data.m_sMunicipio,
                localidad: respuesta.data.m_sLocalidad,
                colonia: respuesta.data.m_sColonia,
                calle: respuesta.data.m_sCalle,
                numeroExterior: respuesta.data.m_sNoExterior,
                numeroInterior: respuesta.data.m_sNoInterior,
                telefono: respuesta.data.m_sTelefono,
                celular: respuesta.data.m_sCelular,
                nextel: respuesta.data.m_sNextel,
                correoElectronico: respuesta.data.m_sCorreoElectronico,
                tableformatos: respuesta.data.m_sTableFormatos,
                frecuenciaEnvioDias: respuesta.data.m_nEnvioCorreoDias,
                enviarApartir: respuesta.data.m_sFechaEnvioCorreoApartir,
                envioAutomaticoSeguimiento:
                respuesta.data.m_bEnvioAutomaticoSeguimientoViajesActivar,
                    excluirNodo: respuesta.data.m_bExcluirNodoCondicionesPagoXML,
                idUSOCFDI: respuesta.data.m_sIdUsoCFDI,
                agruparCantidadPorConcepto:
                respuesta.data.m_bPermitirAgruparCantidadPorConcepto,
                    ajustarImporte2Dec: respuesta.data.m_bAjustarImportes2DecimalesXML,
                companiaSeguros1: respuesta.data.m_sCompaniaSeguros1,
                telefonoSeguros1: respuesta.data.m_sTelefonosCompaniaSeguros1,
                numeroSeguro1: respuesta.data.m_sNumeroSeguro1,
                vencimientoSeguro1: respuesta.data.m_dtVencimientoSeguro1,
                tipoCobertura1: respuesta.data.m_nTipoCoberturaSeguro1,
                companiaSeguros2: respuesta.data.m_sCompaniaSeguros,
                telefonoSeguro2: respuesta.data.m_sTelefonosCompaniaSeguros,
                numeroSeguro2: respuesta.data.m_sNumeroSeguro,
                vencimientoSeguro2: respuesta.data.m_dtVencimientoSeguro,
                tipoCobertura2: respuesta.data.m_nTipoCoberturaSeguro,
            }
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
        getAllSucursales();
        getAllPaises();
        getAllImpuestos();
        getAllGrupoClientes();
        getAllClientes();
        getAllFormatos();
        getAllTipoMoneda();
    }, []);

    function handleShowImprimir(){
        $('.nav-tabs li ').removeClass('active'); $('.nav-tabs li').eq(2).addClass('active'); $('.tab-content div ').removeClass('in show'); $('#Imprimir').addClass('in show');
    }

    function getAllGrupoClientes() {
        obtenerGrupoClientes().then((respuesta) => {
            console.log(respuesta);

            setDataGrupoClientes(respuesta.data);
        });
    }

    function getAllFormatos() {
        obtenerFormatosImpresion().then((respuesta) => {
            console.log(respuesta);

            setDataFormatos(respuesta.data);
        });
    }

    function getAllClientes() {
        obtenerCliente().then((respuesta) => {
            console.log(respuesta);

            setDataListadoClientes(respuesta.data);
        });
    }

    function getAllPaises() {
        obtenerPaises().then((respuesta) => {
            setDataPais(respuesta.data);
        });
    }

    function getAllTipoMoneda() {
        obtenerMonedas().then((respuesta) => {
            setDataTipoMoneda(respuesta.data);
        });
    }

    const handleSelectChange = (event) => {
        console.log("onChangeSelect");
        getAllEstados(event.target.value);
    };

    function getAllEstados(id) {
        console.log(id);
        obtenerEstadosPais(id).then((respuesta) => {
            console.log(respuesta.data);
            setDataEstado(respuesta.data);
        });
        console.log(dataEstado);
    }

    function getAllImpuestos() {
        obtenerImpuestos().then((respuesta) => {
            console.log(respuesta.data);
            setDataImpuesto(respuesta.data);
        });
        console.log(dataImpuesto);
    }

    function getAllSucursales() {
        obtenerSucursales().then((respuesta) => {
            setDataSucursales(respuesta.data);
        });
    }

    const handleChangeFormatoSelectCheckboxChange = (event) => {
        setState({
            ...state,
            formatoSelect: !state.formatoSelect,
        });
        console.log(event.target.name + " " + state.activo);
    };

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

                eliminarCliente(id, state.CreadoPor)
                    .then((respuesta) => {
                        showSuccess(respuesta.data);
                        getAllClientes();
                    })
                    .catch((err) => {
                        console.log(err);
                        showSuccess(JSON.stringify(err));
                    });
            })
            .catch((err) => {
                showSuccess(err);
            });
    }

    const handleChange = (event) => {
        console.log(event.target.name + " : " + event.target.value);
        setState({
            ...state,
            [event.target.name]: event.target.value,
        });
    };

    const handleChangeCodigo = (event) => {
        event.preventDefault()
        validarNumeroCliente(state)
            .then((respuesta) => {
                if (respuesta.data != "") {
                    showSuccess(respuesta.data.m_sMensaje);
                    console.log(respuesta.data);
                    setState({
                        ...state,

                        numeroCliente: respuesta.data.m_nNumero,
                    });
                }
            })

            .catch((err) => {
                showSuccess(err);
            });
    };

    const handleChangeIdCliente = (event) => {
        event.preventDefault()
        /*validarNumeroCliente(state)
            .then((respuesta) => {
                if (respuesta.data != "") {
                    showSuccess(respuesta.data.m_sMensaje);
                    console.log(respuesta.data);
                    setState({
                        ...state,

                        numeroCliente: respuesta.data.m_nNumero,
                    });
                }
            }).catch((err) => {
                showSuccess(err);
            });*/

        console.log(event.target.name + " : " + event.target.value);
        setState({
            ...state,
            idCliente: event.target.value,
        });
    };

    const handleAceptar = (e) => {
        e.preventDefault();
        let params = {
            m_nIdCliente: state.idCliente,
            m_nCreadoPor: state.CreadoPor,
            m_nModificadoPor: state.ModificadoPor,
            m_nNumeroCliente: state.numeroCliente,
            m_nTipoCliente: state.tipoCliente,
            m_sRFC: state.rfc,
            m_bActivo: state.activo,
            m_bOperadorLogistico: state.operadorLogistico,
            m_sNombreFiscal: state.nombreFiscal,
            m_sNombreCorto: state.nombreCorto,
            m_nIdSucursal: state.idSucursal,
            m_nIdMoneda: state.idMoneda,
            m_nIdImpuestoTransladado: state.idImpuestoTransladado,
            m_nIdGrupoCliente: state.idGrupoCliente.m_nIdGrupoCliente,
            m_bAplicarDetalleMaterialesCadaViajeXML:
                state.aplicarDetalleMaterialesCadaViajeXML,

            m_sMetodoPago: state.metodoPago,
            m_nDiasCredito: state.diasCredito,
            m_cyCredito: state.credito,
            m_cyCreditoDLLS: state.creditoDlls,
            m_cySaldoCredito: state.saldoCredito,
            m_cySaldoCreditoDLLS: state.saldoCreditoDLLS,
            m_cyPendFacturar: state.pendFacturar,
            m_cyPendFacturarDLLS: state.pendFacturarDLLS,

            m_sBancoOrdenante: state.bancoOrdenante,
            m_sRFCBancoOrdenante: state.rfcBancoOrdenante,
            m_sNoCuentaBancoOrdenante: state.cuentaBancoOrdenante,

            m_sCodigoPostal: state.codigoPostal,
            m_nIdEstado: state.idEstado,
            m_sMunicipio: state.municipio,
            m_sLocalidad: state.localidad,
            m_sColonia: state.colonia,
            m_sCalle: state.calle,
            m_sNoExterior: state.numeroExterior,
            m_sNoInterior: state.numeroInterior,
            m_sTelefono: state.telefono,
            m_sCelular: state.celular,
            m_sNextel: state.nextel,
            m_sCorreoElectronico: state.correoElectronico,

            m_sTableFormatos: state.tableformatos,
            // m_dtEnvioAutomaticoSeguimientoViajesFechaHoraInicio:state.m_dtEnvioAutomaticoSeguimientoViajesFechaHoraInicio,
            m_nEnvioCorreoDias: state.frecuenciaEnvioDias,
            m_sFechaEnvioCorreoApartir: state.enviarApartir,
            m_bEnvioAutomaticoSeguimientoViajesActivar:
                state.envioAutomaticoSeguimiento,
            m_bExcluirNodoCondicionesPagoXML: state.excluirNodo,

            m_sIdUsoCFDI: state.idUSOCFDI,
            m_bPermitirAgruparCantidadPorConcepto: state.agruparCantidadPorConcepto,
            m_bAjustarImportes2DecimalesXML: state.ajustarImporte2Dec,
            //m_bAplicarDetalleMaterialesCadaViajeXML:state.aplicarDetalleMaterialesCadaViajeXML,

            m_sContactoNombre: state.contactoNombre,
            m_sContactoCorreo: state.contactoCorreo,
            m_sContactoTelefono: state.contactoTelefono,
            m_bRecibirFactura: state.RecibirFactura,
            m_bRecibirEstadoCuenta: state.RecibirEstadoCuenta,
            m_bPermitirSeguimiento: state.PermitirSeguimiento,
            m_bUsoServicioWeb: state.UsoServicioWeb,
            m_bPermitirVerPortal: state.m_bPermitirVerPortal,
            m_bRecibirCartaPorte: state.RecibirCartaPorte,

            CompaniaSeguros1: state.companiaSeguros1,
            TelefonosCompaniaSeguros1: state.telefonoSeguro1,
            NumeroSeguro1: state.numeroSeguro1,
            VencimientoSeguro1: state.vencimientoSeguro1,
            TipoCoberturaSeguro1: state.tipoCobertura1,
            CompaniaSeguros: state.companiaSeguros2,
            TelefonosCompaniaSeguros: state.telefonoSeguro2,
            NumeroSeguro: state.numeroSeguro2,
            VencimientoSeguro: state.vencimientoSeguro2,
            TipoCoberturaSeguro: state.tipoCobertura2,

            agregar: "Agregar",
            importar: "",
        };
        console.log(JSON.stringify(params))
        if (state.agregar == "Modificar") {
            modificarCliente(state.idCliente, params)
                .then((respuesta) => {
                    alert(respuesta.data);
                    $('.nav-tabs li ').removeClass('active');
                    $('.nav-tabs li').eq(0).addClass('active');
                    $('.tab-content div ').removeClass('in show');
                    $('#Listado').addClass('in show');
                    // window.location.reload();
                })
                .catch((err) => {
                    console.log(err);
                    alert("err");
                });
        } else {
            agregarCliente(params)
                .then((respuesta) => {
                    alert(respuesta.data);
                    $('.nav-tabs li ').removeClass('active');
                    $('.nav-tabs li').eq(0).addClass('active');
                    $('.tab-content div ').removeClass('in show');
                    $('#Listado').addClass('in show');
                    //window.location.reload();
                })
                .catch((err) => {
                    console.log(err);
                    alert(err);
                });
        }
    };

    const [stepActive, setStepActive] = React.useState(1);

    function openSection(index) {
        //closeSeccions();
        var $section;
        switch (index) {
            case 1:
                setStepActive(1);
                $section = $("#infogral");
                break;
            case 2:
                setStepActive(2);
                $section = $("#caracteristicas");

                break;
            case 3:
                setStepActive(3);
                $section = $("#caracteristicas");

                break;

            case 4:
                setStepActive(4);
                $section = $("#detalles");
                break;
            case 5:
                setStepActive(5);
                $section = $("#otros");
                break;
            default:
        }

        $("html, body").animate(
            {
                scrollTop: parseInt($section.offset().top - 150),
            },
            200
        );
    }

    function CustomToolbar() {
        return (
            <GridToolbarContainer>
                <GridToolbarExport />
            </GridToolbarContainer>
        );
    }



    return (
        <div>
            <header className="topbar clearfix">
                <Cabecera titulo="Clientes" >
                    <div className="page-header">
                        <ul className="list-page-breadcrumb">
                            <li>
                                <a href="/Catalogos" className="color-mapeo">
                                    Catálogos <i className="zmdi zmdi-chevron-right" />
                                </a>
                            </li>
                            <li className="active-page">Clientes</li>
                        </ul>
                    </div>
                </Cabecera>
            </header>
            {/*Topbar End Here*/}
            {/*Leftbar Start Here*/}
            <aside className="iconic-leftbar">
                <BarraLateralIzquierda />
            </aside>
            {/*Leftbar End Here*/}
            {/*Page Container Start Here*/}
            <section className="main-container">
                <div className="container-fluid">

                    <ul className="nav navStatica nav-tabs">
                        <li className="active">
                            <a onClick={(event) => {
                                event.stopPropagation();
                                setState({...state, agregar: "Agregar"});
                                $('.nav-tabs li ').removeClass('active');
                                $('.nav-tabs li').eq(0).addClass('active');
                                $('.tab-content div ').removeClass('in show');
                                $('#Listado').addClass('in show');
                            }}>
                                <i className="fa fa-list" /> Listado
                            </a>
                        </li>
                        <li>
                            <a  onClick={handleShowAgregar}>
                                <i className="fa fa-plus-circle" /> {state.agregar}
                            </a>
                        </li>
                        <li>
                            <a  onClick={handleShowImprimir}>
                                <i className="fa fa-print" /> Imprimir
                            </a>
                        </li>
                    </ul>

                    <div className="tab-content">
                        <div id="Listado" className="tab-pane fade in show">
                            <div className="widget-wrap">
                                <div className="widget-content">
                                    <div
                                        className="row"
                                        style={{ height: state.height - 250, width: "100%" }}>
                                        {dataListadoClientes.length != 0 ? (
                                            <DataGrid
                                                localeText={dataGridLocaleText}
                                                rows={dataListadoClientes}
                                                columns={columns}
                                                density="compact"
                                                pageSize={Math.floor((state.height - 310) / 30)}
                                                getRowId={(row) => row.m_nIdCliente}
                                            />
                                        ) : (
                                            <div>No se encontró ningún registro</div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div id="Importar" className="tab-pane fade "></div>
                        <div id="Imprimir" className="tab-pane fade ">
                            <div className="widget-wrap">
                                <div className="widget-content">
                                    <div
                                        className="row"
                                        style={{ height: state.height - 250, width: "100%" }}
                                    >
                                        {dataListadoClientes.length != 0 ? (
                                            <DataGrid
                                                components={{
                                                    Toolbar: CustomToolbar,
                                                }}
                                                localeText={dataGridLocaleText}
                                                rows={dataListadoClientes}
                                                columns={columns}
                                                density="compact"
                                                checkboxSelection={true}
                                                pageSize={Math.floor((state.height - 310) / 30)}
                                                getRowId={(row) => row.m_nIdCliente}
                                            />
                                        ) : (
                                            <div>No se encontró ningún registro</div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div id="Agregar" className="tab-pane fade">
                            <form className="j-forms" onSubmit={handleAceptar}>
                                {/*Inicio de ejemplo*/}
                                <div className="form-content">
                                    {/* start steps */}
                                    <div className="widget-wrap"
                                        style={styles.stepper}>
                                        <div className="row">
                                            <Stepper activeStep={stepActive - 1}>
                                                {
                                                    ["Información General", "Metodos de Pago y Crédito", "Información Adicional del Pago", "Datos Generales", "Contacto"].map((s, index) => (
                                                        <Step key={s} completed={false} onClick={() => openSection(index + 1)}>
                                                            <StepLabel >{s}</StepLabel>
                                                        </Step>
                                                    ))
                                                }
                                            </Stepper>

                                        </div>
                                    </div>
                                    {/* end steps */}

                                    <div className="widget-wrap" id="infogral">

                                        <BlockHeaderH3>{'Información General'}</BlockHeaderH3>
                                        <div className="widget-container">
                                            <div className="widget-content">
                                                <div className="row">
                                                    <div className="col-md-12">
                                                        <div className="form-content">
                                                            <div className="col-sm-4 col-md-2-5 unit">

                                                                <div className="input">
                                                                    <TextField variant="outlined" margin="dense"
                                                                               onChange={handleChange}
                                                                               label="Identificador de Cliente"
                                                                               // onBlur={handleChangeIdCliente}
                                                                               className="form-control"
                                                                               type="number"
                                                                               required
                                                                               value={state.idCliente}
                                                                               id="idCliente"
                                                                               name="idCliente"
                                                                               disabled={state.agregar == "Modificar"}

                                                                    />
                                                                </div>
                                                            </div>
                                                            <div className="col-sm-4 col-md-2-5 unit">

                                                                <div className="input">
                                                                    <TextField variant="outlined" margin="dense"
                                                                        onChange={handleChange}
                                                                        label="Número de Cliente"
                                                                        onBlur={handleChangeCodigo}
                                                                        className="form-control"
                                                                               required
                                                                        type="text"
                                                                        value={state.numeroCliente}
                                                                        id="numeroCliente"
                                                                        name="numeroCliente"
                                                                        
                                                                    />
                                                                </div>
                                                            </div>
                                                            <div className="col-sm-4 col-md-2-5 unit">
                                                                <div className="input">
                                                                    <TextField variant="outlined" margin="dense"
                                                                        onChange={handleChange}
                                                                        className="form-control"
                                                                        type="text"
                                                                        pattern="[A-Z&Ñ]{3,4}[0-9]{2}(0[1-9]|1[012])(0[1-9]|[12][0-9]|3[01])[A-Z0-9]{2}[0-9A]"
                                                                        title="Favor de introducir un RFC válido."
                                                                        required
                                                                        label="RFC"
                                                                        value={state.rfc}
                                                                        id="rfc"
                                                                        name="rfc"
                                                                    />
                                                                </div>
                                                            </div>
                                                            <div className="col-sm-4 col-md-2-5 unit">
                                                                <div className="input">
                                                                    <TextField variant="outlined" margin="dense"
                                                                        onChange={handleChange}
                                                                        className="form-control"
                                                                        type="text"
                                                                        label="Nombre Fiscal"
                                                                        value={state.nombreFiscal}
                                                                        id="nombreFiscal"
                                                                        name="nombreFiscal"
                                                                        required
                                                                        native
                                                                    />
                                                                </div>
                                                            </div>
                                                            <div className="col-sm-4 col-md-2-5 unit">
                                                                <div className="input">
                                                                    <TextField variant="outlined" margin="dense"
                                                                        onChange={handleChange}
                                                                        className="form-control"
                                                                        type="text"
                                                                        label="Nombre Corto"
                                                                        value={state.nombreCorto}
                                                                        id="nombreCorto"
                                                                        name="nombreCorto"
                                                                        
                                                                        native
                                                                    />
                                                                </div>
                                                            </div>

                                                            <div className="col-sm-4 col-md-2-5 unit">
                                                                <label className="input select">
                                                                    <FormControl fullWidth variant="outlined" margin="dense">
                                                                        <InputLabel id="tipoClienteLabel">Tipo de Cliente</InputLabel>
                                                                        <Select
                                                                            labelId="tipoClienteLabel"
                                                                            label="Tipo de Cliente"
                                                                            onChange={handleChange}
                                                                            className="form-control"
                                                                            value={state.tipoCliente}
                                                                            required
                                                                            label="Tipo de Cliente"
                                                                            margin="dense"
                                                                            native
                                                                            name="tipoCliente"
                                                                            id="tipoCliente"
                                                                        >
                                                                            <option value="1">Nacional</option>
                                                                            <option value="2">Extranjero</option>
                                                                        </Select>
                                                                    </FormControl>
                                                                </label>
                                                            </div>

                                                            <div className="col-sm-4 col-md-2-5 unit">
                                                                <label className="input select">
                                                                    <FormControl fullWidth variant="outlined" margin="dense">
                                                                        <InputLabel id="idSucursalLabel">Sucursal</InputLabel>
                                                                        <Select
                                                                            labelId="idSucursalLabel"
                                                                            label="Sucursal"
                                                                            onChange={handleChange}
                                                                            value={state.idSucursal}
                                                                            id="idSucursal"
                                                                            variant="outlined"
                                                                            native
                                                                            margin="dense"
                                                                            className="form-control"
                                                                            name="idSucursal"
                                                                            required
                                                                        >

                                                                            {dataSucursales.map((sucursal) => (
                                                                                <option value={sucursal.m_nIdSucursal}>
                                                                                    {sucursal.m_sSucursal}
                                                                                </option>
                                                                            ))}
                                                                        </Select>
                                                                    </FormControl>
                                                                </label>
                                                            </div>
                                                            <div className="col-sm-4 col-md-2-5  unit">
                                                                <label className="input select">
                                                                    <FormControl fullWidth variant="outlined" margin="dense">
                                                                        <InputLabel id="idMonedaLabel">Moneda</InputLabel>
                                                                        <Select
                                                                            labelId="idMonedaLabel"
                                                                            label="Moneda"
                                                                            onChange={handleChange}
                                                                            value={state.idMoneda}
                                                                            id="idMoneda"
                                                                            variant="outlined"
                                                                            margin="dense"
                                                                            native
                                                                            className="form-control"
                                                                            name="idMoneda"
                                                                            required
                                                                        >
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
                                                                </label>
                                                            </div>
                                                            <div className="col-sm-4 col-md-2-5 unit">
                                                                <label className="input select">
                                                                    <FormControl fullWidth variant="outlined" margin="dense">
                                                                        <InputLabel id="idImpuestoTransladadoLabel">IVA</InputLabel>
                                                                        <Select
                                                                            labelId="idImpuestoTransladadoLabel"
                                                                            label="IVA"
                                                                            onChange={handleChange}
                                                                            value={state.idImpuestoTransladado}
                                                                            id="idImpuestoTransladado"
                                                                            margin="dense"
                                                                            variant="outlined"
                                                                            className="form-control"
                                                                            name="idImpuestoTransladado"
                                                                            required
                                                                        >
                                                                            {dataImpuesto.map((impuesto) => (
                                                                                <option value={impuesto.m_nIdImpuesto}>
                                                                                    {impuesto.m_sImpuesto}
                                                                                </option>
                                                                            ))}
                                                                        </Select>
                                                                    </FormControl>
                                                                </label>
                                                            </div>
                                                            <div className="col-sm-4 col-md-2-5 unit">
                                                                <Autocomplete
                                                                    freeSolo
                                                                    autoHighlight
                                                                    style={{ transform: "translate(14px, 10px) scale(1) !important" }}
                                                                    onChange={(event, newValue) =>
                                                                        setState({
                                                                            ...state,
                                                                            idGrupoCliente: newValue,
                                                                        })
                                                                    }
                                                                    value={state.idGrupoCliente}
                                                                    id="idGrupoCliente"
                                                                    disableClearable
                                                                    getOptionLabel={(option) => option.m_sGrupo}
                                                                    options={dataGrupoClientes}
                                                                    renderInput={(params) => (
                                                                        <TextField
                                                                            {...params}
                                                                            variant="outlined"
                                                                            label="Grupo"
                                                                            margin="dense"
                                                                            className="form-control"
                                                                            InputProps={{
                                                                                ...params.InputProps,
                                                                                type: "search",
                                                                                value: state.idGrupoCliente,
                                                                            }}
                                                                        />
                                                                    )}
                                                                />{" "}
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="unit">
                                                    <div className="inline-group">
                                                        <label className="checkbox">
                                                            <input
                                                                checked={state.activo}
                                                                onChange={(e) =>
                                                                    setState({
                                                                        ...state,
                                                                        activo: e.target.checked,
                                                                    })
                                                                }
                                                                native
                                                                name="activo"
                                                                type="checkbox"
                                                                id="activo"
                                                            />
                                                            <i />
                              Activa
                            </label>
                                                        <label className="checkbox">
                                                            <input
                                                                checked={state.operadorLogistico}
                                                                onChange={(e) =>
                                                                    setState({
                                                                        ...state,
                                                                        operadorLogistico: e.target.checked,
                                                                    })
                                                                }
                                                                native
                                                                name="operadorLogistico"
                                                                type="checkbox"
                                                                id="operadorLogistico"
                                                            />
                                                            <i />
                              Operador Lógistico
                            </label>

                                                        <label className="label">{ }</label>
                                                        <label className="checkbox">
                                                            <input
                                                                checked={state.aplicarDetalleMaterialesCadaViajeXML}
                                                                onChange={(e) =>
                                                                    setState({
                                                                        ...state,
                                                                        aplicarDetalleMaterialesCadaViajeXML: e.target.checked,
                                                                    })
                                                                }
                                                                native
                                                                name="aplicarDetalleMaterialesCadaViajeXML"
                                                                type="checkbox"
                                                                value={
                                                                    state.aplicarDetalleMaterialesCadaViajeXML
                                                                }
                                                                id="aplicarDetalleMaterialesCadaViajeXML"
                                                            />
                                                            <i />
                              Aplicar en el XML de factura, el detalle por Viaje
                            </label>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    {/*Fin de ejemplo*/}

                                    <div className="widget-wrap" id="caracteristicas">
                                        {/*<BlockHeaderH3>{'Métodos de Pago y Crédito'}</BlockHeaderH3>*/}
                                        <div className="widget-container">
                                            <div className="widget-content">
                                                <div className="row">

                                                    <Grid container spacing={3}>
                                                        <Grid item xs={8}>
                                                            <BlockHeaderH3>{'Métodos de Pago y Crédito'}</BlockHeaderH3>
                                                            <div className="form-content">
                                                                {/* start text password */}
                                                                <div className="row">
                                                                    <div className="col-sm-6 col-md-4 unit">
                                                                        <label className="input select">
                                                                            <FormControl fullWidth variant="outlined" margin="dense">
                                                                                <InputLabel id="metodoPagoLabel">Forma de pago</InputLabel>
                                                                                <Select
                                                                                    labelId="metodoPagoLabel"
                                                                                    onChange={handleChange}
                                                                                    value={state.metodoPago}
                                                                                    id="metodoPago"
                                                                                    label="Forma de pago"
                                                                                    native
                                                                                    className="form-control"
                                                                                    name="metodoPago"

                                                                                >
                                                                                    <option value="1">
                                                                                        Transferencia Eléctronica
                                                                                    </option>
                                                                                    <option value="2">Efectivo</option>
                                                                                </Select>
                                                                            </FormControl>
                                                                            <i></i>
                                                                        </label>
                                                                    </div>
                                                                    <div className="col-sm-6 col-md-4 unit">
                                                                        <div className="input">
                                                                            <TextField variant="outlined" margin="dense"
                                                                                       onChange={handleChange}
                                                                                       className="form-control"

                                                                                       label="Días de Crédito"
                                                                                       type="number"
                                                                                       value={state.diasCredito}
                                                                                       id="diasCredito"
                                                                                       name="diasCredito"
                                                                                       native
                                                                            />
                                                                        </div>
                                                                    </div>
                                                                </div>

                                                                <div className="row">
                                                                    <SectionHeaderH4>{'Pesos'}</SectionHeaderH4>
                                                                    <div className="col-sm-4  col-md-4 unit">

                                                                        <div className="input">
                                                                            <TextField variant="outlined" margin="dense"
                                                                                       onChange={handleChange}
                                                                                       className="form-control"
                                                                                       label="Límite Crédito"
                                                                                       type="number"
                                                                                       value={state.credito}
                                                                                       id="credito"
                                                                                       name="credito"
                                                                            />
                                                                        </div>
                                                                    </div>
                                                                    <div className="col-sm-4  col-md-4 unit">

                                                                        <div className="input">
                                                                            <TextField variant="outlined" margin="dense"
                                                                                       onChange={handleChange}
                                                                                       className="form-control"
                                                                                       type="number"
                                                                                       label="Saldo facturado por cobrar"
                                                                                       value={state.saldoCredito}
                                                                                       id="saldoCredito"
                                                                                       name="saldoCredito"
                                                                            />
                                                                        </div>
                                                                    </div>
                                                                    <div className="col-sm-4  col-md-4 unit">
                                                                        <div className="input">
                                                                            <TextField variant="outlined" margin="dense"
                                                                                       onChange={handleChange}
                                                                                       className="form-control"
                                                                                       type="number"
                                                                                       label="Viajes pendientes por facturar"
                                                                                       value={state.pendFacturar}
                                                                                       id="pendFacturar"
                                                                                       name="pendFacturar"
                                                                            />
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                                <div className="row">
                                                                    <SectionHeaderH4>{'Dólares'}</SectionHeaderH4>
                                                                    <div className="col-sm-4  col-md-4 unit">
                                                                        <div className="input">
                                                                            <TextField variant="outlined" margin="dense"
                                                                                       onChange={handleChange}
                                                                                       className="form-control"
                                                                                       type="number"
                                                                                       label="Límite Crédito"
                                                                                       value={state.creditoDlls}
                                                                                       id="creditoDlls"
                                                                                       name="creditoDlls"
                                                                            />
                                                                        </div>
                                                                    </div>
                                                                    <div className="col-sm-4  col-md-4 unit">

                                                                        <div className="input">
                                                                            <TextField variant="outlined" margin="dense"
                                                                                       onChange={handleChange}
                                                                                       className="form-control"
                                                                                       type="number"
                                                                                       label="Saldo facturado por cobrar"
                                                                                       value={state.saldoCreditoDLLS}
                                                                                       id="saldoCreditoDLLS"
                                                                                       name="saldoCreditoDLLS"
                                                                            />
                                                                        </div>
                                                                    </div>
                                                                    <div className="col-sm-4  col-md-4 unit">

                                                                        <div className="input">
                                                                            <TextField variant="outlined" margin="dense"
                                                                                       onChange={handleChange}
                                                                                       className="form-control"
                                                                                       type="number"
                                                                                       label="Viajes pendientes por facturar"
                                                                                       value={state.pendFacturarDLLS}
                                                                                       id="pendFacturarDLLS"
                                                                                       name="pendFacturarDLLS"
                                                                            />
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </Grid>

                                                        <Grid item xs={4}>
                                                            <Grid container
                                                                  direction={'column'}
                                                                  alignItems={"stretch"}
                                                                  spacing={2}>
                                                                <Grid item xs={12}>
                                                                    <BlockHeaderH3>{'Información Adicional del Pago'}</BlockHeaderH3>
                                                                </Grid>
                                                                <Grid item xs={12}>
                                                                    <div className="input">
                                                                        <TextField variant="outlined" margin="dense"
                                                                                   onChange={handleChange}
                                                                                   className="form-control"
                                                                                   type="text"
                                                                                   label="Banco Ordenante"
                                                                                   value={state.bancoOrdenante}
                                                                                   id="bancoOrdenante"
                                                                                   name="bancoOrdenante"/>
                                                                    </div>
                                                                </Grid>
                                                                <Grid item xs={12}>
                                                                    <div className="input">
                                                                        <TextField variant="outlined" margin="dense"
                                                                                   onChange={handleChange}
                                                                                   className="form-control"
                                                                                   type="text"
                                                                                   label="RFC"
                                                                                   value={state.rfcBancoOrdenante}
                                                                                   pattern="[A-Z&Ñ]{3,4}[0-9]{2}(0[1-9]|1[012])(0[1-9]|[12][0-9]|3[01])[A-Z0-9]{2}[0-9A]"
                                                                                   title="Favor de introducir un RFC válido."
                                                                                   id="rfcBancoOrdenante"
                                                                                   name="rfcBancoOrdenante"/>
                                                                    </div>
                                                                </Grid>
                                                                <Grid item xs={12}>
                                                                    <div className="input">
                                                                        <TextField variant="outlined" margin="dense"
                                                                                   onChange={handleChange}
                                                                                   className="form-control"
                                                                                   type="text"
                                                                                   label="Núm. Cuenta"
                                                                                   value={state.cuentaBancoOrdenante}
                                                                                   id="cuentaBancoOrdenante"
                                                                                   name="cuentaBancoOrdenante"/>
                                                                    </div>
                                                                </Grid>
                                                            </Grid>
                                                            {/*<div className="form-content" style={{ paddingLeft: "10px" }}>
                                                                 start text password
                                                                <div className="row">
                                                                    <div className="col-xs-6 col-ms-6 col-md-10 unit">

                                                                        <div className="input">
                                                                            <TextField variant="outlined" margin="dense"
                                                                                       onChange={handleChange}
                                                                                       className="form-control"
                                                                                       type="text"
                                                                                       label="Banco Ordenante"
                                                                                       value={state.bancoOrdenante}
                                                                                       id="bancoOrdenante"
                                                                                       name="bancoOrdenante"
                                                                            />
                                                                        </div>
                                                                    </div>
                                                                </div>

                                                                <div className="row">
                                                                    <div className="col-xs-6 col-ms-6 col-md-10 unit">
                                                                        <div className="input">
                                                                            <TextField variant="outlined" margin="dense"
                                                                                       onChange={handleChange}
                                                                                       className="form-control"
                                                                                       type="text"
                                                                                       label="RFC"
                                                                                       value={state.rfcBancoOrdenante}
                                                                                       pattern="[A-Z&Ñ]{3,4}[0-9]{2}(0[1-9]|1[012])(0[1-9]|[12][0-9]|3[01])[A-Z0-9]{2}[0-9A]"
                                                                                       title="Favor de introducir un RFC válido."
                                                                                       id="rfcBancoOrdenante"
                                                                                       name="rfcBancoOrdenante"
                                                                            />
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                                <div className="row">
                                                                    <div className="col-xs-6 col-ms-6 col-md-10 unit">
                                                                        <div className="input">
                                                                            <TextField variant="outlined" margin="dense"
                                                                                       onChange={handleChange}
                                                                                       className="form-control"
                                                                                       type="text"
                                                                                       label="Núm. Cuenta"
                                                                                       value={state.cuentaBancoOrdenante}
                                                                                       id="cuentaBancoOrdenante"
                                                                                       name="cuentaBancoOrdenante"
                                                                            />
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            </div>*/}
                                                        </Grid>
                                                    </Grid>
                                                    {/*<div className="col-sm-12 col-md-8">
                                                        <div className="form-content">
                                                             start text password
                                                            <div className="row">
                                                                <div className="col-sm-6 col-md-4 unit">
                                                                    <label className="input select">
                                                                        <FormControl fullWidth variant="outlined" margin="dense">
                                                                            <InputLabel id="metodoPagoLabel">Forma de pago</InputLabel>
                                                                            <Select
                                                                                labelId="metodoPagoLabel"
                                                                                onChange={handleChange}
                                                                                value={state.metodoPago}
                                                                                id="metodoPago"
                                                                                label="Forma de pago"
                                                                                native
                                                                                className="form-control"
                                                                                name="metodoPago"
                                                                                
                                                                            >
                                                                                <option value="1">
                                                                                    Transferencia Eléctronica
                                      </option>
                                                                                <option value="2">Efectivo</option>
                                                                            </Select>
                                                                        </FormControl>
                                                                        <i></i>
                                                                    </label>
                                                                </div>
                                                                <div className="col-sm-6 col-md-4 unit">
                                                                    <div className="input">
                                                                        <TextField variant="outlined" margin="dense"
                                                                            onChange={handleChange}
                                                                            className="form-control"
                                                                            
                                                                            label="Días de Crédito"
                                                                            type="number"
                                                                            value={state.diasCredito}
                                                                            id="diasCredito"
                                                                            name="diasCredito"
                                                                            native
                                                                        />
                                                                    </div>
                                                                </div>
                                                            </div>

                                                            <div className="row">
                                                                <SectionHeaderH4>{'Pesos'}</SectionHeaderH4>
                                                                <div className="col-sm-4  col-md-4 unit">

                                                                    <div className="input">
                                                                        <TextField variant="outlined" margin="dense"
                                                                            onChange={handleChange}
                                                                            className="form-control"
                                                                            label="Límite Crédito"
                                                                            type="number"
                                                                            value={state.credito}
                                                                            id="credito"
                                                                            name="credito"
                                                                        />
                                                                    </div>
                                                                </div>
                                                                <div className="col-sm-4  col-md-4 unit">

                                                                    <div className="input">
                                                                        <TextField variant="outlined" margin="dense"
                                                                            onChange={handleChange}
                                                                            className="form-control"
                                                                            type="number"
                                                                            label="Saldo facturado por cobrar"
                                                                            value={state.saldoCredito}
                                                                            id="saldoCredito"
                                                                            name="saldoCredito"
                                                                        />
                                                                    </div>
                                                                </div>
                                                                <div className="col-sm-4  col-md-4 unit">
                                                                    <div className="input">
                                                                        <TextField variant="outlined" margin="dense"
                                                                            onChange={handleChange}
                                                                            className="form-control"
                                                                            type="number"
                                                                            label="Viajes pendientes por facturar"
                                                                            value={state.pendFacturar}
                                                                            id="pendFacturar"
                                                                            name="pendFacturar"
                                                                        />
                                                                    </div>
                                                                </div>
                                                            </div>
                                                            <div className="row">
                                                                <SectionHeaderH4>{'Dólares'}</SectionHeaderH4>
                                                                <div className="col-sm-4  col-md-4 unit">
                                                                    <div className="input">
                                                                        <TextField variant="outlined" margin="dense"
                                                                            onChange={handleChange}
                                                                            className="form-control"
                                                                            type="number"
                                                                            label="Límite Crédito"
                                                                            value={state.creditoDlls}
                                                                            id="creditoDlls"
                                                                            name="creditoDlls"
                                                                        />
                                                                    </div>
                                                                </div>
                                                                <div className="col-sm-4  col-md-4 unit">

                                                                    <div className="input">
                                                                        <TextField variant="outlined" margin="dense"
                                                                            onChange={handleChange}
                                                                            className="form-control"
                                                                            type="number"
                                                                            label="Saldo facturado por cobrar"
                                                                            value={state.saldoCreditoDLLS}
                                                                            id="saldoCreditoDLLS"
                                                                            name="saldoCreditoDLLS"
                                                                        />
                                                                    </div>
                                                                </div>
                                                                <div className="col-sm-4  col-md-4 unit">

                                                                    <div className="input">
                                                                        <TextField variant="outlined" margin="dense"
                                                                            onChange={handleChange}
                                                                            className="form-control"
                                                                            type="number"
                                                                            label="Viajes pendientes por facturar"
                                                                            value={state.pendFacturarDLLS}
                                                                            id="pendFacturarDLLS"
                                                                            name="pendFacturarDLLS"
                                                                        />
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>*/}

                                                    {/*<div className="col-sm-12 col-md-3 bordesizquierdo">
                                                        <SectionHeaderH4>{'Información Adicional del Pago'}</SectionHeaderH4>
                                                        <div className="form-content" style={{ paddingLeft: "10px" }}>
                                                             start text password
                                                            <div className="row">
                                                                <div className="col-xs-6 col-ms-6 col-md-10 unit">

                                                                    <div className="input">
                                                                        <TextField variant="outlined" margin="dense"
                                                                            onChange={handleChange}
                                                                            className="form-control"
                                                                            type="text"
                                                                            label="Banco Ordenante"
                                                                            value={state.bancoOrdenante}
                                                                            id="bancoOrdenante"
                                                                            name="bancoOrdenante"
                                                                        />
                                                                    </div>
                                                                </div>
                                                            </div>

                                                            <div className="row">
                                                                <div className="col-xs-6 col-ms-6 col-md-10 unit">
                                                                    <div className="input">
                                                                        <TextField variant="outlined" margin="dense"
                                                                            onChange={handleChange}
                                                                            className="form-control"
                                                                            type="text"
                                                                            label="RFC"
                                                                            value={state.rfcBancoOrdenante}
                                                                            pattern="[A-Z&Ñ]{3,4}[0-9]{2}(0[1-9]|1[012])(0[1-9]|[12][0-9]|3[01])[A-Z0-9]{2}[0-9A]"
                                                                            title="Favor de introducir un RFC válido."
                                                                            id="rfcBancoOrdenante"
                                                                            name="rfcBancoOrdenante"
                                                                        />
                                                                    </div>
                                                                </div>
                                                            </div>
                                                            <div className="row">
                                                                <div className="col-xs-6 col-ms-6 col-md-10 unit">
                                                                    <div className="input">
                                                                        <TextField variant="outlined" margin="dense"
                                                                            onChange={handleChange}
                                                                            className="form-control"
                                                                            type="text"
                                                                            label="Núm. Cuenta"
                                                                            value={state.cuentaBancoOrdenante}
                                                                            id="cuentaBancoOrdenante"
                                                                            name="cuentaBancoOrdenante"
                                                                        />
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>*/}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    {/*Fin de ejemplo*/}

                                    <div className="widget-wrap" id="detalles">
                                        {/*<div className="widget-header block-header margin-bottom-0 clearfix">
                                            <h3>General</h3>
                                        </div>*/}
                                        <BlockHeaderH3>{'General'}</BlockHeaderH3>
                                        <div className="widget-container">
                                            <div className="widget-content">
                                                <div className="row">
                                                    <div className="col-md-12">
                                                        {/*Este componente son las tabs*/}
                                                        <NavTabs/>
                                                        <div className="form-content">
                                                            {/* start text password */}
                                                            <div className="widget-wrap">
                                                                <div className="widget-container margin-top-0">
                                                                    <div className="widget-content">
                                                                        <div className="tab-content">
                                                                            <div id="Domicilio"
                                                                                className="tab-pane fade in active">
                                                                                <div className="row">
                                                                                    <div className="col-md-12 unit">
                                                                                        <div className="row">
                                                                                            <div className="col-sm-6 col-md-2-5 unit">
                                                                                                <label className="input select">
                                                                                                    <FormControl fullWidth variant="outlined" margin="dense">
                                                                                                        <InputLabel id="idPaisLabel">Pais</InputLabel>
                                                                                                        <Select
                                                                                                            labelId="idPaisLabel"
                                                                                                            label="Pais"
                                                                                                            onChange={
                                                                                                                handleSelectChange
                                                                                                            }
                                                                                                            className="form-control"
                                                                                                            native
                                                                                                            value={state.idPais}
                                                                                                            id="idPais"
                                                                                                            name="idPais"
                                                                                                        >
                                                                                                            {dataPais.map((pais) => (
                                                                                                                <option
                                                                                                                    value={pais.m_nIdPais}
                                                                                                                >
                                                                                                                    {pais.m_sPais}
                                                                                                                </option>
                                                                                                            ))}
                                                                                                        </Select>
                                                                                                    </FormControl>
                                                                                                </label>
                                                                                            </div>

                                                                                            <div className="col-sm-6 col-md-2-5 ">
                                                                                                <label className="input select">
                                                                                                    <FormControl fullWidth variant="outlined" margin="dense">
                                                                                                        <InputLabel id="idEstadoLabel">Estado</InputLabel>
                                                                                                        <Select
                                                                                                            labelId="idEstadoLabel"
                                                                                                            label="Estado"
                                                                                                            onChange={handleChange}
                                                                                                            className="form-control"
                                                                                                            required
                                                                                                            native
                                                                                                            name="idEstado"
                                                                                                            value={state.idEstado}
                                                                                                            id="idEstado"
                                                                                                        >
                                                                                                            {dataEstado.map(
                                                                                                                (estado) => (
                                                                                                                    <option
                                                                                                                        value={
                                                                                                                            estado.m_nIdEstado
                                                                                                                        }
                                                                                                                    >
                                                                                                                        {estado.m_sEstado}
                                                                                                                    </option>
                                                                                                                )
                                                                                                            )}
                                                                                                        </Select>
                                                                                                    </FormControl>
                                                                                                </label>
                                                                                            </div>

                                                                                            <div className="col-sm-6 col-md-2-5 ">
                                                                                                <div className="input">
                                                                                                    <TextField variant="outlined" margin="dense" label="Código Postal"
                                                                                                        onChange={handleChange}
                                                                                                        className="form-control"
                                                                                                        type="text"
                                                                                                        placeholder=""
                                                                                                        value={state.codigoPostal}
                                                                                                        id="codigoPostal"
                                                                                                        name="codigoPostal"
                                                                                                        required
                                                                                                    />
                                                                                                </div>
                                                                                            </div>

                                                                                            <div className="col-sm-6 col-md-2-5 ">
                                                                                                <div className="input">
                                                                                                    <div className="input">
                                                                                                        <TextField variant="outlined" margin="dense"
                                                                                                            label="Municipio"
                                                                                                            onChange={handleChange}
                                                                                                            className="form-control"
                                                                                                            type="text"
                                                                                                            placeholder=""
                                                                                                            value={state.municipio}
                                                                                                            id="municipio"
                                                                                                            name="municipio"
                                                                                                            required
                                                                                                        />
                                                                                                    </div>
                                                                                                </div>
                                                                                            </div>
                                                                                            <div className="col-sm-6 col-md-2-5 ">
                                                                                                <div className="input">
                                                                                                    <div className="input">
                                                                                                        <TextField variant="outlined" margin="dense" label="Localidad"
                                                                                                            onChange={handleChange}
                                                                                                            className="form-control"
                                                                                                            type="text"
                                                                                                            placeholder=""
                                                                                                            value={state.localidad}
                                                                                                            id="localidad"
                                                                                                            name="localidad"
                                                                                                        />
                                                                                                    </div>
                                                                                                </div>
                                                                                            </div>
                                                                                        </div>
                                                                                        <div className="row">
                                                                                            <div className="col-sm-6 col-md-2-5 unit">
                                                                                                <div className="input">
                                                                                                    <TextField variant="outlined" margin="dense" label="Colonia"
                                                                                                        onChange={handleChange}
                                                                                                        className="form-control"
                                                                                                        type="text"
                                                                                                        placeholder=""
                                                                                                        value={state.colonia}
                                                                                                        id="colonia"
                                                                                                        name="colonia"
                                                                                                    />
                                                                                                </div>
                                                                                            </div>
                                                                                            <div className="col-sm-6 col-md-2-5 ">
                                                                                                <div className="input">
                                                                                                    <TextField variant="outlined" margin="dense" label="Calle"
                                                                                                        onChange={handleChange}
                                                                                                        className="form-control"
                                                                                                        type="text"
                                                                                                        placeholder=""
                                                                                                        value={state.calle}
                                                                                                        id="calle"
                                                                                                        name="calle"
                                                                                                        required
                                                                                                    />
                                                                                                </div>
                                                                                            </div>

                                                                                            <div className="col-sm-6 col-md-2-5 ">
                                                                                                <div className="input">
                                                                                                    <div className="input">
                                                                                                        <TextField variant="outlined" margin="dense" label="Núm. Exterior"
                                                                                                            onChange={handleChange}
                                                                                                            className="form-control"
                                                                                                            type="text"
                                                                                                            placeholder=""
                                                                                                            value={
                                                                                                                state.numeroExterior
                                                                                                            }
                                                                                                            id="numeroExterior"
                                                                                                            name="numeroExterior"
                                                                                                        />
                                                                                                    </div>
                                                                                                </div>
                                                                                            </div>
                                                                                            <div className="col-sm-6 col-md-2-5 ">
                                                                                                <div className="input">
                                                                                                    <div className="input">
                                                                                                        <TextField variant="outlined" margin="dense" label="Número Interior"
                                                                                                            onChange={handleChange}
                                                                                                            className="form-control"
                                                                                                            type="text"
                                                                                                            placeholder=""
                                                                                                            value={
                                                                                                                state.numeroInterior
                                                                                                            }
                                                                                                            id="numeroInterior"
                                                                                                            name="numeroInterior"
                                                                                                        />
                                                                                                    </div>
                                                                                                </div>
                                                                                            </div>
                                                                                            <div className="col-sm-6 col-md-2-5 ">
                                                                                                <div className="input">
                                                                                                    <div className="input">
                                                                                                        <TextField variant="outlined" margin="dense" label="Teléfonos"
                                                                                                            onChange={handleChange}
                                                                                                            className="form-control"
                                                                                                            type="text"
                                                                                                            placeholder=""
                                                                                                            value={state.telefono}
                                                                                                            id="telefono"
                                                                                                            name="telefono"
                                                                                                        />
                                                                                                    </div>
                                                                                                </div>
                                                                                            </div>
                                                                                        </div>
                                                                                        <div className="row">
                                                                                            <div className="col-sm-6  col-md-2-5 unit">
                                                                                                <div className="input">
                                                                                                    <div className="input">
                                                                                                        <TextField variant="outlined" margin="dense" label="Celular"
                                                                                                            onChange={handleChange}
                                                                                                            className="form-control"
                                                                                                            type="text"
                                                                                                            placeholder=""
                                                                                                            value={state.celular}
                                                                                                            id="celular"
                                                                                                            name="celular"
                                                                                                        />
                                                                                                    </div>
                                                                                                </div>
                                                                                            </div>
                                                                                            <div className="col-sm-6 col-md-2-5 unit">
                                                                                                <div className="input">
                                                                                                    <div className="input">
                                                                                                        <TextField variant="outlined" margin="dense" label="Nextel"
                                                                                                            onChange={handleChange}
                                                                                                            className="form-control"
                                                                                                            type="text"
                                                                                                            placeholder=""
                                                                                                            value={state.nextel}
                                                                                                            id="nextel"
                                                                                                            name="nextel"
                                                                                                        />
                                                                                                    </div>
                                                                                                </div>
                                                                                            </div>
                                                                                            <div className="col-sm-6 col-md-2-5 unit">
                                                                                                <div className="input">
                                                                                                    <div className="input">
                                                                                                        <TextField variant="outlined" margin="dense" label="Correo"
                                                                                                            onChange={handleChange}
                                                                                                            className="form-control"
                                                                                                            type="text"
                                                                                                            placeholder=""
                                                                                                            value={
                                                                                                                state.correoElectronico
                                                                                                            }
                                                                                                            id="correoElectronico"
                                                                                                            name="correoElectronico"
                                                                                                        />
                                                                                                    </div>
                                                                                                </div>
                                                                                            </div>
                                                                                        </div>
                                                                                    </div>
                                                                                </div>
                                                                            </div>
                                                                            <div
                                                                                id="Formatos"
                                                                                className="tab-pane fade">
                                                                                <div className="row">
                                                                                    {/*<TableFormatos
                                                                                                columns={columns2}
                                                                                                data={dataFormatos}
                                                                                            />*/}
                                                                                    <div>
                                                                                        <DataGrid
                                                                                            rows={dataFormatos}
                                                                                            localeText={dataGridLocaleText}
                                                                                            columns={columns2}
                                                                                            density="compact"
                                                                                            pageSize={5}
                                                                                            getRowId={(row) => row.m_nIdFormato}
                                                                                            checkboxSelection
                                                                                            disableSelectionOnClick
                                                                                        autoHeight={true}/>
                                                                                    </div>
                                                                                </div>
                                                                            </div>
                                                                            <div
                                                                                id="Especiales"
                                                                                className="tab-pane fade ">
                                                                                <div className="row">
                                                                                    <SectionHeaderH4>{'Envío de Estados de Cuentas'}</SectionHeaderH4>
                                                                                    <Grid container spacing={3}>
                                                                                        <Grid item xs={3}>
                                                                                            <TextField
                                                                                                variant="outlined" margin="dense"
                                                                                                onChange={handleChange}
                                                                                                className="form-control"
                                                                                                type="text"
                                                                                                fullWidth
                                                                                                label="Frecuencia de Envio (Días)"
                                                                                                value={state.frecuenciaEnvioDias}
                                                                                                id="frecuenciaEnvioDias"
                                                                                                name="frecuenciaEnvioDias"/>
                                                                                        </Grid>
                                                                                        <Grid item xs={9}></Grid>
                                                                                        <Grid item xs={3}>
                                                                                            <TextField
                                                                                                variant="outlined" margin="dense"
                                                                                                onChange={handleChange}
                                                                                                className="form-control"
                                                                                                type="datetime-local"
                                                                                                InputLabelProps={{
                                                                                                           shrink: true,
                                                                                                       }}
                                                                                                fullWidth
                                                                                                label="Enviar a partir de"
                                                                                                value={state.enviarApartir}
                                                                                                id="enviarApartir"
                                                                                                name="enviarApartir"/>
                                                                                        </Grid>
                                                                                        <Grid item xs={9}></Grid>
                                                                                        <Grid item xs={12}>
                                                                                            <FormControlLabel
                                                                                                control={
                                                                                                    <Checkbox
                                                                                                        checked={state.envioAutomaticoSeguimiento}
                                                                                                        onChange={(e) => setState({
                                                                                                            ...state,
                                                                                                            envioAutomaticoSeguimiento: e.target.checked,
                                                                                                        })}
                                                                                                        name="envioAutomaticoSeguimiento"
                                                                                                        color="primary"
                                                                                                        value={state.envioAutomaticoSeguimiento}
                                                                                                        id="envioAutomaticoSeguimiento"
                                                                                                        icon={<CheckBoxOutlineBlankIcon fontSize="large" />}
                                                                                                        checkedIcon={<CheckBoxIcon fontSize="large" />}
                                                                                                    />
                                                                                                }
                                                                                                label="Envio Automático de Seguimiento de Viajes"/>
                                                                                        </Grid>
                                                                                        <Grid item xs={12}>
                                                                                            <FormControlLabel
                                                                                                control={
                                                                                                    <Checkbox
                                                                                                        checked={state.excluirNodo}
                                                                                                        onChange={(e) => setState({
                                                                                                            ...state,
                                                                                                            excluirNodo: e.target.checked,
                                                                                                        })}
                                                                                                        name="excluirNodo"
                                                                                                        color="primary"
                                                                                                        value={state.excluirNodo}
                                                                                                        id="excluirNodo"
                                                                                                        icon={<CheckBoxOutlineBlankIcon fontSize="large" />}
                                                                                                        checkedIcon={<CheckBoxIcon fontSize="large" />}
                                                                                                    />
                                                                                                }
                                                                                                label="Excluir Nodo Condiciones de Pago en el XML"/>
                                                                                        </Grid>
                                                                                    </Grid>
                                                                                    {/*Antiguos inputs*/}
                                                                                    {/*<div className="col-md-12 unit">
                                                                                        <div className="w-section-header">
                                                                                            <h3>Envío de Estados de Cuentas</h3>
                                                                                        </div>

                                                                                        <div className="row">

                                                                                            <div className="col-md-2-5 col-sm-2-5 col-lg-2-5">

                                                                                                <div className="input" style={{ padding: "10px" }}>
                                                                                                    <div className="input" >
                                                                                                        <TextField variant="outlined" margin="dense"
                                                                                                            onChange={handleChange}
                                                                                                            className="form-control"
                                                                                                            type="text"
                                                                                                            fullWidth
                                                                                                            label="Frecuencia de Envio (Días)"
                                                                                                            value={
                                                                                                                state.frecuenciaEnvioDias
                                                                                                            }
                                                                                                            id="frecuenciaEnvioDias"
                                                                                                            name="frecuenciaEnvioDias"/>
                                                                                                    </div>
                                                                                                </div>
                                                                                            </div>
                                                                                        </div>
                                                                                        <div className="row">
                                                                                            <div className="col-md-2-5">

                                                                                                <div className="input" style={{ padding: "10px" }}>
                                                                                                    <div className="input" >
                                                                                                        <TextField variant="outlined" margin="dense"
                                                                                                            onChange={handleChange}
                                                                                                            className="form-control"
                                                                                                            type="datetime-local"
                                                                                                            InputLabelProps={{
                                                                                                                shrink: true,
                                                                                                            }}
                                                                                                            fullWidth
                                                                                                            label="Enviar a partir de"
                                                                                                            value={
                                                                                                                state.enviarApartir
                                                                                                            }
                                                                                                            id="enviarApartir"
                                                                                                            name="enviarApartir"/>
                                                                                                    </div>
                                                                                                </div>
                                                                                            </div>
                                                                                        </div>
                                                                                    </div>*/}
                                                                                    {/*<div className="unit">
                                                                                        <div className="inline-group">
                                                                                            <label className="label">
                                                                                                &nbsp;{" "}
                                                                                            </label>
                                                                                            <label className="checkbox">
                                                                                                <input
                                                                                                    checked={state.envioAutomaticoSeguimiento}
                                                                                                    onChange={(e) => setState({
                                                                                                            ...state,
                                                                                                            envioAutomaticoSeguimiento: e.target.checked,
                                                                                                        })}
                                                                                                    native
                                                                                                    name="envioAutomaticoSeguimiento"
                                                                                                    type="checkbox"
                                                                                                    value={state.envioAutomaticoSeguimiento}
                                                                                                    id="envioAutomaticoSeguimiento"/>
                                                                                                <i />Envio Automático de Seguimiento de Viajes
                                                                                            </label>
                                                                                        </div>
                                                                                    </div>*/}
                                                                                    {/*<div className="unit">
                                                                                        <div className="inline-group">
                                                                                            <label className="checkbox">
                                                                                                <input variant="outlined" margin="dense"
                                                                                                    checked={state.excluirNodo}
                                                                                                    onChange={(e) => setState({
                                                                                                            ...state,
                                                                                                            excluirNodo: e.target.checked,
                                                                                                        })}
                                                                                                    native
                                                                                                    name="excluirNodo"
                                                                                                    type="checkbox"
                                                                                                    id="excluirNodo"
                                                                                                    value={state.excluirNodo}/>
                                                                                                <i/>Excluir Nodo Condiciones de Pago en el XML
                                                                                            </label>
                                                                                        </div>
                                                                                    </div>*/}
                                                                                </div>
                                                                            </div>

                                                                            <div
                                                                                id="Adicional"
                                                                                className="tab-pane fade ">
                                                                                <div className="row">
                                                                                    <Grid container spacing={3}>
                                                                                        <Grid item xs={3}>
                                                                                            <FormControl fullWidth variant="outlined" margin="dense">
                                                                                                <InputLabel id="idUSOCFDILabel">Uso de CFDI</InputLabel>
                                                                                                <Select
                                                                                                    labelId="idUSOCFDILabel"
                                                                                                    label="Uso de CFDI"
                                                                                                    onChange={handleChange}
                                                                                                    className="form-control"

                                                                                                    native
                                                                                                    name="idUSOCFDI"
                                                                                                    value={state.idUSOCFDI}
                                                                                                    id="idUSOCFDI"
                                                                                                >
                                                                                                    <option value="1">
                                                                                                        1. Adqusicion de mercancias
                                                                                                    </option>
                                                                                                    <option value="2">
                                                                                                        2. Devoluciones, descuentos
                                                                                                        o bonificaciones{" "}
                                                                                                    </option>
                                                                                                    <option value="3">
                                                                                                        3. Gastos en general{" "}
                                                                                                    </option>
                                                                                                    <option value="4">
                                                                                                        4. Construcciones{" "}
                                                                                                    </option>
                                                                                                    <option value="5">
                                                                                                        5. Mobiliario y equipo{" "}
                                                                                                    </option>
                                                                                                </Select>
                                                                                            </FormControl>
                                                                                        </Grid>
                                                                                        <Grid item xs={3}>
                                                                                            <TextField
                                                                                                variant="outlined" margin="dense"
                                                                                                onChange={handleChange}
                                                                                                className="form-control"
                                                                                                type="text"
                                                                                                fullWidth
                                                                                                label="Núm. Registro de Identidad Fiscal"
                                                                                                value={state.numResgistoIdentidadFiscal}
                                                                                                id="numResgistoIdentidadFiscal"
                                                                                                name="numResgistoIdentidadFiscal"/>
                                                                                        </Grid>
                                                                                        <Grid item xs={6}></Grid>
                                                                                    </Grid>
                                                                                    <FormControlLabel
                                                                                        control={
                                                                                            <Checkbox
                                                                                                checked={state.agruparCantidadPorConcepto}
                                                                                                onChange={(e) => setState({
                                                                                                    ...state,
                                                                                                    agruparCantidadPorConcepto: e.target.checked,
                                                                                                })}
                                                                                                name="agruparCantidadPorConcepto"
                                                                                                color="primary"
                                                                                                size={'medium'}
                                                                                                value={state.agruparCantidadPorConcepto}
                                                                                                id="agruparCantidadPorConcepto"
                                                                                                icon={<CheckBoxOutlineBlankIcon fontSize="large" />}
                                                                                                checkedIcon={<CheckBoxIcon fontSize="large" />}
                                                                                            />
                                                                                        }
                                                                                        label="Permitir agrupar la cantidad de conceptos al facturar"/>
                                                                                    <FormControlLabel
                                                                                        control={
                                                                                            <Checkbox
                                                                                                checked={state.ajustarImporte2Dec}
                                                                                                onChange={(e) => setState({
                                                                                                    ...state,
                                                                                                    ajustarImporte2Dec: e.target.checked,
                                                                                                })}
                                                                                                name="ajustarImporte2Dec"
                                                                                                color="primary"
                                                                                                size={'medium'}
                                                                                                value={state.ajustarImporte2Dec}
                                                                                                id="ajustarImporte2Dec"
                                                                                                icon={<CheckBoxOutlineBlankIcon fontSize="large" />}
                                                                                                checkedIcon={<CheckBoxIcon fontSize="large" />}
                                                                                            />
                                                                                        }
                                                                                        label="Ajusta a 2 Decimales los importes de los conceptos en Facturacion por viaje"/>
                                                                                    <FormControlLabel
                                                                                        control={
                                                                                            <Checkbox
                                                                                                checked={state.aplicarDetalleConceptoCadaViajeXML}
                                                                                                onChange={(e) => setState({
                                                                                                    ...state,
                                                                                                    aplicarDetalleConceptoCadaViajeXML: e.target.checked,
                                                                                                })}
                                                                                                name="aplicarDetalleConceptoCadaViajeXML"
                                                                                                color="primary"
                                                                                                size={'medium'}
                                                                                                value={state.aplicarDetalleConceptoCadaViajeXML}
                                                                                                id="aplicarDetalleConceptoCadaViajeXML"
                                                                                                icon={<CheckBoxOutlineBlankIcon fontSize="large" />}
                                                                                                checkedIcon={<CheckBoxIcon fontSize="large" />}
                                                                                            />
                                                                                        }
                                                                                        label="Aplicar en el XML de la factura, el Detalle por Concepto de Cada Viaje/CartaPorte"/>
                                                                                   {/* <div className="col-md-12 unit">
                                                                                        <div className="unit ">
                                                                                            <label className="input select">
                                                                                                <FormControl fullWidth variant="outlined" margin="dense">
                                                                                                    <InputLabel id="idUSOCFDILabel">Uso de CFDI</InputLabel>
                                                                                                    <Select
                                                                                                        labelId="idUSOCFDILabel"
                                                                                                        label="Uso de CFDI"
                                                                                                        onChange={handleChange}
                                                                                                        className="form-control"
                                                                                                        
                                                                                                        native
                                                                                                        name="idUSOCFDI"
                                                                                                        value={state.idUSOCFDI}
                                                                                                        id="idUSOCFDI"
                                                                                                    >
                                                                                                        <option value="1">
                                                                                                            1. Adqusicion de mercancias
                                                  </option>
                                                                                                        <option value="2">
                                                                                                            2. Devoluciones, descuentos
                                                    o bonificaciones{" "}
                                                                                                        </option>
                                                                                                        <option value="3">
                                                                                                            3. Gastos en general{" "}
                                                                                                        </option>
                                                                                                        <option value="4">
                                                                                                            4. Construcciones{" "}
                                                                                                        </option>
                                                                                                        <option value="5">
                                                                                                            5. Mobiliario y equipo{" "}
                                                                                                        </option>
                                                                                                    </Select>
                                                                                                </FormControl>
                                                                                            </label>
                                                                                        </div>

                                                                                        <div className="unit">
                                                                                            <div className="inline-group">
                                                                                                <label className="label">
                                                                                                    { }
                                                                                                </label>
                                                                                                <label className="checkbox">
                                                                                                    <input
                                                                                                        checked={state.agruparCantidadPorConcepto}
                                                                                                        onChange={(e) => setState({
                                                                                                                ...state,
                                                                                                                agruparCantidadPorConcepto: e.target.checked,
                                                                                                            })}
                                                                                                        native
                                                                                                        name="agruparCantidadPorConcepto"
                                                                                                        type="checkbox"
                                                                                                        value={state.agruparCantidadPorConcepto}
                                                                                                        id="agruparCantidadPorConcepto"
                                                                                                    />
                                                                                                    <i />Permitir agrupar la cantidad de conceptos al facturar
                                                                                                </label>
                                                                                            </div>
                                                                                        </div>
                                                                                        <div className="unit">
                                                                                            <div className="inline-group">
                                                                                                <label className="label">
                                                                                                    { }
                                                                                                </label>
                                                                                                <label className="checkbox">
                                                                                                    <input
                                                                                                        checked={state.ajustarImporte2Dec}
                                                                                                        onChange={(e) => setState({
                                                                                                                ...state,
                                                                                                                ajustarImporte2Dec: e.target.checked,
                                                                                                            })}
                                                                                                        native
                                                                                                        name="ajustarImporte2Dec"
                                                                                                        type="checkbox"
                                                                                                        value={state.ajustarImporte2Dec}
                                                                                                        id="ajustarImporte2Dec"
                                                                                                    />
                                                                                                    <i />Ajusta a 2 Decimales los importes de los conceptos en Facturacion por viaje
                                                                                                </label>
                                                                                            </div>
                                                                                        </div>

                                                                                        <div className="unit">
                                                                                            <div className="inline-group">
                                                                                                <label className="label">
                                                                                                    { }
                                                                                                </label>
                                                                                                <label className="checkbox">
                                                                                                    <input
                                                                                                        checked={state.aplicarDetalleConceptoCadaViajeXML}
                                                                                                        onChange={(e) => setState({
                                                                                                                ...state,
                                                                                                                aplicarDetalleConceptoCadaViajeXML: e.target.checked,
                                                                                                            })}
                                                                                                        native
                                                                                                        name="aplicarDetalleConceptoCadaViajeXML"
                                                                                                        type="checkbox"
                                                                                                        value={state.aplicarDetalleConceptoCadaViajeXML}
                                                                                                        id="aplicarDetalleConceptoCadaViajeXML"
                                                                                                    />
                                                                                                    <i />Aplicar en el XML de la factura, el Detalle por Concepto de Cada Viaje/CartaPorte
                                                                                                </label>
                                                                                            </div>
                                                                                        </div>
                                                                                    </div>*/}
                                                                                </div>
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                            {/* end textarea */}
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    {/*Fin de ejemplo*/}

                                    <div className="widget-wrap" id="seguros">
                                        {/*<div className="widget-header block-header margin-bottom-0 clearfix">
                                            <div className="pull-left">
                                                <h3>Seguros</h3>
                                            </div>

                                        </div>*/}
                                        <BlockHeaderH3>{'Seguros'}</BlockHeaderH3>
                                        <div className="widget-container">
                                            <div className="widget-content">
                                                <div className="row">
                                                    <div className="col-md-12">
                                                        <div className="form-content">
                                                            {/* start text password */}
                                                            <div className="row">
                                                                <div className="col-sm-6 col-md-2 col-lg-2 unit">
                                                                    <div className="input">
                                                                        <TextField variant="outlined" margin="dense" label="Aseguradora"
                                                                                   onChange={handleChange}
                                                                                   className="form-control"
                                                                                   type="text"
                                                                                   placeholder={
                                                                                       state.companiaSeguros1
                                                                                   }
                                                                                   id="companiaSeguros1"
                                                                                   name="companiaSeguros1"
                                                                        />
                                                                    </div>
                                                                </div>
                                                                <div className="col-sm-6 col-md-2 col-lg-2 unit">
                                                                    <div className="input">
                                                                        <TextField variant="outlined" margin="dense" label="Teléfonos"
                                                                                   onChange={handleChange}
                                                                                   className="form-control"
                                                                                   type="text"
                                                                                   value={state.telefonoSeguro1}
                                                                                   id="telefonoSeguro1"
                                                                                   name="telefonoSeguro1"
                                                                        />
                                                                    </div>
                                                                </div>
                                                                <div className="col-sm-6 col-md-2 col-lg-2 unit">
                                                                    <div className="input">
                                                                        <TextField variant="outlined" margin="dense" label="Núm. Seguro"
                                                                                   onChange={handleChange}
                                                                                   className="form-control"
                                                                                   type="text"
                                                                                   value={state.numeroSeguro1}
                                                                                   id="numeroSeguro1"
                                                                                   name="numeroSeguro1"
                                                                        />
                                                                    </div>
                                                                </div>
                                                                <div className="col-sm-6 col-md-2  col-lg-2 unit">
                                                                    <div className="input">
                                                                        <TextField variant="outlined" margin="dense" label="Vencimiento"
                                                                                   onChange={handleChange}
                                                                                   className="form-control"
                                                                                   type="datetime-local"
                                                                                   value={
                                                                                       state.vencimientoSeguro1
                                                                                   }
                                                                                   InputLabelProps={{
                                                                                       shrink: true,
                                                                                   }}
                                                                                   id="vencimientoSeguro1"
                                                                                   name="vencimientoSeguro1"
                                                                        />
                                                                    </div>
                                                                </div>
                                                                <div className="col-sm-12 col-md-4 col-lg-4 unit">
                                                                    <div className="inline-group">
                                                                        <label className="label">
                                                                            Tipo de Cobertura
                                                                        </label>
                                                                        <label className="radio">
                                                                            <input
                                                                                onChange={handleChange}
                                                                                type="radio"
                                                                                defaultChecked
                                                                                value="1"
                                                                                placeholder={state.tipoCobertura1}
                                                                                id="tipoCobertura1"
                                                                                name="tipoCobertura1"
                                                                            />
                                                                            <i />
                                                                            Amplia
                                                                        </label>
                                                                        <label className="radio">
                                                                            <input
                                                                                onChange={handleChange}
                                                                                type="radio"
                                                                                value="2"
                                                                                placeholder={state.tipoCobertura1}
                                                                                id="tipoCobertura1"
                                                                                name="tipoCobertura1"
                                                                            />
                                                                            <i />
                                                                            Limitada
                                                                        </label>
                                                                        <label className="radio">
                                                                            <input
                                                                                onChange={handleChange}
                                                                                type="radio"
                                                                                value="3"
                                                                                placeholder={state.tipoCobertura1}
                                                                                id="tipoCobertura1"
                                                                                name="tipoCobertura1"
                                                                            />
                                                                            <i />
                                                                            S/Cobertura
                                                                        </label>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                            <div className="row">
                                                                <div className="col-sm-6 col-md-2 col-lg-2 unit">
                                                                    <div className="input">
                                                                        <TextField variant="outlined" margin="dense" label="Aseguradora"
                                                                                   onChange={handleChange}
                                                                                   className="form-control"
                                                                                   type="text"
                                                                                   value={state.companiaSeguros2}
                                                                                   id="companiaSeguros2"
                                                                                   name="companiaSeguros2"
                                                                        />
                                                                    </div>
                                                                </div>
                                                                <div className="col-sm-6 col-md-2 col-lg-2 unit">
                                                                    <div className="input">
                                                                        <TextField variant="outlined" margin="dense" label="Teléfonos"
                                                                                   onChange={handleChange}
                                                                                   className="form-control"
                                                                                   type="text"
                                                                                   value={state.telefonoSeguro2}
                                                                                   id="telefonoSeguro2"
                                                                                   name="telefonoSeguro2"
                                                                        />
                                                                    </div>
                                                                </div>
                                                                <div className="col-sm-6 col-md-2 col-lg-2 unit">
                                                                    <div className="input">
                                                                        <TextField variant="outlined" margin="dense" label="Núm. Seguro"
                                                                                   onChange={handleChange}
                                                                                   className="form-control"
                                                                                   type="text"
                                                                                   value={state.numeroSeguro2}
                                                                                   id="numeroSeguro2"
                                                                                   name="numeroSeguro2"
                                                                        />
                                                                    </div>
                                                                </div>
                                                                <div className="col-sm-6 col-md-2  col-lg-2 unit">
                                                                    <div className="input">
                                                                        <TextField variant="outlined" margin="dense" label="Vencimiento"
                                                                                   onChange={handleChange}
                                                                                   className="form-control"
                                                                                   type="datetime-local"
                                                                                   placeholder=""
                                                                                   value={state.vencimientoSeguro2}
                                                                                   InputLabelProps={{
                                                                                       shrink: true,
                                                                                   }}
                                                                                   id="vencimientoSeguro2"
                                                                                   name="vencimientoSeguro2"
                                                                        />
                                                                    </div>
                                                                </div>
                                                                <div className="col-sm-12 col-md-4 col-lg-4 unit">
                                                                    <div className="inline-group">
                                                                        <label className="label">
                                                                            Tipo de cobertura
                                                                        </label>
                                                                        <label className="radio">
                                                                            <input
                                                                                onChange={handleChange}
                                                                                type="radio"
                                                                                value="1"
                                                                                defaultChecked
                                                                                placeholder={
                                                                                    state.tipoCobertura2
                                                                                }
                                                                                id="tipoCobertura2"
                                                                                name="tipoCobertura2"
                                                                            />
                                                                            <i />
                                                                            Amplia
                                                                        </label>
                                                                        <label className="radio">
                                                                            <input
                                                                                onChange={handleChange}
                                                                                type="radio"
                                                                                value="2"
                                                                                placeholder={
                                                                                    state.tipoCobertura2
                                                                                }
                                                                                id="tipoCobertura2"
                                                                                name="tipoCobertura2"
                                                                            />
                                                                            <i />
                                                                            Limitada
                                                                        </label>
                                                                        <label className="radio">
                                                                            <input
                                                                                onChange={handleChange}
                                                                                type="radio"
                                                                                value="3"
                                                                                placeholder={
                                                                                    state.tipoCobertura2
                                                                                }
                                                                                id="tipoCobertura2"
                                                                                name="tipoCobertura2"
                                                                            />
                                                                            <i />
                                                                            S/Cobertura
                                                                        </label>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                            {/* end text password */}
                                                            {/* start email url */}

                                                            {/* end textarea */}
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="widget-wrap" id="otros">
                                        {/*<div className="widget-header block-header margin-bottom-0 clearfix">
                                            <div className="pull-left">
                                                <h3> Contacto</h3>
                                            </div>
                                        </div>*/}
                                        {/*<Grid container spacing={1}>
                                            <Grid item xs={6}>
                                                <BlockHeaderH3>{"Contacto"}</BlockHeaderH3>
                                                <Grid container spacing={2} alignItems="center">
                                                    <Grid item xs={6} >
                                                        <Grid container spacing={2}>
                                                            <Grid item xs={12}>
                                                            <TextField
                                                                variant="outlined" margin="dense" label="Contacto"
                                                                onChange={handleChange}
                                                                value={state.contactoNombre}
                                                                name="contactoNombre"
                                                                className="form-control"
                                                                type="text"
                                                                placeholder=""
                                                                id="contactoNombre"
                                                            />
                                                            </Grid>
                                                            <Grid item xs={12}>
                                                                <TextField
                                                                    variant="outlined" margin="dense"
                                                                    label="Correo"
                                                                    onChange={handleChange}
                                                                    value={state.contactoCorreo}
                                                                    name="contactoCorreo"
                                                                    className="form-control"
                                                                    type="email"
                                                                    placeholder=""
                                                                    id="contactoCorreo"
                                                                />
                                                            </Grid>
                                                            <Grid item xs={12}>
                                                            <TextField
                                                                variant="outlined" margin="dense" label="Teléfono"
                                                                onChange={handleChange}
                                                                value={state.contactoTelefono}
                                                                name="contactoTelefono"
                                                                className="form-control"
                                                                type="text"
                                                                placeholder=""
                                                                id="contactoTelefono"
                                                            />
                                                        </Grid>
                                                            <Grid item xs={12}>
                                                                <Button variant="contained" color="primary">
                                                                    Agregar contacto
                                                                </Button>
                                                                <button
                                                                    className="btn btn-primary primary-btn">Agregar contacto
                                                                </button>
                                                            </Grid>
                                                        </Grid>
                                                    </Grid>
                                                    <Grid item xs={6}>
                                                        <div className="inline-group">
                                                            <label className="label">&nbsp; </label>
                                                            <label className="checkbox">
                                                                <input
                                                                    checked={state.RecibirFactura}
                                                                    onChange={(e) =>
                                                                        setState({
                                                                            ...state,
                                                                            RecibirFactura: e.target.checked,
                                                                        })
                                                                    } native
                                                                    name="RecibirFactura"
                                                                    type="checkbox"
                                                                    value={state.RecibirFactura}
                                                                    id="RecibirFactura"
                                                                />
                                                                <i />Recibir factura
                                                            </label>
                                                        </div>
                                                        <div className="inline-group">
                                                            <label className="checkbox">
                                                                <input variant="outlined" margin="dense"
                                                                       checked={state.RecibirEstadoCuenta}
                                                                       onChange={(e) =>
                                                                           setState({
                                                                               ...state,
                                                                               RecibirEstadoCuenta: e.target.checked,
                                                                           })
                                                                       }
                                                                       native
                                                                       name="RecibirEstadoCuenta"
                                                                       type="checkbox"
                                                                       id="RecibirEstadoCuenta"
                                                                       value={state.RecibirEstadoCuenta}
                                                                />
                                                                <i />
                                                                Recibir Edo de cuenta
                                                            </label>
                                                        </div>
                                                        <div className="inline-group">
                                                            <label className="checkbox">
                                                                <input
                                                                    checked={state.PermitirSeguimiento}
                                                                    onChange={(e) =>
                                                                        setState({
                                                                            ...state,
                                                                            PermitirSeguimiento: e.target.checked,
                                                                        })
                                                                    }
                                                                    native
                                                                    name="PermitirSeguimiento"
                                                                    type="checkbox"
                                                                    id="PermitirSeguimiento"
                                                                    value={state.PermitirSeguimiento}
                                                                />
                                                                <i />
                                                                Permitir Seguimiento de Viajes/Unidades
                                                            </label>
                                                        </div>
                                                        <div className="inline-group">
                                                            <label className="checkbox">
                                                                <input
                                                                    checked={state.UsoServicioWeb}
                                                                    onChange={(e) =>
                                                                        setState({
                                                                            ...state,
                                                                            UsoServicioWeb: e.target.checked,
                                                                        })
                                                                    }
                                                                    native
                                                                    name="UsoServicioWeb"
                                                                    type="checkbox"
                                                                    id="UsoServicioWeb"
                                                                    value={state.UsoServicioWeb}
                                                                />
                                                                <i />
                                                                Uso de un servicio web
                                                            </label>
                                                        </div>
                                                        <div className="inline-group">
                                                            <label className="checkbox">
                                                                <input
                                                                    checked={state.PermitirVerPortal}
                                                                    onChange={(e) =>
                                                                        setState({
                                                                            ...state,
                                                                            PermitirVerPortal: e.target.checked,
                                                                        })
                                                                    }
                                                                    native
                                                                    name="PermitirVerPortal"
                                                                    type="checkbox"
                                                                    id="PermitirVerPortal"
                                                                    value={state.PermitirVerPortal}
                                                                />
                                                                <i />
                                                                Permitir ver Portal de Clientes
                                                            </label>
                                                        </div>
                                                        <div className="inline-group">
                                                            <label className="checkbox">
                                                                <input
                                                                    checked={state.RecibirCartaPorte}
                                                                    onChange={(e) =>
                                                                        setState({
                                                                            ...state,
                                                                            RecibirCartaPorte: e.target.checked,
                                                                        })
                                                                    }
                                                                    native
                                                                    name="RecibirCartaPorte"
                                                                    type="checkbox"
                                                                    id="RecibirCartaPorte"
                                                                    value={state.RecibirCartaPorte}
                                                                />
                                                                <i />
                                                                Recibir carta porte
                                                            </label>
                                                        </div>
                                                    </Grid>
                                                </Grid>
                                            </Grid>
                                            <Grid item xs={6}>

                                            </Grid>
                                        </Grid>*/}
                                        <FormularioContacto data={state} onChange={handleChange}/>

                                        <div className="widget-container">
                                            <div className="widget-content">
                                                <div className="row">
                                                    {/*<div className="col-md-12">
                                                        <div className="form-content">
                                                             start text password

                                                            <div className="row">
                                                                <div className="col-sm-6 col-md-2-5 col-lg-2-5 unit">
                                                                    <div className="input">
                                                                        <TextField variant="outlined" margin="dense" label="Contacto"
                                                                            onChange={handleChange}
                                                                            value={state.contactoNombre}
                                                                            name="contactoNombre"
                                                                            className="form-control"
                                                                            type="text"
                                                                            placeholder=""
                                                                            id="contactoNombre"
                                                                        />
                                                                    </div>
                                                                </div>
                                                                <div className="col-sm-6  col-md-6 col-lg-2  unit">
                                                                    <div className="inline-group">
                                                                        <label className="label">&nbsp; </label>
                                                                        <label className="checkbox">
                                                                            <input
                                                                                checked={state.RecibirFactura}
                                                                                onChange={(e) =>
                                                                                    setState({
                                                                                        ...state,
                                                                                        RecibirFactura: e.target.checked,
                                                                                    })
                                                                                } native
                                                                                name="RecibirFactura"
                                                                                type="checkbox"
                                                                                value={state.RecibirFactura}
                                                                                id="RecibirFactura"
                                                                            />
                                                                            <i />Recibir factura
                                                                        </label>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                            <div className="row">
                                                                <div className="col-sm-6 col-md-2-5 col-lg-2-5 unit">
                                                                    <div className="input">
                                                                        <TextField variant="outlined" margin="dense"
                                                                            label="Correo"
                                                                            onChange={handleChange}
                                                                            value={state.contactoCorreo}
                                                                            name="contactoCorreo"
                                                                            className="form-control"
                                                                            type="email"
                                                                            placeholder=""
                                                                            id="contactoCorreo"
                                                                        />
                                                                    </div>
                                                                </div>
                                                                <div className="col-sm-6  col-md-6 col-lg-4  unit">
                                                                    <div className="inline-group">
                                                                        <label className="checkbox">
                                                                            <input variant="outlined" margin="dense"
                                                                                checked={state.RecibirEstadoCuenta}
                                                                                onChange={(e) =>
                                                                                    setState({
                                                                                        ...state,
                                                                                        RecibirEstadoCuenta: e.target.checked,
                                                                                    })
                                                                                }
                                                                                native
                                                                                name="RecibirEstadoCuenta"
                                                                                type="checkbox"
                                                                                id="RecibirEstadoCuenta"
                                                                                value={state.RecibirEstadoCuenta}
                                                                            />
                                                                            <i />
                                      Recibir Edo de cuenta
                                    </label>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                            <div className="row">
                                                                <div className="col-sm-6 col-md-2-5 col-lg-2-5 unit">
                                                                    <div className="input">
                                                                        <TextField variant="outlined" margin="dense" label="Teléfono"
                                                                            onChange={handleChange}
                                                                            value={state.contactoTelefono}
                                                                            name="contactoTelefono"
                                                                            className="form-control"
                                                                            
                                                                            type="text"
                                                                            placeholder=""
                                                                            id="contactoTelefono"
                                                                        />
                                                                    </div>
                                                                </div>
                                                                <div className="col-sm-6  col-md-6 col-lg-4  unit">
                                                                    <div className="inline-group">
                                                                        <label className="checkbox">
                                                                            <input
                                                                                checked={state.PermitirSeguimiento}
                                                                                onChange={(e) =>
                                                                                    setState({
                                                                                        ...state,
                                                                                        PermitirSeguimiento: e.target.checked,
                                                                                    })
                                                                                }
                                                                                native
                                                                                name="PermitirSeguimiento"
                                                                                type="checkbox"
                                                                                id="PermitirSeguimiento"
                                                                                value={state.PermitirSeguimiento}
                                                                            />
                                                                            <i />
                                      Permitir Seguimiento de Viajes/Unidades
                                    </label>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                            <div className="row">
                                                                <div className="col-sm-6 col-md-2-5 col-lg-2-5 unit"></div>
                                                                <div className="col-sm-6  col-md-6 col-lg-4  unit">
                                                                    <div className="inline-group">
                                                                        <label className="checkbox">
                                                                            <input
                                                                                checked={state.UsoServicioWeb}
                                                                                onChange={(e) =>
                                                                                    setState({
                                                                                        ...state,
                                                                                        UsoServicioWeb: e.target.checked,
                                                                                    })
                                                                                }
                                                                                native
                                                                                name="UsoServicioWeb"
                                                                                type="checkbox"
                                                                                id="UsoServicioWeb"
                                                                                value={state.UsoServicioWeb}
                                                                            />
                                                                            <i />
                                      Uso de un servicio web
                                    </label>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                            <div className="row">
                                                                <div className="col-sm-6 col-md-2-5 col-lg-2-5 unit"></div>
                                                                <div className="col-sm-6  col-md-6 col-lg-4  unit">
                                                                    <div className="inline-group">
                                                                        <label className="checkbox">
                                                                            <input
                                                                                checked={state.PermitirVerPortal}
                                                                                onChange={(e) =>
                                                                                    setState({
                                                                                        ...state,
                                                                                        PermitirVerPortal: e.target.checked,
                                                                                    })
                                                                                }
                                                                                native
                                                                                name="PermitirVerPortal"
                                                                                type="checkbox"
                                                                                id="PermitirVerPortal"
                                                                                value={state.PermitirVerPortal}
                                                                            />
                                                                            <i />
                                      Permitir ver Portal de Clientes
                                    </label>
                                                                    </div>
                                                                </div>
                                                            </div>

                                                            <div className="row">
                                                                <div className="col-sm-6 col-md-2-5 col-lg-2-5 unit"></div>
                                                                <div className="col-sm-6  col-md-6 col-lg-4  unit">
                                                                    <div className="inline-group">
                                                                        <label className="checkbox">
                                                                            <input
                                                                                checked={state.RecibirCartaPorte}
                                                                                onChange={(e) =>
                                                                                    setState({
                                                                                        ...state,
                                                                                        RecibirCartaPorte: e.target.checked,
                                                                                    })
                                                                                }
                                                                                native
                                                                                name="RecibirCartaPorte"
                                                                                type="checkbox"
                                                                                id="RecibirCartaPorte"
                                                                                value={state.RecibirCartaPorte}
                                                                            />
                                                                            <i />
                                      Recibir carta porte
                                    </label>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>*/}
                                                    <div className="form-footer" className="col-md-12">
                                                        <button
                                                            type="button"
                                                            onClick={(event) => {
                                                                event.stopPropagation();
                                                                setState({...state, agregar: "Agregar"});
                                                                $('.nav-tabs li ').removeClass('active');
                                                                $('.nav-tabs li').eq(0).addClass('active');
                                                                $('.tab-content div ').removeClass('in show');
                                                                $('#Listado').addClass('in show');
                                                            }}
                                                            className="btn btn-secondary secondary-btn">Cancelar
                                                        </button>
                                                        <button
                                                            type="submit"
                                                            className="btn btn-primary primary-btn">Aceptar
                                                        </button>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/*Fin de ejemplo*/}
                            </form>
                        </div>
                    </div>
                </div>
            </section>
            {/*Page Container End Here*/}
            {/*Rightbar Start Here*/}

            {/*Rightbar Start Here*/}
            <aside className="rightbar">
                <BarraLateralDerecha />
            </aside>
            {/*Rightbar End Here*/}
            {/*iCheck*/}
            {/*CHARTS*/}
            {/*Forms*/}
        </div>
    );
}

export default Clientes;
