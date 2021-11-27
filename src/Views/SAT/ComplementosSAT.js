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
import PublishIcon from '@material-ui/icons/Publish';
import {DataGrid} from "@material-ui/data-grid";
import CrearConcepto from '../ConceptosFacturacion/CrearConcepto';
import {dataGridLocaleText} from "../../Constants";
import Noty from "noty";

import {
    obtenerSATEmbalajes,
    obtenerSATServicios,
    obtenerSATUnidades,
} from "../../Util/Contexts/ConceptosFacturacionContext";

function showSuccess(mensaje) {
    new Noty({
        type: "information",
        layout: "topCenter",
        text: mensaje,
        timeout: "3000"
    }).show()
}
function ComplementosSAT(props) {

    const [openDialog, setOpenDialog] = useState(false)
    const [dataComplemento, setDataComplemento] = useState({
        id:0,
        cantidad:0,
        claveProducto: '',
        claveUnidad: '',
        claveFraccion:'',
        comercioExterior: '',
        esPeligroso: false,
        claveMaterialPeligroso: '',
        claveEmbalaje:'',
        embalajeSAT:'',
        peso: '',
        UnidadSAT: '',
        ProductoSAT: '',
        fraccionSAT:'',
        materialPeligrosoSAT:'',
    })

    const [dataSAT, setDataSAT] = useState([])
    const [dataSATUnidades, setDataSATUnidades] = useState([])
    const [dataSATEmbalajes, setDataSATEmbalajes] = useState([])

    const resetDataComplemento = () => {
        setDataComplemento({
            id:0,
            cantidad:0,
            claveProducto: '',
            claveUnidad: '',
            claveFraccion:'',
            comercioExterior: '',
            esPeligroso: false,
            claveMaterialPeligroso: '',
            claveEmbalaje:'',
            embalajeSAT:'',
            peso: '',
            UnidadSAT: '',
            ProductoSAT: '',
            fraccionSAT:'',
            materialPeligrosoSAT:'',
        })
    }

    function RowMenuCell(propss) {
        const {row} = propss;

        const handleDeleteClick = (event) => {
            event.stopPropagation();
            props.onChangeList(props.dataList.filter(item => item.id !== row.id))
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

            setDataComplemento(row);
            console.log(row);
            setOpenDialog(true);
        };

        return (
            <div>
                <IconButton color="primary" size="small" aria-label="save" onClick={handleOpenClick}>
                    <EditIcon fontSize="large" />
                </IconButton>
                <IconButton color="inherit" size="small" aria-label="delete" onClick={handleDeleteClick}>
                    <DeleteIcon fontSize="large" />
                </IconButton>
            </div>
        );
    }

    const columnsPaquetes = React.useMemo(() => [
        {
            headerName: "Cantidad",
            field: "cantidad",
            type:'number',
            valueFormatter: ({ value }) => `${value}`,
            flex: 1,
            headerAlign: 'left',
            align: 'left',
        },
        {
            headerName: "Categoría",
            field: "m_sCategoria",
            flex: 1,
        },
        {
            headerName: "Clave Producto",
            field: "claveProducto",
            flex: 1,
        },
        {
            headerName: "Descripción",
            field: "ProductoSAT",
            flex: 1,
        },
        {
            headerName: 'Acciones',
            field: 'complementos',
            renderCell: RowMenuCell,
            sortable: false,
            flex:1,
            filterable: false,
        }
    ]);

    const handleChangeComplementoSat = (idComplemento, data) => {
        if (idComplemento === 1){
            console.log(data.m_sClaveSAT)
            console.log(data.m_sDescripcion)
            setDataComplemento(dataComplemento =>{
                return {
                    ...dataComplemento,
                    claveProducto: data.m_sClaveSAT,
                    ProductoSAT: data.m_sDescripcion,
                }
            });
        }else if (idComplemento === 2){
            setDataComplemento(dataComplemento =>{
                return {
                    ...dataComplemento,
                    claveUnidad: data.m_sClaveSAT,
                    UnidadSAT: data.m_sDescripcion,
                }
            });
        }else if (idComplemento === 3){
            setDataComplemento(dataComplemento =>{
                return {
                    ...dataComplemento,
                    claveEmbalaje: data.m_sClaveSAT,
                    embalajeSAT: data.m_sDescripcion
                }
            });
        }else if (idComplemento === 4){
            setDataComplemento(dataComplemento =>{
                return {
                    ...dataComplemento,
                    claveFraccion: data.m_sClaveSAT,
                    fraccionSAT: data.m_sDescripcion
                }
            });
        }else if (idComplemento === 5){
            setDataComplemento(dataComplemento =>{
                return {
                    ...dataComplemento,
                    claveMaterialPeligroso: data.m_sClaveSAT,
                    materialPeligrosoSAT: data.m_sDescripcion
                }
            });
        }else{
            if (data.target.name === "esPeligroso"){
                setDataComplemento(dataComplemento =>{
                    return {
                        ...dataComplemento,
                        [data.target.name]: data.target.checked,
                    }
                });
            }else{
                setDataComplemento(dataComplemento =>{
                    return {
                        ...dataComplemento,
                        [data.target.name]: data.target.value,
                    }
                });
            }

        }
    }

    const handleAceptar = (data)=>{
        debugger
        if (dataComplemento.id === 0){
            const item = dataComplemento
            item.id = Math.floor(Math.random() * 10000)
            props.dataList.push(item);
            props.onChangeList(props.dataList)
        }else{
            props.dataList.forEach(item => {
                if (item.id === dataComplemento.id){
                    item.id = dataComplemento.id
                    item.cantidad = dataComplemento.cantidad
                    item.claveProducto = dataComplemento.claveProducto
                    item.claveUnidad = dataComplemento.claveUnidad
                    item.claveFraccion = dataComplemento.claveFraccion
                    item.comercioExterior = dataComplemento.comercioExterior
                    item.esPeligroso = dataComplemento.esPeligroso
                    item.claveMaterialPeligroso = dataComplemento.claveMaterialPeligroso
                    item.UnidadSAT = dataComplemento.UnidadSAT
                    item.ProductoSAT = dataComplemento.ProductoSAT
                    item.claveEmbalaje = dataComplemento.claveEmbalaje
                    item.embalajeSAT = dataComplemento.embalajeSAT
                    item.peso = dataComplemento.peso
                    item.fraccionSAT = dataComplemento.fraccionSAT
                    item.materialPeligroso = dataComplemento.materialPeligroso
                }
            })
            props.onChangeList(props.dataList)
        }


        resetDataComplemento()
        showSuccess("Complemento Agregado!")
        dialogVisible(false)


    }

    function dialogVisible(isVisible){
        setOpenDialog(isVisible)

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

        resetDataComplemento()
        setOpenDialog(true);
    };

    const handleImportClick = () => {

    }

    return(
        <div>
            <Dialog open={openDialog} fullWidth maxWidth="md" >
                <DialogTitle>Complemeto Carta Porte</DialogTitle>
                <DialogContent>
                    {
                        openDialog &&
                        <CrearConcepto handleAceptar={handleAceptar}
                                       dialogVisible={dialogVisible}
                                       consulta={props.disabled}
                                       dataComplemento={dataComplemento}
                                       dataSAT={dataSAT}
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
                        <h2>Complementos SAT</h2>
                    </div>
                </Grid>
            </Grid>

            <div className="widget-container">
                <div className="widget-content">
                    <div className="row">
                        <Grid container spacing={1} >
                            {/*<Grid item xs={2}>
                                <label className="input select">
                                    <FormControl fullWidth variant="outlined" margin="dense" required>
                                        <InputLabel id="m_nIdTipoEmbalajeLabel">Tipo de paquete</InputLabel>
                                        <Select
                                            label="Tipo de paquete"
                                            labelId="m_nIdTipoLabel"
                                            className="form-control"
                                            value={paquete.m_nIdTipo}
                                            disabled={props.disabled}
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
                                        disabled={props.disabled}
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
                                               disabled={props.disabled}
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
                                               disabled={props.disabled}
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
                                               disabled={props.disabled}
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
                                               disabled={props.disabled}
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
                                    <FormControl fullWidth variant="outlined" margin="dense" >
                                        <InputLabel id="m_nIdTipoEmbalajeLabel">Embalaje</InputLabel>
                                        <Select
                                            label="Embalaje"
                                            labelId="m_nIdTipoEmbalajeLabel"
                                            className="form-control"
                                            value={paquete.m_nIdTipoEmbalaje}
                                            disabled={props.disabled}
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
                            {paquete.m_nIdTipo != 1 &&
                            <Grid item xs={2}>
                                <div className="input">
                                    <TextField variant="outlined" margin="dense"
                                               onChange={(event) => handleChangePaquetev2(event)}
                                               className="form-control"
                                               type="text"
                                               label="Valor Declarado"
                                               value={paquete.m_cyValorDeclarado}
                                               props.disabled={props.disabled}
                                               placeholder="$"
                                               name="m_cyValorDeclarado"
                                    />
                                </div>
                            </Grid>
                            }
                            <Grid item xs={5}>
                                <div className="input">
                                    <TextField variant="outlined" margin="dense"
                                               onChange={(event) => handleChangePaquetev2(event)}
                                               className="form-control"
                                               type="text"
                                               label="Descripción"
                                               value={paquete.m_sDescripcion}
                                               disabled={props.disabled}
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
                                               disabled={props.disabled}
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
                                               disabled={props.disabled}
                                               placeholder="Observaciones"
                                               name="m_sObservaciones"
                                    />
                                </div>
                            </Grid>
                            }*/}
                            <Grid item xs={10}/>
                            <Grid item xs={2}>
                                <IconButton onClick={handleOpenClick} style={{ padding: "0px" }} disabled={props.disabled}>
                                    <AddBoxIcon style={{ fill: "green", fontSize: "xx-large" }} />
                                </IconButton>
                                {/*<IconButton onClick={removePaquetev2} style={{ padding: "0px" }} disabled={props.disabled}>
                                    <DeleteIcon style={{ fill: "red", fontSize: "xx-large" }} />
                                </IconButton>*/}
                                <IconButton onClick={handleImportClick} style={{ padding: "0px" }} disabled={props.disabled}>
                                    <PublishIcon style={{ fill: "blue", fontSize: "xx-large" }} />
                                </IconButton>
                            </Grid>
                        </Grid>
                    </div>
                    <div className="row" style={{ height: 200}}>
                        <DataGrid
                            localeText={dataGridLocaleText}
                            density="compact"
                            pageSize={10}
                            columns={columnsPaquetes}
                            rows={props.dataList}
                            getRowId={(row) => row.id}
                        />
                    </div>

                </div>
            </div>
        </div>
    )
}

export default ComplementosSAT;