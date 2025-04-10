import React, {useState} from "react";
import { Button } from '@mui/material';
import IconButton from "@mui/material/IconButton";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from '@mui/icons-material/Edit';
import {DataGrid} from "@mui/x-data-grid";
import {dataGridLocaleText} from "../../Constants";
import Noty from "noty";
import {API_HEADERS} from "../../Constants"
import DialogoNuevoPaquete from "./DialogoNuevoPaquete";
import { confirmAlert } from "react-confirm-alert";

const headers = API_HEADERS

function showSuccess(mensaje) {
    new Noty({
        type: "information",
        layout: "topCenter",
        text: mensaje,
        timeout: "3000"
    }).show()
}

const TARIFA_POR_RANGOS = 2
const TARIFA_POR_REGION = 3

function Paquetes({dataPaquetes = [],setDataPaquetes,onChangeList, disabled, cliente = null,limpiarProducto = false,seCalculaTarifa, tipoTarifa=0, factorConversion=0.0, mostrarPesoFinal= true}) {

    function RowMenuCell(props) {
        const { api, id } = props;

        const handleDeleteClick = (event) => {
            event.stopPropagation();
            let row = dataPaquetes.find((p) => p.m_nIdPaquete === id);
            if (row){
                confirmAlert({
                    title: 'Confirmar Eliminar',
                    message: '¿Está seguro de eliminar el paquete?',
                    buttons: [
                        {
                            label: 'Si',
                            onClick: () => handleDelete(row)
                        },
                        {
                            label: 'No',
                        }
                    ]
                })
            }

        };

        const handleEditClick = (event) => {
            event.stopPropagation();
            let row = dataPaquetes.find((p) => p.m_nIdPaquete === id);
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
            setPaquete(data)
        }
    }

    const handleDelete = (data) =>{
        if(!disabled){
            onChangeList(dataPaquetes.filter((i) => i.m_nIdPaquete !== data.m_nIdPaquete))
        }
    }

    const columnsPaquetes = React.useMemo(() => [
        {
            headerName: "Cantidad",
            field: "m_nCantidad",
            type:'number',
            valueFormatter: ({ value }) => value ? `${value}pz`: '',
            width: 90,
        },
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
            headerName: "Embalaje",
            field: "m_sTipoEmbalaje",
            width: 130,
        },
        {
            headerName: "Peso",
            field: "m_rPeso",
            type:'number',
            valueFormatter: ({ value }) => value ? `${value}kg` : '',
            width: 90,
        },
        {
            headerName: "Largo",
            field: "m_rLargo",
            type:'number',
            valueFormatter: ({ value }) => value ? `${value}cm` : '',
            width: 90,
        },
        {
            headerName: "Ancho",
            field: "m_rAncho",
            type:'number',
            valueFormatter: ({ value }) => value ? `${value}cm` : '',
            width: 90,
        },
        {
            headerName: "Alto",
            field: "m_rAlto",
            type:'number',
            valueFormatter: ({ value }) => value ? `${value}cm` : '',
            width: 90,
        },
        {
            headerName: "Volumen",
            field: "m_rVolumen",
            type:'number',
            valueFormatter: ({ value }) => value ? `${value}cm3` : '',
            width: 120,
        },
        {
            headerName: "Descripción",
            field: "m_sDescripcion",
            width: 200,
        },
        {
            headerName: "Observaciones",
            field: "m_sObservaciones",
            width: 200,
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
    const [seleccionable, setSeleccionable] = useState(false)
    const [rowSelectionModel, setRowSelectionModel] = React.useState([]);

    let groupBy = function(xs, key) {
        return xs.reduce(function(rv, x) {
            (rv[x[key]] = rv[x[key]] || []).push(x);
            return rv;
        }, {});
    };

    let groupByArray = function (xs, key) {
        return xs.reduce(function (rv, x) {
            let v = key instanceof Function ? key(x) : x[key];
            let el = rv.find((r) => r && r.key === v);
            if (el) {
                el.values.push(x);
            } else {
                rv.push({key: v, values: [x]});
            }
            return rv;
        }, []);
    }


    const addPaquetev2 = (data) => {
        let paq = data
        /*if (validarPaquetes(paq)){
            paq.m_nIdPaquete = paq.m_nIdPaquete !== 0 ? paq.m_nIdPaquete : dataPaquetes.length + 1
            /!*paq.m_cyValorDeclarado = paq.m_cyValorDeclarado ? paq.m_cyValorDeclarado : 0
            if (paq.m_cyValorDeclarado === 0 && tieneSeguro){
                showSuccess("El campo de valor declarado es necesario para el seguro.")
                return
            }*!/

        }*/
        let arraynew = []
        let entra = false
        if (dataPaquetes.find(item => item.m_nIdPaquete === data.m_nIdPaquete)){//aqui entra en la modificacion
            dataPaquetes.forEach(item => {
                if (item.m_nIdPaquete === data.m_nIdPaquete){//verifica que tengan el mismo id
                     if(item.m_nCantidad !== data.m_nCantidad ||
                    item.m_nIdProducto !== data.m_nIdProducto ||
                    item.m_nIdTipo !== data.m_nIdTipo ||
                    item.m_nIdTipoEmbalaje !== data.m_nIdTipoEmbalaje ||
                    item.m_rAlto !== data.m_rAlto ||
                    item.m_rAncho !== data.m_rAncho ||
                    item.m_rLargo !== data.m_rLargo ||
                    item.m_rPeso !== data.m_rPeso ||
                    item.m_rVolumen !== data.m_rVolumen){

                        entra = true
                    }
                    item = data

                }
                arraynew=[...arraynew,item]
            })
            if(entra){
                seCalculaTarifa()
            }
        }else{//aqui solo agrega el paquete
            arraynew=dataPaquetes
            //dataPaquetes.push(paq)
            arraynew=[...arraynew,paq]
            /*dataPaquetes.forEach(item => {
                arraynew.push(item)
            })*/
            seCalculaTarifa()
        }
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

    const removerSeleccion=()=>{
        let paquetesFiltrados=dataPaquetes
        rowSelectionModel.forEach(id => {
            paquetesFiltrados=paquetesFiltrados.filter((paq)=>paq.m_nIdPaquete !== id) //m_nIdPaquete
        })
        setDataPaquetes(paquetesFiltrados)
        setRowSelectionModel([])
        setSeleccionable(false)
    }

    const pesoTotalKgPaquete = (paquete) => parseFloat(paquete.m_rPeso) * parseFloat(paquete.m_nCantidad)

    const pesoTotalVolPaquete = (paquete) => parseFloat(paquete.m_nCantidad) * parseFloat(paquete.m_rLargo) * parseFloat(paquete.m_rAncho) * parseFloat(paquete.m_rAlto) * factorConversion

    const pesoFinalPorProducto = (paquetes) =>
        tipoTarifa === TARIFA_POR_RANGOS ?
            paquetes.reduce((previousValue, currentValue) => previousValue + (pesoTotalKgPaquete(currentValue) > pesoTotalVolPaquete(currentValue) ? pesoTotalKgPaquete(currentValue) : pesoTotalVolPaquete(currentValue)),0)
            :
            paquetes.reduce((previousValue, currentValue) => previousValue + pesoTotalKgPaquete(currentValue),0)

    return(
        <div>
            <DialogoNuevoPaquete
                disabled={disabled || !cliente.m_nIdCliente}
                agregar={addPaquetev2}
                paquete={paquete}
                resetPaquete={resetPaquete}
                cliente={cliente}
                limpiarProducto={limpiarProducto}
            />
            <div className="widget-container">
                <div className="widget-content">
                    <div align={"right"}>
                        <Button onClick={() =>
                            confirmAlert({
                                    title: 'Confirmación',
                                    message: '¿Desea eliminar los paquetes seleccionados?',
                                    buttons: [
                                        {
                                            label: 'Sí',
                                            onClick: async () => removerSeleccion()
                                        },
                                        {
                                            label: 'No',
                                        }
                                    ]
                                }
                            )} className="btn btn-primary"
                            style={{
                                visibility: seleccionable ? 'visible' : 'hidden',
                                color: "white",
                                fontSize: "1em"
                            }}>
                            Borrar Selección
                        </Button>
                        {(dataPaquetes.length > 0 && !disabled) &&
                            <Button onClick={() => {
                                setSeleccionable(seleccionable ? false : true)
                                setRowSelectionModel([])
                            }} className="btn btn-secondary"
                                    style={{color: "white", marginLeft: "1%", marginRight: "2%", fontSize: "1em"}}>
                                {seleccionable ? 'Cancelar' : 'Seleccionar para Borrar'}
                            </Button>
                        }

                    </div>

                    {
                        dataPaquetes.length !== 0 &&
                        (
                            <div className="row">
                                <DataGrid
                                    onRowSelectionModelChange={(e) => {
                                        setRowSelectionModel(e);
                                    }}
                                    selectionModel={rowSelectionModel}
                                    localeText={dataGridLocaleText}
                                    checkboxSelection={seleccionable}
                                    density="compact"
                                    //pageSize={10}
                                    pageSizeOptions={[]}
                                    columns={columnsPaquetes}
                                    rows={dataPaquetes}
                                    rowCount={dataPaquetes.length}
                                    //autoPageSize
                                    getRowId={(row) => row.m_nIdPaquete}
                                />
                            </div>
                        )

                    }
                    {
                        (dataPaquetes.length > 0 && mostrarPesoFinal) &&
                        groupByArray(dataPaquetes, 'm_nIdProducto').map(i => (
                            <div>
                                Peso final de {i.values[0].m_sProducto}: {pesoFinalPorProducto(i.values).toFixed(2)}
                                <br/>
                            </div>
                        ))
                    }
                </div>
            </div>
        </div>
    )
}

export default Paquetes;