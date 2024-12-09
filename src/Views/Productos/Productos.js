import React, { useEffect } from "react";
import Cabecera from "../../Components/Template/Cabecera";
import BarraLateralIzquierda from "../../Components/Template/BarraLateralIzquierda";
import { DataGrid } from "@mui/x-data-grid";
import Noty from "noty";
import {
  Button,
  Checkbox,
  FormControl,
  Grid,
  InputLabel,
  Select,
  TextField,
  Tooltip,
} from "@mui/material";
import { confirmAlert } from "react-confirm-alert";
import { dataGridLocaleText } from "../../Constants";
import { obtenerEmbalajes } from "../../Util/Contexts/EmbalajesContext";
import $ from "jquery";
import {validarDerecho} from "../../Util/Util"
import { styled } from "@mui/material/styles";


import {
  obtenerProductos,
  obtenerProductoById,
  agregarProducto,
  modificarProducto,
  eliminarProducto
} from "../../Util/Contexts/ProductosContext";
const PREFIX = 'Productos';

const classes = {
  disabled: `${PREFIX}-disabled`
};

const Root = styled('div')({
  [`& .${classes.disabled}`]: {
      pointerEvents: "none",
      cursor: "default",
  }
});

function showSuccess(mensaje) {
  new Noty({
    type: "information",
    layout: "topCenter",
    text: mensaje,
    timeout: "3000",
  }).show();
}

function Productos() {
  /*-=---------------------------------------------Variables------------------------------------------------=-*/
  const [state, setState] = React.useState({
    agregar: "Agregar",
    height: window.innerHeight,
  });
  const [form, setForm] = React.useState({
    Descripcion: "",
    Largo: "",
    Ancho: "",
    Alto: "",
    Peso: "",
    Volumen: "",
    IdTipoEmbalaje: "",
    Embalaje: "",
    Activo: false,
    IdProducto: "",
    NoProducto: "",
    predeterminado: false
  });

  const [productos, setProductos] = React.useState([]);
  const [dataEmbalaje, setDataEmbalaje] = React.useState([]);
  const columns = React.useMemo(() => [
    {
      headerName: "Acciones",
      soportable: false,
      filterable: false,
      field: "",
      renderCell: (row) => {
        return (
          <Root>
            <Tooltip title={"Modificar"}>
              <a
                data-toggle={"tab"}
                onClick={() => handleShowModificar(row.row)}
                className={"btn btn-default btn-xs"}
                disabled={!validarDerecho(9101389)}
              >
                <i
                  className={"fa fa-pencil-square-o"}
                  style={{ color: "#F9A03E" }}
                />
              </a>
            </Tooltip>
            <Tooltip title={"Consultar"}>
              <a

                className={"btn btn-default btn-xs"}
                onClick={() => handleShowConsultar(row.row)}
              >
                <i className={"fa fa-eye"} style={{ color: "#F9A03E" }} />
              </a>
            </Tooltip>
            <Tooltip title={"Eliminar"}>
              <a
                className="btn btn-default btn-xs"
                onClick={() =>
                  confirmAlert({
                    title: "Confirmar Eliminar",
                    message: "Está seguro de eliminar el producto?",
                    buttons: [
                      {
                        label: "Sí",
                        onClick: () => handleEliminar(row.row),
                      },
                      {
                        label: "No",
                      },
                    ],
                  })
                }
              >
                <i className="zmdi zmdi-delete" style={{ color: "#F30B0B" }} />
              </a>
            </Tooltip>
          </Root>
        );
      },
    },
    {
      headerName: "IdProducto",
      field: "m_nIdProducto",
      width: 100,
    },
    {
      headerName: "Descripción",
      field: "m_sDescripcion",
      width: 300,
    },
    {
      headerName: "Embalaje",
      field: "m_sEmbalaje",
      width: 300,
    },
    {
      headerName: "Activo",
      field: "m_bActivo",
      width: 300,
      valueFormatter: (params) => params.value ? "Sí" : "No",

    },
  ]);

  /*-=---------------------------------------------Handlers------------------------------------------------------=-*/
  function handleShowAgregar() {
    setState({
      ...state,
      agregar: "Agregar",
    });
    $(".nav-tabs li ").removeClass("active");
    $(".nav-tabs li").eq(1).addClass("active");
    $(".tab-content div ").removeClass("in show");
    $("#Agregar").addClass("in show");
  }

  function handleShowModificar(row) {
    setState({
      ...state,
      agregar: "Modificar",
    });
    getProductoById(row.m_nIdProducto);
    $(".nav-tabs li ").removeClass("active");
    $(".nav-tabs li").eq(1).addClass("active");
    $(".tab-content div ").removeClass("in show");
    $("#Agregar").addClass("in show");
  }

  function handleEliminar(row) {
    eliminarProducto(row.m_nIdProducto).then((respuesta) => {
      showSuccess(respuesta.data);
      handleShowListado();
    })
    .catch((err) => {
      console.log(err);
      showSuccess("El Usuario no tiene derecho para modificar");
    });
  }

  function handleShowConsultar(row) {
    setState({
      ...state,
      agregar: "Consultar",
    });
    getProductoById(row.m_nIdProducto);
    $(".nav-tabs li ").removeClass("active");
    $(".nav-tabs li").eq(1).addClass("active");
    $(".tab-content div ").removeClass("in show");
    $("#Agregar").addClass("in show");
  }
  const handleShowListado = (event) => {
    if (event) {
      event.stopPropagation();
    }
    setState({
      ...state,
      agregar: "Agregar",
    });
    limpiarCamposAgregar();
    $(".nav-tabs li ").removeClass("active");
    $(".nav-tabs li").eq(0).addClass("active");
    $(".tab-content div ").removeClass("in show");
    $("#Listado").addClass("in show");
    getAllProductos()
  };

  useEffect(value => {
    if (form.Largo && form.Ancho && form.Alto) {
      setForm({...form, Volumen : form.Largo * form.Ancho * form.Alto})
    }
  }, [form.Largo, form.Ancho, form.Alto])
  const handleAceptar = (e) => {
    e.preventDefault();

    let params = {
      m_sDescripcion: form.Descripcion,
      m_xLargo: form.Largo,
      m_xAncho: form.Ancho,
      m_xAlto: form.Alto,
      m_xPeso: form.Peso,
      m_nIdEmbalaje: form.IdTipoEmbalaje,
      m_sEmbalaje: form.Embalaje,
      m_bActivo: form.Activo,
      m_nNoProducto: form.IdProducto,
      m_bPredeterminado: form.predeterminado
    };

     if (form.IdProducto != 0) {
      if(params.m_nIdEmbalaje == ""){
        showSuccess("Seleccionar Embalaje")
        return
      }
      modificarProducto(form.IdProducto, params)
        .then((respuesta) => {
          showSuccess("Modificado Exitosamente");
          handleShowListado();
        })
        .catch((err) => {
          console.log(err);
          showSuccess("El Usuario no tiene derecho para modificar");
        });
    } else {
      agregarProducto(params)
        .then((respuesta) => {
          showSuccess("Agregado Exitosamente");
          console.log(respuesta.data);
          handleShowListado();
        })
        .catch((err) => {
          console.log(err);
          showSuccess(err);
        });
    }
    getAllProductos();
    $(".nav-tabs li ").removeClass("active");
    $(".nav-tabs li").eq(0).addClass("active");
    $(".tab-content div ").removeClass("in show");
    $("#Listado").addClass("in show");
    console.log("submit", params);
  };

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.id]: e.target.value,
    });
    if (e.target.name == "IdTipoEmbalaje") {
      setForm((embalaje) => {
        return {
          ...embalaje,
          Embalaje: dataEmbalaje.find((i) => i.m_nIdEmbalaje == e.target.value)
            .m_sNombre,
          IdTipoEmbalaje: e.target.value,
        };
      });
    }
  };


  const handleChecked = (e) => {
    setForm({
      ...form,
      [e.target.id]: e.target.checked,
    });
  };

  const limpiarCamposAgregar = (e) => {
    setForm((producto) => {
      return {
        ...producto,
        Descripcion: "",
        Largo: "",
        Ancho: "",
        Peso: "",
        Alto:"",
        Volumen: "",
        IdTipoEmbalaje: "",
        Embalaje: "",
        Activo: false,
        IdProducto: "",
        NoProducto: "",
      };
    });
  };
  //--=-----------------------------------------Servicios--------------------------------------------------------=-*/
  function getAllEmbalajes() {
    obtenerEmbalajes().then((respuesta) => {
      setDataEmbalaje(respuesta.data);
    });
  }
  function getAllProductos() {
    obtenerProductos().then((respuesta) => {
      setProductos(respuesta.data);
    });
  }
  function getProductoById(id) {
    obtenerProductoById(id).then((respuesta) => {

        console.log(respuesta)
      setForm((form) => {
        return {
          ...form,
          Descripcion: respuesta.data.m_sDescripcion,
          Largo: respuesta.data.m_xLargo,
          Ancho: respuesta.data.m_xAncho,
          Peso: respuesta.data.m_xPeso,
          Alto:respuesta.data.m_xAlto,
          Volumen: respuesta.data.m_xLargo * respuesta.data.m_xAncho * respuesta.data.m_xAlto,
          IdTipoEmbalaje: respuesta.data.m_nIdEmbalaje,
          Embalaje: respuesta.data.m_sEmbalaje,
          Activo: respuesta.data.m_bActivo,
          predeterminado: respuesta.data.m_bPredeterminado,
          IdProducto: respuesta.data.m_nIdProducto,
          NoProducto: respuesta.data.m_nNoProducto,
        };
      });
    });
  }
  /*--=---------------------------------------Hooks useEffect-------------------------------------------------=--*/
  useEffect((value) => {

    if(dataEmbalaje.length!=0){
      return;
    }  else{
        getAllEmbalajes();
    }
    if (productos.length != 0) {
      console.log(productos.length != 0)
      return;
    } else {
      getAllProductos();
    }
    //getAllSATServicios()
    //getAllSATUnidades()
  }, []);

  return (
    <div>
      <header className="topbar clearfix">
        <Cabecera titulo="Productos"></Cabecera>
      </header>
      {/*Leftbar Start Here*/}
      <aside className="iconic-leftbar">
        <BarraLateralIzquierda />
      </aside>
      {/*Leftbar End Here*/}
      <section className={"main-container"}>
        <div className={"content-fluid"}>
          <ul className={"nav nav-tabs"} >
            <li className={"active"}>
              <a d onClick={handleShowListado}><i className={"fa fa-list"} /> Listado</a>
            </li>
            <li>
              <a className= {validarDerecho(9101388)? "":classes.disabled} onClick={handleShowAgregar}><i className={"fa fa-plus-circle"} /> {state.agregar}</a>
            </li>
          </ul>

          <div className={"row tab-content"} >
            {/*Seccion de Listado*/}
            <div className="widget-wrap tab-pane fade in show" id="Listado">
              <div className="widget-wrap">
                <div className="widget-content">
                  <div
                    className={"row"}
                    style={{ height: state.height - 250, width: "100%" }}
                  >
                    <DataGrid
                      columns={columns}
                      rows={productos}
                      locateText={dataGridLocaleText}
                      pagination
                      getRowId={(row) => row.m_nIdProducto}
                      pageSize={20}
                    />
                  </div>
                </div>
              </div>
            </div>

            {/*Seccion de Agregar,Consultar y Modificar*/}
            <div className="widget-wrap tab-pane fade" id="Agregar">
            <form className="j-forms" onSubmit={handleAceptar}>
                      <Grid container spacing={1}>
                            <Grid item xs={2}>
                           
                                <TextField
                                  variant="outlined"
                                  margin="dense"
                                  label="Descripción"
                                  onChange={handleChange}
                                  type="text"
                                  maxLength="50"
                                  required
                                  readOnly={state.agregar == "Consultar"}
                                  value={form.Descripcion}
                                  placeholder="Descripcion"
                                  id="Descripcion"
                                  name="Descripcion"
                                />
                              
                            </Grid>
                            <Grid item xs={2}>
                             
                                <TextField
                                  variant="outlined"
                                  margin="dense"
                                  type="text"
                                  onChange={handleChange}
                                  value={form.Largo}
                                  label="Largo"
                                  readOnly={state.agregar == "Consultar"}
                                  placeholder="cms"
                                  name="Largo"
                                  id="Largo"
                                />
                           
                            </Grid>
                            <Grid item xs={2}>
                             
                                <TextField
                                  variant="outlined"
                                  margin="dense"
                                  type="text"
                                  onChange={handleChange}
                                  label="Ancho"
                                  readOnly={state.agregar == "Consultar"}
                                  value={form.Ancho}
                                  placeholder="cms"
                                  name="Ancho"
                                  id="Ancho"
                                />
                         
                            </Grid>
                            <Grid item xs={2}>
                        
                                <TextField
                                  variant="outlined"
                                  margin="dense"
                                  type="text"
                                  onChange={handleChange}
                                  value={form.Alto}
                                  label="Alto"
                                  readOnly={state.agregar == "Consultar"}
                                  placeholder="cms"
                                  name="Alto"
                                  id="Alto"
                                />
                           
                            </Grid>
                            <Grid item xs={2}>
                           
                                <TextField
                                  variant="outlined"
                                  margin="dense"
                                  type="text"
                                  onChange={handleChange}
                                  label="Peso"
                                  readOnly={state.agregar == "Consultar"}
                                  value={form.Peso}
                                  placeholder="kg"
                                  name="Peso"
                                  id="Peso"
                                />
                            
                            </Grid>
                            <Grid item xs={2}>
                       
                                <TextField
                                  variant="outlined"
                                  margin="dense"
                                  onChange={handleChange}
                                  type="text"
                                  value={form.Volumen}
                                  label="Volumen"
                                  readOnly={state.agregar == "Consultar"}
                                  placeholder="cm3"
                                  name="Volumen"
                                  id="Volumen"
                                />
                     
                            </Grid>
                            <Grid item xs={2}>
                              <label className="input select">
                                <FormControl
                                  fullWidth
                                  variant="outlined"
                                  margin="dense"
                                  required
                                >
                                  <InputLabel id="m_nIdTipoEmbalajeLabel">
                                    Embalaje
                                  </InputLabel>
                                  <Select
                                    label="Embalaje"
                                    labelId="m_nIdTipoEmbalajeLabel"
                                    value={form.IdTipoEmbalaje}
                                    id="IdTipoEmbalaje"
                                    name="IdTipoEmbalaje"
                                    onChange={handleChange}
                                    readOnly={state.agregar == "Consultar"}
                                    required
                                  >
                                    {dataEmbalaje.map((embalaje) => (
                                      <option
                                        key={embalaje.m_nIdEmbalaje}
                                        value={embalaje.m_nIdEmbalaje}
                                      >
                                        {embalaje.m_sNombre}
                                      </option>
                                    ))}
                                  </Select>
                                </FormControl>
                                <i className="fa fa-arrow-down" />
                              </label>
                            </Grid>
                            <Grid item xs={2}>
                              <Grid container>
                                <Grid item xs={12}>
                                  <label className="label">Estatus</label>
                                </Grid>
                                <Grid item xs={2}>
                                  <Checkbox
                                    className="col-sm"
                                    inputProps={{ 'aria-label': 'primary checkbox' }}
                                    onChange={handleChecked}
                                    checked={form.Activo}
                                    color="primary"
                                    id="Activo"
                                    name="Activo"
                                    disabled={state.agregar == "Consultar"}
                                  />
                                  <i />
                                </Grid>
                                <Grid item xs={4}>
                                  <label
                                    className="checkbox"
                                    style={{ padding: "10px 0 0px 3px" }}
                                  >
                                    Activo
                                  </label>
                                </Grid>
                              </Grid>
                            </Grid>
                            <Grid item xs={12}>
                              <div className="form-footer ol-md-12">
                                    <Grid container spacing={1}>
                                        <Grid item xs>
                                        <Button
                                        fullWidth
                                  onClick={handleShowListado}
                                  className="btn btn-secondary secondary-btn"
                                  disabled={state.agregar == "Consultar"}
                                >
                                  CANCELAR
                                </Button>
                                        </Grid>
                                        <Grid item xs>
                                        <Button
                                        fullWidth
                                  type="submit"
                                  className="btn btn-primary primary-btn"
                                  disabled={state.agregar == "Consultar"}
                                >
                                  AGREGAR PRODUCTO
                                </Button>
                                        </Grid>
                                    </Grid>
                                </div>

                            </Grid>
                          </Grid>
                      </form>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

export default Productos;
