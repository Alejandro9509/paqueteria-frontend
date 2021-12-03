import React, {useEffect, useState} from "react";
import {FormControl, Grid, InputLabel, Select} from "@material-ui/core";
import { Button, Dialog, DialogActions, DialogContent, DialogTitle, Tooltip } from '@material-ui/core';
import Autocomplete from "@material-ui/lab/Autocomplete";
import TextField from "@material-ui/core/TextField";
import IconButton from "@material-ui/core/IconButton";
import AddBoxIcon from "@material-ui/icons/AddBox";
import DeleteIcon from "@material-ui/icons/Delete";
import EditIcon from '@material-ui/icons/Edit';
import SaveIcon from "@material-ui/icons/Save";
import {DataGrid} from "@material-ui/data-grid";
import CrearConcepto from '../ConceptosFacturacion/CrearConcepto';
import {dataGridLocaleText} from "../../Constants";
import Noty from "noty";
import {obtenerProductoById} from "../../Util/Contexts/ProductosContext";
import {obtenerEmbalajes} from "../../Util/Contexts/EmbalajesContext";
import axios from "axios";
import Recoleccion from "../Recoleccion";
import {API_HEADERS} from "../../Constants"
import {
    obtenerSATEmbalajes,
    obtenerSATServicios,
    obtenerSATUnidades,
} from "../../Util/Contexts/ConceptosFacturacionContext";
const headers = API_HEADERS

function showSuccess(mensaje) {
    new Noty({
        type: "information",
        layout: "topCenter",
        text: mensaje,
        timeout: "3000"
    }).show()
}
function Paquetes({dataPaquetes = [],onChangeList, disabled, tieneSeguro, recoleccion}) {
    const [openDialog, setOpenDialog] = useState(false)
    const [row, setRow] = useState(0)
    const [dataComplemento, setDataComplemento] = useState({
        claveProducto: '',
        claveUnidad: '',
        UnidadSAT: '',
        ProductoSAT: '',
        embalajeSAT:'',
        claveEmbalaje:''
    })
    const [dataSAT, setDataSAT] = useState([])
    const [dataSATUnidades, setDataSATUnidades] = useState([])
    const [dataSATEmbalajes, setDataSATEmbalajes] = useState([])

    function RowMenuCell(props) {
        const { api, id } = props;
        setRow(id);

        const handleDeleteClick = (event) => {
          event.stopPropagation();
          console.log("id==>", id);
          let row = dataPaquetes.filter((p) => p.m_nIdPaquete == id)[0];
          console.log(row);
          handlePaqueteClick(row);
          // api.updateRows([{ id, _action: 'delete' }]);
        };

        const handleOpenClick = (event) => {
          event.stopPropagation();
            if (dataSAT.length === 0 ) {
                getAllSATServicios()
            }
            if (dataSATUnidades.length === 0 ) {
                getAllSATUnidades()
            }
            if (dataSATEmbalajes.length === 0 ) {
                getAllSATEmbalajes()
            }

          let row = dataPaquetes.filter((p) => p.m_nIdPaquete == id)[0];
            setDataComplemento({
                claveProducto: row.m_nClaveSATProducto||'',
                claveUnidad: row.m_nClaveSATUnidad||'',
                UnidadSAT: row.m_sUnidadSAT||'',
                ProductoSAT: row.m_sProductoSAT||'',
                embalajeSAT: row.m_sEmbalajeSAT||'',
                claveEmbalaje:row.m_sClaveEmbalaje||''
            });
          console.log(row);
          setOpenDialog(true);
        };

        return (
          <div>
            {/*<IconButton
              color="primary"
              size="small"
              aria-label="save"
              onClick={handleOpenClick}
            >
              <SaveIcon fontSize="large" />
            </IconButton>*/}
            <IconButton color="inherit" size="small" aria-label="delete" onClick={handleDeleteClick}>
              <EditIcon fontSize="large" />
            </IconButton>
          </div>
        );
    }

    function RowMenuCellConsulta(props) {
        const { api, id } = props;
        setRow(id);

        const handleOpenClick = (event) => {
          event.stopPropagation();
          let row = dataPaquetes.filter((p) => p.m_nIdPaquete == id)[0];
          console.log(row);
            setDataComplemento({
                claveProducto: row.m_sClaveSATProducto,
                claveUnidad: row.m_sClaveSATUnidad,
                UnidadSAT: row.m_nUnidadSAT,
                ProductoSAT: row.m_nProductoSAT,
                embalajeSAT:row.m_sEmbalajeSAT,
                claveEmbalaje:row.m_sClaveEmbalaje
            });

          setOpenDialog(true);
        };
        return (
          <div>
            {/*<IconButton
              color="primary"
              size="small"
              aria-label="save"
              onClick={handleOpenClick}
            >
              <SaveIcon fontSize="large" />
            </IconButton>*/}
          </div>
        );
    }

    const columnsPaquetes = React.useMemo(() => [
        {
            headerName: "Tipo",
            field: "m_sTipo",
            minWidth: 100,
            width: 100,
        },
        {
            headerName: "Producto",
            field: "m_sProducto",
            flex: 1,
        },
        {
            headerName: "Largo",
            field: "m_rLargo",
            type:'number',
            valueFormatter: ({ value }) => `${value}cm`,
            width: 90,
        },
        {
            headerName: "Ancho",
            field: "m_rAncho",
            type:'number',
            valueFormatter: ({ value }) => `${value}cm`,
            width: 90,
        },
        {
            headerName: "Alto",
            field: "m_rAlto",
            type:'number',
            valueFormatter: ({ value }) => `${value}cm`,
            width: 90,
        },
        {
            headerName: "Peso",
            field: "m_rPeso",
            type:'number',
            valueFormatter: ({ value }) => `${value}kg`,
            width: 90,
        },
        {
            headerName: "Volumen",
            field: "m_rVolumen",
            type:'number',
            valueFormatter: ({ value }) => `${value}cm3`,
            width: 120,
        },
        {
            headerName: "Embalaje",
            field: "m_sTipoEmbalaje",
            width: 130,
        },
        /*{
            headerName: "Valor",
            field: "m_cyValorDeclarado",
            type:'number',
            valueFormatter: ({ value }) => currencyFormatter.format(Number(value)),
            width: 90,
        },*/
        {
            headerName: "Descripcion",
            field: "m_sDescripcion",
            flex: 1,
        },
        {
            headerName: "Cantidad",
            field: "m_nCantidad",
            type:'number',
            valueFormatter: ({ value }) => `${value}pz`,
            width: 90,
        },
        {
            headerName: "Observaciones",
            field: "m_sObservaciones",
            flex: 1,
        },
        {
            field: 'complementos',
            headerName: 'Complementos',
            renderCell: RowMenuCell,
            sortable: false,
            width: 90,
            headerAlign: 'center',
            filterable: false,
            align: 'center',
            disableColumnMenu: true,
            disableReorder: true,
        }
    ]);

    const columnsPaquetesConsulta = React.useMemo(() => [
        {
            headerName: "Tipo",
            field: "m_sTipo",
            minWidth: 100,
            width: 100,
        },
        {
            headerName: "Producto",
            field: "m_sProducto",
            flex: 1,
        },
        {
            headerName: "Largo",
            field: "m_rLargo",
            type:'number',
            valueFormatter: ({ value }) => `${value}cm`,
            width: 90,
        },
        {
            headerName: "Ancho",
            field: "m_rAncho",
            type:'number',
            valueFormatter: ({ value }) => `${value}cm`,
            width: 90,
        },
        {
            headerName: "Alto",
            field: "m_rAlto",
            type:'number',
            valueFormatter: ({ value }) => `${value}cm`,
            width: 90,
        },
        {
            headerName: "Peso",
            field: "m_rPeso",
            type:'number',
            valueFormatter: ({ value }) => `${value}kg`,
            width: 90,
        },
        {
            headerName: "Volumen",
            field: "m_rVolumen",
            type:'number',
            valueFormatter: ({ value }) => `${value}cm3`,
            width: 120,
        },
        {
            headerName: "Embalaje",
            field: "m_sTipoEmbalaje",
            width: 130,
        },
        /*{
            headerName: "Valor",
            field: "m_cyValorDeclarado",
            type:'number',
            valueFormatter: ({ value }) => currencyFormatter.format(Number(value)),
            width: 90,
        },*/
        {
            headerName: "Descripcion",
            field: "m_sDescripcion",
            flex: 1,
        },
        {
            headerName: "Cantidad",
            field: "m_nCantidad",
            type:'number',
            valueFormatter: ({ value }) => `${value}pz`,
            width: 90,
        },
        {
            headerName: "Observaciones",
            field: "m_sObservaciones",
            flex: 1,
        },
        {
            field: 'complementos',
            headerName: 'Complementos',
            renderCell: RowMenuCellConsulta,
            sortable: false,
            width: 90,
            headerAlign: 'center',
            filterable: false,
            align: 'center',
            disableColumnMenu: true,
            disableReorder: true,
        }
    ]);
    const currencyFormatter = new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
    });
    const [dataEmbalaje, setDataEmbalaje] = React.useState([]);
    const [dataProductos, setDataProductos] = useState([])
    const [paquete, setPaquete] = useState({
        m_nIdPaquete: 0,
        m_rPeso: "",
        m_rLargo: "",
        m_rAncho: "",
        m_rAlto: "",
        m_rVolumen: "",
        m_nIdTipoEmbalaje: "",
        m_sDescripcion: "",
        m_nCantidad: "",
        m_sObservaciones: "",
        m_cyValorDeclarado: "0",
        m_nIdTipo: 2,
        m_nIdProducto:'',
        m_sTipo: "Paquete",
        m_sClaveSATProducto:'',
        m_sClaveSATUnidad:'',
    })

    useEffect(value => {
        getAllEmbalajes()
        //getAllSATServicios()
        //getAllSATUnidades()
    }, [])

    const validarPaquetes = (paquete) => {
        if (paquete.m_nIdTipo == 1){
            return !!(paquete.m_sDescripcion != '');
        }else{
            if (!paquete.producto){
                showSuccess("Seleccione un producto del listado")
                return false
            }
            if (!paquete.m_rLargo || !paquete.m_rAncho || !paquete.m_rAncho){
                showSuccess("Ingrese las dimensiones del paquete.")
                return false
            }
            if (!paquete.m_rPeso){
                showSuccess("Ingrese el peso del paquete.")
                return false
            }
            if (!paquete.m_nIdTipoEmbalaje){
                showSuccess("Seleccione un tipo de embalaje del listado")
                return false
            }
            if (paquete.m_sDescripcion === ''){
                showSuccess("Ingrese la descripcion del paquete.")
                return false
            }
            if (paquete.m_nCantidad === ''){
                showSuccess("Ingrese la cantidad de paquetes.")
                return false
            }
            return true
        }
    }

    const addPaquetev2 = (event) => {
        event.preventDefault()
        event.stopPropagation()
        console.log(paquete)
        let paq = paquete
        if (validarPaquetes(paq)){
            paq.m_nIdPaquete = paq.m_nIdPaquete != 0 ? paq.m_nIdPaquete : dataPaquetes.length + 1
            /*paq.m_cyValorDeclarado = paq.m_cyValorDeclarado ? paq.m_cyValorDeclarado : 0
            if (paq.m_cyValorDeclarado === 0 && tieneSeguro){
                showSuccess("El campo de valor declarado es necesario para el seguro.")
                return
            }*/
            dataPaquetes.push(paq);
            resetPaquete()

            onChangeList(dataPaquetes)
        }
    }

    const removePaquetev2 = (event) => {
        event.preventDefault()
        resetPaquete()

    }

    const handlePaqueteClick = (data) =>{
        if(!disabled){
            onChangeList(dataPaquetes.filter((i) => i.m_nIdPaquete != data.m_nIdPaquete))
            if (dataProductos.length === 0 ){
                obtenerProductoById(data.m_nIdProducto).then((respuesta) =>{
                    data.producto = respuesta.data
                    data.m_sProducto = respuesta.data.m_sDescripcion
                })
            }else if (data.m_nIdProducto){
                data.producto = dataProductos.find((i) => i.m_nIdProducto == data.m_nIdProducto)
                data.m_sProducto = data.producto.m_sDescripcion
            }
            console.log(data)
            setPaquete(data)
        }

    }

    const handleChangePaqueteProductov2 = (event, newValue) => {
        if (newValue){
            setPaquete(paquete =>{
                return{
                    ...paquete,
                    producto: newValue,
                    m_nIdProducto: newValue.m_nIdProducto || 0,
                    m_rLargo: newValue.m_xLargo,
                    m_rAlto: newValue.m_xAlto,
                    m_rAncho: newValue.m_xAncho,
                    m_rPeso: newValue.m_xPeso,
                    m_nIdTipoEmbalaje: newValue.m_nIdEmbalaje,
                    m_sTipoEmbalaje: dataEmbalaje.find((i) => i.m_nIdEmbalaje == newValue.m_nIdEmbalaje).m_sNombre,
                    m_sDescripcion: newValue.m_nIdProducto== 1 ? "" : newValue.m_sDescripcion,
                    m_sProducto: newValue.m_sDescripcion
                }
            })
            setPaquete(paquete =>{
                return{
                    ...paquete,
                    m_rVolumen: paquete.m_rLargo * paquete.m_rAlto * paquete.m_rAncho
                }})
        }else{
            setPaquete(paquete =>{
                return{
                    ...paquete,
                    producto: null,
                    m_nIdProducto:  0,
                }
            })
        }
    };

    const handleChangePaquetev2 = (event) => {

        setPaquete(paquete => {
            return {
                ...paquete,
                [event.target.name]: event.target.value,
                m_rVolumen: paquete.m_rLargo * paquete.m_rAlto * paquete.m_rAncho,
            }
        })
        if (event.target.name == "m_nIdTipoEmbalaje"){
            setPaquete(paquete => {
                return {
                    ...paquete,
                    m_sTipoEmbalaje: dataEmbalaje.find((i) => i.m_nIdEmbalaje == event.target.value).m_sNombre,
                }
            })
        }
        if (event.target.name == "m_nIdTipo"){
            setPaquete(paquete => {
                return {
                    ...paquete,
                    m_sTipo: event.target.value == 1 ? "Sobre" : "Paquete",
                }
            })
        }

    };

    const handleChangeComplementoSat = (idComplemento, {m_sClaveSAT,m_sDescripcion}) => {
        debugger
        let index = dataPaquetes.findIndex(d=> d.m_nIdPaquete == row)
        if(index !=-1){

            if (idComplemento === 1){
                setDataComplemento(dataComplemento =>{
                    return {
                        ...dataComplemento,
                        claveProducto: m_sClaveSAT,
                        ProductoSAT: m_sDescripcion,
                    }
                });
                /*dataPaquetes[index].m_nClaveSATProducto = data.m_sClaveSAT;
                dataPaquetes[index].m_sProductoSAT = data.m_sDescripcion;*/
            }else if (idComplemento === 2){
                setDataComplemento(dataComplemento =>{
                    return {
                        ...dataComplemento,
                        claveUnidad: m_sClaveSAT,
                        UnidadSAT: m_sDescripcion,
                    }
                });
                /*dataPaquetes[index].m_nClaveSATUnidad = data.m_sClaveSAT;
                dataPaquetes[index].m_sUnidadSAT = data.m_sDescripcion;*/
            }else if (idComplemento === 3){
                setDataComplemento(dataComplemento =>{
                    return {
                        ...dataComplemento,
                        claveEmbalaje: m_sClaveSAT,
                        embalajeSAT: m_sDescripcion
                    }
                });
                /*dataPaquetes[index].m_sClaveEmbalaje = m_sClaveSAT;
                dataPaquetes[index].m_sEmbalajeSAT = m_sDescripcion;*/
            }
            console.log(dataComplemento)
        }
    }

    const resetPaquete = () =>{
        setPaquete(paquete => {
            return {
                ...paquete,
                m_nIdPaquete: 0,
                m_rPeso: "",
                m_rLargo: "",
                m_rAncho: "",
                m_rAlto: "",
                m_rVolumen: "",
                m_nIdTipoEmbalaje: "",
                m_sTipoEmbalaje: "",
                m_cyValorDeclarado: "0",
                m_sDescripcion: "",
                m_nCantidad: "",
                m_nIdTipo: 2,
                m_sObservaciones: "",
                m_sTipo: "Paquete",
                m_sClaveSATProducto:"",
                m_sClaveSATUnidad:"",
            }
        })
    }

    const handleClickProducto = () => {
        if (dataProductos.length === 0 ){
            getAllProductos()
        }
        if (dataEmbalaje.length === 0 ) {
            getAllEmbalajes()
        }
    }

    const getAllProductos = () => {
        const url = `${process.env.REACT_APP_API_URL}/Productos/GetListado`;
        axios.get(url, {headers}).then(respuesta => {
            setDataProductos(respuesta.data)
        });
    }

    const handleAceptar = (data)=>{
        var index = dataPaquetes.findIndex(d=> d.m_nIdPaquete == row)
        if(index !=-1){
            dataPaquetes[index].m_nClaveSATProducto = dataComplemento.claveProducto;
            dataPaquetes[index].m_sProductoSAT = dataComplemento.ProductoSAT;
            dataPaquetes[index].m_nClaveSATUnidad = dataComplemento.claveUnidad;
            dataPaquetes[index].m_sUnidadSAT = dataComplemento.UnidadSAT;
            dataPaquetes[index].m_sClaveEmbalaje = dataComplemento.claveEmbalaje;
            dataPaquetes[index].m_sEmbalajeSAT = dataComplemento.embalajeSAT;
            console.log(dataPaquetes)
            onChangeList(dataPaquetes)
            showSuccess("Complemento Agregado!")
            dialogVisible(false)
        }


    }

    function dialogVisible(isVisible){
        setOpenDialog(isVisible)

    }

    function getAllEmbalajes() {
        obtenerEmbalajes().then((respuesta) => {
            setDataEmbalaje(respuesta.data);
        });
    }

    function getAllSATServicios() {
        obtenerSATServicios().then((respuesta) => {
            setDataSAT(respuesta.data);
        });
    }

    const getAllSATEmbalajes = () => {
        obtenerSATEmbalajes().then((respuesta) => {
            setDataSATEmbalajes(respuesta.data );
        });
    }

    function  getAllSATUnidades() {
        obtenerSATUnidades().then((respuesta) => {
            setDataSATUnidades(respuesta.data );
        });
    }

    return(
        <div>
            <Dialog open={openDialog} fullWidth maxWidth="lg" >
                <DialogTitle>Complemeto Carta Porte</DialogTitle>
                <DialogContent>
                    {
                        openDialog &&
                        <CrearConcepto handleAceptar={handleAceptar} dialogVisible={dialogVisible} consulta={disabled}
                                       dataComplemento={dataComplemento} dataSAT={dataSAT}
                                       dataSATUnidades={dataSATUnidades}
                                       dataSATEmbalajes={dataSATEmbalajes}
                                       onChangeData={handleChangeComplementoSat}
                        />

                    }
                </DialogContent>
            </Dialog>
            <Grid container>
                <Grid item xs={6}>
                    <div className="widget-header">
                        <h2>Paquetes y sobres</h2>
                    </div>
                </Grid>
            </Grid>

            <div className="widget-container">
                <div className="widget-content">
                    { !disabled &&
                        <div className="row">
                            <Grid container spacing={1}>
                                <Grid item xs={2}>
                                    <label className="input select">
                                        <FormControl fullWidth variant="outlined" margin="dense" required>
                                            <InputLabel id="m_nIdTipoEmbalajeLabel">Tipo de paquete</InputLabel>
                                            <Select
                                                label="Tipo de paquete"
                                                labelId="m_nIdTipoLabel"
                                                className="form-control"
                                                value={paquete.m_nIdTipo}
                                                disabled={disabled}
                                                onChange={(event) => handleChangePaquetev2(event)}
                                                id="m_nIdTipo"
                                                name="m_nIdTipo"
                                            >
                                                <option key={2} value={2}>
                                                    Paquete
                                                </option>
                                                <option key={1} value={1}>
                                                    Sobre
                                                </option>
                                            </Select>
                                        </FormControl>
                                        <i className="fa fa-arrow-down"/>
                                    </label>
                                </Grid>
                                {paquete.m_nIdTipo != 1 &&
                                <Grid item xs={2}>
                                    <div className="input">
                                        <Autocomplete
                                            value={paquete.producto}
                                            freeSolo
                                            onChange={(event, newValue) => handleChangePaqueteProductov2(event, newValue)}
                                            // disableClearable
                                            forcePopupIcon={false}
                                            options={dataProductos}
                                            disabled={disabled}
                                            getOptionLabel={(option) => `${option.m_nNoProducto}-${option.m_sDescripcion}`}
                                            variant="outlined"
                                            name={"producto"}
                                            style={{transform: "translate(14px, 10px) scale(1) !important"}}
                                            renderInput={(params) =>
                                                <TextField
                                                    variant="outlined"
                                                    label="Producto"
                                                    margin="dense"
                                                    onClick={handleClickProducto}
                                                    {...params}
                                                />
                                            }
                                        />
                                    </div>
                                </Grid>
                                }
                                {paquete.m_nIdTipo != 1 &&
                                <Grid item xs={1}>
                                    <div className="input">
                                        <TextField variant="outlined" margin="dense"
                                                   onChange={(event) => handleChangePaquetev2(event)}
                                                   className="form-control"
                                                   type="text"
                                                   value={paquete.m_rLargo}
                                                   label="Largo"
                                                   disabled={disabled}
                                                   placeholder="cms"
                                                   name="m_rLargo"
                                        />
                                    </div>
                                </Grid>
                                }
                                {paquete.m_nIdTipo != 1 &&
                                <Grid item xs={1}>
                                    <div className="input">
                                        <TextField variant="outlined" margin="dense"
                                                   onChange={(event) => handleChangePaquetev2(event)}
                                                   className="form-control"
                                                   type="text"
                                                   label="Ancho"
                                                   value={paquete.m_rAncho}
                                                   disabled={disabled}
                                                   placeholder="cms"
                                                   name="m_rAncho"
                                        />
                                    </div>
                                </Grid>
                                }
                                {paquete.m_nIdTipo != 1 &&
                                <Grid item xs={1}>
                                    <div className="input">
                                        <TextField variant="outlined" margin="dense"
                                                   onChange={(event) => handleChangePaquetev2(event)}
                                                   className="form-control"
                                                   type="text"
                                                   value={paquete.m_rAlto}
                                                   label="Alto"
                                                   disabled={disabled}
                                                   placeholder="cms"
                                                   name="m_rAlto"
                                        />
                                    </div>
                                </Grid>
                                }
                                {paquete.m_nIdTipo != 1 &&
                                <Grid item xs={1}>
                                    <div className="input">
                                        <TextField variant="outlined" margin="dense"
                                                   onChange={(event) => handleChangePaquetev2(event)}
                                                   className="form-control"
                                                   type="text"
                                                   label="Peso"
                                                   value={paquete.m_rPeso}
                                                   disabled={disabled}
                                                   placeholder="kg"
                                                   name="m_rPeso"
                                        />
                                    </div>
                                </Grid>
                                }
                                {paquete.m_nIdTipo != 1 &&
                                <Grid item xs={1}>
                                    <div className="input">
                                        <TextField variant="outlined" margin="dense"
                                            // onChange={(event) => handleChangePaquete(event, index)}
                                                   className="form-control"
                                                   type="text"
                                                   value={paquete.m_rVolumen}
                                                   label="Volumen"
                                                   disabled
                                                   placeholder="cm3"
                                                   name="m_rVolumen"
                                        />
                                    </div>
                                </Grid>
                                }
                                {paquete.m_nIdTipo != 1 &&
                                <Grid item xs={1}>
                                    <label className="input select">
                                        <FormControl fullWidth variant="outlined" margin="dense">
                                            <InputLabel id="m_nIdTipoEmbalajeLabel">Embalaje</InputLabel>
                                            <Select
                                                label="Embalaje"
                                                labelId="m_nIdTipoEmbalajeLabel"
                                                className="form-control"
                                                value={paquete.m_nIdTipoEmbalaje}
                                                disabled={disabled}
                                                onChange={(event) => handleChangePaquetev2(event)}
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
                                </Grid>
                                }
                                {/*{paquete.m_nIdTipo != 1 &&
                            <Grid item xs={2}>
                                <div className="input">
                                    <TextField variant="outlined" margin="dense"
                                               onChange={(event) => handleChangePaquetev2(event)}
                                               className="form-control"
                                               type="text"
                                               label="Valor Declarado"
                                               value={paquete.m_cyValorDeclarado}
                                               disabled={disabled}
                                               placeholder="$"
                                               name="m_cyValorDeclarado"
                                    />
                                </div>
                            </Grid>
                            }*/}
                                <Grid item xs={5}>
                                    <div className="input">
                                        <TextField variant="outlined" margin="dense"
                                                   onChange={(event) => handleChangePaquetev2(event)}
                                                   className="form-control"
                                                   type="text"
                                                   label="Descripción"
                                                   value={paquete.m_sDescripcion}
                                                   disabled={disabled}
                                                   placeholder="Descripción"
                                                   name="m_sDescripcion"
                                        />
                                    </div>
                                </Grid>
                                {paquete.m_nIdTipo != 1 &&
                                <Grid item xs={1}>
                                    <div className="input">
                                        <TextField variant="outlined" margin="dense"
                                                   onChange={(event) => handleChangePaquetev2(event)}
                                                   className="form-control"
                                                   type="text"
                                                   label="Ctd"
                                                   value={paquete.m_nCantidad}
                                                   disabled={disabled}
                                                   placeholder="Ctd"
                                                   name="m_nCantidad"
                                        />
                                    </div>
                                </Grid>
                                }
                                {paquete.m_nIdTipo != 1 &&
                                <Grid item xs={5}>
                                    <div className="input">
                                        <TextField variant="outlined" margin="dense"
                                                   onChange={(event) => handleChangePaquetev2(event)}
                                                   className="form-control"
                                                   type="text"
                                                   label="Observaciones"
                                                   value={paquete.m_sObservaciones}
                                                   disabled={disabled}
                                                   placeholder="Observaciones"
                                                   name="m_sObservaciones"
                                        />
                                    </div>
                                </Grid>
                                }
                                <Grid item xs={1}>
                                    <IconButton onClick={addPaquetev2} style={{padding: "0px"}} disabled={disabled}>
                                        <AddBoxIcon style={{fill: "green", fontSize: "xx-large"}}/>
                                    </IconButton>
                                    <IconButton onClick={removePaquetev2} style={{padding: "0px"}} disabled={disabled}>
                                        <DeleteIcon style={{fill: "red", fontSize: "xx-large"}}/>
                                    </IconButton>
                                </Grid>
                            </Grid>
                        </div>
                    }


                    {!disabled?  <div className="row" style={{ height: 200}}>
                        <DataGrid
                            localeText={dataGridLocaleText}
                            density="compact"
                            pageSize={10}
                            columns={columnsPaquetes}
                            rows={dataPaquetes}
                            getRowId={(row) => row.m_nIdPaquete}
                        />
                    </div> : <div className="row" style={{ height: 200}}>
                        <DataGrid
                            localeText={dataGridLocaleText}
                            density="compact"
                            pageSize={10}
                            columns={columnsPaquetesConsulta}
                            rows={dataPaquetes}
                            getRowId={(row) => row.m_nIdPaquete}
                        />
                    </div>}
                </div>
            </div>
        </div>
    )
}

export default Paquetes;