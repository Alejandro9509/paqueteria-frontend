import React, {useEffect, useState} from "react";
import {Checkbox, FormControl, FormControlLabel, Grid, InputLabel, Select} from "@material-ui/core";
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
import GetAppIcon from '@material-ui/icons/GetApp';
import ExcelFile from '../../Files/ImportarMateriales_Consolidado.xlsx'
import * as XLSX from "xlsx";
import {
    obtenerSATEmbalajes, obtenerSATFraccionArancelaria, obtenerSATMaterialPeligroso, obtenerSATPaginado,
    obtenerSATServicios,
    obtenerSATUnidades,
} from "../../Util/Contexts/ConceptosFacturacionContext";
import { confirmAlert } from "react-confirm-alert";
import e from "cors";

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
        descripcionEmbalajeSAT:'',
        peso: 0,
        UnidadSAT: '',
        ProductoSAT: '',
        fraccionSAT:'',
        materialPeligrosoSAT:'',
    })


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
            descripcionEmbalajeSAT:'',
            peso: 0,
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
            confirmAlert({
                title: 'Confirmación',
                message: '¿Desea eliminar el complemento?',
                buttons: [{
                    label: 'Si',
                    onClick: ()=>{props.onChangeList(props.dataList.filter(item => item.id !== row.id))}
                },  {
                    label: 'No',
                    onClick: ()=>{return}
                }
            ]
        });
            
        };

        const handleOpenClick = (event) => {
            event.stopPropagation();
            resetDataComplemento()
           console.log("fila"+JSON.stringify(row))
            obtenerSATPaginado(1, 0,"c_ClaveUnidad", row.claveUnidad).then((respuesta) => {
              row.UnidadSAT = respuesta.data[0].m_sDescripcion   
                obtenerSATPaginado(1, 0,"c_ClaveProdServCP", row.claveProducto).then((respuesta) => {
                    row.ProductoSAT = respuesta.data[0].m_sDescripcion
                    if(row.esPeligroso){
                    obtenerSATPaginado(1, 0,"c_MaterialPeligroso", row.claveMaterialPeligroso).then((respuesta) => {
                        row.materialPeligrosoSAT = respuesta.data[0].m_sDescripcion
                        obtenerSATPaginado(1, 0,"c_TipoEmbalaje", row.claveEmbalaje).then((respuesta) => {
                            row.embalajeSAT = respuesta.data[0].m_sDescripcion
                            obtenerSATPaginado(1, 0,"c_FraccionArancelaria", row.claveFraccion).then((respuesta)=>{
                                row.fraccionSAT = respuesta.data[0].m_sDescripcion
                                setDataComplemento(row);
                                setOpenDialog(true);
                            })
                          }) 
                      }) 
                    }else{
                        setDataComplemento(row);
                        setOpenDialog(true);
                    }
                  }) 
         
            })
            console.log(row);
          
        };

        return (
            <div>
                {
                    !props.disabled &&
                    <IconButton color="primary" size="small" aria-label="save" onClick={handleOpenClick}>
                        <EditIcon fontSize="large" />
                    </IconButton>
                }
                {
                    !props.disabled &&
                    <IconButton color="inherit" size="small" aria-label="delete" onClick={handleDeleteClick}>
                        <DeleteIcon fontSize="large"/>
                    </IconButton>
                }
            </div>
        );
    }

    const RowMenuCellMaterialPeligroso = (propss) => {
        const {row} = propss;

        return (
            <div>
                {row.esPeligroso ? "Sí" : "No"}
            </div>
        );
    }

    const RowMenuCellClaveMaterialPeligroso = (propss) => {
        const {row} = propss;

        return (
            <div>
                {row.esPeligroso ? row.claveMaterialPeligroso : "No aplica"}
            </div>
        );
    }

    const columnsPaquetes = React.useMemo(() => [
        {
            headerName: 'Acciones',
            field: 'complementos',
            renderCell: RowMenuCell,
            sortable: false,
            width: 150,
            filterable: false,
        },
        {
            headerName: "Cantidad",
            field: "cantidad",
            type:'number',
            valueFormatter: ({ value }) => `${value}`,
            width: 130,
            headerAlign: 'left',
            align: 'left',
        },
        {
            headerName: "Clave producto o servicio",
            field: "claveProducto",
            width: 180,
        },
        {
            headerName: "Clave unidad",
            field: "claveUnidad",
            width: 180,
        },
        {
            headerName: "Clave fracción arancelaria",
            field: "claveFraccion",
            renderCell : (row) => {
                return (
                    <div>
                        {row.row.esPeligroso ? row.row.claveFraccion ? row.row.claveFraccion : "Indefinido"  : "No aplica"}
                    </div>
                )
            },
            width: 200,
        },
        {
            headerName: "Es material peligroso",
            field: "esPeligroso",
            renderCell: RowMenuCellMaterialPeligroso,
            width: 200,
        },
        {
            headerName: "Clave material peligroso",
            field: "claveMaterialPeligroso",
            renderCell: RowMenuCellClaveMaterialPeligroso,
            width: 200,
        },
        {
            headerName: "Clave embalaje",
            field: "claveEmbalaje",
            renderCell : (row) => {
                return (
                    <div>
                        {row.row.esPeligroso ? row.row.claveEmbalaje : "No aplica"}
                    </div>
                )
            },
            width: 180,
        },
        {
            headerName: "Tipo embalaje",
            field: "embalajeSAT",
            renderCell : (row) => {
                return (
                    <div>
                        {row.row.esPeligroso ? row.row.embalajeSAT : "No aplica"}
                    </div>
                )
            },
            width: 200,
        },
        {
            headerName: "Descripción embalaje",
            field: "descripcionEmbalajeSAT",
            renderCell : (row) => {
                return (
                    <div>
                        {row.row.esPeligroso ? row.row.descripcionEmbalajeSAT ? row.row.descripcionEmbalajeSAT : "Indefinido" : "No aplica"}
                    </div>
                )
            },
            width: 200,
        },
        {
            headerName: "Peso (Kg)",
            field: "peso",
            hide:true,
            flex: 1,
        },
    ]);

    const handleChangeComplementoSat = (idComplemento, data) => {
        if (idComplemento === 1){
            console.log(data.m_sClaveSAT)
            console.log(data.m_sDescripcion)
            setDataComplemento(dataComplemento =>{
                return {
                    ...dataComplemento,
                    claveProducto: data.m_sClaveSAT,
                    esPeligroso: data.m_bMaterialPeligroso,
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
        if(!parseFloat(dataComplemento.cantidad) > 0){
            showSuccess("La cantidad debe ser mayor a cero.")
            return
        }
        if(!parseFloat(dataComplemento.peso) > 0){
            showSuccess("El peso debe ser mayor a cero.")
            return
        }
        if(!dataComplemento.ProductoSAT  || !dataComplemento.claveProducto ){
            showSuccess("Se requiere seleccionar Producto")
            return
        }
        if(!dataComplemento.UnidadSAT  || !dataComplemento.claveUnidad ){
            showSuccess("Se requiere seleccionar Unidad de medida")
            return
        }
        if((!dataComplemento.materialPeligrosoSAT || !dataComplemento.claveMaterialPeligroso) && dataComplemento.esPeligroso){
            showSuccess("Se requiere seleccionar material peligroso")
            return
        }

        if((!dataComplemento.embalajeSAT || !dataComplemento.claveEmbalaje) && dataComplemento.esPeligroso ){
            showSuccess("Se requiere seleccionar Embalaje")
            return
        }
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
                    item.descripcionEmbalajeSAT = dataComplemento.descripcionEmbalajeSAT
                    item.peso = dataComplemento.peso
                    item.fraccionSAT = dataComplemento.fraccionSAT
                    item.materialPeligroso = dataComplemento.materialPeligroso
                }
            })
            props.onChangeList(props.dataList)
        }


        resetDataComplemento()
        showSuccess("Complemento Agregado.")
        dialogVisible(false)

    }

    function dialogVisible(isVisible){
        setOpenDialog(isVisible)

    }


    const handleOpenClick = (event) => {
        event.stopPropagation();

        resetDataComplemento()
        setOpenDialog(true);
    };

    const handleImportClick = (e) => {
        const file = e.target.files[0];
        readExcel(file);
    }

    const handleCleanExcel= (e)=>{
        e.target.value=null
    }
    const readExcel = (file) => {
        const promise = new Promise((resolve, reject) => {
            const fileReader = new FileReader();
            fileReader.readAsArrayBuffer(file);

            fileReader.onload = (e) => {
                const bufferArray = e.target.result;

                const wb = XLSX.read(bufferArray, { type: "buffer" });

                const wsname = wb.SheetNames[0];
                console.log(wsname)

                const ws = (wb.Sheets[wsname]);

                console.log(ws)

                const data = XLSX.utils.sheet_to_json(ws, {range:2});

                resolve(data);
            };

            fileReader.onerror = (error) => {
                reject(error);
            };
        });

        promise.then((d) => {
            console.log(d);
            const newArray = d.map(item => (
                {
                id: Math.floor(Math.random() * 10000),
                cantidad: item.Cantidad,
                peso: item['Peso']?item['Peso']:0,
                claveProducto: item['Clave productos y servicios'],
                claveUnidad: item['Clave Unidad'],
                esPeligroso:  item['Es material peligroso']? item['Es material peligroso'] !== "NO" : false,
                claveMaterialPeligroso: item['Es material peligroso'] == "SI"? item['Clave material peligroso']:0,
                claveEmbalaje:item['Es material peligroso'] == "SI"? item['Tipo embalaje']:0,
                descripcionEmbalajeSAT:item['Es material peligroso'] == "SI"?item['Descripción embalaje']:"",
                claveFraccion:item['Es material peligroso'] == "SI"? item['Clave Fraccion']:""
            }))
            console.log(newArray)
            // props.dataList.push(newArray)
            props.onChangeList(newArray)
        });
    };

    return(
        <div>
            <Dialog open={openDialog} fullWidth maxWidth="md" >
                <DialogTitle>Complemento Carta Porte</DialogTitle>
                <DialogContent>
                    {
                        openDialog &&
                        <CrearConcepto handleAceptar={handleAceptar}
                                       dialogVisible={dialogVisible}
                                       consulta={props.disabled}
                                       dataComplemento={dataComplemento}
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
                <Grid item xs={3}/>
                <Grid item xs={1}>
                <Tooltip title="Agregar Complemento" >
                    <IconButton onClick={handleOpenClick} style={{ padding: "0px" }} disabled={props.disabled}>
                        <AddBoxIcon style={{ fill: "green", fontSize: "xx-large" }} />
                    </IconButton>
                </Tooltip>
                </Grid>
                <Grid item xs={1}>
                    <input id={"icon-button-file"} type={"file"} accept={"xlsx"} onChange={handleImportClick} onClick={handleCleanExcel} style={{ padding: "0px",display: "none" }} disabled={props.disabled}/>
                    <label htmlFor="icon-button-file">
                    <Tooltip title="Cargar Plantilla" >
                        <IconButton color="primary" aria-label="upload file" component="span" style={{ padding: "0px" }} disabled={props.disabled}>
                            <PublishIcon style={{ fill: "blue", fontSize: "xx-large" }}/>
                        </IconButton>
                    </Tooltip>
                    </label>
                </Grid>
                <Grid item xs={1}>
                    <Tooltip title="Descargar Plantilla" >
                    <Button style={{ padding: "0px" }} disabled={props.disabled}>
                    <a href={ExcelFile} download="EstructuraComplementosSAT.xlsx">
                        Descargar Plantilla
                    </a> 
                    </Button>
                    </Tooltip>
                </Grid>
            </Grid>

            {
                props.dataList.length !== 0 &&
                <div className="widget-container">
                    <div className="widget-content">
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
            }

        </div>
    )
}

export default ComplementosSAT;