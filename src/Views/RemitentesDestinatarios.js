import "../App.css";
import React, { useEffect, useState, setData, useMemo, Component } from "react";
import $ from "jquery";
import { obtenerMunicipiosByIdEstado } from "../Util/Contexts/MunicipiosContext";
import {
  obtenerCodigoPostalId,
  obtenerCodigosPostalesPorEstadoMunicipio,
} from "../Util/Contexts/CodigoPostalContext";
import Noty from "noty";
import {
  obtenerByIdZonaOperativa,
  obtenerZonaOperativaByIdCodigoPostal,
} from "../Util/Contexts/ZonaOperativaContext";
import {
  obtenerByIdZonaTarifa,
  obtenerZonaTarifaByIdCodigoPostal,
} from "../Util/Contexts/ZonaTarifaContext";
import Autocomplete from "@material-ui/lab/Autocomplete";
import TextField from "@material-ui/core/TextField";
import InputAdornment from "@material-ui/core/InputAdornment";
import IconButton from "@material-ui/core/IconButton";
import {
  actualizarRemitentesDestinatarios,
  obtenerRemitentesDestinatariosId,
} from "../Util/Contexts/RemitenteDestinatarioContext";
import { Dialog, DialogContent } from "@material-ui/core";
import ReplayIcon from "@material-ui/icons/Replay";
import SearchIcon from "@material-ui/icons/Search";
import FormControl from "@material-ui/core/FormControl";
import InputLabel from "@material-ui/core/InputLabel";
import Select from "@material-ui/core/Select";
import { obtenerCiudadId } from "../Util/Contexts/CiudadesContext";
import DialogTableRemDes from "./RemitenteDestinatario/DialogTableRemDes";
// window.jQuery = window.$ = $;
function showSuccess(mensaje) {
  new Noty({
    type: "information",
    layout: "topCenter",
    text: mensaje,
    timeout: "3000",
  }).show();
}

/**Props que se usan
 * handleDataChange={funcion} : función que regresa un objeto con los datos del remitente/destinatario actualizados. Se llama cada que se modifica un campo.
 * dataPadreConsulta={objeto} : objeto que contiene la respuesta del servicio embarqueById de donde se toman los datos para la consulta al ser embarque el componente padre.
 * dataEstados={list} : listado de estados.
 * dataCiudad={list} : listado de ciudades para origen/destino.
 * remitente=(boolean} : Indica que se usará para manejar datos de remitente. (opcional)
 * destinatario={boolean} : Indica que se usará para manejar datos de destinatario. (opcional)
 * dataRemitenteDestinatario={list} : Listado de Remitentes y destinatarios.
 * consulta={boolean} : Indica que los datos solo se setearan para consulta. Inhabilita los inputs. (opcional)
 * embarque={boolean} : Indica que el componente padre es un embarque (opcional).
 * mostrarZonas={boolean} : Para controlar si quiere que se muestren los inputs de zonas. False por default (opcional)
 * handleClickRemitenteDestinatario={funcion} : funcion que se llama cuando se clickea el input de Alias (opcional).
 * handleClickCiudad={funcion} : funcion que se llama cuando se clickea el input de origen/destino (opcional).
 * */
function RemitenteDestinatario(props) {
  const [dataRemitenteDestinatario, setDataRemitenteDestinatario] =
    React.useState([]);
  const [dataEstados, setDataEstados] = React.useState([]);
  const [dataCodigosPostales, setDataCodigosPostales] = React.useState([]);
  const [dataZonasOperativas, setDataZonasOperativas] = React.useState([]);
  const [dataZonasTarifa, setDataZonasTarifa] = React.useState([]);
  const [dataMunicipios, setDataMunicipios] = React.useState([]);
  const [state, setState] = React.useState({
    id: "",
    alias: "",
    nombre: "",
    RFC: "",
    domicilio: "",
    calle: "",
    numeroInt: "",
    numeroExt: "",
    colonia: "",
    estado: "",
    municipio: "",
    codigoPostal: "",
    correo: "",
    telefono: "",
    contacto: "",
    destino: "",
    origen: "",
    zonaOperativa: "",
    zonaTarifa: "",
    latitud: "",
    longitud: "",
    openDialog: false,
  });

  useEffect(
    (value) => {
      if (props.dataEstados.length > 0) {
        setDataEstados(props.dataEstados);
      }
    },
    [props.dataEstados]
  );

  /*useEffect(
    (value) => {
      if (props.dataRemitenteDestinatario.length > 0) {
        setDataRemitenteDestinatario(props.dataRemitenteDestinatario);
      }
    },
    [props.dataRemitenteDestinatario]
  );*/

  useEffect(
    (value) => {
      props.handleDataChange(state);
    },
    [state]
  );
  useEffect(
    (value) => {
      /**Para validar que hay una respuesta de donde tomar los datos*/
      if (!props.dataPadreConsulta) {
        return;
      }

      /**Le cambio el nombre el prop para no hacer tantos cambios a las referencias que ya había*/
      const { dataPadreConsulta: respuesta } = props;

      /**Se ocupa hacer la distincion de si es de recoleccion o embarque porque el nombre de las variables cambia*/
      /**Si es recoleccion o embarque y se es una respuesta de RecoleccionById*/
      if (
        (props.componentePadre === "Recoleccion" ||
          props.componentePadre === "Embarque") &&
        props.dataPadreConsulta.data.m_nIdRecoleccion > 0
      ) {
        if (props.remitente) {
          let estado =respuesta.data.m_nIdEstadoRemitente< 10 ? `0${respuesta.data.m_nIdEstadoRemitente}` :  respuesta.data.m_nIdEstadoRemitente
              setState((state) => {
                return {
                  ...state,
                  id: respuesta.data.m_nIdRemitente,
                  alias: respuesta.data.m_sAliasRemitente,
                  nombre: respuesta.data.m_sNombreRemitente,
                  RFC: respuesta.data.m_sRFCRemitente,
                  domicilio: respuesta.data.m_sDomicilioRemitente,
                  calle: respuesta.data.m_sCalleRemitente,
                  numeroInt: respuesta.data.m_sNoIntRemitente || 0,
                  numeroExt: respuesta.data.m_sNoExtRemitente,
                  colonia: respuesta.data.m_sColoniaRemitente,
                  estado: estado || 0,
                  municipio: respuesta.data.m_nIdCiudadRemitente,
                  correo: respuesta.data.m_sCorreoRemitente,
                  telefono: respuesta.data.m_sTelefonoRemitente,
                  contacto: respuesta.data.m_sContactoRemitente,
                };
              });
         
          obtenerMunicipiosByIdEstado(estado).then(({ data }) => {
            setDataMunicipios(data);
          });
          obtenerCodigoPostalId(respuesta.data.m_sIdCodigoPostalRemitente).then(
            (cp) => {
              setState((state) => {
                return {
                  ...state,
                  codigoPostal: {
                    m_nIdCP: cp.data.m_nIdCP,
                    m_sCP: cp.data.m_sCP,
                    m_sColonia: cp.data.m_sColonia,
                  },
                };
              });
            }
          );
          obtenerCiudadId(respuesta.data.m_nIdCiudadOrigen).then(({ data }) => {
            setState((state) => {
              return {
                ...state,
                origen: data,
              };
            });
          });

          if (!respuesta.data.m_bRecoleccionDiferenteDomicilio) {
            setState((state) => {
              return {
                ...state,
                latitud: respuesta.data.m_sLatitud || "",
                longitud: respuesta.data.m_sLongitud || "",
              };
            });
            obtenerByIdZonaOperativa(respuesta.data.m_nIdZonaOperativa).then(
              ({ data }) => {
                setState((state) => {
                  return {
                    ...state,
                    zonaOperativa: data,
                  };
                });
              }
            );
            obtenerByIdZonaTarifa(respuesta.data.m_nIdZonaTarifa).then(
              ({ data }) => {
                setState((state) => {
                  return {
                    ...state,
                    zonaTarifa: data,
                  };
                });
              }
            );
          }
        } else if (props.destinatario) {
          let estado = respuesta.data.m_nIdEstadoDestinatario< 10 ? `0${respuesta.data.m_nIdEstadoDestinatario}` :  respuesta.data.m_nIdEstadoDestinatario
            setState((state) => {
              return {
                ...state,
                id: respuesta.data.m_nIdDestinatario,
                alias: respuesta.data.m_sAliasDestinatario,
                nombre: respuesta.data.m_sNombreDestinatario,
                RFC: respuesta.data.m_sRFCDestinatario,
                domicilio: respuesta.data.m_sDomicilioDestinatario,
                calle: respuesta.data.m_sCalleDestinatario,
                numeroInt: respuesta.data.m_sNoIntDestinatario || 0,
                numeroExt: respuesta.data.m_sNoExtDestinatario,
                colonia: respuesta.data.m_sColoniaDestinatario,
                estado: estado || 0,
                municipio: respuesta.data.m_nIdCiudadDestinatario,
                correo: respuesta.data.m_sCorreoDestinatario,
                telefono: respuesta.data.m_sTelefonoDestinatario,
                contacto: respuesta.data.m_sContactoDestinatario,
                latitud: respuesta.data.m_sLatitud || "",
                longitud: respuesta.data.m_sLongitud || "",
              };
            });
      
          obtenerMunicipiosByIdEstado(estado).then(({ data }) => {
            setDataMunicipios(data);
          });
          obtenerCodigoPostalId(
            respuesta.data.m_sIdCodigoPostalDestinatario
          ).then((cp) => {
            setState((state) => {
              return {
                ...state,
                codigoPostal: {
                  m_nIdCP: cp.data.m_nIdCP,
                  m_sCP: cp.data.m_sCP,
                  m_sColonia: cp.data.m_sColonia,
                },
              };
            });
          });
          obtenerCiudadId(respuesta.data.m_nIdCiudadDestino).then(
            ({ data }) => {
              setState((state) => {
                return {
                  ...state,
                  destino: data,
                };
              });
            }
          );

          if (!respuesta.data.m_bEntregaDiferenteDomicilio) {
            obtenerByIdZonaOperativa(
              respuesta.data.m_nIdZonaOperativaEntrega
            ).then(({ data }) => {
              console.log("data que setea")
              console.log(data)
              setState((state) => {
                return {
                  ...state,
                  zonaOperativa: data,
                };
              });
            });
            obtenerByIdZonaTarifa(respuesta.data.m_nIdZonaTarifaEntrega).then(
              ({ data }) => {
                setState((state) => {
                  return {
                    ...state,
                    zonaTarifa: data,
                  };
                });
              }
            );
          }
        }

        /**Si es embarque y volvemos a verificar que haya respuesta*/
      } else if (
        props.componentePadre === "Embarque" &&
        props.dataPadreConsulta.data.m_nIdEmbarque > 0
      ) {
        /**Si se van a mostrar datos de remitente*/
        if (props.remitente) {
          let estado =respuesta.data.m_nIdEstadoRemitente< 10 ? `0${respuesta.data.m_nIdEstadoRemitente}` :  respuesta.data.m_nIdEstadoRemitente
              setState((state) => {
                return {
                  ...state,
                  nombre: respuesta.data.m_sNombreRemitente,
                  RFC: respuesta.data.m_sRFCRemitente,
                  domicilio: respuesta.data.m_sDomicilioRemitente,
                  ciudad: respuesta.data.m_nCiudadRemitente,
                  correo: respuesta.data.m_sCorreoRemitente,
                  telefono: respuesta.data.m_sTelefonoRemitente,
                  contacto: respuesta.data.m_sContactoRemitente,
                  id: respuesta.data.m_nIdRemitente,
                  alias: respuesta.data.m_sAliasRemitente,
                  calle: respuesta.data.m_sCalleRemitente,
                  numeroInt: respuesta.data.m_sNoIntRemitente || 0,
                  numeroExt: respuesta.data.m_sNoExtRemitente,
                  colonia: respuesta.data.m_sColoniaRemitente,
                  estado: estado || 0,
                  municipio: respuesta.data.m_sMunicipioRemitente,
                };
              });
         
          obtenerMunicipiosByIdEstado(estado).then(({ data }) => {
            setDataMunicipios(data);
          });
          obtenerCodigoPostalId(respuesta.data.m_nIdCodigoPostalRemitente).then(
            (cp) => {
              setState((state) => {
                return {
                  ...state,
                  codigoPostal: {
                    m_nIdCP: cp.data.m_nIdCP,
                    m_sCP: cp.data.m_sCP,
                    m_sColonia: cp.data.m_sColonia,
                  },
                };
              });
            }
          );
          obtenerCiudadId(respuesta.data.m_nIdCiudadOrigen).then(({ data }) => {
            setState((state) => {
              return {
                ...state,
                origen: data,
              };
            });
          });
          /**Si se van a mostrar datos de destinatario*/
        } else if (props.destinatario) {

          let estado =  respuesta.data.m_nIdEstadoDestinatario< 10 ? `0${respuesta.data.m_nIdEstadoDestinatario}` :  respuesta.data.m_nIdEstadoDestinatario;
            setState((state) => {
              return {
                ...state,
                nombre: respuesta.data.m_sNombreDestinatario,
                RFC: respuesta.data.m_sRFCDestinatario,
                domicilio: respuesta.data.m_sDomicilioDestinatario,
                ciudad: respuesta.data.m_nIdCIudadDestinatario,
                correo: respuesta.data.m_sCorreoDestinatario,
                telefono: respuesta.data.m_sTelefonoDestinatario,
                contacto: respuesta.data.m_sContactoDestinatario,
                id: respuesta.data.m_nIdDestinatario,
                alias: respuesta.data.m_sAliasDestinatario,
                estado: estado || 0,
                calle: respuesta.data.m_sCalleDestinatario,
                numeroInt: respuesta.data.m_sNoIntDestinatario || 0,
                numeroExt: respuesta.data.m_sNoExtDestinatario,
                municipio: respuesta.data.m_sMunicipioDestinatario,
                colonia: respuesta.data.m_sColoniaDestinatario,
              };
            });
          obtenerMunicipiosByIdEstado(estado).then(({ data }) => {
            setDataMunicipios(data);
          });
          obtenerCodigoPostalId(
            respuesta.data.m_nIdCodigoPostalDestinatario
          ).then((cp) => {
            setState((state) => {
              return {
                ...state,
                codigoPostal: {
                  m_nIdCP: cp.data.m_nIdCP,
                  m_sCP: cp.data.m_sCP,
                  m_sColonia: cp.data.m_sColonia,
                },
              };
            });
            obtenerZonaOperativaByIdCodigoPostal(cp.data.m_sCP).then(
              ({ data }) => {
                setDataZonasOperativas(data);
              }
            );
            obtenerZonaTarifaByIdCodigoPostal(cp.data.m_sCP).then(
              ({ data }) => {
                setDataZonasTarifa(data);
              }
            );
          });
          obtenerCiudadId(respuesta.data.m_nIdCiudadDestino).then(
            ({ data }) => {
              setState((state) => {
                return {
                  ...state,
                  destino: data,
                };
              });
            }
          );

          if (respuesta.data.EntregarMismoDomicilio) {
            
            setState((state) => {
              return {
                ...state,
                latitud: respuesta.data.m_sLatitud || "",
                longitud: respuesta.data.m_sLongitud || "",
              };
            });
            obtenerByIdZonaOperativa(respuesta.data.m_nIdZonaOperativa).then(
              ({ data }) => {
                setState((state) => {
                  return {
                    ...state,
                    zonaOperativa: data,
                  };
                });
              }
            );
            obtenerByIdZonaTarifa(respuesta.data.m_nIdZonaTarifa).then(
              ({ data }) => {
                setState((state) => {
                  return {
                    ...state,
                    zonaTarifa: data,
                  };
                });
              }
            );
          }
        }
      }
    },
    [props.dataPadreConsulta]
  );

  const handleChange = (event) => {

    event.preventDefault();
    setState((state) => {
      return {
        ...state,
        [event.target.name]: event.target.value,
      };
    });
    if (event.target.name === "estado") {
      obtenerMunicipiosByIdEstado(event.target.value).then(({ data }) => {
        setDataMunicipios(data);
      });
    }
  };

  const handleChangeAutocomplete = (input, newValue) => {
if(input=="codigoPostal"){
  obtenerZonaOperativaByIdCodigoPostal(newValue.m_sCP).then(
    ( zonaOperativa ) => {
      obtenerZonaTarifaByIdCodigoPostal(newValue.m_sCP).then(
          ( zonaTarifa ) => {
            setState((state) => ({
              ...state,
              zonaOperativa: zonaOperativa.data.length !== 0 ? zonaOperativa.data[0] : null,
              zonaTarifa: zonaTarifa.data.length !== 0  ? zonaTarifa.data[0] : null
            }));
          }
      );

    }
);
  
}

     setState(() => ({
      ...state,
      [input]: newValue,
    }));
    
  };

  const handleClickCodigosPostalesInput = (input) => {
    obtenerCodigosPostalesPorEstadoMunicipio(
      state.estado,
      state.municipio
    ).then(({ data }) => {
      setDataCodigosPostales(data);
    });
  };

  const handleClickZona = () => {
    if (state.codigoPostal) {
      obtenerZonaOperativaByIdCodigoPostal(state.codigoPostal.m_sCP).then(
        ({ data }) => {
          setDataZonasOperativas(data);
        }
      );
      obtenerZonaTarifaByIdCodigoPostal(state.codigoPostal.m_sCP).then(
        ({ data }) => {
          setDataZonasTarifa(data);
        }
      );
    }
  };

  const handleClickModal = (event) => {
    setState({ ...state, openDialog: true });
  };

  const handleChangeAutoCompleteRemitenteDestinatario = (row) => {
    let estado = row.data.m_nIdEstado;


      obtenerMunicipiosByIdEstado(estado).then(({ data }) => {
        setDataMunicipios(data);
      });
      obtenerZonaOperativaByIdCodigoPostal(row.data.m_sCodigoPostal).then(
          ( zonaOperativa ) => {
            obtenerZonaTarifaByIdCodigoPostal(row.data.m_sCodigoPostal).then(
                ( zonaTarifa ) => {
                  setState((state) => ({
                    ...state,
                    id: row.data.m_nIdRemitenteDestinatario,
                    alias: row.data.m_sAlias,
                    nombre: row.data.m_sNombre,
                    RFC: row.data.m_sRFC,
                    domicilio: row.data.m_sDomicilio || "No especificado",
                    codigoPostal:
                        row.data.m_nIdCP != 0
                            ? {
                              m_nIdCP: row.data.m_nIdCP,
                              m_sCP: row.data.m_sCodigoPostal,
                              m_sColonia: row.data.m_sColonia,
                            }
                            : "",
                    estado: estado || "",
                    municipio: row.data.m_nIdMunicipio || "",
                    correo: row.data.m_sCorreoElectronico || "",
                    telefono: row.data.m_sTelefono || 0,
                    contacto: row.data.m_sContacto || row.data.m_sNombre,
                    calle: row.data.m_sCalle || "No especificado",
                    municipioTexto: row.data.m_sMunicipio || "No especificado",
                    numeroExt: row.data.m_sNoExterior || 0,
                    numeroInt: row.data.m_sNoInterior || 0,
                    colonia: row.data.m_sColonia || "No especificado",
                    latitud: row.data.m_sLatitud,
                    longitud: row.data.m_sLongitud,
                    origen: zonaTarifa.data.length !== 0  ? {m_nIdCiudad: zonaTarifa.data[0].m_nIdSucursal, m_sCiudad: zonaTarifa.data[0].m_sSucursal} : null,
                    destino: zonaTarifa.data.length !== 0  ? {m_nIdCiudad: zonaTarifa.data[0].m_nIdSucursal, m_sCiudad: zonaTarifa.data[0].m_sSucursal} : null,
                    openDialog: false,
                    zonaOperativa: zonaOperativa.data.length !== 0 ? zonaOperativa.data[0] : null,
                    zonaTarifa: zonaTarifa.data.length !== 0  ? zonaTarifa.data[0] : null
                  }));

                  if (zonaOperativa.data.length === 0){
                    if (props.remitente){
                      showSuccess("El codigo postal del remitente no está registrado en ninguna zona operativa.")
                    }else if (props.destinatario){
                      showSuccess("El codigo postal del destinatario no está registrado en ninguna zona operativa.")
                    }
                  }
                  if (zonaTarifa.data.length === 0){
                    if (props.remitente){
                      showSuccess("El codigo postal del remitente no está registrado en ninguna zona de tarifa.")
                    }else if (props.destinatario){
                      showSuccess("El codigo postal del destinatario no está registrado en ninguna zona de tarifa.")
                    }
                  }
                }
            );

          }
      );


    
  };
  const dialogVisible = (isVisible) => {
    setState(() => ({
      ...state,
      openDialog: isVisible,
    }));
  };
  return (
    <div className="widget-content">

        <Dialog
          open={state.openDialog}
          onClose={() => setState({ ...state, openDialog: false })}
          fullWidth
          maxWidth="md"
        >
          <DialogContent>
            <DialogTableRemDes
              dialogVisible={dialogVisible}
              openDialog={state.openDialog}
              handleChangeAutoCompleteRemitenteDestinatario={handleChangeAutoCompleteRemitenteDestinatario}
            />
          </DialogContent>
        </Dialog>
      
      <div className="col-md-6">
        <div className="col-sm-12 col-md-12    unit">
          <div className="input">
            <TextField
              label={"Alias (Nombre)"}
              margin="dense"
              variant="outlined"
              required
              disabled={props.consulta}
              value={state.nombre}
              placeholder={"Alias (Nombre)"}
              InputLabelProps={{ shrink: true }}
              InputProps={{
                style: {
                  height: "33px",
                  fontSize: "14px",
                },
                type: "search",
                disableUnderline: true,
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      disabled={props.consulta}
                      padding="0px"
                      style={{
                        paddingRight: "0px",
                      }}
                      onClick={handleClickModal}
                    >
                      <SearchIcon
                        style={{
                          color: "#F9A03E",
                          fontSize: 32,
                          paddingInlineEnd: 0,
                          paddingRight: 0,
                          paddingBlockEnd: 0,
                          paddingLeft: 0,
                          paddingBlock: 0,
                          cursor:"pointer"
                        }}
                      />
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />
          </div>
        </div>
        {/*<div className="col-md-2">
          <IconButton
            style={{
              padding: "0px",
            }}
            disabled={props.consulta}
            onClick={() => {
              actualizarRemitentesDestinatarios().then(({ data }) => {
                setDataRemitenteDestinatario(data);
              });
            }}
          >
            <ReplayIcon
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
        </div>*/}

        <div className="col-sm-12 col-md-12 unit">
          <div className="input">
            <TextField
              variant="outlined"
              margin="dense"
              onChange={handleChange}
              className="form-control"
              type="text"
              label="RFC"
              pattern="[A-Z&Ñ]{3,4}[0-9]{2}(0[1-9]|1[012])(0[1-9]|[12][0-9]|3[01])[A-Z0-9]{2}[0-9A]"
              title="Favor de introducir un RFC válido."
              required
              fullWidth
              value={state.RFC}
              disabled={props.consulta}
              name="RFC"
            />
          </div>
        </div>

        <div className="col-sm-12 col-md-12 unit">
          <div className="input">
            <TextField
              variant="outlined"
              margin="dense"
              onChange={handleChange}
              className="form-control"
              type="text"
              required
              label="Domicilio"
              value={state.domicilio}
              disabled={props.consulta}
              name="domicilio"
            />
          </div>
        </div>

        <div className="col-sm-12 col-md-12 unit">
          <div className="input">
            <TextField
              variant="outlined"
              margin="dense"
              onChange={handleChange}
              className="form-control"
              type="text"
              required
              label="Calle"
              value={state.calle}
              disabled={props.consulta}
              name="calle"
            />
          </div>
        </div>

        <div className="col-sm-12 col-md-12 unit">
          <div className="input">
            <TextField
              variant="outlined"
              margin="dense"
              onChange={handleChange}
              className="form-control"
              type="text"
              label="Número interior"
              value={state.numeroInt}
              disabled={props.consulta}
              name="numeroInt"
            />
          </div>
        </div>

        <div className="col-sm-12 col-md-12 unit">
          <div className="input">
            <TextField
              variant="outlined"
              margin="dense"
              onChange={handleChange}
              className="form-control"
              type="text"
              label="Número exterior"
              value={state.numeroExt}
              disabled={props.consulta}
              name="numeroExt"
            />
          </div>
        </div>

        <div className="col-sm-12 col-md-12 unit">
          <div className="input">
            <TextField
              variant="outlined"
              margin="dense"
              onChange={handleChange}
              className="form-control"
              type="text"
              required
              label="Colonia"
              value={state.colonia}
              disabled={props.consulta}
              name="colonia"
            />
          </div>
        </div>

        <div className="col-sm-12 col-md-12  unit">
          <label className="input select">
            <FormControl fullWidth variant="outlined" margin="dense" required>
              <InputLabel id="idEstadoLabel">Estado</InputLabel>
              <Select
                fullWidth
                labelId="idEstadoLabel"
                label="Estado"
                className="form-control"
                value={state.estado}
                onChange={handleChange}
                name="estado"
                disabled={props.consulta}
              >
                {dataEstados.map((estado) => (
                  <option key={estado.m_nIdEstado} value={estado.m_nIdEstado}>
                    {estado.m_sEstado}
                  </option>
                ))}
              </Select>
            </FormControl>
          </label>
        </div>
      </div>
      <div className="col-md-6">
        <div className="col-sm-12 col-md-12 unit">
          <FormControl
            className="input select"
            fullWidth
            variant="outlined"
            margin="dense"
            required
          >
            <InputLabel id="idMunicipioLabel">Municipio</InputLabel>
            <Select
              fullWidth
              labelId={"idMunicipioLabel"}
              label={"Municipio"}
              className="form-control"
              value={state.municipio}
              onChange={handleChange}
              name="municipio"
              disabled={props.consulta}
              InputProps={{ name: "municipio" }}
            >
              {dataMunicipios.map((municipio) => (
                <option
                  key={municipio.m_sCodigoMunicipio}
                  value={municipio.m_sCodigoMunicipio}
                >
                  {municipio.m_sMunicipio}
                </option>
              ))}
            </Select>
          </FormControl>
        </div>

        <div className="col-sm-12 col-md-12 unit">
          <div className="input">
            <Autocomplete
              freeSolo
              onChange={(event, newValue) =>
                handleChangeAutocomplete("codigoPostal", newValue)
              }
              value={state.codigoPostal}
              disabled={props.consulta}
              name="codigoPostal"
              disableClearable
              forcePopupIcon={false}
              options={dataCodigosPostales}
              getOptionLabel={(option) =>
                option ? `${option.m_sCP} - ${option.m_sColonia}` : ""
              }
              style={{
                transform: "translate(14px, 10px) scale(1) !important",
              }}
              renderInput={(params) => (
                <div>
                  <TextField
                    label="Código Postal"
                    margin="dense"
                    variant="outlined"
                    onClick={(e) =>
                      handleClickCodigosPostalesInput("codigoPostal")
                    }
                    required
                    {...params}
                  />
                </div>
              )}
            />
          </div>
        </div>

        <div className="col-sm-12 col-md-12 unit">
          <div className="input">
            <TextField
              variant="outlined"
              margin="dense"
              label="Correo Electrónico"
              onChange={handleChange}
              className="form-control"
              type="email"
              required
              value={state.correo}
              disabled={props.consulta}
              name="correo"
            />
          </div>
        </div>

        <div className="col-sm-12 col-md-12 unit">
          <div className="input">
            <TextField
              variant="outlined"
              margin="dense"
              onChange={handleChange}
              className="form-control"
              type="text"
              label="Teléfono"
              required
              value={state.telefono}
              disabled={props.consulta}
              name="telefono"
            />
          </div>
        </div>

        <div className="col-sm-12 col-md-12 unit">
          <div className="input">
            <TextField
              variant="outlined"
              margin="dense"
              onChange={handleChange}
              className="form-control"
              type="text"
              required
              label="Contacto"
              value={state.contacto}
              disabled={props.consulta}
              name="contacto"
            />
          </div>
        </div>

        {props.remitente && (
          <div className="col-sm-12 col-md-12 unit">
            <div className="input">
              <Autocomplete
                freeSolo
                onChange={(event, newValue) =>
                  handleChangeAutocomplete("origen", newValue)
                }
                value={state.origen}
                disabled={props.consulta}
                id="origenRemitente"
                name="origenRemitente"
                disableClearable
                forcePopupIcon={false}
                options={props.dataCiudad}
                getOptionLabel={(option) => option.m_sCiudad || ""}
                style={{
                  transform: "translate(14px, 10px) scale(1) !important",
                }}
                renderInput={(params) => (
                  <div>
                    <TextField
                      label="Origen"
                      margin="dense"
                      variant="outlined"
                      required
                      onClick={props.handleClickCiudad}
                      {...params}
                    />
                  </div>
                )}
              />
            </div>
          </div>
        )}

        {props.destinatario && (
          <div className="col-sm-12 col-md-12  unit">
            <div className="input">
              <Autocomplete
                freeSolo
                onChange={(event, newValue) =>
                  handleChangeAutocomplete("destino", newValue)
                }
                value={state.destino}
                disabled={props.consulta}
                destino="destino"
                disableClearable
                forcePopupIcon={false}
                options={props.dataCiudad}
                getOptionLabel={(option) => option.m_sCiudad || ""}
                variant="outlined"
                style={{
                  transform: "translate(14px, 10px) scale(1) !important",
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
                      onClick={props.handleClickCiudad}
                    />
                  </div>
                )}
              />
            </div>
          </div>
        )}

        {props.mostrarZonas && (
          <div className="col-sm-12 col-md-12 unit">
            <div className="input">
              <Autocomplete
                value={state.zonaOperativa}
                freeSolo
                onChange={(event, newValue) =>
                  handleChangeAutocomplete("zonaOperativa", newValue)
                }
                id="zonaOperativa"
                disableClearable
                forcePopupIcon={false}
                options={dataZonasOperativas}
                disabled={props.consulta}
                getOptionLabel={(option) =>
                  option
                    ? option.m_sCodigoZona || "Código Postal sin zona asignada"
                    : ""
                }
                variant="outlined"
                name={"zonaOperativa"}
                style={{
                  transform: "translate(14px, 10px) scale(1) !important",
                }}
                renderInput={(params) => (
                  <TextField
                    variant="outlined"
                    label="Zona Operativa"
                    margin="dense"
                    required={
                      !state.diferenteEntrega && !state.entregaEnSucursal
                    }
                    onClick={() => handleClickZona()}
                    {...params}
                  />
                )}
              />
            </div>
          </div>
        )}
        {props.mostrarZonas && (
          <div className="col-sm-12 col-md-12 unit">
            <div className="input">
              <Autocomplete
                value={state.zonaTarifa}
                freeSolo
                onChange={(event, newValue) =>
                  handleChangeAutocomplete("zonaTarifa", newValue)
                }
                id="zonaTarifa"
                disableClearable
                forcePopupIcon={false}
                options={dataZonasTarifa}
                disabled={props.consulta}
                getOptionLabel={(option) =>
                  option
                    ? option.m_sCodigoZona || "Código Postal sin zona asignada"
                    : ""
                }
                variant="outlined"
                name={"zonaTarifa"}
                style={{
                  transform: "translate(14px, 10px) scale(1) !important",
                }}
                renderInput={(params) => (
                  <TextField
                    variant="outlined"
                    label="Zona Tarifa"
                    margin="dense"
                    required={
                      !state.diferenteEntrega && !state.entregaEnSucursal
                    }
                    onClick={handleClickZona}
                    {...params}
                  />
                )}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default RemitenteDestinatario;
