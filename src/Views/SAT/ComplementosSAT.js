import React, {useEffect, useState} from "react";
import {Checkbox, FormControl, FormControlLabel, Grid, InputLabel, Select} from "@mui/material";
import { Button, Dialog, DialogActions, DialogContent, DialogTitle, Tooltip } from '@mui/material';
import Autocomplete from '@mui/material/Autocomplete';
import TextField from "@mui/material/TextField";
import IconButton from "@mui/material/IconButton";
import AddBoxIcon from "@mui/icons-material/AddBox";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from '@mui/icons-material/Edit';
import SaveIcon from "@mui/icons-material/Save";
import PublishIcon from '@mui/icons-material/Publish';
import {DataGrid} from "@mui/x-data-grid";
import CrearConcepto from '../ConceptosFacturacion/CrearConcepto';
import {dataGridLocaleText} from "../../Constants";
import Noty from "noty";
import GetAppIcon from '@mui/icons-material/GetApp';
import ExcelFile from '../../Files/ImportarMateriales_Consolidado.xlsx'
import * as XLSX from "xlsx";
import {
    obtenerSATEmbalajes, obtenerSATFraccionArancelaria, obtenerSATMaterialPeligroso, obtenerSATPaginado,
    obtenerSATServicios,
    obtenerSATUnidades,
} from "../../Util/Contexts/ConceptosFacturacionContext";
import { confirmAlert } from "react-confirm-alert";
import e from "cors";
import { id } from "date-fns/locale";
import {validarComplementoSat} from "../../Util/Contexts/SATContext";
function showSuccess(mensaje) {
    new Noty({
        type: "information",
        layout: "topCenter",
        text: mensaje,
        timeout: "3000"
    }).show()
}
function showError(mensaje) {
    new Noty({
        type: "warning",
        layout: "topCenter",
        text: mensaje,
        timeout: "8000"
    }).show()
}

function ComplementosSAT(props) {
    const [detectarModificaciones,setDetectar]=useState(false)
    const [seleccionable, setSeleccionable] = useState(false)
    const [rowSelectionModel, setRowSelectionModel] = React.useState([]);
    const [openDialog, setOpenDialog] = useState(false)
    const [dataComplemento, setDataComplemento] = useState({
        id:0,
        cantidad:1,
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
        sectorCOFEPRIS:'',
        descripcionSectorCOFEPRIS:'',
        formaFarmaceutica:'',
        claveFormaFarmaceutica:'',
        claveCondicionesEspeciales:'',
        condicionEspecial:'',
    })
    useEffect(() => {
         if( detectarModificaciones){
             window.onbeforeunload=confirmExit
         }
     }, [dataComplemento])
     function confirmExit()
     {
 
       return "show warning";
     }

    const resetDataComplemento = (catalogo) => {
        if(catalogo == 1){
            setDataComplemento(dataComplemento =>{
                return{
                    ...dataComplemento,
                    claveProducto: '',
                    ProductoSAT: '',
                }
            })
        }else if(catalogo == 2){
            setDataComplemento(dataComplemento => {
                return{
                    ...dataComplemento,
                    claveUnidad: '',
                    UnidadSAT: '',
                }
            })
        }else if(catalogo == 3){
            setDataComplemento(dataComplemento => {
                return{
                    ...dataComplemento,
                    claveMaterialPeligroso: '',
                    materialPeligrosoSAT:'',
                }
            })
        }else if(catalogo == 4){
            setDataComplemento(dataComplemento =>{
                return{
                    ...dataComplemento,
                    claveEmbalaje:'',
                    embalajeSAT:'',
                    descripcionEmbalajeSAT:''
                }
            })
        }else if(catalogo == 5){
            setDataComplemento(dataComplemento =>{
                return{
                    ...dataComplemento,
                    claveFraccion:'',
                    fraccionSAT:'',
                }
            })
        }else if(catalogo == 6){
            setDataComplemento(dataComplemento =>{
                return{
                    ...dataComplemento,
                    claveFormaFarmaceutica:'',
                    formaFarmaceutica:'',
                }
            })
        }
        else if(catalogo == 8){
            setDataComplemento(dataComplemento =>{
                return{
                    ...dataComplemento,
                    claveCondicionesEspeciales:'',
                    condicionEspecial:'',
                }
            })
        }
        else{
            setDataComplemento(dataComplemento => {
                return {
                    ...dataComplemento,
                    id:0,
                    cantidad:1,
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
                    sectorCOFEPRIS: '',
                    descripcionSectorCOFEPRIS:'',
                    denominacionGenerica:'',
                    denominacionDistintiva:'',
                    fabricante:'',
                    fechaCaducidad:'',
                    loteMedicamento:'',
                    claveFormaFarmaceutica: '',
                    formaFarmaceutica: '',
                    claveCondicionesEspeciales: '',
                    condicionEspecial: '',
                    regSanitario_folioAut:'',
                    nombreIngredienteActivo:'',
                    nomQuimico:'',
                    numCAS:'',
                    numRegSanPlagCOFEPRIS:'',
                    datosFabricante:'',
                    datosFormulador:'',
                    datosMaquilador:'',
                    usoAutorizado:'',
                }
            })
        }
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
                    }
                    if(row.sectorCOFEPRIS && row.sectorCOFEPRIS>0){
                        row.esFarmaco=true
                        obtenerSATPaginado(1, 0,"c_SectorCOFEPRIS", row.sectorCOFEPRIS).then((respuesta) => {
                            row.descripcionSectorCOFEPRIS = respuesta.data[0].m_sDescripcion
                            if(row.sectorCOFEPRIS>=1 && row.sectorCOFEPRIS<=3){
                                obtenerSATPaginado(1, 0,"c_FormaFarmaceutica", row.claveFormaFarmaceutica).then((respuesta) => {
                                    row.formaFarmaceutica = respuesta.data[0].m_sDescripcion
                                    obtenerSATPaginado(1, 0,"c_CondicionesEspeciales", row.claveCondicionesEspeciales).then((respuesta) => {
                                        row.condicionEspecial = respuesta.data[0].m_sDescripcion
                                        setDataComplemento(row)
                                        setOpenDialog(true)
                                    })
                                })}
                            else{
                                 setDataComplemento(row)
                                setOpenDialog(true)
                            }
                        })
                    }
                   if(!row.esFarmaco && !row.esPeligroso)
                    {
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
            headerName: "Peso (Kg)",
            field: "peso",
            flex: 1,
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
        /*{
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
        },*/
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
    ]);

    const handleChangeComplementoSat = (idComplemento, data,caracter) => {
       setDetectar(true)
        if (data.target?.name === "descripcionEmbalajeSAT"){
            setDataComplemento(dataComplemento =>{
                return {
                    ...dataComplemento,
                    descripcionEmbalajeSAT: data.target.value
                }
            });
            return;
        }
        if (idComplemento === 1){
            setDataComplemento(dataComplemento =>{
                return {
                    ...dataComplemento,
                    claveProducto: (data.m_sClaveSAT).toUpperCase(),
                    esPeligroso: data.m_bMaterialPeligroso? true:false,
                    esPeligrosoOpcional: data.m_bMaterialPeligrosoOpcional? true:false,
                    ProductoSAT: data.m_sDescripcion,
                }
            });
        }else if (idComplemento === 2){
            setDataComplemento(dataComplemento =>{
                return {
                    ...dataComplemento,
                    claveUnidad: (data.m_sClaveSAT).toUpperCase(),
                    UnidadSAT: data.m_sDescripcion,
                }
            });
        }else if (idComplemento === 3){
            setDataComplemento(dataComplemento =>{
                return {
                    ...dataComplemento,
                    claveEmbalaje: (data.m_sClaveSAT).toUpperCase(),
                    embalajeSAT: data.m_sDescripcion
                }
            });
        }else if (idComplemento === 4){
            setDataComplemento(dataComplemento =>{
                return {
                    ...dataComplemento,
                    claveFraccion: (data.m_sClaveSAT).toUpperCase(),
                    fraccionSAT: data.m_sDescripcion
                }
            });
        }else if (idComplemento === 5){
            setDataComplemento(dataComplemento =>{
                return {
                    ...dataComplemento,
                    claveMaterialPeligroso: (data.m_sClaveSAT).toUpperCase(),
                    materialPeligrosoSAT: data.m_sDescripcion
                }
            });
        }else  if (idComplemento === 7){
            setDataComplemento(dataComplemento =>{
                return {
                    ...dataComplemento,
                    ProductoSAT: data.m_sDescripcion

                }
            });
        } else if(idComplemento===6){
            setDataComplemento(dataComplemento=>{
                return{
                    ...dataComplemento,
                    claveFormaFarmaceutica:data.m_sClaveSAT.toUpperCase(),
                    formaFarmaceutica:data.m_sDescripcion
                }
            })
        }
        else if(idComplemento===8){
            setDataComplemento(dataComplemento=>{
                return{
                    ...dataComplemento,
                    claveCondicionesEspeciales:data.m_sClaveSAT.toUpperCase(),
                    condicionEspecial:data.m_sDescripcion
                }
            })
        }
        else if(idComplemento===9){
            setDataComplemento(dataComplemento=>{
                return{
                    ...dataComplemento,
                    sectorCOFEPRIS:data.m_sClaveSAT.toUpperCase(),
                    descripcionSectorCOFEPRIS:data.m_sDescripcion
                }
            })
        }
        else{
            if (data.target.name === "esPeligroso"){
                setDataComplemento(dataComplemento =>{
                    return {
                        ...dataComplemento,
                        [data.target.name]: data.target.checked,
                    }
                });
            }else if(data.target.name==="esFarmaco"){
                setDataComplemento(dataComplemento=>{
                    return{
                        ...dataComplemento,
                        [data.target.name]:data.target.checked,
                    }
                })
                if(!dataComplemento.esFarmaco)
                {
                    setDataComplemento(dataComplemento=>{
                        return{
                            ...dataComplemento,
                            sectorCOFEPRIS: '',
                            denominacionGenerica:'',
                            denominacionDistintiva:'',
                            fabricante:'',
                            fechaCaducidad:'',
                            loteMedicamento:'',
                            claveFormaFarmaceutica: '',
                            formaFarmaceutica: '',
                            claveCondicionesEspeciales: '',
                            condicionEspecial: '',
                            regSanitario_folioAut:'',
                            nombreIngredienteActivo:'',
                            nomQuimico:'',
                            numCAS:'',
                            numRegSanPlagCOFEPRIS:'',
                            datosFabricante:'',
                            datosFormulador:'',
                            datosMaquilador:'',
                            usoAutorizado:'',
                        }
                    })
                }
            }
            else{
                if(caracter){
                    const value = data.target.value;
                    const sanitizedValue = value.replace(/[^\w\s]/gi, '');
                    setDataComplemento(dataComplemento =>{
                        return {
                            ...dataComplemento,
                            claveUnidad: (sanitizedValue).toUpperCase(),
                        }
                    });
                }else{
                    setDataComplemento(dataComplemento =>{
                        return {
                            ...dataComplemento,
                            [data.target.name]: (data.target.value).toUpperCase(),
                        }
                    });
                }
            }

        }
    }

    const handleAceptar = (data)=>{
        console.log(dataComplemento)
        if(parseFloat(dataComplemento.cantidad) <=0){
            showSuccess("La cantidad debe ser mayor a cero.")
            return
        }
        if(parseFloat(dataComplemento.peso) <=0){
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
        if(dataComplemento.esFarmaco){
            if(!dataComplemento.sectorCOFEPRIS || !dataComplemento.sectorCOFEPRIS.length>0){
                showSuccess("Se requiere seleccionar Categoría de Fármaco")
                return;
            }
            else{
                if(!validarLlenadoTextBoxes(Number(dataComplemento.sectorCOFEPRIS)))
                    return;
            }
        }
        if (dataComplemento.id === 0){
            const item = dataComplemento
            item.id = Math.floor(Math.random() * 10000)
            let arrayNew=props.dataList
            arrayNew=[...arrayNew,item]
            props.onChangeList(arrayNew)
        }else{
            let arrayNew=props.dataList
            arrayNew.forEach(item => {
                if (item.id === dataComplemento.id){
                   // item=dataComplemento
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
                    item.sectorCOFEPRIS=dataComplemento.sectorCOFEPRIS
                    item.denominacionGenerica=dataComplemento.denominacionGenerica
                    item.denominacionDistintiva=dataComplemento.denominacionDistintiva
                    item.fabricante=dataComplemento.fabricante
                    item.fechaCaducidad=dataComplemento.fechaCaducidad
                    item.loteMedicamento=dataComplemento.loteMedicamento
                    item.claveFormaFarmaceutica=dataComplemento.claveFormaFarmaceutica
                    item.formaFarmaceutica=dataComplemento.formaFarmaceutica
                    item.claveCondicionesEspeciales=dataComplemento.claveCondicionesEspeciales
                    item.regSanitario_folioAut=dataComplemento.regSanitario_folioAut
                    item.nombreIngredienteActivo=dataComplemento.nombreIngredienteActivo
                    item.nomQuimico=dataComplemento.nomQuimico
                    item.numCAS=dataComplemento.numCAS
                    item.numRegSanPlagCOFEPRIS=dataComplemento.numRegSanPlagCOFEPRIS
                    item.datosFabricante=dataComplemento.datosFabricante
                    item.datosFormulador=dataComplemento.datosFormulador
                    item.datosMaquilador=dataComplemento.datosMaquilador
                    item.usoAutorizado=dataComplemento.usoAutorizado
                }
            })
            props.onChangeList(arrayNew)
        }


        resetDataComplemento()
        showSuccess("Complemento Agregado.")
        dialogVisible(false)

    }
    function validarLlenadoTextBoxes(numSector){
        let flag=false
        let lista=document.querySelectorAll("[id*=c" + numSector + "]");
        let array=[...lista]
        let index=0
        let currentLabel=''
        array.forEach(elemento=>{
            index++
            if(elemento.id.includes('label')){
                currentLabel=elemento.innerHTML
                return;
            }
            if(!elemento.id.includes('label') && elemento.value==''){
                //showSuccess("Se requiere rellenar el campo de "+clave1.name.toLowerCase())
                showSuccess("Se requiere rellenar el campo de "+currentLabel.toLowerCase())
                flag=true
                array.length=index+1;
            }
        })
        if(flag){return false}
        else{return true}
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
    async function readExcel(file){
        const promise = new Promise((resolve, reject) => {
            const fileReader = new FileReader();
            fileReader.readAsArrayBuffer(file);
            fileReader.onload = (e) => {
                const bufferArray = e.target.result;
                const wb = XLSX.read(bufferArray, { type: "buffer" });
                const wsname = wb.SheetNames[0];
                const ws = (wb.Sheets[wsname]);
                const data = XLSX.utils.sheet_to_json(ws, {range:2});
                resolve(data);
            };
            fileReader.onerror = (error) => {
                reject(error);
            };
        });

        promise.then(async (d) => {
            console.log(d);
            const newArray = d.map(item => (
                {
                    id: Math.floor(Math.random() * 10000),
                    cantidad: isNaN(parseInt(item.Cantidad)) ? 0 : parseInt(item.Cantidad),
                    peso: isNaN(parseFloat(item['Peso'])) ? 0 : parseFloat(item['Peso']),
                    claveProducto: item['Clave productos y servicios'] ? item['Clave productos y servicios'] : '',
                    claveUnidad: item['Clave Unidades de medida y embalaje'] ? item['Clave Unidades de medida y embalaje'] : '',
                    esPeligroso: item['Es material peligroso'] ? item['Es material peligroso'] === "SI" : false,
                    claveMaterialPeligroso: item['Es material peligroso'] === "SI" && item['Clave material peligroso'] ? item['Clave material peligroso'] : '',
                    claveEmbalaje: item['Es material peligroso'] === "SI" && item['Clave Embalaje'] ? item['Clave Embalaje'] : '',
                    descripcionEmbalajeSAT: item['Es material peligroso'] === "SI" && item['Descripción embalaje'] ? item['Descripción embalaje'] : '',
                    claveFraccion: item['Es material peligroso'] === "SI" && item['Clave Fraccion'] ? item['Clave Fraccion'].toString() : ''
                }))
            console.log(newArray)
            let hayErrores = false
            let completeErrorMessage = ''
            for (let i = 0; i < newArray.length; i++) {
                if (newArray[i].cantidad === 0) {
                    // showError(`Cantidad no válida en registro número '${i + 1}'.`)
                    completeErrorMessage += `Cantidad no válida en registro número '${i + 1}'.<br />`
                    hayErrores = true
                }
                if (newArray[i].peso === 0) {
                    // showError(`Peso no válido en registro número '${i + 1}'.`)
                    completeErrorMessage += `Peso no válido en registro número '${i + 1}'.<br />`
                        hayErrores = true
                }
                if (newArray[i].claveProducto.length === 0) {
                    // showError(`Clave de producto no válida en registro número '${i + 1}'.`)
                    completeErrorMessage += `Clave de producto no válida en registro número '${i + 1}'.<br />`
                    hayErrores = true
                } else {
                    await validarComplementoSat(CATALOGOS_SAT.PRODUCTOS_SERVICIOS, newArray[i].claveProducto).then(({data}) => {
                        if (data.success) {
                            newArray[i].claveProducto = data.message
                        } else {
                            // showError(`Clave de producto no válida en registro número '${i + 1}'. La clave no existe.`)
                            completeErrorMessage += `Clave de producto no válida en registro número '${i + 1}'. La clave no existe.<br />`
                            hayErrores = true
                        }
                    })
                }
                if (newArray[i].claveUnidad.length === 0) {
                    // showError(`Clave de unidad no válida en registro número '${i + 1}'.`)
                    completeErrorMessage += `Clave de unidad no válida en registro número '${i + 1}'.<br />`
                    hayErrores = true
                } else {
                    await validarComplementoSat(CATALOGOS_SAT.UNIDADES, newArray[i].claveUnidad).then(({data}) => {
                        if (data.success) {
                            newArray[i].claveUnidad = data.message
                        } else {
                            // showError(`Clave de unidad no válida en registro número '${i + 1}'. La clave no existe.`)
                            completeErrorMessage += `Clave de unidad no válida en registro número '${i + 1}'. La clave no existe.<br />`
                            hayErrores = true
                        }
                    })
                }
                if (newArray[i].esPeligroso === true) {
                    if (newArray[i].claveMaterialPeligroso.length === 0) {
                        // showError(`Clave material peligroso no válida en registro número '${i + 1}'.`)
                        completeErrorMessage += `Clave material peligroso no válida en registro número '${i + 1}'.<br />`
                        hayErrores = true
                    } else {
                        await validarComplementoSat(CATALOGOS_SAT.MATERIAL_PELIGROSO, newArray[i].claveMaterialPeligroso).then(({data}) => {
                            if (data.success) {
                                newArray[i].claveMaterialPeligroso = data.message
                            } else {
                                // showError(`Clave material peligroso no válida en registro número '${i + 1}'. La clave no existe.`)
                                completeErrorMessage += `Clave material peligroso no válida en registro número '${i + 1}'. La clave no existe.<br />`
                                hayErrores = true
                            }
                        })
                    }
                    if (newArray[i].claveEmbalaje.length === 0) {
                        // showError(`Clave Embalaje no válida en registro número '${i + 1}'.`)
                        completeErrorMessage += `Clave Embalaje no válida en registro número '${i + 1}'.<br />`
                        hayErrores = true
                    } else {
                        await validarComplementoSat(CATALOGOS_SAT.EMBALAJE, newArray[i].claveEmbalaje).then(({data}) => {
                            if (data.success) {
                                newArray[i].claveEmbalaje = data.message
                            } else {
                                // showError(`Clave Embalaje no válida en registro número '${i + 1}'. La clave no existe.`)
                                completeErrorMessage += `Clave Embalaje no válida en registro número '${i + 1}'. La clave no existe.<br />`
                                hayErrores = true
                            }
                        })
                    }
                    if (newArray[i].descripcionEmbalajeSAT.length === 0) {
                        // showError(`Descripción embalaje no válida en registro número '${i + 1}'.`)
                        completeErrorMessage += `Descripción embalaje no válida en registro número '${i + 1}'.<br />`
                        hayErrores = true
                    }
                    if (newArray[i].claveFraccion.length === 0) {
                        // showError(`Clave Fraccion no válida en registro número '${i + 1}'.`)
                        completeErrorMessage += `Clave Fraccion no válida en registro número '${i + 1}'.<br />`
                        hayErrores = true
                    } else {
                        await validarComplementoSat(CATALOGOS_SAT.FRACCION_ARANCELARIA, newArray[i].claveFraccion).then(({data}) => {
                            if (data.success) {
                                newArray[i].claveFraccion = data.message.toString()
                            } else {
                                // showError(`Clave Fraccion no válida en registro número '${i + 1}'. La clave no existe.`)
                                completeErrorMessage += `Clave Fraccion no válida en registro número '${i + 1}'. La clave no existe.<br />`
                                hayErrores = true
                            }
                        })
                    }
                }
            }
            if (hayErrores) {
                completeErrorMessage += 'Favor de revisar el archivo.'
                console.log(completeErrorMessage)
                showError(completeErrorMessage)
                return
            }
            props.onChangeList(newArray)
            // props.dataList.push(newArray)
        });
    };
    const removerSeleccion=()=>{
        let complementosFiltrados=props.dataList
        rowSelectionModel.forEach(id=>{
            complementosFiltrados=complementosFiltrados.filter((comp)=>comp.id!=id)
        })
        props.setDataList(complementosFiltrados)
        setRowSelectionModel([])
        setSeleccionable(false)
    }

    return (
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
                                       setDataComplemento={setDataComplemento}
                                       onChangeData={handleChangeComplementoSat}
                                       resetComplemento={resetDataComplemento}
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
                    <IconButton
                        onClick={handleOpenClick}
                        style={{ padding: "0px" }}
                        disabled={props.disabled}
                        size="large">
                        <AddBoxIcon style={{ fill: "green", fontSize: "xx-large" }} />
                    </IconButton>
                </Tooltip>
                </Grid>
                <Grid item xs={1}>
                    <input id={"icon-button-file"} type={"file"} accept={"xlsx"} onChange={handleImportClick} onClick={handleCleanExcel} style={{ padding: "0px",display: "none" }} disabled={props.disabled}/>
                    <label htmlFor="icon-button-file">
                    <Tooltip title="Cargar Plantilla" >
                        <IconButton
                            color="primary"
                            aria-label="upload file"
                            component="span"
                            style={{ padding: "0px" }}
                            disabled={props.disabled}
                            size="large">
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
                        <Button onClick={()=>{setSeleccionable(seleccionable?false:true)
                            setRowSelectionModel([])}
                        } className="btn btn-secondary" style={{visibility:props.dataList.length>0 && !props.disabled?'visible':'hidden',color:"white",marginLeft:"73%",fontSize:12}}>{seleccionable?'Cancelar':'Seleccionar para Borrar'}</Button>
                        <Button onClick={()=>confirmAlert({
                            title: 'Confirmación',
                            message: '¿Desea eliminar los complementos seleccionados?',
                            buttons: [
                                {
                                    label: 'Sí',
                                    onClick: async () => removerSeleccion()
                                },
                                {
                                    label: 'No',
                                }
                            ]
                        })} className="btn btn-primary" style={{visibility:seleccionable?'visible':'hidden',color:"white",marginLeft:"1%",fontSize:12}}>Borrar Selección</Button>
                        <div className="row" style={{ height: 200}}>
                            <DataGrid
                                localeText={dataGridLocaleText}
                                density="compact"
                                onRowSelectionModelChange={(e) => {
                                    setRowSelectionModel(e);
                                }}
                                rowSelectionModel={rowSelectionModel}
                                checkboxSelection={seleccionable}
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
    );
}

export default ComplementosSAT;

const CATALOGOS_SAT = {
    PRODUCTOS_SERVICIOS: 'c_ClaveProdServCP',
    UNIDADES: 'c_ClaveUnidad',
    MATERIAL_PELIGROSO: 'c_MaterialPeligroso',
    EMBALAJE: 'c_TipoEmbalaje',
    FRACCION_ARANCELARIA: 'c_FraccionArancelaria'
}