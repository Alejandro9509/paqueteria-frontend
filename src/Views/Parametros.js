import React, { useEffect } from "react";
import Cabecera from "../Components/Template/Cabecera";
import BarraLateralIzquierda from "../Components/Template/BarraLateralIzquierda";
import BarraLateralDerecha from "../Components/Template/BarraLateralDerecha";
import axios from "axios";
import $ from "jquery";
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
    CreadoPor:localStorage.getItem("UsuarioId"),
    ModificadoPor:localStorage.getItem("UsuarioId")

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
    console.log(params)
    const url = `${process.env.REACT_APP_API_URL}/Pais/Modificar/` + state.idPais;
    axios.put(url, Object.assign({}, params), { headers }).then(respuesta => {
      alert(respuesta.data)
      window.location.reload();
    }).catch(err => {
      console.log(err)
      alert("err")
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
    if (localStorage.getItem("UsuarioId") === null || localStorage.getItem("UsuarioId") <= 0)
    {
      alert("Es necesario iniciar sesion para acceder a este proceso");
      window.location.replace("login");
      return;
    }
    getAllPais();
    getAllCodigosPostales();
  }, []);

  function getAllPais() {
    const url = `${process.env.REACT_APP_API_URL}/Pais/GetListado`;
    axios.get(url, { headers }).then((respuesta) => {
      setDataPais(respuesta.data);
      getAllEstado(respuesta.data[0].m_nIdPais);
    });
  }

  function getAllEstado(id) {
    const url = `${process.env.REACT_APP_API_URL}/Estados/ByPais/${id}`;
    axios.get(url, { headers }).then((respuesta) => {
      setDataEstado(respuesta.data);
    });
  }

  function getAllCodigosPostales() {
    const url = `${process.env.REACT_APP_API_URL}/CodigoPostal/GetListado`;
    axios.get(url, { headers }).then((respuesta) => {
      setDataCodigoPostal(respuesta.data);
    });
  }

  return (
    <div>
      <header className="topbar clearfix">
        <Cabecera />
      </header>

      {/*Leftbar Start Here*/}
      <aside className="iconic-leftbar" style={{ minHeight: state.height }}>
        <BarraLateralIzquierda />
      </aside>
      {/*Leftbar End Here*/}

      {/*Page Container Start Here*/}
      <section className="main-container">
        <div className="container-fluid">
          <div className="page-header filled full-block light">
            <div className="row">
              <div className="col-md-6 col-sm-6">
                <h2>Parámetros de Configuración</h2>
              </div>
              <div className="col-md-6 col-sm-6">
                <ul className="list-page-breadcrumb">
                  <li>
                    <a href="/Configuracion" className="color-mapeo">
                      Configuración <i className="zmdi zmdi-chevron-right" />
                    </a>
                  </li>
                  <li className="active-page">Parámetros de Configuración</li>
                </ul>
              </div>
            </div>
          </div>

          <form className="j-forms" onSubmit={handleAceptar}>
            <div className="widget-wrap col-xs-12 col-sm-12 col-md-5" style={{ width: "48%" }}>
              <div className="widget-header">
                <h2>Datos Generales</h2>
              </div>
              <div className="widget-container">
                <div className="widget-content">
                  <div className="col-xs-2-5 col-sm-4 col-md-4 unit">
                    <label className="label">RFC</label>
                    <div className="input">
                      <input
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
                    <label className="label">Registro Fiscal</label>
                    <div className="input">
                      <input
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
                    <label className="label">Nombre Fiscal</label>
                    <div className="input">
                      <input
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
                    <label className="label">Nombre Comercial</label>
                    <div className="input">
                      <input
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
                    <label className="label">Regimen Fiscal</label>
                    <div className="input">
                      <label className="input select">
                        <select
                          className="form-control"
                          required
                          onChange={handleChange}
                          value={state.regimenFiscal}
                          id="regimenFiscal"
                        >
                          <option value="0">Por Definir</option>
                        </select>
                        <i></i>
                      </label>
                    </div>
                  </div>

                  <div className="col-sm-4 col-md-4 unit">
                    <label className="label">Retención IVA</label>
                    <div className="input">
                      <label className="input select">
                        <select
                          className="form-control"
                          required
                          onChange={handleChange}
                          value={state.retencionIVA}
                          id="retencionIVA"
                        >
                          <option value="0">Por Definir</option>
                        </select>
                        <i></i>
                      </label>
                    </div>
                  </div>

                  <div className="col-sm-4 col-md-4 unit">
                    <label className="label">CURP</label>
                    <div className="input">
                      <input
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

            <div className="col-md-12" style={{ width: "4%" }}></div>

            <div className="widget-wrap  col-xs-12 col-sm-12 col-sm-12 col-md-5" style={{ width: "48%" }}>
              <div className="widget-header">
                <h2>Datos del Usuario</h2>
              </div>
              <div className="widget-container">
                <div className="widget-content">
                  <div className="col-sm-4 col-md-4 unit">
                    <label className="label">Usuario</label>
                    <div className="input">
                      <input
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
                    <label className="control-label">Contraseña</label>
                    <div className="input">
                      <input
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
                    <label className="label">API Key</label>
                    <div className="input">
                      <input
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
                    <label className="label">HASH GMTGPS</label>
                    <div className="input">
                      <input
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

            <div className="widget-wrap col-md-12">
              <div className="widget-header">
                <h2>Domicilio Fiscal</h2>
              </div>
              <div className="widget-container">
                <div className="widget-content">
                  <div className="col-md-6">
                    <div className="col-xs-4 col-sm-4 col-md-4 unit">
                      <label className="label">País</label>
                      <div className="input">
                        <label className="input select">
                          <select
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
                          </select>
                          <i></i>
                        </label>
                      </div>
                    </div>

                    <div className="col-xs-4 col-sm-4 col-md-4 unit">
                      <label className="label">Código Postal</label>
                      <label className="input select">
                        <select
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
                        </select>
                        <i className="fa fa-arrow-down" />
                      </label>
                    </div>

                    <div className="col-xs-4 col-sm-4 col-md-4 unit">
                      <label className="label">Estado</label>
                      <div className="input">
                        <label className="input select">
                          <select
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
                          </select>
                          <i></i>
                        </label>
                      </div>
                    </div>

                    <div className="col-xs-4 col-md-4 col-lg-4 unit">
                      <label className="label">Municipio</label>
                      <div className="input">
                        <label className="input select">
                          <select
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
                          </select>
                          <i></i>
                        </label>
                      </div>
                    </div>

                    <div className="col-xs-4 col-md-4 col-lg-4  unit">
                      <label className="label">Localidad</label>
                      <div className="input">
                        <label className="input select">
                          <select
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
                          </select>
                          <i></i>
                        </label>
                      </div>
                    </div>
                  </div>

                  <div className="col-md-6">
                    <div className="col-xs-4 col-md-4 col-lg-4  unit">
                      <label className="label">Colonia</label>
                      <div className="input">
                        <input
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
                      <label className="label">Calle</label>
                      <div className="input">
                        <input
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
                      <label className="label">RFC</label>
                      <div className="input">
                        <input
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
                      <label className="label">Blanco</label>
                      <div className="input">
                        <input
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
                      <label className="label">Teléfono</label>
                      <div className="input">
                        <input
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

            <div className="form-footer" className="col-md-12">
              <button className="btn btn-secondary secondary-btn">
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
