import "../App.css";
import React, { useEffect, useState, setData, useMemo, Component } from "react";
import { obtenerMunicipiosByIdEstado } from "../Util/Contexts/MunicipiosContext";
import {
  obtenerCodigosPostalesPorEstadoMunicipio,
} from "../Util/Contexts/CodigoPostalContext";
import Noty from "noty";
import {
  obtenerByIdZonaOperativa, obtenerZonaOperativaByIdCodigoPostal
} from "../Util/Contexts/ZonaOperativaContext";
import {
  obtenerZonaTarifaByIdCodigoPostal,
} from "../Util/Contexts/ZonaTarifaContext";
import Autocomplete from '@mui/material/Autocomplete';
import TextField from "@mui/material/TextField";
import InputAdornment from "@mui/material/InputAdornment";
import IconButton from "@mui/material/IconButton";
import { Dialog, DialogContent, Grid } from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import { obtenerCiudadId } from "../Util/Contexts/CiudadesContext";
import DialogTableRemDes from "./RemitenteDestinatario/DialogTableRemDes";
import DialogCreateRemDes from "./RemitenteDestinatario/DialogCreateRemDes";
function showSuccess(mensaje) {
  new Noty({
    type: "information",
    layout: "topCenter",
    text: mensaje,
    timeout: "5000",
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
    estadoTexto: "",
    paisTexto: "",
    municipio: "",
    municipioTexto: "",
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
    createDialog: false
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

  useEffect((value)=>{
  setState({
    ...state,
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
    estadoTexto: "",
    paisTexto: "",
    municipio: "",
    municipioTexto: "",
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
    createDialog: false
  })
  },[props.limpiarRemDes])

  const mostrarDatosRemitenteRecoleccionById = (respuesta) => {
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
        codigoPostal: {
          m_nIdCP: respuesta.data.m_sIdCodigoPostalRemitente,
          m_sCP: respuesta.data.m_sCodigoPostalRemitente || "No especificado",
          m_sColonia: respuesta.data.m_sColoniaRemitente || "No especificado",
        },
        estado: estado || 0,
        estadoTexto: respuesta.data.m_sEstadoRemitente,
        municipio: respuesta.data.m_nIdCiudadRemitente,
        municipioTexto: respuesta.data.m_sMunicipioRemitente,
        correo: respuesta.data.m_sCorreoRemitente,
        telefono: respuesta.data.m_sTelefonoRemitente,
        contacto: respuesta.data.m_sContactoRemitente,
      };
    });

    /*obtenerMunicipiosByIdEstado(estado).then(({ data }) => {
      setDataMunicipios(data);
    });*/
    /*obtenerCodigoPostalId(respuesta.data.m_sIdCodigoPostalRemitente).then(
        (cp) => {
          setState((state) => {
            return {
              ...state,

            };
          });
        }
    );*/
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
      /*obtenerByIdZonaTarifa(respuesta.data.m_nIdZonaTarifa).then(
          ({ data }) => {
            setState((state) => {
              return {
                ...state,
                zonaTarifa: data,
              };
            });
          }
      );*/
    }
  }

  const mostrarDatosDestinatarioRecoleccionById = (respuesta) => {
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
        estadoTexto: respuesta.data.m_sEstadoDestinatario || "No especificado",
        municipio: respuesta.data.m_nIdCiudadDestinatario,
        municipioTexto: respuesta.data.m_sMunicipioDestinatario,
        codigoPostal: {
          m_nIdCP: respuesta.data.m_sIdCodigoPostalDestinatario,
          m_sCP: respuesta.data.m_sCodigoPostalDestinatario || "No especificado",
          m_sColonia: respuesta.data.m_sColoniaDestinatario || "No especificado",
        },
        correo: respuesta.data.m_sCorreoDestinatario,
        telefono: respuesta.data.m_sTelefonoDestinatario,
        contacto: respuesta.data.m_sContactoDestinatario,
        latitud: "",
        longitud:  "",
        paisTexto: respuesta.data.m_sPaisDestinatario
      };
    });
    obtenerZonaOperativaByIdCodigoPostal(respuesta.data.m_sIdCodigoPostalDestinatario).then(
      ( zonaOperativa ) => {
        if(props.destinatario){
          props.soloEntregaSucursal(zonaOperativa.data.length!==0?zonaOperativa.data[0].m_bAplicaEntrega:false,zonaOperativa.data[0].m_nIdSucursal)
        }
      }
  );
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
        setState((state) => {
          return {
            ...state,
            zonaOperativa: data,
          };
        });
      });
    }
  }

  const mostrarDatosRemitenteEmbarqueById = (respuesta) => {
    // let estado =respuesta.data.m_nIdEstadoRemitente< 10 ? `0${respuesta.data.m_nIdEstadoRemitente}` :  respuesta.data.m_nIdEstadoRemitente
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
        estado: respuesta.data.m_nIdEstadoRemitente || '',
        estadoTexto: respuesta.data.m_sEstadoRemitente || '',
        municipio: respuesta.data.m_sCodigoMunicipioRemitente,
        municipioTexto: respuesta.data.m_sMunicipioRemitente,
        codigoPostal: {
          m_nIdCP: respuesta.data.m_nIdCodigoPostalRemitente,
          m_sCP: respuesta.data.m_sCodigoPostalRemitente,
          m_sColonia: respuesta.data.m_sColoniaRemitente ? respuesta.data.m_sColoniaRemitente : respuesta.data.m_sLocalidadRemitente,
        },
      };
    });

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
          zonaOperativa: {m_nIdZona: respuesta.data.m_nIdZonaOperativaRecoleccion},
        };
      });
    }
  }

  const mostrarDatosDestinatarioEmbarqueById = (respuesta) => {
    // let estado =  respuesta.data.m_nIdEstadoDestinatario< 10 ? `0${respuesta.data.m_nIdEstadoDestinatario}` :  respuesta.data.m_nIdEstadoDestinatario;
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
        estado: respuesta.data.m_nIdEstadoDestinatario || '',
        estadoTexto: respuesta.data.m_sEstadoDestinatario || '',
        calle: respuesta.data.m_sCalleDestinatario,
        numeroInt: respuesta.data.m_sNoIntDestinatario || 0,
        numeroExt: respuesta.data.m_sNoExtDestinatario,
        municipio: respuesta.data.m_sCodigoMunicipioDestinatario,
        municipioTexto: respuesta.data.m_sMunicipioDestinatario,
        colonia: respuesta.data.m_sColoniaDestinatario,
        codigoPostal: {
          m_nIdCP: respuesta.data.m_nIdCodigoPostalDestinatario,
          m_sCP: respuesta.data.m_sCodigoPostalDestinatario,
          m_sColonia: respuesta.data.m_sColoniaDestinatario ? respuesta.data.m_sColoniaDestinatario : respuesta.data.m_sLocalidadDestinatario
        },
        paisTexto: respuesta.data.m_sPaisDestinatario
      };
    });
    /*obtenerMunicipiosByIdEstado(estado).then(({ data }) => {
      setDataMunicipios(data);
    });*/
    obtenerZonaOperativaByIdCodigoPostal(respuesta.data.m_nIdCodigoPostalDestinatario).then(
        ( zonaOperativa ) => {
          if(props.destinatario){
            props.soloEntregaSucursal(zonaOperativa.data.length!==0?zonaOperativa.data[0].m_bAplicaEntrega:false,zonaOperativa.data[0].m_nIdSucursal)
          }
        }
    );

    /*obtenerCodigoPostalId(
        respuesta.data.m_nIdCodigoPostalDestinatario
    ).then((cp) => {
      setState((state) => {
        return {
          ...state,

        };
      });

      obtenerZonaTarifaByIdCodigoPostal(cp.data.m_sCP).then(
          ({ data }) => {
            setDataZonasTarifa(data);
          }
      );
    });*/
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
      /*obtenerByIdZonaTarifa(respuesta.data.m_nIdZonaTarifa).then(
          ({ data }) => {
            setState((state) => {
              return {
                ...state,
                zonaTarifa: data,
              };
            });
          }
      );*/
    }
  }

  useEffect(
    (value) => {
      /**Para validar que hay una respuesta de donde tomar los datos*/
      if (!props.dataPadreConsulta) {
        return;
      }

      /**Le cambio el nombre el prop para no hacer tantos cambios a las referencias que ya había*/
      const { dataPadreConsulta: respuesta } = props;

      /**Se ocupa hacer la distincion de si es de recoleccion o embarque porque el nombre de las variables cambia*/
      /**Si es una respuesta de RecoleccionById*/
      if (props.dataPadreConsulta.data.recoleccionById) {
        if (props.remitente) {
          mostrarDatosRemitenteRecoleccionById(respuesta)
        } else if (props.destinatario) {
          mostrarDatosDestinatarioRecoleccionById(respuesta)
        }

        /**Si es embarque y volvemos a verificar que haya respuesta*/
      } else if (props.dataPadreConsulta.data.embarqueById) {
        /**Si se van a mostrar datos de remitente*/
        if (props.remitente) {
          mostrarDatosRemitenteEmbarqueById(respuesta)
          /**Si se van a mostrar datos de destinatario*/
        } else if (props.destinatario) {
          mostrarDatosDestinatarioEmbarqueById(respuesta)
        }

      }
    },
    [props.dataPadreConsulta]
  );

  const handleChange = (event) => {
    if(!event.target.name === "telefono" || !event.target.name === "correo" || !event.target.name === "contacto"){
       props.seCalculaTarifa()
    }  
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
    props.seCalculaTarifa()
    if(input=="codigoPostal"){
      obtenerZonaOperativaByIdCodigoPostal(newValue.m_nIdCP).then(
        ( zonaOperativa ) => {
          obtenerZonaTarifaByIdCodigoPostal(newValue.m_sCP).then(
            ( zonaTarifa ) => {
              if(zonaOperativa.data.length == 0){
                showSuccess("El codigo postal del remitente no está registrado en ninguna zona operativa, favor de seleccionar otro")
              }
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
      obtenerZonaOperativaByIdCodigoPostal(state.codigoPostal.m_nIdCP).then(
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

  const handleCrearRemitente = () => {
    createVisible(true);
  }

  const handleChangeAutoCompleteRemitenteDestinatario = (row) => {
      if(!row.m_nIdCP){
        showSuccess("La dirección seleccionada contiene datos que no coinciden con los catálogos del SAT, favor de validar la dirección en Tráfico - Catálogos - Remitentes/ Destinatarios.")
        return
      }
      if (props.componentePadre !== 'CANCELAR_SAT'){
        props.seCalculaTarifa()
      }
      const promise = new Promise((resolve, reject) => {
          obtenerZonaOperativaByIdCodigoPostal(row.m_nIdCP).then((zonaOperativa) => {
              setState((state) => ({
                ...state,
                id: row.m_nIdRemitenteDestinatario,
                alias: row.m_sAlias,
                nombre: row.m_sNombre,
                RFC: row.m_sRFC,
                domicilio: row.m_sDomicilio || "No especificado",
                codigoPostal:
                    {
                      m_nIdCP: row.m_nIdCP,
                      m_sCP: row.m_sCodigoPostal,
                      m_sColonia: row.m_sColonia || "No especificado",
                    },
                estado: row.m_nIdEstado || "",
                estadoTexto: row.m_sEstado || "No especificado",
                municipio: row.m_nIdMunicipio || "",
                correo: row.m_sCorreoElectronico || "",
                telefono: row.m_sTelefono || 0,
                contacto: row.m_sContacto || row.m_sNombre,
                calle: row.m_sCalle || "No especificado",
                municipioTexto: row.m_sMunicipio || "No especificado",
                numeroExt: row.m_sNoExterior || 0,
                numeroInt: row.m_sNoInterior || 0,
                colonia: row.m_sColonia || row.m_sLocalidad || "No especificado",
                latitud: row.m_sLatitud,
                longitud: row.m_sLongitud,
                origen: zonaOperativa.data.length !== 0 ? {
                  m_nIdCiudad: zonaOperativa.data[0].m_nIdOrigenDestino,
                  m_sCiudad: zonaOperativa.data[0].m_sOrigenDestino
                } : null,
                destino: zonaOperativa.data.length !== 0 ? {
                  m_nIdCiudad: zonaOperativa.data[0].m_nIdOrigenDestino,
                  m_sCiudad: zonaOperativa.data[0].m_sOrigenDestino
                } : null,
                openDialog: false,
                createDialog: false,
                zonaOperativa: zonaOperativa.data.length !== 0 ? zonaOperativa.data[0] : null,
                paisTexto: row.m_sPais
              }));
              if (zonaOperativa.data.length === 0) {
                if (props.remitente) {
                  showSuccess("El codigo postal del remitente no está registrado en ninguna zona operativa.")
                } else if (props.destinatario) {
                  showSuccess("El codigo postal del destinatario no está registrado en ninguna zona operativa.")
                }
              }
              resolve(zonaOperativa)
            })
      });
      promise.then((zonaOperativa)=> {

        if(props.destinatario){
          props.soloEntregaSucursal(zonaOperativa.data.length!==0?zonaOperativa.data[0].m_bAplicaEntrega:false,zonaOperativa.data[0].m_nIdSucursal)
        }
      })


    /*if(props.destinatario){
      props.soloEntregaSucursal(zonaOperativa.data.length!==0?zonaOperativa.data[0].m_bAplicaEntrega:false)
    }*/


    
  };

  useEffect(() => {
    handleEntregaEnDomicilioDestinatario()
  }, [props.entregaDomicilioDestinatario])

  const handleEntregaEnDomicilioDestinatario = () =>{
    if (props.entregaDomicilioDestinatario && !state.zonaOperativa && state.codigoPostal?.m_nIdCP){
      obtenerZonaOperativaByIdCodigoPostal(state.codigoPostal.m_nIdCP).then(( zonaOperativa ) => {
            setState((state) => ({
              ...state,
              zonaOperativa: zonaOperativa.data.length !== 0 ? zonaOperativa.data[0] : null,
            }));

          })
    }
  }

  const dialogVisible = (isVisible) => {
    setState(() => ({
      ...state,
      openDialog: isVisible,
    }));
  };

  const createVisible = (isVisible) => {
    setState(() => ({
      ...state,
      createDialog: isVisible,
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
            {
                state.createDialog === false &&
                <DialogTableRemDes
                  dialogVisible={dialogVisible}
                  openDialog={state.openDialog}
                  handleChangeAutoCompleteRemitenteDestinatario={handleChangeAutoCompleteRemitenteDestinatario}
                  handleCrearRemitente={handleCrearRemitente}
                />
            }
            {
                state.createDialog === true &&
                <DialogCreateRemDes
                    createVisible={createVisible}
                    openDialog={state.createDialog}
                    // handleChangeAutoCompleteRemitenteDestinatario={handleChangeAutoCompleteRemitenteDestinatario}
                    // handleCrearRemitente={handleCrearRemitente}
                />
            }
          </DialogContent>
        </Dialog>

        {/*<Dialog open={state.createDialog}
                onClose={() => setState({ ...state, createDialog: false })}
                fullWidth
                maxWidth="md">
          <DialogContent>
            <DialogCreateRemDes
                createVisible={createVisible}
                openDialog={state.createDialog}
                // handleChangeAutoCompleteRemitenteDestinatario={handleChangeAutoCompleteRemitenteDestinatario}
                // handleCrearRemitente={handleCrearRemitente}
            />
          </DialogContent>
        </Dialog>*/}

      {
        props.componentePadre !== 'CANCELAR_SAT' &&
          <>
            <div className="col-md-6">
              <div className="col-sm-12 col-md-12    unit">
                <div className="input">
                  <TextField
                      label={"Alias (Nombre)"}
                      size="small"
                      variant="outlined"
                      required
                      disabled={props.consulta}
                      value={state.nombre}
                      placeholder={"Alias (Nombre)"}
                      InputLabelProps={{ shrink: true }}
                      onClick={handleClickModal}
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
                                disabled
                                padding="0px"
                                style={{
                                  paddingRight: "0px",
                                }}
                                size="large">
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

              <div className="col-sm-12 col-md-12 unit">
                <div className="input">
                  <TextField
                      variant="outlined"
                      size="small"
                      onChange={handleChange}
                      className="form-control"
                      type="text"
                      label="RFC"
                      pattern="[A-Z&Ñ]{3,4}[0-9]{2}(0[1-9]|1[012])(0[1-9]|[12][0-9]|3[01])[A-Z0-9]{2}[0-9A]"
                      title="Favor de introducir un RFC válido."
                      required
                      fullWidth
                      value={state.RFC}
                      disabled={props.consulta || props.modificar || props.agregar}
                      name="RFC"
                  />
                </div>
              </div>

              <div className="col-sm-12 col-md-12 unit">
                <div className="input">
                  <TextField
                      variant="outlined"
                      size="small"
                      fullWidth
                      onChange={handleChange}
                      className="form-control"
                      type="text"
                      required
                      label="Domicilio"
                      value={state.domicilio}
                      disabled={props.consulta || props.modificar || props.agregar}
                      name="domicilio"
                  />
                </div>
              </div>

              <div className="col-sm-12 col-md-12 unit">
                <div className="input">
                  <TextField
                      variant="outlined"
                      size="small"
                      fullWidth
                      onChange={handleChange}
                      className="form-control"
                      type="text"
                      required
                      label="Calle"
                      value={state.calle}
                      disabled={props.consulta || props.modificar || props.agregar}
                      name="calle"
                  />
                </div>
              </div>

              <div className="col-sm-12 col-md-12 unit">
                <div className="input">
                  <TextField
                      variant="outlined"
                      size="small"
                      onChange={handleChange}
                      className="form-control"
                      fullWidth
                      type="text"
                      label="Número interior"
                      value={state.numeroInt}
                      disabled={props.consulta || props.modificar || props.agregar}
                      name="numeroInt"
                  />
                </div>
              </div>

              <div className="col-sm-12 col-md-12 unit">
                <div className="input">
                  <TextField
                      variant="outlined"
                      size="small"
                      onChange={handleChange}
                      className="form-control"
                      fullWidth
                      type="text"
                      label="Número exterior"
                      value={state.numeroExt}
                      disabled={props.consulta || props.modificar || props.agregar}
                      name="numeroExt"
                  />
                </div>
              </div>

              <div className="col-sm-12 col-md-12 unit">
                <div className="input">
                  <TextField
                      variant="outlined"
                      size="small"
                      onChange={handleChange}
                      className="form-control"
                      type="text"
                      fullWidth
                      required
                      label="Colonia / Localidad"
                      value={state.colonia}
                      disabled={props.consulta || props.modificar || props.agregar}
                      name="colonia"
                  />
                </div>
              </div>

              <div className="col-sm-12 col-md-12  unit">
                {/*<label className="input select">
            <FormControl fullWidth variant="outlined" size="small" required>
              <InputLabel id="idEstadoLabel">Estado</InputLabel>
              <Select
                fullWidth
                labelId="idEstadoLabel"
                label="Estado"
                className="form-control"
                value={state.estado}
                onChange={handleChange}
                name="estado"
                disabled={props.consulta || props.modificar || props.agregar}
              >
                {dataEstados.map((estado) => (
                  <option key={estado.m_nIdEstado} value={estado.m_nIdEstado}>
                    {estado.m_sEstado}
                  </option>
                ))}
              </Select>
            </FormControl>
          </label>*/}
                <TextField
                    variant="outlined"
                    size="small"
                    className="form-control"
                    label="Estado"
                    fullWidth
                    value={state.estadoTexto}
                    disabled
                    name="estado"
                />
              </div>
            </div>
            <div className="col-md-6">
              <div className="col-sm-12 col-md-12 unit">
                {/*<FormControl
            className="input select"
            fullWidth
            variant="outlined"
            size="small"
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
              disabled={props.consulta || props.modificar || props.agregar}
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
          </FormControl>*/}
                <TextField
                    variant="outlined"
                    size="small"
                    className="form-control"
                    label="Municipio"
                    fullWidth
                    value={state.municipioTexto}
                    disabled
                    name="municipio"
                />
              </div>

              <div className="col-sm-12 col-md-12 unit">
                <div className="input">
                  <Autocomplete
                      freeSolo
                      onChange={(event, newValue) =>
                          handleChangeAutocomplete("codigoPostal", newValue)
                      }
                      value={state.codigoPostal}
                      disabled={props.consulta || props.modificar || props.agregar}
                      name="codigoPostal"
                      disableClearable
                      size="small"
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
                                size="small"
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
                      size="small"
                      label="Correo Electrónico"
                      onChange={handleChange}
                      fullWidth
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
                      size="small"
                      onChange={handleChange}
                      className="form-control"
                      type="text"
                      label="Teléfono"
                      required
                      fullWidth
                      value={state.telefono}
                      disabled={props.consulta }
                      name="telefono"
                  />
                </div>
              </div>

              <div className="col-sm-12 col-md-12 unit">
                <div className="input">
                  <TextField
                      variant="outlined"
                      size="small"
                      onChange={handleChange}
                      className="form-control"
                      type="text"
                      fullWidth
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
                          disabled={props.consulta || props.modificar || props.agregar}
                          id="origenRemitente"
                          size="small"
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
                                    size="small"
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
                          disabled={props.consulta || props.modificar || props.agregar}
                          destino="destino"
                          size="small"
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
                                    size="small"
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
                          size="small"
                          id="zonaOperativa"
                          disableClearable
                          forcePopupIcon={false}
                          options={dataZonasOperativas}
                          disabled={props.consulta || props.modificar || props.agregar}
                          getOptionLabel={(option) =>
                              option
                                  ? `${option.m_sCodigoZona} - CP: ${state.codigoPostal.m_sCP}`|| "Código Postal sin zona asignada"
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
                                  size="small"
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
              {/*props.mostrarZonas*/false && (
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
                          disabled={props.consulta || props.modificar || props.agregar}
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
                                  size="small"
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
          </>
      }

      {
          props.componentePadre === 'CANCELAR_SAT' &&
          <div>
            <Grid container spacing={2}>
              <Grid item xs>
                <TextField
                    label={"Alias (Nombre)"}
                    size="small"
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
                              size="large">
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
              </Grid>
              <Grid item xs>
                <Autocomplete
                    value={state.zonaOperativa}
                    freeSolo
                    id="zonaOperativa"
                    disableClearable
                    forcePopupIcon={false}
                    disabled={true}
                    getOptionLabel={(option) =>
                        option
                            ? `${option.m_sCodigoZona} - CP: ${state.codigoPostal.m_sCP}`|| "Código Postal sin zona asignada"
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
                            size="small"
                            {...params}
                        />
                    )}
                />
              </Grid>
              <Grid item xs>
                <Autocomplete
                    freeSolo
                    onChange={(event, newValue) =>
                        handleChangeAutocomplete("origen", newValue)
                    }
                    value={state.origen}
                    disabled={true}
                    id="origenRemitente"
                    name="origenRemitente"
                    disableClearable
                    forcePopupIcon={false}
                    getOptionLabel={(option) => option.m_sCiudad || ""}
                    style={{
                      transform: "translate(14px, 10px) scale(1) !important",
                    }}
                    renderInput={(params) => (
                        <div>
                          <TextField
                              label="Origen"
                              size="small"
                              variant="outlined"
                              required
                              {...params}
                          />
                        </div>
                    )}
                />
              </Grid>
            </Grid>

          </div>
      }



    </div>
  );
}

export default RemitenteDestinatario;
