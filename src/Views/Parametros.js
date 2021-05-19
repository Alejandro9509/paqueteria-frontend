import React, { useEffect } from "react";
import Cabecera from "../Components/Template/Cabecera";
import BarraLateralIzquierda from "../Components/Template/BarraLateralIzquierda";
import BarraLateralDerecha from "../Components/Template/BarraLateralDerecha";
import axios from "axios";
import $ from "jquery";

import Noty from 'noty';
import { FormControl, InputLabel, Select, TextField } from "@material-ui/core";
import { obtenerCodigoPostal } from "../Util/Contexts/CodigoPostalContext";
import { obtenerEstadosPais } from "../Util/Contexts/EstadosContext";
import { obtenerPaises } from "../Util/Contexts/PaisesContext";

function showSuccess(mensaje) {
    new Noty({
        type: "information",
        layout: "topCenter",
        text: mensaje,
        timeout: "3000"
    }).show()
}

window.jQuery = window.$ = $;

function Parametros() {
    const [dataPais, setDataPais] = React.useState([]);
    const [dataEstado, setDataEstado] = React.useState([]);
    const [dataCodigoPostal, setDataCodigoPostal] = React.useState([]);
    const [state, setState] = React.useState({
        RFC: "",
        registroFiscal: "",
        nombreFiscal: "",
        nombreComercial: "",
        regimenFiscal: "",
        retencionFiscal: "",
        curp: "",
        usuario: "",
        password: "",
        timbrar: false,
        apiKey: "",
        hash: "",
        idPais: 0,
        codigoPostal: 0,
        idEstado: 0,
        munipio: 0,
        localidad: 0,
        colonia: "",
        calle: "",
        RFCFiscal: "",
        blanco: "",
        telefono: "",
        height: window.innerHeight,
        CreadoPor: localStorage.getItem("UsuarioId"),
        ModificadoPor: localStorage.getItem("UsuarioId")

    })

    const headers = {
        "Content-Type": "application/json",
        //    'access-control-allow-origin': '*'
    };

    const handleAceptar = (e) => {
        e.preventDefault();
        var params = {
            m_sRFC: state.RFC,
            m_sRegistroFiscal: state.registroFiscal,
            m_sNombreFiscal: state.nombreFiscal,
            m_sNombreComercial: state.nombreComercial,
            m_sIdRegimenFiscal: state.regimenFiscal,
            m_nIdRetencionIva: state.retencionFiscal,
            m_sCURP: state.curp,
            m_sUsuario: state.usuario,
            m_sContrasenia: state.password,
            m_bTimbrarPruebas: state.timbrar,
            m_sApiKey: state.apiKey,
            m_sHashGMTGPS: state.hash,
            m_nIdPais: state.idPais,
            m_nIdCodigoPostal: state.codigoPostal,
            m_nIsEstado: state.idEstado,
            m_nIdMunicipio: state.munipio,
            m_nIdLocalidad: state.localidad,
            m_nIdColonia: state.colonia,
            m_sCalle: state.calle,
            m_sRFCFiscal: state.RFCFiscal,
            "": state.blanco,
            "m_sTelefonos": state.telefono,
            "CreadoPor": state.CreadoPor,
            "ModificadoPor": state.ModificadoPor
        }
        const url = `${process.env.REACT_APP_API_URL}/Pais/Modificar/` + state.idPais;
        axios.put(url, Object.assign({}, params), { headers }).then(respuesta => {
            showSuccess(respuesta.data)
            window.location.reload();
        }).catch(err => {
            console.log(err)
            showSuccess("err")
        });
    }

    const handleChange = (event) => {
        setState({
            ...state,
            [event.target.id]: event.target.value,
        });
    };

    const handleSelectPais = (event) => {
        setState({
            ...state,
            idPais: event.target.value,
        });
        getAllEstado(event.target.value);
    };

    useEffect(value => {
        if (localStorage.getItem("UsuarioId") === null || localStorage.getItem("UsuarioId") <= 0) {
            showSuccess("Es necesario iniciar sesion para acceder a este proceso");
            window.location.replace("login");
            return;
        }
        getAllPais();
        getAllCodigosPostales();
    }, []);

    function getAllPais() {
        obtenerPaises().then((respuesta) => {
            setDataPais(respuesta.data);
            getAllEstado(respuesta.data[0].m_nIdPais);
        });
    }

    function getAllEstado(id) {
        obtenerEstadosPais(id).then((respuesta) => {
            setDataEstado(respuesta.data);
        });
    }

    function getAllCodigosPostales() {
        obtenerCodigoPostal().then((respuesta) => {
            setDataCodigoPostal(respuesta.data);
        });
    }

    return (
        <div >

            <header className="topbar clearfix">
                <Cabecera titulo="Parámetros de Configuración" >
                    <div className="page-header">
                        <ul className="list-page-breadcrumb">
                            <li>
                                <a href="/Configuracion" className="color-mapeo">
                                    Configuración <i className="zmdi zmdi-chevron-right" />
                                </a>
                            </li>
                            <li className="active-page">Parámetros de Configuración</li>
                        </ul>
                    </div>
                </Cabecera>
            </header>

            {/*Leftbar Start Here*/}
            <aside className="iconic-leftbar">
                <BarraLateralIzquierda />
            </aside>
            {/*Leftbar End Here*/}

            {/*Page Container Start Here*/}
            <section className="main-container">
                <div className="container-fluid">

                    <form className="j-forms" onSubmit={handleAceptar}>
                        <div className="col-xs-12 col-sm-12 col-md-6">
                            <div className="widget-wrap">
                                <div className="row">
                                    <div className="widget-header">
                                        <h2>Datos Generales</h2>
                                    </div>
                                    <div className="widget-container">
                                        <div className="widget-content">
                                            <div className="col-xs-2-5 col-sm-4 col-md-4 unit">
                                                <div className="input">
                                                    <TextField variant="outlined" margin="dense" label="RFC"
                                                        onChange={handleChange}
                                                        className="form-control"
                                                        type="text"
                                                        pattern="[A-Z&Ñ]{3,4}[0-9]{2}(0[1-9]|1[012])(0[1-9]|[12][0-9]|3[01])[A-Z0-9]{2}[0-9A]"
                                                        title="Favor de introducir un RFC válido."
                                                        required
                                                        value={state.RFC}
                                                        id="RFC"
                                                    />
                                                </div>
                                            </div>

                                            <div className="col-xs-4 col-sm-4 col-md-4 unit">
                                                <div className="input">
                                                    <TextField variant="outlined" margin="dense" label="Registro Fiscal"
                                                        onChange={handleChange}
                                                        className="form-control"
                                                        type="text"
                                                        required
                                                        value={state.registroFiscal}
                                                        id="registroFiscal"
                                                    />
                                                </div>
                                            </div>

                                            <div className="col-sm-4 col-md-4 unit">
                                                <div className="input">
                                                    <TextField variant="outlined" margin="dense" label="Nombre Fiscal"
                                                        onChange={handleChange}
                                                        className="form-control"
                                                        type="text"
                                                        required
                                                        value={state.nombreFiscal}
                                                        id="nombreFiscal"
                                                    />
                                                </div>
                                            </div>

                                            <div className="col-sm-4 col-md-4 unit">
                                                <div className="input">
                                                    <TextField variant="outlined" margin="dense" label="Nombre Comercial"
                                                        onChange={handleChange}
                                                        className="form-control"
                                                        type="text"
                                                        required
                                                        value={state.nombreComercial}
                                                        id="nombreComercial"
                                                    />
                                                </div>
                                            </div>

                                            <div className=" col-sm-4 col-md-4 unit">
                                                <div className="input">
                                                    <label className="input select">
                                                        <FormControl fullWidth variant="outlined" margin="dense">
                                                            <InputLabel id="regimenFiscalLabel">Regimen Fiscal</InputLabel>
                                                            <Select
                                                                labelId="regimenFiscalLabel"
                                                                label="Regimen Fiscal"
                                                                className="form-control"
                                                                required
                                                                onChange={handleChange}
                                                                value={state.regimenFiscal}
                                                                id="regimenFiscal"
                                                            >
                                                                <option value="0">Por Definir</option>
                                                            </Select>
                                                        </FormControl>
                                                    </label>
                                                </div>
                                            </div>

                                            <div className="col-sm-4 col-md-4 unit">
                                                <div className="input">
                                                    <label className="input select">
                                                        <FormControl fullWidth variant="outlined" margin="dense">
                                                            <InputLabel id="retencionIVALabel">Retención IVA</InputLabel>
                                                            <Select
                                                                labelId="retencionIVALabel"
                                                                label="Retención IVA"
                                                                className="form-control"
                                                                required
                                                                onChange={handleChange}
                                                                value={state.retencionIVA}
                                                                id="retencionIVA"
                                                            >
                                                                <option value="0">Por Definir</option>
                                                            </Select>
                                                        </FormControl>
                                                    </label>
                                                </div>
                                            </div>

                                            <div className="col-sm-4 col-md-4 unit">
                                                <div className="input">
                                                    <TextField variant="outlined" margin="dense" label="CURP"
                                                        onChange={handleChange}
                                                        className="form-control"
                                                        type="text"
                                                        required
                                                        value={state.curp}
                                                        id="curp"
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>


                        <div className=" col-xs-12 col-sm-12 col-sm-12 col-md-6" >
                            <div className="widget-wrap ">
                                <div className="row">
                                    <div className="widget-header">
                                        <h2>Datos del Usuario</h2>
                                    </div>
                                    <div className="widget-container">
                                        <div className="widget-content">
                                            <div className="col-sm-4 col-md-4 unit">
                                                <div className="input">
                                                    <TextField variant="outlined" margin="dense" label="Usuario"
                                                        onChange={handleChange}
                                                        className="form-control"
                                                        type="text"
                                                        required
                                                        value={state.usuario}
                                                        id="usuario"
                                                    />
                                                </div>
                                            </div>

                                            <div className="col-md-4 unit">
                                                <div className="input">
                                                    <TextField variant="outlined" margin="dense" label="Contraseña"
                                                        onChange={handleChange}
                                                        className="form-control"
                                                        type="password"
                                                        required
                                                        value={state.password}
                                                        id="password"
                                                    />
                                                </div>
                                            </div>

                                            <div className="col-sm-4 col-md-2-5 unit">
                                                <div className="inline-group">
                                                    <label className="checkbox">
                                                        <input
                                                            onChange={handleChange}
                                                            native
                                                            name="timbrar"
                                                            type="checkbox"
                                                            value={state.timbrar}
                                                            id="timbrar"
                                                        />
                                                        <i />
                        Timbrar de prueba
                      </label>
                                                </div>
                                            </div>

                                            <div className="col-md-4 col-md-4 unit">
                                                <div className="input">
                                                    <TextField variant="outlined" margin="dense" label="API Key"
                                                        onChange={handleChange}
                                                        className="form-control"
                                                        type="text"
                                                        required
                                                        value={state.apiKey}
                                                        id="apiKey"
                                                    />
                                                </div>
                                            </div>

                                            <div className="col-md-4 col-md-4 unit">
                                                <div className="input">
                                                    <TextField variant="outlined" margin="dense" label="HASH GMTGPS"
                                                        onChange={handleChange}
                                                        className="form-control"
                                                        type="text"
                                                        required
                                                        value={state.hash}
                                                        id="hash"
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>


                        </div>
                        <div className="col-md-12">
                            <div className="widget-wrap">
                                <div className="row">
                                    <div className="widget-header">
                                        <h2>Domicilio Fiscal</h2>
                                    </div>
                                    <div className="widget-container">
                                        <div className="widget-content">
                                            <div className="col-md-6">
                                                <div className="col-xs-4 col-sm-4 col-md-4 unit">
                                                    <div className="input">
                                                        <label className="input select">
                                                            <FormControl fullWidth variant="outlined" margin="dense">
                                                                <InputLabel id="idPaisLabel">País</InputLabel>
                                                                <Select
                                                                    labelId="idPaisLabel"
                                                                    label="País"
                                                                    className="form-control"
                                                                    required
                                                                    onChange={handleSelectPais}
                                                                    value={state.idPais}
                                                                    id="idPais"
                                                                >
                                                                    {dataPais.length < 1 ? (
                                                                        <option value="none">País</option>
                                                                    ) : (
                                                                        dataPais.map((pais) => (
                                                                            <option
                                                                                key={pais.m_nIdPais}
                                                                                value={pais.m_nIdPais}
                                                                            >
                                                                                {pais.m_sPais}
                                                                            </option>
                                                                        ))
                                                                    )}
                                                                </Select>
                                                            </FormControl>
                                                        </label>
                                                    </div>
                                                </div>

                                                <div className="col-xs-4 col-sm-4 col-md-4 unit">
                                                    <label className="input select">
                                                        <FormControl fullWidth variant="outlined" margin="dense">
                                                            <InputLabel id="codigoPostalRemitenteLabel">Código Postal</InputLabel>
                                                            <Select
                                                                labelId="codigoPostalRemitenteLabel"
                                                                label="Código Postal"
                                                                className="form-control"
                                                                required
                                                                value={state.codigoPostalRemitente}
                                                                onChange={handleChange}
                                                                id="codigoPostalRemitente"
                                                            >
                                                                {dataCodigoPostal.map((codigoPostal) => (
                                                                    <option
                                                                        key={codigoPostal.m_nIdCP}
                                                                        value={codigoPostal.m_nIdCP}
                                                                    >
                                                                        {codigoPostal.m_sCP}
                                                                    </option>
                                                                ))}
                                                            </Select>
                                                        </FormControl>
                                                    </label>
                                                </div>

                                                <div className="col-xs-4 col-sm-4 col-md-4 unit">
                                                    <div className="input">
                                                        <label className="input select">
                                                            <FormControl fullWidth variant="outlined" margin="dense">
                                                                <InputLabel id="idEstadoLabel">Estado</InputLabel>
                                                                <Select
                                                                    labelId="idEstadoLabel"
                                                                    label="Estado"
                                                                    className="form-control"
                                                                    required
                                                                    onChange={handleChange}
                                                                    value={state.idEstado}
                                                                    id="idEstado"
                                                                >
                                                                    {dataEstado.length < 1 ? (
                                                                        <option value="none">Estados</option>
                                                                    ) : (
                                                                        dataEstado.map((estado) => (
                                                                            <option value={estado.m_nIdEstado}>
                                                                                {estado.m_sEstado}
                                                                            </option>
                                                                        ))
                                                                    )}
                                                                </Select>
                                                            </FormControl>
                                                        </label>
                                                    </div>
                                                </div>

                                                <div className="col-xs-4 col-md-4 col-lg-4 unit">
                                                    <div className="input">
                                                        <label className="input select">
                                                            <FormControl fullWidth variant="outlined" margin="dense">
                                                                <InputLabel id="municipioLabel">Municipio</InputLabel>
                                                                <Select
                                                                    labelId="municipioLabel"
                                                                    label="Municipio"
                                                                    className="form-control"
                                                                    required
                                                                    onChange={handleChange}
                                                                    value={state.municipio}
                                                                    id="municipio"
                                                                >
                                                                    {dataEstado.map((estado) => (
                                                                        <option
                                                                            key={estado.m_nIdEstado}
                                                                            value={estado.m_nIdEstado}
                                                                        >
                                                                            {estado.m_sEstado}
                                                                        </option>
                                                                    ))}
                                                                </Select>
                                                            </FormControl>
                                                        </label>
                                                    </div>
                                                </div>

                                                <div className="col-xs-4 col-md-4 col-lg-4  unit">
                                                    <div className="input">
                                                        <label className="input select">
                                                            <FormControl fullWidth variant="outlined" margin="dense">
                                                                <InputLabel id="localidadLabel">Localidad</InputLabel>
                                                                <Select
                                                                    labelId="localidadLabel"
                                                                    label="Localidad"
                                                                    className="form-control"
                                                                    required
                                                                    onChange={handleChange}
                                                                    value={state.localidad}
                                                                    id="localidad"
                                                                >
                                                                    {dataEstado.map((estado) => (
                                                                        <option
                                                                            key={estado.m_nIdEstado}
                                                                            value={estado.m_nIdEstado}
                                                                        >
                                                                            {estado.m_sEstado}
                                                                        </option>
                                                                    ))}
                                                                </Select>
                                                            </FormControl>
                                                        </label>
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="col-md-6">
                                                <div className="col-xs-4 col-md-4 col-lg-4  unit">
                                                    <div className="input">
                                                        <TextField variant="outlined" margin="dense" label="Colonia"
                                                            onChange={handleChange}
                                                            className="form-control"
                                                            type="text"
                                                            required
                                                            value={state.colonia}
                                                            id="colonia"
                                                        />
                                                    </div>
                                                </div>

                                                <div className="col-xs-4 col-md-4 col-lg-4  unit">
                                                    <div className="input">
                                                        <TextField variant="outlined" margin="dense" label="Calle"
                                                            onChange={handleChange}
                                                            className="form-control"
                                                            type="text"
                                                            required
                                                            value={state.calle}
                                                            id="calle"
                                                        />
                                                    </div>
                                                </div>

                                                <div className="col-xs-4 col-md-4 col-lg-4  unit">
                                                    <div className="input">
                                                        <TextField variant="outlined" margin="dense" label="RFC"
                                                            onChange={handleChange}
                                                            className="form-control"
                                                            type="text"
                                                            pattern="[A-Z&Ñ]{3,4}[0-9]{2}(0[1-9]|1[012])(0[1-9]|[12][0-9]|3[01])[A-Z0-9]{2}[0-9A]"
                                                            title="Favor de introducir un RFC válido."
                                                            required
                                                            value={state.RFCFiscal}
                                                            id="RFCFiscal"
                                                        />
                                                    </div>
                                                </div>

                                                <div className="col-xs-4 col-md-4 col-lg-4  unit">
                                                    <div className="input">
                                                        <TextField variant="outlined" margin="dense" label="Blanco"
                                                            onChange={handleChange}
                                                            className="form-control"
                                                            type="text"
                                                            required
                                                            value={state.blanco}
                                                            id="blanco"
                                                        />
                                                    </div>
                                                </div>

                                                <div className="col-xs-4 col-md-4 col-lg-4  unit">
                                                    <div className="input">
                                                        <TextField variant="outlined" margin="dense" label="Teléfono"
                                                            onChange={handleChange}
                                                            className="form-control"
                                                            type="text"
                                                            required
                                                            value={state.telefono}
                                                            id="telefono"
                                                        />
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="form-footer" className="col-md-12">
                            <button href="#Listado" role="tab" data-toggle="tab" className="btn btn-secondary secondary-btn">
                                Cancelar
              </button>
                            <button type="submit" className="btn btn-primary primary-btn">
                                Aceptar
              </button>
                        </div>
                    </form>
                </div>
            </section>
            {/*Page Container End Here*/}

            {/*Rightbar Start Here*/}
            <aside className="rightbar">
                <BarraLateralDerecha />
            </aside>
        </div>
    );
}

export default Parametros;
