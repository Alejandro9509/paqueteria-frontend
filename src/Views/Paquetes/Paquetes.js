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
import {
    obtenerProductoById,
    obtenerProductos,
    obtenerProductosByConvenioCliente
} from "../../Util/Contexts/ProductosContext";
import {obtenerEmbalajes} from "../../Util/Contexts/EmbalajesContext";
import axios from "axios";
import Recoleccion from "../Recoleccion";
import {API_HEADERS} from "../../Constants"
import {
    obtenerSATEmbalajes,
    obtenerSATServicios,
    obtenerSATUnidades,
} from "../../Util/Contexts/ConceptosFacturacionContext";
import DialogoNuevoPaquete from "./DialogoNuevoPaquete";
const headers = API_HEADERS

function showSuccess(mensaje) {
    new Noty({
        type: "information",
        layout: "topCenter",
        text: mensaje,
        timeout: "3000"
    }).show()
}
function Paquetes({dataPaquetes = [],onChangeList, disabled, cliente = null,LimpiarProducto = false}) {

    function RowMenuCell(props) {
        const { api, id } = props;

        const handleDeleteClick = (event) => {
            event.stopPropagation();
            console.log()
            let row = dataPaquetes.find((p) => p.m_nIdPaquete === id);
            console.log(row)
            if (row){
                handleDelete(row);
            }

        };

        const handleEditClick = (event) => {
            event.stopPropagation();
            let row = dataPaquetes.find((p) => p.m_nIdPaquete === id);
            console.log(row)
            if (row){
                handleEdit(row);
            }

        };

        return (
          <div>
              <IconButton color="inherit" size="small" aria-label="delete" onClick={handleEditClick}>
                  <EditIcon fontSize="large"/>
              </IconButton>
              <IconButton color="inherit" size="small" aria-label="delete" onClick={handleDeleteClick}>
                  <DeleteIcon fontSize="large"/>
              </IconButton>
          </div>
        );
    }

    const handleEdit = (data) =>{
        if(!disabled){
            console.log(data)
            setPaquete(data)
        }
    }

    const handleDelete = (data) =>{
        if(!disabled){
            onChangeList(dataPaquetes.filter((i) => i.m_nIdPaquete != data.m_nIdPaquete))
        }
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
            width: 200,
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
            width: 100,
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
            width: 100,
        },
        !disabled &&
        {
            field: 'complementos',
            headerName: 'Acciones',
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

    const [paquete, setPaquete] = useState({
        producto:null,
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

    const addPaquetev2 = (data) => {

        console.log(data)
        let paq = data
        /*if (validarPaquetes(paq)){
            paq.m_nIdPaquete = paq.m_nIdPaquete != 0 ? paq.m_nIdPaquete : dataPaquetes.length + 1
            /!*paq.m_cyValorDeclarado = paq.m_cyValorDeclarado ? paq.m_cyValorDeclarado : 0
            if (paq.m_cyValorDeclarado === 0 && tieneSeguro){
                showSuccess("El campo de valor declarado es necesario para el seguro.")
                return
            }*!/

        }*/
        const arraynew = []
        if (dataPaquetes.find(item => item.m_nIdPaquete === data.m_nIdPaquete)){
            dataPaquetes.forEach(item => {
                if (item.m_nIdPaquete === data.m_nIdPaquete){
                    item = data
                }
                arraynew.push(item)
            })
        }else{
            dataPaquetes.push(paq);
            dataPaquetes.forEach(item => {
                arraynew.push(item)
            })
        }
        /*dataPaquetes.push(paq);
        resetPaquete()*/
        onChangeList(arraynew)
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

    return(
        <div>
            <div className="row">
                <DialogoNuevoPaquete
                    disabled={disabled || !cliente.m_nIdCliente}
                    agregar={addPaquetev2}
                    paquete={paquete}
                    resetPaquete={resetPaquete}
                    cliente={cliente}
                    LimpiarProducto={LimpiarProducto}
                />
            </div>

            <div className="widget-container">
                <div className="widget-content">

                    {
                        dataPaquetes.length !== 0 &&
                        (
                            <div className="row" style={{height: 200, width: "100%"}}>
                                <DataGrid
                                    localeText={dataGridLocaleText}
                                    density="compact"
                                    pageSize={10}
                                    columns={columnsPaquetes}
                                    rows={dataPaquetes}
                                    getRowId={(row) => row.m_nIdPaquete}
                                />
                            </div>
                        )

                    }


                </div>
            </div>
        </div>
    )
}

export default Paquetes;